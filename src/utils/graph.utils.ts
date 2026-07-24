import {
  IScatterChartDataPoint,
  IScatterPlotMinMax,
} from '@/app/components/common/custom-scatter-plot/custom-scatter-plot.interface';
import {
  Chart,
  ChartDataset,
  ChartEvent,
  LegendElement,
  LegendItem,
  Plugin,
  Scale,
} from 'chart.js';
import { parseNum } from '.';

export const SCATTER_PLOT_PADDING_FACTOR_MIN = 0.2;
export const SCATTER_PLOT_PADDING_FACTOR_MAX = 1.1;
export const SCATTER_PLOT_BOUNDARY_MIN = -40;
export const SCATTER_PLOT_BOUNDARY_MAX = 120;

export const DEFAULT_MIN_MAX: IScatterPlotMinMax = {
  min: SCATTER_PLOT_BOUNDARY_MIN,
  max: SCATTER_PLOT_BOUNDARY_MAX,
};

export const handleGraphLegendHover = (
  evt: ChartEvent,
  item: LegendItem,
  legend: LegendElement<'line'> | undefined
) => {
  if (legend?.chart?.data?.datasets) {
    legend.chart.data.datasets.forEach(
      (_legend: any, index: any, legends: any) => {
        // backgroundColor
        legends[index].backgroundColor =
          index === item.datasetIndex || _legend.backgroundColor.length === 9
            ? _legend.backgroundColor
            : _legend.backgroundColor + '4D';

        //borderColor
        legends[index].borderColor =
          index === item.datasetIndex || _legend.borderColor.length === 9
            ? _legend.borderColor
            : _legend.borderColor + '4D';
      }
    );
    legend.chart.update();
  }
};

export const handleGraphLegendLeave = (
  evt: ChartEvent,
  item: LegendItem,
  legend: LegendElement<'line'> | undefined
) => {
  if (legend?.chart?.data?.datasets) {
    legend.chart.data.datasets.forEach(
      (_legend: any, index: any, legends: any) => {
        // backgroundColor
        legends[index].backgroundColor =
          _legend.backgroundColor.length === 9
            ? _legend.backgroundColor.slice(0, -2)
            : _legend.backgroundColor;

        //borderColor
        legends[index].borderColor =
          _legend.borderColor.length === 9
            ? _legend.borderColor.slice(0, -2)
            : _legend.borderColor;
      }
    );
    legend.chart.update();
  }
};

export const getDynamicAxisPosition = (
  datasetIndex: number,
  hiddenDatasets: Set<number>,
  totalMetrics = 4
): 'left' | 'right' => {
  if (totalMetrics !== undefined) {
    const leftCount = Math.ceil(totalMetrics / 2);

    if (hiddenDatasets.has(datasetIndex)) {
      return datasetIndex < leftCount ? 'left' : 'right';
    }

    const visibleDatasets = Array.from(
      { length: totalMetrics },
      (_, i) => i
    ).filter((idx) => !hiddenDatasets.has(idx));

    if (visibleDatasets.length === 1) {
      return 'left';
    }

    const visibleLeftCount = Math.ceil(visibleDatasets.length / 2);
    const datasetPositionInVisible = visibleDatasets.indexOf(datasetIndex);

    return datasetPositionInVisible < visibleLeftCount ? 'left' : 'right';
  }
  return 'left';
};

export const extractXValues = (
  datasets: ChartDataset<'scatter', IScatterChartDataPoint[]>[]
): number[] => {
  const allValues: number[] = [];
  for (const dataset of datasets) {
    for (const point of dataset.data) {
      allValues.push(parseNum(point.x));
    }
  }
  return allValues;
};

export const findMinMax = (values: number[]): IScatterPlotMinMax => {
  if (values.length === 0) {
    return { min: 0, max: 0 };
  }
  let min = values[0];
  let max = values[0];
  for (let i = 1; i < values.length; i++) {
    const value = values[i];
    if (value < min) min = value;
    if (value > max) max = value;
  }
  return { min, max };
};

export const calculateScatterPlotMinMax = (
  datasets: ChartDataset<'scatter', IScatterChartDataPoint[]>[]
): IScatterPlotMinMax => {
  const xValues = extractXValues(datasets);
  if (!xValues || xValues.length === 0) {
    return DEFAULT_MIN_MAX;
  }

  const { min: actualMin, max: actualMax } = findMinMax(xValues);

  const paddedMin =
    actualMin === 0
      ? SCATTER_PLOT_BOUNDARY_MIN
      : actualMin - Math.abs(actualMin) * SCATTER_PLOT_PADDING_FACTOR_MIN;

  const paddedMax =
    actualMax === 0
      ? SCATTER_PLOT_BOUNDARY_MAX
      : actualMax * SCATTER_PLOT_PADDING_FACTOR_MAX;

  return {
    min: Math.min(paddedMin, SCATTER_PLOT_BOUNDARY_MIN),
    max: Math.max(paddedMax, SCATTER_PLOT_BOUNDARY_MAX),
  };
};

export const SCATTER_PLOT_BACKGROUND_PLUGIN: Plugin<'scatter'> = {
  id: 'backgroundZones',

  beforeDraw: (chart: Chart) => {
    const { ctx, chartArea, scales } = chart;
    if (!chartArea) return;

    const { left, right, top, bottom } = chartArea;
    const xScale = scales.x;

    ctx.save();

    const gradient = ctx.createLinearGradient(left, 0, right, 0);

    const RED_MAX = -60;
    const YELLOW_MAX = 60;
    const BLEND_WIDTH = 30;

    const redStop = getColorBoundary(RED_MAX, xScale, left, right);
    const yellowStart = getColorBoundary(
      RED_MAX + BLEND_WIDTH,
      xScale,
      left,
      right
    );
    const yellowEnd = getColorBoundary(
      YELLOW_MAX - BLEND_WIDTH,
      xScale,
      left,
      right
    );
    const greenStart = getColorBoundary(YELLOW_MAX, xScale, left, right);

    gradient.addColorStop(0, '#FFCDCD');
    gradient.addColorStop(redStop, '#FFCDCD');
    gradient.addColorStop(yellowStart, '#FFFFCD');
    gradient.addColorStop(yellowEnd, '#FFFFCD');
    gradient.addColorStop(greenStart, '#CDFFE5');
    gradient.addColorStop(1, '#CDFFE5');

    ctx.fillStyle = gradient;
    ctx.fillRect(left, top, right - left, bottom - top);

    const zeroX = xScale.getPixelForValue(0);
    if (zeroX >= left && zeroX <= right) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(zeroX, top);
      ctx.lineTo(zeroX, bottom);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  },
};

export const getColorBoundary = (
  value: number,
  xScale: Scale,
  left: number,
  right: number
) => {
  const px = xScale.getPixelForValue(value);
  return Math.min(1, Math.max(0, (px - left) / (right - left)));
};
