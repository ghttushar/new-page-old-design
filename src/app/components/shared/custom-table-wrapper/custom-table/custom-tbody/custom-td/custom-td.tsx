import SkeletonComponent from '@/app/components/common/skeleton/skeleton';
import { Cell, flexRender } from '@tanstack/react-table';
import { ICustomTableStylesHelper } from 'src/interfaces/custom-table/custom-table.interfaces';
import customTableUtils from 'src/utils/custom-table.utils';
import styles from './custom-td.module.scss';

/* eslint-disable-next-line */
export interface CustomTdProps<T> {
  cell: Cell<T, unknown>;
  customStyles?: ICustomTableStylesHelper;
  onCellClick?: (cell: Cell<T, unknown>) => void;
  isLoading?: boolean;
  showCellSkeleton?: boolean;
}

export function CustomTd<T>(props: CustomTdProps<T>) {
  const { cell, customStyles, isLoading, showCellSkeleton } = props;
  const columnSkeleton = cell.column.columnDef.meta?.columnSkeleton === true;

  return (
    <td
      key={cell.id}
      style={{
        width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
        ...customTableUtils.getCommonPinningStyles(cell.column),
      }}
      className={`${styles.td} ${customStyles?.className}`}
      onClick={() => {
        if (props.onCellClick) {
          props.onCellClick(cell);
        }
      }}
    >
      <div className={`${styles.wrapper} ${customStyles?.wrapper} `}>
        {isLoading === true &&
        showCellSkeleton === true &&
        columnSkeleton === false ? (
          <div className={styles.loaderWrapper}>
            <SkeletonComponent
              height={'4rem'}
              width={'10rem'}
              color="#f4f4f4"
            />
          </div>
        ) : (
          <div className={`${styles.tdDiv} ${customStyles?.tdDiv}`}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        )}
      </div>
    </td>
  );
}

export default CustomTd;
