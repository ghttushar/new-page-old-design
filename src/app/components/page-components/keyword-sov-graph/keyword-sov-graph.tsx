import ChartJS, {
  Chart,
  ChartData,
  ChartDataset,
  ChartOptions,
  TooltipItem,
  registerables,
} from 'chart.js/auto';
import React, { useEffect, useRef } from 'react';
import { IKeywordSOVGraph } from 'src/interfaces/keyword-sov.interface';
import { formatNum, getFormattedCompactNumbers } from 'src/utils';
import { IDropdownItem } from '../../common/dropdown/dropdown';
import styles from '../../common/sov-graph/sov-graph.module.scss';
ChartJS.register(...registerables);

interface ISOVGraphComponentProps {
  graphData: IKeywordSOVGraph[];
  formattedRangeFreq: string;
  tooltipRange: IDropdownItem<string>;
}

export default function KeywordSovGraph({
  graphData,
  formattedRangeFreq,
  tooltipRange,
}: ISOVGraphComponentProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const organicSov: number[] = [];
    const sponsoredSov: number[] = [];
    const keywords: string[] = [];

    graphData.forEach((graphItem) => {
      organicSov.push(graphItem.organicSov);
      sponsoredSov.push(graphItem.sponsoredSov);
      keywords.push(graphItem.keyword);
    });
    if (!chartRef.current) return;

    const options: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          display: true,
          title: {
            display: true,
            text: formattedRangeFreq,
            color: '#000000',
          },
          grid: {
            display: false,
          },
        },
        y: {
          stacked: true,
          display: true,
          title: {
            display: true,
            text: 'SOV',
            color: '#000000',
          },
          ticks: {
            stepSize: 10,
            callback(tickValue) {
              return getFormattedCompactNumbers(Number(tickValue));
            },
          },
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
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
          mode: 'nearest',
          intersect: false,
          backgroundColor: 'rgba(245, 245, 235, 0.95)',
          titleColor: '#000000',
          bodyColor: '#000000',
          bodySpacing: 5,
          cornerRadius: 5,
          padding: 10,
          titleAlign: 'center',
          callbacks: {
            title: (tooltipItems: any) => {
              return `${tooltipItems[0].label} (${tooltipRange.label})`;
            },
            label: (tooltipItem: TooltipItem<'bar'>) => {
              return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}`;
            },
            afterLabel: (tooltipItem: TooltipItem<'bar'>) => {
              const filteredData = graphData.filter((item) => {
                return item.keyword === tooltipItem.label;
              });

              if (filteredData.length === 0) {
                return [];
              }

              const item = filteredData[0];

              if (tooltipItem.dataset.label === 'Sponsored SOV') {
                return [
                  `Organic SOV: ${formatNum(item.organicSov, false)}`,
                  `Total SOV: ${formatNum(item.totalSov, false)}`,
                ];
              } else if (tooltipItem.dataset.label === 'Organic SOV') {
                return [
                  `Sponsored SOV: ${formatNum(item.sponsoredSov, false)}`,
                  `Total SOV: ${formatNum(item.totalSov, false)}`,
                ];
              }
            },
          },
        },
      },
    };

    const datasets: ChartDataset[] = [
      {
        label: 'Sponsored SOV',
        data: sponsoredSov,
        backgroundColor: '#77469B',
        maxBarThickness: 100,
      },
      {
        label: 'Organic SOV',
        data: organicSov,
        backgroundColor: '#EFD9FF',
        maxBarThickness: 100,
      },
    ];

    const finalData: ChartData = {
      labels: keywords,
      datasets,
    };
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    const chartInstance = new Chart(ctx, {
      type: 'bar',
      data: finalData,
      options: options,
    });

    return () => {
      chartInstance.destroy();
    };
  }, [graphData, formattedRangeFreq, tooltipRange.label]);

  return (
    <React.Fragment>
      <div id="legend-container" className="legend-container"></div>
      <canvas ref={chartRef} className={styles.barGraph}></canvas>
      <div id="custom-tooltip-container" />
    </React.Fragment>
  );
}
