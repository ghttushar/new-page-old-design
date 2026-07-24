import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import { FeatureRoutes } from '@/enums/auth.enums';
import { JIVAViewTypeEnum } from '@/enums/chatbot.enums';
import { RuleDetailsTypeEnum } from '@/enums/rules.enum';
import { setViewType } from '@/redux/chatbot/chatbot.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectRuleTypeTemplates,
  setIsRuleFormLoading,
  setRuleTemplateDetails,
} from '@/redux/slices/rules/rules.slice';
import { FilePlusIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import RulesCardComponent from '../../rules-page-components/rules-page-rule-types/rules-card-component/rules-card-component';
import styles from './rules-templates-dialog-popup.module.scss';

interface IRulesTemplatesDialogPopupProps {
  isLoading: boolean;
}

export default function RulesTemplatesDialogPopup({
  isLoading,
}: IRulesTemplatesDialogPopupProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const ruleTemplates = useAppSelector(selectRuleTypeTemplates);

  const handleTemplateClick = (id: string) => {
    dispatch(setRuleTemplateDetails(null));
    dispatch(setViewType(JIVAViewTypeEnum.INSIGHTS));
    navigate(
      `${FeatureRoutes.RULE_CREATION}/${RuleDetailsTypeEnum.TEMPLATE}=${id}`
    );
  };

  const handleCustomTemplateClick = () => {
    dispatch(setRuleTemplateDetails(null));
    dispatch(setIsRuleFormLoading(false));
    dispatch(setViewType(JIVAViewTypeEnum.INSIGHTS));
    navigate(`${FeatureRoutes.RULE_CREATION}`);
  };

  return (
    <div className={styles.templatePopupContainer}>
      <div className={styles.popupDescriptionContainer}>
        <p className={styles.popupDescription}>
          Optimize performance across different advertising platforms with
          custom bidding strategies and budget allocation OR create a custom
          rule.
        </p>

        <PrimaryButton
          buttonText="Create Custom Rule"
          buttonFunction={handleCustomTemplateClick}
          disabled={false}
          isButtonIconRequired={true}
          buttonIcon={
            <FilePlusIcon size={'1.5rem'} color="#fff" weight="bold" />
          }
          width="auto"
          height="3rem"
        />
      </div>

      {isLoading === false && (
        <div className={styles.templateContainer}>
          {ruleTemplates.length > 0 ? (
            ruleTemplates.map((template, i) => (
              <RulesCardComponent
                key={i}
                ruleDetails={template}
                onCardClick={handleTemplateClick}
                noOfCardsPerRow={2}
                isInsidePopup={true}
              />
            ))
          ) : (
            <p className={styles.templateNotFoundText}>
              <i>No templates found...</i>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
