import { useId } from 'react';
import type { Scope } from './product-groups';

/** The group dropdown shown above each step once the products have been grouped. */
export default function ScopeBar({ scopes, activeId, pending, onChange }: { scopes: Scope[]; activeId: string; pending: Set<string>; onChange: (id: string) => void }) {
  const uid = useId();
  const active = scopes.find((s) => s.id === activeId) ?? scopes[0];
  return (
    <div className="ccd-scope">
      <label className="ccd-scope-label" htmlFor={`${uid}-scope`}>Setting up</label>
      <select id={`${uid}-scope`} className="ccd-scope-select ccd-input" value={active.id} onChange={(e) => onChange(e.target.value)}>
        {scopes.map((s) => (
          <option key={s.id} value={s.id}>{s.name} ({s.products.length} {s.products.length === 1 ? 'product' : 'products'}){pending.has(s.id) ? ' · needs a choice' : ''}</option>
        ))}
      </select>
      <span className="ccd-scope-hint">What you choose on this page applies to {active.name.toLowerCase() === 'ungrouped products' ? 'the ungrouped products' : `the group “${active.name}”`} only. Pick another group to set it up separately.</span>
    </div>
  );
}
