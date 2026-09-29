import { useState } from 'react';
import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useSubHeader from '@/hooks/use-sub-header.hook';
import { CampaignCreatorStepper } from './campaign-creator-stepper';
import { ArrowRightIcon } from './campaign-creator-icons';
import { StepCreation } from './steps/step-creation';
import { StepObjectives } from './steps/step-objectives';
import { StepPreview } from './steps/step-preview';
import { StepProducts } from './steps/step-products';
import { StepRules } from './steps/step-rules';
import { StepSetup } from './steps/step-setup';
import { StepStructure } from './steps/step-structure';
import { StepTargeting } from './steps/step-targeting';
import { CcDraft, CcMarketplace, CcStepId, EMPTY_DRAFT, isStructureAvailable, selectedProducts, structureCounts } from './campaign-creator.types';
import styles from './campaign-creator.module.scss';

const ALL_STEPS: { id: CcStepId; label: string }[] = [
  { id: 'setup', label: 'Setup' },
  { id: 'products', label: 'Products' },
  { id: 'objectives', label: 'Objectives' },
  { id: 'targeting', label: 'Targeting' },
  { id: 'structure', label: 'Structure' },
  { id: 'rules', label: 'Rules' },
  { id: 'preview', label: 'Preview' },
  { id: 'result', label: 'Create & Result' },
];

function validateStep(draft: CcDraft, stepId: CcStepId): string[] {
  const products = selectedProducts(draft);
  switch (stepId) {
    case 'setup':
      return draft.marketplace ? [] : ['Choose a marketplace to continue.'];
    case 'products':
      return draft.selectedProductIds.length === 0 ? [`Select at least one ${draft.marketplace === 'walmart' ? 'item' : 'product'}.`] : [];
    case 'objectives': {
      const errs: string[] = [];
      if (!draft.targetAcos.trim()) errs.push('Target ACOS is required.');
      if (!draft.dailyBudget.trim()) errs.push('Daily budget is required.');
      return errs;
    }
    case 'targeting':
      return draft.targetingStrategies.length === 0 ? ['Select at least one targeting strategy.'] : [];
    case 'structure': {
      if (!draft.structure) return ['Select a campaign structure to continue.'];
      if (!isStructureAvailable(draft.structure, draft, products)) return ['The selected structure exceeds the account campaign limit — choose another structure.'];
      return [];
    }
    default:
      return [];
  }
}

const PRE_PREVIEW_STEPS: CcStepId[] = ['setup', 'products', 'objectives', 'targeting', 'structure'];

export default function CampaignCreator() {
  useSubHeader(PageTitleEnum.CAMPAIGN_CREATOR, PAGE_TITLE_TOOLTIPS.CAMPAIGN_CREATOR);
  const [draft, setDraft] = useState<CcDraft>(EMPTY_DRAFT);
  const [activeStepId, setActiveStepId] = useState<CcStepId>('setup');
  const [furthestIndex, setFurthestIndex] = useState(0);
  const [showErrors, setShowErrors] = useState(false);

  const activeIndex = ALL_STEPS.findIndex((s) => s.id === activeStepId);
  const errors = validateStep(draft, activeStepId);
  const products = selectedProducts(draft);

  function update(patch: Partial<CcDraft>) {
    setDraft((d) => ({ ...d, ...patch }));
  }

  function goToStep(id: CcStepId) {
    setActiveStepId(id);
    setShowErrors(false);
  }

  function handleNext() {
    if (errors.length > 0) { setShowErrors(true); return; }
    setShowErrors(false);
    const nextIndex = activeIndex + 1;
    setFurthestIndex((f) => Math.max(f, nextIndex));
    setActiveStepId(ALL_STEPS[nextIndex].id);
  }

  function handleBack() {
    setShowErrors(false);
    setActiveStepId(ALL_STEPS[Math.max(0, activeIndex - 1)].id);
  }

  function handleCreate() {
    const allErrors = PRE_PREVIEW_STEPS.flatMap((id) => validateStep(draft, id));
    if (allErrors.length > 0) { setShowErrors(true); return; }
    setFurthestIndex((f) => Math.max(f, ALL_STEPS.length - 1));
    setActiveStepId('result');
  }

  function restart() {
    setDraft(EMPTY_DRAFT);
    setActiveStepId('setup');
    setFurthestIndex(0);
    setShowErrors(false);
  }

  const previewErrors = activeStepId === 'preview' ? PRE_PREVIEW_STEPS.flatMap((id) => validateStep(draft, id)) : [];

  return (
    <div className={styles.page}>
      <div className={styles.body}>
        <CampaignCreatorStepper steps={ALL_STEPS} activeStepId={activeStepId} furthestIndex={furthestIndex} onSelect={(id) => goToStep(id as CcStepId)} />

        <div className={styles.content}>
          <div className={styles.contentScroll}>
            {activeStepId === 'setup' && (
              <StepSetup
                marketplace={draft.marketplace}
                onSelectMarketplace={(marketplace: CcMarketplace) => update({ marketplace, selectedProductIds: [], grouping: null, structure: null, jivaTree: null })}
                onStart={handleNext}
              />
            )}
            {activeStepId === 'products' && <StepProducts draft={draft} update={update} showErrors={showErrors} />}
            {activeStepId === 'objectives' && <StepObjectives draft={draft} update={update} showErrors={showErrors} />}
            {activeStepId === 'targeting' && <StepTargeting draft={draft} update={update} showErrors={showErrors} />}
            {activeStepId === 'structure' && <StepStructure draft={draft} update={update} showErrors={showErrors} />}
            {activeStepId === 'rules' && <StepRules draft={draft} update={update} />}
            {activeStepId === 'preview' && <StepPreview draft={draft} update={update} onEdit={goToStep} errors={previewErrors} />}
            {activeStepId === 'result' && <StepCreation draft={draft} onRestart={restart} />}

            {showErrors && errors.length > 0 && activeStepId !== 'preview' && activeStepId !== 'setup' && (
              <div className={styles.errorBanner}><ul>{errors.map((e) => <li key={e}>{e}</li>)}</ul></div>
            )}
          </div>

          {activeStepId !== 'setup' && activeStepId !== 'result' && (
            <div className={styles.footer}>
              <button type="button" className={styles.backButton} disabled={activeIndex === 0} onClick={handleBack}>Back</button>
              {activeStepId === 'preview' ? (
                <div className={styles.footerRightGroup}>
                  <PrimaryButton buttonText="Save as draft" buttonFunction={() => undefined} disabled={false} bgColor="#fff" textColor="#23272d" width="14rem" height="4rem" />
                  <PrimaryButton
                    buttonText={`Create ${draft.structure ? structureCounts(draft.structure, draft, products).campaigns : 0} Campaign${draft.structure && structureCounts(draft.structure, draft, products).campaigns === 1 ? '' : 's'}`}
                    buttonFunction={handleCreate}
                    disabled={false}
                    bgColor="#77469b"
                    width="18rem"
                    height="4rem"
                    isButtonIconRequired
                    isEndIcon
                    buttonIcon={<ArrowRightIcon size={14} color="#fff" />}
                  />
                </div>
              ) : (
                <PrimaryButton
                  buttonText="Continue"
                  buttonFunction={handleNext}
                  disabled={false}
                  bgColor="#77469b"
                  width="12rem"
                  height="4rem"
                  isButtonIconRequired
                  isEndIcon
                  buttonIcon={<ArrowRightIcon size={14} color="#fff" />}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
