export function validateTransactionAmount(amountVnd: number): void {
  if (amountVnd <= 0) {
    throw new Error('Transaction amount must be strictly positive (amount_vnd > 0)');
  }
}

export function isPeriodLocked(businessDateStr: string, lockedPeriods: { start_date: string, end_date: string }[]): boolean {
  const businessDate = new Date(businessDateStr);
  return lockedPeriods.some(period => {
    const start = new Date(period.start_date);
    const end = new Date(period.end_date);
    return businessDate >= start && businessDate <= end;
  });
}
