import { ArrowRightIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import type { WidgetBodyProps } from '../../dashboard.types';
import { OPPORTUNITY_ITEMS, opportunityTotals } from './item-health-data';
import styles from '../../dashboard.module.scss';

// New opportunities: high quality items that aren't advertised yet. Three consolidated figures (how many, and their
// average units and GMV per item over the last 30 days), then the items themselves, highest GMV first.

const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
const count = (n: number) => Math.round(n).toLocaleString('en-US');

/** "16 items · $22,460 avg GMV each", for the line under the nugget's title. */
export function describeOpportunities(): string {
  const t = opportunityTotals();
  return t.count ? `${t.count} ${t.count === 1 ? 'item' : 'items'} · ${money(t.avgGmv)} avg GMV each` : 'Every high quality item is advertised';
}

export default function Opportunities({ preview }: WidgetBodyProps) {
  const t = opportunityTotals();
  const rows = [...OPPORTUNITY_ITEMS].sort((a, b) => b.gmv30 - a.gmv30);
  const stats = [
    { label: 'Items', value: count(t.count), caption: 'high quality, not advertised' },
    { label: 'Avg units', value: count(t.avgUnits), caption: 'per item, last 30 days' },
    { label: 'Avg GMV', value: money(t.avgGmv), caption: 'per item, last 30 days' },
  ];

  return (
    <div className={styles.op}>
      <dl className={styles.opStats}>
        {stats.map((s) => (
          <div key={s.label} className={styles.opStat}>
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
            <span>{s.caption}</span>
          </div>
        ))}
      </dl>

      {rows.length === 0 ? (
        <p className={styles.opEmpty}>Every high quality item is already advertised.</p>
      ) : (
        <ul className={styles.opList} aria-label="Items to advertise">
          {rows.map((i) => (
            <li key={i.id} className={styles.opRow}>
              <span className={styles.opWho}>
                <span className={styles.opName} title={i.name}>{i.name}</span>
                <span className={styles.opId}>Item ID {i.id}</span>
              </span>
              <span className={styles.opFigures}>
                <strong>{money(i.gmv30)}</strong>
                <small>{count(i.units30)} units</small>
              </span>
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/advertising/campaign-creator" className={styles.opLink}
        tabIndex={preview ? -1 : undefined} onClick={(e) => { if (preview) e.preventDefault(); }}
      >
        Advertise them<ArrowRightIcon size={13} weight="bold" />
      </Link>
    </div>
  );
}
