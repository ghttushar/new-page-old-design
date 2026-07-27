import type { Decision } from './decisions.constants';

export const CRITICAL_ONLY_ID = 'critical-b0csh8tcc6';

export const IMAGE_ISSUE_ID = 'critical-image-b0csh8tcc6';

export const CRITICAL_ONLY_DECISION: Decision = {
  id: CRITICAL_ONLY_ID,
  source: 'anarix',
  sourceRef: { label: 'Inventory agent · listing compliance', ts: Date.now() - 50 * 60 * 1000 },
  valueCents: 688500,
  valueKind: 'at_risk',
  cadence: 'daily',
  valueCaption: 'revenue at risk · next 7 days',
  valueBasis: 'Amazon disabled advertising eligibility on ASIN B0CSH8TCC6 (Sampler — Decaf 40 Count) on 07 Jun 2026, citing missing or incorrect listing information. Estimated revenue at risk is $6,885 over the next 7 days.',
  valueInputs: [
    'Average daily ad-attributed sales: $983.57 (30-day trailing)',
    'Estimated revenue at risk (7 days): $6,885',
    'Estimated units at risk: ~300 units',
    'Inventory available: 2,810 units (~140 days of coverage)',
  ],
  insight: 'ASIN B0CSH8TCC6 · Sampler — Decaf 40 Count lost advertising eligibility on 07 Jun 2026.',
  insightDetail: 'Amazon disabled advertising for ASIN B0CSH8TCC6 (Sampler — Decaf 40 Count) on 07 Jun 2026, citing missing or incorrect listing information. The listing has no known compliance issues on our end. Estimated revenue at risk is $6,885 over the next 7 days, and we have 2,810 units in inventory (~140 days of coverage).',
  actionVerb: 'Analyze Listing',
  domain: 'retail',
  severity: 'critical',
  status: 'open',
  createdAt: Date.now() - 50 * 60 * 1000,
  updatedAt: Date.now() - 50 * 60 * 1000,
  evidence: { kind: 'delta', delta: { beforeLabel: 'Revenue at risk', before: 6885, afterLabel: 'Units at risk', after: 300, unit: ' units' } },
  steps: [
    { label: 'Review listing history & sentiment', etaSec: 10, why: 'Compare against the last eligible version.' },
    { label: 'Identify the failing field', etaSec: 8, why: 'Locate the exact attribute Amazon flagged.' },
    { label: 'Draft compliant edit for your approval', etaSec: 6, why: 'Nothing publishes without your OK.' },
  ],
  deepLink: { label: 'Open in Seller Central', href: '#' },
};

export const IMAGE_ISSUE_DECISION: Decision = {
  id: IMAGE_ISSUE_ID,
  source: 'anarix',
  sourceRef: { label: 'Listing agent · featured image', ts: Date.now() - 30 * 60 * 1000 },
  valueCents: 320000,
  valueKind: 'at_risk',
  cadence: 'weekly',
  valueCaption: 'weekly revenue at risk',
  valueBasis: "ASIN B0CSH8TCC6 main image does not meet Amazon's 1000×1000 px requirement on white background. Amazon may suppress the listing from search results until corrected.",
  valueInputs: [
    'Image dimensions: 800×800 px (below 1000×1000 minimum)',
    'Estimated 40% click-through rate drop from search suppression',
    'Estimated weekly revenue at risk: $3,200',
  ],
  insight: 'ASIN B0CSH8TCC6 main image is 800×800 — below Amazon\'s 1000×1000 minimum.',
  insightDetail: "Amazon requires product images to be at least 1000×1000 pixels on a pure white background (RGB 255,255,255). The current image is 800×800 px with a slight gradient background. Amazon's system may suppress this ASIN from search results entirely.",
  actionVerb: 'Generate Image',
  domain: 'retail',
  severity: 'critical',
  status: 'open',
  createdAt: Date.now() - 30 * 60 * 1000,
  updatedAt: Date.now() - 30 * 60 * 1000,
  steps: [
    { label: 'Analyze current image against Amazon requirements', etaSec: 5, why: 'Identify which specs are failing.' },
    { label: 'Generate compliant image with AI', etaSec: 30, why: 'Aan generates a 1000×1000 px image on white background.' },
    { label: 'Preview and publish for your approval', etaSec: 5, why: 'Nothing publishes without your OK.' },
  ],
};
