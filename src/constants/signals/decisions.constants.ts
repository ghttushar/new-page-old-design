import type { DecisionSource } from '@/utils/signals/sourceRegistry';
import type { ValueKind, Cadence } from '@/utils/signals/valueFormat';

export type DecisionSeverity = 'critical' | 'opportunity' | 'fyi';
export type DecisionStatus = 'open' | 'with_aan' | 'in_flight' | 'completed' | 'rejected' | 'snoozed' | 'expired';
export type DecisionDomain = 'campaign' | 'retail' | 'profitability' | 'inventory' | 'cs' | 'buyer';

export interface DecisionEvidence {
  kind: 'delta' | 'sparkline' | 'table';
  delta?: { beforeLabel: string; before: number; afterLabel: string; after: number; unit?: string };
  sparkline?: { series: number[]; label: string };
  table?: { headers: string[]; rows: string[][] };
}

export interface DecisionStep {
  label: string;
  etaSec: number;
  why?: string;
}

export interface DecisionSection {
  heading: string;
  content: string;
}

export interface Decision {
  id: string;
  source: DecisionSource;
  sourceRef: { label: string; url?: string; ts: number };
  valueCents: number;
  valueKind: ValueKind;
  cadence?: Cadence;
  valueCaption: string;
  valueBasis: string;
  valueInputs?: string[];
  insight: string;
  insightDetail?: string;
  actionVerb: string;
  domain: DecisionDomain;
  severity: DecisionSeverity;
  status: DecisionStatus;
  createdAt: number;
  updatedAt: number;
  snoozedUntil?: number;
  startedAt?: number;
  dupeKey?: string;
  meetingRef?: { bundleId: string; title: string; excerpt: string };
  evidence?: DecisionEvidence;
  steps: DecisionStep[];
  deepLink?: { label: string; href: string };
  detailSections?: DecisionSection[];
  keyMetrics?: { label: string; value: string }[];
}

const HOUR = 60 * 60 * 1000;
const MIN = 60 * 1000;
const DAY = 86400000;
const now = Date.now();

function todayAt(hour: number, minute = 0): number {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.getTime();
}

export const MOCK_DECISIONS: Decision[] = [
  {
    id: 'd-realloc-winter',
    source: 'anarix',
    sourceRef: { label: 'Campaign agent · Winter Push', ts: now - 2 * DAY - 3 * HOUR },
    valueCents: 482_000,
    valueKind: 'gain',
    cadence: 'monthly',
    valueCaption: 'monthly reclaimable spend',
    valueBasis:
      'Winter Push is currently burning $2.4k/day at 25.4% TACoS against a 15% target. Reallocating that budget to Launch S4, which sits at 12.1% TACoS with ROAS headroom to 4.1×, reclaims roughly 22% of wasted spend at today\'s efficiency.',
    valueInputs: ['Winter Push daily spend: $2,400', 'TACoS delta: 25.4% → 12.1%', 'Launch S4 headroom: $2.4k/day at 4.1× ROAS'],
    insight: 'Winter Push has run 41% over TACoS for 3 weeks while Launch S4 sits under its ROAS ceiling with $2.4k/day of headroom.',
    insightDetail:
      'For 21 consecutive days Winter Push has posted TACoS between 24% and 27%, well above the 15% target you set in October. Launch S4 has trended the opposite direction - 12.1% TACoS for 14 days with impression share still climbing. Moving budget mid-flight is the highest-confidence lever you have this week.',
    actionVerb: 'Reallocate',
    domain: 'campaign',
    severity: 'critical',
    status: 'open',
    createdAt: now - 2 * DAY - 3 * HOUR,
    updatedAt: now - 2 * DAY - 3 * HOUR,
    evidence: { kind: 'delta', delta: { beforeLabel: 'Winter TACoS', before: 25.4, afterLabel: 'Launch S4 TACoS', after: 12.1, unit: '%' } },
    steps: [
      { label: 'Pause Winter Push', etaSec: 4, why: 'Stops the bleed before the budget shift lands.' },
      { label: 'Shift $2.4k/day to Launch S4', etaSec: 6, why: 'Matches the exact daily budget we freed up.' },
      { label: 'Set 72h watch alert', etaSec: 2, why: 'Catches regressions on Launch S4 within 3 days.' },
    ],
    deepLink: { label: 'Open in Campaign Manager', href: '/advertising/campaigns' },
  },
  {
    id: 'd-relist-skux',
    source: 'meeting',
    sourceRef: { label: 'Staples QBR · Q4 Planning', ts: now - 1 * DAY - 2 * HOUR },
    valueCents: 1_200_000,
    valueKind: 'at_risk',
    valueCaption: 'buyer commit at risk',
    valueBasis:
      'SKU-X was pulling $12k/mo on Staples before it was suppressed on Oct 12. The buyer confirmed in today\'s QBR they\'ll only hold the Q4 tier commitment if the listing is back on shelf before Friday.',
    valueInputs: ['Historical run rate: $12k/mo', 'Days suppressed: 26', 'Buyer Q4 tier: $220k/mo'],
    insight: 'SKU-X still suppressed on Staples portal - buyer flagged it in QBR and set Friday as the hard deadline.',
    insightDetail:
      'Portal ticket #48291 has been open 26 days waiting on compliance docs from our side. Dorothy (buyer) escalated it in today\'s QBR and made clear the Q4 tier commit hinges on relisting before Friday close. Mike on Staples ops has the ticket open on his side and is waiting on the file drop.',
    actionVerb: 'Relist SKU-X',
    domain: 'retail',
    severity: 'critical',
    status: 'open',
    createdAt: now - 1 * DAY - 2 * HOUR,
    updatedAt: now - 1 * DAY - 2 * HOUR,
    meetingRef: {
      bundleId: 'mtg-staples-qbr',
      title: 'Staples QBR - Q4 Planning',
      excerpt: 'Dorothy: Buyer wants SKU-X back on shelf before Friday. Mike: Portal ticket #48291 open - needs compliance docs.',
    },
    evidence: { kind: 'delta', delta: { beforeLabel: 'Suppressed for', before: 26, afterLabel: 'Days lost revenue', after: 26 } },
    steps: [
      { label: 'Attach compliance docs to ticket #48291', etaSec: 8, why: 'Unblocks Mike\'s queue on the Staples side.' },
      { label: 'Confirm portal push with Mike', etaSec: 4, why: 'Ensures the listing is live before Friday sync.' },
    ],
    deepLink: { label: 'Open Staples portal', href: '#' },
  },
  {
    id: 'd-refund-cs',
    source: 'slack',
    sourceRef: { label: '#cs-urgent · @maria', ts: now - 18 * MIN },
    valueCents: 124_000,
    valueKind: 'cost',
    cadence: 'one_time',
    valueCaption: 'one-time refund cost',
    valueBasis:
      '3 refund claims from the same shipping batch #B-2214 total $1,240. Approving now closes the loop with the customer; escalating turns each one into a buyer complaint that costs 8–10× more in remediation.',
    valueInputs: ['3 orders in batch #B-2214', 'Refund amounts: $412 + $389 + $439', 'Escalation multiplier: ~9× if unresolved'],
    insight: 'Maria escalated 3 refund claims from batch #B-2214 in #cs-urgent - all damaged in transit, same carrier lane.',
    insightDetail:
      'All three orders were flagged with photo evidence of packaging damage from the same carrier lane out of the Reno DC. The refund total is $1,240 and Maria is holding the customer replies until we decide. Standard CS SLA is 4 hours from escalation.',
    actionVerb: 'Approve refunds',
    domain: 'cs',
    severity: 'critical',
    status: 'open',
    createdAt: now - 18 * MIN,
    updatedAt: now - 18 * MIN,
    dupeKey: 'cs-refund-batch-B2214',
    evidence: {
      kind: 'table',
      table: {
        headers: ['Order', 'Reason', 'Amount'],
        rows: [
          ['#20244-A', 'Damaged in transit', '$412'],
          ['#20251-C', 'Damaged in transit', '$389'],
          ['#20258-B', 'Damaged in transit', '$439'],
        ],
      },
    },
    steps: [
      { label: 'Refund 3 orders', etaSec: 6, why: 'Closes each Amazon order at full refund.' },
      { label: 'Notify Maria in #cs-urgent', etaSec: 2, why: 'Lets Maria push the customer replies.' },
    ],
  },
  {
    id: 'd-refund-cs-dup',
    source: 'anarix',
    sourceRef: { label: 'CS agent · batch #B-2214', ts: now - 14 * MIN },
    valueCents: 124_000,
    valueKind: 'cost',
    cadence: 'one_time',
    valueCaption: 'one-time refund cost',
    valueBasis: 'Anarix CS agent picked up the same 3 orders independently via return-request signal.',
    insight: 'CS agent flagged batch #B-2214 (same as the Slack escalation above).',
    actionVerb: 'Approve refunds',
    domain: 'cs',
    severity: 'critical',
    status: 'open',
    createdAt: now - 14 * MIN,
    updatedAt: now - 14 * MIN,
    dupeKey: 'cs-refund-batch-B2214',
    steps: [
      { label: 'Refund 3 orders', etaSec: 6 },
      { label: 'Notify Maria in #cs-urgent', etaSec: 2 },
    ],
  },
  {
    id: 'd-budget-overshoot',
    source: 'aan',
    sourceRef: { label: 'Jiva · daily budget monitor', ts: now - 50 * MIN },
    valueCents: 340_000,
    valueKind: 'cost',
    cadence: 'daily',
    valueCaption: 'daily budget overshoot',
    valueBasis: 'Sponsored Products campaign "Auto-Target Broad" has spent $1,020 over its $680 daily cap for the past 5 days. The pacing algorithm is over-rotating on high-volume terms without efficiency guardrails.',
    valueInputs: ['Daily cap: $680', 'Actual daily spend: $1,020', 'Overshoot: 50% for 5 consecutive days'],
    insight: 'Auto-Target Broad has been spending $340/day over its daily cap for 5 days straight.',
    insightDetail: 'The campaign\'s budget cap of $680/day was set on May 15. For the last 5 days, actual spend has averaged $1,020/day — a 150% utilization rate. The overshoot is concentrated on 3 broad-match terms that are bidding on branded competitor queries.',
    actionVerb: 'Apply cap',
    domain: 'campaign',
    severity: 'critical',
    status: 'open',
    createdAt: now - 50 * MIN,
    updatedAt: now - 50 * MIN,
    evidence: { kind: 'delta', delta: { beforeLabel: 'Daily cap', before: 680, afterLabel: 'Actual spend', after: 1020, unit: '$' } },
    steps: [
      { label: 'Hard-cap Auto-Target Broad at $680/day', etaSec: 3, why: 'Stops the daily overshoot immediately.' },
      { label: 'Pause 3 over-spending terms', etaSec: 4, why: 'Removes the broad-match terms driving the excess.' },
      { label: 'Notify campaign manager', etaSec: 2, why: 'Keeps the team informed of the change.' },
    ],
    deepLink: { label: 'Open Campaign Manager', href: '/advertising/campaigns' },
  },
  {
    id: 'd-profit-margin',
    source: 'anarix',
    sourceRef: { label: 'Profitability agent · margin report', ts: now - 4 * DAY - 3 * HOUR },
    valueCents: 780_000,
    valueKind: 'gain',
    cadence: 'monthly',
    valueCaption: 'monthly margin improvement',
    valueBasis: 'Raising the price of Sampler – Decaf 40 Count from $3.99 to $4.29 would generate an estimated $7,800/month in additional margin at current volume, with minimal conversion impact based on historical price elasticity.',
    valueInputs: ['Current price: $3.99', 'Target price: $4.29', 'Estimated volume impact: -3%', 'Additional monthly margin: $7,800'],
    insight: 'Price elasticity analysis shows room for a $0.30 increase on Sampler – Decaf 40 Count with minimal volume impact.',
    insightDetail: 'Based on 12 months of price elasticity data for the decaf category, a 7.5% price increase on B0CSH8TCC6 would yield approximately $7,800/month in incremental margin. The category average price is $4.15, and our ASIN ranks in the top 5 for "decaf coffee pods" search, giving us pricing power.',
    actionVerb: 'Adjust price',
    domain: 'profitability',
    severity: 'opportunity',
    status: 'open',
    createdAt: now - 4 * DAY - 3 * HOUR,
    updatedAt: now - 4 * DAY - 3 * HOUR,
    evidence: { kind: 'delta', delta: { beforeLabel: 'Current margin', before: 399, afterLabel: 'Projected margin', after: 429, unit: '¢/unit' } },
    steps: [
      { label: 'Update price to $4.29', etaSec: 3, why: 'Sets the new price on Amazon.' },
      { label: 'Monitor conversion for 7 days', etaSec: 2, why: 'Ensures the price increase doesn\'t hurt conversion.' },
    ],
    deepLink: { label: 'Open Pricing Dashboard', href: '/profitability' },
  },
  {
    id: 'd-inventory-risk',
    source: 'anarix',
    sourceRef: { label: 'Inventory agent · stock monitor', ts: now - 5 * HOUR },
    valueCents: 1_500_000,
    valueKind: 'at_risk',
    valueCaption: 'monthly revenue at risk of stock-out',
    valueBasis: 'ASIN B09XYZ1234 (Premium Roast 80 Count) has 14 days of inventory cover at current sales velocity. Reorder lead time is 21 days, suggesting an imminent 7-day stock-out gap.',
    valueInputs: ['Current cover: 14 days', 'Reorder lead time: 21 days', 'Stock-out gap: 7 days', 'Monthly revenue at risk: $15,000'],
    insight: 'Premium Roast 80 Count has only 14 days of cover left but reorder takes 21 days.',
    insightDetail: 'The inventory agent detected that ASIN B09XYZ1234 is selling at 400 units/week, with only 800 units in stock. The supplier lead time is 21 days, meaning a reorder placed today would arrive after stock hits zero. This creates a 7-day stock-out window.',
    actionVerb: 'Place reorder',
    domain: 'inventory',
    severity: 'critical',
    status: 'open',
    createdAt: now - 5 * HOUR,
    updatedAt: now - 5 * HOUR,
    evidence: { kind: 'delta', delta: { beforeLabel: 'Days of cover', before: 14, afterLabel: 'Lead time', after: 21, unit: 'days' } },
    steps: [
      { label: 'Place PO for 3,000 units', etaSec: 8, why: 'Covers 7.5 weeks at current velocity.' },
      { label: 'Request expedited shipping', etaSec: 4, why: 'Attempts to close the stock-out gap.' },
      { label: 'Set low-stock alert at 500 units', etaSec: 2, why: 'Early warning for the next reorder cycle.' },
    ],
    deepLink: { label: 'Open Inventory Dashboard', href: '#' },
  },
  {
    id: 'd-csat-drop',
    source: 'meeting',
    sourceRef: { label: 'Weekly CX review · Q3 planning', ts: now - 6 * HOUR },
    valueCents: 450_000,
    valueKind: 'at_risk',
    valueCaption: 'monthly revenue at risk',
    valueBasis: 'CSAT for ASIN B0VARIETY01 dropped from 4.2 to 3.0 over the last week. Historical data shows every 1-point CSAT drop correlates with an 8% decline in repeat purchase rate within 30 days.',
    valueInputs: ['CSAT decline: 4.2 → 3.0', 'Historical repeat purchase impact: 8%/point', 'Estimated revenue at risk: $4,500/month'],
    insight: 'Sampler Variety Pack CSAT dropped from 4.2 to 3.0 - reviews cite pod compatibility issues.',
    insightDetail: 'The weekly CX review flagged a sharp decline in customer satisfaction for the Sampler Variety Pack (ASIN B0VARIETY01). Negative reviews集中在 "pods don\'t fit my Keurig 2.0" and "weak brew strength compared to previous batch". The CX team suspects a manufacturing batch issue.',
    actionVerb: 'Investigate quality',
    domain: 'cs',
    severity: 'opportunity',
    status: 'open',
    createdAt: now - 6 * HOUR,
    updatedAt: now - 6 * HOUR,
    meetingRef: {
      bundleId: 'mtg-cx-review',
      title: 'Weekly CX Review - Q3 Planning',
      excerpt: 'CS team: Sampler Variety Pack CSAT dropped 1.2 points this week. Manufacturing team: Investigating possible batch quality issue.',
    },
    steps: [
      { label: 'Contact manufacturing about batch quality', etaSec: 6, why: 'Determines if this is a batch issue or design problem.' },
      { label: 'Respond to recent negative reviews', etaSec: 4, why: 'Shows customers we\'re aware and addressing the issue.' },
    ],
  },
  {
    id: 'd-competitor-launch',
    source: 'anarix',
    sourceRef: { label: 'Market intelligence · competitor tracking', ts: todayAt(8, 30) },
    valueCents: 500_000,
    valueKind: 'gain',
    cadence: 'monthly',
    valueCaption: 'estimated monthly opportunity',
    valueBasis: 'Competitor "BrewMaster" launched a 40-count sampler at $2.99, undercutting our $3.99 price. They\'re ranked #8 for "decaf coffee pods". First-mover advantage in the value segment could capture significant share.',
    valueInputs: ['Competitor price: $2.99', 'Our price: $3.99', 'Competitor rank: #8', 'Segment opportunity: ~$5k/mo'],
    insight: 'BrewMaster launched a 40-count sampler at $2.99, directly undercutting our $3.99 decaf offering.',
    insightDetail: 'BrewMaster\'s new SKU launched 3 days ago at a 25% lower price point. They\'ve already climbed to #8 in organic search for "decaf coffee pods" with 47 reviews averaging 4.1 stars. The value segment (under $3.25) represents about 35% of category searches.',
    actionVerb: 'Respond',
    domain: 'campaign',
    severity: 'opportunity',
    status: 'open',
    createdAt: todayAt(8, 30),
    updatedAt: todayAt(8, 30),
    steps: [
      { label: 'Analyze competitor ASIN performance', etaSec: 5, why: 'Understands their trajectory and market share.' },
      { label: 'Consider value bundle offering', etaSec: 6, why: 'Options: lower price, bundle, or subscription discount.' },
    ],
    deepLink: { label: 'Open Market Intelligence', href: '/market-intelligence' },
  },
  {
    id: 'd-aan-automation',
    source: 'aan',
    sourceRef: { label: 'Jiva · auto-optimization report', ts: now - 2 * HOUR },
    valueCents: 180_000,
    valueKind: 'gain',
    cadence: 'weekly',
    valueCaption: 'weekly ad spend savings',
    valueBasis: 'Jiva automatically adjusted bids on 12 keywords in the "Brand Defense" campaign. Average CPC reduced from $2.45 to $1.92 while maintaining impression share at 92%.',
    valueInputs: ['Keywords optimized: 12', 'CPC reduction: $2.45 → $1.92', 'Impression share maintained: 92%'],
    insight: 'Jiva adjusted bids on 12 keywords in "Brand Defense" - CPC dropped 22% while impression share held at 92%.',
    insightDetail: 'I identified 12 keywords in the "Brand Defense" campaign that were bidding above the efficient CPC threshold. I reduced bids incrementally and monitored impression share. The result: a 22% reduction in average CPC with no meaningful loss in visibility.',
    actionVerb: 'Review changes',
    domain: 'campaign',
    severity: 'fyi',
    status: 'completed',
    createdAt: now - 2 * HOUR,
    updatedAt: now - 2 * HOUR,
    steps: [
      { label: 'Review keyword-level changes', etaSec: 5, why: 'Lets you verify the optimization decisions.' },
      { label: 'Apply learnings to similar campaigns', etaSec: 4, why: 'Extends the optimization across your portfolio.' },
    ],
    deepLink: { label: 'Open Campaign Manager', href: '/advertising/campaigns' },
  },
  {
    id: 'd-walmart-expansion',
    source: 'meeting',
    sourceRef: { label: 'Walmart QBR · Q4 planning', ts: now - 3 * DAY - 4 * HOUR },
    valueCents: 2_400_000,
    valueKind: 'gain',
    cadence: 'monthly',
    valueCaption: 'projected monthly revenue',
    valueBasis: 'Walmart buyer approved the Q4 assortment expansion. Adding 8 SKUs to Walmart.com and 4 SKUs to Walmart Marketplace. Projected incremental revenue of $24,000/month based on category velocity benchmarks.',
    valueInputs: ['New SKUs: 12 (8 Walmart.com + 4 Marketplace)', 'Category velocity benchmark: $2,000/SKU/month', 'Projected monthly revenue: $24,000'],
    insight: 'Walmart approved Q4 assortment expansion - 12 new SKUs going live next month.',
    insightDetail: 'The Walmart buyer (Jessica) signed off on the expanded assortment during yesterday\'s QBR. Eight SKUs will launch on Walmart.com (first-party) and 4 on Walmart Marketplace (third-party). The category velocity benchmark for coffee pods on Walmart is approximately $2,000/SKU/month.',
    actionVerb: 'Launch SKUs',
    domain: 'retail',
    severity: 'opportunity',
    status: 'open',
    createdAt: now - 3 * DAY - 4 * HOUR,
    updatedAt: now - 3 * DAY - 4 * HOUR,
    meetingRef: {
      bundleId: 'mtg-walmart-qbr',
      title: 'Walmart QBR - Q4 Planning',
      excerpt: 'Jessica (buyer): Approved 12 new SKUs for Q4. Need listing files by Aug 15 for Oct 1 launch.',
    },
    steps: [
      { label: 'Prepare listing files for 12 SKUs', etaSec: 10, why: 'Required by Aug 15 for Oct 1 launch.' },
      { label: 'Coordinate with warehouse for allocation', etaSec: 6, why: 'Ensures inventory is ready for launch.' },
    ],
  },
  {
    id: 'd-trend-organic',
    source: 'anarix',
    sourceRef: { label: 'Keyword tracker · search volume report', ts: todayAt(6, 0) },
    valueCents: 500_000,
    valueKind: 'gain',
    cadence: 'monthly',
    valueCaption: 'estimated monthly opportunity',
    valueBasis: 'Search volume for "organic coffee pods" increased 34% WoW. We have no organic-certified listings. Capturing even 10% of this search segment could generate $5,000/month in incremental revenue.',
    valueInputs: ['Search volume increase: 34% WoW', 'Current organic-certified listings: 0', 'Estimated capture at 10%: $5k/mo'],
    insight: '"Organic coffee pods" search volume is up 34% week-over-week — we have no organic-certified listings.',
    insightDetail: 'The keyword tracker detected a significant spike in searches for "organic coffee pods" over the past 7 days. The trend appears driven by a recent consumer report on pesticide residues in conventional coffee. We currently have zero organic-certified SKUs in our catalog.',
    actionVerb: 'Explore opportunity',
    domain: 'retail',
    severity: 'fyi',
    status: 'open',
    createdAt: todayAt(6, 0),
    updatedAt: todayAt(6, 0),
    steps: [
      { label: 'Research certification requirements', etaSec: 5, why: 'Determines cost and timeline for organic certification.' },
      { label: 'Evaluate supplier options', etaSec: 6, why: 'Identifies organic-certified coffee suppliers.' },
    ],
  },
  {
    id: 'd-ss-growth',
    source: 'anarix',
    sourceRef: { label: 'Analytics · Subscribe & Save report', ts: todayAt(7, 0) },
    valueCents: 0,
    valueKind: 'info',
    valueCaption: 'Key business metric',
    valueBasis: 'Subscribe & Save enrollment across top 20 ASINs grew from 12% to 30% this quarter. Average repeat purchase rate for S&S customers is 73% vs. 24% for non-S&S.',
    valueInputs: ['S&S enrollment growth: 12% → 30%', 'S&S repeat rate: 73%', 'Non-S&S repeat rate: 24%'],
    insight: 'Subscribe & Save enrollment grew from 12% to 30% this quarter — repeat rate is 3× higher for S&S customers.',
    insightDetail: 'The S&S program has seen strong adoption this quarter, driven by the 10% discount promotion launched in April. The repeat purchase rate differential (73% vs 24%) highlights the lifetime value impact of S&S enrollment. Consider expanding the S&S discount to additional ASINs.',
    actionVerb: 'Review report',
    domain: 'retail',
    severity: 'fyi',
    status: 'open',
    createdAt: todayAt(7, 0),
    updatedAt: todayAt(7, 0),
    evidence: { kind: 'delta', delta: { beforeLabel: 'Q1 enrollment', before: 12, afterLabel: 'Q2 enrollment', after: 30, unit: '%' } },
    steps: [
      { label: 'Review S&S performance report', etaSec: 4, why: 'Understands which ASINs drive the most S&S revenue.' },
    ],
    deepLink: { label: 'Open Analytics Dashboard', href: '#' },
  },
  {
    id: 'd-listing-blocked',
    source: 'anarix',
    sourceRef: { label: 'Amazon Seller Central · policy alert', ts: now - 30 * MIN },
    valueCents: 1_200_000,
    valueKind: 'at_risk',
    valueCaption: 'monthly revenue at risk',
    valueBasis: 'Amazon blocked ASIN B0NEWASIN01 (Dark Roast 80 Count) citing a "Restricted Product" policy violation. The listing is currently suppressed and generating zero revenue. Historical monthly revenue: $12,000.',
    valueInputs: ['Monthly revenue: $12,000', 'Days since suppression: 0 (just blocked)', 'Policy: Restricted Product'],
    insight: 'Dark Roast 80 Count (B0NEWASIN01) blocked for "Restricted Product" policy violation.',
    insightDetail: 'Amazon\'s automated review system flagged ASIN B0NEWASIN01 for a potential restricted product policy violation. The listing is now suppressed. This SKU generates approximately $12,000/month in revenue and has a 4.3-star rating with 892 reviews.',
    actionVerb: 'File appeal',
    domain: 'retail',
    severity: 'critical',
    status: 'open',
    createdAt: now - 30 * MIN,
    updatedAt: now - 30 * MIN,
    steps: [
      { label: 'Review policy violation notice', etaSec: 4, why: 'Understands the specific policy citation.' },
      { label: 'Prepare appeal documentation', etaSec: 8, why: 'Required for reinstatement.' },
      { label: 'Submit appeal via Seller Central', etaSec: 3, why: 'Starts the reinstatement process.' },
    ],
    deepLink: { label: 'Open Seller Central', href: '#' },
  },
  {
    id: 'd-buybox-loss',
    source: 'aan',
    sourceRef: { label: 'Jiva · BuyBox monitor', ts: now - 1.5 * HOUR },
    valueCents: 650_000,
    valueKind: 'at_risk',
    valueCaption: 'monthly revenue at risk',
    valueBasis: 'Lost BuyBox on ASIN B0MEDIUM01 (Medium Roast 80 Count) to a 3P seller priced at $3.49 (ours: $3.99). BuyBox loss typically results in 60%+ loss of sales within 48 hours.',
    valueInputs: ['Current BuyBox holder: 3P seller at $3.49', 'Our price: $3.99', 'Estimated sales impact: 60%+ loss', 'Monthly revenue at risk: $6,500'],
    insight: 'Lost BuyBox on Medium Roast 80 Count to a 3P seller at $3.49 — 13% below our $3.99.',
    insightDetail: 'A third-party seller has taken the BuyBox on ASIN B0MEDIUM01 with a price of $3.49, which is $0.50 below our listing price. Our historical data shows that losing the BuyBox on this ASIN results in a 60-70% decline in sales within 48 hours. We need to decide: match price or defend with advertising.',
    actionVerb: 'Win back BuyBox',
    domain: 'retail',
    severity: 'critical',
    status: 'open',
    createdAt: now - 1.5 * HOUR,
    updatedAt: now - 1.5 * HOUR,
    evidence: { kind: 'delta', delta: { beforeLabel: 'Our price', before: 399, afterLabel: '3P price', after: 349, unit: '¢' } },
    steps: [
      { label: 'Match 3P price at $3.49', etaSec: 3, why: 'Quickest way to regain BuyBox.' },
      { label: 'Set repricing rule to auto-match', etaSec: 4, why: 'Prevents future BuyBox losses to price.' },
    ],
  },
  {
    id: 'd-meeting-followup',
    source: 'meeting',
    sourceRef: { label: 'Team standup · daily sync', ts: todayAt(9, 15) },
    valueCents: 0,
    valueKind: 'info',
    valueCaption: 'Action item from standup',
    valueBasis: 'From today\'s standup: Marketing team needs Q3 advertising budget allocation by Thursday for campaign planning.',
    valueInputs: ['Deadline: Thursday EOD', 'Stakeholder: Marketing team'],
    insight: 'Q3 advertising budget allocation needed by Thursday for campaign planning.',
    insightDetail: 'The marketing team requested the Q3 advertising budget breakdown during today\'s standup. They need it by Thursday EOD to begin campaign planning for the back-to-school and fall seasonal pushes. Suggested allocation: 60% Amazon, 25% Walmart, 15% experimental channels.',
    actionVerb: 'Review budget',
    domain: 'campaign',
    severity: 'fyi',
    status: 'open',
    createdAt: todayAt(9, 15),
    updatedAt: todayAt(9, 15),
    meetingRef: {
      bundleId: 'mtg-standup-01',
      title: 'Team Standup - Operations Sync',
      excerpt: 'Marketing: Need Q3 budget allocation by Thursday for campaign planning.',
    },
    steps: [
      { label: 'Review Q2 spend vs. budget', etaSec: 5, why: 'Basis for Q3 allocation decisions.' },
      { label: 'Draft Q3 allocation proposal', etaSec: 6, why: '60/25/15 split for review.' },
    ],
  },

  // --- Staples QBR meeting alerts (4 alerts under mtg-staples-qbr) ---
  {
    id: 'd-meet-staples-pricing',
    source: 'meeting',
    sourceRef: { label: 'Staples QBR · Q4 Planning', ts: now - 1.5 * HOUR },
    valueCents: 340_000,
    valueKind: 'at_risk',
    valueCaption: 'price mismatch — move budget to hero SKU',
    valueBasis: 'Staples buyer flagged price mismatch on hero SKU vs. competitors. Budget reallocation to top-performing SKU can recover projected loss within 2 weeks.',
    valueInputs: ['Hero SKU price gap: 12% vs. competitor', 'Projected monthly loss: $3,400', 'Recovery window: 2 weeks with budget shift'],
    insight: 'Price mismatch on hero SKU — move budget to top performer to recover $3.4k/mo',
    insightDetail: 'Staples buyer (Dorothy) flagged that our hero SKU is priced 12% above top competitor. The buyer will only maintain Q4 tier commitment if pricing is competitive by Friday. Budget reallocation to Launch S4 (12.1% TACoS) can offset the loss within 2 weeks.',
    actionVerb: 'Reallocate budget',
    domain: 'campaign',
    severity: 'critical',
    status: 'open',
    createdAt: now - 1.5 * HOUR,
    updatedAt: now - 1.5 * HOUR,
    meetingRef: {
      bundleId: 'mtg-staples-qbr',
      title: 'Staples QBR - Q4 Planning',
      excerpt: 'Dorothy: Buyer wants SKU-X back on shelf before Friday. Mike: Portal ticket #48291 open - needs compliance docs.',
    },
    evidence: { kind: 'delta', delta: { beforeLabel: 'Hero SKU TACoS', before: 25.4, afterLabel: 'Target TACoS', after: 15.0, unit: '%' } },
    steps: [
      { label: 'Shift $2.4k/day from Winter Push to Launch S4', etaSec: 6, why: 'Matches the exact daily budget we freed up.' },
      { label: 'Set 48h watch alert on hero SKU TACoS', etaSec: 2, why: 'Catches regressions on Launch S4 within 2 days.' },
      { label: 'Confirm buyer acceptance of revised pricing', etaSec: 4, why: 'Buyer needs confirmation by Friday EOD.' },
    ],
    deepLink: { label: 'Open Campaign Manager', href: '/advertising/campaigns' },
  },
  {
    id: 'd-meet-staples-image',
    source: 'meeting',
    sourceRef: { label: 'Staples QBR · Q4 Planning', ts: now - 1.25 * HOUR },
    valueCents: 210_000,
    valueKind: 'at_risk',
    valueCaption: 'listing suppressed · main image non-compliant',
    valueBasis: 'Staples listing suppressed due to main image showing product on mannequin. Category requires plain product shot on white background. Generating compliant image and re-uploading will restore listing.',
    valueInputs: ['Category: Apparel — main image must be plain product on white', 'Current: mannequin shot → suppressed', 'Impact: ~$2.1k/mo blocked', 'Image generation: AI can generate compliant variant in <30s'],
    insight: 'ASIN B07XYZ — Main image shows product on mannequin (category requires plain product shot)',
    insightDetail: 'Staples portal suppressed ASIN B07XYZ because the main image shows the product on a mannequin. Amazon Apparel category requires plain product shot on pure white background. AI can generate compliant variants in under 30 seconds. Once uploaded, listing typically re-indexes in 30-60 minutes.',
    actionVerb: 'Generate compliant image',
    domain: 'retail',
    severity: 'critical',
    status: 'open',
    createdAt: now - 1.25 * HOUR,
    updatedAt: now - 1.25 * HOUR,
    meetingRef: {
      bundleId: 'mtg-staples-qbr',
      title: 'Staples QBR - Q4 Planning',
      excerpt: 'Dorothy: Buyer wants SKU-X back on shelf before Friday. Mike: Portal ticket #48291 open - needs compliance docs.',
    },
    steps: [
      { label: 'Generate compliant main image (pure white, no mannequin)', etaSec: 12, why: 'AI generates 3 variants — you pick, edit, publish' },
      { label: 'Select variant & upload to Amazon', etaSec: 6, why: 'Upload to Seller Central → listing re-indexes in 30-60 min' },
      { label: 'Verify re-indexing (30-60 min)', etaSec: 4, why: 'If still suppressed after 60 min, raise support ticket' },
    ],
    deepLink: { label: 'Open Seller Central', href: '#' },
  },
  {
    id: 'd-meet-staples-content',
    source: 'meeting',
    sourceRef: { label: 'Staples QBR · Q4 Planning', ts: now - 1 * HOUR },
    valueCents: 180_000,
    valueKind: 'at_risk',
    valueCaption: 'A+ content outdated — conversion drag',
    valueBasis: 'Staples buyer flagged that A+ content for hero SKUs has not been updated in 18 months. Competitor pages show 22% higher conversion. Updating A+ content with current lifestyle imagery and comparison charts can recover projected lift.',
    valueInputs: ['A+ content age: 18 months', 'Competitor conversion lift: 22%', 'Projected monthly recovery: $1,800', 'Content update turnaround: 3 days'],
    insight: 'A+ content 18 months stale — 22% conversion gap vs. competitors',
    insightDetail: 'Staples buyer (Dorothy) flagged during QBR that our A+ content has not been refreshed in 18 months. Competitor pages show lifestyle imagery and comparison charts driving 22% higher conversion. Updating 4 hero SKUs with current assets can close the gap. Creative team can turn around updated modules in 3 days.',
    actionVerb: 'Refresh A+ content',
    domain: 'retail',
    severity: 'opportunity',
    status: 'open',
    createdAt: now - 1 * HOUR,
    updatedAt: now - 1 * HOUR,
    meetingRef: {
      bundleId: 'mtg-staples-qbr',
      title: 'Staples QBR - Q4 Planning',
      excerpt: 'Dorothy: Buyer wants SKU-X back on shelf before Friday. Mike: Portal ticket #48291 open - needs compliance docs.',
    },
    steps: [
      { label: 'Audit current A+ modules across 4 hero SKUs', etaSec: 4, why: 'Identify modules with lowest engagement' },
      { label: 'Brief creative team with competitor benchmarks', etaSec: 6, why: 'Align on lifestyle imagery + comparison chart style' },
      { label: 'Publish updated modules & A/B test', etaSec: 8, why: 'Measure conversion lift over 14 days' },
    ],
    deepLink: { label: 'Open Creative Portal', href: '#' },
  },
  {
    id: 'd-meet-staples-inventory',
    source: 'meeting',
    sourceRef: { label: 'Staples QBR · Q4 Planning', ts: now - 45 * MIN },
    valueCents: 420_000,
    valueKind: 'at_risk',
    valueCaption: 'low inventory — 9 days cover, reorder now',
    valueBasis: 'Staples buyer confirmed Q4 tier commitment requires continuous stock. Current inventory covers only 9 days at current velocity. Reorder lead time is 14 days, creating a 5-day stockout gap. Expedited PO can close the gap.',
    valueInputs: ['Current cover: 9 days', 'Reorder lead time: 14 days', 'Stock-out gap: 5 days', 'Monthly revenue at risk: $4,200', 'Expedited PO cost: +15% unit cost'],
    insight: 'Only 9 days cover — 5-day stockout gap vs. 14-day lead time',
    insightDetail: 'Staples buyer (Dorothy) confirmed Q4 tier commitment hinges on continuous availability. Current velocity (400 units/week) with 800 units in stock = 9 days cover. Supplier lead time is 14 days, creating a 5-day stockout gap. Expedited PO (+15% unit cost) can close the gap if placed today.',
    actionVerb: 'Place expedited PO',
    domain: 'inventory',
    severity: 'critical',
    status: 'open',
    createdAt: now - 45 * MIN,
    updatedAt: now - 45 * MIN,
    meetingRef: {
      bundleId: 'mtg-staples-qbr',
      title: 'Staples QBR - Q4 Planning',
      excerpt: 'Dorothy: Buyer wants SKU-X back on shelf before Friday. Mike: Portal ticket #48291 open - needs compliance docs.',
    },
    evidence: { kind: 'delta', delta: { beforeLabel: 'Days of cover', before: 9, afterLabel: 'Lead time', after: 14, unit: 'days' } },
    steps: [
      { label: 'Place expedited PO for 3,000 units (+15% cost)', etaSec: 8, why: 'Covers 7.5 weeks at current velocity; closes 5-day gap' },
      { label: 'Request supplier confirmation on expedited timeline', etaSec: 4, why: 'Confirm 10-day delivery vs. standard 14' },
      { label: 'Set low-stock alert at 500 units', etaSec: 2, why: 'Early warning for next reorder cycle' },
    ],
    deepLink: { label: 'Open Inventory Dashboard', href: '#' },
  },

  // --- Image Generation Alert (All tab) ---
  {
    id: 'd-image-gen-main-mannequin',
    source: 'anarix',
    sourceRef: { label: 'Amazon Seller Central · policy alert', ts: now - 20 * MIN },
    valueCents: 210_000,
    valueKind: 'at_risk',
    valueCaption: 'listing suppressed · image non-compliant',
    valueBasis: 'Amazon blocked ASIN B07XYZ (Apparel main image) citing "Non-compliant main image — product shown on mannequin". Category requires plain product shot on pure white background. Listing is suppressed and generating zero revenue.',
    valueInputs: ['Category: Apparel — main image must be plain product on white', 'Current: mannequin shot → suppressed', 'Impact: ~$2.1k/mo blocked', 'Image generation: AI can generate compliant variant in <30s'],
    insight: 'ASIN B07XYZ — Main image shows product on mannequin (category requires plain product shot)',
    insightDetail: 'Amazon\'s automated review system flagged ASIN B07XYZ for a non-compliant main image showing the product on a mannequin. The Apparel category requires plain product shot on pure white background. The listing is now suppressed. AI can generate compliant variants in under 30 seconds. Once uploaded, listing typically re-indexes in 30-60 minutes. If still suppressed after 60 minutes, raise a support ticket.',
    actionVerb: 'Generate compliant image',
    domain: 'retail',
    severity: 'critical',
    status: 'open',
    createdAt: now - 20 * MIN,
    updatedAt: now - 20 * MIN,
    steps: [
      { label: 'Generate compliant main image (pure white, no mannequin)', etaSec: 12, why: 'AI generates 3 variants — you pick, edit, publish' },
      { label: 'Select variant & upload to Amazon', etaSec: 6, why: 'Upload to Seller Central → listing re-indexes in 30-60 min' },
      { label: 'Verify re-indexing (30-60 min)', etaSec: 4, why: 'If still suppressed after 60 min, raise support ticket' },
    ],
    deepLink: { label: 'Open Seller Central', href: '#' },
  },

  {
    id: 'd-meeting-followup',
    source: 'meeting',
    sourceRef: { label: 'Team standup · daily sync', ts: todayAt(9, 15) },
    valueCents: 0,
    valueKind: 'info',
    valueCaption: 'Action item from standup',
    valueBasis: 'From today\'s standup: Marketing team needs Q3 advertising budget allocation by Thursday for campaign planning.',
    valueInputs: ['Deadline: Thursday EOD', 'Stakeholder: Marketing team'],
    insight: 'Q3 advertising budget allocation needed by Thursday for campaign planning.',
    insightDetail: 'The marketing team requested the Q3 advertising budget breakdown during today\'s standup. They need it by Thursday EOD to begin campaign planning for the back-to-school and fall seasonal pushes. Suggested allocation: 60% Amazon, 25% Walmart, 15% experimental channels.',
    actionVerb: 'Review budget',
    domain: 'campaign',
    severity: 'fyi',
    status: 'open',
    createdAt: todayAt(9, 15),
    updatedAt: todayAt(9, 15),
    meetingRef: {
      bundleId: 'mtg-standup-01',
      title: 'Team Standup - Operations Sync',
      excerpt: 'Marketing: Need Q3 budget allocation by Thursday for campaign planning.',
    },
    steps: [
      { label: 'Review Q2 spend vs. budget', etaSec: 5, why: 'Basis for Q3 allocation decisions.' },
      { label: 'Draft Q3 allocation proposal', etaSec: 6, why: '60/25/15 split for review.' },
    ],
  },
];
