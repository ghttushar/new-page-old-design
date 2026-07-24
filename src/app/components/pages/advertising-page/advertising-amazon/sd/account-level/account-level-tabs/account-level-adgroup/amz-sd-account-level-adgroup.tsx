import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import AdvertisingRenderingComponents from '@/app/components/page-components/advertising-rendering-components/advertising-rendering-components';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  ISDAdGroup,
  ISDAdvertisingData,
} from '@/interfaces/advertising/amazon/sd-advertising.interface';
import {
  IMinMaxDateRange,
  IPerformanceGraphData,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IBidderUpdate } from '@/interfaces/edit-access/bidder.interface';
import {
  IEditAccessAdGroup,
  IEditAccessSDAdGroupUpdateBody,
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
import {
  selectIsShowImpactOn,
  setImpactAnalysisData,
} from '@/redux/slices/impact-analysis/impact-analysis.slice';
import { AnalysisSDService } from '@/services/advertising/impact-analysis/amazon/sd/impact-analysis-sd.service';
import { EditAccessSDServices } from '@/services/edit-access/amazon-edit-access/amazon-edit-access-sd/amazon-edit-access-sd.services';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';
import { sdAccountPerformanceOptions } from 'src/constants/advertising-filter.constants';
import {
  AmazonAdvertisingTableTypesEnum,
  SdAccountLevelTitles,
} from 'src/enums/advertising.enums';
import { IEditAccessArrayData } from 'src/interfaces/advertising/advertising.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
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
  selectSDPerformanceMetrics,
  selectSDPerformanceMetricsOptions,
  setSDPerformanceMetrics,
} from 'src/redux/slices/advertising/advertising-sd-filter.slice';
import { selectAppliedFilters } from 'src/redux/slices/filters/filter.slice';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import {
  sdAdvertisingAccountLevelServices,
  sdAdvertisingServices,
} from 'src/services/advertising/amazon/sd-advertising.service';
import { genExportFileName, getFileNameDateTime } from 'src/utils';
import {
  getFormattedSortModel,
  getInitialColumnsByNavTitle,
} from 'src/utils/advertising-columns.utils';
import {
  getAmazonAdvertisingFilters,
  getComparisonDetails,
  getEditedTableValuesMap,
  getErrorEditState,
  getSelectedNavTab,
  removeFrequencyFromAdvFilters,
} from 'src/utils/advertising.utils';
import columnFilterUtils from 'src/utils/column-filter.utils';

export default function AdvertisingSDAccountLevelAdGroup() {
  const [advertisingSDMetricsData, setAdvertisingSDMetricsData] =
    useState<IPerformanceMetrics | null>(null);
  const [advertisingSDGraphData, setAdvertisingSDGraphData] = useState<
    IPerformanceGraphData[]
  >([]);
  const [minMaxDates, setMinMaxDates] = useState<IMinMaxDateRange[]>([]);
  const [initialColumns, setInitialColumns] = useState<
    Array<ColumnDef<ISDAdvertisingData>>
  >([]);
  const [selectedColumns, setSelectedColumns] = useState<
    Array<ColumnDef<ISDAdvertisingData>>
  >([]);
  const [filteredState, setFilteredState] = useState<IEditAccessArrayData>([]);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);
  const [isEditLoading, setIsEditLoading] = useState<boolean>(false);
  const [openSaveModal, setOpenSaveModal] = useState<boolean>(false);

  const appliedAdvertisingFilters = useAppSelector(
    selectAdvertisingAppliedFilter
  );
  const isShowImpactOn = useAppSelector(selectIsShowImpactOn);
  const SDPerformanceMetrics = useAppSelector(selectSDPerformanceMetrics);
  const SDPerformanceMetricsOptions = useAppSelector(
    selectSDPerformanceMetricsOptions
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

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<ISDAdvertisingData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      SdAccountLevelTitles.AD_GROUP,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  const { mutateAsync: editAccessMutateAll } = useAppMutation({
    mutationFn: async (body: IEditAccessSDAdGroupUpdateBody) => {
      return await EditAccessSDServices.updateSDAdGroup(body);
    },
    options: {
      onSettled: () => {
        setIsEditLoading(false);
        setOpenSaveModal(false);
      },
      onSuccess: (response) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_SD_ACCOUNT_LVL_ADGROUPS_FETCH],
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
              queryKey: [QueryKeyEnums.AMZ_SD_ACCOUNT_LVL_ADGROUPS_FETCH],
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
    const updatedBidders: IBidderUpdate[] = [];
    const editStateMap = getEditedTableValuesMap(
      updatedValues,
      editState
    ) as Map<string, ISDAdGroup>;

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

          if (value.defaultBid !== null && value.defaultBid !== undefined) {
            data.defaultBid = value.defaultBid;
          }

          if (value.status) {
            data.state = value.status;
          }

          updatedAdGroups.push(data);
        }
      }
    }

    const updatedAdGroupsBody: IEditAccessSDAdGroupUpdateBody = {
      adGroups: updatedAdGroups,
    };
    await editAccessMutateAll(updatedAdGroupsBody);
  };

  useEffect(() => {
    dispatch(resetEditAccessFilters());

    const selectedTab = getSelectedNavTab(
      sdAccountPerformanceOptions,
      SdAccountLevelTitles.AD_GROUP
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(setSelectedAdvertisingNavTitle(SdAccountLevelTitles.AD_GROUP));
  }, [dispatch]);

  const getSDAdGroupsDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      const res = sdAdvertisingAccountLevelServices
        .getSDAdGroups(
          appliedFilters,
          getAmazonAdvertisingFilters(
            appliedAdvertisingFilters,
            appliedAdvertisingFilters.customDateRange,
            isDownload,
            !isAllDownload
          ),
          paginationModel.pageIndex + 1,
          paginationModel.pageSize,
          getFormattedSortModel(SdAccountLevelTitles.AD_GROUP, sortModel),
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
      appliedAdvertisingFilters,
      appliedFilters,
      dispatch,
      paginationModel.pageIndex,
      paginationModel.pageSize,
      searchText,
      sortModel,
    ]
  );

  const fetchAdGroups = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_SD_ACCOUNT_LVL_ADGROUPS_FETCH,
      {
        appliedFilters,
        appliedAdvertisingFilters: removeFrequencyFromAdvFilters(
          appliedAdvertisingFilters
        ),
        paginationModel,
        searchText,
        sortModel,
      },
    ],
    queryFn: () =>
      sdAdvertisingAccountLevelServices.getSDAdGroups(
        appliedFilters,
        getAmazonAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange,
          false,
          false
        ),
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        getFormattedSortModel(SdAccountLevelTitles.AD_GROUP, sortModel),
        searchText
      ),
    enabled: selectedAdvertisingNavTitle === SdAccountLevelTitles.AD_GROUP,
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
      sdAdvertisingServices.getSDPerformanceGraph(
        appliedFilters,
        getAmazonAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange,
          false,
          false
        ),
        searchText,
        AmazonAdvertisingTableTypesEnum.AD_GROUP
      ),
    enabled: selectedAdvertisingNavTitle === SdAccountLevelTitles.AD_GROUP,
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
      sdAdvertisingServices.getSDPerformanceMetrics(
        appliedFilters,
        getAmazonAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange,
          false,
          false
        ),
        searchText,
        AmazonAdvertisingTableTypesEnum.AD_GROUP
      ),
    enabled: selectedAdvertisingNavTitle === SdAccountLevelTitles.AD_GROUP,
  });
  const fetchImpactAnalysis = useAppQuery({
    queryKey: [
      QueryKeyEnums.IMPACT_ANALYSIS_FETCH,

      {
        appliedAdvertisingFilters,
      },
    ],

    queryFn: () =>
      AnalysisSDService.getImpactAnalysis(
        getAmazonAdvertisingFilters(
          appliedAdvertisingFilters,

          appliedAdvertisingFilters.customDateRange
        ),

        AmazonAdvertisingTableTypesEnum.AD_GROUP
      ),
  });

  useEffect(() => {
    if (fetchImpactAnalysis.data) {
      dispatch(
        setImpactAnalysisData({
          data: fetchImpactAnalysis.data.data.data,

          table: AmazonAdvertisingTableTypesEnum.AD_GROUP,
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

    if (fetchAdGroups.data) {
      let data = fetchAdGroups.data.data?.data.data;
      data = data.map((row) => {
        const id = `${row.adGroupId}`;
        return {
          id,
          ...row,
        };
      });

      const _initialColumns = getInitialColumnsByNavTitle(
        SdAccountLevelTitles.AD_GROUP
      );
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        SdAccountLevelTitles.AD_GROUP
      );
      setInitialColumns(
        _initialColumns as Array<ColumnDef<ISDAdvertisingData>>
      );
      setSelectedColumns(
        filteredColumns as Array<ColumnDef<ISDAdvertisingData>>
      );

      dispatch(setInitialState(data as ISDAdvertisingData[]));
      const updatedData = getErrorEditState(
        data,
        advErrors
      ) as ISDAdvertisingData[];
      setFilteredState(updatedData);
      dispatch(setEditState(updatedData));
      dispatch(setAdvertisingErrorDetails(null));

      const totalRows = fetchAdGroups.data.data.data.pagination.totalItems;
      setTotalRowCount(parseInt(totalRows as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAdGroups.data, dispatch]);

  useEffect(() => {
    setAdvertisingSDGraphData([]);
    setMinMaxDates([]);

    if (fetchPerformanceGraph.data) {
      setAdvertisingSDGraphData(
        fetchPerformanceGraph.data.data.data?.graphData ?? []
      );
      setMinMaxDates(fetchPerformanceGraph.data.data.data?.maxMinDate);
    }
  }, [fetchPerformanceGraph.data]);

  useEffect(() => {
    setAdvertisingSDMetricsData(null);

    if (fetchPerformanceMetrics.data) {
      setAdvertisingSDMetricsData(fetchPerformanceMetrics.data.data.data);
    }
  }, [fetchPerformanceMetrics.data]);

  const handlePerformanceMetricsChange = (metricsValue: {
    value: IDropdownItem<string>;
    key: TPerformanceMetricsKey;
  }) => {
    dispatch(setSDPerformanceMetrics(metricsValue));
  };

  const handleDownload = useCallback(
    async (isAllDownload: boolean) => {
      dispatch(
        showSuccessToastMessage({
          title: 'Download Started',
          description: 'This may take a few seconds.',
        })
      );

      const data: Record<string, unknown>[] = (await getSDAdGroupsDownload(
        true,
        isAllDownload
      )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getSDAdGroupsDownload]
  );

  return (
    <AdvertisingRenderingComponents
      advertisingMetricsData={advertisingSDMetricsData}
      performanceFilters={getAmazonAdvertisingFilters(
        appliedAdvertisingFilters,
        appliedAdvertisingFilters.customDateRange
      )}
      isMetricsLoading={
        fetchPerformanceMetrics.isLoading ||
        fetchPerformanceMetrics.isRefetching
      }
      performanceSelectedMetrics={SDPerformanceMetrics}
      performanceMetricsOptions={SDPerformanceMetricsOptions}
      performanceGraphData={advertisingSDGraphData}
      handlePerformanceMetricsChange={handlePerformanceMetricsChange}
      minMaxDates={minMaxDates ? minMaxDates[0] : null}
      isGraphLoading={
        fetchPerformanceGraph.isLoading || fetchPerformanceGraph.isRefetching
      }
      isImpactLoading={
        fetchImpactAnalysis.isLoading || fetchImpactAnalysis.isRefetching
      }
      chartTitle={`advertising_SD_${getFileNameDateTime(
        getAmazonAdvertisingFilters(
          appliedAdvertisingFilters,
          appliedAdvertisingFilters.customDateRange
        )
      )}`}
      performanceNavigationTabOptions={sdAccountPerformanceOptions}
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
