import { Cell, Row, Table } from '@tanstack/react-table';
import { ICustomTableBodyStyles } from 'src/interfaces/custom-table/custom-table.interfaces';
import styles from './custom-tbody.module.scss';
import CustomTd from './custom-td/custom-td';

/* eslint-disable-next-line */
export interface CustomTbodyProps<T> {
  table: Table<T>;
  enableRowSelection?: boolean | ((row: Row<T>) => boolean);
  customStyles?: ICustomTableBodyStyles;
  isFooterRequired?: boolean;
  onCellClick?: (cell: Cell<T, unknown>) => void;
  fixedHeight: boolean;
  isLoading?: boolean;
  showCellSkeleton?: boolean;
}

export function CustomTbody<T>(props: CustomTbodyProps<T>) {
  const {
    table,
    enableRowSelection,
    customStyles,
    isFooterRequired,
    onCellClick,
    fixedHeight,
    isLoading = false,
    showCellSkeleton = false,
  } = props;
  return (
    <tbody
      className={`${styles.tbody} ${customStyles?.className}`}
      data-test="table-tbody"
    >
      {table.getRowModel().rows.map((row) => (
        <tr
          className={`${styles.tr} ${customStyles?.tr?.className} ${
            isFooterRequired ? styles.lastRow : ''
          } ${
            row.getIsSelected()
              ? customStyles?.tr?.selectedClassName || styles.selectedRow
              : ''
          } ${row.depth > 0 ? `${styles.subRow}` : ''} ${
            fixedHeight ? styles.lastRowWithBorder : ''
          }`}
          key={row.id}
          style={{ height: 'auto' }}
          data-test="table-row"
          data-depth={row.depth}
          data-index={row.index}
        >
          {row.getVisibleCells().map((cell) => {
            return (
              <CustomTd
                cell={cell}
                key={cell.id}
                customStyles={customStyles?.tr?.td}
                onCellClick={onCellClick}
                isLoading={isLoading}
                showCellSkeleton={showCellSkeleton}
              />
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}

export default CustomTbody;
