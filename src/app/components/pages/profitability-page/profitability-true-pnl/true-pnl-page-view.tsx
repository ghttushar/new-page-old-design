import DownloadTableButton from '@/app/components/common/download-button/download-table-button';
import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import ProfitabilityTableContainer from '@/app/components/common/profitability-table-container/profitability-table-container';
import ProfitabilityPnLTable, {
  GenericFlatRowData,
} from '@/app/components/page-components/profitability/profitability-pnl-table/profitability-pnl-table';
import ProfitabilityProductSearchDropdown from '@/app/components/page-components/profitability/profitability-product-search-dropdown/profitability-product-search-dropdown';
import CustomDateRangePickerWrapper from '@/app/components/shared/custom-daterange-picker/custom-date-range-picker-wrapper';
import { ProfitabilityPnLFrequency } from '@/constants/profitability/profitability.constants';
import {
  ProfitabilityTableTitlesEnum,
  ProfitabilityTableTypeEnum,
} from '@/enums/profitability.enums';
import { Frequency, MarketplaceEnum } from '@/enums/serp.enums';
import { IMultiSelectProductSearchDropdownItem } from '@/interfaces/dropdown.interfaces';
import {
  IProfitabilityCardMetricDisplay,
  IProfitabilityTotalResponse,
} from '@/interfaces/profitability/profitability.interface';
import { IDateRange } from '@/interfaces/serp.interface';
import { IProfitabilityFilterForm } from '@/redux/slices/profitability/profitability.slice';
import {
  generateExportFileName,
  getSearchPlaceholder,
} from '@/utils/advertising.utils';
import { profitabilityUtils } from '@/utils/profitability.utils';
import {
  ColumnDef,
  ExpandedState,
  OnChangeFn,
  PaginationState,
  RowModel,
  SortingState,
} from '@tanstack/react-table';
import React, { useCallback, useState } from 'react';
import styles from './true-pnl.module.scss';

export interface ITruePNLPageViewProps<T> {
  headerFilters: IProfitabilityFilterForm | null;
  rangeOptions: IDropdownItem<string>[];
  isApplyDisabled: boolean;
  onRangeSelect: (range: IDropdownItem<string>) => void;
  setCustomDateRange: (customDateRange: IDateRange) => void;
  setFrequency: (frequency: IDropdownItem<Frequency>) => void;
  onProductSelect: (
    selectedOptions: IMultiSelectProductSearchDropdownItem[]
  ) => void;
  handleClearAllOptions: () => void;
  handleApply: () => void;
  currentTable: ProfitabilityTableTypeEnum;
  isTableLoading: boolean;
  isOrdersTable: boolean;
  selectedColumns: Array<ColumnDef<T>>;
  allTableColumns: Array<ColumnDef<T>>;
  tableAccordionExpandedItems: Set<string>;
  tableData: T[] | null;
  pagination: PaginationState;
  totalData: IProfitabilityTotalResponse | null;
  sorting: SortingState;
  expandedState: ExpandedState;
  totalRowCount: number;
  tableCalculatedMetrics: IProfitabilityCardMetricDisplay[];
  isProductDataLoading: boolean;
  marketplace: MarketplaceEnum;
  handleTableSwitch: () => void;
  handleSelectedColumns: (selectedColumns: Array<ColumnDef<T>>) => void;
  handleDownload: (
    isAllDownload: boolean
  ) => Promise<Record<string, unknown>[]>;
  handleTableDownload: (
    isAllDownload: boolean
  ) => Promise<Record<string, unknown>[]>;
  onTableAccordionMetricsExpand: (itemId: string, index: number) => void;
  setPagination: OnChangeFn<PaginationState>;
  setSorting: OnChangeFn<SortingState>;
  setExpandedState: OnChangeFn<ExpandedState>;
  flatTableData: GenericFlatRowData[];
  tableColumns: ColumnDef<GenericFlatRowData>[];
  pnlExpandedState: ExpandedState;
  setPnlExpandedState: React.Dispatch<React.SetStateAction<ExpandedState>>;
  isLoading: boolean;
  uniqueDates: string[];
}

export function TruePNLPageView<T>(props: ITruePNLPageViewProps<T>) {
  const {
    headerFilters,
    rangeOptions,
    isApplyDisabled,
    onRangeSelect,
    setCustomDateRange,
    setFrequency,
    onProductSelect,
    handleClearAllOptions,
    handleApply,
    currentTable,
    isTableLoading,
    isOrdersTable,
    selectedColumns,
    allTableColumns,
    tableAccordionExpandedItems,
    tableData,
    pagination,
    totalData,
    sorting,
    expandedState,
    totalRowCount,
    tableCalculatedMetrics,
    isProductDataLoading,
    marketplace,
    handleTableSwitch,
    handleSelectedColumns,
    handleDownload,
    handleTableDownload,
    onTableAccordionMetricsExpand,
    setPagination,
    setSorting,
    setExpandedState,
    flatTableData,
    isLoading,
    pnlExpandedState,
    setPnlExpandedState,
    tableColumns,
    uniqueDates,
  } = props;

  const [exportData, setExportData] = useState<GenericFlatRowData[]>([]);
  const getSubRows = useCallback(
    (row: GenericFlatRowData): GenericFlatRowData[] => {
      if (!row.children || row.children.length === 0) return [];

      return row.children.map((child, index) => {
        const childId = profitabilityUtils.getItemIdFromLabel(
          row.id,
          child.label,
          index
        );

        return {
          ...child,
          id: childId,
          level: row.level + 1,
          parentId: row.id,
          index,
          hasChildren: child.children && child.children.length > 0,
        } as GenericFlatRowData;
      });
    },
    []
  );

  const getPnLData = useCallback((data: RowModel<GenericFlatRowData>) => {
    const formattedPnlData = data.flatRows.map((row) => row.original);
    setExportData(formattedPnlData);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.filterContainer}>
        <ProfitabilityProductSearchDropdown
          options={headerFilters?.selectedProducts ?? []}
          width="46rem"
          height="3rem"
          placeholder={getSearchPlaceholder(currentTable)}
          onSelect={onProductSelect}
          handleClearAllOption={handleClearAllOptions}
          isLoading={isProductDataLoading}
          marketplace={marketplace}
        />

        <span className={styles.dateRangeContainer}>
          <CustomDateRangePickerWrapper
            title="Date Range"
            labelStyles={{
              fontSize: '1.1rem',
            }}
            handleDateChange={onRangeSelect}
            setCustomDateRange={setCustomDateRange}
            rangeOptions={rangeOptions}
            frequencyOptions={ProfitabilityPnLFrequency}
            defaultPreset={headerFilters?.range}
            selectedCustomDateRange={headerFilters?.customDateRange}
            selectedFrequency={headerFilters?.frequency}
            setFrequency={setFrequency}
            isProfitability={true}
          />

          <PrimaryButton
            buttonText={'Run'}
            buttonFunction={handleApply}
            disabled={isApplyDisabled}
            height="3rem"
            width="5rem"
          />

          <DownloadTableButton
            hoverInfoText="Download CSV"
            data={exportData}
            filename={generateExportFileName(
              ProfitabilityTableTitlesEnum.PROFITABILITY_PNL
            )}
            squareDimension="3.1rem"
            downloadOptionsRequired={false}
            title={ProfitabilityTableTitlesEnum.PROFITABILITY_PNL}
            isDisabled={isLoading}
            marketPlace={marketplace}
          />
        </span>
      </div>
      <div className={styles.tableContainer}>
        <ProfitabilityPnLTable
          expandedState={pnlExpandedState}
          flatTableData={flatTableData}
          tableColumns={tableColumns}
          setExpandedState={setPnlExpandedState}
          getSubRows={getSubRows}
          isLoading={isLoading || isProductDataLoading}
          uniqueDates={uniqueDates}
          getPnLData={getPnLData}
        />

        <ProfitabilityTableContainer
          currentTable={currentTable}
          isLoading={(isTableLoading || isLoading) ?? false}
          isOrdersTable={isOrdersTable}
          handleTableSwitch={handleTableSwitch}
          handleSelectedColumns={handleSelectedColumns}
          selectedColumns={selectedColumns}
          allTableColumns={allTableColumns}
          handleDownload={handleTableDownload}
          tableAccordionExpandedItems={tableAccordionExpandedItems}
          onTableAccordionMetricsExpand={onTableAccordionMetricsExpand}
          tableData={tableData}
          pagination={pagination}
          setPagination={setPagination}
          totalData={totalData ?? undefined}
          sorting={sorting}
          setSorting={setSorting}
          expandedState={expandedState}
          setExpandedState={setExpandedState}
          totalRowCount={totalRowCount}
          isPnL={true}
          tableCalculatedMetrics={tableCalculatedMetrics}
          marketplace={marketplace}
        />
      </div>
    </div>
  );
}

export default TruePNLPageView;
