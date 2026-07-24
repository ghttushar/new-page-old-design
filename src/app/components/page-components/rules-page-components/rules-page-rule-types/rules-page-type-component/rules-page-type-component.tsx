import { RULE_TYPE_CATEGORY_MAPPINGS } from '@/constants/rules/rules.constants';
import { IRuleTypesFormattedResponse } from '@/interfaces/rules/rules.interfaces';
import { useMemo } from 'react';
import RulesCardComponent from '../rules-card-component/rules-card-component';
import styles from './rules-page-type-component.module.scss';

interface IRulesPageTypeComponentProps {
  ruleType: IRuleTypesFormattedResponse;
}

export default function RulesPageTypeComponent({
  ruleType,
}: IRulesPageTypeComponentProps) {
  const ruleTypeTitleDetails = useMemo(() => {
    return RULE_TYPE_CATEGORY_MAPPINGS[ruleType.category];
  }, [ruleType.category]);

  const handleClickRuleType = (value: string) => {
    return;
  };

  return (
    <div className={styles.ruleTypeContainer}>
      <div className={styles.ruleTypeTitleContainer}>
        <div className={styles.ruleTypeIconContainer}>
          {ruleTypeTitleDetails.icon}
        </div>
        <p className={styles.ruleTypeTitle}>{ruleTypeTitleDetails.name}</p>
      </div>

      <div className={styles.ruleTypeCardsContainer}>
        {ruleType.rules?.length > 0 &&
          ruleType.rules?.map((ruleType, i) => (
            <RulesCardComponent
              key={i}
              ruleDetails={ruleType}
              onCardClick={handleClickRuleType}
              noOfCardsPerRow={3}
              isInsidePopup={false}
            />
          ))}
      </div>
    </div>
  );
}
