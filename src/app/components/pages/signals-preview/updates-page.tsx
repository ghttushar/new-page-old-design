import { MeetingListPanel } from '../../signals/meetings/meeting-list-panel';
import { MeetingDetailPanel } from '../../signals/meetings/meeting-detail-panel';
import { MeetingMOM } from '../../signals/meetings/meeting-mom';
import { WorkStation } from '../../signals/work-station/work-station';
import { PreviewShell, Frame, SectionHeading, noop, noopId } from './shared';

export default function UpdatesPreviewPage() {
  return (
    <PreviewShell
      current="/signals-preview/updates"
      intro="Everything added or redesigned in the latest pass, as static frames — Work-station's task rows and field editors, the Activity comment thread, the due-date calendar, and the Meetings list/upcoming/completed screens, each state (expanded, collapsed, open menu) captured on its own."
    >
      <SectionHeading>Work-station — list</SectionHeading>

      <Frame label="Assigned to me — expanded" note="the three group tabs stay clustered at top; the open one's tasks expand below the whole cluster. Row states: Open, In progress, Done — done tasks sink to the bottom of their row">
        <div style={{ height: 760, display: 'flex' }}>
          <WorkStation onOpenAlert={noopId} onOpenMeeting={noopId} initialActiveGroup="to-me" />
        </div>
      </Frame>

      <Frame label="Assigned by me — expanded" note="switching the active tab collapses the previous one and drops its own header to the bottom of the cluster">
        <div style={{ height: 760, display: 'flex' }}>
          <WorkStation onOpenAlert={noopId} onOpenMeeting={noopId} initialActiveGroup="by-me" />
        </div>
      </Frame>

      <Frame label="Unassigned — expanded" note="empty-owner row styling — amber assignee label, no avatar tint">
        <div style={{ height: 760, display: 'flex' }}>
          <WorkStation onOpenAlert={noopId} onOpenMeeting={noopId} initialActiveGroup="unassigned" />
        </div>
      </Frame>

      <SectionHeading>Work-station — detail panel field editors</SectionHeading>

      <Frame label="Assignee — dropdown open" note="every field now reads as an editable control: bordered box, dropdown chevron">
        <div style={{ height: 620, display: 'flex' }}>
          <WorkStation onOpenAlert={noopId} onOpenMeeting={noopId} initialSelectedId="t1" initialDetailFieldOpen="assignee" />
        </div>
      </Frame>

      <Frame label="Status — dropdown open">
        <div style={{ height: 620, display: 'flex' }}>
          <WorkStation onOpenAlert={noopId} onOpenMeeting={noopId} initialSelectedId="t1" initialDetailFieldOpen="status" />
        </div>
      </Frame>

      <Frame label="Priority — dropdown open">
        <div style={{ height: 620, display: 'flex' }}>
          <WorkStation onOpenAlert={noopId} onOpenMeeting={noopId} initialSelectedId="t1" initialDetailFieldOpen="priority" />
        </div>
      </Frame>

      <Frame label="Due — date picker open" note="a real calendar: month navigation, correct weekday grid, today ring, selected-day fill. Every day before today is disabled (greyed, not-allowed) and the old 'Today' shortcut button is gone">
        <div style={{ height: 640, display: 'flex' }}>
          <WorkStation onOpenAlert={noopId} onOpenMeeting={noopId} initialSelectedId="t1" initialDetailFieldOpen="due" />
        </div>
      </Frame>

      <Frame label="Generative task — Jiva-flagged banner" note="no linked alert or meeting; Jiva surfaces it directly with a 'Draft it' entry point">
        <div style={{ height: 640, display: 'flex' }}>
          <WorkStation onOpenAlert={noopId} onOpenMeeting={noopId} initialSelectedId="t6" />
        </div>
      </Frame>

      <Frame label="Completed task — Done state" note="no strikethrough on the title; status pill and due date both switch to the done/green treatment; alert-origin tasks get a 'View alert' footer button">
        <div style={{ height: 640, display: 'flex' }}>
          <WorkStation onOpenAlert={noopId} onOpenMeeting={noopId} initialSelectedId="t4" />
        </div>
      </Frame>

      <SectionHeading>Work-station — Activity thread</SectionHeading>

      <Frame label="Activity — collapsed (default)">
        <div style={{ height: 560, display: 'flex' }}>
          <WorkStation onOpenAlert={noopId} onOpenMeeting={noopId} initialSelectedId="t1" />
        </div>
      </Frame>

      <Frame label="Activity — expanded, mixed thread" note="Jiva's automatic updates and a person's own action share one timeline; each line reads 'time (name)'">
        <div style={{ height: 700, display: 'flex' }}>
          <WorkStation onOpenAlert={noopId} onOpenMeeting={noopId} initialSelectedId="t1" initialDetailActivityOpen />
        </div>
      </Frame>

      <Frame label="Activity — comment composer open" note="a dashed '+' node closes the thread; clicking it swaps in an avatar + input + Post, so replying reads as part of the same timeline">
        <div style={{ height: 700, display: 'flex' }}>
          <WorkStation onOpenAlert={noopId} onOpenMeeting={noopId} initialSelectedId="t1" initialDetailActivityOpen initialDetailCommentComposerOpen />
        </div>
      </Frame>

      <Frame label="Activity — fully automated thread" note="a task Jiva ran end-to-end: every entry is its own sparkle marker, no person entries at all">
        <div style={{ height: 700, display: 'flex' }}>
          <WorkStation onOpenAlert={noopId} onOpenMeeting={noopId} initialSelectedId="t4" initialDetailActivityOpen />
        </div>
      </Frame>

      <SectionHeading>Meetings — list</SectionHeading>

      <Frame label="List + Detail — nothing selected" note="time and date are merged onto one muted line; completed rows show the same line plus a right-aligned task-completion count">
        <div style={{ height: 760, display: 'flex', gap: 16 }}>
          <MeetingListPanel selectedMeetingId={null} onSelectMeeting={noopId} />
          <MeetingDetailPanel meetingId={null} onCreatePresentation={noop} />
        </div>
      </Frame>

      <SectionHeading>Meetings — upcoming</SectionHeading>

      <Frame label="Upcoming detail — Nutrabay" note="bare back arrow, top-left, on its own line above the title (same placement across Alerts, Meetings and Work-station). 'Previous meeting:' in black, the meeting title in purple, with a chevron — click-through to that meeting. Discussion points now use the same bulleted-card design as Decisions">
        <div style={{ height: 900, display: 'flex', gap: 16 }}>
          <MeetingListPanel selectedMeetingId="m1" onSelectMeeting={noopId} />
          <MeetingDetailPanel meetingId="m1" onCreatePresentation={noop} />
        </div>
      </Frame>

      <Frame label="Upcoming detail — Wellbeing" note="a second account, to show the previous-meeting link and relevant-alerts table with a different history">
        <div style={{ height: 900, display: 'flex', gap: 16 }}>
          <MeetingListPanel selectedMeetingId="m2" onSelectMeeting={noopId} />
          <MeetingDetailPanel meetingId="m2" onCreatePresentation={noop} />
        </div>
      </Frame>

      <SectionHeading>Meetings — completed (MOM)</SectionHeading>

      <Frame label="MOM — unsent, Share button" note="the primary action is now a white/secondary Share button, matching Alerts; the header shows a live X/Y task-completion count instead of a resolved percentage">
        <div style={{ height: 900, display: 'flex', gap: 16 }}>
          <MeetingListPanel selectedMeetingId="m6" onSelectMeeting={noopId} />
          <MeetingMOM meetingId="m6" onGoWorkstation={noop} />
        </div>
      </Frame>

      <Frame label="MOM — Share popover open">
        <div style={{ height: 760, display: 'flex' }}>
          <MeetingMOM meetingId="m6" onGoWorkstation={noop} initialShareOpen />
        </div>
      </Frame>

      <Frame label="MOM — already sent to client" note="the footer swaps Share for a confirmation pill once a share action completes">
        <div style={{ height: 760, display: 'flex' }}>
          <MeetingMOM meetingId="m6" onGoWorkstation={noop} initialSent />
        </div>
      </Frame>

      <Frame label="MOM — task Status dropdown open" note="replaces the old native &lt;select&gt; with the same custom popover used elsewhere (checkmark on the selected value)">
        <div style={{ height: 760, display: 'flex' }}>
          <MeetingMOM meetingId="m6" onGoWorkstation={noop} initialStatusOpenIdx={0} />
        </div>
      </Frame>

      <Frame label="MOM — 'Rate these results' feedback open" note="re-added where 'See my tasks' used to sit, bottom-right of the footer — thumbs up/down, thumbs-down opens a short feedback form">
        <div style={{ height: 800, display: 'flex' }}>
          <MeetingMOM meetingId="m6" onGoWorkstation={noop} initialFeedbackOpen />
        </div>
      </Frame>

      <Frame label="MOM — all tasks completed" note="Boldfit's Q4 planning meeting, converted this pass from an upcoming meeting to a fully-completed one">
        <div style={{ height: 900, display: 'flex', gap: 16 }}>
          <MeetingListPanel selectedMeetingId="m3" onSelectMeeting={noopId} />
          <MeetingMOM meetingId="m3" onGoWorkstation={noop} />
        </div>
      </Frame>
    </PreviewShell>
  );
}
