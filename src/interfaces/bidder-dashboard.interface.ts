import { Range } from '@/enums/serp.enums';
import { IFinalFilters } from '@/redux/slices/filters/filter.slice';
import { IconProps } from '@phosphor-icons/react';
import { ISortCriteria } from './advertising/advertising.interface';

export interface IBidderDashboard {
  id: string;
  accountId: string;
  marketplace: string;
  jobId: string;
  lastTriggerDate: string;
  nextTriggerDate: string;
  reportDate: string;
  brandName: string;
  uniqueId: string;
  status: string;
  adType: string;
}

export interface IBidderDashboardDataPayload {
  range: Range;
  startDate?: string;
  endDate?: string;
  accountId?: string;
  marketplace?: string;
  status?: string;
  brandName?: string;
  pageSize: number;
  page: number;
  filters?: IFinalFilters[];
  sortCriteria?: ISortCriteria[];
  searchText?: string;
  searchColumns?: string[];
}

export interface IBidderDashboardStats {
  totalRecords: number;
  activeJobs: number;
  inactiveJobs: number;
  scheduledJobs: number;
  amazonJobs: number;
  walmartJobs: number;
}

export interface IBidderDashboardFilterOptions {
  accounts: string[];
  marketplaces: string[];
  statuses: string[];
  brandNames: string[];
}

export interface IBidderDashboardResponse {
  data: IBidderDashboard[];
  stats: IBidderDashboardStats;
}

export interface IStatCardMeta {
  title: string;
  getValue: (stats: IBidderDashboardStats) => number;
  Icon: React.ComponentType<IconProps>;
  color: string;
  bgColor: string;
  subtitle?: string;
  trend?: string;
}
