import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  ISBAdGroup,
  ISBAssetById,
  ISBAssetByIdBody,
  ISBAutomationRules,
  ISBCampaign,
  ISBCreative,
  ISBKeywordTargeting,
  ISBNegativeTargetingKeyword,
  ISBNegativeTargetingProduct,
  ISBProductAds,
  ISBProductTargeting,
  ISBSearchTermKeyword,
} from '@/interfaces/advertising/amazon/sb-advertising.interface';
import {
  IAdvertisingFilter,
  IPerformanceGraph,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { AMAZON_SB_ADVERTISING_BASE_URL } from 'src/constants';
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

export const sbAdvertisingServices = {
  getSBPerformanceMetrics: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    searchText = '',
    tab: AmazonAdvertisingTableTypesEnum,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<IPerformanceMetrics>>(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/performance`,
      getAdvertisingPerformancePayload(
        filters,
        payload,
        searchText,
        tab,
        PerformanceTypeEnum.METRICS,
        MarketplaceEnum.AMAZON,
        AdTypeShort.SPONSORED_BRANDS
      ),
      { signal }
    );
  },
  getSBPerformanceGraph: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    searchText = '',
    tab: AmazonAdvertisingTableTypesEnum,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<IPerformanceGraph>>(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/graph`,
      getAdvertisingPerformancePayload(
        filters,
        payload,
        searchText,
        tab,
        PerformanceTypeEnum.GRAPH,
        MarketplaceEnum.AMAZON,
        AdTypeShort.SPONSORED_BRANDS
      ),
      { signal }
    );
  },
};

export const sbAdvertisingAccountLevelServices = {
  getCampaigns: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = '',
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<IPaginatedResponse<ISBCampaign[]>>>(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
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
        tab: AmazonAdvertisingTableTypesEnum.CAMPAIGN,
        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.CAMPAIGN_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
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
    return axiosInstance.post<IAPIResponse<IPaginatedResponse<ISBAdGroup[]>>>(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          isDownload: payload.isDownload,
          downloadWithFilter: payload.downloadWithFilter,
        },
        tab: AmazonAdvertisingTableTypesEnum.AD_GROUP,
        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.ADGROUP_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        searchColumns: [
          AmazonSearchColumnsEnum.ADGROUP_ID,
          AmazonSearchColumnsEnum.ADGROUP_NAME,
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
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<ISBProductAds[]>>
    >(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          isDownload: payload.isDownload,
          downloadWithFilter: payload.downloadWithFilter,
        },
        tab: AmazonAdvertisingTableTypesEnum.PRODUCT_ADS,
        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.SB_PRODUCT_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        searchColumns: [
          AmazonSearchColumnsEnum.PRODUCT_ID,
          AmazonSearchColumnsEnum.SB_PRODUCT_NAME,
          AmazonSearchColumnsEnum.SB_PRODUCT_ASINS,
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
      IAPIResponse<IPaginatedResponse<ISBKeywordTargeting[]>>
    >(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          isDownload: payload.isDownload,
          downloadWithFilter: payload.downloadWithFilter,
        },
        tab: AmazonAdvertisingTableTypesEnum.KEYWORD_TARGETING,
        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.KT_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
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
      IAPIResponse<IPaginatedResponse<ISBProductTargeting[]>>
    >(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          isDownload: payload.isDownload,
          downloadWithFilter: payload.downloadWithFilter,
        },
        tab: AmazonAdvertisingTableTypesEnum.PRODUCT_TARGETING,
        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.PT_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        searchColumns: [
          AmazonSearchColumnsEnum.PT_ID,
          AmazonSearchColumnsEnum.PT_NAME,
        ],
      }
    );
  },
  getSBSearchTerms: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<ISBSearchTermKeyword[]>>
    >(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          isDownload: payload.isDownload,
          downloadWithFilter: payload.downloadWithFilter,
        },
        tab: AmazonAdvertisingTableTypesEnum.SEARCH_TERM,
        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.SEARCH_TERM,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        searchColumns: [
          AmazonSearchColumnsEnum.SEARCH_TERM,
          AmazonSearchColumnsEnum.SEARCH_TERM_KEYWORD,
        ],
      }
    );
  },
};

export const sbAdvertisingCampaignLevelServices = {
  getSBAdGroups: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<IAPIResponse<IPaginatedResponse<ISBAdGroup[]>>>(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        tab: AmazonAdvertisingTableTypesEnum.AD_GROUP,
        payload: {
          range: payload.rangeType,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          campaignId: payload.campaignId,
          adGroupId: payload.adGroupId,
          isDownload: payload.isDownload,
          downloadWithFilter: payload.downloadWithFilter,
        },
        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.ADGROUP_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        searchColumns: [
          AmazonSearchColumnsEnum.ADGROUP_ID,
          AmazonSearchColumnsEnum.ADGROUP_NAME,
        ],
      }
    );
  },
  getSBProductAds: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<ISBProductAds[]>>
    >(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        tab: AmazonAdvertisingTableTypesEnum.PRODUCT_ADS,
        payload: {
          range: payload.rangeType,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          campaignId: payload.campaignId,
          isDownload: payload.isDownload,
          downloadWithFilter: payload.downloadWithFilter,
        },
        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.SB_PRODUCT_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        searchColumns: [
          AmazonSearchColumnsEnum.PRODUCT_ID,
          AmazonSearchColumnsEnum.SB_PRODUCT_NAME,
          AmazonSearchColumnsEnum.SB_PRODUCT_ASINS,
        ],
      }
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
      IAPIResponse<IPaginatedResponse<ISBKeywordTargeting[]>>
    >(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/table/?pageSize=${pageSize}&page=${page}`,
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
        tab: AmazonAdvertisingTableTypesEnum.KEYWORD_TARGETING,
        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.KT_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        searchColumns: [
          AmazonSearchColumnsEnum.KT_ID,
          AmazonSearchColumnsEnum.KT_NAME,
        ],
      }
    );
  },
  getSBProductTargeting: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<ISBProductTargeting[]>>
    >(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
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
        tab: AmazonAdvertisingTableTypesEnum.PRODUCT_TARGETING,
        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.PT_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        searchColumns: [
          AmazonSearchColumnsEnum.PT_ID,
          AmazonSearchColumnsEnum.PT_NAME,
        ],
      }
    );
  },
  getSBSearchTermKeyword: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<ISBSearchTermKeyword[]>>
    >(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
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
        tab: AmazonAdvertisingTableTypesEnum.SEARCH_TERM,
        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.SEARCH_TERM,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        searchColumns: [
          AmazonSearchColumnsEnum.SEARCH_TERM,
          AmazonSearchColumnsEnum.SEARCH_TERM_KEYWORD,
        ],
      }
    );
  },
  getSBNegativeTargetingKeyword: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<ISBNegativeTargetingKeyword[]>>
    >(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
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
        tab: AmazonAdvertisingTableTypesEnum.NEGATIVE_TARGETING_KEYWORD,
        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.KT_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        searchColumns: [
          AmazonSearchColumnsEnum.KT_ID,
          AmazonSearchColumnsEnum.KT_NAME,
        ],
      }
    );
  },
  getSBNegativeTargetingProduct: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<ISBNegativeTargetingProduct[]>>
    >(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
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
        tab: AmazonAdvertisingTableTypesEnum.NEGATIVE_TARGETING_PRODUCT,
        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.PT_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        searchColumns: [
          AmazonSearchColumnsEnum.PT_ID,
          AmazonSearchColumnsEnum.PT_NAME,
        ],
      }
    );
  },
  getAssetById: (body: ISBAssetByIdBody) => {
    return axiosInstance.post<IAPIResponse<ISBAssetById>>(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/assets`,
      body
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
      IAPIResponse<IPaginatedResponse<ISBAutomationRules[]>>
    >(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
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
};

export const sbAdvertisingAdGroupLevelServices = {
  getSBCreative: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<IAPIResponse<IPaginatedResponse<ISBCreative[]>>>(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
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
        tab: AmazonAdvertisingTableTypesEnum.CREATIVE_PRODUCT,
        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.CREATIVE_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        searchColumns: [
          AmazonSearchColumnsEnum.CREATIVE_ID,
          AmazonSearchColumnsEnum.CREATIVE_NAME,
          AmazonSearchColumnsEnum.CREATIVE_ASINS,
        ],
      }
    );
  },
  getSBProductAds: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<ISBProductAds[]>>
    >(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
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
        tab: AmazonAdvertisingTableTypesEnum.PRODUCT_ADS,
        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.SB_PRODUCT_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        searchColumns: [
          AmazonSearchColumnsEnum.PRODUCT_ID,
          AmazonSearchColumnsEnum.SB_PRODUCT_NAME,
          AmazonSearchColumnsEnum.SB_PRODUCT_ASINS,
        ],
      }
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
      IAPIResponse<IPaginatedResponse<ISBKeywordTargeting[]>>
    >(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
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
        tab: AmazonAdvertisingTableTypesEnum.KEYWORD_TARGETING,
        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.KT_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        searchColumns: [
          AmazonSearchColumnsEnum.KT_ID,
          AmazonSearchColumnsEnum.KT_NAME,
        ],
      }
    );
  },
  getSBProductTargeting: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<ISBProductTargeting[]>>
    >(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
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
        tab: AmazonAdvertisingTableTypesEnum.PRODUCT_TARGETING,
        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.PT_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        searchColumns: [
          AmazonSearchColumnsEnum.PT_ID,
          AmazonSearchColumnsEnum.PT_NAME,
        ],
      }
    );
  },
  getSBSearchTermKeyword: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<ISBSearchTermKeyword[]>>
    >(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
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

        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.SEARCH_TERM,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        tab: AmazonAdvertisingTableTypesEnum.SEARCH_TERM,
        searchText,
        searchColumns: [
          AmazonSearchColumnsEnum.SEARCH_TERM,
          AmazonSearchColumnsEnum.SEARCH_TERM_KEYWORD,
        ],
      }
    );
  },
  getSBNegativeTargetingKeyword: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<ISBNegativeTargetingKeyword[]>>
    >(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
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
        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.KT_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        tab: AmazonAdvertisingTableTypesEnum.NEGATIVE_TARGETING_KEYWORD,
        searchColumns: [
          AmazonSearchColumnsEnum.KT_ID,
          AmazonSearchColumnsEnum.KT_NAME,
        ],
      }
    );
  },
  getSBNegativeTargetingProduct: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<ISBNegativeTargetingProduct[]>>
    >(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
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
        tab: AmazonAdvertisingTableTypesEnum.NEGATIVE_TARGETING_PRODUCT,
        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.PT_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        searchColumns: [
          AmazonSearchColumnsEnum.PT_ID,
          AmazonSearchColumnsEnum.PT_NAME,
        ],
      }
    );
  },
  getAssetById: (body: ISBAssetByIdBody) => {
    return axiosInstance.post<IAPIResponse<ISBAssetById>>(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/assets`,
      body
    );
  },
};

export const sbAdvertisingEntityServices = {
  getCampaignById: (campaignId: string) => {
    return axiosInstance.get<IAPIResponse<Partial<ISBCampaign>>>(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/campaigns/${campaignId}`
    );
  },

  getAdGroupById: (adGroupId: string) => {
    return axiosInstance.get<IAPIResponse<Partial<ISBAdGroup>>>(
      `${AMAZON_SB_ADVERTISING_BASE_URL}/adgroups/${adGroupId}`
    );
  },
};
