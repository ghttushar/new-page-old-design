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
      heading: 'Recommended Action',
      content: `Draft Amazon/Vendor Manager Support Ticket
No catalog, pricing-display, or content defect was found — price and rank were both stable through the flag. This is Amazon's wholesale-cost algorithm, which only your vendor-cost terms can resolve. Escalating to the vendor manager is the right lever (the team used this same path on 2026-06-03 for a different Decaf SKU's eligibility issue).`,
    },
    {
      heading: 'AI Summary',
      content: `No account-team discussion was found specifically on this SKU. But related context exists: on 2026-07-02 the team flagged rising price volatility and margin pressure on 40-count packs and called Amazon's ~21-point margin-cut request "untenable" — pointing to a broader, account-wide cost-to-Amazon squeeze rather than an isolated glitch on this ASIN. Given this is the 2nd flare-up in 3 weeks, a one-off cost tweak may only produce a temporary fix; worth raising the recurrence pattern with the vendor manager directly.`,
    },
  ],
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
  insight: "ASIN B0CSH8TCC6 main image is 800×800 — below Amazon's 1000×1000 minimum.",
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
  detailSections: [
    {
      heading: 'What Happened',
      content: "Amazon flagged ASIN B0CSH8TCC6 (Sampler — Decaf 40 Count) for non-compliant main product image. The current image is 800×800 px with a slight gradient background, below Amazon's 1000×1000 px minimum on pure white.",
    },
    {
      heading: 'Root Cause',
      content: "Image dimensions are 800×800 px (below the 1000×1000 px minimum). Background has a slight gradient instead of pure white (RGB 255,255,255). Amazon's system may suppress the listing from search results.",
    },
    {
      heading: 'Business Impact',
      content: `Opportunity Window: 30 Days
Estimated 40% click-through rate drop from search suppression
Estimated weekly revenue at risk: $3,200
ASIN currently has 2,810 units in inventory (~140 days of coverage)`,
    },
    {
      heading: 'Recommended Action',
      content: 'Generate a compliant image using AI. The new image must be 1000×1000 px on a pure white background (RGB 255,255,255) with the product properly centered and no text overlay on the main image.',
    },
    {
      heading: 'AI Summary',
      content: "This is a straightforward image compliance issue. The listing content (title, bullets, attributes) is fine — only the main image needs updating. Aan can generate a compliant image and preview it for your approval before publishing.",
    },
  ],
};
