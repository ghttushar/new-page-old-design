import { ReportTypeEnum } from '@/enums/reports.enum';

export interface IEmbedReportAccessToken {
  accessToken: string;
  reportId: string;
  groupId: string;
}

export interface IPowerBIReportEmbedConfig {
  reportId: string;
  groupId: string;
  accessToken: string;
  embedUrl: string;
}

export interface IReportConfigItem {
  _id: string;
  accountId: string;
  channel: string;
  reportKind: string;
  reportProvider: string;
  externalReportId: string;
  externalGroupId: string;
  reportOwner: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IReportConfigDetailedResponse {
  reportConfig: IReportConfigItem;
  embedToken: string;
}

export interface IReportConfigResponse {
  success: boolean;
  error: boolean;
  message: string;
  data: IReportConfigItem[];
  description: string;
}

export interface IReportTabOption {
  label: string;
  value: string;
  reportConfigId: string;
  reportType: ReportTypeEnum | null;
}
