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
} from './walmart-sp-advertising.interface';

export interface IWalmartSVCampaign
  extends IWalmartCampaign,
    IWalmartMetricsExtended,
    IWalmartBiddingStrategyName {}

export interface IWalmartSVAdGroup
  extends IWalmartAdGroup,
    IWalmartMetricsExtended {}

export interface IWalmartSVKeywords
  extends IWalmartKeywords,
    IWalmartMetricsExtended {}

// ---------------- Automation Rules -------------
export type IWalmartSVAutomationRules = IAutomationRules;

export type IWalmartSVAdvertisingData =
  | IWalmartSVCampaign
  | IWalmartSVAdGroup
  | IWalmartAdItem
  | IWalmartSVKeywords
  | IWalmartPageType
  | IWalmartPlatform
  | IWalmartSVAutomationRules;
