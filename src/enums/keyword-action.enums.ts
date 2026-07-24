export enum KeywordActionActionType {
  AUTO_TO_MANUAL = 'AUTO_TO_MANUAL',
  MANUAL_TO_MANUAL = 'MANUAL_TO_MANUAL',
  AUTO_TO_AUTO = 'AUTO_TO_AUTO',
  PCT_TO_PCT = 'PCT_TO_PCT',
  AUTO_TO_PCT = 'AUTO_TO_PCT',
}

export enum KeywordActionMatchType {
  EXACT = 'EXACT',
  PHRASE = 'PHRASE',
  BROAD = 'BROAD',
  NEGATIVE_EXACT = 'NEGATIVE_EXACT',
  NEGATIVE_PHRASE = 'NEGATIVE_PHRASE',
  ASIN_SAME_AS = 'ASIN_SAME_AS',
  NEGATIVE_ASIN_SAME_AS = 'NEGATIVE_ASIN_SAME_AS',
  ASIN_EXPANDED_FROM = 'ASIN_EXPANDED_FROM',
}

export enum KeywordActionDateRange {
  LAST_3_DAYS = 'LAST_3_DAYS',
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_14_DAYS = 'LAST_14_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
  LAST_60_DAYS = 'LAST_60_DAYS',
}

export enum KeywordActionsAction {
  ADDITION = 'ADDITION',
  NEGATION = 'NEGATION',
}
export enum TargetingActionTypeEnum {
  KEYWORD_ACTIONS = 'Keyword_Actions',
  PRODUCT_ACTIONS = 'Product_Actions',
}

export enum KeywordActionTabsEnum {
  KEYWORD_ADDITION_AMAZON = 'KEYWORD_ADDITION_AMAZON',
  KEYWORD_NEGATION_AMAZON = 'KEYWORD_NEGATION_AMAZON',
  PRODUCT_ADDITION_AMAZON = 'PRODUCT_ADDITION_AMAZON',
  PRODUCT_NEGATION_AMAZON = 'PRODUCT_NEGATION_AMAZON',
  HISTORY_AMAZON = 'HISTORY_AMAZON',
  ARCHIVE_AMAZON = 'ARCHIVE_AMAZON',
  KEYWORD_ADDITION_WALMART = 'KEYWORD_ADDITION_WALMART',
  HISTORY_WALMART = 'HISTORY_WALMART',
  ARCHIVE_WALMART = 'ARCHIVE_WALMART',
}

export enum KeywordState {
  ENABLED = 'ENABLED',
  PAUSED = 'PAUSED',
  ARCHIVED = 'ARCHIVED',
}

export enum WalmartKeywordState {
  ENABLED = 'enabled',
  PAUSED = 'paused',
  ARCHIVED = 'archived',
}

export enum KeywordActionPriority {
  HIGH = '0',
  MEDIUM = '1',
  LOW = '2',
  RELATED = '3',
}

export enum KeywordActionKeywordTagEnum {
  BRANDED = 'BRANDED',
  COMPETITOR = 'COMPETITOR',
  GENERIC = 'GENERIC',
}

export enum KeywordColumnEnum {
  SEARCH_TERM = 'Search Term',
  MATCH_TYPE = 'Match Type',
  KEYWORD = 'Keyword',
}
