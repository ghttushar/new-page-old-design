import type { Decision } from './decisions.constants';

export const CRITICAL_ONLY_ID = 'critical-b0csh8tcc6';

export const CRITICAL_ONLY_DECISION: Decision = {
  id: CRITICAL_ONLY_ID,
  source: 'anarix',
  sourceRef: { label: 'Inventory agent · listing compliance', ts: Date.now() - 50 * 60 * 1000 },
  valueCents: 5658,
  valueKind: 'at_risk',
  cadence: 'monthly',
  valueCaption: 'Revenue at risk: $56.58 · Action window: 30 days',
  valueBasis: 'Amazon flagged advertising eligibility with a warning on ASIN B0CH3HSSLZ (Crazy Cups Decaf Island Rum Coconut K-Cups, 22ct) on 2026-07-18. The warning is still active as of 2026-07-22. The cause is vendor cost-to-Amazon being too high for Amazon to hit its target retail price, not a catalog or inventory issue.',
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
    { label: 'Draft escalation email to Vendor Manager', etaSec: 8, why: 'Jiva drafts the email for your approval.' },
    { label: 'Monitor warning status for 24 hours', etaSec: 5, why: 'Track if warning resolves or escalates.' },
  ],
  deepLink: { label: 'Open in Seller Central', href: '#' },
  detailSections: [
    {
      heading: 'Business Impact',
      content: `Action window: 30 days
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
