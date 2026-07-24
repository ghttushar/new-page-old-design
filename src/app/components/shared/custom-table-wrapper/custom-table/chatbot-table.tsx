import HoverInfoTooltip from '@/app/components/common/hover-info-tooltip/hover-info-tooltip';
import { formatNum, getTitleCaseString } from '@/utils';
import { CircularProgress } from '@mui/material';
import React from 'react';
import styles from './chatbot-table.module.scss';
type DataRow = Record<string, string | null | undefined>;

interface GenericTableProps {
  data: DataRow[];
  loading?: boolean;
}

const GenericTable: React.FC<GenericTableProps> = ({
  data,
  loading = false,
}) => {
  if (!data || data.length === 0 || loading) {
    return (
      <div className={styles.noData}>
        <CircularProgress sx={{ color: '#77469b' }} size={'3rem'} />
      </div>
    );
  }

  const columns = Object.keys(data[0]);
  const formatCell = (value: string | null | undefined, column: string) => {
    if (!value) return '-';
    if (
      (value && isNaN(Number(value))) ||
      column.toLowerCase().includes('id') ||
      column.toLowerCase().includes('asin') ||
      column.toLowerCase().includes('sku')
    )
      return value;

    return formatNum(value);
  };
  const formatHeader = (header: string): string => {
    return getTitleCaseString(header);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr className={styles.row}>
              {columns.map((column) => (
                <th key={column} className={styles.th}>
                  <HoverInfoTooltip title={formatHeader(column)}>
                    <span className={styles.thDiv}>{formatHeader(column)}</span>
                  </HoverInfoTooltip>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className={styles.row}>
                {columns.map((column) => (
                  <td key={`${rowIndex}-${column}`} className={styles.td}>
                    {formatCell(row[column], column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenericTable;
