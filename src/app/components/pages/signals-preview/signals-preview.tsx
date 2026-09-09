import { useState } from 'react';
import {
  PROTOTYPE_ALERTS,
  MEETING_LIST,
} from '@/constants/signals/prototype-data';
import { ACTION_TYPES } from '@/constants/signals/action-types.constants';

import { SignalsPage } from '../signals-page/signals-page';

import { BriefFull } from '../../signals/brief/brief-full';
import { BriefDashboard } from '../../signals/brief/brief-dashboard';
import { BriefNoIntegration } from '../../signals/brief/brief-no-integration';
import { BriefOnboard } from '../../signals/brief/brief-onboard';

import { AlertListPanel } from '../../signals/alerts/alert-list-panel';
import { AlertDetailPanel } from '../../signals/alerts/alert-detail-panel';
import { AlertSpeedCard } from '../../signals/alerts/alert-speed-card';
import { AskJivaPanel } from '../../signals/alerts/ask-jiva-panel';
import { ActionPicker } from '../../signals/alerts/action-picker';
import { ComposeMail } from '../../signals/alerts/compose-mail';
import { ImageGenStudio } from '../../signals/alerts/image-gen-studio';
import { ItemsModal } from '../../signals/alerts/items-modal';
import { AssignDropdownList, AssignPopupModal, DEFAULT_ASSIGNEES } from '../../signals/alerts/assign-menu';
import { getDisplayItems } from '../../signals/alerts/items-util';

import { MeetingListPanel } from '../../signals/meetings/meeting-list-panel';
import { MeetingDetailPanel } from '../../signals/meetings/meeting-detail-panel';
import { MeetingPrep } from '../../signals/meetings/meeting-prep';
import { MeetingPresentation } from '../../signals/meetings/meeting-presentation';
import { MeetingMOM } from '../../signals/meetings/meeting-mom';

import { WorkStation } from '../../signals/work-station/work-station';

const noop = () => {};
const noopId = (_id: string) => {};
const noopAsync = async () => [] as Record<string, unknown>[];

const firstAlert = PROTOTYPE_ALERTS.find((a) => a.id === 'a1')!;
const normalAlert = PROTOTYPE_ALERTS.find((a) => a.id === 'a2')!;
const imageAlert = PROTOTYPE_ALERTS.find((a) => a.id === 'a15')!;

const MANY_ASSIGNEES = [
  ...DEFAULT_ASSIGNEES,
  { id: 'p5', name: 'Aditi Rao', role: 'Client · Nutrabay' },
  { id: 'p6', name: 'Karan Mehta', role: 'Ops' },
  { id: 'p7', name: 'Wellbeing Nutrition pod', role: 'Team' },
  { id: 'p8', name: 'Rahul Gupta', role: 'Client · Nutrabay' },
  { id: 'p9', name: 'Sneha Iyer', role: 'Client · Nutrabay' },
  { id: 'p10', name: 'Priya Nair', role: 'Client · Wellbeing' },
  { id: 'p11', name: 'Ritvik Sharma', role: 'Ops' },
  { id: 'p12', name: 'Boldfit pod', role: 'Team' },
  { id: 'p13', name: 'Growth pod', role: 'Team' },
  { id: 'p14', name: 'Ananya Das', role: 'Marketing' },
  { id: 'p15', name: 'Vikram Nair', role: 'Ops' },
  { id: 'p16', name: 'Leadership', role: 'Team' },
];

function Nav() {
  const items = [
    ['live', 'Live app'],
    ['brief', 'Brief'],
    ['alerts', 'Alerts'],
    ['meetings', 'Meetings'],
    ['workstation', 'Work-station'],
    ['shared', 'Shared'],
  ];
  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', gap: 4, padding: '10px 24px', background: '#fff', borderBottom: '1px solid #e6e8ec', flexWrap: 'wrap' as const }}>
      <span style={{ font: '700 13px/1 Inter,sans-serif', color: '#23272d', marginRight: 12, alignSelf: 'center' }}>Signals — component preview</span>
      {items.map(([id, label]) => (
        <a key={id} href={`#${id}`} style={{ padding: '6px 11px', borderRadius: 6, font: '600 12px/1 Inter,sans-serif', color: '#5f3880', textDecoration: 'none', background: '#f9f7fc' }}>{label}</a>
      ))}
      <span style={{ marginLeft: 'auto', font: '400 11px/1.4 Inter,sans-serif', color: '#9aa0a8', alignSelf: 'center' }}>Point html.to.design at each frame below</span>
    </nav>
  );
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} style={{ scrollMarginTop: 60, font: '800 22px/1 Inter,sans-serif', color: '#23272d', margin: '56px 0 4px', paddingTop: 24, borderTop: '3px solid #23272d' }}>{children}</h2>
  );
}

function Frame({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' as const }}>
        <span style={{ font: '700 13px/1 Inter,sans-serif', color: '#23272d' }}>{label}</span>
        {note && <span style={{ font: '400 11.5px/1.4 Inter,sans-serif', color: '#9aa0a8' }}>{note}</span>}
      </div>
      <div style={{ border: '1px solid #cfc7dc', borderRadius: 6, background: '#fbfafd', padding: 16, overflow: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

/** Fills position:fixed descendants to this box instead of the viewport — CSS containing-block trick (any transform value works). */
const containFixed: React.CSSProperties = { position: 'relative', transform: 'translateZ(0)', overflow: 'hidden' };

export default function SignalsPreviewPage() {
  const [itemsModalOpen, setItemsModalOpen] = useState(true);

  return (
    <div style={{ background: '#eee9f4', minHeight: '100vh', fontFamily: 'Inter,sans-serif' }}>
      <Nav />
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 24px 120px' }}>

        {/* ================= LIVE APP ================= */}
        <SectionTitle id="live">Live app</SectionTitle>
        <p style={{ font: '400 13px/1.6 Inter,sans-serif', color: '#6b7178', maxWidth: '70ch' }}>
          The real, fully interactive Signals app — click through Brief / Alerts / Meetings / Work-station directly here for anything reachable by clicking (filters, menus, hover states, Speed Mode, task status changes). Everything below this is a state that needs a specific alert, meeting or phase forced in, so it's rendered separately.
        </p>
        <Frame label="Signals — live, interactive">
          <div style={{ height: 860, width: '100%', background: '#f6f5f8', borderRadius: 8, overflow: 'hidden', padding: 8 }}>
            <SignalsPage />
          </div>
        </Frame>

        {/* ================= BRIEF ================= */}
        <SectionTitle id="brief">Brief</SectionTitle>

        <Frame label="Brief — default">
          <div style={{ height: 760, display: 'flex' }}>
            <BriefFull onAlertClick={noopId} onMeetingClick={noop} subScreen="main" onNudgeOpen={noop} onNudgeClose={noop} onScopeChange={noop} />
          </div>
        </Frame>

        <Frame label="Brief — Nudge panel" note="subScreen='nudge' — no button reaches this in the live app yet, driven here directly">
          <div style={{ height: 760, display: 'flex' }}>
            <BriefFull onAlertClick={noopId} onMeetingClick={noop} subScreen="nudge" onNudgeOpen={noop} onNudgeClose={noop} onScopeChange={noop} />
          </div>
        </Frame>

        <Frame label="Brief — No-integration state" note="reachable only by editing signals-page.tsx's initial briefState; rendered directly here">
          <div style={{ height: 760, display: 'flex' }}>
            <BriefNoIntegration onAlertClick={noopId} />
          </div>
        </Frame>

        <Frame label="Brief — Onboarding, step 1 of 4" note="reachable only by editing signals-page.tsx's initial briefState; rendered directly here">
          <div style={{ height: 760, display: 'flex' }}>
            <BriefOnboard onComplete={noop} onSkip={noop} />
          </div>
        </Frame>

        <Frame label="Dashboard">
          <div style={{ height: 760, display: 'flex' }}>
            <BriefDashboard />
          </div>
        </Frame>

        {/* ================= ALERTS ================= */}
        <SectionTitle id="alerts">Alerts</SectionTitle>
        <p style={{ font: '400 13px/1.6 Inter,sans-serif', color: '#6b7178', maxWidth: '70ch' }}>
          The list panel is paired with the right-hand content every time, matching how the real page composes them.
        </p>

        <Frame label="Normal mode — nothing selected">
          <div style={{ height: 760, display: 'flex', gap: 16 }}>
            <AlertListPanel selectedAlertId={null} resolvedAlertIds={new Set()} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
            <AlertDetailPanel alert={null} phase="view" execProgress={0} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} onSelectAlert={noopId} />
          </div>
        </Frame>

        <Frame label="Normal mode — first alert (Ask Jiva variation)" note="the trimmed header + 'Ask Jiva' entry point, only on this one alert">
          <div style={{ height: 760, display: 'flex', gap: 16 }}>
            <AlertListPanel selectedAlertId={firstAlert.id} resolvedAlertIds={new Set()} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
            <AlertDetailPanel alert={firstAlert} phase="view" execProgress={0} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} isFirstAlert onOpenAskJiva={noop} onSelectAlert={noopId} />
          </div>
        </Frame>

        <Frame label="Normal mode — Ask Jiva panel open" note="replaces the list column entirely">
          <div style={{ height: 760, display: 'flex', gap: 16 }}>
            <AskJivaPanel alert={firstAlert} onClose={noop} />
            <AlertDetailPanel alert={firstAlert} phase="view" execProgress={0} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} isFirstAlert onOpenAskJiva={noop} onSelectAlert={noopId} />
          </div>
        </Frame>

        <Frame label="Normal mode — a repeated alert selected" note="badge row shows the repeat + meeting-free state; also the alert whose recommended action generates an image">
          <div style={{ height: 760, display: 'flex', gap: 16 }}>
            <AlertListPanel selectedAlertId={imageAlert.id} resolvedAlertIds={new Set()} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
            <AlertDetailPanel alert={imageAlert} phase="view" execProgress={0} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} onSelectAlert={noopId} />
          </div>
        </Frame>

        <Frame label="Detail panel — executing (in progress)">
          <div style={{ height: 760, display: 'flex', gap: 16 }}>
            <AlertListPanel selectedAlertId={normalAlert.id} resolvedAlertIds={new Set([normalAlert.id])} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
            <AlertDetailPanel alert={normalAlert} phase="executing" execProgress={40} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} onUndoExecute={noop} onSelectAlert={noopId} />
          </div>
        </Frame>

        <Frame label="Detail panel — executing (completed, 100%)">
          <div style={{ height: 760, display: 'flex', gap: 16 }}>
            <AlertListPanel selectedAlertId={normalAlert.id} resolvedAlertIds={new Set([normalAlert.id])} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
            <AlertDetailPanel alert={normalAlert} phase="executing" execProgress={100} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} onUndoExecute={noop} onSelectAlert={noopId} />
          </div>
        </Frame>

        <Frame label="Detail panel — impact report">
          <div style={{ height: 760, display: 'flex', gap: 16 }}>
            <AlertListPanel selectedAlertId={normalAlert.id} resolvedAlertIds={new Set([normalAlert.id])} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
            <AlertDetailPanel alert={normalAlert} phase="report" execProgress={100} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} onSelectAlert={noopId} />
          </div>
        </Frame>

        <Frame label="Detail panel — generative review (text)">
          <div style={{ height: 760, display: 'flex', gap: 16 }}>
            <AlertListPanel selectedAlertId={normalAlert.id} resolvedAlertIds={new Set()} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
            <AlertDetailPanel alert={normalAlert} phase="genReview" execProgress={0} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} onSelectAlert={noopId} />
          </div>
        </Frame>

        <Frame label="Image Studio" note="reached by executing imageAlert's recommended (image-generating) strategy">
          <div style={{ height: 760, display: 'flex' }}>
            <ImageGenStudio alert={imageAlert} onBack={noop} onPublish={noop} />
          </div>
        </Frame>

        <Frame label="Action Picker — search list">
          <div style={{ height: 680, width: 560, display: 'flex' }}>
            <ActionPicker alert={normalAlert} variant="inline" onClose={noop} onRequestEmail={noop} onRequestImageGen={noop} onSave={noop} />
          </div>
        </Frame>

        <Frame label="Compose Mail">
          <div style={{ height: 680, width: 640, display: 'flex' }}>
            <ComposeMail alert={normalAlert} actionType={ACTION_TYPES.find((a) => a.isEmailAction)!} variant="inline" onClose={noop} onSend={noop} />
          </div>
        </Frame>

        <Frame label="Items Modal" note="uses position:fixed internally — contained to this frame with a CSS transform trick">
          <div style={{ height: 500, ...containFixed }}>
            {itemsModalOpen && (
              <ItemsModal items={getDisplayItems(normalAlert)} itemCount={normalAlert.itemsCount} breakdown={normalAlert.itemsBreakdown} onClose={() => setItemsModalOpen(false)} />
            )}
            {!itemsModalOpen && (
              <span onClick={() => setItemsModalOpen(true)} style={{ font: '600 12px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>Reopen</span>
            )}
          </div>
        </Frame>

        <Frame label="Assign — inline dropdown" note="the small list that appears inside a floating panel; border/shadow here stand in for that panel">
          <div style={{ width: 220, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 6 }}>
            <AssignDropdownList assignees={DEFAULT_ASSIGNEES} onSelect={noop} />
          </div>
        </Frame>

        <Frame label="Assign — full popup (>15 people)">
          <div style={{ height: 620, width: 480, display: 'flex' }}>
            <AssignPopupModal assignees={MANY_ASSIGNEES} variant="inline" onSelect={noop} onClose={noop} />
          </div>
        </Frame>

        <Frame label="Speed Mode — card">
          <div style={{ height: 760, display: 'flex', gap: 16 }}>
            <AlertListPanel selectedAlertId={normalAlert.id} resolvedAlertIds={new Set()} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
            <AlertSpeedCard alert={normalAlert} position={4} total={12} onLogAction={noop} onAdvance={noop} onResolve={noopId} />
          </div>
        </Frame>

        <Frame label="Speed Mode — all caught up">
          <div style={{ height: 760, display: 'flex', gap: 16 }}>
            <AlertListPanel selectedAlertId={null} resolvedAlertIds={new Set()} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
            <AlertSpeedCard alert={null} position={12} total={12} onLogAction={noop} onAdvance={noop} onResolve={noopId} />
          </div>
        </Frame>

        {/* ================= MEETINGS ================= */}
        <SectionTitle id="meetings">Meetings</SectionTitle>

        <Frame label="List + Detail — nothing selected">
          <div style={{ height: 760, display: 'flex', gap: 16 }}>
            <MeetingListPanel selectedMeetingId={null} onSelectMeeting={noopId} onVerifyMom={noopId} />
            <MeetingDetailPanel meetingId={null} onOpenAlert={noopId} onPrepare={noop} />
          </div>
        </Frame>

        <Frame label="List + Detail — meeting selected">
          <div style={{ height: 760, display: 'flex', gap: 16 }}>
            <MeetingListPanel selectedMeetingId={MEETING_LIST[0].id} onSelectMeeting={noopId} onVerifyMom={noopId} />
            <MeetingDetailPanel meetingId={MEETING_LIST[0].id} onOpenAlert={noopId} onPrepare={noop} />
          </div>
        </Frame>

        <Frame label="Prep">
          <div style={{ height: 900, display: 'flex' }}>
            <MeetingPrep meetingId={MEETING_LIST[0].id} onBack={noop} onCreatePresentation={noop} />
          </div>
        </Frame>

        <Frame label="Presentation">
          <div style={{ height: 900, display: 'flex' }}>
            <MeetingPresentation meetingId={MEETING_LIST[0].id} onBack={noop} />
          </div>
        </Frame>

        <Frame label="MOM (minutes) — unsent">
          <div style={{ height: 800, display: 'flex' }}>
            <MeetingMOM meetingId="m4" onBackToMeetings={noop} onGoWorkstation={noop} />
          </div>
        </Frame>

        {/* ================= WORK-STATION ================= */}
        <SectionTitle id="workstation">Work-station</SectionTitle>

        <Frame label="Work-station">
          <div style={{ height: 760, display: 'flex' }}>
            <WorkStation />
          </div>
        </Frame>

        {/* ================= SHARED ================= */}
        <SectionTitle id="shared">Shared elements not covered above</SectionTitle>
        <p style={{ font: '400 13px/1.6 Inter,sans-serif', color: '#6b7178', maxWidth: '70ch' }}>
          Icons, colored source/marketplace badges and the Jiva mascot all appear inline throughout the frames above (badge rows on every alert row, source icons in Messages, the mascot in Work-station and Ask Jiva) — capture them as components straight from those frames rather than a separate swatch sheet, since seeing them in real context is more useful for sizing than an isolated icon grid.
        </p>
        <p style={{ font: '400 13px/1.6 Inter,sans-serif', color: '#6b7178', maxWidth: '70ch', marginTop: 8 }}>
          The Campaign Manager bulk-upload popup has its own dedicated capture page already at <code>/popup-preview</code> — a MUI Dialog portals to the document body, so it can't be nested inside this page without breaking out of its frame.
        </p>
      </div>
    </div>
  );
}
