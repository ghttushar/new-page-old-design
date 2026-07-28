import type { Decision } from './decisions.constants';

export const CRITICAL_ONLY_ID = 'critical-b0csh8tcc6';

export const RECURRING_COST_ID = 'recurring-cost-b0c33qc2r2';

export const CRITICAL_ONLY_DECISION: Decision = {
  id: CRITICAL_ONLY_ID,
  source: 'anarix',
  sourceRef: { label: 'Inventory agent · listing compliance', ts: Date.now() - 50 * 60 * 1000 },
  valueCents: 5658,
  valueKind: 'at_risk',
  cadence: 'monthly',
  valueCaption: 'revenue at risk · Opportunity Window: 30 Days',
  valueBasis: 'Amazon flagged advertising eligibility with a warning on ASIN B0CH3HSSLZ (Crazy Cups Decaf Island Rum Coconut K-Cups, 22ct) on 2026-07-18. The warning is still active as of 2026-07-22. The cause is vendor cost-to-Amazon being too high for Amazon to hit its target retail price, not a catalog or inventory issue.',
  valueInputs: [
    'Estimated Revenue at Risk: $56.58 over next 30 days',
    'Estimated Units at Risk: ~3 units',
    'Inventory Available: 81 Units (+148 on open PO)',
    'Status: ELIGIBLE_WITH_WARNING — not yet fully blocked',
  ],
  insight: 'ASIN B0CH3HSSLZ · Crazy Cups Decaf Island Rum Coconut K-Cups, 22ct · advertising eligibility flagged with warning',
  insightDetail: 'Advertising eligibility flagged with warning on 2026-07-18. Status confirmed still open as of 2026-07-22 (ELIGIBLE_WITH_WARNING — not yet fully blocked). Vendor cost-to-Amazon is too high for Amazon to hit its target retail price. List price has stayed flat at $18.47 since the alert — no cost reduction submitted yet.',
  actionVerb: 'Escalate to Vendor Manager',
  domain: 'retail',
  severity: 'critical',
  status: 'open',
  createdAt: Date.now() - 50 * 60 * 1000,
  updatedAt: Date.now() - 50 * 60 * 1000,
  evidence: { kind: 'delta', delta: { beforeLabel: 'Revenue at risk', before: 57, afterLabel: 'Inventory', after: 81, unit: ' units' } },
  keyMetrics: [
    { label: 'Estimated Revenue at Risk', value: '$56.58' },
    { label: 'Estimated Units at Risk', value: '~3 Units' },
    { label: 'Inventory Available', value: '81 Units' },
  ],
  steps: [
    { label: 'Review cost-to-Amazon terms & history', etaSec: 10, why: 'Understand current cost structure.' },
    { label: 'Draft escalation email to Vendor Manager', etaSec: 8, why: 'Aan drafts the email for your approval.' },
    { label: 'Monitor warning status for 24 hours', etaSec: 5, why: 'Track if warning resolves or escalates.' },
  ],
  deepLink: { label: 'Open in Seller Central', href: '#' },
  detailSections: [
    {
      heading: 'What Happened',
      content: `Advertising eligibility flagged with warning on 2026-07-18. Status confirmed still open as of 2026-07-22 (ELIGIBLE_WITH_WARNING — not yet fully blocked).`,
    },
    {
      heading: 'Root Cause',
      content: `Vendor cost-to-Amazon is too high for Amazon to hit its target retail price. List price has stayed flat at $18.47 since the alert — no cost reduction submitted yet.`,
    },
    {
      heading: 'Business Impact',
      content: `Opportunity Window: 30 Days
Estimated Units at Risk: ~3 units
Estimated Revenue at Risk: $56.58
Inventory Available: 81 Units (+148 on open PO)
Confidence: 70%`,
    },
    {
      heading: 'Inventory Status',
      content: `Not Inventory Constrained — stock and incoming PO are healthy; this is not a supply issue.`,
    },
    {
      heading: 'AI Summary',
      content: `No prior meeting notes exist on this SKU. Data-wise, the warning hasn't dented organic sales (in fact 7/21 was the best day in the window at $221.88), rank is stable, and stock is fine — so the exposure is limited to the ~$57 in ad sales this ASIN could lose if it's fully suspended from ads. The lever is cost, not catalog or inventory.`,
    },
  ],
};

export const RECURRING_COST_DECISION: Decision = {
  id: RECURRING_COST_ID,
  source: 'anarix',
  sourceRef: { label: 'Inventory agent · listing compliance', ts: Date.now() - 30 * 60 * 1000 },
  valueCents: 13597,
  valueKind: 'at_risk',
  cadence: 'monthly',
  valueCaption: 'revenue at risk · 2nd occurrence in 30 days',
  valueBasis: 'Amazon disabled advertising eligibility on ASIN B0C33QC2R2 (Crazy Cups DECAF Blueberry Cobbler - 22 Ct) on 2026-07-18. This is the 2nd occurrence in the past 30 days for this ASIN. The root cause is a Vendor Central cost-to-Amazon flag, not a listing/content issue.',
  valueInputs: [
    'ASIN Ad Sales (30D): $135.97',
    'Estimated Units at Risk: ~8 Units (at $16.98 avg. realized unit price)',
    'Estimated Revenue at Risk: $135.97',
    "ASIN's Share of Account Ad Sales: 8.24%",
  ],
  insight: 'ASIN B0C33QC2R2 · Crazy Cups DECAF Blueberry Cobbler - 22 Ct · advertising eligibility lost — 2nd occurrence in 30 days',
  insightDetail: 'Advertising eligibility was lost on ASIN B0C33QC2R2 (Crazy Cups DECAF Blueberry Cobbler - 22 Ct) on 2026-07-18. This is the 2nd occurrence in 30 days — the same warning hit 2026-06-27 to 2026-07-03, recovered 2026-07-04 to 2026-07-17, then relapsed. The cause is a Vendor Central cost-to-Amazon flag, not a listing/content issue.',
  actionVerb: 'Escalate to Vendor Manager',
  domain: 'retail',
  severity: 'critical',
  status: 'open',
  createdAt: Date.now() - 30 * 60 * 1000,
  updatedAt: Date.now() - 30 * 60 * 1000,
  evidence: { kind: 'delta', delta: { beforeLabel: 'Revenue at risk', before: 136, afterLabel: 'Ad Sales (30D)', after: 136, unit: '' } },
  keyMetrics: [
    { label: 'Estimated Revenue at Risk', value: '$135.97' },
    { label: 'ASIN Ad Sales (30D)', value: '$135.97' },
    { label: 'Estimated Units at Risk', value: '~8 Units' },
  ],
  steps: [
    { label: 'Review recurrence pattern & account context', etaSec: 12, why: 'Understand broader cost-to-Amazon trends.' },
    { label: 'Draft escalation email with recurrence context', etaSec: 10, why: 'Aan drafts the email for your approval.' },
    { label: 'Flag for account-level cost structure review', etaSec: 8, why: 'Recurrence suggests a broader issue.' },
  ],
  deepLink: { label: 'Open in Seller Central', href: '#' },
  detailSections: [
    {
      heading: 'What Happened',
      content: `Advertising eligibility was lost on 2026-07-18. This is the 2nd occurrence in the past 30 days — the same warning hit this ASIN 2026-06-27 to 2026-07-03, recovered fully 2026-07-04 to 2026-07-17, then relapsed on 2026-07-18 and is still active as of today (2026-07-22).`,
    },
    {
      heading: 'Root Cause',
      content: `"This product's cost to Amazon does not allow us to meet customers' pricing expectations. Consider reducing the cost. It may take a few weeks for your product to become eligible to advertise after you reduce the cost."

Confirmed as a Vendor Central cost-to-Amazon flag, not a listing/content issue: retail list price held flat at $18.69 the entire time and BSR stayed steady (~11.5K-12.1K in Grocery), so nothing on the customer-facing listing changed.`,
    },
    {
      heading: 'Business Impact',
      content: `Opportunity Window: 30 Days
ASIN Ad Sales (30D): $135.97 | Total Sales (30D): $1,651.14
Estimated Units at Risk: ~8 Units (at $16.98 avg. realized unit price)
Estimated Revenue at Risk: $135.97
ASIN's Share of Account Ad Sales: 8.24%`,
    },
    {
      heading: 'Inventory Status',
      content: `Not Inventory Constrained
273 units currently available (Manufacturing/Sourcing view) vs. ~3.3 units/day recent sell-through → ~82 days of cover. Inventory is not the bottleneck here.`,
    },
    {
      heading: 'AI Summary',
      content: `No account-team discussion was found specifically on this SKU. But related context exists: on 2026-07-02 the team flagged rising price volatility and margin pressure on 40-count packs and called Amazon's ~21-point margin-cut request "untenable" — pointing to a broader, account-wide cost-to-Amazon squeeze rather than an isolated glitch on this ASIN. Given this is the 2nd flare-up in 3 weeks, a one-off cost tweak may only produce a temporary fix; worth raising the recurrence pattern with the vendor manager directly.`,
    },
  ],
};
