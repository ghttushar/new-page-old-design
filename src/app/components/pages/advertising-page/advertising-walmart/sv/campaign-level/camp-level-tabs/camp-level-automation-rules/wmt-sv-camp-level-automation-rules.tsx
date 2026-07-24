import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import AdvertisingRenderingComponents from '@/app/components/page-components/advertising-rendering-components/advertising-rendering-components';
import { WalmartSVCampaignLevelTitles } from '@/enums/advertising.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  IAdvertisingCampLevelSubWrapperProps,
  IEditAccessArrayData,
} from '@/interfaces/advertising/advertising.interface';
import { IWalmartCampaign } from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import {
  IWalmartSVAdvertisingData,
  IWalmartSVAutomationRules,
} from '@/interfaces/advertising/walmart/walmart-sv-advertising.interface';
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
  selectWalmartSvPerformanceMetrics,
  selectWalmartSvPerformanceMetricsOptions,
  setWalmartSVPerformanceMetrics,
} from '@/redux/slices/advertising/walmart/advertising-walmart-sv.slice';
import { selectAppliedFilters } from '@/redux/slices/filters/filter.slice';
import { showSuccessToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import { walmartSvAdvertisingServices } from '@/services/advertising/walmart/walmart-sv-advertising.service';
import { walmartEditAccessSVServices } from '@/services/edit-access/walmart-edit-access/walmart-edit-access-sv/walmart-edit-access-sv.service';
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

export default function AdvertisingWalmartSVCampLevelAutomationRules<
  T extends IWalmartCampaign | null
>({
  campaignId,
  campaignSubHeaderData,
  isSubHeaderLoading,
  updatedPerformanceOptions,
  getFilters,
  advertisingFiltersWithNoDownload,
}: IAdvertisingCampLevelSubWrapperProps<T>) {
  const [initialColumns, setInitialColumns] = useState<
    Array<ColumnDef<IWalmartSVAdvertisingData>>
  >([]);
  const [selectedColumns, setSelectedColumns] = useState<
    Array<ColumnDef<IWalmartSVAdvertisingData>>
  >([]);
  const [filteredState, setFilteredState] = useState<IEditAccessArrayData>([]);
  const [openSaveModal, setOpenSaveModal] = useState<boolean>(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);

  const walmartSVPerformanceMetrics = useAppSelector(
    selectWalmartSvPerformanceMetrics
  );
  const walmartSVPerformanceMetricsOptions = useAppSelector(
    selectWalmartSvPerformanceMetricsOptions
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
    selectedColumns: Array<ColumnDef<IWalmartSVAdvertisingData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      WalmartSVCampaignLevelTitles.AUTOMATION_RULES,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  const { mutateAsync: editAccessMutate } = useAppMutation({
    mutationFn: async (body: IEditAccessAutomationRulesUpdateBody) => {
      return await walmartEditAccessSVServices.updateWalmartSVAutomationRules(
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
          queryKey: [QueryKeyEnums.WMT_SV_CAMPAIGN_LVL_AUTOMATION_RULES_FETCH],
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
                QueryKeyEnums.WMT_SV_CAMPAIGN_LVL_AUTOMATION_RULES_FETCH,
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
    ) as Map<string, IWalmartSVAutomationRules>;

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
      WalmartSVCampaignLevelTitles.AUTOMATION_RULES
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(
      setSelectedAdvertisingNavTitle(
        WalmartSVCampaignLevelTitles.AUTOMATION_RULES
      )
    );
  }, [dispatch, updatedPerformanceOptions]);

  const getSVCampLevelAutomationRulesDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      const res = walmartSvAdvertisingServices
        .getSVCampaignAutomationRules(
          getWalmartAppliedFilters(appliedFilters, isDownload, isAllDownload),
          getFilters(isDownload, isAllDownload),
          paginationModel.pageIndex + 1,
          paginationModel.pageSize,
          getFormattedSortModel(
            WalmartSVCampaignLevelTitles.AUTOMATION_RULES,
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

  const fetchSVAutomationRules = useAppQuery({
    queryKey: [
      QueryKeyEnums.WMT_SV_CAMPAIGN_LVL_AUTOMATION_RULES_FETCH,
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
      walmartSvAdvertisingServices.getSVCampaignAutomationRules(
        getWalmartAppliedFilters(appliedFilters, false, false),
        advertisingFiltersWithNoDownload,
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        getFormattedSortModel(
          WalmartSVCampaignLevelTitles.AUTOMATION_RULES,
          sortModel
        ),
        searchText
      ),
    enabled:
      selectedAdvertisingNavTitle ===
      WalmartSVCampaignLevelTitles.AUTOMATION_RULES,
  });

  useEffect(() => {
    setFilteredState([]);
    dispatch(setInitialState([]));
    dispatch(setEditState([]));

    if (fetchSVAutomationRules.data) {
      let data = fetchSVAutomationRules.data?.data?.data?.data ?? [];
      data = data.map((row) => ({
        ...row,
        id: `${row.ruleId}`,
      }));

      const _initialColumns = getInitialColumnsByNavTitle(
        WalmartSVCampaignLevelTitles.AUTOMATION_RULES,
        campaignSubHeaderData
      );
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        WalmartSVCampaignLevelTitles.AUTOMATION_RULES,
        _initialColumns as Array<ColumnDef<IWalmartSVAdvertisingData>>
      );
      setInitialColumns(
        _initialColumns as Array<ColumnDef<IWalmartSVAdvertisingData>>
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

      const totalRows =
        fetchSVAutomationRules.data.data.data?.pagination?.totalItems ?? 0;
      setTotalRowCount(parseInt(totalRows as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchSVAutomationRules.data, dispatch]);

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

      const data: Record<string, unknown>[] =
        (await getSVCampLevelAutomationRulesDownload(
          true,
          isAllDownload
        )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getSVCampLevelAutomationRulesDownload]
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
      performanceSelectedMetrics={walmartSVPerformanceMetrics}
      performanceMetricsOptions={walmartSVPerformanceMetricsOptions}
      handlePerformanceMetricsChange={handlePerformanceMetricsChange}
      performanceGraphData={[]}
      minMaxDates={null}
      isGraphLoading={false}
      chartTitle={`walmart_advertising_SV_campaign_${
        campaignSubHeaderData?.campaignName ?? ''
      }_${getFileNameDateTime(advertisingFiltersWithNoDownload)}`}
      performanceNavigationTabOptions={updatedPerformanceOptions}
      isTableLoading={
        fetchSVAutomationRules.isLoading || fetchSVAutomationRules.isRefetching
      }
      initialColumns={initialColumns}
      selectedColumns={selectedColumns}
      handleSelectedColumns={setSelectedColumnsHandler}
      exportFileTitle={genExportFileName('walmart-sv', 'Campaign Rules')}
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
