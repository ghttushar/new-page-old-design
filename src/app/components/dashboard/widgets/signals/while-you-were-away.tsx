import { useNavigate } from 'react-router-dom';
import type { PrototypeAlert } from '@/constants/signals/prototype-data';
import type { WidgetBodyProps, WidgetConfig } from '../../dashboard.types';
import { arrivalsSinceLastVisit, hourBucket, money, type PriorityFilter } from './data';
import styles from '../../dashboard.module.scss';

type GroupBy = 'time' | 'category';

const MARKET: Record<string, string> = { amazon: 'Amazon', walmart: 'Walmart' };

export function arrivalsFor(config: WidgetConfig): PrototypeAlert[] {
  return arrivalsSinceLastVisit((config.priority as PriorityFilter) ?? 'all', (config.categories as string[]) ?? []);
}

function groupAlerts(list: PrototypeAlert[], by: GroupBy): { label: string; items: PrototypeAlert[] }[] {
  const groups: { label: string; items: PrototypeAlert[] }[] = [];
  list.forEach((a) => {
    const label = by === 'time' ? hourBucket(a.time) : a.category;
    let g = groups.find((x) => x.label === label);
    if (!g) { g = { label, items: [] }; groups.push(g); }
    g.items.push(a);
  });
  return by === 'category' ? groups.sort((x, y) => y.items.length - x.items.length) : groups;
}

const clock = (t: string) => (/^\d/.test(t) ? t.replace(/\s?(AM|PM)$/i, '') : t.split('·')[1]?.trim() ?? t);

/** Every alert that came in since the last visit, newest first, on a time rail. */
export default function WhileYouWereAway({ config, preview }: WidgetBodyProps) {
  const navigate = useNavigate();
  const showValue = config.showValue !== false;
  const groupBy = (config.groupBy as GroupBy) ?? 'time';
  const list = arrivalsFor(config);

  if (list.length === 0) return <div className={styles.empty}>All caught up. Nothing new matches these settings.</div>;

  return (
    <div className={`${styles.away} ${styles.scrollArea}`}>
      {groupAlerts(list, groupBy).map((g) => (
        <section key={g.label} className={styles.awayGroup}>
          <h4 className={styles.awayGroupLabel}>{g.label}<span>{g.items.length}</span></h4>
          <ol className={styles.awayList}>
            {g.items.map((a) => (
              <li key={a.id}>
                <button type="button" className={styles.awayRow} onClick={() => navigate('/signals')} tabIndex={preview ? -1 : 0}>
                  <time className={styles.awayTime}>{clock(a.time)}</time>
                  <span className={styles.awayText}>
                    <span className={styles.awayTitle}>{a.title}</span>
                    <span className={styles.awayMeta}>
                      {a.priority === 'High' && <span className={styles.awayHigh}>High</span>}
                      <span>{groupBy === 'category' ? hourBucket(a.time) : a.category}</span>
                      <span>{MARKET[a.mpBrand] ?? a.mpBrand}, {a.account}</span>
                    </span>
                  </span>
                  {showValue && !a.hideValue && a.valueNum !== 0 && (
                    <span className={`${styles.awayValue} ${a.valueNum < 0 ? styles.valueRisk : styles.valueGain}`}>
                      {a.valueNum < 0 ? '-' : '+'}{money(a.valueNum)}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
