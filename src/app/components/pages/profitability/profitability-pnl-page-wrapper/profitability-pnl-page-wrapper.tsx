import EmptyState from '@/app/components/common/empty-state/empty-state';
import SyncFilters from '@/app/components/hoc/sync-filters';
import PrivateRoute from '@/app/components/private-route/private-route';
import { profitabilityHomeNotConfiguredForMarketplace } from '@/constants/empty-state.constants';
import { ProfitabilityFrequencyConstants } from '@/constants/profitability/profitability.constants';
import { PROFITABILITY_PNL_URL } from '@/constants/urls.constants';
import { FeaturesEnum } from '@/enums/auth.enums';
import { PageTitleEnum } from '@/enums/index.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import { WalmartAccountTypeEnum } from '@/enums/walmart.enums';
import useCatalogAccountSubHeader from '@/hooks/use-catalog-account-sub-header.hook';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectIsOrdersTable,
  selectProfitabilityHeaderFilters,
  selectSelectedProducts,
  setActivePerformanceBox,
  setProfitabilityFilterState,
  setProfitabilityGraphMetricsOptions,
  setProfitabilityMetricsOptions,
  setProfitabilityRangeOptions,
  setSelectedProducts,
} from '@/redux/slices/profitability/profitability.slice';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import { profitabilityUtils } from '@/utils/profitability.utils';
import { useEffect, useMemo } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import TruePNLPage from '../../profitability-page/profitability-true-pnl/true-pnl-page';
import { AmzProfitabilityPnLPage } from '../amazon/pnl-page/amz-profitability-pnl-page';

export const ProfitabilityPNLPageWrapper = () => {
  const catalogAccount = useCatalogAccountSubHeader(
    PageTitleEnum.PROFITABILITY_PROFIT_N_LOSS,
    PAGE_TITLE_TOOLTIPS.PROFITABILITY_TRUE_PL
  );

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectProfitabilityHeaderFilters);
  const isOrdersTable = useAppSelector(selectIsOrdersTable);
  const selectedProducts = useAppSelector(selectSelectedProducts);
  const catalogAccountLS = localStorageUtils.getSelectedCatalogAccount();

  const marketplace = useMemo(
    () => catalogAccount.marketplace ?? MarketplaceEnum.AMAZON,
    [catalogAccount.marketplace]
  );

  const pnlDefaultFilters = useMemo(
    () => profitabilityUtils.getPnlDefaultFilters(filters),
    [filters]
  );

  useEffect(() => {
    navigate(`${PROFITABILITY_PNL_URL}/${marketplace}`);
    dispatch(setProfitabilityFilterState(pnlDefaultFilters));
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
    dispatch(setProfitabilityRangeOptions(ProfitabilityFrequencyConstants));
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
                selectedNavTitle={profitabilityUtils.getPnlTable(
                  isOrdersTable,
                  MarketplaceEnum.AMAZON
                )}
              >
                <AmzProfitabilityPnLPage />
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
                selectedNavTitle={profitabilityUtils.getPnlTable(
                  isOrdersTable,
                  MarketplaceEnum.WALMART
                )}
              >
                <TruePNLPage />
              </SyncFilters>
            }
            feature={FeaturesEnum.PROFITABILITY_WALMART}
          />
        }
      />
      <Route path="*" element={<Navigate to={marketplace} />} />
    </Routes>
  );
};
