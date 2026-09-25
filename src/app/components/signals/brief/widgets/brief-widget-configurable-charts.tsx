import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BRIEF_HOURLY_SERIES, BRIEF_TREND_SERIES, DASHBOARD_METRICS, type DashboardMetric } from '@/constants/signals/prototype-data';
import { PencilIcon, SparkleIcon } from '../../alerts/icons';
import motion from '../../alerts/motion.module.scss';
import type { WidgetKind } from './brief-widget-types';
import { DonutChart } from './brief-widget-charts';

/**
 * The "add up to 5 things, pick colors, pick what's plotted, all through a Jiva prompt" system:
 * `barChartVertical` / `barChartHorizontal` / `comparisonChart` / `pieChart` / `dataTable` /
 * `comparisonTable` / `lineChart` / `hourlyChart` all share this one config shape and empty-first
 * behavior instead of coming pre-populated like the fixed charts in brief-widget-charts.tsx. Nothing
 * here renders on its own until the widget's config actually has series in it — see EmptyChartState.
 * The bar/pie/table/comparison-table kinds are really one data model (pick up to 5 metrics, each its
 * own color) rendered five different ways — only the line-family kinds (`lineChart`/`hourlyChart`)
 * have a genuinely different shape, since each series there is a whole trend line, not one point.
 */

const AXIS_STYLE = { fontSize: 10.5, fill: '#9aa0a8', fontFamily: 'Inter,sans-serif' };
export const SERIES_MAX = 5;
export const SERIES_COLORS = ['#77469b', '#2f6fed', '#a8763f', '#3f7d6a', '#b3453f'];
export const COLOR_WORDS: { name: string; hex: string }[] = [
  { name: 'purple', hex: '#77469b' }, { name: 'blue', hex: '#2f6fed' }, { name: 'green', hex: '#3f7d6a' },
  { name: 'red', hex: '#b3453f' }, { name: 'orange', hex: '#a8763f' }, { name: 'tan', hex: '#a8763f' },
  { name: 'teal', hex: '#1DCBCB' }, { name: 'yellow', hex: '#FEBC2A' }, { name: 'pink', hex: '#e05c8a' },
];

export interface ChartSeriesItem { id: string; metricId: string; color: string }

export function chartSeries(config: Record<string, unknown>): ChartSeriesItem[] {
  return (config.series as ChartSeriesItem[] | undefined) ?? [];
}

export interface SeriesField { id: string; label: string }

const TREND_FIELDS: SeriesField[] = [
  { id: 'revenue', label: 'Revenue' }, { id: 'adSales', label: 'Ad sales' }, { id: 'spend', label: 'Spend' },
  { id: 'roas', label: 'ROAS' }, { id: 'acos', label: 'ACOS' },
];
const HOURLY_FIELDS: SeriesField[] = [
  { id: 'revenue', label: 'Revenue' }, { id: 'spend', label: 'Spend' }, { id: 'roas', label: 'ROAS' },
];

/** What a series in this widget kind can be assigned to. Bar-family kinds pick a whole metric (its own current value); line-family kinds pick one field of the shared 7-day/intraday series, so every line drawn shares the same x-axis. */
export function seriesCatalogFor(kind: WidgetKind): SeriesField[] {
  if (kind === 'lineChart') return TREND_FIELDS;
  if (kind === 'hourlyChart') return HOURLY_FIELDS;
  return DASHBOARD_METRICS.map((m) => ({ id: m.id, label: m.label }));
}

const ALL_KINDS = [
  'barChartVertical', 'barChartHorizontal', 'comparisonChart', 'pieChart', 'dataTable', 'comparisonTable', 'lineChart', 'hourlyChart',
] as const;

export function isChartSeriesKind(kind: WidgetKind): boolean {
  return (ALL_KINDS as readonly string[]).includes(kind);
}

function isBarFamily(kind: WidgetKind): boolean {
  return kind === 'barChartVertical' || kind === 'barChartHorizontal' || kind === 'comparisonChart';
}

function isTableFamily(kind: WidgetKind): boolean {
  return kind === 'dataTable' || kind === 'comparisonTable';
}

function chartKindLabel(kind: WidgetKind): string {
  if (kind === 'barChartVertical') return 'vertical bar graph';
  if (kind === 'barChartHorizontal') return 'horizontal bar graph';
  if (kind === 'comparisonChart') return 'comparison chart';
  if (kind === 'pieChart') return 'pie chart';
  if (kind === 'dataTable') return 'table';
  if (kind === 'comparisonTable') return 'comparison table';
  if (kind === 'lineChart') return 'line graph';
  return 'hourly chart';
}

/** "Previous period" derived from the metric's own trend%, so a comparison chart needs no separate mock dataset — reusing the same number already shown as the trend pill everywhere else this metric appears. */
function previousNumeric(metric: DashboardMetric): number {
  const pct = (parseFloat(metric.trend) || 0) / 100;
  const prev = metric.trendUp ? metric.numericValue / (1 + pct) : metric.numericValue / (1 - pct);
  return Math.round(prev * 100) / 100;
}

function BriefTooltip({ active, payload, label }: { active?: boolean; payload?: { dataKey?: string; name?: string; value?: number | string; color?: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#23272d', borderRadius: 7, padding: '8px 10px', boxShadow: '0 10px 24px rgba(20,24,33,.28)' }}>
      {label && <div style={{ font: '600 10.5px/1 Inter,sans-serif', color: '#c7cad1', marginBottom: 5 }}>{label}</div>}
      {payload.map((p) => (
        <div key={p.dataKey ?? p.name} style={{ display: 'flex', alignItems: 'center', gap: 6, font: '500 11.5px/1.6 Inter,sans-serif', color: '#fff' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.color, flex: 'none' }} />
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </div>
      ))}
    </div>
  );
}

function EmptyChartState({ kind, onCustomize }: { kind: WidgetKind; onCustomize: () => void }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, textAlign: 'center' as const, padding: 16 }}>
      <div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#9aa0a8', maxWidth: 220 }}>Empty {chartKindLabel(kind)} — add up to {SERIES_MAX} to plot.</div>
      <span onClick={onCustomize} className={motion.pressable} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 7, background: '#77469b', font: '600 12px/1 Inter,sans-serif', color: '#fff', cursor: 'pointer' }}>
        <SparkleIcon size={12} color="#fff" /> Customize with Jiva
      </span>
    </div>
  );
}

function SeriesLegendChip({ color, label, onEdit }: { color: string; label: string; onEdit: () => void }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 6px 4px 8px', borderRadius: 999, background: '#f5f6f8', font: '500 10.5px/1.4 Inter,sans-serif', color: '#3d434b' }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flex: 'none' }} />
      {label}
      <span
        onClick={onEdit}
        className={motion.pressable}
        title="Edit with Jiva"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: 4, cursor: 'pointer', opacity: 0.5, flex: 'none' }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.5')}
      >
        <PencilIcon size={9} color="#6b7178" />
      </span>
    </span>
  );
}

export function ChartSeriesBody({ kind, config, onCustomize, onEditSeries }: { kind: WidgetKind; config: Record<string, unknown>; onCustomize: () => void; onEditSeries: (seriesId: string) => void }) {
  const series = chartSeries(config);
  if (series.length === 0) return <EmptyChartState kind={kind} onCustomize={onCustomize} />;

  if (isBarFamily(kind) || kind === 'pieChart' || isTableFamily(kind)) {
    const comparison = kind === 'comparisonChart' || kind === 'comparisonTable';
    const data = series.map((s) => {
      const metric = DASHBOARD_METRICS.find((m) => m.id === s.metricId) ?? DASHBOARD_METRICS[0];
      return { label: metric.label, value: metric.numericValue, prevValue: comparison ? previousNumeric(metric) : undefined, trendUp: metric.trendUp, color: s.color, seriesId: s.id };
    });

    if (kind === 'pieChart') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 6 }}>
          <div style={{ flex: 1, minHeight: 0 }}>
            <DonutChart data={data.map((d) => ({ label: d.label, value: d.value, color: d.color }))} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, flex: 'none' }}>
            {data.map((d) => <SeriesLegendChip key={d.seriesId} color={d.color} label={d.label} onEdit={() => onEditSeries(d.seriesId)} />)}
          </div>
        </div>
      );
    }

    if (isTableFamily(kind)) {
      const th: React.CSSProperties = { textAlign: 'left', padding: '0 10px 8px 0', font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#9aa0a8' };
      const td: React.CSSProperties = { padding: '9px 10px 9px 0', borderTop: '1px solid #f6f7f8' };
      return (
        <div className={motion.contentFadeIn} style={{ height: '100%', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' as const, font: '400 12px/1.4 Inter,sans-serif' }}>
            <thead>
              <tr>
                <th style={th}>Metric</th>
                {comparison ? (<><th style={th}>Current</th><th style={th}>Previous</th><th style={th}>Change</th></>) : <th style={th}>Value</th>}
                <th style={{ ...th, width: 16 }} />
              </tr>
            </thead>
            <tbody>
              {data.map((d) => {
                const changePct = comparison && d.prevValue ? ((d.value - d.prevValue) / d.prevValue) * 100 : null;
                return (
                  <tr key={d.seriesId} className={motion.rowHover}>
                    <td style={{ ...td, font: '600 12.5px/1.4 Inter,sans-serif', color: '#23272d' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flex: 'none' }} />
                        {d.label}
                      </span>
                    </td>
                    {comparison ? (
                      <>
                        <td style={{ ...td, fontWeight: 700, color: '#111827' }}>{d.value.toLocaleString()}</td>
                        <td style={{ ...td, color: '#6b7178' }}>{d.prevValue?.toLocaleString()}</td>
                        <td style={{ ...td, fontWeight: 700, color: changePct !== null && changePct >= 0 ? '#3f7d6a' : '#b3453f' }}>
                          {changePct !== null ? `${changePct >= 0 ? '↑' : '↓'} ${Math.abs(changePct).toFixed(1)}%` : '—'}
                        </td>
                      </>
                    ) : (
                      <td style={{ ...td, fontWeight: 700, color: '#111827' }}>{d.value.toLocaleString()}</td>
                    )}
                    <td style={td}>
                      <span
                        onClick={() => onEditSeries(d.seriesId)}
                        className={motion.pressable}
                        title="Edit with Jiva"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: 4, cursor: 'pointer', opacity: 0.45 }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.45')}
                      >
                        <PencilIcon size={9} color="#6b7178" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    const horizontal = kind === 'barChartHorizontal';
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 6 }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={80}>
            <BarChart data={data} layout={horizontal ? 'vertical' : 'horizontal'} margin={{ left: horizontal ? 8 : 0, right: 12, top: 8, bottom: 0 }}>
              <CartesianGrid vertical={horizontal} horizontal={!horizontal} stroke="#f1f2f4" />
              {horizontal ? (
                <>
                  <XAxis type="number" hide />
                  <YAxis dataKey="label" type="category" tickLine={false} axisLine={false} width={78} tick={AXIS_STYLE} />
                </>
              ) : (
                <>
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={AXIS_STYLE} />
                  <YAxis hide />
                </>
              )}
              <Tooltip content={<BriefTooltip />} cursor={{ fill: '#fafbfd' }} />
              {kind === 'comparisonChart' && <Bar dataKey="prevValue" name="Previous" fill="#e6e8ec" radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]} />}
              <Bar dataKey="value" name="Current" radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}>
                {data.map((d) => <Cell key={d.seriesId} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, flex: 'none' }}>
          {data.map((d) => <SeriesLegendChip key={d.seriesId} color={d.color} label={d.label} onEdit={() => onEditSeries(d.seriesId)} />)}
        </div>
      </div>
    );
  }

  const isHourly = kind === 'hourlyChart';
  const dataset = isHourly ? BRIEF_HOURLY_SERIES : BRIEF_TREND_SERIES;
  const catalog = seriesCatalogFor(kind);
  const xKey = isHourly ? 'hour' : 'day';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 6 }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={80}>
          <LineChart data={dataset as unknown as Record<string, unknown>[]} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#f1f2f4" />
            <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={AXIS_STYLE} />
            <YAxis hide />
            <Tooltip content={<BriefTooltip />} />
            {series.map((s) => {
              const field = catalog.find((f) => f.id === s.metricId);
              return <Line key={s.id} type="monotone" dataKey={s.metricId} name={field?.label ?? s.metricId} stroke={s.color} strokeWidth={2} dot={false} />;
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, flex: 'none' }}>
        {series.map((s) => {
          const field = catalog.find((f) => f.id === s.metricId);
          return <SeriesLegendChip key={s.id} color={s.color} label={field?.label ?? s.metricId} onEdit={() => onEditSeries(s.id)} />;
        })}
      </div>
    </div>
  );
}
