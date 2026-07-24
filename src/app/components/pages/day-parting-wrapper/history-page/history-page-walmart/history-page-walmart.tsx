import ServerSearch from '@/app/components/common/search/server-search';
import { DayPartingTitlesEnum } from '@/enums/day-parting.enums';
import { PageTitleEnum } from '@/enums/index.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useAdsAccountSubHeader from '@/hooks/use-ads-account-sub-header.hook';
import { useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import {
  selectAdvertisingHeaderFilters,
  selectSearchText,
} from '@/redux/slices/advertising/advertising-filter.slice';
import WalmartDayPartingService from '@/services/day-parting-wmt.service';
import { getUpdatedPagination } from '@/utils';
import columnFilterUtils from '@/utils/column-filter.utils';
import {
  getFormattedAdType,
  getJobHistoryUrl,
} from '@/utils/day-parting.utils';
import Typography from '@mui/material/Typography';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CustomTableWrapper from 'src/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { PAGE_SIZE_OPTIONS } from 'src/constants';
import { IDayPartingHistoryResponse } from 'src/interfaces/day-parting.interfaces';
import { dayPartingHistoryColumns } from '../history-page-columns';
import styles from '../history-page.module.scss';

export default function HistoryPageWalmart() {
  const advertisingAccount = useAdsAccountSubHeader(
    PageTitleEnum.HISTORY,
    PAGE_TITLE_TOOLTIPS.HISTORY,
    false,
    getJobHistoryUrl
  );
  const selectedAdTypeFilter = useAppSelector(selectAdvertisingHeaderFilters);

  const searchText = useAppSelector(selectSearchText);

  const [historyData, setHistoryData] = useState<IDayPartingHistoryResponse>();
  const [paginationModel, setPaginationModel] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'createdAt',
      desc: true,
    },
  ]);

  const handlePaginationReset = useCallback(
    () => setPaginationModel(getUpdatedPagination),
    []
  );

  const fetchWalmartHistoryData = useAppQuery({
    queryFn: () =>
      WalmartDayPartingService.getJobsHistory({
        searchText,
        searchColumns: ['jobId', 'title'],
        sortCriteria: columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
          dayPartingHistoryColumns,
          sorting
        ),
        page: paginationModel.pageIndex + 1,
        pageSize: paginationModel.pageSize,
        adType: getFormattedAdType(selectedAdTypeFilter.adType.value),
      }),
    queryKey: [
      QueryKeyEnums.FETCH_WALMART_HISTORY_DATA,
      {
        advertisingAccount,
        paginationModel,
        sorting,
        searchText,
        selectedAdTypeFilter,
      },
    ],
    enabled: selectedAdTypeFilter.adType.value !== '',
  });

  useEffect(() => {
    if (fetchWalmartHistoryData.isSuccess) {
      setHistoryData(fetchWalmartHistoryData.data.data.data);
    }
  }, [
    fetchWalmartHistoryData.data?.data.data,
    fetchWalmartHistoryData.isSuccess,
  ]);

  const isLoading = useMemo(
    () =>
      fetchWalmartHistoryData.isLoading || fetchWalmartHistoryData.isRefetching,
    [fetchWalmartHistoryData.isLoading, fetchWalmartHistoryData.isRefetching]
  );

  return (
    <div className={styles.historyPageContainer}>
      <div className={styles.historyContainer}>
        <ServerSearch
          title={DayPartingTitlesEnum.DAYPARTING_HISTORY}
          handleCustomSearchChange={handlePaginationReset}
        />
        <CustomTableWrapper
          data={historyData?.data ?? []}
          columns={dayPartingHistoryColumns}
          width="100%"
          height="60rem"
          isLoading={isLoading}
          pageSizes={PAGE_SIZE_OPTIONS}
          pagination={paginationModel}
          rowCount={historyData?.totalCount}
          setPagination={setPaginationModel}
          sorting={sorting}
          setSorting={setSorting}
          disableUndefinedSorting={true}
          manualSorting={true}
          manualPagination={true}
          noResultsOverlay={
            <Typography variant="body1" fontSize="1.2rem" fontWeight={500}>
              No records of Jobs History
            </Typography>
          }
        />
      </div>
    </div>
  );
}
