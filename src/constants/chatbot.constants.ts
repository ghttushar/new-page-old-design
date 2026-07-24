import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import { JIVAInsightTypeEnum } from '@/enums/chatbot.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';

export const amazonSamplePrompts = [
  `Generate a dashboard for last month`,
  `Build an interactive report with KPIs`,
  `Can you provide a performance overview for yesterday?`,
  `How many ASINs are ad ineligible?`,
];

export const walmartSamplePrompts = [
  `Generate a dashboard for last month`,
  `Build an interactive report with KPIs`,
  `Which keywords are wasting spend with no conversions in the last 7 days?`,
  `What are my top performing items this month?`,
];

export const SAMPLE_PROMPT_MAPPING: { [key: string]: string[] } = {
  [MarketplaceEnum.AMAZON]: amazonSamplePrompts,
  [MarketplaceEnum.WALMART]: walmartSamplePrompts,
};

export const CHATBOT_LOADING_PLACEHOLDERS = [
  'Thinking',
  'Analyzing',
  'Generating',
  'Processing',
  'Formulating',
  'Constructing',
  'Translating',
  'Reasoning',
];

export const CHATBOT_FILE_NAMES = [
  'Analyzed',
  'Generated',
  'Processed',
  'Formulated',
  'Constructed',
  'Created',
];

export const CHATBOT_CLEAR_EVENT = 'chatbotClearEvent';

export const INSIGHTS_TABS: IDropdownItem<string>[] = [
  {
    label: 'Insights',
    value: JIVAInsightTypeEnum.INSIGHTS,
    selected: true,
  },
  // {
  //   label: 'Recommendations',
  //   value: JIVAInsightTypeEnum.RECOMMENDATIONS,
  //   selected: true,
  //   isDisabled: true,
  // },
];

export const ENABLE_INSIGHT_ACTIONS = true;

export const ENABLE_CAMPAIGN_EDIT_API = false;

export const INSIGHT_TABLE_NON_NUMERIC_COLUMNS = ['asin', 'sku', 'id'];

export const INSIGHT_TABLE_INTEGER_COLUMNS = [
  'impressions',
  'clicks',
  'units',
  'count',
];

export const INSIGHT_TABLE_CURRENCY_COLUMNS = [
  'budget',
  'roas',
  'spend',
  'sales',
  'cpc',
  'cpa',
  'acos',
];

export const EXCLUDED_HEADERS = ['profileid', 'advertiserid', 'isselected'];

export const CHATBOT_RESPONSE_FORMAT = /^data: /;

export const CODE_BOUNDARY_REGEX_PATTERNS = [
  /_prev'\]\s*=/,
  /_last'\]\s*=/,
  /\bdf\[/,
  /\bpd\./,
  /import\s+/,
];

export const ORCHESTRATOR_KEYS = [
  'analysis_result',
  'python_code_executed',
  'python_output',
  'df_structure_with_first_10_rows',
  'mode',
  'description',
  'tool_calls',
  'agent',
  'is_complete',
  'tool_used',
  'step_number',
  's3_file',
  'summary_of_function_call',
];

export const PYTHON_REGEX_PATTERNS = [
  /^import\s+/,
  /^from\s+.*\s+import\s+/,
  /^df\[/,
  /\.astype\(/,
  /\.fillna\(/,
  /\.replace\(/,
  /\.round\(/,
  /\.sort_values\(/,
  /\.rename\(/,
  /\.merge\(/,
  /pd\.merge\(/,
  /pd\.read_sql\(/,
  /pd\.to_datetime\(/,
  /^print\(/,
  /^result_df\s*=/,
  /^merged\s*=/,
  /^filtered\s*=/,
  /_prev'\]\s*=/,
  /_last'\]\s*=/,
  /^for\s+\w+\s+in\s+/,
  /^#\s+/,
  /python_code/i,
  /python_output/i,
  /analysis_result/i,
  /execution_time/i,
  /execution_id/i,
  /data_type_reminder/i,
];

export const S3_REGEX_PATTERN = /\[s3:\/\/[^\]]+\]/;
