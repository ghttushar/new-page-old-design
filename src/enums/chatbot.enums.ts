export enum ChatbotToolMethodEnum {
  TOOL_CALL = 'Tool Call',
  TOOL_RESULT = 'Tool result',
  NEW_TOOL_CALL = `"mode":"Tool Call"`,
  NEW_TOOL_RESPONSE = `"mode":"Tool result"`,
}

export enum ChatbotToolCallType {
  PROCESS_QUESTION = 'process_question',
  PLOTLY_GRAPH = 'plot_ads_graph_plotly',
  PLOTLY_GRAPH_1 = 'plot_line_graph',
  PLOTLY_GRAPH_2 = 'plot_bar_chart',
  PLOTLY_GRAPH_3 = 'plot_pie_chart',
  PLOTLY_GRAPH_4 = 'plot_combo_chart_with_multiple_axes',
  PLOTLY_GRAPH_5 = 'summary_of_s3_file',
  ASIN_PRICE_TRACKER = 'asin_price_tracker',
  ANALYSIS_ON_S3 = 'perform_analysis_on_s3_file',
  DESCRIBE_CSV = 'describe_s3_csv',
  ACTIVE_KEYWORDS_OVERALL = 'active_keywords_tracked_overall',
  KEYWORD_SOV_QUERY = 'run_keyword_sov_query',
  PRODUCT_SOV_QUERY = 'run_product_sov_query',
  KEYWORD_LEVEL_SOV = 'run_keyword_level_asin_sov_query',
  TOOL_CALL_PROGRESS = '[tool call progress]',
  NEW_TOOL_CALL = '[tool call]',
  NEW_TOOL_RESPONSE = '[tool result]',
}

export enum ChatbotResponseEnum {
  GRAPH_TYPE = 'graph_type',
  ERROR = 'error',
  MISSING = 'type=missing',
  DATA = 'data',
  FAILED = 'failed',
  ERROR_RESPONSE = 'For further information visit https://errors.pydantic.dev/2.10/v/missing',
  INVALID = 'invalid',
  GRAPH_RESPONSE = 'hovertemplate',
}

export enum ChatbotResponseErrEnum {
  GRAPH_ERR = `"error":"'NoneType' object has no attribute`,
  S3_ERR = 'The Data Frame Is Null',
}

export enum StreamMethodsEnum {
  STREAM_START = 'STREAM START',
  STREAM_END = 'STREAM END',
}

export enum FeedBackEnum {
  UP = 'UP',
  DOWN = 'DOWN',
  NULL = 'NULL',
}

export enum JIVAViewTypeEnum {
  CHATBOT = 'chatbot',
  INSIGHTS = 'insights',
}

export enum JIVAInsightTypeEnum {
  INSIGHTS = 'insights',
  RECOMMENDATIONS = 'recommendations',
}

export enum JIVARedirectionPageEnum {
  IMPACT_ANALYSIS = 'impact-analysis',
  TARGETING_ACTIONS = 'targeting-actions',
  DAY_PARTING = 'day-parting',
}

export enum AnarixLLMToolEnum {
  EDIT_CAMPAIGNS = 'anarixllm-edit_campaigns',
  CREATE_INTERACTIVE_REPORT = 'anarixllm-create_interactive_report',
  CREATE_VISUALIZATION = 'anarixllm-create_visualization',
  GET_INTERACTIVE_REPORT_INSTRUCTIONS = 'get_interactive_report_instructions',
  GET_VISUALIZATION_INSTRUCTIONS = 'anarixllm-get_visualization_instructions',
}

export enum JIVAPageIdEnum {
  RULES = 'rules',
  CAMPAIGNS = 'campaigns',
  KEYWORDS = 'keywords',
}

export enum BooleanEnum {
  TRUE = 'true',
  FALSE = 'false',
}

export enum ChatbotParamEnum {
  JIVA_OAUTH_REDIRECT_URI_PARAM = 'redirect_uri',
  JIVA_OAUTH_STATE_PARAM = 'state',
  JIVA_MCP_SESSION_PARAM = 'mcpSession',
}
