import { MarketplaceEnum } from '@/enums/serp.enums';
import { WalmartSearchColumnsEnum } from '@/enums/walmart.enums';
import {
  IAdvertisingFilter,
  IPerformanceGraph,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { WALMART_SV_ADVERTISING_BASE_URL } from 'src/constants';
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
import { IWalmartBrandProfile } from 'src/interfaces/advertising/walmart/walmart-sb-advertising.interface';
import {
  IWalmartAdItem,
  IWalmartPageType,
  IWalmartPlatform,
} from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import {
  IWalmartSVAdGroup,
  IWalmartSVAutomationRules,
  IWalmartSVCampaign,
  IWalmartSVKeywords,
} from 'src/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { IFinalFilters } from 'src/redux/slices/filters/filter.slice';
import { axiosInstance } from 'src/redux/store';
import {
  getAdvertisingPayload,
  getAdvertisingPerformancePayload,
  getMappedPageTypeSearchText,
  getWalmartSearchColumnsByTableType,
} from 'src/utils/advertising.utils';

export const walmartSvAdvertisingServices = {
  getSVPerformanceMetrics: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    searchText = '',
    tab: WalmartAdvertisingTableTypeEnum,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<IPerformanceMetrics>>(
      `${WALMART_SV_ADVERTISING_BASE_URL}/performance?entityType=${tab}`,
      getAdvertisingPerformancePayload(
        filters,
        payload,
        searchText,
        tab,
        PerformanceTypeEnum.METRICS,
        MarketplaceEnum.WALMART,
        AdTypeShort.SPONSORED_VIDEO
      ),
      {
        signal,
      }
    );
  },
  getSVPerformanceGraph: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    searchText = '',
    tab: WalmartAdvertisingTableTypeEnum,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<IPerformanceGraph>>(
      `${WALMART_SV_ADVERTISING_BASE_URL}/graph?entityType=${tab}`,
      getAdvertisingPerformancePayload(
        filters,
        payload,
        searchText,
        tab,
        PerformanceTypeEnum.GRAPH,
        MarketplaceEnum.WALMART,
        AdTypeShort.SPONSORED_VIDEO
      ),
      {
        signal,
      }
    );
  },
  getSVCampaigns: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = '',
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IWalmartSVCampaign[]>>
    >(
      `${WALMART_SV_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.CAMPAIGN}`,
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
          AdTypeShort.SPONSORED_VIDEO,
          WalmartAdvertisingTableTypeEnum.CAMPAIGN
        )
      ),
      {
        signal,
      }
    );
  },
  getSVAdGroups: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IWalmartSVAdGroup[]>>
    >(
      `${WALMART_SV_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.AD_GROUP}`,
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
          AdTypeShort.SPONSORED_VIDEO,
          WalmartAdvertisingTableTypeEnum.AD_GROUP
        )
      )
    );
  },
  getSVAdItems: (
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
      `${WALMART_SV_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.AD_ITEM}`,
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
          AdTypeShort.SPONSORED_VIDEO,
          WalmartAdvertisingTableTypeEnum.AD_ITEM
        )
      )
    );
  },
  getSVKeywordTargeting: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IWalmartSVKeywords[]>>
    >(
      `${WALMART_SV_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.KEYWORD}`,
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
          AdTypeShort.SPONSORED_VIDEO,
          WalmartAdvertisingTableTypeEnum.KEYWORD
        )
      )
    );
  },
  getSVBrandAssets: (campaignId: string) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IWalmartBrandProfile[]>>
    >(
      `${WALMART_SV_ADVERTISING_BASE_URL}/table?entityType=${WalmartAdvertisingTableTypeEnum.BRAND_PROFILE}`,
      {
        payload: {
          campaignId,
        },
      }
    );
  },
  getSVPageType: (
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
      `${WALMART_SV_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.PAGE_TYPE}`,
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
          AdTypeShort.SPONSORED_VIDEO,
          WalmartAdvertisingTableTypeEnum.PAGE_TYPE
        )
      )
    );
  },
  getSVPlatform: (
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
      `${WALMART_SV_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.PLATFORM}`,
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
          AdTypeShort.SPONSORED_VIDEO,
          WalmartAdvertisingTableTypeEnum.PLATFORM
        )
      )
    );
  },
  getSVCampaignAutomationRules: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IWalmartSVAutomationRules[]>>
    >(
      `${WALMART_SV_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.CAMPAIGN_RULES}`,
      getAdvertisingPayload(
        filters,
        payload,
        sortCriteria,
        searchText,
        getWalmartSearchColumnsByTableType(
          AdTypeShort.SPONSORED_VIDEO,
          WalmartAdvertisingTableTypeEnum.CAMPAIGN_RULES
        )
      )
    );
  },
};
