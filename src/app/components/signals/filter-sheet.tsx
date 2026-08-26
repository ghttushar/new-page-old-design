import { useState, useRef, useEffect } from 'react';
import { Funnel } from '@phosphor-icons/react';
import type { DecisionSource } from '@/utils/signals/sourceRegistry';
import { SOURCE_REGISTRY } from '@/utils/signals/sourceRegistry';
import type { DecisionDomain } from '@/constants/signals/decisions.constants';
import s from './filter-sheet.module.scss';

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
  activeCategory?: string | null;
  onChange: (f: FilterState) => void;
  activeCount: number;
}

export function FilterSheet({ value, onChange, activeCount, activeCategory }: Props) {
  const [draft, setDraft] = useState<FilterState>(value);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const toggle = <T,>(set: Set<T>, k: T): Set<T> => {
    const n = new Set(set);
    n.has(k) ? n.delete(k) : n.add(k);
    return n;
  };

  const apply = () => {
    onChange(draft);
    setOpen(false);
  };

  const reset = () => {
    const e: FilterState = {
      ...EMPTY_FILTER,
      sources: new Set<DecisionSource>(),
      domains: new Set<DecisionDomain>(),
    };
    setDraft(e);
    onChange(e);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
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
    <div className={s.wrapper}>
      <button
        ref={btnRef}
        className={s.toggleBtn}
        onClick={() => setOpen((o) => !o)}
      >
        <Funnel size={16} /> Filter
        {activeCategory && activeCategory !== '__all__' && (
          <span className={s.badge}>{activeCategory}</span>
        )}
        {activeCount > 0 && (
          <span className={s.count}>{activeCount}</span>
        )}
      </button>

      {open && (
        <div ref={panelRef} className={s.panel}>
          <div className={s.panelHeader}>
            <h3 className={s.panelTitle}>Narrow the list</h3>
          </div>

          <div className={s.panelBody}>
            <section>
              <div className={s.sectionLabel}>Source</div>
              <div className={s.checkboxGrid}>
                {Object.values(SOURCE_REGISTRY).map((src) => {
                  const on = draft.sources.has(src.key);
                  return (
                    <label
                      key={src.key}
                      className={`${s.checkboxItem}${on ? ` ${s.active}` : ''}`}
                    >
                      <input
                        type="checkbox"
                        className={s.hiddenInput}
                        checked={on}
                        onChange={() =>
                          setDraft((d) => ({
                            ...d,
                            sources: toggle(d.sources, src.key),
                          }))
                        }
                      />
                      <span className={`${s.checkMark}${on ? ` ${s.active}` : ''}`}>
                        {on && <span className={s.checkIcon}>✓</span>}
                      </span>
                      {src.label}
                    </label>
                  );
                })}
              </div>
            </section>

            <section>
              <div className={s.sectionLabel}>Area</div>
              <div className={s.pillGrid}>
                {DOMAINS.map((d) => {
                  const on = draft.domains.has(d.key);
                  return (
                    <label
                      key={d.key}
                      className={`${s.checkboxItem}${on ? ` ${s.active}` : ''}`}
                    >
                      <input
                        type="checkbox"
                        className={s.hiddenInput}
                        checked={on}
                        onChange={() =>
                          setDraft((s) => ({
                            ...s,
                            domains: toggle(s.domains, d.key),
                          }))
                        }
                      />
                      <span className={`${s.checkMark}${on ? ` ${s.active}` : ''}`}>
                        {on && <span className={s.checkIcon}>✓</span>}
                      </span>
                      {d.label}
                    </label>
                  );
                })}
              </div>
            </section>

            <section>
              <div className={s.sectionLabel}>Time window</div>
              <div className={s.pillWrap}>
                {WINDOWS.map((w) => (
                  <button
                    key={w.key}
                    className={`${s.pill}${draft.window === w.key ? ` ${s.active}` : ''}`}
                    onClick={() => setDraft((d) => ({ ...d, window: w.key }))}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className={s.panelFooter}>
            <button className={s.resetBtn} onClick={reset}>
              Reset
            </button>
            <button className={s.applyBtn} onClick={apply}>
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function countActiveFilters(f: FilterState): number {
  return f.sources.size + f.domains.size + (f.window !== 'any' ? 1 : 0);
}
