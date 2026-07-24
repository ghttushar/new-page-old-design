import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import AdvertisingRenderingComponents from '@/app/components/page-components/advertising-rendering-components/advertising-rendering-components';
import { SpCampaignLevelTitles } from '@/enums/advertising.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  IAdvertisingCampLevelSubWrapperProps,
  IEditAccessArrayData,
} from '@/interfaces/advertising/advertising.interface';
import {
  IAutomationRules,
  ICampaign,
  ISPAdvertisingData,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
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
  selectPerformanceMetrics,
  selectPerformanceMetricsOptions,
  selectSearchText,
  selectSelectedAdvertisingNavTitle,
  selectSortModel,
  setSelectedAdvertisingNavTab,
  setSelectedAdvertisingNavTitle,
  setSPPerformanceMetrics,
  TPerformanceMetricsKey,
} from '@/redux/slices/advertising/advertising-filter.slice';
import { selectAppliedFilters } from '@/redux/slices/filters/filter.slice';
import { showSuccessToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import { spAdvertisingServices } from '@/services/advertising/amazon/sp-advertising.service';
import { EditAccessSPServices } from '@/services/edit-access/amazon-edit-access/amazon-edit-access-sp/amazon-edit-access-sp.service';
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
  removeFrequencyFromAdvFilters,
} from '@/utils/advertising.utils';
import columnFilterUtils from '@/utils/column-filter.utils';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';

export default function AdvertisingCampLevelAutomationRules<
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
      SpCampaignLevelTitles.AUTOMATION_RULES,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  const { mutateAsync: editAccessMutate } = useAppMutation({
    mutationFn: async (body: IEditAccessAutomationRulesUpdateBody) =>
      await EditAccessSPServices.updateSPAutomationRules(body),

    options: {
      onSuccess: (response) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_SP_CAMPAIGN_LVL_AUTOMATION_RULES_FETCH],
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
                QueryKeyEnums.AMZ_SP_CAMPAIGN_LVL_AUTOMATION_RULES_FETCH,
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

    const updatedAutomationRules: IEditAccessAutomationRules[] = [];
    const editStateMap = getEditedTableValuesMap(
      updatedValues,
      editState
    ) as Map<string, IAutomationRules>;

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
    return;
  };

  useEffect(() => {
    dispatch(resetEditAccessFilters());

    const selectedTab = getSelectedNavTab(
      updatedPerformanceOptions,
      SpCampaignLevelTitles.AUTOMATION_RULES
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(
      setSelectedAdvertisingNavTitle(SpCampaignLevelTitles.AUTOMATION_RULES)
    );
  }, [dispatch, updatedPerformanceOptions]);

  const getCampLevelAutomationRulesDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      const res = spAdvertisingServices
        .getCampaignAutomationRules(
          appliedFilters,
          getFilters(isDownload, !isAllDownload),
          paginationModel.pageIndex + 1,
          paginationModel.pageSize,
          getFormattedSortModel(
            SpCampaignLevelTitles.AUTOMATION_RULES,
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
      paginationModel.pageIndex,
      paginationModel.pageSize,
      searchText,
      sortModel,
      dispatch,
      getFilters,
    ]
  );

  const fetchAutomationRules = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_SP_CAMPAIGN_LVL_AUTOMATION_RULES_FETCH,
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
      spAdvertisingServices.getCampaignAutomationRules(
        appliedFilters,
        advertisingFiltersWithNoDownload,
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        getFormattedSortModel(
          SpCampaignLevelTitles.AUTOMATION_RULES,
          sortModel
        ),
        searchText
      ),
    enabled:
      selectedAdvertisingNavTitle === SpCampaignLevelTitles.AUTOMATION_RULES,
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
        SpCampaignLevelTitles.AUTOMATION_RULES,
        campaignSubHeaderData
      );
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        SpCampaignLevelTitles.AUTOMATION_RULES,
        _initialColumns as Array<ColumnDef<ISPAdvertisingData>>
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
        fetchAutomationRules.data.data.data?.pagination?.totalItems ?? 0;
      setTotalRowCount(parseInt(totalRows as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAutomationRules.data, dispatch]);

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
      chartTitle={`advertising_SP_campaign_${
        campaignSubHeaderData?.campaignName ?? ''
      }_${getFileNameDateTime(advertisingFiltersWithNoDownload)}`}
      performanceNavigationTabOptions={updatedPerformanceOptions}
      isTableLoading={
        fetchAutomationRules.isLoading || fetchAutomationRules.isRefetching
      }
      initialColumns={initialColumns}
      selectedColumns={selectedColumns}
      handleSelectedColumns={setSelectedColumnsHandler}
      exportFileTitle={genExportFileName('amazon-sp', 'Campaign Rules')}
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
