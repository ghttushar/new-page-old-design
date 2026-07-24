import { MarketplaceEnum } from '@/enums/serp.enums';
import { ADVERTISING_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import { IPerformanceGraphData } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useAppSelector } from '@/redux/hooks';
import { selectAdvertisingHeaderFilters } from '@/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { selectImpactAnalysisData } from '@/redux/slices/impact-analysis/impact-analysis.slice';
import { getNewImpactAnalysisUrl } from '@/utils/analysis.utils';
import IconButton from '@mui/material/IconButton';
import { CornersOutIcon } from '@phosphor-icons/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AltPrimaryButton from '../../common/alt-primary-button/alt-primary-button';
import { AntSwitch } from '../../common/ant-switch/ant-switch';
import DownloadGraphButton from '../../common/download-button/download-graph-button';
import InfoIcon from '../../common/info-icon/info-icon';
import TextButton from '../../common/text-button/text-button';
import styles from './performance-graph.module.scss';

interface IGraphHeaderProps {
  rawData: IPerformanceGraphData[];
  showHideButton: boolean;
  handleHideGraph: () => void;
  handleExpandOpen: () => void;
  isImpactDisabled: boolean;
  isImpactChecked: boolean;
  handleToggleImpact: () => void;
  isViewChangesDisabled: boolean;
  isViewChangesChecked: boolean;
  handleToggleViewChanges: () => void;
  isImpactButtonVisible: boolean;
  chartRef: React.RefObject<HTMLDivElement>;
  chartTitle: string;
  selectedAdvertisingNavTitle: string;
  accountType?: string;
}

export default function GraphHeader({
  rawData,
  showHideButton,
  handleHideGraph,
  handleExpandOpen,
  isImpactDisabled,
  isImpactChecked,
  handleToggleImpact,
  isViewChangesDisabled,
  isViewChangesChecked,
  handleToggleViewChanges,
  isImpactButtonVisible,
  chartRef,
  chartTitle,
  selectedAdvertisingNavTitle,
  accountType,
}: IGraphHeaderProps) {
  const navigate = useNavigate();
  const impactAnalysisData = useAppSelector(selectImpactAnalysisData);
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);

  const handleHideGraphClick = () => {
    handleHideGraph();
  };
  const handleImpactButtonClick = () => {
    navigate(
      `${getNewImpactAnalysisUrl(
        selectedAdvertisingAccount.marketplace ?? MarketplaceEnum.AMAZON,
        advHeaderFilters.adType.value
      )}${impactAnalysisData?.table}`
    );
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerLeft}>
        <div className={styles.content}>
          <div className={styles.contentTitles}>
            <h5>Show Impact</h5>
            <InfoIcon title={`${ADVERTISING_TOOLTIPS.SHOW_IMPACT}`} />
          </div>
          <AntSwitch
            disabled={isImpactDisabled}
            checked={isImpactChecked}
            onChange={handleToggleImpact}
            inputProps={{ 'aria-label': 'ant design' }}
            sx={{ '&:hover': { cursor: 'not-allowed' } }}
          />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitles}>
            <h5>View Changes</h5>
            <InfoIcon title={`${ADVERTISING_TOOLTIPS.VIEW_CHANGES}`} />
          </div>
          <AntSwitch
            disabled={isViewChangesDisabled}
            checked={isViewChangesChecked}
            onChange={handleToggleViewChanges}
            inputProps={{ 'aria-label': 'ant design' }}
            sx={{ '&:hover': { cursor: 'not-allowed' } }}
          />
        </div>
      </div>
      <div className={styles.headerRight}>
        <div className={styles.graphHeaderButton}>
          {isImpactChecked && (
            <AltPrimaryButton
              buttonText={'View on Tables'}
              height={'2.2rem'}
              buttonFunction={handleImpactButtonClick}
              disabled={!isImpactButtonVisible}
              width="auto"
            />
          )}

          {showHideButton === true && (
            <TextButton
              label={'Hide Chart'}
              handleClick={handleHideGraphClick}
              customStyles={{
                fontSize: '1rem',
              }}
            />
          )}

          <DownloadGraphButton
            chartData={rawData}
            chartImageRef={chartRef}
            filename={chartTitle}
            title={selectedAdvertisingNavTitle}
            downloadOptionsRequired={true}
            iconButton={false}
            accountType={accountType}
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
    </div>
  );
}
