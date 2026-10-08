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

function SummaryItem({ children }: { children: React.ReactNode }) {
  return <div className="cc-setup-edit">{children}</div>;
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

/** Which kind of shopper intent each targeting route serves — its colour in the icon. */
const ROUTE_COLOR = { auto: '#7b828f', brand: '#c26a1a', competitor: '#4b5bb5', research: '#2f8ae8', performance: '#6fa83a' };
const ROUTE_INTENT = { auto: 'auto', brand: 'brand', competitor: 'competitor', broad: 'research', phrase: 'research', category: 'research', exact: 'performance', product: 'performance' };

/** Three bars that rise and fill with the daily budget: more budget, more bars lit. */
function BudgetStack({ budget }: { budget: number }) {
  const lit = budget <= 0 ? 0 : budget < 100 ? 1 : budget < 500 ? 2 : 3;
  const heights = [14, 23, 32];
  const shades = ['#b78fd6', '#9a66c0', '#77469b'];
  return (
    <span className="cc-dyn" aria-hidden>
      {heights.map((h, i) => (
        <motion.i
          key={i} className="cc-dyn-bar" style={{ left: 6 + i * 16 }}
          initial={{ height: 6, opacity: 0 }} animate={{ height: h, opacity: 1, backgroundColor: i < lit ? shades[i] : '#e6e8ef' }}
          transition={{ type: 'spring', stiffness: 220, damping: 22, delay: i * 0.05 }}
        />
      ))}
    </span>
  );
}

/** The chosen ad format as a tiny placement preview: a promoted result that slides in among the normal ones. */
function AdFormatMark() {
  return (
    <span className="cc-dyn" aria-hidden>
      <svg width="58" height="40" viewBox="0 0 58 40" fill="none">
        <rect x="4" y="3" width="50" height="34" rx="7" fill="#fff" stroke="#e0e3ec" strokeWidth="1.2" />
        <rect x="10" y="8" width="26" height="4" rx="2" fill="#e6e8ef" />
        <rect x="10" y="30" width="36" height="3.5" rx="1.75" fill="#eceef3" />
        <motion.g initial={{ y: 9, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.1 }}>
          <rect x="7.5" y="14.5" width="43" height="13.5" rx="4.5" fill="#fff" stroke="#8a56b3" strokeWidth="1.3" />
          <rect x="11" y="17.5" width="8" height="8" rx="2.4" fill="#efe6f7" />
          <path d="M12.6 22.4a2.4 2.4 0 0 1 4.8 0" stroke="#77469b" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="22" y="18" width="16" height="2.4" rx="1.2" fill="#c7ccd8" />
          <rect x="22" y="22.4" width="11" height="2.2" rx="1.1" fill="#e4e7ee" />
          <rect x="40" y="19.5" width="8" height="4.5" rx="2.25" fill="#77469b" />
        </motion.g>
      </svg>
    </span>
  );
}

/**
 * The targeting choices as a miniature of the targeting table itself: an Auto bar on top, then a
 * keyword column and a product column for each strategy. A cell fills in its strategy's colour when that
 * target type is ticked, so the icon reads as "which strategies, on which kind of target".
 */
function RouteDots({ routes }: { routes: string[] }) {
  const on = new Set(routes);
  const has = (...ids: string[]) => ids.some((id) => on.has(id));
  const KW = { x: 2, w: 26 };
  const PR = { x: 30, w: 26 };
  const rows = [
    { y: 8.4, color: ROUTE_COLOR.brand, kw: [has('brand')], pr: null },
    { y: 16.1, color: ROUTE_COLOR.competitor, kw: [has('competitor')], pr: null },
    { y: 23.8, color: ROUTE_COLOR.research, kw: [has('broad'), has('phrase')], pr: [has('category')] },
    { y: 31.5, color: ROUTE_COLOR.performance, kw: [has('exact')], pr: [has('product')] },
  ];
  const UNLIT = '#e9ebf1';
  const Cell = ({ x, y, w, lit, color, i }: { x: number; y: number; w: number; lit: boolean; color: string; i: number }) => (
    <motion.rect
      x={x} y={y} width={w} height={5.6} rx={2.2}
      initial={false} animate={{ fill: lit ? color : UNLIT }} transition={{ duration: 0.28, delay: i * 0.03 }}
    />
  );
  let n = 0;
  return (
    <span className="cc-dyn" aria-hidden>
      <svg width="58" height="40" viewBox="0 0 58 40" fill="none">
        <motion.rect x="2" y="0.6" width="54" height="5.6" rx="2.8" initial={false} animate={{ fill: has('auto') ? ROUTE_COLOR.auto : UNLIT }} transition={{ duration: 0.28 }} />
        {rows.map((r) => {
          const kwW = r.kw.length === 2 ? (KW.w - 2) / 2 : KW.w;
          return (
            <g key={r.y}>
              {r.kw.map((lit, k) => <Cell key={'k' + k} x={KW.x + k * (kwW + 2)} y={r.y} w={kwW} lit={lit} color={r.color} i={n++} />)}
              {r.pr ? <Cell x={PR.x} y={r.y} w={PR.w} lit={r.pr[0]} color={r.color} i={n++} /> : <rect x={PR.x} y={r.y} width={PR.w} height={5.6} rx={2.2} fill="#f6f7fa" stroke="#eceef3" strokeWidth="0.8" strokeDasharray="1.6 1.6" />}
            </g>
          );
        })}
      </svg>
    </span>
  );
}

/** A campaign node on top with its ad-group nodes below; the shape follows the chosen structure. */
function StructureNodes({ structureId }: { structureId?: string }) {
  const set = !!structureId;
  const leaves = structureId === 'consolidated' ? 2 : 3;
  const xs = leaves === 2 ? [9, 35] : [2, 22, 42];
  return (
    <span className="cc-dyn" aria-hidden>
      <svg width="58" height="40" viewBox="0 0 58 40" fill="none">
        {xs.map((x) => (
          <motion.path key={'l' + x + leaves} d={`M29 14V20H${x + 7}V26`} stroke={set ? '#c9b6df' : '#dfe2ea'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
        ))}
        <rect x="22" y="3" width="14" height="11" rx="3" fill={set ? '#77469b' : '#fff'} stroke={set ? '#77469b' : '#c9ccd6'} strokeWidth="1.4" strokeDasharray={set ? undefined : '2.5 2.5'} />
        {xs.map((x, i) => (
          <motion.rect key={'n' + x + leaves} x={x} y="26" width="14" height="11" rx="3" fill={set ? '#efe6f7' : '#fff'} stroke={set ? '#9a66c0' : '#c9ccd6'} strokeWidth="1.4" strokeDasharray={set ? undefined : '2.5 2.5'}
            initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.08 * i, type: 'spring', stiffness: 260, damping: 20 }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
        ))}
      </svg>
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
    { step: 'entry', label: 'Ad type', eyebrow: 'Ad format', value: 'Sponsored Products', icon: 'ad' },
  ] : step === 'objectives' ? [
    { step: 'entry', label: 'Ad type', eyebrow: 'Ad format', value: 'Sponsored Products', icon: 'ad' },
    { step: 'products', label: 'products', eyebrow: 'Portfolio', value: `${selectedProducts.length} products`, icon: 'products' },
  ] : step === 'targeting' ? [
    { step: 'entry', label: 'Ad type', eyebrow: 'Ad format', value: 'Sponsored Products', icon: 'ad' },
    { step: 'products', label: 'products', eyebrow: 'Products', value: `${selectedProducts.length} selected`, icon: 'products' },
    { step: 'objectives', label: 'goals', eyebrow: 'Daily budget', value: formatCurrency(draft.dailyBudget), icon: 'budget' },
  ] : [
    { step: 'entry', label: 'Ad type', eyebrow: 'Ad format', value: 'Sponsored Products', icon: 'ad' },
    { step: 'products', label: 'products', eyebrow: 'Products', value: `${selectedProducts.length} selected`, icon: 'products' },
    { step: 'objectives', label: 'goals', eyebrow: 'Budget', value: `${formatCurrency(draft.dailyBudget)} / day`, icon: 'budget' },
    { step: 'targeting', label: 'targeting', eyebrow: 'Targeting', value: `${strategies.length} routes`, icon: 'target' },
  ];

  const current = step === 'products' ? {
    eyebrow: 'Live selection', value: `${selectedProducts.length} product${selectedProducts.length === 1 ? '' : 's'} docked`, icon: <ProductStack products={selectedProducts} />,
    detail: null, level: Math.min(100, selectedProducts.length * 12),
  } : step === 'objectives' ? {
    eyebrow: 'Goal settings', value: `${formatCurrency(draft.dailyBudget)} daily budget`, icon: <BudgetStack budget={draft.dailyBudget} />,
    detail: <><span><small>Per product</small><strong>{formatCurrency(budgetPerProduct)}</strong></span><span><small>Target ACOS</small><strong>{draft.targetAcos ? `${draft.targetAcos}%` : 'Open'}</strong></span></>, level: Math.min(100, Math.max(8, draft.dailyBudget / 4)),
  } : step === 'targeting' ? {
    eyebrow: 'Targeting routes', value: strategies.length ? `${strategies.length} routes connected` : 'Choose routes below', icon: <RouteDots routes={draft.targetingStrategies} />,
    detail: <AnimatePresence mode="popLayout">{strategies.slice(0, 4).map((strategy) => <motion.span className="cc-dock-tag" key={strategy.id} layout initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }}>{strategy.label}</motion.span>)}</AnimatePresence>, level: Math.min(100, strategies.length * 14),
  } : {
    eyebrow: 'Campaign structure', value: structure?.name ?? 'Choose a structure', icon: <StructureNodes structureId={draft.structureId} />,
    detail: null, level: structure ? 100 : 12,
  };

  return (
    <motion.section className="cc-setup cc-setup--dock" aria-label="Live campaign setup" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="cc-setup-history">
        {history.map((item) => <SummaryItem key={item.step}>{item.icon === 'products' ? <ProductStack products={selectedProducts} /> : item.icon === 'budget' ? <BudgetStack budget={draft.dailyBudget} /> : item.icon === 'target' ? <RouteDots routes={draft.targetingStrategies} /> : item.icon === 'ad' ? <AdFormatMark /> : <span className="cc-setup-icon"><Glyph type={item.icon} /></span>}<span><small>{item.eyebrow}</small><strong>{item.value}</strong></span></SummaryItem>)}
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