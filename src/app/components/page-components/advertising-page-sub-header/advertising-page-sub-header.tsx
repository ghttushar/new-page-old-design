import { MarketplaceEnum } from '@/enums/serp.enums';
import { DISABLE_TOOLTIP } from '@/enums/tooltip-texts.enums';
import {
  ISBAdGroup,
  ISBCampaign,
} from '@/interfaces/advertising/amazon/sb-advertising.interface';
import {
  ISDAdGroup,
  ISDCampaign,
} from '@/interfaces/advertising/amazon/sd-advertising.interface';
import {
  IAdGroup,
  ICampaign,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  IWalmartSVAdGroup,
  IWalmartSVCampaign,
} from '@/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import { useAppSelector } from '@/redux/hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import accessControlUtils from '@/utils/access-control/access-control.utils';
import { useEffect, useState } from 'react';
import {
  IWalmartAdGroup,
  IWalmartCampaign,
} from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import styles from './advertising-page-sub-header.module.scss';
import AdvertisingSubHeaderEntity from './advertising-sub-header-entity';
import AdvertisingSubHeaderReviewWrapper from './advertising-sub-header-review-wrapper';

export interface IAdvertisingPageSubHeaderProps {
  _selectedLevel: string;
  campaignName?: string;
  status?: string;
  budget?: number;
  dailyBudget?: number;
  totalBudget?: number;
  startDate?: string;
  endDate?: string;
  info?: string;
  adGroupName?: string;
  defaultBid?: number;
  maxBid?: string | number | null;
  minBid?: string | number | null;
  troas?: string | number | null;
  biddingStrategy?: string;
  selectedCampaign?:
    | IWalmartCampaign
    | ICampaign
    | ISBCampaign
    | ISDCampaign
    | IWalmartSVCampaign
    | null;
  selectedAdGroup?:
    | IWalmartAdGroup
    | IAdGroup
    | ISBAdGroup
    | ISDAdGroup
    | IWalmartSVAdGroup
    | null;
  isLoading: boolean;
  isEditSettingsDisabled?: boolean;
  editSettingsDisabledTooltip?: string;
}

const AdvertisingPageSubHeader = (props: IAdvertisingPageSubHeaderProps) => {
  const {
    _selectedLevel,
    campaignName,
    status,
    budget,
    dailyBudget,
    totalBudget,
    startDate,
    endDate,
    info,
    adGroupName,
    defaultBid,
    maxBid,
    minBid,
    troas,
    biddingStrategy,
    selectedCampaign,
    selectedAdGroup,
    isLoading,
  } = props;
  const [walmartReviewCampaign, setWalmartReviewCampaign] = useState<
    | IWalmartCampaign
    | ICampaign
    | ISBCampaign
    | ISDCampaign
    | IWalmartSVCampaign
    | null
  >(null);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const hasAdminManagerAccess = accessControlUtils.hasAdminManagerAccess();

  useEffect(() => {
    if (selectedCampaign) setWalmartReviewCampaign(selectedCampaign);
  }, [selectedCampaign]);

  return (
    <div className={styles.subHeaderContainer}>
      <AdvertisingSubHeaderEntity
        _selectedLevel={_selectedLevel}
        campaignName={campaignName}
        status={status}
        budget={budget}
        dailyBudget={dailyBudget}
        totalBudget={totalBudget}
        startDate={startDate}
        endDate={endDate}
        info={info}
        adGroupName={adGroupName}
        defaultBid={defaultBid}
        maxBid={maxBid}
        minBid={minBid}
        troas={troas}
        biddingStrategy={biddingStrategy}
        selectedCampaign={selectedCampaign}
        selectedAdGroup={selectedAdGroup}
        isLoading={isLoading}
        isEditSettingsDisabled={!hasAdminManagerAccess}
        editSettingsDisabledTooltip={
          !hasAdminManagerAccess ? DISABLE_TOOLTIP.ADMIN_MANAGER_ACCESS : ''
        }
      />

      {_selectedLevel === 'campaign-level' &&
        walmartReviewCampaign &&
        advertisingAccount.marketplace === MarketplaceEnum.WALMART && (
          <AdvertisingSubHeaderReviewWrapper
            selectedCampaign={
              walmartReviewCampaign as IWalmartCampaign | IWalmartSVCampaign
            }
            isEditSettingsDisabled={!hasAdminManagerAccess}
            editSettingsDisabledTooltip={
              !hasAdminManagerAccess ? DISABLE_TOOLTIP.ADMIN_MANAGER_ACCESS : ''
            }
          />
        )}
    </div>
  );
};

export default AdvertisingPageSubHeader;
