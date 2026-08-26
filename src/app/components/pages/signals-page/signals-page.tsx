import { useMemo, useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './signals-page.module.scss';
import { DecisionCard } from '../../signals/decision-card/decision-card';
import { ReviewWorkspace } from '../../signals/review-workspace/review-workspace';
import { EmptyState } from '../../signals/empty-state/empty-state';
import { DailyBriefing } from '../../signals/daily-briefing/daily-briefing';
import { BulkBar } from '../../signals/bulk-bar';
import { FilterSheet, countActiveFilters, type FilterState } from '../../signals/filter-sheet';
import { MeetingCard } from '../../signals/meeting-card';
import { MeetingReviewView } from '../../signals/meeting-review-view';
import { CRITICAL_ONLY_DECISION } from '@/constants/signals/criticalOnlyDecision';
import { ALERT_TABS, filterByTab, computeTabCounts, type AlertTabKey } from '@/constants/signals/tabs.constants';
import { categorize } from '@/utils/signals/categories';
import { importanceScore } from '@/utils/signals/lifecycle';
import {
  selectSelectedDecisionId,
  selectSelectedMeetingId,
  selectSelectedIds,
  setSelectedDecision,
  setSelectedMeeting,
  approveDecision,
  rejectDecision,
  delegateToAan,
  bulkApprove,
  clearSelection,
  setFilterSources,
  setFilterDomains,
  setFilterWindow,
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

interface SignalsPageProps {
  defaultSummaryExpanded?: boolean;
  defaultSelectedDecisionId?: string;
}

export function SignalsPage({ defaultSummaryExpanded, defaultSelectedDecisionId }: SignalsPageProps = {}) {
  const dispatch = useDispatch();
  const selectedDecisionId = useSelector(selectSelectedDecisionId);
  const selectedMeetingId = useSelector(selectSelectedMeetingId);
  const selectedIds = useSelector(selectSelectedIds);

  const activeDecisions = useMemo<Decision[]>(
    () => [CRITICAL_ONLY_DECISION],
    [],
  );

  useEffect(() => {
    if (defaultSelectedDecisionId) {
      dispatch(setSelectedDecision(defaultSelectedDecisionId));
    }
  }, [defaultSelectedDecisionId, dispatch]);

  const [tab, setTab] = useState<AlertTabKey>('unread');
  const [query, setQuery] = useState('');
  const [activeCategoryKey, setActiveCategoryKey] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<FilterState>({
    sources: new Set(),
    domains: new Set(),
    window: 'any',
  });

  const counts = useMemo(() => computeTabCounts(activeDecisions), [activeDecisions]);
  const pool = useMemo(() => filterByTab(activeDecisions, tab), [activeDecisions, tab]);

  const filtered = useMemo(() => {
    let result = pool;

    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter((d) =>
        `${d.insight} ${d.sourceRef.label} ${d.domain}`.toLowerCase().includes(q)
      );
    }

    if (filterState.sources.size > 0) {
      result = result.filter((d) => filterState.sources.has(d.source));
    }
    if (filterState.domains.size > 0) {
      result = result.filter((d) => filterState.domains.has(d.domain));
    }
    if (filterState.window !== 'any') {
      const now = Date.now();
      const day = 86400000;
      const earliest = filterState.window === 'today' ? now - day : filterState.window === 'yesterday' ? now - 2 * day : now - 7 * day;
      result = result.filter((d) => d.createdAt >= earliest);
    }

    return result.sort((a, b) => importanceScore(b) - importanceScore(a));
  }, [pool, query, filterState]);

  const allCategoryGroups = useMemo(() => categorize(tab, filtered), [tab, filtered]);
  const categoryGroups = useMemo(() => {
    if (!activeCategoryKey || activeCategoryKey === '__all__') return allCategoryGroups;
    const only = allCategoryGroups.find((c) => c.key === activeCategoryKey);
    return only ? [only] : allCategoryGroups;
  }, [allCategoryGroups, activeCategoryKey]);
  const meetingGroups = useMemo(() => groupByMeeting(filtered), [filtered]);
  const isMeetingsTab = tab === 'meetings';

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
  }, [dispatch]);

  const handleSelectMeeting = useCallback((bundleId: string) => {
    dispatch(setSelectedMeeting(bundleId));
  }, [dispatch]);

  const handleApprove = useCallback((id: string) => {
    dispatch(approveDecision(id));
  }, [dispatch]);

  const handleBulkApprove = useCallback((ids: string[]) => {
    dispatch(bulkApprove(ids));
  }, [dispatch]);

  const handleBulkDelegate = useCallback((ids: string[]) => {
    ids.forEach((id) => dispatch(delegateToAan(id)));
  }, [dispatch]);

  const handleBulkDismiss = useCallback((ids: string[]) => {
    ids.forEach((id) => dispatch(rejectDecision(id)));
  }, [dispatch]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedDecisionId) dispatch(setSelectedDecision(null));
        else if (selectedMeetingId) dispatch(setSelectedMeeting(null));
        else dispatch(clearSelection());
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch, selectedDecisionId, selectedMeetingId]);

  const total = isMeetingsTab ? meetingGroups.length : filtered.length;
  const isSearchEmpty = query.trim().length > 0 && total === 0;
  const isEmpty = total === 0;
  const filterActiveCount = countActiveFilters(filterState);

  return (
    <div className={styles.signalsPage}>
      {/* Toolbar — spans above both columns */}
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
        <div className={styles.toolbarRight}>
          <input
            className={styles.searchInput}
            placeholder="Search signals, meetings, decisions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <FilterSheet
            value={filterState}
            activeCategory={activeCategoryKey}
            onChange={(f) => {
              setFilterState(f);
              dispatch(setFilterSources([...f.sources]));
              dispatch(setFilterDomains([...f.domains]));
              dispatch(setFilterWindow(f.window));
            }}
            activeCount={filterActiveCount + (activeCategoryKey && activeCategoryKey !== '__all__' ? 1 : 0)}
          />
        </div>
      </div>

      {/* Two-column layout */}
      <div className={styles.layout}>
        {/* Left: Queue */}
        <div className={styles.centerCol}>
          <div className={styles.queueScroll}>
            <BulkBar
              selectedIds={selectedIds}
              decisions={filtered}
              onClear={() => dispatch(clearSelection())}
              onBulkApprove={handleBulkApprove}
              onBulkDelegate={handleBulkDelegate}
              onBulkDismiss={handleBulkDismiss}
            />

            {isEmpty ? (
              <EmptyState variant={isSearchEmpty ? 'search' : tab === 'read' || tab === 'completed' ? 'none' : 'needs_me'} />
            ) : isMeetingsTab ? (
              <div className={styles.meetingList}>
                {meetingGroups.map((m) => (
                  <MeetingCard
                    key={m.bundleId}
                    bundleId={m.bundleId}
                    title={m.title}
                    signals={m.signals}
                    selected={selectedMeetingId === m.bundleId}
                    onSelect={() => handleSelectMeeting(m.bundleId)}
                  />
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

        {/* Right: Workspace or Briefing */}
        <div className={`${styles.rightCol} ${selectedDecision || selectedMeetingBundle ? styles.rightColVisible : ''}`}>
          {selectedDecision ? (
            <ReviewWorkspace
              decision={selectedDecision}
              decisions={activeDecisions}
              onClose={() => dispatch(setSelectedDecision(null))}
              onOpenDecision={(id) => {
                dispatch(setSelectedDecision(id));
              }}
              defaultSummaryExpanded={defaultSummaryExpanded}
            />
          ) : selectedMeetingBundle ? (
            <MeetingReviewView
              bundleId={selectedMeetingBundle.bundleId}
              bundleTitle={selectedMeetingBundle.title}
              all={activeDecisions}
              onOpen={(id) => dispatch(setSelectedDecision(id))}
            />
          ) : (
            <DailyBriefing />
          )}
        </div>
      </div>
    </div>
  );
}
