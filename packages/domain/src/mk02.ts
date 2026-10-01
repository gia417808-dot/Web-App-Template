export type ChienDichStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED';
export type ChiPhiStatus = 'DRAFT' | 'CONFIRMED' | 'CANCELLED';

export interface ChienDich {
  id: string;
  organization_id: string;
  code: string;
  name: string;
  start_date: string;
  end_date: string;
  budget_vnd: number;
  status: ChienDichStatus;
  revision: number;
}

export interface ChiPhi {
  id: string;
  organization_id: string;
  campaign_id: string;
  channel_id: string;
  business_date: string;
  amount_vnd: number;
  status: ChiPhiStatus;
}

export interface BudgetCalculationResult {
  value: string | null;
  error: string | null;
  is_over_budget: boolean;
}

export function calculateRemainingBudget(
  budget: number | string | null | undefined,
  confirmedCost: number | string | null | undefined
): BudgetCalculationResult {
  if (budget === null || budget === undefined || budget === '') {
    return {
      value: null,
      error: 'REQUIRED_FIELD',
      is_over_budget: false
    };
  }

  const numBudget = Number(budget);
  const numCost = confirmedCost !== null && confirmedCost !== undefined && confirmedCost !== '' ? Number(confirmedCost) : 0;

  if (isNaN(numBudget) || isNaN(numCost)) {
    return {
      value: null,
      error: 'INVALID_NUMBER',
      is_over_budget: false
    };
  }

  const remaining = numBudget - numCost;
  return {
    value: remaining.toString(),
    error: null,
    is_over_budget: remaining < 0
  };
}

export function canLockBudget(status: string): boolean {
  return status === 'ACTIVE';
}
