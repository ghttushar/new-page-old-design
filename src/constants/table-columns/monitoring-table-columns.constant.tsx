import HoverInfoTooltip from '@/app/components/common/hover-info-tooltip/hover-info-tooltip';
import MarketplaceIcon from '@/app/components/common/marketplace-icon/marketplace-icon';
import { primaryColor } from '@/app/components/layout/side-bar/menu-item-component-styles';
import MonitoringRetriggerAction from '@/app/components/page-components/monitoring-components/monitoring-actions/monitoring-re-trigger';
import MonitoringPayloadPopup from '@/app/components/page-components/monitoring-components/monitoring-payload-popup/monitoring-payload-popup';
import { ColumnNameEnum } from '@/enums/advertising.enums';
import { BackendServiceNameEnum } from '@/enums/index.enums';
import { MonitoringStatusEnum } from '@/enums/monitoring.enum';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { TimezoneEnum } from '@/enums/timezone.enums';
import { IMonitoring } from '@/interfaces/monitoring.interface';
import { getTitleCaseString } from '@/utils';
import { checkIsNull, convertToUpperCase } from '@/utils/advertising.utils';
import {
  getFormattedTimezoneDate,
  getTimeInUnitFromMs,
} from '@/utils/datetime.utils';
import { monitoringUtils } from '@/utils/monitoring.utils';
import { Link } from '@mui/material';
import { ArrowSquareInIcon } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import styles from 'src/app/components/pages/advertising-page/advertising-walmart/sp/account-level/wmt-sp-account-level.module.scss';
import { subTextStyles, textTitleStyles } from './new-column-names.constants';

const IST_TIMEZONE = TimezoneEnum.INDIA;

const TASK_ID_COLUMN = (isHistory: boolean): ColumnDef<IMonitoring> => {
  return {
    accessorKey: 'taskId',
    id: ColumnNameEnum.TASK_ID,
    size: 300,
    header: (props) => {
      return (
        <div className={styles.header} style={{ textAlign: 'left' }}>
          Task Id
        </div>
      );
    },
    cell: ({ row }) => {
      const value = row.original.taskId;
      const taskId = row.original.taskId;
      const startTime = row.original.taskProcessingStartedAt;
      const endTime = row.original.taskProcessingCompletedAt;
      const createdAt = row.original.taskCreatedAt;

      if (!value) return <div className="no-data-view">-</div>;
      const href = isHistory
        ? monitoringUtils.getURLToMonitoringHistoryLogs(
            taskId,
            startTime,
            endTime
          )
        : monitoringUtils.getURLToMonitoringLogs(taskId, createdAt);
      return (
        <div
          style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}
        >
          <p
            style={{ ...textTitleStyles, wordBreak: 'keep-all' }}
            title={value}
          >
            {value}
          </p>
          <Link target={'_blank'} href={href}>
            <HoverInfoTooltip title={'Go to Logs'}>
              <ArrowSquareInIcon size={'1.8rem'} color={primaryColor} />
            </HoverInfoTooltip>
          </Link>
        </div>
      );
    },
  };
};

const ACCOUNT_ID_COLUMN: ColumnDef<IMonitoring> = {
  accessorKey: 'accountId',
  id: ColumnNameEnum.ACCOUNT_ID,
  minSize: 200,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Account Id
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.accountId;
    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <p style={{ ...textTitleStyles, color: '#77469B' }} title={value}>
          {value}
        </p>
      </div>
    );
  },
};
const META_ID_COLUMN: ColumnDef<IMonitoring> = {
  accessorKey: 'metaId',
  id: ColumnNameEnum.META_ID,
  size: 180,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Meta Id
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.metaId;
    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div
        className="commonCell"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <p style={textTitleStyles} title={value}>
          {value}
        </p>
      </div>
    );
  },
};
const META_TYPE_COLUMN: ColumnDef<IMonitoring> = {
  accessorKey: 'metaType',
  id: ColumnNameEnum.META_TYPE,
  size: 200,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Meta Type
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.metaType;
    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <p style={textTitleStyles} title={value}>
          {value}
        </p>
      </div>
    );
  },
};
const MARKETPLACE_COLUMN: ColumnDef<IMonitoring> = {
  accessorKey: 'marketplace',
  id: ColumnNameEnum.MARKETPLACE,
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
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <p style={textTitleStyles} title={value}>
          <MarketplaceIcon marketplace={value} />
        </p>
      </div>
    );
  },
};
const SERVICE_ORIGIN_COLUMN: ColumnDef<IMonitoring> = {
  accessorKey: 'serviceOrigin',
  id: ColumnNameEnum.SERVICE_ORIGIN,
  size: 150,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Service Origin
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.serviceOrigin as BackendServiceNameEnum;
    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <p style={textTitleStyles} title={value}>
          {value}
        </p>
      </div>
    );
  },
};

const STATUS_COLUMN: ColumnDef<IMonitoring> = {
  accessorKey: 'taskStatus',
  id: ColumnNameEnum.STATUS,
  size: 150,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Status
      </div>
    );
  },
  cell: (props) => {
    const value = props.getValue() as MonitoringStatusEnum;
    if (!value) return <div className="no-data-view">-</div>;

    const color = monitoringUtils.getStatusTextColor(value);

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
        {convertToUpperCase(getTitleCaseString(value))}
      </div>
    );
  },
};

const TASK_TYPE_COLUMN: ColumnDef<IMonitoring> = {
  accessorKey: 'taskType',
  id: ColumnNameEnum.TASK_TYPE,
  size: 250,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Task Type
      </div>
    );
  },
  cell: (props) => {
    const value = props.getValue() as string;
    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div
        className="commonCell"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
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
const TASK_CREATED_AT_COLUMN: ColumnDef<IMonitoring> = {
  accessorKey: 'taskCreatedAt',
  id: ColumnNameEnum.TASK_CREATED_AT,
  size: 200,

  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Task Created At
      </div>
    );
  },
  cell: (props) => {
    const value = props.getValue() as string;

    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div
        className="commonCell"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <p style={{ ...textTitleStyles, fontWeight: 600 }} title={value}>
          {getFormattedTimezoneDate(value, IST_TIMEZONE)} <br />
          <span style={subTextStyles}>{getFormattedTimezoneDate(value)} </span>
        </p>
      </div>
    );
  },
};
const TASK_STARTED_AT_COLUMN: ColumnDef<IMonitoring> = {
  accessorKey: 'taskProcessingStartedAt',
  id: ColumnNameEnum.TASK_STARTED_AT,
  size: 200,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Task Started At
      </div>
    );
  },
  cell: (props) => {
    const value = props.getValue() as string;

    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div
        className="commonCell"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <p style={{ ...textTitleStyles, fontWeight: 600 }} title={value}>
          {getFormattedTimezoneDate(value, IST_TIMEZONE)} <br />
          <span style={subTextStyles}>{getFormattedTimezoneDate(value)} </span>
        </p>
      </div>
    );
  },
};
const TASK_COMPLETED_AT_COLUMN: ColumnDef<IMonitoring> = {
  accessorKey: 'taskProcessingCompletedAt',
  id: ColumnNameEnum.TASK_COMPLETED_AT,
  size: 200,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Task Completed At
      </div>
    );
  },
  cell: (props) => {
    const value = props.getValue() as string;

    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div
        className="commonCell"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <p style={{ ...textTitleStyles, fontWeight: 600 }} title={value}>
          {getFormattedTimezoneDate(value, IST_TIMEZONE)} <br />
          <span style={subTextStyles}>{getFormattedTimezoneDate(value)} </span>
        </p>
      </div>
    );
  },
};
const SCHEDULE_TYPE_COLUMN: ColumnDef<IMonitoring> = {
  accessorKey: 'scheduleType',
  id: ColumnNameEnum.SCHEDULE_TYPE,
  size: 150,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Schedule Type
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.scheduleType;
    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div
        className="commonCell"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
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
const EXECUTION_MODE_COLUMN: ColumnDef<IMonitoring> = {
  accessorKey: 'executionMode',
  id: ColumnNameEnum.EXECUTION_MODE,
  size: 150,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Execution Mode
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.executionMode;
    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div
        className="commonCell"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
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
const TIME_TO_START_COLUMN: ColumnDef<IMonitoring> = {
  accessorKey: 'timeTakenToStart',
  id: ColumnNameEnum.TIME_TO_START,
  size: 150,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Time Taken to Start
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.timeTakenToStart;

    if (!value) return <div className="no-data-view">-</div>;
    return (
      <div
        className="commonCell"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <p style={{ ...textTitleStyles, color: '#77469B', fontWeight: 600 }}>
          {getTimeInUnitFromMs(value)}
        </p>
      </div>
    );
  },
};
const TOTAL_LIFE_TIME_COLUMN: ColumnDef<IMonitoring> = {
  accessorKey: 'totalLifeTime',
  id: ColumnNameEnum.TOTAL_LIFE_TIME,
  size: 150,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Total Life Time
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.totalLifeTime;

    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div
        className="commonCell"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <p style={{ ...textTitleStyles, color: '#77469B', fontWeight: 600 }}>
          {getTimeInUnitFromMs(value)}
        </p>
      </div>
    );
  },
};
const TIME_TAKEN_TO_COMPLETE_COLUMN: ColumnDef<IMonitoring> = {
  accessorKey: 'timeTakenToComplete',
  id: ColumnNameEnum.TIME_TAKEN_TO_COMPLETE,
  size: 150,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Time Taken to Complete
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.timeTakenToComplete;

    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div
        className="commonCell"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <p style={{ ...textTitleStyles, color: '#77469B', fontWeight: 600 }}>
          {getTimeInUnitFromMs(value)}
        </p>
      </div>
    );
  },
};

const MONITORING_PAYLOAD: ColumnDef<IMonitoring> = {
  accessorKey: 'payload',
  id: ColumnNameEnum.MONITORING_PAYLOAD,
  size: 150,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Payload Details
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.payload;

    if (checkIsNull(value)) return <div className="no-data-view">-</div>;

    return (
      <div
        className="commonCell"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <MonitoringPayloadPopup payload={value} />
      </div>
    );
  },
};
const MONITORING_METADATA: ColumnDef<IMonitoring> = {
  accessorKey: 'metaData',
  id: ColumnNameEnum.MONITORING_METADATA,
  size: 150,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Meta Data
      </div>
    );
  },
  cell: ({ row }) => {
    return (
      <div
        className="commonCell"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <MonitoringPayloadPopup
          payload={row.original.metaData as unknown as JSON}
          text={row.original.metaData?.type}
        />
      </div>
    );
  },
};

const CORRELATION_ID: ColumnDef<IMonitoring> = {
  accessorKey: 'correlationId',
  id: ColumnNameEnum.CORRELATION_ID,
  size: 180,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Correlation Id
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.correlationId;
    if (!value) return <div className="no-data-view">NA</div>;

    return (
      <div
        className="commonCell"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <p style={textTitleStyles} title={value}>
          {value}
        </p>
      </div>
    );
  },
};
const MESSAGE_GROUP_ID: ColumnDef<IMonitoring> = {
  accessorKey: 'messageGroupId',
  id: ColumnNameEnum.MESSAGE_GROUP_ID,
  size: 80,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Message Group Id
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.messageGroupId;
    if (!value) return <div className="no-data-view">NA</div>;

    return (
      <div
        className="commonCell"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
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
const DEDUPLICATION_ID: ColumnDef<IMonitoring> = {
  accessorKey: 'deduplicationId',
  id: ColumnNameEnum.DEDUPLICATION_ID,
  size: 100,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Deduplication Id
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.deduplicationId;
    if (!value) return <div className="no-data-view">NA</div>;

    return (
      <div
        className="commonCell"
        style={{
          display: 'flex',
          justifyContent: 'center',
          wordBreak: 'break-all',
          minWidth: '20rem',
        }}
      >
        <p
          style={{
            ...textTitleStyles,
            color: '#77469B',
            fontWeight: 600,
          }}
          title={value}
        >
          {value}
        </p>
      </div>
    );
  },
};
const RETRIGGER_ACTION: ColumnDef<IMonitoring> = {
  accessorKey: 'reTriggerAction',
  id: ColumnNameEnum.RETRIGGER_ACTION,
  size: 180,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Re-trigger Task
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.taskId;
    if (!value) return <div className="no-data-view">NA</div>;

    return (
      <div
        className="commonCell"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <MonitoringRetriggerAction
          taskId={value}
          executionMode={row.original.executionMode}
        />
      </div>
    );
  },
};

const RETRY_COUNT_COLUMN: ColumnDef<IMonitoring> = {
  accessorKey: 'retryCount',
  id: ColumnNameEnum.RETRY_COUNT,
  size: 180,
  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Retry Count
      </div>
    );
  },
  cell: ({ row }) => {
    const value = row.original.retryCount;
    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div
        className="commonCell"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <p style={textTitleStyles}>{value}</p>
      </div>
    );
  },
};

const TASK_ELAPSED_TIME_COLUMNS: ColumnDef<IMonitoring> = {
  accessorKey: 'elapsedTime',
  id: ColumnNameEnum.ELAPSED_TIME,
  size: 200,

  header: (props) => {
    return (
      <div className={styles.header} style={{ textAlign: 'center' }}>
        Elapsed Time
      </div>
    );
  },
  cell: (props) => {
    const value = props.row.original.elapsedTime;

    if (!value) return <div className="no-data-view">-</div>;

    return (
      <div
        className="commonCell"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <p style={{ ...textTitleStyles, fontWeight: 600 }}>
          {getTimeInUnitFromMs(value)} <br />
        </p>
      </div>
    );
  },
};

export const MONITORING_COLUMNS: Array<ColumnDef<IMonitoring>> = [
  TASK_ID_COLUMN(false),
  CORRELATION_ID,
  ACCOUNT_ID_COLUMN,
  RETRY_COUNT_COLUMN,
  META_ID_COLUMN,
  META_TYPE_COLUMN,
  MARKETPLACE_COLUMN,
  SERVICE_ORIGIN_COLUMN,
  STATUS_COLUMN,
  TASK_TYPE_COLUMN,
  TASK_CREATED_AT_COLUMN,
  TASK_STARTED_AT_COLUMN,
  TASK_ELAPSED_TIME_COLUMNS,
  SCHEDULE_TYPE_COLUMN,
  EXECUTION_MODE_COLUMN,
  TIME_TO_START_COLUMN,
  MONITORING_PAYLOAD,
  MESSAGE_GROUP_ID,
  DEDUPLICATION_ID,
  MONITORING_METADATA,
];

export const MONITORING_HISTORY_COLUMNS: Array<ColumnDef<IMonitoring>> = [
  TASK_ID_COLUMN(true),
  CORRELATION_ID,
  ACCOUNT_ID_COLUMN,
  META_ID_COLUMN,
  META_TYPE_COLUMN,
  MARKETPLACE_COLUMN,
  SERVICE_ORIGIN_COLUMN,
  STATUS_COLUMN,
  TASK_TYPE_COLUMN,
  TASK_CREATED_AT_COLUMN,
  TASK_STARTED_AT_COLUMN,
  TASK_COMPLETED_AT_COLUMN,
  SCHEDULE_TYPE_COLUMN,
  EXECUTION_MODE_COLUMN,
  TIME_TO_START_COLUMN,
  TIME_TAKEN_TO_COMPLETE_COLUMN,
  TOTAL_LIFE_TIME_COLUMN,
  MONITORING_PAYLOAD,
  MESSAGE_GROUP_ID,
  DEDUPLICATION_ID,
  RETRY_COUNT_COLUMN,
  MONITORING_METADATA,
  RETRIGGER_ACTION,
];
