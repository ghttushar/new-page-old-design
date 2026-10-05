import { Fragment, useMemo, useState } from 'react';
import { recommendGroupingMode, formatCurrency, type CcDraft, type CcProduct, type GroupingMode } from '../campaign-creator.types';
import {
  BAD, BORDER, BRAND, BRAND_LINE, BRAND_TINT, Checkbox, ChevronRightIcon, FONT, GOOD, HAIR, Radio, RecommendedTag, SearchIcon,
  SectionTitle, StepHeading, SURFACE_MUTED, TextButton, TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY, WARN,
} from '../campaign-creator-ui';

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

function matchesInventory(inventory: number, f: InventoryFilter): boolean {
  if (f === 'in-stock') return inventory >= LOW_STOCK_BELOW;
  if (f === 'low-stock') return inventory > 0 && inventory < LOW_STOCK_BELOW;
  if (f === 'out-of-stock') return inventory === 0;
  return true;
}

function FilterSelect<T extends string>({ label, value, options, onChange }: {
  label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void;
}) {
  const active = value !== 'all';
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: `500 12px/1 ${FONT}`, color: TEXT_MUTED, whiteSpace: 'nowrap' }}>
      {label}
      <select
        className="cc-input" value={value} onChange={(e) => onChange(e.target.value as T)} aria-label={`Filter by ${label.toLowerCase()}`}
        style={{
          padding: '7px 8px', border: `1px solid ${active ? BRAND_LINE : BORDER}`, borderRadius: 8, background: active ? BRAND_TINT : '#fff',
          font: `500 12.5px/1.2 ${FONT}`, color: active ? BRAND : TEXT_PRIMARY, outline: 'none', cursor: 'pointer',
        }}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

const TH: React.CSSProperties = {
  textAlign: 'left', padding: '10px 10px', font: `500 12px/1 ${FONT}`, color: TEXT_MUTED,
  background: SURFACE_MUTED, borderBottom: `1px solid ${BORDER}`, whiteSpace: 'nowrap',
};
const TD: React.CSSProperties = { padding: '11px 10px', borderBottom: `1px solid ${HAIR}`, verticalAlign: 'middle' };
const NUM: React.CSSProperties = { ...TD, color: TEXT_MUTED, whiteSpace: 'nowrap' };

function Status({ eligible, reason }: { eligible: boolean; reason?: string }) {
  return (
    <div>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: `500 12.5px/1.2 ${FONT}`, color: eligible ? GOOD : BAD }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: eligible ? GOOD : BAD }} />
        {eligible ? 'Eligible' : 'Ineligible'}
      </span>
      {!eligible && reason && <div style={{ font: `400 11.5px/1.4 ${FONT}`, color: TEXT_FAINT, marginTop: 3 }}>{reason}</div>}
    </div>
  );
}

function AsinCell({ asin, sku }: { asin: string; sku: string }) {
  return (
    <td style={{ ...TD, whiteSpace: 'nowrap' }}>
      <div style={{ font: `400 13px/1.35 ${FONT}`, color: TEXT_MUTED }}>{asin}</div>
      <div style={{ font: `400 11.5px/1.4 ${FONT}`, color: TEXT_FAINT }}>{sku}</div>
    </td>
  );
}

function RowCheck({ checked, disabled, label, onToggle }: { checked: boolean; disabled?: boolean; label: string; onToggle: () => void }) {
  return (
    <span
      role="checkbox" aria-checked={checked} aria-label={label} aria-disabled={disabled} tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => { if (!disabled && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); e.stopPropagation(); onToggle(); } }}
      style={{ display: 'inline-flex', borderRadius: 6 }}
    >
      <Checkbox checked={checked} disabled={disabled} />
    </span>
  );
}

function ProductCell({ p, indent, subtitle, wide, marker }: {
  p: Pick<CcProduct, 'title' | 'thumbnailColor' | 'brand' | 'category' | 'parentTitle'>; indent?: boolean; subtitle?: string; wide?: boolean; marker?: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
      <span style={{ width: indent ? 24 : 30, height: indent ? 24 : 30, borderRadius: 7, background: p.thumbnailColor, flex: 'none', opacity: indent ? 0.75 : 1 }} />
      <div style={{ minWidth: 0 }}>
        <div style={{ font: `${indent ? 500 : 600} 13px/1.35 ${FONT}`, color: TEXT_PRIMARY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: wide ? 340 : 270 }}>{p.title}</div>
        <div style={{ font: `400 12px/1.4 ${FONT}`, color: TEXT_FAINT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: wide ? 340 : 270 }}>
          {subtitle ?? (p.parentTitle ? `Variation of ${p.parentTitle}` : `${p.brand} · ${p.category}`)}
        </div>
        {marker && <div style={{ font: `400 11.5px/1.4 ${FONT}`, color: TEXT_FAINT, whiteSpace: 'nowrap' }}>{marker}</div>}
      </div>
    </div>
  );
}

export default function StepProducts({ draft, products, selectedProducts, onChange }: {
  draft: CcDraft; products: CcProduct[]; selectedProducts: CcProduct[]; onChange: (patch: Partial<CcDraft>) => void;
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [inventoryFilter, setInventoryFilter] = useState<InventoryFilter>('all');
  const [campaignFilter, setCampaignFilter] = useState<CampaignFilter>('all');
  // Parents with child products start expanded.
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(products.filter((p) => p.children?.length).map((p) => p.id)));

  const hasActiveFilters = statusFilter !== 'all' || inventoryFilter !== 'all' || campaignFilter !== 'all' || search.trim() !== '';
  const noEligibleAtAll = products.every((p) => !p.eligible);

  function clearFilters() {
    setSearch(''); setStatusFilter('all'); setInventoryFilter('all'); setCampaignFilter('all');
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (statusFilter === 'eligible' && !p.eligible) return false;
      if (statusFilter === 'ineligible' && p.eligible) return false;
      if (!matchesInventory(p.inventory, inventoryFilter)) return false;
      if (campaignFilter === 'has-campaign' && !p.hasExistingCampaign) return false;
      if (campaignFilter === 'no-campaign' && p.hasExistingCampaign) return false;
      if (!q) return true;
      const own = `${p.title} ${p.asin} ${p.sku}`.toLowerCase().includes(q);
      return own || (p.children ?? []).some((k) => `${k.title} ${k.asin} ${k.sku}`.toLowerCase().includes(q));
    });
  }, [products, search, statusFilter, inventoryFilter, campaignFilter]);

  // Product groups (section 4.4): quick-select sets built from the account's categories plus a few smart groups.
  const groups = useMemo(() => {
    const categories = Array.from(new Set(products.map((p) => p.category)));
    const defs: { id: string; label: string; items: CcProduct[] }[] = [
      ...categories.map((c) => ({ id: `cat-${c}`, label: c, items: products.filter((p) => p.category === c) })),
      { id: 'advertised', label: 'Already advertised', items: products.filter((p) => p.hasExistingCampaign) },
      { id: 'low-stock', label: 'Low stock', items: products.filter((p) => p.inventory > 0 && p.inventory < LOW_STOCK_BELOW) },
    ];
    return defs
      .map((g) => ({ ...g, eligibleIds: g.items.filter((p) => p.eligible).map((p) => p.id) }))
      .filter((g) => g.eligibleIds.length > 0);
  }, [products]);

  function toggleGroup(ids: string[]) {
    const set = new Set(draft.productIds);
    const allOn = ids.every((id) => set.has(id));
    ids.forEach((id) => { if (allOn) set.delete(id); else set.add(id); });
    onChange({ productIds: Array.from(set) });
  }

  const filteredEligibleIds = filtered.filter((p) => p.eligible).map((p) => p.id);
  const allFilteredEligibleSelected = filteredEligibleIds.length > 0 && filteredEligibleIds.every((id) => draft.productIds.includes(id));

  function toggleExpanded(id: string) {
    setExpanded((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  }
  function toggle(id: string, eligible: boolean) {
    if (!eligible) return;
    const set = new Set(draft.productIds);
    if (set.has(id)) set.delete(id); else set.add(id);
    onChange({ productIds: Array.from(set) });
  }

  const recommendedGrouping = recommendGroupingMode(selectedProducts, draft.dailyBudget);

  return (
    <div>
      <StepHeading
        eyebrow="Step 1 of 5"
        title="Choose products to promote"
        subtitle="Only products that can be advertised are selectable. Tick the ones you want and they'll collect in the list underneath."
      />

      <div role="radiogroup" aria-label="How to split products" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, marginBottom: 28 }}>
        {([
          { id: 'split-by-campaign' as GroupingMode, title: 'Split by campaign', desc: 'Applicable when budget is sufficient. After selecting, campaigns will be created to promote your ASINs, each Parent ASIN owns individual campaign.' },
          { id: 'split-by-ad-group' as GroupingMode, title: 'Split by ad group', desc: 'Applicable when budget is limited. When selecting, ad groups will be created to promote your ASINs, multiple Parent ASINs will be included in the campaigns.' },
        ]).map((opt) => {
          const on = draft.groupingMode === opt.id;
          return (
            <div
              key={opt.id} role="radio" aria-checked={on} tabIndex={0} className="cc-pick"
              onClick={() => onChange({ groupingMode: opt.id })}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange({ groupingMode: opt.id }); } }}
              style={{ display: 'flex', gap: 12, padding: '14px 16px', borderRadius: 10, cursor: 'pointer', border: `1.5px solid ${on ? BRAND : BORDER}`, background: on ? BRAND_TINT : '#fff' }}
            >
              <span style={{ marginTop: 1 }}><Radio checked={on} /></span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ font: `600 13.5px/1.3 ${FONT}`, color: TEXT_PRIMARY }}>{opt.title}</span>
                  {selectedProducts.length > 1 && recommendedGrouping === opt.id && <RecommendedTag />}
                </div>
                <div style={{ font: `400 12.5px/1.5 ${FONT}`, color: TEXT_MUTED, marginTop: 3 }}>{opt.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      {!noEligibleAtAll && groups.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
            <span style={{ font: `500 12px/1 ${FONT}`, color: TEXT_MUTED }}>Product groups</span>
            {filteredEligibleIds.length > 0 && (
              <TextButton onClick={() => toggleGroup(filteredEligibleIds)}>
                {allFilteredEligibleSelected ? 'Deselect all eligible' : 'Select all eligible'}
              </TextButton>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {groups.map((g) => {
              const on = g.eligibleIds.every((id) => draft.productIds.includes(id));
              return (
                <button
                  key={g.id} type="button" className="cc-btn cc-pick" aria-pressed={on} onClick={() => toggleGroup(g.eligibleIds)}
                  title={on ? 'Remove this group from the selection' : 'Select every eligible product in this group'}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 12px', borderRadius: 999, cursor: 'pointer',
                    border: `1.5px solid ${on ? BRAND : BORDER}`, background: on ? BRAND_TINT : '#fff', color: on ? BRAND : TEXT_PRIMARY, font: `500 12.5px/1.2 ${FONT}`,
                  }}
                >
                  {g.label}
                  <span className="cc-num" style={{ font: `500 11.5px/1 ${FONT}`, color: on ? BRAND : TEXT_FAINT }}>{g.eligibleIds.length}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', flex: '1 1 auto', minWidth: 0 }}>
          <label style={{ position: 'relative', display: 'block', flex: '0 1 250px', minWidth: 200 }}>
            <span style={{ position: 'absolute', left: 12, top: 0, bottom: 0, display: 'flex', alignItems: 'center' }}><SearchIcon /></span>
            <input
              className="cc-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, ASIN or SKU"
              aria-label="Search products"
              style={{ width: '100%', padding: '9px 12px 9px 34px', border: `1px solid ${BORDER}`, borderRadius: 8, font: `400 13px/1.2 ${FONT}`, color: TEXT_PRIMARY, outline: 'none', background: '#fff' }}
            />
          </label>
          <FilterSelect label="Status" value={statusFilter} options={STATUS_OPTIONS} onChange={setStatusFilter} />
          <FilterSelect label="Inventory" value={inventoryFilter} options={INVENTORY_OPTIONS} onChange={setInventoryFilter} />
          <FilterSelect label="Campaign" value={campaignFilter} options={CAMPAIGN_OPTIONS} onChange={setCampaignFilter} />
          {hasActiveFilters && <TextButton onClick={clearFilters}>Clear filters</TextButton>}
        </div>
        <span className="cc-num" style={{ font: `400 13px/1 ${FONT}`, color: TEXT_MUTED, whiteSpace: 'nowrap' }}>
          {filtered.length} products · <b style={{ fontWeight: 600, color: TEXT_PRIMARY }}>{selectedProducts.length}</b> selected
        </span>
      </div>

      <div className="cc-scroll" style={{ maxHeight: 440, overflow: 'auto', border: `1px solid ${BORDER}`, borderRadius: 10 }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, font: `400 13px/1.4 ${FONT}` }}>
          <thead>
            <tr style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <th style={{ ...TH, width: 44 }} />
              <th style={TH}>Product</th>
              <th style={TH}>ASIN / SKU</th>
              <th style={TH}>Status</th>
              <th style={{ ...TH, textAlign: 'right' }}>Inventory</th>
              <th style={{ ...TH, textAlign: 'right' }}>Sales</th>
              <th style={{ ...TH, textAlign: 'right' }}>Ad spend</th>
              <th style={{ ...TH, textAlign: 'right' }}>Ad sales</th>
              <th style={{ ...TH, textAlign: 'right' }}>ACOS</th>
            </tr>
          </thead>
          <tbody>
            {!noEligibleAtAll && filtered.map((p) => {
              const checked = draft.productIds.includes(p.id);
              const kids = p.children ?? [];
              const isOpen = kids.length > 0 && expanded.has(p.id);
              return (
                <Fragment key={p.id}>
                  <tr className="cc-row" onClick={() => toggle(p.id, p.eligible)} style={{ cursor: p.eligible ? 'pointer' : 'not-allowed', background: checked ? BRAND_TINT : undefined, opacity: p.eligible ? 1 : 0.6 }}>
                    <td style={TD}><RowCheck checked={checked} disabled={!p.eligible} label={`Select ${p.title}`} onToggle={() => toggle(p.id, p.eligible)} /></td>
                    <td style={{ ...TD, minWidth: 250 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {kids.length > 0 ? (
                          <button
                            type="button" aria-expanded={isOpen} aria-label={isOpen ? 'Hide variations' : 'Show variations'}
                            onClick={(e) => { e.stopPropagation(); toggleExpanded(p.id); }}
                            style={{ width: 22, height: 22, padding: 0, border: 'none', background: 'none', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 140ms ease-out' }}
                          ><ChevronRightIcon size={12} color={TEXT_MUTED} /></button>
                        ) : <span style={{ width: 22, flex: 'none' }} />}
                        <ProductCell p={p} marker={p.hasExistingCampaign ? 'Existing campaign' : undefined} />
                      </div>
                    </td>
                    <AsinCell asin={p.asin} sku={p.sku} />
                    <td style={TD}><Status eligible={p.eligible} reason={p.ineligibleReason} /></td>
                    <td className="cc-num" style={{ ...NUM, textAlign: 'right', color: p.inventory === 0 ? BAD : p.inventory < LOW_STOCK_BELOW ? WARN : TEXT_MUTED }}>{p.inventory.toLocaleString()}</td>
                    <td className="cc-num" style={{ ...NUM, textAlign: 'right' }}>{formatCurrency(p.sales)}</td>
                    <td className="cc-num" style={{ ...NUM, textAlign: 'right' }}>{formatCurrency(p.adSpend)}</td>
                    <td className="cc-num" style={{ ...NUM, textAlign: 'right' }}>{formatCurrency(p.adSales)}</td>
                    <td className="cc-num" style={{ ...NUM, textAlign: 'right', color: p.acos > 28 ? WARN : TEXT_MUTED }}>{p.acos > 0 ? `${p.acos.toFixed(1)}%` : '—'}</td>
                  </tr>
                  {isOpen && kids.map((k) => {
                    const kChecked = draft.productIds.includes(k.id);
                    return (
                      <tr key={k.id} className="cc-row" onClick={() => toggle(k.id, p.eligible)} style={{ cursor: 'pointer', background: kChecked ? BRAND_TINT : SURFACE_MUTED }}>
                        <td style={TD}><RowCheck checked={kChecked} label={`Select ${k.title}`} onToggle={() => toggle(k.id, p.eligible)} /></td>
                        <td style={{ ...TD, paddingLeft: 52, position: 'relative' }}>
                          <span aria-hidden style={{ position: 'absolute', left: 28, top: 0, bottom: '50%', width: 14, borderLeft: `1.5px solid ${BORDER}`, borderBottom: `1.5px solid ${BORDER}`, borderBottomLeftRadius: 6 }} />
                          <ProductCell p={{ title: k.title, thumbnailColor: p.thumbnailColor, brand: p.brand, category: p.category, parentTitle: undefined }} indent subtitle="Variation" />
                        </td>
                        <AsinCell asin={k.asin} sku={k.sku} />
                        <td style={TD}><Status eligible /></td>
                        <td className="cc-num" style={{ ...NUM, textAlign: 'right', color: k.inventory < LOW_STOCK_BELOW ? WARN : TEXT_MUTED }}>{k.inventory.toLocaleString()}</td>
                        <td className="cc-num" style={{ ...NUM, textAlign: 'right' }}>{formatCurrency(Math.round(k.adSales * 3.1))}</td>
                        <td className="cc-num" style={{ ...NUM, textAlign: 'right' }}>{formatCurrency(k.adSpend)}</td>
                        <td className="cc-num" style={{ ...NUM, textAlign: 'right' }}>{formatCurrency(k.adSales)}</td>
                        <td className="cc-num" style={{ ...NUM, textAlign: 'right', color: k.acos > 28 ? WARN : TEXT_MUTED }}>{k.acos.toFixed(1)}%</td>
                      </tr>
                    );
                  })}
                </Fragment>
              );
            })}
            {noEligibleAtAll && (
              <tr>
                <td colSpan={9} style={{ padding: '44px 14px', textAlign: 'center' }}>
                  <div style={{ font: `600 14px/1.4 ${FONT}`, color: TEXT_PRIMARY }}>No eligible products found</div>
                  <div style={{ margin: '4px auto 0', maxWidth: 380, font: `400 13px/1.55 ${FONT}`, color: TEXT_MUTED }}>
                    There are currently no products available for Sponsored Products campaign creation.
                  </div>
                </td>
              </tr>
            )}
            {!noEligibleAtAll && filtered.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: '40px 14px', textAlign: 'center' }}>
                  <div style={{ font: `400 13px/1.5 ${FONT}`, color: TEXT_MUTED }}>
                    {search.trim() ? `No products match “${search.trim()}” with these filters.` : 'No products match these filters.'}
                  </div>
                  {hasActiveFilters && <div style={{ marginTop: 8 }}><TextButton onClick={clearFilters}>Clear filters</TextButton></div>}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <section style={{ marginTop: 36 }}>
        <SectionTitle aside={selectedProducts.length > 0 ? <TextButton onClick={() => onChange({ productIds: [] })}>Clear all</TextButton> : undefined}>
          Selected products <span style={{ color: TEXT_FAINT, fontWeight: 500 }}>({selectedProducts.length})</span>
        </SectionTitle>

        {selectedProducts.length === 0 ? (
          <div style={{ padding: '28px 16px', border: `1px dashed ${BORDER}`, borderRadius: 10, textAlign: 'center', font: `400 13px/1.5 ${FONT}`, color: TEXT_MUTED }}>
            Nothing selected yet. Tick a product above to add it here.
          </div>
        ) : (
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', font: `400 13px/1.4 ${FONT}` }}>
              <thead>
                <tr>
                  <th style={TH}>Product</th>
                  <th style={TH}>ASIN / SKU</th>
                  <th style={{ ...TH, textAlign: 'right' }}>Inventory</th>
                  <th style={{ ...TH, textAlign: 'right' }}>Ad spend</th>
                  <th style={{ ...TH, textAlign: 'right' }}>ACOS</th>
                  <th style={{ ...TH, width: 80 }} />
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((p) => (
                  <tr key={p.id} className="cc-row">
                    <td style={{ ...TD, minWidth: 250 }}><ProductCell p={p} wide /></td>
                    <AsinCell asin={p.asin} sku={p.sku} />
                    <td className="cc-num" style={{ ...NUM, textAlign: 'right' }}>{p.inventory.toLocaleString()}</td>
                    <td className="cc-num" style={{ ...NUM, textAlign: 'right' }}>{formatCurrency(p.adSpend)}</td>
                    <td className="cc-num" style={{ ...NUM, textAlign: 'right', color: p.acos > 28 ? WARN : TEXT_MUTED }}>{p.acos > 0 ? `${p.acos.toFixed(1)}%` : '—'}</td>
                    <td style={{ ...TD, textAlign: 'right' }}><TextButton tone={BAD} onClick={() => toggle(p.id, true)}>Remove</TextButton></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
