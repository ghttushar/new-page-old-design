import type { WidgetKind } from '@/app/components/dashboard/dashboard.types';
import { INSIGHT_BUILDS } from '@/app/components/dashboard/widgets/insights/insight-view';
import { WIDGETS } from '@/app/components/dashboard/widget-registry';

// The written half of the dashboard screen inventory: what each UI group is for, how nuggets fall into groups, and the
// catalogues of dynamic text, animation and findings. Everything that can be read from the code (titles, sizes, scope
// lines, counts) is read live on the page instead of being copied here.

export type GroupId = 'figure' | 'feed' | 'compare' | 'ranked' | 'figures-list' | 'events' | 'list' | 'split' | 'target' | 'heat' | 'side' | 'score';

export interface Group {
  id: GroupId;
  name: string;
  /** What a nugget of this kind is for, in one line. */
  purpose: string;
  /** When to reach for it. */
  use: string;
  representative: WidgetKind;
  /** Grid height (rows of 40px) for the live specimen. */
  rows: number;
  anatomy: { part: string; detail: string }[];
  states: string[];
  interactions: string[];
}

export const GROUPS: Group[] = [
  {
    id: 'figure', name: 'Headline figure + breakdown', representative: 'value-at-risk', rows: 8,
    purpose: 'One total, how it moved since yesterday, and what it is made of.',
    use: 'When the question is “how much, and where from?”: money at risk, money to win, any total that splits by category.',
    anatomy: [
      { part: 'Figure', detail: 'The total in Inter Tight 40px, money formatted as $940, $7.9K, $120K or $1.23M.' },
      { part: 'Delta pill', detail: 'Arrow and percent with “vs yesterday”; green when it moved the good way, red otherwise. Tooltip “Yesterday: $X”. Only on the Today period.' },
      { part: 'Caption', detail: '“N alerts today”, “1 alert yesterday”, “N alerts over two days” or “No alerts today”.' },
      { part: 'Category split', detail: 'One row per category: name, amount, share %, and a 6px bar on a grey track. As many rows as fit the height, up to 5.' },
      { part: 'Header chip', detail: 'Period: Today, Yesterday, Last 2 days.' },
    ],
    states: ['Delta up / down / hidden', 'Zero total: “$0” and “No alerts today”, no split rows', 'Rows shown change with the nugget height'],
    interactions: ['Switch the Period chip and watch the figure, caption and split change', 'Hover the delta pill for yesterday’s value'],
  },
  {
    id: 'feed', name: 'Inbox / feed', representative: 'important-messages', rows: 10,
    purpose: 'Read what came in, newest first, and open any item.',
    use: 'For messages, alerts and events where each item is read once and then acted on.',
    anatomy: [
      { part: 'Message row', detail: 'Avatar with initials, a channel badge (Email, Slack, Google Workspace), sender, time, one-line subject and a caret.' },
      { part: 'Open message', detail: 'From line, the full body, attachment chips (file name and size), then “Open in Signals” and “Mark as read” / “Mark as unread”.' },
      { part: 'Show more', detail: '“Show N more” under the list.' },
      { part: 'While you were away (same group)', detail: 'Alerts on a time rail grouped by hour with sticky hour labels, a “High” badge, category and account, and the value in red or green.' },
      { part: 'Header chip', detail: 'Channel: All channels, Email, Slack, Workspace (messages) / Priority: All priorities, Medium and high, High only (while away).' },
    ],
    states: ['Unread: sender and subject in ink, 600 weight', 'Open (several at once): rail background', 'Opening an unread message marks it read', 'Empty: “No messages on this channel.” / “All caught up. Nothing new matches these settings.”'],
    interactions: ['Open a message (it animates open, 0.22s)', 'Mark it unread again', 'Change channel', 'Show more'],
  },
  {
    id: 'compare', name: 'Comparison (A vs B)', representative: 'rule-compare', rows: 11,
    purpose: 'Compare two things side by side on several metrics.',
    use: 'Rule against baseline, rule against rule, any “which is better and by how much” question. Five views of the same comparison.',
    anatomy: [
      { part: 'Control strip', detail: 'Side A button, “vs”, Side B button, then Metrics, View and Range dropdowns. Wraps under 560px.' },
      { part: 'Side button', detail: 'Letter tag (A purple, B grey or blue), the side’s label, the picked name in bold, a caret. Opens a 320px picker with search, group tabs, and Rule / Template tags.' },
      { part: 'Metrics', detail: '“All metrics”, one metric or “ROAS +2”. Checkbox list; the last ticked metric can’t be unticked (“Keep at least one metric”).' },
      { part: 'View', detail: 'Line trend, Grouped bars, Table, Number tiles, Change per metric.' },
      { part: 'Range', detail: 'Last 7, 14, 30, 60 days.' },
      { part: 'Views', detail: 'Line (one metric: stats row with Impact or Difference pill; several: small multiples), Bars (baseline hatched), Table (Metric, A, B, Change, Winner), Tiles, Change per metric (diverging bars from zero).' },
    ],
    states: ['Delta pill: green, red, flat (grey) or quiet', 'Winner: A, B or Even (within 0.5%)', 'Picker search with no results: “Nothing matches “q””', 'Impact tone (Rule impact) vs neutral tone (Rule vs rule)'],
    interactions: ['Pick a different rule on each side', 'Tick and untick metrics', 'Switch through all five views', 'Change the range', 'Hover the chart for its tooltip'],
  },
  {
    id: 'ranked', name: 'Ranked list with metric switch', representative: 'top-performers', rows: 10,
    purpose: 'Who is best (or worst) on one metric, top N, as a table or bars.',
    use: 'Leaderboards: top campaigns by sales, poorest keywords by ROAS.',
    anatomy: [
      { part: 'Control strip', detail: '“Show” (Campaigns / Keywords) and “Ranked by” heading selects, then How many (Top 5, 10, 15, All), View (Table / Bars) and Range.' },
      { part: 'Table', detail: '“#”, name with a monospace “ID …” line, and the value. ACOS and CPC say “· lowest first”.' },
      { part: 'Bars', detail: 'Rank, name and ID on one line, a purple bar scaled to the top value, the value.' },
      { part: 'Poor keywords (same group)', detail: 'Ranked by ROAS (lowest first) or Ad Spend (highest first), with the other figure muted beside it; red bars.' },
    ],
    states: ['Lowest-first metrics (ACOS, CPC) reverse the order', 'Sticky table header while the list scrolls'],
    interactions: ['Switch campaigns and keywords', 'Change the metric, the count and the view', 'Change the range'],
  },
  {
    id: 'figures-list', name: 'Figures + ranked list', representative: 'inv-cover', rows: 10,
    purpose: 'A few headline counts, then the items behind them, and a link to act.',
    use: 'Most operational questions: what is running out, what is priced high, what is losing money. The figures say how big the problem is; the list says where.',
    anatomy: [
      { part: 'Figures strip', detail: 'Two to three figures with uppercase labels, a 20px value and a faint caption, divided by hairlines. Values turn green, red or amber by meaning.' },
      { part: 'List head', detail: 'Two uppercase labels, e.g. “Item and stock-out date | Cover”.' },
      { part: 'Row', detail: 'Name, an optional tag (status, type), a meta line, an optional bar in the row’s tone, and the value with a small line under it.' },
      { part: 'Link', detail: 'Purple “Open …” link pinned to the bottom, to the page the data comes from.' },
      { part: 'Header chip', detail: 'Marketplace: All marketplaces, Amazon, Walmart, when both have the data.' },
    ],
    states: ['Tones: good (green), bad (red), warn (amber), neutral', 'Empty: one line of copy instead of the list, e.g. “Every item has more than 21 days of cover.”', 'Amazon-only nuggets say “· Amazon only” and have no chip'],
    interactions: ['Switch the marketplace', 'Scroll the list (the head stays)', 'Follow the link'],
  },
  {
    id: 'events', name: 'Figures + event feed', representative: 'rev-negative', rows: 10,
    purpose: 'Things that just happened, newest first, each tagged with what kind of event it is.',
    use: 'Change logs and incoming events: listing edits, price moves, new negative reviews, competitor deals, shipments, support cases.',
    anatomy: [
      { part: 'Figures strip', detail: 'Counts by kind, e.g. 1★ and 2★, price cuts and new deals, cases waiting on you.' },
      { part: 'Event row', detail: 'What happened (a review quote, a case subject, an item), a tag naming the kind of event, where and who in the meta line, and when on the right (“today”, “yesterday”, “3 days ago”, “12h ago”).' },
      { part: 'Link', detail: 'To the page where the events are handled.' },
    ],
    states: ['Tags are never coloured; the value carries the tone', 'Empty: e.g. “No 1 or 2 star reviews this week.”'],
    interactions: ['Switch the marketplace', 'Scroll the feed'],
  },
  {
    id: 'list', name: 'List only (agenda / feed)', representative: 'work-meetings', rows: 9,
    purpose: 'A short list of things to look at, each with its own tags and details.',
    use: 'Agendas and feeds where a headline number adds nothing: upcoming meetings, query funnels, items bought together.',
    anatomy: [
      { part: 'Row', detail: 'Title, a tag (e.g. the account), a meta line (time, open alerts, attendees), a progress bar and a figure (e.g. “2/5 tasks done”, “3/3 ready”).' },
      { part: 'Link', detail: 'Upcoming meetings links to the Meetings tab (/signals?tab=meetings).' },
    ],
    states: ['Ready (all prep done) in green, in progress in amber', 'Empty: “No meetings coming up.”'],
    interactions: ['Open Meetings'],
  },
  {
    id: 'split', name: 'Share split', representative: 'profit-net', rows: 9,
    purpose: 'How a whole divides into parts.',
    use: 'Where the money goes, spend by ad type, share of voice against competitors, complaint themes.',
    anatomy: [
      { part: 'Figures strip', detail: 'Optional, as in Figures + ranked list.' },
      { part: 'Share bars', detail: 'One labelled bar per part with its percent. Bars carry the series colour, but the label sits on the bar, so nothing depends on a colour legend.' },
      { part: 'List', detail: 'Optional detail per part (e.g. ROAS per ad type).' },
    ],
    states: ['Series colours a, b, c, d, neutral, plus good, bad, warn'],
    interactions: ['Switch the marketplace and watch the shares re-balance'],
  },
  {
    id: 'target', name: 'Metric vs target', representative: 'health-account', rows: 10,
    purpose: 'Each metric against its limit, and how much of the allowance is used.',
    use: 'Policy and goal tracking: account health targets, sales against the monthly target, storage against capacity.',
    anatomy: [
      { part: 'Figures strip', detail: 'Overall standing per marketplace (e.g. “Amazon AHR 248, Healthy”, “Walmart At risk”) and how many metrics are at risk.' },
      { part: 'Row', detail: 'Metric, marketplace and target (“target under 1%”), current value, “healthy / at risk / breached”, and a bar showing the allowance used.' },
    ],
    states: ['Healthy under 80% used, at risk 80%+, breached at 100%'],
    interactions: ['Switch the marketplace'],
  },
  {
    id: 'heat', name: 'Heatmap', representative: 'ads-daypart', rows: 7,
    purpose: 'When something performs best, hour by weekday.',
    use: 'Timing questions: when ads convert, when to raise or lower bids.',
    anatomy: [
      { part: 'Grid', detail: '7 weekdays × 12 two-hour slots; darker cells return more. Each cell has a tooltip with its value.' },
      { part: 'Paused hours', detail: 'Hatched, not coloured, so “off” never reads as “low”.' },
      { part: 'Legend', detail: '“Darker returns more · hatched hours are paused by Day Parting”.' },
      { part: 'Link', detail: 'Open Day Parting.' },
    ],
    states: ['Scrolls sideways below 360px wide'],
    interactions: ['Hover any cell', 'Switch the marketplace'],
  },
  {
    id: 'side', name: 'Side-by-side summaries', representative: 'new-keywords', rows: 7,
    purpose: 'Two routes or options, summed up on the same figures.',
    use: 'When there are exactly two paths to compare at a glance, e.g. Auto → Manual against Manual → Manual.',
    anatomy: [
      { part: 'Route card', detail: 'Heading with an arrow, a one-line hint, then a 2×2 of figures: Campaigns, Keywords, Unique keywords, Avg ROAS.' },
      { part: 'Link', detail: 'One shared “View more in Targeting Actions”.' },
    ],
    states: ['Cards stack below 420px wide'],
    interactions: ['Follow the link'],
  },
  {
    id: 'score', name: 'Score + picker + details', representative: 'item-health', rows: 10,
    purpose: 'One health score for everything, or for the items you pick, each opening to its details.',
    use: 'When a single score needs to be explained item by item.',
    anatomy: [
      { part: 'Search', detail: '“Search items by name or ID”. Opens a list with checkboxes, name, ID and score.' },
      { part: 'Total card', detail: 'Score /100, band word (Healthy, Needs attention, Critical), a health bar, “All N items” or “N items picked” with Clear, and the band counts.' },
      { part: 'Item row', detail: 'Name, ID, score with a small bar, a caret; opens to Listing Quality, In Stock, availability, Buy Box win rate and the item’s alerts.' },
    ],
    states: ['Bands: 80+ healthy (green), 50+ needs attention (amber), below 50 critical (red)', 'Search with no results: “Nothing matches “q””', '“In Stock: No” in red'],
    interactions: ['Search and pick items', 'Clear', 'Open an item'],
  },
];

export const GROUP = Object.fromEntries(GROUPS.map((g) => [g.id, g])) as Record<GroupId, Group>;

const FIXED: Partial<Record<WidgetKind, GroupId>> = {
  'value-at-risk': 'figure', 'opportunity-value': 'figure',
  'important-messages': 'feed', 'while-away': 'feed',
  'rule-impact': 'compare', 'rule-compare': 'compare',
  'top-performers': 'ranked', 'poor-keywords': 'ranked',
  'new-opportunities': 'figures-list', 'new-keywords': 'side', 'item-health': 'score',
};

/**
 * The UI group a nugget belongs to. The original nuggets are placed by hand; insight nuggets are sorted by the blocks
 * their view actually renders, so a new one lands in the right group without an edit here.
 */
export function groupOf(kind: WidgetKind): GroupId {
  const fixed = FIXED[kind];
  if (fixed) return fixed;
  const build = INSIGHT_BUILDS.get(kind as never);
  if (!build) return 'figures-list';
  const view = build('all');
  if (view.heat) return 'heat';
  if (view.segments?.length) return 'split';
  if (WIDGETS[kind].art === 'gauge') return 'target';
  if (view.stats?.length) return WIDGETS[kind].art === 'feed' ? 'events' : 'figures-list';
  return 'list';
}

// ── Dynamic text ────────────────────────────────────────────────────────────────────────────

export interface DynamicText { text: string; where: string; how: string }

/** Strings that change on their own. Live examples are added on the page where they can be computed. */
export const DYNAMIC_TEXT: DynamicText[] = [
  { text: 'Greeting', where: 'Page header', how: 'One of 10 greetings, picked at random for the hour, never the one shown last time (remembered in the browser). Picked once per visit.' },
  { text: 'User name', where: 'Greeting', how: 'Fixed for now: “Tushar” (DASHBOARD_USER_NAME). Will come from the signed-in user.' },
  { text: 'Calendar tile', where: 'Page header', how: 'Month (short, upper case), day of month, weekday (short), in the browser’s locale.' },
  { text: 'Clock', where: 'Page header', how: 'Hours and minutes with AM/PM, refreshed every 10 seconds; the colon blinks once a second.' },
  { text: 'Part-of-day icon', where: 'Page header', how: 'Morning 5–11 (sun on the horizon), afternoon 12–16 (sun), evening 17–20 (sun on the horizon), night (moon and stars).' },
  { text: 'Date line', where: 'Page header', how: 'Day, month and year in the browser’s locale.' },
  { text: 'Fun fact or pun', where: 'Empty dashboard', how: 'One of 14 lines, random, never the one shown last time. Label reads “Fun fact” or “Pun of the day”.' },
  { text: 'Scope line under each nugget title', where: 'Every nugget', how: 'describe(config): worked out from the nugget’s settings and data. All 63 are listed live in “Every nugget”.' },
  { text: 'Rail counts', where: 'Add nugget library', how: 'All nuggets, New nuggets, per category, and Templates (presets + saved + 1 blank).' },
  { text: '“Results for “q”” / “N nuggets found”', where: 'Library search', how: 'Case-insensitive match on title, summary, data points and category, across every area.' },
  { text: '“On dashboard” / “On dashboard ×N”', where: 'Library card', how: 'How many nuggets of that kind are on the dashboard.' },
  { text: '“Add” / “Add again” / “Added”', where: 'Library card button', how: '“Add again” when already on the dashboard; “Added” for 1.2s after a click.' },
  { text: '“N nuggets added to your dashboard”', where: 'Library footer', how: 'Counts adds since the library opened; resets on each open.' },
  { text: '“Template N”', where: 'Save as template', how: 'N starts at saved templates + 1 and goes up until the name is free.' },
  { text: '“N nuggets, saved 28 Oct”', where: 'Saved template card', how: 'Nugget count and the save date (day, short month).' },
  { text: 'Undo toast', where: 'Bottom of the page', how: '“‹Title› removed”, “Switched to ‹name›” or “Dashboard cleared”; hides after 6s.' },
  { text: 'Figures, deltas and “vs yesterday”', where: 'Nugget bodies', how: 'Worked out from the sample data each render; the sample data is seeded, so it is the same on every visit.' },
  { text: 'Months, “today”, “yesterday”, “N days ago”, “day 28 of 31”', where: 'Insight nuggets', how: 'Worked out from today’s date (new Date()).' },
  { text: 'Message read state', where: 'Important messages', how: 'Opening an unread message marks it read; “Mark as unread” reverses it. Kept for the visit only.' },
];

// ── Animation ───────────────────────────────────────────────────────────────────────────────

export interface Animation { name: string; trigger: string; moves: string; timing: string; reduced: string; play?: 'hello' | 'empty' | 'glide' | 'toast' | 'library' | 'tip' | 'nuggets' }

export const ANIMATIONS: Animation[] = [
  { name: 'Calendar flip', trigger: 'Page load', moves: 'The calendar tile turns down from rotateX(−75°) and fades in', timing: '0.7s, ease (0.22, 1, 0.36, 1)', reduced: 'Off', play: 'hello' },
  { name: 'Greeting words', trigger: 'Page load', moves: 'Each word rises 12px and fades in, one after another', timing: '0.5s each, 0.045s apart from 0.18s', reduced: 'Off', play: 'hello' },
  { name: 'Clock line fade', trigger: 'Page load', moves: 'Clock and date fade in', timing: '0.5s at 0.55s', reduced: 'Off', play: 'hello' },
  { name: 'Clock colon tick', trigger: 'Always', moves: 'The colon dims to 25% for half of every second', timing: '1s steps, infinite', reduced: 'Off', play: 'hello' },
  { name: 'Empty state rise', trigger: 'Empty dashboard shows', moves: 'Art, copy and actions rise 14px and fade in', timing: '0.5s at 0.1s, 0.3s, 0.45s', reduced: 'Off', play: 'empty' },
  { name: 'Floating cards', trigger: 'Empty dashboard', moves: 'Three mini cards fade in, then bob up 6px and back', timing: '4.2s ease-in-out loop', reduced: 'Still', play: 'empty' },
  { name: 'Add nugget sheen', trigger: 'Empty dashboard', moves: 'A light band sweeps across the button', timing: '3.2s loop, sweep in the first 35%', reduced: 'Off', play: 'empty' },
  { name: 'Add nugget glide', trigger: 'First nugget added / last removed', moves: 'The button glides between the middle of the page and the header (shared layout)', timing: 'motion layout default', reduced: 'Jumps', play: 'glide' },
  { name: 'Library open / close', trigger: 'Add nugget', moves: 'Overlay fades; panel rises 12px and scales from 0.985', timing: 'Overlay 0.16s; panel spring (stiffness 380, damping 34)', reduced: 'Fade only', play: 'library' },
  { name: 'Library footer', trigger: 'First add in the library', moves: 'Footer slides up 8px and fades in', timing: 'motion default', reduced: 'Not handled' },
  { name: 'Card art lift', trigger: 'Hover a library card', moves: 'Drawing moves up 2px', timing: '320ms ease (0.22, 0.8, 0.3, 1)', reduced: 'Off' },
  { name: 'Card tooltip', trigger: 'Hover a new card 350ms, or its info button', moves: 'Fades in, rising 4px', timing: '160ms ease', reduced: 'Off', play: 'tip' },
  { name: '“Added” flash', trigger: 'Add on a card', moves: 'Button label swaps to “Added” with a tick', timing: '1.2s, then back', reduced: 'Same' },
  { name: 'Template miniature lift', trigger: 'Hover a preset card', moves: 'Tiles lift 1px, shadow grows', timing: '320ms', reduced: 'Not handled' },
  { name: 'Saved template in / out', trigger: 'Save or delete a template', moves: 'Card scales from 0.96 and fades; others reflow', timing: '0.22s ease (0.22, 1, 0.36, 1)', reduced: 'Fade only' },
  { name: 'Just-saved highlight', trigger: 'Save as template', moves: 'Card border fades from purple to grey', timing: '2.4s', reduced: 'Off' },
  { name: 'Dropdown panel', trigger: 'Open any chip, select or picker', moves: 'Panel fades in from 4px above', timing: '140ms ease-out', reduced: 'Off' },
  { name: 'Caret turn', trigger: 'Open a dropdown or row', moves: 'Caret rotates 180°', timing: '160ms (selects), 180ms (item health); none on messages', reduced: 'Not handled' },
  { name: 'Message open / close', trigger: 'Click a message', moves: 'Height and opacity from 0', timing: '0.22s ease (0.22, 0.8, 0.3, 1)', reduced: 'Fade on close only', play: 'nuggets' },
  { name: 'Bars change', trigger: 'A value changes', moves: 'Bars on a track resize (scaleX)', timing: '320ms (Signals, Top performers, Item health); 420ms (insight bars)', reduced: 'Off on Signals bars', play: 'nuggets' },
  { name: 'Comparison bars grow', trigger: 'Bars or Change view shows', moves: 'Bars grow from the axis (rcGrow / rcGrowX)', timing: '420ms ease', reduced: 'Off', play: 'nuggets' },
  { name: 'Line chart draw', trigger: 'Line view shows', moves: 'Lines draw in (Recharts)', timing: '≈1.5s', reduced: 'Off', play: 'nuggets' },
  { name: 'Grid guides', trigger: 'Start dragging or resizing', moves: 'Column guides fade in', timing: '200ms ease-out', reduced: 'Off' },
  { name: 'Nuggets make room', trigger: 'Dragging or resizing', moves: 'Other nuggets slide; the moving one gets a deep shadow', timing: '180ms; placeholder 120ms', reduced: 'Off' },
  { name: 'Undo toast', trigger: 'Remove, apply a template, clear', moves: 'Rises 12px and fades in; reverse on hide', timing: '0.18s', reduced: 'Not handled', play: 'toast' },
  { name: 'Hover and press', trigger: 'Any button', moves: 'Colours change; buttons press to 98%', timing: 'Colours 140–160ms; press 120ms', reduced: 'Not handled' },
];

// ── Findings ────────────────────────────────────────────────────────────────────────────────

export const FINDINGS: { title: string; detail: string }[] = [
  { title: 'Customize settings are never drawn', detail: 'Several nuggets declare settings (marketplace, categories, “only unread”, group by…), but no panel shows them, so they stay at their defaults.' },
  { title: 'Nugget links in the definition are never drawn', detail: 'The original nuggets’ “Open Signals” / “Open applied rules” links are defined but not shown; only links inside a body appear.' },
  { title: 'Read-only preview is never used', detail: 'The library shows drawings, so the nuggets’ preview mode is unreachable.' },
  { title: 'Two styles share one class name', detail: 'The nugget empty message and the empty dashboard both use .empty, so nugget empty text inherits a full-page height.' },
  { title: 'Message read state is lost on reload', detail: 'Only templates are saved; the dashboard and its settings start fresh each visit.' },
  { title: 'Message caret snaps', detail: 'It turns without a transition, unlike every other caret.' },
  { title: '“Email, Email” tooltip', detail: 'An email message’s channel badge repeats the channel name.' },
  { title: '“Current” is decided by name', detail: 'After editing an applied preset it still shows “Applied” and can’t be re-applied to reset.' },
  { title: 'Focus isn’t returned', detail: 'Closing the library doesn’t put focus back on Add nugget.' },
  { title: 'Drag handle isn’t keyboard reachable', detail: 'The grip has tabIndex −1.' },
  { title: 'Some motion ignores reduced motion', detail: 'Template tile lift, button press, undo toast, library footer, caret turns, and the 420ms bars in the insight nuggets.' },
  { title: '“Top topic” is not the most frequent topic', detail: 'New negative reviews picks one of this week’s topics instead of counting them.' },
  { title: 'Upcoming meetings counts every alert on the account', detail: 'Alert status is kept per visit, not on the alert, so resolved alerts still count as open.' },
  { title: 'Fixed: month labels at month end', detail: 'TACoS and New-to-brand built month labels by changing today’s month, so on the 29th–31st a month could repeat. They now count from the first of the month.' },
];
