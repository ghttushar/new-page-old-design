import { PROTOTYPE_ALERTS, type PrototypeAlert } from '@/constants/signals/prototype-data';

// The numbers behind the Signals widgets, worked out from the sample alerts.

export type Period = 'today' | 'yesterday' | 'both';
export type Market = 'all' | 'amazon' | 'walmart';
export type ValueSide = 'risk' | 'opportunity';

export interface AlertFilter {
  period: Period;
  market: Market;
  /** Empty means every category. */
  categories: string[];
}

const inPeriod = (a: PrototypeAlert, p: Period) => p === 'both' || a.day === p;
const inMarket = (a: PrototypeAlert, m: Market) => m === 'all' || a.mpBrand === m || Boolean(a.mpBrands?.includes(m));
const inCategories = (a: PrototypeAlert, c: string[]) => c.length === 0 || c.includes(a.category);

export function alertsFor(f: AlertFilter): PrototypeAlert[] {
  return PROTOTYPE_ALERTS.filter((a) => inPeriod(a, f.period) && inMarket(a, f.market) && inCategories(a, f.categories));
}

const sideOf = (a: PrototypeAlert): ValueSide | null => (a.hideValue || a.valueNum === 0 ? null : a.valueNum < 0 ? 'risk' : 'opportunity');

/** Categories that carry money on either side, most common first. */
export const VALUE_CATEGORIES: string[] = (() => {
  const counts = new Map<string, number>();
  PROTOTYPE_ALERTS.forEach((a) => { if (sideOf(a)) counts.set(a.category, (counts.get(a.category) ?? 0) + 1); });
  return [...counts.entries()].sort((x, y) => y[1] - x[1]).map(([c]) => c);
})();

export const ALERT_CATEGORIES: string[] = (() => {
  const counts = new Map<string, number>();
  PROTOTYPE_ALERTS.forEach((a) => counts.set(a.category, (counts.get(a.category) ?? 0) + 1));
  return [...counts.entries()].sort((x, y) => y[1] - x[1]).map(([c]) => c);
})();

export interface ValueSummary {
  total: number;
  count: number;
  /** Each category's share of the total, largest first. */
  shares: { category: string; value: number; share: number }[];
  /** The same total for the previous day, when the period is a single day. */
  previous: number | null;
}

function sum(list: PrototypeAlert[]): number {
  return list.reduce((s, a) => s + Math.abs(a.valueNum), 0);
}

export function valueSummary(side: ValueSide, f: AlertFilter): ValueSummary {
  const list = alertsFor(f).filter((a) => sideOf(a) === side);
  const total = sum(list);
  const byCat = new Map<string, number>();
  list.forEach((a) => byCat.set(a.category, (byCat.get(a.category) ?? 0) + Math.abs(a.valueNum)));
  const shares = [...byCat.entries()]
    .map(([category, value]) => ({ category, value, share: total > 0 ? value / total : 0 }))
    .sort((x, y) => y.value - x.value);
  const previous = f.period === 'today'
    ? sum(alertsFor({ ...f, period: 'yesterday' }).filter((a) => sideOf(a) === side))
    : null;
  return { total, count: list.length, shares, previous };
}

/** "07:04 AM" as minutes after midnight; anything else (an older date) sorts last. */
export function clockMinutes(time: string): number {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  if (!m) return -1;
  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === 'PM') h += 12;
  return h * 60 + Number(m[2]);
}

export type PriorityFilter = 'all' | 'high' | 'medium-up';

/** Alerts that came in since the last visit (today's), newest first. */
export function arrivalsSinceLastVisit(priority: PriorityFilter, categories: string[]): PrototypeAlert[] {
  return PROTOTYPE_ALERTS
    .filter((a) => a.day === 'today')
    .filter((a) => priority === 'all' || (priority === 'high' ? a.priority === 'High' : a.priority === 'High' || a.priority === 'Medium'))
    .filter((a) => inCategories(a, categories))
    .map((a, i) => ({ a, i }))
    .sort((x, y) => clockMinutes(y.a.time) - clockMinutes(x.a.time) || x.i - y.i)
    .map(({ a }) => a);
}

/** $84.2K style for headline numbers. */
export function money(n: number): string {
  const abs = Math.abs(n);
  if (abs < 1000) return `$${Math.round(abs).toLocaleString()}`;
  if (abs < 1_000_000) return `$${(abs / 1000).toFixed(abs < 100_000 ? 1 : 0).replace(/\.0$/, '')}K`;
  return `$${(abs / 1_000_000).toFixed(2)}M`;
}

/** The hour a clock time falls in, for grouping a feed ("7 AM"). */
export function hourBucket(time: string): string {
  const mins = clockMinutes(time);
  if (mins < 0) return 'Earlier';
  const h = Math.floor(mins / 60);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12} ${h < 12 ? 'AM' : 'PM'}`;
}
