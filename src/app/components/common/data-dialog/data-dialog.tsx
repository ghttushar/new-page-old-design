import { PAGE_SIZE_OPTIONS } from '@/constants';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import { PaginationState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { IJobCampaign } from 'src/interfaces/day-parting.interfaces';
import { historyCampaignsColumn } from '../../pages/day-parting-wrapper/history-page/history-page-columns';
import CustomTableWrapper from '../../shared/custom-table-wrapper/custom-table-wrapper';

export interface IHoverDataDialogProps {
  open: boolean;
  onClose: (value: string) => void;
  campaignData: IJobCampaign[];
}

export default function HoverDataDialog(props: IHoverDataDialogProps) {
  const { onClose, open, campaignData } = props;
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });

  const isLoading = useMemo(
    () => open && campaignData.length === 0,
    [campaignData.length, open]
  );

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth={'sm'}>
      <DialogTitle
        fontSize={'1.6rem'}
        sx={{
          padding: '1rem',
        }}
      >
        Campaigns List
      </DialogTitle>
      <Divider />
      <div
        style={{
          padding: '1rem',
        }}
      >
        <CustomTableWrapper
          data={campaignData}
          columns={historyCampaignsColumn}
          width={'100%'}
          height={'60rem'}
          isLoading={isLoading}
          pageSizes={PAGE_SIZE_OPTIONS}
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </Dialog>
  );
}
