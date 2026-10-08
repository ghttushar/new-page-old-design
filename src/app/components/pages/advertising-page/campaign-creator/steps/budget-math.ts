import type { CcCampaign, CcProduct } from '../campaign-creator.types';

// Section 8.4: how the daily budget is spread over the new campaigns. The total has to match the overall budget.

export const round2 = (n: number): number => Math.round(n * 100) / 100;

/** Allocated minus the overall budget, to the cent. Zero means the plan adds up. */
export const allocationGap = (campaigns: CcCampaign[], overall: number): number => round2(campaigns.reduce((s, c) => s + c.dailyBudget, 0) - overall);
export const allocationMatches = (campaigns: CcCampaign[], overall: number): boolean => Math.abs(allocationGap(campaigns, overall)) < 0.005;

/** Each campaign's share is its part of the overall budget, so the shares only reach 100% when the plan adds up. */
export function withShares(campaigns: CcCampaign[], overall: number): CcCampaign[] {
  return campaigns.map((c) => ({ ...c, budgetAllocationPct: overall > 0 ? Math.round((c.dailyBudget / overall) * 1000) / 10 : 0 }));
}

/** Splits `budget` across the weights to the cent; the rounding remainder goes to the heaviest campaign. */
export function allocateByWeights(campaigns: CcCampaign[], weights: number[], budget: number): CcCampaign[] {
  if (campaigns.length === 0) return campaigns;
  const sum = weights.reduce((s, w) => s + w, 0) || 1;
  const cents = weights.map((w) => Math.floor((budget * 100 * w) / sum));
  const remainder = Math.round(budget * 100) - cents.reduce((s, n) => s + n, 0);
  cents[weights.indexOf(Math.max(...weights))] += remainder;
  return withShares(campaigns.map((c, i) => ({ ...c, dailyBudget: cents[i] / 100 })), budget);
}

/** Mock "performance": campaigns holding lower-ACOS products get more. */
export function performanceWeight(c: CcCampaign, products: CcProduct[]): number {
  const own = products.filter((p) => c.productIds.includes(p.id));
  if (own.length === 0) return 1;
  return own.reduce((s, p) => s + 1 / (p.acos > 0 ? p.acos : 30), 0) / own.length;
}
