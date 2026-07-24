import styles from './review-workspace.module.scss';
import type { Decision } from '@/constants/signals/decisions.constants';

interface ReviewWorkspaceProps {
  decision: Decision | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onDelegate: (id: string) => void;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function formatValue(cents: number): string {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
}

export function ReviewWorkspace({ decision: d, onClose, onApprove, onDelegate }: ReviewWorkspaceProps) {
  if (!d) {
    return (
      <div className={styles.reviewWorkspace}>
        <div className={styles.emptyDetail}>
          <div className={styles.bigIcon}>📋</div>
          <h3>Select a signal to review</h3>
        </div>
      </div>
    );
  }

  const isActionable = d.status === 'open';
  const isClosed = d.status === 'completed' || d.status === 'rejected';

  return (
    <div className={styles.reviewWorkspace}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <div className={styles.sourceBadge}>
            {d.sourceLabel} · {d.domain}
          </div>
          <h2 className={styles.title}>{d.insight}</h2>
        </div>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
      </div>

      <div className={styles.body}>
        {/* Why it matters */}
        <div className={styles.section}>
          <div className={styles.eyebrow}>Why it matters</div>
          <div className={styles.valueBlock}>
            <div className={styles.amount}>{formatValue(d.valueCents)}</div>
            <div className={styles.caption}>{d.valueCaption}</div>
          </div>
          {d.valueBasis && <p className={styles.text}>{d.valueBasis}</p>}
        </div>

        {/* Detail */}
        {d.insightDetail && (
          <div className={styles.section}>
            <div className={styles.eyebrow}>Details</div>
            <p className={styles.text}>{d.insightDetail}</p>
          </div>
        )}

        {/* Evidence */}
        {d.valueInputs && d.valueInputs.length > 0 && (
          <div className={styles.section}>
            <div className={styles.eyebrow}>Evidence</div>
            <ul className={styles.inputList}>
              {d.valueInputs.map((v, i) => <li key={i}>{v}</li>)}
            </ul>
          </div>
        )}

        {/* Source */}
        <div className={styles.section}>
          <div className={styles.eyebrow}>Source</div>
          <p className={styles.text} style={{ fontSize: '1.1rem', color: '#7c7c7c' }}>
            {d.sourceLabel} · {formatTime(d.createdAt)}
          </p>
        </div>

        {/* Meeting context */}
        {d.meetingRef && (
          <div className={styles.section}>
            <div className={styles.eyebrow}>From meeting</div>
            <p className={styles.text} style={{ fontWeight: 500 }}>{d.meetingRef.title}</p>
            {d.meetingRef.excerpt && (
              <p className={styles.text} style={{ fontStyle: 'italic', color: '#7c7c7c', marginTop: '0.4rem' }}>
                "{d.meetingRef.excerpt}"
              </p>
            )}
          </div>
        )}
      </div>

      {!isClosed && (
        <div className={styles.footer}>
          {isActionable && (
            <>
              <button className={styles.primaryBtn} onClick={() => onApprove(d.id)}>
                {d.actionVerb} →
              </button>
              <button className={styles.secondaryBtn} onClick={() => onDelegate(d.id)}>
                Hand to Aan
              </button>
            </>
          )}
          {d.status === 'with_aan' && (
            <span style={{ fontSize: '1.1rem', color: '#77469b', fontWeight: 500 }}>
              ● Aan is working on this
            </span>
          )}
        </div>
      )}
      {isClosed && (
        <div className={styles.footer}>
          <span style={{ fontSize: '1.1rem', color: '#7c7c7c' }}>
            {d.status === 'completed' ? '✅ Completed' : '✕ Rejected'}
          </span>
        </div>
      )}
    </div>
  );
}