import { TargetingActionTypeEnum } from '@/enums/keyword-action.enums';
import { ColumnDef } from '@tanstack/react-table';
import { AMAZON_METRICS_COLUMNS } from 'src/constants/table-columns/new-column-names.constants';
import { KEYWORD_ACTIONS_TOOLTIPS } from 'src/enums/tooltip-texts.enums';
import {
  IKeywordActionData,
  IProductActionsData,
} from 'src/interfaces/keyword-actions.interface';
import InfoIcon from '../info-icon/info-icon';
import KeywordActionTargetAdGroup from './adgroup/keyword-actions-target-adgroup';
import KeywordActionArchive from './archive/keyword-action-archive';
import KeywordActionTargetCampaign from './campaign/keyword-actions-target-campaign';
import KeywordActionCustomBid from './custom-bid/keyword-action-custom-bid-wrapper';
import {
  customBidContainer,
  matchTypeContainer,
  normalizedKeywordStyles,
  textWrappingStyles,
} from './keyword-actions-table-styles';
import KeywordActionMatchType from './match-type/keyword-action-match-type';
import KeywordActionSearchTermAmazon from './search-term/keyword-action-search-term-amazon';
import KeywordActionSearchTermWalmart from './search-term/keyword-action-search-term-walmart';
import { ProductActionTargetingOpportunitiesAmazon } from './targeting-opportunities/product-action-targeting-opportunities-amazon';

export const SEARCH_TERM_COLUMN: ColumnDef<
  IKeywordActionData | IProductActionsData
> = {
  accessorKey: 'searchTerm',
  id: 'Search Term',
  size: 200,
  header: (props) => {
    return (
      <div
        className={`commonHeader`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Search Term
        <InfoIcon title={KEYWORD_ACTIONS_TOOLTIPS.SEARCH_TERM} />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const targetingActionType = row.original.targetingActionType;

    let content = null;

    const searchTerm = row.original.searchTerm;
    const adGroupCount = row.original.adGroupCount;
    const tag = row.original.tag;
    const id = row.original.id;

    switch (targetingActionType) {
      case TargetingActionTypeEnum.KEYWORD_ACTIONS: {
        content = (
          <KeywordActionSearchTermAmazon
            searchTerm={searchTerm}
            adGroupCount={adGroupCount}
            tag={tag}
            id={id}
          />
        );
        break;
      }
      case TargetingActionTypeEnum.PRODUCT_ACTIONS: {
        content = (
          <div
            style={{
              width: '100%',
            }}
          >
            <ProductActionTargetingOpportunitiesAmazon
              {...(row.original as IProductActionsData)}
            />
          </div>
        );
        break;
      }
    }

    return content;
  },
};

export const WALMART_SEARCH_TERM_COLUMN: ColumnDef<IKeywordActionData> = {
  accessorKey: 'searchTerm',
  id: 'Search Term',
  size: 200,
  header: (props) => {
    return (
      <div
        className={`commonHeader`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Search Term
        <InfoIcon title={KEYWORD_ACTIONS_TOOLTIPS.SEARCH_TERM} />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const searchTerm = row.original.searchTerm;
    const adGroupCount = row.original.adGroupCount;
    const tag = row.original.tag;
    const id = row.original.id;
    return (
      <KeywordActionSearchTermWalmart
        searchTerm={searchTerm}
        adGroupCount={adGroupCount}
        tag={tag}
        id={id}
      />
    );
  },
};

export const NORMALIZED_TERM_COLUMN: ColumnDef<IKeywordActionData> = {
  accessorKey: 'normalizedKeyword',
  id: 'Normalized Term',
  size: 200,
  header: (props) => {
    return (
      <div
        className={`commonHeader`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Normalized Term
        <InfoIcon title={KEYWORD_ACTIONS_TOOLTIPS.NORMALIZED_TERM} />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const normalizedKeyword = row.original.normalizedKeyword;

    return (
      <div style={normalizedKeywordStyles}>
        <span>{normalizedKeyword}</span>
      </div>
    );
  },
};

export const SOURCE_CAMPAIGN_NAME_COLUMN: ColumnDef<IKeywordActionData> = {
  accessorKey: 'sourceCampaignName',
  id: 'Source Campaign',
  size: 200,
  header: (props) => {
    return (
      <div
        className={`commonHeader`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Source Campaign
        <InfoIcon title={KEYWORD_ACTIONS_TOOLTIPS.SOURCE_CAMPAIGN} />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const campaignName = row.original.sourceCampaignName;

    return (
      <div style={textWrappingStyles as React.CSSProperties}>
        <span className="commonCell">{campaignName}</span>
      </div>
    );
  },
};

export const SOURCE_ADGROUP_NAME_COLUMN: ColumnDef<IKeywordActionData> = {
  accessorKey: 'sourceAdGroupName',
  id: 'Source AdGroup',
  size: 200,
  header: (props) => {
    return (
      <div
        className={`commonHeader`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Source AdGroup
        <InfoIcon title={KEYWORD_ACTIONS_TOOLTIPS.SOURCE_AD_GROUP} />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const adGroupName = row.original.sourceAdGroupName;

    return (
      <div style={textWrappingStyles as React.CSSProperties}>
        <span className="commonCell">{adGroupName}</span>
      </div>
    );
  },
};

export const TARGET_CAMPAIGN_COLUMN: ColumnDef<IKeywordActionData> = {
  accessorKey: 'targetCampaignName',
  id: 'Target Campaign',
  size: 250,
  header: (props) => {
    return (
      <div
        className={`commonHeader`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Target Campaign
        <InfoIcon title={KEYWORD_ACTIONS_TOOLTIPS.TARGET_CAMPAIGN} />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const targetCampaigns = row.original.targetCampaigns;
    const id = Number(row.id);

    return (
      <KeywordActionTargetCampaign
        rowId={id}
        targetCampaigns={targetCampaigns}
      />
    );
  },
};

export const TARGET_ADGROUP_COLUMN: ColumnDef<IKeywordActionData> = {
  accessorKey: 'targetAdGroupName',
  id: 'Target AdGroup',
  size: 250,
  header: (props) => {
    return (
      <div
        className={`commonHeader`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Target AdGroup
        <InfoIcon title={KEYWORD_ACTIONS_TOOLTIPS.TARGET_AD_GROUP} />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const id = Number(row.id);

    return <KeywordActionTargetAdGroup rowId={id} />;
  },
};

export const MATCH_TYPE_TO_ADD_COLUMN: ColumnDef<IKeywordActionData> = {
  accessorKey: 'matchTypeToAdd',
  id: 'Match Type to Add',
  enableSorting: false,
  size: 190,
  header: (props) => {
    return (
      <div
        className={`commonHeader`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Match Type to Add
        <InfoIcon title={KEYWORD_ACTIONS_TOOLTIPS.MATCH_TYPE_TO_ADD} />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const id = Number(row.id);

    return (
      <div style={matchTypeContainer}>
        <KeywordActionMatchType rowId={id} />
      </div>
    );
  },
};

export const CUSTOM_BID_COLUMN: ColumnDef<IKeywordActionData> = {
  accessorKey: 'customBid',
  id: 'Bid',
  size: 150,
  enableSorting: false,
  header: (props) => {
    return (
      <div
        className={`commonHeader`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Bid
        <InfoIcon title={KEYWORD_ACTIONS_TOOLTIPS.BID} />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const id = Number(row.id);
    const matchTypeToAdd = row.original.matchTypeToAdd;

    return (
      <div style={customBidContainer}>
        <KeywordActionCustomBid rowId={id} matchTypes={matchTypeToAdd} />
      </div>
    );
  },
};

export const ARCHIVE_COLUMN: ColumnDef<IKeywordActionData> = {
  accessorKey: 'archive',
  id: 'Archive',
  enableSorting: false,
  size: 100,
  header: (props) => {
    return (
      <div
        className={`commonHeader`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Archive
        <InfoIcon title={KEYWORD_ACTIONS_TOOLTIPS.ARCHIVE} />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const id = Number(row.id);
    const targetActionType = row.original.targetingActionType;

    return (
      <KeywordActionArchive rowId={id} targetActionType={targetActionType} />
    );
  },
};

export const TAG_COLUMN: ColumnDef<IKeywordActionData> = {
  accessorKey: 'tag',
  id: 'Tag',
  size: 100,
  header: (props) => {
    return (
      <div
        className={`commonHeader`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Tag
        <InfoIcon title={KEYWORD_ACTIONS_TOOLTIPS.ARCHIVE} />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    return row.original.tag;
  },
};

export const ADGROUP_COUNT_COLUMN: ColumnDef<IKeywordActionData> = {
  accessorKey: 'adGroupCount',
  id: 'Ad Group Count',
  size: 100,
  header: (props) => {
    return (
      <div
        className={`commonHeader`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Ad Group Count
        <InfoIcon title={KEYWORD_ACTIONS_TOOLTIPS.ARCHIVE} />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    return row.original.adGroupCount;
  },
};

export const ASIN_TITLE_COLUMN: ColumnDef<IKeywordActionData> = {
  accessorKey: 'title',
  id: 'Title',
  size: 100,
  header: (props) => {
    return (
      <div
        className={`commonHeader`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Title
        <InfoIcon title={KEYWORD_ACTIONS_TOOLTIPS.ARCHIVE} />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    return row.original.adGroupCount;
  },
};

export const BRAND_NAME_COLUMN: ColumnDef<IKeywordActionData> = {
  accessorKey: 'brandName',
  id: 'Brand Name',
  size: 100,
  header: (props) => {
    return (
      <div
        className={`commonHeader`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Brand Name
        <InfoIcon title={KEYWORD_ACTIONS_TOOLTIPS.ARCHIVE} />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    return row.original.adGroupCount;
  },
};

export const ASIN_PRICE_COLUMN: ColumnDef<IKeywordActionData> = {
  accessorKey: 'price',
  id: 'Price',
  size: 100,
  header: (props) => {
    return (
      <div
        className={`commonHeader`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Price
        <InfoIcon title={KEYWORD_ACTIONS_TOOLTIPS.ARCHIVE} />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    return row.original.adGroupCount;
  },
};

export const RATINGS_COLUMN: ColumnDef<IKeywordActionData> = {
  accessorKey: 'ratings',
  id: 'Ratings',
  size: 100,
  header: (props) => {
    return (
      <div
        className={`commonHeader`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Ratings
        <InfoIcon title={KEYWORD_ACTIONS_TOOLTIPS.ARCHIVE} />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    return row.original.adGroupCount;
  },
};

export const REVIEWS_COLUMN: ColumnDef<IKeywordActionData> = {
  accessorKey: 'reviews',
  id: 'Reviews',
  size: 100,
  header: (props) => {
    return (
      <div
        className={`commonHeader`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Reviews
        <InfoIcon title={KEYWORD_ACTIONS_TOOLTIPS.ARCHIVE} />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    return row.original.adGroupCount;
  },
};

export const keywordActionAdditionColumns: Array<
  ColumnDef<IKeywordActionData>
> = [
  SEARCH_TERM_COLUMN,
  SOURCE_CAMPAIGN_NAME_COLUMN,
  SOURCE_ADGROUP_NAME_COLUMN,
  TARGET_CAMPAIGN_COLUMN,
  TARGET_ADGROUP_COLUMN,
  MATCH_TYPE_TO_ADD_COLUMN,
  CUSTOM_BID_COLUMN,
  ARCHIVE_COLUMN,
  ...AMAZON_METRICS_COLUMNS,
] as Array<ColumnDef<IKeywordActionData>>;

export const productActionAdditionColumns: Array<
  ColumnDef<IKeywordActionData>
> = [
  SEARCH_TERM_COLUMN,
  SOURCE_CAMPAIGN_NAME_COLUMN,
  SOURCE_ADGROUP_NAME_COLUMN,
  TARGET_CAMPAIGN_COLUMN,
  TARGET_ADGROUP_COLUMN,
  MATCH_TYPE_TO_ADD_COLUMN,
  CUSTOM_BID_COLUMN,
  ARCHIVE_COLUMN,
  ...AMAZON_METRICS_COLUMNS,
] as Array<ColumnDef<IKeywordActionData>>;

export const walmartKeywordActionAdditionColumns: Array<
  ColumnDef<IKeywordActionData>
> = [
  WALMART_SEARCH_TERM_COLUMN,
  NORMALIZED_TERM_COLUMN,
  SOURCE_CAMPAIGN_NAME_COLUMN,
  SOURCE_ADGROUP_NAME_COLUMN,
  TARGET_CAMPAIGN_COLUMN,
  TARGET_ADGROUP_COLUMN,
  MATCH_TYPE_TO_ADD_COLUMN,
  CUSTOM_BID_COLUMN,
  ARCHIVE_COLUMN,
  ...AMAZON_METRICS_COLUMNS,
] as Array<ColumnDef<IKeywordActionData>>;

export const keywordActionNegationColumns: Array<
  ColumnDef<IKeywordActionData>
> = [
  SEARCH_TERM_COLUMN,
  SOURCE_CAMPAIGN_NAME_COLUMN,
  SOURCE_ADGROUP_NAME_COLUMN,
  TARGET_CAMPAIGN_COLUMN,
  TARGET_ADGROUP_COLUMN,
  MATCH_TYPE_TO_ADD_COLUMN,
  ...AMAZON_METRICS_COLUMNS,
] as Array<ColumnDef<IKeywordActionData>>;

export const productNegationColumns: Array<ColumnDef<IKeywordActionData>> = [
  SEARCH_TERM_COLUMN,
  SOURCE_CAMPAIGN_NAME_COLUMN,
  SOURCE_ADGROUP_NAME_COLUMN,
  TARGET_CAMPAIGN_COLUMN,
  TARGET_ADGROUP_COLUMN,
  ...AMAZON_METRICS_COLUMNS,
] as Array<ColumnDef<IKeywordActionData>>;
