import type { CcProduct, ProductGroup } from '../campaign-creator.types';

// Product groups, inside the Added Products table. Built for thousands of groups: nothing here lists them all.
// A cell shows one product's group and opens a searchable picker, which is also where a group is created. The group manager
// (its own panel) handles searching, renaming and deleting. Each group then gets its own keywords, objectives,
// targeting and structure on the steps that follow.

const Chevron = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M4 6.2l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Hint = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden><rect x="2" y="2.5" width="5" height="5" rx="1.3" stroke="currentColor" strokeWidth="1.4" /><rect x="9" y="2.5" width="5" height="5" rx="1.3" stroke="currentColor" strokeWidth="1.4" /><rect x="2" y="9.5" width="5" height="4" rx="1.3" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2 1.6" /><rect x="9" y="9.5" width="5" height="4" rx="1.3" stroke="currentColor" strokeWidth="1.4" /></svg>
);

/** The Group column of one row: the group it is in, opening the shared picker when pressed. */
export function GroupCell({ product, group, onOpen }: { product: CcProduct; group: ProductGroup | undefined; onOpen: (anchor: DOMRect, product: CcProduct) => void }) {
  return (
    <button
      type="button" className={`ccd-gc${group ? ' is-set' : ''}`} aria-haspopup="dialog"
      aria-label={group ? `Group of ${product.title}: ${group.name}. Change group` : `Add ${product.title} to a group`}
      onClick={(e) => onOpen(e.currentTarget.getBoundingClientRect(), product)}
    >
      {!group && <span className="ccd-gc-plus" aria-hidden>+</span>}
      <span className="ccd-gc-text">{group ? group.name : 'Add to group'}</span>
      <span className="ccd-gc-chev"><Chevron /></span>
    </button>
  );
}

/** One quiet line before the first group, explaining what groups are for. */
export function GroupHint({ products }: { products: number }) {
  if (products === 0) return null;
  return <p className="ccd-gh"><Hint />Use the Group column to put products in groups. Tick several rows first to group them together. Each group gets its own keywords, budget, targeting and structure.</p>;
}
