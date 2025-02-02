export function interpolateRate(
  date: Date,
  ratePath: Array<{ date: Date; rate: number }>
): number {
  const sortedPath = [...ratePath].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // If date is before first point, return first rate
  if (date < sortedPath[0].date) {
    return sortedPath[0].rate;
  }
  
  // If date is after last point, return last rate
  if (date > sortedPath[sortedPath.length - 1].date) {
    return sortedPath[sortedPath.length - 1].rate;
  }
  
  // Find surrounding points
  for (let i = 0; i < sortedPath.length - 1; i++) {
    if (date >= sortedPath[i].date && date <= sortedPath[i + 1].date) {
      const t1 = sortedPath[i].date.getTime();
      const t2 = sortedPath[i + 1].date.getTime();
      const t = date.getTime();
      
      const r1 = sortedPath[i].rate;
      const r2 = sortedPath[i + 1].rate;
      
      // Linear interpolation
      return r1 + (r2 - r1) * (t - t1) / (t2 - t1);
    }
  }
  
  throw new Error('Rate interpolation failed');
}

export function calculatePaymentAmount(
  balance: number,
  rate: number,
  term: number
): number {
  const monthlyRate = rate / 12;
  const denominator = 1 - Math.pow(1 + monthlyRate, -term);
  
  if (denominator === 0) {
    return balance;
  }
  
  return (balance * monthlyRate) / denominator;
}

export function calculateAccruedInterest(
  balance: number,
  rate: number,
  days: number
): number {
  return balance * rate * days / 360; // Using 360-day year convention
}