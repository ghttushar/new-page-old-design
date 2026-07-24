import { ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import styles from './weekly-review-trend.module.scss';

export const options: ChartOptions<'bar'> = {
  responsive: true,
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
    },
  },
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  scales: {
    x: {
      type: 'category',
      grid: {
        display: false,
      },
      offset: true,
    },
    y: {
      ticks: {
        stepSize: 40,
      },
      grid: {
        display: false,
      },
    },
  },
};

const labels = [
  'Week 1',
  'Week 2',
  'Week 3',
  'Week 4',
  'Week 5',
  'Week 6',
  'Week 7',
];

export const data = {
  labels,
  datasets: [
    {
      label: 'Positive Reviews',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: '#D3ABF1',
      barPercentage: 0.8,
      categoryPercentage: 0.6,
    },
    {
      label: 'Negative Reviews',
      data: [28, 48, 40, 19, 86, 27, 54],
      backgroundColor: '#FFB7BC',
      barPercentage: 0.8,
      categoryPercentage: 0.6,
    },
    {
      label: 'Neutral Reviews',
      data: [45, 25, 16, 36, 67, 18, 76],
      backgroundColor: '#E2E2E2',
      barPercentage: 0.8,
      categoryPercentage: 0.6,
    },
  ],
};

export default function ReviewTrendGraph() {
  return (
    <Bar
      options={options}
      data={data}
      height={100}
      className={styles.reviewGraph}
    />
  );
}
