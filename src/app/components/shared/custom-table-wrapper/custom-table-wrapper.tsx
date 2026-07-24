import {
  Cell,
  ColumnDef,
  ColumnPinningState,
  ExpandedState,
  InitialTableState,
  OnChangeFn,
  PaginationState,
  Row,
  RowModel,
  RowSelectionState,
  SortingState,
  TableOptions,
  TableState,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useRef } from 'react';
import { ROW_SELECTION_HEADER_ID } from 'src/constants/custom-table/table.constants';
import { ITableFooterData } from 'src/interfaces/advertising/advertising.interface';
import { ICustomTableStyles } from 'src/interfaces/custom-table/custom-table.interfaces';
import SkeletonComponent from '../../common/skeleton/skeleton';
import CustomPagination from '../custom-pagination/custom-pagination';
import styles from './custom-table-wrapper.module.scss';
import CustomNoResultsOverlay from './custom-table/custom-no-results-overlay/custom-no-results-overlay';
import CustomTable from './custom-table/custom-table';
import CustomTableLoader from './custom-table/custom-table-loader/custom-table-loader';
import RowSelectionCheckbox from './custom-table/row-selection-checkbox/row-selection-checkbox';

export interface CustomTableWrapperProps<T> {
  data: Array<T>;
  columns: Array<ColumnDef<T>>;
  getRowId?: (originalRow: T, index: number, parent?: Row<T>) => string;
  autoResetPageIndex?: boolean;
  rowCount?: number;
  isLoading?: boolean;
  width: string;
  height: string;
  borderRadius?: string;
  pageSizes?: Array<number>;
  manualPagination?: boolean;
  manualSorting?: boolean;
  pagination?: PaginationState;
  setPagination?: React.Dispatch<React.SetStateAction<PaginationState>>;
  initialPagination?: PaginationState;
  sorting?: SortingState;
  setSorting?: React.Dispatch<React.SetStateAction<SortingState>>;
  disableMultiSort?: boolean;
  disableSorting?: boolean;
  initialSorting?: SortingState;
  pinnedColumns?: ColumnPinningState;
  setPinnedColumns?: React.Dispatch<React.SetStateAction<ColumnPinningState>>;
  initialPinnedColumns?: ColumnPinningState;
  rowSelection?: RowSelectionState;
  setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  enableRowSelection?: boolean | ((row: Row<T>) => boolean);
  loadingOverlay?: JSX.Element;
  noResultsOverlay?: JSX.Element;
  pinRowSelection?: boolean;
  customStyles?: ICustomTableStyles;
  disableUndefinedSorting?: boolean;
  getSubRows?: (row: T) => Array<T>;
  isFooterRequired?: boolean;
  onCellClick?: (cell: Cell<T, unknown>) => void;
  getLast2RowsIndex?: (index: number[]) => void;
  totalData?: ITableFooterData;
  expandedState?: ExpandedState;
  setExpandedState?: OnChangeFn<ExpandedState> | undefined;
  enableExpanding?: boolean;
  isPaginationRequired?: boolean;
  estimateRowSize?: number;
  overscan?: number;
  enableVirtualization?: boolean;
  fixedHeight?: boolean;
  isNewDesign?: boolean;
  getProcessedTableData?: (data: RowModel<T>) => void;
  isAccordion?: boolean;
  showCellSkeleton?: boolean;
}

export function CustomTableWrapper<T>(props: CustomTableWrapperProps<T>) {
  const {
    manualPagination,
    autoResetPageIndex,
    pagination,
    setPagination,
    rowCount,
    isLoading = false,
    width,
    height,
    borderRadius,
    pageSizes,
    manualSorting,
    columns,
    initialPinnedColumns,
    data,
    sorting,
    setSorting,
    disableMultiSort = true,
    disableSorting = data.length === 0,
    initialPagination,
    setPinnedColumns,
    pinnedColumns,
    initialSorting,
    rowSelection,
    setRowSelection,
    enableRowSelection,
    estimateRowSize = 50,
    overscan = 10,
    loadingOverlay,
    noResultsOverlay,
    pinRowSelection,
    customStyles,
    disableUndefinedSorting,
    getSubRows,
    isFooterRequired,
    getRowId,
    onCellClick,
    getLast2RowsIndex,
    totalData,
    showCellSkeleton = false,
    expandedState,
    setExpandedState,
    enableExpanding = false,
    isPaginationRequired = true,
    enableVirtualization = data.length > 100,
    fixedHeight = false,
    isNewDesign = false,
    getProcessedTableData,
    isAccordion = false,
  } = props;

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const memoizedInitialPinnedColumns = useMemo(() => {
    const shouldPinRowSelection =
      initialPinnedColumns?.left?.length || pinRowSelection;
    const left = initialPinnedColumns?.left || [];
    if (!shouldPinRowSelection) return initialPinnedColumns;
    return {
      ...initialPinnedColumns,
      left: [ROW_SELECTION_HEADER_ID, ...left],
    };
  }, [initialPinnedColumns, pinRowSelection]);

  const memoizedPinnedColumns = useMemo(() => {
    const shouldPinRowSelection =
      pinnedColumns?.left?.length || pinRowSelection;
    const left = pinnedColumns?.left || [];
    if (!shouldPinRowSelection) return pinnedColumns;
    return {
      ...pinnedColumns,
      left: [ROW_SELECTION_HEADER_ID, ...left],
    };
  }, [pinRowSelection, pinnedColumns]);

  const loadingColumns: ColumnDef<T>[] = useMemo(
    () =>
      Array(8)
        .fill(0)
        .map((col, index) => {
          return {
            accessorKey: `loading-accessorKey-${index}`,
            id: `loading-id-${index}`,
            header(props) {
              return (
                <SkeletonComponent
                  height={'4rem'}
                  width={'8rem'}
                  color="#f4f4f4"
                />
              );
            },
          } as ColumnDef<T, unknown>;
        }),
    []
  );

  const columnsWithRowSelection = useMemo(
    () => [
      {
        id: ROW_SELECTION_HEADER_ID,
        header: ({ table }) => {
          return (
            <RowSelectionCheckbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
                isLoading,
                isHeader: true,
                areColumnsPopulated:
                  table.getHeaderGroups()[0].headers.length > 1,
              }}
            />
          );
        },
        cell: ({ row }) => (
          <div className="px-1">
            <RowSelectionCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
                isHeader: false,
              }}
            />
          </div>
        ),
        size: 50,
      },
      ...columns,
    ],
    [columns, isLoading]
  );
  const tableColumns = useMemo(() => {
    if (isLoading && showCellSkeleton && columns.length === 0)
      return loadingColumns;

    if (!enableRowSelection) return columns;
    else return columnsWithRowSelection;
  }, [
    columns,
    columnsWithRowSelection,
    enableRowSelection,
    isLoading,
    loadingColumns,
    showCellSkeleton,
  ]);

  const setPageIndex = (pageIndex: number) => {
    if (!setPagination || !pagination) return;
    setPagination({
      ...pagination,
      pageIndex,
    });
  };
  const setPageSize = (newPageSize: number) => {
    if (!setPagination) return;
    setPagination({
      pageIndex: 0,
      pageSize: newPageSize,
    });
  };

  const initialTableState: InitialTableState = {};
  if (initialPagination && isPaginationRequired) {
    initialTableState.pagination = initialPagination;
  } else {
    initialTableState.pagination = {
      pageIndex: 0,
      pageSize: isAccordion ? 10000 : data.length,
    };
  }
  if (initialSorting) initialTableState.sorting = initialSorting;
  if (memoizedInitialPinnedColumns)
    initialTableState.columnPinning = memoizedInitialPinnedColumns;

  const tableState: Partial<TableState> = {};
  if (pagination && isPaginationRequired) {
    tableState.pagination = pagination;
  } else {
    tableState.pagination = {
      pageIndex: 0,
      pageSize: isAccordion ? 10000 : data.length,
    };
  }
  if (sorting) tableState.sorting = sorting;
  if (pinnedColumns) tableState.columnPinning = memoizedPinnedColumns;
  if (rowSelection) tableState.rowSelection = rowSelection;
  if (enableExpanding === true) tableState.expanded = expandedState;

  const loadingState = useMemo(() => Array(9).fill({}), []);

  const tableData = useMemo(() => {
    return isLoading === true && showCellSkeleton === true
      ? loadingState
      : data;
  }, [isLoading, showCellSkeleton, loadingState, data]);

  const tableOptions: TableOptions<T> = {
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableMultiSort: true,
    initialState: initialTableState,
    state: tableState,
    sortDescFirst: false,
    meta: {
      footerData: totalData as ITableFooterData,
      getFooterData: () => totalData as ITableFooterData,
      isLoading: isLoading === true,
    },
    onExpandedChange: setExpandedState,
    getSubRows: getSubRows,
    getExpandedRowModel: getExpandedRowModel(),
    // debugTable: true,
    // debugHeaders: true,
    // debugColumns: true,
    enableSortingRemoval: true,
    enableSorting: true,
  };

  if (getRowId) tableOptions.getRowId = getRowId;
  if (disableSorting) tableOptions.enableSorting = !disableSorting;
  if (disableUndefinedSorting)
    tableOptions.enableSortingRemoval = !disableUndefinedSorting;
  if (disableMultiSort) tableOptions.enableMultiSort = !disableMultiSort;
  if (rowCount !== null && rowCount !== undefined)
    tableOptions.rowCount = rowCount;
  if (autoResetPageIndex) tableOptions.autoResetPageIndex = autoResetPageIndex;
  if (manualSorting) tableOptions.manualSorting = manualSorting;
  if (manualPagination) tableOptions.manualPagination = manualPagination;
  if (enableRowSelection) tableOptions.enableRowSelection = enableRowSelection;
  if (setSorting) tableOptions.onSortingChange = setSorting;
  if (setPinnedColumns) tableOptions.onColumnPinningChange = setPinnedColumns;
  if (setPagination) tableOptions.onPaginationChange = setPagination;
  if (setRowSelection) tableOptions.onRowSelectionChange = setRowSelection;
  const table = useReactTable(tableOptions);

  useEffect(() => {
    if (getLast2RowsIndex) {
      const last2Rows = table
        .getSortedRowModel()
        .rows.slice(-2)
        .map((row) => row.index);
      getLast2RowsIndex(last2Rows);
    }
  }, [getLast2RowsIndex, table, sorting, data, isLoading]);

  useEffect(() => {
    if (getProcessedTableData) {
      const rowModel = table.getPrePaginationRowModel();
      getProcessedTableData(rowModel);
    }
  }, [getProcessedTableData, table, data, sorting, isLoading]);

  return (
    <div
      data-test="custom-table-wrapper"
      className={styles.wrapper}
      style={{
        width: width,
        height:
          fixedHeight === false
            ? isLoading || table.getRowModel().rows.length === 0
              ? height
              : 'auto'
            : height,
        maxHeight: height,
      }}
    >
      <div
        id="table-scroll-container"
        ref={scrollContainerRef}
        className={`${styles.container} ${
          isLoading ? styles.disableScroll : ''
        }`}
        style={{
          backgroundColor: 'white',
          border: '1px solid #dadeeb',
          height:
            fixedHeight === false
              ? isLoading || table.getRowModel().rows.length === 0
                ? height
                : 'auto'
              : height,
          borderRadius: borderRadius ? borderRadius : 'inherit',
        }}
      >
        <CustomTable
          table={table}
          isLoading={isLoading}
          manualSorting={manualSorting}
          sorting={sorting}
          setSorting={setSorting}
          setPageIndex={setPageIndex}
          enableRowSelection={enableRowSelection}
          customStyles={customStyles}
          isFooterRequired={isFooterRequired}
          onCellClick={onCellClick}
          estimateRowSize={estimateRowSize}
          overscan={overscan}
          scrollContainerRef={scrollContainerRef}
          enableVirtualization={enableVirtualization}
          fixedHeight={fixedHeight}
          isNewDesign={isNewDesign}
          showCellSkeleton={showCellSkeleton}
        />
      </div>
      {isPaginationRequired === true && (
        <div className={styles.paginationWrapper}>
          <CustomPagination
            table={table}
            manualPagination={manualPagination}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            pageSizes={pageSizes}
          />
        </div>
      )}
      {isLoading === true && showCellSkeleton === false && (
        <CustomTableLoader loadingOverlay={loadingOverlay} />
      )}
      {isLoading === false &&
        showCellSkeleton === false &&
        table.getCenterRows().length === 0 &&
        table.getRowCount() !== 0 && (
          <CustomTableLoader loadingOverlay={loadingOverlay} />
        )}

      {isLoading === false &&
        table.getCenterRows().length === 0 &&
        table.getRowCount() === 0 && (
          <CustomNoResultsOverlay noResultsOverlay={noResultsOverlay} />
        )}
    </div>
  );
}

export default CustomTableWrapper;
