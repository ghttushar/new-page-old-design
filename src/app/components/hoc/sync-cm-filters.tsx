import { tacosMetricOptionPayload } from '@/constants/advertising-walmart.constants';
import {
  AdvertisingTitlesEnum,
  WalmartOverallAccountLevelTitles,
  WalmartSBAccountLevelTitles,
  WalmartSPAccountLevelTitles,
  WalmartSVAccountLevelTitles,
} from '@/enums/advertising.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { WalmartAccountTypeEnum } from '@/enums/walmart.enums';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSearchText } from '@/redux/slices/advertising/advertising-filter.slice';
import {
  resetWalmartOverallAdvertisingFilterStates,
  setWalmartOverallPerformanceMetricsOptions,
} from '@/redux/slices/advertising/walmart/advertising-walmart-overall.slice';
import {
  resetWalmartSBAdvertisingFilterStates,
  setWalmartSBPerformanceMetricsOptions,
} from '@/redux/slices/advertising/walmart/advertising-walmart-sb.slice';
import {
  resetWalmartSPAdvertisingFilterStates,
  setWalmartSPPerformanceMetricsOptions,
} from '@/redux/slices/advertising/walmart/advertising-walmart-sp.slice';
import {
  resetWalmartSVAdvertisingFilterStates,
  setWalmartSVPerformanceMetricsOptions,
} from '@/redux/slices/advertising/walmart/advertising-walmart-sv.slice';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { setIsShowImpactOn } from '@/redux/slices/impact-analysis/impact-analysis.slice';
import { getAdvertisingNavTitleFromPathname } from '@/utils/advertising.utils';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import SyncFilters from './sync-filters';

const SyncCampaignManagerFilters: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSearchText(''));
    dispatch(setIsShowImpactOn(false));
  }, [dispatch, location.pathname]);

  const selectedNavTitle = useMemo(() => {
    return getAdvertisingNavTitleFromPathname(location.pathname);
  }, [location.pathname]);

  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);
  const selectedAdvertisingAccountType = useMemo(
    () => localStorageUtils.getSelectedAdvertisingAccount()?.accountType,
    [selectedAdvertisingAccount]
  );

  const selectedMarketplace = useMemo(
    () => selectedAdvertisingAccount.marketplace,
    [selectedAdvertisingAccount]
  );

  const resetWalmartPerformanceMetricOptions = useCallback(() => {
    dispatch(resetWalmartSPAdvertisingFilterStates());
    dispatch(resetWalmartSVAdvertisingFilterStates());
    dispatch(resetWalmartSBAdvertisingFilterStates());
    dispatch(resetWalmartOverallAdvertisingFilterStates());
  }, [dispatch]);

  const addTACOSMetricOption = useCallback(() => {
    if (selectedAdvertisingAccountType === WalmartAccountTypeEnum.FIRST_PARTY) {
      resetWalmartPerformanceMetricOptions();
      return;
    }
    if (selectedNavTitle === WalmartOverallAccountLevelTitles.CAMPAIGNS) {
      dispatch(
        setWalmartOverallPerformanceMetricsOptions(tacosMetricOptionPayload)
      );
    } else if (selectedNavTitle === WalmartSPAccountLevelTitles.CAMPAIGNS) {
      dispatch(setWalmartSPPerformanceMetricsOptions(tacosMetricOptionPayload));
    } else if (selectedNavTitle === WalmartSBAccountLevelTitles.CAMPAIGNS) {
      dispatch(setWalmartSBPerformanceMetricsOptions(tacosMetricOptionPayload));
    } else if (selectedNavTitle === WalmartSVAccountLevelTitles.CAMPAIGNS) {
      dispatch(setWalmartSVPerformanceMetricsOptions(tacosMetricOptionPayload));
    } else {
      resetWalmartPerformanceMetricOptions();
    }
  }, [
    selectedAdvertisingAccountType,
    resetWalmartPerformanceMetricOptions,
    selectedNavTitle,
    dispatch,
  ]);

  useEffect(() => {
    if (selectedMarketplace === MarketplaceEnum.AMAZON) return;
    addTACOSMetricOption();
  }, [addTACOSMetricOption, selectedMarketplace]);

  return (
    <SyncFilters selectedNavTitle={selectedNavTitle as AdvertisingTitlesEnum}>
      {children}
    </SyncFilters>
  );
};

export default SyncCampaignManagerFilters;
