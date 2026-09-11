import { useEffect, useState } from 'react';
import { PROTOTYPE_ALERTS, type PrototypeAlert, type AlertOption, type LoggedActionItem } from '@/constants/signals/prototype-data';
import { ACTION_TYPES, type ActionType } from '@/constants/signals/action-types.constants';

const GENERIC_SEND_UPDATE = ACTION_TYPES.find((a) => a.id === 'send-report-update')!;
import { ItemsModal } from './items-modal';
import { ActionPicker } from './action-picker';
import { ComposeMail } from './compose-mail';
import { ImageGenStudio } from './image-gen-studio';
import { formatAlertValue, explainAlertValue } from './format-money';
import { getDisplayItems } from './items-util';
import { ValueInfoIcon } from './value-info-icon';
import { AssignDropdownList, AssignPopupModal, DEFAULT_ASSIGNEES, ASSIGN_POPUP_THRESHOLD } from './assign-menu';
import { EmptyAlertGraphic } from './empty-alert-graphic';
import { AlertBadgeRow } from './alert-badge-row';
import { AssignIcon, ShareIcon, ThumbUpIcon, ThumbDownIcon, EnvelopeSmallIcon, WorkspaceSmallIcon } from './icons';
import scrollStyles from './alerts-scroll.module.scss';
import motion from './motion.module.scss';

interface Props {
  alert: PrototypeAlert | null;
  phase: 'view' | 'executing' | 'report' | 'genReview';
  execProgress: number;
  onExecute: () => void;
  onViewReport: () => void;
  onBackToAlerts: () => void;
  onGenReview: () => void;
  onApproveGenReview: () => void;
  onOpenItems: () => void;
  itemsModalOpen: boolean;
  onCloseItems: () => void;
  onLogAction: (item: LoggedActionItem) => void;
  onDismiss: () => void;
  /** Reverses an in-progress Execute — clears the running progress and un-resolves the alert. */
  onUndoExecute?: () => void;
  /** Unused — every alert now renders the same detail layout. Kept optional so existing call sites don't need to change. */
  isFirstAlert?: boolean;
  onOpenAskJiva?: () => void;
  onSelectAlert?: (id: string) => void;
}

export function AlertDetailPanel({ alert: sel, phase, execProgress, onExecute, onViewReport, onBackToAlerts, onGenReview, onApproveGenReview, onOpenItems, itemsModalOpen, onCloseItems, onLogAction, onDismiss, onUndoExecute, onOpenAskJiva, onSelectAlert }: Props) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [detailMenu, setDetailMenu] = useState<'assign' | 'share' | null>(null);
  const [thumb, setThumb] = useState<'up' | 'down' | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [actionPickerOpen, setActionPickerOpen] = useState(false);
  const [assignPopupOpen, setAssignPopupOpen] = useState(false);
  const [emailFor, setEmailFor] = useState<ActionType | null>(null);
  const [imageStudioOpen, setImageStudioOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [lastLogged, setLastLogged] = useState<{ label: string; sent: boolean } | null>(null);

  useEffect(() => {
    setActionPickerOpen(false);
    setAssignPopupOpen(false);
    setEmailFor(null);
    setImageStudioOpen(false);
    setDismissed(false);
  }, [sel?.id]);

  if (!sel) {
    const spotlight = PROTOTYPE_ALERTS.filter((a) => a.priority === 'High').slice(0, 3);
    return (
      <div style={{ flex: 1, minWidth: 0, minHeight: 0, height: '100%', background: 'radial-gradient(circle at 18% 8%, rgba(119,70,155,.06), transparent 45%), #fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
          <EmptyAlertGraphic />
          <div style={{ font: '700 19px/1.4 Inter,sans-serif', color: '#23272d', marginTop: 22 }}>Select an alert to get started</div>
          <div style={{ font: '400 13px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 7, maxWidth: 320, textAlign: 'center' }}>The reasoning, impact and recommended strategy open here.</div>

          {onSelectAlert && spotlight.length > 0 && (
            <div style={{ width: '100%', maxWidth: 380, marginTop: 32 }}>
              <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#9aa0a8', textAlign: 'center' }}>Jump back in</div>
              <div style={{ marginTop: 12, border: '1px solid #eceef1', borderRadius: 10, overflow: 'hidden' }}>
                {spotlight.map((a, i) => (
                  <div
                    key={a.id}
                    onClick={() => onSelectAlert(a.id)}
                    className={motion.rowHover}
                    style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer', borderBottom: i < spotlight.length - 1 ? '1px solid #f1f2f4' : 'none', background: '#fff' }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: a.priorityDot, flex: 'none' }} />
                    <span style={{ flex: 1, minWidth: 0, font: '500 12.5px/1.4 Inter,sans-serif', color: '#3d434b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{a.title}</span>
                    <span style={{ flex: 'none', font: '700 13px/1 Inter,sans-serif', color: a.valueNum < 0 ? '#b3453f' : '#3f7d6a' }}>{formatAlertValue(a.valueNum)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const mappedActionType = sel.mappedActionTypeId ? ACTION_TYPES.find((a) => a.id === sel.mappedActionTypeId) : undefined;
  const money = formatAlertValue;

  const optId = selectedOptionId || (sel.options.find((o) => o.recommended) || sel.options[0])?.id;
  const pickedOption = sel.options.find((o) => o.id === optId);

  const executeLabel = 'Execute';

  const handleExecute = () => {
    if (pickedOption?.kind === 'GENERATIVE') {
      if (pickedOption.generates === 'image') { setImageStudioOpen(true); return; }
      onGenReview();
      return;
    }
    if (pickedOption?.isOther) { onOpenAskJiva?.(); return; }
    if (pickedOption?.isMeetingAsk) { setActionPickerOpen(true); return; }
    onExecute();
  };

  // These local action flows fully replace the panel content — no popups, everything stays in this column.
  if (imageStudioOpen) {
    return (
      <ImageGenStudio
        alert={sel}
        onBack={() => setImageStudioOpen(false)}
        onPublish={() => {
          onLogAction({
            id: `log-${Date.now()}`,
            alertId: sel.id,
            alertTitle: sel.title,
            account: sel.account,
            actionTypeId: mappedActionType?.id ?? 'update-product-images',
            actionTypeLabel: pickedOption?.label ?? 'Generated image published',
            note: 'Generated and published via Image Studio.',
            status: 'logged',
            createdAt: Date.now(),
          });
          setImageStudioOpen(false);
          onExecute();
        }}
      />
    );
  }

  if (actionPickerOpen) {
    return (
      <ActionPicker
        alert={sel}
        variant="inline"
        initialSearch={mappedActionType?.label}
        onClose={() => setActionPickerOpen(false)}
        onRequestEmail={(actionType) => { setActionPickerOpen(false); setEmailFor(actionType); }}
        onRequestImageGen={() => { setActionPickerOpen(false); setImageStudioOpen(true); }}
        onSave={(actionType, note, dueDate, assignee) => {
          onLogAction({
            id: `log-${Date.now()}`,
            alertId: sel.id,
            alertTitle: sel.title,
            account: sel.account,
            actionTypeId: actionType.id,
            actionTypeLabel: actionType.label,
            note,
            dueDate: dueDate || undefined,
            assignee: assignee || undefined,
            status: 'logged',
            createdAt: Date.now(),
          });
          setActionPickerOpen(false);
          setLastLogged({ label: actionType.label, sent: false });
          window.setTimeout(() => setLastLogged(null), 3200);
        }}
      />
    );
  }

  if (emailFor) {
    return (
      <ComposeMail
        alert={sel}
        actionType={emailFor}
        variant="inline"
        onClose={() => setEmailFor(null)}
        onSend={({ subject }) => {
          onLogAction({
            id: `log-${Date.now()}`,
            alertId: sel.id,
            alertTitle: sel.title,
            account: sel.account,
            actionTypeId: emailFor.id,
            actionTypeLabel: emailFor.label,
            note: `Emailed: ${subject}`,
            status: 'sent',
            createdAt: Date.now(),
          });
          setLastLogged({ label: emailFor.label, sent: true });
          window.setTimeout(() => setLastLogged(null), 3200);
        }}
      />
    );
  }

  if (assignPopupOpen) {
    return (
      <AssignPopupModal
        assignees={sel.assignees ?? DEFAULT_ASSIGNEES}
        variant="inline"
        onClose={() => setAssignPopupOpen(false)}
        onSelect={() => setAssignPopupOpen(false)}
      />
    );
  }

  if (phase === 'executing') {
    return (
      <div style={{ flex: 1, minWidth: 0, height: '100%', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ height: '100%', overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ width: 480 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: execProgress >= 100 ? '#3f7d6a' : '#a8763f' }} />
              <span style={{ font: '500 11px/1 Inter,sans-serif', color: '#6b7178' }}>{execProgress >= 100 ? 'Completed' : 'Applying changes'}</span>
              <span style={{ marginLeft: 'auto', font: '600 13px/1 Inter,sans-serif', color: '#464646' }}>{execProgress}%</span>
            </div>
            <div style={{ font: '600 16px/1.4 Inter,sans-serif', color: '#23272d', marginTop: 11 }}>{sel.title}</div>
            <div style={{ height: 6, borderRadius: 3, background: '#f1f2f4', marginTop: 14, overflow: 'hidden' }}>
              <div style={{ width: `${execProgress}%`, height: '100%', background: '#77469b', transition: 'width .5s ease' }} />
            </div>
            <div style={{ font: '400 12px/1.65 Inter,sans-serif', color: '#6b7178', marginTop: 12 }}>You can leave this alert. Progress continues in the background.</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 16 }}>
              {execProgress >= 100 ? (
                <span onClick={onViewReport} className={motion.btnPrimary} style={{ padding: '10px 16px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 12px/1 Inter,sans-serif', cursor: 'pointer' }}>View impact report</span>
              ) : (
                onUndoExecute && (
                  <span onClick={onUndoExecute} className={motion.btnSecondary} style={{ padding: '10px 16px', borderRadius: 7, border: '1px solid #dfe3ea', font: '600 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>Undo</span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'report') {
    return (
      <div style={{ flex: 1, minWidth: 0, height: '100%', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ height: '100%', overflowY: 'auto', padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3f7d6a' }} />
            <span style={{ font: '500 11px/1 Inter,sans-serif', color: '#6b7178' }}>Verified over 7 days on conversion</span>
          </div>
          <div style={{ font: '600 17px/1.4 Inter,sans-serif', color: '#23272d', marginTop: 11 }}>Recovered $7,240</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 90px', padding: '9px 0', borderBottom: '1px solid #f1f2f4', font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.06em', color: '#6b7178', marginTop: 14 }}>
            <div>METRIC</div><div style={{ textAlign: 'right' }}>BEFORE</div><div style={{ textAlign: 'right' }}>AFTER</div><div style={{ textAlign: 'right' }}>CHANGE</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 90px', padding: '11px 0', borderBottom: '1px solid #f1f2f4', font: '400 12px/1 Inter,sans-serif', color: '#464646' }}>
            <div>Conversion</div><div style={{ textAlign: 'right' }}>6.4%</div><div style={{ textAlign: 'right' }}>8.9%</div><div style={{ textAlign: 'right', color: '#3f7d6a', fontWeight: 600 }}>+2.5 pt</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 90px', padding: '11px 0', font: '400 12px/1 Inter,sans-serif', color: '#464646' }}>
            <div>Net profit · 7d</div><div style={{ textAlign: 'right' }}>$12,180</div><div style={{ textAlign: 'right' }}>$19,420</div><div style={{ textAlign: 'right', color: '#3f7d6a', fontWeight: 600 }}>+$7,240</div>
          </div>
          <span onClick={onBackToAlerts} className={motion.btnSecondary} style={{ display: 'inline-block', marginTop: 18, padding: '10px 16px', borderRadius: 7, border: '1px solid #dfe3ea', font: '600 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>Back to alerts</span>
        </div>
      </div>
    );
  }

  if (phase === 'genReview') {
    return (
      <div style={{ flex: 1, minWidth: 0, height: '100%', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ height: '100%', overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ font: '600 14px/1 Inter,sans-serif', color: '#23272d' }}>Review generated content</span>
            <span style={{ padding: '2px 7px', borderRadius: 4, background: '#f3eefa', font: '600 9px/1.5 Inter,sans-serif', color: '#5f3880' }}>AI DRAFT · NOT PUBLISHED</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#e6e8ec', border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden', marginTop: 14 }}>
            <div style={{ background: '#fff', padding: 15 }}>
              <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Live now</div>
              <div style={{ marginTop: 10, padding: 12, border: '1px solid #e6e8ec', borderRadius: 7, background: '#fafbfd', font: '400 12px/1.75 Inter,sans-serif', color: '#6b7178' }}>Premium whey isolate<br />25g protein per serving<br />Great taste, mixes well</div>
            </div>
            <div style={{ background: '#fdfcfe', padding: 15 }}>
              <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#5f3880' }}>Proposed · editable</div>
              <textarea className={motion.focusRing} style={{ width: '100%', marginTop: 10, padding: 12, border: '1px solid #77469b', borderRadius: 7, background: '#fff', font: '400 12px/1.75 Inter,sans-serif', color: '#23272d', minHeight: 88, outline: 'none', resize: 'vertical' as const }} defaultValue={`Ultra-filtered whey protein isolate — 25g protein, 0g sugar\nThird-party lab tested for banned substances\nMixes instantly, no clumping`} />
              <div style={{ display: 'flex', gap: 6, marginTop: 9 }}>
                <span style={{ padding: '3px 8px', borderRadius: 5, background: '#eef6f3', font: '600 9px/1.5 Inter,sans-serif', color: '#3f7d6a' }}>COMPLIANCE PASSED</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 16 }}>
            <span onClick={onApproveGenReview} className={motion.btnPrimary} style={{ padding: '10px 16px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 12px/1 Inter,sans-serif', cursor: 'pointer' }}>Approve and publish</span>
            <span onClick={onBackToAlerts} className={motion.btnSecondary} style={{ padding: '10px 16px', borderRadius: 7, border: '1px solid #dfe3ea', font: '600 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>Cancel</span>
          </div>
        </div>
      </div>
    );
  }

  // View phase
  const valueColor = sel.valueNum < 0 ? '#b3453f' : '#3f7d6a';
  return (
    <div style={{ flex: 1, minWidth: 0, minHeight: 0, height: '100%', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
      <div key={sel.id} className={`${scrollStyles.sleekScroll} ${motion.contentFadeIn}`} style={{ height: '100%', overflowY: 'auto' }}>
        {/* Header — badges/marketplace/source match the Alerts row exactly (shared AlertBadgeRow), so the two never diverge */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f2f4' }}>
          <div style={{ marginBottom: 12 }}>
            <AlertBadgeRow al={sel} size={20} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ font: '600 18px/1.35 Inter,sans-serif', color: '#23272d' }}>{sel.title}</div>
              <div style={{ font: '400 12px/1.55 Inter,sans-serif', color: '#6b7178', marginTop: 6 }}>{sel.subheader}</div>
            </div>
            <div style={{ textAlign: 'right', flex: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                <div style={{ font: '600 22px/1 Inter,sans-serif', color: valueColor }}>{money(sel.valueNum)}</div>
                <ValueInfoIcon label={explainAlertValue(sel)} />
              </div>
              <div style={{ marginTop: 6, padding: '2px 7px', borderRadius: 4, background: sel.proof === 'verified' ? '#eef6f3' : '#f1f2f4', font: '600 10px/1.5 Inter,sans-serif', color: sel.proof === 'verified' ? '#3f7d6a' : '#5c636e', display: 'inline-block' }}>{sel.proof === 'verified' ? 'VERIFIED' : 'ESTIMATED'}</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* No section heading here by design — just the flowing explanation (root cause folded in) */}
          <div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#464646' }}>{sel.why} {sel.root}</div>

          {/* Strategy picker — the decision this whole card exists to support, so it gets a primary border instead of blending in with the reference cards around it */}
          <div style={{ border: '1.5px solid #77469b', borderRadius: 8, overflow: 'hidden', boxShadow: '0 0 0 3px rgba(119,70,155,0.07)' }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #eee3f6', background: '#fbfafd', display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
              <span style={{ font: '600 12px/1 Inter,sans-serif', color: '#23272d' }}>Suggested actions</span>
            </div>
            {sel.options.map((o) => (
              <div key={o.id} onClick={() => setSelectedOptionId(o.id)} className={motion.rowHover} style={{ padding: '13px 14px', borderBottom: '1px solid #f1f2f4', display: 'flex', gap: 11, alignItems: 'flex-start', cursor: 'pointer', background: optId === o.id ? '#fbfafd' : '#fff' }}>
                <span style={{ width: 14, height: 14, borderRadius: '50%', border: optId === o.id ? '4px solid #77469b' : '1px solid #dfe3ea', flex: 'none', marginTop: 2, transition: 'border 140ms ease-out' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ font: '600 12px/1.4 Inter,sans-serif', color: '#23272d' }}>{o.isOther ? 'Ask Jiva' : o.label}</span>
                  {o.isMeetingAsk && optId === o.id && (
                    <span
                      onClick={(e) => { e.stopPropagation(); setActionPickerOpen(true); }}
                      className={motion.btnSecondary}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 9, padding: '8px 13px', border: '1px solid #dfe3ea', borderRadius: 7, font: '600 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer', background: '#fff' }}
                    >
                      Choose action type <span style={{ color: '#77469b' }}>→</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div key="action" className={motion.contentFadeIn} style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 9, background: '#fafbfd' }}>
              <span onClick={handleExecute} className={motion.btnPrimary} style={{ padding: '10px 16px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 12px/1 Inter,sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {executeLabel}
              </span>
              <span
                onClick={() => { if (dismissed) return; setDismissed(true); onDismiss(); setLastLogged({ label: 'Dismissed', sent: false }); window.setTimeout(() => setLastLogged(null), 3200); }}
                className={dismissed ? undefined : motion.btnSecondary}
                style={{ padding: '9px 14px', border: '1px solid #dfe3ea', borderRadius: 7, font: '500 12px/1 Inter,sans-serif', color: dismissed ? '#9aa0a8' : '#3d434b', cursor: dismissed ? 'default' : 'pointer', transition: 'color 150ms ease-out' }}
              >
                {dismissed ? 'Dismissed' : 'Dismiss'}
              </span>
            </div>
          </div>

          {/* Affected items */}
          {sel.items.length > 0 && (
            <div style={{ border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid #f1f2f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ font: '600 12px/1 Inter,sans-serif', color: '#23272d' }}>Affected items</span>
                <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{sel.itemsCount} total</span>
              </div>
              {getDisplayItems(sel).slice(0, 4).map((it, i) => (
                <div key={i} style={{ padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 11, borderBottom: '1px solid #f1f2f4' }}>
                  <span style={{ flex: 1, minWidth: 0, font: '400 12px/1.4 Inter,sans-serif', color: '#464646', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{it.name}</span>
                  <span style={{ font: '600 12px/1 Inter,sans-serif', color: it.color, flex: 'none' }}>{it.impact}</span>
                </div>
              ))}
              <div onClick={onOpenItems} className={motion.rowHover} style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <span style={{ font: '600 11px/1 Inter,sans-serif', color: '#77469b' }}>Show all {sel.itemsCount} →</span>
              </div>
            </div>
          )}
        </div>

        {/* Sticky action bar — a translucent material so scrolled content reads as passing beneath it, not stopping at a hard edge */}
        <div style={{ position: 'sticky', bottom: 0, background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(14px) saturate(180%)', WebkitBackdropFilter: 'blur(14px) saturate(180%)', borderTop: '1px solid rgba(230,232,236,0.7)', boxShadow: '0 -8px 20px -14px rgba(20,24,33,.12)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8 } as React.CSSProperties}>
          <span
            onClick={() => {
              const assignees = sel.assignees ?? DEFAULT_ASSIGNEES;
              if (assignees.length > ASSIGN_POPUP_THRESHOLD) { setAssignPopupOpen(true); setDetailMenu(null); }
              else setDetailMenu(detailMenu === 'assign' ? null : 'assign');
            }}
            className={motion.btnSecondary}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '500 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer', position: 'relative' }}
          >
            <AssignIcon size={13} /> Assign
            {detailMenu === 'assign' && (
              <div className={motion.popInBottomLeft} style={{ position: 'absolute', left: 0, bottom: 38, width: 220, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 6, zIndex: 70, textAlign: 'left' }} onClick={(e) => e.stopPropagation()}>
                <AssignDropdownList assignees={sel.assignees ?? DEFAULT_ASSIGNEES} onSelect={() => setDetailMenu(null)} />
              </div>
            )}
          </span>
          <span onClick={() => setDetailMenu(detailMenu === 'share' ? null : 'share')} className={motion.btnSecondary} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '500 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer', position: 'relative' }}>
            <ShareIcon size={13} /> Share
            {detailMenu === 'share' && (
              <div className={motion.popInBottomLeft} style={{ position: 'absolute', left: 0, bottom: 38, width: 180, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 6, zIndex: 70, textAlign: 'left' }}>
                <div style={{ padding: '6px 10px 8px', font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9aa0a8' }}>Share via</div>
                <div onClick={() => { setDetailMenu(null); setEmailFor(GENERIC_SEND_UPDATE); }} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', borderRadius: 6, font: '500 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}><EnvelopeSmallIcon size={12} /> Email</div>
                <div className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', borderRadius: 6, font: '500 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}><WorkspaceSmallIcon size={12} /> Workspace · {sel.account}</div>
              </div>
            )}
          </span>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 9, position: 'relative' }}>
            <span style={{ font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8' }}>Rate these results</span>
            <span onClick={() => { setThumb('up'); setFeedbackOpen(false); }} className={motion.pressable} style={{ display: 'flex', cursor: 'pointer' }}>
              <ThumbUpIcon size={15} color={thumb === 'up' ? '#3f7d6a' : '#9aa0a8'} />
            </span>
            <span onClick={() => { setThumb('down'); setFeedbackOpen(true); }} className={motion.pressable} style={{ display: 'flex', cursor: 'pointer' }}>
              <ThumbDownIcon size={15} color={thumb === 'down' ? '#b3453f' : '#9aa0a8'} />
            </span>
            {feedbackOpen && (
              <div className={motion.popInBottomRight} style={{ position: 'absolute', right: 0, bottom: 38, width: 280, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 16, zIndex: 75, textAlign: 'left' }}>
                <div style={{ font: '600 13px/1.4 Inter,sans-serif', color: '#23272d' }}>Help us make it better for you</div>
                <textarea placeholder="What was off about this recommendation?" className={motion.focusRing} style={{ width: '100%', marginTop: 11, padding: '9px 11px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1.5 Inter,sans-serif', color: '#464646', resize: 'vertical' as const, minHeight: 64, outline: 'none' }} />
                <div style={{ display: 'flex', gap: 8, marginTop: 11 }}>
                  <span onClick={() => setFeedbackOpen(false)} className={motion.btnPrimary} style={{ padding: '9px 15px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 12px/1 Inter,sans-serif', cursor: 'pointer' }}>Send</span>
                  <span onClick={() => setFeedbackOpen(false)} className={motion.btnSecondary} style={{ padding: '9px 15px', borderRadius: 7, border: '1px solid #dfe3ea', font: '600 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>Cancel</span>
                </div>
              </div>
            )}
          </span>
        </div>
      </div>

      {itemsModalOpen && <ItemsModal items={getDisplayItems(sel)} itemCount={sel.itemsCount} breakdown={sel.itemsBreakdown} onClose={onCloseItems} />}

      {lastLogged && (
        <div className={motion.toastIn} style={{ position: 'absolute', right: 20, bottom: 20, padding: '12px 16px', borderRadius: 9, background: '#23272d', color: '#fff', font: '500 12px/1.4 Inter,sans-serif', boxShadow: '0 12px 28px rgba(20,24,33,.28)', zIndex: 250, display: 'flex', alignItems: 'center', gap: 9 }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4.5" stroke="#8fd9bd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          {lastLogged.sent ? `Sent: ${lastLogged.label}` : `Logged: ${lastLogged.label}`}
        </div>
      )}
    </div>
  );
}
