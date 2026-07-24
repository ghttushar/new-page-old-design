import styles from './greeting-header.module.scss';

interface GreetingHeaderProps {
  name: string;
  liveMode: boolean;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function GreetingHeader({ name, liveMode }: GreetingHeaderProps) {
  return (
    <div className={styles.greetingHeader}>
      <h1 className={styles.greeting}>
        {getGreeting()}, <span className={styles.name}>{name}</span>
      </h1>
      <p className={styles.subtitle}>
        Here are your signals for today. {liveMode ? 'Aan is actively monitoring and acting on your behalf.' : 'Review decisions manually.'}
      </p>
      <span className={`${styles.modeBadge} ${liveMode ? styles.live : styles.assisted}`}>
        {liveMode ? '● Live mode' : '○ Assisted mode'}
      </span>
    </div>
  );
}