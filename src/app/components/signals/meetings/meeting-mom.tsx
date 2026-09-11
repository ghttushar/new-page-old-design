import { useEffect, useState } from 'react';
import { MOM_RECORDS, type MomTaskItem } from '@/constants/signals/prototype-data';
import { AssignDropdownList, DEFAULT_ASSIGNEES } from '../alerts/assign-menu';
import { AssignIcon } from '../alerts/icons';
import { EmptyAlertGraphic } from '../alerts/empty-alert-graphic';
import scrollStyles from '../alerts/alerts-scroll.module.scss';
import motion from '../alerts/motion.module.scss';

interface Props {
  meetingId: string | null;
  onGoWorkstation: () => void;
}

export function MeetingMOM({ meetingId, onGoWorkstation }: Props) {
  const record = meetingId ? MOM_RECORDS[meetingId] : undefined;
  const [sent, setSent] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [summaryText, setSummaryText] = useState(record?.summary ?? '');
  const [decisions, setDecisions] = useState<string[]>(record?.decisions ?? []);
  const [decisionEditIdx, setDecisionEditIdx] = useState<number | null>(null);
  const [tasks, setTasks] = useState<MomTaskItem[]>(record?.tasks ?? []);
  const [taskEditCell, setTaskEditCell] = useState<{ idx: number; field: 'task' | 'due' } | null>(null);
  const [assignOpenIdx, setAssignOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    setSent(false);
    setEditMode(false);
    setSummaryText(record?.summary ?? '');
    setDecisions(record?.decisions ?? []);
    setDecisionEditIdx(null);
    setTasks(record?.tasks ?? []);
    setTaskEditCell(null);
    setAssignOpenIdx(null);
  }, [meetingId, record]);

  if (!record) {
    return (
      <div style={{ flex: 1, minWidth: 0, minHeight: 0, height: '100%', background: 'radial-gradient(circle at 18% 8%, rgba(119,70,155,.06), transparent 45%), #fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
          <EmptyAlertGraphic />
          <div style={{ font: '700 19px/1.4 Inter,sans-serif', color: '#23272d', marginTop: 22 }}>No minutes to show</div>
          <div style={{ font: '400 13px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 7, maxWidth: 320, textAlign: 'center' }}>Select a completed meeting from the list.</div>
        </div>
      </div>
    );
  }

  const isSent = record.sent || sent;

  const updateDecision = (i: number, text: string) => setDecisions((prev) => prev.map((d, idx) => (idx === i ? text : d)));
  const addDecision = () => { setDecisions((prev) => [...prev, '']); setDecisionEditIdx(decisions.length); };

  const updateTask = (i: number, patch: Partial<MomTaskItem>) => setTasks((prev) => prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  const addTask = () => {
    setTasks((prev) => [...prev, { task: '', assignee: 'Unassigned', due: 'Set date', status: 'Work-station' }]);
    setTaskEditCell({ idx: tasks.length, field: 'task' });
  };

  return (
    <div style={{ flex: 1, minWidth: 0, minHeight: 0, height: '100%', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
    <div key={meetingId} className={`${scrollStyles.sleekScroll} ${motion.contentFadeIn}`} style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f2f4' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ padding: '2px 7px', borderRadius: 4, background: '#eef6f3', font: '600 10px/1.5 Inter,sans-serif', color: '#3f7d6a' }}>{record.completedLabel}</span>
          <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{record.transcriptMeta}</span>
        </div>
        <div style={{ font: '600 18px/1.4 Inter,sans-serif', color: '#23272d', marginTop: 11 }}>{record.title}</div>
        <div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 5 }}>{record.dateLabel}</div>
      </div>

      <div style={{ padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Discussion summary */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Discussion summary</span>
            {!isSent && (
              <span onClick={() => setEditMode((v) => !v)} className={motion.pressable} style={{ font: '600 11px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>{editMode ? 'Done editing' : 'Edit'}</span>
            )}
          </div>
          {editMode ? (
            <textarea
              autoFocus
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              className={motion.focusRing}
              style={{ width: '100%', minHeight: 110, marginTop: 9, padding: 12, border: '1px solid #77469b', borderRadius: 7, font: '400 12px/1.6 Inter,sans-serif', color: '#464646', outline: 'none', resize: 'vertical' as const }}
            />
          ) : (
            <div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#464646', marginTop: 9 }}>{summaryText}</div>
          )}
        </div>

        {/* Decisions */}
        <div>
          <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Decisions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 11 }}>
            {decisions.map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: 11, padding: '12px 14px', border: '1px solid #e6e8ec', borderRadius: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3f7d6a', marginTop: 6, flex: 'none' }} />
                {decisionEditIdx === i ? (
                  <input
                    autoFocus
                    value={d}
                    onChange={(e) => updateDecision(i, e.target.value)}
                    onBlur={() => setDecisionEditIdx(null)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setDecisionEditIdx(null); }}
                    className={motion.focusRing}
                    style={{ flex: 1, minWidth: 0, font: '400 12px/1.6 Inter,sans-serif', color: '#464646', border: '1px solid #77469b', borderRadius: 6, padding: '4px 8px', outline: 'none' }}
                  />
                ) : (
                  <span onClick={() => setDecisionEditIdx(i)} className={motion.rowHover} style={{ flex: 1, font: '400 12px/1.6 Inter,sans-serif', color: '#464646', cursor: 'text', padding: '3px 6px', margin: '-3px -6px', borderRadius: 5 }}>{d}</span>
                )}
              </div>
            ))}
            <div onClick={addDecision} className={`${motion.pressable} ${motion.btnSecondary}`} style={{ padding: '11px 14px', border: '1px dashed #cfd4dc', borderRadius: 8, font: '400 12px/1 Inter,sans-serif', color: '#6b7178', cursor: 'pointer' }}>+ Add a decision</div>
          </div>
        </div>

        {/* Task items */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Task items</span>
            <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{tasks.length} extracted · assignees detected</span>
          </div>
          <div style={{ border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden', marginTop: 11 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 170px 100px 110px', padding: '9px 15px', background: '#fafbfd', borderBottom: '1px solid #f1f2f4', font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.06em', color: '#6b7178' }}>
              <div>TASK</div><div>ASSIGN</div><div>DUE</div><div style={{ textAlign: 'right' }}>STATUS</div>
            </div>
            {tasks.map((t, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 170px 100px 110px', padding: '10px 15px', borderBottom: i < tasks.length - 1 ? '1px solid #f1f2f4' : 'none', alignItems: 'center', font: '400 12px/1.4 Inter,sans-serif' }}>
                {taskEditCell?.idx === i && taskEditCell.field === 'task' ? (
                  <input
                    autoFocus
                    value={t.task}
                    onChange={(e) => updateTask(i, { task: e.target.value })}
                    onBlur={() => setTaskEditCell(null)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setTaskEditCell(null); }}
                    className={motion.focusRing}
                    style={{ minWidth: 0, font: '400 12px/1.4 Inter,sans-serif', color: '#464646', border: '1px solid #77469b', borderRadius: 6, padding: '4px 7px', outline: 'none' }}
                  />
                ) : (
                  <span onClick={() => setTaskEditCell({ idx: i, field: 'task' })} className={motion.rowHover} style={{ color: t.task ? '#464646' : '#9aa0a8', cursor: 'text', padding: '3px 6px', margin: '-3px -6px', borderRadius: 5 }}>{t.task || 'Untitled task'}</span>
                )}
                <span style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    onClick={() => setAssignOpenIdx(assignOpenIdx === i ? null : i)}
                    className={motion.pressable}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 6, color: '#6b7178', cursor: 'pointer', flex: 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f6f4fa')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <AssignIcon size={12} />
                  </span>
                  <span style={{ color: '#6b7178', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{t.assignee}</span>
                  {assignOpenIdx === i && (
                    <div className={motion.popIn} style={{ position: 'absolute', left: 0, top: 26, width: 200, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 6, zIndex: 50 }}>
                      <AssignDropdownList assignees={DEFAULT_ASSIGNEES} onSelect={(a) => { updateTask(i, { assignee: a.name }); setAssignOpenIdx(null); }} />
                    </div>
                  )}
                </span>
                {taskEditCell?.idx === i && taskEditCell.field === 'due' ? (
                  <input
                    autoFocus
                    value={t.due}
                    onChange={(e) => updateTask(i, { due: e.target.value })}
                    onBlur={() => setTaskEditCell(null)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setTaskEditCell(null); }}
                    className={motion.focusRing}
                    style={{ minWidth: 0, font: '400 12px/1.4 Inter,sans-serif', color: '#464646', border: '1px solid #77469b', borderRadius: 6, padding: '4px 7px', outline: 'none' }}
                  />
                ) : (
                  <span onClick={() => setTaskEditCell({ idx: i, field: 'due' })} className={motion.rowHover} style={{ color: '#6b7178', cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted' as const, textUnderlineOffset: 2, padding: '3px 6px', margin: '-3px -6px', borderRadius: 5 }}>{t.due}</span>
                )}
                <div style={{ textAlign: 'right', color: t.status === 'Work-station' ? '#5f3880' : '#6b7178' }}>{t.status}</div>
              </div>
            ))}
            <div onClick={addTask} className={`${motion.pressable} ${motion.rowHover}`} style={{ padding: '11px 15px', borderTop: tasks.length > 0 ? '1px solid #f1f2f4' : 'none', font: '400 12px/1 Inter,sans-serif', color: '#6b7178', cursor: 'pointer' }}>+ Add a task</div>
          </div>
          <div style={{ font: '400 11px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 9 }}>Assignees outside Anarix receive their task by email; Anarix users see it in their Work-station.</div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingTop: 16, borderTop: '1px solid #f1f2f4' }}>
          {isSent ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 7, background: '#eef6f3', color: '#3f7d6a', font: '600 12px/1 Inter,sans-serif' }}>
              Sent to client
            </span>
          ) : (
            <span onClick={() => setSent(true)} className={`${motion.pressable} ${motion.btnPrimary}`} style={{ padding: '10px 16px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 12px/1 Inter,sans-serif', cursor: 'pointer' }}>Send MOM to client</span>
          )}
          <span onClick={onGoWorkstation} className={motion.pressable} style={{ marginLeft: 'auto', font: '600 12px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer', textDecoration: 'none' }} onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')} onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>See my tasks</span>
        </div>
      </div>
    </div>
    </div>
  );
}
