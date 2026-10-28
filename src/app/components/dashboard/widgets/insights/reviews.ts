import { ArrowCounterClockwiseIcon, ChatCircleTextIcon, ChatsCircleIcon, StarIcon, TrendUpIcon } from '@phosphor-icons/react';
import type { WidgetDefinition } from '../../dashboard.types';
import { defineInsight, type Tone } from './insight-view';
import { MARKET_LABEL, num, pct, pick, plural, productsIn, signedPct, unit, whole } from './shared';

// Reviews & customer: ratings that slip, new negative reviews to answer, what people complain about, why items come back
// and how fast reviews grow.

const CTA = { label: 'Open Review Analysis', to: '/review-analysis' };

const THEMES = ['Taste or flavour', 'Packaging damaged', 'Quality not as expected', 'Size or fit', 'Late delivery', 'Price or value', 'Mixability'];

const SNIPPETS: Record<string, string[]> = {
  'Taste or flavour': ['Tastes chalky, nothing like the old batch.', 'Too sweet, had to throw it out.'],
  'Packaging damaged': ['Seal was broken when it arrived.', 'Tub cracked, powder all over the box.'],
  'Quality not as expected': ['Stopped working after two weeks.', 'Feels cheap for the price.'],
  'Size or fit': ['Runs small, had to return it.', 'Much smaller than the photos show.'],
  'Late delivery': ['Arrived a week late with no update.', 'Delivery kept slipping.'],
  'Price or value': ['Half the size of last time for the same price.', 'Not worth it at this price.'],
  Mixability: ['Clumps even in a shaker.', 'Doesn’t dissolve, gritty at the bottom.'],
};

export const REVIEWS_WIDGETS: WidgetDefinition[] = [
  defineInsight({
    kind: 'rev-rating', title: 'Rating watch', category: 'Reviews', icon: StarIcon, art: 'list', availability: 'A·W', cta: CTA,
    summary: 'Items whose star rating fell below 4.0 or dropped by 0.2 or more in 30 days.',
    description: 'A rating under 4 stars costs clicks and conversion. Catching the drop early lets you find the cause before it sticks.',
    logic: 'Average star rating per item today against 30 days ago. Listed when the rating is under 4.0 or fell by 0.2 or more, lowest first.',
    sources: ['Anarix Review analysis (daily rating snapshots)'],
    build: (m) => {
      const ps = productsIn(m);
      const watch = ps.filter((p) => p.rating < 4 || p.rating30 - p.rating >= 0.2).sort((a, b) => a.rating - b.rating);
      const avg = ps.reduce((s, p) => s + p.rating, 0) / Math.max(1, ps.length);
      return {
        line: `${plural(watch.length, 'item')} to watch · ${avg.toFixed(2)}★ average`,
        stats: [{ label: 'Average', value: `${avg.toFixed(2)}★`, caption: 'all items' }, { label: 'Under 4.0', value: num(ps.filter((p) => p.rating < 4).length), tone: 'bad' }, { label: 'Dropped 0.2+', value: num(ps.filter((p) => p.rating30 - p.rating >= 0.2).length), caption: 'in 30 days', tone: 'warn' }],
        rowsHead: ['Item', 'Rating'],
        rows: watch.map((p) => ({ id: p.id, name: p.name, meta: `${MARKET_LABEL[p.market]} · was ${p.rating30.toFixed(1)}★ · ${num(p.reviews)} reviews`, value: `${p.rating.toFixed(1)}★`, sub: p.rating30 === p.rating ? 'no change' : `${p.rating < p.rating30 ? '−' : '+'}${Math.abs(p.rating - p.rating30).toFixed(1)}`, bar: p.rating / 5, tone: (p.rating < 4 ? 'bad' : 'warn') as Tone })),
        empty: 'Every item is at 4.0★ or above and holding.',
      };
    },
  }),
  defineInsight({
    kind: 'rev-negative', title: 'New negative reviews', category: 'Reviews', icon: ChatCircleTextIcon, art: 'feed', availability: 'A·W', cta: CTA,
    summary: '1 and 2 star reviews from the last 7 days, with what they say.',
    description: 'A quick reply or a fix to the cause limits the damage. These are the reviews to read today.',
    logic: 'Reviews of 1 or 2 stars posted in the last 7 days, newest first, with the topic Review analysis tagged them with.',
    sources: ['Anarix Review analysis'],
    build: (m) => {
      const reviews = productsIn(m).filter((p) => unit(p.id, 'neg-review') > 0.62).map((p) => {
        const theme = pick(p.id, 'neg-theme', THEMES);
        return { p, theme, stars: unit(p.id, 'neg-stars') > 0.5 ? 1 : 2, days: whole(p.id, 'neg-days', 0, 6), text: pick(p.id, 'neg-text', SNIPPETS[theme]) };
      }).sort((a, b) => a.days - b.days);
      return {
        line: `${plural(reviews.length, 'negative review')} in 7 days`,
        stats: [{ label: '1★', value: num(reviews.filter((r) => r.stars === 1).length), tone: 'bad' }, { label: '2★', value: num(reviews.filter((r) => r.stars === 2).length), tone: 'warn' }, { label: 'Top topic', value: reviews.length ? pick('top', 'neg-top', reviews).theme : '—' }],
        rowsHead: ['Review', 'Posted'],
        rows: reviews.map((r) => ({ id: r.p.id, name: `“${r.text}”`, tag: r.theme, meta: `${r.p.name} · ${MARKET_LABEL[r.p.market]}`, value: `${r.stars}★`, sub: r.days === 0 ? 'today' : r.days === 1 ? 'yesterday' : `${r.days} days ago`, tone: (r.stars === 1 ? 'bad' : 'warn') as Tone })),
        empty: 'No 1 or 2 star reviews this week.',
      };
    },
  }),
  defineInsight({
    kind: 'rev-themes', title: 'Review themes', category: 'Reviews', icon: ChatsCircleIcon, art: 'split', availability: 'A·W', cta: CTA,
    summary: 'What customers complain about this month, by share, against last month.',
    description: 'Turns hundreds of reviews into a handful of fixable causes, and shows which are getting worse.',
    logic: 'Negative and mixed reviews this month, grouped by the topic Review analysis tags them with. Share = the topic’s reviews ÷ all tagged reviews. Change = this month’s share against last month’s.',
    sources: ['Anarix Review analysis (topic tagging)'],
    build: (m) => {
      const themes = THEMES.map((t) => ({ t, n: whole(t, `theme-${m}`, 4, 48), was: whole(t, `theme-was-${m}`, 4, 48) })).sort((a, b) => b.n - a.n);
      const total = themes.reduce((s, x) => s + x.n, 0);
      const totalWas = themes.reduce((s, x) => s + x.was, 0);
      const tones = ['a', 'b', 'c', 'd', 'neutral'] as const;
      return {
        line: `Top complaint: ${themes[0].t.toLowerCase()} · ${pct((themes[0].n / total) * 100)} of tagged reviews`,
        segments: themes.slice(0, 5).map((x, i) => ({ label: x.t, value: x.n, tone: tones[i] })),
        rowsHead: ['Theme', 'Vs last month'],
        rows: themes.map((x) => {
          const change = (x.n / total - x.was / totalWas) * 100;
          return { id: x.t, name: x.t, meta: `${plural(x.n, 'review')} this month`, value: signedPct(change), tone: (change > 2 ? 'bad' : change < -2 ? 'good' : 'neutral') as Tone };
        }),
      };
    },
  }),
  defineInsight({
    kind: 'rev-returns', title: 'Return reasons', category: 'Reviews', icon: ArrowCounterClockwiseIcon, art: 'list', availability: 'A·W', cta: CTA,
    summary: 'Return rate per item and the most common reason, highest first.',
    description: 'High returns cost the sale, the fees and often a review. The reason points to the fix: listing, packaging or product.',
    logic: 'Return rate = units returned ÷ units sold over 30 days. Items above 5% are listed, highest first, with the reason customers gave most often.',
    sources: ['Amazon FBA customer returns report', 'Walmart Returns API'],
    build: (m) => {
      const ps = productsIn(m);
      const high = ps.filter((p) => p.returnRate > 5).sort((a, b) => b.returnRate - a.returnRate);
      const units = ps.reduce((s, p) => s + p.dailyUnits * 30, 0);
      const returned = ps.reduce((s, p) => s + p.dailyUnits * 30 * (p.returnRate / 100), 0);
      return {
        line: `${pct((returned / Math.max(1, units)) * 100, 1)} returned · ${plural(high.length, 'item')} above 5%`,
        stats: [{ label: 'Return rate', value: pct((returned / Math.max(1, units)) * 100, 1), caption: 'all items' }, { label: 'Units returned', value: num(returned), caption: '30 days' }, { label: 'Above 5%', value: num(high.length), tone: high.length ? 'bad' : 'good' }],
        rowsHead: ['Item and top reason', 'Return rate'],
        rows: high.map((p) => ({ id: p.id, name: p.name, meta: `${MARKET_LABEL[p.market]} · ${p.returnReason}`, value: pct(p.returnRate, 1), bar: p.returnRate / 12, tone: (p.returnRate > 8 ? 'bad' : 'warn') as Tone })),
        empty: 'No item returns more than 5%.',
      };
    },
  }),
  defineInsight({
    kind: 'rev-velocity', title: 'Review velocity', category: 'Reviews', icon: TrendUpIcon, art: 'list', availability: 'A', cta: CTA,
    summary: 'New reviews a month per item, with Vine enrolment.',
    description: 'Reviews are social proof. Items gaining few reviews, especially new ones, may need Vine or a follow-up email.',
    logic: 'New reviews in the last 30 days per item, slowest first, with total reviews and whether the item is enrolled in Vine.',
    sources: ['Anarix Review analysis', 'Amazon Vine'],
    build: () => {
      const ps = productsIn('amazon').sort((a, b) => a.newReviews - b.newReviews);
      const total = ps.reduce((s, p) => s + p.newReviews, 0);
      const max = Math.max(1, ...ps.map((p) => p.newReviews));
      return {
        line: `${plural(total, 'new review')} in 30 days · ${plural(ps.filter((p) => p.newReviews < 3).length, 'item')} under 3`,
        stats: [{ label: 'New reviews', value: num(total), caption: '30 days', tone: 'good' }, { label: 'Under 3 a month', value: num(ps.filter((p) => p.newReviews < 3).length), tone: 'warn' }, { label: 'In Vine', value: num(ps.filter((p) => unit(p.id, 'vine') > 0.75).length) }],
        rowsHead: ['Item', 'New a month'],
        rows: ps.map((p) => ({ id: p.id, name: p.name, tag: unit(p.id, 'vine') > 0.75 ? 'Vine' : undefined, meta: `${num(p.reviews)} reviews · ${p.rating.toFixed(1)}★${p.age < 60 ? ' · new listing' : ''}`, value: num(p.newReviews), bar: p.newReviews / max, tone: (p.newReviews < 3 ? 'warn' : 'neutral') as Tone })),
      };
    },
  }),
];
