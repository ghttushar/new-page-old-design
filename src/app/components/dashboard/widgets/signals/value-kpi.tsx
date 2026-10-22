import { ArrowDownIcon, ArrowUpIcon } from '@phosphor-icons/react';
import { useElementSize } from '../../controls';
import type { WidgetBodyProps } from '../../dashboard.types';
import { money, valueSummary, type AlertFilter, type Market, type Period, type ValueSide } from './data';
import styles from '../../dashboard.module.scss';

const PERIOD_WORD: Record<Period, string> = { today: 'today', yesterday: 'yesterday', both: 'over two days' };

export function readFilter(config: WidgetBodyProps['config']): AlertFilter {
  return {
    period: (config.period as Period) ?? 'today',
    market: (config.market as Market) ?? 'all',
    categories: (config.categories as string[]) ?? [],
  };
}

export default function makeValueKpi(side: ValueSide) {
  return function ValueKpi({ config }: WidgetBodyProps) {
    const [ref, size] = useElementSize<HTMLDivElement>();
    const filter = readFilter(config);
    const s = valueSummary(side, filter);
    const showSplit = config.breakdown !== false;

    const pct = s.previous && s.previous > 0 ? Math.round(((s.total - s.previous) / s.previous) * 100) : null;
    // Risk going up is bad news; opportunity going up is good news.
    const good = pct !== null && (side === 'risk' ? pct < 0 : pct > 0);

    // What fits: the figure always, then as many category rows as the height allows (rows are 41px).
    // Before the first measurement, assume room for three rows so they do not pop in a frame later.
    const rowRoom = size.height === 0 ? 3 : Math.max(0, Math.floor((size.height - 96 - 22) / 41));
    const rows = showSplit ? s.shares.slice(0, Math.min(5, rowRoom)) : [];

    return (
      <div ref={ref} className={`${styles.kpi} ${side === 'risk' ? styles.kpiRisk : styles.kpiGain}`}>
        <div className={styles.kpiFigure}>
          <span className={styles.kpiValue}>{money(s.total)}</span>
          {pct !== null && pct !== 0 && (
            <span className={`${styles.kpiDelta} ${good ? styles.deltaGood : styles.deltaBad}`} title={`Yesterday: ${money(s.previous ?? 0)}`}>
              {pct > 0 ? <ArrowUpIcon size={11} weight="bold" /> : <ArrowDownIcon size={11} weight="bold" />}
              {Math.abs(pct).toLocaleString()}%
              <span>vs yesterday</span>
            </span>
          )}
        </div>
        <p className={styles.kpiCaption}>
          {s.count === 0 ? `No alerts ${PERIOD_WORD[filter.period]}` : `${s.count} ${s.count === 1 ? 'alert' : 'alerts'} ${PERIOD_WORD[filter.period]}`}
        </p>

        {rows.length > 0 && (
          <ul className={styles.split} aria-label="By category">
            {rows.map((r) => (
              <li key={r.category} className={styles.splitRow}>
                <span className={styles.splitName}>{r.category}</span>
                <span className={styles.splitValue}>{money(r.value)}</span>
                <span className={styles.splitShare}>{Math.round(r.share * 100)}%</span>
                <span className={styles.splitBar} aria-hidden><i style={{ transform: `scaleX(${Math.max(0.02, r.share)})` }} /></span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
}
