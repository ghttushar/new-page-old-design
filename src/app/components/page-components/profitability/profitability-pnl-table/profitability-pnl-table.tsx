import CustomTableWrapper from '@/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { ColumnNameEnum } from '@/enums/advertising.enums';
import { ColumnDef, ExpandedState, RowModel } from '@tanstack/react-table';
import React from 'react';
import styles from './profitability-pnl-table.module.scss';

export interface GenericFlatRowData {
  id: string;
  level: number;
  parentId: string;
  index: number;
  hasChildren: boolean;
  label: string;
  value: string;
  percentage?: string;
  dateValues?: Record<string, string>;
  children?: GenericFlatRowData[];
}

export interface ProfitabilityPnLTableProps {
  flatTableData: GenericFlatRowData[];
  tableColumns: ColumnDef<GenericFlatRowData>[];
  expandedState: ExpandedState;
  setExpandedState: React.Dispatch<React.SetStateAction<ExpandedState>>;
  getSubRows: (row: GenericFlatRowData) => GenericFlatRowData[];
  isLoading: boolean;
  uniqueDates: string[];
  getPnLData?: (data: RowModel<GenericFlatRowData>) => void;
}

const ProfitabilityPnLTable: React.FC<ProfitabilityPnLTableProps> = ({
  flatTableData,
  tableColumns,
  expandedState,
  setExpandedState,
  getSubRows,
  isLoading,
  getPnLData,
}) => {
  return (
    <div className={styles.tableWrapper}>
      <CustomTableWrapper
        data={flatTableData}
        columns={tableColumns}
        getRowId={(row) => row.id}
        isLoading={isLoading}
        width={'100%'}
        height={isLoading ? '' : '60rem'}
        enableExpanding={true}
        expandedState={expandedState}
        setExpandedState={setExpandedState}
        getSubRows={getSubRows}
        disableSorting={true}
        manualPagination={false}
        showCellSkeleton={true}
        isAccordion={true}
        getProcessedTableData={getPnLData}
        initialPinnedColumns={{
          left: [ColumnNameEnum.PNL_PARAMETER],
          right: [ColumnNameEnum.PNL_TOTAL],
        }}
        isPaginationRequired={false}
        customStyles={{
          tbody: {
            tr: {
              td: {
                wrapper: '!p-0',
                tdDiv: '!min-h-[3rem] text-[1.1rem]',
              },
            },
          },
          thead: {
            tr: {
              th: {
                className: '!h-[1rem]',
                wrapper: isLoading ? '!py-0' : '',
              },
            },
          },
        }}
      />
    </div>
  );
};

export default ProfitabilityPnLTable;
