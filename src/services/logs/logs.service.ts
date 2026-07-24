import { LOGS_AMAZON_BASE_URL, LOGS_WALMART_BASE_URL } from '@/constants';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { ILogsData } from '@/interfaces/logs/logs.interface';
import { IAPIResponse } from '@/interfaces/service.interface';
import { IFinalFilters } from '@/redux/slices/filters/filter.slice';
import { ILogHeaderFilterForm } from '@/redux/slices/logs/logs.slice';
import { axiosInstance } from '@/redux/store';

const LogsService = {
  getEditLogs: (
    filters: IFinalFilters[],
    marketplace: MarketplaceEnum,
    dateRange: ILogHeaderFilterForm
  ) => {
    const BASE_URL =
      marketplace === MarketplaceEnum.AMAZON
        ? LOGS_AMAZON_BASE_URL
        : LOGS_WALMART_BASE_URL;
    return axiosInstance.post<IAPIResponse<ILogsData[]>>(`${BASE_URL}/get`, {
      filters,
      startDate: dateRange.customDateRange.startDate,
      endDate: dateRange.customDateRange.endDate,
      range: dateRange.range.value,
    });
  },
};

export default LogsService;
