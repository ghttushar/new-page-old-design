import { BidderDashboardStatusEnum } from '@/enums/bidder-dashboard.enum';
import { Range } from '@/enums/serp.enums';
import { ISortCriteria } from '@/interfaces/advertising/advertising.interface';
import { IBidderDashboardDataPayload } from '@/interfaces/bidder-dashboard.interface';
import { IFinalFilters } from '@/redux/slices/filters/filter.slice';

export const bidderDashboardUtils = {
  getBidderDashboardPayload: (
    appliedFilters: IFinalFilters[],
    sortCriteria: ISortCriteria[],
    pageSize: number,
    page: number,
    searchText: string,
    headerFilters: any,
    searchColumns: string[]
  ): IBidderDashboardDataPayload => {
    const {
      range,
      customDateRange,
      accountId,
      marketplace,
      status,
      brandName,
    } = headerFilters || {};

    return {
      range: (range?.value || range || Range.LAST_7_DAYS) as Range,
      startDate: customDateRange?.startDate,
      endDate: customDateRange?.endDate,
      accountId,
      marketplace: marketplace,
      status,
      brandName,
      pageSize,
      page,
      filters: appliedFilters,
      sortCriteria,
      searchText,
      searchColumns,
    };
  },

  getStatusColor: (status: string) => {
    switch (status.toUpperCase()) {
      case BidderDashboardStatusEnum.ACTIVE:
        return '#28a745';
      case BidderDashboardStatusEnum.INACTIVE:
        return '#6c757d';
      case BidderDashboardStatusEnum.SCHEDULED:
        return '#007bff';
      case BidderDashboardStatusEnum.FAILED:
        return '#dc3545';
      case BidderDashboardStatusEnum.COMPLETED:
        return '#28a745';
      default:
        return '#6c757d';
    }
  },
};
