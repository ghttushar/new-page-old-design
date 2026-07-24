import { ENTITY_NAMES } from '@/enums/toast.enums';

export interface IAPIResponse<T> {
  success: boolean;
  error: boolean;
  message: string;
  description?: string;
  data: T;
}

export interface IErrorResultDetails {
  successCount: number;
  errorCount: number;
  metaField: TEntityNames;
  errors: IParsedError[];
  partialFailure: boolean;
}

export interface IParsedError<T = unknown> {
  metaId: string | null | undefined;
  entityName: string | null | undefined;
  reason: string;
  message: string;
  details?: T;
}

export type TEntityNames =
  | ENTITY_NAMES.CAMPAIGN
  | ENTITY_NAMES.AD_GROUP
  | ENTITY_NAMES.PRODUCT_AD
  | ENTITY_NAMES.KEYWORD
  | ENTITY_NAMES.TARGET
  | ENTITY_NAMES.AD_ITEM
  | ENTITY_NAMES.BRAND_PROFILE
  | ENTITY_NAMES.NEGATIVE_KEYWORD
  | ENTITY_NAMES.NEGATIVE_PRODUCT
  | ENTITY_NAMES.PAGE_TYPE
  | ENTITY_NAMES.PLATFORM;
