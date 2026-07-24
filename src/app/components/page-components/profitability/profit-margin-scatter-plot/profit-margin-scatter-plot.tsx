import CustomScatterPlot from '@/app/components/common/custom-scatter-plot/custom-scatter-plot';

import {
  IProfitMarginScatterPlotProps,
  IProfitScatterTooltipData,
  IScatterPlotDataPoint,
} from '@/interfaces/profitability/profitability.interface';
import {
  displayValue,
  formatNum,
  getFormattedCompactNumbers,
  getSymbolBasedOnMetric,
  parseNum,
} from '@/utils';
import { getFormattedMetrics } from '@/utils/advertising.utils';
import { SCATTER_PLOT_BACKGROUND_PLUGIN } from '@/utils/graph.utils';
import { ScriptableContext } from 'chart.js';
import { useMemo } from 'react';
import styles from './profit-margin-scatter-plot.module.scss';

function ProfitMarginScatterPlot<T>({
  processedChartData,
  isLoading = false,
  height = 400,
  metricLabel,
}: Readonly<IProfitMarginScatterPlotProps<T>>) {
  const pointStyle = useMemo(
    () => ({
      radius: 6,
      hoverRadius: 8,
      borderWidth: 2,
      hoverBorderWidth: 3,
      borderColor: '#ffffff',
      hoverBorderColor: '#ffffff',
      backgroundColor: (context: ScriptableContext<'line'>) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return '#0085ff';

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 6);
        gradient.addColorStop(0, '#4da6ff');
        gradient.addColorStop(0.7, '#0085ff');
        gradient.addColorStop(1, '#0066cc');
        return gradient;
      },
    }),
    []
  );

  const tooltipRenderer = useMemo(
    () => (dataPoint: IScatterPlotDataPoint<T>) => {
      const data = dataPoint as unknown as IProfitScatterTooltipData;

      return `
        <div class="${styles.customTooltip}">
          <div class="${styles.tooltipHeader}">
            <span class="${styles.imgContainer}">
              <img src="${data.imgUrl}" alt="${data.productName}" class="${
        styles.imgStyles
      }"/>
              <div class="${styles.title}">
                <span class="${styles.productName}" title="${
        data.productName
      }">${data.productName}</span>
                <span class="flex">
                  <span class="${styles.asin}">ID: ${
        data.asin ?? '-'
      }</span> &nbsp;|&nbsp;
                  <span class="${styles.asin}">SKU: ${data.sku ?? '-'}</span>
                </span>
              </div>
            </span>
          </div>
          <div class="${styles.tooltipBody}">
            <div class="${styles.metric}">
              <span class="${styles.label}">Profit Margin:</span>
              <span class="${styles.value} ${
        data.profitMargin < 0 ? styles.negative : styles.positive
      }">${displayValue(formatNum(data.profitMargin))}</span>
            </div>
            <span class="${styles.vl}"></span>
            <div class="${styles.metric}">
              <span class="${styles.label}">${metricLabel}:</span>
              <span class="${styles.value}">${getFormattedMetrics(
        data.selectedMetricKey,
        parseNum(data.selectedMetricValue ?? 0)
      )}</span>
            </div>
          </div>
        </div>
      `;
    },
    [metricLabel]
  );

  const xAxisConfig = useMemo(
    () => ({
      title: 'Profit Margin (%)',
      gridColor: 'rgba(0, 0, 0, 0.1)',
      tickCallback: (tickValue: unknown) => tickValue as string | number | null,
    }),
    []
  );

  const yAxisTitle = useMemo(() => {
    const symbol = getSymbolBasedOnMetric(metricLabel);
    if (!symbol) return metricLabel;
    return `${metricLabel} (${symbol})`;
  }, [metricLabel]);

  const yAxisConfig = useMemo(
    () => ({
      title: yAxisTitle,
      gridColor: 'rgba(0, 0, 0, 0.1)',
      tickCallback: (tickValue: unknown) =>
        getFormattedCompactNumbers(Number(tickValue)),
    }),
    [yAxisTitle]
  );

  return (
    <CustomScatterPlot
      data={processedChartData}
      isLoading={isLoading}
      height={height}
      pointStyle={pointStyle}
      customRenderer={tooltipRenderer}
      xAxisConfig={xAxisConfig}
      yAxisConfig={yAxisConfig}
      backgroundPluginEnabled={true}
      customPlugins={[SCATTER_PLOT_BACKGROUND_PLUGIN]}
    />
  );
}

export default ProfitMarginScatterPlot;
