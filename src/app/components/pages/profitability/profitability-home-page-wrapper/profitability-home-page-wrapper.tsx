import EmptyState from '@/app/components/common/empty-state/empty-state';
import SyncFilters from '@/app/components/hoc/sync-filters';
import PrivateRoute from '@/app/components/private-route/private-route';
import { profitabilityHomeNotConfiguredForMarketplace } from '@/constants/empty-state.constants';
import {
  DateRangeOptions,
  ProfitabilityFrequency,
} from '@/constants/profitability/profitability.constants';
import { PROFITABILITY_DASHBOARD_URL } from '@/constants/urls.constants';
import { FeaturesEnum } from '@/enums/auth.enums';
import { PageTitleEnum } from '@/enums/index.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import { WalmartAccountTypeEnum } from '@/enums/walmart.enums';
import useCatalogAccountSubHeader from '@/hooks/use-catalog-account-sub-header.hook';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import {
  selectIsOrdersTable,
  setProfitabilityFilterRange,
  setProfitabilityFiltersFrequency,
  setProfitabilityGraphMetricsOptions,
  setProfitabilityMetricsOptions,
  setProfitabilityRangeOptions,
} from '@/redux/slices/profitability/profitability.slice';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import { profitabilityUtils } from '@/utils/profitability.utils';
import { useEffect, useMemo } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import WmtProfitabilityHomePage from '../../profitability-page/profitiability-home-page/profitability-page-home';
import { AmazonProfitabilityHomePage } from '../amazon/home-page/amz-profitability-home-page';

function ProfitabilityHomePageWrapper() {
  const dispatch = useAppDispatch();
  const catalogAccount = useCatalogAccountSubHeader(
    PageTitleEnum.PROFITABILITY_DASHBOARD,
    PAGE_TITLE_TOOLTIPS.PROFITABILITY_HOME
  );
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const isOrdersTable = useAppSelector(selectIsOrdersTable);
  const catalogAccountLS = localStorageUtils.getSelectedCatalogAccount();

  const navigate = useNavigate();

  const marketplace = useMemo(
    () =>
      advertisingAccount?.marketplace ??
      catalogAccount?.marketplace ??
      MarketplaceEnum.AMAZON,
    [advertisingAccount.marketplace, catalogAccount.marketplace]
  );

  useEffect(() => {
    navigate(`${PROFITABILITY_DASHBOARD_URL}/${marketplace}`);
    dispatch(setProfitabilityRangeOptions(DateRangeOptions));
    dispatch(setProfitabilityFilterRange(DateRangeOptions[0]));
    dispatch(
      setProfitabilityMetricsOptions(
        profitabilityUtils.getMetricOptionsByMarketplace(marketplace)
      )
    );
    dispatch(
      setProfitabilityGraphMetricsOptions(
        profitabilityUtils.getMetricOptionsByMarketplace(marketplace, true)
      )
    );
    dispatch(setProfitabilityFiltersFrequency(ProfitabilityFrequency[0]));
  }, [marketplace, navigate, dispatch]);

  if (catalogAccountLS?.accountType === WalmartAccountTypeEnum.FIRST_PARTY) {
    return (
      <div className="">
        <EmptyState {...profitabilityHomeNotConfiguredForMarketplace} />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path={`/${MarketplaceEnum.AMAZON}`}
        element={
          <PrivateRoute
            component={
              <SyncFilters
                selectedNavTitle={profitabilityUtils.getTableTitleByMarketplace(
                  isOrdersTable,
                  MarketplaceEnum.AMAZON
                )}
              >
                <AmazonProfitabilityHomePage />
              </SyncFilters>
            }
            feature={FeaturesEnum.PROFITABILITY_AMAZON}
          />
        }
      />
      <Route
        path={`/${MarketplaceEnum.WALMART}`}
        element={
          <PrivateRoute
            component={
              <SyncFilters
                selectedNavTitle={profitabilityUtils.getTableTitleByMarketplace(
                  isOrdersTable,
                  MarketplaceEnum.WALMART
                )}
              >
                <WmtProfitabilityHomePage />
              </SyncFilters>
            }
            feature={FeaturesEnum.PROFITABILITY_WALMART}
          />
        }
      />
      <Route path="*" element={<Navigate to={marketplace} />} />
    </Routes>
  );
}

export default ProfitabilityHomePageWrapper;
