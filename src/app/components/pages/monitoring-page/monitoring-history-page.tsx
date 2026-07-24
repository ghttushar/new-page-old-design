import { PageTitleEnum } from '@/enums/index.enums';
import { MonitoringTableTitlesEnum } from '@/enums/monitoring.enum';
import { QueryKeyEnums } from '@/enums/query.enums';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { selectAppliedFilters } from '@/redux/slices/filters/filter.slice';
import columnFilterUtils from '@/utils/column-filter.utils';
import { getFilterConfigByMarketplace } from '@/utils/row-filter.utils';
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PAGE_SIZE_OPTIONS, UPDATED_PAGINATION_MODEL } from 'src/constants';
import { ColumnNameEnum } from 'src/enums/advertising.enums';
import { IMonitoring } from 'src/interfaces/monitoring.interface';
import { selectSearchText } from 'src/redux/slices/advertising/advertising-filter.slice';
import { monitoringService } from 'src/services/monitoring/monitoring.service';

import { MONITORING_SEARCH_COLUMNS } from '@/constants/monitoring.constants';
import { MONITORING_HISTORY_COLUMNS } from '@/constants/table-columns/monitoring-table-columns.constant';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useMonitoringSubHeader from '@/hooks/use-monitoring-sub-header.hooks';
import { useAppSelector } from '@/redux/hooks';
import { selectMonitoringHeaderFilters } from '@/redux/slices/monitoring/monitoring.slice';
import { getUpdatedPagination } from '@/utils';
import { monitoringUtils } from '@/utils/monitoring.utils';
import MonitoringFilterWrapper from '../../page-components/monitoring-components/monitoring-filter-wrapper/monitoring-filter-wrapper';
import CustomTableWrapper from '../../shared/custom-table-wrapper/custom-table-wrapper';
import styles from './monitoring-page.module.scss';

const MonitoringHistoryPage = () => {
  useMonitoringSubHeader(
    PageTitleEnum.MONITORING_HISTORY,
    PAGE_TITLE_TOOLTIPS.MONITORING_HISTORY
  );

  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const searchText = useAppSelector(selectSearchText);
  const headerFilters = useAppSelector(selectMonitoringHeaderFilters);
  const [selectedColumns, setSelectedColumns] = useState<
    Array<ColumnDef<IMonitoring>>
  >([]);
  const [tableData, setTableData] = useState<IMonitoring[]>([]);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);
  const [paginationModel, setPaginationModel] = useState<PaginationState>(
    UPDATED_PAGINATION_MODEL
  );
  const [sortModel, setSortModel] = useState<SortingState>([
    {
      id: ColumnNameEnum.TASK_COMPLETED_AT,
      desc: true,
    },
  ]);

  const {
    data: historyData,
    isLoading: isHistoryDataLoading,
    isRefetching: isHistoryRefetching,
    isSuccess: isHistorySuccess,
    refetch,
  } = useAppQuery({
    queryFn: () => {
      return monitoringService.getMonitoringHistory(
        monitoringUtils.getMonitoringPayload(
          appliedFilters,
          columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
            MONITORING_HISTORY_COLUMNS,
            sortModel
          ),
          paginationModel.pageSize,
          paginationModel.pageIndex + 1,
          searchText,
          headerFilters,
          MONITORING_SEARCH_COLUMNS
        )
      );
    },
    queryKey: [
      QueryKeyEnums.FETCH_MONITORING_HISTORY,
      {
        appliedFilters,
        sortModel,
        searchText,
        paginationModel,
        headerFilters,
        selectedAdvertisingAccount,
      },
    ],
  });

  const isLoading = useMemo(
    () => isHistoryDataLoading || isHistoryRefetching,
    [isHistoryDataLoading, isHistoryRefetching]
  );

  useEffect(() => {
    if (isHistorySuccess && historyData.data?.data.data !== null) {
      let data = historyData.data.data.data;
      data = data.map((item) => {
        return {
          ...item,
          id: item._id,
        };
      });
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        MonitoringTableTitlesEnum.MONITORING_HISTORY
      );

      setSelectedColumns(filteredColumns as Array<ColumnDef<IMonitoring>>);
      setTableData(data);
      setTotalRowCount(Number(historyData.data.data.pagination.totalItems));
    }
  }, [
    historyData?.data.data.data,
    historyData?.data.data.pagination.totalItems,
    isHistorySuccess,
  ]);

  const handleMonitoringHistoryRefetch = () => {
    setPaginationModel(UPDATED_PAGINATION_MODEL);
    refetch();
  };

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<IMonitoring>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      MonitoringTableTitlesEnum.MONITORING_HISTORY,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  const handlePaginationReset = useCallback(
    () => setPaginationModel(getUpdatedPagination),
    []
  );

  const handleDownload = async (isAllDownload: boolean) => {
    const response = await monitoringService.getMonitoringHistory(
      monitoringUtils.getMonitoringPayload(
        appliedFilters,
        columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
          MONITORING_HISTORY_COLUMNS,
          sortModel
        ),
        0,
        0,
        searchText,
        headerFilters,
        MONITORING_SEARCH_COLUMNS,
        true,
        isAllDownload
      )
    );

    return response.data.data.data as unknown as Record<string, unknown>[];
  };

  return (
    <div className={styles.monitoringPageContainer}>
      <MonitoringFilterWrapper
        title={MonitoringTableTitlesEnum.MONITORING_HISTORY}
        onSearchChangeAdditionalLogic={handlePaginationReset}
        exportFileName=""
        isLoading={isLoading}
        handleSelectedColumns={setSelectedColumnsHandler}
        selectedColumns={selectedColumns}
        initialColumns={MONITORING_HISTORY_COLUMNS}
        handleRefetch={handleMonitoringHistoryRefetch}
        filterConfig={getFilterConfigByMarketplace(
          MONITORING_HISTORY_COLUMNS,
          MarketplaceEnum.AMAZON,
          MonitoringTableTitlesEnum.MONITORING_HISTORY
        )}
        selectedNavTab={MonitoringTableTitlesEnum.MONITORING_HISTORY}
        handleDownload={handleDownload}
      />

      <CustomTableWrapper
        data={tableData}
        columns={selectedColumns}
        width="100%"
        height="61rem"
        isLoading={isLoading}
        pageSizes={PAGE_SIZE_OPTIONS}
        rowCount={totalRowCount}
        manualPagination={true}
        pagination={paginationModel}
        setPagination={setPaginationModel}
        initialPinnedColumns={{
          left: [ColumnNameEnum.TASK_ID, ColumnNameEnum.TASK_TYPE],
          right: [],
        }}
        manualSorting={true}
        sorting={sortModel}
        setSorting={setSortModel}
        disableUndefinedSorting={true}
      />
    </div>
  );
};
export default MonitoringHistoryPage;
