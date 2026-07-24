import DialogBoxSideDrawer from '@/app/components/common/dialog-box-side-drawer/dialog-box-side-drawer';
import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import AdvertisingRenderingComponents from '@/app/components/page-components/advertising-rendering-components/advertising-rendering-components';
import CreativeDialogBody from '@/app/components/page-components/creative-dialog-body/creative-dialog-body';
import { creativeTopOfSearchOptions } from '@/constants/advertising-filter.constants';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  ISBAdGroup,
  ISBAdvertisingData,
  ISBCampaign,
  ISBProductAds,
} from '@/interfaces/advertising/amazon/sb-advertising.interface';
import {
  IMinMaxDateRange,
  IPerformanceGraphData,
  IPerformanceMetrics,
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
import { EditAccessSBServices } from '@/services/edit-access/amazon-edit-access/amazon-edit-access-sb/amazon-edit-access-sb.services';
import {
  getComparisonDetails,
  getEditedTableValuesMap,
  getErrorEditState,
  getSelectedNavTab,
  removeFrequencyFromAdvFilters,
} from '@/utils/advertising.utils';
import IconButton from '@mui/material/IconButton';
import { XIcon } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useEffect, useState } from 'react';
import {
  AmazonAdvertisingTableTypesEnum,
  SbAdGroupLevelTitles,
} from 'src/enums/advertising.enums';
import {
  IAdvertisingAdGroupLevelSubWrapperProps,
  IEditAccessArrayData,
} from 'src/interfaces/advertising/advertising.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
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
  selectCreativeAssetIds,
  selectOpenCreativeDialog,
  selectSBPerformanceMetrics,
  selectSBPerformanceMetricsOptions,
  setOpenCreativeDialog,
  setSBPerformanceMetrics,
} from 'src/redux/slices/advertising/advertising-sb-filter.slice';
import { selectAppliedFilters } from 'src/redux/slices/filters/filter.slice';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import {
  sbAdvertisingAdGroupLevelServices,
  sbAdvertisingServices,
} from 'src/services/advertising/amazon/sb-advertising.service';
import { genExportFileName, getFileNameDateTime } from 'src/utils';
import {
  getFormattedSortModel,
  getInitialColumnsByNavTitle,
} from 'src/utils/advertising-columns.utils';
import columnFilterUtils from 'src/utils/column-filter.utils';

export default function AdvertisingSBAdGroupLevelProductAds<
  T extends ISBAdGroup | null,
  K extends ISBCampaign | null
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
  const [selectedCreativeOption, setSelectedCreativeOption] = useState<
    IDropdownItem<string>
  >(creativeTopOfSearchOptions[0]);
  const [selectedVersion, setSelectedVersion] = useState<string>('');

  const SBPerformanceMetrics = useAppSelector(selectSBPerformanceMetrics);
  const SBPerformanceMetricsOptions = useAppSelector(
    selectSBPerformanceMetricsOptions
  );
  const selectedAdvertisingNavTitle = useAppSelector(
    selectSelectedAdvertisingNavTitle
  );
  const openCreativeDialog = useAppSelector(selectOpenCreativeDialog);
  const creativeAssetIds = useAppSelector(selectCreativeAssetIds);
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

  const handleSetSelectedCreativeOption = (value: IDropdownItem<string>) =>
    setSelectedCreativeOption(value);

  const handleVersionSelect = (value: string) => setSelectedVersion(value);

  const handleCloseDialog = useCallback(() => {
    dispatch(setOpenCreativeDialog(false));
  }, [dispatch]);

  const creativeDropdownOptions = [
    {
      selected: selectedCreativeOption,
      onSelect: handleSetSelectedCreativeOption,
      label: '',
      options: creativeTopOfSearchOptions,
    },
  ];

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<ISBAdvertisingData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      SbAdGroupLevelTitles.PRODUCT_ADS,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  const { mutateAsync: editAccessMutate } = useAppMutation({
    mutationFn: (body: IEditAccessAdProductUpdateBody) =>
      EditAccessSBServices.updateSBProductAd(body),
    options: {
      onSettled: () => {
        setIsEditLoading(false);
        setOpenSaveModal(false);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_SB_ADGROUP_LVL_PRODUCT_ADS_FETCH],
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
              queryKey: [QueryKeyEnums.AMZ_SB_ADGROUP_LVL_PRODUCT_ADS_FETCH],
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
    ) as Map<string, ISBProductAds>;

    for (const [key, value] of updatedValues) {
      const currentRowData = editStateMap.get(`${key}`);

      if (currentRowData) {
        const data: IEditAccessAdProduct = {
          id: `${key}`,
          adId: `${key}`,
          adGroupId: `${currentRowData.adGroupId}`,
          campaignId: `${currentRowData.campaignId}`,
          entityName: `${currentRowData.name || key}`,
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
      SbAdGroupLevelTitles.PRODUCT_ADS
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(setSelectedAdvertisingNavTitle(SbAdGroupLevelTitles.PRODUCT_ADS));
  }, [dispatch, updatedPerformanceOptions]);

  const getSBProductAdsDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      const res = sbAdvertisingAdGroupLevelServices
        .getSBProductAds(
          appliedFilters,
          getFilters(isDownload, !isAllDownload),
          paginationModel.pageIndex + 1,
          paginationModel.pageSize,
          getFormattedSortModel(SbAdGroupLevelTitles.PRODUCT_ADS, sortModel),
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
              description: 'Product ads data downloaded successfully.',
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
      QueryKeyEnums.AMZ_SB_ADGROUP_LVL_PRODUCT_ADS_FETCH,
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
      sbAdvertisingAdGroupLevelServices.getSBProductAds(
        appliedFilters,
        advertisingFiltersWithNoDownload,
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        getFormattedSortModel(SbAdGroupLevelTitles.PRODUCT_ADS, sortModel),
        searchText
      ),
    enabled: selectedAdvertisingNavTitle === SbAdGroupLevelTitles.PRODUCT_ADS,
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
      sbAdvertisingServices.getSBPerformanceGraph(
        appliedFilters,
        advertisingFiltersWithNoDownload,
        searchText,
        AmazonAdvertisingTableTypesEnum.PRODUCT_ADS
      ),
    enabled: selectedAdvertisingNavTitle === SbAdGroupLevelTitles.PRODUCT_ADS,
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
      sbAdvertisingServices.getSBPerformanceMetrics(
        appliedFilters,
        advertisingFiltersWithNoDownload,
        searchText,
        AmazonAdvertisingTableTypesEnum.PRODUCT_ADS
      ),
    enabled: selectedAdvertisingNavTitle === SbAdGroupLevelTitles.PRODUCT_ADS,
  });

  useEffect(() => {
    setFilteredState([]);
    dispatch(setInitialState([]));
    dispatch(setEditState([]));

    if (fetchProductAds.data) {
      let data = fetchProductAds.data.data.data.data;
      data = data.map((row) => {
        const id = `${row.adId}`;
        return {
          id,
          ...row,
        };
      });

      const _initialColumns = getInitialColumnsByNavTitle(
        SbAdGroupLevelTitles.PRODUCT_ADS
      );
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        SbAdGroupLevelTitles.PRODUCT_ADS
      );
      setInitialColumns(
        _initialColumns as Array<ColumnDef<ISBAdvertisingData>>
      );
      setSelectedColumns(
        filteredColumns as Array<ColumnDef<ISBAdvertisingData>>
      );

      dispatch(setInitialState(data));
      const updatedData = getErrorEditState(
        data,
        advErrors
      ) as ISBAdvertisingData[];
      setFilteredState(updatedData);
      dispatch(setEditState(updatedData));
      dispatch(setAdvertisingErrorDetails(null));

      const totalRows = fetchProductAds.data.data.data.pagination.totalItems;
      setTotalRowCount(parseInt(totalRows as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchProductAds.data, dispatch]);

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

      const data: Record<string, unknown>[] = (await getSBProductAdsDownload(
        true,
        isAllDownload
      )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getSBProductAdsDownload]
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
        advertisingMetricsData={advertisingSBMetricsData}
        performanceFilters={advertisingFiltersWithNoDownload}
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
        chartTitle={`advertising_SB_campaign_${
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
        exportFileTitle={genExportFileName('amazon-sb', 'Product Ads')}
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

      {openCreativeDialog && (
        <DialogBoxSideDrawer
          openDialog={openCreativeDialog}
          handleCloseDialog={handleCloseDialog}
          title="Video Ad"
          headerChildren={
            <IconButton
              disableRipple
              sx={{ p: '0 0 0 0' }}
              onClick={handleCloseDialog}
            >
              <XIcon size={20} color="#a3a3a3" weight="bold" />
            </IconButton>
          }
          bodyChildren={
            <CreativeDialogBody
              creativeAssetIds={creativeAssetIds}
              dropdownOptions={creativeDropdownOptions}
              handleVersionSelect={handleVersionSelect}
              selectedDropdownOption={selectedCreativeOption}
              selectedVersion={selectedVersion}
            />
          }
        />
      )}
    </React.Fragment>
  );
}
