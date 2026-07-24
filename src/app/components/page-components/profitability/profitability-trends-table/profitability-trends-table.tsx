import dateColumnUtils from '@/app/components/common/dynamic-date-columns/dynamic-date-columns';
import CustomTableWrapper from '@/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { UPDATED_PAGINATION_MODEL } from '@/constants';
import {
  TRENDS_PRODUCT_DETAILS,
  TRENDS_TOTAL,
} from '@/constants/table-columns/profitability-table-columns.constant';
import { ColumnNameEnum } from '@/enums/advertising.enums';
import { ProfitabilityMetricsKeyEnums } from '@/enums/profitability.enums';
import {
  ITrendsTotal,
  ProfitabilityTrendsTableProps,
} from '@/interfaces/profitability/profitability.interface';
import { useAppSelector } from '@/redux/hooks';
import { selectProfitabilityHeaderFilters } from '@/redux/slices/profitability/profitability.slice';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

export interface IProfitabilityTrendsTableRow {
  id: string;
  productName: string;
  sku: string;
  imageUrl: string | null;
  dateValues: Record<string, string>;
  totalValue: string;
  level: number;
  hasChildren: boolean;
  children?: IProfitabilityTrendsTableRow[];
  productPrice: number;
  metricKey: string;
}

function ProfitabilityTrendsTable<
  T extends IProfitabilityTrendsTableRow = IProfitabilityTrendsTableRow,
  P = ITrendsTotal
>({
  data,
  isLoading,
  metricKey = ProfitabilityMetricsKeyEnums.TOTAL_SALES,
  trendsTotalData,
  uniqueDates,
  marketplace,
  getTrendsData,
}: ProfitabilityTrendsTableProps<T, P>) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: ColumnNameEnum.TRENDS_TOTAL,
      desc: true,
    },
  ]);
  const [pagination, setPagination] = useState(UPDATED_PAGINATION_MODEL);
  const filters = useAppSelector(selectProfitabilityHeaderFilters);

  const tableColumns: ColumnDef<T>[] = useMemo(() => {
    const columns: ColumnDef<T>[] = [
      TRENDS_PRODUCT_DETAILS(marketplace) as ColumnDef<T>,
    ];

    const dateColumns = dateColumnUtils.createDateColumns<T>(
      uniqueDates,
      isLoading,
      {
        noDataText: '-',
        skeletonWidth: '6rem',
      },
      metricKey,
      filters.frequency.value
    );

    columns.push(...dateColumns);

    columns.push(TRENDS_TOTAL as ColumnDef<T>);

    return columns;
  }, [marketplace, uniqueDates, isLoading, metricKey, filters.frequency.value]);

  return (
    <CustomTableWrapper
      data={data ?? []}
      columns={tableColumns}
      isLoading={isLoading}
      width={'100%'}
      height={'60rem'}
      enableExpanding={false}
      sorting={sorting}
      setSorting={setSorting}
      manualSorting={false}
      disableUndefinedSorting={true}
      showCellSkeleton={true}
      totalData={trendsTotalData as any}
      isFooterRequired={true}
      pagination={pagination}
      setPagination={setPagination}
      getProcessedTableData={getTrendsData}
      initialPinnedColumns={{
        left: [ColumnNameEnum.TRENDS_PRODUCT],
        right: [ColumnNameEnum.TRENDS_TOTAL],
      }}
      customStyles={{
        tbody: {
          tr: {
            td: {
              wrapper: isLoading ? '!py-1' : '',
              tdDiv: ' !p-0',
            },
          },
        },
        thead: {
          tr: {
            th: {
              wrapper: isLoading ? '!py-0' : '',
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
      }}
    />
  );
}

export default ProfitabilityTrendsTable;
