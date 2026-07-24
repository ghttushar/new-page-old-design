import { ENTITY_TABLE_NAME_MAPPINGS } from '@/constants/toast-message/toast.constants';
import {
  IErrorResultDetails,
  TEntityNames,
} from '@/interfaces/service.interface';

export const checkErrorDetailsExist = (
  error: IErrorResultDetails | null | undefined
) => {
  return error && error.errors.length > 0 && error.errorCount > 0;
};

export const getMetaFieldBasedCampaignName = (metaField: TEntityNames) => {
  if (!metaField) return '';
  return ENTITY_TABLE_NAME_MAPPINGS[metaField];
};
