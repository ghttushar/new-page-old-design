import { Cell, Row, SortingState, Table } from '@tanstack/react-table';
import { useMemo } from 'react';
import { ICustomTableStyles } from 'src/interfaces/custom-table/custom-table.interfaces';
import styles from './custom-table.module.scss';
import CustomTbodyWrapper from './custom-tbody/custom-tbody-wrapper';
import CustomTfoot from './custom-tfoot/custom-tfoot';
import CustomThead from './custom-thead/custom-thead';

export interface CustomTableProps<T> {
  table: Table<T>;
  isLoading?: boolean;
  manualSorting?: boolean;
  sorting?: SortingState;
  setSorting?: React.Dispatch<React.SetStateAction<SortingState>>;
  setPageIndex: (pageIndex: number) => void;
  enableRowSelection?: boolean | ((row: Row<T>) => boolean);
  customStyles?: ICustomTableStyles;
  isFooterRequired?: boolean;
  onCellClick?: (cell: Cell<T, unknown>) => void;
  estimateRowSize?: number;
  overscan?: number;
  scrollContainerRef: React.RefObject<HTMLElement>;
  enableVirtualization?: boolean;
  fixedHeight: boolean;
  isNewDesign?: boolean;
  showCellSkeleton?: boolean;
}

export function CustomTable<T>(props: CustomTableProps<T>) {
  const {
    table,
    isLoading,
    manualSorting,
    sorting,
    setSorting,
    setPageIndex,
    enableRowSelection,
    customStyles,
    isFooterRequired = false,
    onCellClick,
    estimateRowSize = 50,
    overscan = 10,
    scrollContainerRef,
    enableVirtualization = true,
    fixedHeight,
    isNewDesign = false,
    showCellSkeleton = false,
  } = props;
  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: number } = {};
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
    /* eslint-disable-next-line */
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

  return (
    <table
      className={`${styles.table} ${customStyles?.className}`}
      style={{ ...columnSizeVars, width: table.getTotalSize() }}
    >
      <CustomThead
        table={table}
        manualSorting={manualSorting}
        sorting={sorting}
        setSorting={setSorting}
        setPageIndex={setPageIndex}
        enableRowSelection={enableRowSelection}
        customStyles={customStyles?.thead}
        isNewDesign={isNewDesign}
      />

      {isLoading === false || showCellSkeleton === true ? (
        <CustomTbodyWrapper
          table={table}
          enableRowSelection={enableRowSelection}
          customStyles={customStyles?.tbody}
          isFooterRequired={isFooterRequired}
          onCellClick={onCellClick}
          estimateRowSize={estimateRowSize}
          overscan={overscan}
          scrollContainerRef={scrollContainerRef}
          enableVirtualization={enableVirtualization}
          fixedHeight={fixedHeight}
          showCellSkeleton={showCellSkeleton}
          isLoading={isLoading}
        />
      ) : null}

      {isFooterRequired === true &&
        (!isLoading || showCellSkeleton) &&
        table.getCoreRowModel().rows.length > 0 && (
          <CustomTfoot
            table={table}
            enableRowSelection={enableRowSelection}
            customStyles={customStyles?.tfoot}
            pinFooter={true}
            isLoading={showCellSkeleton && isLoading}
          />
        )}
      {/* TODO: need refactoring */}
    </table>
  );
}

export default CustomTable;
