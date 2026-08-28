import { useMemo, useState } from 'react';
import { CalendarBlank, ArrowLeft, CaretDown, ChatText, Clock, Users, CheckCircle } from '@phosphor-icons/react';
import type { Decision } from '@/constants/signals/decisions.constants';
import type { MeetingTask } from '@/constants/signals/mockMeetings';
import { MOCK_MEETING_BUNDLES, MOCK_MEETING_TASKS } from '@/constants/signals/mockMeetings';
import { formatValue } from '@/utils/signals/valueFormat';
import { SourcePill } from './chips/source-pill';
import { MeetingPrepItem } from './meeting-prep-item';
import { DiscussDrawer } from './review-workspace/discuss-drawer';

interface Props {
  bundleId: string;
  bundleTitle: string;
  all: Decision[];
  onOpen: (id: string) => void;
  onBack?: () => void;
}

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const hrs = diff / 3_600_000;
  if (hrs < 1) return `${Math.max(1, Math.round(diff / 60_000))} min ago`;
  if (hrs < 24) return `${Math.round(hrs)}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export function MeetingReviewView({ bundleId, bundleTitle, all, onOpen, onBack }: Props) {
  const alerts = useMemo(() => all.filter((d) => d.meetingRef?.bundleId === bundleId), [all, bundleId]);
  const totalCents = alerts.reduce((n, d) => n + (d.valueKind === 'info' ? 0 : Math.abs(d.valueCents)), 0);
  const totalStr = formatValue({ cents: totalCents, kind: 'gain' });

  const bundle = MOCK_MEETING_BUNDLES.find((b) => b.id === bundleId);
  const prepTasks = useMemo(() => MOCK_MEETING_TASKS.filter((t) => t.bundleId === bundleId), [bundleId]);

  const openTasks = prepTasks.filter((t) => t.status === 'open');
  const doneTasks = prepTasks.filter((t) => t.status !== 'open');

  const [briefOpen, setBriefOpen] = useState(false);
  const [prepOpen, setPrepOpen] = useState(true);
  const [drawerTask, setDrawerTask] = useState<MeetingTask | null>(null);

  const excerpts = useMemo(() =>
    alerts
      .filter((d) => d.meetingRef?.excerpt)
      .map((d) => d.meetingRef!.excerpt),
    [alerts],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Meeting Header */}
      <section style={{ borderRadius: 12, border: '1px solid #e1e4e8', background: 'linear-gradient(135deg, #fff, rgba(119,70,155,0.03))', padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 32, height: 32, borderRadius: 8, border: 'none',
                background: 'transparent', color: '#7c7c7c', cursor: 'pointer', transition: 'all 0.12s',
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

        {/* Time + Duration */}
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12, fontSize: '1rem', color: '#7c7c7c' }}>
          {bundle && (
            <>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={13} /> {formatTimeAgo(bundle.ts)}
              </span>
              <span>·</span>
              <span>{bundle.durationMin} min</span>
            </>
          )}
          <span>·</span>
          <span><span style={{ fontWeight: 500, color: '#474747' }}>{alerts.length}</span> alerts generated</span>
          {totalCents > 0 && <span><span style={{ fontWeight: 500, color: '#23272d' }}>{totalStr.text}</span> impact</span>}
        </div>

        {/* Attendees */}
        {bundle && bundle.attendees.length > 0 && (
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Users size={14} color="#7c7c7c" />
            {bundle.attendees.map((a, i) => (
              <span
                key={i}
                title={a.role ? `${a.name} — ${a.role}` : a.name}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '2px 8px', borderRadius: 999,
                  background: a.name === 'You Own' ? 'rgba(119,70,155,0.1)' : 'rgba(0,0,0,0.04)',
                  border: a.name === 'You Own' ? '1px solid rgba(119,70,155,0.25)' : '1px solid transparent',
                  fontSize: '0.9rem', fontWeight: 500,
                  color: a.name === 'You Own' ? '#77469b' : '#474747',
                  cursor: 'default',
                }}
              >
                <span style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: a.name === 'You Own' ? '#77469b' : '#d1d5db',
                  color: '#fff', fontSize: '0.65rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {a.name.charAt(0)}
                </span>
                {a.name === 'You Own' ? 'You' : a.name.split(' ')[0]}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Meeting Brief */}
      {bundle && (
        <section style={{ borderRadius: 12, border: '1px solid #e1e4e8', background: '#fff', overflow: 'hidden' }}>
          <button
            onClick={() => setBriefOpen(!briefOpen)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '12px 16px', border: 'none', background: 'none',
              cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: '#7c7c7c',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ChatText size={12} /> Meeting brief
            </span>
            <CaretDown size={12} style={{ transition: 'transform 0.2s', transform: briefOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
          </button>
          {briefOpen && (
            <div style={{ padding: '0 16px 16px', borderTop: '1px solid #e1e4e8' }}>
              {bundle.summary && (
                <div style={{ padding: '10px 0', fontSize: '1rem', color: '#474747', lineHeight: 1.6, borderBottom: '1px solid #e1e4e8' }}>
                  <span style={{ fontWeight: 600, color: '#23272d' }}>Summary: </span>{bundle.summary}
                </div>
              )}
              {bundle.transcriptExcerpt && (
                <div style={{ padding: '10px 0' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#7c7c7c', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Transcript</div>
                  {bundle.transcriptExcerpt.split('\n').map((line, i) => (
                    <div key={i} style={{
                      padding: '6px 10px', marginBottom: 4, borderRadius: 6,
                      background: '#f6f6f7', fontSize: '0.95rem', color: '#474747',
                      fontFamily: "'SF Mono', 'Consolas', monospace",
                      lineHeight: 1.5,
                    }}>
                      {line}
                    </div>
                  ))}
                </div>
              )}
              {excerpts.length > 0 && (
                <div style={{ paddingTop: 10 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#7c7c7c', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Alert excerpts</div>
                  {excerpts.map((text, i) => (
                    <div key={i} style={{
                      padding: '8px 10px', marginBottom: 4, borderRadius: 6,
                      background: '#f6f6f7', fontSize: '0.95rem', color: '#474747',
                      fontFamily: "'SF Mono', 'Consolas', monospace", lineHeight: 1.5,
                      borderBottom: i < excerpts.length - 1 ? '1px solid #e1e4e8' : 'none',
                    }}>
                      {text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Meeting Prep */}
      {prepTasks.length > 0 && (
        <section style={{ borderRadius: 12, border: '1px solid #e1e4e8', background: '#fff', overflow: 'hidden' }}>
          <button
            onClick={() => setPrepOpen(!prepOpen)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '12px 16px', border: 'none', background: 'none',
              cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: '#7c7c7c',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={12} /> Meeting prep
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999,
                background: 'rgba(119,70,155,0.1)', color: '#77469b',
                fontSize: '0.75rem', fontWeight: 700,
              }}>
                {openTasks.length}
              </span>
            </span>
            <CaretDown size={12} style={{ transition: 'transform 0.2s', transform: prepOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
          </button>
          {prepOpen && (
            <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid #e1e4e8' }}>
              {openTasks.map((t) => (
                <MeetingPrepItem key={t.id} task={t} onAskJiva={setDrawerTask} />
              ))}
              {doneTasks.length > 0 && (
                <>
                  <div style={{ fontSize: '0.8rem', color: '#9a9a9a', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4, marginBottom: -4 }}>Completed</div>
                  {doneTasks.map((t) => (
                    <MeetingPrepItem key={t.id} task={t} onAskJiva={setDrawerTask} />
                  ))}
                </>
              )}
            </div>
          )}
        </section>
      )}

      {/* Alerts from this meeting */}
      {alerts.length > 0 && (
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
                    display: 'grid', gridTemplateColumns: '110px 1fr auto', alignItems: 'center', gap: 12,
                    padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid #e1e4e8', transition: 'background 0.12s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f6f6f7'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{
                    fontSize: '1.3rem', fontWeight: 600, fontFamily: "'Inter', sans-serif",
                    color: '#23272d',
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
      )}

      {/* Discuss Drawer for meeting prep tasks */}
      <DiscussDrawer
        taskContext={drawerTask ? { title: drawerTask.insight, owner: drawerTask.owner, domain: drawerTask.domain } : undefined}
        open={!!drawerTask}
        onOpenChange={(o) => { if (!o) setDrawerTask(null); }}
      />
    </div>
  );
}
