import { ICustomizablePopupDetails } from '@/app/components/common/customizable-dialog/customizable-popup';
import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import AdvertisingRenderingComponents from '@/app/components/page-components/advertising-rendering-components/advertising-rendering-components';
import { WALMART_BIDDER_COLUMNS } from '@/constants/advertising-walmart.constants';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  TargetingTypeEnum,
  WalmartAdGroupStatusEnum,
} from '@/enums/walmart.enums';
import useAdsReviewTrigger from '@/hooks/use-ads-review-trigger.hook';
import {
  IMinMaxDateRange,
  IPerformanceGraphData,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  IWalmartAdGroup,
  IWalmartAdItem,
  IWalmartCampaign,
} from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { IEditAccessWalmartAdItem } from '@/interfaces/edit-access/edit-access.interface';
import {
  IAPIResponse,
  IErrorResultDetails,
} from '@/interfaces/service.interface';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import { walmartEditAccessSVServices } from '@/services/edit-access/walmart-edit-access/walmart-edit-access-sv/walmart-edit-access-sv.service';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useEffect, useState } from 'react';
import {
  WalmartAdvertisingTableTypeEnum,
  WalmartSVAdGroupLevelTitles,
} from 'src/enums/advertising.enums';
import {
  IAdvertisingAdGroupLevelSubWrapperProps,
  IEditAccessArrayData,
} from 'src/interfaces/advertising/advertising.interface';
import { IWalmartSVAdvertisingData } from 'src/interfaces/advertising/walmart/walmart-sv-advertising.interface';
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
  getComparisonDetails,
  getEditedTableValuesMap,
  getErrorEditState,
  getSelectedNavTab,
  getWalmartAppliedFilters,
  removeFrequencyFromAdvFilters,
  removeUnwantedColumns,
} from 'src/utils/advertising.utils';
import columnFilterUtils from 'src/utils/column-filter.utils';

export default function AdvertisingWalmartSVAdGroupLevelProductAds<
  T extends IWalmartAdGroup | undefined,
  K extends IWalmartCampaign | null
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

  const walmartSVPerformanceMetrics = useAppSelector(
    selectWalmartSvPerformanceMetrics
  );
  const walmartSVPerformanceMetricsOptions = useAppSelector(
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

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<IWalmartSVAdvertisingData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      WalmartSVAdGroupLevelTitles.AD_ITEMS,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  useEffect(() => {
    dispatch(resetEditAccessFilters());

    const selectedTab = getSelectedNavTab(
      updatedPerformanceOptions,
      WalmartSVAdGroupLevelTitles.AD_ITEMS
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(
      setSelectedAdvertisingNavTitle(WalmartSVAdGroupLevelTitles.AD_ITEMS)
    );
  }, [dispatch, updatedPerformanceOptions]);

  const { mutateAsync: editAccessMutate } = useAppMutation({
    mutationFn: ({
      body,
      isReview,
    }: {
      body: IEditAccessWalmartAdItem[];
      isReview: boolean;
    }) => walmartEditAccessSVServices.updateWalmartSVAdItem(body),
    options: {
      onSettled: () => {
        setIsEditLoading(false);
        setOpenSaveModal(false);
      },

      onSuccess: (data, variables) => {
        if (variables.isReview) {
          queryClient.invalidateQueries({
            queryKey: [QueryKeyEnums.WMT_SV_CAMPAIGN_LVL_FETCH],
          });

          queryClient.invalidateQueries({
            queryKey: [QueryKeyEnums.WMT_SV_ADGROUP_LVL_FETCH],
          });
        }

        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_SV_ADGROUP_LVL_PRODUCT_ADS_FETCH],
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
            if (variables.isReview) {
              queryClient.invalidateQueries({
                queryKey: [QueryKeyEnums.WMT_SV_CAMPAIGN_LVL_FETCH],
              });

              queryClient.invalidateQueries({
                queryKey: [QueryKeyEnums.WMT_SV_ADGROUP_LVL_FETCH],
              });
            }

            queryClient.invalidateQueries({
              queryKey: [QueryKeyEnums.WMT_SV_ADGROUP_LVL_PRODUCT_ADS_FETCH],
            });

            queryClient.invalidateQueries({
              queryKey: [QueryKeyEnums.ADVERTISING_METRICS_FETCH],
            });

            dispatch(
              setAdvertisingErrorDetails({
                errorList: resErrorData.data.errors,
                editedRows: variables.body,
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

    const body: IEditAccessWalmartAdItem[] = [];
    const editStateMap = getEditedTableValuesMap(
      updatedValues,
      editState
    ) as Map<string, IWalmartAdItem>;
    let isReview = false;

    for (const [key, value] of updatedValues) {
      const currentRowData = editStateMap.get(`${key}`);

      if (currentRowData) {
        const data: IEditAccessWalmartAdItem = {
          id: `${key}`,
          itemId: `${currentRowData.itemId}`,
          adItemId: `${key}`,
          campaignId: `${currentRowData.campaignId}`,
          adGroupId: `${currentRowData.adGroupId}`,
          entityName: `${currentRowData.itemName || key}`,
        };

        if (value.status) {
          data.status = value.status;

          if (
            value.status.toLowerCase() ===
            WalmartAdGroupStatusEnum.ENABLED.toLowerCase()
          ) {
            isReview = true;
          }
        }

        body.push(data);
      }
    }

    const confirmClick = async () =>
      await handleReviewPopupConfirmClick(isReview, body);

    if (isReview) {
      const popupParams: ICustomizablePopupDetails = {
        description: [
          {
            content: `<b>Please note: </b> Resuming a product ad in SV campaign will trigger a review process by Walmart's team. This process may take 24-48 hours during which the campaign will stop serving ads.`,
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
    isReview: boolean,
    body: IEditAccessWalmartAdItem[]
  ) => {
    setIsEditLoading(true);
    await editAccessMutate({ body, isReview });
    handlePopupClose();
  };

  useEffect(() => {
    updatePopupLoading(isEditLoading);
  }, [isEditLoading, updatePopupLoading]);

  const getSVProductAdsDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      const res = walmartSvAdvertisingServices
        .getSVAdItems(
          getWalmartAppliedFilters(appliedFilters, isDownload, isAllDownload),
          getFilters(isDownload, isAllDownload),
          paginationModel.pageIndex + 1,
          paginationModel.pageSize,
          getFormattedSortModel(
            WalmartSVAdGroupLevelTitles.AD_ITEMS,
            sortModel
          ),
          searchText
        )
        .then((res) => {
          let data = res.data?.data.data;
          data = data.map((row) => {
            const id = `${row.adItemId}`;
            return {
              id,
              ...row,
            };
          });

          dispatch(
            showSuccessToastMessage({
              title: 'Downloaded Successfully',
              description: 'Product Ads downloaded successfully.',
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
      dispatch,
    ]
  );

  const fetchProductAds = useAppQuery({
    queryKey: [
      QueryKeyEnums.WMT_SV_ADGROUP_LVL_PRODUCT_ADS_FETCH,
      {
        appliedFilters,
        advertisingFiltersWithNoDownload: removeFrequencyFromAdvFilters(
          advertisingFiltersWithNoDownload
        ),
        paginationModel,
        sortModel,
        searchText,
      },
    ],
    queryFn: () =>
      walmartSvAdvertisingServices.getSVAdItems(
        getWalmartAppliedFilters(appliedFilters, false, false),
        advertisingFiltersWithNoDownload,
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        getFormattedSortModel(WalmartSVAdGroupLevelTitles.AD_ITEMS, sortModel),
        searchText
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartSVAdGroupLevelTitles.AD_ITEMS,
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
      walmartSvAdvertisingServices.getSVPerformanceGraph(
        getWalmartAppliedFilters(appliedFilters, false, false),
        advertisingFiltersWithNoDownload,
        searchText,
        WalmartAdvertisingTableTypeEnum.AD_ITEM
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartSVAdGroupLevelTitles.AD_ITEMS,
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
      walmartSvAdvertisingServices.getSVPerformanceMetrics(
        getWalmartAppliedFilters(appliedFilters, false, false),
        advertisingFiltersWithNoDownload,
        searchText,
        WalmartAdvertisingTableTypeEnum.AD_ITEM
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartSVAdGroupLevelTitles.AD_ITEMS,
  });

  useEffect(() => {
    setFilteredState([]);
    dispatch(setInitialState([]));
    dispatch(setEditState([]));

    if (fetchProductAds.data) {
      let data = fetchProductAds.data.data.data.data;
      data = data.map((row) => {
        const id = `${row.adItemId}`;
        return {
          id,
          ...row,
        };
      });

      const _initialColumns = getInitialColumnsByNavTitle(
        WalmartSVAdGroupLevelTitles.AD_ITEMS
      );

      const tempInitialColumns = [..._initialColumns];
      if (
        adGroupSubHeaderData &&
        adGroupSubHeaderData?.targetingType === TargetingTypeEnum.MANUAL
      ) {
        removeUnwantedColumns(
          tempInitialColumns as Array<ColumnDef<IWalmartSVAdvertisingData>>,
          WALMART_BIDDER_COLUMNS
        );
      }

      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        WalmartSVAdGroupLevelTitles.AD_ITEMS,
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

      const totalRows = fetchProductAds.data.data.data.pagination.totalItems;
      setTotalRowCount(parseInt(totalRows as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchProductAds.data, dispatch, adGroupSubHeaderData]);

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

      const data: Record<string, unknown>[] = (await getSVProductAdsDownload(
        true,
        isAllDownload
      )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getSVProductAdsDownload]
  );

  return (
    <React.Fragment>
      <AdvertisingRenderingComponents
        campaignId={campaignId}
        adGroupId={adGroupId}
        selectedLevelType="adgroup-level"
        selectedAdGroup={adGroupSubHeaderData}
        selectedCampaign={selectedCampaign}
        isSubHeaderLoading={isSubHeaderLoading}
        advertisingMetricsData={advertisingSVMetricsData}
        performanceFilters={advertisingFiltersWithNoDownload}
        isMetricsLoading={
          fetchPerformanceMetrics.isLoading ||
          fetchPerformanceMetrics.isRefetching
        }
        performanceSelectedMetrics={walmartSVPerformanceMetrics}
        performanceMetricsOptions={walmartSVPerformanceMetricsOptions}
        handlePerformanceMetricsChange={handlePerformanceMetricsChange}
        performanceGraphData={advertisingSVGraphData}
        minMaxDates={minMaxDates ? minMaxDates[0] : null}
        isGraphLoading={
          fetchPerformanceGraph.isLoading || fetchPerformanceGraph.isRefetching
        }
        chartTitle={`walmart_advertising_SV_campaign_${
          adGroupSubHeaderData?.campaignName ?? ''
        }_adgroup_${
          adGroupSubHeaderData?.adGroupName ?? ''
        }_${getFileNameDateTime(advertisingFiltersWithNoDownload)}`}
        performanceNavigationTabOptions={updatedPerformanceOptions}
        isTableLoading={
          fetchProductAds.isLoading || fetchProductAds.isRefetching
        }
        initialColumns={initialColumns}
        selectedColumns={selectedColumns}
        handleSelectedColumns={setSelectedColumnsHandler}
        exportFileTitle={genExportFileName('walmart-sv', 'Product Ads')}
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
