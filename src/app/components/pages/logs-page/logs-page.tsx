import { customRangeFilterOption, UPDATED_PAGINATION_MODEL } from '@/constants';
import { LogsTableColumns } from '@/constants/table-columns/logs-table-colmns.constant';
import { PageTitleEnum } from '@/enums/index.enums';
import { LogsTitlesEnum } from '@/enums/logs.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum, Range } from '@/enums/serp.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useAdsAccountSubHeader from '@/hooks/use-ads-account-sub-header.hook';
import { IDateRange } from '@/interfaces/serp.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectAppliedFilters } from '@/redux/slices/filters/filter.slice';
import {
  ILogHeaderFilterForm,
  selectLogsHeaderFilterOptions,
  selectLogsHeaderFilters,
  setLogsHeaderFilters,
} from '@/redux/slices/logs/logs.slice';
import { showSuccessToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import LogsService from '@/services/logs/logs.service';
import { genExportFileName } from '@/utils';
import { getStoredLsFilters } from '@/utils/row-filter.utils';
import { SortingState } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import AddedFiltersTab from '../../common/added-filters-tab/added-filters-tab';
import { IDropdownItem } from '../../common/dropdown/dropdown';
import LogsFilterWrapper from '../../page-components/logs-filter-wrapper/logs-filter-wrapper';
import CustomTableWrapper from '../../shared/custom-table-wrapper/custom-table-wrapper';
import styles from './logs-page.module.scss';

export function LogsPage() {
  const advertisingAccount = useAdsAccountSubHeader(
    PageTitleEnum.LOGS,
    PAGE_TITLE_TOOLTIPS.LOGS,
    false,
    undefined
  );

  const [pagination, setPagination] = useState(UPDATED_PAGINATION_MODEL);
  const headerFilters = useAppSelector(selectLogsHeaderFilters);
  const headerFilterOptions = useAppSelector(selectLogsHeaderFilterOptions);

  const appliedFilters = useAppSelector(selectAppliedFilters);

  const storedFilters = getStoredLsFilters(LogsTitlesEnum.LOGS_HOME);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'timestamp',
      desc: true,
    },
  ]);

  const dispatch = useAppDispatch();

  const marketplace = useMemo(
    () => advertisingAccount.marketplace ?? MarketplaceEnum.AMAZON,
    [advertisingAccount]
  );

  const [prevRange, setPrevRange] = useState<IDropdownItem<string> | null>(
    null
  );
  const setFilters = (logsFilters: ILogHeaderFilterForm) =>
    dispatch(setLogsHeaderFilters(logsFilters));

  const onRangeSelect = (value: IDropdownItem<Range>) => {
    setPrevRange(headerFilters.range);

    setFilters({
      ...headerFilters,
      range: value,
    });
  };

  const setCustomDateRange = (value: IDateRange) => {
    setFilters({
      ...headerFilters,
      customDateRange: value,
    });
  };

  const handleDownload = useCallback(
    async (isAllDownload: boolean) => {
      dispatch(
        showSuccessToastMessage({
          title: 'Download Started',
          description: 'This may take a few seconds.',
        })
      );

      const response: any = (await LogsService.getEditLogs(
        isAllDownload ? [] : appliedFilters,
        marketplace,
        headerFilters
      )) as unknown as Record<string, Record<string, unknown[]>>[];
      const res = response.data.data;
      return res;
    },
    [appliedFilters, dispatch, headerFilters, marketplace]
  );
  const handleCustomDateRangeChange = (dateRange: IDateRange) => {
    setFilters({
      ...headerFilters,
      customDateRange: dateRange,
      range: customRangeFilterOption,
    });
  };
  const fetchLogs = useAppQuery({
    queryKey: [QueryKeyEnums.LOGS_FETCH, { headerFilters, appliedFilters }],
    queryFn: () =>
      LogsService.getEditLogs(appliedFilters, marketplace, headerFilters),
  });

  const isLoading = useMemo(
    () => fetchLogs.isLoading || fetchLogs.isFetching,
    [fetchLogs.isFetching, fetchLogs.isLoading]
  );

  const formattedData = useMemo(
    () => fetchLogs.data?.data?.data ?? [],
    [fetchLogs.data?.data?.data]
  );
  const formattedRowCount = useMemo(
    () => fetchLogs.data?.data?.data?.length ?? 0,
    [fetchLogs.data?.data?.data]
  );

  return (
    <div className={styles.container}>
      <LogsFilterWrapper
        title={LogsTitlesEnum.LOGS_HOME}
        exportFileName={genExportFileName(
          marketplace,
          LogsTitlesEnum.LOGS_HOME
        )}
        handleDownload={handleDownload}
        isDataLoaded={isLoading}
        onRangeSelect={onRangeSelect}
        handleCustomDateRangeChange={handleCustomDateRangeChange}
        rangeOptions={headerFilterOptions.range}
      />
      <AddedFiltersTab
        appliedFilters={storedFilters}
        isLoading={isLoading}
        selectedAdvertisingNavTitle={LogsTitlesEnum.LOGS_HOME}
      />
      <CustomTableWrapper
        data={formattedData}
        columns={LogsTableColumns}
        width="100%"
        height="80vh"
        isLoading={isLoading}
        rowCount={formattedRowCount}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
      />
    </div>
  );
}
