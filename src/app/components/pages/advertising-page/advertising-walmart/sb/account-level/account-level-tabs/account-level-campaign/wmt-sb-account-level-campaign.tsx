import { ICustomizablePopupDetails } from '@/app/components/common/customizable-dialog/customizable-popup';
import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import AdvertisingRenderingComponents from '@/app/components/page-components/advertising-rendering-components/advertising-rendering-components';
import { WALMART_IN_STORE_COLUMNS } from '@/constants/table-columns/new-column-names.constants';
import { QueryKeyEnums } from '@/enums/query.enums';
import useAdsReviewTrigger from '@/hooks/use-ads-review-trigger.hook';
import {
  IMinMaxDateRange,
  IPerformanceGraphData,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IWalmartCampaign } from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { IEditAccessWalmartCampaign } from '@/interfaces/edit-access/edit-access.interface';
import {
  IAPIResponse,
  IErrorResultDetails,
} from '@/interfaces/service.interface';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { setImpactAnalysisData } from '@/redux/slices/impact-analysis/impact-analysis.slice';
import { WalmartAnalysisSBService } from '@/services/advertising/impact-analysis/walmart/sb/impact-analysis-sb.service';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { walmartSbAccountPerformanceOptions } from 'src/constants/advertising-filter.constants';
import {
  WalmartAdvertisingTableTypeEnum,
  WalmartSBAccountLevelTitles,
} from 'src/enums/advertising.enums';
import { WalmartCampaignStatusEnum } from 'src/enums/walmart.enums';
import { IEditAccessArrayData } from 'src/interfaces/advertising/advertising.interface';
import { IWalmartSBAdvertisingData } from 'src/interfaces/advertising/walmart/walmart-sb-advertising.interface';
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
  selectWalmartSbPerformanceMetrics,
  selectWalmartSbPerformanceMetricsOptions,
  setWalmartSBPerformanceMetrics,
} from 'src/redux/slices/advertising/walmart/advertising-walmart-sb.slice';
import { selectAppliedFilters } from 'src/redux/slices/filters/filter.slice';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { walmartSbAdvertisingServices } from 'src/services/advertising/walmart/walmart-sb-advertising.service';
import { walmartEditAccessSBServices } from 'src/services/edit-access/walmart-edit-access/walmart-edit-access-sb/walmart-edit-access-sb.service';
import { genExportFileName, getFileNameDateTime } from 'src/utils';
import {
  getFormattedSortModel,
  getInitialColumnsByNavTitle,
} from 'src/utils/advertising-columns.utils';
import {
  getActiveWalmartStatus,
  getComparisonDetails,
  getEditedTableValuesMap,
  getErrorEditState,
  getInStoreColumnsByAccountType,
  getSelectedNavTab,
  getWalmartAdvertisingFilters,
  getWalmartAppliedFilters,
  removeFrequencyFromAdvFilters,
} from 'src/utils/advertising.utils';
import columnFilterUtils from 'src/utils/column-filter.utils';

export default function AdvertisingWalmartSBAccountLevelCampaign() {
  const [initialColumns, setInitialColumns] = useState<
    Array<ColumnDef<IWalmartSBAdvertisingData>>
  >([]);
  const [selectedColumns, setSelectedColumns] = useState<
    Array<ColumnDef<IWalmartSBAdvertisingData>>
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
  const SBPerformanceMetrics = useAppSelector(
    selectWalmartSbPerformanceMetrics
  );
  const SBPerformanceMetricsOptions = useAppSelector(
    selectWalmartSbPerformanceMetricsOptions
  );
  const selectedAdvertisingNavTitle = useAppSelector(
    selectSelectedAdvertisingNavTitle
  );
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const searchText = useAppSelector(selectSearchText);
  const initialState = useAppSelector(selectInitialState);
  const editState = useAppSelector(selectEditState);
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const paginationModel = useAppSelector(selectPaginationModel);
  const sortModel = useAppSelector(selectSortModel);
  const advErrors = useAppSelector(selectAdvertisingErrors);

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const {
    handlePopupOpen,
    handlePopupClose,
    PopupComponent,
    updatePopupLoading,
  } = useAdsReviewTrigger();

  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);

  const selectedAdvertisingAccountType = useMemo(
    () => localStorageUtils.getSelectedAdvertisingAccount()?.accountType,
    [selectedAdvertisingAccount]
  );

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<IWalmartSBAdvertisingData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      WalmartSBAccountLevelTitles.CAMPAIGNS,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  const { mutateAsync: editAccessMutate } = useAppMutation({
    mutationFn: (body: IEditAccessWalmartCampaign[]) =>
      walmartEditAccessSBServices.updateWalmartSBCampaign(body),
    options: {
      onSettled: () => {
        setIsEditLoading(false);
        setOpenSaveModal(false);
      },

      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_SB_ACCOUNT_LVL_CAMPAIGN_FETCH],
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
              queryKey: [QueryKeyEnums.WMT_SB_ACCOUNT_LVL_CAMPAIGN_FETCH],
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

    const body: IEditAccessWalmartCampaign[] = [];
    const editStateMap = getEditedTableValuesMap(
      updatedValues,
      editState
    ) as Map<string, IWalmartCampaign>;
    let isReview = false;

    for (const [key, value] of updatedValues) {
      const currentRowData = editStateMap.get(`${key}`);

      if (currentRowData) {
        const data: IEditAccessWalmartCampaign = {
          id: `${key}`,
          campaignId: `${key}`,
          entityName: currentRowData.campaignName || `${key}`,
        };

        if (value.campaignName) {
          data.name = value.campaignName;
        }

        if (value.endDate) {
          data.endDate = value.endDate;
        }

        if (value.status) {
          data.status = value.status.toLowerCase();

          if (
            value.status.toLowerCase() ===
              WalmartCampaignStatusEnum.ENABLED.toLowerCase() ||
            value.status.toLowerCase() ===
              WalmartCampaignStatusEnum.LIVE.toLowerCase()
          ) {
            isReview = true;
          }
        }

        if (value.dailyBudget) {
          data.dailyBudget = Number(value.dailyBudget);
        }

        if (value.totalBudget) {
          data.totalBudget = Number(value.totalBudget);
        }

        if (value.automationStatus) {
          data.automationStatus = value.automationStatus;
        }

        if (value.tagId !== undefined) {
          data.tagId = value.tagId;
        }

        body.push(data);
      }
    }

    const confirmClick = async () => await handleReviewPopupConfirmClick(body);

    if (isReview) {
      const popupParams: ICustomizablePopupDetails = {
        description: [
          {
            content: `<b>Please note: </b> Resuming an SB campaign will trigger a review process by Walmart's team. This process may take 24-48 hours during which the campaign will stop serving ads.`,
            isHeading: false,
          },
          {
            content: 'Do you want to continue?',
            isHeading: false,
          },
        ],
        wantBodyDivider: false,
        wantGutters: true,
        minWidth: 'xs',
      };

      handlePopupOpen(popupParams, confirmClick);
    } else {
      confirmClick();
    }
  };

  const handleReviewPopupConfirmClick = async (
    body: IEditAccessWalmartCampaign[]
  ) => {
    setIsEditLoading(true);
    await editAccessMutate(body);
    handlePopupClose();
  };

  useEffect(() => {
    updatePopupLoading(isEditLoading);
  }, [isEditLoading, updatePopupLoading]);

  useEffect(() => {
    dispatch(resetEditAccessFilters());

    const selectedTab = getSelectedNavTab(
      walmartSbAccountPerformanceOptions,
      WalmartSBAccountLevelTitles.CAMPAIGNS
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(
      setSelectedAdvertisingNavTitle(WalmartSBAccountLevelTitles.CAMPAIGNS)
    );
  }, [dispatch]);

  const getSBCampaignsDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      const res = walmartSbAdvertisingServices
        .getSBCampaigns(
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
            WalmartSBAccountLevelTitles.CAMPAIGNS,
            sortModel
          ),
          searchText
        )
        .then((res) => {
          let data = res.data?.data.data;
          data = data.map((row) => {
            const id = `${row.campaignId}`;
            return {
              ...row,
              id,
              viewStatus: row.status as WalmartCampaignStatusEnum,
              status: getActiveWalmartStatus(
                row.status as WalmartCampaignStatusEnum
              ),
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
      QueryKeyEnums.WMT_SB_ACCOUNT_LVL_CAMPAIGN_FETCH,
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
      walmartSbAdvertisingServices.getSBCampaigns(
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
        getFormattedSortModel(WalmartSBAccountLevelTitles.CAMPAIGNS, sortModel),
        searchText,
        signal
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartSBAccountLevelTitles.CAMPAIGNS,
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
      walmartSbAdvertisingServices.getSBPerformanceGraph(
        getWalmartAppliedFilters(appliedFilters, false, false),
        getWalmartAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange
        ),
        searchText,
        WalmartAdvertisingTableTypeEnum.CAMPAIGN,
        signal
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartSBAccountLevelTitles.CAMPAIGNS,
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
      walmartSbAdvertisingServices.getSBPerformanceMetrics(
        getWalmartAppliedFilters(appliedFilters, false, false),
        getWalmartAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange
        ),
        searchText,
        WalmartAdvertisingTableTypeEnum.CAMPAIGN,
        signal
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartSBAccountLevelTitles.CAMPAIGNS,
  });

  const fetchImpactAnalysis = useAppQuery({
    queryKey: [
      QueryKeyEnums.IMPACT_ANALYSIS_FETCH,

      {
        appliedAdvertisingFilters,
      },
    ],

    queryFn: () =>
      WalmartAnalysisSBService.getImpactAnalysis(
        getWalmartAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange
        ),
        WalmartAdvertisingTableTypeEnum.CAMPAIGN
      ),
  });

  useEffect(() => {
    if (fetchImpactAnalysis.data) {
      dispatch(
        setImpactAnalysisData({
          data: fetchImpactAnalysis.data.data.data,
          table: WalmartAdvertisingTableTypeEnum.CAMPAIGN,
        })
      );
    } else {
      dispatch(setImpactAnalysisData(null));
    }
  }, [dispatch, fetchImpactAnalysis.data]);

  useEffect(() => {
    setFilteredState([]);
    dispatch(setInitialState([]));
    dispatch(setEditState([]));

    if (fetchCampaigns.data) {
      let data = fetchCampaigns.data.data.data.data;
      data = data.map((row) => {
        const id = `${row.campaignId}`;
        return {
          ...row,
          id,
          viewStatus: row.status as WalmartCampaignStatusEnum,
          status: getActiveWalmartStatus(
            row.status as WalmartCampaignStatusEnum
          ),
        };
      });

      const _initialColumns = getInitialColumnsByNavTitle(
        WalmartSBAccountLevelTitles.CAMPAIGNS
      );
      const tempInitialColumns = getInStoreColumnsByAccountType(
        _initialColumns as Array<ColumnDef<IWalmartSBAdvertisingData>>,
        selectedAdvertisingAccountType,
        WALMART_IN_STORE_COLUMNS as Array<ColumnDef<IWalmartSBAdvertisingData>>
      );
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        WalmartSBAccountLevelTitles.CAMPAIGNS,
        tempInitialColumns as Array<ColumnDef<IWalmartSBAdvertisingData>>
      );
      setInitialColumns(
        tempInitialColumns as Array<ColumnDef<IWalmartSBAdvertisingData>>
      );
      setSelectedColumns(
        filteredColumns as Array<ColumnDef<IWalmartSBAdvertisingData>>
      );

      dispatch(setInitialState(data as IWalmartSBAdvertisingData[]));
      const updatedData = getErrorEditState(
        data,
        advErrors
      ) as IWalmartSBAdvertisingData[];
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

  const handlePerformanceMetricsChange = (metricsValue: {
    value: IDropdownItem<string>;
    key: TPerformanceMetricsKey;
  }) => {
    dispatch(setWalmartSBPerformanceMetrics(metricsValue));
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
    <React.Fragment>
      <AdvertisingRenderingComponents
        advertisingMetricsData={advertisingSBMetricsData}
        performanceFilters={getWalmartAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange
        )}
        isMetricsLoading={
          fetchPerformanceMetrics.isLoading ||
          fetchPerformanceMetrics.isRefetching
        }
        performanceSelectedMetrics={SBPerformanceMetrics}
        performanceMetricsOptions={SBPerformanceMetricsOptions}
        handlePerformanceMetricsChange={handlePerformanceMetricsChange}
        performanceGraphData={advertisingSBGraphData}
        minMaxDates={minMaxDates ? minMaxDates[0] : null}
        isGraphLoading={
          fetchPerformanceGraph.isLoading || fetchPerformanceGraph.isRefetching
        }
        isImpactLoading={
          fetchImpactAnalysis.isLoading || fetchImpactAnalysis.isRefetching
        }
        chartTitle={`advertising_SB_${getFileNameDateTime(
          getWalmartAdvertisingFilters(
            appliedAdvertisingFilters,
            appliedAdvertisingFilters.customDateRange
          )
        )}`}
        performanceNavigationTabOptions={walmartSbAccountPerformanceOptions}
        isTableLoading={fetchCampaigns.isLoading || fetchCampaigns.isRefetching}
        initialColumns={initialColumns}
        selectedColumns={selectedColumns}
        handleSelectedColumns={setSelectedColumnsHandler}
        exportFileTitle={genExportFileName('walmart-sb', 'Campaigns')}
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

      {PopupComponent !== null && PopupComponent}
    </React.Fragment>
  );
}
