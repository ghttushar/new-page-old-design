import { useId, useMemo, useState } from 'react';
import {
  KEYWORD_LIMIT, MIN_KEYWORD_BID, NEGATIVE_KEYWORD_LIMIT,
  type CcDraft, type KeywordEntry, type KeywordMatch, type NegativeKeywordEntry, type NegativeMatch,
} from '../campaign-creator.types';
import { Checkbox, InfoIcon, SearchIcon, StepHeading } from '../campaign-creator-ui';
import { NumField } from './preview-cells';

// Keywords step: add keyword targets and negative keywords in one place, then check each list on its own tab.

type Mode = 'keyword' | 'negative';

const MODES: Record<Mode, {
  label: string; noun: string; tab: string; heading: string; placeholder: string; hint: string; limit: number;
}> = {
  keyword: {
    label: 'Keyword targets', noun: 'keyword', tab: 'Keywords', heading: 'Added keyword targets', limit: KEYWORD_LIMIT,
    placeholder: 'Enter keywords you want to track', hint: 'to add keywords to track',
  },
  negative: {
    label: 'Negative keyword targets', noun: 'negative keyword', tab: 'Negative keywords', heading: 'Added negative keyword targets', limit: NEGATIVE_KEYWORD_LIMIT,
    placeholder: 'Enter keywords you want to negate', hint: 'to add keywords to negate',
  },
};

const KEYWORD_MATCHES: { id: KeywordMatch; label: string }[] = [
  { id: 'broad', label: 'Broad' }, { id: 'phrase', label: 'Phrase' }, { id: 'exact', label: 'Exact' },
];
const NEGATIVE_MATCHES: { id: NegativeMatch; label: string }[] = [
  { id: 'negative-phrase', label: 'Negative phrase' }, { id: 'negative-exact', label: 'Negative exact' },
];
const MATCH_TEXT: Record<string, string> = Object.fromEntries([...KEYWORD_MATCHES, ...NEGATIVE_MATCHES].map((m) => [m.id, m.label]));

const DEFAULT_BID = 0.02;
const plural = (n: number, one: string) => `${n.toLocaleString()} ${n === 1 ? one : `${one}s`}`;
const splitTerms = (text: string) => text.split(/[\n,;]+/).map((t) => t.trim()).filter(Boolean);

let counter = 0;
const newId = () => `kw-${Date.now().toString(36)}-${counter++}`;

const TrashIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden><path d="M3 4.5h10M6.2 4.5V3h3.6v1.5M4.4 4.5l.6 8.5h6l.6-8.5M6.6 7v3.8M9.4 7v3.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

function Switch({ on, label, onToggle }: { on: boolean; label: string; onToggle: () => void }) {
  return <button type="button" role="switch" aria-checked={on} aria-label={label} className={`ccd-nm-toggle${on ? ' is-on' : ''}`} onClick={onToggle}><i /></button>;
}

export default function StepKeywords({ draft, onChange }: { draft: CcDraft; onChange: (patch: Partial<CcDraft>) => void }) {
  const uid = useId();
  const [mode, setMode] = useState<Mode>('keyword');
  const [tab, setTab] = useState<Mode>('keyword');
  const [entry, setEntry] = useState('');
  const [staged, setStaged] = useState<string[]>([]);
  const [keywordMatches, setKeywordMatches] = useState<KeywordMatch[]>(['broad', 'phrase', 'exact']);
  const [negativeMatches, setNegativeMatches] = useState<NegativeMatch[]>(['negative-phrase', 'negative-exact']);
  const [bid, setBid] = useState(DEFAULT_BID);
  const [notice, setNotice] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const def = MODES[mode];
  const used = mode === 'keyword' ? draft.keywordTargets.length : draft.negativeKeywords.length;
  const matches: string[] = mode === 'keyword' ? keywordMatches : negativeMatches;
  const bidOk = mode === 'negative' || bid >= MIN_KEYWORD_BID;
  const canAdd = staged.length > 0 && matches.length > 0 && bidOk;

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
    else setNegativeMatches((m) => (m.includes(id as NegativeMatch) ? m.filter((x) => x !== id) : [...m, id as NegativeMatch]));
  };

  function add() {
    if (!canAdd) return;
    let duplicates = 0;
    let overLimit = 0;
    const room = def.limit - used;
    if (mode === 'keyword') {
      const seen = new Set(draft.keywordTargets.map((k) => `${k.text.toLowerCase()}|${k.match}`));
      const fresh: KeywordEntry[] = [];
      staged.forEach((text) => keywordMatches.forEach((match) => {
        const key = `${text.toLowerCase()}|${match}`;
        if (seen.has(key)) { duplicates += 1; return; }
        if (fresh.length >= room) { overLimit += 1; return; }
        seen.add(key);
        fresh.push({ id: newId(), text, match, bid, enabled: true });
      }));
      if (fresh.length) onChange({ keywordTargets: [...draft.keywordTargets, ...fresh] });
      report(fresh.length, duplicates, overLimit);
    } else {
      const seen = new Set(draft.negativeKeywords.map((k) => `${k.text.toLowerCase()}|${k.match}`));
      const fresh: NegativeKeywordEntry[] = [];
      staged.forEach((text) => negativeMatches.forEach((match) => {
        const key = `${text.toLowerCase()}|${match}`;
        if (seen.has(key)) { duplicates += 1; return; }
        if (fresh.length >= room) { overLimit += 1; return; }
        seen.add(key);
        fresh.push({ id: newId(), text, match, enabled: true });
      }));
      if (fresh.length) onChange({ negativeKeywords: [...draft.negativeKeywords, ...fresh] });
      report(fresh.length, duplicates, overLimit);
    }
    setStaged([]);
    setEntry('');
    setTab(mode);
    setSearch('');
  }

  function report(added: number, duplicates: number, overLimit: number) {
    const parts = [added ? `Added ${plural(added, def.noun)}.` : 'Nothing was added.'];
    if (duplicates) parts.push(`${plural(duplicates, 'duplicate')} skipped.`);
    if (overLimit) parts.push(`${overLimit.toLocaleString()} left out: the limit is ${def.limit.toLocaleString()}.`);
    setNotice(parts.join(' '));
  }

  // Right-hand tables
  const q = search.trim().toLowerCase();
  const keywordRows = useMemo(() => draft.keywordTargets.filter((k) => !q || k.text.toLowerCase().includes(q)), [draft.keywordTargets, q]);
  const negativeRows = useMemo(() => draft.negativeKeywords.filter((k) => !q || k.text.toLowerCase().includes(q)), [draft.negativeKeywords, q]);

  const patchKeyword = (id: string, patch: Partial<KeywordEntry>) => onChange({ keywordTargets: draft.keywordTargets.map((k) => (k.id === id ? { ...k, ...patch } : k)) });
  const patchNegative = (id: string, patch: Partial<NegativeKeywordEntry>) => onChange({ negativeKeywords: draft.negativeKeywords.map((k) => (k.id === id ? { ...k, ...patch } : k)) });
  const clearAll = () => (tab === 'keyword' ? onChange({ keywordTargets: [] }) : onChange({ negativeKeywords: [] }));

  const tabCount = (m: Mode) => (m === 'keyword' ? draft.keywordTargets.length : draft.negativeKeywords.length);
  const rowsForTab = tab === 'keyword' ? keywordRows : negativeRows;
  const total = tabCount(tab);

  return (
    <div>
      <StepHeading title="Add keywords" summary={false} />

      <div className="ccd-kw">
        {/* Left: what to add */}
        <div className="ccd-kw-left">
          <div className="ccd-kw-title">
            <h2>Add {def.label.toLowerCase()}</h2>
            <span className="ccd-kw-limit ccd-num" aria-label={`${used} of ${def.limit} used`}>{used.toLocaleString()}/{def.limit.toLocaleString()}</span>
            <span className="ccd-kw-info" title={`You can add up to ${def.limit.toLocaleString()} ${def.noun}s to these campaigns.`}><InfoIcon size={13} color="#8a909b" /></span>
          </div>

          <div className="ccd-kw-field">
            <label className="ccd-tm-label" htmlFor={`${uid}-mode`}>Add as</label>
            <select id={`${uid}-mode`} className="ccd-tm-select ccd-input" value={mode} onChange={(e) => switchMode(e.target.value as Mode)}>
              <option value="keyword">{MODES.keyword.label}</option>
              <option value="negative">{MODES.negative.label}</option>
            </select>
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
            <div className="ccd-kw-stage" aria-label="Keywords ready to add">
              {staged.length === 0
                ? <span className="ccd-kw-stage-empty">Keywords you enter appear here</span>
                : staged.map((t) => (
                  <span key={t} className="ccd-kw-chip">
                    {t}
                    <button type="button" aria-label={`Remove ${t}`} onClick={() => setStaged((cur) => cur.filter((x) => x !== t))}>×</button>
                  </span>
                ))}
            </div>
          </div>

          <div className="ccd-kw-row">
            <span className="ccd-kw-rowlabel">Match type <i aria-hidden>*</i></span>
            <div className="ccd-tm-checks" role="group" aria-label="Match type">
              {(mode === 'keyword' ? KEYWORD_MATCHES : NEGATIVE_MATCHES).map((m) => (
                <button key={m.id} type="button" role="checkbox" aria-checked={matches.includes(m.id)} className="ccd-tm-check" onClick={() => toggleMatch(m.id)}>
                  <Checkbox checked={matches.includes(m.id)} size={16} />{m.label}
                </button>
              ))}
            </div>
          </div>

          {mode === 'keyword' && (
            <div className="ccd-kw-row">
              <span className="ccd-kw-rowlabel">Custom bid <i aria-hidden>*</i></span>
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

        {/* Right: what has been added */}
        <div className="ccd-kw-right">
          <div role="tablist" aria-label="Added keywords" className="ccd-kw-tabs">
            {(['keyword', 'negative'] as Mode[]).map((m) => (
              <button key={m} type="button" role="tab" id={`${uid}-tab-${m}`} aria-selected={tab === m} aria-controls={`${uid}-panel`} className={`ccd-kw-tab${tab === m ? ' is-on' : ''}`} onClick={() => { setTab(m); setSearch(''); }}>
                {MODES[m].tab}<b className="ccd-num">{tabCount(m).toLocaleString()}</b>
              </button>
            ))}
          </div>

          <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${tab}`} className="ccd-kw-panel">
            <div className="ccd-kw-ph">
              <h3>{MODES[tab].heading}<b className="ccd-num">{total.toLocaleString()}</b></h3>
              <div className="ccd-kw-tools">
                <label className="ccd-kw-search">
                  <SearchIcon size={14} />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" aria-label={`Search ${MODES[tab].tab.toLowerCase()}`} />
                </label>
                <button type="button" className="ccd-kw-clearall" disabled={total === 0} onClick={clearAll}><TrashIcon size={14} />Clear all</button>
              </div>
            </div>

            <div className="ccd-kw-table ccd-scroll">
              <div className={`ccd-kw-th ccd-kw-grid ccd-kw-grid--${tab}`}>
                <span>Status</span><span>Keyword</span><span>Match type</span>{tab === 'keyword' && <span>Bid</span>}<span>Clear</span>
              </div>
              <div className="ccd-kw-body">
                {tab === 'keyword' && keywordRows.map((k) => (
                  <div key={k.id} className={`ccd-kw-tr ccd-kw-grid ccd-kw-grid--keyword${k.enabled ? '' : ' is-off'}`}>
                    <span><Switch on={k.enabled} label={`${k.text} ${MATCH_TEXT[k.match]} status`} onToggle={() => patchKeyword(k.id, { enabled: !k.enabled })} /></span>
                    <span className="ccd-kw-term" title={k.text}>{k.text}</span>
                    <span>{MATCH_TEXT[k.match]}</span>
                    <span><NumField value={k.bid} prefix="$" width={52} label={`Bid for ${k.text} ${MATCH_TEXT[k.match]}`} invalid={k.bid < MIN_KEYWORD_BID} onCommit={(v) => patchKeyword(k.id, { bid: v })} /></span>
                    <span><button type="button" className="ccd-kw-del" aria-label={`Remove ${k.text} ${MATCH_TEXT[k.match]}`} onClick={() => onChange({ keywordTargets: draft.keywordTargets.filter((x) => x.id !== k.id) })}><TrashIcon /></button></span>
                  </div>
                ))}
                {tab === 'negative' && negativeRows.map((k) => (
                  <div key={k.id} className={`ccd-kw-tr ccd-kw-grid ccd-kw-grid--negative${k.enabled ? '' : ' is-off'}`}>
                    <span><Switch on={k.enabled} label={`${k.text} ${MATCH_TEXT[k.match]} status`} onToggle={() => patchNegative(k.id, { enabled: !k.enabled })} /></span>
                    <span className="ccd-kw-term" title={k.text}>{k.text}</span>
                    <span>{MATCH_TEXT[k.match]}</span>
                    <span><button type="button" className="ccd-kw-del" aria-label={`Remove ${k.text} ${MATCH_TEXT[k.match]}`} onClick={() => onChange({ negativeKeywords: draft.negativeKeywords.filter((x) => x.id !== k.id) })}><TrashIcon /></button></span>
                  </div>
                ))}
                {rowsForTab.length === 0 && (
                  <div className="ccd-kw-empty">
                    <strong>{total === 0 ? `No ${MODES[tab].tab.toLowerCase()} added yet` : 'Nothing matches that search'}</strong>
                    <span>{total === 0 ? 'Enter keywords on the left and choose Add. You can also skip this step.' : 'Clear the search to see everything you added.'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
