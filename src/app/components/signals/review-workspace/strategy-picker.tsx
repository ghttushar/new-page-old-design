import type { Strategy } from '@/utils/signals/strategies';

interface Props {
  strategies: Strategy[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function StrategyPicker({ strategies, selectedId, onSelect }: Props) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {strategies.map((s) => {
        const active = s.id === selectedId;
        return (
          <li key={s.id}>
            <button
              onClick={() => onSelect(s.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                borderRadius: 8,
                border: active ? '1px solid #77469b' : '1px solid #e1e4e8',
                background: active ? 'rgba(119,70,155,0.04)' : '#fff',
                padding: '12px 16px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                boxShadow: active ? '0 0 0 1px rgba(119,70,155,0.25), 0 10px 28px -14px rgba(119,70,155,0.35)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ marginTop: 2, width: 14, height: 14, borderRadius: '50%', border: active ? '4px solid #77469b' : '1px solid #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 600, color: '#23272d' }}>{s.title}</span>
                    {s.recommended && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.9rem', fontWeight: 600, color: '#77469b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        ◆ Recommended
                      </span>
                    )}
                  </div>
                  <div style={{ marginTop: 4, fontSize: '1.1rem', lineHeight: 1.5, color: '#474747' }}>{s.detail}</div>
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}