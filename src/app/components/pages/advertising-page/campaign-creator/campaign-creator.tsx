// @ts-nocheck -- ported verbatim from the source repo, which uses looser TS settings
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import useSubHeader from '@/hooks/use-sub-header.hook';
import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import './campaign-creator.css';
import {
  EMPTY_DRAFT, STEP_ORDER, accountCampaignLimits, flattenProducts, productsFor, structureCounts, validateCampaignLimit,
  type CcDraft, type CcStepId,
} from './campaign-creator.types';
import { ArrowRightIcon, CcGlobalStyles, GhostButton, HAIR, PrimaryButton } from './campaign-creator-ui';
import { CampaignSummaryProvider, Panel, Stepper } from './cc-design';
import StepEntry from './steps/step-entry';
import StepProducts from './steps/step-products';
import StepObjectives from './steps/step-objectives';
import StepTargeting from './steps/step-targeting';
import StepStructure from './steps/step-structure';
import JivaStructurePanel from './steps/jiva-structure-panel';
import StepPreview from './steps/step-preview';
import { allocationMatches } from './steps/budget-math';
import StepCreating from './steps/step-creating';
import StepResult from './steps/step-result';

const NUMBERED_STEPS: { id: CcStepId; label: string }[] = [
  { id: 'products', label: 'Products' },
  { id: 'objectives', label: 'Objectives' },
  { id: 'targeting', label: 'Targeting' },
  { id: 'structure', label: 'Structure' },
  { id: 'preview', label: 'Preview' },
];

export default function CampaignCreator() {
  useSubHeader(PageTitleEnum.CAMPAIGN_CREATOR, PAGE_TITLE_TOOLTIPS.CAMPAIGN_CREATOR);

  const [step, setStep] = useState<CcStepId>('entry');
  const [furthestIndex, setFurthestIndex] = useState(0);
  const [draft, setDraft] = useState<CcDraft>(EMPTY_DRAFT);
  const [jivaOpen, setJivaOpen] = useState(false);
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd');

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

  const manualTypesCount = draft.targetingStrategies.filter((s) => s !== 'auto').length;
  const hasAuto = draft.targetingStrategies.includes('auto');
  // Campaigns the account can still add — what a structure is validated against (spec §7.6).
  const campaignLimit = draft.marketplace ? accountCampaignLimits(draft.marketplace).available : 1000;
  const counts = draft.structureId && draft.structureId !== 'custom'
    ? structureCounts(draft.structureId, selectedProducts.length, hasAuto, manualTypesCount, draft.autoTypes.length)
    : null;
  const limitCheck = counts ? validateCampaignLimit(counts.totalCampaigns, campaignLimit) : { ok: true };

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

  const structureBlocked = !draft.structureId
    || (draft.structureId !== 'custom' && !limitCheck.ok)
    || (draft.structureId === 'custom' && !draft.customCampaigns);

  // Preview guards the Create button: nothing to create, or budgets that don't add up to the daily budget (spec §8.4).
  const previewCampaigns = draft.generatedCampaigns ?? [];
  const previewCount = previewCampaigns.length;
  const previewBudgetOk = allocationMatches(previewCampaigns, draft.dailyBudget);

  const footers: Partial<Record<CcStepId, { back?: () => void; backLabel?: string; next: () => void; nextLabel: string; disabled?: boolean }>> = {
    entry: { next: () => advance('products'), nextLabel: 'Get started', disabled: !draft.adType },
    products: { back: () => goTo('entry'), next: () => advance('objectives'), nextLabel: 'Continue', disabled: draft.productIds.length === 0 },
    objectives: { back: () => goTo('products'), next: () => advance('targeting'), nextLabel: 'Continue', disabled: draft.dailyBudget <= 0 },
    targeting: { back: () => goTo('objectives'), next: () => advance('structure'), nextLabel: 'Continue', disabled: draft.targetingStrategies.length === 0 },
    structure: { back: () => goTo('targeting'), next: () => advance('preview'), nextLabel: 'Continue', disabled: structureBlocked },
    preview: {
      back: () => goTo('structure'), next: () => { setDir('fwd'); setStep('creating'); },
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
  const showStepper = framed;

  return (
    <MotionConfig reducedMotion="user">
    <CampaignSummaryProvider value={{ step, draft, selectedProducts, onJump: goTo }}>
    <div ref={rootRef} className="cc-root" style={{ height: rootHeight ?? '100%', display: 'flex', background: 'var(--cc-page-bg)', fontFamily: 'Inter, sans-serif' }}>
      <CcGlobalStyles />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

      {framed && (
      <header className="cc-topbar">
        <div />
        <div className="cc-topbar__stepper">{showStepper && <Stepper steps={NUMBERED_STEPS} current={step} furthestIndex={furthestIndex} onJump={goTo} />}</div>
        <div />
      </header>
      )}

      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <main ref={mainRef} className="cc-scroll" style={{ flex: 1, minWidth: 0, overflowY: 'auto', overflowX: 'hidden' }}>
          <div className={framed || step === 'entry' ? 'cc-workspace' : 'cc-focus'} style={{ maxWidth: framed || step === 'entry' ? 1560 : focusWidth + 64 }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                className="cc-stage"
                initial={{ opacity: 0, x: slide }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -slide / 2 }}
                transition={{ duration: 0.3, ease: [0.22, 0.8, 0.3, 1] }}
                style={{ flex: 1, minWidth: 0 }}
              >
                 {step === 'entry' && <StepEntry draft={draft} onChange={update} />}
                {step === 'products' && <StepProducts draft={draft} products={products} selectedProducts={selectedProducts} onChange={update} />}
                {step === 'objectives' && <StepObjectives draft={draft} selectedProducts={selectedProducts} onChange={update} />}
                {step === 'targeting' && <StepTargeting draft={draft} selectedProducts={selectedProducts} onChange={update} />}
                {step === 'structure' && (
                  <StepStructure draft={draft} selectedProducts={selectedProducts} campaignLimit={campaignLimit} jivaOpen={jivaOpen} onChange={update} onJivaChange={setJivaOpen} />
                )}
                {step === 'preview' && <StepPreview draft={draft} selectedProducts={selectedProducts} onChange={update} />}
                {step === 'creating' && <Panel pad={40} className="cc-hero"><StepCreating draft={draft} selectedProducts={selectedProducts} onDone={() => { setDir('fwd'); setStep('result'); }} /></Panel>}
                {step === 'result' && <Panel pad={40} className="cc-hero"><StepResult draft={draft} selectedProducts={selectedProducts} /></Panel>}

              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      {footer && step !== 'creating' && (
        <footer className="cc-footer">
          <div>{footer.back && <GhostButton onClick={footer.back}>{footer.backLabel ?? 'Back'}</GhostButton>}</div>
          <div />
          <PrimaryButton onClick={footer.next} disabled={footer.disabled}>{footer.nextLabel} {step !== 'result' && <ArrowRightIcon size={14} />}</PrimaryButton>
        </footer>
      )}
      </div>
        <AnimatePresence>
          {step === 'structure' && jivaOpen && (
            <motion.div
              key="jiva"
              initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              style={{ display: 'flex', flex: 'none', padding: '9px 9px 9px 0' }}
            >
              <JivaStructurePanel draft={draft} selectedProducts={selectedProducts} onChange={update} onClose={() => setJivaOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
    </div>
    </CampaignSummaryProvider>
    </MotionConfig>
  );
}
