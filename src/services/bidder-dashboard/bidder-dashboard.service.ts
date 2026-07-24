import { BIDDER_DASHBOARD_API_BASE_URL } from '@/constants';
import { IPaginatedResponse } from '@/interfaces/advertising/advertising.interface';
import {
  IBidderDashboardDataPayload,
  IBidderDashboardFilterOptions,
  IBidderDashboardResponse,
} from '@/interfaces/bidder-dashboard.interface';
import { IAPIResponse } from '@/interfaces/service.interface';
import { axiosInstance } from '@/redux/store';

export const bidderDashboardService = {
  getBidderHistory: (body: IBidderDashboardDataPayload) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IBidderDashboardResponse>>
    >(
      `${BIDDER_DASHBOARD_API_BASE_URL}/history?page=${body.page}&pageSize=${body.pageSize}`,
      body
    );
  },

  getAllAccounts: () => {
    return axiosInstance.get<IAPIResponse<string[]>>(
      `${BIDDER_DASHBOARD_API_BASE_URL}/accounts`
    );
  },

  getAllMarketplaces: () => {
    return axiosInstance.get<IAPIResponse<string[]>>(
      `${BIDDER_DASHBOARD_API_BASE_URL}/marketplaces`
    );
  },

  getAllStatuses: () => {
    return axiosInstance.get<IAPIResponse<string[]>>(
      `${BIDDER_DASHBOARD_API_BASE_URL}/statuses`
    );
  },

  getAllBrandNames: () => {
    return axiosInstance.get<IAPIResponse<string[]>>(
      `${BIDDER_DASHBOARD_API_BASE_URL}/brand-names`
    );
  },

  getFilterOptions: (): Promise<IBidderDashboardFilterOptions> => {
    return Promise.all([
      bidderDashboardService.getAllAccounts(),
      bidderDashboardService.getAllMarketplaces(),
      bidderDashboardService.getAllStatuses(),
      bidderDashboardService.getAllBrandNames(),
    ]).then(([accounts, marketplaces, statuses, brandNames]) => ({
      accounts: accounts.data.data,
      marketplaces: marketplaces.data.data,
      statuses: statuses.data.data,
      brandNames: brandNames.data.data,
    }));
  },
};
