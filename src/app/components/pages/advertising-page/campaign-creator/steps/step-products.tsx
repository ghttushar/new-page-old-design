import { Fragment, useMemo, useState } from 'react';
import { recommendGroupingMode, formatCurrency, type CcDraft, type CcProduct, type GroupingMode } from '../campaign-creator.types';
import {
  BAD, BORDER, CheckIcon, ChevronRightIcon, ChoiceCard, GOOD, Pill, RecommendedBadge, SectionCard, StepHeading,
  TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY, WARN,
} from '../campaign-creator-ui';

const TH: React.CSSProperties = {
  textAlign: 'left', padding: '10px 12px', font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.05em',
  textTransform: 'uppercase', color: TEXT_FAINT, borderBottom: `1px solid ${BORDER}`, background: '#fafbfd', whiteSpace: 'nowrap',
};
const TD: React.CSSProperties = { padding: '10px 12px', borderBottom: '1px solid #f1f2f4' };

function CardTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ font: '700 13px/1 Inter,sans-serif', color: TEXT_PRIMARY }}>{children}</div>
      {action}
    </div>
  );
}

function ProductCell({ p }: { p: CcProduct }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <span style={{ width: 28, height: 28, borderRadius: 6, background: p.thumbnailColor, flex: 'none' }} />
      <div style={{ minWidth: 0 }}>
        <div style={{ font: '600 12px/1.4 Inter,sans-serif', color: TEXT_PRIMARY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 210 }}>{p.title}</div>
        <div style={{ font: '400 10.5px/1.4 Inter,sans-serif', color: TEXT_FAINT }}>{p.parentTitle ? `Child of ${p.parentTitle}` : `${p.brand} · ${p.category}`}{p.children?.length ? ` · Parent of ${p.children.length} child products` : ''}</div>
      </div>
    </div>
  );
}

export default function StepProducts({ draft, products, selectedProducts, onChange }: {
  draft: CcDraft; products: CcProduct[]; selectedProducts: CcProduct[]; onChange: (patch: Partial<CcDraft>) => void;
}) {
  const [search, setSearch] = useState('');
  // Parents with child products start expanded.
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(products.filter((p) => p.children?.length).map((p) => p.id)));
  function toggleExpanded(id: string) {
    setExpanded((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? products.filter((p) => `${p.title} ${p.asin} ${p.sku}`.toLowerCase().includes(q)) : products;
  }, [products, search]);

  function toggle(id: string, eligible: boolean) {
    if (!eligible) return;
    const set = new Set(draft.productIds);
    if (set.has(id)) set.delete(id); else set.add(id);
    onChange({ productIds: Array.from(set) });
  }

  const recommendedGrouping = recommendGroupingMode(selectedProducts, draft.dailyBudget);

  return (
    <div>
      <StepHeading title="Select promoted products" subtitle="Only products eligible for advertising can be selected. Search the catalog, then review your picks below." />

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, ASIN or SKU…"
        style={{ width: '100%', maxWidth: 360, padding: '9px 12px', border: `1px solid ${BORDER}`, borderRadius: 8, font: '400 12.5px/1 Inter,sans-serif', outline: 'none', marginBottom: 14, boxSizing: 'border-box' }}
      />

      <SectionCard style={{ padding: 0, overflow: 'hidden' }}>
        <CardTitle>All products ({filtered.length})</CardTitle>
        <div style={{ maxHeight: 340, overflowY: 'auto', overflowX: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', font: '400 12px/1.4 Inter,sans-serif' }}>
            <thead>
              <tr style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                {['', 'Product', 'ASIN', 'Status', 'Inventory', 'Ad Spend', 'Ad Sales', 'ACOS'].map((h, i) => <th key={i} style={TH}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const checked = draft.productIds.includes(p.id);
                const kids = p.children ?? [];
                const isOpen = kids.length > 0 && expanded.has(p.id);
                return (
                  <Fragment key={p.id}>
                  <tr onClick={() => toggle(p.id, p.eligible)} style={{ cursor: p.eligible ? 'pointer' : 'not-allowed', background: checked ? '#f6f2fb' : '#fff', opacity: p.eligible ? 1 : 0.55 }}>
                    <td style={TD}>
                      <span style={{ width: 17, height: 17, borderRadius: 5, border: `1.5px solid ${checked ? '#77469b' : '#cfd4dc'}`, background: checked ? '#77469b' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {checked && <CheckIcon size={10} />}
                      </span>
                    </td>
                    <td style={{ ...TD, minWidth: 220 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {kids.length > 0 ? (
                          <span onClick={(e) => { e.stopPropagation(); toggleExpanded(p.id); }} title={isOpen ? 'Hide child products' : 'Show child products'} style={{ width: 20, height: 20, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 140ms ease-out' }}><ChevronRightIcon size={12} color={TEXT_MUTED} /></span>
                        ) : <span style={{ width: 20, flex: 'none' }} />}
                        <ProductCell p={p} />
                      </div>
                    </td>
                    <td style={{ ...TD, color: TEXT_MUTED, whiteSpace: 'nowrap' }}>{p.asin}</td>
                    <td style={TD}>
                      {p.eligible ? <Pill label="Eligible" color={GOOD} bg="#e9f7ef" /> : <Pill label="Ineligible" color={BAD} bg="#fdecec" />}
                      {!p.eligible && <div style={{ font: '400 10.5px/1.4 Inter,sans-serif', color: TEXT_FAINT, marginTop: 3 }}>{p.ineligibleReason}</div>}
                    </td>
                    <td style={{ ...TD, color: TEXT_MUTED }}>{p.inventory.toLocaleString()}</td>
                    <td style={{ ...TD, color: TEXT_MUTED }}>{formatCurrency(p.adSpend)}</td>
                    <td style={{ ...TD, color: TEXT_MUTED }}>{formatCurrency(p.adSales)}</td>
                    <td style={{ ...TD, color: p.acos > 28 ? WARN : TEXT_MUTED }}>{p.acos > 0 ? `${p.acos.toFixed(1)}%` : '—'}</td>
                  </tr>
                  {isOpen && kids.map((k, i) => {
                    const kChecked = draft.productIds.includes(k.id);
                    return (
                    <tr key={k.id} onClick={() => toggle(k.id, p.eligible)} style={{ background: kChecked ? '#f6f2fb' : '#fcfcfe', cursor: 'pointer' }}>
                      <td style={TD}>
                        <span style={{ width: 17, height: 17, borderRadius: 5, border: `1.5px solid ${kChecked ? '#77469b' : '#cfd4dc'}`, background: kChecked ? '#77469b' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {kChecked && <CheckIcon size={10} />}
                        </span>
                      </td>
                      <td style={{ ...TD, paddingLeft: 30 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <span style={{ width: 14, height: 14, borderLeft: `1.5px solid ${BORDER}`, borderBottom: `1.5px solid ${BORDER}`, borderBottomLeftRadius: 5, marginTop: -8, flex: 'none', opacity: i === kids.length - 1 ? 1 : 0.7 }} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                              <span style={{ font: '500 12px/1.4 Inter,sans-serif', color: TEXT_PRIMARY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 190 }}>{k.title}</span>
                              <Pill label="Child" />
                            </div>
                            <div style={{ font: '400 10.5px/1.4 Inter,sans-serif', color: TEXT_FAINT }}>{k.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ ...TD, color: TEXT_MUTED, whiteSpace: 'nowrap' }}>{k.asin}</td>
                      <td style={TD}><Pill label="Eligible" color={GOOD} bg="#e9f7ef" /></td>
                      <td style={{ ...TD, color: TEXT_MUTED }}>{k.inventory.toLocaleString()}</td>
                      <td style={{ ...TD, color: TEXT_MUTED }}>{formatCurrency(k.adSpend)}</td>
                      <td style={{ ...TD, color: TEXT_MUTED }}>{formatCurrency(k.adSales)}</td>
                      <td style={{ ...TD, color: k.acos > 28 ? WARN : TEXT_MUTED }}>{k.acos.toFixed(1)}%</td>
                    </tr>
                    );
                  })}
                  </Fragment>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding: '30px 12px', textAlign: 'center', color: TEXT_FAINT }}>No products match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard style={{ padding: 0, overflow: 'hidden', marginTop: 18 }}>
        <CardTitle action={selectedProducts.length > 0 ? <span onClick={() => onChange({ productIds: [] })} style={{ font: '600 11.5px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>Clear all</span> : undefined}>
          Selected products ({selectedProducts.length})
        </CardTitle>
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', font: '400 12px/1.4 Inter,sans-serif' }}>
            <thead>
              <tr>{['Product', 'ASIN', 'Inventory', 'Ad Spend', 'ACOS', ''].map((h, i) => <th key={i} style={TH}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {selectedProducts.map((p) => (
                <tr key={p.id}>
                  <td style={{ ...TD, minWidth: 220 }}><ProductCell p={p} /></td>
                  <td style={{ ...TD, color: TEXT_MUTED, whiteSpace: 'nowrap' }}>{p.asin}</td>
                  <td style={{ ...TD, color: TEXT_MUTED }}>{p.inventory.toLocaleString()}</td>
                  <td style={{ ...TD, color: TEXT_MUTED }}>{formatCurrency(p.adSpend)}</td>
                  <td style={{ ...TD, color: p.acos > 28 ? WARN : TEXT_MUTED }}>{p.acos > 0 ? `${p.acos.toFixed(1)}%` : '—'}</td>
                  <td style={{ ...TD, textAlign: 'right' }}>
                    <span onClick={() => toggle(p.id, true)} style={{ font: '600 11.5px/1 Inter,sans-serif', color: BAD, cursor: 'pointer' }}>Remove</span>
                  </td>
                </tr>
              ))}
              {selectedProducts.length === 0 && (
                <tr><td colSpan={6} style={{ padding: '26px 12px', textAlign: 'center', color: TEXT_FAINT }}>No products selected yet — tick products in the table above.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {selectedProducts.length > 1 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.07em', textTransform: 'uppercase', color: TEXT_FAINT, marginBottom: 10 }}>How should these campaigns be grouped?</div>
          <div style={{ display: 'flex', gap: 12 }}>
            {([
              { id: 'split-by-campaign' as GroupingMode, title: 'Split by Campaign', desc: 'Each selected product gets its own, independent campaign structure.' },
              { id: 'split-by-ad-group' as GroupingMode, title: 'Split by Ad Group', desc: 'All selected products are grouped under the same campaign, one ad group per product.' },
            ]).map((opt) => (
              <ChoiceCard key={opt.id} selected={draft.groupingMode === opt.id} onClick={() => onChange({ groupingMode: opt.id })} minWidth={260}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ font: '700 13px/1.3 Inter,sans-serif', color: TEXT_PRIMARY }}>{opt.title}</div>
                  {recommendedGrouping === opt.id && <RecommendedBadge />}
                </div>
                <div style={{ font: '400 11.5px/1.5 Inter,sans-serif', color: TEXT_MUTED, marginTop: 5 }}>{opt.desc}</div>
              </ChoiceCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
