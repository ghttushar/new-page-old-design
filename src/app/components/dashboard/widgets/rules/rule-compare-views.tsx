import { ArrowDownIcon, ArrowUpIcon, ChartBarIcon, ChartLineIcon, ArrowsLeftRightIcon, SquaresFourIcon, TableIcon, type Icon } from '@phosphor-icons/react';
import { useReducedMotion } from 'motion/react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { METRIC, changePct, formatMetric, metricOf, shortDate, sumDays, verdict, type Day, type MetricId } from './data';
import styles from '../../dashboard.module.scss';

// The five ways to read an A vs B comparison. Both Rules nuggets share them, so a new view shows up in both.

export type VizId = 'line' | 'bars' | 'table' | 'tiles' | 'lift';

export const VIZ: { id: VizId; label: string; short: string; icon: Icon }[] = [
  { id: 'line', label: 'Line trend', short: 'Line', icon: ChartLineIcon },
  { id: 'bars', label: 'Grouped bars', short: 'Bars', icon: ChartBarIcon },
  { id: 'table', label: 'Table', short: 'Table', icon: TableIcon },
  { id: 'tiles', label: 'Number tiles', short: 'Tiles', icon: SquaresFourIcon },
  { id: 'lift', label: 'Change per metric', short: 'Change', icon: ArrowsLeftRightIcon },
];

export interface CompareSide {
  /** What the side is, e.g. "With rule" or a rule's name. Used in headers and the legend. */
  label: string;
  color: string;
  dashed?: boolean;
  days: Day[];
}

export interface CompareProps {
  a: CompareSide;
  b: CompareSide;
  metrics: MetricId[];
  /** 'impact': A is the rule, so A winning is good news. 'neutral': two rules, neither side is the good one. */
  tone: 'impact' | 'neutral';
  preview?: boolean;
}

const AXIS = { fontSize: 11, fill: '#858b96', fontFamily: 'Inter, sans-serif' };

const totalsOf = (p: CompareProps) => ({ a: sumDays(p.a.days), b: sumDays(p.b.days) });

function Delta({ a, b, id, tone, quiet }: { a: number; b: number; id: MetricId; tone: CompareProps['tone']; quiet?: boolean }) {
  const pct = changePct(a, b);
  const v = verdict(a, b, id);
  const cls = tone === 'neutral' || v === 'even' ? styles.rcDeltaFlat : v === 'a' ? styles.deltaGood : styles.deltaBad;
  return (
    <span className={`${styles.rcDelta} ${cls} ${quiet ? styles.rcDeltaQuiet : ''}`}>
      {Math.abs(pct) >= 0.05 && (pct > 0 ? <ArrowUpIcon size={10} weight="bold" /> : <ArrowDownIcon size={10} weight="bold" />)}
      {Math.abs(pct).toFixed(1)}%
    </span>
  );
}

function Legend({ a, b, kind }: { a: CompareSide; b: CompareSide; kind: 'line' | 'swatch' }) {
  const mark = (s: CompareSide) => (kind === 'line'
    ? <svg width="18" height="6" aria-hidden><line x1="1" y1="3" x2="17" y2="3" stroke={s.color} strokeWidth="2" strokeDasharray={s.dashed ? '4 3' : undefined} strokeLinecap="round" /></svg>
    : <i className={s.dashed ? styles.rcBarHatch : undefined} style={{ background: s.color, ['--c' as string]: s.color }} aria-hidden />);
  return (
    <div className={styles.rcLegend}>
      <span>{mark(a)}{a.label}</span>
      <span>{mark(b)}{b.label}</span>
    </div>
  );
}

function ChartTip({ active, payload, label, metric, a, b }: { active?: boolean; payload?: { dataKey?: string; value?: number }[]; label?: string; metric: MetricId; a: CompareSide; b: CompareSide }) {
  if (!active || !payload?.length) return null;
  const val = (k: string) => payload.find((p) => p.dataKey === k)?.value;
  return (
    <div className={styles.rcTip}>
      <strong>{label}</strong>
      {[{ k: 'a', s: a }, { k: 'b', s: b }].map(({ k, s }) => (
        <span key={k}><em style={{ color: s.color }}>{s.label}</em>{val(k) != null ? formatMetric(val(k) as number, metric) : '–'}</span>
      ))}
    </div>
  );
}

function rowsFor(p: CompareProps, metric: MetricId) {
  return p.a.days.map((d, i) => ({
    x: shortDate(d.date),
    a: metricOf(d.totals, metric),
    b: p.b.days[i] ? metricOf(p.b.days[i].totals, metric) : null,
  }));
}

// ── Line ────────────────────────────────────────────────────────────────────────────────────

function LineView(p: CompareProps) {
  const reduce = useReducedMotion();
  const animate = !reduce && !p.preview;
  const t = totalsOf(p);

  if (p.metrics.length === 1) {
    const id = p.metrics[0];
    const av = metricOf(t.a, id);
    const bv = metricOf(t.b, id);
    return (
      <div className={styles.rcLine}>
        <div className={styles.rcStats}>
          <div><span>{p.a.label}</span><strong>{formatMetric(av, id)}</strong></div>
          <div><span>{p.b.label}</span><strong className={styles.rcStatMuted}>{formatMetric(bv, id)}</strong></div>
          <div><span>{p.tone === 'impact' ? 'Impact' : 'Difference'}</span><Delta a={av} b={bv} id={id} tone={p.tone} /></div>
        </div>
        <div className={styles.rcChart}>
          <div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rowsFor(p, id)} margin={{ top: 6, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} stroke="#eef0f4" />
                <XAxis dataKey="x" tick={AXIS} tickLine={false} axisLine={false} minTickGap={24} />
                <YAxis tick={AXIS} tickLine={false} axisLine={false} width={46} tickFormatter={(v: number) => formatMetric(v, id, { short: true })} domain={['auto', 'auto']} />
                <Tooltip content={<ChartTip metric={id} a={p.a} b={p.b} />} cursor={{ stroke: '#d5d9e0' }} />
                <Line dataKey="b" stroke={p.b.color} strokeWidth={2} strokeDasharray={p.b.dashed ? '5 4' : undefined} dot={false} isAnimationActive={animate} />
                <Line dataKey="a" stroke={p.a.color} strokeWidth={2.25} dot={false} activeDot={{ r: 3.5, strokeWidth: 0 }} isAnimationActive={animate} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <Legend a={p.a} b={p.b} kind="line" />
      </div>
    );
  }

  // Several metrics have different scales, so each gets its own small chart.
  return (
    <div className={styles.rcLine}>
      <div className={styles.rcMultiples}>
        {p.metrics.map((id) => {
          const av = metricOf(t.a, id);
          const bv = metricOf(t.b, id);
          return (
            <div key={id} className={styles.rcMultiple}>
              <div className={styles.rcMultipleHead}>
                <span>{METRIC[id].label}</span>
                <Delta a={av} b={bv} id={id} tone={p.tone} quiet />
              </div>
              <div className={styles.rcMultipleFigures}>
                <strong>{formatMetric(av, id, { short: true })}</strong>
                <span>vs {formatMetric(bv, id, { short: true })}</span>
              </div>
              <div className={styles.rcSpark}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rowsFor(p, id)} margin={{ top: 3, right: 2, bottom: 3, left: 2 }}>
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip content={<ChartTip metric={id} a={p.a} b={p.b} />} cursor={{ stroke: '#d5d9e0' }} />
                    <Line dataKey="b" stroke={p.b.color} strokeWidth={1.5} strokeDasharray={p.b.dashed ? '4 3' : undefined} dot={false} isAnimationActive={animate} />
                    <Line dataKey="a" stroke={p.a.color} strokeWidth={1.75} dot={false} isAnimationActive={animate} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
      <Legend a={p.a} b={p.b} kind="line" />
    </div>
  );
}

// ── Bars ────────────────────────────────────────────────────────────────────────────────────

/** Each metric is scaled to the larger of its two values, so ROAS and spend can stand side by side. */
function BarsView(p: CompareProps) {
  const t = totalsOf(p);
  return (
    <div className={styles.rcLine}>
      <div className={styles.rcBars}>
        {p.metrics.map((id) => {
          const av = metricOf(t.a, id);
          const bv = metricOf(t.b, id);
          const max = Math.max(av, bv) || 1;
          return (
            <div key={id} className={styles.rcBarGroup} title={`${METRIC[id].label}: ${formatMetric(av, id)} vs ${formatMetric(bv, id)}`}>
              <div className={styles.rcBarCols}>
                {[{ s: p.a, v: av, k: 'a' }, { s: p.b, v: bv, k: 'b' }].map(({ s, v, k }) => (
                  <div key={k} className={styles.rcBarCol}>
                    <span>{formatMetric(v, id, { short: true })}</span>
                    <i
                      className={s.dashed ? styles.rcBarHatch : undefined}
                      style={{ ['--h' as string]: Math.max(0.03, v / max), ['--c' as string]: s.color }}
                    />
                  </div>
                ))}
              </div>
              <span className={styles.rcBarLabel}>{METRIC[id].label}</span>
            </div>
          );
        })}
      </div>
      <Legend a={p.a} b={p.b} kind="swatch" />
    </div>
  );
}

// ── Table ───────────────────────────────────────────────────────────────────────────────────

function TableView(p: CompareProps) {
  const t = totalsOf(p);
  return (
    <div className={styles.rcTableWrap}>
      <table className={styles.rcTable}>
        <thead>
          <tr>
            <th scope="col">Metric</th>
            <th scope="col" style={{ color: p.a.color }}>{p.a.label}</th>
            <th scope="col">{p.b.label}</th>
            <th scope="col">Change</th>
            <th scope="col">Winner</th>
          </tr>
        </thead>
        <tbody>
          {p.metrics.map((id) => {
            const av = metricOf(t.a, id);
            const bv = metricOf(t.b, id);
            const v = verdict(av, bv, id);
            const winCls = v === 'even' ? styles.rcWinEven
              : p.tone === 'neutral' ? styles.rcWinPlain
                : v === 'a' ? styles.rcWinGood : styles.rcWinBad;
            return (
              <tr key={id}>
                <th scope="row">{METRIC[id].label}</th>
                <td>{formatMetric(av, id)}</td>
                <td>{formatMetric(bv, id)}</td>
                <td><Delta a={av} b={bv} id={id} tone={p.tone} quiet /></td>
                <td className={winCls}>{v === 'even' ? 'Even' : v === 'a' ? p.a.label : p.b.label}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Tiles ───────────────────────────────────────────────────────────────────────────────────

function TilesView(p: CompareProps) {
  const t = totalsOf(p);
  return (
    <div className={styles.rcTiles}>
      {p.metrics.map((id) => {
        const av = metricOf(t.a, id);
        const bv = metricOf(t.b, id);
        return (
          <div key={id} className={styles.rcTile}>
            <span className={styles.rcTileLabel}>{METRIC[id].label}</span>
            <strong className={styles.rcTileValue}>{formatMetric(av, id, { short: true })}</strong>
            <span className={styles.rcTileFoot}>
              <Delta a={av} b={bv} id={id} tone={p.tone} />
              <span>vs {formatMetric(bv, id, { short: true })}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Change per metric ───────────────────────────────────────────────────────────────────────

/** How far A moved from B on each metric. Bars point right when A did better, whichever way the number went. */
function LiftView(p: CompareProps) {
  const t = totalsOf(p);
  const rows = p.metrics.map((id) => {
    const av = metricOf(t.a, id);
    const bv = metricOf(t.b, id);
    return { id, pct: changePct(av, bv), v: verdict(av, bv, id) };
  });
  const max = Math.max(5, ...rows.map((r) => Math.abs(r.pct)));
  const goodSide = p.tone === 'impact' ? 'Better with the rule' : `${p.a.label} ahead`;
  const badSide = p.tone === 'impact' ? 'Worse with the rule' : `${p.b.label} ahead`;
  return (
    <div className={styles.rcLine}>
      <div className={styles.rcLiftAxis} aria-hidden><span>{badSide}</span><span>{goodSide}</span></div>
      <ul className={styles.rcLift}>
        {rows.map((r) => {
          const w = Math.min(1, Math.abs(r.pct) / max);
          const right = r.v !== 'b';
          const cls = r.v === 'even' || p.tone === 'neutral' ? (right ? styles.rcLiftA : styles.rcLiftB) : right ? styles.rcLiftGood : styles.rcLiftBad;
          return (
            <li key={r.id} className={styles.rcLiftRow}>
              <span className={styles.rcLiftName}>{METRIC[r.id].label}</span>
              <span className={styles.rcLiftTrack}>
                <i
                  className={cls}
                  style={{ ['--w' as string]: Math.max(0.015, w), ['--a' as string]: p.a.color, ['--b' as string]: p.b.color, ...(right ? { left: '50%', transformOrigin: 'left' } : { right: '50%', transformOrigin: 'right' }) }}
                />
              </span>
              <span className={styles.rcLiftValue}>{r.pct > 0 ? '+' : r.pct < 0 ? '−' : ''}{Math.abs(r.pct).toFixed(1)}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function CompareView({ viz, ...p }: CompareProps & { viz: VizId }) {
  if (viz === 'bars') return <BarsView {...p} />;
  if (viz === 'table') return <TableView {...p} />;
  if (viz === 'tiles') return <TilesView {...p} />;
  if (viz === 'lift') return <LiftView {...p} />;
  return <LineView {...p} />;
}
