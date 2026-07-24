import { useMemo, useState, useEffect, useRef } from 'react';
import { X, Check, Prohibit, Clock, ShareNetwork, Sparkle, ArrowElbowDownLeft, ArrowCounterClockwise, Pulse } from '@phosphor-icons/react';
import { Accordion, AccordionSummary, AccordionDetails, AccordionActions } from '@mui/material';
import styles from './review-workspace.module.scss';
import type { Decision } from '@/constants/signals/decisions.constants';
import { formatValue } from '@/utils/signals/valueFormat';
import { strategiesFor, type Strategy } from '@/utils/signals/strategies';
import { relationshipsFor } from '@/utils/signals/relationships';
import { sourcePillFor } from '@/utils/signals/sourcePill';
import { livingStatusPhrase } from '@/utils/signals/lifecycle';
import { useLivingTick } from '@/hooks/use-living-clock';
import { useDispatch } from 'react-redux';
import { approveDecision, delegateToAan, rejectDecision, snoozeDecision, rollbackDecision } from '@/redux/slices/signals/signals.slice';
import { StrategyPicker } from './strategy-picker';
import { ExecutionPlan } from './execution-plan';
import { RelatedDecisionChip } from './related-decision-chip';
import { AssignMenu } from './assign-menu';
import { DiscussDrawer } from './discuss-drawer';
import { InlineEmailCompose, type EmailDraft } from './inline/inline-email-compose';
import { InlineDraftChat } from './inline/inline-draft-chat';
import { SourcePill } from '../chips/source-pill';
import { ValuePill } from '../chips/value-pill';
import { LivingStatusChip } from '../chips/living-status-chip';
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

type State = 'healthy' | 'trending_up' | 'blocked' | 'critical' | 'recovering';

function quickState(d: Decision): State {
  if (d.severity === 'critical') return 'critical';
  if (d.status === 'in_flight' || d.status === 'with_aan') return 'recovering';
  if (d.severity === 'opportunity') return 'trending_up';
  if (d.status === 'snoozed') return 'blocked';
  return 'healthy';
}

const STATE_LABEL: Record<State, string> = {
  healthy: 'Healthy', trending_up: 'Trending up', blocked: 'Blocked',
  critical: 'Critical', recovering: 'Recovering',
};

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
};

export function ReviewWorkspace({ decision: d, decisions = [], onClose, onOpenDecision }: Props) {
  const dispatch = useDispatch();
  const [discuss, setDiscuss] = useState(false);
  const [inlineDraft, setInlineDraft] = useState<{ kind: 'email'; strategyTitle: string; draft: EmailDraft } | { kind: 'chat'; strategyTitle: string; title: string; approveLabel: string; approveSuccess: string; draft: string } | null>(null);
  const tick = useLivingTick();
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
    let verifyMsg = 'Change applied. Verifying downstream metrics…';
    let canUndo = true;

    const isInlineDraftAction = shortId === 'notify-vm' || shortId === 'draft-ticket' || (shortId === 'recommended' && d.id === 'critical-b0csh8tcc6');

    if (isInlineDraftAction) {
      if (shortId === 'notify-vm') {
        setInlineDraft({ kind: 'email', strategyTitle: selectedStrategy.title, draft: NOTIFY_VM_EMAIL });
      } else if (shortId === 'draft-ticket') {
        const seed = AAN_SEEDS['draft-ticket'];
        setInlineDraft({ kind: 'chat', strategyTitle: selectedStrategy.title, title: seed.title, approveLabel: seed.approveLabel, approveSuccess: seed.approveSuccess, draft: seed.draft });
      } else {
        const seed = AAN_SEEDS['recommended'];
        setInlineDraft({ kind: 'chat', strategyTitle: selectedStrategy.title, title: seed.title, approveLabel: seed.approveLabel, approveSuccess: seed.approveSuccess, draft: seed.draft });
      }
      return;
    }

    if (selectedStrategy.id.endsWith(':wait')) {
      const until = Date.now() + 20 * 60 * 60 * 1000;
      dispatch(snoozeDecision({ id: d.id, until }));
      verifyMsg = 'Queued for tomorrow 8am. Aan will re-check with fresh data.';
      canUndo = true;
    } else if (selectedStrategy.id.endsWith(':aan')) {
      dispatch(delegateToAan(d.id));
      verifyMsg = 'Aan is executing within its policy budget.';
      canUndo = true;
    } else {
      dispatch(approveDecision(d.id));
      verifyMsg = 'Change applied. Verifying downstream metrics…';
      canUndo = true;
    }

    setExecuted({ strategyTitle: selectedStrategy.title, verifyMsg, canUndo });
    startCountdown();
  }

  function completeInlineDraft() {
    if (!inlineDraft) return;
    const strategyTitle = inlineDraft.strategyTitle;
    const verifyMsg = inlineDraft.kind === 'email' ? 'Email sent. Aan is monitoring for a reply.' : 'Draft approved. Aan is tracking follow-up.';
    setInlineDraft(null);
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

  const state = quickState(d);
  const val = formatValue({ cents: d.valueCents, kind: d.valueKind, cadence: d.cadence });
  const isTerminal = d.status === 'completed' || d.status === 'rejected';
  const isRunning = d.status === 'in_flight' || d.status === 'with_aan';
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
              <span className={styles.domainLabel}>{d.domain}</span>
            </div>
            <h2 className={styles.title}>{d.insight}</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}><X size={14} weight="bold" /></button>
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        {executed ? (
          /* Post-execute confirmation */
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
            {/* Current State */}
            <div className={styles.section}>
              <div className={styles.eyebrow}>Current state</div>
              <div className={styles.stateRow}>
                <span className={styles.stateBadge} style={{
                  background: state === 'critical' ? 'rgba(255,0,0,0.1)' : state === 'trending_up' ? 'rgba(119,70,155,0.08)' : state === 'recovering' ? 'rgba(241,160,58,0.1)' : 'rgba(154,154,154,0.1)',
                  color: state === 'critical' ? '#ff0000' : state === 'trending_up' ? '#77469b' : state === 'recovering' ? '#e6a817' : '#7c7c7c',
                  borderColor: state === 'critical' ? 'rgba(255,0,0,0.25)' : state === 'trending_up' ? 'rgba(119,70,155,0.25)' : state === 'recovering' ? 'rgba(241,160,58,0.25)' : 'rgba(154,154,154,0.25)',
                }}>
                  <Pulse size={12} /> {STATE_LABEL[state]}
                </span>
                {isRunning && <LivingStatusChip decision={d} />}
              </div>
              <p className={styles.text}>{d.insightDetail || d.insight}</p>
            </div>

            {/* Why it Matters */}
            <div className={styles.section}>
              <div className={styles.eyebrow}>Why it matters</div>
              <div className={styles.valueCard}>
                <div className={styles.valueAmount} style={{
                  color: d.valueKind === 'gain' ? '#429488' : d.valueKind === 'cost' ? '#f1a03a' : d.valueKind === 'at_risk' ? '#d97706' : '#23272d',
                }}>
                  {val.text}
                </div>
              </div>
              <p className={styles.text}>{d.valueBasis || 'This affects near-term revenue and needs a decision within the next 48 hours.'}</p>
            </div>

            {/* Evidence */}
            {d.valueInputs && d.valueInputs.length > 0 && (
              <div className={styles.section}>
                <div className={styles.eyebrow}>Evidence</div>
                <ul className={styles.evidenceList}>
                  {d.valueInputs.map((line, i) => (
                    <li key={i}>
                      <span className={styles.evidenceDot} />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Strategy OR Inline Draft */}
            {inlineDraft ? (
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

            {/* Collapsed extras */}
            <div className={styles.accordions}>
              {relationships.length > 0 && (
                <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' }, borderTop: '1px solid #e1e4e8' }}>
                  <AccordionSummary sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#7c7c7c', textTransform: 'uppercase', letterSpacing: '0.1em', minHeight: 0, '& .MuiAccordionSummary-content': { margin: '8px 0' } }}>
                    Related signals · {relationships.length}
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0, pb: 1 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {relationships.map((r) => {
                        const other = allDecisions.find((x) => x.id === r.otherId);
                        if (!other) return null;
                        return <RelatedDecisionChip key={r.otherId + r.type} decision={other} type={r.type} onOpen={(id) => onOpenDecision?.(id)} />;
                      })}
                    </div>
                  </AccordionDetails>
                </Accordion>
              )}
              <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' }, borderTop: '1px solid #e1e4e8' }}>
                <AccordionSummary sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#7c7c7c', textTransform: 'uppercase', letterSpacing: '0.1em', minHeight: 0, '& .MuiAccordionSummary-content': { margin: '8px 0' } }}>
                  Execution plan
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, pb: 1 }}>
                  {selectedStrategy && <ExecutionPlan strategy={selectedStrategy} />}
                </AccordionDetails>
              </Accordion>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      {!executed && !inlineDraft && (
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
              <button className={styles.footerBtn} onClick={() => setDiscuss(true)}><Sparkle size={14} /> Modify</button>
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