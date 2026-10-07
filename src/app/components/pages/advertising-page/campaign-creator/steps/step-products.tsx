// @ts-nocheck -- ported verbatim from the source repo, which uses looser TS settings
import { Fragment, useMemo, useState } from 'react';
import { type CcDraft, type CcProduct } from '../campaign-creator.types';
import {
  BAD, BORDER, BRAND, BRAND_LINE, BRAND_TINT, Checkbox, ChevronRightIcon, FONT, GOOD, HAIR, SearchIcon,
  StepHeading, SURFACE_MUTED, TextButton, TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY,
} from '../campaign-creator-ui';
import { Panel } from '../cc-design';

type StatusFilter = 'all' | 'eligible' | 'ineligible';
type InventoryFilter = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
type CampaignFilter = 'all' | 'has-campaign' | 'no-campaign';

const LOW_STOCK_BELOW = 200;

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' }, { value: 'eligible', label: 'Eligible' }, { value: 'ineligible', label: 'Ineligible' },
];
const INVENTORY_OPTIONS: { value: InventoryFilter; label: string }[] = [
  { value: 'all', label: 'All' }, { value: 'in-stock', label: 'In stock' },
  { value: 'low-stock', label: `Low stock (<${LOW_STOCK_BELOW})` }, { value: 'out-of-stock', label: 'Out of stock' },
];
const CAMPAIGN_OPTIONS: { value: CampaignFilter; label: string }[] = [
  { value: 'all', label: 'All' }, { value: 'has-campaign', label: 'Has campaign' }, { value: 'no-campaign', label: 'No campaign' },
];

// ── Filters (one set per panel) ───────────────────────────────────────────────────────────────

interface Filters { status: StatusFilter; inventory: InventoryFilter; campaign: CampaignFilter }
const NO_FILTERS: Filters = { status: 'all', inventory: 'all', campaign: 'all' };

function matchesFilters(p: Pick<CcProduct, 'eligible' | 'inventory' | 'hasExistingCampaign'>, f: Filters): boolean {
  if (f.status === 'eligible' && !p.eligible) return false;
  if (f.status === 'ineligible' && p.eligible) return false;
  if (f.inventory === 'in-stock' && p.inventory < LOW_STOCK_BELOW) return false;
  if (f.inventory === 'low-stock' && !(p.inventory > 0 && p.inventory < LOW_STOCK_BELOW)) return false;
  if (f.inventory === 'out-of-stock' && p.inventory !== 0) return false;
  if (f.campaign === 'has-campaign' && !p.hasExistingCampaign) return false;
  if (f.campaign === 'no-campaign' && p.hasExistingCampaign) return false;
  return true;
}

function activeChips(f: Filters): { key: keyof Filters; label: string }[] {
  const chips: { key: keyof Filters; label: string }[] = [];
  if (f.status !== 'all') chips.push({ key: 'status', label: `Status: ${STATUS_OPTIONS.find((o) => o.value === f.status)?.label}` });
  if (f.inventory !== 'all') chips.push({ key: 'inventory', label: `Inventory: ${INVENTORY_OPTIONS.find((o) => o.value === f.inventory)?.label}` });
  if (f.campaign !== 'all') chips.push({ key: 'campaign', label: `Campaign: ${CAMPAIGN_OPTIONS.find((o) => o.value === f.campaign)?.label}` });
  return chips;
}

function FilterGroup<T extends string>({ label, value, options, onChange }: {
  label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label}>
      <div style={{ font: `500 12px/1 ${FONT}`, color: TEXT_MUTED, marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {options.map((o) => {
          const on = value === o.value;
          return (
            <button
              key={o.value} type="button" role="radio" aria-checked={on} className="cc-btn cc-pick" onClick={() => onChange(o.value)}
              style={{ padding: '6px 11px', borderRadius: 999, cursor: 'pointer', border: `1.5px solid ${on ? BRAND : BORDER}`, background: on ? BRAND_TINT : '#fff', color: on ? BRAND : TEXT_PRIMARY, font: `500 12.5px/1.2 ${FONT}` }}
            >{o.label}</button>
          );
        })}
      </div>
    </div>
  );
}

// ── Small icons and buttons ───────────────────────────────────────────────────────────────────

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const FunnelIcon = () => <svg width={13} height={13} viewBox="0 0 16 16" aria-hidden {...stroke}><path d="M2 3h12l-4.6 5.4V13l-2.8-1.4V8.4z" /></svg>;
const TrashIcon = () => <svg width={13} height={13} viewBox="0 0 16 16" aria-hidden {...stroke}><path d="M2.5 4.2h11M6 4.2V2.6h4v1.6M4 4.2l.6 9h6.8l.6-9M6.6 7v4M9.4 7v4" /></svg>;
const BoxIcon = () => <svg width={20} height={20} viewBox="0 0 16 16" aria-hidden {...stroke}><path d="M8 1.6l5.6 2.8v6.2L8 13.4 2.4 10.6V4.4zM2.6 4.5L8 7.3l5.4-2.8M8 7.3v6" /></svg>;
const CloseGlyph = ({ size = 10 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden {...stroke} strokeWidth={1.8}><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" /></svg>;

function ToolButton({ children, onClick, disabled, primary, active, expanded, haspopup }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; primary?: boolean; active?: boolean; expanded?: boolean; haspopup?: boolean;
}) {
  const on = primary && !disabled;
  return (
    <button
      type="button" className="cc-btn cc-ghost" onClick={onClick} disabled={disabled} aria-expanded={expanded} aria-haspopup={haspopup ? 'dialog' : undefined}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, whiteSpace: 'nowrap',
        cursor: disabled ? 'not-allowed' : 'pointer', font: `500 12.5px/1.2 ${FONT}`,
        border: `1px solid ${on ? BRAND : active ? BRAND_LINE : BORDER}`, background: on ? BRAND : active ? BRAND_TINT : '#fff',
        color: on ? '#fff' : disabled ? TEXT_FAINT : active ? BRAND : TEXT_PRIMARY, opacity: disabled ? 0.65 : 1,
      }}
    >{children}</button>
  );
}

function FilterButton({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  const [open, setOpen] = useState(false);
  const count = activeChips(filters).length;
  return (
    <div style={{ position: 'relative' }}>
      <ToolButton onClick={() => setOpen((v) => !v)} active={count > 0} expanded={open} haspopup>
        <FunnelIcon /> Filter
        {count > 0 && <span className="cc-num" style={{ minWidth: 16, padding: '1px 5px', borderRadius: 999, background: BRAND, color: '#fff', font: `600 10.5px/1.3 ${FONT}`, textAlign: 'center' }}>{count}</span>}
      </ToolButton>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 20 }} onMouseDown={() => setOpen(false)} />
          <div
            role="dialog" aria-label="Filter products" className="cc-enter"
            style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 21, width: 330, padding: 16, display: 'flex', flexDirection: 'column', gap: 18, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, boxShadow: '0 14px 32px rgba(20,24,33,.14)' }}
          >
            <FilterGroup label="Status" value={filters.status} options={STATUS_OPTIONS} onChange={(status) => onChange({ ...filters, status })} />
            <FilterGroup label="Inventory" value={filters.inventory} options={INVENTORY_OPTIONS} onChange={(inventory) => onChange({ ...filters, inventory })} />
            <FilterGroup label="Existing campaign" value={filters.campaign} options={CAMPAIGN_OPTIONS} onChange={(campaign) => onChange({ ...filters, campaign })} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: `1px solid ${HAIR}` }}>
              <TextButton onClick={() => onChange(NO_FILTERS)} tone={count ? BRAND : TEXT_FAINT}>Clear filters</TextButton>
              <TextButton onClick={() => setOpen(false)}>Done</TextButton>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/** The "Filters:" strip under a panel header — applied filters as removable chips. */
function FilterStrip({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  const chips = activeChips(filters);
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', border: `1px solid ${BORDER}`, borderRadius: 8, background: '#fff', minHeight: 34, marginBottom: 10 }}>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, padding: '5px 10px' }}>
        <span style={{ font: `400 11.5px/1 ${FONT}`, color: TEXT_FAINT }}>Filters:</span>
        {chips.map((c) => (
          <span key={c.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 4px 3px 9px', borderRadius: 999, background: BRAND_TINT, color: BRAND, font: `500 12px/1.2 ${FONT}` }}>
            {c.label}
            <button type="button" aria-label={`Remove ${c.label}`} onClick={() => onChange({ ...filters, [c.key]: 'all' })} style={{ display: 'flex', padding: 3, border: 'none', background: 'none', color: BRAND, cursor: 'pointer', borderRadius: '50%' }}><CloseGlyph /></button>
          </span>
        ))}
      </div>
      <button
        type="button" aria-label="Clear all filters" disabled={chips.length === 0} onClick={() => onChange(NO_FILTERS)}
        style={{ width: 34, flex: 'none', border: 'none', borderLeft: `1px solid ${BORDER}`, background: SURFACE_MUTED, borderRadius: '0 8px 8px 0', color: chips.length ? TEXT_MUTED : '#cfd4dc', cursor: chips.length ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      ><CloseGlyph size={11} /></button>
    </div>
  );
}

function SearchBox({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <label style={{ position: 'relative', display: 'block', marginBottom: 18 }}>
      <span style={{ position: 'absolute', left: 12, top: 0, bottom: 0, display: 'flex', alignItems: 'center' }}><SearchIcon /></span>
      <input
        className="cc-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search ASIN/Title" aria-label={label}
        style={{ width: '100%', padding: '10px 12px 10px 34px', border: `1px solid ${BORDER}`, borderRadius: 8, font: `400 13px/1.2 ${FONT}`, color: TEXT_PRIMARY, outline: 'none', background: '#fff' }}
      />
    </label>
  );
}

function PanelHead({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
      <h2 style={{ margin: 0, font: `600 15px/1.3 ${FONT}`, color: TEXT_PRIMARY }}>
        {title} <span className="cc-num">({count.toLocaleString()})</span>
      </h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{children}</div>
    </div>
  );
}

// ── Table pieces ──────────────────────────────────────────────────────────────────────────────

const TH: React.CSSProperties = {
  textAlign: 'left', padding: '12px 12px', font: `600 13px/1 ${FONT}`, color: TEXT_PRIMARY,
  background: '#fff', borderBottom: `1px solid ${BORDER}`, whiteSpace: 'nowrap',
};
const TD: React.CSSProperties = { padding: '10px 12px', borderBottom: `1px solid ${HAIR}`, verticalAlign: 'middle' };
const CHECK_COL: React.CSSProperties = { width: 46, padding: '10px 0 10px 14px' };

function RowCheck({ checked, disabled, label, onToggle }: { checked: boolean; disabled?: boolean; label: string; onToggle: () => void }) {
  return (
    <span
      role="checkbox" aria-checked={checked} aria-label={label} aria-disabled={disabled} tabIndex={disabled ? -1 : 0}
      onClick={(e) => { e.stopPropagation(); if (!disabled) onToggle(); }}
      onKeyDown={(e) => { if (!disabled && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); e.stopPropagation(); onToggle(); } }}
      style={{ display: 'inline-flex', borderRadius: 6, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <Checkbox checked={checked} disabled={disabled} />
    </span>
  );
}

/** Name on the first line; "SKU | ASIN | status" beneath it. Ineligible products say why. */
function ProductCell({ title, color, sku, asin, reason, eligible = true, indent, hideStatus }: {
  title: string; color: string; sku: string; asin: string; eligible?: boolean; reason?: string; indent?: boolean; hideStatus?: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, overflow: 'hidden' }}>
      <span style={{ width: indent ? 30 : 36, height: indent ? 30 : 36, borderRadius: 6, background: color, flex: 'none', opacity: indent ? 0.75 : 1 }} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div title={title} style={{ font: `500 13px/1.35 ${FONT}`, color: TEXT_PRIMARY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
        <div className="cc-num" style={{ font: `400 12px/1.4 ${FONT}`, color: TEXT_MUTED, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          SKU - {sku} <span style={{ color: '#cfd4dc' }}>|</span> ASIN - {asin} {!(hideStatus && eligible) && <><span style={{ color: '#cfd4dc' }}>|</span>{' '}</>}
          {hideStatus && eligible ? null : eligible ? <span style={{ color: GOOD }}>Eligible</span> : <span style={{ color: BAD }}>{reason ?? 'Ineligible'}</span>}
        </div>
      </div>
    </div>
  );
}

const NUM: React.CSSProperties = { ...TD, textAlign: 'right', color: TEXT_MUTED, whiteSpace: 'nowrap', paddingLeft: 4, paddingRight: 6 };
const NUM_TH: React.CSSProperties = { ...TH, width: 62, textAlign: 'right', paddingLeft: 4, paddingRight: 6, fontWeight: 500, color: TEXT_MUTED };

/** $128.4K style, so five metric columns still leave room for the product name. */
function compactMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(n >= 100_000 ? 0 : 1).replace(/\.0$/, '')}K`;
  return `$${Math.round(n)}`;
}

function Metrics({ inventory, sales, adSpend, adSales, acos, all = true }: { inventory: number; sales: number; adSpend: number; adSales: number; acos: number; all?: boolean }) {
  const acosColor = acos > 28 ? '#a8763f' : TEXT_MUTED;
  return (
    <>
      <td className="cc-num" style={{ ...NUM, color: inventory === 0 ? BAD : inventory < LOW_STOCK_BELOW ? '#a8763f' : TEXT_MUTED }}>{inventory.toLocaleString()}</td>
      {all && <td className="cc-num" style={NUM}>{compactMoney(sales)}</td>}
      {all && <td className="cc-num" style={NUM}>{compactMoney(adSpend)}</td>}
      {all && <td className="cc-num" style={NUM}>{compactMoney(adSales)}</td>}
      <td className="cc-num" style={{ ...NUM, color: acosColor }}>{acos > 0 ? `${acos.toFixed(1)}%` : '—'}</td>
    </>
  );
}

const PANEL_TABLE: React.CSSProperties = { border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'auto', background: '#fff' };

// ── Step ──────────────────────────────────────────────────────────────────────────────────────

export default function StepProducts({ draft, products, selectedProducts, onChange }: {
  draft: CcDraft; products: CcProduct[]; selectedProducts: CcProduct[]; onChange: (patch: Partial<CcDraft>) => void;
}) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [addedSearch, setAddedSearch] = useState('');
  const [addedFilters, setAddedFilters] = useState<Filters>(NO_FILTERS);
  // Ticked in the left table, waiting for "Add Selections".
  const [staged, setStaged] = useState<Set<string>>(new Set());
  // Ticked in the right table, waiting for "Clear".
  const [stagedRemove, setStagedRemove] = useState<Set<string>>(new Set());
  // Parents with child products start expanded.
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(products.filter((p) => p.children?.length).map((p) => p.id)));

  const noEligibleAtAll = products.every((p) => !p.eligible);
  const added = new Set(draft.productIds);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (!matchesFilters(p, filters)) return false;
      if (!q) return true;
      const own = `${p.title} ${p.asin} ${p.sku}`.toLowerCase().includes(q);
      return own || (p.children ?? []).some((k) => `${k.title} ${k.asin} ${k.sku}`.toLowerCase().includes(q));
    });
  }, [products, search, filters]);

  const shownAdded = useMemo(() => {
    const q = addedSearch.trim().toLowerCase();
    return selectedProducts.filter((p) => matchesFilters(p, addedFilters) && (!q || `${p.title} ${p.asin} ${p.sku}`.toLowerCase().includes(q)));
  }, [selectedProducts, addedSearch, addedFilters]);

  // Everything in the left list a user can still add: eligible rows, plus the variations of expanded parents, not already added.
  const addableIds = useMemo(
    () => filtered.filter((p) => p.eligible).flatMap((p) => [p.id, ...(expanded.has(p.id) ? (p.children ?? []).map((k) => k.id) : [])]).filter((id) => !added.has(id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filtered, expanded, draft.productIds],
  );
  const listedCount = filtered.reduce((n, p) => n + 1 + (p.children?.length ?? 0), 0);
  const allStaged = addableIds.length > 0 && addableIds.every((id) => staged.has(id));

  function toggleSet(setter: React.Dispatch<React.SetStateAction<Set<string>>>, id: string) {
    setter((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  }
  function toggleExpanded(id: string) { toggleSet(setExpanded, id); }
  function toggleAdded(id: string) {
    const set = new Set(draft.productIds);
    if (set.has(id)) set.delete(id); else set.add(id);
    onChange({ productIds: Array.from(set) });
    setStaged((prev) => { const n = new Set(prev); n.delete(id); return n; });
  }
  function addStaged() {
    onChange({ productIds: Array.from(new Set([...draft.productIds, ...Array.from(staged)])) });
    setStaged(new Set());
  }
  function clearAdded() {
    const drop = stagedRemove.size > 0 ? stagedRemove : new Set(draft.productIds);
    onChange({ productIds: draft.productIds.filter((id) => !drop.has(id)) });
    setStagedRemove(new Set());
  }

  const allAddedStaged = shownAdded.length > 0 && shownAdded.every((p) => stagedRemove.has(p.id));

  return (
    <div>
      <StepHeading title="Choose products to promote" />

      <div className="cc-product-stage">
      <div className="cc-product-grid">
        {/* All products */}
        <Panel pad={14} className="cc-product-panel">
          <SearchBox value={search} onChange={setSearch} label="Search all products" />
          <PanelHead title="All Products" count={listedCount}>
            <FilterButton filters={filters} onChange={setFilters} />
            <ToolButton primary disabled={staged.size === 0} onClick={addStaged}>
              Add Selections{staged.size > 0 ? ` (${staged.size})` : ''}
            </ToolButton>
          </PanelHead>
          <FilterStrip filters={filters} onChange={setFilters} />

          <div className="cc-scroll" style={{ ...PANEL_TABLE, height: 460 }}>
            <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: 0, font: `400 13px/1.4 ${FONT}` }}>
              <thead>
                <tr style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <th style={{ ...TH, ...CHECK_COL }}>
                    <RowCheck
                      checked={allStaged} disabled={addableIds.length === 0} label="Select all products on this list"
                      onToggle={() => setStaged(allStaged ? new Set() : new Set(addableIds))}
                    />
                  </th>
                  <th style={TH}>Product</th>
                  <th style={NUM_TH}>Inventory</th>
                  <th style={NUM_TH}>Sales</th>
                  <th style={NUM_TH}>Ad spend</th>
                  <th style={NUM_TH}>Ad sales</th>
                  <th style={NUM_TH}>ACOS</th>
                </tr>
              </thead>
              <tbody>
                {!noEligibleAtAll && filtered.map((p) => {
                  const kids = p.children ?? [];
                  const isOpen = kids.length > 0 && expanded.has(p.id);
                  const isAdded = added.has(p.id);
                  const canAdd = p.eligible && !isAdded;
                  return (
                    <Fragment key={p.id}>
                      <tr className="cc-row" onClick={() => canAdd && toggleSet(setStaged, p.id)} style={{ cursor: canAdd ? 'pointer' : 'default', background: isAdded ? BRAND_TINT : undefined, opacity: p.eligible ? 1 : 0.6 }}>
                        <td style={{ ...TD, ...CHECK_COL }}>
                          <RowCheck checked={staged.has(p.id) || isAdded} disabled={!canAdd} label={`Select ${p.title}`} onToggle={() => toggleSet(setStaged, p.id)} />
                        </td>
                        <td style={{ ...TD, overflow: 'hidden' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, overflow: 'hidden' }}>
                            {kids.length > 0 ? (
                              <button
                                type="button" aria-expanded={isOpen} aria-label={isOpen ? 'Hide variations' : 'Show variations'}
                                onClick={(e) => { e.stopPropagation(); toggleExpanded(p.id); }}
                                style={{ width: 22, height: 22, padding: 0, border: 'none', background: 'none', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 140ms ease-out' }}
                              ><ChevronRightIcon size={12} color={TEXT_MUTED} /></button>
                            ) : <span style={{ width: 22, flex: 'none' }} />}
                            <ProductCell title={p.title} color={p.thumbnailColor} sku={p.sku} asin={p.asin} eligible={p.eligible} reason={p.ineligibleReason} />
                          </div>
                        </td>
                        <Metrics inventory={p.inventory} sales={p.sales} adSpend={p.adSpend} adSales={p.adSales} acos={p.acos} />
                      </tr>
                      {isOpen && kids.map((k) => {
                        const kAdded = added.has(k.id);
                        const kCanAdd = p.eligible && !kAdded;
                        return (
                          <tr key={k.id} className="cc-row" onClick={() => kCanAdd && toggleSet(setStaged, k.id)} style={{ cursor: kCanAdd ? 'pointer' : 'default', background: kAdded ? BRAND_TINT : SURFACE_MUTED }}>
                            <td style={{ ...TD, ...CHECK_COL }}>
                              <RowCheck checked={staged.has(k.id) || kAdded} disabled={!kCanAdd} label={`Select ${k.title}`} onToggle={() => toggleSet(setStaged, k.id)} />
                            </td>
                            <td style={{ ...TD, paddingLeft: 40, position: 'relative', overflow: 'hidden' }}>
                              <span aria-hidden style={{ position: 'absolute', left: 24, top: 0, bottom: '50%', width: 12, borderLeft: `1.5px solid ${BORDER}`, borderBottom: `1.5px solid ${BORDER}`, borderBottomLeftRadius: 6 }} />
                              <ProductCell title={k.title} color={p.thumbnailColor} sku={k.sku} asin={k.asin} indent />
                            </td>
                            <Metrics inventory={k.inventory} sales={Math.round(k.adSales * 3.1)} adSpend={k.adSpend} adSales={k.adSales} acos={k.acos} />
                          </tr>
                        );
                      })}
                    </Fragment>
                  );
                })}
                {noEligibleAtAll && (
                  <tr>
                    <td colSpan={7} style={{ padding: '44px 14px', textAlign: 'center' }}>
                      <div style={{ font: `600 14px/1.4 ${FONT}`, color: TEXT_PRIMARY }}>No eligible products found</div>
                      <div style={{ margin: '4px auto 0', maxWidth: 340, font: `400 13px/1.55 ${FONT}`, color: TEXT_MUTED }}>There are currently no products available for Sponsored Products campaign creation.</div>
                    </td>
                  </tr>
                )}
                {!noEligibleAtAll && filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px 14px', textAlign: 'center' }}>
                      <div style={{ font: `400 13px/1.5 ${FONT}`, color: TEXT_MUTED }}>
                        {search.trim() ? `No products match “${search.trim()}” with these filters.` : 'No products match these filters.'}
                      </div>
                      {(search.trim() || activeChips(filters).length > 0) && <div style={{ marginTop: 8 }}><TextButton onClick={() => { setSearch(''); setFilters(NO_FILTERS); }}>Clear search and filters</TextButton></div>}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Added products */}
        <Panel pad={14} className="cc-product-panel cc-product-panel--selected">
          <SearchBox value={addedSearch} onChange={setAddedSearch} label="Search added products" />
          <PanelHead title="Added Products" count={selectedProducts.length}>
            <FilterButton filters={addedFilters} onChange={setAddedFilters} />
            <ToolButton disabled={selectedProducts.length === 0} onClick={clearAdded}>
              <TrashIcon /> {stagedRemove.size > 0 ? `Clear (${stagedRemove.size})` : 'Clear All'}
            </ToolButton>
          </PanelHead>
          <FilterStrip filters={addedFilters} onChange={setAddedFilters} />

          <div className="cc-scroll" style={{ ...PANEL_TABLE, height: 460 }}>
            <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: 0, font: `400 13px/1.4 ${FONT}` }}>
              <thead>
                <tr style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <th style={{ ...TH, ...CHECK_COL }}>
                    <RowCheck
                      checked={allAddedStaged} disabled={shownAdded.length === 0} label="Select all added products"
                      onToggle={() => setStagedRemove(allAddedStaged ? new Set() : new Set(shownAdded.map((p) => p.id)))}
                    />
                  </th>
                  <th style={TH}>Product</th>
                  <th style={NUM_TH}>Inventory</th>
                  <th style={NUM_TH}>Sales</th>
                  <th style={NUM_TH}>Ad spend</th>
                  <th style={NUM_TH}>Ad sales</th>
                  <th style={NUM_TH}>ACOS</th>
                </tr>
              </thead>
              <tbody>
                {shownAdded.map((p) => (
                  <tr key={p.id} className="cc-row">
                    <td style={{ ...TD, ...CHECK_COL }}>
                      <RowCheck checked={stagedRemove.has(p.id)} label={`Select ${p.title}`} onToggle={() => toggleSet(setStagedRemove, p.id)} />
                    </td>
                    <td style={{ ...TD, overflow: 'hidden' }}>
                      <ProductCell title={p.title} color={p.thumbnailColor} sku={p.sku} asin={p.asin} eligible={p.eligible} reason={p.ineligibleReason} indent={Boolean(p.parentTitle)} />
                    </td>
                    <Metrics inventory={p.inventory} sales={p.sales} adSpend={p.adSpend} adSales={p.adSales} acos={p.acos} />
                  </tr>
                ))}
                {shownAdded.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ height: 380, textAlign: 'center', color: TEXT_MUTED }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, font: `400 13px/1.4 ${FONT}` }}>
                        <span style={{ color: TEXT_FAINT, display: 'flex' }}><BoxIcon /></span>
                        {selectedProducts.length === 0 ? "There isn't any product added in the list." : 'No added products match these filters.'}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
      </div>
    </div>
  );
}
