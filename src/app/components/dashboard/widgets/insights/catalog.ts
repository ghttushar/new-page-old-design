import { ChartLineUpIcon, ClockCounterClockwiseIcon, DetectiveIcon, EyeSlashIcon, ListChecksIcon, PlusCircleIcon, SealCheckIcon, TreeStructureIcon } from '@phosphor-icons/react';
import type { WidgetDefinition } from '../../dashboard.types';
import { defineInsight, type Row, type Tone } from './insight-view';
import { MARKET_LABEL, num, pct, pick, plural, productsIn, unit, usd, usdK, whole, type Product } from './shared';

// Catalog & listings: what can't sell, where content is weak, what changed, and who else is on your listings.

const CTA = { label: 'Open Catalog', to: '/inventory' };
const dailySales = (p: Product) => p.dailyUnits * p.price;

/**
 * Listing quality, 0–100. Walmart grades its own (content, discoverability, offer, ratings). For Amazon, Anarix scores the
 * content: title 80–200 characters (20), 5 bullets (20), 7+ images (25), A+ content (20), backend keywords (15).
 */
export function contentScore(p: Product): number {
  if (p.market === 'walmart') return p.listingQuality;
  const title = p.titleLength >= 80 && p.titleLength <= 200 ? 20 : 8;
  return Math.round(title + (p.bullets / 5) * 20 + (Math.min(p.images, 7) / 7) * 25 + (p.hasAPlus ? 20 : 0) + (p.backendKeywords ? 15 : 0));
}
const band = (s: number): Tone => (s >= 80 ? 'good' : s >= 60 ? 'warn' : 'bad');

export const CATALOG_WIDGETS: WidgetDefinition[] = [
  defineInsight({
    kind: 'cat-suppressed', title: 'Suppressed & inactive listings', category: 'Catalog', icon: EyeSlashIcon, art: 'stats', availability: 'A·W', cta: CTA,
    summary: 'Listings that can’t sell right now, with the reason and the sales at stake.',
    description: 'Every listing that is suppressed, inactive or unpublished, so nothing sits invisible. Fixing the reason puts the item back in search.',
    logic: 'Counts items whose status is Suppressed, Inactive or Unpublished and groups them by the reason the marketplace gives. Sales at risk = average daily units × price for each of those items.',
    sources: ['Amazon Listings Items issues', 'Suppressed listings report', 'Walmart Items unpublished reasons'],
    build: (m) => {
      const bad = productsIn(m).filter((p) => p.status !== 'active').sort((a, b) => dailySales(b) - dailySales(a));
      const risk = bad.reduce((s, p) => s + dailySales(p), 0);
      return {
        line: `${plural(bad.length, 'listing')} can’t sell · ${usdK(risk)} a day at risk`,
        stats: [
          { label: 'Suppressed', value: num(bad.filter((p) => p.status === 'suppressed').length), caption: 'hidden from search', tone: 'bad' },
          { label: 'Inactive', value: num(bad.filter((p) => p.status === 'inactive').length), caption: 'not offered' },
          { label: 'At risk', value: usdK(risk), caption: 'sales a day' },
        ],
        rowsHead: ['Item and reason', 'Sales a day'],
        rows: bad.map((p) => ({ id: p.id, name: p.name, meta: `${MARKET_LABEL[p.market]} · ${p.statusReason}`, tag: p.status === 'suppressed' ? 'Suppressed' : 'Inactive', value: usd(dailySales(p)), sub: 'at risk', tone: 'bad' as const })),
        empty: 'Every listing is live.',
      };
    },
  }),
  defineInsight({
    kind: 'cat-quality', title: 'Listing quality score', category: 'Catalog', icon: SealCheckIcon, art: 'list', availability: 'A·W', cta: CTA,
    summary: 'Average listing quality and the items scoring lowest.',
    description: 'How complete and findable your listings are, and which items drag the score down. Better content lifts conversion and organic rank.',
    logic: 'Walmart: its Listing Quality score (content and discoverability, offer, ratings and reviews). Amazon: an Anarix content score out of 100: title of 80–200 characters (20), five bullets (20), seven or more images (25), A+ content (20), backend keywords (15). Shows the average and the share of items under 70, lowest first.',
    sources: ['Walmart Listing Quality Insights', 'Amazon Catalog Items', 'Anarix Catalog'],
    build: (m) => {
      const ps = productsIn(m).map((p) => ({ p, s: contentScore(p) })).sort((a, b) => a.s - b.s);
      const avg = ps.reduce((s, x) => s + x.s, 0) / Math.max(1, ps.length);
      const low = ps.filter((x) => x.s < 70).length;
      return {
        line: `Average ${Math.round(avg)} / 100 · ${plural(low, 'item')} under 70`,
        stats: [
          { label: 'Average', value: `${Math.round(avg)}`, caption: 'out of 100', tone: band(avg) },
          { label: 'Under 70', value: num(low), caption: `of ${num(ps.length)} items` },
          { label: '90 and up', value: num(ps.filter((x) => x.s >= 90).length), caption: 'best in class' },
        ],
        rowsHead: ['Lowest scores', 'Score'],
        rows: ps.slice(0, 12).map(({ p, s }) => ({ id: p.id, name: p.name, meta: `${MARKET_LABEL[p.market]} · ${p.images} images · ${p.bullets} bullets${p.hasAPlus ? ' · A+' : ''}`, value: `${s}`, bar: s / 100, tone: band(s) })),
      };
    },
  }),
  defineInsight({
    kind: 'cat-content-gaps', title: 'Content gaps', category: 'Catalog', icon: ListChecksIcon, art: 'list', availability: 'A·W', cta: CTA,
    summary: 'Which pieces of content are missing most often across your catalogue.',
    description: 'The fixes that reach the most items at once: missing images, video, A+ content, bullets or keywords.',
    logic: 'For each content attribute, the share of items missing it: fewer than 7 images, no video, no A+ content, fewer than 5 bullets, a title under 80 characters, no backend keywords. Sorted by how many items each gap affects.',
    sources: ['Amazon Catalog Items attributes', 'Walmart Item content'],
    build: (m) => {
      const ps = productsIn(m);
      const n = Math.max(1, ps.length);
      const gaps: [string, number][] = [
        ['Fewer than 7 images', ps.filter((p) => p.images < 7).length],
        ['No video', ps.filter((p) => !p.hasVideo).length],
        ['No A+ content', ps.filter((p) => !p.hasAPlus).length],
        ['Fewer than 5 bullets', ps.filter((p) => p.bullets < 5).length],
        ['Title under 80 characters', ps.filter((p) => p.titleLength < 80).length],
        ['No backend keywords', ps.filter((p) => !p.backendKeywords).length],
      ];
      gaps.sort((a, b) => b[1] - a[1]);
      const anyGap = ps.filter((p) => p.images < 7 || !p.hasVideo || !p.hasAPlus || p.bullets < 5 || p.titleLength < 80 || !p.backendKeywords).length;
      return {
        line: `${plural(anyGap, 'item')} missing something · biggest gap: ${gaps[0][0].toLowerCase()}`,
        stats: [
          { label: 'Items checked', value: num(ps.length) },
          { label: 'With a gap', value: num(anyGap), caption: pct((anyGap / n) * 100), tone: 'warn' },
          { label: 'Complete', value: num(ps.length - anyGap), caption: 'nothing missing', tone: 'good' },
        ],
        rowsHead: ['Missing', 'Items'],
        rows: gaps.map(([label, count]) => ({ id: label, name: label, value: num(count), sub: pct((count / n) * 100), bar: count / n, tone: count / n > 0.4 ? 'bad' : 'warn' })),
      };
    },
  }),
  defineInsight({
    kind: 'cat-changes', title: 'Listing changes', category: 'Catalog', icon: ClockCounterClockwiseIcon, art: 'feed', availability: 'A·W', cta: CTA,
    summary: 'Recent edits to titles, images, prices and categories, including ones you didn’t make.',
    description: 'Catches unexpected edits, such as a title rewritten by another seller or a category moved, before they cost sales.',
    logic: 'Compares each item’s key attributes (title, main image, price, category, bullets) with yesterday’s snapshot and lists what changed: field, before → after, when, and whether the change came from your account.',
    sources: ['Anarix Catalog daily snapshots'],
    build: (m) => {
      const fields = ['Title', 'Main image', 'Price', 'Category', 'Bullets'] as const;
      const changed = productsIn(m).filter((p) => unit(p.id, 'changed') > 0.72).slice(0, 14);
      const rows: Row[] = changed.map((p) => {
        const field = pick(p.id, 'field', fields);
        const yours = unit(p.id, 'by-you') > 0.35;
        const before = field === 'Price' ? usd(p.price * 1.08) : field === 'Category' ? 'Sports Nutrition' : field === 'Main image' ? 'Image 1 (white background)' : 'Previous version';
        const after = field === 'Price' ? usd(p.price) : field === 'Category' ? p.category : field === 'Main image' ? 'Image 4 (lifestyle)' : 'New version';
        return { id: p.id, name: p.name, meta: `${field}: ${before} → ${after}`, tag: yours ? undefined : 'Not by you', value: `${whole(p.id, 'hours', 1, 70)}h ago`, sub: MARKET_LABEL[p.market], tone: yours ? undefined : 'bad' };
      });
      const notYours = rows.filter((r) => r.tag).length;
      return {
        line: `${plural(rows.length, 'change')} in 3 days · ${num(notYours)} not by you`,
        stats: [{ label: 'Changes', value: num(rows.length), caption: 'last 3 days' }, { label: 'Not by you', value: num(notYours), caption: 'check these', tone: notYours ? 'bad' : 'good' }],
        rowsHead: ['Item and change', 'When'],
        rows,
        empty: 'No listing changes in the last 3 days.',
      };
    },
  }),
  defineInsight({
    kind: 'cat-variations', title: 'Variation health', category: 'Catalog', icon: TreeStructureIcon, art: 'list', availability: 'A', cta: CTA,
    summary: 'Parent–child families with orphaned children, missing attributes or split listings.',
    description: 'Broken variation families split reviews and hide sizes or flavours from shoppers. These need a fix in the parent listing.',
    logic: 'Groups items into families by their parent listing and flags three problems: a child with no parent (orphaned), a child missing the family’s variation attribute (size, flavour, colour), and one product split across two families.',
    sources: ['Amazon Catalog Items relationships'],
    build: () => {
      const families = new Map<string, Product[]>();
      productsIn('amazon').forEach((p) => {
        const key = p.name.split(/[·—-]/)[0].trim().split(' ').slice(0, 3).join(' ');
        families.set(key, [...(families.get(key) ?? []), p]);
      });
      const issues = ['Orphaned child', 'Missing flavour attribute', 'Missing size attribute', 'Split across two families'];
      const rows: Row[] = [...families.entries()]
        .filter(([key]) => unit(key, 'family-issue') > 0.45)
        .map(([key, list]) => ({ id: key, name: key, meta: `${plural(list.length, 'child', 'children')} · ${pick(key, 'issue', issues)}`, value: `${whole(key, 'affected', 1, Math.max(1, list.length))}`, sub: 'affected', tone: 'warn' as const }));
      return {
        line: `${plural(rows.length, 'family', 'families')} need fixing`,
        stats: [{ label: 'Families', value: num(families.size) }, { label: 'With a problem', value: num(rows.length), tone: rows.length ? 'warn' : 'good' }],
        rowsHead: ['Family and problem', 'Children'],
        rows,
        empty: 'Every variation family is intact.',
      };
    },
  }),
  defineInsight({
    kind: 'cat-bsr', title: 'Best Seller Rank movers', category: 'Catalog', icon: ChartLineUpIcon, art: 'list', availability: 'A', cta: CTA,
    summary: 'Products climbing or falling fastest in their category’s Best Seller Rank.',
    description: 'Rank moves show demand shifting before sales reports do, so you can back a riser or rescue a faller.',
    logic: 'For each item, the change in its main-category Best Seller Rank over 30 days: (rank 30 days ago − rank today) ÷ rank 30 days ago. A lower rank number is better. Biggest moves first, either way.',
    sources: ['Amazon Catalog Items sales ranks (daily)'],
    build: () => {
      const moves = productsIn('amazon').map((p) => ({ p, change: (p.bsr30 - p.bsr) / p.bsr30 })).sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
      const up = moves.filter((x) => x.change > 0.05).length;
      const down = moves.filter((x) => x.change < -0.05).length;
      return {
        line: `${num(up)} climbing, ${num(down)} falling · 30 days`,
        stats: [{ label: 'Climbing', value: num(up), tone: 'good' }, { label: 'Falling', value: num(down), tone: down ? 'bad' : undefined }],
        rowsHead: ['Item and category', 'Rank now'],
        rows: moves.slice(0, 12).map(({ p, change }) => ({ id: p.id, name: p.name, meta: p.category, tag: change > 0 ? 'Up' : 'Down', value: `#${num(p.bsr)}`, sub: `was #${num(p.bsr30)}`, tone: change > 0 ? 'good' as const : 'bad' as const })),
      };
    },
  }),
  defineInsight({
    kind: 'cat-new-listings', title: 'New listings', category: 'Catalog', icon: PlusCircleIcon, art: 'stats', availability: 'A·W', cta: CTA,
    summary: 'Items launched in the last 30 days and how they are doing so far.',
    description: 'Launches need early attention: traffic, conversion and first reviews decide how they rank later.',
    logic: 'Items whose listing was created in the last 30 days, with sessions, units and conversion (units ÷ sessions) since launch, and reviews so far.',
    sources: ['Catalog Items created date', 'Sales & Traffic report'],
    build: (m) => {
      const fresh = productsIn(m).filter((p) => p.age < 30).sort((a, b) => a.age - b.age);
      const units = fresh.reduce((s, p) => s + p.dailyUnits * p.age, 0);
      const sessions = fresh.reduce((s, p) => s + p.sessions * p.age, 0);
      return {
        line: `${plural(fresh.length, 'launch', 'launches')} in 30 days · ${num(units)} units so far`,
        stats: [{ label: 'Launched', value: num(fresh.length), caption: 'last 30 days' }, { label: 'Units', value: num(units), caption: 'since launch' }, { label: 'Conversion', value: pct(sessions ? (units / sessions) * 100 : 0, 1), caption: 'units ÷ sessions' }],
        rowsHead: ['Item', 'Units so far'],
        rows: fresh.map((p) => ({ id: p.id, name: p.name, meta: `${MARKET_LABEL[p.market]} · ${plural(p.age, 'day')} live · ${num(p.sessions * p.age)} sessions · ${plural(Math.round(p.age / 6), 'review')}`, value: num(p.dailyUnits * p.age), sub: `${pct((p.dailyUnits / Math.max(1, p.sessions)) * 100, 1)} conv.` })),
        empty: 'No items launched in the last 30 days.',
      };
    },
  }),
  defineInsight({
    kind: 'cat-hijackers', title: 'Unauthorised sellers', category: 'Catalog', icon: DetectiveIcon, art: 'list', availability: 'A·W', cta: CTA,
    summary: 'Your listings where a seller outside your allow-list holds an offer.',
    description: 'Hijackers undercut your price and can sell counterfeits under your brand. Spot them early to file a report.',
    logic: 'Checks every offer on your items against your list of authorised sellers. Lists items where another seller has an offer, with their price against yours and how long they have been there. Lost sales = your daily sales × the share of the Buy Box they hold.',
    sources: ['Amazon Product Pricing offers', 'Walmart Buy Box report', 'Anarix seller allow-list'],
    build: (m) => {
      const sellers = ['FitDeals Hub', 'NutriMart Wholesale', 'BestBuyz Online', 'Prime Supply Co'];
      const hit = productsIn(m).filter((p) => unit(p.id, 'hijack') > 0.85);
      const lost = hit.reduce((s, p) => s + dailySales(p) * (1 - p.buyBox / 100), 0);
      return {
        line: `${plural(hit.length, 'listing')} with unauthorised sellers · ${usdK(lost)} a day lost`,
        stats: [{ label: 'Listings', value: num(hit.length), tone: hit.length ? 'bad' : 'good' }, { label: 'Lost a day', value: usdK(lost), caption: 'to their offers' }],
        rowsHead: ['Item and seller', 'There for'],
        rows: hit.map((p) => ({ id: p.id, name: p.name, meta: `${pick(p.id, 'seller', sellers)} · ${usd(p.price * 0.91)} vs your ${usd(p.price)}`, value: plural(whole(p.id, 'days-on', 1, 26), 'day'), sub: MARKET_LABEL[p.market], tone: 'bad' as const })),
        empty: 'Only authorised sellers on your listings.',
      };
    },
  }),
];
