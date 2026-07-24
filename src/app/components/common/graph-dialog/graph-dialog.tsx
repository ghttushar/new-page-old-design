import { selectIsChatbotOpen } from '@/redux/slices/auth/auth.slice';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import { CornersInIcon } from '@phosphor-icons/react';
import React, { useRef } from 'react';
import { useAppSelector } from 'src/redux/hooks';
import DownloadGraphButton from '../download-button/download-graph-button';
import styles from './graph-dialog.module.scss';

interface IGraphDialogProps {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  label: string;
  chartData: any[];
  featureTitle?: string;
  isDownloadDisabled?: boolean;
  accountType?: string;
}

const GraphDialog: React.FC<IGraphDialogProps> = ({
  children,
  open,
  onClose,
  label,
  chartData,
  featureTitle,
  isDownloadDisabled = false,
  accountType,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const isChatbotOpen = useAppSelector(selectIsChatbotOpen);

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': isChatbotOpen
          ? {
              margin: 0,
              height: '30rem',
              width: '50%',
              overflow: 'hidden',
              marginRight: '28rem',
            }
          : {},
      }}
    >
      <DialogActions>
        <DownloadGraphButton
          chartData={chartData}
          chartImageRef={chartRef}
          filename={label}
          title={featureTitle}
          squareDimension="2.5rem"
          downloadOptionsRequired={true}
          accountType={accountType}
          iconButton={false}
          isDisabled={isDownloadDisabled}
        />

        <IconButton
          className={styles.hideChartButton}
          disableRipple
          onClick={onClose}
          title="Condense"
        >
          <CornersInIcon size={24} color="#77469b" weight="bold" />
        </IconButton>
      </DialogActions>
      <DialogContent sx={{ height: '45rem' }}>
        <div ref={chartRef} className={styles.graph}>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GraphDialog;
