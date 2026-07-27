import { ArrowRight, WarningCircle } from '@phosphor-icons/react';
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

function formatTime(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.round(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

const valueTone: Record<string, string> = {
  gain: styles.toneGain,
  cost: styles.toneCost,
  at_risk: styles.toneAtRisk,
  info: styles.toneInfo,
};

export function DecisionCard({ decision: d, selected, onSelect, onApprove }: DecisionCardProps) {
  const isActionable = d.status === 'open';
  const isDone = d.status === 'completed' || d.status === 'rejected' || d.status === 'in_flight' || d.status === 'with_aan';
  const f = formatValue({ cents: d.valueCents, kind: d.valueKind, cadence: d.cadence });

  return (
    <div
      className={`${styles.decisionCard} ${selected ? styles.selected : ''} ${isDone ? styles.done : ''}`}
      onClick={onSelect}
    >
      {selected && <span className={styles.selectedBar} />}
      <div className={styles.topRow}>
        <span className={`${styles.severityDot} ${styles[`severity_${d.severity}`]}`} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Chips row */}
          <div className={styles.chipsRow}>
            <SourcePill decision={d} size="sm" />
            {d.severity === 'critical' && (
              <span className={styles.criticalBadge}>
                <WarningCircle size={10} weight="fill" /> Critical
              </span>
            )}
            {d.status !== 'open' && (
              <span className={styles.statusLabel}>{d.status.replace('_', ' ')}</span>
            )}
          </div>
          {/* Value headline */}
          <div className={`${styles.valueHeadline} ${valueTone[d.valueKind] || ''}`}>
            {f.text}
          </div>
          <div className={styles.valueCaption}>{d.valueCaption}</div>
          {/* Insight */}
          <div className={styles.insight}>{d.insight}</div>
          {/* Meta row */}
          <div className={styles.meta}>
            <span>{formatTime(d.createdAt)}</span>
          </div>
          {/* Action button */}
          {isActionable && onApprove && (
            <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); onApprove(d.id); }}>
              {d.actionVerb} <ArrowRight size={12} weight="bold" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
