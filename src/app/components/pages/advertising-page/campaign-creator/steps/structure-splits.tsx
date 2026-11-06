import { useId } from 'react';
import {
  DEFAULT_SPLITS, autoMatchTypes, MANUAL_STRATEGY_CATALOG, TARGETING_STRATEGY_CATALOG, splitManualTypes, splitOptions, splitProductsIssue,
  type CcDraft, type SplitBy, type SplitOption, type StructureSplits, type TargetingStrategyId,
} from '../campaign-creator.types';
import { InfoIcon, Radio, WarningIcon } from '../campaign-creator-ui';

// The Performance enhancer (Amazon and Walmart), under the structure in the left column: Split products, then the Manual and Auto
// targeting splits. Each subsection shows only when its campaign type is ticked on Targeting; Walmart's Auto one also
// needs an Auto option ticked, as those options are what it splits by. Walmart says items where Amazon says products.

const Info = ({ tip }: { tip: string }) => (
  <span className="ccd-tm-info" title={tip} role="img" aria-label={tip}><InfoIcon size={13} color="#8a909b" /></span>
);

function Toggle({ on, labelledBy, onToggle }: { on: boolean; labelledBy: string; onToggle: () => void }) {
  return <button type="button" role="switch" aria-checked={on} aria-labelledby={labelledBy} className={`ccd-nm-toggle${on ? ' is-on' : ''}`} onClick={onToggle}><i /></button>;
}

const list = (names: string[]) => (names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`);

function SplitSelect({ id, label, value, options, disabled, hint, onPick }: {
  id: string; label: string; value: SplitBy | null; options: SplitOption[]; disabled?: boolean; hint: string; onPick: (v: SplitBy) => void;
}) {
  const off = options.filter((o) => o.disabled && o.reason);
  return (
    <div className="ccd-pe__field">
      <label htmlFor={id}>{label}</label>
      <select id={id} className="ccd-tm-select ccd-pe__select" value={value ?? ''} disabled={disabled} onChange={(e) => onPick(e.target.value as SplitBy)}>
        {value === null && <option value="">Not split</option>}
        {options.map((o) => <option key={o.id} value={o.id} disabled={o.disabled} title={o.reason}>{o.label}</option>)}
      </select>
      <p className="ccd-pe__hint">{hint}</p>
      {!disabled && off.length > 0 && <p className="ccd-pe__note">{off.map((o) => `${o.label} is off: ${(o.reason ?? "").charAt(0).toLowerCase()}${(o.reason ?? "").slice(1)}.`).join(' ')}</p>}
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
  const manual = [...keyword, ...product];
  const hasAuto = draft.targetingStrategies.includes('auto');
  const strategies = MANUAL_STRATEGY_CATALOG.filter((s) => (draft.manualStrategies ?? []).includes(s.id)).map((s) => s.label);
  const walmart = draft.marketplace === 'walmart';
  const noun = walmart ? 'item' : 'product';
  const autoNames = autoMatchTypes(draft).map((t) => t.label);
  const issue = splitProductsIssue(draft, productCount);

  const campaignHint = !standard ? 'Available in Standard. Consolidated keeps one Manual campaign.'
    : eff.manualCampaigns === 'match' ? `A campaign per match type: ${list(manual.map(label))}`
    : eff.manualCampaigns === 'targeting' ? (keyword.length && product.length ? 'A Keyword targeting campaign and a Product targeting campaign' : `One ${keyword.length ? 'Keyword' : 'Product'} targeting campaign`)
    : `A campaign per strategy: ${list(strategies)}`;
  const adGroupHint = eff.manualAdGroups === 'match' ? (standard && eff.manualCampaigns === 'match' ? 'One ad group per campaign, as each holds one match type' : 'An ad group per match type')
    : eff.manualAdGroups === 'targeting' ? (standard && eff.manualCampaigns === 'targeting' ? 'One ad group per campaign, as each holds one targeting type' : 'Keyword targets and product targets in separate ad groups')
    : `An ad group per strategy: ${list(strategies)}`;

  return (
    <section className="ccd-pe" aria-labelledby={`${uid}-pe`}>
      <div className="ccd-pe__head">
        <strong id={`${uid}-pe`}>Performance enhancer</strong>
        <Info tip="Optional controls that split your targets into more campaigns and ad groups for finer control and reporting." />
      </div>

      <div className="ccd-pe__row">
        <div className="ccd-pe__copy">
          <span className="ccd-pe__label"><span id={`${uid}-sp`}>Split {noun}s</span><Info tip={`Yes builds the structure separately for each ${noun}. No puts all ${noun}s in every ad group.`} /></span>
          <p className="ccd-pe__hint">{eff.products ? `The structure is made once for each of the ${productCount} ${noun}s` : `Every ad group holds all ${productCount} ${noun}${productCount === 1 ? '' : 's'}`}</p>
        </div>
        <Toggle on={eff.products} labelledBy={`${uid}-sp`} onToggle={() => set({ products: !eff.products })} />
      </div>
      {issue && <p className="ccd-pe__error" role="alert"><WarningIcon size={12} />{issue}</p>}

      {manual.length > 0 && (
        <div className="ccd-pe__sub">
          <h4>Manual targeting</h4>
          <SplitSelect
            id={`${uid}-mc`} label="Split campaigns by" value={eff.manualCampaigns} options={campaigns} disabled={!standard}
            hint={campaignHint} onPick={(v) => set({ manualCampaigns: v })}
          />
          <SplitSelect
            id={`${uid}-mag`} label="Split ad groups by" value={eff.manualAdGroups} options={adGroups}
            hint={adGroupHint} onPick={(v) => set({ manualAdGroups: v })}
          />
        </div>
      )}

      {hasAuto && autoNames.length > 0 && (
        <div className="ccd-pe__sub">
          <h4>Auto targeting</h4>
          <div className="ccd-pe__row">
            <div className="ccd-pe__copy">
              <span className="ccd-pe__label" id={`${uid}-am`}>Split by match type</span>
              <p className="ccd-pe__hint">{eff.autoByMatch ? `Separates ${list(autoNames)}` : `One Auto campaign, one ad group for ${list(autoNames)}`}</p>
            </div>
            <Toggle on={eff.autoByMatch} labelledBy={`${uid}-am`} onToggle={() => set({ autoByMatch: !eff.autoByMatch })} />
          </div>
          {eff.autoByMatch && (
            <div className="ccd-pe__radios ccd-enter" role="radiogroup" aria-label="Split Auto by">
              {([
                { id: 'adGroups', name: 'Split ad groups', hint: walmart ? 'One Auto campaign, an ad group per option, to organise items and reporting' : 'One Auto campaign, an ad group per match type', off: false },
                { id: 'campaigns', name: 'Split campaigns', hint: !standard ? 'Available in Standard' : walmart ? 'An Auto campaign per option; each keeps base automatic targeting and opts out of the other' : 'An Auto campaign per match type', off: !standard },
              ] as const).map((o) => {
                const on = eff.autoSplit === o.id;
                return (
                  <div
                    key={o.id} role="radio" aria-checked={on} aria-disabled={o.off} tabIndex={o.off ? -1 : 0}
                    className={`ccd-pe__radio${on ? ' is-on' : ''}`}
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
