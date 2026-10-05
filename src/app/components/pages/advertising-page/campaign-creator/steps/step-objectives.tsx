import { useState } from 'react';
import { MARKETPLACE_CAPABILITY, recommendedBudget, formatCurrency, type CcDraft, type CcProduct } from '../campaign-creator.types';
import { BAD, BORDER, FONT, GOOD, HAIR, SparkleGlyph, StepHeading, SURFACE_MUTED, TextButton, TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY, WARN, WarningIcon } from '../campaign-creator-ui';

function Row({ label, hint, children, last }: { label: string; hint: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.25fr)', gap: 40, padding: '26px 0', borderBottom: last ? 'none' : `1px solid ${HAIR}` }}>
      <div>
        <label style={{ display: 'block', font: `600 14px/1.3 ${FONT}`, color: TEXT_PRIMARY }}>{label}</label>
        <p style={{ margin: '5px 0 0', maxWidth: 320, font: `400 13px/1.55 ${FONT}`, color: TEXT_MUTED }}>{hint}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

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
  const sufficient = !budgetTooLow && draft.dailyBudget >= suggestedBudget;
  const coverage = suggestedBudget > 0 ? Math.min(draft.dailyBudget / suggestedBudget, 1) : 1;
  const perProduct = selectedProducts.length > 0 ? draft.dailyBudget / selectedProducts.length : null;

  const field: React.CSSProperties = { width: 140, padding: '10px 12px', border: `1px solid ${BORDER}`, borderRadius: 8, font: `500 14px/1.2 ${FONT}`, color: TEXT_PRIMARY, outline: 'none', background: '#fff' };

  return (
    <div style={{ maxWidth: 940 }}>
      <StepHeading
        eyebrow="Step 2 of 5"
        title="Set your goals"
        subtitle="These two numbers steer the targeting, structure and bids we suggest next. You can change them later."
      />

      <div style={{ borderTop: `1px solid ${HAIR}` }}>
        <Row label="Target ACOS" hint="The advertising cost of sale you're aiming for. This is optional. Leave it blank if you don't want a strict target.">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              id="cc-acos" className="cc-input" type="number" inputMode="decimal" value={draft.targetAcos ?? ''} onChange={(e) => setAcos(e.target.value)} placeholder="25"
              aria-invalid={Boolean(acosError)} aria-describedby={acosError ? 'cc-acos-err' : undefined}
              style={{ ...field, borderColor: acosError ? '#e0a5a0' : BORDER }}
            />
            <span style={{ font: `500 14px/1 ${FONT}`, color: TEXT_MUTED }}>%</span>
          </div>
          {acosError && <p id="cc-acos-err" role="alert" style={{ margin: '8px 0 0', font: `400 12.5px/1.4 ${FONT}`, color: BAD }}>{acosError}</p>}
          {!acosError && <p style={{ margin: '8px 0 0', font: `400 12.5px/1.4 ${FONT}`, color: TEXT_FAINT }}>Allowed range: 1–{cap?.maxTargetAcos ?? 90}%</p>}
        </Row>

        <Row label="Daily budget" hint="How much you're happy to spend across all the new campaigns each day." last>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ font: `500 14px/1 ${FONT}`, color: TEXT_MUTED }}>$</span>
            <input
              id="cc-budget" className="cc-input" type="number" inputMode="decimal" value={draft.dailyBudget}
              onChange={(e) => onChange({ dailyBudget: Math.max(0, Number(e.target.value) || 0) })}
              aria-invalid={budgetTooLow}
              style={{ ...field, borderColor: budgetTooLow ? '#e0a5a0' : BORDER }}
            />
            <span style={{ font: `400 13px/1 ${FONT}`, color: TEXT_FAINT }}>per day</span>
          </div>
          {budgetTooLow && <p role="alert" style={{ margin: '8px 0 0', font: `400 12.5px/1.4 ${FONT}`, color: BAD }}>The minimum for this marketplace is {formatCurrency(cap?.minDailyBudget ?? 0)}.</p>}

          <div style={{ marginTop: 18, padding: '14px 16px', border: `1px solid ${BORDER}`, borderRadius: 10, background: SURFACE_MUTED }}>
            <div style={{ font: `600 12.5px/1 ${FONT}`, color: TEXT_PRIMARY, marginBottom: 12 }}>Budget check</div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
              <div>
                <div style={{ font: `400 12px/1 ${FONT}`, color: TEXT_MUTED }}>Recommended daily budget</div>
                <div className="cc-num" style={{ marginTop: 6, font: `600 16px/1 ${FONT}`, color: TEXT_PRIMARY }}>{formatCurrency(suggestedBudget)}</div>
              </div>
              <div>
                <div style={{ font: `400 12px/1 ${FONT}`, color: TEXT_MUTED }}>Your budget</div>
                <div className="cc-num" style={{ marginTop: 6, font: `600 16px/1 ${FONT}`, color: sufficient ? GOOD : WARN }}>{formatCurrency(draft.dailyBudget)}</div>
              </div>
            </div>

            <div
              role="img" aria-label={`Your budget is ${Math.round(coverage * 100)}% of the recommended daily budget`}
              style={{ position: 'relative', height: 6, borderRadius: 999, background: HAIR, marginTop: 14, overflow: 'hidden' }}
            >
              <div style={{ width: `${Math.round(coverage * 100)}%`, height: '100%', borderRadius: 999, background: sufficient ? GOOD : WARN, transition: 'width 200ms ease-out' }} />
            </div>
            <div className="cc-num" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, font: `400 11.5px/1 ${FONT}`, color: TEXT_FAINT }}>
              <span>{formatCurrency(0)}</span>
              <span>Recommended {formatCurrency(suggestedBudget)}</span>
            </div>

            <p style={{ display: 'flex', alignItems: 'flex-start', gap: 8, margin: '12px 0 0', font: `400 13px/1.55 ${FONT}`, color: '#3d434b' }}>
              <span style={{ marginTop: 4, flex: 'none' }}>
                {sufficient ? <SparkleGlyph size={11} color={GOOD} /> : <WarningIcon size={12} color={WARN} />}
              </span>
              <span style={{ color: sufficient ? GOOD : WARN, fontWeight: 500 }}>
                {sufficient ? 'Sufficient for the selected products' : 'Your current budget may limit delivery for the selected targeting strategies.'}
                {!sufficient && !budgetTooLow && (
                  <>{' '}<TextButton onClick={() => onChange({ dailyBudget: suggestedBudget })}>Use {formatCurrency(suggestedBudget)}</TextButton></>
                )}
                {!sufficient && budgetTooLow && (
                  <>{' '}<TextButton onClick={() => onChange({ dailyBudget: Math.max(suggestedBudget, cap?.minDailyBudget ?? 0) })}>Use {formatCurrency(Math.max(suggestedBudget, cap?.minDailyBudget ?? 0))}</TextButton></>
                )}
              </span>
            </p>

            {perProduct !== null && (
              <p className="cc-num" style={{ margin: '8px 0 0', font: `400 12.5px/1.4 ${FONT}`, color: TEXT_MUTED }}>
                ≈ {formatCurrency(Math.round(perProduct * 100) / 100)} per product per day across {selectedProducts.length} selected {selectedProducts.length === 1 ? 'product' : 'products'}.
              </p>
            )}
            <p style={{ margin: '8px 0 0', font: `400 12px/1.5 ${FONT}`, color: TEXT_FAINT }}>
              Based on the last 30 days of ad spend for your selected products, plus room for the new campaigns.
            </p>
          </div>
        </Row>
      </div>
    </div>
  );
}
