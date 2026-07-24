import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import AdvertisingRenderingComponents from '@/app/components/page-components/advertising-rendering-components/advertising-rendering-components';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  IMinMaxDateRange,
  IPerformanceGraphData,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IWalmartPlatform } from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { IEditAccessWalmartPlatform } from '@/interfaces/edit-access/edit-access.interface';
import {
  IAPIResponse,
  IErrorResultDetails,
} from '@/interfaces/service.interface';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import { walmartEditAccessOverallServices } from '@/services/edit-access/walmart-edit-access/walmart-edit-access-overall/walmart-edit-access-overall.service';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';
import { walmartOverallAccountPerformanceOptions } from 'src/constants/advertising-filter.constants';
import {
  WalmartAdvertisingTableTypeEnum,
  WalmartOverallAccountLevelTitles,
} from 'src/enums/advertising.enums';
import { IEditAccessArrayData } from 'src/interfaces/advertising/advertising.interface';
import { IWalmartOverallAdvertisingData } from 'src/interfaces/advertising/walmart/walmart-overall-advertising.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  resetEditAccessFilters,
  selectAdvertisingErrors,
  selectEditState,
  selectInitialState,
  selectSelectedRowIds,
  setAdvertisingErrorDetails,
  setEditState,
  setInitialState,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import {
  selectAdvertisingAppliedFilter,
  selectPaginationModel,
  selectSearchText,
  selectSelectedAdvertisingNavTitle,
  selectSortModel,
  setSelectedAdvertisingNavTab,
  setSelectedAdvertisingNavTitle,
  TPerformanceMetricsKey,
} from 'src/redux/slices/advertising/advertising-filter.slice';
import {
  selectWalmartOverallPerformanceMetrics,
  selectWalmartOverallPerformanceMetricsOptions,
  setWalmartOverallPerformanceMetrics,
} from 'src/redux/slices/advertising/walmart/advertising-walmart-overall.slice';
import { selectAppliedFilters } from 'src/redux/slices/filters/filter.slice';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { walmartOverallAdvertisingServices } from 'src/services/advertising/walmart/walmart-overall-advertising.service';
import { genExportFileName, getFileNameDateTime, parseNum } from 'src/utils';
import {
  getFormattedSortModel,
  getInitialColumnsByNavTitle,
} from 'src/utils/advertising-columns.utils';
import {
  getComparisonDetails,
  getEditedTableValuesMap,
  getErrorEditState,
  getSelectedNavTab,
  getWalmartAdvertisingFilters,
  getWalmartAppliedFilters,
  removeFrequencyFromAdvFilters,
} from 'src/utils/advertising.utils';
import columnFilterUtils from 'src/utils/column-filter.utils';

export default function WalmartOverallAccountLevelPlatform() {
  const [initialColumns, setInitialColumns] = useState<
    Array<ColumnDef<IWalmartOverallAdvertisingData>>
  >([]);
  const [selectedColumns, setSelectedColumns] = useState<
    Array<ColumnDef<IWalmartOverallAdvertisingData>>
  >([]);
  const [filteredState, setFilteredState] = useState<IEditAccessArrayData>([]);
  const [advertisingGraphData, setAdvertisingGraphData] = useState<
    IPerformanceGraphData[]
  >([]);
  const [advertisingMetricsData, setAdvertisingMetricsData] =
    useState<IPerformanceMetrics | null>(null);
  const [minMaxDates, setMinMaxDates] = useState<IMinMaxDateRange[]>([]);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);
  const [isEditLoading, setIsEditLoading] = useState<boolean>(false);
  const [openSaveModal, setOpenSaveModal] = useState<boolean>(false);

  const appliedAdvertisingFilters = useAppSelector(
    selectAdvertisingAppliedFilter
  );
  const walmartOverallPerformanceMetrics = useAppSelector(
    selectWalmartOverallPerformanceMetrics
  );
  const walmartOverallPerformanceMetricsOptions = useAppSelector(
    selectWalmartOverallPerformanceMetricsOptions
  );
  const searchText = useAppSelector(selectSearchText);
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const selectedAdvertisingNavTitle = useAppSelector(
    selectSelectedAdvertisingNavTitle
  );
  const paginationModel = useAppSelector(selectPaginationModel);
  const sortModel = useAppSelector(selectSortModel);
  const initialState = useAppSelector(selectInitialState);
  const editState = useAppSelector(selectEditState);
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const advErrors = useAppSelector(selectAdvertisingErrors);

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<IWalmartOverallAdvertisingData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      WalmartOverallAccountLevelTitles.PLATFORM,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  useEffect(() => {
    dispatch(resetEditAccessFilters());

    const selectedTab = getSelectedNavTab(
      walmartOverallAccountPerformanceOptions,
      WalmartOverallAccountLevelTitles.PLATFORM
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(
      setSelectedAdvertisingNavTitle(WalmartOverallAccountLevelTitles.PLATFORM)
    );
  }, [dispatch]);

  const { mutateAsync: editAccessMutate } = useAppMutation({
    mutationFn: (body: IEditAccessWalmartPlatform[]) =>
      walmartEditAccessOverallServices.updateWalmartOverallPlatform(body),
    options: {
      onSettled: () => {
        setIsEditLoading(false);
        setOpenSaveModal(false);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_OVERALL_ACCOUNT_LVL_PLATFORM_FETCH],
        });

        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.ADVERTISING_METRICS_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: data.data.message,
            description: data.data.description,
          })
        );
        dispatch(resetEditAccessFilters());
      },
      onError(error, variables) {
        if (error && error.response) {
          const resErrorData = error.response.data as
            | IAPIResponse<IErrorResultDetails>
            | undefined;

          if (
            resErrorData &&
            resErrorData?.data?.errorCount > 0 &&
            error.response.status === 207
          ) {
            queryClient.invalidateQueries({
              queryKey: [QueryKeyEnums.WMT_OVERALL_ACCOUNT_LVL_PLATFORM_FETCH],
            });

            queryClient.invalidateQueries({
              queryKey: [QueryKeyEnums.ADVERTISING_METRICS_FETCH],
            });

            dispatch(
              setAdvertisingErrorDetails({
                errorList: resErrorData.data.errors,
                editedRows: variables,
              })
            );
          }
        }
      },
    },
  });

  const confirmEditSaveClick = async () => {
    setIsEditLoading(true);
    const updatedValues = new Map();
    const comparedValues = getComparisonDetails(initialState, editState);
    const updatedRowIds = selectedRowIds.filter((rowId) =>
      comparedValues.has(rowId)
    );

    updatedRowIds.forEach((rowId) => {
      updatedValues.set(rowId, comparedValues.get(rowId));
    });

    const body: IEditAccessWalmartPlatform[] = [];
    const editStateMap = getEditedTableValuesMap(
      updatedValues,
      editState
    ) as Map<string, IWalmartPlatform>;

    for (const [key, value] of updatedValues) {
      const currentRowData = editStateMap.get(`${key}`);

      if (currentRowData) {
        const id = key.match(/\d+/)[0];
        const platformType = key
          .substring(0, key.indexOf(id))
          .replace(/-+$/, '');
        const data: IEditAccessWalmartPlatform = {
          id: `${currentRowData.id}`,
          campaignId: `${id}`,
          platformType: platformType,
          entityName: `${currentRowData.campaignName} (${platformType})`,
        };

        if (value.multiplier !== null || value.multiplier !== undefined) {
          data.multiplier = parseNum(value.multiplier);
        }

        body.push(data);
      }
    }

    await editAccessMutate(body);
  };

  const getOverallPlatformDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      const res = walmartOverallAdvertisingServices
        .getOverallPlatform(
          getWalmartAppliedFilters(appliedFilters, isDownload, isAllDownload),
          getWalmartAdvertisingFilters(
            appliedAdvertisingFilters,
            appliedAdvertisingFilters.customDateRange,
            isDownload,
            '',
            '',
            isAllDownload
          ),
          paginationModel.pageIndex + 1,
          paginationModel.pageSize,
          getFormattedSortModel(
            WalmartOverallAccountLevelTitles.PLATFORM,
            sortModel
          ),
          searchText
        )
        .then((res) => {
          let data = res.data?.data.data;
          data = data.map((row) => {
            const id = `${row.platform}-${row.campaignId}`;
            return {
              id,
              ...row,
            };
          });

          dispatch(
            showSuccessToastMessage({
              title: 'Downloaded Successfully',
              description: 'Platforms downloaded successfully.',
            })
          );
          return data;
        });

      return res;
    },
    [
      appliedFilters,
      appliedAdvertisingFilters,
      paginationModel,
      sortModel,
      searchText,
      dispatch,
    ]
  );

  const fetchPlatform = useAppQuery({
    queryKey: [
      QueryKeyEnums.WMT_OVERALL_ACCOUNT_LVL_PLATFORM_FETCH,
      {
        appliedFilters,
        appliedAdvertisingFilters: removeFrequencyFromAdvFilters(
          appliedAdvertisingFilters
        ),
        paginationModel,
        sortModel,
        searchText,
      },
    ],
    queryFn: () =>
      walmartOverallAdvertisingServices.getOverallPlatform(
        getWalmartAppliedFilters(appliedFilters, false, false),
        getWalmartAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange,
          false,
          '',
          '',
          false
        ),
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        getFormattedSortModel(
          WalmartOverallAccountLevelTitles.PLATFORM,
          sortModel
        ),
        searchText
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartOverallAccountLevelTitles.PLATFORM,
  });

  const fetchPerformanceGraph = useAppQuery({
    queryKey: [
      QueryKeyEnums.ADVERTISING_GRAPH_FETCH,
      {
        appliedFilters,
        appliedAdvertisingFilters,
        searchText,
      },
    ],
    queryFn: () =>
      walmartOverallAdvertisingServices.getOverallPerformanceGraph(
        getWalmartAppliedFilters(appliedFilters, false, false),
        getWalmartAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange
        ),
        searchText,
        WalmartAdvertisingTableTypeEnum.PLATFORM
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartOverallAccountLevelTitles.PLATFORM,
  });

  const fetchPerformanceMetrics = useAppQuery({
    queryKey: [
      QueryKeyEnums.ADVERTISING_METRICS_FETCH,
      {
        appliedFilters,
        appliedAdvertisingFilters: removeFrequencyFromAdvFilters(
          appliedAdvertisingFilters
        ),
        searchText,
      },
    ],
    queryFn: () =>
      walmartOverallAdvertisingServices.getOverallPerformanceMetrics(
        getWalmartAppliedFilters(appliedFilters, false, false),
        getWalmartAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange
        ),
        searchText,
        WalmartAdvertisingTableTypeEnum.PLATFORM
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartOverallAccountLevelTitles.PLATFORM,
  });

  useEffect(() => {
    setFilteredState([]);
    dispatch(setInitialState([]));
    dispatch(setEditState([]));

    if (fetchPlatform.data) {
      let data = fetchPlatform.data.data.data.data;
      data = data.map((row) => {
        const id = `${row.platform}-${row.campaignId}`;
        return {
          id,
          ...row,
        };
      });

      const _initialColumns = getInitialColumnsByNavTitle(
        WalmartOverallAccountLevelTitles.PLATFORM
      );
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        WalmartOverallAccountLevelTitles.PLATFORM
      );
      setInitialColumns(
        _initialColumns as Array<ColumnDef<IWalmartOverallAdvertisingData>>
      );
      setSelectedColumns(
        filteredColumns as Array<ColumnDef<IWalmartOverallAdvertisingData>>
      );

      dispatch(setInitialState(data as IWalmartOverallAdvertisingData[]));

      const updatedData = getErrorEditState(
        data,
        advErrors
      ) as IWalmartOverallAdvertisingData[];
      setFilteredState(updatedData);
      dispatch(setEditState(updatedData));
      dispatch(setAdvertisingErrorDetails(null));

      const totalRows = fetchPlatform.data.data.data.pagination.totalItems;
      setTotalRowCount(parseInt(totalRows as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPlatform.data, dispatch]);

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
    dispatch(setWalmartOverallPerformanceMetrics(metricsValue));
  };

  const handleDownload = useCallback(
    async (isAllDownload: boolean) => {
      dispatch(
        showSuccessToastMessage({
          title: 'Download Started',
          description: 'This may take a few seconds.',
        })
      );

      const data: Record<string, unknown>[] = (await getOverallPlatformDownload(
        true,
        isAllDownload
      )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getOverallPlatformDownload]
  );

  return (
    <AdvertisingRenderingComponents
      advertisingMetricsData={advertisingMetricsData}
      performanceFilters={getWalmartAdvertisingFilters(
        appliedAdvertisingFilters,
        appliedAdvertisingFilters.customDateRange
      )}
      isMetricsLoading={
        fetchPerformanceMetrics.isLoading ||
        fetchPerformanceMetrics.isRefetching
      }
      performanceSelectedMetrics={walmartOverallPerformanceMetrics}
      performanceMetricsOptions={walmartOverallPerformanceMetricsOptions}
      handlePerformanceMetricsChange={handlePerformanceMetricsChange}
      performanceGraphData={advertisingGraphData}
      minMaxDates={minMaxDates ? minMaxDates[0] : null}
      isGraphLoading={
        fetchPerformanceGraph.isLoading || fetchPerformanceGraph.isRefetching
      }
      chartTitle={`walmart_advertising_overall_${getFileNameDateTime(
        getWalmartAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange
        )
      )}`}
      performanceNavigationTabOptions={walmartOverallAccountPerformanceOptions}
      isTableLoading={fetchPlatform.isLoading || fetchPlatform.isRefetching}
      initialColumns={initialColumns}
      selectedColumns={selectedColumns}
      handleSelectedColumns={setSelectedColumnsHandler}
      exportFileTitle={genExportFileName('walmart-overall', 'Platform')}
      filteredTableData={filteredState}
      totalRowCount={totalRowCount}
      setTotalRowCount={setTotalRowCount}
      setFilteredTableData={setFilteredState}
      handleDownload={handleDownload}
      handleEditSaveClick={confirmEditSaveClick}
      isEditLoading={isEditLoading}
      openSaveModal={openSaveModal}
      setOpenSaveModal={setOpenSaveModal}
    />
  );
}
