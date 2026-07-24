import { IAdvertisingFilter } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  ICatalogData,
  IUpdateCOGSPayload,
} from '@/interfaces/catalog/walmart/walmart-catalog.interface';
import { WALMART_CATALOG_BASE_URL } from 'src/constants';
import { CatalogSearchColumnsEnum } from 'src/enums/catalog.enums';
import {
  IPaginatedResponse,
  ISortCriteria,
  ITableFooterData,
  IUploadCogsResult,
} from 'src/interfaces/advertising/advertising.interface';

import { IAPIResponse } from 'src/interfaces/service.interface';
import { IFinalFilters } from 'src/redux/slices/filters/filter.slice';
import { axiosInstance } from 'src/redux/store';

export const walmartCatalogService = {
  getWalmartCatalogData: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = '',
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<IPaginatedResponse<ICatalogData[]>>>(
      `${WALMART_CATALOG_BASE_URL}?page=${page}&pageSize=${pageSize}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          isDownload: payload.isDownload,
          downloadWithFilter: payload.downloadWithFilter,
        },
        sortCriteria,
        searchText,
        searchColumns: [
          CatalogSearchColumnsEnum.PRODUCT_NAME,
          CatalogSearchColumnsEnum.SKU,
          CatalogSearchColumnsEnum.ITEM_ID,
        ],
      },
      {
        signal,
      }
    );
  },

  getWalmartCatalogTotalData: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    searchText = '',
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<ITableFooterData>>(
      `${WALMART_CATALOG_BASE_URL}/total`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
        },
        searchText,
        searchColumns: [
          CatalogSearchColumnsEnum.PRODUCT_NAME,
          CatalogSearchColumnsEnum.SKU,
          CatalogSearchColumnsEnum.ITEM_ID,
        ],
      },
      {
        signal,
      }
    );
  },

  uploadBulkCogsData: (file: File) => {
    const data = new FormData();
    data.append('file', file);
    return axiosInstance.post<IAPIResponse<IUploadCogsResult>>(
      `${WALMART_CATALOG_BASE_URL}/bulk-upload-cogs`,
      data
    );
  },
  updateCogsDataByItemId: (body: IUpdateCOGSPayload) => {
    return axiosInstance.post<IAPIResponse<null>>(
      `${WALMART_CATALOG_BASE_URL}/update-cogs`,
      body
    );
  },
};
