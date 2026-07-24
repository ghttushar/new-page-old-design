import { ICustomTableStyles } from '@/interfaces/custom-table/custom-table.interfaces';
import styles from './rules-page-applied-rules.module.scss';

export const customTableStyles: ICustomTableStyles = {
  thead: {
    className: styles.tableHead,
    tr: {
      className: styles.tableHeadRow,
      th: {
        className: styles.tableHeaderCell,
        wrapper: '!border-r-0',
      },
    },
  },
  tbody: {
    tr: {
      className: styles.tableRow,
      td: {
        tdDiv: styles.tableTdDiv,
        wrapper: styles.tableTdWrapper,
      },
    },
  },
};
