import { generateNItems } from '@/utils';
import React from 'react';
import { getFormattedMetrics } from 'src/utils/advertising.utils';
import { formatValue, getColorForValue } from 'src/utils/day-parting.utils';
import HoverInfoTooltip from '../hover-info-tooltip/hover-info-tooltip';
import SkeletonComponent from '../skeleton/skeleton';
import styles from './grid.module.scss';

interface IGridItemProps {
  xLabels: string[];
  isChatbotOpen: boolean;
  isSidebarMenuOpen: boolean;
  data: number[][];
  buckets: number[];
  metric: string;
  dailyTotalArr: number[];
  hourlyTotalArr: number[];
  isLoading: boolean;
}

export default function TableGrid({
  buckets,
  dailyTotalArr,
  hourlyTotalArr,
  data,
  isChatbotOpen,
  isSidebarMenuOpen,
  metric,
  xLabels,
  isLoading,
}: Readonly<IGridItemProps>) {
  return (
    <table className={styles.tableGrid}>
      {tableHeadComp(xLabels)}
      {tableBodyComp(
        data,
        buckets,
        metric,
        isChatbotOpen,
        isSidebarMenuOpen,
        dailyTotalArr,
        hourlyTotalArr,
        isLoading
      )}
    </table>
  );
}

function tableBodyComp(
  data: number[][],
  buckets: number[],
  metric: string,
  isChatbotOpen: boolean,
  isSidebarMenuOpen: boolean,
  dailyTotalArr: number[],
  hourlyTotalArr: number[],
  isLoading: boolean
) {
  return (
    <React.Fragment>
      <tbody>
        {data.map((row, index) => (
          <tr key={`${row}-${index}`}>
            {row.map((cell, index2) => (
              <td
                key={`${cell}-${index2}`}
                style={{
                  color: getColorForValue(cell, buckets)?.color,
                  backgroundColor: isLoading
                    ? ''
                    : getColorForValue(cell, buckets)?.bgColor,
                  borderRadius: '0.2rem',
                }}
              >
                {isLoading ? (
                  <SkeletonComponent height={'3.2rem'} width={'auto'} />
                ) : (
                  <HoverInfoTooltip
                    title={`${getFormattedMetrics(metric, cell)}`}
                  >
                    <span>{formatValue(cell, metric)}</span>
                  </HoverInfoTooltip>
                )}
              </td>
            ))}
            {isLoading ? (
              <SkeletonComponent height={'3.2rem'} />
            ) : (
              <td className={styles.td}>
                <HoverInfoTooltip
                  title={`${getFormattedMetrics(metric, dailyTotalArr[index])}`}
                >
                  <span>{formatValue(dailyTotalArr[index], metric)}</span>
                </HoverInfoTooltip>
              </td>
            )}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          {generateNItems(24, 0).map((sum, index) => (
            <td
              key={`${sum}-${index}`}
              style={{
                borderRadius: '0.2rem',
                fontWeight: 'bold',
                backgroundColor: isLoading ? '' : '#f5f5f5',
                padding: isLoading
                  ? 0
                  : isChatbotOpen || isSidebarMenuOpen
                  ? '1rem 0.2rem'
                  : '1rem',
              }}
            >
              {isLoading === true ? (
                <SkeletonComponent height={'3.2rem'} />
              ) : (
                <HoverInfoTooltip
                  title={`${getFormattedMetrics(
                    metric,
                    hourlyTotalArr[index]
                  )}`}
                >
                  <span>{formatValue(hourlyTotalArr[index], metric)}</span>
                </HoverInfoTooltip>
              )}
            </td>
          ))}
        </tr>
      </tfoot>
    </React.Fragment>
  );
}

function tableHeadComp(xLabels: string[]) {
  return (
    <thead>
      {xLabels.map((label, index) => (
        <th
          key={index}
          className={styles.xLabel}
          style={{
            fontSize: index === xLabels.length - 1 ? '0.9rem' : '1rem',
            padding: '1rem 0',
            whiteSpace: 'nowrap',

            fontWeight: index === xLabels.length - 1 ? '600' : '400',
          }}
        >
          {label}
        </th>
      ))}
    </thead>
  );
}
