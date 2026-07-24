import styles from './decision-card.module.scss';
import type { Decision } from '@/constants/signals/decisions.constants';

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

function formatValue(cents: number, kind: string): string {
  const amt = (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
  if (kind === 'savings') return amt;
  if (kind === 'risk') return amt;
  return amt;
}

export function DecisionCard({ decision: d, selected, onSelect, onApprove }: DecisionCardProps) {
  const isActionable = d.status === 'open';

  return (
    <div
      className={`${styles.decisionCard} ${selected ? styles.selected : ''}`}
      onClick={onSelect}
    >
      <div className={styles.topRow}>
        <span className={`${styles.severityDot} ${styles[`severity_${d.severity}`]}`} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className={styles.source}>{d.sourceLabel} · {d.domain}</div>
          <div className={styles.insight}>{d.insight}</div>
          <div className={styles.meta}>
            <span className={`${styles.valueBadge} ${styles[`value_${d.valueKind}`]}`}>
              {formatValue(d.valueCents, d.valueKind)} {d.valueCaption}
            </span>
            <span className={styles.separator}>·</span>
            <span>{formatTime(d.createdAt)}</span>
            {d.status !== 'open' && (
              <>
                <span className={styles.separator}>·</span>
                <span style={{ textTransform: 'uppercase', fontSize: '0.9rem', color: '#7c7c7c' }}>
                  {d.status.replace('_', ' ')}
                </span>
              </>
            )}
          </div>
          {isActionable && onApprove && (
            <button
              className={styles.actionBtn}
              onClick={(e) => { e.stopPropagation(); onApprove(d.id); }}
            >
              {d.actionVerb} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}