import { MarketplaceEnum } from '@/enums/serp.enums';
import { getAdvertisingAccountOptions } from '@/utils/marketplace-logo.utils';
import navigationUtils from '@/utils/navigation/navigation.utils';
import { Navigate, Route, Routes } from 'react-router-dom';
import { dayPartingAccessDenied } from 'src/constants/empty-state.constants';
import { FeaturesEnum } from 'src/enums/auth.enums';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import EmptyState from '../../common/empty-state/empty-state';
import PrivateRoute from '../../private-route/private-route';
import ConnectAccountStaticPage from '../connect-account-static-page/connect-account-static-page';
import DayPartingPage from './day-parting-page/day-parting-page';
import styles from './day-parting-wrapper.module.scss';
import HistoryChangesPage from './history-changes-page/history-changes-amazon-page';
import WalmartHistoryChangesPage from './history-changes-page/history-changes-walmart-page';
import HistoryPageWrapper from './history-page/history-page-wrapper/history-page-wrapper';
import JobsList from './jobs-list/jobs-list';
import SchedulePageWrapper from './scheduled-jobs-page/shedule-page-wrapper/schedule-page-wrapper';

export default function DayPartingWrapper() {
  const accountDetails = localStorageUtils.getAccountDetails();
  const selectedUserAccountMapping =
    localStorageUtils.getSelectedUserAccountMapping();

  const selectedMarketplace = localStorageUtils.getAdvertisingMarketplace();

  const hasAccounts = !!localStorageUtils.getAvailableAccounts().length;
  const hasAdvertisingAccounts = !!getAdvertisingAccountOptions().length;

  if (!hasAccounts || (hasAccounts && !hasAdvertisingAccounts)) {
    return <ConnectAccountStaticPage />;
  }

  if (
    !navigationUtils.canAccessFeature(
      accountDetails,
      selectedUserAccountMapping,
      FeaturesEnum.DAYPARTING
    )
  )
    return (
      <div className="center-wrapper">
        <EmptyState {...dayPartingAccessDenied} />;
      </div>
    );

  return (
    <div className={styles.wrapperContainer}>
      <Routes>
        <Route
          path="/home/*"
          element={<PrivateRoute component={<DayPartingPage />} />}
        />
        <Route
          path="/job-list/*"
          element={<PrivateRoute component={<JobsList />} />}
        />
        <Route
          path="/history/*"
          element={<PrivateRoute component={<HistoryPageWrapper />} />}
        />
        <Route
          path="/history/:marketplace/:historyId/*"
          element={
            <PrivateRoute
              component={
                <HistoryChangesWrapper
                  marketplace={selectedMarketplace as MarketplaceEnum}
                />
              }
            />
          }
        />
        <Route
          path="/scheduled-jobs/*"
          element={<PrivateRoute component={<SchedulePageWrapper />} />}
        />
        <Route path="*" element={<Navigate to="home" />} />
      </Routes>
    </div>
  );
}

function HistoryChangesWrapper(props: { marketplace: MarketplaceEnum }) {
  if (props.marketplace === MarketplaceEnum.AMAZON)
    return <HistoryChangesPage />;
  else return <WalmartHistoryChangesPage />;
}
