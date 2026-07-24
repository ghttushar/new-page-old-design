import AddedFiltersTab from '@/app/components/common/added-filters-tab/added-filters-tab';
import AltPrimaryButton from '@/app/components/common/alt-primary-button/alt-primary-button';
import RowFilterWrapper from '@/app/components/common/row-filter/row-filter-wrapper';
import ServerSearch from '@/app/components/common/search/server-search';
import ViewEditToggleAppliedRulesWrapper from '@/app/components/common/view-edit-toggle/view-edit-toggle-wrappers/view-edit-toggle-applied-rules-wrapper';
import CustomTableWrapper from '@/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { PAGE_SIZE_OPTIONS } from '@/constants';
import { APPLIED_RULES_FILTER_CONFIG } from '@/constants/filter.constants';
import { EditAccessValues } from '@/enums/edit-access.enums';
import { RuleStatusEnum, RulesPageTitleEnum } from '@/enums/rules.enum';
import { IAppliedRuleResponse } from '@/interfaces/rules/rules.interfaces';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectEditAccessFilters,
  selectSelectedRows,
  setSelectedRows,
} from '@/redux/slices/advertising/advertising-edit-access.slice';
import {
  IFinalFilters,
  selectShowFilterModal,
  setShowFilterModal,
} from '@/redux/slices/filters/filter.slice';
import { remToPx } from '@/utils';
import customTableUtils from '@/utils/custom-table.utils';
import { FunnelIcon } from '@phosphor-icons/react';
import {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import { customTableStyles } from './rules-page-applied-rules-styles';
import styles from './rules-page-applied-rules.module.scss';

interface IRulesPageAppliedRulesProps {
  data: Array<IAppliedRuleResponse>;
  columns: ColumnDef<IAppliedRuleResponse>[];
  isLoading: boolean;
  totalItems: number | string;
  paginationModel: PaginationState;
  setPaginationModel: React.Dispatch<React.SetStateAction<PaginationState>>;
  sortModel: SortingState;
  setSortModel: React.Dispatch<React.SetStateAction<SortingState>>;
  handleResetPagination: () => void;
  appliedFilters: IFinalFilters[];
}

export default function RulesPageAppliedRules({
  data,
  columns,
  isLoading,
  totalItems,
  paginationModel,
  setPaginationModel,
  sortModel,
  setSortModel,
  handleResetPagination,
  appliedFilters,
}: IRulesPageAppliedRulesProps) {
  const showFilterModal = useAppSelector(selectShowFilterModal);
  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const selectedRows = useAppSelector(selectSelectedRows);
  const dispatch = useAppDispatch();

  const toggleSourceTableFilter = () => {
    dispatch(setShowFilterModal(!showFilterModal));
  };

  const handleSetRowSelection: OnChangeFn<RowSelectionState> = (
    updaterOrValue
  ) => {
    const rowSelectionState = customTableUtils.handleManualRowSelection(
      updaterOrValue,
      selectedRows
    );

    dispatch(setSelectedRows(rowSelectionState));
  };

  const isRowSelectable = (row: Row<IAppliedRuleResponse>) =>
    editAccessFilters.editAccess.value === EditAccessValues.Edit &&
    row.original.status !== RuleStatusEnum.ARCHIVED;

  return (
    <div className={styles.appliedRulesContainer}>
      <div className={styles.appliedRulesActionsContainer}>
        <ServerSearch
          title={RulesPageTitleEnum.APPLIED_RULES}
          height="3.2rem"
          width="50rem"
          handleCustomSearchChange={handleResetPagination}
          isNewDesign={true}
        />

        <Popover open={showFilterModal} onOpenChange={toggleSourceTableFilter}>
          <PopoverTrigger>
            <AltPrimaryButton
              buttonText="Filter"
              height="3.2rem"
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
              right: remToPx(-3.5),
              top: remToPx(-3),
              height: '100%',
              background: 'transparent',
              boxShadow: 'none',
              border: 'none',
            }}
          >
            <RowFilterWrapper
              handleModalClose={toggleSourceTableFilter}
              filterConfig={APPLIED_RULES_FILTER_CONFIG}
              isDataLoaded={!isLoading}
              selectedAdvertisingNavTitle={RulesPageTitleEnum.APPLIED_RULES}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className={styles.appliedRulesFiltersContainer}>
        <AddedFiltersTab
          appliedFilters={appliedFilters}
          selectedAdvertisingNavTitle={RulesPageTitleEnum.APPLIED_RULES}
          isLoading={isLoading}
          noFilterText="Apply Filters to see results"
        />
      </div>

      <ViewEditToggleAppliedRulesWrapper totalItems={totalItems} />

      <CustomTableWrapper
        data={data}
        columns={columns}
        getRowId={(originalRow) => originalRow?.ruleId}
        width="100%"
        height={appliedFilters.length > 0 ? '60rem' : '67rem'}
        isLoading={isLoading}
        enableRowSelection={isRowSelectable}
        rowSelection={selectedRows}
        setRowSelection={handleSetRowSelection}
        pageSizes={PAGE_SIZE_OPTIONS}
        rowCount={Number(totalItems)}
        manualPagination={true}
        pagination={paginationModel}
        setPagination={setPaginationModel}
        manualSorting={true}
        sorting={sortModel}
        setSorting={setSortModel}
        disableUndefinedSorting={true}
        customStyles={customTableStyles}
        isNewDesign={true}
        fixedHeight={true}
        borderRadius="8px"
      />
    </div>
  );
}
