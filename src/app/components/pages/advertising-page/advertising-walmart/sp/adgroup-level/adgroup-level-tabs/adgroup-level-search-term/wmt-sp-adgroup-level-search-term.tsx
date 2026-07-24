import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import AdvertisingRenderingComponents from '@/app/components/page-components/advertising-rendering-components/advertising-rendering-components';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  IMinMaxDateRange,
  IPerformanceGraphData,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useAppQuery } from '@/redux/react-query-hooks';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';
import {
  ColumnNameEnum,
  WalmartSPAdGroupLevelTitles,
} from 'src/enums/advertising.enums';
import { TargetingTypeEnum } from 'src/enums/walmart.enums';
import {
  IAdvertisingAdGroupLevelSubWrapperProps,
  IEditAccessArrayData,
} from 'src/interfaces/advertising/advertising.interface';
import {
  IWalmartAdGroup,
  IWalmartCampaign,
  IWalmartSPAdvertisingData,
} from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  resetEditAccessFilters,
  selectAdvertisingErrors,
  setAdvertisingErrorDetails,
  setEditState,
  setInitialState,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import {
  selectPaginationModel,
  selectSearchText,
  selectSelectedAdvertisingNavTitle,
  selectSortModel,
  setSelectedAdvertisingNavTab,
  setSelectedAdvertisingNavTitle,
  TPerformanceMetricsKey,
} from 'src/redux/slices/advertising/advertising-filter.slice';
import {
  selectWalmartSPPerformanceMetrics,
  selectWalmartSPPerformanceMetricsOptions,
  setWalmartSPPerformanceMetrics,
} from 'src/redux/slices/advertising/walmart/advertising-walmart-sp.slice';
import { selectAppliedFilters } from 'src/redux/slices/filters/filter.slice';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { walmartSpAdvertisingServices } from 'src/services/advertising/walmart/walmart-sp-advertising.service';
import { genExportFileName, getFileNameDateTime } from 'src/utils';
import {
  getFormattedSortModel,
  getInitialColumnsByNavTitle,
} from 'src/utils/advertising-columns.utils';
import {
  getErrorEditState,
  getSelectedNavTab,
  getWalmartAppliedFilters,
  getWalmartSearchTermType,
  removeFrequencyFromAdvFilters,
} from 'src/utils/advertising.utils';
import columnFilterUtils from 'src/utils/column-filter.utils';

export default function AdvertisingWalmartSPAdGroupLevelSearchTerm<
  T extends IWalmartAdGroup | undefined,
  K extends IWalmartCampaign | undefined
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
  const [initialColumns, setInitialColumns] = useState<
    Array<ColumnDef<IWalmartSPAdvertisingData>>
  >([]);
  const [selectedColumns, setSelectedColumns] = useState<
    Array<ColumnDef<IWalmartSPAdvertisingData>>
  >([]);
  const [filteredState, setFilteredState] = useState<IEditAccessArrayData>([]);
  const [advertisingGraphData, setAdvertisingGraphData] = useState<
    IPerformanceGraphData[]
  >([]);
  const [advertisingMetricsData, setAdvertisingMetricsData] =
    useState<IPerformanceMetrics | null>(null);
  const [minMaxDates, setMinMaxDates] = useState<IMinMaxDateRange[]>([]);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);

  const performanceMetrics = useAppSelector(selectWalmartSPPerformanceMetrics);
  const performanceMetricsOptions = useAppSelector(
    selectWalmartSPPerformanceMetricsOptions
  );
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const selectedAdvertisingNavTitle = useAppSelector(
    selectSelectedAdvertisingNavTitle
  );
  const searchText = useAppSelector(selectSearchText);
  const paginationModel = useAppSelector(selectPaginationModel);
  const sortModel = useAppSelector(selectSortModel);
  const advErrors = useAppSelector(selectAdvertisingErrors);

  const dispatch = useAppDispatch();

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<IWalmartSPAdvertisingData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      WalmartSPAdGroupLevelTitles.SEARCH_TERM,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  useEffect(() => {
    dispatch(resetEditAccessFilters());

    const selectedTab = getSelectedNavTab(
      updatedPerformanceOptions,
      WalmartSPAdGroupLevelTitles.SEARCH_TERM
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(
      setSelectedAdvertisingNavTitle(WalmartSPAdGroupLevelTitles.SEARCH_TERM)
    );
  }, [dispatch, updatedPerformanceOptions]);

  const getSearchTermsDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      const res = walmartSpAdvertisingServices
        .getSearchTerms(
          getWalmartAppliedFilters(appliedFilters, isDownload, isAllDownload),
          {
            ...getFilters(isDownload, isAllDownload),
            targetingType: adGroupSubHeaderData?.targetingType,
          },
          paginationModel.pageIndex + 1,
          paginationModel.pageSize,
          getFormattedSortModel(
            WalmartSPAdGroupLevelTitles.SEARCH_TERM,
            sortModel
          ),
          searchText
        )
        .then((res) => {
          let data = res.data?.data.data;
          data = data.map((row) => {
            const id = `${row.searchTerm}-${row.campaignId}`;
            return {
              id,
              ...row,
            };
          });

          dispatch(
            showSuccessToastMessage({
              title: 'Downloaded Successfully',
              description: 'Search Terms downloaded successfully.',
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
      sortModel,
      searchText,
      adGroupSubHeaderData,
      dispatch,
    ]
  );

  const fetchSearchTerm = useAppQuery({
    queryKey: [
      QueryKeyEnums.WMT_SP_ADGROUP_LVL_SEARCH_TERM_FETCH,
      {
        appliedFilters,
        advertisingFiltersWithNoDownload: removeFrequencyFromAdvFilters(
          advertisingFiltersWithNoDownload
        ),
        paginationModel,
        sortModel,
        searchText,
        adGroupSubHeaderData,
      },
    ],
    queryFn: () =>
      walmartSpAdvertisingServices.getSearchTerms(
        getWalmartAppliedFilters(appliedFilters, false, false),
        {
          ...advertisingFiltersWithNoDownload,
          targetingType: adGroupSubHeaderData?.targetingType,
        },
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        getFormattedSortModel(
          WalmartSPAdGroupLevelTitles.SEARCH_TERM,
          sortModel
        ),
        searchText
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartSPAdGroupLevelTitles.SEARCH_TERM &&
      adGroupSubHeaderData !== undefined,
  });

  const fetchPerformanceGraph = useAppQuery({
    queryKey: [
      QueryKeyEnums.ADVERTISING_GRAPH_FETCH,
      {
        appliedFilters,
        advertisingFiltersWithNoDownload,
        searchText,
        adGroupSubHeaderData,
      },
    ],
    queryFn: () =>
      walmartSpAdvertisingServices.getPerformanceGraph(
        getWalmartAppliedFilters(appliedFilters, false, false),
        advertisingFiltersWithNoDownload,
        searchText,
        getWalmartSearchTermType(adGroupSubHeaderData?.targetingType ?? '')
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartSPAdGroupLevelTitles.SEARCH_TERM &&
      adGroupSubHeaderData !== undefined,
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
        adGroupSubHeaderData,
      },
    ],
    queryFn: () =>
      walmartSpAdvertisingServices.getPerformanceMetrics(
        getWalmartAppliedFilters(appliedFilters, false, false),
        advertisingFiltersWithNoDownload,
        searchText,
        getWalmartSearchTermType(adGroupSubHeaderData?.targetingType ?? '')
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartSPAdGroupLevelTitles.SEARCH_TERM &&
      adGroupSubHeaderData !== undefined,
  });

  useEffect(() => {
    setFilteredState([]);
    dispatch(setInitialState([]));
    dispatch(setEditState([]));

    if (fetchSearchTerm.data) {
      let data = fetchSearchTerm.data.data.data.data;
      data = data.map((row) => {
        const id = `${row.searchTerm}-${row.campaignId}`;
        return {
          id,
          ...row,
        };
      });

      const _initialColumns = getInitialColumnsByNavTitle(
        WalmartSPAdGroupLevelTitles.SEARCH_TERM
      );

      const tempInitialColumns = [..._initialColumns];
      if (
        adGroupSubHeaderData &&
        adGroupSubHeaderData.targetingType === TargetingTypeEnum.MANUAL
      ) {
        const idx = tempInitialColumns.findIndex(
          (column) => column.id === ColumnNameEnum.PRODUCT_AD
        );
        tempInitialColumns.splice(idx, 1);
      }
      if (
        adGroupSubHeaderData &&
        adGroupSubHeaderData.targetingType === TargetingTypeEnum.AUTO
      ) {
        [ColumnNameEnum.KEYWORD, ColumnNameEnum.MATCH_TYPE].forEach((id) => {
          const idx = tempInitialColumns.findIndex(
            (column) => column.id === id
          );
          if (idx !== -1) {
            tempInitialColumns.splice(idx, 1);
          }
        });
      }

      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        WalmartSPAdGroupLevelTitles.SEARCH_TERM,
        tempInitialColumns as Array<ColumnDef<IWalmartSPAdvertisingData>>
      );

      setInitialColumns(
        tempInitialColumns as Array<ColumnDef<IWalmartSPAdvertisingData>>
      );
      setSelectedColumns(
        filteredColumns as Array<ColumnDef<IWalmartSPAdvertisingData>>
      );

      dispatch(setInitialState(data as IWalmartSPAdvertisingData[]));
      const updatedData = getErrorEditState(
        data,
        advErrors
      ) as IWalmartSPAdvertisingData[];
      setFilteredState(updatedData);
      dispatch(setEditState(updatedData));
      dispatch(setAdvertisingErrorDetails(null));

      const totalRows = fetchSearchTerm.data.data.data.pagination.totalItems;
      setTotalRowCount(parseInt(totalRows as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchSearchTerm.data, dispatch, adGroupSubHeaderData]);

  useEffect(() => {
    setAdvertisingGraphData([]);
    setMinMaxDates([]);

    if (fetchPerformanceGraph.data) {
      setAdvertisingGraphData(
        fetchPerformanceGraph.data.data.data?.graphData ?? []
      );
      setMinMaxDates(fetchPerformanceGraph.data.data.data?.maxMinDate);
    }
  }, [fetchPerformanceGraph.data]);

  useEffect(() => {
    setAdvertisingMetricsData(null);

    if (fetchPerformanceMetrics.data) {
      setAdvertisingMetricsData(fetchPerformanceMetrics.data.data.data);
    }
  }, [fetchPerformanceMetrics.data]);

  const handlePerformanceMetricsChange = (metricsValue: {
    value: IDropdownItem<string>;
    key: TPerformanceMetricsKey;
  }) => {
    dispatch(setWalmartSPPerformanceMetrics(metricsValue));
  };

  const handleDownload = useCallback(
    async (isAllDownload: boolean) => {
      dispatch(
        showSuccessToastMessage({
          title: 'Download Started',
          description: 'This may take a few seconds.',
        })
      );

      const data: Record<string, unknown>[] = (await getSearchTermsDownload(
        true,
        isAllDownload
      )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getSearchTermsDownload]
  );

  return (
    <AdvertisingRenderingComponents
      campaignId={campaignId}
      adGroupId={adGroupId}
      selectedLevelType="adgroup-level"
      selectedAdGroup={adGroupSubHeaderData}
      selectedCampaign={selectedCampaign}
      isSubHeaderLoading={isSubHeaderLoading}
      advertisingMetricsData={advertisingMetricsData}
      performanceFilters={advertisingFiltersWithNoDownload}
      isMetricsLoading={
        fetchPerformanceMetrics.isLoading ||
        fetchPerformanceMetrics.isRefetching
      }
      performanceSelectedMetrics={performanceMetrics}
      performanceMetricsOptions={performanceMetricsOptions}
      handlePerformanceMetricsChange={handlePerformanceMetricsChange}
      performanceGraphData={advertisingGraphData}
      minMaxDates={minMaxDates ? minMaxDates[0] : null}
      isGraphLoading={
        fetchPerformanceGraph.isLoading || fetchPerformanceGraph.isRefetching
      }
      chartTitle={`walmart_advertising_SP_campaign_${
        adGroupSubHeaderData?.campaignName ?? ''
      }_adgroup_${
        adGroupSubHeaderData?.adGroupName ?? ''
      }_${getFileNameDateTime(advertisingFiltersWithNoDownload)}`}
      performanceNavigationTabOptions={updatedPerformanceOptions}
      isTableLoading={fetchSearchTerm.isLoading || fetchSearchTerm.isRefetching}
      initialColumns={initialColumns}
      selectedColumns={selectedColumns}
      handleSelectedColumns={setSelectedColumnsHandler}
      exportFileTitle={genExportFileName('walmart-sp', 'Search Terms')}
      filteredTableData={filteredState}
      totalRowCount={totalRowCount}
      setTotalRowCount={setTotalRowCount}
      setFilteredTableData={setFilteredState}
      handleDownload={handleDownload}
      handleEditSaveClick={() => {
        return;
      }}
    />
  );
}
