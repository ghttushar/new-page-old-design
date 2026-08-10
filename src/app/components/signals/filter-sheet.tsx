import { useState, useRef, useEffect } from 'react';
import { Funnel } from '@phosphor-icons/react';
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

interface CategoryItem {
  key: string;
  label: string;
  count: number;
}

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
  categories?: CategoryItem[];
  activeCategory?: string | null;
  onCategoryChange?: (key: string) => void;
  onChange: (f: FilterState) => void;
  activeCount: number;
}

export function FilterSheet({ value, onChange, activeCount, categories = [], activeCategory, onCategoryChange }: Props) {
  const [draft, setDraft] = useState<FilterState>(value);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) && btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4, height: 28,
          padding: '0 16px', borderRadius: 8, border: '1px solid #d0d3d9',
          background: '#fff', color: '#7c7c7c', fontSize: '1rem', cursor: 'pointer',
        }}
      >
        <Funnel size={14} /> Filter
        {activeCategory && activeCategory !== '__all__' && (
          <span style={{ marginLeft: 2, borderRadius: 8, background: 'rgba(119,70,155,0.1)', color: '#77469b', fontSize: '0.85rem', fontWeight: 500, padding: '0 5px', lineHeight: '14px' }}>
            {categories.find(c => c.key === activeCategory)?.label || activeCategory}
          </span>
        )}
        {activeCount > 0 && (
          <span style={{ marginLeft: 2, borderRadius: 999, background: '#77469b', color: '#fff', fontSize: '0.85rem', fontWeight: 600, padding: '0 5px', lineHeight: '14px' }}>
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 100,
            width: 380, maxHeight: '70vh', overflow: 'auto',
            background: '#fff', border: '1px solid #e1e4e8', borderRadius: 12,
            boxShadow: '0 12px 40px -8px rgba(0,0,0,0.18)',
          }}
        >
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e1e4e8' }}>
            <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 600, color: '#23272d' }}>Narrow the list</h3>
          </div>

          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {categories.length > 0 && (
              <section>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#7c7c7c', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Category</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  <button
                    onClick={() => onCategoryChange?.('__all__')}
                    style={{
                      padding: '4px 10px', borderRadius: 8, border: '1px solid #e1e4e8',
                      background: (!activeCategory || activeCategory === '__all__') ? '#77469b' : 'transparent',
                      color: (!activeCategory || activeCategory === '__all__') ? '#fff' : '#474747',
                      fontSize: '1rem', cursor: 'pointer',
                    }}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => onCategoryChange?.(cat.key)}
                      style={{
                        padding: '4px 10px', borderRadius: 8, border: '1px solid #e1e4e8',
                        background: activeCategory === cat.key ? '#77469b' : 'transparent',
                        color: activeCategory === cat.key ? '#fff' : '#474747',
                        fontSize: '1rem', cursor: 'pointer',
                      }}
                    >
                      {cat.label} · {cat.count}
                    </button>
                  ))}
                </div>
              </section>
            )}
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
                        display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 8,
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
                        padding: '5px 8px', borderRadius: 8,
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
                      padding: '4px 10px', borderRadius: 8,
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
            <button onClick={apply} style={{ padding: '6px 16px', borderRadius: 8, border: 'none', background: '#77469b', color: '#fff', fontSize: '1rem', cursor: 'pointer' }}>Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function countActiveFilters(f: FilterState): number {
  return f.sources.size + f.domains.size + (f.window !== 'any' ? 1 : 0);
}
