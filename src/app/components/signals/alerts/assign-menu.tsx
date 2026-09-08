import { useMemo, useState } from 'react';
import type { AssigneeOption } from '@/constants/signals/prototype-data';
import { SparkleIcon, BackArrowIcon, CloseIcon } from './icons';
import scrollStyles from './alerts-scroll.module.scss';
import motion from './motion.module.scss';

export const DEFAULT_ASSIGNEES: AssigneeOption[] = [
  { id: 'jiva', name: 'Jiva', role: 'AI' },
  { id: 'mike', name: 'Mike Torres', role: 'Ops' },
  { id: 'sarah', name: 'Sarah Kim', role: 'Marketing' },
  { id: 'self', name: 'Myself', role: 'You' },
];

export const ASSIGN_POPUP_THRESHOLD = 15;

function initials(name: string): string {
  const clean = name.replace(/[^\p{L}\s]/gu, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

function Avatar({ name, size = 24 }: { name: string; size?: number }) {
  const isJiva = name.includes('Jiva');
  return (
    <span
      style={{
        width: size, height: size, borderRadius: '50%', flex: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isJiva ? '#f3eefa' : '#eceef1',
        color: isJiva ? '#5f3880' : '#5c636e',
        font: `700 ${Math.round(size * 0.42)}px/1 Inter,sans-serif`,
      }}
    >
      {isJiva ? <SparkleIcon size={Math.round(size * 0.5)} color="#5f3880" /> : initials(name)}
    </span>
  );
}

/** Inline searchable list — used inside an existing small dropdown panel (≤ ASSIGN_POPUP_THRESHOLD assignees). */
export function AssignDropdownList({ assignees, onSelect }: { assignees: AssigneeOption[]; onSelect: (a: AssigneeOption) => void }) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return assignees;
    return assignees.filter((a) => a.name.toLowerCase().includes(query) || a.role.toLowerCase().includes(query));
  }, [assignees, q]);

  return (
    <>
      <div style={{ padding: '4px 4px 8px' }}>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          placeholder="Search people…"
          style={{ width: '100%', padding: '7px 9px', border: '1px solid #dfe3ea', borderRadius: 6, font: '400 11px/1 Inter,sans-serif', color: '#3d434b', outline: 'none' }}
        />
      </div>
      <div style={{ maxHeight: 200, overflowY: 'auto' }}>
        {filtered.map((a) => (
          <div
            key={a.id}
            onClick={(e) => { e.stopPropagation(); onSelect(a); }}
            style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 6, cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f6f4fa')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <Avatar name={a.name} size={20} />
            <span style={{ font: '500 12px/1 Inter,sans-serif', color: '#3d434b' }}>{a.name}</span>
            <span style={{ marginLeft: 'auto', font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8' }}>{a.role}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '10px', textAlign: 'center', font: '400 11px/1.5 Inter,sans-serif', color: '#9aa0a8' }}>No matches</div>
        )}
      </div>
    </>
  );
}

/**
 * List for large assignee counts (> ASSIGN_POPUP_THRESHOLD).
 * 'inline' fills its parent with no backdrop (Normal detail panel — no popups there).
 * 'overlay' is a centered floating box confined to its positioned ancestor (list-panel row menu, Speed Mode).
 */
export function AssignPopupModal({ assignees, variant = 'overlay', onSelect, onClose }: { assignees: AssigneeOption[]; variant?: 'inline' | 'overlay'; onSelect: (a: AssigneeOption) => void; onClose: () => void }) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return assignees;
    return assignees.filter((a) => a.name.toLowerCase().includes(query) || a.role.toLowerCase().includes(query));
  }, [assignees, q]);

  const panel = (
    <div
      className={variant === 'overlay' ? motion.overlayIn : undefined}
      style={variant === 'inline'
        ? { flex: 1, minWidth: 0, minHeight: 0, height: '100%', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, display: 'flex', flexDirection: 'column', overflow: 'hidden' }
        : { width: 480, maxHeight: '78vh', background: '#fff', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 60px rgba(20,24,33,.28)' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #e6e8ec', flex: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {variant === 'inline' && <span onClick={onClose} style={{ display: 'flex', cursor: 'pointer' }}><BackArrowIcon size={14} /></span>}
          <span style={{ font: '700 15px/1 Inter,sans-serif', color: '#23272d' }}>Assign to</span>
          <span style={{ font: '400 12px/1 Inter,sans-serif', color: '#6b7178' }}>{assignees.length} people</span>
          {variant === 'overlay' && <span onClick={onClose} style={{ display: 'flex', marginLeft: 'auto', cursor: 'pointer', padding: '0 4px' }}><CloseIcon size={13} /></span>}
        </div>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search people or role…"
          style={{ width: '100%', marginTop: 12, padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1 Inter,sans-serif', color: '#3d434b', outline: 'none' }}
        />
      </div>
      <div className={scrollStyles.sleekScroll} style={{ overflowY: 'auto', flex: 1, minHeight: 0, padding: '8px' }}>
        {filtered.map((a) => (
          <div
            key={a.id}
            onClick={() => onSelect(a)}
            style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', borderRadius: 8, cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f6f4fa')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <Avatar name={a.name} size={30} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: '600 12.5px/1.3 Inter,sans-serif', color: '#23272d' }}>{a.name}</div>
              <div style={{ font: '400 11px/1.4 Inter,sans-serif', color: '#6b7178' }}>{a.role}</div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '30px 20px', textAlign: 'center', font: '400 12px/1.6 Inter,sans-serif', color: '#6b7178' }}>No one matches “{q}”.</div>
        )}
      </div>
    </div>
  );

  if (variant === 'inline') return panel;

  return (
    <div className={motion.backdropIn} style={{ position: 'absolute', inset: 0, background: 'rgba(20,24,33,.44)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 240 }} onClick={onClose}>
      {panel}
    </div>
  );
}
