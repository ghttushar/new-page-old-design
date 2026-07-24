import React, { useState } from 'react';
import { IJobCampaign } from 'src/interfaces/day-parting.interfaces';
import HoverDataDialog from '../../common/data-dialog/data-dialog';
import TextButton from '../../common/text-button/text-button';

interface ICampaignsList {
  campaigns: IJobCampaign[];
}

export default function CampaignsList({ campaigns }: ICampaignsList) {
  const [open, setOpen] = useState(false);
  const label = `${campaigns.length} ${
    campaigns.length === 1 ? 'Campaign' : 'Campaigns'
  }`;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <React.Fragment>
      <TextButton label={label} handleClick={handleOpen} isVisible={true} />
      <HoverDataDialog
        open={open}
        onClose={handleClose}
        campaignData={campaigns}
      />
    </React.Fragment>
  );
}
