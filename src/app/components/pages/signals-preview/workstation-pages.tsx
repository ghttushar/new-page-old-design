import type { ComponentProps } from 'react';
import { PROTOTYPE_ALERTS, type WorkstationTask } from '@/constants/signals/prototype-data';
import { SignalsPage, type SignalsPagePreview } from '../signals-page/signals-page';
import { WorkStation } from '../../signals/work-station/work-station';
import { PreviewShell, Frame, SectionHeading, containFixed } from './shared';

type WorkStationProps = NonNullable<SignalsPagePreview['workStation']>;
type Preview = NonNullable<ComponentProps<typeof WorkStation>['preview']>;

const FULL = 860;
const TALL = 1480;

/** One whole screen: collapsed sidebar + Signals header + tab bar + the Work-station tab, forced into a single state. */
function Screen({ label, note, height = FULL, ws, page }: { label: string; note?: string; height?: number; ws?: WorkStationProps; page?: Omit<SignalsPagePreview, 'workStation'> }) {
  return (
    <Frame label={label} note={note}>
      <div style={{ ...containFixed, height, flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <SignalsPage initialTab="workstation" preview={{ ...page, workStation: ws }} />
      </div>
    </Frame>
  );
}

const p = (preview: Preview, rest: WorkStationProps = {}): WorkStationProps => ({ ...rest, preview });

// ─────────────────────────────────────────────────────────────────────────────
// 1. Layout, list, filters, menus
// ─────────────────────────────────────────────────────────────────────────────
export function WorkStationListPreviewPage() {
  return (
    <PreviewShell current="/signals-preview/workstation" intro="Work-station exactly as it is in the app today — whole screens (sidebar, Signals header, tab bar, list column and right column), one state per frame. Page 1 of 3: layout, list, filters and menus.">
      <SectionHeading>Screen layout</SectionHeading>
      <Screen label="Default — nothing selected" note="list column on the left (Assigned to me open), empty right column with the six category cards" />
      <Screen label="Ask Jiva (header button) — list + detail + Jiva" note="the header pill turns darker; the first task assigned to you is selected and the Jiva chat docks as a third column" page={{ globalJivaOpen: true }} />
      <Screen label="List column collapsed — nothing selected" note="the list folds into a 22px notch bar; click or drag to bring it back" ws={p({ listCollapsed: true })} />
      <Screen label="List column collapsed — task open" ws={p({ listCollapsed: true }, { initialSelectedId: 't1' })} />

      <SectionHeading>Signals header menus</SectionHeading>
      <Screen label="Account filter dropdown open" page={{ accountFilterOpen: true }} />
      <Screen label="Date range calendar open" page={{ calendarOpen: true }} />

      <SectionHeading>List — groups</SectionHeading>
      <Screen label="Assigned to me — expanded" note="three group headers cluster at the top; only the open one's tasks show. Done tasks sink to the bottom and fade" ws={{ initialActiveGroup: 'to-me' }} />
      <Screen label="Assigned by me — expanded" ws={{ initialActiveGroup: 'by-me' }} />
      <Screen label="Unassigned — expanded" ws={{ initialActiveGroup: 'unassigned' }} />

      <SectionHeading>List — search & filters</SectionHeading>
      <Screen label="Search — with results" ws={p({ search: 'Mike' }, { initialActiveGroup: 'by-me' })} />
      <Screen label="Search — no results" note="the open group shows its dashed empty message" ws={p({ search: 'zzz' })} />
      <Screen label="Filter popover — open" note="Priority, Origin and Assigned to sections" ws={{ initialPriorityFilterOpen: true }} />
      <Screen label="Filter popover — selections made" note="button shows the count, popover gains a Clear button" ws={p({ priorityFilters: ['High', 'Generative'], personFilter: 'mike' }, { initialPriorityFilterOpen: true, initialActiveGroup: 'by-me' })} />
      <Screen label="Category card applied — Overdue" note="clicking an empty-state card filters the list and shows a removable chip under the search row" ws={p({ quickFilter: 'overdue' })} />
      <Screen label="Category card applied — In progress" ws={p({ quickFilter: 'in_progress' })} />
      <Screen label="Category card applied — Done" note="done rows are faded" ws={p({ quickFilter: 'done' })} />

      <SectionHeading>List — row menus & toast</SectionHeading>
      <Screen label="Row menu — your own task" note="only Share" ws={p({ rowMenu: { id: 't1', mode: 'main' } })} />
      <Screen label="Row menu — delegated task" note="Remind <assignee> + Share" ws={p({ rowMenu: { id: 't9', mode: 'main' } }, { initialActiveGroup: 'by-me' })} />
      <Screen label="Row menu — Share via" ws={p({ rowMenu: { id: 't9', mode: 'share' } }, { initialActiveGroup: 'by-me' })} />
      <Screen label="Reminder sent toast" ws={p({ remindedName: 'Mike Torres' }, { initialActiveGroup: 'by-me', initialSelectedId: 't9' })} />
    </PreviewShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Task detail — every origin and every editable state
// ─────────────────────────────────────────────────────────────────────────────
const a8 = PROTOTYPE_ALERTS.find((a) => a.id === 'a8');
const a8Pick = a8?.options.find((o) => o.recommended)?.label ?? a8?.options[0]?.label ?? 'action';

/** What the New task flow produces: a directly-created task, first in "Assigned to me". */
const DIRECT_TASK: WorkstationTask = {
  id: 'tdirect', text: 'Review the Q4 sponsored-ads budget split with Priya',
  description: 'Walk through the proposed Q4 budget split across Sponsored Products and Sponsored Brands before the QBR deck is locked.',
  priority: 'Medium', assignee: 'You', assigneeId: 'self', createdBy: 'You', due: '12 Nov', overdue: false, status: 'open', origin: 'direct',
  logs: [{ time: 'Just now', text: 'Created directly', by: 'You' }],
};

export function WorkStationDetailPreviewPage() {
  return (
    <PreviewShell current="/signals-preview/workstation-detail" intro="Work-station task detail exactly as it is in the app today. Page 2 of 3: the right column for every kind of task, every editable field and every popover.">
      <SectionHeading>Task detail — by where the task came from</SectionHeading>
      <Screen label="From a meeting + email + Slack — default" note="Context and Activity sections start collapsed; footer has Complete with Jiva and Share" ws={{ initialSelectedId: 't1' }} />
      <Screen label="From a meeting + email + Slack — Context expanded" note="one card per channel: Meet, email thread, Slack thread" ws={{ initialSelectedId: 't1', initialDetailContextOpen: true }} />
      <Screen label="From a meeting — overdue" note="due date in red, status In progress" ws={{ initialSelectedId: 't3', initialDetailContextOpen: true }} />
      <Screen label="From a meeting — delegated to someone" note="footer shows Remind <assignee> instead of Complete with Jiva" ws={{ initialSelectedId: 't7', initialActiveGroup: 'by-me', initialDetailContextOpen: true }} />
      <Screen label="From a meeting — unassigned" note="amber Unassigned assignee" ws={{ initialSelectedId: 't8', initialActiveGroup: 'unassigned', initialDetailContextOpen: true }} />
      <Screen label="From an alert — suggested actions" note="ripple badge on the context card; Suggested actions with Jiva recommends, Affected items with Show all" height={TALL} ws={{ initialSelectedId: 't11', initialDetailContextOpen: true }} />
      <Screen label="From an alert — action executed" note="Execute becomes Logged and a toast confirms" height={TALL} ws={p({ alertState: 'executed', alertToast: `Logged: ${a8Pick}` }, { initialSelectedId: 't11', initialDetailContextOpen: true })} />
      <Screen label="From an alert — dismissed" height={TALL} ws={p({ alertState: 'dismissed', alertToast: 'Dismissed' }, { initialSelectedId: 't11', initialDetailContextOpen: true })} />
      <Screen label="From an alert — Show all affected items" note="the full items modal" ws={p({ itemsModalOpen: true }, { initialSelectedId: 't11' })} />
      <Screen label="From an alert — delegated, in progress" height={TALL} ws={{ initialSelectedId: 't9', initialActiveGroup: 'by-me', initialDetailContextOpen: true, initialDetailActivityOpen: true }} />
      <Screen label="From an alert — assigned, open" height={TALL} ws={{ initialSelectedId: 't10', initialActiveGroup: 'by-me', initialDetailContextOpen: true }} />
      <Screen label="From an alert — completed" note="Done pill and green due date, row faded in the list" height={TALL} ws={{ initialSelectedId: 't4', initialDetailContextOpen: true, initialDetailActivityOpen: true }} />
      <Screen label="Generated by Jiva — delegated" note="Jiva mascot badge and the 'synthesized from patterns' explanation" ws={{ initialSelectedId: 't6', initialActiveGroup: 'by-me', initialDetailContextOpen: true }} />
      <Screen label="Generated by Jiva — completed" ws={{ initialSelectedId: 't5', initialDetailContextOpen: true }} />
      <Screen label="Created directly" note="the result of New task: first in Assigned to me, no linked alert or meeting" ws={p({ extraTasks: [DIRECT_TASK] }, { initialSelectedId: 'tdirect', initialDetailContextOpen: true, initialDetailActivityOpen: true })} />

      <SectionHeading>Task detail — field editors & popovers</SectionHeading>
      <Screen label="Assignee dropdown open" ws={{ initialSelectedId: 't1', initialDetailFieldOpen: 'assignee' }} />
      <Screen label="Status dropdown open" ws={{ initialSelectedId: 't1', initialDetailFieldOpen: 'status' }} />
      <Screen label="Priority dropdown open" ws={{ initialSelectedId: 't1', initialDetailFieldOpen: 'priority' }} />
      <Screen label="Due date picker open" note="calendar with month arrows, today ring and selected day; days before today are disabled" ws={{ initialSelectedId: 't1', initialDetailFieldOpen: 'due' }} />
      <Screen label="Editing the title" ws={p({ detailEditing: 'title' }, { initialSelectedId: 't1' })} />
      <Screen label="Editing the description" ws={p({ detailEditing: 'description' }, { initialSelectedId: 't1' })} />
      <Screen label="Footer Share popover open" ws={p({ detailShareOpen: true }, { initialSelectedId: 't1' })} />

      <SectionHeading>Task detail — Activity</SectionHeading>
      <Screen label="Activity expanded" ws={{ initialSelectedId: 't1', initialDetailActivityOpen: true }} />
      <Screen label="Activity — comment composer open" ws={{ initialSelectedId: 't1', initialDetailActivityOpen: true, initialDetailCommentComposerOpen: true }} />
      <Screen label="Activity — comment typed" ws={p({ commentDraft: 'Confirmed with Priya — publishing this afternoon.' }, { initialSelectedId: 't1', initialDetailActivityOpen: true })} />
    </PreviewShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. New task and Ask Jiva
// ─────────────────────────────────────────────────────────────────────────────
export function WorkStationNewTaskPreviewPage() {
  return (
    <PreviewShell current="/signals-preview/workstation-new-task" intro="Work-station exactly as it is in the app today. Page 3 of 3: the New task screen (it opens in the right column) and the Ask Jiva chat.">
      <SectionHeading>New task</SectionHeading>
      <Screen label="New task — empty" note="NEW TASK eyebrow, title input, Assignee / Status / Priority / Due, Description; Create task stays disabled until there is a title" ws={{ initialCreateOpen: true }} />
      <Screen label="New task — filled in" ws={p({ newTask: { title: 'Review the Q4 sponsored-ads budget split with Priya', description: 'Walk through the proposed split before the QBR deck is locked.', assigneeId: 'self', priority: 'High', due: '12 Nov' } }, { initialCreateOpen: true })} />
      <Screen label="New task — Assignee menu" ws={p({ newTaskMenu: 'assignee', newTask: { title: 'Review the Q4 sponsored-ads budget split with Priya' } }, { initialCreateOpen: true })} />
      <Screen label="New task — Priority menu" ws={p({ newTaskMenu: 'priority', newTask: { title: 'Review the Q4 sponsored-ads budget split with Priya' } }, { initialCreateOpen: true })} />
      <Screen label="New task — Due date picker" ws={p({ newTaskMenu: 'due', newTask: { title: 'Review the Q4 sponsored-ads budget split with Priya' } }, { initialCreateOpen: true })} />

      <SectionHeading>Ask Jiva</SectionHeading>
      <Screen label="Ask Jiva — opened from a task" note="Complete with Jiva docks the chat as a third column; four suggestion chips under the greeting" ws={p({}, { initialSelectedId: 't1' })} page={{ globalJivaOpen: true }} />
      <Screen label="Ask Jiva — suggestion picked" note="tapping a chip fills the input and enables the send button" ws={p({ jivaDraft: 'What should I do next?' }, { initialSelectedId: 't1' })} page={{ globalJivaOpen: true }} />
      <Screen label="Ask Jiva — Jiva is thinking" ws={p({ jivaTyping: true, jivaConversation: true }, { initialSelectedId: 't1' })} page={{ globalJivaOpen: true }} />
      <Screen label="Ask Jiva — conversation" ws={p({ jivaConversation: true }, { initialSelectedId: 't1' })} page={{ globalJivaOpen: true }} />
    </PreviewShell>
  );
}
