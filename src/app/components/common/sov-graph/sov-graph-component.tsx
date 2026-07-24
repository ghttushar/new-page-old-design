import ChartJS, {
  Chart,
  ChartData,
  ChartDataset,
  ChartOptions,
  TooltipItem,
  registerables,
} from 'chart.js/auto';
import React, { useEffect, useRef } from 'react';
import { OTHER_BRANDS_LABEL } from 'src/constants/sov.filter.constants';
import {
  IBrandLevelSovChartData,
  IBrandLevelSovChecks,
  ISovChartDataMapping,
} from 'src/interfaces/serp.interface';
import { formatNum, getColor, getFormattedCompactNumbers } from 'src/utils';
import serpUtils from 'src/utils/serp.utils';
import styles from './sov-graph.module.scss';
ChartJS.register(...registerables);

interface IOtherSOVChartData {
  sponsored: number[];
  organic: number[];
  totalSov: number[];
}

interface ISOVGraphComponentProps {
  labels: string[];
  topBrandsChartData: IBrandLevelSovChartData[];
  comparedBrandData: IBrandLevelSovChartData | null;
  chartDataMapping: ISovChartDataMapping;
  formattedRangeFreq: string;
  isSovChecked: IBrandLevelSovChecks;
  sponsoredSOVLineColor: string;
  organicSOVLineColor: string;
  totalSOVLineColor: string;
}

const SOVGraph: React.FC<ISOVGraphComponentProps> = ({
  labels,
  topBrandsChartData,
  chartDataMapping,
  formattedRangeFreq,
  comparedBrandData,
  isSovChecked,
  sponsoredSOVLineColor,
  organicSOVLineColor,
  totalSOVLineColor,
}) => {
  const chartDataMappingRef = useRef(chartDataMapping);
  const blackColor = '#000000';
  const lineChartPointRadius = 2;
  const lineChartBorderWidth = 2.5;

  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
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
            color: blackColor,
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
            color: blackColor,
          },
          ticks: {
            stepSize: 20,
            count: 5,
            callback(tickValue) {
              return getFormattedCompactNumbers(Number(tickValue));
            },
          },
          grid: {
            display: false,
          },
          beginAtZero: true,
        },
        y1: {
          display: true,
          position: 'right',
          title: {
            display: true,
            text: `SOV (${comparedBrandData?.brand || 'Compared Brand'})`,
            color: blackColor,
          },
          ticks: {
            stepSize: 2,
            count: 5,
            callback(tickValue) {
              return getFormattedCompactNumbers(Number(tickValue));
            },
          },
          grid: {
            display: false,
          },
          beginAtZero: true,
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
          titleColor: blackColor,
          bodyColor: blackColor,
          bodySpacing: 5,
          cornerRadius: 5,
          padding: 10,
          callbacks: {
            title: (tooltipItems: any) => {
              return `SOV Data (${serpUtils.getFrequencyForTooltip(
                formattedRangeFreq.split('(')[1].split(')')[0]
              )}${tooltipItems[0].label})`;
            },
            label: (tooltipItem: TooltipItem<'bar'>) => {
              return `${tooltipItem.dataset.label}`;
            },
            afterLabel: (tooltipItem: TooltipItem<'bar'>) => {
              const brand = tooltipItem.dataset.label;
              const label = tooltipItem.label;
              if (!brand) return;
              const sovData = chartDataMappingRef.current[brand][label];

              const tooltipData = [];
              if (
                sovData?.organic_sov !== undefined ||
                sovData?.organic_sov !== null
              )
                tooltipData.push(
                  `Organic SOV: ${formatNum(sovData?.organic_sov, false)}`
                );
              if (
                sovData?.sponsored_sov !== undefined ||
                sovData?.sponsored_sov !== null
              )
                tooltipData.push(
                  `Sponsored SOV: ${formatNum(sovData?.sponsored_sov, false)}`
                );
              if (
                sovData?.total_sov !== undefined ||
                sovData?.total_sov !== null
              )
                tooltipData.push(
                  `Total SOV: ${formatNum(sovData?.total_sov, false)}`
                );
              if (
                sovData?.product_count !== undefined ||
                sovData?.product_count !== null
              )
                tooltipData.push(
                  `Product Count: ${formatNum(sovData?.product_count, false)}`
                );

              return tooltipData;
            },
          },
        },
      },
    };

    let datasets: ChartDataset[] = [];

    if (comparedBrandData) {
      if (isSovChecked.organic_sov) {
        datasets.push({
          type: 'line',
          label: comparedBrandData.brand,
          data: comparedBrandData.labelWiseOrganicSovData,
          backgroundColor: organicSOVLineColor,
          borderColor: organicSOVLineColor,
          yAxisID: 'y1',
          cubicInterpolationMode: 'monotone',
          pointRadius: lineChartPointRadius,
          borderWidth: lineChartBorderWidth,
        });
      }

      if (isSovChecked.sponsored_sov) {
        datasets.push({
          type: 'line',
          label: comparedBrandData.brand,
          data: comparedBrandData.labelWiseSponsoredSovData,
          backgroundColor: sponsoredSOVLineColor,
          borderColor: sponsoredSOVLineColor,
          yAxisID: 'y1',
          cubicInterpolationMode: 'monotone',
          pointRadius: lineChartPointRadius,
          borderWidth: lineChartBorderWidth,
        });
      }

      if (isSovChecked.total_sov) {
        datasets.push({
          type: 'line',
          label: comparedBrandData.brand,
          data: comparedBrandData.labelWiseTotalSovData,
          backgroundColor: totalSOVLineColor,
          borderColor: totalSOVLineColor,
          yAxisID: 'y1',
          cubicInterpolationMode: 'monotone',
          pointRadius: lineChartPointRadius,
          borderWidth: lineChartBorderWidth,
        });
      }
    }

    let currentBrandIndex = 0;
    const topBrandsSovSum: IOtherSOVChartData = {
      sponsored: labels.map(() => 0),
      organic: labels.map(() => 0),
      totalSov: labels.map(() => 0),
    };

    const calculateSov = (sovSum: number) => {
      const value = 100 - sovSum - 0.01;
      if (value < 0) return 0;
      return value;
    };

    const brandDatasets = topBrandsChartData.map((item) => {
      item.labelWiseTotalSovData.forEach((totalSov, index) => {
        topBrandsSovSum.totalSov[index] += totalSov;
      });
      item.labelWiseSponsoredSovData.forEach((sponsoredSov, index) => {
        topBrandsSovSum.sponsored[index] += sponsoredSov;
      });
      item.labelWiseOrganicSovData.forEach((organicSov, index) => {
        topBrandsSovSum.organic[index] += organicSov;
      });
      return {
        label: item.brand,
        data: item.labelWiseTotalSovData,
        backgroundColor: getColor(currentBrandIndex++),
      };
    });

    const chartDataMappingWithOthers: ISovChartDataMapping = chartDataMapping;

    labels.forEach((label, index) => {
      const brand = OTHER_BRANDS_LABEL;
      if (!chartDataMappingWithOthers[brand])
        chartDataMappingWithOthers[brand] = {};

      chartDataMappingWithOthers[brand][label] = {
        label: label,
        brand: OTHER_BRANDS_LABEL,
        organic_sov: calculateSov(topBrandsSovSum.organic[index]),
        sponsored_sov: calculateSov(topBrandsSovSum.sponsored[index]),
        total_sov: calculateSov(topBrandsSovSum.totalSov[index]),
        appearance: '',
        product_count: '',
      };
    });

    chartDataMappingRef.current = chartDataMappingWithOthers;

    brandDatasets.push({
      label: OTHER_BRANDS_LABEL,
      data: topBrandsSovSum.totalSov.map(calculateSov),
      backgroundColor: getColor(currentBrandIndex),
    });
    datasets = datasets.concat(brandDatasets);

    const otherIndex = datasets.findIndex(
      (dataset) => dataset.label === OTHER_BRANDS_LABEL
    );
    if (otherIndex !== -1) {
      const otherDataset = datasets.splice(otherIndex, 1)[0];
      datasets.push(otherDataset);
    }
    const finalData: ChartData = {
      labels,
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
  }, [
    comparedBrandData,
    formattedRangeFreq,
    labels,
    chartDataMapping,
    topBrandsChartData,
    isSovChecked,
    organicSOVLineColor,
    sponsoredSOVLineColor,
    totalSOVLineColor,
  ]);

  return (
    <React.Fragment>
      <div
        id="legend-container"
        className="legend-container"
        data-test="legend-container"
      ></div>
      <canvas
        ref={chartRef}
        className={styles.barGraph}
        data-test="graph-canvas"
      ></canvas>
      <div id="custom-tooltip-container" />
    </React.Fragment>
  );
};

export default SOVGraph;
