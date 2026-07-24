import {
  IAdGroupId,
  IAdGroupStatus,
  IAdId,
  IAdName,
  IAmazonItemName,
  IAsin,
  IBidOptimization,
  IBsonId,
  IBudgetColumn,
  ICampaignId,
  ICampaignStatus,
  ICostType,
  ICreativeType,
  IDefaultBid,
  IDeliveryProfile,
  IEditableAdGroupName,
  IEditableCampaignName,
  IEndDateColumn,
  IId,
  IListingPrice,
  INudgeNotificationData,
  IProfileId,
  IRuleAutomationStatus,
  ISDCreativeId,
  ISDCreativeProperties,
  ISDProductLandingPageType,
  ISDProductLandingPageUrl,
  IStartDate,
  IStatus,
  ITableStatus,
  ITactic,
  ITagId,
  ITagName,
} from '../../column.interface';
import { IAdMetrics, IAutomationRules } from './sp-advertising.interface';

export interface ILogoCropCoordinates {
  top: number;
  left: number;
  width: number;
  height: number;
  _id?: string;
}
export interface ICreativeBrandLogo {
  assetId: string;
  assetVersion: string;
  croppingCoordinates: ILogoCropCoordinates;
}

export interface ICreativeVideo {
  assetId: string;
  assetVersion: string;
}

// -------------- Campaign ---------------
export interface ISDCampaign
  extends IAdMetrics,
    IProfileId,
    IId,
    IBsonId,
    ICampaignId,
    IEditableCampaignName,
    IStatus,
    IStartDate,
    IEndDateColumn,
    IBudgetColumn,
    ICostType,
    ITactic,
    IDeliveryProfile,
    ITableStatus,
    INudgeNotificationData,
    IRuleAutomationStatus,
    ITagId,
    ITagName {}

// -------------- Ad Group ---------------
export interface ISDAdGroup
  extends IAdMetrics,
    IProfileId,
    IId,
    IBsonId,
    ICampaignId,
    IEditableCampaignName,
    ICampaignStatus,
    IAdGroupId,
    IEditableAdGroupName,
    IStatus,
    IDefaultBid,
    ITactic,
    IBidOptimization,
    ICostType,
    ICreativeType,
    ITableStatus {}

// -------------- Product Ads ---------------
export interface ISDProductAds
  extends IAdMetrics,
    IProfileId,
    IId,
    IBsonId,
    ICampaignId,
    IEditableCampaignName,
    ICampaignStatus,
    IAdGroupId,
    IEditableAdGroupName,
    IAdGroupStatus,
    IStatus,
    IAdId,
    IAdName,
    IAsin,
    IAmazonItemName,
    IListingPrice,
    ISDProductLandingPageType,
    ISDProductLandingPageUrl,
    ITableStatus,
    ICostType {}

// --------------- Creative ----------------
export interface ISDCreative
  extends IId,
    IBsonId,
    IAdGroupId,
    IStatus,
    ISDCreativeId,
    ISDCreativeProperties,
    ITableStatus {}

// ---------------- Automation Rules -------------
export type ISDAutomationRules = IAutomationRules;

export type ISDAdvertisingData =
  | ISDCampaign
  | ISDAdGroup
  | ISDProductAds
  | ISDCreative
  | ISDAutomationRules;
