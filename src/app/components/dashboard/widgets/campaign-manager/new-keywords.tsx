import { ArrowRightIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { KEYWORD_ACTION_URL } from '@/constants/urls.constants';
import type { WidgetBodyProps } from '../../dashboard.types';
import { keywordHarvest, type HarvestRoute } from './data';
import styles from '../../dashboard.module.scss';

// Add new keywords: what Targeting Actions suggests adding at campaign or ad group level, on its two routes, each
// with the same four figures. One View more for both, to Targeting Actions.

const ROUTES: { id: HarvestRoute; from: string; to: string; hint: string }[] = [
  { id: 'auto-to-manual', from: 'Auto', to: 'Manual', hint: 'Search terms from Auto campaigns to run as Manual keywords' },
  { id: 'manual-to-manual', from: 'Manual', to: 'Manual', hint: 'Terms from Manual campaigns to add to other Manual campaigns' },
];

const n = (v: number) => Math.round(v).toLocaleString('en-US');

/** "214 keywords to add from 11 campaigns", for the line under the nugget's title. */
export function describeNewKeywords(): string {
  const h = keywordHarvest();
  const keywords = h['auto-to-manual'].keywords + h['manual-to-manual'].keywords;
  const campaigns = h['auto-to-manual'].campaigns + h['manual-to-manual'].campaigns;
  return `${n(keywords)} keywords to add from ${campaigns} campaigns`;
}

export default function NewKeywords({ preview }: WidgetBodyProps) {
  const h = keywordHarvest();
  return (
    <div className={styles.nk}>
      <div className={styles.nkRoutes}>
        {ROUTES.map((r) => {
          const s = h[r.id];
          const stats: [string, string][] = [
            ['Campaigns', n(s.campaigns)],
            ['Keywords', n(s.keywords)],
            ['Unique keywords', n(s.uniqueKeywords)],
            ['Avg ROAS', `${s.avgRoas.toFixed(1)}x`],
          ];
          return (
            <section key={r.id} className={styles.nkRoute} aria-label={`${r.from} to ${r.to}`}>
              <h4 className={styles.nkRouteHead}>
                <span>{r.from}</span><ArrowRightIcon size={12} weight="bold" aria-hidden /><span>{r.to}</span>
              </h4>
              <p className={styles.nkHint}>{r.hint}</p>
              <dl className={styles.nkStats}>
                {stats.map(([label, value]) => (
                  <div key={label} className={styles.nkStat}><dt>{label}</dt><dd>{value}</dd></div>
                ))}
              </dl>
            </section>
          );
        })}
      </div>
      <Link
        to={KEYWORD_ACTION_URL} className={styles.opLink}
        tabIndex={preview ? -1 : undefined} onClick={(e) => { if (preview) e.preventDefault(); }}
      >
        View more in Targeting Actions<ArrowRightIcon size={13} weight="bold" />
      </Link>
    </div>
  );
}
