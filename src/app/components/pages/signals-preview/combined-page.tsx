import { useState } from 'react';
import { ACTION_TYPES } from '@/constants/signals/action-types.constants';
import { AlertListPanel } from '../../signals/alerts/alert-list-panel';
import { AlertDetailPanel } from '../../signals/alerts/alert-detail-panel';
import { AskJivaPanel } from '../../signals/alerts/ask-jiva-panel';
import { ActionPicker } from '../../signals/alerts/action-picker';
import { ComposeMail } from '../../signals/alerts/compose-mail';
import { ImageGenStudio } from '../../signals/alerts/image-gen-studio';
import { ItemsModal } from '../../signals/alerts/items-modal';
import { AssignDropdownList, AssignPopupModal, DEFAULT_ASSIGNEES } from '../../signals/alerts/assign-menu';
import { getDisplayItems } from '../../signals/alerts/items-util';
import { MeetingListPanel } from '../../signals/meetings/meeting-list-panel';
import { MeetingDetailPanel } from '../../signals/meetings/meeting-detail-panel';
import { MeetingMOM } from '../../signals/meetings/meeting-mom';
import { AskJivaMeetingPanel } from '../../signals/meetings/ask-jiva-meeting-panel';
import { WorkStation } from '../../signals/work-station/work-station';
import { PreviewShell, Frame, SectionHeading, noop, noopId, firstAlert, normalAlert, imageAlert, noValueAlert, MANY_ASSIGNEES, containFixed } from './shared';

export default function CombinedPreviewPage() {
  const [itemsModalOpen, setItemsModalOpen] = useState(true);

  return (
    <PreviewShell current="/signals-preview/signals" intro="Every Alerts, Meetings and Work-station screen, panel and menu as its own static frame — nothing here needs to be clicked to reveal the next state.">
      <SectionHeading>Alerts</SectionHeading>

      <Frame label="List + Detail — nothing selected" note="empty state shows a 5-tile 'Alerts by category' breakdown (top 5 categories by count)">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel selectedAlertId={null} resolvedAlertIds={new Set()} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertDetailPanel alert={null} phase="view" execProgress={0} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} />
        </div>
      </Frame>

      <Frame label="Filter panel open">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel initialFilterOpen selectedAlertId={null} resolvedAlertIds={new Set()} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertDetailPanel alert={null} phase="view" execProgress={0} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} />
        </div>
      </Frame>

      <Frame label="Yesterday section collapsed" note="day-group headers (Yesterday here, Tomorrow/Earlier in Meetings) collapse via the chevron — Today always stays expanded">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel initialYesterdayCollapsed selectedAlertId={null} resolvedAlertIds={new Set()} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertDetailPanel alert={null} phase="view" execProgress={0} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} />
        </div>
      </Frame>

      <Frame label="List + Detail — alert selected" note="the Ask Jiva entry point, brand name in the header, source-badge cluster">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel selectedAlertId={firstAlert.id} resolvedAlertIds={new Set()} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertDetailPanel alert={firstAlert} phase="view" execProgress={0} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} onOpenAskJiva={noop} />
        </div>
      </Frame>

      <Frame label="List + Detail — no-value alert selected" note="informational alert with hideValue set — no $ figure in either the card or the detail header">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel selectedAlertId={noValueAlert.id} resolvedAlertIds={new Set()} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertDetailPanel alert={noValueAlert} phase="view" execProgress={0} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} />
        </div>
      </Frame>

      <Frame label="Ask Jiva panel open" note="list column disappears; the detail card shifts left, Jiva chat takes the right column at the list's width">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertDetailPanel alert={firstAlert} phase="view" execProgress={0} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} onOpenAskJiva={noop} />
          <AskJivaPanel alert={firstAlert} onClose={noop} />
        </div>
      </Frame>

      <Frame label="Detail — executing (in progress)">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel selectedAlertId={normalAlert.id} resolvedAlertIds={new Set([normalAlert.id])} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertDetailPanel alert={normalAlert} phase="executing" execProgress={40} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} onUndoExecute={noop} />
        </div>
      </Frame>

      <Frame label="Detail — executing (completed, 100%)">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel selectedAlertId={normalAlert.id} resolvedAlertIds={new Set([normalAlert.id])} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertDetailPanel alert={normalAlert} phase="executing" execProgress={100} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} onUndoExecute={noop} />
        </div>
      </Frame>

      <Frame label="Detail — impact report">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel selectedAlertId={normalAlert.id} resolvedAlertIds={new Set([normalAlert.id])} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertDetailPanel alert={normalAlert} phase="report" execProgress={100} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} />
        </div>
      </Frame>

      <Frame label="Detail — generative review (text)">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <AlertListPanel selectedAlertId={normalAlert.id} resolvedAlertIds={new Set()} onSelectAlert={noopId} onOpenItemsForAlert={noopId} onFilteredChange={noop} />
          <AlertDetailPanel alert={normalAlert} phase="genReview" execProgress={0} onExecute={noop} onViewReport={noop} onBackToAlerts={noop} onGenReview={noop} onApproveGenReview={noop} onOpenItems={noop} itemsModalOpen={false} onCloseItems={noop} onLogAction={noop} onDismiss={noop} />
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

      <Frame label="Affected items — table with pagination and download" note="compact rows fit all 10-per-page without scrolling; uses position:fixed internally — contained to this frame with a CSS transform trick">
        <div style={{ height: 560, ...containFixed }}>
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

      <SectionHeading>Meetings</SectionHeading>

      <Frame label="List + Detail — nothing selected">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <MeetingListPanel selectedMeetingId={null} onSelectMeeting={noopId} />
          <MeetingDetailPanel meetingId={null} onCreatePresentation={noop} />
        </div>
      </Frame>

      <Frame label="Filter panel open">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <MeetingListPanel initialFilterOpen selectedMeetingId={null} onSelectMeeting={noopId} />
          <MeetingDetailPanel meetingId={null} onCreatePresentation={noop} />
        </div>
      </Frame>

      <Frame label="Earlier section collapsed" note="Tomorrow/Earlier headers collapse via the chevron — Today (and its Upcoming/Completed split) always stays expanded">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <MeetingListPanel initialCollapsedGroups={{ earlier: true }} selectedMeetingId={null} onSelectMeeting={noopId} />
          <MeetingDetailPanel meetingId={null} onCreatePresentation={noop} />
        </div>
      </Frame>

      <Frame label="List + Detail — upcoming meeting selected" note="day grouping (Today, split into Upcoming/Completed / Tomorrow / Earlier), agenda, positives/negatives, discussion points, relevant alerts table, Create presentation pinned in the footer">
        <div style={{ height: 900, display: 'flex', gap: 16 }}>
          <MeetingListPanel selectedMeetingId="m1" onSelectMeeting={noopId} />
          <MeetingDetailPanel meetingId="m1" onCreatePresentation={noop} />
        </div>
      </Frame>

      <Frame label="Ask Jiva panel open" note="'Create presentation' opens this — list column disappears, detail shifts left, Jiva chat takes the right column">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <MeetingDetailPanel meetingId="m1" onCreatePresentation={noop} />
          <AskJivaMeetingPanel meetingId="m1" onClose={noop} />
        </div>
      </Frame>

      <Frame label="List + MOM — completed meeting, MOM unsent" note="discussion summary, decisions, task items table with an editable STATUS dropdown (Work-station/Email), Send MOM pinned in the footer">
        <div style={{ height: 900, display: 'flex', gap: 16 }}>
          <MeetingListPanel selectedMeetingId="m4" onSelectMeeting={noopId} />
          <MeetingMOM meetingId="m4" onGoWorkstation={noop} />
        </div>
      </Frame>

      <Frame label="MOM — already sent" note="the footer's primary button is replaced by a 'Sent to client' confirmation">
        <div style={{ height: 760, display: 'flex' }}>
          <MeetingMOM meetingId="m5" onGoWorkstation={noop} />
        </div>
      </Frame>

      <SectionHeading>Work-station</SectionHeading>

      <Frame label="Workstation — default" note="Assigned to me / Assigned by me / Unassigned groups, priority filter, search">
        <div style={{ height: 760, display: 'flex' }}>
          <WorkStation onOpenAlert={noopId} onOpenMeeting={noopId} />
        </div>
      </Frame>

      <Frame label="Workstation — task selected" note="the docked detail panel sits beside the list, not on top of it; card-style rows with the overlapping context-source badge stack">
        <div style={{ height: 760, display: 'flex' }}>
          <WorkStation onOpenAlert={noopId} onOpenMeeting={noopId} initialSelectedId="t1" />
        </div>
      </Frame>

      <Frame label="Workstation — Context section expanded" note="collapsed by default; expands inline in the card with written context copy plus the jump-to-source link">
        <div style={{ height: 760, display: 'flex' }}>
          <WorkStation onOpenAlert={noopId} onOpenMeeting={noopId} initialSelectedId="t1" initialDetailContextOpen />
        </div>
      </Frame>

      <Frame label="Priority filter open" note="High/Medium/Low/Generative/Overdue checkboxes, colour-coded per option">
        <div style={{ height: 760, display: 'flex' }}>
          <WorkStation onOpenAlert={noopId} onOpenMeeting={noopId} initialPriorityFilterOpen />
        </div>
      </Frame>

      <Frame label="New task popover open" note="title, description, priority pills, assignee and due — created task is auto-selected">
        <div style={{ height: 760, display: 'flex' }}>
          <WorkStation onOpenAlert={noopId} onOpenMeeting={noopId} initialCreateOpen />
        </div>
      </Frame>

<Frame label="Ask Jiva panel open" note="same pattern as Alerts/Meetings — the list disappears, detail shifts left, Jiva chat takes the right column">
        <div style={{ height: 760, display: 'flex' }}>
          <WorkStation onOpenAlert={noopId} onOpenMeeting={noopId} initialSelectedId="t1" initialJivaOpen />
        </div>
      </Frame>
    </PreviewShell>
  );
}
