import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import useSubHeader from '@/hooks/use-sub-header.hook';
import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import {
  EMPTY_DRAFT, accountCampaignLimits, flattenProducts, productsFor, structureCounts, validateCampaignLimit,
  type CcDraft, type CcStepId,
} from './campaign-creator.types';
import { ArrowRightIcon, CcGlobalStyles, GhostButton, HAIR, PrimaryButton } from './campaign-creator-ui';
import StepRail from './step-rail';
import StepEntry from './steps/step-entry';
import StepProducts from './steps/step-products';
import StepObjectives from './steps/step-objectives';
import StepTargeting from './steps/step-targeting';
import StepStructure from './steps/step-structure';
import JivaStructurePanel from './steps/jiva-structure-panel';
import StepPreview from './steps/step-preview';
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

  function goTo(id: CcStepId) {
    setJivaOpen(false);
    setStep(id);
  }
  function advance(id: CcStepId) {
    const idx = NUMBERED_STEPS.findIndex((s) => s.id === id);
    if (idx >= 0) setFurthestIndex((prev) => Math.max(prev, idx));
    setJivaOpen(false);
    setStep(id);
  }

  const numberedIndex = NUMBERED_STEPS.findIndex((s) => s.id === step);
  const totalCampaigns = draft.structureId === 'custom' ? (draft.customCampaigns?.length ?? null) : (counts?.totalCampaigns ?? null);

  const structureBlocked = !draft.structureId
    || (draft.structureId !== 'custom' && !limitCheck.ok)
    || (draft.structureId === 'custom' && !draft.customCampaigns);

  // Preview guards the Create button: nothing to create, or budgets that don't add up to the daily budget (spec §8.4).
  const previewCampaigns = draft.generatedCampaigns ?? [];
  const previewCount = previewCampaigns.length;
  const previewBudgetOk = Math.abs(previewCampaigns.reduce((n, c) => n + c.dailyBudget, 0) - draft.dailyBudget) <= 0.5;

  const footers: Partial<Record<CcStepId, { back?: () => void; backLabel?: string; next: () => void; nextLabel: string; disabled?: boolean }>> = {
    entry: { next: () => advance('products'), nextLabel: 'Get started', disabled: !draft.adType },
    products: { back: () => goTo('entry'), next: () => advance('objectives'), nextLabel: 'Continue', disabled: draft.productIds.length === 0 },
    objectives: { back: () => goTo('products'), next: () => advance('targeting'), nextLabel: 'Continue', disabled: draft.dailyBudget <= 0 },
    targeting: { back: () => goTo('objectives'), next: () => advance('structure'), nextLabel: 'Continue', disabled: draft.targetingStrategies.length === 0 },
    structure: { back: () => goTo('targeting'), next: () => advance('preview'), nextLabel: 'Continue', disabled: structureBlocked },
    preview: {
      back: () => goTo('structure'), next: () => setStep('creating'),
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

  return (
    <div ref={rootRef} className="cc-root" style={{ height: rootHeight ?? '100%', display: 'flex', background: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <CcGlobalStyles />
      {framed && (
        <StepRail
          steps={NUMBERED_STEPS} current={step} furthestIndex={furthestIndex} onJump={goTo}
          draft={draft} selectedProducts={selectedProducts} totalCampaigns={totalCampaigns} compact={jivaOpen}
        />
      )}

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
          <main className="cc-scroll" style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
            <div key={step} className="cc-enter" style={{ maxWidth: framed ? 'none' : step === 'result' ? 880 : 640, margin: framed ? 0 : '0 auto', padding: framed ? '40px 48px 56px' : '72px 32px 56px' }}>
              {step === 'entry' && <StepEntry draft={draft} onChange={update} />}
              {step === 'products' && <StepProducts draft={draft} products={products} selectedProducts={selectedProducts} onChange={update} />}
              {step === 'objectives' && <StepObjectives draft={draft} selectedProducts={selectedProducts} onChange={update} />}
              {step === 'targeting' && <StepTargeting draft={draft} selectedProducts={selectedProducts} onChange={update} />}
              {step === 'structure' && (
                <StepStructure draft={draft} selectedProducts={selectedProducts} campaignLimit={campaignLimit} onChange={update} onJivaChange={setJivaOpen} />
              )}
              {step === 'preview' && <StepPreview draft={draft} selectedProducts={selectedProducts} onChange={update} />}
              {step === 'creating' && <StepCreating draft={draft} selectedProducts={selectedProducts} onDone={() => setStep('result')} />}
              {step === 'result' && <StepResult draft={draft} selectedProducts={selectedProducts} />}
            </div>
          </main>
          {step === 'structure' && jivaOpen && (
            <JivaStructurePanel draft={draft} selectedProducts={selectedProducts} onChange={update} onClose={() => setJivaOpen(false)} />
          )}
        </div>

        {footer && (
          <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 48px', borderTop: `1px solid ${HAIR}`, background: '#fff', flex: 'none' }}>
            <div>{footer.back && <GhostButton onClick={footer.back}>{footer.backLabel ?? 'Back'}</GhostButton>}</div>
            <PrimaryButton onClick={footer.next} disabled={footer.disabled}>
              {footer.nextLabel} {step !== 'result' && <ArrowRightIcon size={14} />}
            </PrimaryButton>
          </footer>
        )}
      </div>
    </div>
  );
}
