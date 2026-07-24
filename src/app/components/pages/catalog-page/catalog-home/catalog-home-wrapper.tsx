import EmptyState from '@/app/components/common/empty-state/empty-state';
import SyncFilters from '@/app/components/hoc/sync-filters';
import { catalogNotConfiguredForMarketplace } from '@/constants/empty-state.constants';
import { AmazonAccountType } from '@/enums/advertising.enums';
import { CatalogTabTitlesEnum } from '@/enums/catalog.enums';
import { PageTitleEnum } from '@/enums/index.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import { WalmartAccountTypeEnum } from '@/enums/walmart.enums';
import useCatalogAccountSubHeader from '@/hooks/use-catalog-account-sub-header.hook';
import { IAdvertisingFilter } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectCatalogHeaderFilters } from '@/redux/slices/catalog/catalog.slice';
import {
  setFilters,
  setShowFilterModal,
} from '@/redux/slices/filters/filter.slice';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import { PaginationState } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import AmazonCatalogHome from '../amazon-catalog-home/amazon-catalog-home';
import CatalogHome from './catalog-home';
import styles from './catalog-home.module.scss';

export function CatalogHomeWrapper() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: localStorageUtils.getPaginationModel().pageSize,
  });

  const headerFilters = useAppSelector(selectCatalogHeaderFilters);

  const onChange = useCallback(() => {
    dispatch(setFilters([]));
    dispatch(setShowFilterModal(false));
    setPagination({
      ...pagination,
      pageIndex: 0,
    });
  }, [dispatch, pagination]);

  const catalogAccount = useCatalogAccountSubHeader(
    PageTitleEnum.CATALOG_HOME,
    PAGE_TITLE_TOOLTIPS.CATALOG_HOME,
    onChange
  );

  const getFilterPayload = useCallback(
    (isDownload: boolean, isAllDownload: boolean): IAdvertisingFilter => {
      return {
        range: headerFilters.customDateRange,
        rangeType: headerFilters.range.value,
        isDownload: isDownload,
        downloadWithFilter: isDownload ? !isAllDownload : false,
      };
    },
    [headerFilters.customDateRange, headerFilters.range.value]
  );

  const getFilterPayloadNoDownload = useMemo(() => {
    return getFilterPayload(false, false);
  }, [getFilterPayload]);

  const selectedCatalogAccount = localStorageUtils.getSelectedCatalogAccount();

  useEffect(() => {
    navigate(catalogAccount.marketplace ?? MarketplaceEnum.AMAZON);
  }, [navigate, catalogAccount]);

  return (
    <div className={styles.container}>
      {(catalogAccount.marketplace === MarketplaceEnum.WALMART &&
        selectedCatalogAccount?.accountType ===
          WalmartAccountTypeEnum.THIRD_PARTY) === false &&
      catalogAccount.marketplace !== MarketplaceEnum.AMAZON ? (
        <EmptyState {...catalogNotConfiguredForMarketplace} />
      ) : (
        <Routes>
          <Route
            path={MarketplaceEnum.AMAZON}
            element={
              <SyncFilters
                selectedNavTitle={CatalogTabTitlesEnum.AMAZON_CATALOG}
              >
                <AmazonCatalogHome
                  setPagination={setPagination}
                  pagination={pagination}
                  getFilterPayload={getFilterPayload}
                  getFilterPayloadNoDownload={getFilterPayloadNoDownload}
                  accountType={
                    selectedCatalogAccount?.accountType as AmazonAccountType
                  }
                />
              </SyncFilters>
            }
          />
          <Route
            path={MarketplaceEnum.WALMART}
            element={
              <SyncFilters
                selectedNavTitle={CatalogTabTitlesEnum.WALMART_CATALOG}
              >
                <CatalogHome
                  setPagination={setPagination}
                  pagination={pagination}
                  getFilterPayload={getFilterPayload}
                  getFilterPayloadNoDownload={getFilterPayloadNoDownload}
                />
              </SyncFilters>
            }
          />
          <Route
            path="*"
            element={
              <Navigate
                to={catalogAccount?.marketplace ?? MarketplaceEnum.AMAZON}
              />
            }
          />
        </Routes>
      )}
    </div>
  );
}

export default CatalogHomeWrapper;
