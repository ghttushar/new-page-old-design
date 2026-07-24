import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import AdvertisingRenderingComponents from '@/app/components/page-components/advertising-rendering-components/advertising-rendering-components';
import { SdCampaignLevelTitles } from '@/enums/advertising.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  IAdvertisingCampLevelSubWrapperProps,
  IEditAccessArrayData,
} from '@/interfaces/advertising/advertising.interface';
import {
  ISDAdvertisingData,
  ISDAutomationRules,
  ISDCampaign,
} from '@/interfaces/advertising/amazon/sd-advertising.interface';
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
  selectSDPerformanceMetrics,
  selectSDPerformanceMetricsOptions,
  setSDPerformanceMetrics,
} from '@/redux/slices/advertising/advertising-sd-filter.slice';
import { selectAppliedFilters } from '@/redux/slices/filters/filter.slice';
import { showSuccessToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import { sdAdvertisingServicesCampaignLevel } from '@/services/advertising/amazon/sd-advertising.service';
import { EditAccessSDServices } from '@/services/edit-access/amazon-edit-access/amazon-edit-access-sd/amazon-edit-access-sd.services';
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

export default function AdvertisingSDCampLevelAutomationRules<
  T extends ISDCampaign | null
>({
  campaignId,
  campaignSubHeaderData,
  isSubHeaderLoading,
  updatedPerformanceOptions,
  getFilters,
  advertisingFiltersWithNoDownload,
}: IAdvertisingCampLevelSubWrapperProps<T>) {
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

  const SDPerformanceMetrics = useAppSelector(selectSDPerformanceMetrics);
  const SDPerformanceMetricsOptions = useAppSelector(
    selectSDPerformanceMetricsOptions
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
    selectedColumns: Array<ColumnDef<ISDAdvertisingData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      SdCampaignLevelTitles.AUTOMATION_RULES,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  const { mutateAsync: editAccessMutate } = useAppMutation({
    mutationFn: async (body: IEditAccessAutomationRulesUpdateBody) =>
      await EditAccessSDServices.updateSDAutomationRules(body),

    options: {
      onSuccess: (response) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_SD_CAMPAIGN_LVL_AUTOMATION_RULES_FETCH],
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
                QueryKeyEnums.AMZ_SD_CAMPAIGN_LVL_AUTOMATION_RULES_FETCH,
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
    ) as Map<string, ISDAutomationRules>;

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
      SdCampaignLevelTitles.AUTOMATION_RULES
    );
    dispatch(setSelectedAdvertisingNavTab(selectedTab));
    dispatch(
      setSelectedAdvertisingNavTitle(SdCampaignLevelTitles.AUTOMATION_RULES)
    );
  }, [dispatch, updatedPerformanceOptions]);

  const getSDCampLevelAutomationRulesDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      const res = sdAdvertisingServicesCampaignLevel
        .getSDCampaignAutomationRules(
          appliedFilters,
          getFilters(isDownload, !isAllDownload),
          paginationModel.pageIndex + 1,
          paginationModel.pageSize,
          getFormattedSortModel(
            SdCampaignLevelTitles.AUTOMATION_RULES,
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

  const fetchSDAutomationRules = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_SD_CAMPAIGN_LVL_AUTOMATION_RULES_FETCH,
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
      sdAdvertisingServicesCampaignLevel.getSDCampaignAutomationRules(
        appliedFilters,
        advertisingFiltersWithNoDownload,
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        getFormattedSortModel(
          SdCampaignLevelTitles.AUTOMATION_RULES,
          sortModel
        ),
        searchText
      ),
    enabled:
      selectedAdvertisingNavTitle === SdCampaignLevelTitles.AUTOMATION_RULES,
  });

  useEffect(() => {
    setFilteredState([]);
    dispatch(setInitialState([]));
    dispatch(setEditState([]));

    if (fetchSDAutomationRules.data) {
      let data = fetchSDAutomationRules.data?.data?.data?.data ?? [];
      data = data.map((row) => ({
        ...row,
        id: `${row.ruleId}`,
      }));

      const _initialColumns = getInitialColumnsByNavTitle(
        SdCampaignLevelTitles.AUTOMATION_RULES,
        campaignSubHeaderData
      );
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        SdCampaignLevelTitles.AUTOMATION_RULES,
        _initialColumns as Array<ColumnDef<ISDAdvertisingData>>
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

      const totalRows =
        fetchSDAutomationRules.data.data.data?.pagination?.totalItems ?? 0;
      setTotalRowCount(parseInt(totalRows as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchSDAutomationRules.data, dispatch]);

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

      const data: Record<string, unknown>[] =
        (await getSDCampLevelAutomationRulesDownload(
          true,
          isAllDownload
        )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getSDCampLevelAutomationRulesDownload]
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
      performanceSelectedMetrics={SDPerformanceMetrics}
      performanceMetricsOptions={SDPerformanceMetricsOptions}
      handlePerformanceMetricsChange={handlePerformanceMetricsChange}
      performanceGraphData={[]}
      minMaxDates={null}
      isGraphLoading={false}
      chartTitle={`advertising_SD_campaign_${
        campaignSubHeaderData?.campaignName ?? ''
      }_${getFileNameDateTime(advertisingFiltersWithNoDownload)}`}
      performanceNavigationTabOptions={updatedPerformanceOptions}
      isTableLoading={
        fetchSDAutomationRules.isLoading || fetchSDAutomationRules.isRefetching
      }
      initialColumns={initialColumns}
      selectedColumns={selectedColumns}
      handleSelectedColumns={setSelectedColumnsHandler}
      exportFileTitle={genExportFileName('amazon-sd', 'Campaign Rules')}
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
