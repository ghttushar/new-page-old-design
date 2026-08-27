import { Sparkle, CheckCircle, Clock } from '@phosphor-icons/react';
import type { MeetingTask } from '@/constants/signals/mockMeetings';
import { formatValue } from '@/utils/signals/valueFormat';

interface Props {
  task: MeetingTask;
  onAskJiva: (task: MeetingTask) => void;
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string; Icon: typeof CheckCircle }> = {
  open: { color: '#77469b', bg: 'rgba(119,70,155,0.08)', label: 'Open', Icon: Clock },
  completed: { color: '#10b981', bg: 'rgba(16,185,129,0.08)', label: 'Done', Icon: CheckCircle },
  with_aan: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', label: 'In progress', Icon: Clock },
  not_completed: { color: '#7c7c7c', bg: 'rgba(124,124,124,0.08)', label: 'Skipped', Icon: Clock },
};

export function MeetingPrepItem({ task, onAskJiva }: Props) {
  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.open;
  const val = task.valueKind === 'info'
    ? { text: 'Info', kind: 'info' as const }
    : formatValue({ cents: task.valueCents, kind: task.valueKind, cadence: task.cadence });

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '10px 14px',
      borderRadius: 8,
      border: '1px solid #e8e8ec',
      background: '#fff',
      transition: 'border-color 0.15s, box-shadow 0.15s',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(119,70,155,0.3)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(119,70,155,0.06)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e8e8ec'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <span style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: status.color,
        flexShrink: 0,
        marginTop: 6,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 500, color: '#23272d', lineHeight: 1.4 }}>
          {task.insight}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
          {task.owner && (
            <span style={{ fontSize: '0.85rem', color: '#7c7c7c' }}>
              {task.owner}
            </span>
          )}
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '1px 6px',
            borderRadius: 4,
            background: status.bg,
            color: status.color,
            textTransform: 'capitalize',
          }}>
            {status.label}
          </span>
          {val.text !== 'Info' && (
            <span style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              color: task.valueKind === 'gain' ? '#429488' : task.valueKind === 'cost' ? '#f1a03a' : task.valueKind === 'at_risk' ? '#d97706' : '#7c7c7c',
            }}>
              {val.text}
            </span>
          )}
        </div>
      </div>
      {task.status === 'open' && (
        <button
          onClick={() => onAskJiva(task)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '5px 10px',
            borderRadius: 6,
            border: '1px solid rgba(119,70,155,0.25)',
            background: 'rgba(119,70,155,0.04)',
            color: '#77469b',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(119,70,155,0.12)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(119,70,155,0.04)'; }}
        >
          <Sparkle size={12} weight="fill" /> Ask Jiva
        </button>
      )}
    </div>
  );
}
