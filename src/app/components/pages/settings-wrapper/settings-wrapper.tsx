import { CONFIGURATION_PAGE_URL } from '@/constants/urls.constants';
import { LogsTitlesEnum } from '@/enums/logs.enums';
import navigationUtils from '@/utils/navigation/navigation.utils';
import { Navigate, Route, Routes } from 'react-router-dom';
import { FeaturesEnum } from 'src/enums/auth.enums';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import { settingsAccessDenied } from '../../../../constants/empty-state.constants';
import EmptyState from '../../common/empty-state/empty-state';
import SyncFilters from '../../hoc/sync-filters';
import PrivateRoute from '../../private-route/private-route';
import OnboardingWrapper from '../advertising-page/onboarding-page/onboarding-wrapper';
import { LogsPage } from '../logs-page/logs-page';
import ConfigurationPage from './configuration-page/configuration-page';
import InvitesPage from './invites-page/invites-page';
import SettingsPage from './settings-page/settings-page';
import settingsWrapperStyles from './settings-wrapper.module.scss';
import UsersPage from './users-page/users-page';

export default function SettingsWrapper() {
  const selectedUserAccountMapping =
    localStorageUtils.getSelectedUserAccountMapping();
  const accountDetails = localStorageUtils.getAccountDetails();

  if (
    !navigationUtils.canAccessFeature(
      accountDetails,
      selectedUserAccountMapping,
      FeaturesEnum.SETTINGS
    )
  )
    return (
      <div className="center-wrapper">
        <EmptyState {...settingsAccessDenied} />;
      </div>
    );

  return (
    <div className={settingsWrapperStyles.wrapperContainer}>
      <Routes>
        <Route
          path="/invites"
          element={<PrivateRoute component={<InvitesPage />} />}
        />
        <Route
          path="/logs"
          element={
            <PrivateRoute
              component={
                <SyncFilters selectedNavTitle={LogsTitlesEnum.LOGS_HOME}>
                  <LogsPage />
                </SyncFilters>
              }
              feature={FeaturesEnum.SETTINGS_LOGS}
            />
          }
        />
        <Route
          path="/users"
          element={<PrivateRoute component={<UsersPage />} />}
        />
        <Route
          path="/accounts/onboarding-page/*"
          element={<PrivateRoute component={<OnboardingWrapper />} />}
        />
        <Route
          path={`${CONFIGURATION_PAGE_URL}/*`}
          element={
            <PrivateRoute
              component={<ConfigurationPage />}
              feature={FeaturesEnum.CONFIGURATION}
            />
          }
        />
        <Route
          path="/accounts/*"
          element={<PrivateRoute component={<SettingsPage />} />}
        />
        <Route path="*" element={<Navigate to="accounts" replace />} />
      </Routes>
    </div>
  );
}
