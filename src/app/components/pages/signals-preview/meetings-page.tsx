import { MeetingListPanel } from '../../signals/meetings/meeting-list-panel';
import { MeetingDetailPanel } from '../../signals/meetings/meeting-detail-panel';
import { MeetingMOM } from '../../signals/meetings/meeting-mom';
import { AskJivaMeetingPanel } from '../../signals/meetings/ask-jiva-meeting-panel';
import { PreviewShell, Frame, noop, noopId } from './shared';

export default function MeetingsPreviewPage() {
  return (
    <PreviewShell current="/signals-preview/meetings" intro="Every Meetings screen and panel as its own static frame — nothing here needs to be clicked to reveal the next state.">
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

      <Frame label="List + MOM — completed meeting, MOM unsent" note="discussion summary, decisions, task items table, Send MOM pinned in the footer">
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
    </PreviewShell>
  );
}
