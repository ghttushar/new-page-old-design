import { IAutomationRules } from '../amazon/sp-advertising.interface';
import {
  IWalmartAdGroup,
  IWalmartAdItem,
  IWalmartCampaign,
  IWalmartKeywords,
  IWalmartPageType,
  IWalmartPlatform,
} from './walmart-sp-advertising.interface';

export interface IWalmartBrandProfile {
  advertiserId: string;
  campaignId: string;
  campaignName: string;
  adGroupId: string;
  adGroupName: string;
  status: string;
  logoUrl: string;
  clickUrl: string;
  reviewStatus: string;
  reviewReason: string | null;
  headlineText: string;
  searchAmpName: string;
  sbaProfileId: string;
}

// ---------------- Automation Rules -------------
export type IWalmartSBAutomationRules = IAutomationRules;

export type IWalmartSBAdvertisingData =
  | IWalmartCampaign
  | IWalmartAdGroup
  | IWalmartAdItem
  | IWalmartKeywords
  | IWalmartPageType
  | IWalmartPlatform
  | IWalmartSBAutomationRules;
