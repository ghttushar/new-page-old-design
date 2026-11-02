import { CheckIcon } from '@phosphor-icons/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// The recommended groups, opened from the button beside All Products: a menu of suggestions, each row a group with a
// glimpse of its products. Clicking a row adds its products and groups them under that name.

export interface Recommendation {
  name: string;
  ids: string[];
  /** The products' titles, for the line under the name. */
  names: string[];
  /** The products' thumbnail colours, for the little stack at the start of the row. */
  colors: string[];
  applied: boolean;
}

const WIDTH = 420;

export default function RecommendedGroups({ anchor, items, onApply, onClose }: {
  anchor: DOMRect; items: Recommendation[]; onApply: (r: Recommendation) => void; onClose: () => void;
}) {
  const [box, setBox] = useState({ top: 0, left: 0 });
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const height = rootRef.current?.offsetHeight ?? 320;
    const below = anchor.bottom + 6 + height <= window.innerHeight;
    setBox({
      top: below ? anchor.bottom + 6 : Math.max(8, anchor.top - 6 - height),
      left: Math.max(8, Math.min(anchor.right - WIDTH, window.innerWidth - WIDTH - 8)),
    });
  }, [anchor]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (!rootRef.current?.contains(e.target as Node)) onClose(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onClose);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); window.removeEventListener('resize', onClose); };
  }, [onClose]);

  const left = items.filter((r) => !r.applied).length;

  return createPortal(
    <div ref={rootRef} className="ccd-gm ccd-rg" style={{ top: box.top, left: box.left, width: WIDTH }} role="menu" aria-label="Recommended groups">
      <div className="ccd-rg-head">
        <strong>Recommended groups</strong>
        <span>Click one to add its products as a group</span>
      </div>
      {items.length === 0 ? (
        <div className="ccd-gp-empty">No suggestions for these products.</div>
      ) : (
        <div className="ccd-rg-list">
          {items.map((r) => (
            <button
              key={r.name} type="button" role="menuitem" className="ccd-rg-item" disabled={r.applied} aria-disabled={r.applied}
              onClick={() => onApply(r)} title={r.names.join(', ')}
            >
              <span className="ccd-rg-swatches" aria-hidden>
                {r.colors.slice(0, 3).map((c, i) => <i key={i} style={{ background: c }} />)}
              </span>
              <span className="ccd-rg-copy">
                <span className="ccd-rg-name">{r.name}</span>
                <span className="ccd-rg-sub">
                  {r.names.slice(0, 2).join(', ')}{r.names.length > 2 ? ` and ${(r.names.length - 2).toLocaleString()} more` : ''}
                </span>
              </span>
              <span className="ccd-rg-meta ccd-num">
                {r.applied
                  ? <><CheckIcon size={12} weight="bold" />Added</>
                  : `${r.ids.length.toLocaleString()} ${r.ids.length === 1 ? 'product' : 'products'}`}
              </span>
            </button>
          ))}
        </div>
      )}
      <div className="ccd-gp-foot">
        <span>{left === 0 ? 'Every suggestion is added' : `${left.toLocaleString()} of ${items.length.toLocaleString()} left to add`}</span>
      </div>
    </div>,
    document.body,
  );
}
