import styles from './chips.module.scss';
import type { Decision } from '@/constants/signals/decisions.constants';
import { sourcePillFor, PILL_TONE_CLASS } from '@/utils/signals/sourcePill';
import { cn } from '@/lib/utils';

interface Props {
  decision: Decision;
  size?: 'sm' | 'md';
  className?: string;
}

export function SourcePill({ decision, size = 'sm', className }: Props) {
  const p = sourcePillFor(decision);
  const Icon = p.Icon;
  return (
    <span className={cn(styles.sourcePill, styles[PILL_TONE_CLASS[p.tone]], size === 'md' ? styles.md : styles.sm, className)} title={decision.sourceRef.label}>
      <Icon size={size === 'sm' ? 10 : 12} className={styles.sourcePillIcon} />
      {p.label}
    </span>
  );
}