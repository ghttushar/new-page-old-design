import { yAxisNames } from '@/constants/profitability/profitability.constants';
import { IPerformanceGraphData } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IMultiSelectDropdownItem } from '@/interfaces/dropdown.interfaces';
import { IProfitabilityScales } from '@/interfaces/profitability/profitability.interface';
import {
  getFormattedMetrics,
  getMetricsGraphData,
} from '@/utils/advertising.utils';
import { getUSFormatDate } from '@/utils/datetime.utils';
import { getDynamicAxisPosition } from '@/utils/graph.utils';
import {
  ActiveElement,
  BubbleDataPoint,
  CategoryScale,
  ChartData,
  ChartDataset,
  ChartEvent,
  Chart as ChartJS,
  ChartOptions,
  ChartTypeRegistry,
  Legend,
  LegendElement,
  LegendItem,
  LinearScale,
  LineElement,
  Point,
  PointElement,
  Title,
  Tooltip,
  TooltipItem,
} from 'chart.js';
import React, { useCallback, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { performanceGraphColors } from '@/constants';
import { useAppDispatch } from 'src/redux/hooks';
import {
  resetAnalysisFilters,
  setSelectedMetric,
} from 'src/redux/slices/impact-analysis/impact-analysis.slice';
import { getFormattedCompactNumbers } from 'src/utils';
import '../../../../assets/styles/graph-tooltip/impact-tooltip.scss';
import GraphDialog from '../../common/graph-dialog/graph-dialog';
import TableEmptyState from '../../common/table-empty-state/table-empty-state';
import styles from './analysis-graph.module.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface IAnalysisGraphProps {
  selectedMetrics: IMultiSelectDropdownItem[];
  formattedXAxisText: string;
  expandGraph: boolean;
  handleExpandClose: () => void;
  chartLabel: string;
  rawData: IPerformanceGraphData[];
  chartRef: React.RefObject<HTMLDivElement>;
  data: IPerformanceGraphData[];
}

export const AnalysisGraph = React.memo(function AnalysisGraph({
  formattedXAxisText,
  expandGraph,
  handleExpandClose,
  chartLabel,
  rawData,
  chartRef,
  selectedMetrics,
  data,
}: IAnalysisGraphProps) {
  const dispatch = useAppDispatch();

  const [hiddenDatasets, setHiddenDatasets] = useState<Set<number>>(new Set());

  const chartData = useMemo<ChartData<'line'> | null>(() => {
    if (!data.length) return null;

    const labels: string[] = [];
    data.forEach((row) => {
      if (labels.includes(row.label)) return;
      labels.push(row.label);
    });
    labels.sort((a, b) => a.localeCompare(b));

    const dataMetrics = selectedMetrics.map((metric) =>
      getMetricsGraphData(data, metric, labels)
    );

    const datasets: ChartDataset<'line'>[] = selectedMetrics.map(
      (filter, index) => {
        return {
          label: filter.label,
          data: dataMetrics[index],
          yAxisID: yAxisNames[index],
          borderWidth: 2,
          borderColor: performanceGraphColors[index],
          backgroundColor: performanceGraphColors[index],
          pointStyle: 'circle',
          cubicInterpolationMode: 'monotone',
        };
      }
    );

    return {
      labels: labels.map((label) => getUSFormatDate(label)),
      datasets,
    };
  }, [data, selectedMetrics]);

  const onClick = useCallback(
    (_e: ChartEvent, legendItem: LegendItem, legend: LegendElement<'line'>) => {
      const index = legendItem.datasetIndex;
      if (hiddenDatasets.size === 3 && !hiddenDatasets.has(index ?? 0)) {
        return;
      }
      const ci = legend.chart;

      if (!index && index !== 0) return;

      if (ci.isDatasetVisible(index)) {
        ci.hide(index);
        legendItem.hidden = true;
        setHiddenDatasets((prev) => new Set([...prev, index]));
      } else {
        ci.show(index);
        legendItem.hidden = false;
        setHiddenDatasets((prev) => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
      }
    },
    [hiddenDatasets]
  );

  const generateDynamicScales = useCallback(() => {
    const scales: IProfitabilityScales = {
      x: {
        display: true,

        title: {
          display: true,
          text: formattedXAxisText,
        },
        grid: {
          display: false,
        },
        offset: data?.length === 1,
      },
    };

    selectedMetrics.forEach((metric, index) => {
      if (!metric) return;

      const position = getDynamicAxisPosition(
        index,
        hiddenDatasets,
        selectedMetrics.length
      );
      const isHidden = hiddenDatasets.has(index);

      scales[yAxisNames[index]] = {
        position,
        display: !isHidden,
        title: {
          display: true,
          text: metric.label,
          color: performanceGraphColors[index],
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
        },
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 5000,
          count: 5,
          callback(tickValue: any) {
            return getFormattedCompactNumbers(Number(tickValue));
          },
        },
        beginAtZero: true,
      };
    });

    return scales;
  }, [data?.length, formattedXAxisText, hiddenDatasets, selectedMetrics]);

  const onGraphClick = useCallback(
    (
      event: ChartEvent,
      elements: ActiveElement[],
      chart: ChartJS<
        keyof ChartTypeRegistry,
        (number | [number, number] | Point | BubbleDataPoint | null)[],
        unknown
      >
    ) => {
      if (elements.length === 0) return;
      if (event.type !== 'click') return;

      const element = elements[0];
      const datasetIndex = element.datasetIndex;
      const clickedMetric = selectedMetrics[datasetIndex];
      if (!clickedMetric) return;
      dispatch(setSelectedMetric(clickedMetric));
    },
    [dispatch, selectedMetrics]
  );

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'dataset',
      intersect: false,
    },
    onClick: onGraphClick,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        onClick(e, legendItem, legend) {
          onClick(e, legendItem, legend);
        },

        labels: {
          usePointStyle: true,

          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
        },
      },
      tooltip: {
        enabled: true,
        position: 'nearest',
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(245, 245, 235, 0.95)',
        titleColor: '#000000',
        bodyColor: '#000000',
        bodySpacing: 5,
        cornerRadius: 5,
        padding: 10,
        callbacks: {
          title(tooltipItems: any) {
            return `${tooltipItems[0].label}`;
          },
          label: (tooltipItem: TooltipItem<'line'>) => {
            const labelValue = getFormattedMetrics(
              tooltipItem.dataset.label,
              tooltipItem.raw as number
            );
            return `${tooltipItem.dataset.label}: ${labelValue}`;
          },
        },
      },
    },

    scales: generateDynamicScales(),
  };

  const handleTableEmptyReset = () => {
    dispatch(resetAnalysisFilters());
  };

  return (
    <div className={styles.performanceGraphContainer}>
      {chartData !== null ? (
        <div ref={chartRef} className={styles.graph}>
          <Line
            options={options}
            data={chartData}
            height={80}
            className={styles.lineGraph}
          />
        </div>
      ) : (
        <TableEmptyState handleReset={handleTableEmptyReset} />
      )}

      {expandGraph === true && chartData !== null && (
        <GraphDialog
          open={expandGraph}
          onClose={handleExpandClose}
          label={chartLabel}
          chartData={rawData}
        >
          <Line
            options={options}
            data={chartData}
            height={80}
            className={styles.lineGraph}
          />
        </GraphDialog>
      )}
    </div>
  );
});
