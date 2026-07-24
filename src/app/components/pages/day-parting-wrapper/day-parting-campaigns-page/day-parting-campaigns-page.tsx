import { QueryKeyEnums } from '@/enums/query.enums';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import DayPartingService from '@/services/day-parting.service';
import Typography from '@mui/material/Typography';
import { SortingState } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import CustomTableWrapper from 'src/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { PAGE_SIZE_OPTIONS, UPDATED_PAGINATION_MODEL } from 'src/constants';
import { IDaypartingJob } from 'src/interfaces/day-parting.interfaces';
import { useAppSelector } from 'src/redux/hooks';
import { selectTriggerFetch } from 'src/redux/slices/day-parting/day-parting.slice';
import { newDaypartingCampaignColumns } from './day-parting-campaign-table-columns';
import styles from './day-parting-campaigns-page.module.scss';

export default function DayPartingCampaignsPage() {
  const [jobs, setJobs] = useState<IDaypartingJob[]>([]);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'Date Created',
      desc: true,
    },
  ]);

  const trigger = useAppSelector(selectTriggerFetch);

  const fetchAmazonDayPartingJobs = useAppQuery({
    queryFn: () => DayPartingService.getJobs(),
    queryKey: [
      QueryKeyEnums.FETCH_AMZ_DAYPARTING_JOBS,
      { advertisingAccount, trigger },
    ],
  });

  useEffect(() => {
    if (fetchAmazonDayPartingJobs.isSuccess) {
      setJobs(fetchAmazonDayPartingJobs.data.data.data);
    }
  }, [
    fetchAmazonDayPartingJobs.data?.data.data,
    fetchAmazonDayPartingJobs.isSuccess,
  ]);

  const isJobDataLoading = useMemo(
    () =>
      fetchAmazonDayPartingJobs.isLoading ||
      fetchAmazonDayPartingJobs.isRefetching,
    [
      fetchAmazonDayPartingJobs.isLoading,
      fetchAmazonDayPartingJobs.isRefetching,
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
