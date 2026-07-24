import {
  IMinMaxDateRange,
  IPerformanceGraphData,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from 'src/redux/hooks';
import {
  selectSDPerformanceMetrics,
  selectSDPerformanceMetricsOptions,
  setSDPerformanceMetrics,
} from 'src/redux/slices/advertising/advertising-sd-filter.slice';

import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import AdvertisingRenderingComponents from '@/app/components/page-components/advertising-rendering-components/advertising-rendering-components';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  ISDAdGroup,
  ISDAdvertisingData,
  ISDCampaign,
} from '@/interfaces/advertising/amazon/sd-advertising.interface';
import { useAppQuery } from '@/redux/react-query-hooks';
import {
  resetEditAccessFilters,
  selectAdvertisingErrors,
  setAdvertisingErrorDetails,
  setEditState,
  setInitialState,
} from '@/redux/slices/advertising/advertising-edit-access.slice';
import { ColumnDef } from '@tanstack/react-table';
import {
  AmazonAdvertisingTableTypesEnum,
  SdAdGroupLevelTitles,
} from 'src/enums/advertising.enums';
import {
  IAdvertisingAdGroupLevelSubWrapperProps,
  IEditAccessArrayData,
} from 'src/interfaces/advertising/advertising.interface';
import {
  selectPaginationModel,
  selectSearchText,
  selectSelectedAdvertisingNavTitle,
  selectSortModel,
  setSelectedAdvertisingNavTab,
  setSelectedAdvertisingNavTitle,
  TPerformanceMetricsKey,
} from 'src/redux/slices/advertising/advertising-filter.slice';
import { selectAppliedFilters } from 'src/redux/slices/filters/filter.slice';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import {
  sdAdvertisingServices,
  sdAdvertisingServicesAdGroupLevel,
} from 'src/services/advertising/amazon/sd-advertising.service';
import { genExportFileName, getFileNameDateTime } from 'src/utils';
import {
  getFormattedSortModel,
  getInitialColumnsByNavTitle,
} from 'src/utils/advertising-columns.utils';
import {
  getErrorEditState,
  getSelectedNavTab,
  removeFrequencyFromAdvFilters,
} from 'src/utils/advertising.utils';
import columnFilterUtils from 'src/utils/column-filter.utils';

export default function AdvertisingSDAdGroupLevelCreative<
  T extends ISDAdGroup | null,
  K extends ISDCampaign | null
>({
  campaignId,
  adGroupId,
  adGroupSubHeaderData,
  isSubHeaderLoading,
  updatedPerformanceOptions,
  getFilters,
  advertisingFiltersWithNoDownload,
  selectedCampaign,
}: IAdvertisingAdGroupLevelSubWrapperProps<T, K>) {
  const [advertisingSDMetricsData, setAdvertisingSDMetricsData] =
    useState<IPerformanceMetrics | null>(null);
  const [advertisingSDGraphData, setAdvertisingSDGraphData] = useState<
    IPerformanceGraphData[]
  >([]);
  const [minMaxDates, setMinMaxDates] = useState<IMinMaxDateRange[]>([]);
  const [initialColumns, setInitialColumns] = useState<
    Array<ColumnDef<ISDAdvertisingData>>
  >([]);
  const [selectedColumns, setSelectedColumns] = useState<
    Array<ColumnDef<ISDAdvertisingData>>
  >([]);
  const [filteredState, setFilteredState] = useState<IEditAccessArrayData>([]);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);

  const SDPerformanceMetrics = useAppSelector(selectSDPerformanceMetrics);
  const SDPerformanceMetricsOptions = useAppSelector(
    selectSDPerformanceMetricsOptions
  );
  const selectedAdvertisingNavTitle = useAppSelector(
    selectSelectedAdvertisingNavTitle
  );
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const searchText = useAppSelector(selectSearchText);
  const paginationModel = useAppSelector(selectPaginationModel);
  const sortModel = useAppSelector(selectSortModel);
  const advErrors = useAppSelector(selectAdvertisingErrors);

  const dispatch = useDispatch();

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<ISDAdvertisingData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      SdAdGroupLevelTitles.CREATIVE,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  useEffect(() => {
    dispatch(resetEditAccessFilters());

    const selectedTab = getSelectedNavTab(
      updatedPerformanceOptions,
      SdAdGroupLevelTitles.CREATIVE
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(setSelectedAdvertisingNavTitle(SdAdGroupLevelTitles.CREATIVE));
  }, [dispatch, updatedPerformanceOptions]);

  const getSDCreativeDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      const res = sdAdvertisingServicesAdGroupLevel
        .getSDCreativeData(
          appliedFilters,
          getFilters(isDownload, !isAllDownload),
          paginationModel.pageIndex + 1,
          paginationModel.pageSize,
          getFormattedSortModel(SdAdGroupLevelTitles.CREATIVE, sortModel),
          searchText
        )
        .then((res) => {
          let data = res.data?.data.data;
          data = data.map((row) => {
            const id = `${row.creativeId}`;
            return {
              id,
              ...row,
            };
          });

          dispatch(
            showSuccessToastMessage({
              title: 'Downloaded Successfully',
              description: 'Creatives downloaded successfully.',
            })
          );
          return data;
        });

      return res;
    },
    [
      appliedFilters,
      getFilters,
      paginationModel,
      searchText,
      sortModel,
      dispatch,
    ]
  );

  const fetchCreative = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_SD_ADGROUP_LVL_CREATIVE_FETCH,
      {
        appliedFilters,
        advertisingFiltersWithNoDownload: removeFrequencyFromAdvFilters(
          advertisingFiltersWithNoDownload
        ),
        paginationModel,
        searchText,
        sortModel,
      },
    ],
    queryFn: () =>
      sdAdvertisingServicesAdGroupLevel.getSDCreativeData(
        appliedFilters,
        advertisingFiltersWithNoDownload,
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        getFormattedSortModel(SdAdGroupLevelTitles.CREATIVE, sortModel),
        searchText
      ),
    enabled: selectedAdvertisingNavTitle === SdAdGroupLevelTitles.CREATIVE,
  });

  const fetchPerformanceGraph = useAppQuery({
    queryKey: [
      QueryKeyEnums.ADVERTISING_GRAPH_FETCH,
      {
        appliedFilters,
        advertisingFiltersWithNoDownload,
        searchText,
      },
    ],
    queryFn: () =>
      sdAdvertisingServices.getSDPerformanceGraph(
        appliedFilters,
        advertisingFiltersWithNoDownload,
        searchText,
        AmazonAdvertisingTableTypesEnum.CREATIVE
      ),
    enabled: selectedAdvertisingNavTitle === SdAdGroupLevelTitles.CREATIVE,
  });

  const fetchPerformanceMetrics = useAppQuery({
    queryKey: [
      QueryKeyEnums.ADVERTISING_METRICS_FETCH,
      {
        appliedFilters,
        advertisingFiltersWithNoDownload: removeFrequencyFromAdvFilters(
          advertisingFiltersWithNoDownload
        ),
        searchText,
      },
    ],
    queryFn: () =>
      sdAdvertisingServices.getSDPerformanceMetrics(
        appliedFilters,
        advertisingFiltersWithNoDownload,
        searchText,
        AmazonAdvertisingTableTypesEnum.CREATIVE
      ),
    enabled: selectedAdvertisingNavTitle === SdAdGroupLevelTitles.CREATIVE,
  });

  useEffect(() => {
    setFilteredState([]);
    dispatch(setInitialState([]));
    dispatch(setEditState([]));

    if (fetchCreative.data) {
      let data = fetchCreative.data.data.data.data;
      data = data.map((row) => {
        const id = `${row.creativeId}`;
        return {
          id,
          ...row,
        };
      });

      const _initialColumns = getInitialColumnsByNavTitle(
        SdAdGroupLevelTitles.CREATIVE
      );
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        SdAdGroupLevelTitles.CREATIVE
      );
      setInitialColumns(
        _initialColumns as Array<ColumnDef<ISDAdvertisingData>>
      );
      setSelectedColumns(
        filteredColumns as Array<ColumnDef<ISDAdvertisingData>>
      );

      dispatch(setInitialState(data as ISDAdvertisingData[]));
      const updatedData = getErrorEditState(
        data,
        advErrors
      ) as ISDAdvertisingData[];
      setFilteredState(updatedData);
      dispatch(setEditState(updatedData));
      dispatch(setAdvertisingErrorDetails(null));

      const totalRows = fetchCreative.data.data.data.pagination.totalItems;
      setTotalRowCount(parseInt(totalRows as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCreative.data, dispatch]);

  useEffect(() => {
    setAdvertisingSDGraphData([]);
    setMinMaxDates([]);

    if (fetchPerformanceGraph.data) {
      setAdvertisingSDGraphData(
        fetchPerformanceGraph.data.data.data?.graphData ?? []
      );
      setMinMaxDates(fetchPerformanceGraph.data.data.data?.maxMinDate);
    }
  }, [fetchPerformanceGraph.data]);

  useEffect(() => {
    setAdvertisingSDMetricsData(null);

    if (fetchPerformanceMetrics.data) {
      setAdvertisingSDMetricsData(fetchPerformanceMetrics.data.data.data);
    }
  }, [fetchPerformanceMetrics.data]);

  const handlePerformanceMetricsChange = (metricsValue: {
    value: IDropdownItem<string>;
    key: TPerformanceMetricsKey;
  }) => {
    dispatch(setSDPerformanceMetrics(metricsValue));
  };

  const handleDownload = useCallback(
    async (isAllDownload: boolean) => {
      dispatch(
        showSuccessToastMessage({
          title: 'Download Started',
          description: 'This may take a few seconds.',
        })
      );

      const data: Record<string, unknown>[] = (await getSDCreativeDownload(
        true,
        isAllDownload
      )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getSDCreativeDownload]
  );

  return (
    <AdvertisingRenderingComponents
      campaignId={campaignId}
      adGroupId={adGroupId}
      selectedLevelType="adgroup-level"
      selectedAdGroup={adGroupSubHeaderData}
      selectedCampaign={selectedCampaign}
      isSubHeaderLoading={isSubHeaderLoading}
      advertisingMetricsData={advertisingSDMetricsData}
      performanceFilters={advertisingFiltersWithNoDownload}
      isMetricsLoading={
        fetchPerformanceMetrics.isLoading ||
        fetchPerformanceMetrics.isRefetching
      }
      performanceSelectedMetrics={SDPerformanceMetrics}
      performanceMetricsOptions={SDPerformanceMetricsOptions}
      handlePerformanceMetricsChange={handlePerformanceMetricsChange}
      performanceGraphData={advertisingSDGraphData}
      minMaxDates={minMaxDates ? minMaxDates[0] : null}
      isGraphLoading={
        fetchPerformanceGraph.isLoading || fetchPerformanceGraph.isRefetching
      }
      chartTitle={`advertising_SD_campaign_${
        adGroupSubHeaderData?.campaignName ?? ''
      }_adgroup_${
        adGroupSubHeaderData?.adGroupName ?? ''
      }_${getFileNameDateTime(advertisingFiltersWithNoDownload)}`}
      performanceNavigationTabOptions={updatedPerformanceOptions}
      isTableLoading={fetchCreative.isLoading || fetchCreative.isRefetching}
      initialColumns={initialColumns}
      selectedColumns={selectedColumns}
      handleSelectedColumns={setSelectedColumnsHandler}
      exportFileTitle={genExportFileName('amazon-sd', 'Creative(Display Ad)')}
      filteredTableData={filteredState}
      totalRowCount={totalRowCount}
      setTotalRowCount={setTotalRowCount}
      setFilteredTableData={setFilteredState}
      handleDownload={handleDownload}
      handleEditSaveClick={() => {
        return;
      }}
      areTableHeaderActionButtonsRequired={false}
    />
  );
}
