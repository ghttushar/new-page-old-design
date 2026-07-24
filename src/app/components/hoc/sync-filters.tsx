import { analysisMetricsOptions } from '@/constants/impact-analysis-filter.constants';
import { ImpactAnalysisTableTitles } from '@/enums/impact-analysis.enums';
import {
  ProfitabilityTableTitlesEnum,
  ProfitabilityTableTypeEnum,
} from '@/enums/profitability.enums';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectAppliedFilters,
  setAppliedFilters,
} from '@/redux/slices/filters/filter.slice';
import { setSelectedAnalysisMetrics } from '@/redux/slices/impact-analysis/impact-analysis.slice';
import { getArrayOfEnums } from '@/utils';
import { checkIsEqual } from '@/utils/advertising.utils';
import { getFormattedMetricsOptionsForProductAds } from '@/utils/analysis.utils';
import { getStoredLsFilters } from '@/utils/row-filter.utils';
import { useEffect, useMemo } from 'react';

const SyncFilters: React.FC<{
  children: React.ReactNode;
  selectedNavTitle: string;
}> = ({ children, selectedNavTitle }) => {
  const dispatch = useAppDispatch();
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const storedFilters = getStoredLsFilters(selectedNavTitle);

  useEffect(() => {
    if (selectedNavTitle === ImpactAnalysisTableTitles.PRODUCT_ADS) {
      dispatch(
        setSelectedAnalysisMetrics(
          getFormattedMetricsOptionsForProductAds(analysisMetricsOptions)
        )
      );
    } else dispatch(setSelectedAnalysisMetrics(analysisMetricsOptions));
  }, [selectedNavTitle, dispatch]);

  const areFiltersEqual = useMemo(
    () => checkIsEqual(storedFilters, appliedFilters),
    [appliedFilters, storedFilters]
  );

  useEffect(() => {
    if (!areFiltersEqual) {
      dispatch(setAppliedFilters(storedFilters));
    }
  }, [dispatch, storedFilters, areFiltersEqual]);
  if (
    areFiltersEqual ||
    getArrayOfEnums(ProfitabilityTableTitlesEnum).includes(
      selectedNavTitle as ProfitabilityTableTitlesEnum
    ) ||
    getArrayOfEnums(ProfitabilityTableTypeEnum).includes(
      selectedNavTitle as ProfitabilityTableTypeEnum
    )
  )
    return children;
};

export default SyncFilters;
