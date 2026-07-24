import { ICustomTableStyles } from '@/interfaces/custom-table/custom-table.interfaces';
import styles from './applied-rules-count-popup.module.scss';

export const appliedRulesPopupCustomTableStyles: ICustomTableStyles = {
  thead: {
    className: styles.tableHead,
    tr: {
      className: styles.tableHeadRow,
      th: {
        className: styles.tableHeaderCell,
        wrapper: '!border-r-0',
        tdDiv: styles.tableHeaderTdDiv,
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
