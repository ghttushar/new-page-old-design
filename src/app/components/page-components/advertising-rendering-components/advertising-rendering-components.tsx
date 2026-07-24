import {
  advEditAccessTabData,
  DEFAULT_ADVERTISING_SORT_CRITERIA,
} from '@/constants/advertising-filter.constants';
import { creativeNotFound } from '@/constants/empty-state.constants';
import {
  AdvertisingTitlesEnum,
  SdAdGroupLevelTitles,
  WalmartSBCampaignLevelTitles,
} from '@/enums/advertising.enums';
import { EditAccessValues } from '@/enums/edit-access.enums';
import { Filters } from '@/enums/filter.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { WalmartCampaignStatusEnum } from '@/enums/walmart.enums';
import { IEditAccessArrayData } from '@/interfaces/advertising/advertising.interface';
import { IOverallCampaign } from '@/interfaces/advertising/amazon/overall-advertising.interface';
import {
  ISBAdGroup,
  ISBCampaign,
} from '@/interfaces/advertising/amazon/sb-advertising.interface';
import {
  ISDAdGroup,
  ISDCampaign,
} from '@/interfaces/advertising/amazon/sd-advertising.interface';
import {
  IAdGroup,
  IAdvertisingFilter,
  IAdvertisingNavigationBarOption,
  ICampaign,
  IMinMaxDateRange,
  IPerformanceGraphData,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  IWalmartAdGroup,
  IWalmartCampaign,
} from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import {
  IWalmartSVAdGroup,
  IWalmartSVCampaign,
} from '@/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  resetErrorMessages,
  selectEditAccessFilters,
  selectEditAccessOptions,
  selectEditState,
  selectInitialState,
  setEditAccess,
  setEditState,
  setSelectedRows,
} from '@/redux/slices/advertising/advertising-edit-access.slice';
import {
  IPerformanceMetricsFilters,
  IPerformanceMetricsOptions,
  resetAdvertisingFilters,
  selectAdvertisingFilter,
  selectAdvertisingHeaderFilters,
  selectPaginationModel,
  selectSearchText,
  selectSelectedAdvertisingNavTab,
  selectSelectedAdvertisingNavTitle,
  selectSortModel,
  setPaginationModel,
  setSearchText,
  setSelectedAdvertisingNavTab,
  setSelectedAdvertisingNavTitle,
  setSortModel,
  TPerformanceMetricsKey,
} from '@/redux/slices/advertising/advertising-filter.slice';
import {
  selectWalmartBrandProfileEditState,
  selectWalmartBrandProfileInitialState,
} from '@/redux/slices/advertising/walmart/advertising-walmart.slice';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { selectAppliedFilters } from '@/redux/slices/filters/filter.slice';
import {
  selectIsShowImpactOn,
  setIsShowImpactOn,
} from '@/redux/slices/impact-analysis/impact-analysis.slice';
import {
  clearAllFilter,
  disableViewEditToggle,
  getAdvertisingRoutingURL,
  getBudgetFooterData,
  getComparisonDetails,
  getDiff,
  getIsShowImpactEnabled,
  getIsViewEditRequired,
  handleTableEmptyResetUtils,
  hasAmazonSPBudgetProp,
  showFooter,
} from '@/utils/advertising.utils';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import searchUtils from '@/utils/search.utils';
import {
  hasBudget,
  hasMaxBid,
  hasMinBid,
  hasTargetingType,
  hasTroas,
} from '@/utils/validations.utils';
import {
  ColumnDef,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddedFiltersTab from '../../common/added-filters-tab/added-filters-tab';
import CustomBreadcrumbs from '../../common/breadcrumb/breadcrumb';
import ConfirmationBox from '../../common/confirmation-box/confirmation-box';
import { IDropdownItem } from '../../common/dropdown/dropdown';
import EmptyState from '../../common/empty-state/empty-state';
import SubHeaderOptions from '../../common/sub-header-options/sub-header-options';
import TableEmptyState from '../../common/table-empty-state/table-empty-state';
import { ITabData } from '../../common/tabs-select/tabs-select';
import ViewEditToggleAdvertisingWrapper from '../../common/view-edit-toggle/view-edit-toggle-wrappers/view-edit-toggle-advertising-wrapper';
import AdvertisingNavigationBar from '../advertising-navigation-bar/advertising-navigation-bar';
import AdvertisingPageSubHeader from '../advertising-page-sub-header/advertising-page-sub-header';
import TableHeader from '../advertising-table-header/advertising-table-header';
import PerformanceGraphWrapper from '../performance-graph/performance-graph-wrapper';
import PerformanceTableWrapper from '../performance-table/performance-table-wrapper';
import PerformanceBox from '../performance/performance';
import WalmartBrandProfile from '../walmart-brand-assets/walmart-brand-assets';
import styles from './advertising-rendering-components.module.scss';

interface IAdvertisingRenderingComponentsProps<T> {
  campaignId?: string;
  adGroupId?: string;
  selectedLevelType?: 'campaign-level' | 'adgroup-level' | null;
  selectedCampaign?:
    | IWalmartCampaign
    | ICampaign
    | ISBCampaign
    | ISDCampaign
    | IWalmartSVCampaign
    | null;
  selectedAdGroup?:
    | IWalmartAdGroup
    | IWalmartSVAdGroup
    | IAdGroup
    | ISBAdGroup
    | ISDAdGroup
    | null;
  isSubHeaderLoading?: boolean;
  advertisingMetricsData: IPerformanceMetrics | null;
  performanceFilters: IAdvertisingFilter;
  isMetricsLoading: boolean;
  performanceSelectedMetrics: IPerformanceMetricsFilters;
  performanceMetricsOptions: IPerformanceMetricsOptions;
  performanceGraphData: IPerformanceGraphData[];
  minMaxDates: IMinMaxDateRange | null;
  isGraphLoading: boolean;
  isImpactLoading?: boolean;
  chartTitle: string;
  performanceNavigationTabOptions: IAdvertisingNavigationBarOption[];
  isTableLoading: boolean;
  initialColumns?: Array<ColumnDef<T>>;
  selectedColumns?: Array<ColumnDef<T>>;
  handleSelectedColumns?: (selectedColumns: Array<ColumnDef<T>>) => void;
  exportFileTitle: string;
  filteredTableData?: IEditAccessArrayData;
  totalRowCount?: number;
  setTotalRowCount?: React.Dispatch<React.SetStateAction<number>>;
  setFilteredTableData?: React.Dispatch<
    React.SetStateAction<IEditAccessArrayData>
  >;
  exportData?: T[];
  handleDownload?: (
    isAllDownload: boolean
  ) => Promise<Record<string, unknown>[]>;
  handleEditSaveClick: () => void;
  areTableHeaderActionButtonsRequired?: boolean;
  disableFilterConfig?: Filters[];
  openInvalidModal?: boolean;
  invalidTitle?: string;
  invalidDescription?: string;
  cancelInvalidModalClick?: () => void;
  handlePerformanceMetricsChange: (metricsValue: {
    value: IDropdownItem<string>;
    key: TPerformanceMetricsKey;
  }) => void;
  isEditLoading?: boolean;
  openSaveModal?: boolean;
  setOpenSaveModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AdvertisingRenderingComponents<T>({
  campaignId,
  adGroupId,
  selectedLevelType = null,
  selectedCampaign,
  selectedAdGroup = null,
  isSubHeaderLoading,
  advertisingMetricsData,
  performanceFilters,
  isMetricsLoading,
  performanceSelectedMetrics,
  performanceMetricsOptions,
  performanceGraphData,
  minMaxDates,
  isGraphLoading,
  isImpactLoading,
  chartTitle,
  performanceNavigationTabOptions,
  isTableLoading,
  initialColumns,
  selectedColumns,
  handleSelectedColumns,
  exportFileTitle,
  filteredTableData,
  totalRowCount,
  setTotalRowCount,
  setFilteredTableData,
  exportData,
  handleDownload,
  handleEditSaveClick,
  areTableHeaderActionButtonsRequired,
  disableFilterConfig,
  openInvalidModal,
  invalidTitle,
  invalidDescription,
  cancelInvalidModalClick,
  handlePerformanceMetricsChange,
  isEditLoading,
  openSaveModal,
  setOpenSaveModal,
}: IAdvertisingRenderingComponentsProps<T>) {
  const [hideGraph, setHideGraph] = useState<boolean>(false);
  const [expandGraph, setExpandGraph] = useState<boolean>(false);
  const [updatedTabValue, setUpdatedTabValue] = useState<ITabData>(
    advEditAccessTabData[0]
  );
  const [openCloseModal, setOpenCloseModal] = useState<boolean>(false);
  const [openTabChangeModal, setOpenTabChangeModal] = useState<boolean>(false);

  const isShowImpactOn = useAppSelector(selectIsShowImpactOn);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const advertisingFilters = useAppSelector(selectAdvertisingFilter);
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);
  const selectedAdvertisingNavTitle = useAppSelector(
    selectSelectedAdvertisingNavTitle
  );
  const selectedAdvertisingNavTab = useAppSelector(
    selectSelectedAdvertisingNavTab
  );
  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const editAccessOptions = useAppSelector(selectEditAccessOptions);
  const initialState = useAppSelector(selectInitialState);
  const editState = useAppSelector(selectEditState);
  const searchText = useAppSelector(selectSearchText);
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const paginationModel = useAppSelector(selectPaginationModel);
  const sortModel = useAppSelector(selectSortModel);
  const walmartBrandProfileInitialState = useAppSelector(
    selectWalmartBrandProfileInitialState
  );
  const walmartBrandProfileEditState = useAppSelector(
    selectWalmartBrandProfileEditState
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const selectedMarketplace = useMemo(
    () => advertisingAccount.marketplace as string,
    [advertisingAccount.marketplace]
  );
  const selectedCampaignName = useMemo(
    () => selectedAdGroup?.campaignName ?? selectedCampaign?.campaignName ?? '',
    [selectedCampaign, selectedAdGroup]
  );
  const selectedAdGroupName = useMemo(
    () => selectedAdGroup?.adGroupName ?? '',
    [selectedAdGroup?.adGroupName]
  );

  const dailyBudget = hasBudget(selectedCampaign)
    ? typeof selectedCampaign?.budget === 'number'
      ? selectedCampaign?.budget
      : selectedCampaign?.budget?.budget
    : selectedCampaign?.dailyBudget;

  const selectedTargetingType = useMemo(() => {
    return selectedAdGroup !== null && hasTargetingType(selectedAdGroup)
      ? selectedAdGroup.targetingType
      : selectedCampaign !== null && hasTargetingType(selectedCampaign)
      ? selectedCampaign.targetingType
      : undefined;
  }, [selectedAdGroup, selectedCampaign]);

  const handlePaginationModel = useCallback(
    (paginationModel: PaginationState) => {
      dispatch(setPaginationModel(paginationModel));
    },
    [dispatch]
  );

  const handleSortModel = useCallback(
    (sortModel: SortingState) => {
      dispatch(setSortModel(sortModel));
    },
    [dispatch]
  );

  const handleSetTotalRows = useCallback(
    (totalCount: number) => {
      if (setTotalRowCount) setTotalRowCount(totalCount);
    },
    [setTotalRowCount]
  );

  const handleToggleImpact = () => dispatch(setIsShowImpactOn(!isShowImpactOn));
  const handleToggleViewChanges = () => {
    return;
  };

  const handleSaveModalState = (state: boolean) => {
    if (setOpenSaveModal) setOpenSaveModal(state);
    return;
  };

  const handleHideGraph = () => {
    setHideGraph(true);
    localStorageUtils.setHideGraph(true);
  };
  const handleShowGraph = () => {
    setHideGraph(false);
    localStorageUtils.setHideGraph(false);
  };
  const handleExpandOpen = () => setExpandGraph(true);
  const handleExpandClose = () => setExpandGraph(false);

  const handlePerformanceDropdownChange = (
    value: IDropdownItem<string>,
    key: TPerformanceMetricsKey
  ) => {
    handlePerformanceMetricsChange({ value, key });
  };

  const handleInitialPerformanceDropdownChange = () => {
    handlePerformanceMetricsChange({
      value: {
        value: performanceSelectedMetrics.metrics1.value,
        label: performanceSelectedMetrics.metrics1.label,
        selected: true,
        isDisabled: false,
        tooltipText: performanceSelectedMetrics.metrics1.tooltipText,
      },
      key: 'metrics1',
    });
  };

  const handleSelectedNavTabOption = (
    option: IAdvertisingNavigationBarOption
  ) => {
    dispatch(setSelectedAdvertisingNavTab(option));
  };

  const handleTitle = useCallback(
    (value: string) => {
      if (
        selectedAdvertisingNavTitle === '' ||
        selectedAdvertisingNavTitle === value
      )
        return;

      dispatch(setSelectedAdvertisingNavTitle(value));
      dispatch(setSearchText(''));
      handleSetTotalRows(0);
      handleTableEmptyResetUtils(
        handleSortModel,
        handlePaginationModel,
        DEFAULT_ADVERTISING_SORT_CRITERIA,
        {
          ...paginationModel,
          pageIndex: 0,
        }
      );

      navigate(
        `${getAdvertisingRoutingURL(
          value,
          advHeaderFilters.adType.value,
          selectedMarketplace,
          campaignId,
          adGroupId
        )}`
      );
    },
    [
      advHeaderFilters.adType.value,
      dispatch,
      handlePaginationModel,
      handleSortModel,
      navigate,
      paginationModel,
      campaignId,
      adGroupId,
      selectedAdvertisingNavTitle,
      selectedMarketplace,
      handleSetTotalRows,
    ]
  );

  const handleSetUpdatedRows = (data: any[]) => {
    if (setFilteredTableData) setFilteredTableData(data);
  };

  const handleSetFilteredRows = (filteredData: any[]) => {
    const searchedData = searchUtils.getSearchTableData(
      filteredData,
      searchText,
      selectedAdvertisingNavTitle
    );
    if (setFilteredTableData) setFilteredTableData(searchedData);
  };
  const handleViewEditTabChange = (value: ITabData) => {
    if (selectedAdvertisingNavTitle !== WalmartSBCampaignLevelTitles.BRANDS) {
      const comparedRows = getComparisonDetails(initialState, editState);
      setUpdatedTabValue(value);

      if (
        editAccessFilters.editAccess.value === EditAccessValues.Edit &&
        comparedRows.size > 0
      ) {
        setOpenTabChangeModal(true);
        return;
      } else {
        confirmTabChangeClick(value);
      }

      if (setFilteredTableData) setFilteredTableData(editState);
      dispatch(setSelectedRows({}));
    }

    if (selectedAdvertisingNavTitle === WalmartSBCampaignLevelTitles.BRANDS) {
      const comparedBrandProfileData = getDiff(
        walmartBrandProfileInitialState as unknown as Record<string, unknown>,
        walmartBrandProfileEditState as unknown as Record<string, unknown>
      );

      if (
        editAccessFilters.editAccess.value === EditAccessValues.Edit &&
        Object.keys(comparedBrandProfileData).length > 0
      ) {
        setOpenTabChangeModal(true);
        return;
      } else {
        confirmTabChangeClick(value);
      }
    }
  };

  const cancelTabChangeClick = () => {
    setOpenTabChangeModal(false);
    return;
  };

  const confirmTabChangeClick = (value: ITabData) => {
    if (setFilteredTableData) setFilteredTableData(initialState);
    dispatch(setEditState(initialState));
    dispatch(setEditAccess(value));
    dispatch(setSelectedRows({}));
    setOpenTabChangeModal(false);
    dispatch(resetErrorMessages());
    return;
  };

  const confirmCancelClick = () => {
    if (setFilteredTableData) setFilteredTableData(initialState);
    dispatch(setEditState(initialState));
    confirmTabChangeClick(advEditAccessTabData[0]);
    dispatch(setSelectedRows({}));
    setOpenCloseModal(false);
    dispatch(resetErrorMessages());
    return;
  };

  const cancelCancelClick = () => {
    setOpenCloseModal(false);
    return;
  };

  const handleSaveClick = () => {
    if (selectedAdvertisingNavTitle !== WalmartSBCampaignLevelTitles.BRANDS) {
      const comparedRows = getComparisonDetails(initialState, editState);
      if (comparedRows.size > 0) {
        handleSaveModalState(true);
        return;
      }
    }

    if (selectedAdvertisingNavTitle === WalmartSBCampaignLevelTitles.BRANDS) {
      const comparedBrandProfileData = getDiff(
        walmartBrandProfileInitialState as unknown as Record<string, unknown>,
        walmartBrandProfileEditState as unknown as Record<string, unknown>
      );

      if (Object.keys(comparedBrandProfileData).length > 0) {
        handleSaveModalState(true);
        return;
      }
    }
  };

  const handleCancelClick = () => {
    if (selectedAdvertisingNavTitle !== WalmartSBCampaignLevelTitles.BRANDS) {
      const comparedRows = getComparisonDetails(initialState, editState);

      if (comparedRows.size > 0) {
        setOpenCloseModal(true);
        return;
      } else {
        confirmCancelClick();
      }
    }

    if (selectedAdvertisingNavTitle === WalmartSBCampaignLevelTitles.BRANDS) {
      const comparedBrandProfileData = getDiff(
        walmartBrandProfileInitialState as unknown as Record<string, unknown>,
        walmartBrandProfileEditState as unknown as Record<string, unknown>
      );

      if (Object.keys(comparedBrandProfileData).length > 0) {
        setOpenCloseModal(true);
        return;
      } else {
        confirmCancelClick();
      }
    }
  };

  const cancelSaveClick = () => {
    handleSaveModalState(false);
    return;
  };

  const handleTableEmptyReset = () => {
    dispatch(resetAdvertisingFilters());
    dispatch(setSearchText(''));
    handleTableEmptyResetUtils(handleSortModel, handlePaginationModel);
    clearAllFilter(
      appliedFilters,
      selectedAdvertisingNavTitle as AdvertisingTitlesEnum,
      dispatch
    );
  };

  const handleConfirmClick = () => {
    handleEditSaveClick();
  };

  useEffect(() => {
    const isGraphHidden = localStorageUtils.getHideGraph();
    setHideGraph(isGraphHidden);
  }, []);

  useEffect(() => {
    const updatedFields = getComparisonDetails(initialState, editState);
    const updatedIds: RowSelectionState = {};

    for (const [key, value] of updatedFields) {
      updatedIds[key] = true;
    }

    dispatch(setSelectedRows(updatedIds));
  }, [dispatch, initialState, editState]);

  return (
    <div className={styles.advertisingContainer}>
      {campaignId && (
        <CustomBreadcrumbs
          campaignId={campaignId}
          campaignName={selectedCampaignName ?? ''}
          adGroupId={adGroupId}
          adgroupName={selectedAdGroupName ?? ''}
        />
      )}

      {selectedLevelType === 'campaign-level' && selectedCampaign !== null && (
        <AdvertisingPageSubHeader
          _selectedLevel="campaign-level"
          selectedCampaign={selectedCampaign}
          campaignName={selectedCampaign?.campaignName}
          status={selectedCampaign?.status}
          budget={
            selectedMarketplace === MarketplaceEnum.AMAZON
              ? hasAmazonSPBudgetProp(selectedCampaign)
                ? (selectedCampaign as ICampaign)?.budget.budget
                : (
                    selectedCampaign as
                      | ISBCampaign
                      | ISDCampaign
                      | IOverallCampaign
                  )?.budget
              : undefined
          }
          dailyBudget={
            selectedMarketplace === MarketplaceEnum.WALMART
              ? Number(dailyBudget)
              : undefined
          }
          totalBudget={
            selectedMarketplace === MarketplaceEnum.WALMART
              ? Number((selectedCampaign as IWalmartCampaign)?.totalBudget)
              : undefined
          }
          startDate={selectedCampaign?.startDate}
          endDate={selectedCampaign?.endDate}
          info={
            hasTargetingType(selectedCampaign)
              ? selectedCampaign?.targetingType
              : undefined
          }
          biddingStrategy={
            selectedMarketplace === MarketplaceEnum.AMAZON
              ? (selectedCampaign as ICampaign)?.dynamicBidding?.strategy
              : undefined
          }
          isLoading={
            isSubHeaderLoading !== undefined ? isSubHeaderLoading : false
          }
        />
      )}

      {selectedLevelType === 'adgroup-level' && selectedAdGroup !== null && (
        <AdvertisingPageSubHeader
          _selectedLevel="adgroup-level"
          selectedAdGroup={selectedAdGroup}
          selectedCampaign={selectedCampaign}
          adGroupName={selectedAdGroup?.adGroupName}
          defaultBid={
            selectedMarketplace === MarketplaceEnum.AMAZON
              ? (selectedAdGroup as IAdGroup)?.defaultBid
              : undefined
          }
          maxBid={
            hasMaxBid(selectedAdGroup) ? selectedAdGroup?.maxBid : undefined
          }
          minBid={
            hasMinBid(selectedAdGroup) ? selectedAdGroup?.minBid : undefined
          }
          troas={hasTroas(selectedAdGroup) ? selectedAdGroup?.troas : undefined}
          status={selectedAdGroup?.status}
          isLoading={
            isSubHeaderLoading !== undefined ? isSubHeaderLoading : false
          }
        />
      )}

      <SubHeaderOptions
        isShowImpactOn={isShowImpactOn}
        onRunFilterClickCustomActions={() => {
          dispatch(resetErrorMessages());
        }}
      />

      <PerformanceBox
        metricsData={advertisingMetricsData}
        filters={performanceFilters}
        isMetricsLoading={isMetricsLoading}
        performanceMetrics={performanceSelectedMetrics}
        performanceMetricsOptions={performanceMetricsOptions}
        handlePerformanceMetricsChange={handlePerformanceDropdownChange}
        handleInitialPerformanceMetricsChange={
          handleInitialPerformanceDropdownChange
        }
      />

      {hideGraph !== true && (
        <PerformanceGraphWrapper
          data={performanceGraphData}
          filters={performanceFilters}
          maxMinDates={minMaxDates}
          handleHideGraph={handleHideGraph}
          isGraphLoading={isGraphLoading}
          expandGraph={expandGraph}
          handleExpandOpen={handleExpandOpen}
          handleExpandClose={handleExpandClose}
          chartTitle={chartTitle}
          impactLoading={
            isShowImpactOn && isImpactLoading !== undefined
              ? isImpactLoading
              : false
          }
          isImpactDisabled={
            getIsShowImpactEnabled(
              selectedAdvertisingNavTitle as AdvertisingTitlesEnum
            ) === false
          }
          isImpactChecked={isShowImpactOn}
          handleToggleImpact={handleToggleImpact}
          isViewChangesDisabled={true}
          isViewChangesChecked={false}
          handleToggleViewChanges={handleToggleViewChanges}
          isShowImpactOn={isShowImpactOn}
          performanceMetrics={performanceSelectedMetrics}
          handleTableEmptyReset={handleTableEmptyReset}
          selectedAdvertisingNavTitle={selectedAdvertisingNavTitle}
        />
      )}

      <AdvertisingNavigationBar
        data={performanceNavigationTabOptions}
        selectedOption={selectedAdvertisingNavTab}
        handleSelectedOption={handleSelectedNavTabOption}
        isTableLoading={isTableLoading}
      />

      <TableHeader
        selectedNavTab={selectedAdvertisingNavTab}
        handleSelectedAdvertisingNavTitle={handleTitle}
        hideGraph={hideGraph}
        handleShowGraph={handleShowGraph}
        columnsToFilter={initialColumns}
        setSelectedColumns={handleSelectedColumns}
        _selectedColumns={selectedColumns}
        exportData={exportData ? exportData : []}
        exportFileTitle={exportFileTitle}
        initialRows={
          editAccessFilters.editAccess.value === EditAccessValues.View
            ? initialState
            : editState
        }
        isTableDataLoading={isTableLoading}
        selectedAdvertisingNavTitle={selectedAdvertisingNavTitle}
        setUpdatedRows={handleSetUpdatedRows}
        handleDownload={handleDownload}
        areActionButtonsRequired={areTableHeaderActionButtonsRequired}
        selectedCampaignId={campaignId}
        selectedAdGroupId={adGroupId}
        selectedAdGroup={selectedAdGroup}
      />

      {getIsViewEditRequired(
        selectedAdvertisingNavTitle as AdvertisingTitlesEnum
      ) === true &&
        setFilteredTableData !== undefined && (
          <ViewEditToggleAdvertisingWrapper
            tabValue={editAccessFilters.editAccess}
            tabData={editAccessOptions.editAccess}
            onTabChange={handleViewEditTabChange}
            buttonsDisabled={
              getComparisonDetails(initialState, editState).size < 1
            }
            toggleButtonDisabled={disableViewEditToggle(
              selectedAdvertisingNavTitle as AdvertisingTitlesEnum,
              selectedCampaign
            )}
            toggleButtonDisableReason={
              disableViewEditToggle(
                selectedAdvertisingNavTitle as AdvertisingTitlesEnum,
                selectedCampaign
              )
                ? `Either campaign's automation status is paused or the selected campaign is not part of any rule yet.`
                : ''
            }
            handleCancelClick={handleCancelClick}
            handleSaveClick={handleSaveClick}
            setTableData={setFilteredTableData}
            title={selectedAdvertisingNavTitle}
            selectedTargetingType={selectedTargetingType}
            selectedCampaign={selectedCampaign}
            selectedAdGroup={selectedAdGroup}
            totalItems={totalRowCount ?? 0}
          />
        )}

      {!(
        selectedAdvertisingNavTitle === SdAdGroupLevelTitles.CREATIVE ||
        selectedAdvertisingNavTitle === WalmartSBCampaignLevelTitles.BRANDS
      ) &&
        selectedColumns !== undefined && (
          <React.Fragment>
            {isTableLoading === false &&
              ((filteredTableData && filteredTableData.length < 0) ||
                !filteredTableData) && (
                <TableEmptyState handleReset={handleTableEmptyReset} />
              )}

            <div style={{ width: '100%', marginTop: '1rem' }}>
              <AddedFiltersTab
                appliedFilters={appliedFilters}
                initialRows={
                  initialState as unknown as Record<string, unknown>[]
                }
                setFilteredRows={handleSetFilteredRows}
                selectedAdvertisingNavTitle={
                  selectedAdvertisingNavTitle as AdvertisingTitlesEnum
                }
                isLoading={isTableLoading || isGraphLoading || isMetricsLoading}
                disableFilterConfig={disableFilterConfig}
              />
            </div>

            <PerformanceTableWrapper
              columns={selectedColumns}
              rows={filteredTableData as T[]}
              isLoading={isTableLoading}
              totalRowCount={totalRowCount ? totalRowCount : 0}
              paginationModel={paginationModel}
              setPaginationModel={handlePaginationModel}
              sortModel={sortModel}
              setSortModel={handleSortModel}
              isFooterRequired={showFooter(
                selectedAdvertisingNavTitle as AdvertisingTitlesEnum
              )}
              footerData={getBudgetFooterData(
                selectedAdvertisingNavTitle as AdvertisingTitlesEnum,
                advertisingMetricsData?.currPerformanceData,
                filteredTableData as IOverallCampaign[]
              )}
            />
          </React.Fragment>
        )}

      {selectedAdvertisingNavTitle === SdAdGroupLevelTitles.CREATIVE && (
        // ) : formattedRows.length ? ( // TODO: keep this logic for creative display
        //   <div className={styles.creativeDisplay}></div>
        <div className={styles.noCreativeDisplay}>
          <EmptyState {...creativeNotFound} />
        </div>
      )}

      {selectedAdvertisingNavTitle === WalmartSBCampaignLevelTitles.BRANDS && (
        <WalmartBrandProfile
          brandProfileData={
            editAccessFilters.editAccess.value === EditAccessValues.View
              ? walmartBrandProfileInitialState
              : walmartBrandProfileEditState
          }
          isLoading={isTableLoading}
          isDisabled={
            editAccessFilters.editAccess.value === EditAccessValues.View ||
            !selectedCampaign ||
            selectedCampaign?.status.toLowerCase() ===
              WalmartCampaignStatusEnum.PAUSED.toLowerCase()
          }
        />
      )}

      {openTabChangeModal === true && (
        <ConfirmationBox
          title="Switch to View Mode?"
          description="Are you sure you want to switch to View Tab? You might lose the changes."
          openConfirmation={openTabChangeModal}
          handleConfirmationClose={cancelTabChangeClick}
          handleConfirmClick={() => confirmTabChangeClick(updatedTabValue)}
          confirmButtonText="Confirm"
          isConfirmButtonRequired={true}
        />
      )}

      {openCloseModal === true && (
        <ConfirmationBox
          title="Discard Changes?"
          description="Are you sure you want to discard the changes? You might lose the changes."
          openConfirmation={openCloseModal}
          handleConfirmationClose={cancelCancelClick}
          handleConfirmClick={confirmCancelClick}
          confirmButtonText="Confirm"
          isConfirmButtonRequired={true}
        />
      )}

      {openSaveModal === true && (
        <ConfirmationBox
          title="Save Changes?"
          description={`Are you sure you want to save the changes?`}
          openConfirmation={openSaveModal}
          handleConfirmationClose={cancelSaveClick}
          handleConfirmClick={handleConfirmClick}
          confirmButtonText="Save"
          isConfirmButtonRequired={true}
          isLoading={isEditLoading}
        />
      )}

      {openInvalidModal === true &&
        invalidTitle !== undefined &&
        invalidDescription !== undefined &&
        cancelInvalidModalClick !== undefined && (
          <ConfirmationBox
            title={invalidTitle}
            description={invalidDescription}
            openConfirmation={openInvalidModal}
            handleConfirmationClose={() => {
              handleSaveModalState(false);
              cancelInvalidModalClick();
            }}
            isConfirmButtonRequired={false}
          />
        )}
    </div>
  );
}
