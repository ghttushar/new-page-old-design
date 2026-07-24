import { Frequency, MarketplaceEnum, Range } from '@/enums/serp.enums';
import {
  ColumnPinningState,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CustomTableWrapper from 'src/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { ISovFilter, ISOVWithRank } from 'src/interfaces/serp.interface';
import SerpService from 'src/services/market-intelligence/serp.service';
import { customClientTableColumns } from '../custom-table-columns';
import styles from './client-side-custom-table.module.scss';
/* eslint-disable-next-line */
export interface ClientSideCustomTableProps {}

export function ClientSideCustomTable(props: ClientSideCustomTableProps) {
  const columns = useMemo(() => customClientTableColumns, []);
  const [data, setData] = useState<Array<ISOVWithRank>>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isLoading, setIsLoading] = useState(false);
  const pageSizes = useMemo(() => [10, 20, 30, 50, 100, 200], []);
  const initialPagination: PaginationState = {
    pageIndex: 0,
    pageSize: 50,
  };
  const initialPinnedColumns: ColumnPinningState = useMemo(
    () => ({
      left: [columns[0].id as string, columns[1].id as string],
      right: [],
    }),
    [columns]
  );
  const initialSorting: SortingState = [];

  const fetchSOVData = useCallback(() => {
    const sovFilters: ISovFilter = {
      brandName: 'napqueen',
      frequency: Frequency.HOURLY,
      dateRange: Range.LAST_7_DAYS,
    };
    const marketplace: MarketplaceEnum = MarketplaceEnum.AMAZON;
    setIsLoading(true);
    SerpService.getSOV(sovFilters, marketplace)
      .then((res) => {
        const data = res.data.data;
        setData(res.data.data.aggData);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchSOVData();
  }, [fetchSOVData]);

  return (
    <CustomTableWrapper
      width="80rem"
      height="70vh"
      data={data}
      columns={columns}
      isLoading={isLoading}
      pageSizes={pageSizes}
      initialPagination={initialPagination}
      initialPinnedColumns={initialPinnedColumns}
      initialSorting={initialSorting}
      enableRowSelection={true}
      // pinRowSelection={true}
      isFooterRequired={true}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
      noResultsOverlay={
        <h4>No results found for the selected filters or search.</h4>
      }
      customStyles={{
        tbody: {
          tr: {
            td: {
              className: styles.customTd,
            },
          },
        },
      }}
    />
  );
}

export default ClientSideCustomTable;
