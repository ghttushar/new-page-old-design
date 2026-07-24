import {
  AmazonAdvertisingTableTypesEnum,
  WalmartAdvertisingTableTypeEnum,
} from '@/enums/advertising.enums';
import { TargetingTypeEnum } from '@/enums/walmart.enums';
import {
  IAddedDataMatchType,
  ICreateProductName,
  ICustomBid,
  IEntityName,
  IId,
  INormalizedKeyword,
  IStatus,
  ISuggestedBid,
} from '@/interfaces/column.interface';
import {
  ISBAdGroup,
  ISBKeywordTargeting,
  ISBNegativeTargetingKeyword,
  ISBNegativeTargetingProduct,
  ISBProductTargeting,
} from '../amazon/sb-advertising.interface';
import { ISDAdGroup } from '../amazon/sd-advertising.interface';
import {
  IAdGroup,
  IKeywordTargeting,
  INegativeKeywordTargeting,
  INegativeProductTargeting,
  IProductTargeting,
} from '../amazon/sp-advertising.interface';
import {
  IWalmartAdGroup,
  IWalmartKeywords,
} from '../walmart/walmart-sp-advertising.interface';
import {
  IWalmartSVAdGroup,
  IWalmartSVKeywords,
} from '../walmart/walmart-sv-advertising.interface';

// Create Entity Dialog
export interface IAdvertisingCreateEntityDialogProps {
  openDialog: boolean;
  handleCloseDialog: () => void;
  selectedCampaignId: string | number;
  selectedAdGroupId: string | number;
  selectedAdGroup:
    | IWalmartAdGroup
    | IAdGroup
    | ISBAdGroup
    | ISDAdGroup
    | IWalmartSVAdGroup;
  selectedTitle: string;
  walmartTargeting?: TargetingTypeEnum;
}

export type IEntityTypes =
  | AmazonAdvertisingTableTypesEnum.PRODUCT_ADS
  | AmazonAdvertisingTableTypesEnum.KEYWORD_TARGETING
  | AmazonAdvertisingTableTypesEnum.PRODUCT_TARGETING
  | AmazonAdvertisingTableTypesEnum.NEGATIVE_TARGETING_KEYWORD
  | AmazonAdvertisingTableTypesEnum.NEGATIVE_TARGETING_PRODUCT
  | WalmartAdvertisingTableTypeEnum.AD_ITEM
  | WalmartAdvertisingTableTypeEnum.KEYWORD;

export type IKeywordTargetTypes =
  | IWalmartKeywords
  | IWalmartSVKeywords
  | IKeywordTargeting
  | ISBKeywordTargeting
  | INegativeKeywordTargeting
  | ISBNegativeTargetingKeyword;

export type IProductTargetTypes =
  | IProductTargeting
  | ISBProductTargeting
  | INegativeProductTargeting
  | ISBNegativeTargetingProduct;

export type IChipBasedEntityTypes = IKeywordTargetTypes | IProductTargetTypes;

export interface IAddedDataTableStatus extends IId, IStatus {}

export interface ICreateKeyword
  extends IAddedDataTableStatus,
    IEntityName,
    IAddedDataMatchType,
    ICustomBid,
    INormalizedKeyword,
    ISuggestedBid {}

export interface ICreateProductAds
  extends IAddedDataTableStatus,
    ICreateProductName,
    ICustomBid,
    ISuggestedBid {}
