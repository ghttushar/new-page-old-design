import RulePageJivaPrompt from '@/app/components/page-components/rules-page-components/rule-page-jiva-prompt/rule-page-jiva-prompt';
import RulesPageRuleTypes from '@/app/components/page-components/rules-page-components/rules-page-rule-types/rules-page-rule-types';
import { useAppSelector } from '@/redux/hooks';
import { selectIsChatbotOpen } from '@/redux/slices/auth/auth.slice';
import styles from '../../rules-page.module.scss';

export default function RulesPageAgents() {
  const isChatbotOpen = useAppSelector(selectIsChatbotOpen);

  return (
    <div
      className={styles.agentsSubContainer}
      style={{
        paddingLeft: isChatbotOpen ? '1.5rem' : '10rem ',
        paddingRight: isChatbotOpen ? ' 1.5rem' : ' 10rem ',
      }}
    >
      <div className={styles.promptContainer}>
        <RulePageJivaPrompt />
      </div>

      <div className={styles.ruleTypeContainer}>
        <RulesPageRuleTypes />
      </div>
    </div>
  );
}
