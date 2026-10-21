import {
  EMPTY_DRAFT, flattenProducts, productsFor, recommendTargetingStrategies, strategiesForMode,
  type CcDraft, type CcStepId,
} from '../campaign-creator.types';
import { placeUngrouped } from '../product-groups';

// Campaign creations that are still running or did not finish, for the Creation activity page.
// Two kinds of failure can be retried: a backend one runs again as it is, a configuration one reopens the creator
// on the step where the setup was rejected.

/** Created so far, out of planned: [done, planned]. */
export interface CreatedCounts {
  campaigns: [number, number];
  adGroups: [number, number];
  productAds: [number, number];
  targets: [number, number];
}

export const COUNT_ROWS: { key: keyof CreatedCounts; label: string; stage: string }[] = [
  { key: 'campaigns', label: 'campaigns', stage: 'Creating campaigns…' },
  { key: 'adGroups', label: 'ad groups', stage: 'Creating ad groups…' },
  { key: 'productAds', label: 'product ads', stage: 'Adding product ads…' },
  { key: 'targets', label: 'targets', stage: 'Adding targets…' },
];

/** The setting the marketplace rejected, and what it needs to be. */
export interface RunIssue {
  step: CcStepId;
  field: 'dailyBudget';
  min: number;
  message: string;
}

export interface CreationRun {
  id: string;
  entity: string;
  error: string;
  reason: string;
  nextStep: string;
  /** backend: retry runs it again. config: retry reopens the creator on the step at fault. info: nothing to retry. */
  kind: 'backend' | 'config' | 'info';
  status: 'processing' | 'failed' | 'done';
  created: CreatedCounts;
  /** Milliseconds between progress ticks while processing. */
  pace?: number;
  /** A mock run that stays in process, so the in-process state can always be looked at. */
  steady?: boolean;
  issue?: RunIssue;
  /** The saved setup a configuration retry loads back into the creator. */
  draft?: () => CcDraft;
}

/** The setup behind the rejected campaign: 8 products, Manual targeting, one campaign per targeting type, $25 a day. */
export function savedRunDraft(): CcDraft {
  const products = flattenProducts(productsFor('amazon')).slice(0, 8);
  const recommended = strategiesForMode(recommendTargetingStrategies(products, 'amazon'), 'manual');
  const base: CcDraft = {
    ...EMPTY_DRAFT,
    adType: 'sponsored-products',
    campaignMode: 'manual',
    productIds: products.map((p) => p.id),
    targetingStrategies: recommended.length ? recommended : ['exact', 'phrase'],
    structureId: 'targeting-type',
    dailyBudget: 25,
  };
  return { ...base, productGroups: placeUngrouped(base) ?? [] };
}

export const SEED_RUNS: CreationRun[] = [
  {
    id: 'run-auto-discovery',
    entity: 'Campaign — Anarix_ALL_SP_Auto_Discovery',
    error: '',
    reason: '',
    nextStep: "Nothing to do. We'll let you know when it finishes.",
    kind: 'backend',
    status: 'processing',
    steady: true,
    created: { campaigns: [3, 3], adGroups: [2, 3], productAds: [0, 3], targets: [0, 36] },
  },
  {
    id: 'run-electrolytes-launch',
    entity: 'Campaign — Anarix_ELECTROLYTES_SP_Manual_Launch',
    error: '',
    reason: '',
    nextStep: "Nothing to do. We'll let you know when it finishes.",
    kind: 'backend',
    status: 'processing',
    steady: true,
    created: { campaigns: [4, 4], adGroups: [4, 4], productAds: [4, 4], targets: [31, 52] },
  },
  {
    id: 'run-whey-exact',
    entity: 'Campaign — Anarix_WHEY_SP_Manual_Exact',
    error: 'Marketplace timed out',
    reason: 'The Amazon Ads API stopped responding while ad groups were being created.',
    nextStep: 'Retry. Your configuration is saved.',
    kind: 'backend',
    status: 'failed',
    created: { campaigns: [1, 2], adGroups: [1, 2], productAds: [1, 2], targets: [0, 28] },
  },
  {
    id: 'run-manual-ai',
    entity: 'Campaign — Anarix_ALL_SP_Manual_AI',
    error: 'Budget rejected',
    reason: 'The marketplace rejected a daily budget of $25 for this campaign.',
    nextStep: 'Raise the budget, then retry.',
    kind: 'config',
    status: 'failed',
    created: { campaigns: [0, 2], adGroups: [0, 2], productAds: [0, 2], targets: [0, 24] },
    issue: {
      step: 'objectives',
      field: 'dailyBudget',
      min: 40,
      message: 'The marketplace rejected $25 for this campaign. Raise the daily budget to at least $40.',
    },
    draft: savedRunDraft,
  },
  {
    id: 'run-duplicate-target',
    entity: 'Target — whey protein isolate',
    error: 'Duplicate target',
    reason: 'This keyword already exists in the ad group, so it was skipped.',
    nextStep: 'No action needed.',
    kind: 'info',
    status: 'failed',
    created: { campaigns: [1, 1], adGroups: [1, 1], productAds: [1, 1], targets: [11, 12] },
  },
];

/** One progress tick: fills the first unfinished count by about a sixth of its total. Returns null when all are full. */
export function advanceCounts(c: CreatedCounts): CreatedCounts | null {
  const row = COUNT_ROWS.find((r) => c[r.key][0] < c[r.key][1]);
  if (!row) return null;
  const [done, of] = c[row.key];
  return { ...c, [row.key]: [Math.min(of, done + Math.max(1, Math.ceil(of / 6))), of] };
}

export const stageOf = (c: CreatedCounts) => COUNT_ROWS.find((r) => c[r.key][0] < c[r.key][1])?.stage ?? 'Finishing up…';
