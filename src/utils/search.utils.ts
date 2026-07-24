import {
  IOverallAdGroup,
  IOverallCampaign,
  IOverallKeywordTargeting,
  IOverallProductAds,
  IOverallProductTargeting,
} from '@/interfaces/advertising/amazon/overall-advertising.interface';
import {
  ISBAdGroup,
  ISBCampaign,
  ISBCreative,
  ISBKeywordTargeting,
  ISBNegativeTargetingKeyword,
  ISBNegativeTargetingProduct,
  ISBProductAds,
  ISBProductTargeting,
  ISBSearchTermKeyword,
} from '@/interfaces/advertising/amazon/sb-advertising.interface';
import {
  ISDAdGroup,
  ISDCampaign,
  ISDCreative,
  ISDProductAds,
} from '@/interfaces/advertising/amazon/sd-advertising.interface';
import {
  IAdGroup,
  IAutoTargeting,
  ICampaign,
  IKeywordTargeting,
  INegativeKeywordTargeting,
  INegativeProductTargeting,
  IPlacement,
  IProductAds,
  IProductTargeting,
  ISearchTermKeyword,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  OverallAccountLevelTitles,
  SbAccountLevelTitles,
  SbAdGroupLevelTitles,
  SbCampaignLevelTitles,
  SdAccountLevelTitles,
  SdAdGroupLevelTitles,
  SdCampaignLevelTitles,
  SpAccountLevelTitles,
  SpAdGroupLevelTitles,
  SpCampaignLevelTitles,
} from 'src/enums/advertising.enums';
import { ImpactAnalysisTableTitles } from 'src/enums/impact-analysis.enums';
import {
  IAMCCreatedAudienceData,
  IAMCScheduleData,
  IAMCWorkflowExecution,
  IAccountQueryMapping,
} from 'src/interfaces/amc.interfaces';
import {
  IImpactedAdGroupData,
  IImpactedCampaignData,
  IImpactedKeywordData,
  IImpactedProductData,
} from 'src/interfaces/analysis.interface';
import { IKeywordActionData } from 'src/interfaces/keyword-actions.interface';
import { ISerpKeyword } from 'src/interfaces/serp.interface';

const searchUtils = {
  getSearchTableData: (
    formattedRows:
      | ICampaign[]
      | IAdGroup[]
      | IKeywordTargeting[]
      | IProductTargeting[]
      | IProductAds[]
      | ISearchTermKeyword[]
      | INegativeKeywordTargeting[]
      | INegativeProductTargeting[]
      | IAutoTargeting[]
      | IPlacement[]
      | ISBCampaign[]
      | ISBAdGroup[]
      | ISBProductAds[]
      | ISBKeywordTargeting[]
      | ISBProductTargeting[]
      | ISBCreative[]
      | ISBSearchTermKeyword[]
      | ISBNegativeTargetingKeyword[]
      | ISBNegativeTargetingProduct[]
      | ISDCampaign[]
      | ISDAdGroup[]
      | ISDProductAds[]
      | ISDCreative[]
      | IOverallCampaign[]
      | IOverallAdGroup[]
      | IOverallProductAds[]
      | IOverallKeywordTargeting[]
      | IOverallProductTargeting[]
      | IImpactedCampaignData[]
      | IImpactedAdGroupData[]
      | IImpactedProductData[]
      | IImpactedKeywordData[]
      | ISerpKeyword[]
      | IAccountQueryMapping[]
      | IAMCWorkflowExecution[]
      | IAMCCreatedAudienceData[]
      | IAMCScheduleData[]
      | IKeywordActionData[],
    searchText: string,
    title: string
  ) => {
    let updatedRows: any[] = [] as typeof formattedRows;
    switch (title) {
      case SpAccountLevelTitles.CAMPAIGNS: {
        const dataToFiler = [...formattedRows] as ICampaign[];
        updatedRows = dataToFiler.filter((row) =>
          row.campaignName?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case SpAccountLevelTitles.AD_GROUPS:
      case SpCampaignLevelTitles.AD_GROUPS: {
        const dataToFiler = [...formattedRows] as IAdGroup[];
        updatedRows = dataToFiler.filter((row) =>
          row.adGroupName?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }
      case SpAccountLevelTitles.PRODUCT_ADS:
      case SpCampaignLevelTitles.PRODUCT_ADS:
      case SpAdGroupLevelTitles.PRODUCT_ADS: {
        const dataToFiler = [...formattedRows] as IProductAds[];
        updatedRows = dataToFiler.filter(
          (row) =>
            row.itemName?.toLowerCase().includes(searchText.toLowerCase()) ||
            row.asin?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case SpAccountLevelTitles.KEYWORD_TARGETING:
      case SpCampaignLevelTitles.KEYWORD_TARGETING: {
        const dataToFiler = [...formattedRows] as IKeywordTargeting[];
        updatedRows = dataToFiler.filter((row) =>
          row.keywordText?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case SpAccountLevelTitles.AUTO_TARGETING:
      case SpCampaignLevelTitles.AUTO_TARGETING: {
        const dataToFiler = [...formattedRows] as IAutoTargeting[];
        updatedRows = dataToFiler.filter((row) =>
          row.targeting?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case SpAccountLevelTitles.PRODUCT_TARGETING:
      case SpCampaignLevelTitles.PRODUCT_TARGETING: {
        const dataToFiler = [...formattedRows] as IProductTargeting[];
        updatedRows = dataToFiler.filter((row) =>
          row.targeting?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case SpAccountLevelTitles.PLACEMENT:
      case SpCampaignLevelTitles.PLACEMENT: {
        const dataToFiler = [...formattedRows] as IPlacement[];
        updatedRows = dataToFiler.filter(
          (row) =>
            row.placement?.toLowerCase().includes(searchText.toLowerCase()) ||
            row.campaignName?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case SpCampaignLevelTitles.NEG_TARGETING_KEYWORD:
      case SpAdGroupLevelTitles.NEG_TARGETING_KEYWORD: {
        const dataToFiler = [...formattedRows] as INegativeKeywordTargeting[];
        updatedRows = dataToFiler.filter((row) =>
          row.keywordText?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case SpCampaignLevelTitles.NEG_TARGETING_PRODUCT:
      case SpAdGroupLevelTitles.NEG_TARGETING_PRODUCT: {
        const dataToFiler = [...formattedRows] as INegativeProductTargeting[];
        updatedRows = dataToFiler.filter((row) =>
          row.targeting?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case SpAdGroupLevelTitles.KEYWORD_TARGETING: {
        const dataToFiler = [...formattedRows] as IKeywordTargeting[];
        updatedRows = dataToFiler.filter((row) =>
          row.keywordText?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case SpAdGroupLevelTitles.PRODUCT_TARGETING: {
        const dataToFiler = [...formattedRows] as IProductTargeting[];
        updatedRows = dataToFiler.filter((row) =>
          row.targeting?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case SpAdGroupLevelTitles.TARGETING: {
        const dataToFiler = [...formattedRows] as IAutoTargeting[];
        updatedRows = dataToFiler.filter((row) =>
          row.targeting?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case SpAccountLevelTitles.SEARCH_TERM:
      case SpCampaignLevelTitles.SEARCH_TERM:
      case SpAdGroupLevelTitles.SEARCH_TERM:
      case OverallAccountLevelTitles.SEARCH_TERM: {
        const dataToFiler = [...formattedRows] as ISearchTermKeyword[];
        updatedRows = dataToFiler.filter(
          (row) =>
            row.keyword?.toLowerCase().includes(searchText.toLowerCase()) ||
            row.searchTerm?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case SbAccountLevelTitles.CAMPAIGNS: {
        const dataToFiler = [...formattedRows] as ISBCampaign[];
        updatedRows = dataToFiler.filter((row) =>
          row.campaignName?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case SbAccountLevelTitles.AD_GROUP:
      case SbCampaignLevelTitles.AD_GROUP: {
        const dataToFiler = [...formattedRows] as ISBAdGroup[];
        updatedRows = dataToFiler.filter((row) =>
          row.adGroupName?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case SbAccountLevelTitles.PRODUCT_ADS:
      case SbCampaignLevelTitles.PRODUCT_ADS:
      case SbAdGroupLevelTitles.PRODUCT_ADS: {
        const dataToFiler = [...formattedRows] as ISBProductAds[];
        updatedRows = dataToFiler.filter((row) =>
          row.name?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case SbAccountLevelTitles.KEYWORD_TARGETING:
      case SbCampaignLevelTitles.KEYWORD_TARGETING:
      case SbAdGroupLevelTitles.KEYWORD_TARGETING: {
        const dataToFiler = [...formattedRows] as ISBKeywordTargeting[];
        updatedRows = dataToFiler.filter((row) =>
          row.keywordText?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case SbAccountLevelTitles.PRODUCT_TARGETING:
      case SbCampaignLevelTitles.PRODUCT_TARGETING:
      case SbAdGroupLevelTitles.PRODUCT_TARGETING: {
        const dataToFiler = [...formattedRows] as ISBProductTargeting[];
        updatedRows = dataToFiler.filter((row) =>
          row.targeting?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case SbAccountLevelTitles.SEARCH_TERM:
      case SbCampaignLevelTitles.SEARCH_TERM_KEYWORD:
      case SbAdGroupLevelTitles.SEARCH_TERM_KEYWORD: {
        const dataToFiler = [...formattedRows] as ISBSearchTermKeyword[];
        updatedRows = dataToFiler.filter(
          (row) =>
            row.keywordText?.toLowerCase().includes(searchText.toLowerCase()) ||
            row.searchTerm?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case SbCampaignLevelTitles.NEG_TARGETING_KEYWORD:
      case SbAdGroupLevelTitles.NEG_TARGETING_KEYWORD: {
        const dataToFiler = [...formattedRows] as ISBNegativeTargetingKeyword[];
        updatedRows = dataToFiler.filter((row) =>
          row.keywordText?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case SbCampaignLevelTitles.NEG_TARGETING_PRODUCT:
      case SbAdGroupLevelTitles.NEG_TARGETING_PRODUCT: {
        const dataToFiler = [...formattedRows] as ISBNegativeTargetingProduct[];
        updatedRows = dataToFiler.filter((row) =>
          row.targeting?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case SdAccountLevelTitles.CAMPAIGN: {
        const dataToFiler = [...formattedRows] as ISDCampaign[];
        updatedRows = dataToFiler.filter((row) =>
          row.campaignName?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case SdAccountLevelTitles.AD_GROUP:
      case SdCampaignLevelTitles.AD_GROUP: {
        const dataToFiler = [...formattedRows] as ISDAdGroup[];
        updatedRows = dataToFiler.filter((row) =>
          row.adGroupName?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case SdAccountLevelTitles.PRODUCT_ADS:
      case SdCampaignLevelTitles.PRODUCT_ADS:
      case SdAdGroupLevelTitles.PRODUCT_ADS: {
        const dataToFiler = [...formattedRows] as ISDProductAds[];
        updatedRows = dataToFiler.filter((row) => {
          return (
            row.itemName?.toLowerCase().includes(searchText.toLowerCase()) ||
            row.asin?.toLowerCase().includes(searchText.toLowerCase()) ||
            searchText
              .split(',')
              .some(
                (text) => row.asin?.toLowerCase() === text.trim().toLowerCase()
              )
          );
        });
        break;
      }

      case OverallAccountLevelTitles.CAMPAIGNS: {
        const dataToFiler = [...formattedRows] as IOverallCampaign[];
        updatedRows = dataToFiler.filter((row) =>
          row.campaignName?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case OverallAccountLevelTitles.AD_GROUPS: {
        const dataToFiler = [...formattedRows] as IOverallAdGroup[];
        updatedRows = dataToFiler.filter((row) =>
          row.adGroupName?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case OverallAccountLevelTitles.PRODUCT_ADS: {
        const dataToFiler = [...formattedRows] as IOverallProductAds[];
        updatedRows = dataToFiler.filter((row) => {
          return (
            row.itemName?.toLowerCase().includes(searchText.toLowerCase()) ||
            searchText
              .split(',')
              .some(
                (text) => row.asin?.toLowerCase() === text.trim().toLowerCase()
              )
          );
        });
        break;
      }

      case OverallAccountLevelTitles.KEYWORD_TARGETING: {
        const dataToFiler = [...formattedRows] as IOverallKeywordTargeting[];
        updatedRows = dataToFiler.filter((row) =>
          row.keywordText?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case OverallAccountLevelTitles.PRODUCT_TARGETING: {
        const dataToFiler = [...formattedRows] as IOverallProductTargeting[];
        updatedRows = dataToFiler.filter((row) =>
          row.targeting?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case ImpactAnalysisTableTitles.CAMPAIGN: {
        const dataToFiler = [...formattedRows] as IImpactedCampaignData[];
        updatedRows = dataToFiler.filter((row) =>
          row.campaignName?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case ImpactAnalysisTableTitles.AD_GROUP: {
        const dataToFiler = [...formattedRows] as IImpactedAdGroupData[];
        updatedRows = dataToFiler.filter((row) =>
          row.adGroupName?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case ImpactAnalysisTableTitles.PRODUCT_ADS: {
        const dataToFiler = [...formattedRows] as IImpactedProductData[];
        updatedRows = dataToFiler.filter((row) =>
          row.productName?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case ImpactAnalysisTableTitles.KEYWORDS: {
        const dataToFiler = [...formattedRows] as IImpactedKeywordData[];
        updatedRows = dataToFiler.filter((row) =>
          row.keywordName?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case 'Keyword_Tracker': {
        const dataToFiler = [...formattedRows] as ISerpKeyword[];
        updatedRows = dataToFiler.filter((row) =>
          row.keyword?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case 'AMC_Queries': {
        const dataToFiler = [...formattedRows] as IAccountQueryMapping[];
        updatedRows = dataToFiler.filter((row) => {
          const matchedTitle = row.queryId?.title
            ?.toLowerCase()
            .includes(searchText.toLowerCase());

          const matchedTags = row.queryId?.tags?.some((tag) =>
            tag?.toLowerCase().includes(searchText.toLowerCase())
          );

          return matchedTitle || matchedTags;
        });
        break;
      }

      case 'AMC_ExecutedQueries': {
        const dataToFiler = [...formattedRows] as IAMCWorkflowExecution[];
        updatedRows = dataToFiler.filter(
          (row) =>
            row.workflowId?.toLowerCase().includes(searchText.toLowerCase()) ||
            row.executionName?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      case 'AMC_ExecutedAudience': {
        const dataToFiler = [...formattedRows] as IAMCCreatedAudienceData[];
        updatedRows = dataToFiler.filter(
          (row) =>
            row.audienceExecutionName
              ?.toLowerCase()
              .includes(searchText.toLowerCase()) ||
            row.audienceExecutionId
              ?.toLowerCase()
              .includes(searchText.toLowerCase())
        );
        break;
      }

      case 'AMC_ScheduledWorkflowExecutions': {
        const dataToFiler = [...formattedRows] as IAMCScheduleData[];
        updatedRows = dataToFiler.filter(
          (row) =>
            row.scheduleName
              ?.toLowerCase()
              .includes(searchText.toLowerCase()) ||
            row.workflowId?.toLowerCase().includes(searchText.toLowerCase())
        );
        break;
      }

      default:
        updatedRows = [];
        break;
    }
    return updatedRows;
  },
};

export default searchUtils;
