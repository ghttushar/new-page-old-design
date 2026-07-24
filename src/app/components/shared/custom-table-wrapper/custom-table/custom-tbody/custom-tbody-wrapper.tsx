import { Cell, Row, Table } from '@tanstack/react-table';
import { ICustomTableBodyStyles } from 'src/interfaces/custom-table/custom-table.interfaces';
import CustomTbody from './custom-tbody';
import VirtualizedCustomTbody from './virtualized-custom-tbody';

export interface CustomTbodyProps<T> {
  table: Table<T>;
  enableRowSelection?: boolean | ((row: Row<T>) => boolean);
  customStyles?: ICustomTableBodyStyles;
  isFooterRequired?: boolean;
  onCellClick?: (cell: Cell<T, unknown>) => void;
  estimateRowSize?: number;
  overscan?: number;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  enableVirtualization?: boolean;
  fixedHeight: boolean;
  isLoading?: boolean;
  showCellSkeleton?: boolean;
}

export function CustomTbodyWrapper<T>(props: CustomTbodyProps<T>) {
  const {
    table,
    customStyles,
    isFooterRequired,
    onCellClick,
    estimateRowSize = 50,
    overscan = 10,
    scrollContainerRef,
    enableVirtualization = true,
    fixedHeight,
    enableRowSelection,
    isLoading = false,
    showCellSkeleton = false,
  } = props;

  if (enableVirtualization) {
    return (
      <VirtualizedCustomTbody
        table={table}
        customStyles={customStyles}
        isFooterRequired={isFooterRequired}
        onCellClick={onCellClick}
        estimateRowSize={estimateRowSize}
        overscan={overscan}
        scrollContainerRef={scrollContainerRef}
        isLoading={isLoading}
        showCellSkeleton={showCellSkeleton}
      />
    );
  } else {
    return (
      <CustomTbody
        table={table}
        customStyles={customStyles}
        isFooterRequired={isFooterRequired}
        onCellClick={onCellClick}
        fixedHeight={fixedHeight}
        isLoading={isLoading}
        showCellSkeleton={showCellSkeleton}
      />
    );
  }
}

export default CustomTbodyWrapper;
