import { AMAZON_CATALOG_BASE_URL } from '@/constants';
import {
  IPaginatedResponse,
  IUploadCogsResult,
} from '@/interfaces/advertising/advertising.interface';
import {
  IAmazonCatalogBody,
  IAmazonCatalogItem,
  IAmazonCOGSUploadBody,
  IDownloadCOGSData,
} from '@/interfaces/catalog/amazon/amazon-catalog.interface';

import { IAPIResponse } from '@/interfaces/service.interface';
import { axiosInstance } from '@/redux/store';

export const amazonCatalogService = {
  getCatalogItems: (
    body: IAmazonCatalogBody,
    page: number,
    pageSize: number,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IAmazonCatalogItem[]>>
    >(`${AMAZON_CATALOG_BASE_URL}?page=${page}&pageSize=${pageSize}`, body, {
      signal,
    });
  },
  getAggregatedData: (body: IAmazonCatalogBody, signal?: AbortSignal) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IAmazonCatalogItem[]>>
    >(`${AMAZON_CATALOG_BASE_URL}/aggregated`, body, { signal });
  },
  updateCOGSByAsinSku: (payload: IAmazonCOGSUploadBody) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IAmazonCatalogItem[]>>
    >(`${AMAZON_CATALOG_BASE_URL}/cogs/update`, payload);
  },
  bulkUploadCOGS: (file: File) => {
    const data = new FormData();
    data.append('file', file);
    return axiosInstance.post<IAPIResponse<IUploadCogsResult>>(
      `${AMAZON_CATALOG_BASE_URL}/cogs/upload`,
      data
    );
  },
  downloadCOGSFile: () => {
    return axiosInstance.get<IAPIResponse<IDownloadCOGSData[]>>(
      `${AMAZON_CATALOG_BASE_URL}/cogs/download`
    );
  },
};
