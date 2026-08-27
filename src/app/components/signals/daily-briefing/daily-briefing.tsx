import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Sun, CloudSun, Moon, SunHorizon, Warning, CurrencyDollar, CalendarCheck, Lightning, WarningCircle, CalendarBlank, Robot, CheckCircle, Clock, Moon as MoonIcon, TrendUp, CaretDown, Flame, Plus, CalendarBlank as WeeklyIcon, ChartBar } from '@phosphor-icons/react';
import styles from './daily-briefing.module.scss';
import { selectDecisions } from '@/redux/slices/signals/signals.slice';
import { briefingFor, type BriefingSlot } from '@/utils/signals/briefing';
import { useAppDispatch } from '@/redux/hooks';
import { showJivaToast } from '@/utils/signals/jiva-toast';

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

function formatHeaderDate(): string {
  const now = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
}

function formatHeaderTime(): string {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function CollapsibleSection({
  icon,
  label,
  count,
  defaultOpen = false,
  action,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
  defaultOpen?: boolean;
  action?: React.ReactNode;
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
        <span className={styles.accordionRight}>
          {action && <span className={styles.accordionAction} onClick={(e) => e.stopPropagation()}>{action}</span>}
          <CaretDown
            size={14}
            className={`${styles.accordionChevron} ${open ? styles.accordionChevronOpen : ''}`}
          />
        </span>
      </button>
      {open && (
        <div className={styles.accordionBody}>
          {children}
        </div>
      )}
    </div>
  );
}

export function DailyBriefing({ onMeetingSelect }: { onMeetingSelect?: (bundleId: string) => void } = {}) {
  const decisions = useSelector(selectDecisions);
  const dispatch = useAppDispatch();
  const b = briefingFor(decisions);
  const Icon = ICON_MAP[b.slot];

  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');

  const open = decisions.filter((d) => d.status === 'open');
  const criticalCount = open.filter((d) => d.severity === 'critical').length;
  const atRiskValue = open.reduce((n, d) => n + (d.valueKind === 'at_risk' ? Math.abs(d.valueCents) : 0), 0);
  const meetingCount = new Set(decisions.filter((d) => d.meetingRef).map((d) => d.meetingRef!.bundleId)).size;
  const completedToday = decisions.filter((d) => (d.status === 'completed' || d.status === 'rejected') && new Date(d.updatedAt).toDateString() === new Date().toDateString()).length;

  // Todo items with local state for adding new items
  const [todoItems, setTodoItems] = useState(
    () => b.todoToday?.map((t) => ({ ...t, done: false })) ?? []
  );
  const [newTodoText, setNewTodoText] = useState('');
  const [showNewTodo, setShowNewTodo] = useState(false);

  const addTodo = useCallback(() => {
    if (!newTodoText.trim()) return;
    setTodoItems((prev) => [...prev, { task: newTodoText.trim(), from: 'manual' as const, due: 'EOD', done: false }]);
    setNewTodoText('');
    setShowNewTodo(false);
  }, [newTodoText]);

  const toggleTodo = useCallback((idx: number) => {
    setTodoItems((prev) => {
      const next = prev.map((t, i) => i === idx ? { ...t, done: !t.done } : t);
      if (!prev[idx].done) {
        showJivaToast(dispatch);
      }
      return next;
    });
  }, [dispatch]);

  return (
    <div className={styles.dailyBriefing}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.badge}>
              <Icon size={11} weight="fill" /> Daily briefing
            </div>
            <div className={styles.dateTime}>
              <span className={styles.dateText}>{formatHeaderDate()}</span>
              <span className={styles.timeText}>{formatHeaderTime()}</span>
            </div>
          </div>
          <h2 className={styles.greeting}>{b.greeting}</h2>
          <p className={styles.dateline}>{b.dateline}</p>
        </div>

        {/* View toggle: Daily / Weekly */}
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewToggleBtn} ${viewMode === 'daily' ? styles.viewToggleBtnActive : ''}`}
            onClick={() => setViewMode('daily')}
          >
            <SunHorizon size={12} weight="fill" /> Daily
          </button>
          <button
            className={`${styles.viewToggleBtn} ${viewMode === 'weekly' ? styles.viewToggleBtnActive : ''}`}
            onClick={() => setViewMode('weekly')}
          >
            <ChartBar size={12} weight="fill" /> Weekly
          </button>
        </div>

        {viewMode === 'daily' ? (
          <>
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

            {/* Compact stat row — 4 in one row with labels */}
            <div className={styles.statRow}>
              <div className={`${styles.statChip} ${styles.statCritical}`}>
                <Warning size={14} weight="fill" className={styles.statChipIcon} />
                <span className={styles.statChipValue}>{criticalCount}</span>
                <span className={styles.statChipLabel}>Critical</span>
              </div>
              <div className={`${styles.statChip} ${styles.statAtRisk}`}>
                <CurrencyDollar size={14} weight="fill" className={styles.statChipIcon} />
                <span className={styles.statChipValue}>{fmtDollars(atRiskValue)}</span>
                <span className={styles.statChipLabel}>At risk</span>
              </div>
              <div className={`${styles.statChip} ${styles.statMeetings}`}>
                <CalendarCheck size={14} weight="fill" className={styles.statChipIcon} />
                <span className={styles.statChipValue}>{meetingCount}</span>
                <span className={styles.statChipLabel}>Meetings</span>
              </div>
              <div className={`${styles.statChip} ${styles.statDone}`}>
                <Lightning size={14} weight="fill" className={styles.statChipIcon} />
                <span className={styles.statChipValue}>{completedToday}</span>
                <span className={styles.statChipLabel}>Done today</span>
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

              {/* Todo today — with + button, after Priority alerts */}
              <CollapsibleSection
                icon={<CheckCircle size={13} weight="fill" />}
                label="Todo today"
                count={todoItems.length}
                defaultOpen={true}
                action={
                  <button
                    className={styles.addTodoBtn}
                    onClick={() => setShowNewTodo(!showNewTodo)}
                    title="Add todo item"
                  >
                    <Plus size={12} weight="bold" />
                  </button>
                }
              >
                {showNewTodo && (
                  <div className={styles.newTodoRow}>
                    <input
                      autoFocus
                      value={newTodoText}
                      onChange={(e) => setNewTodoText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') addTodo(); if (e.key === 'Escape') setShowNewTodo(false); }}
                      placeholder="Add a task…"
                      className={styles.newTodoInput}
                    />
                    <button className={styles.newTodoAdd} onClick={addTodo}>Add</button>
                    <button className={styles.newTodoCancel} onClick={() => setShowNewTodo(false)}>×</button>
                  </div>
                )}
                <ul className={styles.todoList}>
                  {todoItems.map((t, i) => (
                    <li key={i} className={`${styles.todoItem} ${t.done ? styles.todoDone : ''}`}>
                      <label className={styles.todoLabel}>
                        <input type="checkbox" className={styles.todoCheckbox} checked={t.done} onChange={() => toggleTodo(i)} />
                        <span className={t.done ? styles.todoTextDone : ''}>{t.task}</span>
                        {t.due && <span className={styles.todoDue}>{t.due}</span>}
                      </label>
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>

              {/* Meetings */}
              <CollapsibleSection
                icon={<CalendarBlank size={13} weight="fill" />}
                label="Meetings today"
                count={b.upcomingMeetings?.length}
              >
                <div className={styles.meetingList}>
                  {b.upcomingMeetings?.map((m, i) => (
                    <div
                      key={i}
                      className={styles.meetingItem}
                      onClick={() => onMeetingSelect?.(m.bundleId)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter') onMeetingSelect?.(m.bundleId); }}
                    >
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
          </>
        ) : (
          /* Weekly summary view */
          <div className={styles.weeklyView}>
            {b.weeklySummary && (
              <>
                <div className={styles.weeklyStatRow}>
                  <div className={styles.weeklyStatCard}>
                    <span className={styles.weeklyStatValue}>{b.weeklySummary.totalDecisions}</span>
                    <span className={styles.weeklyStatLabel}>Total decisions</span>
                  </div>
                  <div className={styles.weeklyStatCard}>
                    <span className={styles.weeklyStatValue}>{b.weeklySummary.resolvedCount}</span>
                    <span className={styles.weeklyStatLabel}>Resolved</span>
                  </div>
                  <div className={styles.weeklyStatCard}>
                    <span className={styles.weeklyStatValue}>{fmtDollars(b.weeklySummary.revenueProtected)}</span>
                    <span className={styles.weeklyStatLabel}>Revenue protected</span>
                  </div>
                  <div className={styles.weeklyStatCard}>
                    <span className={styles.weeklyStatValue}>{b.weeklySummary.avgResponseTime}</span>
                    <span className={styles.weeklyStatLabel}>Avg response</span>
                  </div>
                </div>
                <div className={styles.weeklyOnTimeCard}>
                  <span className={styles.weeklyOnTimeValue}>{b.weeklySummary.onTimeRate}%</span>
                  <span className={styles.weeklyOnTimeLabel}>On-time completion rate</span>
                  <div className={styles.weeklyProgressBar}>
                    <div className={styles.weeklyProgressFill} style={{ width: `${b.weeklySummary.onTimeRate}%` }} />
                  </div>
                </div>
              </>
            )}
            <div className={styles.weeklyNote}>
              Weekly brief is generated every Sunday at 8am. Check back then for the full summary.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
