import { useSelector } from 'react-redux';
import { Sun, CloudSun, Moon, SunHorizon, Sparkle } from '@phosphor-icons/react';
import styles from './daily-briefing.module.scss';
import { selectDecisions } from '@/redux/slices/signals/signals.slice';
import { briefingFor, type BriefingSlot } from '@/utils/signals/briefing';

const ICON_MAP: Record<BriefingSlot, typeof Sun | typeof CloudSun | typeof Moon | typeof SunHorizon> = {
  morning: SunHorizon,
  afternoon: Sun,
  evening: CloudSun,
  end_of_day: Moon,
};

export function DailyBriefing() {
  const decisions = useSelector(selectDecisions);
  const b = briefingFor(decisions);
  const Icon = ICON_MAP[b.slot];

  return (
    <div className={styles.dailyBriefing}>
      <div className={styles.ambientGlow} />
      <div className={styles.content}>
        <div className={styles.badge}>
          <Icon size={12} weight="fill" /> Daily briefing
        </div>
        <h2 className={styles.greeting}>{b.greeting}</h2>
        <p className={styles.dateline}>{b.dateline}</p>
        <ul className={styles.bullets}>
          {b.bullets.map((line, i) => (
            <li key={i} className={styles.bullet}>
              <span className={styles.dot} />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        {b.actionText && (
          <p className={styles.actionText}>
            <Sparkle size={12} weight="fill" /> {b.actionText}
          </p>
        )}
      </div>
    </div>
  );
}
