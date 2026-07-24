import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoaderWrapper from 'src/app/components/common/loader-wrapper/loader-wrapper';
import AMCReportNavBar from 'src/app/components/page-components/amc-components/amc-report-nav-bar/amc-report-nav-bar';
import { GPTChatModel } from 'src/app/components/page-components/amc-components/gpt-chat/gpt-chat-modal';
import GPTFloatingIcon from 'src/app/components/page-components/amc-components/gpt-icon/gpt-icon';
import {
  IAMCWorkflowExecution,
  IAmcTableInfo,
  IPrompt,
} from 'src/interfaces/amc.interfaces';
import { IPowerBIReportEmbedConfig } from 'src/interfaces/reports.interfaces';
import { useAppSelector } from 'src/redux/hooks';
import { selectSelectedInstance } from 'src/redux/slices/amc/amc.slice';
import AMCGPTServices from 'src/services/amc/amc-gpt.services';
import reportsService from 'src/services/reports.service';
import AMCPowerBIReport from './amc-report';
import styles from './amc-report-page.module.scss';

export interface IThreadData {
  threadId: string;
  fileId: string;
}
const AMCReportPage = () => {
  const [reportConfig, setReportConfig] =
    useState<IPowerBIReportEmbedConfig | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [prompt, setPrompt] = useState<IPrompt[]>([]);
  const [assistantId, setAssistantId] = useState<string>('');
  const { workflowExecutionId } = useParams();
  const amcFilters = useAppSelector(selectSelectedInstance);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreatingThread, setIsCreatingThread] = useState<boolean>(false);
  const [amcTableInfo, setAmcTableInfo] = useState<IAmcTableInfo | null>(null);
  const [workflowExecution, setWorkflowExecution] =
    useState<IAMCWorkflowExecution | null>(null);
  const [threadData, setThreadData] = useState<IThreadData | null>(null);

  useEffect(() => {
    setIsLoading(true);
    reportsService
      .storeWorkflowExecutedData(
        amcFilters?.value as string,
        workflowExecutionId as string
      )
      .then((res) => {
        const reportData = res.data.data;
        const accessToken = reportData.accessToken;
        const { reportId, groupId, tableName, schemaName } =
          reportData.workflowMapping;

        setAmcTableInfo({
          tableName: reportData.workflowMapping.tableName,
          schemaName: reportData.workflowMapping.schemaName,
        });
        setWorkflowExecution(reportData.workflowExecution);
        setReportConfig({
          reportId: reportId as string,
          groupId: groupId as string,
          accessToken: accessToken,
          embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${groupId}`,
        });
        setPrompt(reportData.workflowMapping.queryId.gptPrompts);
        setAssistantId(reportData.workflowMapping.queryId.gptAssistantId);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [workflowExecutionId, amcFilters?.value]);

  const createThread = () => {
    if (threadData) return;
    setIsCreatingThread(true);
    const body = {
      instanceId: amcFilters?.value as string,
      workflowExecutionId: workflowExecutionId as string,
    };
    AMCGPTServices.createThread(body)
      .then((res) => {
        setThreadData({
          threadId: res.data.data.threadId,
          fileId: res.data.data.fileId,
        });
      })
      .finally(() => {
        setIsCreatingThread(false);
      });
  };

  const openGPTModal = async () => {
    setShowModal(!showModal);
    await createThread();
  };

  if (isLoading) {
    return (
      <div>
        <LoaderWrapper />
      </div>
    );
  }
  return (
    <div className={styles.amcReportPage}>
      {workflowExecution && (
        <AMCReportNavBar
          startDate={workflowExecution.timeWindowStart}
          endDate={workflowExecution.timeWindowEnd}
        />
      )}
      <GPTFloatingIcon onIconClick={openGPTModal} />
      {showModal && (
        <GPTChatModel
          onBackdropClick={openGPTModal}
          builtInPrompts={prompt}
          assistantId={assistantId}
          threadData={threadData}
          isCreatingThread={isCreatingThread}
        />
      )}
      {workflowExecutionId && amcTableInfo && (
        <AMCPowerBIReport
          reportConfig={reportConfig}
          workflowExecutionId={workflowExecutionId}
          amcTableInfo={amcTableInfo}
        />
      )}
    </div>
  );
};

export default AMCReportPage;
