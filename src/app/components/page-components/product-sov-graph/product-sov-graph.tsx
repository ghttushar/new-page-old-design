import ChartJS, {
  Chart,
  ChartData,
  ChartDataset,
  ChartOptions,
  TooltipItem,
  registerables,
} from 'chart.js/auto';
import React, { useEffect, useRef } from 'react';
import { IProductSOVGraphData } from 'src/interfaces/product-sov.interface';
import { getFormattedCompactNumbers } from 'src/utils';
import { IDropdownItem } from '../../common/dropdown/dropdown';
import styles from '../../common/sov-graph/sov-graph.module.scss';
ChartJS.register(...registerables);

interface ISOVGraphComponentProps {
  graphData: IProductSOVGraphData[];
  formattedRangeFreq: string;
  tooltipRange: IDropdownItem<string>;
}

export default function ProductSovGraph({
  graphData,
  formattedRangeFreq,
  tooltipRange,
}: ISOVGraphComponentProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const appearance: number[] = [];
    const products: string[] = [];

    graphData.forEach((graphItem) => {
      appearance.push(graphItem.appearance);
      products.push(graphItem.asin);
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
            text: 'Appearance',
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
              return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}%`;
            },
          },
        },
      },
    };

    const datasets: ChartDataset[] = [
      {
        label: 'Appearance',
        data: appearance,
        backgroundColor: '#EFD9FF',
        maxBarThickness: 100,
      },
    ];

    const finalData: ChartData = {
      labels: products,
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
