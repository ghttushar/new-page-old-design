import { DAY_PARTING_SCHEDULED_JOBS_URL } from '@/constants/urls.constants';
import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useAdsAccountSubHeader from '@/hooks/use-ads-account-sub-header.hook';
import { getScheduledJobsUrl } from '@/utils/day-parting.utils';
import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ScheduledJobsPage from '../schedule-job-amazon/scheduled-jobs-amazon-page';
import ScheduledJobsWalmartPage from '../schedule-page-walmart/scheduled-jobs-walmart-page';

export default function SchedulePageWrapper() {
  const advertisingAccount = useAdsAccountSubHeader(
    PageTitleEnum.SCHEDULED_JOBS,
    PAGE_TITLE_TOOLTIPS.SCHEDULED_JOBS,
    true,
    getScheduledJobsUrl
  );
  const navigate = useNavigate();

  useEffect(() => {
    navigate(
      `${DAY_PARTING_SCHEDULED_JOBS_URL}/${advertisingAccount.marketplace?.toLowerCase()}`
    );
  }, [advertisingAccount, navigate]);

  return (
    <div>
      <Routes>
        <Route path="/amazon" element={<ScheduledJobsPage />} />
        <Route path="/walmart" element={<ScheduledJobsWalmartPage />} />
      </Routes>
    </div>
  );
}
