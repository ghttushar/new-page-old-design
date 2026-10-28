import { ArrowUUpLeftIcon, CoinsIcon, PercentIcon, ReceiptIcon, TargetIcon, TrendDownIcon } from '@phosphor-icons/react';
import type { WidgetDefinition } from '../../dashboard.types';
import { defineInsight, type Tone } from './insight-view';
import { MARKET_LABEL, between, num, pct, pick, plural, productsIn, signedPct, unit, unitProfit, usd, usd2, usdK, whole, type Market, type Product } from './shared';

// Profitability: the real bottom line after every cost, which items lose money, and how fees, refunds and the monthly
// target are tracking.

const CTA = { label: 'Open Profitability', to: '/profitability' };
const units30 = (p: Product) => p.dailyUnits * 30;

function totals(m: Market) {
  const ps = productsIn(m);
  const sales = ps.reduce((s, p) => s + p.price * units30(p), 0);
  const cogs = ps.reduce((s, p) => s + p.cost * units30(p), 0);
  const fees = ps.reduce((s, p) => s + (p.referralFee + p.fulfilmentFee + p.storageFee) * units30(p), 0);
  const ads = ps.reduce((s, p) => s + p.adSpend30, 0);
  const refunds = ps.reduce((s, p) => s + p.price * units30(p) * (p.returnRate / 100), 0);
  return { ps, sales, cogs, fees, ads, refunds, net: sales - cogs - fees - ads - refunds };
}

export const PROFIT_WIDGETS: WidgetDefinition[] = [
  defineInsight({
    kind: 'profit-net', title: 'Net profit', category: 'Profitability', icon: CoinsIcon, art: 'split', availability: 'A·W', cta: CTA,
    summary: 'Sales after cost of goods, fees, ad spend and refunds, with margin and where the money goes.',
    description: 'The real bottom line, not just sales. The split shows which cost takes the biggest bite.',
    logic: 'Net profit = sales − cost of goods − marketplace fees (referral, fulfilment, storage) − ad spend − refunds, over the last 30 days. Margin = net profit ÷ sales. Compared with the 30 days before.',
    sources: ['Amazon Finances API', 'Walmart settlement reports', 'Ads reports', 'Anarix Profitability (COGS)'],
    build: (m) => {
      const t = totals(m);
      const margin = t.sales ? (t.net / t.sales) * 100 : 0;
      const change = between(m, 'net-change', -3, 11);
      return {
        line: `${usdK(t.net)} net · ${pct(margin, 1)} margin · 30 days`,
        stats: [{ label: 'Net profit', value: usdK(t.net), caption: '30 days', tone: t.net >= 0 ? 'good' : 'bad' }, { label: 'Margin', value: pct(margin, 1), caption: 'of sales' }, { label: 'Vs prior 30 days', value: signedPct(change), tone: change >= 0 ? 'good' : 'bad' }],
        segments: [
          { label: 'Cost of goods', value: t.cogs, tone: 'c' },
          { label: 'Marketplace fees', value: t.fees, tone: 'b' },
          { label: 'Ad spend', value: t.ads, tone: 'a' },
          { label: 'Refunds', value: t.refunds, tone: 'warn' },
          { label: 'Net profit', value: Math.max(0, t.net), tone: 'good' },
        ],
      };
    },
  }),
  defineInsight({
    kind: 'profit-least', title: 'Least profitable items', category: 'Profitability', icon: TrendDownIcon, art: 'list', availability: 'A·W', cta: CTA,
    summary: 'Items with the lowest net margin, and the cost that hurts each most.',
    description: 'Some best-sellers lose money once fees, ads and returns are counted. These need a price, cost or ad fix.',
    logic: 'Net margin per item = (price − cost − referral fee − fulfilment fee − storage fee − ad spend per unit − refunds per unit) ÷ price. Lowest first, with the biggest cost line after cost of goods.',
    sources: ['Amazon Finances API', 'Walmart settlements', 'Ads reports', 'Anarix Profitability (COGS)'],
    build: (m) => {
      const list = productsIn(m).map((p) => {
        const profit = unitProfit(p);
        const adPerUnit = p.dailyUnits ? p.adSpend30 / units30(p) : 0;
        const costs: [string, number][] = [['fees', p.referralFee + p.fulfilmentFee + p.storageFee], ['ad spend', adPerUnit], ['refunds', p.price * (p.returnRate / 100)]];
        costs.sort((a, b) => b[1] - a[1]);
        return { p, profit, margin: (profit / p.price) * 100, worst: costs[0] };
      }).sort((a, b) => a.margin - b.margin);
      const losing = list.filter((x) => x.profit < 0).length;
      return {
        line: `${plural(losing, 'item')} losing money on every sale`,
        stats: [{ label: 'Losing money', value: num(losing), tone: losing ? 'bad' : 'good' }, { label: 'Under 10% margin', value: num(list.filter((x) => x.margin < 10).length), tone: 'warn' }],
        rowsHead: ['Item and biggest cost', 'Net margin'],
        rows: list.slice(0, 12).map(({ p, profit, margin, worst }) => ({ id: p.id, name: p.name, meta: `${MARKET_LABEL[p.market]} · ${usd2(profit)} a unit · biggest cost: ${worst[0]} (${usd2(worst[1])})`, value: pct(margin, 1), tone: (margin < 0 ? 'bad' : margin < 10 ? 'warn' : 'neutral') as Tone })),
      };
    },
  }),
  defineInsight({
    kind: 'profit-tacos', title: 'TACoS', category: 'Profitability', icon: PercentIcon, art: 'list', availability: 'A·W', cta: CTA,
    summary: 'Ad spend against total sales, beside ACOS, to show how much organic sales lift.',
    description: 'ACOS only counts ad-driven sales. TACoS falling while ACOS holds means ads are building organic sales.',
    logic: 'TACoS = ad spend ÷ total sales (ad + organic). ACOS = ad spend ÷ ad-attributed sales. Organic share = 1 − ad sales ÷ total sales. Shown for the last 30 days and month by month for six months.',
    sources: ['Ads reports', 'Amazon Sales & Traffic', 'Walmart sales reports'],
    build: (m) => {
      const ps = productsIn(m);
      const sales = ps.reduce((s, p) => s + p.price * units30(p), 0);
      const ads = ps.reduce((s, p) => s + p.adSpend30, 0);
      const adSales = ps.reduce((s, p) => s + p.price * units30(p) * between(p.id, 'ad-share', 0.32, 0.62), 0);
      const tacos = sales ? (ads / sales) * 100 : 0;
      const months = Array.from({ length: 6 }, (_, i) => {
        // The first of the month, so the 29th–31st never roll into the next month.
        const now = new Date();
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        return { label: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), tacos: tacos * (1.18 - i * 0.035) * between(`${m}${i}`, 'tacos-month', 0.96, 1.04) };
      });
      const maxT = Math.max(...months.map((x) => x.tacos));
      return {
        line: `TACoS ${pct(tacos, 1)} · ACOS ${pct(adSales ? (ads / adSales) * 100 : 0, 1)} · 30 days`,
        stats: [{ label: 'TACoS', value: pct(tacos, 1), caption: 'of total sales' }, { label: 'ACOS', value: pct(adSales ? (ads / adSales) * 100 : 0, 1), caption: 'of ad sales' }, { label: 'Organic share', value: pct((1 - adSales / Math.max(1, sales)) * 100), caption: 'of sales', tone: 'good' }],
        rowsHead: ['Month', 'TACoS'],
        rows: months.reverse().map((x) => ({ id: x.label, name: x.label, value: pct(x.tacos, 1), bar: x.tacos / maxT })),
      };
    },
  }),
  defineInsight({
    kind: 'profit-fees', title: 'Fee watch', category: 'Profitability', icon: ReceiptIcon, art: 'list', availability: 'A·W', cta: CTA,
    summary: 'Marketplace fees per unit, and items whose fees went up against the last 90 days.',
    description: 'Fees rise quietly, through a size-tier change or a new rate, and eat margin. Catch them early to dispute or reprice.',
    logic: 'Fees per unit = referral + fulfilment + storage. An item is flagged when its fulfilment fee is higher than its 90-day average. Extra cost a month = increase per unit × units sold in 30 days.',
    sources: ['Amazon Finances fee events', 'Fee preview', 'Walmart fee reports'],
    build: (m) => {
      const ps = productsIn(m);
      const up = ps.filter((p) => p.fulfilmentFee > p.fulfilmentFee90).sort((a, b) => (b.fulfilmentFee - b.fulfilmentFee90) * units30(b) - (a.fulfilmentFee - a.fulfilmentFee90) * units30(a));
      const extra = up.reduce((s, p) => s + (p.fulfilmentFee - p.fulfilmentFee90) * units30(p), 0);
      const avg = ps.reduce((s, p) => s + p.referralFee + p.fulfilmentFee + p.storageFee, 0) / Math.max(1, ps.length);
      return {
        line: `${plural(up.length, 'item')} with higher fees · ${usdK(extra)} more a month`,
        stats: [{ label: 'Fees a unit', value: usd2(avg), caption: 'average' }, { label: 'Fees went up', value: num(up.length), tone: up.length ? 'warn' : 'good' }, { label: 'Extra a month', value: usdK(extra), tone: 'bad' }],
        rowsHead: ['Item and fulfilment fee', 'Extra a month'],
        rows: up.map((p) => ({ id: p.id, name: p.name, meta: `${MARKET_LABEL[p.market]} · ${usd2(p.fulfilmentFee90)} → ${usd2(p.fulfilmentFee)} a unit${unit(p.id, 'tier') > 0.5 ? ' · size tier changed' : ''}`, value: usd((p.fulfilmentFee - p.fulfilmentFee90) * units30(p)), tone: 'bad' as const })),
        empty: 'No fee increases against the last 90 days.',
      };
    },
  }),
  defineInsight({
    kind: 'profit-refunds', title: 'Refunds & reimbursements', category: 'Profitability', icon: ArrowUUpLeftIcon, art: 'stats', availability: 'A', cta: CTA,
    summary: 'Money refunded to customers, and money Amazon owes you for lost or damaged stock.',
    description: 'Amazon doesn’t always reimburse lost or damaged inventory on its own. These cases are money to claim back.',
    logic: 'Refunds = refunded order value over 30 days. Reimbursable = units lost or damaged in Amazon’s care, or returns never received back, that haven’t been reimbursed, valued at the average sale price. Each case shows the days left to claim (60-day window).',
    sources: ['Amazon Finances API (refunds)', 'FBA reimbursements report', 'Inventory adjustments'],
    build: () => {
      const ps = productsIn('amazon');
      const refunds = ps.reduce((s, p) => s + p.price * units30(p) * (p.returnRate / 100), 0);
      const reasons = ['Lost in warehouse', 'Damaged in warehouse', 'Customer return not received'];
      const cases = ps.filter((p) => unit(p.id, 'claim') > 0.8).map((p) => {
        const units = whole(p.id, 'claim-units', 2, 38);
        return { p, units, amount: units * p.price * 0.85, reason: pick(p.id, 'claim-why', reasons), left: whole(p.id, 'claim-left', 6, 58) };
      }).sort((a, b) => a.left - b.left);
      const owed = cases.reduce((s, c) => s + c.amount, 0);
      return {
        line: `${usdK(owed)} to claim back · ${plural(cases.length, 'case')}`,
        stats: [{ label: 'Refunds', value: usdK(refunds), caption: '30 days' }, { label: 'To claim', value: usdK(owed), caption: 'reimbursable', tone: 'good' }, { label: 'Cases', value: num(cases.length) }],
        rowsHead: ['Item and reason', 'Claim'],
        rows: cases.map((c) => ({ id: c.p.id, name: c.p.name, meta: `${c.reason} · ${plural(c.units, 'unit')} · ${plural(c.left, 'day')} left to claim`, value: usd(c.amount), tone: (c.left < 14 ? 'warn' : 'neutral') as Tone })),
        empty: 'Nothing to claim.',
      };
    },
  }),
  defineInsight({
    kind: 'profit-target', title: 'Sales vs target', category: 'Profitability', icon: TargetIcon, art: 'gauge', availability: 'A·W', cta: CTA,
    summary: 'Month-to-date sales against the monthly target, the projected finish and what’s needed a day.',
    description: 'Shows early in the month whether the goal will be met, and how much a day closes the gap.',
    logic: 'Projected month = month-to-date sales ÷ days elapsed × days in the month. Needed a day = (target − month to date) ÷ days left. Each marketplace is paced against its own target.',
    sources: ['Sales reports', 'Targets set in Anarix'],
    build: (m) => {
      const now = new Date();
      const day = now.getDate();
      const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const left = Math.max(1, days - day);
      const pace = (mk: 'amazon' | 'walmart') => {
        const daily = productsIn(mk).reduce((s, p) => s + p.price * p.dailyUnits, 0);
        const mtd = daily * day;
        const target = Math.round((daily * days * (mk === 'amazon' ? 1.06 : 0.97)) / 1000) * 1000;
        return { mk, mtd, target, projected: (mtd / day) * days, needed: Math.max(0, (target - mtd) / left) };
      };
      const list = (m === 'all' ? (['amazon', 'walmart'] as const) : [m] as const).map(pace);
      const mtd = list.reduce((s, x) => s + x.mtd, 0);
      const target = list.reduce((s, x) => s + x.target, 0);
      const projected = list.reduce((s, x) => s + x.projected, 0);
      return {
        line: `${usdK(mtd)} of ${usdK(target)} · on pace for ${usdK(projected)}`,
        stats: [{ label: 'Month to date', value: usdK(mtd), caption: `day ${day} of ${days}` }, { label: 'Target', value: usdK(target) }, { label: 'Projected', value: usdK(projected), caption: projected >= target ? 'on track' : 'short', tone: projected >= target ? 'good' : 'bad' }],
        rowsHead: ['Marketplace', 'Of target'],
        rows: list.map((x) => ({ id: x.mk, name: MARKET_LABEL[x.mk], meta: `${usdK(x.mtd)} of ${usdK(x.target)} · needs ${usd(x.needed)} a day`, value: pct((x.mtd / x.target) * 100), sub: `projected ${usdK(x.projected)}`, bar: x.mtd / x.target, tone: (x.projected >= x.target ? 'good' : 'warn') as Tone })),
      };
    },
  }),
];
