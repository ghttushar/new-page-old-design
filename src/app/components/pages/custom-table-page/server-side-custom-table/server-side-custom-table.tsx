import {
  IAdvertisingFilter,
  ICampaign,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  ColumnPinningState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CustomTableWrapper from 'src/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { SortOrderEnum } from 'src/enums/advertising.enums';
import { ISortCriteria } from 'src/interfaces/advertising/advertising.interface';
import { IFinalFilters } from 'src/redux/slices/filters/filter.slice';
import { spAdvertisingServices } from 'src/services/advertising/amazon/sp-advertising.service';
import { customServerTableColumns } from '../custom-table-columns';

/* eslint-disable-next-line */
export interface ServerSideCustomTableProps {}

export function ServerSideCustomTable(props: ServerSideCustomTableProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const pageSizes = useMemo(() => [10, 20, 30, 50, 100, 200], []);
  const columns = useMemo(() => customServerTableColumns, []);
  const pinnedColumns: ColumnPinningState = useMemo(
    () => ({
      left: [columns[0].id as string],
      right: [],
    }),
    [columns]
  );
  const [data, setData] = useState<Array<ICampaign>>([]);
  const [rowCount, setRowCount] = useState<number>(0);

  const getCampaigns = useCallback(() => {
    const filters: Array<IFinalFilters> = [];
    const payload: IAdvertisingFilter = {};
    const page = pagination.pageIndex + 1;
    const pageSize = pagination.pageSize;
    const sortCriteria: Array<ISortCriteria> = sorting.map<ISortCriteria>(
      (item) => ({
        columnName: item.id,
        sortOrder: item.desc ? SortOrderEnum.DESC : SortOrderEnum.ASC,
      })
    );
    setIsLoading(true);
    spAdvertisingServices
      .getCampaigns(filters, payload, page, pageSize, sortCriteria)
      .then((res) => {
        setData(res.data.data.data);
        setRowCount(Number(res.data.data.pagination.totalItems));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [pagination.pageIndex, pagination.pageSize, sorting]);

  useEffect(() => {
    getCampaigns();
  }, [getCampaigns]);

  return (
    <CustomTableWrapper
      width="100%"
      height="70vh"
      columns={columns}
      data={data}
      initialPinnedColumns={pinnedColumns}
      manualPagination={true}
      pagination={pagination}
      setPagination={setPagination}
      rowCount={rowCount}
      isLoading={isLoading}
      pageSizes={pageSizes}
      manualSorting={true}
      sorting={sorting}
      setSorting={setSorting}
      loadingOverlay={<h1>Custom Loader</h1>}
      isFooterRequired={true}
    />
  );
}

export default ServerSideCustomTable;
