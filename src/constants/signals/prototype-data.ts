export type AlertPriority = 'High' | 'Medium' | 'Low';
export type AlertDay = 'today' | 'yesterday';
export type MpBrand = 'amazon' | 'walmart';

export interface AlertItem {
  name: string;
  sku: string;
  impact: string;
  color: string;
}

export interface AlertOption {
  id: string;
  kind: 'INSTRUCTIVE' | 'GENERATIVE' | 'PROCESS' | 'OTHER';
  label: string;
  desc: string;
  expected?: string;
  confidence?: number;
  recommended?: boolean;
  isOther?: boolean;
  isMeetingAsk?: boolean;
}

export interface PrototypeAlert {
  id: string;
  day: AlertDay;
  time: string;
  valueNum: number;
  valueLabel: string;
  priority: AlertPriority;
  priorityDot: string;
  title: string;
  impactStr: string;
  mpBrand: MpBrand;
  mpColor: string;
  mpCountry: string;
  account: string;
  category: string;
  repeated: boolean;
  hasMeeting: boolean;
  meetingLabel?: string;
  windowLabel: string;
  subheader: string;
  why: string;
  root: string;
  oppWindow: string;
  revLabel: string;
  revValue: string;
  confidence: number;
  source: string;
  proof: 'estimated' | 'verified';
  aiSummary: string;
  itemsCount: number;
  itemsBreakdown: string;
  itemsBadge: string;
  items: AlertItem[];
  options: AlertOption[];
}

export const PROTOTYPE_ALERTS: PrototypeAlert[] = [
  {
    id: 'a1',
    day: 'today',
    time: '07:04 AM',
    valueNum: -7940,
    valueLabel: '−$7,940',
    priority: 'High',
    priorityDot: '#b3453f',
    title: 'Net profit down 12% across 14 ASINs',
    impactStr: 'Net profit at risk',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Nutrabay',
    category: 'Catalog',
    repeated: true,
    hasMeeting: true,
    meetingLabel: 'In your 10:30',
    windowLabel: 'Act within 6 hrs',
    subheader: 'Content pushed by the client on 28 Oct cut conversion from 9.1% to 6.4% across 14 ASINs.',
    why: 'A catalogue push on 28 Oct replaced bullet copy on 14 ASINs, dropping 3 ranking keywords.',
    root: 'No approval gate exists on the client PIM feed, so the same overwrite recurs untouched.',
    oppWindow: '30 days',
    revLabel: 'Revenue at risk',
    revValue: '$7,940',
    confidence: 95,
    source: 'Catalog history, computed 07:04',
    proof: 'estimated',
    aiSummary: 'The client broke their own listings on 28 Oct — about $7,940 lost so far. Reverting takes ~6 hrs and restores conversion, but the same push will overwrite it again tomorrow unless an approval gate is added.',
    itemsCount: 14,
    itemsBreakdown: '14 ASINs',
    itemsBadge: '14 ASINs',
    items: [
      { name: 'Whey Protein Isolate 1kg · Chocolate', sku: 'B08XK2QW9L', impact: '−$1,240', color: '#b3453f' },
      { name: 'Whey Protein Isolate 1kg · Vanilla', sku: 'B07QW9LMN2', impact: '−$1,010', color: '#b3453f' },
      { name: 'BCAA 250g · Watermelon', sku: 'B09LMN4RT8', impact: '−$860', color: '#b3453f' },
      { name: 'Creatine Monohydrate 300g', sku: 'B06TY7HJ3K', impact: '+$310', color: '#3f7d6a' },
    ],
    options: [
      { id: 'o1', kind: 'INSTRUCTIVE', label: 'Revert bullet points to the 27 Oct version', desc: 'Restores the copy that held 9.1% conversion and requests a re-index. Reversible.', expected: '+$7,100', confidence: 95, recommended: true },
      { id: 'o2', kind: 'GENERATIVE', label: 'Rewrite bullets with the winning keyword set', desc: 'Higher ceiling, less certain — you review and edit before publishing.', expected: '+$8,400', confidence: 71 },
      { id: 'o3', kind: 'PROCESS', label: 'Ask the client for a PIM approval gate', desc: 'Prevents recurrence rather than fixing today. Becomes a discussion point.', isMeetingAsk: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action — tracked and measured the same way.', isOther: true },
    ],
  },
  {
    id: 'a2',
    day: 'today',
    time: '06:40 AM',
    valueNum: 5300,
    valueLabel: '+$5,300',
    priority: 'Medium',
    priorityDot: '#5c7f9e',
    title: 'Bullet copy is under-performing on 6 hero ASINs',
    impactStr: 'Revenue opportunity',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Nutrabay',
    category: 'Advertising',
    repeated: false,
    hasMeeting: false,
    windowLabel: 'Act within 2 days',
    subheader: 'These listings convert below category median despite strong traffic — nothing is broken.',
    why: 'Six ASINs draw 9,400 weekly sessions but convert at 5.8% against a 7.9% category median.',
    root: 'Copy was written at launch and never revised against search data; competitors updated in August.',
    oppWindow: '30 days',
    revLabel: 'Revenue gain',
    revValue: '$5,300',
    confidence: 78,
    source: 'Advertising Agent, search terms',
    proof: 'estimated',
    aiSummary: 'Six good listings are under-selling because the copy has never been touched. Drafting new bullets from the winning search terms costs no spend and is worth about $5,300 a month.',
    itemsCount: 6,
    itemsBreakdown: '6 listings',
    itemsBadge: '6 listings',
    items: [
      { name: 'Resistance Band Set', sku: 'B02AA1122', impact: '+$980', color: '#3f7d6a' },
      { name: 'Yoga Mat Pro', sku: 'B02BB3344', impact: '+$860', color: '#3f7d6a' },
      { name: 'Foam Roller', sku: 'B02CC5566', impact: '+$710', color: '#3f7d6a' },
    ],
    options: [
      { id: 'o1', kind: 'GENERATIVE', label: 'Generate new bullet copy from the winning keyword set', desc: 'Draft five bullets per ASIN, screened for compliance. You review before publishing.', expected: '+$5,300', confidence: 78, recommended: true },
      { id: 'o2', kind: 'INSTRUCTIVE', label: 'Add the three keywords to exact-match targeting instead', desc: 'Buys traffic rather than earning it — faster, but costs spend.', expected: '+$2,100', confidence: 84 },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action — tracked and measured the same way.', isOther: true },
    ],
  },
  {
    id: 'a3',
    day: 'today',
    time: '06:02 AM',
    valueNum: 6200,
    valueLabel: '+$6,200',
    priority: 'Low',
    priorityDot: '#3f7d6a',
    title: 'Inventory reorder on three SKUs came back verified',
    impactStr: 'Verified gain',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Nutrabay',
    category: 'Inventory',
    repeated: false,
    hasMeeting: true,
    meetingLabel: 'In your 10:30',
    windowLabel: 'No action needed',
    subheader: 'Applied Thursday, measured over seven days on units sold — safe to present.',
    why: 'Three SKUs were nearing stock-out with a 21-day lead time against 14 days of cover.',
    root: 'Demand forecast under-counted a promotional spike from two weeks prior.',
    oppWindow: 'Closed',
    revLabel: 'Recovered',
    revValue: '$6,200',
    confidence: 97,
    source: 'Inventory Agent, replenishment log',
    proof: 'verified',
    aiSummary: 'Reorder landed on time and stock-out risk cleared. Verified over seven days — this is safe to present as a result.',
    itemsCount: 3,
    itemsBreakdown: '3 ASINs',
    itemsBadge: '3 ASINs',
    items: [
      { name: 'Premium Roast 80 Count', sku: 'B09XYZ1234', impact: '+$3,100', color: '#3f7d6a' },
      { name: 'Dark Roast 80 Count', sku: 'B09XYZ5678', impact: '+$2,050', color: '#3f7d6a' },
      { name: 'Decaf 40 Count', sku: 'B09XYZ9012', impact: '+$1,050', color: '#3f7d6a' },
    ],
    options: [
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Log a follow-up action on this alert.', isOther: true },
    ],
  },
  {
    id: 'a4',
    day: 'yesterday',
    time: '31 Oct · 09:12',
    valueNum: -6380,
    valueLabel: '−$6,380',
    priority: 'Medium',
    priorityDot: '#5c7f9e',
    title: 'Two listings suppressed on image compliance',
    impactStr: 'Revenue at risk',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Wellbeing Nutrition',
    category: 'Catalog',
    repeated: false,
    hasMeeting: false,
    windowLabel: 'Act within 1 day',
    subheader: 'Both listings failed a background-colour compliance check after an asset refresh.',
    why: 'New lifestyle images were pushed on 30 Oct without a white-background pass, tripping compliance.',
    root: 'The creative pipeline has no automated compliance pre-check before publish.',
    oppWindow: '14 days',
    revLabel: 'Revenue at risk',
    revValue: '$6,380',
    confidence: 91,
    source: 'Catalog Agent, compliance log',
    proof: 'estimated',
    aiSummary: 'Two listings have been dark since Thursday. Replacement assets are ready — approving the swap should reinstate both within a day.',
    itemsCount: 2,
    itemsBreakdown: '2 listings',
    itemsBadge: '2 listings',
    items: [
      { name: 'Recovery Blend 500g', sku: 'B05WX1122', impact: '−$3,690', color: '#b3453f' },
      { name: 'Recovery Blend 1kg', sku: 'B05WX3344', impact: '−$2,690', color: '#b3453f' },
    ],
    options: [
      { id: 'o1', kind: 'GENERATIVE', label: 'Swap in compliant replacement assets', desc: 'Reviewed white-background creative, ready to publish.', expected: '+$6,380', confidence: 91, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  {
    id: 'a5',
    day: 'today',
    time: '05:20 AM',
    valueNum: -42600,
    valueLabel: '−$42,600',
    priority: 'High',
    priorityDot: '#b3453f',
    title: 'Price parity violation flagged across the catalog',
    impactStr: 'Net profit at risk',
    mpBrand: 'walmart',
    mpColor: '#0071ce',
    mpCountry: 'US',
    account: 'Boldfit',
    category: 'Profitability',
    repeated: false,
    hasMeeting: true,
    meetingLabel: 'In your 10:30',
    windowLabel: 'Act within 3 days',
    subheader: 'A pricing feed error undercut MAP on 600 ASINs starting overnight, triggering marketplace penalties.',
    why: 'An automated repricer rule misfired at midnight and applied a 15% discount storefront-wide instead of to a single promo collection.',
    root: "The repricer's collection filter was left blank in last week's rule update, so it matched every active listing.",
    oppWindow: '7 days',
    revLabel: 'Revenue at risk',
    revValue: '$42,600',
    confidence: 93,
    source: 'Profitability Agent, pricing feed',
    proof: 'estimated',
    aiSummary: 'A repricer misconfiguration discounted the entire 600-ASIN catalog overnight. Reverting pricing on all items stops further loss; margin already lost on overnight orders is not recoverable.',
    itemsCount: 600,
    itemsBreakdown: '482 ASINs · 94 listings · 24 campaigns',
    itemsBadge: '600 ASINs',
    items: [],
    options: [
      { id: 'o1', kind: 'INSTRUCTIVE', label: 'Revert all 600 ASINs to their pre-incident price', desc: 'Restores MAP-compliant pricing storefront-wide within the hour.', expected: '+$42,600', confidence: 93, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
];

export interface BriefingAlert {
  id: string;
  valueNum: number;
  valueLabel: string;
  dotColor: string;
  title: string;
  meta: string;
  actionLabel: string;
}

export const BRIEFING_ALERTS: BriefingAlert[] = [
  { id: 'a1', valueNum: -7940, valueLabel: '−$7,940', dotColor: '#b3453f', title: 'Net profit down 12% across 14 ASINs', meta: 'High · Nutrabay · repeated 3rd day · 07:04', actionLabel: 'Review' },
  { id: 'a2', valueNum: 5300, valueLabel: '+$5,300', dotColor: '#5c7f9e', title: 'Bullet copy is under-performing on 6 hero ASINs', meta: 'Medium · Nutrabay · 06:40', actionLabel: 'Review' },
  { id: 'a4', valueNum: -6380, valueLabel: '−$6,380', dotColor: '#a8763f', title: 'Two listings suppressed on image compliance', meta: 'Medium · Wellbeing Nutrition · since 30 Oct', actionLabel: 'Review' },
  { id: 'a3', valueNum: 6200, valueLabel: '+$6,200', dotColor: '#3f7d6a', title: 'Inventory reorder on 3 SKUs · verified', meta: 'Low · Nutrabay · measured over 7 days', actionLabel: 'Report' },
  { id: 'a-bb', valueNum: 0, valueLabel: 'no impact measured', dotColor: '#c8ccd2', title: 'Buy-box share improved on 6 ASINs', meta: 'Low · Boldfit · 05:55', actionLabel: '' },
];

export interface BriefingMeeting {
  time: string;
  title: string;
  meta: string;
  progress?: number;
  progressColor?: string;
  actionLabel: string;
  actionStyle: 'primary' | 'ready' | 'muted';
}

export const BRIEFING_MEETINGS: BriefingMeeting[] = [
  { time: '10:30', title: 'Nutrabay · Weekly review', meta: '4 alerts · 2 tasks · 55% prepared', progress: 55, progressColor: '#a8763f', actionLabel: 'Prepare', actionStyle: 'primary' },
  { time: '14:00', title: 'Wellbeing Nutrition · QBR prep', meta: '1 alert · deck ready', progress: 100, progressColor: '#3f7d6a', actionLabel: 'Ready', actionStyle: 'ready' },
  { time: '17:00', title: 'Internal · Pod standup', meta: 'No alerts linked', actionLabel: 'No alerts linked', actionStyle: 'muted' },
];

export interface EngagementDay {
  active: boolean;
  label: string;
}

export const ENGAGEMENT_STREAK: EngagementDay[] = [
  { active: true, label: 'Mon' },
  { active: true, label: 'Tue' },
  { active: true, label: 'Wed' },
  { active: true, label: 'Thu' },
  { active: false, label: 'Fri (quiet day)' },
  { active: true, label: 'Sat' },
  { active: true, label: 'Sun' },
  { active: true, label: 'Today' },
  { active: false, label: 'Tomorrow' },
];

export interface AccountGoal {
  label: string;
  current: string;
  target: string;
  pct: number;
  color: string;
  meta: string;
}

export const ACCOUNT_GOALS: AccountGoal[] = [
  { label: 'Net margin', current: '16.4%', target: '18%', pct: 73, color: '#3f7d6a', meta: '3 of 4 actions this week moved toward it' },
  { label: 'Quarterly GMV', current: '$1.7M', target: '$2.4M', pct: 58, color: '#a8763f', meta: 'Behind pace by about 6 days' },
  { label: 'Ad ROAS', current: '4.8', target: '4.5', pct: 100, color: '#3f7d6a', meta: 'Target met · holding four weeks' },
];

export interface WorkstationTask {
  id: string;
  text: string;
  assignee: string;
  meeting: string;
  due: string;
  dueColor?: string;
  done: boolean;
}

export const WORKSTATION_TASKS: WorkstationTask[] = [
  { id: 't1', text: 'Publish approved bullet copy on the six hero ASINs and confirm re-index completed', assignee: 'You', meeting: 'Wellbeing QBR', due: 'Due 3 Nov', dueColor: '#b3453f', done: false },
  { id: 't2', text: 'Model Q4 stock cover at two scenarios for the hero range', assignee: 'You', meeting: 'Wellbeing QBR', due: 'Due 7 Nov', done: false },
  { id: 't3', text: 'Chase the Q4 promo calendar from Rahul before the 8 November lock', assignee: 'You', meeting: 'Nutrabay weekly review', due: 'Overdue by 7 days', dueColor: '#b3453f', done: false },
  { id: 't4', text: 'Place inventory reorder for the three at-risk SKUs', assignee: 'You', meeting: 'Nutrabay weekly review', due: 'Done 30 Oct', dueColor: '#3f7d6a', done: true },
  { id: 't5', text: 'Send the October performance summary to Sneha', assignee: 'You', meeting: 'Nutrabay weekly review', due: 'Done 29 Oct', dueColor: '#3f7d6a', done: true },
];

export interface ActionRecord {
  label: string;
  impact: string;
  impactColor: string;
  impactStyle?: string;
  meta: string;
  dotColor: string;
}

export const ACTION_HISTORY: ActionRecord[] = [
  { label: 'Inventory reorder · 3 SKUs', impact: '+0.3 pt', impactColor: '#3f7d6a', meta: 'Verified over 7 days on units sold · $6,200 recovered', dotColor: '#3f7d6a' },
  { label: 'Content revert · 13 ASINs', impact: '+0.4 pt', impactColor: '#464646', impactStyle: 'italic', meta: 'Running · 64% applied · estimated until the 7-day window closes', dotColor: '#a8763f' },
  { label: 'Keyword expansion · 12 terms', impact: '+0.2 pt', impactColor: '#464646', impactStyle: 'italic', meta: 'Measuring · 4 of 14 days', dotColor: '#8a7fa8' },
  { label: 'Bid increase · 4 campaigns', impact: '−0.1 pt', impactColor: '#b3453f', meta: 'Verified · moved away from the goal, spend outpaced return', dotColor: '#b3453f' },
];

export interface MeetingListItem {
  id: string;
  timeRange: string;
  account: string;
  title: string;
  alertsMapped: number;
  tasksOpen: number;
  readiness: string;
  readinessColor: string;
  progress: number;
  progressColor: string;
  isToday: boolean;
  dateLabel: string;
}

export const MEETING_LIST: MeetingListItem[] = [
  { id: 'm1', timeRange: '10:30 – 11:15', account: 'Nutrabay', title: 'Weekly performance review', alertsMapped: 4, tasksOpen: 2, readiness: '55% ready', readinessColor: '#a8763f', progress: 55, progressColor: '#a8763f', isToday: true, dateLabel: 'Today' },
  { id: 'm2', timeRange: '14:00 – 14:30', account: 'Wellbeing', title: 'QBR preparation call', alertsMapped: 1, tasksOpen: 0, readiness: 'Ready', readinessColor: '#3f7d6a', progress: 100, progressColor: '#3f7d6a', isToday: true, dateLabel: 'Today' },
  { id: 'm3', timeRange: '11:00 – 12:00', account: 'Boldfit', title: 'Q4 planning and inventory commitments', alertsMapped: 2, tasksOpen: 3, readiness: 'Not started', readinessColor: '#b3453f', progress: 8, progressColor: '#b3453f', isToday: false, dateLabel: 'Monday · 3 November' },
];

export interface CompletedMeeting {
  id: string;
  timeRange: string;
  account: string;
  title: string;
  alertsMapped: number;
  tasksExtracted: number;
  status: string;
  statusColor: string;
  momStatus: string;
  momColor: string;
  dateLabel: string;
}

export const COMPLETED_MEETINGS: CompletedMeeting[] = [
  { id: 'm4', timeRange: '15:00 – 15:44', account: 'Wellbeing', title: 'Quarterly business review', alertsMapped: 3, tasksExtracted: 4, status: 'Completed', statusColor: '#3f7d6a', momStatus: 'MOM unsent', momColor: '#a8763f', dateLabel: 'Yesterday · 31 October' },
  { id: 'm5', timeRange: '10:30 – 11:20', account: 'Nutrabay', title: 'Weekly performance review', alertsMapped: 5, tasksExtracted: 3, status: 'Completed', statusColor: '#3f7d6a', momStatus: 'MOM sent', momColor: '#3f7d6a', dateLabel: '25 October' },
];

export const MOM_TASKS = [
  { task: 'Model Q4 stock cover at two scenarios', assignee: 'Ritvik Sharma', due: '7 Nov', delivery: 'Work-station' },
  { task: 'Send replacement creative for two suppressed ASINs', assignee: 'Priya Nair · client', due: '4 Nov', delivery: 'Email' },
  { task: 'Publish approved bullet copy on 6 hero ASINs', assignee: 'Ritvik Sharma', due: '3 Nov', delivery: 'Work-station' },
  { task: 'Share updated compliance checklist', assignee: 'Aditi Rao · client', due: '5 Nov', delivery: 'Email' },
];

export const MOM_DECISIONS = [
  'Anarix runs a pre-flight compliance check on all creative before it goes live.',
  'Bullet copy recommendation approved as proposed, no edits requested.',
  'Q4 stock cover to be modelled at two scenarios before the next review.',
];

export const PREP_POSITIVES = [
  'Inventory reorder recovered $6,200, verified over seven days on units sold.',
  'GMV up 6.2% with ad spend flat — growth is organic, not bought.',
  'ROAS holding above the 4.5 target for a fourth consecutive week.',
];

export const PREP_NEGATIVES = [
  'Conversion down 2.7 points on the hero range after their catalogue push.',
  'Third recurrence of the same overwrite — the fix keeps getting undone.',
  'Q4 promo calendar is a week overdue and the 8 November lock is close.',
];

export const PREP_DISCUSSION = [
  'Route catalogue pushes through an approval gate — third recurrence this week.',
  'Sign off new bullet copy on the six hero ASINs, worth about $5,300 a month.',
  'Confirm Q4 promo dates before the 8 November lock.',
];

export const PREP_ACTIONS = [
  { alert: 'Net profit down 12% on 14 ASINs', action: 'Reverted to 27 Oct copy', impact: '+$7,100', impactColor: '#464646', impactStyle: 'italic', state: 'Running', stateColor: '#a8763f' },
  { alert: 'Inventory reorder · 3 SKUs', action: 'Reorder placed Thursday', impact: '+$6,200', impactColor: '#3f7d6a', state: 'Verified', stateColor: '#3f7d6a' },
  { alert: 'Bullet copy under-performing', action: 'Awaiting client sign-off', impact: '+$5,300', impactColor: '#464646', impactStyle: 'italic', state: 'Proposed', stateColor: '#6b7178' },
];
