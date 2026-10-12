import { DATE_FORMAT_17 } from '@/constants/datetime.constants';
import { LOG_ENTITY_TYPES } from '@/constants/logs.constants';
import { ILogsData } from '@/interfaces/logs/logs.interface';
import { convertUtcToTimezoneDate } from '@/utils/datetime.utils';
import Dialog from '@mui/material/Dialog';
import { useMemo, useState } from 'react';
import SearchText from '../../common/search/debounce-search';
import SecondaryButton from '../../common/secondary-button/secondary-button';
import styles from './logs-bulk-popup.module.scss';

/** Every row of one bulk edit, each with its own from and to. */
export default function LogsBulkPopup({
  log,
  onClose,
}: {
  log: ILogsData;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const changes = log.bulkChanges ?? [];

  const shown = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return changes;
    return changes.filter((c) =>
      [c.name, c.id, c.fieldName, c.from, c.to].some((v) =>
        (v ?? '').toLowerCase().includes(term)
      )
    );
  }, [changes, search]);

  const entity = LOG_ENTITY_TYPES[log.entityType ?? ''] ?? 'Entity';
  const subtitle = [
    log.fieldName,
    log.userName,
    log.timestamp
      ? convertUtcToTimezoneDate(log.timestamp, DATE_FORMAT_17)
      : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { borderRadius: '1.2rem' } }}
    >
      <div className={styles.header}>
        <div>
          <h3>Bulk edit · {changes.length.toLocaleString()} changes</h3>
          <p>{subtitle}</p>
        </div>
        <SecondaryButton
          buttonText="Close"
          buttonFunction={onClose}
          disabled={false}
          height="3.2rem"
        />
      </div>

      <div className={styles.toolbar}>
        <SearchText
          placeholder={`Search ${entity.toLowerCase()}`}
          height="3.2rem"
          searchText={search}
          setSearchText={setSearch}
        />
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>{entity}</th>
              <th>Field</th>
              <th>From</th>
              <th>To</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((c, i) => (
              <tr key={c.id}>
                <td className={styles.index}>{i + 1}</td>
                <td className={styles.name}>{c.name}</td>
                <td>{c.fieldName ?? log.fieldName ?? '-'}</td>
                <td>{c.from || '-'}</td>
                <td>{c.to || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && (
          <div className={styles.empty}>Nothing matches that search.</div>
        )}
      </div>

      <div className={styles.footer}>
        <span>
          Showing {shown.length.toLocaleString()} of{' '}
          {changes.length.toLocaleString()}
        </span>
      </div>
    </Dialog>
  );
}
