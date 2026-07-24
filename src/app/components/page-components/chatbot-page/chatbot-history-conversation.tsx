import { fancyScrollbar } from '@/assets/styles/scrollbar.styles';
import { imageUrls } from '@/constants/assets/images.constants';
import { ENABLE_CAMPAIGN_EDIT_API } from '@/constants/chatbot.constants';
import { AnarixLLMToolEnum, FeedBackEnum } from '@/enums/chatbot.enums';
import { TooltipPlacement } from '@/enums/tooltip-texts.enums';
import { useUploadFile } from '@/hooks/chatbot/use-chatbot-hook';
import {
  ICampaignEditAdTypeResult,
  IDownloadCSVDataPayload,
  IJIVAInsights,
  IParsedChatHistoryResponse,
  IParsedHistory,
  IUploadFilePayload,
} from '@/interfaces/chatbot.interface';
import {
  selectInsightsData,
  selectIsPreviewOpen,
  setIsPreviewOpen,
  setPreviewPanelUrl,
  updateInsight,
} from '@/redux/chatbot/chatbot.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppMutation } from '@/redux/react-query-hooks';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from '@/redux/slices/notifications/toast-message.slice';
import chatbotServices from '@/services/bidder/llm-chatbot/chatbot.service';
import { remToPx } from '@/utils';
import { checkIsNull } from '@/utils/advertising.utils';
import chatbotUtils from '@/utils/chatbot.utils';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import {
  ArrowsOutIcon,
  CaretRightIcon,
  ChartBarIcon,
  XIcon,
} from '@phosphor-icons/react';
import { marked, Tokens } from 'marked';
import { PlotData } from 'plotly.js-basic-dist';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactMarkdown from 'react-markdown';
import Plot, { PlotParams } from 'react-plotly.js';
import { CopyToClipBoardIcon } from '../../common/copy-to-clipboard/copy-to-clipboard';
import DownloadTableButton from '../../common/download-button/download-table-button';
import GraphHoverClick from '../../common/graph-hover-click/graph-hover-click';
import HoverInfoTooltip from '../../common/hover-info-tooltip/hover-info-tooltip';
import InsightTablePreview from '../../common/insight-table-preview/insight-table-preview';
import PrimaryButton from '../../common/primary-button/primary-button';
import SecondaryButton from '../../common/secondary-button/secondary-button';
import GenericTable from '../../shared/custom-table-wrapper/custom-table/generic-table';
import ChatbotFeedback from './chatbot-feedback';
import { botMessageContainerStyles } from './chatbot-page-styles';
import styles from './chatbot-page.module.scss';
import ThinkingIndicator from './components/thinking-indicator';
import { useThinkingIndicator } from './components/use-thinking-indicator';

// Configure marked to enable GitHub Flavored Markdown (for tables)
const renderer = new marked.Renderer();
renderer.table = ({ header, rows }: Tokens.Table) => {
  const headerHtml = renderer.tablerow({
    text: header.map((cell) => renderer.tablecell(cell)).join(''),
  });

  const bodyHtml = rows
    .map((row) =>
      renderer.tablerow({
        text: row.map((cell) => renderer.tablecell(cell)).join(''),
      })
    )
    .join('');

  const maxHeight = '36rem';
  return `<div style="overflow-x: auto; overflow-y: auto; max-width: 100%; max-height: ${maxHeight}; border-radius: 4px;">
    <table style="border-collapse: collapse; width: 100%;">
      <thead style="position: sticky; top: 0; background-color: #f5f5f5; z-index: 1;">${headerHtml}</thead>
      <tbody>${bodyHtml}</tbody>
    </table>
  </div>`;
};

renderer.tablecell = ({ text, header, align }: Tokens.TableCell) => {
  const tag = header ? 'th' : 'td';
  const alignStyle = align ? `text-align: ${align};` : '';
  const style = `white-space: nowrap; padding: 0.6rem 1rem; border: 1px solid #e0e0e0; ${alignStyle}`;
  return `<${tag} style="${style}">${text}</${tag}>`;
};

marked.setOptions({
  gfm: true,
  breaks: true,
  renderer,
});

interface IHistoryConversationProps {
  historyChatData: IParsedChatHistoryResponse[];
  isHistoryLoading: boolean;
  isChatbotLoading: boolean;
  isExpanded: boolean;
  sessionId: string;
  isHistorySession: boolean;
  updateFeedback: (message_id: string, value: FeedBackEnum) => void;
  sendUserMessage: (message: string) => void;
}

interface BotMessageProps {
  response?: IParsedHistory;
  isError?: boolean;
  isGraphAvailable?: boolean;
  isCallCompleted: boolean;
  isHistoryLoaded: boolean;
  isExpanded: boolean;
  isLastMessageOfLastChat?: boolean;
  messageID: string;
  feedback: string | undefined;
  sessionId: string;
  isChatbotLoading: boolean;
  updateFeedback: (message_id: string, value: FeedBackEnum) => void;
  isStopped?: boolean;
  insightData?: IJIVAInsights;
  isInsightMessage?: boolean;
  sendUserMessage: (message: string) => void;
  isTableLocked?: boolean;
  history?: IParsedChatHistoryResponse;
}

const UserMessage = ({
  message,
  isExpanded,
}: {
  message: string;
  isExpanded: boolean;
}) => {
  const isPreviewOpen = useAppSelector(selectIsPreviewOpen);
  return (
    <div
      className={`${styles.userMessageContainer} ${
        isExpanded ? styles.userMessageContainerExpanded : ''
      } ${isPreviewOpen ? styles.userMessageContainerPreviewOpen : ''}`}
    >
      <div className={styles.userMessageContent}>
        <span className={styles.userMessageBubble}>{message}</span>
        <CopyToClipBoardIcon contentToCopy={message} />
      </div>
    </div>
  );
};

export const BotMessage = ({
  response,
  isError = false,
  isGraphAvailable = false,
  isCallCompleted,
  isExpanded,
  isLastMessageOfLastChat = false,
  messageID,
  feedback,
  sessionId,
  isHistoryLoaded,
  isChatbotLoading,
  updateFeedback,
  isStopped,
  insightData,
  isInsightMessage = false,
  sendUserMessage,
  isTableLocked = false,
  history,
}: BotMessageProps) => {
  const dispatch = useAppDispatch();
  const isPreviewOpen = useAppSelector(selectIsPreviewOpen);
  const marketplace = localStorageUtils.getAdvertisingMarketplace();
  const [isGraphOpen, setIsGraphOpen] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [tableData, setTableData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [openTableIndex, setOpenTableIndex] = useState<number | null>(
    isLastMessageOfLastChat && response?.data ? response.data.length - 1 : null
  );
  const [tableDataMap, setTableDataMap] = useState<{ [key: number]: any[] }>(
    {}
  );
  const [selectedDialogIndex, setSelectedDialogIndex] = useState<number | null>(
    null
  );

  const [isApproving, setIsApproving] = useState(false);
  const [isApproved, setIsApproved] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('approved_campaign_messages');
        const approved = stored ? JSON.parse(stored) : [];
        return Array.isArray(approved) && approved.includes(messageID);
      } catch (error) {
        return false;
      }
    }
    return false;
  });

  const markAsApproved = useCallback(() => {
    try {
      const stored = localStorage.getItem('approved_campaign_messages');
      let approved = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(approved)) approved = [];
      if (!approved.includes(messageID)) {
        approved.push(messageID);
        localStorage.setItem(
          'approved_campaign_messages',
          JSON.stringify(approved)
        );
      }
    } catch (e) {
      console.error(e);
    }
  }, [messageID]);

  const { lastItemWithS3, lastItemIndex, previewHTMLLinks } = useMemo(
    () => chatbotUtils.prepareReasoningItems(response?.data ?? undefined),
    [response?.data]
  );

  const lastItemWithS3Ref = useRef(lastItemWithS3);
  useEffect(() => {
    lastItemWithS3Ref.current = lastItemWithS3;
  }, [lastItemWithS3]);

  const handleOpenPreviewPanel = (url?: string) => {
    dispatch(setIsPreviewOpen(true));
    dispatch(setPreviewPanelUrl(url ?? ''));
  };

  const processedChartData = useMemo(
    () => chatbotUtils.getChartData(response?.chartData ?? undefined),
    [response?.chartData]
  );

  const {
    isIdle: isUploadIdle,
    isPending: isUploadPending,
    uploadFile,
  } = useUploadFile(insightData);

  const handleSaveInsightSelection = async (tableData: any[]) => {
    if (!isInsightMessage || !insightData || !sessionId) {
      return;
    }
    if (chatbotUtils.checkIsActionsAbsent(insightData)) {
      const updatedInsightData = chatbotUtils.createUpdatedInsightWithS3Context(
        insightData,
        insightData.s3_link,
        insightData.s3_link
      );

      dispatch(
        updateInsight({
          insightId: updatedInsightData.insight_id,
          updates: {
            uploaded_s3_url: updatedInsightData.uploaded_s3_url,
            uploaded_frontend_s3_url:
              updatedInsightData.uploaded_frontend_s3_url,
            hidden_insight_text: updatedInsightData.hidden_insight_text,
          },
        })
      );
      return;
    }

    const uploadPayload: IUploadFilePayload = {
      data: tableData,
      marketplace,
      insight_id: insightData.insight_id,
      session_id: sessionId,
    };

    const response = await uploadFile(uploadPayload);

    if (
      response.data.data.backend_s3_url &&
      response.data.data.frontend_s3_url
    ) {
      const updatedInsightData = chatbotUtils.createUpdatedInsightWithS3Context(
        insightData,
        response.data.data.backend_s3_url,
        response.data.data.frontend_s3_url
      );

      dispatch(
        updateInsight({
          insightId: updatedInsightData.insight_id,
          updates: {
            uploaded_s3_url: updatedInsightData.uploaded_s3_url,
            uploaded_frontend_s3_url:
              updatedInsightData.uploaded_frontend_s3_url,
            hidden_insight_text: updatedInsightData.hidden_insight_text,
          },
        })
      );
    }
  };

  const getDownloadData = useCallback(
    async (s3_file: string, disableToast = false) => {
      const currentS3File = s3_file || lastItemWithS3Ref.current?.s3_file || '';
      if (chatbotUtils.isHtmlFile(currentS3File)) return [];
      if (!currentS3File) {
        dispatch(
          showSuccessToastMessage({
            title: 'Error',
            description: 'No file available to download.',
          })
        );
        return [];
      }

      if (disableToast === false) {
        dispatch(
          showSuccessToastMessage({
            title: 'Download Started',
            description: 'This may take a few seconds.',
          })
        );
      }

      try {
        const payload: IDownloadCSVDataPayload = {
          csv_url: currentS3File,
        };

        const res = await chatbotServices.postGetDownloadCSVData(payload);
        const data = res.data.data;

        if (disableToast === false) {
          dispatch(
            showSuccessToastMessage({
              title: 'Downloaded Successfully',
              description: 'Data downloaded successfully.',
            })
          );
        }

        return data as any[];
      } catch (error) {
        console.error('Error downloading data:', error);
        if (disableToast === false) {
          dispatch(
            showErrorToastMessage({
              title: 'Download Failed',
              description: 'There was an error downloading the data.',
            })
          );
        }
        return [];
      }
    },
    [dispatch]
  );

  const stableDownloadHandler = useMemo(
    () => async () => {
      return getDownloadData(lastItemWithS3Ref.current?.s3_file || '');
    },
    [getDownloadData]
  );

  useEffect(() => {
    const fetchInitialTableData = async () => {
      if (
        isLastMessageOfLastChat &&
        openTableIndex !== null &&
        openTableIndex !== -1 &&
        response?.data?.[openTableIndex]
      ) {
        const s3_file = response.data[openTableIndex].s3_file;

        if (s3_file && !tableDataMap[openTableIndex]) {
          const data = await getDownloadData(s3_file, true);
          setTableDataMap((prev) => ({
            ...prev,
            [openTableIndex]: data,
          }));
        }
      }
    };

    fetchInitialTableData();
  }, [openTableIndex, response, isLastMessageOfLastChat]);

  useEffect(() => {
    if (
      isCallCompleted &&
      isLastMessageOfLastChat &&
      response?.data &&
      response?.data?.length > 0 &&
      openTableIndex === null
    ) {
      const lastIndex = response.data.length - 1;
      const lastFile = response.data[lastIndex].s3_file;

      if (lastFile && chatbotUtils.isS3FileValid(lastFile)) {
        setTimeout(() => {
          toggleInlineTable(lastFile, lastIndex);
        }, 0);
      }
    }
  }, [isCallCompleted, response, isLastMessageOfLastChat]);

  const toggleGraph = () => {
    setIsGraphOpen(!isGraphOpen);
  };

  const toggleTable = async (s3_file: string, index: number | null = null) => {
    if (s3_file === '' || chatbotUtils.isHtmlFile(s3_file)) {
      setIsTableOpen(false);
      return;
    }
    setTableData([]);
    setSelectedDialogIndex(index);
    setIsTableOpen(!isTableOpen);
    setTableData(await getDownloadData(s3_file, true));
  };

  const toggleInlineTable = async (_s3_file: string, index: number) => {
    if (openTableIndex === index) {
      setOpenTableIndex(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setOpenTableIndex(index);

    if (!tableDataMap[index]) {
      const data = await getDownloadData(_s3_file, true);
      setTableDataMap((prev) => ({
        ...prev,
        [index]: data,
      }));
    }

    setIsLoading(false);
  };

  const {
    mutateAsync: editCampaign,
    isIdle,
    isPending,
  } = useAppMutation({
    mutationFn: (variables: { s3_path: string; marketplace: string }) =>
      chatbotServices.editCampaign(variables),
    options: {
      onSuccess: (campaignData) => {
        if (!campaignData.data.data.results) {
          dispatch(
            showErrorToastMessage({
              title: 'Error',
              description:
                campaignData?.data?.message || 'Invalid response from server.',
            })
          );
          return;
        }

        const nonSkippedResults = Object.values(
          campaignData.data.data.results
        ).filter(
          (result): result is ICampaignEditAdTypeResult =>
            result !== undefined && result.skipped === false
        );

        if (nonSkippedResults.length === 0) {
          dispatch(
            showSuccessToastMessage({
              title: campaignData.data.message || 'Campaign Edit Completed',
              description:
                campaignData.data.description ||
                'All campaigns were skipped (no campaigns found to edit).',
            })
          );
          markAsApproved();
          setIsApproved(true);
          sendUserMessage('approved');
          return;
        }

        const errorResult = nonSkippedResults.find(
          (result) =>
            result.error ||
            result.response?.error ||
            result.response?.success === false ||
            result.success === false
        );

        if (errorResult) {
          const errorMessage =
            errorResult.response?.message ||
            errorResult.message ||
            'Campaign Edit Failed';
          const errorDescription =
            errorResult.response?.description ||
            errorResult.error ||
            errorResult.message ||
            `Failed to edit ${errorResult.adType} campaigns.`;

          dispatch(
            showErrorToastMessage({
              title: errorMessage,
              description: errorDescription,
            })
          );
        } else {
          dispatch(
            showSuccessToastMessage({
              title: campaignData.data.message || 'Success',
              description:
                campaignData.data.description ||
                'Campaign edits have been applied successfully.',
            })
          );
          markAsApproved();
          setIsApproved(true);
          sendUserMessage('approved');
        }
      },
      onError: (error: any) => {
        dispatch(
          showErrorToastMessage({
            title: 'Error',
            description:
              error?.response?.data?.description ||
              error?.response?.data?.message ||
              error?.message ||
              'Failed to approve campaign edit.',
          })
        );
      },
      onSettled: () => {
        setIsApproving(false);
      },
    },
  });

  const isLoadingApproving = useMemo(
    () => isPending === true && isIdle === false,
    [isPending, isIdle]
  );

  const handleApprove = async () => {
    const s3Path = lastItemWithS3?.s3_file?.split('/').pop() || null;

    if (!s3Path) {
      dispatch(
        showErrorToastMessage({
          title: 'Error',
          description: 'No S3 file found for campaign edits.',
        })
      );
      return;
    }

    setIsApproving(true);

    await editCampaign({
      s3_path: s3Path,
      marketplace,
    });
  };

  const handleCancel = () => {
    markAsApproved();
    setIsApproved(true);
    sendUserMessage('cancelled');
  };

  const hasContent =
    (isInsightMessage && insightData) ||
    (response?.data && response.data.length > 0) ||
    (response?.chartData && processedChartData?.length > 0) ||
    response?.summary ||
    !isCallCompleted;

  const { statusText } = useThinkingIndicator({
    isStreaming: isChatbotLoading,
    enabled: isChatbotLoading,
  });

  if (!hasContent && isCallCompleted) {
    return null;
  }
  if (
    isStopped === true &&
    checkIsNull(response?.chartData) &&
    checkIsNull(response?.data) &&
    checkIsNull(response?.summary)
  )
    return null;

  if (isError) {
    return (
      <div className={styles.botResponseContainer}>
        <div className={styles.botResponse}>
          <div className={styles.chatText}>
            <Typography color="error">
              Sorry, I encountered an error processing your request. Please try
              again.
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  if (!hasContent && isCallCompleted) {
    return null;
  }
  if (
    isStopped === true &&
    checkIsNull(response?.chartData) &&
    checkIsNull(response?.data) &&
    checkIsNull(response?.summary)
  )
    return null;

  return (
    <div
      className={styles.botResponseContainer}
      style={botMessageContainerStyles(isExpanded, isPreviewOpen)}
    >
      <div className={styles.botResponse}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            minWidth: 0,
            width: '100%',
          }}
        >
          <div className={styles.chatText}>
            {isInsightMessage && insightData && (
              <div
                className={styles.insightDisplayContainer}
                style={{
                  maxWidth: isExpanded ? '100%' : '28rem',
                }}
              >
                <div className={styles.insightHeader}>
                  <h3 className={styles.insightTitle}>{insightData.title}</h3>
                </div>
                <div
                  className={styles.insightSummary}
                  dangerouslySetInnerHTML={{
                    __html: chatbotUtils.formatInsightSummary(
                      insightData.summary
                    ),
                  }}
                />
                {insightData.s3_link && (
                  <div className={styles.insightTablePreview}>
                    <InsightTablePreview
                      s3Link={insightData.s3_link}
                      frontendS3Link={insightData.uploaded_frontend_s3_url}
                      isChatbotExpanded={isExpanded}
                      hasActions={
                        insightData.actions && insightData.actions.length > 0
                      }
                      onSave={handleSaveInsightSelection}
                      maxPreviewRows={isExpanded ? 3 : 2}
                      isLocked={isTableLocked}
                    />
                  </div>
                )}
              </div>
            )}
            {response?.data && response.data.length !== 0 ? (
              <div className={styles.reasoningContainer}>
                {lastItemWithS3 && (
                  <React.Fragment>
                    <div
                      key={`${lastItemWithS3.reasoningQues}-${lastItemIndex}`}
                      className={styles.reasoningResponse}
                      style={{
                        maxWidth: isExpanded ? '80%' : '100%',
                      }}
                    >
                      {lastItemWithS3.s3_file.length !== 0 ? (
                        <img
                          className={styles.csvFileIcon}
                          src={imageUrls.csvFileIcon}
                          alt="csv-icon"
                        />
                      ) : (
                        <img
                          className={styles.csvFileIcon}
                          src={imageUrls.nonCsvFileIcon}
                          alt="non-csv-icon"
                        />
                      )}
                      <HoverInfoTooltip
                        title={lastItemWithS3.reasoningQues}
                        disableTooltip={
                          isExpanded || lastItemWithS3.reasoningQues.length < 60
                        }
                        position={TooltipPlacement.Bottom}
                      >
                        <p className={styles.reasoningQuestion}>
                          {lastItemWithS3.reasoningQues}
                        </p>
                      </HoverInfoTooltip>
                      {lastItemWithS3.s3_file !== '' &&
                      chatbotUtils.isS3FileValid(lastItemWithS3.s3_file) !==
                        '' ? (
                        <React.Fragment>
                          <HoverInfoTooltip
                            title={
                              openTableIndex === lastItemIndex
                                ? 'Minimize Table'
                                : 'Expand Table'
                            }
                            position={TooltipPlacement.Top}
                          >
                            {isExpanded ? (
                              <CaretRightIcon
                                onClick={() => {
                                  toggleInlineTable(
                                    lastItemWithS3.s3_file,
                                    lastItemIndex
                                  );
                                }}
                                className={`${styles.tableToggleArrow} ${
                                  openTableIndex === lastItemIndex || isLoading
                                    ? styles.openTable
                                    : ''
                                }`}
                                size={'1.6rem'}
                              />
                            ) : (
                              <div
                                onClick={() => {
                                  toggleTable(
                                    lastItemWithS3.s3_file,
                                    lastItemIndex
                                  );
                                }}
                                className={styles.tableOpenButton}
                              >
                                <ArrowsOutIcon size={'2.4rem'} />
                              </div>
                            )}
                          </HoverInfoTooltip>
                          <Dialog
                            open={isTableOpen}
                            onClose={() => toggleTable('')}
                            maxWidth="lg"
                            sx={{
                              '& .MuiDialog-paper': {
                                minWidth: '50rem',
                                padding: '0',
                                borderRadius: '0.4rem',
                              },
                            }}
                          >
                            {selectedDialogIndex !== null && (
                              <DialogTitle
                                sx={{
                                  background: '#77469b',
                                  padding: '1rem',
                                  width: '100%',
                                  color: 'white',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  gap: '1rem',
                                  alignItems: 'center',
                                  borderRadius: '0rem',
                                }}
                              >
                                <div>
                                  <span>
                                    {
                                      response?.data?.[selectedDialogIndex]
                                        ?.reasoningQues
                                    }
                                  </span>
                                </div>
                                <div
                                  style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'center',
                                  }}
                                >
                                  <DownloadTableButton
                                    squareDimension="2.4rem"
                                    hoverInfoText="Download"
                                    filename={
                                      lastItemWithS3?.reasoningQues || 'data'
                                    }
                                    data={[]}
                                    handleDownload={stableDownloadHandler}
                                    downloadOptionsRequired={false}
                                    iconButton={true}
                                  />
                                  <XIcon
                                    size={'1.6rem'}
                                    weight="bold"
                                    color="white"
                                    style={{
                                      cursor: 'pointer',
                                    }}
                                    onClick={() => {
                                      toggleTable('');
                                    }}
                                  />
                                </div>
                              </DialogTitle>
                            )}

                            <DialogContent
                              sx={{
                                padding: '0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                minHeight: '10rem',
                                maxHeight: '50rem',
                                ...fancyScrollbar,
                              }}
                            >
                              {tableData.length === 0 ? (
                                <CircularProgress sx={{ color: '#77469b' }} />
                              ) : (
                                <GenericTable data={tableData} />
                              )}
                            </DialogContent>
                          </Dialog>
                          <DownloadTableButton
                            squareDimension="2.4rem"
                            hoverInfoText="Download"
                            filename={lastItemWithS3?.reasoningQues || 'data'}
                            data={[]}
                            handleDownload={stableDownloadHandler}
                            downloadOptionsRequired={false}
                          />
                        </React.Fragment>
                      ) : isCallCompleted === false ? (
                        <CircularProgress
                          size="2rem"
                          sx={{
                            color: '#77469b',
                            flex: '0 0 auto',
                          }}
                        />
                      ) : null}
                    </div>
                    <span
                      style={{
                        maxWidth: '100%',
                      }}
                    >
                      {isExpanded && openTableIndex === lastItemIndex && (
                        <div>
                          <GenericTable
                            data={tableDataMap[lastItemIndex]}
                            isLoading={isLoading}
                          />
                        </div>
                      )}
                    </span>
                  </React.Fragment>
                )}
              </div>
            ) : null}
            {isGraphAvailable &&
            isCallCompleted === false &&
            response?.chartData?.length === 0 ? (
              <ThinkingIndicator statusText={statusText} />
            ) : processedChartData.length > 0 ? (
              processedChartData.map((chart, index) => {
                if (isExpanded)
                  return PlotlyComponent(index, chart, 1.4, false, true);
                return (
                  <React.Fragment>
                    <div
                      onClick={toggleGraph}
                      style={{
                        width: '24rem',
                      }}
                    >
                      <span
                        style={{
                          position: 'relative',
                        }}
                      >
                        <GraphHoverClick />
                        {PlotlyComponent(index, chart, 0.8, isGraphOpen)}
                      </span>
                    </div>

                    <Dialog
                      open={isGraphOpen}
                      onClose={toggleGraph}
                      maxWidth="lg"
                      sx={{
                        '& .MuiDialog-paper': {
                          width: '100rem',
                        },
                      }}
                    >
                      <DialogContent>
                        {PlotlyComponent(index, chart, 1, isGraphOpen)}
                      </DialogContent>
                    </Dialog>
                  </React.Fragment>
                );
              })
            ) : null}

            {response?.previewData &&
              isStopped === false &&
              isChatbotLoading === true &&
              response.previewData.isPreviewLoading === true && (
                <div className={styles.reportLoader}>
                  <CircularProgress size="4rem" sx={{ color: '#77469b' }} />
                  <span style={{ fontSize: '14px', color: '#464646' }}>
                    Generating report...
                  </span>
                </div>
              )}

            {((response?.previewData &&
              response?.previewData.previewPanelLink) ||
              previewHTMLLinks[0]?.reportTitle ||
              previewHTMLLinks[0]?.s3_file) && (
              <div
                className={`${styles.reportResponse} ${
                  isExpanded ? styles.expanded : ''
                }`}
                onClick={() => {
                  if (isExpanded === false) return;
                  handleOpenPreviewPanel(
                    response?.previewData?.previewPanelLink ??
                      previewHTMLLinks[0]?.s3_file
                  );
                }}
              >
                <HoverInfoTooltip
                  title={
                    response?.previewData?.previewPanelLink ??
                    previewHTMLLinks[0]?.reportTitle ??
                    'Report'
                  }
                  position={TooltipPlacement.Bottom}
                >
                  <React.Fragment>
                    <ChartBarIcon size={'3rem'} weight="light" />
                    <p className={styles.reportTitle}>
                      {chatbotUtils.getReportName(
                        response?.previewData?.reportTitle,
                        previewHTMLLinks[0]?.reportTitle
                      )}
                    </p>
                  </React.Fragment>
                </HoverInfoTooltip>
                {isExpanded === false && (
                  <span className={styles.reportDownloadButton}>
                    <ArrowsOutIcon
                      size={'2rem'}
                      onClick={() => {
                        handleOpenPreviewPanel(
                          response?.previewData?.previewPanelLink ??
                            previewHTMLLinks[0]?.s3_file
                        );
                      }}
                    />
                  </span>
                )}
              </div>
            )}

            {response?.summary ? (
              SummaryRenderer(response.summary)
            ) : !isCallCompleted ? (
              <span
                className={styles.loader}
                style={{
                  justifyContent: 'start',
                }}
              >
                <ThinkingIndicator statusText={statusText} />
              </span>
            ) : null}
            {ENABLE_CAMPAIGN_EDIT_API &&
              isLastMessageOfLastChat &&
              isCallCompleted &&
              response?.data?.some(
                (d) => d.tool_used === AnarixLLMToolEnum.EDIT_CAMPAIGNS
              ) && (
                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    marginTop: '1rem',
                    justifyContent: 'flex-end',
                  }}
                >
                  <SecondaryButton
                    buttonText="Cancel"
                    width="auto"
                    height="2.5rem"
                    fontSize="1.1rem"
                    borderRadius="0.8rem"
                    buttonFunction={handleCancel}
                    disabled={isApproving || isApproved}
                    hoverColor="#F12835"
                  />
                  <div
                    style={{
                      borderRadius: '0.8rem',
                      overflow: 'hidden',
                    }}
                  >
                    <PrimaryButton
                      bgColor="linear-gradient(99.66deg, #6205A7 4.77%, #894DB5 95.21%);"
                      buttonText={
                        isLoadingApproving ? 'Approving...' : 'Approve'
                      }
                      width="auto"
                      height="2.5rem"
                      fontSize="1.1rem"
                      buttonFunction={handleApprove}
                      disabled={isLoadingApproving}
                    />
                  </div>
                </div>
              )}
          </div>
          <ChatbotFeedback
            messageID={messageID}
            sessionId={sessionId}
            feedback={feedback}
            isCallCompleted={isCallCompleted}
            isHistoryLoaded={isHistoryLoaded}
            isChatbotLoading={isChatbotLoading}
            updateFeedback={updateFeedback}
            hasContent={
              !!(response?.data || response?.chartData || response?.summary)
            }
            contentToCopy={response?.summary || insightData?.summary || ''}
          />
        </div>
      </div>
    </div>
  );
};

function PlotlyComponent(
  index: number,
  chart: PlotParams | null,
  fontSize: number,
  isGraphOpen?: boolean,
  isExpanded = false
) {
  if (chart === null) return null;
  return (
    <div
      className={`${isExpanded ? styles.chartContainer : ''}`}
      key={`chart_${index}`}
      id={`chart_${index}`}
      onClick={(e) => {
        if (isGraphOpen) e.stopPropagation();
      }}
    >
      <Plot
        {...chart}
        data={chart.data}
        layout={{
          ...chart.layout,
          hoverlabel: {
            align: 'auto',
            font: {
              size: remToPx(0.9),
            },
          },
          height: NaN,
          width: NaN,
          bargap: 0.5,
          xaxis: {
            visible: !(chart.data[0] as PlotData).x.some(
              (item) => `${item}`.length > 20
            ),
            domain: [0.078, 0.85],
            //hiding x-axis labels when anyone label's length exceeds 15
          },
          yaxis: {
            ...chart.layout.yaxis,
            autorange: true,
            title: {
              text: chart.layout.yaxis?.title?.text || '',
              standoff: 0,
            },
            side: 'left',
            position: 0,
          },
          yaxis2: {
            ...chart.layout.yaxis2,
            autorange: true,
            title: {
              text: chart.layout.yaxis2?.title?.text || '',
              standoff: 0,
            },
            overlaying: 'y',
            side: 'right',
            position: chart.layout.yaxis3 ? 0.92 : 1,
            showgrid: false,
            automargin: true,
          },
          yaxis3: {
            ...chart.layout.yaxis3,
            autorange: true,
            title: {
              text: chart.layout.yaxis3?.title?.text || '',
              standoff: 0,
            },
            overlaying: 'y',
            side: 'right',
            position: 1.0,
            showgrid: false,
            automargin: true,
          },
          yaxis4: {
            ...chart.layout.yaxis4,
            autorange: true,
            title: {
              text: chart.layout.yaxis4?.title?.text || '',
              standoff: 0,
            },
            side: 'left',
            position: 0.08,
            showgrid: false,
          },
          autosize: true,
          title: {
            ...chart.layout.title,
            text: chart.layout.title?.text,
            font: {
              size: remToPx(
                chart.layout.title?.text &&
                  chart.layout.title?.text?.length > 73
                  ? fontSize
                  : 1.2
              ),
            },
          },
          legend: {
            ...chart.layout.legend,
            y: -0.1,
            x: 0.45,
          },
        }}
        config={{
          ...chart.config,
          responsive: false,
          modeBarButtons: [
            [
              'toImage',
              'pan2d',
              'zoom2d',
              'autoScale2d',
              'zoomIn2d',
              'zoomOut2d',
            ],
          ],
          displaylogo: false,
          toImageButtonOptions: {
            ...chart.config?.toImageButtonOptions,
            filename: `${chart.layout.title?.text || 'chart'}`,
            format: 'png',
            scale: 3,
          },
        }}
        useResizeHandler={true}
        style={{
          ...chart.style,
          width: '100%',
        }}
      />
    </div>
  );
}

function HistoryConversation({
  historyChatData,
  isHistoryLoading,
  isChatbotLoading,
  isExpanded,
  sessionId,
  isHistorySession,
  updateFeedback,
  sendUserMessage,
}: IHistoryConversationProps) {
  const reduxInsights = useAppSelector(selectInsightsData);
  const isPreviewOpen = useAppSelector(selectIsPreviewOpen);
  useEffect(() => {
    const lastIdx = historyChatData.length - 1;
    if (lastIdx >= 0) {
      const element = document.getElementById(String(lastIdx));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [historyChatData.length, isHistoryLoading]);

  const insightMessage = useMemo(
    () => historyChatData.find((msg) => msg.insight),
    [historyChatData]
  );
  const parsedInsight = useMemo(
    () =>
      insightMessage
        ? chatbotUtils.parseInsightFromHistory(insightMessage, reduxInsights)
        : undefined,
    [insightMessage, reduxInsights]
  );

  const hasAskedQuestionAfterInsight = useMemo(
    () => chatbotUtils.hasQuestionsAfterInsight(historyChatData),
    [historyChatData]
  );
  if (isHistoryLoading) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress size={'5rem'} sx={{ color: '#77469b' }} />
      </div>
    );
  }
  if (historyChatData.length === 0 && !isHistoryLoading) {
    return (
      <h1 className={styles.noData}>
        {historyChatData.length === 0
          ? 'No conversation history found'
          : 'Select a conversation'}
      </h1>
    );
  }

  return (
    <div
      className={styles.chatbotResponseContainer}
      style={{
        height: isExpanded ? '100%' : '90%',
      }}
    >
      <div className={styles.conversationContainer}>
        {parsedInsight && (
          <div className={styles.chatContainer}>
            <BotMessage
              isGraphAvailable={false}
              response={undefined}
              isCallCompleted={true}
              isHistoryLoaded={isHistorySession}
              isChatbotLoading={false}
              isExpanded={isExpanded}
              updateFeedback={updateFeedback}
              isLastMessageOfLastChat={false}
              messageID={insightMessage?.message_id || ''}
              sessionId={sessionId}
              feedback={insightMessage?.thumbs_up_down}
              isStopped={false}
              insightData={parsedInsight}
              isInsightMessage={true}
              isError={false}
              sendUserMessage={sendUserMessage}
              isTableLocked={hasAskedQuestionAfterInsight}
            />
          </div>
        )}

        {historyChatData.map((history, historyIdx) => (
          <div
            key={`${history.message_id}-${historyIdx}`}
            id={String(historyIdx)}
            className={styles.chatContainer}
          >
            {history.question && (
              <UserMessage message={history.question} isExpanded={isExpanded} />
            )}
            <BotMessage
              history={history}
              isGraphAvailable={history.isGraphDataAvailable}
              response={history.response}
              isCallCompleted={history.isCallCompleted}
              isHistoryLoaded={isHistorySession}
              isChatbotLoading={isChatbotLoading}
              isExpanded={isExpanded}
              updateFeedback={updateFeedback}
              isLastMessageOfLastChat={
                historyIdx === historyChatData.length - 1 &&
                history.response?.data?.length
                  ? true
                  : false
              }
              messageID={history.message_id}
              sessionId={sessionId}
              feedback={history.thumbs_up_down}
              isStopped={history.isStopped}
              insightData={undefined}
              isInsightMessage={false}
              isError={chatbotUtils.shouldShowMessageError(
                history,
                isChatbotLoading,
                isHistoryLoading
              )}
              sendUserMessage={sendUserMessage}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryRenderer(summary: string) {
  const cleanSummary = chatbotUtils.cleanSummary(summary);

  if (!cleanSummary) return null;

  const hasTableFormat = cleanSummary.includes('|');

  if (hasTableFormat) {
    return (
      <div
        className={styles.markdown}
        dangerouslySetInnerHTML={{
          __html: marked.parse(chatbotUtils.formatMarkdown(cleanSummary)),
        }}
      />
    );
  }

  return (
    <ReactMarkdown className={styles.markdown}>
      {chatbotUtils.formatMarkdown(cleanSummary)}
    </ReactMarkdown>
  );
}
export default HistoryConversation;
