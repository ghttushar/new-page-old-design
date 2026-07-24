import SecondaryLoadingButton from '@/app/components/common/secondary-loading-button/secondary-loading-button';
import { MessageExecutionModeEnum } from '@/enums/pub-sub.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { useAppDispatch } from '@/redux/hooks';
import { useAppMutation } from '@/redux/react-query-hooks';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from '@/redux/slices/notifications/toast-message.slice';
import { monitoringService } from '@/services/monitoring/monitoring.service';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

interface MonitoringRetriggerActionProps {
  taskId: string;
  executionMode: MessageExecutionModeEnum;
}
function MonitoringRetriggerAction(props: MonitoringRetriggerActionProps) {
  const { taskId, executionMode } = props;
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const {
    mutateAsync: reTriggerTask,
    isIdle,
    isPending,
  } = useAppMutation({
    mutationFn: (taskId: string) => {
      return monitoringService.retriggerTask(taskId, executionMode);
    },
    options: {
      onSuccess(data, variables, context) {
        dispatch(
          showSuccessToastMessage({
            title: data.data.message,
            description: data.data.description,
          })
        );
      },
      onError() {
        dispatch(
          showErrorToastMessage({
            title: 'Task Re-trigger failed',
            description: `Task Re-trigger failed for task with ID:${taskId} `,
          })
        );
      },
      onSettled() {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.FETCH_MONITORING_HISTORY],
        });
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.FETCH_MONITORING_DATA],
        });
      },
    },
  });

  const handleConfirmClick = () => {
    reTriggerTask(taskId);
  };

  const isLoading = useMemo(
    () => isIdle === false && isPending === true,
    [isIdle, isPending]
  );

  return (
    <div className="p-4">
      <SecondaryLoadingButton
        buttonFunction={handleConfirmClick}
        buttonText="Re-trigger"
        disabled={false}
        width="auto"
        height="3rem"
        fontSize="1.1rem"
        isLoading={isLoading}
      />
    </div>
  );
}

export default MonitoringRetriggerAction;
