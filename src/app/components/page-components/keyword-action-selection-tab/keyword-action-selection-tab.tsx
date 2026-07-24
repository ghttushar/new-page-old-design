import { MarketplaceEnum } from '@/enums/serp.enums';
import { getCurrentDateTime } from '@/utils';
import { FadersIcon } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import { Columns } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { Adjustments } from 'src/enums/advertising.enums';
import { KeywordActionTabsEnum } from 'src/enums/keyword-action.enums';
import { IKeywordActionData } from 'src/interfaces/keyword-actions.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import {
  selectShowFilterModal,
  setShowFilterModal,
} from 'src/redux/slices/filters/filter.slice';
import {
  initKeywordActionData,
  selectIsRowEdited,
  selectSelectedColumns,
  setBidErrorMessage,
  setIsRowEdited,
  setKeywordActionSelectedRowIds,
  setSelectedColumns,
} from 'src/redux/slices/keyword-action/amazon/keyword-action.slice';
import {
  selectWalmartSelectedColumns,
  setInitWalmartKeywordActionData,
  setIsWalmartRowEdited,
  setWalmartBidErrorMessage,
  setWalmartKeywordActionSelectedRowIds,
  setWalmartSelectedColumns,
} from 'src/redux/slices/keyword-action/walmart/keyword-action.slice';
import columnFilterUtils from 'src/utils/column-filter.utils';
import keywordActionsUtils from 'src/utils/keyword-actions.utils';
import ArchiveButton from '../../common/archive-button/archive-button';
import DownloadTableButton from '../../common/download-button/download-table-button';
import { IDropdownItem } from '../../common/dropdown/dropdown';
import { ConfirmationModal } from '../../common/modal/confirmation-modal';
import { CustomBidModal } from '../../common/modal/custom-bid-modal';
import { archiveConfirmationModalStyle } from '../../common/modal/keyword-action-filter-modal-styles';
import PrimaryButton from '../../common/primary-button/primary-button';
import RevertButton from '../../common/revert-button/revert-button';
import RowFilterWrapper from '../../common/row-filter/row-filter-wrapper';
import ServerSearch from '../../common/search/server-search';
import SecondaryButton from '../../common/secondary-button/secondary-button';
import NewColumnFilterWrapper from '../column-filter/new-column-filter-wrapper';
import styles from './keyword-action-selection-tab.module.scss';

interface IKeywordActionSelectionTabProps {
  addBulkKeywords: () => void;
  addBulkProducts?: () => void;
  negateBulkKeywords?: () => void;
  negateBulkProducts?: () => void;
  archiveSearchTerms: () => void;
  totalRows: number;
  selectedTab: KeywordActionTabsEnum;
  handleConfirmationModalClose: () => void;
  setShowConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirmationModal: boolean;
  title: string;
  isDataLoaded: boolean;
  handleApplyCustomBid: (
    customBid: number,
    adjustment: IDropdownItem<Adjustments>
  ) => void;
  handleDownload: (
    isAllDownload: boolean
  ) => Promise<Record<string, unknown>[]>;
  showArchiveModal: boolean;
  setShowArchiveModal: React.Dispatch<React.SetStateAction<boolean>>;
  initialKeywordAdditionData: IKeywordActionData[];
  initialKeywordNegationData: IKeywordActionData[];
  selectedRowIds: number[];
  handlePaginationReset: () => void;
}
export const KeywordActionSelectionTab: React.FC<
  IKeywordActionSelectionTabProps
> = ({
  addBulkKeywords,
  addBulkProducts,
  negateBulkKeywords,
  negateBulkProducts,
  archiveSearchTerms,
  totalRows,
  selectedTab,
  handleConfirmationModalClose,
  setShowConfirmationModal,
  showConfirmationModal,
  title,
  isDataLoaded,
  handleApplyCustomBid,
  handleDownload,
  showArchiveModal,
  setShowArchiveModal,
  initialKeywordAdditionData,
  initialKeywordNegationData,
  selectedRowIds,
  handlePaginationReset,
}) => {
  const filterRef = useRef<HTMLDivElement>(null);
  const columnFilterRef = useRef<HTMLDivElement>(null);
  const customBidRef = useRef<HTMLDivElement>(null);
  const addKeywordRef = useRef<HTMLDivElement>(null);
  const archiveRef = useRef<HTMLDivElement>(null);

  const [showCustomBidModal, setShowCustomBidModal] = React.useState(false);
  const [showColumnFilter, setShowColumnFilter] =
    React.useState<boolean>(false);
  const [isBtnDisabled, setIsBtnDisabled] = React.useState(true);

  const handleCustomBidModalClose = () => {
    setShowCustomBidModal(false);
  };

  const dispatch = useAppDispatch();

  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const marketplace = advertisingAccount.marketplace;
  const showFilterModal = useAppSelector(selectShowFilterModal);
  const isRowEdited = useAppSelector(selectIsRowEdited);
  const selectedColumnsAmazon = useAppSelector(selectSelectedColumns);
  const selectedColumnsWalmart = useAppSelector(selectWalmartSelectedColumns);

  const KEYWORD_ADDITION_TAB =
    marketplace === MarketplaceEnum.AMAZON
      ? KeywordActionTabsEnum.KEYWORD_ADDITION_AMAZON
      : KeywordActionTabsEnum.KEYWORD_ADDITION_WALMART;

  const handleCancel = () => {
    if (marketplace === MarketplaceEnum.AMAZON) {
      const initialData =
        selectedTab === KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON ||
        KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON
          ? initialKeywordNegationData
          : initialKeywordAdditionData;

      const initPayload = keywordActionsUtils.getInitData(
        initialData,
        MarketplaceEnum.AMAZON
      );
      dispatch(initKeywordActionData(initPayload));
      dispatch(setKeywordActionSelectedRowIds({}));
      dispatch(setIsRowEdited(false));
      dispatch(setBidErrorMessage(null));
    } else {
      const initPayload = keywordActionsUtils.getInitData(
        initialKeywordAdditionData,
        MarketplaceEnum.WALMART
      );
      dispatch(setInitWalmartKeywordActionData(initPayload));
      dispatch(setWalmartKeywordActionSelectedRowIds({}));
      dispatch(setIsWalmartRowEdited(false));
      dispatch(setWalmartBidErrorMessage(null));
    }
  };

  const handleCloseColumnFilter = () => {
    setShowColumnFilter(false);
    if (showFilterModal) toggleModal();
  };

  const handleShowColumnFilter = () => {
    setShowColumnFilter(!showColumnFilter);
  };

  const handleSelectedColumns = (
    selectedColumns: Array<ColumnDef<IKeywordActionData>>
  ) => {
    if (marketplace === MarketplaceEnum.AMAZON) {
      columnFilterUtils.syncStoredColumnFilters(selectedTab, selectedColumns);
      dispatch(setSelectedColumns(selectedColumns));
    } else {
      columnFilterUtils.syncStoredColumnFilters(selectedTab, selectedColumns);
      dispatch(setWalmartSelectedColumns(selectedColumns));
    }
  };

  useEffect(() => {
    const storedColumns: Array<ColumnDef<IKeywordActionData>> =
      columnFilterUtils.getStoredColumnFilters(selectedTab);

    if (marketplace === MarketplaceEnum.AMAZON) {
      dispatch(setSelectedColumns(storedColumns));
    } else {
      dispatch(setWalmartSelectedColumns(storedColumns));
    }
  }, [selectedTab, dispatch, marketplace]);

  const toggleModal = () => {
    dispatch(setShowFilterModal(!showFilterModal));
    if (showColumnFilter) handleCloseColumnFilter();
  };

  const getSelectedColumnsForMarketplace = () => {
    if (marketplace === MarketplaceEnum.AMAZON) {
      return selectedColumnsAmazon;
    } else {
      return selectedColumnsWalmart;
    }
  };

  const handleCustomBidClick = () => {
    setShowCustomBidModal(!showCustomBidModal);
  };

  useEffect(() => {
    if (isRowEdited || selectedRowIds.length) {
      setIsBtnDisabled(false);
    } else {
      setIsBtnDisabled(true);
    }
  }, [selectedRowIds, isRowEdited]);

  const btnTitleMap = new Map()
    .set(KEYWORD_ADDITION_TAB, 'Add Keywords')
    .set(KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON, 'Negate Keywords')
    .set(KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON, 'Negate Products')
    .set(KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON, 'Add Products');

  const getFilterConfig = (selectedTab: KeywordActionTabsEnum) => {
    switch (selectedTab) {
      case KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON:
        return keywordActionsUtils.getNegationFilterConfig();
      case KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON:
        return keywordActionsUtils.getProductNegationFilterConfig();
      case KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON:
        return keywordActionsUtils.getProductActionFilterConfig();
      default:
        return keywordActionsUtils.getFilterConfig();
    }
  };

  return (
    <div className={styles.selectionTabContainer}>
      <div
        style={{
          display: 'flex',
        }}
      >
        <ServerSearch
          title={title}
          handleCustomSearchChange={handlePaginationReset}
        />
      </div>
      <div className={styles.keywordActions}>
        <div className={styles.FilterUtilities}>
          <div style={{ position: 'relative' }} ref={customBidRef}>
            {showCustomBidModal && (
              <CustomBidModal
                title="Confirmation"
                message="Are you sure you want to adjust the budget? This action might affect the spends."
                customBid="0"
                handleClose={handleCustomBidModalClose}
                selectedRowIdsCount={selectedRowIds.length}
                handleApplyCustomBid={handleApplyCustomBid}
              />
            )}

            <SecondaryButton
              buttonText={'Custom Bid'}
              buttonFunction={handleCustomBidClick}
              disabled={false}
              height="3rem"
            />
          </div>

          <RevertButton
            squareDimension="3rem"
            isLoading={isBtnDisabled}
            handleRevert={handleCancel}
          />
          {(selectedTab === KEYWORD_ADDITION_TAB ||
            selectedTab === KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON) && (
            <div style={{ position: 'relative' }} ref={archiveRef}>
              <ArchiveButton
                squareDimension="3rem"
                isLoading={isBtnDisabled}
                handleArchive={() => setShowArchiveModal(!showArchiveModal)}
              />
              {showArchiveModal && (
                <ConfirmationModal
                  title={
                    keywordActionsUtils.setTitleAndMessage(
                      selectedTab,
                      selectedRowIds,
                      true
                    ).title
                  }
                  message={
                    keywordActionsUtils.setTitleAndMessage(
                      selectedTab,
                      selectedRowIds,
                      true
                    ).message
                  }
                  handleClose={() => setShowArchiveModal(false)}
                  handleKeywordOperation={archiveSearchTerms}
                  style={archiveConfirmationModalStyle}
                />
              )}
            </div>
          )}

          <div style={{ position: 'relative' }} ref={columnFilterRef}>
            {showColumnFilter && (
              <div className={styles.ColumnFilter}>
                <NewColumnFilterWrapper
                  columns={keywordActionsUtils.getKeywordActionInitColumns(
                    selectedTab
                  )}
                  getSelectedColumns={handleSelectedColumns}
                  closeColumnFilter={handleCloseColumnFilter}
                  _selectedColumns={getSelectedColumnsForMarketplace()}
                  style={{ zIndex: 3 }}
                  selectedTableTitle={selectedTab}
                />
              </div>
            )}
            <div
              className={styles.ColumnFilterContainer}
              style={{
                borderColor: showColumnFilter ? '#77469b' : '',
              }}
              onClick={handleShowColumnFilter}
            >
              <Columns size={15} />
              Columns
            </div>
          </div>

          <DownloadTableButton
            squareDimension="3rem"
            data={[]}
            enclosingCharacter='"'
            filename={`${marketplace}-keyword-action-recommendations${getCurrentDateTime()}.csv`}
            handleDownload={handleDownload}
          />

          <div style={{ position: 'relative' }} ref={filterRef}>
            {showFilterModal && (
              <div>
                <RowFilterWrapper
                  handleModalClose={toggleModal}
                  filterConfig={getFilterConfig(selectedTab)}
                  isDataLoaded={isDataLoaded}
                  disableFilterConfig={keywordActionsUtils.getKeywordActionDisableFilterConfig(
                    selectedTab
                  )}
                  selectedAdvertisingNavTitle={selectedTab}
                  onFilterApply={handlePaginationReset}
                />
              </div>
            )}
            <div
              className={styles.rowFilter}
              style={{
                borderColor: showFilterModal ? '#77469b' : '',
              }}
              onClick={toggleModal}
            >
              <FadersIcon size={15} weight="fill" color="#464646" />
              Filter
            </div>
          </div>
        </div>

        <PrimaryButton
          buttonText={btnTitleMap.get(selectedTab)}
          buttonFunction={() =>
            setShowConfirmationModal(!showConfirmationModal)
          }
          disabled={isBtnDisabled}
          width="auto"
          height="3.4rem"
        />
        <div style={{ position: 'relative' }} ref={addKeywordRef}>
          {showConfirmationModal && (
            <ConfirmationModal
              title={
                keywordActionsUtils.setTitleAndMessage(
                  selectedTab,
                  selectedRowIds
                ).title
              }
              message={
                keywordActionsUtils.setTitleAndMessage(
                  selectedTab,
                  selectedRowIds
                ).message
              }
              handleClose={handleConfirmationModalClose}
              handleKeywordOperation={() => {
                if (selectedTab === KEYWORD_ADDITION_TAB) {
                  addBulkKeywords();
                }
                if (
                  selectedTab === KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON
                ) {
                  addBulkProducts && addBulkProducts();
                }
                if (
                  selectedTab === KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON
                ) {
                  negateBulkKeywords && negateBulkKeywords();
                }
                if (
                  selectedTab === KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON
                ) {
                  negateBulkProducts && negateBulkProducts();
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
