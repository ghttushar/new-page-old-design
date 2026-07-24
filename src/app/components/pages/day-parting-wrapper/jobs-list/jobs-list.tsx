import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useAdsAccountSubHeader from '@/hooks/use-ads-account-sub-header.hook';
import { getJobListUrl } from '@/utils/day-parting.utils';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import CustomTableWrapper from 'src/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { PAGE_SIZE_OPTIONS, PAGINATION_MODEL } from 'src/constants';
import { IJobs } from 'src/interfaces/day-parting.interfaces';
import DayPartingService from 'src/services/day-parting.service';
import { jobsListColumns } from './jobs-list-columns';
import styles from './jobs-list.module.scss';

export default function JobsList() {
  const advertisingAccount = useAdsAccountSubHeader(
    PageTitleEnum.JOB_LIST,
    PAGE_TITLE_TOOLTIPS.JOB_LIST,
    false,
    getJobListUrl
  );
  const [jobListData, setJobListData] = useState<IJobs[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);

    DayPartingService.getJobList()
      .then((res) => {
        res.data?.data.length > 0 && setJobListData([...res.data.data]);
      })
      .finally(() => setIsLoading(false));
  }, [advertisingAccount.value]);

  return (
    <div className={styles.jobListPageContainer}>
      <div className={styles.jobListContainer}>
        <CustomTableWrapper
          data={jobListData}
          columns={jobsListColumns}
          width="100%"
          height="60rem"
          isLoading={isLoading}
          pageSizes={PAGE_SIZE_OPTIONS}
          initialPagination={{
            pageIndex: PAGINATION_MODEL.page,
            pageSize: PAGINATION_MODEL.pageSize,
          }}
          noResultsOverlay={
            <Typography variant="body1" fontSize="1.2rem" fontWeight={500}>
              No records of Jobs
            </Typography>
          }
        />
      </div>
    </div>
  );
}
