import CustomTableWrapper from '@/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { RULES_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import { ICustomTableStyles } from '@/interfaces/custom-table/custom-table.interfaces';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  IFinalFilters,
  selectAppliedFilters,
  selectShowFilterModal,
  setShowFilterModal,
} from '@/redux/slices/filters/filter.slice';
import { selectIsRuleArchived } from '@/redux/slices/rules/rules.slice';
import { getTableTitle, getTitleCaseString, remToPx } from '@/utils';
import {
  getFilterConfigByMarketplace,
  getFilteredTableData,
  getStoredLsFilters,
  syncStoredLsFilters,
} from '@/utils/row-filter.utils';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import {
  FunnelIcon,
  NoteIcon,
  PlusIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import AddedFiltersTab from '../../common/added-filters-tab/added-filters-tab';
import AltPrimaryButton from '../../common/alt-primary-button/alt-primary-button';
import RowFilterWrapper from '../../common/row-filter/row-filter-wrapper';
import SyncFilters from '../../hoc/sync-filters';
import { textboxNewStyles } from '../../pages/rules-page/rules-page-features/rules-page-agents/rules-page-form/rules-page-form-styles';
import styles from './dual-table-wrapper.module.scss';

export interface DualTableWrapperProps<T> {
  tableTitle: string;
  getSelectedTableTitle: (isSourceTable: boolean) => string;
  sourceTableData: Array<T>;
  sourceTableColumns: Array<ColumnDef<T>>;
  marketplace: MarketplaceEnum;
  sourceTableRowSelection?: RowSelectionState;
  sourceTableSetRowSelection?: React.Dispatch<
    React.SetStateAction<RowSelectionState>
  >;
  sourceTableActionLabel: string;
  sourceTableActionDisabled: boolean;
  onFirstTableAction: () => void;
  isFirstTableLoading?: boolean;
  selectedRowTableData: Array<T>;
  selectedRowTableColumns: Array<ColumnDef<T>>;
  selectedRowTableRowSelection?: RowSelectionState;
  selectedRowTableSetRowSelection?: React.Dispatch<
    React.SetStateAction<RowSelectionState>
  >;
  selectedRowTableActionLabel: string;
  selectedRowTableActionDisabled: boolean;
  onSecondTableAction: () => void;
  tableHeight?: string;
  getRowId?: (originalRow: T, index: number) => string;
  placeholder?: string;
  onSourceTableSearch?: (searchText: string) => void;
  sourceTableSearchKeyList: Array<keyof T>;
  selectedTableSearchKeyList: Array<keyof T>;
}

export function DualTableWrapper<T>(props: DualTableWrapperProps<T>) {
  const {
    tableTitle = 'Records',
    getSelectedTableTitle,
    sourceTableData,
    sourceTableColumns,
    sourceTableRowSelection,
    sourceTableSetRowSelection,
    sourceTableActionLabel,
    sourceTableActionDisabled,
    onFirstTableAction,
    isFirstTableLoading = false,
    selectedRowTableData,
    selectedRowTableColumns,
    selectedRowTableRowSelection,
    selectedRowTableSetRowSelection,
    selectedRowTableActionLabel,
    selectedRowTableActionDisabled,
    onSecondTableAction,
    tableHeight = '60rem',
    getRowId,
    marketplace,
    placeholder = 'Search by Name/ID',
    onSourceTableSearch,
    sourceTableSearchKeyList,
    selectedTableSearchKeyList,
  } = props;
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const showFilterModal = useAppSelector(selectShowFilterModal);
  const isRuleArchived = useAppSelector(selectIsRuleArchived);
  const dispatch = useAppDispatch();

  const [showSecondTableFilterModal, setShowSecondTableFilterModal] =
    useState(false);
  const [secondTableFilters, setSecondTableFilters] = useState<IFinalFilters[]>(
    []
  );
  const [secondTableAppliedFilters, setSecondTableAppliedFilters] = useState<
    IFinalFilters[]
  >([]);
  const [secondTableClickedFilterId, setSecondTableClickedFilterId] =
    useState<string>('');
  const [sourceSearchText, setSourceSearchText] = useState<string>('');
  const [selectedSearchText, setSelectedSearchText] = useState<string>('');

  useEffect(() => {
    const storedFilters = getStoredLsFilters(getSelectedTableTitle(false));
    if (storedFilters && storedFilters.length > 0) {
      setSecondTableAppliedFilters(storedFilters);
      setSecondTableFilters(storedFilters);
    }
  }, [getSelectedTableTitle]);

  const filteredSourceTableData = useMemo(
    () =>
      getFilteredTableData(
        sourceTableData,
        appliedFilters,
        sourceSearchText,
        sourceTableSearchKeyList
      ),
    [
      sourceTableData,
      appliedFilters,
      sourceSearchText,
      sourceTableSearchKeyList,
    ]
  );

  const filteredSelectedTableData = useMemo(
    () =>
      getFilteredTableData(
        selectedRowTableData,
        secondTableAppliedFilters,
        selectedSearchText,
        selectedTableSearchKeyList
      ),
    [
      selectedRowTableData,
      secondTableAppliedFilters,
      selectedSearchText,
      selectedTableSearchKeyList,
    ]
  );

  const toggleSourceTableFilter = () => {
    dispatch(setShowFilterModal(!showFilterModal));
  };

  const toggleSecondTableFilter = () => {
    setShowSecondTableFilterModal(!showSecondTableFilterModal);
  };

  const handleSourceTableSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSourceSearchText(event.target.value);
    onSourceTableSearch?.(event.target.value);
  };

  const handleSelectedTableSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedSearchText(event.target.value);
  };

  const customStyles: ICustomTableStyles = {
    tbody: {
      tr: {
        td: {
          wrapper: styles.tableTdWrapper,
          tdDiv: styles.tableTdDiv,
        },
      },
    },
    thead: {
      tr: {
        th: {
          className: styles.tableThClassName,
          tdDiv: styles.tableThDiv,
          wrapper: styles.tableThWrapper,
        },
      },
    },
  };

  const selectedRowTableNoResultsOverlay = useMemo(() => {
    return (
      <div className={styles.noResultsOverlay}>
        <NoteIcon size={'2rem'} color="#8b8b8b" weight="fill" />
        <p>There isn't any {tableTitle} added in the list.</p>
      </div>
    );
  }, [tableTitle]);

  const allItemsAddedOverlay = useMemo(() => {
    return sourceSearchText !== '' &&
      filteredSourceTableData.length === 0 &&
      selectedRowTableRowSelection &&
      Object.keys(selectedRowTableRowSelection).length === 0 ? (
      selectedRowTableNoResultsOverlay
    ) : (
      <div className={styles.noResultsOverlay}>
        <NoteIcon size={'2rem'} color="#8b8b8b" weight="fill" />
        <p>All {tableTitle} have been added to the list.</p>
      </div>
    );
  }, [
    filteredSourceTableData,
    sourceSearchText,
    selectedRowTableRowSelection,
    selectedRowTableNoResultsOverlay,
    tableTitle,
  ]);

  return (
    <div className={styles.container}>
      <SyncFilters selectedNavTitle={getSelectedTableTitle(true)}>
        <div className={styles.tableSection}>
          <div className={styles.header}>
            <div className={styles.titleRow}>
              <Typography
                fontSize="1.6rem"
                fontWeight={700}
                lineHeight="2.4rem"
              >
                {getTitleCaseString(getTableTitle(tableTitle, true))}
                {filteredSourceTableData.length > 0 && (
                  <span className={styles.totalCount}>{`${Math.min(
                    Object.keys(sourceTableRowSelection || {}).length,
                    filteredSourceTableData.length
                  )}/${filteredSourceTableData.length}`}</span>
                )}
              </Typography>
            </div>
            <div className={styles.actionsRow}>
              <Popover
                open={showFilterModal}
                onOpenChange={toggleSourceTableFilter}
              >
                <PopoverTrigger>
                  <AltPrimaryButton
                    buttonText="Filter"
                    height="2.4rem"
                    width="auto"
                    buttonFunction={toggleSourceTableFilter}
                    isButtonIconRequired={true}
                    buttonIcon={<FunnelIcon size={'1.5rem'} color="#464646" />}
                    disabled={false}
                    isNewDesign={true}
                  />
                </PopoverTrigger>
                <PopoverContent
                  style={{
                    position: 'absolute',
                    right: remToPx(-14.6),
                    top: remToPx(-3),
                    height: '100%',
                    background: 'transparent',
                    boxShadow: 'none',
                    border: 'none',
                  }}
                >
                  <RowFilterWrapper
                    handleModalClose={toggleSourceTableFilter}
                    filterConfig={getFilterConfigByMarketplace(
                      sourceTableColumns,
                      marketplace,
                      getTableTitle(tableTitle, true)
                    )}
                    isDataLoaded={!isFirstTableLoading}
                    selectedAdvertisingNavTitle={getSelectedTableTitle(true)}
                  />
                </PopoverContent>
              </Popover>

              <AltPrimaryButton
                buttonText={sourceTableActionLabel}
                height="2.4rem"
                width="auto"
                buttonFunction={onFirstTableAction}
                isButtonIconRequired={true}
                buttonIcon={
                  <PlusIcon
                    size={'1.5rem'}
                    color={sourceTableActionDisabled ? '#BDBDBD' : '#464646'}
                    aria-disabled={sourceTableActionDisabled}
                  />
                }
                disabled={sourceTableActionDisabled || isRuleArchived}
                isHoverTooltipEnabled={
                  (sourceTableData.length !== 0 && sourceTableActionDisabled) ||
                  isRuleArchived
                }
                tooltipText={
                  isRuleArchived
                    ? RULES_TOOLTIPS.ARCHIVED
                    : sourceTableData.length !== 0 && sourceTableActionDisabled
                    ? 'Select one or more rows to add.'
                    : ''
                }
                isNewDesign={true}
              />
            </div>
          </div>
          <div className={styles.searchAndActionsWrapper}>
            <OutlinedInput
              type="text"
              fullWidth
              onChange={handleSourceTableSearch}
              value={sourceSearchText}
              placeholder={placeholder}
              sx={{
                ...textboxNewStyles,
                height: '3rem',
                marginBottom: '1rem',
              }}
            />
            <div className="mb-[-0.4rem] w-full">
              <AddedFiltersTab
                appliedFilters={appliedFilters}
                selectedAdvertisingNavTitle={getSelectedTableTitle(true)}
                isLoading={false}
                isCompact={true}
                noFilterText="Apply Filters to see results"
              />
            </div>
          </div>

          <div className={styles.tableContainer}>
            <CustomTableWrapper
              data={filteredSourceTableData}
              columns={sourceTableColumns}
              getRowId={getRowId}
              width="100%"
              borderRadius="0.8rem"
              height={tableHeight}
              isLoading={isFirstTableLoading}
              enableRowSelection={(row) => !isRuleArchived}
              rowSelection={sourceTableRowSelection}
              setRowSelection={sourceTableSetRowSelection}
              noResultsOverlay={allItemsAddedOverlay}
              pagination={{
                pageIndex: 0,
                pageSize: filteredSourceTableData.length,
              }}
              customStyles={customStyles}
              rowCount={filteredSourceTableData.length}
              manualSorting={false}
              isPaginationRequired={false}
              fixedHeight={true}
            />
          </div>
        </div>
      </SyncFilters>

      <div className={styles.tableSection}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <Typography fontSize="1.6rem" fontWeight={700} lineHeight="2.4rem">
              {getTitleCaseString(getTableTitle(tableTitle, false))}
              {filteredSelectedTableData.length > 0 && (
                <span className={styles.totalCount}>
                  {filteredSelectedTableData.length}
                </span>
              )}
            </Typography>
          </div>
          <div className={styles.actionsRow}>
            <Popover
              open={showSecondTableFilterModal}
              onOpenChange={toggleSecondTableFilter}
            >
              <PopoverTrigger>
                <AltPrimaryButton
                  buttonText="Filter"
                  height="2.4rem"
                  width="auto"
                  buttonFunction={toggleSecondTableFilter}
                  isButtonIconRequired={true}
                  buttonIcon={<FunnelIcon size={'1.5rem'} color="#464646" />}
                  disabled={false}
                  isNewDesign={true}
                />
              </PopoverTrigger>
              <PopoverContent
                style={{
                  position: 'absolute',
                  right: remToPx(-12.6),
                  top: remToPx(-3),
                  height: '100%',
                  background: 'transparent',
                  boxShadow: 'none',
                  border: 'none',
                }}
              >
                <RowFilterWrapper
                  handleModalClose={toggleSecondTableFilter}
                  filterConfig={getFilterConfigByMarketplace(
                    selectedRowTableColumns,
                    marketplace,
                    getTableTitle(tableTitle, false)
                  )}
                  isDataLoaded={true}
                  selectedAdvertisingNavTitle={getTableTitle(tableTitle, false)}
                  externalFilters={secondTableFilters}
                  externalAppliedFilters={secondTableAppliedFilters}
                  onFiltersChange={setSecondTableFilters}
                  onAppliedFiltersChange={(filters) => {
                    setSecondTableAppliedFilters(filters);
                    syncStoredLsFilters(getSelectedTableTitle(false), filters);
                  }}
                  externalClickedFilterId={secondTableClickedFilterId}
                />
              </PopoverContent>
            </Popover>

            <AltPrimaryButton
              buttonText={selectedRowTableActionLabel}
              height="2.4rem"
              width="auto"
              buttonFunction={onSecondTableAction}
              isButtonIconRequired={true}
              buttonIcon={
                <TrashIcon
                  size={'1.5rem'}
                  color={selectedRowTableActionDisabled ? '#BDBDBD' : '#464646'}
                  aria-disabled={selectedRowTableActionDisabled}
                />
              }
              disabled={selectedRowTableActionDisabled || isRuleArchived}
              isHoverTooltipEnabled={
                (filteredSelectedTableData.length !== 0 &&
                  selectedRowTableActionDisabled) ||
                isRuleArchived
              }
              tooltipText={
                isRuleArchived
                  ? RULES_TOOLTIPS.ARCHIVED
                  : filteredSelectedTableData.length !== 0 &&
                    selectedRowTableActionDisabled
                  ? 'Select one or more rows to remove.'
                  : ''
              }
              isNewDesign={true}
            />
          </div>
        </div>
        <div className={styles.searchAndActionsWrapper}>
          <OutlinedInput
            type="text"
            fullWidth
            onChange={handleSelectedTableSearch}
            value={selectedSearchText}
            placeholder={placeholder}
            sx={{
              ...textboxNewStyles,
              height: '3rem',
              marginBottom: '1rem',
            }}
          />
          <div className="mb-[-0.4rem] w-full">
            <AddedFiltersTab
              appliedFilters={secondTableAppliedFilters}
              selectedAdvertisingNavTitle={getSelectedTableTitle(false)}
              isLoading={false}
              externalFilters={secondTableFilters}
              externalAppliedFilters={secondTableAppliedFilters}
              onFiltersChange={setSecondTableFilters}
              onAppliedFiltersChange={(filters) => {
                setSecondTableAppliedFilters(filters);
                syncStoredLsFilters(getSelectedTableTitle(false), filters);
              }}
              onShowFilterModal={setShowSecondTableFilterModal}
              onSetClickedFilterId={setSecondTableClickedFilterId}
              isCompact={true}
              noFilterText="Apply Filters to see results"
            />
          </div>
        </div>

        <div className={styles.tableContainer}>
          <CustomTableWrapper
            data={filteredSelectedTableData}
            columns={selectedRowTableColumns}
            getRowId={getRowId}
            width="100%"
            borderRadius="0.8rem"
            height={tableHeight}
            pagination={{
              pageIndex: 0,
              pageSize: filteredSelectedTableData.length,
            }}
            enableRowSelection={(row) => !isRuleArchived}
            rowSelection={selectedRowTableRowSelection}
            setRowSelection={selectedRowTableSetRowSelection}
            noResultsOverlay={selectedRowTableNoResultsOverlay}
            isLoading={false}
            customStyles={customStyles}
            rowCount={filteredSelectedTableData.length}
            manualSorting={false}
            isPaginationRequired={false}
            fixedHeight={true}
          />
        </div>
      </div>
    </div>
  );
}

export default DualTableWrapper;
