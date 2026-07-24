import { ReportTypeEnum } from '@/enums/reports.enum';
import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  IReportConfigItem,
  IReportTabOption,
} from 'src/interfaces/reports.interfaces';

const REPORT_LABEL_MAP: Record<string, string> = {
  [ReportTypeEnum.BUSINESS_PERFORMANCE]: 'Business Performance',
  [ReportTypeEnum.SQP]: 'SQP',
  [ReportTypeEnum.HOURLY_PERFORMANCE]: 'Hourly Performance',
};

const REPORT_TYPE_MAP: Record<string, ReportTypeEnum | null> = {
  [ReportTypeEnum.BUSINESS_PERFORMANCE]: ReportTypeEnum.BUSINESS_PERFORMANCE,
  [ReportTypeEnum.SQP]: ReportTypeEnum.SQP,
  [ReportTypeEnum.HOURLY_PERFORMANCE]: ReportTypeEnum.HOURLY_PERFORMANCE,
};

export const getReportsBaseUrl = (marketplace: string) =>
  `/reports/list/${marketplace}`;

export const getReportsViewUrl = (
  marketplace: string,
  reportConfigId?: string
) =>
  reportConfigId
    ? `/reports/${marketplace}/view/${reportConfigId}`
    : getReportsBaseUrl(marketplace);

export const normalizeReportsMarketplace = (
  marketplace?: string | null
): MarketplaceEnum => {
  if (marketplace === MarketplaceEnum.All) {
    return MarketplaceEnum.All;
  }

  return marketplace === MarketplaceEnum.WALMART
    ? MarketplaceEnum.WALMART
    : MarketplaceEnum.AMAZON;
};

export const getReportTabLabel = (reportKind: string) => {
  return (
    REPORT_LABEL_MAP[reportKind] ??
    reportKind
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  );
};

export const getReportTypeByKind = (reportKind: string) =>
  REPORT_TYPE_MAP[reportKind] ?? null;

export const getMarketplaceReportTabs = (
  reportConfigs: IReportConfigItem[],
  marketplace: string
): IReportTabOption[] => {
  return reportConfigs
    .filter(
      (reportConfig) =>
        reportConfig.channel === marketplace && reportConfig.isActive
    )
    .map((reportConfig) => ({
      label: getReportTabLabel(reportConfig.reportKind),
      value: reportConfig._id,
      reportConfigId: reportConfig._id,
      reportType: getReportTypeByKind(reportConfig.reportKind),
    }))
    .filter((reportTab) => reportTab.reportType !== null);
};

export const getSelectedReportConfig = (
  reportConfigs: IReportConfigItem[],
  marketplace: string,
  reportConfigId?: string
) => {
  if (!reportConfigId) return null;

  return (
    reportConfigs.find(
      (reportConfig) =>
        reportConfig.channel === marketplace &&
        reportConfig._id === reportConfigId &&
        reportConfig.isActive
    ) ?? null
  );
};
