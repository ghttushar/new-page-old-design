import { ProductActionsMatchTypeMap } from '@/constants/keyword-action.constants';
import { KeywordActionMatchType } from '@/enums/keyword-action.enums';
import { ColumnDef } from '@tanstack/react-table';
import { DATE_FORMAT_8 } from 'src/constants/datetime.constants';
import {
  IKeywordHistoryResponse,
  IProductHistoryResponse,
} from 'src/interfaces/keyword-actions.interface';
import { formatNum } from 'src/utils';
import {
  convertUtcToTimezoneDate,
  removeZFromTimestamp,
} from 'src/utils/datetime.utils';
import InfoIcon from '../../info-icon/info-icon';
import {
  matchTypeBoxStyle,
  matchTypeContainer,
  textWrappingStyles,
} from '../keyword-actions-table-styles';
import { ProductActionDetails } from '../product-actions-details/product-actions-details';

export const KEYWORD_TEXT_COLUMN: ColumnDef<IProductHistoryResponse> = {
  accessorKey: 'keywordText',
  id: 'Keyword',
  size: 300,
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
        Keyword/Product
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const keywordText = row.original.keywordText;
    const matchType = row.original.matchType;

    switch (matchType) {
      case KeywordActionMatchType.ASIN_SAME_AS:
      case KeywordActionMatchType.ASIN_EXPANDED_FROM:
      case KeywordActionMatchType.NEGATIVE_ASIN_SAME_AS:
        return (
          <ProductActionDetails
            searchTerm={keywordText}
            title={row.original.title}
            brandName={row.original.brandName}
            price={row.original.price as unknown as string}
            ratings={row.original.ratings}
            reviews={row.original.reviews}
          />
        );
      default: {
        return (
          <div style={{ whiteSpace: 'normal', textAlign: 'center' }}>
            <span style={{ fontWeight: 600, whiteSpace: 'pre-wrap' }}>
              {keywordText}
            </span>
          </div>
        );
      }
    }
  },
};

export const MATCH_TYPE_COLUMN: ColumnDef<IKeywordHistoryResponse> = {
  accessorKey: 'matchType',
  id: 'Match Type',
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
        Match Type
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const matchType = row.original.matchType;

    return (
      <div style={matchTypeContainer}>
        <div style={matchTypeBoxStyle}>
          <span style={{ color: '#77469b', fontWeight: '600' }}>
            {ProductActionsMatchTypeMap.get(matchType) ?? matchType}
          </span>
        </div>
      </div>
    );
  },
};

export const CAMPAIGN_NAME_COLUMN: ColumnDef<IKeywordHistoryResponse> = {
  accessorKey: 'campaignName',
  id: 'Campaign Name',
  size: 260,
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
        Campaign Name
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const campaignName = row.original.campaignName;

    return (
      <div style={textWrappingStyles as React.CSSProperties}>
        <span className="commonCell">{campaignName}</span>
      </div>
    );
  },
};

export const ADGROUP_NAME_COLUMN: ColumnDef<IKeywordHistoryResponse> = {
  accessorKey: 'adGroupName',
  id: 'AdGroup Name',
  size: 260,
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
        AdGroup Name
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const adGroupName = row.original.adGroupName;

    return (
      <div style={textWrappingStyles as React.CSSProperties}>
        <span className="commonCell">{adGroupName}</span>
      </div>
    );
  },
};

export const BID_COLUMN: ColumnDef<IKeywordHistoryResponse> = {
  accessorKey: 'bid',
  id: 'Bid',
  size: 120,
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
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const bid = row.original.bid;

    if (!bid) return <div className="no-data-view">-</div>;
    return formatNum(bid, false);
  },
};

export const USER_NAME_COLUMN: ColumnDef<IKeywordHistoryResponse> = {
  accessorKey: 'userName',
  id: 'User Name',
  size: 150,
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
        User
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const username = row.original.userName;

    if (!username) return <div className="no-data-view">-</div>;
    return <span style={{ whiteSpace: 'pre-wrap' }}>{username}</span>;
  },
};

export const CREATED_AT_COLUMN: ColumnDef<IKeywordHistoryResponse> = {
  accessorKey: 'createdAt',
  id: 'Created At',
  size: 220,
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
        Created At
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const createdAt = removeZFromTimestamp(row.original.createdAt);

    return (
      <span style={{ color: '#77469b', fontWeight: '600' }}>
        {convertUtcToTimezoneDate(createdAt, DATE_FORMAT_8)}
      </span>
    );
  },
};

export const STATUS_COLUMN: ColumnDef<IKeywordHistoryResponse> = {
  accessorKey: 'status',
  id: 'Status',
  size: 150,
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
        Status
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const status = row.original.status;
    const reason = row.original.reason;

    if (!status) return <div className="no-data-view">-</div>;
    const color = reason ? 'rgb(242, 110, 119)' : '#77469B';
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          color: `${color}`,
          fontWeight: '600',
          border: `0.1rem solid ${color}`,
          padding: '0.2rem 0.5rem',
        }}
      >
        {status}
        {reason && <InfoIcon title={reason} />}
      </div>
    );
  },
};

export const KEYWORD_HISTORY_COLUMNS: Array<
  ColumnDef<IKeywordHistoryResponse>
> = [
  KEYWORD_TEXT_COLUMN,
  MATCH_TYPE_COLUMN,
  CAMPAIGN_NAME_COLUMN,
  ADGROUP_NAME_COLUMN,
  BID_COLUMN,
  USER_NAME_COLUMN,
  CREATED_AT_COLUMN,
  STATUS_COLUMN,
] as Array<ColumnDef<IKeywordHistoryResponse>>;
