import { BRIEFING_ALERTS, BRIEFING_MEETINGS, ACCOUNT_GOALS, ENGAGEMENT_STREAK } from '@/constants/signals/prototype-data';
import type { PrototypeAlert } from '@/constants/signals/prototype-data';
import { PROTOTYPE_ALERTS } from '@/constants/signals/prototype-data';

interface Props {
  onAlertClick: (id: string) => void;
  onMeetingClick: () => void;
  subScreen: 'main' | 'nudge';
  onNudgeOpen: () => void;
  onNudgeClose: () => void;
  onScopeChange: () => void;
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

export function BriefFull({ onAlertClick, onMeetingClick, subScreen, onNudgeOpen, onNudgeClose }: Props) {
  return (
    <div style={{ height: '100%', display: 'flex', gap: 16 }}>
      {/* Left column */}
      <div style={{ flex: 1, minWidth: 0, height: '100%', overflowY: 'auto', paddingRight: 4, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Summary card */}
        <div style={{ background: 'transparent', padding: '20px 22px' }}>
          <div style={{ font: '400 12px/1 Inter,sans-serif', color: '#6b7178' }}>{formatHeaderDate()} · {formatHeaderTime()}</div>
          <div style={{ font: '600 19px/1.4 Inter,sans-serif', color: '#23272d', marginTop: 9 }}>Three things need you before 11, and $18,420 is sitting on them.</div>

          {/* 4-column stat grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'transparent', borderRadius: 8, overflow: 'hidden', marginTop: 16 }}>
            <StatCell topBorder="#b3453f" label="Critical alerts" icon={<svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#b3453f" strokeWidth="1.4" /><path d="M8 5v3.5l2 1.2" stroke="#b3453f" strokeWidth="1.4" strokeLinecap="round" /></svg>} value="3" sub="of 12 today" />
            <StatCell topBorder="#b3453f" label="At risk" icon={<svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 13l4-5 3 3 5-7" stroke="#b3453f" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>} value="$18,420" valueColor="#b3453f" sub="30-day window" />
            <StatCell topBorder="#3f7d6a" label="Verified gain" icon={<svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3 3 7-7" stroke="#3f7d6a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>} value="$6,200" valueColor="#3f7d6a" sub="this week" />
            <StatCell topBorder="#77469b" label="Meetings today" icon={<svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10.5" rx="1.5" stroke="#77469b" strokeWidth="1.4" /><path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" stroke="#77469b" strokeWidth="1.4" strokeLinecap="round" /></svg>} value="3" sub="1 unprepared" />
          </div>

          {/* 5-column stat grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 1, background: 'transparent', borderRadius: 8, overflow: 'hidden', marginTop: 10 }}>
            <MiniStat label="Opportunities" value="$9,400" valueColor="#a8763f" sub="2 open" />
            <MiniStat label="Actions in flight" value="2" sub="running now" />
            <MiniStat label="Applied this week" value="6" valueColor="#3f7d6a" sub="verified & unverified" />
            <MiniStat label="Repeat alerts" value="1" valueColor="#b3453f" sub="3rd day running" />
            <MiniStat label="Avg. time to act" value="2.4h" sub="last 7 days" />
          </div>
        </div>

        {/* Top alerts */}
        <CardSection
          title="Top alerts"
          titleIcon={<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1.5L9.8 5.6l4.4.4-3.3 3 1 4.3L8 11.1l-3.9 2.2 1-4.3-3.3-3 4.4-.4L8 1.5Z" stroke="#77469b" strokeWidth="1.2" strokeLinejoin="round" /></svg>}
          actionLabel="View all 12"
          actionColor="#77469b"
        >
          {BRIEFING_ALERTS.map((a) => (
            <div key={a.id} onClick={() => a.id !== 'a-bb' && onAlertClick(a.id)} style={{ padding: '14px 18px', borderBottom: '1px solid #f1f2f4', display: 'flex', alignItems: 'center', gap: 14, cursor: a.id !== 'a-bb' ? 'pointer' : 'default' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: a.dotColor, flex: 'none' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: `${a.id === 'a1' ? '600' : '500'} 13px/1.45 Inter,sans-serif`, color: '#23272d' }}>{a.title}</div>
                <div style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#6b7178', marginTop: 3 }}>{a.meta}</div>
              </div>
              {a.valueLabel !== 'no impact measured' ? (
                <span style={{ font: '600 13px/1 Inter,sans-serif', color: a.valueNum < 0 ? '#b3453f' : '#3f7d6a', flex: 'none' }}>{a.valueLabel}</span>
              ) : (
                <span style={{ font: '400 12px/1 Inter,sans-serif', color: '#6b7178', flex: 'none' }}>{a.valueLabel}</span>
              )}
              {a.actionLabel && (
                <span style={{ padding: '7px 12px', border: '1px solid #dfe3ea', borderRadius: 6, font: '600 11px/1 Inter,sans-serif', color: '#3d434b', flex: 'none' }}>{a.actionLabel}</span>
              )}
            </div>
          ))}
        </CardSection>

        {/* Today's meetings */}
        <CardSection
          title="Today's meetings"
          titleIcon={<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10.5" rx="1.5" stroke="#77469b" strokeWidth="1.3" /><path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" stroke="#77469b" strokeWidth="1.3" strokeLinecap="round" /></svg>}
          actionLabel="All meetings"
          actionColor="#77469b"
          onAction={onMeetingClick}
        >
          {BRIEFING_MEETINGS.map((m, i) => (
            <div key={i} onClick={m.actionStyle === 'primary' ? onMeetingClick : undefined} style={{ padding: '15px 18px', borderBottom: i < BRIEFING_MEETINGS.length - 1 ? '1px solid #f1f2f4' : 'none', display: 'flex', alignItems: 'center', gap: 16, cursor: m.actionStyle === 'primary' ? 'pointer' : 'default' }}>
              <span style={{ font: '600 12px/1 Inter,sans-serif', color: m.actionStyle === 'muted' ? '#6b7178' : '#464646', width: 44, flex: 'none' }}>{m.time}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: `${m.actionStyle === 'primary' ? '600' : '500'} 13px/1.45 Inter,sans-serif`, color: m.actionStyle === 'muted' ? '#6b7178' : '#23272d' }}>{m.title}</div>
                <div style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#6b7178', marginTop: 3 }}>{m.meta}</div>
                {m.progress !== undefined && (
                  <div style={{ height: 3, borderRadius: 2, background: '#f1f2f4', marginTop: 8, overflow: 'hidden' }}>
                    <div style={{ width: `${m.progress}%`, height: '100%', background: m.progressColor }} />
                  </div>
                )}
              </div>
              {m.actionStyle === 'primary' && (
                <span style={{ padding: '8px 13px', borderRadius: 6, background: '#77469b', color: '#fff', font: '600 11px/1 Inter,sans-serif', flex: 'none' }}>{m.actionLabel}</span>
              )}
              {m.actionStyle === 'ready' && (
                <span style={{ font: '500 11px/1 Inter,sans-serif', color: '#3f7d6a', flex: 'none' }}>{m.actionLabel}</span>
              )}
              {m.actionStyle === 'muted' && (
                <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178', flex: 'none' }}>{m.actionLabel}</span>
              )}
            </div>
          ))}
        </CardSection>
      </div>

      {/* Right column */}
      <div style={{ flex: '0 0 38%', maxWidth: '38%', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Engagement */}
        <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ font: '600 13px/1 Inter,sans-serif', color: '#23272d' }}>Your engagement</span>
            <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>Private to you</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
            <span style={{ font: '600 24px/1 Inter,sans-serif', color: '#23272d' }}>9 days</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {ENGAGEMENT_STREAK.map((d, i) => (
                <span key={i} style={{ width: 13, height: 22, borderRadius: 3, background: d.active ? '#77469b' : i === 4 ? '#e0d5ec' : '#f1f2f4' }} />
              ))}
            </div>
          </div>
          <div style={{ font: '400 11px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 10 }}>Light bar was a protected quiet day. One completed task keeps the streak alive today.</div>
          <div style={{ height: 1, background: '#f1f2f4', margin: '14px 0' }} />
          <div style={{ font: '500 12px/1.4 Inter,sans-serif', color: '#464646' }}>Progress to your 10:30</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 9 }}>
            <div style={{ flex: 1, height: 5, borderRadius: 3, background: '#f1f2f4', overflow: 'hidden' }}>
              <div style={{ width: '55%', height: '100%', background: '#77469b' }} />
            </div>
            <span style={{ font: '600 11px/1 Inter,sans-serif', color: '#464646' }}>5 of 9</span>
          </div>
          <div style={{ font: '400 11px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 8 }}>Clear 4 more items before the call to complete the set.</div>
        </div>

        {/* Account goals */}
        <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, padding: 18 }}>
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

      {/* Nudge dialog */}
      {subScreen === 'nudge' && (
        <div style={{ flex: '0 0 30%', maxWidth: '30%', height: '100%', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, padding: 20, overflowY: 'auto' }}>
          <div style={{ font: '600 14px/1 Inter,sans-serif', color: '#23272d' }}>Nudge Ritvik on Slack</div>
          <div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 9 }}>This alert has been open three days. Sending a nudge does not act on the AM's behalf — it only sends the message below.</div>
          <div style={{ border: '1px solid #e6e8ec', borderRadius: 8, padding: 14, marginTop: 14, background: '#fafbfd' }}>
            <div style={{ font: '500 12px/1.4 Inter,sans-serif', color: '#23272d' }}>Net profit down 12% across 14 ASINs</div>
            <div style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#6b7178', marginTop: 4 }}>Nutrabay · −$7,940 · 3rd consecutive day</div>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ font: '600 11px/1 Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Message preview</div>
            <div style={{ marginTop: 9, padding: 13, border: '1px solid #dfe3ea', borderRadius: 8, font: '400 13px/1.7 Inter,sans-serif', color: '#464646' }}>Hey Ritvik — the Nutrabay content alert is into its 3rd day (−$7,940). The recommended revert is ready to approve whenever you get to it. Flagging since it's in your 10:30.</div>
          </div>
          <div style={{ display: 'flex', gap: 9, marginTop: 16 }}>
            <span style={{ padding: '10px 16px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 12px/1 Inter,sans-serif', cursor: 'pointer' }}>Send nudge</span>
            <span onClick={onNudgeClose} style={{ padding: '10px 16px', borderRadius: 7, border: '1px solid #dfe3ea', font: '600 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>Cancel</span>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCell({ topBorder, label, icon, value, valueColor, sub }: { topBorder: string; label: string; icon: React.ReactNode; value: string; valueColor?: string; sub: string }) {
  return (
    <div style={{ background: 'transparent', padding: 14, borderTop: `3px solid ${topBorder}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{icon}{label}</div>
      <div style={{ font: '600 20px/1 Inter,sans-serif', color: valueColor || '#23272d', marginTop: 8 }}>{value}</div>
      <div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178', marginTop: 5 }}>{sub}</div>
    </div>
  );
}

function MiniStat({ label, value, valueColor, sub }: { label: string; value: string; valueColor?: string; sub: string }) {
  return (
    <div style={{ background: 'transparent', padding: 14 }}>
      <div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{label}</div>
      <div style={{ font: '600 20px/1 Inter,sans-serif', color: valueColor || '#23272d', marginTop: 8 }}>{value}</div>
      <div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178', marginTop: 5 }}>{sub}</div>
    </div>
  );
}

function CardSection({ title, titleIcon, actionLabel, actionColor, onAction, children }: { title: string; titleIcon?: React.ReactNode; actionLabel?: string; actionColor?: string; onAction?: () => void; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden', flex: 'none' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f2f4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 7, font: '600 13px/1 Inter,sans-serif', color: '#23272d' }}>{titleIcon}{title}</span>
        {actionLabel && (
          <span onClick={onAction} style={{ font: '600 12px/1 Inter,sans-serif', color: actionColor || '#77469b', cursor: onAction ? 'pointer' : 'default' }}>{actionLabel}</span>
        )}
      </div>
      {children}
    </div>
  );
}
