import { useState } from 'react';
import {
  MANUAL_TARGETING_IDS, TARGETING_STRATEGY_CATALOG, TARGET_SOURCES, formatCurrency,
  type CcAdGroup, type CcCampaign, type CcNegative, type CcTarget, type TargetSource, type TargetingStrategyId,
} from '../campaign-creator.types';
import { BORDER, BRAND, FONT, TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY, TextButton } from '../campaign-creator-ui';

// §8.5–8.7.7 — the expanded editor for one campaign: targets (with their source), negatives, budget and Rules.

export const FIELD: React.CSSProperties = {
  padding: '6px 8px', border: `1px solid ${BORDER}`, borderRadius: 6, font: `400 13px/1.2 ${FONT}`,
  color: TEXT_PRIMARY, background: '#fff', outline: 'none', minWidth: 0,
};

const MOCK_LISTS: Record<'Keyword list' | 'Labels / tags', { name: string; keywords: string[] }[]> = {
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

let idCounter = 0;
const nextId = (prefix: string) => `${prefix}-new-${Date.now().toString(36)}-${idCounter++}`;

function XButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button" aria-label={label} title={label} onClick={onClick} className="cc-btn cc-ghost"
      style={{ width: 22, height: 22, padding: 0, border: 'none', background: 'transparent', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none' }}
    >
      <svg width={10} height={10} viewBox="0 0 16 16" fill="none" aria-hidden><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke={TEXT_MUTED} strokeWidth="1.8" strokeLinecap="round" /></svg>
    </button>
  );
}

const SMALL_LABEL: React.CSSProperties = { font: `500 11.5px/1 ${FONT}`, color: TEXT_FAINT };
const TARGET_GRID: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'minmax(150px, 1fr) 150px 88px 150px 22px', columnGap: 10, alignItems: 'center' };

function MatchSelect({ value, onChange, label }: { value: TargetingStrategyId; onChange: (v: TargetingStrategyId) => void; label: string }) {
  return (
    <select className="cc-input" aria-label={label} value={value} onChange={(e) => onChange(e.target.value as TargetingStrategyId)} style={FIELD}>
      {MANUAL_TARGETING_IDS.map((id) => <option key={id} value={id}>{TARGETING_STRATEGY_CATALOG[id].label}</option>)}
    </select>
  );
}

function BidInput({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: TEXT_MUTED, font: `400 13px/1 ${FONT}` }}>
      $
      <input
        className="cc-input cc-num" type="number" step="0.05" min="0" inputMode="decimal" aria-label={label} value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        style={{ ...FIELD, width: 66 }}
      />
    </span>
  );
}

// ── Add a target ──────────────────────────────────────────────────────────────────────────────

type AddSource = 'Custom input' | 'Keyword list' | 'Labels / tags';
const ADD_SOURCES: AddSource[] = ['Custom input', 'Keyword list', 'Labels / tags'];

function AddTargetRow({ defaultMatch, onAdd }: { defaultMatch: TargetingStrategyId; onAdd: (targets: CcTarget[]) => void }) {
  const [source, setSource] = useState<AddSource>('Custom input');
  const [text, setText] = useState('');
  const [match, setMatch] = useState<TargetingStrategyId>(defaultMatch);
  const [bid, setBid] = useState(0.75);

  function addCustom() {
    const label = text.trim();
    if (!label) return;
    onAdd([{ id: nextId('t'), label, matchType: match, bid, source: 'Custom input' }]);
    setText('');
  }

  function addFromList(keywords: string[]) {
    onAdd(keywords.map((label): CcTarget => ({ id: nextId('t'), label, matchType: match, bid, source })));
  }

  return (
    <div style={{ marginTop: 8, paddingTop: 10, borderTop: `1px dashed ${BORDER}` }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
        <span style={SMALL_LABEL}>Add target</span>
        <select className="cc-input" aria-label="Where the new targets come from" value={source} onChange={(e) => setSource(e.target.value as AddSource)} style={FIELD}>
          {ADD_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {source === 'Custom input' && (
          <input
            className="cc-input" value={text} placeholder="Keyword or ASIN" aria-label="New target"
            onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addCustom(); }}
            style={{ ...FIELD, flex: '1 1 160px', maxWidth: 260 }}
          />
        )}
        <MatchSelect value={match} onChange={setMatch} label="Match type for new targets" />
        <BidInput value={bid} onChange={setBid} label="Bid for new targets" />
        {source === 'Custom input' && <TextButton onClick={addCustom}>Add target</TextButton>}
      </div>
      {source !== 'Custom input' && (
        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <span style={{ font: `400 12px/1.4 ${FONT}`, color: TEXT_MUTED }}>{source === 'Keyword list' ? 'Choose a keyword list' : 'Choose a label'}:</span>
          {MOCK_LISTS[source].map((l) => (
            <button
              key={l.name} type="button" className="cc-btn cc-pick" onClick={() => addFromList(l.keywords)}
              style={{ padding: '6px 10px', border: `1px solid ${BORDER}`, borderRadius: 6, background: '#fff', cursor: 'pointer', font: `500 12.5px/1.2 ${FONT}`, color: TEXT_PRIMARY }}
            >
              {l.name} <span style={{ color: TEXT_FAINT, fontWeight: 400 }}>· adds {l.keywords.length}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Negatives ─────────────────────────────────────────────────────────────────────────────────

function NegativesEditor({ negatives, onChange }: { negatives: CcNegative[]; onChange: (next: CcNegative[]) => void }) {
  const [kind, setKind] = useState<CcNegative['kind']>('keyword');
  const [text, setText] = useState('');

  function add() {
    const value = text.trim();
    if (!value || negatives.some((n) => n.kind === kind && n.text.toLowerCase() === value.toLowerCase())) { setText(''); return; }
    onChange([...negatives, { id: nextId('neg'), text: value, kind }]);
    setText('');
  }

  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ font: `600 12px/1.3 ${FONT}`, color: TEXT_PRIMARY, marginBottom: 6 }}>Negatives</div>
      {negatives.length === 0 && <div style={{ font: `400 12.5px/1.5 ${FONT}`, color: TEXT_FAINT, marginBottom: 6 }}>No negative keywords or product targets.</div>}
      {negatives.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {negatives.map((n) => (
            <span key={n.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 4px 2px 9px', border: `1px solid ${BORDER}`, borderRadius: 999, background: '#fff', font: `400 12.5px/1.4 ${FONT}`, color: TEXT_PRIMARY }}>
              {n.text}
              <span style={{ font: `400 11px/1 ${FONT}`, color: TEXT_FAINT }}>{n.kind === 'keyword' ? 'keyword' : 'product'}</span>
              <XButton label={`Remove negative ${n.text}`} onClick={() => onChange(negatives.filter((x) => x.id !== n.id))} />
            </span>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
        <span role="radiogroup" aria-label="Negative type" style={{ display: 'inline-flex', border: `1px solid ${BORDER}`, borderRadius: 6, overflow: 'hidden' }}>
          {(['keyword', 'product'] as const).map((k) => (
            <button
              key={k} type="button" role="radio" aria-checked={kind === k} onClick={() => setKind(k)}
              style={{ padding: '6px 10px', border: 'none', cursor: 'pointer', background: kind === k ? '#f6f2fb' : '#fff', color: kind === k ? BRAND : TEXT_MUTED, font: `${kind === k ? 600 : 500} 12px/1.2 ${FONT}` }}
            >{k === 'keyword' ? 'Keyword' : 'Product'}</button>
          ))}
        </span>
        <input
          className="cc-input" value={text} aria-label="New negative" placeholder={kind === 'keyword' ? 'Negative keyword' : 'Negative ASIN'}
          onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') add(); }}
          style={{ ...FIELD, flex: '1 1 160px', maxWidth: 260 }}
        />
        <TextButton onClick={add}>Add negative</TextButton>
      </div>
    </div>
  );
}

// ── Ad group ──────────────────────────────────────────────────────────────────────────────────

function AdGroupEditor({ campaign, adGroup, onChange }: { campaign: CcCampaign; adGroup: CcAdGroup; onChange: (next: CcAdGroup) => void }) {
  const isAuto = campaign.kind === 'auto';
  const setTarget = (id: string, patch: Partial<CcTarget>) => onChange({ ...adGroup, targets: adGroup.targets.map((t) => (t.id === id ? { ...t, ...patch } : t)) });

  return (
    <div style={{ marginTop: 14, paddingLeft: 14, borderLeft: `2px solid ${BORDER}` }}>
      <div style={{ font: `600 12.5px/1.4 ${FONT}`, color: TEXT_PRIMARY, marginBottom: 6 }}>{adGroup.name}</div>

      {isAuto ? (
        <div style={{ font: `400 12.5px/1.5 ${FONT}`, color: TEXT_FAINT }}>Automatic targeting — no individual targets.</div>
      ) : (
        <>
          {adGroup.targets.length > 0 && (
            <div style={{ ...TARGET_GRID, paddingBottom: 6 }}>
              <span style={SMALL_LABEL}>Target</span><span style={SMALL_LABEL}>Match type</span><span style={SMALL_LABEL}>Bid</span><span style={SMALL_LABEL}>Source</span><span />
            </div>
          )}
          {adGroup.targets.map((t) => (
            <div key={t.id} style={{ ...TARGET_GRID, padding: '3px 0' }}>
              <input className="cc-input" value={t.label} aria-label="Target" onChange={(e) => setTarget(t.id, { label: e.target.value })} style={FIELD} />
              <MatchSelect value={t.matchType} onChange={(v) => setTarget(t.id, { matchType: v })} label={`Match type for ${t.label}`} />
              <BidInput value={t.bid} onChange={(v) => setTarget(t.id, { bid: v })} label={`Bid for ${t.label}`} />
              <select
                aria-label={`Source of ${t.label}`} value={t.source} onChange={(e) => setTarget(t.id, { source: e.target.value as TargetSource })}
                style={{ padding: '4px 0', border: 'none', background: 'transparent', font: `400 12px/1.2 ${FONT}`, color: TEXT_FAINT, cursor: 'pointer', outline: 'none', minWidth: 0 }}
              >
                {TARGET_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <XButton label={`Remove target ${t.label}`} onClick={() => onChange({ ...adGroup, targets: adGroup.targets.filter((x) => x.id !== t.id) })} />
            </div>
          ))}
          {adGroup.targets.length === 0 && <div style={{ font: `400 12.5px/1.5 ${FONT}`, color: TEXT_FAINT }}>No targets yet. Add one below.</div>}
          <AddTargetRow
            defaultMatch={adGroup.targets[0]?.matchType ?? 'exact'}
            onAdd={(added) => onChange({ ...adGroup, targets: [...adGroup.targets, ...added] })}
          />
        </>
      )}

      <NegativesEditor negatives={adGroup.negatives} onChange={(negatives) => onChange({ ...adGroup, negatives })} />
    </div>
  );
}

// ── Campaign details ──────────────────────────────────────────────────────────────────────────

export function CampaignDetails({ campaign, ruleNames, onChange }: { campaign: CcCampaign; ruleNames: string[]; onChange: (next: CcCampaign) => void }) {
  const multi = campaign.adGroups.length > 1;
  const splitPct = multi ? Math.round((1000 / campaign.adGroups.length)) / 10 : 100;

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 28px', font: `400 12.5px/1.6 ${FONT}`, color: TEXT_MUTED }}>
        <span>Budget <strong className="cc-num" style={{ font: `600 12.5px/1.6 ${FONT}`, color: TEXT_PRIMARY }}>{formatCurrency(campaign.dailyBudget)}/day</strong></span>
        <span>
          Rules{' '}
          <strong style={{ font: `600 12.5px/1.6 ${FONT}`, color: ruleNames.length ? TEXT_PRIMARY : TEXT_FAINT }}>{ruleNames.length ? ruleNames.join(', ') : 'None assigned'}</strong>
        </span>
        {multi && (
          <span title="Display only">
            Ad group split{' '}
            <strong className="cc-num" style={{ font: `500 12.5px/1.6 ${FONT}`, color: TEXT_PRIMARY }}>
              {campaign.adGroups.map((ag) => `${ag.name} ${splitPct}%`).join(' · ')}
            </strong>
          </span>
        )}
      </div>
      {campaign.adGroups.map((ag) => (
        <AdGroupEditor
          key={ag.id} campaign={campaign} adGroup={ag}
          onChange={(next) => onChange({ ...campaign, adGroups: campaign.adGroups.map((x) => (x.id === ag.id ? next : x)) })}
        />
      ))}
    </div>
  );
}
