import { CashFlow, Instrument, AnalysisScenario } from '@/lib/types/financial';
import { calculateAccruedInterest, calculatePaymentAmount, interpolateRate } from './rates';

export function calculateYield(cashflows: CashFlow[], price: number): number {
  // Newton-Raphson method for yield calculation
  let yield_guess = 0.05; // Initial guess of 5%
  const max_iterations = 100;
  const tolerance = 0.0000001;

  for (let i = 0; i < max_iterations; i++) {
    let price_diff = -price;
    let deriv = 0;
    
    for (let j = 0; j < cashflows.length; j++) {
      const t = j / 12; // Assume monthly periods
      const df = Math.pow(1 + yield_guess, -t);
      price_diff += cashflows[j].netCashFlow * df;
      deriv += -t * cashflows[j].netCashFlow * df / (1 + yield_guess);
    }
    
    if (Math.abs(price_diff) < tolerance) {
      return yield_guess;
    }
    
    yield_guess = yield_guess - price_diff / deriv;
  }
  
  throw new Error('Yield calculation did not converge');
}

export function calculateDuration(cashflows: CashFlow[], yieldRate: number): number {
  let pv_sum = 0;
  let weighted_time = 0;
  
  for (let i = 0; i < cashflows.length; i++) {
    const t = i / 12; // Assume monthly periods
    const pv = cashflows[i].netCashFlow / Math.pow(1 + yieldRate, t);
    pv_sum += pv;
    weighted_time += t * pv;
  }
  
  return weighted_time / pv_sum;
}

export function calculateWAL(cashflows: CashFlow[]): number {
  let totalBalance = 0;
  let weightedTime = 0;
  
  for (let i = 0; i < cashflows.length; i++) {
    const t = i / 12; // Assume monthly periods
    const principal = cashflows[i].principal + (cashflows[i].prepayment || 0);
    totalBalance += principal;
    weightedTime += t * principal;
  }
  
  return weightedTime / totalBalance;
}

export function calculateIRR(cashflows: CashFlow[]): number {
  return calculateYield(cashflows, cashflows[0].netCashFlow);
}

export function projectCashflows(
  instrument: Instrument,
  scenario: AnalysisScenario
): CashFlow[] {
  const cashflows: CashFlow[] = [];
  let remainingBalance = instrument.currentBalance;
  let currentDate = new Date(instrument.dates.nextPayment);
  
  while (remainingBalance > 0 && currentDate <= instrument.dates.maturity) {
    const rate = scenario.assumptions.ratePath 
      ? interpolateRate(currentDate, scenario.assumptions.ratePath)
      : instrument.rate.value;
      
    const scheduledPayment = calculatePaymentAmount(
      remainingBalance,
      rate,
      getRemainingTermInMonths(currentDate, instrument.dates.maturity)
    );
    
    const interest = calculateAccruedInterest(remainingBalance, rate, 30); // Simplified 30-day month
    const principal = Math.min(scheduledPayment - interest, remainingBalance);
    
    // Apply scenario assumptions
    const prepayment = scenario.assumptions.prepaymentRate
      ? (remainingBalance * scenario.assumptions.prepaymentRate / 12)
      : 0;
      
    const defaultAmount = scenario.assumptions.defaultRate
      ? (remainingBalance * scenario.assumptions.defaultRate / 12)
      : 0;
      
    const recovery = defaultAmount && scenario.assumptions.recoveryRate
      ? (defaultAmount * scenario.assumptions.recoveryRate)
      : 0;
    
    const netCashFlow = principal + interest + prepayment + recovery;
    
    cashflows.push({
      date: new Date(currentDate),
      type: 'projected',
      principal,
      interest,
      prepayment,
      default: defaultAmount,
      recovery,
      netCashFlow,
    });
    
    remainingBalance -= (principal + prepayment + defaultAmount);
    currentDate = addMonths(currentDate, 1); // Simplified monthly periods
  }
  
  return cashflows;
}

// Helper functions
function getRemainingTermInMonths(startDate: Date, endDate: Date): number {
  return Math.ceil((endDate.getTime() - startDate.getTime()) / (30 * 24 * 60 * 60 * 1000));
}

function addMonths(date: Date, months: number): Date {
  const newDate = new Date(date);
  newDate.setMonth(date.getMonth() + months);
  return newDate;
}