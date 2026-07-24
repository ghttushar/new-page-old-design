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
import { IEditAccessWalmartCampaign } from '@/interfaces/edit-access/edit-access.interface';
import {
  IAPIResponse,
  IErrorResultDetails,
} from '@/interfaces/service.interface';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { setImpactAnalysisData } from '@/redux/slices/impact-analysis/impact-analysis.slice';
import { WalmartAnalysisOverallService } from '@/services/advertising/impact-analysis/walmart/overall/impact-analysis-overall.service';
import { walmartEditAccessOverallServices } from '@/services/edit-access/walmart-edit-access/walmart-edit-access-overall/walmart-edit-access-overall.service';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { walmartOverallAccountPerformanceOptions } from 'src/constants/advertising-filter.constants';
import {
  WalmartAdvertisingTableTypeEnum,
  WalmartOverallAccountLevelTitles,
} from 'src/enums/advertising.enums';
import {
  WalmartAdTypeEnum,
  WalmartCampaignStatusEnum,
} from 'src/enums/walmart.enums';
import { IEditAccessArrayData } from 'src/interfaces/advertising/advertising.interface';
import {
  IWalmartOverallAdvertisingData,
  IWalmartOverallCampaign,
} from 'src/interfaces/advertising/walmart/walmart-overall-advertising.interface';
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

export default function WalmartOverallAccountLevelCampaign() {
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
  const {
    handlePopupOpen,
    handlePopupClose,
    PopupComponent,
    updatePopupLoading,
  } = useAdsReviewTrigger();

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<IWalmartOverallAdvertisingData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      WalmartOverallAccountLevelTitles.CAMPAIGNS,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);

  const selectedAdvertisingAccountType = useMemo(
    () => localStorageUtils.getSelectedAdvertisingAccount()?.accountType,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedAdvertisingAccount]
  );

  useEffect(() => {
    dispatch(resetEditAccessFilters());

    const selectedTab = getSelectedNavTab(
      walmartOverallAccountPerformanceOptions,
      WalmartOverallAccountLevelTitles.CAMPAIGNS
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(
      setSelectedAdvertisingNavTitle(WalmartOverallAccountLevelTitles.CAMPAIGNS)
    );
  }, [dispatch]);

  const { mutateAsync: editAccessMutate } = useAppMutation({
    mutationFn: (body: IEditAccessWalmartCampaign[]) =>
      walmartEditAccessOverallServices.updateWalmartOverallCampaign(body),
    options: {
      onSettled: () => {
        setIsEditLoading(false);
        setOpenSaveModal(false);
      },

      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_OVERALL_ACCOUNT_LVL_CAMPAIGN_FETCH],
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
              queryKey: [QueryKeyEnums.WMT_OVERALL_ACCOUNT_LVL_CAMPAIGN_FETCH],
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
    ) as Map<string, IWalmartOverallCampaign>;
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
            currentRowData.adType !== WalmartAdTypeEnum.SPONSORED_PRODUCTS &&
            (value.status.toLowerCase() ===
              WalmartCampaignStatusEnum.ENABLED.toLowerCase() ||
              value.status.toLowerCase() ===
                WalmartCampaignStatusEnum.LIVE.toLowerCase())
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
            content: `<b>Please note: </b> Resuming an SB or SV campaign will trigger a review process by Walmart's team. This process may take 24-48 hours during which the campaign will stop serving ads.`,
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

  const getOverallCampaignDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      const res = walmartOverallAdvertisingServices
        .getOverallCampaigns(
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
            WalmartOverallAccountLevelTitles.CAMPAIGNS,
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
      QueryKeyEnums.WMT_OVERALL_ACCOUNT_LVL_CAMPAIGN_FETCH,
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
    queryFn: ({ signal }) => {
      return walmartOverallAdvertisingServices.getOverallCampaigns(
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
          WalmartOverallAccountLevelTitles.CAMPAIGNS,
          sortModel
        ),
        searchText,
        signal
      );
    },
    enabled:
      selectedAdvertisingNavTitle ===
      WalmartOverallAccountLevelTitles.CAMPAIGNS,
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
      walmartOverallAdvertisingServices.getOverallPerformanceGraph(
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
      selectedAdvertisingNavTitle ===
      WalmartOverallAccountLevelTitles.CAMPAIGNS,
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
      walmartOverallAdvertisingServices.getOverallPerformanceMetrics(
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
      selectedAdvertisingNavTitle ===
      WalmartOverallAccountLevelTitles.CAMPAIGNS,
  });
  const fetchImpactAnalysis = useAppQuery({
    queryKey: [
      QueryKeyEnums.IMPACT_ANALYSIS_FETCH,
      {
        appliedAdvertisingFilters,
      },
    ],

    queryFn: () =>
      WalmartAnalysisOverallService.getImpactAnalysis(
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
  }, [fetchImpactAnalysis.data, dispatch]);

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
        WalmartOverallAccountLevelTitles.CAMPAIGNS
      );
      const tempInitialColumns = getInStoreColumnsByAccountType(
        _initialColumns as Array<ColumnDef<IWalmartOverallAdvertisingData>>,
        selectedAdvertisingAccountType,
        WALMART_IN_STORE_COLUMNS as Array<
          ColumnDef<IWalmartOverallAdvertisingData>
        >
      );
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        WalmartOverallAccountLevelTitles.CAMPAIGNS,
        tempInitialColumns as Array<ColumnDef<IWalmartOverallAdvertisingData>>
      );
      setInitialColumns(
        tempInitialColumns as Array<ColumnDef<IWalmartOverallAdvertisingData>>
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

      const totalRows = fetchCampaigns.data.data.data.pagination.totalItems;
      setTotalRowCount(parseInt(totalRows as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCampaigns.data, dispatch, selectedAdvertisingAccountType]);

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

      const data: Record<string, unknown>[] = (await getOverallCampaignDownload(
        true,
        isAllDownload
      )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getOverallCampaignDownload]
  );

  return (
    <React.Fragment>
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
        isImpactLoading={
          fetchImpactAnalysis.isLoading || fetchImpactAnalysis.isRefetching
        }
        chartTitle={`walmart_advertising_overall_${getFileNameDateTime(
          getWalmartAdvertisingFilters(
            appliedAdvertisingFilters,
            appliedAdvertisingFilters.customDateRange
          )
        )}`}
        performanceNavigationTabOptions={
          walmartOverallAccountPerformanceOptions
        }
        isTableLoading={fetchCampaigns.isLoading || fetchCampaigns.isRefetching}
        initialColumns={initialColumns}
        selectedColumns={selectedColumns}
        handleSelectedColumns={setSelectedColumnsHandler}
        exportFileTitle={genExportFileName('walmart-overall', 'Campaigns')}
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
