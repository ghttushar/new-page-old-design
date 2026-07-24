import { DATE_FORMAT_12 } from '@/constants/datetime.constants';
import { ColumnNameEnum } from '@/enums/advertising.enums';
import { ICronDefinition } from '@/interfaces/cron/cron-definitions.interface';
import { getFormattedTimezoneDate } from '@/utils/datetime.utils';
import { ColumnDef } from '@tanstack/react-table';
import CronDefinitionsTableActions from 'src/app/components/page-components/cron-definitions-components/cron-definitions-table-actions/cron-definitions-table-actions';
import styles from 'src/app/components/pages/cron-definitions-page/cron-definitions-page.module.scss';

interface ICronDefinitionsColumnsDependencies {
  onView: (definition: ICronDefinition) => void;
  onEdit: (definition: ICronDefinition) => void;
  onToggleStatus: (definition: ICronDefinition) => void;
  totalRowCount: number;
}

const StatusBadge = (isEnabled: boolean) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.3rem 1rem',
      borderRadius: '1.2rem',
      fontSize: '1.2rem',
      fontWeight: 600,
      backgroundColor: isEnabled ? '#e8f5e9' : '#f5f5f5',
      color: isEnabled ? '#2e7d32' : '#9e9e9e',
      border: isEnabled ? '' : '1px solid #e0e0e0',
    }}
  >
    <span
      style={{
        width: '0.6rem',
        height: '0.6rem',
        borderRadius: '50%',
        backgroundColor: isEnabled ? '#2e7d32' : '#9e9e9e',
      }}
    />
    {isEnabled ? 'Active' : 'Inactive'}
  </span>
);

export const cronDefinitionsColumns = (
  deps: ICronDefinitionsColumnsDependencies
): ColumnDef<ICronDefinition>[] => {
  const { onView, onEdit, onToggleStatus, totalRowCount } = deps;

  return [
    {
      accessorKey: 'taskType',
      id: ColumnNameEnum.TASK_ID,
      size: 250,
      header: () => (
        <div
          className={styles.tableHeader}
          style={{ textAlign: 'left', marginLeft: '1.6rem' }}
        >
          Task Type
        </div>
      ),
      cell: ({ row }) => (
        <div className={styles.tableCell}>{row.original.taskType}</div>
      ),
    },
    {
      accessorKey: 'cronExpression',
      id: 'Cron Expression',
      size: 180,
      header: () => (
        <div className={styles.tableHeader} style={{ textAlign: 'center' }}>
          Cron Expression
        </div>
      ),
      cell: ({ row }) => (
        <div
          className={styles.tableCell}
          style={{
            textAlign: 'center',
            fontFamily: 'monospace',
            fontWeight: 600,
          }}
        >
          {row.original.cronExpression}
        </div>
      ),
    },
    {
      accessorKey: 'handler',
      id: 'Handler',
      size: 150,
      header: () => (
        <div className={styles.tableHeader} style={{ textAlign: 'center' }}>
          Handler
        </div>
      ),
      cell: ({ row }) => (
        <div className={styles.tableCell} style={{ textAlign: 'center' }}>
          {row.original.handler === 'schedule_runner'
            ? 'Schedule Runner'
            : 'Node Cron'}
        </div>
      ),
    },
    {
      accessorKey: 'enabled',
      id: 'Enabled',
      size: 110,
      header: () => (
        <div className={styles.tableHeader} style={{ textAlign: 'center' }}>
          Status
        </div>
      ),
      cell: ({ row }) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {StatusBadge(row.original.enabled)}
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      id: 'Created At',
      size: 200,
      header: () => (
        <div className={styles.tableHeader} style={{ textAlign: 'center' }}>
          Created At
        </div>
      ),
      cell: ({ row }) => (
        <div className={styles.tableCell} style={{ textAlign: 'center' }}>
          {getFormattedTimezoneDate(
            row.original.createdAt,
            undefined,
            DATE_FORMAT_12
          )}
        </div>
      ),
    },
    {
      accessorKey: 'updatedAt',
      id: 'Updated At',
      size: 200,
      header: () => (
        <div className={styles.tableHeader} style={{ textAlign: 'center' }}>
          Updated At
        </div>
      ),
      cell: ({ row }) => (
        <div className={styles.tableCell} style={{ textAlign: 'center' }}>
          {getFormattedTimezoneDate(
            row.original.updatedAt,
            undefined,
            DATE_FORMAT_12
          )}
        </div>
      ),
    },
    {
      accessorKey: 'action',
      id: 'Action',
      size: 100,
      enableSorting: false,
      header: () => (
        <div className={styles.tableHeader} style={{ textAlign: 'center' }}>
          Action
        </div>
      ),
      cell: ({ row }) => {
        return (
          <CronDefinitionsTableActions
            definition={row.original}
            onView={onView}
            onEdit={onEdit}
            onToggleStatus={onToggleStatus}
          />
        );
      },
    },
  ];
};
