import { useState, useEffect, useCallback, useRef } from 'react';
import { CaretDown, CaretLeft, CaretRight } from '@phosphor-icons/react';
import styles from './signals-page.module.scss';
import { SIGNAL_TABS, type SignalTabKey, type BriefState } from '@/constants/signals/tabs.constants';
import { BriefFull } from '../../signals/brief/brief-full';
import { BriefDashboard } from '../../signals/brief/brief-dashboard';
import { BriefNoIntegration } from '../../signals/brief/brief-no-integration';
import { BriefOnboard } from '../../signals/brief/brief-onboard';
import { AlertListPanel } from '../../signals/alerts/alert-list-panel';
import { AlertDetailPanel } from '../../signals/alerts/alert-detail-panel';
import { AskJivaPanel } from '../../signals/alerts/ask-jiva-panel';
import { MeetingListPanel } from '../../signals/meetings/meeting-list-panel';
import { MeetingDetailPanel } from '../../signals/meetings/meeting-detail-panel';
import { MeetingMOM } from '../../signals/meetings/meeting-mom';
import { AskJivaMeetingPanel } from '../../signals/meetings/ask-jiva-meeting-panel';
import { WorkStation } from '../../signals/work-station/work-station';
import { CalendarPopover } from '../../signals/common/calendar-popover';
import { AccountFilterDropdown } from '../../signals/common/account-filter-dropdown';
import { PROTOTYPE_ALERTS, COMPLETED_MEETINGS, type PrototypeAlert, type LoggedActionItem, type MpBrand } from '@/constants/signals/prototype-data';

export function SignalsPage({ initialTab = 'brief' }: { initialTab?: SignalTabKey } = {}) {
  const [activeTab, setActiveTab] = useState<SignalTabKey>(initialTab);
  const [briefState, setBriefState] = useState<BriefState>('full');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [meetingAskJivaOpen, setMeetingAskJivaOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [rangeLabel, setRangeLabel] = useState('Today · 1 Nov');
  const [accountFilterOpen, setAccountFilterOpen] = useState(false);
  const [filterMarketplaces, setFilterMarketplaces] = useState<MpBrand[]>([]);
  const [filterCountries, setFilterCountries] = useState<string[]>([]);
  const [filterBrands, setFilterBrands] = useState<string[]>([]);
  const [briefFullSubScreen, setBriefFullSubScreen] = useState<'main' | 'nudge'>('main');
  const [alertPhase, setAlertPhase] = useState<'view' | 'executing' | 'report' | 'genReview'>('view');
  const [execProgress, setExecProgress] = useState(0);
  const [itemsModalOpen, setItemsModalOpen] = useState(false);
  const [loggedActions, setLoggedActions] = useState<LoggedActionItem[]>([]);
  const [briefViewMode, setBriefViewMode] = useState<'brief' | 'dashboard'>('brief');
  const [resolvedAlertIds, setResolvedAlertIds] = useState<Set<string>>(new Set());
  const [filteredAlertIds, setFilteredAlertIds] = useState<string[]>(() => PROTOTYPE_ALERTS.map((a) => a.id));
  const [askJivaOpen, setAskJivaOpen] = useState(false);

  const selectedAlert = PROTOTYPE_ALERTS.find((a) => a.id === selectedAlertId) ?? null;
  // The Ask Jiva variation is a one-alert concept demo, anchored to whichever alert leads today's list.
  const firstAlertId = PROTOTYPE_ALERTS.find((a) => a.day === 'today')?.id ?? PROTOTYPE_ALERTS[0]?.id;

  const logAction = useCallback((item: LoggedActionItem) => {
    setLoggedActions((prev) => [item, ...prev]);
  }, []);

  const markResolved = useCallback((id: string | null) => {
    if (!id) return;
    setResolvedAlertIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);

  const toggleFilterMarketplace = useCallback((m: MpBrand) => {
    setFilterMarketplaces((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  }, []);
  const toggleFilterCountry = useCallback((c: string) => {
    setFilterCountries((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }, []);
  const toggleFilterBrand = useCallback((b: string) => {
    setFilterBrands((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));
  }, []);
  const clearAccountFilters = useCallback(() => {
    setFilterMarketplaces([]);
    setFilterCountries([]);
    setFilterBrands([]);
    setAccountFilterOpen(false);
  }, []);

  const accountFilterCount = filterMarketplaces.length + filterCountries.length + filterBrands.length;
  const accountFilterLabel = accountFilterCount === 0 ? 'All accounts' : `${accountFilterCount} selected`;

  const goTab = useCallback((tab: SignalTabKey) => {
    setActiveTab(tab);
    setSelectedAlertId(null);
    setSelectedMeetingId(null);
    setMeetingAskJivaOpen(false);
    setAlertPhase('view');
    setBriefFullSubScreen('main');
    setBriefViewMode('brief');
    setAskJivaOpen(false);
  }, []);

  const openAlert = useCallback((id: string) => {
    setActiveTab('alerts');
    setSelectedAlertId(id);
    setAlertPhase('view');
    setAskJivaOpen(false);
  }, []);

  const openMeeting = useCallback((id: string) => {
    setSelectedMeetingId(id);
    setMeetingAskJivaOpen(false);
  }, []);

  const executeTimerRef = useRef<number | null>(null);

  const handleExecute = useCallback(() => {
    markResolved(selectedAlertId);
    setAlertPhase('executing');
    setExecProgress(0);
    const timer = window.setInterval(() => {
      setExecProgress((prev) => {
        const next = Math.min(100, prev + 20);
        if (next >= 100) {
          window.clearInterval(timer);
          executeTimerRef.current = null;
        }
        return next;
      });
    }, 650);
    executeTimerRef.current = timer;
  }, [selectedAlertId, markResolved]);

  const handleUndoExecute = useCallback(() => {
    if (executeTimerRef.current !== null) {
      window.clearInterval(executeTimerRef.current);
      executeTimerRef.current = null;
    }
    setAlertPhase('view');
    setExecProgress(0);
    setResolvedAlertIds((prev) => {
      if (!selectedAlertId || !prev.has(selectedAlertId)) return prev;
      const next = new Set(prev);
      next.delete(selectedAlertId);
      return next;
    });
  }, [selectedAlertId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (calendarOpen) setCalendarOpen(false);
        else if (selectedAlertId) setSelectedAlertId(null);
        else if (selectedMeetingId) {
          setSelectedMeetingId(null);
          setMeetingAskJivaOpen(false);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [calendarOpen, selectedAlertId, selectedMeetingId]);

  const renderBrief = () => {
    if (briefState !== 'full') {
      return briefState === 'nointeg'
        ? <BriefNoIntegration onAlertClick={openAlert} />
        : <BriefOnboard onComplete={() => setBriefState('full')} onSkip={() => setBriefState('nointeg')} />;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          {briefViewMode === 'dashboard' ? (
            <BriefDashboard />
          ) : (
            <BriefFull
              onAlertClick={openAlert}
              onMeetingClick={() => { goTab('meetings'); }}
              subScreen={briefFullSubScreen}
              onNudgeOpen={() => setBriefFullSubScreen('nudge')}
              onNudgeClose={() => setBriefFullSubScreen('main')}
              onScopeChange={() => {}}
            />
          )}
        </div>
      </div>
    );
  };

  const renderAlerts = () => {
    const detailPanel = (
      <AlertDetailPanel
        alert={selectedAlert}
        phase={alertPhase}
        execProgress={execProgress}
        onExecute={handleExecute}
        onViewReport={() => setAlertPhase('report')}
        onBackToAlerts={() => setAlertPhase('view')}
        onGenReview={() => setAlertPhase('genReview')}
        onApproveGenReview={handleExecute}
        onOpenItems={() => setItemsModalOpen(true)}
        itemsModalOpen={itemsModalOpen}
        onCloseItems={() => setItemsModalOpen(false)}
        onLogAction={logAction}
        onDismiss={() => markResolved(selectedAlertId)}
        onUndoExecute={handleUndoExecute}
        isFirstAlert={!!selectedAlertId && selectedAlertId === firstAlertId}
        onOpenAskJiva={() => setAskJivaOpen(true)}
        onSelectAlert={(id) => { setSelectedAlertId(id); setAlertPhase('view'); }}
      />
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
        <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0 }}>
          {askJivaOpen && selectedAlert ? (
            <>
              {detailPanel}
              <AskJivaPanel alert={selectedAlert} onClose={() => setAskJivaOpen(false)} />
            </>
          ) : (
            <>
              <AlertListPanel
                selectedAlertId={selectedAlertId}
                resolvedAlertIds={resolvedAlertIds}
                onSelectAlert={(id) => { setSelectedAlertId(id); setAlertPhase('view'); setAskJivaOpen(false); }}
                onOpenItemsForAlert={(id) => { setSelectedAlertId(id); setAlertPhase('view'); setItemsModalOpen(true); }}
                onFilteredChange={setFilteredAlertIds}
              />
              {detailPanel}
            </>
          )}
        </div>
      </div>
    );
  };

  const renderMeetings = () => {
    const isCompleted = selectedMeetingId ? COMPLETED_MEETINGS.some((m) => m.id === selectedMeetingId) : false;

    const detailPanel = isCompleted ? (
      <MeetingMOM meetingId={selectedMeetingId} onGoWorkstation={() => goTab('workstation')} />
    ) : (
      <MeetingDetailPanel meetingId={selectedMeetingId} onCreatePresentation={() => setMeetingAskJivaOpen(true)} />
    );

    return (
      <div style={{ display: 'flex', gap: 16, height: '100%' }}>
        {meetingAskJivaOpen && selectedMeetingId && !isCompleted ? (
          <>
            {detailPanel}
            <AskJivaMeetingPanel meetingId={selectedMeetingId} onClose={() => setMeetingAskJivaOpen(false)} />
          </>
        ) : (
          <>
            <MeetingListPanel selectedMeetingId={selectedMeetingId} onSelectMeeting={openMeeting} />
            {detailPanel}
          </>
        )}
      </div>
    );
  };

  const tabContent = () => {
    switch (activeTab) {
      case 'brief': return renderBrief();
      case 'alerts': return renderAlerts();
      case 'meetings': return renderMeetings();
      case 'workstation':
        return (
          <WorkStation
            onOpenAlert={openAlert}
            onOpenMeeting={(id) => { setActiveTab('meetings'); setSelectedMeetingId(id); setMeetingAskJivaOpen(false); }}
          />
        );
    }
  };

  const viewToggle = activeTab === 'brief'
    ? (
      <div style={{ display: 'flex', padding: 3, background: '#f1f2f4', borderRadius: 8, gap: 2 }}>
        {(['brief', 'dashboard'] as const).map((m) => (
          <span
            key={m}
            onClick={() => setBriefViewMode(m)}
            style={{
              padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
              font: '600 11.5px/1 Inter,sans-serif',
              color: briefViewMode === m ? '#5f3880' : '#6b7178',
              background: briefViewMode === m ? '#fff' : 'transparent',
              boxShadow: briefViewMode === m ? '0 1px 4px rgba(20,24,33,.12)' : 'none',
              transition: 'all .15s ease',
            }}
          >
            {m === 'brief' ? 'Brief' : 'Dashboard'}
          </span>
        ))}
      </div>
    )
    : null;

  return (
    <div className={styles.signalsPage}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Signals</span>
        <div className={styles.avatarCircle} />
      </div>

      <nav className={styles.tabBar}>
        <div style={{ display: 'flex', gap: 22 }}>
          {SIGNAL_TABS.map((t) => (
            <button
              key={t.key}
              className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ''}`}
              onClick={() => goTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className={styles.tabBarRight}>
          {viewToggle}
          <span style={{ position: 'relative' }}>
            <button className={styles.dateRangeBtn} onClick={() => setAccountFilterOpen(!accountFilterOpen)}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 3h12l-4.5 5.5V13l-3-1.5V8.5L2 3z" stroke="#5f3880" strokeWidth="1.4" strokeLinejoin="round" /></svg>
              {accountFilterLabel}
              <CaretDown size={9} color="#5f3880" weight="bold" />
            </button>
            {accountFilterOpen && (
              <AccountFilterDropdown
                marketplaces={filterMarketplaces}
                countries={filterCountries}
                brands={filterBrands}
                onToggleMarketplace={toggleFilterMarketplace}
                onToggleCountry={toggleFilterCountry}
                onToggleBrand={toggleFilterBrand}
                onAll={clearAccountFilters}
              />
            )}
          </span>
          <span style={{ position: 'relative' }}>
            <button className={styles.dateRangeBtn} onClick={() => setCalendarOpen(!calendarOpen)}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10.5" rx="1.5" stroke="#5f3880" strokeWidth="1.4" /><path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" stroke="#5f3880" strokeWidth="1.4" strokeLinecap="round" /></svg>
              {rangeLabel}
              <CaretDown size={9} color="#5f3880" weight="bold" />
            </button>
            {calendarOpen && (
              <CalendarPopover
                onToday={() => { setRangeLabel('Today · 1 Nov'); setCalendarOpen(false); }}
                onThisWeek={() => { setRangeLabel('This week · 26 Oct – 1 Nov'); setCalendarOpen(false); }}
                onClose={() => setCalendarOpen(false)}
              />
            )}
          </span>
        </div>
      </nav>

      <div className={styles.content}>
        <div className={styles.tabContent}>
          {tabContent()}
        </div>
      </div>
    </div>
  );
}
