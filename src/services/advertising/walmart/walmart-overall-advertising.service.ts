import { MarketplaceEnum } from '@/enums/serp.enums';
import { WalmartSearchColumnsEnum } from '@/enums/walmart.enums';
import {
  IAdvertisingFilter,
  IPerformanceGraph,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { WALMART_OVERALL_ADVERTISING_BASE_URL } from 'src/constants';
import {
  AdTypeShort,
  PerformanceTypeEnum,
  SortOrderEnum,
  WalmartAdvertisingTableTypeEnum,
} from 'src/enums/advertising.enums';
import {
  IPaginatedResponse,
  ISortCriteria,
} from 'src/interfaces/advertising/advertising.interface';
import {
  IWalmartOverallAdGroup,
  IWalmartOverallCampaign,
  IWalmartOverallKeywords,
} from 'src/interfaces/advertising/walmart/walmart-overall-advertising.interface';
import {
  IWalmartAdItem,
  IWalmartPageType,
  IWalmartPlatform,
  IWalmartSearchTerms,
} from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { IFinalFilters } from 'src/redux/slices/filters/filter.slice';
import { axiosInstance } from 'src/redux/store';
import {
  getAdvertisingPayload,
  getAdvertisingPerformancePayload,
  getMappedPageTypeSearchText,
  getWalmartSearchColumnsByTableType,
} from 'src/utils/advertising.utils';

export const walmartOverallAdvertisingServices = {
  getOverallCampaigns: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = '',
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IWalmartOverallCampaign[]>>
    >(
      `${WALMART_OVERALL_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.CAMPAIGN}`,
      getAdvertisingPayload(
        filters,
        payload,
        [
          ...sortCriteria,
          {
            columnName: WalmartSearchColumnsEnum.CAMPAIGN_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        getWalmartSearchColumnsByTableType(
          AdTypeShort.All,
          WalmartAdvertisingTableTypeEnum.CAMPAIGN
        )
      ),
      {
        signal,
      }
    );
  },
  getOverallAdGroups: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IWalmartOverallAdGroup[]>>
    >(
      `${WALMART_OVERALL_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.AD_GROUP}`,
      getAdvertisingPayload(
        filters,
        payload,
        [
          ...sortCriteria,
          {
            columnName: WalmartSearchColumnsEnum.ADGROUP_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        getWalmartSearchColumnsByTableType(
          AdTypeShort.All,
          WalmartAdvertisingTableTypeEnum.AD_GROUP
        )
      )
    );
  },
  getOverallAdItems: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IWalmartAdItem[]>>
    >(
      `${WALMART_OVERALL_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.AD_ITEM}`,
      getAdvertisingPayload(
        filters,
        payload,
        [
          ...sortCriteria,
          {
            columnName: WalmartSearchColumnsEnum.ITEM_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        getWalmartSearchColumnsByTableType(
          AdTypeShort.All,
          WalmartAdvertisingTableTypeEnum.AD_ITEM
        )
      )
    );
  },
  getOverallKeywords: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IWalmartOverallKeywords[]>>
    >(
      `${WALMART_OVERALL_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.KEYWORD}`,
      getAdvertisingPayload(
        filters,
        payload,
        [
          ...sortCriteria,
          {
            columnName: WalmartSearchColumnsEnum.KT_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        getWalmartSearchColumnsByTableType(
          AdTypeShort.All,
          WalmartAdvertisingTableTypeEnum.KEYWORD
        )
      )
    );
  },
  getOverallSearchTerms: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IWalmartSearchTerms[]>>
    >(
      `${WALMART_OVERALL_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.SEARCH_TERM}`,
      getAdvertisingPayload(
        filters,
        payload,
        [
          ...sortCriteria,
          {
            columnName: WalmartSearchColumnsEnum.SEARCH_TERM,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        getWalmartSearchColumnsByTableType(
          AdTypeShort.All,
          WalmartAdvertisingTableTypeEnum.SEARCH_TERM
        )
      )
    );
  },
  getOverallPageType: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IWalmartPageType[]>>
    >(
      `${WALMART_OVERALL_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.PAGE_TYPE}`,
      getAdvertisingPayload(
        filters,
        payload,
        [
          ...sortCriteria,
          {
            columnName: WalmartSearchColumnsEnum.PAGE_TYPE,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        getMappedPageTypeSearchText(searchText),
        getWalmartSearchColumnsByTableType(
          AdTypeShort.All,
          WalmartAdvertisingTableTypeEnum.PAGE_TYPE
        )
      )
    );
  },
  getOverallPlatform: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IWalmartPlatform[]>>
    >(
      `${WALMART_OVERALL_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.PLATFORM}`,
      getAdvertisingPayload(
        filters,
        payload,
        [
          ...sortCriteria,
          {
            columnName: WalmartSearchColumnsEnum.PLATFORM,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        getWalmartSearchColumnsByTableType(
          AdTypeShort.All,
          WalmartAdvertisingTableTypeEnum.PLATFORM
        )
      )
    );
  },

  getOverallPerformanceMetrics: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    searchText = '',
    tab: WalmartAdvertisingTableTypeEnum,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<IPerformanceMetrics>>(
      `${WALMART_OVERALL_ADVERTISING_BASE_URL}/performance?entityType=${tab}`,
      getAdvertisingPerformancePayload(
        filters,
        payload,
        searchText,
        tab,
        PerformanceTypeEnum.METRICS,
        MarketplaceEnum.WALMART,
        AdTypeShort.All
      ),
      {
        signal,
      }
    );
  },

  getOverallPerformanceGraph: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    searchText = '',
    tab: WalmartAdvertisingTableTypeEnum,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<IPerformanceGraph>>(
      `${WALMART_OVERALL_ADVERTISING_BASE_URL}/graph?entityType=${tab}`,
      getAdvertisingPerformancePayload(
        filters,
        payload,
        searchText,
        tab,
        PerformanceTypeEnum.GRAPH,
        MarketplaceEnum.WALMART,
        AdTypeShort.All
      ),
      {
        signal,
      }
    );
  },
};
