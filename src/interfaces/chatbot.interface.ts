import { FeedBackEnum } from '@/enums/chatbot.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { PlotParams } from 'react-plotly.js';
import { IAPIResponse } from './service.interface';

export interface IChatbotToolCall {
  brand_enc: string;
  is_seller: boolean;
  latest_question: string;
  marketplace: MarketplaceEnum;
  mode: string;
  session_id: string;
  tool_used: string;
  summary_of_function_call: string;
  step_number: string;
  s3_file_link?: string;
  file_description?: string;
}
export interface IChatbotMessageProps {
  question: string;
  response?: IParsedHistory;
  isError?: boolean;
  isLoading?: boolean;
}

export interface IChatbotHistoryMetadata {
  session_id: string;
  title: string;
  last_access: string;
  first_question: string;
  tools_used: string[];
}

export interface IChatbotHistoryMetadataResponse {
  sessions: IChatbotHistoryMetadata[];
}

export interface IJIVAInsights {
  actions: IInsightsAction[];
  title: string;
  s3_link?: string;
  summary: string;
  insight_id: string;
  hidden_insight_text: string;
  uploaded_s3_url?: string;
  uploaded_frontend_s3_url?: string;
  selectedRowIndices?: number[];
}

export interface IPageDetails {
  page_id?: string;
  page_arguments?: Record<string, string>;
}

export interface IInsightPromptData {
  is_insight_initial_question: boolean;
  insight: string;
  is_insight_stream: boolean;
  insight_frontend_uri?: string;
  insight_backend_uri?: string;
}

export interface IInsightsActionExpand {
  summary: string;
  s3_link: string;
  redirection_page?: string;
  jiva_text?: string;
  type?: string;
  normal_time_range_start?: string;
  normal_time_range_end?: string;
  impact_time_range_start?: string;
  impact_time_range_end?: string;
}

export interface IInsightsAction {
  label: string;
  tooltip: string;
  action_id?: string;
  user_text: string;
  api_to_call: string;
}

export interface IReasoningResponseData {
  reasoningQues: string;
  s3_file: string;
  step_number: string;
  tool_used?: string;
  reportTitle?: string;
}
export interface IPreviewResponseData {
  previewPanelLink?: string;
  reportTitle?: string;
  isPreviewLoading?: boolean;
}

export interface IParsedHistory {
  data?: IReasoningResponseData[];
  chartData?: PlotParams[] | null;
  summary?: string;
  previewData?: IPreviewResponseData;
}

export interface IParsedChatHistoryResponse {
  message_id: string;
  question: string;
  response?: IParsedHistory;
  isError?: boolean;
  thumbs_up_down?: string;
  isGraphDataAvailable?: boolean;
  isCallCompleted: boolean;
  isStopped?: boolean;
  is_insight_initial_question?: boolean;
  insight?: IJIVAInsights | string;
  is_insight_stream?: boolean;
  insight_backend_uri?: string;
  insight_frontend_uri?: string;
}

export interface IDownloadCSVDataPayload {
  csv_url: string;
}

export interface IFeedBackPayload {
  session_id: string;
  message_id: string;
  feedback: FeedBackEnum;
  marketplace: string;
}

export interface IStopMessagePayload {
  session_id: string;
  message_id: string;
  marketplace: string;
}

export interface IRawResponse {
  question: string;
  s3_file: string;
  final_s3_file?: string;
  step_number: string;
  report_title?: string;
  visualization_title?: string;
}

export interface IFeedBackResponse {
  status: string;
  message: string;
}

export interface IInsightActionPayload {
  marketplace: string;
  action_id: string;
  insight_details: string;
  action_details: string;
  message_id: string;
  session_id: string;
  action: IInsightsAction;
}

export interface IUploadFilePayload {
  data: any[];
  marketplace: string;
  insight_id?: string;
  session_id?: string;
}

export interface IUploadFileResponse {
  frontend_s3_url: string;
  backend_s3_url: string;
}

export interface IEditCampaignPayload {
  s3_path: string;
  marketplace: string;
}

export interface ICampaignEditErrorResponse {
  success: boolean;
  error: boolean;
  message: string;
  data: any;
  description?: string;
}

export interface ICampaignEditAdTypeResult {
  adType: string;
  skipped: boolean;
  message?: string;
  status_code?: number;
  success?: boolean;
  error?: string;
  response?: ICampaignEditErrorResponse;
}

export interface ICampaignEditResults {
  SP?: ICampaignEditAdTypeResult;
  SD?: ICampaignEditAdTypeResult;
  SB?: ICampaignEditAdTypeResult;
  [key: string]: ICampaignEditAdTypeResult | undefined;
}

export interface ICampaignEditData {
  success: boolean;
  results?: ICampaignEditResults;
}
export type IEditCampaignResponse = IAPIResponse<ICampaignEditData>;

export type DataRow = Record<string, string | null | undefined>;
