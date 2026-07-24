import {
  CronCatchupPolicyEnum,
  CronHandlerEnum,
} from '@/enums/cron/cron-definitions.enum';
import { ICronDefinitionsFormData } from '@/interfaces/cron/cron-definitions.interface';

export const handlerOptions = [
  { value: CronHandlerEnum.NODE_CRON, label: 'Node Cron (node-schedule)' },
  { value: CronHandlerEnum.SCHEDULE_RUNNER, label: 'Schedule Runner' },
];

export const catchupPolicyOptions = [
  { value: CronCatchupPolicyEnum.RUN_LATEST_ONLY, label: 'Run Latest Only' },
  { value: CronCatchupPolicyEnum.RUN_ALL_MISSED, label: 'Run All Missed' },
  { value: CronCatchupPolicyEnum.SKIP, label: 'Skip' },
];

export const initialFormData: ICronDefinitionsFormData = {
  taskType: '',
  description: '',
  cronExpression: '0 */4 * * *',
  handler: CronHandlerEnum.NODE_CRON,
  catchupPolicy: CronCatchupPolicyEnum.RUN_LATEST_ONLY,
  enabled: true,
  errorNotification: true,
  payload: '{}',
};
