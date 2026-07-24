import { ReportTypeEnum } from '@/enums/reports.enum';
import { AMAZON_AMC_URL, AUTH_BASE_URL, POWER_BI_URL } from 'src/constants';
import { IAMCReportData } from 'src/interfaces/amc.interfaces';
import {
  IEmbedReportAccessToken,
  IReportConfigDetailedResponse,
  IReportConfigItem,
} from 'src/interfaces/reports.interfaces';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

const reportsService = {
  getEmbedReportAccessToken: (
    marketplace: string,
    reportType: ReportTypeEnum
  ) => {
    const params = {
      marketplace,
      reportType,
    };
    return axiosInstance.get<IAPIResponse<IEmbedReportAccessToken>>(
      `${POWER_BI_URL}`,
      {
        params,
      }
    );
  },

  getAMCReportIdAndGroupId: (workflowExecutionId: string) => {
    return axiosInstance.get<IAPIResponse<IEmbedReportAccessToken>>(
      `${AMAZON_AMC_URL}/reportId-groupId/${workflowExecutionId}`
    );
  },

  getReportConfigs: () => {
    return axiosInstance.get<IAPIResponse<IReportConfigItem[]>>(
      `${AUTH_BASE_URL}/api/auth/report-config`
    );
  },

  getReportConfigById: (reportConfigId: string) => {
    return axiosInstance.get<IAPIResponse<IReportConfigDetailedResponse>>(
      `${AUTH_BASE_URL}/api/auth/report-config/${reportConfigId}`
    );
  },

  storeWorkflowExecutedData: (
    instanceId: string,
    workflowExecutionId: string
  ) => {
    return axiosInstance.post<IAPIResponse<IAMCReportData>>(
      `${AMAZON_AMC_URL}/workflow-executed-data/${instanceId}/workflow-execution/${workflowExecutionId}`
    );
  },
};

export default reportsService;
