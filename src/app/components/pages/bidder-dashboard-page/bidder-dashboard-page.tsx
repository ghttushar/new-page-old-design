import { UPDATED_PAGINATION_MODEL } from '@/constants';
import { BIDDER_DASHBOARD_PAGE_TITLE_TOOLTIPS } from '@/constants/bidder-dashboard.constants';
import { getFilterConfig } from '@/constants/filter.constants';
import { BIDDER_DASHBOARD_COLUMNS } from '@/constants/table-columns/bidder-dashboard-table-columns.constant';
import {
  BidderDashboardColumnEnum,
  BidderDashboardTableTitlesEnum,
  BidderDashboardTitleEnum,
} from '@/enums/bidder-dashboard.enum';
import { PageTitleEnum } from '@/enums/index.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import useBidderDashboardSubHeader from '@/hooks/use-bidder-dashboard-sub-header.hooks';
import {
  IBidderDashboard,
  IBidderDashboardFilterOptions,
  IBidderDashboardStats,
} from '@/interfaces/bidder-dashboard.interface';
import { useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { selectBidderDashboardHeaderFilters } from '@/redux/slices/bidder-dashboard/bidder-dashboard.slice';
import { selectAppliedFilters } from '@/redux/slices/filters/filter.slice';
import { bidderDashboardService } from '@/services/bidder-dashboard/bidder-dashboard.service';
import { bidderDashboardUtils } from '@/utils/bidder-dashboard.utils';
import columnFilterUtils from '@/utils/column-filter.utils';
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import BidderDashboardFilterWrapper from '../../page-components/bidder-dashboard-components/bidder-dashboard-filter-wrapper/bidder-dashboard-filter-wrapper';
import BidderStatsCards from '../../page-components/bidder-dashboard-components/bidder-stats-cards/bidder-stats-cards';
import CustomTableWrapper from '../../shared/custom-table-wrapper/custom-table-wrapper';
import styles from './bidder-dashboard-page.module.scss';

const BidderDashboardPage = () => {
  useBidderDashboardSubHeader(
    PageTitleEnum.BIDDER_DASHBOARD,
    BIDDER_DASHBOARD_PAGE_TITLE_TOOLTIPS.BIDDER_DASHBOARD
  );

  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const headerFilters = useAppSelector(selectBidderDashboardHeaderFilters);

  const [tableData, setTableData] = useState<IBidderDashboard[]>([]);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);
  const [stats, setStats] = useState<IBidderDashboardStats>({
    totalRecords: 0,
    activeJobs: 0,
    inactiveJobs: 0,
    scheduledJobs: 0,
    amazonJobs: 0,
    walmartJobs: 0,
  });
  const [selectedColumns, setSelectedColumns] = useState<
    Array<ColumnDef<IBidderDashboard>>
  >(BIDDER_DASHBOARD_COLUMNS);
  const [filterOptions, setFilterOptions] =
    useState<IBidderDashboardFilterOptions>({
      accounts: [],
      marketplaces: [],
      statuses: [],
      brandNames: [],
    });
  const [paginationModel, setPaginationModel] = useState<PaginationState>(
    UPDATED_PAGINATION_MODEL
  );
  const [sortModel, setSortModel] = useState<SortingState>([
    {
      id: BidderDashboardColumnEnum.REPORT_DATE,
      desc: true,
    },
  ]);

  const fetchFilterOptions = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_BIDDER_DASHBOARD_FILTER_OPTIONS,
      { selectedAdvertisingAccount },
    ],
    queryFn: bidderDashboardService.getFilterOptions,
  });

  const {
    data: bidderDashboardData,
    isSuccess: isDataSuccess,
    isLoading: isDataLoading,
    isRefetching: isDataRefetching,
    refetch,
  } = useAppQuery({
    queryFn: () => {
      return bidderDashboardService.getBidderHistory(
        bidderDashboardUtils.getBidderDashboardPayload(
          appliedFilters,
          columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
            BIDDER_DASHBOARD_COLUMNS,
            sortModel
          ),
          paginationModel.pageSize,
          paginationModel.pageIndex + 1,
          '',
          headerFilters,
          []
        )
      );
    },
    queryKey: [
      QueryKeyEnums.FETCH_BIDDER_DASHBOARD_DATA,
      {
        selectedAdvertisingAccount,
        appliedFilters,
        sortModel,
        paginationModel,
        headerFilters,
      },
    ],
    enabled: !!selectedAdvertisingAccount,
    options: {
      refetchOnWindowFocus: true,
    },
  });

  const isLoading = useMemo(
    () =>
      fetchFilterOptions.isLoading ||
      fetchFilterOptions.isRefetching ||
      isDataLoading ||
      isDataRefetching,
    [
      fetchFilterOptions.isLoading,
      fetchFilterOptions.isRefetching,
      isDataLoading,
      isDataRefetching,
    ]
  );

  useEffect(() => {
    if (fetchFilterOptions.isSuccess && fetchFilterOptions.data) {
      setFilterOptions(fetchFilterOptions.data);
    }
  }, [fetchFilterOptions.data, fetchFilterOptions.isSuccess]);

  useEffect(() => {
    setTableData([]);
    if (isDataSuccess && bidderDashboardData?.data?.data) {
      const responseData = bidderDashboardData.data.data;

      if (responseData.data?.data && Array.isArray(responseData.data.data)) {
        const data = responseData.data.data;

        const filteredColumns = columnFilterUtils.getStoredColumnFilters(
          BidderDashboardTitleEnum.BidderDashboardHome,
          BIDDER_DASHBOARD_COLUMNS
        );

        const columnsToUse =
          filteredColumns && filteredColumns.length > 0
            ? filteredColumns
            : BIDDER_DASHBOARD_COLUMNS;

        setSelectedColumns(columnsToUse as Array<ColumnDef<IBidderDashboard>>);
        setTableData(data);

        const pagination = responseData.pagination;
        const totalRecords = pagination?.totalItems || data.length;
        setTotalRowCount(Number(totalRecords));

        if (responseData.data.stats) {
          setStats(responseData.data.stats);
        }
      }
    }
  }, [isDataSuccess, bidderDashboardData?.data?.data]);

  const handleBidderDashboardRefetch = () => {
    refetch();
  };

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<IBidderDashboard>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      BidderDashboardTitleEnum.BidderDashboardHome,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  return (
    <div className={styles.bidderDashboardPageContainer}>
      <BidderStatsCards stats={stats} isLoading={isLoading} />

      <BidderDashboardFilterWrapper
        title={BidderDashboardTableTitlesEnum.BIDDER_DASHBOARD_HOME}
        exportFileName={'bidder-dashboard'}
        handleDownload={async () => []}
        onSearchChangeAdditionalLogic={() => {
          // Additional search logic can be added here if needed
        }}
        isLoading={isLoading}
        handleSelectedColumns={setSelectedColumnsHandler}
        selectedColumns={selectedColumns}
        initialColumns={BIDDER_DASHBOARD_COLUMNS}
        handleRefetch={handleBidderDashboardRefetch}
        filterConfig={getFilterConfig(filterOptions)}
        selectedNavTab={BidderDashboardTableTitlesEnum.BIDDER_DASHBOARD_HOME}
      />

      <CustomTableWrapper
        data={tableData}
        columns={selectedColumns}
        width="100%"
        height="62rem"
        isLoading={isLoading}
        rowCount={totalRowCount}
        manualPagination={true}
        pagination={paginationModel}
        setPagination={setPaginationModel}
        manualSorting={true}
        sorting={sortModel}
        setSorting={setSortModel}
        initialPinnedColumns={{
          left: [
            BidderDashboardColumnEnum.BRAND_NAME,
            BidderDashboardColumnEnum.MARKETPLACE,
          ],
        }}
        disableUndefinedSorting={true}
      />
    </div>
  );
};

export default BidderDashboardPage;
