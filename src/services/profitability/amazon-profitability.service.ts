import { AMZ_PROFITABILITY_BASE_URL } from '@/constants';
import { IPaginatedResponse } from '@/interfaces/advertising/advertising.interface';
import {
  IAmazonPerformanceMetrics,
  IAmazonPnLProducts,
  IAmazonProfitabilityAggregatedData,
  IAmazonProfitabilityGraphResponse,
  IAmazonProfitabilityOrder,
  IAmazonProfitabilityProductData,
} from '@/interfaces/profitability/amazon-profitability.interface';
import { IProfitabilityGraphPayload } from '@/interfaces/profitability/profitability.interface';
import { IAPIResponse } from '@/interfaces/service.interface';
import { axiosInstance } from '@/redux/store';

export const amazonProfitabilityService = {
  getOrdersTableData: (
    payload: IProfitabilityGraphPayload,
    signal?: AbortSignal
  ) => {
    const { page = 1, pageSize = 10 } = payload;

    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IAmazonProfitabilityOrder[]>>
    >(
      `${AMZ_PROFITABILITY_BASE_URL}/orders?page=${page}&pageSize=${pageSize}`,
      payload,
      {
        signal,
      }
    );
  },
  getOrdersAggregatedData: (
    payload: IProfitabilityGraphPayload,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<any>>(
      `${AMZ_PROFITABILITY_BASE_URL}/orders/aggregated`,
      payload,
      {
        signal,
      }
    );
  },
  getProductsTableData: (
    payload: IProfitabilityGraphPayload,
    signal?: AbortSignal
  ) => {
    const { page = 1, pageSize = 10 } = payload;

    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IAmazonProfitabilityProductData[]>>
    >(
      `${AMZ_PROFITABILITY_BASE_URL}/products?page=${page}&pageSize=${pageSize}`,
      payload,
      {
        signal,
      }
    );
  },
  getProductsAggregatedTableData: (
    payload: IProfitabilityGraphPayload,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<
      IAPIResponse<IAmazonProfitabilityAggregatedData[]>
    >(`${AMZ_PROFITABILITY_BASE_URL}/products/aggregated`, payload, {
      signal,
    });
  },
  getPerformanceData: (
    payload: IProfitabilityGraphPayload,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<IAmazonPerformanceMetrics[]>>(
      `${AMZ_PROFITABILITY_BASE_URL}/performance`,
      payload,
      {
        signal,
      }
    );
  },
  getGraphData: (payload: IProfitabilityGraphPayload, signal?: AbortSignal) => {
    return axiosInstance.post<
      IAPIResponse<IAmazonProfitabilityGraphResponse[]>
    >(`${AMZ_PROFITABILITY_BASE_URL}/graph`, payload, {
      signal,
    });
  },
  getPnlProductData: (signal?: AbortSignal) => {
    return axiosInstance.post<IAPIResponse<IAmazonPnLProducts[]>>(
      `${AMZ_PROFITABILITY_BASE_URL}/pnl/products`,
      {},
      { signal }
    );
  },
};
