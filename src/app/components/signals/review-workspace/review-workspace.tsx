import { useMemo, useState, useEffect, useRef } from 'react';
import { X, Check, Prohibit, ArrowElbowDownLeft, ArrowCounterClockwise } from '@phosphor-icons/react';
import styles from './review-workspace.module.scss';
import type { Decision } from '@/constants/signals/decisions.constants';
import { strategiesFor } from '@/utils/signals/strategies';
import { relationshipsFor } from '@/utils/signals/relationships';
import { useDispatch } from 'react-redux';
import { approveDecision, delegateToAan, rejectDecision, snoozeDecision, rollbackDecision } from '@/redux/slices/signals/signals.slice';
import { StrategyPicker } from './strategy-picker';
import { RelatedDecisionChip } from './related-decision-chip';
import { AssignMenu } from './assign-menu';
import { DiscussDrawer } from './discuss-drawer';
import { InlineEmailCompose, type EmailDraft } from './inline/inline-email-compose';
import { InlineDraftChat } from './inline/inline-draft-chat';
import { SourcePill } from '../chips/source-pill';
import { SnoozeMenu } from '../snooze-menu';
import { ShareMenu } from '../share-menu';
import type { SnoozeChoice } from '@/redux/slices/signals/signals.slice';

interface Props {
  decision: Decision | null;
  decisions?: Decision[];
  onClose: () => void;
  onOpenDecision?: (id: string) => void;
}

const COUNTDOWN_SECONDS = 5;

interface EmailDraftData {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
}

const NOTIFY_VM_EMAIL: EmailDraftData = {
  to: 'vendor.manager@amazon.com',
  cc: '',
  bcc: '',
  subject: 'ASIN B0CSH8TCC6 — Advertising eligibility lost (action needed)',
  body: `Hi [VM name],

Amazon disabled advertising eligibility on ASIN B0CSH8TCC6 (Sampler — Decaf 40 Count) on 07 Jun 2026, citing missing or incorrect listing information.

- Estimated revenue at risk (next 7 days): $6,885
- Estimated units at risk: 300
- Inventory available: 2,810 units (~140 days of coverage)
- Confidence: 82%

Could you confirm whether a recent content change on your side triggered this, and share the last known-good listing snapshot so we can restore eligibility quickly?

Thanks,
Tushar`,
};

const AAN_SEEDS: Record<string, { title: string; approveLabel: string; approveSuccess: string; draft: string }> = {
  'draft-ticket': {
    title: 'Aan drafted this support ticket',
    approveLabel: 'Approve & file ticket',
    approveSuccess: 'Support ticket filed with Amazon Seller Support.',
    draft: `**Subject:** Reinstate advertising eligibility — ASIN B0CSH8TCC6

**Case type:** Advertising / Product eligibility

Hello Seller Support,

On 07 Jun 2026, ASIN B0CSH8TCC6 (Sampler — Decaf 40 Count) was flagged as ineligible for advertising with the reason: *"This product is either missing important information or contains incorrect information."*

On our end, the listing contains all required attributes and matches the last known-eligible version. We believe this flag was raised in error and request a manual review.

- Business impact: estimated **$6,885 in ad-driven revenue at risk** over the next 7 days (300 units).
- Inventory on hand: 2,810 units, ~140 days of coverage — this is not a stock issue.

Please reinstate advertising eligibility or share the specific attribute that triggered the flag so we can correct it.

Thank you,
Tushar`,
  },
  'recommended': {
    title: 'Aan analyzed the listing',
    approveLabel: 'Approve & publish edit',
    approveSuccess: 'Listing edit published for review.',
    draft: `Here's what I found and the proposed fix. Approve before I publish:

**ASIN:** B0CSH8TCC6 (Sampler — Decaf 40 Count)

**Likely failing field:** \`bullet_point_3\` — currently reads *"Best decaf coffee — cures fatigue and boosts energy"*. Amazon's compliance model flagged this as an unsupported medical/functional claim.

**Proposed edit:**
> Smooth, low-acidity decaf blend — 40 single-serve pods per box, compatible with most single-serve brewers.

Other fields (title, images, attributes) match the last eligible snapshot. Confidence: 84%.

Want me to publish this edit, or should I tweak the wording first?`,
  },
  'image-generate': {
    title: 'Aan generated a compliant image',
    approveLabel: 'Approve & publish image',
    approveSuccess: 'Image published to listing.',
    draft: `I analyzed the current image against Amazon's requirements:

**Issues found:**
1. Dimensions: 800×800 px (needs 1000×1000 minimum)
2. Background: slight gradient detected (needs pure white, RGB 255,255,255)

**Generated image preview:**
✅ 1000×1000 px
✅ Pure white background (RGB 255,255,255)
✅ Product properly centered with no text overlay on main image
✅ No lifestyle elements in main image

The file is ready for preview. Approve to publish the new image to ASIN B0CSH8TCC6.`,
  },
};

export function ReviewWorkspace({ decision: d, decisions = [], onClose, onOpenDecision }: Props) {
  const dispatch = useDispatch();
  const [discuss, setDiscuss] = useState(false);
  const [inlineDraft, setInlineDraft] = useState<{ kind: 'email'; strategyTitle: string; draft: EmailDraft } | { kind: 'chat'; strategyTitle: string; title: string; approveLabel: string; approveSuccess: string; draft: string } | null>(null);
  const [transitional, setTransitional] = useState<'loading-email' | 'loading-chat' | null>(null);
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const allDecisions = useMemo(() => decisions.length > 0 ? decisions : (d ? [d] : []), [decisions, d]);

  const strategies = useMemo(() => (d ? strategiesFor(d) : []), [d]);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>('');

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
  }, [d?.id]);

  const relationships = useMemo(
    () => (d ? relationshipsFor(d, allDecisions) : []),
    [d, allDecisions],
  );

  const selectedStrategy = strategies.find((s) => s.id === selectedStrategyId);

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

    const isInlineDraftAction = shortId === 'notify-vm' || shortId === 'draft-ticket' || (shortId === 'recommended' && d.id === 'critical-b0csh8tcc6') || shortId === 'custom';

    if (isInlineDraftAction) {
      if (shortId === 'notify-vm') {
        setTransitional('loading-email');
        setTimeout(() => {
          setInlineDraft({ kind: 'email', strategyTitle: selectedStrategy.title, draft: NOTIFY_VM_EMAIL });
          setTransitional(null);
        }, 600);
      } else if (shortId === 'draft-ticket') {
        setTransitional('loading-chat');
        const seed = AAN_SEEDS['draft-ticket'];
        setTimeout(() => {
          setInlineDraft({ kind: 'chat', strategyTitle: selectedStrategy.title, title: seed.title, approveLabel: seed.approveLabel, approveSuccess: seed.approveSuccess, draft: seed.draft });
          setTransitional(null);
        }, 600);
      } else if (shortId === 'custom') {
        setTransitional('loading-chat');
        setTimeout(() => {
          setInlineDraft({
            kind: 'chat',
            strategyTitle: selectedStrategy.title,
            title: 'Aan is ready',
            approveLabel: 'Approve & execute',
            approveSuccess: 'Custom instruction completed.',
            draft: 'What would you like me to do? Type your instruction below.',
          });
          setTransitional(null);
        }, 600);
      } else {
        setTransitional('loading-chat');
        const seed = d.id === 'critical-image-b0csh8tcc6' ? AAN_SEEDS['image-generate'] : AAN_SEEDS['recommended'];
        setTimeout(() => {
          setInlineDraft({ kind: 'chat', strategyTitle: selectedStrategy.title, title: seed.title, approveLabel: seed.approveLabel, approveSuccess: seed.approveSuccess, draft: seed.draft });
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
    const verifyMsg = inlineDraft.kind === 'email' ? 'Email sent. Aan is monitoring for a reply.' : 'Draft approved. Aan is tracking follow-up.';
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
    <div ref={rootRef} className={styles.reviewWorkspace} style={executed ? { boxShadow: 'inset 0 0 0 1px rgba(66,148,136,0.35), 0 0 40px -10px rgba(66,148,136,0.45)' } : {}}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerBg} style={{ background: executed ? 'linear-gradient(to bottom, rgba(66,148,136,0.08), transparent)' : 'linear-gradient(to bottom, rgba(119,70,155,0.03), transparent)' }} />
        <div className={styles.headerContent}>
          <div className={styles.headerInfo}>
            <div className={styles.headerPills}>
              <SourcePill decision={d} size="sm" />
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}><X size={14} weight="bold" /></button>
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        {executed ? (
          <div className={styles.executedState}>
            <div className={styles.progressRing} style={{ background: `conic-gradient(#429488 ${progressPct}%, #e1e4e8 0)` }}>
              <div className={styles.progressRingInner}>
                <Check size={32} weight="bold" color="#429488" />
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
            {/* Structured detail sections */}
            {d.detailSections && d.detailSections.length > 0 ? (
              <div className={styles.detailSections}>
                {(() => {
                  const bizImpact = d.detailSections!.find(s => s.heading === 'Business Impact');
                  const whatHappened = d.detailSections!.find(s => s.heading === 'What Happened');
                  const rootCause = d.detailSections!.find(s => s.heading === 'Root Cause');
                  const inventoryStatus = d.detailSections!.find(s => s.heading === 'Inventory Status');
                  const aiSummary = d.detailSections!.find(s => s.heading === 'AI Summary');

                  const renderContent = (content: string) => {
                    const lines = content.split('\n');
                    return lines.map((line, i) => {
                      const isBold = d.keyMetrics?.some(m => line.toLowerCase().includes(m.label.toLowerCase()));
                      const isLast = i === lines.length - 1;
                      return (
                        <span key={i} className={isBold ? styles.metricHighlight : undefined}>
                          {line || '\u00A0'}{!isLast && <br />}
                        </span>
                      );
                    });
                  };

                  return (
                    <>
                      {whatHappened && (
                        <div className={styles.detailSection}>
                          <div className={styles.detailHeading}>{whatHappened.heading}</div>
                          <div className={styles.detailContent}>{whatHappened.content}</div>
                        </div>
                      )}

                      {rootCause && (
                        <div className={styles.detailSection}>
                          <div className={styles.detailHeading}>{rootCause.heading}</div>
                          <div className={styles.detailContent}>{rootCause.content}</div>
                        </div>
                      )}

                      {bizImpact && (
                        <div className={styles.detailSection}>
                          <div className={styles.detailHeading}>{bizImpact.heading}</div>
                          <div className={styles.detailContent}>{renderContent(bizImpact.content)}</div>
                        </div>
                      )}

                      {inventoryStatus && (
                        <div className={styles.detailSection}>
                          <div className={styles.detailHeading}>{inventoryStatus.heading}</div>
                          <div className={styles.detailContent}>{inventoryStatus.content}</div>
                        </div>
                      )}

                      {aiSummary && (
                        <div className={styles.collapsibleSection}>
                          <button
                            className={styles.collapsibleHeader}
                            onClick={() => setSummaryExpanded(!summaryExpanded)}
                          >
                            <span>{aiSummary.heading}</span>
                            <span className={`${styles.chevron} ${summaryExpanded ? styles.chevronOpen : ''}`} />
                          </button>
                          {summaryExpanded && (
                            <div className={styles.collapsibleBody}>
                              <div className={styles.detailContent}>{aiSummary.content}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            ) : (
              /* Fallback: basic insight display */
              <div className={styles.section}>
                <p className={styles.text}>{d.insightDetail || d.insight}</p>
              </div>
            )}

            {/* Strategy OR Inline Draft */}
            {transitional ? (
              <div className={styles.transitionLoading}>
                <div className={styles.loadingPulse} />
                <span className={styles.loadingLabel}>Preparing {transitional === 'loading-email' ? 'email draft' : 'ticket draft'}…</span>
              </div>
            ) : inlineDraft ? (
              inlineDraft.kind === 'email' ? (
                <InlineEmailCompose initial={inlineDraft.draft} onCancel={() => setInlineDraft(null)} onSent={completeInlineDraft} />
              ) : (
                <InlineDraftChat
                  title={inlineDraft.title}
                  approveLabel={inlineDraft.approveLabel}
                  approveSuccess={inlineDraft.approveSuccess}
                  initialDraft={inlineDraft.draft}
                  onCancel={() => setInlineDraft(null)}
                  onApprove={completeInlineDraft}
                />
              )
            ) : (
              <div className={styles.section}>
                <div className={styles.eyebrow}>Choose your strategy</div>
                <div className={styles.strategyWrapper}>
                  <StrategyPicker strategies={strategies} selectedId={selectedStrategyId} onSelect={setSelectedStrategyId} />
                </div>
              </div>
            )}

            {/* Related signals */}
            {relationships.length > 0 && (
              <div className={styles.accordions}>
                <div className={styles.accordionHeader}>Related signals · {relationships.length}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {relationships.map((r) => {
                    const other = allDecisions.find((x) => x.id === r.otherId);
                    if (!other) return null;
                    return <RelatedDecisionChip key={r.otherId + r.type} decision={other} type={r.type} onOpen={(id) => onOpenDecision?.(id)} />;
                  })}
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
                if (label === 'Aan') dispatch(delegateToAan(d.id));
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
