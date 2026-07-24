import { MarketplaceEnum } from '@/enums/serp.enums';
import { useAppSelector } from '@/redux/hooks';
import { selectAdvertisingHeaderFilters } from '@/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { useMemo, useState } from 'react';
import CustomAntSwitchTooltip from 'src/app/components/common/ant-switch/ant-switch';
import {
  AdType,
  AdTypeShort,
  CampaignStateEnum,
} from 'src/enums/advertising.enums';
import { TooltipPlacement } from 'src/enums/tooltip-texts.enums';
import { WalmartCampaignStatusEnum } from 'src/enums/walmart.enums';

interface IEditAccessCreateKeywordStatusProps {
  id: string | number;
  status: string;
  updateFunction: (
    id: string | number,
    customBid: number | typeof NaN | undefined,
    status: string | undefined
  ) => void;
}

export default function EditAccessCreateKeywordStatus({
  id,
  status,
  updateFunction,
}: IEditAccessCreateKeywordStatusProps) {
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);

  const adType = useMemo(
    () => advHeaderFilters.adType.value,
    [advHeaderFilters.adType.value]
  );

  const isDisabled = useMemo(
    () =>
      advertisingAccount.marketplace === MarketplaceEnum.AMAZON &&
      (adType === AdType.SPONSORED_BRANDS ||
        adType === AdTypeShort.SPONSORED_BRANDS),
    [advertisingAccount.marketplace, adType]
  );

  const isChecked =
    status?.toUpperCase() === CampaignStateEnum.ENABLED ||
    status === WalmartCampaignStatusEnum.LIVE;
  const isArchived =
    status?.toUpperCase() === WalmartCampaignStatusEnum.COMPLETED;

  const [isStatusChecked, setIsStatusChecked] = useState<boolean>(isChecked);

  const handleStatusChange = () => {
    setIsStatusChecked(!isStatusChecked);
    const formattedStatus = !isStatusChecked
      ? CampaignStateEnum.ENABLED
      : CampaignStateEnum.PAUSED;

    updateFunction(id, undefined, formattedStatus);
  };

  return (
    <CustomAntSwitchTooltip
      isSwitchDisabled={isArchived || isDisabled}
      isTooltipDisabled={!isDisabled}
      isChecked={isStatusChecked}
      onChange={handleStatusChange}
      className={
        status?.toUpperCase() === CampaignStateEnum.PAUSED ? 'paused' : ''
      }
      tooltipTitle={
        isDisabled
          ? 'Not allowed to edit'
          : isStatusChecked
          ? CampaignStateEnum.ENABLED
          : CampaignStateEnum.PAUSED
      }
      tooltipPosition={TooltipPlacement.Right}
    />
  );
}
