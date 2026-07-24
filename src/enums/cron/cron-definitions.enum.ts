export enum CronHandlerEnum {
  NODE_CRON = 'node_cron',
  SCHEDULE_RUNNER = 'schedule_runner',
}

export enum CronCatchupPolicyEnum {
  RUN_LATEST_ONLY = 'run_latest_only',
  RUN_ALL_MISSED = 'run_all_missed',
  SKIP = 'skip',
}

export enum CronJobStatusEnum {
  PENDING = 'pending',
  CLAIMED = 'claimed',
  TRIGGERED = 'triggered',
  SKIPPED = 'skipped',
  FAILED = 'failed',
}

export enum CronDefinitionsTableTitlesEnum {
  CRON_DEFINITIONS = 'Cron_Definitions',
}

export enum DialogTypeEnum {
  CREATE = 'create',
  EDIT = 'edit',
}
