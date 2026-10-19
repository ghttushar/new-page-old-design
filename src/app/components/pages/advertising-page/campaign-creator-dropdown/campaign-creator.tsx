// @ts-nocheck -- ported verbatim from the source repo, which uses looser TS settings
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import useSubHeader from '@/hooks/use-sub-header.hook';
import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import './campaign-creator.css';
import {
  EMPTY_DRAFT, STEP_ORDER, accountCampaignLimits, applyCampaignMode, strategiesForMode, flattenProducts, productsFor, recommendTargetingStrategies, structureCounts, validateCampaignLimit,
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
import StepResult from './steps/step-result';

const NUMBERED_STEPS: { id: CcStepId; label: string }[] = [
  { id: 'products', label: 'Products' },
  { id: 'targeting', label: 'Targeting' },
  { id: 'structure', label: 'Structure' },
  { id: 'objectives', label: 'Objectives' },
  { id: 'keywords', label: 'Keywords' },
  { id: 'preview', label: 'Preview' },
];

export default function CampaignCreator() {
  useSubHeader(PageTitleEnum.CAMPAIGN_CREATOR_DROPDOWN, PAGE_TITLE_TOOLTIPS.CAMPAIGN_CREATOR_DROPDOWN);

  const [step, setStep] = useState<CcStepId>('entry');
  const [furthestIndex, setFurthestIndex] = useState(0);
  const [draft, setDraft] = useState<CcDraft>(EMPTY_DRAFT);
  const [jivaOpen, setJivaOpen] = useState(false);
  // Asked after the ad format: Auto, Manual, or both.
  const [modeOpen, setModeOpen] = useState(false);
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd');
  // Which group the later steps are being set up for, once the products have been grouped.
  const [scopeId, setScopeId] = useState(DEFAULT_SCOPE_ID);

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

  // Every group starts Targeting with the recommended routes, so none is left empty just because it was never opened.
  useEffect(() => {
    if (step !== 'targeting' || !draft.marketplace) return;
    setDraft((prev) => {
      const marketplace = prev.marketplace;
      if (!marketplace) return prev;
      const grouped = new Set(prev.productGroups.flatMap((g) => g.productIds));
      const all = flattenProducts(productsFor(marketplace)).filter((p) => prev.productIds.includes(p.id));
      let changed = false;
      const groups = prev.productGroups.map((g) => {
        if (g.settings.targetingStrategies.length > 0) return g;
        const recommended = strategiesForMode(recommendTargetingStrategies(all.filter((p) => g.productIds.includes(p.id)), marketplace), prev.campaignMode);
        if (recommended.length === 0) return g;
        changed = true;
        return { ...g, settings: { ...g.settings, targetingStrategies: recommended } };
      });
      let base = prev.targetingStrategies;
      if (prev.productGroups.length > 0 && base.length === 0) {
        const recommended = strategiesForMode(recommendTargetingStrategies(all.filter((p) => !grouped.has(p.id)), marketplace), prev.campaignMode);
        if (recommended.length > 0) { base = recommended; changed = true; }
      }
      return changed ? { ...prev, productGroups: groups, targetingStrategies: base } : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, draft.productGroups.length]);

  // Groups that still need a choice on the page being shown, marked in the dropdown.
  const pendingScopes = new Set(scopes.filter((g) => {
    if (step === 'objectives') return g.settings.dailyBudget <= 0 || Boolean(g.settings.endDate && g.settings.endDate < g.settings.startDate);
    if (step === 'targeting') return g.settings.targetingStrategies.length === 0;
    if (step === 'structure') return !g.settings.structureId || (g.settings.structureId === 'custom' && !g.settings.customCampaigns);
    return false;
  }).map((g) => g.id));

  // A group is done on a page once it has what the page asks for. Keywords are optional, so there it means some were added.
  const notDone = step === 'keywords' ? new Set(scopes.filter((g) => g.settings.keywordTargets.length + g.settings.negativeKeywords.length === 0).map((g) => g.id)) : pendingScopes;
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

  const structureBlocked = gateScopes.some((g) => !g.settings.structureId || (g.settings.structureId === 'custom' && !g.settings.customCampaigns)) || !limitCheck.ok;

  // Preview guards the Create button: nothing to create, or budgets that don't add up to the daily budget (spec §8.4).
  const previewCampaigns = draft.generatedCampaigns ?? [];
  const previewCount = previewCampaigns.length;
  const planBudget = gateScopes.reduce((sum, g) => sum + g.settings.dailyBudget, 0);
  const previewBudgetOk = allocationMatches(previewCampaigns, planBudget);

  const footers: Partial<Record<CcStepId, { back?: () => void; backLabel?: string; next: () => void; nextLabel: string; disabled?: boolean }>> = {
    entry: { next: () => setModeOpen(true), nextLabel: 'Get started', disabled: !draft.adType },
    products: { back: () => goTo('entry'), next: () => advance('targeting'), nextLabel: 'Continue', disabled: draft.productIds.length === 0 },
    keywords: { back: () => goTo('objectives'), next: () => advance('preview'), nextLabel: 'Continue' },
    objectives: { back: () => goTo('structure'), next: () => advance('keywords'), nextLabel: 'Continue', disabled: gateScopes.some((g) => g.settings.dailyBudget <= 0 || Boolean(g.settings.endDate && g.settings.endDate < g.settings.startDate)) },
    targeting: { back: () => goTo('products'), next: () => advance('structure'), nextLabel: 'Continue', disabled: gateScopes.some((g) => g.settings.targetingStrategies.length === 0) },
    structure: { back: () => goTo('targeting'), next: () => advance('objectives'), nextLabel: 'Continue', disabled: structureBlocked },
    preview: {
      back: () => goTo('keywords'), next: () => { setDir('fwd'); setStep('creating'); },
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
    <CampaignSummaryProvider value={{ step, draft: step === 'products' ? draft : viewDraft, selectedProducts: step === 'products' ? selectedProducts : viewProducts, onJump: goTo, steps: NUMBERED_STEPS, furthestIndex, totalProducts: selectedProducts.length, scopes: ['keywords', 'objectives', 'targeting', 'structure'].includes(step) ? scopes : undefined, activeScopeId: activeScopeId ?? undefined, pendingScopes: notDone, onScopeChange: setScopeId, onApplyToGroups: applyToGroups, onUndoApply: undoApply, appliedCount }}>
    <div ref={rootRef} className="ccd-root" style={{ height: rootHeight ?? '100%', display: 'flex', background: 'var(--ccd-page-bg)', fontFamily: 'Inter, sans-serif' }}>
      <CcGlobalStyles />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

      {framed && (
      <header className="ccd-topbar"><JourneyBar /></header>
      )}

      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <main ref={mainRef} className="ccd-scroll" style={{ flex: 1, minWidth: 0, overflowY: 'auto', overflowX: 'hidden' }}>
          <div className={framed || step === 'entry' ? 'ccd-workspace' : 'ccd-focus'} style={{ maxWidth: framed || step === 'entry' ? 1560 : focusWidth + 64 }}>
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
                {step === 'entry' && <StepEntry draft={draft} onChange={update} />}
                {step === 'products' && <StepProducts draft={draft} products={products} selectedProducts={selectedProducts} onChange={update} />}
                {step === 'keywords' && <StepKeywords key={activeScopeId} draft={viewDraft} onChange={viewUpdate} />}
                {step === 'objectives' && <StepObjectives key={activeScopeId} draft={viewDraft} selectedProducts={viewProducts} onChange={viewUpdate} />}
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
          <div>{footer.back && <GhostButton onClick={footer.back}>{footer.backLabel ?? 'Back'}</GhostButton>}</div>
          <div />
          <div className="ccd-footer__end">
            {scopes.length > 0 && ['keywords', 'objectives', 'targeting', 'structure'].includes(step) && (
              <span className={`ccd-footer__groups${completedScopes === scopes.length ? ' is-done' : ''}`}><small>Groups completed</small><strong>{completedScopes} of {scopes.length}</strong></span>
            )}
            <PrimaryButton onClick={footer.next} disabled={footer.disabled}>{footer.nextLabel} {step !== 'result' && <ArrowRightIcon size={14} />}</PrimaryButton>
          </div>
        </footer>
      )}
      </div>
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
