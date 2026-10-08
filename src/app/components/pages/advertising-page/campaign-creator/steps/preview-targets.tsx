import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  TARGET_SOURCES,
  type CcAdGroup, type CcCampaign, type CcNegative, type CcTarget, type NegativeMatch, type TargetSource,
} from '../campaign-creator.types';
import { BORDER, Checkbox, FONT, InfoIcon, TEXT_PRIMARY } from '../campaign-creator-ui';
import { MATCH_LABEL, NumField, campaignLabel } from './preview-cells';

// Sections 8.5 and 8.6: one popup to add and edit a campaign's keywords, product targets and negatives, with each item's source.

export const FIELD: React.CSSProperties = {
  padding: '6px 8px', border: `1px solid ${BORDER}`, borderRadius: 6, font: `400 13px/1.2 ${FONT}`,
  color: TEXT_PRIMARY, background: '#fff', outline: 'none', minWidth: 0,
};

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const ASIN = /^[A-Z0-9]{10}$/i;

// ── What can be added ─────────────────────────────────────────────────────────────────────────

type Kind = 'keyword' | 'product' | 'neg-keyword' | 'neg-product';

interface KindDef {
  label: string;
  /** Column heading for the text itself. */
  term: string;
  /** What one entry is called in counts and the Add button. */
  noun: string;
  placeholder: string;
  matches: { id: string; label: string }[];
  hasBid: boolean;
}

const KINDS: Record<Kind, KindDef> = {
  keyword: {
    label: 'Keyword targets', term: 'Keyword', noun: 'keyword', hasBid: true,
    placeholder: 'Type or paste keywords, one per line',
    matches: [{ id: 'exact', label: 'Exact' }, { id: 'phrase', label: 'Phrase' }, { id: 'broad', label: 'Broad' }],
  },
  product: {
    label: 'Product targets', term: 'ASIN or category', noun: 'target', hasBid: true,
    placeholder: 'Type or paste ASINs or category names, one per line',
    matches: [{ id: 'product', label: 'Product (ASIN)' }, { id: 'category', label: 'Category' }],
  },
  'neg-keyword': {
    label: 'Negative keywords', term: 'Keyword', noun: 'keyword', hasBid: false,
    placeholder: 'Type or paste negative keywords, one per line',
    matches: [{ id: 'negative-phrase', label: 'Negative phrase' }, { id: 'negative-exact', label: 'Negative exact' }],
  },
  'neg-product': {
    label: 'Negative product targets', term: 'ASIN', noun: 'ASIN', hasBid: false,
    placeholder: 'Type or paste ASINs to exclude, one per line',
    matches: [],
  },
};

const KEYWORD_MATCH = ['exact', 'phrase', 'broad', 'brand', 'competitor'];
const PRODUCT_MATCH = ['product', 'category'];

/** One line of the table, whichever kind it belongs to. */
interface Row { id: string; text: string; match: string; bid: number | null; source: TargetSource | null }

function rowsOf(ag: CcAdGroup, kind: Kind): Row[] {
  if (kind === 'keyword' || kind === 'product') {
    const types = kind === 'keyword' ? KEYWORD_MATCH : PRODUCT_MATCH;
    return ag.targets.filter((t) => types.includes(t.matchType)).map((t) => ({ id: t.id, text: t.label, match: t.matchType, bid: t.bid, source: t.source }));
  }
  const wanted = kind === 'neg-keyword' ? 'keyword' : 'product';
  return ag.negatives.filter((n) => n.kind === wanted).map((n) => ({
    id: n.id, text: n.text, match: n.kind === 'keyword' ? (n.matchType ?? 'negative-exact') : 'negative-asin', bid: null, source: null,
  }));
}

function patchRow(ag: CcAdGroup, kind: Kind, id: string, patch: Partial<Row>): CcAdGroup {
  if (kind === 'keyword' || kind === 'product') {
    return {
      ...ag,
      targets: ag.targets.map((t) => t.id !== id ? t : {
        ...t,
        label: patch.text ?? t.label,
        matchType: (patch.match ?? t.matchType) as CcTarget['matchType'],
        bid: patch.bid ?? t.bid,
        source: patch.source ?? t.source,
      }),
    };
  }
  return {
    ...ag,
    negatives: ag.negatives.map((n) => n.id !== id ? n : {
      ...n,
      text: patch.text ?? n.text,
      matchType: n.kind === 'keyword' ? ((patch.match as NegativeMatch | undefined) ?? n.matchType ?? 'negative-exact') : n.matchType,
    }),
  };
}

function removeRows(ag: CcAdGroup, kind: Kind, ids: string[]): CcAdGroup {
  if (kind === 'keyword' || kind === 'product') return { ...ag, targets: ag.targets.filter((t) => !ids.includes(t.id)) };
  return { ...ag, negatives: ag.negatives.filter((n) => !ids.includes(n.id)) };
}

function addRows(ag: CcAdGroup, kind: Kind, rows: Row[]): CcAdGroup {
  if (kind === 'keyword' || kind === 'product') {
    const added: CcTarget[] = rows.map((r) => ({ id: r.id, label: r.text, matchType: r.match as CcTarget['matchType'], bid: r.bid ?? 0, source: r.source ?? 'Custom input' }));
    return { ...ag, targets: [...ag.targets, ...added] };
  }
  const added: CcNegative[] = rows.map((r) => (kind === 'neg-keyword'
    ? { id: r.id, text: r.text, kind: 'keyword', matchType: r.match as NegativeMatch }
    : { id: r.id, text: r.text, kind: 'product' }));
  return { ...ag, negatives: [...ag.negatives, ...added] };
}

let idCounter = 0;
const newId = () => `new-${Date.now().toString(36)}-${idCounter++}`;

/** Saved lists a person can pull keywords from (sources 4 and 5). */
type ListSource = 'Custom input' | 'Keyword list' | 'Labels / tags';
const LIST_SOURCES: ListSource[] = ['Custom input', 'Keyword list', 'Labels / tags'];
const SAVED_LISTS: Record<'Keyword list' | 'Labels / tags', { name: string; keywords: string[] }[]> = {
  'Keyword list': [
    { name: 'Top converting terms', keywords: ['best protein powder', 'whey isolate high protein', 'protein shake mix'] },
    { name: 'Brand defence terms', keywords: ['nutrabay whey', 'nutrabay protein', 'nutrabay official'] },
    { name: 'Seasonal gifting', keywords: ['fitness gift set', 'gym gift for him', 'health gift hamper'] },
  ],
  'Labels / tags': [
    { name: 'Bestsellers', keywords: ['bestseller protein', 'top rated supplement', 'popular gym nutrition'] },
    { name: 'New launches', keywords: ['new protein flavour', 'latest pre workout', 'new arrival supplement'] },
    { name: 'High margin', keywords: ['premium whey isolate', 'clean label protein', 'lab tested supplement'] },
  ],
};

const parseTerms = (text: string): string[] => {
  const seen = new Set<string>();
  return text.split(/[\n,;]+/).map((t) => t.trim()).filter((t) => {
    const key = t.toLowerCase();
    if (!t || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// ── Small marks ───────────────────────────────────────────────────────────────────────────────

const Info = ({ tip }: { tip: string }) => <span className="cc-tm-info" title={tip}><InfoIcon size={13} color="#8a909b" /></span>;
const FunnelIcon = () => <svg width={13} height={13} viewBox="0 0 16 16" fill="none" aria-hidden><path d="M2.5 3.5h11L9.4 8.4v4l-2.8 1.3V8.4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>;
const TrashIcon = () => <svg width={13} height={13} viewBox="0 0 16 16" fill="none" aria-hidden><path d="M3 4.5h10M6.2 4.5V3h3.6v1.5M4.4 4.5l.6 8.5h6l.6-8.5M6.6 7v3.8M9.4 7v3.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const PencilIcon = () => <svg width={13} height={13} viewBox="0 0 16 16" fill="none" aria-hidden><path d="M2.5 13.5l.7-3 7.6-7.6a1.4 1.4 0 0 1 2 0l.3.3a1.4 1.4 0 0 1 0 2l-7.6 7.6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;

// ── The popup ─────────────────────────────────────────────────────────────────────────────────

export function TargetingPopup({ campaign, onSave, onClose }: { campaign: CcCampaign; onSave: (next: CcCampaign) => void; onClose: () => void }) {
  const uid = useId();
  const isAuto = campaign.kind === 'auto';
  const kinds: Kind[] = isAuto ? ['neg-keyword', 'neg-product'] : ['keyword', 'product', 'neg-keyword', 'neg-product'];

  const [work, setWork] = useState<CcCampaign>(campaign);
  const [agId, setAgId] = useState(campaign.adGroups[0]?.id ?? '');
  const [kind, setKind] = useState<Kind>(kinds[0]);
  const [source, setSource] = useState<ListSource>('Custom input');
  const [text, setText] = useState('');
  const [matches, setMatches] = useState<string[]>([]);
  const [bid, setBid] = useState(() => campaign.adGroups.flatMap((a) => a.targets)[0]?.bid ?? 0.75);
  const [notice, setNotice] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [filterText, setFilterText] = useState('');
  const [filterMatch, setFilterMatch] = useState<string[]>([]);
  const [filterSource, setFilterSource] = useState<string[]>([]);
  const [menu, setMenu] = useState(false);

  const ag = work.adGroups.find((a) => a.id === agId) ?? work.adGroups[0];
  const def = KINDS[kind];
  const rows = useMemo(() => (ag ? rowsOf(ag, kind) : []), [ag, kind]);
  const dirty = JSON.stringify(work) !== JSON.stringify(campaign);

  const dialogRef = useRef<HTMLDivElement>(null);
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !dirtyRef.current) closeRef.current(); };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); opener?.focus?.(); };
  }, []);

  function keepFocusInside(e: React.KeyboardEvent) {
    if (e.key !== 'Tab') return;
    const items = dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled)');
    if (!items || items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === dialogRef.current)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
  }

  const editAdGroup = (fn: (a: CcAdGroup) => CcAdGroup) => setWork((w) => ({ ...w, adGroups: w.adGroups.map((a) => (a.id === ag.id ? fn(a) : a)) }));
  const pickKind = (next: Kind) => { setKind(next); setMatches([]); setNotice(null); setSelected([]); setFilterText(''); setFilterMatch([]); setFilterSource([]); setMenu(false); };

  // The list on the left
  const terms = useMemo(() => parseTerms(text), [text]);
  const canAdd = terms.length > 0 && (def.matches.length === 0 || matches.length > 0);
  const toggleMatch = (id: string) => setMatches((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));

  function add() {
    if (!canAdd || !ag) return;
    const existing = new Set(rows.map((r) => `${r.text.toLowerCase()}|${r.match}`));
    const matchIds = def.matches.length ? matches : ['negative-asin'];
    const fresh: Row[] = [];
    const invalid = new Set<string>();
    let duplicates = 0;
    terms.forEach((term) => matchIds.forEach((m) => {
      const needsAsin = kind === 'neg-product' || (kind === 'product' && m === 'product');
      if (needsAsin && !ASIN.test(term)) { invalid.add(term); return; }
      const value = needsAsin ? term.toUpperCase() : term;
      const key = `${value.toLowerCase()}|${m}`;
      if (existing.has(key)) { duplicates += 1; return; }
      existing.add(key);
      fresh.push({ id: newId(), text: value, match: m, bid: def.hasBid ? bid : null, source: def.hasBid ? (kind === 'keyword' ? source : 'Custom input') : null });
    }));
    if (fresh.length) editAdGroup((a) => addRows(a, kind, fresh));
    if (fresh.length) setText('');
    const parts = [fresh.length ? `Added ${plural(fresh.length, def.noun)}.` : 'Nothing was added.'];
    if (duplicates) parts.push(`${plural(duplicates, 'duplicate')} skipped.`);
    if (invalid.size) parts.push(`${plural(invalid.size, 'entry', 'entries')} ${invalid.size === 1 ? "isn't" : "aren't"} a valid ASIN.`);
    setNotice(parts.join(' '));
  }

  // The table on the right
  const q = filterText.trim().toLowerCase();
  const shown = rows.filter((r) => (!q || r.text.toLowerCase().includes(q)) && (filterMatch.length === 0 || filterMatch.includes(r.match)) && (filterSource.length === 0 || (r.source !== null && filterSource.includes(r.source))));
  const selectedHere = selected.filter((id) => rows.some((r) => r.id === id));
  const allOn = shown.length > 0 && shown.every((r) => selectedHere.includes(r.id));
  const activeFilters = filterMatch.length + filterSource.length;
  const toggleRow = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleAll = () => setSelected(allOn ? selected.filter((id) => !shown.some((r) => r.id === id)) : Array.from(new Set([...selected, ...shown.map((r) => r.id)])));
  const clearSelected = () => { editAdGroup((a) => removeRows(a, kind, selectedHere)); setSelected([]); };
  const toggleIn = (list: string[], set: (v: string[]) => void, v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const matchChoices = (current: string) => {
    const base = def.matches.map((m) => m.id);
    return base.includes(current) ? base : [...base, current];
  };
  const cols = def.hasBid ? '44px minmax(0,1fr) 112px 104px 196px' : kind === 'neg-keyword' ? '44px minmax(0,1fr) 170px' : '44px minmax(0,1fr) 150px';
  const filterMatchChoices = Array.from(new Set([...def.matches.map((m) => m.id), ...rows.map((r) => r.match)]));

  return createPortal(
    <div className="cc-tm-back" onMouseDown={() => { if (!dirty) onClose(); }}>
      <div
        ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={`${uid}-title`} tabIndex={-1} className="cc-tm"
        onMouseDown={(e) => e.stopPropagation()} onKeyDown={keepFocusInside}
      >
        <header className="cc-tm-head">
          <div style={{ minWidth: 0 }}>
            <h2 id={`${uid}-title`} className="cc-tm-title">Edit targeting</h2>
            <div className="cc-tm-sub" title={campaignLabel(work)}>
              <b>Campaign:</b> {campaignLabel(work)}
              {work.adGroups.length === 1 && <> <span aria-hidden className="cc-tm-sep">/</span> <b>Ad group:</b> {ag?.name}</>}
            </div>
          </div>
          <div className="cc-tm-actions">
            {dirty && <span className="cc-tm-dirty">Unsaved changes</span>}
            <button type="button" className="cc-tm-btn" onClick={onClose}>Cancel</button>
            <button type="button" className="cc-tm-btn cc-tm-btn--primary" disabled={!dirty} onClick={() => onSave(work)}>Save targeting</button>
          </div>
        </header>

        <div className="cc-tm-body">
          <div className="cc-tm-left cc-scroll">
            <div className="cc-tm-field">
              <label className="cc-tm-label" htmlFor={`${uid}-kind`}>Add as <Info tip="Choose what you are adding. The table on the right switches to match." /></label>
              <select id={`${uid}-kind`} className="cc-tm-select cc-input" value={kind} onChange={(e) => pickKind(e.target.value as Kind)}>
                {kinds.map((k) => <option key={k} value={k}>{KINDS[k].label} ({ag ? rowsOf(ag, k).length : 0})</option>)}
              </select>
              {isAuto && <p className="cc-tm-hint">Automatic campaigns are matched by the marketplace, so only negatives can be added.</p>}
            </div>

            {work.adGroups.length > 1 && (
              <div className="cc-tm-field">
                <label className="cc-tm-label" htmlFor={`${uid}-ag`}>Ad group</label>
                <select id={`${uid}-ag`} className="cc-tm-select cc-input" value={ag?.id} onChange={(e) => { setAgId(e.target.value); setSelected([]); }}>
                  {work.adGroups.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            )}

            {kind === 'keyword' && (
              <div className="cc-tm-field">
                <label className="cc-tm-label" htmlFor={`${uid}-src`}>Targeting source <Info tip="Where these keywords come from. It is shown next to every keyword." /></label>
                <select id={`${uid}-src`} className="cc-tm-select cc-input" value={source} onChange={(e) => setSource(e.target.value as ListSource)}>
                  {LIST_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            <div className="cc-tm-field">
              <div className="cc-tm-labelrow">
                <label className="cc-tm-label" htmlFor={`${uid}-list`}>Enter list <Info tip="One entry per line. Commas also work." /></label>
                <button type="button" className="cc-tm-add" disabled={!canAdd} onClick={add}>Add {kind.startsWith('neg') ? 'negative ' : ''}{def.noun}s</button>
              </div>
              <textarea
                id={`${uid}-list`} className="cc-tm-text cc-input" value={text} placeholder={def.placeholder} spellCheck={false}
                onChange={(e) => { setText(e.target.value); setNotice(null); }}
              />
              <div className="cc-tm-count cc-num">{String(terms.length).padStart(2, '0')} {terms.length === 1 ? def.noun : `${def.noun}s`} entered</div>
              {kind === 'keyword' && source !== 'Custom input' && (
                <div className="cc-tm-lists">
                  <span>{source === 'Keyword list' ? 'Add from a keyword list' : 'Add from a label'}</span>
                  {SAVED_LISTS[source].map((l) => (
                    <button key={l.name} type="button" className="cc-tm-chipbtn" onClick={() => { setText((t) => `${t.trim() ? `${t.trim()}\n` : ''}${l.keywords.join('\n')}`); setNotice(null); }}>
                      {l.name}<small>{l.keywords.length}</small>
                    </button>
                  ))}
                </div>
              )}
              {notice && <div role="status" className="cc-tm-notice">{notice}</div>}
            </div>

            {def.matches.length > 0 && (
              <div className="cc-tm-field">
                <div className="cc-tm-label">Match type <Info tip="Pick one or more. Each entry is added once per match type." /></div>
                <div className="cc-tm-checks" role="group" aria-label="Match type">
                  {def.matches.map((m) => (
                    <button key={m.id} type="button" role="checkbox" aria-checked={matches.includes(m.id)} className="cc-tm-check" onClick={() => toggleMatch(m.id)}>
                      <Checkbox checked={matches.includes(m.id)} size={16} />{m.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {def.hasBid && (
              <div className="cc-tm-field">
                <div className="cc-tm-label">Bid <Info tip="The bid for everything you add now. You can change each one in the table." /></div>
                <NumField value={bid} prefix="$" width={64} label="Bid for new targets" onCommit={setBid} />
              </div>
            )}
          </div>

          <div className="cc-tm-div" aria-hidden />

          <div className="cc-tm-right">
            <div className="cc-tm-rh">
              <h3>Added targets <span>{def.label}</span><b className="cc-num">{rows.length}</b></h3>
              <div className="cc-tm-tools">
                {def.hasBid && (
                  <button type="button" className="cc-tm-tool" aria-haspopup="true" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
                    <FunnelIcon />Filter{activeFilters > 0 && <i className="cc-num">{activeFilters}</i>}
                  </button>
                )}
                <button type="button" className="cc-tm-tool" disabled={selectedHere.length === 0} onClick={clearSelected}>
                  <TrashIcon />Clear{selectedHere.length > 0 && <i className="cc-num">{selectedHere.length}</i>}
                </button>
                {menu && (
                  <>
                    <div className="cc-tm-menuback" onMouseDown={() => setMenu(false)} />
                    <div className="cc-tm-menu" role="dialog" aria-label="Filter added targets">
                      <div className="cc-tm-menuhead">Match type</div>
                      {filterMatchChoices.map((m) => (
                        <button key={m} type="button" role="checkbox" aria-checked={filterMatch.includes(m)} className="cc-tm-check" onClick={() => toggleIn(filterMatch, setFilterMatch, m)}>
                          <Checkbox checked={filterMatch.includes(m)} size={16} />{MATCH_LABEL[m] ?? m}
                        </button>
                      ))}
                      <div className="cc-tm-menuhead">Source</div>
                      {TARGET_SOURCES.map((s) => (
                        <button key={s} type="button" role="checkbox" aria-checked={filterSource.includes(s)} className="cc-tm-check" onClick={() => toggleIn(filterSource, setFilterSource, s)}>
                          <Checkbox checked={filterSource.includes(s)} size={16} />{s}
                        </button>
                      ))}
                      <button type="button" className="cc-tm-menureset" disabled={activeFilters === 0} onClick={() => { setFilterMatch([]); setFilterSource([]); }}>Reset filters</button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="cc-tm-filters">
              <span>Filters:</span>
              {filterMatch.map((m) => <button key={m} type="button" className="cc-tm-tag" onClick={() => toggleIn(filterMatch, setFilterMatch, m)} aria-label={`Remove filter ${MATCH_LABEL[m] ?? m}`}>{MATCH_LABEL[m] ?? m}<span aria-hidden>×</span></button>)}
              {filterSource.map((s) => <button key={s} type="button" className="cc-tm-tag" onClick={() => toggleIn(filterSource, setFilterSource, s)} aria-label={`Remove filter ${s}`}>{s}<span aria-hidden>×</span></button>)}
              <input value={filterText} onChange={(e) => setFilterText(e.target.value)} placeholder="Search added targets" aria-label="Search added targets" />
            </div>

            <div className="cc-tm-table cc-scroll" style={{ ['--cols' as string]: cols }}>
              <div className="cc-tm-th">
                <span className="cc-tm-td"><button type="button" role="checkbox" aria-checked={allOn} aria-label="Select all shown" className="cc-tm-cb" disabled={shown.length === 0} onClick={toggleAll}><Checkbox checked={allOn} size={16} /></button></span>
                <span className="cc-tm-td">{def.term}</span>
                <span className="cc-tm-td">Match type</span>
                {def.hasBid && <span className="cc-tm-td">Bid</span>}
                {def.hasBid && <span className="cc-tm-td">Source</span>}
              </div>
              <div className="cc-tm-tbody">
                {shown.map((r) => {
                  const on = selectedHere.includes(r.id);
                  return (
                    <div key={r.id} className={`cc-tm-tr${on ? ' is-on' : ''}`}>
                      <span className="cc-tm-td"><button type="button" role="checkbox" aria-checked={on} aria-label={`Select ${r.text}`} className="cc-tm-cb" onClick={() => toggleRow(r.id)}><Checkbox checked={on} size={16} /></button></span>
                      <span className="cc-tm-td">
                        <input
                          className="cc-tm-cell" value={r.text} aria-label={`${def.term} ${r.text}`} title={r.text}
                          onChange={(e) => editAdGroup((a) => patchRow(a, kind, r.id, { text: e.target.value }))}
                          onBlur={(e) => {
                            const v = e.target.value.trim();
                            if (!v) editAdGroup((a) => removeRows(a, kind, [r.id]));
                            else if (v !== r.text) editAdGroup((a) => patchRow(a, kind, r.id, { text: v }));
                          }}
                        />
                      </span>
                      <span className="cc-tm-td">
                        {def.matches.length > 0 ? (
                          <select className="cc-tm-cell" aria-label={`Match type for ${r.text}`} value={r.match} onChange={(e) => editAdGroup((a) => patchRow(a, kind, r.id, { match: e.target.value }))}>
                            {matchChoices(r.match).map((m) => <option key={m} value={m}>{MATCH_LABEL[m] ?? m}</option>)}
                          </select>
                        ) : <span className="cc-tm-static">{MATCH_LABEL[r.match]}</span>}
                      </span>
                      {def.hasBid && (
                        <span className="cc-tm-td"><NumField value={r.bid ?? 0} prefix="$" width={44} label={`Bid for ${r.text}`} onCommit={(v) => editAdGroup((a) => patchRow(a, kind, r.id, { bid: v }))} /></span>
                      )}
                      {def.hasBid && (
                        <span className="cc-tm-td">
                          <select className="cc-tm-cell" aria-label={`Source of ${r.text}`} value={r.source ?? 'Custom input'} onChange={(e) => editAdGroup((a) => patchRow(a, kind, r.id, { source: e.target.value as TargetSource }))}>
                            {TARGET_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </span>
                      )}
                    </div>
                  );
                })}
                {shown.length === 0 && (
                  <div className="cc-tm-empty">
                    <strong>{rows.length === 0 ? `No ${def.label.toLowerCase()} yet` : 'Nothing matches these filters'}</strong>
                    <span>{rows.length === 0 ? 'Enter a list on the left and choose Add.' : 'Reset the filters to see everything in this ad group.'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
