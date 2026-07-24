import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  ISDAdGroup,
  ISDAutomationRules,
  ISDCampaign,
  ISDCreative,
  ISDProductAds,
} from '@/interfaces/advertising/amazon/sd-advertising.interface';
import {
  IAdvertisingFilter,
  IPerformanceGraph,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { AMAZON_SD_ADVERTISING_BASE_URL } from 'src/constants';
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

export const sdAdvertisingServices = {
  getSDPerformanceMetrics: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    searchText = '',
    tab: AmazonAdvertisingTableTypesEnum,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<IPerformanceMetrics>>(
      `${AMAZON_SD_ADVERTISING_BASE_URL}/performance`,
      getAdvertisingPerformancePayload(
        filters,
        payload,
        searchText,
        tab,
        PerformanceTypeEnum.METRICS,
        MarketplaceEnum.AMAZON,
        AdTypeShort.SPONSORED_DISPLAY
      ),
      { signal }
    );
  },
  getSDPerformanceGraph: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    searchText = '',
    tab: AmazonAdvertisingTableTypesEnum,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<IPerformanceGraph>>(
      `${AMAZON_SD_ADVERTISING_BASE_URL}/graph`,
      getAdvertisingPerformancePayload(
        filters,
        payload,
        searchText,
        tab,
        PerformanceTypeEnum.GRAPH,
        MarketplaceEnum.AMAZON,
        AdTypeShort.SPONSORED_DISPLAY
      ),
      { signal }
    );
  },
};

export const sdAdvertisingEntityServices = {
  getSDCampaignById: (campaignId: string) => {
    return axiosInstance.get<IAPIResponse<Partial<ISDCampaign>>>(
      `${AMAZON_SD_ADVERTISING_BASE_URL}/campaigns/${campaignId}`
    );
  },

  getSDAdGroupById: (adGroupId: string) => {
    return axiosInstance.get<IAPIResponse<Partial<ISDAdGroup>>>(
      `${AMAZON_SD_ADVERTISING_BASE_URL}/adgroups/${adGroupId}`
    );
  },
};

// ---------------- ACCOUNT LEVEL -------------------
export const sdAdvertisingAccountLevelServices = {
  getSDCampaigns: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = '',
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<IPaginatedResponse<ISDCampaign[]>>>(
      `${AMAZON_SD_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          table: AmazonAdvertisingTableTypesEnum.CAMPAIGN,
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
      { signal }
    );
  },
  getSDAdGroups: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<IAPIResponse<IPaginatedResponse<ISDAdGroup[]>>>(
      `${AMAZON_SD_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          table: AmazonAdvertisingTableTypesEnum.AD_GROUP,
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
  getSDProductAds: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<ISDProductAds[]>>
    >(
      `${AMAZON_SD_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          table: AmazonAdvertisingTableTypesEnum.PRODUCT_ADS,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          isDownload: payload.isDownload,
          downloadWithFilter: payload.downloadWithFilter,
        },
        tab: AmazonAdvertisingTableTypesEnum.PRODUCT_ADS,
        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.SD_PRODUCT_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        searchColumns: [
          AmazonSearchColumnsEnum.PRODUCT_ID,
          AmazonSearchColumnsEnum.SD_PRODUCT_NAME,
          AmazonSearchColumnsEnum.SD_PRODUCT_ASIN,
          AmazonSearchColumnsEnum.ITEM_NAME,
        ],
      }
    );
  },
};

// ---------------- CAMPAIGN LEVEL -------------------
export const sdAdvertisingServicesCampaignLevel = {
  getSDAdGroupData: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<IAPIResponse<IPaginatedResponse<ISDAdGroup[]>>>(
      `${AMAZON_SD_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          table: AmazonAdvertisingTableTypesEnum.AD_GROUP,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          campaignId: payload.campaignId,
          adGroupId: payload.adGroupId,
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
  getSDProductAdsData: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<ISDProductAds[]>>
    >(
      `${AMAZON_SD_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          table: AmazonAdvertisingTableTypesEnum.PRODUCT_ADS,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          campaignId: payload.campaignId,
          isDownload: payload.isDownload,
          downloadWithFilter: payload.downloadWithFilter,
        },
        tab: AmazonAdvertisingTableTypesEnum.PRODUCT_ADS,
        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.SD_PRODUCT_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        searchColumns: [
          AmazonSearchColumnsEnum.PRODUCT_ID,
          AmazonSearchColumnsEnum.SD_PRODUCT_NAME,
          AmazonSearchColumnsEnum.SD_PRODUCT_ASIN,
          AmazonSearchColumnsEnum.ITEM_NAME,
        ],
      }
    );
  },
  getSDCampaignAutomationRules: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<ISDAutomationRules[]>>
    >(
      `${AMAZON_SD_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          table: AmazonAdvertisingTableTypesEnum.CAMPAIGN_RULES,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          campaignId: payload.campaignId,
          adGroupId: payload.adGroupId,
          isDownload: payload.isDownload,
          downloadWithFilter: payload.downloadWithFilter,
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

// ---------------- AD GROUP LEVEL -------------------
export const sdAdvertisingServicesAdGroupLevel = {
  getSDProductAdsData: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<ISDProductAds[]>>
    >(
      `${AMAZON_SD_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          table: AmazonAdvertisingTableTypesEnum.PRODUCT_ADS,
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
            columnName: AmazonSearchColumnsEnum.SD_PRODUCT_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        searchColumns: [
          AmazonSearchColumnsEnum.PRODUCT_ID,
          AmazonSearchColumnsEnum.SD_PRODUCT_NAME,
          AmazonSearchColumnsEnum.SD_PRODUCT_ASIN,
          AmazonSearchColumnsEnum.ITEM_NAME,
        ],
      }
    );
  },
  getSDCreativeData: (
    filters: IFinalFilters[],
    payload: IAdvertisingFilter,
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = ''
  ) => {
    return axiosInstance.post<IAPIResponse<IPaginatedResponse<ISDCreative[]>>>(
      `${AMAZON_SD_ADVERTISING_BASE_URL}/table?pageSize=${pageSize}&page=${page}`,
      {
        filters: filters,
        payload: {
          range: payload.rangeType,
          table: AmazonAdvertisingTableTypesEnum.CREATIVE,
          startDate: payload.range?.startDate,
          endDate: payload.range?.endDate,
          campaignId: payload.campaignId,
          adGroupId: payload.adGroupId,
          isDownload: payload.isDownload,
          downloadWithFilter: payload.downloadWithFilter,
        },
        tab: AmazonAdvertisingTableTypesEnum.CREATIVE,
        sortCriteria: [
          ...sortCriteria,
          {
            columnName: AmazonSearchColumnsEnum.CAMPAIGN_NAME,
            sortOrder: SortOrderEnum.ASC,
          },
        ],
        searchText,
        searchColumns: [],
      }
    );
  },
};
