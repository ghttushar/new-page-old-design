import { REVIEW_FEATURE_FLAGS } from '@/constants/feature-flag/feature-flag.constants';
import {
  WalmartReviewDecisionStatusEnum,
  WalmartReviewProcessStatusEnum,
} from '@/enums/advertising-review.enums';
import { ConfigurationTableTitlesEnum } from '@/enums/configurations.enum';
import { DayPartingTitlesEnum } from '@/enums/day-parting.enums';
import { ActionTypesEnum } from '@/enums/logs.enums';
import {
  MetaTypeEnum,
  MonitoringTableTitlesEnum,
} from '@/enums/monitoring.enum';
import { ProfitabilityTableTitlesEnum } from '@/enums/profitability.enums';
import { RulesPageTitleEnum } from '@/enums/rules.enum';
import { MarketplaceEnum, Range } from '@/enums/serp.enums';
import {
  IOverallAdGroup,
  IOverallAdvertisingData,
  IOverallCampaign,
  IOverallKeywordTargeting,
  IOverallProductAds,
  IOverallProductTargeting,
} from '@/interfaces/advertising/amazon/overall-advertising.interface';
import {
  ISBAdGroup,
  ISBAdvertisingData,
  ISBCampaign,
  ISBKeywordTargeting,
  ISBNegativeTargetingKeyword,
  ISBNegativeTargetingProduct,
  ISBProductAds,
  ISBProductTargeting,
} from '@/interfaces/advertising/amazon/sb-advertising.interface';
import {
  ISDAdGroup,
  ISDAdvertisingData,
  ISDCampaign,
  ISDProductAds,
} from '@/interfaces/advertising/amazon/sd-advertising.interface';
import {
  IAdGroup,
  IAdvertisingFilter,
  IAdvertisingNavigationBarOption,
  IAutoTargeting,
  ICampaign,
  IDateRange,
  IKeywordTargeting,
  INegativeKeywordTargeting,
  INegativeProductTargeting,
  IPerformanceGraphData,
  IPerformanceMetricsData,
  IPlacementBidding,
  IProductAds,
  IProductTargeting,
  ISPAdvertisingData,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  IChipBasedEntityTypes,
  ICreateKeyword,
  IEntityTypes,
  IKeywordTargetTypes,
  IProductTargetTypes,
} from '@/interfaces/advertising/create-dialog/create-dialog.interface';
import {
  ICampaignPageType,
  ICampaignPlatform,
  IWalmartAdsAccount,
  IWalmartCreateAccount,
} from '@/interfaces/advertising/walmart/walmart-advertising.interface';
import {
  IWalmartOverallAdGroup,
  IWalmartOverallAdvertisingData,
  IWalmartOverallCampaign,
  IWalmartOverallKeywords,
} from '@/interfaces/advertising/walmart/walmart-overall-advertising.interface';
import { IWalmartSBAdvertisingData } from '@/interfaces/advertising/walmart/walmart-sb-advertising.interface';
import {
  IWalmartSVAdGroup,
  IWalmartSVAdvertisingData,
  IWalmartSVCampaign,
  IWalmartSVKeywords,
} from '@/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import { IProductAdsEligibility } from '@/interfaces/column.interface';
import { IMultiSelectDropdownItem } from '@/interfaces/dropdown.interfaces';
import {
  IEditAccessCampaign,
  IEditAccessWalmartCampaign,
  IErrorMessageDetails,
} from '@/interfaces/edit-access/edit-access.interface';
import { IDateRangeFilter } from '@/interfaces/serp.interface';
import {
  IAPIResponse,
  IErrorResultDetails,
  IParsedError,
} from '@/interfaces/service.interface';
import { ISettingsAccount } from '@/interfaces/settings.interface';
import { AnyAction } from '@reduxjs/toolkit';
import {
  ColumnDef,
  ColumnPinningState,
  HeaderContext,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { Dispatch } from 'react';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import {
  customRangeFilterOption,
  EMPTY_ACCOUNT,
  LOGO_ITEM_ID,
  UPDATED_PAGINATION_MODEL,
} from 'src/constants';
import {
  advertisingOptionAdTypeAmazon,
  advertisingOptionAdTypeWalmart,
  AMAZON_ADGROUP_NAME_LIMIT,
  AMAZON_CAMPAIGN_NAME_LIMIT,
  AMAZON_CATALOG_FULFILLMENT_MAPPING,
  AMAZON_CATALOG_TABLE_FULFILLMENT_MAPPING,
  biddingStrategyOptions,
  currencyMetrics,
  DEFAULT_ADVERTISING_SORT_CRITERIA,
  EDIT_ACCESS_OMIT_KEYS,
  IS_BID_AUTOMATION_REQUIRED,
  ITEM_CONDITION_MAPPING,
  ITEM_CONDITION_REVERSE_MAPPING,
  noneAdTypeOption,
  numberMetrics,
  percentageMetrics,
  range,
  sdBidCostTypeMappedOptions,
  sdTacticOptions,
  statusOptions,
  WALMART_ADGROUP_NAME_LIMIT,
  WALMART_AUTO_SP_BID_MAX_LIMIT,
  WALMART_AUTO_SP_BID_MIN_LIMIT,
  WALMART_CAMPAIGN_NAME_LIMIT,
  WALMART_MANUAL_SB_BID_MAX_LIMIT,
  WALMART_MANUAL_SB_BID_MIN_LIMIT,
  WALMART_MANUAL_SP_BID_MAX_LIMIT,
  WALMART_MANUAL_SP_BID_MIN_LIMIT,
  WALMART_MANUAL_SV_BID_MAX_LIMIT,
  WALMART_MANUAL_SV_BID_MIN_LIMIT,
} from 'src/constants/advertising-filter.constants';
import {
  ADS_ELIGIBILITY_MAPPING,
  BIDDING_STRATEGY_MAPPING,
  CATALOG_PRIMARY_MAPPINGS,
  WALMART_1P_DAILY_BUDGET_MIN,
  WALMART_1P_TOTAL_BUDGET_MIN,
  WALMART_3P_DAILY_BUDGET_MIN,
  WALMART_3P_TOTAL_BUDGET_MIN,
  WALMART_AD_TYPE_MAPPINGS,
  WALMART_BUDGET_MAX,
  WALMART_PAGE_TYPE_TO_ACTUAL_MAPPINGS,
  WALMART_PAGE_TYPE_TO_TABLE_MAPPINGS,
} from 'src/constants/advertising-walmart.constants';
import { ASIN_REGEX } from 'src/constants/regex.constants';
import {
  ADVERTISING_ACCOUNT_URL,
  KEYWORD_ACTION_URL,
  PRODUCT_IMG_URL,
  REPORTS_LIST_URL,
} from 'src/constants/urls.constants';
import {
  Adjustments,
  AdType,
  AdTypeShort,
  AdvertisingTabRoutes,
  AdvertisingTitlesEnum,
  AmazonAccountType,
  AmazonAdvertisingTableTypesEnum,
  AmazonCostTypeEnum,
  AmazonSBBudgetTypeEnum,
  AmazonSBCreativeTypeEnum,
  AmazonSearchColumnsEnum,
  CampaignStateEnum,
  ColumnNameEnum,
  MetricsOptions,
  NudgeNotificationHeaderEnum,
  NudgeNotificationTitleEnum,
  OverallAccountLevelTitles,
  PageTypeActualEnum,
  PageTypeTableEnum,
  PerformanceTypeEnum,
  PlacementBids,
  PlacementNames,
  RuleAutomationStatusEnum,
  SbAccountLevelTitles,
  SbAdGroupLevelTitles,
  SbCampaignLevelTitles,
  SdAccountLevelTitles,
  SdAdGroupLevelTitles,
  SdCampaignLevelTitles,
  SortOrderEnum,
  SpAccountLevelTitles,
  SpAdGroupLevelTitles,
  SpCampaignLevelTitles,
  WalmartAdvertisingTableTypeEnum,
  WalmartOverallAccountLevelTitles,
  WalmartSBAccountLevelTitles,
  WalmartSBAdGroupLevelTitles,
  WalmartSBCampaignLevelTitles,
  WalmartSPAccountLevelTitles,
  WalmartSPAdGroupLevelTitles,
  WalmartSPCampaignLevelTitles,
  WalmartSVAccountLevelTitles,
  WalmartSVAdGroupLevelTitles,
  WalmartSVCampaignLevelTitles,
} from 'src/enums/advertising.enums';
import {
  AmazonCatalogColumnIdsEnum,
  CatalogTabTitlesEnum,
} from 'src/enums/catalog.enums';
import { Filters } from 'src/enums/filter.enums';
import { ImpactAnalysisTableTitles } from 'src/enums/impact-analysis.enums';
import {
  TargetingTypeEnum,
  WalmartAccountTypeEnum,
  WalmartAdAccountAPIAccessTypeEnum,
  WalmartAdGroupStatusEnum,
  WalmartAdTypeEnum,
  WalmartCampaignStatusEnum,
  WalmartSearchColumnsEnum,
} from 'src/enums/walmart.enums';
import {
  IAccountPayloadDetails,
  IAdvertisingArrayData,
  IAdvertisingInterfaces,
  IAdvertisingPayloadDetails,
  IAdvertisingPerformanceRequestBody,
  IAdvertisingTableInterfaces,
  IBulkActionContext,
  IPerformancePayload,
  ISortCriteria,
  ITableFooterData,
} from 'src/interfaces/advertising/advertising.interface';
import {
  IWalmartAdGroup,
  IWalmartAdItem,
  IWalmartCampaign,
  IWalmartKeywords,
  IWalmartSPAdvertisingData,
} from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { IRowErrorMessage } from 'src/redux/slices/advertising/advertising-edit-access.slice';
import {
  IAdvertisingFilterForm,
  IPerformanceMetricsOptions,
} from 'src/redux/slices/advertising/advertising-filter.slice';
import {
  IFinalFilters,
  setAppliedFilters,
  setFilters,
} from 'src/redux/slices/filters/filter.slice';
import {
  displayValue,
  formatNum,
  formatStringToTitleCase,
  getAmz_SB_CPC_Img_MaxBidLimitByCountry,
  getAmz_SB_CPC_Img_MinBidLimitByCountry,
  getAmz_SB_VCPM_Img_BIS_MaxBidLimitByCountry,
  getAmz_SB_VCPM_Img_BIS_MinBidLimitByCountry,
  getAmz_SBV_CPC_Vid_MaxBidLimitByCountry,
  getAmz_SBV_CPC_Vid_MinBidLimitByCountry,
  getAmz_SBV_VCPM_Vid_BIS_MaxBidLimitByCountry,
  getAmz_SBV_VCPM_Vid_BIS_MinBidLimitByCountry,
  getAmz_SD_CPC_MaxBidLimitByCountry,
  getAmz_SD_CPC_MinBidLimitByCountry,
  getAmz_SD_VCPM_MaxBidLimitByCountry,
  getAmz_SD_VCPM_MinBidLimitByCountry,
  getAmzProductUrlByCountry,
  getAmzSBBudgetDaily1PMaxLimitByCountry,
  getAmzSBBudgetDaily1PMinLimitByCountry,
  getAmzSBBudgetDaily3PMaxLimitByCountry,
  getAmzSBBudgetDaily3PMinLimitByCountry,
  getAmzSBBudgetLifetime1PMaxLimitByCountry,
  getAmzSBBudgetLifetime1PMinLimitByCountry,
  getAmzSBBudgetLifetime3PMaxLimitByCountry,
  getAmzSBBudgetLifetime3PMinLimitByCountry,
  getAmzSDBudget1PMaxLimitByCountry,
  getAmzSDBudget1PMinLimitByCountry,
  getAmzSDBudget3PMaxLimitByCountry,
  getAmzSDBudget3PMinLimitByCountry,
  getAmzSPBudget1PMaxLimitByCountry,
  getAmzSPBudget1PMinLimitByCountry,
  getAmzSPBudget3PMaxLimitByCountry,
  getAmzSPBudget3PMinLimitByCountry,
  getAmzSPMaxBidLimitByCountry,
  getAmzSPMinBidLimitByCountry,
  getCurrentDateTime,
  getTitleCaseString,
  getUniqueDropDownItems,
  removeKeysFromArrayOfObjects,
  splitStringByDelimiters,
} from '.';
import { imageUrls } from '../constants/assets/images.constants';
import { getCustomDateRange, getUSFormatDate } from './datetime.utils';
import localStorageUtils from './local-storage/local-storage.utils';
import {
  genCatalogAccountOptionValue,
  getAdvertisingAccountOptions,
} from './marketplace-logo.utils';
import { isDisabledFilter, syncStoredLsFilters } from './row-filter.utils';
import searchUtils from './search.utils';
import accountUtils from './settings/accounts/account.utils';

export const getPerformanceMetricsUpdatedOptions = (
  newVal: IDropdownItem<string>,
  prevVal: IDropdownItem<string>,
  metricsOptions: IDropdownItem<string>[],
  selectedValue: string,
  otherSelectedMetrics: string[]
) => {
  return metricsOptions.map((metrics) => {
    if (metrics.value === prevVal.value && prevVal.value !== newVal.value) {
      metrics.isDisabled = false;
    } else if (metrics.value === selectedValue) {
      metrics.selected = true;
      metrics.isDisabled = false;
    } else if (otherSelectedMetrics.includes(metrics.value)) {
      metrics.selected = false;
      metrics.isDisabled = true;
    }
    return metrics;
  });
};

export const getMetricsGraphData = (
  data: IPerformanceGraphData[],
  metrics: IDropdownItem<string>,
  labels: string[]
) => {
  const formattedData: number[] = [];
  switch (metrics.value) {
    case MetricsOptions.PERCENTAGE_ORDERS_NTB:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.percentNtbOrders ?? 0
        );
      });
      break;

    case MetricsOptions.PERCENTAGE_SALES_NTB:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.percentNtbSales ?? 0
        );
      });
      break;

    case MetricsOptions.PERCENTAGE_UNITS_NTB:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.percentNtbUnits ?? 0
        );
      });
      break;

    case MetricsOptions.ACOS:
      labels.forEach((label) => {
        formattedData.push(data.find((row) => row.label === label)?.acos ?? 0);
      });
      break;

    case MetricsOptions.CTR:
      labels.forEach((label) => {
        formattedData.push(data.find((row) => row.label === label)?.ctr ?? 0);
      });
      break;

    case MetricsOptions.CLICKS:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.clicks ?? 0
        );
      });
      break;

    case MetricsOptions.VCPM:
      break;

    case MetricsOptions.CPC:
      labels.forEach((label) => {
        formattedData.push(data.find((row) => row.label === label)?.cpc ?? 0);
      });
      break;

    case MetricsOptions.IMPRESSIONS:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.impressions ?? 0
        );
      });
      break;

    case MetricsOptions.NTB_ORDERS:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.ntbOrders ?? 0
        );
      });
      break;

    case MetricsOptions.NTB_SALES:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.ntbSales ?? 0
        );
      });
      break;

    case MetricsOptions.AD_UNITS:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.unitsSold ?? 0
        );
      });
      break;

    case MetricsOptions.TOTAL_UNITS:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.totalUnits ?? 0
        );
      });
      break;

    case MetricsOptions.ROAS:
      labels.forEach((label) => {
        formattedData.push(data.find((row) => row.label === label)?.roas ?? 0);
      });
      break;

    case MetricsOptions.AD_SPEND:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.adSpend ?? 0
        );
      });
      break;

    case MetricsOptions.VIEWABLE_IMPRESSIONS:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.viewableImpressions ?? 0
        );
      });
      break;

    case MetricsOptions.TOTAL_SALES:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.totalSales ?? 0
        );
      });
      break;

    case MetricsOptions.AD_SALES:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.adSales ?? 0
        );
      });
      break;

    case MetricsOptions.CVR:
      labels.forEach((label) => {
        formattedData.push(data.find((row) => row.label === label)?.cvr ?? 0);
      });
      break;

    case MetricsOptions.TACOS:
      labels.forEach((label) => {
        formattedData.push(data.find((row) => row.label === label)?.tacos ?? 0);
      });
      break;

    case MetricsOptions.ADVERTISED_SKU_SALES:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.advertisedSkuSales ?? 0
        );
      });
      break;

    case MetricsOptions.OTHER_SKU_SALES:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.otherSkuSales ?? 0
        );
      });
      break;

    case MetricsOptions.ADVERTISED_SKU_UNITS:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.advertisedSkuUnits ?? 0
        );
      });
      break;

    case MetricsOptions.OTHER_SKU_UNITS:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.otherSkuUnits ?? 0
        );
      });
      break;

    case MetricsOptions.AD_ORDERS:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.adOrders ?? 0
        );
      });
      break;

    case MetricsOptions.ORDERS:
      break;

    case MetricsOptions.CVR_ORDERS:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.cvrOrdersSoldBased ?? 0
        );
      });
      break;

    case MetricsOptions.CVR_UNITS:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.cvrUnitsSoldBased ?? 0
        );
      });
      break;

    case MetricsOptions.NTB_UNITS:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.ntbUnits ?? 0
        );
      });
      break;

    case MetricsOptions.COMPLETE_VIEW_AD_ORDERS:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.completeViewOrders ?? 0
        );
      });
      break;

    case MetricsOptions.COMPLETE_VIEW_AD_UNITS:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.completeViewAdUnits ?? 0
        );
      });
      break;

    case MetricsOptions.VIDEO_COMPLETE_VIEWS:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.videoCompleteViews ?? 0
        );
      });
      break;

    case MetricsOptions.VIDEO_FIRST_QUARTILE_VIEWS:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.videoFirstQuartileViews ?? 0
        );
      });
      break;

    case MetricsOptions.VIDEO_IMPRESSIONS:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.videoImpressions ?? 0
        );
      });
      break;

    case MetricsOptions.VIDEO_MIDPOINT_VIEWS:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.videoMidpointViews ?? 0
        );
      });
      break;

    case MetricsOptions.VIDEO_THIRD_QUARTILE_VIEWS:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.videoThirdQuartileViews ?? 0
        );
      });
      break;

    case MetricsOptions.VIDEO_UNMUTES:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.videoUnmutes ?? 0
        );
      });
      break;

    case MetricsOptions.VIDEO_5_SECOND_VIEWS:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.video5SecondViews ?? 0
        );
      });
      break;

    case MetricsOptions.VIEW_THROUGH_AD_ORDERS:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.viewThroughAdOrders ?? 0
        );
      });
      break;

    case MetricsOptions.VIEW_THROUGH_AD_SALES:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.viewThroughAdSales ?? 0
        );
      });
      break;

    case MetricsOptions.VIEW_THROUGH_AD_UNITS:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.viewThroughAdUnits ?? 0
        );
      });
      break;

    case MetricsOptions.COMPLETE_VIEW_AD_SALES:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.completeViewAdSales ?? 0
        );
      });
      break;

    case MetricsOptions.OTHER_COMPLETE_VIEW_AD_SALES:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.otherCompleteViewAdSales ?? 0
        );
      });
      break;

    case MetricsOptions.VTR:
      labels.forEach((label) => {
        formattedData.push(data.find((row) => row.label === label)?.vtr ?? 0);
      });
      break;

    case MetricsOptions.VCTR:
      labels.forEach((label) => {
        formattedData.push(data.find((row) => row.label === label)?.vctr ?? 0);
      });
      break;

    case MetricsOptions.VIDEO_5_SECOND_VIEW_RATE:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.video5SecondViewRate ?? 0
        );
      });
      break;
    case MetricsOptions.GMV:
      labels.forEach((label) => {
        formattedData.push(data.find((row) => row.label === label)?.gmv ?? 0);
      });
      break;
    case MetricsOptions.UNITS_SOLD:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.grossUnits ?? 0
        );
      });
      break;
    case MetricsOptions.IN_STORE_ADVERTISED_SALES:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.inStoreAdvertisedSales ?? 0
        );
      });
      break;
    case MetricsOptions.IN_STORE_ATTRIBUTES_SALES:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.inStoreAttributedSales ?? 0
        );
      });
      break;
    case MetricsOptions.IN_STORE_ORDERS:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.inStoreOrders ?? 0
        );
      });
      break;
    case MetricsOptions.IN_STORE_OTHER_SALES:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.inStoreOtherSales ?? 0
        );
      });
      break;
    case MetricsOptions.IN_STORE_UNITS_SOLD:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.inStoreUnitsSold ?? 0
        );
      });
      break;
    case MetricsOptions.OMNI_CHANNEL_ROAS:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.omniChannelRoas ?? 0
        );
      });
      break;
    case MetricsOptions.OMNI_CHANNEL_SALES:
      labels.forEach((label) => {
        formattedData.push(
          data.find((row) => row.label === label)?.omniChannelSales ?? 0
        );
      });
      break;

    default:
      break;
  }

  return formattedData;
};

export const getMarketplaceUrl = (marketplace: string, adType: string) => {
  const marketplacePath = getMarketplacePath(marketplace);
  const adTypePath = getAdTypePath(adType);

  const url = `${ADVERTISING_ACCOUNT_URL}${marketplacePath}${adTypePath}`;
  return url;
};

export const getAdvertisingUrl = (
  marketplacePath: string,
  adTypePath: string
) => {
  const url = `${ADVERTISING_ACCOUNT_URL}${marketplacePath}${adTypePath}`;

  return url;
};

export const getKeywordActionMarketplaceUrl = (marketplace: string) => {
  const marketplacePath = getMarketplacePath(marketplace);
  const url = `${KEYWORD_ACTION_URL}${marketplacePath}`;
  return url;
};
export const getPowerBIReportsMarketplaceUrl = (marketplace: string) => {
  const marketplacePath = getMarketplacePath(marketplace);
  const url = `${REPORTS_LIST_URL}${marketplacePath}`;
  return url;
};

export const getCampaignUrl = (
  campaignId: number | string,
  adTypePath: string,
  marketplacePath: string
) => {
  const url = `${getAdvertisingUrl(
    marketplacePath,
    adTypePath
  )}/campaign/${campaignId}`;
  return url;
};

export const getAdGroupUrl = (
  campaignId: number | string,
  adGroupId: number | string,
  adTypePath: string,
  marketplacePath: string
) => {
  return `${getCampaignUrl(
    campaignId,
    adTypePath,
    marketplacePath
  )}/ad-group/${adGroupId}`;
};

export const getProductUrl = (productId: string, marketplace: string) => {
  if (marketplace === MarketplaceEnum.AMAZON) {
    return `${getAmzProductUrlByCountry()}${productId}`;
  } else if (marketplace === MarketplaceEnum.WALMART) {
    return `https://www.walmart.com/ip/${productId}`;
  } else {
    return '#';
  }
};

export const getProductImgUrl = (asin: string) => {
  return `${PRODUCT_IMG_URL}/${asin.toUpperCase()}.jpg`;
};

export const getSearchPlaceholder = (title: string) => {
  let placeholder = '';
  switch (title) {
    case SpAccountLevelTitles.CAMPAIGNS:
    case SbAccountLevelTitles.CAMPAIGNS:
    case SdAccountLevelTitles.CAMPAIGN:
    case OverallAccountLevelTitles.CAMPAIGNS:
    case ImpactAnalysisTableTitles.CAMPAIGN:
    case WalmartSPAccountLevelTitles.CAMPAIGNS:
    case WalmartSBAccountLevelTitles.CAMPAIGNS:
    case WalmartSVAccountLevelTitles.CAMPAIGNS:
    case WalmartOverallAccountLevelTitles.CAMPAIGNS:
      placeholder = 'Search by Campaigns';
      break;

    case SpAccountLevelTitles.AD_GROUPS:
    case SpCampaignLevelTitles.AD_GROUPS:
    case SbAccountLevelTitles.AD_GROUP:
    case SbCampaignLevelTitles.AD_GROUP:
    case SdAccountLevelTitles.AD_GROUP:
    case SdCampaignLevelTitles.AD_GROUP:
    case OverallAccountLevelTitles.AD_GROUPS:
    case ImpactAnalysisTableTitles.AD_GROUP:
    case WalmartSPAccountLevelTitles.AD_GROUPS:
    case WalmartSPCampaignLevelTitles.AD_GROUPS:
    case WalmartSBAccountLevelTitles.AD_GROUPS:
    case WalmartSBCampaignLevelTitles.AD_GROUPS:
    case WalmartSVAccountLevelTitles.AD_GROUPS:
    case WalmartSVCampaignLevelTitles.AD_GROUPS:
    case WalmartOverallAccountLevelTitles.AD_GROUPS:
    case ConfigurationTableTitlesEnum.SOURCE_TARGET_MAPPING:
      placeholder = 'Search by Ad Groups';
      break;

    case SpAccountLevelTitles.PRODUCT_ADS:
    case SpCampaignLevelTitles.PRODUCT_ADS:
    case SpAdGroupLevelTitles.PRODUCT_ADS:
    case SbAccountLevelTitles.PRODUCT_ADS:
    case SbCampaignLevelTitles.PRODUCT_ADS:
    case SbAdGroupLevelTitles.PRODUCT_ADS:
    case SdAccountLevelTitles.PRODUCT_ADS:
    case SdCampaignLevelTitles.PRODUCT_ADS:
    case SdAdGroupLevelTitles.PRODUCT_ADS:
    case ImpactAnalysisTableTitles.PRODUCT_ADS:
    case OverallAccountLevelTitles.PRODUCT_ADS:
    case WalmartSPAccountLevelTitles.AD_ITEMS:
    case WalmartSPCampaignLevelTitles.AD_ITEMS:
    case WalmartSPAdGroupLevelTitles.AD_ITEMS:
    case WalmartSBAccountLevelTitles.AD_ITEMS:
    case WalmartSBCampaignLevelTitles.AD_ITEMS:
    case WalmartSBAdGroupLevelTitles.AD_ITEMS:
    case WalmartSVAccountLevelTitles.AD_ITEMS:
    case WalmartSVCampaignLevelTitles.AD_ITEMS:
    case WalmartSVAdGroupLevelTitles.AD_ITEMS:
    case WalmartOverallAccountLevelTitles.AD_ITEMS:
      placeholder = 'Search by Product Ads';
      break;

    case SpAccountLevelTitles.KEYWORD_TARGETING:
    case SpCampaignLevelTitles.KEYWORD_TARGETING:
    case SpCampaignLevelTitles.NEG_TARGETING_KEYWORD:
    case SpAdGroupLevelTitles.NEG_TARGETING_KEYWORD:
    case SpAdGroupLevelTitles.KEYWORD_TARGETING:
    case SbAccountLevelTitles.KEYWORD_TARGETING:
    case SbCampaignLevelTitles.KEYWORD_TARGETING:
    case SbAdGroupLevelTitles.KEYWORD_TARGETING:
    case SbCampaignLevelTitles.NEG_TARGETING_KEYWORD:
    case SbAdGroupLevelTitles.NEG_TARGETING_KEYWORD:
    case OverallAccountLevelTitles.KEYWORD_TARGETING:
    case ImpactAnalysisTableTitles.KEYWORDS:
    case WalmartSPAccountLevelTitles.KEYWORD_TARGETING:
    case WalmartSPCampaignLevelTitles.KEYWORD_TARGETING:
    case WalmartSPAdGroupLevelTitles.KEYWORD_TARGETING:
    case WalmartSBAccountLevelTitles.KEYWORD_TARGETING:
    case WalmartSBCampaignLevelTitles.KEYWORD_TARGETING:
    case WalmartSBAdGroupLevelTitles.KEYWORD_TARGETING:
    case WalmartSVAccountLevelTitles.KEYWORD_TARGETING:
    case WalmartSVCampaignLevelTitles.KEYWORD_TARGETING:
    case WalmartSVAdGroupLevelTitles.KEYWORD_TARGETING:
    case WalmartOverallAccountLevelTitles.KEYWORD_TARGETING:
      placeholder = 'Search by Keywords';
      break;

    case 'Keyword_Tracker':
      placeholder = 'Search by Keyword';
      break;

    case SpAccountLevelTitles.PRODUCT_TARGETING:
    case SpCampaignLevelTitles.PRODUCT_TARGETING:
    case SpCampaignLevelTitles.NEG_TARGETING_PRODUCT:
    case SpAdGroupLevelTitles.NEG_TARGETING_PRODUCT:
    case SpAdGroupLevelTitles.PRODUCT_TARGETING:
    case SbAccountLevelTitles.PRODUCT_TARGETING:
    case SbCampaignLevelTitles.PRODUCT_TARGETING:
    case SbAdGroupLevelTitles.PRODUCT_TARGETING:
    case SbCampaignLevelTitles.NEG_TARGETING_PRODUCT:
    case SbAdGroupLevelTitles.NEG_TARGETING_PRODUCT:
    case OverallAccountLevelTitles.PRODUCT_TARGETING:
      placeholder = 'Search by Targeting';
      break;

    case OverallAccountLevelTitles.SEARCH_TERM:
    case SpAccountLevelTitles.SEARCH_TERM:
    case SpCampaignLevelTitles.SEARCH_TERM:
    case SpAdGroupLevelTitles.SEARCH_TERM:
    case SbAccountLevelTitles.SEARCH_TERM:
    case SbCampaignLevelTitles.SEARCH_TERM_KEYWORD:
    case SbAdGroupLevelTitles.SEARCH_TERM_KEYWORD:
      placeholder = 'Search by Search Terms/Targeting';
      break;
    case WalmartSPAccountLevelTitles.SEARCH_TERM:
    case WalmartSPCampaignLevelTitles.SEARCH_TERM:
    case WalmartSPAdGroupLevelTitles.SEARCH_TERM:
    case WalmartSBAccountLevelTitles.SEARCH_TERM:
    case WalmartSBCampaignLevelTitles.SEARCH_TERM:
    case WalmartSBAdGroupLevelTitles.SEARCH_TERM:
    case WalmartSVAccountLevelTitles.SEARCH_TERM:
    case WalmartSVCampaignLevelTitles.SEARCH_TERM:
    case WalmartSVAdGroupLevelTitles.SEARCH_TERM:
    case WalmartOverallAccountLevelTitles.SEARCH_TERM:
      placeholder = 'Search by Search Terms';
      break;

    case WalmartSPAccountLevelTitles.PAGE_TYPE:
    case WalmartSPCampaignLevelTitles.PAGE_TYPE:
    case WalmartSBAccountLevelTitles.PAGE_TYPE:
    case WalmartSBCampaignLevelTitles.PAGE_TYPE:
    case WalmartSVAccountLevelTitles.PAGE_TYPE:
    case WalmartSVCampaignLevelTitles.PAGE_TYPE:
    case WalmartOverallAccountLevelTitles.PAGE_TYPE:
      placeholder = 'Search by Page Type';
      break;

    case WalmartSPAccountLevelTitles.PLATFORM:
    case WalmartSPCampaignLevelTitles.PLATFORM:
    case WalmartSBAccountLevelTitles.PLATFORM:
    case WalmartSBCampaignLevelTitles.PLATFORM:
    case WalmartSVAccountLevelTitles.PLATFORM:
    case WalmartSVCampaignLevelTitles.PLATFORM:
    case WalmartOverallAccountLevelTitles.PLATFORM:
      placeholder = 'Search by Platform or Campaigns';
      break;

    case SpAccountLevelTitles.AUTO_TARGETING:
    case SpCampaignLevelTitles.AUTO_TARGETING:
    case SpAdGroupLevelTitles.TARGETING:
      placeholder = 'Search by Targeting';
      break;

    case SpCampaignLevelTitles.AUTOMATION_RULES:
    case SbCampaignLevelTitles.AUTOMATION_RULES:
    case SdCampaignLevelTitles.AUTOMATION_RULES:
    case WalmartSPCampaignLevelTitles.AUTOMATION_RULES:
    case WalmartSBCampaignLevelTitles.AUTOMATION_RULES:
    case WalmartSVCampaignLevelTitles.AUTOMATION_RULES:
      placeholder = 'Search by Rules';
      break;

    case 'AMC_Queries':
      placeholder = 'Search by Title';
      break;

    case 'AMC_ExecutedQueries':
      placeholder = 'Search by Execution Name';
      break;

    case 'AMC_ExecutedAudience':
      placeholder = 'Search by Audience Name';
      break;

    case 'AMC_ScheduledWorkflowExecutions':
      placeholder = 'Search by Schedule ID or Workflow ID';
      break;

    case 'Keyword_Action':
      placeholder = 'Search by Search Term, Campaign or AdGroup';
      break;

    case MonitoringTableTitlesEnum.MONITORING_HOME:
    case MonitoringTableTitlesEnum.MONITORING_HISTORY:
      placeholder = 'Search by Task Id / Task Type';
      break;

    case CatalogTabTitlesEnum.WALMART_CATALOG:
      placeholder = 'Search Product Name/Product ID/SKU';
      break;

    case CatalogTabTitlesEnum.AMAZON_CATALOG:
      placeholder = 'Search Product Name/ASIN/SKU/UPC Code';
      break;

    case DayPartingTitlesEnum.DAYPARTING_HISTORY:
      placeholder = 'Search by Job Id';
      break;

    case ProfitabilityTableTitlesEnum.PROFITABILITY_HOME:
      placeholder = 'Search by Order Id/Item Id/Product Name';
      break;

    case ProfitabilityTableTitlesEnum.PROFITABILITY_PNL:
    case ProfitabilityTableTitlesEnum.PROFITABILITY_TRENDS:
    case ProfitabilityTableTitlesEnum.PROFITABILITY_PNL_ORDERS:
    case ProfitabilityTableTitlesEnum.PROFITABILITY_PNL_PRODUCTS:
      placeholder = 'Search by Item Id/Product Name/SKU';
      break;

    case ProfitabilityTableTitlesEnum.AMZ_PROFITABILITY_TRENDS:
    case ProfitabilityTableTitlesEnum.AMZ_PROFITABILITY_PNL_ORDERS:
    case ProfitabilityTableTitlesEnum.AMZ_PROFITABILITY_PNL_PRODUCTS:
      placeholder = 'Search by ASIN/Product Name/SKU';
      break;

    case RulesPageTitleEnum.APPLIED_RULES:
      placeholder = 'Search by Rule Name/ID/Type';
      break;

    default:
      placeholder = 'Search';
      break;
  }

  return placeholder;
};

export const getSPBiddingStrategy = (strategy: string | null) => {
  if (!strategy) return null;
  const biddingStrategy = biddingStrategyOptions.filter(
    (option) => option.value === strategy
  );

  return biddingStrategy[0];
};

export const getAmazonAdType = (type: string) => {
  if (!type) return '-';

  if (
    type?.toUpperCase() === AdTypeShort.SPONSORED_PRODUCTS ||
    type === AdType.SPONSORED_PRODUCTS
  )
    return advertisingOptionAdTypeAmazon[1].label;
  if (
    type?.toUpperCase() === AdTypeShort.SPONSORED_BRANDS ||
    type === AdType.SPONSORED_BRANDS
  )
    return advertisingOptionAdTypeAmazon[2].label;
  if (
    type?.toUpperCase() === AdTypeShort.SPONSORED_DISPLAY ||
    type === AdType.SPONSORED_DISPLAY
  )
    return advertisingOptionAdTypeAmazon[3].label;
  else return '-';
};

export const getSDTactic = (value: string) => {
  if (!value) return '-';

  const tacticLabel = sdTacticOptions.filter(
    (tactic) => tactic.value === value
  )[0]?.label;

  return `${tacticLabel ? tacticLabel : '-'}`;
};

export const getSDBidMappedCostType = (bidType: string) => {
  if (!bidType) return '-';

  const costTypeLabel = sdBidCostTypeMappedOptions.filter(
    (costType) => costType.value === bidType
  )[0]?.label;

  return `${costTypeLabel ? costTypeLabel : '-'}`;
};

export const getAsinsListStringified = (asins: IProductAdsEligibility[]) => {
  if (!asins || !asins.length) return '-';

  let stringifiedAsins = '';

  asins.forEach((asin, index) => {
    stringifiedAsins +=
      `${asin.asin}  ` +
      `|` +
      ` ${getAdsEligibility(asin.eligibility)}` +
      (index === asins.length - 1 ? '' : ',\n');
  });

  return stringifiedAsins;
};

export const getCalculatedBudgetBid = (
  initialValue: number,
  changeFactor: number,
  changeType: string
) => {
  let updatedValue = 0;

  switch (changeType) {
    case Adjustments.INCREASE_VALUE:
      updatedValue = initialValue + changeFactor;
      break;

    case Adjustments.DECREASE_VALUE:
      updatedValue = initialValue - changeFactor;
      break;

    case Adjustments.SET_TO_VALUE:
      updatedValue = changeFactor;
      break;

    case Adjustments.INCREASE_PERCENTAGE:
      updatedValue = initialValue * (1 + changeFactor / 100);
      break;

    case Adjustments.DECREASE_PERCENTAGE:
      updatedValue = initialValue * (1 - changeFactor / 100);
      break;

    default:
      break;
  }

  return Number(updatedValue.toFixed(2));
};

const isEmptyObject = (object: Record<string, unknown>) => {
  return Object.keys(object).length === 0;
};

export const getDiff = (
  originalRow: Record<string, unknown>,
  editedRow: Record<string, unknown>
) => {
  const result: Record<string, unknown> = {};

  if (originalRow && editedRow) {
    const keys1 = Object.keys(originalRow);
    const keys2 = Object.keys(editedRow);
    const keys = new Set([...keys1, ...keys2]);

    keys.forEach((key) => {
      const originalValue = originalRow[key];
      const editedValue = editedRow[key];

      if (Array.isArray(originalValue)) {
        // TODO: original getDiff code. Don't remove. Need to test thoroughly with replaced code before removing.
        // if (
        //   !editedValue ||
        //   !Array.isArray(editedValue) ||
        //   editedValue.length !== originalValue.length ||
        //   originalValue.length === 0
        // )
        //   return;
        if (!Array.isArray(editedValue)) {
          result[key] = editedValue;
          return;
        }

        if (
          originalValue.length !== editedValue.length ||
          !originalValue.every((val, i) => checkIsEqual(val, editedValue[i]))
        ) {
          result[key] = editedValue;
          return;
        }
        // TODO: original getDiff code. Don't remove. Need to test thoroughly with replaced code before removing
        // else {
        //   for (let i = 0; i < originalValue.length; i++) {
        //     const v1 = originalValue[i];
        //     const v2 = editedValue[i];
        //     const changed = getDiff(v1, v2);
        //     if (!isEmptyObject(changed)) {
        //       result[key] = editedValue;
        //       return;
        //     }
        //   }
        // }
      } else if (typeof originalValue === 'object' && originalValue !== null) {
        const value = getDiff(
          originalValue as Record<string, unknown>,
          editedValue as Record<string, unknown>
        );
        if (!isEmptyObject(value)) {
          result[key] = value;
        }
      } else if (!checkIsEqual(originalValue, editedValue, key)) {
        result[key] = editedValue;
      }
    });
  }
  return result;
};
// TODO: need to discuss this logic
// export const checkIsEqual = (original: unknown, edited: unknown): boolean => {
//   if (original === edited) {
//     return true;
//   }

//   if (typeof original !== typeof edited) {
//     if (
//       (original === null || original === undefined) &&
//       (edited === null || edited === undefined)
//     ) {
//       return true;
//     }
//     if (typeof original === 'number' && typeof edited === 'string') {
//       return original === Number(edited) && !isNaN(Number(edited));
//     }
//     if (typeof original === 'string' && typeof edited === 'number') {
//       return Number(original) === edited && !isNaN(Number(original));
//     }
//     return false;
//   }

//   if (typeof original === 'object' && original !== null) {
//     const origKeys = Object.keys(original as object);
//     const editKeys = Object.keys(edited as object);

//     if (origKeys.length !== editKeys.length) {
//       return false;
//     }

//     return origKeys.every((key) =>
//       checkIsEqual(
//         (original as Record<string, unknown>)[key],
//         (edited as Record<string, unknown>)[key]
//       )
//     );
//   }

//   return original === edited;
// };
export const checkIsEqual = (
  original: unknown,
  edited: unknown,
  key = ''
): boolean => {
  if (
    (original === null || original === undefined || original === '') &&
    (edited === null || edited === undefined || edited === '')
  ) {
    return true;
  }

  if (Object.is(original, edited)) {
    return true;
  }

  if (typeof original === 'number' && typeof edited === 'number') {
    return isNaN(original) && isNaN(edited);
  }

  if (typeof original !== typeof edited) {
    if (typeof original === 'number' && typeof edited === 'string') {
      return original === Number(edited) && !isNaN(Number(edited));
    }
    if (typeof original === 'string' && typeof edited === 'number') {
      return Number(original) === edited && !isNaN(Number(original));
    }
    return false;
  }

  if (original instanceof Date && edited instanceof Date) {
    return original.getTime() === edited.getTime();
  }

  if (Array.isArray(original) && Array.isArray(edited)) {
    if (original.length !== edited.length) {
      return false;
    }
    return original.every((item, index) => checkIsEqual(item, edited[index]));
  }

  if (typeof original === 'object' && typeof edited === 'object') {
    if (original === null || edited === null) {
      return false;
    }

    const origKeys = Object.keys(original);
    const editKeys = Object.keys(edited);

    if (origKeys.length !== editKeys.length) {
      return false;
    }

    return origKeys.every((key) =>
      checkIsEqual(
        (original as Record<string, unknown>)[key],
        (edited as Record<string, unknown>)[key]
      )
    );
  }

  if (typeof original === 'function' && typeof edited === 'function') {
    return original === edited;
  }

  if (typeof original === 'symbol' && typeof edited === 'symbol') {
    return original === edited;
  }

  return false;
};

export const getTableUpdateDetails = (
  originalTable: Record<string, unknown>[],
  editedTable: Record<string, unknown>[],
  marketplace?: MarketplaceEnum
) => {
  const result = new Map();

  originalTable.forEach((originalRow, index) => {
    const editedRow = editedTable[index];
    const updatedValues = getDiff(originalRow, editedRow);

    const updatedValuesForMarketplace =
      marketplace && marketplace === MarketplaceEnum.WALMART
        ? {
            ...updatedValues,
            campaignId: editedRow && editedRow['campaignId'],
            adGroupId: editedRow && editedRow['adGroupId'],
            itemId: editedRow && editedRow['itemId'],
          }
        : updatedValues;

    const {
      createdAtInUTC,
      updatedAtInUTC,
      ...formattedUpdatedValuesForMarketplace
    } = updatedValuesForMarketplace;

    if (!isEmptyObject(formattedUpdatedValuesForMarketplace)) {
      result.set(editedRow.id, formattedUpdatedValuesForMarketplace);
    }
  });

  return result;
};

export const getSortedTableByStatus = (
  data:
    | ISPAdvertisingData[]
    | ISBAdvertisingData[]
    | ISDAdvertisingData[]
    | IOverallAdvertisingData[],
  title: string
):
  | ISPAdvertisingData[]
  | ISBAdvertisingData[]
  | ISDAdvertisingData[]
  | IOverallAdvertisingData[] => {
  const _data:
    | ICampaign[]
    | IAdGroup[]
    | IKeywordTargeting[]
    | IProductTargeting[]
    | IAutoTargeting[]
    | IProductAds[]
    | INegativeKeywordTargeting[]
    | INegativeProductTargeting[]
    | ISBCampaign[]
    | ISBKeywordTargeting[]
    | ISBProductTargeting[]
    | ISBNegativeTargetingKeyword[]
    | ISBNegativeTargetingProduct[]
    | ISDCampaign[]
    | ISDAdGroup[]
    | ISDProductAds[]
    | IOverallCampaign[]
    | IOverallAdGroup[]
    | IOverallProductAds[]
    | IOverallKeywordTargeting[]
    | IOverallProductTargeting[] = JSON.parse(JSON.stringify(data));

  const isStatusMissing =
    title === SpAccountLevelTitles.SEARCH_TERM ||
    title === SpCampaignLevelTitles.SEARCH_TERM ||
    title === SpAdGroupLevelTitles.SEARCH_TERM ||
    title === SbAccountLevelTitles.SEARCH_TERM ||
    title === SbCampaignLevelTitles.SEARCH_TERM_KEYWORD ||
    title === SbAdGroupLevelTitles.SEARCH_TERM_KEYWORD ||
    title === OverallAccountLevelTitles.SEARCH_TERM ||
    title === SdAdGroupLevelTitles.CREATIVE;

  if (!_data.length) return _data;
  if (isStatusMissing) return _data;

  return _data.sort((a, b) => {
    const enabledStatus = CampaignStateEnum.ENABLED;
    const pausedStatus = CampaignStateEnum.PAUSED;
    const archivedStatus = CampaignStateEnum.ARCHIVED;

    const statusOrder: { [status: string]: number } = {
      [enabledStatus]: 1,
      [pausedStatus]: 2,
      [archivedStatus]: 3,
    };

    const status1 = statusOrder[a.status?.toUpperCase()];
    const status2 = statusOrder[b.status?.toUpperCase()];

    return status1 - status2;
  });
};

export const campaignStatusSortComparator = (
  v1: any,
  v2: any,
  param1: any,
  param2: any
) => {
  const enabledStatus = CampaignStateEnum.ENABLED;
  const pausedStatus = CampaignStateEnum.PAUSED;
  const archivedStatus = CampaignStateEnum.ARCHIVED;

  const statusOrder: { [status: string]: number } = {
    [enabledStatus]: 1,
    [pausedStatus]: 2,
    [archivedStatus]: 3,
  };

  const status1 = statusOrder[param1.value?.toUpperCase()];
  const status2 = statusOrder[param2.value?.toUpperCase()];

  return status1 - status2;
};

export const getAdTypePath = (adType: string) => {
  let adTypePathName: string;

  if (adType === AdType.SPONSORED_PRODUCTS) {
    adTypePathName = '/sp';
  } else if (adType === AdType.SPONSORED_BRANDS) {
    adTypePathName = '/sb';
  } else if (adType === AdType.SPONSORED_DISPLAY) {
    adTypePathName = '/sd';
  } else if (adType === AdType.SPONSORED_VIDEO) {
    adTypePathName = '/sv';
  } else {
    adTypePathName = '/all';
  }

  return adTypePathName;
};

export const getMarketplacePath = (marketplace?: string) => {
  let marketplacePathName: string;
  if (marketplace === MarketplaceEnum.WALMART) {
    marketplacePathName = '/walmart';
  } else if (marketplace === MarketplaceEnum.AMAZON) {
    marketplacePathName = '/amazon';
  } else {
    marketplacePathName = '';
  }

  return marketplacePathName;
};

export const getAmazonAdvertisingFilters = (
  filterData: IAdvertisingFilterForm,
  customDateRange: IDateRange,
  isDownload = false,
  downloadWithFilter = false,
  campaignId = '',
  adGroupId = ''
): IAdvertisingFilter => {
  const filters: IAdvertisingFilter = {
    frequency: filterData.frequency.value,
    range: getCustomDateRange(
      filterData.range.value,
      customDateRange,
      filterData.customDateRange
    ),
    campaignId: campaignId,
    adGroupId: adGroupId,
    rangeType: filterData.range.value,
    isDownload: isDownload,
    downloadWithFilter: downloadWithFilter,
  };

  return filters;
};

export const getWalmartAdvertisingFilters = (
  filterData: IAdvertisingFilterForm,
  customDateRange: IDateRange,
  isDownload = false,
  campaignId = '',
  adGroupId = '',
  isAllDownload = false
): IAdvertisingFilter => {
  const filters: IAdvertisingFilter = {
    frequency: filterData.frequency.value,
    range: getCustomDateRange(
      filterData.range.value,
      customDateRange,
      filterData.customDateRange
    ),
    campaignId: campaignId,
    adGroupId: adGroupId,
    rangeType: filterData.range.value,
    isDownload: isDownload,
    downloadWithFilter: !isAllDownload,
  };

  return filters;
};

export const checkAsinIdentifier = (asin: string) => {
  return asin?.toUpperCase().includes('B0');
};

export const getAsinString = (asin: string) => {
  const strArray = asin?.split('"');
  if (strArray.length < 1) return '';
  else if (strArray.length === 1) return strArray[0];
  return strArray[1];
};

export const checkIsAsin = (asin: string) => {
  return ASIN_REGEX.test(asin?.toUpperCase());
};

export const getFormattedTargetingItemValue = (value: string) => {
  return value
    ?.split('"')
    .map((item) => {
      if (checkIsAsin(item)) return item.toUpperCase();
      return item;
    })
    .join('"');
};

export const applyFiltersForRows = (
  data: Record<string, unknown>[],
  appliedFilters: IFinalFilters[],
  searchText: string,
  title: string
) => {
  if (appliedFilters.length === 0) return data;
  if (searchText.length === 0) return data;
  const searchedData = searchUtils.getSearchTableData(
    data as any[],
    searchText,
    title
  );

  return searchedData;
};

export const campaignSPBudgetSortComparator = (
  v1: any,
  v2: any,
  param1: any,
  param2: any
) => {
  const budget1 = param1.value.budget;
  const budget2 = param2.value.budget;

  return budget1 - budget2;
};

export const getAdTypeOptionsByMarketplace = () => {
  const selectedAccount = localStorageUtils.getSelectedAdvertisingAccount();

  const adTypeOptions = selectedAccount?.advertising?.amazonProfileId
    ? advertisingOptionAdTypeAmazon
    : advertisingOptionAdTypeWalmart;

  return adTypeOptions;
};

export const getSelectedAdTypeByMarketplace = (
  adType: string,
  marketplace: string
) => {
  let selectedAdType: IDropdownItem<string>;
  if (marketplace === MarketplaceEnum.WALMART) {
    switch (adType) {
      case AdType.All:
      case AdTypeShort.All.toLowerCase():
      case AdTypeShort.OVERALL.toLowerCase():
        selectedAdType = advertisingOptionAdTypeWalmart[0];
        break;
      case AdType.SPONSORED_PRODUCTS:
      case AdTypeShort.SPONSORED_PRODUCTS.toLowerCase():
        selectedAdType = advertisingOptionAdTypeWalmart[1];
        break;
      case AdType.SPONSORED_BRANDS:
      case AdTypeShort.SPONSORED_BRANDS.toLowerCase():
        selectedAdType = advertisingOptionAdTypeWalmart[2];
        break;
      case AdType.SPONSORED_VIDEO:
      case AdTypeShort.SPONSORED_VIDEO.toLowerCase():
        selectedAdType = advertisingOptionAdTypeWalmart[3];
        break;
      default:
        selectedAdType = noneAdTypeOption;
    }
  } else {
    switch (adType) {
      case AdType.All:
      case AdTypeShort.All.toLowerCase():
        selectedAdType = advertisingOptionAdTypeAmazon[0];
        break;
      case AdType.SPONSORED_PRODUCTS:
      case AdTypeShort.SPONSORED_PRODUCTS.toLowerCase():
        selectedAdType = advertisingOptionAdTypeAmazon[1];
        break;
      case AdType.SPONSORED_BRANDS:
      case AdTypeShort.SPONSORED_BRANDS.toLowerCase():
        selectedAdType = advertisingOptionAdTypeAmazon[2];
        break;
      case AdType.SPONSORED_DISPLAY:
      case AdTypeShort.SPONSORED_DISPLAY.toLowerCase():
        selectedAdType = advertisingOptionAdTypeAmazon[3];
        break;
      default:
        selectedAdType = noneAdTypeOption;
    }
  }
  return selectedAdType;
};

export const getSelectedAdvertisingAccount = (): IDropdownItem<string> => {
  const advertisingAccountOptions = getAdvertisingAccountOptions();

  if (!advertisingAccountOptions || advertisingAccountOptions.length === 0) {
    return EMPTY_ACCOUNT;
  }

  const selectedAdvertisingAccount =
    localStorageUtils.getSelectedAdvertisingAccount();
  if (!selectedAdvertisingAccount) {
    return advertisingAccountOptions[0];
  }

  const matchingOption = advertisingAccountOptions.find(
    (option) =>
      option.value ===
        selectedAdvertisingAccount?.advertising?.walmartAdvertiserId ||
      option.value === selectedAdvertisingAccount?.advertising?.amazonProfileId
  );

  return matchingOption || advertisingAccountOptions[0];
};
export const getSelectedDSPAccount = (): IDropdownItem<string> => {
  const dspAccountOptions = accountUtils.getDspAccountOptions();

  if (!dspAccountOptions || dspAccountOptions.length === 0) {
    return EMPTY_ACCOUNT;
  }

  const selectedDSPAccount = localStorageUtils.getSelectedDSPAccount();
  if (!selectedDSPAccount) {
    return dspAccountOptions[0];
  }

  const matchingOption = dspAccountOptions.find(
    (option) => option.value === selectedDSPAccount.advertiserId
  );

  return matchingOption || dspAccountOptions[0];
};
export const getSelectedCatalogAccount = (): IDropdownItem<string> => {
  const catalogAccountOptions = accountUtils.getCatalogAccountOptions();
  const selectedAdsAccount = localStorageUtils.getSelectedAdvertisingAccount();

  if (!catalogAccountOptions || catalogAccountOptions.length === 0) {
    return EMPTY_ACCOUNT;
  }

  const selectedCatalogAccount = localStorageUtils.getSelectedCatalogAccount();
  if (!selectedCatalogAccount) {
    return (
      catalogAccountOptions.find(
        (acct) => acct.marketplace === selectedAdsAccount?.marketplace
      ) ?? EMPTY_ACCOUNT
    );
  }

  return (
    catalogAccountOptions.find(
      (option) =>
        option.value === genCatalogAccountOptionValue(selectedCatalogAccount)
    ) || catalogAccountOptions[0]
  );
};

export const convertToTitleCase = (str: string | undefined | null) => {
  if (checkIsNull(str)) return '';
  return str?.replace(/\w\S*/g, (txt) => {
    return txt?.charAt(0).toUpperCase() + txt?.substr(1).toLowerCase();
  });
};

export const convertToUpperCase = (str: string | undefined | null) => {
  if (checkIsNull(str)) return '';
  return str.toUpperCase();
};

export const getWalmartAdType = (adType: string) => {
  if (!adType) return '-';

  switch (adType) {
    case WalmartAdTypeEnum.SPONSORED_PRODUCTS:
      return 'Sponsored Products';
    case WalmartAdTypeEnum.SPONSORED_BRANDS:
      return 'Sponsored Brands';
    case WalmartAdTypeEnum.SPONSORED_VIDEO:
      return 'Sponsored Video';
    default:
      return '-';
  }
};

export const getAdvertisingPayload = (
  filters: IFinalFilters[],
  payload: IAdvertisingFilter,
  sortCriteria: Array<ISortCriteria>,
  searchText: string,
  searchColumns: Array<string>
) => {
  const finalPayload = {
    payload: {
      range: payload.rangeType,
      startDate: payload.range?.startDate,
      endDate: payload.range?.endDate,
      adGroupId: payload.adGroupId,
      campaignId: payload.campaignId,
      isDownload: payload.isDownload,
      downloadWithFilter: payload.downloadWithFilter,
      targetingType: payload.targetingType,
    } as IAdvertisingFilter,
  };

  return {
    ...finalPayload,
    filters: filters,
    sortCriteria,
    searchText,
    searchColumns: searchColumns,
  };
};

export const generateExportFileName = (tabValue: string) => {
  return `${tabValue.toLowerCase()}_${getCurrentDateTime()}.csv`;
};

export const getAccountType = (accountType: string) => {
  if (!accountType) return '-';
  else if (accountType === AmazonAccountType.VENDOR)
    return WalmartAccountTypeEnum.FIRST_PARTY;
  else if (accountType === AmazonAccountType.SELLER)
    return WalmartAccountTypeEnum.THIRD_PARTY;
  else return accountType;
};

export const getWalmartStatus = (status: CampaignStateEnum) => {
  switch (status) {
    case CampaignStateEnum.ENABLED:
      return 'enabled';
    case CampaignStateEnum.PAUSED:
      return 'disabled';
    case CampaignStateEnum.ARCHIVED:
      return 'deleted';
    default:
      return status.toLowerCase();
  }
};

export const getValidWalmartStatus = (status: string) => {
  const _status =
    status?.toLowerCase() === WalmartCampaignStatusEnum.LIVE.toLowerCase() ||
    status?.toLowerCase() ===
      WalmartCampaignStatusEnum.SCHEDULED.toLowerCase() ||
    status?.toLowerCase() ===
      WalmartCampaignStatusEnum.RESCHEDULED.toLowerCase() ||
    status?.toLowerCase() === WalmartCampaignStatusEnum.ENABLED.toLowerCase()
      ? WalmartCampaignStatusEnum.ENABLED
      : status;

  const walmartStatusOptions = statusOptions.filter(
    (option) =>
      (option.value === WalmartCampaignStatusEnum.ENABLED ||
        option.value === WalmartCampaignStatusEnum.PAUSED) &&
      option.marketplace === MarketplaceEnum.WALMART
  );

  if (walmartStatusOptions.some((option) => option.value === _status)) {
    return _status;
  } else {
    return null;
  }
};

// TODO: remove this logic
export const getActiveWalmartStatus = (status: WalmartCampaignStatusEnum) => {
  switch (status.toLowerCase()) {
    case WalmartCampaignStatusEnum.ENABLED.toLowerCase():
      return WalmartCampaignStatusEnum.LIVE;
    case WalmartCampaignStatusEnum.PAUSED.toLowerCase():
      return WalmartCampaignStatusEnum.PAUSED;
    case WalmartCampaignStatusEnum.LIVE.toLowerCase():
      return WalmartCampaignStatusEnum.LIVE;
    case WalmartCampaignStatusEnum.COMPLETED.toLowerCase():
      return WalmartCampaignStatusEnum.ENDED;
    case WalmartCampaignStatusEnum.ENDED.toLowerCase():
      return WalmartCampaignStatusEnum.ENDED;
    case WalmartCampaignStatusEnum.SCHEDULED.toLowerCase():
      return WalmartCampaignStatusEnum.LIVE;
    case WalmartCampaignStatusEnum.PROPOSAL.toLowerCase():
      return WalmartCampaignStatusEnum.PAUSED;
    case WalmartCampaignStatusEnum.RESCHEDULED.toLowerCase():
      return WalmartCampaignStatusEnum.LIVE;
    default:
      return WalmartCampaignStatusEnum.PAUSED;
  }
};

export const getWalmartAdGroupStatus = (status: WalmartAdGroupStatusEnum) => {
  const lowerCaseStatus = status?.toLowerCase();
  switch (lowerCaseStatus) {
    case WalmartAdGroupStatusEnum.ENABLED:
      return WalmartAdGroupStatusEnum.ENABLED;
    case WalmartAdGroupStatusEnum.DISABLED:
      return WalmartAdGroupStatusEnum.PAUSED;
    case WalmartAdGroupStatusEnum.PAUSED:
      return WalmartAdGroupStatusEnum.DISABLED;
    default:
      return WalmartAdGroupStatusEnum.PAUSED;
  }
};

export const getCampaignPageTypeData = (
  campaignId: string,
  targetingType: string,
  pageTypes: ICampaignPageType[] | null | undefined
): ICampaignPageType[] => {
  let updatedPageTypes: ICampaignPageType[] = [];

  if (targetingType === TargetingTypeEnum.AUTO) {
    updatedPageTypes = [
      {
        campaignId: campaignId,
        pageType: PageTypeActualEnum.SEARCH,
        pageTypeMultiplier: 0,
      },
      {
        campaignId: campaignId,
        pageType: PageTypeActualEnum.ITEM,
        pageTypeMultiplier: 0,
      },
      {
        campaignId: campaignId,
        pageType: PageTypeActualEnum.HOMEPAGE,
        pageTypeMultiplier: 0,
      },
      {
        campaignId: campaignId,
        pageType: PageTypeActualEnum.STOCK_UP,
        pageTypeMultiplier: 0,
      },
    ];
  }

  if (targetingType === TargetingTypeEnum.MANUAL) {
    updatedPageTypes = [
      {
        campaignId: campaignId,
        pageType: PageTypeActualEnum.SEARCH,
        pageTypeMultiplier: 0,
      },
      {
        campaignId: campaignId,
        pageType: PageTypeActualEnum.ITEM,
        pageTypeMultiplier: 0,
      },
    ];
  }

  if (pageTypes && pageTypes.length > 0) {
    updatedPageTypes = updatedPageTypes.map((pageType) => {
      const targetPageType = pageTypes.find(
        (type) => type.pageType === pageType.pageType
      );
      if (targetPageType) {
        return {
          ...pageType,
          pageTypeMultiplier: targetPageType.pageTypeMultiplier,
        };
      }

      return pageType;
    });
  }

  return updatedPageTypes;
};

export const getCampaignPlatformData = (
  campaignId: string,
  platforms: ICampaignPlatform[]
): ICampaignPlatform[] => {
  let updatedPlatforms: ICampaignPlatform[] = [
    {
      campaignId,
      platform: 'Desktop',
      platformMultiplier: 0,
    },
    {
      campaignId,
      platform: 'App',
      platformMultiplier: 0,
    },
    {
      campaignId,
      platform: 'Mobile',
      platformMultiplier: 0,
    },
  ];

  if (platforms && platforms.length > 0) {
    updatedPlatforms = updatedPlatforms.map((platform) => {
      const targetPlatform = platforms.find(
        (type) => type.platform === platform.platform
      );
      if (targetPlatform) {
        return {
          ...platform,
          platformMultiplier: targetPlatform.platformMultiplier,
        };
      }

      return platform;
    });
  }

  return updatedPlatforms;
};

export const getProductAdsMapWalmart = (productAds: IWalmartAdItem[]) => {
  const productAdsMap = new Map<string, IWalmartAdItem>();
  productAds.forEach((productAd) => {
    productAdsMap.set(productAd.itemId, productAd);
  });

  return productAdsMap;
};

export const getProductAdsMapAmazon = (
  productAds: IProductAds[] | ISDProductAds[]
) => {
  const productAdsMap = new Map<string, IProductAds | ISDProductAds>();
  productAds.forEach((productAd) => {
    productAdsMap.set(productAd.asin as string, productAd);
  });

  return productAdsMap;
};

export const getKeywordsMap = (keywords: Array<IKeywordTargetTypes>) => {
  const keywordsMap = new Map<string, any>();
  keywords.forEach((keyword) => {
    keywordsMap.set(
      `${keyword.keywordText?.toLowerCase()}-${
        keyword.matchType?.toLowerCase() ?? ''
      }`,
      keyword
    );
  });

  return keywordsMap;
};

export const getProductTargetsMap = (
  productTargets: Array<IProductTargetTypes>
) => {
  const productTargetsMap = new Map<string, any>();
  productTargets.forEach((target) => {
    if (target.expression && target.expression.length === 1) {
      productTargetsMap.set(
        `${target.expression[0].value?.toLowerCase()}-${
          target.expression[0].type?.toLowerCase() ?? ''
        }`,
        target
      );
    }
  });

  return productTargetsMap;
};

export const checkItemIsPresentInProductAdsMapAmazon = (
  asin: string,
  amazonProductAds: IProductAds[] | ISDProductAds[] | undefined
) => {
  if (!amazonProductAds) return false;
  return getProductAdsMapAmazon(amazonProductAds).has(asin);
};
export const checkItemIsPresentInProductAdsMapWalmart = (
  itemId: string,
  productAds: IWalmartAdItem[] | undefined
) => {
  if (!productAds) return false;
  return getProductAdsMapWalmart(productAds).has(itemId);
};

export const checkIsDuplicateKeywordPresent = (
  newKeywordList: Array<ICreateKeyword>,
  initialKeywordList: Array<IChipBasedEntityTypes> | undefined,
  entityType: IEntityTypes
): {
  existingKeywords: {
    entityName: string;
    matchType: string | undefined;
  }[];
  uniqueKeywords: ICreateKeyword[];
} => {
  if (
    !initialKeywordList ||
    !initialKeywordList.length ||
    !newKeywordList.length
  )
    return { existingKeywords: [], uniqueKeywords: newKeywordList };

  const existingKeywordList: Array<{
    entityName: string;
    matchType: string | undefined;
  }> = [];
  const uniqueKeywordList: Array<ICreateKeyword> = [];
  let entityListMap: Map<string, any> | null = null;

  switch (entityType) {
    case AmazonAdvertisingTableTypesEnum.KEYWORD_TARGETING:
    case AmazonAdvertisingTableTypesEnum.NEGATIVE_TARGETING_KEYWORD:
    case WalmartAdvertisingTableTypeEnum.KEYWORD:
      entityListMap = getKeywordsMap(
        initialKeywordList as IKeywordTargetTypes[]
      );
      break;

    case AmazonAdvertisingTableTypesEnum.PRODUCT_TARGETING:
    case AmazonAdvertisingTableTypesEnum.NEGATIVE_TARGETING_PRODUCT:
      entityListMap = getProductTargetsMap(
        initialKeywordList as IProductTargetTypes[]
      );
      break;

    default:
      entityListMap = null;
      break;
  }

  if (entityListMap && entityListMap instanceof Map) {
    newKeywordList.forEach((keyword) => {
      const keywordMatchTypeText = `${keyword.entityName?.toLowerCase()}-${
        keyword.matchType?.value.toLowerCase() ?? ''
      }`;

      if (entityListMap?.has(keywordMatchTypeText)) {
        existingKeywordList.push({
          entityName: keyword.entityName,
          matchType: keyword.matchType?.value,
        });
      } else {
        uniqueKeywordList.push(keyword);
      }
    });
  } else {
    return { existingKeywords: [], uniqueKeywords: newKeywordList };
  }

  return {
    existingKeywords: existingKeywordList,
    uniqueKeywords: uniqueKeywordList,
  };
};

export const checkDataDifferenceInCampaignData = (
  initialCampaign: IEditAccessWalmartCampaign | IEditAccessCampaign,
  updatedCampaign: IEditAccessWalmartCampaign | IEditAccessCampaign
) => {
  const diff = getDiff(
    initialCampaign as unknown as Record<string, unknown>,
    updatedCampaign as unknown as Record<string, unknown>
  );
  return !isEmptyObject(diff);
};

export const checkDataDifferenceInPageTypeData = (
  initialPageTypeData: ICampaignPageType[],
  updatedPageTypeData: ICampaignPageType[]
) => {
  if (initialPageTypeData.length === 0 && updatedPageTypeData.length === 0)
    return false;
  const diff = getTableUpdateDetails(
    initialPageTypeData as unknown as Record<string, unknown>[],
    updatedPageTypeData as unknown as Record<string, unknown>[]
  );
  return diff.size > 0;
};

export const checkDataDifferenceInPlatformData = (
  initialPlatformData: ICampaignPlatform[],
  updatedPlatformData: ICampaignPlatform[]
) => {
  if (initialPlatformData.length === 0 && updatedPlatformData.length === 0)
    return false;
  const diff = getTableUpdateDetails(
    initialPlatformData as unknown as Record<string, unknown>[],
    updatedPlatformData as unknown as Record<string, unknown>[]
  );
  return diff.size > 0;
};

export const checkDataDifferenceInAdGroupData = <T>(
  initialData: T,
  updatedData: T
) => {
  const diff = getDiff(
    initialData as unknown as Record<string, unknown>,
    updatedData as unknown as Record<string, unknown>
  );
  return !isEmptyObject(diff);
};

export const getFormattedMetrics = (
  metric: string | undefined,
  value: number
) => {
  if (!metric) return value;
  let formattedValue: string | number = '';

  if (percentageMetrics.includes(metric)) {
    formattedValue = displayValue(formatNum(value));
  } else if (currencyMetrics.includes(metric)) {
    formattedValue = displayValue(formatNum(value), false);
  } else if (numberMetrics.includes(metric)) {
    formattedValue = formatNum(value, false);
  } else {
    formattedValue = formatNum(value);
  }

  return formattedValue;
};

export const hasDynamicBiddingProp = (
  obj: any
): obj is { dynamicBidding: any } => {
  return 'dynamicBidding' in obj;
};
export const hasAmazonSPBudgetProp = (obj: any): obj is ICampaign => {
  return (
    obj &&
    typeof obj === 'object' &&
    'budget' in obj &&
    obj.budget !== null &&
    typeof obj.budget === 'object' &&
    'budget' in obj.budget
  );
};
export const hasBudgetProp = (obj: any): obj is ISBCampaign | ISDCampaign => {
  return (
    obj &&
    'budget' in obj &&
    (typeof obj.budget === 'number' || typeof obj.budget === 'string')
  );
};
export const hasTotalProp = (obj: any): obj is IWalmartCampaign => {
  return obj && 'totalBudget' in obj;
};
export const hasDailyBudgetProp = (obj: any): obj is IWalmartCampaign => {
  return obj && 'dailyBudget' in obj;
};
export const hasBudgetTypeProp = (obj: any): obj is IWalmartCampaign => {
  return obj && 'budgetType' in obj;
};
export const hasPageTypeProp = (obj: any): obj is { pageTypes: any } => {
  return 'pageTypes' in obj;
};
export const hasPlatformProp = (obj: any): obj is { platforms: any } => {
  return 'platforms' in obj;
};

export const hasDefaultBidProp = (obj: any): obj is IAdGroup => {
  return 'defaultBid' in obj;
};

export const hasCostTypeProp = (
  obj: any
): obj is
  | ISBCampaign
  | ISBAdGroup
  | ISBKeywordTargeting
  | ISBProductTargeting => {
  return 'costType' in obj;
};

export const hasCreativeTypeProp = (
  obj: any
): obj is
  | ISBCampaign
  | ISBAdGroup
  | ISBProductAds
  | ISBKeywordTargeting
  | ISBProductTargeting => {
  return 'creativeType' in obj;
};

export const hasReviewIdProp = (
  obj: any
): obj is
  | IWalmartCampaign
  | IWalmartAdGroup
  | IWalmartAdItem
  | IWalmartKeywords
  | IWalmartSVCampaign
  | IWalmartSVAdGroup
  | IWalmartSVKeywords
  | IWalmartOverallCampaign
  | IWalmartOverallAdGroup
  | IWalmartOverallKeywords => {
  return 'reviewId' in obj;
};
export const hasReviewProcessStatusProp = (
  obj: any
): obj is
  | IWalmartCampaign
  | IWalmartAdGroup
  | IWalmartAdItem
  | IWalmartKeywords
  | IWalmartSVCampaign
  | IWalmartSVAdGroup
  | IWalmartSVKeywords
  | IWalmartOverallCampaign
  | IWalmartOverallAdGroup
  | IWalmartOverallKeywords => {
  return 'reviewProcessStatus' in obj;
};
export const hasReviewDecisionStatusProp = (
  obj: any
): obj is
  | IWalmartCampaign
  | IWalmartAdGroup
  | IWalmartAdItem
  | IWalmartKeywords
  | IWalmartSVCampaign
  | IWalmartSVAdGroup
  | IWalmartSVKeywords
  | IWalmartOverallCampaign
  | IWalmartOverallAdGroup
  | IWalmartOverallKeywords => {
  return 'reviewDecisionStatus' in obj;
};

export const checkIsEditDisableByReviewStatus = (
  entity: IAdvertisingInterfaces,
  isCampaignStatusField = false
): boolean => {
  if (hasReviewProcessStatusProp(entity)) {
    const { reviewProcessStatus } = entity as
      | IWalmartCampaign
      | IWalmartAdGroup
      | IWalmartAdItem
      | IWalmartKeywords
      | IWalmartSVCampaign
      | IWalmartSVAdGroup
      | IWalmartSVKeywords
      | IWalmartOverallCampaign
      | IWalmartOverallAdGroup
      | IWalmartOverallKeywords;

    if (isCampaignStatusField && hasReviewDecisionStatusProp(entity)) {
      const { reviewDecisionStatus } = entity as
        | IWalmartCampaign
        | IWalmartAdGroup
        | IWalmartAdItem
        | IWalmartKeywords
        | IWalmartSVCampaign
        | IWalmartSVAdGroup
        | IWalmartSVKeywords
        | IWalmartOverallCampaign
        | IWalmartOverallAdGroup
        | IWalmartOverallKeywords;

      if (reviewProcessStatus !== null && reviewProcessStatus !== undefined) {
        return (
          reviewProcessStatus === WalmartReviewProcessStatusEnum.PENDING ||
          reviewProcessStatus === WalmartReviewProcessStatusEnum.IN_PROGRESS ||
          reviewProcessStatus === WalmartReviewProcessStatusEnum.CANCELLED ||
          (reviewDecisionStatus !== null &&
            reviewDecisionStatus !== undefined &&
            reviewDecisionStatus === WalmartReviewDecisionStatusEnum.REJECTED)
        );
      }
    }

    if (reviewProcessStatus !== null && reviewProcessStatus !== undefined) {
      return (
        reviewProcessStatus === WalmartReviewProcessStatusEnum.PENDING ||
        reviewProcessStatus === WalmartReviewProcessStatusEnum.IN_PROGRESS
      );
    } else return false;
  }

  return false;
};

export const hasCampaignOptionsProp = (obj: any): obj is IWalmartCampaign => {
  return obj && 'campaignOptions' in obj;
};

export const getMappedPageType = (pageType: string) => {
  if (!pageType) return pageType;
  return WALMART_PAGE_TYPE_TO_ACTUAL_MAPPINGS[pageType] ?? pageType;
};

export const getMappedPageTypeSearchText = (searchText: string) => {
  if (!searchText) return searchText;
  const keys = Object.keys(WALMART_PAGE_TYPE_TO_TABLE_MAPPINGS);
  const matchingKeys = keys.filter((key) =>
    key.toLowerCase().includes(searchText.toLowerCase())
  );
  let mappedSearchText = '';
  if (matchingKeys.length === 1)
    mappedSearchText =
      WALMART_PAGE_TYPE_TO_TABLE_MAPPINGS[matchingKeys[0] || searchText] ??
      searchText;
  else {
    mappedSearchText = matchingKeys
      .map((key) => {
        return WALMART_PAGE_TYPE_TO_TABLE_MAPPINGS[key] ?? key;
      })
      .join(',');
  }
  return mappedSearchText;
};

export const getMappedWalmartAdType = (adType: string) => {
  if (!adType) return adType;
  return WALMART_AD_TYPE_MAPPINGS[adType] ?? adType;
};

export const getMappedCatalogPrimary = (primary: string) => {
  if (!primary) return primary;
  return CATALOG_PRIMARY_MAPPINGS[primary] ?? primary;
};

export const getMappedAdsEligibility = (value: string) => {
  if (!value) return value;
  return ADS_ELIGIBILITY_MAPPING[value] ?? value;
};

export const getMappedBiddingStrategy = (value: string) => {
  return BIDDING_STRATEGY_MAPPING[value] ?? value;
};

export const getMappedAmazonFulfillmentType = (value: string) => {
  return AMAZON_CATALOG_FULFILLMENT_MAPPING[value] ?? value;
};
export const getMappedAmazonTableFulfillmentType = (value: string) => {
  return AMAZON_CATALOG_TABLE_FULFILLMENT_MAPPING[value] ?? value;
};
export const getMappedAmazonTableItemCondition = (value: string) => {
  return ITEM_CONDITION_MAPPING[value] ?? value;
};
export const getMappedAmazonItemCondition = (value: string) => {
  return ITEM_CONDITION_REVERSE_MAPPING[value] ?? value;
};

export const isPageTypeMultiplierEditable = (
  pageType: string,
  targetingType: string
): boolean => {
  if (!pageType || !targetingType) return false;

  if (targetingType === TargetingTypeEnum.MANUAL) {
    if (
      pageType === PageTypeTableEnum.ITEM ||
      pageType === PageTypeTableEnum.SEARCH ||
      pageType === PageTypeActualEnum.ITEM ||
      pageType === PageTypeActualEnum.SEARCH
    )
      return true;
  } else if (targetingType === TargetingTypeEnum.AUTO) {
    if (
      pageType === PageTypeTableEnum.ITEM ||
      pageType === PageTypeTableEnum.SEARCH ||
      pageType === PageTypeTableEnum.HOMEPAGE ||
      pageType === PageTypeTableEnum.STOCK_UP ||
      pageType === PageTypeActualEnum.ITEM ||
      pageType === PageTypeActualEnum.SEARCH ||
      pageType === PageTypeActualEnum.HOMEPAGE ||
      pageType === PageTypeActualEnum.STOCK_UP
    )
      return true;
  } else {
    return false;
  }
  return false;
};

export const getWalmartAppliedFilters = (
  appliedFilters: IFinalFilters[],
  isDownload: boolean,
  isAllDownload: boolean
): IFinalFilters[] => {
  let _appliedFilters = appliedFilters;

  if (isDownload) {
    if (isAllDownload) _appliedFilters = [];
    else _appliedFilters = appliedFilters;
  }

  return _appliedFilters;
};

export const isDecimal = (value: number): boolean => {
  return value % 1 !== 0;
};

export const processKeywords = (keywords: string): [string[], string[]] => {
  if (!keywords?.trim()) {
    return [[], []];
  }

  const allKeywords = splitStringByDelimiters(keywords, false);

  const validKeywords = new Set<string>();
  const invalidKeywords = new Set<string>();

  const validKeywordRegex = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9+&][\w\s\-+&]*$/;

  allKeywords.forEach((word) => {
    if (validKeywordRegex.test(word)) {
      validKeywords.add(word);
    } else {
      invalidKeywords.add(word);
    }
  });

  return [Array.from(validKeywords), Array.from(invalidKeywords)];
};

export const uniqueKeywords = (
  newKeywords: string[],
  existingKeywords: string[]
): string[] => {
  if (newKeywords.length === 0) {
    return [];
  }
  return newKeywords.filter(
    (newKeyword) => !existingKeywords.includes(newKeyword)
  );
};

export const getAdvertisingRangeOptionsByMarketplace = () => {
  const marketplace = localStorageUtils.getAdvertisingMarketplace();
  let rangeOptions: IDropdownItem<string>[];

  if (marketplace === MarketplaceEnum.WALMART) {
    rangeOptions = range.map((value) => {
      if (value.value === Range.TODAY || value.value === Range.YESTERDAY) {
        return {
          ...value,
          isDisabled: true,
        };
      }
      return value;
    });
  } else if (marketplace === MarketplaceEnum.AMAZON) {
    rangeOptions = range;
  } else {
    rangeOptions = [];
  }

  return rangeOptions;
};

export const getAmazonSearchColumnsByTableType = (
  adType: AdTypeShort,
  tableType: AmazonAdvertisingTableTypesEnum
) => {
  let searchColumns: Array<string> = [];

  if (adType === AdTypeShort.SPONSORED_PRODUCTS) {
    switch (tableType) {
      case AmazonAdvertisingTableTypesEnum.CAMPAIGN:
        searchColumns = [
          AmazonSearchColumnsEnum.CAMPAIGN_ID,
          AmazonSearchColumnsEnum.CAMPAIGN_NAME,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.AD_GROUP:
        searchColumns = [
          AmazonSearchColumnsEnum.ADGROUP_ID,
          AmazonSearchColumnsEnum.ADGROUP_NAME,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.KEYWORD_TARGETING:
        searchColumns = [
          AmazonSearchColumnsEnum.KT_ID,
          AmazonSearchColumnsEnum.KT_NAME,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.PRODUCT_TARGETING:
        searchColumns = [
          AmazonSearchColumnsEnum.PT_ID,
          AmazonSearchColumnsEnum.PT_NAME,
          AmazonSearchColumnsEnum.EXPRESSION,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.AUTO_TARGETING:
        searchColumns = [
          AmazonSearchColumnsEnum.PT_ID,
          AmazonSearchColumnsEnum.PT_NAME,
          AmazonSearchColumnsEnum.EXPRESSION,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.PRODUCT_ADS:
        searchColumns = [
          AmazonSearchColumnsEnum.PRODUCT_ID,
          AmazonSearchColumnsEnum.ITEM_NAME,
          AmazonSearchColumnsEnum.ASIN,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.SEARCH_TERM:
        searchColumns = [
          AmazonSearchColumnsEnum.SP_SEARCH_KEYWORD,
          AmazonSearchColumnsEnum.SEARCH_TERM,
          AmazonSearchColumnsEnum.PT_NAME,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.NEGATIVE_TARGETING_KEYWORD:
        searchColumns = [
          AmazonSearchColumnsEnum.KT_ID,
          AmazonSearchColumnsEnum.KT_NAME,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.NEGATIVE_TARGETING_PRODUCT:
        searchColumns = [
          AmazonSearchColumnsEnum.PT_ID,
          AmazonSearchColumnsEnum.PT_NAME,
          AmazonSearchColumnsEnum.ASIN,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.PRODUCT:
        searchColumns = [
          AmazonSearchColumnsEnum.ANALYSIS_PRODUCT_ID,
          AmazonSearchColumnsEnum.ANALYSIS_PRODUCT_NAME,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.KEYWORD:
        searchColumns = [
          AmazonSearchColumnsEnum.KT_ID,
          AmazonSearchColumnsEnum.ANALYSIS_KEYWORD_NAME,
        ];
        break;

      default:
        searchColumns = [];
    }
  } else if (adType === AdTypeShort.SPONSORED_BRANDS) {
    switch (tableType) {
      case AmazonAdvertisingTableTypesEnum.CAMPAIGN:
        searchColumns = [
          AmazonSearchColumnsEnum.CAMPAIGN_ID,
          AmazonSearchColumnsEnum.CAMPAIGN_NAME,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.AD_GROUP:
        searchColumns = [
          AmazonSearchColumnsEnum.ADGROUP_ID,
          AmazonSearchColumnsEnum.ADGROUP_NAME,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.KEYWORD_TARGETING:
        searchColumns = [
          AmazonSearchColumnsEnum.KT_ID,
          AmazonSearchColumnsEnum.KT_NAME,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.PRODUCT_TARGETING:
        searchColumns = [
          AmazonSearchColumnsEnum.PT_ID,
          AmazonSearchColumnsEnum.PT_NAME,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.PRODUCT_ADS:
        searchColumns = [
          AmazonSearchColumnsEnum.PRODUCT_ID,
          AmazonSearchColumnsEnum.SB_PRODUCT_NAME,
          AmazonSearchColumnsEnum.SB_PRODUCT_ASINS,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.SEARCH_TERM:
        searchColumns = [
          AmazonSearchColumnsEnum.SEARCH_TERM,
          AmazonSearchColumnsEnum.SEARCH_TERM_KEYWORD,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.NEGATIVE_TARGETING_KEYWORD:
        searchColumns = [
          AmazonSearchColumnsEnum.KT_ID,
          AmazonSearchColumnsEnum.KT_NAME,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.NEGATIVE_TARGETING_PRODUCT:
        searchColumns = [
          AmazonSearchColumnsEnum.PT_ID,
          AmazonSearchColumnsEnum.PT_NAME,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.CREATIVE_PRODUCT:
        searchColumns = [
          AmazonSearchColumnsEnum.CREATIVE_ID,
          AmazonSearchColumnsEnum.CREATIVE_NAME,
          AmazonSearchColumnsEnum.CREATIVE_ASINS,
        ];
        break;
      case AmazonAdvertisingTableTypesEnum.PRODUCT:
        searchColumns = [
          AmazonSearchColumnsEnum.ANALYSIS_PRODUCT_ID,
          AmazonSearchColumnsEnum.ANALYSIS_PRODUCT_NAME,
        ];
        break;

      default:
        searchColumns = [];
    }
  } else if (adType === AdTypeShort.SPONSORED_DISPLAY) {
    switch (tableType) {
      case AmazonAdvertisingTableTypesEnum.CAMPAIGN:
        searchColumns = [
          AmazonSearchColumnsEnum.CAMPAIGN_ID,
          AmazonSearchColumnsEnum.CAMPAIGN_NAME,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.AD_GROUP:
        searchColumns = [
          AmazonSearchColumnsEnum.ADGROUP_ID,
          AmazonSearchColumnsEnum.ADGROUP_NAME,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.PRODUCT_ADS:
        searchColumns = [
          AmazonSearchColumnsEnum.PRODUCT_ID,
          AmazonSearchColumnsEnum.SD_PRODUCT_NAME,
          AmazonSearchColumnsEnum.SD_PRODUCT_ASIN,
          AmazonSearchColumnsEnum.ITEM_NAME,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.CREATIVE:
        searchColumns = [];
        break;
      case AmazonAdvertisingTableTypesEnum.PRODUCT:
        searchColumns = [
          AmazonSearchColumnsEnum.ANALYSIS_PRODUCT_ID,
          AmazonSearchColumnsEnum.ANALYSIS_PRODUCT_NAME,
        ];
        break;
      default:
        searchColumns = [];
    }
  } else if (adType === AdTypeShort.All) {
    switch (tableType) {
      case AmazonAdvertisingTableTypesEnum.CAMPAIGN:
        searchColumns = [
          AmazonSearchColumnsEnum.CAMPAIGN_ID,
          AmazonSearchColumnsEnum.CAMPAIGN_NAME,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.AD_GROUP:
        searchColumns = [
          AmazonSearchColumnsEnum.ADGROUP_ID,
          AmazonSearchColumnsEnum.ADGROUP_NAME,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.PRODUCT_ADS:
        searchColumns = [
          AmazonSearchColumnsEnum.PRODUCT_ID,
          AmazonSearchColumnsEnum.ITEM_NAME,
          AmazonSearchColumnsEnum.ASIN,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.KEYWORD_TARGETS:
        searchColumns = [
          AmazonSearchColumnsEnum.KT_ID,
          AmazonSearchColumnsEnum.KT_NAME,
        ];
        break;

      case AmazonAdvertisingTableTypesEnum.PRODUCT_TARGETS:
        searchColumns = [
          AmazonSearchColumnsEnum.PT_ID,
          AmazonSearchColumnsEnum.PT_NAME,
        ];
        break;
      case AmazonAdvertisingTableTypesEnum.PRODUCT:
        searchColumns = [
          AmazonSearchColumnsEnum.ANALYSIS_PRODUCT_ID,
          AmazonSearchColumnsEnum.ANALYSIS_PRODUCT_NAME,
        ];
        break;
      default:
        searchColumns = [];
    }
  } else {
    searchColumns = [];
  }

  return searchColumns;
};

export const getWalmartSearchColumnsByTableType = (
  adType: AdTypeShort,
  tableType: WalmartAdvertisingTableTypeEnum
) => {
  let searchColumns: Array<string> = [];

  switch (tableType) {
    case WalmartAdvertisingTableTypeEnum.CAMPAIGN:
      searchColumns = [
        WalmartSearchColumnsEnum.CAMPAIGN_ID,
        WalmartSearchColumnsEnum.CAMPAIGN_NAME,
      ];
      break;

    case WalmartAdvertisingTableTypeEnum.AD_GROUP:
      searchColumns = [
        WalmartSearchColumnsEnum.ADGROUP_ID,
        WalmartSearchColumnsEnum.ADGROUP_NAME,
      ];
      break;

    case WalmartAdvertisingTableTypeEnum.AD_ITEM:
      searchColumns = [
        WalmartSearchColumnsEnum.AD_ID,
        WalmartSearchColumnsEnum.ITEM_ID,
        WalmartSearchColumnsEnum.ITEM_NAME,
        WalmartSearchColumnsEnum.SKU,
      ];
      break;

    case WalmartAdvertisingTableTypeEnum.KEYWORD:
      if (adType === AdTypeShort.SPONSORED_VIDEO) {
        searchColumns = [
          WalmartSearchColumnsEnum.KT_ID,
          WalmartSearchColumnsEnum.KT_NAME,
        ];
      } else {
        searchColumns = [
          WalmartSearchColumnsEnum.KT_ID,
          WalmartSearchColumnsEnum.KT_NAME,
        ];
      }
      break;

    case WalmartAdvertisingTableTypeEnum.PAGE_TYPE:
      searchColumns = [WalmartSearchColumnsEnum.PAGE_TYPE];
      break;

    case WalmartAdvertisingTableTypeEnum.PLATFORM:
      searchColumns = [
        WalmartSearchColumnsEnum.PLATFORM,
        WalmartSearchColumnsEnum.CAMPAIGN_NAME,
      ];
      break;

    case WalmartAdvertisingTableTypeEnum.AUTO_SEARCH_TERM:
    case WalmartAdvertisingTableTypeEnum.MANUAL_SEARCH_TERM:
    case WalmartAdvertisingTableTypeEnum.SEARCH_TERM:
      searchColumns = [WalmartSearchColumnsEnum.SEARCH_TERM];
      break;

    case WalmartAdvertisingTableTypeEnum.CAMPAIGN_RULES:
      searchColumns = [
        WalmartSearchColumnsEnum.RULE_ID,
        WalmartSearchColumnsEnum.RULE_NAME,
      ];
      break;

    default:
      searchColumns = [];
  }
  return searchColumns;
};

export const getAdvertisingPerformancePayload = (
  filters: IFinalFilters[],
  payload: IAdvertisingFilter,
  searchText = '',
  tab: WalmartAdvertisingTableTypeEnum | AmazonAdvertisingTableTypesEnum,
  performanceType: PerformanceTypeEnum,
  marketplace: string,
  adType: AdTypeShort
) => {
  const payloadBody: IPerformancePayload = {
    range: payload.rangeType as string,
    startDate: payload.range?.startDate,
    endDate: payload.range?.endDate,
  };
  if (performanceType === PerformanceTypeEnum.GRAPH) {
    payloadBody.frequency = payload.frequency;
  }
  if (adType !== AdTypeShort.All) {
    payloadBody.campaignId = payload.campaignId;
    payloadBody.adGroupId = payload.adGroupId;
  }

  const requestPayload: IAdvertisingPerformanceRequestBody = {
    filters: filters,
    payload: payloadBody,
    searchText:
      tab === WalmartAdvertisingTableTypeEnum.PAGE_TYPE
        ? getMappedPageTypeSearchText(searchText)
        : searchText,
    searchColumns:
      marketplace === MarketplaceEnum.WALMART
        ? getWalmartSearchColumnsByTableType(
            adType,
            tab as WalmartAdvertisingTableTypeEnum
          )
        : getAmazonSearchColumnsByTableType(
            adType,
            tab as AmazonAdvertisingTableTypesEnum
          ),
  };

  if (marketplace === MarketplaceEnum.AMAZON) {
    requestPayload.tab = tab;
  }

  return requestPayload;
};

export const getSPBudgetFilter = (filters: IFinalFilters[]) => {
  const newFilters = filters.map((filter) => {
    if (filter.filterKey === 'budget') {
      return {
        ...filter,
        filterKey: 'budget.budget',
      };
    }
    return filter;
  });

  return newFilters;
};

export const getSPBudgetSortCriteria = (sortCriteria: Array<ISortCriteria>) => {
  return sortCriteria.map((criteria) => {
    if (criteria.columnName === 'budget') {
      return {
        ...criteria,
        columnName: 'budget.budget',
      };
    }
    return criteria;
  });
};

export const getSPNegKTCreationDateSortCriteria = (
  sortCriteria: Array<ISortCriteria>
) => {
  return sortCriteria.map((criteria) => {
    if (criteria.columnName === 'creationDateTime') {
      return {
        ...criteria,
        columnName: 'extendedData',
      };
    }
    return criteria;
  });
};

export const getMarketplaceIcon = (marketplace?: string) => {
  if (marketplace === MarketplaceEnum.AMAZON) return imageUrls.amazonLogoIcon;
  else if (marketplace === MarketplaceEnum.WALMART)
    return imageUrls.walmartLogoIcon;
  else return '';
};

export const getSelectedAdvertisingAccountByDropdownValue = (
  uniqueId: string
) => {
  const availableAccounts = localStorageUtils.getAvailableAccounts();
  for (const account of availableAccounts) {
    if (
      account?.advertising?.walmartAdvertiserId === uniqueId ||
      account?.advertising?.amazonProfileId === uniqueId
    )
      return account;
  }
  return null;
};
export const getSelectedDSPAccountByDropdownValue = (uniqueId: string) => {
  const availableAccounts = localStorageUtils.getAvailableDSPAccounts();
  for (const account of availableAccounts) {
    if (account.advertiserId === uniqueId) return account;
  }
  return null;
};

export const getSelectedCatalogAccountByDropdownValue = (
  dropdownValue: string
) => {
  const availableAccounts = localStorageUtils.getAvailableAccounts();

  for (const account of availableAccounts) {
    const value = genCatalogAccountOptionValue(account);

    if (value === dropdownValue) return account;
  }
  return null;
};

export const getFormattedMarketplaceForWalmart = (accountType: string) => {
  return accountType as WalmartAccountTypeEnum;
};

export const getFormattedSortCriteria = (
  sortingColumns: SortingState,
  defaultSortColumn = 'adSales'
): Array<ISortCriteria> => {
  return sortingColumns.map((sort) => {
    return {
      columnName: sort.id ?? defaultSortColumn,
      sortOrder: sort.desc ? SortOrderEnum.DESC : SortOrderEnum.ASC,
    };
  });
};

export const clearAllFilter = (
  appliedFilters: IFinalFilters[],
  selectedAdvertisingNavTitle: AdvertisingTitlesEnum,
  dispatch: Dispatch<AnyAction>,
  disableFilterConfig?: Filters[],
  initialRows?: Record<string, unknown>[],
  setFilteredRows?: (data: Record<string, unknown>[]) => void,
  isFilterDisabled?: boolean
) => {
  if (isFilterDisabled === true) return;
  const newFilters = appliedFilters.filter((appliedFilter) =>
    isDisabledFilter(appliedFilter.filterKey, disableFilterConfig)
  );
  dispatch(setAppliedFilters(newFilters));
  dispatch(setFilters(newFilters));
  syncStoredLsFilters(
    selectedAdvertisingNavTitle as AdvertisingTitlesEnum,
    newFilters
  );
  if (setFilteredRows) setFilteredRows(initialRows || []);
};

export const handleTableEmptyResetUtils = (
  setSortModel: (sortModel: SortingState) => void,
  setPaginationModel: (paginationModel: PaginationState) => void,
  defaultSortModel = DEFAULT_ADVERTISING_SORT_CRITERIA,
  defaultPaginationModel = UPDATED_PAGINATION_MODEL
) => {
  setPaginationModel(defaultPaginationModel);
  setSortModel(defaultSortModel);
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return -1;

  const k = 1024;
  switch (true) {
    case bytes < k:
      return `${bytes} B`;
    case bytes < Math.pow(k, 2):
      return `${(bytes / k).toFixed(1)} KB`;
    case bytes < Math.pow(k, 3):
      return `${(bytes / Math.pow(k, 2)).toFixed(2)} MB`;
  }
};

export const getInitialPinnedColumns = (
  selectedNavTitle: string
): ColumnPinningState => {
  switch (selectedNavTitle) {
    case OverallAccountLevelTitles.CAMPAIGNS:
    case SpAccountLevelTitles.CAMPAIGNS:
    case SbAccountLevelTitles.CAMPAIGNS:
    case SdAccountLevelTitles.CAMPAIGN:
      return {
        left: ['Status', 'Campaign'],
        right: [],
      };

    case WalmartSPAccountLevelTitles.CAMPAIGNS:
    case WalmartSBAccountLevelTitles.CAMPAIGNS:
    case WalmartSVAccountLevelTitles.CAMPAIGNS:
    case WalmartOverallAccountLevelTitles.CAMPAIGNS:
      return {
        left: ['Active', 'Status', 'Campaign'],
        right: [],
      };

    case OverallAccountLevelTitles.AD_GROUPS:
    case SpAccountLevelTitles.AD_GROUPS:
    case SpCampaignLevelTitles.AD_GROUPS:
    case WalmartSPAccountLevelTitles.AD_GROUPS:
    case WalmartSPCampaignLevelTitles.AD_GROUPS:
    case WalmartSBAccountLevelTitles.AD_GROUPS:
    case WalmartSBCampaignLevelTitles.AD_GROUPS:
    case WalmartSVAccountLevelTitles.AD_GROUPS:
    case WalmartSVCampaignLevelTitles.AD_GROUPS:
    case WalmartOverallAccountLevelTitles.AD_GROUPS:
    case SbAccountLevelTitles.AD_GROUP:
    case SbCampaignLevelTitles.AD_GROUP:
    case SdAccountLevelTitles.AD_GROUP:
    case SdCampaignLevelTitles.AD_GROUP:
      return {
        left: ['Status', 'Ad Group'],
        right: [],
      };

    case OverallAccountLevelTitles.PRODUCT_ADS:
    case SpAccountLevelTitles.PRODUCT_ADS:
    case SpCampaignLevelTitles.PRODUCT_ADS:
    case SpAdGroupLevelTitles.PRODUCT_ADS:
    case SbAccountLevelTitles.PRODUCT_ADS:
    case SbCampaignLevelTitles.PRODUCT_ADS:
    case SbAdGroupLevelTitles.PRODUCT_ADS:
    case SdAccountLevelTitles.PRODUCT_ADS:
    case SdCampaignLevelTitles.PRODUCT_ADS:
    case SdAdGroupLevelTitles.PRODUCT_ADS:
    case WalmartSPAccountLevelTitles.AD_ITEMS:
    case WalmartSPCampaignLevelTitles.AD_ITEMS:
    case WalmartSPAdGroupLevelTitles.AD_ITEMS:
    case WalmartSBAccountLevelTitles.AD_ITEMS:
    case WalmartSBCampaignLevelTitles.AD_ITEMS:
    case WalmartSBAdGroupLevelTitles.AD_ITEMS:
    case WalmartSVAccountLevelTitles.AD_ITEMS:
    case WalmartSVCampaignLevelTitles.AD_ITEMS:
    case WalmartSVAdGroupLevelTitles.AD_ITEMS:
    case WalmartOverallAccountLevelTitles.AD_ITEMS:
      return {
        left: ['Status', 'Product Ad'],
        right: [],
      };

    case OverallAccountLevelTitles.KEYWORD_TARGETING:
    case WalmartSPAccountLevelTitles.KEYWORD_TARGETING:
    case WalmartSPCampaignLevelTitles.KEYWORD_TARGETING:
    case WalmartSPAdGroupLevelTitles.KEYWORD_TARGETING:
    case WalmartSBAccountLevelTitles.KEYWORD_TARGETING:
    case WalmartSBCampaignLevelTitles.KEYWORD_TARGETING:
    case WalmartSBAdGroupLevelTitles.KEYWORD_TARGETING:
    case WalmartSVAccountLevelTitles.KEYWORD_TARGETING:
    case WalmartSVCampaignLevelTitles.KEYWORD_TARGETING:
    case WalmartSVAdGroupLevelTitles.KEYWORD_TARGETING:
    case WalmartOverallAccountLevelTitles.KEYWORD_TARGETING:
    case SpAccountLevelTitles.KEYWORD_TARGETING:
    case SpCampaignLevelTitles.KEYWORD_TARGETING:
    case SpAdGroupLevelTitles.KEYWORD_TARGETING:
    case SbAccountLevelTitles.KEYWORD_TARGETING:
    case SbCampaignLevelTitles.KEYWORD_TARGETING:
    case SbAdGroupLevelTitles.KEYWORD_TARGETING:
    case SpCampaignLevelTitles.NEG_TARGETING_KEYWORD:
    case SpAdGroupLevelTitles.NEG_TARGETING_KEYWORD:
    case SbCampaignLevelTitles.NEG_TARGETING_KEYWORD:
    case SbAdGroupLevelTitles.NEG_TARGETING_KEYWORD:
      return {
        left: ['Status', 'Keyword'],
        right: [],
      };

    case OverallAccountLevelTitles.PRODUCT_TARGETING:
    case SpAccountLevelTitles.PRODUCT_TARGETING:
    case SpCampaignLevelTitles.PRODUCT_TARGETING:
    case SpAdGroupLevelTitles.PRODUCT_TARGETING:
    case SbAccountLevelTitles.PRODUCT_TARGETING:
    case SbCampaignLevelTitles.PRODUCT_TARGETING:
    case SbAdGroupLevelTitles.PRODUCT_TARGETING:
    case SpAccountLevelTitles.AUTO_TARGETING:
    case SpCampaignLevelTitles.AUTO_TARGETING:
    case SpAdGroupLevelTitles.TARGETING:
    case SdCampaignLevelTitles.TARGETING:
    case SdAdGroupLevelTitles.TARGETING:
    case SpCampaignLevelTitles.NEG_TARGETING_PRODUCT:
    case SpAdGroupLevelTitles.NEG_TARGETING_PRODUCT:
    case SbCampaignLevelTitles.NEG_TARGETING_PRODUCT:
    case SbAdGroupLevelTitles.NEG_TARGETING_PRODUCT:
      return {
        left: ['Status', 'Targeting'],
        right: [],
      };

    case OverallAccountLevelTitles.SEARCH_TERM:
    case SpAccountLevelTitles.SEARCH_TERM:
    case SpCampaignLevelTitles.SEARCH_TERM:
    case SpAdGroupLevelTitles.SEARCH_TERM:
    case SbAccountLevelTitles.SEARCH_TERM:
    case SbCampaignLevelTitles.SEARCH_TERM_KEYWORD:
    case SbAdGroupLevelTitles.SEARCH_TERM_KEYWORD:
    case WalmartSPAccountLevelTitles.SEARCH_TERM:
    case WalmartSPCampaignLevelTitles.SEARCH_TERM:
    case WalmartSPAdGroupLevelTitles.SEARCH_TERM:
    case WalmartOverallAccountLevelTitles.SEARCH_TERM:
      return {
        left: ['Search Term'],
        right: [],
      };

    case WalmartSPAccountLevelTitles.PAGE_TYPE:
    case WalmartSPCampaignLevelTitles.PAGE_TYPE:
    case WalmartSBCampaignLevelTitles.PAGE_TYPE:
    case WalmartSBAccountLevelTitles.PAGE_TYPE:
    case WalmartSVCampaignLevelTitles.PAGE_TYPE:
    case WalmartSVAccountLevelTitles.PAGE_TYPE:
    case WalmartOverallAccountLevelTitles.PAGE_TYPE:
      return {
        left: ['Page Type'],
        right: [],
      };

    case WalmartSPAccountLevelTitles.PLATFORM:
    case WalmartSPCampaignLevelTitles.PLATFORM:
    case WalmartSBCampaignLevelTitles.PLATFORM:
    case WalmartSBAccountLevelTitles.PLATFORM:
    case WalmartSVAccountLevelTitles.PLATFORM:
    case WalmartSVCampaignLevelTitles.PLATFORM:
    case WalmartOverallAccountLevelTitles.PLATFORM:
      return {
        left: ['Platform'],
        right: [],
      };

    case SpAccountLevelTitles.PLACEMENT:
    case SpCampaignLevelTitles.PLACEMENT:
      return {
        left: ['Placement'],
        right: [],
      };

    default:
      return {
        left: [],
        right: [],
      };
  }
};

export const updateErrorList = (
  errorList: Record<string | number, IRowErrorMessage>,
  newError: IRowErrorMessage
): Record<string | number, IRowErrorMessage> => {
  if (!newError || (!newError.id && !newError.message)) {
    return {};
  }

  const updatedErrorList = { ...errorList };

  if (!newError.message) {
    delete updatedErrorList[newError.id];
  } else {
    updatedErrorList[newError.id] = newError;
  }

  return updatedErrorList;
};

export const getAmazonBudgetMinLimitValue = (
  adType: string,
  accountType: string | undefined,
  budgetType: string | undefined,
  marketplace: MarketplaceEnum = MarketplaceEnum.AMAZON
): number | null => {
  if (!adType || !accountType) return null;

  if (marketplace === MarketplaceEnum.AMAZON) {
    if (
      adType === AdType.SPONSORED_PRODUCTS ||
      adType === AdTypeShort.SPONSORED_PRODUCTS
    ) {
      if (accountType === AmazonAccountType.VENDOR) {
        return getAmzSPBudget1PMinLimitByCountry();
      }

      if (accountType === AmazonAccountType.SELLER) {
        return getAmzSPBudget3PMinLimitByCountry();
      }

      return null;
    }

    if (
      adType === AdType.SPONSORED_BRANDS ||
      adType === AdTypeShort.SPONSORED_BRANDS
    ) {
      if (accountType === AmazonAccountType.VENDOR) {
        if (
          budgetType &&
          budgetType?.toUpperCase() === AmazonSBBudgetTypeEnum.DAILY
        ) {
          return getAmzSBBudgetDaily1PMinLimitByCountry();
        }

        if (
          budgetType &&
          budgetType?.toUpperCase() === AmazonSBBudgetTypeEnum.LIFETIME
        ) {
          return getAmzSBBudgetLifetime1PMinLimitByCountry();
        }

        return null;
      }

      if (accountType === AmazonAccountType.SELLER) {
        if (
          budgetType &&
          budgetType?.toUpperCase() === AmazonSBBudgetTypeEnum.DAILY
        ) {
          return getAmzSBBudgetDaily3PMinLimitByCountry();
        }

        if (
          budgetType &&
          budgetType?.toUpperCase() === AmazonSBBudgetTypeEnum.LIFETIME
        ) {
          return getAmzSBBudgetLifetime3PMinLimitByCountry();
        }

        return null;
      }

      return null;
    }

    if (
      adType === AdType.SPONSORED_DISPLAY ||
      adType === AdTypeShort.SPONSORED_DISPLAY
    ) {
      if (accountType === AmazonAccountType.VENDOR) {
        return getAmzSDBudget1PMinLimitByCountry();
      }

      if (accountType === AmazonAccountType.SELLER) {
        return getAmzSDBudget3PMinLimitByCountry();
      }

      return null;
    }
  }

  return null;
};

export const getAmazonBudgetMaxLimitValue = (
  adType: string,
  accountType: string | undefined,
  budgetType: string | undefined,
  marketplace: MarketplaceEnum = MarketplaceEnum.AMAZON
): number | null => {
  if (!adType || !accountType) return null;

  if (marketplace === MarketplaceEnum.AMAZON) {
    if (
      adType === AdType.SPONSORED_PRODUCTS ||
      adType === AdTypeShort.SPONSORED_PRODUCTS
    ) {
      if (accountType === AmazonAccountType.VENDOR) {
        return getAmzSPBudget1PMaxLimitByCountry();
      }

      if (accountType === AmazonAccountType.SELLER) {
        return getAmzSPBudget3PMaxLimitByCountry();
      }

      return null;
    }

    if (
      adType === AdType.SPONSORED_BRANDS ||
      adType === AdTypeShort.SPONSORED_BRANDS
    ) {
      if (accountType === AmazonAccountType.VENDOR) {
        if (
          budgetType &&
          budgetType?.toUpperCase() === AmazonSBBudgetTypeEnum.DAILY
        ) {
          return getAmzSBBudgetDaily1PMaxLimitByCountry();
        }

        if (
          budgetType &&
          budgetType?.toUpperCase() === AmazonSBBudgetTypeEnum.LIFETIME
        ) {
          return getAmzSBBudgetLifetime1PMaxLimitByCountry();
        }

        return null;
      }

      if (accountType === AmazonAccountType.SELLER) {
        if (
          budgetType &&
          budgetType?.toUpperCase() === AmazonSBBudgetTypeEnum.DAILY
        ) {
          return getAmzSBBudgetDaily3PMaxLimitByCountry();
        }

        if (
          budgetType &&
          budgetType?.toUpperCase() === AmazonSBBudgetTypeEnum.LIFETIME
        ) {
          return getAmzSBBudgetLifetime3PMaxLimitByCountry();
        }

        return null;
      }

      return null;
    }

    if (
      adType === AdType.SPONSORED_DISPLAY ||
      adType === AdTypeShort.SPONSORED_DISPLAY
    ) {
      if (accountType === AmazonAccountType.VENDOR) {
        return getAmzSDBudget1PMaxLimitByCountry();
      }

      if (accountType === AmazonAccountType.SELLER) {
        return getAmzSDBudget3PMaxLimitByCountry();
      }

      return null;
    }
  }

  return null;
};

export const getAmazonMinBidLimitValue = (
  adType: string,
  costType: string | undefined,
  creativeType: string | undefined,
  marketplace: MarketplaceEnum = MarketplaceEnum.AMAZON
): number | null => {
  if (marketplace === MarketplaceEnum.AMAZON) {
    if (
      adType === AdType.SPONSORED_PRODUCTS ||
      adType === AdTypeShort.SPONSORED_PRODUCTS
    ) {
      return getAmzSPMinBidLimitByCountry();
    }

    if (
      adType === AdType.SPONSORED_BRANDS ||
      adType === AdTypeShort.SPONSORED_BRANDS
    ) {
      if (costType && costType?.toUpperCase() === AmazonCostTypeEnum.CPC) {
        if (
          creativeType &&
          (creativeType === AmazonSBCreativeTypeEnum.PRODUCT_COLLECTION ||
            creativeType === AmazonSBCreativeTypeEnum.STORE_SPOTLIGHT)
        ) {
          return getAmz_SB_CPC_Img_MinBidLimitByCountry();
        }

        if (
          creativeType &&
          (creativeType === AmazonSBCreativeTypeEnum.BRAND_VIDEO ||
            creativeType === AmazonSBCreativeTypeEnum.VIDEO)
        ) {
          return getAmz_SBV_CPC_Vid_MinBidLimitByCountry();
        }

        return null;
      }

      if (costType && costType?.toUpperCase() === AmazonCostTypeEnum.VCPM) {
        if (
          creativeType &&
          (creativeType === AmazonSBCreativeTypeEnum.PRODUCT_COLLECTION ||
            creativeType === AmazonSBCreativeTypeEnum.STORE_SPOTLIGHT)
        ) {
          return getAmz_SB_VCPM_Img_BIS_MinBidLimitByCountry();
        }

        if (
          creativeType &&
          (creativeType === AmazonSBCreativeTypeEnum.BRAND_VIDEO ||
            creativeType === AmazonSBCreativeTypeEnum.VIDEO)
        ) {
          return getAmz_SBV_VCPM_Vid_BIS_MinBidLimitByCountry();
        }

        return null;
      }

      return null;
    }

    if (
      adType === AdType.SPONSORED_DISPLAY ||
      adType === AdTypeShort.SPONSORED_DISPLAY
    ) {
      if (costType && costType?.toUpperCase() === AmazonCostTypeEnum.CPC) {
        return getAmz_SD_CPC_MinBidLimitByCountry();
      }

      if (costType && costType?.toUpperCase() === AmazonCostTypeEnum.VCPM) {
        return getAmz_SD_VCPM_MinBidLimitByCountry();
      }

      return null;
    }
  }

  return null;
};

export const getAmazonMaxBidLimitValue = (
  adType: string,
  costType: string | undefined,
  creativeType: string | undefined,
  marketplace: MarketplaceEnum = MarketplaceEnum.AMAZON
): number | null => {
  if (marketplace === MarketplaceEnum.AMAZON) {
    if (
      adType === AdType.SPONSORED_PRODUCTS ||
      adType === AdTypeShort.SPONSORED_PRODUCTS
    ) {
      return getAmzSPMaxBidLimitByCountry();
    }

    if (
      adType === AdType.SPONSORED_BRANDS ||
      adType === AdTypeShort.SPONSORED_BRANDS
    ) {
      if (costType && costType?.toUpperCase() === AmazonCostTypeEnum.CPC) {
        if (
          creativeType &&
          (creativeType === AmazonSBCreativeTypeEnum.PRODUCT_COLLECTION ||
            creativeType === AmazonSBCreativeTypeEnum.STORE_SPOTLIGHT)
        ) {
          return getAmz_SB_CPC_Img_MaxBidLimitByCountry();
        }

        if (
          creativeType &&
          (creativeType === AmazonSBCreativeTypeEnum.BRAND_VIDEO ||
            creativeType === AmazonSBCreativeTypeEnum.VIDEO)
        ) {
          return getAmz_SBV_CPC_Vid_MaxBidLimitByCountry();
        }

        return null;
      }

      if (costType && costType?.toUpperCase() === AmazonCostTypeEnum.VCPM) {
        if (
          creativeType &&
          (creativeType === AmazonSBCreativeTypeEnum.PRODUCT_COLLECTION ||
            creativeType === AmazonSBCreativeTypeEnum.STORE_SPOTLIGHT)
        ) {
          return getAmz_SB_VCPM_Img_BIS_MaxBidLimitByCountry();
        }

        if (
          creativeType &&
          (creativeType === AmazonSBCreativeTypeEnum.BRAND_VIDEO ||
            creativeType === AmazonSBCreativeTypeEnum.VIDEO)
        ) {
          return getAmz_SBV_VCPM_Vid_BIS_MaxBidLimitByCountry();
        }

        return null;
      }

      return null;
    }

    if (
      adType === AdType.SPONSORED_DISPLAY ||
      adType === AdTypeShort.SPONSORED_DISPLAY
    ) {
      if (costType && costType?.toUpperCase() === AmazonCostTypeEnum.CPC) {
        return getAmz_SD_CPC_MaxBidLimitByCountry();
      }

      if (costType && costType?.toUpperCase() === AmazonCostTypeEnum.VCPM) {
        return getAmz_SD_VCPM_MaxBidLimitByCountry();
      }

      return null;
    }
  }

  return null;
};

export const checkBidValueMinLimit = (
  marketplace: MarketplaceEnum | undefined,
  adType: string,
  targetingType: string | undefined | null,
  value: number,
  amzCostType?: string,
  amzCreativeType?: string
): string => {
  if (marketplace && marketplace === MarketplaceEnum.WALMART) {
    if (targetingType && targetingType === TargetingTypeEnum.AUTO) {
      if (
        (adType === AdType.SPONSORED_PRODUCTS ||
          adType === AdTypeShort.SPONSORED_PRODUCTS ||
          adType === WalmartAdTypeEnum.SPONSORED_PRODUCTS) &&
        value < WALMART_AUTO_SP_BID_MIN_LIMIT
      ) {
        return `Bid cannot be less than ${displayValue(
          formatNum(WALMART_AUTO_SP_BID_MIN_LIMIT),
          false
        )}`;
      }
    }

    if (targetingType && targetingType === TargetingTypeEnum.MANUAL) {
      if (
        (adType === AdType.SPONSORED_PRODUCTS ||
          adType === AdTypeShort.SPONSORED_PRODUCTS ||
          adType === WalmartAdTypeEnum.SPONSORED_PRODUCTS) &&
        value < WALMART_MANUAL_SP_BID_MIN_LIMIT
      ) {
        return `Bid cannot be less than ${displayValue(
          formatNum(WALMART_MANUAL_SP_BID_MIN_LIMIT),
          false
        )}
        `;
      }

      if (
        (adType === AdType.SPONSORED_BRANDS ||
          adType === AdTypeShort.SPONSORED_BRANDS ||
          adType === WalmartAdTypeEnum.SPONSORED_BRANDS) &&
        value < WALMART_MANUAL_SB_BID_MIN_LIMIT
      ) {
        return `Bid cannot be less than ${displayValue(
          formatNum(WALMART_MANUAL_SB_BID_MIN_LIMIT),
          false
        )}`;
      }

      if (
        (adType === AdType.SPONSORED_VIDEO ||
          adType === AdTypeShort.SPONSORED_VIDEO ||
          adType === WalmartAdTypeEnum.SPONSORED_VIDEO) &&
        value < WALMART_MANUAL_SV_BID_MIN_LIMIT
      ) {
        return `Bid cannot be less than ${displayValue(
          formatNum(WALMART_MANUAL_SV_BID_MIN_LIMIT),
          false
        )}`;
      }
    }
  }

  if (marketplace && marketplace === MarketplaceEnum.AMAZON) {
    const bidMinLimitValue = getAmazonMinBidLimitValue(
      adType,
      amzCostType,
      amzCreativeType,
      MarketplaceEnum.AMAZON
    );

    if (bidMinLimitValue !== null && value < bidMinLimitValue) {
      return `Bid cannot be less than ${displayValue(
        formatNum(bidMinLimitValue),
        false
      )}`;
    }

    return '';
  }

  return '';
};

export const checkBidValueMaxLimit = (
  marketplace: MarketplaceEnum | undefined,
  adType: string,
  targetingType: string | undefined | null,
  value: number,
  amzCostType?: string,
  amzCreativeType?: string
): string => {
  if (marketplace && marketplace === MarketplaceEnum.WALMART) {
    if (targetingType && targetingType === TargetingTypeEnum.AUTO) {
      if (
        (adType === AdType.SPONSORED_PRODUCTS ||
          adType === AdTypeShort.SPONSORED_PRODUCTS ||
          adType === WalmartAdTypeEnum.SPONSORED_PRODUCTS) &&
        value > WALMART_AUTO_SP_BID_MAX_LIMIT
      ) {
        return `Bid cannot exceed ${displayValue(
          formatNum(WALMART_AUTO_SP_BID_MAX_LIMIT),
          false
        )}`;
      }
    }

    if (targetingType && targetingType === TargetingTypeEnum.MANUAL) {
      if (
        (adType === AdType.SPONSORED_PRODUCTS ||
          adType === AdTypeShort.SPONSORED_PRODUCTS ||
          adType === WalmartAdTypeEnum.SPONSORED_PRODUCTS) &&
        value > WALMART_MANUAL_SP_BID_MAX_LIMIT
      ) {
        return `Bid cannot exceed ${displayValue(
          formatNum(WALMART_MANUAL_SP_BID_MAX_LIMIT),
          false
        )}`;
      }

      if (
        (adType === AdType.SPONSORED_BRANDS ||
          adType === AdTypeShort.SPONSORED_BRANDS ||
          adType === WalmartAdTypeEnum.SPONSORED_BRANDS) &&
        value > WALMART_MANUAL_SB_BID_MAX_LIMIT
      ) {
        return `Bid cannot exceed ${displayValue(
          formatNum(WALMART_MANUAL_SB_BID_MAX_LIMIT),
          false
        )}`;
      }

      if (
        (adType === AdType.SPONSORED_VIDEO ||
          adType === AdTypeShort.SPONSORED_VIDEO ||
          adType === WalmartAdTypeEnum.SPONSORED_VIDEO) &&
        value > WALMART_MANUAL_SV_BID_MAX_LIMIT
      ) {
        return `Bid cannot exceed ${displayValue(
          formatNum(WALMART_MANUAL_SV_BID_MAX_LIMIT),
          false
        )}`;
      }
    }
  }

  if (marketplace && marketplace === MarketplaceEnum.AMAZON) {
    const bidMaxLimitValue = getAmazonMaxBidLimitValue(
      adType,
      amzCostType,
      amzCreativeType,
      MarketplaceEnum.AMAZON
    );

    if (bidMaxLimitValue !== null && value > bidMaxLimitValue) {
      return `Bid cannot exceed ${displayValue(
        formatNum(bidMaxLimitValue),
        false
      )}`;
    }

    return '';
  }

  return '';
};

export const checkWalmartDailyBudgetLimit = (
  marketplace: MarketplaceEnum | undefined,
  accountType: string | undefined,
  value: number
): string => {
  if (marketplace === MarketplaceEnum.WALMART) {
    if (
      accountType === WalmartAccountTypeEnum.THIRD_PARTY &&
      value < WALMART_3P_DAILY_BUDGET_MIN
    ) {
      return `Daily Budget cannot be less than ${displayValue(
        formatNum(WALMART_3P_DAILY_BUDGET_MIN),
        false
      )}
      for 3P accounts`;
    }

    if (
      accountType === WalmartAccountTypeEnum.FIRST_PARTY &&
      value < WALMART_1P_DAILY_BUDGET_MIN
    ) {
      return `Daily Budget cannot be less than ${displayValue(
        formatNum(WALMART_1P_DAILY_BUDGET_MIN),
        false
      )} for 1P accounts`;
    }

    if (value > WALMART_BUDGET_MAX) {
      return `Daily Budget cannot exceed ${displayValue(
        formatNum(WALMART_BUDGET_MAX),
        false
      )}`;
    }

    return '';
  }

  return '';
};

export const checkWalmartTotalBudgetLimit = (
  marketplace: MarketplaceEnum | undefined,
  accountType: string | undefined,
  value: number
): string => {
  if (marketplace === MarketplaceEnum.WALMART) {
    if (
      accountType === WalmartAccountTypeEnum.THIRD_PARTY &&
      value < WALMART_3P_TOTAL_BUDGET_MIN
    ) {
      return `Total Budget cannot be less than ${displayValue(
        formatNum(WALMART_3P_TOTAL_BUDGET_MIN),
        false
      )} for 3P accounts.`;
    }

    if (
      accountType === WalmartAccountTypeEnum.FIRST_PARTY &&
      value < WALMART_1P_TOTAL_BUDGET_MIN
    ) {
      return `Total Budget cannot be less than ${displayValue(
        formatNum(WALMART_1P_TOTAL_BUDGET_MIN),
        false
      )}for 1P accounts.`;
    }

    if (value > WALMART_BUDGET_MAX) {
      return `Total Budget cannot exceed ${displayValue(
        formatNum(WALMART_BUDGET_MAX),
        false
      )}.`;
    }

    return '';
  }

  return '';
};

export const checkAmazonBudgetLimit = (
  value: number,
  adType: string,
  accountType: string | undefined,
  budgetType: string | undefined,
  marketplace: MarketplaceEnum = MarketplaceEnum.AMAZON
): string => {
  if (marketplace && marketplace === MarketplaceEnum.AMAZON) {
    const budgetMinLimitValue = getAmazonBudgetMinLimitValue(
      adType,
      accountType,
      budgetType,
      MarketplaceEnum.AMAZON
    );

    const budgetMaxLimitValue = getAmazonBudgetMaxLimitValue(
      adType,
      accountType,
      budgetType,
      MarketplaceEnum.AMAZON
    );

    if (budgetMinLimitValue !== null && value < budgetMinLimitValue) {
      return `Budget cannot be less than ${displayValue(
        formatNum(budgetMinLimitValue),
        false
      )}`;
    }

    if (budgetMaxLimitValue !== null && value > budgetMaxLimitValue) {
      return `Budget cannot exceed ${displayValue(
        formatNum(budgetMaxLimitValue),
        false
      )}`;
    }

    return '';
  }

  return '';
};

export const getCurrentAdType = (adType: string) => {
  switch (adType) {
    case AdType.SPONSORED_BRANDS:
      return AdTypeShort.SPONSORED_BRANDS;
    case AdType.SPONSORED_PRODUCTS:
      return AdTypeShort.SPONSORED_PRODUCTS;
    case AdType.SPONSORED_DISPLAY:
      return AdTypeShort.SPONSORED_DISPLAY;
    case AdType.SPONSORED_VIDEO:
      return AdTypeShort.SPONSORED_VIDEO;
    default:
      return '';
  }
};

export const checkIsObjectEmpty = (
  obj: Record<any, any> | undefined
): boolean => {
  return obj !== undefined && Object.keys(obj).length <= 0;
};
export const showFooter = (selectedNavTab: AdvertisingTitlesEnum) => {
  switch (selectedNavTab) {
    case SpCampaignLevelTitles.HISTORY:
    case SbCampaignLevelTitles.HISTORY:
    case SdCampaignLevelTitles.HISTORY:
    case SpAdGroupLevelTitles.HISTORY:
    case SpAdGroupLevelTitles.NEG_TARGETING:
    case SpCampaignLevelTitles.NEG_TARGETING:
    case SbCampaignLevelTitles.NEG_TARGETING:
    case SpAdGroupLevelTitles.NEG_TARGETING_KEYWORD:
    case SpCampaignLevelTitles.NEG_TARGETING_KEYWORD:
    case SbCampaignLevelTitles.NEG_TARGETING_KEYWORD:
    case SpCampaignLevelTitles.NEG_TARGETING_PRODUCT:
    case SpAdGroupLevelTitles.NEG_TARGETING_PRODUCT:
    case SbCampaignLevelTitles.NEG_TARGETING_PRODUCT:
      return false;

    default:
      return true;
  }
};

export const getWalmartSearchTermType = (targetingType: string) => {
  if (targetingType === TargetingTypeEnum.AUTO) {
    return WalmartAdvertisingTableTypeEnum.AUTO_SEARCH_TERM;
  } else if (targetingType === TargetingTypeEnum.MANUAL) {
    return WalmartAdvertisingTableTypeEnum.MANUAL_SEARCH_TERM;
  } else {
    return WalmartAdvertisingTableTypeEnum.SEARCH_TERM;
  }
};

export const getFooterDisplayText = (
  props: HeaderContext<any, unknown>,
  columnName?: string,
  count?: number
) => {
  if (!props.column.getIsPinned()) return null;
  const rowCount = count ?? props.table.getRowCount();
  const id = columnName ?? props.column.id;
  const isLoading = props.table.options.meta?.isLoading === true;

  return isLoading === true
    ? '-'
    : `Total for ${formatNum(rowCount, false)} ${
        rowCount === 1 ? id : `${id}s`
      }`;
};

export const sortDropdownOptions = (options: IDropdownItem<string>[]) => {
  return [...options].sort((a, b) => {
    const labelA = a.label.replace(/^\([^)]+\)\s*/, '').trim();
    const labelB = b.label.replace(/^\([^)]+\)\s*/, '').trim();
    return labelA.localeCompare(labelB);
  });
};
export const sortMultiSelectDropdownOptions = (
  options: IMultiSelectDropdownItem[]
) => {
  return [...options].sort((a, b) => {
    const labelA = a.label.replace(/^\([^)]+\)\s*/, '').trim();
    const labelB = b.label.replace(/^\([^)]+\)\s*/, '').trim();
    return labelA.localeCompare(labelB);
  });
};

export const checkNameError = (
  marketplace: string | undefined,
  levelType: 'campaign' | 'adGroup' | '',
  value: string | null | undefined
): string => {
  if (!levelType) return '';

  if (levelType === 'campaign' && !value)
    return 'Campaign Name cannot be empty.';

  if (levelType === 'adGroup' && !value)
    return 'Ad Group Name cannot be empty.';

  if (marketplace && marketplace === MarketplaceEnum.WALMART) {
    if (
      levelType === 'campaign' &&
      value &&
      value.length > WALMART_CAMPAIGN_NAME_LIMIT
    )
      return `Campaign Name cannot exceed ${WALMART_CAMPAIGN_NAME_LIMIT} characters.`;

    if (
      levelType === 'adGroup' &&
      value &&
      value.length > WALMART_ADGROUP_NAME_LIMIT
    )
      return `Ad Group Name cannot exceed ${WALMART_ADGROUP_NAME_LIMIT} characters.`;
  }

  if (marketplace && marketplace === MarketplaceEnum.AMAZON) {
    if (
      levelType === 'campaign' &&
      value &&
      value.length > AMAZON_CAMPAIGN_NAME_LIMIT
    )
      return `Campaign Name cannot exceed ${AMAZON_CAMPAIGN_NAME_LIMIT} characters.`;

    if (
      levelType === 'adGroup' &&
      value &&
      value.length > AMAZON_ADGROUP_NAME_LIMIT
    )
      return `Ad Group Name cannot exceed ${AMAZON_ADGROUP_NAME_LIMIT} characters.`;
  }

  return '';
};

export const getPlacementTypeByName = (
  placementName: string | null,
  placementBidding: IPlacementBidding[] | undefined | null
): IPlacementBidding | undefined | null => {
  if (!placementName || !placementBidding || !placementBidding.length)
    return null;

  switch (placementName) {
    case PlacementNames.TOP_OF_SEARCH:
      return placementBidding.find(
        (placement) => placement.placement === PlacementBids.TOP_OF_SEARCH
      );

    case PlacementNames.PRODUCT_PAGES:
      return placementBidding.find(
        (placement) => placement.placement === PlacementBids.PRODUCT_PAGES
      );

    case PlacementNames.REST_OF_SEARCH:
      return placementBidding.find(
        (placement) => placement.placement === PlacementBids.REST_OF_SEARCH
      );

    default:
      return null;
  }
};

export const getIsViewEditRequired = (selectedNav: AdvertisingTitlesEnum) => {
  switch (selectedNav) {
    case SpAccountLevelTitles.PLACEMENT:
    case SpCampaignLevelTitles.PLACEMENT:
    case SpAccountLevelTitles.SEARCH_TERM:
    case SpCampaignLevelTitles.SEARCH_TERM:
    case SpAdGroupLevelTitles.SEARCH_TERM:
    case WalmartSPAccountLevelTitles.SEARCH_TERM:
    case WalmartSPAdGroupLevelTitles.SEARCH_TERM:
    case WalmartSPCampaignLevelTitles.SEARCH_TERM:
    case WalmartSBAccountLevelTitles.PAGE_TYPE:
    case WalmartSBAccountLevelTitles.PLATFORM:
    case WalmartSBAccountLevelTitles.SEARCH_TERM:
    case WalmartSBCampaignLevelTitles.BRANDS:
    case WalmartSBCampaignLevelTitles.PAGE_TYPE:
    case WalmartSBCampaignLevelTitles.PLATFORM:
    case WalmartSBCampaignLevelTitles.SEARCH_TERM:
    case WalmartSBAdGroupLevelTitles.SEARCH_TERM:
    case WalmartSVAccountLevelTitles.PAGE_TYPE:
    case WalmartSVAccountLevelTitles.PLATFORM:
    case WalmartSVAccountLevelTitles.SEARCH_TERM:
    case WalmartSVAccountLevelTitles.VIDEO:
    case WalmartSVCampaignLevelTitles.PAGE_TYPE:
    case WalmartSVCampaignLevelTitles.PLATFORM:
    case WalmartSVCampaignLevelTitles.SEARCH_TERM:
    case WalmartSVCampaignLevelTitles.VIDEO:
    case WalmartSVAdGroupLevelTitles.SEARCH_TERM:
    case SbCampaignLevelTitles.HISTORY:
    case SbAccountLevelTitles.SEARCH_TERM:
    case SbCampaignLevelTitles.SEARCH_TERM_KEYWORD:
    case SbAdGroupLevelTitles.SEARCH_TERM_KEYWORD:
    case SdAccountLevelTitles.AUDIENCE:
    case SdAccountLevelTitles.CONTEXTUAL_TARGETING:
    case SdCampaignLevelTitles.HISTORY:
    case SdCampaignLevelTitles.TARGETING:
    case SdAdGroupLevelTitles.CREATIVE:
    case SdAdGroupLevelTitles.HISTORY:
    case SdAdGroupLevelTitles.TARGETING:
    case OverallAccountLevelTitles.CAMPAIGNS:
    case OverallAccountLevelTitles.AD_GROUPS:
    case OverallAccountLevelTitles.PRODUCT_ADS:
    case OverallAccountLevelTitles.KEYWORD_TARGETING:
    case OverallAccountLevelTitles.PRODUCT_TARGETING:
    case WalmartOverallAccountLevelTitles.SEARCH_TERM:
    case OverallAccountLevelTitles.SEARCH_TERM:
      return false;

    default:
      return true;
  }
};

export const haveFiltersChanged = (
  currentFilters: IAdvertisingFilterForm,
  previousFilters: IAdvertisingFilterForm
): boolean => {
  if (currentFilters.range.value !== previousFilters.range.value) return true;
  if (currentFilters.frequency.value !== previousFilters.frequency.value)
    return true;

  if (currentFilters.range.value === Range.CUSTOM_RANGE) {
    const currentCustomRange = currentFilters.customDateRange;
    const prevCustomRange = previousFilters.customDateRange;

    if (!currentCustomRange || !prevCustomRange) return true;

    return (
      currentCustomRange.startDate !== prevCustomRange.startDate ||
      currentCustomRange.endDate !== prevCustomRange.endDate
    );
  }
  return false;
};

export const getTab = (tab: AmazonAdvertisingTableTypesEnum) => {
  if (tab === AmazonAdvertisingTableTypesEnum.KEYWORD_TARGETS) {
    return AmazonAdvertisingTableTypesEnum.NEW_KEYWORD_TARGETS;
  } else {
    return tab;
  }
};

export const getLastSelectedMarketplace = (marketplace: string) => {
  return marketplace || localStorageUtils.getLastSelectedMarketplace();
};

export const setLastSelectedAccount = (
  account: ISettingsAccount,
  marketplace: string
) => {
  if (marketplace === MarketplaceEnum.AMAZON) {
    localStorageUtils.setLastSelectedAmazonAccount(account);
    return;
  }
  if (marketplace === MarketplaceEnum.WALMART) {
    localStorageUtils.setLastSelectedWalmartAccount(account);
    return;
  }
};

export const getLastSelectedAccountByMarketplace = (
  marketplace: MarketplaceEnum
) => {
  if (marketplace === MarketplaceEnum.AMAZON) {
    return localStorageUtils.getLastSelectedAmazonAccount();
  }
  if (marketplace === MarketplaceEnum.WALMART) {
    return localStorageUtils.getLastSelectedWalmartAccount();
  }
  return localStorageUtils.getSelectedAdvertisingAccount();
};
export const getSelectedMarketplaceAccounts = (
  availableAccounts: ISettingsAccount[],
  marketplace: string
) => {
  if (marketplace === MarketplaceEnum.All) return availableAccounts;
  const accounts = availableAccounts.filter(
    (account) => account.marketplace === marketplace
  );
  return accounts;
};

export const getSortedAccounts = (accounts: ISettingsAccount[]) => {
  accounts.sort((a, b) => {
    const brandNameA = a.advertising?.brandName;
    const brandNameB = b.advertising?.brandName;
    if (brandNameA && brandNameB) {
      return brandNameA.localeCompare(brandNameB);
    }
    return 0;
  });
  return accounts;
};
export const getAdsFirstMarketplaceAccount = (marketplace: string) => {
  const availableAccounts = localStorageUtils.getAvailableAccounts();
  const accounts = getSelectedMarketplaceAccounts(
    availableAccounts,
    marketplace
  );

  const getFirstAdsAccount = getSortedAccounts(accounts).find(
    (account) => account.advertising
  );

  if (marketplace === MarketplaceEnum.All) {
    return (
      localStorageUtils.getSelectedAdvertisingAccount() ?? getFirstAdsAccount
    );
  }

  return getFirstAdsAccount;
};

export const getIsShowImpactEnabled = (selectedNav: AdvertisingTitlesEnum) => {
  switch (selectedNav) {
    case OverallAccountLevelTitles.CAMPAIGNS:
    case OverallAccountLevelTitles.AD_GROUPS:
    case OverallAccountLevelTitles.PRODUCT_ADS:
    case OverallAccountLevelTitles.KEYWORD_TARGETING:
    case OverallAccountLevelTitles.SEARCH_TERM:
    case SpAccountLevelTitles.CAMPAIGNS:
    case SpAccountLevelTitles.AD_GROUPS:
    case SpAccountLevelTitles.PRODUCT_ADS:
    case SpAccountLevelTitles.KEYWORD_TARGETING:
    case SpAccountLevelTitles.SEARCH_TERM:
    case SbAccountLevelTitles.CAMPAIGNS:
    case SbAccountLevelTitles.AD_GROUP:
    case SbAccountLevelTitles.PRODUCT_ADS:
    case SbAccountLevelTitles.KEYWORD_TARGETING:
    case SbAccountLevelTitles.SEARCH_TERM:
    case SdAccountLevelTitles.CAMPAIGN:
    case SdAccountLevelTitles.PRODUCT_ADS:
    case SdAccountLevelTitles.AD_GROUP:
    case WalmartOverallAccountLevelTitles.CAMPAIGNS:
    case WalmartSPAccountLevelTitles.CAMPAIGNS:
    case WalmartSBAccountLevelTitles.CAMPAIGNS:
    case WalmartSVAccountLevelTitles.CAMPAIGNS:
    case WalmartOverallAccountLevelTitles.AD_GROUPS:
    case WalmartSPAccountLevelTitles.AD_GROUPS:
    case WalmartSBAccountLevelTitles.AD_GROUPS:
    case WalmartSVAccountLevelTitles.AD_GROUPS:
    case WalmartOverallAccountLevelTitles.AD_ITEMS:
    case WalmartSPAccountLevelTitles.AD_ITEMS:
    case WalmartSBAccountLevelTitles.AD_ITEMS:
    case WalmartSVAccountLevelTitles.AD_ITEMS:
    case WalmartOverallAccountLevelTitles.KEYWORD_TARGETING:
    case WalmartSPAccountLevelTitles.KEYWORD_TARGETING:
    case WalmartSBAccountLevelTitles.KEYWORD_TARGETING:
    case WalmartSVAccountLevelTitles.KEYWORD_TARGETING:
    case WalmartOverallAccountLevelTitles.SEARCH_TERM:
    case WalmartSPAccountLevelTitles.SEARCH_TERM:
      return true;
    default:
      return false;
  }
};

export const getAdvertisingTableURI = (
  selectedNav: AdvertisingTitlesEnum
): string => {
  switch (selectedNav) {
    case SpAccountLevelTitles.CAMPAIGNS:
    case SdAccountLevelTitles.CAMPAIGN:
    case SbAccountLevelTitles.CAMPAIGNS:
    case OverallAccountLevelTitles.CAMPAIGNS:
    case WalmartSPAccountLevelTitles.CAMPAIGNS:
    case WalmartSBAccountLevelTitles.CAMPAIGNS:
    case WalmartOverallAccountLevelTitles.CAMPAIGNS:
    case WalmartSVAccountLevelTitles.CAMPAIGNS:
      return `/${AdvertisingTabRoutes.CAMPAIGN}`;

    case SpAccountLevelTitles.AD_GROUPS:
    case SdAccountLevelTitles.AD_GROUP:
    case SbAccountLevelTitles.AD_GROUP:
    case OverallAccountLevelTitles.AD_GROUPS:
    case SpCampaignLevelTitles.AD_GROUPS:
    case SbCampaignLevelTitles.AD_GROUP:
    case SdCampaignLevelTitles.AD_GROUP:
    case WalmartOverallAccountLevelTitles.AD_GROUPS:
    case WalmartSPAccountLevelTitles.AD_GROUPS:
    case WalmartSBAccountLevelTitles.AD_GROUPS:
    case WalmartSVAccountLevelTitles.AD_GROUPS:
    case WalmartSPCampaignLevelTitles.AD_GROUPS:
    case WalmartSBCampaignLevelTitles.AD_GROUPS:
    case WalmartSVCampaignLevelTitles.AD_GROUPS:
      return `/${AdvertisingTabRoutes.AD_GROUP}`;

    case SpAccountLevelTitles.PRODUCT_ADS:
    case SdAccountLevelTitles.PRODUCT_ADS:
    case SbAccountLevelTitles.PRODUCT_ADS:
    case OverallAccountLevelTitles.PRODUCT_ADS:
    case SpCampaignLevelTitles.PRODUCT_ADS:
    case SbCampaignLevelTitles.PRODUCT_ADS:
    case SdCampaignLevelTitles.PRODUCT_ADS:
    case SpAdGroupLevelTitles.PRODUCT_ADS:
    case SbAdGroupLevelTitles.PRODUCT_ADS:
    case SdAdGroupLevelTitles.PRODUCT_ADS:
    case WalmartOverallAccountLevelTitles.AD_ITEMS:
    case WalmartSPAccountLevelTitles.AD_ITEMS:
    case WalmartSBAccountLevelTitles.AD_ITEMS:
    case WalmartSVAccountLevelTitles.AD_ITEMS:
    case WalmartSPCampaignLevelTitles.AD_ITEMS:
    case WalmartSBCampaignLevelTitles.AD_ITEMS:
    case WalmartSVCampaignLevelTitles.AD_ITEMS:
    case WalmartSPAdGroupLevelTitles.AD_ITEMS:
    case WalmartSBAdGroupLevelTitles.AD_ITEMS:
    case WalmartSVAdGroupLevelTitles.AD_ITEMS:
      return `/${AdvertisingTabRoutes.PRODUCT_ADS}`;

    case SpAccountLevelTitles.KEYWORD_TARGETING:
    case SbAccountLevelTitles.KEYWORD_TARGETING:
    case OverallAccountLevelTitles.KEYWORD_TARGETING:
    case SpCampaignLevelTitles.KEYWORD_TARGETING:
    case SbCampaignLevelTitles.KEYWORD_TARGETING:
    case SpAdGroupLevelTitles.KEYWORD_TARGETING:
    case SbAdGroupLevelTitles.KEYWORD_TARGETING:
    case WalmartSPAccountLevelTitles.KEYWORD_TARGETING:
    case WalmartSBAccountLevelTitles.KEYWORD_TARGETING:
    case WalmartSVAccountLevelTitles.KEYWORD_TARGETING:
    case WalmartOverallAccountLevelTitles.KEYWORD_TARGETING:
    case WalmartSPCampaignLevelTitles.KEYWORD_TARGETING:
    case WalmartSBCampaignLevelTitles.KEYWORD_TARGETING:
    case WalmartSVCampaignLevelTitles.KEYWORD_TARGETING:
    case WalmartSPAdGroupLevelTitles.KEYWORD_TARGETING:
    case WalmartSBAdGroupLevelTitles.KEYWORD_TARGETING:
    case WalmartSVAdGroupLevelTitles.KEYWORD_TARGETING:
      return `/${AdvertisingTabRoutes.KEYWORD_TARGETING}`;

    case SpAccountLevelTitles.PRODUCT_TARGETING:
    case SbAccountLevelTitles.PRODUCT_TARGETING:
    case OverallAccountLevelTitles.PRODUCT_TARGETING:
    case SpCampaignLevelTitles.PRODUCT_TARGETING:
    case SbCampaignLevelTitles.PRODUCT_TARGETING:
    case SpAdGroupLevelTitles.PRODUCT_TARGETING:
    case SbAdGroupLevelTitles.PRODUCT_TARGETING:
      return `/${AdvertisingTabRoutes.PRODUCT_TARGETING}`;

    case SpAccountLevelTitles.AUTO_TARGETING:
    case SpCampaignLevelTitles.AUTO_TARGETING:
    case SpAdGroupLevelTitles.TARGETING:
      return `/${AdvertisingTabRoutes.AUTO_TARGETING}`;

    case SbCampaignLevelTitles.TARGETING:
    case SbAdGroupLevelTitles.TARGETING:
    case SdCampaignLevelTitles.TARGETING:
    case SdAdGroupLevelTitles.TARGETING:
      return `/${AdvertisingTabRoutes.TARGETING}`;

    case SpAccountLevelTitles.PLACEMENT:
    case SpCampaignLevelTitles.PLACEMENT:
      return `/${AdvertisingTabRoutes.PLACEMENT}`;

    case WalmartSPAccountLevelTitles.PAGE_TYPE:
    case WalmartSBAccountLevelTitles.PAGE_TYPE:
    case WalmartOverallAccountLevelTitles.PAGE_TYPE:
    case WalmartSVAccountLevelTitles.PAGE_TYPE:
    case WalmartSPCampaignLevelTitles.PAGE_TYPE:
    case WalmartSBCampaignLevelTitles.PAGE_TYPE:
    case WalmartSVCampaignLevelTitles.PAGE_TYPE:
      return `/${AdvertisingTabRoutes.PAGE_TYPE}`;

    case WalmartOverallAccountLevelTitles.PLATFORM:
    case WalmartSBAccountLevelTitles.PLATFORM:
    case WalmartSPAccountLevelTitles.PLATFORM:
    case WalmartSVAccountLevelTitles.PLATFORM:
    case WalmartSPCampaignLevelTitles.PLATFORM:
    case WalmartSBCampaignLevelTitles.PLATFORM:
    case WalmartSVCampaignLevelTitles.PLATFORM:
      return `/${AdvertisingTabRoutes.PLATFORM}`;

    case OverallAccountLevelTitles.SEARCH_TERM:
    case SpAccountLevelTitles.SEARCH_TERM:
    case SpCampaignLevelTitles.SEARCH_TERM:
    case SpAdGroupLevelTitles.SEARCH_TERM:
    case SbAccountLevelTitles.SEARCH_TERM:
    case SbCampaignLevelTitles.SEARCH_TERM_KEYWORD:
    case SbAdGroupLevelTitles.SEARCH_TERM_KEYWORD:
    case WalmartSPAccountLevelTitles.SEARCH_TERM:
    case WalmartSPCampaignLevelTitles.SEARCH_TERM:
    case WalmartSPAdGroupLevelTitles.SEARCH_TERM:
    case WalmartSBAccountLevelTitles.SEARCH_TERM:
    case WalmartSBCampaignLevelTitles.SEARCH_TERM:
    case WalmartSBAdGroupLevelTitles.SEARCH_TERM:
    case WalmartSVAccountLevelTitles.SEARCH_TERM:
    case WalmartSVCampaignLevelTitles.SEARCH_TERM:
    case WalmartSVAdGroupLevelTitles.SEARCH_TERM:
    case WalmartOverallAccountLevelTitles.SEARCH_TERM:
      return `/${AdvertisingTabRoutes.SEARCH_TERM}`;

    case SpCampaignLevelTitles.NEG_TARGETING:
    case SpAdGroupLevelTitles.NEG_TARGETING:
    case SbCampaignLevelTitles.NEG_TARGETING:
    case SbAdGroupLevelTitles.NEG_TARGETING:
      return `/${AdvertisingTabRoutes.NEG_TARGETING}`;

    case SpCampaignLevelTitles.NEG_TARGETING_KEYWORD:
    case SpAdGroupLevelTitles.NEG_TARGETING_KEYWORD:
    case SbCampaignLevelTitles.NEG_TARGETING_KEYWORD:
    case SbAdGroupLevelTitles.NEG_TARGETING_KEYWORD:
      return `/${AdvertisingTabRoutes.NEG_TARGETING_KEYWORD}`;

    case SpCampaignLevelTitles.NEG_TARGETING_PRODUCT:
    case SpAdGroupLevelTitles.NEG_TARGETING_PRODUCT:
    case SbCampaignLevelTitles.NEG_TARGETING_PRODUCT:
    case SbAdGroupLevelTitles.NEG_TARGETING_PRODUCT:
      return `/${AdvertisingTabRoutes.NEG_TARGETING_PRODUCT}`;

    case SpCampaignLevelTitles.HISTORY:
    case SpAdGroupLevelTitles.HISTORY:
    case SbCampaignLevelTitles.HISTORY:
    case SdCampaignLevelTitles.HISTORY:
    case SdAdGroupLevelTitles.HISTORY:
      return `/${AdvertisingTabRoutes.HISTORY}`;

    case SdAdGroupLevelTitles.CREATIVE:
      return `/${AdvertisingTabRoutes.CREATIVE}`;

    case SdAccountLevelTitles.AUDIENCE:
      return `/${AdvertisingTabRoutes.AUDIENCE}`;

    case SdAccountLevelTitles.CONTEXTUAL_TARGETING:
      return `/${AdvertisingTabRoutes.CONTEXTUAL_TARGETING}`;

    case WalmartSBCampaignLevelTitles.BRANDS:
      return `/${AdvertisingTabRoutes.BRANDS}`;

    case SpCampaignLevelTitles.AUTOMATION_RULES:
    case SbCampaignLevelTitles.AUTOMATION_RULES:
    case SdCampaignLevelTitles.AUTOMATION_RULES:
    case WalmartSPCampaignLevelTitles.AUTOMATION_RULES:
    case WalmartSBCampaignLevelTitles.AUTOMATION_RULES:
    case WalmartSVCampaignLevelTitles.AUTOMATION_RULES:
      return `/${AdvertisingTabRoutes.AUTOMATION_RULES}`;

    default:
      return '/';
  }
};

export const getAdvertisingRoutingURL = (
  navTitle: string,
  adType: string,
  marketplace: string,
  campaignId?: string,
  adGroupId?: string
) => {
  if (campaignId && adGroupId) {
    return `${getAdGroupUrl(
      campaignId,
      adGroupId,
      getAdTypePath(adType),
      getMarketplacePath(marketplace)
    )}${getAdvertisingTableURI(navTitle as AdvertisingTitlesEnum)}`;
  }

  if (campaignId) {
    return `${getCampaignUrl(
      campaignId,
      getAdTypePath(adType),
      getMarketplacePath(marketplace)
    )}${getAdvertisingTableURI(navTitle as AdvertisingTitlesEnum)}`;
  }

  return `${getAdvertisingUrl(
    getMarketplacePath(marketplace),
    getAdTypePath(adType)
  )}${getAdvertisingTableURI(navTitle as AdvertisingTitlesEnum)}`;
};

export const getSelectedNavTab = (
  navTabOptions: IAdvertisingNavigationBarOption[],
  selectedNavTitle: AdvertisingTitlesEnum
): IAdvertisingNavigationBarOption => {
  const selectedNavTab = navTabOptions.filter((option) => {
    if (option.value === selectedNavTitle) {
      return option;
    } else {
      const subOption = option.options.filter(
        (subOption) => subOption.value === selectedNavTitle
      );
      return subOption[0];
    }
  });

  if (!selectedNavTab.length) return navTabOptions[0];
  else return selectedNavTab[0];
};

export const getComparisonDetails = (
  initialState:
    | ISPAdvertisingData[]
    | ISBAdvertisingData[]
    | ISDAdvertisingData[]
    | IOverallAdvertisingData[]
    | IWalmartSPAdvertisingData[]
    | IWalmartSBAdvertisingData[]
    | IWalmartSVAdvertisingData[]
    | IWalmartOverallAdvertisingData[],
  editState:
    | ISPAdvertisingData[]
    | ISBAdvertisingData[]
    | ISDAdvertisingData[]
    | IOverallAdvertisingData[]
    | IWalmartSPAdvertisingData[]
    | IWalmartSBAdvertisingData[]
    | IWalmartSVAdvertisingData[]
    | IWalmartOverallAdvertisingData[]
) => {
  const comparedRows = getTableUpdateDetails(
    initialState as unknown as Record<string, unknown>[],
    editState as unknown as Record<string, unknown>[]
  );

  return comparedRows;
};
export const getPrefixBasedOnActionType = (type: string, value: any) => {
  switch (type) {
    case ActionTypesEnum.CAMPAIGN_NAME:
    case ActionTypesEnum.PLACEMENT_BIDDING:
    case ActionTypesEnum.STATE:
    case ActionTypesEnum.STATUS:
    case ActionTypesEnum.NAME:
    case ActionTypesEnum.PLATFORM_TYPE:
    case ActionTypesEnum.PLACEMENT_TYPE:
    case ActionTypesEnum.STRATEGY:
      return getTitleCaseString(value);
    case ActionTypesEnum.TYPE:
      return value.toUpperCase();
    case ActionTypesEnum.END_DATE:
      return getUSFormatDate(value);

    default:
      return isNaN(Number(value))
        ? value
        : displayValue(formatNum(value), false);
  }
};

export const processStoredAdvertisingFilters = (
  storedDateRange: IDateRangeFilter,
  currentRangeOptions: IDropdownItem<Range>[],
  storedFrequency: IDropdownItem<string>
): IAdvertisingFilterForm => {
  if (storedDateRange && storedDateRange.startDate && storedDateRange.endDate) {
    return {
      range: customRangeFilterOption,
      customDateRange: {
        startDate: storedDateRange.startDate,
        endDate: storedDateRange.endDate,
      },
      frequency: storedFrequency,
    };
  }

  const selectedRange = currentRangeOptions.find(
    (item) => item.value === storedDateRange.label
  );

  return selectedRange && selectedRange.isDisabled === false
    ? {
        frequency: storedFrequency,
        range: selectedRange,
        customDateRange: {
          startDate: '',
          endDate: '',
        },
      }
    : {
        frequency: storedFrequency,
        range: range[2],
        customDateRange: {
          startDate: '',
          endDate: '',
        },
      };
};

export const checkCampaignManagerLocationPathValidity = (
  pathname: string
): boolean => {
  if (!pathname.startsWith('/advertising/campaign-manager')) return false;

  const pathArray = pathname.split('/');
  const validPathArrayLengths = new Set([6, 8, 10]);

  if (!validPathArrayLengths.has(pathArray.length)) return false;

  return true;
};

export const getAdvertisingNavTitleFromPathname = (
  pathname: string | null | undefined
): string => {
  if (
    !pathname ||
    typeof pathname !== 'string' ||
    !checkCampaignManagerLocationPathValidity(pathname)
  )
    return '';

  const pathArray = pathname.split('/');
  const marketplace = pathArray[3];
  const adType = pathArray[4];

  if (!marketplace || !adType) return '';

  if (marketplace === MarketplaceEnum.AMAZON) {
    if (adType.toUpperCase() === AdTypeShort.SPONSORED_PRODUCTS) {
      if (pathArray.length === 8) {
        // campaign level
        const tabValue = pathArray[7];

        if (tabValue === AdvertisingTabRoutes.AD_GROUP)
          return SpCampaignLevelTitles.AD_GROUPS;
        if (tabValue === AdvertisingTabRoutes.AUTO_TARGETING)
          return SpCampaignLevelTitles.AUTO_TARGETING;
        if (tabValue === AdvertisingTabRoutes.KEYWORD_TARGETING)
          return SpCampaignLevelTitles.KEYWORD_TARGETING;
        if (tabValue === AdvertisingTabRoutes.NEG_TARGETING_KEYWORD)
          return SpCampaignLevelTitles.NEG_TARGETING_KEYWORD;
        if (tabValue === AdvertisingTabRoutes.NEG_TARGETING_PRODUCT)
          return SpCampaignLevelTitles.NEG_TARGETING_PRODUCT;
        if (tabValue === AdvertisingTabRoutes.PLACEMENT)
          return SpCampaignLevelTitles.PLACEMENT;
        if (tabValue === AdvertisingTabRoutes.PRODUCT_ADS)
          return SpCampaignLevelTitles.PRODUCT_ADS;
        if (tabValue === AdvertisingTabRoutes.PRODUCT_TARGETING)
          return SpCampaignLevelTitles.PRODUCT_TARGETING;
        if (tabValue === AdvertisingTabRoutes.SEARCH_TERM)
          return SpCampaignLevelTitles.SEARCH_TERM;
        if (tabValue === AdvertisingTabRoutes.AUTOMATION_RULES)
          return SpCampaignLevelTitles.AUTOMATION_RULES;

        return SpCampaignLevelTitles.AD_GROUPS;
      } else if (pathArray.length === 10) {
        // ad-group level
        const tabValue = pathArray[9];

        if (tabValue === AdvertisingTabRoutes.PRODUCT_ADS)
          return SpAdGroupLevelTitles.PRODUCT_ADS;
        if (tabValue === AdvertisingTabRoutes.PRODUCT_TARGETING)
          return SpAdGroupLevelTitles.PRODUCT_TARGETING;
        if (tabValue === AdvertisingTabRoutes.AUTO_TARGETING)
          return SpAdGroupLevelTitles.TARGETING;
        if (tabValue === AdvertisingTabRoutes.KEYWORD_TARGETING)
          return SpAdGroupLevelTitles.KEYWORD_TARGETING;
        if (tabValue === AdvertisingTabRoutes.NEG_TARGETING_KEYWORD)
          return SpAdGroupLevelTitles.NEG_TARGETING_KEYWORD;
        if (tabValue === AdvertisingTabRoutes.NEG_TARGETING_PRODUCT)
          return SpAdGroupLevelTitles.NEG_TARGETING_PRODUCT;
        if (tabValue === AdvertisingTabRoutes.SEARCH_TERM)
          return SpAdGroupLevelTitles.SEARCH_TERM;

        return SpAdGroupLevelTitles.PRODUCT_ADS;
      } else {
        // account level
        const tabValue = pathArray[5];

        if (tabValue === AdvertisingTabRoutes.CAMPAIGN)
          return SpAccountLevelTitles.CAMPAIGNS;
        if (tabValue === AdvertisingTabRoutes.AD_GROUP)
          return SpAccountLevelTitles.AD_GROUPS;
        if (tabValue === AdvertisingTabRoutes.PRODUCT_ADS)
          return SpAccountLevelTitles.PRODUCT_ADS;
        if (tabValue === AdvertisingTabRoutes.KEYWORD_TARGETING)
          return SpAccountLevelTitles.KEYWORD_TARGETING;
        if (tabValue === AdvertisingTabRoutes.PRODUCT_TARGETING)
          return SpAccountLevelTitles.PRODUCT_TARGETING;
        if (tabValue === AdvertisingTabRoutes.AUTO_TARGETING)
          return SpAccountLevelTitles.AUTO_TARGETING;
        if (tabValue === AdvertisingTabRoutes.SEARCH_TERM)
          return SpAccountLevelTitles.SEARCH_TERM;
        if (tabValue === AdvertisingTabRoutes.PLACEMENT)
          return SpAccountLevelTitles.PLACEMENT;

        return SpAccountLevelTitles.CAMPAIGNS;
      }
    } else if (adType.toUpperCase() === AdTypeShort.SPONSORED_BRANDS) {
      if (pathArray.length === 8) {
        // campaign level
        const tabValue = pathArray[7];

        if (tabValue === AdvertisingTabRoutes.AD_GROUP)
          return SbCampaignLevelTitles.AD_GROUP;
        if (tabValue === AdvertisingTabRoutes.PRODUCT_ADS)
          return SbCampaignLevelTitles.PRODUCT_ADS;
        if (tabValue === AdvertisingTabRoutes.KEYWORD_TARGETING)
          return SbCampaignLevelTitles.KEYWORD_TARGETING;
        if (tabValue === AdvertisingTabRoutes.PRODUCT_TARGETING)
          return SbCampaignLevelTitles.PRODUCT_TARGETING;
        if (tabValue === AdvertisingTabRoutes.SEARCH_TERM)
          return SbCampaignLevelTitles.SEARCH_TERM_KEYWORD;
        if (tabValue === AdvertisingTabRoutes.NEG_TARGETING_KEYWORD)
          return SbCampaignLevelTitles.NEG_TARGETING_KEYWORD;
        if (tabValue === AdvertisingTabRoutes.NEG_TARGETING_PRODUCT)
          return SbCampaignLevelTitles.NEG_TARGETING_PRODUCT;
        if (tabValue === AdvertisingTabRoutes.AUTOMATION_RULES)
          return SbCampaignLevelTitles.AUTOMATION_RULES;

        return SbCampaignLevelTitles.AD_GROUP;
      } else if (pathArray.length === 10) {
        // ad-group level
        const tabValue = pathArray[9];

        if (tabValue === AdvertisingTabRoutes.PRODUCT_ADS)
          return SbAdGroupLevelTitles.PRODUCT_ADS;
        if (tabValue === AdvertisingTabRoutes.KEYWORD_TARGETING)
          return SbAdGroupLevelTitles.KEYWORD_TARGETING;
        if (tabValue === AdvertisingTabRoutes.PRODUCT_TARGETING)
          return SbAdGroupLevelTitles.PRODUCT_TARGETING;
        if (tabValue === AdvertisingTabRoutes.SEARCH_TERM)
          return SbAdGroupLevelTitles.SEARCH_TERM_KEYWORD;
        if (tabValue === AdvertisingTabRoutes.NEG_TARGETING_KEYWORD)
          return SbAdGroupLevelTitles.NEG_TARGETING_KEYWORD;
        if (tabValue === AdvertisingTabRoutes.NEG_TARGETING_PRODUCT)
          return SbAdGroupLevelTitles.NEG_TARGETING_PRODUCT;

        return SbAdGroupLevelTitles.PRODUCT_ADS;
      } else {
        // account level
        const tabValue = pathArray[5];

        if (tabValue === AdvertisingTabRoutes.CAMPAIGN)
          return SbAccountLevelTitles.CAMPAIGNS;
        if (tabValue === AdvertisingTabRoutes.AD_GROUP)
          return SbAccountLevelTitles.AD_GROUP;
        if (tabValue === AdvertisingTabRoutes.PRODUCT_ADS)
          return SbAccountLevelTitles.PRODUCT_ADS;
        if (tabValue === AdvertisingTabRoutes.KEYWORD_TARGETING)
          return SbAccountLevelTitles.KEYWORD_TARGETING;
        if (tabValue === AdvertisingTabRoutes.PRODUCT_TARGETING)
          return SbAccountLevelTitles.PRODUCT_TARGETING;
        if (tabValue === AdvertisingTabRoutes.SEARCH_TERM)
          return SbAccountLevelTitles.SEARCH_TERM;

        return SbAccountLevelTitles.CAMPAIGNS;
      }
    } else if (adType.toUpperCase() === AdTypeShort.SPONSORED_DISPLAY) {
      if (pathArray.length === 8) {
        // campaign level
        const tabValue = pathArray[7];

        if (tabValue === AdvertisingTabRoutes.AD_GROUP)
          return SdCampaignLevelTitles.AD_GROUP;
        if (tabValue === AdvertisingTabRoutes.PRODUCT_ADS)
          return SdCampaignLevelTitles.PRODUCT_ADS;
        if (tabValue === AdvertisingTabRoutes.AUTOMATION_RULES)
          return SdCampaignLevelTitles.AUTOMATION_RULES;

        return SdCampaignLevelTitles.AD_GROUP;
      } else if (pathArray.length === 10) {
        // ad-group level
        const tabValue = pathArray[9];

        if (tabValue === AdvertisingTabRoutes.PRODUCT_ADS)
          return SdAdGroupLevelTitles.PRODUCT_ADS;
        if (tabValue === AdvertisingTabRoutes.CREATIVE)
          return SdAdGroupLevelTitles.CREATIVE;

        return SdAdGroupLevelTitles.PRODUCT_ADS;
      } else {
        // account level
        const tabValue = pathArray[5];

        if (tabValue === AdvertisingTabRoutes.CAMPAIGN)
          return SdAccountLevelTitles.CAMPAIGN;
        if (tabValue === AdvertisingTabRoutes.AD_GROUP)
          return SdAccountLevelTitles.AD_GROUP;
        if (tabValue === AdvertisingTabRoutes.PRODUCT_ADS)
          return SdAccountLevelTitles.PRODUCT_ADS;

        return SdAccountLevelTitles.CAMPAIGN;
      }
    } else {
      // overall - account level
      const tabValue = pathArray[5];

      if (tabValue === AdvertisingTabRoutes.CAMPAIGN)
        return OverallAccountLevelTitles.CAMPAIGNS;
      if (tabValue === AdvertisingTabRoutes.AD_GROUP)
        return OverallAccountLevelTitles.AD_GROUPS;
      if (tabValue === AdvertisingTabRoutes.PRODUCT_ADS)
        return OverallAccountLevelTitles.PRODUCT_ADS;
      if (tabValue === AdvertisingTabRoutes.KEYWORD_TARGETING)
        return OverallAccountLevelTitles.KEYWORD_TARGETING;
      if (tabValue === AdvertisingTabRoutes.PRODUCT_TARGETING)
        return OverallAccountLevelTitles.PRODUCT_TARGETING;
      if (tabValue === AdvertisingTabRoutes.SEARCH_TERM)
        return OverallAccountLevelTitles.SEARCH_TERM;

      return OverallAccountLevelTitles.CAMPAIGNS;
    }
  }

  if (marketplace === MarketplaceEnum.WALMART) {
    if (adType.toUpperCase() === AdTypeShort.SPONSORED_PRODUCTS) {
      if (pathArray.length === 8) {
        // campaign level
        const tabValue = pathArray[7];

        if (tabValue === AdvertisingTabRoutes.AD_GROUP)
          return WalmartSPCampaignLevelTitles.AD_GROUPS;
        if (tabValue === AdvertisingTabRoutes.PRODUCT_ADS)
          return WalmartSPCampaignLevelTitles.AD_ITEMS;
        if (tabValue === AdvertisingTabRoutes.KEYWORD_TARGETING)
          return WalmartSPCampaignLevelTitles.KEYWORD_TARGETING;
        if (tabValue === AdvertisingTabRoutes.SEARCH_TERM)
          return WalmartSPCampaignLevelTitles.SEARCH_TERM;
        if (tabValue === AdvertisingTabRoutes.PAGE_TYPE)
          return WalmartSPCampaignLevelTitles.PAGE_TYPE;
        if (tabValue === AdvertisingTabRoutes.PLATFORM)
          return WalmartSPCampaignLevelTitles.PLATFORM;
        if (tabValue === AdvertisingTabRoutes.AUTOMATION_RULES)
          return WalmartSPCampaignLevelTitles.AUTOMATION_RULES;

        return WalmartSPCampaignLevelTitles.AD_GROUPS;
      } else if (pathArray.length === 10) {
        // ad-group level
        const tabValue = pathArray[9];

        if (tabValue === AdvertisingTabRoutes.PRODUCT_ADS)
          return WalmartSPAdGroupLevelTitles.AD_ITEMS;
        if (tabValue === AdvertisingTabRoutes.KEYWORD_TARGETING)
          return WalmartSPAdGroupLevelTitles.KEYWORD_TARGETING;
        if (tabValue === AdvertisingTabRoutes.SEARCH_TERM)
          return WalmartSPAdGroupLevelTitles.SEARCH_TERM;

        return WalmartSPAdGroupLevelTitles.AD_ITEMS;
      } else {
        // account level
        const tabValue = pathArray[5];

        if (tabValue === AdvertisingTabRoutes.CAMPAIGN)
          return WalmartSPAccountLevelTitles.CAMPAIGNS;
        if (tabValue === AdvertisingTabRoutes.AD_GROUP)
          return WalmartSPAccountLevelTitles.AD_GROUPS;
        if (tabValue === AdvertisingTabRoutes.PRODUCT_ADS)
          return WalmartSPAccountLevelTitles.AD_ITEMS;
        if (tabValue === AdvertisingTabRoutes.KEYWORD_TARGETING)
          return WalmartSPAccountLevelTitles.KEYWORD_TARGETING;
        if (tabValue === AdvertisingTabRoutes.SEARCH_TERM)
          return WalmartSPAccountLevelTitles.SEARCH_TERM;
        if (tabValue === AdvertisingTabRoutes.PAGE_TYPE)
          return WalmartSPAccountLevelTitles.PAGE_TYPE;
        if (tabValue === AdvertisingTabRoutes.PLATFORM)
          return WalmartSPAccountLevelTitles.PLATFORM;

        return WalmartSPAccountLevelTitles.CAMPAIGNS;
      }
    } else if (adType.toUpperCase() === AdTypeShort.SPONSORED_BRANDS) {
      if (pathArray.length === 8) {
        // campaign level
        const tabValue = pathArray[7];

        if (tabValue === AdvertisingTabRoutes.AD_GROUP)
          return WalmartSBCampaignLevelTitles.AD_GROUPS;
        if (tabValue === AdvertisingTabRoutes.PRODUCT_ADS)
          return WalmartSBCampaignLevelTitles.AD_ITEMS;
        if (tabValue === AdvertisingTabRoutes.KEYWORD_TARGETING)
          return WalmartSBCampaignLevelTitles.KEYWORD_TARGETING;
        if (tabValue === AdvertisingTabRoutes.PAGE_TYPE)
          return WalmartSBCampaignLevelTitles.PAGE_TYPE;
        if (tabValue === AdvertisingTabRoutes.PLATFORM)
          return WalmartSBCampaignLevelTitles.PLATFORM;
        if (tabValue === AdvertisingTabRoutes.BRANDS)
          return WalmartSBCampaignLevelTitles.BRANDS;
        if (tabValue === AdvertisingTabRoutes.AUTOMATION_RULES)
          return WalmartSBCampaignLevelTitles.AUTOMATION_RULES;

        return WalmartSBCampaignLevelTitles.AD_GROUPS;
      } else if (pathArray.length === 10) {
        // ad-group level
        const tabValue = pathArray[9];

        if (tabValue === AdvertisingTabRoutes.PRODUCT_ADS)
          return WalmartSBAdGroupLevelTitles.AD_ITEMS;
        if (tabValue === AdvertisingTabRoutes.KEYWORD_TARGETING)
          return WalmartSBAdGroupLevelTitles.KEYWORD_TARGETING;

        return WalmartSBAdGroupLevelTitles.AD_ITEMS;
      } else {
        // account level
        const tabValue = pathArray[5];

        if (tabValue === AdvertisingTabRoutes.CAMPAIGN)
          return WalmartSBAccountLevelTitles.CAMPAIGNS;
        if (tabValue === AdvertisingTabRoutes.AD_GROUP)
          return WalmartSBAccountLevelTitles.AD_GROUPS;
        if (tabValue === AdvertisingTabRoutes.PRODUCT_ADS)
          return WalmartSBAccountLevelTitles.AD_ITEMS;
        if (tabValue === AdvertisingTabRoutes.KEYWORD_TARGETING)
          return WalmartSBAccountLevelTitles.KEYWORD_TARGETING;
        if (tabValue === AdvertisingTabRoutes.PAGE_TYPE)
          return WalmartSBAccountLevelTitles.PAGE_TYPE;
        if (tabValue === AdvertisingTabRoutes.PLATFORM)
          return WalmartSBAccountLevelTitles.PLATFORM;

        return WalmartSBAccountLevelTitles.CAMPAIGNS;
      }
    } else if (adType.toUpperCase() === AdTypeShort.SPONSORED_VIDEO) {
      if (pathArray.length === 8) {
        // campaign level
        const tabValue = pathArray[7];

        if (tabValue === AdvertisingTabRoutes.AD_GROUP)
          return WalmartSVCampaignLevelTitles.AD_GROUPS;
        if (tabValue === AdvertisingTabRoutes.PRODUCT_ADS)
          return WalmartSVCampaignLevelTitles.AD_ITEMS;
        if (tabValue === AdvertisingTabRoutes.KEYWORD_TARGETING)
          return WalmartSVCampaignLevelTitles.KEYWORD_TARGETING;
        if (tabValue === AdvertisingTabRoutes.PAGE_TYPE)
          return WalmartSVCampaignLevelTitles.PAGE_TYPE;
        if (tabValue === AdvertisingTabRoutes.PLATFORM)
          return WalmartSVCampaignLevelTitles.PLATFORM;
        if (tabValue === AdvertisingTabRoutes.AUTOMATION_RULES)
          return WalmartSVCampaignLevelTitles.AUTOMATION_RULES;

        return WalmartSVCampaignLevelTitles.AD_GROUPS;
      } else if (pathArray.length === 10) {
        // ad-group level
        const tabValue = pathArray[9];

        if (tabValue === AdvertisingTabRoutes.PRODUCT_ADS)
          return WalmartSVAdGroupLevelTitles.AD_ITEMS;
        if (tabValue === AdvertisingTabRoutes.KEYWORD_TARGETING)
          return WalmartSVAdGroupLevelTitles.KEYWORD_TARGETING;

        return WalmartSVAdGroupLevelTitles.AD_ITEMS;
      } else {
        // account level
        const tabValue = pathArray[5];

        if (tabValue === AdvertisingTabRoutes.CAMPAIGN)
          return WalmartSVAccountLevelTitles.CAMPAIGNS;
        if (tabValue === AdvertisingTabRoutes.AD_GROUP)
          return WalmartSVAccountLevelTitles.AD_GROUPS;
        if (tabValue === AdvertisingTabRoutes.PRODUCT_ADS)
          return WalmartSVAccountLevelTitles.AD_ITEMS;
        if (tabValue === AdvertisingTabRoutes.KEYWORD_TARGETING)
          return WalmartSVAccountLevelTitles.KEYWORD_TARGETING;
        if (tabValue === AdvertisingTabRoutes.PAGE_TYPE)
          return WalmartSVAccountLevelTitles.PAGE_TYPE;
        if (tabValue === AdvertisingTabRoutes.PLATFORM)
          return WalmartSVAccountLevelTitles.PLATFORM;

        return WalmartSVAccountLevelTitles.CAMPAIGNS;
      }
    } else {
      // overall - account level
      const tabValue = pathArray[5];

      if (tabValue === AdvertisingTabRoutes.CAMPAIGN)
        return WalmartOverallAccountLevelTitles.CAMPAIGNS;
      if (tabValue === AdvertisingTabRoutes.AD_GROUP)
        return WalmartOverallAccountLevelTitles.AD_GROUPS;
      if (tabValue === AdvertisingTabRoutes.PRODUCT_ADS)
        return WalmartOverallAccountLevelTitles.AD_ITEMS;
      if (tabValue === AdvertisingTabRoutes.KEYWORD_TARGETING)
        return WalmartOverallAccountLevelTitles.KEYWORD_TARGETING;
      if (tabValue === AdvertisingTabRoutes.SEARCH_TERM)
        return WalmartOverallAccountLevelTitles.SEARCH_TERM;
      if (tabValue === AdvertisingTabRoutes.PAGE_TYPE)
        return WalmartOverallAccountLevelTitles.PAGE_TYPE;
      if (tabValue === AdvertisingTabRoutes.PLATFORM)
        return WalmartOverallAccountLevelTitles.PLATFORM;

      return WalmartOverallAccountLevelTitles.CAMPAIGNS;
    }
  }

  return '';
};

export const getAdsEligibility = (eligibility: string | null | undefined) => {
  if (eligibility === undefined || eligibility === null) return '-';
  return formatStringToTitleCase(eligibility);
};

export const getBudgetFooterData = (
  selectedTitle: AdvertisingTitlesEnum,
  data: IPerformanceMetricsData | null | undefined,
  tableData: IOverallCampaign[]
) => {
  if (
    tableData &&
    tableData.length > 0 &&
    !checkIsNull(tableData[0].budget_sum) &&
    selectedTitle === OverallAccountLevelTitles.CAMPAIGNS
  ) {
    return {
      ...data,
      budget: tableData[0].budget_sum,
    };
  }
  return data as ITableFooterData;
};

export const checkIsNull = (value: any): value is null | undefined | '' => {
  if (typeof value === 'undefined' || value === undefined || value === null)
    return true;

  if (Array.isArray(value)) return value.length === 0;

  if (typeof value === 'object')
    return (
      isEmptyObject(value) ||
      Object.values(value).every(
        (value) => value === undefined || value === null
      )
    );

  if (typeof value === 'number') return Number.isNaN(value);

  return value === '' || value === null || value === undefined;
};

export const checkIsWalmartAdsConnected = (
  account?: IWalmartAdsAccount,
  advertiserId?: string
) => {
  if (!advertiserId || advertiserId === '') return false;
  if (account === undefined || account === null) return false;

  return Boolean(account && checkAPIAccessType(account));
};

export const checkAPIAccessType = (account: IWalmartAdsAccount) => {
  return (
    account.apiAccessType === WalmartAdAccountAPIAccessTypeEnum.WRITE ||
    account.apiAccessType === WalmartAdAccountAPIAccessTypeEnum.READ
  );
};

export const convertToSnakeCase = (str: string) => {
  return str.replace(/\s+/g, '_').toUpperCase();
};

export const getCreateWalmartPayload = (
  accountId: string,
  account: IWalmartAdsAccount | undefined
): IWalmartCreateAccount | null => {
  if (!account) return null;
  const payload: IWalmartCreateAccount = {
    accountId,
    walmartAdvertiserId: account.advertiserId,
    walmartAccountType:
      account.advertiserType.toUpperCase() as WalmartAccountTypeEnum,
    anarixId: convertToSnakeCase(account.advertiserName),
    brandName: account.advertiserName,
    sellerId: account.sellerId,
  };

  return payload;
};

export const getStatusBoxStatusByLevel = (
  status: string,
  selectedLevel: string,
  marketplace: string
) => {
  if (marketplace === MarketplaceEnum.WALMART) {
    if (selectedLevel === 'campaign-level') return status;
    else return getWalmartAdGroupStatus(status as WalmartAdGroupStatusEnum);
  }
  return status;
};

export const getNudgeNotificationTitle = (messageId: string) => {
  switch (messageId) {
    case NudgeNotificationHeaderEnum.MAX_BID_KEYWORDS:
      return NudgeNotificationTitleEnum.MAX_BID_KEYWORDS;
    case NudgeNotificationHeaderEnum.LESS_THAN_20_BUDGET_SPENT:
      return NudgeNotificationTitleEnum.LESS_THAN_20_BUDGET_SPENT;
    case NudgeNotificationHeaderEnum.LESS_THAN_50_BUDGET_SPENT:
      return NudgeNotificationTitleEnum.LESS_THAN_50_BUDGET_SPENT;
    case NudgeNotificationHeaderEnum.OUT_OF_BUDGET:
      return NudgeNotificationTitleEnum.OUT_OF_BUDGET;
    default:
      return '';
  }
};

export const getInStoreColumnsByAccountType = <T>(
  _initialColumns: Array<ColumnDef<T>>,
  accountType: string | undefined,
  inStoreColumns: Array<ColumnDef<T>>
): Array<ColumnDef<T>> => {
  if (accountType !== WalmartAccountTypeEnum.FIRST_PARTY)
    return _initialColumns;

  return [..._initialColumns, ...inStoreColumns];
};

export const checkReviewCampaignFlagEnabled = (
  adType: string | undefined,
  marketplace: string
): boolean => {
  if (marketplace === MarketplaceEnum.AMAZON || adType === undefined)
    return true;

  const isReviewFlagEnabled = REVIEW_FEATURE_FLAGS[adType];

  if (
    isReviewFlagEnabled === undefined ||
    isReviewFlagEnabled === null ||
    isReviewFlagEnabled.marketplace === MarketplaceEnum.AMAZON
  )
    return true;

  if (typeof isReviewFlagEnabled.campaignReviewEnabled !== 'boolean')
    return true;

  return isReviewFlagEnabled.campaignReviewEnabled;
};

export const getIsBidAutomationRequired = (
  title: AdvertisingTitlesEnum,
  targetingType: TargetingTypeEnum
) => {
  if (
    (title === WalmartSPCampaignLevelTitles.AD_ITEMS ||
      title === WalmartOverallAccountLevelTitles.AD_ITEMS ||
      title === WalmartSPAdGroupLevelTitles.AD_ITEMS) &&
    targetingType.toLowerCase() === TargetingTypeEnum.AUTO.toLowerCase()
  )
    return true;
  return IS_BID_AUTOMATION_REQUIRED[title] ?? false;
};

export const getAccountTypeDetailsByMarketplace = (
  marketplace: MarketplaceEnum,
  accountType: string
) => {
  if (
    marketplace === MarketplaceEnum.AMAZON &&
    accountType === AmazonAccountType.SELLER
  ) {
    return ['Seller', '3P'];
  } else if (
    marketplace === MarketplaceEnum.AMAZON &&
    accountType === AmazonAccountType.VENDOR
  ) {
    return ['Vendor', '1P'];
  } else if (
    marketplace === MarketplaceEnum.WALMART &&
    accountType === WalmartAccountTypeEnum.THIRD_PARTY
  ) {
    return ['Seller', '3P'];
  } else if (
    marketplace === MarketplaceEnum.WALMART &&
    accountType === WalmartAccountTypeEnum.FIRST_PARTY
  ) {
    return ['Supplier', '1P'];
  } else {
    return ['-', '-'];
  }
};

export const getDisconnectTextByAccountType = (accountType: string) => {
  return `If you disconnect your “${accountType} Catalog” account, you won’t be able to see the data anymore. Are you sure want to continue?`;
};

export const getAdvertisingTableMap = (tableState: IAdvertisingArrayData) => {
  const campaignTableMap = new Map<string, IAdvertisingTableInterfaces>();
  for (const row of tableState) {
    campaignTableMap.set(`${row.id}`, row);
  }

  return campaignTableMap;
};

export const getAdvertisingTableFromMap = (
  tableMap: Map<string, IAdvertisingTableInterfaces>
) => {
  return Array.from(tableMap.values());
};

export const getEditedTableValuesMap = (
  updatedValues: Map<any, any>,
  tableState: IAdvertisingArrayData
) => {
  const editStateMap = getAdvertisingTableMap(tableState);
  const editedValuesMap = new Map<string, any>();

  Array.from(updatedValues.keys()).forEach((key) => {
    const row = editStateMap.get(`${key}`);

    if (row !== undefined) {
      editedValuesMap.set(`${key}`, row);
    }
  });

  return editedValuesMap;
};

export const removeUnwantedColumns = <T>(
  initialColumns: Array<ColumnDef<T>>,
  columnsToRemove: ColumnNameEnum[] | AmazonCatalogColumnIdsEnum[]
) => {
  columnsToRemove.forEach((column) => {
    const idx = initialColumns.findIndex((tempCol) => tempCol.id === column);
    if (idx !== -1) initialColumns.splice(idx, 1);
  });
};

export const getSortedCampaignList = (campaigns: string[]) => {
  if (campaigns.length === 0) return [];
  return campaigns.sort((a, b) => a.localeCompare(b));
};

export const checkIsWalmartOverallTables = (
  selectedNavTitle: AdvertisingTitlesEnum
) => {
  return (
    selectedNavTitle === WalmartOverallAccountLevelTitles.CAMPAIGNS ||
    selectedNavTitle === WalmartOverallAccountLevelTitles.AD_GROUPS ||
    selectedNavTitle === WalmartOverallAccountLevelTitles.AD_ITEMS ||
    selectedNavTitle === WalmartOverallAccountLevelTitles.KEYWORD_TARGETING ||
    selectedNavTitle === WalmartOverallAccountLevelTitles.PAGE_TYPE ||
    selectedNavTitle === WalmartOverallAccountLevelTitles.PLATFORM
  );
};

export const getInitializedNavOptions = (
  navTabOptions: IAdvertisingNavigationBarOption[],
  hiddenValues: string[] = []
) => {
  return navTabOptions.map((option) => {
    if (hiddenValues.includes(option.value))
      return {
        ...option,
        isDisabled: true,
        isVisible: false,
      };
    return {
      ...option,
      isDisabled: true,
    };
  });
};

export const checkIsWalmartCampaign = (title: string): boolean => {
  const walmartCampaignTitles = [
    WalmartSPAccountLevelTitles.CAMPAIGNS,
    WalmartOverallAccountLevelTitles.CAMPAIGNS,
    WalmartSBAccountLevelTitles.CAMPAIGNS,
    WalmartSVAccountLevelTitles.CAMPAIGNS,
  ];

  return walmartCampaignTitles.includes(title as any);
};

export const checkIsWalmartKT = (title: string): boolean => {
  const walmartKTTitles = [
    WalmartOverallAccountLevelTitles.KEYWORD_TARGETING,
    WalmartSPAccountLevelTitles.KEYWORD_TARGETING,
    WalmartSBAccountLevelTitles.KEYWORD_TARGETING,
    WalmartSVAccountLevelTitles.KEYWORD_TARGETING,
    WalmartSPAdGroupLevelTitles.KEYWORD_TARGETING,
    WalmartSBAdGroupLevelTitles.KEYWORD_TARGETING,
    WalmartSVAdGroupLevelTitles.KEYWORD_TARGETING,
    WalmartSBCampaignLevelTitles.KEYWORD_TARGETING,
    WalmartSPCampaignLevelTitles.KEYWORD_TARGETING,
    WalmartSVCampaignLevelTitles.KEYWORD_TARGETING,
  ];

  return walmartKTTitles.includes(title as any);
};

export const updatePerformanceMetricsOptions = (
  currentOptions: IDropdownItem<string>[],
  newPayload: IDropdownItem<string>[]
): IDropdownItem<string>[] => {
  return getUniqueDropDownItems([...currentOptions, ...newPayload]);
};

export const getEntitySpecificString = (
  entityType: IEntityTypes
): { title: string; body: string } => {
  switch (entityType) {
    case AmazonAdvertisingTableTypesEnum.KEYWORD_TARGETING:
    case WalmartAdvertisingTableTypeEnum.KEYWORD:
      return { title: 'Keyword', body: 'keyword' };

    case AmazonAdvertisingTableTypesEnum.PRODUCT_TARGETING:
    case AmazonAdvertisingTableTypesEnum.PRODUCT_ADS:
    case WalmartAdvertisingTableTypeEnum.AD_ITEM:
      return { title: 'Product', body: 'product' };

    case AmazonAdvertisingTableTypesEnum.NEGATIVE_TARGETING_KEYWORD:
      return {
        title: 'Negative Keyword',
        body: 'keyword',
      };

    case AmazonAdvertisingTableTypesEnum.NEGATIVE_TARGETING_PRODUCT:
      return {
        title: 'Negative Product',
        body: 'product',
      };

    default:
      return { title: '', body: '' };
  }
};

export const getImpactAnalysisTableFromAdvTable = (table?: string) => {
  switch (table) {
    case OverallAccountLevelTitles.AD_GROUPS:
    case SpAccountLevelTitles.AD_GROUPS:
    case SbAccountLevelTitles.AD_GROUP:
    case SdAccountLevelTitles.AD_GROUP:
    case AmazonAdvertisingTableTypesEnum.AD_GROUP:
      return ImpactAnalysisTableTitles.AD_GROUP;
    case OverallAccountLevelTitles.CAMPAIGNS:
    case SpAccountLevelTitles.CAMPAIGNS:
    case SbAccountLevelTitles.CAMPAIGNS:
    case SdAccountLevelTitles.CAMPAIGN:
    case AmazonAdvertisingTableTypesEnum.CAMPAIGN:
      return ImpactAnalysisTableTitles.CAMPAIGN;
    case OverallAccountLevelTitles.KEYWORD_TARGETING:
    case SpAccountLevelTitles.KEYWORD_TARGETING:
    case SbAccountLevelTitles.KEYWORD_TARGETING:
    case AmazonAdvertisingTableTypesEnum.KEYWORD:
      return ImpactAnalysisTableTitles.KEYWORDS;
    case OverallAccountLevelTitles.PRODUCT_ADS:
    case SpAccountLevelTitles.PRODUCT_ADS:
    case SbAccountLevelTitles.PRODUCT_ADS:
    case SdAccountLevelTitles.PRODUCT_ADS:
    case AmazonAdvertisingTableTypesEnum.PRODUCT:
      return ImpactAnalysisTableTitles.PRODUCT_ADS;
    default:
      return ImpactAnalysisTableTitles.CAMPAIGN;
  }
};

export const checkIsLOGOItem = (rowData: any | null | undefined) => {
  if (rowData === null || rowData === undefined) return false;

  return 'itemId' in rowData && rowData.itemId === LOGO_ITEM_ID;
};

export const checkIsStatusUnchecked = (row: any): boolean => {
  return (
    row?.status?.toUpperCase() === CampaignStateEnum.PAUSED ||
    row?.status?.toLowerCase() ===
      WalmartCampaignStatusEnum.PAUSED.toLowerCase() ||
    row?.status?.toLowerCase() ===
      WalmartCampaignStatusEnum.DISABLED.toLowerCase()
  );
};

export const checkIsEditDisabledByReviewStatus = (
  marketplace: string,
  currentRowData: IAdvertisingInterfaces,
  isCampaign = false
): boolean => {
  if (marketplace === MarketplaceEnum.WALMART && currentRowData) {
    return checkIsEditDisableByReviewStatus(currentRowData, isCampaign);
  }

  return false;
};

export const getErrorEditState = (
  initialStateTableData: IAdvertisingArrayData,
  errors: IErrorMessageDetails | null
): IAdvertisingArrayData => {
  if (!errors) return initialStateTableData;

  const { errorList, editedRows } = errors;
  const editStateMap = getAdvertisingTableMap(initialStateTableData);

  const invalidRows: RowSelectionState = Object.fromEntries(
    errorList.map((error) => [error.metaId, true])
  );
  const invalidRowIds = Object.keys(invalidRows);

  for (const rowId of invalidRowIds) {
    const currEditStateRow = editStateMap.get(`${rowId}`);
    const currRejectedEditRow = editedRows.find(
      (row) => `${row.id}` === `${rowId}`
    );

    if (currEditStateRow && currRejectedEditRow) {
      const filteredCurrRejectedEditRow = Object.fromEntries(
        Object.entries(currRejectedEditRow).filter(
          ([key]) => !EDIT_ACCESS_OMIT_KEYS.includes(key)
        )
      );
      editStateMap.set(`${rowId}`, {
        ...currEditStateRow,
        ...filteredCurrRejectedEditRow,
      });
    } else {
      continue;
    }
  }

  return Array.from(editStateMap.values()) as IAdvertisingArrayData;
};

export const getPartialErrorDetailsFromMultiApiResponses = (
  rejected: PromiseRejectedResult[] | undefined
): IErrorMessageDetails | null => {
  if (!rejected) return null;

  const partialErrorResponses = rejected.filter((rej) => {
    const reason = rej?.reason as AxiosError;
    const responseData = reason?.response?.data as
      | IAPIResponse<IErrorResultDetails>
      | undefined;

    return (
      reason?.status === 207 && responseData && responseData.data.errorCount > 0
    );
  });

  const { partialErrorResponseList, payloadList } =
    partialErrorResponses.reduce<{
      partialErrorResponseList: IParsedError[];
      payloadList: any[];
    }>(
      (acc, errRes) => {
        const reason = errRes?.reason as AxiosError<
          IAPIResponse<IErrorResultDetails>
        >;
        const errors = reason?.response?.data?.data.errors ?? [];

        if (errors.length) acc.partialErrorResponseList.push(...errors);

        if (reason?.config?.data) {
          const payload = JSON.parse(reason?.config?.data) ?? [];
          if (payload && payload.length) acc.payloadList.push(...payload);
        }

        return acc;
      },
      {
        partialErrorResponseList: [] as IParsedError[],
        payloadList: [] as any[],
      }
    );

  return {
    errorList: partialErrorResponseList,
    editedRows: payloadList,
  };
};

export const getDownloadIconColor = (
  isDownloading: boolean,
  isDisabled: boolean,
  iconColor?: string,
  iconButton?: boolean
): string => {
  if (isDownloading === true || isDisabled === true) {
    return '#ddd';
  }
  if (iconColor) {
    return iconColor;
  }
  if (iconButton) {
    return '#fff';
  }
  return '#464646';
};

export const checkAreMetricsPresent = (
  performanceFilter: IPerformanceMetricsOptions,
  metrics: IDropdownItem<string>[]
) => {
  return metrics.every(
    (metric) =>
      performanceFilter.metrics1.some((m) => m.value === metric.value) ||
      performanceFilter.metrics2.some((m) => m.value === metric.value) ||
      performanceFilter.metrics3.some((m) => m.value === metric.value) ||
      performanceFilter.metrics4.some((m) => m.value === metric.value)
  );
};

export const getMetaIdAndMetaType = (): IAdvertisingPayloadDetails => {
  const selectedAdvertisingAccount =
    localStorageUtils.getSelectedAdvertisingAccount();

  if (selectedAdvertisingAccount?.marketplace === MarketplaceEnum.AMAZON)
    return {
      metaId: selectedAdvertisingAccount.advertising?.amazonProfileId ?? '',
      metaType: MetaTypeEnum.AMAZON_PROFILE_ID,
      marketplace: MarketplaceEnum.AMAZON,
    };

  return {
    metaId: selectedAdvertisingAccount?.advertising?.walmartAdvertiserId ?? '',
    metaType: MetaTypeEnum.WALMART_ADVERTISING_ID,
    marketplace: MarketplaceEnum.WALMART,
  };
};

export const getAccountPayloadDetails = (): IAccountPayloadDetails => {
  const accountId = localStorageUtils.getAccountId();

  return {
    ...getMetaIdAndMetaType(),
    accountId,
  };
};

export const disableViewEditToggle = (
  selectedAdvertisingNavTitle: AdvertisingTitlesEnum,
  selectedCampaign?:
    | IWalmartCampaign
    | ICampaign
    | ISBCampaign
    | ISDCampaign
    | IWalmartSVCampaign
    | null
) => {
  if (
    (selectedAdvertisingNavTitle === SpCampaignLevelTitles.AUTOMATION_RULES ||
      selectedAdvertisingNavTitle === SbCampaignLevelTitles.AUTOMATION_RULES ||
      selectedAdvertisingNavTitle === SdCampaignLevelTitles.AUTOMATION_RULES ||
      selectedAdvertisingNavTitle ===
        WalmartSPCampaignLevelTitles.AUTOMATION_RULES ||
      selectedAdvertisingNavTitle ===
        WalmartSBCampaignLevelTitles.AUTOMATION_RULES ||
      selectedAdvertisingNavTitle ===
        WalmartSVCampaignLevelTitles.AUTOMATION_RULES) &&
    selectedCampaign &&
    (!selectedCampaign.automationStatus ||
      selectedCampaign.automationStatus === RuleAutomationStatusEnum.PAUSED)
  ) {
    return true;
  }

  return false;
};

export const removeFrequencyFromAdvFilters = (
  advFilters: IAdvertisingFilterForm | IAdvertisingFilter
): Omit<IAdvertisingFilterForm | IAdvertisingFilter, 'frequency'>[] =>
  removeKeysFromArrayOfObjects([advFilters], ['frequency']);

export const getIsTaggingEditable = (selectedNav: AdvertisingTitlesEnum) => {
  switch (selectedNav) {
    case WalmartSPAccountLevelTitles.CAMPAIGNS:
    case WalmartSBAccountLevelTitles.CAMPAIGNS:
    case WalmartSVAccountLevelTitles.CAMPAIGNS:
    case WalmartOverallAccountLevelTitles.CAMPAIGNS:
    case SpAccountLevelTitles.CAMPAIGNS:
    case SbAccountLevelTitles.CAMPAIGNS:
    case SdAccountLevelTitles.CAMPAIGN:
    case OverallAccountLevelTitles.CAMPAIGNS:
      return true;

    default:
      return false;
  }
};

export const checkIsCampaignActiveForEdit = (
  endDate: string | undefined | null
) => {
  if (!endDate) return true;

  return (
    new Date(endDate).getTime() >
    new Date(getCurrentDateTime().split('_')[0]).getTime()
  );
};

export const checkIsActiveBulkActionVisible = (
  context: IBulkActionContext
): boolean =>
  context.title !== WalmartSPAccountLevelTitles.PAGE_TYPE &&
  context.title !== WalmartSPAccountLevelTitles.PLATFORM &&
  context.title !== WalmartSPCampaignLevelTitles.PAGE_TYPE &&
  context.title !== WalmartSPCampaignLevelTitles.PLATFORM &&
  context.title !== WalmartOverallAccountLevelTitles.PAGE_TYPE &&
  context.title !== WalmartOverallAccountLevelTitles.PLATFORM;

export const checkIsPauseBulkActionVisible = (
  context: IBulkActionContext
): boolean =>
  checkIsActiveBulkActionVisible(context) &&
  context.title !== SbAdGroupLevelTitles.NEG_TARGETING_KEYWORD &&
  context.title !== SbCampaignLevelTitles.NEG_TARGETING_KEYWORD;

export const checkIsEndDateBulkActionVisible = (
  context: IBulkActionContext
): boolean =>
  context.title === SpAccountLevelTitles.CAMPAIGNS ||
  context.title === SbAccountLevelTitles.CAMPAIGNS ||
  context.title === SdAccountLevelTitles.CAMPAIGN ||
  context.title === WalmartSPAccountLevelTitles.CAMPAIGNS ||
  context.title === WalmartSBAccountLevelTitles.CAMPAIGNS ||
  context.title === WalmartSVAccountLevelTitles.CAMPAIGNS ||
  context.title === WalmartOverallAccountLevelTitles.CAMPAIGNS;

export const checkIsBiddingStrategyBulkActionVisible = (
  context: IBulkActionContext
): boolean => context.title === SpAccountLevelTitles.CAMPAIGNS;

export const checkIsBudgetBulkActionVisible = (
  context: IBulkActionContext
): boolean =>
  context.title === SpAccountLevelTitles.CAMPAIGNS ||
  context.title === SbAccountLevelTitles.CAMPAIGNS ||
  context.title === SdAccountLevelTitles.CAMPAIGN;

export const checkIsWalmartBudgetBulkActionVisible = (
  context: IBulkActionContext
): boolean =>
  context.title === WalmartSPAccountLevelTitles.CAMPAIGNS ||
  context.title === WalmartSBAccountLevelTitles.CAMPAIGNS ||
  context.title === WalmartSVAccountLevelTitles.CAMPAIGNS ||
  context.title === WalmartOverallAccountLevelTitles.CAMPAIGNS;

export const checkIsDefaultBidBulkActionVisible = (
  context: IBulkActionContext
): boolean =>
  context.title === SpAccountLevelTitles.AD_GROUPS ||
  context.title === SpCampaignLevelTitles.AD_GROUPS ||
  context.title === SdAccountLevelTitles.AD_GROUP ||
  context.title === SdCampaignLevelTitles.AD_GROUP;

export const checkIsWalmartKeywordBidBulkActionVisible = (
  context: IBulkActionContext
): boolean =>
  context.title === WalmartSPAccountLevelTitles.KEYWORD_TARGETING ||
  context.title === WalmartSBAccountLevelTitles.KEYWORD_TARGETING ||
  context.title === WalmartSVAccountLevelTitles.KEYWORD_TARGETING ||
  context.title === WalmartSPCampaignLevelTitles.KEYWORD_TARGETING ||
  context.title === WalmartSBCampaignLevelTitles.KEYWORD_TARGETING ||
  context.title === WalmartSVCampaignLevelTitles.KEYWORD_TARGETING ||
  context.title === WalmartSPAdGroupLevelTitles.KEYWORD_TARGETING ||
  context.title === WalmartSBAdGroupLevelTitles.KEYWORD_TARGETING ||
  context.title === WalmartSVAdGroupLevelTitles.KEYWORD_TARGETING ||
  context.title === WalmartOverallAccountLevelTitles.KEYWORD_TARGETING;

export const checkIsWalmartAdItemBidBulkActionVisible = (
  context: IBulkActionContext
): boolean =>
  context.title === WalmartOverallAccountLevelTitles.AD_ITEMS ||
  context.title === WalmartSPAccountLevelTitles.AD_ITEMS ||
  ((context.title === WalmartSPCampaignLevelTitles.AD_ITEMS ||
    context.title === WalmartSPAdGroupLevelTitles.AD_ITEMS) &&
    context.selectedTargetingType?.toLowerCase() ===
      TargetingTypeEnum.AUTO.toLowerCase());

export const checkIsPageTypeBidMultiplierBulkActionVisible = (
  context: IBulkActionContext
): boolean =>
  context.title === WalmartSPAccountLevelTitles.PAGE_TYPE ||
  context.title === WalmartSPCampaignLevelTitles.PAGE_TYPE ||
  context.title === WalmartOverallAccountLevelTitles.PAGE_TYPE;

export const checkIsPlatformBidMultiplierBulkActionVisible = (
  context: IBulkActionContext
): boolean =>
  context.title === WalmartSPAccountLevelTitles.PLATFORM ||
  context.title === WalmartSPCampaignLevelTitles.PLATFORM ||
  context.title === WalmartOverallAccountLevelTitles.PLATFORM;

export const checkIsBidBulkActionVisible = (
  context: IBulkActionContext
): boolean =>
  context.title === SpAccountLevelTitles.KEYWORD_TARGETING ||
  context.title === SpAccountLevelTitles.PRODUCT_TARGETING ||
  context.title === SpAccountLevelTitles.AUTO_TARGETING ||
  context.title === SpCampaignLevelTitles.AUTO_TARGETING ||
  context.title === SpCampaignLevelTitles.KEYWORD_TARGETING ||
  context.title === SpCampaignLevelTitles.PRODUCT_TARGETING ||
  context.title === SpAdGroupLevelTitles.TARGETING ||
  context.title === SpAdGroupLevelTitles.KEYWORD_TARGETING ||
  context.title === SpAdGroupLevelTitles.PRODUCT_TARGETING ||
  context.title === SbAccountLevelTitles.KEYWORD_TARGETING ||
  context.title === SbCampaignLevelTitles.KEYWORD_TARGETING ||
  context.title === SbAdGroupLevelTitles.KEYWORD_TARGETING ||
  context.title === SbAccountLevelTitles.PRODUCT_TARGETING ||
  context.title === SbCampaignLevelTitles.PRODUCT_TARGETING ||
  context.title === SbAdGroupLevelTitles.PRODUCT_TARGETING;

// TODO: Keeping this if future requirement changes
export const checkIsArchiveBulkActionVisible = (
  context: IBulkActionContext
): boolean => context.selectedMarketplace !== MarketplaceEnum.WALMART;
