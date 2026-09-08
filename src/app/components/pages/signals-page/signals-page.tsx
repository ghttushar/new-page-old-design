import { useState, useEffect, useCallback } from 'react';
import { CaretDown, CaretLeft, CaretRight } from '@phosphor-icons/react';
import styles from './signals-page.module.scss';
import { SIGNAL_TABS, type SignalTabKey, type BriefState } from '@/constants/signals/tabs.constants';
import { BriefFull } from '../../signals/brief/brief-full';
import { BriefDashboard } from '../../signals/brief/brief-dashboard';
import { BriefNoIntegration } from '../../signals/brief/brief-no-integration';
import { BriefOnboard } from '../../signals/brief/brief-onboard';
import { AlertListPanel } from '../../signals/alerts/alert-list-panel';
import { AlertDetailPanel } from '../../signals/alerts/alert-detail-panel';
import { AlertSpeedCard } from '../../signals/alerts/alert-speed-card';
import { BoltIcon } from '../../signals/alerts/icons';
import { MeetingListPanel } from '../../signals/meetings/meeting-list-panel';
import { MeetingDetailPanel } from '../../signals/meetings/meeting-detail-panel';
import { MeetingPrep } from '../../signals/meetings/meeting-prep';
import { MeetingPresentation } from '../../signals/meetings/meeting-presentation';
import { MeetingMOM } from '../../signals/meetings/meeting-mom';
import { WorkStation } from '../../signals/work-station/work-station';
import { CalendarPopover } from '../../signals/common/calendar-popover';
import { PROTOTYPE_ALERTS, type PrototypeAlert, type LoggedActionItem } from '@/constants/signals/prototype-data';

type MeetingScreen = 'list' | 'detail' | 'prep' | 'presentation' | 'mom';

export function SignalsPage() {
  const [activeTab, setActiveTab] = useState<SignalTabKey>('brief');
  const [briefState, setBriefState] = useState<BriefState>('full');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [meetingScreen, setMeetingScreen] = useState<MeetingScreen>('list');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [rangeLabel, setRangeLabel] = useState('Today · 1 Nov');
  const [briefFullSubScreen, setBriefFullSubScreen] = useState<'main' | 'nudge'>('main');
  const [alertPhase, setAlertPhase] = useState<'view' | 'executing' | 'report' | 'genReview'>('view');
  const [execProgress, setExecProgress] = useState(0);
  const [itemsModalOpen, setItemsModalOpen] = useState(false);
  const [loggedActions, setLoggedActions] = useState<LoggedActionItem[]>([]);
  const [alertsViewMode, setAlertsViewMode] = useState<'normal' | 'speed'>('normal');
  const [briefViewMode, setBriefViewMode] = useState<'brief' | 'dashboard'>('brief');
  const [resolvedAlertIds, setResolvedAlertIds] = useState<Set<string>>(new Set());
  const [filteredAlertIds, setFilteredAlertIds] = useState<string[]>(() => PROTOTYPE_ALERTS.map((a) => a.id));

  const selectedAlert = PROTOTYPE_ALERTS.find((a) => a.id === selectedAlertId) ?? null;
  const selectedAlertIndex = PROTOTYPE_ALERTS.findIndex((a) => a.id === selectedAlertId);

  // Speed Mode cycles through whatever the list panel's active search/filter currently shows,
  // not the full alert set — approving a filtered alert should not jump you outside the filter.
  const speedQueue = filteredAlertIds.length > 0
    ? PROTOTYPE_ALERTS.filter((a) => filteredAlertIds.includes(a.id))
    : PROTOTYPE_ALERTS;
  const speedIndex = speedQueue.findIndex((a) => a.id === selectedAlertId);

  const logAction = useCallback((item: LoggedActionItem) => {
    setLoggedActions((prev) => [item, ...prev]);
  }, []);

  const markResolved = useCallback((id: string | null) => {
    if (!id) return;
    setResolvedAlertIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);

  const advanceToNextAlert = useCallback(() => {
    setSelectedAlertId((current) => {
      const queue = filteredAlertIds.length > 0
        ? PROTOTYPE_ALERTS.filter((a) => filteredAlertIds.includes(a.id))
        : PROTOTYPE_ALERTS;
      const idx = queue.findIndex((a) => a.id === current);
      const next = idx >= 0 ? queue[idx + 1] : queue[0];
      return next ? next.id : null;
    });
    setAlertPhase('view');
  }, [filteredAlertIds]);

  const goTab = useCallback((tab: SignalTabKey) => {
    setActiveTab(tab);
    setSelectedAlertId(null);
    setSelectedMeetingId(null);
    setMeetingScreen('list');
    setAlertPhase('view');
    setBriefFullSubScreen('main');
    setBriefViewMode('brief');
  }, []);

  const openAlert = useCallback((id: string) => {
    setActiveTab('alerts');
    setSelectedAlertId(id);
    setAlertPhase('view');
  }, []);

  const openMeeting = useCallback((id: string) => {
    setSelectedMeetingId(id);
    setMeetingScreen('detail');
  }, []);

  const handleExecute = useCallback(() => {
    markResolved(selectedAlertId);
    setAlertPhase('executing');
    setExecProgress(0);
    const timer = setInterval(() => {
      setExecProgress((prev) => {
        const next = Math.min(100, prev + 20);
        if (next >= 100) clearInterval(timer);
        return next;
      });
    }, 650);
  }, [selectedAlertId, markResolved]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (calendarOpen) setCalendarOpen(false);
        else if (selectedAlertId) setSelectedAlertId(null);
        else if (selectedMeetingId) {
          setSelectedMeetingId(null);
          setMeetingScreen('list');
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
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', flex: 'none' }}>
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
        </div>
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

  const renderAlerts = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', flex: 'none' }}>
        <div style={{ display: 'flex', padding: 3, background: '#f1f2f4', borderRadius: 8, gap: 2 }}>
          {(['normal', 'speed'] as const).map((m) => (
            <span
              key={m}
              onClick={() => {
                setAlertsViewMode(m);
                if (m === 'speed' && !selectedAlertId && speedQueue[0]) {
                  setSelectedAlertId(speedQueue[0].id);
                  setAlertPhase('view');
                }
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
                font: '600 11.5px/1 Inter,sans-serif',
                color: alertsViewMode === m ? '#5f3880' : '#6b7178',
                background: alertsViewMode === m ? '#fff' : 'transparent',
                boxShadow: alertsViewMode === m ? '0 1px 4px rgba(20,24,33,.12)' : 'none',
                transition: 'all .15s ease',
              }}
            >
              {m === 'speed' && <BoltIcon size={11} color={alertsViewMode === m ? '#5f3880' : '#6b7178'} />}
              {m === 'normal' ? 'Normal' : 'Speed'}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0 }}>
        <AlertListPanel
          selectedAlertId={selectedAlertId}
          resolvedAlertIds={resolvedAlertIds}
          onSelectAlert={(id) => { setSelectedAlertId(id); setAlertPhase('view'); }}
          onOpenItemsForAlert={(id) => { setSelectedAlertId(id); setAlertPhase('view'); setItemsModalOpen(true); }}
          onFilteredChange={setFilteredAlertIds}
        />
        {alertsViewMode === 'speed' ? (
          <AlertSpeedCard
            alert={selectedAlert}
            position={speedIndex >= 0 ? speedIndex + 1 : selectedAlertIndex + 1}
            total={speedQueue.length || PROTOTYPE_ALERTS.length}
            onLogAction={logAction}
            onAdvance={advanceToNextAlert}
            onResolve={markResolved}
          />
        ) : (
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
          />
        )}
      </div>
    </div>
  );

  const renderMeetings = () => {
    switch (meetingScreen) {
      case 'detail':
        return (
          <div style={{ display: 'flex', gap: 16, height: '100%' }}>
            <MeetingListPanel
              selectedMeetingId={selectedMeetingId}
              onSelectMeeting={openMeeting}
            />
            <MeetingDetailPanel
              meetingId={selectedMeetingId}
              onOpenAlert={openAlert}
              onPrepare={() => setMeetingScreen('prep')}
              onBack={() => { setMeetingScreen('list'); setSelectedMeetingId(null); }}
              onOpenMOM={() => setMeetingScreen('mom')}
            />
          </div>
        );
      case 'prep':
        return (
          <MeetingPrep
            onBack={() => setMeetingScreen('detail')}
            onCreatePresentation={() => setMeetingScreen('presentation')}
          />
        );
      case 'presentation':
        return (
          <MeetingPresentation
            onBack={() => setMeetingScreen('prep')}
          />
        );
      case 'mom':
        return (
          <MeetingMOM
            onBackToMeetings={() => { goTab('meetings'); setSelectedMeetingId(null); setMeetingScreen('list'); }}
            onGoWorkstation={() => goTab('workstation')}
          />
        );
      default:
        return (
          <div style={{ display: 'flex', gap: 16, height: '100%' }}>
            <MeetingListPanel
              selectedMeetingId={selectedMeetingId}
              onSelectMeeting={openMeeting}
            />
            <div style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10 }}>
              <div style={{ textAlign: 'center', maxWidth: 340 }}>
                <div style={{ font: '600 15px/1.4 Inter,sans-serif', color: '#23272d' }}>Select a meeting</div>
                <div style={{ font: '400 13px/1.7 Inter,sans-serif', color: '#6b7178', marginTop: 8 }}>Agenda, account study, linked alerts and preparation open here. Completed meetings open their minutes instead.</div>
              </div>
            </div>
          </div>
        );
    }
  };

  const tabContent = () => {
    switch (activeTab) {
      case 'brief': return renderBrief();
      case 'alerts': return renderAlerts();
      case 'meetings': return renderMeetings();
      case 'workstation': return <WorkStation />;
    }
  };

  return (
    <div className={styles.signalsPage}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Signals</span>
        <div className={styles.headerRight}>
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
          <div className={styles.avatarCircle} />
        </div>
      </div>

      <nav className={styles.tabBar}>
        {SIGNAL_TABS.map((t) => (
          <button
            key={t.key}
            className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ''}`}
            onClick={() => goTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className={styles.content}>
        <div className={styles.tabContent}>
          {tabContent()}
        </div>
      </div>
    </div>
  );
}
