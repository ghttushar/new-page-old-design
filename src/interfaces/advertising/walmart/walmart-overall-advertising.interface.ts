import { IWalmartBiddingStrategyName } from 'src/interfaces/column.interface';
import { IAutomationRules } from '../amazon/sp-advertising.interface';
import { IWalmartMetricsExtended } from './walmart-advertising.interface';
import {
  IWalmartAdGroup,
  IWalmartAdItem,
  IWalmartCampaign,
  IWalmartKeywords,
  IWalmartPageType,
  IWalmartPlatform,
  IWalmartSearchTerms,
} from './walmart-sp-advertising.interface';

export interface IWalmartOverallCampaign
  extends IWalmartCampaign,
    IWalmartBiddingStrategyName,
    IWalmartMetricsExtended {}

export interface IWalmartOverallAdGroup
  extends IWalmartAdGroup,
    IWalmartMetricsExtended {}

export interface IWalmartOverallKeywords
  extends IWalmartKeywords,
    IWalmartMetricsExtended {}

// ---------------- Automation Rules -------------
export type IWalmartOverallAutomationRules = IAutomationRules;

export type IWalmartOverallAdvertisingData =
  | IWalmartOverallCampaign
  | IWalmartOverallAdGroup
  | IWalmartAdItem
  | IWalmartOverallKeywords
  | IWalmartPageType
  | IWalmartPlatform
  | IWalmartSearchTerms
  | IWalmartOverallAutomationRules;
