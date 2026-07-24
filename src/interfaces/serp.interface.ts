import { CountryCodeEnum } from '@/enums/advertising.enums';
import { MarketplaceEnum, Range } from '../enums/serp.enums';

export interface IChannel {
  channel: MarketplaceEnum;
  isActive: boolean;
  isArchived: boolean;
  countryCodes: CountryCodeEnum[];
}

export interface IExportKeyword {
  channel: MarketplaceEnum;
  isActive: boolean;
  isArchived?: boolean;
  keyword: string;
  createdAt?: Date;
  updatedAt?: Date;
  countryCode?: string;
}
export interface ISerpKeyword {
  _id?: string;
  accountId?: string | number;
  createdAt?: Date;
  updatedAt?: Date;
  keyword: string;
  channels: IChannel[];
}

export interface IKeywordBody {
  keywords: ISerpKeyword[];
}

export interface ISOV {
  id?: number;
  brand: string;
  organic_sov: number | string;
  sponsored_sov: number | string;
  total_sov: number | string;
  appearance: number | string;
  product_count: number | string;
  label: string;
}

export interface IDateRange {
  startDate: string;
  endDate?: string;
}
export interface IDateRangeFilter {
  label: string;
  startDate: string | null;
  endDate: string | null;
}

export interface ISovFilter {
  range?: IDateRange;
  position?: string;
  frequency?: string;
  keyword?: string;
  dateRange?: Range;
  brandName: string;
  countryCode?: string;
}

export interface IBrandAnalyticsFilter extends ISovFilter {
  brandName: string;
}

export interface ISerpProductData {
  title: string;
  asin: string;
  avg_price: number;
  avg_rank: number;
  avg_organic_rank: number;
  avg_sponsored_rank: number;
  label: string;
  appearance: number;
}
export type IBrandAnalyticsData = ISerpProductData[];

export interface ISOVChartDataItem {
  brand: string;
  data: Record<string, number>;
}

export interface ISovChartData {
  labels: string[];
  brandDataByLabel: IBrandLevelSovChartData[];
}
export interface ISOVWithRank extends ISOV {
  rank: number;
}
export interface ISOVMinMaxDateRange {
  maxDate: string;
  minDate: string;
}

export interface IGetSOV {
  chartData: ISOV[];
  aggData: ISOVWithRank[];
  minMaxDate: ISOVMinMaxDateRange;
}

export interface IBrandMetricsItem {
  current: number;
  previous: number;
  changePercentage: number;
  previousDateRangeText: string;
}
export interface IBrandMetrics {
  brand: string;
  organicSov: IBrandMetricsItem;
  sponsoredSov: IBrandMetricsItem;
  totalSov: IBrandMetricsItem;
  uniqueProductCount: IBrandMetricsItem;
}

export interface IBrandLevelSovChartData {
  brand: string;
  labelWiseTotalSovData: number[];
  labelWiseOrganicSovData: number[];
  labelWiseSponsoredSovData: number[];
}

export interface IBrandLevelSovChecks {
  total_sov: boolean;
  organic_sov: boolean;
  sponsored_sov: boolean;
}

export type ISovChartDataMapping = Record<string, Record<string, ISOV>>;
