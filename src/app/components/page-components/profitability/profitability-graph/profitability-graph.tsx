import { performanceGraphColors } from '@/constants';
import {
  IProfitabilityGraphProps,
  IProfitabilityScales,
} from '@/interfaces/profitability/profitability.interface';
import { getFormattedCompactNumbers } from '@/utils';
import { getFormattedMetrics } from '@/utils/advertising.utils';
import { getDynamicAxisPosition } from '@/utils/graph.utils';
import {
  CategoryScale,
  ChartEvent,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LegendElement,
  LegendItem,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  TooltipItem,
} from 'chart.js';
import { useCallback, useState } from 'react';
import { Line } from 'react-chartjs-2';
import GraphDialog from '../../../common/graph-dialog/graph-dialog';
import GraphEmptyState from '../../../common/graph-empty-state/graph-empty-state';
import styles from './profitability-graph.module.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ProfitabilityGraph<T>({
  chartData,
  selectedMetricsData,
  formattedXAxisText,
  expandGraph,
  handleExpandClose,
  chartTitle,
  handleTableEmptyReset,
}: Readonly<IProfitabilityGraphProps<T>>) {
  const [hiddenDatasets, setHiddenDatasets] = useState<Set<number>>(new Set());

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
        offset: chartData?.labels?.length === 1,
      },
    };

    selectedMetricsData?.forEach((metric, index) => {
      if (!metric) return;

      const position = getDynamicAxisPosition(
        index,
        hiddenDatasets,
        selectedMetricsData.length
      );
      const isHidden = hiddenDatasets.has(index);

      scales[metric.yAxisID] = {
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
  }, [
    chartData?.datasets.length,
    formattedXAxisText,
    hiddenDatasets,
    selectedMetricsData,
  ]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,

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

  return (
    <div className={styles.profitabilityGraphContainer}>
      {chartData !== null ? (
        <Line
          options={options}
          data={chartData}
          height={80}
          className={styles.lineGraph}
        />
      ) : (
        <div className={styles.emptyStateContainer}>
          <GraphEmptyState />
        </div>
      )}

      {expandGraph === true && chartData !== null && (
        <GraphDialog
          open={expandGraph}
          onClose={handleExpandClose}
          label={chartTitle}
          chartData={[]}
          isDownloadDisabled={true}
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
}

export default ProfitabilityGraph;
