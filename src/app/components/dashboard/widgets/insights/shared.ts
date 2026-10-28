import { HEALTH_ITEMS } from '../campaign-manager/item-health-data';
import { PERFORMERS, performerTotals } from '../campaign-manager/data';
import type { DayTotals } from '../rules/data';

// The sample catalogue every insight nugget reads from. Products are the items named on the Signals alerts; every other
// figure is seeded from the item's id, so numbers are stable between refreshes and agree from one nugget to the next.

export type Market = 'all' | 'amazon' | 'walmart';
export type Marketplace = 'amazon' | 'walmart';

/** A stable number from 0 to 1 for an id and a salt. */
export function unit(id: string, salt: string): number {
  let h = 2166136261;
  const s = `${salt}|${id}`;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967296;
}

export const between = (id: string, salt: string, lo: number, hi: number) => lo + unit(id, salt) * (hi - lo);
export const whole = (id: string, salt: string, lo: number, hi: number) => Math.round(between(id, salt, lo, hi));
export const pick = <T,>(id: string, salt: string, list: readonly T[]): T => list[Math.floor(unit(id, salt) * list.length) % list.length];

export const MARKET_LABEL: Record<Marketplace, string> = { amazon: 'Amazon', walmart: 'Walmart' };
export const inMarket = (m: Market) => <T extends { market: Marketplace }>(x: T) => m === 'all' || x.market === m;

// ── Formatting ──────────────────────────────────────────────────────────────────────────────

export const usd = (n: number) => `${n < 0 ? '−' : ''}$${Math.round(Math.abs(n)).toLocaleString('en-US')}`;
export const usd2 = (n: number) => `${n < 0 ? '−' : ''}$${Math.abs(n).toFixed(2)}`;
export function usdK(n: number): string {
  const a = Math.abs(n);
  const sign = n < 0 ? '−' : '';
  if (a >= 1e6) return `${sign}$${(a / 1e6).toFixed(2)}M`;
  if (a >= 1e3) return `${sign}$${(a / 1e3).toFixed(1)}K`;
  return `${sign}$${Math.round(a)}`;
}
export const num = (n: number) => Math.round(n).toLocaleString('en-US');
export function pct(n: number, digits = 0): string {
  const text = Math.abs(n).toFixed(digits);
  return `${n < 0 && Number(text) !== 0 ? '−' : ''}${text}%`;
}
export function signedPct(n: number, digits = 1): string {
  const text = Math.abs(n).toFixed(digits);
  return `${Number(text) === 0 ? '' : n > 0 ? '+' : '−'}${text}%`;
}
export const signed = (n: number) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${num(Math.abs(n))}`;
export const plural = (n: number, one: string, many = `${one}s`) => `${num(n)} ${n === 1 ? one : many}`;
export const ratio = (n: number) => `${n.toFixed(1)}x`;

// ── Products ────────────────────────────────────────────────────────────────────────────────

export type ListingStatus = 'active' | 'suppressed' | 'inactive';

export interface Product {
  id: string;
  name: string;
  market: Marketplace;
  price: number;
  cost: number;
  /** Average units a day over the last 30 days. */
  dailyUnits: number;
  sellable: number;
  inbound: number;
  /** Units in stock for 91–180, 181–365 and 365+ days. */
  aged: [number, number, number];
  stranded: number;
  unfulfillable: number;
  status: ListingStatus;
  statusReason: string;
  listingQuality: number;
  images: number;
  hasVideo: boolean;
  hasAPlus: boolean;
  bullets: number;
  titleLength: number;
  backendKeywords: boolean;
  bsr: number;
  bsr30: number;
  category: string;
  /** Days since the listing was created. */
  age: number;
  buyBox: number;
  buyBoxLastWeek: number;
  competitorPrice: number;
  rating: number;
  rating30: number;
  reviews: number;
  newReviews: number;
  returnRate: number;
  returnReason: string;
  referralFee: number;
  fulfilmentFee: number;
  storageFee: number;
  fulfilmentFee90: number;
  sessions: number;
  isAdvertised: boolean;
  adSpend30: number;
}

const SUPPRESSION_REASONS = ['Missing main image', 'Price outside the fair range', 'Missing required attribute', 'Restricted ingredient flagged', 'Image too small'];
const INACTIVE_REASONS = ['Out of stock', 'Closed by seller', 'Pricing error'];
const CATEGORIES = ['Sports Nutrition', 'Vitamins & Supplements', 'Fitness Equipment', 'Health & Household'];
const RETURN_REASONS = ['Not as described', 'Damaged in transit', 'No longer needed', 'Wrong size', 'Quality not as expected', 'Missing parts'];

export const PRODUCTS: Product[] = HEALTH_ITEMS.map((h) => {
  const id = h.id;
  const price = Math.round(between(id, 'price', 12, 62)) + 0.99;
  const dailyUnits = Math.max(0.4, between(id, 'velocity', 0, 1) ** 2 * 34);
  const oos = !h.inStock;
  const statusDraw = unit(id, 'status');
  const status: ListingStatus = statusDraw < 0.09 ? 'suppressed' : statusDraw < 0.14 ? 'inactive' : 'active';
  const sellable = oos ? 0 : Math.round(dailyUnits * between(id, 'cover', 4, 95));
  const market: Marketplace = unit(id, 'market') < 0.62 ? 'amazon' : 'walmart';
  const bsr = whole(id, 'bsr', 140, 42000);
  const rating = Math.round(between(id, 'rating', 3.5, 4.9) * 10) / 10;
  const fulfilmentFee = Math.round(between(id, 'fba', 3.2, 7.4) * 100) / 100;
  return {
    id,
    name: h.name,
    market,
    price,
    cost: Math.round(price * between(id, 'cost', 0.22, 0.4) * 100) / 100,
    dailyUnits,
    sellable,
    inbound: unit(id, 'inbound') > 0.55 ? Math.round(dailyUnits * between(id, 'inbound-days', 10, 45)) : 0,
    aged: [whole(id, 'aged-1', 0, 1) ? whole(id, 'a91', 20, 640) : 0, unit(id, 'aged-2') > 0.6 ? whole(id, 'a181', 10, 380) : 0, unit(id, 'aged-3') > 0.82 ? whole(id, 'a365', 5, 160) : 0],
    stranded: unit(id, 'stranded') > 0.84 ? whole(id, 'stranded-n', 8, 260) : 0,
    unfulfillable: unit(id, 'unfulfillable') > 0.78 ? whole(id, 'unful-n', 2, 64) : 0,
    status,
    statusReason: status === 'suppressed' ? pick(id, 'why', SUPPRESSION_REASONS) : status === 'inactive' ? pick(id, 'why', INACTIVE_REASONS) : '',
    listingQuality: h.listingQuality,
    images: whole(id, 'images', 3, 9),
    hasVideo: unit(id, 'video') > 0.55,
    hasAPlus: unit(id, 'aplus') > 0.35,
    bullets: whole(id, 'bullets', 3, 5),
    titleLength: whole(id, 'title', 48, 196),
    backendKeywords: unit(id, 'backend') > 0.3,
    bsr,
    bsr30: Math.max(80, Math.round(bsr * between(id, 'bsr-move', 0.55, 1.7))),
    category: pick(id, 'category', CATEGORIES),
    age: unit(id, 'new') > 0.88 ? whole(id, 'age-new', 3, 29) : whole(id, 'age', 40, 1100),
    buyBox: h.buyBox7d,
    buyBoxLastWeek: Math.min(100, Math.max(5, Math.round(h.buyBox7d + between(id, 'bb-move', -14, 10)))),
    competitorPrice: Math.round(price * between(id, 'comp', 0.82, 1.12) * 100) / 100,
    rating,
    rating30: Math.min(5, Math.round((rating + between(id, 'rating-move', -0.15, 0.35)) * 10) / 10),
    reviews: whole(id, 'reviews', 6, 4800),
    newReviews: whole(id, 'new-reviews', 0, 64),
    returnRate: Math.round(between(id, 'returns', 0, 1) ** 2 * 120) / 10,
    returnReason: pick(id, 'return-why', RETURN_REASONS),
    referralFee: Math.round(price * 0.15 * 100) / 100,
    fulfilmentFee,
    storageFee: Math.round(between(id, 'storage', 0.08, 0.62) * 100) / 100,
    fulfilmentFee90: unit(id, 'fee-up') > 0.8 ? Math.round(fulfilmentFee * between(id, 'fee-was', 0.78, 0.92) * 100) / 100 : fulfilmentFee,
    sessions: Math.round(dailyUnits * between(id, 'cvr', 6, 18)),
    isAdvertised: unit(id, 'advertised') > 0.45,
    adSpend30: Math.round(dailyUnits * price * between(id, 'tacos', 0.05, 0.17) * 30),
  };
});

export const productsIn = (m: Market) => PRODUCTS.filter(inMarket(m));

/** Net profit per unit: price less cost, referral, fulfilment and storage fees, ad spend and refunds per unit. */
export function unitProfit(p: Product): number {
  const adPerUnit = p.dailyUnits > 0 ? p.adSpend30 / (p.dailyUnits * 30) : 0;
  const refundPerUnit = p.price * (p.returnRate / 100);
  return p.price - p.cost - p.referralFee - p.fulfilmentFee - p.storageFee - adPerUnit - refundPerUnit;
}

// ── Campaigns and keywords ──────────────────────────────────────────────────────────────────

export interface Campaign {
  id: string;
  name: string;
  market: Marketplace;
  adType: string;
  budget: number;
  totals: DayTotals;
}

export const CAMPAIGNS: Campaign[] = performerTotals('campaign', '30').map((c) => {
  const market: Marketplace = unit(c.id, 'market') < 0.66 ? 'amazon' : 'walmart';
  const types = market === 'amazon' ? ['SP', 'SB', 'SD'] : ['SP', 'SB', 'Video'];
  const adType = c.detail.startsWith('SP') && unit(c.id, 'type') < 0.6 ? 'SP' : pick(c.id, 'type', types);
  return { id: c.id, name: c.name, market, adType, budget: Math.round((c.totals.spend / 30) * between(c.id, 'budget', 0.85, 1.6)), totals: c.totals };
});

export const KEYWORDS = performerTotals('keyword', '30').map((k) => ({ ...k, market: (unit(k.id, 'market') < 0.66 ? 'amazon' : 'walmart') as Marketplace }));

export const campaignsIn = (m: Market) => CAMPAIGNS.filter(inMarket(m));
export const keywordsIn = (m: Market) => KEYWORDS.filter(inMarket(m));
export { PERFORMERS };

export const sumTotals = (list: { totals: DayTotals }[]): DayTotals => list.reduce<DayTotals>(
  (a, c) => ({ imp: a.imp + c.totals.imp, clicks: a.clicks + c.totals.clicks, spend: a.spend + c.totals.spend, sales: a.sales + c.totals.sales, orders: a.orders + c.totals.orders, units: a.units + c.totals.units }),
  { imp: 0, clicks: 0, spend: 0, sales: 0, orders: 0, units: 0 },
);
