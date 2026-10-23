// @ts-nocheck -- ported verbatim from the source repo, which uses looser TS settings
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import './campaign-creator.css';
import {
  EMPTY_DRAFT, STEP_ORDER, accountCampaignLimits, objectiveDefaults, objectivesBlocked, applyCampaignMode, flattenProducts, productsFor, structureCounts, targetingBlocked, keywordsBlocked, validateCampaignLimit,
  type CcDraft, type CcStepId,
} from './campaign-creator.types';
import { ArrowRightIcon, CcGlobalStyles, GhostButton, HAIR, PrimaryButton } from './campaign-creator-ui';
import { CampaignSummaryProvider, Panel } from './ccd-design';
import { JourneyBar } from './campaign-inline-summary';
import StepEntry from './steps/step-entry';
import StepProducts from './steps/step-products';
import StepKeywords from './steps/step-keywords';
import StepObjectives from './steps/step-objectives';
import StepTargeting from './steps/step-targeting';
import StepStructure from './steps/step-structure';
import JivaStructurePanel from './steps/jiva-structure-panel';
import StepPreview from './steps/step-preview';
import { DEFAULT_SCOPE_ID, applyPageToGroups, applyScopedPatch, buildScopes, pickSettings, placeUngrouped, pruneGroups, totalCampaignsFor } from './product-groups';
import { allocationMatches } from './steps/budget-math';
import StepCreating from './steps/step-creating';
import CampaignModeDialog from './steps/campaign-mode-dialog';
import MarketplaceHeader from './marketplace-header';
import StepResult from './steps/step-result';
import CreationActivity, { ActivityButton } from './steps/creation-activity';
import { SEED_RUNS, advanceCounts, type CreationRun, type RunIssue } from './steps/creation-runs.mock';

const NUMBERED_STEPS: { id: CcStepId; label: string }[] = [
  { id: 'products', label: 'Products' },
  { id: 'targeting', label: 'Targeting' },
  { id: 'structure', label: 'Structure' },
  { id: 'objectives', label: 'Objectives' },
  { id: 'keywords', label: 'Keywords' },
  { id: 'preview', label: 'Preview' },
];

export default function CampaignCreator() {

  const [step, setStep] = useState<CcStepId>('entry');

  // The page header carries the Marketplace dropdown (MarketplaceHeader, below) on every step; it only opens on the ad
  // format page, since every later choice depends on the marketplace.
  const onEntry = step === 'entry';
  const [furthestIndex, setFurthestIndex] = useState(0);
  const [draft, setDraft] = useState<CcDraft>(EMPTY_DRAFT);
  const [jivaOpen, setJivaOpen] = useState(false);
  // Asked after the ad format: Auto, Manual, or both.
  const [modeOpen, setModeOpen] = useState(false);
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd');
  // Which group the later steps are being set up for, once the products have been grouped.
  const [scopeId, setScopeId] = useState(DEFAULT_SCOPE_ID);

  // Creation activity: runs still being created, and the ones that failed.
  const [runs, setRuns] = useState<CreationRun[]>(SEED_RUNS);
  const [finishedId, setFinishedId] = useState<string | null>(null);
  // A rejected setting being fixed after a configuration retry.
  const [issue, setIssue] = useState<(RunIssue & { runId: string }) | null>(null);

  // Runs in process count up, each at its own pace, and finish once everything is created.
  const processingKey = runs.filter((r) => r.status === 'processing' && !r.steady).map((r) => r.id + (r.pace ?? 300)).join(',');
  useEffect(() => {
    const live = runs.filter((r) => r.status === 'processing' && !r.steady);
    const timers = live.map((run) => window.setInterval(() => {
      setRuns((prev) => prev.map((r) => {
        if (r.id !== run.id || r.status !== 'processing') return r;
        const next = advanceCounts(r.created);
        if (next) return { ...r, created: next };
        setFinishedId(r.id);
        return { ...r, status: 'done' };
      }));
    }, run.pace ?? 300));
    return () => timers.forEach(window.clearInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processingKey]);

  // Pin the wizard to the viewport so the footer always sits at the bottom, whatever the step's content height.
  const rootRef = useRef<HTMLDivElement>(null);
  const [rootHeight, setRootHeight] = useState<number | null>(null);
  useLayoutEffect(() => {
    const measure = () => {
      if (rootRef.current) setRootHeight(Math.max(420, window.innerHeight - rootRef.current.getBoundingClientRect().top));
    };
    measure();
    // The page chrome (sub-header) mounts after this component, shifting our top edge — re-measure once it settles.
    const timers = [60, 250, 800].map((ms) => window.setTimeout(measure, ms));
    window.addEventListener('resize', measure);
    return () => { timers.forEach(window.clearTimeout); window.removeEventListener('resize', measure); };
  }, []);

  // A new step starts at the top, not wherever the last one was scrolled to.
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => { mainRef.current?.scrollTo({ top: 0 }); }, [step]);

  const update = (patch: Partial<CcDraft>) => setDraft((prev) => ({ ...prev, ...patch }));

  const products = useMemo(() => (draft.marketplace ? productsFor(draft.marketplace) : []), [draft.marketplace]);
  const selectedProducts = useMemo(() => flattenProducts(products).filter((p) => draft.productIds.includes(p.id)), [products, draft.productIds]);

  // Campaigns the account can still add — what a structure is validated against (spec §7.6).
  const campaignLimit = draft.marketplace ? accountCampaignLimits(draft.marketplace).available : 1000;

  // Product groups: each group (and the products in no group) is set up on its own, picked from a dropdown on each step.
  const scopes = useMemo(() => buildScopes(draft, selectedProducts), [draft, selectedProducts]);
  const activeScope = scopes.find((s) => s.id === scopeId) ?? scopes[0] ?? null;
  const viewDraft = activeScope ? activeScope.draft : draft;
  const viewProducts = activeScope ? activeScope.products : selectedProducts;
  const activeScopeId = activeScope?.id ?? null;
  const viewUpdate = (patch: Partial<CcDraft>) => setDraft((prev) => ({ ...prev, ...(activeScopeId ? applyScopedPatch(prev, activeScopeId, patch) : patch) }));
  const gateScopes = scopes.length ? scopes : [{ id: 'all', name: '', products: selectedProducts, settings: pickSettings(draft) }];

  // A product that is no longer selected leaves its group, and an empty group goes away.
  useEffect(() => {
    if (pruneGroups(draft.productGroups, draft.productIds) !== draft.productGroups) {
      setDraft((prev) => ({ ...prev, productGroups: pruneGroups(prev.productGroups, prev.productIds) }));
    }
  }, [draft.productIds, draft.productGroups]);

  // Every product is always in a group: new ones join Group 1 (made when the first products are added).
  useEffect(() => {
    if (placeUngrouped(draft)) {
      setDraft((prev) => { const next = placeUngrouped(prev); return next ? { ...prev, productGroups: next } : prev; });
    }
  }, [draft.productIds, draft.productGroups]);

  // Groups that still need a choice on the page being shown, marked in the dropdown.
  const pendingScopes = new Set(scopes.filter((g) => {
    if (step === 'objectives') return objectivesBlocked(g.settings, draft.marketplace) || Boolean(issue && g.settings.dailyBudget < issue.min);
    if (step === 'targeting') return targetingBlocked(g.settings);
    if (step === 'structure') return !g.settings.structureId || (g.settings.structureId === 'custom' && !g.settings.customCampaigns);
    return false;
  }).map((g) => g.id));

  // A group is done on a page once it has what the page asks for. Keywords are optional, so there it means some were added.
  const notDone = step === 'keywords' ? new Set(scopes.filter((g) => keywordsBlocked(g.settings, draft.marketplace)).map((g) => g.id)) : pendingScopes;
  const completedScopes = scopes.length - notDone.size;

  // Copy this page's setup from the group being set up to the groups ticked in the dropdown, with one step of undo.
  const undoApplyRef = useRef<Partial<CcDraft> | null>(null);
  const [appliedCount, setAppliedCount] = useState<number | null>(null);
  useEffect(() => {
    if (appliedCount === null) return undefined;
    const id = window.setTimeout(() => { undoApplyRef.current = null; setAppliedCount(null); }, 15000);
    return () => window.clearTimeout(id);
  }, [appliedCount]);
  useEffect(() => { undoApplyRef.current = null; setAppliedCount(null); }, [step, activeScopeId]);
  const applyToGroups = (ids: string[]) => {
    if (!activeScopeId) return;
    const result = applyPageToGroups(draft, activeScopeId, step, new Set(ids));
    if (!result) return;
    undoApplyRef.current = result.undo;
    setDraft((prev) => ({ ...prev, ...result.patch }));
    setAppliedCount(result.count);
  };
  const undoApply = () => {
    const before = undoApplyRef.current;
    undoApplyRef.current = null;
    if (before) setDraft((prev) => ({ ...prev, ...before }));
    setAppliedCount(null);
  };

  // The rejected setting is open while any group still breaks it.
  const issueOpen = Boolean(issue && issue.field === 'dailyBudget' && gateScopes.some((g) => g.settings.dailyBudget < issue.min));

  const totalCampaigns = totalCampaignsFor(gateScopes);
  const limitCheck = totalCampaigns !== null ? validateCampaignLimit(totalCampaigns, campaignLimit) : { ok: true };

  const heading = (id: CcStepId) => setDir(STEP_ORDER.indexOf(id) >= STEP_ORDER.indexOf(step) ? 'fwd' : 'back');
  function goTo(id: CcStepId) {
    heading(id);
    setJivaOpen(false);
    setStep(id);
  }
  function advance(id: CcStepId) {
    const idx = NUMBERED_STEPS.findIndex((s) => s.id === id);
    if (idx >= 0) setFurthestIndex((prev) => Math.max(prev, idx));
    heading(id);
    setJivaOpen(false);
    setStep(id);
  }

  const numberedIndex = NUMBERED_STEPS.findIndex((s) => s.id === step);

  // Leaving the flow for the start or the activity page drops the fix in progress.
  useEffect(() => { if (step === 'entry' || step === 'activity') setIssue(null); }, [step]);

  function retryRun(run: CreationRun) {
    setFinishedId(null);
    if (run.kind === 'backend') {
      // The same request again: progress starts over and counts up.
      setRuns((prev) => prev.map((r) => (r.id === run.id ? {
        ...r, status: 'processing', pace: 320,
        created: { campaigns: [0, r.created.campaigns[1]], adGroups: [0, r.created.adGroups[1]], productAds: [0, r.created.productAds[1]], targets: [0, r.created.targets[1]] },
      } : r)));
      return;
    }
    if (run.kind === 'config' && run.draft && run.issue) {
      // The saved setup goes back into the creator, on the step where the marketplace rejected it.
      const saved = run.draft();
      setDraft(saved);
      setScopeId(saved.productGroups[0]?.id ?? DEFAULT_SCOPE_ID);
      setFurthestIndex(NUMBERED_STEPS.length - 1);
      setIssue({ ...run.issue, runId: run.id });
      setDir('fwd');
      setJivaOpen(false);
      setStep(run.issue.step);
    }
  }


  const structureBlocked = gateScopes.some((g) => !g.settings.structureId || (g.settings.structureId === 'custom' && !g.settings.customCampaigns)) || !limitCheck.ok;

  // Preview guards the Create button: nothing to create, or budgets that don't add up to the daily budget (spec §8.4).
  const previewCampaigns = draft.generatedCampaigns ?? [];
  const previewCount = previewCampaigns.length;
  const planBudget = gateScopes.reduce((sum, g) => sum + g.settings.dailyBudget, 0);
  const previewBudgetOk = allocationMatches(previewCampaigns, planBudget);

  const footers: Partial<Record<CcStepId, { back?: () => void; backLabel?: string; next?: () => void; nextLabel?: string; disabled?: boolean }>> = {
    entry: { next: () => setModeOpen(true), nextLabel: 'Get started', disabled: !draft.adType },
    activity: { back: () => goTo('entry'), backLabel: 'Create campaign' },
    products: { back: () => goTo('entry'), next: () => advance('targeting'), nextLabel: 'Continue', disabled: draft.productIds.length === 0 },
    keywords: { back: () => goTo('objectives'), next: () => advance('preview'), nextLabel: 'Continue', disabled: gateScopes.some((g) => keywordsBlocked(g.settings, draft.marketplace)) },
    objectives: { back: () => goTo('structure'), next: () => advance('keywords'), nextLabel: 'Continue', disabled: issueOpen || gateScopes.some((g) => objectivesBlocked(g.settings, draft.marketplace)) },
    targeting: { back: () => goTo('products'), next: () => advance('structure'), nextLabel: 'Continue', disabled: gateScopes.some((g) => targetingBlocked(g.settings)) },
    structure: { back: () => goTo('targeting'), next: () => advance('objectives'), nextLabel: 'Continue', disabled: structureBlocked },
    preview: {
      back: () => goTo('keywords'),
      next: () => {
        // A fixed run goes through this time, so it leaves the failed list.
        if (issue) { setRuns((prev) => prev.map((r) => (r.id === issue.runId ? { ...r, status: 'done' } : r))); setIssue(null); }
        setDir('fwd'); setStep('creating');
      },
      nextLabel: previewCount > 0 ? `Create ${previewCount} campaign${previewCount === 1 ? '' : 's'}` : 'Create campaigns',
      disabled: previewCount === 0 || !previewBudgetOk,
    },
    result: {
      back: () => { setDraft(EMPTY_DRAFT); setFurthestIndex(0); setStep('entry'); }, backLabel: 'Create another',
      next: () => {}, nextLabel: 'Go to Campaign Manager',
    },
  };
  const footer = footers[step];
  const framed = numberedIndex >= 0;
  const slide = dir === 'fwd' ? 28 : -28;
  const focusWidth = step === 'result' ? 880 : step === 'creating' ? 720 : 760;

  return (
    <MotionConfig reducedMotion="user">
    <CampaignSummaryProvider value={{ step, draft: step === 'products' ? draft : viewDraft, selectedProducts: step === 'products' ? selectedProducts : viewProducts, onJump: goTo, steps: NUMBERED_STEPS, furthestIndex, totalProducts: selectedProducts.length, groupCount: draft.productGroups.length, scopes: ['keywords', 'objectives', 'targeting', 'structure'].includes(step) ? scopes : undefined, activeScopeId: activeScopeId ?? undefined, pendingScopes: notDone, onScopeChange: setScopeId, onApplyToGroups: applyToGroups, onUndoApply: undoApply, appliedCount, issueStep: issueOpen ? issue?.step : undefined }}>
    <div ref={rootRef} className="ccd-root" style={{ height: rootHeight ?? '100%', display: 'flex', background: 'var(--ccd-page-bg)', fontFamily: 'Inter, sans-serif' }}>
      <CcGlobalStyles />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

      {framed && (
      <header className="ccd-topbar"><JourneyBar /></header>
      )}

      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <main ref={mainRef} className="ccd-scroll" style={{ flex: 1, minWidth: 0, overflowY: 'auto', overflowX: 'hidden' }}>
          <div className={framed || step === 'entry' || step === 'activity' ? 'ccd-workspace' : 'ccd-focus'} style={{ maxWidth: framed || step === 'entry' || step === 'activity' ? 1560 : focusWidth + 64 }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                className="ccd-stage"
                initial={{ opacity: 0, x: slide }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -slide / 2 }}
                transition={{ duration: 0.3, ease: [0.22, 0.8, 0.3, 1] }}
                style={{ flex: 1, minWidth: 0 }}
              >
                {step === 'entry' && (
                  <StepEntry draft={draft} onChange={update} />
                )}
                {step === 'activity' && <CreationActivity runs={runs} finished={runs.find((r) => r.id === finishedId) ?? null} onRetry={retryRun} />}
                {step === 'products' && <StepProducts draft={draft} products={products} selectedProducts={selectedProducts} onChange={update} />}
                {step === 'keywords' && <StepKeywords key={activeScopeId} draft={viewDraft} onChange={viewUpdate} />}
                {step === 'objectives' && <StepObjectives key={activeScopeId} draft={viewDraft} selectedProducts={viewProducts} onChange={viewUpdate} issue={issueOpen ? issue : null} />}
                {step === 'targeting' && <StepTargeting key={activeScopeId} draft={viewDraft} selectedProducts={viewProducts} onChange={viewUpdate} />}
                {step === 'structure' && (
                  <StepStructure key={activeScopeId} draft={viewDraft} selectedProducts={viewProducts} campaignLimit={campaignLimit} jivaOpen={jivaOpen} onChange={viewUpdate} onJivaChange={setJivaOpen} />
                )}
                {step === 'preview' && <StepPreview draft={draft} selectedProducts={selectedProducts} scopes={scopes} onChange={update} />}
                {step === 'creating' && <Panel pad={40} className="ccd-hero"><StepCreating draft={draft} selectedProducts={selectedProducts} onDone={() => { setDir('fwd'); setStep('result'); }} /></Panel>}
                {step === 'result' && <Panel pad={40} className="ccd-hero"><StepResult draft={draft} selectedProducts={selectedProducts} /></Panel>}

              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      {footer && step !== 'creating' && (
        <footer className="ccd-footer">
          <div>
            {step === 'entry' ? (
              <ActivityButton
                processing={runs.filter((r) => r.status === 'processing').length} failed={runs.filter((r) => r.status === 'failed').length}
                onClick={() => { setFinishedId(null); goTo('activity'); }}
              />
            ) : footer.back && <GhostButton onClick={footer.back}>{footer.backLabel ?? 'Back'}</GhostButton>}
          </div>
          <div />
          <div className="ccd-footer__end">
            {scopes.length > 0 && ['keywords', 'objectives', 'targeting', 'structure'].includes(step) && (
              <span className={`ccd-footer__groups${completedScopes === scopes.length ? ' is-done' : ''}`}><small>Groups completed</small><strong>{completedScopes} of {scopes.length}</strong></span>
            )}
            {footer.next && <PrimaryButton onClick={footer.next} disabled={footer.disabled}>{footer.nextLabel} {step !== 'result' && <ArrowRightIcon size={14} />}</PrimaryButton>}
          </div>
        </footer>
      )}
      </div>
        <MarketplaceHeader
          value={draft.marketplace} disabled={!onEntry}
          onMarketplace={(marketplace) => setDraft((prev) => (prev.marketplace === marketplace ? prev : { ...EMPTY_DRAFT, ...objectiveDefaults(marketplace), adType: prev.adType, marketplace }))}
        />
        <CampaignModeDialog
          open={modeOpen} value={draft.campaignMode} onClose={() => setModeOpen(false)}
          onConfirm={(mode) => { setDraft((prev) => ({ ...prev, ...applyCampaignMode(prev, mode) })); setModeOpen(false); advance('products'); }}
        />
        <AnimatePresence>
          {step === 'structure' && jivaOpen && (
            <motion.div
              key="jiva"
              initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              style={{ display: 'flex', flex: 'none', padding: '9px 9px 9px 0' }}
            >
              <JivaStructurePanel draft={viewDraft} selectedProducts={viewProducts} onChange={viewUpdate} onClose={() => setJivaOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
    </div>
    </CampaignSummaryProvider>
    </MotionConfig>
  );
}
