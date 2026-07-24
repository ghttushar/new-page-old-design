import MarketplaceIcon from '@/app/components/common/marketplace-icon/marketplace-icon';
import { BidderDashboardColumnEnum } from '@/enums/bidder-dashboard.enum';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { IBidderDashboard } from '@/interfaces/bidder-dashboard.interface';
import { bidderDashboardUtils } from '@/utils/bidder-dashboard.utils';
import { ColumnDef } from '@tanstack/react-table';
import styles from 'src/app/components/pages/advertising-page/advertising-walmart/sp/account-level/wmt-sp-account-level.module.scss';
import { FLEX_CENTER_STYLE } from '../bidder-dashboard.constants';
import { textTitleStyles } from './new-column-names.constants';

const ACCOUNT_ID_COLUMN: ColumnDef<IBidderDashboard> = {
  accessorKey: 'accountId',
  id: BidderDashboardColumnEnum.ACCOUNT_ID,
  size: 200,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Account ID
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.accountId;
    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div style={FLEX_CENTER_STYLE}>
        <p style={{ ...textTitleStyles, color: '#77469B' }} title={value}>
          {value}
        </p>
      </div>
    );
  },
};

const MARKETPLACE_COLUMN: ColumnDef<IBidderDashboard> = {
  accessorKey: 'marketplace',
  id: BidderDashboardColumnEnum.MARKETPLACE,
  size: 150,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Marketplace
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.marketplace as MarketplaceEnum;
    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div style={FLEX_CENTER_STYLE}>
        <p style={textTitleStyles} title={value}>
          <MarketplaceIcon marketplace={value} />
        </p>
      </div>
    );
  },
};

const JOB_ID_COLUMN: ColumnDef<IBidderDashboard> = {
  accessorKey: 'jobId',
  id: BidderDashboardColumnEnum.JOB_ID,
  size: 270,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'left' }}>
        Job ID
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.jobId;

    if (!value) return <div className="no-data-view">-</div>;
    return (
      <div style={FLEX_CENTER_STYLE}>
        <p style={{ ...textTitleStyles, wordBreak: 'keep-all' }} title={value}>
          {value}
        </p>
      </div>
    );
  },
};

const LAST_TRIGGER_DATE_COLUMN: ColumnDef<IBidderDashboard> = {
  accessorKey: 'lastTriggerDate',
  id: BidderDashboardColumnEnum.LAST_TRIGGER_DATE,
  size: 200,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Last Trigger Date
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.lastTriggerDate;
    if (!value || value === 'No previous trigger')
      return <div className="no-data-view">No previous trigger</div>;

    return (
      <div style={FLEX_CENTER_STYLE}>
        <p style={{ ...textTitleStyles, fontWeight: 600 }} title={value}>
          {value}
        </p>
      </div>
    );
  },
};

const NEXT_TRIGGER_DATE_COLUMN: ColumnDef<IBidderDashboard> = {
  accessorKey: 'nextTriggerDate',
  id: BidderDashboardColumnEnum.NEXT_TRIGGER_DATE,
  size: 200,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Next Trigger Date
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.nextTriggerDate;
    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div style={FLEX_CENTER_STYLE}>
        <p style={{ ...textTitleStyles, fontWeight: 600 }} title={value}>
          {value}
        </p>
      </div>
    );
  },
};

const REPORT_DATE_COLUMN: ColumnDef<IBidderDashboard> = {
  accessorKey: 'reportDate',
  id: BidderDashboardColumnEnum.REPORT_DATE,
  size: 200,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Report Date
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.reportDate;
    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div style={FLEX_CENTER_STYLE}>
        <p style={{ ...textTitleStyles, fontWeight: 600 }} title={value}>
          {value}
        </p>
      </div>
    );
  },
};

const BRAND_NAME_COLUMN: ColumnDef<IBidderDashboard> = {
  accessorKey: 'brandName',
  id: BidderDashboardColumnEnum.BRAND_NAME,
  size: 200,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Brand Name
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.brandName;
    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div style={FLEX_CENTER_STYLE}>
        <p
          style={{ ...textTitleStyles, color: '#77469B', fontWeight: 600 }}
          title={value}
        >
          {value}
        </p>
      </div>
    );
  },
};

const UNIQUE_ID_COLUMN: ColumnDef<IBidderDashboard> = {
  accessorKey: 'uniqueId',
  id: BidderDashboardColumnEnum.UNIQUE_ID,
  size: 180,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Unique ID
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.uniqueId;
    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div style={FLEX_CENTER_STYLE}>
        <p style={textTitleStyles} title={value}>
          {value}
        </p>
      </div>
    );
  },
};

const STATUS_COLUMN: ColumnDef<IBidderDashboard> = {
  accessorKey: 'status',
  id: BidderDashboardColumnEnum.STATUS,
  size: 150,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Status
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.status;
    if (!value) return <div className="no-data-view">-</div>;

    const color = bidderDashboardUtils.getStatusColor(value);

    return (
      <div
        style={{
          ...textTitleStyles,
          color,
          fontWeight: 600,
          border: `1px solid ${color}`,
          padding: '0.5rem',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {value}
      </div>
    );
  },
};

const AD_TYPE_COLUMN: ColumnDef<IBidderDashboard> = {
  accessorKey: 'adType',
  id: BidderDashboardColumnEnum.AD_TYPE,
  size: 120,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Ad Type
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.adType;
    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div style={FLEX_CENTER_STYLE}>
        <p
          style={{ ...textTitleStyles, color: '#77469B', fontWeight: 600 }}
          title={value}
        >
          {value}
        </p>
      </div>
    );
  },
};

export const BIDDER_DASHBOARD_COLUMNS: Array<ColumnDef<IBidderDashboard>> = [
  BRAND_NAME_COLUMN,
  MARKETPLACE_COLUMN,
  ACCOUNT_ID_COLUMN,
  JOB_ID_COLUMN,
  LAST_TRIGGER_DATE_COLUMN,
  NEXT_TRIGGER_DATE_COLUMN,
  UNIQUE_ID_COLUMN,
  STATUS_COLUMN,
  AD_TYPE_COLUMN,
  REPORT_DATE_COLUMN,
];
