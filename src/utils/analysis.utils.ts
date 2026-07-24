import {
  adGroupColumns,
  campaignColumns,
  keywordColumns,
  productsColumns,
  searchTermColumns,
} from '@/app/components/pages/advertising-page/analysis-page/analysis-page-columns';
import { PRODUCT_ADS_METRICS } from '@/constants/impact-analysis-filter.constants';
import { IMPACT_ANALYSIS_URL } from '@/constants/urls.constants';
import { ImpactAnalysisTableTitles } from '@/enums/impact-analysis.enums';
import { MarketplaceEnum, Range } from '@/enums/serp.enums';
import { IMultiSelectDropdownItem } from '@/interfaces/dropdown.interfaces';
import { IAnalysisFilterForm } from '@/redux/slices/impact-analysis/impact-analysis.slice';
import { ColumnDef, ColumnPinningState } from '@tanstack/react-table';
import moment from 'moment';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { DATE_FORMAT_3 } from 'src/constants/datetime.constants';
import {
  AmazonAdvertisingTableTypesEnum,
  AmazonSearchColumnsEnum,
  MetricsOptions,
  WalmartAdvertisingTableTypeEnum,
} from 'src/enums/advertising.enums';
import {
  IAnalysis,
  IAnalysisColData,
  IAnalysisFilter,
  IDateRange,
  IImpactAnalysisData,
  IImpactedAdGroupData,
  IImpactedCampaignData,
  IImpactedKeywordData,
  IImpactedProductData,
  IImpactedSearchTermData,
  IImpactGraphSortedResponse,
} from 'src/interfaces/analysis.interface';
import { formatDate, hexToRGBA, removeKeysFromArrayOfObjects } from '.';
import {
  convertToTitleCase,
  getAdTypePath,
  getMarketplacePath,
} from './advertising.utils';
import { isCustomDateRangeSet } from './datetime.utils';
export const getNameByTableType = (
  table: string,
  item: IImpactAnalysisData
) => {
  switch (table) {
    case AmazonAdvertisingTableTypesEnum.CAMPAIGN:
    case WalmartAdvertisingTableTypeEnum.CAMPAIGN:
      return item.campaignName;
    case AmazonAdvertisingTableTypesEnum.PRODUCT:
    case WalmartAdvertisingTableTypeEnum.AD_ITEM:
      return item.productName;
    case AmazonAdvertisingTableTypesEnum.KEYWORD:
    case WalmartAdvertisingTableTypeEnum.KEYWORD:
      return item.keywordName;
    case AmazonAdvertisingTableTypesEnum.AD_GROUP:
    case WalmartAdvertisingTableTypeEnum.AD_GROUP:
      return item.adGroupName;
    case AmazonAdvertisingTableTypesEnum.SEARCH_TERM:
    case WalmartAdvertisingTableTypeEnum.SEARCH_TERM:
      return item.searchTerm;
    default:
      return item.campaignName;
  }
};
export const getDataByMetricKey = (
  data: IImpactGraphSortedResponse,
  metric: string
) => {
  switch (metric) {
    case MetricsOptions.AD_SPEND:
      return data.adSpendImpact;
    case MetricsOptions.AD_SALES:
      return data.adSalesImpact;
    case MetricsOptions.AD_UNITS:
      return data.unitsSoldImpact;
    case MetricsOptions.ROAS:
      return data.roasImpact;
    case MetricsOptions.IMPRESSIONS:
      return data.impressionsImpact;
    case MetricsOptions.CLICKS:
      return data.clicksImpact;
    case MetricsOptions.CTR:
      return data.ctrImpact;
    case MetricsOptions.CPC:
      return data.cpcImpact;
    case MetricsOptions.CVR:
      return data.cvrImpact;
    case MetricsOptions.ACOS:
      return data.acosImpact;
    default:
      return data.adSalesImpact;
  }
};

export const getFieldByMetricKey = (metric: string) => {
  switch (metric) {
    case MetricsOptions.AD_SPEND:
      return 'adSpendImpact';
    case MetricsOptions.AD_SALES:
      return 'adSalesImpact';
    case MetricsOptions.AD_UNITS:
      return 'unitsSoldImpact';
    case MetricsOptions.ROAS:
      return 'roasImpact';
    case MetricsOptions.IMPRESSIONS:
      return 'impressionsImpact';
    case MetricsOptions.CLICKS:
      return 'clicksImpact';
    case MetricsOptions.CTR:
      return 'ctrImpact';
    case MetricsOptions.CPC:
      return 'cpcImpact';
    case MetricsOptions.CVR:
      return 'cvrImpact';
    case MetricsOptions.ACOS:
      return 'acosImpact';
    default:
      return 'adSpendImpact';
  }
};

export const getTooltipBodyData = (
  data: IImpactGraphSortedResponse,
  metric: string,
  table: string
): {
  name: string;
  value: {
    isNegative: boolean;
    percentage: number;
  };
}[] => {
  const topData = getDataByMetricKey(data, metric).topData.slice(0, 3);
  const bottomData = getDataByMetricKey(data, metric).bottomData.slice(0, 2);

  return [...topData, ...bottomData].map((item) => {
    return {
      name: getNameByTableType(table, item),
      value: getAnalysisPercentage(item),
    };
  });
};

export const getAnalysisPercentage = (item: IAnalysis) => {
  return {
    isNegative: item.isNegative,
    percentage: item.isNegative ? item.percentage * -1 : item.percentage,
  };
};

export const getTargetedMetric = (
  metric: string,
  options: IMultiSelectDropdownItem[]
) => {
  return options.map((option) => {
    return {
      ...option,
      selected: option.label === metric,
    };
  });
};

export const getSelectedMetricImpactData = (
  data: IAnalysisColData,
  metric: string
): IAnalysis => {
  switch (metric) {
    case MetricsOptions.AD_SPEND:
      return {
        isNegative: data.adSpend.impact.isNegative,
        percentage: data.adSpend.impact.isNegative
          ? data.adSpend.impact.percentage * -1
          : data.adSpend.impact.percentage,
      };
    case MetricsOptions.AD_SALES:
      return {
        isNegative: data.adSales.impact.isNegative,
        percentage: data.adSales.impact.isNegative
          ? data.adSales.impact.percentage * -1
          : data.adSales.impact.percentage,
      };
    case MetricsOptions.AD_UNITS:
      return {
        isNegative: data.unitsSold.impact.isNegative,
        percentage: data.unitsSold.impact.isNegative
          ? data.unitsSold.impact.percentage * -1
          : data.unitsSold.impact.percentage,
      };
    case MetricsOptions.ROAS:
      return {
        isNegative: data.roas.impact.isNegative,
        percentage: data.roas.impact.isNegative
          ? data.roas.impact.percentage * -1
          : data.roas.impact.percentage,
      };
    case MetricsOptions.IMPRESSIONS:
      return {
        isNegative: data.impressions.impact.isNegative,
        percentage: data.impressions.impact.isNegative
          ? data.impressions.impact.percentage * -1
          : data.impressions.impact.percentage,
      };
    case MetricsOptions.CLICKS:
      return {
        isNegative: data.clicks.impact.isNegative,
        percentage: data.clicks.impact.isNegative
          ? data.clicks.impact.percentage * -1
          : data.clicks.impact.percentage,
      };
    case MetricsOptions.CTR:
      return {
        isNegative: data.ctr.impact.isNegative,
        percentage: data.ctr.impact.isNegative
          ? data.ctr.impact.percentage * -1
          : data.ctr.impact.percentage,
      };
    case MetricsOptions.CPC:
      return {
        isNegative: data.cpc.impact.isNegative,
        percentage: data.cpc.impact.isNegative
          ? data.cpc.impact.percentage * -1
          : data.cpc.impact.percentage,
      };
    case MetricsOptions.CVR:
      return {
        isNegative: data.cvr.impact.isNegative,
        percentage: data.cvr.impact.isNegative
          ? data.cvr.impact.percentage * -1
          : data.cvr.impact.percentage,
      };
    case MetricsOptions.ACOS:
      return {
        isNegative: data.acos.impact.isNegative,
        percentage: data.acos.impact.isNegative
          ? data.acos.impact.percentage * -1
          : data.acos.impact.percentage,
      };
    case MetricsOptions.TOTAL_SALES:
      return {
        isNegative: data.totalSales.impact.isNegative,
        percentage: data.totalSales.impact.isNegative
          ? data.totalSales.impact.percentage * -1
          : data.totalSales.impact.percentage,
      };
    case MetricsOptions.TOTAL_UNITS:
      return {
        isNegative: data.totalUnits.impact.isNegative,
        percentage: data.totalUnits.impact.isNegative
          ? data.totalUnits.impact.percentage * -1
          : data.totalUnits.impact.percentage,
      };
    case MetricsOptions.INVENTORY_COUNT:
      return {
        isNegative: data.inventoryCount.impact.isNegative,
        percentage: data.inventoryCount.impact.isNegative
          ? data.inventoryCount.impact.percentage * -1
          : data.inventoryCount.impact.percentage,
      };
    default:
      return {
        isNegative: false,
        percentage: 0,
      };
  }
};

export const formatPercentageWidth = (width: number): number => {
  if (width > 100) {
    return 100;
  } else {
    return width;
  }
};

export const getImpactedDateRange = (
  range: string,
  targetDate: string
): IDateRange => {
  const impactedDate = moment(targetDate);
  let startDate, endDate;

  switch (range) {
    case Range.LAST_7_DAYS:
      endDate = impactedDate.format(DATE_FORMAT_3);
      startDate = impactedDate.subtract(7, 'days').format(DATE_FORMAT_3);
      break;
    case Range.LAST_30_DAYS:
      endDate = impactedDate.format(DATE_FORMAT_3);
      startDate = impactedDate.subtract(30, 'days').format(DATE_FORMAT_3);
      break;
    case Range.THIS_MONTH:
      startDate = moment().startOf('month').format(DATE_FORMAT_3);
      endDate = impactedDate.format(DATE_FORMAT_3);
      break;
    case Range.LAST_MONTH:
      startDate = moment()
        .subtract(1, 'month')
        .startOf('month')
        .format(DATE_FORMAT_3);
      endDate = moment()
        .subtract(1, 'month')
        .endOf('month')
        .format(DATE_FORMAT_3);
      break;
    case Range.LAST_3_MONTHS:
      startDate = moment()
        .subtract(2, 'months')
        .startOf('month')
        .format(DATE_FORMAT_3);
      endDate = impactedDate.format(DATE_FORMAT_3);
      break;
    case Range.THIS_YEAR:
      startDate = moment().startOf('year').format(DATE_FORMAT_3);
      endDate = impactedDate.format(DATE_FORMAT_3);
      break;
    case Range.LAST_YEAR:
      startDate = moment()
        .subtract(1, 'year')
        .startOf('year')
        .format(DATE_FORMAT_3);
      endDate = moment()
        .subtract(1, 'year')
        .endOf('year')
        .format(DATE_FORMAT_3);
      break;
    case Range.CUSTOM_RANGE:
      startDate = '';
      endDate = '';
      break;
    default:
      startDate = '';
      endDate = '';
      break;
  }

  return { startDate, endDate };
};

export const getCampaignExportData = (data: IImpactedCampaignData[]) => {
  const _data = data.map((item) => {
    return {
      campaignId: item.campaignId,
      campaignName: item.campaignName,
      ROAS_Average: item.roas.average,
      ROAS_Impact: item.roas.actual,
      ROAS_Impact_Percentage: item.roas.impact.isNegative
        ? item.roas.impact.percentage * -1
        : item.roas.impact.percentage,
      AdSpend_Average: item.adSpend.average,
      AdSpend_Impact: item.adSpend.actual,
      AdSpend_Impact_Percentage: item.adSpend.impact.isNegative
        ? item.adSpend.impact.percentage * -1
        : item.adSpend.impact.percentage,
      Clicks_Average: item.clicks.average,
      Clicks_Impact: item.clicks.actual,
      Clicks_Impact_Percentage: item.clicks.impact.isNegative
        ? item.clicks.impact.percentage * -1
        : item.clicks.impact.percentage,
      Impressions_Average: item.impressions.average,
      Impressions_Impact: item.impressions.actual,
      Impressions_Impact_Percentage: item.impressions.impact.isNegative
        ? item.impressions.impact.percentage * -1
        : item.impressions.impact.percentage,
      CTR_Average: item.ctr.average,
      CTR_Impact: item.ctr.actual,
      CTR_Impact_Percentage: item.ctr.impact.isNegative
        ? item.ctr.impact.percentage * -1
        : item.ctr.impact.percentage,
      CPC_Average: item.cpc.average,
      CPC_Impact: item.cpc.actual,
      CPC_Impact_Percentage: item.cpc.impact.isNegative
        ? item.cpc.impact.percentage * -1
        : item.cpc.impact.percentage,
      CVR_Average: item.cvr.average,
      CVR_Impact: item.cvr.actual,
      CVR_Impact_Percentage: item.cvr.impact.isNegative
        ? item.cvr.impact.percentage * -1
        : item.cvr.impact.percentage,
      AdUnits_Average: item.unitsSold.average,
      AdUnits_Impact: item.unitsSold.actual,
      AdUnits_Impact_Percentage: item.unitsSold.impact.isNegative
        ? item.unitsSold.impact.percentage * -1
        : item.unitsSold.impact.percentage,
      ACOS_Average: item.acos.average,
      ACOS_Impact: item.acos.actual,
      ACOS_Impact_Percentage: item.acos.impact.isNegative
        ? item.acos.impact.percentage * -1
        : item.acos.impact.percentage,
      AdSales_Average: item.adSales.average,
      AdSales_Impact: item.adSales.actual,
      AdSales_Impact_Percentage: item.adSales.impact.isNegative
        ? item.adSales.impact.percentage * -1
        : item.adSales.impact.percentage,
    };
  });

  return _data;
};

export const getAdGroupExportData = (data: IImpactedAdGroupData[]) => {
  const _data = data.map((item) => {
    return {
      adgroupId: item.adgroupId,
      campaignName: item.campaignName,
      adGroupName: item.adGroupName,
      ROAS_Average: item.roas.average,
      ROAS_Impact: item.roas.actual,
      ROAS_Impact_Percentage: item.roas.impact.isNegative
        ? item.roas.impact.percentage * -1
        : item.roas.impact.percentage,
      AdSpend_Average: item.adSpend.average,
      AdSpend_Impact: item.adSpend.actual,
      AdSpend_Impact_Percentage: item.adSpend.impact.isNegative
        ? item.adSpend.impact.percentage * -1
        : item.adSpend.impact.percentage,
      Clicks_Average: item.clicks.average,
      Clicks_Impact: item.clicks.actual,
      Clicks_Impact_Percentage: item.clicks.impact.isNegative
        ? item.clicks.impact.percentage * -1
        : item.clicks.impact.percentage,
      Impressions_Average: item.impressions.average,
      Impressions_Impact: item.impressions.actual,
      Impressions_Impact_Percentage: item.impressions.impact.isNegative
        ? item.impressions.impact.percentage * -1
        : item.impressions.impact.percentage,
      CTR_Average: item.ctr.average,
      CTR_Impact: item.ctr.actual,
      CTR_Impact_Percentage: item.ctr.impact.isNegative
        ? item.ctr.impact.percentage * -1
        : item.ctr.impact.percentage,
      CPC_Average: item.cpc.average,
      CPC_Impact: item.cpc.actual,
      CPC_Impact_Percentage: item.cpc.impact.isNegative
        ? item.cpc.impact.percentage * -1
        : item.cpc.impact.percentage,
      CVR_Average: item.cvr.average,
      CVR_Impact: item.cvr.actual,
      CVR_Impact_Percentage: item.cvr.impact.isNegative
        ? item.cvr.impact.percentage * -1
        : item.cvr.impact.percentage,
      AdUnits_Average: item.unitsSold.average,
      AdUnits_Impact: item.unitsSold.actual,
      AdUnits_Impact_Percentage: item.unitsSold.impact.isNegative
        ? item.unitsSold.impact.percentage * -1
        : item.unitsSold.impact.percentage,
      ACOS_Average: item.acos.average,
      ACOS_Impact: item.acos.actual,
      ACOS_Impact_Percentage: item.acos.impact.isNegative
        ? item.acos.impact.percentage * -1
        : item.acos.impact.percentage,
      AdSales_Average: item.adSales.average,
      AdSales_Impact: item.adSales.actual,
      AdSales_Impact_Percentage: item.adSales.impact.isNegative
        ? item.adSales.impact.percentage * -1
        : item.adSales.impact.percentage,
    };
  });

  return _data;
};

export const getProductExportData = (data: IImpactedProductData[]) => {
  const _data = data.map((item) => {
    return {
      productId: item.productId,
      productName: item.productName,
      campaignName: item.campaignName,
      adGroupName: item.adGroupName,
      ROAS_Average: item.roas.average,
      ROAS_Impact: item.roas.actual,
      ROAS_Impact_Percentage: item.roas.impact.isNegative
        ? item.roas.impact.percentage * -1
        : item.roas.impact.percentage,
      AdSpend_Average: item.adSpend.average,
      AdSpend_Impact: item.adSpend.actual,
      AdSpend_Impact_Percentage: item.adSpend.impact.isNegative
        ? item.adSpend.impact.percentage * -1
        : item.adSpend.impact.percentage,
      Clicks_Average: item.clicks.average,
      Clicks_Impact: item.clicks.actual,
      Clicks_Impact_Percentage: item.clicks.impact.isNegative
        ? item.clicks.impact.percentage * -1
        : item.clicks.impact.percentage,
      Impressions_Average: item.impressions.average,
      Impressions_Impact: item.impressions.actual,
      Impressions_Impact_Percentage: item.impressions.impact.isNegative
        ? item.impressions.impact.percentage * -1
        : item.impressions.impact.percentage,
      CTR_Average: item.ctr.average,
      CTR_Impact: item.ctr.actual,
      CTR_Impact_Percentage: item.ctr.impact.isNegative
        ? item.ctr.impact.percentage * -1
        : item.ctr.impact.percentage,
      CPC_Average: item.cpc.average,
      CPC_Impact: item.cpc.actual,
      CPC_Impact_Percentage: item.cpc.impact.isNegative
        ? item.cpc.impact.percentage * -1
        : item.cpc.impact.percentage,
      CVR_Average: item.cvr.average,
      CVR_Impact: item.cvr.actual,
      CVR_Impact_Percentage: item.cvr.impact.isNegative
        ? item.cvr.impact.percentage * -1
        : item.cvr.impact.percentage,
      AdUnits_Average: item.unitsSold.average,
      AdUnits_Impact: item.unitsSold.actual,
      AdUnits_Impact_Percentage: item.unitsSold.impact.isNegative
        ? item.unitsSold.impact.percentage * -1
        : item.unitsSold.impact.percentage,
      ACOS_Average: item.acos.average,
      ACOS_Impact: item.acos.actual,
      ACOS_Impact_Percentage: item.acos.impact.isNegative
        ? item.acos.impact.percentage * -1
        : item.acos.impact.percentage,
      AdSales_Average: item.adSales.average,
      AdSales_Impact: item.adSales.actual,
      AdSales_Impact_Percentage: item.adSales.impact.isNegative
        ? item.adSales.impact.percentage * -1
        : item.adSales.impact.percentage,
    };
  });

  return _data;
};

export const getKeywordExportData = (data: IImpactedKeywordData[]) => {
  const _data = data.map((item) => {
    return {
      keywordId: item.keywordId,
      keywordName: item.keywordName,
      campaignName: item.campaignName,
      adGroupName: item.adGroupName,
      ROAS_Average: item.roas.average,
      ROAS_Impact: item.roas.actual,
      ROAS_Impact_Percentage: item.roas.impact.isNegative
        ? item.roas.impact.percentage * -1
        : item.roas.impact.percentage,
      AdSpend_Average: item.adSpend.average,
      AdSpend_Impact: item.adSpend.actual,
      AdSpend_Impact_Percentage: item.adSpend.impact.isNegative
        ? item.adSpend.impact.percentage * -1
        : item.adSpend.impact.percentage,
      Clicks_Average: item.clicks.average,
      Clicks_Impact: item.clicks.actual,
      Clicks_Impact_Percentage: item.clicks.impact.isNegative
        ? item.clicks.impact.percentage * -1
        : item.clicks.impact.percentage,
      Impressions_Average: item.impressions.average,
      Impressions_Impact: item.impressions.actual,
      Impressions_Impact_Percentage: item.impressions.impact.isNegative
        ? item.impressions.impact.percentage * -1
        : item.impressions.impact.percentage,
      CTR_Average: item.ctr.average,
      CTR_Impact: item.ctr.actual,
      CTR_Impact_Percentage: item.ctr.impact.isNegative
        ? item.ctr.impact.percentage * -1
        : item.ctr.impact.percentage,
      CPC_Average: item.cpc.average,
      CPC_Impact: item.cpc.actual,
      CPC_Impact_Percentage: item.cpc.impact.isNegative
        ? item.cpc.impact.percentage * -1
        : item.cpc.impact.percentage,
      CVR_Average: item.cvr.average,
      CVR_Impact: item.cvr.actual,
      CVR_Impact_Percentage: item.cvr.impact.isNegative
        ? item.cvr.impact.percentage * -1
        : item.cvr.impact.percentage,
      AdUnits_Average: item.unitsSold.average,
      AdUnits_Impact: item.unitsSold.actual,
      AdUnits_Impact_Percentage: item.unitsSold.impact.isNegative
        ? item.unitsSold.impact.percentage * -1
        : item.unitsSold.impact.percentage,
      ACOS_Average: item.acos.average,
      ACOS_Impact: item.acos.actual,
      ACOS_Impact_Percentage: item.acos.impact.isNegative
        ? item.acos.impact.percentage * -1
        : item.acos.impact.percentage,
      AdSales_Average: item.adSales.average,
      AdSales_Impact: item.adSales.actual,
      AdSales_Impact_Percentage: item.adSales.impact.isNegative
        ? item.adSales.impact.percentage * -1
        : item.adSales.impact.percentage,
    };
  });

  return _data;
};

export const getSTRExportData = (data: IImpactedSearchTermData[]) => {
  const _data = data.map((item) => {
    return {
      searchTerm: item.searchTerm,
      keywordId: item.keywordId,
      keywordName: item.keywordName,
      campaignName: item.campaignName,
      adGroupName: item.adGroupName,
      ROAS_Average: item.roas.average,
      ROAS_Impact: item.roas.actual,
      ROAS_Impact_Percentage: item.roas.impact.isNegative
        ? item.roas.impact.percentage * -1
        : item.roas.impact.percentage,
      AdSpend_Average: item.adSpend.average,
      AdSpend_Impact: item.adSpend.actual,
      AdSpend_Impact_Percentage: item.adSpend.impact.isNegative
        ? item.adSpend.impact.percentage * -1
        : item.adSpend.impact.percentage,
      Clicks_Average: item.clicks.average,
      Clicks_Impact: item.clicks.actual,
      Clicks_Impact_Percentage: item.clicks.impact.isNegative
        ? item.clicks.impact.percentage * -1
        : item.clicks.impact.percentage,
      Impressions_Average: item.impressions.average,
      Impressions_Impact: item.impressions.actual,
      Impressions_Impact_Percentage: item.impressions.impact.isNegative
        ? item.impressions.impact.percentage * -1
        : item.impressions.impact.percentage,
      CTR_Average: item.ctr.average,
      CTR_Impact: item.ctr.actual,
      CTR_Impact_Percentage: item.ctr.impact.isNegative
        ? item.ctr.impact.percentage * -1
        : item.ctr.impact.percentage,
      CPC_Average: item.cpc.average,
      CPC_Impact: item.cpc.actual,
      CPC_Impact_Percentage: item.cpc.impact.isNegative
        ? item.cpc.impact.percentage * -1
        : item.cpc.impact.percentage,
      CVR_Average: item.cvr.average,
      CVR_Impact: item.cvr.actual,
      CVR_Impact_Percentage: item.cvr.impact.isNegative
        ? item.cvr.impact.percentage * -1
        : item.cvr.impact.percentage,
      AdUnits_Average: item.unitsSold.average,
      AdUnits_Impact: item.unitsSold.actual,
      AdUnits_Impact_Percentage: item.unitsSold.impact.isNegative
        ? item.unitsSold.impact.percentage * -1
        : item.unitsSold.impact.percentage,
      ACOS_Average: item.acos.average,
      ACOS_Impact: item.acos.actual,
      ACOS_Impact_Percentage: item.acos.impact.isNegative
        ? item.acos.impact.percentage * -1
        : item.acos.impact.percentage,
      AdSales_Average: item.adSales.average,
      AdSales_Impact: item.adSales.actual,
      AdSales_Impact_Percentage: item.adSales.impact.isNegative
        ? item.adSales.impact.percentage * -1
        : item.adSales.impact.percentage,
    };
  });

  return _data;
};

export const getTargetedColumnIndex = (
  metric: IDropdownItem<string>,
  columns: Array<ColumnDef<IAnalysisColData>>
) => {
  const idx = columns.findIndex((column) => column.id === metric.value);

  return idx;
};

export const getMetricAvgActualData = (
  row1: IAnalysisColData,
  row2: IAnalysisColData,
  metric: string,
  type: string
) => {
  switch (metric) {
    case MetricsOptions.AD_SPEND: {
      if (type === 'average') {
        return row1.adSpend.average - row2.adSpend.average;
      }
      if (type === 'actual') {
        return row1.adSpend.actual - row2.adSpend.actual;
      }
      return 0;
    }
    case MetricsOptions.AD_SALES: {
      if (type === 'average') {
        return row1.adSales.average - row2.adSales.average;
      }
      if (type === 'actual') {
        return row1.adSales.actual - row2.adSales.actual;
      }
      return 0;
    }

    case MetricsOptions.AD_UNITS: {
      if (type === 'average') {
        return row1.unitsSold.average - row2.unitsSold.average;
      }
      if (type === 'actual') {
        return row1.unitsSold.actual - row2.unitsSold.actual;
      }
      return 0;
    }
    case MetricsOptions.ROAS: {
      if (type === 'average') {
        return row1.roas.average - row2.roas.average;
      }
      if (type === 'actual') {
        return row1.roas.actual - row2.roas.actual;
      }
      return 0;
    }
    case MetricsOptions.IMPRESSIONS: {
      if (type === 'average') {
        return row1.impressions.average - row2.impressions.average;
      }
      if (type === 'actual') {
        return row1.impressions.actual - row2.impressions.actual;
      }
      return 0;
    }
    case MetricsOptions.CLICKS: {
      if (type === 'average') {
        return row1.clicks.average - row2.clicks.average;
      }
      if (type === 'actual') {
        return row1.clicks.actual - row2.clicks.actual;
      }
      return 0;
    }
    case MetricsOptions.CTR: {
      if (type === 'average') {
        return row1.ctr.average - row2.ctr.average;
      }
      if (type === 'actual') {
        return row1.ctr.actual - row2.ctr.actual;
      }
      return 0;
    }
    case MetricsOptions.CPC: {
      if (type === 'average') {
        return row1.cpc.average - row2.cpc.average;
      }
      if (type === 'actual') {
        return row1.cpc.actual - row2.cpc.actual;
      }
      return 0;
    }
    case MetricsOptions.CVR: {
      if (type === 'average') {
        return row1.cvr.average - row2.cvr.average;
      }
      if (type === 'actual') {
        return row1.cvr.actual - row2.cvr.actual;
      }
      return 0;
    }
    case MetricsOptions.ACOS: {
      if (type === 'average') {
        return row1.acos.average - row2.acos.average;
      }
      if (type === 'actual') {
        return row1.acos.actual - row2.acos.actual;
      }
      return 0;
    }
    case MetricsOptions.TOTAL_SALES: {
      if (type === 'average') {
        return row1.totalSales.average - row2.totalSales.average;
      }
      if (type === 'actual') {
        return row1.totalSales.actual - row2.totalSales.actual;
      }
      return 0;
    }
    case MetricsOptions.TOTAL_UNITS: {
      if (type === 'average') {
        return row1.totalUnits.average - row2.totalUnits.average;
      }
      if (type === 'actual') {
        return row1.totalUnits.actual - row2.totalUnits.actual;
      }
      return 0;
    }
    case 'inventoryCount': {
      if (type === 'average') {
        return row1.inventoryCount.average - row2.inventoryCount.average;
      }
      if (type === 'actual') {
        return row1.inventoryCount.actual - row2.inventoryCount.actual;
      }
      return 0;
    }
    default:
      return 0;
  }
};
export const getAdvTableFromAnalysisTableType = (
  tab?: string
): AmazonAdvertisingTableTypesEnum => {
  switch (tab) {
    case ImpactAnalysisTableTitles.AD_GROUP:
      return AmazonAdvertisingTableTypesEnum.AD_GROUP;
    case ImpactAnalysisTableTitles.CAMPAIGN:
      return AmazonAdvertisingTableTypesEnum.CAMPAIGN;
    case ImpactAnalysisTableTitles.KEYWORDS:
      return AmazonAdvertisingTableTypesEnum.KEYWORD;
    case ImpactAnalysisTableTitles.PRODUCT_ADS:
      return AmazonAdvertisingTableTypesEnum.PRODUCT;
    case ImpactAnalysisTableTitles.SEARCH_TERM:
      return AmazonAdvertisingTableTypesEnum.SEARCH_TERM;
    default:
      return AmazonAdvertisingTableTypesEnum.AD_GROUP;
  }
};
export const getWalmartAdvTableFromAnalysisTableType = (
  tab?: string
): WalmartAdvertisingTableTypeEnum => {
  switch (tab) {
    case ImpactAnalysisTableTitles.AD_GROUP:
      return WalmartAdvertisingTableTypeEnum.AD_GROUP;
    case ImpactAnalysisTableTitles.CAMPAIGN:
      return WalmartAdvertisingTableTypeEnum.CAMPAIGN;
    case ImpactAnalysisTableTitles.KEYWORDS:
      return WalmartAdvertisingTableTypeEnum.KEYWORD;
    case ImpactAnalysisTableTitles.PRODUCT_ADS:
      return WalmartAdvertisingTableTypeEnum.AD_ITEM;
    case ImpactAnalysisTableTitles.SEARCH_TERM:
      return WalmartAdvertisingTableTypeEnum.SEARCH_TERM;
    default:
      return WalmartAdvertisingTableTypeEnum.AD_GROUP;
  }
};

export const getAnalysisColumnsByTab = (
  tab: string,
  startDate: string,
  endDate: string,
  impactStartDate: string,
  impactEndDate: string,
  selectedMetric: IDropdownItem<string>,
  selectedMarketplace: MarketplaceEnum | string | undefined
) => {
  switch (tab) {
    case ImpactAnalysisTableTitles.CAMPAIGN:
      return campaignColumns(
        startDate,
        endDate,
        impactStartDate,
        impactEndDate,
        selectedMetric
      );
    case ImpactAnalysisTableTitles.AD_GROUP:
      return adGroupColumns(
        startDate,
        endDate,
        impactStartDate,
        impactEndDate,
        selectedMetric
      );
    case ImpactAnalysisTableTitles.KEYWORDS:
      return keywordColumns(
        startDate,
        endDate,
        impactStartDate,
        impactEndDate,
        selectedMetric
      );
    case ImpactAnalysisTableTitles.SEARCH_TERM:
      return searchTermColumns(
        startDate,
        endDate,
        impactStartDate,
        impactEndDate,
        selectedMetric
      );
    case ImpactAnalysisTableTitles.PRODUCT_ADS:
      return productsColumns(
        startDate,
        endDate,
        impactStartDate,
        impactEndDate,
        selectedMetric,
        selectedMarketplace
      );
    default:
      return campaignColumns(
        startDate,
        endDate,
        impactStartDate,
        impactEndDate,
        selectedMetric
      );
  }
};

export const getInitialSortingByTitle = (title: string) => {
  switch (title) {
    case ImpactAnalysisTableTitles.KEYWORDS:
      return [{ id: 'keywordName', desc: true }];
    case ImpactAnalysisTableTitles.PRODUCT_ADS:
      return [{ id: 'productName', desc: true }];
    case ImpactAnalysisTableTitles.AD_GROUP:
      return [{ id: 'adGroupName', desc: true }];
    case ImpactAnalysisTableTitles.SEARCH_TERM:
      return [{ id: 'searchTerm', desc: true }];
    default:
      return [{ id: 'campaignName', desc: true }];
  }
};

export const getInitialPinnedColByTitle = (
  title: string
): ColumnPinningState => {
  switch (title) {
    case ImpactAnalysisTableTitles.KEYWORDS:
      return {
        left: ['keywordName'],
        right: [],
      };
    case ImpactAnalysisTableTitles.SEARCH_TERM:
      return {
        left: ['searchTerm'],
        right: [],
      };
    case ImpactAnalysisTableTitles.PRODUCT_ADS:
      return {
        left: ['productName'],
        right: [],
      };
    case ImpactAnalysisTableTitles.AD_GROUP:
      return {
        left: ['adGroupName'],
        right: [],
      };
    default:
      return {
        left: ['campaignName'],
        right: [],
      };
  }
};

export const removeSelectedMetrics = (
  filters: IAnalysisFilterForm,
  omitMetric = false
) => {
  if (omitMetric) {
    return removeKeysFromArrayOfObjects(
      [filters],
      ['selectedAnalysisMetrics', 'selectedMetric']
    );
  }
  return removeKeysFromArrayOfObjects([filters], ['selectedAnalysisMetrics']);
};

export const getImpactAnalysisUrl = (
  title: string,
  marketplace: string,
  adType: string
) => {
  return `${IMPACT_ANALYSIS_URL}/${marketplace}/${adType}/${title}`;
};

export const getAnalysisTableFilters = (
  _filterData: IAnalysisFilterForm,
  marketPlace: MarketplaceEnum
): IAnalysisFilter => {
  const _filters: IAnalysisFilter = {
    impactRangeType: _filterData.impactRange.value,
    impactRange: isCustomDateRangeSet(_filterData.impactCustomDateRange)
      ? _filterData.impactCustomDateRange
      : formatDate(_filterData.impactRange.value, marketPlace),
    frequency: _filterData.frequency.value,
    range: isCustomDateRangeSet(_filterData.customDateRange)
      ? _filterData.customDateRange
      : formatDate(_filterData.range.value, marketPlace),
    rangeType: _filterData.range.value,
    campaignId: '',
    adGroupId: '',
  };

  return _filters;
};

export const getFormattedMetricsOptionsForProductAds = (
  options: IMultiSelectDropdownItem[]
): IMultiSelectDropdownItem[] => {
  return options.map((option) => {
    return {
      ...option,
      isDisabled: !PRODUCT_ADS_METRICS.includes(option.value as MetricsOptions)
        ? option.isDisabled
        : false,
    };
  });
};
export const getNewImpactAnalysisUrl = (
  marketplace: string,
  adType: string
) => {
  const marketplacePath = getMarketplacePath(marketplace);
  const adTypePath = getAdTypePath(adType);

  const url = `${IMPACT_ANALYSIS_URL}${marketplacePath}${adTypePath}/`;
  return url;
};

export const getColumnNameById = (id: string) => {
  switch (id) {
    case AmazonSearchColumnsEnum.CAMPAIGN_NAME:
      return 'Campaign';
    case AmazonSearchColumnsEnum.ADGROUP_NAME:
      return 'Ad Group';
    case AmazonSearchColumnsEnum.ANALYSIS_KEYWORD_NAME:
      return 'Keyword';
    default:
      return convertToTitleCase(id);
  }
};

export const getInitialImpactTableColumns = (
  selectedAnalysisNavTitle: string,
  selectedMetric: IDropdownItem<string>,
  marketplace?: string
) =>
  getAnalysisColumnsByTab(
    selectedAnalysisNavTitle,
    '',
    '',
    '',
    '',
    selectedMetric,
    marketplace
  ) as Array<ColumnDef<IAnalysisColData>>;

export const getImpactBGColor = (isNegative: boolean, isRGBA = true) => {
  if (isRGBA)
    return isNegative ? hexToRGBA('#ff0000', 0.2) : hexToRGBA('#13C9C8', 0.3);
  return isNegative ? '#ff0000' : '#13C9C8';
};
