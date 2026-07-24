import type { Decision } from '@/constants/signals/decisions.constants';

export type Lifecycle =
  | 'needs_me'
  | 'needs_review'
  | 'watching'
  | 'aan_working'
  | 'completed_today'
  | 'history';

export function lifecycleFor(d: Decision): Lifecycle {
  if (d.status === 'open') {
    if (d.severity === 'critical') return 'needs_me';
    if (d.severity === 'opportunity') return 'needs_review';
    return 'watching';
  }
  if (d.status === 'with_aan' || d.status === 'in_flight') return 'aan_working';
  if (d.status === 'snoozed') return 'watching';
  const today = new Date().toDateString();
  const upd = new Date(d.updatedAt).toDateString();
  if ((d.status === 'completed' || d.status === 'rejected') && today === upd) {
    return 'completed_today';
  }
  return 'history';
}

export function importanceScore(d: Decision): number {
  const revenue = Math.min(Math.abs(d.valueCents) / 100, 100_000);
  const ageHrs = (Date.now() - d.createdAt) / 3_600_000;
  const deadline = Math.max(0, 48 - ageHrs);
  const risk = d.severity === 'critical' ? 5000 : d.severity === 'opportunity' ? 1500 : 0;
  const waiting = d.status === 'open' ? 3000 : 0;
  const info = d.severity === 'fyi' ? 100 : 0;
  return revenue * 4 + deadline * 50 + risk + waiting + info;
}

const VERBS: Record<string, string[]> = {
  campaign: ['Analyzing bid pacing…', 'Recalculating budget curve…', 'Watching competitor spend…'],
  retail: ['Reconciling BuyBox share…', 'Watching price parity…', 'Refreshing catalog stats…'],
  profitability: ['Recomputing margin…', 'Waiting on cost import…', 'Auditing fee ledger…'],
  inventory: ['Refreshing days-of-cover…', 'Waiting on supplier reply…', 'Watching stockout risk…'],
  cs: ['Drafting seller reply…', 'Reading last 40 tickets…', 'Waiting for buyer response…'],
  buyer: ['Reviewing buyer trend…', 'Cross-checking cohorts…', 'Watching return rate…'],
};

export function livingStatusPhrase(domain: string, tick: number): string {
  const list = VERBS[domain] || ['Working on it…'];
  return list[tick % list.length];
}
