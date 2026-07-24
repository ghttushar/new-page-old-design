import styles from './greeting-header.module.scss';
import type { Briefing } from '@/utils/signals/briefing';

interface GreetingHeaderProps {
  name: string;
  liveMode: boolean;
  briefing: Briefing;
}

export function GreetingHeader({ name, liveMode, briefing }: GreetingHeaderProps) {
  return (
    <div className={styles.greetingHeader}>
      <div className={styles.titleRow}>
        <h1 className={styles.greeting}>
          {briefing.greeting.replace(/\.$/, '')}, {name}.
        </h1>
        <span className={`${styles.modeBadge} ${liveMode ? styles.live : styles.assisted}`}>
          {liveMode ? '● Live mode' : '○ Assisted mode'}
        </span>
      </div>
      <p className={styles.subtitle}>{briefing.dateline}</p>
    </div>
  );
}
