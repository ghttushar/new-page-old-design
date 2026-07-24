import type { Decision } from './decisions.constants';

export const CRITICAL_ONLY_DECISION: Decision = {
  id: 'critical-b0csh8tcc6',
  source: 'amazon' as any,
  sourceRef: { label: 'Amazon Ads', ts: Date.now() - 3600000 },
  valueCents: 688500,
  valueKind: 'at_risk',
  valueCaption: 'Revenue at risk over 7 days',
  valueBasis: 'Based on average daily ad-attributed sales of $983.57 over the past 30 days.',
  valueInputs: [
    'Average daily ad-attributed sales: $983.57 (30-day trailing)',
    'Estimated revenue at risk (7 days): $6,885',
    'Estimated units at risk: ~300 units',
    'Inventory available: 2,810 units (~140 days of coverage)',
  ],
  insight: 'ASIN B0CSH8TCC6 lost advertising eligibility on 07 Jun',
  insightDetail: 'Amazon disabled advertising for ASIN B0CSH8TCC6 (Sampler – Decaf 40 Count) on 07 Jun 2026, citing missing or incorrect listing information. Estimated revenue at risk is $6,885 over the next 7 days.',
  actionVerb: 'Investigate & fix',
  domain: 'retail',
  severity: 'critical',
  status: 'open',
  createdAt: Date.now() - 3600000,
  updatedAt: Date.now() - 3600000,
  cadence: 'daily',
  steps: [
    { label: 'Check listing compliance', etaSec: 5 },
    { label: 'Submit appeal if needed', etaSec: 8 },
  ],
};
