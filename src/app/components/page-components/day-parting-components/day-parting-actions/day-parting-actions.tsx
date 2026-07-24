import ConfirmationBox from '@/app/components/common/confirmation-box/confirmation-box';
import HoverInfoTooltip from '@/app/components/common/hover-info-tooltip/hover-info-tooltip';
import { AD_TYPE_MAPPING } from '@/constants/advertising-filter.constants';
import { DAY_PARTING_PAGE_URL } from '@/constants/urls.constants';
import { AdTypeShort } from '@/enums/advertising.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { useAppMutation } from '@/redux/react-query-hooks';
import { setAdvertisingHeaderFilters } from '@/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { setIsFormOpen } from '@/redux/slices/day-parting/day-parting.slice';
import { showSuccessToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import WalmartDayPartingService from '@/services/day-parting-wmt.service';
import { getSelectedAdTypeByMarketplace } from '@/utils/advertising.utils';
import IconButton from '@mui/material/IconButton';
import { ArchiveIcon, PencilIcon } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DaypartingJobStatusEnum,
  DaypartingTabsEnum,
} from 'src/enums/day-parting.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import DayPartingService from 'src/services/day-parting.service';
import styles from './day-parting-actions.module.scss';

interface IDayPartingActionsProps {
  id: string;
  jobStatus: DaypartingJobStatusEnum;
  adType: AdTypeShort;
}

const path = `${DAY_PARTING_PAGE_URL}/${DaypartingTabsEnum.HOURLY_TRENDS.toLowerCase()}/edit`;
const walmartPath = `${DAY_PARTING_PAGE_URL}/${DaypartingTabsEnum.DAYPARTING_SETUP.toLowerCase()}/edit`;

export default function DayPartingActions({
  id,
  jobStatus,
  adType,
}: IDayPartingActionsProps) {
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [openConfirmation, setOpenConfirmation] = useState(false);

  const marketplace = useMemo(
    () => selectedAdvertisingAccount.marketplace,
    [selectedAdvertisingAccount.marketplace]
  );

  const {
    mutateAsync: archiveWalmartDaypartingJob,
    isPending: isWalmartArchivingPending,
  } = useAppMutation({
    mutationFn: () => WalmartDayPartingService.archiveDayPartingJob(id),

    options: {
      onSuccess(data) {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.FETCH_WALMART_DAYPARTING_JOBS],
        });

        dispatch(
          showSuccessToastMessage({
            title: data.data.message,
            description: data.data.description,
          })
        );
      },
    },
  });

  const {
    mutateAsync: archiveAmazonDaypartingJob,
    isPending: isAmazonArchivingPending,
  } = useAppMutation({
    mutationFn: () => DayPartingService.archiveJob(id),

    options: {
      onSuccess(data) {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.FETCH_AMZ_DAYPARTING_JOBS],
        });

        dispatch(
          showSuccessToastMessage({
            title: data.data.message,
            description: data.data.description,
          })
        );
      },
    },
  });

  const handleJobEdit = () => {
    const formattedAdType = getSelectedAdTypeByMarketplace(
      adType,
      marketplace ?? MarketplaceEnum.AMAZON
    );

    if (marketplace === MarketplaceEnum.WALMART) {
      dispatch(
        setAdvertisingHeaderFilters({
          adType: formattedAdType,
        })
      );

      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnums.FETCH_WALMART_DAYPARTING_CAMPAIGNS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnums.FETCH_WMT_DAYPARTING_JOB_BY_ID],
      });

      document.getElementById('day-parting-form')?.scrollIntoView({
        behavior: 'smooth',
      });

      navigate(
        `${walmartPath}/${id}/${(
          AD_TYPE_MAPPING[formattedAdType.value] ?? AdTypeShort.All
        ).toLowerCase()}`
      );

      return;
    }
    if (marketplace === MarketplaceEnum.AMAZON) {
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnums.DAYPARTING_CAMPAIGNS_LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeyEnums.FETCH_AMZ_DAYPARTING_JOB_BY_ID],
      });
      dispatch(setIsFormOpen(true));
      document.getElementById('day-parting-form')?.scrollIntoView({
        behavior: 'smooth',
      });

      navigate(
        `${path}/${id}/${(
          AD_TYPE_MAPPING[formattedAdType.value] ??
          AdTypeShort.SPONSORED_PRODUCTS
        ).toLowerCase()}`
      );
      return;
    }
  };

  const handleJobArchive = () => {
    if (marketplace === MarketplaceEnum.WALMART) {
      archiveWalmartDaypartingJob();
      return;
    }

    if (marketplace === MarketplaceEnum.AMAZON) {
      archiveAmazonDaypartingJob();
      return;
    }
  };

  const isLoading = useMemo(
    () => isAmazonArchivingPending || isWalmartArchivingPending,
    [isAmazonArchivingPending, isWalmartArchivingPending]
  );

  const getCursorStyle = () => {
    return jobStatus === DaypartingJobStatusEnum.ARCHIVED
      ? 'not-allowed'
      : 'pointer';
  };

  const isJobDisabled = useMemo(
    () => jobStatus === DaypartingJobStatusEnum.ARCHIVED,
    [jobStatus]
  );

  return (
    <div
      className={styles.actionsContainer}
      style={{ cursor: getCursorStyle() }}
    >
      <ConfirmationBox
        title={'Confirmation'}
        description={
          'Are you sure you want to archive this job? While doing so this job will be archived.'
        }
        openConfirmation={openConfirmation}
        handleConfirmationClose={() => setOpenConfirmation(!openConfirmation)}
        isConfirmButtonRequired={true}
        confirmButtonText="Confirm"
        handleConfirmClick={handleJobArchive}
        loadingText="Archiving Job"
        isLoading={isLoading}
      />

      <HoverInfoTooltip title={'Edit Job'}>
        <IconButton
          disableRipple
          onClick={handleJobEdit}
          disabled={isJobDisabled}
        >
          <PencilIcon
            size={20}
            weight="fill"
            color={isJobDisabled ? '#bbb' : '#77469b'}
          />
        </IconButton>
      </HoverInfoTooltip>

      <HoverInfoTooltip title={'Archive Job'}>
        <IconButton
          disableRipple
          onClick={() => setOpenConfirmation(true)}
          disabled={isJobDisabled}
        >
          <ArchiveIcon size={20} color={isJobDisabled ? '#bbb' : '#77469b'} />
        </IconButton>
      </HoverInfoTooltip>
    </div>
  );
}
