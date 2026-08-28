import { useState, useRef, useEffect } from 'react';
import { X, Check, Funnel, Lightning, Robot, CalendarBlank, ChatCircle, Users, Envelope } from '@phosphor-icons/react';
import type { DecisionSource } from '@/utils/signals/sourceRegistry';
import { SOURCE_REGISTRY } from '@/utils/signals/sourceRegistry';
import type { DecisionDomain, DecisionSeverity } from '@/constants/signals/decisions.constants';
import s from './filter-sheet.module.scss';

const SOURCE_ICONS: Record<DecisionSource, React.ReactNode> = {
  anarix: <Lightning size={14} weight="fill" />,
  aan: <Robot size={14} weight="fill" />,
  meeting: <CalendarBlank size={14} weight="fill" />,
  slack: <ChatCircle size={14} weight="fill" />,
  teams: <Users size={14} weight="fill" />,
  email: <Envelope size={14} weight="fill" />,
};

export interface FilterState {
  sources: Set<DecisionSource>;
  domains: Set<DecisionDomain>;
  priorities: Set<DecisionSeverity>;
  window: 'any' | 'today' | 'yesterday' | 'week';
}

export const EMPTY_FILTER: FilterState = {
  sources: new Set(),
  domains: new Set(),
  priorities: new Set(),
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

const PRIORITIES: { key: DecisionSeverity; label: string; color: string }[] = [
  { key: 'critical', label: 'Critical', color: '#7c7c7c' },
  { key: 'opportunity', label: 'Opportunity', color: '#7c7c7c' },
  { key: 'fyi', label: 'FYI', color: '#7c7c7c' },
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
      priorities: new Set<DecisionSeverity>(),
    };
    setDraft(e);
    onChange(e);
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
    <>
      <button
        ref={btnRef}
        className={s.toggleBtn}
        onClick={() => setOpen((o) => !o)}
      >
        <Funnel size={14} /> Filter
        {activeCount > 0 && (
          <span className={s.filterBadge}>{activeCount}</span>
        )}
      </button>

      {/* Backdrop */}
      {open && <div className={s.backdrop} onClick={() => setOpen(false)} />}

      {/* Slide-in panel */}
      <div ref={panelRef} className={`${s.panel} ${open ? s.panelOpen : ''}`}>
        <div className={s.panelHeader}>
          <div className={s.panelTitleRow}>
            <h3 className={s.panelTitle}>Filters</h3>
            <button className={s.closeBtn} onClick={() => setOpen(false)}>
              <X size={16} />
            </button>
          </div>
          {activeCount > 0 && (
            <button className={s.resetLink} onClick={reset}>
              Reset all
            </button>
          )}
        </div>

        <div className={s.panelBody}>
          {/* Source */}
          <section className={s.section}>
            <div className={s.sectionLabel}>Source</div>
            <div className={s.checkboxList}>
              {Object.values(SOURCE_REGISTRY).map((src) => {
                const on = draft.sources.has(src.key);
                return (
                  <label
                    key={src.key}
                    className={`${s.checkboxItem} ${on ? s.checkboxItemActive : ''}`}
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
                    <span className={`${s.checkMark} ${on ? s.checkMarkActive : ''}`}>
                      {on && <Check size={10} weight="bold" />}
                    </span>
                    <span className={s.sourceIcon}>{SOURCE_ICONS[src.key]}</span>
                    <span className={s.checkboxLabel}>{src.label}</span>
                  </label>
                );
              })}
            </div>
          </section>

          <div className={s.divider} />

          {/* Domain */}
          <section className={s.section}>
            <div className={s.sectionLabel}>Domain</div>
            <div className={s.checkboxList}>
              {DOMAINS.map((d) => {
                const on = draft.domains.has(d.key);
                return (
                  <label
                    key={d.key}
                    className={`${s.checkboxItem} ${on ? s.checkboxItemActive : ''}`}
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
                    <span className={`${s.checkMark} ${on ? s.checkMarkActive : ''}`}>
                      {on && <Check size={10} weight="bold" />}
                    </span>
                    <span className={s.checkboxLabel}>{d.label}</span>
                  </label>
                );
              })}
            </div>
          </section>

          <div className={s.divider} />

          {/* Priority */}
          <section className={s.section}>
            <div className={s.sectionLabel}>Priority</div>
            <div className={s.checkboxList}>
              {PRIORITIES.map((p) => {
                const on = draft.priorities.has(p.key);
                return (
                  <label key={p.key} className={`${s.checkboxItem} ${on ? s.checkboxItemActive : ''}`}>
                    <input type="checkbox" className={s.hiddenInput} checked={on}
                      onChange={() => setDraft(d => ({ ...d, priorities: toggle(d.priorities, p.key) }))} />
                    <span className={`${s.checkMark} ${on ? s.checkMarkActive : ''}`}>
                      {on && <Check size={10} weight="bold" />}
                    </span>
                    <span className={s.priorityDot} style={{ background: p.color }} />
                    <span className={s.checkboxLabel}>{p.label}</span>
                  </label>
                );
              })}
            </div>
          </section>

          <div className={s.divider} />

          {/* Time window */}
          <section className={s.section}>
            <div className={s.sectionLabel}>Time window</div>
            <div className={s.segmentedControl}>
              {WINDOWS.map((w) => (
                <button
                  key={w.key}
                  className={`${s.segment} ${draft.window === w.key ? s.segmentActive : ''}`}
                  onClick={() => setDraft((d) => ({ ...d, window: w.key }))}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className={s.panelFooter}>
          <button className={s.resetBtn} onClick={reset}>Reset</button>
          <button className={s.applyBtn} onClick={apply}>Apply filters</button>
        </div>
      </div>
    </>
  );
}

export function countActiveFilters(f: FilterState): number {
  return f.sources.size + f.domains.size + f.priorities.size + (f.window !== 'any' ? 1 : 0);
}
