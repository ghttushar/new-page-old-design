import LogsLevel from '@/app/components/page-components/logs-level/logs-level';
import { ILogsData } from '@/interfaces/logs/logs.interface';
import { getTitleCaseString } from '@/utils';
import { getPrefixBasedOnActionType } from '@/utils/advertising.utils';
import { convertUtcToTimezoneDate } from '@/utils/datetime.utils';
import { ColumnDef } from '@tanstack/react-table';
import styles from 'src/app/components/pages/advertising-page/advertising-walmart/sp/account-level/wmt-sp-account-level.module.scss';
import { DATE_FORMAT_17 } from '../datetime.constants';
import { ACTION_TYPE_MAPPING, SUB_TYPE_MAPPING } from '../logs.constants';
const LEVEL: ColumnDef<ILogsData> = {
  accessorKey: 'editedLevel',
  id: 'Level',
  size: 300,
  enableSorting: false,
  header: (props) => {
    return <div className={`commonHeader`}>Level </div>;
  },

  cell: (props) => {
    const { row } = props;
    const level = row.original.editedLevel;
    if (!level) return <div>-</div>;
    return (
      <div className={`commonCell ${styles.productNameContainer} `}>
        <LogsLevel data={row.original} />
      </div>
    );
  },
};

const ACTION_TYPE: ColumnDef<ILogsData> = {
  accessorKey: 'actionType.type',
  id: 'Action Type',
  size: 100,
  enableSorting: false,
  header: (props) => {
    return <div className={`commonHeader`}>Action Type </div>;
  },

  cell: (props) => {
    const { row } = props;
    const type = row.original.actionType.type;
    const subType = row.original.actionType.subType;

    if (!type) return <div>-</div>;
    return (
      <div className={`commonCell`}>
        {ACTION_TYPE_MAPPING[type] ?? getTitleCaseString(type)}{' '}
        {subType && (
          <span
            style={{
              color: '#999',
            }}
          >
            ( {SUB_TYPE_MAPPING[subType] ?? subType} )
          </span>
        )}
      </div>
    );
  },
};

const FROM: ColumnDef<ILogsData> = {
  accessorKey: 'from',
  id: 'From',
  size: 100,
  enableSorting: false,
  header: (props) => {
    return <div className={`commonHeader`}>From </div>;
  },

  cell: (props) => {
    const { row } = props;
    const value = row.original.from;
    const type = row.original.actionType.type;
    if (!value) return <div>-</div>;

    return (
      <div className={`commonCell`}>
        {getPrefixBasedOnActionType(type, value) ?? value}
      </div>
    );
  },
};

const TO: ColumnDef<ILogsData> = {
  accessorKey: 'to',
  id: 'To',
  size: 100,
  enableSorting: false,
  header: (props) => {
    return <div className={`commonHeader`}>To </div>;
  },

  cell: (props) => {
    const { row } = props;
    const value = row.original.to;
    const type = row.original.actionType.type;
    if (!value) return <div>-</div>;

    return (
      <div className={`commonCell`}>
        {getPrefixBasedOnActionType(type, value) ?? value}
      </div>
    );
  },
};

const UPDATED_DATE_TIME: ColumnDef<ILogsData> = {
  accessorKey: 'timestamp',
  id: 'timestamp',
  size: 110,
  header: (props) => {
    return <div className={`commonHeader`}>Date & Time </div>;
  },

  sortingFn: (rowA, rowB) => {
    const a: number = new Date(rowA.original.timestamp).getTime();
    const b: number = new Date(rowB.original.timestamp).getTime();
    if (a > b) return 1;
    else if (a < b) return -1;
    else return 0;
  },
  sortDescFirst: true,
  enableSorting: true,
  cell: (props) => {
    const { row } = props;
    const time = row.original.timestamp;

    if (!time) return <div>-</div>;

    return (
      <div className={`commonCell`}>
        {convertUtcToTimezoneDate(time, DATE_FORMAT_17)}
      </div>
    );
  },
};

const USER: ColumnDef<ILogsData> = {
  accessorKey: 'userId',
  id: 'User',
  size: 100,
  enableSorting: false,
  header: (props) => {
    return <div className={`commonHeader`}>User </div>;
  },

  cell: (props) => {
    const { row } = props;
    const user = row.original.userName;
    if (!user) return <div>-</div>;

    return <div className={`commonCell`}>{user}</div>;
  },
};

export const LogsTableColumns = [
  LEVEL,
  ACTION_TYPE,
  FROM,
  TO,
  UPDATED_DATE_TIME,
  USER,
];
