import {
  AmazonFulfillmentTypeEnum,
  ItemConditionDisplayEnum,
  ItemConditionEnum,
} from '@/enums/catalog.enums';
import { Filters } from '@/enums/filter.enums';
import {
  ProfitabilityMetricsKeyEnums,
  ProfitabilityMetricsLabelEnums,
  ProfitabilityOrdersMetricsKeyEnums,
  ProfitabilityOrdersMetricsLabelEnums,
  ProfitabilityTrendsMetricsKeyEnums,
} from '@/enums/profitability.enums';
import { Frequency, MarketplaceEnum, Range } from '@/enums/serp.enums';
import { TOAST_MESSAGE_TYPES } from '@/enums/toast.enums';
import { IAdvertisingNavigationBarOption } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { SortingState } from '@tanstack/react-table';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { ITabData } from 'src/app/components/common/tabs-select/tabs-select';
import {
  AdType,
  AdTypeShort,
  AdTypeShortLowerCase,
  Adjustments,
  AmazonAccountType,
  AmazonCostTypeEnum,
  AmazonSDBidOptimizationEnum,
  AmazonSDTacticsEnum,
  BiddingStrategy,
  CampaignStateEnum,
  CreativeTopOfSearch,
  MetricsKeysEnum,
  MetricsOptions,
  OverallAccountLevelTitles,
  SbAccountLevelTitles,
  SbAdGroupLevelTitles,
  SbCampaignLevelTitles,
  SbKeywordTargetingMatchTypes,
  SbNegativeTargetingKeywordMatchTypes,
  SbNegativeTargetingProductMatchTypesEnum,
  SdAccountLevelTitles,
  SdAdGroupLevelTitles,
  SdCampaignLevelTitles,
  SpAccountLevelTitles,
  SpAdGroupLevelTitles,
  SpAutoTargetingMatchTypesEnum,
  SpCampaignLevelTitles,
  SpCampaignTargetingTypes,
  SpNegTargetingKeywordMatchTypes,
  SpTargetingKeywordMatchTypes,
  SpTargetingProductMatchTypes,
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
import { EditAccessValues } from 'src/enums/edit-access.enums';
import { AMAZON_ADVERTISING_METRICS_TOOLTIPS } from 'src/enums/tooltip-texts.enums';
import {
  TargetingTypeEnum,
  WalmartAccountTypeEnum,
  WalmartAdTypeEnum,
  WalmartCampaignStatusEnum,
} from 'src/enums/walmart.enums';
import { IRadioSelect } from 'src/interfaces/advertising/advertising.interface';

export const noneAdTypeOption: IDropdownItem<string> = {
  value: AdType.NONE,
  label: 'Select Ad Type',
  isDisabled: false,
};

export const advertisingOptionAdTypeAmazon: IDropdownItem<string>[] = [
  {
    value: AdType.All,
    label: 'All',
    isDisabled: false,
  },
  {
    value: AdType.SPONSORED_PRODUCTS,
    label: 'Sponsored Products',
    isDisabled: false,
  },
  {
    value: AdType.SPONSORED_BRANDS,
    label: 'Sponsored Brands',
    isDisabled: false,
  },
  {
    value: AdType.SPONSORED_DISPLAY,
    label: 'Sponsored Display',
    isDisabled: false,
  },
];

export const advertisingOptionAdTypeWalmart: IDropdownItem<string>[] = [
  {
    value: AdType.All,
    label: 'All',
    isDisabled: false,
  },
  {
    value: AdType.SPONSORED_PRODUCTS,
    label: 'Sponsored Products',
    isDisabled: false,
  },
  {
    value: AdType.SPONSORED_BRANDS,
    label: 'Sponsored Brands',
    isDisabled: false,
  },
  {
    value: AdType.SPONSORED_VIDEO,
    label: 'Sponsored Video',
    isDisabled: false,
  },
];

export const frequency: IDropdownItem<Frequency>[] = [
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

export const range: IDropdownItem<string>[] = [
  {
    value: Range.TODAY,
    label: 'Today',
    isDisabled: false,
  },
  {
    value: Range.YESTERDAY,
    label: 'Yesterday',
    isDisabled: false,
  },
  {
    value: Range.LAST_7_DAYS,
    label: 'Last 7 days',
    isDisabled: false,
  },
  {
    value: Range.LAST_14_DAYS,
    label: 'Last 14 days',
    isDisabled: false,
  },
  {
    value: Range.LAST_30_DAYS,
    label: 'Last 30 days',
    isDisabled: false,
  },
  {
    value: Range.THIS_MONTH,
    label: 'This month',
    isDisabled: false,
  },
  {
    value: Range.LAST_MONTH,
    label: 'Last month',
    isDisabled: false,
  },
  {
    value: Range.LAST_3_MONTHS,
    label: 'Last 3 months',
    isDisabled: false,
  },
  {
    value: Range.THIS_YEAR,
    label: 'This year',
    isDisabled: false,
  },
  {
    value: Range.LAST_YEAR,
    label: 'Last year',
    isDisabled: false,
  },
];

export const overallAdvertisingMetricsOptions: IDropdownItem<string>[] = [
  {
    label: 'Impressions',
    value: MetricsOptions.IMPRESSIONS,
    selected: false,
    isDisabled: false,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.IMPRESSIONS,
  },
  {
    label: 'Clicks',
    value: MetricsOptions.CLICKS,
    selected: false,
    isDisabled: false,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.CLICKS,
  },
  {
    label: 'CTR',
    value: MetricsOptions.CTR,
    selected: false,
    isDisabled: false,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.CTR,
  },
  {
    label: 'CPC',
    value: MetricsOptions.CPC,
    selected: false,
    isDisabled: false,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.CPC,
  },
  {
    label: 'Ad Spend',
    value: MetricsOptions.AD_SPEND,
    selected: false,
    isDisabled: false,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.AD_SPEND,
  },
  {
    label: 'Ad Sales',
    value: MetricsOptions.AD_SALES,
    selected: false,
    isDisabled: false,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.AD_SALES,
  },
  {
    label: 'Orders',
    value: MetricsOptions.ORDERS,
    selected: false,
    isDisabled: true,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.ORDERS,
  },
  {
    label: 'Ad Units',
    value: MetricsOptions.AD_UNITS,
    selected: false,
    isDisabled: false,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.AD_UNITS,
  },
  {
    label: 'CVR',
    value: MetricsOptions.CVR,
    selected: false,
    isDisabled: false,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.CVR,
  },
  {
    label: 'ROAS',
    value: MetricsOptions.ROAS,
    selected: false,
    isDisabled: false,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.ROAS,
  },
  {
    label: 'ACOS',
    value: MetricsOptions.ACOS,
    selected: false,
    isDisabled: false,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.ACOS,
  },
  {
    label: 'Total Units',
    value: MetricsOptions.TOTAL_UNITS,
    selected: false,
    isDisabled: false,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.TOTAL_UNITS,
  },
  {
    label: 'Total Sales',
    value: MetricsOptions.TOTAL_SALES,
    selected: false,
    isDisabled: false,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.TOTAL_SALES,
  },
  {
    label: 'TACOS',
    value: MetricsOptions.TACOS,
    selected: false,
    isDisabled: false,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.TACOS,
  },
  {
    label: '% of orders NTB',
    value: MetricsOptions.PERCENTAGE_ORDERS_NTB,
    selected: false,
    isDisabled: true,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.PERCENTAGE_ORDERS_NTB,
  },
  {
    label: '% of sales NTB',
    value: MetricsOptions.PERCENTAGE_SALES_NTB,
    selected: false,
    isDisabled: true,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.PERCENTAGE_SALES_NTB,
  },
  {
    label: 'VCPM',
    value: MetricsOptions.VCPM,
    selected: false,
    isDisabled: true,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.VCPM,
  },
  {
    label: 'NTB orders',
    value: MetricsOptions.NTB_ORDERS,
    selected: false,
    isDisabled: true,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.NTB_ORDERS,
  },
  {
    label: 'NTB sales',
    value: MetricsOptions.NTB_SALES,
    selected: false,
    isDisabled: true,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.NTB_SALES,
  },
  {
    label: 'Viewable impressions',
    value: MetricsOptions.VIEWABLE_IMPRESSIONS,
    selected: false,
    isDisabled: true,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.VIEWABLE_IMPRESSIONS,
  },
];

export const advertisingMetricsOptions: IDropdownItem<string>[] = [
  {
    label: 'Impressions',
    value: MetricsOptions.IMPRESSIONS,
    selected: false,
    isDisabled: false,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.IMPRESSIONS,
  },
  {
    label: 'Clicks',
    value: MetricsOptions.CLICKS,
    selected: false,
    isDisabled: false,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.CLICKS,
  },
  {
    label: 'CTR',
    value: MetricsOptions.CTR,
    selected: false,
    isDisabled: false,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.CTR,
  },
  {
    label: 'CPC',
    value: MetricsOptions.CPC,
    selected: false,
    isDisabled: false,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.CPC,
  },
  {
    label: 'Ad Spend',
    value: MetricsOptions.AD_SPEND,
    selected: false,
    isDisabled: false,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.AD_SPEND,
  },
  {
    label: 'Ad Sales',
    value: MetricsOptions.AD_SALES,
    selected: false,
    isDisabled: false,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.AD_SALES,
  },
  {
    label: 'Orders',
    value: MetricsOptions.ORDERS,
    selected: false,
    isDisabled: true,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.ORDERS,
  },
  {
    label: 'Ad Units',
    value: MetricsOptions.AD_UNITS,
    selected: false,
    isDisabled: false,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.AD_UNITS,
  },
  {
    label: 'CVR',
    value: MetricsOptions.CVR,
    selected: false,
    isDisabled: false,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.CVR,
  },
  {
    label: 'ROAS',
    value: MetricsOptions.ROAS,
    selected: false,
    isDisabled: false,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.ROAS,
  },
  {
    label: 'ACOS',
    value: MetricsOptions.ACOS,
    selected: false,
    isDisabled: false,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.ACOS,
  },
  {
    label: 'Total Units',
    value: MetricsOptions.TOTAL_UNITS,
    selected: false,
    isDisabled: true,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.TOTAL_UNITS,
  },
  {
    label: 'Total Sales',
    value: MetricsOptions.TOTAL_SALES,
    selected: false,
    isDisabled: true,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.TOTAL_SALES,
  },
  {
    label: 'TACOS',
    value: MetricsOptions.TACOS,
    selected: false,
    isDisabled: true,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.TACOS,
  },
  {
    label: '% of orders NTB',
    value: MetricsOptions.PERCENTAGE_ORDERS_NTB,
    selected: false,
    isDisabled: true,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.PERCENTAGE_ORDERS_NTB,
  },
  {
    label: '% of sales NTB',
    value: MetricsOptions.PERCENTAGE_SALES_NTB,
    selected: false,
    isDisabled: true,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.PERCENTAGE_SALES_NTB,
  },
  {
    label: 'VCPM',
    value: MetricsOptions.VCPM,
    selected: false,
    isDisabled: true,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.VCPM,
  },
  {
    label: 'NTB orders',
    value: MetricsOptions.NTB_ORDERS,
    selected: false,
    isDisabled: true,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.NTB_ORDERS,
  },
  {
    label: 'NTB sales',
    value: MetricsOptions.NTB_SALES,
    selected: false,
    isDisabled: true,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.NTB_SALES,
  },
  {
    label: 'Viewable impressions',
    value: MetricsOptions.VIEWABLE_IMPRESSIONS,
    selected: false,
    isDisabled: true,
    tooltipText: AMAZON_ADVERTISING_METRICS_TOOLTIPS.VIEWABLE_IMPRESSIONS,
  },
];

export const creativeTopOfSearchOptions: IDropdownItem<string>[] = [
  {
    label: 'Desktop : Top of Search',
    value: CreativeTopOfSearch.DESKTOP,
  },
  {
    label: 'Mobile : Top of Search',
    value: CreativeTopOfSearch.MOBILE,
  },
];

export const adjustmentOptions: IDropdownItem<Adjustments>[] = [
  {
    value: Adjustments.INCREASE_PERCENTAGE,
    label: 'Increase By %',
  },
  {
    value: Adjustments.DECREASE_PERCENTAGE,
    label: 'Decrease By %',
  },
  {
    value: Adjustments.INCREASE_VALUE,
    label: 'Increase By Value',
  },
  {
    value: Adjustments.DECREASE_VALUE,
    label: 'Decrease By Value',
  },
  {
    value: Adjustments.SET_TO_VALUE,
    label: 'Set to Value',
  },
];

export const biddingStrategyOptions: IDropdownItem<BiddingStrategy>[] = [
  {
    value: BiddingStrategy.DOWN_ONLY,
    label: 'Down Only',
  },
  {
    value: BiddingStrategy.UP_DOWN,
    label: 'Up & Down',
  },
  {
    value: BiddingStrategy.FIXED_BIDS,
    label: 'Fixed bids',
  },
  {
    value: BiddingStrategy.RULE_BASED,
    label: `Amazon's Rule Based`,
  },
];

export const statusOptions: IDropdownItem<string>[] = [
  {
    value: CampaignStateEnum.ENABLED,
    label: 'Enabled',
    marketplace: MarketplaceEnum.AMAZON,
  },
  {
    value: CampaignStateEnum.PAUSED,
    label: 'Paused',
    marketplace: MarketplaceEnum.AMAZON,
  },
  {
    value: WalmartCampaignStatusEnum.SCHEDULED,
    label: 'Scheduled',
    marketplace: MarketplaceEnum.WALMART,
  },
  {
    value: WalmartCampaignStatusEnum.LIVE,
    label: 'Live',
    marketplace: MarketplaceEnum.WALMART,
  },
  {
    value: WalmartCampaignStatusEnum.COMPLETED,
    label: 'Rejected',
    marketplace: MarketplaceEnum.WALMART,
  },
  {
    value: WalmartCampaignStatusEnum.ENABLED,
    label: 'Enabled',
    marketplace: MarketplaceEnum.WALMART,
  },
  {
    value: WalmartCampaignStatusEnum.PAUSED,
    label: 'Paused',
    marketplace: MarketplaceEnum.WALMART,
  },
  {
    value: WalmartCampaignStatusEnum.PROPOSAL,
    label: 'Proposal',
    marketplace: MarketplaceEnum.WALMART,
  },
  {
    value: WalmartCampaignStatusEnum.RESCHEDULED,
    label: 'Rescheduled',
    marketplace: MarketplaceEnum.WALMART,
  },
];

export const advEditAccessTabData: ITabData[] = [
  {
    value: EditAccessValues.View,
    label: `View`,
  },
  {
    value: EditAccessValues.Edit,
    label: `Edit`,
  },
];

export const percentageMetrics: string[] = [
  MetricsKeysEnum.ACOS,
  MetricsKeysEnum.CTR,
  MetricsKeysEnum.CVR,
  MetricsKeysEnum.CVR_ORDERS,
  MetricsKeysEnum.CVR_UNITS,
  MetricsKeysEnum.PERCENTAGE_ORDERS_NTB,
  MetricsKeysEnum.PERCENTAGE_SALES_NTB,
  MetricsKeysEnum.PERCENTAGE_UNITS_NTB,
  MetricsKeysEnum.TACOS,
  MetricsKeysEnum.VIDEO_5_SECOND_VIEW_RATE,
  MetricsKeysEnum.PERCENT_NTB_UNITS,
  MetricsKeysEnum.PERCENT_NTB_ORDERS,
  MetricsKeysEnum.PERCENT_NTB_SALES,
  MetricsKeysEnum.BID_MULTIPLIER,
  MetricsKeysEnum.VTR,
  MetricsKeysEnum.VCTR,
  MetricsKeysEnum.VIDEO_5_SEC_VIEW_RATE,
  MetricsKeysEnum.LQS,
  MetricsKeysEnum.PRODUCT_SOV,
  MetricsKeysEnum.GROSS_MARGIN_PERCENTAGE,
  MetricsKeysEnum.CVR_UNIT_SOLD_BASED,
  MetricsKeysEnum.CVR_ORDER_BASED,
  MetricsOptions.ACOS,
  MetricsOptions.CTR,
  MetricsOptions.CVR,
  MetricsOptions.CVR_ORDERS,
  MetricsOptions.CVR_UNITS,
  MetricsOptions.PERCENTAGE_ORDERS_NTB,
  MetricsOptions.PERCENTAGE_SALES_NTB,
  MetricsOptions.PERCENTAGE_UNITS_NTB,
  MetricsOptions.TACOS,
  ProfitabilityMetricsKeyEnums.MARGIN,
  ProfitabilityMetricsKeyEnums.ROI,
  ProfitabilityMetricsLabelEnums.MARGIN,
  ProfitabilityMetricsLabelEnums.ROI,
  ProfitabilityMetricsLabelEnums.REFUND_PERCENTAGE,
  ProfitabilityMetricsKeyEnums.REFUND_PERCENTAGE,
];

export const currencyMetrics: string[] = [
  MetricsKeysEnum.AD_SPEND,
  MetricsKeysEnum.AD_SALES,
  MetricsKeysEnum.ROAS,
  MetricsKeysEnum.CPC,
  MetricsKeysEnum.CUSTOM_BID,
  MetricsKeysEnum.BID,
  MetricsKeysEnum.ADVERTISED_SKU_SALES,
  MetricsKeysEnum.OTHER_SKU_SALES,
  MetricsKeysEnum.NTB_SALES,
  MetricsKeysEnum.TOTAL_SALES,
  MetricsKeysEnum.VCPM,
  MetricsKeysEnum.GMV,
  MetricsKeysEnum.DEFAULT_BID,
  MetricsKeysEnum.BUDGET,
  MetricsKeysEnum.ADVERTISED_SALES,
  MetricsKeysEnum.OTHER_SALES,
  MetricsKeysEnum.TOTAL_BUDGET,
  MetricsKeysEnum.DAILY_BUDGET,
  MetricsKeysEnum.BID_WALMART,
  MetricsKeysEnum.MIN_BID,
  MetricsKeysEnum.MAX_BID,
  MetricsKeysEnum.TROAS,
  MetricsKeysEnum.ASIN_PRICE,
  MetricsKeysEnum.VIEW_THROUGH_AD_SALES,
  MetricsKeysEnum.COMPLETE_VIEW_AD_SALES,
  MetricsKeysEnum.OTHER_COMPLETE_VIEW_AD_SALES,
  MetricsKeysEnum.REVENUE_COST,
  MetricsKeysEnum.INVENTORY_VALUE,
  MetricsKeysEnum.INVENTORY_VALUE_COGS,
  MetricsKeysEnum.INVENTORY_VALUE_RETAIL,
  MetricsKeysEnum.PRICE,
  MetricsKeysEnum.COGS,
  MetricsKeysEnum.WALMART_FEE,
  MetricsKeysEnum.GROSS_MARGIN,
  MetricsKeysEnum.CANCELLED_SALES_PRICE,
  MetricsKeysEnum.REFUND_SALES,
  MetricsKeysEnum.GROSS_SALES,
  MetricsKeysEnum.PROMO_SPEND,
  MetricsKeysEnum.SUGGESTED_DAILY_BUDGET_COLUMN,
  MetricsKeysEnum.SUGGESTED_TOTAL_BUDGET_COLUMN,
  MetricsKeysEnum.IN_STORE_ATTRIBUTES_SALES,
  MetricsKeysEnum.IN_STORE_ADVERTISED_SALES,
  MetricsKeysEnum.IN_STORE_OTHER_SALES,
  MetricsKeysEnum.OMNI_CHANNEL_SALES,
  MetricsKeysEnum.OMNI_CHANNEL_ROAS,
  MetricsKeysEnum.LISTING_PRICE,
  MetricsKeysEnum.GMV_COMMISSION,
  MetricsOptions.AD_SPEND,
  MetricsOptions.AD_SALES,
  MetricsOptions.ROAS,
  MetricsOptions.CPC,
  MetricsOptions.ADVERTISED_SKU_SALES,
  MetricsOptions.OTHER_SKU_SALES,
  MetricsOptions.NTB_SALES,
  MetricsOptions.TOTAL_SALES,
  ProfitabilityMetricsLabelEnums.TOTAL_SALES,
  ProfitabilityMetricsLabelEnums.GMV_SALES,
  ProfitabilityMetricsLabelEnums.TOTAL_AUTH_SALES,
  ProfitabilityMetricsLabelEnums.ORGANIC_SALES,
  ProfitabilityMetricsLabelEnums.TOTAL_RETURNS_VALUE,
  ProfitabilityMetricsLabelEnums.RETURN_SALES,
  ProfitabilityMetricsLabelEnums.CANCELLED_SALES,
  ProfitabilityMetricsLabelEnums.WFS_SALES,
  ProfitabilityMetricsLabelEnums.SELLER_SALES,
  ProfitabilityMetricsLabelEnums.SELLER_FULFILLED_SALES,
  ProfitabilityMetricsLabelEnums.AD_SALES,
  ProfitabilityMetricsLabelEnums.SP_AD_SALES,
  ProfitabilityMetricsLabelEnums.SB_AD_SALES,
  ProfitabilityMetricsLabelEnums.SV_AD_SALES,
  ProfitabilityMetricsLabelEnums.NET_PROFIT,
  ProfitabilityMetricsLabelEnums.TOTAL_EXPENSES,
  ProfitabilityMetricsLabelEnums.TOTAL_AD_SPEND,
  ProfitabilityMetricsLabelEnums.TOTAL_WALMART_ADJUSTMENT,
  ProfitabilityMetricsLabelEnums.COMMISSION_ON_PRODUCT,
  ProfitabilityMetricsLabelEnums.COMMISSION_ON_SHIPPING,
  ProfitabilityMetricsLabelEnums.WFS_FULFILLMENT_FEE,
  ProfitabilityMetricsLabelEnums.EXTRA_DISCOUNT,
  ProfitabilityMetricsLabelEnums.PROMO_CODE,
  ProfitabilityMetricsLabelEnums.OTHER_TAX_FEES,
  ProfitabilityMetricsLabelEnums.PRODUCT_TAX,
  ProfitabilityMetricsLabelEnums.PRODUCT_TAX_WITHHELD,
  ProfitabilityMetricsLabelEnums.EXCESS_REFUND_ADJUSTMENT,
  ProfitabilityMetricsLabelEnums.WALMART_FUNDED_SAVINGS,
  ProfitabilityMetricsLabelEnums.DISPUTE_SETTLEMENT_AMOUNT,
  ProfitabilityMetricsLabelEnums.TOTAL_REFUND_COST,
  ProfitabilityMetricsLabelEnums.TOTAL_SHIPPING_COST,
  ProfitabilityMetricsLabelEnums.SHIPPING,
  ProfitabilityMetricsLabelEnums.SHIPPING_TAX,
  ProfitabilityMetricsLabelEnums.SHIPPING_TAX_WITHHELD,
  ProfitabilityMetricsLabelEnums.WFS_RETURN_SHIPPING_FEE,
  ProfitabilityMetricsLabelEnums.WALMART_RETURN_SHIPPING_CHARGE,
  ProfitabilityMetricsLabelEnums.ADDITIONAL_FEE,
  ProfitabilityMetricsLabelEnums.CUSTOMER_RETURN_REVERSAL,
  ProfitabilityMetricsLabelEnums.FAILED_RETURN_DELIVERY_PROCESSING_CHARGE,
  ProfitabilityMetricsLabelEnums.REFUND_SALES,
  ProfitabilityMetricsLabelEnums.AD_SPEND,
  ProfitabilityMetricsLabelEnums.SP_AD_SPEND,
  ProfitabilityMetricsLabelEnums.SB_AD_SPEND,
  ProfitabilityMetricsLabelEnums.SV_AD_SPEND,
  ProfitabilityMetricsLabelEnums.PRODUCT_PRICE,
  ProfitabilityMetricsLabelEnums.ORDER_SALES,
  ProfitabilityMetricsKeyEnums.TOTAL_AUTH_SALES,
  ProfitabilityMetricsKeyEnums.TOTAL_REFUND_COST,
  ProfitabilityMetricsKeyEnums.TOTAL_AD_SPEND,
  ProfitabilityMetricsKeyEnums.TOTAL_EXPENSES,
  ProfitabilityMetricsKeyEnums.EST_PAYOUT,
  ProfitabilityMetricsKeyEnums.NET_PROFIT,
  ProfitabilityMetricsKeyEnums.ADDITIONAL_FEE,
  ProfitabilityMetricsKeyEnums.SHIPPING,
  ProfitabilityMetricsKeyEnums.SHIPPING_TAX,
  ProfitabilityMetricsKeyEnums.TOTAL_SHIPPING_COST,
  ProfitabilityMetricsKeyEnums.WFS_RETURN_SHIPPING_FEE,
  ProfitabilityMetricsKeyEnums.COMMISSION_ON_SHIPPING,
  ProfitabilityMetricsKeyEnums.SHIPPING_TAX_WITHHELD,
  ProfitabilityMetricsKeyEnums.WALMART_RETURN_SHIPPING_CHARGE,
  ProfitabilityMetricsKeyEnums.TOTAL_WALMART_ADJUSTMENT,
  ProfitabilityMetricsKeyEnums.CANCELLED_SALES,
  ProfitabilityMetricsKeyEnums.RETURN_SALES,
  ProfitabilityMetricsKeyEnums.SB_AD_SALES,
  ProfitabilityMetricsKeyEnums.SP_AD_SALES,
  ProfitabilityMetricsKeyEnums.SV_AD_SALES,
  ProfitabilityMetricsKeyEnums.ORGANIC_SALES,
  ProfitabilityMetricsKeyEnums.COMMISSION_ON_PRODUCT,
  ProfitabilityMetricsKeyEnums.COMMISSION_ON_SHIPPING,
  ProfitabilityMetricsKeyEnums.WFS_FULFILLMENT_FEE,
  ProfitabilityMetricsKeyEnums.EXTRA_DISCOUNT,
  ProfitabilityMetricsKeyEnums.EXCESS_REFUND_ADJUSTMENT,
  ProfitabilityMetricsKeyEnums.PRODUCT_TAX,
  ProfitabilityMetricsKeyEnums.PRODUCT_TAX_WITHHELD,
  ProfitabilityMetricsKeyEnums.WALMART_FUNDED_SAVINGS,
  ProfitabilityMetricsKeyEnums.DISPUTE_SETTLEMENT_AMOUNT,
  ProfitabilityMetricsKeyEnums.PROMO_CODE,
  ProfitabilityMetricsKeyEnums.OTHER_TAX_FEES,
  ProfitabilityOrdersMetricsKeyEnums.ORDER_SALES,
  ProfitabilityOrdersMetricsKeyEnums.TOTAL_SALES,
  ProfitabilityMetricsKeyEnums.WFS_FULFILLMENT_FEE,
  ProfitabilityMetricsKeyEnums.EXTRA_DISCOUNT,
  ProfitabilityOrdersMetricsKeyEnums.SHIPPING,
  ProfitabilityOrdersMetricsKeyEnums.SHIPPING_TAX,
  ProfitabilityOrdersMetricsKeyEnums.SHIPPING_TAX_WITHHELD,
  ProfitabilityOrdersMetricsKeyEnums.NET_PROFIT,
  ProfitabilityOrdersMetricsKeyEnums.ADDITIONAL_FEE,
  ProfitabilityTrendsMetricsKeyEnums.OVERALL_AD_SALES,
  ProfitabilityMetricsKeyEnums.SP_AD_SPEND,
  ProfitabilityMetricsKeyEnums.SB_AD_SPEND,
  ProfitabilityMetricsKeyEnums.SV_AD_SPEND,
  ProfitabilityMetricsKeyEnums.OVERALL_AD_SPEND,
  ProfitabilityMetricsKeyEnums.OVERALL_SP_AD_SPEND,
  ProfitabilityMetricsKeyEnums.OVERALL_SB_AD_SPEND,
  ProfitabilityMetricsKeyEnums.OVERALL_SD_AD_SPEND,
  Filters.LIST_PRICE,
  ProfitabilityMetricsKeyEnums.OVERALL_ORGANIC_SALES,
  ProfitabilityMetricsKeyEnums.OVERALL_SP_AD_SALES,
  ProfitabilityMetricsKeyEnums.OVERALL_SB_AD_SALES,
  ProfitabilityMetricsKeyEnums.OVERALL_SD_AD_SALES,
  ProfitabilityMetricsKeyEnums.ORGANIC_AD_SALES,
  ProfitabilityMetricsKeyEnums.SD_AD_SALES,
  ProfitabilityMetricsKeyEnums.SD_AD_SPEND,
  ProfitabilityMetricsKeyEnums.AMZ_TOTAL_RETURN_AMOUNT,
  ProfitabilityMetricsLabelEnums.TOTAL_COGS,
  ProfitabilityMetricsLabelEnums.TOTAL_AD_SALES,
  ProfitabilityMetricsLabelEnums.FBA_FULFILLMENT_FEES,
  ProfitabilityMetricsLabelEnums.PROMOTION,
  ProfitabilityMetricsLabelEnums.REFERRAL_FEES,
  ProfitabilityMetricsLabelEnums.VALUE_OF_RETURNED_ITEMS,
  ProfitabilityMetricsKeyEnums.VALUE_OF_RETURNED_ITEMS,
  ProfitabilityMetricsKeyEnums.PROMOTION,
  ProfitabilityMetricsKeyEnums.REFERRAL_FEES,
  ProfitabilityMetricsKeyEnums.REFERRAL_FEE,
  ProfitabilityMetricsKeyEnums.FBA_FULFILLMENT_FEES,
  ProfitabilityMetricsKeyEnums.FBA_FEES,
  ProfitabilityMetricsKeyEnums.FBA_RETURN_FEES,
  ProfitabilityMetricsKeyEnums.FBA_FULLFILLMENT,
  ProfitabilityMetricsKeyEnums.FBA_FULLFILMENT,
  ProfitabilityMetricsKeyEnums.SETTLEMENT_AMOUNT,
  ProfitabilityMetricsKeyEnums.TOTAL_RETURN_SALES,
  ProfitabilityMetricsKeyEnums.TOTAL_REFUND_COMMISSION,
  ProfitabilityMetricsKeyEnums.TOTAL_REFUND_REFERRAL_FEE,
  ProfitabilityMetricsKeyEnums.TOTAL_REFUND_REFERRAL_FEES,
  ProfitabilityMetricsKeyEnums.TOTAL_PRINCIPAL_AMOUNT,
  ProfitabilityMetricsKeyEnums.PRINCIPAL_AMOUNT,
  ProfitabilityMetricsKeyEnums.TOTAL_ORDERS_REFERRAL_FEE,
  ProfitabilityMetricsKeyEnums.TOTAL_ORDERS_FBA_FULFILLMENT_FEES,
  ProfitabilityMetricsKeyEnums.TOTAL_RETURN_PRINCIPAL_AMOUNT,
  ProfitabilityMetricsKeyEnums.RETURN_PRINCIPAL_AMOUNT,
  ProfitabilityMetricsKeyEnums.TOTAL_REFUND_COMMISSION_FEES,
  ProfitabilityMetricsKeyEnums.REFUND_COMMISSION_FEES,
  ProfitabilityMetricsKeyEnums.TOTAL_REFUND_FBA_CUSTOMER_RETURN_FEES,
  ProfitabilityMetricsKeyEnums.FBA_CUSTOMER_RETURN_FEES,
  ProfitabilityMetricsKeyEnums.REFUND_REFERRAL_FEE,
  ProfitabilityMetricsKeyEnums.AMAZON_FEE_NET_PROFIT,
  ProfitabilityMetricsKeyEnums.REFUND_FEE_NET_PROFIT,
  ProfitabilityMetricsKeyEnums.AMZ_TOTAL_RETURN_REFERRAL_AMOUNT,
  ProfitabilityMetricsKeyEnums.AMZ_TOTAL_RETURN_COMMISSION_AMOUNT,
  ProfitabilityMetricsKeyEnums.TOTAL_COGS,
  ProfitabilityOrdersMetricsLabelEnums.COGS,
  ProfitabilityMetricsLabelEnums.EST_PAYOUT,
  ProfitabilityMetricsKeyEnums.TOTAL_AMAZON_FEES,
  ProfitabilityMetricsKeyEnums.TOTAL_REFUND_FEES,
  ProfitabilityTrendsMetricsKeyEnums.ITEM_PRICE,
];

export const numberMetrics: string[] = [
  MetricsKeysEnum.IMPRESSIONS,
  MetricsKeysEnum.CLICKS,
  MetricsKeysEnum.AD_UNITS,
  MetricsKeysEnum.AD_ORDERS,
  MetricsKeysEnum.ADVERTISED_SKU_UNITS,
  MetricsKeysEnum.OTHER_SKU_UNITS,
  MetricsKeysEnum.NTB_UNITS,
  MetricsKeysEnum.NTB_ORDERS,
  MetricsKeysEnum.TOTAL_UNITS,
  MetricsKeysEnum.VIEWABLE_IMPRESSIONS,
  MetricsKeysEnum.COMPLETE_VIEW_AD_ORDERS,
  MetricsKeysEnum.VIDEO_5_SECOND_VIEWS,
  MetricsKeysEnum.UNITS_SOLD,
  MetricsKeysEnum.ADVERTISED_UNITS,
  MetricsKeysEnum.OTHER_UNITS,
  MetricsKeysEnum.ADGROUP_COUNT,
  MetricsKeysEnum.RATINGS,
  MetricsKeysEnum.REVIEWS,
  MetricsKeysEnum.COMPLETE_VIEW_ORDERS,
  MetricsKeysEnum.COMPLETE_VIEW_AD_UNITS,
  MetricsKeysEnum.VIDEO_COMPLETE_VIEWS,
  MetricsKeysEnum.VIDEO_FIRST_QUARTILE_VIEWS,
  MetricsKeysEnum.VIDEO_IMPRESSIONS,
  MetricsKeysEnum.VIDEO_MIDPOINT_VIEWS,
  MetricsKeysEnum.VIDEO_THIRD_QUARTILE_VIEWS,
  MetricsKeysEnum.VIDEO_UNMUTES,
  MetricsKeysEnum.VIDEO_5_SEC_VIEWS,
  MetricsKeysEnum.VIEW_THROUGH_AD_ORDERS,
  MetricsKeysEnum.VIEW_THROUGH_AD_UNITS,
  MetricsKeysEnum.INVENTORY,
  MetricsKeysEnum.AVAIL_TO_SELL_QUANTITY,
  MetricsKeysEnum.RETURNS,
  MetricsKeysEnum.CANCELLED_ORDERS,
  MetricsKeysEnum.REFUND_ORDERS,
  MetricsKeysEnum.GROSS_UNITS_SOLD,
  MetricsKeysEnum.AD_UNITS_SOLD,
  MetricsKeysEnum.CAMPAIGNS,
  MetricsKeysEnum.IN_STORE_UNITS_SOLD,
  MetricsKeysEnum.IN_STORE_ORDERS,
  MetricsKeysEnum.INPUT_QUANTITY,
  MetricsOptions.IMPRESSIONS,
  MetricsOptions.CLICKS,
  MetricsOptions.AD_UNITS,
  MetricsOptions.AD_ORDERS,
  MetricsOptions.ADVERTISED_SKU_UNITS,
  MetricsOptions.OTHER_SKU_UNITS,
  MetricsOptions.NTB_UNITS,
  MetricsOptions.NTB_ORDERS,
  MetricsOptions.TOTAL_UNITS,
  ProfitabilityMetricsKeyEnums.TOTAL_AUTH_UNITS,
  ProfitabilityMetricsKeyEnums.TOTAL_AUTH_ORDERS,
  ProfitabilityMetricsKeyEnums.SB_AD_UNITS,
  ProfitabilityMetricsKeyEnums.SP_AD_UNITS,
  ProfitabilityMetricsKeyEnums.SV_AD_UNITS,
  ProfitabilityMetricsLabelEnums.ORDER_UNITS,
  ProfitabilityMetricsLabelEnums.AUTH_UNITS,
  ProfitabilityMetricsLabelEnums.TOTAL_AUTH_UNITS,
  ProfitabilityMetricsLabelEnums.GMV_UNITS,
  ProfitabilityMetricsLabelEnums.ORGANIC_UNITS,
  ProfitabilityMetricsLabelEnums.TOTAL_UNITS_RETURNED,
  ProfitabilityMetricsLabelEnums.UNITS_RETURNED,
  ProfitabilityMetricsLabelEnums.CANCELLED_UNITS,
  ProfitabilityMetricsLabelEnums.WFS_UNITS,
  ProfitabilityMetricsLabelEnums.SELLER_UNITS,
  ProfitabilityMetricsLabelEnums.SELLER_FULFILLED_UNITS,
  ProfitabilityMetricsLabelEnums.AD_UNITS,
  ProfitabilityMetricsLabelEnums.SP_AD_UNITS,
  ProfitabilityMetricsLabelEnums.SB_AD_UNITS,
  ProfitabilityMetricsLabelEnums.SV_AD_UNITS,
  ProfitabilityMetricsLabelEnums.TOTAL_AUTH_ORDERS_UNITS,
  ProfitabilityMetricsKeyEnums.SB_AD_ORDERS,
  ProfitabilityMetricsKeyEnums.SP_AD_ORDERS,
  ProfitabilityMetricsKeyEnums.SV_AD_ORDERS,
  ProfitabilityMetricsLabelEnums.AUTH_ORDERS,
  ProfitabilityMetricsLabelEnums.TOTAL_AUTH_ORDERS,
  ProfitabilityMetricsLabelEnums.ORGANIC_ORDERS,
  ProfitabilityMetricsLabelEnums.AD_ORDERS,
  ProfitabilityMetricsLabelEnums.SP_AD_ORDERS,
  ProfitabilityMetricsLabelEnums.SB_AD_ORDERS,
  ProfitabilityMetricsLabelEnums.SV_AD_ORDERS,
  ProfitabilityMetricsLabelEnums.TOTAL_UNITS_SOLD,
  ProfitabilityMetricsKeyEnums.ORGANIC_ORDERS,
  ProfitabilityOrdersMetricsKeyEnums.TOTAL_UNITS_SOLD,
  ProfitabilityOrdersMetricsKeyEnums.ORDER_UNITS,
  ProfitabilityOrdersMetricsKeyEnums.REFUND_UNITS,
  ProfitabilityOrdersMetricsKeyEnums.CANCELLED_UNITS,
  ProfitabilityMetricsKeyEnums.SP_AD_ORDERS,
  ProfitabilityMetricsKeyEnums.SB_AD_ORDERS,
  ProfitabilityMetricsKeyEnums.SV_AD_ORDERS,
  ProfitabilityMetricsKeyEnums.OVERALL_AD_ORDERS,
  ProfitabilityMetricsKeyEnums.ORGANIC_UNITS,
  ProfitabilityMetricsKeyEnums.SP_AD_UNITS,
  ProfitabilityMetricsKeyEnums.SB_AD_UNITS,
  ProfitabilityMetricsKeyEnums.SV_AD_UNITS,
  ProfitabilityMetricsKeyEnums.UNITS_RETURNED,
  ProfitabilityMetricsKeyEnums.ORGANIC_AD_UNITS,
  ProfitabilityMetricsKeyEnums.SD_AD_UNITS,
  ProfitabilityMetricsKeyEnums.AD_UNITS,
  ProfitabilityMetricsKeyEnums.OVERALL_ORGANIC_UNITS,
  ProfitabilityMetricsKeyEnums.OVERALL_SP_AD_UNITS,
  ProfitabilityMetricsKeyEnums.OVERALL_SB_AD_UNITS,
  ProfitabilityMetricsKeyEnums.OVERALL_SD_AD_UNITS,
  ProfitabilityMetricsKeyEnums.AMZ_TOTAL_RETURNS,
  ProfitabilityMetricsKeyEnums.AMZ_TOTAL_RETURN_UNITS,
  ProfitabilityMetricsKeyEnums.AMZ_RETURN_UNITS,
  ProfitabilityMetricsKeyEnums.AMZ_CANCELLED_ORDERS_COUNT,
  ProfitabilityMetricsKeyEnums.AMZ_TOTAL_ORDERS,
  ProfitabilityMetricsKeyEnums.TOTAL_ORDER_UNITS,
  ProfitabilityMetricsKeyEnums.BOTH_ORDER_AND_RETURN,
  ProfitabilityMetricsKeyEnums.TOTAL_AD_UNITS,
  ProfitabilityMetricsLabelEnums.AMZ_TOTAL_RETURNED_UNITS,
  ProfitabilityMetricsKeyEnums.AMZ_TOTAL_RETURNED_UNITS,
];

export const biddingStrategyFormOptions: IRadioSelect<string>[] = [
  {
    value: BiddingStrategy.DOWN_ONLY,
    label: 'Dynamic bids - down only',
    description:
      'We’ll lower your bids in real time when your ad may be less likely to convert to a sale.',
  },
  {
    value: BiddingStrategy.UP_DOWN,
    label: 'Dynamic bids - up and down',
    description:
      'We’ll raise your bids (by a maximum of 100%) in real time when your ad may be more likely to convert to a sale, and lower your bids when less likely to convert to a sale.',
  },
  {
    value: BiddingStrategy.FIXED_BIDS,
    label: 'Fixed bids',
    description:
      'We’ll use your exact bid and any manual adjustments you set, and won’t change your bids based on likelihood of a sale.',
  },
];

export const keywordNegTargetingMatchTypeOptions: IRadioSelect<string>[] = [
  {
    value: SpNegTargetingKeywordMatchTypes.NEG_PHRASE,
    label: 'Negative Phrase',
    selected: true,
  },
  {
    value: SpNegTargetingKeywordMatchTypes.NEG_EXACT,
    label: 'Negative Exact',
    selected: true,
  },
];

export const keywordTargetingMatchTypeOptions: IRadioSelect<string>[] = [
  {
    value: SpTargetingKeywordMatchTypes.BROAD,
    label: 'Broad',
    selected: true,
  },
  {
    value: SpTargetingKeywordMatchTypes.PHRASE,
    label: ' Phrase',
    selected: true,
  },
  {
    value: SpTargetingKeywordMatchTypes.EXACT,
    label: ' Exact',
    selected: true,
  },
];

export const productTargetingMatchTypeOptions: IRadioSelect<string>[] = [
  {
    value: SpTargetingProductMatchTypes.EXACT,
    label: 'Exact',
    selected: true,
  },
  {
    value: SpTargetingProductMatchTypes.EXPANDED,
    label: 'Expanded',
    selected: true,
  },
];

export const overallAccountPerformanceOptions: IAdvertisingNavigationBarOption[] =
  [
    {
      value: OverallAccountLevelTitles.CAMPAIGNS,
      label: 'Campaigns',
      options: [],
      isDisabled: false,
    },
    {
      value: OverallAccountLevelTitles.AD_GROUPS,
      label: 'Ad Groups',
      options: [],
      isDisabled: false,
    },
    {
      value: OverallAccountLevelTitles.PRODUCT_ADS,
      label: 'Product Ads',
      options: [],
      isDisabled: false,
    },
    {
      value: OverallAccountLevelTitles.KEYWORD_TARGETING,
      label: 'Keywords Targeting',
      options: [],
      isDisabled: false,
    },
    {
      value: OverallAccountLevelTitles.PRODUCT_TARGETING,
      label: 'Product Targeting',
      options: [],
      isDisabled: false,
    },
    {
      value: OverallAccountLevelTitles.SEARCH_TERM,
      label: 'Search Terms',
      options: [],
      isDisabled: false,
    },
  ];

export const spAccountPerformanceOptions: IAdvertisingNavigationBarOption[] = [
  {
    value: SpAccountLevelTitles.CAMPAIGNS,
    label: 'Campaigns',
    options: [],
    isDisabled: false,
  },
  {
    value: SpAccountLevelTitles.AD_GROUPS,
    label: 'Ad Groups',
    options: [],
    isDisabled: false,
  },
  {
    value: SpAccountLevelTitles.PRODUCT_ADS,
    label: 'Product Ads',
    options: [],
    isDisabled: false,
  },
  {
    value: SpAccountLevelTitles.KEYWORD_TARGETING,
    label: 'Keywords Targeting',
    options: [],
    isDisabled: false,
  },
  {
    value: SpAccountLevelTitles.PRODUCT_TARGETING,
    label: 'Product Targeting',
    options: [],
    isDisabled: false,
  },
  {
    value: SpAccountLevelTitles.AUTO_TARGETING,
    label: 'Auto Targeting',
    options: [],
    isDisabled: false,
  },
  {
    value: SpAccountLevelTitles.SEARCH_TERM,
    label: 'Search Terms',
    options: [],
    isDisabled: false,
  },
  {
    value: SpAccountLevelTitles.PLACEMENT,
    label: 'Placement Percentage',
    options: [],
    isDisabled: false,
  },
];

export const spCampaignPerformanceOptions: IAdvertisingNavigationBarOption[] = [
  {
    value: SpCampaignLevelTitles.AD_GROUPS,
    label: 'Ad Groups',
    options: [],
    isDisabled: false,
  },
  {
    value: SpCampaignLevelTitles.PRODUCT_ADS,
    label: 'Product Ads',
    options: [],
    isDisabled: false,
  },
  {
    value: SpCampaignLevelTitles.MANUAL_TARGETING,
    label: 'Targeting',
    options: [
      {
        label: 'Keyword',
        value: SpCampaignLevelTitles.KEYWORD_TARGETING,
      },
      {
        label: 'Product',
        value: SpCampaignLevelTitles.PRODUCT_TARGETING,
      },
    ],
    isDisabled: false,
    isVisible: true,
  },
  {
    value: SpCampaignLevelTitles.AUTO_TARGETING,
    label: 'Targeting',
    options: [],
    isDisabled: false,
    isVisible: true,
  },
  {
    value: SpCampaignLevelTitles.SEARCH_TERM,
    label: 'Search Terms',
    options: [],
    isDisabled: false,
  },
  {
    value: SpCampaignLevelTitles.NEG_TARGETING,
    label: 'Negative Targeting (Ad Group)',
    options: [
      {
        label: 'Keyword',
        value: SpCampaignLevelTitles.NEG_TARGETING_KEYWORD,
      },
      {
        label: 'Product',
        value: SpCampaignLevelTitles.NEG_TARGETING_PRODUCT,
      },
    ],
    isDisabled: false,
  },
  {
    value: SpCampaignLevelTitles.PLACEMENT,
    label: 'Placement Percentage',
    options: [],
    isDisabled: false,
  },
  {
    value: SpCampaignLevelTitles.AUTOMATION,
    label: 'Automation',
    options: [
      {
        label: 'Rules',
        value: SpCampaignLevelTitles.AUTOMATION_RULES,
      },
    ],
    isDisabled: false,
    isVisible: true,
  },
  {
    value: SpCampaignLevelTitles.HISTORY,
    label: 'History',
    options: [],
    isDisabled: true,
  },
];

export const spAdGroupPerformanceOptions: IAdvertisingNavigationBarOption[] = [
  {
    value: SpAdGroupLevelTitles.PRODUCT_ADS,
    label: 'Product Ads',
    options: [],
    isDisabled: false,
  },
  {
    value: SpAdGroupLevelTitles.TARGETING,
    label: 'Targeting',
    options: [],
    isDisabled: false,
  },
  {
    value: SpAdGroupLevelTitles.SEARCH_TERM,
    label: 'Search Terms',
    options: [],
    isDisabled: false,
  },
  {
    value: SpAdGroupLevelTitles.NEG_TARGETING,
    label: 'Negative Targeting',
    options: [
      {
        label: 'Keyword',
        value: SpAdGroupLevelTitles.NEG_TARGETING_KEYWORD,
      },
      {
        label: 'Product',
        value: SpAdGroupLevelTitles.NEG_TARGETING_PRODUCT,
      },
    ],
    isDisabled: false,
  },
  {
    value: SpAdGroupLevelTitles.HISTORY,
    label: 'History',
    options: [],
    isDisabled: true,
  },
];

export const sbAccountPerformanceOptions: IAdvertisingNavigationBarOption[] = [
  {
    value: SbAccountLevelTitles.CAMPAIGNS,
    label: 'Campaigns',
    options: [],
    isDisabled: false,
  },
  {
    value: SbAccountLevelTitles.AD_GROUP,
    label: 'Ad Groups',
    options: [],
    isDisabled: false,
  },
  {
    value: SbAccountLevelTitles.PRODUCT_ADS,
    label: 'Product Ads',
    options: [],
    isDisabled: false,
  },
  {
    value: SbAccountLevelTitles.KEYWORD_TARGETING,
    label: 'Keyword Targeting',
    options: [],
    isDisabled: false,
  },
  {
    value: SbAccountLevelTitles.PRODUCT_TARGETING,
    label: 'Product Targeting',
    options: [],
    isDisabled: false,
  },
  {
    value: SbAccountLevelTitles.SEARCH_TERM,
    label: 'Search Terms',
    options: [],
    isDisabled: false,
  },
];

export const sbCampaignPerformanceOptions: IAdvertisingNavigationBarOption[] = [
  {
    value: SbCampaignLevelTitles.AD_GROUP,
    label: 'Ad Groups',
    options: [],
    isDisabled: false,
  },
  {
    value: SbCampaignLevelTitles.PRODUCT_ADS,
    label: 'Product Ads',
    options: [],
    isDisabled: false,
  },
  {
    value: SbCampaignLevelTitles.TARGETING,
    label: 'Targeting',
    options: [
      {
        label: 'Keyword',
        value: SbCampaignLevelTitles.KEYWORD_TARGETING,
      },
      {
        label: 'Product',
        value: SbCampaignLevelTitles.PRODUCT_TARGETING,
      },
    ],
    isDisabled: false,
  },
  {
    value: SbCampaignLevelTitles.SEARCH_TERM_KEYWORD,
    label: 'Search Terms',
    options: [],
    isDisabled: false,
  },
  {
    value: SbCampaignLevelTitles.NEG_TARGETING,
    label: 'Negative Targeting',
    options: [
      {
        label: 'Keyword',
        value: SbCampaignLevelTitles.NEG_TARGETING_KEYWORD,
      },
      {
        label: 'Product',
        value: SbCampaignLevelTitles.NEG_TARGETING_PRODUCT,
      },
    ],
    isDisabled: false,
  },
  {
    value: SbCampaignLevelTitles.AUTOMATION,
    label: 'Automation',
    options: [
      {
        label: 'Rules',
        value: SbCampaignLevelTitles.AUTOMATION_RULES,
      },
    ],
    isDisabled: false,
    isVisible: true,
  },
  {
    value: SbCampaignLevelTitles.HISTORY,
    label: 'History',
    options: [],
    isDisabled: true,
  },
];

export const sbAdGroupPerformanceOptions: IAdvertisingNavigationBarOption[] = [
  {
    value: SbAdGroupLevelTitles.PRODUCT_ADS,
    label: 'Product Ads',
    options: [],
    isDisabled: false,
  },
  {
    value: SbAdGroupLevelTitles.TARGETING,
    label: 'Targeting',
    options: [],
    isDisabled: false,
  },
  {
    value: SbAdGroupLevelTitles.SEARCH_TERM_KEYWORD,
    label: 'Search Terms',
    options: [],
    isDisabled: false,
  },
  {
    value: SbAdGroupLevelTitles.NEG_TARGETING,
    label: 'Negative Targeting',
    options: [
      {
        label: 'Keyword',
        value: SbAdGroupLevelTitles.NEG_TARGETING_KEYWORD,
      },
      {
        label: 'Product',
        value: SbAdGroupLevelTitles.NEG_TARGETING_PRODUCT,
      },
    ],
    isDisabled: false,
  },
];

export const sdAccountPerformanceOptions: IAdvertisingNavigationBarOption[] = [
  {
    value: SdAccountLevelTitles.CAMPAIGN,
    label: 'Campaigns',
    options: [],
    isDisabled: false,
  },
  {
    value: SdAccountLevelTitles.AD_GROUP,
    label: 'Ad Groups',
    options: [],
    isDisabled: false,
  },
  {
    value: SdAccountLevelTitles.PRODUCT_ADS,
    label: 'Product Ads',
    options: [],
    isDisabled: false,
  },
  {
    value: SdAccountLevelTitles.CONTEXTUAL_TARGETING,
    label: 'Contextual Targeting',
    options: [],
    isDisabled: true,
  },
  {
    value: SdAccountLevelTitles.AUDIENCE,
    label: 'Audience Targeting',
    options: [],
    isDisabled: true,
  },
];

export const sdCampaignPerformanceOptions: IAdvertisingNavigationBarOption[] = [
  {
    value: SdCampaignLevelTitles.AD_GROUP,
    label: 'Ad Groups',
    options: [],
    isDisabled: false,
  },
  {
    value: SdCampaignLevelTitles.PRODUCT_ADS,
    label: 'Product Ads',
    options: [],
    isDisabled: false,
  },
  {
    value: SdCampaignLevelTitles.TARGETING,
    label: 'Targeting',
    options: [],
    isDisabled: true,
  },
  {
    value: SdCampaignLevelTitles.AUTOMATION,
    label: 'Automation',
    options: [
      {
        label: 'Rules',
        value: SdCampaignLevelTitles.AUTOMATION_RULES,
      },
    ],
    isDisabled: false,
    isVisible: true,
  },
  {
    value: SdCampaignLevelTitles.HISTORY,
    label: 'History',
    options: [],
    isDisabled: true,
  },
];

export const sdAdGroupPerformanceOptions: IAdvertisingNavigationBarOption[] = [
  {
    value: SdAdGroupLevelTitles.PRODUCT_ADS,
    label: 'Product Ads',
    options: [],
    isDisabled: false,
  },
  {
    value: SdAdGroupLevelTitles.CREATIVE,
    label: 'Creative(Display Ad)',
    options: [],
    isDisabled: true,
  },
  {
    value: SdAdGroupLevelTitles.TARGETING,
    label: 'Targeting',
    options: [],
    isDisabled: true,
  },
  {
    value: SdAdGroupLevelTitles.HISTORY,
    label: 'History',
    options: [],
    isDisabled: true,
  },
];

export const sbKeywordTargetingMatchTypeOptions: IRadioSelect<string>[] = [
  {
    value: SbKeywordTargetingMatchTypes.BROAD,
    label: 'Broad',
    selected: true,
  },
  {
    value: SbKeywordTargetingMatchTypes.PHRASE,
    label: ' Phrase',
    selected: true,
  },
  {
    value: SbKeywordTargetingMatchTypes.EXACT,
    label: ' Exact',
    selected: true,
  },
];

export const walmartSpAccountPerformanceOptions: IAdvertisingNavigationBarOption[] =
  [
    {
      value: WalmartSPAccountLevelTitles.CAMPAIGNS,
      label: 'Campaigns',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSPAccountLevelTitles.AD_GROUPS,
      label: 'Ad Groups',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSPAccountLevelTitles.AD_ITEMS,
      label: 'Product Ads',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSPAccountLevelTitles.KEYWORD_TARGETING,
      label: 'Keyword Targeting',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSPAccountLevelTitles.SEARCH_TERM,
      label: 'Search Terms',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSPAccountLevelTitles.PAGE_TYPE,
      label: 'Page Type',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSPAccountLevelTitles.PLATFORM,
      label: 'Platform',
      options: [],
      isDisabled: false,
    },
  ];

export const walmartSpCampaignPerformanceOptions: IAdvertisingNavigationBarOption[] =
  [
    {
      value: WalmartSPCampaignLevelTitles.AD_GROUPS,
      label: 'Ad Groups',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSPCampaignLevelTitles.AD_ITEMS,
      label: 'Product Ads',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSPCampaignLevelTitles.KEYWORD_TARGETING,
      label: 'Keyword Targeting',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSPCampaignLevelTitles.SEARCH_TERM,
      label: 'Search Terms',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSPCampaignLevelTitles.PAGE_TYPE,
      label: 'Page Type',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSPCampaignLevelTitles.PLATFORM,
      label: 'Platform',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSPCampaignLevelTitles.AUTOMATION,
      label: 'Automation',
      options: [
        {
          label: 'Rules',
          value: WalmartSPCampaignLevelTitles.AUTOMATION_RULES,
        },
      ],
      isDisabled: false,
      isVisible: true,
    },
  ];

export const walmartSpAdGroupPerformanceOptions: IAdvertisingNavigationBarOption[] =
  [
    {
      value: WalmartSPAdGroupLevelTitles.AD_ITEMS,
      label: 'Product Ads',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSPAdGroupLevelTitles.KEYWORD_TARGETING,
      label: 'Keyword Targeting',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSPAdGroupLevelTitles.SEARCH_TERM,
      label: 'Search Terms',
      options: [],
      isDisabled: false,
    },
  ];

export const walmartSbAccountPerformanceOptions: IAdvertisingNavigationBarOption[] =
  [
    {
      value: WalmartSBAccountLevelTitles.CAMPAIGNS,
      label: 'Campaigns',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSBAccountLevelTitles.AD_GROUPS,
      label: 'Ad Groups',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSBAccountLevelTitles.AD_ITEMS,
      label: 'Product Ads',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSBAccountLevelTitles.KEYWORD_TARGETING,
      label: 'Keyword Targeting',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSBAccountLevelTitles.SEARCH_TERM,
      label: 'Search Terms',
      options: [],
      isDisabled: true,
    },
    {
      value: WalmartSBAccountLevelTitles.PAGE_TYPE,
      label: 'Page Type',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSBAccountLevelTitles.PLATFORM,
      label: 'Platform',
      options: [],
      isDisabled: false,
    },
  ];

export const walmartSbCampaignLevelPerformanceOptions: IAdvertisingNavigationBarOption[] =
  [
    {
      value: WalmartSBCampaignLevelTitles.AD_GROUPS,
      label: 'Ad Groups',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSBCampaignLevelTitles.BRANDS,
      label: 'Brand Profile',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSBCampaignLevelTitles.AD_ITEMS,
      label: 'Product Ads',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSBCampaignLevelTitles.KEYWORD_TARGETING,
      label: 'Keyword Targeting',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSBCampaignLevelTitles.SEARCH_TERM,
      label: 'Search Terms',
      options: [],
      isDisabled: true,
    },
    {
      value: WalmartSBCampaignLevelTitles.PAGE_TYPE,
      label: 'Page Type',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSBCampaignLevelTitles.PLATFORM,
      label: 'Platform',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSBCampaignLevelTitles.AUTOMATION,
      label: 'Automation',
      options: [
        {
          label: 'Rules',
          value: WalmartSBCampaignLevelTitles.AUTOMATION_RULES,
        },
      ],
      isDisabled: false,
      isVisible: true,
    },
  ];

export const walmartSbAdGroupLevelPerformanceOptions: IAdvertisingNavigationBarOption[] =
  [
    {
      value: WalmartSBAdGroupLevelTitles.AD_ITEMS,
      label: 'Product Ads',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSBAdGroupLevelTitles.KEYWORD_TARGETING,
      label: 'Keyword Targeting',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSBAdGroupLevelTitles.SEARCH_TERM,
      label: 'Search Terms',
      options: [],
      isDisabled: true,
    },
  ];

export const walmartSvAccountPerformanceOptions: IAdvertisingNavigationBarOption[] =
  [
    {
      value: WalmartSVAccountLevelTitles.CAMPAIGNS,
      label: 'Campaigns',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSVAccountLevelTitles.AD_GROUPS,
      label: 'Ad Groups',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSVAccountLevelTitles.AD_ITEMS,
      label: 'Product Ads',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSVAccountLevelTitles.KEYWORD_TARGETING,
      label: 'Keyword Targeting',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSVAccountLevelTitles.SEARCH_TERM,
      label: 'Search Terms',
      options: [],
      isDisabled: true,
    },
    {
      value: WalmartSVAccountLevelTitles.PAGE_TYPE,
      label: 'Page Type',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSVAccountLevelTitles.PLATFORM,
      label: 'Platform',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSVAccountLevelTitles.VIDEO,
      label: 'Video Manager',
      options: [],
      isDisabled: true,
    },
  ];

export const walmartSvCampaignLevelPerformanceOptions: IAdvertisingNavigationBarOption[] =
  [
    {
      value: WalmartSVCampaignLevelTitles.AD_GROUPS,
      label: 'Ad Groups',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSVCampaignLevelTitles.AD_ITEMS,
      label: 'Product Ads',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSVCampaignLevelTitles.KEYWORD_TARGETING,
      label: 'Keyword Targeting',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSVCampaignLevelTitles.SEARCH_TERM,
      label: 'Search Terms',
      options: [],
      isDisabled: true,
    },
    {
      value: WalmartSVCampaignLevelTitles.PAGE_TYPE,
      label: 'Page Type',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSVCampaignLevelTitles.PLATFORM,
      label: 'Platform',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSVCampaignLevelTitles.VIDEO,
      label: 'Video Details',
      options: [],
      isDisabled: true,
    },
    {
      value: WalmartSVCampaignLevelTitles.AUTOMATION,
      label: 'Automation',
      options: [
        {
          label: 'Rules',
          value: WalmartSVCampaignLevelTitles.AUTOMATION_RULES,
        },
      ],
      isDisabled: false,
      isVisible: true,
    },
  ];

export const walmartSvAdGroupLevelPerformanceOptions: IAdvertisingNavigationBarOption[] =
  [
    {
      value: WalmartSVAdGroupLevelTitles.AD_ITEMS,
      label: 'Product Ads',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSVAdGroupLevelTitles.KEYWORD_TARGETING,
      label: 'Keyword Targeting',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartSVAdGroupLevelTitles.SEARCH_TERM,
      label: 'Search Terms',
      options: [],
      isDisabled: true,
    },
  ];

export const walmartOverallAccountPerformanceOptions: IAdvertisingNavigationBarOption[] =
  [
    {
      value: WalmartOverallAccountLevelTitles.CAMPAIGNS,
      label: 'Campaigns',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartOverallAccountLevelTitles.AD_GROUPS,
      label: 'Ad Groups',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartOverallAccountLevelTitles.AD_ITEMS,
      label: 'Product Ads',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartOverallAccountLevelTitles.KEYWORD_TARGETING,
      label: 'Keyword Targeting',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartOverallAccountLevelTitles.SEARCH_TERM,
      label: 'Search Terms',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartOverallAccountLevelTitles.PAGE_TYPE,
      label: 'Page Type',
      options: [],
      isDisabled: false,
    },
    {
      value: WalmartOverallAccountLevelTitles.PLATFORM,
      label: 'Platform',
      options: [],
      isDisabled: false,
    },
  ];

export const sbNegKeywordTargetingMatchTypeOptions: IRadioSelect<string>[] = [
  {
    value: SbNegativeTargetingKeywordMatchTypes.NEG_PHRASE,
    label: 'Negative Phrase',
    selected: true,
  },
  {
    value: SbNegativeTargetingKeywordMatchTypes.NEG_EXACT,
    label: 'Negative Exact',
    selected: true,
  },
];

export const sdTacticOptions: IRadioSelect<string>[] = [
  {
    value: AmazonSDTacticsEnum.CONTEXTUAL_TARGETING,
    label: 'Contextual Targeting',
    selected: false,
  },
  {
    value: AmazonSDTacticsEnum.AUDIENCES_TARGETING,
    label: 'Audiences Targeting',
    selected: false,
  },
];

export const sdBidCostTypeMappedOptions: IRadioSelect<string>[] = [
  {
    value: AmazonSDBidOptimizationEnum.REACH,
    label: AmazonCostTypeEnum.VCPM,
    selected: false,
  },
  {
    value: AmazonSDBidOptimizationEnum.CLICKS,
    label: AmazonCostTypeEnum.CPC,
    selected: false,
  },
  {
    value: AmazonSDBidOptimizationEnum.CONVERSIONS,
    label: AmazonCostTypeEnum.CPC,
    selected: false,
  },
];

export const DEFAULT_ADVERTISING_SORT_CRITERIA: SortingState = [
  {
    id: 'Ad Sales',
    desc: true,
  },
];

export const AMAZON_SP_KT_MAX = 1000;
export const AMAZON_SP_PT_MAX = 10000;
export const AMAZON_SB_KT_MAX = 1000;
export const AMAZON_SB_PT_MAX = 10000;
export const AMAZON_SP_NEG_KT_MAX = 10000;
export const AMAZON_SP_NEG_PT_MAX = 10000;
export const AMAZON_SB_NEG_KT_MAX = 10000;
export const AMAZON_SB_NEG_PT_MAX = 10000;
export const AMAZON_SP_MANUAL_ADS_MAX = 10000;
export const AMAZON_SP_AUTO_ADS_MAX = 500000;
export const AMAZON_SD_ADS_MAX = 10000;
export const WALMART_AUTO_SP_BID_MIN_LIMIT = 0.2;
export const WALMART_AUTO_SP_BID_MAX_LIMIT = 49;
export const WALMART_MANUAL_SP_BID_MIN_LIMIT = 0.3;
export const WALMART_MANUAL_SP_BID_MAX_LIMIT = 49;
export const WALMART_MANUAL_SB_BID_MIN_LIMIT = 0.5;
export const WALMART_MANUAL_SB_BID_MAX_LIMIT = 49;
export const WALMART_MANUAL_SV_BID_MIN_LIMIT = 0.8;
export const WALMART_MANUAL_SV_BID_MAX_LIMIT = 49;

export const WALMART_BID_MULTIPLIER_MAX_LIMIT = 1000;
export const AMAZON_CAMPAIGN_NAME_LIMIT = 127;
export const AMAZON_ADGROUP_NAME_LIMIT = 255;
export const WALMART_CAMPAIGN_NAME_LIMIT = 255;
export const WALMART_ADGROUP_NAME_LIMIT = 255;
export const AMAZON_PLACEMENT_PERCENT_MAX_LIMIT = 900;

export const TOAST_MESSAGE_BORDER_COLOR_MAPPING = {
  [TOAST_MESSAGE_TYPES.ERROR]: '#FF848C',
  [TOAST_MESSAGE_TYPES.SUCCESS]: '#26C26F',
  [TOAST_MESSAGE_TYPES.WARNING]: '#5D9EFF',
  [TOAST_MESSAGE_TYPES.INFO]: '#FFAF38',
};

export const IS_BID_AUTOMATION_REQUIRED: { [key: string]: boolean } = {
  [WalmartOverallAccountLevelTitles.AD_GROUPS]: true,
  [WalmartOverallAccountLevelTitles.AD_ITEMS]: true,
  [WalmartOverallAccountLevelTitles.KEYWORD_TARGETING]: true, //wmt overall

  [WalmartSPAccountLevelTitles.AD_GROUPS]: true,
  [WalmartSPAccountLevelTitles.KEYWORD_TARGETING]: true,
  [WalmartSPAccountLevelTitles.AD_ITEMS]: true, //wmt sp account

  [WalmartSPCampaignLevelTitles.AD_GROUPS]: true,
  [WalmartSPCampaignLevelTitles.KEYWORD_TARGETING]: true, //wmt sp camp

  [WalmartSPAdGroupLevelTitles.KEYWORD_TARGETING]: true, // wmt sp targeting

  [WalmartSBAccountLevelTitles.AD_GROUPS]: true,
  [WalmartSBAccountLevelTitles.KEYWORD_TARGETING]: true, //wmt sb account

  [WalmartSBCampaignLevelTitles.AD_GROUPS]: true,
  [WalmartSBCampaignLevelTitles.KEYWORD_TARGETING]: true, //wmt sb camp

  [WalmartSBAdGroupLevelTitles.KEYWORD_TARGETING]: true, //wmt sb adgroup

  [WalmartSVAccountLevelTitles.AD_GROUPS]: true,
  [WalmartSVAccountLevelTitles.KEYWORD_TARGETING]: true, //wmt sv account

  [WalmartSVCampaignLevelTitles.AD_GROUPS]: true,
  [WalmartSVCampaignLevelTitles.KEYWORD_TARGETING]: true, //wmt sv camp

  [WalmartSVAdGroupLevelTitles.KEYWORD_TARGETING]: true, //wmt sv adgrp

  [OverallAccountLevelTitles.AD_GROUPS]: true,
  [OverallAccountLevelTitles.PRODUCT_TARGETING]: true,
  [OverallAccountLevelTitles.KEYWORD_TARGETING]: true, //amz overall

  [SpAccountLevelTitles.AD_GROUPS]: true,
  [SpAccountLevelTitles.KEYWORD_TARGETING]: true,
  [SpAccountLevelTitles.PRODUCT_TARGETING]: true,
  [SpAccountLevelTitles.AUTO_TARGETING]: true, //amz sp account

  [SpCampaignLevelTitles.AD_GROUPS]: true,
  [SpCampaignLevelTitles.KEYWORD_TARGETING]: true,
  [SpCampaignLevelTitles.PRODUCT_TARGETING]: true,
  [SpCampaignLevelTitles.AUTO_TARGETING]: true, //amz sp camp

  [SpAdGroupLevelTitles.KEYWORD_TARGETING]: true,
  [SpAdGroupLevelTitles.PRODUCT_TARGETING]: true,
  [SpAdGroupLevelTitles.TARGETING]: true, //amz sp adgroup

  [SbAccountLevelTitles.AD_GROUP]: true,
  [SbAccountLevelTitles.KEYWORD_TARGETING]: true,
  [SbAccountLevelTitles.PRODUCT_TARGETING]: true, //amz sb account

  [SbCampaignLevelTitles.AD_GROUP]: true,
  [SbCampaignLevelTitles.KEYWORD_TARGETING]: true,
  [SbCampaignLevelTitles.PRODUCT_TARGETING]: true, //amz sb campaign

  [SbAdGroupLevelTitles.KEYWORD_TARGETING]: true,
  [SbAdGroupLevelTitles.PRODUCT_TARGETING]: true, //amz sb adgroup

  [SdAccountLevelTitles.AD_GROUP]: true, //amz sd account

  [SdCampaignLevelTitles.AD_GROUP]: true, //amz sd account
};

export const COLUMN_TAG_MAPPING: { [key: string | number]: string } = {
  // Targeting Type
  [TargetingTypeEnum.AUTO]: 'Auto',
  [SpCampaignTargetingTypes.AUTO]: 'Auto',
  [TargetingTypeEnum.MANUAL]: 'Manual',
  [SpCampaignTargetingTypes.MANUAL]: 'Manual',

  // AdType
  [AdType.SPONSORED_PRODUCTS]: AdTypeShort.SPONSORED_PRODUCTS,
  [AdTypeShort.SPONSORED_PRODUCTS]: AdTypeShort.SPONSORED_PRODUCTS,
  [AdTypeShortLowerCase.SPONSORED_PRODUCTS]: AdTypeShort.SPONSORED_PRODUCTS,
  [WalmartAdTypeEnum.SPONSORED_PRODUCTS]: AdTypeShort.SPONSORED_PRODUCTS,
  [AdType.SPONSORED_BRANDS]: AdTypeShort.SPONSORED_BRANDS,
  [AdTypeShort.SPONSORED_BRANDS]: AdTypeShort.SPONSORED_BRANDS,
  [AdTypeShortLowerCase.SPONSORED_BRANDS]: AdTypeShort.SPONSORED_BRANDS,
  [WalmartAdTypeEnum.SPONSORED_BRANDS]: AdTypeShort.SPONSORED_BRANDS,
  [AdType.SPONSORED_DISPLAY]: AdTypeShort.SPONSORED_DISPLAY,
  [AdTypeShort.SPONSORED_DISPLAY]: AdTypeShort.SPONSORED_DISPLAY,
  [AdTypeShortLowerCase.SPONSORED_DISPLAY]: AdTypeShort.SPONSORED_DISPLAY,
  [AdType.SPONSORED_VIDEO]: AdTypeShort.SPONSORED_VIDEO,
  [AdTypeShort.SPONSORED_VIDEO]: AdTypeShort.SPONSORED_VIDEO,
  [AdTypeShortLowerCase.SPONSORED_VIDEO]: AdTypeShort.SPONSORED_VIDEO,
  [WalmartAdTypeEnum.SPONSORED_VIDEO]: AdTypeShort.SPONSORED_VIDEO,
};

export const AMAZON_CATALOG_FULFILLMENT_MAPPING: { [key: string]: string } = {
  [AmazonFulfillmentTypeEnum.AMAZON_NA_MAPPED]:
    AmazonFulfillmentTypeEnum.AMAZON_NA,
  [AmazonFulfillmentTypeEnum.DEFAULT_MAPPED]: AmazonFulfillmentTypeEnum.DEFAULT,
};
export const AMAZON_CATALOG_TABLE_FULFILLMENT_MAPPING: {
  [key: string]: string;
} = {
  [AmazonFulfillmentTypeEnum.AMAZON_NA]:
    AmazonFulfillmentTypeEnum.AMAZON_NA_MAPPED,
  [AmazonFulfillmentTypeEnum.DEFAULT]: AmazonFulfillmentTypeEnum.DEFAULT_MAPPED,
};

export const ITEM_CONDITION_MAPPING: { [key: string]: string } = {
  [ItemConditionEnum.NEW_ITEM]: ItemConditionDisplayEnum.NEW,
  [ItemConditionEnum.REFURBISHED]: ItemConditionDisplayEnum.REFURBISHED,
  [ItemConditionEnum.USED_VERY_GOOD]: ItemConditionDisplayEnum.USED_VERY_GOOD,
  [ItemConditionEnum.USED_ACCEPTABLE]: ItemConditionDisplayEnum.USED_ACCEPTABLE,
  [ItemConditionEnum.USED_POOR]: ItemConditionDisplayEnum.USED_POOR,
  [ItemConditionEnum.USED_LIKE_NEW]: ItemConditionDisplayEnum.USED_LIKE_NEW,
  [ItemConditionEnum.COLLECTIBLE_LIKE_NEW]:
    ItemConditionDisplayEnum.COLLECTIBLE_LIKE_NEW,
};

export const ITEM_CONDITION_REVERSE_MAPPING: { [key: string]: string } = {
  [ItemConditionDisplayEnum.NEW]: ItemConditionEnum.NEW_ITEM,
  [ItemConditionDisplayEnum.REFURBISHED]: ItemConditionEnum.REFURBISHED,
  [ItemConditionDisplayEnum.USED_VERY_GOOD]: ItemConditionEnum.USED_VERY_GOOD,
  [ItemConditionDisplayEnum.USED_ACCEPTABLE]: ItemConditionEnum.USED_ACCEPTABLE,
  [ItemConditionDisplayEnum.USED_POOR]: ItemConditionEnum.USED_POOR,
  [ItemConditionDisplayEnum.USED_LIKE_NEW]: ItemConditionEnum.USED_LIKE_NEW,
  [ItemConditionDisplayEnum.COLLECTIBLE_LIKE_NEW]:
    ItemConditionEnum.COLLECTIBLE_LIKE_NEW,
};

export const AD_TYPE_MAPPING: { [key: string | number]: string } = {
  [AdType.SPONSORED_PRODUCTS]: AdTypeShort.SPONSORED_PRODUCTS,
  [AdTypeShort.SPONSORED_PRODUCTS]: AdTypeShort.SPONSORED_PRODUCTS,
  [WalmartAdTypeEnum.SPONSORED_PRODUCTS]: AdTypeShort.SPONSORED_PRODUCTS,
  [AdType.SPONSORED_BRANDS]: AdTypeShort.SPONSORED_BRANDS,
  [AdTypeShort.SPONSORED_BRANDS]: AdTypeShort.SPONSORED_BRANDS,
  [WalmartAdTypeEnum.SPONSORED_BRANDS]: AdTypeShort.SPONSORED_BRANDS,
  [AdType.SPONSORED_DISPLAY]: AdTypeShort.SPONSORED_DISPLAY,
  [AdTypeShort.SPONSORED_DISPLAY]: AdTypeShort.SPONSORED_DISPLAY,
  [AdType.SPONSORED_VIDEO]: AdTypeShort.SPONSORED_VIDEO,
  [AdTypeShort.SPONSORED_VIDEO]: AdTypeShort.SPONSORED_VIDEO,
  [WalmartAdTypeEnum.SPONSORED_VIDEO]: AdTypeShort.SPONSORED_VIDEO,
  [AdType.All]: AdTypeShort.All,
  [AdType.All.toUpperCase()]: AdTypeShort.All,
  [AdTypeShort.OVERALL.toUpperCase()]: AdTypeShort.All,
};

export const AD_TYPE_SHORT_MAPPING: { [key: string | number]: string } = {
  [AdTypeShort.SPONSORED_PRODUCTS]: AdType.SPONSORED_PRODUCTS,
  [AdTypeShort.SPONSORED_BRANDS]: AdType.SPONSORED_BRANDS,
  [AdTypeShort.SPONSORED_DISPLAY]: AdType.SPONSORED_DISPLAY,
  [AdTypeShort.SPONSORED_VIDEO]: AdType.SPONSORED_VIDEO,
  [AdTypeShort.All.toUpperCase()]: AdType.All,
};

export const AMAZON_MATCH_TYPE_MAPPING: { [key: string]: string } = {
  [SpTargetingKeywordMatchTypes.BROAD]: 'Broad',
  [SpTargetingKeywordMatchTypes.PHRASE]: 'Phrase',
  [SpTargetingKeywordMatchTypes.EXACT]: 'Exact',
  [SbKeywordTargetingMatchTypes.BROAD]: 'Broad',
  [SbKeywordTargetingMatchTypes.PHRASE]: 'Phrase',
  [SbKeywordTargetingMatchTypes.EXACT]: 'Exact',
  [SpNegTargetingKeywordMatchTypes.NEG_PHRASE]: 'Negative Phrase',
  [SpNegTargetingKeywordMatchTypes.NEG_EXACT]: 'Negative Exact',
  [SpTargetingProductMatchTypes.EXPANDED]: 'Expanded',
  [SpTargetingProductMatchTypes.EXACT]: 'Exact',
  [SpTargetingProductMatchTypes.TARGETING_EXPRESSION]: 'Targeting Expression',
  [SbNegativeTargetingKeywordMatchTypes.NEG_PHRASE]: 'Negative Phrase',
  [SbNegativeTargetingKeywordMatchTypes.NEG_EXACT]: 'Negative Exact',
  [SbNegativeTargetingProductMatchTypesEnum.EXACT]: 'Exact',
  [SbNegativeTargetingProductMatchTypesEnum.BRAND_EXACT]: 'Brand Exact',
  [SpAutoTargetingMatchTypesEnum.PREDEFINED]: 'Targeting Expression Predefined',
};

export const EDIT_ACCESS_OMIT_KEYS = [
  'campaignId',
  'adGroupId',
  'entityName',
  'id',
  'keywordId',
  'itemId',
  'adItemId',
  'targetId',
  'adId',
  'adItemId',
  'placementType',
  'platformType',
];

export const CATALOG_ACCOUNT_ORDER: string[] = [
  AmazonAccountType.SELLER,
  WalmartAccountTypeEnum.THIRD_PARTY,
  AmazonAccountType.VENDOR,
  WalmartAccountTypeEnum.FIRST_PARTY,
];

