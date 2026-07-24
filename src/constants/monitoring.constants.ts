import { ACTIVE_ENV } from '@/constants/env/env.orchestrator';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import {
  MetaTypeEnum,
  MonitoringSearchColumnsEnum,
} from 'src/enums/monitoring.enum';
import { ALL_LABEL } from '.';

export const metaTypeOptionConstants: IDropdownItem<string>[] = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Amazon Profile ID',
    value: MetaTypeEnum.AMAZON_PROFILE_ID,
  },
  {
    label: 'Anarix Account ID',
    value: MetaTypeEnum.ANARIX_ACCOUNT_ID,
  },
  {
    label: 'Amazon Advertiser ID',
    value: MetaTypeEnum.AMAZON_ADVERTISER_ID,
  },
];

export const ALL_OPTION: IDropdownItem<string> = {
  label: ALL_LABEL,
  value: ALL_LABEL.toLowerCase(),
};

export const MONITORING_SEARCH_COLUMNS = [
  MonitoringSearchColumnsEnum.TASK_ID,
  MonitoringSearchColumnsEnum.TASK_TYPE,
];

export const MONITORING_LOGS_REDIRECT_URL = `https://api.anarix.ai/admin/monitoring/grafana/explore?schemaVersion=1&panes=%7B%22-bS%22:%7B%22datasource%22:%22b6df28b6-a3d7-4c0a-9466-e1e189e51df4%22,%22queries%22:%5B%7B%22refId%22:%22A%22,%22expr%22:%22%7Benvironment%3D%5C%22${ACTIVE_ENV}%5C%22%7D%20%7C%3D%20%60{taskId}%60%22,%22queryType%22:%22range%22,%22datasource%22:%7B%22type%22:%22loki%22,%22uid%22:%22b6df28b6-a3d7-4c0a-9466-e1e189e51df4%22%7D,%22editorMode%22:%22builder%22%7D%5D,%22range%22:%7B%22from%22:%22{startTime}%22,%22to%22:%22now%22%7D%7D%7D&orgId=1`;

export const MONITORING_HISTORY_LOGS_REDIRECT_URL = `https://api.anarix.ai/admin/monitoring/grafana/explore?schemaVersion=1&panes=%7B%22-bS%22:%7B%22datasource%22:%22b6df28b6-a3d7-4c0a-9466-e1e189e51df4%22,%22queries%22:%5B%7B%22refId%22:%22A%22,%22expr%22:%22%7Benvironment%3D%5C%22${ACTIVE_ENV}%5C%22%7D%20%7C%3D%20%60{taskId}%60%22,%22queryType%22:%22range%22,%22datasource%22:%7B%22type%22:%22loki%22,%22uid%22:%22b6df28b6-a3d7-4c0a-9466-e1e189e51df4%22%7D,%22editorMode%22:%22builder%22%7D%5D,%22range%22:%7B%22from%22:%22{startTime}%22,%22to%22:%22{endTime}%22%7D%7D%7D&orgId=1`;
