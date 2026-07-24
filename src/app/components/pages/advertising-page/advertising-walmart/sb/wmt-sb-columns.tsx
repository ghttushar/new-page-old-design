import { ColumnNameEnum } from '@/enums/advertising.enums';
import { IWalmartSBAutomationRules } from '@/interfaces/advertising/walmart/walmart-sb-advertising.interface';
import { ColumnDef } from '@tanstack/react-table';
import {
  ACTIVE_COLUMN,
  ADGROUP_NAME_COLUMN,
  ADGROUP_NAME_COLUMN_VIEW_COLUMN,
  ADGROUP_STATUS_COLUMN,
  AD_ITEM_COLUMN,
  AVG_CAP_OUT_TIME,
  CAMPAIGN_NAME_COLUMN,
  CAMPAIGN_NAME_COLUMN_VIEW_COLUMN,
  CAMPAIGN_STATUS_COLUMN,
  DAILY_BUDGET_COLUMN,
  DAILY_REMAINING_BUDGET_COLUMN,
  END_DATE_COLUMN,
  KEYWORD_TEXT_COLUMN,
  PAGE_TYPE_COLUMN,
  PLATFORM_COLUMN,
  RULE_AUTOMATION_STATUS_COLUMN,
  RULE_ENTITY_LINK_STATUS_COLUMN,
  RULE_NAME_COLUMN,
  RULE_NEXT_EXECUTION_COLUMN,
  RULE_TYPE_COLUMN,
  START_DATE_COLUMN,
  STATUS_COLUMN,
  SUGGESTED_DAILY_BUDGET_COLUMN,
  SUGGESTED_TOTAL_BUDGET_COLUMN,
  TARGETING_TYPE_COLUMN,
  TOTAL_BUDGET_COLUMN,
  TOTAL_REMAINING_BUDGET_COLUMN,
  VIEW_STATUS_COLUMN,
  WALMART_AD_TYPE_COLUMN,
  WALMART_BUDGET_TYPE_COLUMN,
  WALMART_KEYWORD_BID_COLUMN,
  WALMART_MATCH_TYPE_COLUMN,
  WALMART_METRICS_COLUMNS,
} from 'src/constants/table-columns/new-column-names.constants';
import {
  IWalmartAdGroup,
  IWalmartAdItem,
  IWalmartCampaign,
  IWalmartKeywords,
  IWalmartPageType,
  IWalmartPlatform,
} from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';

export const walmartSbCampaignColumns: Array<ColumnDef<IWalmartCampaign>> = [
  ACTIVE_COLUMN(true, ColumnNameEnum.CAMPAIGN),
  VIEW_STATUS_COLUMN,
  CAMPAIGN_NAME_COLUMN,
  RULE_AUTOMATION_STATUS_COLUMN,
  TARGETING_TYPE_COLUMN,
  START_DATE_COLUMN,
  END_DATE_COLUMN,
  WALMART_BUDGET_TYPE_COLUMN,
  TOTAL_BUDGET_COLUMN,
  DAILY_BUDGET_COLUMN,
  TOTAL_REMAINING_BUDGET_COLUMN,
  DAILY_REMAINING_BUDGET_COLUMN,
  SUGGESTED_TOTAL_BUDGET_COLUMN,
  SUGGESTED_DAILY_BUDGET_COLUMN,
  AVG_CAP_OUT_TIME,
  ...WALMART_METRICS_COLUMNS,
] as Array<ColumnDef<IWalmartCampaign>>;

export const walmartSbAdGroupsColumns: Array<ColumnDef<IWalmartAdGroup>> = [
  STATUS_COLUMN(false, ColumnNameEnum.ADGROUP),
  ADGROUP_NAME_COLUMN,
  CAMPAIGN_STATUS_COLUMN,
  CAMPAIGN_NAME_COLUMN_VIEW_COLUMN,
  WALMART_AD_TYPE_COLUMN,
  TARGETING_TYPE_COLUMN,
  ...WALMART_METRICS_COLUMNS,
] as Array<ColumnDef<IWalmartAdGroup>>;

export const walmartSbKeywordTargetingColumns: Array<
  ColumnDef<IWalmartKeywords>
> = [
  STATUS_COLUMN(true, ColumnNameEnum.KEYWORD),
  KEYWORD_TEXT_COLUMN,
  WALMART_MATCH_TYPE_COLUMN,
  ADGROUP_STATUS_COLUMN,
  ADGROUP_NAME_COLUMN_VIEW_COLUMN,
  CAMPAIGN_STATUS_COLUMN,
  CAMPAIGN_NAME_COLUMN_VIEW_COLUMN,
  WALMART_AD_TYPE_COLUMN,
  TARGETING_TYPE_COLUMN,
  WALMART_KEYWORD_BID_COLUMN,
  ...WALMART_METRICS_COLUMNS,
] as Array<ColumnDef<IWalmartKeywords>>;

export const walmartSbAdItemsColumns: Array<ColumnDef<IWalmartAdItem>> = [
  STATUS_COLUMN(false, ColumnNameEnum.PRODUCT_AD),
  AD_ITEM_COLUMN,
  ADGROUP_STATUS_COLUMN,
  ADGROUP_NAME_COLUMN_VIEW_COLUMN,
  CAMPAIGN_STATUS_COLUMN,
  CAMPAIGN_NAME_COLUMN_VIEW_COLUMN,
  WALMART_AD_TYPE_COLUMN,
  TARGETING_TYPE_COLUMN,
  ...WALMART_METRICS_COLUMNS,
] as Array<ColumnDef<IWalmartAdItem>>;

export const walmartSbPageTypeColumns: Array<ColumnDef<IWalmartPageType>> = [
  PAGE_TYPE_COLUMN,
  CAMPAIGN_STATUS_COLUMN,
  CAMPAIGN_NAME_COLUMN_VIEW_COLUMN,
  TARGETING_TYPE_COLUMN,
  ...WALMART_METRICS_COLUMNS,
] as Array<ColumnDef<IWalmartPageType>>;

export const walmartSbPlatformColumns: Array<ColumnDef<IWalmartPlatform>> = [
  PLATFORM_COLUMN,
  CAMPAIGN_STATUS_COLUMN,
  CAMPAIGN_NAME_COLUMN_VIEW_COLUMN,
  TARGETING_TYPE_COLUMN,
  ...WALMART_METRICS_COLUMNS,
] as Array<ColumnDef<IWalmartPlatform>>;

export const walmartSbAutomationRulesColumns = (
  campaignSubHeaderData?: IWalmartCampaign | null
): Array<ColumnDef<IWalmartSBAutomationRules>> =>
  [
    RULE_ENTITY_LINK_STATUS_COLUMN(campaignSubHeaderData),
    RULE_NAME_COLUMN,
    RULE_TYPE_COLUMN,
    RULE_NEXT_EXECUTION_COLUMN,
  ] as Array<ColumnDef<IWalmartSBAutomationRules>>;
