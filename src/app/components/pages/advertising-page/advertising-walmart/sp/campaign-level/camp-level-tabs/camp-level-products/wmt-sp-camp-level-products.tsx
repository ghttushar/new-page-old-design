import AdvertisingRenderingComponents from '@/app/components/page-components/advertising-rendering-components/advertising-rendering-components';
import {
  IMinMaxDateRange,
  IPerformanceGraphData,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  IEditAccessWalmartAdItem,
  IEditAccessWalmartAdItemUpdateBody,
} from '@/interfaces/edit-access/edit-access.interface';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';
import {
  WalmartAdvertisingTableTypeEnum,
  WalmartSPCampaignLevelTitles,
} from 'src/enums/advertising.enums';
import { TargetingTypeEnum } from 'src/enums/walmart.enums';
import {
  IAdvertisingCampLevelSubWrapperProps,
  IEditAccessArrayData,
} from 'src/interfaces/advertising/advertising.interface';
import {
  IWalmartAdItem,
  IWalmartCampaign,
  IWalmartSPAdvertisingData,
} from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
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
  selectWalmartSPPerformanceMetrics,
  selectWalmartSPPerformanceMetricsOptions,
  setWalmartSPPerformanceMetrics,
} from 'src/redux/slices/advertising/walmart/advertising-walmart-sp.slice';

import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import { WALMART_BIDDER_COLUMNS } from '@/constants/advertising-walmart.constants';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  IAPIResponse,
  IErrorResultDetails,
} from '@/interfaces/service.interface';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import { useQueryClient } from '@tanstack/react-query';
import { selectAppliedFilters } from 'src/redux/slices/filters/filter.slice';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { walmartSpAdvertisingServices } from 'src/services/advertising/walmart/walmart-sp-advertising.service';
import { walmartEditAccessSPServices } from 'src/services/edit-access/walmart-edit-access/walmart-edit-access-sp/walmart-edit-access-sp.service';
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

export default function AdvertisingWalmartSPCampLevelProductAds<
  T extends IWalmartCampaign
>({
  campaignId,
  campaignSubHeaderData,
  isSubHeaderLoading,
  updatedPerformanceOptions,
  getFilters,
  advertisingFiltersWithNoDownload,
}: IAdvertisingCampLevelSubWrapperProps<T>) {
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
  const [isEditLoading, setIsEditLoading] = useState<boolean>(false);
  const [openSaveModal, setOpenSaveModal] = useState<boolean>(false);
  const initialState = useAppSelector(selectInitialState);
  const editState = useAppSelector(selectEditState);
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const selectedAdvertisingNavTitle = useAppSelector(
    selectSelectedAdvertisingNavTitle
  );
  const searchText = useAppSelector(selectSearchText);
  const paginationModel = useAppSelector(selectPaginationModel);
  const sortModel = useAppSelector(selectSortModel);
  const advErrors = useAppSelector(selectAdvertisingErrors);

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<IWalmartSPAdvertisingData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      WalmartSPCampaignLevelTitles.AD_ITEMS,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  const { mutateAsync: editAccessMutateAll } = useAppMutation({
    mutationFn: async (body: IEditAccessWalmartAdItemUpdateBody) => {
      return await walmartEditAccessSPServices.updateWalmartSPAdItem(body);
    },
    options: {
      onSettled: () => {
        setIsEditLoading(false);
        setOpenSaveModal(false);
      },

      onSuccess: (response) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_SP_CAMPAIGN_LVL_PRODUCT_ADS_FETCH],
        });

        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.ADVERTISING_METRICS_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: response.data.message,
            description: response.data.description,
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
              queryKey: [QueryKeyEnums.WMT_SP_CAMPAIGN_LVL_PRODUCT_ADS_FETCH],
            });

            queryClient.invalidateQueries({
              queryKey: [QueryKeyEnums.ADVERTISING_METRICS_FETCH],
            });

            const { adItems } = variables;

            dispatch(
              setAdvertisingErrorDetails({
                errorList: resErrorData.data.errors,
                editedRows: [...(adItems ?? [])],
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

    const updatedWalmartAdItems: IEditAccessWalmartAdItem[] = [];
    const editStateMap = getEditedTableValuesMap(
      updatedValues,
      editState
    ) as Map<string, IWalmartAdItem>;

    for (const [key, value] of updatedValues) {
      const areOtherFieldsUpdated =
        Object.keys(value).includes('bid') ||
        Object.keys(value).includes('status');

      const currentRowData = editStateMap.get(`${key}`);

      if (currentRowData) {
        if (areOtherFieldsUpdated) {
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
          }

          if (value.bid) {
            data.bid = value.bid;
          }

          updatedWalmartAdItems.push(data);
        }
      }
    }

    const updatedWalmartAdItemsBody: IEditAccessWalmartAdItemUpdateBody = {
      adItems: updatedWalmartAdItems,
    };

    await editAccessMutateAll(updatedWalmartAdItemsBody);
  };

  useEffect(() => {
    dispatch(resetEditAccessFilters());

    const selectedTab = getSelectedNavTab(
      updatedPerformanceOptions,
      WalmartSPCampaignLevelTitles.AD_ITEMS
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(
      setSelectedAdvertisingNavTitle(WalmartSPCampaignLevelTitles.AD_ITEMS)
    );
  }, [dispatch, updatedPerformanceOptions]);

  const getCampLevelAdItemsDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      const res = walmartSpAdvertisingServices
        .getAdItems(
          getWalmartAppliedFilters(appliedFilters, isDownload, isAllDownload),
          {
            ...getFilters(isDownload, isAllDownload),
            targetingType: campaignSubHeaderData.targetingType,
          },
          paginationModel.pageIndex + 1,
          paginationModel.pageSize,
          getFormattedSortModel(
            WalmartSPCampaignLevelTitles.AD_ITEMS,
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
      campaignSubHeaderData.targetingType,
    ]
  );

  const fetchProductAds = useAppQuery({
    queryKey: [
      QueryKeyEnums.WMT_SP_CAMPAIGN_LVL_PRODUCT_ADS_FETCH,
      {
        appliedFilters,
        advertisingFiltersWithNoDownload: removeFrequencyFromAdvFilters(
          advertisingFiltersWithNoDownload
        ),
        paginationModel,
        sortModel,
        searchText,
        campaignSubHeaderData,
      },
    ],
    queryFn: () =>
      walmartSpAdvertisingServices.getAdItems(
        getWalmartAppliedFilters(appliedFilters, false, false),
        {
          ...advertisingFiltersWithNoDownload,
          targetingType: campaignSubHeaderData.targetingType,
        },
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        getFormattedSortModel(WalmartSPCampaignLevelTitles.AD_ITEMS, sortModel),
        searchText
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartSPCampaignLevelTitles.AD_ITEMS,
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
      walmartSpAdvertisingServices.getPerformanceGraph(
        getWalmartAppliedFilters(appliedFilters, false, false),
        advertisingFiltersWithNoDownload,
        searchText,
        WalmartAdvertisingTableTypeEnum.AD_ITEM
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartSPCampaignLevelTitles.AD_ITEMS,
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
      walmartSpAdvertisingServices.getPerformanceMetrics(
        getWalmartAppliedFilters(appliedFilters, false, false),
        advertisingFiltersWithNoDownload,
        searchText,
        WalmartAdvertisingTableTypeEnum.AD_ITEM
      ),
    enabled:
      selectedAdvertisingNavTitle === WalmartSPCampaignLevelTitles.AD_ITEMS,
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
        WalmartSPCampaignLevelTitles.AD_ITEMS
      );

      const tempInitialColumns = [..._initialColumns];
      if (
        campaignSubHeaderData &&
        campaignSubHeaderData?.targetingType === TargetingTypeEnum.MANUAL
      ) {
        removeUnwantedColumns(
          tempInitialColumns as Array<ColumnDef<IWalmartSPAdvertisingData>>,
          WALMART_BIDDER_COLUMNS
        );
      }
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        WalmartSPCampaignLevelTitles.AD_ITEMS,
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

      const totalRows = fetchProductAds.data.data.data.pagination.totalItems;
      setTotalRowCount(parseInt(totalRows as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchProductAds.data, dispatch, campaignSubHeaderData]);

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

      const data: Record<string, unknown>[] =
        (await getCampLevelAdItemsDownload(
          true,
          isAllDownload
        )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getCampLevelAdItemsDownload]
  );

  return (
    <AdvertisingRenderingComponents
      campaignId={campaignId}
      selectedLevelType="campaign-level"
      selectedCampaign={campaignSubHeaderData}
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
        campaignSubHeaderData?.campaignName ?? ''
      }_${getFileNameDateTime(advertisingFiltersWithNoDownload)}`}
      performanceNavigationTabOptions={updatedPerformanceOptions}
      isTableLoading={fetchProductAds.isLoading || fetchProductAds.isRefetching}
      initialColumns={initialColumns}
      selectedColumns={selectedColumns}
      handleSelectedColumns={setSelectedColumnsHandler}
      exportFileTitle={genExportFileName('walmart-sp', 'Product Ads')}
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
