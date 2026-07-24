import { walmartDayPartingHistoryChangesTabData } from '@/constants/day-parting.constants';
import { DayPartingHistoryChangesTabsEnum } from '@/enums/day-parting.enums';
import { PageTitleEnum } from '@/enums/index.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useAdsAccountSubHeader from '@/hooks/use-ads-account-sub-header.hook';
import { useAppQuery } from '@/redux/react-query-hooks';
import WalmartDayPartingService from '@/services/day-parting-wmt.service';
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IHistoryChangeData } from 'src/interfaces/day-parting.interfaces';
import {
  getFormattedWalmartAdItemsData,
  getFormattedWalmartKeywordsData,
  getJobHistoryUrl,
} from 'src/utils/day-parting.utils';
import {
  adItemColumn,
  walmartHistoryChangesColumns,
} from './history-changes-page-columns';
import HistoryChangesPageWrapper from './history-changes-page-wrapper';

export default function WalmartHistoryChangesPage() {
  const advertisingAccount = useAdsAccountSubHeader(
    PageTitleEnum.HISTORY,
    PAGE_TITLE_TOOLTIPS.HISTORY,
    false,
    getJobHistoryUrl
  );

  const { historyId } = useParams();

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
  const [tabValue, setTabValue] = useState<string>(
    DayPartingHistoryChangesTabsEnum.KEYWORDS
  );
  const [formattedColumns, setFormattedColumns] = useState<
    ColumnDef<IHistoryChangeData>[]
  >([]);
  const [formattedRows, setFormattedRows] = useState<IHistoryChangeData[]>([]);

  const fetchWalmartHistoryChangesData = useAppQuery({
    queryFn: () => WalmartDayPartingService.getJobsHistoryChanges(historyId),
    queryKey: [
      QueryKeyEnums.FETCH_WALMART_HISTORY_CHANGES_DATA,
      { advertisingAccount },
    ],
    enabled: Boolean(historyId),
  });

  useEffect(() => {
    if (fetchWalmartHistoryChangesData.isSuccess) {
      switch (tabValue) {
        case DayPartingHistoryChangesTabsEnum.KEYWORDS: {
          const keywordData =
            fetchWalmartHistoryChangesData.data.data.data?.keywords;
          setFormattedRows([...getFormattedWalmartKeywordsData(keywordData)]);
          setFormattedColumns([...walmartHistoryChangesColumns]);
          break;
        }
        case DayPartingHistoryChangesTabsEnum.AD_ITEMS: {
          const adItemData =
            fetchWalmartHistoryChangesData.data.data.data?.adItems;
          setFormattedRows([...getFormattedWalmartAdItemsData(adItemData)]);
          const _columns = [...walmartHistoryChangesColumns];
          _columns.splice(0, 1, adItemColumn);
          setFormattedColumns([..._columns]);
          break;
        }
      }
    }
  }, [
    fetchWalmartHistoryChangesData.data?.data.data,
    fetchWalmartHistoryChangesData.isSuccess,
    tabValue,
  ]);

  const isLoading = useMemo(
    () =>
      fetchWalmartHistoryChangesData.isLoading ||
      fetchWalmartHistoryChangesData.isRefetching,
    [
      fetchWalmartHistoryChangesData.isLoading,
      fetchWalmartHistoryChangesData.isRefetching,
    ]
  );

  const handleTabChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    setTabValue(value);
  };

  return (
    <HistoryChangesPageWrapper
      tabValue={tabValue}
      handleTabChange={handleTabChange}
      tabData={walmartDayPartingHistoryChangesTabData}
      columns={formattedColumns}
      rows={formattedRows ?? []}
      isLoading={isLoading}
      sorting={sorting}
      setSorting={setSorting}
      pagination={pagination}
      setPagination={setPagination}
      marketplace={MarketplaceEnum.WALMART}
    />
  );
}
