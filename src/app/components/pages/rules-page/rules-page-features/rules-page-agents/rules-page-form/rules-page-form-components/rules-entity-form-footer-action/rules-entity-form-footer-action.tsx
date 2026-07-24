import AltPrimaryButton from '@/app/components/common/alt-primary-button/alt-primary-button';
import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import ConflictPopup from '@/app/components/common/rule-conflict-popup/rule-conflict-popup';
import { FeatureRoutes } from '@/enums/auth.enums';
import { JIVAViewTypeEnum } from '@/enums/chatbot.enums';
import {
  RuleDetailsTypeEnum,
  RuleEntityTypeIdEnum,
  RuleTypeEnum,
} from '@/enums/rules.enum';
import { RULES_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import { IRulesTemplateDetails } from '@/interfaces/rules/rules.interfaces';
import { setViewType } from '@/redux/chatbot/chatbot.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectIsNavigating,
  selectPendingNavigationPath,
  setIsNavigating,
  setPendingNavigationPath,
} from '@/redux/slices/auth/auth.slice';
import {
  resetRuleState,
  selectAppliedEntities,
  selectDuplicateRuleCriteriaSetsMap,
  selectIsEditModeOn,
  selectIsRuleArchived,
  selectIsSelectCampaignPage,
  selectRuleBasicFilters,
  selectRuleCriteriaSetsMap,
  selectRulesValidation,
  selectSelectedEntities,
  selectSelectedEntityType,
  selectSelectedRuleType,
  setAppliedEntities,
  setIsEditModeOn,
  setIsSelectCampaignPage,
  setRulesValidation,
} from '@/redux/slices/rules/rules.slice';
import { checkIsEqual, checkIsNull } from '@/utils/advertising.utils';
import chatbotUtils from '@/utils/chatbot.utils';
import {
  areCriteriaSetsEqual,
  checkFinalValidationErrors,
  getFormattedRuleEntityLinksDetails,
  getRuleDetailsPayload,
  getTableTitleByRuleEntity,
  isValidationErrorFree,
} from '@/utils/rules.utils';
import { ArrowLeftIcon, ArrowRightIcon } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './rules-entity-form-footer-action.module.scss';
interface IRuleEntityFormFooterProps {
  handleApplyRules: (overrideConflicts: boolean) => void;
  handleDraftRules: (payload: IRulesTemplateDetails) => void;
  ruleDetailsType: RuleDetailsTypeEnum | null;
}
export default function RulesEntityFormFooterAction({
  handleApplyRules,
  handleDraftRules,
  ruleDetailsType,
}: IRuleEntityFormFooterProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const selectedBasicInfoFilters = useAppSelector(selectRuleBasicFilters);
  const selectedCriteriaSetsMap = useAppSelector(selectRuleCriteriaSetsMap);
  const selectedEntities = useAppSelector(selectSelectedEntities);
  const isSelectPage = useAppSelector(selectIsSelectCampaignPage);
  const isEditModeOn = useAppSelector(selectIsEditModeOn);
  const appliedEntities = useAppSelector(selectAppliedEntities);
  const ruleEntityType = useAppSelector(selectSelectedEntityType);
  const isNavigating = useAppSelector(selectIsNavigating);
  const pendingNavigationPath = useAppSelector(selectPendingNavigationPath);
  const duplicateCriteriaSetsMap = useAppSelector(
    selectDuplicateRuleCriteriaSetsMap
  );
  const ruleValidations = useAppSelector(selectRulesValidation);
  const selectedRuleType = useAppSelector(selectSelectedRuleType);
  const isRuleArchived = useAppSelector(selectIsRuleArchived);

  const [isDataLoss, setIsDataLoss] = useState<boolean>(false);

  const handleDraftClick = async () => {
    const payload: IRulesTemplateDetails = getRuleDetailsPayload(
      selectedCriteriaSetsMap,
      selectedBasicInfoFilters,
      getFormattedRuleEntityLinksDetails(
        selectedEntities,
        ruleEntityType,
        selectedBasicInfoFilters.id
      ),
      true,
      true
    );

    handleDraftRules(payload);
  };

  const handleHomeClick = () => {
    if (isEditModeOn) setIsDataLoss(true);
    else handleDataLossClick();
  };

  const handleSelectEntitiesClick = () => {
    dispatch(setIsSelectCampaignPage(true));
  };

  const handleRuleCreationClick = () => {
    if (
      selectedRuleType !== null &&
      selectedRuleType !== RuleTypeEnum.KEYWORD_HARVESTING_RULE
    ) {
      const validationResult = checkFinalValidationErrors(
        selectedCriteriaSetsMap,
        selectedBasicInfoFilters
      );
      dispatch(setRulesValidation(validationResult));
    }
    dispatch(setIsSelectCampaignPage(false));
    dispatch(setAppliedEntities([]));
  };

  const handleApplyRuleClick = () => {
    handleApplyRules(false);
  };

  const handleNavigationChange = () => {
    if (checkIsNull(pendingNavigationPath) === false) {
      navigate(`${pendingNavigationPath}`);
    } else {
      navigate('..'); // if no path is assigned, it will navigate back to its previous state
    }

    dispatch(setPendingNavigationPath(null));
    dispatch(setIsEditModeOn(false));
    chatbotUtils.closeChatbot(dispatch);
    dispatch(setIsNavigating(false));
  };

  const handleDataLossClick = () => {
    navigate(`/${FeatureRoutes.RULES}/${FeatureRoutes.APPLIED_RULES}`);
    dispatch(setViewType(JIVAViewTypeEnum.CHATBOT));
    handleNavigationChange();
    dispatch(resetRuleState());
  };

  const isRuleButtonDisabled = useMemo(() => {
    if (selectedRuleType === RuleTypeEnum.KEYWORD_HARVESTING_RULE) {
      if (
        !selectedBasicInfoFilters ||
        !selectedCriteriaSetsMap ||
        !selectedCriteriaSetsMap.size
      ) {
        //generic rule validations
        return true;
      }

      if (!selectedEntities.length) return true;

      if (isValidationErrorFree(ruleValidations) === false) return true;
      return false;
    }

    const finalValidation = checkFinalValidationErrors(
      selectedCriteriaSetsMap,
      selectedBasicInfoFilters
    );

    return (
      !selectedBasicInfoFilters ||
      !selectedCriteriaSetsMap ||
      !selectedCriteriaSetsMap.size ||
      !selectedEntities.length ||
      (areCriteriaSetsEqual(
        selectedCriteriaSetsMap,
        duplicateCriteriaSetsMap
      ) &&
        checkIsEqual(selectedEntities, appliedEntities)) ||
      isValidationErrorFree(finalValidation) === false ||
      isValidationErrorFree(ruleValidations) === false
    );
  }, [
    selectedRuleType,
    appliedEntities,
    duplicateCriteriaSetsMap,
    selectedBasicInfoFilters,
    selectedCriteriaSetsMap,
    selectedEntities,
    ruleValidations,
  ]);

  const handlePopupClose = () => {
    setIsDataLoss(false);
    dispatch(setIsNavigating(false));
    dispatch(setPendingNavigationPath(null));
  };

  return (
    <div className={styles.rulesActionContainer}>
      <AltPrimaryButton
        buttonText="Back"
        buttonFunction={
          isSelectPage === true ? handleRuleCreationClick : handleHomeClick
        }
        disabled={false}
        width="8rem"
        height="3.2rem"
        isNewDesign={true}
        isButtonIconRequired={true}
        buttonIcon={<ArrowLeftIcon size={'1.6rem'} color="#464646" />}
      />

      <div className={styles.formAction}>
        <AltPrimaryButton
          buttonText="Save & Draft"
          buttonFunction={handleDraftClick}
          disabled={isRuleArchived}
          width="10rem"
          height="3.2rem"
          isNewDesign={true}
          isHoverTooltipEnabled={isRuleArchived}
          tooltipText={RULES_TOOLTIPS.ARCHIVED}
        />

        {isSelectPage === true ? (
          ruleDetailsType === RuleDetailsTypeEnum.RULE ? (
            <PrimaryButton
              buttonText="Update Rule"
              buttonFunction={handleApplyRuleClick}
              disabled={isRuleArchived || isRuleButtonDisabled}
              isHoverTooltipEnabled={isRuleArchived || isRuleButtonDisabled}
              tooltipText={
                isRuleArchived
                  ? RULES_TOOLTIPS.ARCHIVED
                  : isRuleButtonDisabled
                  ? 'Fill all the required fields with valid values'
                  : ''
              }
              isButtonIconRequired={true}
              buttonIcon={
                <ArrowRightIcon size={'1.5rem'} color="#fff" weight="bold" />
              }
              isEndIcon={true}
              width="auto"
              height="3.2rem"
              isNewDesign={true}
            />
          ) : (
            <PrimaryButton
              buttonText="Apply Rule"
              buttonFunction={handleApplyRuleClick}
              disabled={isRuleArchived || isRuleButtonDisabled}
              isHoverTooltipEnabled={isRuleArchived || isRuleButtonDisabled}
              tooltipText={
                isRuleArchived
                  ? RULES_TOOLTIPS.ARCHIVED
                  : isRuleButtonDisabled
                  ? 'Fill all the required fields with valid values'
                  : ''
              }
              isButtonIconRequired={true}
              buttonIcon={
                <ArrowRightIcon size={'1.5rem'} color="#fff" weight="bold" />
              }
              isEndIcon={true}
              width="auto"
              height="3.2rem"
              isNewDesign={true}
            />
          )
        ) : (
          <PrimaryButton
            buttonText={`Select ${getTableTitleByRuleEntity(
              ruleEntityType ?? RuleEntityTypeIdEnum.CAMPAIGN_ID
            )}`}
            buttonFunction={handleSelectEntitiesClick}
            disabled={false}
            isButtonIconRequired={true}
            buttonIcon={
              <ArrowRightIcon size={'1.5rem'} color="#fff" weight="bold" />
            }
            isEndIcon={true}
            width="auto"
            height="3.2rem"
            isNewDesign={true}
          />
        )}
      </div>

      <ConflictPopup
        isOpen={isDataLoss || isNavigating}
        handleConfirm={handleDataLossClick}
        handleCancel={handleDraftClick}
        handlePopupClose={handlePopupClose}
        isLoading={false}
        cancelButtonText="Save as Draft"
        confirmButtonText="Yes, Go Ahead"
        title="Data Lost Warning"
        isNewDesign={true}
        isCancelButtonDisabled={isRuleArchived}
        cancelButtonDisabledTooltip={
          isRuleArchived ? RULES_TOOLTIPS.ARCHIVED : undefined
        }
      >
        <div className={styles.dataLossPopupContent}>
          <p className={styles.popupText}>
            If you leave this page, you will lose unsaved changes.
          </p>
          <p className={styles.popupText}>
            Do you want to save the data as draft and proceed or you want to
            leave the page without saving the data?
          </p>
        </div>
      </ConflictPopup>
    </div>
  );
}
