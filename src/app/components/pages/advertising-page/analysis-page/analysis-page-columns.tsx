import { MarketplaceEnum } from '@/enums/serp.enums';
import { ColumnDef } from '@tanstack/react-table';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import {
  AmazonSearchColumnsEnum,
  MetricsOptions,
} from 'src/enums/advertising.enums';
import {
  IAnalysisColData,
  IImpactedAdGroupData,
  IImpactedCampaignData,
  IImpactedKeywordData,
  IImpactedProductData,
  IImpactedSearchTermData,
} from 'src/interfaces/analysis.interface';
import {
  displayValue,
  formatNum,
  getDateRangeText,
  hexToRGBA,
} from 'src/utils';
import {
  checkIsNull,
  convertToTitleCase,
  getFormattedMetrics,
  getProductUrl,
} from 'src/utils/advertising.utils';
import {
  formatPercentageWidth,
  getAnalysisPercentage,
  getColumnNameById,
  getFieldByMetricKey,
  getImpactBGColor,
  getSelectedMetricImpactData,
} from 'src/utils/analysis.utils';
import styles from './analysis-columns.module.scss';

const bgColor = hexToRGBA('#F4E4FF', 0.7);

export const getNameColumn = <T,>(id: string): ColumnDef<T> => {
  return {
    accessorKey: id,
    id,
    size: 400,
    header: (props) => {
      return (
        <div
          className="commonHeader"
          style={{ display: 'flex', alignItems: 'left' }}
        >
          {convertToTitleCase(getColumnNameById(id))}
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;
      if (!value || value === '') return <div className="no-data-view">-</div>;
      return (
        <div
          className="commonCell"
          style={{ display: 'flex', alignItems: 'left' }}
        >
          <div className={styles.titleContainer}>
            <p className={styles.titleName} title={`${value}`}>
              {value}
            </p>
          </div>
        </div>
      );
    },
  };
};
export const getGenericColumns = (
  impactStartDate: string,
  startDate: string,
  endDate: string,
  impactEndDate: string
): Array<ColumnDef<IAnalysisColData>> => {
  return [
    {
      accessorKey: MetricsOptions.IMPRESSIONS,
      id: MetricsOptions.IMPRESSIONS,
      header: (props) => {
        return (
          <div
            className="commonHeader"
            style={{ textAlign: 'center', color: '#77469B' }}
          >
            Impressions
          </div>
        );
      },
      enableSorting: false,
      columns: [
        {
          accessorKey: 'avgImpressions',
          id: 'avgImpressions',
          size: 150,
          header: (props) => {
            return (
              <div className="commonHeader" style={{ textAlign: 'center' }}>
                {getDateRangeText(startDate, endDate)}
              </div>
            );
          },
          cell: (props) => {
            const { row } = props;

            return (
              <div className="commonCell" style={{ textAlign: 'center' }}>
                {formatNum(row.original.impressions.average, false)}
              </div>
            );
          },
          footer: (props) => {
            const total = props.table
              .getRowModel()
              .rows.reduce(
                (sum, row) => sum + (row.original.impressions.average ?? 0),
                0
              );
            return (
              <div className="commonHeader" style={{ textAlign: 'center' }}>
                {total}
              </div>
            );
          },
        },
        {
          accessorKey: 'impressions',
          id: 'impressions',
          size: 150,
          header: (props) => {
            return (
              <div
                className="commonHeader"
                style={{
                  textAlign: 'center',
                  backgroundColor: bgColor,
                }}
              >
                {getDateRangeText(impactStartDate, impactEndDate)}
              </div>
            );
          },
          cell: (props) => {
            const { row } = props;

            return (
              <div
                className="commonCell"
                style={{
                  textAlign: 'center',
                  backgroundColor: bgColor,
                }}
              >
                {formatNum(row.original.impressions.actual, false)}
              </div>
            );
          },
          footer: (props) => {
            const total = props.table
              .getRowModel()
              .rows.reduce(
                (sum, row) => sum + (row.original.impressions.actual ?? 0),
                0
              );

            return (
              <div className="commonHeader" style={{ textAlign: 'center' }}>
                {total}
              </div>
            );
          },
        },
      ],
    },
    {
      accessorKey: MetricsOptions.CLICKS,
      id: MetricsOptions.CLICKS,
      header: (props) => {
        return (
          <div
            className="commonHeader"
            style={{ textAlign: 'center', color: '#77469B' }}
          >
            Clicks
          </div>
        );
      },
      enableSorting: false,
      columns: [
        {
          accessorKey: 'avgClicks',
          id: 'avgClicks',
          size: 150,
          header: (props) => {
            return (
              <div
                className="commonHeader"
                style={{
                  textAlign: 'center',
                }}
              >
                {getDateRangeText(startDate, endDate)}
              </div>
            );
          },
          cell: (props) => {
            const { row } = props;

            return (
              <div
                className="commonCell"
                style={{
                  textAlign: 'center',
                }}
              >
                {formatNum(row.original.clicks.average, false)}
              </div>
            );
          },
          footer: (props) => {
            const total = props.table
              .getRowModel()
              .rows.reduce(
                (sum, row) => sum + (row.original.clicks.average ?? 0),
                0
              );
            return (
              <div className="commonHeader" style={{ textAlign: 'center' }}>
                {total}
              </div>
            );
          },
        },
        {
          accessorKey: 'clicks',
          id: 'clicks',
          size: 150,
          header: (props) => {
            return (
              <div
                className="commonHeader"
                style={{
                  textAlign: 'center',
                  backgroundColor: bgColor,
                }}
              >
                {getDateRangeText(impactStartDate, impactEndDate)}
              </div>
            );
          },
          cell: (props) => {
            const { row } = props;

            return (
              <div
                className="commonCell"
                style={{
                  textAlign: 'center',
                  backgroundColor: bgColor,
                }}
              >
                {formatNum(row.original.clicks.actual, false)}
              </div>
            );
          },
          footer: (props) => {
            const total = props.table
              .getRowModel()
              .rows.reduce(
                (sum, row) => sum + (row.original.clicks.actual ?? 0),
                0
              );
            return (
              <div className="commonHeader" style={{ textAlign: 'center' }}>
                {total}
              </div>
            );
          },
        },
      ],
    },
    {
      accessorKey: MetricsOptions.CTR,
      id: MetricsOptions.CTR,
      header: (props) => {
        return (
          <div
            className="commonHeader"
            style={{ textAlign: 'center', color: '#77469B' }}
          >
            CTR
          </div>
        );
      },
      enableSorting: false,
      columns: [
        {
          accessorKey: 'avgCtr',
          id: 'avgCtr',
          size: 150,
          header: (props) => {
            return (
              <div
                className="commonHeader"
                style={{
                  textAlign: 'center',
                }}
              >
                {getDateRangeText(startDate, endDate)}
              </div>
            );
          },
          cell: (props) => {
            const { row } = props;

            return (
              <div
                className="commonCell"
                style={{
                  textAlign: 'center',
                }}
              >
                {formatNum(row.original.ctr.average)}%
              </div>
            );
          },
          footer: (props) => {
            const total = props.table
              .getRowModel()
              .rows.reduce(
                (sum, row) => sum + (row.original.ctr.average ?? 0),
                0
              );
            return (
              <div className="commonHeader" style={{ textAlign: 'center' }}>
                {total}
              </div>
            );
          },
        },
        {
          accessorKey: 'ctr',
          id: 'ctr',
          size: 150,
          header: (props) => {
            return (
              <div
                className="commonHeader"
                style={{
                  textAlign: 'center',
                  backgroundColor: bgColor,
                }}
              >
                {getDateRangeText(impactStartDate, impactEndDate)}
              </div>
            );
          },
          cell: (props) => {
            const { row } = props;

            return (
              <div
                className="commonCell"
                style={{
                  textAlign: 'center',
                  backgroundColor: bgColor,
                }}
              >
                {formatNum(row.original.ctr.actual)}%
              </div>
            );
          },
          footer: (props) => {
            const total = props.table
              .getRowModel()
              .rows.reduce(
                (sum, row) => sum + (row.original.ctr.actual ?? 0),
                0
              );
            return (
              <div className="commonHeader" style={{ textAlign: 'center' }}>
                {total}
              </div>
            );
          },
        },
      ],
    },
    {
      accessorKey: MetricsOptions.CPC,
      id: MetricsOptions.CPC,
      header: (props) => {
        return (
          <div
            className="commonHeader"
            style={{ textAlign: 'center', color: '#77469B' }}
          >
            CPC
          </div>
        );
      },
      enableSorting: false,
      columns: [
        {
          accessorKey: 'avgCpc',
          id: 'avgCpc',
          size: 150,
          header: (props) => {
            return (
              <div
                className="commonHeader"
                style={{
                  textAlign: 'center',
                }}
              >
                {getDateRangeText(startDate, endDate)}
              </div>
            );
          },
          cell: (props) => {
            const { row } = props;

            return (
              <div
                className="commonCell"
                style={{
                  textAlign: 'center',
                }}
              >
                ${formatNum(row.original.cpc.average)}
              </div>
            );
          },
          footer: (props) => {
            const total = props.table
              .getRowModel()
              .rows.reduce(
                (sum, row) => sum + (row.original.cpc.average ?? 0),
                0
              );
            return (
              <div className="commonHeader" style={{ textAlign: 'center' }}>
                {total}
              </div>
            );
          },
        },
        {
          accessorKey: 'cpc',
          id: 'cpc',
          size: 150,
          header: (props) => {
            return (
              <div
                className="commonHeader"
                style={{
                  textAlign: 'center',
                  backgroundColor: bgColor,
                }}
              >
                {getDateRangeText(impactStartDate, impactEndDate)}
              </div>
            );
          },
          cell: (props) => {
            const { row } = props;

            return (
              <div
                className="commonCell"
                style={{
                  textAlign: 'center',
                  backgroundColor: bgColor,
                }}
              >
                ${formatNum(row.original.cpc.actual)}
              </div>
            );
          },
          footer: (props) => {
            const total = props.table
              .getRowModel()
              .rows.reduce(
                (sum, row) => sum + (row.original.cpc.actual ?? 0),
                0
              );
            return (
              <div className="commonHeader" style={{ textAlign: 'center' }}>
                {total}
              </div>
            );
          },
        },
      ],
    },
    {
      accessorKey: MetricsOptions.AD_SPEND,
      id: MetricsOptions.AD_SPEND,
      header: (props) => {
        return (
          <div
            className="commonHeader"
            style={{ textAlign: 'center', color: '#77469B' }}
          >
            Ad Spend
          </div>
        );
      },
      enableSorting: false,
      columns: [
        {
          accessorKey: 'avgAdSpend',
          id: 'avgAdSpend',
          size: 150,
          header: (props) => {
            return (
              <div
                className="commonHeader"
                style={{
                  textAlign: 'center',
                }}
              >
                {getDateRangeText(startDate, endDate)}
              </div>
            );
          },
          cell: (props) => {
            const { row } = props;

            return (
              <div
                className="commonCell"
                style={{
                  textAlign: 'center',
                }}
              >
                ${formatNum(row.original.adSpend.average)}
              </div>
            );
          },
          footer: (props) => {
            const total = props.table
              .getRowModel()
              .rows.reduce(
                (sum, row) => sum + (row.original.adSpend.average ?? 0),
                0
              );
            return (
              <div className="commonHeader" style={{ textAlign: 'center' }}>
                {total}
              </div>
            );
          },
        },
        {
          accessorKey: 'adSpend',
          id: 'adSpend',
          size: 150,
          header: (props) => {
            return (
              <div
                className="commonHeader"
                style={{
                  textAlign: 'center',
                  backgroundColor: bgColor,
                }}
              >
                {getDateRangeText(impactStartDate, impactEndDate)}
              </div>
            );
          },
          cell: (props) => {
            const { row } = props;

            return (
              <div
                className="commonCell"
                style={{
                  textAlign: 'center',
                  backgroundColor: bgColor,
                }}
              >
                ${formatNum(row.original.adSpend.actual)}
              </div>
            );
          },
          footer: (props) => {
            const total = props.table
              .getRowModel()
              .rows.reduce(
                (sum, row) => sum + (row.original.adSpend.actual ?? 0),
                0
              );
            return (
              <div className="commonHeader" style={{ textAlign: 'center' }}>
                {total}
              </div>
            );
          },
        },
      ],
    },
    {
      accessorKey: MetricsOptions.AD_SALES,
      id: MetricsOptions.AD_SALES,
      header: (props) => {
        return (
          <div
            className="commonHeader"
            style={{ textAlign: 'center', color: '#77469B' }}
          >
            Ad Sales
          </div>
        );
      },
      enableSorting: false,
      columns: [
        {
          accessorKey: 'avgAdSales',
          id: 'avgAdSales',
          size: 150,
          header: (props) => {
            return (
              <div
                className="commonHeader"
                style={{
                  textAlign: 'center',
                }}
              >
                {getDateRangeText(startDate, endDate)}
              </div>
            );
          },
          cell: (props) => {
            const { row } = props;

            return (
              <div
                className="commonCell"
                style={{
                  textAlign: 'center',
                }}
              >
                ${formatNum(row.original.adSales.average)}
              </div>
            );
          },
          footer: (props) => {
            const total = props.table
              .getRowModel()
              .rows.reduce(
                (sum, row) => sum + (row.original.adSales.average ?? 0),
                0
              );
            return (
              <div className="commonHeader" style={{ textAlign: 'center' }}>
                {total}
              </div>
            );
          },
        },
        {
          accessorKey: 'adSales',
          id: 'adSales',
          size: 150,
          header: (props) => {
            return (
              <div
                className="commonHeader"
                style={{
                  textAlign: 'center',
                  backgroundColor: bgColor,
                }}
              >
                {getDateRangeText(impactStartDate, impactEndDate)}
              </div>
            );
          },
          cell: (props) => {
            const { row } = props;

            return (
              <div
                className="commonCell"
                style={{
                  textAlign: 'center',
                  backgroundColor: bgColor,
                }}
              >
                ${formatNum(row.original.adSales.actual)}
              </div>
            );
          },
          footer: (props) => {
            const total = props.table
              .getRowModel()
              .rows.reduce(
                (sum, row) => sum + (row.original.adSales.actual ?? 0),
                0
              );
            return (
              <div className="commonHeader" style={{ textAlign: 'center' }}>
                {total}
              </div>
            );
          },
        },
      ],
    },
    {
      accessorKey: MetricsOptions.AD_UNITS,
      id: MetricsOptions.AD_UNITS,
      header: (props) => {
        return (
          <div
            className="commonHeader"
            style={{ textAlign: 'center', color: '#77469B' }}
          >
            Ad Units
          </div>
        );
      },
      enableSorting: false,
      columns: [
        {
          accessorKey: 'avgUnitsSold',
          id: 'avgUnitsSold',
          size: 150,
          header: (props) => {
            return (
              <div
                className="commonHeader"
                style={{
                  textAlign: 'center',
                }}
              >
                {getDateRangeText(startDate, endDate)}
              </div>
            );
          },
          cell: (props) => {
            const { row } = props;

            return (
              <div
                className="commonCell"
                style={{
                  textAlign: 'center',
                }}
              >
                {formatNum(row.original.unitsSold.average, false)}
              </div>
            );
          },
          footer: (props) => {
            const total = props.table
              .getRowModel()
              .rows.reduce(
                (sum, row) => sum + (row.original.unitsSold.average ?? 0),
                0
              );
            return (
              <div className="commonHeader" style={{ textAlign: 'center' }}>
                {total}
              </div>
            );
          },
        },
        {
          accessorKey: 'unitsSold',
          id: 'unitsSold',
          size: 150,
          header: (props) => {
            return (
              <div
                className="commonHeader"
                style={{
                  textAlign: 'center',
                  backgroundColor: bgColor,
                }}
              >
                {getDateRangeText(impactStartDate, impactEndDate)}
              </div>
            );
          },
          cell: (props) => {
            const { row } = props;

            return (
              <div
                className="commonCell"
                style={{
                  textAlign: 'center',
                  backgroundColor: bgColor,
                }}
              >
                {formatNum(row.original.unitsSold.actual, false)}
              </div>
            );
          },
          footer: (props) => {
            const total = props.table
              .getRowModel()
              .rows.reduce(
                (sum, row) => sum + (row.original.unitsSold.actual ?? 0),
                0
              );
            return (
              <div className="commonHeader" style={{ textAlign: 'center' }}>
                {total}
              </div>
            );
          },
        },
      ],
    },
    {
      accessorKey: MetricsOptions.CVR,
      id: MetricsOptions.CVR,
      header: (props) => {
        return (
          <div
            className="commonHeader"
            style={{ textAlign: 'center', color: '#77469B' }}
          >
            CVR
          </div>
        );
      },
      enableSorting: false,
      columns: [
        {
          accessorKey: 'avgCvr',
          id: 'avgCvr',
          size: 150,
          header: (props) => {
            return (
              <div
                className="commonHeader"
                style={{
                  textAlign: 'center',
                }}
              >
                {getDateRangeText(startDate, endDate)}
              </div>
            );
          },
          cell: (props) => {
            const { row } = props;

            return (
              <div
                className="commonCell"
                style={{
                  textAlign: 'center',
                }}
              >
                {formatNum(row.original.cvr.average)}%
              </div>
            );
          },
          footer: (props) => {
            const total = props.table
              .getRowModel()
              .rows.reduce(
                (sum, row) => sum + (row.original.cvr.average ?? 0),
                0
              );
            return (
              <div className="commonHeader" style={{ textAlign: 'center' }}>
                {total}
              </div>
            );
          },
        },
        {
          accessorKey: 'cvr',
          id: 'cvr',
          size: 150,
          header: (props) => {
            return (
              <div
                className="commonHeader"
                style={{
                  textAlign: 'center',
                  backgroundColor: bgColor,
                }}
              >
                {getDateRangeText(impactStartDate, impactEndDate)}
              </div>
            );
          },
          cell: (props) => {
            const { row } = props;

            return (
              <div
                className="commonCell"
                style={{
                  textAlign: 'center',
                  backgroundColor: bgColor,
                }}
              >
                {formatNum(row.original.cvr.actual)}%
              </div>
            );
          },
          footer: (props) => {
            const total = props.table
              .getRowModel()
              .rows.reduce(
                (sum, row) => sum + (row.original.cvr.actual ?? 0),
                0
              );
            return (
              <div className="commonHeader" style={{ textAlign: 'center' }}>
                {total}
              </div>
            );
          },
        },
      ],
    },
    {
      accessorKey: MetricsOptions.ROAS,
      id: MetricsOptions.ROAS,
      header: (props) => {
        return (
          <div
            className="commonHeader"
            style={{ textAlign: 'center', color: '#77469B' }}
          >
            ROAS
          </div>
        );
      },
      enableSorting: false,
      columns: [
        {
          accessorKey: 'avgRoas',
          id: 'avgRoas',
          size: 150,
          header: (props) => {
            return (
              <div
                className="commonHeader"
                style={{
                  textAlign: 'center',
                }}
              >
                {getDateRangeText(startDate, endDate)}
              </div>
            );
          },
          cell: (props) => {
            const { row } = props;

            return (
              <div
                className="commonCell"
                style={{
                  textAlign: 'center',
                }}
              >
                ${formatNum(row.original.roas.average)}
              </div>
            );
          },
          footer: (props) => {
            const total = props.table
              .getRowModel()
              .rows.reduce(
                (sum, row) => sum + (row.original.roas.average ?? 0),
                0
              );
            return (
              <div className="commonHeader" style={{ textAlign: 'center' }}>
                {total}
              </div>
            );
          },
        },
        {
          accessorKey: 'roas',
          id: 'roas',
          size: 150,
          header: (props) => {
            return (
              <div
                className="commonHeader"
                style={{
                  textAlign: 'center',
                  backgroundColor: bgColor,
                }}
              >
                {getDateRangeText(impactStartDate, impactEndDate)}
              </div>
            );
          },
          cell: (props) => {
            const { row } = props;

            return (
              <div
                className="commonCell"
                style={{
                  textAlign: 'center',
                  backgroundColor: bgColor,
                }}
              >
                ${formatNum(row.original.roas.actual)}
              </div>
            );
          },
          footer: (props) => {
            const total = props.table
              .getRowModel()
              .rows.reduce(
                (sum, row) => sum + (row.original.roas.actual ?? 0),
                0
              );
            return (
              <div className="commonHeader" style={{ textAlign: 'center' }}>
                {total}
              </div>
            );
          },
        },
      ],
    },
    {
      accessorKey: MetricsOptions.ACOS,
      id: MetricsOptions.ACOS,
      header: (props) => {
        return (
          <div
            className="commonHeader"
            style={{ textAlign: 'center', color: '#77469B' }}
          >
            ACOS
          </div>
        );
      },
      enableSorting: false,
      columns: [
        {
          accessorKey: 'avgAcos',
          id: 'avgAcos',
          size: 150,
          header: (props) => {
            return (
              <div
                className="commonHeader"
                style={{
                  textAlign: 'center',
                }}
              >
                {getDateRangeText(startDate, endDate)}
              </div>
            );
          },
          cell: (props) => {
            const { row } = props;

            return (
              <div
                className="commonCell"
                style={{
                  textAlign: 'center',
                }}
              >
                {formatNum(row.original.acos.average)}%
              </div>
            );
          },
          footer: (props) => {
            const total = props.table
              .getRowModel()
              .rows.reduce(
                (sum, row) => sum + (row.original.acos.average ?? 0),
                0
              );
            return (
              <div className="commonHeader" style={{ textAlign: 'center' }}>
                {total}
              </div>
            );
          },
        },
        {
          accessorKey: 'acos',
          id: 'acos',
          size: 150,
          header: (props) => {
            return (
              <div
                className="commonHeader"
                style={{
                  textAlign: 'center',
                  backgroundColor: bgColor,
                }}
              >
                {getDateRangeText(impactStartDate, impactEndDate)}
              </div>
            );
          },
          cell: (props) => {
            const { row } = props;

            return (
              <div
                className="commonCell"
                style={{
                  textAlign: 'center',
                  backgroundColor: bgColor,
                }}
              >
                {formatNum(row.original.acos.actual)}%
              </div>
            );
          },
          footer: (props) => {
            const total = props.table
              .getRowModel()
              .rows.reduce(
                (sum, row) => sum + (row.original.acos.actual ?? 0),
                0
              );
            return (
              <div className="commonHeader" style={{ textAlign: 'center' }}>
                {total}
              </div>
            );
          },
        },
      ],
    },
  ];
};
// ------------CAMPAIGN----------------------
export const campaignColumns = (
  startDate: string,
  endDate: string,
  impactStartDate: string,
  impactEndDate: string,
  selectedMetric: IDropdownItem<string>
): ColumnDef<IImpactedCampaignData>[] => [
  {
    accessorKey: 'impactCampaigns',
    id: 'impactCampaigns',
    header: (props) => {
      return (
        <div className="commonHeader" style={{ textAlign: 'left' }}>
          Impact Campaigns
        </div>
      );
    },
    enableSorting: false,
    footer: (props) => {
      return (
        <div className="commonHeader" style={{ textAlign: 'left' }}>
          Total
        </div>
      );
    },
    columns: [
      {
        accessorKey: getFieldByMetricKey(`${selectedMetric.value}`),
        id: 'campaignName',
        size: 400,
        header: (props) => {
          return (
            <div
              className="commonHeader"
              style={{ display: 'flex', alignItems: 'left' }}
            >
              Campaign
            </div>
          );
        },
        cell: (props) => {
          const { row } = props;
          const value = row.original.campaignName;

          const impactData = getSelectedMetricImpactData(
            row.original,
            selectedMetric.value
          );
          const percentageBodyWidth = formatPercentageWidth(
            getAnalysisPercentage(impactData).percentage
          );

          return (
            <div className={styles.itemPercentageContainerStyles}>
              <div
                className={styles.itemPercentageBody}
                style={{
                  background: getImpactBGColor(impactData.isNegative),
                }}
              >
                <div
                  className={styles.percentageContainer}
                  style={{
                    background: getImpactBGColor(impactData.isNegative, false),
                    width: displayValue(percentageBodyWidth),
                  }}
                ></div>
                <div
                  className={styles.itemContent}
                  title={`${value}   ${displayValue(
                    formatNum(impactData.percentage)
                  )}`}
                >
                  <p className={styles.itemName}>{value}</p>
                  <p className={styles.itemValue}>
                    {displayValue(formatNum(impactData.percentage))}
                  </p>
                </div>
              </div>
            </div>
          );
        },
      },
    ],
  },
  ...(getGenericColumns(
    impactStartDate,
    startDate,
    endDate,
    impactEndDate
  ) as ColumnDef<IImpactedCampaignData>[]),
];

// ------------AD GROUP----------------------
export const adGroupColumns = (
  startDate: string,
  endDate: string,
  impactStartDate: string,
  impactEndDate: string,
  selectedMetric: IDropdownItem<string>
): ColumnDef<IImpactedAdGroupData>[] => [
  {
    accessorKey: 'impactAdgroups',
    id: 'impactAdGroups',
    header: (props) => {
      return (
        <div className="commonHeader" style={{ textAlign: 'left' }}>
          Impact Ad Groups
        </div>
      );
    },
    enableSorting: false,
    footer: (props) => {
      return (
        <div className="commonHeader" style={{ textAlign: 'left' }}>
          Total
        </div>
      );
    },
    columns: [
      {
        accessorKey: getFieldByMetricKey(`${selectedMetric.value}`),
        id: 'adGroupName',
        size: 400,
        header: (props) => {
          return (
            <div
              className="commonHeader"
              style={{ display: 'flex', alignItems: 'left' }}
            >
              Ad Group
            </div>
          );
        },
        cell: (props) => {
          const { row } = props;
          const value = row.original.adGroupName;

          const impactData = getSelectedMetricImpactData(
            row.original,
            selectedMetric.value
          );
          const percentageBodyWidth = formatPercentageWidth(
            getAnalysisPercentage(impactData).percentage
          );

          return (
            <div className={styles.itemPercentageContainerStyles}>
              <div
                className={styles.itemPercentageBody}
                style={{
                  background: getImpactBGColor(impactData.isNegative),
                }}
              >
                <div
                  className={styles.percentageContainer}
                  style={{
                    background: getImpactBGColor(impactData.isNegative, false),
                    width: displayValue(percentageBodyWidth),
                  }}
                ></div>
                <div
                  className={styles.itemContent}
                  title={`${value}   ${displayValue(
                    formatNum(impactData.percentage)
                  )}`}
                >
                  <p className={styles.itemName}>{value}</p>
                  <p className={styles.itemValue}>
                    {displayValue(formatNum(impactData.percentage))}
                  </p>
                </div>
              </div>
            </div>
          );
        },
      },
    ],
  },
  getNameColumn(AmazonSearchColumnsEnum.CAMPAIGN_NAME),
  ...(getGenericColumns(
    impactStartDate,
    startDate,
    endDate,
    impactEndDate
  ) as ColumnDef<IImpactedAdGroupData>[]),
];

// ------------PRODUCT----------------------
export const productsColumns = (
  startDate: string,
  endDate: string,
  impactStartDate: string,
  impactEndDate: string,
  selectedMetric: IDropdownItem<string>,
  selectedMarketplace: MarketplaceEnum | string | undefined
): ColumnDef<IImpactedProductData>[] => [
  {
    accessorKey: 'impactProductAds',
    id: 'impactProductAds',
    header: (props) => {
      return (
        <div className="commonHeader" style={{ textAlign: 'left' }}>
          Impact Product Ads
        </div>
      );
    },
    enableSorting: false,
    footer: (props) => {
      return (
        <div className="commonHeader" style={{ textAlign: 'left' }}>
          Total
        </div>
      );
    },
    columns: [
      {
        accessorKey: getFieldByMetricKey(`${selectedMetric.value}`),
        id: 'productName',
        size: 400,
        header: (props) => {
          return (
            <div
              className="commonHeader"
              style={{ display: 'flex', alignItems: 'left' }}
            >
              Product Name
            </div>
          );
        },
        cell: (props) => {
          const { row } = props;
          const value = row.original.productName;

          const impactData = getSelectedMetricImpactData(
            row.original,
            selectedMetric.value
          );
          const percentageBodyWidth = formatPercentageWidth(
            getAnalysisPercentage(impactData).percentage
          );

          return (
            <div className={styles.itemPercentageContainerStyles}>
              <div
                className={styles.itemPercentageBody}
                style={{
                  background: getImpactBGColor(impactData.isNegative),
                }}
              >
                <div
                  className={styles.percentageContainer}
                  style={{
                    background: getImpactBGColor(impactData.isNegative, false),
                    width: displayValue(percentageBodyWidth),
                  }}
                ></div>
                <div
                  className={styles.itemContent}
                  title={`${value}   ${displayValue(
                    formatNum(impactData.percentage)
                  )}`}
                >
                  <p className={styles.itemName}>{value}</p>
                  <p className={styles.itemValue}>
                    {displayValue(formatNum(impactData.percentage))}
                  </p>
                </div>
              </div>
            </div>
          );
        },
      },
    ],
  },
  {
    accessorKey: 'impactProductAdsDetails',
    id: 'impactProductAdsDetails',
    header: (props) => {
      return (
        <div className="commonHeader" style={{ textAlign: 'left' }}>
          Impact Product Ads Details
        </div>
      );
    },
    enableSorting: false,
    footer: (props) => {
      return (
        <div className="commonHeader" style={{ textAlign: 'left' }}>
          Total
        </div>
      );
    },
    columns: [
      {
        accessorKey: 'productId',
        id: 'productId',
        size: 100,
        header: (props) => {
          return (
            <div
              className="commonHeader"
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              Product ID
            </div>
          );
        },
        cell: (props) => {
          const value = props.getValue() as string;

          return (
            <div
              className="commonCell"
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <a
                className={styles.productId}
                title={`${value}`}
                href={getProductUrl(value, selectedMarketplace ?? '')}
                target="_blank"
                rel="noreferrer"
              >
                {value}
              </a>
            </div>
          );
        },
      },
      getNameColumn(AmazonSearchColumnsEnum.ADGROUP_NAME),
      getNameColumn(AmazonSearchColumnsEnum.CAMPAIGN_NAME),
    ],
  },
  ...(getGenericColumns(
    impactStartDate,
    startDate,
    endDate,
    impactEndDate
  ) as ColumnDef<IImpactedProductData>[]),
  {
    accessorKey: MetricsOptions.INVENTORY_COUNT,
    id: MetricsOptions.INVENTORY_COUNT,
    header: (props) => {
      return (
        <div
          className="commonHeader"
          style={{ textAlign: 'center', color: '#77469B' }}
        >
          Inventory Count
        </div>
      );
    },
    enableSorting: false,
    columns: [
      {
        accessorKey: 'avgInventoryCount',
        id: 'avgInventoryCount',
        size: 150,
        header: (props) => {
          return (
            <div className="commonHeader" style={{ textAlign: 'center' }}>
              {getDateRangeText(startDate, endDate)}
            </div>
          );
        },
        cell: (props) => {
          const { row } = props;
          if (!row.original.inventoryCount) return '-';
          return (
            <div className="commonCell" style={{ textAlign: 'center' }}>
              {getFormattedMetrics(
                'inventoryCount',
                row.original.inventoryCount.average
              )}
            </div>
          );
        },
        footer: (props) => {
          const total = props.table
            .getRowModel()
            .rows.reduce(
              (sum, row) => sum + (row.original.inventoryCount.average ?? 0),
              0
            );
          return (
            <div className="commonHeader" style={{ textAlign: 'center' }}>
              {total}
            </div>
          );
        },
      },
      {
        accessorKey: 'inventoryCount',
        id: 'inventoryCount',
        size: 150,
        header: (props) => {
          return (
            <div
              className="commonHeader"
              style={{
                textAlign: 'center',
                backgroundColor: bgColor,
              }}
            >
              {getDateRangeText(impactStartDate, impactEndDate)}
            </div>
          );
        },
        cell: (props) => {
          const { row } = props;
          if (!row.original.inventoryCount) return '-';
          return (
            <div
              className="commonCell"
              style={{
                textAlign: 'center',
                backgroundColor: bgColor,
              }}
            >
              {getFormattedMetrics(
                'inventoryCount',
                row.original.inventoryCount.actual
              )}
            </div>
          );
        },
        footer: (props) => {
          const total = props.table
            .getRowModel()
            .rows.reduce(
              (sum, row) => sum + (row.original.inventoryCount.actual ?? 0),
              0
            );

          return (
            <div className="commonHeader" style={{ textAlign: 'center' }}>
              {total}
            </div>
          );
        },
      },
    ],
  },
  {
    accessorKey: MetricsOptions.TOTAL_SALES,
    id: MetricsOptions.TOTAL_SALES,
    header: (props) => {
      return (
        <div
          className="commonHeader"
          style={{ textAlign: 'center', color: '#77469B' }}
        >
          Total Sales
        </div>
      );
    },
    enableSorting: false,
    columns: [
      {
        accessorKey: 'avgTotalSales',
        id: 'avgTotalSales',
        size: 150,
        header: (props) => {
          return (
            <div className="commonHeader" style={{ textAlign: 'center' }}>
              {getDateRangeText(startDate, endDate)}
            </div>
          );
        },
        cell: (props) => {
          const { row } = props;
          if (!row.original.totalSales) return '-';
          return (
            <div className="commonCell" style={{ textAlign: 'center' }}>
              {getFormattedMetrics(
                MetricsOptions.TOTAL_SALES,
                row.original.totalSales.average
              )}
            </div>
          );
        },
        footer: (props) => {
          const total = props.table
            .getRowModel()
            .rows.reduce(
              (sum, row) => sum + (row.original.totalSales.average ?? 0),
              0
            );
          return (
            <div className="commonHeader" style={{ textAlign: 'center' }}>
              {total}
            </div>
          );
        },
      },
      {
        accessorKey: 'totalSales',
        id: 'totalSales',
        size: 150,
        header: (props) => {
          return (
            <div
              className="commonHeader"
              style={{
                textAlign: 'center',
                backgroundColor: bgColor,
              }}
            >
              {getDateRangeText(impactStartDate, impactEndDate)}
            </div>
          );
        },
        cell: (props) => {
          const { row } = props;
          if (!row.original.totalSales) return '-';
          return (
            <div
              className="commonCell"
              style={{
                textAlign: 'center',
                backgroundColor: bgColor,
              }}
            >
              {getFormattedMetrics(
                MetricsOptions.TOTAL_SALES,
                row.original.totalSales.actual
              )}
            </div>
          );
        },
        footer: (props) => {
          const total = props.table
            .getRowModel()
            .rows.reduce(
              (sum, row) => sum + (row.original.totalSales.actual ?? 0),
              0
            );

          return (
            <div className="commonHeader" style={{ textAlign: 'center' }}>
              {total}
            </div>
          );
        },
      },
    ],
  },
  {
    accessorKey: MetricsOptions.TOTAL_UNITS,
    id: MetricsOptions.TOTAL_UNITS,
    header: (props) => {
      return (
        <div
          className="commonHeader"
          style={{ textAlign: 'center', color: '#77469B' }}
        >
          Total Units
        </div>
      );
    },
    enableSorting: false,
    columns: [
      {
        accessorKey: 'avgTotalUnits',
        id: 'avgTotalUnits',
        size: 150,
        header: (props) => {
          return (
            <div className="commonHeader" style={{ textAlign: 'center' }}>
              {getDateRangeText(startDate, endDate)}
            </div>
          );
        },
        cell: (props) => {
          const { row } = props;
          if (!row.original.totalUnits) return '-';
          return (
            <div className="commonCell" style={{ textAlign: 'center' }}>
              {getFormattedMetrics(
                MetricsOptions.TOTAL_UNITS,
                row.original.totalUnits.average
              )}
            </div>
          );
        },
        footer: (props) => {
          const total = props.table
            .getRowModel()
            .rows.reduce(
              (sum, row) => sum + (row.original.totalUnits.average ?? 0),
              0
            );
          return (
            <div className="commonHeader" style={{ textAlign: 'center' }}>
              {total}
            </div>
          );
        },
      },
      {
        accessorKey: 'totalUnits',
        id: 'totalUnits',
        size: 150,
        header: (props) => {
          return (
            <div
              className="commonHeader"
              style={{
                textAlign: 'center',
                backgroundColor: bgColor,
              }}
            >
              {getDateRangeText(impactStartDate, impactEndDate)}
            </div>
          );
        },
        cell: (props) => {
          const { row } = props;
          if (!row.original.totalUnits) return '-';
          return (
            <div
              className="commonCell"
              style={{
                textAlign: 'center',
                backgroundColor: bgColor,
              }}
            >
              {getFormattedMetrics(
                MetricsOptions.TOTAL_UNITS,
                row.original.totalUnits.actual
              )}
            </div>
          );
        },
        footer: (props) => {
          const total = props.table
            .getRowModel()
            .rows.reduce(
              (sum, row) => sum + (row.original.totalUnits.actual ?? 0),
              0
            );

          return (
            <div className="commonHeader" style={{ textAlign: 'center' }}>
              {total}
            </div>
          );
        },
      },
    ],
  },
];

// ------------KEYWORD----------------------
export const keywordColumns = (
  startDate: string,
  endDate: string,
  impactStartDate: string,
  impactEndDate: string,
  selectedMetric: IDropdownItem<string>
): ColumnDef<IImpactedKeywordData>[] => [
  {
    accessorKey: 'impactKeywords',
    id: 'impactKeywords',
    header: (props) => {
      return (
        <div className="commonHeader" style={{ textAlign: 'left' }}>
          Impact Keywords
        </div>
      );
    },
    enableSorting: false,
    footer: (props) => {
      return (
        <div className="commonHeader" style={{ textAlign: 'left' }}>
          Total
        </div>
      );
    },
    columns: [
      {
        accessorKey: getFieldByMetricKey(`${selectedMetric.value}`),
        id: 'keywordName',
        size: 400,
        header: (props) => {
          return (
            <div
              className="commonHeader"
              style={{ display: 'flex', alignItems: 'left' }}
            >
              Keyword
            </div>
          );
        },
        cell: (props) => {
          const { row } = props;
          const value = row.original.keywordName;
          const matchType = row.original.matchType;

          const impactData = getSelectedMetricImpactData(
            row.original,
            selectedMetric.value
          );
          const percentageBodyWidth = formatPercentageWidth(
            getAnalysisPercentage(impactData).percentage
          );

          return (
            <div className={styles.itemPercentageContainerStyles}>
              <div
                className={styles.itemPercentageBody}
                style={{
                  background: getImpactBGColor(impactData.isNegative),
                }}
              >
                <div
                  className={styles.percentageContainer}
                  style={{
                    background: getImpactBGColor(impactData.isNegative, false),
                    width: displayValue(percentageBodyWidth),
                  }}
                ></div>
                <div
                  className={styles.itemContent}
                  title={`${value}   ${displayValue(
                    formatNum(impactData.percentage)
                  )}`}
                >
                  <p className={styles.itemName}>
                    {value}&nbsp;
                    {checkIsNull(matchType) === false ? `( ${matchType} )` : ''}
                  </p>
                  <p className={styles.itemValue}>
                    {displayValue(formatNum(impactData.percentage))}
                  </p>
                </div>
              </div>
            </div>
          );
        },
      },
    ],
  },
  {
    accessorKey: 'impactKeywordDetails',
    id: 'impactKeywordDetails',
    header: (props) => {
      return (
        <div className="commonHeader" style={{ textAlign: 'left' }}>
          Impact Keyword Details
        </div>
      );
    },
    enableSorting: false,
    footer: (props) => {
      return (
        <div className="commonHeader" style={{ textAlign: 'left' }}>
          Total
        </div>
      );
    },
    columns: [
      getNameColumn(AmazonSearchColumnsEnum.ADGROUP_NAME),
      getNameColumn(AmazonSearchColumnsEnum.CAMPAIGN_NAME),
    ],
  },
  ...(getGenericColumns(
    impactStartDate,
    startDate,
    endDate,
    impactEndDate
  ) as ColumnDef<IImpactedKeywordData>[]),
];

// ------------SEARCH-TERM----------------------
export const searchTermColumns = (
  startDate: string,
  endDate: string,
  impactStartDate: string,
  impactEndDate: string,
  selectedMetric: IDropdownItem<string>
): ColumnDef<IImpactedSearchTermData>[] => [
  {
    accessorKey: 'impactSearchTerms',
    id: 'impactSearchTerms',
    header: (props) => {
      return (
        <div className="commonHeader" style={{ textAlign: 'left' }}>
          Impact Search Term
        </div>
      );
    },
    enableSorting: false,
    footer: (props) => {
      return (
        <div className="commonHeader" style={{ textAlign: 'left' }}>
          Total
        </div>
      );
    },
    columns: [
      {
        accessorKey: getFieldByMetricKey(`${selectedMetric.value}`),
        id: 'searchTerm',
        size: 400,
        header: (props) => {
          return (
            <div
              className="commonHeader"
              style={{ display: 'flex', alignItems: 'left' }}
            >
              Search Term
            </div>
          );
        },
        cell: (props) => {
          const { row } = props;
          const value = row.original.searchTerm as string;
          const matchType = row.original.matchType;

          const impactData = getSelectedMetricImpactData(
            row.original,
            selectedMetric.value
          );
          const percentageBodyWidth = formatPercentageWidth(
            getAnalysisPercentage(impactData).percentage
          );

          if (!value || value === '')
            return <div className="no-data-view">-</div>;
          return (
            <div className={styles.itemPercentageContainerStyles}>
              <div
                className={styles.itemPercentageBody}
                style={{
                  background: getImpactBGColor(impactData.isNegative),
                }}
              >
                <div
                  className={styles.percentageContainer}
                  style={{
                    background: getImpactBGColor(impactData.isNegative, false),
                    width: displayValue(percentageBodyWidth),
                  }}
                ></div>
                <div
                  className={styles.itemContent}
                  title={`${value}   ${displayValue(
                    formatNum(impactData.percentage)
                  )}`}
                >
                  <p className={styles.itemName}>
                    {value}&nbsp;
                    {checkIsNull(matchType) === false ? `( ${matchType} )` : ''}
                  </p>
                  <p className={styles.itemValue}>
                    {displayValue(formatNum(impactData.percentage))}
                  </p>
                </div>
              </div>
            </div>
          );
        },
      },
    ],
  },
  {
    accessorKey: 'impactSearchTermDetails',
    id: 'impactSearchTermDetails',
    header: (props) => {
      return (
        <div className="commonHeader" style={{ textAlign: 'left' }}>
          Impact Search Term Details
        </div>
      );
    },
    enableSorting: false,
    footer: (props) => {
      return (
        <div className="commonHeader" style={{ textAlign: 'left' }}>
          Total
        </div>
      );
    },
    columns: [
      getNameColumn(AmazonSearchColumnsEnum.ANALYSIS_KEYWORD_NAME),
      getNameColumn(AmazonSearchColumnsEnum.ADGROUP_NAME),
      getNameColumn(AmazonSearchColumnsEnum.CAMPAIGN_NAME),
    ],
  },
  ...(getGenericColumns(
    impactStartDate,
    startDate,
    endDate,
    impactEndDate
  ) as ColumnDef<IImpactedSearchTermData>[]),
];
