export type ActionCategory =
  | 'Client Communication'
  | 'Advertising & Campaigns'
  | 'Catalog & Content'
  | 'Investigation & Analysis'
  | 'Inventory & Fulfillment'
  | 'Pricing & Compliance'
  | 'Platform & Ops'
  | 'Growth & Events';

export interface ActionType {
  id: string;
  label: string;
  category: ActionCategory;
  /** True when the action is fundamentally "send the client something" — opens Mail Compose instead of the generic log form. */
  isEmailAction: boolean;
  /** True when the action fundamentally produces an image — opens Image Studio instead of the generic log form. */
  isImageAction?: boolean;
}

export const ACTION_CATEGORIES: ActionCategory[] = [
  'Client Communication',
  'Advertising & Campaigns',
  'Catalog & Content',
  'Investigation & Analysis',
  'Inventory & Fulfillment',
  'Pricing & Compliance',
  'Platform & Ops',
  'Growth & Events',
];

export const ACTION_TYPES: ActionType[] = [
  { id: 'send-report-update', label: 'Send report/update to client (proposals, performance, forecasts)', category: 'Client Communication', isEmailAction: true },
  { id: 'update-a-plus-content', label: 'Update A+ content/infographics', category: 'Catalog & Content', isEmailAction: false, isImageAction: true },
  { id: 'update-product-images', label: 'Update product images', category: 'Catalog & Content', isEmailAction: false, isImageAction: true },
  { id: 'schedule-client-call', label: 'Schedule client call/meeting', category: 'Client Communication', isEmailAction: false },
  { id: 'optimize-monitor-ad-campaign', label: 'Optimize/monitor ad campaign performance', category: 'Advertising & Campaigns', isEmailAction: false },
  { id: 'investigate-sales-decline', label: 'Investigate sales/performance decline root cause', category: 'Investigation & Analysis', isEmailAction: false },
  { id: 'increase-ad-spend', label: 'Increase/scale ad spend or campaign budget', category: 'Advertising & Campaigns', isEmailAction: false },
  { id: 'investigate-reporting-discrepancy', label: 'Investigate data/reporting discrepancy', category: 'Investigation & Analysis', isEmailAction: false },
  { id: 'launch-restructure-ad-campaign', label: 'Launch/restructure ad campaign (manual vs auto, new type)', category: 'Advertising & Campaigns', isEmailAction: false },
  { id: 'market-opportunity-research', label: 'Market/opportunity research (new product, competitor tools)', category: 'Investigation & Analysis', isEmailAction: false },
  { id: 'update-listing-copy', label: 'Update listing copy (title/bullets/description)', category: 'Catalog & Content', isEmailAction: false },
  { id: 'investigate-amazon-eligibility', label: 'Investigate/resolve Amazon eligibility issue', category: 'Pricing & Compliance', isEmailAction: false },
  { id: 'inventory-replenishment-planning', label: 'Inventory replenishment planning/restock recommendation', category: 'Inventory & Fulfillment', isEmailAction: false },
  { id: 'setup-mcp-connector', label: 'Set up MCP/AI connector integration', category: 'Platform & Ops', isEmailAction: false },
  { id: 'prepare-promotional-event', label: 'Prepare for promotional event (Prime Day/BTS/July4)', category: 'Growth & Events', isEmailAction: false },
  { id: 'reallocate-ad-spend', label: 'Reallocate/redirect ad spend to alternate SKU', category: 'Advertising & Campaigns', isEmailAction: false },
  { id: 'setup-retargeting-campaign', label: 'Set up retargeting/remarketing campaign (SD/AMC)', category: 'Advertising & Campaigns', isEmailAction: false },
  { id: 'fix-technical-connector-bug', label: 'Fix technical/connector bug (platform/MCP)', category: 'Platform & Ops', isEmailAction: false },
  { id: 'reconcile-yoy-kpi', label: 'Reconcile/update YoY or KPI reporting methodology', category: 'Investigation & Analysis', isEmailAction: false },
  { id: 'competitor-analysis', label: 'Competitor analysis/benchmarking', category: 'Investigation & Analysis', isEmailAction: false },
  { id: 'launch-pct-ads', label: 'Launch/adjust competitor targeting (PCT) ads', category: 'Advertising & Campaigns', isEmailAction: false },
  { id: 'adjust-pricing-discount', label: 'Adjust pricing/discount strategy', category: 'Pricing & Compliance', isEmailAction: false },
  { id: 'split-restructure-listing', label: 'Split/restructure listing (variations, SKU separation)', category: 'Catalog & Content', isEmailAction: false },
  { id: 'resend-followup-email', label: 'Resend/follow-up email to client', category: 'Client Communication', isEmailAction: true },
  { id: 'reduce-ad-spend', label: 'Reduce ad spend on underperforming SKU', category: 'Advertising & Campaigns', isEmailAction: false },
  { id: 'launch-new-product-listing', label: 'Launch new product listing', category: 'Catalog & Content', isEmailAction: false },
  { id: 'launch-ab-test', label: 'Launch A/B test (images/content)', category: 'Catalog & Content', isEmailAction: false },
  { id: 'keyword-research', label: 'Keyword research/harvesting', category: 'Advertising & Campaigns', isEmailAction: false },
  { id: 'grant-system-access', label: 'Grant/request system access & permissions', category: 'Platform & Ops', isEmailAction: false },
  { id: 'coupon-deal-setup', label: 'Coupon/deal setup', category: 'Growth & Events', isEmailAction: false },
  { id: 'deliver-creative-assets', label: 'Deliver creative assets to client', category: 'Client Communication', isEmailAction: true },
  { id: 'process-workflow-governance', label: 'Process/workflow governance', category: 'Platform & Ops', isEmailAction: false },
  { id: 'day-parting-setup', label: 'Day-parting setup/adjustment', category: 'Advertising & Campaigns', isEmailAction: false },
  { id: 'update-video-creative', label: 'Update video/creative assets', category: 'Catalog & Content', isEmailAction: false },
  { id: 'raise-walmart-ticket', label: 'Raise/escalate Walmart support ticket', category: 'Pricing & Compliance', isEmailAction: false },
  { id: 'fix-listing-data', label: 'Fix listing data/attributes (backend fields)', category: 'Catalog & Content', isEmailAction: false },
  { id: 'ranking-bsr-strategy', label: 'Ranking/BSR improvement strategy', category: 'Investigation & Analysis', isEmailAction: false },
  { id: 'prepare-presentation-deck', label: 'Prepare/deliver presentation deck', category: 'Client Communication', isEmailAction: true },
  { id: 'investigate-financial-issue', label: 'Investigate account/financial issue (chargebacks/payouts)', category: 'Investigation & Analysis', isEmailAction: false },
  { id: 'update-negative-keywords', label: 'Update negative keyword list', category: 'Advertising & Campaigns', isEmailAction: false },
  { id: 'escalate-amazon-vendor-manager', label: 'Escalate to Amazon vendor manager/support case', category: 'Pricing & Compliance', isEmailAction: false },
  { id: 'coordinate-shipping-logistics', label: 'Coordinate shipping/logistics with supplier', category: 'Inventory & Fulfillment', isEmailAction: false },
  { id: 'evaluate-client-fee-terms', label: 'Evaluate client fee/contract terms', category: 'Client Communication', isEmailAction: false },
  { id: 'investigate-return-rate', label: 'Investigate return rate issue', category: 'Investigation & Analysis', isEmailAction: false },
  { id: 'setup-inventory-alert-system', label: 'Set up inventory alert system', category: 'Inventory & Fulfillment', isEmailAction: false },
  { id: 'investigate-inventory-misallocation', label: 'Investigate inventory misallocation/bin check', category: 'Inventory & Fulfillment', isEmailAction: false },
  { id: 'fix-pricing-error', label: 'Fix pricing error/margin correction', category: 'Pricing & Compliance', isEmailAction: false },
  { id: 'investigate-buy-box-suppression', label: 'Investigate/resolve Buy Box/suppression issue', category: 'Pricing & Compliance', isEmailAction: false },
  { id: 'escalate-fba-shipment', label: 'Escalate FBA shipment/receiving issue', category: 'Inventory & Fulfillment', isEmailAction: false },
  { id: 'liquidation-excess-inventory', label: 'Liquidation/excess inventory management', category: 'Inventory & Fulfillment', isEmailAction: false },
  { id: 'manage-review-generation', label: 'Manage review generation program (Vine)', category: 'Catalog & Content', isEmailAction: false },
  { id: 'conduct-product-demo', label: 'Conduct product/tool demo for client', category: 'Client Communication', isEmailAction: false },
  { id: 'attribution-analysis', label: 'Attribution analysis (ad vs organic vs social)', category: 'Investigation & Analysis', isEmailAction: false },
  { id: 'business-development', label: 'Business development/new customer acquisition', category: 'Growth & Events', isEmailAction: false },
  { id: 'troubleshoot-technical-image-issue', label: 'Troubleshoot technical/image issue', category: 'Platform & Ops', isEmailAction: false },
  { id: 'onboard-train-client-team', label: 'Onboard/train client team member', category: 'Client Communication', isEmailAction: false },
  { id: 'setup-automation-rules', label: 'Set up/adjust automation rules (bid/budget/inventory)', category: 'Platform & Ops', isEmailAction: false },
  { id: 'conversion-rate-optimization', label: 'Conversion rate optimization analysis', category: 'Investigation & Analysis', isEmailAction: false },
  { id: 'coordinate-sample-shipment', label: 'Coordinate physical sample shipment', category: 'Inventory & Fulfillment', isEmailAction: false },
  { id: 'investigate-fulfillment-fee-classification', label: 'Investigate fulfillment/fee classification issue', category: 'Investigation & Analysis', isEmailAction: false },
  // --- Added for the alert-reasoning taxonomy (compliance/suppression/ops remediation) ---
  { id: 'resolve-policy-violation', label: 'Resolve product policy/compliance violation', category: 'Pricing & Compliance', isEmailAction: false },
  { id: 'reactivate-inactive-listing', label: 'Reactivate inactive listing', category: 'Catalog & Content', isEmailAction: false },
  { id: 'respond-negative-review', label: 'Respond to negative review/rating', category: 'Catalog & Content', isEmailAction: false },
  { id: 'resolve-billing-issue', label: 'Resolve billing/payment method issue', category: 'Platform & Ops', isEmailAction: false },
  { id: 'resolve-inventory-reimbursement-claim', label: 'File warehouse loss/damage reimbursement claim', category: 'Inventory & Fulfillment', isEmailAction: false },
  { id: 'request-fba-capacity', label: 'Request additional FBA storage capacity', category: 'Inventory & Fulfillment', isEmailAction: false },
  { id: 'resolve-shipment-dimension-issue', label: 'Resolve shipment/package dimension issue', category: 'Inventory & Fulfillment', isEmailAction: false },
];
