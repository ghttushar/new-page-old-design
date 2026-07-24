import { PAGE_SIZE_OPTIONS, UPDATED_PAGINATION_MODEL } from '@/constants';
import { MONITORING_SEARCH_COLUMNS } from '@/constants/monitoring.constants';
import { MONITORING_COLUMNS } from '@/constants/table-columns/monitoring-table-columns.constant';
import { ColumnNameEnum } from '@/enums/advertising.enums';
import { PageTitleEnum } from '@/enums/index.enums';
import { MonitoringTableTitlesEnum } from '@/enums/monitoring.enum';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useMonitoringSubHeader from '@/hooks/use-monitoring-sub-header.hooks';
import { IMonitoring } from '@/interfaces/monitoring.interface';
import { useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectSearchText } from '@/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { selectAppliedFilters } from '@/redux/slices/filters/filter.slice';
import { selectMonitoringHeaderFilters } from '@/redux/slices/monitoring/monitoring.slice';
import { monitoringService } from '@/services/monitoring/monitoring.service';
import { getUpdatedPagination } from '@/utils';
import columnFilterUtils from '@/utils/column-filter.utils';
import { monitoringUtils } from '@/utils/monitoring.utils';
import { getFilterConfigByMarketplace } from '@/utils/row-filter.utils';
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import MonitoringFilterWrapper from '../../page-components/monitoring-components/monitoring-filter-wrapper/monitoring-filter-wrapper';
import CustomTableWrapper from '../../shared/custom-table-wrapper/custom-table-wrapper';
import styles from './monitoring-page.module.scss';

const MonitoringPage = () => {
  useMonitoringSubHeader(
    PageTitleEnum.MONITORING,
    PAGE_TITLE_TOOLTIPS.MONITORING
  );

  const searchText = useAppSelector(selectSearchText);
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const headerFilters = useAppSelector(selectMonitoringHeaderFilters);

  const [tableData, setTableData] = useState<IMonitoring[]>([]);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);
  const [selectedColumns, setSelectedColumns] = useState<
    Array<ColumnDef<IMonitoring>>
  >([]);
  const [paginationModel, setPaginationModel] = useState<PaginationState>(
    UPDATED_PAGINATION_MODEL
  );
  const [sortModel, setSortModel] = useState<SortingState>([
    {
      id: ColumnNameEnum.TASK_CREATED_AT,
      desc: true,
    },
  ]);

  const {
    data: monitoringData,
    isSuccess: isDataSuccess,
    isLoading: isDataLoading,
    isRefetching: isDataRefetching,
    refetch,
  } = useAppQuery({
    queryFn: () => {
      return monitoringService.getMonitoring(
        monitoringUtils.getMonitoringPayload(
          appliedFilters,
          columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
            MONITORING_COLUMNS,
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
      QueryKeyEnums.FETCH_MONITORING_DATA,
      {
        selectedAdvertisingAccount,
        appliedFilters,
        sortModel,
        searchText,
        paginationModel,
        headerFilters,
      },
    ],
  });

  const isLoading = useMemo(
    () => isDataLoading || isDataRefetching,
    [isDataLoading, isDataRefetching]
  );

  useEffect(() => {
    if (isDataSuccess && monitoringData.data.data.data !== null) {
      let data = monitoringData.data.data.data;
      data = data.map((item) => {
        return {
          ...item,
          id: item._id,
        };
      });
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        MonitoringTableTitlesEnum.MONITORING_HOME
      );

      setSelectedColumns(filteredColumns as Array<ColumnDef<IMonitoring>>);
      setTableData(data);
      setTotalRowCount(Number(monitoringData.data.data.pagination.totalItems));
    }
  }, [
    isDataSuccess,
    monitoringData?.data.data.data,
    monitoringData?.data.data.pagination.totalItems,
  ]);

  const handleMonitoringRefetch = () => {
    setPaginationModel(UPDATED_PAGINATION_MODEL);
    refetch();
  };

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<IMonitoring>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      MonitoringTableTitlesEnum.MONITORING_HOME,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  const handlePaginationReset = useCallback(
    () => setPaginationModel(getUpdatedPagination),
    []
  );

  const handleDownload = async (isAllDownload: boolean) => {
    const response = await monitoringService.getMonitoring(
      monitoringUtils.getMonitoringPayload(
        appliedFilters,
        columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
          MONITORING_COLUMNS,
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
        title={MonitoringTableTitlesEnum.MONITORING_HOME}
        exportFileName={''}
        handleDownload={handleDownload}
        onSearchChangeAdditionalLogic={handlePaginationReset}
        isLoading={isLoading}
        handleSelectedColumns={setSelectedColumnsHandler}
        selectedColumns={selectedColumns}
        initialColumns={MONITORING_COLUMNS}
        handleRefetch={handleMonitoringRefetch}
        filterConfig={getFilterConfigByMarketplace(
          MONITORING_COLUMNS,
          MarketplaceEnum.AMAZON,
          MonitoringTableTitlesEnum.MONITORING_HOME
        )}
        selectedNavTab={MonitoringTableTitlesEnum.MONITORING_HOME}
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
        manualSorting={true}
        sorting={sortModel}
        setSorting={setSortModel}
        initialPinnedColumns={{
          left: [ColumnNameEnum.TASK_ID, ColumnNameEnum.TASK_TYPE],
        }}
        disableUndefinedSorting={true}
      />
    </div>
  );
};
export default MonitoringPage;
