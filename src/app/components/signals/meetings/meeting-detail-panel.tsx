import { PROTOTYPE_ALERTS } from '@/constants/signals/prototype-data';

interface Props {
  meetingId: string | null;
  onOpenAlert: (id: string) => void;
  onPrepare: () => void;
  onBack: () => void;
  onOpenMOM: () => void;
}

export function MeetingDetailPanel({ meetingId, onOpenAlert, onPrepare, onOpenMOM }: Props) {
  const linkedAlerts = PROTOTYPE_ALERTS.filter((a) => a.hasMeeting);

  return (
    <div style={{ flex: 1, minWidth: 0, height: '100%', overflowY: 'auto', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10 }}>
      {/* Header */}
      <div style={{ padding: '22px 24px', borderBottom: '1px solid #f1f2f4' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>Today, 1 November · 10:30 – 11:15 · in two hours</div>
            <div style={{ font: '600 21px/1.35 Inter,sans-serif', color: '#23272d', marginTop: 9 }}>Nutrabay · Weekly performance review</div>
            <div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 6 }}>Rahul Gupta, Head of Ecommerce · Sneha Iyer, Brand Manager · last met 25 October</div>
          </div>
          <div style={{ flex: 'none', textAlign: 'right' }}>
            <div style={{ font: '600 22px/1 Inter,sans-serif', color: '#23272d' }}>55%</div>
            <div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178', marginTop: 5 }}>of linked work resolved</div>
            <div style={{ width: 130, height: 4, borderRadius: 2, background: '#f1f2f4', marginTop: 9, overflow: 'hidden' }}>
              <div style={{ width: '55%', height: '100%', background: '#a8763f' }} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 9, marginTop: 16 }}>
          <span onClick={onPrepare} style={{ padding: '11px 17px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 13px/1 Inter,sans-serif', cursor: 'pointer' }}>Prepare for meeting</span>
          <span style={{ padding: '11px 17px', borderRadius: 7, border: '1px solid #dfe3ea', font: '600 13px/1 Inter,sans-serif', color: '#3d434b' }}>Attach an alert</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Agenda + Account study */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#e6e8ec', border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ background: '#fff', padding: 16 }}>
            <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Agenda</div>
            <div style={{ font: '400 13px/1.75 Inter,sans-serif', color: '#464646', marginTop: 9 }}>Weekly trading review covering October close, the content incident on the hero range, and Q4 promo readiness. Rahul has asked for a view on margin against the 18% target before the board pack goes out on 8 November.</div>
          </div>
          <div style={{ background: '#fff', padding: 16 }}>
            <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Account study</div>
            <div style={{ font: '400 13px/1.75 Inter,sans-serif', color: '#464646', marginTop: 9 }}>GMV is up 6.2% month on month and ROAS is holding at 4.8 against a 4.5 target. Margin is the weak line at 16.4%, held back mostly by the content incident. The relationship is healthy; the recurring PIM overwrite is the one friction point worth naming today.</div>
          </div>
        </div>

        {/* Metrics */}
        <div>
          <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Important metric changes</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: '#e6e8ec', border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden', marginTop: 11 }}>
            <MetricCard label="GMV" value="$412k" change="up 6.2%" changeColor="#3f7d6a" />
            <MetricCard label="Net margin" value="16.4%" change="up 0.9 pt" changeColor="#3f7d6a" />
            <MetricCard label="ROAS" value="4.8" change="flat" changeColor="#6b7178" />
            <MetricCard label="Conversion" value="6.4%" change="down 2.7 pt" changeColor="#b3453f" />
          </div>
        </div>

        {/* Linked alerts */}
        <div style={{ border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '13px 16px', borderBottom: '1px solid #f1f2f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ font: '600 13px/1 Inter,sans-serif', color: '#23272d' }}>Linked alerts</span>
            <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>4 mapped to this meeting</span>
          </div>
          {linkedAlerts.map((al, i) => (
            <div key={al.id} onClick={() => onOpenAlert(al.id)} style={{ padding: '13px 16px', borderBottom: i < linkedAlerts.length - 1 ? '1px solid #f1f2f4' : 'none', display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: al.priorityDot, flex: 'none' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: '500 13px/1.4 Inter,sans-serif', color: '#23272d' }}>{al.title}</div>
                <div style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#6b7178', marginTop: 3 }}>{al.impactStr}</div>
              </div>
              <span style={{ font: '600 13px/1 Inter,sans-serif', color: al.valueNum < 0 ? '#b3453f' : '#3f7d6a', flex: 'none' }}>{al.valueLabel}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, change, changeColor }: { label: string; value: string; change: string; changeColor: string }) {
  return (
    <div style={{ background: '#fff', padding: 15 }}>
      <div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{label}</div>
      <div style={{ font: '600 18px/1 Inter,sans-serif', color: '#23272d', marginTop: 8 }}>{value}</div>
      <div style={{ font: '500 11px/1 Inter,sans-serif', color: changeColor, marginTop: 6 }}>{change}</div>
    </div>
  );
}
