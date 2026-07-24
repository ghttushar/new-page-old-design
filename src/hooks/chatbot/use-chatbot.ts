import {
  CHATBOT_RESPONSE_FORMAT,
  SAMPLE_PROMPT_MAPPING,
} from '@/constants/chatbot.constants';
import { JIVA_PAGE_URL } from '@/constants/urls.constants';
import { FeaturesEnum } from '@/enums/auth.enums';
import {
  AnarixLLMToolEnum,
  FeedBackEnum,
  JIVAViewTypeEnum,
} from '@/enums/chatbot.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { IUser } from '@/interfaces/auth.interfaces';
import {
  IChatbotHistoryMetadata,
  IInsightsAction,
  IJIVAInsights,
  IParsedChatHistoryResponse,
  IStopMessagePayload,
} from '@/interfaces/chatbot.interface';
import {
  addMessage,
  removeInsight,
  resetPreviewPanel,
  selectActiveSessionId,
  selectActiveSessionMessages,
  selectChatbotSessions,
  selectChatbotState,
  selectInsightsData,
  selectViewType,
  setActiveSession,
  setIsPreviewOpen,
  setPreviewPanelLoading,
  setPreviewPanelUrl,
  setSessionMessages,
  setSessions,
  setViewType,
  updateMessage,
} from '@/redux/chatbot/chatbot.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import {
  selectAdvertisingAccount,
  selectIsChatbotOpen,
  selectUser,
} from '@/redux/slices/auth/auth.slice';
import chatbotServices from '@/services/bidder/llm-chatbot/chatbot.service';
import { generateRandomID } from '@/utils';
import { checkIsNull, convertToTitleCase } from '@/utils/advertising.utils';
import chatbotUtils from '@/utils/chatbot.utils';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import navigationUtils from '@/utils/navigation/navigation.utils';
import { useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

interface UseChatbotOptions {
  enableInsights?: boolean;
  urlSync?: boolean;
  onToolCall?: (toolType: string, data?: any) => void;
}

interface UseChatbotReturn {
  messages: IParsedChatHistoryResponse[];
  sessions: IChatbotHistoryMetadata[];
  activeSessionId: string;
  inputValue: string;
  isLoading: boolean;
  isHistoryLoading: boolean;
  viewType: JIVAViewTypeEnum;
  user: IUser | null;
  hasAdvertisingAccounts: boolean;
  samplePrompts: string[];
  insights: IJIVAInsights[];
  setInputValue: (value: string) => void;
  sendMessage: (message: string) => Promise<void>;
  stopMessage: () => void;
  selectSession: (id: string) => void;
  startNewChat: () => void;
  toggleView: () => void;
  updateFeedback: (message_id: string, value: FeedBackEnum) => void;
  removeInsight: (index: number) => void;
  handleInsightChat: (insight: IJIVAInsights) => void;
  handleInsightAction: (
    insight: IJIVAInsights,
    action: IInsightsAction,
    jivaText: string
  ) => void;
}

interface IStreamProcessingState {
  summary: string;
  captureSummaryText: boolean;
  isStreamStarted: boolean;
  isToolCallSeen: boolean;
  isToolResultSeen: boolean;
  hasAnyToolCall: boolean;
  currQuesId: string;
  sessionId: string;
}

export const useChatbot = (
  options: UseChatbotOptions = {}
): UseChatbotReturn => {
  const { enableInsights = false, urlSync = false, onToolCall } = options;

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const user = useAppSelector(selectUser);
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);
  const activeSessionId = useAppSelector(selectActiveSessionId);
  const sessions = useAppSelector(selectChatbotSessions);
  const messages = useAppSelector(selectActiveSessionMessages);
  const insightsData = useAppSelector(selectInsightsData);
  const viewType = useAppSelector(selectViewType);
  const chatbotState = useAppSelector(selectChatbotState);
  const isChatbotOpen = useAppSelector(selectIsChatbotOpen);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentInsight, setCurrentInsight] = useState<IJIVAInsights | null>(
    null
  );

  const [isInsightChat, setIsInsightChat] = useState(false);
  const [hasAskedFirstInsightQuestion, setHasAskedFirstInsightQuestion] =
    useState(false);

  const accountId = localStorageUtils.getAccountId();
  const accountDetails = localStorageUtils.getAccountDetails();
  const selectedUserAccountMapping =
    localStorageUtils.getSelectedUserAccountMapping();

  const activeStreamRef = useRef<{
    sessionId: string;
    messageId: string;
  } | null>(null);

  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const hasAdvertisingAccounts = useMemo(() => {
    return !!localStorageUtils
      .getAvailableAccounts()
      .filter((acct) => acct?.advertising).length;
  }, []);

  const marketplace = useMemo(
    () => selectedAdvertisingAccount.marketplace ?? MarketplaceEnum.AMAZON,
    [selectedAdvertisingAccount.marketplace]
  );

  const shouldMakeCall =
    hasAdvertisingAccounts &&
    checkIsNull(accountId) === false &&
    isChatbotOpen &&
    navigationUtils.canAccessFeature(
      accountDetails,
      selectedUserAccountMapping,
      FeaturesEnum.JIVA_CHATBOT
    );

  useEffect(() => {
    if (urlSync) {
      const newParams = new URLSearchParams(searchParams);
      if (activeSessionId) {
        newParams.set('session', activeSessionId);
      } else {
        newParams.delete('session');
      }
      setSearchParams(newParams, { replace: true });
    }
  }, [urlSync, activeSessionId, searchParams, setSearchParams]);

  const fetchHistoryChatById = useAppQuery({
    queryKey: [QueryKeyEnums.HISTORY_CHAT_DATA_FETCH, activeSessionId],
    queryFn: ({ signal }) => {
      return chatbotServices.getHistoryChatById(
        activeSessionId,
        marketplace,
        signal
      );
    },
    enabled:
      Boolean(activeSessionId) &&
      checkIsNull(chatbotState.messages[activeSessionId]) &&
      shouldMakeCall,
    options: {
      refetchOnMount: true,
      retry: 1,
    },
  });

  useEffect(() => {
    if (!fetchHistoryChatById.data) return;

    const serverMessages = fetchHistoryChatById.data.data.data || [];
    const localMessages = chatbotState.messages[activeSessionId] || [];

    if (checkIsNull(localMessages)) {
      dispatch(
        setSessionMessages({
          messages: serverMessages,
          sessionId: activeSessionId,
        })
      );
      return;
    }

    const serverById = new Map(serverMessages.map((m) => [m.message_id, m]));
    const localById = new Map(localMessages.map((m) => [m.message_id, m]));

    const merged = serverMessages.map((serverMsg) => {
      const localMsg = localById.get(serverMsg.message_id);
      if (!localMsg) return serverMsg;

      const hasLocal = chatbotUtils.hasResponseContent(localMsg.response);
      const hasServer = chatbotUtils.hasResponseContent(serverMsg.response);

      return !hasLocal && hasServer ? { ...localMsg, ...serverMsg } : localMsg;
    });

    const localOnly = localMessages.filter(
      (m) => !serverById.has(m.message_id)
    );
    const mergedMessages = [...merged, ...localOnly];

    const unchanged =
      mergedMessages.length === localMessages.length &&
      mergedMessages.every(
        (m, i) => m.message_id === localMessages[i]?.message_id
      );

    if (unchanged) return;

    dispatch(
      setSessionMessages({
        messages: mergedMessages,
        sessionId: activeSessionId,
      })
    );
  }, [
    fetchHistoryChatById.data,
    activeSessionId,
    chatbotState.messages,
    dispatch,
  ]);

  const { mutateAsync: stopMessageMutation } = useAppMutation({
    mutationFn: async (payload: IStopMessagePayload) => {
      return chatbotServices.stopMessage(payload);
    },
    options: {
      onSettled() {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.HISTORY_CHAT_DATA_FETCH],
        });
      },
    },
  });

  const updateHistoryForQuestion = useCallback(
    (
      updater: (item: IParsedChatHistoryResponse) => IParsedChatHistoryResponse,
      message_id: string,
      sessionId: string = activeSessionId
    ) => {
      dispatch(
        updateMessage({
          sessionId,
          messageId: message_id,
          updater,
        })
      );
    },
    [dispatch, activeSessionId]
  );

  const handleOnStreamRead = (
    rawChunk: string,
    streamState: IStreamProcessingState
  ) => {
    if (rawChunk === '') return;
    const cleanChunk = rawChunk.replace(CHATBOT_RESPONSE_FORMAT, '').trim();
    if (!cleanChunk) return;

    const { chunk, isToolChunk } = chatbotUtils.processStreamChunk(cleanChunk);
    const ref = streamState;

    if (chatbotUtils.isStreamStart(chunk)) {
      ref.isStreamStarted = true;
      ref.isToolCallSeen = false;
      ref.isToolResultSeen = false;
      ref.hasAnyToolCall = false;
      ref.captureSummaryText = false;
      ref.summary = '';
    }

    if (chatbotUtils.isToolCall(chunk)) {
      ref.isToolCallSeen = true;
      ref.hasAnyToolCall = true;
      ref.captureSummaryText = false;

      if (chatbotUtils.isPlotlyCall(chunk)) {
        updateHistoryForQuestion(
          (item) => ({ ...item, isGraphDataAvailable: true }),
          ref.currQuesId,
          ref.sessionId
        );
      } else if (chatbotUtils.isReportOrVisualizationTool(chunk)) {
        const extractedQues = chatbotUtils.extractQuesFromToolCall(chunk);
        if (extractedQues) {
          if (chatbotUtils.isInteractiveReportTool(extractedQues.tool_used)) {
            dispatch(setPreviewPanelLoading(true));
          }
        }
      } else if (
        chunk.includes(AnarixLLMToolEnum.GET_INTERACTIVE_REPORT_INSTRUCTIONS) ||
        chunk.includes(AnarixLLMToolEnum.GET_VISUALIZATION_INSTRUCTIONS)
      ) {
        updateHistoryForQuestion(
          (item) => {
            const existingData = item.response?.data || [];
            return {
              ...item,
              response: {
                ...item.response,
                data: [...existingData],
                previewData: {
                  ...item.response?.previewData,
                  isPreviewLoading: true,
                },
              },
            };
          },
          ref.currQuesId,
          ref.sessionId
        );
      } else {
        const extractedQues = chatbotUtils.extractQuesFromToolCall(chunk);
        const reasoningQues = {
          reasoningQues:
            extractedQues?.latest_question ??
            (extractedQues?.summary_of_function_call || ''),
          s3_file: '',
          step_number: extractedQues?.step_number || '',
          tool_used: extractedQues?.tool_used,
        };

        updateHistoryForQuestion(
          (item) => {
            const existingData = item.response?.data || [];
            return {
              ...item,
              response: {
                ...item.response,
                data: [...existingData, reasoningQues],
                previewPanelLink: '',
              },
            };
          },
          ref.currQuesId,
          ref.sessionId
        );
      }
    } else if (chatbotUtils.isToolResult(chunk)) {
      try {
        ref.isToolResultSeen = true;
        ref.captureSummaryText = true;

        const responseData = chatbotUtils.parseToolCallResponse(chunk);
        if (chatbotUtils.isPlotlyErrResponse(chunk)) {
          updateHistoryForQuestion(
            (item) => ({ ...item, isGraphDataAvailable: false }),
            ref.currQuesId,
            ref.sessionId
          );
        }
        if (!responseData) return;

        const s3_file = chatbotUtils.isRawResponse(responseData)
          ? responseData.s3_file || responseData.final_s3_file || ''
          : '';

        if (s3_file && chatbotUtils.isHtmlFile(s3_file)) {
          const reportTitle = chatbotUtils.isRawResponse(responseData)
            ? responseData?.report_title ?? responseData?.visualization_title
            : '';
          updateHistoryForQuestion(
            (item) => {
              if (item.message_id !== ref.currQuesId) return item;
              return {
                ...item,
                isCallCompleted: false,
                response: {
                  ...(item.response ?? {}),
                  previewData: {
                    isPreviewLoading: false,
                    previewPanelLink: s3_file,
                    reportTitle,
                  },
                },
              };
            },
            ref.currQuesId,
            ref.sessionId
          );
          dispatch(setPreviewPanelUrl(s3_file));
          dispatch(setIsPreviewOpen(true));
        }

        const step_number = chatbotUtils.isRawResponse(responseData)
          ? responseData.step_number ?? ''
          : '';
        const chartData = chatbotUtils.isPlotlyJson(responseData)
          ? [responseData]
          : [];

        updateHistoryForQuestion(
          (item) => {
            if (item.message_id !== ref.currQuesId) return item;
            const oldData = item.response?.data ?? [];
            const oldChartData = item.response?.chartData ?? [];
            const newData = oldData.map((entry) =>
              entry.step_number === step_number ? { ...entry, s3_file } : entry
            );

            return {
              ...item,
              isCallCompleted: false,
              response: {
                ...(item.response ?? {}),
                data: newData,
                chartData: oldChartData.concat(chartData),
              },
            };
          },
          ref.currQuesId,
          ref.sessionId
        );
      } catch (error) {
        console.error('Error processing tool result:', error);
      }
    } else if (chatbotUtils.isImplicitToolChunk(chunk)) {
      try {
        ref.isToolCallSeen = true;
        ref.hasAnyToolCall = true;
        ref.isToolResultSeen = true;
        ref.captureSummaryText = true;

        const responseData = JSON.parse(chunk);
        const reasoningQues = {
          reasoningQues:
            responseData.summary_of_function_call ||
            responseData.tool_used ||
            'Analysis',
          s3_file: responseData.s3_file || '',
          step_number: responseData.step_number || '',
          tool_used: responseData.tool_used,
        };

        updateHistoryForQuestion(
          (item) => {
            const existingData = item.response?.data || [];
            return {
              ...item,
              isCallCompleted: false,
              response: {
                ...(item.response ?? {}),
                data: [...existingData, reasoningQues],
              },
            };
          },
          ref.currQuesId,
          ref.sessionId
        );
      } catch (error) {
        console.error('Error processing implicit tool chunk:', error);
      }
    } else {
      if (chatbotUtils.isStreamEnd(chunk)) {
        if ((ref.isToolResultSeen || !ref.hasAnyToolCall) && ref.summary) {
          updateHistoryForQuestion(
            (item) =>
              item.message_id === ref.currQuesId
                ? {
                    ...item,
                    response: {
                      ...(item.response ?? {}),
                      summary: ref.summary,
                    },
                  }
                : item,
            ref.currQuesId,
            ref.sessionId
          );
        }

        ref.captureSummaryText = false;
        ref.isStreamStarted = false;
        ref.isToolCallSeen = false;
        ref.isToolResultSeen = false;
        ref.hasAnyToolCall = false;
      }

      if (
        ref.isStreamStarted &&
        chatbotUtils.isValidSummary(chunk) &&
        ((ref.captureSummaryText && ref.isToolResultSeen) ||
          (!ref.hasAnyToolCall && !ref.isToolCallSeen))
      ) {
        if (
          !isToolChunk &&
          !chatbotUtils.isOrchestratorJSON(chunk) &&
          !chatbotUtils.shouldFilterStreamLine(chunk)
        ) {
          const textParts = chatbotUtils.isValidSummary(chunk) ? chunk : '';
          ref.summary += textParts;

          updateHistoryForQuestion(
            (item) =>
              item.message_id === ref.currQuesId
                ? {
                    ...item,
                    response: {
                      ...(item.response ?? {}),
                      summary: ref.summary,
                    },
                  }
                : item,
            ref.currQuesId,
            ref.sessionId
          );
        }
      }
    }
  };

  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim()) return;

      const newQuesId = generateRandomID();
      const messageSessionId = activeSessionId;
      const streamState: IStreamProcessingState = {
        summary: '',
        captureSummaryText: false,
        isStreamStarted: false,
        isToolCallSeen: false,
        isToolResultSeen: false,
        hasAnyToolCall: false,
        currQuesId: newQuesId,
        sessionId: messageSessionId,
      };

      try {
        const isFirstUserQuestion =
          isInsightChat && !hasAskedFirstInsightQuestion;

        dispatch(
          addMessage({
            sessionId: messageSessionId,
            message: {
              question: messageText,
              isError: false,
              isCallCompleted: false,
              message_id: newQuesId,
              is_insight_initial_question: false,
              insight: currentInsight || undefined,
              is_insight_stream: isInsightChat,
            },
          })
        );

        const existingMessages = chatbotState.messages[messageSessionId];
        if (!existingMessages || existingMessages.length === 0) {
          const newSession: IChatbotHistoryMetadata = {
            first_question: messageText,
            session_id: messageSessionId,
            title: convertToTitleCase(messageText),
            last_access: moment().format(),
            tools_used: [],
          };
          const updatedSessions = [newSession, ...sessions];
          dispatch(setSessions(updatedSessions));
        }

        if (isFirstUserQuestion) {
          setHasAskedFirstInsightQuestion(true);
        }

        let insightString = '';
        if (currentInsight) {
          insightString = currentInsight.hidden_insight_text || '';
        }

        const insightPayload = isInsightChat
          ? {
              is_insight_initial_question: isFirstUserQuestion,
              insight: insightString,
              is_insight_stream: true,
              insight_frontend_uri:
                currentInsight?.uploaded_frontend_s3_url || '',
              insight_backend_uri: currentInsight?.uploaded_s3_url || '',
            }
          : undefined;

        setIsLoading(true);
        activeStreamRef.current = {
          sessionId: messageSessionId,
          messageId: newQuesId,
        };

        await chatbotServices.sendPrompt(
          messageText,
          messageSessionId,
          marketplace,
          newQuesId,
          (chunk: string) => handleOnStreamRead(chunk, streamState),
          insightPayload
        );

        setIsLoading(false);
        if (activeStreamRef.current?.messageId === newQuesId) {
          activeStreamRef.current = null;
        }
        updateHistoryForQuestion(
          (item) => {
            if (item.message_id === newQuesId) {
              return { ...item, isError: false, isCallCompleted: true };
            }
            return item;
          },
          newQuesId,
          messageSessionId
        );
      } catch (err) {
        setIsLoading(false);
        if (activeStreamRef.current?.messageId === newQuesId) {
          activeStreamRef.current = null;
        }
        updateHistoryForQuestion(
          (item) => {
            if (item.message_id === newQuesId) {
              return { ...item, isError: true, isCallCompleted: true };
            }
            return item;
          },
          newQuesId,
          messageSessionId
        );
      }
    },
    [
      activeSessionId,
      currentInsight,
      dispatch,
      hasAskedFirstInsightQuestion,
      isInsightChat,
      marketplace,
      sessions,
      chatbotState.messages,
      updateHistoryForQuestion,
    ]
  );

  const stopMessage = useCallback(() => {
    const sessionId = activeStreamRef.current?.sessionId || activeSessionId;
    const messageId =
      activeStreamRef.current?.messageId ||
      messagesRef.current[messagesRef.current.length - 1]?.message_id;
    if (!messageId || !sessionId) return;

    updateHistoryForQuestion(
      (item) => ({ ...item, isStopped: true }),
      messageId,
      sessionId
    );

    stopMessageMutation({
      marketplace: marketplace,
      message_id: messageId,
      session_id: sessionId,
    });

    setIsLoading(false);
    activeStreamRef.current = null;
  }, [
    activeSessionId,
    marketplace,
    stopMessageMutation,
    updateHistoryForQuestion,
  ]);

  const selectSession = useCallback(
    (id: string) => {
      dispatch(setActiveSession(id));
      navigate(`${JIVA_PAGE_URL}?session=${id}`);
    },
    [dispatch]
  );

  const startNewChat = useCallback(() => {
    const newSessionId = generateRandomID();
    dispatch(setActiveSession(newSessionId));
    dispatch(resetPreviewPanel());
    setCurrentInsight(null);
    setIsInsightChat(false);
    setHasAskedFirstInsightQuestion(false);
    setInputValue('');

    if (urlSync) {
      navigate(JIVA_PAGE_URL);
    }
  }, [dispatch, navigate, urlSync]);

  const toggleView = useCallback(() => {
    if (!enableInsights) return;

    const newView =
      viewType === JIVAViewTypeEnum.CHATBOT
        ? JIVAViewTypeEnum.INSIGHTS
        : JIVAViewTypeEnum.CHATBOT;
    dispatch(setViewType(newView));
  }, [enableInsights, viewType, dispatch]);

  const updateFeedback = useCallback(
    (message_id: string, value: FeedBackEnum) => {
      updateHistoryForQuestion(
        (item) => ({ ...item, thumbs_up_down: value }),
        message_id
      );
    },
    [updateHistoryForQuestion]
  );

  const removeInsightAction = useCallback(
    (index: number) => {
      dispatch(removeInsight(index));
    },
    [dispatch]
  );

  const handleInsightChat = useCallback(
    (insight: IJIVAInsights) => {
      setCurrentInsight(insight);
      setIsInsightChat(true);
      dispatch(setViewType(JIVAViewTypeEnum.CHATBOT));
      setHasAskedFirstInsightQuestion(false);

      const newSessionId = generateRandomID();
      const newSession: IChatbotHistoryMetadata = {
        first_question: `Insight: ${insight.title}`,
        session_id: newSessionId,
        title: insight.title,
        last_access: moment().format(),
        tools_used: [],
      };

      const insightMessage = {
        question: '',
        isError: false,
        isCallCompleted: true,
        message_id: generateRandomID(),
        is_insight_initial_question: true,
        insight: insight,
        is_insight_stream: false,
        response: {},
      };

      dispatch(
        setSessionMessages({
          messages: [insightMessage],
          sessionId: newSessionId,
        })
      );

      const updatedSessions = [newSession, ...sessions];
      dispatch(setSessions(updatedSessions));
      dispatch(setActiveSession(newSessionId));
    },
    [dispatch, sessions]
  );

  const handleInsightAction = useCallback(
    (insight: IJIVAInsights, action: IInsightsAction, jivaText: string) => {
      setCurrentInsight(insight);
      setIsInsightChat(true);
      dispatch(setViewType(JIVAViewTypeEnum.CHATBOT));
      setHasAskedFirstInsightQuestion(false);

      const newSessionId = generateRandomID();
      const newSession: IChatbotHistoryMetadata = {
        first_question: `Action: ${action.user_text}`,
        session_id: newSessionId,
        title: action.label,
        last_access: moment().format(),
        tools_used: [],
      };

      const insightMessage = {
        question: '',
        isError: false,
        isCallCompleted: true,
        message_id: generateRandomID(),
        is_insight_initial_question: true,
        insight: insight,
        is_insight_stream: false,
        response: {},
      };

      const userMessage = {
        question: action.user_text,
        isError: false,
        isCallCompleted: true,
        message_id: generateRandomID(),
        is_insight_initial_question: false,
        insight: insight,
        is_insight_stream: true,
        response: { summary: jivaText },
      };

      dispatch(
        setSessionMessages({
          messages: [insightMessage, userMessage],
          sessionId: newSessionId,
        })
      );

      dispatch(setActiveSession(newSessionId));
      const updatedSessions = [newSession, ...sessions];
      dispatch(setSessions(updatedSessions));
    },
    [dispatch, sessions]
  );

  const samplePrompts = useMemo(() => {
    return SAMPLE_PROMPT_MAPPING[marketplace] ?? [];
  }, [marketplace]);

  return {
    messages,
    sessions,
    activeSessionId,
    inputValue,
    isLoading,
    isHistoryLoading: fetchHistoryChatById.isLoading,
    viewType,
    user,
    hasAdvertisingAccounts,
    samplePrompts,
    insights: insightsData,
    setInputValue,
    sendMessage,
    stopMessage,
    selectSession,
    startNewChat,
    toggleView,
    updateFeedback,
    removeInsight: removeInsightAction,
    handleInsightChat,
    handleInsightAction,
  };
};

export default useChatbot;
