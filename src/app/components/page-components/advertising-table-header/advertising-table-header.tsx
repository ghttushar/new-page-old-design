import {
  DynamicFilterKeys,
  Filters,
  FilterValueType,
} from '@/enums/filter.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { DISABLE_TOOLTIP } from '@/enums/tooltip-texts.enums';
import { ISubNavItem } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  selectAdvertisingHeaderFilters,
  selectPaginationModel,
  setPaginationModel,
} from '@/redux/slices/advertising/advertising-filter.slice';
import { getUpdatedPagination, pickKeysFromObject } from '@/utils';
import {
  checkIsEditDisableByReviewStatus,
  checkReviewCampaignFlagEnabled,
} from '@/utils/advertising.utils';
import columnFilterUtils from '@/utils/column-filter.utils';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import Button from '@mui/material/Button';
import { ColumnsIcon, FadersIcon } from '@phosphor-icons/react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AdvertisingTitlesEnum,
  SbAdGroupLevelTitles,
  SdAdGroupLevelTitles,
  SpAdGroupLevelTitles,
  WalmartSBAdGroupLevelTitles,
  WalmartSPAdGroupLevelTitles,
  WalmartSVAdGroupLevelTitles,
} from 'src/enums/advertising.enums';
import { TargetingTypeEnum } from 'src/enums/walmart.enums';
import { ITableHeaderProps } from 'src/interfaces/advertising/advertising-table-header.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import {
  selectAppliedFilters,
  selectDynamicFilterValuesByFilterKey,
  selectShowFilterModal,
  setFilters,
  setShowFilterModal,
} from 'src/redux/slices/filters/filter.slice';
import {
  getDynamicValuesFilterSettings,
  getFilterConfigByMarketplace,
} from 'src/utils/row-filter.utils';
import searchUtils from 'src/utils/search.utils';
import DownloadTableButton from '../../common/download-button/download-table-button';
import Dropdown, { IDropdownItem } from '../../common/dropdown/dropdown';
import PrimaryButton from '../../common/primary-button/primary-button';
import RowFilterWrapper from '../../common/row-filter/row-filter-wrapper';
import ServerSearch from '../../common/search/server-search';
import SecondaryButton from '../../common/secondary-button/secondary-button';
import AdvertisingCreateDialogs from '../advertising-create-dialogs/advertising-create-dialogs';
import NewColumnFilterWrapper from '../column-filter/new-column-filter-wrapper';
import styles from './advertising-table-header.module.scss';

export default function TableHeader<T, G>(props: ITableHeaderProps<T, G>) {
  const {
    selectedNavTab,
    handleSelectedAdvertisingNavTitle,
    hideGraph,
    handleShowGraph,
    columnsToFilter,
    setSelectedColumns,
    _selectedColumns,
    exportData,
    isMetricDropdownRequired,
    metricDropdownData,
    onMetricDropdownChange,
    exportFileTitle,
    initialRows,
    isTableDataLoading,
    selectedAdvertisingNavTitle,
    setUpdatedRows,
    selectedCampaignId,
    selectedAdGroupId,
    handleDownload,
    areActionButtonsRequired = true,
    selectedAdGroup,
    showColumnFilterComp = true,
  } = props;
  const [selectedSubNavTitle, setSelectedSubNavTitle] = useState<string>('');
  const [showColumnFilter, setShowColumnFilter] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const columnFilterRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const showFilterModal = useAppSelector(selectShowFilterModal);
  const dispatch = useAppDispatch();
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);
  const paginationModel = useAppSelector(selectPaginationModel);
  const dynamicFilterValuesByFilterKey = useAppSelector(
    selectDynamicFilterValuesByFilterKey
  );

  const selectedAdvertisingAccountType = useMemo(
    () => localStorageUtils.getSelectedAdvertisingAccount()?.accountType,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedAdvertisingAccount]
  );

  const selectedMarketplace = useMemo(
    () => advertisingAccount.marketplace as string,
    [advertisingAccount.marketplace]
  );

  const dynamicTagNameFilterSetting = useMemo(() => {
    if (!columnsToFilter || !columnsToFilter.length) return [];

    const accessorKeyArray = columnFilterUtils
      .convertToColumnDefResolved(columnsToFilter)
      .map((column) => column.accessorKey);

    if (accessorKeyArray.includes(Filters.CAMPAIGN_NAME)) {
      return getDynamicValuesFilterSettings(
        pickKeysFromObject(dynamicFilterValuesByFilterKey, [
          DynamicFilterKeys.TAG_NAME,
        ]),
        'Campaign Tag Name',
        FilterValueType.DROPDOWN
      );
    } else {
      return [];
    }
  }, [columnsToFilter, dynamicFilterValuesByFilterKey]);

  const handlePaginationModelReset = useCallback(() => {
    dispatch(setPaginationModel(getUpdatedPagination(paginationModel)));
  }, [dispatch, paginationModel]);

  const isReviewFlagEnabled = useMemo(
    () =>
      checkReviewCampaignFlagEnabled(
        advHeaderFilters.adType.value,
        selectedMarketplace
      ),
    [advHeaderFilters.adType.value, selectedMarketplace]
  );

  const isAddFuncDisabledByReviewStatus: boolean = useMemo(() => {
    if (
      selectedMarketplace === MarketplaceEnum.WALMART &&
      selectedAdGroup !== null
    ) {
      return checkIsEditDisableByReviewStatus(selectedAdGroup);
    }

    return false;
  }, [selectedAdGroup, selectedMarketplace]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleToggleHide = () => handleShowGraph();

  const handleSubNavClick = useCallback(
    (selectedTitle: string) => {
      setSelectedSubNavTitle(selectedTitle);
      handleSelectedAdvertisingNavTitle(selectedTitle);
      handleCloseColumnFilter();
      dispatch(setShowFilterModal(false));
    },
    [dispatch, handleSelectedAdvertisingNavTitle]
  );

  const handleShowColumnFilter = () => {
    setShowColumnFilter(!showColumnFilter);
    if (showFilterModal) toggleModal();
  };

  const handleCloseColumnFilter = () => {
    setShowColumnFilter(false);
  };

  useEffect(() => {
    let title = '';

    if (selectedNavTab.options.length > 0) {
      selectedNavTab.options.forEach((option) => {
        if (option.value === selectedAdvertisingNavTitle) {
          title = selectedAdvertisingNavTitle;
        } else title = selectedNavTab.options[0].value;
      });
    } else {
      title = selectedNavTab.value;
    }

    handleSubNavClick(title);
  }, [
    selectedNavTab,
    handleSubNavClick,
    selectedAdvertisingNavTitle,
    dispatch,
  ]);

  const toggleModal = () => {
    dispatch(setShowFilterModal(!showFilterModal));
    if (showColumnFilter) handleCloseColumnFilter();
  };
  const filterToggleButton = () => {
    dispatch(setFilters(appliedFilters));

    toggleModal();
  };

  const handleCustomSearch = (searchValue: string) => {
    const filteredData = searchUtils.getSearchTableData(
      initialRows,
      searchValue,
      selectedAdvertisingNavTitle
    );
    setUpdatedRows(filteredData);
  };

  return (
    <div className={styles.Container}>
      {!selectedNavTab.options.length ? (
        <div>
          <h3 className={styles.selectedOptionTitle}>{selectedNavTab.label}</h3>
        </div>
      ) : (
        <div
          className={`${styles.titleArr} ${
            isTableDataLoading === true && styles.disabledContainerItems
          }`}
        >
          {selectedNavTab.options.map((item, index) => (
            <SubNavItem
              key={`${item.value}-${index}`}
              item={item}
              handleSubNavClick={handleSubNavClick}
              selectedSubNavTitle={selectedSubNavTitle}
              disabled={isTableDataLoading}
            />
          ))}
        </div>
      )}

      {isTableDataLoading === false && (
        <div className={styles.tableHeaderButtons}>
          {areActionButtonsRequired === true && (
            <React.Fragment>
              <ServerSearch
                title={selectedAdvertisingNavTitle}
                height="3rem"
                handleCustomSearchChange={handlePaginationModelReset}
              />

              {(selectedAdvertisingNavTitle ===
                SpAdGroupLevelTitles.PRODUCT_ADS ||
                selectedAdvertisingNavTitle ===
                  SdAdGroupLevelTitles.PRODUCT_ADS) && (
                <PrimaryButton
                  buttonText="Add Product Ads"
                  width="14rem"
                  height="3rem"
                  buttonFunction={handleOpenDialog}
                  isButtonIconRequired={false}
                  disabled={false}
                />
              )}
              {(selectedAdvertisingNavTitle ===
                WalmartSPAdGroupLevelTitles.AD_ITEMS ||
                selectedAdvertisingNavTitle ===
                  WalmartSBAdGroupLevelTitles.AD_ITEMS ||
                selectedAdvertisingNavTitle ===
                  WalmartSVAdGroupLevelTitles.AD_ITEMS) && (
                <PrimaryButton
                  buttonText="Add Product Ads"
                  width="14rem"
                  height="3rem"
                  buttonFunction={handleOpenDialog}
                  isButtonIconRequired={false}
                  disabled={
                    isAddFuncDisabledByReviewStatus ||
                    isReviewFlagEnabled === false
                  }
                  isHoverTooltipEnabled={isAddFuncDisabledByReviewStatus}
                  tooltipText={
                    isAddFuncDisabledByReviewStatus === true
                      ? DISABLE_TOOLTIP.CAMPAIGN_REVIEW
                      : ''
                  }
                />
              )}

              {(selectedAdvertisingNavTitle ===
                SpAdGroupLevelTitles.PRODUCT_TARGETING ||
                selectedAdvertisingNavTitle ===
                  SbAdGroupLevelTitles.PRODUCT_TARGETING) && (
                <PrimaryButton
                  buttonText="Add Product Targets"
                  width="16rem"
                  height="3rem"
                  buttonFunction={handleOpenDialog}
                  isButtonIconRequired={false}
                  disabled={false}
                />
              )}
              {(selectedAdvertisingNavTitle ===
                SpAdGroupLevelTitles.KEYWORD_TARGETING ||
                selectedAdvertisingNavTitle ===
                  SbAdGroupLevelTitles.KEYWORD_TARGETING) && (
                <PrimaryButton
                  buttonText="Add Keywords"
                  width="12rem"
                  height="3rem"
                  buttonFunction={handleOpenDialog}
                  isButtonIconRequired={false}
                  disabled={false}
                />
              )}
              {(selectedAdvertisingNavTitle ===
                WalmartSPAdGroupLevelTitles.KEYWORD_TARGETING ||
                selectedAdvertisingNavTitle ===
                  WalmartSBAdGroupLevelTitles.KEYWORD_TARGETING ||
                selectedAdvertisingNavTitle ===
                  WalmartSVAdGroupLevelTitles.KEYWORD_TARGETING) && (
                <PrimaryButton
                  buttonText="Add Keywords"
                  width="12rem"
                  height="3rem"
                  buttonFunction={handleOpenDialog}
                  isButtonIconRequired={false}
                  disabled={
                    isAddFuncDisabledByReviewStatus ||
                    isReviewFlagEnabled === false
                  }
                  isHoverTooltipEnabled={isAddFuncDisabledByReviewStatus}
                  tooltipText={
                    isAddFuncDisabledByReviewStatus === true
                      ? DISABLE_TOOLTIP.CAMPAIGN_REVIEW
                      : ''
                  }
                />
              )}
              {(selectedAdvertisingNavTitle ===
                SpAdGroupLevelTitles.NEG_TARGETING_KEYWORD ||
                selectedAdvertisingNavTitle ===
                  SbAdGroupLevelTitles.NEG_TARGETING_KEYWORD) && (
                <PrimaryButton
                  buttonText="Add Negative Keywords"
                  width="18rem"
                  height="3rem"
                  buttonFunction={handleOpenDialog}
                  isButtonIconRequired={false}
                  disabled={false}
                />
              )}

              {(selectedAdvertisingNavTitle ===
                SpAdGroupLevelTitles.NEG_TARGETING_PRODUCT ||
                selectedAdvertisingNavTitle ===
                  SbAdGroupLevelTitles.NEG_TARGETING_PRODUCT) && (
                <PrimaryButton
                  buttonText="Add Negative Products"
                  width="18rem"
                  height="3rem"
                  buttonFunction={handleOpenDialog}
                  isButtonIconRequired={false}
                  disabled={false}
                />
              )}
              {isMetricDropdownRequired && onMetricDropdownChange && (
                <Dropdown
                  options={
                    metricDropdownData?.metricOptions as IDropdownItem<string>[]
                  }
                  selected={
                    metricDropdownData?.metricFilter as IDropdownItem<string>
                  }
                  label={''}
                  onSelect={onMetricDropdownChange}
                  onMouseDown={handleCloseColumnFilter}
                  width="15rem"
                  height="3rem"
                  background="#ffffff"
                />
              )}
              {columnsToFilter &&
                setSelectedColumns &&
                _selectedColumns &&
                columnsToFilter.length > 0 && (
                  <React.Fragment>
                    <div style={{ position: 'relative' }} ref={filterRef}>
                      {showFilterModal === true && (
                        <RowFilterWrapper
                          handleModalClose={toggleModal}
                          filterConfig={getFilterConfigByMarketplace(
                            columnsToFilter,
                            selectedMarketplace,
                            selectedAdvertisingNavTitle,
                            dynamicTagNameFilterSetting
                          )}
                          isDataLoaded={!isTableDataLoading}
                          selectedAdvertisingNavTitle={
                            selectedAdvertisingNavTitle as AdvertisingTitlesEnum
                          }
                          onFilterApply={handlePaginationModelReset}
                        />
                      )}

                      <SecondaryButton
                        buttonText={'Filter'}
                        buttonFunction={filterToggleButton}
                        isButtonIconRequired
                        buttonIcon={
                          <FadersIcon size={15} weight="fill" color="#464646" />
                        }
                        disabled={false}
                        height="3rem"
                      />
                    </div>

                    {showColumnFilterComp === true && (
                      <div
                        style={{ position: 'relative' }}
                        ref={columnFilterRef}
                      >
                        {showColumnFilter && (
                          <NewColumnFilterWrapper
                            columns={columnsToFilter}
                            getSelectedColumns={setSelectedColumns}
                            closeColumnFilter={handleCloseColumnFilter}
                            _selectedColumns={_selectedColumns}
                            style={{ zIndex: 3 }}
                            selectedTableTitle={selectedAdvertisingNavTitle}
                          />
                        )}
                        <SecondaryButton
                          buttonText={'Columns'}
                          buttonFunction={handleShowColumnFilter}
                          isButtonIconRequired
                          buttonIcon={<ColumnsIcon size={15} color="#464646" />}
                          height="3rem"
                          disabled={false}
                        />
                      </div>
                    )}
                  </React.Fragment>
                )}
              <DownloadTableButton
                hoverInfoText="Download CSV"
                data={exportData}
                filename={exportFileTitle}
                squareDimension="3rem"
                enclosingCharacter='"'
                title={selectedAdvertisingNavTitle}
                handleDownload={handleDownload}
                accountType={selectedAdvertisingAccountType}
              />
            </React.Fragment>
          )}

          {hideGraph === true && (
            <Button
              className={styles.showChartButton}
              disableRipple
              onClick={handleToggleHide}
            >
              Show Chart
            </Button>
          )}

          {openDialog === true && (
            <AdvertisingCreateDialogs
              openDialog={openDialog}
              handleCloseDialog={handleCloseDialog}
              selectedTitle={selectedAdvertisingNavTitle}
              selectedCampaignId={selectedCampaignId as string | number}
              selectedAdGroupId={selectedAdGroupId as string | number}
              walmartTargeting={
                initialRows[0]?.targetingType as TargetingTypeEnum
              }
              selectedAdGroup={selectedAdGroup}
            />
          )}
        </div>
      )}
    </div>
  );
}

interface ISubNavItemProps {
  item: ISubNavItem;
  handleSubNavClick: (value: string) => void;
  selectedSubNavTitle: string;
  disabled: boolean;
}
const SubNavItem: React.FC<ISubNavItemProps> = ({
  item,
  handleSubNavClick,
  selectedSubNavTitle,
  disabled,
}) => {
  return (
    <p
      onClick={() => {
        if (disabled) return;
        handleSubNavClick(item.value);
      }}
      style={{
        color: !disabled
          ? selectedSubNavTitle === item.value
            ? '#77469b'
            : '#000'
          : 'rgba(0, 0, 0, 0.26)',
        fontWeight: selectedSubNavTitle === item.value ? '700' : '500',
      }}
    >
      {item.label}
    </p>
  );
};
