import { useState } from 'react';
import { MARKETPLACE_CAPABILITY, recommendedBudget, formatCurrency, type CcDraft, type CcProduct } from '../campaign-creator.types';
import { BORDER, SectionCard, StepHeading, TEXT_FAINT, TEXT_MUTED, WhyRecommended } from '../campaign-creator-ui';

export default function StepObjectives({ draft, selectedProducts, onChange }: {
  draft: CcDraft; selectedProducts: CcProduct[]; onChange: (patch: Partial<CcDraft>) => void;
}) {
  const cap = draft.marketplace ? MARKETPLACE_CAPABILITY[draft.marketplace] : null;
  const suggestedBudget = recommendedBudget(selectedProducts);
  const [acosError, setAcosError] = useState<string | null>(null);

  function setAcos(raw: string) {
    if (raw.trim() === '') { onChange({ targetAcos: null }); setAcosError(null); return; }
    const n = Number(raw);
    if (Number.isNaN(n)) { setAcosError('Enter a number.'); return; }
    if (n < 1 || n > (cap?.maxTargetAcos ?? 90)) { setAcosError(`Enter a value between 1 and ${cap?.maxTargetAcos ?? 90}.`); onChange({ targetAcos: n }); return; }
    setAcosError(null);
    onChange({ targetAcos: n });
  }

  const budgetTooLow = cap ? draft.dailyBudget < cap.minDailyBudget : false;

  return (
    <div>
      <StepHeading title="Set objectives" subtitle="These inputs drive the targeting, structure, bid and budget recommendations in the next steps." />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <SectionCard title="Target ACOS">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="number" value={draft.targetAcos ?? ''} onChange={(e) => setAcos(e.target.value)} placeholder="e.g. 25"
              style={{ width: 110, padding: '9px 11px', border: `1px solid ${acosError ? '#e0a5a0' : BORDER}`, borderRadius: 8, font: '500 13px/1 Inter,sans-serif', outline: 'none' }}
            />
            <span style={{ font: '600 13px/1 Inter,sans-serif', color: TEXT_MUTED }}>%</span>
          </div>
          {acosError && <div style={{ font: '400 11.5px/1.4 Inter,sans-serif', color: '#b3453f', marginTop: 7 }}>{acosError}</div>}
          <div style={{ font: '400 11.5px/1.5 Inter,sans-serif', color: TEXT_FAINT, marginTop: 8 }}>Optional — leave blank if you don't need a strict target.</div>
        </SectionCard>

        <SectionCard title="Daily Budget">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ font: '600 13px/1 Inter,sans-serif', color: TEXT_MUTED }}>$</span>
            <input
              type="number" value={draft.dailyBudget} onChange={(e) => onChange({ dailyBudget: Math.max(0, Number(e.target.value) || 0) })}
              style={{ width: 110, padding: '9px 11px', border: `1px solid ${budgetTooLow ? '#e0a5a0' : BORDER}`, borderRadius: 8, font: '500 13px/1 Inter,sans-serif', outline: 'none' }}
            />
          </div>
          {budgetTooLow && <div style={{ font: '400 11.5px/1.4 Inter,sans-serif', color: '#b3453f', marginTop: 7 }}>Below the {formatCurrency(cap?.minDailyBudget ?? 0)} marketplace minimum.</div>}
          {!budgetTooLow && draft.dailyBudget < suggestedBudget && (
            <div style={{ marginTop: 10 }}>
              <WhyRecommended reason={`Recommended daily budget: ${formatCurrency(suggestedBudget)}. Your current budget may limit delivery for the selected products' targeting strategies.`} />
              <span onClick={() => onChange({ dailyBudget: suggestedBudget })} style={{ display: 'inline-block', marginTop: 8, font: '600 12px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>Use recommended budget →</span>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
