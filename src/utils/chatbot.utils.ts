import {
  CHATBOT_CLEAR_EVENT,
  CHATBOT_FILE_NAMES,
  CHATBOT_LOADING_PLACEHOLDERS,
  CODE_BOUNDARY_REGEX_PATTERNS,
  EXCLUDED_HEADERS,
  INSIGHT_TABLE_CURRENCY_COLUMNS,
  INSIGHT_TABLE_INTEGER_COLUMNS,
  INSIGHT_TABLE_NON_NUMERIC_COLUMNS,
  ORCHESTRATOR_KEYS,
  PYTHON_REGEX_PATTERNS,
  S3_REGEX_PATTERN,
} from '@/constants/chatbot.constants';
import { S3_FILE_REGEX } from '@/constants/regex.constants';
import { FeatureRoutes } from '@/enums/auth.enums';
import {
  AnarixLLMToolEnum,
  BooleanEnum,
  ChatbotResponseEnum,
  ChatbotResponseErrEnum,
  ChatbotToolCallType,
  ChatbotToolMethodEnum,
  StreamMethodsEnum,
} from '@/enums/chatbot.enums';
import { MarketplaceEnum, Range } from '@/enums/serp.enums';
import { IDateRange } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  DataRow,
  IChatbotToolCall,
  IJIVAInsights,
  IParsedHistory,
  IRawResponse,
  IReasoningResponseData,
} from '@/interfaces/chatbot.interface';
import { UseAppQueryProps } from '@/redux/react-query-hooks';
import {
  setIsChatbotExpanded,
  setIsChatbotOpen,
} from '@/redux/slices/auth/auth.slice';
import { checkIsNull } from '@/utils/advertising.utils';
import { AnyAction } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import { PlotParams } from 'react-plotly.js';
import {
  checkIsValidObject,
  displayValue,
  formatDate,
  formatNum,
  hasProperty,
  isJson,
} from '.';
import { isCustomDateRangeSet } from './datetime.utils';

const chatbotUtils = {
  isToolCall: (chunk: string) => {
    return chunk
      .toLowerCase()
      .includes(ChatbotToolMethodEnum.TOOL_CALL.toLowerCase());
  },
  isValidSummary: (str: string) => {
    const str_lower = str.toLowerCase();
    if (
      str_lower.includes(ChatbotResponseEnum.FAILED.toLowerCase()) ||
      str_lower === ChatbotResponseEnum.DATA.toLowerCase() ||
      str_lower.includes(ChatbotResponseEnum.MISSING.toLowerCase()) ||
      str_lower.includes(ChatbotResponseEnum.ERROR.toLowerCase()) ||
      str_lower.includes(ChatbotResponseEnum.GRAPH_TYPE.toLowerCase()) ||
      str_lower.includes(ChatbotResponseEnum.INVALID.toLowerCase()) ||
      str_lower.includes(StreamMethodsEnum.STREAM_END.toLowerCase()) ||
      str_lower.includes(StreamMethodsEnum.STREAM_START.toLowerCase()) ||
      str_lower.includes(ChatbotToolCallType.TOOL_CALL_PROGRESS.toLowerCase())
    )
      return false;
    return true;
  },

  getRandomLoaderText: () => {
    const index = Math.floor(
      Math.random() * CHATBOT_LOADING_PLACEHOLDERS.length
    );
    return CHATBOT_LOADING_PLACEHOLDERS[index];
  },

  getRandomFileName: () => {
    const index = Math.floor(Math.random() * CHATBOT_FILE_NAMES.length);
    return CHATBOT_FILE_NAMES[index];
  },
  isToolResult: (chunk: string) => {
    return chunk
      .toLowerCase()
      .includes(ChatbotToolMethodEnum.TOOL_RESULT.toLowerCase());
  },

  isStreamStart: (chunk: string) => {
    return chunk
      .toLowerCase()
      .includes(StreamMethodsEnum.STREAM_START.toLowerCase());
  },
  isStreamEnd: (chunk: string) => {
    return chunk
      .toLowerCase()
      .includes(StreamMethodsEnum.STREAM_END.toLowerCase());
  },
  parseToolCallResponse: (chunk: string): IRawResponse | PlotParams | null => {
    if (!chunk.includes(',')) return null;
    const jsonToParse = '{' + chunk.split(',').splice(1).join();
    if (isJson(jsonToParse)) return JSON.parse(jsonToParse);
    return null;
  },

  isPlotlyCall: (chunk: string) => {
    return (
      chunk
        .toLowerCase()
        .includes(ChatbotToolCallType.PLOTLY_GRAPH.toLowerCase()) ||
      chunk
        .toLowerCase()
        .includes(ChatbotToolCallType.PLOTLY_GRAPH_1.toLowerCase()) ||
      chunk
        .toLowerCase()
        .includes(ChatbotToolCallType.PLOTLY_GRAPH_2.toLowerCase()) ||
      chunk
        .toLowerCase()
        .includes(ChatbotToolCallType.PLOTLY_GRAPH_3.toLowerCase()) ||
      chunk
        .toLowerCase()
        .includes(ChatbotToolCallType.PLOTLY_GRAPH_4.toLowerCase()) ||
      chunk
        .toLowerCase()
        .includes(ChatbotToolCallType.PLOTLY_GRAPH_5.toLowerCase())
    );
  },

  isPlotlyErrResponse: (chunk: string) => {
    return chunk
      .toLowerCase()
      .includes(ChatbotResponseErrEnum.GRAPH_ERR.toLowerCase());
  },

  isS3FileValid: (s3_file: string) => {
    if (
      s3_file
        .toLowerCase()
        .includes(ChatbotResponseErrEnum.S3_ERR.toLowerCase())
    )
      return '';
    return S3_FILE_REGEX.test(s3_file) ? s3_file : '';
  },
  extractQuesFromToolCall: (chunk: string): IChatbotToolCall | null => {
    if (
      chatbotUtils.isStreamEnd(chunk) ||
      chatbotUtils.isStreamStart(chunk) ||
      !chatbotUtils.isToolCall(chunk) ||
      !isJson(chunk)
    )
      return null;

    const toolCallResponse: IChatbotToolCall = JSON.parse(chunk);

    return toolCallResponse;
  },

  getUniqueQuestionValue: (ques: string, idx: number) => {
    return `${ques}_${idx}`;
  },
  isHtmlFile: (s3_file: string) => {
    return s3_file.toLowerCase().endsWith('.html');
  },

  convertS3ToPublicUrl: (s3_file: string, region = 'us-east-1'): string => {
    const { bucket, key } = chatbotUtils.parseS3Url(s3_file);
    if (!bucket || !key) return '';
    return `https://${bucket}.s3.${region}.amazonaws.com${key}`;
  },
  isToolLine: (line: string) => {
    const trimmedLine = line.trim();

    return (
      trimmedLine.toLowerCase().startsWith(ChatbotToolCallType.NEW_TOOL_CALL) ||
      trimmedLine
        .toLowerCase()
        .startsWith(ChatbotToolCallType.TOOL_CALL_PROGRESS) ||
      trimmedLine
        .toLowerCase()
        .startsWith(ChatbotToolCallType.NEW_TOOL_RESPONSE)
    );
  },

  parseChatbotData: (answer: string): IParsedHistory => {
    const lines = answer.split('\n');
    const jsonList = [];
    const textParts = [];

    for (const line of lines) {
      const isToolLine = chatbotUtils.isToolLine(line);

      if (isToolLine) {
        continue;
      }

      if (isJson(line)) {
        jsonList.push(JSON.parse(line));
      } else {
        if (
          chatbotUtils.isValidSummary(line) &&
          !chatbotUtils.isOrchestratorJSON(line) &&
          !chatbotUtils.shouldFilterStreamLine(line)
        ) {
          textParts.push(line);
        }
      }
    }

    const chartDataArr: PlotParams[] = [];

    const dataEntries: IReasoningResponseData[] = [];
    for (const json of jsonList) {
      if (chatbotUtils.isPlotlyJson(json)) {
        const chartData = {
          data: json.data,
          layout: json.layout || {},
        };
        chartDataArr.push(chartData);
      } else if (json.question && json.s3_file) {
        dataEntries.push({
          reasoningQues: json.question,
          s3_file: json.s3_file,
          step_number: json.step_number,
          tool_used: json.tool_used,
        });
      }
    }

    const summary = chatbotUtils.cleanSummary(textParts.join('\n'));

    return {
      data: dataEntries,
      chartData: chartDataArr,
      summary: summary,
    };
  },

  isPlotlyJson: (obj: any): obj is PlotParams => {
    try {
      if (
        checkIsValidObject(obj) === false ||
        hasProperty(obj, 'data') === false
      )
        return false;

      if (!Array.isArray(obj.data)) return false;

      for (const trace of obj.data) {
        if (
          checkIsValidObject(trace) === false ||
          hasProperty(trace, 'type') === false
        ) {
          return false;
        }
      }

      if (
        hasProperty(obj, 'layout') &&
        checkIsValidObject(obj.layout) === false
      )
        return false;

      if (hasProperty(obj, 'frames') && !Array.isArray(obj.frames))
        return false;

      return true;
    } catch (err) {
      console.error('Error while checking for graph data');
      return false;
    }
  },

  getCSVFileNameBasedOnToolCall: (str: string) => {
    const formattedStr = str.toLowerCase();
    const name = 'Analyzed';
    let finalFileName = '';
    switch (formattedStr) {
      case ChatbotToolCallType.KEYWORD_SOV_QUERY:
        finalFileName = `${name} Keyword SOV`;
        break;
      case ChatbotToolCallType.ACTIVE_KEYWORDS_OVERALL:
        finalFileName = `${name} Active Keywords`;
        break;
      case ChatbotToolCallType.ANALYSIS_ON_S3:
        finalFileName = `${name} CSV`;
        break;
      case ChatbotToolCallType.ASIN_PRICE_TRACKER:
        finalFileName = `${name} Asin Price`;
        break;
      case ChatbotToolCallType.DESCRIBE_CSV:
        finalFileName = `${name} CSV`;
        break;
      case ChatbotToolCallType.KEYWORD_LEVEL_SOV:
        finalFileName = `${name} Keyword Level SOV`;
        break;
      case ChatbotToolCallType.PRODUCT_SOV_QUERY:
        finalFileName = `${name} Product SOV`;
        break;

      default:
        finalFileName = str;
        break;
    }
    return finalFileName;
  },

  isKeywordSOVToolCall: (chunk: string) => {
    const formattedStr = chunk.toLowerCase();
    formattedStr.includes(ChatbotToolCallType.KEYWORD_SOV_QUERY.toLowerCase());
  },

  isProductSovToolCall: (chunk: string) => {
    const formattedStr = chunk.toLowerCase();
    formattedStr.includes(ChatbotToolCallType.PRODUCT_SOV_QUERY.toLowerCase());
  },

  isDescribeCSVToolCall: (chunk: string) => {
    const formattedStr = chunk.toLowerCase();
    formattedStr.includes(ChatbotToolCallType.DESCRIBE_CSV.toLowerCase());
  },

  formatMarkdown: (text: string) => {
    const marker = '📅 Analysis Timeframe:';
    const index = text.indexOf(marker);

    const slicedText = index !== -1 ? text.slice(index) : text;

    return slicedText
      .split('\n')
      .map((line) => (line.includes(marker) ? `**${line.trim()}**` : line))
      .join('\n');
  },

  newSession: () => {
    window.dispatchEvent(new Event(CHATBOT_CLEAR_EVENT));
  },

  decodeBData: (bData: string, dType = 'f8'): number[] => {
    if (dType !== 'f8') {
      throw new Error(
        `Unsupported dtype: ${dType}. Only "f8" (Float64) is supported.`
      );
    }

    const binaryString = Buffer.from(bData, 'base64').toString('base64');
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const float64Array = new Float64Array(bytes.buffer);
    return Array.from(float64Array);
  },

  decodeChartData: (
    chartObj: PlotParams | null | undefined
  ): PlotParams | null => {
    if (chartObj === null || chartObj === undefined) return null;
    const decodeBDataHelper = (obj: any): any => {
      if (obj && typeof obj === 'object' && obj.bdata && obj.dtype) {
        try {
          return chatbotUtils.decodeBData(obj.bdata, obj.dtype);
        } catch (error) {
          console.error('Failed to decode bdata:', error);
          return obj;
        }
      }
      return obj;
    };

    const decoded = structuredClone(chartObj);

    if (decoded.data && Array.isArray(decoded.data)) {
      decoded.data.forEach((trace: any) => {
        Object.keys(trace).forEach((key) => {
          trace[key] = decodeBDataHelper(trace[key]);
        });
      });
    }

    return decoded;
  },
  formatInsightSummary: (summary: string | undefined) => {
    if (!summary || summary === '') return '';

    return summary
      .replace(/\s*•/g, '\n•')
      .replace(/\n+/g, '<br/>')
      .replace(/^<br\/>/, '');
  },

  parseInsightText: (insightText: string) => {
    const lines = insightText.split('\n\n');
    const title = lines[0]?.trim() || 'Insight';

    const bucketIndex = insightText.indexOf('bucket:');
    const summaryText =
      bucketIndex > 0
        ? insightText.substring(0, bucketIndex).trim()
        : insightText;

    const blocks = summaryText
      .split('\n\n')
      .map((block) => block.trim())
      .filter((block) => block.length > 0 && block !== title);

    return {
      title,
      summary: blocks.join('\n\n'),
      fullText: insightText,
    };
  },

  getInsightsQueriesConfig: <T = any>(
    insightsData: IJIVAInsights[],
    isAllowed: boolean,
    queryFn: (s3Link: string) => Promise<T>
  ): UseAppQueryProps<any, any>[] => {
    return insightsData
      .filter((i) => i.s3_link && i.s3_link !== '')
      .map((i) => ({
        queryKey: [i.s3_link],
        queryFn: () => queryFn(i.s3_link || ''),
        options: {
          staleTime: Infinity,
        },
        enabled:
          insightsData.length > 0 &&
          !!i.s3_link &&
          i.s3_link !== '' &&
          isAllowed === true,
      }));
  },

  getValidatedDateRange: (
    rangeValue: string,
    customDateRange: IDateRange,
    marketplace: MarketplaceEnum
  ) => {
    let dateRange;

    if (
      rangeValue === Range.CUSTOM_RANGE &&
      isCustomDateRangeSet(customDateRange)
    ) {
      dateRange = customDateRange;
    } else {
      dateRange = formatDate(rangeValue, marketplace);
    }

    return {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate ?? '',
    };
  },
  formatCell: (value: string | null | undefined, column: string) => {
    if (!value) return '-';

    const lowerCol = column.toLowerCase();

    if (
      isNaN(Number(value)) ||
      INSIGHT_TABLE_NON_NUMERIC_COLUMNS.includes(lowerCol)
    ) {
      return value;
    }

    if (INSIGHT_TABLE_INTEGER_COLUMNS.includes(lowerCol)) {
      return formatNum(value, false);
    }

    const formatted = formatNum(value);

    if (lowerCol.includes('percent')) {
      return displayValue(formatted, true);
    }

    if (INSIGHT_TABLE_CURRENCY_COLUMNS.includes(lowerCol)) {
      return displayValue(formatted, false);
    }

    return value;
  },
  getColumnsFromDataKeys: (data: DataRow, maxColumns?: number) => {
    if (Object.keys(data).length === 0) return [];

    const allColumns = Object.keys(data).filter((col) => {
      const normalized = col.toLowerCase().replace(/[^a-z0-9]/g, '');
      return !EXCLUDED_HEADERS.includes(normalized);
    });
    return maxColumns ? allColumns.slice(0, maxColumns) : allColumns;
  },

  parseS3Url: (url: string): { bucket: string; key: string } => {
    try {
      const urlObj = new URL(url);
      const bucket = urlObj.hostname.split('.')[0];
      const key = urlObj.pathname.startsWith('/')
        ? urlObj.pathname
        : `/${urlObj.pathname}`;
      return { bucket, key };
    } catch (error) {
      return { bucket: '', key: '' };
    }
  },

  createUpdatedInsightWithS3Context: (
    insight: IJIVAInsights,
    backendS3Url?: string,
    frontendS3Url?: string
  ): IJIVAInsights => {
    if (!backendS3Url || !frontendS3Url) {
      return insight;
    }
    const { bucket, key } = chatbotUtils.parseS3Url(backendS3Url);
    return {
      ...insight,
      uploaded_s3_url: backendS3Url,
      uploaded_frontend_s3_url: frontendS3Url,
      hidden_insight_text: `${insight.title}\n\n${insight.summary}\n\nbucket: ${bucket}\nkey: ${key}`,
    };
  },

  prepareTableDataWithSelection: (
    insight: IJIVAInsights,
    data: any[],
    defaultSelected = BooleanEnum.TRUE
  ) => {
    if (
      checkIsNull(insight.uploaded_frontend_s3_url) &&
      chatbotUtils.checkIsActionsAbsent(insight)
    )
      return data;
    else if (chatbotUtils.checkIsActionsAbsent(insight)) return data;
    else
      return data.map((row) => {
        if ('isSelected' in row) return row;
        return {
          ...row,
          isSelected: defaultSelected,
        };
      });
  },

  checkIsActionsAbsent: (insight: IJIVAInsights | undefined) => {
    const res = !insight || !insight.actions || insight.actions.length === 0;
    return res;
  },
  getSelectedRowCount: (tableData: any[]): number => {
    return tableData.filter((row: any) => row.isSelected === BooleanEnum.TRUE)
      .length;
  },

  areAllRowsSelected: (tableData: any[]): boolean => {
    if (checkIsNull(tableData)) return false;
    return tableData.every((row: any) => row.isSelected === BooleanEnum.TRUE);
  },

  isSelectionIndeterminate: (tableData: any[]): boolean => {
    if (checkIsNull(tableData)) return false;
    const hasSelected = tableData.some(
      (row: any) => row.isSelected === BooleanEnum.TRUE
    );
    const allSelected = chatbotUtils.areAllRowsSelected(tableData);
    return hasSelected && !allSelected;
  },

  parseInsightFromHistory: (
    history: any,
    reduxInsights: IJIVAInsights[]
  ): IJIVAInsights | undefined => {
    if (!history.insight) return undefined;

    // If insight is already an object, merge with Redux state
    if (typeof history.insight === 'object' && history.insight) {
      const insightObj = history.insight;

      const reduxInsight = reduxInsights.find(
        (ri) =>
          ri.insight_id === insightObj.insight_id ||
          ri.title === insightObj.title
      );

      return {
        ...insightObj,
        uploaded_s3_url:
          reduxInsight?.uploaded_s3_url ||
          history.insight_backend_uri ||
          insightObj.uploaded_s3_url,
        uploaded_frontend_s3_url:
          reduxInsight?.uploaded_frontend_s3_url ||
          history.insight_frontend_uri ||
          insightObj.uploaded_frontend_s3_url,
      };
    }

    // Parse insight from string format
    const insightText = history.insight as string;
    const parsedInsight = chatbotUtils.parseInsightText(insightText);
    const titleLine = parsedInsight.title;
    const summary = parsedInsight.summary;

    const reduxInsight = reduxInsights.find((ri) => ri.title === titleLine);

    return {
      insight_id: history.message_id,
      title: titleLine,
      summary: summary,
      hidden_insight_text: insightText,
      actions: [],
      s3_link:
        history.insight_backend_uri || history.insight_frontend_uri || '',
      uploaded_s3_url:
        reduxInsight?.uploaded_s3_url || history.insight_backend_uri,
      uploaded_frontend_s3_url:
        reduxInsight?.uploaded_frontend_s3_url || history.insight_frontend_uri,
    };
  },

  isLastMessageOfConversation: (
    index: number,
    totalMessages: number,
    hasResponseData: boolean
  ): boolean => {
    return index === totalMessages - 1 && hasResponseData;
  },

  shouldShowMessageError: (
    history: any,
    isChatbotLoading: boolean,
    isHistoryLoading: boolean
  ): boolean => {
    if (history.isError) return true;

    const hasNoContent =
      checkIsNull(history.response?.data) &&
      checkIsNull(history.response?.chartData) &&
      checkIsNull(history.response?.summary);

    return (
      !history.is_insight_initial_question &&
      !isChatbotLoading &&
      !isHistoryLoading &&
      hasNoContent
    );
  },

  hasQuestionsAfterInsight: (historyChatData: any[]): boolean => {
    return historyChatData.some(
      (msg) => msg.question && msg.question.trim() !== ''
    );
  },
  prepareReasoningItems: (data: IReasoningResponseData[] | undefined) => {
    if (!data || data.length === 0) {
      return {
        itemsWithS3: [],
        lastItemWithS3: null,
        lastItemIndex: -1,
        previewHTMLLinks: [],
      };
    }

    const itemsWithS3 = data.filter(
      (item) =>
        item.s3_file &&
        item.s3_file !== '' &&
        chatbotUtils.isS3FileValid(item.s3_file) !== ''
    );

    const previewHTMLLinks = data.filter(
      (item) =>
        hasProperty(item, 's3_file') && chatbotUtils.isHtmlFile(item.s3_file)
    );

    const lastItemWithS3 =
      itemsWithS3.length > 0 ? itemsWithS3[itemsWithS3.length - 1] : null;

    const lastItemIndex = lastItemWithS3
      ? data.findIndex((item) => item === lastItemWithS3)
      : -1;

    return { itemsWithS3, lastItemWithS3, lastItemIndex, previewHTMLLinks };
  },

  getChartData: (chartData: any[] | undefined) => {
    if (!chartData || chartData.length === 0) return [];

    return chartData
      .map((chart: PlotParams) => chatbotUtils.decodeChartData(chart))
      .filter(Boolean);
  },

  isResponseJson: (line: string): boolean => {
    const trimmed = line.trim();

    if (
      trimmed.includes('"description":') ||
      trimmed.includes('"tasks":') ||
      trimmed.includes('"is_complete":') ||
      trimmed.includes('"agent":') ||
      trimmed.includes('"tool_calls":')
    ) {
      return true;
    }

    if (
      trimmed === '}' ||
      trimmed === '},' ||
      trimmed === ']' ||
      trimmed === '],' ||
      trimmed === '{'
    ) {
      return true;
    }

    if (trimmed.startsWith('{') && trimmed.endsWith('}') && isJson(trimmed)) {
      try {
        const obj = JSON.parse(trimmed);
        if (
          obj.description ||
          obj.tool_calls ||
          obj.agent ||
          obj.is_complete !== undefined
        ) {
          return true;
        }
      } catch (e) {}
    }

    return false;
  },

  isImplicitToolChunk: (chunk: string) => {
    if (!isJson(chunk)) return false;
    try {
      const parsed = JSON.parse(chunk) as unknown;
      return (
        checkIsValidObject(parsed) &&
        's3_file' in parsed &&
        parsed.s3_file &&
        'tool_used' in parsed &&
        parsed.tool_used &&
        'mode' in parsed &&
        !parsed.mode &&
        checkIsNull(parsed.s3_file) === false
      );
    } catch (e) {
      return false;
    }
  },

  shouldFilterStreamLine: (line: string): boolean => {
    if (!line.trim()) return false;

    if (chatbotUtils.isImplicitToolChunk(line)) return true;

    if (
      line
        .toLowerCase()
        .includes(ChatbotToolMethodEnum.NEW_TOOL_CALL.toLowerCase()) ||
      line
        .toLowerCase()
        .includes(ChatbotToolMethodEnum.NEW_TOOL_RESPONSE.toLowerCase())
    ) {
      return true;
    }

    if (line.includes('s3://') || S3_REGEX_PATTERN.test(line)) {
      return true;
    }

    return chatbotUtils.isResponseJson(line);
  },

  isRulesHomePage: (pathname: string): boolean => {
    const normalizedPath = pathname.replace(/\/$/, '');

    const rulesHomePaths = [
      `/${FeatureRoutes.RULES}/${FeatureRoutes.RULES_AGENTS}`,
      `/${FeatureRoutes.RULES}/${FeatureRoutes.APPLIED_RULES}`,
    ];

    return rulesHomePaths.includes(normalizedPath);
  },

  isOnRulesPage: (pathname: string): boolean => {
    // TODO: disabling audit until jiva is up and running.
    // return pathname.startsWith(`/${FeatureRoutes.RULES}`);
    return false;
  },
  isOnJIVAPage: (pathname: string): boolean => {
    return pathname.startsWith(`/${FeatureRoutes.JIVA_CHATBOT_PAGE}`);
  },

  isRulesFormPage: (pathname: string): boolean => {
    // TODO: disabling audit until jiva is up and running.
    // return pathname.includes(`/${FeatureRoutes.RULE_CREATION}`);
    return false;
  },

  isChatbotFixedMode: (pathname: string): boolean => {
    // TODO: disabling audit until jiva is up and running.
    // const isOnRulesPage = chatbotUtils.isOnRulesPage(pathname);
    // const isRulesHomePage = chatbotUtils.isRulesHomePage(pathname);

    // return isOnRulesPage && !isRulesHomePage;
    return false;
  },

  isOrchestratorJSON: (text: string): boolean => {
    if (!text.trim()) return false;
    const trimmed = text.trim();

    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const obj = JSON.parse(trimmed);

        const hasOrchestratorKey = ORCHESTRATOR_KEYS.some((key) =>
          hasProperty(obj, key)
        );
        const hasContentKey =
          hasProperty(obj, 'content') || hasProperty(obj, 'text');

        if (hasOrchestratorKey && !hasContentKey) return true;
      } catch (e) {
        return false;
      }
    }

    return false;
  },

  processStreamChunk: (
    cleanChunk: string
  ): { chunk: string; isToolChunk: boolean } => {
    return chatbotUtils.parseStreamChunk(cleanChunk);
  },

  parseStreamChunk: (
    cleanChunk: string
  ): { chunk: string; isToolChunk: boolean } => {
    try {
      if (!isJson(cleanChunk)) {
        return {
          chunk: chatbotUtils.extractContentBeforeCodeBoundary(cleanChunk),
          isToolChunk: false,
        };
      }

      return chatbotUtils.processJsonChunk(cleanChunk);
    } catch (e) {
      return { chunk: cleanChunk, isToolChunk: false };
    }
  },

  processJsonChunk: (
    cleanChunk: string
  ): { chunk: string; isToolChunk: boolean } => {
    const parsed = JSON.parse(cleanChunk);

    if (chatbotUtils.isOrchestratorJSON(cleanChunk)) {
      return { chunk: cleanChunk, isToolChunk: true };
    }

    if (parsed.content) {
      return { chunk: parsed.content, isToolChunk: false };
    }

    return { chunk: cleanChunk, isToolChunk: true };
  },

  extractContentBeforeCodeBoundary: (chunk: string): string => {
    for (const pattern of CODE_BOUNDARY_REGEX_PATTERNS) {
      if (pattern.test(chunk)) {
        const match = chunk.match(pattern);
        if (match?.index && match.index > 0) {
          return chunk.substring(0, match.index).trim();
        }
      }
    }
    return chunk;
  },

  isPythonCodeOrMetadata: (line: string): boolean => {
    const trimmed = line.trim();

    if (chatbotUtils.isToolLine(trimmed)) {
      return true;
    }

    return PYTHON_REGEX_PATTERNS.some((pattern) => pattern.test(trimmed));
  },
  cleanSummary: (summary: string): string => {
    return summary
      .split('\n')
      .filter((line) => !chatbotUtils.isPythonCodeOrMetadata(line))
      .join('\n')
      .trim();
  },
  closeChatbot: (dispatch: Dispatch<AnyAction>): void => {
    dispatch(setIsChatbotOpen(false));
    dispatch(setIsChatbotExpanded(false));
  },
  isRawResponse: (data: IRawResponse | PlotParams): data is IRawResponse => {
    return (
      's3_file' in data || 'final_s3_file' in data || 'step_number' in data
    );
  },
  isInteractiveReportTool: (chunk: string): boolean => {
    return chunk
      .toLowerCase()
      .includes(AnarixLLMToolEnum.CREATE_INTERACTIVE_REPORT.toLowerCase());
  },
  isVisualizationTool: (chunk: string): boolean => {
    return chunk
      .toLowerCase()
      .includes(AnarixLLMToolEnum.CREATE_VISUALIZATION.toLowerCase());
  },
  isReportOrVisualizationTool: (chunk: string): boolean => {
    return (
      chatbotUtils.isInteractiveReportTool(chunk) ||
      chatbotUtils.isVisualizationTool(chunk)
    );
  },
  getReportName: (
    streamReportTitle: string | undefined | null,
    responseReportTitle: string | undefined | null
  ) => {
    if (checkIsNull(streamReportTitle) && checkIsNull(responseReportTitle))
      return 'Report';
    return streamReportTitle ?? responseReportTitle;
  },

  hasResponseContent: (response: IParsedHistory | undefined) =>
    response && (response.data || response.chartData || response.summary),
};

export default chatbotUtils;
