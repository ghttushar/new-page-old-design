import { ArrowsCounterClockwiseIcon, BasketIcon, BinocularsIcon, FunnelIcon, ListNumbersIcon, MegaphoneIcon } from '@phosphor-icons/react';
import type { WidgetDefinition } from '../../dashboard.types';
import { defineInsight, type Tone } from './insight-view';
import { MARKET_LABEL, PERFORMERS, between, num, pct, pick, plural, productsIn, signed, signedPct, unit, usd2, usdK, whole, type Marketplace } from './shared';

// Market intelligence: visibility against competitors, organic rank, the search funnel, competitor moves, and what
// shoppers buy together and again.

const CTA = { label: 'Open Market Intelligence', to: '/market-intelligence' };
const COMPETITORS = ['MuscleBlaze', 'Optimum Nutrition', 'MyProtein'];
const TRACKED = PERFORMERS.keyword.slice(0, 14);
const marketsOf = (m: 'all' | Marketplace): Marketplace[] => (m === 'all' ? ['amazon', 'walmart'] : [m]);

const COMPETITOR_ITEMS = [
  'MuscleBlaze Biozyme Whey 1kg', 'Optimum Nutrition Gold Standard 2lb', 'MyProtein Impact Whey 1kg', 'MuscleBlaze Creatine 250g',
  'ON Micronized Creatine 300g', 'MyProtein Pre-Workout 250g', 'MuscleBlaze Mass Gainer 3kg', 'ON Opti-Women Multivitamin 60ct',
];

export const MARKET_WIDGETS: WidgetDefinition[] = [
  defineInsight({
    kind: 'mi-sov', title: 'Share of voice', category: 'Market intelligence', icon: MegaphoneIcon, art: 'split', availability: 'A·W', cta: CTA,
    summary: 'Your brand’s share of first-page results for tracked keywords, against the top 3 competitors.',
    description: 'How visible you are where shoppers search, organic and sponsored together, and whether you’re gaining or losing ground.',
    logic: 'Share of voice = your brand’s results on page 1 ÷ all page-1 results, across tracked keywords, organic and sponsored weighted equally. Compared with 7 days ago, per keyword.',
    sources: ['Anarix Brand SOV', 'Anarix Keyword SOV'],
    build: (m) => {
      const you = m === 'walmart' ? 21 : m === 'amazon' ? 26 : 24;
      const shares = COMPETITORS.map((c) => Math.round(between(c, `sov-${m}`, 9, 22)));
      const others = Math.max(8, 100 - you - shares.reduce((s, x) => s + x, 0));
      const rows = TRACKED.slice(0, 10).map((k) => ({ k, now: Math.round(between(k.id, `sov-now-${m}`, 8, 48)), change: Math.round(between(k.id, `sov-move-${m}`, -9, 8)) })).sort((a, b) => a.change - b.change);
      return {
        line: `${pct(you)} share of voice · ${COMPETITORS.filter((_, i) => shares[i] > you).length ? 'behind a competitor' : 'leading the category'}`,
        segments: [{ label: 'Your brand', value: you, tone: 'a' }, ...COMPETITORS.map((c, i) => ({ label: c, value: shares[i], tone: (['b', 'c', 'd'] as const)[i] })), { label: 'Everyone else', value: others, tone: 'neutral' }],
        rowsHead: ['Keyword', 'Your share'],
        rows: rows.map(({ k, now, change }) => ({ id: k.id, name: k.name, meta: `${signed(change)} pts vs 7 days ago`, value: pct(now), bar: now / 50, tone: (change < -3 ? 'bad' : change > 3 ? 'good' : 'neutral') as Tone })),
      };
    },
  }),
  defineInsight({
    kind: 'mi-rank', title: 'Keyword rank tracker', category: 'Market intelligence', icon: ListNumbersIcon, art: 'list', availability: 'A·W', cta: CTA,
    summary: 'Organic and sponsored rank for tracked keywords, biggest drops first.',
    description: 'A slip from position 3 to 12 drops a product off the first screen. This catches it while it’s still easy to win back.',
    logic: 'For each tracked keyword: your best organic position today against 7 days ago, and your best sponsored position. Sorted by the biggest drop.',
    sources: ['Anarix Keyword tracker'],
    build: (m) => {
      const rows = marketsOf(m).flatMap((mk) => TRACKED.filter((k) => unit(k.id, `ranked-${mk}`) > 0.3).map((k) => {
        const now = whole(k.id, `rank-${mk}`, 1, 38);
        const was = Math.max(1, now + whole(k.id, `rank-move-${mk}`, -9, 7));
        return { id: `${mk}-${k.id}`, k, mk, now, was, sp: whole(k.id, `sp-${mk}`, 1, 12) };
      })).sort((a, b) => (b.now - b.was) - (a.now - a.was));
      const dropped = rows.filter((r) => r.now > r.was).length;
      return {
        line: `${plural(dropped, 'keyword')} dropped · ${num(rows.filter((r) => r.now <= 10).length)} on page 1`,
        stats: [{ label: 'Tracked', value: num(rows.length) }, { label: 'Page 1', value: num(rows.filter((r) => r.now <= 10).length), caption: 'organic top 10', tone: 'good' }, { label: 'Dropped', value: num(dropped), caption: 'vs 7 days ago', tone: dropped ? 'bad' : 'neutral' }],
        rowsHead: ['Keyword', 'Organic rank'],
        rows: rows.map((r) => ({ id: r.id, name: r.k.name, meta: `${MARKET_LABEL[r.mk]} · was #${r.was} · sponsored #${r.sp}`, value: `#${r.now}`, sub: r.now === r.was ? 'no change' : `${r.now > r.was ? 'down' : 'up'} ${Math.abs(r.now - r.was)}`, tone: (r.now > r.was ? 'bad' : r.now < r.was ? 'good' : 'neutral') as Tone })),
      };
    },
  }),
  defineInsight({
    kind: 'mi-sqp', title: 'Search query performance', category: 'Market intelligence', icon: FunnelIcon, art: 'list', availability: 'A', cta: CTA,
    summary: 'For top search queries, your share of impressions, clicks, cart adds and purchases.',
    description: 'Shows where in the funnel you lose shoppers: seen but not clicked means the image, price or title; clicked but not bought means the page.',
    logic: 'For each query: your brand’s share of all impressions, clicks, cart adds and purchases for that query over the last 4 weeks. The leak is the stage with the biggest fall in share.',
    sources: ['Amazon Brand Analytics, Search Query Performance'],
    build: () => {
      const rows = TRACKED.slice(0, 10).map((k) => {
        const imp = between(k.id, 'sqp-imp', 6, 28);
        const click = imp * between(k.id, 'sqp-click', 0.7, 1.35);
        const cart = click * between(k.id, 'sqp-cart', 0.75, 1.3);
        const buy = cart * between(k.id, 'sqp-buy', 0.8, 1.25);
        const stages: [string, number][] = [['impression → click', click / imp], ['click → cart', cart / click], ['cart → purchase', buy / cart]];
        stages.sort((a, b) => a[1] - b[1]);
        return { k, imp, click, cart, buy, leak: stages[0][1] < 0.95 ? stages[0][0] : '' };
      }).sort((a, b) => b.buy - a.buy);
      return {
        line: `${pct(rows.reduce((s, r) => s + r.buy, 0) / rows.length, 1)} average purchase share on ${plural(rows.length, 'query', 'queries')}`,
        rowsHead: ['Query and funnel share', 'Purchases'],
        rows: rows.map((r) => ({ id: r.k.id, name: r.k.name, tag: r.leak ? `Leak: ${r.leak}` : undefined, meta: `Impressions ${pct(r.imp, 1)} · clicks ${pct(r.click, 1)} · cart ${pct(r.cart, 1)}`, value: pct(r.buy, 1), bar: r.buy / 40, tone: (r.buy >= r.imp ? 'good' : 'warn') as Tone })),
      };
    },
  }),
  defineInsight({
    kind: 'mi-competitors', title: 'Competitor watch', category: 'Market intelligence', icon: BinocularsIcon, art: 'feed', availability: 'A·W', cta: CTA,
    summary: 'Tracked competitor items: price changes, rank moves and new deals in 7 days.',
    description: 'A competitor’s price cut or new deal explains a sudden dip in your sales. This shows their moves in one place.',
    logic: 'For each tracked competitor item: price today against 7 days ago, Best Seller Rank today against 7 days ago (lower is better), and any deal or coupon that started this week.',
    sources: ['Anarix Product SOV', 'Market Intelligence product tracking'],
    build: (m) => {
      const rows = marketsOf(m).flatMap((mk) => COMPETITOR_ITEMS.filter((n) => unit(n, `cw-${mk}`) > 0.25).map((n) => {
        const price = Math.round(between(n, `cw-price-${mk}`, 18, 64)) + 0.99;
        const was = Math.round(price * between(n, `cw-was-${mk}`, 0.88, 1.15) * 100) / 100;
        const bsr = whole(n, `cw-bsr-${mk}`, 120, 9000);
        const bsrWas = Math.round(bsr * between(n, `cw-bsr-was-${mk}`, 0.7, 1.4));
        return { id: `${mk}-${n}`, n, mk, price, was, bsr, bsrWas, deal: unit(n, `cw-deal-${mk}`) > 0.66 ? pick(n, `cw-deal-type-${mk}`, ['Lightning Deal', 'Coupon 15% off', 'Rollback', 'Coupon 10% off']) : '' };
      })).filter((r) => r.mk === 'amazon' || !r.deal.startsWith('Lightning')).sort((a, b) => (a.price - a.was) / a.was - (b.price - b.was) / b.was);
      const cuts = rows.filter((r) => r.price < r.was - 0.5).length;
      return {
        line: `${plural(cuts, 'price cut')} · ${plural(rows.filter((r) => r.deal).length, 'new deal')} this week`,
        stats: [{ label: 'Price cuts', value: num(cuts), tone: cuts ? 'warn' : 'neutral' }, { label: 'New deals', value: num(rows.filter((r) => r.deal).length) }, { label: 'Rank gains', value: num(rows.filter((r) => r.bsr < r.bsrWas).length), caption: 'theirs' }],
        rowsHead: ['Competitor item', 'Price'],
        rows: rows.map((r) => ({ id: r.id, name: r.n, tag: r.deal || undefined, meta: `${MARKET_LABEL[r.mk]} · rank #${num(r.bsrWas)} → #${num(r.bsr)} · was ${usd2(r.was)}`, value: usd2(r.price), sub: signedPct(((r.price - r.was) / r.was) * 100), tone: (r.price < r.was - 0.5 ? 'bad' : 'neutral') as Tone })),
      };
    },
  }),
  defineInsight({
    kind: 'mi-basket', title: 'Market basket', category: 'Market intelligence', icon: BasketIcon, art: 'list', availability: 'A', cta: CTA,
    summary: 'What shoppers buy together with your top items, and how often.',
    description: 'Items bought together are ready-made bundles, cross-sell ads and product targets.',
    logic: 'For each of your top items by sales: the item most often in the same order, and the share of the top item’s orders that included it, over the last 4 weeks.',
    sources: ['Amazon Brand Analytics, Market Basket'],
    build: () => {
      const top = productsIn('amazon').sort((a, b) => b.dailyUnits * b.price - a.dailyUnits * a.price).slice(0, 10);
      const all = productsIn('amazon');
      const rows = top.map((p) => {
        const other = all.filter((o) => o.id !== p.id);
        const pair = pick(p.id, 'basket', other);
        return { p, pair, share: between(p.id, 'basket-share', 3, 24) };
      }).sort((a, b) => b.share - a.share);
      return {
        line: `Top pair: ${rows[0].p.name} + ${rows[0].pair.name}`,
        rowsHead: ['Item and bought with', 'Of orders'],
        rows: rows.map((r) => ({ id: r.p.id, name: r.p.name, meta: `with ${r.pair.name}`, value: pct(r.share, 1), bar: r.share / 25 })),
      };
    },
  }),
  defineInsight({
    kind: 'mi-repeat', title: 'Repeat purchase', category: 'Market intelligence', icon: ArrowsCounterClockwiseIcon, art: 'list', availability: 'A', cta: CTA,
    summary: 'Share of customers who buy again, and repeat sales, per item.',
    description: 'Consumables live on repeat orders. Low repeat rates point to quality or value issues; high ones are worth Subscribe & Save.',
    logic: 'Repeat customers % = customers with 2+ orders of the item ÷ all its customers, over 90 days. Repeat sales = sales from those repeat orders.',
    sources: ['Amazon Brand Analytics, Repeat Purchase Behavior'],
    build: () => {
      const rows = productsIn('amazon').map((p) => {
        const rate = between(p.id, 'repeat', 2, 34);
        return { p, rate, sales: p.dailyUnits * 90 * p.price * (rate / 100) * 1.6 };
      }).sort((a, b) => b.sales - a.sales).slice(0, 12);
      const avg = rows.reduce((s, r) => s + r.rate, 0) / Math.max(1, rows.length);
      return {
        line: `${pct(avg, 1)} of customers buy again · ${usdK(rows.reduce((s, r) => s + r.sales, 0))} repeat sales`,
        stats: [{ label: 'Repeat customers', value: pct(avg, 1), caption: 'average' }, { label: 'Repeat sales', value: usdK(rows.reduce((s, r) => s + r.sales, 0)), caption: '90 days', tone: 'good' }],
        rowsHead: ['Item and repeat sales', 'Repeat rate'],
        rows: rows.map((r) => ({ id: r.p.id, name: r.p.name, meta: `${usdK(r.sales)} repeat sales · 90 days`, value: pct(r.rate, 1), bar: r.rate / 35, tone: (r.rate >= 20 ? 'good' : r.rate < 8 ? 'warn' : 'neutral') as Tone })),
      };
    },
  }),
];
