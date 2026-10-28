import { ChartPieSliceIcon, ClockIcon, GaugeIcon, LayoutIcon, SlidersHorizontalIcon, TrashSimpleIcon, UserPlusIcon } from '@phosphor-icons/react';
import type { WidgetDefinition } from '../../dashboard.types';
import { defineInsight, type Tone } from './insight-view';
import { MARKET_LABEL, between, campaignsIn, keywordsIn, num, pct, pick, plural, ratio, signedPct, sumTotals, unit, usd, usd2, usdK, whole, type Market, type Marketplace } from './shared';

// More for Campaign Manager: budgets that run dry, search terms that never sell, where and when ads convert, and
// whether the bidder's changes helped.

const CTA = { label: 'Open Campaign Manager', to: '/advertising/campaign-manager' };
const roas = (t: { spend: number; sales: number }) => (t.spend ? t.sales / t.spend : 0);
const clock = (hour: number) => {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60 / 15) * 15;
  const hh = (h + (m === 60 ? 1 : 0)) % 24;
  return `${hh % 12 || 12}:${String(m % 60).padStart(2, '0')} ${hh < 12 ? 'AM' : 'PM'}`;
};

const SEARCH_TERMS = [
  'protein powder for women', 'cheap whey protein', 'creatine for kids', 'gym bag waterproof', 'keto diet pills',
  'protein shaker electric', 'vegan collagen', 'free sample protein', 'whey protein 5kg', 'pre workout energy drink can',
  'muscle gain tablets', 'fat burner fast', 'yoga mat thick', 'protein bar recipe', 'organic oats bulk 10kg',
];

const PLACEMENTS: Record<Marketplace, string[]> = {
  amazon: ['Top of search', 'Rest of search', 'Product pages'],
  walmart: ['Search in-grid', 'Search carousel', 'Item carousel', 'Buy Box'],
};

export const ADS_WIDGETS: WidgetDefinition[] = [
  defineInsight({
    kind: 'ads-budget-pacing', title: 'Budget pacing', category: 'Campaign Manager', icon: GaugeIcon, art: 'list', availability: 'A·W', cta: CTA,
    summary: 'Campaigns that run out of budget before the evening, and the sales they miss.',
    description: 'A campaign that runs dry at 3 PM misses the evening, often the best hours. These need a bigger budget or tighter bids.',
    logic: 'Out-of-budget time = 24 h × daily budget ÷ the spend the campaign would reach uncapped. Campaigns out before 6 PM on most of the last 7 days are listed. Missed sales a day = (uncapped spend − budget) × the campaign’s ROAS.',
    sources: ['Amazon Ads budget usage', 'Budget recommendations', 'Walmart Connect campaign reports'],
    build: (m) => {
      const out = campaignsIn(m).map((c) => {
        const demand = c.budget * between(c.id, 'demand', 0.7, 1.9);
        const hour = Math.min(24, (24 * c.budget) / demand);
        return { c, demand, hour, days: hour < 18 ? whole(c.id, 'out-days', 3, 7) : 0, missed: Math.max(0, demand - c.budget) * roas(c.totals) };
      }).filter((x) => x.hour < 18).sort((a, b) => a.hour - b.hour);
      const missed = out.reduce((s, x) => s + x.missed, 0);
      return {
        line: `${plural(out.length, 'campaign')} out of budget before 6 PM · ${usdK(missed)} sales missed a day`,
        stats: [{ label: 'Running out early', value: num(out.length), tone: out.length ? 'warn' : 'good' }, { label: 'Missed sales', value: usdK(missed), caption: 'a day', tone: 'bad' }, { label: 'Extra budget', value: usdK(out.reduce((s, x) => s + x.demand - x.c.budget, 0)), caption: 'a day to cover it' }],
        rowsHead: ['Campaign and budget', 'Runs out'],
        rows: out.map(({ c, hour, days, missed: lost }) => ({ id: c.id, name: c.name, tag: c.adType, meta: `${MARKET_LABEL[c.market]} · ${usd(c.budget)} a day · out ${days} of 7 days · ${usd(lost)} missed a day`, value: clock(hour), bar: hour / 24, tone: (hour < 14 ? 'bad' : 'warn') as Tone })),
        empty: 'Every campaign lasts into the evening.',
      };
    },
  }),
  defineInsight({
    kind: 'ads-wasted', title: 'Wasted spend', category: 'Campaign Manager', icon: TrashSimpleIcon, art: 'list', availability: 'A·W', cta: { label: 'Open Targeting Actions', to: '/advertising/targeting-actions' },
    summary: 'Search terms with clicks and spend but no orders in 30 days, ready to add as negatives.',
    description: 'Spend on terms that never convert is money you can move to terms that do. Each one here is a negative keyword waiting to be added.',
    logic: 'Search terms with 10 or more clicks and 0 orders over the last 30 days, ranked by spend. Total wasted = the sum of their spend.',
    sources: ['Amazon search term report', 'Walmart Connect keyword report'],
    build: (m) => {
      const markets: Marketplace[] = m === 'all' ? ['amazon', 'walmart'] : [m];
      const terms = markets.flatMap((mk) => SEARCH_TERMS.filter((t) => unit(t, `waste-${mk}`) > 0.45).map((t) => {
        const clicks = whole(t, `clicks-${mk}`, 10, 96);
        const cpc = between(t, `cpc-${mk}`, 0.45, 1.9);
        const campaign = pick(t, `from-${mk}`, campaignsIn(mk)).name;
        return { id: `${mk}-${t}`, term: t, mk, clicks, spend: clicks * cpc, campaign };
      })).sort((a, b) => b.spend - a.spend);
      const spend = terms.reduce((s, t) => s + t.spend, 0);
      return {
        line: `${usdK(spend)} spent on ${plural(terms.length, 'term')} with no orders · 30 days`,
        stats: [{ label: 'Wasted', value: usdK(spend), caption: '30 days', tone: 'bad' }, { label: 'Terms', value: num(terms.length), caption: '10+ clicks, 0 orders' }, { label: 'Clicks', value: num(terms.reduce((s, t) => s + t.clicks, 0)) }],
        rowsHead: ['Search term and campaign', 'Spend'],
        rows: terms.map((t) => ({ id: t.id, name: t.term, meta: `${MARKET_LABEL[t.mk]} · ${t.campaign} · ${num(t.clicks)} clicks, 0 orders`, value: usd(t.spend), tone: 'bad' as const })),
        empty: 'No search terms over 10 clicks without an order.',
      };
    },
  }),
  defineInsight({
    kind: 'ads-placement', title: 'Placement performance', category: 'Campaign Manager', icon: LayoutIcon, art: 'list', availability: 'A·W', cta: CTA,
    summary: 'ROAS and ACOS by where the ad showed, with a suggested bid adjustment for each placement.',
    description: 'The same keyword converts differently at the top of search and on a product page. Bid adjustments per placement move spend to where it returns most.',
    logic: 'Spend and sales split by placement over 30 days. ROAS = sales ÷ spend. Suggested adjustment = (placement ROAS ÷ overall ROAS − 1), capped at +50% and −50%, rounded to 5%.',
    sources: ['Amazon placement report', 'Walmart Connect placement report'],
    build: (m) => {
      const markets: Marketplace[] = m === 'all' ? ['amazon', 'walmart'] : [m];
      const rows = markets.flatMap((mk) => {
        const t = sumTotals(campaignsIn(mk));
        const shares = PLACEMENTS[mk].map((pl) => between(pl, `share-${mk}`, 0.4, 1.6));
        const total = shares.reduce((s, x) => s + x, 0);
        const overall = roas(t);
        return PLACEMENTS[mk].map((pl, i) => {
          const spend = (t.spend * shares[i]) / total;
          const r = overall * between(pl, `eff-${mk}`, 0.62, 1.42);
          const adj = Math.max(-50, Math.min(50, Math.round(((r / overall - 1) * 100) / 5) * 5));
          return { mk, pl, spend, r, adj };
        });
      });
      const best = [...rows].sort((a, b) => b.r - a.r)[0];
      const maxR = Math.max(...rows.map((x) => x.r));
      return {
        line: `Best: ${best.pl} at ${ratio(best.r)} ROAS`,
        stats: [{ label: 'Best placement', value: best.pl, caption: `${ratio(best.r)} ROAS`, tone: 'good' }, { label: 'Placements', value: num(rows.length) }],
        rowsHead: ['Placement and suggested bid', 'ROAS'],
        rows: rows.map((x) => ({ id: `${x.mk}-${x.pl}`, name: x.pl, meta: `${MARKET_LABEL[x.mk]} · ${usd(x.spend)} spend · ACOS ${pct(100 / x.r, 1)} · suggest ${x.adj > 0 ? '+' : x.adj < 0 ? '−' : ''}${Math.abs(x.adj)}%`, value: ratio(x.r), bar: x.r / maxR, tone: (x.adj >= 10 ? 'good' : x.adj <= -10 ? 'bad' : 'neutral') as Tone })),
      };
    },
  }),
  defineInsight({
    kind: 'ads-mix', title: 'Ad type mix', category: 'Campaign Manager', icon: ChartPieSliceIcon, art: 'split', availability: 'A·W', cta: CTA,
    summary: 'Spend split by ad type, with sales and ROAS for each.',
    description: 'Shows whether the budget sits with the ad types that return most: Sponsored Products, Brands and Display on Amazon; Sponsored Products, Brands and Video on Walmart.',
    logic: 'Spend, sales and ROAS summed by ad type over 30 days. The bars show each type’s share of spend.',
    sources: ['Amazon Ads reports', 'Walmart Connect reports'],
    build: (m) => {
      const names: Record<string, string> = { SP: 'Sponsored Products', SB: 'Sponsored Brands', SD: 'Sponsored Display', Video: 'Sponsored Videos' };
      const groups = new Map<string, ReturnType<typeof campaignsIn>>();
      campaignsIn(m).forEach((c) => groups.set(c.adType, [...(groups.get(c.adType) ?? []), c]));
      const types = [...groups.entries()].map(([type, cs]) => ({ type, t: sumTotals(cs), count: cs.length })).sort((a, b) => b.t.spend - a.t.spend);
      const all = sumTotals(campaignsIn(m));
      const tones = ['a', 'b', 'c', 'd'] as const;
      return {
        line: `${usdK(all.spend)} spend · ${ratio(roas(all))} ROAS across ${plural(types.length, 'ad type')}`,
        segments: types.map((x, i) => ({ label: names[x.type] ?? x.type, value: x.t.spend, tone: tones[i % tones.length] })),
        rowsHead: ['Ad type', 'ROAS'],
        rows: types.map((x) => ({ id: x.type, name: names[x.type] ?? x.type, meta: `${plural(x.count, 'campaign')} · ${usdK(x.t.spend)} spend · ${usdK(x.t.sales)} sales`, value: ratio(roas(x.t)), tone: (roas(x.t) >= roas(all) ? 'good' : 'warn') as Tone })),
      };
    },
  }),
  defineInsight({
    kind: 'ads-bid-impact', title: 'Bid changes impact', category: 'Campaign Manager', icon: SlidersHorizontalIcon, art: 'list', availability: 'A·W', cta: { label: 'Open Analysis', to: '/advertising/analysis' },
    summary: 'Bid changes made by the bidder and rules in 7 days, and ROAS before and after each.',
    description: 'Shows whether automated bid changes are paying off, so you can trust them or step in.',
    logic: 'For each keyword whose bid changed in the last 7 days: the bid before → after, and ROAS for the 7 days before the change against the days since. Improved = ROAS after is higher.',
    sources: ['Anarix bidder log', 'Rules log', 'Impact analysis'],
    build: (m) => {
      const changes = keywordsIn(m).filter((k) => unit(k.id, 'bid-changed') > 0.35).map((k) => {
        const bid = Math.round(between(k.id, 'bid', 0.55, 2.4) * 100) / 100;
        const up = unit(k.id, 'bid-dir') > 0.45;
        const after = Math.round(bid * (up ? between(k.id, 'bid-up', 1.06, 1.3) : between(k.id, 'bid-down', 0.72, 0.94)) * 100) / 100;
        const before = roas(k.totals);
        const now = before * between(k.id, 'bid-effect', up ? 0.88 : 0.95, up ? 1.32 : 1.38);
        return { k, bid, after, before, now, by: unit(k.id, 'bid-by') > 0.4 ? 'Bidder' : 'Rule' };
      }).sort((a, b) => (b.now - b.before) - (a.now - a.before));
      const better = changes.filter((c) => c.now > c.before).length;
      return {
        line: `${plural(changes.length, 'bid change')} in 7 days · ${num(better)} improved ROAS`,
        stats: [{ label: 'Bid changes', value: num(changes.length), caption: '7 days' }, { label: 'Improved', value: num(better), tone: 'good' }, { label: 'Got worse', value: num(changes.length - better), tone: changes.length - better ? 'bad' : 'neutral' }],
        rowsHead: ['Keyword and bid', 'ROAS change'],
        rows: changes.map(({ k, bid, after, before, now, by }) => ({ id: k.id, name: k.name, tag: by, meta: `${usd2(bid)} → ${usd2(after)} · ROAS ${ratio(before)} → ${ratio(now)}`, value: signedPct(((now - before) / before) * 100), tone: (now >= before ? 'good' : 'bad') as Tone })),
        empty: 'No bid changes in the last 7 days.',
      };
    },
  }),
  defineInsight({
    kind: 'ads-ntb', title: 'New-to-brand', category: 'Campaign Manager', icon: UserPlusIcon, art: 'stats', availability: 'A', cta: CTA,
    summary: 'Share of ad orders from shoppers new to your brand, and the trend over six months.',
    description: 'Sponsored Brands and Display are meant to win new customers. This shows whether they do.',
    logic: 'New-to-brand % = orders from shoppers who haven’t bought from the brand in 12 months ÷ all ad orders, from Sponsored Brands and Sponsored Display. Shown for 30 days and month by month.',
    sources: ['Amazon Ads new-to-brand metrics'],
    build: () => {
      const brand = campaignsIn('amazon').filter((c) => c.adType !== 'SP');
      const t = sumTotals(brand.length ? brand : campaignsIn('amazon'));
      const share = 0.58;
      const months = Array.from({ length: 6 }, (_, i) => {
        // The first of the month, so the 29th–31st never roll into the next month.
        const now = new Date();
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return { label: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), share: share * (1 - i * 0.025) * between(String(i), 'ntb-month', 0.95, 1.05) };
      });
      return {
        line: `${pct(share * 100)} of ad orders new to brand · ${usdK(t.sales * share)} sales`,
        stats: [{ label: 'New-to-brand', value: pct(share * 100), caption: 'of ad orders', tone: 'good' }, { label: 'NTB orders', value: num(t.orders * share), caption: '30 days' }, { label: 'NTB sales', value: usdK(t.sales * share), caption: '30 days' }],
        rowsHead: ['Month', 'New-to-brand'],
        rows: months.map((x) => ({ id: x.label, name: x.label, value: pct(x.share * 100), bar: x.share })),
      };
    },
  }),
  defineInsight({
    kind: 'ads-daypart', title: 'Day-part heatmap', category: 'Campaign Manager', icon: ClockIcon, art: 'heat', availability: 'A·W', size: { w: 8, h: 7, minW: 6, minH: 6 }, cta: { label: 'Open Day Parting', to: '/day-parting' },
    summary: 'ROAS by hour and weekday, with the hours Day Parting has paused.',
    description: 'Shows when ads convert best, so bids can rise in the strong hours and drop in the weak ones.',
    logic: 'Sales ÷ spend for each 2-hour slot and weekday over the last 4 weeks. Darker cells return more. Slots Day Parting has paused are marked.',
    sources: ['Hourly Amazon Ads data (Marketing Stream)', 'Walmart Connect hourly reports', 'Day Parting schedules'],
    build: (m: Market) => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const cols = ['12a', '2a', '4a', '6a', '8a', '10a', '12p', '2p', '4p', '6p', '8p', '10p'];
      const base = roas(sumTotals(campaignsIn(m)));
      const shape = [0.45, 0.35, 0.4, 0.7, 0.95, 1.05, 1.1, 1.0, 1.05, 1.25, 1.4, 1.0];
      const values = days.map((d, r) => cols.map((c, i) => base * shape[i] * (r >= 5 ? 1.08 : 1) * between(`${m}${d}${c}`, 'heat', 0.85, 1.15)));
      const off = days.map(() => cols.map((_, i) => i <= 2));
      let best = { r: 0, c: 0 };
      values.forEach((row, r) => row.forEach((v, c) => { if (v > values[best.r][best.c]) best = { r, c }; }));
      return {
        line: `Best: ${days[best.r]} ${cols[best.c]}–${cols[(best.c + 1) % 12]} at ${ratio(values[best.r][best.c])} ROAS`,
        heat: { rows: days, cols, values, off, format: ratio, legend: 'Darker returns more · hatched hours are paused by Day Parting' },
      };
    },
  }),
];
