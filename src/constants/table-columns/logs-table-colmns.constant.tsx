import LogChangeCell from '@/app/components/page-components/logs-details/logs-change-cell';
import { ILogsData } from '@/interfaces/logs/logs.interface';
import { getTitleCaseString } from '@/utils';
import { convertUtcToTimezoneDate } from '@/utils/datetime.utils';
import { ColumnDef } from '@tanstack/react-table';
import { DATE_FORMAT_17 } from '../datetime.constants';
import { LOG_ENTITY_TYPES, LOG_SOURCE_LABELS } from '../logs.constants';
import InfoIcon from '@/app/components/common/info-icon/info-icon';
import styles from './logs-table-columns.module.scss';

// The columns read from the widest scope to the finest detail, in four groups:
// what was touched (marketplace, service, entity), what changed (action, change),
// who and how, and the record itself.

const text = (value?: string | null) => (value ? value : '-');

/** What each column means, shown from the (i) next to its name. */
const TIPS: { [column: string]: string } = {
  Marketplace: 'The marketplace the change was made in, such as Amazon or Walmart.',
  Service: 'The part of Anarix that recorded the change, such as advertising, dayparting or rules.',
  'Entity Type': 'The kind of item that changed: campaign, ad group, keyword, target, rule and so on.',
  Entity: 'The name of the item that changed, with its ID underneath.',
  Action: 'What was done to the item: a field updated, the item created or archived, or a rule or job executed.',
  Change: 'The value before and after an edit. Creations, bulk edits and executions open their details.',
  Through: 'Where the change was made from: a page in Anarix, Jiva, or a connected tool such as Slack or Claude.',
  User: 'The person or system that made the change.',
  'Date & Time': 'When the change was made, in your time zone. Select the header to sort.',
  'Log ID': 'The unique ID of this log entry.',
};

/** A column name with its (i) tooltip. */
const heading = (label: string) => (
  <div className={`commonHeader`}>
    {label}
    <InfoIcon
      title={TIPS[label]}
      customIconStyles={{ height: 'auto', width: '1.3rem', marginLeft: '0.5rem' }}
    />
  </div>
);

/** A plain column with a header; the cell can be any node. */
const textColumn = (
  id: string,
  size: number,
  accessorKey: keyof ILogsData,
  render: (row: ILogsData) => React.ReactNode
): ColumnDef<ILogsData> => ({
  accessorKey,
  id,
  size,
  enableSorting: false,
  header: () => heading(id),
  cell: ({ row }) => <div className={`commonCell`}>{render(row.original)}</div>,
});

/** One band of columns, with its title above them. */
const group = (
  id: string,
  title: string,
  columns: ColumnDef<ILogsData>[]
): ColumnDef<ILogsData> => ({
  id,
  enableSorting: false,
  header: () => <div className={styles.group}>{title}</div>,
  columns,
});

// ── What was touched ──────────────────────────────────────────────────────────────────────────

const MARKETPLACE = textColumn('Marketplace', 135, 'marketplace', (r) =>
  r.marketplace ? getTitleCaseString(r.marketplace) : '-'
);

const SERVICE = textColumn('Service', 110, 'service', (r) =>
  r.service ? getTitleCaseString(r.service) : '-'
);

const ENTITY_TYPE = textColumn('Entity Type', 140, 'entityType', (r) =>
  r.entityType
    ? LOG_ENTITY_TYPES[r.entityType] ?? getTitleCaseString(r.entityType)
    : '-'
);

const ENTITY: ColumnDef<ILogsData> = {
  accessorKey: 'entityName',
  id: 'Entity',
  size: 220,
  enableSorting: false,
  header: () => heading('Entity'),
  cell: ({ row }) => {
    const { entityName, entityId } = row.original;
    const name = entityName || entityId;
    return (
      <div className={`commonCell`}>
        <div className={styles.name}>{text(name)}</div>
        {entityId && entityId !== name && (
          <div className={styles.sub}>{entityId}</div>
        )}
      </div>
    );
  },
};

// ── What changed ──────────────────────────────────────────────────────────────────────────────

/** "bidChange.percentage" reads as "Bid change percentage". */
const humanize = (name: string) => {
  const words = name
    .replace(/[._]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

/** What was done, in one phrase: "Bid update", "Anarix_B07XK2 created", "Daily budget archived". */
const actionLabel = (r: ILogsData) => {
  const name =
    r.entityName ||
    r.entityId ||
    LOG_ENTITY_TYPES[r.entityType ?? ''] ||
    'Item';
  const subject = r.fieldName ? humanize(r.fieldName) : name;
  switch (r.action) {
    case 'CREATE':
      return `${name} created`;
    case 'UPDATE':
      return `${subject} update`;
    case 'DELETE':
      return `${subject} archived`;
    case 'EXECUTE':
      return `${name} executed`;
    default:
      return r.action ? getTitleCaseString(r.action.toLowerCase()) : '-';
  }
};

const ACTION: ColumnDef<ILogsData> = {
  accessorKey: 'action',
  id: 'Action',
  size: 280,
  enableSorting: false,
  header: () => heading('Action'),
  cell: ({ row }) => {
    const label = actionLabel(row.original);
    return (
      <div className={`commonCell`}>
        <span title={label}>{label}</span>
      </div>
    );
  },
};

const CHANGE: ColumnDef<ILogsData> = {
  id: 'Change',
  size: 260,
  enableSorting: false,
  header: () => heading('Change'),
  cell: ({ row }) => (
    <div className={`commonCell`}>
      <LogChangeCell data={row.original} />
    </div>
  ),
};

// ── Who and how ───────────────────────────────────────────────────────────────────────────────

const SOURCE = textColumn('Through', 230, 'editSource', (r) =>
  r.editSource
    ? LOG_SOURCE_LABELS[r.editSource] ?? getTitleCaseString(r.editSource)
    : '-'
);

const USER = textColumn('User', 160, 'userId', (r) =>
  text(r.userName || r.userId)
);

// ── The record ────────────────────────────────────────────────────────────────────────────────

const UPDATED_DATE_TIME: ColumnDef<ILogsData> = {
  accessorKey: 'timestamp',
  id: 'timestamp',
  size: 160,
  header: () => heading('Date & Time'),
  sortingFn: (rowA, rowB) => {
    const a: number = new Date(rowA.original.timestamp).getTime();
    const b: number = new Date(rowB.original.timestamp).getTime();
    if (a > b) return 1;
    else if (a < b) return -1;
    else return 0;
  },
  sortDescFirst: true,
  enableSorting: true,
  cell: ({ row }) => {
    const time = row.original.timestamp || row.original.changedAt;
    if (!time) return <div>-</div>;
    const [date, clock] = convertUtcToTimezoneDate(time, DATE_FORMAT_17)
      .split('|')
      .map((part: string) => part.trim());
    return (
      <div className={`commonCell`}>
        <div className={styles.date}>{date}</div>
        {clock && <div className={styles.time}>{clock}</div>}
      </div>
    );
  },
};

const LOG_ID: ColumnDef<ILogsData> = {
  accessorKey: 'logId',
  id: 'Log ID',
  size: 280,
  enableSorting: false,
  header: () => heading('Log ID'),
  cell: ({ row }) => (
    <div className={`commonCell`}>
      <span className={styles.idMuted}>{text(row.original.logId)}</span>
    </div>
  ),
};

export const LogsTableColumns: ColumnDef<ILogsData>[] = [
  group('area', 'What was touched', [
    MARKETPLACE,
    SERVICE,
    ENTITY_TYPE,
    ENTITY,
  ]),
  group('what', 'What changed', [ACTION, CHANGE]),
  group('who', 'Who and how', [SOURCE, USER]),
  group('record', 'The record', [UPDATED_DATE_TIME, LOG_ID]),
];
