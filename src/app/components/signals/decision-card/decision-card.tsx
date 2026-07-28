import { ArrowRight, WarningCircle, DotsThree } from '@phosphor-icons/react';
import styles from './decision-card.module.scss';
import type { Decision } from '@/constants/signals/decisions.constants';
import { formatValue } from '@/utils/signals/valueFormat';
import { SourcePill } from '../chips/source-pill';

interface DecisionCardProps {
  decision: Decision;
  selected: boolean;
  onSelect: () => void;
  onApprove?: (id: string) => void;
}

export function DecisionCard({ decision: d, selected, onSelect, onApprove }: DecisionCardProps) {
  const isDone = d.status === 'completed' || d.status === 'rejected' || d.status === 'in_flight' || d.status === 'with_aan';
  const f = formatValue({ cents: d.valueCents, kind: d.valueKind, cadence: d.cadence });

  return (
    <div
      className={`${styles.decisionCard} ${selected ? styles.selected : ''} ${isDone ? styles.done : ''}`}
      onClick={onSelect}
    >
      {selected && <span className={styles.selectedBar} />}
      <div className={styles.cardBody}>
        <div className={styles.valueHeadline}>{f.text}</div>
        <div className={styles.valueCaption}>{d.valueCaption}</div>
        <div className={styles.insight}>{d.insight}</div>
        <div className={styles.chipsRow}>
          <SourcePill decision={d} size="sm" />
          {d.severity === 'critical' && (
            <span className={styles.criticalBadge}>
              <WarningCircle size={10} weight="fill" /> Critical
            </span>
          )}
        </div>
      </div>
      <div className={styles.cardActions}>
        <button className={styles.reviewBtn} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
          Review <ArrowRight size={12} weight="bold" />
        </button>
        <button className={styles.menuBtn} onClick={(e) => e.stopPropagation()}>
          <DotsThree size={16} weight="bold" />
        </button>
      </div>
    </div>
  );
}
