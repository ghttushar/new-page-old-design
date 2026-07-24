import GraphLoadingComponent from '@/app/components/common/graph-loading-state/graph-loading-state';
import { formatNum, getFormattedCompactNumbers } from '@/utils';
import {
  calculateScatterPlotMinMax,
  DEFAULT_MIN_MAX,
} from '@/utils/graph.utils';
import {
  ArrowCounterClockwiseIcon,
  BoundingBoxIcon,
  MinusIcon,
  PlusIcon,
} from '@phosphor-icons/react';
import {
  CategoryScale,
  Chart,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  PointElement,
  ScatterController,
  Title,
  Tooltip,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import GraphEmptyState from '../graph-empty-state/graph-empty-state';
import PrimaryIconButton from '../primary-icon-button/primary-icon-button';
import {
  ICustomScatterPlotProps,
  IExternalTooltipContext,
  IScatterChartDataPoint,
  IScatterPlotMinMax,
  IScatterPlotPointStyle,
} from './custom-scatter-plot.interface';
import styles from './custom-scatter-plot.module.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  ScatterController,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const defaultPointStyle: IScatterPlotPointStyle = {
  radius: 6,
  hoverRadius: 8,
  borderWidth: 2,
  hoverBorderWidth: 3,
  borderColor: '#ffffff',
  hoverBorderColor: '#ffffff',
  backgroundColor: '#0085ff',
};

function CustomScatterPlot<T extends IScatterChartDataPoint>({
  data,
  isLoading = false,
  height = 400,
  xAxisConfig,
  yAxisConfig,
  pointStyle = defaultPointStyle,
  customRenderer,
  chartLabel = 'Data Points',
  customPlugins,
  onDataPointClick,
}: Readonly<ICustomScatterPlotProps<T>>) {
  const isTooltipHoveredRef = useRef<boolean>(false);
  const chartRef = useRef<Chart<
    'scatter',
    IScatterChartDataPoint[],
    unknown
  > | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const tooltipMouseEnterHandlerRef = useRef<(() => void) | null>(null);
  const tooltipMouseLeaveHandlerRef = useRef<(() => void) | null>(null);
  const [isRectangleZoomMode, setIsRectangleZoomMode] =
    useState<boolean>(false);
  const isRectangleZoomModeRef = useRef<boolean>(isRectangleZoomMode);

  isRectangleZoomModeRef.current = isRectangleZoomMode;

  useEffect(() => {
    return () => {
      if (tooltipRef.current) {
        if (tooltipMouseEnterHandlerRef.current) {
          tooltipRef.current.removeEventListener(
            'mouseenter',
            tooltipMouseEnterHandlerRef.current
          );
        }
        if (tooltipMouseLeaveHandlerRef.current) {
          tooltipRef.current.removeEventListener(
            'mouseleave',
            tooltipMouseLeaveHandlerRef.current
          );
        }
        tooltipRef.current.remove();
        tooltipRef.current = null;
      }
    };
  }, []);

  const updateChart = () => {
    if (chartRef.current) {
      chartRef.current.update('none');
    }
  };

  const toggleRectangleZoomMode = () => {
    const newMode = !isRectangleZoomModeRef.current;
    setIsRectangleZoomMode(newMode);

    if (chartRef.current) {
      const chart = chartRef.current;
      const zoomPlugin = chart.options.plugins?.zoom;

      if (zoomPlugin?.zoom?.drag) {
        zoomPlugin.zoom.drag.enabled = newMode;
      }
      if (zoomPlugin?.pan) {
        zoomPlugin.pan.enabled = !newMode;
      }

      chart.update('none');
    }
  };

  const handleZoomIn = () => {
    if (chartRef.current) {
      chartRef.current.zoom(1.2);
      updateChart();
    }
  };

  const handleZoomOut = () => {
    if (chartRef.current) {
      chartRef.current.zoom(0.8);
      updateChart();
    }
  };

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
      updateChart();
    }
  };
  const chartData: ChartData<'scatter', IScatterChartDataPoint[], unknown> =
    useMemo(() => {
      if (!data || data.length === 0) return { datasets: [] };

      return {
        datasets: [
          {
            label: chartLabel,
            data,
            backgroundColor: pointStyle.backgroundColor,
            pointRadius: pointStyle.radius,
            pointHoverRadius: pointStyle.hoverRadius,
            pointBorderWidth: pointStyle.borderWidth,
            pointBorderColor: pointStyle.borderColor,
            pointHoverBorderWidth: pointStyle.hoverBorderWidth,
            pointHoverBorderColor: pointStyle.hoverBorderColor,
          },
        ],
      };
    }, [data, chartLabel, pointStyle]);

  const minMaxValue = useMemo((): IScatterPlotMinMax => {
    if (!chartData?.datasets?.length) {
      return DEFAULT_MIN_MAX;
    }

    return calculateScatterPlotMinMax(chartData.datasets);
  }, [chartData]);

  const options: ChartOptions<'scatter'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        zoom: {
          zoom: {
            drag: {
              enabled: isRectangleZoomModeRef.current,
              backgroundColor: 'rgba(0, 133, 255, 0.3)',
              borderColor: 'rgba(0, 133, 255, 0.8)',
              borderWidth: 2,
              threshold: 10,
              cursor: 'pointer',
            },
            mode: 'xy',
            onZoom: () => {
              updateChart();
            },
          },
          pan: {
            enabled: !isRectangleZoomModeRef.current,
            mode: 'xy',
            onPan: () => {
              updateChart();
            },
          },
        },
        tooltip: {
          enabled: customRenderer === undefined,
          external: customRenderer
            ? (context: IExternalTooltipContext) => {
                const { chart, tooltip } = context;

                const parentNode = chart.canvas.parentNode;
                if (!parentNode) return;

                let tooltipEl: HTMLDivElement | null =
                  parentNode.querySelector('#chartjs-tooltip');

                if (!tooltipEl) {
                  tooltipEl = document.createElement('div');
                  tooltipEl.id = 'chartjs-tooltip';
                  tooltipEl.innerHTML = '<div></div>';
                  tooltipEl.style.pointerEvents = 'auto';
                  parentNode.appendChild(tooltipEl);
                  tooltipRef.current = tooltipEl;

                  const handleMouseEnter = () => {
                    isTooltipHoveredRef.current = true;
                  };
                  const handleMouseLeave = () => {
                    isTooltipHoveredRef.current = false;
                    if (tooltipEl) {
                      tooltipEl.style.opacity = '0';
                      tooltipEl.style.display = 'none';
                    }
                  };

                  tooltipMouseEnterHandlerRef.current = handleMouseEnter;
                  tooltipMouseLeaveHandlerRef.current = handleMouseLeave;

                  tooltipEl.addEventListener('mouseenter', handleMouseEnter);
                  tooltipEl.addEventListener('mouseleave', handleMouseLeave);
                }

                if (tooltip.opacity === 0 && !isTooltipHoveredRef.current) {
                  tooltipEl!.style.opacity = '0';
                  tooltipEl!.style.display = 'none';
                  return;
                }

                if (
                  tooltip.dataPoints &&
                  tooltip.dataPoints.length > 0 &&
                  customRenderer
                ) {
                  const dataPoint = tooltip.dataPoints[0];
                  const rawData = dataPoint.raw as T;

                  tooltipEl!.innerHTML = customRenderer(rawData);
                }

                tooltipEl!.style.opacity = '1';
                tooltipEl!.style.display = 'block';
                tooltipEl!.style.position = 'absolute';

                const tooltipWidth = tooltipEl!.offsetWidth;
                const tooltipHeight = tooltipEl!.offsetHeight;

                tooltipEl!.style.left = `${
                  tooltip.caretX - tooltipWidth / 2
                }px`;
                tooltipEl!.style.top = `${
                  tooltip.caretY - tooltipHeight + 4
                }px`;
                tooltipEl!.style.zIndex = '10000';
                tooltipEl!.style.transition = 'opacity .1s ease';
              }
            : undefined,
        },
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          title: {
            display: !!xAxisConfig?.title,
            text: xAxisConfig?.title || '',
            font: {
              size: xAxisConfig?.fontSize ?? 14,
              family: xAxisConfig?.fontFamily || 'Inter, sans-serif',
              weight: (xAxisConfig?.fontWeight as string) || '500',
            },
          },
          grid: {
            display: true,
            color: xAxisConfig?.gridColor || 'rgba(0, 0, 0, 0.1)',
          },
          ticks: {
            callback(tickValue) {
              return formatNum(tickValue, false);
            },
            font: {
              size: 12,
              family: 'Inter, sans-serif',
            },
          },
          min: xAxisConfig?.min ?? Math.round(minMaxValue.min),
          max: xAxisConfig?.max ?? Math.round(minMaxValue.max),
        },
        y: {
          type: 'linear',
          title: {
            display: !!yAxisConfig?.title,
            text: yAxisConfig?.title || '',
            font: {
              size: yAxisConfig?.fontSize ?? 14,
              family: yAxisConfig?.fontFamily || 'Inter, sans-serif',
              weight: (yAxisConfig?.fontWeight as string) || '500',
            },
          },
          grid: {
            display: true,
            color: yAxisConfig?.gridColor || 'rgba(0, 0, 0, 0.1)',
          },
          ticks: {
            callback(tickValue: unknown) {
              return yAxisConfig?.tickCallback
                ? yAxisConfig.tickCallback(tickValue, 0)
                : getFormattedCompactNumbers(Number(tickValue));
            },
            font: {
              size: 12,
              family: 'Inter, sans-serif',
            },
          },
          beginAtZero: true,
        },
      },
      interaction: {
        mode: 'point',
      },
      onClick: (_event, elements) => {
        if (elements.length > 0 && onDataPointClick) {
          const datasetIndex = elements[0].datasetIndex;
          const index = elements[0].index;
          if (chartData?.datasets[datasetIndex]) {
            const point = chartData.datasets[datasetIndex].data[index] as T;
            onDataPointClick(point);
          }
        }
      },
    }),
    [
      minMaxValue,
      xAxisConfig,
      yAxisConfig,
      customRenderer,
      onDataPointClick,
      chartData,
    ]
  );

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingContainer}>
          <GraphLoadingComponent bars={20} yAxisPoints={5} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.container}
      style={{
        cursor: isRectangleZoomMode ? 'crosshair' : 'auto',
      }}
    >
      {chartData !== null ? (
        <Scatter
          ref={chartRef}
          options={options}
          data={chartData}
          height={height}
          className={styles.scatterChart}
          plugins={customPlugins}
        />
      ) : (
        <div className={styles.emptyStateContainer}>
          <GraphEmptyState />
        </div>
      )}
      <div className={styles.zoomControls}>
        <PrimaryIconButton
          buttonFunction={toggleRectangleZoomMode}
          disabled={false}
          buttonIcon={<BoundingBoxIcon />}
        />
        <PrimaryIconButton
          buttonFunction={handleZoomIn}
          disabled={false}
          buttonIcon={<PlusIcon />}
        />
        <PrimaryIconButton
          buttonFunction={handleZoomOut}
          disabled={false}
          buttonIcon={<MinusIcon />}
        />
        <PrimaryIconButton
          buttonFunction={handleResetZoom}
          disabled={false}
          buttonIcon={<ArrowCounterClockwiseIcon />}
        />
      </div>
    </div>
  );
}
export default CustomScatterPlot;
