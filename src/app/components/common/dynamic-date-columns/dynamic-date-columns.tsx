import { Frequency } from '@/enums/serp.enums';
import {
  DateColumnConfig,
  DateRowData,
} from '@/interfaces/profitability/profitability.interface';
import {
  convertGraphLabelByFrequency,
  getNumberFromString,
  hasProperty,
} from '@/utils';
import { getFormattedMetrics } from '@/utils/advertising.utils';
import { getSortedDates } from '@/utils/datetime.utils';
import { profitabilityUtils } from '@/utils/profitability.utils';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import SkeletonComponent from '../skeleton/skeleton';

export const dateColumnUtils = {
  extractUniqueDates<T extends Record<string, any>>(data: T[] | null) {
    if (!data || data.length === 0) return [];
    return data
      .map((item) => profitabilityUtils.getDateLabel(item))
      .filter((date, index, array) => date && array.indexOf(date) === index);
    // TODO: Use sorting logic based on the date label
  },
  createDateColumns<T extends DateRowData>(
    uniqueDates: string[],
    isLoading: boolean,
    config: DateColumnConfig = {},
    metricKey?: string,
    frequency?: Frequency
  ): ColumnDef<T, unknown>[] {
    const {
      dateHeaderClassName = '',
      dateCellClassName = '',
      noDataText = '-',
      skeletonWidth = '6rem',
      skeletonHeight = '4rem',
    } = config;

    if (isLoading === true) {
      return Array(8)
        .fill('')
        .map((date, index) => ({
          id: `date-${date}-${index}`,
          header: () => (
            <span className="pl-[1rem]">
              <SkeletonComponent
                height={skeletonHeight}
                width={'10rem'}
                color="#f4f4f4"
              />
            </span>
          ),
          cell: () => null,
        }));
    }

    if (uniqueDates.length === 0 && isLoading === false) {
      return Array(4)
        .fill('-')
        .map((date, index) => ({
          id: `date-${date}-${index}`,
          size: NaN,
          header: () => <span className="pl-[1rem]">-</span>,
          cell: () => <span className="no-data-view">-</span>,
        }));
    }

    return getSortedDates(uniqueDates).map((date) => ({
      id: `date-${date}`,
      size: uniqueDates.length <= 7 ? (7 - uniqueDates.length) * 100 : 150,
      enableSorting: true,
      accessorKey: `date-${date}`,
      accessorFn: (row: T) => {
        const dateValue = hasProperty(row.dateValues, date)
          ? row.dateValues[date]
          : '-';

        if (dateValue === null || dateValue === undefined || dateValue === '-')
          return null;

        return typeof dateValue === 'string'
          ? getNumberFromString(dateValue)
          : dateValue;
      },
      header: () => (
        <div
          className={`${dateHeaderClassName} font-[500] text-lg whitespace-nowrap`}
        >
          {convertGraphLabelByFrequency(date, frequency ?? Frequency.DAILY)}
        </div>
      ),
      cell: ({ row, table }: CellContext<T, unknown>) => {
        const rowData = row.original;
        const dateValue = hasProperty(rowData.dateValues, date)
          ? rowData.dateValues[date]
          : '-';

        if (dateValue === null || dateValue === undefined)
          return <div className="no-date-view">{noDataText}</div>;

        return (
          <div className={dateCellClassName}>
            <span>{dateValue}</span>
          </div>
        );
      },
      footer(props) {
        const value = props.table.options.meta?.footerData.find(
          (item: T) => profitabilityUtils.getDateLabel(item) === date
        )?.[metricKey!];
        return (
          <div className="commonFooter font-[600]">
            {getFormattedMetrics(metricKey, value)}
          </div>
        );
      },
    }));
  },
  getValueForDate<T extends Record<string, any>>(
    data: T[] | null,
    dateFieldName: keyof T,
    key: keyof T,
    dateLabel: string | null
  ): number | null {
    if (!data) return null;
    const item = data.find((d) => d[dateFieldName] === dateLabel);

    const value = profitabilityUtils.getMetricValueFromKey(item, key);
    return value;
  },

  createDateValues<T extends Record<string, any>>(
    data: T[] | null,
    dateFieldName: keyof T,
    metricKey: keyof T,
    uniqueDates: string[],
    formatValue: (value: any, key: keyof T) => string
  ): Record<string, string> {
    if (!data) return {};
    return getSortedDates(uniqueDates).reduce((acc, date) => {
      const value = dateColumnUtils.getValueForDate(
        data,
        dateFieldName,
        metricKey,
        date
      );
      acc[date || 'unknown'] = formatValue(value, metricKey);
      return acc;
    }, {} as Record<string, string>);
  },
};

export default dateColumnUtils;
