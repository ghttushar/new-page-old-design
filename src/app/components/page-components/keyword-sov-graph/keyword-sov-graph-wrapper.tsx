import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { CornersOutIcon } from '@phosphor-icons/react';
import { useMemo, useRef } from 'react';
import {
  IKeywordSOVFilter,
  IKeywordSOVGraph,
} from 'src/interfaces/keyword-sov.interface';
import { useAppSelector } from 'src/redux/hooks';
import { selectIsSidebarMenuOpen } from 'src/redux/slices/auth/auth.slice';
import { getFileNameDateTime } from 'src/utils';
import DownloadGraphButton from '../../common/download-button/download-graph-button';
import { IDropdownItem } from '../../common/dropdown/dropdown';
import GraphDialog from '../../common/graph-dialog/graph-dialog';
import SkeletonComponent from '../../common/skeleton/skeleton';
import styles from '../../common/sov-graph/sov-graph.module.scss';
import KeywordSovGraph from './keyword-sov-graph';

interface IKeywordSovGraphProps {
  graphData: IKeywordSOVGraph[];
  filters: IKeywordSOVFilter;
  tooltipRange: IDropdownItem<string>;
  isGraphHidden: boolean;
  handleHideGraph: () => void;
  isGraphLoading: boolean;
  expandGraph: boolean;
  handleExpandOpen: () => void;
  handleExpandClose: () => void;
  formattedRangeFreq: string;
}

export default function KeywordSovGraphWrapper({
  graphData,
  filters,
  tooltipRange,
  isGraphHidden,
  handleHideGraph,
  isGraphLoading,
  expandGraph,
  handleExpandOpen,
  handleExpandClose,
  formattedRangeFreq,
}: IKeywordSovGraphProps) {
  const isSidebarMenuOpen = useAppSelector(selectIsSidebarMenuOpen);
  const chartRef = useRef<HTMLDivElement | null>(null);

  const chartTitle = useMemo(
    () => `keyword_sov_chart_${getFileNameDateTime(filters)}`,
    [filters]
  );

  return (
    <div
      className={styles.graphContainer}
      style={{
        display: isGraphHidden ? 'none' : 'flex',
        height: isGraphHidden ? '0' : '50rem',
      }}
    >
      <div className={styles.graphHeader}>
        <div className={styles.graphHeaderTitle}>
          <h5>
            Time range:{' '}
            {isGraphLoading === false ? (
              formattedRangeFreq
            ) : (
              <div>
                <SkeletonComponent
                  animation="wave"
                  variant="text"
                  width="10rem"
                  height={15}
                />
              </div>
            )}
          </h5>
        </div>

        <div className={styles.graphHeaderButton}>
          <Button
            className={styles.hideChartButton}
            disableRipple
            onClick={handleHideGraph}
          >
            Hide Chart
          </Button>

          <DownloadGraphButton
            chartData={graphData}
            chartImageRef={chartRef}
            filename={chartTitle}
            downloadOptionsRequired={true}
            iconButton={false}
            frequency={filters?.frequency}
          />

          <IconButton
            className={styles.hideChartButton}
            disableRipple
            onClick={handleExpandOpen}
            title="Expand"
          >
            <CornersOutIcon size={18} color="#77469b" weight="bold" />
          </IconButton>
        </div>
      </div>

      <span className={styles.horizontalLine}></span>

      <Box
        className={styles.graphBody}
        sx={{
          height: '90%',
          width: isSidebarMenuOpen ? 'calc(100% - 1rem)' : '100%',
        }}
      >
        {isGraphLoading === false ? (
          <div ref={chartRef} className={styles.graphWrapper}>
            <KeywordSovGraph
              graphData={graphData}
              formattedRangeFreq={formattedRangeFreq}
              tooltipRange={tooltipRange}
            />
          </div>
        ) : (
          <Box>
            <SkeletonComponent
              animation="wave"
              variant="rounded"
              width="100%"
              height="38rem"
            />
          </Box>
        )}
      </Box>

      {expandGraph === true && (
        <GraphDialog
          open={expandGraph}
          onClose={handleExpandClose}
          label={chartTitle}
          chartData={graphData}
        >
          <KeywordSovGraph
            graphData={graphData}
            formattedRangeFreq={formattedRangeFreq}
            tooltipRange={tooltipRange}
          />
        </GraphDialog>
      )}
    </div>
  );
}
