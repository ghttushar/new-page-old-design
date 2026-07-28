import styles from './greeting-header.module.scss';
import type { Briefing } from '@/utils/signals/briefing';

interface GreetingHeaderProps {
  name: string;
  briefing: Briefing;
}

export function GreetingHeader({ name, briefing }: GreetingHeaderProps) {
  return (
    <div className={styles.greetingHeader}>
      <h1 className={styles.greeting}>
        {briefing.greeting.replace(/\.$/, '')}, {name}.
      </h1>
      <p className={styles.subtitle}>{briefing.dateline}</p>
    </div>
  );
}
