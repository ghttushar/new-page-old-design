import { useMemo, useState } from 'react';
import { ACTION_CATEGORIES, ACTION_TYPES, type ActionType } from '@/constants/signals/action-types.constants';
import type { PrototypeAlert } from '@/constants/signals/prototype-data';
import { BackArrowIcon, CloseIcon } from './icons';
import scrollStyles from './alerts-scroll.module.scss';
import motion from './motion.module.scss';

interface Props {
  alert: PrototypeAlert;
  initialSearch?: string;
  /** 'inline' fills its parent with no backdrop (used in the Normal detail panel — no popups there).
   *  'overlay' is a centered floating box confined to its positioned ancestor (used in Speed Mode's arena). */
  variant?: 'inline' | 'overlay';
  onClose: () => void;
  onRequestEmail: (actionType: ActionType) => void;
  onRequestImageGen: (actionType: ActionType) => void;
  onSave: (actionType: ActionType, note: string, dueDate: string, assignee: string) => void;
}

const ASSIGNEES = ['You', 'Jiva · AI', 'Mike Torres', 'Priya Nair'];

export function ActionPicker({ alert, initialSearch, variant = 'overlay', onClose, onRequestEmail, onRequestImageGen, onSave }: Props) {
  const [search, setSearch] = useState(initialSearch ?? '');
  const [picked, setPicked] = useState<ActionType | null>(null);
  const [note, setNote] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignee, setAssignee] = useState(ASSIGNEES[0]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ACTION_TYPES;
    return ACTION_TYPES.filter((a) => a.label.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));
  }, [search]);

  const grouped = useMemo(() => {
    return ACTION_CATEGORIES.map((cat) => ({ cat, items: filtered.filter((a) => a.category === cat) })).filter((g) => g.items.length > 0);
  }, [filtered]);

  const pick = (a: ActionType) => {
    if (a.isEmailAction) {
      onRequestEmail(a);
      return;
    }
    if (a.isImageAction) {
      onRequestImageGen(a);
      return;
    }
    setPicked(a);
  };

  const panel = (
    <div
      className={variant === 'overlay' ? motion.overlayIn : undefined}
      style={variant === 'inline'
      ? { flex: 1, minWidth: 0, minHeight: 0, height: '100%', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, display: 'flex', flexDirection: 'column', overflow: 'hidden' }
      : { width: 620, maxHeight: '82vh', background: '#fff', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #e6e8ec', flex: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {variant === 'inline' && <span onClick={onClose} className={motion.pressable} style={{ display: 'flex', cursor: 'pointer' }}><BackArrowIcon size={14} /></span>}
          <span style={{ font: '700 15px/1 Inter,sans-serif', color: '#23272d' }}>{picked ? 'Log this action' : 'Choose an action type'}</span>
          {variant === 'overlay' && <span onClick={onClose} className={motion.pressable} style={{ display: 'flex', marginLeft: 'auto', cursor: 'pointer', padding: '0 4px' }}><CloseIcon size={13} /></span>}
        </div>
        <div style={{ font: '400 12px/1.5 Inter,sans-serif', color: '#6b7178', marginTop: 5 }}>{alert.title}</div>
      </div>

      {!picked ? (
        <>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid #f1f2f4', flex: 'none' }}>
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search action types…"
              className={motion.focusRing}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1 Inter,sans-serif', color: '#3d434b', outline: 'none' }}
            />
          </div>
          <div className={scrollStyles.sleekScroll} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '4px 0' }}>
            {grouped.length === 0 && (
              <div style={{ padding: '30px 20px', textAlign: 'center', font: '400 12px/1.6 Inter,sans-serif', color: '#6b7178' }}>No action types match “{search}”.</div>
            )}
            {grouped.map((g) => (
              <div key={g.cat}>
                <div style={{ padding: '10px 20px 6px', font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#9aa0a8', background: '#fafbfd' }}>{g.cat}</div>
                {g.items.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => pick(a)}
                    style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', borderBottom: '1px solid #f6f7f8', transition: 'background 120ms ease-out' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fbfafd')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ flex: 1, minWidth: 0, font: '500 12px/1.5 Inter,sans-serif', color: '#3d434b' }}>{a.label}</span>
                    {a.isEmailAction && (
                      <span style={{ flex: 'none', padding: '2px 7px', borderRadius: 4, background: '#f3eefa', font: '600 9px/1.5 Inter,sans-serif', color: '#5f3880' }}>EMAIL</span>
                    )}
                    {a.isImageAction && (
                      <span style={{ flex: 'none', padding: '2px 7px', borderRadius: 4, background: '#eef6f3', font: '600 9px/1.5 Inter,sans-serif', color: '#3f7d6a' }}>IMAGE GEN</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={scrollStyles.sleekScroll} style={{ padding: '18px 20px', overflowY: 'auto', flex: 1, minHeight: 0 }}>
          <div style={{ padding: '10px 12px', border: '1px solid #e6e8ec', borderRadius: 7, background: '#fafbfd', font: '600 12px/1.4 Inter,sans-serif', color: '#23272d' }}>{picked.label}</div>

          <div style={{ marginTop: 14 }}>
            <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9aa0a8', marginBottom: 7 }}>Note</div>
            <textarea
              autoFocus
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What are you doing, and why…"
              className={motion.focusRing}
              style={{ width: '100%', padding: '9px 11px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1.5 Inter,sans-serif', color: '#464646', resize: 'vertical' as const, minHeight: 68, outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9aa0a8', marginBottom: 7 }}>Due date</div>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={motion.focusRing} style={{ width: '100%', padding: '8px 10px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1 Inter,sans-serif', color: '#3d434b', outline: 'none' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9aa0a8', marginBottom: 7 }}>Assignee</div>
              <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className={motion.focusRing} style={{ width: '100%', padding: '8px 10px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1 Inter,sans-serif', color: '#3d434b', outline: 'none', background: '#fff' }}>
                {ASSIGNEES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 18 }}>
            <span onClick={() => onSave(picked, note, dueDate, assignee)} className={`${motion.pressable} ${motion.btnPrimary}`} style={{ padding: '10px 16px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 12px/1 Inter,sans-serif', cursor: 'pointer' }}>Save action</span>
            <span onClick={() => setPicked(null)} className={`${motion.pressable} ${motion.btnSecondary}`} style={{ padding: '9px 14px', borderRadius: 7, border: '1px solid #dfe3ea', font: '500 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>← Back</span>
            <span onClick={() => onRequestEmail(picked)} className={motion.pressable} style={{ marginLeft: 'auto', font: '600 11px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>Send as email instead →</span>
          </div>
        </div>
      )}
    </div>
  );

  if (variant === 'inline') return panel;

  return (
    <div className={motion.backdropIn} style={{ position: 'absolute', inset: 0, background: 'rgba(20,24,33,.44)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 220 }}>
      {panel}
    </div>
  );
}
