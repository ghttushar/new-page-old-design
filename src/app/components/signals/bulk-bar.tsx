import { useMemo } from 'react';
import { CheckCircle, XCircle, X, CaretDown, Pen } from '@phosphor-icons/react';
import type { Decision } from '@/constants/signals/decisions.constants';
import { valueMagnitude, formatValue } from '@/utils/signals/valueFormat';

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
    <div style={{
      marginBottom: 12,
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 8,
      borderRadius: 6,
      border: '1px solid rgba(119,70,155,0.35)',
      background: 'rgba(119,70,155,0.04)',
      padding: '8px 12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: '1.15rem', fontWeight: 600, color: '#23272d' }}>
          {items.length} selected
        </span>
        {totalFmt && (
          <span style={{ fontSize: '1.05rem', fontFamily: 'monospace', color: '#429488' }}>total value {totalFmt}</span>
        )}
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
        <button
          onClick={() => { onBulkApprove(ids); onClear(); }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4, height: 30,
            padding: '0 10px', borderRadius: 4, border: 'none',
            background: '#77469b', color: '#fff', fontSize: '1rem', cursor: 'pointer',
          }}
        >
          <CheckCircle size={14} weight="fill" /> Approve all
        </button>

        <button
          onClick={() => { onBulkDelegate(ids); onClear(); }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4, height: 30,
            padding: '0 8px', borderRadius: 4, border: '1px solid #e1e4e8',
            background: '#fff', color: '#7c7c7c', fontSize: '1rem', cursor: 'pointer',
          }}
        >
          <Pen size={14} /> Custom
        </button>

        <button
          onClick={() => { onBulkDismiss(ids); onClear(); }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4, height: 30,
            padding: '0 8px', borderRadius: 4, border: '1px solid rgba(255,0,0,0.25)',
            background: 'transparent', color: '#ff0000', fontSize: '1rem', cursor: 'pointer',
          }}
        >
          <XCircle size={14} /> Dismiss
        </button>

        <button
          onClick={onClear}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            height: 30, width: 30, borderRadius: 4, border: 'none',
            background: 'transparent', color: '#7c7c7c', cursor: 'pointer',
          }}
          title="Clear selection"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}