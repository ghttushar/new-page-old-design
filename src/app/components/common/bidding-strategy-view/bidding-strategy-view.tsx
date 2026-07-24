import { getSPBiddingStrategy } from 'src/utils/advertising.utils';
import styles from './bidding-strategy-view.module.scss';

interface IBiddingStrategyViewProps {
  strategy: string;
}

export default function BiddingStrategyView({
  strategy,
}: IBiddingStrategyViewProps) {
  return (
    <div className={styles.strategyContainer}>
      <p className={styles.strategyValue}>
        {getSPBiddingStrategy(strategy)?.label || '-'}
      </p>
    </div>
  );
}
