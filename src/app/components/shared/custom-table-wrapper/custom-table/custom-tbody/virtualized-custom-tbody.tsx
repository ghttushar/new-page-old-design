import { Cell, Table } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ICustomTableBodyStyles } from 'src/interfaces/custom-table/custom-table.interfaces';
import styles from './custom-tbody.module.scss';
import CustomTd from './custom-td/custom-td';

export interface VirtualizedCustomTbodyProps<T> {
  table: Table<T>;
  customStyles?: ICustomTableBodyStyles;
  isFooterRequired?: boolean;
  onCellClick?: (cell: Cell<T, unknown>) => void;
  estimateRowSize?: number;
  overscan?: number;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  isLoading?: boolean;
  showCellSkeleton?: boolean;
}

export function VirtualizedCustomTbody<T>(
  props: VirtualizedCustomTbodyProps<T>
) {
  const {
    table,
    customStyles,
    isFooterRequired,
    onCellClick,
    estimateRowSize = 50,
    overscan = 10,
    scrollContainerRef,
    isLoading = false,
    showCellSkeleton = false,
  } = props;

  const rows = table.getRowModel().rows;

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollContainerRef?.current ?? null,
    estimateSize: () => estimateRowSize,
    overscan,
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualItems.length > 0 ? virtualItems[0]?.start || 0 : 0;
  const paddingBottom =
    virtualItems.length > 0
      ? totalSize - (virtualItems[virtualItems.length - 1]?.end || 0)
      : 0;

  return (
    <tbody
      className={`${styles.tbody} ${customStyles?.className}`}
      data-test="table-tbody"
    >
      {paddingTop > 0 && (
        <tr>
          <td style={{ height: `${paddingTop}px` }} />
        </tr>
      )}
      {virtualItems.map((virtualRow) => {
        const row = rows[virtualRow.index];
        return (
          <tr
            key={row.id}
            data-index={virtualRow.index}
            ref={rowVirtualizer.measureElement}
            className={`${styles.tr} ${customStyles?.tr?.className} ${
              isFooterRequired ? styles.lastRow : ''
            } ${
              row.getIsSelected()
                ? customStyles?.tr?.selectedClassName || styles.selectedRow
                : ''
            } ${row.depth > 0 ? `${styles.subRow}` : ''}`}
            data-test="table-row"
            data-depth={row.depth}
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
        );
      })}
      {paddingBottom > 0 && (
        <tr>
          <td style={{ height: `${paddingBottom}px` }} />
        </tr>
      )}
    </tbody>
  );
}

export default VirtualizedCustomTbody;
