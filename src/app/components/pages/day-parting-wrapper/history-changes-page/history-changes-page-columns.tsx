import { displayValue, formatNum } from '@/utils';
import { getFormattedTimezoneDate } from '@/utils/datetime.utils';
import { ColumnDef } from '@tanstack/react-table';
import { IHistoryChangeData } from 'src/interfaces/day-parting.interfaces';
import styles from './history-changes-page.module.scss';
const centerStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start',
};
export const walmartHistoryChangesColumns: ColumnDef<IHistoryChangeData>[] = [
  {
    accessorKey: 'keywordText',
    id: 'keywordText',
    size: 180,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'left',
          }}
        >
          Keyword
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      if (!value) return <div className="no-data-view">-</div>;
      return (
        <div className={styles.cell} style={centerStyles}>
          {value}
        </div>
      );
    },
  },

  {
    accessorKey: 'adGroupId',
    id: 'adGroupId',
    size: 180,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'left',
          }}
        >
          Ad Group ID
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      if (!value) return <div className="no-data-view">-</div>;
      return (
        <div className={styles.cell} style={centerStyles}>
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: 'campaignId',
    id: 'campaignId',
    size: 180,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'left',
          }}
        >
          Campaign ID
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      if (!value) return <div className="no-data-view">-</div>;
      return (
        <div className={styles.cell} style={centerStyles}>
          {value}
        </div>
      );
    },
  },

  {
    accessorKey: 'liveBid',
    id: 'liveBid',
    size: 150,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'left',
          }}
        >
          Live Bid
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      if (!value) return <div className="no-data-view">-</div>;
      return (
        <div className={styles.cell} style={centerStyles}>
          {displayValue(formatNum(value, false), false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'originalBid',
    id: 'originalBid',
    size: 150,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'left',
          }}
        >
          Original Bid
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      if (!value) return <div className="no-data-view">-</div>;
      return (
        <div className={styles.cell} style={centerStyles}>
          {displayValue(formatNum(value, false), false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'updatedBid',
    id: 'updatedBid',
    size: 150,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'left',
          }}
        >
          Updated Bid
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      if (!value) return <div className="no-data-view">-</div>;
      return (
        <div className={styles.cell} style={centerStyles}>
          {displayValue(formatNum(value, false), false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    size: 180,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'left',
          }}
        >
          Created At
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      if (!value) return <div className="no-data-view">-</div>;
      return (
        <div className={styles.cell} style={centerStyles}>
          {getFormattedTimezoneDate(value)}
        </div>
      );
    },
  },
];

export const historyChangesColumns: ColumnDef<IHistoryChangeData>[] = [
  {
    accessorKey: 'keywordText',
    id: 'keywordText',
    size: 180,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'left',
          }}
        >
          Keyword
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      if (!value) return <div className="no-data-view">-</div>;
      return <div className={styles.cell}>{value}</div>;
    },
  },
  {
    accessorKey: 'adGroupId',
    id: 'adGroupId',
    size: 180,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'left',
          }}
        >
          Ad Group ID
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      if (!value) return <div className="no-data-view">-</div>;
      return <div className={styles.cell}>{value}</div>;
    },
  },
  {
    accessorKey: 'campaignId',
    id: 'campaignId',
    size: 180,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'left',
          }}
        >
          Campaign ID
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      if (!value) return <div className="no-data-view">-</div>;
      return <div className={styles.cell}>{value}</div>;
    },
  },
  {
    accessorKey: 'liveBid',
    id: 'liveBid',
    size: 150,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'center',
          }}
        >
          Live Bid
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      if (!value) return <div className="no-data-view">-</div>;
      return (
        <div
          className={styles.cell}
          style={{
            textAlign: 'center',
          }}
        >
          {displayValue(formatNum(value, false), false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'originalBid',
    id: 'originalBid',
    size: 150,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'center',
          }}
        >
          Original Bid
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      if (!value) return <div className="no-data-view">-</div>;
      return (
        <div
          className={styles.cell}
          style={{
            textAlign: 'center',
          }}
        >
          {displayValue(formatNum(value, false), false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'updatedBid',
    id: 'updatedBid',
    size: 150,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'center',
          }}
        >
          Updated Bid
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      if (!value) return <div className="no-data-view">-</div>;
      return (
        <div
          className={styles.cell}
          style={{
            textAlign: 'center',
          }}
        >
          {displayValue(formatNum(value, false), false)}
        </div>
      );
    },
  },
];

export const targetColumn: ColumnDef<IHistoryChangeData> = {
  accessorKey: 'targetId',
  id: 'targetId',
  size: 180,
  header: (props) => {
    return (
      <div
        className={styles.header}
        style={{
          textAlign: 'left',
        }}
      >
        Target ID
      </div>
    );
  },
  cell: (props) => {
    const value = props.getValue() as string;

    if (!value) return <div className="no-data-view">-</div>;
    return <div className={styles.cell}>{value}</div>;
  },
};

export const adItemColumn: ColumnDef<IHistoryChangeData> = {
  accessorKey: 'itemId',
  id: 'itemId',
  size: 180,
  header: (props) => {
    return (
      <div
        className={styles.header}
        style={{
          textAlign: 'left',
        }}
      >
        Ad Item ID
      </div>
    );
  },
  cell: (props) => {
    const value = props.getValue() as string;

    if (!value) return <div className="no-data-view">-</div>;
    return (
      <div className={styles.cell} style={centerStyles}>
        {value}
      </div>
    );
  },
};
