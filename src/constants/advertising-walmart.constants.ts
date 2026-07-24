import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import {
  ColumnNameEnum,
  MetricsOptions,
  PageTypeActualEnum,
  PageTypeTableEnum,
} from 'src/enums/advertising.enums';
import { ProductVariantTypeEnum } from 'src/enums/catalog.enums';
import { FilterDropdownValue } from 'src/enums/filter.enums';
import { WALMART_ADVERTISING_METRICS_TOOLTIPS } from 'src/enums/tooltip-texts.enums';
import {
  WalmartAdTypeEnum,
  WalmartCampaignOptionsEnums,
} from 'src/enums/walmart.enums';

export const walmartInStoreAdvertisingMetricsOptions: IDropdownItem<string>[] =
  [
    {
      label: 'In-Store Attributes Sales',
      value: MetricsOptions.IN_STORE_ATTRIBUTES_SALES,
      selected: false,
      isDisabled: false,
      tooltipText:
        WALMART_ADVERTISING_METRICS_TOOLTIPS.IN_STORE_ATTRIBUTES_SALES,
    },
    {
      label: 'In-Store Advertised Sales',
      value: MetricsOptions.IN_STORE_ADVERTISED_SALES,
      selected: false,
      isDisabled: false,
      tooltipText:
        WALMART_ADVERTISING_METRICS_TOOLTIPS.IN_STORE_ADVERTISED_SALES,
    },
    {
      label: 'In-Store Orders',
      value: MetricsOptions.IN_STORE_ORDERS,
      selected: false,
      isDisabled: false,
      tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.IN_STORE_ORDERS,
    },
    {
      label: 'In-Store Units Sold',
      value: MetricsOptions.IN_STORE_UNITS_SOLD,
      selected: false,
      isDisabled: false,
      tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.IN_STORE_UNITS_SOLD,
    },
    {
      label: 'In-Store Other Sales',
      value: MetricsOptions.IN_STORE_OTHER_SALES,
      selected: false,
      isDisabled: false,
      tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.IN_STORE_OTHER_SALES,
    },

    {
      label: 'Omnichannel ROAS',
      value: MetricsOptions.OMNI_CHANNEL_ROAS,
      selected: false,
      isDisabled: false,
      tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.OMNI_CHANNEL_ROAS,
    },
    {
      label: 'Omnichannel Sales',
      value: MetricsOptions.OMNI_CHANNEL_SALES,
      selected: false,
      isDisabled: false,
      tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.OMNI_CHANNEL_SALES,
    },
  ];

export const walmartTACOSMetricOption: IDropdownItem<string>[] = [
  {
    label: 'TACOS',
    value: MetricsOptions.TACOS,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.TACOS,
  },
];

export const walmartAdvertisingMetricsOptions: IDropdownItem<string>[] = [
  {
    label: 'Impressions',
    value: MetricsOptions.IMPRESSIONS,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.IMPRESSIONS,
  },
  {
    label: 'Clicks',
    value: MetricsOptions.CLICKS,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.CLICKS,
  },
  {
    label: 'CTR',
    value: MetricsOptions.CTR,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.CTR,
  },
  {
    label: 'CPC',
    value: MetricsOptions.CPC,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.CPC,
  },
  {
    label: 'Ad Spend',
    value: MetricsOptions.AD_SPEND,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.AD_SPEND,
  },
  {
    label: 'Ad Sales',
    value: MetricsOptions.AD_SALES,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.AD_SALES,
  },
  {
    label: 'Ad Orders',
    value: MetricsOptions.AD_ORDERS,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.AD_ORDERS,
  },
  {
    label: 'Ad Units',
    value: MetricsOptions.AD_UNITS,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.AD_UNITS,
  },
  {
    label: 'CVR (Units Based)',
    value: MetricsOptions.CVR_UNITS,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.CVR_UNITS,
  },
  {
    label: 'CVR (Orders Based)',
    value: MetricsOptions.CVR_ORDERS,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.CVR_ORDERS,
  },
  {
    label: 'ROAS',
    value: MetricsOptions.ROAS,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.ROAS,
  },
  {
    label: 'Total Units',
    value: MetricsOptions.TOTAL_UNITS,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.TOTAL_UNITS,
  },
  {
    label: 'Total Sales',
    value: MetricsOptions.TOTAL_SALES,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.TOTAL_SALES,
  },
  {
    label: 'GMV',
    value: MetricsOptions.GMV,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.GMV,
  },
  {
    label: 'Units Sold',
    value: MetricsOptions.UNITS_SOLD,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.GROSS_UNITS,
  },
  {
    label: 'ACOS',
    value: MetricsOptions.ACOS,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.ACOS,
  },
  {
    label: 'Advertised SKU Sales',
    value: MetricsOptions.ADVERTISED_SKU_SALES,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.ADVERTISED_SKU_SALES,
  },
  {
    label: 'Other SKU Sales',
    value: MetricsOptions.OTHER_SKU_SALES,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.OTHER_SKU_SALES,
  },
  {
    label: 'Advertised SKU Units',
    value: MetricsOptions.ADVERTISED_SKU_UNITS,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.ADVERTISED_SKU_UNITS,
  },
  {
    label: 'Other SKU Units',
    value: MetricsOptions.OTHER_SKU_UNITS,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.OTHER_SKU_UNITS,
  },
  {
    label: 'NTB units',
    value: MetricsOptions.NTB_UNITS,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.NTB_UNITS,
  },
  {
    label: 'NTB orders',
    value: MetricsOptions.NTB_ORDERS,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.NTB_ORDERS,
  },
  {
    label: 'NTB sales',
    value: MetricsOptions.NTB_SALES,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.NTB_SALES,
  },
  {
    label: '% of units NTB',
    value: MetricsOptions.PERCENTAGE_UNITS_NTB,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.PERCENTAGE_UNITS_NTB,
  },
  {
    label: '% of orders NTB',
    value: MetricsOptions.PERCENTAGE_ORDERS_NTB,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.PERCENTAGE_ORDERS_NTB,
  },
  {
    label: '% of sales NTB',
    value: MetricsOptions.PERCENTAGE_SALES_NTB,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.PERCENTAGE_SALES_NTB,
  },
  ...walmartInStoreAdvertisingMetricsOptions,
];

export const walmartAdvertisingVideoMetricsOptions: IDropdownItem<string>[] = [
  ...walmartAdvertisingMetricsOptions,
  {
    label: 'Complete View Ad Orders',
    value: MetricsOptions.COMPLETE_VIEW_AD_ORDERS,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.COMPLETE_VIEW_AD_ORDERS,
  },
  {
    label: 'Complete View Ad Units',
    value: MetricsOptions.COMPLETE_VIEW_AD_UNITS,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.COMPLETE_VIEW_AD_UNITS,
  },
  {
    label: 'Video Complete Views',
    value: MetricsOptions.VIDEO_COMPLETE_VIEWS,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.VIDEO_COMPLETE_VIEWS,
  },
  {
    label: 'Video First Quartile Views',
    value: MetricsOptions.VIDEO_FIRST_QUARTILE_VIEWS,
    selected: false,
    isDisabled: false,
    tooltipText:
      WALMART_ADVERTISING_METRICS_TOOLTIPS.VIDEO_FIRST_QUARTILE_VIEWS,
  },
  {
    label: 'Video Impressions',
    value: MetricsOptions.VIDEO_IMPRESSIONS,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.VIDEO_IMPRESSIONS,
  },
  {
    label: 'Video Midpoint Views',
    value: MetricsOptions.VIDEO_MIDPOINT_VIEWS,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.VIDEO_MIDPOINT_VIEWS,
  },
  {
    label: 'Video Third Quartile Views',
    value: MetricsOptions.VIDEO_THIRD_QUARTILE_VIEWS,
    selected: false,
    isDisabled: false,
    tooltipText:
      WALMART_ADVERTISING_METRICS_TOOLTIPS.VIDEO_THIRD_QUARTILE_VIEWS,
  },
  {
    label: 'Video Unmutes',
    value: MetricsOptions.VIDEO_UNMUTES,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.VIDEO_UNMUTES,
  },
  {
    label: 'Video 5 Second Views',
    value: MetricsOptions.VIDEO_5_SECOND_VIEWS,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.VIDEO_5_SECOND_VIEWS,
  },
  {
    label: 'Viewable impressions',
    value: MetricsOptions.VIEWABLE_IMPRESSIONS,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.VIEWABLE_IMPRESSIONS,
  },
  {
    label: 'View-Through Ad Orders',
    value: MetricsOptions.VIEW_THROUGH_AD_ORDERS,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.VIEW_THROUGH_AD_ORDERS,
  },
  {
    label: 'View-Through Ad Sales',
    value: MetricsOptions.VIEW_THROUGH_AD_SALES,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.VIEW_THROUGH_AD_SALES,
  },
  {
    label: 'View-Through Ad Units',
    value: MetricsOptions.VIEW_THROUGH_AD_UNITS,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.VIEW_THROUGH_AD_UNITS,
  },
  {
    label: 'Complete View Ad Sales',
    value: MetricsOptions.COMPLETE_VIEW_AD_SALES,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.COMPLETE_VIEW_AD_SALES,
  },
  {
    label: 'Other Complete View Ad Sales',
    value: MetricsOptions.OTHER_COMPLETE_VIEW_AD_SALES,
    selected: false,
    isDisabled: false,
    tooltipText:
      WALMART_ADVERTISING_METRICS_TOOLTIPS.OTHER_COMPLETE_VIEW_AD_SALES,
  },
  {
    label: 'VTR',
    value: MetricsOptions.VTR,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.VTR,
  },
  {
    label: 'vCTR',
    value: MetricsOptions.VCTR,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.VCTR,
  },
  {
    label: 'Video 5 Second View Rate',
    value: MetricsOptions.VIDEO_5_SECOND_VIEW_RATE,
    selected: false,
    isDisabled: false,
    tooltipText: WALMART_ADVERTISING_METRICS_TOOLTIPS.VIDEO_5_SECOND_VIEW_RATE,
  },
];

export const WALMART_SP_AD_ITEMS_MAX = 2000;
export const WALMART_SB_AD_ITEMS_MAX = 10;
export const WALMART_SV_AD_ITEMS_MAX = 10;
export const WALMART_SP_KEYWORDS_MAX = 1000;
export const WALMART_SB_KEYWORDS_MAX = 200;
export const WALMART_SV_KEYWORDS_MAX = 200;
export const WALMART_BUDGET_MAX = 100000;
export const WALMART_3P_TOTAL_BUDGET_MIN = 50;
export const WALMART_1P_TOTAL_BUDGET_MIN = 100;
export const WALMART_3P_DAILY_BUDGET_MIN = 10;
export const WALMART_1P_DAILY_BUDGET_MIN = 50;
export const WALMART_INDEFINITE_END_DATE = '9999-12-31';
export const MAX_YEAR = '9999';
export const MULTIPLIER_MAX = 50000;
export const INDEFINITE = 'INDEFINITE';
export const MIN_DEFAULT_DATE = '1900-01-01';

export const WALMART_PAGE_TYPE_TO_ACTUAL_MAPPINGS: { [key: string]: string } = {
  item: PageTypeActualEnum.ITEM,
  search: PageTypeActualEnum.SEARCH,
  homepage: PageTypeActualEnum.HOMEPAGE,
  stockup: PageTypeActualEnum.STOCK_UP,
  others: PageTypeActualEnum.OTHERS,
  category: PageTypeActualEnum.CATEGORY,
  topic: PageTypeActualEnum.TOPIC,
  browse: PageTypeActualEnum.BROWSE,
};

export const WALMART_PAGE_TYPE_TO_TABLE_MAPPINGS: { [key: string]: string } = {
  'Buy-Box': PageTypeTableEnum.ITEM,
  'Search Ingrid': PageTypeTableEnum.SEARCH,
  'Home Page': PageTypeTableEnum.HOMEPAGE,
  'Stock Up': PageTypeTableEnum.STOCK_UP,
  Others: PageTypeTableEnum.OTHERS,
  Category: PageTypeTableEnum.CATEGORY,
  Topic: PageTypeTableEnum.TOPIC,
  Browse: PageTypeTableEnum.BROWSE,
};

export const WALMART_AD_TYPE_MAPPINGS: { [key: string]: string } = {
  [FilterDropdownValue.SP]: WalmartAdTypeEnum.SPONSORED_PRODUCTS,
  [FilterDropdownValue.SB]: WalmartAdTypeEnum.SPONSORED_BRANDS,
  [FilterDropdownValue.SV]: WalmartAdTypeEnum.SPONSORED_VIDEO,
};

export const CATALOG_PRIMARY_MAPPINGS: { [key: string]: string } = {
  [FilterDropdownValue.YES]: ProductVariantTypeEnum.PRIMARY_VARIANT,
  [FilterDropdownValue.NO]: ProductVariantTypeEnum.NON_PRIMARY_VARIANT,
};
export const CATALOG_PRIMARY_VARIANT_MAPPING: { [key: string]: string } = {
  [ProductVariantTypeEnum.PRIMARY_VARIANT]: FilterDropdownValue.YES,
  [ProductVariantTypeEnum.NON_PRIMARY_VARIANT]: FilterDropdownValue.NO,
};

export const ADS_ELIGIBILITY_MAPPING: { [key: string]: string } = {
  [FilterDropdownValue.YES]: 'TRUE',
  [FilterDropdownValue.NO]: 'FALSE',
};

export const BIDDING_STRATEGY_MAPPING: { [key: string]: string } = {
  [FilterDropdownValue.UP_DOWN]: FilterDropdownValue.AUTO_FOR_SALES,
  [FilterDropdownValue.FIXED_BIDS]: FilterDropdownValue.FIXED_BIDS_MANUAL,
  [FilterDropdownValue.DOWN_ONLY]: FilterDropdownValue.LEGACY_FOR_SALES,
  [FilterDropdownValue.RULE_BASED]: FilterDropdownValue.RULE_BASED,
};

export const WALMART_CAMPAIGN_OPTIONS_MAP: Map<string, boolean> = new Map([
  [WalmartCampaignOptionsEnums.BRAND_TERM_OPT_OUT, false],
  [WalmartCampaignOptionsEnums.COMPLEMENTARY_OPT_OUT, false],
]);

export const WALMART_BIDDER_COLUMNS = [
  ColumnNameEnum.PRODUCT_BID,
  ColumnNameEnum.BID_AUTOMATION,
  ColumnNameEnum.KEYWORD_AUTOMATION,
  ColumnNameEnum.PRODUCT_AUTOMATION,
  ColumnNameEnum.MAX_BID,
  ColumnNameEnum.MIN_BID,
  ColumnNameEnum.TARGET_ROAS,
];
export const tacosMetricOptionPayload = {
  payload: walmartTACOSMetricOption,
};
