import { useMemo, useState } from 'react';
import { ACCOUNT_GOALS, ACTION_HISTORY, DASHBOARD_METRICS, ENGAGEMENT_STREAK } from '@/constants/signals/prototype-data';
import { MetricCard } from './metric-card';
import motion from '../alerts/motion.module.scss';

const DEFAULT_CARD_METRIC_IDS = ['ad-spend', 'ad-sales', 'ad-units', 'roas', 'impressions'];

function seededSeries(seed: string, points = 14): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const out: number[] = [];
  let v = 0.5;
  for (let i = 0; i < points; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    const drift = ((h % 1000) / 1000 - 0.5) * 0.3;
    v = Math.min(1, Math.max(0.08, v + drift));
    out.push(v);
  }
  return out;
}

function Sparkline({ color, seed }: { color: string; seed: string }) {
  const points = useMemo(() => seededSeries(seed), [seed]);
  const w = 560;
  const h = 70;
  const step = w / (points.length - 1);
  const coords = points.map((v, i) => `${(i * step).toFixed(1)},${(h - v * h).toFixed(1)}`);
  const linePath = `M${coords.join(' L')}`;
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;
  const gradId = `spark-${seed}`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function BriefDashboard() {
  const [cardMetricIds, setCardMetricIds] = useState<string[]>(DEFAULT_CARD_METRIC_IDS);
  const [trendMetricId, setTrendMetricId] = useState('ad-sales');

  const cardMetrics = cardMetricIds.map((id) => DASHBOARD_METRICS.find((m) => m.id === id)!).filter(Boolean);
  const trendMetric = DASHBOARD_METRICS.find((m) => m.id === trendMetricId) ?? DASHBOARD_METRICS[0];
  const streakActiveCount = ENGAGEMENT_STREAK.filter((d) => d.active).length;

  return (
    <div style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, paddingRight: 4 }}>
      {/* Tiny streak strip — intentionally minimal, nothing more than the count and a mini bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
        <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#9aa0a8' }}>{streakActiveCount}-day streak</span>
        <div style={{ display: 'flex', gap: 2 }}>
          {ENGAGEMENT_STREAK.map((d, i) => (
            <span key={i} style={{ width: 6, height: 12, borderRadius: 2, background: d.active ? '#77469b' : '#e6e8ec' }} />
          ))}
        </div>
      </div>

      {/* KPI row — each card's metric is independently reassignable */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cardMetrics.length},1fr)`, gap: 10 }}>
        {cardMetrics.map((m, i) => (
          <MetricCard
            key={m.id + i}
            metric={m}
            options={DASHBOARD_METRICS}
            onChange={(id) => setCardMetricIds((prev) => prev.map((existing, idx) => (idx === i ? id : existing)))}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 14, flex: 1, minHeight: 0 }}>
        {/* Left: trend chart + account goals */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ font: '600 13px/1 Inter,sans-serif', color: '#23272d' }}>14-day trend</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {DASHBOARD_METRICS.slice(0, 5).map((m) => (
                  <span
                    key={m.id}
                    onClick={() => setTrendMetricId(m.id)}
                    className={motion.pressable}
                    style={{ padding: '4px 9px', borderRadius: 6, cursor: 'pointer', font: '600 10.5px/1 Inter,sans-serif', color: trendMetricId === m.id ? '#fff' : '#6b7178', background: trendMetricId === m.id ? m.color : '#f1f2f4', transition: 'background 140ms ease-out, color 140ms ease-out' }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 14 }}>
              <span style={{ font: '700 26px/1 Inter,sans-serif', color: '#23272d' }}>{trendMetric.value}</span>
              <span style={{ font: '600 12px/1 Inter,sans-serif', color: trendMetric.trendUp ? '#3f7d6a' : '#b3453f' }}>{trendMetric.trendUp ? '↑' : '↓'} {trendMetric.trend} vs prior 14 days</span>
            </div>
            <div style={{ marginTop: 10 }}>
              <Sparkline color={trendMetric.color} seed={trendMetric.id} />
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, padding: 18, flex: 1, minHeight: 0, overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <span style={{ font: '600 13px/1 Inter,sans-serif', color: '#23272d' }}>Account goals</span>
              <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>From configuration</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15, marginTop: 15 }}>
              {ACCOUNT_GOALS.map((g, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', font: '500 12px/1.4 Inter,sans-serif', color: '#464646' }}>
                    <span>{g.label}</span>
                    <span style={{ color: g.color }}>{g.current} of {g.target}</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: '#f1f2f4', marginTop: 8, overflow: 'hidden' }}>
                    <div style={{ width: `${g.pct}%`, height: '100%', background: g.color }} />
                  </div>
                  <div style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#6b7178', marginTop: 6 }}>{g.meta}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: recent actions & impact */}
        <div style={{ flex: '0 0 34%', maxWidth: '34%', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f2f4', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flex: 'none' }}>
            <span style={{ font: '600 13px/1 Inter,sans-serif', color: '#23272d' }}>Recent actions & impact</span>
            <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{ACTION_HISTORY.length} this month</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {ACTION_HISTORY.map((a, i) => (
              <div key={i} style={{ padding: '14px 18px', borderBottom: i < ACTION_HISTORY.length - 1 ? '1px solid #f1f2f4' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: a.dotColor, flex: 'none' }} />
                  <span style={{ flex: 1, font: '500 13px/1.4 Inter,sans-serif', color: '#464646' }}>{a.label}</span>
                  <span style={{ font: '600 12px/1 Inter,sans-serif', color: a.impactColor, fontStyle: a.impactStyle }}>{a.impact}</span>
                </div>
                <div style={{ font: '400 11px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 5 }}>{a.meta}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
