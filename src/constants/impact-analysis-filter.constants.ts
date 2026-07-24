import { Range } from '@/enums/serp.enums';
import { IAdvertisingNavigationBarOption } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IMultiSelectDropdownItem } from '@/interfaces/dropdown.interfaces';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { MetricsOptions } from 'src/enums/advertising.enums';
import { ImpactAnalysisTableTitles } from 'src/enums/impact-analysis.enums';

export const analysisMetricsOptions: IMultiSelectDropdownItem[] = [
  {
    label: 'Impressions',
    value: MetricsOptions.IMPRESSIONS,
    isDisabled: false,
    selected: true,
  },
  {
    label: 'Clicks',
    value: MetricsOptions.CLICKS,
    isDisabled: false,
    selected: true,
  },
  {
    label: 'CTR',
    value: MetricsOptions.CTR,
    isDisabled: false,
    selected: true,
  },
  {
    label: 'CPC',
    value: MetricsOptions.CPC,
    isDisabled: false,
    selected: true,
  },
  {
    label: 'Ad Spend',
    value: MetricsOptions.AD_SPEND,
    isDisabled: false,
    selected: false,
  },
  {
    label: 'Ad Sales',
    value: MetricsOptions.AD_SALES,
    isDisabled: false,
    selected: false,
  },
  {
    label: 'Orders',
    value: MetricsOptions.ORDERS,
    isDisabled: true,
    selected: false,
  },
  {
    label: 'Ad Units',
    value: MetricsOptions.AD_UNITS,
    isDisabled: false,
    selected: false,
  },
  {
    label: 'CVR',
    value: MetricsOptions.CVR,
    isDisabled: false,
    selected: false,
  },
  {
    label: 'ROAS',
    value: MetricsOptions.ROAS,
    isDisabled: false,
    selected: false,
  },
  {
    label: 'ACOS',
    value: MetricsOptions.ACOS,
    isDisabled: false,
    selected: false,
  },
  {
    label: 'Total Units',
    value: MetricsOptions.TOTAL_UNITS,
    isDisabled: true,
    selected: false,
  },
  {
    label: 'Inventory Count',
    value: MetricsOptions.INVENTORY_COUNT,
    isDisabled: true,
    selected: false,
  },
  {
    label: 'Total Sales',
    value: MetricsOptions.TOTAL_SALES,
    isDisabled: true,
    selected: false,
  },
  {
    label: 'TACOS',
    value: MetricsOptions.TACOS,
    isDisabled: true,
    selected: false,
  },
  {
    label: '% of orders NTB',
    value: MetricsOptions.PERCENTAGE_ORDERS_NTB,
    isDisabled: true,
    selected: false,
  },
  {
    label: '% of sales NTB',
    value: MetricsOptions.PERCENTAGE_SALES_NTB,
    isDisabled: true,
    selected: false,
  },
  {
    label: 'VCPM',
    value: MetricsOptions.VCPM,
    isDisabled: true,
    selected: false,
  },
  {
    label: 'NTB orders',
    value: MetricsOptions.NTB_ORDERS,
    isDisabled: true,
    selected: false,
  },
  {
    label: 'NTB sales',
    value: MetricsOptions.NTB_SALES,
    isDisabled: true,
    selected: false,
  },
  {
    label: 'Viewable impressions',
    value: MetricsOptions.VIEWABLE_IMPRESSIONS,
    isDisabled: true,
    selected: false,
  },
];

export const range: IDropdownItem<string>[] = [
  {
    value: Range.LAST_7_DAYS,
    label: 'Last 7 days',
  },
  {
    value: Range.LAST_14_DAYS,
    label: 'Last 14 days',
  },
  {
    value: Range.LAST_30_DAYS,
    label: 'Last 30 days',
  },
  {
    value: Range.THIS_MONTH,
    label: 'This month',
  },
  {
    value: Range.LAST_3_MONTHS,
    label: 'Last 3 months',
  },
  {
    value: Range.THIS_YEAR,
    label: 'This year',
  },
];

export const analysisPerformanceOptions: IAdvertisingNavigationBarOption[] = [
  {
    value: ImpactAnalysisTableTitles.CAMPAIGN,
    label: 'Campaigns',
    options: [],
    isDisabled: false,
  },
  {
    value: ImpactAnalysisTableTitles.AD_GROUP,
    label: 'Ad Groups',
    options: [],
    isDisabled: false,
  },
  {
    value: ImpactAnalysisTableTitles.PRODUCT_ADS,
    label: 'Products',
    options: [],
    isDisabled: false,
  },
  {
    value: ImpactAnalysisTableTitles.KEYWORDS,
    label: 'Keywords',
    options: [],
    isDisabled: false,
  },
  {
    value: ImpactAnalysisTableTitles.SEARCH_TERM,
    label: 'Search Term',
    options: [],
    isDisabled: false,
  },
];

export const analysisAmzSPPerformanceOptions: IAdvertisingNavigationBarOption[] =
  [
    {
      value: ImpactAnalysisTableTitles.CAMPAIGN,
      label: 'Campaigns',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.AD_GROUP,
      label: 'Ad Groups',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.PRODUCT_ADS,
      label: 'Products',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.KEYWORDS,
      label: 'Keywords',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.SEARCH_TERM,
      label: 'Search Term',
      options: [],
      isDisabled: false,
    },
  ];
export const analysisAmzSBPerformanceOptions: IAdvertisingNavigationBarOption[] =
  [
    {
      value: ImpactAnalysisTableTitles.CAMPAIGN,
      label: 'Campaigns',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.AD_GROUP,
      label: 'Ad Groups',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.PRODUCT_ADS,
      label: 'Products',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.KEYWORDS,
      label: 'Keywords',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.SEARCH_TERM,
      label: 'Search Term',
      options: [],
      isDisabled: false,
    },
  ];
export const analysisAmzSDPerformanceOptions: IAdvertisingNavigationBarOption[] =
  [
    {
      value: ImpactAnalysisTableTitles.CAMPAIGN,
      label: 'Campaigns',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.AD_GROUP,
      label: 'Ad Groups',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.PRODUCT_ADS,
      label: 'Products',
      options: [],
      isDisabled: false,
    },
  ];
export const analysisAmzOverallPerformanceOptions: IAdvertisingNavigationBarOption[] =
  [
    {
      value: ImpactAnalysisTableTitles.CAMPAIGN,
      label: 'Campaigns',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.AD_GROUP,
      label: 'Ad Groups',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.PRODUCT_ADS,
      label: 'Products',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.KEYWORDS,
      label: 'Keywords',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.SEARCH_TERM,
      label: 'Search Term',
      options: [],
      isDisabled: false,
    },
  ];

export const analysisWmtSBPerformanceOptions: IAdvertisingNavigationBarOption[] =
  [
    {
      value: ImpactAnalysisTableTitles.CAMPAIGN,
      label: 'Campaigns',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.AD_GROUP,
      label: 'Ad Groups',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.PRODUCT_ADS,
      label: 'Products',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.KEYWORDS,
      label: 'Keywords',
      options: [],
      isDisabled: false,
    },
  ];
export const analysisWmtSVPerformanceOptions: IAdvertisingNavigationBarOption[] =
  [
    {
      value: ImpactAnalysisTableTitles.CAMPAIGN,
      label: 'Campaigns',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.AD_GROUP,
      label: 'Ad Groups',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.PRODUCT_ADS,
      label: 'Products',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.KEYWORDS,
      label: 'Keywords',
      options: [],
      isDisabled: false,
    },
  ];
export const analysisWmtOverallPerformanceOptions: IAdvertisingNavigationBarOption[] =
  [
    {
      value: ImpactAnalysisTableTitles.CAMPAIGN,
      label: 'Campaigns',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.AD_GROUP,
      label: 'Ad Groups',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.PRODUCT_ADS,
      label: 'Products',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.KEYWORDS,
      label: 'Keywords',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.SEARCH_TERM,
      label: 'Search Term',
      options: [],
      isDisabled: false,
    },
  ];
export const analysisWmtSPPerformanceOptions: IAdvertisingNavigationBarOption[] =
  [
    {
      value: ImpactAnalysisTableTitles.CAMPAIGN,
      label: 'Campaigns',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.AD_GROUP,
      label: 'Ad Groups',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.PRODUCT_ADS,
      label: 'Products',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.KEYWORDS,
      label: 'Keywords',
      options: [],
      isDisabled: false,
    },
    {
      value: ImpactAnalysisTableTitles.SEARCH_TERM,
      label: 'Search Term',
      options: [],
      isDisabled: false,
    },
  ];
export const PRODUCT_ADS_METRICS = [
  MetricsOptions.TOTAL_SALES,
  MetricsOptions.TOTAL_UNITS,
  MetricsOptions.INVENTORY_COUNT,
];
