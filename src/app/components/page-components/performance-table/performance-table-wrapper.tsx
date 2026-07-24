import {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import { ITableFooterData } from 'src/interfaces/advertising/advertising.interface';
import PerformanceTable from './performance-table';

interface IPerformanceTableWrapperProps<T> {
  columns: Array<ColumnDef<T>>;
  rows: Array<T>;
  isLoading: boolean;
  totalRowCount: number;
  paginationModel: PaginationState;
  setPaginationModel: (paginationModel: PaginationState) => void;
  sortModel?: SortingState;
  setSortModel?: (sortModel: SortingState) => void;
  isFooterRequired?: boolean;
  footerData?: ITableFooterData;
}

export default function PerformanceTableWrapper<T>({
  columns,
  rows,
  isLoading,
  totalRowCount,
  paginationModel,
  sortModel,
  setSortModel,
  setPaginationModel,
  isFooterRequired = false,
  footerData,
}: IPerformanceTableWrapperProps<T>) {
  return (
    <PerformanceTable
      columns={columns}
      rows={rows}
      isLoading={isLoading}
      totalRowCount={totalRowCount}
      paginationModel={paginationModel}
      setPaginationModel={setPaginationModel}
      sortModel={sortModel}
      setSortModel={setSortModel}
      isFooterRequired={isFooterRequired}
      footerData={footerData}
    />
  );
}
