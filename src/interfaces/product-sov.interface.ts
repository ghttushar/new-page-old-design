import { Range } from '@/enums/serp.enums';
import { ISovFilter, ISOVMinMaxDateRange } from './serp.interface';

export interface IProducts {
  productId: string;
  title: string;
}

export interface IProductSOVTableData {
  label: string;
  asin: string;
  keyword: string;
  avgrank: number;
  avgorganicrank: number;
  avgsponsoredrank: number;
  appearance: number;
}

export interface IProductSOVGraphData {
  asin: string;
  appearance: number;
}

export interface IProductSOVData {
  tableData: IProductSOVTableData[];
  chartData: IProductSOVGraphData[];
  minMaxDate: ISOVMinMaxDateRange;
}

export interface IProductSOVFilterBody {
  startDate: string;
  endDate: string;
  frequency: string;
  marketplace: string;
  asins: string[];
  brandName: string;
  range: Range;
  countryCode?: string;
}

export interface IProductSOVFilter extends ISovFilter {
  products: string[];
}
