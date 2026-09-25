import { useState } from 'react';
import {
  ACTION_MIX,
  BRIEF_RECOMMENDATIONS,
  BRIEF_TOP_MOVERS,
  CHANNEL_HEALTH,
  DASHBOARD_METRICS,
  JIVA_ACTIVITY,
  PLATFORM_CHANGE_TIMELINE,
  PROTOTYPE_ALERTS,
  type DashboardMetric,
  type PlatformChangeCategory,
} from '@/constants/signals/prototype-data';
import { ChevronDownIcon, CloseIcon, PencilIcon, PlusIcon, TrashIcon } from '../../alerts/icons';
import motion from '../../alerts/motion.module.scss';
import scrollStyles from '../../alerts/alerts-scroll.module.scss';
import type { WidgetInstance } from './brief-widget-types';
import { ActionMixChart, DaypartingChart, EfficiencyChart, KeywordFunnelChart, RevenueTrendChart, SpendSalesChart } from './brief-widget-charts';
import { ChartSeriesBody, isChartSeriesKind } from './brief-widget-configurable-charts';
import { LegacyActivityBody, LegacyKpiRow } from './brief-widget-legacy';

export const CATEGORY_COLORS: Record<PlatformChangeCategory, string> = {
  'Rules action changes': '#77469b',
  'MCP Agents changes': '#2f6fed',
  'Users made changes': '#a8763f',
  'Keywords harvesting': '#3f7d6a',
  'Dayparting rule actions': '#b3453f',
};

const PRIORITY_COLORS: Record<string, string> = { 'Do first': '#b3453f', Optimize: '#77469b', Watch: '#a8763f' };

interface BodyProps {
  widget: WidgetInstance;
  onConfigChange: (config: Record<string, unknown>) => void;
  /** Only read by the `legacyKpiRow` kind — lets the grid grow/shrink that one widget's own cell as a card opens/closes, instead of it defaulting to a height tall enough for the worst case. */
  onLegacyKpiExpand?: (expanded: boolean) => void;
  /** Only read by the `kpi`/`metricRow` kinds — splits one metric (by its index within this widget) back out into its own standalone widget, the reverse of dragging two KPI widgets together. */
  onSplitKpiMetric?: (index: number) => void;
  /** Only read by the `kpi`/`metricRow` kinds — opens the Jiva sheet scoped to one metric slot (by index), for the pencil on each member. */
  onEditKpiMember?: (index: number) => void;
  /** Only read by the chart-series kinds (`barChartVertical` etc.) — opens the Jiva sheet scoped to one series, for the pencil on each legend chip. */
  onEditSeries?: (seriesId: string) => void;
  /** Only read by the chart-series kinds — opens the Jiva sheet for the whole widget, for the empty state's "Customize with Jiva" button. */
  onOpenAiSheet?: () => void;
}

/** A `kpi` widget's config holds `metricIds` (plural) once it has ever been merged; a freshly-added widget only has the older singular `metricId`. Normalizing here means every reader — rendering and the grid's own merge/split logic — agrees on the same list regardless of which shape a given widget's config happens to be in. */
export function kpiMetricIds(config: Record<string, unknown>): string[] {
  const ids = config.metricIds as string[] | undefined;
  if (ids?.length) return ids;
  const legacy = config.metricId as string | undefined;
  return legacy ? [legacy] : [DASHBOARD_METRICS[0].id];
}

/** One metric's own reassign-dropdown + value + trend — no background of its own, since it's meant to sit inside a shared card alongside 0 or more merged siblings (see KpiWidgetBody). */
function MetricMember({ metric, options, showRemove, onChange, onRemove, onEditWithJiva }: { metric: DashboardMetric; options: DashboardMetric[]; showRemove: boolean; onChange: (id: string) => void; onRemove?: () => void; onEditWithJiva?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative', flex: 1, minWidth: 0, padding: '14px 16px', borderLeft: `3px solid ${metric.color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
        <span
          onClick={() => setOpen((v) => !v)}
          className={motion.pressable}
          style={{ display: 'flex', alignItems: 'center', gap: 4, font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: '#6b7178', cursor: 'pointer' }}
        >
          {metric.label} <ChevronDownIcon size={8} />
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 'none' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '2px 7px', borderRadius: 10, background: metric.trendUp ? '#eef6f3' : '#fbf1ef', font: '600 10px/1 Inter,sans-serif', color: metric.trendUp ? '#3f7d6a' : '#b3453f' }}>
            {metric.trendUp ? '↑' : '↓'} {metric.trend}
          </span>
          {onEditWithJiva && (
            <span
              onClick={onEditWithJiva}
              className={motion.pressable}
              title="Edit with Jiva"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: 4, cursor: 'pointer', opacity: 0.4 }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.4')}
            >
              <PencilIcon size={9} color="#6b7178" />
            </span>
          )}
          {showRemove && (
            <span
              onClick={onRemove}
              className={motion.pressable}
              title="Split into its own card"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: 4, cursor: 'pointer', opacity: 0.4 }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.4')}
            >
              <CloseIcon size={9} />
            </span>
          )}
        </div>
      </div>
      <div style={{ font: '700 22px/1 Inter,sans-serif', color: '#23272d', marginTop: 10 }}>{metric.value}</div>
      <div style={{ font: '400 11px/1 Inter,sans-serif', color: '#9aa0a8', marginTop: 6 }}>{metric.prevLabel}</div>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 39 }} onClick={() => setOpen(false)} />
          <div className={motion.popInTop} style={{ position: 'absolute', left: 0, top: 34, width: 190, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 6, zIndex: 40, maxHeight: 260, overflowY: 'auto' }}>
            {options.map((o) => (
              <div
                key={o.id}
                onClick={() => { onChange(o.id); setOpen(false); }}
                style={{ padding: '8px 10px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, background: o.id === metric.id ? '#f9f7fc' : 'transparent' }}
                onMouseEnter={(e) => { if (o.id !== metric.id) e.currentTarget.style.background = '#fafbfd'; }}
                onMouseLeave={(e) => { if (o.id !== metric.id) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: o.color, flex: 'none' }} />
                <span style={{ font: '500 12px/1 Inter,sans-serif', color: o.id === metric.id ? '#5f3880' : '#3d434b' }}>{o.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function KpiWidgetBody({ widget, onConfigChange, onSplitKpiMetric, onEditKpiMember }: BodyProps) {
  const metricIds = kpiMetricIds(widget.config);
  const metrics = metricIds.map((id) => DASHBOARD_METRICS.find((m) => m.id === id) ?? DASHBOARD_METRICS[0]);
  return (
    <div style={{ display: 'flex', height: '100%', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden' }}>
      {metrics.map((metric, i) => (
        <div key={`${metric.id}-${i}`} style={{ display: 'flex', flex: 1, minWidth: 0 }}>
          {i > 0 && <span style={{ width: 1, background: '#eceef1', flex: 'none' }} />}
          <MetricMember
            metric={metric}
            options={DASHBOARD_METRICS}
            showRemove={metrics.length > 1}
            onChange={(id) => onConfigChange({ ...widget.config, metricIds: metricIds.map((mid, idx) => (idx === i ? id : mid)), metricId: undefined })}
            onRemove={() => onSplitKpiMetric?.(i)}
            onEditWithJiva={() => onEditKpiMember?.(i)}
          />
        </div>
      ))}
    </div>
  );
}

function ActivityWidgetBody() {
  return (
    <div className={scrollStyles.sleekScroll} style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 2 }}>
      {PLATFORM_CHANGE_TIMELINE.map((item, i) => (
        <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: '#fafbfd', border: '1px solid #f1f2f4' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: CATEGORY_COLORS[item.category], flex: 'none' }} />
            <span style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase' as const, color: CATEGORY_COLORS[item.category] }}>{item.category}</span>
            <span style={{ font: '400 10.5px/1 Inter,sans-serif', color: '#9aa0a8', marginLeft: 'auto' }}>{item.time}</span>
          </div>
          <div style={{ font: '600 12.5px/1.4 Inter,sans-serif', color: '#23272d', marginTop: 6 }}>{item.title}</div>
          <div style={{ font: '400 11.5px/1.5 Inter,sans-serif', color: '#6b7178', marginTop: 4 }}>{item.detail}</div>
          <div style={{ font: '600 11.5px/1.4 Inter,sans-serif', color: item.impactColor, marginTop: 6 }}>{item.impact}</div>
        </div>
      ))}
    </div>
  );
}

function AlertsWidgetBody() {
  const items = PROTOTYPE_ALERTS.filter((a) => a.day === 'today').sort((a, b) => (a.priority === b.priority ? 0 : a.priority === 'High' ? -1 : 1)).slice(0, 5);
  return (
    <div className={scrollStyles.sleekScroll} style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 2 }}>
      {items.map((a) => (
        <div key={a.id} style={{ padding: '10px 12px', borderRadius: 8, background: '#fafbfd', border: '1px solid #f1f2f4' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ padding: '2px 7px', borderRadius: 999, background: a.priority === 'High' ? '#fdecec' : a.priority === 'Medium' ? '#fdf3e8' : '#eef6f3', font: '700 9.5px/1.5 Inter,sans-serif', color: a.priority === 'High' ? '#b3453f' : a.priority === 'Medium' ? '#a8763f' : '#3f7d6a' }}>{a.priority}</span>
            <span style={{ font: '500 10.5px/1 Inter,sans-serif', color: '#9aa0a8' }}>{a.category}</span>
          </div>
          <div style={{ font: '600 12.5px/1.4 Inter,sans-serif', color: '#23272d', marginTop: 6 }}>{a.title}</div>
          <div style={{ font: '600 11.5px/1 Inter,sans-serif', color: a.valueNum < 0 ? '#b3453f' : '#3f7d6a', marginTop: 6 }}>{a.valueLabel}</div>
        </div>
      ))}
    </div>
  );
}

function ChannelsWidgetBody() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%', overflowY: 'auto' }}>
      {CHANNEL_HEALTH.map((c) => (
        <div key={c.name} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.9fr 1fr 1fr', gap: 14, alignItems: 'center', padding: '11px 13px', borderRadius: 8, background: '#fafbfd', border: '1px solid #f1f2f4' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ font: '600 12.5px/1.4 Inter,sans-serif', color: '#23272d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{c.name}</div>
            <div style={{ font: '400 10.5px/1.5 Inter,sans-serif', color: '#9aa0a8', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{c.status}</div>
          </div>
          <div>
            <div style={{ font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8' }}>Revenue</div>
            <div style={{ font: '600 12px/1.5 Inter,sans-serif', color: '#23272d' }}>{c.revenue} <span style={{ color: '#3f7d6a' }}>{c.delta}</span></div>
          </div>
          <div>
            <div style={{ font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8' }}>Efficiency</div>
            <div style={{ font: '600 12px/1.5 Inter,sans-serif', color: '#23272d' }}>{c.roas} ROAS · {c.acos} ACOS</div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8' }}>
              <span>Budget used</span><span style={{ fontWeight: 600, color: '#23272d' }}>{c.budget}%</span>
            </div>
            <div style={{ height: 5, borderRadius: 3, background: '#eceef1', marginTop: 5, overflow: 'hidden' }}>
              <div style={{ width: `${c.budget}%`, height: '100%', background: '#77469b', borderRadius: 3 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RecommendationsWidgetBody() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%', overflowY: 'auto' }}>
      {BRIEF_RECOMMENDATIONS.map((r) => (
        <div key={r.title} style={{ padding: '10px 12px', borderRadius: 8, background: '#fafbfd', border: '1px solid #f1f2f4' }}>
          <span style={{ padding: '2px 7px', borderRadius: 5, background: `${PRIORITY_COLORS[r.priority]}17`, font: '700 9.5px/1.5 Inter,sans-serif', color: PRIORITY_COLORS[r.priority] }}>{r.priority}</span>
          <div style={{ font: '600 12.5px/1.4 Inter,sans-serif', color: '#23272d', marginTop: 7 }}>{r.title}</div>
          <div style={{ font: '400 11.5px/1.5 Inter,sans-serif', color: '#6b7178', marginTop: 4 }}>{r.detail}</div>
        </div>
      ))}
    </div>
  );
}

const TODAY_ALERTS_FOR_SUMMARY = PROTOTYPE_ALERTS.filter((a) => a.day === 'today');

/** A plain written paragraph instead of a list — "the thing someone would wanna see first," told as one flowing morning briefing rather than itemized. */
function SummaryCardBody() {
  const critical = TODAY_ALERTS_FOR_SUMMARY.filter((a) => a.priority === 'High').length;
  const atRisk = TODAY_ALERTS_FOR_SUMMARY.filter((a) => a.valueNum < 0).reduce((sum, a) => sum + Math.abs(a.valueNum), 0);
  const resolved = JIVA_ACTIVITY.filter((j) => j.status === 'done').length;
  const pending = JIVA_ACTIVITY.filter((j) => j.status === 'needs-review').length;
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ font: '400 13px/1.75 Inter,sans-serif', color: '#3d434b' }}>
        Good morning — <strong style={{ color: '#23272d' }}>{TODAY_ALERTS_FOR_SUMMARY.length} alerts</strong> came in overnight, {critical} of them high priority, totaling <strong style={{ color: '#b3453f' }}>${atRisk.toLocaleString()}</strong> at risk across your accounts. Jiva already resolved {resolved} of them autonomously while you were away, with {pending} more drafted and waiting on your review. Catalog and profitability need the closest look today — everything else is trending in the right direction.
      </div>
    </div>
  );
}

/** The same "what happened today" story as the Platform activity / While-you-were-away feeds, but told as plain sentences instead of chip-and-category cards. */
function DailyRecapBody() {
  return (
    <div className={scrollStyles.sleekScroll} style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 11, paddingRight: 2 }}>
      {JIVA_ACTIVITY.map((j) => (
        <div key={j.id} style={{ font: '400 12.5px/1.6 Inter,sans-serif', color: '#3d434b' }}>
          <span style={{ font: '600 12.5px/1 Inter,sans-serif', color: '#9aa0a8' }}>{j.time} — </span>
          {j.label}. {j.detail}.
          {j.impact && <span style={{ font: '700 12px/1 Inter,sans-serif', color: j.impactColor || '#464646' }}> ({j.impact})</span>}
        </div>
      ))}
    </div>
  );
}

/** A short list of things to keep an eye on, each with a one-line plain-English reason — no $ chips, no priority pills, just the name and why it matters. */
function WatchlistBody() {
  const items = [
    ...TODAY_ALERTS_FOR_SUMMARY.filter((a) => a.priority === 'High').map((a) => ({ key: a.id, name: a.title, why: a.aiSummary ?? a.impactStr })),
    ...JIVA_ACTIVITY.filter((j) => j.status === 'needs-review').map((j) => ({ key: j.id, name: j.label, why: j.detail })),
  ].slice(0, 6);
  return (
    <div className={scrollStyles.sleekScroll} style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', paddingRight: 2 }}>
      {items.map((it, i) => (
        <div key={it.key} style={{ padding: '10px 0', borderTop: i === 0 ? 'none' : '1px solid #f1f2f4' }}>
          <div style={{ font: '600 12.5px/1.4 Inter,sans-serif', color: '#23272d' }}>{it.name}</div>
          <div style={{ font: '400 11.5px/1.5 Inter,sans-serif', color: '#6b7178', marginTop: 3 }}>{it.why}</div>
        </div>
      ))}
      {items.length === 0 && <div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#9aa0a8' }}>Nothing needs watching right now.</div>}
    </div>
  );
}

function TopMoversWidgetBody() {
  return (
    <div className={scrollStyles.sleekScroll} style={{ height: '100%', overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' as const, font: '400 11.5px/1.4 Inter,sans-serif' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #f1f2f4' }}>
            {['Name', 'Sales', 'Change'].map((h) => (
              <th key={h} style={{ textAlign: 'left' as const, padding: '0 8px 8px 0', font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: '#9aa0a8' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {BRIEF_TOP_MOVERS.map((m) => (
            <tr key={m.name} style={{ borderBottom: '1px solid #f6f7f8' }}>
              <td style={{ padding: '8px 8px 8px 0' }}>
                <div style={{ font: '600 12px/1.4 Inter,sans-serif', color: '#23272d' }}>{m.name}</div>
                <div style={{ font: '400 10.5px/1.5 Inter,sans-serif', color: '#9aa0a8' }}>{m.area}</div>
              </td>
              <td style={{ padding: '8px 8px 8px 0', color: '#23272d', fontWeight: 600, whiteSpace: 'nowrap' as const }}>{m.sales}</td>
              <td style={{ padding: '8px 0', color: m.change.startsWith('-') ? '#b3453f' : '#3f7d6a', fontWeight: 600, whiteSpace: 'nowrap' as const }}>{m.change}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const NOTE_TINTS = ['#fdf3e0', '#eef6f3', '#f1eefc', '#eaf2fd'];

function NoteWidgetBody({ widget, onConfigChange }: BodyProps) {
  const text = (widget.config.text as string) ?? '';
  const colorIndex = (widget.config.colorIndex as number) ?? 0;
  return (
    <textarea
      value={text}
      onChange={(e) => onConfigChange({ ...widget.config, text: e.target.value })}
      placeholder="Jot something down…"
      className={motion.focusRing}
      style={{ width: '100%', height: '100%', resize: 'none' as const, border: 'none', outline: 'none', background: NOTE_TINTS[colorIndex % NOTE_TINTS.length], borderRadius: 8, padding: 12, font: '400 12.5px/1.6 Inter,sans-serif', color: '#464646' }}
    />
  );
}

function ChecklistWidgetBody({ widget, onConfigChange }: BodyProps) {
  const tasks = (widget.config.tasks as { text: string; done: boolean }[]) ?? [];
  const [draft, setDraft] = useState('');

  const addTask = () => {
    if (!draft.trim()) return;
    onConfigChange({ ...widget.config, tasks: [...tasks, { text: draft.trim(), done: false }] });
    setDraft('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 8 }}>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {tasks.map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => onConfigChange({ ...widget.config, tasks: tasks.map((x, idx) => (idx === i ? { ...x, done: !x.done } : x)) })}
              style={{ accentColor: '#77469b', flex: 'none' }}
            />
            <span style={{ flex: 1, font: '400 12px/1.4 Inter,sans-serif', color: t.done ? '#c7cad1' : '#3d434b', textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
            <span onClick={() => onConfigChange({ ...widget.config, tasks: tasks.filter((_, idx) => idx !== i) })} className={motion.pressable} style={{ display: 'flex', cursor: 'pointer', opacity: 0.6 }}>
              <TrashIcon size={11} />
            </span>
          </div>
        ))}
        {tasks.length === 0 && <div style={{ font: '400 11.5px/1.5 Inter,sans-serif', color: '#c7cad1' }}>No tasks yet — add one below.</div>}
      </div>
      <div style={{ display: 'flex', gap: 6, flex: 'none' }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a task…"
          className={motion.focusRing}
          style={{ flex: 1, minWidth: 0, padding: '6px 9px', border: '1px solid #dfe3ea', borderRadius: 6, font: '400 11.5px/1 Inter,sans-serif', color: '#3d434b', outline: 'none' }}
        />
        <span onClick={addTask} className={motion.pressable} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: 6, background: '#77469b', cursor: 'pointer', flex: 'none' }}>
          <PlusIcon size={11} />
        </span>
      </div>
    </div>
  );
}

export function WidgetBody({ widget, onConfigChange, onLegacyKpiExpand, onSplitKpiMetric, onEditKpiMember, onEditSeries, onOpenAiSheet }: BodyProps) {
  if (isChartSeriesKind(widget.kind)) {
    return (
      <ChartSeriesBody
        kind={widget.kind}
        config={widget.config}
        onCustomize={() => onOpenAiSheet?.()}
        onEditSeries={(seriesId) => onEditSeries?.(seriesId)}
      />
    );
  }
  switch (widget.kind) {
    case 'legacyKpiRow': return <LegacyKpiRow onExpandedChange={onLegacyKpiExpand} />;
    case 'legacyActivity': return <LegacyActivityBody />;
    case 'kpi':
    case 'metricRow':
      return <KpiWidgetBody widget={widget} onConfigChange={onConfigChange} onSplitKpiMetric={onSplitKpiMetric} onEditKpiMember={onEditKpiMember} />;
    case 'revenueTrend': return <RevenueTrendChart />;
    case 'efficiency': return <EfficiencyChart />;
    case 'spendSales': return <SpendSalesChart />;
    case 'actionMix':
      return (
        <div style={{ display: 'flex', gap: 12, height: '100%', alignItems: 'center' }}>
          <div style={{ flex: '0 0 44%', height: '100%' }}><ActionMixChart /></div>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {ACTION_MIX.map((s, i) => (
              <div key={s.source} style={{ display: 'flex', alignItems: 'center', gap: 6, font: '500 10.5px/1.4 Inter,sans-serif', color: '#6b7178' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: ['#77469b', '#2f6fed', '#a8763f', '#3f7d6a', '#b3453f'][i % 5], flex: 'none' }} />
                <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{s.source}</span>
                <span style={{ font: '700 10.5px/1 Inter,sans-serif', color: '#23272d' }}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      );
    case 'dayparting': return <DaypartingChart />;
    case 'keywordFunnel': return <KeywordFunnelChart />;
    case 'activity': return <ActivityWidgetBody />;
    case 'alerts': return <AlertsWidgetBody />;
    case 'channels': return <ChannelsWidgetBody />;
    case 'recommendations': return <RecommendationsWidgetBody />;
    case 'summaryCard': return <SummaryCardBody />;
    case 'dailyRecap': return <DailyRecapBody />;
    case 'watchlist': return <WatchlistBody />;
    case 'topMovers': return <TopMoversWidgetBody />;
    case 'note': return <NoteWidgetBody widget={widget} onConfigChange={onConfigChange} />;
    case 'checklist': return <ChecklistWidgetBody widget={widget} onConfigChange={onConfigChange} />;
    default: return null;
  }
}
