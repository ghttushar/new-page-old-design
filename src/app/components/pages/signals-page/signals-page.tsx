import { useMemo, useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './signals-page.module.scss';
import { GreetingHeader } from '../../signals/greeting-header/greeting-header';
import { ModeToggle } from '../../signals/mode-toggle/mode-toggle';
import { CategoryRail } from '../../signals/category-rail/category-rail';
import { DecisionCard } from '../../signals/decision-card/decision-card';
import { ReviewWorkspace } from '../../signals/review-workspace/review-workspace';
import { EmptyState } from '../../signals/empty-state/empty-state';
import { DailyBriefing } from '../../signals/daily-briefing/daily-briefing';
import { CRITICAL_ONLY_DECISION } from '@/constants/signals/criticalOnlyDecision';
import { ALERT_TABS, filterByTab, computeTabCounts, type AlertTabKey } from '@/constants/signals/tabs.constants';
import { categorize } from '@/utils/signals/categories';
import { importanceScore } from '@/utils/signals/lifecycle';
import { briefingFor } from '@/utils/signals/briefing';
import {
  selectDecisions,
  selectLiveMode,
  selectSelectedDecisionId,
  selectSelectedMeetingId,
  toggleLiveMode,
  setSelectedDecision,
  setSelectedMeeting,
  approveDecision,
  rejectDecision,
  delegateToAan,
} from '@/redux/slices/signals/signals.slice';
import type { Decision } from '@/constants/signals/decisions.constants';

interface MeetingGroup {
  bundleId: string;
  title: string;
  signals: Decision[];
}

function groupByMeeting(list: Decision[]): MeetingGroup[] {
  const map = new Map<string, MeetingGroup>();
  for (const d of list) {
    const ref = d.meetingRef;
    if (!ref) continue;
    let g = map.get(ref.bundleId);
    if (!g) {
      g = { bundleId: ref.bundleId, title: ref.title, signals: [] };
      map.set(ref.bundleId, g);
    }
    g.signals.push(d);
  }
  return [...map.values()].sort((a, b) => b.signals.length - a.signals.length);
}

export function SignalsPage() {
  const dispatch = useDispatch();
  const decisions = useSelector(selectDecisions);
  const liveMode = useSelector(selectLiveMode);
  const selectedDecisionId = useSelector(selectSelectedDecisionId);
  const selectedMeetingId = useSelector(selectSelectedMeetingId);

  const activeDecisions = useMemo<Decision[]>(
    () => (liveMode ? decisions : [CRITICAL_ONLY_DECISION]),
    [liveMode, decisions],
  );

  const [tab, setTab] = useState<AlertTabKey>('all');
  const [query, setQuery] = useState('');
  const [activeCategoryKey, setActiveCategoryKey] = useState<string | null>(null);

  const b = useMemo(() => briefingFor(activeDecisions), [activeDecisions]);
  const counts = useMemo(() => computeTabCounts(activeDecisions), [activeDecisions]);
  const pool = useMemo(() => filterByTab(activeDecisions, tab), [activeDecisions, tab]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pool
      .filter((d) => {
        if (q && !`${d.insight} ${d.sourceRef.label} ${d.domain}`.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => importanceScore(b) - importanceScore(a));
  }, [pool, query]);

  const allCategoryGroups = useMemo(() => categorize(tab, filtered), [tab, filtered]);
  const categoryGroups = useMemo(() => {
    if (!activeCategoryKey || activeCategoryKey === '__all__') return allCategoryGroups;
    const only = allCategoryGroups.find((c) => c.key === activeCategoryKey);
    return only ? [only] : allCategoryGroups;
  }, [allCategoryGroups, activeCategoryKey]);
  const meetingGroups = useMemo(() => groupByMeeting(filtered), [filtered]);
  const isMeetingsTab = tab === 'meetings';

  const railItems = useMemo(
    () => allCategoryGroups.map((c) => ({ key: c.key, label: c.label, count: c.items.length })),
    [allCategoryGroups],
  );

  useEffect(() => {
    if (!liveMode && !selectedDecisionId) dispatch(setSelectedDecision(CRITICAL_ONLY_DECISION.id));
  }, [liveMode, selectedDecisionId, dispatch]);

  const handleRailSelect = useCallback((key: string) => {
    setActiveCategoryKey((prev) => (prev === key ? null : key));
  }, []);

  const selectedDecision = useMemo(
    () => activeDecisions.find((d) => d.id === selectedDecisionId) ?? null,
    [activeDecisions, selectedDecisionId],
  );

  const selectedMeetingBundle = useMemo(() => {
    if (!selectedMeetingId) return null;
    const first = activeDecisions.find((d) => d.meetingRef?.bundleId === selectedMeetingId);
    return first ? { bundleId: selectedMeetingId, title: first.meetingRef!.title } : null;
  }, [activeDecisions, selectedMeetingId]);

  const handleSelectDecision = useCallback((id: string) => {
    dispatch(setSelectedDecision(id));
    dispatch(setSelectedMeeting(null));
  }, [dispatch]);

  const handleSelectMeeting = useCallback((bundleId: string) => {
    dispatch(setSelectedMeeting(bundleId));
    dispatch(setSelectedDecision(null));
  }, [dispatch]);

  const handleApprove = useCallback((id: string) => {
    dispatch(approveDecision(id));
  }, [dispatch]);

  const handleDelegate = useCallback((id: string) => {
    dispatch(delegateToAan(id));
  }, [dispatch]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedDecisionId) dispatch(setSelectedDecision(null));
        else if (selectedMeetingId) dispatch(setSelectedMeeting(null));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch, selectedDecisionId, selectedMeetingId]);

  const total = isMeetingsTab ? meetingGroups.length : filtered.length;
  const isSearchEmpty = query.trim().length > 0 && total === 0;
  const isEmpty = total === 0;

  return (
    <div className={styles.signalsPage}>
      <div className={styles.headerRow}>
        <GreetingHeader name="Tushar" liveMode={liveMode} briefing={b} />
        <ModeToggle liveMode={liveMode} onToggle={() => dispatch(toggleLiveMode())} />
      </div>

      <div className={styles.layout}>
        {/* Left: Category rail */}
        <div className={styles.leftRail}>
          {!isMeetingsTab && (
            <CategoryRail items={railItems} activeKey={activeCategoryKey} onSelect={handleRailSelect} />
          )}
        </div>

        {/* Center: Queue */}
        <div className={styles.centerCol}>
          {/* Tabs + Search */}
          <div className={styles.toolbar}>
            <nav className={styles.tabBar} role="tablist">
              {ALERT_TABS.map((t) => {
                const active = tab === t.key;
                return (
                  <button
                    key={t.key}
                    role="tab"
                    aria-selected={active}
                    className={`${styles.tab} ${active ? styles.tabActive : ''}`}
                    onClick={() => setTab(t.key)}
                  >
                    {t.label}
                    {counts[t.key] > 0 && (
                      <span className={`${styles.tabCount} ${active ? styles.tabCountActive : ''}`}>
                        {counts[t.key]}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
            <input
              className={styles.searchInput}
              placeholder="Search signals, meetings, decisions…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className={styles.queueScroll}>
            {isEmpty ? (
              <EmptyState variant={isSearchEmpty ? 'search' : tab === 'done' ? 'none' : 'needs_me'} />
            ) : isMeetingsTab ? (
              <div className={styles.meetingList}>
                {meetingGroups.map((m) => (
                  <div
                    key={m.bundleId}
                    className={`${styles.meetingCard} ${selectedMeetingId === m.bundleId ? styles.selected : ''}`}
                    onClick={() => handleSelectMeeting(m.bundleId)}
                  >
                    <div className={styles.meetingTitle}>{m.title}</div>
                    <div className={styles.meetingMeta}>{m.signals.length} signal{m.signals.length === 1 ? '' : 's'}</div>
                  </div>
                ))}
              </div>
            ) : (
              categoryGroups.map((cat) => (
                <div key={cat.key} className={styles.categorySection}>
                  {cat.items.map((d: Decision) => (
                    <DecisionCard
                      key={d.id}
                      decision={d}
                      selected={selectedDecisionId === d.id}
                      onSelect={() => handleSelectDecision(d.id)}
                      onApprove={handleApprove}
                    />
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Workspace */}
        <div className={styles.rightCol}>
          {selectedDecision ? (
            <ReviewWorkspace
              decision={selectedDecision}
              onClose={() => dispatch(setSelectedDecision(null))}
              onApprove={handleApprove}
              onDelegate={handleDelegate}
            />
          ) : selectedMeetingBundle ? (
            <div className={styles.meetingReview}>
              <div className={styles.meetingReviewHeader}>
                <h3>{selectedMeetingBundle.title}</h3>
                <button className={styles.closeBtn} onClick={() => dispatch(setSelectedMeeting(null))}>✕</button>
              </div>
              <div className={styles.meetingReviewList}>
                {activeDecisions
                  .filter((d) => d.meetingRef?.bundleId === selectedMeetingBundle.bundleId)
                  .map((d) => (
                    <DecisionCard
                      key={d.id}
                      decision={d}
                      selected={selectedDecisionId === d.id}
                      onSelect={() => handleSelectDecision(d.id)}
                      onApprove={handleApprove}
                    />
                  ))}
              </div>
            </div>
          ) : (
            <DailyBriefing />
          )}
        </div>
      </div>
    </div>
  );
}
