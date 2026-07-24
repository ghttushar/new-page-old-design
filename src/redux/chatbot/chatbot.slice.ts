import { JIVAViewTypeEnum } from '@/enums/chatbot.enums';
import {
  IChatbotHistoryMetadata,
  IJIVAInsights,
  IPageDetails,
  IParsedChatHistoryResponse,
} from '@/interfaces/chatbot.interface';
import { generateRandomID } from '@/utils';
import chatbotUtils from '@/utils/chatbot.utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IChatbotState {
  activeSessionId: string;
  sessions: IChatbotHistoryMetadata[];
  messages: Record<string, IParsedChatHistoryResponse[]>;
  insightsData: Array<IJIVAInsights>;
  pageDetails?: IPageDetails;
  viewType: JIVAViewTypeEnum;
  isHistorySideBarOpen: boolean;
  isPreviewOpen: boolean;
  previewPanelUrl: string | null;
  previewPanelLoading: boolean;
}

const initialState: IChatbotState = {
  activeSessionId: generateRandomID(),
  sessions: [],
  messages: {},
  insightsData: [],
  pageDetails: undefined,
  viewType: JIVAViewTypeEnum.CHATBOT,
  isHistorySideBarOpen: false,
  isPreviewOpen: false,
  previewPanelUrl: null,
  previewPanelLoading: false,
};

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    resetChatbotState: () => initialState,

    setActiveSession: (state, action: PayloadAction<string>) => {
      state.activeSessionId = action.payload;
    },

    setSessions: (state, action: PayloadAction<IChatbotHistoryMetadata[]>) => {
      state.sessions = action.payload;
    },

    setSessionMessages: (
      state,
      action: PayloadAction<{
        sessionId: string;
        messages: IParsedChatHistoryResponse[];
      }>
    ) => {
      state.messages[action.payload.sessionId] = action.payload.messages;
    },

    addMessage: (
      state,
      action: PayloadAction<{
        sessionId: string;
        message: IParsedChatHistoryResponse;
      }>
    ) => {
      const { sessionId, message } = action.payload;
      if (!state.messages[sessionId]) state.messages[sessionId] = [];
      state.messages[sessionId].push(message);
    },

    updateMessage: (
      state,
      action: PayloadAction<{
        sessionId: string;
        messageId: string;
        updater: (
          msg: IParsedChatHistoryResponse
        ) => IParsedChatHistoryResponse;
      }>
    ) => {
      const { sessionId, messageId, updater } = action.payload;
      const msgs = state.messages[sessionId] || [];
      state.messages[sessionId] = msgs.map((msg) =>
        msg.message_id === messageId ? updater(msg) : msg
      );
    },

    setInsightsData: (state, action: PayloadAction<Array<IJIVAInsights>>) => {
      state.insightsData = action.payload;
    },

    removeInsight: (state, action: PayloadAction<number>) => {
      state.insightsData = state.insightsData.filter(
        (_, index) => index !== action.payload
      );
    },

    updateInsight: (
      state,
      action: PayloadAction<{
        insightId: string;
        updates: Partial<IJIVAInsights>;
      }>
    ) => {
      const { insightId, updates } = action.payload;
      const index = state.insightsData.findIndex(
        (insight) => insight.insight_id === insightId
      );
      if (index !== -1) {
        state.insightsData[index] = {
          ...state.insightsData[index],
          ...updates,
        };
      }
    },

    setPageDetails: (
      state,
      action: PayloadAction<IPageDetails | undefined>
    ) => {
      state.pageDetails = action.payload;
    },

    clearPageDetails: (state) => {
      state.pageDetails = undefined;
    },

    setViewType: (state, action: PayloadAction<JIVAViewTypeEnum>) => {
      state.viewType = action.payload;
    },

    setIsHistorySideBarOpen: (state, action: PayloadAction<boolean>) => {
      state.isHistorySideBarOpen = action.payload;
    },

    setIsPreviewOpen: (state, action: PayloadAction<boolean>) => {
      state.isHistorySideBarOpen = !action.payload;
      state.isPreviewOpen = action.payload;
    },

    setPreviewPanelUrl: (state, action: PayloadAction<string | null>) => {
      state.previewPanelUrl = chatbotUtils.convertS3ToPublicUrl(
        action.payload ?? ''
      );
    },

    setPreviewPanelLoading: (state, action: PayloadAction<boolean>) => {
      state.previewPanelLoading = action.payload;
    },

    resetPreviewPanel: (state) => {
      state.previewPanelUrl = null;
      state.previewPanelLoading = false;
      state.isPreviewOpen = false;
    },
  },
});

export const {
  resetChatbotState,
  setActiveSession,
  setSessions,
  setSessionMessages,
  addMessage,
  updateMessage,
  setInsightsData,
  removeInsight,
  updateInsight,
  setPageDetails,
  clearPageDetails,
  setViewType,
  setIsHistorySideBarOpen,
  setIsPreviewOpen,
  setPreviewPanelUrl,
  setPreviewPanelLoading,
  resetPreviewPanel,
} = chatbotSlice.actions;

export const selectChatbotState = (state: { chatbot: IChatbotState }) =>
  state.chatbot;
export const selectActiveSessionId = (state: { chatbot: IChatbotState }) =>
  state.chatbot.activeSessionId;
export const selectActiveSessionMessages = (state: {
  chatbot: IChatbotState;
}) => state.chatbot.messages[state.chatbot.activeSessionId] || [];
export const selectChatbotSessions = (state: { chatbot: IChatbotState }) =>
  state.chatbot.sessions;

export const selectInsightsData = (state: { chatbot: IChatbotState }) =>
  state.chatbot.insightsData;

export const selectPageDetails = (state: { chatbot: IChatbotState }) =>
  state.chatbot.pageDetails;

export const selectViewType = (state: { chatbot: IChatbotState }) =>
  state.chatbot.viewType;
export const selectIsHistorySideBarOpen = (state: { chatbot: IChatbotState }) =>
  state.chatbot.isHistorySideBarOpen;
export const selectIsPreviewOpen = (state: { chatbot: IChatbotState }) =>
  state.chatbot.isPreviewOpen;
export const selectPreviewPanelUrl = (state: { chatbot: IChatbotState }) =>
  state.chatbot.previewPanelUrl;
export const selectPreviewPanelLoading = (state: { chatbot: IChatbotState }) =>
  state.chatbot.previewPanelLoading;

const chatbotReducer = chatbotSlice.reducer;
export default chatbotReducer;
