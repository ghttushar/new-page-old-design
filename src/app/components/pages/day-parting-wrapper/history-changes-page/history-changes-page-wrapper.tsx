import { DownloadTableButton } from '@/app/components/common/download-button/download-table-button';
import SearchClear from '@/app/components/common/search/search-clear';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { useAppSelector } from '@/redux/hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { getFilteredTableData } from '@/utils/row-filter.utils';
import Typography from '@mui/material/Typography';
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';
import TabsSelect from 'src/app/components/common/tabs-select/tabs-select';
import CustomTableWrapper from 'src/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { PAGE_SIZE_OPTIONS } from 'src/constants';
import { IHistoryChangeData } from 'src/interfaces/day-parting.interfaces';
import styles from './history-changes-page.module.scss';

export interface ITabData {
  label: string;
  value: string;
}

export interface HistoryChangesPageWrapperProps {
  tabValue: string;
  handleTabChange: (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => void;
  tabData: ITabData[];
  columns: ColumnDef<IHistoryChangeData>[];
  rows: IHistoryChangeData[];
  isLoading: boolean;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  marketplace: MarketplaceEnum;
}

export default function HistoryChangesPageWrapper({
  tabValue,
  handleTabChange,
  tabData,
  columns,
  rows,
  isLoading,
  sorting,
  setSorting,
  pagination,
  setPagination,
  marketplace,
}: HistoryChangesPageWrapperProps) {
  const [searchText, setSearchText] = useState('');
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);

  const filteredRows = useMemo(
    () =>
      getFilteredTableData(rows, [], searchText, [
        'keywordText',
        'targetId',
        'adGroupId',
        'campaignId',
      ]),
    [rows, searchText]
  );
  return (
    <div className={styles.historyChangesPageContainer}>
      <div className={styles.historyChangesContainer}>
        <TabsSelect
          tabValue={tabValue}
          handleTabChange={handleTabChange}
          tabsWithIndicator={true}
          tabData={tabData}
          singleTabStyles={{
            fontSize: '1.6rem !important',
            fontWeight: '600 !important',
          }}
        />

        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <SearchClear
              initialRows={rows}
              title={tabValue}
              setSearchValue={setSearchText}
              setUpdatedRows={(data) => {
                return;
              }}
              customSearchHandler={(searchText) => {
                return;
              }}
            />
            <DownloadTableButton
              data={filteredRows}
              squareDimension="3rem"
              downloadOptionsRequired={false}
              filename={`${selectedAdvertisingAccount?.label}_${tabValue}_history`}
            />
          </div>
          <div className={styles.tableDiv}>
            <CustomTableWrapper
              data={filteredRows}
              columns={columns}
              width="100%"
              height="60rem"
              isLoading={isLoading}
              sorting={sorting}
              setSorting={setSorting}
              pageSizes={PAGE_SIZE_OPTIONS}
              pagination={pagination}
              disableUndefinedSorting={true}
              setPagination={setPagination}
              noResultsOverlay={
                <Typography variant="body1" fontSize="1.2rem" fontWeight={500}>
                  No records of Job History Changes for{' '}
                  <span className={styles.tabValueText}>{tabValue}</span>
                </Typography>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
