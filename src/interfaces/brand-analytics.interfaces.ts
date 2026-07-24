import { Frequency, Positions } from '@/enums/serp.enums';
import { ISOVMinMaxDateRange } from './serp.interface';

export interface IDateRange {
  startDate: string;
  endDate?: string;
}

export interface ISovFilter {
  range?: IDateRange;
  position?: Positions;
  frequency?: Frequency;
  keyword?: string;
}

export interface IBrandAnalyticsFilter extends ISovFilter {
  brand?: string;
}

export interface IBrandAnalyticsProductData {
  id: number | string;
  title: string;
  product_id: string;
  latest_sale_price: number;
  avg_rank: number;
  avg_organic_rank: number;
  avg_sponsored_rank: number;
  label: string;
  appearance: number;
  latest_stars: number;
  latest_rating_count: number;
}

export interface IBrandAnalyticsData {
  minMaxDate: ISOVMinMaxDateRange;
  response: IBrandAnalyticsProductData[];
}
