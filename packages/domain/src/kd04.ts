export function calculateContractStatus(expiry_date: string | Date, status: string, today: Date = new Date()): { days_remaining: number; should_remind: boolean } {
  if (status === 'TERMINATED') {
    return { days_remaining: 0, should_remind: false };
  }
  
  const expiry = new Date(expiry_date);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Remind if <= 30 days remaining and not terminated
  return { 
    days_remaining: diffDays, 
    should_remind: diffDays <= 30 
  };
}
