import { Frequency } from '@/enums/serp.enums';
import {
  IAdvertisingFilter,
  IMinMaxDateRange,
  IPerformanceGraphData,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useAppSelector } from '@/redux/hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import { ChartData, ChartDataset } from 'chart.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { performanceGraphColors } from 'src/constants';
import { IPerformanceMetricsFilters } from 'src/redux/slices/advertising/advertising-filter.slice';
import { convertGraphLabelByFrequency, getFormattedRangeFreq } from 'src/utils';
import { getMetricsGraphData } from 'src/utils/advertising.utils';
import GraphEmptyState from '../../common/graph-empty-state/graph-empty-state';
import SkeletonComponent from '../../common/skeleton/skeleton';
import GraphHeader from './graph-header';
import { PerformanceGraph } from './performance-graph';
import styles from './performance-graph.module.scss';

interface IPerformanceGraphWrapperProps {
  data: IPerformanceGraphData[];
  filters: IAdvertisingFilter;
  maxMinDates: IMinMaxDateRange | null;
  handleHideGraph?: () => void;
  isGraphLoading: boolean;
  expandGraph: boolean;
  handleExpandOpen: () => void;
  handleExpandClose: () => void;
  chartTitle: string;
  impactLoading?: boolean;
  isImpactDisabled: boolean;
  isImpactChecked: boolean;
  handleToggleImpact: () => void;
  isViewChangesDisabled: boolean;
  isViewChangesChecked: boolean;
  handleToggleViewChanges: () => void;
  isShowImpactOn: boolean;
  performanceMetrics: IPerformanceMetricsFilters;
  handleTableEmptyReset: () => void;
  selectedAdvertisingNavTitle: string;
}

export default function PerformanceGraphWrapper({
  data,
  filters,
  maxMinDates,
  handleHideGraph,
  isGraphLoading,
  expandGraph,
  handleExpandOpen,
  handleExpandClose,
  chartTitle,
  impactLoading,
  isImpactDisabled,
  isImpactChecked,
  handleToggleImpact,
  isViewChangesDisabled,
  isViewChangesChecked,
  handleToggleViewChanges,
  isShowImpactOn,
  performanceMetrics,
  handleTableEmptyReset,
  selectedAdvertisingNavTitle,
}: IPerformanceGraphWrapperProps) {
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
  const [formattedXAxisText, setFormattedXAxisText] = useState<string>('');
  const [isImpactButtonVisible, setIsImpactButtonVisible] =
    useState<boolean>(false);

  const chartRef = useRef<HTMLDivElement | null>(null);
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);

  const selectedAdvertisingAccountType = useMemo(
    () => localStorageUtils.getSelectedAdvertisingAccount()?.accountType,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedAdvertisingAccount]
  );

  const showHideButton = useMemo(() => {
    return localStorageUtils.getHideGraph() === false;
  }, []);

  const handleImpactButtonShow = () => setIsImpactButtonVisible(true);
  const handleImpactButtonHide = () => setIsImpactButtonVisible(false);
  const handleHideGraphAction = () => {
    if (showHideButton === true && handleHideGraph) {
      handleHideGraph();
    } else {
      return;
    }
  };

  useEffect(() => {
    if (data.length) {
      const labels: any[] = [];
      data.forEach((row) => {
        if (labels.includes(row.label)) return;
        labels.push(row.label);
      });

      const datasets: ChartDataset<'line'>[] = [];

      const dataMetrics1 = getMetricsGraphData(
        data,
        performanceMetrics.metrics1,
        labels
      );
      const dataMetrics2 = getMetricsGraphData(
        data,
        performanceMetrics.metrics2,
        labels
      );
      const dataMetrics3 = getMetricsGraphData(
        data,
        performanceMetrics.metrics3,
        labels
      );
      const dataMetrics4 = getMetricsGraphData(
        data,
        performanceMetrics.metrics4,
        labels
      );

      datasets.push({
        label: performanceMetrics.metrics1.label,
        data: dataMetrics1,
        yAxisID: 'y',
        borderWidth: 2,
        borderColor: performanceGraphColors[0],
        backgroundColor: performanceGraphColors[0],
        pointStyle: 'circle',
        pointRadius: isShowImpactOn ? 2 : 1,
        cubicInterpolationMode: 'monotone',
      });
      datasets.push({
        label: performanceMetrics.metrics2.label,
        data: dataMetrics2,
        yAxisID: 'y1',
        borderWidth: 2,
        borderColor: performanceGraphColors[1],
        backgroundColor: performanceGraphColors[1],
        pointStyle: 'circle',
        pointRadius: isShowImpactOn ? 2 : 1,
        cubicInterpolationMode: 'monotone',
      });
      datasets.push({
        label: performanceMetrics.metrics3.label,
        data: dataMetrics3,
        yAxisID: 'y2',
        borderWidth: 2,
        borderColor: performanceGraphColors[2],
        backgroundColor: performanceGraphColors[2],
        pointStyle: 'circle',
        pointRadius: isShowImpactOn ? 2 : 1,
        cubicInterpolationMode: 'monotone',
      });
      datasets.push({
        label: performanceMetrics.metrics4.label,
        data: dataMetrics4,
        yAxisID: 'y3',
        borderWidth: 2,
        borderColor: performanceGraphColors[3],
        backgroundColor: performanceGraphColors[3],
        pointStyle: 'circle',
        pointRadius: isShowImpactOn ? 2 : 1,
        cubicInterpolationMode: 'monotone',
      });

      setChartData({
        labels: labels.map((label) =>
          convertGraphLabelByFrequency(
            label,
            filters.frequency ?? Frequency.DAILY
          )
        ),
        datasets,
      });

      setFormattedXAxisText(
        maxMinDates
          ? getFormattedRangeFreq(
              filters.frequency,
              filters.range,
              maxMinDates.min_date,
              maxMinDates.max_date
            )
          : ''
      );
    }
  }, [data, performanceMetrics, maxMinDates, isShowImpactOn, filters]);

  useEffect(() => {
    if (!isShowImpactOn) {
      handleImpactButtonHide();
    }
  }, [isShowImpactOn]);

  return (
    <div className={styles.Container}>
      {isGraphLoading === true || impactLoading === true ? (
        <div className={styles.performanceSkeletonContainer}>
          <SkeletonComponent
            animation="wave"
            variant="rounded"
            width="100%"
            height="25rem"
          />
        </div>
      ) : data &&
        data.length > 0 &&
        maxMinDates &&
        Object.keys(maxMinDates).length > 0 ? (
        <React.Fragment>
          <GraphHeader
            rawData={data}
            showHideButton={showHideButton}
            handleHideGraph={handleHideGraphAction}
            handleExpandOpen={handleExpandOpen}
            isImpactDisabled={isImpactDisabled}
            isImpactChecked={isImpactChecked}
            handleToggleImpact={handleToggleImpact}
            isViewChangesDisabled={isViewChangesDisabled}
            isViewChangesChecked={isViewChangesChecked}
            handleToggleViewChanges={handleToggleViewChanges}
            isImpactButtonVisible={isImpactButtonVisible}
            chartRef={chartRef}
            chartTitle={chartTitle}
            selectedAdvertisingNavTitle={selectedAdvertisingNavTitle}
            accountType={selectedAdvertisingAccountType}
          />

          <PerformanceGraph
            rawData={data}
            chartData={chartData}
            formattedXAxisText={formattedXAxisText}
            expandGraph={expandGraph}
            handleExpandClose={handleExpandClose}
            chartTitle={chartTitle}
            handleImpactButtonShow={handleImpactButtonShow}
            handleImpactButtonHide={handleImpactButtonHide}
            isShowImpactOn={isShowImpactOn}
            performanceMetrics={performanceMetrics}
            handleTableEmptyReset={handleTableEmptyReset}
            chartRef={chartRef}
            selectedAdvertisingNavTitle={selectedAdvertisingNavTitle}
            accountType={selectedAdvertisingAccountType}
          />
        </React.Fragment>
      ) : (
        <GraphEmptyState hideGraphOnClick={handleHideGraphAction} />
      )}
    </div>
  );
}
