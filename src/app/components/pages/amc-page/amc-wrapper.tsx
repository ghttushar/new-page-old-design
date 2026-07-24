import { MarketplaceEnum } from '@/enums/serp.enums';
import { getAdvertisingAccountOptions } from '@/utils/marketplace-logo.utils';
import navigationUtils from '@/utils/navigation/navigation.utils';
import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import {
  amcNotConfigured,
  amcNotConfiguredForMarketplace,
} from 'src/constants/empty-state.constants';
import { FeaturesEnum } from 'src/enums/auth.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectSelectedInstance,
  setAllInstances,
  setAmcFilters,
} from 'src/redux/slices/amc/amc.slice';
import { showErrorToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { amcInstanceService } from 'src/services/amc/amc-instances.services';
import { addUniqueIdsToData } from 'src/utils';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import EmptyState from '../../common/empty-state/empty-state';
import LoaderWrapper from '../../common/loader-wrapper/loader-wrapper';
import AmcRoute from '../../private-route/amc-route';
import ConnectAccountStaticPage from '../connect-account-static-page/connect-account-static-page';
import PageNotFound from '../page-not-found/page-not-found';
import AMCHomeWrapper from './amc-home-wrapper/amc-home-wrapper';
import AMCReportPage from './amc-report-page/amc-report-page';
import AudienceCreationPage from './audience-creation-page/audience-creation-page';
import AudiencePage from './audience-page/audience-page';
import CreatedAudiencePage from './created-audience-page/created-audience-page';
import ExecutedQueriesPage from './executed-queries-page/executed-queries-page';
import InstancesPage from './instances-page/instances-page';
import QueriesPage from './queries-page/queries-page';
import QueryExecutionPage from './query-execution-page/query-execution-page';
import SchedulePage from './schedule-page/schedule-page';

export default function AmcWrapper() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const accountDetails = localStorageUtils.getAccountDetails();
  const selectedUserAccountMapping =
    localStorageUtils.getSelectedUserAccountMapping();
  const dispatch = useAppDispatch();
  const selectedMarketplace = localStorageUtils.getAdvertisingMarketplace();

  const hasAccounts = !!localStorageUtils.getAvailableAccounts().length;
  const hasAdvertisingAccounts = !!getAdvertisingAccountOptions().length;
  const selectedInstance = useAppSelector(selectSelectedInstance);
  const isAmazonConnected = useMemo(
    () => hasAccounts && hasAdvertisingAccounts,
    [hasAccounts, hasAdvertisingAccounts]
  );

  useEffect(() => {
    if (isAmazonConnected) {
      try {
        const instanceList = localStorageUtils.getApplicableInstances();
        const selectedInstance = localStorageUtils.getSelectedAMCInstance();
        if (instanceList && selectedInstance) {
          dispatch(setAmcFilters(instanceList));
          setIsLoading(false);
        } else {
          amcInstanceService
            .getAllInstances()
            .then((res) => {
              const instanceList = addUniqueIdsToData(res.data.data);
              dispatch(setAllInstances(instanceList));
              dispatch(setAmcFilters(instanceList));
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      } catch (error) {
        dispatch(
          showErrorToastMessage({
            title: 'Oops, an error occurred!',
            description:
              'There was an issue while fetching AMC instances. Please try again later.',
          })
        );
      }
    }
  }, [dispatch, isAmazonConnected]);

  if (!isAmazonConnected) {
    return (
      <ConnectAccountStaticPage marketplaceSpecific={MarketplaceEnum.AMAZON} />
    );
  }

  if (selectedMarketplace !== MarketplaceEnum.AMAZON) {
    return <EmptyState {...amcNotConfiguredForMarketplace} />;
  }

  if (
    !navigationUtils.canAccessFeature(
      accountDetails,
      selectedUserAccountMapping,
      FeaturesEnum.AMAZON_MARKETING_CLOUD
    )
  )
    return (
      <div className="center-wrapper">
        <EmptyState {...amcNotConfigured} />;
      </div>
    );
  else if (isLoading) return <LoaderWrapper />;
  else if (!selectedInstance?.value) return <AMCHomeWrapper />;
  else
    return (
      <Routes>
        <Route
          path="/queries/*"
          element={<AmcRoute component={QueriesPage} />}
        />
        <Route
          path="/executed-queries/report/:workflowExecutionId/:workflowName"
          element={<AmcRoute component={AMCReportPage} />}
        />
        <Route
          path="/executed-queries"
          element={<AmcRoute component={ExecutedQueriesPage} />}
        />
        <Route
          path="/scheduled-workflow-execution"
          element={<AmcRoute component={SchedulePage} />}
        />
        <Route
          path="/query-execution/instance/:instanceId/workflow/:workflowId"
          element={<AmcRoute component={QueryExecutionPage} />}
        />

        <Route
          path="/audience/*"
          element={<AmcRoute component={AudiencePage} />}
        />
        <Route
          path="/created-audience"
          element={<AmcRoute component={CreatedAudiencePage} />}
        />
        <Route
          path="/create-audience/query/:queryId"
          element={<AmcRoute component={AudienceCreationPage} />}
        />
        <Route
          path="/instances"
          element={<AmcRoute component={InstancesPage} />}
        />

        <Route path="/*" element={<Navigate to="queries/default" />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    );
}
