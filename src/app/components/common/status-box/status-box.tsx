import { CampaignStateEnum } from '@/enums/advertising.enums';
import { WalmartCampaignStatusEnum } from '@/enums/walmart.enums';
import { useAppSelector } from '@/redux/hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { getStatusBoxStatusByLevel } from '@/utils/advertising.utils';
import {
  ArchiveIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from '@phosphor-icons/react';
import { useEffect, useMemo, useState } from 'react';
import { statusBoxStyle } from './status-box-styles';

export interface IFormattedStatus {
  boxColor: string;
  textColor: string;
  borderColor?: string;
  icon?: JSX.Element;
}

interface IStatusBoxProps {
  status: string;
  selectedLevel: string;
}

export default function StatusBox({ status, selectedLevel }: IStatusBoxProps) {
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const [formattedStatus, setFormattedStatus] =
    useState<IFormattedStatus | null>(null);

  const marketplace = useMemo(
    () => advertisingAccount.marketplace,
    [advertisingAccount]
  );

  useEffect(() => {
    if (status) {
      let boxColor = '#77469B';
      let textColor = '#ffffff';
      let icon = <PlayCircleIcon size={14} color="#ffffff" weight="fill" />;

      if (
        status?.toLowerCase() === 'active' ||
        status?.toLowerCase() ===
          WalmartCampaignStatusEnum.LIVE.toLowerCase() ||
        status?.toLowerCase() ===
          WalmartCampaignStatusEnum.ENABLED.toLowerCase()
      ) {
        boxColor = '#77469B';
      } else if (
        status?.toLowerCase() ===
          WalmartCampaignStatusEnum.PAUSED.toLowerCase() ||
        status?.toLowerCase() ===
          WalmartCampaignStatusEnum.SCHEDULED.toLowerCase() ||
        status?.toLowerCase() ===
          WalmartCampaignStatusEnum.RESCHEDULED.toLowerCase() ||
        status?.toLowerCase() ===
          WalmartCampaignStatusEnum.PROPOSAL.toLowerCase() ||
        status?.toLowerCase() ===
          WalmartCampaignStatusEnum.DISABLED.toLowerCase()
      ) {
        boxColor = '#F26E77';
        icon = <PauseCircleIcon size={14} color="#ffffff" weight="fill" />;
      } else if (
        status?.toLowerCase() === CampaignStateEnum.ARCHIVED.toLowerCase() ||
        status?.toLowerCase() ===
          WalmartCampaignStatusEnum.COMPLETED.toLowerCase() ||
        status?.toLowerCase() === WalmartCampaignStatusEnum.ENDED.toLowerCase()
      ) {
        boxColor = '#F3F3F3';
        textColor = '#7D7D7D';
        icon = <ArchiveIcon size={14} color="#7D7D7D" weight="fill" />;
      }

      setFormattedStatus({
        boxColor,
        textColor,
        icon,
      });
    }
  }, [status]);

  return (
    <div style={{ margin: 0, padding: 0 }}>
      {formattedStatus !== null && (
        <div
          style={statusBoxStyle(
            formattedStatus.boxColor,
            formattedStatus.textColor
          )}
        >
          {formattedStatus.icon}&nbsp;
          {getStatusBoxStatusByLevel(status, selectedLevel, marketplace ?? '')}
        </div>
      )}
    </div>
  );
}
