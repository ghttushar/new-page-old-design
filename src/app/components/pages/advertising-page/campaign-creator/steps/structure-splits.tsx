import { useId } from 'react';
import {
  DEFAULT_SPLITS, autoMatchTypes, MANUAL_STRATEGY_CATALOG, TARGETING_STRATEGY_CATALOG, splitManualTypes, splitOptions, splitProductsIssue,
  type CcDraft, type SplitBy, type SplitOption, type StructureSplits, type TargetingStrategyId,
} from '../campaign-creator.types';
import { InfoIcon, Radio, WarningIcon } from '../campaign-creator-ui';

// The Performance enhancer (Amazon and Walmart), under the structures in the left column. Three soft blocks: Split
// products, Manual targeting and Auto targeting, the last two marked with the diagram's M and A shapes so they read
// as the same campaigns. Each targeting block shows only when its campaign type is ticked on Targeting; Walmart's Auto
// one also needs an Auto option ticked, as those options are what it splits by. Walmart says items where Amazon says products.

const Info = ({ tip }: { tip: string }) => (
  <span className="ccd-tm-info" title={tip} role="img" aria-label={tip}><InfoIcon size={13} color="#8a909b" /></span>
);

function Toggle({ on, labelledBy, onToggle }: { on: boolean; labelledBy: string; onToggle: () => void }) {
  return <button type="button" role="switch" aria-checked={on} aria-labelledby={labelledBy} className={`ccd-nm-toggle${on ? ' is-on' : ''}`} onClick={onToggle}><i /></button>;
}

/** The Targeting page's order, so the summary lists match types the way they were shown. */
const PAGE_ORDER: TargetingStrategyId[] = ['broad', 'phrase', 'exact', 'brand', 'competitor', 'product', 'asin-expanded', 'category'];

const list = (names: string[]) => (names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`);

function SplitSelect({ id, label, value, options, disabled, onPick }: {
  id: string; label: string; value: SplitBy | null; options: SplitOption[]; disabled?: boolean; onPick: (v: SplitBy) => void;
}) {
  return (
    <div className="ccd-pe__field">
      <label htmlFor={id}>{label}</label>
      <select id={id} className="ccd-tm-select ccd-pe__select" value={value ?? ''} disabled={disabled} title={disabled ? 'Available in Standard' : undefined} onChange={(e) => onPick(e.target.value as SplitBy)}>
        {value === null && <option value="">Not split</option>}
        {options.map((o) => <option key={o.id} value={o.id} disabled={o.disabled} title={o.reason}>{o.label}</option>)}
      </select>
    </div>
  );
}

export default function PerformanceEnhancer({ draft, productCount, onChange }: {
  draft: CcDraft; productCount: number; onChange: (patch: Partial<CcDraft>) => void;
}) {
  const uid = useId();
  const { campaigns, adGroups, effective: eff } = splitOptions(draft);
  const set = (patch: Partial<StructureSplits>) => onChange({ splits: { ...DEFAULT_SPLITS, ...draft.splits, ...patch } });
  const standard = draft.structureId === 'standard';
  const label = (t: TargetingStrategyId) => TARGETING_STRATEGY_CATALOG[t]?.label ?? t;
  const { keyword, product } = splitManualTypes(draft.targetingStrategies);
  const manual = [...keyword, ...product].sort((a, b) => PAGE_ORDER.indexOf(a) - PAGE_ORDER.indexOf(b));
  const hasAuto = draft.targetingStrategies.includes('auto');
  const strategies = MANUAL_STRATEGY_CATALOG.filter((s) => (draft.manualStrategies ?? []).includes(s.id)).map((s) => s.label);
  const walmart = draft.marketplace === 'walmart';
  const noun = walmart ? 'item' : 'product';
  const autoNames = autoMatchTypes(draft).map((t) => t.label);
  const issue = splitProductsIssue(draft, productCount);

  // What the two Manual dropdowns make, said once in plain words under them.
  const campaignPart = !standard ? 'One Manual campaign'
    : eff.manualCampaigns === 'match' ? `A campaign per match type (${list(manual.map(label))})`
    : eff.manualCampaigns === 'targeting' ? (keyword.length && product.length ? 'A Keyword targeting and a Product targeting campaign' : `One ${keyword.length ? 'Keyword' : 'Product'} targeting campaign`)
    : `A campaign per strategy (${list(strategies)})`;
  const adGroupPart = eff.manualAdGroups === 'match' ? (standard && eff.manualCampaigns === 'match' ? 'one ad group in each' : 'an ad group per match type')
    : eff.manualAdGroups === 'targeting' ? (standard && eff.manualCampaigns === 'targeting' ? 'one ad group in each' : 'keyword and product targets in separate ad groups')
    : `an ad group per strategy (${list(strategies)})`;
  const offOptions = adGroups.filter((o) => o.disabled && o.reason);

  const autoChoices = [
    { id: 'adGroups', name: 'Split ad groups', hint: walmart ? 'An ad group per option' : 'An ad group per match type', tip: walmart ? 'The options are campaign settings, so these ad groups organise items and reporting only.' : undefined, off: false },
    { id: 'campaigns', name: 'Split campaigns', hint: !standard ? 'Standard only' : walmart ? 'A campaign per option' : 'A campaign per match type', tip: walmart && standard ? 'Each campaign keeps base automatic targeting and opts out of the other option, so they overlap.' : undefined, off: !standard },
  ] as const;

  return (
    <section className="ccd-pe" aria-labelledby={`${uid}-pe`}>
      <div className="ccd-pe__head">
        <strong id={`${uid}-pe`}>Performance enhancer</strong>
        <Info tip="Optional controls that split your targets into more campaigns and ad groups for finer control and reporting." />
      </div>

      <div className="ccd-pe__block">
        <div className="ccd-pe__row">
          <div className="ccd-pe__copy">
            <span className="ccd-pe__label"><span id={`${uid}-sp`}>Split {noun}s</span><Info tip={`Yes builds the structure separately for each ${noun}. No puts all ${noun}s in every ad group.`} /></span>
            <p className="ccd-pe__hint">{eff.products ? `A full structure for each of the ${productCount} ${noun}s` : `Every ad group holds all ${productCount} ${noun}${productCount === 1 ? '' : 's'}`}</p>
          </div>
          <Toggle on={eff.products} labelledBy={`${uid}-sp`} onToggle={() => set({ products: !eff.products })} />
        </div>
        {issue && <p className="ccd-pe__error" role="alert"><WarningIcon size={12} />{issue}</p>}
      </div>

      {manual.length > 0 && (
        <div className="ccd-pe__block">
          <div className="ccd-pe__block-head">
            <span className="ccd-tr-shape ccd-tr-shape--manual ccd-pe__badge" aria-hidden><b>M</b></span>
            <strong>Manual targeting</strong>
          </div>
          <div className="ccd-pe__grid">
            <SplitSelect id={`${uid}-mc`} label="Split campaigns by" value={eff.manualCampaigns} options={campaigns} disabled={!standard} onPick={(v) => set({ manualCampaigns: v })} />
            <SplitSelect id={`${uid}-mag`} label="Split ad groups by" value={eff.manualAdGroups} options={adGroups} onPick={(v) => set({ manualAdGroups: v })} />
          </div>
          <p className="ccd-pe__result">{campaignPart}, {adGroupPart}.</p>
          {offOptions.length > 0 && (
            <p className="ccd-pe__note">
              <InfoIcon size={11} color="#a3a8b2" />
              {offOptions.map((o) => `${o.label} is off: ${(o.reason ?? '').charAt(0).toLowerCase()}${(o.reason ?? '').slice(1)}.`).join(' ')}
            </p>
          )}
        </div>
      )}

      {hasAuto && autoNames.length > 0 && (
        <div className="ccd-pe__block">
          <div className="ccd-pe__block-head">
            <span className="ccd-tr-shape ccd-tr-shape--auto ccd-pe__badge" aria-hidden><b>A</b></span>
            <strong>Auto targeting</strong>
            {/* The split switch sits on the header row, so the block stays one line shorter. */}
            <span className="ccd-pe__head-ctl">
              <span className="ccd-pe__label" id={`${uid}-am`}>Split by match type</span>
              <Toggle on={eff.autoByMatch} labelledBy={`${uid}-am`} onToggle={() => set({ autoByMatch: !eff.autoByMatch })} />
            </span>
          </div>
          <p className="ccd-pe__hint">{eff.autoByMatch ? `Separates ${list(autoNames)}` : `One campaign, one ad group for ${list(autoNames)}`}</p>
          {eff.autoByMatch && (
            <div className="ccd-pe__choices ccd-enter" role="radiogroup" aria-label="Split Auto by">
              {autoChoices.map((o) => {
                const on = eff.autoSplit === o.id;
                return (
                  <div
                    key={o.id} role="radio" aria-checked={on} aria-disabled={o.off} tabIndex={o.off ? -1 : 0} title={o.tip}
                    className={`ccd-pe__choice${on ? ' is-on' : ''}`}
                    onClick={() => !o.off && set({ autoSplit: o.id })}
                    onKeyDown={(e) => { if (!o.off && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); set({ autoSplit: o.id }); } }}
                  >
                    <Radio checked={on} disabled={o.off} />
                    <span><strong>{o.name}</strong><small>{o.hint}</small></span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
