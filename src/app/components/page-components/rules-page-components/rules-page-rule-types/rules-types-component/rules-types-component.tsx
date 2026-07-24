import {
  IRuleTypeCategoryMapping,
  IRuleTypesFormattedResponse,
} from '@/interfaces/rules/rules.interfaces';
import { useAppSelector } from '@/redux/hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { getRuleTypesByMarketplace } from '@/utils/rules.utils';
import RulesCardComponent from '../rules-card-component/rules-card-component';
import styles from './rules-types-component.module.scss';

interface IRulesPageTypeComponentProps {
  ruleTypeTitleDetails: IRuleTypeCategoryMapping;
  ruleTypeDetails: IRuleTypesFormattedResponse;
  onRuleTypeCardClick: (value: string, name: string) => void;
}

export default function RulesPageTypeComponent({
  ruleTypeTitleDetails,
  ruleTypeDetails,
  onRuleTypeCardClick,
}: IRulesPageTypeComponentProps) {
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const formattedRulesDetails = getRuleTypesByMarketplace(
    ruleTypeDetails,
    advertisingAccount.marketplace
  );
  return (
    <div className={styles.ruleTypeContainer}>
      <div className={styles.ruleTypeTitleContainer}>
        <div className={styles.ruleTypeIconContainer}>
          {ruleTypeTitleDetails.icon}
        </div>
        <p className={styles.ruleTypeTitle}>{ruleTypeTitleDetails.name}</p>
      </div>

      <div className={styles.ruleTypeCardsContainer}>
        {formattedRulesDetails.length > 0 &&
          formattedRulesDetails.map((ruleType, i) => (
            <RulesCardComponent
              key={i}
              ruleDetails={ruleType}
              onCardClick={onRuleTypeCardClick}
              noOfCardsPerRow={3}
              isInsidePopup={false}
            />
          ))}
      </div>
    </div>
  );
}
