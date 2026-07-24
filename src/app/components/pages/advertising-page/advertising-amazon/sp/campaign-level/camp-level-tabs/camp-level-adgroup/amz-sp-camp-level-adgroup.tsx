import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import AdvertisingRenderingComponents from '@/app/components/page-components/advertising-rendering-components/advertising-rendering-components';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  IAdGroup,
  ICampaign,
  IMinMaxDateRange,
  IPerformanceGraphData,
  IPerformanceMetrics,
  ISPAdvertisingData,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  IEditAccessAdGroup,
  IEditAccessAdGroupUpdateBody,
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
  SpCampaignLevelTitles,
} from 'src/enums/advertising.enums';
import {
  IAdvertisingCampLevelSubWrapperProps,
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

export default function AdvertisingCampLevelAdgroup<
  T extends ICampaign | null
>({
  campaignId,
  campaignSubHeaderData,
  isSubHeaderLoading,
  updatedPerformanceOptions,
  getFilters,
  advertisingFiltersWithNoDownload,
}: IAdvertisingCampLevelSubWrapperProps<T>) {
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

  const performanceMetrics = useAppSelector(selectPerformanceMetrics);
  const performanceMetricsOptions = useAppSelector(
    selectPerformanceMetricsOptions
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
    selectedColumns: Array<ColumnDef<ISPAdvertisingData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      SpCampaignLevelTitles.AD_GROUPS,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  const { mutateAsync: editAccessMutateAll } = useAppMutation({
    mutationFn: async (body: IEditAccessAdGroupUpdateBody) =>
      await EditAccessSPServices.updateSPAdGroup(body),

    options: {
      onSuccess: (response) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_SP_CAMPAIGN_LVL_ADGROUPS_FETCH],
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
              queryKey: [QueryKeyEnums.AMZ_SP_CAMPAIGN_LVL_ADGROUPS_FETCH],
            });

            queryClient.invalidateQueries({
              queryKey: [QueryKeyEnums.ADVERTISING_METRICS_FETCH],
            });

            const { adGroups } = variables;

            dispatch(
              setAdvertisingErrorDetails({
                errorList: resErrorData.data.errors,
                editedRows: [...(adGroups ?? [])],
              })
            );
          }
        }
      },

      onSettled: () => {
        setIsEditLoading(false);
        setOpenSaveModal(false);
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

    const updatedAdGroups: IEditAccessAdGroup[] = [];
    const editStateMap = getEditedTableValuesMap(
      updatedValues,
      editState
    ) as Map<string, IAdGroup>;

    for (const [key, value] of updatedValues) {
      const areOtherFieldsUpdated =
        Object.keys(value).includes('adGroupName') ||
        Object.keys(value).includes('defaultBid') ||
        Object.keys(value).includes('status');

      const currentRowData = editStateMap.get(`${key}`);

      if (currentRowData) {
        /* Edit Access for data */
        if (areOtherFieldsUpdated) {
          const data: IEditAccessAdGroup = {
            id: `${key}`,
            adGroupId: `${key}`,
            campaignId: `${currentRowData.campaignId}`,
            entityName: currentRowData.adGroupName || `${key}`,
          };

          if (value.adGroupName) {
            data.name = value.adGroupName;
          }

          if (value.defaultBid) {
            data.defaultBid = value.defaultBid;
          }

          if (value.status) {
            data.state = value.status;
          }

          updatedAdGroups.push(data);
        }
      }
    }

    const updatedAdGroupsBody: IEditAccessAdGroupUpdateBody = {
      adGroups: updatedAdGroups,
    };

    await editAccessMutateAll(updatedAdGroupsBody);
    return;
  };

  useEffect(() => {
    dispatch(resetEditAccessFilters());

    const selectedTab = getSelectedNavTab(
      updatedPerformanceOptions,
      SpCampaignLevelTitles.AD_GROUPS
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(setSelectedAdvertisingNavTitle(SpCampaignLevelTitles.AD_GROUPS));
  }, [dispatch, updatedPerformanceOptions]);

  const getCampLevelAdgroupDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      const res = spAdvertisingServices
        .getAdGroups(
          appliedFilters,
          getFilters(isDownload, !isAllDownload),
          paginationModel.pageIndex + 1,
          paginationModel.pageSize,
          getFormattedSortModel(SpCampaignLevelTitles.AD_GROUPS, sortModel),
          searchText
        )
        .then((res) => {
          let data = res.data?.data.data;
          data = data.map((row) => {
            const id = `${row.adGroupId}`;
            return {
              id,
              ...row,
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
      paginationModel.pageIndex,
      paginationModel.pageSize,
      searchText,
      sortModel,
      dispatch,
      getFilters,
    ]
  );

  const fetchAdGroups = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_SP_CAMPAIGN_LVL_ADGROUPS_FETCH,
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
      spAdvertisingServices.getAdGroups(
        appliedFilters,
        advertisingFiltersWithNoDownload,
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        getFormattedSortModel(SpCampaignLevelTitles.AD_GROUPS, sortModel),
        searchText
      ),
    enabled: selectedAdvertisingNavTitle === SpCampaignLevelTitles.AD_GROUPS,
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
        AmazonAdvertisingTableTypesEnum.AD_GROUP
      ),
    enabled: selectedAdvertisingNavTitle === SpCampaignLevelTitles.AD_GROUPS,
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
        AmazonAdvertisingTableTypesEnum.AD_GROUP
      ),
    enabled: selectedAdvertisingNavTitle === SpCampaignLevelTitles.AD_GROUPS,
  });

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
        };
      });

      const _initialColumns = getInitialColumnsByNavTitle(
        SpCampaignLevelTitles.AD_GROUPS
      );
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        SpCampaignLevelTitles.AD_GROUPS
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
        (await getCampLevelAdgroupDownload(
          true,
          isAllDownload
        )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getCampLevelAdgroupDownload]
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
      chartTitle={`advertising_SP_campaign_${
        campaignSubHeaderData?.campaignName ?? ''
      }_${getFileNameDateTime(advertisingFiltersWithNoDownload)}`}
      performanceNavigationTabOptions={updatedPerformanceOptions}
      isTableLoading={fetchAdGroups.isLoading || fetchAdGroups.isRefetching}
      initialColumns={initialColumns}
      selectedColumns={selectedColumns}
      handleSelectedColumns={setSelectedColumnsHandler}
      exportFileTitle={genExportFileName('amazon-sp', 'Ad Groups')}
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
