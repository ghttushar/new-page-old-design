import {
  CountryCodeEnum,
  SpNegTargetingKeywordMatchTypes,
  SpTargetingKeywordMatchTypes,
} from '@/enums/advertising.enums';
import {
  ConfigurationAdTypeEnum,
  ConfigurationTargetingTypeEnum,
  TargetMatchTypeEnum,
} from '@/enums/configurations.enum';
import { IAPIResponse } from './service.interface';

export interface IGenerateSourceTargetMapping {
  mappingId: string;
  sourceCampaignId: string;
  sourceAdGroupId: string;
  sourceAdGroupName: string;
  targetCampaignId: string;
  targetAdGroupId: string;
  targetAdGroupName: string;
  matchTypes: (
    | SpTargetingKeywordMatchTypes
    | SpNegTargetingKeywordMatchTypes
    | TargetMatchTypeEnum
  )[];
  matchTypesToNegate?: SpNegTargetingKeywordMatchTypes[];
  brandedKeywordExcluded?: boolean;
  sourceCampaignTargetingType: ConfigurationTargetingTypeEnum | string;
  targetCampaignTargetingType: ConfigurationTargetingTypeEnum | string;
  adType: ConfigurationAdTypeEnum | string;
}

export interface IAdGroupResponse {
  adGroupId: string;
  adGroupName: string;
  adGroupStatus: string;
  adType: ConfigurationAdTypeEnum;
  targetingType: ConfigurationTargetingTypeEnum;
  campaignId?: string;
}

export enum TargetProfitMarginTypeEnum {
  PROFIT_PERCENTAGE = 'PROFIT_PERCENTAGE',
  ABSOLUTE_PROFIT = 'ABSOLUTE_PROFIT',
}

export enum MetricValueTypeEnum {
  PERCENTAGE = 'percentage',
  ABSOLUTE = 'absolute',
}

export interface IMetricsConfiguration {
  budget: number;
  budgetType?: string;
  tacosTargetValue?: number;
  tacosTargetType?: 'percentage';
  roasTargetValue?: number;
  roasTargetType?: string;
  targetProfitMarginValue?: number;
  targetProfitMarginType?: MetricValueTypeEnum;
  targetProfitMarginCurrency?: string;
  targetRevenue: number;
  targetRevenueType: string;
}

export interface IMetricsConfigurationPayload {
  budget: number;
  budgetType: string;
  tacosTargetValue?: number;
  tacosTargetType?: 'percentage';
  roasTargetValue?: number;
  roasTargetType?: string;
  targetProfitMarginValue?: number;
  targetProfitMarginType?: MetricValueTypeEnum;
  targetProfitMarginCurrency?: string;
  targetRevenue: number;
  targetRevenueType: CountryCodeEnum;
}

export type IMetricsConfigurationResponse = IAPIResponse<IMetricsConfiguration>;
export type IMetricsConfigurationSaveResponse = IAPIResponse<void>;

// Hero Items Interfaces
export interface IHeroItem {
  // Amazon fields
  asin?: string;
  productName?: string | null;

  // Walmart fields
  itemId?: string;
  sku?: string | null;

  // Common fields
  entityId?: string;
  entityName?: string;
  imageUrl?: string;
  itemImageUrl?: string;
}

export interface IHeroItemsPayload {
  insert: string[];
  delete: string[];
}

// API returns array directly in data field
export type IHeroItemsApiResponse = IAPIResponse<IHeroItem[]>;
export type IHeroItemsSaveResponse = IAPIResponse<void>;

export type IGenerateSourceTargetMappingResponse = IAPIResponse<
  IGenerateSourceTargetMapping[]
>;
export type IAdGroupListResponse = IAPIResponse<IAdGroupResponse[]>;
export interface IUpsertSourceTargetMappingPayload {
  upsert: IGenerateSourceTargetMapping[];
  delete: string[];
}

export type IUpsertSourceTargetMappingResponse = IAPIResponse<void>;
export type ISourceTargetMappingResponse = IAPIResponse<
  IGenerateSourceTargetMapping[]
>;

export type AllMatchTypes =
  | SpTargetingKeywordMatchTypes
  | SpNegTargetingKeywordMatchTypes
  | TargetMatchTypeEnum;
