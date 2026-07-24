import { Link } from '@mui/material';
import { TrendUpIcon } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import InfoIcon from 'src/app/components/common/info-icon/info-icon';
import { MARKET_INTELLIGENCE_TOOLTIPS } from 'src/enums/tooltip-texts.enums';
import { ISOV, ISOVWithRank } from 'src/interfaces/serp.interface';
import { formatNum } from 'src/utils';
import styles from '../../../common/sov-table/sov-table.module.scss';

export const marketIntelligenceColumns = (
  handleBrandClick: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    link: string
  ) => void,
  handleCompareBrand: (row: ISOV) => void
): Array<ColumnDef<ISOVWithRank>> => [
  {
    accessorKey: 'rank',
    id: 'rank',
    size: 110,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          Sl No.
        </div>
      );
    },
    cell: (props) => {
      return (
        <div
          style={{
            width: '100%',
            fontWeight: 500,
            textAlign: 'center',
          }}
        >{`${props.getValue()}`}</div>
      );
    },
  },
  {
    accessorKey: 'brand',
    id: 'brand',
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{ display: 'flex', justifyContent: 'flex-start' }}
        >
          Brand
        </div>
      );
    },
    size: 200,
    cell: (props) => {
      const value = props.getValue() as string;

      if (value === null || value === undefined || value === '-')
        return <div className={styles.noDataView}>-</div>;

      const brandId = value;
      return (
        <Link
          style={{
            color: '#77469b',
            fontWeight: '500',
            textDecoration: 'none',
            cursor: 'pointer',
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          onClick={(event) => handleBrandClick(event, brandId)}
        >
          <span className={styles.brandText} title={value}>
            {value}
          </span>
        </Link>
      );
    },
  },
  {
    accessorKey: 'product_count',
    id: 'product_count',
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'normal',
            lineHeight: '1.2',
          }}
        >
          Product Count (Unique)
          <InfoIcon title={MARKET_INTELLIGENCE_TOOLTIPS.PROD_COUNT} />
        </div>
      );
    },
    size: 150,
    cell: (props) => {
      const value = props.getValue() as string;

      if (value === null || value === undefined || value === '-')
        return <div className={styles.noDataView}>-</div>;

      return (
        <div style={{ width: '100%', textAlign: 'center' }}>
          {formatNum(value, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'appearance',
    id: 'appearance',
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'normal',
            lineHeight: '1.2',
          }}
        >
          Appearance(%)
          <InfoIcon title={MARKET_INTELLIGENCE_TOOLTIPS.APPEARANCE} />
        </div>
      );
    },
    size: 150,
    cell: (props) => {
      const value = props.getValue() as string;

      if (value === null || value === undefined || value === '-')
        return <div className={styles.noDataView}>-</div>;

      return (
        <div style={{ width: '100%', textAlign: 'center' }}>
          {formatNum(value, false)}%
        </div>
      );
    },
  },
  {
    accessorKey: 'organic_sov',
    id: 'organic_sov',
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'normal',
            lineHeight: '1.2',
          }}
        >
          Organic SOV(%)
          <InfoIcon title={MARKET_INTELLIGENCE_TOOLTIPS.ORG_SOV} />
        </div>
      );
    },
    size: 150,
    cell: (props) => {
      const value = props.getValue() as string;

      if (value === null || value === undefined || value === '-')
        return <div className={styles.noDataView}>-</div>;

      return (
        <div style={{ width: '100%', textAlign: 'center' }}>
          {formatNum(value, false)}%
        </div>
      );
    },
  },
  {
    accessorKey: 'sponsored_sov',
    id: 'sponsored_sov',
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'normal',
            lineHeight: '1.2',
          }}
        >
          Sponsored SOV(%)
          <InfoIcon title={MARKET_INTELLIGENCE_TOOLTIPS.SP_SOV} />
        </div>
      );
    },
    size: 150,
    cell: (props) => {
      const value = props.getValue() as string;

      if (value === null || value === undefined || value === '-')
        return <div className={styles.noDataView}>-</div>;

      return (
        <div style={{ width: '100%', textAlign: 'center' }}>
          {formatNum(value, false)}%
        </div>
      );
    },
  },
  {
    accessorKey: 'total_sov',
    id: 'total_sov',
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'normal',
            lineHeight: '1.2',
          }}
        >
          Total SOV(%)
          <InfoIcon title={MARKET_INTELLIGENCE_TOOLTIPS.TOTAL_SOV} />
        </div>
      );
    },
    size: 150,
    cell: (props) => {
      const value = props.getValue() as string;

      if (value === null || value === undefined || value === '-')
        return <div className={styles.noDataView}>-</div>;

      return (
        <div style={{ width: '100%', textAlign: 'center' }}>
          {formatNum(value, false)}%
        </div>
      );
    },
  },
  {
    accessorKey: 'compare',
    id: 'compare',
    size: 100,
    enableSorting: false,
    header: (props) => {
      return <div className={styles.header}></div>;
    },
    cell: (props) => {
      const row = props.row.original as ISOV;
      const isDisabled =
        (row.organic_sov === null ||
          row.organic_sov === undefined ||
          row.organic_sov === '-') &&
        (row.sponsored_sov === null ||
          row.sponsored_sov === undefined ||
          row.sponsored_sov === '-') &&
        (row.total_sov === null ||
          row.total_sov === undefined ||
          row.total_sov === '-');

      return (
        <button
          className={`${styles.compareBtn} ${
            isDisabled ? styles.compareBtnDisabled : ''
          }`}
          onClick={() => handleCompareBrand(row)}
          disabled={isDisabled}
        >
          <TrendUpIcon size={16} weight="bold" style={{ color: 'inherit' }} />
          View Trend
        </button>
      );
    },
  },
];
