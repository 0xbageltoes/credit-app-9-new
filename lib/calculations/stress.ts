import { CashFlow, AnalysisResults } from '@/lib/types/financial';
import { calculateYield, calculateDuration, calculateWAL, calculateIRR } from './index';

export function applyDefaultScenario(
  cashflows: CashFlow[],
  defaultRate: number
): CashFlow[] {
  return cashflows.map((cf) => {
    const defaultAmount = cf.principal * (defaultRate / 12);
    const newPrincipal = Math.max(0, cf.principal - defaultAmount);
    
    return {
      ...cf,
      principal: newPrincipal,
      default: defaultAmount,
      netCashFlow: newPrincipal + cf.interest + (cf.fees || 0),
    };
  });
}

export function applyPrepaymentScenario(
  cashflows: CashFlow[],
  prepayRate: number
): CashFlow[] {
  let remainingBalance = cashflows[0].principal;
  
  return cashflows.map((cf) => {
    const prepayment = remainingBalance * (prepayRate / 12);
    remainingBalance = Math.max(0, remainingBalance - (cf.principal + prepayment));
    
    return {
      ...cf,
      prepayment,
      netCashFlow: cf.principal + cf.interest + prepayment + (cf.fees || 0),
    };
  });
}

export function calculateStressedMetrics(
  cashflows: CashFlow[],
  stress: Record<string, number>
): AnalysisResults {
  // Apply stress scenarios
  let stressedCashflows = [...cashflows];
  
  if (stress.defaultRate) {
    stressedCashflows = applyDefaultScenario(stressedCashflows, stress.defaultRate);
  }
  
  if (stress.prepaymentRate) {
    stressedCashflows = applyPrepaymentScenario(stressedCashflows, stress.prepaymentRate);
  }
  
  // Calculate metrics
  const price = stressedCashflows[0].netCashFlow;
  const yieldRate = calculateYield(stressedCashflows, price);
  
  return {
    yield: yieldRate,
    duration: calculateDuration(stressedCashflows, yieldRate),
    wac: calculateWeightedAverageCoupon(stressedCashflows),
    wal: calculateWAL(stressedCashflows),
    irr: calculateIRR(stressedCashflows),
    cashflows: stressedCashflows,
    metrics: {
      totalPrincipal: sumCashflowComponent(stressedCashflows, 'principal'),
      totalInterest: sumCashflowComponent(stressedCashflows, 'interest'),
      totalPrepayment: sumCashflowComponent(stressedCashflows, 'prepayment'),
      totalDefault: sumCashflowComponent(stressedCashflows, 'default'),
      totalRecovery: sumCashflowComponent(stressedCashflows, 'recovery'),
    },
  };
}

// Helper functions
function calculateWeightedAverageCoupon(cashflows: CashFlow[]): number {
  let totalBalance = 0;
  let weightedInterest = 0;
  
  cashflows.forEach((cf) => {
    const balance = cf.principal + (cf.prepayment || 0);
    totalBalance += balance;
    weightedInterest += cf.interest;
  });
  
  return (weightedInterest * 12) / totalBalance; // Annualize the rate
}

function sumCashflowComponent(
  cashflows: CashFlow[],
  component: keyof CashFlow
): number {
  return cashflows.reduce((sum, cf) => sum + (cf[component] as number || 0), 0);
}