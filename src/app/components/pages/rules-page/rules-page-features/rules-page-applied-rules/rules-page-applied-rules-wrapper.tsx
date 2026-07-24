import { UPDATED_PAGINATION_MODEL } from '@/constants';
import { APPLIED_RULES_DEFAULT_SORTING_STATE } from '@/constants/rules/rules.constants';
import { appliedRulesColumns } from '@/constants/table-columns/rules-columns/applied-rules-columns/applied-rules-columns';
import { PageTitleEnum } from '@/enums/index.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useAdsAccountSubHeader from '@/hooks/use-ads-account-sub-header.hook';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectSearchText } from '@/redux/slices/advertising/advertising-filter.slice';
import { selectAppliedFilters } from '@/redux/slices/filters/filter.slice';
import {
  selectAppliedRules,
  setAppliedRules,
  setIsEditModeOn,
} from '@/redux/slices/rules/rules.slice';
import rulesServices from '@/services/rules/rules.services';
import { getUpdatedPagination } from '@/utils';
import { getAccountPayloadDetails } from '@/utils/advertising.utils';
import columnFilterUtils from '@/utils/column-filter.utils';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import { getFormattedAppliedFiltersForAppliedRules } from '@/utils/rules.utils';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import ConnectAccountStaticPage from '../../../connect-account-static-page/connect-account-static-page';
import RulesPageAppliedRules from './rules-page-applied-rules';

export default function RulesPageAppliedRulesWrapper() {
  const selectedAdvertisingAccount = useAdsAccountSubHeader(
    PageTitleEnum.APPLIED_RULES,
    PAGE_TITLE_TOOLTIPS.APPLIED_RULES,
    false
  );
  const dispatch = useAppDispatch();
  const searchText = useAppSelector(selectSearchText);
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const appliedRules = useAppSelector(selectAppliedRules);

  const [totalItems, setTotalItems] = useState<number | string>(0);
  const [pagination, setPagination] = useState<PaginationState>(
    UPDATED_PAGINATION_MODEL
  );
  const [sortModel, setSortModel] = useState<SortingState>(
    APPLIED_RULES_DEFAULT_SORTING_STATE
  );

  const metaId = getAccountPayloadDetails().metaId;
  const marketplace = useMemo(
    () => selectedAdvertisingAccount.marketplace,
    [selectedAdvertisingAccount.marketplace]
  );

  useEffect(() => {
    dispatch(setIsEditModeOn(false));
  }, [dispatch]);

  const handleResetPagination = () => {
    setPagination(getUpdatedPagination);
  };

  const fetchAppliedRules = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_APPLIED_RULES,
      {
        metaId,
        marketplace,
        pagination,
        sortModel,
        searchText,
        appliedFilters,
      },
    ],
    queryFn: async ({ signal }) => {
      dispatch(setAppliedRules([]));

      return await rulesServices.postFetchAppliedRules(
        metaId,
        marketplace ?? MarketplaceEnum.AMAZON,
        getFormattedAppliedFiltersForAppliedRules(appliedFilters),
        pagination.pageIndex,
        pagination.pageSize,
        columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
          appliedRulesColumns,
          sortModel
        ),
        searchText,
        false,
        false,
        signal
      );
    },
    enabled: !(!metaId || !marketplace),
    options: {
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
    },
  });

  useEffect(() => {
    if (fetchAppliedRules.data) {
      const resData = fetchAppliedRules.data.data.data;

      dispatch(setAppliedRules(resData.data));
      setTotalItems(resData.pagination.totalItems);
    }
  }, [dispatch, fetchAppliedRules.data]);

  const isLoading = useMemo(
    () => fetchAppliedRules.isLoading || fetchAppliedRules.isRefetching,
    [fetchAppliedRules.isLoading, fetchAppliedRules.isRefetching]
  );

  const hasAccounts = !!localStorageUtils.getAvailableAccounts().length;

  if (!hasAccounts) return <ConnectAccountStaticPage />;
  return (
    <RulesPageAppliedRules
      data={appliedRules}
      columns={appliedRulesColumns}
      isLoading={isLoading}
      totalItems={totalItems}
      paginationModel={pagination}
      setPaginationModel={setPagination}
      sortModel={sortModel}
      setSortModel={setSortModel}
      handleResetPagination={handleResetPagination}
      appliedFilters={appliedFilters}
    />
  );
}
