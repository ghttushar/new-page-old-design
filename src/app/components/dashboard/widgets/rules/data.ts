// Rules measurement data. Every figure is worked out from the same daily drivers (impressions, CTR, CPC, CVR,
// order value), so ROAS, ACOS, spend and sales always agree with each other. The numbers are seeded, so they stay
// the same between refreshes and a 7-day window is the tail of the 30-day one.

export type MetricId = 'roas' | 'acos' | 'spend' | 'sales' | 'ctr' | 'cpc' | 'cvr' | 'impressions' | 'clicks' | 'units';

export interface MetricDef {
  id: MetricId;
  label: string;
  format: 'x' | 'pct' | 'money' | 'count';
  /** Which way is good. Spend counts as better when lower, the way the rules team reads it. */
  better: 'up' | 'down';
}

export const METRICS: MetricDef[] = [
  { id: 'roas', label: 'ROAS', format: 'x', better: 'up' },
  { id: 'acos', label: 'ACOS', format: 'pct', better: 'down' },
  { id: 'spend', label: 'Ad spend', format: 'money', better: 'down' },
  { id: 'sales', label: 'Ad sales', format: 'money', better: 'up' },
  { id: 'ctr', label: 'CTR', format: 'pct', better: 'up' },
  { id: 'cpc', label: 'CPC', format: 'money', better: 'down' },
  { id: 'cvr', label: 'CVR', format: 'pct', better: 'up' },
  { id: 'impressions', label: 'Impressions', format: 'count', better: 'up' },
  { id: 'clicks', label: 'Clicks', format: 'count', better: 'up' },
  { id: 'units', label: 'Units sold', format: 'count', better: 'up' },
];

export const METRIC = Object.fromEntries(METRICS.map((m) => [m.id, m])) as Record<MetricId, MetricDef>;

/** The metrics two rules of the same type are compared on. */
export const RULE_COMPARE_METRICS: MetricId[] = ['spend', 'roas', 'acos', 'cvr', 'ctr'];

export type RangeId = '7' | '14' | '30' | '60';
export const RANGE_DAYS: Record<RangeId, number> = { '7': 7, '14': 14, '30': 30, '60': 60 };

// ── Rules and templates ─────────────────────────────────────────────────────────────────────

export type RuleType = 'bidding' | 'budget' | 'daypart' | 'harvest';

export const RULE_TYPES: { id: RuleType; label: string }[] = [
  { id: 'bidding', label: 'Bidding strategy' },
  { id: 'budget', label: 'Budget pacing' },
  { id: 'daypart', label: 'Dayparting' },
  { id: 'harvest', label: 'Keyword harvesting' },
];

export interface Drivers { imp: number; ctr: number; cpc: number; cvr: number; aov: number }
type Lift = Partial<Record<keyof Drivers, number>>;

export interface RuleDef {
  id: string;
  type: RuleType;
  name: string;
  kind: 'Rule' | 'Template';
  detail: string;
  /** How the rule bends the drivers against an account without it. */
  profile: Lift;
}

export const RULES: RuleDef[] = [
  { id: 'bid-conservative', type: 'bidding', name: 'Conservative', kind: 'Template', detail: 'Bids down 8% when ACOS is above 20%', profile: { imp: 0.94, ctr: 1, cpc: 0.91, cvr: 0.97 } },
  { id: 'bid-aggressive', type: 'bidding', name: 'Aggressive', kind: 'Template', detail: 'Bids up 15% on any converting target', profile: { imp: 1.3, ctr: 1.04, cpc: 1.19, cvr: 1.1 } },
  { id: 'bid-balanced', type: 'bidding', name: 'Balanced', kind: 'Template', detail: 'Moves bids 5% toward a 22% ACOS', profile: { imp: 1.08, ctr: 1.02, cpc: 1.01, cvr: 1.03 } },
  { id: 'bid-target-acos', type: 'bidding', name: 'Target ACOS 22%', kind: 'Rule', detail: 'Applied to 14 campaigns', profile: { imp: 1.02, ctr: 1.01, cpc: 0.96, cvr: 1.02 } },
  { id: 'bud-even', type: 'budget', name: 'Even pacing', kind: 'Template', detail: 'Spreads the daily budget across 24 hours', profile: { imp: 0.98, ctr: 1, cpc: 0.97, cvr: 1.01 } },
  { id: 'bud-frontload', type: 'budget', name: 'Front-load mornings', kind: 'Template', detail: '60% of budget before 2 PM', profile: { imp: 1.1, ctr: 1.02, cpc: 1.06, cvr: 1.04 } },
  { id: 'bud-pause-90', type: 'budget', name: 'Pause at 90% spend', kind: 'Rule', detail: 'Applied to 9 campaigns', profile: { imp: 0.9, ctr: 1, cpc: 0.98, cvr: 1.02 } },
  { id: 'dp-boost', type: 'daypart', name: 'Daypart Bid Boost', kind: 'Rule', detail: '+20% bids from 6 to 11 PM', profile: { imp: 1.12, ctr: 1.05, cpc: 0.95, cvr: 1.14 } },
  { id: 'dp-weekend', type: 'daypart', name: 'Weekend lift', kind: 'Template', detail: '+12% bids on Saturday and Sunday', profile: { imp: 1.07, ctr: 1.02, cpc: 1.03, cvr: 1.05 } },
  { id: 'dp-overnight', type: 'daypart', name: 'Overnight pullback', kind: 'Rule', detail: '−30% bids from 1 to 6 AM', profile: { imp: 0.93, ctr: 1.01, cpc: 0.92, cvr: 1.03 } },
  { id: 'hv-converting', type: 'harvest', name: 'Harvest converting terms', kind: 'Rule', detail: '2+ orders moves a term to Exact', profile: { imp: 1.05, ctr: 1.06, cpc: 0.97, cvr: 1.12 } },
  { id: 'hv-negate', type: 'harvest', name: 'Negate zero-sale terms', kind: 'Rule', detail: '15 clicks and no sale negates the term', profile: { imp: 0.95, ctr: 1.03, cpc: 0.99, cvr: 1.09 } },
  { id: 'hv-strict', type: 'harvest', name: 'Strict negation', kind: 'Template', detail: '8 clicks and no sale negates the term', profile: { imp: 0.88, ctr: 1.04, cpc: 1, cvr: 1.11 } },
];

export const RULE = Object.fromEntries(RULES.map((r) => [r.id, r])) as Record<string, RuleDef>;
export const rulesOfType = (type: RuleType) => RULES.filter((r) => r.type === type);

// ── Entities ────────────────────────────────────────────────────────────────────────────────

export type EntityType = 'campaign' | 'keyword' | 'target' | 'asin';

export const ENTITY_TYPES: { id: EntityType; label: string }[] = [
  { id: 'campaign', label: 'Campaign' },
  { id: 'keyword', label: 'Keyword' },
  { id: 'target', label: 'Target' },
  { id: 'asin', label: 'ASIN' },
];

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  detail: string;
  /** The rule running on it. */
  ruleId: string;
}

const e = (type: EntityType, id: string, name: string, detail: string, ruleId: string): Entity => ({ id, type, name, detail, ruleId });

export const ENTITIES: Entity[] = [
  e('campaign', 'c-summer', 'Summer Push', 'SP · Manual · 42 targets', 'dp-boost'),
  e('campaign', 'c-bars-exact', 'Protein Bars – Exact', 'SP · Manual · 18 keywords', 'bid-target-acos'),
  e('campaign', 'c-whey-brand', 'Whey Isolate – Brand defense', 'SB · Manual · 9 keywords', 'bid-conservative'),
  e('campaign', 'c-creatine-comp', 'Creatine – Competitor conquest', 'SP · Manual · 26 targets', 'bid-aggressive'),
  e('campaign', 'c-shaker-auto', 'Shaker Bottles – Auto', 'SP · Auto', 'hv-converting'),
  e('campaign', 'c-electro-launch', 'Electrolytes – New launch', 'SP · Manual · 31 keywords', 'bud-frontload'),
  e('keyword', 'k-whey-isolate', 'whey protein isolate', 'Exact · Whey Isolate – Brand defense', 'bid-conservative'),
  e('keyword', 'k-bars-lowsugar', 'protein bars low sugar', 'Phrase · Protein Bars – Exact', 'bid-target-acos'),
  e('keyword', 'k-creatine', 'creatine monohydrate', 'Exact · Creatine – Competitor conquest', 'bid-aggressive'),
  e('keyword', 'k-preworkout', 'pre workout', 'Broad · Summer Push', 'dp-boost'),
  e('keyword', 'k-shaker', 'boldfit shaker bottle', 'Exact · Shaker Bottles – Auto', 'hv-converting'),
  e('keyword', 'k-electrolyte', 'electrolyte powder sugar free', 'Phrase · Electrolytes – New launch', 'bud-frontload'),
  e('target', 't-sports-nutrition', 'Category: Sports Nutrition', 'Category · Summer Push', 'dp-boost'),
  e('target', 't-mb-whey', 'Similar to MuscleBlaze Whey', 'Product · Creatine – Competitor conquest', 'bid-aggressive'),
  e('target', 't-bars-4star', 'Category: Protein Bars, 4★ and up', 'Category · Protein Bars – Exact', 'bid-target-acos'),
  e('target', 't-on-brand', 'Brand: Optimum Nutrition', 'Brand · Whey Isolate – Brand defense', 'bid-conservative'),
  e('target', 't-shakers', 'Category: Shaker Bottles', 'Category · Shaker Bottles – Auto', 'hv-negate'),
  e('target', 't-b08xq7', 'ASIN B08XQ7LMNP', 'Competitor product · Electrolytes – New launch', 'dp-weekend'),
  e('asin', 'a-whey-1kg', 'B07ZK4R9WQ', 'Whey Isolate, 1 kg, Chocolate', 'bid-conservative'),
  e('asin', 'a-bars-12', 'B09LMN2T6Q', 'Protein Bars, pack of 12', 'bid-target-acos'),
  e('asin', 'a-creatine-250', 'B08HZK3V1P', 'Creatine Monohydrate, 250 g', 'bid-aggressive'),
  e('asin', 'a-shaker-700', 'B0BQ7XWJ2R', 'Shaker Bottle, 700 ml', 'hv-converting'),
  e('asin', 'a-electro-30', 'B0CF5R8NKD', 'Electrolyte Sachets, 30 count', 'bud-frontload'),
  e('asin', 'a-preworkout', 'B0B2TQ9MZL', 'Pre-Workout, 300 g, Watermelon', 'dp-boost'),
];

export const ENTITY = Object.fromEntries(ENTITIES.map((x) => [x.id, x])) as Record<string, Entity>;

// ── Series ──────────────────────────────────────────────────────────────────────────────────

/** One day of totals. Ratios are worked out from these, never averaged. */
export interface DayTotals { imp: number; clicks: number; spend: number; sales: number; orders: number; units: number }
export interface Day { date: Date; totals: DayTotals }

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

/** A small seeded random source (mulberry32), so every series is stable across refreshes. */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BASE: Record<EntityType | 'portfolio', Drivers> = {
  campaign: { imp: 62000, ctr: 0.0042, cpc: 0.92, cvr: 0.108, aov: 34 },
  keyword: { imp: 9000, ctr: 0.0068, cpc: 1.08, cvr: 0.124, aov: 33 },
  target: { imp: 14000, ctr: 0.0036, cpc: 0.74, cvr: 0.086, aov: 31 },
  asin: { imp: 21000, ctr: 0.0047, cpc: 0.88, cvr: 0.112, aov: 36 },
  portfolio: { imp: 80000, ctr: 0.0055, cpc: 0.95, cvr: 0.115, aov: 33 },
};

/** The entity's own level: its type's base, nudged up to 20% either way. */
export function driversFor(id: string, type: EntityType | 'portfolio'): Drivers {
  const r = seeded(hash(`drivers|${id}`));
  const b = BASE[type];
  const v = () => 0.8 + r() * 0.4;
  return { imp: b.imp * v(), ctr: b.ctr * v(), cpc: b.cpc * v(), cvr: b.cvr * v(), aov: b.aov * (0.9 + r() * 0.2) };
}

/** What the rule does to this entity. Most rules help; the odd one (pre workout) costs more than it brings in. */
function liftFor(entity: Entity): Lift {
  const rule = RULE[entity.ruleId];
  const r = seeded(hash(`lift|${entity.id}`));
  const jitter = (x = 1) => 1 + ((x - 1) * (0.6 + r() * 0.8));
  if (entity.id === 'k-preworkout') return { imp: 1.16, ctr: 0.97, cpc: 1.14, cvr: 0.93 };
  return { imp: jitter(rule?.profile.imp), ctr: jitter(rule?.profile.ctr), cpc: jitter(rule?.profile.cpc), cvr: jitter(rule?.profile.cvr) };
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
}

/**
 * A daily series ending today. Each day is seeded on its own, so shorter windows are the tail of longer ones.
 * `ramp` eases the lift in over the first part of the window, the way a rule's effect builds after it switches on.
 */
export function series(salt: string, drivers: Drivers, days: number, lift: Lift = {}, ramp = false): Day[] {
  const out: Day[] = [];
  const phase = hash(salt) % 7;
  for (let back = days - 1; back >= 0; back--) {
    const r = seeded(hash(`${salt}|${back}`));
    const t = days - 1 - back;
    const k = ramp ? Math.min(1, 0.3 + (0.7 * t) / Math.max(1, (days - 1) * 0.6)) : 1;
    const m = (key: keyof Drivers) => 1 + ((lift[key] ?? 1) - 1) * k;
    const week = 1 + 0.08 * Math.sin(((back + phase) * 2 * Math.PI) / 7);
    const imp = drivers.imp * week * (1 + (r() - 0.5) * 0.14) * m('imp');
    const ctr = drivers.ctr * (1 + (r() - 0.5) * 0.1) * m('ctr');
    const cpc = drivers.cpc * (1 + (r() - 0.5) * 0.08) * m('cpc');
    const cvr = drivers.cvr * (1 + (r() - 0.5) * 0.14) * m('cvr');
    const clicks = imp * ctr;
    const orders = clicks * cvr;
    out.push({
      date: daysAgo(back),
      totals: { imp, clicks, spend: clicks * cpc, sales: orders * drivers.aov, orders, units: orders * 1.12 },
    });
  }
  return out;
}

/** An entity with its rule on (the current window), or its baseline without the rule (the window before it). */
export function entitySeries(entityId: string, mode: 'with' | 'without', range: RangeId): Day[] {
  const entity = ENTITY[entityId] ?? ENTITIES[0];
  const drivers = driversFor(entity.id, entity.type);
  return mode === 'with'
    ? series(`${entity.id}|with`, drivers, RANGE_DAYS[range], liftFor(entity), true)
    : series(`${entity.id}|base`, drivers, RANGE_DAYS[range]);
}

/** The account's results under one rule or template. */
export function ruleSeries(ruleId: string, range: RangeId): Day[] {
  const rule = RULE[ruleId] ?? RULES[0];
  return series(`rule|${rule.id}`, driversFor('portfolio', 'portfolio'), RANGE_DAYS[range], rule.profile);
}

// ── Reading metrics ─────────────────────────────────────────────────────────────────────────

export function sumDays(days: Day[]): DayTotals {
  return days.reduce<DayTotals>(
    (a, d) => ({ imp: a.imp + d.totals.imp, clicks: a.clicks + d.totals.clicks, spend: a.spend + d.totals.spend, sales: a.sales + d.totals.sales, orders: a.orders + d.totals.orders, units: a.units + d.totals.units }),
    { imp: 0, clicks: 0, spend: 0, sales: 0, orders: 0, units: 0 },
  );
}

export function metricOf(t: DayTotals, id: MetricId): number {
  switch (id) {
    case 'roas': return t.spend ? t.sales / t.spend : 0;
    case 'acos': return t.sales ? (t.spend / t.sales) * 100 : 0;
    case 'spend': return t.spend;
    case 'sales': return t.sales;
    case 'ctr': return t.imp ? (t.clicks / t.imp) * 100 : 0;
    case 'cpc': return t.clicks ? t.spend / t.clicks : 0;
    case 'cvr': return t.clicks ? (t.orders / t.clicks) * 100 : 0;
    case 'impressions': return t.imp;
    case 'clicks': return t.clicks;
    case 'units': return t.units;
    default: return 0;
  }
}

/** Percent change from B to A. */
export const changePct = (a: number, b: number) => (b === 0 ? 0 : ((a - b) / b) * 100);

/** Whether A did better than B on this metric, given which way is good. Within 0.5% counts as even. */
export function verdict(a: number, b: number, id: MetricId): 'a' | 'b' | 'even' {
  const c = changePct(a, b);
  if (Math.abs(c) < 0.5) return 'even';
  const aHigher = c > 0;
  return (METRIC[id].better === 'up') === aHigher ? 'a' : 'b';
}

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

export function formatMetric(value: number, id: MetricId, opts: { short?: boolean } = {}): string {
  const f = METRIC[id].format;
  if (f === 'x') return `${value.toFixed(1)}x`;
  if (f === 'pct') return `${value.toFixed(value < 1 ? 2 : 1)}%`;
  if (f === 'money') {
    if (value < 100) return `$${value.toFixed(2)}`;
    if (opts.short && value >= 10000) return `$${compact.format(value)}`;
    return `$${Math.round(value).toLocaleString('en-US')}`;
  }
  return value >= 10000 ? compact.format(value) : Math.round(value).toLocaleString('en-US');
}

export const shortDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
