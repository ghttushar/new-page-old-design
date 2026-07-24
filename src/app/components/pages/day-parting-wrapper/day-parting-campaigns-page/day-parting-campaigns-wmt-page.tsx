import { AdType } from '@/enums/advertising.enums';
import { DaypartingTabsEnum } from '@/enums/day-parting.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { useAdType } from '@/hooks/dayparting/use-ad-type.hook';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingHeaderFilters } from '@/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import WalmartDayPartingService from '@/services/day-parting-wmt.service';
import { getDayPartingRedirectUrlByTab } from '@/utils/day-parting.utils';
import Typography from '@mui/material/Typography';
import { SortingState } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import CustomTableWrapper from 'src/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { PAGE_SIZE_OPTIONS, UPDATED_PAGINATION_MODEL } from 'src/constants';
import { IWalmartDaypartingJob } from 'src/interfaces/day-parting.interfaces';
import { useAppSelector } from 'src/redux/hooks';
import { selectTriggerFetch } from 'src/redux/slices/day-parting/day-parting.slice';
import { newDaypartingCampaignColumns } from './day-parting-campaign-table-columns';
import styles from './day-parting-campaigns-page.module.scss';

export default function DayPartingWmtCampaignsPage() {
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const [jobs, setJobs] = useState<IWalmartDaypartingJob[]>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'Date Created',
      desc: true,
    },
  ]);
  const { adType } = useParams<{ adType: string }>();
  const selectedAdTypeFilter = useAppSelector(selectAdvertisingHeaderFilters);
  const trigger = useAppSelector(selectTriggerFetch);

  useAdType(
    adType,
    getDayPartingRedirectUrlByTab(
      DaypartingTabsEnum.DAYPARTING_CAMPAIGNS,
      advertisingAccount.marketplace ?? MarketplaceEnum.AMAZON,
      adType ?? AdType.All
    ),
    advertisingAccount.marketplace ?? MarketplaceEnum.AMAZON
  );

  const fetchWalmartDayPartingJobs = useAppQuery({
    queryFn: () =>
      WalmartDayPartingService.getWalmartDayPartingJobs(
        selectedAdTypeFilter.adType.value
      ),
    queryKey: [
      QueryKeyEnums.FETCH_WALMART_DAYPARTING_JOBS,
      { advertisingAccount, trigger, selectedAdTypeFilter },
    ],
    enabled: selectedAdTypeFilter.adType.value !== '',
  });

  useEffect(() => {
    if (fetchWalmartDayPartingJobs.isSuccess) {
      setJobs(fetchWalmartDayPartingJobs.data.data.data);
    }
  }, [
    fetchWalmartDayPartingJobs.data?.data.data,
    fetchWalmartDayPartingJobs.isSuccess,
  ]);

  const isJobDataLoading = useMemo(
    () =>
      fetchWalmartDayPartingJobs.isLoading ||
      fetchWalmartDayPartingJobs.isRefetching,
    [
      fetchWalmartDayPartingJobs.isLoading,
      fetchWalmartDayPartingJobs.isRefetching,
    ]
  );

  return (
    <div className={styles.dpCampaignsContainer}>
      <CustomTableWrapper
        data={jobs}
        columns={newDaypartingCampaignColumns}
        getRowId={(originalRow) => (originalRow as any)?._id as string}
        width="100%"
        height="100%"
        enableRowSelection={false}
        pageSizes={PAGE_SIZE_OPTIONS}
        rowCount={jobs.length}
        manualPagination={true}
        initialPagination={UPDATED_PAGINATION_MODEL}
        disableUndefinedSorting={true}
        isLoading={isJobDataLoading}
        sorting={sorting}
        setSorting={setSorting}
        initialPinnedColumns={{
          left: [
            String(newDaypartingCampaignColumns[0].id),
            String(newDaypartingCampaignColumns[1].id),
          ],
        }}
        noResultsOverlay={
          <Typography fontSize="1.5rem" fontWeight={700} color={'black'}>
            No results found for the selected filters or search.
          </Typography>
        }
        customStyles={{
          tbody: {
            tr: {
              td: {
                className: styles.TableRow,
              },
            },
          },
        }}
      />
    </div>
  );
}
