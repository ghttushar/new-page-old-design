import { AdvertisingTitlesEnum } from '@/enums/advertising.enums';
import { BulkActionKeyEnum } from '@/enums/bulk-action.enums';
import { IBulkActionRule } from '@/interfaces/advertising/advertising.interface';
import {
  checkIsActiveBulkActionVisible,
  checkIsBidBulkActionVisible,
  checkIsBiddingStrategyBulkActionVisible,
  checkIsBudgetBulkActionVisible,
  checkIsDefaultBidBulkActionVisible,
  checkIsEndDateBulkActionVisible,
  checkIsPageTypeBidMultiplierBulkActionVisible,
  checkIsPauseBulkActionVisible,
  checkIsPlatformBidMultiplierBulkActionVisible,
  checkIsWalmartAdItemBidBulkActionVisible,
  checkIsWalmartBudgetBulkActionVisible,
  checkIsWalmartKeywordBidBulkActionVisible,
  getIsTaggingEditable,
} from '@/utils/advertising.utils';
import { createElement } from 'react';
import AdvertisingActiveAction from 'src/app/components/common/bulk-actions/active-action/advertising-active-action';
import BidAction from 'src/app/components/common/bulk-actions/bid-action/bid-action';
import WalmartBidAction from 'src/app/components/common/bulk-actions/bid-action/walmart-bid-action';
import BidMultiplierAction from 'src/app/components/common/bulk-actions/bid-multiplier-action/bid-multiplier-action';
import BiddingStrategyAction from 'src/app/components/common/bulk-actions/bidding-strategy-action/bidding-strategy-action';
import BudgetAction from 'src/app/components/common/bulk-actions/budget-action/budget-action';
import DailyBudgetAction from 'src/app/components/common/bulk-actions/budget-action/daily-budget-action';
import TotalBudgetAction from 'src/app/components/common/bulk-actions/budget-action/total-budget-action';
import DefaultBidAction from 'src/app/components/common/bulk-actions/default-bid-action/default-bid-action';
import EndDateAction from 'src/app/components/common/bulk-actions/end-date-action/end-date-action';
import AdvertisingPauseAction from 'src/app/components/common/bulk-actions/pause-action/advertising-pause-action';
import TaggingAction from 'src/app/components/common/bulk-actions/tagging-action/tagging-action';

export const ADVERTISING_BULK_ACTION_RULES: IBulkActionRule[] = [
  {
    key: BulkActionKeyEnum.ACTIVE,
    isVisible: checkIsActiveBulkActionVisible,
    render: (context, setTableData) =>
      createElement(AdvertisingActiveAction, {
        setTableData,
        marketplace: context.selectedMarketplace,
        isWalmartCampaign: context.isWalmartCampaign,
      }),
  },
  {
    key: BulkActionKeyEnum.PAUSE,
    isVisible: checkIsPauseBulkActionVisible,
    render: (context, setTableData) =>
      createElement(AdvertisingPauseAction, {
        setTableData,
        marketplace: context.selectedMarketplace,
        isWalmartKT: context.isWalmartKT,
      }),
  },
  {
    key: BulkActionKeyEnum.TAGGING,
    isVisible: (context) =>
      getIsTaggingEditable(context.title as AdvertisingTitlesEnum),
    render: (context, setTableData) =>
      createElement(TaggingAction, { setTableData }),
  },
  {
    key: BulkActionKeyEnum.END_DATE,
    isVisible: checkIsEndDateBulkActionVisible,
    render: (context, setTableData) =>
      createElement(EndDateAction, { setTableData }),
  },
  {
    key: BulkActionKeyEnum.BIDDING_STRATEGY,
    isVisible: checkIsBiddingStrategyBulkActionVisible,
    render: (context, setTableData) =>
      createElement(BiddingStrategyAction, { setTableData }),
  },
  {
    key: BulkActionKeyEnum.BUDGET,
    isVisible: checkIsBudgetBulkActionVisible,
    render: (context, setTableData) =>
      createElement(BudgetAction, { setTableData }),
  },
  {
    key: BulkActionKeyEnum.DAILY_BUDGET,
    isVisible: checkIsWalmartBudgetBulkActionVisible,
    render: (context, setTableData) =>
      createElement(DailyBudgetAction, { setTableData }),
  },
  {
    key: BulkActionKeyEnum.TOTAL_BUDGET,
    isVisible: checkIsWalmartBudgetBulkActionVisible,
    render: (context, setTableData) =>
      createElement(TotalBudgetAction, { setTableData }),
  },
  {
    key: BulkActionKeyEnum.DEFAULT_BID,
    isVisible: checkIsDefaultBidBulkActionVisible,
    render: (context, setTableData) =>
      createElement(DefaultBidAction, { setTableData }),
  },
  {
    key: BulkActionKeyEnum.WALMART_KEYWORD_BID,
    isVisible: checkIsWalmartKeywordBidBulkActionVisible,
    render: (context, setTableData) =>
      createElement(WalmartBidAction, { setTableData }),
  },
  {
    key: BulkActionKeyEnum.WALMART_AD_ITEM_BID,
    isVisible: checkIsWalmartAdItemBidBulkActionVisible,
    render: (context, setTableData) =>
      createElement(WalmartBidAction, {
        setTableData,
        isWalmartAdItem: true,
      }),
  },
  {
    key: BulkActionKeyEnum.PAGE_TYPE_BID_MULTIPLIER,
    isVisible: checkIsPageTypeBidMultiplierBulkActionVisible,
    render: (context, setTableData) =>
      createElement(BidMultiplierAction, {
        setTableData,
        isPageType: true,
      }),
  },
  {
    key: BulkActionKeyEnum.PLATFORM_BID_MULTIPLIER,
    isVisible: checkIsPlatformBidMultiplierBulkActionVisible,
    render: (context, setTableData) =>
      createElement(BidMultiplierAction, {
        setTableData,
        isPageType: false,
      }),
  },
  {
    key: BulkActionKeyEnum.BID,
    isVisible: checkIsBidBulkActionVisible,
    render: (context, setTableData) =>
      createElement(BidAction, { setTableData }),
  },
  // TODO: Keeping this if future requirement changes
  // {
  //   key: BulkActionKeyEnum.ARCHIVE,
  //   isVisible: checkIsArchiveBulkActionVisible,
  //   render: (context, setTableData) =>
  //     createElement(AdvertisingArchiveAction, { setTableData }),
  // },
];
