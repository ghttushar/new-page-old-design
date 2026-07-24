import { MarketplaceEnum } from '@/enums/serp.enums';
import { WalmartSearchColumnsEnum } from '@/enums/walmart.enums';
import {
  IAdvertisingFilter,
  IPerformanceGraph,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { ICreateProductAds } from '@/interfaces/advertising/create-dialog/create-dialog.interface';
import { IWalmartCreateAddedKeywords } from 'src/app/components/page-components/advertising-create-dialogs/walmart-keyword-dialog/walmart-keyword-dialog';
import {
  ADVERTISING_BASE_URL,
  WALMART_ENTITY_BASE_URL,
  WALMART_SP_ADVERTISING_BASE_URL,
} from 'src/constants';
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
  IWalmartAdGroup,
  IWalmartAdItem,
  IWalmartCampaign,
  IWalmartKeywords,
  IWalmartPageType,
  IWalmartPlatform,
  IWalmartSearchTerms,
  IWalmartSPAutomationRules,
} from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { IFinalFilters } from 'src/redux/slices/filters/filter.slice';
import { axiosInstance } from 'src/redux/store';
import {
  getAdvertisingPayload,
  getAdvertisingPerformancePayload,
  getMappedPageTypeSearchText,
  getWalmartSearchColumnsByTableType,
  getWalmartSearchTermType,
} from 'src/utils/advertising.utils';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';

export const walmartSpAdvertisingServices = {
  getCampaigns: (
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
      `${WALMART_SP_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.CAMPAIGN}`,
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
          AdTypeShort.SPONSORED_PRODUCTS,
          WalmartAdvertisingTableTypeEnum.CAMPAIGN
        )
      ),
      { signal }
    );
  },
  getAdGroups: (
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
      `${WALMART_SP_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.AD_GROUP}`,
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
          AdTypeShort.SPONSORED_PRODUCTS,
          WalmartAdvertisingTableTypeEnum.AD_GROUP
        )
      )
    );
  },
  getAdItems: (
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
      `${WALMART_SP_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.AD_ITEM}`,
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
          AdTypeShort.SPONSORED_PRODUCTS,
          WalmartAdvertisingTableTypeEnum.AD_ITEM
        )
      )
    );
  },
  getKeywords: (
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
      `${WALMART_SP_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.KEYWORD}`,
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
          AdTypeShort.SPONSORED_PRODUCTS,
          WalmartAdvertisingTableTypeEnum.KEYWORD
        )
      )
    );
  },
  getSearchTerms: (
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
      `${WALMART_SP_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${getWalmartSearchTermType(
        payload.targetingType || ''
      )}`,
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
          AdTypeShort.SPONSORED_PRODUCTS,
          getWalmartSearchTermType(payload.targetingType || '')
        )
      )
    );
  },
  getPageType: (
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
      `${WALMART_SP_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.PAGE_TYPE}`,
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
          AdTypeShort.SPONSORED_PRODUCTS,
          WalmartAdvertisingTableTypeEnum.PAGE_TYPE
        )
      )
    );
  },
  getPlatform: (
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
      `${WALMART_SP_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.PLATFORM}`,
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
          AdTypeShort.SPONSORED_PRODUCTS,
          WalmartAdvertisingTableTypeEnum.PLATFORM
        )
      )
    );
  },
  getCampaignAutomationRules: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IWalmartSPAutomationRules[]>>
    >(
      `${WALMART_SP_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}&entityType=${WalmartAdvertisingTableTypeEnum.CAMPAIGN_RULES}`,
      getAdvertisingPayload(
        filters,
        payload,
        sortCriteria,
        searchText,
        getWalmartSearchColumnsByTableType(
          AdTypeShort.SPONSORED_PRODUCTS,
          WalmartAdvertisingTableTypeEnum.CAMPAIGN_RULES
        )
      )
    );
  },

  getPerformanceMetrics: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    searchText = '',
    tab: WalmartAdvertisingTableTypeEnum,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<IPerformanceMetrics>>(
      `${WALMART_SP_ADVERTISING_BASE_URL}/performance?entityType=${tab}`,
      getAdvertisingPerformancePayload(
        filters,
        payload,
        searchText,
        tab,
        PerformanceTypeEnum.METRICS,
        MarketplaceEnum.WALMART,
        AdTypeShort.SPONSORED_PRODUCTS
      ),
      { signal }
    );
  },

  getPerformanceGraph: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    searchText = '',
    tab: WalmartAdvertisingTableTypeEnum,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<IPerformanceGraph>>(
      `${WALMART_SP_ADVERTISING_BASE_URL}/graph?entityType=${tab}`,
      getAdvertisingPerformancePayload(
        filters,
        payload,
        searchText,
        tab,
        PerformanceTypeEnum.GRAPH,
        MarketplaceEnum.WALMART,
        AdTypeShort.SPONSORED_PRODUCTS
      ),
      { signal }
    );
  },
};

export const walmartEntityServices = {
  getCampaignEntity: (campaignId: string) => {
    return axiosInstance.get<IAPIResponse<IWalmartCampaign>>(
      `${WALMART_ENTITY_BASE_URL}/campaign/${campaignId}`
    );
  },

  getAdGroupEntity: (adGroupId: string) => {
    return axiosInstance.get<IAPIResponse<IWalmartAdGroup[]>>(
      `${WALMART_ENTITY_BASE_URL}/ad-group/${adGroupId}`
    );
  },

  getProducts: (marketplace: string, walmartAdType: AdTypeShort) => {
    const walmartAccount = localStorageUtils.getSelectedAdvertisingAccount();

    return axiosInstance.get<IAPIResponse<ICreateProductAds[]>>(
      `${ADVERTISING_BASE_URL}/api/advertising/products`,

      {
        params: {
          marketplace: marketplace,
          walmartAdType: walmartAdType.toLowerCase(),
        },
        headers: {
          walmartAdvertiserId: walmartAccount?.advertising?.walmartAdvertiserId,
        },
      }
    );
  },

  getNormalizedKeywordData: (keywordData: IWalmartCreateAddedKeywords[]) => {
    return axiosInstance.post<IAPIResponse<IWalmartCreateAddedKeywords[]>>(
      `${WALMART_ENTITY_BASE_URL}/normalized-keywords`,
      { payload: keywordData }
    );
  },
};
