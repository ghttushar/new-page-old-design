import RulesActiveAction from '@/app/components/common/bulk-actions/active-action/rules-active-action';
import RulesArchiveAction from '@/app/components/common/bulk-actions/archive-action/rules-archive-action';
import RulesPauseAction from '@/app/components/common/bulk-actions/pause-action/rules-pause-action';
import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import { ITabData } from '@/app/components/common/tabs-select/tabs-select';
import { HOURS_OPTIONS } from '@/constants/datetime.constants';
import {
  MetricsKeysEnum,
  PageTypeActualEnum,
  PlacementBids,
  RuleAutomationStatusEnum,
} from '@/enums/advertising.enums';
import { BulkActionKeyEnum } from '@/enums/bulk-action.enums';
import { DayOfWeekEnum } from '@/enums/datetime.enums';
import { FilterDropdownValue } from '@/enums/filter.enums';
import { MetricInputTypeEnum } from '@/enums/index.enums';
import {
  AmazonRuleOperatorEnum,
  AppliedRulesColumnIds,
  MetricsAbbrEnum,
  MetricsTitleEnum,
  RuleActionTypeEnum,
  RuleAdjustmentTargetType,
  RuleCreationLookbackEnum,
  RuleEntityTypeIdEnum,
  RuleStatusEnum,
  RuleTypeCategoryEnum,
  RuleTypeCategoryNameEnum,
  RuleTypeEnum,
  RuleValueTypeEnum,
} from '@/enums/rules.enum';
import { Frequency } from '@/enums/serp.enums';
import { IBulkAction } from '@/interfaces/bulk-action.interface';
import {
  IBudgetMetricDisplay,
  IRuleTypeCategoryMapping,
} from '@/interfaces/rules/rules.interfaces';
import { getCurrencySymbolByCountry } from '@/utils';
import {
  CrosshairIcon,
  EqualsIcon,
  MegaphoneSimpleIcon,
  XIcon,
} from '@phosphor-icons/react';
import { SortingState } from '@tanstack/react-table';

export const jivaPromptSuggestions: string[] = [
  'Find underperforming products to optimize',
  'Show me a list of products which have high RoAS',
  'Summarize campaigns with low CTR',
  'Suggest budget reallocation for top ads',
  'List campaigns with high CPC',
];

export const RULE_TYPE_CATEGORY_MAPPINGS: {
  [key: string]: IRuleTypeCategoryMapping;
} = {
  [RuleTypeCategoryEnum.CAMPAIGN_RULE]: {
    name: RuleTypeCategoryNameEnum.CAMPAIGN_RULE,
    icon: <MegaphoneSimpleIcon size={'1.8rem'} color="#77469b" />,
  },
  [RuleTypeCategoryEnum.TARGETING_RULE]: {
    name: RuleTypeCategoryNameEnum.TARGETING_RULE,
    icon: <CrosshairIcon size={'1.8rem'} color="#77469b" />,
  },
};

export const RULE_CREATION_LOOKBACK_OPTIONS: IDropdownItem<RuleCreationLookbackEnum>[] =
  [
    {
      value: RuleCreationLookbackEnum.DAYS_7,
      label: '7 days',
      isDisabled: false,
    },
    {
      value: RuleCreationLookbackEnum.DAYS_14,
      label: '14 days',
      isDisabled: false,
    },
    {
      value: RuleCreationLookbackEnum.DAYS_30,
      label: '30 days',
      isDisabled: false,
    },
    {
      value: RuleCreationLookbackEnum.DAYS_60,
      label: '60 days',
      isDisabled: false,
    },
  ];

export const METRICS_ABBR_MAPPING: Record<MetricsKeysEnum, MetricsAbbrEnum> = {
  [MetricsKeysEnum.ACOS]: MetricsAbbrEnum.ACOS,
  [MetricsKeysEnum.CTR]: MetricsAbbrEnum.CTR,
  [MetricsKeysEnum.CVR]: MetricsAbbrEnum.CVR,
  [MetricsKeysEnum.TACOS]: MetricsAbbrEnum.TACOS,
  [MetricsKeysEnum.PERCENTAGE_ORDERS_NTB]:
    MetricsAbbrEnum.PERCENTAGE_ORDERS_NTB,
  [MetricsKeysEnum.PERCENTAGE_SALES_NTB]: MetricsAbbrEnum.PERCENTAGE_SALES_NTB,
  [MetricsKeysEnum.PERCENTAGE_UNITS_NTB]: MetricsAbbrEnum.PERCENTAGE_UNITS_NTB,
  [MetricsKeysEnum.CVR_UNITS]: MetricsAbbrEnum.CVR_UNITS,
  [MetricsKeysEnum.CVR_ORDERS]: MetricsAbbrEnum.CVR_ORDERS,
  [MetricsKeysEnum.VIDEO_5_SECOND_VIEW_RATE]:
    MetricsAbbrEnum.VIDEO_5_SECOND_VIEW_RATE,
  [MetricsKeysEnum.VTR]: MetricsAbbrEnum.VTR,
  [MetricsKeysEnum.VCTR]: MetricsAbbrEnum.VCTR,
  [MetricsKeysEnum.LQS]: MetricsAbbrEnum.LQS,
  [MetricsKeysEnum.PRODUCT_SOV]: MetricsAbbrEnum.PRODUCT_SOV,
  [MetricsKeysEnum.GROSS_MARGIN_PERCENTAGE]:
    MetricsAbbrEnum.GROSS_MARGIN_PERCENTAGE,
  [MetricsKeysEnum.BID_MULTIPLIER]: MetricsAbbrEnum.BID_MULTIPLIER,
  [MetricsKeysEnum.CVR_UNIT_SOLD_BASED]: MetricsAbbrEnum.CVR_UNIT_SOLD_BASED,
  [MetricsKeysEnum.CVR_ORDER_BASED]: MetricsAbbrEnum.CVR_ORDER_BASED,
  [MetricsKeysEnum.AD_SPEND]: MetricsAbbrEnum.AD_SPEND,
  [MetricsKeysEnum.AD_SALES]: MetricsAbbrEnum.AD_SALES,
  [MetricsKeysEnum.ROAS]: MetricsAbbrEnum.ROAS,
  [MetricsKeysEnum.CPC]: MetricsAbbrEnum.CPC,
  [MetricsKeysEnum.CUSTOM_BID]: MetricsAbbrEnum.CUSTOM_BID,
  [MetricsKeysEnum.BID]: MetricsAbbrEnum.BID,
  [MetricsKeysEnum.TOTAL_SALES]: MetricsAbbrEnum.TOTAL_SALES,
  [MetricsKeysEnum.ADVERTISED_SKU_SALES]: MetricsAbbrEnum.ADVERTISED_SKU_SALES,
  [MetricsKeysEnum.OTHER_SKU_SALES]: MetricsAbbrEnum.OTHER_SKU_SALES,
  [MetricsKeysEnum.NTB_SALES]: MetricsAbbrEnum.NTB_SALES,
  [MetricsKeysEnum.VCPM]: MetricsAbbrEnum.VCPM,
  [MetricsKeysEnum.GMV]: MetricsAbbrEnum.GMV,
  [MetricsKeysEnum.DEFAULT_BID]: MetricsAbbrEnum.DEFAULT_BID,
  [MetricsKeysEnum.BUDGET]: MetricsAbbrEnum.BUDGET,
  [MetricsKeysEnum.TOTAL_BUDGET]: MetricsAbbrEnum.TOTAL_BUDGET,
  [MetricsKeysEnum.DAILY_BUDGET]: MetricsAbbrEnum.DAILY_BUDGET,
  [MetricsKeysEnum.MIN_BID]: MetricsAbbrEnum.MIN_BID,
  [MetricsKeysEnum.MAX_BID]: MetricsAbbrEnum.MAX_BID,
  [MetricsKeysEnum.TROAS]: MetricsAbbrEnum.TROAS,
  [MetricsKeysEnum.VIEW_THROUGH_AD_SALES]:
    MetricsAbbrEnum.VIEW_THROUGH_AD_SALES,
  [MetricsKeysEnum.COMPLETE_VIEW_AD_SALES]:
    MetricsAbbrEnum.COMPLETE_VIEW_AD_SALES,
  [MetricsKeysEnum.OTHER_COMPLETE_VIEW_AD_SALES]:
    MetricsAbbrEnum.OTHER_COMPLETE_VIEW_AD_SALES,
  [MetricsKeysEnum.REVENUE_COST]: MetricsAbbrEnum.REVENUE_COST,
  [MetricsKeysEnum.INVENTORY_VALUE]: MetricsAbbrEnum.INVENTORY_VALUE,
  [MetricsKeysEnum.INVENTORY_VALUE_COGS]: MetricsAbbrEnum.INVENTORY_VALUE_COGS,
  [MetricsKeysEnum.INVENTORY_VALUE_RETAIL]:
    MetricsAbbrEnum.INVENTORY_VALUE_RETAIL,
  [MetricsKeysEnum.PRICE]: MetricsAbbrEnum.PRICE,
  [MetricsKeysEnum.COGS]: MetricsAbbrEnum.COGS,
  [MetricsKeysEnum.WALMART_FEE]: MetricsAbbrEnum.WALMART_FEE,
  [MetricsKeysEnum.GROSS_MARGIN]: MetricsAbbrEnum.GROSS_MARGIN,
  [MetricsKeysEnum.CANCELLED_SALES_PRICE]:
    MetricsAbbrEnum.CANCELLED_SALES_PRICE,
  [MetricsKeysEnum.REFUND_SALES]: MetricsAbbrEnum.REFUND_SALES,
  [MetricsKeysEnum.GROSS_SALES]: MetricsAbbrEnum.GROSS_SALES,
  [MetricsKeysEnum.PROMO_SPEND]: MetricsAbbrEnum.PROMO_SPEND,
  [MetricsKeysEnum.IN_STORE_ATTRIBUTES_SALES]:
    MetricsAbbrEnum.IN_STORE_ATTRIBUTES_SALES,
  [MetricsKeysEnum.IN_STORE_ADVERTISED_SALES]:
    MetricsAbbrEnum.IN_STORE_ADVERTISED_SALES,
  [MetricsKeysEnum.IN_STORE_OTHER_SALES]: MetricsAbbrEnum.IN_STORE_OTHER_SALES,
  [MetricsKeysEnum.OMNI_CHANNEL_SALES]: MetricsAbbrEnum.OMNI_CHANNEL_SALES,
  [MetricsKeysEnum.OMNI_CHANNEL_ROAS]: MetricsAbbrEnum.OMNI_CHANNEL_ROAS,
  [MetricsKeysEnum.LISTING_PRICE]: MetricsAbbrEnum.LISTING_PRICE,
  [MetricsKeysEnum.GMV_COMMISSION]: MetricsAbbrEnum.GMV_COMMISSION,
  [MetricsKeysEnum.SUGGESTED_DAILY_BUDGET_COLUMN]:
    MetricsAbbrEnum.SUGGESTED_DAILY_BUDGET_COLUMN,
  [MetricsKeysEnum.SUGGESTED_TOTAL_BUDGET_COLUMN]:
    MetricsAbbrEnum.SUGGESTED_TOTAL_BUDGET_COLUMN,
  [MetricsKeysEnum.IMPRESSIONS]: MetricsAbbrEnum.IMPRESSIONS,
  [MetricsKeysEnum.CLICKS]: MetricsAbbrEnum.CLICKS,
  [MetricsKeysEnum.TOTAL_UNITS]: MetricsAbbrEnum.TOTAL_UNITS,
  [MetricsKeysEnum.AD_ORDERS]: MetricsAbbrEnum.AD_ORDERS,
  [MetricsKeysEnum.ADVERTISED_SKU_UNITS]: MetricsAbbrEnum.ADVERTISED_SKU_UNITS,
  [MetricsKeysEnum.OTHER_SKU_UNITS]: MetricsAbbrEnum.OTHER_SKU_UNITS,
  [MetricsKeysEnum.NTB_UNITS]: MetricsAbbrEnum.NTB_UNITS,
  [MetricsKeysEnum.NTB_ORDERS]: MetricsAbbrEnum.NTB_ORDERS,
  [MetricsKeysEnum.VIEWABLE_IMPRESSIONS]: MetricsAbbrEnum.VIEWABLE_IMPRESSIONS,
  [MetricsKeysEnum.VIDEO_5_SECOND_VIEWS]: MetricsAbbrEnum.VIDEO_5_SECOND_VIEWS,
  [MetricsKeysEnum.UNITS_SOLD]: MetricsAbbrEnum.UNITS_SOLD,
  [MetricsKeysEnum.ADGROUP_COUNT]: MetricsAbbrEnum.ADGROUP_COUNT,
  [MetricsKeysEnum.RATINGS]: MetricsAbbrEnum.RATINGS,
  [MetricsKeysEnum.REVIEWS]: MetricsAbbrEnum.REVIEWS,
  [MetricsKeysEnum.COMPLETE_VIEW_ORDERS]: MetricsAbbrEnum.COMPLETE_VIEW_ORDERS,
  [MetricsKeysEnum.COMPLETE_VIEW_AD_UNITS]:
    MetricsAbbrEnum.COMPLETE_VIEW_AD_UNITS,
  [MetricsKeysEnum.VIDEO_COMPLETE_VIEWS]: MetricsAbbrEnum.VIDEO_COMPLETE_VIEWS,
  [MetricsKeysEnum.VIDEO_FIRST_QUARTILE_VIEWS]:
    MetricsAbbrEnum.VIDEO_FIRST_QUARTILE_VIEWS,
  [MetricsKeysEnum.VIDEO_IMPRESSIONS]: MetricsAbbrEnum.VIDEO_IMPRESSIONS,
  [MetricsKeysEnum.VIDEO_MIDPOINT_VIEWS]: MetricsAbbrEnum.VIDEO_MIDPOINT_VIEWS,
  [MetricsKeysEnum.VIDEO_THIRD_QUARTILE_VIEWS]:
    MetricsAbbrEnum.VIDEO_THIRD_QUARTILE_VIEWS,
  [MetricsKeysEnum.VIDEO_UNMUTES]: MetricsAbbrEnum.VIDEO_UNMUTES,
  [MetricsKeysEnum.VIEW_THROUGH_AD_ORDERS]:
    MetricsAbbrEnum.VIEW_THROUGH_AD_ORDERS,
  [MetricsKeysEnum.VIEW_THROUGH_AD_UNITS]:
    MetricsAbbrEnum.VIEW_THROUGH_AD_UNITS,
  [MetricsKeysEnum.INVENTORY]: MetricsAbbrEnum.INVENTORY,
  [MetricsKeysEnum.AVAIL_TO_SELL_QUANTITY]:
    MetricsAbbrEnum.AVAIL_TO_SELL_QUANTITY,
  [MetricsKeysEnum.RETURNS]: MetricsAbbrEnum.RETURNS,
  [MetricsKeysEnum.CANCELLED_ORDERS]: MetricsAbbrEnum.CANCELLED_ORDERS,
  [MetricsKeysEnum.REFUND_ORDERS]: MetricsAbbrEnum.REFUND_ORDERS,
  [MetricsKeysEnum.GROSS_UNITS_SOLD]: MetricsAbbrEnum.GROSS_UNITS_SOLD,
  [MetricsKeysEnum.AD_UNITS_SOLD]: MetricsAbbrEnum.AD_UNITS_SOLD,
  [MetricsKeysEnum.CAMPAIGNS]: MetricsAbbrEnum.CAMPAIGNS,
  [MetricsKeysEnum.IN_STORE_UNITS_SOLD]: MetricsAbbrEnum.IN_STORE_UNITS_SOLD,
  [MetricsKeysEnum.IN_STORE_ORDERS]: MetricsAbbrEnum.IN_STORE_ORDERS,
  [MetricsKeysEnum.INPUT_QUANTITY]: MetricsAbbrEnum.INPUT_QUANTITY,
  [MetricsKeysEnum.ORDERS]: MetricsAbbrEnum.ORDERS,
  [MetricsKeysEnum.PRODUCT_AD]: MetricsAbbrEnum.PRODUCT_AD,
  [MetricsKeysEnum.BIDDER_STATUS]: MetricsAbbrEnum.BIDDER_STATUS,
  [MetricsKeysEnum.COST]: MetricsAbbrEnum.COST,
  [MetricsKeysEnum.AVG_CLICKS]: MetricsAbbrEnum.AVG_CLICKS,
  [MetricsKeysEnum.AVG_CVR]: MetricsAbbrEnum.AVG_CVR,
  [MetricsKeysEnum.CVR_MEDIAN]: MetricsAbbrEnum.CVR_MEDIAN,
  [MetricsKeysEnum.THIRTY_PERCENT_OF_TROAS]:
    MetricsAbbrEnum.THIRTY_PERCENT_OF_TROAS,
  [MetricsKeysEnum.THIRTY_FIVE_PERCENT_OF_ASP]:
    MetricsAbbrEnum.THIRTY_FIVE_PERCENT_OF_ASP,
  [MetricsKeysEnum.FBA_INVENTORY]: MetricsAbbrEnum.FBA_INVENTORY,
  [MetricsKeysEnum.WFS_INVENTORY]: MetricsAbbrEnum.WFS_INVENTORY,
  [MetricsKeysEnum.DAYS_OF_SUPPLY]: MetricsAbbrEnum.DAYS_OF_SUPPLY,
  [MetricsKeysEnum.WEEKS_OF_SUPPLY]: MetricsAbbrEnum.WEEKS_OF_SUPPLY,
  [MetricsKeysEnum.ESTIMATED_EXCESS_QUANTITY]:
    MetricsAbbrEnum.ESTIMATED_EXCESS_QUANTITY,
  [MetricsKeysEnum.TOTAL_ORDERS]: MetricsAbbrEnum.TOTAL_ORDERS,
  [MetricsKeysEnum.TOTAL_ACOS]: MetricsAbbrEnum.TOTAL_ACOS,
  [MetricsKeysEnum.NET_PROFIT]: MetricsAbbrEnum.NET_PROFIT,
  [MetricsKeysEnum.INV_AGE_0_90]: MetricsAbbrEnum.INV_AGE_0_90,
  [MetricsKeysEnum.INV_AGE_91_180]: MetricsAbbrEnum.INV_AGE_91_180,
  [MetricsKeysEnum.INV_AGE_181_270]: MetricsAbbrEnum.INV_AGE_181_270,
  [MetricsKeysEnum.INV_AGE_271_365]: MetricsAbbrEnum.INV_AGE_271_365,
  [MetricsKeysEnum.INV_AGE_365_PLUS]: MetricsAbbrEnum.INV_AGE_365_PLUS,
  [MetricsKeysEnum.TOTAL_AGED_INVENTORY]: MetricsAbbrEnum.TOTAL_AGED_INVENTORY,

  [MetricsKeysEnum.CAMPAIGN_BUDGET]: MetricsAbbrEnum.CAMPAIGN_BUDGET,
  [MetricsKeysEnum.OUT_OF_BUDGET]: MetricsAbbrEnum.OUT_OF_BUDGET,
  [MetricsKeysEnum.DAYS_SINCE_CAMPAIGN_START]:
    MetricsAbbrEnum.DAYS_SINCE_CAMPAIGN_START,
  [MetricsKeysEnum.AVG_SPEND]: MetricsAbbrEnum.AVG_SPEND,
  [MetricsKeysEnum.CPA]: MetricsAbbrEnum.CPA,
  [MetricsKeysEnum.TACOS_TARGET]: MetricsAbbrEnum.TACOS_TARGET,
  [MetricsKeysEnum.OOB_PERCENTAGE]: MetricsAbbrEnum.OOB_PERCENTAGE,
  [MetricsKeysEnum.OUT_OF_BUDGET_HOUR]: MetricsAbbrEnum.OUT_OF_BUDGET_HOUR,

  [MetricsKeysEnum.TOS_IMPRESSIONS]: MetricsAbbrEnum.TOS_IMPRESSIONS,
  [MetricsKeysEnum.TOS_CLICKS]: MetricsAbbrEnum.TOS_CLICKS,
  [MetricsKeysEnum.TOS_UNITS_SOLD]: MetricsAbbrEnum.TOS_UNITS_SOLD,
  [MetricsKeysEnum.TOS_CPC]: MetricsAbbrEnum.TOS_CPC,
  [MetricsKeysEnum.TOS_CVR]: MetricsAbbrEnum.TOS_CVR,
  [MetricsKeysEnum.TOS_CTR]: MetricsAbbrEnum.TOS_CTR,
  [MetricsKeysEnum.TOS_SALES]: MetricsAbbrEnum.TOS_SALES,
  [MetricsKeysEnum.TOS_SPEND]: MetricsAbbrEnum.TOS_SPEND,
  [MetricsKeysEnum.TOS_ACOS]: MetricsAbbrEnum.TOS_ACOS,
  [MetricsKeysEnum.TOS_ROAS]: MetricsAbbrEnum.TOS_ROAS,

  [MetricsKeysEnum.ROS_IMPRESSIONS]: MetricsAbbrEnum.ROS_IMPRESSIONS,
  [MetricsKeysEnum.ROS_CLICKS]: MetricsAbbrEnum.ROS_CLICKS,
  [MetricsKeysEnum.ROS_UNITS_SOLD]: MetricsAbbrEnum.ROS_UNITS_SOLD,
  [MetricsKeysEnum.ROS_CPC]: MetricsAbbrEnum.ROS_CPC,
  [MetricsKeysEnum.ROS_CVR]: MetricsAbbrEnum.ROS_CVR,
  [MetricsKeysEnum.ROS_CTR]: MetricsAbbrEnum.ROS_CTR,
  [MetricsKeysEnum.ROS_SALES]: MetricsAbbrEnum.ROS_SALES,
  [MetricsKeysEnum.ROS_SPEND]: MetricsAbbrEnum.ROS_SPEND,
  [MetricsKeysEnum.ROS_ACOS]: MetricsAbbrEnum.ROS_ACOS,
  [MetricsKeysEnum.ROS_ROAS]: MetricsAbbrEnum.ROS_ROAS,

  [MetricsKeysEnum.PRODUCT_PAGE_IMPRESSIONS]:
    MetricsAbbrEnum.PRODUCT_PAGE_IMPRESSIONS,
  [MetricsKeysEnum.PRODUCT_PAGE_CLICKS]: MetricsAbbrEnum.PRODUCT_PAGE_CLICKS,
  [MetricsKeysEnum.PRODUCT_PAGE_UNITS_SOLD]:
    MetricsAbbrEnum.PRODUCT_PAGE_UNITS_SOLD,
  [MetricsKeysEnum.PRODUCT_PAGE_CPC]: MetricsAbbrEnum.PRODUCT_PAGE_CPC,
  [MetricsKeysEnum.PRODUCT_PAGE_CVR]: MetricsAbbrEnum.PRODUCT_PAGE_CVR,
  [MetricsKeysEnum.PRODUCT_PAGE_CTR]: MetricsAbbrEnum.PRODUCT_PAGE_CTR,
  [MetricsKeysEnum.PRODUCT_PAGE_SALES]: MetricsAbbrEnum.PRODUCT_PAGE_SALES,
  [MetricsKeysEnum.PRODUCT_PAGE_SPEND]: MetricsAbbrEnum.PRODUCT_PAGE_SPEND,
  [MetricsKeysEnum.PRODUCT_PAGE_ACOS]: MetricsAbbrEnum.PRODUCT_PAGE_ACOS,
  [MetricsKeysEnum.PRODUCT_PAGE_ROAS]: MetricsAbbrEnum.PRODUCT_PAGE_ROAS,

  [MetricsKeysEnum.BUY_BOX_IMPRESSIONS]: MetricsAbbrEnum.BUY_BOX_IMPRESSIONS,
  [MetricsKeysEnum.BUY_BOX_CLICKS]: MetricsAbbrEnum.BUY_BOX_CLICKS,
  [MetricsKeysEnum.BUY_BOX_UNITS_SOLD]: MetricsAbbrEnum.BUY_BOX_UNITS_SOLD,
  [MetricsKeysEnum.BUY_BOX_CPC]: MetricsAbbrEnum.BUY_BOX_CPC,
  [MetricsKeysEnum.BUY_BOX_CVR]: MetricsAbbrEnum.BUY_BOX_CVR,
  [MetricsKeysEnum.BUY_BOX_CTR]: MetricsAbbrEnum.BUY_BOX_CTR,
  [MetricsKeysEnum.BUY_BOX_SALES]: MetricsAbbrEnum.BUY_BOX_SALES,
  [MetricsKeysEnum.BUY_BOX_SPEND]: MetricsAbbrEnum.BUY_BOX_SPEND,
  [MetricsKeysEnum.BUY_BOX_ACOS]: MetricsAbbrEnum.BUY_BOX_ACOS,
  [MetricsKeysEnum.BUY_BOX_ROAS]: MetricsAbbrEnum.BUY_BOX_ROAS,

  [MetricsKeysEnum.SEARCH_INGRID_IMPRESSIONS]:
    MetricsAbbrEnum.SEARCH_INGRID_IMPRESSIONS,
  [MetricsKeysEnum.SEARCH_INGRID_CLICKS]: MetricsAbbrEnum.SEARCH_INGRID_CLICKS,
  [MetricsKeysEnum.SEARCH_INGRID_UNITS_SOLD]:
    MetricsAbbrEnum.SEARCH_INGRID_UNITS_SOLD,
  [MetricsKeysEnum.SEARCH_INGRID_CPC]: MetricsAbbrEnum.SEARCH_INGRID_CPC,
  [MetricsKeysEnum.SEARCH_INGRID_CVR]: MetricsAbbrEnum.SEARCH_INGRID_CVR,
  [MetricsKeysEnum.SEARCH_INGRID_CTR]: MetricsAbbrEnum.SEARCH_INGRID_CTR,
  [MetricsKeysEnum.SEARCH_INGRID_SALES]: MetricsAbbrEnum.SEARCH_INGRID_SALES,
  [MetricsKeysEnum.SEARCH_INGRID_SPEND]: MetricsAbbrEnum.SEARCH_INGRID_SPEND,
  [MetricsKeysEnum.SEARCH_INGRID_ACOS]: MetricsAbbrEnum.SEARCH_INGRID_ACOS,
  [MetricsKeysEnum.SEARCH_INGRID_ROAS]: MetricsAbbrEnum.SEARCH_INGRID_ROAS,

  [MetricsKeysEnum.HOME_PAGE_IMPRESSIONS]:
    MetricsAbbrEnum.HOME_PAGE_IMPRESSIONS,
  [MetricsKeysEnum.HOME_PAGE_CLICKS]: MetricsAbbrEnum.HOME_PAGE_CLICKS,
  [MetricsKeysEnum.HOME_PAGE_UNITS_SOLD]: MetricsAbbrEnum.HOME_PAGE_UNITS_SOLD,
  [MetricsKeysEnum.HOME_PAGE_CPC]: MetricsAbbrEnum.HOME_PAGE_CPC,
  [MetricsKeysEnum.HOME_PAGE_CVR]: MetricsAbbrEnum.HOME_PAGE_CVR,
  [MetricsKeysEnum.HOME_PAGE_CTR]: MetricsAbbrEnum.HOME_PAGE_CTR,
  [MetricsKeysEnum.HOME_PAGE_SALES]: MetricsAbbrEnum.HOME_PAGE_SALES,
  [MetricsKeysEnum.HOME_PAGE_SPEND]: MetricsAbbrEnum.HOME_PAGE_SPEND,
  [MetricsKeysEnum.HOME_PAGE_ACOS]: MetricsAbbrEnum.HOME_PAGE_ACOS,
  [MetricsKeysEnum.HOME_PAGE_ROAS]: MetricsAbbrEnum.HOME_PAGE_ROAS,

  [MetricsKeysEnum.STOCK_UP_IMPRESSIONS]: MetricsAbbrEnum.STOCK_UP_IMPRESSIONS,
  [MetricsKeysEnum.STOCK_UP_CLICKS]: MetricsAbbrEnum.STOCK_UP_CLICKS,
  [MetricsKeysEnum.STOCK_UP_UNITS_SOLD]: MetricsAbbrEnum.STOCK_UP_UNITS_SOLD,
  [MetricsKeysEnum.STOCK_UP_CPC]: MetricsAbbrEnum.STOCK_UP_CPC,
  [MetricsKeysEnum.STOCK_UP_CVR]: MetricsAbbrEnum.STOCK_UP_CVR,
  [MetricsKeysEnum.STOCK_UP_CTR]: MetricsAbbrEnum.STOCK_UP_CTR,
  [MetricsKeysEnum.STOCK_UP_SALES]: MetricsAbbrEnum.STOCK_UP_SALES,
  [MetricsKeysEnum.STOCK_UP_SPEND]: MetricsAbbrEnum.STOCK_UP_SPEND,
  [MetricsKeysEnum.STOCK_UP_ACOS]: MetricsAbbrEnum.STOCK_UP_ACOS,
  [MetricsKeysEnum.STOCK_UP_ROAS]: MetricsAbbrEnum.STOCK_UP_ROAS,

  [MetricsKeysEnum.STATISTICALLY_SIGNIFICANT_CLICKS]:
    MetricsAbbrEnum.STATISTICALLY_SIGNIFICANT_CLICKS,
  [MetricsKeysEnum.SELLER_FULFILLED_INVENTORY]:
    MetricsAbbrEnum.SELLER_FULFILLED_INVENTORY,
};

export const METRICS_TITLE_MAPPING: Record<MetricsKeysEnum, MetricsTitleEnum> =
  {
    [MetricsKeysEnum.ACOS]: MetricsTitleEnum.ACOS,
    [MetricsKeysEnum.CTR]: MetricsTitleEnum.CTR,
    [MetricsKeysEnum.CVR]: MetricsTitleEnum.CVR,
    [MetricsKeysEnum.TACOS]: MetricsTitleEnum.TACOS,
    [MetricsKeysEnum.PERCENTAGE_ORDERS_NTB]:
      MetricsTitleEnum.PERCENTAGE_ORDERS_NTB,
    [MetricsKeysEnum.PERCENTAGE_SALES_NTB]:
      MetricsTitleEnum.PERCENTAGE_SALES_NTB,
    [MetricsKeysEnum.PERCENTAGE_UNITS_NTB]:
      MetricsTitleEnum.PERCENTAGE_UNITS_NTB,
    [MetricsKeysEnum.CVR_UNITS]: MetricsTitleEnum.CVR_UNITS,
    [MetricsKeysEnum.CVR_ORDERS]: MetricsTitleEnum.CVR_ORDERS,
    [MetricsKeysEnum.VIDEO_5_SECOND_VIEW_RATE]:
      MetricsTitleEnum.VIDEO_5_SECOND_VIEW_RATE,
    [MetricsKeysEnum.BID_MULTIPLIER]: MetricsTitleEnum.BID_MULTIPLIER,
    [MetricsKeysEnum.VTR]: MetricsTitleEnum.VTR,
    [MetricsKeysEnum.VCTR]: MetricsTitleEnum.VCTR,
    [MetricsKeysEnum.LQS]: MetricsTitleEnum.LQS,
    [MetricsKeysEnum.PRODUCT_SOV]: MetricsTitleEnum.PRODUCT_SOV,
    [MetricsKeysEnum.GROSS_MARGIN_PERCENTAGE]:
      MetricsTitleEnum.GROSS_MARGIN_PERCENTAGE,
    [MetricsKeysEnum.CVR_UNIT_SOLD_BASED]: MetricsTitleEnum.CVR_UNIT_SOLD_BASED,
    [MetricsKeysEnum.CVR_ORDER_BASED]: MetricsTitleEnum.CVR_ORDER_BASED,
    [MetricsKeysEnum.AD_SPEND]: MetricsTitleEnum.AD_SPEND,
    [MetricsKeysEnum.AD_SALES]: MetricsTitleEnum.AD_SALES,
    [MetricsKeysEnum.ROAS]: MetricsTitleEnum.ROAS,
    [MetricsKeysEnum.CPC]: MetricsTitleEnum.CPC,
    [MetricsKeysEnum.CUSTOM_BID]: MetricsTitleEnum.CUSTOM_BID,
    [MetricsKeysEnum.BID]: MetricsTitleEnum.BID,
    [MetricsKeysEnum.TOTAL_SALES]: MetricsTitleEnum.TOTAL_SALES,
    [MetricsKeysEnum.NTB_SALES]: MetricsTitleEnum.NTB_SALES,
    [MetricsKeysEnum.VCPM]: MetricsTitleEnum.VCPM,
    [MetricsKeysEnum.GMV]: MetricsTitleEnum.GMV,
    [MetricsKeysEnum.DEFAULT_BID]: MetricsTitleEnum.DEFAULT_BID,
    [MetricsKeysEnum.BUDGET]: MetricsTitleEnum.BUDGET,
    [MetricsKeysEnum.ADVERTISED_SALES]: MetricsTitleEnum.ADVERTISED_SALES,
    [MetricsKeysEnum.OTHER_SALES]: MetricsTitleEnum.OTHER_SALES,
    [MetricsKeysEnum.TOTAL_BUDGET]: MetricsTitleEnum.TOTAL_BUDGET,
    [MetricsKeysEnum.DAILY_BUDGET]: MetricsTitleEnum.DAILY_BUDGET,
    [MetricsKeysEnum.MIN_BID]: MetricsTitleEnum.MIN_BID,
    [MetricsKeysEnum.MAX_BID]: MetricsTitleEnum.MAX_BID,
    [MetricsKeysEnum.TROAS]: MetricsTitleEnum.TROAS,
    [MetricsKeysEnum.VIEW_THROUGH_AD_SALES]:
      MetricsTitleEnum.VIEW_THROUGH_AD_SALES,
    [MetricsKeysEnum.COMPLETE_VIEW_AD_SALES]:
      MetricsTitleEnum.COMPLETE_VIEW_AD_SALES,
    [MetricsKeysEnum.OTHER_COMPLETE_VIEW_AD_SALES]:
      MetricsTitleEnum.OTHER_COMPLETE_VIEW_AD_SALES,
    [MetricsKeysEnum.REVENUE_COST]: MetricsTitleEnum.REVENUE_COST,
    [MetricsKeysEnum.INVENTORY_VALUE]: MetricsTitleEnum.INVENTORY_VALUE,
    [MetricsKeysEnum.INVENTORY_VALUE_COGS]:
      MetricsTitleEnum.INVENTORY_VALUE_COGS,
    [MetricsKeysEnum.INVENTORY_VALUE_RETAIL]:
      MetricsTitleEnum.INVENTORY_VALUE_RETAIL,
    [MetricsKeysEnum.PRICE]: MetricsTitleEnum.PRICE,
    [MetricsKeysEnum.COGS]: MetricsTitleEnum.COGS,
    [MetricsKeysEnum.WALMART_FEE]: MetricsTitleEnum.WALMART_FEE,
    [MetricsKeysEnum.GROSS_MARGIN]: MetricsTitleEnum.GROSS_MARGIN,
    [MetricsKeysEnum.CANCELLED_SALES_PRICE]:
      MetricsTitleEnum.CANCELLED_SALES_PRICE,
    [MetricsKeysEnum.REFUND_SALES]: MetricsTitleEnum.REFUND_SALES,
    [MetricsKeysEnum.GROSS_SALES]: MetricsTitleEnum.GROSS_SALES,
    [MetricsKeysEnum.PROMO_SPEND]: MetricsTitleEnum.PROMO_SPEND,
    [MetricsKeysEnum.SUGGESTED_DAILY_BUDGET_COLUMN]:
      MetricsTitleEnum.SUGGESTED_DAILY_BUDGET_COLUMN,
    [MetricsKeysEnum.SUGGESTED_TOTAL_BUDGET_COLUMN]:
      MetricsTitleEnum.SUGGESTED_TOTAL_BUDGET_COLUMN,
    [MetricsKeysEnum.IN_STORE_ATTRIBUTES_SALES]:
      MetricsTitleEnum.IN_STORE_ATTRIBUTES_SALES,
    [MetricsKeysEnum.IN_STORE_ADVERTISED_SALES]:
      MetricsTitleEnum.IN_STORE_ADVERTISED_SALES,
    [MetricsKeysEnum.IN_STORE_OTHER_SALES]:
      MetricsTitleEnum.IN_STORE_OTHER_SALES,
    [MetricsKeysEnum.OMNI_CHANNEL_SALES]: MetricsTitleEnum.OMNI_CHANNEL_SALES,
    [MetricsKeysEnum.OMNI_CHANNEL_ROAS]: MetricsTitleEnum.OMNI_CHANNEL_ROAS,
    [MetricsKeysEnum.LISTING_PRICE]: MetricsTitleEnum.LISTING_PRICE,
    [MetricsKeysEnum.GMV_COMMISSION]: MetricsTitleEnum.GMV_COMMISSION,
    [MetricsKeysEnum.IMPRESSIONS]: MetricsTitleEnum.IMPRESSIONS,
    [MetricsKeysEnum.CLICKS]: MetricsTitleEnum.CLICKS,
    [MetricsKeysEnum.TOTAL_UNITS]: MetricsTitleEnum.TOTAL_UNITS,
    [MetricsKeysEnum.AD_ORDERS]: MetricsTitleEnum.AD_ORDERS,
    [MetricsKeysEnum.NTB_UNITS]: MetricsTitleEnum.NTB_UNITS,
    [MetricsKeysEnum.NTB_ORDERS]: MetricsTitleEnum.NTB_ORDERS,
    [MetricsKeysEnum.ORDERS]: MetricsTitleEnum.ORDERS,
    [MetricsKeysEnum.VIEWABLE_IMPRESSIONS]:
      MetricsTitleEnum.VIEWABLE_IMPRESSIONS,
    [MetricsKeysEnum.VIDEO_5_SECOND_VIEWS]:
      MetricsTitleEnum.VIDEO_5_SECOND_VIEWS,
    [MetricsKeysEnum.UNITS_SOLD]: MetricsTitleEnum.UNITS_SOLD,
    [MetricsKeysEnum.ADVERTISED_UNITS]: MetricsTitleEnum.ADVERTISED_UNITS,
    [MetricsKeysEnum.OTHER_UNITS]: MetricsTitleEnum.OTHER_UNITS,
    [MetricsKeysEnum.ADGROUP_COUNT]: MetricsTitleEnum.ADGROUP_COUNT,
    [MetricsKeysEnum.RATINGS]: MetricsTitleEnum.RATINGS,
    [MetricsKeysEnum.REVIEWS]: MetricsTitleEnum.REVIEWS,
    [MetricsKeysEnum.COMPLETE_VIEW_ORDERS]:
      MetricsTitleEnum.COMPLETE_VIEW_ORDERS,
    [MetricsKeysEnum.COMPLETE_VIEW_AD_UNITS]:
      MetricsTitleEnum.COMPLETE_VIEW_AD_UNITS,
    [MetricsKeysEnum.VIDEO_COMPLETE_VIEWS]:
      MetricsTitleEnum.VIDEO_COMPLETE_VIEWS,
    [MetricsKeysEnum.VIDEO_FIRST_QUARTILE_VIEWS]:
      MetricsTitleEnum.VIDEO_FIRST_QUARTILE_VIEWS,
    [MetricsKeysEnum.VIDEO_IMPRESSIONS]: MetricsTitleEnum.VIDEO_IMPRESSIONS,
    [MetricsKeysEnum.VIDEO_MIDPOINT_VIEWS]:
      MetricsTitleEnum.VIDEO_MIDPOINT_VIEWS,
    [MetricsKeysEnum.VIDEO_THIRD_QUARTILE_VIEWS]:
      MetricsTitleEnum.VIDEO_THIRD_QUARTILE_VIEWS,
    [MetricsKeysEnum.VIDEO_UNMUTES]: MetricsTitleEnum.VIDEO_UNMUTES,
    [MetricsKeysEnum.VIEW_THROUGH_AD_ORDERS]:
      MetricsTitleEnum.VIEW_THROUGH_AD_ORDERS,
    [MetricsKeysEnum.VIEW_THROUGH_AD_UNITS]:
      MetricsTitleEnum.VIEW_THROUGH_AD_UNITS,
    [MetricsKeysEnum.INVENTORY]: MetricsTitleEnum.INVENTORY,
    [MetricsKeysEnum.AVAIL_TO_SELL_QUANTITY]:
      MetricsTitleEnum.AVAIL_TO_SELL_QUANTITY,
    [MetricsKeysEnum.RETURNS]: MetricsTitleEnum.RETURNS,
    [MetricsKeysEnum.CANCELLED_ORDERS]: MetricsTitleEnum.CANCELLED_ORDERS,
    [MetricsKeysEnum.REFUND_ORDERS]: MetricsTitleEnum.REFUND_ORDERS,
    [MetricsKeysEnum.GROSS_UNITS_SOLD]: MetricsTitleEnum.GROSS_UNITS_SOLD,
    [MetricsKeysEnum.AD_UNITS_SOLD]: MetricsTitleEnum.AD_UNITS_SOLD,
    [MetricsKeysEnum.CAMPAIGNS]: MetricsTitleEnum.CAMPAIGNS,
    [MetricsKeysEnum.IN_STORE_UNITS_SOLD]: MetricsTitleEnum.IN_STORE_UNITS_SOLD,
    [MetricsKeysEnum.IN_STORE_ORDERS]: MetricsTitleEnum.IN_STORE_ORDERS,
    [MetricsKeysEnum.INPUT_QUANTITY]: MetricsTitleEnum.INPUT_QUANTITY,
    [MetricsKeysEnum.PRODUCT_AD]: MetricsTitleEnum.PRODUCT_AD,
    [MetricsKeysEnum.BIDDER_STATUS]: MetricsTitleEnum.BIDDER_STATUS,
    [MetricsKeysEnum.COST]: MetricsTitleEnum.COST,
    [MetricsKeysEnum.AVG_CLICKS]: MetricsTitleEnum.AVG_CLICKS,
    [MetricsKeysEnum.AVG_CVR]: MetricsTitleEnum.AVG_CVR,
    [MetricsKeysEnum.CVR_MEDIAN]: MetricsTitleEnum.CVR_MEDIAN,
    [MetricsKeysEnum.THIRTY_PERCENT_OF_TROAS]:
      MetricsTitleEnum.THIRTY_PERCENT_OF_TROAS,
    [MetricsKeysEnum.THIRTY_FIVE_PERCENT_OF_ASP]:
      MetricsTitleEnum.THIRTY_FIVE_PERCENT_OF_ASP,
    [MetricsKeysEnum.FBA_INVENTORY]: MetricsTitleEnum.FBA_INVENTORY,
    [MetricsKeysEnum.WFS_INVENTORY]: MetricsTitleEnum.WFS_INVENTORY,
    [MetricsKeysEnum.DAYS_OF_SUPPLY]: MetricsTitleEnum.DAYS_OF_SUPPLY,
    [MetricsKeysEnum.WEEKS_OF_SUPPLY]: MetricsTitleEnum.WEEKS_OF_SUPPLY,
    [MetricsKeysEnum.ESTIMATED_EXCESS_QUANTITY]:
      MetricsTitleEnum.ESTIMATED_EXCESS_QUANTITY,
    [MetricsKeysEnum.TOTAL_ORDERS]: MetricsTitleEnum.TOTAL_ORDERS,
    [MetricsKeysEnum.TOTAL_ACOS]: MetricsTitleEnum.TOTAL_ACOS,
    [MetricsKeysEnum.NET_PROFIT]: MetricsTitleEnum.NET_PROFIT,
    [MetricsKeysEnum.INV_AGE_0_90]: MetricsTitleEnum.INV_AGE_0_90,
    [MetricsKeysEnum.INV_AGE_91_180]: MetricsTitleEnum.INV_AGE_91_180,
    [MetricsKeysEnum.INV_AGE_181_270]: MetricsTitleEnum.INV_AGE_181_270,
    [MetricsKeysEnum.INV_AGE_271_365]: MetricsTitleEnum.INV_AGE_271_365,
    [MetricsKeysEnum.INV_AGE_365_PLUS]: MetricsTitleEnum.INV_AGE_365_PLUS,
    [MetricsKeysEnum.TOTAL_AGED_INVENTORY]:
      MetricsTitleEnum.TOTAL_AGED_INVENTORY,

    [MetricsKeysEnum.CAMPAIGN_BUDGET]: MetricsTitleEnum.CAMPAIGN_BUDGET,
    [MetricsKeysEnum.OUT_OF_BUDGET]: MetricsTitleEnum.OUT_OF_BUDGET,
    [MetricsKeysEnum.DAYS_SINCE_CAMPAIGN_START]:
      MetricsTitleEnum.DAYS_SINCE_CAMPAIGN_START,
    [MetricsKeysEnum.AVG_SPEND]: MetricsTitleEnum.AVG_SPEND,
    [MetricsKeysEnum.CPA]: MetricsTitleEnum.CPA,
    [MetricsKeysEnum.TACOS_TARGET]: MetricsTitleEnum.TACOS_TARGET,
    [MetricsKeysEnum.OOB_PERCENTAGE]: MetricsTitleEnum.OOB_PERCENTAGE,
    [MetricsKeysEnum.OUT_OF_BUDGET_HOUR]: MetricsTitleEnum.OUT_OF_BUDGET_HOUR,

    [MetricsKeysEnum.TOS_IMPRESSIONS]: MetricsTitleEnum.TOS_IMPRESSIONS,
    [MetricsKeysEnum.TOS_CLICKS]: MetricsTitleEnum.TOS_CLICKS,
    [MetricsKeysEnum.TOS_UNITS_SOLD]: MetricsTitleEnum.TOS_UNITS_SOLD,
    [MetricsKeysEnum.TOS_CPC]: MetricsTitleEnum.TOS_CPC,
    [MetricsKeysEnum.TOS_CVR]: MetricsTitleEnum.TOS_CVR,
    [MetricsKeysEnum.TOS_CTR]: MetricsTitleEnum.TOS_CTR,
    [MetricsKeysEnum.TOS_SALES]: MetricsTitleEnum.TOS_SALES,
    [MetricsKeysEnum.TOS_SPEND]: MetricsTitleEnum.TOS_SPEND,
    [MetricsKeysEnum.TOS_ACOS]: MetricsTitleEnum.TOS_ACOS,
    [MetricsKeysEnum.TOS_ROAS]: MetricsTitleEnum.TOS_ROAS,

    [MetricsKeysEnum.ROS_IMPRESSIONS]: MetricsTitleEnum.ROS_IMPRESSIONS,
    [MetricsKeysEnum.ROS_CLICKS]: MetricsTitleEnum.ROS_CLICKS,
    [MetricsKeysEnum.ROS_UNITS_SOLD]: MetricsTitleEnum.ROS_UNITS_SOLD,
    [MetricsKeysEnum.ROS_CPC]: MetricsTitleEnum.ROS_CPC,
    [MetricsKeysEnum.ROS_CVR]: MetricsTitleEnum.ROS_CVR,
    [MetricsKeysEnum.ROS_CTR]: MetricsTitleEnum.ROS_CTR,
    [MetricsKeysEnum.ROS_SALES]: MetricsTitleEnum.ROS_SALES,
    [MetricsKeysEnum.ROS_SPEND]: MetricsTitleEnum.ROS_SPEND,
    [MetricsKeysEnum.ROS_ACOS]: MetricsTitleEnum.ROS_ACOS,
    [MetricsKeysEnum.ROS_ROAS]: MetricsTitleEnum.ROS_ROAS,

    [MetricsKeysEnum.PRODUCT_PAGE_IMPRESSIONS]:
      MetricsTitleEnum.PRODUCT_PAGE_IMPRESSIONS,
    [MetricsKeysEnum.PRODUCT_PAGE_CLICKS]: MetricsTitleEnum.PRODUCT_PAGE_CLICKS,
    [MetricsKeysEnum.PRODUCT_PAGE_UNITS_SOLD]:
      MetricsTitleEnum.PRODUCT_PAGE_UNITS_SOLD,
    [MetricsKeysEnum.PRODUCT_PAGE_CPC]: MetricsTitleEnum.PRODUCT_PAGE_CPC,
    [MetricsKeysEnum.PRODUCT_PAGE_CVR]: MetricsTitleEnum.PRODUCT_PAGE_CVR,
    [MetricsKeysEnum.PRODUCT_PAGE_CTR]: MetricsTitleEnum.PRODUCT_PAGE_CTR,
    [MetricsKeysEnum.PRODUCT_PAGE_SALES]: MetricsTitleEnum.PRODUCT_PAGE_SALES,
    [MetricsKeysEnum.PRODUCT_PAGE_SPEND]: MetricsTitleEnum.PRODUCT_PAGE_SPEND,
    [MetricsKeysEnum.PRODUCT_PAGE_ACOS]: MetricsTitleEnum.PRODUCT_PAGE_ACOS,
    [MetricsKeysEnum.PRODUCT_PAGE_ROAS]: MetricsTitleEnum.PRODUCT_PAGE_ROAS,

    [MetricsKeysEnum.BUY_BOX_IMPRESSIONS]: MetricsTitleEnum.BUY_BOX_IMPRESSIONS,
    [MetricsKeysEnum.BUY_BOX_CLICKS]: MetricsTitleEnum.BUY_BOX_CLICKS,
    [MetricsKeysEnum.BUY_BOX_UNITS_SOLD]: MetricsTitleEnum.BUY_BOX_UNITS_SOLD,
    [MetricsKeysEnum.BUY_BOX_CPC]: MetricsTitleEnum.BUY_BOX_CPC,
    [MetricsKeysEnum.BUY_BOX_CVR]: MetricsTitleEnum.BUY_BOX_CVR,
    [MetricsKeysEnum.BUY_BOX_CTR]: MetricsTitleEnum.BUY_BOX_CTR,
    [MetricsKeysEnum.BUY_BOX_SALES]: MetricsTitleEnum.BUY_BOX_SALES,
    [MetricsKeysEnum.BUY_BOX_SPEND]: MetricsTitleEnum.BUY_BOX_SPEND,
    [MetricsKeysEnum.BUY_BOX_ACOS]: MetricsTitleEnum.BUY_BOX_ACOS,
    [MetricsKeysEnum.BUY_BOX_ROAS]: MetricsTitleEnum.BUY_BOX_ROAS,

    [MetricsKeysEnum.SEARCH_INGRID_IMPRESSIONS]:
      MetricsTitleEnum.SEARCH_INGRID_IMPRESSIONS,
    [MetricsKeysEnum.SEARCH_INGRID_CLICKS]:
      MetricsTitleEnum.SEARCH_INGRID_CLICKS,
    [MetricsKeysEnum.SEARCH_INGRID_UNITS_SOLD]:
      MetricsTitleEnum.SEARCH_INGRID_UNITS_SOLD,
    [MetricsKeysEnum.SEARCH_INGRID_CPC]: MetricsTitleEnum.SEARCH_INGRID_CPC,
    [MetricsKeysEnum.SEARCH_INGRID_CVR]: MetricsTitleEnum.SEARCH_INGRID_CVR,
    [MetricsKeysEnum.SEARCH_INGRID_CTR]: MetricsTitleEnum.SEARCH_INGRID_CTR,
    [MetricsKeysEnum.SEARCH_INGRID_SALES]: MetricsTitleEnum.SEARCH_INGRID_SALES,
    [MetricsKeysEnum.SEARCH_INGRID_SPEND]: MetricsTitleEnum.SEARCH_INGRID_SPEND,
    [MetricsKeysEnum.SEARCH_INGRID_ACOS]: MetricsTitleEnum.SEARCH_INGRID_ACOS,
    [MetricsKeysEnum.SEARCH_INGRID_ROAS]: MetricsTitleEnum.SEARCH_INGRID_ROAS,

    [MetricsKeysEnum.HOME_PAGE_IMPRESSIONS]:
      MetricsTitleEnum.HOME_PAGE_IMPRESSIONS,
    [MetricsKeysEnum.HOME_PAGE_CLICKS]: MetricsTitleEnum.HOME_PAGE_CLICKS,
    [MetricsKeysEnum.HOME_PAGE_UNITS_SOLD]:
      MetricsTitleEnum.HOME_PAGE_UNITS_SOLD,
    [MetricsKeysEnum.HOME_PAGE_CPC]: MetricsTitleEnum.HOME_PAGE_CPC,
    [MetricsKeysEnum.HOME_PAGE_CVR]: MetricsTitleEnum.HOME_PAGE_CVR,
    [MetricsKeysEnum.HOME_PAGE_CTR]: MetricsTitleEnum.HOME_PAGE_CTR,
    [MetricsKeysEnum.HOME_PAGE_SALES]: MetricsTitleEnum.HOME_PAGE_SALES,
    [MetricsKeysEnum.HOME_PAGE_SPEND]: MetricsTitleEnum.HOME_PAGE_SPEND,
    [MetricsKeysEnum.HOME_PAGE_ACOS]: MetricsTitleEnum.HOME_PAGE_ACOS,
    [MetricsKeysEnum.HOME_PAGE_ROAS]: MetricsTitleEnum.HOME_PAGE_ROAS,

    [MetricsKeysEnum.STOCK_UP_IMPRESSIONS]:
      MetricsTitleEnum.STOCK_UP_IMPRESSIONS,
    [MetricsKeysEnum.STOCK_UP_CLICKS]: MetricsTitleEnum.STOCK_UP_CLICKS,
    [MetricsKeysEnum.STOCK_UP_UNITS_SOLD]: MetricsTitleEnum.STOCK_UP_UNITS_SOLD,
    [MetricsKeysEnum.STOCK_UP_CPC]: MetricsTitleEnum.STOCK_UP_CPC,
    [MetricsKeysEnum.STOCK_UP_CVR]: MetricsTitleEnum.STOCK_UP_CVR,
    [MetricsKeysEnum.STOCK_UP_CTR]: MetricsTitleEnum.STOCK_UP_CTR,
    [MetricsKeysEnum.STOCK_UP_SALES]: MetricsTitleEnum.STOCK_UP_SALES,
    [MetricsKeysEnum.STOCK_UP_SPEND]: MetricsTitleEnum.STOCK_UP_SPEND,
    [MetricsKeysEnum.STOCK_UP_ACOS]: MetricsTitleEnum.STOCK_UP_ACOS,
    [MetricsKeysEnum.STOCK_UP_ROAS]: MetricsTitleEnum.STOCK_UP_ROAS,

    [MetricsKeysEnum.STATISTICALLY_SIGNIFICANT_CLICKS]:
      MetricsTitleEnum.STATISTICALLY_SIGNIFICANT_CLICKS,
    [MetricsKeysEnum.SELLER_FULFILLED_INVENTORY]:
      MetricsTitleEnum.SELLER_FULFILLED_INVENTORY,
  };

export const CONDITION_OPERATOR_MAPPING: Record<
  AmazonRuleOperatorEnum,
  string
> = {
  [AmazonRuleOperatorEnum.EQUAL_TO]: '=',
  [AmazonRuleOperatorEnum.GREATER_THAN]: '>',
  [AmazonRuleOperatorEnum.GREATER_THAN_EQUAL_TO]: '>=',
  [AmazonRuleOperatorEnum.LESS_THAN]: '<',
  [AmazonRuleOperatorEnum.LESS_THAN_EQUAL_TO]: '<=',
};

export const CONDITION_OPERATOR_TITLE_MAPPING: Record<
  AmazonRuleOperatorEnum,
  string
> = {
  [AmazonRuleOperatorEnum.EQUAL_TO]: 'Equals',
  [AmazonRuleOperatorEnum.GREATER_THAN]: 'Greater Than',
  [AmazonRuleOperatorEnum.GREATER_THAN_EQUAL_TO]: 'Greater Than and Equal To',
  [AmazonRuleOperatorEnum.LESS_THAN]: 'Less Than',
  [AmazonRuleOperatorEnum.LESS_THAN_EQUAL_TO]: 'Less Than and Equal To',
};

export const ACTION_TYPE_TITLE_MAPPING: Record<RuleActionTypeEnum, string> = {
  [RuleActionTypeEnum.ENABLE]: 'Enable',
  [RuleActionTypeEnum.PAUSE]: 'Pause',
  [RuleActionTypeEnum.SET_BID_ABSOLUTE]: 'Set bid to',
  [RuleActionTypeEnum.INCREASE_BID]: 'Increase bid by',
  [RuleActionTypeEnum.DECREASE_BID]: 'Decrease bid by',
  [RuleActionTypeEnum.INCREASE_BUDGET]: 'Increase budget by',
  [RuleActionTypeEnum.DECREASE_BUDGET]: 'Decrease budget by',
  [RuleActionTypeEnum.INCREASE_BUDGET_PERCENTAGE]: 'Increase budget by (%)',
  [RuleActionTypeEnum.DECREASE_BUDGET_PERCENTAGE]: 'Decrease budget by (%)',
  [RuleActionTypeEnum.INCREASE_BUDGET_VALUE]: 'Increase budget by',
  [RuleActionTypeEnum.DECREASE_BUDGET_VALUE]: 'Decrease budget by',
  [RuleActionTypeEnum.HOLD_BUDGET]: 'Hold budget',

  [RuleActionTypeEnum.INCREASE_DAILY_BUDGET_PERCENTAGE]:
    'Increase daily budget by (%)',
  [RuleActionTypeEnum.DECREASE_DAILY_BUDGET_PERCENTAGE]:
    'Decrease daily budget by (%)',
  [RuleActionTypeEnum.INCREASE_DAILY_BUDGET_VALUE]: 'Increase daily budget by',
  [RuleActionTypeEnum.DECREASE_DAILY_BUDGET_VALUE]: 'Decrease daily budget by',
  [RuleActionTypeEnum.HOLD_DAILY_BUDGET]: 'Hold daily budget',

  [RuleActionTypeEnum.INCREASE_TOTAL_BUDGET_PERCENTAGE]:
    'Increase total budget by (%)',
  [RuleActionTypeEnum.DECREASE_TOTAL_BUDGET_PERCENTAGE]:
    'Decrease total budget by (%)',
  [RuleActionTypeEnum.INCREASE_TOTAL_BUDGET_VALUE]: 'Increase total budget by',
  [RuleActionTypeEnum.DECREASE_TOTAL_BUDGET_VALUE]: 'Decrease total budget by',
  [RuleActionTypeEnum.HOLD_TOTAL_BUDGET]: 'Hold total budget',

  [RuleActionTypeEnum.KEYWORD_HARVESTING]: 'Enable keyword harvesting',

  [RuleActionTypeEnum.SET_BIDDING_STRATEGY_DOWN_ONLY]:
    'Set bidding strategy to Down Only',
  [RuleActionTypeEnum.SET_BIDDING_STRATEGY_UP_DOWN]:
    'Set bidding strategy to Up and Down',
  [RuleActionTypeEnum.SET_BIDDING_STRATEGY_FIXED]:
    'Set bidding strategy to Fixed',
  [RuleActionTypeEnum.SET_BIDDING_STRATEGY_RULE_BASED]:
    'Set bidding strategy to Rule Based',
  [RuleActionTypeEnum.PLACEMENT_ADJUSTMENT]: '',
  [RuleActionTypeEnum.PLATFORM_ADJUSTMENT]: '',
  [RuleActionTypeEnum.INCREASE_BY_VALUE]: 'Increase by value',
  [RuleActionTypeEnum.DECREASE_BY_VALUE]: 'Decrease by value',
  [RuleActionTypeEnum.SET_TO_VALUE]: 'Set to value',
  [RuleActionTypeEnum.INCREASE_BY_PERCENTAGE]: 'Increase by (%)',
  [RuleActionTypeEnum.DECREASE_BY_PERCENTAGE]: 'Decrease by (%)',
};

export const ADJUSTMENT_TARGET_TITLE_MAPPING: Record<
  RuleAdjustmentTargetType,
  string
> = {
  [PlacementBids.TOP_OF_SEARCH]: 'Placement Top of Search',
  [PlacementBids.REST_OF_SEARCH]: 'Placement Rest of Search',
  [PlacementBids.PRODUCT_PAGES]: 'Placement Product Pages',
  [FilterDropdownValue.DESKTOP]: FilterDropdownValue.DESKTOP,
  [FilterDropdownValue.MOBILE]: FilterDropdownValue.MOBILE,
  [FilterDropdownValue.APP]: FilterDropdownValue.APP,
  [PageTypeActualEnum.ITEM]: PageTypeActualEnum.ITEM,
  [PageTypeActualEnum.SEARCH]: PageTypeActualEnum.SEARCH,
  [PageTypeActualEnum.HOMEPAGE]: PageTypeActualEnum.HOMEPAGE,
  [PageTypeActualEnum.STOCK_UP]: PageTypeActualEnum.STOCK_UP,
};

export const VALUE_TYPE_SYMBOL_MAPPING: Record<RuleValueTypeEnum, JSX.Element> =
  {
    [RuleValueTypeEnum.ABSOLUTE]: (
      <EqualsIcon size={'1.5rem'} color="#464646" weight="bold" />
    ),
    [RuleValueTypeEnum.CALCULATED]: (
      <XIcon size={'1.4rem'} color="#464646" weight="bold" />
    ),
    [RuleValueTypeEnum.DERIVED]: (
      <XIcon size={'1.4rem'} color="#464646" weight="bold" />
    ),
  };

export const BUDGET_METRIC_DISPLAY: Record<string, IBudgetMetricDisplay> = {
  [MetricsKeysEnum.CAMPAIGN_BUDGET]: {
    inputType: MetricInputTypeEnum.NUMBER,
    unit: getCurrencySymbolByCountry(),
  },
  [MetricsKeysEnum.OUT_OF_BUDGET]: {
    inputType: MetricInputTypeEnum.DROPDOWN,
    dropdownOptions: [
      { value: '1', label: FilterDropdownValue.YES },
      { value: '0', label: FilterDropdownValue.NO },
    ],
    allowedOperators: [AmazonRuleOperatorEnum.EQUAL_TO],
  },
  [MetricsKeysEnum.OUT_OF_BUDGET_HOUR]: {
    inputType: MetricInputTypeEnum.DROPDOWN,
    dropdownOptions: HOURS_OPTIONS,
  },
  [MetricsKeysEnum.DAYS_SINCE_CAMPAIGN_START]: {
    inputType: MetricInputTypeEnum.NUMBER,
    unit: ' days',
    forceAbsolute: true,
  },
  [MetricsKeysEnum.AVG_SPEND]: {
    inputType: MetricInputTypeEnum.NUMBER,
  },
  [MetricsKeysEnum.CPA]: {
    inputType: MetricInputTypeEnum.NUMBER,
  },
  [MetricsKeysEnum.TACOS_TARGET]: {
    inputType: MetricInputTypeEnum.NUMBER,
    unit: '%',
  },
  [MetricsKeysEnum.OOB_PERCENTAGE]: {
    inputType: MetricInputTypeEnum.NUMBER,
    unit: '%',
    forceAbsolute: true,
  },
};

export const RULE_ENTITY_TYPE_MAPPING: Partial<
  Record<RuleEntityTypeIdEnum, string>
> = {
  [RuleEntityTypeIdEnum.CAMPAIGN_ID]: 'Campaigns',
  [RuleEntityTypeIdEnum.ADGROUP_ID]: 'Ad Groups',
  [RuleEntityTypeIdEnum.AD_ITEM_ID]: 'Products',
  [RuleEntityTypeIdEnum.ASIN]: 'Products',
  [RuleEntityTypeIdEnum.KEYWORD_ID]: 'Keywords',
  [RuleEntityTypeIdEnum.TARGET_ID]: 'Targets',
};

export const RULE_ENTITY_TYPE_MAP: Record<
  RuleTypeEnum,
  RuleEntityTypeIdEnum[]
> = {
  [RuleTypeEnum.INVENTORY_RULE]: [
    RuleEntityTypeIdEnum.ASIN,
    RuleEntityTypeIdEnum.ITEM_ID,
  ],
  [RuleTypeEnum.SOV_RULE]: [RuleEntityTypeIdEnum.TARGET_ID],
  [RuleTypeEnum.KEYWORD_HARVESTING_RULE]: [
    RuleEntityTypeIdEnum.SOURCE_TARGET_MAPPING_ID,
  ],
  [RuleTypeEnum.BUDGET_RULE]: [RuleEntityTypeIdEnum.CAMPAIGN_ID],
  [RuleTypeEnum.PLACEMENT_RULE]: [RuleEntityTypeIdEnum.CAMPAIGN_ID],
  [RuleTypeEnum.PLATFORM_RULE]: [RuleEntityTypeIdEnum.CAMPAIGN_ID],
  [RuleTypeEnum.PAGE_TYPE_RULE]: [RuleEntityTypeIdEnum.CAMPAIGN_ID],
  [RuleTypeEnum.BIDDING_STRATEGY_RULE]: [RuleEntityTypeIdEnum.CAMPAIGN_ID],
  [RuleTypeEnum.STATE_CHANGE_RULE]: [RuleEntityTypeIdEnum.CAMPAIGN_ID],
  [RuleTypeEnum.BIDDER_RULE]: [RuleEntityTypeIdEnum.CAMPAIGN_ID],
  [RuleTypeEnum.DAYPARTING_RULE]: [RuleEntityTypeIdEnum.CAMPAIGN_ID],
  [RuleTypeEnum.KEYWORD_RULE]: [RuleEntityTypeIdEnum.KEYWORD_ID],
  [RuleTypeEnum.TARGET_RULE]: [RuleEntityTypeIdEnum.TARGET_ID],
  [RuleTypeEnum.UNKNOWN]: [RuleEntityTypeIdEnum.CAMPAIGN_ID],
};

export const RULES_FREQUENCY_TAB_OPTIONS: ITabData[] = [
  {
    value: Frequency.DAILY,
    label: 'Daily',
  },
  {
    value: Frequency.WEEKLY,
    label: 'Weekly',
  },
  {
    value: Frequency.MONTHLY,
    label: 'Monthly',
  },
];

export const RULES_WEEKDAY_MAPPING: Record<DayOfWeekEnum, string> = {
  [DayOfWeekEnum.SUNDAY]: 'Sun',
  [DayOfWeekEnum.MONDAY]: 'Mon',
  [DayOfWeekEnum.TUESDAY]: 'Tue',
  [DayOfWeekEnum.WEDNESDAY]: 'Wed',
  [DayOfWeekEnum.THURSDAY]: 'Thu',
  [DayOfWeekEnum.FRIDAY]: 'Fri',
  [DayOfWeekEnum.SATURDAY]: 'Sat',
};

export const RULES_STATUS_MAPPING: Record<RuleStatusEnum, string> = {
  [RuleStatusEnum.ENABLED]: 'Active',
  [RuleStatusEnum.PAUSED]: 'Paused',
  [RuleStatusEnum.DRAFT]: 'Draft',
  [RuleStatusEnum.ARCHIVED]: 'Archived',
  [RuleStatusEnum.ENDED]: 'Ended',
};

export const APPLIED_RULES_DEFAULT_SORTING_STATE: SortingState = [
  {
    id: AppliedRulesColumnIds.RULE_NAME,
    desc: false,
  },
];

export const RULE_TYPE_LABEL_MAPPING: { [key: string]: string } = {
  [RuleTypeEnum.INVENTORY_RULE]: 'Inventory',
  [RuleTypeEnum.SOV_RULE]: 'SOV',
  [RuleTypeEnum.KEYWORD_HARVESTING_RULE]: 'Keyword Harvesting',
  [RuleTypeEnum.BUDGET_RULE]: 'Budget',
  [RuleTypeEnum.PLACEMENT_RULE]: 'Placement',
  [RuleTypeEnum.PLATFORM_RULE]: 'Platform',
  [RuleTypeEnum.PAGE_TYPE_RULE]: 'Page Type',
  [RuleTypeEnum.BIDDING_STRATEGY_RULE]: 'Bidding Strategy',
  [RuleTypeEnum.STATE_CHANGE_RULE]: 'State Change',
  [RuleTypeEnum.BIDDER_RULE]: 'Bidder',
  [RuleTypeEnum.DAYPARTING_RULE]: 'Day Parting',
  [RuleTypeEnum.KEYWORD_RULE]: 'Keyword',
  [RuleTypeEnum.TARGET_RULE]: 'Target',
};

export const ACTION_TYPE_NO_VALUE: RuleActionTypeEnum[] = [
  RuleActionTypeEnum.PAUSE,
  RuleActionTypeEnum.ENABLE,
  RuleActionTypeEnum.HOLD_BUDGET,
  RuleActionTypeEnum.HOLD_DAILY_BUDGET,
  RuleActionTypeEnum.HOLD_TOTAL_BUDGET,
  RuleActionTypeEnum.KEYWORD_HARVESTING,
  RuleActionTypeEnum.SET_BIDDING_STRATEGY_DOWN_ONLY,
  RuleActionTypeEnum.SET_BIDDING_STRATEGY_UP_DOWN,
  RuleActionTypeEnum.SET_BIDDING_STRATEGY_FIXED,
  RuleActionTypeEnum.SET_BIDDING_STRATEGY_RULE_BASED,
];

export const ACTION_TYPE_PERCENTAGE: RuleActionTypeEnum[] = [
  RuleActionTypeEnum.INCREASE_BID,
  RuleActionTypeEnum.DECREASE_BID,
  RuleActionTypeEnum.INCREASE_BUDGET,
  RuleActionTypeEnum.DECREASE_BUDGET,
  RuleActionTypeEnum.INCREASE_BUDGET_PERCENTAGE,
  RuleActionTypeEnum.DECREASE_BUDGET_PERCENTAGE,
  RuleActionTypeEnum.INCREASE_DAILY_BUDGET_PERCENTAGE,
  RuleActionTypeEnum.DECREASE_DAILY_BUDGET_PERCENTAGE,
  RuleActionTypeEnum.INCREASE_TOTAL_BUDGET_PERCENTAGE,
  RuleActionTypeEnum.DECREASE_TOTAL_BUDGET_PERCENTAGE,
  RuleActionTypeEnum.INCREASE_BY_PERCENTAGE,
  RuleActionTypeEnum.DECREASE_BY_PERCENTAGE,
];

export const ACTION_TYPE_VALUE: RuleActionTypeEnum[] = [
  RuleActionTypeEnum.INCREASE_BUDGET_VALUE,
  RuleActionTypeEnum.DECREASE_BUDGET_VALUE,
  RuleActionTypeEnum.INCREASE_DAILY_BUDGET_VALUE,
  RuleActionTypeEnum.DECREASE_DAILY_BUDGET_VALUE,
  RuleActionTypeEnum.INCREASE_TOTAL_BUDGET_VALUE,
  RuleActionTypeEnum.DECREASE_TOTAL_BUDGET_VALUE,
  RuleActionTypeEnum.PLACEMENT_ADJUSTMENT,
  RuleActionTypeEnum.PLATFORM_ADJUSTMENT,
  RuleActionTypeEnum.SET_BID_ABSOLUTE,
  RuleActionTypeEnum.INCREASE_BY_VALUE,
  RuleActionTypeEnum.DECREASE_BY_VALUE,
  RuleActionTypeEnum.SET_TO_VALUE,
];

export const AUTOMATION_STATUS_ORDER: Record<string, number> = {
  [RuleAutomationStatusEnum.ENABLED]: 1,
  [RuleAutomationStatusEnum.PAUSED]: 2,
};

export const APPLIED_RULES_BULK_ACTIONS: IBulkAction[] = [
  { key: BulkActionKeyEnum.ACTIVE, node: <RulesActiveAction /> },
  { key: BulkActionKeyEnum.PAUSE, node: <RulesPauseAction /> },
  { key: BulkActionKeyEnum.ARCHIVE, node: <RulesArchiveAction /> },
];
