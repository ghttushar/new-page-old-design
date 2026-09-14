import { useState } from 'react';
import {
  PROTOTYPE_ALERTS,
  type WorkstationTask, type TaskStatus, type AssigneeOption,
} from '@/constants/signals/prototype-data';
import { DEFAULT_ASSIGNEES, AssignDropdownList, Avatar } from '../alerts/assign-menu';
import { AssignIcon, CloseIcon, ChevronDownIcon } from '../alerts/icons';
import DiamondMascot from '@/app/components/common/diamond-mascot/diamond-mascot';
import { StatusCircleIcon, OriginGlyph } from './work-station-icons';
import scrollStyles from '../alerts/alerts-scroll.module.scss';
import motion from '../alerts/motion.module.scss';

const STATUS_LABEL: Record<TaskStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  done: 'Done',
};
const STATUS_ORDER: TaskStatus[] = ['open', 'in_progress', 'done'];

interface Props {
  task: WorkstationTask;
  onClose: () => void;
  onReassign: (a: AssigneeOption) => void;
  onSetStatus: (s: TaskStatus) => void;
  onOpenAlert?: (id: string) => void;
  onOpenMeeting?: (id: string) => void;
  onOpenJiva: () => void;
  jivaOpen: boolean;
}

export function WorkStationDetailPanel({ task, onClose, onReassign, onSetStatus, onOpenAlert, onOpenMeeting, onOpenJiva, jivaOpen }: Props) {
  const [assignMenuOpen, setAssignMenuOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const linkedAlert = task.origin === 'alert' && task.alertId ? PROTOTYPE_ALERTS.find((a) => a.id === task.alertId) : undefined;

  return (
    <div className={motion.slideInRight} style={{ flex: '0 0 420px', maxWidth: '46%', background: '#fff', borderLeft: '1px solid #e6e8ec', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f2f4', display: 'flex', alignItems: 'center', gap: 9, flex: 'none' }}>
        <OriginGlyph origin={task.origin} size={19} />
        <span style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9aa0a8' }}>
          {task.origin === 'alert' ? 'From an alert' : task.origin === 'meeting' ? 'From a meeting' : task.origin === 'generative' ? 'Generative task' : 'Direct task'}
        </span>
        <span onClick={onClose} className={motion.pressable} style={{ marginLeft: 'auto', display: 'flex', cursor: 'pointer', padding: 4 }}><CloseIcon size={13} /></span>
      </div>

      <div className={scrollStyles.sleekScroll} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '18px 20px' }}>
        <div style={{ font: `${task.status === 'done' ? '500' : '600'} 16px/1.4 Inter,sans-serif`, color: '#23272d', textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>{task.text}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16, padding: '13px 14px', border: '1px solid #eceef1', borderRadius: 8, background: '#fafbfd' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ flex: '0 0 74px', font: '500 11px/1 Inter,sans-serif', color: '#9aa0a8' }}>Assignee</span>
            <span onClick={() => setAssignMenuOpen((v) => !v)} className={motion.pressable} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', position: 'relative' }}>
              <Avatar name={task.assignee} size={20} vivid={task.assignee !== 'Unassigned'} />
              <span style={{ font: '600 12px/1 Inter,sans-serif', color: task.assignee === 'Unassigned' ? '#a8763f' : '#3d434b' }}>{task.assignee}</span>
              {assignMenuOpen && (
                <div className={motion.popIn} style={{ position: 'absolute', left: 0, top: 26, width: 220, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 6, zIndex: 50 }} onClick={(e) => e.stopPropagation()}>
                  <AssignDropdownList assignees={DEFAULT_ASSIGNEES} onSelect={(a) => { onReassign(a); setAssignMenuOpen(false); }} />
                </div>
              )}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ flex: '0 0 74px', font: '500 11px/1 Inter,sans-serif', color: '#9aa0a8' }}>Status</span>
            <span onClick={() => setStatusMenuOpen((v) => !v)} className={motion.pressable} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', position: 'relative' }}>
              <StatusCircleIcon status={task.status} />
              <span style={{ font: '600 12px/1 Inter,sans-serif', color: '#3d434b' }}>{STATUS_LABEL[task.status]}</span>
              {statusMenuOpen && (
                <div className={motion.popIn} style={{ position: 'absolute', left: 0, top: 22, width: 160, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 6, zIndex: 50 }} onClick={(e) => e.stopPropagation()}>
                  {STATUS_ORDER.map((s) => (
                    <div key={s} onClick={() => { onSetStatus(s); setStatusMenuOpen(false); }} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 6, cursor: 'pointer' }}>
                      <StatusCircleIcon status={s} />
                      <span style={{ font: '500 12px/1 Inter,sans-serif', color: '#3d434b' }}>{STATUS_LABEL[s]}</span>
                    </div>
                  ))}
                </div>
              )}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ flex: '0 0 74px', font: '500 11px/1 Inter,sans-serif', color: '#9aa0a8' }}>Due</span>
            <span style={{ font: '600 12px/1 Inter,sans-serif', color: task.overdue ? '#b3453f' : (task.dueColor || '#3d434b') }}>{task.due}</span>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Description</div>
          <div style={{ font: '400 12.5px/1.65 Inter,sans-serif', color: '#464646', marginTop: 8 }}>{task.description}</div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div onClick={() => setContextOpen((v) => !v)} className={motion.rowHover} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', margin: '0 -6px', padding: '2px 6px', borderRadius: 6 }}>
            <span style={{ display: 'flex', transform: contextOpen ? 'none' : 'rotate(-90deg)', transition: 'transform 160ms ease-out' }}>
              <ChevronDownIcon size={9} color="#6b7178" />
            </span>
            <span style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Context</span>
          </div>
          <div className={`${motion.accordionRow} ${contextOpen ? motion.accordionRowOpen : ''}`}>
            <div style={{ paddingTop: 8 }}>
              {task.origin === 'alert' && (
                <span onClick={() => onOpenAlert?.(task.alertId!)} className={motion.pressable} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, font: '600 12px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }} onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')} onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>
                  <OriginGlyph origin="alert" size={15} /> {linkedAlert?.title ?? task.alertId} →
                </span>
              )}
              {task.origin === 'meeting' && (
                <span onClick={() => onOpenMeeting?.(task.meetingId!)} className={motion.pressable} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, font: '600 12px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }} onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')} onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>
                  <OriginGlyph origin="meeting" size={15} /> {task.meetingLabel} →
                </span>
              )}
              {task.origin === 'generative' && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 9px', borderRadius: 5, background: '#f3eefa', font: '600 10px/1.5 Inter,sans-serif', color: '#5f3880' }}><OriginGlyph origin="generative" size={14} /> Generative task — Jiva can draft this</span>
              )}
              {task.origin === 'direct' && (
                <span style={{ font: '400 12px/1 Inter,sans-serif', color: '#9aa0a8' }}>Created directly, no linked alert or meeting.</span>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Activity</div>
          <div style={{ marginTop: 10, position: 'relative' }}>
            {task.logs.length > 1 && <span style={{ position: 'absolute', left: 3, top: 6, bottom: 6, width: 1, background: '#e6e8ec' }} />}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {task.logs.map((l, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, position: 'relative' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#c9b6dd', marginTop: 3, flex: 'none', zIndex: 1 }} />
                  <div>
                    <div style={{ font: '400 11.5px/1.4 Inter,sans-serif', color: '#464646' }}>{l.text}</div>
                    <div style={{ font: '400 10.5px/1 Inter,sans-serif', color: '#9aa0a8', marginTop: 3 }}>{l.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div style={{ padding: '13px 20px', borderTop: '1px solid #f1f2f4', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const, flex: 'none' }}>
        <span onClick={() => setAssignMenuOpen((v) => !v)} className={`${motion.pressable} ${motion.btnSecondary}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '600 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>
          <AssignIcon size={12} /> Assign to someone else
        </span>
        <span onClick={onOpenJiva} className={`${motion.pressable} ${motion.btnSecondary}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 12px', border: '1.5px solid #77469b', borderRadius: 7, font: '600 11px/1 Inter,sans-serif', color: jivaOpen ? '#fff' : '#77469b', cursor: 'pointer', background: jivaOpen ? '#77469b' : '#fff' }}>
          <DiamondMascot size={13} /> Ask Jiva
        </span>
        {task.origin === 'alert' && (
          <span onClick={() => onOpenAlert?.(task.alertId!)} className={`${motion.pressable} ${motion.btnSecondary}`} style={{ padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '600 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>View alert</span>
        )}
        {task.origin === 'meeting' && (
          <span onClick={() => onOpenMeeting?.(task.meetingId!)} className={`${motion.pressable} ${motion.btnSecondary}`} style={{ padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '600 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>View meeting</span>
        )}
      </div>
    </div>
  );
}
