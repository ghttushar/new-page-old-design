import { PAGE_SIZE_OPTIONS } from '@/constants';
import { getInitialPinnedColByTitle } from '@/utils/analysis.utils';
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import CustomTableWrapper from 'src/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import {
  IAnalysisArrayData,
  IAnalysisColData,
} from 'src/interfaces/analysis.interface';
import styles from './impact-analysis-table.module.scss';

interface IImpactAnalysisTableProps {
  columns: Array<ColumnDef<IAnalysisColData>>;
  rows: IAnalysisArrayData;
  isTableLoading: boolean;
  title: string;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  totalCount: number;
}

export default function ImpactAnalysisTable({
  columns,
  rows,
  isTableLoading,
  title,
  setSorting,
  sorting,
  pagination,
  setPagination,
  totalCount,
}: IImpactAnalysisTableProps) {
  return (
    <div className={styles.wrapper}>
      <CustomTableWrapper
        data={rows}
        columns={columns}
        width="100%"
        height="60rem"
        isLoading={isTableLoading}
        pinnedColumns={getInitialPinnedColByTitle(title)}
        pageSizes={PAGE_SIZE_OPTIONS}
        sorting={sorting}
        setSorting={setSorting}
        pagination={pagination}
        setPagination={setPagination}
        disableUndefinedSorting={true}
        manualPagination={true}
        manualSorting={true}
        rowCount={totalCount}
      />
    </div>
  );
}
