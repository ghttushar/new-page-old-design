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
  checkIsEditDisableByReviewStatus,
  hasReviewIdProp,
} from '@/utils/advertising.utils';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useMemo } from 'react';
import {
  IWalmartAdGroup,
  IWalmartCampaign,
} from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import AdGroupSettingsForm from './adGroup-settings-form/adGroup-settings-form';
import CampaignSettingsForm from './campaign-settings-form/campaign-settings-form';

interface ISettingsTitleProps {
  id: string;
  children?: React.ReactNode;
}

export function SettingsTitle(props: ISettingsTitleProps) {
  const { id, children, ...other } = props;

  return (
    <DialogTitle
      id={id}
      sx={{
        height: '7.5rem',
        m: 0,
        p: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      {...other}
    >
      {children}
    </DialogTitle>
  );
}

interface IAdvertisingSettingsFormProps {
  openDialog: boolean;
  handleCloseDialog: () => void;
  selectedLevel: string;
  selectedCampaign?:
    | IWalmartCampaign
    | ICampaign
    | ISBCampaign
    | ISDCampaign
    | null;
  selectedAdGroup?: IWalmartAdGroup | IAdGroup | ISBAdGroup | ISDAdGroup | null;
}

export default function AdvertisingSettingsForm({
  openDialog,
  handleCloseDialog,
  selectedLevel,
  selectedCampaign,
  selectedAdGroup,
}: IAdvertisingSettingsFormProps) {
  const reviewId: string | null | undefined = (() => {
    if (selectedLevel === 'campaign-level' && selectedCampaign) {
      if (hasReviewIdProp(selectedCampaign)) {
        return selectedCampaign.reviewId;
      }
      return undefined;
    } else if (selectedLevel === 'adgroup-level' && selectedAdGroup) {
      if (hasReviewIdProp(selectedAdGroup)) {
        return selectedAdGroup.reviewId;
      }
      return undefined;
    } else {
      return undefined;
    }
  })();

  const isEditDisabledByReviewStatus: boolean = useMemo(() => {
    if (reviewId) {
      if (selectedLevel === 'campaign-level' && selectedCampaign) {
        return checkIsEditDisableByReviewStatus(selectedCampaign);
      }

      if (selectedLevel === 'adgroup-level' && selectedAdGroup) {
        return checkIsEditDisableByReviewStatus(selectedAdGroup);
      }

      return false;
    }

    return false;
  }, [reviewId, selectedAdGroup, selectedCampaign, selectedLevel]);

  if (
    selectedLevel === 'campaign-level' &&
    selectedCampaign !== null &&
    selectedCampaign !== undefined
  ) {
    return (
      <CampaignSettingsForm
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        selectedCampaign={selectedCampaign}
        isEditDisabledByReviewStatus={isEditDisabledByReviewStatus}
      />
    );
  }

  if (
    selectedLevel === 'adgroup-level' &&
    selectedAdGroup !== null &&
    selectedAdGroup !== undefined
  ) {
    return (
      <AdGroupSettingsForm
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        selectedAdGroup={selectedAdGroup}
        isEditDisabledByReviewStatus={isEditDisabledByReviewStatus}
      />
    );
  }
}
