import ProfitabilityAccordion from '@/app/components/page-components/profitability/profitability-accordion/profitability-accordion';
import ProfitabilityTableHeader from '@/app/components/page-components/profitability/profitability-table-header/profitability-table-header';
import CustomTableWrapper from '@/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { UPDATED_PAGINATION_MODEL } from '@/constants';
import { ColumnNameEnum } from '@/enums/advertising.enums';
import { ProfitabilityTableTypeEnum } from '@/enums/profitability.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { useOutsideClick } from '@/hooks/use-outside-click.hook';
import { ICustomTableStyles } from '@/interfaces/custom-table/custom-table.interfaces';
import {
  IProfitabilityCardMetricDisplay,
  IProfitabilityTotalResponse,
  ITotalProductData,
} from '@/interfaces/profitability/profitability.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectSelectedRowData,
  setSelectedRowData,
} from '@/redux/slices/profitability/profitability.slice';
import { getUpdatedPagination } from '@/utils';
import { checkIsNull, generateExportFileName } from '@/utils/advertising.utils';
import { profitabilityUtils } from '@/utils/profitability.utils';
import { getFilterConfigByMarketplace } from '@/utils/row-filter.utils';
import {
  ColumnDef,
  ExpandedState,
  OnChangeFn,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import { useCallback, useMemo, useRef } from 'react';
import { getTableAccordionStyles } from '../../pages/profitability-page/profitability-styles';
import styles from './profitability-table-container.module.scss';

interface ProfitabilityTableContainerProps<T> {
  currentTable: ProfitabilityTableTypeEnum;
  isLoading: boolean;
  isOrdersTable: boolean;
  handleTableSwitch: () => void;
  handleSelectedColumns: (selectedColumns: Array<ColumnDef<T>>) => void;
  selectedColumns: Array<ColumnDef<T>>;
  allTableColumns: Array<ColumnDef<T>>;
  handleDownload: (
    isAllDownload: boolean
  ) => Promise<Record<string, unknown>[]>;
  tableAccordionExpandedItems: Set<string>;
  onTableAccordionMetricsExpand: (itemId: string, index: number) => void;
  tableData: T[] | null;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
  expandedState: ExpandedState;
  setExpandedState: OnChangeFn<ExpandedState>;
  totalData?: IProfitabilityTotalResponse | ITotalProductData;
  totalRowCount: number;
  isPnL?: boolean;
  tableCalculatedMetrics: IProfitabilityCardMetricDisplay[];
  marketplace: MarketplaceEnum;
}

function ProfitabilityTableContainer<T>({
  currentTable,
  isLoading,
  isOrdersTable,
  handleTableSwitch,
  handleSelectedColumns,
  selectedColumns,
  allTableColumns,
  handleDownload,
  tableAccordionExpandedItems,
  onTableAccordionMetricsExpand,
  tableData,
  pagination,
  setPagination,
  sorting,
  setSorting,
  expandedState,
  setExpandedState,
  totalData,
  totalRowCount,
  isPnL = false,
  tableCalculatedMetrics,
  marketplace,
}: ProfitabilityTableContainerProps<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const selectedRowData = useAppSelector(selectSelectedRowData);

  const tableAccordionData = profitabilityUtils.getTableAccordionData(
    selectedRowData,
    currentTable
  );
  const tableAccordionTotalExpandableItems = useMemo(() => {
    if (!tableAccordionData) return 0;

    return profitabilityUtils.getTotalExpandableItems(
      tableAccordionData[0]?.children || []
    );
  }, [tableAccordionData]);

  const onTableSwitch = () => {
    setPagination(UPDATED_PAGINATION_MODEL);
    handleTableSwitch();
  };

  const handleTableAccordionClose = () => {
    dispatch(
      setSelectedRowData({
        index: null,
        rowData: null,
      })
    );
  };

  useOutsideClick({
    containerRef,
    handleClose: handleTableAccordionClose,
  });

  const handlePaginationReset = useCallback(() => {
    setPagination(getUpdatedPagination);
  }, []);

  const filterConfig = getFilterConfigByMarketplace(
    allTableColumns,
    marketplace,
    currentTable
  );

  const customStyles: ICustomTableStyles = {
    thead: {
      tr: {
        th: {
          wrapper: '!p-1',
        },
      },
    },
    tbody: {
      tr: {
        td: {
          wrapper: '!p-2',
        },
      },
    },
    tfoot: {
      tr: {
        td: {
          wrapper: isLoading ? '!py-0' : '',
        },
      },
    },
  };

  return (
    <div className={styles.tableContainer}>
      <ProfitabilityTableHeader
        isLoading={isLoading}
        isOrdersTable={isOrdersTable}
        handleTableSwitch={onTableSwitch}
        handleSelectedColumns={handleSelectedColumns}
        selectedColumns={selectedColumns}
        initialColumns={allTableColumns}
        filterConfig={filterConfig}
        title={currentTable}
        exportFileName={generateExportFileName(currentTable)}
        handleDownload={handleDownload}
        onSearchChangeAdditionalLogic={handlePaginationReset}
        isPnL={isPnL}
      />
      <div className="relative w-full">
        {checkIsNull(tableAccordionData) === false && (
          <div ref={containerRef} style={getTableAccordionStyles}>
            <ProfitabilityAccordion
              activeCardNumber={0}
              handleClose={handleTableAccordionClose}
              expandedItems={tableAccordionExpandedItems}
              setExpandedItems={onTableAccordionMetricsExpand}
              isLoading={isLoading}
              isTable={true}
              totalExpandableItems={tableAccordionTotalExpandableItems}
              accordionData={tableAccordionData}
              calculatedMetrics={tableCalculatedMetrics}
            />
          </div>
        )}
        <CustomTableWrapper
          data={tableData ?? []}
          columns={selectedColumns}
          width={'100%'}
          height={'60rem'}
          isLoading={isLoading}
          rowCount={totalRowCount}
          showCellSkeleton={true}
          pagination={pagination}
          setPagination={setPagination}
          getSubRows={profitabilityUtils.getSubRows}
          sorting={sorting}
          setSorting={setSorting}
          enableExpanding={true}
          expandedState={expandedState}
          setExpandedState={setExpandedState}
          manualPagination={true}
          manualSorting={true}
          totalData={totalData}
          isFooterRequired={true}
          disableUndefinedSorting={true}
          initialPinnedColumns={{
            left: [
              ColumnNameEnum.PROFITABILITY_ORDER_DETAILS,
              ColumnNameEnum.PROFITABILITY_PRODUCT_DETAILS,
            ],
            right: [ColumnNameEnum.MORE_INFO],
          }}
          enableVirtualization={true}
          customStyles={customStyles}
        />
      </div>
    </div>
  );
}

export default ProfitabilityTableContainer;
