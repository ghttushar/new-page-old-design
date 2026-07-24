import styles from './bidding-strategy-view.module.scss';

interface IBidOptimizationStrategyProps {
  strategy: string;
}

export default function BidOptimizationStrategyView({
  strategy,
}: IBidOptimizationStrategyProps) {
  return (
    <div className={styles.strategyContainer}>
      <p className={styles.strategyValue}>{strategy}</p>
    </div>
  );
}
