import { CHATBOT_BASE_URL } from '@/constants';
import {
  ICampaignEditData,
  IChatbotHistoryMetadataResponse,
  IDownloadCSVDataPayload,
  IEditCampaignPayload,
  IFeedBackPayload,
  IFeedBackResponse,
  IInsightActionPayload,
  IInsightPromptData,
  IInsightsActionExpand,
  IJIVAInsights,
  IPageDetails,
  IParsedChatHistoryResponse,
  IStopMessagePayload,
  IUploadFilePayload,
  IUploadFileResponse,
} from '@/interfaces/chatbot.interface';
import { IAPIResponse } from '@/interfaces/service.interface';
import { axiosInstance } from '@/redux/store';
import { encodeURIString, getChatbotHeaders } from '@/utils';

const chatbotServices = {
  sendPrompt: async (
    text: string,
    thread_ts: string,
    marketplace: string,
    messageId: string,
    onChunk: (chunk: string) => void,
    insightData?: IInsightPromptData
  ) => {
    const payload = {
      question: text,
      session_id: thread_ts,
      message_id: messageId,
      is_insight_initial_question:
        insightData?.is_insight_initial_question ?? false,
      insight: insightData?.insight ?? '',
      is_insight_stream: insightData?.is_insight_stream ?? false,
      insight_frontend_uri: insightData?.insight_frontend_uri ?? '',
      insight_backend_uri: insightData?.insight_backend_uri ?? '',
    };

    const headers = getChatbotHeaders(marketplace);

    const response = await fetch(
      `${CHATBOT_BASE_URL}/process?marketplace=${marketplace}`,
      {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok || !response.body) {
      throw new Error(`Network error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let finalData = '';

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value: chunk, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(chunk, { stream: true });

      let boundary;
      while ((boundary = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 1);
        onChunk(line.slice(5).trim());
        finalData += line;
      }
    }
  },
  postGetHistoryMetadata: (marketplace: string) => {
    return axiosInstance.get<IAPIResponse<IChatbotHistoryMetadataResponse>>(
      `${CHATBOT_BASE_URL}/session-metadata?marketplace=${marketplace}`
    );
  },
  getInsights: (
    marketplace: string,
    signal: AbortSignal,
    start_date?: string,
    end_date?: string,
    page_details?: IPageDetails,
    campaign_id?: string
  ) => {
    let url = `${CHATBOT_BASE_URL}/insights?marketplace=${marketplace}`;
    if (start_date) url += `&start_date=${start_date}`;
    if (end_date) url += `&end_date=${end_date}`;
    if (campaign_id) url += `&campaign_id=${campaign_id}`;
    if (page_details) {
      url += `&page_details=${encodeURIString(JSON.stringify(page_details))}`;
    }

    return axiosInstance.get<IAPIResponse<Array<IJIVAInsights>>>(url, {
      signal,
    });
  },
  postInsightAction: (payload: IInsightActionPayload) => {
    const { action, ...rest } = payload;
    return axiosInstance.post<IAPIResponse<Array<IInsightsActionExpand>>>(
      `${CHATBOT_BASE_URL}/actions?marketplace=${rest?.marketplace}`,
      rest
    );
  },
  getHistoryChatById: (
    session_id: string,
    marketplace: string,
    signal: AbortSignal
  ) => {
    return axiosInstance.get<IAPIResponse<IParsedChatHistoryResponse[]>>(
      `${CHATBOT_BASE_URL}/session-history?sessionId=${session_id}&marketplace=${marketplace}`,
      {
        signal,
      }
    );
  },
  postGetDownloadCSVData: (payload: IDownloadCSVDataPayload) => {
    return axiosInstance.post<IAPIResponse<any[]>>(
      `${CHATBOT_BASE_URL}/download-csv`,
      payload
    );
  },
  postChatFeedBack: (payload: IFeedBackPayload) => {
    return axiosInstance.post<IAPIResponse<IFeedBackResponse>>(
      `${CHATBOT_BASE_URL}/post-feedback?marketplace=${payload.marketplace}`,
      payload
    );
  },
  stopMessage: (payload: IStopMessagePayload) => {
    return axiosInstance.post<IAPIResponse<IFeedBackResponse>>(
      `${CHATBOT_BASE_URL}/stop-message?marketplace=${payload.marketplace}`,
      payload
    );
  },
  uploadFile: (payload: IUploadFilePayload) => {
    return axiosInstance.post<IAPIResponse<IUploadFileResponse>>(
      `${CHATBOT_BASE_URL}/upload-file?marketplace=${payload.marketplace}`,
      payload
    );
  },
  editCampaign: (payload: IEditCampaignPayload) => {
    return axiosInstance.post<IAPIResponse<ICampaignEditData>>(
      `${CHATBOT_BASE_URL}/edit-campaign?marketplace=${payload.marketplace}`,
      { s3_path: payload.s3_path }
    );
  },
};

export default chatbotServices;
