import EmptyState from '@/app/components/common/empty-state/empty-state';
import SyncFilters from '@/app/components/hoc/sync-filters';
import PrivateRoute from '@/app/components/private-route/private-route';
import { profitabilityHomeNotConfiguredForMarketplace } from '@/constants/empty-state.constants';
import { ProfitabilityFrequencyConstants } from '@/constants/profitability/profitability.constants';
import { PROFITABILITY_TRENDS_PAGE_URL } from '@/constants/urls.constants';
import { FeaturesEnum } from '@/enums/auth.enums';
import { PageTitleEnum } from '@/enums/index.enums';
import { ProfitabilityTableTitlesEnum } from '@/enums/profitability.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import { WalmartAccountTypeEnum } from '@/enums/walmart.enums';
import useCatalogAccountSubHeader from '@/hooks/use-catalog-account-sub-header.hook';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectProfitabilityHeaderFilters,
  setActivePerformanceBox,
  setProfitabilityFilterState,
  setProfitabilityGraphMetricsOptions,
  setProfitabilityRangeOptions,
  setSelectedProducts,
} from '@/redux/slices/profitability/profitability.slice';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import { profitabilityUtils } from '@/utils/profitability.utils';
import { useEffect, useMemo } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import WalmartProfitabilityTrendsPage from '../../profitability-page/profitability-trends-page/walmart-profitability-trends-page';
import { AmzProfitabilityTrendsPage } from '../amazon/trends-page/amz-profitability-trends-page';

function ProfitabilityTrendsPageWrapper() {
  const catalogAccount = useCatalogAccountSubHeader(
    PageTitleEnum.PROFITABILITY_TRENDS,
    PAGE_TITLE_TOOLTIPS.PROFITABILITY_TRENDS
  );

  const catalogAccountLS = localStorageUtils.getSelectedCatalogAccount();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectProfitabilityHeaderFilters);

  const marketplace = useMemo(
    () => catalogAccount.marketplace ?? MarketplaceEnum.AMAZON,
    [catalogAccount.marketplace]
  );

  const trendsDefaultFilters = useMemo(
    () => profitabilityUtils.getPnlDefaultFilters(filters),
    [filters]
  );

  useEffect(() => {
    navigate(`${PROFITABILITY_TRENDS_PAGE_URL}/${marketplace}`);
    dispatch(setProfitabilityFilterState(trendsDefaultFilters));
    dispatch(setProfitabilityRangeOptions(ProfitabilityFrequencyConstants));
    dispatch(
      setProfitabilityGraphMetricsOptions(
        profitabilityUtils.getMetricOptionsByMarketplace(marketplace, true)
      )
    );
    dispatch(setActivePerformanceBox(0));
    dispatch(setSelectedProducts([]));
  }, [dispatch, marketplace, navigate]);

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
                selectedNavTitle={
                  ProfitabilityTableTitlesEnum.PROFITABILITY_TRENDS
                }
              >
                <AmzProfitabilityTrendsPage />
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
                selectedNavTitle={
                  ProfitabilityTableTitlesEnum.PROFITABILITY_TRENDS
                }
              >
                <WalmartProfitabilityTrendsPage />
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

export default ProfitabilityTrendsPageWrapper;
