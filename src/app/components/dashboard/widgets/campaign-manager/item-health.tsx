import { CaretDownIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Floating } from '../../controls';
import type { WidgetBodyProps, WidgetConfig } from '../../dashboard.types';
import { Check } from '../rules/compare-controls';
import {
  BAND_LABEL, HEALTH_ITEM, HEALTH_ITEMS, alertsFor, bandOf, healthOf, totalHealth, type HealthBand, type HealthItem,
} from './item-health-data';
import styles from '../../dashboard.module.scss';

// Item health: a search to pick items, one health bar for every item (or the picked ones), then, for the picked items, a row
// each that opens to its listing quality, stock, availability, Buy Box win rate and Signals alerts.

export const readPicked = (config: WidgetConfig): string[] => ((config.picked as string[]) ?? []).filter((id) => HEALTH_ITEM[id]);

/** "All items · 74 health" or "3 items · 61 health", for the line under the nugget's title. */
export function describeHealth(config: WidgetConfig): string {
  const picked = readPicked(config);
  const items = picked.length ? picked.map((id) => HEALTH_ITEM[id]) : HEALTH_ITEMS;
  const { score } = totalHealth(items);
  return `${picked.length ? `${picked.length} ${picked.length === 1 ? 'item' : 'items'}` : 'All items'} · ${score} health`;
}

const BAND_CLASS: Record<HealthBand, string> = { healthy: styles.ihHealthy, attention: styles.ihAttention, critical: styles.ihCritical };

function HealthBar({ score, small }: { score: number; small?: boolean }) {
  return (
    <span className={`${styles.ihBar} ${small ? styles.ihBarSmall : ''} ${BAND_CLASS[bandOf(score)]}`} aria-hidden>
      <i style={{ transform: `scaleX(${Math.max(0.02, score / 100)})` }} />
    </span>
  );
}

const pct = (n: number) => `${n}%`;

/** One picked item: its name, id and score; open, the seven details. */
function ItemRow({ item }: { item: HealthItem }) {
  const [open, setOpen] = useState(false);
  const score = healthOf(item);
  const alerts = alertsFor(item.id);
  const details: [string, ReactNode][] = [
    ['Listing Quality', `${item.listingQuality}/100`],
    ['In Stock', item.inStock ? 'Yes' : <span className={styles.ihNo}>No</span>],
    ['Item Available Today', pct(item.availableToday)],
    ['Item Available in Last 7 days', pct(item.available7d)],
    ['Buy Box Win Rate Today', pct(item.buyBoxToday)],
    ['Buy Box Win Rate in Last 7 days', pct(item.buyBox7d)],
  ];
  return (
    <li className={styles.ihItem}>
      <button type="button" className={styles.ihItemHead} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span className={styles.ihItemCopy}>
          <span className={styles.ihItemName} title={item.name}>{item.name}</span>
          <span className={styles.ihItemId}>Item ID {item.id}</span>
        </span>
        <span className={styles.ihItemScore}>
          <strong>{score}</strong>
          <HealthBar score={score} small />
        </span>
        <CaretDownIcon size={12} weight="bold" className={`${styles.ihCaret} ${open ? styles.caretOpen : ''}`} />
      </button>
      {open && (
        <dl className={styles.ihDetails}>
          {details.map(([label, value]) => (
            <div key={label} className={styles.ihDetail}><dt>{label}</dt><dd>{value}</dd></div>
          ))}
          <div className={`${styles.ihDetail} ${styles.ihAlerts}`}>
            <dt>Alerts</dt>
            <dd>
              {alerts.length === 0 ? <span className={styles.ihNone}>No open alerts</span> : (
                <ul>
                  {alerts.map((a) => (
                    <li key={a.id}>
                      <Link to="/signals" className={styles.ihAlert}>{a.title}</Link>
                      <span className={styles.ihAlertMeta}>{a.priority} · {a.category}</span>
                    </li>
                  ))}
                </ul>
              )}
            </dd>
          </div>
        </dl>
      )}
    </li>
  );
}

export default function ItemHealth({ config, onConfig, preview }: WidgetBodyProps) {
  const picked = readPicked(config);
  const items = picked.length ? picked.map((id) => HEALTH_ITEM[id]) : HEALTH_ITEMS;
  const total = totalHealth(items);
  const band = bandOf(total.score);
  const rows = useMemo(() => picked.map((id) => HEALTH_ITEM[id]).sort((a, b) => healthOf(a) - healthOf(b)), [picked]);

  const searchRef = useRef<HTMLLabelElement>(null);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const needle = q.trim().toLowerCase();
  const results = useMemo(
    () => HEALTH_ITEMS.filter((i) => !needle || i.name.toLowerCase().includes(needle) || i.id.toLowerCase().includes(needle)),
    [needle],
  );
  const toggle = (id: string) => onConfig({ picked: picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id] });

  return (
    <div className={styles.ih}>
      <label ref={searchRef} className={`${styles.rcSearch} ${styles.ihSearch}`}>
        <MagnifyingGlassIcon size={14} />
        <input
          value={q} placeholder="Search items by name or ID" aria-label="Search items" disabled={preview}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)}
        />
      </label>
      {open && !preview && searchRef.current && (
        <Floating anchor={searchRef.current} onClose={close} label="Pick items" width={searchRef.current.offsetWidth}>
          <ul role="listbox" aria-multiselectable="true" aria-label="Items" className={`${styles.menuList} ${styles.ihResults}`}>
            {results.length === 0 && <li className={styles.rcPickEmpty}>Nothing matches “{q}”</li>}
            {results.map((i) => {
              const on = picked.includes(i.id);
              return (
                <li key={i.id}>
                  <button type="button" role="option" aria-selected={on} className={styles.rcOption} onClick={() => toggle(i.id)}>
                    <Check on={on} />
                    <span className={styles.ihResultCopy}><strong>{i.name}</strong><small>{i.id}</small></span>
                    <span className={styles.ihResultScore}>{healthOf(i)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Floating>
      )}

      <div className={styles.ihTotal}>
        <div className={styles.ihTotalTop}>
          <span className={styles.ihScore}>{total.score}<small>/100</small></span>
          <span className={`${styles.ihBand} ${BAND_CLASS[band]}`}>{BAND_LABEL[band]}</span>
        </div>
        <HealthBar score={total.score} />
        <p className={styles.ihCaption}>
          <span>
            {picked.length ? `${picked.length} ${picked.length === 1 ? 'item' : 'items'} picked` : `All ${HEALTH_ITEMS.length} items`}
            {picked.length > 0 && <button type="button" className={styles.ihClear} onClick={() => onConfig({ picked: [] })} disabled={preview}>Clear</button>}
          </span>
          <span>{total.counts.healthy} healthy · {total.counts.attention} need attention · {total.counts.critical} critical</span>
        </p>
      </div>

      {picked.length > 0 && (
        <ul className={styles.ihList}>
          {rows.map((i) => <ItemRow key={i.id} item={i} />)}
        </ul>
      )}
    </div>
  );
}
