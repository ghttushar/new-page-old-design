// @ts-nocheck -- presentation context for the ported Campaign Creator
import { createContext, useContext } from 'react';
import type { CcDraft, CcProduct, CcStepId } from './campaign-creator.types';

export type CampaignSummaryContextValue = {
  step: CcStepId;
  draft: CcDraft;
  selectedProducts: CcProduct[];
  onJump: (id: CcStepId) => void;
};

const CampaignSummaryContext = createContext<CampaignSummaryContextValue | null>(null);

export function CampaignSummaryProvider({ value, children }: { value: CampaignSummaryContextValue; children: React.ReactNode }) {
  return <CampaignSummaryContext.Provider value={value}>{children}</CampaignSummaryContext.Provider>;
}

export function useCampaignSummary() {
  return useContext(CampaignSummaryContext);
}