import { useMemo, useState } from 'react';
import Dropdown from '@/app/components/common/dropdown/dropdown';
import { MOCK_BRAND_OPTIONS, MOCK_CATEGORY_OPTIONS } from '@/constants/advertising/mock-campaign-creator-data';
import { CcChoiceCards, CcPill, CcSection, CcTextInput } from '../campaign-creator-shared-ui';
import { HierarchyIcon, LayersIcon } from '../campaign-creator-icons';
import { CcDraft, CcGrouping, productsFor, structureCounts } from '../campaign-creator.types';
import styles from '../campaign-creator.module.scss';

const PAGE_SIZE = 8;

export function StepProducts({ draft, update, showErrors }: { draft: CcDraft; update: (patch: Partial<CcDraft>) => void; showErrors: boolean }) {
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState(MOCK_BRAND_OPTIONS[0]);
  const [category, setCategory] = useState(MOCK_CATEGORY_OPTIONS[0]);
  const [page, setPage] = useState(0);

  const catalog = productsFor(draft.marketplace);
  const noun = draft.marketplace === 'walmart' ? 'items' : 'products';

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return catalog.filter((p) => {
      if (q && !(p.name.toLowerCase().includes(q) || p.asin.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))) return false;
      if (brand.value !== 'all' && p.brand !== brand.value) return false;
      if (category.value !== 'all' && p.category !== category.value) return false;
      return true;
    });
  }, [catalog, search, brand, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const eligibleFilteredIds = filtered.filter((p) => p.eligible).map((p) => p.id);
  const allFilteredSelected = eligibleFilteredIds.length > 0 && eligibleFilteredIds.every((id) => draft.selectedProductIds.includes(id));
  const visibleEligibleIds = pageRows.filter((p) => p.eligible).map((p) => p.id);

  function toggle(id: string) {
    const has = draft.selectedProductIds.includes(id);
    update({ selectedProductIds: has ? draft.selectedProductIds.filter((x) => x !== id) : [...draft.selectedProductIds, id] });
  }

  function selectAll() {
    update({ selectedProductIds: Array.from(new Set([...draft.selectedProductIds, ...eligibleFilteredIds])) });
  }

  function selectVisible() {
    update({ selectedProductIds: Array.from(new Set([...draft.selectedProductIds, ...visibleEligibleIds])) });
  }

  function clearSelection() {
    update({ selectedProductIds: [] });
  }

  const products = catalog.filter((p) => draft.selectedProductIds.includes(p.id));
  const recommendedGrouping: CcGrouping = products.length > 6 ? 'group' : 'separate';

  return (
    <>
      <CcSection
        title={`Select ${noun} to promote`}
        description={`Only in-stock, ad-eligible ${noun} can be added to this campaign. We'll use product performance, availability and advertising data to build recommendations.`}
        trailing={<CcPill tone="purple">{draft.selectedProductIds.length} selected</CcPill>}
      >
        <div className={styles.productFilterRow}>
          <CcTextInput value={search} onChange={setSearch} placeholder={`Search ${noun} by name, ASIN or SKU...`} />
          <Dropdown options={MOCK_BRAND_OPTIONS} selected={brand} onSelect={setBrand} width="16rem" height="3.6rem" label="" />
          <Dropdown options={MOCK_CATEGORY_OPTIONS} selected={category} onSelect={setCategory} width="18rem" height="3.6rem" label="" />
        </div>

        <div className={styles.selectionToolbar}>
          <button type="button" className={styles.toolbarLink} onClick={selectAll}>Select all</button>
          <button type="button" className={styles.toolbarLink} onClick={selectVisible}>Select visible</button>
          <button type="button" className={styles.toolbarLink} onClick={clearSelection}>Clear selection</button>
          <span className={styles.toolbarSpacer} />
          <span className={styles.toolbarResultCount}>Showing {page * PAGE_SIZE + 1}–{Math.min(filtered.length, page * PAGE_SIZE + PAGE_SIZE)} of {filtered.length} {noun}</span>
        </div>

        <div className={styles.productTableHeader}>
          <label className={styles.productCheckboxCell}>
            <input type="checkbox" checked={allFilteredSelected} onChange={() => (allFilteredSelected ? clearSelection() : selectAll())} />
          </label>
          <span>{noun === 'items' ? 'Item' : 'Product'}</span>
          <span>ASIN / Item ID</span>
          <span>SKU</span>
          <span>Status</span>
          <span>Inventory</span>
          <span>Sales</span>
          <span>Ad Spend</span>
          <span>Ad Sales</span>
          <span>ACOS</span>
        </div>

        <div className={styles.productTableBody}>
          {pageRows.map((p) => (
            <label key={p.id} className={`${styles.productRow} ${!p.eligible ? styles.productRowDisabled : ''}`}>
              <span className={styles.productCheckboxCell}>
                <input type="checkbox" disabled={!p.eligible} checked={draft.selectedProductIds.includes(p.id)} onChange={() => toggle(p.id)} />
              </span>
              <span className={styles.productNameCell}>
                <span className={styles.productThumb} style={{ background: p.thumbnailColor }} />
                <span>
                  <div className={styles.productName}>{p.name}</div>
                  <div className={styles.productSku}>{p.brand}</div>
                </span>
              </span>
              <span className={styles.productSkuCell}>{p.asin}</span>
              <span className={styles.productSkuCell}>{p.sku}</span>
              <span>{p.eligible ? <CcPill tone="green">Eligible</CcPill> : <CcPill tone="red">{p.ineligibleReason ?? 'Ineligible'}</CcPill>}</span>
              <span>{p.inventory.toLocaleString()}</span>
              <span>${p.sales.toLocaleString()}</span>
              <span>${p.adSpend.toLocaleString()}</span>
              <span>${p.adSales.toLocaleString()}</span>
              <span>{p.eligible ? `${p.acos.toFixed(1)}%` : '—'}</span>
            </label>
          ))}
          {pageRows.length === 0 && <div className={styles.productEmpty}>No {noun} match your search.</div>}
        </div>

        <div className={styles.tablePagination}>
          <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>‹</button>
          <span>{page + 1} / {totalPages}</span>
          <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>›</button>
        </div>

        {showErrors && draft.selectedProductIds.length === 0 && (
          <div className={styles.inlineError}>Select at least one {noun.slice(0, -1)} to continue.</div>
        )}
      </CcSection>

      {draft.selectedProductIds.length > 1 && (
        <CcSection title="How should we organize these products?" description="Choose how campaigns will be created for the selected products.">
          <CcChoiceCards<CcGrouping>
            value={draft.grouping}
            onChange={(grouping) => update({ grouping })}
            options={[
              {
                value: 'separate',
                title: 'Separate by campaign',
                description: 'Each selected product gets its own campaign structure. Best for product-level budget and performance control.',
                icon: <LayersIcon size={20} />,
                recommended: recommendedGrouping === 'separate',
              },
              {
                value: 'group',
                title: 'Group by ad group',
                description: 'Products share campaigns, separated into ad groups. Best for fewer campaigns and simpler management.',
                icon: <HierarchyIcon size={20} />,
                recommended: recommendedGrouping === 'group',
              },
            ]}
          />
          <div className={styles.groupingImpact}>
            <span>{products.length} {noun} selected</span>
            <span>Estimated campaigns: {structureCounts(recommendedGrouping === 'separate' ? 'product-targeting' : 'targeting-type', { ...draft, targetingStrategies: ['automatic', 'exact', 'phrase'] }, products).campaigns}</span>
            <span>Estimated ad groups: {structureCounts(recommendedGrouping === 'separate' ? 'product-targeting' : 'targeting-type', { ...draft, targetingStrategies: ['automatic', 'exact', 'phrase'] }, products).adGroups}</span>
          </div>
        </CcSection>
      )}
    </>
  );
}
