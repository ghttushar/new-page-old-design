import { STRUCTURE_CATALOG, TARGETING_STRATEGY_CATALOG, formatCurrency, type CcDraft, type CcProduct, type CcStepId } from './campaign-creator.types';
import { BRAND, CheckIcon, FONT, GOOD, HAIR, SURFACE_MUTED, TEXT_FAINT, TEXT_PRIMARY } from './campaign-creator-ui';

interface RailStep { id: CcStepId; label: string }

/** What the user chose on a step, as short lines for the summary section. */
function recap(id: CcStepId, draft: CcDraft, selectedProducts: CcProduct[], totalCampaigns: number | null): string[] {
  switch (id) {
    case 'products': {
      if (selectedProducts.length === 0) return [];
      return [`${selectedProducts.length} product${selectedProducts.length === 1 ? '' : 's'} selected`, draft.groupingMode === 'split-by-ad-group' ? 'Split by ad group' : 'Split by campaign'];
    }
    case 'objectives':
      return [`${formatCurrency(draft.dailyBudget)} a day`, draft.targetAcos ? `Target ACOS ${draft.targetAcos}%` : 'No ACOS target'];
    case 'targeting': {
      if (draft.targetingStrategies.length === 0) return [];
      return [draft.targetingStrategies.map((s) => TARGETING_STRATEGY_CATALOG[s].label.replace('Keyword — ', '')).join(', ')];
    }
    case 'structure': {
      const def = draft.structureId ? STRUCTURE_CATALOG.find((s) => s.id === draft.structureId) : null;
      if (!def) return [];
      return [def.name, ...(totalCampaigns !== null ? [`${totalCampaigns} campaign${totalCampaigns === 1 ? '' : 's'}`] : [])];
    }
    case 'preview': {
      const campaigns = draft.generatedCampaigns ?? [];
      if (campaigns.length === 0) return [];
      const adGroups = campaigns.reduce((n, c) => n + c.adGroups.length, 0);
      const targets = campaigns.reduce((n, c) => n + c.adGroups.reduce((m, ag) => m + ag.targets.length, 0), 0);
      return [
        `${campaigns.length} campaigns · ${adGroups} ad groups`,
        `${targets} targets · ${formatCurrency(draft.dailyBudget)} a day`,
        ...(draft.ruleIds.length ? [`${draft.ruleIds.length} rule${draft.ruleIds.length === 1 ? '' : 's'} assigned`] : []),
      ];
    }
    default:
      return [];
  }
}

export default function StepRail({ steps, current, furthestIndex, onJump, draft, selectedProducts, totalCampaigns, compact }: {
  steps: RailStep[]; current: CcStepId; furthestIndex: number; onJump: (id: CcStepId) => void;
  draft: CcDraft; selectedProducts: CcProduct[]; totalCampaigns: number | null; compact?: boolean;
}) {
  const currentIndex = steps.findIndex((s) => s.id === current);
  const summary = steps
    .map((s, i) => ({ id: s.id, label: s.label, lines: i <= furthestIndex ? recap(s.id, draft, selectedProducts, totalCampaigns) : [] }))
    .filter((row) => row.lines.length > 0);

  return (
    <nav
      aria-label="Campaign creation steps"
      style={{ width: compact ? 64 : 256, flex: 'none', background: SURFACE_MUTED, borderRight: `1px solid ${HAIR}`, padding: compact ? '28px 0' : '28px 24px', overflowY: 'auto', transition: 'width 180ms ease-out' }}
    >
      {!compact && (
        <>
          <div style={{ font: `600 12.5px/1.3 ${FONT}`, color: TEXT_PRIMARY }}>Sponsored Products</div>
          <div style={{ font: `400 12px/1.4 ${FONT}`, color: TEXT_FAINT, marginTop: 3, marginBottom: 24 }}>Campaign creator</div>
        </>
      )}

      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', alignItems: compact ? 'center' : 'stretch' }}>
        {steps.map((s, i) => {
          const active = i === currentIndex;
          const done = i < currentIndex;
          const reachable = i <= furthestIndex;
          const last = i === steps.length - 1;

          return (
            <li key={s.id} style={{ display: 'flex', gap: 12, position: 'relative', paddingBottom: last ? 0 : compact ? 18 : 22 }}>
              {!last && <span aria-hidden style={{ position: 'absolute', left: 11, top: 26, bottom: 2, width: 1.5, background: done ? '#bfe0cb' : '#e3e5ea' }} />}
              <button
                type="button"
                onClick={() => reachable && onJump(s.id)}
                title={compact ? s.label : undefined}
                aria-current={active ? 'step' : undefined}
                disabled={!reachable}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 0, border: 'none', background: 'none', textAlign: 'left' as const, cursor: reachable ? 'pointer' : 'default', width: compact ? 'auto' : '100%' }}
              >
                <span
                  style={{
                    width: 24, height: 24, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1,
                    background: done ? GOOD : active ? BRAND : '#fff', border: `1.5px solid ${done ? GOOD : active ? BRAND : '#d5d9e0'}`,
                    font: `600 11.5px/1 ${FONT}`, color: done || active ? '#fff' : TEXT_FAINT, transition: 'background-color 160ms ease-out, border-color 160ms ease-out',
                  }}
                >
                  {done ? <CheckIcon size={11} /> : i + 1}
                </span>
                {!compact && (
                  <span style={{ minWidth: 0, paddingTop: 3 }}>
                    <span style={{ display: 'block', font: `${active ? 600 : 500} 13px/1.2 ${FONT}`, color: active ? TEXT_PRIMARY : reachable ? '#3d434b' : TEXT_FAINT }}>{s.label}</span>
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>

      {!compact && (
        <section aria-label="Campaign creation summary" style={{ marginTop: 28, paddingTop: 20, borderTop: `1px solid ${HAIR}` }}>
          <div style={{ font: `600 12.5px/1.3 ${FONT}`, color: TEXT_PRIMARY, marginBottom: 12 }}>Campaign Creation Summary</div>
          {summary.length === 0 ? (
            <div style={{ font: `400 12px/1.5 ${FONT}`, color: TEXT_FAINT }}>Your choices will collect here as you go.</div>
          ) : (
            <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {summary.map((row) => (
                <div key={row.id}>
                  <dt style={{ font: `500 11.5px/1.3 ${FONT}`, color: TEXT_FAINT }}>{row.label}</dt>
                  {row.lines.map((l, k) => (
                    <dd key={k} style={{ margin: k === 0 ? '3px 0 0' : '1px 0 0', font: `400 12.5px/1.45 ${FONT}`, color: '#3d434b', overflowWrap: 'anywhere' }}>{l}</dd>
                  ))}
                </div>
              ))}
            </dl>
          )}
        </section>
      )}
    </nav>
  );
}
