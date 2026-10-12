export const ACTION_TYPE_MAPPING: { [key: string]: string } = {
  state: 'Status',
  name: 'Name',
  defaultBid: 'Default Bid',
  bid: 'Bid',
  endDate: 'End Date',
  platformType: 'Platform',
  placementType: 'Placement',
};

export const SUB_TYPE_MAPPING: { [key: string]: string } = {
  PLACEMENT_REST_OF_SEARCH: 'Rest Of Search',
  PLACEMENT_PRODUCT_PAGE: 'Product Pages',
  PLACEMENT_TOP: 'Top Of Search',
};

/** The kinds of change the Logs table shows, as the change log stores them in entity_type. */
export const LOG_ENTITY_TYPES: { [key: string]: string } = {
  CAMPAIGN: 'Campaign',
  AD_GROUP: 'Ad group',
  KEYWORD: 'Keyword',
  NEGATIVE_KEYWORD: 'Negative keyword',
  TARGET: 'Target',
  NEGATIVE_TARGET: 'Negative target',
  PRODUCT_AD: 'Product ad',
  BID_MULTIPLIER: 'Bid multiplier',
  BRAND_PROFILE: 'Brand profile',
  RULE: 'Rule',
  DAYPARTING_JOB: 'Dayparting job',
};

/** Where a change was made from, as the change log's edit_source stores it. */
export const LOG_SOURCE_LABELS: { [key: string]: string } = {
  campaign_manager: 'Anarix - Campaign Manager',
  campaign_creator: 'Anarix - Campaign Creator',
  rules: 'Anarix - Rules',
  chatbot: 'Anarix - Jiva',
  slack_bot_rules: 'Slack bot - Jiva - Anarix - Rules',
  slack_bot_campaign_creator: 'Slack bot - Jiva - Anarix - Campaign Creator',
  claude_rules: 'Claude - Jiva - Anarix - Rules',
};

/** Shows sample rows while the change-log endpoint has nothing to return. */
export const SHOW_SAMPLE_LOGS = true;
