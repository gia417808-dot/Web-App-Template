export function calculateTargetProgress(confirmed_revenue_vnd: number, target_vnd: number): number {
  if (target_vnd < 0) {
    throw new Error('Target must be positive');
  }
  if (target_vnd === 0) {
    return confirmed_revenue_vnd > 0 ? 100 : 0;
  }
  if (confirmed_revenue_vnd < 0) {
    throw new Error('Confirmed revenue cannot be negative');
  }
  return (confirmed_revenue_vnd / target_vnd) * 100;
}
