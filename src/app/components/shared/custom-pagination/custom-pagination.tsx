import { formatNum } from '@/utils';
import { Table } from '@tanstack/react-table';
import { useMemo } from 'react';
import styles from './custom-pagination.module.scss';

/* eslint-disable-next-line */
export interface CustomPaginationProps<T> {
  table: Table<T>;
  manualPagination?: boolean;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageIndex: number) => void;
  pageSizes?: Array<number>;
}
const DEFAULT_PAGE_SIZES = [50, 100, 500, 1000];

export function CustomPagination<T>(props: CustomPaginationProps<T>) {
  const { table, manualPagination, setPageIndex, setPageSize, pageSizes } =
    props;
  const availablePageSizes = useMemo(
    () => pageSizes || DEFAULT_PAGE_SIZES,
    [pageSizes]
  );
  const onPageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = Number(e.target.value);
    table.setPageSize(newPageSize);

    if (manualPagination) {
      setPageSize(newPageSize);
    }
  };
  const goToPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pageNumber = (Number(e.target.value) || 1) - 1;
    table.setPageIndex(pageNumber);
    if (manualPagination) {
      setPageIndex(pageNumber);
    }
  };

  const goToFirstPage = () => {
    table.firstPage();
    if (manualPagination) {
      setPageIndex(0);
    }
  };

  const goToPreviousPage = () => {
    table.previousPage();
    if (manualPagination) {
      setPageIndex(table.getState().pagination.pageIndex - 1);
    }
  };

  const goToNextPage = () => {
    table.nextPage();
    if (manualPagination) {
      setPageIndex(table.getState().pagination.pageIndex + 1);
    }
  };

  const goToLastPage = () => {
    table.lastPage();
    if (manualPagination) {
      setPageIndex(table.getPageCount() - 1);
    }
  };

  const calculateRangeStart = () => {
    const { pageIndex, pageSize } = table.getState().pagination;
    return pageIndex * pageSize + (table.getCenterRows().length === 0 ? 0 : 1);
  };

  const calculateRangeEnd = () => {
    const { pageIndex, pageSize } = table.getState().pagination;
    const totalRows = table.getRowCount();
    const rangeEnd = pageIndex * pageSize + pageSize;
    return rangeEnd <= totalRows ? rangeEnd : totalRows;
  };

  return (
    <div className={styles.paginationWrapper} data-test="custom-pagination">
      <div className={styles.pagination}>
        <span>Rows per page</span>
        <select
          className={styles.pageSizeDropdown}
          onChange={onPageSizeChange}
          value={table.getState().pagination.pageSize}
          data-test="page-size-dropdown"
        >
          {availablePageSizes.map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {formatNum(pageSize, false)}
            </option>
          ))}
        </select>

        <div className={styles.rowCount} data-test="row-count">
          {formatNum(calculateRangeStart(), false)}-
          {formatNum(calculateRangeEnd(), false)}
          &nbsp;of&nbsp;
          {formatNum(table.getRowCount(), false)}
        </div>
        <div
          className={styles.paginationControls}
          data-test="pagination-controls"
        >
          <button
            className={styles.btn}
            onClick={goToPreviousPage}
            disabled={!table.getCanPreviousPage()}
            data-test="previous-page-button"
          >
            &lt;
          </button>
          <button
            className={styles.btn}
            onClick={goToNextPage}
            disabled={!table.getCanNextPage()}
            data-test="next-page-button"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomPagination;
