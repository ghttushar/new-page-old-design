import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  IOverallAdGroup,
  IOverallCampaign,
  IOverallKeywordTargeting,
  IOverallProductAds,
  IOverallProductTargeting,
} from '@/interfaces/advertising/amazon/overall-advertising.interface';
import {
  IAdvertisingFilter,
  IPerformanceGraph,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { AMAZON_OVERALL_BASE_URL } from 'src/constants';
import {
  AdTypeShort,
  AmazonAdvertisingTableTypesEnum,
  AmazonSearchColumnsEnum,
  PerformanceTypeEnum,
  SortOrderEnum,
} from 'src/enums/advertising.enums';
import {
  IPaginatedResponse,
  ISortCriteria,
} from 'src/interfaces/advertising/advertising.interface';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { IFinalFilters } from 'src/redux/slices/filters/filter.slice';
import { axiosInstance } from 'src/redux/store';
import { getAdvertisingPerformancePayload } from 'src/utils/advertising.utils';

export const overallAdvertisingServices = {
  getPerformanceMetrics: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    searchText = '',
    tab: AmazonAdvertisingTableTypesEnum
  ) => {
    return axiosInstance.post<IAPIResponse<IPerformanceMetrics>>(
      `${AMAZON_OVERALL_BASE_URL}/performance`,
      getAdvertisingPerformancePayload(
        filters,
        payload,
        searchText,
        tab,
        PerformanceTypeEnum.METRICS,
        MarketplaceEnum.AMAZON,
        AdTypeShort.All
      )
    );
  },
  getPerformanceGraph: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    searchText = '',
    tab: AmazonAdvertisingTableTypesEnum,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<IPerformanceGraph>>(
      `${AMAZON_OVERALL_BASE_URL}/graph`,
      getAdvertisingPerformancePayload(
        filters,
        payload,
        searchText,
        tab,
        PerformanceTypeEnum.GRAPH,
        MarketplaceEnum.AMAZON,
        AdTypeShort.All
      ),
      { signal }
    );
  },
};

export const overallAdvertisingAccountLevelServices = {
  getCampaignData: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = '',
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IOverallCampaign[]>>
    >(
      `${AMAZON_OVERALL_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          table: AmazonAdvertisingTableTypesEnum.CAMPAIGN,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          isDownload: payload.isDownload,
          downloadWithFilter: payload.downloadWithFilter,
        },
        searchText,
        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.CAMPAIGN_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchColumns: [
          AmazonSearchColumnsEnum.CAMPAIGN_ID,
          AmazonSearchColumnsEnum.CAMPAIGN_NAME,
        ],
      },
      { signal }
    );
  },
  getAdGroupData: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IOverallAdGroup[]>>
    >(`${AMAZON_OVERALL_BASE_URL}/table?pageSize=${pageSize}&page=${page}`, {
      filters: filters,
      payload: {
        range: payload.rangeType,
        table: AmazonAdvertisingTableTypesEnum.AD_GROUP,
        startDate: payload.range?.startDate,
        endDate: payload.range?.endDate,
        isDownload: payload.isDownload,
        downloadWithFilter: payload.downloadWithFilter,
      },
      searchText,
      sortCriteria: [
        ...sortCriteria,
        {
          columnName: AmazonSearchColumnsEnum.ADGROUP_NAME,
          sortOrder: SortOrderEnum.ASC,
        },
      ],
      searchColumns: [
        AmazonSearchColumnsEnum.ADGROUP_ID,
        AmazonSearchColumnsEnum.ADGROUP_NAME,
      ],
    });
  },
  getProductAdsData: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IOverallProductAds[]>>
    >(`${AMAZON_OVERALL_BASE_URL}/table?pageSize=${pageSize}&page=${page}`, {
      filters: filters,
      payload: {
        range: payload.rangeType,
        table: AmazonAdvertisingTableTypesEnum.PRODUCT_ADS,
        startDate: payload.range?.startDate,
        endDate: payload.range?.endDate,
        isDownload: payload.isDownload,
        downloadWithFilter: payload.downloadWithFilter,
      },
      searchText,
      sortCriteria: [
        ...sortCriteria,
        {
          columnName: AmazonSearchColumnsEnum.ITEM_NAME,
          sortOrder: SortOrderEnum.ASC,
        },
      ],
      searchColumns: [
        AmazonSearchColumnsEnum.PRODUCT_ID,
        AmazonSearchColumnsEnum.ITEM_NAME,
        AmazonSearchColumnsEnum.ASIN,
      ],
    });
  },
  getKeywordTargetingData: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IOverallKeywordTargeting[]>>
    >(`${AMAZON_OVERALL_BASE_URL}/table?pageSize=${pageSize}&page=${page}`, {
      filters: filters,
      payload: {
        range: payload.rangeType,
        table: AmazonAdvertisingTableTypesEnum.KEYWORD_TARGETS,
        startDate: payload.range?.startDate,
        endDate: payload.range?.endDate,
        isDownload: payload.isDownload,
        downloadWithFilter: payload.downloadWithFilter,
      },
      searchText,
      sortCriteria: [
        ...sortCriteria,
        {
          columnName: AmazonSearchColumnsEnum.KT_NAME,
          sortOrder: SortOrderEnum.ASC,
        },
      ],
      searchColumns: [
        AmazonSearchColumnsEnum.KT_ID,
        AmazonSearchColumnsEnum.KT_NAME,
      ],
    });
  },
  getProductTargetingData: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IOverallProductTargeting[]>>
    >(`${AMAZON_OVERALL_BASE_URL}/table?pageSize=${pageSize}&page=${page}`, {
      filters: filters,
      payload: {
        range: payload.rangeType,
        table: AmazonAdvertisingTableTypesEnum.PRODUCT_TARGETS,
        startDate: payload.range?.startDate,
        endDate: payload.range?.endDate,
        isDownload: payload.isDownload,
        downloadWithFilter: payload.downloadWithFilter,
      },
      searchText,
      sortCriteria: [
        ...sortCriteria,
        {
          columnName: AmazonSearchColumnsEnum.PT_NAME,
          sortOrder: SortOrderEnum.ASC,
        },
      ],
      searchColumns: [
        AmazonSearchColumnsEnum.PT_ID,
        AmazonSearchColumnsEnum.PT_NAME,
      ],
    });
  },
  getSearchTermData: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IOverallProductTargeting[]>>
    >(`${AMAZON_OVERALL_BASE_URL}/table?pageSize=${pageSize}&page=${page}`, {
      filters: filters,
      payload: {
        range: payload.rangeType,
        table: AmazonAdvertisingTableTypesEnum.SEARCH_TERM,
        startDate: payload.range?.startDate,
        endDate: payload.range?.endDate,
        isDownload: payload.isDownload,
        downloadWithFilter: payload.downloadWithFilter,
      },
      searchText,
      sortCriteria: [
        ...sortCriteria,
        {
          columnName: AmazonSearchColumnsEnum.SEARCH_TERM,
          sortOrder: SortOrderEnum.ASC,
        },
      ],
      searchColumns: [
        AmazonSearchColumnsEnum.SP_SEARCH_KEYWORD,
        AmazonSearchColumnsEnum.SEARCH_TERM,
        AmazonSearchColumnsEnum.PT_NAME,
      ],
    });
  },
};
