export function calculateExpectedValue(value_vnd: number, probability_pct: number, status: string): number {
  if (value_vnd < 0) throw new Error('Value cannot be negative');
  if (probability_pct < 0 || probability_pct > 100) throw new Error('Probability must be between 0 and 100');
  
  if (status === 'LOST') return 0;
  if (status === 'WON') return value_vnd;
  
  return value_vnd * (probability_pct / 100);
}
