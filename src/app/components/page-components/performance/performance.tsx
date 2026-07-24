import {
  IAdvertisingFilter,
  IPerformanceMetrics,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import React, { useEffect } from 'react';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { performanceGraphColors } from 'src/constants';
import {
  IPerformanceMetricsFilters,
  IPerformanceMetricsOptions,
  TPerformanceMetricsKey,
} from 'src/redux/slices/advertising/advertising-filter.slice';
import MetricsDropdown from '../../common/metrics-dropdown/metrics-dropdown';
import SkeletonComponent from '../../common/skeleton/skeleton';
import styles from './performance.module.scss';

interface IPerformanceBoxProps {
  metricsData: IPerformanceMetrics | null;
  filters: IAdvertisingFilter;
  isMetricsLoading: boolean;
  performanceMetrics: IPerformanceMetricsFilters;
  performanceMetricsOptions: IPerformanceMetricsOptions;
  handlePerformanceMetricsChange: (
    value: IDropdownItem<string>,
    key: TPerformanceMetricsKey
  ) => void;
  handleInitialPerformanceMetricsChange: () => void;
}

export default function PerformanceBox({
  metricsData,
  filters,
  isMetricsLoading,
  performanceMetrics,
  performanceMetricsOptions,
  handlePerformanceMetricsChange,
  handleInitialPerformanceMetricsChange,
}: IPerformanceBoxProps) {
  useEffect(() => {
    handleInitialPerformanceMetricsChange();
  }, []);

  return (
    <div
      className={styles.resultContainer}
      style={{
        padding: isMetricsLoading ? '0.5rem 0' : '0',
      }}
    >
      {isMetricsLoading ? (
        <React.Fragment>
          <SkeletonComponent
            animation="wave"
            variant="rounded"
            width={160}
            height={40}
          />
          <span className={styles.vl}></span>
          <SkeletonComponent
            animation="wave"
            variant="rounded"
            width={160}
            height={40}
          />
          <span className={styles.vl}></span>
          <SkeletonComponent
            animation="wave"
            variant="rounded"
            width={160}
            height={40}
          />
          <span className={styles.vl}></span>
          <SkeletonComponent
            animation="wave"
            variant="rounded"
            width={160}
            height={40}
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <MetricsDropdown
            isBorderColorRequired={true}
            color={performanceGraphColors[0]}
            onSelect={(value) =>
              handlePerformanceMetricsChange(value, 'metrics1')
            }
            selected={performanceMetrics.metrics1}
            options={performanceMetricsOptions.metrics1}
            metricsData={metricsData}
            filters={filters}
            width={'16rem'}
            fontWeight={'500'}
          />
          <span className={styles.vl}></span>
          <MetricsDropdown
            isBorderColorRequired={true}
            color={performanceGraphColors[1]}
            onSelect={(value) =>
              handlePerformanceMetricsChange(value, 'metrics2')
            }
            selected={performanceMetrics.metrics2}
            options={performanceMetricsOptions.metrics2}
            metricsData={metricsData}
            filters={filters}
            width={'16rem'}
            fontWeight={'500'}
          />
          <span className={styles.vl}></span>
          <MetricsDropdown
            isBorderColorRequired={true}
            color={performanceGraphColors[2]}
            onSelect={(value) =>
              handlePerformanceMetricsChange(value, 'metrics3')
            }
            selected={performanceMetrics.metrics3}
            options={performanceMetricsOptions.metrics3}
            metricsData={metricsData}
            filters={filters}
            width={'16rem'}
            fontWeight={'500'}
          />
          <span className={styles.vl}></span>
          <MetricsDropdown
            isBorderColorRequired={true}
            color={performanceGraphColors[3]}
            onSelect={(value) =>
              handlePerformanceMetricsChange(value, 'metrics4')
            }
            selected={performanceMetrics.metrics4}
            options={performanceMetricsOptions.metrics4}
            metricsData={metricsData}
            filters={filters}
            width={'16rem'}
            fontWeight={'500'}
          />
        </React.Fragment>
      )}
    </div>
  );
}
