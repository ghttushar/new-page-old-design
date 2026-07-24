export enum TargetMatchTypeEnum {
  ASIN_SAME_AS = 'ASIN_SAME_AS',
  ASIN_EXPANDED_FROM = 'ASIN_EXPANDED_FROM',
  NEGATIVE_ASIN_SAME_AS = 'NEGATIVE_ASIN_SAME_AS',
}

export enum ConfigurationColumnNameEnum {
  SOURCE_AD_GROUP = 'Source AdGroup',
  TARGET_AD_GROUP = 'Target AdGroup',
  MATCH_TYPE = 'Match Type',
  EXCLUDE_BRANDED = 'Exclude Branded',
}

export enum ConfigurationEnum {
  HERO_ITEMS = 'Hero Items',
}

export enum ConfigurationTableTitlesEnum {
  SOURCE_TARGET_MAPPING = 'configuration_table',
  HERO_ITEMS = 'hero_items_table',
}

export enum ConfigurationAdTypeEnum {
  SP = 'sp',
  SB = 'sb',
  SD = 'sd',
}

export enum ConfigurationTargetingTypeEnum {
  AUTO = 'AUTO',
  MANUAL = 'MANUAL',
  PCT = 'PCT',
}

export enum ConfigurationSourceTargetingSearchConfigEnum {
  ADGROUP_ID = 'adGroupId',
  ADGROUP_NAME = 'adGroupName',
}

export enum ConfigurationSourceTargetingMetaDataConfigEnum {
  ADGROUP_STATUS = 'adGroupStatus',
  AD_TYPE = 'adType',
  TARGETING_TYPE = 'targetingType',
}

export enum ConfigurationSourceTargetingFilterValueEnum {
  ADGROUP_STATUS = 'adGroupStatus',
  TARGETING_TYPE = 'targetingType',
}
