import {
  DAY_PARTING_PAGE_URL,
  IMPACT_ANALYSIS_URL,
  KEYWORD_ACTION_URL,
} from '@/constants/urls.constants';
import { JIVARedirectionPageEnum } from '@/enums/chatbot.enums';
import { ImpactAnalysisTableTitles } from '@/enums/impact-analysis.enums';

export const redirectionPageMapper: Record<JIVARedirectionPageEnum, string> = {
  [JIVARedirectionPageEnum.IMPACT_ANALYSIS]: IMPACT_ANALYSIS_URL,
  [JIVARedirectionPageEnum.TARGETING_ACTIONS]: KEYWORD_ACTION_URL,
  [JIVARedirectionPageEnum.DAY_PARTING]: DAY_PARTING_PAGE_URL,
};

export const impactAnalysisTypeMapper: Record<string, ImpactAnalysisTableTitles> = {
  'campaigns': ImpactAnalysisTableTitles.CAMPAIGN,
  'ad groups': ImpactAnalysisTableTitles.AD_GROUP,
  'products': ImpactAnalysisTableTitles.PRODUCT_ADS,
  'keywords': ImpactAnalysisTableTitles.KEYWORDS,
};

export const getRouteFromRedirectionPage = (
  redirectionPage?: string
): string | null => {
  if (!redirectionPage) return null;
  return (
    redirectionPageMapper[redirectionPage as JIVARedirectionPageEnum] ?? null
  );
};

export const getImpactAnalysisTypeFromApiType = (
  type?: string
): ImpactAnalysisTableTitles | null => {
  if (!type) return null;
  return impactAnalysisTypeMapper[type.toLowerCase()] ?? null;
};
