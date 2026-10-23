import {
  GROUP_FIELDS, structureCounts,
  type CcDraft, type CcProduct, type CcStepId, type GroupField, type GroupSettings, type ProductGroup,
} from './campaign-creator.types';

// Product groups: on the Products step the products are split into groups; every later step then
// edits one group at a time, picked from a dropdown. Products in no group keep using the draft's own settings.

export const DEFAULT_SCOPE_ID = 'default';

/** Muted colours that tell the groups apart: a dot beside a name, never a coloured box. Ungrouped products stay grey. */
export const GROUP_COLORS = ['#2f8f83', '#c58a2b', '#3b6fd4', '#c4566b', '#5f9e3d', '#7a6fb0'];
export const UNGROUPED_COLOR = '#aab0bb';

/** A group's colour comes from its id, so it never changes, and finding it costs nothing however many groups there are. */
export function groupColor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) % 9973;
  return GROUP_COLORS[h % GROUP_COLORS.length];
}

/** Which group each product is in, found once so a long table does not search the groups row by row. */
export function groupIndex(groups: ProductGroup[]): Map<string, ProductGroup> {
  const index = new Map<string, ProductGroup>();
  groups.forEach((g) => g.productIds.forEach((id) => index.set(id, g)));
  return index;
}

/** Groups whose name contains the text, best matches (names that start with it) first. */
export function searchGroups(groups: ProductGroup[], query: string): ProductGroup[] {
  const q = query.trim().toLowerCase();
  if (!q) return groups;
  const starts: ProductGroup[] = [];
  const contains: ProductGroup[] = [];
  groups.forEach((g) => {
    const name = g.name.toLowerCase();
    if (name.startsWith(q)) starts.push(g);
    else if (name.includes(q)) contains.push(g);
  });
  return [...starts, ...contains];
}

/** One thing the later steps can be set up for: the ungrouped products, or a single group. */
export interface Scope {
  id: string;
  name: string;
  products: CcProduct[];
  color: string;
  /** The settings this scope keeps for itself. Cheap to read, so a long list of groups can be checked on every render. */
  settings: GroupSettings;
  /** The whole draft as this scope sees it: its own settings laid over the shared ones. Built when first read. */
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

/** A scope whose whole draft is only built the first time something asks for it. */
function scopeOf(id: string, name: string, products: CcProduct[], color: string, settings: GroupSettings, build: () => CcDraft): Scope {
  let cached: CcDraft | null = null;
  return {
    id, name, products, color, settings,
    get draft() { if (!cached) cached = build(); return cached; },
  };
}

/** Scopes for the later steps. Empty when there are no groups, which means the plan works as it always did. */
export function buildScopes(draft: CcDraft, selectedProducts: CcProduct[]): Scope[] {
  if (draft.productGroups.length === 0) return [];
  const byGroup = groupIndex(draft.productGroups);
  const members = new Map<string, CcProduct[]>();
  const ungrouped: CcProduct[] = [];
  selectedProducts.forEach((p) => {
    const g = byGroup.get(p.id);
    if (!g) { ungrouped.push(p); return; }
    const list = members.get(g.id);
    if (list) list.push(p); else members.set(g.id, [p]);
  });
  const scopes: Scope[] = [];
  if (ungrouped.length > 0) {
    scopes.push(scopeOf(DEFAULT_SCOPE_ID, 'Ungrouped products', ungrouped, UNGROUPED_COLOR, pickSettings(draft), () => ({ ...draft, productIds: ungrouped.map((p) => p.id) })));
  }
  draft.productGroups.forEach((g) => {
    scopes.push(scopeOf(g.id, g.name, members.get(g.id) ?? [], groupColor(g.id), g.settings, () => ({ ...draft, ...g.settings, productIds: g.productIds })));
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
export function totalCampaignsFor(scopes: Pick<Scope, 'settings' | 'products'>[]): number | null {
  let total = 0;
  for (const sc of scopes) {
    const id = sc.settings.structureId;
    if (!id) return null;
    if (id === 'custom') { total += sc.settings.customCampaigns?.length ?? 0; continue; }
    const manual = sc.settings.targetingStrategies.filter((t) => t !== 'auto').length;
    total += structureCounts(id, sc.products.length, sc.settings.targetingStrategies.includes('auto'), manual, sc.settings.autoTypes.length).totalCampaigns;
  }
  return total;
}

// ── Changing the groups ───────────────────────────────────────────────────────────────────────

let groupCounter = 0;
const newGroupId = () => `grp-${Date.now().toString(36)}-${groupCounter++}`;

/** Moves products into a group, or out of every group when `targetId` is null. A product belongs to one group, and a group left empty goes. */
export function moveProducts(groups: ProductGroup[], ids: string[], targetId: string | null): ProductGroup[] {
  return groups
    .map((g) => {
      const rest = g.productIds.filter((id) => !ids.includes(id));
      return g.id === targetId ? { ...g, productIds: [...rest, ...ids] } : { ...g, productIds: rest };
    })
    .filter((g) => g.productIds.length > 0);
}

/**
 * Products that are in no group join the first group, so every product is always in one. With no group yet,
 * the first one is made and called "Group 1". Gives back the new groups, or null when nothing needed placing.
 */
export function placeUngrouped(draft: CcDraft): ProductGroup[] | null {
  const byGroup = groupIndex(draft.productGroups);
  const loose = draft.productIds.filter((id) => !byGroup.has(id));
  if (loose.length === 0) return null;
  if (draft.productGroups.length > 0) {
    const [first, ...rest] = draft.productGroups;
    return [{ ...first, productIds: [...first.productIds, ...loose] }, ...rest];
  }
  return [{ id: newGroupId(), name: 'Group 1', productIds: loose, settings: pickSettings(draft) }];
}

interface GroupResult { groups: ProductGroup[]; error?: string }

const nameTaken = (groups: ProductGroup[], name: string, exceptId?: string) =>
  groups.some((g) => g.id !== exceptId && g.name.toLowerCase() === name.toLowerCase());

/** A new group holding `ids`, starting from the settings the draft has now. */
export function createGroup(draft: CcDraft, rawName: string, ids: string[]): GroupResult {
  const name = rawName.trim();
  if (!name) return { groups: draft.productGroups, error: 'Give the group a name.' };
  if (nameTaken(draft.productGroups, name)) return { groups: draft.productGroups, error: 'Another group has that name.' };
  if (ids.length === 0) return { groups: draft.productGroups, error: 'Tick at least one product.' };
  const moved = moveProducts(draft.productGroups, ids, null);
  return { groups: [...moved, { id: newGroupId(), name, productIds: ids, settings: pickSettings(draft) }] };
}

export function renameGroup(groups: ProductGroup[], id: string, rawName: string): GroupResult {
  const name = rawName.trim();
  if (!name) return { groups, error: 'Give the group a name.' };
  if (nameTaken(groups, name, id)) return { groups, error: 'Another group has that name.' };
  return { groups: groups.map((g) => (g.id === id ? { ...g, name } : g)) };
}

/** A name to start from: what the chosen products share (a brand, then a category), else the next free "Group n". */
export function suggestGroupName(chosen: CcProduct[], groups: ProductGroup[]): string {
  const taken = new Set(groups.map((g) => g.name.toLowerCase()));
  const free = (name: string) => !taken.has(name.toLowerCase());
  const same = (pick: (p: CcProduct) => string | undefined) => {
    const values = Array.from(new Set(chosen.map(pick).filter(Boolean)));
    return values.length === 1 ? (values[0] as string) : null;
  };
  const shared = [same((p) => p.brand), same((p) => p.category)].find((n) => n && free(n));
  if (shared) return shared;
  let n = groups.length + 1;
  while (!free(`Group ${n}`)) n += 1;
  return `Group ${n}`;
}

/** What the chosen products share (their brands, then their categories), as one-tap names that are not already taken. */
export function groupNameIdeas(chosen: CcProduct[], groups: ProductGroup[]): string[] {
  const taken = new Set(groups.map((g) => g.name.toLowerCase()));
  const values = [...chosen.map((x) => x.brand), ...chosen.map((x) => x.category)].filter(Boolean) as string[];
  return Array.from(new Set(values)).filter((v) => !taken.has(v.toLowerCase())).slice(0, 4);
}

// ── Apply this page to chosen groups ───────────────────────────────────────────────────────────

/** The settings each page sets, so copying one page across groups leaves the others alone. */
export const PAGE_FIELDS: Partial<Record<CcStepId, GroupField[]>> = {
  keywords: ['keywordTargets', 'negativeKeywords', 'productTargets', 'negativeProducts'],
  objectives: ['targetAcos', 'dailyBudget', 'extraObjectives', 'startDate', 'endDate', 'biddingStrategy', 'placementAdjust', 'placementInclusion', 'totalBudgetMode', 'budgetType', 'totalBudget', 'budgetRollover', 'expandedTargeting', 'bidMultipliers'],
  targeting: ['targetingStrategies', 'autoTypes'],
  structure: ['structureId', 'customPrompt', 'customCampaigns'],
};

/**
 * What to change so the chosen groups (the ungrouped products count as one) get this page's settings from one group.
 * `undo` puts back what was there before.
 */
export function applyPageToGroups(draft: CcDraft, sourceId: string, step: CcStepId, targetIds: Set<string>): { patch: Partial<CcDraft>; undo: Partial<CcDraft>; count: number } | null {
  const fields = PAGE_FIELDS[step];
  if (!fields || draft.productGroups.length === 0) return null;
  const source = sourceId === DEFAULT_SCOPE_ID ? pickSettings(draft) : draft.productGroups.find((g) => g.id === sourceId)?.settings;
  if (!source) return null;
  const targets = new Set([...targetIds].filter((id) => id !== sourceId));
  if (targets.size === 0) return null;
  const values: Record<string, unknown> = {};
  const before: Record<string, unknown> = {};
  fields.forEach((f) => { values[f] = source[f]; before[f] = draft[f]; });
  const productGroups = draft.productGroups.map((g) => (targets.has(g.id) ? { ...g, settings: { ...g.settings, ...values } as GroupSettings } : g));
  return {
    patch: (targets.has(DEFAULT_SCOPE_ID) ? { ...values, productGroups } : { productGroups }) as Partial<CcDraft>,
    undo: { ...before, productGroups: draft.productGroups } as Partial<CcDraft>,
    count: targets.size,
  };
}
