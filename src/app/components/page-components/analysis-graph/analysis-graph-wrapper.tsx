import {
  IAdvertisingFilter,
  IMinMaxDateRange,
  IPerformanceGraphData,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IMultiSelectDropdownItem } from '@/interfaces/dropdown.interfaces';
import React, { useRef } from 'react';
import { IAnalysisFilter } from 'src/interfaces/analysis.interface';
import { getFormattedRangeFreq } from 'src/utils';
import GraphEmptyState from '../../common/graph-empty-state/graph-empty-state';
import GraphLoadingComponent from '../../common/graph-loading-state/graph-loading-state';
import { AnalysisGraph } from './analysis-graph';
import AnalysisGraphHeader from './analysis-graph-header';
import styles from './analysis-graph.module.scss';

interface IAnalysisGraphWrapperProps {
  data: IPerformanceGraphData[];
  metricsFilter: IMultiSelectDropdownItem[];
  filters: IAdvertisingFilter | IAnalysisFilter;
  maxMinDates: IMinMaxDateRange;
  handleHideGraph: () => void;
  isGraphLoading: boolean;
  expandGraph: boolean;
  handleExpandOpen: () => void;
  handleExpandClose: () => void;
  chartLabel: string;
}

export default function AnalysisGraphWrapper({
  data,
  metricsFilter,
  filters,
  maxMinDates,
  handleHideGraph,
  isGraphLoading,
  expandGraph,
  handleExpandOpen,
  handleExpandClose,
  chartLabel,
}: IAnalysisGraphWrapperProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className={styles.Container}>
      {isGraphLoading === true ? (
        <div className="w-full pt-[2rem] ">
          <GraphLoadingComponent yAxisPoints={4} />
        </div>
      ) : data.length > 0 && maxMinDates ? (
        <React.Fragment>
          <AnalysisGraphHeader
            handleHideGraph={handleHideGraph}
            handleExpandOpen={handleExpandOpen}
            chartTitle={chartLabel}
            rawData={data}
            chartRef={chartRef}
          />
          {maxMinDates && (
            <AnalysisGraph
              formattedXAxisText={`${getFormattedRangeFreq(
                filters.frequency,
                filters.range,
                maxMinDates.min_date,
                maxMinDates.max_date
              )}`}
              expandGraph={expandGraph}
              handleExpandClose={handleExpandClose}
              chartLabel={chartLabel}
              rawData={data}
              chartRef={chartRef}
              data={data}
              selectedMetrics={metricsFilter.filter((f) => f.selected)}
            />
          )}
        </React.Fragment>
      ) : (
        <GraphEmptyState hideGraphOnClick={handleHideGraph} />
      )}
    </div>
  );
}
