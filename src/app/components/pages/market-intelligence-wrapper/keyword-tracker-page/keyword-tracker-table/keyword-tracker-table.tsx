import {
  ColumnPinningState,
  PaginationState,
  RowModel,
  SortingState,
} from '@tanstack/react-table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CustomTableWrapper from 'src/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { PAGE_SIZE_OPTIONS } from 'src/constants';
import { IExportKeyword, ISerpKeyword } from 'src/interfaces/serp.interface';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import keywordTrackerUtils from 'src/utils/market-intelligence/keyword-tracker/keyword-tracker.utils';
import { keywordTrackerColumns } from './keyword-tracker-table-columns';
import styles from './keyword-tracker-table.module.scss';

/* eslint-disable-next-line */
export interface IKeywordTrackerTableProps {
  searchedKeywordData: ISerpKeyword[];
  setExportData: (exportData: IExportKeyword[]) => void;
  isLoading: boolean;
  selectedMarketplace: string;
  countryCode?: string;
}

const KeywordTrackerTable: React.FC<IKeywordTrackerTableProps> = ({
  searchedKeywordData,
  setExportData,
  isLoading,
  selectedMarketplace,
  countryCode,
}) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: localStorageUtils.getPaginationModel().pageSize,
  });
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'createdAt',
      desc: true,
    },
  ]);

  const handleSortedData = useCallback(
    (data: RowModel<ISerpKeyword>) => {
      const formattedData = data.rows.map((row) => row.original);
      setExportData(keywordTrackerUtils.getKeywordsToExport(formattedData));
    },
    [setExportData]
  );

  useEffect(() => {
    localStorageUtils.setPaginationModel({
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
    });
  }, [pagination]);

  const initialPinnedColumns: ColumnPinningState = useMemo(() => {
    return {
      left: [keywordTrackerColumns(selectedMarketplace)[0].id as string],
      right: [],
    };
  }, []);

  return (
    <div className={styles.tableDiv}>
      <CustomTableWrapper
        data={searchedKeywordData}
        columns={keywordTrackerColumns(selectedMarketplace, countryCode)}
        isLoading={isLoading}
        width="100%"
        height="60rem"
        pageSizes={PAGE_SIZE_OPTIONS}
        pagination={pagination}
        setPagination={setPagination}
        initialPinnedColumns={initialPinnedColumns}
        enableRowSelection={false}
        getProcessedTableData={handleSortedData}
        sorting={sorting}
        setSorting={setSorting}
        disableUndefinedSorting={true}
        noResultsOverlay={
          <h1 className={styles.noDataLayover}>No Keywords Found</h1>
        }
      />
    </div>
  );
};

export default KeywordTrackerTable;
