import { RuleAutomationStatusEnum } from '@/enums/advertising.enums';
import { IEditAccessArrayData } from '../advertising/advertising.interface';
import { IDynamicBidding } from '../advertising/amazon/sp-advertising.interface';
import { Nullable } from '../index.interface';
import { IParsedError } from '../service.interface';
import {
  IBidderAutoTargetUpdate,
  IBidderUpdate,
  IBidderWalmartProductUpdate,
} from './bidder.interface';

// Campaign ------------------------
export interface IEditAccessCampaign {
  id: string;
  campaignId: string;
  entityName: string;
  name?: string;
  endDate?: string | null;
  state?: string;
  budget?:
    | {
        budget: number;
      }
    | number;
  dynamicBidding?: IDynamicBidding;
  automationStatus?: RuleAutomationStatusEnum;
  tagId?: Nullable<string>;
}
export interface IEditAccessWalmartCampaign {
  id: string;
  campaignId: string;
  entityName: string;
  name?: string;
  endDate?: string | null;
  status?: string;
  dailyBudget?: number | null;
  totalBudget?: number | null;
  campaignOptions?: string[] | null;
  automationStatus?: RuleAutomationStatusEnum;
  tagId?: Nullable<string>;
}

export interface IEditAccessCampaignUpdateBody {
  campaigns: IEditAccessCampaign[];
}

// Ad Group -----------------------
export interface IEditAccessAdGroup {
  id: string;
  adGroupId: string;
  campaignId: string;
  entityName: string;
  state?: string;
  defaultBid?: number;
  name?: string;
}
export interface IEditAccessWalmartAdGroup {
  id: string;
  adGroupId: string;
  entityName: string;
  status?: string;
  name?: string;
}

export interface IEditAccessAdGroupUpdateBody {
  adGroups?: IEditAccessAdGroup[];
}

// Product Ads -----------------------
export interface IEditAccessAdProduct {
  id: string;
  adId: string;
  adGroupId: string;
  campaignId: string;
  entityName: string;
  state?: string;
}
export interface IEditAccessWalmartAdItem {
  id: string;
  campaignId: string;
  adGroupId: string;
  itemId: string;
  adItemId: string;
  entityName: string;
  status?: string;
  bid?: number;
}

export interface IEditAccessAdProductUpdateBody {
  productAds: IEditAccessAdProduct[];
}

export interface IEditAccessWalmartAdItemUpdateBody {
  adItems?: IEditAccessWalmartAdItem[];
}

// Create Ad Product -----------------------
export interface IEditAccessCreateAdProduct {
  campaignId: string;
  adGroupId: string;
  entityName: string;
  state: string;
  asin?: string;
  sku?: string | null;
}
export interface IEditAccessCreateWalmartAdItem {
  campaignId: string;
  adGroupId: string;
  status: string;
  itemId: string;
  entityName: string;
  bid?: number;
}

export interface IEditAccessCreateAdProductBody {
  productAds: IEditAccessCreateAdProduct[];
}

// Keyword Targeting -----------------------
export interface IEditAccessKeywordTargeting {
  id: string;
  adGroupId: string;
  campaignId: string;
  keywordId: string;
  entityName: string;
  state?: string;
  bid?: number;
  type: string;
}
export interface IEditAccessWalmartKeywordTargeting {
  id: string;
  keywordId: number;
  entityName: string;
  state?: string;
  bid?: number;
}

export interface IEditAccessKeywordTargetingUpdateBody {
  keywordTargets?: IEditAccessKeywordTargeting[];
}
export interface IEditAccessWalmartKeywordTargetingUpdateBody {
  keywords?: IEditAccessWalmartKeywordTargeting[];
}

// Create Keyword Targeting ----------------
export interface IEditAccessCreateKeywordTargeting {
  campaignId: string;
  adGroupId: string;
  state: string;
  keywordText: string;
  entityName: string;
  matchType: string;
  bid: number;
}

export interface IEditAccessWalmartCreateKeywordTargeting {
  campaignId: string;
  adGroupId: string;
  state: string;
  keywordText: string;
  entityName: string;
  matchType: string;
  bid: number;
}

export interface IEditAccessCreateKeywordTargetingBody {
  keywordTargets: IEditAccessCreateKeywordTargeting[];
}

// Product Targeting -----------------------
export interface IEditAccessProductTargeting {
  id: string;
  adGroupId: string;
  campaignId: string;
  targetId: string;
  entityName: string;
  state?: string;
  bid?: number;
}

export interface IEditAccessProductTargetingUpdateBody {
  productTargets?: IEditAccessProductTargeting[];
}

// Create Product Targeting ------------------
export interface IEditAccessCreateProductTargeting {
  campaignId: string;
  adGroupId: string;
  entityName: string;
  expressionType: string;
  bid: number;
  state: string;
  expression: [
    {
      type: string;
      value: string;
    }
  ];
}

export interface IEditAccessCreateProductTargetingBody {
  productTargets: IEditAccessCreateProductTargeting[];
}

// Neg Product Targeting ------------------------
export interface IEditAccessNegProductTargeting {
  id: string;
  adGroupId: string;
  campaignId: string;
  targetId: string;
  entityName: string;
  state?: string;
  expression?: [
    {
      value: string;
    }
  ];
}

export interface IEditAccessNegProductTargetingUpdateBody {
  negativeProducts: IEditAccessNegProductTargeting[];
}

// Create Neg Product Targeting --------------------
export interface IEditAccessCreateNegProductTargeting {
  campaignId: string;
  adGroupId: string;
  entityName: string;
  state: string;
  expression: [
    {
      type: string;
      value: string;
    }
  ];
}

export interface IEditAccessCreateNegProductTargetingBody {
  negativeProducts: IEditAccessCreateNegProductTargeting[];
}

// Neg Keyword Targeting --------------------
export interface IEditAccessNegKeywordTargeting {
  id: string;
  adGroupId: string;
  campaignId: string;
  keywordId: string;
  entityName: string;
  state?: string;
}

export interface IEditAccessNegKeywordTargetingUpdateBody {
  negativeKeywords: IEditAccessNegKeywordTargeting[];
}

// Create Neg Keyword Targeting ------------------
export interface IEditAccessCreateNegKeywordTargeting {
  campaignId: string;
  adGroupId: string;
  entityName: string;
  state: string;
  keywordText: string;
  matchType: string;
}

export interface IEditAccessCreateNegKeywordTargetingBody {
  negativeKeywords: IEditAccessCreateNegKeywordTargeting[];
}

// Page Type -----------------------
export interface IEditAccessWalmartPageType {
  id: string;
  campaignId?: string;
  placementType?: string;
  entityName: string;
  multiplier?: number;
}

// Platform Type -----------------------
export interface IEditAccessWalmartPlatform {
  id: string;
  campaignId?: string;
  platformType?: string;
  entityName: string;
  multiplier?: number;
}

// Brand Profile
export interface IEditAccessWalmartBrandProfile {
  campaignId: string;
  adGroupId: string;
  entityName: string;
  clickUrl: string;
  headlineText: string;
  searchAmpName: string;
  sbaProfileId: string;
}

// Campaign Rules -----------------------
export interface IEditAccessAutomationRules {
  id: string;
  campaignId: string;
  ruleId: string;
  status?: string;
}

export interface IEditAccessSBKeywordTargetingUpdateBody {
  keywords?: IEditAccessKeywordTargeting[];
}

export interface IEditAccessSBAdGroupUpdateBody {
  adGroups?: IEditAccessAdGroup[];
}

export interface IEditAccessSBProductTargetingUpdateBody {
  targets?: IEditAccessProductTargeting[];
}

export interface IEditAccessSDAdGroupUpdateBody {
  adGroups?: IEditAccessAdGroup[];
}

export interface IEditAccessWalmartAdGroupUpdateBody {
  adGroups?: IEditAccessWalmartAdGroup[];
}

export interface IEditAccessAutomationRulesUpdateBody {
  automation: Array<IEditAccessAutomationRules>;
}

export interface IErrorMessageDetails {
  errorList: IParsedError[];
  editedRows: any[]; // IEditAccessPayloadInterfaces
}

export type IEditAccessPayloadInterfaces =
  | IEditAccessCampaign
  | IEditAccessWalmartCampaign
  | IEditAccessAdGroup
  | IEditAccessWalmartAdGroup
  | IBidderUpdate
  | IBidderWalmartProductUpdate
  | IBidderAutoTargetUpdate
  | IEditAccessAdProduct
  | IEditAccessWalmartAdItem
  | IEditAccessKeywordTargeting
  | IEditAccessWalmartKeywordTargeting
  | IEditAccessProductTargeting
  | IEditAccessNegProductTargeting
  | IEditAccessNegKeywordTargeting
  | IEditAccessWalmartPageType
  | IEditAccessWalmartPlatform;

export interface IEditBulkActionProp {
  setTableData: React.Dispatch<React.SetStateAction<IEditAccessArrayData>>;
}
