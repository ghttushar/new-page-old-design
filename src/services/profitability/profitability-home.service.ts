import { WMT_PROFITABILITY_BASE_URL } from '@/constants';
import { IPaginatedResponse } from '@/interfaces/advertising/advertising.interface';
import {
  IProductDetails,
  IProfitabilityGraphPayload,
  IProfitabilityGraphResponse,
  IProfitabilityOrdersData,
  IProfitabilityPerformanceMetrics,
  IProfitabilityProductsData,
  IProfitabilityTotalResponse,
  ITotalProductData,
  ITrendsTotal,
} from '@/interfaces/profitability/profitability.interface';
import { IAPIResponse } from '@/interfaces/service.interface';
import { axiosInstance } from '@/redux/store';

export const profitabilityHomeService = {
  getGraphData: (payload: IProfitabilityGraphPayload, signal?: AbortSignal) => {
    return axiosInstance.post<IAPIResponse<Array<IProfitabilityGraphResponse>>>(
      `${WMT_PROFITABILITY_BASE_URL}/get-graph-data`,
      payload,
      {
        signal,
      }
    );
  },
  getPerformanceData: (
    payload: IProfitabilityGraphPayload,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<
      IAPIResponse<Array<IProfitabilityPerformanceMetrics>>
    >(`${WMT_PROFITABILITY_BASE_URL}/get-performance-data`, payload, {
      signal,
    });
  },
  getOrdersTableData: (
    payload: IProfitabilityGraphPayload,
    isDownload?: boolean,
    isAllDownload?: boolean,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<Array<IProfitabilityOrdersData>>>
    >(
      `${WMT_PROFITABILITY_BASE_URL}/get-orders-table-data?page=${payload.page}&pageSize=${payload.pageSize}`,
      {
        ...payload,
        downloadWithFilter: isAllDownload,
        isDownload,
      },
      {
        signal,
      }
    );
  },

  getTotalOrderData: (
    payload: IProfitabilityGraphPayload,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IProfitabilityTotalResponse>>
    >(`${WMT_PROFITABILITY_BASE_URL}/get-total-orders-data`, payload, {
      signal,
    });
  },

  getProductsData: (
    payload: IProfitabilityGraphPayload,
    isDownload?: boolean,
    isAllDownload?: boolean,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<Array<IProfitabilityProductsData>>>
    >(
      `${WMT_PROFITABILITY_BASE_URL}/get-products-table-data?page=${payload.page}&pageSize=${payload.pageSize}`,
      {
        ...payload,
        downloadWithFilter: isAllDownload,
        isDownload,
      },
      {
        signal,
      }
    );
  },

  getTotalProductData: (
    payload: IProfitabilityGraphPayload,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<ITotalProductData>>
    >(`${WMT_PROFITABILITY_BASE_URL}/get-total-products-data`, payload, {
      signal,
    });
  },
  getPnLSummaryData: (
    payload: IProfitabilityGraphPayload,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<Array<IProfitabilityOrdersData>>>(
      `${WMT_PROFITABILITY_BASE_URL}/get-pnl-data`,
      payload,
      {
        signal,
      }
    );
  },

  getAllSearchedProductPnLData: (
    payload: IProfitabilityGraphPayload,
    signal?: AbortSignal,
    selectedProducts?: string[]
  ) => {
    return axiosInstance.post<IAPIResponse<Array<IProfitabilityOrdersData>>>(
      `${WMT_PROFITABILITY_BASE_URL}/get-all-searched-product-pnl-data`,
      {
        ...payload,
        searchString: selectedProducts,
      },
      {
        signal,
      }
    );
  },

  getProductSearchPnLData: (
    payload: IProfitabilityGraphPayload,
    selectedProducts: string[] | null,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<Array<IProfitabilityOrdersData>>>(
      `${WMT_PROFITABILITY_BASE_URL}/get-product-search-pnl-data`,
      {
        ...payload,
        searchString: selectedProducts,
      },
      {
        signal,
      }
    );
  },
  getProductTrendsTotalData: (
    payload: IProfitabilityGraphPayload,
    selectedProducts: string[] | null,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<Array<ITrendsTotal>>>(
      `${WMT_PROFITABILITY_BASE_URL}/get-total-trends-data`,
      {
        ...payload,
        searchString: selectedProducts,
      },
      {
        signal,
      }
    );
  },
  getAllProductData: (signal?: AbortSignal) => {
    return axiosInstance.get<IAPIResponse<Array<IProductDetails>>>(
      `${WMT_PROFITABILITY_BASE_URL}/get-all-product-info`,

      {
        signal,
      }
    );
  },
};
