import { CcProduct, CcRule, DEFAULT_KEYWORDS, MOCK_AMAZON_PRODUCTS, MOCK_KEYWORD_POOL, MOCK_RULES, MOCK_WALMART_PRODUCTS } from '@/constants/advertising/mock-campaign-creator-data';

export type { CcProduct, CcRule };

export type CcStepId = 'setup' | 'products' | 'objectives' | 'targeting' | 'structure' | 'rules' | 'preview' | 'result';

export type CcMarketplace = 'amazon' | 'walmart';
export type CcGrouping = 'separate' | 'group';
export type CcObjective = 'grow-sales' | 'improve-efficiency' | 'launch-discover';
export type CcStrategyId = 'automatic' | 'exact' | 'phrase' | 'broad' | 'product' | 'competitor' | 'brand' | 'category';
export type CcStructureId = 'consolidated' | 'targeting-type' | 'product-targeting' | 'product-single-auto' | 'product-multiple-auto' | 'custom';
export type CcTargetSource = 'platform' | 'anarix' | 'custom';

export interface CcStrategyMeta {
  id: CcStrategyId;
  title: string;
  description: string;
  amazonOnly?: boolean;
}

export const STRATEGY_CATALOG: CcStrategyMeta[] = [
  { id: 'automatic', title: 'Automatic', description: 'Let Amazon discover relevant search terms and products.' },
  { id: 'exact', title: 'Keyword — Exact', description: 'Capture high-intent searches matching your keywords closely.' },
  { id: 'phrase', title: 'Keyword — Phrase', description: 'Reach searches containing your selected phrases.' },
  { id: 'broad', title: 'Keyword — Broad', description: 'Expand discovery through broader keyword variations.' },
  { id: 'product', title: 'Product Targeting', description: 'Target specific products, categories or competitors.', amazonOnly: true },
  { id: 'competitor', title: 'Competitor Targeting', description: 'Target competitor products/brands.', amazonOnly: true },
  { id: 'brand', title: 'Brand Targeting', description: 'Target searches associated with a brand.', amazonOnly: true },
  { id: 'category', title: 'Category Targeting', description: 'Target products within relevant categories.', amazonOnly: true },
];

export function strategiesFor(marketplace: CcMarketplace | null): CcStrategyMeta[] {
  if (marketplace === 'walmart') return STRATEGY_CATALOG.filter((s) => !s.amazonOnly);
  return STRATEGY_CATALOG;
}

export const RECOMMENDED_STRATEGY_IDS: CcStrategyId[] = ['automatic', 'exact', 'phrase'];

export interface CcStructureMeta {
  id: CcStructureId;
  title: string;
  useCase: string;
  autoLabel: string;
  manualLabel: string;
  productSeparation: boolean;
  granularity: 'Low' | 'Medium' | 'High' | 'Very High';
}

export const STRUCTURE_CATALOG: CcStructureMeta[] = [
  { id: 'consolidated', title: 'Consolidated', useCase: 'Fewer campaigns, simplified management, consolidated budgets.', autoLabel: '1', manualLabel: '1', productSeparation: false, granularity: 'Low' },
  { id: 'targeting-type', title: 'Targeting-Type', useCase: 'Manage keyword match types and product targeting independently.', autoLabel: '1', manualLabel: 'Multiple by type', productSeparation: false, granularity: 'Medium' },
  { id: 'product-targeting', title: 'Product + Targeting', useCase: 'Product-level budget, performance and targeting control.', autoLabel: '1 per product', manualLabel: 'Multiple per product', productSeparation: true, granularity: 'High' },
  { id: 'product-single-auto', title: 'Product + Single Auto', useCase: 'Product-level control, one consolidated Auto campaign per product.', autoLabel: '1 per product', manualLabel: 'Multiple per product', productSeparation: true, granularity: 'High' },
  { id: 'product-multiple-auto', title: 'Product + Multiple Auto', useCase: 'Maximum granularity — independent management of every match type.', autoLabel: 'Multiple per product', manualLabel: 'Multiple per product', productSeparation: true, granularity: 'Very High' },
  { id: 'custom', title: 'Custom', useCase: 'Describe how you want your campaigns organized and Jiva builds it.', autoLabel: 'User-defined', manualLabel: 'User-defined', productSeparation: true, granularity: 'Very High' },
];

export const CAMPAIGN_LIMIT = 40;

export const AUTO_SUBGROUPS = [
  { id: 'closeMatch', label: 'Close Match' },
  { id: 'looseMatch', label: 'Loose Match' },
  { id: 'substitutes', label: 'Substitutes' },
  { id: 'complements', label: 'Complements' },
];

const KEYWORDS_PER_PRODUCT_PER_TYPE = 3;
const PRODUCT_TARGETS_PER_PRODUCT = 2;
const EXTRA_TARGETS_PER_PRODUCT = 2;

export interface CcTarget {
  id: string;
  label: string;
  matchType: string;
  bid: number;
  source: CcTargetSource;
  negative?: boolean;
}

export interface CcAdGroup {
  id: string;
  name: string;
  productIds: string[];
  targets: CcTarget[];
}

export interface CcGeneratedCampaign {
  id: string;
  name: string;
  kind: 'auto' | 'manual';
  productIds: string[];
  adGroups: CcAdGroup[];
  dailyBudget: number;
  ruleIds: string[];
}

export interface CcDraft {
  marketplace: CcMarketplace | null;
  advertiserId: string;

  selectedProductIds: string[];
  grouping: CcGrouping | null;

  objective: CcObjective | null;
  targetAcos: string;
  dailyBudget: string;

  targetingStrategies: CcStrategyId[];

  structure: CcStructureId | null;
  jivaPrompt: string;
  jivaTree: CcGeneratedCampaign[] | null;

  selectedRuleIds: string[];
  rulesApplyTo: 'all' | 'selected';
  selectedCampaignIdsForRules: string[];

  aiManagementEnabled: boolean;

  campaignBudgetOverrides: Record<string, number>;
}

export const EMPTY_DRAFT: CcDraft = {
  marketplace: null,
  advertiserId: '',

  selectedProductIds: [],
  grouping: null,

  objective: 'grow-sales',
  targetAcos: '25',
  dailyBudget: '',

  targetingStrategies: [...RECOMMENDED_STRATEGY_IDS],

  structure: null,
  jivaPrompt: '',
  jivaTree: null,

  selectedRuleIds: [],
  rulesApplyTo: 'all',
  selectedCampaignIdsForRules: [],

  aiManagementEnabled: true,

  campaignBudgetOverrides: {},
};

export function productsFor(marketplace: CcMarketplace | null): CcProduct[] {
  return marketplace === 'walmart' ? MOCK_WALMART_PRODUCTS : MOCK_AMAZON_PRODUCTS;
}

export function selectedProducts(draft: CcDraft): CcProduct[] {
  const catalog = productsFor(draft.marketplace);
  return catalog.filter((p) => draft.selectedProductIds.includes(p.id));
}

export function manualStrategies(draft: CcDraft): CcStrategyId[] {
  return draft.targetingStrategies.filter((s) => s !== 'automatic');
}

let idSeq = 0;
export function nextCcId(prefix: string): string {
  idSeq += 1;
  return `${prefix}-${idSeq}`;
}

function strategyTitle(id: CcStrategyId): string {
  return STRATEGY_CATALOG.find((s) => s.id === id)?.title.replace('Keyword — ', '') ?? id;
}

/** Every generated campaign has exactly one ad group in every worked example in the spec — this
 * keeps ad-group count numerically equal to campaign count everywhere except the custom Jiva tree,
 * which defines its own ad groups directly. */
export function structureCounts(structureId: CcStructureId, draft: CcDraft, products: CcProduct[]): { campaigns: number; adGroups: number; targets: number } {
  const P = products.length;
  const hasAuto = draft.targetingStrategies.includes('automatic');
  const manual = manualStrategies(draft);
  const M = manual.length;
  const targets = targetTotal(draft, products);

  if (structureId === 'custom') {
    const tree = draft.jivaTree ?? [];
    return { campaigns: tree.length, adGroups: tree.reduce((s, c) => s + c.adGroups.length, 0), targets };
  }

  let campaigns = 0;
  switch (structureId) {
    case 'consolidated':
      campaigns = (hasAuto ? 1 : 0) + (M > 0 ? 1 : 0);
      break;
    case 'targeting-type':
      campaigns = (hasAuto ? 1 : 0) + M;
      break;
    case 'product-targeting':
    case 'product-single-auto':
      campaigns = P * ((hasAuto ? 1 : 0) + M);
      break;
    case 'product-multiple-auto':
      campaigns = P * ((hasAuto ? AUTO_SUBGROUPS.length : 0) + M);
      break;
  }
  return { campaigns, adGroups: campaigns, targets };
}

export function targetTotal(draft: CcDraft, products: CcProduct[]): number {
  const P = products.length;
  let total = 0;
  if (draft.targetingStrategies.includes('automatic')) total += P;
  (['exact', 'phrase', 'broad'] as CcStrategyId[]).forEach((t) => {
    if (draft.targetingStrategies.includes(t)) total += P * KEYWORDS_PER_PRODUCT_PER_TYPE;
  });
  if (draft.targetingStrategies.includes('product')) total += P * PRODUCT_TARGETS_PER_PRODUCT;
  (['competitor', 'brand', 'category'] as CcStrategyId[]).forEach((t) => {
    if (draft.targetingStrategies.includes(t)) total += P * EXTRA_TARGETS_PER_PRODUCT;
  });
  return total;
}

export function isStructureAvailable(structureId: CcStructureId, draft: CcDraft, products: CcProduct[]): boolean {
  if (structureId === 'custom') return true;
  return structureCounts(structureId, draft, products).campaigns <= CAMPAIGN_LIMIT;
}

/** Steered primarily by the product-grouping choice from the Products step: "separate" leans toward
 * product-level structures, "group" leans toward consolidated ones — falling back to a smaller
 * structure whenever the natural pick would exceed the campaign limit. */
export function recommendStructure(draft: CcDraft, products: CcProduct[]): CcStructureId {
  const M = manualStrategies(draft).length;
  const preferProductLevel = draft.grouping === 'separate';
  const candidates: CcStructureId[] = preferProductLevel
    ? ['product-targeting', 'targeting-type', 'consolidated']
    : M >= 2
      ? ['targeting-type', 'consolidated']
      : ['consolidated', 'targeting-type'];
  return candidates.find((id) => isStructureAvailable(id, draft, products)) ?? 'consolidated';
}

export function structureRecommendationReason(structureId: CcStructureId, draft: CcDraft, products: CcProduct[]): string {
  const P = products.length;
  const M = manualStrategies(draft).length + (draft.targetingStrategies.includes('automatic') ? 1 : 0);
  if (structureId === 'product-targeting') {
    return `You selected ${products.length} products and chose to keep them separate. This structure gives every product its own campaigns for independent budget and performance control.`;
  }
  if (structureId === 'targeting-type') {
    return `You selected ${M} targeting types across ${P} products. This structure keeps targeting types separate while avoiding a large number of product-level campaigns.`;
  }
  return `With ${P} product${P === 1 ? '' : 's'} and ${M} targeting type${M === 1 ? '' : 's'}, a consolidated structure keeps management simple without sacrificing coverage.`;
}

function keywordsFor(productId: string, count: number): string[] {
  const pool = MOCK_KEYWORD_POOL[productId] ?? DEFAULT_KEYWORDS;
  const out: string[] = [];
  for (let i = 0; i < count; i += 1) out.push(pool[i % pool.length]);
  return out;
}

function bidFor(acosTarget: number, index: number): number {
  const base = 25 / Math.max(acosTarget, 10);
  return Math.round((base + index * 0.15) * 100) / 100;
}

function makeAdGroup(name: string, productIds: string[], targets: CcTarget[]): CcAdGroup {
  return { id: nextCcId('ag'), name, productIds, targets };
}

function autoTargets(productIds: string[], acos: number): CcTarget[] {
  return productIds.map((pid, i) => ({ id: nextCcId('t'), label: 'Automatic targeting', matchType: 'Auto', bid: bidFor(acos, i), source: 'platform' as CcTargetSource }));
}

function keywordTargets(productIds: string[], matchType: string, acos: number): CcTarget[] {
  const out: CcTarget[] = [];
  productIds.forEach((pid) => {
    keywordsFor(pid, KEYWORDS_PER_PRODUCT_PER_TYPE).forEach((kw, i) => {
      out.push({ id: nextCcId('t'), label: kw, matchType, bid: bidFor(acos, i), source: i === 0 ? 'anarix' : 'platform' });
    });
  });
  return out;
}

function productTargets(products: CcProduct[], acos: number): CcTarget[] {
  const out: CcTarget[] = [];
  products.forEach((p) => {
    out.push({ id: nextCcId('t'), label: `Category: ${p.category.split(' > ').pop()}`, matchType: 'Category', bid: bidFor(acos, 0), source: 'anarix' });
    out.push({ id: nextCcId('t'), label: `${p.brand} — related products`, matchType: 'Product', bid: bidFor(acos, 1), source: 'custom' });
  });
  return out;
}

function manualAdGroupsAllTypes(products: CcProduct[], manual: CcStrategyId[], acos: number): CcAdGroup {
  const targets: CcTarget[] = [];
  const ids = products.map((p) => p.id);
  manual.forEach((t) => {
    if (t === 'product') targets.push(...productTargets(products, acos));
    else if (t === 'competitor' || t === 'brand' || t === 'category') targets.push(...productTargets(products, acos));
    else targets.push(...keywordTargets(ids, strategyTitle(t), acos));
  });
  return makeAdGroup('Manual Ad Group', ids, targets);
}

function manualAdGroupOneType(products: CcProduct[], t: CcStrategyId, acos: number): CcAdGroup {
  const ids = products.map((p) => p.id);
  const targets = t === 'product' || t === 'competitor' || t === 'brand' || t === 'category' ? productTargets(products, acos) : keywordTargets(ids, strategyTitle(t), acos);
  return makeAdGroup('Ad Group', ids, targets);
}

/** The single source of truth for what Structure 4 actually generates in every worked example in
 * the spec — Structures "Product + Targeting" and "Product + Single Auto" produce an identical tree
 * (their prose distinction only shows up if a future version adds more than one Auto configuration
 * per product, which "Product + Multiple Auto" already covers explicitly). */
export function generateCampaigns(draft: CcDraft, products: CcProduct[]): CcGeneratedCampaign[] {
  const hasAuto = draft.targetingStrategies.includes('automatic');
  const manual = manualStrategies(draft);
  const acos = Number(draft.targetAcos) || 25;
  const dailyBudget = Number(draft.dailyBudget) || 0;
  if (products.length === 0 || (!hasAuto && manual.length === 0)) return [];

  if (draft.structure === 'custom') return draft.jivaTree ?? [];

  const campaigns: CcGeneratedCampaign[] = [];
  const allIds = products.map((p) => p.id);

  function push(name: string, kind: 'auto' | 'manual', productIds: string[], adGroups: CcAdGroup[]) {
    campaigns.push({ id: nextCcId('camp'), name, kind, productIds, adGroups, dailyBudget: 0, ruleIds: [] });
  }

  switch (draft.structure) {
    case 'consolidated': {
      if (hasAuto) push('Auto Campaign', 'auto', allIds, [makeAdGroup('Auto Ad Group', allIds, autoTargets(allIds, acos))]);
      if (manual.length) push('Manual Campaign', 'manual', allIds, [manualAdGroupsAllTypes(products, manual, acos)]);
      break;
    }
    case 'targeting-type': {
      if (hasAuto) push('Auto Campaign', 'auto', allIds, [makeAdGroup('Auto Ad Group', allIds, autoTargets(allIds, acos))]);
      manual.forEach((t) => push(`Manual — ${strategyTitle(t)}`, 'manual', allIds, [manualAdGroupOneType(products, t, acos)]));
      break;
    }
    case 'product-targeting':
    case 'product-single-auto': {
      products.forEach((p) => {
        if (hasAuto) push(`${p.name} — Auto`, 'auto', [p.id], [makeAdGroup('Auto Ad Group', [p.id], autoTargets([p.id], acos))]);
        manual.forEach((t) => push(`${p.name} — ${strategyTitle(t)}`, 'manual', [p.id], [manualAdGroupOneType([p], t, acos)]));
      });
      break;
    }
    case 'product-multiple-auto': {
      products.forEach((p) => {
        if (hasAuto) {
          AUTO_SUBGROUPS.forEach((g) => push(`${p.name} — Auto (${g.label})`, 'auto', [p.id], [makeAdGroup(`Auto Ad Group — ${g.label}`, [p.id], autoTargets([p.id], acos))]));
        }
        manual.forEach((t) => push(`${p.name} — ${strategyTitle(t)}`, 'manual', [p.id], [manualAdGroupOneType([p], t, acos)]));
      });
      break;
    }
    default:
      return [];
  }

  const equalShare = campaigns.length ? Math.round((dailyBudget / campaigns.length) * 100) / 100 : 0;
  campaigns.forEach((c) => { c.dailyBudget = draft.campaignBudgetOverrides[c.id] ?? equalShare; });
  return campaigns;
}

export function totalAllocatedBudget(campaigns: CcGeneratedCampaign[]): number {
  return Math.round(campaigns.reduce((s, c) => s + c.dailyBudget, 0) * 100) / 100;
}

export function recommendedDailyBudget(draft: CcDraft, products: CcProduct[]): { low: number; high: number; mid: number } {
  const base = 25 + products.length * 20 + manualStrategies(draft).length * 12 + (draft.targetingStrategies.includes('automatic') ? 15 : 0);
  return { low: Math.round(base * 0.85 / 5) * 5, mid: Math.round(base / 5) * 5, high: Math.round(base * 1.3 / 5) * 5 };
}

export function typicalAcosRange(products: CcProduct[]): { low: number; high: number } {
  const eligible = products.filter((p) => p.eligible);
  if (!eligible.length) return { low: 20, high: 35 };
  const avg = eligible.reduce((s, p) => s + p.acos, 0) / eligible.length;
  return { low: Math.round(avg - 4), high: Math.round(avg + 4) };
}

export function isBudgetSufficient(draft: CcDraft, products: CcProduct[]): boolean {
  const rec = recommendedDailyBudget(draft, products);
  const budget = Number(draft.dailyBudget) || 0;
  return budget >= rec.low;
}

export const MOCK_RULES_LIST: CcRule[] = MOCK_RULES;

export function recommendedRules(draft: CcDraft, products: CcProduct[]): CcRule[] {
  const lowInventory = products.some((p) => p.eligible && p.inventory > 0 && p.inventory < 150);
  return MOCK_RULES.filter((r) => r.recommendedReason && (r.id !== 'rule-3' || lowInventory));
}
