import { ICreatedTable } from '@/interfaces/logs/logs.interface';
import Dialog from '@mui/material/Dialog';
import SecondaryButton from '../../common/secondary-button/secondary-button';
import styles from './logs-bulk-popup.module.scss';

/** A popup with a title and one table: a created item's data, or a log's meta data. */
export default function LogsTablePopup({
  title,
  subtitle,
  table,
  onClose,
}: {
  title: string;
  subtitle?: string;
  table: ICreatedTable;
  onClose: () => void;
}) {
  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{ sx: { borderRadius: '1.2rem' } }}
    >
      <div className={styles.header}>
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <SecondaryButton
          buttonText="Close"
          buttonFunction={onClose}
          disabled={false}
          height="3.2rem"
        />
      </div>

      <div className={styles.tableWrap} style={{ marginBottom: '2.4rem' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              {table.columns.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <tr key={i}>
                {row.map((cell, j) => (
                  <td
                    key={table.columns[j]}
                    className={j === 0 ? styles.name : undefined}
                  >
                    {cell || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Dialog>
  );
}
