import { CcChoiceCards, CcField, CcFieldRow, CcRecommendationCard, CcSection, CcTextInput, CcWarningBanner } from '../campaign-creator-shared-ui';
import { ChartUpIcon, RocketIcon, TargetGoalIcon } from '../campaign-creator-icons';
import { CcDraft, CcObjective, isBudgetSufficient, recommendedDailyBudget, selectedProducts, typicalAcosRange } from '../campaign-creator.types';

export function StepObjectives({ draft, update, showErrors }: { draft: CcDraft; update: (patch: Partial<CcDraft>) => void; showErrors: boolean }) {
  const products = selectedProducts(draft);
  const acosRange = typicalAcosRange(products);
  const budgetRec = recommendedDailyBudget(draft, products);
  const budgetEntered = draft.dailyBudget.trim() !== '';
  const budgetOk = !budgetEntered || isBudgetSufficient(draft, products);

  return (
    <>
      <CcSection title="Primary objective" description="Choose the main goal for this campaign.">
        <CcChoiceCards<CcObjective>
          value={draft.objective}
          onChange={(objective) => update({ objective })}
          columns={3}
          options={[
            { value: 'grow-sales', title: 'Grow sales', description: 'Maximize product visibility and drive more sales.', icon: <ChartUpIcon size={20} /> },
            { value: 'improve-efficiency', title: 'Improve efficiency', description: 'Drive profitable growth with better ACOS.', icon: <TargetGoalIcon size={20} /> },
            { value: 'launch-discover', title: 'Launch / discover', description: 'Gain visibility and discover new opportunities.', icon: <RocketIcon size={20} /> },
          ]}
        />
      </CcSection>

      <CcSection title="Target ACOS" description="Set your target ACOS for these campaigns.">
        <CcFieldRow>
          <CcField label="Target ACOS" required hint={`Typical ACOS for selected products: ${acosRange.low}%–${acosRange.high}%`}>
            <CcTextInput value={draft.targetAcos} onChange={(targetAcos) => update({ targetAcos })} placeholder="25" type="number" suffix="%" error={showErrors && draft.targetAcos.trim() === ''} />
          </CcField>
          <CcRecommendationCard
            title="Anarix recommendation"
            value={`${Math.round((acosRange.low + acosRange.high) / 2)}%`}
            description="This target balances visibility and profitability for your selected products."
            onUse={() => update({ targetAcos: String(Math.round((acosRange.low + acosRange.high) / 2)) })}
          />
        </CcFieldRow>
      </CcSection>

      <CcSection title="Daily budget" description="Set the total daily budget for these campaigns.">
        <CcFieldRow>
          <CcField label="Daily budget" required hint={`Recommended: $${budgetRec.low}–$${budgetRec.high}/day`}>
            <CcTextInput value={draft.dailyBudget} onChange={(dailyBudget) => update({ dailyBudget })} placeholder={String(budgetRec.mid)} type="number" prefix="$" error={showErrors && draft.dailyBudget.trim() === ''} />
          </CcField>
          <CcRecommendationCard
            title="Anarix recommendation"
            value={`$${budgetRec.mid}/day`}
            description={`This budget gives your recommended targeting strategy room to collect data across your ${products.length || 0} selected product${products.length === 1 ? '' : 's'}.`}
            onUse={() => update({ dailyBudget: String(budgetRec.mid) })}
          />
        </CcFieldRow>

        {!budgetOk && (
          <CcWarningBanner title="Budget may limit delivery">
            Your current budget may limit delivery for the selected targeting strategies. Recommended daily budget: ${budgetRec.low}–${budgetRec.high}.
          </CcWarningBanner>
        )}
      </CcSection>
    </>
  );
}
