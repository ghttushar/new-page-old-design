import { ProductActionsMatchTypeMap } from '@/constants/keyword-action.constants';
import { KeywordActionMatchType } from '@/enums/keyword-action.enums';
import { ColumnDef } from '@tanstack/react-table';
import { DATE_FORMAT_8 } from 'src/constants/datetime.constants';
import { KEYWORD_ACTIONS_TOOLTIPS } from 'src/enums/tooltip-texts.enums';
import {
  IArchiveProductData,
  IGetArchiveSearchTermData,
} from 'src/interfaces/keyword-actions.interface';
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
import KeywordActionUnArchive from './keyword-action-unarchive';

export const SEARCH_TERM_COLUMN: ColumnDef<IArchiveProductData> = {
  accessorKey: 'searchTerm',
  id: 'Search Term',
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
    const searchTerm = row.original.searchTerm;
    const matchType = row.original.matchType;

    switch (matchType) {
      case KeywordActionMatchType.ASIN_SAME_AS:
      case KeywordActionMatchType.ASIN_EXPANDED_FROM:
      case KeywordActionMatchType.NEGATIVE_ASIN_SAME_AS:
        return (
          <ProductActionDetails
            searchTerm={searchTerm}
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
            <span style={{ fontWeight: 600 }}>{searchTerm}</span>
          </div>
        );
      }
    }
  },
};

export const MATCH_TYPE_COLUMN: ColumnDef<IGetArchiveSearchTermData> = {
  accessorKey: 'matchType',
  id: 'Match Type',
  size: 160,
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

export const CAMPAIGN_NAME_COLUMN: ColumnDef<IGetArchiveSearchTermData> = {
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

export const ADGROUP_NAME_COLUMN: ColumnDef<IGetArchiveSearchTermData> = {
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

export const DATE_RANGE_COLUMN: ColumnDef<IGetArchiveSearchTermData> = {
  accessorKey: 'dateRange',
  id: 'Date Range',
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
        Date Range
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    return row.original.dateRange;
  },
};

export const USER_NAME_COLUMN: ColumnDef<IGetArchiveSearchTermData> = {
  accessorKey: 'userName',
  id: 'User Name',
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
        User
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const username = row.original.userName;

    if (!username) return <div className="no-data-view">-</div>;
    return (
      <span
        style={{
          whiteSpace: 'pre-wrap',
        }}
      >
        {username}
      </span>
    );
  },
};

export const CREATED_AT_COLUMN: ColumnDef<IGetArchiveSearchTermData> = {
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

export const UNARCHIVE_COLUMN: ColumnDef<IGetArchiveSearchTermData> = {
  accessorKey: 'archive',
  id: 'Unarchive',
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
        Unarchive
        <InfoIcon title={KEYWORD_ACTIONS_TOOLTIPS.UN_ARCHIVE} />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const id = Number(row.id);
    const data = row.original;

    return <KeywordActionUnArchive id={id} data={data} />;
  },
};

export const KEYWORD_ARCHIVE_COLUMNS: Array<
  ColumnDef<IGetArchiveSearchTermData>
> = [
  SEARCH_TERM_COLUMN,
  MATCH_TYPE_COLUMN,
  CAMPAIGN_NAME_COLUMN,
  ADGROUP_NAME_COLUMN,
  DATE_RANGE_COLUMN,
  USER_NAME_COLUMN,
  CREATED_AT_COLUMN,
  UNARCHIVE_COLUMN,
] as Array<ColumnDef<IGetArchiveSearchTermData>>;
