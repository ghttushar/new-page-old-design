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
import { WalmartAnalysisSVService } from '@/services/advertising/impact-analysis/walmart/sv/impact-analysis-sv.service';
import { walmartEditAccessSVServices } from '@/services/edit-access/walmart-edit-access/walmart-edit-access-sv/walmart-edit-access-sv.service';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { walmartSvAccountPerformanceOptions } from 'src/constants/advertising-filter.constants';
import {
  WalmartAdvertisingTableTypeEnum,
  WalmartSVAccountLevelTitles,
} from 'src/enums/advertising.enums';
import { WalmartCampaignStatusEnum } from 'src/enums/walmart.enums';
import { IEditAccessArrayData } from 'src/interfaces/advertising/advertising.interface';
import {
  IWalmartSVAdvertisingData,
  IWalmartSVCampaign,
} from 'src/interfaces/advertising/walmart/walmart-sv-advertising.interface';
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
  selectWalmartSvPerformanceMetrics,
  selectWalmartSvPerformanceMetricsOptions,
  setWalmartSVPerformanceMetrics,
} from 'src/redux/slices/advertising/walmart/advertising-walmart-sv.slice';
import { selectAppliedFilters } from 'src/redux/slices/filters/filter.slice';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { walmartSvAdvertisingServices } from 'src/services/advertising/walmart/walmart-sv-advertising.service';
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

export default function AdvertisingWalmartSVAccountLevelCampaign() {
  const [initialColumns, setInitialColumns] = useState<
    Array<ColumnDef<IWalmartSVAdvertisingData>>
  >([]);
  const [selectedColumns, setSelectedColumns] = useState<
    Array<ColumnDef<IWalmartSVAdvertisingData>>
  >([]);
  const [filteredState, setFilteredState] = useState<IEditAccessArrayData>([]);
  const [advertisingSVGraphData, setAdvertisingSVGraphData] = useState<
    IPerformanceGraphData[]
  >([]);
  const [advertisingSVMetricsData, setAdvertisingSVMetricsData] =
    useState<IPerformanceMetrics | null>(null);
  const [minMaxDates, setMinMaxDates] = useState<IMinMaxDateRange[]>([]);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);
  const [isEditLoading, setIsEditLoading] = useState<boolean>(false);
  const [openSaveModal, setOpenSaveModal] = useState<boolean>(false);

  const appliedAdvertisingFilters = useAppSelector(
    selectAdvertisingAppliedFilter
  );
  const SVPerformanceMetrics = useAppSelector(
    selectWalmartSvPerformanceMetrics
  );
  const SVPerformanceMetricsOptions = useAppSelector(
    selectWalmartSvPerformanceMetricsOptions
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
    selectedColumns: Array<ColumnDef<IWalmartSVAdvertisingData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      WalmartSVAccountLevelTitles.CAMPAIGNS,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  const { mutateAsync: editAccessMutate } = useAppMutation({
    mutationFn: (body: IEditAccessWalmartCampaign[]) =>
      walmartEditAccessSVServices.updateWalmartSVCampaign(body),
    options: {
      onSettled: () => {
        setIsEditLoading(false);
        setOpenSaveModal(false);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_SV_ACCOUNT_LVL_CAMPAIGN_FETCH],
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
              queryKey: [QueryKeyEnums.WMT_SV_ACCOUNT_LVL_CAMPAIGN_FETCH],
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
    ) as Map<string, IWalmartSVCampaign>;
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
            content: `<b>Please note: </b> Resuming an SV campaign will trigger a review process by Walmart's team. This process may take 24-48 hours during which the campaign will stop serving ads.`,
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
      walmartSvAccountPerformanceOptions,
      WalmartSVAccountLevelTitles.CAMPAIGNS
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(
      setSelectedAdvertisingNavTitle(WalmartSVAccountLevelTitles.CAMPAIGNS)
    );
  }, [dispatch]);

  const getSVCampaignsDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      const res = walmartSvAdvertisingServices
        .getSVCampaigns(
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
            WalmartSVAccountLevelTitles.CAMPAIGNS,
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
      QueryKeyEnums.WMT_SV_ACCOUNT_LVL_CAMPAIGN_FETCH,
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
      walmartSvAdvertisingServices.getSVCampaigns(
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
        getFormattedSortModel(WalmartSVAccountLevelTitles.CAMPAIGNS, sortModel),
        searchText,
        signal
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartSVAccountLevelTitles.CAMPAIGNS,
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
      walmartSvAdvertisingServices.getSVPerformanceGraph(
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
      selectedAdvertisingNavTitle === WalmartSVAccountLevelTitles.CAMPAIGNS,
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
      walmartSvAdvertisingServices.getSVPerformanceMetrics(
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
      selectedAdvertisingNavTitle === WalmartSVAccountLevelTitles.CAMPAIGNS,
  });

  const fetchImpactAnalysis = useAppQuery({
    queryKey: [
      QueryKeyEnums.IMPACT_ANALYSIS_FETCH,

      {
        appliedAdvertisingFilters,
      },
    ],

    queryFn: () =>
      WalmartAnalysisSVService.getImpactAnalysis(
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
        WalmartSVAccountLevelTitles.CAMPAIGNS
      );
      const tempInitialColumns = getInStoreColumnsByAccountType(
        _initialColumns as Array<ColumnDef<IWalmartSVAdvertisingData>>,
        selectedAdvertisingAccountType,
        WALMART_IN_STORE_COLUMNS as Array<ColumnDef<IWalmartSVAdvertisingData>>
      );
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        WalmartSVAccountLevelTitles.CAMPAIGNS,
        tempInitialColumns as Array<ColumnDef<IWalmartSVAdvertisingData>>
      );
      setInitialColumns(
        tempInitialColumns as Array<ColumnDef<IWalmartSVAdvertisingData>>
      );
      setSelectedColumns(
        filteredColumns as Array<ColumnDef<IWalmartSVAdvertisingData>>
      );

      dispatch(setInitialState(data as IWalmartSVAdvertisingData[]));
      const updatedData = getErrorEditState(
        data,
        advErrors
      ) as IWalmartSVAdvertisingData[];
      setFilteredState(updatedData);
      dispatch(setEditState(updatedData));
      dispatch(setAdvertisingErrorDetails(null));

      const totalRows = fetchCampaigns.data.data.data.pagination.totalItems;
      setTotalRowCount(parseInt(totalRows as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCampaigns.data, dispatch]);

  useEffect(() => {
    setAdvertisingSVGraphData([]);
    setMinMaxDates([]);

    if (fetchPerformanceGraph.data) {
      setAdvertisingSVGraphData(
        fetchPerformanceGraph.data.data.data?.graphData ?? []
      );
      setMinMaxDates(fetchPerformanceGraph.data.data.data?.maxMinDate);
    }
  }, [fetchPerformanceGraph.data]);

  useEffect(() => {
    setAdvertisingSVMetricsData(null);

    if (fetchPerformanceMetrics.data) {
      setAdvertisingSVMetricsData(fetchPerformanceMetrics.data.data.data);
    }
  }, [fetchPerformanceMetrics.data]);

  const handlePerformanceMetricsChange = (metricsValue: {
    value: IDropdownItem<string>;
    key: TPerformanceMetricsKey;
  }) => {
    dispatch(setWalmartSVPerformanceMetrics(metricsValue));
  };

  const handleDownload = useCallback(
    async (isAllDownload: boolean) => {
      dispatch(
        showSuccessToastMessage({
          title: 'Download Started',
          description: 'This may take a few seconds.',
        })
      );

      const data: Record<string, unknown>[] = (await getSVCampaignsDownload(
        true,
        isAllDownload
      )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getSVCampaignsDownload]
  );

  return (
    <React.Fragment>
      <AdvertisingRenderingComponents
        advertisingMetricsData={advertisingSVMetricsData}
        performanceFilters={getWalmartAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange
        )}
        isMetricsLoading={
          fetchPerformanceMetrics.isLoading ||
          fetchPerformanceMetrics.isRefetching
        }
        performanceSelectedMetrics={SVPerformanceMetrics}
        performanceMetricsOptions={SVPerformanceMetricsOptions}
        handlePerformanceMetricsChange={handlePerformanceMetricsChange}
        performanceGraphData={advertisingSVGraphData}
        minMaxDates={minMaxDates ? minMaxDates[0] : null}
        isGraphLoading={
          fetchPerformanceGraph.isLoading || fetchPerformanceGraph.isRefetching
        }
        isImpactLoading={
          fetchImpactAnalysis.isLoading || fetchImpactAnalysis.isRefetching
        }
        chartTitle={`advertising_SV_${getFileNameDateTime(
          getWalmartAdvertisingFilters(
            appliedAdvertisingFilters,
            appliedAdvertisingFilters.customDateRange
          )
        )}`}
        performanceNavigationTabOptions={walmartSvAccountPerformanceOptions}
        isTableLoading={fetchCampaigns.isLoading || fetchCampaigns.isRefetching}
        initialColumns={initialColumns}
        selectedColumns={selectedColumns}
        handleSelectedColumns={setSelectedColumnsHandler}
        exportFileTitle={genExportFileName('walmart-sv', 'Campaigns')}
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
