import { LightningIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useModalLock from '@/app/components/notifications/use-modal-lock';

// Asked on Create when none of the new campaigns is attached to a Rule: on a long Review page the Rules section is easy
// to miss, so the user picks between attaching one now and creating without automation.

function Dialog({ campaignCount, onAttach, onCreate, onClose }: { campaignCount: number; onAttach: () => void; onCreate: () => void; onClose: () => void }) {
  const reduce = useReducedMotion();
  const attachRef = useRef<HTMLButtonElement>(null);
  useModalLock(true);
  useEffect(() => { attachRef.current?.focus(); }, []);
  const all = campaignCount === 1 ? 'Your campaign isn’t' : campaignCount === 2 ? 'Neither of your 2 campaigns is' : `None of your ${campaignCount} campaigns are`;

  return (
    <motion.div
      className="ccd-cm-back" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.16 }}
    >
      <motion.div
        className="ccd-cm ccd-rp" role="dialog" aria-modal="true" aria-labelledby="ccd-nr-title" aria-describedby="ccd-nr-body"
        onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } }}
        initial={reduce ? false : { opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.99 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="ccd-rp-body">
          <span className="ccd-rp-icon ccd-rp-icon--brand" aria-hidden><LightningIcon size={20} weight="fill" /></span>
          <div>
            <h2 id="ccd-nr-title">Create without Rules?</h2>
            <p id="ccd-nr-body">
              {all} attached to a Rule, so {campaignCount === 1 ? 'it' : 'they'}’ll run without automation for budgets, bids or inventory.
              You can also attach Rules later from Campaign Manager.
            </p>
          </div>
        </div>
        <footer className="ccd-cm-foot">
          <button type="button" className="ccd-tm-btn" onClick={onCreate}>Create without Rules</button>
          <button ref={attachRef} type="button" className="ccd-tm-btn ccd-tm-btn--primary" onClick={onAttach}>Attach a Rule</button>
        </footer>
      </motion.div>
    </motion.div>
  );
}

export default function NoRulesDialog({ open, campaignCount, onAttach, onCreate, onClose }: {
  open: boolean; campaignCount: number; onAttach: () => void; onCreate: () => void; onClose: () => void;
}) {
  return createPortal(
    <AnimatePresence>{open && <Dialog key="ccd-nr" campaignCount={campaignCount} onAttach={onAttach} onCreate={onCreate} onClose={onClose} />}</AnimatePresence>,
    document.body,
  );
}
