// @ts-nocheck -- ported verbatim from the source repo, which uses looser TS settings
// Smart Campaign Creation — domain types, mock data and pure recommendation/generation logic.
// Scope: Amazon + Walmart Sponsored Products (V1). Built from the "Smart Campaign Creation —
// Sponsored Products" requirements doc — see each section's comment for the matching spec section.

export type Marketplace = 'amazon' | 'walmart';
export type AdType = 'sponsored-products';

export interface MarketplaceCapability {
  label: string;
  adTypes: { id: AdType; label: string; available: boolean }[];
  targetingStrategies: TargetingStrategyId[];
  minDailyBudget: number;
  maxTargetAcos: number;
  campaignLimit: number;
}

export type TargetingStrategyId =
  | 'auto'
  | 'exact'
  | 'phrase'
  | 'broad'
  | 'product'
  | 'competitor'
  | 'brand'
  | 'category';

export const MANUAL_TARGETING_IDS: TargetingStrategyId[] = [
  'exact', 'phrase', 'broad', 'product', 'competitor', 'brand', 'category',
];

export interface TargetingStrategyDef {
  id: TargetingStrategyId;
  label: string;
  description: string;
}

export const TARGETING_STRATEGY_CATALOG: Record<TargetingStrategyId, TargetingStrategyDef> = {
  auto: { id: 'auto', label: 'Automatic', description: 'The marketplace automatically discovers relevant search terms and products.' },
  exact: { id: 'exact', label: 'Keyword — Exact', description: 'Targets highly specific search queries.' },
  phrase: { id: 'phrase', label: 'Keyword — Phrase', description: 'Targets search queries containing the selected phrase.' },
  broad: { id: 'broad', label: 'Keyword — Broad', description: 'Targets broader variations of the selected keyword.' },
  product: { id: 'product', label: 'Product Targeting', description: 'Targets specific products or categories.' },
  competitor: { id: 'competitor', label: 'Competitor Targeting', description: 'Targets competitor products and brands.' },
  brand: { id: 'brand', label: 'Brand Targeting', description: 'Targets searches associated with your brand.' },
  category: { id: 'category', label: 'Category Targeting', description: 'Targets products within relevant categories.' },
};

// Section 13 — Amazon vs Walmart share the same UX; capabilities differ per marketplace.
export const MARKETPLACE_CAPABILITY: Record<Marketplace, MarketplaceCapability> = {
  amazon: {
    label: 'Amazon',
    adTypes: [
      { id: 'sponsored-products', label: 'Sponsored Products', available: true },
    ],
    targetingStrategies: ['auto', 'exact', 'phrase', 'broad', 'product', 'competitor', 'brand', 'category'],
    minDailyBudget: 10,
    maxTargetAcos: 90,
    campaignLimit: 1000,
  },
  walmart: {
    label: 'Walmart',
    adTypes: [
      { id: 'sponsored-products', label: 'Sponsored Products', available: true },
    ],
    targetingStrategies: ['auto', 'exact', 'phrase', 'broad', 'product'],
    minDailyBudget: 15,
    maxTargetAcos: 75,
    campaignLimit: 500,
  },
};

// ── Products (Section 4) ──────────────────────────────────────────────────────────────────────

/** A child ASIN (variation) that rolls up under a parent product. */
export interface CcChildProduct {
  id: string;
  title: string;
  asin: string;
  sku: string;
  inventory: number;
  adSpend: number;
  adSales: number;
  acos: number;
}

export interface CcProduct {
  id: string;
  title: string;
  asin: string;
  sku: string;
  brand: string;
  category: string;
  eligible: boolean;
  ineligibleReason?: string;
  inventory: number;
  sales: number;
  adSpend: number;
  adSales: number;
  acos: number;
  hasExistingCampaign: boolean;
  thumbnailColor: string;
  children?: CcChildProduct[];
  /** Set on a child product that has been flattened into a selectable product. */
  parentTitle?: string;
}

const AMAZON_PRODUCTS: CcProduct[] = [
  { id: 'a-1', title: 'Whey Protein Isolate 1kg — Chocolate', asin: 'B08XK2QW9L', sku: 'NB-WPI-CHOC-1KG', brand: 'Nutrabay', category: 'Sports Nutrition', eligible: true, inventory: 842, sales: 128400, adSpend: 8900, adSales: 41200, acos: 21.6, hasExistingCampaign: true, thumbnailColor: '#77469b',
    children: [
      { id: 'a-1-1', title: 'Whey Protein Isolate 500g — Chocolate', asin: 'B08XK2QW01', sku: 'NB-WPI-CHOC-500G', inventory: 320, adSpend: 2100, adSales: 8400, acos: 25.0 },
      { id: 'a-1-2', title: 'Whey Protein Isolate 2kg — Chocolate', asin: 'B08XK2QW02', sku: 'NB-WPI-CHOC-2KG', inventory: 190, adSpend: 3400, adSales: 14900, acos: 22.8 },
      { id: 'a-1-3', title: 'Whey Protein Isolate 3kg — Chocolate', asin: 'B08XK2QW03', sku: 'NB-WPI-CHOC-3KG', inventory: 130, adSpend: 1900, adSales: 9100, acos: 20.9 },
      { id: 'a-1-4', title: 'Whey Protein Isolate Sample Pack 6×30g — Chocolate', asin: 'B08XK2QW04', sku: 'NB-WPI-CHOC-SMP6', inventory: 560, adSpend: 1500, adSales: 5200, acos: 28.8 },
    ],
  },
  { id: 'a-2', title: 'Whey Protein Isolate 1kg — Vanilla', asin: 'B07QW9LMN2', sku: 'NB-WPI-VAN-1KG', brand: 'Nutrabay', category: 'Sports Nutrition', eligible: true, inventory: 613, sales: 96200, adSpend: 6100, adSales: 29800, acos: 20.5, hasExistingCampaign: true, thumbnailColor: '#2f6fed' },
  { id: 'a-3', title: 'BCAA 250g — Watermelon', asin: 'B08LMN4RT8', sku: 'NB-BCAA-WM-250', brand: 'Nutrabay', category: 'Sports Nutrition', eligible: true, inventory: 1204, sales: 54300, adSpend: 3200, adSales: 11900, acos: 26.9, hasExistingCampaign: false, thumbnailColor: '#3f7d6a' },
  { id: 'a-4', title: 'Creatine Monohydrate 300g', asin: 'B06TY7HJ3K', sku: 'NB-CRT-300', brand: 'Nutrabay', category: 'Sports Nutrition', eligible: true, inventory: 95, sales: 38700, adSpend: 2100, adSales: 9400, acos: 22.3, hasExistingCampaign: false, thumbnailColor: '#a8763f' },
  { id: 'a-5', title: 'Resistance Bands Set — 5 Levels', asin: 'B09RK3PX77', sku: 'BF-RBS-5LV', brand: 'Boldfit', category: 'Fitness Equipment', eligible: true, inventory: 341, sales: 61800, adSpend: 4300, adSales: 18200, acos: 23.6, hasExistingCampaign: true, thumbnailColor: '#b3453f' },
  { id: 'a-6', title: 'Adjustable Dumbbell Set 20kg', asin: 'B08WZ2QF41', sku: 'BF-ADJ-20KG', brand: 'Boldfit', category: 'Fitness Equipment', eligible: true, inventory: 58, sales: 142300, adSpend: 11200, adSales: 52100, acos: 21.5, hasExistingCampaign: true, thumbnailColor: '#2f6fed' },
  { id: 'a-7', title: 'Yoga Mat — Extra Thick 10mm', asin: 'B07PL9QK63', sku: 'BF-YM-10MM', brand: 'Boldfit', category: 'Fitness Equipment', eligible: false, ineligibleReason: 'Out of stock', inventory: 0, sales: 28400, adSpend: 1800, adSales: 6200, acos: 29.0, hasExistingCampaign: false, thumbnailColor: '#77469b' },
  { id: 'a-8', title: 'Multivitamin Gummies 60ct', asin: 'B09XH4RT22', sku: 'WN-MVG-60', brand: 'Wellbeing Nutrition', category: 'Vitamins & Supplements', eligible: true, inventory: 720, sales: 45900, adSpend: 2700, adSales: 10300, acos: 26.2, hasExistingCampaign: false, thumbnailColor: '#3f7d6a' },
  { id: 'a-9', title: 'Plant Protein 900g — Chocolate', asin: 'B08QX7RW19', sku: 'WN-PP-CHOC-900', brand: 'Wellbeing Nutrition', category: 'Sports Nutrition', eligible: true, inventory: 410, sales: 71200, adSpend: 5400, adSales: 22600, acos: 23.9, hasExistingCampaign: true, thumbnailColor: '#a8763f' },
  { id: 'a-10', title: 'Melatonin Gummies — Night Sleep', asin: 'B07RT8QL45', sku: 'WN-MLT-NS', brand: 'Wellbeing Nutrition', category: 'Vitamins & Supplements', eligible: false, ineligibleReason: 'Not advertising eligible', inventory: 230, sales: 19800, adSpend: 0, adSales: 0, acos: 0, hasExistingCampaign: false, thumbnailColor: '#b3453f' },
  { id: 'a-11', title: 'Omega-3 Fish Oil 90 Softgels', asin: 'B08KX2QN87', sku: 'WN-OM3-90', brand: 'Wellbeing Nutrition', category: 'Vitamins & Supplements', eligible: true, inventory: 980, sales: 33600, adSpend: 1900, adSales: 7800, acos: 24.4, hasExistingCampaign: false, thumbnailColor: '#2f6fed' },
  { id: 'a-12', title: 'Pre-Workout 300g — Blue Razz', asin: 'B09LMN8QP3', sku: 'NB-PWO-BR-300', brand: 'Nutrabay', category: 'Sports Nutrition', eligible: true, inventory: 187, sales: 58900, adSpend: 4800, adSales: 16200, acos: 29.6, hasExistingCampaign: true, thumbnailColor: '#77469b' },
];

const WALMART_PRODUCTS: CcProduct[] = [
  { id: 'w-1', title: 'Whey Protein Isolate 2lb — Chocolate', asin: '9W2K4QX1', sku: 'NB-WI-WM-CHOC', brand: 'Nutrabay', category: 'Sports Nutrition', eligible: true, inventory: 410, sales: 41200, adSpend: 2600, adSales: 10400, acos: 25.0, hasExistingCampaign: true, thumbnailColor: '#77469b' },
  { id: 'w-2', title: 'BCAA Powder 250g', asin: '8K3LMN77', sku: 'NB-BCAA-WM', brand: 'Nutrabay', category: 'Sports Nutrition', eligible: true, inventory: 290, sales: 22800, adSpend: 1400, adSales: 5200, acos: 26.9, hasExistingCampaign: false, thumbnailColor: '#3f7d6a' },
  { id: 'w-3', title: 'Resistance Bands Set', asin: '7RT9QP42', sku: 'BF-RBS-WM', brand: 'Boldfit', category: 'Fitness Equipment', eligible: true, inventory: 165, sales: 18600, adSpend: 1100, adSales: 3900, acos: 28.2, hasExistingCampaign: false, thumbnailColor: '#b3453f' },
  { id: 'w-4', title: 'Adjustable Dumbbell Set', asin: '6QX8RT19', sku: 'BF-ADJ-WM', brand: 'Boldfit', category: 'Fitness Equipment', eligible: false, ineligibleReason: 'Out of stock', inventory: 0, sales: 51200, adSpend: 0, adSales: 0, acos: 0, hasExistingCampaign: false, thumbnailColor: '#2f6fed' },
  { id: 'w-5', title: 'Multivitamin Gummies 60ct', asin: '5LMN3QK8', sku: 'WN-MVG-WM', brand: 'Wellbeing Nutrition', category: 'Vitamins & Supplements', eligible: true, inventory: 530, sales: 15900, adSpend: 900, adSales: 3100, acos: 29.0, hasExistingCampaign: false, thumbnailColor: '#a8763f' },
  { id: 'w-6', title: 'Plant Protein 2lb — Chocolate', asin: '4RT7QX56', sku: 'WN-PP-WM-CHOC', brand: 'Wellbeing Nutrition', category: 'Sports Nutrition', eligible: true, inventory: 240, sales: 26400, adSpend: 1800, adSales: 6900, acos: 26.1, hasExistingCampaign: true, thumbnailColor: '#3f7d6a' },
];

/** Parents followed by their children, each child as a standalone selectable product that inherits the parent's attributes. */
export function flattenProducts(products: CcProduct[]): CcProduct[] {
  return products.flatMap((p) => [
    p,
    ...(p.children ?? []).map((k): CcProduct => ({
      id: k.id, title: k.title, asin: k.asin, sku: k.sku, brand: p.brand, category: p.category, eligible: p.eligible,
      inventory: k.inventory, sales: Math.round(k.adSales * 3.1), adSpend: k.adSpend, adSales: k.adSales, acos: k.acos,
      hasExistingCampaign: p.hasExistingCampaign, thumbnailColor: p.thumbnailColor, parentTitle: p.title,
    })),
  ]);
}

export function productsFor(marketplace: Marketplace): CcProduct[] {
  return marketplace === 'amazon' ? AMAZON_PRODUCTS : WALMART_PRODUCTS;
}

// ── Budget recommendation (Section 5) ────────────────────────────────────────────────────────

/** Scales recent daily ad spend up 15% to leave room for the new campaigns alongside it. */
export function recommendedBudget(products: CcProduct[]): number {
  if (products.length === 0) return 50;
  const recentDailySpend = products.reduce((sum, p) => sum + p.adSpend, 0) / 30;
  const base = Math.max(10, Math.round(recentDailySpend * 1.15));
  return Math.min(2000, Math.round(base / 5) * 5);
}

// ── Grouping (Section 4.4) ────────────────────────────────────────────────────────────────────

export type GroupingMode = 'split-by-campaign' | 'split-by-ad-group';

export function recommendGroupingMode(products: CcProduct[], dailyBudget: number): GroupingMode {
  if (products.length <= 1) return 'split-by-campaign';
  const perProductBudget = dailyBudget / products.length;
  return perProductBudget >= 15 ? 'split-by-campaign' : 'split-by-ad-group';
}

// ── Targeting strategy recommendation (Section 6) ────────────────────────────────────────────

export function recommendTargetingStrategies(products: CcProduct[], marketplace: Marketplace): TargetingStrategyId[] {
  const supported = MARKETPLACE_CAPABILITY[marketplace].targetingStrategies;
  const hasHistory = products.some((p) => p.adSpend > 0);
  const base: TargetingStrategyId[] = ['auto', 'exact', 'phrase'];
  const withBroad: TargetingStrategyId[] = hasHistory ? base : [...base, 'broad'];
  return withBroad.filter((s) => supported.includes(s));
}

// ── Campaign structures (Section 7) ───────────────────────────────────────────────────────────

export type StructureId =
  | 'consolidated'
  | 'targeting-type'
  | 'product-targeting'
  | 'product-single-auto'
  | 'product-multi-auto'
  | 'custom';

export interface StructureDef {
  id: StructureId;
  number: number;
  name: string;
  tagline: string;
  description: string;
  useCase: string;
  granularity: 'Low' | 'Medium' | 'High' | 'Very High' | 'Custom';
  productSeparation: boolean;
}

export const STRUCTURE_CATALOG: StructureDef[] = [
  {
    id: 'consolidated', number: 1, name: 'Consolidated', tagline: 'One Auto + one Manual, total',
    description: 'All selected targeting lives in one Auto campaign and one Manual campaign, in a single ad group each.',
    useCase: 'Fewer campaigns, simplified management, consolidated budgets.',
    granularity: 'Low', productSeparation: false,
  },
  {
    id: 'targeting-type', number: 2, name: 'Targeting-Type', tagline: 'One Auto + Manual campaigns by type',
    description: 'One Auto campaign, plus a separate Manual campaign for every selected targeting type.',
    useCase: 'Manage keyword match types and product targeting independently, without splitting by product.',
    granularity: 'Medium', productSeparation: false,
  },
  {
    id: 'product-targeting', number: 3, name: 'Product + Targeting', tagline: 'Campaigns split by product and type',
    description: 'Every selected product gets its own Auto campaign and its own set of Manual campaigns, one per targeting type.',
    useCase: 'Full product-level budget control, performance reporting and bid management.',
    granularity: 'High', productSeparation: true,
  },
  {
    id: 'product-single-auto', number: 4, name: 'Product + Single Auto', tagline: 'One Auto per product, Manual split by type',
    description: 'Each product gets exactly one consolidated Auto campaign, while Manual campaigns stay split by targeting type.',
    useCase: 'Product-level control while keeping each product’s Auto targeting in one place.',
    granularity: 'High', productSeparation: true,
  },
  {
    id: 'product-multi-auto', number: 5, name: 'Product + Multiple Auto', tagline: 'Maximum predefined separation',
    description: 'The most granular option — Auto and Manual campaigns are both split per product and per targeting type.',
    useCase: 'Users who need maximum campaign-level control and granular optimization.',
    granularity: 'Very High', productSeparation: true,
  },
  {
    id: 'custom', number: 6, name: 'Custom', tagline: 'Describe it, Jiva builds it',
    description: 'Describe your desired campaign structure in plain language and Jiva generates a proposed structure to review.',
    useCase: 'Anything the five predefined structures don’t cover.',
    granularity: 'Custom', productSeparation: false,
  },
];

export interface StructureCounts {
  autoCampaigns: number;
  manualCampaigns: number;
  totalCampaigns: number;
  adGroups: number;
  targets: number;
}

// Auto targeting sub-types — Structure 5 creates one Auto campaign per selected type, per product (§7.2).
export type AutoTypeId = 'close-match' | 'loose-match' | 'substitutes' | 'complements';
export const AUTO_TYPE_CATALOG: { id: AutoTypeId; label: string; description: string }[] = [
  { id: 'close-match', label: 'Close match', description: 'Shoppers searching terms closely related to your product.' },
  { id: 'loose-match', label: 'Loose match', description: 'Shoppers searching terms loosely related to your product.' },
  { id: 'substitutes', label: 'Substitutes', description: 'Shoppers viewing detail pages of similar products.' },
  { id: 'complements', label: 'Complements', description: 'Shoppers viewing detail pages of complementary products.' },
];

// Section 7.6 — account-level campaign limits. `used` is mock data for what the account already has live.
export const ACCOUNT_CAMPAIGNS_USED: Record<Marketplace, number> = { amazon: 880, walmart: 410 };
export function accountCampaignLimits(marketplace: Marketplace): { limit: number; used: number; available: number } {
  const limit = MARKETPLACE_CAPABILITY[marketplace].campaignLimit;
  const used = ACCOUNT_CAMPAIGNS_USED[marketplace];
  return { limit, used, available: Math.max(limit - used, 0) };
}

/** Section 7.4 — Campaign Count Calculation. `manualTypesCount` excludes 'auto'. */
export function structureCounts(
  structureId: StructureId,
  productCount: number,
  hasAuto: boolean,
  manualTypesCount: number,
  autoTypesCount = 1,
): StructureCounts {
  const p = Math.max(productCount, 0);
  const m = Math.max(manualTypesCount, 0);
  const auto = hasAuto ? 1 : 0;

  switch (structureId) {
    case 'consolidated': {
      const autoCampaigns = auto;
      const manualCampaigns = m > 0 ? 1 : 0;
      return { autoCampaigns, manualCampaigns, totalCampaigns: autoCampaigns + manualCampaigns, adGroups: autoCampaigns + manualCampaigns, targets: m + auto };
    }
    case 'targeting-type': {
      const autoCampaigns = auto;
      const manualCampaigns = m;
      return { autoCampaigns, manualCampaigns, totalCampaigns: autoCampaigns + manualCampaigns, adGroups: autoCampaigns + manualCampaigns, targets: m + auto };
    }
    case 'product-targeting': {
      const autoCampaigns = auto * p;
      const manualCampaigns = m * p;
      return { autoCampaigns, manualCampaigns, totalCampaigns: autoCampaigns + manualCampaigns, adGroups: autoCampaigns + manualCampaigns, targets: (m + auto) * p };
    }
    case 'product-single-auto': {
      const autoCampaigns = auto * p;
      const manualCampaigns = m * p;
      return { autoCampaigns, manualCampaigns, totalCampaigns: autoCampaigns + manualCampaigns, adGroups: autoCampaigns + manualCampaigns, targets: (m + auto) * p };
    }
    case 'product-multi-auto': {
      // One Auto campaign per selected Auto type, per product (spec §7.2, Structure 5).
      const types = Math.max(autoTypesCount, 1);
      const autoCampaigns = auto * p * types;
      const manualCampaigns = m * p;
      return { autoCampaigns, manualCampaigns, totalCampaigns: autoCampaigns + manualCampaigns, adGroups: autoCampaigns + manualCampaigns, targets: (auto * types + m) * p };
    }
    case 'custom':
    default:
      return { autoCampaigns: 0, manualCampaigns: 0, totalCampaigns: 0, adGroups: 0, targets: 0 };
  }
}

export interface StructureRecommendation {
  structureId: StructureId;
  reason: string;
}

/** Section 7.5 — Structure Recommendation. */
export function recommendStructure(
  productCount: number,
  manualTypesCount: number,
  dailyBudget: number,
  campaignLimit: number,
): StructureRecommendation {
  const perProductBudget = dailyBudget / Math.max(productCount, 1);
  if (productCount <= 1) {
    return { structureId: 'targeting-type', reason: 'A single product with multiple targeting types is best served by keeping each type in its own campaign.' };
  }
  const productTargetingTotal = structureCounts('product-targeting', productCount, true, manualTypesCount).totalCampaigns;
  if (productTargetingTotal > campaignLimit * 0.8) {
    return { structureId: 'targeting-type', reason: `You selected ${manualTypesCount + 1} targeting types across ${productCount} products. This structure keeps targeting types separate while avoiding a large number of product-level campaigns.` };
  }
  if (perProductBudget < 15) {
    return { structureId: 'consolidated', reason: 'Your daily budget is tight relative to the number of selected products — consolidating into fewer campaigns keeps each one adequately funded.' };
  }
  return { structureId: 'product-targeting', reason: `Your budget comfortably supports one campaign per product and targeting type (${productTargetingTotal} campaigns), giving you full product-level control.` };
}

export function validateCampaignLimit(count: number, limit: number): { ok: boolean; message?: string } {
  if (count <= limit) return { ok: true };
  return { ok: false, message: `This structure will create ${count.toLocaleString()} campaigns, but only ${limit.toLocaleString()} are available for this account.` };
}

// ── Campaign generation (feeds the Preview step) ─────────────────────────────────────────────

// Section 8.6 — where a targeting item came from.
export type TargetSource = 'Platform recommendation' | 'Anarix recommendation' | 'Custom input' | 'Keyword list' | 'Labels / tags';
export const TARGET_SOURCES: TargetSource[] = ['Platform recommendation', 'Anarix recommendation', 'Custom input', 'Keyword list', 'Labels / tags'];

export interface CcTarget {
  id: string;
  label: string;
  matchType: TargetingStrategyId;
  bid: number;
  source: TargetSource;
}

/** Section 8.5 — negative keyword / negative product target on an ad group. */
export interface CcNegative {
  id: string;
  text: string;
  kind: 'keyword' | 'product';
}

export interface CcAdGroup {
  id: string;
  name: string;
  productIds: string[];
  targets: CcTarget[];
  negatives: CcNegative[];
}

export type BiddingStrategy = 'Fixed bids' | 'Dynamic bids - down only' | 'Dynamic bids - up and down';
export const BIDDING_STRATEGIES: BiddingStrategy[] = ['Fixed bids', 'Dynamic bids - down only', 'Dynamic bids - up and down'];

/** Percent change to the bid per placement; null means no adjustment. */
export interface PlacementAdjust { top: number | null; product: number | null; rest: number | null }

export interface CcCampaign {
  id: string;
  name: string;
  kind: 'auto' | 'manual';
  targetingLabel: string;
  productIds: string[];
  adGroups: CcAdGroup[];
  dailyBudget: number;
  budgetAllocationPct: number;
  biddingStrategy?: BiddingStrategy;
  placement?: PlacementAdjust;
  /** Section 16 — a product in this campaign already has a live campaign. */
  possibleDuplicate?: boolean;
}

// ── Rules (Section 8.7) — existing account Rules that new campaigns can be assigned to ──────────

export type RuleType = 'Budget' | 'Placement' | 'Inventory' | 'Bid' | 'Performance' | 'Pause / Enable';
export type RuleScope = 'Campaign' | 'Ad group' | 'Account';

export interface CcRule {
  id: string;
  name: string;
  type: RuleType;
  status: 'Active' | 'Inactive';
  description: string;
  conditions: string;
  actions: string;
  scope: RuleScope;
  adType: 'Sponsored Products' | 'Sponsored Brands';
  marketplaces: Marketplace[];
  /** Campaigns that already use this Rule. */
  assignedCampaigns: number;
}

export const RULE_TYPES: RuleType[] = ['Budget', 'Placement', 'Inventory', 'Bid', 'Performance', 'Pause / Enable'];

export const MOCK_RULES: CcRule[] = [
  { id: 'r-budget', name: 'Budget Allocation — High Performers', type: 'Budget', status: 'Active', description: 'Automatically reallocates budget toward campaigns meeting the defined performance conditions.', conditions: 'ACOS below target for 7 days and spend above 80% of budget', actions: 'Raise daily budget by 15%, up to 2× the original', scope: 'Campaign', adType: 'Sponsored Products', marketplaces: ['amazon', 'walmart'], assignedCampaigns: 24 },
  { id: 'r-placement', name: 'Placement Optimization', type: 'Placement', status: 'Active', description: 'Optimizes placement performance by adjusting top-of-search bid modifiers.', conditions: 'Top-of-search ACOS differs from campaign ACOS by more than 10 points', actions: 'Adjust placement modifier by ±10%', scope: 'Campaign', adType: 'Sponsored Products', marketplaces: ['amazon'], assignedCampaigns: 31 },
  { id: 'r-inventory', name: 'Inventory Protection', type: 'Inventory', status: 'Active', description: 'Controls campaigns based on inventory so you stop paying for clicks you cannot fulfil.', conditions: 'Available inventory drops below 14 days of cover', actions: 'Pause the campaign and re-enable once restocked', scope: 'Campaign', adType: 'Sponsored Products', marketplaces: ['amazon', 'walmart'], assignedCampaigns: 12 },
  { id: 'r-bid', name: 'Low ACOS Bid Optimization', type: 'Bid', status: 'Active', description: 'Raises bids on targets that convert efficiently and trims bids on the rest.', conditions: 'Target ACOS under 20% with at least 10 clicks', actions: 'Increase bid by 8%, capped at $3.00', scope: 'Ad group', adType: 'Sponsored Products', marketplaces: ['amazon', 'walmart'], assignedCampaigns: 18 },
  { id: 'r-monitor', name: 'Campaign Performance Monitor', type: 'Performance', status: 'Active', description: 'Monitors campaign performance and notifies you when something drifts.', conditions: 'ACOS above 35% or spend with zero orders for 5 days', actions: 'Send an alert to the campaign owner', scope: 'Campaign', adType: 'Sponsored Products', marketplaces: ['amazon', 'walmart'], assignedCampaigns: 40 },
  { id: 'r-pause', name: 'Weekend Pause Schedule', type: 'Pause / Enable', status: 'Inactive', description: 'Pauses campaigns on weekends and re-enables them on Monday morning.', conditions: 'Every Saturday 00:00', actions: 'Pause campaigns, re-enable Monday 06:00', scope: 'Campaign', adType: 'Sponsored Products', marketplaces: ['amazon'], assignedCampaigns: 0 },
  { id: 'r-sb-placement', name: 'Brand Placement Boost', type: 'Placement', status: 'Active', description: 'Boosts placement bids on branded campaigns.', conditions: 'Brand share of voice below 60%', actions: 'Raise placement modifier by 20%', scope: 'Campaign', adType: 'Sponsored Brands', marketplaces: ['amazon'], assignedCampaigns: 9 },
  { id: 'r-wm-budget', name: 'Walmart Daily Budget Pacing', type: 'Budget', status: 'Active', description: 'Paces daily spend across the day for Walmart campaigns.', conditions: 'Budget exhausted before 3 PM', actions: 'Spread the remaining budget evenly', scope: 'Campaign', adType: 'Sponsored Products', marketplaces: ['walmart'], assignedCampaigns: 6 },
];

/** Why a Rule can't be assigned to the generated campaigns, or null when it's compatible. */
export function ruleIncompatibility(rule: CcRule, marketplace: Marketplace): string | null {
  if (rule.adType !== 'Sponsored Products') return `This Rule is configured for ${rule.adType} and cannot be assigned to Sponsored Products.`;
  if (!rule.marketplaces.includes(marketplace)) return `This Rule only applies to ${rule.marketplaces.map((m) => MARKETPLACE_CAPABILITY[m].label).join(' and ')} campaigns.`;
  if (rule.status === 'Inactive') return 'This Rule is inactive. Turn it on from Rules before assigning campaigns to it.';
  return null;
}

/** Existing Rules worth highlighting for this set of products — never creates or edits one. */
export function recommendedRules(products: CcProduct[]): { ruleId: string; reason: string }[] {
  const out: { ruleId: string; reason: string }[] = [];
  if (products.some((p) => p.inventory < 200)) out.push({ ruleId: 'r-inventory', reason: 'Some of your selected products have limited inventory, and this Rule is commonly used with them.' });
  if (products.length > 1) out.push({ ruleId: 'r-budget', reason: 'With several products competing for one budget, this Rule moves spend toward the campaigns that perform.' });
  return out;
}

const KEYWORD_SEEDS: Record<string, string[]> = {
  'Sports Nutrition': ['whey protein isolate', 'protein powder chocolate', 'bcaa supplement', 'creatine monohydrate', 'pre workout powder'],
  'Fitness Equipment': ['resistance bands set', 'adjustable dumbbells', 'yoga mat non slip', 'home gym equipment'],
  'Vitamins & Supplements': ['multivitamin gummies', 'omega 3 fish oil', 'melatonin sleep aid'],
};

function keywordsFor(product: CcProduct, count: number): string[] {
  const pool = KEYWORD_SEEDS[product.category] ?? ['best seller', 'top rated', 'daily essential'];
  return Array.from({ length: count }, (_, i) => pool[i % pool.length]);
}

function bidFor(product: CcProduct): number {
  const base = product.acos > 0 ? Math.max(0.35, 12 / product.acos) : 0.75;
  return Math.round(base * 100) / 100;
}

function manualTarget(product: CcProduct, matchType: TargetingStrategyId, idx: number): CcTarget {
  const label = matchType === 'product'
    ? `${product.asin} — competitor ASINs`
    : matchType === 'competitor' ? `${product.brand} competitors`
    : matchType === 'brand' ? `${product.brand} branded terms`
    : matchType === 'category' ? product.category
    : keywordsFor(product, 3)[idx % 3];
  return { id: `t-${product.id}-${matchType}-${idx}`, label, matchType, bid: bidFor(product), source: idx % 2 === 0 ? 'Anarix recommendation' : 'Platform recommendation' };
}

/** Builds the real campaign/ad-group/target tree for the chosen structure — this is what the
 * Preview step and the (simulated) creation step both render and submit. */
export function generateCampaigns(
  structureId: StructureId,
  products: CcProduct[],
  strategies: TargetingStrategyId[],
  dailyBudget: number,
  autoTypes: AutoTypeId[] = ['close-match'],
): CcCampaign[] {
  const hasAuto = strategies.includes('auto');
  const manualTypes = strategies.filter((s) => s !== 'auto');
  if (products.length === 0 || (!hasAuto && manualTypes.length === 0)) return [];

  const campaigns: CcCampaign[] = [];
  const push = (c: Omit<CcCampaign, 'budgetAllocationPct'>) => campaigns.push({ ...c, budgetAllocationPct: 0 });

  const seedNegatives = (idPrefix: string): CcNegative[] => [{ id: `${idPrefix}-neg-1`, text: 'free sample', kind: 'keyword' }];
  const autoAdGroup = (products: CcProduct[], idPrefix: string, name = 'Auto Ad Group'): CcAdGroup => ({
    id: `${idPrefix}-ag`, name, productIds: products.map((p) => p.id), targets: [], negatives: seedNegatives(idPrefix),
  });
  const manualAdGroup = (products: CcProduct[], types: TargetingStrategyId[], idPrefix: string): CcAdGroup => ({
    id: `${idPrefix}-ag`, name: 'Manual Ad Group', productIds: products.map((p) => p.id),
    targets: types.flatMap((t) => products.flatMap((p, i) => [manualTarget(p, t, i)])),
    negatives: seedNegatives(idPrefix),
  });
  const autoTypeLabel = (id: AutoTypeId) => AUTO_TYPE_CATALOG.find((a) => a.id === id)?.label ?? id;

  if (structureId === 'consolidated') {
    if (hasAuto) push({ id: 'c-auto', name: 'Auto Campaign', kind: 'auto', targetingLabel: 'Automatic', productIds: products.map((p) => p.id), adGroups: [autoAdGroup(products, 'c-auto')], dailyBudget: 0 });
    if (manualTypes.length) push({ id: 'c-manual', name: 'Manual Campaign', kind: 'manual', targetingLabel: manualTypes.map((t) => TARGETING_STRATEGY_CATALOG[t].label).join(' + '), productIds: products.map((p) => p.id), adGroups: [manualAdGroup(products, manualTypes, 'c-manual')], dailyBudget: 0 });
  } else if (structureId === 'targeting-type') {
    if (hasAuto) push({ id: 'c-auto', name: 'Auto Campaign', kind: 'auto', targetingLabel: 'Automatic', productIds: products.map((p) => p.id), adGroups: [autoAdGroup(products, 'c-auto')], dailyBudget: 0 });
    manualTypes.forEach((t) => {
      const label = TARGETING_STRATEGY_CATALOG[t].label;
      push({ id: `c-manual-${t}`, name: `Manual Campaign — ${label}`, kind: 'manual', targetingLabel: label, productIds: products.map((p) => p.id), adGroups: [manualAdGroup(products, [t], `c-manual-${t}`)], dailyBudget: 0 });
    });
  } else if (structureId === 'product-targeting' || structureId === 'product-single-auto' || structureId === 'product-multi-auto') {
    products.forEach((product) => {
      if (hasAuto && structureId === 'product-multi-auto') {
        (autoTypes.length ? autoTypes : ['close-match' as AutoTypeId]).forEach((at) => {
          push({ id: `c-${product.id}-auto-${at}`, name: `${product.title} — Auto (${autoTypeLabel(at)})`, kind: 'auto', targetingLabel: `Automatic · ${autoTypeLabel(at)}`, productIds: [product.id], adGroups: [autoAdGroup([product], `c-${product.id}-auto-${at}`, `Auto Ad Group — ${autoTypeLabel(at)}`)], dailyBudget: 0 });
        });
      } else if (hasAuto) push({ id: `c-${product.id}-auto`, name: `${product.title} — Auto`, kind: 'auto', targetingLabel: 'Automatic', productIds: [product.id], adGroups: [autoAdGroup([product], `c-${product.id}-auto`)], dailyBudget: 0 });
      manualTypes.forEach((t) => {
        const label = TARGETING_STRATEGY_CATALOG[t].label;
        push({ id: `c-${product.id}-${t}`, name: `${product.title} — ${label}`, kind: 'manual', targetingLabel: label, productIds: [product.id], adGroups: [manualAdGroup([product], [t], `c-${product.id}-${t}`)], dailyBudget: 0 });
      });
    });
  }

  campaigns.forEach((c) => { c.possibleDuplicate = c.productIds.some((id) => products.find((p) => p.id === id)?.hasExistingCampaign); });

  // Even budget split across campaigns, rounded to the cent, remainder on the first campaign.
  const share = campaigns.length ? Math.floor((dailyBudget / campaigns.length) * 100) / 100 : 0;
  let allocated = 0;
  campaigns.forEach((c, i) => {
    c.dailyBudget = i === campaigns.length - 1 ? Math.round((dailyBudget - allocated) * 100) / 100 : share;
    allocated += c.dailyBudget;
    c.budgetAllocationPct = dailyBudget > 0 ? Math.round((c.dailyBudget / dailyBudget) * 1000) / 10 : 0;
  });

  return campaigns;
}

export function totalAdGroups(campaigns: CcCampaign[]): number {
  return campaigns.reduce((sum, c) => sum + c.adGroups.length, 0);
}

export function totalTargets(campaigns: CcCampaign[]): number {
  return campaigns.reduce((sum, c) => sum + c.adGroups.reduce((s, ag) => s + ag.targets.length, 0), 0);
}

// ── Draft state ───────────────────────────────────────────────────────────────────────────────

export type CcStepId = 'entry' | 'products' | 'objectives' | 'targeting' | 'structure' | 'preview' | 'creating' | 'result';

export const STEP_ORDER: CcStepId[] = ['entry', 'products', 'objectives', 'targeting', 'structure', 'preview', 'creating', 'result'];

/** Objectives beyond Target ACOS and Daily budget — all optional. */
export type ExtraObjectiveId = 'roas' | 'maxCpc' | 'cvr' | 'monthlyCap';
export type ExtraObjectives = Record<ExtraObjectiveId, number | null>;
export const NO_EXTRA_OBJECTIVES: ExtraObjectives = { roas: null, maxCpc: null, cvr: null, monthlyCap: null };

export interface CcDraft {
  marketplace: Marketplace | null;
  adType: AdType | null;
  productIds: string[];
  groupingMode: GroupingMode;
  targetAcos: number | null;
  dailyBudget: number;
  extraObjectives: ExtraObjectives;
  targetingStrategies: TargetingStrategyId[];
  /** Auto targeting types — drives how many Auto campaigns Structure 5 creates per product. */
  autoTypes: AutoTypeId[];
  structureId: StructureId | null;
  customPrompt: string;
  customCampaigns: CcCampaign[] | null;
  /** Snapshot taken when the Preview step is reached — lets the user edit per-campaign budget
   * allocation there without it being recomputed (and the edits lost) on every render. */
  generatedCampaigns: CcCampaign[] | null;
  /** Existing Rules to assign the new campaigns to (§8.7). Smart Creation never creates or edits a Rule. */
  ruleIds: string[];
  ruleScope: 'all' | 'selected';
  /** Campaigns that get the Rules when `ruleScope` is 'selected'. */
  ruleCampaignIds: string[];
}

export const EMPTY_DRAFT: CcDraft = {
  marketplace: 'amazon',
  adType: null,
  productIds: [],
  groupingMode: 'split-by-campaign',
  targetAcos: null,
  dailyBudget: 50,
  extraObjectives: NO_EXTRA_OBJECTIVES,
  targetingStrategies: [],
  autoTypes: ['close-match', 'loose-match'],
  structureId: null,
  customPrompt: '',
  customCampaigns: null,
  generatedCampaigns: null,
  ruleIds: [],
  ruleScope: 'all',
  ruleCampaignIds: [],
};

export function formatCurrency(n: number): string {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
