import { ArrowsDownUpIcon, ScalesIcon, ShoppingCartIcon, TicketIcon, UserMinusIcon } from '@phosphor-icons/react';
import type { WidgetDefinition } from '../../dashboard.types';
import { defineInsight, type Tone } from './insight-view';
import { MARKET_LABEL, between, num, pct, pick, plural, productsIn, ratio, signedPct, unit, usd, usd2, usdK, whole } from './shared';

// Pricing & Buy Box: where you lose the featured offer, to whom, where you're priced out, and how promotions do.

const CTA = { label: 'Open Catalog', to: '/inventory' };

export const PRICING_WIDGETS: WidgetDefinition[] = [
  defineInsight({
    kind: 'price-buybox', title: 'Buy Box win rate', category: 'Pricing', icon: ShoppingCartIcon, art: 'list', availability: 'A·W', cta: CTA,
    summary: 'How often your offer is the featured one, overall and per item, lowest first.',
    description: 'Almost every sale goes through the Buy Box. Items with a low win rate are losing sales to other offers.',
    logic: 'Buy Box % = page views where your offer held the Buy Box ÷ all page views. Overall is weighted by page views; items under 80% are listed lowest first, with last week’s rate beside it.',
    sources: ['Amazon Sales & Traffic (Buy Box %)', 'Walmart Buy Box report'],
    build: (m) => {
      const ps = productsIn(m);
      const w = ps.reduce((s, p) => s + p.sessions, 0) || 1;
      const now = ps.reduce((s, p) => s + p.buyBox * p.sessions, 0) / w;
      const last = ps.reduce((s, p) => s + p.buyBoxLastWeek * p.sessions, 0) / w;
      const low = ps.filter((p) => p.buyBox < 80).sort((a, b) => a.buyBox - b.buyBox);
      return {
        line: `${pct(now)} won · ${signedPct(now - last)} vs last week`,
        stats: [{ label: 'Win rate', value: pct(now), caption: 'weighted by views', tone: now >= 85 ? 'good' : 'warn' }, { label: 'Vs last week', value: signedPct(now - last), tone: now >= last ? 'good' : 'bad' }, { label: 'Under 80%', value: num(low.length), caption: 'items' }],
        rowsHead: ['Item', 'Win rate'],
        rows: low.map((p) => ({ id: p.id, name: p.name, meta: `${MARKET_LABEL[p.market]} · last week ${pct(p.buyBoxLastWeek)}`, value: pct(p.buyBox), bar: p.buyBox / 100, tone: (p.buyBox < 50 ? 'bad' : 'warn') as Tone })),
        empty: 'Every item wins the Buy Box 80%+ of the time.',
      };
    },
  }),
  defineInsight({
    kind: 'price-buybox-lost', title: 'Buy Box lost to', category: 'Pricing', icon: UserMinusIcon, art: 'list', availability: 'A·W', cta: CTA,
    summary: 'Who holds the Buy Box on your items, their price against yours, and how they fulfil.',
    description: 'Knowing who wins and why (price, Prime, fulfilment) tells you whether to match price or fix fulfilment.',
    logic: 'For items where another offer held the Buy Box most of the week: the winning seller, their landed price against yours, the gap in %, and their fulfilment (FBA, FBM, WFS, seller-fulfilled).',
    sources: ['Amazon Product Pricing (competitive offers)', 'Walmart Buy Box report'],
    build: (m) => {
      const sellers = ['FitDeals Hub', 'NutriMart Wholesale', 'Prime Supply Co', 'Healthy Basket', 'Gymwise Retail'];
      const lost = productsIn(m).filter((p) => p.buyBox < 60).sort((a, b) => a.buyBox - b.buyBox);
      const gaps = lost.map((p) => between(p.id, 'win-gap', 0.03, 0.14));
      return {
        line: `${plural(lost.length, 'item')} losing the Buy Box · avg ${pct((gaps.reduce((s, g) => s + g, 0) / Math.max(1, gaps.length)) * 100, 1)} cheaper`,
        stats: [{ label: 'Items lost', value: num(lost.length), tone: lost.length ? 'bad' : 'good' }, { label: 'Avg price gap', value: pct((gaps.reduce((s, g) => s + g, 0) / Math.max(1, gaps.length)) * 100, 1), caption: 'they’re cheaper' }],
        rowsHead: ['Item and winner', 'Their price'],
        rows: lost.map((p, i) => {
          const fulfil = p.market === 'amazon' ? pick(p.id, 'fulfil', ['FBA', 'FBM', 'FBA'] as const) : pick(p.id, 'fulfil', ['WFS', 'Seller-fulfilled'] as const);
          return { id: p.id, name: p.name, meta: `${pick(p.id, 'winner', sellers)} · ${fulfil} · you win ${pct(p.buyBox)}`, value: usd2(p.price * (1 - gaps[i])), sub: `yours ${usd2(p.price)}`, tone: 'bad' as const };
        }),
        empty: 'You hold the Buy Box on every item.',
      };
    },
  }),
  defineInsight({
    kind: 'price-competitive', title: 'Price competitiveness', category: 'Pricing', icon: ScalesIcon, art: 'list', availability: 'A·W', cta: CTA,
    summary: 'Items priced more than 5% above the competitive price, biggest gap first.',
    description: 'An uncompetitive price loses the Buy Box and the click. These items need a price check.',
    logic: 'Gap = (your price − competitive price) ÷ competitive price, using Amazon’s competitive or featured-offer price and Walmart’s price-competitiveness reference. Items more than 5% above are listed, biggest gap first.',
    sources: ['Amazon Product Pricing (competitive price)', 'Walmart price competitiveness insights'],
    build: (m) => {
      const over = productsIn(m).map((p) => ({ p, gap: (p.price - p.competitorPrice) / p.competitorPrice })).filter((x) => x.gap > 0.05).sort((a, b) => b.gap - a.gap);
      const avg = over.reduce((s, x) => s + x.gap, 0) / Math.max(1, over.length);
      return {
        line: `${plural(over.length, 'item')} priced 5%+ above market`,
        stats: [{ label: 'Priced high', value: num(over.length), tone: over.length ? 'warn' : 'good' }, { label: 'Avg gap', value: pct(avg * 100, 1), caption: 'above competitive' }],
        rowsHead: ['Item', 'Gap'],
        rows: over.map(({ p, gap }) => ({ id: p.id, name: p.name, meta: `${MARKET_LABEL[p.market]} · ${usd2(p.price)} vs ${usd2(p.competitorPrice)}`, value: signedPct(gap * 100), bar: Math.min(1, gap / 0.25), tone: (gap > 0.12 ? 'bad' : 'warn') as Tone })),
        empty: 'Every item is priced within 5% of the market.',
      };
    },
  }),
  defineInsight({
    kind: 'price-changes', title: 'Price changes', category: 'Pricing', icon: ArrowsDownUpIcon, art: 'feed', availability: 'A·W', cta: CTA,
    summary: 'Prices changed in the last 7 days and what happened to units and revenue.',
    description: 'Shows whether recent price moves paid off: units and revenue a day before and after each change.',
    logic: 'Compares each item’s price with 7 days ago. For each change: price before → after, units a day before and after, and the change in revenue a day (units × price).',
    sources: ['Anarix price history', 'Sales report'],
    build: (m) => {
      const changed = productsIn(m).filter((p) => unit(p.id, 'price-moved') > 0.74).map((p) => {
        const before = Math.round(p.price * between(p.id, 'price-was', 0.86, 1.16) * 100) / 100;
        const unitsBefore = p.dailyUnits * (p.price / before) ** 1.4;
        return { p, before, unitsBefore, revDelta: p.dailyUnits * p.price - unitsBefore * before };
      }).filter((x) => Math.abs(x.before - x.p.price) > 0.5);
      return {
        line: `${plural(changed.length, 'price change')} in 7 days · ${num(changed.filter((x) => x.revDelta > 0).length)} lifted revenue`,
        stats: [{ label: 'Changes', value: num(changed.length) }, { label: 'Price up', value: num(changed.filter((x) => x.p.price > x.before).length) }, { label: 'Price down', value: num(changed.filter((x) => x.p.price < x.before).length) }],
        rowsHead: ['Item and units a day', 'Price'],
        rows: changed.map(({ p, before, unitsBefore, revDelta }) => ({ id: p.id, name: p.name, meta: `Units a day ${unitsBefore.toFixed(1)} → ${p.dailyUnits.toFixed(1)} · revenue ${revDelta >= 0 ? '+' : '−'}${usd(Math.abs(revDelta))} a day`, value: `${usd2(before)} → ${usd2(p.price)}`, tone: revDelta >= 0 ? 'good' as const : 'bad' as const })),
        empty: 'No price changes in the last 7 days.',
      };
    },
  }),
  defineInsight({
    kind: 'price-deals', title: 'Deals & coupons', category: 'Pricing', icon: TicketIcon, art: 'stats', availability: 'A', cta: CTA,
    summary: 'Running Lightning Deals, coupons and Prime discounts, and the return on each.',
    description: 'Shows which promotions earn their cost, so budget goes to the ones that pay back.',
    logic: 'For each running promotion: redemptions, sales during the promotion, its cost (discount given + deal fee), and ROI = sales ÷ cost.',
    sources: ['Amazon Coupons and Deals reports'],
    build: () => {
      const types = ['Lightning Deal', 'Coupon', 'Prime Exclusive Discount'] as const;
      const deals = productsIn('amazon').filter((p) => unit(p.id, 'deal') > 0.8).map((p) => {
        const redemptions = whole(p.id, 'redeemed', 30, 900);
        const sales = redemptions * p.price;
        const cost = redemptions * p.price * between(p.id, 'discount', 0.1, 0.25) + (pick(p.id, 'deal-type', types) === 'Lightning Deal' ? 70 : 0);
        return { p, type: pick(p.id, 'deal-type', types), redemptions, sales, cost };
      }).sort((a, b) => b.sales / b.cost - a.sales / a.cost);
      const sales = deals.reduce((s, d) => s + d.sales, 0);
      const cost = deals.reduce((s, d) => s + d.cost, 0);
      return {
        line: `${plural(deals.length, 'promotion')} running · ${ratio(cost ? sales / cost : 0)} ROI`,
        stats: [{ label: 'Running', value: num(deals.length) }, { label: 'Sales', value: usdK(sales), caption: 'from promotions' }, { label: 'ROI', value: ratio(cost ? sales / cost : 0), caption: 'sales ÷ cost', tone: 'good' }],
        rowsHead: ['Promotion', 'ROI'],
        rows: deals.map((d) => ({ id: d.p.id, name: d.p.name, tag: d.type, meta: `${num(d.redemptions)} redeemed · ${usd(d.sales)} sales · ${usd(d.cost)} cost`, value: ratio(d.sales / d.cost), tone: (d.sales / d.cost >= 4 ? 'good' : 'warn') as Tone })),
        empty: 'No promotions running.',
      };
    },
  }),
];
