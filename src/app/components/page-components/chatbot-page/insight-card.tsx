import { customRangeFilterOption } from '@/constants';
import { ENABLE_INSIGHT_ACTIONS } from '@/constants/chatbot.constants';
import {
  analysisMetricsOptions,
  analysisPerformanceOptions,
} from '@/constants/impact-analysis-filter.constants';
import { FrequencyOptions } from '@/constants/sov.filter.constants';
import { JIVARedirectionPageEnum } from '@/enums/chatbot.enums';
import { useUploadFile } from '@/hooks/chatbot/use-chatbot-hook';
import {
  IInsightActionPayload,
  IInsightsAction,
  IInsightsActionExpand,
  IJIVAInsights,
  IUploadFilePayload,
} from '@/interfaces/chatbot.interface';
import { IMultiSelectDropdownItem } from '@/interfaces/dropdown.interfaces';
import { useAppDispatch } from '@/redux/hooks';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import { setIsChatbotExpanded } from '@/redux/slices/auth/auth.slice';
import {
  setAnalysisFilters,
  setSelectedAnalysisNavTab,
} from '@/redux/slices/impact-analysis/impact-analysis.slice';
import chatbotServices from '@/services/bidder/llm-chatbot/chatbot.service';
import { checkIsNull } from '@/utils/advertising.utils';
import {
  getImpactAnalysisTypeFromApiType,
  getRouteFromRedirectionPage,
} from '@/utils/chatbot-action-mapper.utils';
import chatbotUtils from '@/utils/chatbot.utils';
import { ChatCircleDotsIcon, XIcon } from '@phosphor-icons/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HoverInfoTooltip from '../../common/hover-info-tooltip/hover-info-tooltip';
import InsightTablePreview from '../../common/insight-table-preview/insight-table-preview';

import styles from './insight-card.module.scss';

interface InsightCardProps {
  index: number;
  marketplace?: string;
  insight: IJIVAInsights;
  isExpanded: boolean;
  onChatClick?: (insight: IJIVAInsights) => void;
  onActionClick?: (
    insight: IJIVAInsights,
    action: IInsightsAction,
    jivaText: string
  ) => void;
  onPopulateInput?: (text: string, insight: IJIVAInsights) => void;
  sessionId?: string;
  messageId?: string;
  onRemove?: (index: number) => void;
  isActive?: boolean;
  onToggle?: () => void;
}

const InsightCard: React.FC<InsightCardProps> = ({
  marketplace = '',
  index,
  insight,
  isExpanded,
  onChatClick,
  onActionClick,
  onPopulateInput,
  sessionId,
  messageId,
  onRemove,
  isActive = false,
  onToggle,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [shouldHighlight, setShouldHighlight] = useState(false);
  const [loadingActions, setLoadingActions] = useState<Set<string>>(new Set());
  const [isRemoving, setIsRemoving] = useState(false);
  const [feedback, setFeedback] = useState<'liked' | 'disliked' | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showContent, setShowContent] = useState(isActive);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);

  const cardRef = useRef<HTMLDivElement>(null);

  const removeFromLoadingActions = (id: string) => {
    setLoadingActions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };
  const addToFromLoadingActions = (id: string) => {
    setLoadingActions((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const fetchS3File = useAppQuery({
    queryFn: () => {
      const payload = {
        csv_url: (insight?.uploaded_frontend_s3_url || insight.s3_link) ?? '',
      };
      return chatbotServices.postGetDownloadCSVData(payload);
    },
    queryKey: [insight.uploaded_frontend_s3_url ?? insight.s3_link],
    enabled: !!insight.s3_link && insight.s3_link !== '' && isActive,
    options: {
      staleTime: Infinity,
    },
  });

  useEffect(() => {
    if (fetchS3File.data?.data.data) {
      const transformedData = chatbotUtils.prepareTableDataWithSelection(
        insight,
        fetchS3File.data.data.data
      );
      setFilteredData(transformedData);
      setTableData(transformedData);
    }
  }, [fetchS3File.data?.data.data, insight, insight.uploaded_frontend_s3_url]);

  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setShowContent(true), 150);
      if (cardRef.current) {
        setTimeout(() => {
          cardRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest',
          });
        }, 200);
      }
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isActive]);

  const isTableLoading = useMemo(
    () => fetchS3File.isLoading || fetchS3File.isRefetching,
    [fetchS3File.isLoading, fetchS3File.isRefetching]
  );

  const { mutateAsync: triggerInsightAction } = useAppMutation({
    mutationFn: (variables: IInsightActionPayload) =>
      chatbotServices.postInsightAction(variables),
    options: {
      onSuccess: (response, variables) => {
        const responseData = response?.data?.data;

        if (!responseData) {
          removeFromLoadingActions(variables.action_id);
          return;
        }

        const actionData: IInsightsActionExpand | undefined = Array.isArray(
          responseData
        )
          ? responseData.length > 0
            ? responseData[0]
            : undefined
          : responseData;

        if (actionData?.redirection_page) {
          const route = getRouteFromRedirectionPage(
            actionData.redirection_page
          );
          if (route) {
            if (
              actionData.redirection_page ===
              JIVARedirectionPageEnum.IMPACT_ANALYSIS
            ) {
              // Apply impact analysis filters
              if (
                actionData.normal_time_range_start &&
                actionData.normal_time_range_end
              ) {
                const selectedMetrics = analysisMetricsOptions.filter(
                  (m: IMultiSelectDropdownItem) => m.selected
                );
                dispatch(
                  setAnalysisFilters({
                    frequency: FrequencyOptions[1],
                    range: customRangeFilterOption,
                    customDateRange: {
                      startDate: actionData.normal_time_range_start,
                      endDate: actionData.normal_time_range_end,
                    },
                    impactRange: customRangeFilterOption,
                    impactCustomDateRange: {
                      startDate: actionData.impact_time_range_start || '',
                      endDate: actionData.impact_time_range_end || '',
                    },
                    selectedAnalysisMetrics: selectedMetrics,
                    selectedMetric: selectedMetrics[0],
                  })
                );
              }
            }

            if (actionData.type) {
              const tableTitle = getImpactAnalysisTypeFromApiType(
                actionData.type
              );
              if (tableTitle) {
                const navTab = analysisPerformanceOptions.find(
                  (option) => option.value === tableTitle
                );
                if (navTab) {
                  dispatch(setSelectedAnalysisNavTab(navTab));
                }
              }
            }

            dispatch(setIsChatbotExpanded(false));
            navigate(route);
          }
        }

        if (actionData?.jiva_text && onActionClick) {
          const updatedInsight = chatbotUtils.createUpdatedInsightWithS3Context(
            insight,
            insight.uploaded_s3_url ?? '',
            insight.uploaded_frontend_s3_url ?? ''
          );
          onActionClick(updatedInsight, variables.action, actionData.jiva_text);
        }

        removeFromLoadingActions(variables.action_id as string);
      },
      onError(error, variables, context) {
        removeFromLoadingActions(variables.action_id as string);
      },
    },
  });

  const { isIdle, isPending, uploadFile } = useUploadFile(insight);
  const uploadInsightFiles = async (updatedTableData: any[]) => {
    if (chatbotUtils.checkIsActionsAbsent(insight))
      return {
        backend_s3_url: insight.s3_link,
        frontend_s3_url: insight.s3_link,
      };

    const uploadPayload: IUploadFilePayload = {
      data: updatedTableData,
      marketplace,
      insight_id: insight.insight_id,
      session_id: sessionId,
    };
    const response = await uploadFile(uploadPayload);
    const backend_s3_url = response.data.data.backend_s3_url;
    const frontend_s3_url = response.data.data.frontend_s3_url;

    return { backend_s3_url, frontend_s3_url };
  };

  const handleActionClick = async (action: IInsightsAction) => {
    if (!action.action_id) return;

    addToFromLoadingActions(action.action_id as string);

    let backend_s3_url = insight.uploaded_s3_url;
    let frontend_s3_url = insight.uploaded_frontend_s3_url;

    if (!hasInteracted) {
      const uploadResult = await uploadInsightFiles(tableData);
      backend_s3_url = uploadResult?.backend_s3_url;
      frontend_s3_url = uploadResult?.frontend_s3_url;
    }

    if (!backend_s3_url || !frontend_s3_url) {
      removeFromLoadingActions(action.action_id as string);
      return;
    }

    if (action.api_to_call === 'ask_stream') {
      if (onPopulateInput) {
        const updatedInsight = chatbotUtils.createUpdatedInsightWithS3Context(
          insight,
          backend_s3_url,
          frontend_s3_url
        );
        onPopulateInput(action.user_text, updatedInsight);
      }
      removeFromLoadingActions(action.action_id as string);
      return;
    }

    if (!sessionId || !messageId) {
      removeFromLoadingActions(action.action_id as string);
      return;
    }

    // Store context for onSuccess/onError callbacks

    const actionPayload: IInsightActionPayload = {
      marketplace,
      action_id: action.action_id,
      insight_details: insight.summary,
      action_details: action.user_text,
      message_id: messageId,
      session_id: sessionId,
      action,
    };

    await triggerInsightAction(actionPayload);
  };

  const handleDiscard = () => {
    setTableData(filteredData);
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsRemoving(true);

    setTimeout(() => {
      if (onRemove) {
        onRemove(index);
      }
    }, 300);
  };

  const handleSave = async (updatedTableData: any[]) => {
    setFilteredData(updatedTableData);
    setTableData(updatedTableData);
    await uploadInsightFiles(updatedTableData);
    setHasInteracted(true);
  };

  const handleChatClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isChatLoading) return;
    setIsChatLoading(true);
    try {
      let backend_s3_url = insight.uploaded_s3_url;
      let frontend_s3_url = insight.uploaded_frontend_s3_url;

      if (!hasInteracted) {
        const uploadResult = await uploadInsightFiles(tableData);
        backend_s3_url = uploadResult?.backend_s3_url;
        frontend_s3_url = uploadResult?.frontend_s3_url;
      }

      const updatedInsight = backend_s3_url
        ? chatbotUtils.createUpdatedInsightWithS3Context(
            insight,
            backend_s3_url,
            frontend_s3_url
          )
        : insight;

      if (onChatClick) {
        onChatClick(updatedInsight);
      }

      setTimeout(() => setIsChatLoading(false), 500);
    } catch (error) {
      setIsChatLoading(false);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.insightCard} ${!isActive ? styles.notHovered : ''} ${
        shouldHighlight ? styles.highlight : ''
      } ${isRemoving ? styles.removing : ''} ${
        !isExpanded ? styles.compact : ''
      }`}
      style={{
        width: '100%',
        minWidth: isExpanded ? '26vw' : '30rem',
        cursor: 'pointer',
        paddingLeft: !isExpanded ? '1.5rem' : undefined,
        paddingRight: !isExpanded ? '1.5rem' : undefined,
      }}
      onClick={onToggle}
    >
      <button
        className={styles.cancelButton}
        onClick={handleRemove}
        aria-label="Remove insight"
      >
        <XIcon size={'1.2rem'} weight="bold" />
      </button>

      <h3 className={styles.insightTitle}>{insight?.title}</h3>

      <div
        className={`${styles.insightContent} ${
          isActive ? styles.hovered : styles.notHovered
        }`}
        dangerouslySetInnerHTML={{
          __html: chatbotUtils.formatInsightSummary(insight.summary),
        }}
      />

      {insight?.s3_link && showContent && (
        <div className={`${showContent ? styles.fadeIn : ''}`}>
          <InsightTablePreview
            data={tableData}
            isChatbotExpanded={isExpanded}
            maxPreviewRows={3}
            maxPreviewColumns={isExpanded ? 3 : 2}
            hasCheckboxes={insight?.actions && insight.actions.length > 0}
            isLoading={isActive ? isTableLoading : false}
            hasActions={insight?.actions && insight.actions.length > 0}
            onSave={handleSave}
            onDiscard={handleDiscard}
            isLocked={false}
            title={insight.title}
          />
          {insight?.actions && insight.actions.length > 0 && (
            <span
              className={`${styles.selectedCount}`}
              onClick={(e) => e.stopPropagation()}
            >
              {chatbotUtils.getSelectedRowCount(tableData)}/{tableData.length}{' '}
              selected
            </span>
          )}
        </div>
      )}

      {insight?.actions && insight?.actions.length > 0 && showContent && (
        <div
          className={`${styles.actionsContainer} ${
            showContent ? styles.fadeIn : ''
          } ${styles.stickyHeader}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            paddingRight: !isExpanded ? '1rem' : undefined,
          }}
        >
          {insight?.actions.map((action, idx) => {
            const isLoading = loadingActions.has(action.action_id || '');
            const isDisabled = !ENABLE_INSIGHT_ACTIONS;

            return (
              <HoverInfoTooltip
                key={`${action.action_id ?? action.label}-${idx}`}
                title={action.tooltip}
                disableTooltip={checkIsNull(action.tooltip)}
              >
                {renderPill(
                  action,
                  idx,
                  isLoading,
                  isDisabled,
                  handleActionClick
                )}
              </HoverInfoTooltip>
            );
          })}
        </div>
      )}

      {insight?.s3_link && showContent && onChatClick && (
        <div
          className={`${styles.footerContainer} ${
            showContent ? styles.fadeIn : ''
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* <div className={styles.feedbackContainer}>
            <button
              className={`${styles.feedbackButton} ${
                feedback === 'liked' ? styles.active : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setFeedback((prev) => (prev === 'liked' ? null : 'liked'));
              }}
            >
              <ThumbsUp
                size={16}
                weight={feedback === 'liked' ? 'fill' : 'regular'}
              />
            </button>
            <button
              className={`${styles.feedbackButton} ${
                feedback === 'disliked' ? styles.active : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setFeedback((prev) =>
                  prev === 'disliked' ? null : 'disliked'
                );
              }}
            >
              <ThumbsDownIcon
                size={16}
                weight={feedback === 'disliked' ? 'fill' : 'regular'}
              />
            </button>
          </div> */}
          {/* TODO: Add this after implementing a feedback api for insights */}
          <div className={styles.spacer} />
          <button
            className={`${styles.chatButton} ${
              isChatLoading ? styles.loading : ''
            }`}
            onClick={handleChatClick}
            disabled={isChatLoading}
          >
            {isChatLoading ? (
              <div className={styles.spinner} />
            ) : (
              <div className={styles.chatIcon}>
                <ChatCircleDotsIcon size={18} weight="regular" />
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default InsightCard;

function renderPill(
  action: IInsightsAction,
  idx: number,
  isLoading: boolean,
  isDisabled: boolean,
  handleActionClick: (action: IInsightsAction) => Promise<void>
) {
  return (
    <div
      key={`${action.label}-${idx}`}
      className={`${styles.actionPill} ${
        isLoading
          ? styles.loading
          : isDisabled
          ? styles.disabled
          : styles.default
      }`}
      onClick={(e) => {
        e.stopPropagation();
        if (!isDisabled && action.action_id) handleActionClick(action);
      }}
      style={{
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
      }}
    >
      {isLoading ? 'Loading...' : action.label}
    </div>
  );
}
