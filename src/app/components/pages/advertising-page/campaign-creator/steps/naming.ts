import type { CcCampaign, CcProduct, NamingSettings } from '../campaign-creator.types';

// How campaign and ad group names are put together. The Naming settings popup edits the template; these functions fill it in.
// The name parts are the columns of the Campaigns table, so a name can echo what the row says.

export type CampaignToken = NamingSettings['campaignTokens'][number];
export type AdGroupToken = NamingSettings['adGroupTokens'][number];

export const CAMPAIGN_TOKENS: { id: CampaignToken; label: string }[] = [
  { id: 'parentAsin', label: 'Parent ASIN' },
  { id: 'campaignType', label: 'Campaign type' },
  { id: 'adType', label: 'Ad type' },
  { id: 'biddingStrategy', label: 'Bidding strategy' },
  { id: 'targetType', label: 'Targeting type' },
];
export const AD_GROUP_TOKENS: { id: AdGroupToken; label: string }[] = [
  { id: 'adGroupText', label: 'Anarix ad group' },
  { id: 'targetType', label: 'Targeting type' },
];

/** The marks that say a name was made by Anarix; the "Campaign name tag status" switch turns both on or off. */
export const TAG_PREFIX = 'Anarix';
export const TAG_SUFFIX = 'AI';

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
const SEPARATOR = '_';

interface Parts { parentAsin: string; campaignType: string; adType: string; biddingStrategy: string; targetType: string; adGroupText: string; adGroupTarget: string }

/** Example values for the preview when there is no campaign yet. */
const SAMPLE: Parts = { parentAsin: 'B0XXXXXXXXX', campaignType: 'SP', adType: 'Manual', biddingStrategy: 'Fixed', targetType: 'Broad', adGroupText: 'Anarix ad group', adGroupTarget: 'Broad' };

const BIDDING_SHORT: Record<string, string> = { 'Fixed bids': 'Fixed', 'Dynamic bids - down only': 'DynamicDown', 'Dynamic bids - up and down': 'DynamicUpDown', Fixed: 'Fixed', Dynamic: 'Dynamic' };

function partsFor(c: CcCampaign, products: CcProduct[]): Parts {
  const types = Array.from(new Set(c.adGroups.flatMap((ag) => ag.targets.map((t) => t.matchType))));
  const auto = c.kind === 'auto';
  const autoSub = c.targetingLabel.split(' · ')[1]?.replace(' match', '');
  return {
    parentAsin: c.productIds.length === 1 ? (products.find((p) => p.id === c.productIds[0])?.asin ?? 'ASIN') : 'ALL',
    campaignType: 'SP',
    adType: auto ? 'Auto' : 'Manual',
    biddingStrategy: BIDDING_SHORT[c.biddingStrategy ?? 'Fixed bids'] ?? 'Fixed',
    targetType: auto ? `Auto${autoSub ? `_${autoSub}` : ''}` : types.length === 1 ? cap(types[0]) : 'Manual',
    adGroupText: 'Anarix ad group',
    adGroupTarget: auto ? `${autoSub ?? 'Auto'} match` : types.length === 1 ? cap(types[0]) : 'Mixed',
  };
}

function build(tokens: string[], values: Record<string, string>, tag: boolean, tagged: boolean): string {
  const body = tokens.map((t) => values[t]).filter(Boolean);
  return [...(tagged && tag ? [TAG_PREFIX] : []), ...body, ...(tagged && tag ? [TAG_SUFFIX] : [])].join(SEPARATOR);
}

const campaignValues = (p: Parts): Record<string, string> => ({ parentAsin: p.parentAsin, campaignType: p.campaignType, adType: p.adType, biddingStrategy: p.biddingStrategy, targetType: p.targetType });
const adGroupValues = (p: Parts): Record<string, string> => ({ adGroupText: p.adGroupText, targetType: p.adGroupTarget });

export const campaignNameFor = (c: CcCampaign, products: CcProduct[], s: NamingSettings): string => build(s.campaignTokens, campaignValues(partsFor(c, products)), s.tagStatus, true);
export const adGroupNameFor = (c: CcCampaign, products: CcProduct[], s: NamingSettings): string => build(s.adGroupTokens, adGroupValues(partsFor(c, products)), s.tagStatus, false);

/** The preview line: built from a real campaign in the table when there is one. */
export const campaignPreview = (s: NamingSettings, c?: CcCampaign, products: CcProduct[] = []): string => (c ? campaignNameFor(c, products, s) : build(s.campaignTokens, campaignValues(SAMPLE), s.tagStatus, true));
export const adGroupPreview = (s: NamingSettings, c?: CcCampaign, products: CcProduct[] = []): string => (c ? adGroupNameFor(c, products, s) : build(s.adGroupTokens, adGroupValues(SAMPLE), s.tagStatus, false));

/** Renames every campaign, and the first ad group in each, from the template. */
export function applyNaming(campaigns: CcCampaign[], products: CcProduct[], s: NamingSettings): CcCampaign[] {
  return campaigns.map((c) => ({
    ...c,
    name: campaignNameFor(c, products, s),
    adGroups: c.adGroups.map((ag, i) => (i === 0 ? { ...ag, name: adGroupNameFor(c, products, s) } : ag)),
  }));
}
