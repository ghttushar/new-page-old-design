import ConfirmationBox from '@/app/components/common/confirmation-box/confirmation-box';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { useAppMutation } from '@/redux/react-query-hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { showSuccessToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import WalmartDayPartingService from '@/services/day-parting-wmt.service';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { AntSwitch } from 'src/app/components/common/ant-switch/ant-switch';
import { DaypartingJobStatusEnum } from 'src/enums/day-parting.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import DayPartingService from 'src/services/day-parting.service';
import { getStatus } from 'src/utils/day-parting.utils';

interface IDayPartingStatusProps {
  originalStatus: DaypartingJobStatusEnum;
  id: string;
}

export default function DayPartingStatus({
  originalStatus,
  id,
}: IDayPartingStatusProps) {
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);

  const marketplace = useMemo(
    () => selectedAdvertisingAccount.marketplace,
    [selectedAdvertisingAccount.marketplace]
  );

  const isChecked = getStatus(originalStatus);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const isDisabled = originalStatus === DaypartingJobStatusEnum.ARCHIVED;

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateAmzJobStatus,
    isPending: updateJobStatusLoading,
    isIdle: updateJobStatusIdle,
  } = useAppMutation({
    mutationFn: (formattedStatus: DaypartingJobStatusEnum) =>
      DayPartingService.updateJobStatus(id, formattedStatus),
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
      onSettled() {
        setOpenConfirmation(false);
      },
    },
  });

  const {
    mutateAsync: updateWmtJobStatus,
    isPending: updateWmtJobStatusLoading,
    isIdle: updateWalmartJobStatusIdle,
  } = useAppMutation({
    mutationFn: (formattedStatus: string) =>
      WalmartDayPartingService.updateJobStatus(id, formattedStatus),
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
      onSettled() {
        setOpenConfirmation(false);
      },
    },
  });

  const isLoading = useMemo(
    () =>
      (updateWmtJobStatusLoading === true &&
        updateWalmartJobStatusIdle === false) ||
      (updateJobStatusLoading === true && updateJobStatusIdle === false),
    [
      updateJobStatusIdle,
      updateJobStatusLoading,
      updateWalmartJobStatusIdle,
      updateWmtJobStatusLoading,
    ]
  );

  const handleStatusChange = (formattedStatus: boolean) => {
    setOpenConfirmation(true);

    const status = !formattedStatus
      ? DaypartingJobStatusEnum.ENABLED
      : DaypartingJobStatusEnum.PAUSED;

    if (marketplace === MarketplaceEnum.AMAZON) updateAmzJobStatus(status);
    if (marketplace === MarketplaceEnum.WALMART) updateWmtJobStatus(status);
  };

  return (
    <div>
      <ConfirmationBox
        title={'Confirmation'}
        description={'Are you sure you want to change the status of this job?'}
        openConfirmation={openConfirmation}
        handleConfirmationClose={() => setOpenConfirmation(!openConfirmation)}
        isConfirmButtonRequired={true}
        confirmButtonText={'Confirm'}
        handleConfirmClick={() => handleStatusChange(isChecked)}
        isLoading={isLoading}
        loadingText="Updating Job Status"
      />
      <AntSwitch
        checked={isChecked}
        onChange={() => setOpenConfirmation(true)}
        inputProps={{ 'aria-label': 'ant design' }}
        sx={{
          '&:hover': { cursor: 'not-allowed' },
        }}
        disabled={isDisabled}
      />
    </div>
  );
}
