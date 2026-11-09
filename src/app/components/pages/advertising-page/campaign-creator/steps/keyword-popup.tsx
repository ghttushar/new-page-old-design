import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ASIN_PATTERN, KEYWORD_LIMIT, MIN_KEYWORD_BID, NEGATIVE_KEYWORD_LIMIT, NEGATIVE_PRODUCT_LIMIT, PRODUCT_TARGET_LIMIT,
  type CcCampaign, type KeywordMatch, type Marketplace, type NegativeMatch, type ProductTargetMatch,
} from '../campaign-creator.types';
import { Checkbox, InfoIcon, Radio, SearchIcon } from '../campaign-creator-ui';
import { NumField } from './preview-cells';
import { canTake, type KeywordLists, type ListKind } from './plan-campaigns';

// The Keywords page's popup: add keyword targets, product targets (Amazon) and negatives in one place, check each list
// on its own tab, then add them all to the campaigns ticked in the table. Every list is optional.

type Mode = ListKind;
type ListField = keyof KeywordLists;

const MODES: Record<Mode, {
  label: string; noun: string; tab: string; heading: string; placeholder: string; hint: string; limit: number;
  field: ListField; term: string; hasBid: boolean;
}> = {
  keyword: {
    label: 'Keyword targets', noun: 'keyword', tab: 'Keywords', heading: 'Keyword targets to add', limit: KEYWORD_LIMIT,
    placeholder: 'Enter keywords you want to target', hint: 'to add keywords to target', field: 'keywordTargets', term: 'Keyword', hasBid: true,
  },
  product: {
    label: 'Product targets', noun: 'product target', tab: 'Product targets', heading: 'Product targets to add', limit: PRODUCT_TARGET_LIMIT,
    placeholder: 'Enter ASINs or category names', hint: 'to add ASINs or categories', field: 'productTargets', term: 'ASIN or category', hasBid: true,
  },
  negative: {
    label: 'Negative keyword targets', noun: 'negative keyword', tab: 'Negative keywords', heading: 'Negative keywords to add', limit: NEGATIVE_KEYWORD_LIMIT,
    placeholder: 'Enter keywords you want to negate', hint: 'to add keywords to negate', field: 'negativeKeywords', term: 'Keyword', hasBid: false,
  },
  'neg-product': {
    label: 'Negative product targets', noun: 'negative ASIN', tab: 'Negative products', heading: 'Negative product targets to add', limit: NEGATIVE_PRODUCT_LIMIT,
    placeholder: 'Enter ASINs you want to exclude', hint: 'to add ASINs to exclude', field: 'negativeProducts', term: 'ASIN', hasBid: false,
  },
};

const KEYWORD_MATCHES: { id: KeywordMatch; label: string }[] = [
  { id: 'broad', label: 'Broad' }, { id: 'phrase', label: 'Phrase' }, { id: 'exact', label: 'Exact' },
];
const NEGATIVE_MATCHES: { id: NegativeMatch; label: string }[] = [
  { id: 'negative-exact', label: 'Negative exact' }, { id: 'negative-phrase', label: 'Negative phrase' },
];
const PRODUCT_MATCHES: { id: ProductTargetMatch; label: string }[] = [
  { id: 'product', label: 'Product (ASIN)' }, { id: 'category', label: 'Category' },
];
const MATCH_TEXT: Record<string, string> = Object.fromEntries([...KEYWORD_MATCHES, ...NEGATIVE_MATCHES, ...PRODUCT_MATCHES].map((m) => [m.id, m.label]));

const DEFAULT_BID = 0.02;
const EMPTY_LISTS: KeywordLists = { keywordTargets: [], productTargets: [], negativeKeywords: [], negativeProducts: [] };
const plural = (n: number, one: string) => `${n.toLocaleString()} ${n === 1 ? one : `${one}s`}`;
const splitTerms = (text: string) => text.split(/[\n,;]+/).map((t) => t.trim()).filter(Boolean);

let counter = 0;
const newId = () => `kw-${Date.now().toString(36)}-${counter++}`;

/** One line in any of the four lists. Only targets have a bid; only negative ASINs have no match type. */
interface ListRow { id: string; text: string; match?: string; bid?: number; enabled: boolean }

const TrashIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden><path d="M3 4.5h10M6.2 4.5V3h3.6v1.5M4.4 4.5l.6 8.5h6l.6-8.5M6.6 7v3.8M9.4 7v3.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

function Switch({ on, label, onToggle }: { on: boolean; label: string; onToggle: () => void }) {
  return <button type="button" role="switch" aria-checked={on} aria-label={label} className={`ccd-nm-toggle${on ? ' is-on' : ''}`} onClick={onToggle}><i /></button>;
}

export default function KeywordPopup({ campaigns, marketplace, onAdd, onClose }: {
  /** The campaigns ticked in the table. */
  campaigns: CcCampaign[]; marketplace: Marketplace | null; onAdd: (lists: KeywordLists) => void; onClose: () => void;
}) {
  const uid = useId();
  const walmart = marketplace === 'walmart';
  // Only the lists at least one ticked campaign can take are offered.
  const allModes: Mode[] = walmart ? ['keyword', 'negative'] : ['keyword', 'product', 'negative', 'neg-product'];
  const modes = allModes.filter((m) => campaigns.some((c) => canTake(c, m, marketplace)));
  const firstMode: Mode = modes[0] ?? 'negative';
  const takers = (m: Mode) => campaigns.filter((c) => canTake(c, m, marketplace)).length;

  const [lists, setLists] = useState<KeywordLists>(EMPTY_LISTS);
  const [mode, setMode] = useState<Mode>(firstMode);
  const [tab, setTab] = useState<Mode>(firstMode);
  const [entry, setEntry] = useState('');
  const [staged, setStaged] = useState<string[]>([]);
  const keywordOrder: KeywordMatch[] = walmart ? ['exact', 'phrase', 'broad'] : ['broad', 'phrase', 'exact'];
  const [keywordMatches, setKeywordMatches] = useState<KeywordMatch[]>(['broad', 'phrase', 'exact']);
  const [negativeMatches, setNegativeMatches] = useState<NegativeMatch[]>(['negative-phrase', 'negative-exact']);
  const [productMatch, setProductMatch] = useState<ProductTargetMatch>('product');
  const [bid, setBid] = useState(DEFAULT_BID);
  const [notice, setNotice] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const def = MODES[mode];
  const list = (m: Mode) => lists[MODES[m].field] as ListRow[];
  const setList = (m: Mode, rows: ListRow[]) => setLists((cur) => ({ ...cur, [MODES[m].field]: rows }));
  const used = list(mode).length;
  const bidOk = !def.hasBid || bid >= MIN_KEYWORD_BID;
  const matchOk = mode === 'keyword' ? keywordMatches.length > 0 : mode === 'negative' ? negativeMatches.length > 0 : true;
  const canAdd = staged.length > 0 && matchOk && bidOk;
  const keywordOptions = keywordOrder.map((id) => KEYWORD_MATCHES.find((m) => m.id === id)!);
  const queued = allModes.reduce((n, m) => n + list(m).filter((r) => r.enabled).length, 0);
  const dirty = queued > 0 || staged.length > 0;

  // Esc and the backdrop close the popup only while nothing would be lost.
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
    const items = dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex="0"]');
    if (!items || items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === dialogRef.current)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
  }

  const stage = (raw: string) => {
    const terms = splitTerms(raw);
    if (terms.length === 0) return;
    setStaged((cur) => {
      const seen = new Set(cur.map((t) => t.toLowerCase()));
      const next = [...cur];
      terms.forEach((t) => { if (!seen.has(t.toLowerCase())) { seen.add(t.toLowerCase()); next.push(t); } });
      return next;
    });
    setEntry('');
    setNotice(null);
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setTab(next);
    setStaged([]);
    setEntry('');
    setNotice(null);
    setSearch('');
  };

  const toggleMatch = (id: string) => {
    if (mode === 'keyword') setKeywordMatches((m) => (m.includes(id as KeywordMatch) ? m.filter((x) => x !== id) : [...m, id as KeywordMatch]));
    else if (mode === 'negative') setNegativeMatches((m) => (m.includes(id as NegativeMatch) ? m.filter((x) => x !== id) : [...m, id as NegativeMatch]));
    else if (mode === 'product') setProductMatch(id as ProductTargetMatch);
  };

  /** The match types each staged term is added with, in the marketplace's order. */
  const matchesToAdd = (): (string | undefined)[] => {
    if (mode === 'keyword') return keywordOrder.filter((m) => keywordMatches.includes(m));
    if (mode === 'negative') return NEGATIVE_MATCHES.map((m) => m.id).filter((m) => negativeMatches.includes(m));
    if (mode === 'product') return [productMatch];
    return [undefined];
  };

  function add() {
    if (!canAdd) return;
    let duplicates = 0;
    let overLimit = 0;
    let invalid = 0;
    const current = list(mode);
    const room = def.limit - used;
    const needsAsin = mode === 'neg-product' || (mode === 'product' && productMatch === 'product');
    const seen = new Set(current.map((k) => `${k.text.toLowerCase()}|${k.match ?? ''}`));
    const fresh: ListRow[] = [];
    staged.forEach((raw) => {
      if (needsAsin && !ASIN_PATTERN.test(raw)) { invalid += 1; return; }
      const text = needsAsin ? raw.toUpperCase() : raw;
      matchesToAdd().forEach((match) => {
        const key = `${text.toLowerCase()}|${match ?? ''}`;
        if (seen.has(key)) { duplicates += 1; return; }
        if (fresh.length >= room) { overLimit += 1; return; }
        seen.add(key);
        fresh.push({ id: newId(), text, ...(match ? { match } : {}), ...(def.hasBid ? { bid } : {}), enabled: true });
      });
    });
    if (fresh.length) setList(mode, [...current, ...fresh]);
    const parts = [fresh.length ? `Queued ${plural(fresh.length, def.noun)}.` : 'Nothing was queued.'];
    if (invalid) parts.push(`${invalid.toLocaleString()} ${invalid === 1 ? 'entry' : 'entries'} skipped: an ASIN is 10 letters and numbers.`);
    if (duplicates) parts.push(`${plural(duplicates, 'duplicate')} skipped.`);
    if (overLimit) parts.push(`${overLimit.toLocaleString()} left out: the limit is ${def.limit.toLocaleString()}.`);
    setNotice(parts.join(' '));
    setStaged([]);
    setEntry('');
    setTab(mode);
    setSearch('');
  }

  // Right-hand tables
  const q = search.trim().toLowerCase();
  const tabRows = useMemo(() => (lists[MODES[tab].field] as ListRow[]).filter((k) => !q || k.text.toLowerCase().includes(q)), [lists, tab, q]);
  const patchRow = (id: string, patch: Partial<ListRow>) => setList(tab, list(tab).map((k) => (k.id === id ? { ...k, ...patch } : k)));
  const removeRow = (id: string) => setList(tab, list(tab).filter((k) => k.id !== id));
  const clearAll = () => setList(tab, []);
  const total = list(tab).length;
  const tabDef = MODES[tab];
  const rowName = (k: ListRow) => `${k.text}${k.match ? ` ${MATCH_TEXT[k.match]}` : ''}`;
  const names = campaigns.map((c) => c.name);
  const campaignWord = campaigns.length === 1 ? 'campaign' : 'campaigns';
  const reach = takers(mode);

  return createPortal(
    <div className="ccd-tm-back" onMouseDown={() => { if (!dirty) onClose(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={`${uid}-title`} tabIndex={-1} className="ccd-tm ccd-kwm" onMouseDown={(e) => e.stopPropagation()} onKeyDown={keepFocusInside}>
        <header className="ccd-tm-head">
          <div>
            <h2 id={`${uid}-title`} className="ccd-tm-title">{walmart ? 'Add keywords' : 'Add keywords & product targets'}</h2>
            <div className="ccd-tm-sub" title={names.join('\n')}>
              Adding to {plural(campaigns.length, 'campaign')}: {names.slice(0, 2).join(', ')}{names.length > 2 ? ` and ${names.length - 2} more` : ''}. Every list is optional.
            </div>
          </div>
          <div className="ccd-tm-actions">
            {dirty && <span className="ccd-tm-dirty">Not added yet</span>}
            <button type="button" className="ccd-tm-btn" onClick={onClose}>Cancel</button>
            <button type="button" className="ccd-tm-btn ccd-tm-btn--primary" disabled={queued === 0} onClick={() => onAdd(lists)}>Add to {campaigns.length} {campaignWord}</button>
          </div>
        </header>

        <div className="ccd-kw ccd-kwm-body">
          {/* Left: what to add */}
          <div className="ccd-kw-left">
            <div className="ccd-kw-title">
              <h2>Add {def.label.toLowerCase()}</h2>
              <span className="ccd-kw-limit ccd-num" aria-label={`${used} of ${def.limit} used`}>{used.toLocaleString()}/{def.limit.toLocaleString()}</span>
              <span className="ccd-kw-info" title={`You can add up to ${def.limit.toLocaleString()} ${def.noun}s at a time.`}><InfoIcon size={13} color="#8a909b" /></span>
            </div>

            <div className="ccd-kw-field">
              <label className="ccd-tm-label" htmlFor={`${uid}-mode`}>Add as</label>
              <select id={`${uid}-mode`} className="ccd-tm-select ccd-input" value={mode} onChange={(e) => switchMode(e.target.value as Mode)}>
                {modes.map((m) => <option key={m} value={m}>{MODES[m].label} (Optional)</option>)}
              </select>
              {reach < campaigns.length && (
                <p className="ccd-kw-rule">
                  Goes on {reach} of the {campaigns.length} ticked {campaignWord}: {mode === 'keyword' ? 'Manual campaigns that target keywords' : mode === 'product' ? 'Manual campaigns that target products' : "Automatic campaigns with Dynamic bidding can't take them"}.
                </p>
              )}
            </div>

            <div className="ccd-kw-field">
              <input
                className="ccd-kw-input ccd-input" value={entry} placeholder={def.placeholder} aria-label={def.placeholder} spellCheck={false}
                onChange={(e) => { setEntry(e.target.value); setNotice(null); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); stage(entry); } }}
                onPaste={(e) => {
                  const text = e.clipboardData.getData('text');
                  if (/[\n,;]/.test(text)) { e.preventDefault(); stage(`${entry}${text}`); }
                }}
              />
              <p className="ccd-kw-hint">Press <b>Enter</b> {def.hint}</p>
              <div className="ccd-kw-stage" aria-label={`${def.tab} ready to add`}>
                {staged.length === 0
                  ? <span className="ccd-kw-stage-empty">{mode === 'keyword' || mode === 'negative' ? 'Keywords' : 'ASINs'} you enter appear here</span>
                  : staged.map((t) => (
                    <span key={t} className="ccd-kw-chip">
                      {t}
                      <button type="button" aria-label={`Remove ${t}`} onClick={() => setStaged((cur) => cur.filter((x) => x !== t))}>×</button>
                    </span>
                  ))}
              </div>
            </div>

            <div className="ccd-kw-row">
              <span className="ccd-kw-rowlabel">Match type</span>
              {mode === 'neg-product' ? (
                <span className="ccd-kw-fixed">Negative product (ASIN)</span>
              ) : mode === 'product' ? (
                <div className="ccd-tm-checks" role="radiogroup" aria-label="Match type">
                  {PRODUCT_MATCHES.map((m) => (
                    <button key={m.id} type="button" role="radio" aria-checked={productMatch === m.id} className="ccd-tm-check" onClick={() => toggleMatch(m.id)}>
                      <Radio checked={productMatch === m.id} />{m.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="ccd-tm-checks" role="group" aria-label="Match type">
                  {(mode === 'keyword' ? keywordOptions : NEGATIVE_MATCHES).map((m) => {
                    const on = (mode === 'keyword' ? keywordMatches : negativeMatches).includes(m.id as never);
                    return (
                      <button key={m.id} type="button" role="checkbox" aria-checked={on} className="ccd-tm-check" onClick={() => toggleMatch(m.id)}>
                        <Checkbox checked={on} size={16} />{m.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Only targets take a bid; negatives never have one. */}
            {def.hasBid && (
              <div className="ccd-kw-row">
                <span className="ccd-kw-rowlabel">Custom bid</span>
                <NumField value={bid} prefix="$" width={64} label="Custom bid" invalid={!bidOk} onCommit={setBid} />
                {!bidOk && <span className="ccd-kw-err" role="alert">Minimum bid is ${MIN_KEYWORD_BID.toFixed(2)}</span>}
              </div>
            )}

            <div className="ccd-kw-actions">
              <button type="button" className="ccd-kw-btn" disabled={staged.length === 0 && entry === ''} onClick={() => { setStaged([]); setEntry(''); setNotice(null); }}>Clear</button>
              <button type="button" className="ccd-kw-btn ccd-kw-btn--primary" disabled={!canAdd} onClick={add}>Add</button>
            </div>
            {notice && <div role="status" className="ccd-kw-notice">{notice}</div>}
          </div>

          <div className="ccd-kw-div" aria-hidden />

          {/* Right: what will be added */}
          <div className="ccd-kw-right">
            <div role="tablist" aria-label="Keywords and targets to add" className="ccd-kw-tabs">
              {modes.map((m) => (
                <button key={m} type="button" role="tab" id={`${uid}-tab-${m}`} aria-selected={tab === m} aria-controls={`${uid}-panel`} className={`ccd-kw-tab${tab === m ? ' is-on' : ''}`} onClick={() => { setTab(m); setSearch(''); }}>
                  {MODES[m].tab}<b className="ccd-num">{list(m).length.toLocaleString()}</b>
                </button>
              ))}
            </div>

            <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${tab}`} className="ccd-kw-panel">
              <div className="ccd-kw-ph">
                <h3>{tabDef.heading}<b className="ccd-num">{total.toLocaleString()}</b></h3>
                <div className="ccd-kw-tools">
                  <label className="ccd-kw-search">
                    <SearchIcon size={14} />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" aria-label={`Search ${tabDef.tab.toLowerCase()}`} />
                  </label>
                  <button type="button" className="ccd-kw-clearall" disabled={total === 0} onClick={clearAll}><TrashIcon size={14} />Clear all</button>
                </div>
              </div>

              <div className="ccd-kw-table ccd-scroll">
                <div className={`ccd-kw-th ccd-kw-grid ccd-kw-grid--${tab}`}>
                  <span>Status</span><span>{tabDef.term}</span>{tab !== 'neg-product' && <span>{tab === 'product' ? 'Type' : 'Match type'}</span>}{tabDef.hasBid && <span>Bid</span>}<span>Clear</span>
                </div>
                <div className="ccd-kw-body">
                  {tabRows.map((k) => (
                    <div key={k.id} className={`ccd-kw-tr ccd-kw-grid ccd-kw-grid--${tab}${k.enabled ? '' : ' is-off'}`}>
                      <span><Switch on={k.enabled} label={`${rowName(k)} status`} onToggle={() => patchRow(k.id, { enabled: !k.enabled })} /></span>
                      <span className="ccd-kw-term" title={k.text}>{k.text}</span>
                      {tab !== 'neg-product' && <span>{k.match ? MATCH_TEXT[k.match] : ''}</span>}
                      {tabDef.hasBid && (
                        <span><NumField value={k.bid ?? DEFAULT_BID} prefix="$" width={52} label={`Bid for ${rowName(k)}`} invalid={(k.bid ?? 0) < MIN_KEYWORD_BID} onCommit={(v) => patchRow(k.id, { bid: v })} /></span>
                      )}
                      <span><button type="button" className="ccd-kw-del" aria-label={`Remove ${rowName(k)}`} onClick={() => removeRow(k.id)}><TrashIcon /></button></span>
                    </div>
                  ))}
                  {tabRows.length === 0 && (
                    <div className="ccd-kw-empty">
                      <strong>{total === 0 ? `No ${tabDef.tab.toLowerCase()} yet` : 'Nothing matches that search'}</strong>
                      <span>{total > 0 ? 'Clear the search to see everything you entered.' : 'Enter them on the left and choose Add. This list is optional, so you can also skip it.'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
