import { createContext, useContext, useEffect, useRef, useState, type ComponentProps } from 'react';
import { PROTOTYPE_ALERTS, type WorkstationTask } from '@/constants/signals/prototype-data';
import { SignalsPage, type SignalsPagePreview } from '../signals-page/signals-page';
import { WorkStation } from '../../signals/work-station/work-station';
import scrollStyles from '../../signals/alerts/alerts-scroll.module.scss';
import { PreviewShell, Frame, SectionHeading, containFixed, WORKSTATION_PAGES } from './shared';

type WorkStationProps = NonNullable<SignalsPagePreview['workStation']>;
type Preview = NonNullable<ComponentProps<typeof WorkStation>['preview']>;

const FULL = 860;

/** True when the node sits inside a position:fixed layer (modals) — those scroll on their own and shouldn't stretch the screen. */
function insideFixed(node: HTMLElement, stop: HTMLElement): boolean {
  for (let n: HTMLElement | null = node; n && n !== stop; n = n.parentElement) {
    if (getComputedStyle(n).position === 'fixed') return true;
  }
  return false;
}

/**
 * One whole screen: collapsed sidebar + Signals header + tab bar + the Work-station tab, forced into a single state.
 * The screen grows until nothing inside it scrolls, so a capture shows every row and every section at full height.
 */
function Screen({ label, note, ws, page }: { label: string; note?: string; ws?: WorkStationProps; page?: Omit<SignalsPagePreview, 'workStation'> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(FULL);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      let extra = 0;
      el.querySelectorAll<HTMLElement>('.' + scrollStyles.sleekScroll).forEach((n) => {
        if (insideFixed(n, el)) return;
        extra = Math.max(extra, n.scrollHeight - n.clientHeight);
      });
      if (extra > 1) setHeight((h) => h + Math.ceil(extra));
    };
    // Sections animate open (accordions, slide-ins), so measure again once they have settled.
    const timers = [350, 800, 1500, 2400].map((t) => window.setTimeout(fit, t));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  return (
    <Frame label={label} note={note}>
      {/* The page is pinned to 100vh in the app; inside a frame it should fill the frame instead. */}
      <style>{'[data-ws-screen] > * { height: 100% !important; }'}</style>
      <div ref={ref} data-ws-screen style={{ ...containFixed, height, flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <SignalsPage initialTab="workstation" preview={{ ...page, workStation: ws }} />
      </div>
    </Frame>
  );
}

const p = (preview: Preview, rest: WorkStationProps = {}): WorkStationProps => ({ ...rest, preview });

const a8 = PROTOTYPE_ALERTS.find((a) => a.id === 'a8');
const a8Pick = a8?.options.find((o) => o.recommended)?.label ?? a8?.options[0]?.label ?? 'action';

/** What the New task flow produces: a directly-created task, first in "Assigned to me". */
const DIRECT_TASK: WorkstationTask = {
  id: 'tdirect', text: 'Review the Q4 sponsored-ads budget split with Priya',
  description: 'Walk through the proposed Q4 budget split across Sponsored Products and Sponsored Brands before the QBR deck is locked.',
  priority: 'Medium', assignee: 'You', assigneeId: 'self', createdBy: 'You', due: '12 Nov', overdue: false, status: 'open', origin: 'direct',
  logs: [{ time: 'Just now', text: 'Created directly', by: 'You' }],
};

const NEW_TITLE = 'Review the Q4 sponsored-ads budget split with Priya';
const INTRO = 'Work-station exactly as it is in the app today, as whole screens (sidebar, Signals header, tab bar, list column and right column), one state per frame, each grown to its full height so nothing scrolls. ';

/** True while the pages are stacked inside the all-screens page, which supplies the shell and nav itself. */
const InAllScreens = createContext(false);

function Page({ path, intro, children }: { path: string; intro: string; children: React.ReactNode }) {
  const inAll = useContext(InAllScreens);
  if (inAll) {
    const meta = WORKSTATION_PAGES.find((x) => x.path === path);
    return (
      <section>
        <div style={{ marginTop: 72, padding: '18px 0 4px', borderTop: '4px solid #77469b' }}>
          <h1 style={{ font: '800 26px/1.2 Inter,sans-serif', color: '#23272d', margin: 0 }}>{meta?.label.replace('WS · ', '')}</h1>
          <p style={{ font: '400 13px/1.6 Inter,sans-serif', color: '#6b7178', margin: '6px 0 0' }}>{intro}</p>
        </div>
        {children}
      </section>
    );
  }
  return <PreviewShell current={path} intro={INTRO + intro}>{children}</PreviewShell>;
}

const note = (path: string) => WORKSTATION_PAGES.find((x) => x.path === path)?.note ?? '';

// ── 1. Layout ────────────────────────────────────────────────────────────────
export function WorkStationLayoutPage() {
  const path = '/signals-preview/workstation';
  return (
    <Page path={path} intro={note(path)}>
      <SectionHeading>Screen layout</SectionHeading>
      <Screen label="Default — nothing selected" note="list column on the left (Assigned to me open), empty right column with the six category cards" />
      <Screen label="Ask Jiva (header button) — list + detail + Jiva" note="the header pill turns darker; the first task assigned to you is selected and the Jiva chat docks as a third column" page={{ globalJivaOpen: true }} />
      <Screen label="List column collapsed — nothing selected" note="the list folds into a 22px notch bar; click or drag to bring it back" ws={p({ listCollapsed: true })} />
      <Screen label="List column collapsed — task open" ws={p({ listCollapsed: true }, { initialSelectedId: 't1' })} />
      <SectionHeading>Signals header menus</SectionHeading>
      <Screen label="Account filter dropdown open" page={{ accountFilterOpen: true }} />
      <Screen label="Date range calendar open" page={{ calendarOpen: true }} />
    </Page>
  );
}

// ── 2. List groups & read state ──────────────────────────────────────────────
export function WorkStationListPage() {
  const path = '/signals-preview/workstation-list';
  return (
    <Page path={path} intro={note(path)}>
      <SectionHeading>Read & unread</SectionHeading>
      <Screen label="Unread — every title bold" note="a task you haven't opened yet: title in bold (700). Same colour as a read one — only the weight changes" ws={{ initialActiveGroup: 'to-me' }} />
      <Screen label="Some read — bold next to medium" note="opened tasks drop to medium (500) weight; the colour does not change" ws={p({ readTaskIds: ['t2', 't3', 't11'] })} />
      <Screen label="All read — every title medium" ws={p({ readTaskIds: ['t1', 't2', 't3', 't4', 't5'] })} />
      <Screen label="Selected task — read the moment it opens" note="selecting a row marks it read; the purple left bar and tint show the selection" ws={{ initialSelectedId: 't1' }} />
      <SectionHeading>Groups</SectionHeading>
      <Screen label="Assigned to me — expanded" note="three group headers cluster at the top; only the open one's tasks show. Done tasks sink to the bottom and fade" ws={{ initialActiveGroup: 'to-me' }} />
      <Screen label="Assigned by me — expanded" ws={{ initialActiveGroup: 'by-me' }} />
      <Screen label="Unassigned — expanded" ws={{ initialActiveGroup: 'unassigned' }} />
    </Page>
  );
}

// ── 3. Search & filters ──────────────────────────────────────────────────────
export function WorkStationFiltersPage() {
  const path = '/signals-preview/workstation-filters';
  return (
    <Page path={path} intro={note(path)}>
      <SectionHeading>Search</SectionHeading>
      <Screen label="Search — with results" ws={p({ search: 'Mike' }, { initialActiveGroup: 'by-me' })} />
      <Screen label="Search — no results" note="the open group shows its dashed empty message" ws={p({ search: 'zzz' })} />
      <SectionHeading>Filter popover</SectionHeading>
      <Screen label="Filter popover — open" note="Priority, Origin and Assigned to sections" ws={{ initialPriorityFilterOpen: true }} />
      <Screen label="Filter popover — selections made" note="button shows the count, popover gains a Clear button" ws={p({ priorityFilters: ['High', 'Generative'], personFilter: 'mike' }, { initialPriorityFilterOpen: true, initialActiveGroup: 'by-me' })} />
      <SectionHeading>Category cards</SectionHeading>
      <Screen label="Category card applied — Overdue" note="clicking an empty-state card filters the list and shows a removable chip under the search row" ws={p({ quickFilter: 'overdue' })} />
      <Screen label="Category card applied — In progress" ws={p({ quickFilter: 'in_progress' })} />
      <Screen label="Category card applied — Done" note="done rows are faded" ws={p({ quickFilter: 'done' })} />
    </Page>
  );
}

// ── 4. Row menus ─────────────────────────────────────────────────────────────
export function WorkStationMenusPage() {
  const path = '/signals-preview/workstation-menus';
  return (
    <Page path={path} intro={note(path)}>
      <Screen label="Row menu — your own task" note="only Share" ws={p({ rowMenu: { id: 't1', mode: 'main' } })} />
      <Screen label="Row menu — delegated task" note="Remind <assignee> + Share" ws={p({ rowMenu: { id: 't9', mode: 'main' } }, { initialActiveGroup: 'by-me' })} />
      <Screen label="Row menu — Share via" ws={p({ rowMenu: { id: 't9', mode: 'share' } }, { initialActiveGroup: 'by-me' })} />
      <Screen label="Reminder sent toast" ws={p({ remindedName: 'Mike Torres' }, { initialActiveGroup: 'by-me', initialSelectedId: 't9' })} />
    </Page>
  );
}

// ── 5. Meeting tasks (right column) ──────────────────────────────────────────
export function WorkStationMeetingTasksPage() {
  const path = '/signals-preview/workstation-detail';
  return (
    <Page path={path} intro={note(path)}>
      <SectionHeading>Meeting + email + Slack task</SectionHeading>
      <Screen label="Collapsed — Context and Activity closed" note="the default when a task opens; footer has Complete with Jiva and Share" ws={{ initialSelectedId: 't1' }} />
      <Screen label="Context expanded" note="one card per channel: Meet, email thread, Slack thread" ws={{ initialSelectedId: 't1', initialDetailContextOpen: true }} />
      <Screen label="Context + Activity both expanded" ws={{ initialSelectedId: 't1', initialDetailContextOpen: true, initialDetailActivityOpen: true }} />
      <SectionHeading>Other meeting tasks</SectionHeading>
      <Screen label="Overdue — expanded" note="due date in red, status In progress" ws={{ initialSelectedId: 't3', initialDetailContextOpen: true, initialDetailActivityOpen: true }} />
      <Screen label="Delegated — expanded" note="footer shows Remind <assignee> instead of Complete with Jiva" ws={{ initialSelectedId: 't7', initialActiveGroup: 'by-me', initialDetailContextOpen: true, initialDetailActivityOpen: true }} />
      <Screen label="Unassigned — expanded" note="amber Unassigned assignee" ws={{ initialSelectedId: 't8', initialActiveGroup: 'unassigned', initialDetailContextOpen: true, initialDetailActivityOpen: true }} />
    </Page>
  );
}

// ── 6. Alert tasks (right column) ────────────────────────────────────────────
export function WorkStationAlertTasksPage() {
  const path = '/signals-preview/workstation-alerts';
  return (
    <Page path={path} intro={note(path)}>
      <SectionHeading>Alert task — your own</SectionHeading>
      <Screen label="Collapsed — Context and Activity closed" note="Suggested actions with Jiva recommends, Execute / Dismiss, Affected items with Show all" ws={{ initialSelectedId: 't11' }} />
      <Screen label="Context + Activity both expanded" note="the context card carries the ripple badge and Open alert →" ws={{ initialSelectedId: 't11', initialDetailContextOpen: true, initialDetailActivityOpen: true }} />
      <Screen label="Action executed" note="Execute becomes Logged and a toast confirms" ws={p({ alertState: 'executed', alertToast: `Logged: ${a8Pick}` }, { initialSelectedId: 't11', initialDetailContextOpen: true, initialDetailActivityOpen: true })} />
      <Screen label="Dismissed" ws={p({ alertState: 'dismissed', alertToast: 'Dismissed' }, { initialSelectedId: 't11', initialDetailContextOpen: true, initialDetailActivityOpen: true })} />
      <Screen label="Show all affected items" note="the full items modal" ws={p({ itemsModalOpen: true }, { initialSelectedId: 't11' })} />
      <SectionHeading>Alert task — delegated, assigned, done</SectionHeading>
      <Screen label="Delegated, in progress — expanded" ws={{ initialSelectedId: 't9', initialActiveGroup: 'by-me', initialDetailContextOpen: true, initialDetailActivityOpen: true }} />
      <Screen label="Assigned, open — expanded" ws={{ initialSelectedId: 't10', initialActiveGroup: 'by-me', initialDetailContextOpen: true, initialDetailActivityOpen: true }} />
      <Screen label="Completed — expanded" note="Done pill and green due date, row faded in the list" ws={{ initialSelectedId: 't4', initialDetailContextOpen: true, initialDetailActivityOpen: true }} />
    </Page>
  );
}

// ── 7. Jiva-generated & directly created ─────────────────────────────────────
export function WorkStationOriginsPage() {
  const path = '/signals-preview/workstation-origins';
  return (
    <Page path={path} intro={note(path)}>
      <Screen label="Generated by Jiva — delegated, expanded" note="Jiva mascot badge and the 'synthesized from patterns' explanation" ws={{ initialSelectedId: 't6', initialActiveGroup: 'by-me', initialDetailContextOpen: true, initialDetailActivityOpen: true }} />
      <Screen label="Generated by Jiva — completed, expanded" ws={{ initialSelectedId: 't5', initialDetailContextOpen: true, initialDetailActivityOpen: true }} />
      <Screen label="Created directly — collapsed" note="the result of New task: first in Assigned to me, no linked alert or meeting" ws={p({ extraTasks: [DIRECT_TASK] }, { initialSelectedId: 'tdirect' })} />
      <Screen label="Created directly — expanded" ws={p({ extraTasks: [DIRECT_TASK] }, { initialSelectedId: 'tdirect', initialDetailContextOpen: true, initialDetailActivityOpen: true })} />
    </Page>
  );
}

// ── 8. Fields & popovers ─────────────────────────────────────────────────────
export function WorkStationFieldsPage() {
  const path = '/signals-preview/workstation-fields';
  return (
    <Page path={path} intro={note(path)}>
      <Screen label="Assignee dropdown open" ws={{ initialSelectedId: 't1', initialDetailFieldOpen: 'assignee' }} />
      <Screen label="Status dropdown open" ws={{ initialSelectedId: 't1', initialDetailFieldOpen: 'status' }} />
      <Screen label="Priority dropdown open" ws={{ initialSelectedId: 't1', initialDetailFieldOpen: 'priority' }} />
      <Screen label="Due date picker open" note="calendar with month arrows, today ring and selected day; days before today are disabled" ws={{ initialSelectedId: 't1', initialDetailFieldOpen: 'due' }} />
      <Screen label="Editing the title" ws={p({ detailEditing: 'title' }, { initialSelectedId: 't1' })} />
      <Screen label="Editing the description" ws={p({ detailEditing: 'description' }, { initialSelectedId: 't1' })} />
      <Screen label="Footer Share popover open" ws={p({ detailShareOpen: true }, { initialSelectedId: 't1' })} />
    </Page>
  );
}

// ── 9. Activity ──────────────────────────────────────────────────────────────
export function WorkStationActivityPage() {
  const path = '/signals-preview/workstation-activity';
  return (
    <Page path={path} intro={note(path)}>
      <Screen label="Activity expanded" ws={{ initialSelectedId: 't1', initialDetailActivityOpen: true }} />
      <Screen label="Context + Activity both expanded" ws={{ initialSelectedId: 't1', initialDetailContextOpen: true, initialDetailActivityOpen: true }} />
      <Screen label="Comment composer open" ws={{ initialSelectedId: 't1', initialDetailActivityOpen: true, initialDetailCommentComposerOpen: true }} />
      <Screen label="Comment typed" ws={p({ commentDraft: 'Confirmed with Priya — publishing this afternoon.' }, { initialSelectedId: 't1', initialDetailActivityOpen: true })} />
    </Page>
  );
}

// ── 10. New task ─────────────────────────────────────────────────────────────
export function WorkStationNewTaskPage() {
  const path = '/signals-preview/workstation-new-task';
  const open = { initialCreateOpen: true };
  return (
    <Page path={path} intro={note(path)}>
      <Screen label="New task — empty" note="NEW TASK eyebrow, title input, Assignee / Status / Priority / Due, Description; Create task stays disabled until there is a title" ws={open} />
      <Screen label="New task — filled in" ws={p({ newTask: { title: NEW_TITLE, description: 'Walk through the proposed split before the QBR deck is locked.', assigneeId: 'self', priority: 'High', due: '12 Nov' } }, open)} />
      <Screen label="New task — Assignee menu" ws={p({ newTaskMenu: 'assignee', newTask: { title: NEW_TITLE } }, open)} />
      <Screen label="New task — Priority menu" ws={p({ newTaskMenu: 'priority', newTask: { title: NEW_TITLE } }, open)} />
      <Screen label="New task — Due date picker" ws={p({ newTaskMenu: 'due', newTask: { title: NEW_TITLE } }, open)} />
    </Page>
  );
}

// ── 11. Ask Jiva ─────────────────────────────────────────────────────────────
export function WorkStationJivaPage() {
  const path = '/signals-preview/workstation-jiva';
  const open = { initialSelectedId: 't1' };
  return (
    <Page path={path} intro={note(path)}>
      <Screen label="Ask Jiva — opened" note="the chat docks as a third column; four suggestion chips under the greeting" ws={p({}, open)} page={{ globalJivaOpen: true }} />
      <Screen label="Ask Jiva — suggestion picked" note="tapping a chip fills the input and enables the send button" ws={p({ jivaDraft: 'What should I do next?' }, open)} page={{ globalJivaOpen: true }} />
      <Screen label="Ask Jiva — Jiva is thinking" ws={p({ jivaTyping: true, jivaConversation: true }, open)} page={{ globalJivaOpen: true }} />
      <Screen label="Ask Jiva — conversation" ws={p({ jivaConversation: true }, open)} page={{ globalJivaOpen: true }} />
    </Page>
  );
}

// ── All screens on one page ──────────────────────────────────────────────────
export function WorkStationAllPage() {
  return (
    <PreviewShell current="/signals-preview/workstation-all" intro={INTRO + 'Every state below is on this one page, in order: layout, list and read state, search and filters, row menus, task detail (meeting, alert, Jiva-generated, created), field popovers, Activity, New task and Ask Jiva.'}>
      <InAllScreens.Provider value>
        <WorkStationLayoutPage />
        <WorkStationListPage />
        <WorkStationFiltersPage />
        <WorkStationMenusPage />
        <WorkStationMeetingTasksPage />
        <WorkStationAlertTasksPage />
        <WorkStationOriginsPage />
        <WorkStationFieldsPage />
        <WorkStationActivityPage />
        <WorkStationNewTaskPage />
        <WorkStationJivaPage />
      </InAllScreens.Provider>
    </PreviewShell>
  );
}

/** Route table for the Work-station handoff pages. */
export const WORKSTATION_PREVIEW_ROUTES: { path: string; element: React.ReactElement }[] = [
  { path: '/signals-preview/workstation-all', element: <WorkStationAllPage /> },
  { path: '/signals-preview/workstation', element: <WorkStationLayoutPage /> },
  { path: '/signals-preview/workstation-list', element: <WorkStationListPage /> },
  { path: '/signals-preview/workstation-filters', element: <WorkStationFiltersPage /> },
  { path: '/signals-preview/workstation-menus', element: <WorkStationMenusPage /> },
  { path: '/signals-preview/workstation-detail', element: <WorkStationMeetingTasksPage /> },
  { path: '/signals-preview/workstation-alerts', element: <WorkStationAlertTasksPage /> },
  { path: '/signals-preview/workstation-origins', element: <WorkStationOriginsPage /> },
  { path: '/signals-preview/workstation-fields', element: <WorkStationFieldsPage /> },
  { path: '/signals-preview/workstation-activity', element: <WorkStationActivityPage /> },
  { path: '/signals-preview/workstation-new-task', element: <WorkStationNewTaskPage /> },
  { path: '/signals-preview/workstation-jiva', element: <WorkStationJivaPage /> },
];
