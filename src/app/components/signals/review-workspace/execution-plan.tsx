import type { Strategy } from '@/utils/signals/strategies';

interface Props {
  strategy: Strategy;
}

export function ExecutionPlan({ strategy }: Props) {
  if (!strategy.steps.length) return null;
  return (
    <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {strategy.steps.map((step, i) => (
        <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: '50%', background: 'rgba(119,70,155,0.08)', border: '1px solid rgba(119,70,155,0.25)', color: '#77469b', fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
            {i + 1}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '1.15rem', color: '#23272d' }}>{step.label}</div>
            {step.note && <div style={{ fontSize: '1rem', color: '#7c7c7c', marginTop: 2 }}>{step.note}</div>}
          </div>
        </li>
      ))}
      <li style={{ display: 'flex', gap: 10, alignItems: 'flex-start', paddingTop: 6, borderTop: '1px solid #e1e4e8' }}>
        <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: '50%', background: '#f6f6f7', border: '1px solid #e1e4e8', color: '#9a9a9a', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          ↺
        </span>
        <span style={{ fontSize: '1.05rem', color: '#7c7c7c' }}>
          Rollback automatically if metrics regress within 24 h.
        </span>
      </li>
    </ol>
  );
}