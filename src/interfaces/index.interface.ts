import { IDateRange } from './serp.interface';

export interface IGetFileNameDateTime {
  range?: IDateRange;
  frequency?: string;
  rangeType?: string;
}

export interface IPagination {
  page: number;
  pageSize: number;
  totalItems: number | string;
}

export interface IDataGridPaginationModel {
  page: number;
  pageSize: number;
}
export interface IFilterRange {
  from: number | string;
  to: number | string;
}

export type Nullable<T> = T | null;
