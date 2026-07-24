import {
  CAMPAIGN_ID_COLUMN,
  CAMPAIGN_NUMBER_COLUMN,
  DP_CAMPAIGN_NAME_COLUMN,
} from '@/app/components/pages/day-parting-wrapper/day-parting-campaigns-page/day-parting-campaign-table-columns';
import CustomTableWrapper from '@/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { PAGE_SIZE_OPTIONS } from '@/constants';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingHeaderFilters } from '@/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { selectTriggerFetch } from '@/redux/slices/day-parting/day-parting.slice';
import WalmartDayPartingService from '@/services/day-parting-wmt.service';
import DayPartingService from '@/services/day-parting.service';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { PaginationState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import TextButton from 'src/app/components/common/text-button/text-button';
import { IDayPartingCampaignsList } from 'src/interfaces/day-parting.interfaces';

interface IDayPartingCampaignListViewProps {
  campaigns: string[];
}

export default function DayPartingCampaignListView({
  campaigns,
}: IDayPartingCampaignListViewProps) {
  const trigger = useAppSelector(selectTriggerFetch);
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);
  const selectedAdTypeFilter = useAppSelector(selectAdvertisingHeaderFilters);

  const [open, setOpen] = useState(false);

  const label = `${campaigns.length} ${
    campaigns.length <= 1 ? 'Campaign' : 'Campaigns'
  }`;

  const marketplace = useMemo(
    () => selectedAdvertisingAccount.marketplace,
    [selectedAdvertisingAccount.marketplace]
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchDayPartingCampaignList = useAppQuery({
    queryFn: ({ signal }) =>
      DayPartingService.getCampaignData(signal, campaigns),
    queryKey: [
      QueryKeyEnums.DAYPARTING_CAMPAIGNS_LIST,
      { trigger, campaigns, marketplace },
    ],
    enabled: open && marketplace === MarketplaceEnum.AMAZON,
    options: {
      staleTime: 1 * 60 * 1000,
    },
  });

  const fetchWalmartDayPartingCampaignList = useAppQuery({
    queryFn: ({ signal }) =>
      WalmartDayPartingService.getWalmartCampaignData(
        signal,
        selectedAdTypeFilter.adType.value,
        campaigns
      ),
    queryKey: [
      QueryKeyEnums.FETCH_WALMART_DAYPARTING_CAMPAIGNS,
      { trigger, campaigns, marketplace, selectedAdTypeFilter },
    ],
    enabled: open && marketplace === MarketplaceEnum.WALMART,
  });

  const campaignData = useMemo(() => {
    return marketplace === MarketplaceEnum.AMAZON
      ? fetchDayPartingCampaignList.data?.data.data
      : fetchWalmartDayPartingCampaignList.data?.data.data.map((item) => {
          return {
            campaignId: item.campaignId,
            campaignName: item.campaignName,
          } as IDayPartingCampaignsList;
        });
  }, [
    fetchDayPartingCampaignList.data?.data.data,
    fetchWalmartDayPartingCampaignList.data?.data.data,
    marketplace,
  ]);

  const isLoading = useMemo(
    () =>
      fetchDayPartingCampaignList.isLoading ||
      fetchDayPartingCampaignList.isRefetching ||
      fetchWalmartDayPartingCampaignList.isLoading ||
      fetchWalmartDayPartingCampaignList.isRefetching,
    [
      fetchDayPartingCampaignList.isLoading,
      fetchDayPartingCampaignList.isRefetching,
      fetchWalmartDayPartingCampaignList.isLoading,
      fetchWalmartDayPartingCampaignList.isRefetching,
    ]
  );
  return (
    <div>
      <TextButton label={label} handleClick={handleOpen} isVisible={true} />
      <HoverCampaignListDialog
        open={open}
        onClose={handleClose}
        campaignData={campaignData ?? []}
        isLoading={isLoading}
      />
    </div>
  );
}

interface IHoverCampaignListDialogProps {
  open: boolean;
  onClose: (value: string) => void;
  campaignData: IDayPartingCampaignsList[];
  isLoading: boolean;
}

function HoverCampaignListDialog(props: IHoverCampaignListDialogProps) {
  const { onClose, open, campaignData, isLoading } = props;
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: localStorageUtils.getPaginationModel().pageSize,
  });
  return (
    <Dialog
      onClose={onClose}
      open={open}
      sx={{
        '& .MuiDialog-paper': {
          width: '100%',
          borderRadius: '0.8rem',
        },
      }}
    >
      <DialogContent>
        <CustomTableWrapper
          data={campaignData}
          columns={[
            CAMPAIGN_NUMBER_COLUMN,
            DP_CAMPAIGN_NAME_COLUMN,
            CAMPAIGN_ID_COLUMN,
          ]}
          width={'100%'}
          height={'60rem'}
          isLoading={isLoading}
          pageSizes={PAGE_SIZE_OPTIONS}
          pagination={pagination}
          setPagination={setPagination}
        />
      </DialogContent>
    </Dialog>
  );
}
