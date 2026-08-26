import { useMemo } from 'react';
import { CheckCircle, XCircle, X, Sparkle } from '@phosphor-icons/react';
import type { Decision } from '@/constants/signals/decisions.constants';
import { valueMagnitude, formatValue } from '@/utils/signals/valueFormat';
import styles from './bulk-bar.module.scss';

interface Props {
  selectedIds: string[];
  decisions: Decision[];
  onClear: () => void;
  onBulkApprove: (ids: string[]) => void;
  onBulkDelegate: (ids: string[]) => void;
  onBulkDismiss: (ids: string[]) => void;
}

export function BulkBar({ selectedIds, decisions, onClear, onBulkApprove, onBulkDelegate, onBulkDismiss }: Props) {
  const items = useMemo(
    () => decisions.filter((d) => selectedIds.includes(d.id) && d.status === 'open'),
    [decisions, selectedIds],
  );

  if (items.length < 1) return null;

  const totalCents = items.reduce((s, d) => s + valueMagnitude(d.valueKind, d.valueCents), 0);
  const totalFmt = totalCents > 0 ? formatValue({ cents: totalCents, kind: 'gain' }).text.replace('+ ', '') : null;
  const ids = items.map((i) => i.id);

  return (
    <div className={styles.bulkBar}>
      <div className={styles.info}>
        <span className={styles.count}>{items.length} selected</span>
        {totalFmt && <span className={styles.total}>total value {totalFmt}</span>}
      </div>
      <div className={styles.actions}>
        <button className={styles.approveBtn} onClick={() => { onBulkApprove(ids); onClear(); }}>
          <CheckCircle size={14} weight="fill" /> Approve all
        </button>
        <button className={styles.delegateBtn} onClick={() => { onBulkDelegate(ids); onClear(); }}>
          <Sparkle size={14} /> Delegate to Jiva
        </button>
        <button className={styles.dismissBtn} onClick={() => { onBulkDismiss(ids); onClear(); }}>
          <XCircle size={14} /> Dismiss
        </button>
        <button className={styles.clearBtn} onClick={onClear} title="Clear selection">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
