import { PageTitleEnum } from '@/enums/index.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useAdsAccountSubHeader from '@/hooks/use-ads-account-sub-header.hook';
import { IDaypartingTrigger } from '@/interfaces/day-parting.interfaces';
import { useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingHeaderFilters } from '@/redux/slices/advertising/advertising-filter.slice';
import WalmartDayPartingService from '@/services/day-parting-wmt.service';
import columnFilterUtils from '@/utils/column-filter.utils';
import {
  getFormattedAdType,
  getScheduledJobsUrl,
} from '@/utils/day-parting.utils';
import Typography from '@mui/material/Typography';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import CustomTableWrapper from 'src/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { PAGE_SIZE_OPTIONS } from 'src/constants';
import { scheduledJobsColumns } from '../scheduled-jobs-page-columns';
import styles from '../scheduled-jobs-page.module.scss';

export default function ScheduledJobsWalmartPage() {
  const advertisingAccount = useAdsAccountSubHeader(
    PageTitleEnum.SCHEDULED_JOBS,
    PAGE_TITLE_TOOLTIPS.SCHEDULED_JOBS,
    false,
    getScheduledJobsUrl
  );
  const selectedAdTypeFilter = useAppSelector(selectAdvertisingHeaderFilters);

  const [scheduledJobsData, setScheduledJobsData] =
    useState<IDaypartingTrigger[]>();
  const [paginationModel, setPaginationModel] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'nextChangeScheduled',
      desc: true,
    },
  ]);

  const fetchWalmartScheduledJob = useAppQuery({
    queryFn: () =>
      WalmartDayPartingService.getScheduledJobs(
        '',
        [],
        columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
          scheduledJobsColumns,
          sorting
        ),
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        getFormattedAdType(selectedAdTypeFilter.adType.value)
      ),
    queryKey: [
      QueryKeyEnums.FETCH_WALMART_SCHEDULED_JOBS,
      { advertisingAccount, paginationModel, sorting, selectedAdTypeFilter },
    ],
    enabled: selectedAdTypeFilter.adType.value !== '',
  });

  useEffect(() => {
    if (fetchWalmartScheduledJob.isSuccess) {
      setScheduledJobsData(fetchWalmartScheduledJob.data.data.data.data);
    }
  }, [
    fetchWalmartScheduledJob.data?.data.data,
    fetchWalmartScheduledJob.isSuccess,
  ]);

  const isLoading = useMemo(
    () =>
      fetchWalmartScheduledJob.isLoading ||
      fetchWalmartScheduledJob.isRefetching,
    [fetchWalmartScheduledJob.isLoading, fetchWalmartScheduledJob.isRefetching]
  );

  return (
    <div className={styles.jobsPageContainer}>
      <div className={styles.jobsContainer}>
        <CustomTableWrapper
          data={scheduledJobsData ?? []}
          columns={scheduledJobsColumns}
          width="100%"
          height="60rem"
          isLoading={isLoading}
          pageSizes={PAGE_SIZE_OPTIONS}
          sorting={sorting}
          setSorting={setSorting}
          pagination={paginationModel}
          setPagination={setPaginationModel}
          disableUndefinedSorting={true}
          noResultsOverlay={
            <Typography variant="body1" fontSize="1.2rem" fontWeight={500}>
              No records of Scheduled Jobs
            </Typography>
          }
        />
      </div>
    </div>
  );
}
