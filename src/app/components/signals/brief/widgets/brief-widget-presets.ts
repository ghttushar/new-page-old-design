import type { Layout } from 'react-grid-layout';
import type { WidgetInstance } from './brief-widget-types';

export interface DashboardPreset {
  id: string;
  label: string;
  description: string;
  widgets: WidgetInstance[];
  layout: Layout[];
}

function checklistTasks(items: string[]): { text: string; done: boolean }[] {
  return items.map((text) => ({ text, done: false }));
}

const ADVERTISING_ITEMS = [
  'By ad type: SP, SB, SBV, SD, and DSP where applicable, since each has different efficiency benchmarks and a blended ACoS hides mix shifts.',
  'By campaign intent: Branded, non-branded/category, competitor conquesting, and retargeting. Branded defense and category acquisition should never share a target.',
  'Search term and keyword level: Top spenders with zero or low orders, rising terms, harvest candidates (auto/broad terms converting well but not yet exact), and negation candidates.',
  'Placement performance: Top of search, rest of search, and product pages, with CVR and CPC by placement.',
  'Budget pacing and utilization: Campaigns out of budget before end of day (lost opportunity) versus campaigns chronically underspending.',
  'Dayparting and hourly trends: If hourly data is available, show when CPCs spike and CVR drops.',
  'Share of voice: Organic and sponsored rank on priority keywords versus competitors.',
  'New-to-brand metrics: NTB orders and NTB % for SB, SD, and DSP. This is the real incrementality signal.',
  'Organic vs paid traffic sales share',
];

const CATALOG_ITEMS = [
  'Listing completeness: Title length and keyword coverage, bullet count, A+ content present, image count, video present, backend search terms filled, and brand story.',
  'Content changes log: Detect unauthorized title or image changes, such as vendor-central overrides or hijacker edits. This is often overlooked and very valuable.',
  'Buy Box ownership: By ASIN, with who is winning it and at what price. MAP violations and unauthorized sellers belong here.',
  'Pricing: Current price versus list, versus competitors, deal and coupon status, and price-change history.',
  'Variation and parent-child health: Broken variations and orphaned children.',
  'Reviews and ratings: Star rating trend, review velocity, and rating drops. Negative review themes from text analysis are a bonus.',
  'Search rank: Organic rank on 5–10 priority keywords per hero ASIN.',
];

const PERFORMANCE_ITEMS = [
  'ASIN-level contribution: A Pareto view of the top 20% of ASINs, plus growers versus decliners with the dollar impact of each.',
  'Organic versus paid trend: Is ad spend cannibalizing organic, or lifting it? Pair TACoS with organic sales over time.',
  'Profitability: Contribution margin after COGS, fees (referral, FBA, storage), ad spend, returns, and promos. For 1P, include chargebacks, co-op, and damage allowances. Revenue-only dashboards mislead.',
  'Inventory: Weeks of cover, stockout risk, sell-through, aged inventory (long-term storage risk), and inbound status. For 1P, show PO acceptance rate and confirmed versus ordered.',
  'Returns: Return rate by ASIN and top return reasons.',
  'Promotions: Lift from deals, coupons, and Prime Day or other event performance versus baseline.',
  'Cross-marketplace: Amazon, Walmart, and Shopify side by side if you run multiple channels.',
];

const ACCOUNT_HEALTH_ITEMS = [
  'Seller performance metrics (3P): ODR, late shipment rate, pre-fulfillment cancel rate, valid tracking rate, and Account Health Rating.',
  'Policy compliance: IP complaints, listing policy violations, restricted product warnings, and product authenticity or safety complaints.',
  'Vendor operational metrics (1P): Chargebacks, on-time delivery, fill rate, and ASN accuracy.',
  'FBA health: Inventory Performance Index (IPI), storage limits and utilization, and excess or stranded inventory.',
  'Customer experience: Negative feedback rate, A-to-Z claims, Voice of Customer (NCX) flags, and buyer-seller message response time.',
];

/** Every preset opens with the same "Overview" pair (Key stats + While you were away) and the same
 * two Operations widgets (Notifications, Actions in progress), so switching templates never costs
 * you the always-useful stuff — only the category-specific visualization and checklist change. */
const OVERVIEW_WIDGETS = (prefix: string): WidgetInstance[] => [
  { id: `${prefix}-kpi`, kind: 'legacyKpiRow', title: 'Key stats', config: {} },
  { id: `${prefix}-activity`, kind: 'legacyActivity', title: 'While you were away', config: {} },
  { id: `${prefix}-notifications`, kind: 'notifications', title: 'Notifications', config: {} },
  { id: `${prefix}-actions`, kind: 'actionsInProgress', title: 'Actions in progress', config: {} },
];

const OVERVIEW_LAYOUT = (prefix: string): Layout[] => [
  { i: `${prefix}-kpi`, x: 0, y: 0, w: 12, h: 3, minW: 8, minH: 3 },
  { i: `${prefix}-activity`, x: 0, y: 3, w: 12, h: 6, minW: 6, minH: 4 },
  { i: `${prefix}-notifications`, x: 0, y: 9, w: 6, h: 5, minW: 4, minH: 4 },
  { i: `${prefix}-actions`, x: 6, y: 9, w: 6, h: 5, minW: 4, minH: 4 },
];

/**
 * One-click starting dashboards for the four coverage areas the team spec'd out. Each pairs the
 * shared Overview block above with one category-specific visualization — a different chart *family*
 * per template (bar / donut / trend line / structured table), not just different metrics in the same
 * chart shape — plus a literal checklist of every spec'd bullet, so nothing from the source list is
 * lost or paraphrased away.
 */
export const DASHBOARD_PRESETS: DashboardPreset[] = [
  {
    id: 'advertising',
    label: 'Advertising',
    description: 'Ad type mix, campaign intent, search terms, placements, pacing, dayparting, share of voice, NTB and organic vs paid.',
    widgets: [
      ...OVERVIEW_WIDGETS('preset-adv'),
      { id: 'preset-adv-metrics', kind: 'metricRow', title: 'Advertising efficiency', config: { metricIds: ['ad-spend', 'ad-sales', 'roas', 'acos'] } },
      {
        id: 'preset-adv-chart', kind: 'barChartHorizontal', title: 'CTR, CVR, ACOS & TACOS — bar chart',
        config: {
          series: [
            { id: 's1', metricId: 'ctr', color: '#77469b' },
            { id: 's2', metricId: 'cvr', color: '#2f6fed' },
            { id: 's3', metricId: 'acos', color: '#a8763f' },
            { id: 's4', metricId: 'tacos', color: '#3f7d6a' },
          ],
        },
      },
      { id: 'preset-adv-checklist', kind: 'checklist', title: 'Advertising — coverage checklist', config: { tasks: checklistTasks(ADVERTISING_ITEMS) } },
    ],
    layout: [
      ...OVERVIEW_LAYOUT('preset-adv'),
      { i: 'preset-adv-metrics', x: 0, y: 14, w: 6, h: 2, minW: 4, minH: 2 },
      { i: 'preset-adv-chart', x: 6, y: 14, w: 6, h: 5, minW: 4, minH: 4 },
      { i: 'preset-adv-checklist', x: 0, y: 16, w: 6, h: 9, minW: 4, minH: 4 },
    ],
  },
  {
    id: 'catalog',
    label: 'Catalog',
    description: 'Listing completeness, content-change detection, Buy Box, pricing, variations, reviews and search rank.',
    widgets: [
      ...OVERVIEW_WIDGETS('preset-cat'),
      { id: 'preset-cat-donut', kind: 'actionMix', title: 'Catalog activity mix — donut chart', config: {} },
      { id: 'preset-cat-checklist', kind: 'checklist', title: 'Catalog — coverage checklist', config: { tasks: checklistTasks(CATALOG_ITEMS) } },
    ],
    layout: [
      ...OVERVIEW_LAYOUT('preset-cat'),
      { i: 'preset-cat-donut', x: 0, y: 14, w: 12, h: 5, minW: 5, minH: 4 },
      { i: 'preset-cat-checklist', x: 0, y: 19, w: 12, h: 9, minW: 4, minH: 4 },
    ],
  },
  {
    id: 'performance',
    label: 'Performance (Sales & P&L)',
    description: 'ASIN contribution, organic vs paid, profitability, inventory, returns, promotions and cross-marketplace.',
    widgets: [
      ...OVERVIEW_WIDGETS('preset-perf'),
      { id: 'preset-perf-trend', kind: 'revenueTrend', title: 'Revenue & ad sales — trend line', config: {} },
      { id: 'preset-perf-checklist', kind: 'checklist', title: 'Performance (Sales & P&L) — coverage checklist', config: { tasks: checklistTasks(PERFORMANCE_ITEMS) } },
    ],
    layout: [
      ...OVERVIEW_LAYOUT('preset-perf'),
      { i: 'preset-perf-trend', x: 0, y: 14, w: 12, h: 5, minW: 5, minH: 4 },
      { i: 'preset-perf-checklist', x: 0, y: 19, w: 12, h: 9, minW: 4, minH: 4 },
    ],
  },
  {
    id: 'account-health',
    label: 'Overall Account Health',
    description: 'Seller performance, policy compliance, vendor operations, FBA health and customer experience.',
    widgets: [
      ...OVERVIEW_WIDGETS('preset-health'),
      { id: 'preset-health-table', kind: 'channels', title: 'Marketplace health — structured table', config: {} },
      { id: 'preset-health-checklist', kind: 'checklist', title: 'Overall Account Health — coverage checklist', config: { tasks: checklistTasks(ACCOUNT_HEALTH_ITEMS) } },
    ],
    layout: [
      ...OVERVIEW_LAYOUT('preset-health'),
      { i: 'preset-health-table', x: 0, y: 14, w: 12, h: 5, minW: 5, minH: 4 },
      { i: 'preset-health-checklist', x: 0, y: 19, w: 12, h: 8, minW: 4, minH: 4 },
    ],
  },
];
