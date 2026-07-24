import {
  SpNegTargetingKeywordMatchTypes,
  SpTargetingKeywordMatchTypes,
} from '@/enums/advertising.enums';
import {
  ConfigurationTargetingTypeEnum,
  TargetMatchTypeEnum,
} from '@/enums/configurations.enum';

export type AllMatchTypes =
  | SpTargetingKeywordMatchTypes
  | SpNegTargetingKeywordMatchTypes
  | TargetMatchTypeEnum;

const KEYWORD_POSITIVE_MATCH_TYPES: AllMatchTypes[] = [
  SpTargetingKeywordMatchTypes.BROAD,
  SpTargetingKeywordMatchTypes.EXACT,
  SpTargetingKeywordMatchTypes.PHRASE,
];

const KEYWORD_NEGATIVE_MATCH_TYPES: AllMatchTypes[] = [
  SpNegTargetingKeywordMatchTypes.NEG_EXACT,
  SpNegTargetingKeywordMatchTypes.NEG_PHRASE,
];

const ASIN_POSITIVE_MATCH_TYPES: AllMatchTypes[] = [
  TargetMatchTypeEnum.ASIN_SAME_AS,
  TargetMatchTypeEnum.ASIN_EXPANDED_FROM,
];

const ASIN_NEGATIVE_MATCH_TYPES: AllMatchTypes[] = [
  TargetMatchTypeEnum.NEGATIVE_ASIN_SAME_AS,
];

export const MATCH_TYPE_LABELS: Record<AllMatchTypes, string> = {
  [SpTargetingKeywordMatchTypes.BROAD]: 'Broad',
  [SpTargetingKeywordMatchTypes.EXACT]: 'Exact',
  [SpTargetingKeywordMatchTypes.PHRASE]: 'Phrase',
  [SpNegTargetingKeywordMatchTypes.NEG_EXACT]: 'Negative Exact',
  [SpNegTargetingKeywordMatchTypes.NEG_PHRASE]: 'Negative Phrase',
  [TargetMatchTypeEnum.ASIN_SAME_AS]: 'Asin Same As',
  [TargetMatchTypeEnum.ASIN_EXPANDED_FROM]: 'Asin Expanded From',
  [TargetMatchTypeEnum.NEGATIVE_ASIN_SAME_AS]: 'Negative Asin Same As',
};

export const getAvailableMatchTypes = (
  sourceTargetingType: ConfigurationTargetingTypeEnum | undefined,
  targetTargetingType: ConfigurationTargetingTypeEnum | undefined
): AllMatchTypes[] => {
  if (!sourceTargetingType || !targetTargetingType) return [];

  if (
    sourceTargetingType === ConfigurationTargetingTypeEnum.MANUAL &&
    targetTargetingType === ConfigurationTargetingTypeEnum.MANUAL
  ) {
    return [...KEYWORD_POSITIVE_MATCH_TYPES, ...KEYWORD_NEGATIVE_MATCH_TYPES];
  }

  if (
    sourceTargetingType === ConfigurationTargetingTypeEnum.AUTO &&
    targetTargetingType === ConfigurationTargetingTypeEnum.MANUAL
  ) {
    return KEYWORD_POSITIVE_MATCH_TYPES;
  }

  if (
    sourceTargetingType === ConfigurationTargetingTypeEnum.AUTO &&
    targetTargetingType === ConfigurationTargetingTypeEnum.PCT
  ) {
    return ASIN_POSITIVE_MATCH_TYPES;
  }

  if (
    sourceTargetingType === ConfigurationTargetingTypeEnum.PCT &&
    targetTargetingType === ConfigurationTargetingTypeEnum.PCT
  ) {
    return [...ASIN_POSITIVE_MATCH_TYPES, ...ASIN_NEGATIVE_MATCH_TYPES];
  }

  if (
    sourceTargetingType === ConfigurationTargetingTypeEnum.AUTO &&
    targetTargetingType === ConfigurationTargetingTypeEnum.AUTO
  ) {
    return [...KEYWORD_NEGATIVE_MATCH_TYPES, ...ASIN_NEGATIVE_MATCH_TYPES];
  }

  return [];
};
