import { useAppSelector } from '@/redux/hooks';
import {
  selectIsChatbotOpen,
  selectIsSidebarMenuOpen,
} from '@/redux/slices/auth/auth.slice';
import React, { useMemo } from 'react';
import { getMedians as getMedianBucket } from 'src/utils/day-parting.utils';
import TableGrid from './grid-item';
import styles from './grid.module.scss';

interface IGridProps {
  data: number[][];
  xLabels: string[];
  yLabels: string[];
  metric: string;
  isLoading: boolean;
  hourlyTotalArray: number[];
  dailyTotalArray: number[];
}

const Grid = (props: IGridProps) => {
  const {
    data,
    xLabels,
    yLabels,
    metric,
    isLoading,
    dailyTotalArray,
    hourlyTotalArray,
  } = props;
  const isChatbotOpen = useAppSelector(selectIsChatbotOpen);
  const isSidebarMenuOpen = useAppSelector(selectIsSidebarMenuOpen);

  const buckets = useMemo(() => getMedianBucket(data), [data]);
  return (
    <React.Fragment>
      <div
        className={styles.gridContainer}
        style={{
          width: '100%',
        }}
      >
        <div className={styles.yLabels}>
          {yLabels.map((label, index) => (
            <div
              key={`${label}-${index}`}
              className={styles.yLabel}
              style={{
                fontWeight: index === yLabels.length - 1 ? '600' : '400',
                fontSize: index === yLabels.length - 1 ? '1rem' : '0.9rem',
              }}
            >
              {label}
            </div>
          ))}
        </div>
        <div
          style={{
            overflow: 'auto',
            width: '100%',
          }}
        >
          <TableGrid
            xLabels={xLabels}
            isChatbotOpen={isChatbotOpen}
            isSidebarMenuOpen={isSidebarMenuOpen}
            data={data}
            buckets={buckets}
            metric={metric}
            dailyTotalArr={dailyTotalArray}
            hourlyTotalArr={hourlyTotalArray}
            isLoading={isLoading}
          />
        </div>
      </div>
      <div className={styles.linearGradientContainer}>
        <p>Min</p>
        <div className={styles.gradientBar} />
        <p>Max</p>
      </div>
    </React.Fragment>
  );
};

export default Grid;
