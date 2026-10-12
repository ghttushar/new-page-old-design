/** How a change was made: one edit, many edits at once, a creation, or a rule or dayparting job running. */
export type LogType = 'SINGLE_EDIT' | 'BULK_EDIT' | 'CREATE' | 'EXECUTE';

/** One row of a bulk edit, shown in the popup. */
export interface IBulkChange {
  id: string;
  name: string;
  fieldName?: string;
  from: string;
  to: string;
}

/** What a create log shows in its popup: the created item as table data. */
export interface ICreatedTable {
  columns: string[];
  rows: string[][];
}

/** The rule or dayparting job an execute log links to. */
export interface IExecuteTarget {
  kind: 'RULE' | 'DAYPARTING_JOB';
  id: string;
  name: string;
}

export interface ILogsData {
  advertiserId?: string;
  profileId?: string;
  accountId?: string;
  logId: string;
  editedLevel?: string;
  actionType?: IActionType;
  campaignName?: string;
  campaignId?: string;
  campaignType?: string;
  ruleId?: string;
  adGroupId?: string;
  adGroupName?: string;
  targeting?: ITargeting;
  productAds?: IProductAds;
  adItems?: IAdItems;
  pageTypeMultiplier?: IPageTypeMultiplier;
  platformMultiplier?: IPlatformMultiplier;
  from?: string;
  to?: string;
  userName?: string;
  timestamp: string;
  logType?: LogType;
  /** Name shown in the Entity column; falls back to the id. For a bulk edit it reads like "100 campaigns". */
  entityName?: string;
  bulkChanges?: IBulkChange[];
  createdTable?: ICreatedTable;
  /** change-log columns that sit above the entity: where the change happened. */
  marketplace?: string;
  metaId?: string;
  metaType?: string;
  service?: string;
  /** meta_data, read into key and value pairs. */
  metaData?: Record<string, string>;
  executeTarget?: IExecuteTarget;
  /** Change log fields: entity_type, entity_id, action, field_name, previous_value, value, edit_source, user_id, changed_at. */
  entityType?: string;
  entityId?: string;
  action?: string;
  fieldName?: string;
  previousValue?: string;
  value?: string;
  editSource?: string;
  userId?: string;
  changedAt?: string;
}

export interface ITargeting {
  keyword?: IKeywordTargetingData;
  negativeKeyword?: INegativeKeywordTargetingData;
  product?: IProductAds;
}

export interface IPageTypeMultiplier {
  placementType?: string;
  multiplier?: number;
}

export interface IPlatformMultiplier {
  platformType?: string;
  multiplier?: number;
}
export interface IProductAds {
  adId?: string;
  asin?: string;
  id?: string;
  productName?: string;
}
interface IActionType {
  type: string;
  subType?: string;
}

export interface IAdItems {
  adItemId?: string;
  name?: string;
}
export interface IKeywordTargetingData {
  id?: number;
  name?: string;
  matchType?: string;
}
export interface INegativeKeywordTargetingData {
  id?: number;
  keywordText?: string;
  matchType?: string;
}
