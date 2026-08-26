import { useMemo } from 'react';
import { CalendarBlank, ArrowLeft } from '@phosphor-icons/react';
import type { Decision } from '@/constants/signals/decisions.constants';
import { formatValue } from '@/utils/signals/valueFormat';
import { SourcePill } from './chips/source-pill';

interface Props {
  bundleId: string;
  bundleTitle: string;
  all: Decision[];
  onOpen: (id: string) => void;
  onBack?: () => void;
}

export function MeetingReviewView({ bundleId, bundleTitle, all, onOpen }: Props) {
  const alerts = useMemo(() => all.filter((d) => d.meetingRef?.bundleId === bundleId), [all, bundleId]);
  const totalCents = alerts.reduce((n, d) => n + (d.valueKind === 'info' ? 0 : Math.abs(d.valueCents)), 0);
  const totalStr = formatValue({ cents: totalCents, kind: 'gain' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <section style={{ borderRadius: 12, border: '1px solid #e1e4e8', background: 'linear-gradient(135deg, #fff, rgba(119,70,155,0.03))', padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 8,
                border: 'none',
                background: 'transparent',
                color: '#7c7c7c',
                cursor: 'pointer',
                transition: 'all 0.12s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(119,70,155,0.08)'; e.currentTarget.style.color = '#77469b'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#7c7c7c'; }}
              aria-label="Back to meetings"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', fontWeight: 600, color: '#7c7c7c', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <CalendarBlank size={12} /> Meeting
          </div>
        </div>
        <h2 style={{ marginTop: 6, fontSize: '2rem', fontWeight: 600, color: '#23272d', lineHeight: 1.2 }}>{bundleTitle}</h2>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 16, fontSize: '1.05rem', color: '#7c7c7c' }}>
          <span><span style={{ fontWeight: 500, color: '#474747' }}>{alerts.length}</span> alerts generated</span>
          {totalCents > 0 && <span><span style={{ fontWeight: 500, color: '#429488' }}>{totalStr.text}</span> aggregate impact</span>}
        </div>
      </section>

      <section>
        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#7c7c7c', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          Alerts from this meeting
        </div>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, borderRadius: 8, border: '1px solid #e1e4e8', background: '#fff', overflow: 'hidden' }}>
          {alerts.map((d) => {
            const val = formatValue({ cents: d.valueCents, kind: d.valueKind, cadence: d.cadence });
            return (
              <li
                key={d.id}
                onClick={() => onOpen(d.id)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '110px 1fr auto',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #e1e4e8',
                  transition: 'background 0.12s',
                }}
              >
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  fontFamily: '\'Inter\', sans-serif',
                  color: d.valueKind === 'gain' ? '#429488' : d.valueKind === 'cost' ? '#f1a03a' : d.valueKind === 'at_risk' ? '#d97706' : '#23272d',
                }}>
                  {val.text}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '1.1rem', color: '#474747', lineClamp: 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.insight}</div>
                  <div style={{ marginTop: 4 }}><SourcePill decision={d} /></div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#7c7c7c' }}>{d.actionVerb} →</div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}