import { ColumnNameEnum } from '@/enums/advertising.enums';
import { ENTITY_NAMES } from '@/enums/toast.enums';

export const ENTITY_TABLE_NAME_MAPPINGS = {
  [ENTITY_NAMES.CAMPAIGN]: ColumnNameEnum.CAMPAIGN,
  [ENTITY_NAMES.AD_GROUP]: ColumnNameEnum.ADGROUP,
  [ENTITY_NAMES.PRODUCT_AD]: ColumnNameEnum.PRODUCT_AD,
  [ENTITY_NAMES.AD_ITEM]: ColumnNameEnum.AD_NAME,
  [ENTITY_NAMES.KEYWORD]: ColumnNameEnum.KEYWORD,
  [ENTITY_NAMES.TARGET]: 'Target',
  [ENTITY_NAMES.BRAND_PROFILE]: ColumnNameEnum.CAMPAIGN,
  [ENTITY_NAMES.NEGATIVE_KEYWORD]: ColumnNameEnum.KEYWORD,
  [ENTITY_NAMES.NEGATIVE_PRODUCT]: 'Target',
  [ENTITY_NAMES.PAGE_TYPE]: ColumnNameEnum.CAMPAIGN,
  [ENTITY_NAMES.PLATFORM]: ColumnNameEnum.CAMPAIGN,
};
