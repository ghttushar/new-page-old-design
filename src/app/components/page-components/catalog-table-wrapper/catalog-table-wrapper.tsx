import { CircularProgress } from '@mui/material';
import {
  ColumnDef,
  ExpandedState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import { useEffect } from 'react';
import { PAGE_SIZE_OPTIONS } from 'src/constants';

import { ITableFooterData } from 'src/interfaces/advertising/advertising.interface';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import CustomTableWrapper from '../../shared/custom-table-wrapper/custom-table-wrapper';
import styles from './catalog-table-wrapper.module.scss';

interface ICatalogTableWrapperProps<T> {
  tableData: Array<T>;
  tableColumns: Array<ColumnDef<T>>;
  isTableLoading: boolean;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  totalDataCount: number | string;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  getSubRows?: (row: T) => Array<T>;
  isSyncing?: boolean;
  isFooterRequired?: boolean;
  totalData?: ITableFooterData;
  expandedState?: ExpandedState;
  setExpandedState?: React.Dispatch<React.SetStateAction<ExpandedState>>;
  enableExpanding?: boolean;
}

export default function CatalogTableWrapper<T>({
  tableData,
  tableColumns,
  isTableLoading,
  pagination,
  setPagination,
  totalDataCount,
  sorting,
  setSorting,
  getSubRows,
  isSyncing,
  isFooterRequired,
  totalData,
  expandedState,
  setExpandedState,
  enableExpanding = false,
}: ICatalogTableWrapperProps<T>) {
  useEffect(() => {
    localStorageUtils.setPaginationModel({
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
    });
  }, [pagination]);

  return (
    <div className={styles.tableContainer}>
      <CustomTableWrapper
        data={tableData}
        columns={tableColumns}
        width="100%"
        height="60rem"
        isLoading={isTableLoading}
        rowCount={Number(totalDataCount)}
        pageSizes={PAGE_SIZE_OPTIONS}
        manualPagination={true}
        pagination={pagination}
        setPagination={setPagination}
        manualSorting={true}
        sorting={sorting}
        setSorting={setSorting}
        initialPinnedColumns={{
          left: ['Product Name'],
          right: [],
        }}
        getSubRows={getSubRows}
        expandedState={expandedState}
        setExpandedState={setExpandedState}
        disableUndefinedSorting={true}
        enableExpanding={enableExpanding}
        noResultsOverlay={
          isSyncing && !isTableLoading ? (
            <div className={styles.syncLoader}>
              <CircularProgress sx={{ color: '#77469b' }} />
              <p className={styles.text}>
                Your catalog data is currently syncing. Please check back in 1-2
                hours
              </p>
            </div>
          ) : undefined
        }
        totalData={totalData}
        isFooterRequired={isFooterRequired}
        customStyles={{
          tfoot: {
            tr: {
              td: {
                wrapper: '!py-0',
              },
            },
          },
          tbody: {
            tr: {
              td: {
                wrapper: '!py-2',
              },
            },
          },
        }}
      />
    </div>
  );
}
