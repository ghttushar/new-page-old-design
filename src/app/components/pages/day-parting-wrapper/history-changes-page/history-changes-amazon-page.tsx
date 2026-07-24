import { dayPartingHistoryChangesTabData } from '@/constants/day-parting.constants';
import { DayPartingHistoryChangesTabsEnum } from '@/enums/day-parting.enums';
import { PageTitleEnum } from '@/enums/index.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useAdsAccountSubHeader from '@/hooks/use-ads-account-sub-header.hook';
import { useAppQuery } from '@/redux/react-query-hooks';
import DayPartingService from '@/services/day-parting.service';
import { getUpdatedPagination } from '@/utils';
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IHistoryChangeData } from 'src/interfaces/day-parting.interfaces';
import {
  getFormattedKeywordsData,
  getFormattedTargetsData,
  getJobHistoryUrl,
} from 'src/utils/day-parting.utils';
import {
  historyChangesColumns,
  targetColumn,
} from './history-changes-page-columns';
import HistoryChangesPageWrapper from './history-changes-page-wrapper';

export default function HistoryChangesPage() {
  const advertisingAccount = useAdsAccountSubHeader(
    PageTitleEnum.HISTORY,
    PAGE_TITLE_TOOLTIPS.HISTORY,
    false,
    getJobHistoryUrl
  );

  const { historyId } = useParams();

  const [tabValue, setTabValue] = useState<string>(
    DayPartingHistoryChangesTabsEnum.KEYWORDS
  );

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'createdAt',
      desc: true,
    },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });

  const [formattedColumns, setFormattedColumns] = useState<
    ColumnDef<IHistoryChangeData>[]
  >([]);
  const [formattedRows, setFormattedRows] = useState<IHistoryChangeData[]>([]);

  const handlePaginationReset = useCallback(
    () => setPagination(getUpdatedPagination),
    []
  );

  const fetchHistoryChangesData = useAppQuery({
    queryFn: () => DayPartingService.getJobsHistoryChanges(historyId),
    queryKey: [
      QueryKeyEnums.FETCH_HISTORY_CHANGES_DATA,
      { advertisingAccount },
    ],
    enabled: Boolean(historyId),
  });

  useEffect(() => {
    if (fetchHistoryChangesData.isSuccess) {
      switch (tabValue) {
        case DayPartingHistoryChangesTabsEnum.KEYWORDS: {
          const keywordData = fetchHistoryChangesData.data.data.data?.keywords;
          setFormattedRows([...getFormattedKeywordsData(keywordData)]);
          setFormattedColumns([...historyChangesColumns]);
          break;
        }

        case DayPartingHistoryChangesTabsEnum.TARGETS: {
          const targetData = fetchHistoryChangesData.data.data.data?.targets;

          setFormattedRows([...getFormattedTargetsData(targetData)]);
          const _columns = [...historyChangesColumns];
          _columns.splice(0, 1, targetColumn);
          setFormattedColumns([..._columns]);
          break;
        }
      }
    }
  }, [
    fetchHistoryChangesData.data?.data.data,
    fetchHistoryChangesData.isSuccess,
    tabValue,
  ]);

  const isLoading = useMemo(
    () =>
      fetchHistoryChangesData.isLoading || fetchHistoryChangesData.isRefetching,
    [fetchHistoryChangesData.isLoading, fetchHistoryChangesData.isRefetching]
  );

  const handleTabChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    setTabValue(value);
    handlePaginationReset();
  };

  return (
    <HistoryChangesPageWrapper
      tabValue={tabValue}
      handleTabChange={handleTabChange}
      tabData={dayPartingHistoryChangesTabData}
      columns={formattedColumns}
      rows={formattedRows}
      isLoading={isLoading}
      sorting={sorting}
      setSorting={setSorting}
      pagination={pagination}
      setPagination={setPagination}
      marketplace={MarketplaceEnum.AMAZON}
    />
  );
}
