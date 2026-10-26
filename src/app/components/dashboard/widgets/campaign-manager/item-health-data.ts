import { PROTOTYPE_ALERTS, type AlertPriority } from '@/constants/signals/prototype-data';

// Item health sample data. The items are the ones named on the Signals alerts, so an item's alerts are real ones;
// every other figure is seeded from the item id, so it stays the same between refreshes.

export interface HealthItem {
  id: string;
  name: string;
  /** 0 to 100. */
  listingQuality: number;
  inStock: boolean;
  availableToday: number;
  available7d: number;
  buyBoxToday: number;
  buyBox7d: number;
}

export interface ItemAlert { id: string; title: string; priority: AlertPriority; category: string }

export type HealthBand = 'healthy' | 'attention' | 'critical';

/** A stable number from 0 to 1 for an id and a salt. */
function unit(id: string, salt: string): number {
  let h = 2166136261;
  const s = `${salt}|${id}`;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967296;
}

const between = (id: string, salt: string, lo: number, hi: number) => Math.round(lo + unit(id, salt) * (hi - lo));

/**
 * A real catalogue is mostly fine with a tail of problems: about half the items are strong, a third are middling, and
 * the rest are weak, a few of them out of stock.
 */
function itemFor(id: string, name: string): HealthItem {
  const draw = unit(id, 'profile');
  const profile = draw < 0.5 ? 'strong' : draw < 0.83 ? 'middling' : 'weak';
  const inStock = profile !== 'weak' || unit(id, 'stock') > 0.5;
  const [qLo, qHi, aLo, bLo, bHi] = profile === 'strong' ? [86, 99, 95, 86, 99] : profile === 'middling' ? [66, 88, 82, 58, 84] : [42, 70, 60, 25, 60];
  const availableToday = inStock ? between(id, 'avail-today', aLo, 100) : 0;
  return {
    id,
    name,
    listingQuality: between(id, 'quality', qLo, qHi),
    inStock,
    availableToday,
    // A week smooths the day: an item out today was still up for part of the week.
    available7d: inStock ? Math.min(100, Math.max(availableToday - 5, between(id, 'avail-7d', aLo, 100))) : between(id, 'avail-7d-out', 25, 60),
    buyBoxToday: inStock ? between(id, 'bb-today', bLo, bHi) : 0,
    buyBox7d: between(id, 'bb-7d', inStock ? bLo : 10, inStock ? bHi : 45),
  };
}

/** Every product named on a Signals alert, once each. Alerts also list campaigns (ids like CMP-…); those are left out. */
export const HEALTH_ITEMS: HealthItem[] = (() => {
  const seen = new Map<string, string>();
  PROTOTYPE_ALERTS.forEach((a) => a.items.forEach((i) => {
    if (/^B0/.test(i.sku) && !seen.has(i.sku) && !i.name.includes('(dup?)')) seen.set(i.sku, i.name);
  }));
  return [...seen.entries()].map(([id, name]) => itemFor(id, name)).sort((x, y) => x.name.localeCompare(y.name));
})();

export const HEALTH_ITEM = Object.fromEntries(HEALTH_ITEMS.map((i) => [i.id, i])) as Record<string, HealthItem>;

/** The Signals alerts that name this item, highest priority first. */
export function alertsFor(id: string): ItemAlert[] {
  const rank: Record<AlertPriority, number> = { High: 0, Medium: 1, Low: 2 };
  return PROTOTYPE_ALERTS
    .filter((a) => a.items.some((i) => i.sku === id))
    .map((a) => ({ id: a.id, title: a.title, priority: a.priority, category: a.category }))
    .sort((x, y) => rank[x.priority] - rank[y.priority]);
}

/**
 * 0 to 100: listing quality 30%, availability 30% and Buy Box win rate 30% (each half today, half the last 7 days),
 * and the last 10% only when the item is in stock with no open alerts.
 */
export function healthOf(item: HealthItem): number {
  const availability = (item.availableToday + item.available7d) / 2;
  const buyBox = (item.buyBoxToday + item.buyBox7d) / 2;
  const clean = item.inStock && alertsFor(item.id).length === 0 ? 100 : 0;
  return Math.round(item.listingQuality * 0.3 + availability * 0.3 + buyBox * 0.3 + clean * 0.1);
}

export const bandOf = (score: number): HealthBand => (score >= 80 ? 'healthy' : score >= 50 ? 'attention' : 'critical');

export const BAND_LABEL: Record<HealthBand, string> = { healthy: 'Healthy', attention: 'Needs attention', critical: 'Critical' };

/** The average health of a set of items, and how many fall in each band. */
export function totalHealth(items: HealthItem[]): { score: number; counts: Record<HealthBand, number> } {
  const counts: Record<HealthBand, number> = { healthy: 0, attention: 0, critical: 0 };
  if (items.length === 0) return { score: 0, counts };
  let sum = 0;
  items.forEach((i) => { const s = healthOf(i); sum += s; counts[bandOf(s)] += 1; });
  return { score: Math.round(sum / items.length), counts };
}

// ── New opportunities ───────────────────────────────────────────────────────────────────────
// High quality items that aren't advertised yet: healthy (80+), in stock, and in no campaign. Their last 30 days of
// organic sales show what advertising them could build on.

export interface OpportunityItem extends HealthItem {
  /** Units sold over the last 30 days. */
  units30: number;
  /** Gross merchandise value over the last 30 days. */
  gmv30: number;
}

/** Whether the item is already in a campaign; about half the catalogue is. */
const isAdvertised = (id: string) => unit(id, 'advertised') > 0.45;

export const OPPORTUNITY_ITEMS: OpportunityItem[] = HEALTH_ITEMS
  .filter((i) => i.inStock && healthOf(i) >= 80 && !isAdvertised(i.id))
  .map((i) => {
    const units30 = between(i.id, 'units-30', 60, 900);
    const price = between(i.id, 'price', 14, 58) + 0.99;
    return { ...i, units30, gmv30: Math.round(units30 * price) };
  });

/** The consolidated figures: how many items, and their average units and GMV per item over the last 30 days. */
export function opportunityTotals(items: OpportunityItem[] = OPPORTUNITY_ITEMS) {
  const units = items.reduce((s, i) => s + i.units30, 0);
  const gmv = items.reduce((s, i) => s + i.gmv30, 0);
  const count = items.length;
  return { count, avgUnits: count ? units / count : 0, avgGmv: count ? gmv / count : 0 };
}
