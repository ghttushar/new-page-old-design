import { useState } from 'react';
import { Funnel } from '@phosphor-icons/react';
import { Drawer, Button } from '@mui/material';
import type { DecisionSource } from '@/utils/signals/sourceRegistry';
import { SOURCE_REGISTRY } from '@/utils/signals/sourceRegistry';
import type { DecisionDomain } from '@/constants/signals/decisions.constants';

export interface FilterState {
  sources: Set<DecisionSource>;
  domains: Set<DecisionDomain>;
  window: 'any' | 'today' | 'yesterday' | 'week';
}

export const EMPTY_FILTER: FilterState = {
  sources: new Set(),
  domains: new Set(),
  window: 'any',
};

const DOMAINS: { key: DecisionDomain; label: string }[] = [
  { key: 'campaign', label: 'Advertising' },
  { key: 'retail', label: 'Retail / Listings' },
  { key: 'profitability', label: 'Profitability' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'cs', label: 'Customer service' },
  { key: 'buyer', label: 'Buyer / Accounts' },
];

const WINDOWS: { key: FilterState['window']; label: string }[] = [
  { key: 'any', label: 'Any time' },
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'week', label: 'This week' },
];

interface Props {
  value: FilterState;
  onChange: (f: FilterState) => void;
  activeCount: number;
}

export function FilterSheet({ value, onChange, activeCount }: Props) {
  const [draft, setDraft] = useState<FilterState>(value);
  const [open, setOpen] = useState(false);

  const toggle = <T,>(set: Set<T>, k: T): Set<T> => {
    const n = new Set(set);
    n.has(k) ? n.delete(k) : n.add(k);
    return n;
  };

  const apply = () => { onChange(draft); setOpen(false); };
  const reset = () => {
    const e = { ...EMPTY_FILTER, sources: new Set<DecisionSource>(), domains: new Set<DecisionDomain>() };
    setDraft(e);
    onChange(e);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => { setOpen(true); setDraft(value); }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4, height: 28,
          padding: '0 10px', borderRadius: 4, border: '1px solid #e1e4e8',
          background: '#fff', color: '#7c7c7c', fontSize: '1rem', cursor: 'pointer',
        }}
      >
        <Funnel size={14} /> Filter
        {activeCount > 0 && (
          <span style={{ marginLeft: 2, borderRadius: 999, background: '#77469b', color: '#fff', fontSize: '0.85rem', fontWeight: 600, padding: '0 5px', lineHeight: '14px' }}>
            {activeCount}
          </span>
        )}
      </button>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: 360, display: 'flex', flexDirection: 'column' } }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e1e4e8' }}>
          <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 600, color: '#23272d' }}>Narrow the list</h3>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <section>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#7c7c7c', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Source</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              {Object.values(SOURCE_REGISTRY).map((s) => {
                const on = draft.sources.has(s.key);
                return (
                  <button
                    key={s.key}
                    onClick={() => setDraft((d) => ({ ...d, sources: toggle(d.sources, s.key) }))}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 4,
                      border: on ? '1px solid rgba(119,70,155,0.35)' : '1px solid #e1e4e8',
                      background: on ? 'rgba(119,70,155,0.04)' : 'transparent',
                      color: on ? '#77469b' : '#474747',
                      fontSize: '1rem', cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <span style={{ width: 14, height: 14, borderRadius: 3, border: on ? '2px solid #77469b' : '1px solid #d1d5db', background: on ? '#77469b' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {on && <span style={{ color: '#fff', fontSize: 10 }}>✓</span>}
                    </span>
                    {s.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#7c7c7c', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Area</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              {DOMAINS.map((d) => {
                const on = draft.domains.has(d.key);
                return (
                  <button
                    key={d.key}
                    onClick={() => setDraft((s) => ({ ...s, domains: toggle(s.domains, d.key) }))}
                    style={{
                      padding: '5px 8px', borderRadius: 4,
                      border: on ? '1px solid rgba(119,70,155,0.35)' : '1px solid #e1e4e8',
                      background: on ? 'rgba(119,70,155,0.04)' : 'transparent',
                      color: on ? '#77469b' : '#474747',
                      fontSize: '1rem', cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#7c7c7c', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Time window</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {WINDOWS.map((w) => (
                <button
                  key={w.key}
                  onClick={() => setDraft((d) => ({ ...d, window: w.key }))}
                  style={{
                    padding: '4px 10px', borderRadius: 4,
                    border: draft.window === w.key ? '1px solid rgba(119,70,155,0.35)' : '1px solid #e1e4e8',
                    background: draft.window === w.key ? 'rgba(119,70,155,0.04)' : 'transparent',
                    color: draft.window === w.key ? '#77469b' : '#474747',
                    fontSize: '1rem', cursor: 'pointer',
                  }}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div style={{ padding: '12px 20px', borderTop: '1px solid #e1e4e8', display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={reset} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem', color: '#7c7c7c' }}>Reset</button>
          <button onClick={apply} style={{ padding: '6px 16px', borderRadius: 4, border: 'none', background: '#77469b', color: '#fff', fontSize: '1rem', cursor: 'pointer' }}>Apply</button>
        </div>
      </Drawer>
    </>
  );
}

export function countActiveFilters(f: FilterState): number {
  return f.sources.size + f.domains.size + (f.window !== 'any' ? 1 : 0);
}