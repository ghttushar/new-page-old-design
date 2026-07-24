import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import AdvertisingRenderingComponents from '@/app/components/page-components/advertising-rendering-components/advertising-rendering-components';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  IAdGroup,
  ICampaign,
  IMinMaxDateRange,
  IPerformanceGraphData,
  IPerformanceMetrics,
  IProductAds,
  ISPAdvertisingData,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  IEditAccessAdProduct,
  IEditAccessAdProductUpdateBody,
} from '@/interfaces/edit-access/edit-access.interface';
import {
  IAPIResponse,
  IErrorResultDetails,
} from '@/interfaces/service.interface';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import { EditAccessSPServices } from '@/services/edit-access/amazon-edit-access/amazon-edit-access-sp/amazon-edit-access-sp.service';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';
import {
  AmazonAdvertisingTableTypesEnum,
  SpAdGroupLevelTitles,
} from 'src/enums/advertising.enums';
import {
  IAdvertisingAdGroupLevelSubWrapperProps,
  IEditAccessArrayData,
} from 'src/interfaces/advertising/advertising.interface';
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
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { spAdvertisingServices } from 'src/services/advertising/amazon/sp-advertising.service';
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
  removeFrequencyFromAdvFilters,
} from 'src/utils/advertising.utils';
import columnFilterUtils from 'src/utils/column-filter.utils';

export default function AdvertisingAdgrpLevelProductAds<
  T extends IAdGroup | null,
  K extends ICampaign | null
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
  const performanceMetrics = useAppSelector(selectPerformanceMetrics);
  const performanceMetricsOptions = useAppSelector(
    selectPerformanceMetricsOptions
  );
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
    selectedColumns: Array<ColumnDef<ISPAdvertisingData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      SpAdGroupLevelTitles.PRODUCT_ADS,
      selectedColumns
    );

    setSelectedColumns(selectedColumns);
  };

  const { mutateAsync: editAccessMutate } = useAppMutation({
    mutationFn: (body: IEditAccessAdProductUpdateBody) =>
      EditAccessSPServices.updateSPAdProduct(body),
    options: {
      onSettled: () => {
        setIsEditLoading(false);
        setOpenSaveModal(false);
      },

      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_SP_ADGROUP_LVL_PRODUCT_ADS_FETCH],
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
              queryKey: [QueryKeyEnums.AMZ_SP_ADGROUP_LVL_PRODUCT_ADS_FETCH],
            });

            queryClient.invalidateQueries({
              queryKey: [QueryKeyEnums.ADVERTISING_METRICS_FETCH],
            });

            dispatch(
              setAdvertisingErrorDetails({
                errorList: resErrorData.data.errors,
                editedRows: variables.productAds,
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

    const updatedAdProducts: IEditAccessAdProduct[] = [];
    const editStateMap = getEditedTableValuesMap(
      updatedValues,
      editState
    ) as Map<string, IProductAds>;

    for (const [key, value] of updatedValues) {
      const currentRowData = editStateMap.get(`${key}`);

      if (currentRowData) {
        const data: IEditAccessAdProduct = {
          id: `${key}`,
          adId: `${key}`,
          adGroupId: `${currentRowData.adGroupId}`,
          campaignId: `${currentRowData.campaignId}`,
          entityName: `${currentRowData.itemName || key}`,
        };

        if (value.status) {
          data.state = value.status;
        }

        updatedAdProducts.push(data);
      }
    }

    const body: IEditAccessAdProductUpdateBody = {
      productAds: updatedAdProducts,
    };

    await editAccessMutate(body);
  };

  useEffect(() => {
    dispatch(resetEditAccessFilters());

    const selectedTab = getSelectedNavTab(
      updatedPerformanceOptions,
      SpAdGroupLevelTitles.PRODUCT_ADS
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(setSelectedAdvertisingNavTitle(SpAdGroupLevelTitles.PRODUCT_ADS));
  }, [dispatch, updatedPerformanceOptions]);

  const getAdGroupProductAdsDownload = useCallback(
    (isDownload = false, isAllDownload = false) => {
      const res = spAdvertisingServices
        .getProductAds(
          appliedFilters,
          getFilters(isDownload, !isAllDownload),
          paginationModel.pageIndex + 1,
          paginationModel.pageSize,
          getFormattedSortModel(SpAdGroupLevelTitles.PRODUCT_ADS, sortModel),
          searchText
        )
        .then((res) => {
          let data = res.data?.data.data;
          data = data.map((row) => {
            const id = `${row.adId}`;
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
      paginationModel.pageIndex,
      paginationModel.pageSize,
      searchText,
      sortModel,
      dispatch,
    ]
  );

  const fetchNegProductTargeting = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_SP_ADGROUP_LVL_PRODUCT_ADS_FETCH,
      {
        appliedFilters,
        advertisingFiltersWithNoDownload: removeFrequencyFromAdvFilters(
          advertisingFiltersWithNoDownload
        ),
        paginationModel,
        searchText,
        sortModel,
      },
    ],
    queryFn: () =>
      spAdvertisingServices.getProductAds(
        appliedFilters,
        advertisingFiltersWithNoDownload,
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        getFormattedSortModel(SpAdGroupLevelTitles.PRODUCT_ADS, sortModel),
        searchText
      ),
    enabled: selectedAdvertisingNavTitle === SpAdGroupLevelTitles.PRODUCT_ADS,
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
      spAdvertisingServices.getPerformanceGraph(
        appliedFilters,
        advertisingFiltersWithNoDownload,
        searchText,
        AmazonAdvertisingTableTypesEnum.PRODUCT_ADS
      ),
    enabled: selectedAdvertisingNavTitle === SpAdGroupLevelTitles.PRODUCT_ADS,
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
      spAdvertisingServices.getPerformanceMetrics(
        appliedFilters,
        advertisingFiltersWithNoDownload,
        searchText,
        AmazonAdvertisingTableTypesEnum.PRODUCT_ADS
      ),
    enabled: selectedAdvertisingNavTitle === SpAdGroupLevelTitles.PRODUCT_ADS,
  });

  useEffect(() => {
    setFilteredState([]);
    dispatch(setInitialState([]));
    dispatch(setEditState([]));

    if (fetchNegProductTargeting.data) {
      let data = fetchNegProductTargeting.data.data.data.data;
      data = data.map((row) => {
        const id = `${row.adId}`;
        return {
          id,
          ...row,
        };
      });

      const _initialColumns = getInitialColumnsByNavTitle(
        SpAdGroupLevelTitles.PRODUCT_ADS
      );
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        SpAdGroupLevelTitles.PRODUCT_ADS
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

      const totalRows =
        fetchNegProductTargeting.data.data.data.pagination.totalItems;
      setTotalRowCount(parseInt(totalRows as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchNegProductTargeting.data, dispatch]);

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

      const data: Record<string, unknown>[] =
        (await getAdGroupProductAdsDownload(
          true,
          isAllDownload
        )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getAdGroupProductAdsDownload]
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
      chartTitle={`advertising_SP_campaign_${
        adGroupSubHeaderData?.campaignName ?? ''
      }_adgroup_${
        adGroupSubHeaderData?.adGroupName ?? ''
      }_${getFileNameDateTime(advertisingFiltersWithNoDownload)}`}
      performanceNavigationTabOptions={updatedPerformanceOptions}
      isTableLoading={
        fetchNegProductTargeting.isLoading ||
        fetchNegProductTargeting.isRefetching
      }
      initialColumns={initialColumns}
      selectedColumns={selectedColumns}
      handleSelectedColumns={setSelectedColumnsHandler}
      exportFileTitle={genExportFileName('amazon-sp', 'Product Ads')}
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
