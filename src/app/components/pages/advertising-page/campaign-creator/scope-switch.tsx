import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Scope } from './product-groups';
import VirtualList from './virtual-list';
import { Checkbox } from './campaign-creator-ui';

const plural = (n: number) => `${n.toLocaleString()} ${n === 1 ? 'product' : 'products'}`;

const ROW = 52;
const LIST_HEIGHT = 312;
const WIDTH = 340;

const Chevron = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M4 6.2l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Tick = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M3.5 8.4l3 3 6-6.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

/**
 * The group being set up, written into the page heading ("Set your goals for Group 1") as a dropdown built for thousands of groups: search, a filter for the
 * groups that still need a choice, a shortcut to the next one, and a list that only draws the rows in view.
 */
export default function ScopeSwitch({ scopes, activeId, pending, onChange, onApply, appliedCount, onUndo }: {
  scopes: Scope[]; activeId: string; pending: Set<string>; onChange: (id: string) => void;
  /** Copies this page's setup from the active group to the ticked ones. Left out where a page has nothing to copy. */
  onApply?: (ids: string[]) => void;
  /** Set for a few seconds after applying: how many groups were changed. */
  appliedCount?: number | null;
  onUndo?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [box, setBox] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const boxRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const active = scopes.find((s) => s.id === activeId) ?? scopes[0];
  const position = (Math.max(0, scopes.indexOf(active)) + 1).toLocaleString();

  useLayoutEffect(() => {
    if (!open || !boxRef.current) return;
    const r = boxRef.current.getBoundingClientRect();
    // Under the trigger; against the right edge of the screen the menu lines up with the trigger's right edge.
    setBox({ top: r.bottom + 8, left: r.left + WIDTH > window.innerWidth - 8 ? Math.max(8, r.right - WIDTH) : r.left });
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const close = () => setOpen(false);
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !boxRef.current?.contains(t)) close();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { close(); triggerRef.current?.focus(); } };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', close);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); window.removeEventListener('resize', close); };
  }, [open]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scopes.filter((s) => !q || s.name.toLowerCase().includes(q));
  }, [scopes, query]);

  useEffect(() => { setIndex(0); }, [query]);

  // Ticks only ever count groups other than the one being copied, and only ones that still exist.
  const tickable = useMemo(() => rows.filter((s) => s.id !== active.id), [rows, active]);
  const ticked = useMemo(() => scopes.filter((s) => checked.has(s.id) && s.id !== active.id).length, [scopes, checked, active]);
  const allShownTicked = tickable.length > 0 && tickable.every((s) => checked.has(s.id));
  const toggle = (id: string) => setChecked((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  const toggleShown = () => setChecked((prev) => {
    const next = new Set(prev);
    if (allShownTicked) tickable.forEach((s) => next.delete(s.id)); else tickable.forEach((s) => next.add(s.id));
    return next;
  });
  const apply = () => {
    if (!onApply || ticked === 0) return;
    onApply(scopes.filter((s) => checked.has(s.id) && s.id !== active.id).map((s) => s.id));
    setChecked(new Set());
  };

  const choose = (id: string) => { onChange(id); setOpen(false); triggerRef.current?.focus(); };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((i) => Math.min(rows.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((i) => Math.max(0, i - 1)); }
    else if (e.key === 'Enter' && rows[index]) { e.preventDefault(); choose(rows[index].id); }
  };

  return (
    <>
      <span ref={boxRef} className={`ccd-gs-inline${open ? ' is-open' : ''}`}>
        <button
          ref={triggerRef} type="button" className="ccd-gs-trigger" aria-haspopup="dialog" aria-expanded={open}
          aria-label={`Group being set up: ${active.name}, ${position} of ${scopes.length.toLocaleString()}. Change group`} onClick={() => { setOpen((o) => !o); setQuery(''); setChecked(new Set()); }}
        >
          <span className="ccd-gs-title">{active.name}</span>
          <span className="ccd-gs-chev"><Chevron /></span>
        </button>
      </span>

      {open && createPortal(
        <div ref={menuRef} className="ccd-gs-menu" style={{ top: box.top, left: box.left, width: WIDTH }} role="dialog" aria-label="Choose a group to set up">
          <div className="ccd-gs-search">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden><circle cx="7" cy="7" r="4.6" stroke="currentColor" strokeWidth="1.5" /><path d="M10.6 10.6L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <input autoFocus value={query} placeholder={`Search ${scopes.length.toLocaleString()} groups`} aria-label="Search groups" onChange={(e) => setQuery(e.target.value)} onKeyDown={onKeyDown} />
          </div>

          {onApply && tickable.length > 0 && (
            <div className="ccd-gs-selbar">
              <button type="button" role="checkbox" aria-checked={allShownTicked} className="ccd-gs-selall" onClick={toggleShown}><Checkbox checked={allShownTicked} size={16} /><span>{query ? 'Select shown' : 'Select all'}</span></button>
              {ticked > 0 && <span className="ccd-gs-selcount">{ticked.toLocaleString()} selected<button type="button" onClick={() => setChecked(new Set())}>Clear</button></span>}
            </div>
          )}

          {rows.length === 0 ? (
            <div className="ccd-gs-empty">No group matches that search.</div>
          ) : (
            <VirtualList
              items={rows} rowHeight={ROW} height={LIST_HEIGHT} className="ccd-gs-list" label="Groups" activeIndex={index} getKey={(s) => s.id}
              renderRow={(s, i) => {
                const on = s.id === active.id;
                const needs = pending.has(s.id);
                return (
                  <div className={`ccd-gs-row${on ? ' is-on' : ''}${!on && checked.has(s.id) ? ' is-ticked' : ''}${i === index ? ' is-active' : ''}`} onMouseEnter={() => setIndex(i)}>
                    {onApply && (
                      <button type="button" role="checkbox" aria-checked={!on && checked.has(s.id)} disabled={on} className="ccd-gs-check" title={on ? 'This is the group being copied' : undefined} onClick={() => toggle(s.id)} aria-label={on ? `${s.name}, the group being copied` : `Apply to ${s.name}`}>
                        <Checkbox checked={!on && checked.has(s.id)} disabled={on} size={16} />
                      </button>
                    )}
                    <button type="button" className="ccd-gs-option" onClick={() => choose(s.id)}>
                      <i className={`ccd-gdot ccd-gs-status ${needs ? 'is-wait' : 'is-done'}`} aria-hidden />
                      <span className="ccd-gs-opt-name"><strong>{s.name}</strong><small>{plural(s.products.length)}</small></span>
                      {on && <span className="ccd-gs-tick"><Tick /></span>}
                    </button>
                  </div>
                );
              }}
            />
          )}

          {onApply ? (
            <div className="ccd-gs-menu-foot has-apply">
              {appliedCount !== null && appliedCount !== undefined ? (
                <span className="ccd-gs-done" role="status"><Tick />Applied to {appliedCount.toLocaleString()} {appliedCount === 1 ? 'group' : 'groups'}<button type="button" onClick={onUndo}>Undo</button></span>
              ) : (
                <span className="ccd-gs-hint">{ticked > 0 ? `Copy this page from ${active.name}` : 'Select group to apply this configuration to'}</span>
              )}
              <button type="button" className="ccd-btn ccd-primary ccd-gs-apply" disabled={ticked === 0} onClick={apply}>{ticked > 0 ? `Apply to ${ticked.toLocaleString()}` : 'Apply'}</button>
            </div>
          ) : null}
        </div>,
        document.body,
      )}
    </>
  );
}
