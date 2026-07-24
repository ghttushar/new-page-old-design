import { ProductAdsEligibilityEnum } from '@/enums/advertising.enums';
import { ConfigurationTableTitlesEnum } from '@/enums/configurations.enum';
import { CronHandlerEnum } from '@/enums/cron/cron-definitions.enum';
import { IBidderDashboardFilterOptions } from '@/interfaces/bidder-dashboard.interface';
import {
  FilterDropdownValue,
  FilterOptions,
  FilterValueType,
  Filters,
} from 'src/enums/filter.enums';

export const getFilterTypes = (value?: FilterValueType) => {
  switch (value) {
    case FilterValueType.TEXT:
      return [
        FilterOptions.IS,
        FilterOptions.IS_NOT,
        FilterOptions.CONTAINS,
        FilterOptions.DOES_NOT_CONTAIN,
        FilterOptions.STARTS_WITH,
        FilterOptions.ENDS_WITH,
      ];
    case FilterValueType.NUMBER:
    case FilterValueType.NEGATIVE_NUMBER:
      return [
        FilterOptions.IS_EQUAL_TO,
        FilterOptions.IS_GREATER_THAN,
        FilterOptions.IS_GREATER_THAN_EQUAL_TO,
        FilterOptions.IS_LESS_THAN,
        FilterOptions.IS_LESS_THAN_EQUAL_TO,
        FilterOptions.IS_NOT,
        FilterOptions.IN_BETWEEN,
      ];
    case FilterValueType.DROPDOWN:
      return [FilterOptions.IS, FilterOptions.IS_NOT];

    case FilterValueType.MULTI_SELECT_DROPDOWN:
      return [FilterOptions.IN, FilterOptions.NOT_IN];

    case FilterValueType.DATE:
      return [
        FilterOptions.IS_ON,
        FilterOptions.IS_AFTER,
        FilterOptions.IS_BEFORE,
        FilterOptions.IN_BETWEEN,
      ];

    case FilterValueType.JSONB:
      return [FilterOptions.CONTAINS, FilterOptions.DOES_NOT_CONTAIN];

    default:
      return [];
  }
};
export const campaignLevelOptions = [
  FilterDropdownValue.NAME,
  FilterDropdownValue.STATUS,
  FilterDropdownValue.DAILY_BUDGET,
  FilterDropdownValue.END_DATE,
  FilterDropdownValue.PLACEMENT_BID_MULTIPLIER,
];
export const adGroupLevelOptions = [
  FilterDropdownValue.AD_GROUP_NAME,
  FilterDropdownValue.AD_GROUP_STATUS,
  FilterDropdownValue.BID,
];

export const targetingLevelOptions = [
  FilterDropdownValue.PRODUCT_AD_STATUS,
  FilterDropdownValue.KEYWORD_TARGET_STATUS,
  FilterDropdownValue.KEYWORD_TARGET_BID,
  FilterDropdownValue.BIDDER_SETTING,
  FilterDropdownValue.NEW_KEYWORD,
  FilterDropdownValue.NEW_PRODUCT,
];
export interface IFilterSetting {
  filterKey: Filters;
  filterLabel: string;
  filterValueType: FilterValueType;
  filterDropdownValue?: FilterDropdownValue[];
}

export const CONFIGURATION_TABLE_FILTER_CONFIG: Record<
  ConfigurationTableTitlesEnum,
  IFilterSetting[]
> = {
  [ConfigurationTableTitlesEnum.SOURCE_TARGET_MAPPING]: [
    {
      filterKey: Filters.SOURCE_ADGROUP,
      filterLabel: 'Source AdGroup',
      filterValueType: FilterValueType.TEXT,
    },
    {
      filterKey: Filters.TARGET_ADGROUP,
      filterLabel: 'Target AdGroup',
      filterValueType: FilterValueType.TEXT,
    },
    {
      filterKey: Filters.MATCH_TYPES,
      filterLabel: 'Match Type',
      filterDropdownValue: [
        FilterDropdownValue.BROAD,
        FilterDropdownValue.EXACT,
        FilterDropdownValue.PHRASE,
        FilterDropdownValue.NEGATIVE_EXACT,
        FilterDropdownValue.NEGATIVE_PHRASE,
        FilterDropdownValue.ASIN_SAME_AS,
        FilterDropdownValue.ASIN_EXPANDED_FROM,
        FilterDropdownValue.NEGATIVE_ASIN_SAME_AS,
      ],
      filterValueType: FilterValueType.MULTI_SELECT_DROPDOWN,
    },
  ],
  [ConfigurationTableTitlesEnum.HERO_ITEMS]: [
    {
      filterKey: Filters.STATUS,
      filterLabel: 'Status',
      filterDropdownValue: [
        FilterDropdownValue.ENABLED,
        FilterDropdownValue.ARCHIVED,
        FilterDropdownValue.PAUSED,
        FilterDropdownValue.DISABLED,
        FilterDropdownValue.SCHEDULED,
        FilterDropdownValue.RESCHEDULED,
        FilterDropdownValue.LIVE,
        FilterDropdownValue.ENDED,
        FilterDropdownValue.PROPOSAL,
        FilterDropdownValue.DELETED,
      ],
      filterValueType: FilterValueType.DROPDOWN,
    },
    {
      filterKey: Filters.PRODUCT_NAME,
      filterLabel: 'Product Name',
      filterValueType: FilterValueType.TEXT,
    },
    {
      filterKey: Filters.ENTITY_ID,
      filterLabel: 'ASIN/Item ID',
      filterValueType: FilterValueType.TEXT,
    },
    {
      filterKey: Filters.AD_TYPE,
      filterLabel: 'Ad Type',
      filterDropdownValue: [
        FilterDropdownValue.SP,
        FilterDropdownValue.SB,
        FilterDropdownValue.SD,
        FilterDropdownValue.SV,
      ],
      filterValueType: FilterValueType.DROPDOWN,
    },
  ],
};

export const APPLIED_RULES_FILTER_CONFIG: IFilterSetting[] = [
  {
    filterKey: Filters.STATUS,
    filterLabel: 'Status',
    filterValueType: FilterValueType.DROPDOWN,
    filterDropdownValue: [
      FilterDropdownValue.ACTIVE,
      FilterDropdownValue.PAUSED,
      FilterDropdownValue.DRAFT,
      FilterDropdownValue.ARCHIVED,
      FilterDropdownValue.ENDED,
    ],
  },
  {
    filterKey: Filters.RULE_ID,
    filterLabel: 'Rule ID',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.RULE_NAME,
    filterLabel: 'Rule Name',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.RULE_TYPE,
    filterLabel: 'Rule Type',
    filterValueType: FilterValueType.DROPDOWN,
    filterDropdownValue: [
      FilterDropdownValue.BIDDER_RULE,
      FilterDropdownValue.BIDDING_STRATEGY_RULE,
      FilterDropdownValue.BUDGET_RULE,
      FilterDropdownValue.DAYPARTING_RULE,
      FilterDropdownValue.INVENTORY_RULE,
      FilterDropdownValue.KEYWORD_HARVESTING_RULE,
      FilterDropdownValue.KEYWORD_RULE,
      FilterDropdownValue.PAGE_TYPE_RULE,
      FilterDropdownValue.PLACEMENT_RULE,
      FilterDropdownValue.PLATFORM_RULE,
      FilterDropdownValue.SOV_RULE,
      FilterDropdownValue.STATE_CHANGE_RULE,
      FilterDropdownValue.TARGET_RULE,
      FilterDropdownValue.UNKNOWN,
    ],
  },
  {
    filterKey: Filters.ENTITY_COUNT,
    filterLabel: 'Entity Count',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.FREQUENCY,
    filterLabel: 'Frequency',
    filterValueType: FilterValueType.DROPDOWN,
    filterDropdownValue: [
      FilterDropdownValue.DAILY,
      FilterDropdownValue.WEEKLY,
      FilterDropdownValue.MONTHLY,
    ],
  },
];

export const FILTER_CONFIG: IFilterSetting[] = [
  {
    filterKey: Filters.CAMPAIGN_NAME,
    filterLabel: 'Campaign Name',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.SKU,
    filterLabel: 'SKU',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.ITEM_ID,
    filterLabel: 'Item Id',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.FULFILLMENT_TYPE,
    filterLabel: 'Fulfillment Type',
    filterDropdownValue: [
      FilterDropdownValue.WFS_ELIGIBLE,
      FilterDropdownValue.SELLER_FULFILLED,
      FilterDropdownValue.WALMART_FULFILLED,
    ],
    filterValueType: FilterValueType.DROPDOWN,
  },
  {
    filterKey: Filters.ADGROUP_NAME,
    filterLabel: 'AdGroup Name',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.AD_TYPE,
    filterLabel: 'Ad Type',
    filterDropdownValue: [
      FilterDropdownValue.SP,
      FilterDropdownValue.SB,
      FilterDropdownValue.SD,
    ],
    filterValueType: FilterValueType.DROPDOWN,
  },
  {
    filterKey: Filters.REFUND_ORDERS,
    filterLabel: 'Refund Orders',
    filterValueType: FilterValueType.NUMBER,
  },

  {
    filterKey: Filters.REFUND_SALES,
    filterLabel: 'Refund Sales',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.GROSS_SALES,
    filterLabel: 'Gross Sales',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.GROSS_UNITS_SOLD,
    filterLabel: 'Gross Units Sold',
    filterValueType: FilterValueType.NUMBER,
  },

  {
    filterKey: Filters.SEARCH_TERM,
    filterLabel: 'Search Term',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.SOURCE_CAMPAIGN,
    filterLabel: 'Source Campaign',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.SOURCE_ADGROUP,
    filterLabel: 'Source AdGroup',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.MATCHED_ASINS,
    filterLabel: 'Matched ASINs',
    filterDropdownValue: [
      FilterDropdownValue.HIGH,
      FilterDropdownValue.MEDIUM,
      FilterDropdownValue.LOW,
    ],
    filterValueType: FilterValueType.DROPDOWN,
  },
  {
    filterKey: Filters.TARGET_CAMPAIGN,
    filterLabel: 'Target Campaign',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.TARGET_ADGROUP,
    filterLabel: 'Target AdGroup',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.MATCH_TYPE_ADD,
    filterLabel: 'Match Type To Add',
    filterDropdownValue: [
      FilterDropdownValue.EXACT,
      FilterDropdownValue.BROAD,
      FilterDropdownValue.PHRASE,
    ],
    filterValueType: FilterValueType.DROPDOWN,
  },
  {
    filterKey: Filters.TAG,
    filterLabel: 'Tag',
    filterDropdownValue: [
      FilterDropdownValue.BRANDED,
      FilterDropdownValue.COMPETITOR,
      FilterDropdownValue.GENERIC,
    ],
    filterValueType: FilterValueType.DROPDOWN,
  },
  {
    filterKey: Filters.ADGROUP_COUNT,
    filterLabel: 'AdGroup Count',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.ASIN_TITLE,
    filterLabel: 'Title',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.BRAND_NAME,
    filterLabel: 'Brand Name',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.ASIN_PRICE,
    filterLabel: 'Price',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.RATINGS,
    filterLabel: 'Ratings',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.REVIEWS,
    filterLabel: 'Reviews',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.TARGETING_TYPE,
    filterLabel: 'Targeting Type',
    filterDropdownValue: [FilterDropdownValue.AUTO, FilterDropdownValue.MANUAL],
    filterValueType: FilterValueType.DROPDOWN,
  },
  {
    filterKey: Filters.STATUS,
    filterLabel: 'Status',
    filterDropdownValue: [
      FilterDropdownValue.ENABLED,
      FilterDropdownValue.ARCHIVED,
      FilterDropdownValue.PAUSED,
      FilterDropdownValue.DISABLED,
      FilterDropdownValue.SCHEDULED,
      FilterDropdownValue.RESCHEDULED,
      FilterDropdownValue.LIVE,
      FilterDropdownValue.ENDED,
      FilterDropdownValue.PROPOSAL,
      FilterDropdownValue.DELETED,
    ],
    filterValueType: FilterValueType.DROPDOWN,
  },
  {
    filterKey: Filters.AUTOMATION_STATUS,
    filterLabel: 'Automation Status',
    filterValueType: FilterValueType.DROPDOWN,
    filterDropdownValue: [
      FilterDropdownValue.ENABLED,
      FilterDropdownValue.PAUSED,
      FilterDropdownValue.NONE,
    ],
  },
  {
    filterKey: Filters.PUBLISH_STATUS,
    filterLabel: 'Status',
    filterDropdownValue: [
      FilterDropdownValue.PUBLISHED,
      FilterDropdownValue.UNPUBLISHED,
      FilterDropdownValue.SYSTEM_PROBLEM,
    ],
    filterValueType: FilterValueType.DROPDOWN,
  },
  {
    filterKey: Filters.PRIMARY,
    filterLabel: 'Primary Variant',
    filterValueType: FilterValueType.DROPDOWN,
    filterDropdownValue: [FilterDropdownValue.YES, FilterDropdownValue.NO],
  },
  {
    filterKey: Filters.CAMPAIGN_STATUS,
    filterLabel: 'Campaign Status',
    filterDropdownValue: [
      FilterDropdownValue.ENABLED,
      FilterDropdownValue.ARCHIVED,
      FilterDropdownValue.PAUSED,
    ],
    filterValueType: FilterValueType.DROPDOWN,
  },
  {
    filterKey: Filters.ADGROUP_STATUS,
    filterLabel: 'AdGroup Status',
    filterDropdownValue: [
      FilterDropdownValue.ENABLED,
      FilterDropdownValue.ARCHIVED,
      FilterDropdownValue.PAUSED,
    ],
    filterValueType: FilterValueType.DROPDOWN,
  },
  {
    filterKey: Filters.BUDGET,
    filterLabel: 'Budget',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.BID,
    filterLabel: 'Bid',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.DEFAULT_BID,
    filterLabel: 'Default Bid',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.BIDDING_STRATEGY,
    filterLabel: 'Bidding Strategy',
    filterDropdownValue: [
      FilterDropdownValue.DOWN_ONLY,
      FilterDropdownValue.UP_DOWN,
      FilterDropdownValue.FIXED_BIDS,
      FilterDropdownValue.RULE_BASED,
    ],
    filterValueType: FilterValueType.DROPDOWN,
  },

  {
    filterKey: Filters.STRATEGY,
    filterLabel: 'Bidding Strategy',
    filterDropdownValue: [
      FilterDropdownValue.DOWN_ONLY,
      FilterDropdownValue.UP_DOWN,
      FilterDropdownValue.FIXED_BIDS,
      FilterDropdownValue.RULE_BASED,
    ],
    filterValueType: FilterValueType.DROPDOWN,
  },

  {
    filterKey: Filters.PRODUCT_AD,
    filterLabel: 'Product Ad',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.PRODUCT_NAME,
    filterLabel: 'Product Name',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.PRODUCT_NAME_1,
    filterLabel: 'Product Name',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.PRODUCT_AD_NAME,
    filterLabel: 'Product Ad',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.PRODUCT_AD_ASIN,
    filterLabel: 'Asin',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.LISTING_PRICE,
    filterLabel: 'Listing Price',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.KEYWORD_TEXT,
    filterLabel: 'Keyword',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.KEYWORD,
    filterLabel: 'Keyword',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.MATCH_TYPE,
    filterLabel: 'Match Type',
    filterDropdownValue: [
      FilterDropdownValue.BROAD,
      FilterDropdownValue.EXACT,
      FilterDropdownValue.PHRASE,
      FilterDropdownValue.NEGATIVE_EXACT,
      FilterDropdownValue.NEGATIVE_PHRASE,
      FilterDropdownValue.EXACT,
      FilterDropdownValue.ASIN_EXPANDED_FROM,
      FilterDropdownValue.NEGATIVE_ASIN_SAME_AS,
      FilterDropdownValue.TARGETING_EXPRESSION,
      FilterDropdownValue.PREDEFINED,
    ],
    filterValueType: FilterValueType.DROPDOWN,
  },
  {
    filterKey: Filters.TARGETING,
    filterLabel: 'Targeting',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.IMPRESSIONS,
    filterLabel: 'Impressions',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.CLICKS,
    filterLabel: 'Clicks',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.CTR,
    filterLabel: 'CTR',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.CPC,
    filterLabel: 'CPC',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.CVR,
    filterLabel: 'CVR',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.UNITS_SOLD,
    filterLabel: 'Ad Units',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.AD_SALES,
    filterLabel: 'Ad Sales',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.AD_SPEND,
    filterLabel: 'Ad Spend',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.ROAS,
    filterLabel: 'ROAS',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.ACOS,
    filterLabel: 'ACOS',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.AD_ORDERS,
    filterLabel: 'Ad Orders',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.CVR_UNITS,
    filterLabel: 'CVR Units Based',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.CVR_ORDERS,
    filterLabel: 'CVR Orders Based',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.ADVERTISED_SALES,
    filterLabel: 'Advertised SKU Sales',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.OTHER_SALES,
    filterLabel: 'Other SKU Sales',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.ADVERTISED_UNITS,
    filterLabel: 'Advertised SKU Units',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.OTHER_UNITS,
    filterLabel: 'Other SKU Units',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.NTB_UNITS,
    filterLabel: 'NTB Units',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.NTB_ORDERS,
    filterLabel: 'NTB Orders',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.NTB_SALES,
    filterLabel: 'NTB Sales',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.PERCENT_NTB_UNITS,
    filterLabel: '% of NTB Units',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.PERCENT_NTB_ORDERS,
    filterLabel: '% of NTB Orders',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.PERCENT_NTB_SALES,
    filterLabel: '% of NTB Sales',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.AD_TYPE_WALMART,
    filterLabel: 'Ad Type',
    filterDropdownValue: [
      FilterDropdownValue.SP,
      FilterDropdownValue.SB,
      FilterDropdownValue.SV,
    ],
    filterValueType: FilterValueType.DROPDOWN,
  },
  {
    filterKey: Filters.BUDGET_TYPE,
    filterLabel: 'Budget Type',
    filterDropdownValue: [
      FilterDropdownValue.BUDGET_TYPE_DAILY,
      FilterDropdownValue.BUDGET_TYPE_TOTAL,
      FilterDropdownValue.BUDGET_TYPE_BOTH,
    ],
    filterValueType: FilterValueType.DROPDOWN,
  },
  {
    filterKey: Filters.TOTAL_BUDGET,
    filterLabel: 'Total Budget',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.DAILY_BUDGET,
    filterLabel: 'Daily Budget',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.BID_WALMART,
    filterLabel: 'Bid',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.BID_MULTIPLIER,
    filterLabel: 'Bid Multiplier',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.PAGE_TYPE,
    filterLabel: 'Page Type',
    filterDropdownValue: [
      FilterDropdownValue.ITEM,
      FilterDropdownValue.SEARCH,
      FilterDropdownValue.HOMEPAGE,
      FilterDropdownValue.STOCK_UP,
      FilterDropdownValue.OTHERS,
      FilterDropdownValue.CATEGORY,
      FilterDropdownValue.TOPIC,
      FilterDropdownValue.BROWSE,
    ],
    filterValueType: FilterValueType.DROPDOWN,
  },
  {
    filterKey: Filters.PLATFORM,
    filterLabel: 'Platform',
    filterDropdownValue: [
      FilterDropdownValue.DESKTOP,
      FilterDropdownValue.MOBILE,
      FilterDropdownValue.APP,
    ],
    filterValueType: FilterValueType.DROPDOWN,
  },
  {
    filterKey: Filters.COMPLETE_VIEW_ORDERS,
    filterLabel: 'Complete View Ad Orders',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.COMPLETE_VIEW_AD_UNITS,
    filterLabel: 'Complete View Ad Units',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.VIDEO_COMPLETE_VIEWS,
    filterLabel: 'Video Complete Views',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.VIDEO_FIRST_QUARTILE_VIEWS,
    filterLabel: 'Video First Quartile Views',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.VIDEO_IMPRESSIONS,
    filterLabel: 'Video Impressions',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.VIDEO_MIDPOINT_VIEWS,
    filterLabel: 'Video Midpoint Views',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.VIDEO_THIRD_QUARTILE_VIEWS,
    filterLabel: 'Video Third Quartile Views',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.VIDEO_UNMUTES,
    filterLabel: 'Video Unmutes',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.VIDEO_5_SEC_VIEWS,
    filterLabel: 'Video 5 Second Views',
    filterValueType: FilterValueType.NUMBER,
  },

  {
    filterKey: Filters.VIEWABLE_IMPRESSIONS,
    filterLabel: 'Viewable Impressions',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.VIEW_THROUGH_AD_ORDERS,
    filterLabel: 'View-Through Ad Orders',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.VIEW_THROUGH_AD_SALES,
    filterLabel: 'View-Through Ad Sales',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.VIEW_THROUGH_AD_UNITS,
    filterLabel: 'View-Through Ad Units',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.COMPLETE_VIEW_AD_SALES,
    filterLabel: 'Complete View Ad Sales',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.OTHER_COMPLETE_VIEW_AD_SALES,
    filterLabel: 'Other Complete View Ad Sales',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.VTR,
    filterLabel: 'VTR',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.VCTR,
    filterLabel: 'vCTR',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.VIDEO_5_SEC_VIEW_RATE,
    filterLabel: 'Video 5 Second View Rate',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.BUY_BOX,
    filterLabel: 'Buy Box',
    filterDropdownValue: [FilterDropdownValue.YES, FilterDropdownValue.NO],
    filterValueType: FilterValueType.DROPDOWN,
  },
  {
    filterKey: Filters.LQS,
    filterLabel: 'LQS',
    filterValueType: FilterValueType.NUMBER,
  },
  //TODO: Add this filter in the future
  // {
  //   filterKey: Filters.REVIEWS_RATINGS,
  //   filterLabel: 'Reviews & Ratings',
  //   filterValueType: FilterValueType.NUMBER,
  // },
  {
    filterKey: Filters.CATEGORY_PATH,
    filterLabel: 'Category Path',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.PRODUCT_SOV,
    filterLabel: 'Product SOV',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.AVAIL_TO_SELL_QUANTITY,
    filterLabel: 'Available to Sell Quantity',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.SELLER_INVENTORY,
    filterLabel: 'Seller Inventory',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.WFS_INVENTORY,
    filterLabel: 'WFS Inventory',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.INVENTORY_VALUE,
    filterLabel: 'Inventory Value',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.INVENTORY_VALUE_COGS,
    filterLabel: 'Inventory Value COGS',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.INVENTORY_VALUE_RETAIL,
    filterLabel: 'Inventory Value Retail',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.PRICE,
    filterLabel: 'Price',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.COGS,
    filterLabel: 'COGS',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.WALMART_FEE,
    filterLabel: 'Walmart Fee',
    filterValueType: FilterValueType.NUMBER,
  },
  //TODO: Add this filter in the future
  // {
  //   filterKey: Filters.WFS,
  //   filterLabel: 'WFS',
  //   filterDropdownValue: [FilterDropdownValue.YES, FilterDropdownValue.NO],
  //   filterValueType: FilterValueType.DROPDOWN,
  // },
  {
    filterKey: Filters.GROSS_MARGIN,
    filterLabel: 'Gross Margin',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.GROSS_MARGIN_PERCENTAGE,
    filterLabel: 'Gross Margin Percentage',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.RETURNS,
    filterLabel: 'Returns',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.CANCELLED_ORDERS,
    filterLabel: 'Cancelled Orders',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.CANCELLED_SALES_PRICE,
    filterLabel: 'Cancelled Sales',
    filterValueType: FilterValueType.NUMBER,
  },
  //TODO: Add this filter in the future
  // {
  //   filterKey: Filters.PROMO_SPEND,
  //   filterLabel: 'Promo Spend',
  //   filterValueType: FilterValueType.NUMBER,
  // },
  {
    filterKey: Filters.ADVERTISED,
    filterLabel: 'Advertised',
    filterDropdownValue: [FilterDropdownValue.YES, FilterDropdownValue.NO],
    filterValueType: FilterValueType.DROPDOWN,
  },
  {
    filterKey: Filters.TOTAL_UNITS,
    filterLabel: 'Total Units',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.TACOS,
    filterLabel: 'TACOS',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.AD_UNITS_SOLD,
    filterLabel: 'Ad Units Sold',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.CVR_UNIT_SOLD_BASED,
    filterLabel: 'CVR Unit Sold Based',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.CVR_ORDER_BASED,
    filterLabel: 'CVR Order Based',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.CAMPAIGNS,
    filterLabel: 'Campaigns',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.PLACEMENT,
    filterLabel: 'Placement',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.BID_ADJUSTMENT,
    filterLabel: 'Bid Adjustment',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.ACTION_TYPE,
    filterLabel: 'Action Type',
    filterValueType: FilterValueType.DROPDOWN,
    filterDropdownValue: [
      ...campaignLevelOptions,
      ...adGroupLevelOptions,
      ...targetingLevelOptions,
    ],
  },
  {
    filterKey: Filters.START_DATE,
    filterLabel: 'Start Date',
    filterValueType: FilterValueType.DATE,
  },
  {
    filterKey: Filters.END_DATE,
    filterLabel: 'End Date',
    filterValueType: FilterValueType.DATE,
  },
  {
    filterKey: Filters.AVG_CAP_OUT_TIME,
    filterLabel: 'Avg. Cap out time',
    filterValueType: FilterValueType.DATE,
  },
  {
    filterKey: Filters.SUGGESTED_DAILY_BUDGET_COLUMN,
    filterLabel: 'Sugg. Daily Budget',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.SUGGESTED_TOTAL_BUDGET_COLUMN,
    filterLabel: 'Sugg. Total Budget',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.ADS_ELIGIBILITY,
    filterLabel: 'Ads Eligibility',
    filterValueType: FilterValueType.DROPDOWN,
    filterDropdownValue: Object.values(
      ProductAdsEligibilityEnum
    ) as unknown as FilterDropdownValue[],
  },
  {
    filterKey: Filters.IN_STORE_ADVERTISED_SALES,
    filterLabel: 'In-Store Advertised Sales',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.IN_STORE_UNITS_SOLD,
    filterLabel: 'In-Store Units Sold',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.IN_STORE_OTHER_SALES,
    filterLabel: 'In-Store Other Sales',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.IN_STORE_ORDERS,
    filterLabel: 'In-Store Orders',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.IN_STORE_ATTRIBUTES_SALES,
    filterLabel: 'In-Store Attributed Sales',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.OMNI_CHANNEL_ROAS,
    filterLabel: 'Omnichannel ROAS',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.OMNI_CHANNEL_SALES,
    filterLabel: 'Omnichannel Sales',
    filterValueType: FilterValueType.NUMBER,
    filterDropdownValue: [FilterDropdownValue.YES, FilterDropdownValue.NO],
  },

  {
    filterKey: Filters.TASK_ID,
    filterLabel: 'Task Id',
    filterValueType: FilterValueType.TEXT,
  },

  {
    filterKey: Filters.TASK_PROCESSING_COMPLETED_AT,
    filterLabel: 'Task Completed At',
    filterValueType: FilterValueType.DATE,
  },

  {
    filterKey: Filters.TASK_PROCESS_CREATED_AT,
    filterLabel: 'Task Created At',
    filterValueType: FilterValueType.DATE,
  },

  {
    filterKey: Filters.TASK_PROCESS_STARTED_AT,
    filterLabel: 'Task Started At',
    filterValueType: FilterValueType.DATE,
  },
  {
    filterKey: Filters.ACCOUNT_ID,
    filterLabel: 'Account Id',
    filterValueType: FilterValueType.TEXT,
  },

  {
    filterKey: Filters.META_ID,
    filterLabel: 'Meta Id',
    filterValueType: FilterValueType.TEXT,
  },

  {
    filterKey: Filters.TIME_TAKEN_TO_COMPLETE,
    filterLabel: 'Time Taken to Complete',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.TIME_TAKEN_TO_START,
    filterLabel: 'Time Taken to Start',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.TOTAL_LIFE_TIME,
    filterLabel: 'Total Life Time',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.PARTNER_ID,
    filterLabel: 'Partner ID',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.ORDER_DATE_LABEL,
    filterLabel: 'Order Date',
    filterValueType: FilterValueType.DATE,
  },
  {
    filterKey: Filters.PURCHASE_ORDER_ID,
    filterLabel: 'Purchase Order ID',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.PURCHASE_ORDER_LINE,
    filterLabel: 'Purchase Order Line',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.PURCHASE_ORDER_SKU,
    filterLabel: 'Purchase Order SKU',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.PURCHASE_ORDER_PRODUCT_NAME,
    filterLabel: 'Product Name',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.PURCHASE_ORDER_ITEM_ID,
    filterLabel: 'Item ID',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.PURCHASE_ORDER_LINE_QUANTITY,
    filterLabel: 'Order Line Quantity',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.PURCHASE_STATUS,
    filterLabel: 'Purchase Status',
    filterValueType: FilterValueType.DROPDOWN,
    filterDropdownValue: [
      FilterDropdownValue.DELIVERED,
      FilterDropdownValue.SHIPPED,
      FilterDropdownValue.REFUND_COMPLETED_MAPPED,
      FilterDropdownValue.ORDER_CANCELLED,
      FilterDropdownValue.ACKNOWLEDGED,
    ],
  },
  {
    filterKey: Filters.PRODUCT_PRICE,
    filterLabel: 'Product Price',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.TOTAL_UNITS_SOLD,
    filterLabel: 'Units Sold',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.ORDER_UNITS,
    filterLabel: 'Orders',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.REFUND_UNITS,
    filterLabel: 'Refund Units',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.CANCELLED_UNITS,
    filterLabel: 'Cancelled Units',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.TOTAL_SALES,
    filterLabel: 'Total Sales',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.AUTH_SALES,
    filterLabel: 'Auth Sales',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.REFUND_SALES,
    filterLabel: 'Refund Sales',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.CANCELLED_SALES_PRICE,
    filterLabel: 'Cancelled Sales',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.COMMISSION_ON_PRODUCT,
    filterLabel: 'Commission on Product',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.COMMISSION_ON_SHIPPING,
    filterLabel: 'Commission on Shipping',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.EXCESS_REFUND_ADJUSTMENT,
    filterLabel: 'Excess Refund Adjustment',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.EXTRA_DISCOUNT,
    filterLabel: 'Extra Discount',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.OTHER_TAX_FEES,
    filterLabel: 'Other Tax Fees',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.PRODUCT_TAX,
    filterLabel: 'Product Tax',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.PRODUCT_TAX_WITHHELD,
    filterLabel: 'Product Tax Withheld',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.PROMO_CODE,
    filterLabel: 'Promo Code',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.WALMART_FUNDED_SAVINGS,
    filterLabel: 'Walmart Funded Savings',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.WFS_FULFILLMENT_FEE,
    filterLabel: 'WFS Fulfillment Fee',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.SHIPPING,
    filterLabel: 'Shipping Fees',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.SHIPPING_TAX,
    filterLabel: 'Shipping Tax',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.SHIPPING_TAX_WITHHELD,
    filterLabel: 'Shipping Tax Withheld',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.WFS_RETURN_SHIPPING_FEE,
    filterLabel: 'WFS Return Shipping Fee',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.WALMART_RETURN_SHIPPING_CHARGE,
    filterLabel: 'Walmart Return Shipping Charge',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.NET_PROFIT,
    filterLabel: 'Net Profit',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.ADDITIONAL_FEE,
    filterLabel: 'Additional Fee',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.COST_TYPE,
    filterLabel: 'Cost Type',
    filterDropdownValue: [FilterDropdownValue.CPC, FilterDropdownValue.VCPM],
    filterValueType: FilterValueType.DROPDOWN,
  },
  {
    filterKey: Filters.BID_OPTIMIZATION,
    filterLabel: 'Bid Optimization',
    filterDropdownValue: [
      FilterDropdownValue.REACH,
      FilterDropdownValue.CLICKS,
      FilterDropdownValue.CONVERSIONS,
    ],
    filterValueType: FilterValueType.DROPDOWN,
  },
  {
    filterKey: Filters.CORRELATION_ID,
    filterLabel: 'Correlation Id',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.PLACEMENT_PERCENTAGE,
    filterLabel: 'Bid Adjustment',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.LIST_PRICE,
    filterLabel: 'Listing Price',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.SELLER_SKU,
    filterLabel: 'SKU',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.AMAZON_IS_ADVERTISED,
    filterLabel: 'Advertised',
    filterValueType: FilterValueType.DROPDOWN,
    filterDropdownValue: [FilterDropdownValue.YES, FilterDropdownValue.NO],
  },
  {
    filterKey: Filters.AVG_CPC,
    filterLabel: 'Avg. CPC',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.UPC_CODE,
    filterLabel: 'UPC Code',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.AMAZON_FULFILLMENT,
    filterLabel: 'Amazon Fulfillment',
    filterValueType: FilterValueType.DROPDOWN,
    filterDropdownValue: [
      FilterDropdownValue.AMAZON_NA_FULFILLMENT_MAPPED,
      FilterDropdownValue.AMAZON_DEFAULT_FULFILLMENT_MAPPED,
    ],
  },
  {
    filterKey: Filters.CONDITION,
    filterLabel: 'Condition',
    filterValueType: FilterValueType.DROPDOWN,
    filterDropdownValue: [
      FilterDropdownValue.NEW_ITEM,
      FilterDropdownValue.REFURBISHED,
      FilterDropdownValue.USED_VERY_GOOD,
      FilterDropdownValue.USED_ACCEPTABLE,
      FilterDropdownValue.USED_LIKE_NEW,
      FilterDropdownValue.COLLECTIBLE_LIKE_NEW,
    ],
  },
  {
    filterKey: Filters.TOTAL_ON_HAND_QUANTITY,
    filterLabel: 'On Hand Quantity',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.TOTAL_IN_BOUND_QUANTITY,
    filterLabel: 'Total In Bound Quantity',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.TOTAL_RESERVED_QUANTITY,
    filterLabel: 'Total Reserved Quantity',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.TOTAL_RESEARCHING_QUANTITY,
    filterLabel: 'Total Researching Quantity',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.TOTAL_UNFULFILLABLE_QUANTITY,
    filterLabel: 'Total Unfulfillable Quantity',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.FUTURE_SUPPLY_BUYABLE_QUANTITY,
    filterLabel: 'Future Supply Buyable Quantity',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.LAST_UPDATED_TIME,
    filterLabel: 'Last Updated Time',
    filterValueType: FilterValueType.DATE,
  },
  {
    filterKey: Filters.TOTAL_QUANTITY,
    filterLabel: 'Total Quantity',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.STORES,
    filterLabel: 'Stores',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.PAYLOAD,
    filterLabel: 'Payload',
    filterValueType: FilterValueType.JSONB,
  },
  {
    filterKey: Filters.META_DATA,
    filterLabel: 'Meta Data',
    filterValueType: FilterValueType.JSONB,
  },
  {
    filterKey: Filters.PROFITABILITY_AD_SPEND,
    filterLabel: 'Ad Spend',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.ANALYSIS_PRODUCT_ID,
    filterLabel: 'Product Id',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.ANALYSIS_KEYWORD_NAME,
    filterLabel: 'Keyword',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.ORDER_COUNT,
    filterLabel: 'Orders',
    filterValueType: FilterValueType.NUMBER,
  },

  {
    filterKey: Filters.AMAZON_ORDER_ID,
    filterLabel: 'Purchase Order Id',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.PRODUCT_CHILD_PARENT_ASIN,
    filterLabel: 'Asin',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.PRODUCT_CHILD_PARENT_SKU,
    filterLabel: 'SKU',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.ORDER_CHILD_ASIN,
    filterLabel: 'Asin',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.ORDER_CHILD_SKU,
    filterLabel: 'SKU',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.RETRY_COUNT,
    filterLabel: 'Retry Count',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.ENTITY_ID,
    filterLabel: 'Entity Id',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.TOTAL_ORDER_UNITS,
    filterLabel: 'Total Order Units',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.TOTAL_PRINCIPAL_AMOUNT,
    filterLabel: 'Total Sales',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.TOTAL_RETURN_UNITS,
    filterLabel: 'Return Units',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.TOTAL_COGS,
    filterLabel: 'COGS',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.TOTAL_AMAZON_FEES,
    filterLabel: 'Amazon Fees',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.TOTAL_REFUND_FEES,
    filterLabel: 'Refund Fees',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.PROMOTION,
    filterLabel: 'Promotion',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.ESTIMATED_PAYOUT,
    filterLabel: 'Est. Payout',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.ROI,
    filterLabel: 'ROI',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.MARGIN,
    filterLabel: 'Margin',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.REFUND_PERCENTAGE,
    filterLabel: '% Returns',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.ORDER_STATUS,
    filterLabel: 'Order Status',
    filterValueType: FilterValueType.DROPDOWN,
    filterDropdownValue: [
      FilterDropdownValue.SHIPPED,
      FilterDropdownValue.ORDER_PENDING,
      FilterDropdownValue.ORDER_RETURNED,
    ],
  },
  {
    filterKey: Filters.RULE_ENTITY_LINK_STATUS,
    filterLabel: 'Automation Status',
    filterValueType: FilterValueType.DROPDOWN,
    filterDropdownValue: [
      FilterDropdownValue.ENABLED,
      FilterDropdownValue.PAUSED,
    ],
  },
  {
    filterKey: Filters.NEXT_EXECUTION_AT,
    filterLabel: 'Next Execution',
    filterValueType: FilterValueType.DATE,
  },
  {
    filterKey: Filters.RULE_ID,
    filterLabel: 'Rule ID',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.RULE_NAME,
    filterLabel: 'Rule Name',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.RULE_TYPE,
    filterLabel: 'Rule Type',
    filterValueType: FilterValueType.DROPDOWN,
    filterDropdownValue: [
      FilterDropdownValue.BIDDER_RULE,
      FilterDropdownValue.BIDDING_STRATEGY_RULE,
      FilterDropdownValue.BUDGET_RULE,
      FilterDropdownValue.DAYPARTING_RULE,
      FilterDropdownValue.INVENTORY_RULE,
      FilterDropdownValue.KEYWORD_HARVESTING_RULE,
      FilterDropdownValue.KEYWORD_RULE,
      FilterDropdownValue.PAGE_TYPE_RULE,
      FilterDropdownValue.PLACEMENT_RULE,
      FilterDropdownValue.PLATFORM_RULE,
      FilterDropdownValue.SOV_RULE,
      FilterDropdownValue.STATE_CHANGE_RULE,
      FilterDropdownValue.TARGET_RULE,
      FilterDropdownValue.UNKNOWN,
    ],
  },
  {
    filterKey: Filters.ELAPSED_TIME,
    filterLabel: 'Elapsed Time',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.MESSAGE_GROUP_ID,
    filterLabel: 'Message Group Id',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.DEDUPLICATION_ID,
    filterLabel: 'Deduplication Id',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.CRON_EXPRESSION,
    filterLabel: 'Cron Expression',
    filterValueType: FilterValueType.TEXT,
  },
  {
    filterKey: Filters.HANDLER,
    filterLabel: 'Handler',
    filterValueType: FilterValueType.DROPDOWN,
    filterDropdownValue: [
      CronHandlerEnum.NODE_CRON,
      CronHandlerEnum.SCHEDULE_RUNNER,
    ] as unknown as FilterDropdownValue[],
  },
  {
    filterKey: Filters.CREATED_AT,
    filterLabel: 'Created At',
    filterValueType: FilterValueType.DATE,
  },
  {
    filterKey: Filters.UPDATED_AT,
    filterLabel: 'Updated At',
    filterValueType: FilterValueType.DATE,
  },
  {
    filterKey: Filters.ENABLED,
    filterLabel: 'Status',
    filterValueType: FilterValueType.DROPDOWN,
    filterDropdownValue: [
      FilterDropdownValue.ACTIVE,
      FilterDropdownValue.INACTIVE,
    ],
  },
  {
    filterKey: Filters.IN_FLIGHT_MESSAGES,
    filterLabel: 'In Flight Messages',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.AVAILABLE_MESSAGES,
    filterLabel: 'Available Messages',
    filterValueType: FilterValueType.NUMBER,
  },
  {
    filterKey: Filters.DEDUPLICATED_MESSAGES,
    filterLabel: 'Deduplicated Messages',
    filterValueType: FilterValueType.NUMBER,
  },
];

export const FILTER_CONFIG_MAP: Record<Filters, IFilterSetting> =
  FILTER_CONFIG.reduce((acc, filterSetting) => {
    acc[filterSetting.filterKey] = filterSetting;
    return acc;
  }, {} as Record<Filters, IFilterSetting>);

export const performanceOptions = [
  Filters.AD_SALES,
  Filters.AD_SPEND,
  Filters.UNITS_SOLD,
  Filters.IMPRESSIONS,
  Filters.CLICKS,
  Filters.CTR,
  Filters.CPC,
  Filters.CVR,
  Filters.ROAS,
  Filters.ACOS,
  Filters.AD_ORDERS,
  Filters.CVR_UNITS,
  Filters.CVR_ORDERS,
  Filters.ADVERTISED_SALES,
  Filters.ADVERTISED_UNITS,
  Filters.OTHER_SALES,
  Filters.OTHER_UNITS,
  Filters.NTB_UNITS,
  Filters.NTB_ORDERS,
  Filters.NTB_SALES,
  Filters.PERCENT_NTB_UNITS,
  Filters.PERCENT_NTB_ORDERS,
  Filters.PERCENT_NTB_SALES,
  Filters.COMPLETE_VIEW_ORDERS,
  Filters.COMPLETE_VIEW_AD_UNITS,
  Filters.VIDEO_COMPLETE_VIEWS,
  Filters.VIDEO_FIRST_QUARTILE_VIEWS,
  Filters.VIDEO_IMPRESSIONS,
  Filters.VIDEO_MIDPOINT_VIEWS,
  Filters.VIDEO_THIRD_QUARTILE_VIEWS,
  Filters.VIDEO_UNMUTES,
  Filters.VIDEO_5_SEC_VIEWS,
  Filters.VIEWABLE_IMPRESSIONS,
  Filters.VIEW_THROUGH_AD_ORDERS,
  Filters.VIEW_THROUGH_AD_SALES,
  Filters.VIEW_THROUGH_AD_UNITS,
  Filters.COMPLETE_VIEW_AD_SALES,
  Filters.OTHER_COMPLETE_VIEW_AD_SALES,
  Filters.VTR,
  Filters.VCTR,
  Filters.VIDEO_5_SEC_VIEW_RATE,
  Filters.IN_STORE_ADVERTISED_SALES,
  Filters.IN_STORE_ATTRIBUTES_SALES,
  Filters.IN_STORE_ORDERS,
  Filters.IN_STORE_OTHER_SALES,
  Filters.IN_STORE_UNITS_SOLD,
  Filters.OMNI_CHANNEL_ROAS,
  Filters.OMNI_CHANNEL_SALES,
];

export const nonPerformanceMetricsOptions = FILTER_CONFIG.map(
  (filterSetting) => filterSetting.filterKey
).filter(
  (filterKey) => !performanceOptions.includes(filterKey as Filters)
) as Filters[];

export const FILTER_DISABLE_CONFIG: Record<string, Filters[]> = {
  keywordActionAddition: [Filters.MATCH_TYPE_ADD],
  keywordActionNegation: [Filters.MATCH_TYPE_ADD],
  productNegation: [Filters.MATCH_TYPE_ADD],
  LogsTable: [Filters.ACTION_TYPE],
};

export const CAMPAIGN_LEVEL = 'Campaign Level';
export const AD_GROUP_LEVEL = 'Ad Group Level';
export const TARGETING_LEVEL = 'Targeting Level';

export const getFilterConfig = (
  filterOptions: IBidderDashboardFilterOptions
): IFilterSetting[] => {
  return [
    {
      filterKey: Filters.ACCOUNT_ID,
      filterLabel: 'Account ID',
      filterValueType: FilterValueType.MULTI_SELECT_DROPDOWN,
      filterDropdownValue: filterOptions.accounts as FilterDropdownValue[],
    },
    {
      filterKey: Filters.BIDDER_MARKETPLACE,
      filterLabel: 'Marketplace',
      filterValueType: FilterValueType.MULTI_SELECT_DROPDOWN,
      filterDropdownValue: filterOptions.marketplaces as FilterDropdownValue[],
    },
    {
      filterKey: Filters.STATUS,
      filterLabel: 'Status',
      filterValueType: FilterValueType.MULTI_SELECT_DROPDOWN,
      filterDropdownValue: filterOptions.statuses as FilterDropdownValue[],
    },
    {
      filterKey: Filters.BRAND_NAME,
      filterLabel: 'Brand Name',
      filterValueType: FilterValueType.TEXT,
    },
    {
      filterKey: Filters.AD_TYPE,
      filterLabel: 'Ad Type',
      filterValueType: FilterValueType.MULTI_SELECT_DROPDOWN,
      filterDropdownValue: [
        FilterDropdownValue.SP,
        FilterDropdownValue.SB,
        FilterDropdownValue.SD,
        FilterDropdownValue.SV,
      ],
    },
  ];
};
