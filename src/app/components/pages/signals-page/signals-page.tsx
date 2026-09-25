import { useState, useEffect, useCallback, useRef } from 'react';
import { CaretDown, CaretLeft, CaretRight } from '@phosphor-icons/react';
import styles from './signals-page.module.scss';
import { SIGNAL_TABS, type SignalTabKey, type BriefState } from '@/constants/signals/tabs.constants';
import { BriefWidgetGrid } from '../../signals/brief/widgets/brief-widget-grid';
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
import { AlertsCollapsedSliver } from '../../signals/alerts/alerts-collapsed-rail';
import { MeetingsCollapsedRail } from '../../signals/meetings/meetings-collapsed-rail';
import { ResizeHandle, useResizableColumn } from '../../signals/common/resizable-column';
import { PROTOTYPE_ALERTS, COMPLETED_MEETINGS, MEETING_LIST, type LoggedActionItem, type MpBrand } from '@/constants/signals/prototype-data';
import DiamondMascot from '../../common/diamond-mascot/diamond-mascot';
import motion from '../../signals/alerts/motion.module.scss';

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
  const [alertPhase, setAlertPhase] = useState<'view' | 'executing' | 'report' | 'genReview'>('view');
  const [execProgress, setExecProgress] = useState(0);
  const [itemsModalOpen, setItemsModalOpen] = useState(false);
  const [loggedActions, setLoggedActions] = useState<LoggedActionItem[]>([]);
  const [resolvedAlertIds, setResolvedAlertIds] = useState<Set<string>>(new Set());
  const [filteredAlertIds, setFilteredAlertIds] = useState<string[]>(() => PROTOTYPE_ALERTS.map((a) => a.id));
  const [askJivaOpen, setAskJivaOpen] = useState(false);
  const [globalJivaOpen, setGlobalJivaOpen] = useState(false);
  const [applyCategoryFilter, setApplyCategoryFilter] = useState<{ category: string; nonce: number } | null>(null);
  const [applyMeetingFilter, setApplyMeetingFilter] = useState<{ kind: 'day' | 'status' | 'clear'; value?: string; nonce: number } | null>(null);
  // Alerts' collapsed column is a thin sliver behind the detail panel that reveals the real list as
  // a floating overlay on hover, instead of a fixed small rail like Meetings/Work-station.
  const [alertsHovering, setAlertsHovering] = useState(false);

  const selectedAlert = PROTOTYPE_ALERTS.find((a) => a.id === selectedAlertId) ?? null;
  // The Ask Jiva variation is a one-alert concept demo, anchored to whichever alert leads today's list.
  const firstAlertId = PROTOTYPE_ALERTS.find((a) => a.day === 'today')?.id ?? PROTOTYPE_ALERTS[0]?.id;
  // The header's persistent Ask Jiva button has no alert/meeting of its own to anchor to — fall back to whichever one is selected, or today's first, or the very first.
  const globalJivaAlert = selectedAlert ?? PROTOTYPE_ALERTS.find((a) => a.id === firstAlertId) ?? PROTOTYPE_ALERTS[0];
  const globalJivaMeetingId = selectedMeetingId ?? MEETING_LIST.find((m) => m.isToday)?.id ?? MEETING_LIST[0]?.id ?? null;

  // Column widths: List and Jiva are user-resizable (drag the handle on their shared border);
  // Detail always just fills whatever's left. Only the list/overview column collapses below a
  // minimum — dragged past that point it snaps into its own tab-specific collapsed rail instead
  // of clamping at an unreadable width.
  // minWidth is 260, not a round 220 — alert cards' badge row and detail lines genuinely need that
  // much room; narrower and content clips/overlaps instead of wrapping cleanly (confirmed live).
  const alertsListCol = useResizableColumn({ defaultWidth: 320, minWidth: 260, maxWidth: 480, collapseBelow: 160, collapsedWidth: 14 });
  const alertsJivaCol = useResizableColumn({ defaultWidth: 340, minWidth: 260, maxWidth: 480, edge: 'left' });
  const meetingsListCol = useResizableColumn({ defaultWidth: 320, minWidth: 220, maxWidth: 480, collapseBelow: 160, collapsedWidth: 52 });
  const meetingsJivaCol = useResizableColumn({ defaultWidth: 340, minWidth: 260, maxWidth: 480, edge: 'left' });

  // Once a drag commits Alerts' column to a real permanent width, start fresh (not mid-peek) the next time it collapses.
  useEffect(() => {
    if (!alertsListCol.collapsed) setAlertsHovering(false);
  }, [alertsListCol.collapsed]);

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
          <BriefWidgetGrid />
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
        onOpenAskJiva={() => { setAskJivaOpen(true); setGlobalJivaOpen(false); }}
        onFilterCategory={(category) => setApplyCategoryFilter({ category, nonce: Date.now() })}
        onBack={() => setSelectedAlertId(null)}
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
              {alertsListCol.collapsed ? (
                <div
                  onMouseEnter={() => setAlertsHovering(true)}
                  onMouseLeave={() => setAlertsHovering(false)}
                  style={{ flex: '0 0 14px', position: 'relative' as const, height: '100%' }}
                >
                  <div
                    style={{
                      position: 'absolute' as const, left: 0, top: 0, bottom: 0,
                      width: alertsHovering ? alertsListCol.width : 14,
                      display: 'flex',
                      zIndex: alertsHovering ? 40 : 1,
                      transition: alertsListCol.dragging ? 'none' : 'width 150ms ease-out',
                      boxShadow: alertsHovering ? '14px 0 32px rgba(20,24,33,.22)' : 'none',
                    }}
                  >
                    {/* overflow:hidden lives on this inner box so it clips the panel/sliver content without also clipping the resize handle, which deliberately overhangs the outer box's edge. */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', borderRadius: 10, overflow: 'hidden' }}>
                      {alertsHovering ? (
                        <AlertListPanel
                          selectedAlertId={selectedAlertId}
                          resolvedAlertIds={resolvedAlertIds}
                          onSelectAlert={(id) => { setSelectedAlertId(id); setAlertPhase('view'); setAskJivaOpen(false); }}
                          onOpenItemsForAlert={(id) => { setSelectedAlertId(id); setAlertPhase('view'); setItemsModalOpen(true); }}
                          onFilteredChange={setFilteredAlertIds}
                          applyCategoryFilter={applyCategoryFilter}
                          width={alertsListCol.width}
                        />
                      ) : (
                        <AlertsCollapsedSliver />
                      )}
                    </div>
                    {/* Grabbing this while peeking commits the column to a real, permanent width instead of just previewing — dragging past collapseBelow un-collapses it live, same as any other handle. */}
                    {alertsHovering && (
                      <ResizeHandle dragHandleProps={alertsListCol.dragHandlePropsFrom(alertsListCol.width)} active={alertsListCol.dragging} />
                    )}
                  </div>
                </div>
              ) : (
                <AlertListPanel
                  selectedAlertId={selectedAlertId}
                  resolvedAlertIds={resolvedAlertIds}
                  onSelectAlert={(id) => { setSelectedAlertId(id); setAlertPhase('view'); setAskJivaOpen(false); }}
                  onOpenItemsForAlert={(id) => { setSelectedAlertId(id); setAlertPhase('view'); setItemsModalOpen(true); }}
                  onFilteredChange={setFilteredAlertIds}
                  applyCategoryFilter={applyCategoryFilter}
                  width={alertsListCol.width}
                />
              )}
              <div style={{ position: 'relative' as const, display: 'flex', flex: 1, minWidth: 0, height: '100%' }}>
                {detailPanel}
                <ResizeHandle dragHandleProps={alertsListCol.dragHandleProps} active={alertsListCol.dragging} side="left" />
              </div>
              {globalJivaOpen && (
                <div style={{ position: 'relative' as const, display: 'flex', flex: `0 0 ${alertsJivaCol.width}px`, height: '100%' }}>
                  <ResizeHandle dragHandleProps={alertsJivaCol.dragHandleProps} active={alertsJivaCol.dragging} side="left" />
                  <AskJivaPanel key={globalJivaAlert.id} alert={globalJivaAlert} onClose={() => setGlobalJivaOpen(false)} width={alertsJivaCol.width} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  const renderMeetings = () => {
    const isCompleted = selectedMeetingId ? COMPLETED_MEETINGS.some((m) => m.id === selectedMeetingId) : false;

    const detailPanel = isCompleted ? (
      <MeetingMOM meetingId={selectedMeetingId} onGoWorkstation={() => goTab('workstation')} onBack={() => setSelectedMeetingId(null)} />
    ) : (
      <MeetingDetailPanel meetingId={selectedMeetingId} onCreatePresentation={() => { setMeetingAskJivaOpen(true); setGlobalJivaOpen(false); }} onFilterCategory={(f) => setApplyMeetingFilter({ ...f, nonce: Date.now() })} onOpenMeeting={openMeeting} onBack={() => setSelectedMeetingId(null)} />
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
            {meetingsListCol.collapsed ? (
              <MeetingsCollapsedRail count={MEETING_LIST.length} onExpand={meetingsListCol.expand} />
            ) : (
              <MeetingListPanel selectedMeetingId={selectedMeetingId} onSelectMeeting={openMeeting} applyFilter={applyMeetingFilter} width={meetingsListCol.width} />
            )}
            <div style={{ position: 'relative' as const, display: 'flex', flex: 1, minWidth: 0, height: '100%' }}>
              {detailPanel}
              <ResizeHandle dragHandleProps={meetingsListCol.dragHandleProps} active={meetingsListCol.dragging} side="left" />
            </div>
            {globalJivaOpen && !isCompleted && globalJivaMeetingId && (
              <div style={{ position: 'relative' as const, display: 'flex', flex: `0 0 ${meetingsJivaCol.width}px`, height: '100%' }}>
                <ResizeHandle dragHandleProps={meetingsJivaCol.dragHandleProps} active={meetingsJivaCol.dragging} side="left" />
                <AskJivaMeetingPanel key={globalJivaMeetingId} meetingId={globalJivaMeetingId} onClose={() => setGlobalJivaOpen(false)} width={meetingsJivaCol.width} />
              </div>
            )}
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
            forceJivaOpen={globalJivaOpen}
          />
        );
    }
  };

  return (
    <div className={styles.signalsPage}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Signals</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
          <span
            onClick={() => { setAskJivaOpen(false); setMeetingAskJivaOpen(false); setGlobalJivaOpen((v) => !v); }}
            className={`${motion.pressable} ${motion.btnPrimary}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 999, background: globalJivaOpen ? '#5f3880' : '#77469b', color: '#fff', font: '600 12px/1 Inter,sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' as const }}
            title="See the list, detail and Jiva chat together on Alerts, Meetings and Work-station"
          >
            <DiamondMascot size={15} /> Ask Jiva
          </span>
          <div className={styles.avatarCircle} />
        </div>
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
      </nav>

      <div className={styles.content}>
        <div className={styles.tabContent}>
          {tabContent()}
        </div>
      </div>
    </div>
  );
}
