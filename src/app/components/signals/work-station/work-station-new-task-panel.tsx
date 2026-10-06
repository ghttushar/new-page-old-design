import { useState } from 'react';
import type { TaskPriority } from '@/constants/signals/prototype-data';
import { DEFAULT_ASSIGNEES, Avatar } from '../alerts/assign-menu';
import { CloseIcon, ChevronDownIcon } from '../alerts/icons';
import { DueDatePopover } from '../common/due-date-popover';
import { StatusCircleIcon, STATUS_COLOR, STATUS_LABEL, PRIORITY_COLOR } from './work-station-icons';
import scrollStyles from '../alerts/alerts-scroll.module.scss';
import motion from '../alerts/motion.module.scss';

const PRIORITY_ORDER: TaskPriority[] = ['High', 'Medium', 'Low'];
const LABEL: React.CSSProperties = { font: '600 9.5px/1 Inter,sans-serif', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#9aa0a8', marginBottom: 8 };
const SECTION_LABEL: React.CSSProperties = { font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase', color: '#6b7178' };

interface Props {
  title: string;
  description: string;
  assigneeId: string;
  priority: TaskPriority;
  due: string;
  onTitle: (v: string) => void;
  onDescription: (v: string) => void;
  onAssignee: (id: string) => void;
  onPriority: (p: TaskPriority) => void;
  onDue: (v: string) => void;
  onCancel: () => void;
  onCreate: () => void;
  /** Forces one field menu open on mount — for the design-handoff preview, not used by the real app. */
  initialMenu?: 'assignee' | 'priority' | 'due';
}

/** The "New task" screen: opens in the right-hand column in place of the task detail, laid out like it. */
export function WorkStationNewTaskPanel({
  title, description, assigneeId, priority, due,
  onTitle, onDescription, onAssignee, onPriority, onDue, onCancel, onCreate, initialMenu,
}: Props) {
  const [assignMenuOpen, setAssignMenuOpen] = useState(initialMenu === 'assignee');
  const [priorityMenuOpen, setPriorityMenuOpen] = useState(initialMenu === 'priority');
  const [dueMenuOpen, setDueMenuOpen] = useState(initialMenu === 'due');

  const assigneeName = assigneeId === 'unassigned' ? 'Unassigned' : assigneeId === 'self' ? 'Me' : DEFAULT_ASSIGNEES.find((a) => a.id === assigneeId)?.name ?? 'Me';
  const canCreate = title.trim().length > 0;

  return (
    <div className={motion.slideInRight} style={{ flex: 1, minWidth: 0, height: '100%', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f2f4', flex: 'none', background: 'radial-gradient(circle at 88% -20%, rgba(119,70,155,.06), transparent 55%)' }}>
        <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase', color: '#77469b', marginBottom: 10 }}>New task</div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <input
            autoFocus
            value={title}
            onChange={(e) => onTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && canCreate) onCreate(); if (e.key === 'Escape') onCancel(); }}
            placeholder="What needs to get done?"
            aria-label="Task title"
            className={motion.focusRing}
            style={{ flex: 1, minWidth: 0, font: '600 15px/1.4 Inter,sans-serif', color: '#23272d', border: '1px solid #dfe3ea', borderRadius: 7, padding: '8px 10px', outline: 'none', fontFamily: 'inherit', background: '#fff' }}
          />
          <span
            onClick={onCancel} role="button" aria-label="Close new task" className={motion.pressable}
            style={{ display: 'flex', flex: 'none', cursor: 'pointer', padding: 3, borderRadius: 6, marginTop: 4, marginRight: -3 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f6f4fa')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <CloseIcon size={15} color="#6b7178" />
          </span>
        </div>
      </div>

      <div className={scrollStyles.sleekScroll} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '18px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 14, rowGap: 16, padding: '14px 16px', border: '1px solid #eceef1', borderRadius: 10 }}>
          <div>
            <div style={LABEL}>Assignee</div>
            <span onClick={() => setAssignMenuOpen((v) => !v)} className={`${motion.pressable} ${motion.btnSecondary}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, cursor: 'pointer', position: 'relative', border: '1px solid #e6e8ec', borderRadius: 7, padding: '5px 9px 5px 7px', background: '#fff' }}>
              <Avatar name={assigneeName === 'Me' ? 'You' : assigneeName} size={20} vivid={assigneeId !== 'unassigned'} />
              <span style={{ font: '600 12.5px/1 Inter,sans-serif', color: assigneeId === 'unassigned' ? '#a8763f' : '#3d434b' }}>{assigneeName}</span>
              <ChevronDownIcon size={8} color="#9aa0a8" />
              {assignMenuOpen && (
                <div className={motion.popIn} style={{ position: 'absolute', left: 0, top: 32, width: 220, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 6, zIndex: 50 }} onClick={(e) => e.stopPropagation()}>
                  {[...DEFAULT_ASSIGNEES.map((a) => ({ id: a.id, name: a.id === 'self' ? 'Me' : a.name })), { id: 'unassigned', name: 'Unassigned' }].map((a) => (
                    <div key={a.id} onClick={() => { onAssignee(a.id); setAssignMenuOpen(false); }} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 6, cursor: 'pointer' }}>
                      <Avatar name={a.name === 'Me' ? 'You' : a.name} size={20} vivid={a.id !== 'unassigned'} />
                      <span style={{ font: '500 12px/1 Inter,sans-serif', color: '#3d434b' }}>{a.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </span>
          </div>

          <div>
            <div style={LABEL}>Status</div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px 4px 7px', borderRadius: 999, background: STATUS_COLOR.open + '14' }}>
              <StatusCircleIcon status="open" />
              <span style={{ font: '600 12.5px/1 Inter,sans-serif', color: STATUS_COLOR.open }}>{STATUS_LABEL.open}</span>
            </span>
          </div>

          <div>
            <div style={LABEL}>Priority</div>
            <span onClick={() => setPriorityMenuOpen((v) => !v)} className={motion.pressable} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px 4px 7px', borderRadius: 999, background: PRIORITY_COLOR[priority] + '14', cursor: 'pointer', position: 'relative' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: PRIORITY_COLOR[priority], flex: 'none' }} />
              <span style={{ font: '600 12.5px/1 Inter,sans-serif', color: PRIORITY_COLOR[priority] }}>{priority}</span>
              <ChevronDownIcon size={8} color={PRIORITY_COLOR[priority]} />
              {priorityMenuOpen && (
                <div className={motion.popIn} style={{ position: 'absolute', left: 0, top: 30, width: 140, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 6, zIndex: 50 }} onClick={(e) => e.stopPropagation()}>
                  {PRIORITY_ORDER.map((p) => (
                    <div key={p} onClick={() => { onPriority(p); setPriorityMenuOpen(false); }} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 6, cursor: 'pointer' }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: PRIORITY_COLOR[p], flex: 'none' }} />
                      <span style={{ font: '500 12px/1 Inter,sans-serif', color: '#3d434b' }}>{p}</span>
                    </div>
                  ))}
                </div>
              )}
            </span>
          </div>

          <div>
            <div style={LABEL}>Due</div>
            <span onClick={() => setDueMenuOpen((v) => !v)} className={`${motion.pressable} ${motion.btnSecondary}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: '600 12.5px/1 Inter,sans-serif', color: due ? '#3d434b' : '#9aa0a8', cursor: 'pointer', padding: '5px 9px', border: '1px solid #e6e8ec', borderRadius: 7, background: '#fff', position: 'relative' }}>
              {due || 'No due date'}
              <ChevronDownIcon size={8} color="#9aa0a8" />
              {dueMenuOpen && <DueDatePopover value={due || 'No due date'} onSelect={(d) => { onDue(d); setDueMenuOpen(false); }} />}
            </span>
          </div>
        </div>

        <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid #f1f2f4' }}>
          <div style={SECTION_LABEL}>Description</div>
          <textarea
            value={description}
            onChange={(e) => onDescription(e.target.value)}
            placeholder="Add more detail (optional)"
            aria-label="Description"
            rows={4}
            className={motion.focusRing}
            style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical', marginTop: 8, font: '400 12.5px/1.65 Inter,sans-serif', color: '#464646', border: '1px solid #dfe3ea', borderRadius: 7, padding: '8px 10px', outline: 'none', fontFamily: 'inherit' }}
          />
        </div>

      </div>

      <div style={{ flex: 'none', display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 20px', borderTop: '1px solid #f1f2f4', background: '#fff' }}>
        <span onClick={onCancel} className={`${motion.pressable} ${motion.btnSecondary}`} style={{ padding: '9px 18px', border: '1px solid #dfe3ea', borderRadius: 7, font: '600 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>Cancel</span>
        <span
          onClick={canCreate ? onCreate : undefined} role="button" aria-disabled={!canCreate}
          className={canCreate ? `${motion.pressable} ${motion.btnPrimary}` : motion.pressable}
          style={{ padding: '9px 18px', borderRadius: 7, background: canCreate ? '#77469b' : '#eee7f5', color: canCreate ? '#fff' : '#c3b3d6', font: '600 12px/1 Inter,sans-serif', cursor: canCreate ? 'pointer' : 'default' }}
        >
          Create task
        </span>
      </div>
    </div>
  );
}
