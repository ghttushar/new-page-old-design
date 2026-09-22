import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import DiamondMascot from '@/app/components/common/diamond-mascot/diamond-mascot';
import { WORKSTATION_TASKS, PROTOTYPE_ALERTS, MEETING_LIST, MEETING_DETAILS, JIVA_ACTIVITY, type PrototypeAlert, type WorkstationTask, type MeetingListItem } from '@/constants/signals/prototype-data';
import { AlertBadgeRow } from '../signals/alerts/alert-badge-row';
import { formatAlertValue, explainAlertValue } from '../signals/alerts/format-money';
import { getDisplayItems } from '../signals/alerts/items-util';
import { ItemsModal } from '../signals/alerts/items-modal';
import { ValueInfoIcon } from '../signals/alerts/value-info-icon';
import { CheckIcon, SparkleIcon, AiDraftBadge, ThumbUpIcon, ThumbDownIcon, CloseIcon } from '../signals/alerts/icons';
import { ACTION_TYPES, ACTION_CATEGORIES, type ActionType } from '@/constants/signals/action-types.constants';
import type { EntryMeta } from './signals-next-overview';
import scrollStyles from '../signals/alerts/alerts-scroll.module.scss';
import motion from '../signals/alerts/motion.module.scss';

interface Suggestion { alertId: string; label: string; category: string }

interface ChatMessage {
  id: string;
  from: 'user' | 'jiva';
  kind?: 'text' | 'pill' | 'alertCard';
  text: string;
  alertId?: string;
  suggestion?: Suggestion;
  feedback?: 'up' | 'down';
  feedbackNote?: string;
  feedbackSubmitted?: boolean;
}

type MascotPhase = 'dock-idle' | 'dock-typing' | 'generating';

const SUGGESTIONS = ["Let's start with alerts", 'Review my tasks', 'Prep for my next meeting', 'Schedule a meeting'];
/** Fixed key the brief block is registered under in `msgRefs`, so the chat rail can jump back to it like any other entry. */
const BRIEF_KEY = 'brief';

function rectCenterRelativeTo(el: HTMLElement, container: HTMLElement) {
  const c = container.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  return { top: r.top - c.top + r.height / 2, left: r.left - c.left + r.width / 2 };
}

function taskDetailReply(t: WorkstationTask): string {
  return `${t.description} It's assigned to ${t.assignee}, due ${t.due}${t.overdue ? ' (overdue)' : ''}.`;
}

function meetingDetailReply(m: MeetingListItem): string {
  const d = MEETING_DETAILS[m.id];
  if (d) {
    const names = d.attendees.map((a) => a.name).join(', ');
    return `${d.agenda} Attendees: ${names}.`;
  }
  return `${m.timeRange} with ${m.account}. ${m.tasksCompleted}/${m.tasksTotal} prep task${m.tasksTotal === 1 ? '' : 's'} done so far.`;
}

function nextAlertInCategory(current: PrototypeAlert, excludeIds: Set<string>): PrototypeAlert | null {
  return PROTOTYPE_ALERTS.find((a) => a.day === 'today' && a.category === current.category && a.id !== current.id && !excludeIds.has(a.id)) ?? null;
}

/** Static coral square left behind by a completed reply — the mascot itself has already travelled back to dock. */
function SquareMark() {
  return (
    <span style={{ flex: 'none', marginTop: 2, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: '16%',
          background: 'radial-gradient(circle at 50% 38%, #f88a93 0%, #f57780 42%, #f46d76 78%, #f05e6a 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22)',
        }}
      />
    </span>
  );
}

/** The "Action taken"/"Dismissed" chip left in the thread when an alert is resolved from inside the conversation — same idea as Work-station's completion pill. */
function CompletionPill({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '2px 0' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, background: '#eef6f3', font: '700 10.5px/1.4 Inter,sans-serif', letterSpacing: '0.02em', color: '#3f7d6a' }}>
        <CheckIcon size={9} color="#3f7d6a" /> {text}
      </span>
    </div>
  );
}

const isGenerativeAction = (a: ActionType) => a.isEmailAction || a.isImageAction;

/** Category-grouped rows for one half (generative or non-generative) of the action-type list. */
function ActionTypeGroups({ items, onPick }: { items: ActionType[]; onPick: (a: ActionType) => void }) {
  const groups = ACTION_CATEGORIES.map((cat) => ({ cat, items: items.filter((a) => a.category === cat) })).filter((g) => g.items.length > 0);
  return (
    <>
      {groups.map((g) => (
        <div key={g.cat}>
          <div style={{ padding: '9px 18px 5px', font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#9aa0a8', background: '#fafbfd' }}>{g.cat}</div>
          {g.items.map((a) => (
            <div key={a.id} onClick={() => onPick(a)} className={motion.rowHover} style={{ padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <span style={{ flex: 1, minWidth: 0, font: '500 12px/1.5 Inter,sans-serif', color: '#3d434b' }}>{a.label}</span>
              {a.isEmailAction && <span style={{ flex: 'none', padding: '2px 7px', borderRadius: 4, background: '#f3eefa', font: '600 9px/1.5 Inter,sans-serif', color: '#5f3880' }}>EMAIL</span>}
              {a.isImageAction && <span style={{ flex: 'none', padding: '2px 7px', borderRadius: 4, background: '#eef6f3', font: '600 9px/1.5 Inter,sans-serif', color: '#3f7d6a' }}>IMAGE GEN</span>}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

/**
 * Lightweight stand-in for the real `ActionPicker` — same data (`ACTION_TYPES`/
 * `ACTION_CATEGORIES`), same search+grouped-list look, but a single click just picks the
 * type and closes. No note/due-date/assignee form and no email/image sub-flows — this is
 * purely a manual override so a specific person can trigger a specific flow to preview,
 * not a real task-logging form.
 *
 * Split into two top-level sections — Generative (drafts something: an email or an
 * image, `isEmailAction`/`isImageAction`) and Non-generative (everything else — logging,
 * investigating, coordinating, escalating) — since those are functionally different
 * kinds of "action" even though the real picker lists them all flat.
 */
function ActionTypePicker({ alertTitle, onPick, onClose }: { alertTitle: string; onPick: (a: ActionType) => void; onClose: () => void }) {
  const [search, setSearch] = useState('');
  const q = search.trim().toLowerCase();
  const filtered = q ? ACTION_TYPES.filter((a) => a.label.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)) : ACTION_TYPES;
  const generative = filtered.filter(isGenerativeAction);
  const nonGenerative = filtered.filter((a) => !isGenerativeAction(a));

  return (
    <div className={motion.backdropIn} style={{ position: 'fixed', inset: 0, background: 'rgba(20,24,33,.44)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 220 }} onClick={onClose}>
      <div className={motion.overlayIn} onClick={(e) => e.stopPropagation()} style={{ width: 460, maxHeight: '76vh', background: '#fff', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '15px 18px', borderBottom: '1px solid #e6e8ec', flex: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ font: '700 14px/1 Inter,sans-serif', color: '#23272d' }}>Choose an action type</span>
            <span onClick={onClose} className={motion.pressable} style={{ display: 'flex', marginLeft: 'auto', cursor: 'pointer', padding: '0 4px' }}><CloseIcon size={13} /></span>
          </div>
          <div style={{ font: '400 11.5px/1.5 Inter,sans-serif', color: '#6b7178', marginTop: 4 }}>{alertTitle}</div>
        </div>
        <div style={{ padding: '11px 18px', borderBottom: '1px solid #f1f2f4', flex: 'none' }}>
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
          {generative.length === 0 && nonGenerative.length === 0 && (
            <div style={{ padding: '28px 18px', textAlign: 'center' as const, font: '400 12px/1.6 Inter,sans-serif', color: '#6b7178' }}>No action types match "{search}".</div>
          )}
          {generative.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '11px 18px 6px' }}>
                <SparkleIcon size={10} />
                <span style={{ font: '700 10.5px/1 Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#5f3880' }}>Generative</span>
              </div>
              <ActionTypeGroups items={generative} onPick={onPick} />
            </>
          )}
          {nonGenerative.length > 0 && (
            <>
              <div style={{ padding: '11px 18px 6px' }}>
                <span style={{ font: '700 10.5px/1 Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Non-generative</span>
              </div>
              <ActionTypeGroups items={nonGenerative} onPick={onPick} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * The full alert detail card, inline in the Jiva thread — same content as the real
 * Alerts detail panel (badges, value, Jiva's analysis, the strategy picker, affected
 * items), minus the "Ask Jiva" strategy option (redundant — you're already talking to
 * Jiva) and the Assign/Share/Rate footer (that's page chrome, not part of the decision).
 * Execute and Dismiss stay, in the same place, plus a third "Action type" button that
 * opens the full action-type catalog (same list as the real `ActionPicker`) so a
 * specific type can be picked manually to trigger that flow, instead of only the alert's
 * own 1-3 canned strategies.
 */
function AlertDetailCard({ alert, alreadyActioned, onExecute, onDismiss }: { alert: PrototypeAlert; alreadyActioned: boolean; onExecute: (label: string) => void; onDismiss: () => void }) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [customAction, setCustomAction] = useState<ActionType | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [acted, setActed] = useState<'executed' | 'dismissed' | null>(alreadyActioned ? 'executed' : null);
  const [itemsOpen, setItemsOpen] = useState(false);

  // Most alerts have one or more real strategies plus the generic "Ask Jiva" catch-all —
  // drop the catch-all since it's redundant in-chat. A handful of purely informational
  // alerts (nothing to do, already resolved) have ONLY the catch-all — for those, fall
  // back to keeping it rather than leaving the picker empty with a dead Execute button.
  const realOptions = alert.options.filter((o) => !o.isOther);
  const hasStrategy = realOptions.length > 0;
  const options = hasStrategy ? realOptions : alert.options;
  const optId = selectedOptionId || (options.find((o) => o.recommended) || options[0])?.id;
  const picked = customAction ? { id: 'custom', label: customAction.label } : options.find((o) => o.id === optId);
  const valueColor = alert.valueNum < 0 ? '#b3453f' : '#3f7d6a';

  const pickBuiltIn = (id: string) => {
    if (acted) return;
    setCustomAction(null);
    setSelectedOptionId(id);
  };
  const pickCustom = (a: ActionType) => {
    setCustomAction(a);
    setPickerOpen(false);
  };

  const handleExecute = () => {
    if (acted) return;
    setActed('executed');
    onExecute(picked?.label ?? 'the recommended action');
  };
  const handleDismiss = () => {
    if (acted) return;
    setActed('dismissed');
    onDismiss();
  };

  return (
    <div style={{ width: '100%', maxWidth: 560, background: 'linear-gradient(165deg, rgba(119,70,155,.045), #fff 46%)', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden', opacity: acted ? 0.72 : 1, transition: 'opacity 200ms ease-out' }}>
      <div style={{ padding: '15px 17px', borderBottom: '1px solid #f1f2f4' }}>
        <AlertBadgeRow al={alert} size={17} showAccount />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginTop: 10 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ font: '600 14.5px/1.35 Inter,sans-serif', color: '#23272d' }}>{alert.title}</div>
            <div style={{ font: '400 11.5px/1.55 Inter,sans-serif', color: '#6b7178', marginTop: 5 }}>
              {alert.subheader}
              {alert.itemsCount > 0 && <> · <span style={{ fontWeight: 600, color: '#464646' }}>{alert.itemsBreakdown}</span></>}
            </div>
          </div>
          {!alert.hideValue && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 3, flex: 'none' }}>
              <div style={{ font: '600 17px/1 Inter,sans-serif', color: valueColor }}>{formatAlertValue(alert.valueNum)}</div>
              <ValueInfoIcon label={explainAlertValue(alert)} size={11} />
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '13px 17px', display: 'flex', flexDirection: 'column', gap: 13 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <SparkleIcon size={10} />
            <span style={{ font: '600 9.5px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#9aa0a8' }}>Jiva's analysis</span>
          </div>
          <div style={{ font: '400 12.5px/1.6 Inter,sans-serif', color: '#464646' }}>{alert.why}</div>
          <div style={{ font: '400 12.5px/1.6 Inter,sans-serif', color: '#464646', marginTop: 4 }}>{alert.root}</div>
        </div>

        <div style={{ border: '1.5px solid #77469b', borderRadius: 8, overflow: 'hidden', boxShadow: '0 0 0 3px rgba(119,70,155,0.07)' }}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid #eee3f6', background: '#fbfafd' }}>
            <span style={{ font: '600 11.5px/1 Inter,sans-serif', color: '#23272d' }}>Suggested actions</span>
            {!hasStrategy && <span style={{ marginLeft: 8, font: '400 10.5px/1 Inter,sans-serif', color: '#9aa0a8' }}>No strategy needed — informational</span>}
          </div>
          {customAction && (
            <div style={{ padding: '11px 12px', borderBottom: '1px solid #f1f2f4', display: 'flex', gap: 10, alignItems: 'flex-start', background: '#fbfafd' }}>
              <span style={{ width: 13, height: 13, borderRadius: '50%', border: '4px solid #77469b', flex: 'none', marginTop: 2 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' as const }}>
                  <span style={{ font: '600 11.5px/1.4 Inter,sans-serif', color: '#23272d' }}>{customAction.label}</span>
                  <span style={{ padding: '2px 7px', borderRadius: 4, background: '#eef0f3', font: '600 9px/1 Inter,sans-serif', color: '#6b7178' }}>{customAction.category}</span>
                </span>
              </div>
              {!acted && (
                <span onClick={() => setCustomAction(null)} className={motion.pressable} style={{ display: 'flex', cursor: 'pointer', color: '#9aa0a8', flex: 'none' }}><CloseIcon size={11} /></span>
              )}
            </div>
          )}
          {options.map((o) => (
            <div
              key={o.id}
              onClick={() => pickBuiltIn(o.id)}
              className={acted ? undefined : motion.rowHover}
              style={{ padding: '11px 12px', borderBottom: '1px solid #f1f2f4', display: 'flex', gap: 10, alignItems: 'flex-start', cursor: acted ? 'default' : 'pointer', background: !customAction && optId === o.id ? '#fbfafd' : '#fff' }}
            >
              <span style={{ width: 13, height: 13, borderRadius: '50%', border: !customAction && optId === o.id ? '4px solid #77469b' : '1px solid #dfe3ea', flex: 'none', marginTop: 2, transition: 'border 140ms ease-out' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' as const }}>
                  <span style={{ font: '600 11.5px/1.4 Inter,sans-serif', color: '#23272d' }}>{o.label}</span>
                  {o.recommended && <AiDraftBadge label="Jiva recommends" />}
                </span>
                {(o.expected || o.confidence !== undefined) && (
                  <div style={{ font: '400 10.5px/1.4 Inter,sans-serif', color: '#9aa0a8', marginTop: 3 }}>
                    {o.expected ? `Est. ${o.expected}` : ''}{o.expected && o.confidence !== undefined ? ' · ' : ''}{o.confidence !== undefined ? `${o.confidence}% confidence` : ''}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div style={{ padding: '11px 12px', display: 'flex', alignItems: 'center', gap: 8, background: '#fafbfd' }}>
            <span
              onClick={handleExecute}
              className={acted ? undefined : `${motion.pressable} ${motion.btnPrimary}`}
              style={{ padding: '8px 14px', borderRadius: 7, background: acted === 'executed' ? '#5c9e85' : '#77469b', color: '#fff', font: '600 11px/1 Inter,sans-serif', cursor: acted ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: acted && acted !== 'executed' ? 0.5 : 1 }}
            >
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {acted === 'executed' ? 'Executed' : 'Execute'}
            </span>
            <span
              onClick={handleDismiss}
              className={acted ? undefined : motion.btnSecondary}
              style={{ padding: '7px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '500 11px/1 Inter,sans-serif', color: acted === 'dismissed' ? '#9aa0a8' : '#3d434b', cursor: acted ? 'default' : 'pointer', opacity: acted && acted !== 'dismissed' ? 0.5 : 1 }}
            >
              {acted === 'dismissed' ? 'Dismissed' : 'Dismiss'}
            </span>
            <span
              onClick={() => !acted && setPickerOpen(true)}
              className={acted ? undefined : motion.pressable}
              style={{ marginLeft: 'auto', padding: '7px 12px', borderRadius: 7, font: '500 11px/1 Inter,sans-serif', color: acted ? '#c3c7cd' : '#77469b', cursor: acted ? 'default' : 'pointer' }}
            >
              Action type ▾
            </span>
          </div>
        </div>

        {alert.items.length > 0 && (
          <div style={{ border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '10px 12px', borderBottom: '1px solid #f1f2f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ font: '600 11.5px/1 Inter,sans-serif', color: '#23272d' }}>Affected items</span>
              <span style={{ font: '400 10.5px/1 Inter,sans-serif', color: '#6b7178' }}>{alert.itemsCount} total</span>
            </div>
            {getDisplayItems(alert).slice(0, 4).map((it, i) => (
              <div key={i} style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #f1f2f4' }}>
                <span style={{ flex: 1, minWidth: 0, font: '400 11.5px/1.4 Inter,sans-serif', color: '#464646', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{it.name}</span>
                <span style={{ font: '600 11.5px/1 Inter,sans-serif', color: it.color, flex: 'none' }}>{it.impact}</span>
              </div>
            ))}
            <div onClick={() => setItemsOpen(true)} className={motion.rowHover} style={{ padding: '9px 12px', cursor: 'pointer' }}>
              <span style={{ font: '600 10.5px/1 Inter,sans-serif', color: '#77469b' }}>Show all {alert.itemsCount} →</span>
            </div>
          </div>
        )}
      </div>

      {itemsOpen && createPortal(
        <ItemsModal items={getDisplayItems(alert)} itemCount={alert.itemsCount} breakdown={alert.itemsBreakdown} onClose={() => setItemsOpen(false)} />,
        document.body,
      )}

      {pickerOpen && createPortal(
        <ActionTypePicker alertTitle={alert.title} onPick={pickCustom} onClose={() => setPickerOpen(false)} />,
        document.body,
      )}
    </div>
  );
}

/** "How did Jiva do?" after every reply — thumbs up/down, same as the real Alerts detail panel's "Rate these results" footer. Thumbs-down reveals a "tell us more" note. */
function ResponseFeedback({ m, onRate, onNoteChange, onSubmitNote }: { m: ChatMessage; onRate: (v: 'up' | 'down') => void; onNoteChange: (v: string) => void; onSubmitNote: () => void }) {
  if (m.feedbackSubmitted) {
    return <div style={{ marginTop: 7, font: '400 10.5px/1 Inter,sans-serif', color: '#9aa0a8' }}>Thanks for the feedback.</div>;
  }
  return (
    <div style={{ marginTop: 7 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ font: '400 10.5px/1 Inter,sans-serif', color: '#9aa0a8' }}>How did Jiva do?</span>
        <span onClick={() => onRate('up')} className={motion.pressable} style={{ display: 'flex', cursor: 'pointer' }}>
          <ThumbUpIcon size={14} color={m.feedback === 'up' ? '#3f7d6a' : '#9aa0a8'} />
        </span>
        <span onClick={() => onRate('down')} className={motion.pressable} style={{ display: 'flex', cursor: 'pointer' }}>
          <ThumbDownIcon size={14} color={m.feedback === 'down' ? '#b3453f' : '#9aa0a8'} />
        </span>
      </div>
      {m.feedback === 'down' && (
        <div className={motion.contentFadeIn} style={{ display: 'flex', gap: 6, marginTop: 7 }}>
          <input
            autoFocus
            value={m.feedbackNote ?? ''}
            onChange={(e) => onNoteChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSubmitNote(); }}
            placeholder="Tell us more"
            className={motion.focusRing}
            style={{ flex: 1, minWidth: 0, padding: '6px 9px', border: '1px solid #dfe3ea', borderRadius: 6, font: '400 11px/1 Inter,sans-serif', outline: 'none' }}
          />
          <span onClick={onSubmitNote} className={motion.pressable} style={{ padding: '6px 12px', borderRadius: 6, background: '#77469b', color: '#fff', font: '600 11px/1 Inter,sans-serif', cursor: 'pointer', flex: 'none' }}>
            Send
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * ChatGPT-style right-edge conversation rail — one compact marker per user prompt, kept
 * out of the way at rest. Hovering the rail opens a searchable flyout of every prompt in
 * the thread; clicking a marker or a list row smooth-scrolls the thread to it.
 */
function ChatRail({ items, onJump }: { items: { id: string; text: string }[]; onJump: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const [query, setQuery] = useState('');
  if (items.length < 2) return null;

  const q = query.trim().toLowerCase();
  const filtered = q ? items.filter((it) => it.text.toLowerCase().includes(q)) : items;
  const gap = Math.max(3, Math.min(9, 220 / items.length));

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setQuery(''); }}
      style={{ position: 'absolute', right: 6, top: 0, bottom: 0, width: 20, display: 'flex', alignItems: 'center', zIndex: 20 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap }}>
        {items.map((it) => (
          <span
            key={it.id}
            onClick={() => onJump(it.id)}
            style={{ display: 'block', cursor: 'pointer', borderRadius: 2, width: hovered ? 14 : 7, height: 3, background: hovered ? '#c3b3d6' : '#e6ddf0', transition: 'width 160ms ease-out, background 160ms ease-out' }}
          />
        ))}
      </div>
      {hovered && (
        <div
          className={motion.popIn}
          onMouseDown={(e) => e.stopPropagation()}
          style={{ position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 10, width: 260, maxHeight: 360, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, boxShadow: '0 12px 28px rgba(20,24,33,.18)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        >
          <div style={{ padding: 9, borderBottom: '1px solid #eceef1', flex: 'none' }}>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search this conversation"
              className={motion.focusRing}
              style={{ width: '100%', padding: '7px 9px', border: '1px solid #dfe3ea', borderRadius: 6, font: '400 11.5px/1 Inter,sans-serif', outline: 'none' }}
            />
          </div>
          <div style={{ overflowY: 'auto', padding: 6 }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '10px 8px', font: '400 11.5px/1.5 Inter,sans-serif', color: '#9aa0a8' }}>No matches.</div>
            ) : filtered.map((it) => (
              <div
                key={it.id}
                onClick={() => onJump(it.id)}
                className={motion.rowHover}
                style={{ padding: '8px 9px', borderRadius: 7, cursor: 'pointer', font: '500 12px/1.4 Inter,sans-serif', color: '#3d434b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}
              >
                {it.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function formatAbsMoney(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return '$' + (abs / 1_000_000).toFixed(2) + 'M';
  if (abs >= 1000) return '$' + (abs / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return '$' + abs.toLocaleString();
}

/** One of the four "at a glance" numbers at the top of the brief — a real, computed figure, not narrative text. */
function StatTile({ label, value, valueColor, sub, accent, onClick }: { label: string; value: string; valueColor?: string; sub: string; accent: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={onClick ? motion.cardHover : undefined}
      style={{ background: '#fff', border: '1px solid #e6e8ec', borderTop: `2.5px solid ${accent}`, borderRadius: 9, padding: '13px 14px 12px', boxShadow: '0 1px 2px rgba(20,24,33,.03)', cursor: onClick ? 'pointer' : 'default' }}
    >
      <div style={{ font: '600 9.5px/1 Inter,sans-serif', letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: '#9aa0a8' }}>{label}</div>
      <div style={{ font: '700 21px/1 Inter,sans-serif', color: valueColor ?? '#23272d', marginTop: 8 }}>{value}</div>
      <div style={{ font: '400 10.5px/1.4 Inter,sans-serif', color: '#9aa0a8', marginTop: 4 }}>{sub}</div>
    </div>
  );
}

/** A real "while you were away" activity row — what Jiva actually did overnight, not a generic summary line. Clicking one linked to an alert opens that alert's full detail card, same as clicking it in the overview. */
function ActivityRow({ item, last, onClick }: { item: (typeof JIVA_ACTIVITY)[number]; last: boolean; onClick: () => void }) {
  return (
    <div onClick={onClick} className={motion.rowHover} style={{ padding: '12px 14px', borderBottom: last ? 'none' : '1px solid #f1f2f4', display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' as const }}>
          <span style={{ font: '600 12.5px/1.4 Inter,sans-serif', color: '#23272d' }}>{item.label}</span>
          {item.status === 'done' ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 4, background: '#eef6f3', font: '600 9px/1.5 Inter,sans-serif', color: '#3f7d6a', flex: 'none' }}>✓ Handled</span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 4, background: '#fdf3e8', font: '600 9px/1.5 Inter,sans-serif', color: '#a8763f', flex: 'none' }}>Needs review</span>
          )}
        </div>
        <div style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#8a919b', marginTop: 3 }}>{item.detail} · {item.time}</div>
      </div>
      {item.impact && <span style={{ font: '600 12px/1 Inter,sans-serif', color: item.impactColor || '#464646', flex: 'none' }}>{item.impact}</span>}
    </div>
  );
}

/** A single "Today's schedule" row inside the brief — folded into the main scroll column instead of a separate persistent sidebar, since the whole brief now lives inline at the top of the chat. */
function ScheduleRow({ m, last }: { m: MeetingListItem; last: boolean }) {
  const detail = MEETING_DETAILS[m.id];
  return (
    <div style={{ padding: '11px 14px', borderBottom: last ? 'none' : '1px solid #f1f2f4', display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{ font: '600 11px/1.3 Inter,sans-serif', color: '#77469b', flex: 'none', width: 78 }}>{m.timeRange}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: '600 12.5px/1.4 Inter,sans-serif', color: '#23272d' }}>{m.title}</div>
        <div style={{ font: '400 11px/1.4 Inter,sans-serif', color: '#9aa0a8', marginTop: 2 }}>{m.account}</div>
      </div>
      {detail && (
        <div style={{ flex: 'none', width: 84 }}>
          <div style={{ height: 3, borderRadius: 2, background: '#f1f2f4', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', background: detail.resolvedColor, transform: `scaleX(${detail.resolvedPct / 100})`, transformOrigin: 'left' }} />
          </div>
          <div style={{ font: '500 10px/1 Inter,sans-serif', color: '#9aa0a8', marginTop: 4, textAlign: 'right' as const }}>{detail.resolvedPct}% prepared</div>
        </div>
      )}
    </div>
  );
}

/**
 * The brief — real stat tiles, the "while you were away" activity feed, and today's
 * schedule, all folded into one card stack. This is no longer a separate full-screen
 * mode: it's the permanent first item in the chat thread (see `BRIEF_KEY` below), so it
 * scrolls up and out of view as the conversation grows but is always still there to
 * scroll back up to, same as any other message.
 */
function BriefHero({ onPrefill, onEnterAlert }: { onPrefill: (text: string) => void; onEnterAlert: (alertId: string) => void }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const todayAlerts = PROTOTYPE_ALERTS.filter((a) => a.day === 'today');
  const criticalToday = todayAlerts.filter((a) => a.priority === 'High').length;
  const atRiskTotal = todayAlerts.filter((a) => a.valueNum < 0).reduce((sum, a) => sum + Math.abs(a.valueNum), 0);
  const verifiedGain = JIVA_ACTIVITY.filter((j) => j.status === 'done' && j.impact?.startsWith('+')).reduce((sum, j) => sum + (parseInt(j.impact!.replace(/[^0-9]/g, ''), 10) || 0), 0);
  const todayMeetings = MEETING_LIST.filter((m) => m.isToday);
  const unprepped = todayMeetings.filter((m) => (MEETING_DETAILS[m.id]?.resolvedPct ?? 100) < 100).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 6 }}>
      <DiamondMascot size={42} interactive />
      <div style={{ font: '700 17px/1.3 Inter,sans-serif', color: '#23272d', marginTop: 10, textAlign: 'center' as const }}>{greeting}. Here's where things stand.</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, width: '100%', marginTop: 18 }}>
        <StatTile
          label="Critical alerts"
          value={String(criticalToday)}
          valueColor={criticalToday > 0 ? '#b3453f' : undefined}
          sub={`of ${todayAlerts.length} today`}
          accent="#b3453f"
          onClick={() => onPrefill(`Walk me through today's ${criticalToday} high-priority alerts.`)}
        />
        <StatTile
          label="At risk"
          value={formatAbsMoney(atRiskTotal)}
          valueColor="#b3453f"
          sub="across today's alerts"
          accent="#b3453f"
          onClick={() => onPrefill(`Show me what's driving the ${formatAbsMoney(atRiskTotal)} at risk today.`)}
        />
        <StatTile
          label="Verified gain"
          value={formatAbsMoney(verifiedGain)}
          valueColor="#3f7d6a"
          sub="handled autonomously"
          accent="#3f7d6a"
          onClick={() => onPrefill('Tell me what you handled autonomously overnight.')}
        />
        <StatTile
          label="Meetings today"
          value={String(todayMeetings.length)}
          sub={unprepped > 0 ? `${unprepped} unprepared` : 'all prepped'}
          accent="#77469b"
          onClick={() => onPrefill(`Help me prep for today's ${todayMeetings.length} meetings.`)}
        />
      </div>

      {JIVA_ACTIVITY.length > 0 && (
        <div style={{ width: '100%', marginTop: 14, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 14px', borderBottom: '1px solid #f1f2f4', background: '#fafbfd' }}>
            <SparkleIcon size={11} />
            <span style={{ font: '700 11px/1 Inter,sans-serif', color: '#23272d' }}>While you were away</span>
          </div>
          {JIVA_ACTIVITY.map((j, i) => (
            <ActivityRow key={j.id} item={j} last={i === JIVA_ACTIVITY.length - 1} onClick={() => (j.alertId ? onEnterAlert(j.alertId) : onPrefill(j.label))} />
          ))}
        </div>
      )}

      {todayMeetings.length > 0 && (
        <div style={{ width: '100%', marginTop: 14, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #f1f2f4', background: '#fafbfd' }}>
            <span style={{ font: '700 11px/1 Inter,sans-serif', color: '#23272d' }}>Today's schedule</span>
          </div>
          {todayMeetings.map((m, i) => (
            <ScheduleRow key={m.id} m={m} last={i === todayMeetings.length - 1} />
          ))}
        </div>
      )}

      <div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#9aa0a8', marginTop: 16, textAlign: 'center' as const }}>
        You can also ask me to schedule a meeting, add a task or to-do, or just tell me where to start — I'll take it from there.
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, justifyContent: 'center' as const, gap: 8, marginTop: 12 }}>
        {SUGGESTIONS.map((s) => (
          <span
            key={s}
            onClick={() => onPrefill(s)}
            className={`${motion.pressable} ${motion.btnSecondary}`}
            style={{ padding: '7px 13px', borderRadius: 999, border: '1px solid #e6ddf0', font: '500 12px/1 Inter,sans-serif', color: '#5f3880', cursor: 'pointer', background: '#fbfafd' }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

interface Props {
  entryContext: string | null;
  entryNonce: number;
  entryMeta: EntryMeta | null;
  actionTakenAlertIds: Set<string>;
  onAlertActioned: (id: string) => void;
  /** Reflects the alert currently in focus back to the overview row (same "selected" treatment as the real Alerts row), so the left column always shows what the conversation is about. */
  onSelectAlert: (id: string | null) => void;
}

/**
 * The right column — Jiva. First visit of the session lands on a centered brief;
 * afterward (or once a message is sent) it's a normal docked chat, capped to a readable
 * width with a ChatGPT-style prompt rail in the reserved right gutter. One roaming mascot
 * lives at the top-left of the composer, rounds slightly while the user types, travels to
 * wherever a reply is being generated and becomes a circle, then leaves a static square
 * marker on that reply and travels back to dock once it's done.
 *
 * Entering from an alert card gets the full detail card (same content as the real Alerts
 * detail panel — badges, value, Jiva's analysis, strategy options, affected items) inline
 * in the reply. Clicking Execute or Dismiss on it drives the same action-taken flow as
 * before: a completion pill in the thread, the alert greyed out on the left, and the next
 * alert in the same category suggested.
 */
export function SignalsNextJiva({ entryContext, entryNonce, entryMeta, actionTakenAlertIds, onAlertActioned, onSelectAlert }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [thinkingLabel, setThinkingLabel] = useState('Thinking…');
  const [phase, setPhase] = useState<MascotPhase>('dock-idle');
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const [pendingDetailFor, setPendingDetailFor] = useState<EntryMeta | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const msgRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const moveToDock = () => {
    if (!stageRef.current || !dockRef.current) return;
    setPos(rectCenterRelativeTo(dockRef.current, stageRef.current));
  };

  useLayoutEffect(() => {
    moveToDock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (phase !== 'generating') moveToDock();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Nothing to scroll to yet — leave the top of the brief in view instead of
    // jumping straight to its bottom edge.
    if (messages.length === 0) return;
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    setPhase((p) => (p === 'generating' ? p : draft.trim() ? 'dock-typing' : 'dock-idle'));
  }, [draft]);

  useEffect(() => {
    if (entryNonce > 0 && entryContext) {
      setDraft(entryContext);
      setPendingDetailFor(entryMeta ?? null);
      if (entryMeta?.kind === 'alert') onSelectAlert(entryMeta.id);
      else if (entryMeta) onSelectAlert(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entryNonce]);

  const reply = (text: string): string => {
    const q = text.toLowerCase();
    if (q.includes('alert')) return `You have ${PROTOTYPE_ALERTS.filter((a) => a.day === 'today').length} alerts today. Want me to walk you through the highest-priority one first?`;
    if (q.includes('task') || q.includes('todo') || q.includes('to-do')) return `Here's where things stand: ${WORKSTATION_TASKS.filter((t) => t.status !== 'done').length} open tasks. Tell me which one to start, or I can pick the most urgent.`;
    if (q.includes('meeting') || q.includes('prep')) return `${MEETING_LIST.filter((m) => m.isToday).length} meetings today. I can pull the agenda and open items for whichever one you want to prep for.`;
    if (q.includes('schedule')) return "Tell me who it's with, roughly when, and whether it's online or in person, and I'll get it on the calendar.";
    return `Got it — I've noted that: "${text}". Tell me more about what you'd like me to do with it.`;
  };

  const enterSuggestedAlert = (id: string) => {
    const al = PROTOTYPE_ALERTS.find((a) => a.id === id);
    if (!al) return;
    setDraft(`Tell me about the alert "${al.title}" on ${al.account}.`);
    setPendingDetailFor({ kind: 'alert', id: al.id });
    onSelectAlert(al.id);
  };

  // Stable identity — an inline function here would make React detach/reattach this ref
  // (and re-run its body) on every render while the typing indicator is mounted, looping forever.
  const genRefCb = useCallback((el: HTMLDivElement | null) => {
    if (el && stageRef.current) {
      setPos(rectCenterRelativeTo(el, stageRef.current));
      setPhase('generating');
    }
  }, []);

  const submit = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setMessages((prev) => [...prev, { id: `u${Date.now()}`, from: 'user', text: clean }]);
    setDraft('');

    const currentPendingDetail = pendingDetailFor;
    setThinkingLabel(currentPendingDetail ? 'Pulling up the details…' : 'Thinking…');
    setTyping(true);

    window.setTimeout(() => {
      setTyping(false);
      const next: ChatMessage[] = [];

      if (currentPendingDetail?.kind === 'alert') {
        const al = PROTOTYPE_ALERTS.find((a) => a.id === currentPendingDetail.id);
        if (al) next.push({ id: `c${Date.now()}`, from: 'jiva', kind: 'alertCard', text: '', alertId: al.id });
        else next.push({ id: `j${Date.now()}`, from: 'jiva', text: reply(clean) });
      } else if (currentPendingDetail?.kind === 'task') {
        const t = WORKSTATION_TASKS.find((tt) => tt.id === currentPendingDetail.id);
        next.push({ id: `j${Date.now()}`, from: 'jiva', text: t ? taskDetailReply(t) : reply(clean) });
      } else if (currentPendingDetail?.kind === 'meeting') {
        const m = MEETING_LIST.find((mm) => mm.id === currentPendingDetail.id);
        next.push({ id: `j${Date.now()}`, from: 'jiva', text: m ? meetingDetailReply(m) : reply(clean) });
      } else {
        next.push({ id: `j${Date.now()}`, from: 'jiva', text: reply(clean) });
      }
      setPendingDetailFor(null);

      setMessages((prev) => [...prev, ...next]);
      setPhase('dock-idle');
      window.requestAnimationFrame(moveToDock);
    }, currentPendingDetail ? 1300 : 1000);
  };

  const handleAlertAction = (alertId: string, kind: 'executed' | 'dismissed') => {
    const al = PROTOTYPE_ALERTS.find((a) => a.id === alertId);
    if (!al) return;
    setThinkingLabel(kind === 'executed' ? 'Taking action…' : 'Dismissing…');
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      const pillText = kind === 'executed' ? `Action taken · ${al.category}` : `Dismissed · ${al.category}`;
      const doneText = kind === 'executed' ? `Done — I've taken action on "${al.title}".` : `Got it — I've dismissed "${al.title}".`;
      const upcoming = nextAlertInCategory(al, new Set([...actionTakenAlertIds, al.id]));
      setMessages((prev) => [
        ...prev,
        { id: `j${Date.now()}`, from: 'jiva', text: doneText },
        { id: `p${Date.now()}`, from: 'jiva', kind: 'pill', text: pillText },
        upcoming
          ? { id: `s${Date.now()}`, from: 'jiva', text: `Want me to pick up the next ${al.category.toLowerCase()} alert while I'm at it?`, suggestion: { alertId: upcoming.id, label: upcoming.title, category: upcoming.category } }
          : { id: `s${Date.now()}`, from: 'jiva', text: `That's every ${al.category.toLowerCase()} alert handled for today.` },
      ]);
      onAlertActioned(al.id);
      onSelectAlert(upcoming ? upcoming.id : null);
      setPhase('dock-idle');
      window.requestAnimationFrame(moveToDock);
    }, 900);
  };

  const rateMessage = (id: string, value: 'up' | 'down') => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, feedback: value, feedbackSubmitted: value === 'up' } : m)));
  };
  const setNoteFor = (id: string, note: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, feedbackNote: note } : m)));
  };
  const submitNoteFor = (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, feedbackSubmitted: true } : m)));
  };

  const jumpTo = (id: string) => {
    const el = msgRefs.current.get(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const railItems = [{ id: BRIEF_KEY, text: 'Brief' }, ...messages.filter((m) => m.from === 'user').map((m) => ({ id: m.id, text: m.text }))];

  return (
    <div ref={stageRef} style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <div ref={threadRef} className={scrollStyles.sleekScroll} style={{ height: '100%', overflowY: 'auto', padding: '18px 34px 18px 20px' }}>
          <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div ref={(el) => { if (el) msgRefs.current.set(BRIEF_KEY, el); else msgRefs.current.delete(BRIEF_KEY); }}>
              <BriefHero onPrefill={setDraft} onEnterAlert={enterSuggestedAlert} />
            </div>
            {messages.map((m) => {
              if (m.kind === 'pill') {
                  return (
                    <div key={m.id} ref={(el) => { if (el) msgRefs.current.set(m.id, el); else msgRefs.current.delete(m.id); }}>
                      <CompletionPill text={m.text} />
                    </div>
                  );
                }
                if (m.kind === 'alertCard') {
                  const al = PROTOTYPE_ALERTS.find((a) => a.id === m.alertId);
                  if (!al) return null;
                  return (
                    <div
                      key={m.id}
                      ref={(el) => { if (el) msgRefs.current.set(m.id, el); else msgRefs.current.delete(m.id); }}
                      className={motion.contentFadeIn}
                      style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}
                    >
                      <SquareMark />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <AlertDetailCard
                          alert={al}
                          alreadyActioned={actionTakenAlertIds.has(al.id)}
                          onExecute={() => handleAlertAction(al.id, 'executed')}
                          onDismiss={() => handleAlertAction(al.id, 'dismissed')}
                        />
                        <ResponseFeedback
                          m={m}
                          onRate={(v) => rateMessage(m.id, v)}
                          onNoteChange={(v) => setNoteFor(m.id, v)}
                          onSubmitNote={() => submitNoteFor(m.id)}
                        />
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    key={m.id}
                    ref={(el) => { if (el) msgRefs.current.set(m.id, el); else msgRefs.current.delete(m.id); }}
                    className={motion.contentFadeIn}
                    style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexDirection: m.from === 'user' ? 'row-reverse' : 'row' }}
                  >
                    {m.from === 'jiva' && <SquareMark />}
                    <div style={{ maxWidth: '82%' }}>
                      <div
                        style={{
                          padding: '9px 13px', borderRadius: 12,
                          borderTopLeftRadius: m.from === 'jiva' ? 4 : 12,
                          borderTopRightRadius: m.from === 'user' ? 4 : 12,
                          background: m.from === 'user' ? '#77469b' : '#f6f4fa',
                          color: m.from === 'user' ? '#fff' : '#3d2a52',
                          font: '400 13px/1.55 Inter,sans-serif',
                        }}
                      >
                        {m.text}
                        {m.suggestion && (
                          <div
                            onClick={() => enterSuggestedAlert(m.suggestion!.alertId)}
                            className={motion.cardHover}
                            style={{ marginTop: 9, padding: '9px 11px', borderRadius: 9, background: '#fff', border: '1px solid #e6ddf0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9 }}
                          >
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#77469b', flex: 'none' }} />
                            <span style={{ flex: 1, minWidth: 0, font: '600 12px/1.35 Inter,sans-serif', color: '#23272d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{m.suggestion.label}</span>
                            <span style={{ font: '600 10px/1 Inter,sans-serif', color: '#9aa0a8', flex: 'none' }}>{m.suggestion.category}</span>
                          </div>
                        )}
                      </div>
                      {m.from === 'jiva' && (
                        <ResponseFeedback
                          m={m}
                          onRate={(v) => rateMessage(m.id, v)}
                          onNoteChange={(v) => setNoteFor(m.id, v)}
                          onSubmitNote={() => submitNoteFor(m.id)}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
              {typing && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <div ref={genRefCb} style={{ width: 22, height: 22, flex: 'none' }} />
                  <div style={{ padding: '10px 13px', borderRadius: 12, borderTopLeftRadius: 4, background: '#f6f4fa', font: '500 12px/1 Inter,sans-serif', color: '#8a7fa8' }}>{thinkingLabel}</div>
                </div>
              )}
            </div>
          </div>
        <ChatRail items={railItems} onJump={jumpTo} />
      </div>

      <div style={{ padding: '10px 16px 14px', flex: 'none', borderTop: '1px solid #e6e8ec', background: '#fff' }}>
        <div style={{ height: 34, display: 'flex', alignItems: 'center', paddingLeft: 2, marginBottom: 6 }}>
          <div ref={dockRef} style={{ width: 30, height: 30 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit(draft); }}
            placeholder="Ask Jiva anything…"
            className={motion.focusRing}
            style={{ flex: 1, minWidth: 0, padding: '10px 12px', border: '1px solid #dfe3ea', borderRadius: 8, font: '400 12.5px/1 Inter,sans-serif', color: '#3d434b', outline: 'none' }}
          />
          <span
            onClick={() => submit(draft)}
            className={draft.trim() ? `${motion.pressable} ${motion.btnPrimary}` : motion.pressable}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, background: draft.trim() ? '#77469b' : '#eee7f5', flex: 'none', cursor: draft.trim() ? 'pointer' : 'default' }}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M1.5 8h13M9.5 3l5 5-5 5" stroke={draft.trim() ? '#fff' : '#c3b3d6'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </div>
      </div>

      {pos && (
        <div
          style={{
            position: 'absolute', top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)',
            transition: 'top 480ms cubic-bezier(0.22,1,0.36,1), left 480ms cubic-bezier(0.22,1,0.36,1)',
            zIndex: 40, pointerEvents: 'none',
          }}
        >
          <DiamondMascot size={30} state={phase === 'generating' ? 'listening' : 'idle'} rounded={phase === 'dock-typing'} interactive />
        </div>
      )}
    </div>
  );
}
