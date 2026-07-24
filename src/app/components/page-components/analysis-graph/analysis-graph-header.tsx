import { IPerformanceGraphData } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { CornersOutIcon } from '@phosphor-icons/react';
import DownloadGraphButton from '../../common/download-button/download-graph-button';
import styles from './analysis-graph-header.module.scss';

interface IAnalysisGraphHeaderProps {
  handleHideGraph: () => void;
  handleExpandOpen: () => void;
  chartTitle: string;
  rawData: IPerformanceGraphData[];
  chartRef: React.RefObject<HTMLDivElement>;
}

export default function AnalysisGraphHeader({
  handleHideGraph,
  handleExpandOpen,
  chartTitle,
  rawData,
  chartRef,
}: IAnalysisGraphHeaderProps) {
  const handleClick = () => handleHideGraph();
  return (
    <div className={styles.headerContainer}>
      <div className={styles.graphHeaderButton}>
        <Button
          className={styles.hideChartButton}
          disableRipple
          onClick={handleClick}
        >
          Hide Chart
        </Button>

        <DownloadGraphButton
          chartData={rawData}
          chartImageRef={chartRef}
          filename={chartTitle}
          downloadOptionsRequired={true}
          iconButton={false}
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
  );
}
