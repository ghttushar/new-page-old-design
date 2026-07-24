import { FeatureRoutes } from '@/enums/auth.enums';
import { RuleDetailsTypeEnum } from '@/enums/rules.enum';
import { Link } from 'react-router-dom';
import { textWrappingStyles } from '../../common/keyword-actions-table/keyword-actions-table-styles';
import styles from './advertising-name-view.module.scss';

interface IAdvertisingRuleNameViewProps {
  ruleName: string;
  ruleId?: string;
}

export default function AdvertisingRuleNameView({
  ruleName,
  ruleId,
}: IAdvertisingRuleNameViewProps) {
  return (
    <div className={styles.infoDiv}>
      <div className={styles.infoDiv}>
        <Link
          className={styles.titleContainer}
          to={`/${FeatureRoutes.RULES}/${FeatureRoutes.RULES_AGENTS}/${FeatureRoutes.RULE_CREATION}/${RuleDetailsTypeEnum.RULE}=${ruleId}`}
          style={
            {
              ...textWrappingStyles,
              textAlign: 'left',
              color: '#77469B',
            } as React.CSSProperties
          }
        >
          <p className={styles.titleName} title={ruleName}>
            {ruleName}
          </p>
        </Link>
      </div>
    </div>
  );
}
