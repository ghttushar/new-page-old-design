import { CalendarBlank, Users, ArrowRight } from '@phosphor-icons/react';
import type { Decision } from '@/constants/signals/decisions.constants';
import { formatValue } from '@/utils/signals/valueFormat';

interface Props {
  bundleId: string;
  title: string;
  signals: Decision[];
  selected: boolean;
  onSelect: () => void;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const hr = diff / 3_600_000;
  if (hr < 1) return `${Math.max(1, Math.round(diff / 60_000))}m ago`;
  if (hr < 24) return `${Math.round(hr)}h ago`;
  return `${Math.round(hr / 24)}d ago`;
}

export function MeetingCard({ bundleId, title, signals, selected, onSelect }: Props) {
  const total = signals.reduce((n, d) => n + (d.valueKind === 'info' ? 0 : Math.abs(d.valueCents)), 0);
  const totalStr = total > 0 ? formatValue({ cents: total, kind: 'gain' }).text : null;
  const earliest = Math.min(...signals.map((d) => d.sourceRef.ts));

  return (
    <div
      onClick={onSelect}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        padding: '12px 16px',
        cursor: 'pointer',
        borderBottom: '1px solid #e1e4e8',
        transition: 'all 0.15s',
        background: selected ? 'rgba(119,70,155,0.04)' : 'transparent',
        position: 'relative',
      }}
    >
      {selected && (
        <span style={{ position: 'absolute', inset: '6px auto 6px 0', width: 3, borderRadius: '0 3px 3px 0', background: '#77469b' }} />
      )}
      <span style={{ flexShrink: 0, marginTop: 2, width: 32, height: 32, borderRadius: '50%', background: 'rgba(119,70,155,0.08)', border: '1px solid rgba(119,70,155,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CalendarBlank size={16} color="#77469b" />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#23272d', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</h3>
          <span style={{ fontSize: '0.9rem', color: '#7c7c7c', flexShrink: 0 }}>{timeAgo(earliest)}</span>
        </div>
        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 12, fontSize: '1rem', color: '#7c7c7c', flexWrap: 'wrap' }}>
          <span><span style={{ fontWeight: 500, color: '#474747' }}>{signals.length}</span> signal{signals.length === 1 ? '' : 's'}</span>
          {totalStr && <span><span style={{ fontWeight: 500, color: '#429488' }}>{totalStr}</span> aggregate impact</span>}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Users size={12} /> Bundle</span>
        </div>
      </div>
      <div>
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          style={{
            height: 26, padding: '0 10px', borderRadius: 4, border: selected ? 'none' : '1px solid #e1e4e8',
            background: selected ? '#77469b' : 'transparent',
            color: selected ? '#fff' : '#7c7c7c',
            fontSize: '1rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
          }}
        >
          Open <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}