import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import {
  KeywordActionActionType,
  KeywordActionDateRange,
  KeywordActionKeywordTagEnum,
  KeywordActionPriority,
  KeywordActionsAction,
  KeywordActionTabsEnum,
  KeywordState,
  TargetingActionTypeEnum,
  WalmartKeywordState,
} from 'src/enums/keyword-action.enums';
import { ISortCriteria } from './advertising/advertising.interface';
import { IAdMetrics } from './advertising/amazon/sp-advertising.interface';
import { IMultiSelectDropdownItem } from './dropdown.interfaces';

export type IKeywordActionResponse = Partial<IKeywordActionData>;

export interface ITargetCampaigns {
  targetCampaignId: string;
  targetCampaignName: string;
  targetAdGroups: ITargetAdGroups[];
}

export interface IMatchTypeToAdd {
  id: number;
  matchTypeToAdd: string;
  customBid: number;
}
export interface ITargetAdGroups {
  targetAdGroupId: string;
  targetAdGroupName: string;
  matchTypesToAdd: IMatchTypeToAdd[];
}

export interface IKeywordActionData extends IAdMetrics {
  id: number;
  priority: string;
  searchTerm: string;
  normalizedKeyword: string;
  sourceAdGroupId: string;
  sourceAdGroupName: string;
  sourceCampaignId: string;
  sourceCampaignName: string;
  targetCampaigns: ITargetCampaigns[];
  targetAdGroups: ITargetCampaigns[];
  matchTypeToAdd: string[];
  customBid: number;
  tag: KeywordActionKeywordTagEnum;
  adGroupCount: number;
  targetingActionType: TargetingActionTypeEnum;
}

export interface IProductActionsData extends IKeywordActionData {
  title: string;
  brandName: string;
  price: string;
  imageUrl: string;
  ratings: number;
  reviews: number;
}

export interface IMatchTypeToAdd {
  id: number;
  matchTypeToAdd: string;
  customBid: number;
}

export interface IKeywordActionFilter {
  actionType?: string;
  matchTypeToAdd?: string;
  dateRange?: string;
  action: KeywordActionsAction;
  additionFilter: {
    unitsSold?: number;
    acos?: number;
  };
}

export interface IKeywordAdditionBody {
  campaignId: string;
  adGroupId: string;
  keywordText: string;
  matchType: string;
  state: KeywordState.ENABLED;
  bid: number;
}

export interface IProductAdditionBody {
  campaignId: string | undefined;
  adGroupId: string;
  state: KeywordState;
  bid: number;
  expressionType: string;
  expression: {
    type: string;
    value: string;
  }[];
}

export interface ISelectedMatchTypeForProductAddition {
  bid: number;
  adGroups: IAmazonSelection[];
  matchType: IAmazonSelection;
  campaigns: IAmazonSelection[];
  searchTerm: string;
}

export interface IAmazonSelection {
  selected: boolean;
  value: string;
  label: string;
}

export interface IWalmartKeywordAdditionBody {
  campaignId: number;
  adGroupId: number;
  keywordText: string;
  matchType: string;
  state: WalmartKeywordState.ENABLED;
  bid: number;
}

export interface IKeywordNegationBody {
  campaignId: string;
  adGroupId: string;
  keywordText: string;
  matchType: string;
  state: KeywordState.ENABLED;
}

export interface IProductNegationBody {
  campaignId: string | undefined;
  adGroupId: string;
  state: string;
  expression: IExpression[];
}

export interface IExpression {
  type: string;
  value: string;
}

export interface ITargetingActionResponse {
  successCount: number;
  errorCount: number;
  errors: string[];
  partialFailure: boolean;
}

export interface IKeywordHistoryResponse {
  profileId: string;
  keywordId: string;
  userId: User;
  adGroupId: string;
  adGroupName: string;
  campaignId: string;
  campaignName: string;
  bid?: number;
  keywordText: string;
  matchType: string;
  createdAt: string;
  userName: string;
  reason: string;
  status: string;
}
export interface IProductHistoryResponse extends IKeywordHistoryResponse {
  title: string;
  brandName: string;
  price: number;
  ratings: number;
  reviews: number;
}

interface User {
  _id: string;
  firstName: string;
}

export interface ISelectedMatchTypeForKeywordAddition
  extends ISelectedMatchTypeForKeywordNegation {
  bid: number;
}

export interface ISelectedMatchTypeForKeywordNegation
  extends ISelectedSearchTermsToArchive {
  campaigns: IMultiSelectDropdownItem[];
}

export interface ISelectedSearchTermsToArchive {
  searchTerm: string;
  matchType: IMultiSelectDropdownItem;
  adGroups: IMultiSelectDropdownItem[];
  dateRange?: KeywordActionDateRange;
}

export interface IArchiveSearchTermsPayload {
  searchTerm: string;
  matchType: string;
  adGroupId: string;
  dateRange?: KeywordActionDateRange;
}

export interface IGetArchiveSearchTermData extends IArchiveSearchTermsPayload {
  id?: number;
  userId: string;
  userName?: string;
  profileId: string;
  adGroupName: string;
  campaignName: string;
  createdAt: string;
}
export interface IArchiveProductData extends IGetArchiveSearchTermData {
  title: string;
  brandName: string;
  price: string;
  imageUrl: string;
  ratings: number;
  reviews: number;
}

export interface IDownloadPayload {
  isDownload: boolean;
  downloadWithFilter?: boolean;
}

export interface IGetArchiveSearchTermPayload
  extends IColumnSort,
    IPagination,
    ISearchText,
    IDownloadPayload {}

export interface IColumnSort {
  sortCriteria: Array<ISortCriteria>;
}

export interface IPagination {
  page: number;
  pageSize: number;
}

export interface ISearchText {
  searchText: string;
}

export interface IKeywordHistoryData
  extends IColumnSort,
    IPagination,
    ISearchText {}

export interface IUpdateTaggingResponse {
  profileId: string;
  searchTerm: string;
  adGroupCount: number;
  tag: KeywordActionKeywordTagEnum;
}

export interface IUpdateTaggingPayload {
  searchTerm: string;
  tag: KeywordActionKeywordTagEnum;
}

export interface IKeywordActionFilterForm {
  actionType: IDropdownItem<KeywordActionActionType>;
  dateRange: IDropdownItem<KeywordActionDateRange>;
  priority: IDropdownItem<KeywordActionPriority>;
}

export interface IKeywordActionTableFilter {
  label: string;
  labelValue: string;
  arithmeticSymbol: string;
  filterValue: string;
}

export interface IMultiSelectDropdownItemPayload {
  options: IMultiSelectDropdownItem[];
  rowId: number;
}

export interface IKeywordBidPayload {
  bids: number[];
  rowId: number;
}

export interface IKeywordActionFilterTableForm {
  [key: string]: IKeywordActionTableFilter;
}

export interface IKeywordActionFilterOptions {
  actionType: IDropdownItem<KeywordActionActionType>[];
  dateRange: IDropdownItem<KeywordActionDateRange>[];
  priority: IDropdownItem<KeywordActionPriority>[];
}

export interface IKeywordActionFilterState {
  actionTypeFilters: IKeywordActionFilterForm;
  appliedFilters: IKeywordActionFilterForm;
  options: IKeywordActionFilterOptions;
  tableData: IKeywordActionData[];
  updatedTableData: IKeywordActionData[];
  isApplyDisabled: boolean;
  selectedColumns: ColumnDef<IKeywordActionData>[];
  targetCampaigns: IMultiSelectDropdownItem[][];
  matchTypeToAdd: IMultiSelectDropdownItem[][];
  targetAdGroups: IMultiSelectDropdownItem[][];
  keywordBid: number[][];
  initialKeywordBid: number[][];
  selectedRowIds: RowSelectionState;
  trigger: boolean;
  isRowEdited: boolean;
  selectedTab: KeywordActionTabsEnum;
  selectedTagId: number | null;
  bidErrorMessage: string | null;
}
