import { Frequency } from '@/enums/serp.enums';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { IBrandNameVariation } from 'src/interfaces/auth.interfaces';
import { IKeywordSOVFilter } from 'src/interfaces/keyword-sov.interface';
import { IProductSOVFilter } from 'src/interfaces/product-sov.interface';
import {
  IBrandLevelSovChartData,
  IDateRange,
  ISOV,
  ISovChartData,
  ISovFilter,
} from 'src/interfaces/serp.interface';
import { ISovFilterForm } from 'src/redux/slices/market-intelligence/sov-filter.slice';
import { formatNum, parseNum } from '.';
import { getCustomDateRange } from './datetime.utils';
interface ISOVChartData {
  [brand: string]: {
    total_sov: {
      [label: string]: number;
    };
    organic_sov: {
      [label: string]: number;
    };
    sponsored_sov: {
      [label: string]: number;
    };
  };
}
const serpUtils = {
  getSovChartData: (sovData: ISOV[], frequency: Frequency): ISovChartData => {
    const uniqueLabels = new Set<string>([]);
    const data: ISOVChartData = {};
    sovData.forEach((dataItem) => {
      const { brand, label, total_sov, organic_sov, sponsored_sov } = dataItem;
      uniqueLabels.add(label);
      if (!data[brand]) {
        data[brand] = { total_sov: {}, organic_sov: {}, sponsored_sov: {} };
      }
      data[brand]['total_sov'][label] = parseNum(total_sov);
      data[brand]['organic_sov'][label] = parseNum(organic_sov);
      data[brand]['sponsored_sov'][label] = parseNum(sponsored_sov);
    });

    const labels = Array.from(uniqueLabels);
    const sortedLabels = serpUtils.sortChartLabelsByFrequency(
      labels,
      frequency
    );
    const formattedChartData = Object.keys(data).map<IBrandLevelSovChartData>(
      (brand: string) => {
        const brandLevelSovData = data[brand];
        const labelWiseTotalSovData = sortedLabels.map(
          (label) =>
            Number(formatNum(brandLevelSovData['total_sov'][label], false)) || 0
        );
        const labelWiseOrganicSovData = sortedLabels.map(
          (label) =>
            Number(formatNum(brandLevelSovData['organic_sov'][label], false)) ||
            0
        );
        const labelWiseSponsoredSovData = sortedLabels.map(
          (label) =>
            Number(
              formatNum(brandLevelSovData['sponsored_sov'][label], false)
            ) || 0
        );
        return {
          brand: brand,
          labelWiseTotalSovData: labelWiseTotalSovData,
          labelWiseOrganicSovData: labelWiseOrganicSovData,
          labelWiseSponsoredSovData: labelWiseSponsoredSovData,
        };
      }
    );

    const chartData: ISovChartData = {
      labels: sortedLabels,
      brandDataByLabel: formattedChartData,
    };
    return chartData;
  },
  getTopBrands: (addSovData: ISOV[], numberOfBrands: number): string[] => {
    return addSovData.slice(0, numberOfBrands).map((item) => item.brand);
  },

  getFilters: (
    filterData: ISovFilterForm,
    setKeywordAsUndefined = false
  ): ISovFilter => {
    const filters: ISovFilter = {
      keyword: setKeywordAsUndefined ? undefined : filterData.keyword.value,
      frequency: filterData.frequency.value,
      position: filterData.position.value,
      range: getCustomDateRange(
        filterData.range.value,
        filterData.customDateRange,
        filterData.customDateRange
      ),
      dateRange: filterData.range.value,
      brandName: filterData.brandName.value,
    };
    return filters;
  },

  getKeywordSovFilters: (filterData: IKeywordSOVFilter): IKeywordSOVFilter => {
    const filters: IKeywordSOVFilter = {
      position: filterData.position,
      frequency: filterData.frequency,
      keywords: filterData.keywords as string[],
      range: getCustomDateRange(
        filterData.dateRange as string,
        filterData.range as IDateRange,
        filterData.range as IDateRange
      ),
      dateRange: filterData.dateRange,
      brandName: filterData.brandName,
    };
    return filters;
  },

  getProductSovFilters: (filterData: IProductSOVFilter): IProductSOVFilter => {
    const filters: IProductSOVFilter = {
      position: filterData.position,
      frequency: filterData.frequency,
      products: filterData.products as string[],
      range: getCustomDateRange(
        filterData.dateRange as string,
        filterData.range as IDateRange,
        filterData.range as IDateRange
      ),
      dateRange: filterData.dateRange,
      brandName: filterData.brandName,
      countryCode: filterData.countryCode,
    };
    return filters;
  },

  parseDateFromString: (dateStr: string) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  },
  sortedDateStrings: (dateStrings: string[]): string[] => {
    if (dateStrings.length) {
      return dateStrings.sort((a: string, b: string) => {
        const date1 = serpUtils.parseDateFromString(a);
        const date2 = serpUtils.parseDateFromString(b);
        return date1.getTime() - date2.getTime();
      });
    }
    return [];
  },
  sortChartLabelsByFrequency: (labels: string[], frequency: Frequency) => {
    if (frequency === Frequency.DAILY) {
      return serpUtils.sortedDateStrings(labels);
    } else if (frequency === Frequency.WEEKLY) {
      return labels.sort(function (a, b) {
        const weekA = a.split('-')[1];
        const weekB = b.split('-')[1];
        return parseNum(weekA) - parseNum(weekB);
      });
    }
    return labels.sort((a, b) => parseInt(a) - parseInt(b));
  },
  getFrequencyForTooltip: (freq: string) => {
    switch (freq.toLowerCase()) {
      case Frequency.HOURLY:
        return 'Hour-';
      case Frequency.WEEKLY:
        return 'Week-';
      default:
        return '';
    }
  },
  getBrandOptions: (brandNameVariations: IBrandNameVariation[]) => {
    return brandNameVariations.map<IDropdownItem<string>>((variation) => ({
      label: variation.brandName,
      value: variation.brandName.toLowerCase(),
    }));
  },
  getSelectedBrand: (
    brandNameVariations: IBrandNameVariation[],
    brandOptions: IDropdownItem<string>[]
  ): IDropdownItem<string> => {
    const primary = brandNameVariations.filter(
      (variation) => variation.isPrimary
    );

    const selectedBrand = primary.length
      ? brandOptions.filter(
          (item) => item.value === primary[0].brandName.toLowerCase()
        )[0]
      : brandOptions[0];
    return selectedBrand;
  },
};

export default serpUtils;
