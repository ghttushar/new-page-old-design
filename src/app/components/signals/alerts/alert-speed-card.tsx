import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import type { PrototypeAlert, LoggedActionItem } from '@/constants/signals/prototype-data';
import { ACTION_TYPES, type ActionType } from '@/constants/signals/action-types.constants';
import { formatAlertValue, explainAlertValue } from './format-money';
import { getDisplayItems } from './items-util';
import { ValueInfoIcon } from './value-info-icon';
import { MarketplaceGlyph } from './marketplace-glyph';
import { SourceIcon } from './source-icon';
import { ItemsModal } from './items-modal';
import { ActionPicker } from './action-picker';
import { ComposeMail } from './compose-mail';
import { ImageGenStudio } from './image-gen-studio';
import { AssignDropdownList, AssignPopupModal, DEFAULT_ASSIGNEES, ASSIGN_POPUP_THRESHOLD } from './assign-menu';
import { AssignIcon, ShareIcon, ThumbUpIcon, ThumbDownIcon, SparkleIcon, CheckIcon, XIcon, EnvelopeSmallIcon, ChevronDownIcon } from './icons';
import scrollStyles from './alerts-scroll.module.scss';
import motion from './motion.module.scss';

interface Props {
  alert: PrototypeAlert | null;
  position: number;
  total: number;
  onLogAction: (item: LoggedActionItem) => void;
  onAdvance: () => void;
  onResolve: (id: string) => void;
}

const GENERIC_SEND_UPDATE = ACTION_TYPES.find((a) => a.id === 'send-report-update')!;
const CARD_MAX_WIDTH = 800;
const SWIPE_THRESHOLD = 130;

export function AlertSpeedCard({ alert, position, total, onLogAction, onAdvance, onResolve }: Props) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [aiSummaryOpen, setAiSummaryOpen] = useState(false);
  const [actionPickerOpen, setActionPickerOpen] = useState(false);
  const [emailFor, setEmailFor] = useState<ActionType | null>(null);
  const [imageStudioOpen, setImageStudioOpen] = useState(false);
  const [itemsModalOpen, setItemsModalOpen] = useState(false);
  const [assignMenuOpen, setAssignMenuOpen] = useState(false);
  const [assignPopupOpen, setAssignPopupOpen] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [thumb, setThumb] = useState<'up' | 'down' | null>(null);
  const [flash, setFlash] = useState<'approved' | 'denied' | null>(null);
  const [flyOut, setFlyOut] = useState<'left' | 'right' | null>(null);

  // Drag-to-swipe physics
  const [drag, setDrag] = useState({ x: 0, dragging: false });
  const dragStartX = useRef(0);

  useEffect(() => {
    setSelectedOptionId(null);
    setPickerOpen(false);
    setDetailsOpen(false);
    setAiSummaryOpen(false);
    setFlash(null);
    setFlyOut(null);
    setActionPickerOpen(false);
    setEmailFor(null);
    setImageStudioOpen(false);
    setAssignMenuOpen(false);
    setAssignPopupOpen(false);
    setShareMenuOpen(false);
    setThumb(null);
    setDrag({ x: 0, dragging: false });
  }, [alert?.id]);

  const arena: CSSProperties = {
    flex: 1, minWidth: 0, minHeight: 0, height: '100%', position: 'relative', overflow: 'hidden',
    borderRadius: 10, border: '1px solid #e6e8ec',
    background: 'radial-gradient(circle at 20% 10%, rgba(119,70,155,.10), transparent 42%), radial-gradient(circle at 88% 18%, rgba(63,125,106,.08), transparent 38%), radial-gradient(circle at 60% 92%, rgba(168,118,63,.07), transparent 42%), #fbfafd',
  };

  if (!alert) {
    return (
      <div style={{ ...arena, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 260 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#eef6f3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}><CheckIcon size={26} color="#3f7d6a" /></div>
          <div style={{ font: '800 17px/1.4 Inter,sans-serif', color: '#23272d', marginTop: 16 }}>All caught up</div>
          <div style={{ font: '400 12.5px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 6 }}>You've been through every alert in the stack.</div>
        </div>
      </div>
    );
  }

  const mappedActionType = alert.mappedActionTypeId ? ACTION_TYPES.find((a) => a.id === alert.mappedActionTypeId) : undefined;
  const optId = selectedOptionId || (alert.options.find((o) => o.recommended) || alert.options[0])?.id;
  const picked = alert.options.find((o) => o.id === optId);
  const otherOptions = alert.options.filter((o) => o.id !== optId);
  const valueColor = alert.valueNum < 0 ? '#b3453f' : '#3f7d6a';
  const origin = alert.originType ?? 'anarix';

  const logAndAdvance = (label: string, note: string, status: 'logged' | 'sent') => {
    onLogAction({
      id: `log-${Date.now()}`,
      alertId: alert.id,
      alertTitle: alert.title,
      account: alert.account,
      actionTypeId: mappedActionType?.id ?? 'send-report-update',
      actionTypeLabel: label,
      note,
      status,
      createdAt: Date.now(),
    });
    onResolve(alert.id);
    setFlash('approved');
    window.setTimeout(onAdvance, 460);
  };

  const handleApprove = () => {
    if (!picked) { onAdvance(); return; }
    if (picked.kind === 'GENERATIVE' && picked.generates === 'image') { setImageStudioOpen(true); return; }
    if (picked.isOther || picked.isMeetingAsk) { setActionPickerOpen(true); return; }
    setFlyOut('right');
    window.setTimeout(() => logAndAdvance(picked.label, picked.desc, 'logged'), 220);
  };

  const handleDeny = () => {
    onResolve(alert.id);
    setFlyOut('left');
    window.setTimeout(() => { setFlash('denied'); window.setTimeout(onAdvance, 400); }, 220);
  };

  const assignees = alert.assignees ?? DEFAULT_ASSIGNEES;
  const requestAssign = () => {
    setShareMenuOpen(false);
    if (assignees.length > ASSIGN_POPUP_THRESHOLD) setAssignPopupOpen(true);
    else setAssignMenuOpen((v) => !v);
  };

  if (imageStudioOpen) {
    return (
      <ImageGenStudio
        alert={alert}
        onBack={() => setImageStudioOpen(false)}
        onPublish={() => {
          setImageStudioOpen(false);
          logAndAdvance(picked?.label ?? 'Generated image published', 'Generated and published via Image Studio.', 'logged');
        }}
      />
    );
  }

  // Pointer drag handlers — grabbed from the hero header only, so strategy clicks below stay untouched.
  const onPointerDown = (e: ReactPointerEvent) => {
    if (flyOut) return;
    dragStartX.current = e.clientX;
    setDrag({ x: 0, dragging: true });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (!drag.dragging) return;
    setDrag({ x: e.clientX - dragStartX.current, dragging: true });
  };
  const onPointerUp = () => {
    if (!drag.dragging) return;
    if (drag.x > SWIPE_THRESHOLD) { setDrag({ x: 0, dragging: false }); handleApprove(); return; }
    if (drag.x < -SWIPE_THRESHOLD) { setDrag({ x: 0, dragging: false }); handleDeny(); return; }
    setDrag({ x: 0, dragging: false });
  };

  const rotation = Math.max(-10, Math.min(10, drag.x / 14));
  const approveGlow = Math.max(0, Math.min(1, drag.x / SWIPE_THRESHOLD));
  const denyGlow = Math.max(0, Math.min(1, -drag.x / SWIPE_THRESHOLD));
  const flyTransform = flyOut === 'right' ? 'translateX(680px) rotate(22deg)' : flyOut === 'left' ? 'translateX(-680px) rotate(-22deg)' : `translateX(${drag.x}px) rotate(${rotation}deg)`;

  return (
    <div style={arena}>
      <style>{`
        @keyframes speedCardIn { from { opacity: 0; transform: translateY(18px) scale(.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes flashPop { from { opacity: 0; transform: scale(.8); } to { opacity: 1; transform: scale(1); } }
        @keyframes meshDrift { 0%,100% { background-position: 0% 0%, 100% 0%; } 50% { background-position: 8% 6%, 92% 8%; } }
        .speedDenyBtn { transition: transform 160ms cubic-bezier(0.23,1,0.32,1), box-shadow 160ms cubic-bezier(0.23,1,0.32,1); }
        .speedApproveBtn { transition: transform 160ms cubic-bezier(0.23,1,0.32,1), box-shadow 160ms cubic-bezier(0.23,1,0.32,1); }
        @media (hover: hover) and (pointer: fine) {
          .speedDenyBtn:hover { transform: scale(1.1); box-shadow: 0 12px 28px rgba(179,69,63,.3); }
          .speedApproveBtn:hover { transform: scale(1.1); box-shadow: 0 14px 32px rgba(63,125,106,.42); }
        }
        .speedDenyBtn:active { transform: scale(0.95); }
        .speedApproveBtn:active { transform: scale(0.95); }
      `}</style>

      {/* Progress bar across the top of the arena */}
      <div style={{ position: 'absolute', top: 18, left: 24, right: 24, display: 'flex', alignItems: 'center', gap: 10, zIndex: 3 }}>
        <span style={{ font: '800 12px/1 Inter,sans-serif', color: '#5f3880' }}>{position} / {total}</span>
        <div style={{ flex: 1, height: 4, borderRadius: 3, background: '#e6ddf0', overflow: 'hidden' }}>
          <div style={{ width: `${(position / total) * 100}%`, height: '100%', background: 'linear-gradient(90deg,#a37fc7,#77469b)', transition: 'width .3s ease' }} />
        </div>
        <span style={{ font: '600 11px/1 Inter,sans-serif', color: '#9aa0a8' }}>{total - position} left</span>
      </div>

      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '56px 28px 26px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: CARD_MAX_WIDTH, flex: '1 1 auto', minHeight: 0, display: 'flex', alignItems: 'center' }}>
          {/* Fanned deck peeking behind */}
          <div style={{ position: 'absolute', inset: 0, background: '#fff', border: '1px solid #ece5f3', borderRadius: 26, transform: 'rotate(-3.5deg) translateY(10px)', zIndex: 0, boxShadow: '0 6px 20px rgba(20,24,33,.05)' }} />
          <div style={{ position: 'absolute', inset: 0, background: '#fff', border: '1px solid #eceef1', borderRadius: 26, transform: 'rotate(2.5deg) translateY(5px)', zIndex: 1, boxShadow: '0 6px 20px rgba(20,24,33,.05)' }} />

          {/* Floating card */}
          <div
            key={alert.id}
            style={{
              position: 'relative', zIndex: 2, width: '100%', background: '#fff', borderRadius: 26, overflow: 'hidden',
              boxShadow: '0 36px 60px -22px rgba(20,24,33,.3), 0 12px 24px -10px rgba(20,24,33,.14)',
              display: 'flex', flexDirection: 'column', maxHeight: '100%',
              animation: flyOut ? 'none' : 'speedCardIn .34s cubic-bezier(.2,.8,.2,1)',
              transform: flyTransform,
              opacity: flyOut ? 0 : 1,
              transition: drag.dragging ? 'none' : 'transform .35s cubic-bezier(.2,.8,.2,1), opacity .3s ease',
            }}
          >
            {/* Swipe stamps */}
            <div style={{ position: 'absolute', top: 24, right: 24, padding: '6px 14px', borderRadius: 8, border: '3px solid #3f7d6a', color: '#3f7d6a', font: '800 15px/1 Inter,sans-serif', letterSpacing: '0.06em', transform: 'rotate(-8deg)', opacity: approveGlow, zIndex: 6, pointerEvents: 'none' as const }}>APPROVE</div>
            <div style={{ position: 'absolute', top: 24, left: 24, padding: '6px 14px', borderRadius: 8, border: '3px solid #b3453f', color: '#b3453f', font: '800 15px/1 Inter,sans-serif', letterSpacing: '0.06em', transform: 'rotate(8deg)', opacity: denyGlow, zIndex: 6, pointerEvents: 'none' as const }}>DENY</div>

            {/* Draggable hero header — grab and swipe left/right */}
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              style={{
                padding: '26px 28px 20px', flex: 'none', cursor: drag.dragging ? 'grabbing' : 'grab', touchAction: 'none' as const,
                background: 'linear-gradient(180deg, rgba(119,70,155,.05), transparent)',
                userSelect: 'none' as const,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 'none' }}>
                  <span style={{ padding: '4px 10px', borderRadius: 6, background: alert.priorityDot + '1a', font: '800 11px/1 Inter,sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: alert.priorityDot }}>{alert.priority}</span>
                  <span style={{ padding: '4px 10px', borderRadius: 6, background: '#f3eefa', font: '700 11px/1 Inter,sans-serif', color: '#5f3880' }}>{alert.category}</span>
                </div>
                <span style={{ width: 1, height: 16, background: '#e6ddf0', flex: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'center', flex: 'none' }}>
                  <MarketplaceGlyph al={alert} size={30} />
                </div>
                <span style={{ width: 1, height: 16, background: '#e6ddf0', flex: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'center', flex: 'none' }}>
                  <SourceIcon origin={origin} detail={alert.originDetail} size={30} />
                </div>
                <span style={{ marginLeft: 'auto', font: '600 11px/1 Inter,sans-serif', color: '#9aa0a8' }}>{alert.account}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 2, color: '#c3b9d1' }} title="Drag to swipe">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="5" cy="4" r="1.3" /><circle cx="11" cy="4" r="1.3" /><circle cx="5" cy="8" r="1.3" /><circle cx="11" cy="8" r="1.3" /><circle cx="5" cy="12" r="1.3" /><circle cx="11" cy="12" r="1.3" /></svg>
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 16 }}>
                <div style={{ font: '800 46px/1 Inter,sans-serif', color: valueColor, letterSpacing: '-0.02em' }}>{formatAlertValue(alert.valueNum)}</div>
                <div style={{ marginTop: 8 }}><ValueInfoIcon label={explainAlertValue(alert)} size={19} /></div>
              </div>
              <div style={{ font: '800 22px/1.3 Inter,sans-serif', color: '#23272d', marginTop: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{alert.title}</div>
              <div style={{ font: '400 13px/1.55 Inter,sans-serif', color: '#8a919b', marginTop: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{alert.subheader}</div>
            </div>

            {/* Non-draggable utility row — same actions Normal view offers, none of it blocks the swipe gesture above */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 28px', flex: 'none' }} onPointerDown={(e) => e.stopPropagation()}>
              <span style={{ position: 'relative' }}>
                <span onClick={requestAssign} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 11px', border: '1px solid #e6e0ec', borderRadius: 8, font: '600 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>
                  <AssignIcon size={13} /> Assign
                </span>
                {assignMenuOpen && (
                  <div className={motion.popInTop} style={{ position: 'absolute', left: 0, top: 38, width: 220, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 6, zIndex: 30 }}>
                    <AssignDropdownList assignees={assignees} onSelect={() => setAssignMenuOpen(false)} />
                  </div>
                )}
              </span>
              <span style={{ position: 'relative' }}>
                <span onClick={() => { setShareMenuOpen((v) => !v); setAssignMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 11px', border: '1px solid #e6e0ec', borderRadius: 8, font: '600 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>
                  <ShareIcon size={13} /> Share
                </span>
                {shareMenuOpen && (
                  <div className={motion.popInTop} style={{ position: 'absolute', left: 0, top: 38, width: 180, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 6, zIndex: 30 }}>
                    <div onClick={() => { setShareMenuOpen(false); setEmailFor(GENERIC_SEND_UPDATE); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', borderRadius: 6, font: '500 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}><EnvelopeSmallIcon size={12} /> Email</div>
                  </div>
                )}
              </span>
              <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8' }}>Rate</span>
                <span onClick={() => setThumb('up')} style={{ display: 'flex', cursor: 'pointer' }}><ThumbUpIcon size={14} color={thumb === 'up' ? '#3f7d6a' : '#9aa0a8'} /></span>
                <span onClick={() => setThumb('down')} style={{ display: 'flex', cursor: 'pointer' }}><ThumbDownIcon size={14} color={thumb === 'down' ? '#b3453f' : '#9aa0a8'} /></span>
              </span>
            </div>

            {/* Two-column body: strategy on the left, always-on stats on the right */}
            <div className={scrollStyles.sleekScroll} style={{ overflowY: 'auto', padding: '10px 28px 24px', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
              <div>
                <div key="action" className={motion.contentFadeIn} style={{ padding: '14px 16px', borderRadius: 14, background: '#f9f7fc', border: '1.5px solid #e5d9f0' }}>
                  <div style={{ font: '700 10px/1 Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9a7fb8' }}>Approving will</div>
                  <div style={{ font: '700 14px/1.4 Inter,sans-serif', color: '#3d2a52', marginTop: 6 }}>{picked?.label ?? 'Log this alert'}</div>
                  {picked?.expected && (
                    <div style={{ font: '700 13px/1 Inter,sans-serif', color: '#3f7d6a', marginTop: 8 }}>Est. {picked.expected}{picked.confidence ? ` · ${picked.confidence}% confidence` : ''}</div>
                  )}
                </div>

                {otherOptions.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <span onClick={() => setPickerOpen((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, font: '600 11.5px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>
                      {pickerOpen ? 'Hide other options' : `Choose a different option (${otherOptions.length})`}
                      <span style={{ display: 'flex', transform: pickerOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}><ChevronDownIcon size={9} color="#77469b" /></span>
                    </span>
                    <div className={`${motion.accordionRow} ${pickerOpen ? motion.accordionRowOpen : ''}`}>
                      <div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                          {alert.options.map((o) => (
                            <div
                              key={o.id}
                              onClick={() => { setSelectedOptionId(o.id); setPickerOpen(false); }}
                              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 11px', border: `1.4px solid ${optId === o.id ? '#77469b' : '#eceef1'}`, background: optId === o.id ? '#fbfafd' : '#fff', borderRadius: 8, cursor: 'pointer' }}
                            >
                              <span style={{ width: 12, height: 12, borderRadius: '50%', border: optId === o.id ? '3.5px solid #77469b' : '1px solid #dfe3ea', flex: 'none' }} />
                              <span style={{ flex: 1, minWidth: 0, font: '600 12px/1.3 Inter,sans-serif', color: '#23272d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{o.label}</span>
                              {o.expected && <span style={{ flex: 'none', font: '700 11px/1 Inter,sans-serif', color: '#3f7d6a' }}>{o.expected}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div onClick={() => setDetailsOpen((v) => !v)} style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', userSelect: 'none' as const }}>
                  <span style={{ font: '600 11.5px/1 Inter,sans-serif', color: '#9aa0a8' }}>{detailsOpen ? 'Hide why & root cause' : 'Why it happened · root cause'}</span>
                  <span style={{ display: 'flex', transform: detailsOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}><ChevronDownIcon size={9} /></span>
                </div>
                <div className={`${motion.accordionRow} ${detailsOpen ? motion.accordionRowOpen : ''}`}>
                  <div>
                    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ padding: 12, background: '#fafbfd', border: '1px solid #f1f2f4', borderRadius: 8 }}>
                        <div style={{ font: '600 9px/1 Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9aa0a8' }}>Why it happened</div>
                        <div style={{ font: '400 12px/1.55 Inter,sans-serif', color: '#464646', marginTop: 6 }}>{alert.why}</div>
                      </div>
                      <div style={{ padding: 12, background: '#fafbfd', border: '1px solid #f1f2f4', borderRadius: 8 }}>
                        <div style={{ font: '600 9px/1 Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9aa0a8' }}>Root cause</div>
                        <div style={{ font: '400 12px/1.55 Inter,sans-serif', color: '#464646', marginTop: 6 }}>{alert.root}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div onClick={() => setAiSummaryOpen((v) => !v)} style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', userSelect: 'none' as const }}>
                  <SparkleIcon size={11} />
                  <span style={{ font: '600 11.5px/1 Inter,sans-serif', color: '#5f3880' }}>{aiSummaryOpen ? 'Hide AI summary' : 'AI summary'}</span>
                  <span style={{ display: 'flex', transform: aiSummaryOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}><ChevronDownIcon size={9} color="#5f3880" /></span>
                </div>
                <div className={`${motion.accordionRow} ${aiSummaryOpen ? motion.accordionRowOpen : ''}`}>
                  <div>
                    <div style={{ marginTop: 10, padding: 12, background: '#fbfafd', border: '1px solid #f1f2f4', borderRadius: 8, font: '400 12px/1.6 Inter,sans-serif', color: '#464646' }}>{alert.aiSummary}</div>
                  </div>
                </div>
              </div>

              {/* Always-visible stats column — using the extra room instead of hiding it */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ padding: '11px 13px', borderRadius: 10, background: '#fafbfd', border: '1px solid #f1f2f4' }}>
                  <div style={{ font: '400 10px/1 Inter,sans-serif', color: '#6b7178' }}>Window</div>
                  <div style={{ font: '700 14px/1 Inter,sans-serif', color: '#23272d', marginTop: 5 }}>{alert.oppWindow}</div>
                </div>
                <div style={{ padding: '11px 13px', borderRadius: 10, background: '#fafbfd', border: '1px solid #f1f2f4' }}>
                  <div style={{ font: '400 10px/1 Inter,sans-serif', color: '#6b7178' }}>{alert.revLabel}</div>
                  <div style={{ font: '700 14px/1 Inter,sans-serif', color: valueColor, marginTop: 5 }}>{alert.revValue}</div>
                </div>
                <div style={{ padding: '11px 13px', borderRadius: 10, background: '#fafbfd', border: '1px solid #f1f2f4' }}>
                  <div style={{ font: '400 10px/1 Inter,sans-serif', color: '#6b7178' }}>Confidence</div>
                  <div style={{ font: '700 14px/1 Inter,sans-serif', color: '#23272d', marginTop: 5 }}>{alert.confidence}%</div>
                </div>
                {alert.itemsCount > 1 && (
                  <span onClick={() => setItemsModalOpen(true)} style={{ marginTop: 2, font: '600 11.5px/1.4 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>Show all {alert.itemsBreakdown} →</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Floating action buttons — under the card, not part of it */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 34, marginTop: 26, flex: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <span
              className="speedDenyBtn"
              onClick={handleDeny}
              style={{ width: 66, height: 66, borderRadius: '50%', background: '#fff', border: '2.5px solid #f0d8d5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 24px rgba(179,69,63,.18)', transition: 'transform .15s, box-shadow .15s' }}
            ><XIcon size={22} /></span>
            <span onClick={handleDeny} style={{ font: '600 10.5px/1 Inter,sans-serif', color: '#9aa0a8', cursor: 'pointer' }}>Dismiss</span>
          </div>
          <span
            className="speedApproveBtn"
            onClick={handleApprove}
            style={{ width: 84, height: 84, borderRadius: '50%', background: 'linear-gradient(135deg,#4a9482,#3f7d6a)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 14px 30px rgba(63,125,106,.38)', transition: 'transform .15s, box-shadow .15s' }}
          ><CheckIcon size={30} /></span>
        </div>
      </div>

      {flash && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(251,250,253,.85)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
          <div style={{ textAlign: 'center', animation: 'flashPop .2s ease-out' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: flash === 'approved' ? '#eef6f3' : '#fbf1ef', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              {flash === 'approved' ? <CheckIcon size={28} color="#3f7d6a" /> : <XIcon size={28} color="#b3453f" />}
            </div>
            <div style={{ font: '800 15px/1 Inter,sans-serif', color: '#23272d', marginTop: 14 }}>{flash === 'approved' ? 'Approved' : 'Denied'}</div>
          </div>
        </div>
      )}

      {itemsModalOpen && <ItemsModal items={getDisplayItems(alert)} itemCount={alert.itemsCount} breakdown={alert.itemsBreakdown} onClose={() => setItemsModalOpen(false)} />}
      {assignPopupOpen && (
        <AssignPopupModal
          assignees={assignees}
          onClose={() => setAssignPopupOpen(false)}
          onSelect={() => setAssignPopupOpen(false)}
        />
      )}
      {actionPickerOpen && (
        <ActionPicker
          alert={alert}
          initialSearch={mappedActionType?.label}
          onClose={() => setActionPickerOpen(false)}
          onRequestEmail={(actionType) => { setActionPickerOpen(false); setEmailFor(actionType); }}
          onRequestImageGen={() => { setActionPickerOpen(false); setImageStudioOpen(true); }}
          onSave={(actionType, note) => {
            setActionPickerOpen(false);
            logAndAdvance(actionType.label, note, 'logged');
          }}
        />
      )}
      {emailFor && (
        <ComposeMail
          alert={alert}
          actionType={emailFor}
          onClose={() => setEmailFor(null)}
          onSend={({ subject }) => {
            logAndAdvance(emailFor.label, `Emailed: ${subject}`, 'sent');
          }}
        />
      )}
    </div>
  );
}
