import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Sun, CloudSun, Moon, SunHorizon, Warning, CurrencyDollar, CalendarCheck, Lightning, WarningCircle, CalendarBlank, Robot, CheckCircle, Clock, Moon as MoonIcon, TrendUp, CaretDown, Flame } from '@phosphor-icons/react';
import styles from './daily-briefing.module.scss';
import { selectDecisions } from '@/redux/slices/signals/signals.slice';
import { briefingFor, type BriefingSlot } from '@/utils/signals/briefing';

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

function CollapsibleSection({
  icon,
  label,
  count,
  defaultOpen = false,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`${styles.accordion} ${open ? styles.accordionOpen : ''}`}>
      <button
        className={styles.accordionHeader}
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span className={styles.accordionLeft}>
          {icon}
          <span className={styles.accordionLabel}>{label}</span>
          {count !== undefined && count > 0 && (
            <span className={styles.accordionCount}>{count}</span>
          )}
        </span>
        <CaretDown
          size={14}
          className={`${styles.accordionChevron} ${open ? styles.accordionChevronOpen : ''}`}
        />
      </button>
      {open && (
        <div className={styles.accordionBody}>
          {children}
        </div>
      )}
    </div>
  );
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
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <Icon size={11} weight="fill" /> Daily briefing
          </div>
          <h2 className={styles.greeting}>{b.greeting}</h2>
          <p className={styles.dateline}>{b.dateline}</p>
        </div>

        {/* Revenue protected — prominent */}
        {b.monthlyRevenueProtected !== undefined && b.monthlyRevenueProtected > 0 && (
          <div className={styles.revenueCard}>
            <TrendUp size={20} weight="fill" className={styles.revenueIcon} />
            <div className={styles.revenueInfo}>
              <span className={styles.revenueAmount}>{fmtDollars(b.monthlyRevenueProtected)}</span>
              <span className={styles.revenueLabel}>protected this month</span>
            </div>
          </div>
        )}

        {/* Streak dots */}
        {b.streakDays && b.streakDays.length > 0 && (
          <div className={styles.streakCard}>
            <Flame size={14} weight="fill" className={styles.streakIcon} />
            <div className={styles.streakDots}>
              {b.streakDays.map((day, i) => (
                <div
                  key={i}
                  className={`${styles.streakDot} ${day.active ? styles.streakDotActive : ''}`}
                  title={`${day.label}${day.active ? ' ✓' : ''}`}
                />
              ))}
            </div>
            <span className={styles.streakLabel}>
              {b.streakDays.filter((d) => d.active).length} day streak
            </span>
          </div>
        )}

        {/* Compact stat row — 4 in one row */}
        <div className={styles.statRow}>
          <div className={`${styles.statChip} ${styles.statCritical}`}>
            <Warning size={14} weight="fill" className={styles.statChipIcon} />
            <span className={styles.statChipValue}>{criticalCount}</span>
          </div>
          <div className={`${styles.statChip} ${styles.statAtRisk}`}>
            <CurrencyDollar size={14} weight="fill" className={styles.statChipIcon} />
            <span className={styles.statChipValue}>{fmtDollars(atRiskValue)}</span>
          </div>
          <div className={`${styles.statChip} ${styles.statMeetings}`}>
            <CalendarCheck size={14} weight="fill" className={styles.statChipIcon} />
            <span className={styles.statChipValue}>{meetingCount}</span>
          </div>
          <div className={`${styles.statChip} ${styles.statDone}`}>
            <Lightning size={14} weight="fill" className={styles.statChipIcon} />
            <span className={styles.statChipValue}>{completedToday}</span>
          </div>
        </div>

        {/* Collapsible sections */}
        <div className={styles.sections}>
          {/* Priority alerts — expanded by default */}
          <CollapsibleSection
            icon={<WarningCircle size={13} weight="fill" />}
            label="Priority alerts"
            count={b.priorityAlerts?.length}
            defaultOpen={true}
          >
            <div className={styles.alertList}>
              {b.priorityAlerts?.map((a, i) => (
                <div key={i} className={styles.alertItem}>
                  <span className={styles.alertDot} style={{ background: a.severity === 'critical' ? '#ff0000' : a.severity === 'opportunity' ? '#77469b' : '#7c7c7c' }} />
                  <div className={styles.alertInfo}>
                    <span className={styles.alertTitle}>{a.title}</span>
                    <span className={styles.alertMeta}>{a.value} · {a.verb}</span>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* Meetings */}
          <CollapsibleSection
            icon={<CalendarBlank size={13} weight="fill" />}
            label="Meetings today"
            count={b.upcomingMeetings?.length}
          >
            <div className={styles.meetingList}>
              {b.upcomingMeetings?.map((m, i) => (
                <div key={i} className={styles.meetingItem}>
                  <span className={styles.meetingTitle}>{m.title}</span>
                  <span className={styles.meetingCount}>{m.signalCount} signal{m.signalCount === 1 ? '' : 's'}</span>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* Jiva activity */}
          <CollapsibleSection
            icon={<Robot size={13} weight="fill" />}
            label="Jiva activity"
            count={b.aanActivity?.length}
          >
            <div className={styles.activityList}>
              {b.aanActivity?.map((a, i) => (
                <div key={i} className={styles.activityItem}>
                  <span className={styles.activityDot} />
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* Todo today (morning only) */}
          {b.slot === 'morning' && b.todoToday && b.todoToday.length > 0 && (
            <CollapsibleSection
              icon={<CheckCircle size={13} weight="fill" />}
              label="Todo today"
              count={b.todoToday.length}
              defaultOpen={true}
            >
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
            </CollapsibleSection>
          )}

          {/* Pending from yesterday (morning only) */}
          {b.slot === 'morning' && b.pendingYesterday && b.pendingYesterday.length > 0 && (
            <CollapsibleSection
              icon={<Clock size={13} weight="fill" />}
              label="Pending from yesterday"
              count={b.pendingYesterday.length}
            >
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
            </CollapsibleSection>
          )}

          {/* Overnight changes (morning only) */}
          {b.slot === 'morning' && b.overnightChanges && b.overnightChanges.length > 0 && (
            <CollapsibleSection
              icon={<MoonIcon size={13} weight="fill" />}
              label="What changed overnight"
              count={b.overnightChanges.length}
            >
              <div className={styles.overnightList}>
                {b.overnightChanges.map((c, i) => (
                  <div key={i} className={styles.overnightItem}>
                    <div className={styles.overnightChange}>{c.change}</div>
                    <div className={styles.overnightMeta}>
                      <span className={styles.overnightImpact}>{c.impact}</span>
                      <span className={styles.overnightType}>{c.change.startsWith('New') ? 'New alert' : 'Updated'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}
        </div>
      </div>
    </div>
  );
}
