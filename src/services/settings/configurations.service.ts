import {
  AMAZON_CONFIGURATION_BASE_URL,
  AMAZON_TARGETING_ACTIONS_BASE_URL,
  WALMART_CONFIGURATION_BASE_URL,
  WALMART_TARGETING_ACTIONS_BASE_URL,
} from '@/constants';
import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  IAdGroupListResponse,
  IGenerateSourceTargetMappingResponse,
  IHeroItemsApiResponse,
  IHeroItemsPayload,
  IHeroItemsSaveResponse,
  IMetricsConfiguration,
  IMetricsConfigurationResponse,
  IMetricsConfigurationSaveResponse,
  ISourceTargetMappingResponse,
  IUpsertSourceTargetMappingPayload,
  IUpsertSourceTargetMappingResponse,
} from '@/interfaces/configurations.interface';
import { axiosInstance } from '@/redux/store';

const ConfigurationsService = {
  getSourceTargetMapping: (
    marketplace: MarketplaceEnum,
    signal?: AbortSignal
  ) => {
    const baseUrl =
      marketplace === MarketplaceEnum.AMAZON
        ? AMAZON_TARGETING_ACTIONS_BASE_URL
        : WALMART_TARGETING_ACTIONS_BASE_URL;

    return axiosInstance.get<ISourceTargetMappingResponse>(
      `${baseUrl}/source-target-mapping`,
      {
        signal,
      }
    );
  },
  generateSourceTargetMapping: (
    marketplace: MarketplaceEnum,
    signal?: AbortSignal
  ) => {
    const baseUrl =
      marketplace === MarketplaceEnum.AMAZON
        ? AMAZON_TARGETING_ACTIONS_BASE_URL
        : WALMART_TARGETING_ACTIONS_BASE_URL;

    return axiosInstance.get<IGenerateSourceTargetMappingResponse>(
      `${baseUrl}/generate-source-target-mapping`,
      {
        signal,
      }
    );
  },

  getAdGroups: (marketplace: MarketplaceEnum, signal?: AbortSignal) => {
    const baseUrl =
      marketplace === MarketplaceEnum.AMAZON
        ? AMAZON_TARGETING_ACTIONS_BASE_URL
        : WALMART_TARGETING_ACTIONS_BASE_URL;

    return axiosInstance.get<IAdGroupListResponse>(`${baseUrl}/ad-groups`, {
      signal,
    });
  },

  upsertSourceTargetMapping: (
    marketplace: MarketplaceEnum,
    payload: IUpsertSourceTargetMappingPayload
  ) => {
    const baseUrl =
      marketplace === MarketplaceEnum.AMAZON
        ? AMAZON_TARGETING_ACTIONS_BASE_URL
        : WALMART_TARGETING_ACTIONS_BASE_URL;

    return axiosInstance.post<IUpsertSourceTargetMappingResponse>(
      `${baseUrl}/upsert-source-target-mapping`,
      payload
    );
  },

  // Metrics Configuration APIs
  getMetricsConfiguration: (
    marketplace: MarketplaceEnum,
    signal?: AbortSignal
  ) => {
    const baseUrl =
      marketplace === MarketplaceEnum.AMAZON
        ? AMAZON_CONFIGURATION_BASE_URL
        : WALMART_CONFIGURATION_BASE_URL;

    return axiosInstance.get<IMetricsConfigurationResponse>(
      `${baseUrl}/metrics-config`,
      { signal }
    );
  },

  saveMetricsConfiguration: (
    marketplace: MarketplaceEnum,
    payload: IMetricsConfiguration
  ) => {
    const baseUrl =
      marketplace === MarketplaceEnum.AMAZON
        ? AMAZON_CONFIGURATION_BASE_URL
        : WALMART_CONFIGURATION_BASE_URL;

    return axiosInstance.post<IMetricsConfigurationSaveResponse>(
      `${baseUrl}/metrics-config`,
      payload
    );
  },

  // Hero Items Configuration APIs
  getHeroItems: (marketplace: MarketplaceEnum, signal?: AbortSignal) => {
    const baseUrl =
      marketplace === MarketplaceEnum.AMAZON
        ? AMAZON_CONFIGURATION_BASE_URL
        : WALMART_CONFIGURATION_BASE_URL;

    return axiosInstance.get<IHeroItemsApiResponse>(`${baseUrl}/hero-items`, {
      signal,
    });
  },

  saveHeroItems: (marketplace: MarketplaceEnum, payload: IHeroItemsPayload) => {
    const baseUrl =
      marketplace === MarketplaceEnum.AMAZON
        ? AMAZON_CONFIGURATION_BASE_URL
        : WALMART_CONFIGURATION_BASE_URL;

    return axiosInstance.post<IHeroItemsSaveResponse>(
      `${baseUrl}/hero-items`,
      payload
    );
  },
};

export default ConfigurationsService;
