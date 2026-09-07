import { useState, useEffect, useCallback } from 'react';
import { CaretDown, CaretLeft, CaretRight } from '@phosphor-icons/react';
import styles from './signals-page.module.scss';
import { SIGNAL_TABS, type SignalTabKey, type BriefState } from '@/constants/signals/tabs.constants';
import { BriefFull } from '../../signals/brief/brief-full';
import { BriefNoIntegration } from '../../signals/brief/brief-no-integration';
import { BriefOnboard } from '../../signals/brief/brief-onboard';
import { AlertListPanel } from '../../signals/alerts/alert-list-panel';
import { AlertDetailPanel } from '../../signals/alerts/alert-detail-panel';
import { MeetingListPanel } from '../../signals/meetings/meeting-list-panel';
import { MeetingDetailPanel } from '../../signals/meetings/meeting-detail-panel';
import { MeetingPrep } from '../../signals/meetings/meeting-prep';
import { MeetingPresentation } from '../../signals/meetings/meeting-presentation';
import { MeetingMOM } from '../../signals/meetings/meeting-mom';
import { WorkStation } from '../../signals/work-station/work-station';
import { CalendarPopover } from '../../signals/common/calendar-popover';
import { PROTOTYPE_ALERTS, type PrototypeAlert } from '@/constants/signals/prototype-data';

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

  const selectedAlert = PROTOTYPE_ALERTS.find((a) => a.id === selectedAlertId) ?? null;

  const goTab = useCallback((tab: SignalTabKey) => {
    setActiveTab(tab);
    setSelectedAlertId(null);
    setSelectedMeetingId(null);
    setMeetingScreen('list');
    setAlertPhase('view');
    setBriefFullSubScreen('main');
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
    setAlertPhase('executing');
    setExecProgress(0);
    const timer = setInterval(() => {
      setExecProgress((prev) => {
        const next = Math.min(100, prev + 20);
        if (next >= 100) clearInterval(timer);
        return next;
      });
    }, 650);
  }, []);

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
    switch (briefState) {
      case 'full':
        return (
          <BriefFull
            onAlertClick={openAlert}
            onMeetingClick={() => { goTab('meetings'); }}
            subScreen={briefFullSubScreen}
            onNudgeOpen={() => setBriefFullSubScreen('nudge')}
            onNudgeClose={() => setBriefFullSubScreen('main')}
            onScopeChange={() => {}}
          />
        );
      case 'nointeg':
        return <BriefNoIntegration onAlertClick={openAlert} />;
      case 'onboard':
        return <BriefOnboard onComplete={() => setBriefState('full')} onSkip={() => setBriefState('nointeg')} />;
    }
  };

  const renderAlerts = () => (
    <div style={{ display: 'flex', gap: 16, height: '100%' }}>
      <AlertListPanel
        selectedAlertId={selectedAlertId}
        onSelectAlert={(id) => { setSelectedAlertId(id); setAlertPhase('view'); }}
      />
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
      />
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
