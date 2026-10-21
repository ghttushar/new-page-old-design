import { CrosshairSimpleIcon, LightningIcon, StackIcon, XIcon, type Icon } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useModalLock from '@/app/components/notifications/use-modal-lock';
import { CAMPAIGN_MODES, type CampaignMode } from '../campaign-creator.types';

const ICONS: Record<CampaignMode, Icon> = { auto: LightningIcon, manual: CrosshairSimpleIcon, both: StackIcon };


function Dialog({ value, onClose, onConfirm }: { value: CampaignMode; onClose: () => void; onConfirm: (mode: CampaignMode) => void }) {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<CampaignMode>(value);
  const ref = useRef<HTMLDivElement>(null);
  useModalLock(true);
  useEffect(() => { ref.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus(); }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.stopPropagation(); onClose(); return; }
    const i = CAMPAIGN_MODES.findIndex((m) => m.id === mode);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); const next = CAMPAIGN_MODES[(i + 1) % CAMPAIGN_MODES.length].id; setMode(next); ref.current?.querySelector<HTMLElement>(`[data-mode="${next}"]`)?.focus(); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); const next = CAMPAIGN_MODES[(i + CAMPAIGN_MODES.length - 1) % CAMPAIGN_MODES.length].id; setMode(next); ref.current?.querySelector<HTMLElement>(`[data-mode="${next}"]`)?.focus(); }
  };

  return (
    <motion.div
      className="ccd-cm-back" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.16 }}
    >
      <motion.div
        ref={ref} className="ccd-cm" role="dialog" aria-modal="true" aria-labelledby="ccd-cm-title" onKeyDown={onKeyDown}
        initial={reduce ? false : { opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.99 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="ccd-cm-head">
          <div>
            <h2 id="ccd-cm-title">Which campaigns do you want to create?</h2>
            <p>The next steps only show what your choice needs. You can change it later from Ad format.</p>
          </div>
          <button type="button" className="ccd-cm-x" onClick={onClose} aria-label="Close"><XIcon size={17} /></button>
        </header>

        <div className="ccd-cm-options" role="radiogroup" aria-label="Campaign type">
          {CAMPAIGN_MODES.map((m) => {
            const IconOf = ICONS[m.id];
            const on = mode === m.id;
            return (
              <button
                key={m.id} type="button" role="radio" aria-checked={on} data-mode={m.id} tabIndex={on ? 0 : -1}
                className={`ccd-cm-option${on ? ' is-on' : ''}`} onClick={() => setMode(m.id)} onDoubleClick={() => onConfirm(m.id)}
              >
                <span className="ccd-cm-icon"><IconOf size={20} weight={on ? 'fill' : 'regular'} /></span>
                <span className="ccd-cm-copy">
                  <strong>{m.label}</strong>
                  <span>{m.description}</span>
                </span>
                <span className="ccd-cm-radio" aria-hidden><i /></span>
              </button>
            );
          })}
        </div>

        <footer className="ccd-cm-foot">
          <button type="button" className="ccd-tm-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="ccd-tm-btn ccd-tm-btn--primary" onClick={() => onConfirm(mode)}>Continue</button>
        </footer>
      </motion.div>
    </motion.div>
  );
}

/** Asked right after the ad format: Auto, Manual, or both. The choice shapes Targeting and Structure. */
export default function CampaignModeDialog({ open, value, onClose, onConfirm }: {
  open: boolean; value: CampaignMode; onClose: () => void; onConfirm: (mode: CampaignMode) => void;
}) {
  return createPortal(
    <AnimatePresence>{open && <Dialog key="ccd-cm" value={value} onClose={onClose} onConfirm={onConfirm} />}</AnimatePresence>,
    document.body,
  );
}
