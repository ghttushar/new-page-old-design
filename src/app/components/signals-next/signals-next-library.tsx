import { useState, type ReactNode } from 'react';
import { ChevronDownIcon } from '../signals/alerts/icons';
import motion from '../signals/alerts/motion.module.scss';

function LibrarySection({ label, count, children }: { label: string; count: number; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ borderBottom: '1px solid #f1f2f4' }}>
      <div onClick={() => setOpen((v) => !v)} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', cursor: 'pointer' }}>
        <span style={{ display: 'flex', transform: open ? 'none' : 'rotate(-90deg)', transition: 'transform 160ms ease-out' }}>
          <ChevronDownIcon size={10} color="#6b7178" />
        </span>
        <span style={{ flex: 1, font: '700 12.5px/1 Inter,sans-serif', color: '#23272d' }}>{label}</span>
        <span style={{ font: '600 11px/1 Inter,sans-serif', color: '#9aa0a8' }}>{count}</span>
      </div>
      <div className={`${motion.accordionRow} ${open ? motion.accordionRowOpen : ''}`}>
        <div style={{ paddingBottom: 8 }}>{children}</div>
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div style={{ margin: '0 18px 14px', font: '400 12px/1.6 Inter,sans-serif', color: '#9aa0a8' }}>{text}</div>;
}

/**
 * Library — reports, presentations, and images Jiva generates. No generation pipeline
 * exists yet, so both sections are real, working accordions with an honest empty state
 * rather than fabricated assets.
 */
export function SignalsNextLibrary() {
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', background: '#fff' }}>
      <LibrarySection label="Generated" count={0}>
        <Empty text="Nothing generated yet — ask Jiva for a report, presentation, or image and it'll land here." />
      </LibrarySection>
      <LibrarySection label="In process" count={0}>
        <Empty text="Nothing in progress right now." />
      </LibrarySection>
    </div>
  );
}
