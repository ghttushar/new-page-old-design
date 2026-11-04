// @ts-nocheck -- ported verbatim from the source repo, which uses looser TS settings
import {
  AUTO_TYPE_CATALOG, MANUAL_STRATEGY_CATALOG, MARKETPLACE_CAPABILITY,
  type AutoTypeId, type CcDraft, type CcProduct, type ManualStrategyId, type TargetingStrategyId,
} from '../campaign-creator.types';
import { Checkbox, FONT, GOOD, StepHeading, TEXT_MUTED, TEXT_PRIMARY } from '../campaign-creator-ui';

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

/** Walmart's expanded targeting, shown in the Auto table where Amazon has its Auto targeting types. */
const EXPANDED_OPTIONS: ['brandTerms' | 'complementary', string, string][] = [
  ['brandTerms', 'Brand Term Targeting', 'Searches that include your brand terms'],
  ['complementary', 'Complementary Product Targeting', 'Pages of products bought alongside yours'],
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
  function toggle(id: TargetingStrategyId) {
    const set = new Set(draft.targetingStrategies);
    if (set.has(id)) set.delete(id); else set.add(id);
    // Turning Auto on picks every Auto type (on Walmart, both kinds of expanded targeting), and turning it off clears the
    // types; the shopper can then untick the ones they don't want.
    if (id === 'auto' && isWalmart) onChange({ targetingStrategies: Array.from(set), ...(set.has('auto') ? { expandedTargeting: { brandTerms: true, complementary: true } } : {}) });
    else if (id === 'auto') onChange({ targetingStrategies: Array.from(set), autoTypes: set.has('auto') ? AUTO_TYPE_CATALOG.map((a) => a.id) : [] });
    else onChange({ targetingStrategies: Array.from(set) });
  }
  const isWalmart = draft.marketplace === 'walmart';

  const cell = (id: TargetingStrategyId) => (
    <Tile
      key={id} label={TARGET_COPY[id].name} hint={TARGET_COPY[id].hint}
      checked={draft.targetingStrategies.includes(id)} disabled={!supported.includes(id)} onToggle={() => toggle(id)}
    />
  );
  // Walmart has no product targeting, so its Manual table is the keyword row alone.
  const manualRows = MANUAL_ROWS.filter((row) => row.ids.some((id) => supported.includes(id)));
  const manualPicked = manualRows.flatMap((r) => r.ids).filter((id) => draft.targetingStrategies.includes(id));

  // Combination validation (section 6.4).
  const selected = draft.targetingStrategies;
  const productStyleOnly = selected.length > 0 && selected.every((s) => s === 'product' || s === 'category');
  const unsupported = selected.filter((s) => !supported.includes(s));
  const hasAuto = selected.includes('auto');
  // Only the sections the chosen campaign type needs.
  const mode = draft.campaignMode ?? 'both';
  const autoTypes = draft.autoTypes;

  function toggleAutoType(id: AutoTypeId) {
    const set = new Set(autoTypes);
    if (set.has(id)) { if (set.size === 1) return; set.delete(id); } else set.add(id);
    onChange({ autoTypes: AUTO_TYPE_CATALOG.map((a) => a.id).filter((x) => set.has(x)) });
  }

  // The Manual campaign switch. With Manual as the only campaign type it is always on; otherwise turning it off clears
  // its targeting and strategies, so nothing hidden behind the lock is still picked.
  const manualFixed = mode === 'manual';
  const manualOn = manualFixed || Boolean(draft.manualOn) || manualPicked.length > 0;
  function toggleManual() {
    if (manualFixed) return;
    if (manualOn) onChange({ manualOn: false, manualStrategies: [], targetingStrategies: selected.filter((s) => !MANUAL_IDS.includes(s) && s !== 'brand' && s !== 'competitor') });
    else onChange({ manualOn: true });
  }
  const strategies = draft.manualStrategies ?? [];
  function toggleStrategy(id: ManualStrategyId) {
    const set = new Set(strategies);
    if (set.has(id)) set.delete(id); else set.add(id);
    onChange({ manualStrategies: MANUAL_STRATEGY_CATALOG.map((s) => s.id).filter((x) => set.has(x)) });
  }
  const lockedTitle = 'Turn on Manual campaign first';
  const manualCell = (id: TargetingStrategyId) => (
    <Tile
      key={id} label={TARGET_COPY[id].name} hint={TARGET_COPY[id].hint}
      checked={selected.includes(id)} disabled={!manualOn || !supported.includes(id)}
      title={!manualOn ? lockedTitle : undefined} onToggle={() => toggle(id)}
    />
  );

  return (
    <div>
      <StepHeading title="Pick how shoppers find you" />

      <div className="ccd-tg">
        {mode !== 'manual' && (
        <div className="ccd-tg-group">
        <div className="ccd-tg-title">Auto</div>
        <div className="ccd-tg-card">
        {/* Laid out like the Manual table: the Auto switch in the first column, its options in the row beside it. The row
            stays in place when Auto is off, locked, so the page does not jump. Walmart has no Auto types: its row is the
            expanded targeting that widens the Auto campaigns instead. */}
        <div className="ccd-tg-mx" role="group" aria-label="Auto targeting">
          <div className="ccd-tg-mx__switch">
            {cell('auto')}
          </div>
        {isWalmart ? (
          <div className="ccd-tg-mx__row">
            <RowLabel name="Expanded Targeting" info={hasAuto ? 'Extra reach for the Auto campaigns, on top of their own targeting.' : 'Turn on Auto campaign to choose these.'} />
            <div className="ccd-tg-mx__cells ccd-tg-mx__cells--two">
              {EXPANDED_OPTIONS.map(([key, name, hint]) => (
                <Tile
                  key={key} label={name} hint={hint} checked={draft.expandedTargeting[key]} disabled={!hasAuto}
                  onToggle={() => onChange({ expandedTargeting: { ...draft.expandedTargeting, [key]: !draft.expandedTargeting[key] } })}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="ccd-tg-mx__row ccd-tg-mx__row--bare" role="group" aria-label="Auto targeting types">
            <div className="ccd-tg-mx__cells ccd-tg-mx__cells--two">
              {AUTO_TYPE_CATALOG.map((a) => {
                const on = autoTypes.includes(a.id);
                const last = on && autoTypes.length === 1;
                const locked = !hasAuto || last;
                return (
                  <div
                    key={a.id} role="checkbox" aria-checked={on} aria-label={a.label} aria-disabled={locked} tabIndex={hasAuto ? 0 : -1} className="ccd-tg-tile ccd-tg-tile--stacked"
                    title={!hasAuto ? 'Turn on Auto campaign first' : last ? 'At least one type must stay selected' : undefined}
                    onClick={() => { if (hasAuto) toggleAutoType(a.id); }}
                    onKeyDown={(e) => { if (hasAuto && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); toggleAutoType(a.id); } }}
                  >
                    <Checkbox checked={on} />
                    <span className="ccd-tg-tile__text">
                      {a.label}
                      <small>{a.description}</small>
                    </span>
                  </div>
                );
              })}
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
          {/* The Manual switch spans both rows; each row is a kind of target with its three options. */}
          <div className="ccd-tg-mx" role="group" aria-label="Manual targeting">
            <div className="ccd-tg-mx__switch">
              <Tile
                label="Manual campaign" hint="You pick the targets below" checked={manualOn} fixed={manualFixed}
                title={manualFixed ? 'Manual is the campaign type you chose' : undefined} onToggle={toggleManual}
              />
            </div>
            {manualRows.map((row) => (
              <div key={row.name} className="ccd-tg-mx__row">
                <RowLabel name={row.name} info={row.hint} />
                <div className="ccd-tg-mx__cells">{row.ids.map(manualCell)}</div>
              </div>
            ))}
          </div>
          {manualPicked.length > 0 && (
            <div className="ccd-tg-foot" aria-live="polite">
              <span className="ccd-num">{manualPicked.length} picked</span>{manualPicked.map((id) => TARGET_COPY[id].name).join(' · ')}
            </div>
          )}
        </div>
        </div>
        )}

        {mode !== 'auto' && (
        <div className="ccd-tg-group">
        <div className="ccd-tg-title">Strategy <span className="ccd-tg-title__opt">Optional</span></div>
        <div className="ccd-tg-card">
          <div className="ccd-tg-row ccd-tg-row--auto">
            <RowLabel name="Strategy" info={manualOn ? 'Who the Manual campaigns aim at. A tag only; it doesn’t add campaigns.' : 'Turn on Manual campaign to choose these.'} />
            <div className="ccd-tg-cells ccd-tg-cells--wide ccd-tg-mx__cells">
              {MANUAL_STRATEGY_CATALOG.map((s) => (
                <Tile
                  key={s.id} label={s.label} hint={s.hint} checked={strategies.includes(s.id)} disabled={!manualOn}
                  title={!manualOn ? lockedTitle : undefined} onToggle={() => toggleStrategy(s.id)}
                />
              ))}
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
