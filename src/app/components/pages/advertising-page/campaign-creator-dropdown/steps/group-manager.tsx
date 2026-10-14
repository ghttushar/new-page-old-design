import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ProductGroup } from '../campaign-creator.types';
import { searchGroups } from '../product-groups';
import VirtualList from '../virtual-list';

// The place to look after groups once there are many: search, rename, delete, and show one group's products in the table.

const ROW = 46;
const LIST_HEIGHT = 322;
const WIDTH = 460;

const Pencil = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M2.5 13.5l.7-3 7.6-7.6a1.4 1.4 0 0 1 2 0l.3.3a1.4 1.4 0 0 1 0 2l-7.6 7.6z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Trash = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M3 4.5h10M6.2 4.5V3h3.6v1.5M4.4 4.5l.6 8.5h6l.6-8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export default function GroupManager({ anchor, groups, viewingId, onRename, onDelete, onView, onClose }: {
  anchor: DOMRect;
  groups: ProductGroup[];
  /** The group whose products the table is limited to now. */
  viewingId: string | null;
  onRename: (id: string, name: string) => string | null;
  onDelete: (id: string) => void;
  onView: (id: string | null) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [asking, setAsking] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [box, setBox] = useState({ top: 0, left: 0 });
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const height = 58 + LIST_HEIGHT + 40;
    const below = anchor.bottom + 6 + height <= window.innerHeight;
    setBox({
      top: below ? anchor.bottom + 6 : Math.max(8, anchor.top - 6 - height),
      left: Math.max(8, Math.min(anchor.right - WIDTH, window.innerWidth - WIDTH - 8)),
    });
  }, [anchor]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (!rootRef.current?.contains(e.target as Node)) onClose(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onClose);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); window.removeEventListener('resize', onClose); };
  }, [onClose]);

  // In the order the groups were made, like every other list of groups.
  const rows = useMemo(() => searchGroups(groups, query), [groups, query]);

  const save = (id: string) => {
    const problem = onRename(id, name);
    if (problem) setError(problem);
    else setEditing(null);
  };

  return createPortal(
    <div ref={rootRef} className="ccd-gm" style={{ top: box.top, left: box.left, width: WIDTH }} role="dialog" aria-label="Manage groups">
      <div className="ccd-gm-head">
        <strong>Groups <b className="ccd-num">{groups.length.toLocaleString()}</b></strong>
        <button type="button" className="ccd-gm-close" onClick={onClose} aria-label="Close">×</button>
      </div>
      <div className="ccd-gm-tools">
        <span className="ccd-gp-search ccd-gm-search">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden><circle cx="7" cy="7" r="4.6" stroke="currentColor" strokeWidth="1.5" /><path d="M10.6 10.6L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          <input autoFocus value={query} placeholder="Search groups" aria-label="Search groups" onChange={(e) => setQuery(e.target.value)} />
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="ccd-gp-empty">{groups.length === 0 ? 'No groups yet.' : 'No group matches that search.'}</div>
      ) : (
        <VirtualList
          items={rows} rowHeight={ROW} height={LIST_HEIGHT} className="ccd-gm-list" label="Groups"
          getKey={(g) => g.id}
          renderRow={(g) => {
            if (asking === g.id) {
              return (
                <div className="ccd-gm-row is-asking" role="alertdialog" aria-label={`Delete ${g.name}?`}>
                  <span>Delete <strong>{g.name}</strong>? Its {g.productIds.length.toLocaleString()} {g.productIds.length === 1 ? 'product becomes' : 'products become'} ungrouped.</span>
                  <button type="button" className="ccd-gm-danger" autoFocus onClick={() => { onDelete(g.id); setAsking(null); }}>Delete</button>
                  <button type="button" className="ccd-gm-keep" onClick={() => setAsking(null)}>Keep</button>
                </div>
              );
            }
            if (editing === g.id) {
              return (
                <div className="ccd-gm-row is-editing">
                  <input
                    autoFocus value={name} maxLength={60} aria-label={`Rename ${g.name}`}
                    onChange={(e) => { setName(e.target.value); setError(null); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') save(g.id); else if (e.key === 'Escape') setEditing(null); }}
                    onBlur={() => save(g.id)}
                  />
                  {error && <span role="alert" className="ccd-gm-error">{error}</span>}
                </div>
              );
            }
            return (
              <div className={`ccd-gm-row${viewingId === g.id ? ' is-viewing' : ''}`}>
                <span className="ccd-gm-name" title={g.name}>{g.name}</span>
                <span className="ccd-gm-count ccd-num">{g.productIds.length.toLocaleString()}</span>
                <button type="button" className="ccd-gm-view" onClick={() => onView(viewingId === g.id ? null : g.id)}>{viewingId === g.id ? 'Showing' : 'Show'}</button>
                <button type="button" className="ccd-gm-act" aria-label={`Rename ${g.name}`} title="Rename" onClick={() => { setEditing(g.id); setName(g.name); setError(null); }}><Pencil /></button>
                <button type="button" className="ccd-gm-act ccd-gm-act--danger" aria-label={`Delete ${g.name}`} title="Delete group" onClick={() => setAsking(g.id)}><Trash /></button>
              </div>
            );
          }}
        />
      )}

      <div className="ccd-gp-foot">
        {rows.length.toLocaleString()} of {groups.length.toLocaleString()} {groups.length === 1 ? 'group' : 'groups'}
      </div>
    </div>,
    document.body,
  );
}
