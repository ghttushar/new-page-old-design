import { MEETING_LIST } from '@/constants/signals/prototype-data';
import { MeetingListPanel } from '../../signals/meetings/meeting-list-panel';
import { MeetingDetailPanel } from '../../signals/meetings/meeting-detail-panel';
import { MeetingMOM } from '../../signals/meetings/meeting-mom';
import { AskJivaMeetingPanel } from '../../signals/meetings/ask-jiva-meeting-panel';
import { PreviewShell, Frame, noop, noopId } from './shared';

export default function MeetingsPreviewPage() {
  return (
    <PreviewShell current="/signals-preview/meetings">
      <Frame label="List + Detail — nothing selected">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <MeetingListPanel selectedMeetingId={null} onSelectMeeting={noopId} />
          <MeetingDetailPanel meetingId={null} onCreatePresentation={noop} />
        </div>
      </Frame>

      <Frame label="List + Detail — upcoming meeting selected" note="merged agenda/positives/negatives/discussion/actions card">
        <div style={{ height: 900, display: 'flex', gap: 16 }}>
          <MeetingListPanel selectedMeetingId={MEETING_LIST[0].id} onSelectMeeting={noopId} />
          <MeetingDetailPanel meetingId={MEETING_LIST[0].id} onCreatePresentation={noop} />
        </div>
      </Frame>

      <Frame label="Create presentation — Ask Jiva panel open" note="list column disappears; the detail card shifts left, Jiva chat takes the right column at the list's width">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <MeetingDetailPanel meetingId={MEETING_LIST[0].id} onCreatePresentation={noop} />
          <AskJivaMeetingPanel meetingId={MEETING_LIST[0].id} onClose={noop} />
        </div>
      </Frame>

      <Frame label="Completed meeting — MOM detail, unsent">
        <div style={{ height: 900, display: 'flex' }}>
          <MeetingMOM meetingId="m4" onGoWorkstation={noop} />
        </div>
      </Frame>

      <Frame label="Completed meeting — MOM detail, sent">
        <div style={{ height: 800, display: 'flex' }}>
          <MeetingMOM meetingId="m5" onGoWorkstation={noop} />
        </div>
      </Frame>
    </PreviewShell>
  );
}
