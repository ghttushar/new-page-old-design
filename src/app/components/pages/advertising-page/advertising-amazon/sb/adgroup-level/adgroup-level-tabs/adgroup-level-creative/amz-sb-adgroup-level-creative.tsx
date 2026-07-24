import DialogBoxSideDrawer from '@/app/components/common/dialog-box-side-drawer/dialog-box-side-drawer';
import AdvertisingRenderingComponents from '@/app/components/page-components/advertising-rendering-components/advertising-rendering-components';
import CreativeDialogBody from '@/app/components/page-components/creative-dialog-body/creative-dialog-body';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  ISBAdGroup,
  ISBAdvertisingData,
  ISBCampaign,
} from '@/interfaces/advertising/amazon/sb-advertising.interface';
import {
  IMinMaxDateRange,
  IPerformanceGraphData,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useAppQuery } from '@/redux/react-query-hooks';
import {
  resetEditAccessFilters,
  selectAdvertisingErrors,
  setAdvertisingErrorDetails,
  setEditState,
  setInitialState,
} from '@/redux/slices/advertising/advertising-edit-access.slice';
import {
  getErrorEditState,
  getSelectedNavTab,
  removeFrequencyFromAdvFilters,
} from '@/utils/advertising.utils';
import { IconButton } from '@mui/material';
import { XIcon } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useEffect, useState } from 'react';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { creativeTopOfSearchOptions } from 'src/constants/advertising-filter.constants';
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
  getFormattedSortModelNoMetrics,
  getInitialColumnsByNavTitle,
} from 'src/utils/advertising-columns.utils';
import columnFilterUtils from 'src/utils/column-filter.utils';

export default function AdvertisingSBAdGroupLevelCreative<
  T extends ISBAdGroup | null,
  K extends ISBCampaign
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
  const [selectedCreativeOption, setSelectedCreativeOption] = useState<
    IDropdownItem<string>
  >(creativeTopOfSearchOptions[0]);
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [totalRowCount, setTotalRowCount] = useState<number>(0);

  const SBPerformanceMetrics = useAppSelector(selectSBPerformanceMetrics);
  const SBPerformanceMetricsOptions = useAppSelector(
    selectSBPerformanceMetricsOptions
  );
  const openCreativeDialog = useAppSelector(selectOpenCreativeDialog);
  const creativeAssetIds = useAppSelector(selectCreativeAssetIds);
  const selectedAdvertisingNavTitle = useAppSelector(
    selectSelectedAdvertisingNavTitle
  );
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const searchText = useAppSelector(selectSearchText);
  const paginationModel = useAppSelector(selectPaginationModel);
  const sortModel = useAppSelector(selectSortModel);
  const advErrors = useAppSelector(selectAdvertisingErrors);

  const dispatch = useAppDispatch();

  const handleSetSelectedCreativeOption = (value: IDropdownItem<string>) =>
    setSelectedCreativeOption(value);

  const handleVersionSelect = (value: string) => setSelectedVersion(value);

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<ISBAdvertisingData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      SbAdGroupLevelTitles.CREATIVE,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  useEffect(() => {
    dispatch(resetEditAccessFilters());

    const selectedTab = getSelectedNavTab(
      updatedPerformanceOptions,
      SbAdGroupLevelTitles.CREATIVE
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(setSelectedAdvertisingNavTitle(SbAdGroupLevelTitles.CREATIVE));
  }, [dispatch, updatedPerformanceOptions]);

  const getSBCreativeDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      const res = sbAdvertisingAdGroupLevelServices
        .getSBCreative(
          appliedFilters,
          getFilters(isDownload, !isAllDownload),
          paginationModel.pageIndex + 1,
          paginationModel.pageSize,
          getFormattedSortModelNoMetrics(
            SbAdGroupLevelTitles.CREATIVE,
            sortModel
          ),
          searchText
        )
        .then((res) => {
          let data = res.data?.data.data;
          let id = 0;
          data = data.map((row) => {
            id += 1;
            return {
              id,
              ...row,
            };
          });

          dispatch(
            showSuccessToastMessage({
              title: 'Downloaded Successfully',
              description: 'Creative data downloaded successfully.',
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

  const fetchCreative = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_SB_ADGROUP_LVL_CREATIVE_FETCH,
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
      sbAdvertisingAdGroupLevelServices.getSBCreative(
        appliedFilters,
        advertisingFiltersWithNoDownload,
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        getFormattedSortModelNoMetrics(
          SbAdGroupLevelTitles.CREATIVE,
          sortModel
        ),
        searchText
      ),
    enabled: selectedAdvertisingNavTitle === SbAdGroupLevelTitles.CREATIVE,
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
        AmazonAdvertisingTableTypesEnum.CREATIVE_PRODUCT
      ),
    enabled: selectedAdvertisingNavTitle === SbAdGroupLevelTitles.CREATIVE,
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
        AmazonAdvertisingTableTypesEnum.CREATIVE_PRODUCT
      ),
    enabled: selectedAdvertisingNavTitle === SbAdGroupLevelTitles.CREATIVE,
  });

  useEffect(() => {
    setFilteredState([]);
    dispatch(setInitialState([]));
    dispatch(setEditState([]));

    if (fetchCreative.data) {
      let data = fetchCreative.data.data.data.data;
      let id = 0;
      data = data.map((row) => {
        id += 1;
        return {
          id,
          ...row,
        };
      });

      const _initialColumns = getInitialColumnsByNavTitle(
        SbAdGroupLevelTitles.CREATIVE
      );
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        SbAdGroupLevelTitles.CREATIVE
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

      const totalRows = fetchCreative.data.data.data.pagination.totalItems;
      setTotalRowCount(parseInt(totalRows as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCreative.data, dispatch]);

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

      const data: Record<string, unknown>[] = (await getSBCreativeDownload(
        true,
        isAllDownload
      )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getSBCreativeDownload]
  );

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
        handlePerformanceMetricsChange={handlePerformanceMetricsChange}
        performanceGraphData={advertisingSBGraphData}
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
        isTableLoading={fetchCreative.isLoading || fetchCreative.isRefetching}
        initialColumns={initialColumns}
        selectedColumns={selectedColumns}
        handleSelectedColumns={setSelectedColumnsHandler}
        exportFileTitle={genExportFileName('amazon-sb', 'Creative')}
        filteredTableData={filteredState}
        totalRowCount={totalRowCount}
        setTotalRowCount={setTotalRowCount}
        setFilteredTableData={setFilteredState}
        handleDownload={handleDownload}
        handleEditSaveClick={() => {
          return;
        }}
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
