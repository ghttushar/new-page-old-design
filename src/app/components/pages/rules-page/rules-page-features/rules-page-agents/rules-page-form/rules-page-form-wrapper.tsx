import ConflictPopup from '@/app/components/common/rule-conflict-popup/rule-conflict-popup';
import SourceTargetMapping from '@/app/components/pages/settings-wrapper/configuration-page/source-target-mapping/source-target-mapping';
import CustomEditLoader from '@/app/components/shared/custom-edit-loader/custom-edit-loader';
import { FeatureRoutes } from '@/enums/auth.enums';
import { JIVAPageIdEnum, JIVAViewTypeEnum } from '@/enums/chatbot.enums';
import { PageTitleEnum } from '@/enums/index.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  AuditStatusEnum,
  RuleDetailsTypeEnum,
  RuleEntityTypeIdEnum,
  RuleStatusEnum,
  RuleTypeEnum,
} from '@/enums/rules.enum';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useAdsAccountSubHeader from '@/hooks/use-ads-account-sub-header.hook';
import useContainerAutoScrollDown from '@/hooks/use-container-auto-scroll-down.hook';
import { IGenerateSourceTargetMapping } from '@/interfaces/configurations.interface';
import {
  IEntityConflict,
  ILinkableEntity,
  IRuleCriteriaDetails,
  IRuleEntityLinksDetails,
  IRulesTemplateDetails,
} from '@/interfaces/rules/rules.interfaces';
import {
  clearPageDetails,
  setPageDetails,
  setViewType,
} from '@/redux/chatbot/chatbot.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import {
  setIsNavigating,
  setIsSidebarMenuOpen,
  setPendingNavigationPath,
} from '@/redux/slices/auth/auth.slice';
import {
  selectSourceTargetMappings,
  setRulesSourceTargetContextKey,
  setSourceTargetMappings,
} from '@/redux/slices/configurations/configurations.slice';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from '@/redux/slices/notifications/toast-message.slice';
import {
  resetRuleState,
  selectIsRuleArchived,
  selectIsSelectCampaignPage,
  selectRuleBasicFilters,
  selectRuleCriteriaSetsMap,
  selectSelectedEntities,
  selectSelectedEntityType,
  selectSelectedRuleType,
  setAppliedEntities,
  setAuditStatus,
  setAuditWarnings,
  setDuplicateRuleCriteriaSetsMap,
  setIsEditModeOn,
  setRuleBasicFilters,
  setRulesValidation,
  setRuleTemplateDetails,
  setSelectedEntities,
  setSelectedEntityType,
  setSelectedRuleType,
} from '@/redux/slices/rules/rules.slice';
import rulesServices from '@/services/rules/rules.services';
import { checkIsNull } from '@/utils/advertising.utils';
import chatbotUtils from '@/utils/chatbot.utils';
import {
  checkFinalValidationErrors,
  formatAuditResponse,
  getAllValidationErrorsWithMeta,
  getBasicInfoInitialFilters,
  getEntityIDNameByEntityType,
  getEntityNameByEntityType,
  getEntityTypesForRule,
  getFormattedRuleEntityLinksDetails,
  getRuleDetailsPayload,
  getTableTitleByRuleEntity,
  hasAuditIssues,
  hasAuditProp,
  hasConflictProp,
} from '@/utils/rules.utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import RulesEntityFormFooterAction from './rules-page-form-components/rules-entity-form-footer-action/rules-entity-form-footer-action';
import { RulesPageSelectComponent } from './rules-page-form-components/rules-page-form-select/rules-page-form-select';
import RulesPageFormCreation from './rules-page-form-creation';
import styles from './rules-page-form.module.scss';

export default function RulesPageFormWrapper() {
  const advertisingAccount = useAdsAccountSubHeader(
    PageTitleEnum.RULES_CREATION,
    PAGE_TITLE_TOOLTIPS.RULES_CREATION,
    false
  );

  const { containerRef, contentRef } = useContainerAutoScrollDown();

  const marketplace = useMemo(
    () => advertisingAccount.marketplace,
    [advertisingAccount.marketplace]
  );
  const { id } = useParams<{ id: string | undefined }>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRuleType = useAppSelector(selectSelectedRuleType);
  const selectedEntities = useAppSelector(selectSelectedEntities);
  const criteriaSetsMap = useAppSelector(selectRuleCriteriaSetsMap);
  const isSelectPage = useAppSelector(selectIsSelectCampaignPage);
  const selectedBasicFilters = useAppSelector(selectRuleBasicFilters);
  const ruleEntityType = useAppSelector(selectSelectedEntityType);
  const sourceTargetMappings = useAppSelector(selectSourceTargetMappings);
  const isRuleArchived = useAppSelector(selectIsRuleArchived);

  const [isConflict, setIsConflict] = useState(false);
  const [conflicts, setConflicts] = useState<IEntityConflict[]>([]);
  const [initialEntityLinks, setInitialEntityLinks] = useState<
    Array<IRuleEntityLinksDetails>
  >([]);
  const [initialSelectedMappingIds, setInitialSelectedMappingIds] = useState<
    string[]
  >([]);

  const handleOnSuccessStateReload = () => {
    dispatch(setIsNavigating(false));
    dispatch(setPendingNavigationPath(null));
    handleConflictPopupClose();
    chatbotUtils.closeChatbot(dispatch);
    navigate(`/${FeatureRoutes.RULES}/${FeatureRoutes.APPLIED_RULES}`);
    dispatch(setAuditStatus(AuditStatusEnum.SUCCESS));
    dispatch(resetRuleState());
  };

  const extractedRuleMetadataParams: {
    id: string | null;
    ruleDetailsType: RuleDetailsTypeEnum | null;
  } = useMemo(() => {
    if (!id)
      return {
        id: null,
        ruleDetailsType: null,
      };

    const fetchedParamsArr = id.split('=');
    const fetchedType = fetchedParamsArr[0];
    const fetchedId = fetchedParamsArr[1];

    if (!fetchedId || !fetchedType)
      return {
        id: null,
        ruleDetailsType: null,
      };

    return {
      id: fetchedId,
      ruleDetailsType: fetchedType as RuleDetailsTypeEnum,
    };
  }, [id]);

  const { mutateAsync: auditRule, isPending: isAuditPending } = useAppMutation({
    mutationFn: (payload: { overrideConflicts: boolean }) => {
      const rulePayload = getRuleDetailsPayload(
        criteriaSetsMap,
        selectedBasicFilters,
        getFormattedRuleEntityLinksDetails(
          selectedEntities,
          ruleEntityType,
          selectedBasicFilters.id
        ),
        payload.overrideConflicts,
        false
      );
      return rulesServices.auditRule(rulePayload);
    },
    options: {
      onSuccess: async (auditResponse, { overrideConflicts }) => {
        const auditData = auditResponse.data.data;

        if (hasAuditIssues(auditData)) {
          dispatch(setAuditWarnings(formatAuditResponse(auditData)));
          dispatch(setAuditStatus(AuditStatusEnum.WARNING));
          return;
        }

        await handleApplyRules(overrideConflicts);
      },
      onError: () => {
        dispatch(setAuditStatus(AuditStatusEnum.IDLE));
      },
    },
  });

  // --- Create (draft / direct save — no audit) ---
  const {
    mutateAsync: createRuleTemplate,
    isIdle: isCreateRuleIdle,
    isPending: isCreateRulePending,
  } = useAppMutation({
    mutationFn: ({
      criteriaSetMap,
      overrideConflicts = false,
      customPayload,
    }: {
      criteriaSetMap: Map<string, IRuleCriteriaDetails> | null;
      overrideConflicts: boolean;
      customPayload?: IRulesTemplateDetails;
    }) => {
      const payload =
        customPayload !== undefined && Object.keys(customPayload).length > 0
          ? customPayload
          : getRuleDetailsPayload(
              criteriaSetMap,
              selectedBasicFilters,
              getFormattedRuleEntityLinksDetails(
                selectedEntities,
                ruleEntityType,
                selectedBasicFilters.id
              ),
              overrideConflicts,
              false
            );

      return rulesServices.createRule(payload);
    },
    options: {
      onSuccess: (data) => {
        const response = data.data.data;
        if (hasConflictProp(response)) {
          if (
            response.conflict.isConflict === false ||
            checkIsNull(response.conflict.conflicts)
          )
            return;
          setIsConflict(true);
          setConflicts(response.conflict.conflicts);
          dispatch(setAuditStatus(AuditStatusEnum.SUCCESS));
        } else if (hasAuditProp(response) && hasAuditIssues(response.audit)) {
          dispatch(setAuditWarnings(formatAuditResponse(response.audit)));
          dispatch(setAuditStatus(AuditStatusEnum.WARNING));
        } else {
          dispatch(
            showSuccessToastMessage({
              title: data.data.message,
              description: data.data.description,
            })
          );
          handleOnSuccessStateReload();
        }
      },
      onError: () => {
        dispatch(setAuditStatus(AuditStatusEnum.IDLE));
      },
    },
  });

  const handleApplyRules = async (overrideConflicts: boolean) => {
    dispatch(setAppliedEntities(selectedEntities));

    // For KEYWORD_HARVESTING_RULE, handle source-target mapping first
    if (selectedRuleType === RuleTypeEnum.KEYWORD_HARVESTING_RULE) {
      try {
        if (!selectedEntities.length) {
          dispatch(
            showErrorToastMessage({
              title: 'Validation Error',
              description: 'Please select at least one source-target mapping',
            })
          );
          dispatch(setAuditStatus(AuditStatusEnum.IDLE));
          return;
        }

        const payload = getRuleDetailsPayload(
          criteriaSetsMap,
          selectedBasicFilters,
          getFormattedRuleEntityLinksDetails(
            selectedEntities,
            ruleEntityType,
            selectedBasicFilters.id
          ),
          true,
          false
        );

        await handleDraftRules(payload);
      } catch (error) {
        dispatch(setAuditStatus(AuditStatusEnum.IDLE));
      }
      return;
    }

    const finalValidation = checkFinalValidationErrors(
      criteriaSetsMap,
      selectedBasicFilters
    );
    const validationErrors = getAllValidationErrorsWithMeta(finalValidation);

    if (validationErrors.length) {
      dispatch(setRulesValidation(finalValidation));
      validationErrors.forEach((error) => {
        dispatch(
          showErrorToastMessage({
            title: 'Rules Validation Error!!',
            description: `${error.message}`,
          })
        );
      });
      dispatch(setAuditStatus(AuditStatusEnum.IDLE));
    } else {
      dispatch(setDuplicateRuleCriteriaSetsMap(criteriaSetsMap));

      const payload = getRuleDetailsPayload(
        criteriaSetsMap,
        selectedBasicFilters,
        getFormattedRuleEntityLinksDetails(
          selectedEntities,
          ruleEntityType,
          selectedBasicFilters.id
        ),
        overrideConflicts,
        false
      );

      await handleDraftRules(payload);
    }
  };

  // Draft skips audit — calls create/update directly
  const handleDraftRules = async (payload: IRulesTemplateDetails) => {
    if (
      extractedRuleMetadataParams.ruleDetailsType === RuleDetailsTypeEnum.RULE
    ) {
      await updateRule({
        criteriaSetMap: criteriaSetsMap,
        overrideConflicts: true,
        customPayload: payload,
      });
    } else {
      await createRuleTemplate({
        criteriaSetMap: criteriaSetsMap,
        overrideConflicts: true,
        customPayload: payload,
      });
    }
  };

  // --- Update (draft / direct save — no audit) ---
  const {
    mutateAsync: updateRule,
    isIdle: isUpdateRuleIdle,
    isPending: isUpdateRulePending,
  } = useAppMutation({
    mutationFn: ({
      criteriaSetMap,
      overrideConflicts = false,
      customPayload,
    }: {
      criteriaSetMap: Map<string, IRuleCriteriaDetails> | null;
      overrideConflicts: boolean;
      customPayload?: IRulesTemplateDetails;
    }) => {
      const payload =
        customPayload !== undefined && Object.keys(customPayload).length > 0
          ? customPayload
          : getRuleDetailsPayload(
              criteriaSetMap,
              selectedBasicFilters,
              getFormattedRuleEntityLinksDetails(
                selectedEntities,
                ruleEntityType,
                selectedBasicFilters.id
              ),
              overrideConflicts,
              false
            );

      return rulesServices.putUpdateRule(
        extractedRuleMetadataParams.id ?? '',
        payload
      );
    },
    options: {
      onSuccess: (data) => {
        const response = data.data.data;
        if (hasConflictProp(response)) {
          if (
            response.conflict.isConflict === false ||
            checkIsNull(response.conflict.conflicts)
          )
            return;
          setIsConflict(true);
          setConflicts(response.conflict.conflicts);
          dispatch(setAuditStatus(AuditStatusEnum.SUCCESS));
        } else if (hasAuditProp(response) && hasAuditIssues(response.audit)) {
          dispatch(setAuditWarnings(formatAuditResponse(response.audit)));
          dispatch(setAuditStatus(AuditStatusEnum.WARNING));
        } else {
          dispatch(
            showSuccessToastMessage({
              title: data.data.message,
              description: data.data.description,
            })
          );
          handleOnSuccessStateReload();
        }
      },
      onError: () => {
        dispatch(setAuditStatus(AuditStatusEnum.IDLE));
      },
    },
  });

  const fetchTemplateById = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_TEMPLATE_BY_TEMPLATE_ID,
      {
        extractedTemplateId: extractedRuleMetadataParams.id,
      },
    ],
    queryFn: async ({ signal }) => {
      dispatch(setRuleTemplateDetails(null));
      setInitialEntityLinks([]);
      dispatch(setSourceTargetMappings([]));
      setInitialSelectedMappingIds([]);
      if (extractedRuleMetadataParams.id)
        return await rulesServices.getTemplateByTemplateId(
          extractedRuleMetadataParams.id,
          signal
        );
    },
    enabled:
      extractedRuleMetadataParams.ruleDetailsType ===
        RuleDetailsTypeEnum.TEMPLATE && extractedRuleMetadataParams.id !== null,
    options: {
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
    },
  });

  useEffect(() => {
    if (fetchTemplateById.data) {
      const resData = fetchTemplateById.data.data.data;

      if (resData && resData.rule.ruleType !== RuleTypeEnum.UNKNOWN) {
        dispatch(setRuleTemplateDetails(resData));
        dispatch(
          setSelectedEntityType(
            getEntityTypesForRule(
              resData.rule.ruleType,
              resData.rule.marketplace ?? marketplace
            )[0]
          )
        );
        dispatch(
          setRuleBasicFilters(
            getBasicInfoInitialFilters(resData.rule, resData.rule.ruleType)
          )
        );
        dispatch(setViewType(JIVAViewTypeEnum.INSIGHTS));
        dispatch(setSelectedRuleType(resData.rule.ruleType));

        if (resData.rule.ruleType === RuleTypeEnum.KEYWORD_HARVESTING_RULE) {
          const keywordHarvestingEntityLinks = (resData.entityLinks ??
            []) as unknown as IGenerateSourceTargetMapping[];
          const selectedMappingIds = keywordHarvestingEntityLinks
            .map((entity) => entity.mappingId)
            .filter((mappingId): mappingId is string => Boolean(mappingId));

          dispatch(setSourceTargetMappings(keywordHarvestingEntityLinks));
          setInitialSelectedMappingIds(selectedMappingIds);
          setInitialEntityLinks([]);
        } else {
          setInitialEntityLinks(resData.entityLinks ?? []);
          setInitialSelectedMappingIds([]);
        }
      } else {
        dispatch(setRuleTemplateDetails(null));
        dispatch(setSelectedRuleType(null));
        dispatch(setRuleBasicFilters(getBasicInfoInitialFilters(null, null)));
        setInitialEntityLinks([]);
        setInitialSelectedMappingIds([]);
      }
    }
  }, [fetchTemplateById.data, dispatch, marketplace]);

  const isTemplateDetailsLoading = useMemo(
    () => fetchTemplateById.isLoading || fetchTemplateById.isRefetching,
    [fetchTemplateById.isLoading, fetchTemplateById.isRefetching]
  );

  const fetchRuleById = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_RULE_BY_RULE_ID,
      {
        extractedTemplateId: extractedRuleMetadataParams.id,
      },
    ],
    queryFn: async ({ signal }) => {
      dispatch(setRuleTemplateDetails(null));
      setInitialEntityLinks([]);
      setInitialSelectedMappingIds([]);
      dispatch(setSourceTargetMappings([]));
      if (extractedRuleMetadataParams.id)
        return await rulesServices.getRulesById(
          extractedRuleMetadataParams.id,
          signal
        );
    },
    enabled:
      extractedRuleMetadataParams.ruleDetailsType ===
        RuleDetailsTypeEnum.RULE && extractedRuleMetadataParams.id !== null,
    options: {
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
    },
  });

  useEffect(() => {
    if (fetchRuleById.data) {
      const resData = fetchRuleById.data.data.data;

      if (resData.length) {
        const data = resData[0];
        if (data && data.rule.ruleType !== RuleTypeEnum.UNKNOWN) {
          dispatch(setRuleTemplateDetails(data));
          dispatch(
            setSelectedEntityType(
              getEntityTypesForRule(
                data.rule.ruleType,
                data.rule.marketplace ?? marketplace
              )[0]
            )
          );
          dispatch(
            setRuleBasicFilters(
              getBasicInfoInitialFilters(data.rule, data.rule.ruleType)
            )
          );
          dispatch(setViewType(JIVAViewTypeEnum.INSIGHTS));
          dispatch(setSelectedRuleType(data.rule.ruleType));

          if (data.rule.ruleType === RuleTypeEnum.KEYWORD_HARVESTING_RULE) {
            const keywordHarvestingEntityLinks =
              data.entityLinks as unknown as IGenerateSourceTargetMapping[];
            const selectedMappingIds = keywordHarvestingEntityLinks
              .map((entity) => entity.mappingId)
              .filter((mappingId): mappingId is string => Boolean(mappingId));

            dispatch(setSourceTargetMappings(keywordHarvestingEntityLinks));
            setInitialSelectedMappingIds(selectedMappingIds);
            setInitialEntityLinks([]);
          } else {
            setInitialEntityLinks(data.entityLinks ?? []);
            setInitialSelectedMappingIds([]);
          }
        } else {
          dispatch(setRuleTemplateDetails(null));
          dispatch(setSelectedRuleType(null));
          dispatch(setRuleBasicFilters(getBasicInfoInitialFilters(null, null)));
          setInitialEntityLinks([]);
          setInitialSelectedMappingIds([]);
        }
      } else {
        dispatch(setRuleTemplateDetails(null));
        dispatch(setSelectedRuleType(null));
        dispatch(setRuleBasicFilters(getBasicInfoInitialFilters(null, null)));
        setInitialEntityLinks([]);
        setInitialSelectedMappingIds([]);
      }
    }
  }, [fetchRuleById.data, dispatch, marketplace]);

  const isRuleDetailsLoading = useMemo(
    () => fetchRuleById.isLoading || fetchRuleById.isRefetching,
    [fetchRuleById.isLoading, fetchRuleById.isRefetching]
  );

  const pageDetailsValue = useMemo(() => {
    if (selectedRuleType) {
      return {
        page_id: JIVAPageIdEnum.RULES,
        page_arguments: {
          ruleType: selectedRuleType,
        },
      };
    }
    return {
      page_id: JIVAPageIdEnum.RULES,
    };
  }, [selectedRuleType]);

  // Set page details when component mounts or selectedRuleType changes
  useEffect(() => {
    dispatch(setPageDetails(pageDetailsValue));
    dispatch(setIsEditModeOn(!isRuleArchived));
    dispatch(setIsSidebarMenuOpen(false));
  }, [dispatch, pageDetailsValue, isRuleArchived]);

  // Clear any stale validation from a prior session on mount only
  useEffect(() => {
    dispatch(setRulesValidation(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clear page details when component unmounts (navigating away from rules page)
  useEffect(() => {
    dispatch(setSourceTargetMappings([]));

    return () => {
      dispatch(clearPageDetails());
      dispatch(setRulesSourceTargetContextKey(null));
    };
  }, [dispatch]);

  const handleApplySelectedRows = (entities: ILinkableEntity[]) =>
    dispatch(setSelectedEntities(entities));

  const handleKeywordHarvestingSelectionChange = useCallback(
    (selectedMappingIds: string[]) => {
      const selectedIdsSet = new Set(selectedMappingIds);
      const mappingEntities: ILinkableEntity[] = sourceTargetMappings
        .filter((mapping) => selectedIdsSet.has(mapping.mappingId))
        .map((mapping) => ({
          entityId: mapping.mappingId || '',
          name: `${mapping.sourceAdGroupName} → ${mapping.targetAdGroupName}`,
          status: RuleStatusEnum.ENABLED,
          existingRules: [],
        }));

      dispatch(setSelectedEntities(mappingEntities));
    },
    [dispatch, sourceTargetMappings]
  );

  const isCreatingRule = useMemo(
    () =>
      (isCreateRuleIdle === false && isCreateRulePending === true) ||
      (isUpdateRuleIdle === false && isUpdateRulePending === true) ||
      isAuditPending,
    [
      isCreateRuleIdle,
      isCreateRulePending,
      isUpdateRuleIdle,
      isUpdateRulePending,
      isAuditPending,
    ]
  );

  const handleConflictPopupClose = () => setIsConflict(false);

  const entityName = useMemo(
    () =>
      getTableTitleByRuleEntity(
        ruleEntityType ?? RuleEntityTypeIdEnum.CAMPAIGN_ID
      ).toLowerCase(),
    [ruleEntityType]
  );

  const handleAuditRule = async (overrideConflicts: boolean) => {
    // TODO: disabling audit until jiva is up and running.
    // dispatch(setAuditStatus(AuditStatusEnum.PROCESSING));
    // await auditRule({ overrideConflicts });
    await handleApplyRules(overrideConflicts);
  };

  return (
    <div className={styles.ruleCreationContainer}>
      {isCreatingRule && isConflict === false && (
        <CustomEditLoader overlayText="Creating Rule" />
      )}
      <div className={styles.formContainer} ref={containerRef}>
        <div className="relative" ref={contentRef}>
          <ConflictPopup
            isOpen={isConflict}
            handlePopupClose={handleConflictPopupClose}
            handleConfirm={() => handleApplyRules(true)}
            handleCancel={handleConflictPopupClose}
            isLoading={isCreatingRule && isConflict}
            isNewDesign={true}
          >
            <div className={styles.subContainer}>
              There are already different rules applied to the following&nbsp;
              {entityName}:
              <div className={styles.tableContainer}>
                {RuleConflictTable(conflicts, ruleEntityType, marketplace)}
              </div>
              Creating a new rule will override on these&nbsp;
              {entityName}
              &nbsp;from the list above. Do you still want to proceed?
            </div>
          </ConflictPopup>

          {isSelectPage === false ? (
            <RulesPageFormCreation
              isTemplateLoading={
                isTemplateDetailsLoading || isRuleDetailsLoading
              }
            />
          ) : selectedRuleType === RuleTypeEnum.KEYWORD_HARVESTING_RULE ? (
            <SourceTargetMapping
              isRulesPage={true}
              fixedHeight={true}
              isViewMode={true}
              // isRuleEdit={chatbotUtils.isRulesFormPage(location.pathname)} // TODO: Will revisit the logic later.
              isRuleEdit={!isRuleArchived}
              initialSelectedMappingIds={initialSelectedMappingIds}
              onRowSelectionChange={handleKeywordHarvestingSelectionChange}
              height="40rem"
            />
          ) : (
            <RulesPageSelectComponent
              onSelectionChange={handleApplySelectedRows}
              initialEntityLinks={initialEntityLinks}
            />
          )}
        </div>
      </div>

      <div className={styles.footerContainer}>
        <RulesEntityFormFooterAction
          handleApplyRules={handleAuditRule}
          handleDraftRules={handleDraftRules}
          ruleDetailsType={extractedRuleMetadataParams.ruleDetailsType}
        />
      </div>
    </div>
  );
}

function RuleConflictTable(
  conflictingEntities: IEntityConflict[],
  entityType: RuleEntityTypeIdEnum | null,
  marketplace: MarketplaceEnum | undefined
) {
  const ruleConflictColumns = useMemo(() => {
    const entityID = `${getEntityIDNameByEntityType(
      entityType ?? RuleEntityTypeIdEnum.ITEM_ID,
      marketplace ?? MarketplaceEnum.AMAZON
    )}`;
    const entityName = `${getEntityNameByEntityType(
      entityType ?? RuleEntityTypeIdEnum.ITEM_ID,
      marketplace
    )} Name`;

    return [entityID, entityName, 'Rule Name'];
  }, [entityType, marketplace]);

  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.thead}>
          {ruleConflictColumns.map((col) => (
            <th className={styles.thSticky} key={col}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {conflictingEntities.map((entity) =>
          entity.conflictingRules.map((rule, ruleIndex) => (
            <tr key={`${entity.entityId}-${rule.ruleId}`}>
              {ruleIndex === 0 && (
                <td
                  className={styles.tdBorder}
                  rowSpan={entity.conflictingRules.length}
                >
                  {entity.entityId}
                </td>
              )}
              {ruleIndex === 0 && (
                <td
                  className={styles.td}
                  rowSpan={entity.conflictingRules.length}
                >
                  <div className={styles.overflowText}>{entity.entityId}</div>
                </td>
              )}
              <td className={styles.td}>
                <div className={styles.overflowText}>{rule.ruleName}</div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
