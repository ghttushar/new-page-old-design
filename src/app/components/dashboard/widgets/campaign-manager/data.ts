import { RANGE_DAYS, driversFor, metricOf, series, sumDays, type MetricId, type RangeId } from '../rules/data';

// Campaign Manager sample data: the account's campaigns and keywords, each with seeded daily totals from the same
// engine as the Rules nuggets, so ROAS, ACOS, spend and sales always agree with each other.

export type EntityKind = 'campaign' | 'keyword';

export interface Performer { id: string; name: string; detail: string }

/** The metrics in the order the Campaign Manager spec lists them, with its labels. */
export const TOP_METRICS: { id: MetricId; label: string }[] = [
  { id: 'spend', label: 'Ad Spend' },
  { id: 'sales', label: 'Ad Sales' },
  { id: 'roas', label: 'ROAS' },
  { id: 'impressions', label: 'Impressions' },
  { id: 'clicks', label: 'Clicks' },
  { id: 'ctr', label: 'CTR' },
  { id: 'cpc', label: 'CPC' },
  { id: 'cvr', label: 'CVR' },
  { id: 'units', label: 'Units Sold' },
  { id: 'acos', label: 'ACOS' },
];

export const TOP_LABEL = Object.fromEntries(TOP_METRICS.map((m) => [m.id, m.label])) as Record<MetricId, string>;

/** "Top" means best: lowest first where lower is better (ACOS, CPC), highest first for everything else. */
export const LOWEST_FIRST: MetricId[] = ['acos', 'cpc'];

// Ids look like the marketplace's own: long numbers, stable between refreshes.
const campaignId = (i: number) => String(287634910452118 + i * 7919337);
const keywordId = (i: number) => String(419027735510 + i * 104729);

const CAMPAIGN_ROWS: [string, string][] = [
  ['Summer Push', 'SP · Manual'],
  ['Protein Bars – Exact', 'SP · Manual'],
  ['Whey Isolate – Brand defense', 'SP · Manual'],
  ['Creatine – Competitor conquest', 'SP · Manual'],
  ['Shaker Bottles – Auto', 'SP · Auto'],
  ['Electrolytes – New launch', 'SP · Manual'],
  ['Mass Gainer – Auto', 'SP · Auto'],
  ['Pre Workout – Phrase', 'SP · Manual'],
  ['BCAA – Category targets', 'SP · Manual'],
  ['Multivitamin Gummies – Auto', 'SP · Auto'],
  ['Peanut Butter – Exact', 'SP · Manual'],
  ['Fish Oil – Broad', 'SP · Manual'],
  ['Plant Protein – Launch', 'SP · Manual'],
  ['Gym Gloves – Auto', 'SP · Auto'],
  ['Resistance Bands – Competitor', 'SP · Manual'],
  ['Oats – Brand', 'SP · Manual'],
  ['Ashwagandha – Auto', 'SP · Auto'],
  ['Collagen – Phrase', 'SP · Manual'],
];

const KEYWORD_ROWS: [string, string][] = [
  ['whey protein isolate', 'Exact · Whey Isolate – Brand defense'],
  ['protein bars low sugar', 'Phrase · Protein Bars – Exact'],
  ['creatine monohydrate', 'Exact · Creatine – Competitor conquest'],
  ['pre workout', 'Broad · Pre Workout – Phrase'],
  ['boldfit shaker bottle', 'Exact · Shaker Bottles – Auto'],
  ['electrolyte powder sugar free', 'Phrase · Electrolytes – New launch'],
  ['mass gainer for skinny', 'Broad · Mass Gainer – Auto'],
  ['bcaa powder', 'Exact · BCAA – Category targets'],
  ['multivitamin for men', 'Phrase · Multivitamin Gummies – Auto'],
  ['peanut butter crunchy', 'Exact · Peanut Butter – Exact'],
  ['omega 3 fish oil', 'Broad · Fish Oil – Broad'],
  ['vegan protein powder', 'Phrase · Plant Protein – Launch'],
  ['gym gloves for men', 'Exact · Gym Gloves – Auto'],
  ['resistance bands set', 'Broad · Resistance Bands – Competitor'],
  ['rolled oats 1kg', 'Exact · Oats – Brand'],
  ['ashwagandha tablets', 'Phrase · Ashwagandha – Auto'],
  ['marine collagen powder', 'Exact · Collagen – Phrase'],
  ['whey protein chocolate', 'Broad · Summer Push'],
  ['creatine gummies', 'Phrase · Creatine – Competitor conquest'],
  ['protein bar box', 'Broad · Protein Bars – Exact'],
  ['pre workout without caffeine', 'Exact · Pre Workout – Phrase'],
  ['steel shaker bottle', 'Phrase · Shaker Bottles – Auto'],
  ['isolate protein 2kg', 'Exact · Whey Isolate – Brand defense'],
  ['hydration tablets', 'Broad · Electrolytes – New launch'],
];

export const PERFORMERS: Record<EntityKind, Performer[]> = {
  campaign: CAMPAIGN_ROWS.map(([name, detail], i) => ({ id: campaignId(i), name, detail })),
  keyword: KEYWORD_ROWS.map(([name, detail], i) => ({ id: keywordId(i), name, detail })),
};

export interface RankedRow extends Performer { value: number }

/** A stable number from 0 to 1 for an id and a salt. */
function unit(id: string, salt: string): number {
  let h = 2166136261;
  const s = `${salt}|${id}`;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967296;
}

/**
 * The entity's daily drivers. A real account is uneven: a few campaigns carry most of the traffic and their efficiency
 * differs, so reach is spread from about a fifth to twice the base, and conversion and cost by up to a third.
 */
function driversOf(p: Performer, kind: EntityKind) {
  const d = driversFor(p.id, kind);
  const reach = 0.2 + unit(p.id, 'reach') ** 2 * 1.8;
  return { ...d, imp: d.imp * reach, cvr: d.cvr * (0.7 + unit(p.id, 'cvr') * 0.6), cpc: d.cpc * (0.75 + unit(p.id, 'cpc') * 0.5) };
}

/** Every campaign (or keyword) with its value for the metric over the range, best first. */
export function rankPerformers(kind: EntityKind, metric: MetricId, range: RangeId): RankedRow[] {
  const days = RANGE_DAYS[range];
  const rows = PERFORMERS[kind].map((p) => ({ ...p, value: metricOf(sumDays(series(`cm|${p.id}`, driversOf(p, kind), days)), metric) }));
  const low = LOWEST_FIRST.includes(metric);
  return rows.sort((x, y) => (low ? x.value - y.value : y.value - x.value));
}
