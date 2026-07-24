import { MarketplaceEnum } from '@/enums/serp.enums';
import { WalmartSearchColumnsEnum } from '@/enums/walmart.enums';
import {
  IAdvertisingFilter,
  IPerformanceGraph,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { WALMART_SB_ADVERTISING_BASE_URL } from 'src/constants';
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
  IWalmartBrandProfile,
  IWalmartSBAutomationRules,
} from 'src/interfaces/advertising/walmart/walmart-sb-advertising.interface';
import {
  IWalmartAdGroup,
  IWalmartAdItem,
  IWalmartCampaign,
  IWalmartKeywords,
  IWalmartPageType,
  IWalmartPlatform,
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

export const walmartSbAdvertisingServices = {
  getSBPerformanceMetrics: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    searchText = '',
    tab: WalmartAdvertisingTableTypeEnum,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<IPerformanceMetrics>>(
      `${WALMART_SB_ADVERTISING_BASE_URL}/performance?entityType=${tab}`,
      getAdvertisingPerformancePayload(
        filters,
        payload,
        searchText,
        tab,
        PerformanceTypeEnum.METRICS,
        MarketplaceEnum.WALMART,
        AdTypeShort.SPONSORED_BRANDS
      ),
      { signal }
    );
  },
  getSBPerformanceGraph: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    searchText = '',
    tab: WalmartAdvertisingTableTypeEnum,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<IPerformanceGraph>>(
      `${WALMART_SB_ADVERTISING_BASE_URL}/graph?entityType=${tab}`,
      getAdvertisingPerformancePayload(
        filters,
        payload,
        searchText,
        tab,
        PerformanceTypeEnum.GRAPH,
        MarketplaceEnum.WALMART,
        AdTypeShort.SPONSORED_BRANDS
      ),
      { signal }
    );
  },
  getSBCampaigns: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = '',
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IWalmartCampaign[]>>
    >(
      `${WALMART_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.CAMPAIGN}`,
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
          AdTypeShort.SPONSORED_BRANDS,
          WalmartAdvertisingTableTypeEnum.CAMPAIGN
        )
      ),
      { signal }
    );
  },
  getSBAdGroups: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IWalmartAdGroup[]>>
    >(
      `${WALMART_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.AD_GROUP}`,
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
          AdTypeShort.SPONSORED_BRANDS,
          WalmartAdvertisingTableTypeEnum.AD_GROUP
        )
      )
    );
  },
  getSBAdItems: (
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
      `${WALMART_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.AD_ITEM}`,
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
          AdTypeShort.SPONSORED_BRANDS,
          WalmartAdvertisingTableTypeEnum.AD_ITEM
        )
      )
    );
  },
  getSBKeywordTargeting: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IWalmartKeywords[]>>
    >(
      `${WALMART_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.KEYWORD}`,
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
          AdTypeShort.SPONSORED_BRANDS,
          WalmartAdvertisingTableTypeEnum.KEYWORD
        )
      )
    );
  },
  getSBBrandAssets: (campaignId: string) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IWalmartBrandProfile[]>>
    >(
      `${WALMART_SB_ADVERTISING_BASE_URL}/table?entityType=${WalmartAdvertisingTableTypeEnum.BRAND_PROFILE}`,
      {
        payload: {
          campaignId,
        },
      }
    );
  },
  getSBPageType: (
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
      `${WALMART_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.PAGE_TYPE}`,
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
          AdTypeShort.SPONSORED_BRANDS,
          WalmartAdvertisingTableTypeEnum.PAGE_TYPE
        )
      )
    );
  },
  getSBPlatform: (
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
      `${WALMART_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.PLATFORM}`,
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
          AdTypeShort.SPONSORED_BRANDS,
          WalmartAdvertisingTableTypeEnum.PLATFORM
        )
      )
    );
  },
  getSBCampaignAutomationRules: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IWalmartSBAutomationRules[]>>
    >(
      `${WALMART_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.CAMPAIGN_RULES}`,
      getAdvertisingPayload(
        filters,
        payload,
        sortCriteria,
        searchText,
        getWalmartSearchColumnsByTableType(
          AdTypeShort.SPONSORED_BRANDS,
          WalmartAdvertisingTableTypeEnum.CAMPAIGN_RULES
        )
      )
    );
  },
};
