import {
  IMinMaxDateRange,
  IPerformanceGraphData,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
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
  selectSBPerformanceMetrics,
  selectSBPerformanceMetricsOptions,
  setSBPerformanceMetrics,
} from 'src/redux/slices/advertising/advertising-sb-filter.slice';

import {
  sbAdvertisingAccountLevelServices,
  sbAdvertisingServices,
} from 'src/services/advertising/amazon/sb-advertising.service';
import { genExportFileName, getFileNameDateTime } from 'src/utils';

import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import AdvertisingRenderingComponents from '@/app/components/page-components/advertising-rendering-components/advertising-rendering-components';
import { QueryKeyEnums } from '@/enums/query.enums';
import { IEditAccessArrayData } from '@/interfaces/advertising/advertising.interface';
import {
  ISBAdvertisingData,
  ISBCampaign,
} from '@/interfaces/advertising/amazon/sb-advertising.interface';
import {
  IEditAccessCampaign,
  IEditAccessCampaignUpdateBody,
} from '@/interfaces/edit-access/edit-access.interface';
import {
  IAPIResponse,
  IErrorResultDetails,
} from '@/interfaces/service.interface';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import {
  resetEditAccessFilters,
  selectAdvertisingErrors,
  selectEditState,
  selectInitialState,
  selectSelectedRowIds,
  setAdvertisingErrorDetails,
  setEditState,
  setInitialState,
} from '@/redux/slices/advertising/advertising-edit-access.slice';
import {
  selectIsShowImpactOn,
  setImpactAnalysisData,
} from '@/redux/slices/impact-analysis/impact-analysis.slice';
import { AnalysisSBService } from '@/services/advertising/impact-analysis/amazon/sb/impact-analysis-sb.service';
import { EditAccessSBServices } from '@/services/edit-access/amazon-edit-access/amazon-edit-access-sb/amazon-edit-access-sb.services';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { sbAccountPerformanceOptions } from 'src/constants/advertising-filter.constants';
import {
  AmazonAdvertisingTableTypesEnum,
  SbAccountLevelTitles,
} from 'src/enums/advertising.enums';
import { selectAppliedFilters } from 'src/redux/slices/filters/filter.slice';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
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

export default function AdvertisingSBAccountLevelCampaign() {
  const [initialColumns, setInitialColumns] = useState<
    Array<ColumnDef<ISBAdvertisingData>>
  >([]);
  const [selectedColumns, setSelectedColumns] = useState<
    Array<ColumnDef<ISBAdvertisingData>>
  >([]);
  const [filteredState, setFilteredState] = useState<IEditAccessArrayData>([]);
  const [advertisingSBGraphData, setAdvertisingSBGraphData] = useState<
    IPerformanceGraphData[]
  >([]);
  const [advertisingSBMetricsData, setAdvertisingSBMetricsData] =
    useState<IPerformanceMetrics | null>(null);
  const [minMaxDates, setMinMaxDates] = useState<IMinMaxDateRange[]>([]);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);
  const [isEditLoading, setIsEditLoading] = useState<boolean>(false);
  const [openSaveModal, setOpenSaveModal] = useState<boolean>(false);

  const appliedAdvertisingFilters = useAppSelector(
    selectAdvertisingAppliedFilter
  );
  const isShowImpactOn = useAppSelector(selectIsShowImpactOn);
  const SBPerformanceMetrics = useAppSelector(selectSBPerformanceMetrics);
  const SBPerformanceMetricsOptions = useAppSelector(
    selectSBPerformanceMetricsOptions
  );
  const selectedAdvertisingNavTitle = useAppSelector(
    selectSelectedAdvertisingNavTitle
  );
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const searchText = useAppSelector(selectSearchText);
  const paginationModel = useAppSelector(selectPaginationModel);
  const sortModel = useAppSelector(selectSortModel);
  const initialState = useAppSelector(selectInitialState);
  const editState = useAppSelector(selectEditState);
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const advErrors = useAppSelector(selectAdvertisingErrors);

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<ISBAdvertisingData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      SbAccountLevelTitles.CAMPAIGNS,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  const { mutateAsync: editAccessMutate } = useAppMutation({
    mutationFn: (body: IEditAccessCampaignUpdateBody) =>
      EditAccessSBServices.updateSBCampaign(body),
    options: {
      onSettled: () => {
        setIsEditLoading(false);
        setOpenSaveModal(false);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_SB_ACCOUNT_LVL_CAMPAIGNS_FETCH],
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
              queryKey: [QueryKeyEnums.AMZ_SB_ACCOUNT_LVL_CAMPAIGNS_FETCH],
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
    ) as Map<string, ISBCampaign>;

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
          data.budget = value.budget;
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
      sbAccountPerformanceOptions,
      SbAccountLevelTitles.CAMPAIGNS
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(setSelectedAdvertisingNavTitle(SbAccountLevelTitles.CAMPAIGNS));
  }, [dispatch]);

  const getSBCampaignsDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      const res = sbAdvertisingAccountLevelServices
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
          getFormattedSortModel(SbAccountLevelTitles.CAMPAIGNS, sortModel),
          searchText
        )
        .then((res) => {
          let data = res.data.data.data;
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
      appliedFilters,
      appliedAdvertisingFilters,
      paginationModel,
      sortModel,
      searchText,
      dispatch,
    ]
  );

  const fetchCampaigns = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_SB_ACCOUNT_LVL_CAMPAIGNS_FETCH,
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
      sbAdvertisingAccountLevelServices.getCampaigns(
        appliedFilters,
        getAmazonAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange,
          false,
          false
        ),
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        getFormattedSortModel(SbAccountLevelTitles.CAMPAIGNS, sortModel),
        searchText,
        signal
      ),
    enabled: selectedAdvertisingNavTitle === SbAccountLevelTitles.CAMPAIGNS,
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
    queryFn: ({ signal }) =>
      sbAdvertisingServices.getSBPerformanceGraph(
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
    enabled: selectedAdvertisingNavTitle === SbAccountLevelTitles.CAMPAIGNS,
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
      sbAdvertisingServices.getSBPerformanceMetrics(
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
    enabled: selectedAdvertisingNavTitle === SbAccountLevelTitles.CAMPAIGNS,
  });

  const fetchImpactAnalysis = useAppQuery({
    queryKey: [
      QueryKeyEnums.IMPACT_ANALYSIS_FETCH,
      {
        appliedAdvertisingFilters,
      },
    ],
    queryFn: () =>
      AnalysisSBService.getImpactAnalysis(
        getAmazonAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange
        ),
        AmazonAdvertisingTableTypesEnum.CAMPAIGN
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
        SbAccountLevelTitles.CAMPAIGNS
      );
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        SbAccountLevelTitles.CAMPAIGNS
      );
      setInitialColumns(
        _initialColumns as Array<ColumnDef<ISBAdvertisingData>>
      );
      setSelectedColumns(
        filteredColumns as Array<ColumnDef<ISBAdvertisingData>>
      );

      dispatch(setInitialState(data as ISBAdvertisingData[]));
      const updatedData = getErrorEditState(
        data,
        advErrors
      ) as ISBAdvertisingData[];
      setFilteredState(updatedData);
      dispatch(setEditState(updatedData));
      dispatch(setAdvertisingErrorDetails(null));

      const totalRows = fetchCampaigns.data.data.data.pagination.totalItems;
      setTotalRowCount(parseInt(totalRows as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCampaigns.data, dispatch]);

  useEffect(() => {
    setAdvertisingSBGraphData([]);
    setMinMaxDates([]);

    if (fetchPerformanceGraph.data) {
      setAdvertisingSBGraphData(
        fetchPerformanceGraph.data.data.data?.graphData ?? []
      );
      setMinMaxDates(fetchPerformanceGraph.data.data.data?.maxMinDate);
    }
  }, [fetchPerformanceGraph.data]);

  useEffect(() => {
    setAdvertisingSBMetricsData(null);

    if (fetchPerformanceMetrics.data) {
      setAdvertisingSBMetricsData(fetchPerformanceMetrics.data.data.data);
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
    dispatch(setSBPerformanceMetrics(metricsValue));
  };

  const handleDownload = useCallback(
    async (isAllDownload: boolean) => {
      dispatch(
        showSuccessToastMessage({
          title: 'Download Started',
          description: 'This may take a few seconds.',
        })
      );

      const data: Record<string, unknown>[] = (await getSBCampaignsDownload(
        true,
        isAllDownload
      )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getSBCampaignsDownload]
  );

  return (
    <AdvertisingRenderingComponents
      advertisingMetricsData={advertisingSBMetricsData}
      performanceFilters={getAmazonAdvertisingFilters(
        appliedAdvertisingFilters,
        appliedAdvertisingFilters.customDateRange
      )}
      isMetricsLoading={
        fetchPerformanceMetrics.isLoading ||
        fetchPerformanceMetrics.isRefetching
      }
      performanceSelectedMetrics={SBPerformanceMetrics}
      performanceMetricsOptions={SBPerformanceMetricsOptions}
      performanceGraphData={advertisingSBGraphData}
      handlePerformanceMetricsChange={handlePerformanceMetricsChange}
      minMaxDates={minMaxDates ? minMaxDates[0] : null}
      isGraphLoading={
        fetchPerformanceGraph.isLoading || fetchPerformanceGraph.isRefetching
      }
      isImpactLoading={
        fetchImpactAnalysis.isLoading || fetchImpactAnalysis.isRefetching
      }
      chartTitle={`advertising_SB_${getFileNameDateTime(
        getAmazonAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange
        )
      )}`}
      performanceNavigationTabOptions={sbAccountPerformanceOptions}
      isTableLoading={fetchCampaigns.isLoading || fetchCampaigns.isRefetching}
      initialColumns={initialColumns}
      selectedColumns={selectedColumns}
      handleSelectedColumns={setSelectedColumnsHandler}
      exportFileTitle={genExportFileName('amazon-sb', 'Campaigns')}
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
