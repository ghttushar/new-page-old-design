// @ts-nocheck -- ported verbatim from the source repo, which uses looser TS settings
import {
  AUTO_TYPE_CATALOG, MANUAL_STRATEGY_CATALOG, MARKETPLACE_CAPABILITY,
  type AutoTypeId, type CcDraft, type CcProduct, type ManualStrategyId, type TargetingStrategyId,
} from '../campaign-creator.types';
import { Checkbox, FONT, GOOD, StepHeading } from '../campaign-creator-ui';

// ── Table pieces ─────────────────────────────────────────────────────────────────────────────

/** What each target is called in the matrix, and what it does in plain words. */
const TARGET_COPY: Record<TargetingStrategyId, { name: string; hint: string }> = {
  auto: { name: 'Auto campaign', hint: 'The marketplace picks the searches and pages for you' },
  brand: { name: 'Brand keywords', hint: 'Searches that include your brand name' },
  competitor: { name: 'Competitor keywords', hint: "Searches for rival brands' names" },
  broad: { name: 'Broad', hint: 'Related searches, words in any order' },
  phrase: { name: 'Phrase', hint: 'Searches that contain your phrase' },
  exact: { name: 'Exact', hint: 'Only your exact search term' },
  product: { name: 'ASIN Exact', hint: 'Only the product pages you pick' },
  'asin-expanded': { name: 'ASIN Expanded', hint: 'The pages you pick and ones like them' },
  category: { name: 'Category', hint: 'Every product page in a category' },
};

/** The Manual table's two rows: what kind of target, where it shows the ad, and its options. */
const MANUAL_ROWS: { name: string; hint: string; ids: TargetingStrategyId[] }[] = [
  { name: 'Keyword targeting', hint: 'Show the ad when shoppers search', ids: ['broad', 'phrase', 'exact'] },
  { name: 'Product targeting', hint: 'Show the ad on product pages', ids: ['product', 'asin-expanded', 'category'] },
];
const MANUAL_IDS = MANUAL_ROWS.flatMap((r) => r.ids);

/** Walmart's Auto options. Both optional, so its Auto row also has the base automatic targeting to switch Auto on. */
const EXPANDED_OPTIONS: ['brandTerms' | 'complementary', string, string][] = [
  ['brandTerms', 'Brand Term Targeting', 'Searches that include your brand terms'],
  ['complementary', 'Complementary Product Targeting', 'Searches for products bought alongside yours (Beta)'],
];

/**
 * A selectable target: its name with a plain-words line under it; picked, it gets a brand border. `fixed` shows it on
 * and unchangeable without greying it, for a choice the campaign type already made.
 */
function Tile({ checked, disabled, fixed, label, hint, title, onToggle }: {
  checked: boolean; disabled?: boolean; fixed?: boolean; label: string; hint?: string; title?: string; onToggle: () => void;
}) {
  const locked = disabled || fixed;
  return (
    <div
      role="checkbox" aria-checked={checked} aria-label={label} aria-disabled={locked} tabIndex={locked ? -1 : 0}
      onClick={() => !locked && onToggle()}
      onKeyDown={(e) => { if (!locked && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); onToggle(); } }}
      className={`ccd-tg-tile ccd-tg-tile--stacked${fixed ? ' ccd-tg-tile--fixed' : ''}`}
      title={title ?? (disabled ? 'Not available on this marketplace' : undefined)}
    >
      <Checkbox checked={checked} disabled={disabled} />
      <span className="ccd-tg-tile__text">
        {label}
        {hint && <small>{hint}</small>}
      </span>
    </div>
  );
}

/**
 * The first column of the Auto, Manual and Strategy tables: just the name and what it does, with no badge. No
 * control of its own: a campaign is on while any of its options is ticked, so ticking one turns it on and unticking
 * the last turns it off (and clears what depends on it).
 */
function CampaignLabel({ name, hint, on }: { name: string; hint: string; on: boolean }) {
  return (
    <div className={`ccd-tg-camp${on ? ' is-on' : ''}`}>
      <strong>{name}</strong>
      <small>{hint}</small>
    </div>
  );
}

function RowLabel({ name, info }: { name: string; info: string }) {
  return (
    <div className="ccd-tg-label">
      <span className="ccd-tg-label__copy" title={info}>
        <strong>{name}</strong>
        <small>{info}</small>
      </span>
    </div>
  );
}

// ── Step ──────────────────────────────────────────────────────────────────────────────────────

export default function StepTargeting({ draft, selectedProducts, onChange }: {
  draft: CcDraft; selectedProducts: CcProduct[]; onChange: (patch: Partial<CcDraft>) => void;
}) {
  const supported = draft.marketplace ? MARKETPLACE_CAPABILITY[draft.marketplace].targetingStrategies : [];
  const isWalmart = draft.marketplace === 'walmart';
  const selected = draft.targetingStrategies;
  const hasAuto = selected.includes('auto');
  const mode = draft.campaignMode ?? 'both';
  const autoTypes = draft.autoTypes;
  const withAuto = (on: boolean) => (on ? Array.from(new Set([...selected, 'auto'])) : selected.filter((s) => s !== 'auto'));

  // Amazon Auto is on while any Auto type is ticked: the first one turns it on, unticking the last turns it off.
  function toggleAutoType(id: AutoTypeId) {
    const set = new Set(autoTypes);
    if (set.has(id)) set.delete(id); else set.add(id);
    const next = AUTO_TYPE_CATALOG.map((a) => a.id).filter((x) => set.has(x));
    onChange({ autoTypes: next, targetingStrategies: withAuto(next.length > 0) });
  }
  // Walmart Auto can run with neither option, so its base targeting turns it on (with both options, as Walmart does for
  // new Auto campaigns) and off (clearing them). Ticking an option on its own also turns Auto on.
  function toggleWalmartBase() {
    onChange({ targetingStrategies: withAuto(!hasAuto), expandedTargeting: { brandTerms: !hasAuto, complementary: !hasAuto } });
  }
  function toggleExpanded(key: 'brandTerms' | 'complementary') {
    const value = !draft.expandedTargeting[key];
    onChange({ expandedTargeting: { ...draft.expandedTargeting, [key]: value }, ...(value && !hasAuto ? { targetingStrategies: withAuto(true) } : {}) });
  }

  // Walmart has no product targeting, so its Manual table is the keyword row alone.
  const manualRows = MANUAL_ROWS.filter((row) => row.ids.some((id) => supported.includes(id)));
  const manualPicked = manualRows.flatMap((r) => r.ids).filter((id) => selected.includes(id));
  // Manual is on while any of its targets is ticked (always, when it's the only campaign type). Unticking the last
  // target turns it off and clears the strategies, which live inside the Manual block.
  const manualFixed = mode === 'manual';
  const manualOn = manualFixed || manualPicked.length > 0;
  function toggleManualTarget(id: TargetingStrategyId) {
    const set = new Set(selected);
    if (set.has(id)) set.delete(id); else set.add(id);
    const next = Array.from(set);
    const anyManual = next.some((s) => MANUAL_IDS.includes(s));
    onChange({ targetingStrategies: next, manualOn: anyManual, ...(anyManual || manualFixed ? {} : { manualStrategies: [] }) });
  }
  const strategies = draft.manualStrategies ?? [];
  function toggleStrategy(id: ManualStrategyId) {
    const set = new Set(strategies);
    if (set.has(id)) set.delete(id); else set.add(id);
    onChange({ manualStrategies: MANUAL_STRATEGY_CATALOG.map((s) => s.id).filter((x) => set.has(x)) });
  }
  const manualCell = (id: TargetingStrategyId) => (
    <Tile
      key={id} label={TARGET_COPY[id].name} hint={TARGET_COPY[id].hint}
      checked={selected.includes(id)} disabled={!supported.includes(id)} onToggle={() => toggleManualTarget(id)}
    />
  );

  // Combination validation (section 6.4).
  const productStyleOnly = selected.length > 0 && selected.every((s) => s === 'product' || s === 'category');
  const unsupported = selected.filter((s) => !supported.includes(s));

  return (
    <div>
      <StepHeading title="Pick how shoppers find you" />

      <div className="ccd-tg">
        {mode !== 'manual' && (
        <div className="ccd-tg-group">
        <div className="ccd-tg-title">Auto</div>
        <div className="ccd-tg-card">
        {/* The first column names the campaign; its options sit beside it, and ticking them is what turns it on. */}
        <div className="ccd-tg-mx" role="group" aria-label="Auto targeting">
          <div className="ccd-tg-mx__switch">
            <CampaignLabel name="Auto campaign" hint={TARGET_COPY.auto.hint} on={hasAuto} />
          </div>
        {isWalmart ? (
          <div className="ccd-tg-mx__row ccd-tg-mx__row--bare" role="group" aria-label="Auto targeting options">
            <div className="ccd-tg-mx__cells">
              <Tile label="Automatic targeting" hint="Walmart picks the searches. Part of every Auto campaign" checked={hasAuto} onToggle={toggleWalmartBase} />
              {EXPANDED_OPTIONS.map(([key, name, hint]) => (
                <Tile key={key} label={name} hint={hint} checked={hasAuto && draft.expandedTargeting[key]} onToggle={() => toggleExpanded(key)} />
              ))}
            </div>
          </div>
        ) : (
          <div className="ccd-tg-mx__row ccd-tg-mx__row--bare" role="group" aria-label="Auto targeting types">
            <div className="ccd-tg-mx__cells ccd-tg-mx__cells--two">
              {AUTO_TYPE_CATALOG.map((a) => (
                <Tile key={a.id} label={a.label} hint={a.description} checked={autoTypes.includes(a.id)} onToggle={() => toggleAutoType(a.id)} />
              ))}
            </div>
          </div>
        )}
        </div>
        </div>
        </div>
        )}

        {mode !== 'auto' && (
        <div className="ccd-tg-group">
        <div className="ccd-tg-title">Manual</div>
        <div className="ccd-tg-card">
          {/* The campaign name spans both rows; each row is a kind of target with its three options. */}
          <div className="ccd-tg-mx" role="group" aria-label="Manual targeting">
            <div className="ccd-tg-mx__switch">
              <CampaignLabel name="Manual campaign" hint="You pick the searches and product pages" on={manualOn} />
            </div>
            {manualRows.map((row) => (
              <div key={row.name} className="ccd-tg-mx__row">
                <RowLabel name={row.name} info={row.hint} />
                <div className="ccd-tg-mx__cells">{row.ids.map(manualCell)}</div>
              </div>
            ))}
          </div>
        </div>
        </div>
        )}

        {mode !== 'auto' && (
        <div className="ccd-tg-group">
        <div className="ccd-tg-title">Strategy <span className="ccd-tg-title__opt">Optional</span></div>
        <div className="ccd-tg-card">
          {/* Same shape as the tables above: what it is on the left, the three strategies beside it. */}
          <div className={`ccd-tg-mx${manualOn ? '' : ' is-off'}`} role="group" aria-label="Strategy">
            <div className="ccd-tg-mx__switch">
              <CampaignLabel
                name="Strategy" hint={manualOn ? 'Who the Manual campaigns aim at. A tag only; it adds no campaigns.' : 'Pick a Manual target first to choose these.'}
                on={strategies.length > 0}
              />
            </div>
            <div className="ccd-tg-mx__row ccd-tg-mx__row--bare">
              <div className="ccd-tg-mx__cells">
                {MANUAL_STRATEGY_CATALOG.map((s) => (
                  <Tile
                    key={s.id} label={s.label} hint={isWalmart ? s.walmartHint : s.hint} checked={strategies.includes(s.id)} disabled={!manualOn}
                    title={!manualOn ? 'Pick a Manual target first' : undefined} onToggle={() => toggleStrategy(s.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>
        )}
      </div>

      <div style={{ marginTop: 14 }}>
        {mode === 'auto' && selected.length > 0 && unsupported.length === 0 && !productStyleOnly && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, font: `500 12.5px/1.5 ${FONT}`, color: GOOD }}>
            <span aria-hidden>✓</span> {selected.length} {selected.length === 1 ? 'strategy' : 'strategies'} selected — supported combination
          </div>
        )}
      </div>
    </div>
  );
}
