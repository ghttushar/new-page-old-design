import { useSelector } from 'react-redux';
import { Sun, CloudSun, Moon, SunHorizon, Sparkle, WarningCircle, TrendUp, Robot, CalendarBlank, ArrowRight, CheckCircle, Clock, Moon as MoonIcon, Warning, CurrencyDollar, CalendarCheck, Lightning } from '@phosphor-icons/react';
import styles from './daily-briefing.module.scss';
import { selectDecisions } from '@/redux/slices/signals/signals.slice';
import { briefingFor, type BriefingSlot, type PriorityAlert, type UpcomingMeeting, type TodoItem, type PendingItem, type OvernightChange } from '@/utils/signals/briefing';

const ICON_MAP: Record<BriefingSlot, typeof Sun | typeof CloudSun | typeof Moon | typeof SunHorizon> = {
  morning: SunHorizon,
  afternoon: Sun,
  evening: CloudSun,
  end_of_day: Moon,
};

function fmtDollars(cents: number): string {
  const d = Math.abs(cents) / 100;
  if (d < 1000) return `$${Math.round(d)}`;
  if (d < 1_000_000) return `$${(d / 1000).toFixed(1)}k`;
  return `$${(d / 1_000_000).toFixed(1)}M`;
}

export function DailyBriefing() {
  const decisions = useSelector(selectDecisions);
  const b = briefingFor(decisions);
  const Icon = ICON_MAP[b.slot];

  const open = decisions.filter((d) => d.status === 'open');
  const criticalCount = open.filter((d) => d.severity === 'critical').length;
  const atRiskValue = open.reduce((n, d) => n + (d.valueKind === 'at_risk' ? Math.abs(d.valueCents) : 0), 0);
  const meetingCount = new Set(decisions.filter((d) => d.meetingRef).map((d) => d.meetingRef!.bundleId)).size;
  const completedToday = decisions.filter((d) => (d.status === 'completed' || d.status === 'rejected') && new Date(d.updatedAt).toDateString() === new Date().toDateString()).length;

  return (
    <div className={styles.dailyBriefing}>
      <div className={styles.ambientGlow} />
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <Icon size={12} weight="fill" /> Daily briefing
          </div>
          <h2 className={styles.greeting}>{b.greeting}</h2>
          <p className={styles.dateline}>{b.dateline}</p>
        </div>

        <div className={styles.statGrid}>
          <div className={`${styles.statCard} ${styles.statCritical}`}>
            <div className={styles.statIcon}><Warning size={18} weight="fill" /></div>
            <div className={styles.statValue}>{criticalCount}</div>
            <div className={styles.statLabel}>Critical alerts</div>
          </div>
          <div className={`${styles.statCard} ${styles.statAtRisk}`}>
            <div className={styles.statIcon}><CurrencyDollar size={18} weight="fill" /></div>
            <div className={styles.statValue}>{fmtDollars(atRiskValue)}</div>
            <div className={styles.statLabel}>At risk</div>
          </div>
          <div className={`${styles.statCard} ${styles.statMeetings}`}>
            <div className={styles.statIcon}><CalendarCheck size={18} weight="fill" /></div>
            <div className={styles.statValue}>{meetingCount}</div>
            <div className={styles.statLabel}>Meetings today</div>
          </div>
          <div className={`${styles.statCard} ${styles.statCompleted}`}>
            <div className={styles.statIcon}><Lightning size={18} weight="fill" /></div>
            <div className={styles.statValue}>{completedToday}</div>
            <div className={styles.statLabel}>Completed</div>
          </div>
        </div>

        {b.priorityAlerts && b.priorityAlerts.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>
              <WarningCircle size={12} /> Priority alerts
            </div>
            <div className={styles.alertList}>
              {b.priorityAlerts.map((a, i) => (
                <div key={i} className={styles.alertItem}>
                  <span className={styles.alertDot} style={{ background: a.severity === 'critical' ? '#ff0000' : a.severity === 'opportunity' ? '#77469b' : '#7c7c7c' }} />
                  <div className={styles.alertInfo}>
                    <span className={styles.alertTitle}>{a.title}</span>
                    <span className={styles.alertMeta}>{a.value} · {a.verb}</span>
                  </div>
                  <ArrowRight size={12} className={styles.alertArrow} />
                </div>
              ))}
            </div>
          </div>
        )}

        {b.upcomingMeetings && b.upcomingMeetings.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>
              <CalendarBlank size={12} /> Meetings
            </div>
            <div className={styles.meetingList}>
              {b.upcomingMeetings.map((m, i) => (
                <div key={i} className={styles.meetingItem}>
                  <span className={styles.meetingTitle}>{m.title}</span>
                  <span className={styles.meetingCount}>{m.signalCount} signal{m.signalCount === 1 ? '' : 's'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {b.aanActivity && b.aanActivity.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>
              <Robot size={12} /> Jiva activity
            </div>
            <div className={styles.activityList}>
              {b.aanActivity.map((a, i) => (
                <div key={i} className={styles.activityItem}>
                  <span className={styles.activityDot} />
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {b.slot === 'morning' && b.todoToday && b.todoToday.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>
              <CheckCircle size={12} /> Todo today
            </div>
            <ul className={styles.todoList}>
              {b.todoToday.map((t, i) => (
                <li key={i} className={styles.todoItem}>
                  <label className={styles.todoLabel}>
                    <input type="checkbox" className={styles.todoCheckbox} />
                    <span>{t.task}</span>
                    {t.due && <span className={styles.todoDue}>{t.due}</span>}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        {b.slot === 'morning' && b.pendingYesterday && b.pendingYesterday.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>
              <Clock size={12} /> Pending from yesterday
            </div>
            <ul className={styles.pendingList}>
              {b.pendingYesterday.map((p, i) => (
                <li key={i} className={styles.pendingItem}>
                  <span className={styles.pendingTask}>{p.task}</span>
                  <span className={styles.pendingMeta}>
                    <span className={styles.pendingSource}>{p.from === 'meeting' ? 'Meeting' : 'Alert'}</span>
                    <span className={styles.pendingSince}>{p.since}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {b.slot === 'morning' && b.overnightChanges && b.overnightChanges.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>
              <MoonIcon size={12} /> What changed overnight
            </div>
            <div className={styles.overnightList}>
              {b.overnightChanges.map((c, i) => (
                <div key={i} className={styles.overnightItem}>
                  <div className={styles.overnightChange}>{c.change}</div>
                  <div className={styles.overnightMeta}>
                    <span className={styles.overnightImpact}>{c.impact}</span>
                    <span className={styles.overnightType}>{c.type.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {b.weeklyStreak && (
          <div className={styles.streakBar}>
            <TrendUp size={12} /> {b.weeklyStreak}
          </div>
        )}

        {b.actionText && (
          <p className={styles.actionText}>
            <Sparkle size={12} weight="fill" /> {b.actionText}
          </p>
        )}
      </div>
    </div>
  );
}
