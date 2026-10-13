import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DEFAULT_NAMING, type CcCampaign, type CcProduct, type NamingSettings } from '../campaign-creator.types';
import { AD_GROUP_TOKENS, CAMPAIGN_TOKENS, TAG_PREFIX, TAG_SUFFIX, adGroupPreview, campaignPreview } from './naming';

// Naming settings: choose, order and preview the parts that make up campaign and ad group names.

interface Def { id: string; label: string }

const Grip = () => <svg width={10} height={14} viewBox="0 0 10 14" fill="currentColor" aria-hidden><circle cx="2.5" cy="2.5" r="1.3" /><circle cx="7.5" cy="2.5" r="1.3" /><circle cx="2.5" cy="7" r="1.3" /><circle cx="7.5" cy="7" r="1.3" /><circle cx="2.5" cy="11.5" r="1.3" /><circle cx="7.5" cy="11.5" r="1.3" /></svg>;

/** One row of name parts: drag to reorder, remove with the cross, add from the plus. */
function TokenRow({ tokens, defs, onChange, tagged, label }: {
  tokens: string[]; defs: Def[]; onChange: (next: string[]) => void; tagged?: boolean; label: string;
}) {
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const [menu, setMenu] = useState(false);
  const labelOf = (id: string) => defs.find((d) => d.id === id)?.label ?? id;
  const unused = defs.filter((d) => !tokens.includes(d.id));

  const move = (from: number, to: number) => {
    if (to < 0 || to >= tokens.length || from === to) return;
    const next = tokens.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const sep = <span className="ccd-nm-sep" aria-hidden>_</span>;
  const tag = (text: string) => <span className={`ccd-nm-chip ccd-nm-chip--tag${tagged ? '' : ' is-off'}`} aria-disabled={!tagged}>{text}</span>;

  return (
    <div className="ccd-nm-row" role="group" aria-label={label}>
      {label === 'Campaign name parts' && <>{tag(TAG_PREFIX)}{sep}</>}
      {tokens.map((id, i) => (
        <span key={id} className="ccd-nm-item">
          <span
            className={`ccd-nm-chip${dragFrom === i ? ' is-dragging' : ''}${over === i && dragFrom !== null && dragFrom !== i ? ' is-over' : ''}`}
            draggable tabIndex={0}
            onDragStart={(e) => { setDragFrom(i); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', id); }}
            onDragOver={(e) => { e.preventDefault(); setOver(i); }}
            onDragLeave={() => setOver((o) => (o === i ? null : o))}
            onDrop={(e) => { e.preventDefault(); if (dragFrom !== null) move(dragFrom, i); setDragFrom(null); setOver(null); }}
            onDragEnd={() => { setDragFrom(null); setOver(null); }}
            onKeyDown={(e) => {
              if (e.altKey && e.key === 'ArrowLeft') { e.preventDefault(); move(i, i - 1); }
              if (e.altKey && e.key === 'ArrowRight') { e.preventDefault(); move(i, i + 1); }
            }}
            aria-label={`${labelOf(id)}. Drag, or press Alt and an arrow key, to reorder.`}
          >
            <span className="ccd-nm-grip"><Grip /></span>
            {labelOf(id)}
            <button type="button" className="ccd-nm-x" aria-label={`Remove ${labelOf(id)}`} onClick={() => onChange(tokens.filter((t) => t !== id))}>
              <svg width={9} height={9} viewBox="0 0 16 16" fill="none" aria-hidden><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </span>
          {(i < tokens.length - 1 || label === 'Campaign name parts') && sep}
        </span>
      ))}
      {label === 'Campaign name parts' && tag(TAG_SUFFIX)}
      <span className="ccd-nm-add">
        <button type="button" className="ccd-nm-plus" aria-label="Add a name part" aria-haspopup="true" aria-expanded={menu} disabled={unused.length === 0} onClick={() => setMenu((m) => !m)}>
          <svg width={13} height={13} viewBox="0 0 16 16" fill="none" aria-hidden><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
        {menu && (
          <>
            <div className="ccd-nm-menuback" onMouseDown={() => setMenu(false)} />
            <div className="ccd-nm-menu" role="menu">
              {unused.map((d) => (
                <button key={d.id} type="button" role="menuitem" onClick={() => { onChange([...tokens, d.id]); setMenu(false); }}>{d.label}</button>
              ))}
            </div>
          </>
        )}
      </span>
    </div>
  );
}

export default function NamingPopup({ settings, campaigns, products, onApply, onClose }: {
  settings: NamingSettings; campaigns: CcCampaign[]; products: CcProduct[]; onApply: (next: NamingSettings) => void; onClose: () => void;
}) {
  const example = campaigns[0];
  const uid = useId();
  const [work, setWork] = useState<NamingSettings>(settings);
  const dirty = JSON.stringify(work) !== JSON.stringify(settings);

  const dialogRef = useRef<HTMLDivElement>(null);
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !dirtyRef.current) closeRef.current(); };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); opener?.focus?.(); };
  }, []);

  function keepFocusInside(e: React.KeyboardEvent) {
    if (e.key !== 'Tab') return;
    const items = dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), [tabindex="0"]');
    if (!items || items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === dialogRef.current)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
  }

  return createPortal(
    <div className="ccd-tm-back" onMouseDown={() => { if (!dirty) onClose(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={`${uid}-title`} tabIndex={-1} className="ccd-tm ccd-nm" onMouseDown={(e) => e.stopPropagation()} onKeyDown={keepFocusInside}>
        <header className="ccd-tm-head">
          <div>
            <h2 id={`${uid}-title`} className="ccd-tm-title">Naming settings</h2>
            <div className="ccd-tm-sub">Applying renames the {campaigns.length} {campaigns.length === 1 ? 'campaign' : 'campaigns'} in the table and their ad groups. Names you typed by hand are replaced.</div>
          </div>
          <div className="ccd-tm-actions">
            {dirty && <span className="ccd-tm-dirty">Unsaved changes</span>}
            <button type="button" className="ccd-tm-btn" onClick={onClose}>Cancel</button>
            <button type="button" className="ccd-tm-btn ccd-tm-btn--primary" disabled={!dirty} onClick={() => onApply(work)}>Apply to {campaigns.length} {campaigns.length === 1 ? 'campaign' : 'campaigns'}</button>
          </div>
        </header>

        <div className="ccd-nm-body">
          <section className="ccd-nm-section" aria-label="Campaign name">
            <div className="ccd-nm-head">
              <h3>Campaign Name</h3>
              <button type="button" className="ccd-nm-reset" onClick={() => setWork((w) => ({ ...w, tagStatus: DEFAULT_NAMING.tagStatus, campaignTokens: DEFAULT_NAMING.campaignTokens }))}>Reset</button>
            </div>
            <div className="ccd-nm-switch">
              <button type="button" role="switch" aria-checked={work.tagStatus} aria-labelledby={`${uid}-tag`} className={`ccd-nm-toggle${work.tagStatus ? ' is-on' : ''}`} onClick={() => setWork((w) => ({ ...w, tagStatus: !w.tagStatus }))}><i /></button>
              <strong id={`${uid}-tag`}>Campaign name tag status</strong>
            </div>
            <p className="ccd-nm-help">When enabled, campaign names will be modified to indicate the AI status.</p>
            <TokenRow label="Campaign name parts" tokens={work.campaignTokens} defs={CAMPAIGN_TOKENS} tagged={work.tagStatus} onChange={(next) => setWork((w) => ({ ...w, campaignTokens: next as NamingSettings['campaignTokens'] }))} />
            <div className="ccd-nm-preview"><span>{example ? 'First campaign:' : 'Preview:'}</span>{campaignPreview(work, example, products)}</div>
          </section>

          <section className="ccd-nm-section" aria-label="Ad group name">
            <div className="ccd-nm-head">
              <h3>AdGroup Name</h3>
              <button type="button" className="ccd-nm-reset" onClick={() => setWork((w) => ({ ...w, adGroupTokens: DEFAULT_NAMING.adGroupTokens }))}>Reset</button>
            </div>
            <TokenRow label="Ad group name parts" tokens={work.adGroupTokens} defs={AD_GROUP_TOKENS} onChange={(next) => setWork((w) => ({ ...w, adGroupTokens: next as NamingSettings['adGroupTokens'] }))} />
            <div className="ccd-nm-preview"><span>{example ? 'First ad group:' : 'Preview:'}</span>{adGroupPreview(work, example, products)}</div>
          </section>
        </div>
      </div>
    </div>,
    document.body,
  );
}
