import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import AdvertisingRenderingComponents from '@/app/components/page-components/advertising-rendering-components/advertising-rendering-components';
import { WalmartSPCampaignLevelTitles } from '@/enums/advertising.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  IAdvertisingCampLevelSubWrapperProps,
  IEditAccessArrayData,
} from '@/interfaces/advertising/advertising.interface';
import {
  IWalmartCampaign,
  IWalmartSPAdvertisingData,
  IWalmartSPAutomationRules,
} from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import {
  IEditAccessAutomationRules,
  IEditAccessAutomationRulesUpdateBody,
} from '@/interfaces/edit-access/edit-access.interface';
import {
  IAPIResponse,
  IErrorResultDetails,
} from '@/interfaces/service.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
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
  selectPaginationModel,
  selectSearchText,
  selectSelectedAdvertisingNavTitle,
  selectSortModel,
  setSelectedAdvertisingNavTab,
  setSelectedAdvertisingNavTitle,
  TPerformanceMetricsKey,
} from '@/redux/slices/advertising/advertising-filter.slice';
import {
  selectWalmartSPPerformanceMetrics,
  selectWalmartSPPerformanceMetricsOptions,
  setWalmartSPPerformanceMetrics,
} from '@/redux/slices/advertising/walmart/advertising-walmart-sp.slice';
import { selectAppliedFilters } from '@/redux/slices/filters/filter.slice';
import { showSuccessToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import { walmartSpAdvertisingServices } from '@/services/advertising/walmart/walmart-sp-advertising.service';
import { walmartEditAccessSPServices } from '@/services/edit-access/walmart-edit-access/walmart-edit-access-sp/walmart-edit-access-sp.service';
import { genExportFileName, getFileNameDateTime } from '@/utils';
import {
  getFormattedSortModel,
  getInitialColumnsByNavTitle,
} from '@/utils/advertising-columns.utils';
import {
  getComparisonDetails,
  getEditedTableValuesMap,
  getErrorEditState,
  getSelectedNavTab,
  getWalmartAppliedFilters,
  removeFrequencyFromAdvFilters,
} from '@/utils/advertising.utils';
import columnFilterUtils from '@/utils/column-filter.utils';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';

export default function AdvertisingWalmartSPCampLevelAutomationRules<
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
  const [openSaveModal, setOpenSaveModal] = useState<boolean>(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);

  const performanceMetrics = useAppSelector(selectWalmartSPPerformanceMetrics);
  const performanceMetricsOptions = useAppSelector(
    selectWalmartSPPerformanceMetricsOptions
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
    selectedColumns: Array<ColumnDef<IWalmartSPAdvertisingData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      WalmartSPCampaignLevelTitles.AUTOMATION_RULES,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  const { mutateAsync: editAccessMutate } = useAppMutation({
    mutationFn: async (body: IEditAccessAutomationRulesUpdateBody) => {
      return await walmartEditAccessSPServices.updateWalmartSPAutomationRules(
        body
      );
    },
    options: {
      onSettled: () => {
        setIsEditLoading(false);
        setOpenSaveModal(false);
      },
      onSuccess: (response) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_SP_CAMPAIGN_LVL_AUTOMATION_RULES_FETCH],
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
              queryKey: [
                QueryKeyEnums.WMT_SP_CAMPAIGN_LVL_AUTOMATION_RULES_FETCH,
              ],
            });

            const { automation } = variables;

            dispatch(
              setAdvertisingErrorDetails({
                errorList: resErrorData.data.errors,
                editedRows: [...(automation ?? [])],
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

    const updatedAutomationRules: IEditAccessAutomationRules[] = [];
    const editStateMap = getEditedTableValuesMap(
      updatedValues,
      editState
    ) as Map<string, IWalmartSPAutomationRules>;

    for (const [key, value] of updatedValues) {
      const currentRowData = editStateMap.get(`${key}`);

      if (currentRowData) {
        const data: IEditAccessAutomationRules = {
          id: `${key}`,
          ruleId: `${key}`,
          campaignId: `${campaignId}`,
        };

        if (value.ruleEntityLinkStatus) {
          data.status = value.ruleEntityLinkStatus;
        }

        updatedAutomationRules.push(data);
      }
    }

    const body: IEditAccessAutomationRulesUpdateBody = {
      automation: updatedAutomationRules,
    };

    await editAccessMutate(body);
  };

  useEffect(() => {
    dispatch(resetEditAccessFilters());

    const selectedTab = getSelectedNavTab(
      updatedPerformanceOptions,
      WalmartSPCampaignLevelTitles.AUTOMATION_RULES
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(
      setSelectedAdvertisingNavTitle(
        WalmartSPCampaignLevelTitles.AUTOMATION_RULES
      )
    );
  }, [dispatch, updatedPerformanceOptions]);

  const getCampLevelAutomationRulesDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      const res = walmartSpAdvertisingServices
        .getCampaignAutomationRules(
          getWalmartAppliedFilters(appliedFilters, isDownload, isAllDownload),
          getFilters(isDownload, isAllDownload),
          paginationModel.pageIndex + 1,
          paginationModel.pageSize,
          getFormattedSortModel(
            WalmartSPCampaignLevelTitles.AUTOMATION_RULES,
            sortModel
          ),
          searchText
        )
        .then((res) => {
          let data = res.data?.data.data;
          data = data.map((row) => ({
            ...row,
            id: `${row.ruleId}`,
          }));

          dispatch(
            showSuccessToastMessage({
              title: 'Downloaded Successfully',
              description: 'Campaign Rules downloaded successfully.',
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

  const fetchAutomationRules = useAppQuery({
    queryKey: [
      QueryKeyEnums.WMT_SP_CAMPAIGN_LVL_AUTOMATION_RULES_FETCH,
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
      walmartSpAdvertisingServices.getCampaignAutomationRules(
        getWalmartAppliedFilters(appliedFilters, false, false),
        advertisingFiltersWithNoDownload,
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        getFormattedSortModel(
          WalmartSPCampaignLevelTitles.AUTOMATION_RULES,
          sortModel
        ),
        searchText
      ),
    enabled:
      selectedAdvertisingNavTitle ===
      WalmartSPCampaignLevelTitles.AUTOMATION_RULES,
  });

  useEffect(() => {
    setFilteredState([]);
    dispatch(setInitialState([]));
    dispatch(setEditState([]));

    if (fetchAutomationRules.data) {
      let data = fetchAutomationRules.data?.data?.data?.data ?? [];
      data = data.map((row) => ({
        ...row,
        id: `${row.ruleId}`,
      }));

      const _initialColumns = getInitialColumnsByNavTitle(
        WalmartSPCampaignLevelTitles.AUTOMATION_RULES,
        campaignSubHeaderData
      );
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        WalmartSPCampaignLevelTitles.AUTOMATION_RULES,
        _initialColumns as Array<ColumnDef<IWalmartSPAdvertisingData>>
      );
      setInitialColumns(
        _initialColumns as Array<ColumnDef<IWalmartSPAdvertisingData>>
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

      const totalRows =
        fetchAutomationRules.data.data.data?.pagination?.totalItems ?? 0;
      setTotalRowCount(parseInt(totalRows as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAutomationRules.data, dispatch]);

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
        (await getCampLevelAutomationRulesDownload(
          true,
          isAllDownload
        )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getCampLevelAutomationRulesDownload]
  );

  return (
    <AdvertisingRenderingComponents
      campaignId={campaignId}
      selectedLevelType="campaign-level"
      selectedCampaign={campaignSubHeaderData}
      isSubHeaderLoading={isSubHeaderLoading}
      advertisingMetricsData={null}
      performanceFilters={advertisingFiltersWithNoDownload}
      isMetricsLoading={false}
      performanceSelectedMetrics={performanceMetrics}
      performanceMetricsOptions={performanceMetricsOptions}
      handlePerformanceMetricsChange={handlePerformanceMetricsChange}
      performanceGraphData={[]}
      minMaxDates={null}
      isGraphLoading={false}
      chartTitle={`walmart_advertising_SP_campaign_${
        campaignSubHeaderData?.campaignName ?? ''
      }_${getFileNameDateTime(advertisingFiltersWithNoDownload)}`}
      performanceNavigationTabOptions={updatedPerformanceOptions}
      isTableLoading={
        fetchAutomationRules.isLoading || fetchAutomationRules.isRefetching
      }
      initialColumns={initialColumns}
      selectedColumns={selectedColumns}
      handleSelectedColumns={setSelectedColumnsHandler}
      exportFileTitle={genExportFileName('walmart-sp', 'Campaign Rules')}
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
