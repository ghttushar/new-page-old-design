import { Header } from '@tanstack/react-table';
import styles from '../custom-th.module.scss';

/* eslint-disable-next-line */
export interface ColumnResizerProps<T> {
  header: Header<T, unknown>;
}

export function ColumnResizer<T>(props: ColumnResizerProps<T>) {
  const { header } = props;
  return (
    <div
      {...{
        onDoubleClick: () => header.column.resetSize(),
        onMouseDown: header.getResizeHandler(),
        onTouchStart: header.getResizeHandler(),
        className: `${styles.resizer} ${
          header.column.getIsResizing() ? styles.isResizing : ''
        }`,
      }}
    />
  );
}

export default ColumnResizer;
