import {
  CronCatchupPolicyEnum,
  CronHandlerEnum,
} from '@/enums/cron/cron-definitions.enum';

export interface ICronDefinition {
  taskType: string;
  cronExpression: string;
  catchupPolicy: CronCatchupPolicyEnum;
  payload?: Record<string, unknown>;
  handler: CronHandlerEnum;
  enabled: boolean;
  errorNotification: boolean;
  createdAt: string;
  updatedAt: string;
  description?: string;
  lastRunAt?: string;
  nextRunAt?: string;
}

export interface ICronDefinitionsInsert {
  taskType: string;
  cronExpression: string;
  catchupPolicy?: CronCatchupPolicyEnum;
  payload?: Record<string, unknown>;
  handler?: CronHandlerEnum;
  enabled?: boolean;
  errorNotification?: boolean;
  description?: string;
}

export interface ICronDefinitionsFilters {
  taskType?: string;
  enabled?: boolean;
  searchText?: string;
  createdDateFrom?: string;
  createdDateTo?: string;
  updatedDateFrom?: string;
  updatedDateTo?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IGenerateJobsResult {
  count: number;
  definitionCount?: number;
}

export interface ICronDefinitionsCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ICronDefinitionsInsert) => void;
  editData?: ICronDefinition | null;
  isLoading?: boolean;
  isEditMode?: boolean;
}

export interface ICronDefinitionsFormData {
  taskType: string;
  description: string;
  cronExpression: string;
  handler: CronHandlerEnum;
  catchupPolicy: CronCatchupPolicyEnum;
  enabled: boolean;
  errorNotification: boolean;
  payload: string;
}
export interface IFieldErrors {
  taskType?: string;
  description?: string;
  cronExpression?: string;
  payload?: string;
}
