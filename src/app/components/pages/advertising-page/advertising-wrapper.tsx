import { DynamicFilterKeys } from '@/enums/filter.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { useAppQuery } from '@/redux/react-query-hooks';
import { setDynamicFilterValuesByFilterKey } from '@/redux/slices/filters/filter.slice';
import {
  setIsTagListLoading,
  setTags,
} from '@/redux/slices/tagging/tagging.slice';
import { TaggingServices } from '@/services/tagging/tagging.services';
import navigationUtils from '@/utils/navigation/navigation.utils';
import { useEffect, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { advertisingAccessDenied } from 'src/constants/empty-state.constants';
import { FeaturesEnum } from 'src/enums/auth.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectAdvertisingAccount,
  setAdvertisingAccountOptions,
} from 'src/redux/slices/auth/auth.slice';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import { getAdvertisingAccountOptions } from 'src/utils/marketplace-logo.utils';
import EmptyState from '../../common/empty-state/empty-state';
import PrivateRoute from '../../private-route/private-route';
import ConnectAccountStaticPage from '../connect-account-static-page/connect-account-static-page';
import KeywordActionWrapper from '../keyword-actions-page/keyword-action-wrapper';
import AdvertisingTypesWrapper from './advertising-types-wrapper';
import AnalysisWrapper from './analysis-page/analysis-page-wrapper';
import ComparisonPage from './comparison-page/comparison-page';

export function AdvertisingWrapper() {
  const accountDetails = localStorageUtils.getAccountDetails();
  const selectedUserAccountMapping =
    localStorageUtils.getSelectedUserAccountMapping();
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const dispatch = useAppDispatch();
  useEffect(() => {
    const advertisingAccountOptions = getAdvertisingAccountOptions();
    dispatch(setAdvertisingAccountOptions(advertisingAccountOptions));
  }, [dispatch]);

  const hasAccounts = !!localStorageUtils.getAvailableAccounts().length;
  const hasAdvertisingAccounts = !!getAdvertisingAccountOptions().length;

  const metaId = useMemo(
    () => advertisingAccount.value,
    [advertisingAccount.value]
  );

  const marketplace = useMemo(
    () => advertisingAccount.marketplace ?? MarketplaceEnum.AMAZON,
    [advertisingAccount.marketplace]
  );

  // Getting all tags at the beginning of advertising when selected account changes
  const fetchTags = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_TAGS_LIST,
      {
        metaId,
        marketplace,
      },
    ],
    queryFn: async ({ signal }) => {
      dispatch(setTags([]));
      dispatch(
        setDynamicFilterValuesByFilterKey({ [DynamicFilterKeys.TAG_NAME]: [] })
      );

      return await TaggingServices.getTagsList(metaId, marketplace, signal);
    },
    enabled: Boolean(metaId),
    options: {
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
    },
  });

  useEffect(() => {
    if (fetchTags.data) {
      const resData = fetchTags.data.data;
      dispatch(setTags(resData.data));

      dispatch(
        setDynamicFilterValuesByFilterKey({
          [DynamicFilterKeys.TAG_NAME]: resData.data.map(
            (item) => item.tagName
          ),
        })
      );
    }
  }, [dispatch, fetchTags.data]);

  useEffect(() => {
    dispatch(
      setIsTagListLoading(fetchTags.isLoading || fetchTags.isRefetching)
    );
  }, [dispatch, fetchTags.isLoading, fetchTags.isRefetching]);

  if (!hasAccounts || (hasAccounts && !hasAdvertisingAccounts)) {
    return <ConnectAccountStaticPage />;
  }

  if (
    !navigationUtils.canAccessFeature(
      accountDetails,
      selectedUserAccountMapping,
      FeaturesEnum.ADVERTISING
    ) ||
    !advertisingAccount
  )
    return (
      <div className="center-wrapper">
        <EmptyState {...advertisingAccessDenied} />;
      </div>
    );

  return (
    <Routes>
      <Route
        path="/analysis/*"
        element={
          <PrivateRoute
            component={<AnalysisWrapper />}
            feature={FeaturesEnum.ADVERTISING_IMPACT_ANALYSIS}
          />
        }
      />
      <Route
        path="/comparison"
        element={<PrivateRoute component={<ComparisonPage />} />}
      />
      <Route
        path="/targeting-actions/*"
        element={
          <PrivateRoute
            component={<KeywordActionWrapper />}
            feature={FeaturesEnum.ADVERTISING_TARGETING_ACTIONS_AMAZON}
          />
        }
      />
      <Route
        path="/campaign-manager/*"
        element={<PrivateRoute component={<AdvertisingTypesWrapper />} />}
      />
      <Route path="*" element={<Navigate to="campaign-manager" replace />} />
    </Routes>
  );
}

export default AdvertisingWrapper;
