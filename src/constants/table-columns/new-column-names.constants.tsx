import ImgComponent from '@/app/components/common/img-component/img-component';
import AdvertisingRuleNameView from '@/app/components/page-components/advertising-name-view/advertising-rule-name-view';
import AdvertisingOverallAdGroupEdit from '@/app/components/page-components/advertising-overall-components/advertising-overall-edit-components/advertising-overall-adgroup-edit';
import AdvertisingOverallCampaignEdit from '@/app/components/page-components/advertising-overall-components/advertising-overall-edit-components/advertising-overall-campaign-edit';
import AdvertisingOverallAdGroupView from '@/app/components/page-components/advertising-overall-components/advertising-overall-view-components/advertising-overall-adgroup-view';
import AdvertisingOverallCampaignView from '@/app/components/page-components/advertising-overall-components/advertising-overall-view-components/advertising-overall-campaign-view';
import AdvertisingTargetingNameView from '@/app/components/page-components/advertising-targeting-name-view/advertising-targeting-name-view';
import { CreativeAsinsSb } from '@/app/components/page-components/creative-asins-sb/creative-asins-sb';
import EditAccessRuleAutomationStatus from '@/app/components/page-components/edit-access-components/edit-access-status/edit-access-automation-status';
import {
  imageStyles,
  itemNameContainerStyles,
  targetingTypeBoxStyle,
  targetingTypeContainer,
} from '@/app/components/pages/advertising-page/advertising-amazon/overall/account-level/amz-overall-account-level-styles';
import { multiItemsContainerStyles } from '@/app/components/pages/advertising-page/advertising-amazon/sb/account-level/amz-sb-account-level-styles';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { ISBCampaign } from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { ISDCampaign } from '@/interfaces/advertising/amazon/sd-advertising.interface';
import {
  IAdMetrics,
  ICampaign,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  IWalmartAdMetrics,
  IWalmartInStoreMetrics,
  IWalmartMetricsExtended,
} from '@/interfaces/advertising/walmart/walmart-advertising.interface';
import { IWalmartCampaign } from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { IWalmartSVCampaign } from '@/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import Typography from '@mui/material/Typography';
import { ColumnDef } from '@tanstack/react-table';
import { AntSwitch } from 'src/app/components/common/ant-switch/ant-switch';
import BiddingStrategyView from 'src/app/components/common/bidding-strategy-view/bidding-strategy-view';
import { textWrappingStyles } from 'src/app/components/common/keyword-actions-table/keyword-actions-table-styles';
import AdvertisingCreativeView from 'src/app/components/page-components/advertising-creative-view/advertising-creative-view';
import AdvertisingAdGroupNameView from 'src/app/components/page-components/advertising-name-view/advertising-adgroup-name-view';
import AdvertisingCampaignNameView from 'src/app/components/page-components/advertising-name-view/advertising-campaign-name-view';
import EditAccessAdGroupName from 'src/app/components/page-components/edit-access-components/edit-access-adgroup-name/edit-access-adgroup-name';
import EditAccessBid from 'src/app/components/page-components/edit-access-components/edit-access-bid/edit-access-bid';
import EditAccessBiddingStrategy from 'src/app/components/page-components/edit-access-components/edit-access-bidding-strategy/edit-access-bidding-strategy';
import EditAccessBudget from 'src/app/components/page-components/edit-access-components/edit-access-budget/edit-access-budget';
import EditAccessDailyBudget from 'src/app/components/page-components/edit-access-components/edit-access-budget/edit-access-daily-budget';
import EditAccessTotalBudget from 'src/app/components/page-components/edit-access-components/edit-access-budget/edit-access-total-budget';
import EditAccessCampaignName from 'src/app/components/page-components/edit-access-components/edit-access-campaign-name/edit-access-campaign-name';
import EditAccessBidMultiplier from 'src/app/components/page-components/edit-access-components/edit-access-default-bid/edit-access-bid-multiplier';
import EditAccessDefaultBid from 'src/app/components/page-components/edit-access-components/edit-access-default-bid/edit-access-default-bid';
import EditAccessKeywordBid from 'src/app/components/page-components/edit-access-components/edit-access-default-bid/edit-access-keyword-bid';
import EditAccessProductBid from 'src/app/components/page-components/edit-access-components/edit-access-default-bid/edit-access-product-bid';
import EditAccessEndDate from 'src/app/components/page-components/edit-access-components/edit-access-end-date/edit-access-end-date';
import EditAccessStatus from 'src/app/components/page-components/edit-access-components/edit-access-status/edit-access-status';
import styles from 'src/app/components/pages/advertising-page/advertising-walmart/sp/account-level/wmt-sp-account-level.module.scss';
import {
  AdType,
  AdTypeShort,
  CampaignStateEnum,
  ColumnNameEnum,
} from 'src/enums/advertising.enums';
import {
  IAdGroupStatus,
  IAdType,
  IAmazonOverallAdGroupStatus,
  IAmazonOverallItemNameColumn,
  IAmazonSBCreativeAdColumn,
  IAmazonSBLandingPage,
  IAmazonSBProductAdsExtendedData,
  IAmazonSDProductNameColumn,
  IAmazonSPBudgetColumn,
  IAmazonSPDynamicBidding,
  IAmazonSPProductName,
  IAvgCapOutTime,
  IBid,
  IBiddedKeyword,
  IBidMultiplier,
  IBidOptimization,
  IBudgetColumn,
  IBudgetType,
  ICampaignStatus,
  ICostType,
  ICreationDate,
  ICreationDateTime,
  ICreativeStatus,
  ICreativeType,
  IDailyBudget,
  IDailyRemainingBudget,
  IDefaultBid,
  IEditableAdGroupName,
  IEditableCampaignName,
  IEndDateColumn,
  IKeyword,
  IKeywordStatus,
  IKeywordText,
  ILastUpdatedDate,
  IListingPrice,
  IMatchType,
  INextExecutionAt,
  IOutOfBudgetTime,
  IOverallStrategyColumn,
  IPageType,
  IPercentage,
  IPlacementName,
  IPlatform,
  IRuleAutomationStatus,
  IRuleEntityLinkStatus,
  IRuleName,
  IRuleType,
  ISBProductAdsAsins,
  ISearchTerm,
  IStartDate,
  IStrategy,
  ISuggDailyBudget,
  ISuggTotalBudget,
  ITableStatus,
  ITactic,
  ITargeting,
  ITargetingType,
  ITotalBudget,
  ITotalRemainingBudget,
  IWalmartCampaignViewStatus,
  IWalmartItemName,
  IWalmartProductBid,
} from 'src/interfaces/column.interface';
import {
  displayValue,
  formatNum,
  getTitleCaseString,
  getValidNumber,
  parseNum,
} from 'src/utils';
import {
  convertToTitleCase,
  convertToUpperCase,
  getAdsEligibility,
  getAmazonAdType,
  getFooterDisplayText,
  getMappedPageType,
  getProductImgUrl,
  getProductUrl,
  getSDTactic,
  getWalmartAdType,
} from 'src/utils/advertising.utils';
import {
  changeDateFormat,
  convertUtcToTimezoneDate,
  getUSFormatDate,
  parseAsUtcAndConvert,
} from 'src/utils/datetime.utils';
import TableFooterItem from '../../app/components/page-components/table-footer-item/table-footer-item';
import {
  AMAZON_MATCH_TYPE_MAPPING,
  sdTacticOptions,
} from '../advertising-filter.constants';
import {
  DATE_FORMAT_7,
  DATE_FORMAT_8,
  TIME_FORMAT_4,
} from '../datetime.constants';
import { RULE_TYPE_LABEL_MAPPING } from '../rules/rules.constants';

export const textTitleStyles = {
  fontSize: '1.1rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

export const textCenterStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const textStartStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
};

export const subTextStyles = {
  fontSize: '0.8rem',
  fontWeight: 400,
  color: '#666',
};

export const WALMART_IN_STORE_COLUMNS: Array<
  ColumnDef<IWalmartInStoreMetrics>
> = [
  {
    accessorKey: 'inStoreAttributedSales',
    id: ColumnNameEnum.IN_STORE_ATTRIBUTES_SALES,
    size: 180,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          In-Store Attributed Sales
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage={false}
            isFraction={true}
            accessorKey={'inStoreAttributedSales'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.inStoreAttributedSales;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className="commonCell" style={textCenterStyles}>
          {displayValue(formatNum(value), false)}
        </div>
      );
    },
  },

  {
    accessorKey: 'inStoreAdvertisedSales',
    id: ColumnNameEnum.IN_STORE_ADVERTISED_SALES,
    size: 180,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          In-Store Advertised Sales
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage={false}
            isFraction={true}
            accessorKey={'inStoreAdvertisedSales'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.inStoreAdvertisedSales;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className="commonCell" style={textCenterStyles}>
          {displayValue(formatNum(value), false)}
        </div>
      );
    },
  },

  {
    accessorKey: 'omniChannelSales',
    id: ColumnNameEnum.OMNI_CHANNEL_SALES,
    size: 180,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Omnichannel Sales
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isFraction={true}
            accessorKey={'omniChannelSales'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.omniChannelSales;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className="commonCell" style={textCenterStyles}>
          {displayValue(formatNum(value), false)}
        </div>
      );
    },
  },

  {
    accessorKey: 'omniChannelRoas',
    id: ColumnNameEnum.OMNI_CHANNEL_ROAS,
    size: 180,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Omnichannel ROAS
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();

      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage={false}
            isFraction={true}
            accessorKey={'omniChannelRoas'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.omniChannelRoas;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className="commonCell" style={textCenterStyles}>
          {displayValue(formatNum(value), false)}
        </div>
      );
    },
  },

  {
    accessorKey: 'inStoreOtherSales',
    id: ColumnNameEnum.IN_STORE_OTHER_SALES,
    size: 180,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          In-Store Other Sales
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage={false}
            isFraction={true}
            accessorKey={'inStoreOtherSales'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.inStoreOtherSales;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className="commonCell" style={textCenterStyles}>
          {displayValue(formatNum(value), false)}
        </div>
      );
    },
  },

  {
    accessorKey: 'inStoreOrders',
    id: ColumnNameEnum.IN_STORE_ORDERS,
    size: 180,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          In-Store Orders
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'inStoreOrders'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.inStoreOrders;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className="commonCell" style={textCenterStyles}>
          {formatNum(value, false)}
        </div>
      );
    },
  },

  {
    accessorKey: 'inStoreUnitsSold',
    id: ColumnNameEnum.IN_STORE_UNITS_SOLD,
    size: 180,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          In-Store Units Sold
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'inStoreUnitsSold'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.inStoreUnitsSold;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className="commonCell" style={textCenterStyles}>
          {formatNum(value, false)}
        </div>
      );
    },
  },
];

export const WALMART_METRICS_COLUMNS: Array<ColumnDef<IWalmartAdMetrics>> = [
  {
    accessorKey: 'impressions',
    id: ColumnNameEnum.IMPRESSIONS,
    size: 120,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Impressions
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'impressions'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.impressions;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(value, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'clicks',
    id: ColumnNameEnum.CLICKS,
    size: 100,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Clicks
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'clicks'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.clicks;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(value, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'ctr',
    id: ColumnNameEnum.CTR,
    size: 100,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          CTR
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isFraction
            isPercentage
            accessorKey={'ctr'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (row.original.ctr === null || row.original.ctr === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(row.original.ctr))}
        </div>
      );
    },
  },
  {
    accessorKey: 'unitsSold',
    id: ColumnNameEnum.AD_UNITS,
    size: 120,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Ad Units
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'unitsSold'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (
        row.original.unitsSold === null ||
        row.original.unitsSold === undefined
      )
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(row.original.unitsSold, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'adOrders',
    id: ColumnNameEnum.AD_ORDERS,
    size: 120,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Ad Orders
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'adOrders'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (row.original.adOrders === null || row.original.adOrders === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(row.original.adOrders, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'cvrUnitsSoldBased',
    id: ColumnNameEnum.CVR_UNITS_BASED,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          CVR (Units Based)
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage={true}
            isFraction={true}
            accessorKey={'cvrUnitsSoldBased'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (
        row.original.cvrUnitsSoldBased === null ||
        row.original.cvrUnitsSoldBased === undefined
      )
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(row.original.cvrUnitsSoldBased))}
        </div>
      );
    },
  },
  {
    accessorKey: 'cvrOrdersSoldBased',
    id: ColumnNameEnum.CVR_ORDERS_BASED,
    size: 120,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          CVR (Orders Based)
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage={true}
            isFraction={true}
            accessorKey={'cvrOrdersSoldBased'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (
        row.original.cvrOrdersSoldBased === null ||
        row.original.cvrOrdersSoldBased === undefined
      )
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(row.original.cvrOrdersSoldBased))}
        </div>
      );
    },
  },
  {
    accessorKey: 'cpc',
    id: ColumnNameEnum.CPC,
    size: 100,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          CPC
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage={false}
            isFraction={true}
            accessorKey={'cpc'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (row.original.cpc === null || row.original.cpc === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(row.original.cpc), false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'adSpend',
    id: ColumnNameEnum.AD_SPEND,
    size: 120,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Ad Spend
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage={false}
            isFraction={true}
            accessorKey={'adSpend'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (row.original.adSpend === null || row.original.adSpend === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(row.original.adSpend), false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'adSales',
    id: ColumnNameEnum.AD_SALES,
    size: 120,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Ad Sales
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage={false}
            isFraction={true}
            accessorKey={'adSales'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (row.original.adSales === null || row.original.adSales === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(row.original.adSales), false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'advertisedSkuSales',
    id: ColumnNameEnum.ADVERTISED_SKU_SALES,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Advertised SKU Sales
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage={false}
            isFraction={true}
            accessorKey={'advertisedSkuSales'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (
        row.original.advertisedSkuSales === null ||
        row.original.advertisedSkuSales === undefined
      )
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(row.original.advertisedSkuSales), false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'otherSkuSales',
    id: ColumnNameEnum.OTHER_SKU_SALES,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Other SKU Sales
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage={false}
            isFraction={true}
            accessorKey={'otherSkuSales'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (
        row.original.otherSkuSales === null ||
        row.original.otherSkuSales === undefined
      )
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(row.original.otherSkuSales), false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'advertisedSkuUnits',
    id: ColumnNameEnum.ADVERTISED_SKU_UNITS,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Advertised SKU Units
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'advertisedSkuUnits'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (
        row.original.advertisedSkuUnits === null ||
        row.original.advertisedSkuUnits === undefined
      )
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(row.original.advertisedSkuUnits, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'otherSkuUnits',
    id: ColumnNameEnum.OTHER_SKU_UNITS,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Other SKU Units
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'otherSkuUnits'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (
        row.original.otherSkuUnits === null ||
        row.original.otherSkuUnits === undefined
      )
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(row.original.otherSkuUnits, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'roas',
    id: ColumnNameEnum.ROAS,
    size: 100,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          ROAS
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage={false}
            isFraction={true}
            accessorKey={'roas'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (row.original.roas === null || row.original.roas === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(row.original.roas), false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'acos',
    id: ColumnNameEnum.ACOS,
    size: 100,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          ACOS
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage
            isFraction
            accessorKey={'acos'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (row.original.acos === null || row.original.acos === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(row.original.acos))}
        </div>
      );
    },
  },
  {
    accessorKey: 'ntbUnits',
    id: ColumnNameEnum.NTB_UNITS,
    size: 120,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          NTB Units
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'ntbUnits'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (row.original.ntbUnits === null || row.original.ntbUnits === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(row.original.ntbUnits, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'ntbOrders',
    id: ColumnNameEnum.NTB_ORDERS,
    size: 120,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          NTB Orders
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'ntbOrders'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (
        row.original.ntbOrders === null ||
        row.original.ntbOrders === undefined
      )
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(row.original.ntbOrders, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'ntbSales',
    id: ColumnNameEnum.NTB_SALES,
    size: 120,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          NTB Sales
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isFraction
            accessorKey={'ntbSales'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (row.original.ntbSales === null || row.original.ntbSales === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(row.original.ntbSales), false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'percentNtbUnits',
    id: ColumnNameEnum.PERCENT_NTB_UNITS,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Percent NTB Units
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage
            isFraction
            accessorKey={'percentNtbUnits'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.percentNtbUnits;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(value))}
        </div>
      );
    },
  },
  {
    accessorKey: 'percentNtbOrders',
    id: ColumnNameEnum.PERCENT_NTB_ORDERS,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Percent NTB Orders
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage
            isFraction
            accessorKey={'percentNtbOrders'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.percentNtbOrders;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(value))}
        </div>
      );
    },
  },
  {
    accessorKey: 'percentNtbSales',
    id: ColumnNameEnum.PERCENT_NTB_SALES,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Percent NTB Sales
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage
            isFraction
            accessorKey={'percentNtbSales'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.percentNtbSales;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(value))}
        </div>
      );
    },
  },
];

export const WALMART_VIDEO_METRICS_COLUMNS: Array<
  ColumnDef<IWalmartMetricsExtended>
> = [
  {
    accessorKey: 'completeViewOrders',
    id: ColumnNameEnum.COMPLETE_VIEW_AD_ORDERS,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Complete View Ad Orders
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'completeViewOrders'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.completeViewOrders;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(value, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'completeViewAdUnits',
    id: ColumnNameEnum.COMPLETE_VIEW_AD_UNITS,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Complete View Ad Units
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'completeViewAdUnits'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.completeViewAdUnits;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(value, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'videoCompleteViews',
    id: ColumnNameEnum.VIDEO_COMPLETE_VIEWS,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Video Complete Views
        </div>
      );
    },

    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'videoCompleteViews'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.videoCompleteViews;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(value, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'videoFirstQuartileViews',
    id: ColumnNameEnum.VIDEO_FIRST_QUARTILE_VIEWS,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Video First Quartile Views
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'videoFirstQuartileViews'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.videoFirstQuartileViews;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(value, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'videoImpressions',
    id: ColumnNameEnum.VIDEO_IMPRESSIONS,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Video Impressions
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'videoImpressions'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.videoImpressions;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(value, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'videoMidpointViews',
    id: ColumnNameEnum.VIDEO_MIDPOINT_VIEWS,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Video Midpoint Views
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'videoMidpointViews'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.videoMidpointViews;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(value, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'videoThirdQuartileViews',
    id: ColumnNameEnum.VIDEO_THIRD_QUARTILE_VIEWS,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Video Third Quartile Views
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'videoThirdQuartileViews'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.videoThirdQuartileViews;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(value, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'videoUnmutes',
    id: ColumnNameEnum.VIDEO_UNMUTES,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Video Unmutes
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'videoUnmutes'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.videoUnmutes;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(value, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'video5SecondViews',
    id: ColumnNameEnum.VIDEO_5_SECOND_VIEWS,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Video 5 Second Views
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'video5SecondViews'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.video5SecondViews;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(value, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'viewableImpressions',
    id: ColumnNameEnum.VIEWABLE_IMPRESSIONS,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Viewable Impressions
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'viewableImpressions'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.viewableImpressions;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(value, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'viewThroughAdOrders',
    id: ColumnNameEnum.VIEW_THROUGH_AD_ORDERS,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          View-Through Ad Orders
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'viewThroughAdOrders'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.viewThroughAdOrders;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(value, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'viewThroughAdSales',
    id: ColumnNameEnum.VIEW_THROUGH_AD_SALES,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          View-Through Ad Sales
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isFraction
            accessorKey={'viewThroughAdSales'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.viewThroughAdSales;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(value), false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'viewThroughAdUnits',
    id: ColumnNameEnum.VIEW_THROUGH_AD_UNITS,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          View-Through Ad Units
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'viewThroughAdUnits'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.viewThroughAdUnits;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(value, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'completeViewAdSales',
    id: ColumnNameEnum.COMPLETE_VIEW_AD_SALES,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Complete View Ad Sales
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isFraction
            accessorKey={'completeViewAdSales'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.completeViewAdSales;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(value), false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'otherCompleteViewAdSales',
    id: ColumnNameEnum.OTHER_COMPLETE_VIEW_AD_SALES,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Other Complete View Ad Sales
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isFraction
            accessorKey={'otherCompleteViewAdSales'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.otherCompleteViewAdSales;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(value), false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'vtr',
    id: ColumnNameEnum.VTR,
    size: 90,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          VTR
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage
            isFraction
            accessorKey={'vtr'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.vtr;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(value))}
        </div>
      );
    },
  },
  {
    accessorKey: 'vctr',
    id: ColumnNameEnum.VCTR,
    size: 90,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          vCTR
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage
            isFraction
            accessorKey={'vctr'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.vctr;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(value))}
        </div>
      );
    },
  },
  {
    accessorKey: 'video5SecondViewRate',
    id: ColumnNameEnum.VIDEO_5_SECOND_VIEW_RATE,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Video 5 Second View Rate
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage
            isFraction
            accessorKey={'video5SecondViewRate'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.video5SecondViewRate;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(value))}
        </div>
      );
    },
  },
];

export const AMAZON_METRICS_COLUMNS: Array<ColumnDef<IAdMetrics>> = [
  {
    accessorKey: 'impressions',
    id: ColumnNameEnum.IMPRESSIONS,
    size: 120,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Impressions
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'impressions'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.impressions;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(value, false)}
        </div>
      );
    },
  },

  {
    accessorKey: 'clicks',
    id: ColumnNameEnum.CLICKS,
    size: 100,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Clicks
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'clicks'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.clicks;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(value, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'ctr',
    id: ColumnNameEnum.CTR,
    size: 100,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          CTR
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isFraction
            isPercentage
            accessorKey={'ctr'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (row.original.ctr === null || row.original.ctr === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(row.original.ctr))}
        </div>
      );
    },
  },
  {
    accessorKey: 'cpc',
    id: ColumnNameEnum.CPC,
    size: 100,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          CPC
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage={false}
            isFraction={true}
            accessorKey={'cpc'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (row.original.cpc === null || row.original.cpc === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(row.original.cpc), false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'adSpend',
    id: ColumnNameEnum.AD_SPEND,
    size: 120,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Ad Spend
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isFraction
            accessorKey={'adSpend'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (row.original.adSpend === null || row.original.adSpend === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(row.original.adSpend), false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'adSales',
    id: ColumnNameEnum.AD_SALES,
    size: 120,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Ad Sales
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isFraction
            accessorKey={'adSales'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (row.original.adSales === null || row.original.adSales === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(row.original.adSales), false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'unitsSold',
    id: ColumnNameEnum.AD_UNITS,
    size: 120,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Ad Units
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'unitsSold'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (
        row.original.unitsSold === null ||
        row.original.unitsSold === undefined
      )
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(row.original.unitsSold, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'cvr',
    id: ColumnNameEnum.CVR,
    size: 100,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          CVR
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isFraction
            isPercentage
            accessorKey={'cvr'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (row.original.cvr === null || row.original.cvr === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(row.original.cvr))}
        </div>
      );
    },
  },
  {
    accessorKey: 'roas',
    id: ColumnNameEnum.ROAS,
    size: 120,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          ROAS
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage={false}
            isFraction={true}
            accessorKey={'roas'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (row.original.roas === null || row.original.roas === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(row.original.roas), false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'acos',
    id: ColumnNameEnum.ACOS,
    size: 120,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          ACOS
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage
            isFraction
            accessorKey={'acos'}
            totalData={footerData}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      if (row.original.acos === null || row.original.acos === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(row.original.acos))}
        </div>
      );
    },
  },
];

export const ACTIVE_COLUMN = (
  isCampaign: boolean,
  statusName: string
): ColumnDef<ITableStatus> => {
  return {
    accessorKey: 'status',
    id: ColumnNameEnum.ACTIVE,
    size: 120,
    meta: {
      filterLabel: `${statusName} Status`,
    },
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Active
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.status;
      const adType = row.original.adType;

      return (
        <div
          className={`commonCell`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '3.5rem',
          }}
        >
          <EditAccessStatus
            id={row.original.id as string | number}
            status={value}
            endDate={row.original.endDate}
            isCampaign={isCampaign}
            adType={adType}
          />
        </div>
      );
    },
  };
};

export const VIEW_STATUS_COLUMN: ColumnDef<IWalmartCampaignViewStatus> = {
  accessorKey: 'viewStatus',
  id: ColumnNameEnum.STATUS,
  size: 120,
  enableSorting: false,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Status
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.viewStatus;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {convertToTitleCase(value)}
      </div>
    );
  },
};

export const OVERALL_CAMPAIGN_NAME_VIEW_COLUMN = (
  isCampaign: boolean
): ColumnDef<IEditableCampaignName> => {
  return {
    accessorKey: 'campaignName',
    id: ColumnNameEnum.CAMPAIGN,
    size: 400,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textStartStyles}>
          Campaign
        </div>
      );
    },
    footer: (props) => {
      return (
        <div className={`commonHeader`} style={textStartStyles}>
          {getFooterDisplayText(props)}
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const campaignName = row.original.campaignName;
      const campaignId = row.original.campaignId;
      const adType = row.original.adType;
      const message = row.original.message;
      const targetingType = row.original.targetingType;
      const tagId = row.original.tagId;

      if (!campaignName) return <p className="no-data-view">-</p>;

      return (
        <div className={`commonCell`} style={textStartStyles}>
          <AdvertisingOverallCampaignView
            campaignName={campaignName}
            campaignId={`${campaignId}`}
            adType={adType}
            messages={message}
            isCampaign={isCampaign}
            targetingType={targetingType}
            tagId={tagId}
          />
        </div>
      );
    },
  };
};

export const OVERALL_CAMPAIGN_NAME_EDIT_COLUMN: ColumnDef<IEditableCampaignName> =
  {
    accessorKey: 'campaignName',
    id: ColumnNameEnum.CAMPAIGN,
    size: 400,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textStartStyles}>
          Campaign
        </div>
      );
    },
    footer: (props) => {
      return (
        <div className={`commonHeader`} style={textStartStyles}>
          {getFooterDisplayText(props)}
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const campaignName = row.original.campaignName;
      const campaignId = row.original.campaignId;
      const adType = row.original.adType;
      const endDate = row.original.endDate;
      const messages = row.original.message;
      const targetingType = row.original.targetingType;
      const tagId = row.original.tagId;

      if (!campaignName) return <p className="no-data-view">-</p>;

      return (
        <div className={`commonCell`} style={textStartStyles}>
          <AdvertisingOverallCampaignEdit
            campaignName={campaignName}
            campaignId={`${campaignId}`}
            adType={adType}
            endDate={endDate}
            messages={messages}
            targetingType={targetingType}
          />
        </div>
      );
    },
  };

export const WALMART_AD_TYPE_COLUMN: ColumnDef<IAdType> = {
  accessorKey: 'adType',
  id: ColumnNameEnum.AD_TYPE,
  size: 160,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Ad Type
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.adType;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {getWalmartAdType(value)}
      </div>
    );
  },
};

export const TARGETING_TYPE_COLUMN: ColumnDef<ITargetingType> = {
  accessorKey: 'targetingType',
  id: ColumnNameEnum.TARGETING_TYPE,
  size: 160,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Targeting Type
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.targetingType;
    let targetingType;

    if (!value) return <div className="no-data-view">-</div>;

    if (typeof value === 'string') {
      targetingType = value.split(',').map((val) => val.trim());
    } else {
      targetingType = value;
    }

    if (Array.isArray(targetingType)) {
      return (
        <div
          className={`commonCell`}
          style={{ ...targetingTypeContainer, minHeight: '3.5rem' }}
        >
          {targetingType.map((item: string, index: number) => (
            <div key={index} style={targetingTypeBoxStyle}>
              {convertToUpperCase(item)}
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div
          className={`commonCell`}
          style={{ ...targetingTypeContainer, minHeight: '3.5rem' }}
        >
          <div style={targetingTypeBoxStyle}>
            {convertToUpperCase(targetingType)}
          </div>
        </div>
      );
    }
  },
};

export const START_DATE_COLUMN: ColumnDef<IStartDate> = {
  accessorKey: 'startDate',
  id: ColumnNameEnum.START_DATE,
  size: 150,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Start Date
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.startDate;

    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {getUSFormatDate(value)}
      </div>
    );
  },
};

export const END_DATE_COLUMN: ColumnDef<IEndDateColumn> = {
  accessorKey: 'endDate',
  id: ColumnNameEnum.END_DATE,
  size: 150,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        End Date
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value =
      row.original.endDate?.split('T')[0] === null ||
      row.original.endDate?.split('T')[0] === undefined
        ? ''
        : row.original.endDate?.split('T')[0];
    const campaignId = row.original.campaignId;
    const status = row.original.status;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        <EditAccessEndDate id={campaignId} endDate={value} status={status} />
      </div>
    );
  },
};

export const TOTAL_BUDGET_COLUMN: ColumnDef<ITotalBudget> = {
  accessorKey: 'totalBudget',
  id: ColumnNameEnum.TOTAL_BUDGET,
  size: 150,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Total Budget
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'totalBudget'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.totalBudget;
    const campaignId = row.original.campaignId;
    const budgetType = row.original.budgetType;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        <EditAccessTotalBudget
          id={campaignId}
          budget={(getValidNumber(value) ?? value) as number}
          budgetType={budgetType}
        />
      </div>
    );
  },
};

export const DAILY_BUDGET_COLUMN: ColumnDef<IDailyBudget> = {
  accessorKey: 'dailyBudget',
  id: ColumnNameEnum.DAILY_BUDGET,
  size: 150,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Daily Budget
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'dailyBudget'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.dailyBudget;
    const campaignId = row.original.campaignId;
    const budgetType = row.original.budgetType;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        <EditAccessDailyBudget
          id={campaignId}
          budget={(getValidNumber(value) ?? value) as number}
          budgetType={budgetType}
        />
      </div>
    );
  },
};

export const STATUS_COLUMN = (
  isWalmartKT: boolean,
  statusName: string
): ColumnDef<ITableStatus> => {
  return {
    accessorKey: 'status',
    id: ColumnNameEnum.STATUS,
    size: 120,
    meta: {
      filterLabel: `${statusName} Status`,
    },
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Status
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.status;
      const adType = row.original.adType;

      return (
        <div
          className={`commonCell`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '3.5rem',
          }}
        >
          <EditAccessStatus
            id={row.original.id as string | number}
            status={value}
            endDate={row.original.endDate}
            isWalmartKT={isWalmartKT}
            adType={adType}
          />
        </div>
      );
    },
  };
};

export const OVERALL_ADGROUP_NAME_VIEW_COLUMN: ColumnDef<IEditableAdGroupName> =
  {
    accessorKey: 'adGroupName',
    id: ColumnNameEnum.ADGROUP,
    size: 400,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textStartStyles}>
          Ad Group
        </div>
      );
    },
    footer: (props) => {
      return (
        <div className={`commonHeader`} style={textStartStyles}>
          {getFooterDisplayText(props)}
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const adGroupName = row.original.adGroupName;
      const adGroupType = row.original.adGroupType;

      if (!adGroupName) return <p className="no-data-view">-</p>;

      return (
        <div className={`commonCell`} style={textStartStyles}>
          <AdvertisingOverallAdGroupView
            campaignId={`${row.original.campaignId}`}
            adGroupName={adGroupName}
            adGroupId={`${row.original.adGroupId}`}
            adType={row.original.adType}
            adGroupType={adGroupType}
          />
        </div>
      );
    },
  };

export const OVERALL_ADGROUP_NAME_EDIT_COLUMN: ColumnDef<IEditableAdGroupName> =
  {
    accessorKey: 'adGroupName',
    id: ColumnNameEnum.ADGROUP,
    size: 400,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textStartStyles}>
          Ad Group
        </div>
      );
    },
    footer: (props) => {
      return (
        <div className={`commonHeader`} style={textStartStyles}>
          {getFooterDisplayText(props)}
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const adGroupName = row.original.adGroupName;
      const adGroupType = row.original.adGroupType;

      if (!adGroupName) return <p className="no-data-view">-</p>;

      return (
        <div className={`commonCell`} style={textStartStyles}>
          <AdvertisingOverallAdGroupEdit
            campaignId={`${row.original.campaignId}`}
            adGroupName={adGroupName}
            adGroupId={`${row.original.adGroupId}`}
            adType={row.original.adType}
            adGroupType={adGroupType}
          />
        </div>
      );
    },
  };

export const CAMPAIGN_STATUS_COLUMN: ColumnDef<ICampaignStatus> = {
  accessorKey: 'campaignStatus',
  id: ColumnNameEnum.CAMPAIGN_STATUS,
  size: 150,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Campaign Status
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.campaignStatus;

    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {convertToTitleCase(value)}
      </div>
    );
  },
};

export const LISTING_PRICE_COLUMN: ColumnDef<IListingPrice> = {
  accessorKey: 'listingPrice',
  id: ColumnNameEnum.LISTING_PRICE,
  size: 120,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Listing Price
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.listingPrice;

    if (value === null || value === undefined)
      return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {displayValue(formatNum(value), false)}
      </div>
    );
  },
};
export const KEYWORD_TEXT_COLUMN: ColumnDef<IKeywordText> = {
  accessorKey: 'keywordText',
  id: ColumnNameEnum.KEYWORD,
  size: 250,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        Keyword
      </div>
    );
  },
  footer: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        {getFooterDisplayText(props)}
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.keywordText;

    if (!value) return <div className="no-data-view">-</div>;

    let splitHeadingText = '';
    let splitDescText = '';
    const [heading, ...desc] = value.split(':');

    if (value.split(':').length > 1 && value.includes('Keyword Group')) {
      splitHeadingText = `${heading}: `;
      splitDescText = desc.join(':').trim();
    } else {
      splitDescText = value;
    }

    return (
      <div className={`commonCell`} style={textStartStyles}>
        <div
          className={styles.titleContainer}
          style={
            {
              ...textWrappingStyles,
              textAlign: 'left',
            } as React.CSSProperties
          }
        >
          <p className={styles.titleName} title={value}>
            <b>{splitHeadingText} </b>
            {splitDescText}
          </p>
        </div>
      </div>
    );
  },
};

export const WALMART_MATCH_TYPE_COLUMN: ColumnDef<IMatchType> = {
  accessorKey: 'matchType',
  id: ColumnNameEnum.MATCH_TYPE,
  size: 100,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Match Type
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.matchType;

    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {convertToTitleCase(value)}
      </div>
    );
  },
};

export const ADGROUP_STATUS_COLUMN: ColumnDef<IAdGroupStatus> = {
  accessorKey: 'adGroupStatus',
  id: ColumnNameEnum.ADGROUP_STATUS,
  size: 150,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        AdGroup Status
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.adGroupStatus;

    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {convertToTitleCase(value)}
      </div>
    );
  },
};

export const WALMART_KEYWORD_BID_COLUMN: ColumnDef<IBid> = {
  accessorKey: 'bid',
  id: ColumnNameEnum.BID,
  size: 120,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Bid
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const bid = row.original.bid;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        <EditAccessKeywordBid
          id={row.original.id as string | number}
          keywordBid={(getValidNumber(bid) ?? bid) as number}
          targetingType={row.original.targetingType}
        />
      </div>
    );
  },
};

export const AD_ITEM_COLUMN: ColumnDef<IWalmartItemName> = {
  accessorKey: 'itemName',
  id: ColumnNameEnum.PRODUCT_AD,
  size: 450,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        Product Ad
      </div>
    );
  },
  footer: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        {getFooterDisplayText(props)}
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const itemName = row.original.itemName ?? row.original.itemId;
    const itemId = row.original.itemId;
    const itemImageUrl = row.original.itemImageUrl;
    const sku = row.original.sku;
    const targetingType = row.original.targetingType;

    if (!itemName && !itemId) return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={itemNameContainerStyles}>
        <ImgComponent
          imageURL={itemImageUrl}
          alt={`${itemName ?? itemId ?? 'product'}`}
          customStyles={{
            width: '3rem',
            height: '3rem',
            marginRight: '1rem',
          }}
          isProduct={true}
        />

        <div
          className={styles.productNameContainer}
          style={
            {
              ...textWrappingStyles,
              textAlign: 'left',
            } as React.CSSProperties
          }
        >
          <a
            className={styles.productTitle}
            href={getProductUrl(itemId, MarketplaceEnum.WALMART)}
            target="_blank"
            rel="noreferrer"
          >
            <p title={itemName ?? itemId ?? sku}>{itemName ?? itemId ?? sku}</p>
          </a>
          <Typography
            variant="subtitle1"
            fontSize="1rem"
            fontWeight={400}
            className={styles.productSubtitle}
            gap={'1rem'}
            display={'flex'}
            alignItems={'center'}
          >
            <span>Item Id - {itemId}</span> <b>|</b>{' '}
            <span>SKU - {sku ?? 'NA'}</span>
          </Typography>
        </div>
      </div>
    );
  },
};

export const PRODUCT_BID_COLUMN: ColumnDef<IWalmartProductBid> = {
  accessorKey: 'bid',
  id: ColumnNameEnum.PRODUCT_BID,
  size: 120,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Product Bid
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const bid = row.original.bid;
    const adItemId = row.original.adItemId;
    const targetingType = row.original.targetingType as string;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        <EditAccessProductBid
          id={adItemId}
          productBid={(getValidNumber(bid) ?? bid) as number}
          targetingType={targetingType}
        />
      </div>
    );
  },
};

export const PAGE_TYPE_COLUMN: ColumnDef<IPageType> = {
  accessorKey: 'pageType',
  id: ColumnNameEnum.PAGE_TYPE,
  size: 200,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        Page Type
      </div>
    );
  },
  footer: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        {getFooterDisplayText(props)}
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.pageType;

    return (
      <div
        className={`commonCell ${styles.titleContainer}`}
        style={textStartStyles}
      >
        <p className={styles.titleName} title={value}>
          {getMappedPageType(value)}
        </p>
      </div>
    );
  },
};

export const PLATFORM_COLUMN: ColumnDef<IPlatform> = {
  accessorKey: 'platform',
  id: ColumnNameEnum.PLATFORM,
  size: 200,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        Platform
      </div>
    );
  },
  footer: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        {getFooterDisplayText(props)}
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.platform;

    return (
      <div
        className={`commonCell ${styles.titleContainer}`}
        style={textStartStyles}
      >
        <p className={styles.titleName} title={value}>
          {getMappedPageType(value)}
        </p>
      </div>
    );
  },
};

export const BID_MULTIPLIER_COLUMN = (
  isPageType = false
): ColumnDef<IBidMultiplier> => {
  return {
    accessorKey: 'multiplier',
    id: ColumnNameEnum.BID_MULTIPLIER,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Bid Multiplier
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const multiplier = row.original.multiplier;
      const id = `${row.original.id}`;
      const targetingType = row.original.targetingType;
      const pageType = row.original.pageType;
      const adType = row.original.adType;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          <EditAccessBidMultiplier
            id={id}
            bidMultiplier={Number(multiplier)}
            targetingType={targetingType}
            pageType={pageType}
            isPageType={isPageType}
            adType={adType}
          />
        </div>
      );
    },
  };
};

export const CAMPAIGN_NAME_COLUMN: ColumnDef<IEditableCampaignName> = {
  accessorKey: 'campaignName',
  id: ColumnNameEnum.CAMPAIGN,
  size: 400,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        Campaign
      </div>
    );
  },
  footer: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        {getFooterDisplayText(props)}
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const campaignName = row.original.campaignName;
    const campaignId = row.original.campaignId;
    const endDate = row.original.endDate;
    const messages = row.original.message;
    const targetingType = row.original.targetingType;
    const adType = row.original.adType;
    const tagId = row.original.tagId;

    if (!campaignName) return <p className="no-data-view">-</p>;

    return (
      <div className={`commonCell`} style={textStartStyles}>
        <EditAccessCampaignName
          campaignId={`${campaignId}`}
          campaignName={campaignName}
          endDate={endDate}
          messages={messages}
          targetingType={targetingType}
          adType={adType}
        />
      </div>
    );
  },
};

export const TOTAL_REMAINING_BUDGET_COLUMN: ColumnDef<ITotalRemainingBudget> = {
  accessorKey: 'totalRemainingBudget',
  id: ColumnNameEnum.TOTAL_REMAINING_BUDGET,
  size: 170,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Total Remaining Budget
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.totalRemainingBudget;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        <p className={styles.budgetView}>
          {displayValue(formatNum(value), false)}
        </p>
      </div>
    );
  },
};

export const DAILY_REMAINING_BUDGET_COLUMN: ColumnDef<IDailyRemainingBudget> = {
  accessorKey: 'dailyRemainingBudget',
  id: ColumnNameEnum.DAILY_REMAINING_BUDGET,
  size: 170,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Daily Remaining Budget
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.dailyRemainingBudget;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        <p className={styles.budgetView}>
          {displayValue(formatNum(value), false)}
        </p>
      </div>
    );
  },
};

export const SUGGESTED_TOTAL_BUDGET_COLUMN: ColumnDef<ISuggTotalBudget> = {
  accessorKey: 'suggestedLatestTotalBudget',
  id: ColumnNameEnum.SUGGESTED_TOTAL_BUDGET,
  size: 170,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Sugg. Total Budget
      </div>
    );
  },

  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'suggestedLatestTotalBudget'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.suggestedLatestTotalBudget;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        <p className={styles.budgetView}>
          {displayValue(formatNum(value), false)}
        </p>
      </div>
    );
  },
};

export const SUGGESTED_DAILY_BUDGET_COLUMN: ColumnDef<ISuggDailyBudget> = {
  accessorKey: 'suggestedLatestDailyBudget',
  id: ColumnNameEnum.SUGGESTED_DAILY_BUDGET,
  size: 170,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Sugg. Daily Budget
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'suggestedLatestDailyBudget'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.suggestedLatestDailyBudget;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        <p className={styles.budgetView}>
          {displayValue(formatNum(value), false)}
        </p>
      </div>
    );
  },
};

export const AVG_CAP_OUT_TIME: ColumnDef<IAvgCapOutTime> = {
  accessorKey: 'dailyOutOfBudgetDatetime',
  id: ColumnNameEnum.AVG_CAP_OUT_TIME,
  size: 170,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Avg. Cap-out Time
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.dailyOutOfBudgetDatetime;

    if (value === null || value === undefined)
      return <p className="no-data-view">-</p>;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        <p className={styles.budgetView}>
          {parseAsUtcAndConvert(value, TIME_FORMAT_4)} PST
        </p>
      </div>
    );
  },
};

export const ADGROUP_NAME_COLUMN: ColumnDef<IEditableAdGroupName> = {
  accessorKey: 'adGroupName',
  id: ColumnNameEnum.ADGROUP,
  size: 400,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        Ad Group
      </div>
    );
  },
  footer: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        {getFooterDisplayText(props)}
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const adGroupName = row.original.adGroupName;
    const adGroupId = row.original.adGroupId;
    const campaignId = row.original.campaignId;
    const adGroupType = row.original.adGroupType;

    if (!adGroupName) return <p className="no-data-view">-</p>;

    return (
      <div className={`commonCell`} style={textStartStyles}>
        <EditAccessAdGroupName
          campaignId={`${campaignId}`}
          adgroupId={`${adGroupId}`}
          adgroupName={adGroupName}
          adGroupType={adGroupType}
        />
      </div>
    );
  },
};

export const CAMPAIGN_NAME_COLUMN_VIEW_COLUMN: ColumnDef<IEditableCampaignName> =
  {
    accessorKey: 'campaignName',
    id: ColumnNameEnum.CAMPAIGN,
    size: 400,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textStartStyles}>
          Campaign
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const campaignName = row.original.campaignName;
      const campaignId = row.original.campaignId;
      const targetingType = row.original.targetingType;
      const adType = row.original.adType;
      const tagId = row.original.tagId;

      if (!campaignName) return <p className="no-data-view">-</p>;

      return (
        <div className={`commonCell`} style={textStartStyles}>
          <AdvertisingCampaignNameView
            campaignId={`${campaignId}`}
            campaignName={campaignName}
            targetingType={targetingType}
            adType={adType}
            tagId={tagId}
          />
        </div>
      );
    },
  };

export const ADGROUP_NAME_COLUMN_VIEW_COLUMN: ColumnDef<IEditableAdGroupName> =
  {
    accessorKey: 'adGroupName',
    id: ColumnNameEnum.ADGROUP,
    size: 400,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textStartStyles}>
          Ad Group
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const adGroupName = row.original.adGroupName;
      const adGroupId = row.original.adGroupId;
      const campaignId = row.original.campaignId;
      const adGroupType = row.original.adGroupType;

      if (!adGroupName) return <p className="no-data-view">-</p>;

      return (
        <div className={`commonCell`} style={textStartStyles}>
          <AdvertisingAdGroupNameView
            campaignId={`${campaignId}`}
            adgroupId={`${adGroupId}`}
            adgroupName={adGroupName}
            adGroupType={adGroupType}
          />
        </div>
      );
    },
  };

export const BIDDED_KEYWORD_TEXT_COLUMN: ColumnDef<IBiddedKeyword> = {
  accessorKey: 'biddedKeyword',
  id: ColumnNameEnum.KEYWORD,
  size: 250,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        Keyword
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.biddedKeyword;

    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div
        className={`commonCell ${styles.titleContainer}`}
        style={{
          ...textWrappingStyles,
          textAlign: 'left',
          ...textStartStyles,
        }}
      >
        <p className={styles.titleName} title={value}>
          {value}
        </p>
      </div>
    );
  },
};

export const AMAZON_BID_COLUMN: ColumnDef<IBid> = {
  accessorKey: 'bid',
  id: ColumnNameEnum.BID,
  size: 120,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Bid
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.bid;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        <EditAccessBid
          id={row.original.id as string | number}
          bid={(getValidNumber(value) ?? value) as number}
          targetingType={row.original.targetingType}
        />
      </div>
    );
  },
};

export const AMAZON_OVERALL_ADGROUP_STATUS_COLUMN: ColumnDef<IAmazonOverallAdGroupStatus> =
  {
    accessorKey: 'adGroupStatus',
    id: ColumnNameEnum.STATUS,
    size: 120,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Status
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.adGroupStatus;
      const adType = row.original.adType;

      return (
        <div
          className={`commonCell`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '3.5rem',
          }}
        >
          <EditAccessStatus
            id={row.original.id as string | number}
            status={value}
            endDate={row.original.endDate}
            adType={adType}
          />
        </div>
      );
    },
  };

export const AMAZON_OVERALL_AD_TYPE_COLUMN: ColumnDef<IAdType> = {
  accessorKey: 'adType',
  id: ColumnNameEnum.AD_TYPE,
  size: 160,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Ad Type
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.adType;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {getAmazonAdType(value)}
      </div>
    );
  },
};

export const AMAZON_OVERALL_CAMPAIGN_BUDGET_COLUMN: ColumnDef<IBudgetColumn> = {
  accessorKey: 'budget',
  id: ColumnNameEnum.BUDGET,
  size: 120,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Budget
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'budget'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = parseNum(row.original.budget);
    const campaignId = row.original.campaignId;
    const endDate = row.original.endDate;
    const budgetType = row.original.budgetType;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        <EditAccessBudget
          id={campaignId}
          budget={(getValidNumber(value) ?? value) as number}
          endDate={endDate as string}
          budgetType={budgetType}
        />
      </div>
    );
  },
};

export const AMAZON_OVERALL_DYNAMIC_BIDDING_COLUMN: ColumnDef<IOverallStrategyColumn> =
  {
    accessorKey: 'strategy',
    id: ColumnNameEnum.BIDDING_STRATEGY,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Bidding Strategy
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.strategy;
      const campaignId = row.original.campaignId;
      const endDate = row.original.endDate;

      if (!value) return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          <EditAccessBiddingStrategy
            id={campaignId}
            strategy={value}
            endDate={endDate as string}
          />
        </div>
      );
    },
  };

export const AMAZON_OVERALL_PRODUCT_NAME_COLUMN: ColumnDef<IAmazonOverallItemNameColumn> =
  {
    accessorKey: 'itemName',
    id: ColumnNameEnum.PRODUCT_AD,
    size: 400,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textStartStyles}>
          Product Ad
        </div>
      );
    },
    footer: (props) => {
      return (
        <div className={`commonHeader`} style={textStartStyles}>
          {getFooterDisplayText(props)}
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const eligibility = row.original.eligibility;
      const itemName =
        row.original.itemName !== null
          ? row.original.itemName
          : row.original.asin;
      const asin = row.original.asin;
      const landingPageURL = row.original.landingPage?.url;
      const adType = row.original.adType;

      if (!itemName && !asin) return <div className="no-data-view">-</div>;

      if (
        adType?.toUpperCase() === AdTypeShort.SPONSORED_PRODUCTS ||
        adType === AdType.SPONSORED_PRODUCTS
      ) {
        return (
          <div className={`commonCell`} style={textStartStyles}>
            <div style={itemNameContainerStyles}>
              <ImgComponent
                alt={`${itemName ?? asin ?? 'product'}`}
                imageURL={getProductImgUrl(asin ?? '')}
                customStyles={imageStyles}
                isProduct={true}
              />

              <div className={styles.productNameContainer}>
                <a
                  className={styles.productTitle}
                  href={getProductUrl(asin ?? '', MarketplaceEnum.AMAZON)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <p title={itemName ? itemName : asin ? asin : landingPageURL}>
                    {itemName ? itemName : asin ? asin : landingPageURL}
                  </p>
                </a>
                <Typography
                  variant="subtitle1"
                  fontSize="1rem"
                  fontWeight={400}
                  className={styles.productSubtitle}
                >
                  ASIN - {asin} | {getAdsEligibility(eligibility)}
                </Typography>
              </div>
            </div>
          </div>
        );
      }

      if (
        adType?.toUpperCase() === AdTypeShort.SPONSORED_BRANDS ||
        adType === AdType.SPONSORED_BRANDS ||
        adType?.toUpperCase() === AdTypeShort.SPONSORED_DISPLAY ||
        adType === AdType.SPONSORED_DISPLAY
      ) {
        return (
          <div className={`commonCell`} style={textStartStyles}>
            <div style={itemNameContainerStyles}>
              {asin !== null && asin !== undefined && (
                <ImgComponent
                  alt={`${itemName ?? asin ?? 'product'}`}
                  imageURL={getProductImgUrl(asin)}
                  customStyles={imageStyles}
                  isProduct={true}
                />
              )}
              <div className={styles.productNameContainer}>
                <a
                  className={styles.productTitle}
                  href={
                    landingPageURL
                      ? landingPageURL
                      : getProductUrl(asin ?? '', MarketplaceEnum.AMAZON)
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <p title={itemName ? itemName : asin ? asin : landingPageURL}>
                    {itemName ? itemName : asin ? asin : landingPageURL}
                  </p>
                </a>
                {asin !== null && asin !== undefined && (
                  <Typography
                    variant="subtitle1"
                    fontSize="1rem"
                    fontWeight={400}
                    className={styles.productSubtitle}
                  >
                    ASIN - {asin} | {getAdsEligibility(eligibility)}
                  </Typography>
                )}
              </div>
            </div>
          </div>
        );
      }
    },
  };

export const AMAZON_PRODUCT_TARGETING_NAME_COLUMN: ColumnDef<ITargeting> = {
  accessorKey: 'targeting',
  id: ColumnNameEnum.TARGETING,
  size: 300,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        Targeting
      </div>
    );
  },
  footer: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        {getFooterDisplayText(props)}
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.targeting;
    const isPinned = props.column.getIsPinned() === false;

    if (!value) return <div className="no-data-view">-</div>;

    return (
      <AdvertisingTargetingNameView
        targetingValue={value}
        isPinned={isPinned}
      />
    );
  },
};

export const DEFAULT_BID_COLUMN: ColumnDef<IDefaultBid> = {
  accessorKey: 'defaultBid',
  id: ColumnNameEnum.DEFAULT_BID,
  size: 120,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Default Bid
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.defaultBid;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        <EditAccessDefaultBid
          id={row.original.id as string | number}
          defaultBid={(getValidNumber(value) ?? value) as number}
          targetingType={row.original.targetingType}
        />
      </div>
    );
  },
};

export const AMAZON_SP_DYNAMIC_BIDDING_COLUMN: ColumnDef<IAmazonSPDynamicBidding> =
  {
    accessorKey: 'dynamicBidding.strategy',
    id: ColumnNameEnum.BIDDING_STRATEGY,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Bidding Strategy
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.dynamicBidding.strategy;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          <EditAccessBiddingStrategy
            id={row.original.campaignId}
            strategy={value ?? ''}
            endDate={row.original.endDate as string}
          />
        </div>
      );
    },
  };

export const CAMPAIGN_SP_BUDGET_COLUMN: ColumnDef<IAmazonSPBudgetColumn> = {
  accessorKey: 'budget',
  id: ColumnNameEnum.BUDGET,
  size: 120,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Budget
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'budget'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.budget.budget;
    const budgetType = row.original.budget.budgetType;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        <EditAccessBudget
          id={row.original.campaignId}
          budget={getValidNumber(value) ?? (value as number)}
          endDate={row.original.endDate as string}
          budgetType={budgetType}
        />
      </div>
    );
  },
};

export const OUT_OF_BUDGET_TIME_COLUMN: ColumnDef<IOutOfBudgetTime> = {
  accessorKey: 'outOfBudgetTime',
  id: ColumnNameEnum.OUT_OF_BUDGET_TIME,
  size: 180,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Out of Budget Time
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.outOfBudgetTime;

    if (value === null || value === undefined)
      return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        <p className={styles.budgetView}>
          {changeDateFormat(value, DATE_FORMAT_7, DATE_FORMAT_8)}
        </p>
      </div>
    );
  },
};

export const AMAZON_SP_ITEM_NAME_COLUMN: ColumnDef<IAmazonSPProductName> = {
  accessorKey: 'itemName',
  id: ColumnNameEnum.PRODUCT_AD,
  size: 300,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        Product Ad
      </div>
    );
  },
  footer: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        {getFooterDisplayText(props)}
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const eligibility = row.original.eligibility;
    const itemName = row.original.itemName;
    const asin = row.original.asin ?? '';

    return (
      <div className={`commonCell`} style={textStartStyles}>
        <div style={itemNameContainerStyles}>
          <ImgComponent
            imageURL={getProductImgUrl(asin)}
            alt={`${itemName ?? asin ?? 'product'}`}
            customStyles={imageStyles}
            isProduct={true}
          />
          <div className={styles.productNameContainer}>
            <a
              className={styles.productTitle}
              href={getProductUrl(asin, MarketplaceEnum.AMAZON)}
              target="_blank"
              rel="noreferrer"
            >
              <p title={itemName ?? asin}>{itemName ?? asin}</p>
            </a>
            <Typography
              variant="subtitle1"
              fontSize="1rem"
              fontWeight={400}
              className={styles.productSubtitle}
            >
              ASIN - {asin} | {getAdsEligibility(eligibility)}
            </Typography>
          </div>
        </div>
      </div>
    );
  },
};

export const AMAZON_MATCH_TYPE_COLUMN: ColumnDef<IMatchType> = {
  accessorKey: 'matchType',
  id: ColumnNameEnum.MATCH_TYPE,
  size: 150,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Match Type
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.matchType;

    if (!value) return <div className="no-data-view">-</div>;

    const matchTypeLabel = AMAZON_MATCH_TYPE_MAPPING[value];

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {matchTypeLabel ?? '-'}
      </div>
    );
  },
};

export const AMAZON_TARGETING_NAME_COLUMN: ColumnDef<ITargeting> = {
  accessorKey: 'targeting',
  id: ColumnNameEnum.TARGETING,
  size: 300,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        Targeting
      </div>
    );
  },
  footer: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        {getFooterDisplayText(props)}
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.targeting;

    if (value === null || value === undefined)
      return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={textStartStyles}>
        <div className={styles.titleContainer}>
          <p className={styles.titleName} title={value}>
            {value}
          </p>
        </div>
      </div>
    );
  },
};

export const AMAZON_NEG_TARGETING_MATCH_TYPE_COLUMN: ColumnDef<IMatchType> = {
  accessorKey: 'matchType',
  id: ColumnNameEnum.MATCH_TYPE,
  size: 240,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Match Type
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.matchType;

    if (value === null || value === undefined)
      return <div className="no-data-view">-</div>;

    const matchTypeLabel = AMAZON_MATCH_TYPE_MAPPING[value];

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {matchTypeLabel ?? '-'}
      </div>
    );
  },
};

export const AMAZON_NEG_TARGETING_CREATION_DATE_COLUMN: ColumnDef<ICreationDateTime> =
  {
    accessorKey: 'creationDateTime',
    id: ColumnNameEnum.CREATION_DATE,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Creation Date
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.creationDateTime;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {getUSFormatDate(value)}
        </div>
      );
    },
  };

export const AMAZON_SEARCH_TERM_COLUMN: ColumnDef<ISearchTerm> = {
  accessorKey: 'searchTerm',
  id: ColumnNameEnum.SEARCH_TERM,
  size: 300,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        Search Term
      </div>
    );
  },
  footer: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        {getFooterDisplayText(props)}
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.searchTerm;

    if (!value) return <div className="no-data-view">-</div>;

    return <AdvertisingTargetingNameView targetingValue={value} />;
  },
};

export const WALMART_SEARCH_TERM_COLUMN: ColumnDef<ISearchTerm> = {
  accessorKey: 'searchTerm',
  id: ColumnNameEnum.SEARCH_TERM,
  size: 300,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        Search Term
      </div>
    );
  },
  footer: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        {getFooterDisplayText(props)}
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.searchTerm;

    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div
        className={`commonCell ${styles.titleContainer}`}
        style={textStartStyles}
      >
        <p className={styles.titleName} title={value}>
          {value}
        </p>
      </div>
    );
  },
};

export const KEYWORD_COLUMN: ColumnDef<IKeyword> = {
  accessorKey: 'keyword',
  id: ColumnNameEnum.KEYWORD,

  size: 250,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        Keyword
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.keyword;

    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={textStartStyles}>
        <div className={styles.titleContainer}>
          <p className={styles.titleName} title={value}>
            {value}
          </p>
        </div>
      </div>
    );
  },
};

export const CAMPAIGN_BUDGET_COLUMN: ColumnDef<IBudgetColumn> = {
  accessorKey: 'budget',
  id: ColumnNameEnum.BUDGET,
  size: 120,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Budget
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'budget'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.budget;
    const budgetType = row.original.budgetType;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        <EditAccessBudget
          id={row.original.campaignId}
          budget={(getValidNumber(value) ?? value) as number}
          endDate={row.original.endDate as string}
          budgetType={budgetType}
        />
      </div>
    );
  },
};

export const AMAZON_SB_ITEM_NAME_COLUMN: ColumnDef<IAmazonSBCreativeAdColumn> =
  {
    accessorKey: 'name',
    id: ColumnNameEnum.PRODUCT_AD,
    size: 300,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textStartStyles}>
          Product Ad
        </div>
      );
    },
    footer: (props) => {
      return (
        <div className={`commonHeader`} style={textStartStyles}>
          {getFooterDisplayText(props)}
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const type = row.original.creativeType;
      const videoAssetIds = row.original.videoAssetIds;
      const name = row.original.name;
      const asins = row.original.asinEligibility;

      if (!name) return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textStartStyles}>
          <AdvertisingCreativeView
            creativeType={type}
            videoAssetIds={videoAssetIds}
            name={name}
            asinEligibility={asins}
          />
        </div>
      );
    },
  };

export const AMAZON_SB_CREATIVE_ASIN_COLUMN: ColumnDef<ISBProductAdsAsins> = {
  accessorKey: 'asins',
  id: ColumnNameEnum.CREATIVE_ASINS,
  size: 250,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        Creative Asins
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.asinEligibility;

    return (
      <div className={`commonCell`} style={textStartStyles}>
        <div style={{ ...multiItemsContainerStyles, flexDirection: 'column' }}>
          <CreativeAsinsSb asinEligibility={value} />
        </div>
      </div>
    );
  },
};

export const AMAZON_SB_LANDING_PAGE_TYPE_COLUMN: ColumnDef<IAmazonSBLandingPage> =
  {
    accessorKey: 'landingPage.pageType',
    id: ColumnNameEnum.LANDING_PAGE_TYPE,
    size: 200,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Landing Page Type
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.landingPage?.pageType ?? '';
      const url = row.original.landingPage?.url ?? '';

      if (!value) return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          <a
            className={styles.productTitle}
            style={{ color: '#77469B' }}
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            <p title={value}>{value}</p>
          </a>
        </div>
      );
    },
  };

export const AMAZON_SB_SERVING_STATUS_COLUMN: ColumnDef<IAmazonSBProductAdsExtendedData> =
  {
    accessorKey: 'extendedData.servingStatus',
    id: ColumnNameEnum.SERVING_STATUS,
    size: 200,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Serving Status
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.extendedData?.servingStatus;

      if (!value) return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {value}
        </div>
      );
    },
  };

export const AMAZON_KEYWORD_STATUS_COLUMN: ColumnDef<IKeywordStatus> = {
  accessorKey: 'keywordStatus',
  id: ColumnNameEnum.STATUS,
  size: 120,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Status
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.keywordStatus;
    const isChecked = value?.toUpperCase() === CampaignStateEnum.ENABLED;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        <AntSwitch
          disabled={true}
          checked={isChecked}
          onChange={() => {
            return;
          }}
          inputProps={{ 'aria-label': 'ant design' }}
          sx={{
            '&:hover': { cursor: 'not-allowed' },
          }}
        />
      </div>
    );
  },
};

export const AMAZON_CREATIVE_ASIN_COLUMN: ColumnDef<ISBProductAdsAsins> = {
  accessorKey: 'asins',
  id: ColumnNameEnum.ASINS,
  size: 250,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        Asins
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.asinEligibility;

    return (
      <div className={`commonCell`} style={textStartStyles}>
        <div style={{ ...multiItemsContainerStyles, flexDirection: 'column' }}>
          <CreativeAsinsSb asinEligibility={value} />
        </div>
      </div>
    );
  },
};

export const AMAZON_CREATIVE_STATUS_COLUMN: ColumnDef<ICreativeStatus> = {
  accessorKey: 'status',
  id: ColumnNameEnum.STATUS,
  size: 120,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Status
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.status;

    if (value === null || value === undefined)
      return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {getTitleCaseString(value)}
      </div>
    );
  },
};

export const AMAZON_CREATIVE_CREATION_DATE_COLUMN: ColumnDef<ICreationDate> = {
  accessorKey: 'creationDate',
  id: ColumnNameEnum.CREATION_DATE,
  size: 200,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Creation Date
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.creationDate;

    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {value}
      </div>
    );
  },
};

export const AMAZON_CREATIVE_LAST_UPDATED_DATE_COLUMN: ColumnDef<ILastUpdatedDate> =
  {
    accessorKey: 'lastUpdatedDate',
    id: ColumnNameEnum.LAST_UPDATED_DATE,
    size: 200,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Last Updated Date
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.lastUpdatedDate;

      if (!value) return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {value}
        </div>
      );
    },
  };

export const CAMPAIGN_COST_TYPE_COLUMN: ColumnDef<ICostType> = {
  accessorKey: 'costType',
  id: ColumnNameEnum.COST_TYPE,
  size: 120,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Cost Type
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.costType;

    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {value?.toUpperCase()}
      </div>
    );
  },
};

export const AMAZON_SD_CAMPAIGN_TACTIC_COLUMN: ColumnDef<ITactic> = {
  accessorKey: 'tactic',
  id: ColumnNameEnum.TACTIC,
  size: 200,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Tactic
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.tactic;

    if (!value) return <div className="no-data-view">-</div>;

    const tacticLabel = sdTacticOptions.filter(
      (tactic) => tactic.value === value
    )[0]?.label;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {tacticLabel ? tacticLabel : '-'}
      </div>
    );
  },
};

export const AMAZON_SD_BID_OPTIMIZATION_COLUMN: ColumnDef<IBidOptimization> = {
  accessorKey: 'bidOptimization',
  id: ColumnNameEnum.BID_OPTIMIZATION,
  size: 180,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Bid Optimization
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.bidOptimization;

    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {getTitleCaseString(value)}
      </div>
    );
  },
};

export const AMAZON_SD_ADGROUP_TACTIC_COLUMN: ColumnDef<ITactic> = {
  accessorKey: 'tactic',
  id: ColumnNameEnum.TACTIC,
  size: 200,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Tactic
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.tactic;

    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {getSDTactic(value)}
      </div>
    );
  },
};

export const AMAZON_SD_CREATIVE_TYPE_COLUMN: ColumnDef<ICreativeType> = {
  accessorKey: 'creativeType',
  id: ColumnNameEnum.CREATIVE_TYPE,
  size: 150,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Creative Type
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.creativeType;

    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {value?.toUpperCase()}
      </div>
    );
  },
};

export const AMAZON_SD_AD_NAME_COLUMN: ColumnDef<IAmazonSDProductNameColumn> = {
  accessorKey: 'adName',
  id: ColumnNameEnum.PRODUCT_AD,
  size: 350,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        Product Ad
      </div>
    );
  },
  footer: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        {getFooterDisplayText(props)}
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const eligibility = row.original.eligibility;
    const adName = row.original.adName;
    const landingPageURL = row.original.landingPageURL;
    const asin = row.original.asin;
    const itemName = row.original.itemName;

    if (!adName && !asin && !itemName)
      return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={textStartStyles}>
        <div style={itemNameContainerStyles}>
          {adName === null && asin !== null && asin !== undefined && (
            <ImgComponent
              alt={`${itemName ?? asin ?? 'product'}`}
              imageURL={getProductImgUrl(asin)}
              customStyles={imageStyles}
              isProduct={true}
            />
          )}
          <div className={styles.productNameContainer}>
            <a
              className={styles.productTitle}
              href={
                landingPageURL
                  ? landingPageURL
                  : getProductUrl(asin ?? '', MarketplaceEnum.AMAZON)
              }
              target="_blank"
              rel="noreferrer"
            >
              <p
                title={
                  adName
                    ? adName
                    : itemName
                    ? itemName
                    : asin
                    ? asin
                    : landingPageURL
                    ? landingPageURL
                    : '-'
                }
              >
                {adName
                  ? adName
                  : itemName
                  ? itemName
                  : asin
                  ? asin
                  : landingPageURL
                  ? landingPageURL
                  : '-'}
              </p>
            </a>
            {asin !== null && asin !== undefined && (
              <Typography
                variant="subtitle1"
                fontSize="1rem"
                fontWeight={400}
                className={styles.productSubtitle}
              >
                ASIN - {asin} | {getAdsEligibility(eligibility)}
              </Typography>
            )}
          </div>
        </div>
      </div>
    );
  },
};

export const PLACEMENT_NAME_COLUMN: ColumnDef<IPlacementName> = {
  accessorKey: 'placement',
  id: ColumnNameEnum.PLACEMENT,
  size: 200,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        Placement
      </div>
    );
  },
  footer: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        {getFooterDisplayText(props)}
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.placement;

    if (value === null || value === undefined)
      return <div className="no-data-view">-</div>;

    return (
      <div
        className={`commonCell ${styles.titleContainer}`}
        style={textStartStyles}
      >
        <p className={styles.titleName} title={value}>
          {value}
        </p>
      </div>
    );
  },
};

export const PLACEMENT_BID_ADJUSTMENT_COLUMN: ColumnDef<IPercentage> = {
  accessorKey: 'percentage',
  id: ColumnNameEnum.BID_ADJUSTMENT,
  size: 150,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Bid Adjustment
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.percentage;

    if (value === null || value === undefined)
      return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {displayValue(formatNum(value))}
      </div>
    );
  },
};

export const AMAZON_STRATEGY_VIEW_COLUMN: ColumnDef<IStrategy> = {
  accessorKey: 'strategy',
  id: ColumnNameEnum.BIDDING_STRATEGY,
  size: 150,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Bidding Strategy
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.strategy;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        <BiddingStrategyView strategy={value ?? ''} />
      </div>
    );
  },
};

export const WALMART_BUDGET_TYPE_COLUMN: ColumnDef<IBudgetType> = {
  accessorKey: 'budgetType',
  id: ColumnNameEnum.BUDGET_TYPE,
  size: 160,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        {ColumnNameEnum.BUDGET_TYPE}
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.budgetType;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {getTitleCaseString(value)}
      </div>
    );
  },
};

export const RULE_AUTOMATION_STATUS_COLUMN: ColumnDef<IRuleAutomationStatus> = {
  accessorKey: 'automationStatus',
  id: ColumnNameEnum.AUTOMATION_STATUS,
  size: 120,
  meta: {
    filterLabel: 'Automation Status',
  },
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Automation Status
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.automationStatus;

    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div
        className={`commonCell`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '3.5rem',
        }}
      >
        <EditAccessRuleAutomationStatus
          id={row.original.id as string | number}
          status={value}
          automationStatusFieldName="automationStatus"
        />
      </div>
    );
  },
};

export const RULE_ENTITY_LINK_STATUS_COLUMN = (
  campaignSubHeaderData?:
    | ICampaign
    | ISBCampaign
    | ISDCampaign
    | IWalmartCampaign
    | IWalmartSVCampaign
    | null
): ColumnDef<IRuleEntityLinkStatus> => {
  return {
    accessorKey: 'ruleEntityLinkStatus',
    id: ColumnNameEnum.AUTOMATION_STATUS,
    size: 120,
    meta: {
      filterLabel: 'Automation Status',
    },
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Automation Status
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.ruleEntityLinkStatus;

      if (!value) return <div className="no-data-view">-</div>;

      let campaignAutomationStatus = null;

      if (!campaignSubHeaderData) {
        campaignAutomationStatus = null;
      } else {
        campaignAutomationStatus = campaignSubHeaderData.automationStatus;
      }

      return (
        <div
          className={`commonCell`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '3.5rem',
          }}
        >
          <EditAccessRuleAutomationStatus
            id={row.original.id as string | number}
            status={value}
            campaignAutomationStatus={campaignAutomationStatus}
            automationStatusFieldName="ruleEntityLinkStatus"
          />
        </div>
      );
    },
  };
};

export const RULE_NAME_COLUMN: ColumnDef<IRuleName> = {
  accessorKey: 'ruleName',
  id: ColumnNameEnum.RULE_NAME,
  size: 200,
  meta: {
    filterLabel: 'Rule Name',
  },
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        Rule Name
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.ruleName;
    const ruleId = row.original.ruleId;

    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={textStartStyles}>
        <AdvertisingRuleNameView ruleName={value} ruleId={ruleId} />
      </div>
    );
  },
};

export const RULE_TYPE_COLUMN: ColumnDef<IRuleType> = {
  accessorKey: 'ruleType',
  id: ColumnNameEnum.RULE_TYPE,
  size: 200,
  meta: {
    filterLabel: 'Rule Type',
  },
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Rule Type
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const ruleType = row.original.ruleType;

    if (!ruleType) return <p className="no-data-view">-</p>;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {RULE_TYPE_LABEL_MAPPING[ruleType] ?? ruleType}
      </div>
    );
  },
};

export const RULE_NEXT_EXECUTION_COLUMN: ColumnDef<INextExecutionAt> = {
  accessorKey: 'nextExecutionAt',
  id: ColumnNameEnum.NEXT_EXECUTION,
  size: 200,
  meta: {
    filterLabel: 'Next Execution',
  },
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Next Execution
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.nextExecutionAt;

    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {convertUtcToTimezoneDate(value)}
      </div>
    );
  },
};

export const SL_NO_COLUMN = <T,>(): ColumnDef<T> => ({
  accessorKey: 'slNo',
  id: 'Sl No.',
  size: 50,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Sl No.
      </div>
    );
  },
  cell: (props) => {
    const index = props.row.index;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {index + 1}.
      </div>
    );
  },
  enableSorting: false,
  enableColumnFilter: false,
  enableGlobalFilter: false,
  enableGrouping: false,
  enableHiding: false,
  enableMultiSort: false,
  enablePinning: false,
  enableResizing: false,
});
