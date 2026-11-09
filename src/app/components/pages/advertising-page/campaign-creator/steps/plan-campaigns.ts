import { useEffect } from 'react';
import {
  MAX_KEYWORD_COMBOS_PER_AD_GROUP, MIN_KEYWORD_BID, campaignsForPlan,
  type CcCampaign, type CcDraft, type CcProduct, type KeywordMatch, type NegativeMatch, type ProductTargetMatch,
} from '../campaign-creator.types';
import { decorateCampaigns } from './preview-cells';
import { withShares } from './budget-math';
import { UNGROUPED_COLOR, pickSettings, type Scope } from '../product-groups';

// The campaigns a plan makes, built once on Keywords (where targets are added to the campaigns the user ticks) and
// reused on Review, so what was added on Keywords is still there.

const PRODUCT_MATCHES = ['product', 'asin-expanded', 'category'];

export function usePlanCampaigns(sharedDraft: CcDraft, groupScopes: Scope[], selectedProducts: CcProduct[], onChange: (patch: Partial<CcDraft>) => void) {
  // Without groups the plan is one scope. With groups, each group builds its own campaigns from its own settings.
  const scopes: Scope[] = groupScopes.length > 0 ? groupScopes : [{ id: 'all', name: '', products: selectedProducts, color: UNGROUPED_COLOR, settings: pickSettings(sharedDraft), draft: sharedDraft }];
  const grouped = groupScopes.length > 0;
  const planBudget = scopes.reduce((sum, sc) => sum + sc.draft.dailyBudget, 0);

  // Everything the campaigns are built from. If it hasn't changed since last time, the user's edits (and targets) stay.
  const sourceKey = JSON.stringify(scopes.map((sc) => [
    sc.id, sc.draft.structureId, sc.draft.structureVariant, sc.draft.splits ?? null, sc.draft.manualStrategies ?? [], sc.products.map((p) => p.id), sc.draft.targetingStrategies, sc.draft.autoTypes, sc.draft.dailyBudget,
    sc.draft.structureId === 'custom' ? sc.draft.customCampaigns ?? null : '',
    sc.draft.biddingStrategy, sc.draft.placementAdjust, sc.draft.expandedTargeting ?? null,
  ]));

  useEffect(() => {
    if (scopes.every((sc) => !sc.draft.structureId)) return;
    if (sharedDraft.generatedCampaigns && sharedDraft.generatedKey === sourceKey) return;
    const built = scopes.flatMap((sc) => {
      if (!sc.draft.structureId) return [];
      const made = campaignsForPlan(sc.draft, sc.products, sharedDraft.marketplace);
      const decorated = decorateCampaigns(made, sc.products, sharedDraft.naming, { biddingStrategy: sc.draft.biddingStrategy, placement: sc.draft.placementAdjust });
      if (!grouped) return decorated;
      // Ids repeat from one group to the next, so each carries its group's id.
      return decorated.map((camp) => ({
        ...camp, id: `${sc.id}:${camp.id}`, groupName: sc.name,
        adGroups: camp.adGroups.map((ag) => ({ ...ag, id: `${sc.id}:${ag.id}` })),
      }));
    });
    onChange({ generatedCampaigns: grouped ? withShares(built, planBudget) : built, generatedKey: sourceKey });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceKey]);

  // Until the effect has run for a changed plan, the old campaigns aren't shown.
  const current = sharedDraft.generatedKey === sourceKey ? sharedDraft.generatedCampaigns ?? [] : [];
  return { campaigns: current, scopes, grouped, planBudget };
}

// ── Adding targets to the ticked campaigns ──────────────────────────────────────────────────

export type ListKind = 'keyword' | 'product' | 'negative' | 'neg-product';

export interface KeywordLists {
  keywordTargets: { id: string; text: string; match: KeywordMatch; bid: number; enabled: boolean }[];
  productTargets: { id: string; text: string; match: ProductTargetMatch; bid: number; enabled: boolean }[];
  negativeKeywords: { id: string; text: string; match: NegativeMatch; enabled: boolean }[];
  negativeProducts: { id: string; text: string; enabled: boolean }[];
}


/** Whether a campaign can take a list at all: targets go on Manual ad groups of their kind; negatives almost anywhere. */
export function canTake(c: CcCampaign, kind: ListKind, marketplace: CcDraft['marketplace']): boolean {
  const walmart = marketplace === 'walmart';
  if (kind === 'keyword') return c.kind === 'manual' && c.adGroups.some(takesKeywords);
  if (kind === 'product') return !walmart && c.kind === 'manual' && c.adGroups.some(takesProducts);
  // Walmart Automatic campaigns with Dynamic bidding can't take negative keywords.
  if (kind === 'negative') return !(walmart && c.kind === 'auto' && c.biddingStrategy === 'Dynamic');
  return !walmart;
}

function takesProducts(ag: CcCampaign['adGroups'][number]) { return ag.targets.some((t) => PRODUCT_MATCHES.includes(t.matchType)); }
function takesKeywords(ag: CcCampaign['adGroups'][number]) { return ag.targets.length === 0 || ag.targets.some((t) => !PRODUCT_MATCHES.includes(t.matchType)); }

/** Why a ticked campaign took nothing, for the note after adding. */
const SKIP_REASON: Record<ListKind, string> = {
  keyword: 'keyword targets go on Manual campaigns that target keywords',
  product: 'product targets go on Manual campaigns that target products',
  negative: "Automatic campaigns with Dynamic bidding can't take negative keywords",
  'neg-product': 'negative product targets are Amazon only',
};

/**
 * Puts the lists into the ticked campaigns, as the Review page used to for every campaign:
 * - keyword targets on Manual ad groups that target keywords, product targets on those that target products, and an ad
 *   group built for one match type only takes entries of that type (ASIN Expanded takes the ASIN entries);
 * - negative keywords everywhere but Walmart Automatic campaigns with Dynamic bidding; negative ASINs everywhere.
 * Entries an ad group already has are skipped.
 */
export function addListsToCampaigns(campaigns: CcCampaign[], ids: Set<string>, lists: KeywordLists, marketplace: CcDraft['marketplace']) {
  const keywords = lists.keywordTargets.filter((k) => k.enabled);
  const products = lists.productTargets.filter((p) => p.enabled);
  const negatives = lists.negativeKeywords.filter((k) => k.enabled);
  const negativeAsins = lists.negativeProducts.filter((p) => p.enabled);
  const wanted: ListKind[] = [
    ...(keywords.length ? ['keyword' as const] : []), ...(products.length ? ['product' as const] : []),
    ...(negatives.length ? ['negative' as const] : []), ...(negativeAsins.length ? ['neg-product' as const] : []),
  ];
  let added = 0;
  const touched = new Set<string>();
  const skipped: { name: string; reason: string }[] = [];

  const next = campaigns.map((c) => {
    if (!ids.has(c.id)) return c;
    const takes = wanted.filter((k) => canTake(c, k, marketplace));
    if (takes.length === 0) {
      if (wanted.length) skipped.push({ name: c.name, reason: SKIP_REASON[wanted[0]] });
      return c;
    }
    const camp = {
      ...c,
      adGroups: c.adGroups.map((ag) => {
        const haveTarget = new Set(ag.targets.map((t) => `${t.label.toLowerCase()}|${t.matchType}`));
        const haveNegative = new Set(ag.negatives.map((n) => `${n.kind}|${n.text.toLowerCase()}|${n.matchType ?? ''}`));
        const kwTypes = new Set(ag.targets.filter((t) => !PRODUCT_MATCHES.includes(t.matchType)).map((t) => t.matchType as string));
        const prTypes = new Set(ag.targets.filter((t) => PRODUCT_MATCHES.includes(t.matchType)).map((t) => (t.matchType === 'asin-expanded' ? 'product' : t.matchType as string)));
        const keywordTargets = takes.includes('keyword') && takesKeywords(ag)
          ? keywords.filter((k) => (kwTypes.size !== 1 || kwTypes.has(k.match)) && !haveTarget.has(`${k.text.toLowerCase()}|${k.match}`))
            .map((k) => ({ id: `${ag.id}-${k.id}`, label: k.text, matchType: k.match, bid: Math.max(k.bid, MIN_KEYWORD_BID), source: 'Custom input' as const }))
          : [];
        const productTargets = takes.includes('product') && takesProducts(ag)
          ? products.filter((p) => (prTypes.size !== 1 || prTypes.has(p.match)) && !haveTarget.has(`${p.text.toLowerCase()}|${p.match}`))
            .map((p) => ({ id: `${ag.id}-${p.id}`, label: p.text, matchType: p.match, bid: Math.max(p.bid, MIN_KEYWORD_BID), source: 'Custom input' as const }))
          : [];
        const addedKeywords = takes.includes('negative')
          ? negatives.filter((n) => !haveNegative.has(`keyword|${n.text.toLowerCase()}|${n.match}`)).map((n) => ({ id: `${ag.id}-${n.id}`, text: n.text, kind: 'keyword' as const, matchType: n.match }))
          : [];
        const addedAsins = takes.includes('neg-product')
          ? negativeAsins.filter((n) => !haveNegative.has(`product|${n.text.toLowerCase()}|`)).map((n) => ({ id: `${ag.id}-${n.id}`, text: n.text.toUpperCase(), kind: 'product' as const }))
          : [];
        const count = keywordTargets.length + productTargets.length + addedKeywords.length + addedAsins.length;
        if (count) { added += count; touched.add(c.id); }
        return count ? { ...ag, targets: [...ag.targets, ...keywordTargets, ...productTargets], negatives: [...ag.negatives, ...addedKeywords, ...addedAsins] } : ag;
      }),
    };
    return camp;
  });
  return { campaigns: next, added, campaignCount: touched.size, skipped };
}

/** Walmart: an ad group can hold at most 1,000 keyword and match-type combinations. */
export function walmartComboIssue(campaigns: CcCampaign[], marketplace: CcDraft['marketplace']): string | null {
  if (marketplace !== 'walmart') return null;
  const most = Math.max(0, ...campaigns.flatMap((c) => c.adGroups).map((ag) => ag.targets.filter((t) => !PRODUCT_MATCHES.includes(t.matchType)).length));
  if (most <= MAX_KEYWORD_COMBOS_PER_AD_GROUP) return null;
  return `One ad group holds ${most.toLocaleString()} keyword and match-type combinations; Walmart allows ${MAX_KEYWORD_COMBOS_PER_AD_GROUP.toLocaleString()}. Remove some keywords with the pencil in Targeting type, or split ad groups by match type on Structure.`;
}
