import {
  GROUP_FIELDS, structureCounts,
  type CcDraft, type CcProduct, type GroupSettings, type ProductGroup,
} from './campaign-creator.types';

// Product groups: on the Products step the products are split into groups; every later step then
// edits one group at a time, picked from a dropdown. Products in no group keep using the draft's own settings.

export const DEFAULT_SCOPE_ID = 'default';

/** One thing the later steps can be set up for: the ungrouped products, or a single group. */
export interface Scope {
  id: string;
  name: string;
  products: CcProduct[];
  /** The draft as this scope sees it: its own settings laid over the shared ones. */
  draft: CcDraft;
}

/** The current values of every setting a group keeps for itself. */
export function pickSettings(draft: CcDraft): GroupSettings {
  const settings = {} as Record<string, unknown>;
  GROUP_FIELDS.forEach((field) => { settings[field] = draft[field]; });
  return settings as GroupSettings;
}

/** Groups after dropping products that are no longer selected, and any group left empty. */
export function pruneGroups(groups: ProductGroup[], productIds: string[]): ProductGroup[] {
  const kept = new Set(productIds);
  const next = groups
    .map((g) => ({ ...g, productIds: g.productIds.filter((id) => kept.has(id)) }))
    .filter((g) => g.productIds.length > 0);
  const unchanged = next.length === groups.length && next.every((g, i) => g.productIds.length === groups[i].productIds.length);
  return unchanged ? groups : next;
}

/** Scopes for the later steps. Empty when there are no groups, which means the plan works as it always did. */
export function buildScopes(draft: CcDraft, selectedProducts: CcProduct[]): Scope[] {
  if (draft.productGroups.length === 0) return [];
  const grouped = new Set(draft.productGroups.flatMap((g) => g.productIds));
  const ungrouped = selectedProducts.filter((p) => !grouped.has(p.id));
  const scopes: Scope[] = [];
  if (ungrouped.length > 0) {
    scopes.push({ id: DEFAULT_SCOPE_ID, name: 'Ungrouped products', products: ungrouped, draft: { ...draft, productIds: ungrouped.map((p) => p.id) } });
  }
  draft.productGroups.forEach((g) => {
    const products = selectedProducts.filter((p) => g.productIds.includes(p.id));
    scopes.push({ id: g.id, name: g.name, products, draft: { ...draft, ...g.settings, productIds: g.productIds } });
  });
  return scopes;
}

/** Sends a step's change to the right place: a group's own settings, or the shared draft. */
export function applyScopedPatch(draft: CcDraft, scopeId: string, patch: Partial<CcDraft>): Partial<CcDraft> {
  if (scopeId === DEFAULT_SCOPE_ID || draft.productGroups.length === 0) return patch;
  const own: Record<string, unknown> = {};
  const shared: Record<string, unknown> = {};
  Object.entries(patch).forEach(([key, value]) => {
    if ((GROUP_FIELDS as readonly string[]).includes(key)) own[key] = value;
    else shared[key] = value;
  });
  if (Object.keys(own).length === 0) return patch;
  return {
    ...shared,
    productGroups: draft.productGroups.map((g) => (g.id === scopeId ? { ...g, settings: { ...g.settings, ...own } as GroupSettings } : g)),
  } as Partial<CcDraft>;
}

/** Campaigns the account would need for all scopes together, for the account limit check. */
export function totalCampaignsFor(scopes: Scope[]): number | null {
  let total = 0;
  for (const s of scopes) {
    const id = s.draft.structureId;
    if (!id) return null;
    if (id === 'custom') { total += s.draft.customCampaigns?.length ?? 0; continue; }
    const manual = s.draft.targetingStrategies.filter((t) => t !== 'auto').length;
    total += structureCounts(id, s.products.length, s.draft.targetingStrategies.includes('auto'), manual, s.draft.autoTypes.length).totalCampaigns;
  }
  return total;
}
