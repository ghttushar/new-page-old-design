import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import GraphLoadingComponent from '@/app/components/common/graph-loading-state/graph-loading-state';
import { getFormattedMetrics } from '@/utils/advertising.utils';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { performanceGraphColors } from 'src/constants';
import { WEEKDAYS } from 'src/constants/dayparting.constants';
import { DaypartingTimeTypeEnum } from 'src/enums/day-parting.enums';
import { IDaypartingMetricsData } from 'src/interfaces/day-parting.interfaces';
import { useAppSelector } from 'src/redux/hooks';
import { selectIsSidebarMenuOpen } from 'src/redux/slices/auth/auth.slice';
import {
  getFormattedCompactNumbers,
  getTitleCaseString,
  parseNum,
} from 'src/utils';
import { getDaypartingMetricsGraphData } from 'src/utils/day-parting.utils';
import {
  handleGraphLegendHover,
  handleGraphLegendLeave,
} from 'src/utils/graph.utils';
import styles from './dayparting-graph.module.scss';

interface DaypartingLineGraphProps {
  data: IDaypartingMetricsData[];
  isLoading: boolean;
  metric: IDropdownItem<string>;
}
const DaypartingLineGraph = (props: DaypartingLineGraphProps) => {
  const { data, metric, isLoading } = props;
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: [],
  });

  const isSidebarMenuOpen = useAppSelector(selectIsSidebarMenuOpen);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
        },
        onHover: handleGraphLegendHover,
        onLeave: handleGraphLegendLeave,
      },
      tooltip: {
        enabled: true,
        position: 'nearest',
        intersect: false,
        backgroundColor: 'rgba(245, 245, 235, 0.95)',
        titleColor: '#000000',
        bodyColor: '#000000',
        bodySpacing: 5,
        cornerRadius: 5,
        padding: 10,
        callbacks: {
          label(tooltipItem) {
            return `${metric.label}: ${getFormattedMetrics(
              metric.value,
              parseNum(`${tooltipItem.raw}`)
            )}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        position: 'left',
        grid: {
          display: true,
        },
        ticks: {
          stepSize: 4000,
          count: 5,
          callback(tickValue) {
            return getFormattedCompactNumbers(Number(tickValue));
          },
        },
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    if (data.length > 0) {
      const labels: any[] = Object.values(DaypartingTimeTypeEnum);

      const datasets: ChartDataset<'line'>[] = [];

      const weekDayMetrics1 = getDaypartingMetricsGraphData(
        data,
        getTitleCaseString(WEEKDAYS[0]),
        Array.from({ length: 24 }, (_, i) => i)
      );

      const weekDayMetrics2 = getDaypartingMetricsGraphData(
        data,
        getTitleCaseString(WEEKDAYS[1]),
        Array.from({ length: 24 }, (_, i) => i)
      );

      const weekDayMetrics3 = getDaypartingMetricsGraphData(
        data,
        getTitleCaseString(WEEKDAYS[2]),
        Array.from({ length: 24 }, (_, i) => i)
      );

      const weekDayMetrics4 = getDaypartingMetricsGraphData(
        data,
        getTitleCaseString(WEEKDAYS[3]),
        Array.from({ length: 24 }, (_, i) => i)
      );

      const weekDayMetrics5 = getDaypartingMetricsGraphData(
        data,
        getTitleCaseString(WEEKDAYS[4]),
        Array.from({ length: 24 }, (_, i) => i)
      );

      const weekDayMetrics6 = getDaypartingMetricsGraphData(
        data,
        getTitleCaseString(WEEKDAYS[5]),
        Array.from({ length: 24 }, (_, i) => i)
      );

      const weekDayMetrics7 = getDaypartingMetricsGraphData(
        data,
        getTitleCaseString(WEEKDAYS[6]),
        Array.from({ length: 24 }, (_, i) => i)
      );

      datasets.push({
        label: getTitleCaseString(WEEKDAYS[0]),
        data: weekDayMetrics1,
        yAxisID: 'y',
        borderWidth: 2,
        borderColor: performanceGraphColors[0],
        backgroundColor: performanceGraphColors[0],
        pointStyle: 'circle',
        pointRadius: 1,
        cubicInterpolationMode: 'monotone',
      });

      datasets.push({
        label: getTitleCaseString(WEEKDAYS[1]),
        data: weekDayMetrics2,
        yAxisID: 'y',
        borderWidth: 2,
        borderColor: performanceGraphColors[1],
        backgroundColor: performanceGraphColors[1],
        pointStyle: 'circle',
        pointRadius: 1,
        cubicInterpolationMode: 'monotone',
      });

      datasets.push({
        label: getTitleCaseString(WEEKDAYS[2]),
        data: weekDayMetrics3,
        yAxisID: 'y',
        borderWidth: 2,
        borderColor: performanceGraphColors[2],
        backgroundColor: performanceGraphColors[2],
        pointStyle: 'circle',
        pointRadius: 1,
        cubicInterpolationMode: 'monotone',
      });

      datasets.push({
        label: getTitleCaseString(WEEKDAYS[3]),
        data: weekDayMetrics4,
        yAxisID: 'y',
        borderWidth: 2,
        borderColor: performanceGraphColors[3],
        backgroundColor: performanceGraphColors[3],
        pointStyle: 'circle',
        pointRadius: 1,
        cubicInterpolationMode: 'monotone',
      });

      datasets.push({
        label: getTitleCaseString(WEEKDAYS[4]),
        data: weekDayMetrics5,
        yAxisID: 'y',
        borderWidth: 2,
        borderColor: performanceGraphColors[4],
        backgroundColor: performanceGraphColors[4],
        pointStyle: 'circle',
        pointRadius: 1,
        cubicInterpolationMode: 'monotone',
      });

      datasets.push({
        label: getTitleCaseString(WEEKDAYS[5]),
        data: weekDayMetrics6,
        yAxisID: 'y',
        borderWidth: 2,
        borderColor: performanceGraphColors[5],
        backgroundColor: performanceGraphColors[5],
        pointStyle: 'circle',
        pointRadius: 1,
        cubicInterpolationMode: 'monotone',
      });

      datasets.push({
        label: getTitleCaseString(WEEKDAYS[6]),
        data: weekDayMetrics7,
        yAxisID: 'y',
        borderWidth: 2,
        borderColor: performanceGraphColors[6],
        backgroundColor: performanceGraphColors[6],
        pointStyle: 'circle',
        pointRadius: 1,
        cubicInterpolationMode: 'monotone',
      });

      setChartData({
        labels: labels,
        datasets,
      });
    } else
      setChartData({
        labels: [],
        datasets: [],
      });
  }, [data]);
  return (
    <div
      id="heatmap"
      className={styles.heatmap}
      style={{
        width: isSidebarMenuOpen ? 'calc(100% - 1rem)' : '100%',
      }}
    >
      {isLoading === true ? (
        <div className="w-full mt-[4rem] h-full">
          <GraphLoadingComponent />
        </div>
      ) : (
        <Line
          data={chartData}
          options={options}
          className={styles.lineGraph}
          height={40}
        />
      )}
    </div>
  );
};

export default DaypartingLineGraph;
