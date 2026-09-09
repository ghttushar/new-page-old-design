import { MEETING_LIST } from '@/constants/signals/prototype-data';
import { MeetingListPanel } from '../../signals/meetings/meeting-list-panel';
import { MeetingDetailPanel } from '../../signals/meetings/meeting-detail-panel';
import { MeetingPrep } from '../../signals/meetings/meeting-prep';
import { MeetingPresentation } from '../../signals/meetings/meeting-presentation';
import { MeetingMOM } from '../../signals/meetings/meeting-mom';
import { PreviewShell, Frame, noop, noopId } from './shared';

export default function MeetingsPreviewPage() {
  return (
    <PreviewShell current="/signals-preview/meetings">
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
    </PreviewShell>
  );
}
