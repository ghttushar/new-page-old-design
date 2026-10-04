import { STRUCTURE_CATALOG, TARGETING_STRATEGY_CATALOG, formatCurrency, type CcDraft, type CcProduct } from './campaign-creator.types';
import { BORDER, BRAND, TEXT_FAINT, TEXT_PRIMARY } from './campaign-creator-ui';

function Item({ label, value, title }: { label: string; value: React.ReactNode; title?: string }) {
  return (
    <div title={title} style={{ minWidth: 0, flex: 'none', maxWidth: 260 }}>
      <div style={{ font: '600 9px/1 Inter,sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: TEXT_FAINT, marginBottom: 5 }}>{label}</div>
      <div style={{ font: '700 12.5px/1.2 Inter,sans-serif', color: TEXT_PRIMARY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{value}</div>
    </div>
  );
}

/** Running recap of everything chosen on the earlier steps. `stepIndex` is the 0-based index of the current numbered step. */
export default function CampaignSummaryBar({ draft, selectedProducts, stepIndex, totalCampaigns }: {
  draft: CcDraft; selectedProducts: CcProduct[]; stepIndex: number; totalCampaigns: number | null;
}) {
  const targeting = draft.targetingStrategies.map((s) => TARGETING_STRATEGY_CATALOG[s].label.replace('Keyword — ', ''));
  const structure = draft.structureId ? STRUCTURE_CATALOG.find((s) => s.id === draft.structureId) : null;

  // Preview (index 4) recaps everything; earlier steps only recap what came before them.
  const items: React.ReactNode[] = [];
  if (draft.adType) items.push(<Item key="ad" label="Ad type" value="Sponsored Products" />);
  if (stepIndex >= 1 && selectedProducts.length > 0) {
    items.push(<Item key="p" label="Products" value={selectedProducts.length} title={selectedProducts.map((p) => p.title).join('\n')} />);
  }
  if (stepIndex >= 2) {
    items.push(<Item key="b" label="Daily budget" value={formatCurrency(draft.dailyBudget)} />);
    items.push(<Item key="a" label="Target ACOS" value={draft.targetAcos ? `${draft.targetAcos}%` : '—'} />);
  }
  if (stepIndex >= 3 && targeting.length > 0) {
    items.push(<Item key="t" label="Targeting" value={targeting.join(', ')} title={targeting.join(', ')} />);
  }
  if (stepIndex >= 4 && structure) {
    items.push(<Item key="s" label="Structure" value={structure.name} />);
    if (totalCampaigns !== null) items.push(<Item key="c" label="Campaigns" value={totalCampaigns} />);
  }
  if (items.length === 0) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '11px 28px', background: '#fff', borderBottom: `1px solid ${BORDER}`, flex: 'none', overflowX: 'hidden' }}>
      <div style={{ font: '700 11px/1.2 Inter,sans-serif', color: BRAND, flex: 'none' }}>Campaign Creation<br />Summary</div>
      <span style={{ width: 1, alignSelf: 'stretch', background: BORDER, flex: 'none' }} />
      {items}
    </div>
  );
}
