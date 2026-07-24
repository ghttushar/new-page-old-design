import { Range } from '@/enums/serp.enums';
import { ISovFilter } from './serp.interface';

export interface IKeywordSOVGraph {
  id?: number;
  keyword: string;
  organicSov: number;
  sponsoredSov: number;
  totalSov: number;
  appearance: number;
}

export interface IKeywordSOVTable {
  id?: number;
  totalSov: number;
  organicSov: number;
  sponsoredSov: number;
  keyword: string;
  label: string;
  productCount: string | number;
  appearance: number;
}

export interface IKeywordSOVFilter extends ISovFilter {
  keywords?: string[];
}

export interface IKeywordSOVFilterBody {
  startDate?: string;
  endDate?: string;
  position?: string;
  frequency?: string;
  marketplace?: string;
  keywords?: string[];
  brandName: string;
  range?: Range;
  countryCode?: string;
}

export interface IKeywordSOVData {
  tableData: IKeywordSOVTable[];
  chartData: IKeywordSOVGraph[];
}
