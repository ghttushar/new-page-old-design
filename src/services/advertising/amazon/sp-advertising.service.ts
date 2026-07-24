import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  IAdGroup,
  IAdvertisingFilter,
  IAutomationRules,
  IAutoTargeting,
  ICampaign,
  IKeywordTargeting,
  INegativeKeywordTargeting,
  INegativeProductTargeting,
  IPerformanceGraph,
  IPerformanceMetrics,
  IPlacement,
  IProductAds,
  IProductTargeting,
  ISearchTermKeyword,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { ICreateProductAds } from '@/interfaces/advertising/create-dialog/create-dialog.interface';
import {
  ADVERTISING_BASE_URL,
  AMAZON_SP_ADVERTISING_BASE_URL,
} from 'src/constants';
import { AMAZON_ADVERTISING_PROFILE_ID_HEADER_KEY } from 'src/constants/auth.constants';
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
import {
  getAdvertisingPerformancePayload,
  getSPBudgetFilter,
  getSPBudgetSortCriteria,
  getSPNegKTCreationDateSortCriteria,
} from 'src/utils/advertising.utils';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';

export const spAdvertisingServices = {
  getCampaigns: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = '',
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<IPaginatedResponse<ICampaign[]>>>(
      `${AMAZON_SP_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: getSPBudgetFilter(filters),
        payload: {
          range: payload.rangeType,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          campaignId: payload.campaignId,
          isDownload: payload.isDownload,
          downloadWithFilter: payload.downloadWithFilter,
        },
        searchText,
        tab: AmazonAdvertisingTableTypesEnum.CAMPAIGN,
        sortCriteria: [
          ...getSPBudgetSortCriteria(sortCriteria),
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
      {
        signal,
      }
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
    return axiosInstance.post<IAPIResponse<IPaginatedResponse<IAdGroup[]>>>(
      `${AMAZON_SP_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          campaignId: payload.campaignId,
          adGroupId: payload.adGroupId,
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
        tab: AmazonAdvertisingTableTypesEnum.AD_GROUP,
        searchColumns: [
          AmazonSearchColumnsEnum.ADGROUP_ID,
          AmazonSearchColumnsEnum.ADGROUP_NAME,
        ],
      }
    );
  },
  getKeywordTargeting: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IKeywordTargeting[]>>
    >(
      `${AMAZON_SP_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          campaignId: payload.campaignId,
          adGroupId: payload.adGroupId,
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
        tab: AmazonAdvertisingTableTypesEnum.KEYWORD_TARGETING,
        searchColumns: [
          AmazonSearchColumnsEnum.KT_ID,
          AmazonSearchColumnsEnum.KT_NAME,
        ],
      }
    );
  },
  getProductTargeting: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IProductTargeting[]>>
    >(
      `${AMAZON_SP_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          campaignId: payload.campaignId,
          adGroupId: payload.adGroupId,
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
        tab: AmazonAdvertisingTableTypesEnum.PRODUCT_TARGETING,
        searchColumns: [
          AmazonSearchColumnsEnum.PT_ID,
          AmazonSearchColumnsEnum.PT_NAME,
          AmazonSearchColumnsEnum.EXPRESSION,
        ],
      }
    );
  },
  getAutoTargeting: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IAutoTargeting[]>>
    >(
      `${AMAZON_SP_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          campaignId: payload.campaignId,
          adGroupId: payload.adGroupId,
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
        tab: AmazonAdvertisingTableTypesEnum.AUTO_TARGETING,
        searchColumns: [
          AmazonSearchColumnsEnum.PT_ID,
          AmazonSearchColumnsEnum.PT_NAME,
          AmazonSearchColumnsEnum.EXPRESSION,
        ],
      }
    );
  },
  getProductAds: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<IAPIResponse<IPaginatedResponse<IProductAds[]>>>(
      `${AMAZON_SP_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          campaignId: payload.campaignId,
          adGroupId: payload.adGroupId,
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
        tab: AmazonAdvertisingTableTypesEnum.PRODUCT_ADS,
        searchColumns: [
          AmazonSearchColumnsEnum.PRODUCT_ID,
          AmazonSearchColumnsEnum.ITEM_NAME,
          AmazonSearchColumnsEnum.ASIN,
        ],
      }
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
      IAPIResponse<IPaginatedResponse<ISearchTermKeyword[]>>
    >(
      `${AMAZON_SP_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          campaignId: payload.campaignId,
          adGroupId: payload.adGroupId,
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
        tab: AmazonAdvertisingTableTypesEnum.SEARCH_TERM,
        searchColumns: [
          AmazonSearchColumnsEnum.SP_SEARCH_KEYWORD,
          AmazonSearchColumnsEnum.SEARCH_TERM,
          AmazonSearchColumnsEnum.PT_NAME,
        ],
      }
    );
  },
  getNegativeKeywordTargeting: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<INegativeKeywordTargeting[]>>
    >(
      `${AMAZON_SP_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          campaignId: payload.campaignId,
          adGroupId: payload.adGroupId,
          isDownload: payload.isDownload,
          downloadWithFilter: payload.downloadWithFilter,
        },
        searchText,
        sortCriteria: [
          ...getSPNegKTCreationDateSortCriteria(sortCriteria),
          {
            columnName: AmazonSearchColumnsEnum.KT_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        tab: AmazonAdvertisingTableTypesEnum.NEGATIVE_TARGETING_KEYWORD,
        searchColumns: [
          AmazonSearchColumnsEnum.KT_ID,
          AmazonSearchColumnsEnum.KT_NAME,
        ],
      }
    );
  },
  getNegativeProductTargeting: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<INegativeProductTargeting[]>>
    >(
      `${AMAZON_SP_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          campaignId: payload.campaignId,
          adGroupId: payload.adGroupId,
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
        tab: AmazonAdvertisingTableTypesEnum.NEGATIVE_TARGETING_PRODUCT,
        searchColumns: [
          AmazonSearchColumnsEnum.PT_ID,
          AmazonSearchColumnsEnum.PT_NAME,
          AmazonSearchColumnsEnum.ASIN,
        ],
      }
    );
  },
  getPlacements: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<IAPIResponse<IPaginatedResponse<IPlacement[]>>>(
      `${AMAZON_SP_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          campaignId: payload.campaignId,
          isDownload: payload.isDownload,
          downloadWithFilter: payload.downloadWithFilter,
        },
        searchText,
        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.PLACEMENT,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        tab: AmazonAdvertisingTableTypesEnum.PLACEMENT,
        searchColumns: [
          AmazonSearchColumnsEnum.PLACEMENT,
          AmazonSearchColumnsEnum.CAMPAIGN_ID,
          AmazonSearchColumnsEnum.CAMPAIGN_NAME,
        ],
      }
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
      IAPIResponse<IPaginatedResponse<IAutomationRules[]>>
    >(
      `${AMAZON_SP_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          campaignId: payload.campaignId,
          adGroupId: payload.adGroupId,
          isDownload: payload.isDownload,
          downloadWithFilter: payload.downloadWithFilter,
          table: AmazonAdvertisingTableTypesEnum.CAMPAIGN_RULES,
        },
        searchText,
        sortCriteria,
        tab: AmazonAdvertisingTableTypesEnum.CAMPAIGN_RULES,
        searchColumns: [
          AmazonSearchColumnsEnum.RULE_ID,
          AmazonSearchColumnsEnum.RULE_NAME,
        ],
      }
    );
  },

  getPerformanceMetrics: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    searchText = '',
    tab: AmazonAdvertisingTableTypesEnum,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<IPerformanceMetrics>>(
      `${AMAZON_SP_ADVERTISING_BASE_URL}/performance`,
      getAdvertisingPerformancePayload(
        filters,
        payload,
        searchText,
        tab,
        PerformanceTypeEnum.METRICS,
        MarketplaceEnum.AMAZON,
        AdTypeShort.SPONSORED_PRODUCTS
      ),
      {
        signal,
      }
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
      `${AMAZON_SP_ADVERTISING_BASE_URL}/graph`,
      getAdvertisingPerformancePayload(
        filters,
        payload,
        searchText,
        tab,
        PerformanceTypeEnum.GRAPH,
        MarketplaceEnum.AMAZON,
        AdTypeShort.SPONSORED_PRODUCTS
      ),
      { signal }
    );
  },
  getLastSyncedTime: () => {
    return axiosInstance.get<IAPIResponse<string>>(
      `${AMAZON_SP_ADVERTISING_BASE_URL}/last-sync`
    );
  },
  getCampaign: (campaignId: string) => {
    return axiosInstance.get<IAPIResponse<ICampaign[]>>(
      `${AMAZON_SP_ADVERTISING_BASE_URL}/campaigns/${campaignId}`
    );
  },
  getAdGroup: (adGroupId: string) => {
    return axiosInstance.get<IAPIResponse<IAdGroup[]>>(
      `${AMAZON_SP_ADVERTISING_BASE_URL}/ad-groups/${adGroupId}`
    );
  },
};

export const amazonEntityServices = {
  getProducts: (marketplace: string) => {
    const amazonAccount = localStorageUtils.getSelectedAdvertisingAccount();
    return axiosInstance.get<IAPIResponse<ICreateProductAds[]>>(
      `${ADVERTISING_BASE_URL}/api/advertising/products?marketplace=${marketplace}`,
      {
        headers: {
          [AMAZON_ADVERTISING_PROFILE_ID_HEADER_KEY]:
            amazonAccount?.advertising?.amazonProfileId,
        },
      }
    );
  },
};
