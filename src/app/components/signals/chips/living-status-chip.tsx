import styles from './chips.module.scss';
import type { Decision } from '@/constants/signals/decisions.constants';
import { livingStatusPhrase } from '@/utils/signals/lifecycle';
import { useLivingTick } from '@/hooks/use-living-clock';

export function LivingStatusChip({ decision }: { decision: Decision }) {
  const tick = useLivingTick();
  const phrase = livingStatusPhrase(decision.domain, tick);
  return (
    <span className={styles.livingStatus}>
      <span className={styles.livingDot} />
      {phrase}
    </span>
  );
}