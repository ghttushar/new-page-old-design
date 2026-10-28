import { ArchiveIcon, ArrowsClockwiseIcon, HourglassIcon, ProhibitIcon, TruckIcon, WarehouseIcon, WarningIcon } from '@phosphor-icons/react';
import type { WidgetDefinition } from '../../dashboard.types';
import { defineInsight, type Row, type Tone } from './insight-view';
import { MARKET_LABEL, num, pct, pick, plural, productsIn, unit, usd, usdK, whole, type Product } from './shared';

// Inventory & fulfilment: what runs out first, what can't sell, what's arriving and what to send next.

const CTA = { label: 'Open Inventory', to: '/inventory' };
const THRESHOLD = 21;
const TARGET_COVER = 45;
const cover = (p: Product) => (p.dailyUnits > 0 ? p.sellable / p.dailyUnits : Infinity);
const outBy = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + Math.floor(days));
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
};

export const INVENTORY_WIDGETS: WidgetDefinition[] = [
  defineInsight({
    kind: 'inv-cover', title: 'Days of cover', category: 'Inventory', icon: HourglassIcon, art: 'list', availability: 'A·W', cta: CTA,
    summary: 'Items that will run out first, with the day they run out.',
    description: 'Stock-outs lose sales and organic rank. This shows which items run out first so you can send stock in time.',
    logic: `Days of cover = sellable units ÷ average daily units over the last 30 days. Lists items under ${THRESHOLD} days, soonest first, with the projected stock-out date (today + days of cover).`,
    sources: ['FBA Inventory / Inventory Planning report', 'WFS Inventory', 'Sales report'],
    build: (m) => {
      const ps = productsIn(m).filter((p) => p.sellable > 0);
      const low = ps.filter((p) => cover(p) < THRESHOLD).sort((a, b) => cover(a) - cover(b));
      const sorted = ps.map(cover).sort((a, b) => a - b);
      const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
      return {
        line: `${plural(low.length, 'item')} under ${THRESHOLD} days of cover`,
        stats: [
          { label: `Under ${THRESHOLD} days`, value: num(low.length), tone: low.length ? 'warn' : 'good' },
          { label: 'Out in 7 days', value: num(low.filter((p) => cover(p) < 7).length), tone: 'bad' },
          { label: 'Median cover', value: `${Math.round(median)}d`, caption: 'all items' },
        ],
        rowsHead: ['Item', 'Cover'],
        rows: low.map((p) => {
          const d = cover(p);
          return { id: p.id, name: p.name, meta: `${MARKET_LABEL[p.market]} · ${num(p.sellable)} units · ${p.dailyUnits.toFixed(1)} a day`, value: `${Math.floor(d)} days`, sub: `out ${outBy(d)}`, bar: d / THRESHOLD, tone: (d < 7 ? 'bad' : 'warn') as Tone };
        }),
        empty: `Every item has ${THRESHOLD}+ days of cover.`,
      };
    },
  }),
  defineInsight({
    kind: 'inv-oos', title: 'Out of stock now', category: 'Inventory', icon: ProhibitIcon, art: 'stats', availability: 'A·W', cta: CTA,
    summary: 'Items with no sellable stock, the sales lost each day and any ads still running on them.',
    description: 'Every day out of stock loses sales, and ads still running on the item waste spend. Pause the ads and restock.',
    logic: 'Items with 0 sellable units. Lost sales a day = average daily units (before running out) × price. Ad spend still running = the item’s average daily ad spend, when its ads are on.',
    sources: ['FBA Inventory', 'WFS Inventory', 'Ads reports'],
    build: (m) => {
      const out = productsIn(m).filter((p) => p.sellable === 0).sort((a, b) => b.dailyUnits * b.price - a.dailyUnits * a.price);
      const lost = out.reduce((s, p) => s + p.dailyUnits * p.price, 0);
      const adWaste = out.filter((p) => p.isAdvertised).reduce((s, p) => s + p.adSpend30 / 30, 0);
      return {
        line: `${plural(out.length, 'item')} out of stock · ${usdK(lost)} a day lost`,
        stats: [
          { label: 'Out of stock', value: num(out.length), tone: out.length ? 'bad' : 'good' },
          { label: 'Lost a day', value: usdK(lost), caption: 'sales' },
          { label: 'Ads still on', value: usdK(adWaste), caption: 'spend a day', tone: adWaste ? 'warn' : undefined },
        ],
        rowsHead: ['Item', 'Lost a day'],
        rows: out.map((p) => ({ id: p.id, name: p.name, meta: `${MARKET_LABEL[p.market]}${p.inbound ? ` · ${num(p.inbound)} inbound` : ' · nothing inbound'}`, tag: p.isAdvertised ? 'Ads on' : undefined, value: usd(p.dailyUnits * p.price), sub: 'sales', tone: 'bad' as const })),
        empty: 'Nothing is out of stock.',
      };
    },
  }),
  defineInsight({
    kind: 'inv-aged', title: 'Overstock & aged inventory', category: 'Inventory', icon: ArchiveIcon, art: 'split', availability: 'A·W', cta: CTA,
    summary: 'Stock sitting too long: units by age, their value and the storage surcharge coming.',
    description: 'Aged stock ties up cash and attracts surcharges. Use it to plan promotions, removals or liquidation.',
    logic: 'Units in stock for 91–180, 181–365 and 365+ days, their value at cost, and the estimated monthly aged-inventory surcharge: $0.45 a unit at 181–365 days and $1.10 a unit past 365 days (size-tier average). Items with the most aged units first.',
    sources: ['FBA Inventory Planning (aged inventory)', 'WFS inventory aging'],
    build: (m) => {
      const ps = productsIn(m);
      const sum = (i: 0 | 1 | 2) => ps.reduce((s, p) => s + p.aged[i], 0);
      const [a, b, c] = [sum(0), sum(1), sum(2)];
      const value = ps.reduce((s, p) => s + (p.aged[0] + p.aged[1] + p.aged[2]) * p.cost, 0);
      const surcharge = b * 0.45 + c * 1.1;
      const top = ps.filter((p) => p.aged[0] + p.aged[1] + p.aged[2] > 0).sort((x, y) => (y.aged[1] + y.aged[2]) - (x.aged[1] + x.aged[2]));
      return {
        line: `${num(a + b + c)} aged units · ${usdK(value)} at cost`,
        stats: [{ label: 'Aged units', value: num(a + b + c), caption: '91+ days' }, { label: 'Value at cost', value: usdK(value) }, { label: 'Surcharge', value: usdK(surcharge), caption: 'est. a month', tone: 'warn' }],
        segments: [{ label: '91–180 days', value: a, tone: 'neutral' }, { label: '181–365 days', value: b, tone: 'warn' }, { label: '365+ days', value: c, tone: 'bad' }],
        rowsHead: ['Item', '181+ days'],
        rows: top.slice(0, 10).map((p) => ({ id: p.id, name: p.name, meta: `${MARKET_LABEL[p.market]} · ${num(p.aged[0])} at 91–180 days`, value: num(p.aged[1] + p.aged[2]), sub: usd((p.aged[1] + p.aged[2]) * p.cost), tone: p.aged[2] ? 'bad' as const : 'warn' as const })),
      };
    },
  }),
  defineInsight({
    kind: 'inv-inbound', title: 'Inbound shipments', category: 'Inventory', icon: TruckIcon, art: 'feed', availability: 'A·W', cta: CTA,
    summary: 'Shipments on their way, units expected against received, and any shortfall.',
    description: 'Know what is arriving and spot shipments received short, which need a case opened.',
    logic: 'Each inbound shipment with its status (Working, Shipped, Receiving, Closed), units expected and units received so far. A discrepancy is a closed shipment received short of what was sent.',
    sources: ['Amazon Fulfillment Inbound API', 'WFS Inbound'],
    build: (m) => {
      const statuses = ['Working', 'Shipped', 'Receiving', 'Closed'] as const;
      const ships = productsIn(m).filter((p) => p.inbound > 0).map((p) => {
        const status = pick(p.id, 'ship-status', statuses);
        const expected = p.inbound;
        const received = status === 'Receiving' ? Math.round(expected * 0.55) : status === 'Closed' ? (unit(p.id, 'short') > 0.6 ? expected - whole(p.id, 'short-n', 2, 24) : expected) : 0;
        return { p, status, expected, received, id: `${p.market === 'amazon' ? 'FBA' : 'WFS'}${whole(p.id, 'ship', 17000000, 17999999)}` };
      });
      const short = ships.filter((s) => s.status === 'Closed' && s.received < s.expected);
      const onWay = ships.filter((s) => s.status !== 'Closed').reduce((s, x) => s + x.expected - x.received, 0);
      const rows: Row[] = ships.map((s) => ({ id: s.id, name: `${s.id} · ${s.p.name}`, meta: `${MARKET_LABEL[s.p.market]} · ${s.status}`, tag: s.status === 'Closed' && s.received < s.expected ? 'Short' : s.status, value: `${num(s.received)} / ${num(s.expected)}`, sub: 'received', bar: s.received / s.expected, tone: s.status === 'Closed' && s.received < s.expected ? 'bad' : undefined }));
      return {
        line: `${plural(ships.filter((s) => s.status !== 'Closed').length, 'shipment')} on the way · ${num(onWay)} units`,
        stats: [{ label: 'In transit', value: num(ships.filter((s) => s.status !== 'Closed').length), caption: 'shipments' }, { label: 'Units coming', value: num(onWay) }, { label: 'Received short', value: num(short.length), tone: short.length ? 'bad' : 'good' }],
        rowsHead: ['Shipment', 'Received'],
        rows,
        empty: 'No inbound shipments.',
      };
    },
  }),
  defineInsight({
    kind: 'inv-stranded', title: 'Stranded & unfulfillable', category: 'Inventory', icon: WarningIcon, art: 'list', availability: 'A', cta: CTA,
    summary: 'Stock in Amazon’s warehouses that can’t sell: stranded or unfulfillable, with its value.',
    description: 'Stranded units pay storage without selling; unfulfillable units need removing or reimbursing.',
    logic: 'Stranded = units with no active offer (listing suppressed, inactive or priced in error). Unfulfillable = units marked customer-damaged, warehouse-damaged or expired. Value = units × cost.',
    sources: ['FBA stranded inventory report', 'FBA Inventory API'],
    build: () => {
      const ps = productsIn('amazon').filter((p) => p.stranded || p.unfulfillable);
      const stranded = ps.reduce((s, p) => s + p.stranded, 0);
      const unf = ps.reduce((s, p) => s + p.unfulfillable, 0);
      const value = ps.reduce((s, p) => s + (p.stranded + p.unfulfillable) * p.cost, 0);
      const why = ['Customer damaged', 'Warehouse damaged', 'Expired'];
      return {
        line: `${num(stranded + unf)} units can’t sell · ${usdK(value)}`,
        stats: [{ label: 'Stranded', value: num(stranded), caption: 'no active offer', tone: 'warn' }, { label: 'Unfulfillable', value: num(unf), caption: 'damaged or expired', tone: 'bad' }, { label: 'Value', value: usdK(value), caption: 'at cost' }],
        rowsHead: ['Item and reason', 'Units'],
        rows: ps.map((p) => ({ id: p.id, name: p.name, meta: [p.stranded ? `Stranded: ${p.statusReason || 'no active offer'}` : '', p.unfulfillable ? `Unfulfillable: ${pick(p.id, 'unf-why', why).toLowerCase()}` : ''].filter(Boolean).join(' · '), value: num(p.stranded + p.unfulfillable), sub: usd((p.stranded + p.unfulfillable) * p.cost), tone: 'warn' as const })),
      };
    },
  }),
  defineInsight({
    kind: 'inv-storage', title: 'Storage limits', category: 'Inventory', icon: WarehouseIcon, art: 'gauge', availability: 'A', cta: CTA,
    summary: 'Storage used against your capacity limit by size tier, and your IPI score.',
    description: 'Over the limit, Amazon blocks new shipments or charges overage fees. Check headroom before sending stock.',
    logic: 'For each storage type: cubic feet used ÷ your capacity limit. Over 90% is close to the limit. The Inventory Performance Index (IPI) is shown against the 400 threshold below which limits tighten.',
    sources: ['FBA Inventory Planning', 'Capacity limits', 'Inventory Performance Index'],
    build: () => {
      const ps = productsIn('amazon');
      const used = ps.reduce((s, p) => s + p.sellable * 0.06, 0);
      const tiers: [string, number, number][] = [['Standard-size', used * 0.78, 2600], ['Oversize', used * 0.16, 900], ['Apparel', used * 0.04, 300], ['Footwear', used * 0.02, 150]];
      const ipi = 512;
      return {
        line: `IPI ${ipi} · ${pct((tiers[0][1] / tiers[0][2]) * 100)} of standard-size limit used`,
        stats: [{ label: 'IPI score', value: `${ipi}`, caption: 'threshold 400', tone: ipi >= 400 ? 'good' : 'bad' }, { label: 'Space used', value: `${num(used)} ft³`, caption: 'all tiers' }],
        rowsHead: ['Storage type', 'Used of limit'],
        rows: tiers.map(([name, u, limit]) => {
          const share = u / limit;
          return { id: name, name, meta: `${num(u)} of ${num(limit)} ft³`, value: pct(share * 100), bar: share, tone: (share > 0.9 ? 'bad' : share > 0.75 ? 'warn' : 'good') as Tone };
        }),
      };
    },
  }),
  defineInsight({
    kind: 'inv-reorder', title: 'Reorder suggestions', category: 'Inventory', icon: ArrowsClockwiseIcon, art: 'list', availability: 'A·W', cta: CTA,
    summary: 'What to send next and how much, to keep every item in stock.',
    description: 'A ready-to-send list: items below their reorder point and the units that bring them back to target cover.',
    logic: `Suggested units = ${TARGET_COVER} days × average daily units − (sellable + inbound units), for items whose cover including inbound is under ${THRESHOLD} days. Largest orders first.`,
    sources: ['Inventory', 'Sales report', 'Anarix Inventory planning'],
    build: (m) => {
      const list = productsIn(m)
        .map((p) => ({ p, coverIn: p.dailyUnits ? (p.sellable + p.inbound) / p.dailyUnits : Infinity, units: Math.max(0, Math.round(TARGET_COVER * p.dailyUnits - p.sellable - p.inbound)) }))
        .filter((x) => x.coverIn < THRESHOLD && x.units > 0)
        .sort((a, b) => b.units - a.units);
      const units = list.reduce((s, x) => s + x.units, 0);
      const value = list.reduce((s, x) => s + x.units * x.p.cost, 0);
      return {
        line: `${plural(list.length, 'item')} to reorder · ${num(units)} units`,
        stats: [{ label: 'Items', value: num(list.length) }, { label: 'Units', value: num(units), caption: `to ${TARGET_COVER} days` }, { label: 'Value', value: usdK(value), caption: 'at cost' }],
        rowsHead: ['Item', 'Send'],
        rows: list.map(({ p, coverIn, units: u }) => ({ id: p.id, name: p.name, meta: `${MARKET_LABEL[p.market]} · cover ${Math.floor(coverIn)} → ${TARGET_COVER} days`, value: `${num(u)} units`, sub: usd(u * p.cost) })),
        empty: 'Nothing needs reordering.',
      };
    },
  }),
];
