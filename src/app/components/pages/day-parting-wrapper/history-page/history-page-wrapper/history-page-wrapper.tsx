import { DAY_PARTING_HISTORY_URL } from '@/constants/urls.constants';
import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useAdsAccountSubHeader from '@/hooks/use-ads-account-sub-header.hook';
import { getJobHistoryUrl } from '@/utils/day-parting.utils';
import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import HistoryChangesPage from '../../history-changes-page/history-changes-amazon-page';
import WalmartHistoryChangesPage from '../../history-changes-page/history-changes-walmart-page';
import HistoryPageAmazon from '../history-page-amazon/history-page-amazon';
import HistoryPageWalmart from '../history-page-walmart/history-page-walmart';

export default function HistoryPageWrapper() {
  const advertisingAccount = useAdsAccountSubHeader(
    PageTitleEnum.HISTORY,
    PAGE_TITLE_TOOLTIPS.HISTORY,
    true,
    getJobHistoryUrl
  );

  const navigate = useNavigate();
  useEffect(() => {
    navigate(
      `${DAY_PARTING_HISTORY_URL}/${advertisingAccount.marketplace?.toLowerCase()}`
    );
  }, [advertisingAccount, navigate]);

  return (
    <Routes>
      <Route path="/amazon" element={<HistoryPageAmazon />} />
      <Route path="/walmart" element={<HistoryPageWalmart />} />
      <Route path="/amazon/:historyId" element={<HistoryChangesPage />} />
      <Route
        path="/walmart/:historyId"
        element={<WalmartHistoryChangesPage />}
      />
    </Routes>
  );
}
