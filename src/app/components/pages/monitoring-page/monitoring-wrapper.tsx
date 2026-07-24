import { MonitoringTableTitlesEnum } from '@/enums/monitoring.enum';
import { QueryKeyEnums } from '@/enums/query.enums';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectUser } from '@/redux/slices/auth/auth.slice';
import { setDynamicFilterValuesByFilterKey } from '@/redux/slices/filters/filter.slice';
import { monitoringService } from '@/services/monitoring/monitoring.service';
import accessControlUtils from '@/utils/access-control/access-control.utils';
import navigationUtils from '@/utils/navigation/navigation.utils';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { FeatureRoutes, FeaturesEnum } from 'src/enums/auth.enums';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import { monitoringAccessDenied } from '../../../../constants/empty-state.constants';
import EmptyState from '../../common/empty-state/empty-state';
import SyncFilters from '../../hoc/sync-filters';
import PrivateRoute from '../../private-route/private-route';
import CronDefinitionsPage from '../cron-definitions-page/cron-definitions-page';
import PageNotFound from '../page-not-found/page-not-found';
import SQSQueueInfoPage from '../sqs-queue-info-page/sqs-queue-info-page';
import MonitoringHistoryPage from './monitoring-history-page';
import MonitoringPage from './monitoring-page';
import styles from './monitoring-wrapper.module.scss';

export default function MonitoringWrapper() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const selectedUserAccountMapping =
    localStorageUtils.getSelectedUserAccountMapping();
  const accountDetails = localStorageUtils.getAccountDetails();

  const fetchDropdownFilters = useAppQuery({
    queryKey: [QueryKeyEnums.FETCH_MONITORING_DROPDOWN_FILTERS],
    queryFn: monitoringService.getAllDropdownFilters,
  });

  useEffect(() => {
    if (fetchDropdownFilters.data?.data.data) {
      const filterTypes = fetchDropdownFilters.data?.data.data;
      dispatch(setDynamicFilterValuesByFilterKey(filterTypes));
    }
  }, [dispatch, fetchDropdownFilters.data?.data.data]);
  if (
    !navigationUtils.canAccessFeature(
      accountDetails,
      selectedUserAccountMapping,
      FeaturesEnum.MONITORING
    ) ||
    !accessControlUtils.isFeatureInHasAccess(
      user?.hasAccess,
      FeaturesEnum.MONITORING
    )
  )
    return (
      <div className="center-wrapper">
        <EmptyState {...monitoringAccessDenied} />;
      </div>
    );

  return (
    <div className={styles.wrapperContainer}>
      <Routes>
        <Route
          path={`/${FeatureRoutes.MONITORING}`}
          element={
            <SyncFilters
              selectedNavTitle={MonitoringTableTitlesEnum.MONITORING_HOME}
            >
              <PrivateRoute
                component={<MonitoringPage />}
                checkIsSuperAdmin={false}
                checkIsAuthenticatedOnly={true}
                feature={FeaturesEnum.MONITORING}
                checkHasMonitoringAccess={true}
              />
            </SyncFilters>
          }
        />
        <Route
          path={`/${FeatureRoutes.MONITORING_HISTORY}`}
          element={
            <SyncFilters
              selectedNavTitle={MonitoringTableTitlesEnum.MONITORING_HISTORY}
            >
              <PrivateRoute
                component={<MonitoringHistoryPage />}
                checkIsSuperAdmin={false}
                checkIsAuthenticatedOnly={true}
                feature={FeaturesEnum.MONITORING}
                checkHasMonitoringAccess={true}
              />
            </SyncFilters>
          }
        />
        <Route
          path={`/${FeatureRoutes.CRON_DEFINITIONS}`}
          element={
            <SyncFilters
              selectedNavTitle={MonitoringTableTitlesEnum.CRON_DEFINITIONS}
            >
              <PrivateRoute
                component={<CronDefinitionsPage />}
                checkIsSuperAdmin={false}
                checkIsAuthenticatedOnly={true}
                feature={FeaturesEnum.MONITORING}
                checkHasMonitoringAccess={true}
              />
            </SyncFilters>
          }
        />
        <Route
          path={`/${FeatureRoutes.QUEUES_INFO}`}
          element={
            <SyncFilters
              selectedNavTitle={MonitoringTableTitlesEnum.SQS_QUEUES}
            >
              <PrivateRoute
                component={<SQSQueueInfoPage />}
                checkIsSuperAdmin={false}
                checkIsAuthenticatedOnly={true}
                feature={FeaturesEnum.MONITORING}
                checkHasMonitoringAccess={true}
              />
            </SyncFilters>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}
