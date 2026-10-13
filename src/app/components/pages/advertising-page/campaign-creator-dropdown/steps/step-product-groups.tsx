import { useState } from 'react';
import type { CcDraft, CcProduct, ProductGroup } from '../campaign-creator.types';
import { Checkbox } from '../campaign-creator-ui';
import { pickSettings } from '../product-groups';

// Product groups: make groups out of the products already added. Each group then gets its own
// keywords, objectives, targeting and structure on the steps that follow.

interface Editing { id: string | null; name: string; ids: string[] }

let counter = 0;
const newId = () => `grp-${Date.now().toString(36)}-${counter++}`;
const plural = (n: number, one: string) => `${n} ${n === 1 ? one : `${one}s`}`;

export default function ProductGroupsPanel({ draft, selectedProducts, onChange }: {
  draft: CcDraft; selectedProducts: CcProduct[]; onChange: (patch: Partial<CcDraft>) => void;
}) {
  const groups = draft.productGroups;
  const [editing, setEditing] = useState<Editing | null>(null);
  const [error, setError] = useState<string | null>(null);

  const groupOf = (productId: string) => groups.find((g) => g.productIds.includes(productId));
  const open = (next: Editing) => { setEditing(next); setError(null); };
  const close = () => { setEditing(null); setError(null); };

  const toggle = (id: string) => setEditing((e) => (e ? { ...e, ids: e.ids.includes(id) ? e.ids.filter((x) => x !== id) : [...e.ids, id] } : e));

  function save() {
    if (!editing) return;
    const name = editing.name.trim();
    if (!name) return setError('Give the group a name.');
    if (groups.some((g) => g.id !== editing.id && g.name.toLowerCase() === name.toLowerCase())) return setError('Another group already has that name.');
    if (editing.ids.length === 0) return setError('Choose at least one product.');

    // A product belongs to one group, so choosing it here takes it out of any other group.
    const others = groups
      .filter((g) => g.id !== editing.id)
      .map((g) => ({ ...g, productIds: g.productIds.filter((id) => !editing.ids.includes(id)) }))
      .filter((g) => g.productIds.length > 0);

    let next: ProductGroup[];
    if (editing.id) {
      const current = groups.find((g) => g.id === editing.id);
      next = [...others, { ...(current as ProductGroup), name, productIds: editing.ids }];
      // keep the original order
      next.sort((a, b) => groups.findIndex((g) => g.id === a.id) - groups.findIndex((g) => g.id === b.id));
    } else {
      next = [...others, { id: newId(), name, productIds: editing.ids, settings: pickSettings(draft) }];
    }
    onChange({ productGroups: next });
    close();
  }

  const remove = (id: string) => onChange({ productGroups: groups.filter((g) => g.id !== id) });

  return (
    <div className="ccd-pg">
      <div className="ccd-pg-head">
        <div>
          <h2>Product groups</h2>
          <p>Group products to give each group its own keywords, objectives, targeting and structure. Products in no group use the defaults.</p>
        </div>
        <button type="button" className="ccd-pg-btn ccd-pg-btn--primary" disabled={selectedProducts.length === 0 || editing !== null} onClick={() => open({ id: null, name: '', ids: [] })}>
          New group
        </button>
      </div>

      {editing && (
        <div className="ccd-pg-form">
          <label className="ccd-pg-field">
            <span>Group name</span>
            <input className="ccd-input" value={editing.name} placeholder="For example, Protein powders" maxLength={60} autoFocus onChange={(e) => { setEditing({ ...editing, name: e.target.value }); setError(null); }} />
          </label>
          <div className="ccd-pg-field">
            <span>Products in this group <b className="ccd-num">{editing.ids.length}</b></span>
            <div className="ccd-pg-list ccd-scroll" role="group" aria-label="Products in this group">
              {selectedProducts.map((p) => {
                const on = editing.ids.includes(p.id);
                const other = groupOf(p.id);
                const elsewhere = other && other.id !== editing.id ? other : null;
                return (
                  <button key={p.id} type="button" role="checkbox" aria-checked={on} className={`ccd-pg-item${on ? ' is-on' : ''}`} onClick={() => toggle(p.id)}>
                    <Checkbox checked={on} size={16} />
                    <span className="ccd-pg-item-name" title={p.title}>{p.title}</span>
                    <span className="ccd-pg-item-asin">{p.asin}</span>
                    {elsewhere && <span className="ccd-pg-item-tag">{on ? `Moves from ${elsewhere.name}` : `In ${elsewhere.name}`}</span>}
                  </button>
                );
              })}
            </div>
          </div>
          {error && <div role="alert" className="ccd-pg-error">{error}</div>}
          <div className="ccd-pg-actions">
            <button type="button" className="ccd-pg-btn" onClick={close}>Cancel</button>
            <button type="button" className="ccd-pg-btn ccd-pg-btn--primary" onClick={save}>{editing.id ? 'Save group' : 'Create group'}</button>
          </div>
        </div>
      )}

      {groups.length === 0 && !editing && (
        <div className="ccd-pg-empty">
          {selectedProducts.length === 0 ? 'Add products first, then group them here.' : 'No groups yet. Every product will share one set of settings.'}
        </div>
      )}

      {groups.length > 0 && (
        <ul className="ccd-pg-groups">
          {groups.map((g) => {
            const products = selectedProducts.filter((p) => g.productIds.includes(p.id));
            return (
              <li key={g.id} className="ccd-pg-group">
                <div className="ccd-pg-group-main">
                  <strong>{g.name}</strong>
                  <span>{plural(products.length, 'product')}</span>
                </div>
                <div className="ccd-pg-chips">
                  {products.slice(0, 4).map((p) => <span key={p.id} className="ccd-pg-chip" title={p.title}>{p.title}</span>)}
                  {products.length > 4 && <span className="ccd-pg-chip ccd-pg-chip--more">+{products.length - 4}</span>}
                </div>
                <div className="ccd-pg-group-actions">
                  <button type="button" className="ccd-pg-link" disabled={editing !== null} onClick={() => open({ id: g.id, name: g.name, ids: g.productIds })}>Edit</button>
                  <button type="button" className="ccd-pg-link ccd-pg-link--danger" disabled={editing !== null} onClick={() => remove(g.id)}>Delete</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
