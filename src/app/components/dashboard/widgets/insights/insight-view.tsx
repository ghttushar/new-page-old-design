import { ArrowRightIcon, type Icon } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { ArtShape, InsightKind, Option, WidgetBodyProps, WidgetCategory, WidgetConfig, WidgetDefinition } from '../../dashboard.types';
import type { Market } from './shared';
import styles from '../../dashboard.module.scss';

// One body for every insight nugget. A nugget's builder returns a view: a strip of figures, a share bar, a ranked list
// or an hour-by-day heatmap (any mix), and the line under the title. The frame, the market setting and the library
// card all come from the definition below.

export type Tone = 'good' | 'bad' | 'warn' | 'neutral';

export interface Stat { label: string; value: string; caption?: string; tone?: Tone }
export interface Segment { label: string; value: number; tone?: Tone | 'a' | 'b' | 'c' | 'd' }
export interface Row {
  id: string;
  name: string;
  meta?: string;
  value: string;
  sub?: string;
  /** 0–1: draws a bar under the name. */
  bar?: number;
  tone?: Tone;
  /** A short label beside the name (a status, a type). */
  tag?: string;
}
export interface Heat { rows: string[]; cols: string[]; values: number[][]; off?: boolean[][]; format: (v: number) => string; legend: string }

export interface View {
  /** The line under the nugget's title. */
  line: string;
  stats?: Stat[];
  segments?: Segment[];
  rowsHead?: [string, string];
  rows?: Row[];
  heat?: Heat;
  empty?: string;
}

const TONE: Record<Tone, string> = { good: styles.inGood, bad: styles.inBad, warn: styles.inWarn, neutral: '' };
const SEG: Record<string, string> = { good: styles.inSegGood, bad: styles.inSegBad, warn: styles.inSegWarn, neutral: styles.inSegN, a: styles.inSegA, b: styles.inSegB, c: styles.inSegC, d: styles.inSegD };

export function InsightBody({ view, cta, preview }: { view: View; cta?: { label: string; to: string }; preview?: boolean }) {
  const total = (view.segments ?? []).reduce((s, x) => s + x.value, 0);
  return (
    <div className={styles.in}>
      {view.stats && view.stats.length > 0 && (
        <dl className={styles.opStats} style={{ gridTemplateColumns: `repeat(${view.stats.length}, minmax(0, 1fr))` }}>
          {view.stats.map((s) => (
            <div key={s.label} className={styles.opStat}>
              <dt>{s.label}</dt>
              <dd className={s.tone ? TONE[s.tone] : undefined}>{s.value}</dd>
              {s.caption && <span title={s.caption}>{s.caption}</span>}
            </div>
          ))}
        </dl>
      )}

      {/* Shares as labelled bars, one per part, so nothing depends on matching a colour to a legend. */}
      {view.segments && total > 0 && (
        <ul className={styles.inSplit}>
          {view.segments.map((s) => (
            <li key={s.label}>
              <span className={styles.inSplitLabel}>{s.label}<b>{Math.round((s.value / total) * 100)}%</b></span>
              <span className={`${styles.inSplitBar} ${SEG[s.tone ?? 'a']}`} aria-hidden><i style={{ transform: `scaleX(${Math.max(0.02, s.value / total)})` }} /></span>
            </li>
          ))}
        </ul>
      )}

      {view.heat && (
        <div className={styles.inHeatWrap}>
          <table className={styles.inHeat}>
            <thead><tr><th aria-label="Day" />{view.heat.cols.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
            <tbody>
              {view.heat.rows.map((r, ri) => {
                const max = Math.max(...view.heat!.values.flat());
                return (
                  <tr key={r}>
                    <th scope="row">{r}</th>
                    {view.heat!.values[ri].map((v, ci) => {
                      const off = view.heat!.off?.[ri]?.[ci];
                      return (
                        <td key={ci} title={`${r} ${view.heat!.cols[ci]}: ${view.heat!.format(v)}${off ? ' · paused by Day Parting' : ''}`} className={off ? styles.inHeatOff : undefined}>
                          <i style={{ opacity: off ? 1 : 0.12 + 0.88 * (v / max) }} />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className={styles.inHeatLegend}>{view.heat.legend}</p>
        </div>
      )}

      {view.rows && (view.rows.length === 0 ? (
        <p className={styles.opEmpty}>{view.empty ?? 'Nothing to show right now.'}</p>
      ) : (
        <div className={styles.inList}>
          {view.rowsHead && <div className={styles.inHead}><span>{view.rowsHead[0]}</span><span>{view.rowsHead[1]}</span></div>}
          <ul>
            {view.rows.map((r) => (
              <li key={r.id} className={styles.inRow}>
                <span className={styles.inWho}>
                  <span className={styles.inName}>
                    <span title={r.name}>{r.name}</span>
                    {r.tag && <em className={styles.inTag}>{r.tag}</em>}
                  </span>
                  {r.meta && <span className={styles.inMeta} title={r.meta}>{r.meta}</span>}
                  {r.bar !== undefined && <span className={`${styles.inBar} ${r.tone ? TONE[r.tone] : ''}`} aria-hidden><i style={{ transform: `scaleX(${Math.max(0.02, Math.min(1, r.bar))})` }} /></span>}
                </span>
                <span className={styles.inFigures}>
                  <strong className={r.tone ? TONE[r.tone] : undefined}>{r.value}</strong>
                  {r.sub && <small>{r.sub}</small>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {cta && (
        <Link to={cta.to} className={styles.opLink} tabIndex={preview ? -1 : undefined} onClick={(e) => { if (preview) e.preventDefault(); }}>
          {cta.label}<ArrowRightIcon size={13} weight="bold" />
        </Link>
      )}
    </div>
  );
}

// ── Definitions ─────────────────────────────────────────────────────────────────────────────

export type Availability = 'A' | 'W' | 'A·W';
const AVAILABILITY: Record<Availability, string> = { A: 'Amazon only', W: 'Walmart only', 'A·W': 'Amazon and Walmart' };
const MARKETS: Option[] = [{ value: 'all', label: 'All marketplaces' }, { value: 'amazon', label: 'Amazon' }, { value: 'walmart', label: 'Walmart' }];

export interface InsightSpec {
  kind: InsightKind;
  title: string;
  category: WidgetCategory;
  /** One line for the library card. */
  summary: string;
  /** For the card's tooltip: what the nugget shows and why it matters. */
  description: string;
  /** For the card's tooltip: how it is worked out. */
  logic: string;
  /** Where the data comes from, listed on the card. */
  sources: string[];
  availability: Availability;
  /** Account-wide data with no marketplace split (rules, tasks): no Marketplace setting. */
  accountWide?: boolean;
  icon: Icon;
  art: ArtShape;
  size?: { w: number; h: number; minW: number; minH: number };
  cta?: { label: string; to: string };
  build: (market: Market) => View;
}

const readMarket = (config: WidgetConfig, availability: Availability): Market => {
  if (availability === 'A') return 'amazon';
  if (availability === 'W') return 'walmart';
  return config.market === 'amazon' || config.market === 'walmart' ? config.market : 'all';
};

/** Every insight's builder by kind, so the screen inventory can sort them by the blocks their view uses. */
export const INSIGHT_BUILDS = new Map<InsightKind, (market: Market) => View>();

/** Turns a spec into a dashboard nugget: marked New, with the market as its header setting when both have the data. */
export function defineInsight(spec: InsightSpec): WidgetDefinition {
  INSIGHT_BUILDS.set(spec.kind, spec.build);
  const both = spec.availability === 'A·W' && !spec.accountWide;
  const suffix = spec.availability === 'A·W' ? '' : ` · ${AVAILABILITY[spec.availability]}`;
  function Body({ config, preview }: WidgetBodyProps) {
    const market = readMarket(config, spec.availability);
    const view = useMemo(() => spec.build(market), [market]);
    return <InsightBody view={view} cta={spec.cta} preview={preview} />;
  }
  Body.displayName = `Insight(${spec.kind})`;
  return {
    kind: spec.kind,
    title: spec.title,
    category: spec.category,
    summary: spec.summary,
    dataPoints: spec.sources,
    size: spec.size ?? { w: 6, h: 9, minW: 4, minH: 6 },
    defaults: both ? { market: 'all' } : {},
    header: both ? { key: 'market', label: 'Marketplace', options: MARKETS } : undefined,
    fields: [],
    describe: (config) => spec.build(readMarket(config, spec.availability)).line + suffix,
    link: spec.cta,
    icon: spec.icon,
    Body,
    isNew: true,
    description: spec.description,
    logic: spec.logic,
    availability: AVAILABILITY[spec.availability],
    art: spec.art,
  };
}
