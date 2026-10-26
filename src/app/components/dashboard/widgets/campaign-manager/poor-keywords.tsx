import { ListNumbersIcon } from '@phosphor-icons/react';
import { useMemo } from 'react';
import type { WidgetBodyProps, WidgetConfig } from '../../dashboard.types';
import { RangeSelect, StripSelect } from '../rules/compare-controls';
import { RANGE_DAYS, formatMetric, metricOf, type RangeId } from '../rules/data';
import { performerTotals } from './data';
import { TOP_OPTIONS, VIZ_OPTIONS, type TopCount, type TopViz } from './top-performers';
import styles from '../../dashboard.module.scss';

// Review poor performing keywords: the same mechanism as Top performers, turned round. Keywords are ranked worst first
// on ROAS (lowest first) or Ad Spend (highest first), and every row shows both, so a costly keyword that earns little
// stands out either way.

type PoorMetric = 'roas' | 'spend';

export interface PoorConfig { metric: PoorMetric; top: TopCount; viz: TopViz; range: RangeId }

export function readPoor(config: WidgetConfig): PoorConfig {
  return {
    metric: config.metric === 'spend' ? 'spend' : 'roas',
    top: (['5', '10', '15', 'all'].includes(config.top as string) ? config.top : '5') as TopCount,
    viz: config.viz === 'bars' ? 'bars' : 'table',
    range: (typeof config.range === 'string' && config.range in RANGE_DAYS ? config.range : '30') as RangeId,
  };
}

const LABEL: Record<PoorMetric, string> = { roas: 'ROAS', spend: 'Ad Spend' };
const ORDER: Record<PoorMetric, string> = { roas: 'lowest first', spend: 'highest first' };
const METRIC_OPTIONS = [
  { value: 'roas' as const, label: 'ROAS (lowest first)', short: 'ROAS' },
  { value: 'spend' as const, label: 'Ad Spend (highest first)', short: 'Ad Spend' },
];

/** "5 poorest keywords by ROAS · 30 days", for the line under the nugget's title. */
export function describePoor(config: WidgetConfig): string {
  const c = readPoor(config);
  const count = c.top === 'all' ? 'All keywords' : `${c.top} poorest keywords`;
  return `${count} by ${LABEL[c.metric]} · ${RANGE_DAYS[c.range]} days`;
}

export default function PoorKeywords({ config, onConfig, preview }: WidgetBodyProps) {
  const c = readPoor(config);
  const ranked = useMemo(() => {
    const rows = performerTotals('keyword', c.range).map((p) => ({ ...p, roas: metricOf(p.totals, 'roas'), spend: metricOf(p.totals, 'spend') }));
    return rows.sort((x, y) => (c.metric === 'roas' ? x.roas - y.roas : y.spend - x.spend));
  }, [c.metric, c.range]);
  const rows = c.top === 'all' ? ranked : ranked.slice(0, Number(c.top));
  const valueOf = (r: (typeof rows)[number]) => (c.metric === 'roas' ? r.roas : r.spend);
  const max = Math.max(...rows.map(valueOf), 0);
  const other: PoorMetric = c.metric === 'roas' ? 'spend' : 'roas';

  return (
    <div className={styles.rc}>
      <div className={styles.rcStrip}>
        <div className={`${styles.rcSides} ${styles.tpSides}`}>
          <StripSelect label="Ranked by" heading="Ranked by" value={c.metric} options={METRIC_OPTIONS} onChange={(v) => onConfig({ metric: v })} preview={preview} width={220} />
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
                <tr>
                  <th className={styles.tpRank}>#</th>
                  <th>Keyword</th>
                  {(['roas', 'spend'] as PoorMetric[]).map((m) => (
                    <th key={m} className={styles.tpNum}>{LABEL[m]}{m === c.metric ? ` · ${ORDER[m]}` : ''}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id}>
                    <td className={styles.tpRank}>{i + 1}</td>
                    <th scope="row" className={styles.tpWho}>
                      <span className={styles.tpName} title={r.name}>{r.name}</span>
                      <span className={styles.tpMeta}><span className={styles.tpId}>ID {r.id}</span> · {r.detail}</span>
                    </th>
                    {(['roas', 'spend'] as PoorMetric[]).map((m) => (
                      <td key={m} className={`${styles.tpNum} ${m === c.metric ? '' : styles.pkOther}`}>{formatMetric(r[m], m)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.rcTableWrap}>
            <div className={styles.tpBarsHead}><span>Keyword</span><span>{LABEL[c.metric]} · {ORDER[c.metric]}</span></div>
            <ol className={styles.tpBars}>
              {rows.map((r, i) => (
                <li key={r.id} className={styles.tpBar}>
                  <span className={styles.tpRank}>{i + 1}</span>
                  <span className={styles.tpBarCopy}>
                    <span className={styles.tpBarName} title={`${r.name} · ID ${r.id}`}><span className={styles.tpName}>{r.name}</span><span className={styles.tpId}>ID {r.id}</span></span>
                    <span className={`${styles.tpBarTrack} ${styles.pkBar}`} aria-hidden><i style={{ transform: `scaleX(${max > 0 ? Math.max(0.02, valueOf(r) / max) : 0})` }} /></span>
                  </span>
                  <span className={styles.pkValues}>
                    <span className={styles.tpNum}>{formatMetric(valueOf(r), c.metric)}</span>
                    <small>{LABEL[other]} {formatMetric(r[other], other)}</small>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
