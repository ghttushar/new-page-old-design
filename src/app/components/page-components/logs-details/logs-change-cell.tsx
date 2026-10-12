import { DATE_FORMAT_17 } from '@/constants/datetime.constants';
import { LOG_ENTITY_TYPES } from '@/constants/logs.constants';
import { ILogsData } from '@/interfaces/logs/logs.interface';
import { convertUtcToTimezoneDate } from '@/utils/datetime.utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogsBulkPopup from './logs-bulk-popup';
import styles from './logs-change-cell.module.scss';
import LogsTablePopup from './logs-table-popup';

const EXECUTE_ROUTE = {
  RULE: '/rules/applied-rules',
  DAYPARTING_JOB: '/day-parting/amazon',
};

const popupSubtitle = (data: ILogsData) =>
  [
    data.userName || data.userId,
    data.timestamp
      ? convertUtcToTimezoneDate(data.timestamp, DATE_FORMAT_17)
      : null,
  ]
    .filter(Boolean)
    .join(' · ');

/**
 * One cell for what changed:
 * a single edit shows its from and to, a create opens the item it made,
 * a bulk edit opens a popup with every row, and an execute goes to its rule or dayparting job.
 */
export default function LogChangeCell({ data }: { data: ILogsData }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (data.logType === 'BULK_EDIT' && data.bulkChanges?.length) {
    return (
      <>
        <button
          type="button"
          className={styles.link}
          title={`View ${data.bulkChanges.length.toLocaleString()} changes`}
          onClick={() => setOpen(true)}
        >
          View bulk edit
        </button>
        {open && <LogsBulkPopup log={data} onClose={() => setOpen(false)} />}
      </>
    );
  }

  if (data.logType === 'EXECUTE' && data.executeTarget) {
    return (
      <button
        type="button"
        className={styles.link}
        title={data.executeTarget.name}
        onClick={() => navigate(EXECUTE_ROUTE[data.executeTarget!.kind])}
      >
        View execution
      </button>
    );
  }

  if (data.logType === 'CREATE') {
    const entity = (
      LOG_ENTITY_TYPES[data.entityType ?? ''] ?? 'item'
    ).toLowerCase();
    if (!data.createdTable) return <span>Created new {entity}</span>;
    return (
      <>
        <button
          type="button"
          className={styles.link}
          onClick={() => setOpen(true)}
        >
          View created {entity}
        </button>
        {open && (
          <LogsTablePopup
            title={`Created ${entity}`}
            subtitle={popupSubtitle(data)}
            table={data.createdTable}
            onClose={() => setOpen(false)}
          />
        )}
      </>
    );
  }

  if (data.action === 'DELETE') return <span>Archived</span>;

  const from = data.previousValue || data.from;
  const to = data.value || data.to;
  if (!from && !to) return <span className={styles.none}>-</span>;

  if (!from) {
    return (
      <span className={styles.change} title={`set to ${to}`}>
        <span className={styles.clip}>set to {to}</span>
      </span>
    );
  }

  return (
    <span className={styles.change} title={`from ${from} → to ${to || '-'}`}>
      <span className={styles.clip}>from {from}</span>
      <span className={styles.arrow} aria-hidden>
        →
      </span>
      <span className={styles.clip}>to {to || '-'}</span>
    </span>
  );
}
