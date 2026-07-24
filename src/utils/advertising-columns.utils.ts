import { amazonCatalogColumns } from '@/app/components/page-components/amazon-catalog-table-wrapper/amazon-catalog-table-columns';
import {
  amazonOverallAdGroupColumns,
  amazonOverallCampaignColumns,
  amazonOverallKeywordTargetingColumns,
  amazonOverallProductAdsColumns,
  amazonOverallProductTargetingColumns,
  amazonOverallSearchTermColumns,
} from '@/app/components/pages/advertising-page/advertising-amazon/overall/amz-overall-columns';
import {
  amazonSbAdGroupsColumns,
  amazonSbAutomationRulesColumns,
  amazonSbCampaignColumns,
  amazonSbKeywordTargetingColumns,
  amazonSbNegativeKeywordTargetingColumns,
  amazonSbNegativeProductTargetingColumns,
  amazonSbProductAdsColumns,
  amazonSbProductTargetingColumns,
  amazonSbSearchTermKeywordColumns,
} from '@/app/components/pages/advertising-page/advertising-amazon/sb/amz-sb-columns';
import {
  amazonSdAdGroupsColumns,
  amazonSdAutomationRulesColumns,
  amazonSdCampaignColumns,
  amazonSdProductsColumns,
} from '@/app/components/pages/advertising-page/advertising-amazon/sd/amz-sd-columns';
import {
  amazonSpAdGroupsColumns,
  amazonSpAutomationRulesColumns,
  amazonSpAutoTargetingColumns,
  amazonSpCampaignColumns,
  amazonSpKeywordTargetingColumns,
  amazonSpNegativeKeywordTargetingColumns,
  amazonSpNegativeProductTargetingColumns,
  amazonSpPlacementColumns,
  amazonSpProductAdsColumns,
  amazonSpProductTargetingColumns,
  amazonSpSearchTermKeywordColumns,
} from '@/app/components/pages/advertising-page/advertising-amazon/sp/amz-sp-columns';
import {
  walmartOverallAdGroupsColumns,
  walmartOverallAdItemsColumns,
  walmartOverallCampaignColumns,
  walmartOverallKeywordTargetingColumns,
  walmartOverallPageTypeColumns,
  walmartOverallPlatformColumns,
  walmartOverallSearchTermColumns,
} from '@/app/components/pages/advertising-page/advertising-walmart/overall/wmt-overall-columns';
import {
  walmartSbAdGroupsColumns,
  walmartSbAdItemsColumns,
  walmartSbAutomationRulesColumns,
  walmartSbCampaignColumns,
  walmartSbKeywordTargetingColumns,
  walmartSbPageTypeColumns,
  walmartSbPlatformColumns,
} from '@/app/components/pages/advertising-page/advertising-walmart/sb/wmt-sb-columns';
import {
  walmartAdGroupsColumns,
  walmartAdItemsColumns,
  walmartCampaignColumns,
  walmartKeywordTargetingColumns,
  walmartPageTypeColumns,
  walmartPlatformColumns,
  walmartSearchTermColumns,
  walmartSpAutomationRulesColumns,
} from '@/app/components/pages/advertising-page/advertising-walmart/sp/wmt-sp-columns';
import {
  walmartSvAdGroupsColumns,
  walmartSvAdItemsColumns,
  walmartSvAutomationRulesColumns,
  walmartSvCampaignColumns,
  walmartSvKeywordTargetingColumns,
  walmartSvPageTypeColumns,
  walmartSvPlatformColumns,
} from '@/app/components/pages/advertising-page/advertising-walmart/sv/wmt-sv-columns';
import {
  MONITORING_COLUMNS,
  MONITORING_HISTORY_COLUMNS,
} from '@/constants/table-columns/monitoring-table-columns.constant';
import {
  amazonProfitabilityColumns,
  profitabilityOrdersColumns,
  profitabilityProductsColumns,
} from '@/constants/table-columns/profitability-table-columns.constant';
import { MonitoringTableTitlesEnum } from '@/enums/monitoring.enum';
import {
  ProfitabilityTableTitlesEnum,
  ProfitabilityTableTypeEnum,
} from '@/enums/profitability.enums';
import {
  IAdvertisingInterfaces,
  ISortCriteria,
} from '@/interfaces/advertising/advertising.interface';
import { ISBCampaign } from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { ISDCampaign } from '@/interfaces/advertising/amazon/sd-advertising.interface';
import { ICampaign } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IWalmartCampaign } from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { IWalmartSVCampaign } from '@/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import {
  keywordActionAdditionColumns,
  keywordActionNegationColumns,
  productActionAdditionColumns,
  productNegationColumns,
  walmartKeywordActionAdditionColumns,
} from 'src/app/components/common/keyword-actions-table/new-keyword-actions-column';
import { catalogColumns } from 'src/app/components/page-components/catalog-table-wrapper/catalog-table-columns';
import {
  AdvertisingTitlesEnum,
  OverallAccountLevelTitles,
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
import { CatalogTabTitlesEnum } from 'src/enums/catalog.enums';
import { KeywordActionTabsEnum } from 'src/enums/keyword-action.enums';
import columnFilterUtils from './column-filter.utils';

export const getInitialColumnsByNavTitle = (
  selectedNavTab: AdvertisingTitlesEnum,
  campaignSubHeaderData?:
    | ICampaign
    | ISBCampaign
    | ISDCampaign
    | IWalmartCampaign
    | IWalmartSVCampaign
    | null
) => {
  switch (selectedNavTab) {
    case SpAccountLevelTitles.CAMPAIGNS:
      return amazonSpCampaignColumns;

    case SpAccountLevelTitles.AD_GROUPS:
    case SpCampaignLevelTitles.AD_GROUPS:
      return amazonSpAdGroupsColumns;

    case SpAccountLevelTitles.PRODUCT_ADS:
    case SpCampaignLevelTitles.PRODUCT_ADS:
    case SpAdGroupLevelTitles.PRODUCT_ADS:
      return amazonSpProductAdsColumns;

    case SpAccountLevelTitles.KEYWORD_TARGETING:
    case SpCampaignLevelTitles.KEYWORD_TARGETING:
    case SpAdGroupLevelTitles.KEYWORD_TARGETING:
      return amazonSpKeywordTargetingColumns;

    case SpAccountLevelTitles.PRODUCT_TARGETING:
    case SpCampaignLevelTitles.PRODUCT_TARGETING:
    case SpAdGroupLevelTitles.PRODUCT_TARGETING:
      return amazonSpProductTargetingColumns;

    case SpAccountLevelTitles.AUTO_TARGETING:
    case SpCampaignLevelTitles.AUTO_TARGETING:
    case SpAdGroupLevelTitles.TARGETING:
      return amazonSpAutoTargetingColumns;

    case SpCampaignLevelTitles.NEG_TARGETING_KEYWORD:
    case SpAdGroupLevelTitles.NEG_TARGETING_KEYWORD:
      return amazonSpNegativeKeywordTargetingColumns;

    case SpCampaignLevelTitles.NEG_TARGETING_PRODUCT:
    case SpAdGroupLevelTitles.NEG_TARGETING_PRODUCT:
      return amazonSpNegativeProductTargetingColumns;

    case SpAccountLevelTitles.SEARCH_TERM:
    case SpCampaignLevelTitles.SEARCH_TERM:
    case SpAdGroupLevelTitles.SEARCH_TERM:
      return amazonSpSearchTermKeywordColumns;

    case SpAccountLevelTitles.PLACEMENT:
    case SpCampaignLevelTitles.PLACEMENT:
      return amazonSpPlacementColumns;

    case SpCampaignLevelTitles.HISTORY:
      return [];

    case SpAdGroupLevelTitles.HISTORY:
      return [];

    case SbAccountLevelTitles.CAMPAIGNS:
      return amazonSbCampaignColumns;

    case SbAccountLevelTitles.AD_GROUP:
    case SbCampaignLevelTitles.AD_GROUP:
      return amazonSbAdGroupsColumns;

    case SbAccountLevelTitles.PRODUCT_ADS:
    case SbCampaignLevelTitles.PRODUCT_ADS:
    case SbAdGroupLevelTitles.PRODUCT_ADS:
      return amazonSbProductAdsColumns;

    case SbAccountLevelTitles.KEYWORD_TARGETING:
    case SbCampaignLevelTitles.KEYWORD_TARGETING:
    case SbAdGroupLevelTitles.KEYWORD_TARGETING:
      return amazonSbKeywordTargetingColumns;

    case SbAccountLevelTitles.PRODUCT_TARGETING:
    case SbCampaignLevelTitles.PRODUCT_TARGETING:
    case SbAdGroupLevelTitles.PRODUCT_TARGETING:
      return amazonSbProductTargetingColumns;

    case SbAccountLevelTitles.SEARCH_TERM:
    case SbCampaignLevelTitles.SEARCH_TERM_KEYWORD:
    case SbAdGroupLevelTitles.SEARCH_TERM_KEYWORD:
      return amazonSbSearchTermKeywordColumns;

    case SbCampaignLevelTitles.NEG_TARGETING_KEYWORD:
    case SbAdGroupLevelTitles.NEG_TARGETING_KEYWORD:
      return amazonSbNegativeKeywordTargetingColumns;

    case SbCampaignLevelTitles.NEG_TARGETING_PRODUCT:
    case SbAdGroupLevelTitles.NEG_TARGETING_PRODUCT:
      return amazonSbNegativeProductTargetingColumns;

    case SbCampaignLevelTitles.HISTORY:
      return [];

    case SdAccountLevelTitles.CAMPAIGN:
      return amazonSdCampaignColumns;

    case SdAccountLevelTitles.AD_GROUP:
    case SdCampaignLevelTitles.AD_GROUP:
      return amazonSdAdGroupsColumns;

    case SdAccountLevelTitles.PRODUCT_ADS:
    case SdCampaignLevelTitles.PRODUCT_ADS:
    case SdAdGroupLevelTitles.PRODUCT_ADS:
      return amazonSdProductsColumns;

    case SdAccountLevelTitles.AUDIENCE:
      return [];

    case SdAccountLevelTitles.CONTEXTUAL_TARGETING:
      return [];

    case SdCampaignLevelTitles.TARGETING:
      return [];

    case SdCampaignLevelTitles.HISTORY:
      return [];

    case SdAdGroupLevelTitles.CREATIVE:
      return [];

    case SdAdGroupLevelTitles.TARGETING:
      return [];

    case SdAdGroupLevelTitles.HISTORY:
      return [];

    case OverallAccountLevelTitles.CAMPAIGNS:
      return amazonOverallCampaignColumns;

    case OverallAccountLevelTitles.AD_GROUPS:
      return amazonOverallAdGroupColumns;

    case OverallAccountLevelTitles.PRODUCT_ADS:
      return amazonOverallProductAdsColumns;

    case OverallAccountLevelTitles.KEYWORD_TARGETING:
      return amazonOverallKeywordTargetingColumns;

    case OverallAccountLevelTitles.PRODUCT_TARGETING:
      return amazonOverallProductTargetingColumns;

    case OverallAccountLevelTitles.SEARCH_TERM:
      return amazonOverallSearchTermColumns;

    case WalmartSPAccountLevelTitles.CAMPAIGNS:
      return walmartCampaignColumns;

    case WalmartSPAccountLevelTitles.AD_GROUPS:
    case WalmartSPCampaignLevelTitles.AD_GROUPS:
      return walmartAdGroupsColumns;

    case WalmartSPAccountLevelTitles.AD_ITEMS:
    case WalmartSPCampaignLevelTitles.AD_ITEMS:
    case WalmartSPAdGroupLevelTitles.AD_ITEMS:
      return walmartAdItemsColumns;

    case WalmartSPAccountLevelTitles.KEYWORD_TARGETING:
    case WalmartSPCampaignLevelTitles.KEYWORD_TARGETING:
    case WalmartSPAdGroupLevelTitles.KEYWORD_TARGETING:
      return walmartKeywordTargetingColumns;

    case WalmartSPAccountLevelTitles.SEARCH_TERM:
    case WalmartSPCampaignLevelTitles.SEARCH_TERM:
    case WalmartSPAdGroupLevelTitles.SEARCH_TERM:
      return walmartSearchTermColumns;

    case WalmartSPAccountLevelTitles.PAGE_TYPE:
    case WalmartSPCampaignLevelTitles.PAGE_TYPE:
      return walmartPageTypeColumns;

    case WalmartSPAccountLevelTitles.PLATFORM:
    case WalmartSPCampaignLevelTitles.PLATFORM:
      return walmartPlatformColumns;

    case WalmartSBAccountLevelTitles.CAMPAIGNS:
      return walmartSbCampaignColumns;

    case WalmartSBAccountLevelTitles.AD_GROUPS:
    case WalmartSBCampaignLevelTitles.AD_GROUPS:
      return walmartSbAdGroupsColumns;

    case WalmartSBAccountLevelTitles.AD_ITEMS:
    case WalmartSBCampaignLevelTitles.AD_ITEMS:
    case WalmartSBAdGroupLevelTitles.AD_ITEMS:
      return walmartSbAdItemsColumns;

    case WalmartSBAccountLevelTitles.KEYWORD_TARGETING:
    case WalmartSBCampaignLevelTitles.KEYWORD_TARGETING:
    case WalmartSBAdGroupLevelTitles.KEYWORD_TARGETING:
      return walmartSbKeywordTargetingColumns;

    case WalmartSBCampaignLevelTitles.PAGE_TYPE:
    case WalmartSBAccountLevelTitles.PAGE_TYPE:
      return walmartSbPageTypeColumns;

    case WalmartSBCampaignLevelTitles.PLATFORM:
    case WalmartSBAccountLevelTitles.PLATFORM:
      return walmartSbPlatformColumns;

    case WalmartSVAccountLevelTitles.CAMPAIGNS:
      return walmartSvCampaignColumns;

    case WalmartSVAccountLevelTitles.AD_GROUPS:
    case WalmartSVCampaignLevelTitles.AD_GROUPS:
      return walmartSvAdGroupsColumns;

    case WalmartSVAccountLevelTitles.AD_ITEMS:
    case WalmartSVCampaignLevelTitles.AD_ITEMS:
    case WalmartSVAdGroupLevelTitles.AD_ITEMS:
      return walmartSvAdItemsColumns;

    case WalmartSVAccountLevelTitles.KEYWORD_TARGETING:
    case WalmartSVCampaignLevelTitles.KEYWORD_TARGETING:
    case WalmartSVAdGroupLevelTitles.KEYWORD_TARGETING:
      return walmartSvKeywordTargetingColumns;

    case WalmartSVCampaignLevelTitles.PAGE_TYPE:
    case WalmartSVAccountLevelTitles.PAGE_TYPE:
      return walmartSvPageTypeColumns;

    case WalmartSVAccountLevelTitles.PLATFORM:
    case WalmartSVCampaignLevelTitles.PLATFORM:
      return walmartSvPlatformColumns;
    case WalmartOverallAccountLevelTitles.CAMPAIGNS:
      return walmartOverallCampaignColumns;

    case WalmartOverallAccountLevelTitles.AD_GROUPS:
      return walmartOverallAdGroupsColumns;

    case WalmartOverallAccountLevelTitles.AD_ITEMS:
      return walmartOverallAdItemsColumns;

    case WalmartOverallAccountLevelTitles.KEYWORD_TARGETING:
      return walmartOverallKeywordTargetingColumns;

    case WalmartOverallAccountLevelTitles.SEARCH_TERM:
      return walmartOverallSearchTermColumns;

    case WalmartOverallAccountLevelTitles.PAGE_TYPE:
      return walmartOverallPageTypeColumns;

    case WalmartOverallAccountLevelTitles.PLATFORM:
      return walmartOverallPlatformColumns;

    case SpCampaignLevelTitles.AUTOMATION_RULES:
      return amazonSpAutomationRulesColumns(campaignSubHeaderData as ICampaign);

    case SbCampaignLevelTitles.AUTOMATION_RULES:
      return amazonSbAutomationRulesColumns(
        campaignSubHeaderData as ISBCampaign
      );

    case SdCampaignLevelTitles.AUTOMATION_RULES:
      return amazonSdAutomationRulesColumns(
        campaignSubHeaderData as ISDCampaign
      );

    case WalmartSPCampaignLevelTitles.AUTOMATION_RULES:
      return walmartSpAutomationRulesColumns(
        campaignSubHeaderData as IWalmartCampaign
      );

    case WalmartSBCampaignLevelTitles.AUTOMATION_RULES:
      return walmartSbAutomationRulesColumns(
        campaignSubHeaderData as IWalmartCampaign
      );

    case WalmartSVCampaignLevelTitles.AUTOMATION_RULES:
      return walmartSvAutomationRulesColumns(
        campaignSubHeaderData as IWalmartSVCampaign
      );

    case KeywordActionTabsEnum.KEYWORD_ADDITION_AMAZON:
      return keywordActionAdditionColumns;

    case KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON:
      return productActionAdditionColumns;

    case KeywordActionTabsEnum.KEYWORD_ADDITION_WALMART:
      return walmartKeywordActionAdditionColumns;

    case KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON:
      return keywordActionNegationColumns;

    case KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON:
      return productNegationColumns;

    case CatalogTabTitlesEnum.WALMART_CATALOG:
      return catalogColumns;
    case CatalogTabTitlesEnum.AMAZON_CATALOG:
      return amazonCatalogColumns;
    case MonitoringTableTitlesEnum.MONITORING_HISTORY:
      return MONITORING_HISTORY_COLUMNS;
    case MonitoringTableTitlesEnum.MONITORING_HOME:
      return MONITORING_COLUMNS;
    case ProfitabilityTableTypeEnum.ORDERS:
      return profitabilityOrdersColumns(true);
    case ProfitabilityTableTitlesEnum.PROFITABILITY_PNL_ORDERS:
      return profitabilityOrdersColumns(false);

    case ProfitabilityTableTypeEnum.PRODUCTS:
      return profitabilityProductsColumns(true);
    case ProfitabilityTableTitlesEnum.PROFITABILITY_PNL_PRODUCTS:
      return profitabilityProductsColumns(false);

    case ProfitabilityTableTypeEnum.AMAZON_ORDERS:
      return amazonProfitabilityColumns(true, true);
    case ProfitabilityTableTypeEnum.AMAZON_PRODUCTS:
      return amazonProfitabilityColumns(false, true);
    case ProfitabilityTableTitlesEnum.AMZ_PROFITABILITY_PNL_ORDERS:
      return amazonProfitabilityColumns(true, false);
    case ProfitabilityTableTitlesEnum.AMZ_PROFITABILITY_PNL_PRODUCTS:
      return amazonProfitabilityColumns(false, false);

    default:
      return [];
  }
};

export const getFormattedSortModel = (
  selectedNavTitle: AdvertisingTitlesEnum,
  sortModel: SortingState
): ISortCriteria[] => {
  const _initialColumns = getInitialColumnsByNavTitle(selectedNavTitle);

  return columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
    _initialColumns as Array<ColumnDef<IAdvertisingInterfaces>>,
    sortModel
  );
};

export const getFormattedSortModelNoMetrics = (
  selectedNavTitle: AdvertisingTitlesEnum,
  sortModel: SortingState
) => {
  return sortModel[0].id !== 'Ad Sales'
    ? getFormattedSortModel(selectedNavTitle, sortModel)
    : [
        {
          columnName: 'campaignName',
          sortOrder: SortOrderEnum.ASC,
        },
      ];
};
