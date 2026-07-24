import { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './signals-page.module.scss';
import { GreetingHeader } from '../../signals/greeting-header/greeting-header';
import { ModeToggle } from '../../signals/mode-toggle/mode-toggle';
import { CategoryRail } from '../../signals/category-rail/category-rail';
import { DecisionQueue } from '../../signals/decision-queue/decision-queue';
import { ReviewWorkspace } from '../../signals/review-workspace/review-workspace';
import { CRITICAL_ONLY_DECISION } from '@/constants/signals/criticalOnlyDecision';
import {
  selectSignals,
  toggleLiveMode,
  setSelectedDecision,
  setSelectedMeeting,
  setActiveTab,
  setSearchQuery,
  setActiveCategoryKey,
  approveDecision,
  rejectDecision,
  delegateToAan,
  selectDecisions,
  selectLiveMode,
  selectSearchQuery,
  selectActiveTab,
  selectActiveCategoryKey,
  selectSelectedDecisionId,
  selectSelectedMeetingId,
} from '@/redux/slices/signals/signals.slice';
import { SIGNAL_CATEGORIES } from '@/constants/signals/categories.constants';
import type { Decision } from '@/constants/signals/decisions.constants';

export function SignalsPage() {
  const dispatch = useDispatch();
  const { decisions, liveMode, activeTab, searchQuery, activeCategoryKey, selectedDecisionId, selectedMeetingId } =
    useSelector(selectSignals);

  const activeDecisions = useMemo<Decision[]>(
    () => (liveMode ? decisions : [CRITICAL_ONLY_DECISION]),
    [liveMode, decisions],
  );

  const railItems = useMemo(() => {
    return SIGNAL_CATEGORIES.map((cat) => ({
      key: cat.key,
      label: cat.label,
      count: activeDecisions.filter((d) => d.category === cat.key).length,
    }));
  }, [activeDecisions]);

  const filteredByCategory = useMemo(() => {
    if (!activeCategoryKey || activeCategoryKey === '__all__') return activeDecisions;
    return activeDecisions.filter((d) => d.category === activeCategoryKey);
  }, [activeDecisions, activeCategoryKey]);

  const selectedDecision = useMemo(
    () => activeDecisions.find((d) => d.id === selectedDecisionId) ?? null,
    [activeDecisions, selectedDecisionId],
  );

  const handleRailSelect = useCallback((key: string) => {
    dispatch(setActiveCategoryKey(activeCategoryKey === key ? null : key));
  }, [dispatch, activeCategoryKey]);

  const handleSelectDecision = useCallback((id: string) => {
    dispatch(setSelectedDecision(id));
  }, [dispatch]);

  const handleApprove = useCallback((id: string) => {
    dispatch(approveDecision(id));
  }, [dispatch]);

  const handleDelegate = useCallback((id: string) => {
    dispatch(delegateToAan(id));
  }, [dispatch]);

  return (
    <div className={styles.signalsPage}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <GreetingHeader name="Tushar" liveMode={liveMode} />
        <ModeToggle liveMode={liveMode} onToggle={() => dispatch(toggleLiveMode())} />
      </div>

      <div className={styles.layout}>
        {/* Left: Category rail */}
        <CategoryRail items={railItems} activeKey={activeCategoryKey} onSelect={handleRailSelect} />

        {/* Center: Decision queue */}
        <div className={styles.centerCol}>
          <DecisionQueue
            decisions={filteredByCategory}
            activeTab={activeTab}
            searchQuery={searchQuery}
            onTabChange={(tab) => dispatch(setActiveTab(tab))}
            onSearchChange={(q) => dispatch(setSearchQuery(q))}
            selectedId={selectedDecisionId}
            onSelectDecision={handleSelectDecision}
            onApproveDecision={handleApprove}
            isMeetingsTab={activeTab === 'meetings'}
          />
        </div>

        {/* Right: Review workspace */}
        <div className={styles.rightCol}>
          <ReviewWorkspace
            decision={selectedDecision}
            onClose={() => dispatch(setSelectedDecision(null))}
            onApprove={handleApprove}
            onDelegate={handleDelegate}
          />
        </div>
      </div>
    </div>
  );
}