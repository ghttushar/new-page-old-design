// @ts-nocheck -- presentation context for the ported Campaign Creator
import { createContext, useContext } from 'react';
import type { CcDraft, CcProduct, CcStepId } from './campaign-creator.types';
import type { Scope } from './product-groups';

export type CampaignSummaryContextValue = {
  step: CcStepId;
  draft: CcDraft;
  selectedProducts: CcProduct[];
  onJump: (id: CcStepId) => void;
  /** The numbered steps of the journey, and how far the user has got, for the journey bar. */
  steps?: { id: CcStepId; label: string }[];
  furthestIndex?: number;
  /** Every selected product, whichever group the bar is showing. */
  totalProducts?: number;
  /** Product groups: set when the products have been grouped, so the products tile becomes a group dropdown. */
  scopes?: Scope[];
  activeScopeId?: string;
  pendingScopes?: Set<string>;
  onScopeChange?: (id: string) => void;
  /** Copies this page's setup from the group being set up to the groups ticked in the dropdown. */
  onApplyToGroups?: (ids: string[]) => void;
  /** How many groups the last apply changed, for a few seconds; null otherwise. */
  appliedCount?: number | null;
  onUndoApply?: () => void;
  /** The step a rejected setting sits on, while it is still wrong: its tile shows a red cross instead of a tick. */
  issueStep?: CcStepId;
};

const CampaignSummaryContext = createContext<CampaignSummaryContextValue | null>(null);

export function CampaignSummaryProvider({ value, children }: { value: CampaignSummaryContextValue; children: React.ReactNode }) {
  return <CampaignSummaryContext.Provider value={value}>{children}</CampaignSummaryContext.Provider>;
}

export function useCampaignSummary() {
  return useContext(CampaignSummaryContext);
}