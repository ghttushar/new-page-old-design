import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import AdvertisingRenderingComponents from '@/app/components/page-components/advertising-rendering-components/advertising-rendering-components';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  ICampaign,
  IMinMaxDateRange,
  IPerformanceGraphData,
  IPerformanceMetrics,
  ISPAdvertisingData,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  IEditAccessCampaign,
  IEditAccessCampaignUpdateBody,
} from '@/interfaces/edit-access/edit-access.interface';
import {
  IAPIResponse,
  IErrorResultDetails,
} from '@/interfaces/service.interface';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import { AnalysisSPService } from '@/services/advertising/impact-analysis/amazon/sp/impact-analysis-sp.service';
import { EditAccessSPServices } from '@/services/edit-access/amazon-edit-access/amazon-edit-access-sp/amazon-edit-access-sp.service';
import { genExportFileName, getFileNameDateTime } from '@/utils';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';
import { spAccountPerformanceOptions } from 'src/constants/advertising-filter.constants';
import {
  AmazonAdvertisingTableTypesEnum,
  SpAccountLevelTitles,
} from 'src/enums/advertising.enums';
import { IEditAccessArrayData } from 'src/interfaces/advertising/advertising.interface';
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
  selectPerformanceMetrics,
  selectPerformanceMetricsOptions,
  selectSearchText,
  selectSelectedAdvertisingNavTitle,
  selectSortModel,
  setSelectedAdvertisingNavTab,
  setSelectedAdvertisingNavTitle,
  setSPPerformanceMetrics,
  TPerformanceMetricsKey,
} from 'src/redux/slices/advertising/advertising-filter.slice';
import { selectAppliedFilters } from 'src/redux/slices/filters/filter.slice';
import {
  selectIsShowImpactOn,
  setImpactAnalysisData,
} from 'src/redux/slices/impact-analysis/impact-analysis.slice';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { spAdvertisingServices } from 'src/services/advertising/amazon/sp-advertising.service';
import {
  getFormattedSortModel,
  getInitialColumnsByNavTitle,
} from 'src/utils/advertising-columns.utils';
import {
  getAmazonAdvertisingFilters,
  getComparisonDetails,
  getEditedTableValuesMap,
  getErrorEditState,
  getSelectedNavTab,
  removeFrequencyFromAdvFilters,
} from 'src/utils/advertising.utils';
import columnFilterUtils from 'src/utils/column-filter.utils';

export default function AdvertisingAccountLevelCampaign() {
  const [initialColumns, setInitialColumns] = useState<
    Array<ColumnDef<ISPAdvertisingData>>
  >([]);
  const [selectedColumns, setSelectedColumns] = useState<
    Array<ColumnDef<ISPAdvertisingData>>
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

  const selectedAdvertisingNavTitle = useAppSelector(
    selectSelectedAdvertisingNavTitle
  );
  const appliedAdvertisingFilters = useAppSelector(
    selectAdvertisingAppliedFilter
  );
  const isShowImpactOn = useAppSelector(selectIsShowImpactOn);
  const performanceMetrics = useAppSelector(selectPerformanceMetrics);
  const performanceMetricsOptions = useAppSelector(
    selectPerformanceMetricsOptions
  );
  const initialState = useAppSelector(selectInitialState);
  const editState = useAppSelector(selectEditState);
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const searchText = useAppSelector(selectSearchText);
  const paginationModel = useAppSelector(selectPaginationModel);
  const sortModel = useAppSelector(selectSortModel);
  const advErrors = useAppSelector(selectAdvertisingErrors);

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<ISPAdvertisingData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      SpAccountLevelTitles.CAMPAIGNS,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  const { mutateAsync: editAccessMutate } = useAppMutation({
    mutationFn: (body: IEditAccessCampaignUpdateBody) =>
      EditAccessSPServices.updateSPCampaign(body),
    options: {
      onSettled: () => {
        setIsEditLoading(false);
        setOpenSaveModal(false);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_SP_ACCOUNT_LVL_CAMPAIGNS_FETCH],
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
              queryKey: [QueryKeyEnums.AMZ_SP_ACCOUNT_LVL_CAMPAIGNS_FETCH],
            });

            queryClient.invalidateQueries({
              queryKey: [QueryKeyEnums.ADVERTISING_METRICS_FETCH],
            });

            dispatch(
              setAdvertisingErrorDetails({
                errorList: resErrorData.data.errors,
                editedRows: variables.campaigns,
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

    const updatedCampaigns: IEditAccessCampaign[] = [];
    const editStateMap = getEditedTableValuesMap(
      updatedValues,
      editState
    ) as Map<string, ICampaign>;

    for (const [key, value] of updatedValues) {
      const currentRowData = editStateMap.get(`${key}`);

      if (currentRowData) {
        const data: IEditAccessCampaign = {
          id: `${key}`,
          campaignId: `${key}`,
          entityName: currentRowData.campaignName || `${key}`,
        };

        if (value.campaignName) {
          data.name = value.campaignName;
        }

        if (value.endDate !== undefined) {
          data.endDate = value.endDate === '' ? null : value.endDate;
        }

        if (value.status) {
          data.state = value.status;
        }

        if (value.budget) {
          data.budget = {
            budget: value.budget.budget,
          };
        }

        if (value.dynamicBidding) {
          data.dynamicBidding = {
            strategy: value.dynamicBidding.strategy,
          };
        }

        if (value.automationStatus) {
          data.automationStatus = value.automationStatus;
        }

        if (value.tagId !== undefined) {
          data.tagId = value.tagId;
        }

        updatedCampaigns.push(data);
      }
    }

    const body: IEditAccessCampaignUpdateBody = {
      campaigns: updatedCampaigns,
    };

    await editAccessMutate(body);
  };

  useEffect(() => {
    dispatch(resetEditAccessFilters());

    const selectedTab = getSelectedNavTab(
      spAccountPerformanceOptions,
      SpAccountLevelTitles.CAMPAIGNS
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(setSelectedAdvertisingNavTitle(SpAccountLevelTitles.CAMPAIGNS));
  }, [dispatch]);

  const getCampaignsDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      const res = spAdvertisingServices
        .getCampaigns(
          appliedFilters,
          getAmazonAdvertisingFilters(
            appliedAdvertisingFilters,
            appliedAdvertisingFilters.customDateRange,
            isDownload,
            !isAllDownload
          ),
          paginationModel.pageIndex + 1,
          paginationModel.pageSize,
          getFormattedSortModel(SpAccountLevelTitles.CAMPAIGNS, sortModel),
          searchText
        )
        .then((res) => {
          let data = res.data?.data.data;
          data = data.map((row) => {
            const id = `${row.campaignId}`;
            return {
              id,
              ...row,
            };
          });

          dispatch(
            showSuccessToastMessage({
              title: 'Downloaded Successfully',
              description: 'Campaigns downloaded successfully.',
            })
          );
          return data;
        });

      return res;
    },
    [
      appliedAdvertisingFilters,
      paginationModel.pageIndex,
      paginationModel.pageSize,
      sortModel,
      appliedFilters,
      searchText,
      dispatch,
    ]
  );

  const fetchCampaigns = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_SP_ACCOUNT_LVL_CAMPAIGNS_FETCH,
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
    queryFn: ({ signal }) =>
      spAdvertisingServices.getCampaigns(
        appliedFilters,
        getAmazonAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange,
          false,
          false
        ),
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        getFormattedSortModel(SpAccountLevelTitles.CAMPAIGNS, sortModel),
        searchText,
        signal
      ),
    enabled: selectedAdvertisingNavTitle === SpAccountLevelTitles.CAMPAIGNS,
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
      spAdvertisingServices.getPerformanceGraph(
        appliedFilters,
        getAmazonAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange,
          false,
          false
        ),
        searchText,
        AmazonAdvertisingTableTypesEnum.CAMPAIGN
      ),
    enabled: selectedAdvertisingNavTitle === SpAccountLevelTitles.CAMPAIGNS,
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
    queryFn: ({ signal }) =>
      spAdvertisingServices.getPerformanceMetrics(
        appliedFilters,
        getAmazonAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange,
          false,
          false
        ),
        searchText,
        AmazonAdvertisingTableTypesEnum.CAMPAIGN,
        signal
      ),
    enabled: selectedAdvertisingNavTitle === SpAccountLevelTitles.CAMPAIGNS,
  });

  const fetchImpactAnalysis = useAppQuery({
    queryKey: [
      QueryKeyEnums.IMPACT_ANALYSIS_FETCH,
      {
        appliedAdvertisingFilters,
      },
    ],
    queryFn: ({ signal }) =>
      AnalysisSPService.getImpactAnalysis(
        getAmazonAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange
        ),
        AmazonAdvertisingTableTypesEnum.CAMPAIGN,
        signal
      ),
  });

  useEffect(() => {
    setFilteredState([]);
    dispatch(setInitialState([]));
    dispatch(setEditState([]));

    if (fetchCampaigns.data) {
      let data = fetchCampaigns.data.data.data.data;
      data = data.map((row) => {
        const id = `${row.campaignId}`;
        return {
          id,
          ...row,
        };
      });

      const _initialColumns = getInitialColumnsByNavTitle(
        SpAccountLevelTitles.CAMPAIGNS
      );
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        SpAccountLevelTitles.CAMPAIGNS
      );
      setInitialColumns(
        _initialColumns as Array<ColumnDef<ISPAdvertisingData>>
      );
      setSelectedColumns(
        filteredColumns as Array<ColumnDef<ISPAdvertisingData>>
      );

      dispatch(setInitialState(data as ISPAdvertisingData[]));
      const updatedData = getErrorEditState(
        data,
        advErrors
      ) as ISPAdvertisingData[];
      setFilteredState(updatedData);
      dispatch(setEditState(updatedData));
      dispatch(setAdvertisingErrorDetails(null));

      const totalRows = fetchCampaigns.data.data.data.pagination.totalItems;
      setTotalRowCount(parseInt(totalRows as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCampaigns.data, dispatch]);

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

  useEffect(() => {
    if (fetchImpactAnalysis.data) {
      dispatch(
        setImpactAnalysisData({
          data: fetchImpactAnalysis.data.data.data,
          table: AmazonAdvertisingTableTypesEnum.CAMPAIGN,
        })
      );
    } else {
      dispatch(setImpactAnalysisData(null));
    }
  }, [fetchImpactAnalysis.data, dispatch]);

  const handlePerformanceMetricsChange = (metricsValue: {
    value: IDropdownItem<string>;
    key: TPerformanceMetricsKey;
  }) => {
    dispatch(setSPPerformanceMetrics(metricsValue));
  };

  const handleDownload = useCallback(
    async (isAllDownload: boolean) => {
      dispatch(
        showSuccessToastMessage({
          title: 'Download Started',
          description: 'This may take a few seconds.',
        })
      );

      const data: Record<string, unknown>[] = (await getCampaignsDownload(
        true,
        isAllDownload
      )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getCampaignsDownload]
  );

  return (
    <AdvertisingRenderingComponents
      advertisingMetricsData={advertisingMetricsData}
      performanceFilters={getAmazonAdvertisingFilters(
        appliedAdvertisingFilters,
        appliedAdvertisingFilters.customDateRange
      )}
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
      isImpactLoading={
        fetchImpactAnalysis.isLoading || fetchImpactAnalysis.isRefetching
      }
      chartTitle={`advertising_SP_${getFileNameDateTime(
        getAmazonAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange
        )
      )}`}
      performanceNavigationTabOptions={spAccountPerformanceOptions}
      isTableLoading={fetchCampaigns.isLoading || fetchCampaigns.isRefetching}
      initialColumns={initialColumns}
      selectedColumns={selectedColumns}
      handleSelectedColumns={setSelectedColumnsHandler}
      exportFileTitle={genExportFileName('amazon-sp', 'Campaigns')}
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
