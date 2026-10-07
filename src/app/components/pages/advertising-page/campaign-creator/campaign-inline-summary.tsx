// @ts-nocheck -- presentation-only campaign brief for the ported creator
import { AnimatePresence, motion } from 'motion/react';
import { STRUCTURE_CATALOG, TARGETING_STRATEGY_CATALOG, formatCurrency, type CcStepId } from './campaign-creator.types';
import { useCampaignSummary } from './campaign-summary-context';

const ICONS = {
  ad: <><rect x="3" y="4" width="18" height="16" rx="3"/><path d="m8 13 3-3 3 3 3-3 4 4M8 8h.01"/></>,
  products: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></>,
  budget: <><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5c-.8-.7-1.9-1-3.1-1-1.7 0-3 .8-3 2s1.1 1.8 3 2.2 3 1 3 2.2-1.3 2.1-3 2.1c-1.4 0-2.7-.5-3.6-1.3M12 5.5v13"/></>,
  target: <><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/></>,
  structure: <><rect x="3" y="4" width="6" height="5" rx="1"/><rect x="15" y="4" width="6" height="5" rx="1"/><rect x="9" y="15" width="6" height="5" rx="1"/><path d="M6 9v3h12V9M12 12v3"/></>,
};

function Glyph({ type }: { type: keyof typeof ICONS }) {
  return <svg viewBox="0 0 24 24" aria-hidden>{ICONS[type]}</svg>;
}

function EditButton({ step, label, children }: { step: CcStepId; label: string; children: React.ReactNode }) {
  const context = useCampaignSummary();
  if (!context) return null;
  return <button type="button" className="cc-setup-edit" onClick={() => context.onJump(step)} aria-label={`Edit ${label}`}>{children}</button>;
}

function ProductStack({ products }: { products: ReturnType<typeof useCampaignSummary>['selectedProducts'] }) {
  return (
    <span className="cc-setup-products" aria-hidden>
      {products.slice(0, 3).map((product, index) => (
        <motion.i key={product.id} layout initial={{ opacity: 0, scale: .65, x: 12 }} animate={{ opacity: 1, scale: 1, x: 0 }} style={{ '--cc-product-color': product.thumbnailColor, zIndex: 4 - index }} />
      ))}
      {products.length === 0 && <i className="is-empty" />}
    </span>
  );
}

export function InlineSummary() {
  const context = useCampaignSummary();
  if (!context || !['products', 'objectives', 'targeting', 'structure'].includes(context.step)) return null;
  const { step, draft, selectedProducts } = context;
  const structure = STRUCTURE_CATALOG.find((item) => item.id === draft.structureId);
  const strategies = draft.targetingStrategies.map((id) => ({ id, label: TARGETING_STRATEGY_CATALOG[id].label.replace('Keyword — ', '') }));
  const budgetPerProduct = selectedProducts.length ? draft.dailyBudget / selectedProducts.length : draft.dailyBudget;

  const history = step === 'products' ? [
    { step: 'entry', label: 'Ad type', eyebrow: 'Sponsored Products', value: 'Campaign canvas', icon: 'ad' },
  ] : step === 'objectives' ? [
    { step: 'products', label: 'products', eyebrow: 'Portfolio', value: `${selectedProducts.length} products`, icon: 'products' },
  ] : step === 'targeting' ? [
    { step: 'products', label: 'products', eyebrow: 'Products', value: `${selectedProducts.length} selected`, icon: 'products' },
    { step: 'objectives', label: 'goals', eyebrow: 'Daily budget', value: formatCurrency(draft.dailyBudget), icon: 'budget' },
  ] : [
    { step: 'products', label: 'products', eyebrow: 'Products', value: `${selectedProducts.length} selected`, icon: 'products' },
    { step: 'objectives', label: 'goals', eyebrow: 'Budget', value: `${formatCurrency(draft.dailyBudget)} / day`, icon: 'budget' },
    { step: 'targeting', label: 'targeting', eyebrow: 'Targeting', value: `${strategies.length} routes`, icon: 'target' },
  ];

  const current = step === 'products' ? {
    eyebrow: 'Live selection', value: `${selectedProducts.length} product${selectedProducts.length === 1 ? '' : 's'} docked`, icon: <ProductStack products={selectedProducts} />,
    detail: null, level: Math.min(100, selectedProducts.length * 12),
  } : step === 'objectives' ? {
    eyebrow: 'Goal settings', value: `${formatCurrency(draft.dailyBudget)} daily budget`, icon: <span className="cc-setup-icon"><Glyph type="budget" /></span>,
    detail: <><span><small>Per product</small><strong>{formatCurrency(budgetPerProduct)}</strong></span><span><small>Target ACOS</small><strong>{draft.targetAcos ? `${draft.targetAcos}%` : 'Open'}</strong></span></>, level: Math.min(100, Math.max(8, draft.dailyBudget / 4)),
  } : step === 'targeting' ? {
    eyebrow: 'Targeting routes', value: strategies.length ? `${strategies.length} routes connected` : 'Choose routes below', icon: <span className="cc-setup-icon"><Glyph type="target" /></span>,
    detail: <AnimatePresence mode="popLayout">{strategies.slice(0, 4).map((strategy) => <motion.span className="cc-dock-tag" key={strategy.id} layout initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }}>{strategy.label}</motion.span>)}</AnimatePresence>, level: Math.min(100, strategies.length * 14),
  } : {
    eyebrow: 'Campaign structure', value: structure?.name ?? 'Choose a structure', icon: <span className="cc-setup-icon"><Glyph type="structure" /></span>,
    detail: <span className={`cc-dock-topology${structure ? ' is-set' : ''}`} aria-hidden><i /><i /><i /></span>, level: structure ? 100 : 12,
  };

  return (
    <motion.section className="cc-setup cc-setup--dock" aria-label="Live campaign setup" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="cc-setup-history">
        {history.map((item) => <EditButton key={item.step} step={item.step} label={item.label}><span className="cc-setup-icon"><Glyph type={item.icon} /></span><span><small>{item.eyebrow}</small><strong>{item.value}</strong></span></EditButton>)}
      </div>
      <span className="cc-setup-flow" aria-hidden><i /><b>+</b><i /></span>
      <div className="cc-selection-dock">
        {current.icon}
        <span className="cc-selection-dock__copy"><small>{current.eyebrow}</small><strong><motion.b key={current.value} initial={{ y: -7, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{current.value}</motion.b></strong></span>
        <div className="cc-selection-dock__details">{current.detail}</div>
      </div>
    </motion.section>
  );
}