import { ColumnDef, Row } from '@tanstack/react-table';
import InfoIcon from 'src/app/components/common/info-icon/info-icon';
import { MARKET_INTELLIGENCE_TOOLTIPS } from 'src/enums/tooltip-texts.enums';
import { IKeywordSOVTable } from 'src/interfaces/keyword-sov.interface';
import { formatNum } from 'src/utils';

export const KEYWORD_COLUMN: ColumnDef<IKeywordSOVTable> = {
  accessorKey: 'keyword',
  id: 'Keyword',
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
        Keyword
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <p style={{ fontWeight: 600, fontSize: '1.2rem' }}>
        {row.original.keyword}
      </p>
    );
  },
};

export const LABEL_COLUMN: ColumnDef<IKeywordSOVTable> = {
  accessorKey: 'label',
  id: 'Date',
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
        Date
      </div>
    );
  },
};

export const PRODUCT_COUNT_COLUMN: ColumnDef<IKeywordSOVTable> = {
  accessorKey: 'productCount',
  id: 'Product Count(Unique)',
  size: 210,
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
        Product Count(Unique)
        <InfoIcon title={MARKET_INTELLIGENCE_TOOLTIPS.PROD_COUNT} />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const productCount = (row as Row<IKeywordSOVTable>).original.productCount;
    return formatNum(productCount, false);
  },
};

export const APPEARANCE_COLUMN: ColumnDef<IKeywordSOVTable> = {
  accessorKey: 'appearance',
  id: 'Appearance(%)',
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
        Appearance(%)
        <InfoIcon title={MARKET_INTELLIGENCE_TOOLTIPS.APPEARANCE} />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const appearance = (row as Row<IKeywordSOVTable>).original.appearance;
    return `${formatNum(appearance, false)}%`;
  },
};

export const ORGANIC_SOV_COLUMN: ColumnDef<IKeywordSOVTable> = {
  accessorKey: 'organicSov',
  id: 'Organic SOV(%)',
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
        Organic SOV(%)
        <InfoIcon title={MARKET_INTELLIGENCE_TOOLTIPS.ORG_SOV} />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const organicSov = (row as Row<IKeywordSOVTable>).original.organicSov;
    return `${formatNum(organicSov, false)}%`;
  },
};

export const SPONSORED_SOV_COLUMN: ColumnDef<IKeywordSOVTable> = {
  accessorKey: 'sponsoredSov',
  id: 'Sponsored SOV(%)',
  size: 180,
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
        Sponsored SOV(%)
        <InfoIcon title={MARKET_INTELLIGENCE_TOOLTIPS.SP_SOV} />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const sponsoredSov = (row as Row<IKeywordSOVTable>).original.sponsoredSov;
    return `${formatNum(sponsoredSov, false)}%`;
  },
};

export const TOTAL_SOV_COLUMN: ColumnDef<IKeywordSOVTable> = {
  accessorKey: 'totalSov',
  id: 'Total SOV(%)',
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
        Total SOV(%)
        <InfoIcon title={MARKET_INTELLIGENCE_TOOLTIPS.TOTAL_SOV} />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const totalSov = (row as Row<IKeywordSOVTable>).original.totalSov;
    return `${formatNum(totalSov, false)}%`;
  },
};

export const newKeywordSovColumns: ColumnDef<IKeywordSOVTable>[] = [
  KEYWORD_COLUMN,
  LABEL_COLUMN,
  PRODUCT_COUNT_COLUMN,
  APPEARANCE_COLUMN,
  ORGANIC_SOV_COLUMN,
  SPONSORED_SOV_COLUMN,
  TOTAL_SOV_COLUMN,
];
