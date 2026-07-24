import styles from './chips.module.scss';
import { formatValue, type ValueKind, type Cadence } from '@/utils/signals/valueFormat';
import { cn } from '@/lib/utils';

interface Props {
  cents: number;
  kind: ValueKind;
  cadence?: Cadence;
  size?: 'sm' | 'md';
  className?: string;
}

const toneClass: Record<ValueKind, string> = {
  gain: styles.toneGain,
  cost: styles.toneCost,
  at_risk: styles.toneAtRisk,
  info: styles.toneInfo,
};

export function ValuePill({ cents, kind, cadence, size = 'sm', className }: Props) {
  const f = formatValue({ cents, kind, cadence });
  return (
    <span className={cn(styles.valuePill, toneClass[kind], size === 'md' ? styles.md : styles.sm, className)} aria-label={f.ariaLabel}>
      {f.text}
    </span>
  );
}