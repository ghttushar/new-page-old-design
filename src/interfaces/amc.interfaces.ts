import { Range } from '@/enums/serp.enums';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import {
  AMCExecutionDays,
  AMCExecutionTime,
  AMCScheduleFrequency,
  InstanceTypeEnum,
} from 'src/enums/amc.enums';
import { IPagination } from './index.interface';

export interface IAmcTableInfo {
  schemaName: string;
  tableName: string;
}
export interface IAccountQueryMapping extends IAmcTableInfo {
  _id: string;
  accountId: string;
  workflowId?: string;
  instanceId: string;
  queryId: IAMCQueryData;
  reportId?: string;
  groupId?: string;
  accessType?: string;
}

export interface IAMCQueryData {
  _id: string;
  title: string;
  description: string;
  imageUrls: string[];
  tags: string[];
  queryType: string;
  accessType: string;
  query: string;
  tableCreationQueryPath: string;
  createdAt: string;
  updatedAt: string;
  workflowId: string;
  gptAssistantId: string;
  gptPrompts: IPrompt[];
}

export interface IAMCWorkflowExecutionBase {
  id?: number;
  _id: string;
  executionId: string;
  executionName: string;
  workflowId: string;
  timeWindowStart: string;
  timeWindowEnd: string;
  executionCategory: string;
  timeWindowTimeZone: string;
  status: string;
  creationTime: string;
  instanceId: string;
  timeWindowType: string;
  createdAt: string;
  updatedAt: string;
  statusReason?: string;
}

export interface IAMCWorkflowExecution extends IAMCWorkflowExecutionBase {
  sponsoredAdsCampaignNames: string[];
  spCampaignIds: string[];
  sbCampaignIds: string[];
  sdCampaignIds: string[];
  olvCampaignIds: string[];
  stvCampaignIds: string[];
  dspCampaignIds: string[];
}

export interface IAMCWorkflowExecutionBaseExtended
  extends IAMCWorkflowExecutionBase {
  query: {
    title: string;
  };
}

export interface IAMCWorkflowExecutionData {
  data: IAMCWorkflowExecutionBaseExtended[];
  pagination: IPagination;
}

export interface IAMCAudienceQueryData {
  _id: string;
  title: string;
  description: string;
  imageUrls: string[];
  tags: string[];
  queryType: string;
  accessType: string;
  query: string;
  tableCreationQueryPath: string;
  createdAt: string;
  updatedAt: string;
  queryName: string;
  gptAssistantId: string;
  gptPrompts: IPrompt[];
}

export interface IAMCCreatedAudienceData {
  id?: number;
  _id: string;
  audienceExecutionId: string;
  audienceExecutionName: string;
  audienceExecutionDescription: string;
  audienceExecutionStatus: string;
  timeWindowStart: string;
  timeWindowEnd: string;
  createTime: string;
  queryId: IAMCAudienceQueryData;
  timeWindowTimeZone: string;
  audienceCount: number | null;
  instanceId: string;
  accountId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAMCCreateInstanceRequestResponse {
  accountId: string;
  status: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAMCGetInstanceRequestResponse {
  _id: string;
  accountId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAMCInstance {
  accountId: string;
  instanceId: string;
  instanceName: string;
  instanceType: InstanceTypeEnum;
  customerCanonicalName: string;
  creationStatus: string;
  isPrimary: boolean;
  amcAccountId: string;
  dspAdvertiserId: string;
  profileId: string;
}

export interface IAMCQueryExecutionCampaigns {
  dspCampaignIds?: string[];
  stvCampaignIds?: string[];
  olvCampaignIds?: string[];
  spCampaignIds?: string[];
  sbCampaignIds?: string[];
  sdCampaignIds?: string[];
  sponsoredAdsCampaignNames?: string[];
}

export interface IAMCWorkflowQueryExecutionBody
  extends IAMCQueryExecutionCampaigns {
  instanceId: string;
  workflowId: string;
  executionName: string;
  startDate?: string;
  endDate?: string;
  dateRange: string;
  timeWindowType: string;
  timeWindowTimeZone: string;
}

export interface IAMCWorkflowQueryExecutionScheduleBody
  extends IAMCQueryExecutionCampaigns {
  instanceId: string;
  workflowId: string;
  scheduleName: string;
  scheduleStatus: boolean;
  scheduleFrequency: string;
  scheduleTime: number;
  scheduleStartDay?: string;
  scheduleTimezone: string;
  timeWindowType?: string;
}

export interface IAMCIncludedCampaignsTable {
  id?: number;
  campaignType: IDropdownItem<string>;
  campaignName: IDropdownItem<string>;
  campaignGroup: IDropdownItem<string>;
}

export interface IAMCWorkflowQueryExecutionFilterForm {
  executionName: string;
  dateRange?: IDropdownItem<Range>;
  scheduleFrequency?: IDropdownItem<AMCScheduleFrequency>;
  scheduleTime: IDropdownItem<AMCExecutionTime>;
  scheduleDay?: IDropdownItem<AMCExecutionDays>;
  timezone?: IDropdownItem<string>;
  includedCampaigns: IAMCIncludedCampaignsTable[];
}

export interface IAMCWorkflowExecutionResponse {
  executionId: string;
  executionName: string;
  workflowId: string;
  timeWindowStart: string;
  timeWindowEnd: string;
  timeWindowTimeZone: string;
  timeWindowType: string;
  dspCampaignIds: string[];
  sponsoredAdsCampaignNames: string[];
  status: string;
  _id: string;
}

export interface IAllCampaign {
  campaignId: string;
  campaignName: string;
}

export interface IAllCampaignData {
  SP: IAllCampaign[];
  SB: IAllCampaign[];
  SD: IAllCampaign[];
  DSP: IAllCampaign[];
}

export interface IAMCScheduleData extends IAMCQueryExecutionCampaigns {
  id?: number;
  _id: string;
  instanceId: string;
  accountId: string;
  workflowId: string;
  scheduleName: string;
  scheduleTime: number;
  scheduleTimeUTC: number;
  scheduleFrequency: string;
  scheduleStartDay?: string;
  scheduleStatus: boolean;
  scheduleTimezone: string;
}

export interface IAMCWorkflowExecutionScheduleResponse {
  pagination: IPagination;
  data: IAMCScheduleData[];
}

export interface IAMCCustomQueryCreateResponse {
  title: string;
  description: string;
  accountId: string;
  status: string;
  type: string;
  startDate: string;
  endDate: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAMCCustomQueryCreateBody {
  endDate: string;
  startDate: string;
  queryType: string;
  description: string;
  title: string;
  instanceId: string;
}

export interface ICreateThreadBody {
  instanceId: string;
  workflowExecutionId: string;
}

export interface ICreateThreadResponse {
  fileId: string;
  threadId: string;
}

export interface IPrompt {
  title: string;
  description: string;
}
export interface IAMCCustomQueryRequest {
  _id: string;
  title: string;
  description: string;
  accountId: string;
  status: string;
  queryType: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAMCCustomQueryData {
  queries: IAccountQueryMapping[];
  requests: IAMCCustomQueryRequest[];
}

export interface IGPTAnalysePromptBody {
  threadId: string;
  fileId: string;
  assistantId: string;
  prompt: string;
}

export interface IThreadMessage {
  id: string;
  object: string;
  created_at: number;
  thread_id: string;
  role: string;
  content: IMessageContent[];
  file_ids: string[];
  assistant_id: string;
  run_id: string;
  metadata: Record<string, unknown>;
}

export interface IMessageContent {
  type: string;
  text: {
    value: string;
    annotations: string[];
  };
}
export interface IAMCCreateAudience {
  audienceExecutionId: string;
  audienceExecutionName: string;
  audienceExecutionDescription: string;
  audienceExecutionStatus: string;
  timeWindowStart: string;
  timeWindowEnd: string;
  createTime: string;
  queryId: string;
  timeWindowTimeZone: string;
  audienceCount?: number;
  instanceId: string;
  accountId: string;
  _id: string;
}

export interface IAMCCreateAudienceBody {
  instanceId: string;
  queryId: string;
  dateRange: string;
  startDate?: string;
  endDate?: string;
  timeWindowTimeZone: string;
  audienceName: string;
  audienceDescription: string;
  isAutoAdjustDateEnabled: boolean;
}

export interface IAMCCreateAudienceFilterForm {
  audienceName: string;
  description: string;
  dateRange: IDropdownItem<Range>;
  timezone: IDropdownItem<string>;
  autoAdjustDate: string;
}

export interface IAMCReportData {
  accessToken: string;
  workflowMapping: IAccountQueryMapping;
  workflowExecution: IAMCWorkflowExecution;
}

export interface IDateRangeInWords {
  label: string;
  value: Range;
}

export interface ICustomDateRange {
  startDate: string;
  endDate: string;
}
