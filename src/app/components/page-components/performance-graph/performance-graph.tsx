import { FrequencyOptions } from '@/constants/sov.filter.constants';
import { Frequency } from '@/enums/serp.enums';
import { IPerformanceGraphData } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { getDynamicAxisPosition } from '@/utils/graph.utils';
import {
  CategoryScale,
  ChartData,
  ChartEvent,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LegendElement,
  LegendItem,
  LineElement,
  LinearScale,
  Point,
  PointElement,
  Title,
  Tooltip,
  TooltipItem,
} from 'chart.js';
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { customRangeFilterOption, performanceGraphColors } from 'src/constants';
import {
  DATE_FORMAT_13,
  DATE_FORMAT_3,
} from 'src/constants/datetime.constants';
import { MetricsOptions } from 'src/enums/advertising.enums';
import { IAnalysis } from 'src/interfaces/analysis.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  IPerformanceMetricsFilters,
  selectAdvertisingFilter,
} from 'src/redux/slices/advertising/advertising-filter.slice';
import {
  selectIsChatbotExpanded,
  selectIsSidebarMenuOpen,
} from 'src/redux/slices/auth/auth.slice';
import {
  selectAnalysisFilter,
  selectImpactAnalysisData,
  setAnalysisFilters,
  setSelectedAnalysisMetrics,
  setSelectedMetric,
} from 'src/redux/slices/impact-analysis/impact-analysis.slice';
import {
  displayValue,
  findByValueForIDropDownItem,
  formatNum,
  getFormattedCompactNumbers,
} from 'src/utils';
import { getFormattedMetrics } from 'src/utils/advertising.utils';
import {
  getTargetedMetric,
  getTooltipBodyData,
} from 'src/utils/analysis.utils';
import {
  changeDateFormat,
  getStartEndByFrequency,
} from 'src/utils/datetime.utils';
import { getOrCreateTooltip } from 'src/utils/graph-tooltips.utils';
import '../../../../assets/styles/graph-tooltip/impact-tooltip.scss';
import GraphDialog from '../../common/graph-dialog/graph-dialog';
import TableEmptyState from '../../common/table-empty-state/table-empty-state';
import styles from './performance-graph.module.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface IPerformanceGraphProps {
  rawData: IPerformanceGraphData[];
  chartData: ChartData<'line'> | null;
  formattedXAxisText: string;
  expandGraph: boolean;
  handleExpandClose: () => void;
  chartTitle: string;
  handleImpactButtonShow: () => void;
  handleImpactButtonHide: () => void;
  isShowImpactOn: boolean;
  performanceMetrics: IPerformanceMetricsFilters;
  handleTableEmptyReset: () => void;
  chartRef: React.RefObject<HTMLDivElement>;
  selectedAdvertisingNavTitle: string;
  accountType?: string;
}

export function PerformanceGraph({
  rawData,
  chartData,
  formattedXAxisText,
  expandGraph,
  handleExpandClose,
  chartTitle,
  handleImpactButtonShow,
  handleImpactButtonHide,
  isShowImpactOn,
  performanceMetrics,
  handleTableEmptyReset,
  chartRef,
  selectedAdvertisingNavTitle,
  accountType,
}: IPerformanceGraphProps) {
  const analysisFilters = useAppSelector(selectAnalysisFilter);
  const advertisingFilters = useAppSelector(selectAdvertisingFilter);
  const impactAnalysisData = useAppSelector(selectImpactAnalysisData);
  const isSidebarMenuOpen = useAppSelector(selectIsSidebarMenuOpen);
  const isChatbotExpanded = useAppSelector(selectIsChatbotExpanded);

  const [hiddenDatasets, setHiddenDatasets] = useState<Set<number>>(new Set());

  const dispatch = useAppDispatch();

  const getYAxisConfig = (
    metricLabel: string,
    color: string,
    datasetIndex: number
  ) => ({
    position: getDynamicAxisPosition(datasetIndex, hiddenDatasets),
    display: !hiddenDatasets.has(datasetIndex),
    title: {
      display: true,
      text: metricLabel,
      color,
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
  });

  const options: ChartOptions<'line'> = {
    events: isShowImpactOn
      ? ['click']
      : ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
    responsive: true,
    maintainAspectRatio: false,
    onClick(event, elements, chart) {
      if (isShowImpactOn) {
        if (elements && elements.length > 0) {
          const element = elements[0];
          const index = element.index;
          const targetedDate = getStartEndByFrequency(
            advertisingFilters.frequency.value,
            chartData?.labels ? (chartData?.labels[index] as string) : ''
          );

          dispatch(
            setAnalysisFilters({
              ...analysisFilters,
              ...advertisingFilters,
              frequency: findByValueForIDropDownItem(
                FrequencyOptions,
                Frequency.DAILY,
                FrequencyOptions[0]
              ),
              impactRange: customRangeFilterOption,
              impactCustomDateRange: targetedDate,
            })
          );

          if (targetedDate) {
            handleImpactButtonShow();
          }
        } else {
          handleImpactButtonHide();
        }
      } else {
        handleImpactButtonHide();
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
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
        enabled: isShowImpactOn ? false : true,
        position: 'nearest',
        mode: !isShowImpactOn ? 'nearest' : 'point',
        intersect: false,
        backgroundColor: 'rgba(245, 245, 235, 0.95)',
        titleColor: '#000000',
        bodyColor: '#000000',
        bodySpacing: 5,
        cornerRadius: 5,
        padding: 8,
        callbacks: {
          title(tooltipItems: any) {
            return isShowImpactOn
              ? `Impact ${tooltipItems[0].dataset.label} (${tooltipItems[0].label})`
              : `${tooltipItems[0].label}`;
          },
          label: (tooltipItem: TooltipItem<'line'>) => {
            const labelValue = getFormattedMetrics(
              tooltipItem.dataset.label,
              tooltipItem.raw as number
            );

            return `${tooltipItem.dataset.label}: ${labelValue}`;
          },
        },
        external: (context: any) => {
          if (isShowImpactOn === false) return;
          const { chart, tooltip } = context;
          const tooltipEl = getOrCreateTooltip(chart);

          if (tooltip.opacity === 0 || impactAnalysisData === null) {
            tooltipEl.style.opacity = 0;
            return;
          }

          const dataPoints = tooltip.dataPoints[0];
          const impactLabel = dataPoints.label;
          const metric = dataPoints.dataset.label;

          dispatch(
            setSelectedAnalysisMetrics(
              getTargetedMetric(metric, analysisFilters.selectedAnalysisMetrics)
            )
          );
          dispatch(
            setSelectedMetric(
              getTargetedMetric(
                metric,
                analysisFilters.selectedAnalysisMetrics
              ).filter((f) => f.selected)[0]
            )
          );
          let bodyData: any = [];
          const _impactDate =
            advertisingFilters.frequency.value === Frequency.DAILY
              ? changeDateFormat(impactLabel, DATE_FORMAT_13, DATE_FORMAT_3)
              : impactLabel;
          if (
            metric === MetricsOptions.TOTAL_SALES ||
            metric === MetricsOptions.TOTAL_UNITS ||
            metric === MetricsOptions.TACOS
          ) {
            bodyData.push(
              `Impact Analysis is not available for ${metric}. Kindly choose other metrics.`
            );
            handleImpactButtonHide();
          } else if (impactAnalysisData.data?.[_impactDate] === undefined) {
            bodyData.push(
              `Impact Analysis is not available for ${_impactDate}`
            );
            handleImpactButtonHide();
          } else {
            bodyData = getTooltipBodyData(
              impactAnalysisData.data?.[_impactDate],
              metric,
              impactAnalysisData.table
            );
          }

          if (bodyData.length) {
            const titleLines = tooltip.title || [];

            tooltipEl.innerHTML = `<div class='tooltipDataDiv'>
              <div class='titleHeader'></div>
              <div class='bodyDiv'></div>
            </div>`;

            const titleHeader = tooltipEl.querySelector('.titleHeader');

            titleLines.forEach((title: string) => {
              const titleLine = document.createElement('div');
              titleLine.className = 'titleLine';
              const text = document.createTextNode(title);
              titleLine.appendChild(text);
              titleHeader.appendChild(titleLine);
            });

            const bodyDiv = tooltipEl.querySelector('.bodyDiv');
            if (
              metric === MetricsOptions.TOTAL_SALES ||
              metric === MetricsOptions.TOTAL_UNITS ||
              metric === MetricsOptions.TACOS ||
              impactAnalysisData.data?.[_impactDate] === undefined
            ) {
              bodyData.forEach((body: string) => {
                const bodyContainer = document.createElement('div');
                bodyContainer.className = 'bodyEmptyContainer';
                bodyContainer.style.color = '#000';
                const noDataMsg = document.createElement('p');
                noDataMsg.className = 'noDataMsg';
                noDataMsg.title = body;
                noDataMsg.innerText = body;
                bodyContainer.appendChild(noDataMsg);
                bodyDiv.appendChild(bodyContainer);
              });
            } else {
              bodyData.forEach((body: { name: string; value: IAnalysis }) => {
                let bodyWidth1 = 0;

                if (body.value.percentage > 100) {
                  bodyWidth1 = 100;
                } else {
                  bodyWidth1 = Math.abs(body.value.percentage);
                }

                const bodyContainer = document.createElement('div');
                bodyContainer.className = 'bodyContainer';

                const bodyPercentage1 = document.createElement('div');
                bodyPercentage1.className = 'bodyPercentage1';
                bodyPercentage1.style.width = `${bodyWidth1}%`;
                bodyPercentage1.style.background = `${
                  body.value.isNegative ? '#ff0000' : '#13C9C8'
                }`;

                const bodyContent = document.createElement('div');
                bodyContent.className = 'bodyContent';
                bodyContent.style.color = `#000000`;

                const name = document.createElement('p');
                name.className = 'itemName';
                name.title = body.name;
                name.innerText = body.name;
                const value = document.createElement('p');
                value.className = 'itemValue';
                value.innerText = `${displayValue(
                  formatNum(body.value.percentage, false)
                )}`;

                bodyContent.appendChild(name);
                bodyContent.appendChild(value);
                bodyContainer.appendChild(bodyPercentage1);
                bodyContainer.appendChild(bodyContent);
                bodyDiv.appendChild(bodyContainer);
              });
            }
          }

          const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

          tooltipEl.style.opacity = isShowImpactOn ? 1 : 0;
          tooltipEl.style.left = positionX + tooltip.caretX + 'px';
          tooltipEl.style.top = positionY + tooltip.caretY + 'px';
          tooltipEl.style.font = tooltip.options.bodyFont.string;
          tooltipEl.style.borderRadius = '0.4rem';
          tooltipEl.style.background = 'transparent';
          tooltipEl.style.backdropFilter = 'blur(0.2rem)';
          tooltipEl.style.boxShadow = '0 0 0.4rem 0 rgba(0,0,0,0.15)';
          tooltipEl.style.border = 'none';
          tooltipEl.style.padding =
            tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';

          return tooltipEl;
        },
      },
    },
    scales: {
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
      y: getYAxisConfig(
        performanceMetrics.metrics1.label,
        performanceGraphColors[0],
        0
      ),
      y1: getYAxisConfig(
        performanceMetrics.metrics2.label,
        performanceGraphColors[1],
        1
      ),
      y2: getYAxisConfig(
        performanceMetrics.metrics3.label,
        performanceGraphColors[2],
        2
      ),
      y3: getYAxisConfig(
        performanceMetrics.metrics4.label,
        performanceGraphColors[3],
        3
      ),
    },
  };

  const onClick = (
    _e: ChartEvent,
    legendItem: LegendItem,
    _legend: LegendElement<'line'>
  ) => {
    if (
      hiddenDatasets.size === 3 &&
      !hiddenDatasets.has(legendItem.datasetIndex ?? 0)
    ) {
      return;
    }
    const index = legendItem.datasetIndex;

    if (!index && index !== 0) return;

    setHiddenDatasets((prev) => {
      const newSet = new Set(prev);
      if (prev.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getProcessedChartData = (
    chartData: ChartData<'line', (number | Point | null)[], unknown> | null,
    hiddenDatasets: Set<number>
  ) => {
    const processedData = {
      ...chartData,
      datasets: chartData?.datasets.map((data, idx) => ({
        ...data,
        hidden: hiddenDatasets.has(idx),
      })),
    };

    return processedData as ChartData<
      'line',
      (number | Point | null)[],
      unknown
    >;
  };

  return (
    <div
      className={styles.performanceGraphContainer}
      key={JSON.stringify([isShowImpactOn, isChatbotExpanded])}
      style={{
        width: isSidebarMenuOpen ? 'calc(100% - 1rem)' : '100%',
      }}
      ref={chartRef}
    >
      {chartData !== null ? (
        <Line
          key="normal-graph"
          options={options}
          data={getProcessedChartData(chartData, hiddenDatasets)}
          height={80}
          className={styles.lineGraph}
        />
      ) : (
        <TableEmptyState handleReset={handleTableEmptyReset} />
      )}

      {expandGraph === true && chartData !== null && (
        <GraphDialog
          open={expandGraph}
          onClose={handleExpandClose}
          label={chartTitle}
          chartData={rawData}
          featureTitle={selectedAdvertisingNavTitle}
          accountType={accountType}
        >
          <Line
            key="expanded-graph"
            options={options}
            data={getProcessedChartData(chartData, hiddenDatasets)}
            height={80}
            className={styles.lineGraph}
          />
        </GraphDialog>
      )}
    </div>
  );
}
