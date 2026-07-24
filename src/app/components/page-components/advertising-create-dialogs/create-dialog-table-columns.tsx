import {
  ADD_ITEM_ACTION_COLUMN,
  ADDED_MATCH_TYPE_COLUMN,
  CREATE_ENTITY_STATUS_COLUMN,
  CREATE_KEYWORD_COLUMN,
  CREATE_PRODUCT_ASIN_COLUMN,
  CREATE_PRODUCT_NAME_COLUMN,
  CUSTOM_BID_COLUMN,
  NORMALIZED_KEYWORD_LIST_COLUMN,
  REMOVE_ACTION_COLUMN,
  SUGGESTED_BID_COLUMN,
} from '@/constants/table-columns/ads-create-dialog-table-columns.constants';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { ISBAdGroup } from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { ISDAdGroup } from '@/interfaces/advertising/amazon/sd-advertising.interface';
import { IAdGroup } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  ICreateKeyword,
  ICreateProductAds,
} from '@/interfaces/advertising/create-dialog/create-dialog.interface';
import { IWalmartAdGroup } from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { IWalmartSVAdGroup } from '@/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import { ColumnDef } from '@tanstack/react-table';

export const amazonSPCreateKeywordColumns = (
  selectedAdGroup: IAdGroup | ISBAdGroup | ISDAdGroup | null,
  updateFunction: (
    id: string | number,
    customBid: number | typeof NaN | undefined,
    status: string | undefined
  ) => void,
  handleClearItem: (id: string | number) => void
): Array<ColumnDef<ICreateKeyword>> =>
  [
    CREATE_ENTITY_STATUS_COLUMN(updateFunction),
    CREATE_KEYWORD_COLUMN,
    ADDED_MATCH_TYPE_COLUMN,
    CUSTOM_BID_COLUMN(selectedAdGroup, updateFunction),
    REMOVE_ACTION_COLUMN(handleClearItem),
  ] as Array<ColumnDef<ICreateKeyword>>;

export const amazonSBCreateKeywordColumns = (
  selectedAdGroup: IAdGroup | ISBAdGroup | ISDAdGroup | null,
  updateFunction: (
    id: string | number,
    customBid: number | typeof NaN | undefined,
    status: string | undefined
  ) => void,
  handleClearItem: (id: string | number) => void
): Array<ColumnDef<ICreateKeyword>> =>
  [
    CREATE_KEYWORD_COLUMN,
    ADDED_MATCH_TYPE_COLUMN,
    CUSTOM_BID_COLUMN(selectedAdGroup, updateFunction),
    REMOVE_ACTION_COLUMN(handleClearItem),
  ] as Array<ColumnDef<ICreateKeyword>>;

export const walmartCreateKeywordColumns = (
  selectedAdGroup: IWalmartAdGroup | IWalmartSVAdGroup | null,
  updateFunction: (
    id: string | number,
    customBid: number | typeof NaN | undefined,
    status: string | undefined
  ) => void,
  handleClearItem: (id: string | number) => void
): Array<ColumnDef<ICreateKeyword>> =>
  [
    CREATE_ENTITY_STATUS_COLUMN(updateFunction),
    CREATE_KEYWORD_COLUMN,
    NORMALIZED_KEYWORD_LIST_COLUMN,
    ADDED_MATCH_TYPE_COLUMN,
    SUGGESTED_BID_COLUMN,
    CUSTOM_BID_COLUMN(selectedAdGroup, updateFunction),
    REMOVE_ACTION_COLUMN(handleClearItem),
  ] as Array<ColumnDef<ICreateKeyword>>;

export const amazonSPCreateProductTargetsColumns = (
  selectedAdGroup: IAdGroup | ISBAdGroup | ISDAdGroup | null,
  updateFunction: (
    id: string | number,
    customBid: number | typeof NaN | undefined,
    status: string | undefined
  ) => void,
  handleClearItem: (id: string | number) => void
): Array<ColumnDef<ICreateKeyword>> =>
  [
    CREATE_ENTITY_STATUS_COLUMN(updateFunction),
    CREATE_PRODUCT_ASIN_COLUMN,
    ADDED_MATCH_TYPE_COLUMN,
    CUSTOM_BID_COLUMN(selectedAdGroup, updateFunction),
    REMOVE_ACTION_COLUMN(handleClearItem),
  ] as Array<ColumnDef<ICreateKeyword>>;

export const amazonSBCreateProductTargetsColumns = (
  selectedAdGroup: IAdGroup | ISBAdGroup | ISDAdGroup | null,
  updateFunction: (
    id: string | number,
    customBid: number | typeof NaN | undefined,
    status: string | undefined
  ) => void,
  handleClearItem: (id: string | number) => void
): Array<ColumnDef<ICreateKeyword>> =>
  [
    CREATE_PRODUCT_ASIN_COLUMN,
    CUSTOM_BID_COLUMN(selectedAdGroup, updateFunction),
    REMOVE_ACTION_COLUMN(handleClearItem),
  ] as Array<ColumnDef<ICreateKeyword>>;

export const amazonSPCreateNegKeywordTargetsColumns = (
  updateFunction: (
    id: string | number,
    customBid: number | typeof NaN | undefined,
    status: string | undefined
  ) => void,
  handleClearItem: (id: string | number) => void
): Array<ColumnDef<ICreateKeyword>> =>
  [
    CREATE_ENTITY_STATUS_COLUMN(updateFunction),
    CREATE_KEYWORD_COLUMN,
    ADDED_MATCH_TYPE_COLUMN,
    REMOVE_ACTION_COLUMN(handleClearItem),
  ] as Array<ColumnDef<ICreateKeyword>>;

export const amazonSBCreateNegKeywordTargetsColumns = (
  handleClearItem: (id: string | number) => void
): Array<ColumnDef<ICreateKeyword>> =>
  [
    CREATE_KEYWORD_COLUMN,
    ADDED_MATCH_TYPE_COLUMN,
    REMOVE_ACTION_COLUMN(handleClearItem),
  ] as Array<ColumnDef<ICreateKeyword>>;

export const amazonSPCreateNegProductTargetsColumns = (
  updateFunction: (
    id: string | number,
    customBid: number | typeof NaN | undefined,
    status: string | undefined
  ) => void,
  handleClearItem: (id: string | number) => void
): Array<ColumnDef<ICreateKeyword>> =>
  [
    CREATE_ENTITY_STATUS_COLUMN(updateFunction),
    CREATE_PRODUCT_ASIN_COLUMN,
    REMOVE_ACTION_COLUMN(handleClearItem),
  ] as Array<ColumnDef<ICreateKeyword>>;

export const amazonSBCreateNegProductTargetsColumns = (
  handleClearItem: (id: string | number) => void
): Array<ColumnDef<ICreateKeyword>> =>
  [CREATE_PRODUCT_ASIN_COLUMN, REMOVE_ACTION_COLUMN(handleClearItem)] as Array<
    ColumnDef<ICreateKeyword>
  >;

export const initialProductAdsListColumns = (
  marketplace: MarketplaceEnum,
  handleAddItem: (id: string | number) => void
): Array<ColumnDef<ICreateProductAds>> =>
  [
    CREATE_PRODUCT_NAME_COLUMN(marketplace),
    ADD_ITEM_ACTION_COLUMN(handleAddItem),
  ] as Array<ColumnDef<ICreateProductAds>>;

export const amazonProductAdsAddedListColumns = (
  updateFunction: (
    id: string | number,
    customBid: number | typeof NaN | undefined,
    status: string | undefined
  ) => void,
  handleClearItem: (id: string | number) => void
): Array<ColumnDef<ICreateProductAds>> =>
  [
    CREATE_ENTITY_STATUS_COLUMN(updateFunction),
    CREATE_PRODUCT_NAME_COLUMN(MarketplaceEnum.AMAZON),
    REMOVE_ACTION_COLUMN(handleClearItem),
  ] as Array<ColumnDef<ICreateProductAds>>;

export const walmartManualProductAdsAddedListColumns = (
  updateFunction: (
    id: string | number,
    customBid: number | typeof NaN | undefined,
    status: string | undefined
  ) => void,
  handleClearItem: (id: string | number) => void
): Array<ColumnDef<ICreateProductAds>> =>
  [
    CREATE_ENTITY_STATUS_COLUMN(updateFunction),
    CREATE_PRODUCT_NAME_COLUMN(MarketplaceEnum.WALMART),
    REMOVE_ACTION_COLUMN(handleClearItem),
  ] as Array<ColumnDef<ICreateProductAds>>;

export const walmartAutoProductAdsAddedListColumns = (
  selectedAdGroup: IWalmartAdGroup | IWalmartSVAdGroup | null,
  updateFunction: (
    id: string | number,
    customBid: number | typeof NaN | undefined,
    status: string | undefined
  ) => void,
  handleClearItem: (id: string | number) => void
): Array<ColumnDef<ICreateProductAds>> =>
  [
    CREATE_ENTITY_STATUS_COLUMN(updateFunction),
    CREATE_PRODUCT_NAME_COLUMN(MarketplaceEnum.WALMART),
    SUGGESTED_BID_COLUMN,
    CUSTOM_BID_COLUMN(selectedAdGroup, updateFunction),
    REMOVE_ACTION_COLUMN(handleClearItem),
  ] as Array<ColumnDef<ICreateProductAds>>;
