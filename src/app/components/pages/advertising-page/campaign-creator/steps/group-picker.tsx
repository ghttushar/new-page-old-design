import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ProductGroup } from '../campaign-creator.types';
import { searchGroups } from '../product-groups';
import VirtualList from '../virtual-list';

// One shared dropdown for the whole table. Type to find a group among thousands, or press Create group to make one
// (named from what you typed, or from what the chosen products share). It applies to the row it opened from,
// or to every ticked row when that row is one of them.

type Row = { kind: 'group'; group: ProductGroup };

const ROW = 38;
const LIST_HEIGHT = 230;
// What the search box, the Create group row and the footer take, so the list can be fitted to the room left.
const CHROME = 150;
const MIN_LIST = 114;
const WIDTH = 340;

export interface PickerTarget {
  /** Where to open it, the button that asked. */
  anchor: DOMRect;
  /** What is being grouped, in words: a product's name, or "3 selected products". */
  label: string;
  /** The group a single product is in now, if it is in one. */
  currentId: string | null;
  /** A name to start from, taken from what the chosen products share. */
  suggested: string;
  /** What they share, as one-tap names. */
  ideas: string[];
}

export default function GroupPicker({ target, groups, recentIds, onPick, onCreate, onClose }: {
  target: PickerTarget;
  groups: ProductGroup[];
  recentIds: string[];
  onPick: (groupId: string | null) => void;
  /** Makes the group; gives back a message when the name will not do. */
  onCreate: (name: string) => string | null;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState(target.suggested);
  const [error, setError] = useState<string | null>(null);
  const [box, setBox] = useState<{ top?: number; bottom?: number; left: number }>({ top: 0, left: 0 });
  const [listH, setListH] = useState(LIST_HEIGHT);
  const rootRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (!rootRef.current?.contains(e.target as Node)) onClose(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { if (naming) setNaming(false); else onClose(); } };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onClose);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); window.removeEventListener('resize', onClose); };
  }, [onClose, naming]);

  const rows = useMemo<Row[]>(() => {
    const q = query.trim();
    const list: Row[] = [];
    let found = searchGroups(groups, q);
    if (!q && recentIds.length > 0) {
      // Recently used groups first, then the rest in the order they were made.
      const recent = recentIds.map((id) => groups.find((g) => g.id === id)).filter(Boolean) as ProductGroup[];
      const seen = new Set(recent.map((g) => g.id));
      found = [...recent, ...found.filter((g) => !seen.has(g.id))];
    }
    found.forEach((group) => list.push({ kind: 'group', group }));
    return list;
  }, [query, groups, recentIds, target.currentId]);

  useEffect(() => { setActive(0); }, [query]);

  // Right under the cell, like a dropdown. The list is only as tall as its rows, and shortens to fit the room below;
  // it goes above the cell only when there is too little room below and clearly more above.
  useLayoutEffect(() => {
    const a = target.anchor;
    const wanted = Math.min(LIST_HEIGHT, Math.max(1, rows.length) * ROW);
    const roomBelow = window.innerHeight - a.bottom - 14 - CHROME;
    const roomAbove = a.top - 14 - CHROME;
    const above = roomBelow < Math.min(wanted, MIN_LIST) && roomAbove > roomBelow;
    setListH(Math.max(MIN_LIST / 2, Math.min(wanted, above ? roomAbove : roomBelow)));
    setBox({
      ...(above ? { bottom: window.innerHeight - a.top + 4 } : { top: a.bottom + 4 }),
      // Lined up with the cell's left edge; against the right edge of the screen it lines up with the cell's right edge.
      left: a.left + WIDTH > window.innerWidth - 8 ? Math.max(8, a.right - WIDTH) : a.left,
    });
  }, [target.anchor, rows.length]);

  const make = (value: string) => {
    const problem = onCreate(value);
    if (problem) setError(problem);
  };

  // The button makes a group named from what was typed; with nothing typed it asks for a name first.
  const typed = query.trim();
  const exact = typed ? groups.some((g) => g.name.toLowerCase() === typed.toLowerCase()) : false;
  const create = () => {
    if (typed && !exact) make(typed);
    else { setNaming(true); setName(target.suggested); setError(null); }
  };

  const choose = (row: Row | undefined) => {
    if (!row) return;
    onPick(row.group.id);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(rows.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(0, i - 1)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (rows[active]) choose(rows[active]);
      else if (typed && !exact) make(typed);
    }
  };

  return createPortal(
    <div ref={rootRef} className="ccd-gp" style={{ top: box.top, bottom: box.bottom, left: box.left, width: WIDTH }} role="dialog" aria-label={`Choose a group for ${target.label}`}>
      {naming ? (
        <div className="ccd-gp-name-view">
          <div className="ccd-gp-name-head">
            <button type="button" className="ccd-gp-back" onClick={() => setNaming(false)} aria-label="Back to the groups">←</button>
            <strong>Name the new group</strong>
          </div>
          <span className={`ccd-gp-field${error ? ' has-error' : ''}`}>
            <input
              autoFocus value={name} maxLength={60} placeholder="Group name" aria-label="Group name"
              onFocus={(e) => e.currentTarget.select()}
              onChange={(e) => { setName(e.target.value); setError(null); }}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); make(name); } }}
            />
          </span>
          {error && <div role="alert" className="ccd-gp-error ccd-gp-error--flush">{error}</div>}
          <button type="button" className="ccd-gp-go" onClick={() => make(name)}>Create group</button>
        </div>
      ) : (
        <>
          <div className="ccd-gp-search">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden><circle cx="7" cy="7" r="4.6" stroke="currentColor" strokeWidth="1.5" /><path d="M10.6 10.6L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <input
              autoFocus value={query} placeholder="Find a group" aria-label="Find a group" role="combobox" aria-expanded aria-controls="ccd-gp-list"
              onChange={(e) => { setQuery(e.target.value); setError(null); }} onKeyDown={onKeyDown}
            />
          </div>
          <button type="button" className="ccd-gp-create" onClick={create}>
            <span className="ccd-gp-icon ccd-gp-icon--plus" aria-hidden>+</span>
            <span className="ccd-gp-name">{typed && !exact ? <>Create group <strong>{typed}</strong></> : 'Create group'}</span>
            <span className="ccd-gp-for-count">{target.label}</span>
          </button>
          {error && <div role="alert" className="ccd-gp-error">{error}</div>}
          {rows.length === 0 ? (
            <div className="ccd-gp-empty">{groups.length === 0 ? 'No groups yet. Create the first one above.' : 'No group matches that. Create it above.'}</div>
          ) : (
            <div id="ccd-gp-list" role="listbox">
              <VirtualList
                items={rows} rowHeight={ROW} height={listH} className="ccd-gp-list" activeIndex={active}
                getKey={(r) => r.group.id}
                renderRow={(row, i) => (
                  <button
                    type="button" role="option" aria-selected={i === active} className={`ccd-gp-row${i === active ? ' is-active' : ''}`}
                    onMouseEnter={() => setActive(i)} onClick={() => choose(row)}
                  >
                    <span className="ccd-gp-name" title={row.group.name}>{row.group.name}</span>
                    <span className="ccd-gp-count ccd-num">{row.group.productIds.length.toLocaleString()}</span>
                    {row.group.id === target.currentId && <span className="ccd-gp-now">Current</span>}
                  </button>
                )}
              />
            </div>
          )}
          <div className="ccd-gp-foot">
            {groups.length.toLocaleString()} {groups.length === 1 ? 'group' : 'groups'}
            {typed && <> · {rows.filter((r) => r.kind === 'group').length.toLocaleString()} match</>}
          </div>
        </>
      )}
    </div>,
    document.body,
  );
}
