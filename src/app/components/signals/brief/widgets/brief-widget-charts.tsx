import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ACTION_MIX, BRIEF_HOURLY_SERIES, BRIEF_TREND_SERIES, KEYWORD_FUNNEL } from '@/constants/signals/prototype-data';

const AXIS_STYLE = { fontSize: 10.5, fill: '#9aa0a8', fontFamily: 'Inter,sans-serif' };

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

export interface DonutDatum { label: string; value: number; color: string }

/** The exact pie recipe Action Mix uses (innerRadius/outerRadius/paddingAngle/stroke/motion) — reused wherever else a donut breakdown is needed so they all look and animate identically. `activeIndex` dims every slice but one, for a chart that cross-highlights with a list/table hovered elsewhere. */
export function DonutChart({ data, innerRadius = '52%', outerRadius = '82%', activeIndex, onSliceHover }: { data: DonutDatum[]; innerRadius?: string; outerRadius?: string; activeIndex?: number | null; onSliceHover?: (index: number | null) => void }) {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={90}>
      <PieChart>
        <Tooltip content={<BriefTooltip />} />
        <Pie
          data={data} dataKey="value" nameKey="label" innerRadius={innerRadius} outerRadius={outerRadius} paddingAngle={3}
          onMouseEnter={(_, index) => onSliceHover?.(index)} onMouseLeave={() => onSliceHover?.(null)}
        >
          {data.map((entry, index) => (
            <Cell key={entry.label} fill={entry.color} stroke="#fff" strokeWidth={1} opacity={activeIndex == null || activeIndex === index ? 1 : 0.35} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export function RevenueTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={90}>
      <AreaChart data={BRIEF_TREND_SERIES} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="brief-rev-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#77469b" stopOpacity={0.22} />
            <stop offset="100%" stopColor="#77469b" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="brief-ads-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3f7d6a" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#3f7d6a" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#f1f2f4" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={AXIS_STYLE} />
        <YAxis hide />
        <Tooltip content={<BriefTooltip />} />
        <Area type="monotone" dataKey="revenue" name="Revenue ($K)" stroke="#77469b" strokeWidth={2} fill="url(#brief-rev-grad)" />
        <Area type="monotone" dataKey="adSales" name="Ad sales ($K)" stroke="#3f7d6a" strokeWidth={2} fill="url(#brief-ads-grad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SpendSalesChart() {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={90}>
      <BarChart data={BRIEF_TREND_SERIES} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#f1f2f4" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={AXIS_STYLE} />
        <YAxis hide />
        <Tooltip content={<BriefTooltip />} cursor={{ fill: '#fafbfd' }} />
        <Bar dataKey="adSales" name="Ad sales ($K)" fill="#3f7d6a" radius={[5, 5, 0, 0]} />
        <Bar dataKey="spend" name="Spend ($K)" fill="#a8763f" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function EfficiencyChart() {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={90}>
      <LineChart data={BRIEF_TREND_SERIES} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#f1f2f4" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={AXIS_STYLE} />
        <YAxis hide />
        <Tooltip content={<BriefTooltip />} />
        <Line type="monotone" dataKey="roas" name="ROAS" stroke="#77469b" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="acos" name="ACOS %" stroke="#b3453f" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function DaypartingChart() {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={90}>
      <AreaChart data={BRIEF_HOURLY_SERIES} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="brief-hr-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2f6fed" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#2f6fed" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#f1f2f4" />
        <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={AXIS_STYLE} />
        <YAxis hide />
        <Tooltip content={<BriefTooltip />} />
        <Area type="monotone" dataKey="revenue" name="Revenue ($K)" stroke="#2f6fed" strokeWidth={2} fill="url(#brief-hr-grad)" />
        <Line type="monotone" dataKey="spend" name="Spend ($K)" stroke="#a8763f" strokeWidth={2} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function KeywordFunnelChart() {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={90}>
      <BarChart data={KEYWORD_FUNNEL} layout="vertical" margin={{ left: 8, right: 20, top: 8, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke="#f1f2f4" />
        <XAxis type="number" hide />
        <YAxis dataKey="stage" type="category" tickLine={false} axisLine={false} width={76} tick={AXIS_STYLE} />
        <Tooltip content={<BriefTooltip />} cursor={{ fill: '#fafbfd' }} />
        <Bar dataKey="terms" name="Terms" fill="#7c4dff" radius={[0, 5, 5, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export const ACTION_COLORS = ['#77469b', '#2f6fed', '#a8763f', '#3f7d6a', '#b3453f'];

export function ActionMixChart() {
  const data: DonutDatum[] = ACTION_MIX.map((entry, index) => ({ label: entry.source, value: entry.count, color: ACTION_COLORS[index % ACTION_COLORS.length] }));
  return <DonutChart data={data} />;
}
