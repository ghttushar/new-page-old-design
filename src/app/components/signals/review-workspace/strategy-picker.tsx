import type { Strategy } from '@/utils/signals/strategies';

interface Props {
  strategies: Strategy[];
  selectedId: string;
  onSelect: (id: string) => void;
  customValue?: string;
  onCustomChange?: (v: string) => void;
}

export function StrategyPicker({ strategies, selectedId, onSelect, customValue, onCustomChange }: Props) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {strategies.map((s) => {
        const active = s.id === selectedId;
        const isCustom = s.id.endsWith(':custom');
        return (
          <li key={s.id}>
            <button
              onClick={() => onSelect(s.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                borderRadius: 10,
                border: 'none',
                background: active ? 'rgba(119,70,155,0.05)' : 'transparent',
                padding: active && isCustom ? '10px 14px 14px' : '10px 14px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{
                  marginTop: 3, width: 16, height: 16, borderRadius: '50%',
                  border: active ? '5px solid #77469b' : '1.5px solid #d1d5db',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  transition: 'border 0.15s',
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#23272d' }}>{s.title}</span>
                    {s.recommended && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.85rem', fontWeight: 600, color: '#77469b' }}>
                        ◆ Recommended
                      </span>
                    )}
                  </div>
                  {active && isCustom ? (
                    <input
                      autoFocus
                      value={customValue ?? ''}
                      onChange={(e) => onCustomChange?.(e.target.value)}
                      placeholder="Type your instruction for Aan…"
                      style={{
                        display: 'block',
                        width: '100%',
                        boxSizing: 'border-box',
                        marginTop: 8,
                        padding: '8px 10px',
                        border: 'none',
                        borderRadius: 8,
                        background: '#f5f6f7',
                        fontSize: '0.95rem',
                        fontFamily: 'Inter, sans-serif',
                        color: '#23272d',
                        outline: 'none',
                        lineHeight: 1.5,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div style={{ marginTop: 3, fontSize: '1rem', lineHeight: 1.5, color: '#676f7e' }}>{s.detail}</div>
                  )}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}