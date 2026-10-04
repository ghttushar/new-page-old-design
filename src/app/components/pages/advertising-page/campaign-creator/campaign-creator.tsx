import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import useSubHeader from '@/hooks/use-sub-header.hook';
import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import {
  EMPTY_DRAFT, MARKETPLACE_CAPABILITY, flattenProducts, productsFor, structureCounts, validateCampaignLimit,
  type CcDraft, type CcStepId,
} from './campaign-creator.types';
import { WizardStepper } from './campaign-creator-ui';
import CampaignSummaryBar from './campaign-summary-bar';
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
  const campaignLimit = draft.marketplace ? MARKETPLACE_CAPABILITY[draft.marketplace].campaignLimit : 1000;
  const counts = draft.structureId && draft.structureId !== 'custom'
    ? structureCounts(draft.structureId, selectedProducts.length, hasAuto, manualTypesCount)
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

  return (
    <div ref={rootRef} style={{ height: rootHeight ?? '100%', display: 'flex', flexDirection: 'column', background: '#fafbfd' }}>
      {numberedIndex >= 0 && (
        <WizardStepper steps={NUMBERED_STEPS} current={step} furthestIndex={furthestIndex} onJump={goTo} />
      )}

      {numberedIndex >= 0 && (
        <CampaignSummaryBar draft={draft} selectedProducts={selectedProducts} stepIndex={numberedIndex} totalCampaigns={draft.structureId === 'custom' ? (draft.customCampaigns?.length ?? null) : (counts?.totalCampaigns ?? null)} />
      )}

      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
      <div style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
        <div style={{ maxWidth: 980, margin: '0 auto', padding: '28px 28px 40px' }}>
          {step === 'entry' && (
            <StepEntry draft={draft} onChange={update} />
          )}
          {step === 'products' && (
            <StepProducts
              draft={draft} products={products} selectedProducts={selectedProducts}
              onChange={update}
            />
          )}
          {step === 'objectives' && (
            <StepObjectives draft={draft} selectedProducts={selectedProducts} onChange={update} />
          )}
          {step === 'targeting' && (
            <StepTargeting draft={draft} selectedProducts={selectedProducts} onChange={update} />
          )}
          {step === 'structure' && (
            <StepStructure
              draft={draft} selectedProducts={selectedProducts} campaignLimit={campaignLimit} onChange={update}
              onJivaChange={setJivaOpen}
            />
          )}
          {step === 'preview' && (
            <StepPreview draft={draft} selectedProducts={selectedProducts} onChange={update} />
          )}
          {step === 'creating' && (
            <StepCreating draft={draft} selectedProducts={selectedProducts} onDone={() => setStep('result')} />
          )}
          {step === 'result' && (
            <StepResult draft={draft} selectedProducts={selectedProducts} />
          )}
        </div>
      </div>
      {step === 'structure' && jivaOpen && (
        <JivaStructurePanel draft={draft} selectedProducts={selectedProducts} onChange={update} onClose={() => setJivaOpen(false)} />
      )}
      </div>

      {step === 'entry' && (
        <FooterBar onNext={() => advance('products')} nextLabel="Create" nextDisabled={!draft.adType} />
      )}
      {step === 'result' && (
        <FooterBar
          onBack={() => { setDraft(EMPTY_DRAFT); setFurthestIndex(0); setStep('entry'); }}
          backLabel="Create another"
          onNext={() => {}}
          nextLabel="Go to Campaign Manager"
        />
      )}
      {step === 'products' && (
        <FooterBar onBack={() => goTo('entry')} onNext={() => advance('objectives')} nextDisabled={draft.productIds.length === 0} />
      )}
      {step === 'objectives' && (
        <FooterBar onBack={() => goTo('products')} onNext={() => advance('targeting')} nextDisabled={draft.dailyBudget <= 0} />
      )}
      {step === 'targeting' && (
        <FooterBar onBack={() => goTo('objectives')} onNext={() => advance('structure')} nextDisabled={draft.targetingStrategies.length === 0} />
      )}
      {step === 'structure' && (
        <FooterBar
          onBack={() => goTo('targeting')}
          onNext={() => advance('preview')}
          nextDisabled={!draft.structureId || (draft.structureId !== 'custom' && !limitCheck.ok) || (draft.structureId === 'custom' && !draft.customCampaigns)}
        />
      )}
      {step === 'preview' && (
        <FooterBar onBack={() => goTo('structure')} onNext={() => setStep('creating')} nextLabel="Create Campaigns" />
      )}
    </div>
  );
}

function FooterBar({ onBack, backLabel, onNext, nextDisabled, nextLabel }: { onBack?: () => void; backLabel?: string; onNext: () => void; nextDisabled?: boolean; nextLabel?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', borderTop: '1px solid #e6e8ec', background: '#fff', flex: 'none' }}>
      {onBack ? (
        <button onClick={onBack} style={{ padding: '10px 18px', borderRadius: 8, border: '1px solid #e6e8ec', background: '#fff', color: '#3d434b', font: '600 13px/1 Inter,sans-serif', cursor: 'pointer' }}>{backLabel ?? 'Back'}</button>
      ) : <span />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={onNext}
          disabled={nextDisabled}
          style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: nextDisabled ? '#eee7f5' : '#77469b', color: nextDisabled ? '#c3b3d6' : '#fff', font: '600 13px/1 Inter,sans-serif', cursor: nextDisabled ? 'default' : 'pointer' }}
        >
          {nextLabel ?? 'Continue'}
        </button>
      </div>
    </div>
  );
}
