import { useState } from 'react';
import type { DashboardMetric } from '@/constants/signals/prototype-data';
import { ChevronDownIcon } from '../alerts/icons';
import motion from '../alerts/motion.module.scss';

interface Props {
  metric: DashboardMetric;
  options: DashboardMetric[];
  onChange: (id: string) => void;
}

/** A KPI card whose metric the user can reassign via a small dropdown — colored left accent, value, trend pill, prev-7-days line. */
export function MetricCard({ metric, options, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative', background: '#fff', border: '1px solid #e6e8ec', borderLeft: `3px solid ${metric.color}`, borderRadius: 8, padding: '14px 16px' }}>
      <div key={metric.id} className={motion.contentFadeIn}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            onClick={() => setOpen((v) => !v)}
            className={motion.pressable}
            style={{ display: 'flex', alignItems: 'center', gap: 4, font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: '#6b7178', cursor: 'pointer' }}
          >
            {metric.label} <ChevronDownIcon size={8} />
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '2px 7px', borderRadius: 10, background: metric.trendUp ? '#eef6f3' : '#fbf1ef', font: '600 10px/1 Inter,sans-serif', color: metric.trendUp ? '#3f7d6a' : '#b3453f' }}>
            {metric.trendUp ? '↑' : '↓'} {metric.trend}
          </span>
        </div>
        <div style={{ font: '700 22px/1 Inter,sans-serif', color: '#23272d', marginTop: 10 }}>{metric.value}</div>
        <div style={{ font: '400 11px/1 Inter,sans-serif', color: '#9aa0a8', marginTop: 6 }}>{metric.prevLabel}</div>
      </div>

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
