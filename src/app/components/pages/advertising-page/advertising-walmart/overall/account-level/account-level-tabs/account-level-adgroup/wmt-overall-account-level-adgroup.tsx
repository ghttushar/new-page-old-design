import { ICustomizablePopupDetails } from '@/app/components/common/customizable-dialog/customizable-popup';
import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import AdvertisingRenderingComponents from '@/app/components/page-components/advertising-rendering-components/advertising-rendering-components';
import { QueryKeyEnums } from '@/enums/query.enums';
import useAdsReviewTrigger from '@/hooks/use-ads-review-trigger.hook';
import {
  IMinMaxDateRange,
  IPerformanceGraphData,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IBidderUpdate } from '@/interfaces/edit-access/bidder.interface';
import { IEditAccessWalmartAdGroup } from '@/interfaces/edit-access/edit-access.interface';
import {
  IAPIResponse,
  IErrorResultDetails,
} from '@/interfaces/service.interface';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import { setImpactAnalysisData } from '@/redux/slices/impact-analysis/impact-analysis.slice';
import { WalmartAnalysisOverallService } from '@/services/advertising/impact-analysis/walmart/overall/impact-analysis-overall.service';
import { BidderServices } from '@/services/edit-access/bidder/bidder.service';
import { walmartEditAccessOverallServices } from '@/services/edit-access/walmart-edit-access/walmart-edit-access-overall/walmart-edit-access-overall.service';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useEffect, useState } from 'react';
import { walmartOverallAccountPerformanceOptions } from 'src/constants/advertising-filter.constants';
import {
  WalmartAdvertisingTableTypeEnum,
  WalmartOverallAccountLevelTitles,
} from 'src/enums/advertising.enums';
import {
  WalmartAdGroupStatusEnum,
  WalmartAdTypeEnum,
} from 'src/enums/walmart.enums';
import { IEditAccessArrayData } from 'src/interfaces/advertising/advertising.interface';
import {
  IWalmartOverallAdGroup,
  IWalmartOverallAdvertisingData,
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
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from 'src/redux/slices/notifications/toast-message.slice';
import { walmartOverallAdvertisingServices } from 'src/services/advertising/walmart/walmart-overall-advertising.service';
import { genExportFileName, getFileNameDateTime } from 'src/utils';
import {
  getFormattedSortModel,
  getInitialColumnsByNavTitle,
} from 'src/utils/advertising-columns.utils';
import {
  convertToTitleCase,
  getComparisonDetails,
  getEditedTableValuesMap,
  getErrorEditState,
  getPartialErrorDetailsFromMultiApiResponses,
  getSelectedNavTab,
  getWalmartAdGroupStatus,
  getWalmartAdvertisingFilters,
  getWalmartAppliedFilters,
  removeFrequencyFromAdvFilters,
} from 'src/utils/advertising.utils';
import columnFilterUtils from 'src/utils/column-filter.utils';

export default function WalmartOverallAccountLevelAdGroup() {
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
      WalmartOverallAccountLevelTitles.AD_GROUPS,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  useEffect(() => {
    dispatch(resetEditAccessFilters());

    const selectedTab = getSelectedNavTab(
      walmartOverallAccountPerformanceOptions,
      WalmartOverallAccountLevelTitles.AD_GROUPS
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(
      setSelectedAdvertisingNavTitle(WalmartOverallAccountLevelTitles.AD_GROUPS)
    );
  }, [dispatch]);

  const { mutateAsync: editAccessMutateData } = useAppMutation({
    mutationFn: (body: IEditAccessWalmartAdGroup[]) =>
      walmartEditAccessOverallServices.updateWalmartOverallAdGroup(body),
    options: {
      onSettled: () => {
        setIsEditLoading(false);
        setOpenSaveModal(false);
      },

      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_OVERALL_ACCOUNT_LVL_ADGROUP_FETCH],
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
              queryKey: [QueryKeyEnums.WMT_OVERALL_ACCOUNT_LVL_ADGROUP_FETCH],
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

  const { mutateAsync: editAccessMutateBidderData } = useAppMutation({
    mutationFn: (updatedBidders: IBidderUpdate[]) =>
      BidderServices.updateWalmartAdGroupBidder(updatedBidders),
    options: {
      onSettled: () => {
        setIsEditLoading(false);
        setOpenSaveModal(false);
      },

      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_OVERALL_ACCOUNT_LVL_ADGROUP_FETCH],
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
              queryKey: [QueryKeyEnums.WMT_OVERALL_ACCOUNT_LVL_ADGROUP_FETCH],
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

  const { mutateAsync: editAccessMutateAll } = useAppMutation({
    mutationFn: ({ body }: { body: IEditAccessWalmartAdGroup[] }) => {
      return Promise.allSettled([
        walmartEditAccessOverallServices.updateWalmartOverallAdGroup(body),
      ]);
    },
    options: {
      onSettled: (responses) => {
        const rejected = responses?.filter(
          (response): response is PromiseRejectedResult =>
            response.status === 'rejected'
        );

        if (responses) {
          if (responses[0].status === 'fulfilled') {
            queryClient.invalidateQueries({
              queryKey: [QueryKeyEnums.WMT_OVERALL_ACCOUNT_LVL_ADGROUP_FETCH],
            });

            queryClient.invalidateQueries({
              queryKey: [QueryKeyEnums.ADVERTISING_METRICS_FETCH],
            });

            dispatch(
              showSuccessToastMessage({
                title: 'Ad Groups updated successfully!',
              })
            );

            dispatch(resetEditAccessFilters());
          }

          if (rejected && rejected?.length > 0) {
            const partialErrorResponseData =
              getPartialErrorDetailsFromMultiApiResponses(rejected);

            dispatch(setAdvertisingErrorDetails(partialErrorResponseData));

            if (rejected?.length !== responses?.length) {
              if (responses[0].status === 'rejected') {
                dispatch(
                  showErrorToastMessage({
                    title: 'Ad Group data Update Failed',
                    description:
                      'There was an issue while updating Ad Group data. Please try again.',
                  })
                );
              }

              queryClient.invalidateQueries({
                queryKey: [QueryKeyEnums.WMT_OVERALL_ACCOUNT_LVL_ADGROUP_FETCH],
              });

              queryClient.invalidateQueries({
                queryKey: [QueryKeyEnums.ADVERTISING_METRICS_FETCH],
              });
            } else {
              dispatch(
                showErrorToastMessage({
                  title: 'Ad Groups Update Failed',
                  description:
                    'There was an issue while updating the Ad Groups. Please try again.',
                })
              );
            }
          }
        }

        setIsEditLoading(false);
        setOpenSaveModal(false);
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

    const updatedAdGroups: IEditAccessWalmartAdGroup[] = [];
    const editStateMap = getEditedTableValuesMap(
      updatedValues,
      editState
    ) as Map<string, IWalmartOverallAdGroup>;
    let isReview = false;

    for (const [key, value] of updatedValues) {
      const areOtherFieldsUpdated =
        Object.keys(value).includes('adGroupName') ||
        Object.keys(value).includes('status');

      const currentRowData = editStateMap.get(`${key}`);

      if (currentRowData) {
        /* Edit Access for data */
        if (areOtherFieldsUpdated) {
          const data: IEditAccessWalmartAdGroup = {
            id: `${key}`,
            adGroupId: `${key}`,
            entityName: currentRowData.adGroupName || `${key}`,
          };

          if (value.adGroupName) {
            data.name = value.adGroupName;
          }

          if (value.status) {
            data.status = convertToTitleCase(value.status);

            if (
              currentRowData.adType !== WalmartAdTypeEnum.SPONSORED_PRODUCTS &&
              value.status.toLowerCase() ===
                WalmartAdGroupStatusEnum.ENABLED.toLowerCase()
            ) {
              isReview = true;
            }
          }

          updatedAdGroups.push(data);
        }
      }
    }

    if (updatedAdGroups.length) {
      setIsEditLoading(true);

      await editAccessMutateAll({ body: updatedAdGroups });
      return;
    }

    if (updatedAdGroups.length) {
      const confirmClick = async () =>
        await handleReviewPopupConfirmClick(updatedAdGroups);

      if (isReview) {
        const popupParams: ICustomizablePopupDetails = {
          description: [
            {
              content: `<b>Please note: </b> Resuming an ad group in SB or SV campaign will trigger a review process by Walmart's team. This process may take 24-48 hours during which the campaign will stop serving ads.`,
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

      return;
    }
  };

  const handleReviewPopupConfirmClick = async (
    body: IEditAccessWalmartAdGroup[]
  ) => {
    setIsEditLoading(true);
    await editAccessMutateData(body);
    handlePopupClose();
  };

  useEffect(() => {
    updatePopupLoading(isEditLoading);
  }, [isEditLoading, updatePopupLoading]);

  const getOverallAdGroupDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      const res = walmartOverallAdvertisingServices
        .getOverallAdGroups(
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
            WalmartOverallAccountLevelTitles.AD_GROUPS,
            sortModel
          ),
          searchText
        )
        .then((res) => {
          let data = res.data?.data.data;
          data = data.map((row) => {
            const id = `${row.adGroupId}`;
            return {
              id,
              ...row,
              status: getWalmartAdGroupStatus(
                row.status as WalmartAdGroupStatusEnum
              ),
            };
          });

          dispatch(
            showSuccessToastMessage({
              title: 'Downloaded Successfully',
              description: 'Ad Groups downloaded successfully.',
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

  const fetchAdGroups = useAppQuery({
    queryKey: [
      QueryKeyEnums.WMT_OVERALL_ACCOUNT_LVL_ADGROUP_FETCH,
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
      walmartOverallAdvertisingServices.getOverallAdGroups(
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
          WalmartOverallAccountLevelTitles.AD_GROUPS,
          sortModel
        ),
        searchText
      ),
    enabled:
      selectedAdvertisingNavTitle ===
      WalmartOverallAccountLevelTitles.AD_GROUPS,
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
        WalmartAdvertisingTableTypeEnum.AD_GROUP
      ),
    enabled:
      selectedAdvertisingNavTitle ===
      WalmartOverallAccountLevelTitles.AD_GROUPS,
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
        WalmartAdvertisingTableTypeEnum.AD_GROUP
      ),
    enabled:
      selectedAdvertisingNavTitle ===
      WalmartOverallAccountLevelTitles.AD_GROUPS,
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
        WalmartAdvertisingTableTypeEnum.AD_GROUP
      ),
  });

  useEffect(() => {
    if (fetchImpactAnalysis.data) {
      dispatch(
        setImpactAnalysisData({
          data: fetchImpactAnalysis.data.data.data,
          table: WalmartAdvertisingTableTypeEnum.AD_GROUP,
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

    if (fetchAdGroups.data) {
      let data = fetchAdGroups.data.data.data.data;
      data = data.map((row) => {
        const id = `${row.adGroupId}`;
        return {
          id,
          ...row,
          status: getWalmartAdGroupStatus(
            row.status as WalmartAdGroupStatusEnum
          ),
        };
      });

      const _initialColumns = getInitialColumnsByNavTitle(
        WalmartOverallAccountLevelTitles.AD_GROUPS
      );
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        WalmartOverallAccountLevelTitles.AD_GROUPS
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

      const totalRows = fetchAdGroups.data.data.data.pagination.totalItems;
      setTotalRowCount(parseInt(totalRows as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAdGroups.data, dispatch]);

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

      const data: Record<string, unknown>[] = (await getOverallAdGroupDownload(
        true,
        isAllDownload
      )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getOverallAdGroupDownload]
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
        isTableLoading={fetchAdGroups.isLoading || fetchAdGroups.isRefetching}
        initialColumns={initialColumns}
        selectedColumns={selectedColumns}
        handleSelectedColumns={setSelectedColumnsHandler}
        exportFileTitle={genExportFileName('walmart-overall', 'Ad Groups')}
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
