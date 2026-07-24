import { useEffect, useState } from 'react';
import InfoIcon from '../info-icon/info-icon';
import { IFormattedStatus } from '../status-box/status-box';
import { amcExecutedStatusBoxStyle } from './amc-executed-status-box-styles';
import styles from './amc-executed-status-box.module.scss';

interface IAMCExecutedStatusBoxProps {
  status: string;
  statusReason?: string;
}

export default function AMCExecutedStatusBox({
  status,
  statusReason,
}: IAMCExecutedStatusBoxProps) {
  const [formattedStatus, setFormattedStatus] =
    useState<IFormattedStatus | null>(null);

  useEffect(() => {
    if (status) {
      let boxColor = '#77469B';
      let textColor = '#ffffff';
      let borderColor = '#77469B';

      if (
        status.toLowerCase() === 'completed' ||
        status.toLowerCase() === 'success' ||
        status.toLowerCase() === 'succeeded'
      ) {
        boxColor = '#77469B';
        borderColor = '#77469B';
      } else if (
        status.toLowerCase() === 'progress' ||
        status.toLowerCase() === 'pending'
      ) {
        boxColor = '#ffffff';
        borderColor = '#77469B';
        textColor = '#77469B';
      } else {
        boxColor = '#CFCFCF';
        textColor = '#666666';
        borderColor = '#CFCFCF';
      }

      setFormattedStatus({
        boxColor,
        textColor,
        borderColor,
      });
    }
  }, [status]);

  return (
    <div style={{ margin: 0, padding: 0 }}>
      {formattedStatus !== null && (
        <div
          style={amcExecutedStatusBoxStyle(
            formattedStatus.boxColor,
            formattedStatus.textColor,
            formattedStatus.borderColor
          )}
        >
          {formattedStatus?.icon}&nbsp;
          <span className={styles.statusText}>{status}</span>
          <span style={{ marginTop: '0.2rem' }}>
            {statusReason && <InfoIcon title={statusReason} />}
          </span>
        </div>
      )}
    </div>
  );
}
