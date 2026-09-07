import { BRIEFING_ALERTS } from '@/constants/signals/prototype-data';

interface Props {
  onAlertClick: (id: string) => void;
}

function formatHeaderDate(): string {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
}

function formatHeaderTime(): string {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'AM' : 'PM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

export function BriefNoIntegration({ onAlertClick }: Props) {
  return (
    <div style={{ height: '100%', display: 'flex', gap: 16 }}>
      <div style={{ flex: 1, minWidth: 0, height: '100%', overflowY: 'auto', paddingRight: 4, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: 'transparent', padding: '20px 22px' }}>
          <div style={{ font: '400 12px/1 Inter,sans-serif', color: '#6b7178' }}>{formatHeaderDate()} · {formatHeaderTime()}</div>
          <div style={{ font: '600 19px/1.4 Inter,sans-serif', color: '#23272d', marginTop: 9 }}>Three alerts need you. $18,420 at risk across two accounts.</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'transparent', borderRadius: 8, overflow: 'hidden', marginTop: 16 }}>
            <div style={{ background: 'transparent', padding: 14 }}><div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>Critical alerts</div><div style={{ font: '600 20px/1 Inter,sans-serif', color: '#23272d', marginTop: 8 }}>3</div></div>
            <div style={{ background: 'transparent', padding: 14 }}><div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>At risk</div><div style={{ font: '600 20px/1 Inter,sans-serif', color: '#b3453f', marginTop: 8 }}>$18,420</div></div>
            <div style={{ background: 'transparent', padding: 14 }}><div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>Verified gain</div><div style={{ font: '600 20px/1 Inter,sans-serif', color: '#3f7d6a', marginTop: 8 }}>$6,200</div></div>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden', flex: 'none' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f2f4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ font: '600 13px/1 Inter,sans-serif', color: '#23272d' }}>Top alerts</span>
            <span style={{ font: '600 12px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>View all 12</span>
          </div>
          {BRIEFING_ALERTS.filter((a) => a.valueLabel !== 'no impact measured').map((a) => (
            <div key={a.id} onClick={() => onAlertClick(a.id)} style={{ padding: '14px 18px', borderBottom: '1px solid #f1f2f4', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: a.dotColor, flex: 'none' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: `${a.id === 'a1' ? '600' : '500'} 13px/1.45 Inter,sans-serif`, color: '#23272d' }}>{a.title}</div>
                <div style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#6b7178', marginTop: 3 }}>{a.meta}</div>
              </div>
              <span style={{ font: '600 13px/1 Inter,sans-serif', color: a.valueNum < 0 ? '#b3453f' : '#3f7d6a', flex: 'none' }}>{a.valueLabel}</span>
              <span style={{ padding: '7px 12px', border: '1px solid #dfe3ea', borderRadius: 6, font: '600 11px/1 Inter,sans-serif', color: '#3d434b', flex: 'none' }}>{a.actionLabel}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: '0 0 38%', maxWidth: '38%', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: '#fff', border: '1px dashed #cfd4dc', borderRadius: 10, padding: 20 }}>
          <div style={{ font: '600 13px/1.4 Inter,sans-serif', color: '#23272d' }}>Meetings are switched off</div>
          <div style={{ font: '400 12px/1.7 Inter,sans-serif', color: '#6b7178', marginTop: 8 }}>Connect a calendar and the meeting bot and Signals will club these alerts under the call they belong to, prepare the deck, and write the minutes afterwards.</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', border: '1px solid #e6e8ec', borderRadius: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#c8ccd2' }} />
              <span style={{ flex: 1, font: '500 12px/1.4 Inter,sans-serif', color: '#464646' }}>Google Calendar</span>
              <span style={{ padding: '7px 12px', borderRadius: 6, background: '#77469b', color: '#fff', font: '600 11px/1 Inter,sans-serif' }}>Connect</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', border: '1px solid #e6e8ec', borderRadius: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#c8ccd2' }} />
              <span style={{ flex: 1, font: '500 12px/1.4 Inter,sans-serif', color: '#464646' }}>Meeting bot</span>
              <span style={{ padding: '7px 12px', borderRadius: 6, border: '1px solid #dfe3ea', font: '600 11px/1 Inter,sans-serif', color: '#3d434b' }}>Connect</span>
            </div>
          </div>
          <div style={{ font: '400 11px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 12 }}>Alerts, actions and goals work fully without either.</div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, padding: 18 }}>
          <div style={{ font: '600 13px/1 Inter,sans-serif', color: '#23272d' }}>Account goals</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15, marginTop: 15 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', font: '500 12px/1.4 Inter,sans-serif', color: '#464646' }}><span>Net margin</span><span style={{ color: '#3f7d6a' }}>16.4% of 18%</span></div>
              <div style={{ height: 5, borderRadius: 3, background: '#f1f2f4', marginTop: 8, overflow: 'hidden' }}><div style={{ width: '73%', height: '100%', background: '#3f7d6a' }} /></div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', font: '500 12px/1.4 Inter,sans-serif', color: '#464646' }}><span>Quarterly GMV</span><span style={{ color: '#a8763f' }}>$1.7M of $2.4M</span></div>
              <div style={{ height: 5, borderRadius: 3, background: '#f1f2f4', marginTop: 8, overflow: 'hidden' }}><div style={{ width: '58%', height: '100%', background: '#a8763f' }} /></div>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ font: '600 13px/1 Inter,sans-serif', color: '#23272d' }}>Your engagement</span>
            <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>Private to you</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
            <span style={{ font: '600 24px/1 Inter,sans-serif', color: '#23272d' }}>9 days</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {[true, true, true, false, true, true, false].map((active, i) => (
                <span key={i} style={{ width: 13, height: 22, borderRadius: 3, background: active ? '#77469b' : i === 3 ? '#e0d5ec' : '#f1f2f4' }} />
              ))}
            </div>
          </div>
          <div style={{ font: '400 11px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 10 }}>Resolve one alert today to keep it going.</div>
        </div>
      </div>
    </div>
  );
}
