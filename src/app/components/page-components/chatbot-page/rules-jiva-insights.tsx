import ConflictPopup from '@/app/components/common/rule-conflict-popup/rule-conflict-popup';
import AuditRule from '@/app/components/page-components/rules-page-components/audit-rule/audit-rule';
import SuggestedTemplates from '@/app/components/page-components/rules-page-components/suggested-templates/suggested-templates';
import { QueryKeyEnums } from '@/enums/query.enums';
import { AuditStatusEnum, RuleDetailsTypeEnum } from '@/enums/rules.enum';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { IJIVAInsights } from '@/interfaces/chatbot.interface';
import {
  IRuleCriteriaDetails,
  IRulesTemplateDetails,
  IRuleTypesTemplatesDetails,
} from '@/interfaces/rules/rules.interfaces';
import { selectInsightsData } from '@/redux/chatbot/chatbot.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppMutation } from '@/redux/react-query-hooks';
import {
  selectAuditStatus,
  selectAuditWarnings,
  selectIsSelectCampaignPage,
  selectRuleBasicFilters,
  selectRuleCriteriaSetsMap,
  selectRuleTemplateDetails,
  setAuditStatus,
  setAuditWarnings,
  setRuleTemplateDetails,
  setSelectedEntityType,
  setSelectedRuleType,
} from '@/redux/slices/rules/rules.slice';
import rulesServices from '@/services/rules/rules.services';
import chatbotUtils from '@/utils/chatbot.utils';
import {
  areCriteriaSetsEqual,
  getEntityTypesForRule,
} from '@/utils/rules.utils';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import InsightCard from '../chatbot-page/insight-card';
import styles from './rules-jiva-insights.module.scss';

interface IRulesJivaInsightsProps {
  isExpanded: boolean;
  selectedHistoryId: string;
  currQuesId: string;
  marketplace: MarketplaceEnum;
  onChatClick: (insight: IJIVAInsights) => void;
  onActionClick: (
    insight: IJIVAInsights,
    action: any,
    jivaText: string
  ) => void;
  onPopulateInput: (text: string, insight: IJIVAInsights) => void;
  onRemoveInsight: (index: number) => void;
  onApplyTemplate?: (templateId: string) => void;
  showSuggestedTemplates?: boolean;
  showAuditRule?: boolean;
  ruleTemplates?: IRuleTypesTemplatesDetails[];
}

export default function RulesJivaInsights({
  isExpanded,
  selectedHistoryId,
  currQuesId,
  marketplace,
  onChatClick,
  onActionClick,
  onPopulateInput,
  onRemoveInsight,
  onApplyTemplate,
  showSuggestedTemplates = false,
  showAuditRule = false,
  ruleTemplates = [],
}: IRulesJivaInsightsProps) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const insightsData = useAppSelector(selectInsightsData).filter(
    (insight) => (insight?.summary || '').toString().trim().length > 0
  );
  const ruleDetails = useAppSelector(selectRuleTemplateDetails);
  const ruleBasicFilters = useAppSelector(selectRuleBasicFilters);
  const isSelectCampaignPage = useAppSelector(selectIsSelectCampaignPage);
  const criteriaSetMap = useAppSelector(selectRuleCriteriaSetsMap);
  const isInsightLoading = queryClient.isFetching({
    queryKey: [QueryKeyEnums.INSIGHTS_FETCH],
  });

  const mid = Math.ceil(insightsData.length / 2);
  const leftInsights = insightsData.slice(0, mid);
  const rightInsights = insightsData.slice(mid);

  const [showOverwriteConfirmation, setShowOverwriteConfirmation] =
    useState<boolean>(false);
  const [pendingTemplateId, setPendingTemplateId] = useState<string | null>(
    null
  );
  const [isTemplateApplying, setIsTemplateApplying] = useState<boolean>(false);

  const location = useLocation();
  const hasTemplateInUrl = location.pathname.includes(
    `${RuleDetailsTypeEnum.TEMPLATE}=`
  );

  useEffect(() => {
    if (chatbotUtils.isRulesHomePage(location.pathname)) {
      dispatch(setAuditStatus(AuditStatusEnum.IDLE));
      dispatch(setAuditWarnings([]));
    }
  }, [location.pathname, dispatch]);

  const applyTemplate = async (templateId: string) => {
    try {
      setIsTemplateApplying(true);
      if (onApplyTemplate) onApplyTemplate(templateId);

      const response = await rulesServices.getTemplateByTemplateId(templateId);
      const templateData = response.data?.data;

      if (templateData) {
        dispatch(setRuleTemplateDetails(templateData));
        dispatch(setSelectedRuleType(templateData.rule.ruleType));
        dispatch(
          setSelectedEntityType(
            getEntityTypesForRule(templateData.rule.ruleType, marketplace)[0]
          )
        );
      }
    } catch (error) {
      console.error('Failed to apply template:', error);
    } finally {
      setIsTemplateApplying(false);
    }
  };

  const handleTemplateApply = (templateId: string) => {
    // Check if there are existing criteria (meaning form has data)
    if (criteriaSetMap && criteriaSetMap.size > 0) {
      setPendingTemplateId(templateId);
      setShowOverwriteConfirmation(true);
    } else {
      applyTemplate(templateId);
    }
  };

  const handleConfirmOverwrite = () => {
    if (pendingTemplateId) {
      applyTemplate(pendingTemplateId);
    }
    setShowOverwriteConfirmation(false);
    setPendingTemplateId(null);
  };

  // State for managing active insight cards
  const [leftActiveIndex, setLeftActiveIndex] = useState<number | null>(null);
  const [rightActiveIndex, setRightActiveIndex] = useState<number | null>(null);
  const [activeInsightIndex, setActiveInsightIndex] = useState<number | null>(
    null
  );

  // Audit state
  // Audit state
  const auditStatus = useAppSelector(selectAuditStatus);
  const auditWarnings = useAppSelector(selectAuditWarnings);

  // Audit mutation
  const { mutateAsync: auditRule } = useAppMutation({
    mutationFn: async (payload: IRulesTemplateDetails) => {
      return rulesServices.auditRule(payload);
    },
  });

  // State to track the criteria map that was last audited
  const [lastAuditedCriteriaMap, setLastAuditedCriteriaMap] = useState<Map<
    string,
    IRuleCriteriaDetails
  > | null>(null);

  // Check if audit button should be enabled
  // Enable if there are criteria and they differ from the last audited version
  // We use ruleBasicFilters if ruleDetails is null (Custom Rule creation scenario)
  const isAuditEnabled =
    (!!ruleDetails || !!ruleBasicFilters) &&
    criteriaSetMap !== null &&
    criteriaSetMap.size > 0 &&
    (!lastAuditedCriteriaMap ||
      !areCriteriaSetsEqual(criteriaSetMap, lastAuditedCriteriaMap));

  const handleAuditClick = async () => {
    return;
    // TODO: Enable it once JiVA is Back
    //   // Determine the rule info to use (template or basic filters from form)
    //   const ruleInfo = ruleDetails?.rule ?? ruleBasicFilters;
    //   const entityLinks = ruleDetails?.entityLinks ?? [];
    //   if (!ruleInfo) {
    //     console.error('Cannot audit: No rule details or basic filters available');
    //     return;
    //   }
    //   try {
    //     dispatch(setAuditStatus(AuditStatusEnum.PROCESSING));
    //     dispatch(setAuditWarnings([]));
    //     const payload = getRuleDetailsPayload(
    //       criteriaSetMap,
    //       ruleInfo,
    //       entityLinks,
    //       false,
    //       false // overrideConflicts - set to false for audit
    //     );
    //     if (!payload) {
    //       console.error('Failed to generate audit payload');
    //       dispatch(setAuditStatus(AuditStatusEnum.IDLE));
    //       return;
    //     }
    //     const response = await auditRule(payload as IRulesTemplateDetails);
    //     // Update the last audited criteria map to the current state
    //     // This will disable the button until changes are made
    //     if (criteriaSetMap) {
    //       setLastAuditedCriteriaMap(new Map(criteriaSetMap));
    //     }
    //     const auditData = response.data?.data;
    //     if (!auditData) {
    //       // Audit service unavailable
    //       console.warn('Audit service returned no data');
    //       dispatch(setAuditStatus(AuditStatusEnum.IDLE));
    //       return;
    //     }
    //     // Extract errors and warnings from ALL rules in response
    //     const allWarnings: IAuditWarning[] = [];
    //     let hasAnyErrors = false;
    //     let hasAnyWarnings = false;
    //     // Get criteria array from the map to access names
    //     const criteriaArray = criteriaSetMap
    //       ? Array.from(criteriaSetMap.values())
    //       : [];
    //     // Iterate through all rules in the audit data
    //     Object.entries(auditData).forEach(([criteriaName, result]) => {
    //       if (!result) return;
    //       const hasErrors = result.errors && result.errors.length > 0;
    //       const hasWarnings = result.warnings && result.warnings.length > 0;
    //       if (hasErrors) hasAnyErrors = true;
    //       if (hasWarnings) hasAnyWarnings = true;
    //       // Add errors to warnings array
    //       if (result.errors) {
    //         result.errors.forEach((error, idx) => {
    //           allWarnings.push({
    //             criteriaId: `error-${criteriaName}-${idx}`,
    //             criteriaTitle: criteriaName,
    //             condition: error,
    //           });
    //         });
    //       }
    //       // Add warnings to warnings array
    //       if (result.warnings) {
    //         result.warnings.forEach((warning, idx) => {
    //           allWarnings.push({
    //             criteriaId: `warning-${criteriaName}-${idx}`,
    //             criteriaTitle: criteriaName,
    //             condition: warning,
    //           });
    //         });
    //       }
    //     });
    //     if (hasAnyErrors || hasAnyWarnings) {
    //       dispatch(setAuditWarnings(allWarnings));
    //       dispatch(setAuditStatus(AuditStatusEnum.WARNING));
    //     } else {
    //       dispatch(setAuditStatus(AuditStatusEnum.SUCCESS));
    //     }
    //   } catch (error) {
    //     console.error('Audit failed:', error);
    //     dispatch(setAuditStatus(AuditStatusEnum.IDLE));
    //   }
  };

  return (
    <div className={styles.container}>
      {/* Suggested Templates - Only show in form page */}
      {showSuggestedTemplates &&
        ruleTemplates.length > 0 &&
        !hasTemplateInUrl && (
          <div
            className={`${styles.section} ${
              auditStatus === AuditStatusEnum.PROCESSING ? styles.disabled : ''
            }`}
          >
            <SuggestedTemplates
              templates={ruleTemplates}
              currentCriteriaMap={criteriaSetMap}
              onApplyTemplate={handleTemplateApply}
              isApplyDisabled={isSelectCampaignPage || isTemplateApplying}
              applyTooltipText={
                isSelectCampaignPage
                  ? 'You cannot apply this template, you have to be on rule creation page'
                  : ''
              }
            />
          </div>
        )}

      {/* Audit Rule - Only show on form pages, disabled when no rule details */}
      {showAuditRule === true && (
        <div className={styles.section}>
          <AuditRule
            auditStatus={auditStatus}
            onAuditClick={handleAuditClick}
            warnings={auditWarnings}
            isDisabled={
              !isAuditEnabled || auditStatus === AuditStatusEnum.PROCESSING
            }
            hasTemplatesAbove={
              showSuggestedTemplates &&
              ruleTemplates.length > 0 &&
              !hasTemplateInUrl
            }
          />
        </div>
      )}

      {/* Insights Section */}
      <div
        className={`${styles.insightsSection} ${
          auditStatus === AuditStatusEnum.PROCESSING ? styles.disabled : ''
        }`}
      >
        {isExpanded ? (
          <div className={styles.expandedInsightsContainer}>
            <div className={styles.insightsColumn}>
              {leftInsights.map((insight, index) => (
                <InsightCard
                  key={`${insight.title}-${index}`}
                  index={index}
                  insight={insight}
                  marketplace={marketplace}
                  isExpanded={isExpanded}
                  onChatClick={onChatClick}
                  onActionClick={onActionClick}
                  onPopulateInput={onPopulateInput}
                  onRemove={() => onRemoveInsight(index)}
                  sessionId={selectedHistoryId}
                  messageId={currQuesId}
                  isActive={leftActiveIndex === index}
                  onToggle={() =>
                    setLeftActiveIndex(leftActiveIndex === index ? null : index)
                  }
                />
              ))}
            </div>
            <div className={styles.insightsColumn}>
              {rightInsights.map((insight, index) => (
                <InsightCard
                  key={`${insight.title}-${index + mid}`}
                  index={index + mid}
                  insight={insight}
                  marketplace={marketplace}
                  isExpanded={isExpanded}
                  onChatClick={onChatClick}
                  onActionClick={onActionClick}
                  onPopulateInput={onPopulateInput}
                  onRemove={() => onRemoveInsight(index + mid)}
                  sessionId={selectedHistoryId}
                  messageId={currQuesId}
                  isActive={rightActiveIndex === index}
                  onToggle={() =>
                    setRightActiveIndex(
                      rightActiveIndex === index ? null : index
                    )
                  }
                />
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.compactInsightsContainer}>
            {insightsData.map((insight, index) => (
              <InsightCard
                key={`${insight.title}-${index}`}
                index={index}
                insight={insight}
                marketplace={marketplace}
                isExpanded={isExpanded}
                onChatClick={onChatClick}
                onActionClick={onActionClick}
                onPopulateInput={onPopulateInput}
                onRemove={() => onRemoveInsight(index)}
                sessionId={selectedHistoryId}
                messageId={currQuesId}
                isActive={activeInsightIndex === index}
                onToggle={() =>
                  setActiveInsightIndex(
                    activeInsightIndex === index ? null : index
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
      <ConflictPopup
        isOpen={showOverwriteConfirmation}
        handleConfirm={handleConfirmOverwrite}
        handleCancel={() => {
          setShowOverwriteConfirmation(false);
          setPendingTemplateId(null);
        }}
        handlePopupClose={() => {
          setShowOverwriteConfirmation(false);
          setPendingTemplateId(null);
        }}
        isLoading={isTemplateApplying}
        cancelButtonText="Cancel"
        confirmButtonText="Yes, Go Ahead"
        title="Data Overwrite Warning"
        isNewDesign={true}
      >
        <div>
          <p
            style={{
              paddingLeft: '3rem',
              marginBottom: '1rem',
              fontSize: '1.2rem',
              color: '#4b5563',
            }}
          >
            You have already filled important information in rules form which
            might get lost if you go ahead.
          </p>
          <p
            style={{
              paddingLeft: '3rem',
              fontSize: '1.2rem',
              color: '#4b5563',
            }}
          >
            Are you sure, you want to overwrite the existing data and proceed?
          </p>
        </div>
      </ConflictPopup>
    </div>
  );
}
