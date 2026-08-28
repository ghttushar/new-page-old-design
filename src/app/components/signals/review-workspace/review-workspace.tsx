import { useMemo, useState, useEffect, useRef, Component, type ReactNode } from 'react';
import { X, Check, Prohibit, ArrowElbowDownLeft, ArrowCounterClockwise, CaretDown, ArrowLeft } from '@phosphor-icons/react';
import styles from './review-workspace.module.scss';
import type { Decision } from '@/constants/signals/decisions.constants';
import { strategiesFor } from '@/utils/signals/strategies';
import { formatValue } from '@/utils/signals/valueFormat';
import { relationshipsFor } from '@/utils/signals/relationships';
import { useDispatch } from 'react-redux';
import { approveDecision, delegateToAan, rejectDecision, snoozeDecision, rollbackDecision } from '@/redux/slices/signals/signals.slice';
import { StrategyPicker } from './strategy-picker';
import { AssignMenu } from './assign-menu';
import { DiscussDrawer } from './discuss-drawer';
import { InlineEmailCompose, type EmailDraft } from './inline/inline-email-compose';
import { InlineDraftChat } from './inline/inline-draft-chat';
import { InlineImageEditor } from './inline/inline-image-editor';
import { SnoozeMenu } from '../snooze-menu';
import { ShareMenu } from '../share-menu';
import type { SnoozeChoice } from '@/redux/slices/signals/signals.slice';

interface Props {
  decision: Decision | null;
  decisions?: Decision[];
  onClose: () => void;
  onOpenDecision?: (id: string) => void;
  onBack?: () => void;
  meetingBundleId?: string;
  defaultSummaryExpanded?: boolean;
}

const COUNTDOWN_SECONDS = 5;

interface EmailDraftData {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
}

const VM_EMAIL_ALERT_1: EmailDraftData = {
  to: 'vendor.manager@amazon.com',
  cc: '',
  bcc: '',
  subject: 'ASIN B0CH3HSSLZ — Advertising eligibility warning (action needed)',
  body: `Hi [VM name],

Amazon flagged advertising eligibility with a warning on ASIN B0CH3HSSLZ (Crazy Cups Decaf Island Rum Coconut K-Cups, 22ct) on 18 Jul 2026, citing vendor cost-to-Amazon exceeding target pricing.

- Estimated revenue at risk: $56.58 over next 30 days
- Estimated units at risk: ~3 units
- Inventory available: 81 Units (+148 on open PO)
- Status: ELIGIBLE_WITH_WARNING (not yet fully blocked)
- Confidence: 70%

List price has stayed flat at $18.47 since the alert — no cost reduction has been submitted yet. Could you review the wholesale cost terms for this ASIN and advise on next steps?

Thanks,
Tushar`,
};

const AAN_SEEDS: Record<string, { title: string; approveLabel: string; approveSuccess: string; draft: string }> = {
  'draft-ticket': {
    title: 'Jiva drafted this support ticket',
    approveLabel: 'Approve & file ticket',
    approveSuccess: 'Support ticket filed with Amazon Seller Support.',
    draft: `**Subject:** Reinstate advertising eligibility — ASIN [ASIN]

**Case type:** Advertising / Product eligibility

Hello Seller Support,

ASIN [ASIN] was flagged as ineligible for advertising due to a vendor cost-to-Amazon issue: *"This product's cost to Amazon does not allow us to meet customers' pricing expectations."*

On our end, the retail list price has remained stable and the listing contains all required attributes. We believe this is a wholesale cost threshold issue rather than a catalog or content defect.

- Business impact: estimated revenue at risk as detailed in the alert.
- Inventory: healthy — this is not a supply issue.

Please review and reinstate advertising eligibility or share the specific cost threshold that triggered the flag.

Thank you,
Tushar`,
  },
  'review-cost': {
    title: 'Jiva analyzed your cost structure',
    approveLabel: 'Approve & share findings',
    approveSuccess: 'Cost analysis shared.',
    draft: `Here's the cost analysis I found. Approve before I share:

**ASIN:** B0C33QC2R2 (Crazy Cups DECAF Blueberry Cobbler - 22 Ct)

**Recurrence pattern:** This is the 2nd occurrence in 30 days — the same warning hit this ASIN 2026-06-27 to 2026-07-03, recovered fully 2026-07-04 to 2026-07-17, then relapsed on 2026-07-18.

**Account context:** On 2026-07-02 the team flagged rising price volatility and margin pressure on 40-count packs, calling Amazon's ~21-point margin-cut request "untenable" — pointing to a broader, account-wide cost-to-Amazon squeeze.

**Recommendation:** Given this is the 2nd flare-up in 3 weeks, a one-off cost tweak may only produce a temporary fix. Worth raising the recurrence pattern with the vendor manager directly as part of an account-level cost structure review.

Want me to proceed with the escalation, or would you like me to dig deeper into any specific aspect?`,
  },
};

export class ReviewErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? this.props.fallback : this.props.children; }
}

export function ReviewWorkspace({ decision: d, decisions = [], onClose, onOpenDecision, onBack, meetingBundleId, defaultSummaryExpanded }: Props) {
  const dispatch = useDispatch();
  const [discuss, setDiscuss] = useState(false);
  const [inlineDraft, setInlineDraft] = useState<{ kind: 'email'; strategyTitle: string; draft: EmailDraft } | { kind: 'chat'; strategyTitle: string; title: string; approveLabel: string; approveSuccess: string; draft: string; showApprove?: boolean } | { kind: 'image'; strategyTitle: string } | null>(null);
  const [transitional, setTransitional] = useState<'loading-email' | 'loading-chat' | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [summaryExpanded, setSummaryExpanded] = useState(defaultSummaryExpanded ?? false);

  const allDecisions = useMemo(() => decisions.length > 0 ? decisions : (d ? [d] : []), [decisions, d]);

  const strategies = useMemo(() => (d ? strategiesFor(d) : []), [d]);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>('');

  const [customInstruction, setCustomInstruction] = useState('');

  const [executed, setExecuted] = useState<{ strategyTitle: string; verifyMsg: string; canUndo: boolean } | null>(null);
  const [countdown, setCountdown] = useState<number>(COUNTDOWN_SECONDS);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!d) return;
    const recommended = strategies.find((s) => s.recommended) || strategies[0];
    if (recommended) setSelectedStrategyId(recommended.id);
  }, [d?.id, strategies]);

  useEffect(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = null;
    setExecuted(null);
    setCountdown(COUNTDOWN_SECONDS);
    setInlineDraft(null);
    setTransitional(null);
    setCustomInstruction('');
  }, [d?.id]);

  const relationships = useMemo(
    () => (d ? relationshipsFor(d, allDecisions) : []),
    [d, allDecisions],
  );

  const selectedStrategy = strategies.find((s) => s.id === selectedStrategyId);
  const f = d ? formatValue({ cents: d.valueCents, kind: d.valueKind, cadence: d.cadence }) : null;

  function renderContent(content: string) {
    if (!d?.keyMetrics || d.keyMetrics.length === 0) return content;
    const parts = content.split('|');
    return parts.map((part, i) => {
      const trimmed = part.trim();
      const match = d.keyMetrics!.find((km) => trimmed.includes(km.value));
      if (match) {
        const idx = trimmed.indexOf(match.value);
        const before = trimmed.slice(0, idx);
        const after = trimmed.slice(idx + match.value.length);
        return (
          <span key={i}>
            {before}<span className={styles.metricHighlight}>{match.value}</span>{after}
            {i < parts.length - 1 && <br />}
          </span>
        );
      }
      return <span key={i}>{trimmed}{i < parts.length - 1 && <br />}</span>;
    });
  }

  function startCountdown() {
    setCountdown(COUNTDOWN_SECONDS);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          countdownRef.current = null;
          setTimeout(() => onClose(), 100);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  function onExecute() {
    if (!d || !selectedStrategy || executed) return;
    const shortId = selectedStrategy.id.split(':').pop() ?? '';

    const isInlineDraftAction = shortId === 'notify-vm' || shortId === 'recommended' || shortId === 'draft-ticket' || shortId === 'review-cost' || shortId === 'custom' || shortId === 'image-gen';

    if (isInlineDraftAction) {
      if (shortId === 'notify-vm' || shortId === 'recommended') {
        setTransitional('loading-email');
        setTimeout(() => {
          setInlineDraft({ kind: 'email', strategyTitle: selectedStrategy.title, draft: VM_EMAIL_ALERT_1 });
          setTransitional(null);
        }, 600);
      } else if (shortId === 'draft-ticket') {
        setTransitional('loading-chat');
        const draft = AAN_SEEDS['draft-ticket'].draft.replace('[ASIN]', 'B0CH3HSSLZ');
        setTimeout(() => {
          setInlineDraft({ kind: 'chat', strategyTitle: selectedStrategy.title, title: AAN_SEEDS['draft-ticket'].title, approveLabel: AAN_SEEDS['draft-ticket'].approveLabel, approveSuccess: AAN_SEEDS['draft-ticket'].approveSuccess, draft, showApprove: false });
          setTransitional(null);
        }, 600);
      } else if (shortId === 'review-cost') {
        setTransitional('loading-chat');
        const seed = AAN_SEEDS['review-cost'];
        setTimeout(() => {
          setInlineDraft({ kind: 'chat', strategyTitle: selectedStrategy.title, title: seed.title, approveLabel: seed.approveLabel, approveSuccess: seed.approveSuccess, draft: seed.draft });
          setTransitional(null);
        }, 600);
      } else if (shortId === 'custom') {
        const text = customInstruction.trim() || 'Custom instruction executed.';
        setTransitional('loading-chat');
        setTimeout(() => {
          setInlineDraft({
            kind: 'chat',
            strategyTitle: selectedStrategy.title,
            title: 'Jiva received your instruction',
            approveLabel: 'Approve & execute',
            approveSuccess: 'Custom instruction completed.',
            draft: text,
          });
          setTransitional(null);
        }, 600);
      } else if (shortId === 'image-gen') {
        setTransitional('loading-chat');
        setTimeout(() => {
          setInlineDraft({
            kind: 'image',
            strategyTitle: selectedStrategy.title,
          });
          setTransitional(null);
        }, 600);
      }
      return;
    }

    if (selectedStrategy.id.endsWith(':wait')) {
      const until = Date.now() + 20 * 60 * 60 * 1000;
      dispatch(snoozeDecision({ id: d.id, until }));
    } else if (selectedStrategy.id.endsWith(':aan')) {
      dispatch(delegateToAan(d.id));
    } else {
      dispatch(approveDecision(d.id));
    }

    setExecuted({ strategyTitle: selectedStrategy.title, verifyMsg: 'Change applied. Verifying downstream metrics…', canUndo: true });
    startCountdown();
  }

  function completeInlineDraft() {
    if (!inlineDraft) return;
    const strategyTitle = inlineDraft.strategyTitle;
    const verifyMsg = inlineDraft.kind === 'email' ? 'Email sent. Jiva is monitoring for a reply.' : inlineDraft.kind === 'image' ? 'Image published to Seller Central. Jiva is monitoring re-indexing.' : 'Draft approved. Jiva is tracking follow-up.';
    setInlineDraft(null);
    setTransitional(null);
    dispatch(approveDecision(d!.id));
    setExecuted({ strategyTitle, verifyMsg, canUndo: false });
    startCountdown();
  }

  function onUndo() {
    if (!d || !executed) return;
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = null;
    dispatch(rollbackDecision(d.id));
    setExecuted(null);
    setCountdown(COUNTDOWN_SECONDS);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!d || e.key !== 'Enter' || executed) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (t && t.closest('[role="dialog"]')) return;
      e.preventDefault();
      onExecute();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [d?.id, selectedStrategyId, executed]);

  useEffect(() => () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  if (!d) {
    return (
      <div className={styles.reviewWorkspace}>
        <div className={styles.emptyDetail}>
          <div className={styles.bigIcon}>📋</div>
          <h3>Select a signal to review</h3>
        </div>
      </div>
    );
  }

  const isTerminal = d.status === 'completed' || d.status === 'rejected';
  const progressPct = ((COUNTDOWN_SECONDS - countdown) / COUNTDOWN_SECONDS) * 100;

  return (
    <div ref={rootRef} className={styles.reviewWorkspace}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerBg} />
        <div className={styles.headerContent}>
          <div className={styles.headerInfo}>
            {onBack && meetingBundleId && (
              <button
                className={styles.backBtn}
                onClick={onBack}
                aria-label="Back to meeting"
              >
                <ArrowLeft size={14} weight="bold" />
              </button>
            )}
            <div className={styles.title}>{d.insight}</div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}><X size={14} weight="bold" /></button>
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        {executed ? (
          <div className={styles.executedState}>
            <div className={styles.progressRing} style={{ background: `conic-gradient(#9a9a9a ${progressPct}%, #e1e4e8 0)` }}>
              <div className={styles.progressRingInner}>
                <Check size={32} weight="bold" color="#7c7c7c" />
              </div>
            </div>
            <div className={styles.executedTitle}>Executed: {executed.strategyTitle}</div>
            <p className={styles.executedMsg}>{executed.verifyMsg}</p>
            <div className={styles.executedActions}>
              {executed.canUndo && (
                <button className={styles.undoBtn} onClick={onUndo}><ArrowCounterClockwise size={14} /> Undo ({countdown}s)</button>
              )}
              <button className={styles.closeExecutedBtn} onClick={onClose}>Close</button>
            </div>
          </div>
        ) : (
          <>
            {/* Summary */}
            {d.insightDetail && (
              <div className={styles.summary}>{d.insightDetail}</div>
            )}

            {/* Why It Matters */}
            <div className={styles.eyebrow}>WHY IT MATTERS</div>
            {f && (
              <div className={styles.valueCard}>
                <span className={styles.valueLabel}>
                  {d.valueKind === 'at_risk' ? 'Protect' : d.valueKind === 'gain' ? 'Gain' : d.valueKind === 'cost' ? 'Save' : ''}
                </span>
                <span className={styles.valueAmount}>{f.text}</span>
              </div>
            )}
            {d.valueBasis && (
              <div className={styles.explanation}>{d.valueBasis}</div>
            )}

            {/* Evidence */}
            {d.valueInputs && d.valueInputs.length > 0 && (
              <>
                <div className={styles.eyebrow}>EVIDENCE</div>
                <div className={styles.evidenceList}>
                  {d.valueInputs.map((item, i) => {
                    const colonIdx = item.indexOf(':');
                    const label = colonIdx >= 0 ? item.slice(0, colonIdx + 1) : '';
                    const value = colonIdx >= 0 ? item.slice(colonIdx + 1) : item;
                    return (
                      <div key={i} className={styles.evidenceItem}>
                        <span className={styles.evidenceDot} />
                        <span>
                          {label && <span className={styles.evidenceLabel}>{label}</span>}
                          {value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Detail sections */}
            {d.detailSections && d.detailSections.length > 0 && (
              <div className={styles.detailSections}>
                {d.detailSections
                  .filter((s) => s.heading !== 'AI Summary')
                  .map((s, i) => (
                    <div key={i} className={styles.detailSection}>
                      <div className={styles.detailHeading}>{s.heading}</div>
                      {s.heading === 'Business Impact' ? (
                        <div className={styles.bulletList}>
                          {s.content.split('\n').filter(Boolean).map((line, j) => {
                            const colonIdx = line.indexOf(':');
                            const label = colonIdx >= 0 ? line.slice(0, colonIdx + 1) : '';
                            const rest = colonIdx >= 0 ? line.slice(colonIdx + 1) : line;
                            const parts = rest.split('|');
                            return (
                              <div key={j} className={styles.bulletItem}>
                                <span className={styles.bulletDot} />
                                <span>
                                  {label && <span className={styles.bulletLabel}>{label}</span>}
                                  {parts.map((part, k) => {
                                    const trimmed = part.trim();
                                    const match = d.keyMetrics?.find((km) => trimmed.includes(km.value));
                                    if (match) {
                                      const idx = trimmed.indexOf(match.value);
                                      return (
                                        <span key={k}>
                                          {trimmed.slice(0, idx)}
                                          <span className={styles.metricHighlight}>{match.value}</span>
                                          {trimmed.slice(idx + match.value.length)}
                                          {k < parts.length - 1 && ' | '}
                                        </span>
                                      );
                                    }
                                    return <span key={k}>{trimmed}{k < parts.length - 1 && ' | '}</span>;
                                  })}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className={styles.detailContent}>{renderContent(s.content)}</div>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {/* AI Summary (collapsible) */}
            {d.detailSections && d.detailSections.filter((s) => s.heading === 'AI Summary').length > 0 && (
              <div className={styles.collapsibleSection}>
                <button
                  className={styles.collapsibleHeader}
                  onClick={() => setSummaryExpanded(!summaryExpanded)}
                  type="button"
                >
                  AI Summary
                  <CaretDown size={12} className={`${styles.chevron} ${summaryExpanded ? styles.chevronOpen : ''}`} />
                </button>
                {summaryExpanded && (
                  <div className={styles.collapsibleBody}>
                    {d.detailSections.filter((s) => s.heading === 'AI Summary')[0].content}
                  </div>
                )}
              </div>
            )}

            {/* Strategy */}
            <div className={styles.eyebrow}>CHOOSE YOUR STRATEGY</div>

            {/* Strategy OR Inline Draft */}
            {transitional ? (
              <div className={styles.transitionLoading}>
                <div className={styles.loadingPulse} />
                <span className={styles.loadingLabel}>Preparing {transitional === 'loading-email' ? 'email draft' : transitional === 'loading-chat' ? 'chat' : 'image generation'}…</span>
              </div>
            ) : inlineDraft ? (
              inlineDraft.kind === 'email' ? (
                <InlineEmailCompose initial={inlineDraft.draft} onCancel={() => setInlineDraft(null)} onSent={completeInlineDraft} />
              ) : inlineDraft.kind === 'image' ? (
                <InlineImageEditor
                  decision={{
                    id: d!.id,
                    insight: d!.insight,
                    valueCaption: d!.valueCaption,
                    actionVerb: d!.actionVerb,
                  }}
                  onCancel={() => setInlineDraft(null)}
                />
              ) : (
                <InlineDraftChat
                  title={inlineDraft.title}
                  approveLabel={inlineDraft.approveLabel}
                  approveSuccess={inlineDraft.approveSuccess}
                  initialDraft={inlineDraft.draft}
                  onCancel={() => setInlineDraft(null)}
                  onApprove={completeInlineDraft}
                  showApprove={inlineDraft.showApprove}
                />
              )
            ) : (
              <div className={styles.section}>
                <div className={styles.strategyWrapper}>
                  <StrategyPicker strategies={strategies} selectedId={selectedStrategyId} onSelect={setSelectedStrategyId} customValue={customInstruction} onCustomChange={setCustomInstruction} onCustomSubmit={onExecute} />
                </div>
              </div>
            )}

          </>
        )}
      </div>

      {/* Footer */}
      {!executed && !inlineDraft && !transitional && (
        <div className={styles.footer}>
          {isTerminal ? (
            <span className={styles.footerStatus}>This decision is closed.</span>
          ) : (
            <>
              <div className={styles.executeWrap}>
                <button className={styles.executeBtn} onClick={onExecute}>
                  <Check size={14} weight="bold" /> Execute{selectedStrategy ? `: ${selectedStrategy.title}` : ' selected strategy'}
                  <span className={styles.enterHint}><ArrowElbowDownLeft size={10} /> Enter</span>
                </button>
              </div>
              <AssignMenu onAssign={(key, label) => {
                if (label === 'Jiva') dispatch(delegateToAan(d.id));
              }} />
              <button className={styles.footerBtnDanger} onClick={() => dispatch(rejectDecision(d.id))}><Prohibit size={14} /> Dismiss</button>
              <div className={styles.footerRight}>
                <SnoozeMenu onSelect={(c: SnoozeChoice) => {
                  const ms: Record<string, number> = { '1h': 3600000, tomorrow: 72000000, next_week: 604800000 };
                  dispatch(snoozeDecision({ id: d.id, until: Date.now() + (ms[c] || 3600000) }));
                }} />
                <ShareMenu itemLabel={d.insight} />
              </div>
            </>
          )}
        </div>
      )}

      <DiscussDrawer decision={d} open={discuss} onOpenChange={setDiscuss} />
    </div>
  );
}
