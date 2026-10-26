import { ChartBarHorizontalIcon, HashIcon, ListNumbersIcon, MegaphoneSimpleIcon, TableIcon } from '@phosphor-icons/react';
import { useMemo } from 'react';
import type { WidgetBodyProps, WidgetConfig } from '../../dashboard.types';
import { RangeSelect, StripSelect } from '../rules/compare-controls';
import { RANGE_DAYS, formatMetric, type MetricId, type RangeId } from '../rules/data';
import { LOWEST_FIRST, TOP_LABEL, TOP_METRICS, rankPerformers, type EntityKind } from './data';
import styles from '../../dashboard.module.scss';

// Top performers: the account's campaigns or keywords ranked on one metric, as a table or as bars.
// What to rank, on which metric, how many and how to show them all sit on the control strip.

export type TopCount = '5' | '10' | '15' | 'all';
export type TopViz = 'table' | 'bars';

export interface TopConfig { entity: EntityKind; metric: MetricId; top: TopCount; viz: TopViz; range: RangeId }

export function readTop(config: WidgetConfig): TopConfig {
  return {
    entity: config.entity === 'keyword' ? 'keyword' : 'campaign',
    metric: (TOP_METRICS.some((m) => m.id === config.metric) ? config.metric : 'sales') as MetricId,
    top: (['5', '10', '15', 'all'].includes(config.top as string) ? config.top : '5') as TopCount,
    viz: config.viz === 'bars' ? 'bars' : 'table',
    range: (typeof config.range === 'string' && config.range in RANGE_DAYS ? config.range : '30') as RangeId,
  };
}

const ENTITY_OPTIONS = [
  { value: 'campaign' as const, label: 'Campaigns', icon: MegaphoneSimpleIcon },
  { value: 'keyword' as const, label: 'Keywords', icon: HashIcon },
];
const METRIC_OPTIONS = TOP_METRICS.map((m) => ({ value: m.id, label: m.label }));
export const TOP_OPTIONS = [
  { value: '5' as const, label: 'Top 5' },
  { value: '10' as const, label: 'Top 10' },
  { value: '15' as const, label: 'Top 15' },
  { value: 'all' as const, label: 'All' },
];
export const VIZ_OPTIONS = [
  { value: 'table' as const, label: 'Table', icon: TableIcon },
  { value: 'bars' as const, label: 'Bars', icon: ChartBarHorizontalIcon },
];

/** "Top 5 campaigns by Ad Sales · 30 days", for the line under the nugget's title. */
export function describeTop(config: WidgetConfig): string {
  const c = readTop(config);
  const noun = c.entity === 'keyword' ? 'keywords' : 'campaigns';
  const count = c.top === 'all' ? `All ${noun}` : `Top ${c.top} ${noun}`;
  const order = LOWEST_FIRST.includes(c.metric) ? ', lowest first' : '';
  return `${count} by ${TOP_LABEL[c.metric]}${order} · ${RANGE_DAYS[c.range]} days`;
}

export default function TopPerformers({ config, onConfig, preview }: WidgetBodyProps) {
  const c = readTop(config);
  const ranked = useMemo(() => rankPerformers(c.entity, c.metric, c.range), [c.entity, c.metric, c.range]);
  const rows = c.top === 'all' ? ranked : ranked.slice(0, Number(c.top));
  const max = Math.max(...rows.map((r) => r.value), 0);
  const noun = c.entity === 'keyword' ? 'Keyword' : 'Campaign';
  const metricHead = `${TOP_LABEL[c.metric]}${LOWEST_FIRST.includes(c.metric) ? ' · lowest first' : ''}`;

  return (
    <div className={styles.rc}>
      <div className={styles.rcStrip}>
        <div className={`${styles.rcSides} ${styles.tpSides}`}>
          <StripSelect label="Show" heading="Show" value={c.entity} options={ENTITY_OPTIONS} onChange={(v) => onConfig({ entity: v })} preview={preview} width={200} />
          <span className={styles.tpSep} aria-hidden />
          <StripSelect label="Ranked by" heading="Ranked by" value={c.metric} options={METRIC_OPTIONS} onChange={(v) => onConfig({ metric: v })} preview={preview} width={200} />
        </div>
        <div className={`${styles.rcDrops} ${styles.tpDrops}`}>
          <StripSelect label="How many" value={c.top} options={TOP_OPTIONS} icon={ListNumbersIcon} onChange={(v) => onConfig({ top: v })} preview={preview} width={150} />
          <StripSelect label="View" value={c.viz} options={VIZ_OPTIONS} onChange={(v) => onConfig({ viz: v })} preview={preview} width={160} />
          <RangeSelect value={c.range} onChange={(r) => onConfig({ range: r })} preview={preview} />
        </div>
      </div>

      <div className={styles.rcView}>
        {c.viz === 'table' ? (
          <div className={styles.rcTableWrap}>
            <table className={`${styles.rcTable} ${styles.tpTable}`}>
              <thead>
                <tr><th className={styles.tpRank}>#</th><th>{noun}</th><th className={styles.tpNum}>{metricHead}</th></tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id}>
                    <td className={styles.tpRank}>{i + 1}</td>
                    <th scope="row" className={styles.tpWho}>
                      <span className={styles.tpName} title={r.name}>{r.name}</span>
                      <span className={styles.tpMeta}><span className={styles.tpId}>ID {r.id}</span> · {r.detail}</span>
                    </th>
                    <td className={styles.tpNum}>{formatMetric(r.value, c.metric)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.rcTableWrap}>
            <div className={styles.tpBarsHead}><span>{noun}</span><span>{metricHead}</span></div>
            <ol className={styles.tpBars}>
              {rows.map((r, i) => (
                <li key={r.id} className={styles.tpBar}>
                  <span className={styles.tpRank}>{i + 1}</span>
                  <span className={styles.tpBarCopy}>
                    <span className={styles.tpBarName} title={`${r.name} · ID ${r.id}`}><span className={styles.tpName}>{r.name}</span><span className={styles.tpId}>ID {r.id}</span></span>
                    <span className={styles.tpBarTrack} aria-hidden><i style={{ transform: `scaleX(${max > 0 ? Math.max(0.02, r.value / max) : 0})` }} /></span>
                  </span>
                  <span className={styles.tpNum}>{formatMetric(r.value, c.metric)}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
