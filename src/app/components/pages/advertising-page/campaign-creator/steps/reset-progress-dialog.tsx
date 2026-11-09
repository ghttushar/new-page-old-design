import { WarningIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useModalLock from '@/app/components/notifications/use-modal-lock';

// Asked when a change on an earlier step would undo the steps after it: they have to be gone through again, and the
// campaigns and keywords built from the current setup are removed.

const list = (names: string[]) => (names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`);

function Dialog({ stepName, laterSteps, onKeep, onChange }: { stepName: string; laterSteps: string[]; onKeep: () => void; onChange: () => void }) {
  const reduce = useReducedMotion();
  const keepRef = useRef<HTMLButtonElement>(null);
  useModalLock(true);
  useEffect(() => { keepRef.current?.focus(); }, []);

  return (
    <motion.div
      className="ccd-cm-back" onMouseDown={(e) => { if (e.target === e.currentTarget) onKeep(); }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.16 }}
    >
      <motion.div
        className="ccd-cm ccd-rp" role="alertdialog" aria-modal="true" aria-labelledby="ccd-rp-title" aria-describedby="ccd-rp-body"
        onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); onKeep(); } }}
        initial={reduce ? false : { opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.99 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="ccd-rp-body">
          <span className="ccd-rp-icon" aria-hidden><WarningIcon size={20} weight="fill" /></span>
          <div>
            <h2 id="ccd-rp-title">Change {stepName}?</h2>
            <p id="ccd-rp-body">
              You've already set up {list(laterSteps)}. Changing this means going through {laterSteps.length === 1 ? 'that step' : 'those steps'} again.
              Your choices there stay filled in, but the campaigns and keywords built from your current setup will be removed.
            </p>
          </div>
        </div>
        <footer className="ccd-cm-foot">
          <button ref={keepRef} type="button" className="ccd-tm-btn" onClick={onKeep}>Keep my progress</button>
          <button type="button" className="ccd-tm-btn ccd-tm-btn--primary" onClick={onChange}>Change and redo later steps</button>
        </footer>
      </motion.div>
    </motion.div>
  );
}

export default function ResetProgressDialog({ open, stepName, laterSteps, onKeep, onChange }: {
  open: boolean; stepName: string; laterSteps: string[]; onKeep: () => void; onChange: () => void;
}) {
  return createPortal(
    <AnimatePresence>{open && <Dialog key="ccd-rp" stepName={stepName} laterSteps={laterSteps} onKeep={onKeep} onChange={onChange} />}</AnimatePresence>,
    document.body,
  );
}
