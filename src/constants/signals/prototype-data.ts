export type AlertPriority = 'High' | 'Medium' | 'Low';
export type AlertDay = 'today' | 'yesterday';
export type MpBrand = 'amazon' | 'walmart';
export type AlertSource = 'anarix' | 'jiva' | 'meeting' | 'email' | 'slack' | 'workspace';

export interface AssigneeOption {
  id: string;
  name: string;
  role: string;
}

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
  /** For GENERATIVE options: what kind of content gets generated — drives which studio opens (text diff vs. image chat). Defaults to 'text'. */
  generates?: 'text' | 'image';
}

/** An action a user has committed to from an alert's strategy picker — logged via the action-type picker, and either sent as an email or tracked as a task. */
export interface LoggedActionItem {
  id: string;
  alertId: string;
  alertTitle: string;
  account: string;
  actionTypeId: string;
  actionTypeLabel: string;
  note: string;
  dueDate?: string;
  assignee?: string;
  status: 'logged' | 'sent';
  createdAt: number;
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
  /** id into ACTION_TYPES — the action type recommended for this alert's reason, per the alert-reasoning spec. */
  mappedActionTypeId?: string;
  /** Where this alert originated (for the source icon). Defaults to 'anarix' (agent-detected) when omitted. Not to be confused with `source`, the provenance text shown under Business Impact. */
  originType?: AlertSource;
  /** Extra row-eligible origins beyond `originType`, for alerts raised across more than one channel — renders as an overlapping cluster, same idea as `mpBrands`. */
  originTypes?: AlertSource[];
  /** Tooltip detail for the origin icon — email sender, workspace name, meeting name, etc. */
  originDetail?: string;
  /** Tooltip detail for the "repeated" icon, e.g. "3rd day running". */
  repeatedLabel?: string;
  /** People this alert can be assigned to. Falls back to DEFAULT_ASSIGNEES when omitted. */
  assignees?: AssigneeOption[];
  /** Extra marketplaces beyond `mpBrand`, for the multi-marketplace icon layouts. */
  mpBrands?: MpBrand[];
  /** id into MEETING_LIST/COMPLETED_MEETINGS — which meeting this alert is actually linked to, when hasMeeting is true. */
  linkedMeetingId?: string;
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
    repeatedLabel: '3rd day running',
    hasMeeting: true,
    linkedMeetingId: 'm1',
    originTypes: ['email', 'slack', 'meeting'],
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
    assignees: [
      { id: 'mike', name: 'Mike Torres', role: 'Ops' },
      { id: 'priya', name: 'Priya Nair', role: 'Client' },
      { id: 'self', name: 'Myself', role: 'You' },
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
    originTypes: ['slack', 'email'],
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
    assignees: [
      { id: 'mike', name: 'Mike Torres', role: 'Ops' },
      { id: 'sarah', name: 'Sarah Kim', role: 'Marketing' },
      { id: 'priya', name: 'Priya Nair', role: 'Client' },
      { id: 'self', name: 'Myself', role: 'You' },
      { id: 'rahul', name: 'Rahul Mehta', role: 'Catalog' },
      { id: 'ananya', name: 'Ananya Iyer', role: 'Advertising' },
      { id: 'jiva', name: '✦ Jiva', role: 'AI' },
      { id: 'devesh', name: 'Devesh Rao', role: 'Ops' },
      { id: 'lena', name: 'Lena Fischer', role: 'Client' },
      { id: 'arjun', name: 'Arjun Verma', role: 'Advertising' },
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
    mpBrands: ['amazon', 'walmart'],
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Nutrabay',
    category: 'Inventory',
    repeated: false,
    hasMeeting: true,
    linkedMeetingId: 'm1',
    originType: 'slack',
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
    assignees: [
      { id: 'mike', name: 'Mike Torres', role: 'Ops' },
      { id: 'sarah', name: 'Sarah Kim', role: 'Marketing' },
      { id: 'priya', name: 'Priya Nair', role: 'Client' },
      { id: 'self', name: 'Myself', role: 'You' },
      { id: 'rahul', name: 'Rahul Mehta', role: 'Catalog' },
      { id: 'ananya', name: 'Ananya Iyer', role: 'Advertising' },
      { id: 'jiva', name: '✦ Jiva', role: 'AI' },
      { id: 'devesh', name: 'Devesh Rao', role: 'Ops' },
      { id: 'lena', name: 'Lena Fischer', role: 'Client' },
      { id: 'arjun', name: 'Arjun Verma', role: 'Advertising' },
      { id: 'neha', name: 'Neha Kapoor', role: 'Inventory' },
      { id: 'tom', name: 'Tom Bennett', role: 'Profitability' },
      { id: 'sara', name: 'Sara Ahmed', role: 'Compliance' },
      { id: 'vikram', name: 'Vikram Shah', role: 'Catalog' },
      { id: 'chloe', name: 'Chloe Martin', role: 'Client' },
      { id: 'karan', name: 'Karan Malhotra', role: 'Ops' },
      { id: 'megan', name: 'Megan Clarke', role: 'Marketing' },
      { id: 'divya', name: 'Divya Reddy', role: 'Advertising' },
      { id: 'oliver', name: 'Oliver James', role: 'Finance' },
      { id: 'ritu', name: 'Ritu Sharma', role: 'Client' },
      { id: 'sam', name: 'Sam Okafor', role: 'Inventory' },
      { id: 'ines', name: 'Ines Duarte', role: 'Reviews' },
      { id: 'yusuf', name: 'Yusuf Khan', role: 'Ops' },
      { id: 'grace', name: 'Grace Liu', role: 'Compliance' },
      { id: 'pooja', name: 'Pooja Nair', role: 'Marketing' },
      { id: 'ben', name: 'Ben Turner', role: 'Profitability' },
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
    mpBrands: ['amazon', 'walmart'],
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Wellbeing Nutrition',
    category: 'Catalog',
    repeated: false,
    hasMeeting: true,
    meetingLabel: 'In your 14:00 QBR prep',
    linkedMeetingId: 'm2',
    originType: 'email',
    originDetail: 'priya.nair@wellbeingnutrition.com',
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
    mpBrands: ['walmart', 'amazon'],
    mpColor: '#0071ce',
    mpCountry: 'US',
    account: 'Boldfit',
    category: 'Profitability',
    repeated: false,
    hasMeeting: true,
    linkedMeetingId: 'm3',
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
    items: [
      { name: 'Adjustable Dumbbell Set — Grey', sku: 'B0BLD3390', impact: '−$210', color: '#b3453f' },
      { name: 'Resistance Bands Pro Set', sku: 'B0BLD9012', impact: '−$185', color: '#b3453f' },
      { name: 'Foam Roller — High Density', sku: 'B0BLD6620', impact: '−$140', color: '#b3453f' },
      { name: 'Ankle Weights 2lb Pair', sku: 'B0BLD8843', impact: '−$96', color: '#b3453f' },
    ],
    options: [
      { id: 'o1', kind: 'INSTRUCTIVE', label: 'Revert all 600 ASINs to their pre-incident price', desc: 'Restores MAP-compliant pricing storefront-wide within the hour.', expected: '+$42,600', confidence: 93, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  // --- Card edge cases: small vs large value crossed with short vs long title ---
  {
    id: 'a6',
    day: 'today',
    time: '08:15 AM',
    valueNum: -88,
    valueLabel: '−$88',
    priority: 'Low',
    priorityDot: '#3f7d6a',
    title: 'Buy Box lost briefly',
    impactStr: 'Minor revenue impact',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Boldfit',
    category: 'Advertising',
    repeated: false,
    hasMeeting: false,
    originType: 'slack',
    originDetail: '#boldfit-ppc channel',
    windowLabel: 'No action needed',
    subheader: 'A single ASIN lost the Buy Box for 40 minutes overnight, then recovered on its own.',
    why: 'A competing offer briefly undercut price by 2%, then reverted.',
    root: 'No repricer rule breach — a one-off competitor pricing blip.',
    oppWindow: 'Closed',
    revLabel: 'Revenue at risk',
    revValue: '$88',
    confidence: 62,
    source: 'Profitability Agent, buy-box monitor',
    proof: 'estimated',
    aiSummary: 'Small, self-resolved dip — flagged for visibility only, no action expected.',
    itemsCount: 1,
    itemsBreakdown: '1 ASIN',
    itemsBadge: '1 ASIN',
    items: [
      { name: 'Shaker Bottle 700ml', sku: 'B03KK9911', impact: '−$88', color: '#b3453f' },
    ],
    options: [
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Log a follow-up action on this alert.', isOther: true },
    ],
  },
  {
    id: 'a7',
    day: 'today',
    time: '04:47 AM',
    valueNum: -46,
    valueLabel: '−$46',
    priority: 'Low',
    priorityDot: '#3f7d6a',
    title: 'A returned-shipment reconciliation mismatch between the 3PL manifest and Amazon’s received-quantity report is understating inbound units on one SKU',
    impactStr: 'Minor discrepancy',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Wellbeing Nutrition',
    category: 'Inventory',
    repeated: false,
    hasMeeting: false,
    originType: 'workspace',
    originDetail: 'Wellbeing Nutrition pod',
    windowLabel: 'Act within 7 days',
    subheader: 'A 3-unit gap between the 3PL manifest and Amazon’s received count was found on one SKU.',
    why: 'The 3PL’s manifest recorded 3 more units shipped than Amazon logged as received.',
    root: 'No automated manifest-vs-received reconciliation exists between the 3PL and Amazon FC data.',
    oppWindow: '30 days',
    revLabel: 'Revenue at risk',
    revValue: '$46',
    confidence: 58,
    source: 'Inventory Agent, receiving log',
    proof: 'estimated',
    aiSummary: 'Small dollar impact today, but the same reconciliation gap could compound on higher-volume SKUs — worth a one-off check rather than urgent action.',
    itemsCount: 1,
    itemsBreakdown: '1 SKU',
    itemsBadge: '1 SKU',
    items: [
      { name: 'Multivitamin Gummies 60ct', sku: 'B04RT2280', impact: '−$46', color: '#b3453f' },
    ],
    options: [
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Log a follow-up action on this alert.', isOther: true },
    ],
  },
  {
    id: 'a8',
    day: 'yesterday',
    time: '31 Oct · 06:30',
    valueNum: -128400,
    valueLabel: '−$128.4K',
    priority: 'High',
    priorityDot: '#b3453f',
    title: 'Ad spend spike',
    impactStr: 'Net profit at risk',
    mpBrand: 'walmart',
    mpColor: '#0071ce',
    mpCountry: 'US',
    account: 'Nutrabay',
    category: 'Advertising',
    repeated: false,
    hasMeeting: true,
    linkedMeetingId: 'm1',
    meetingLabel: 'In your 10:30',
    windowLabel: 'Act within 4 hrs',
    subheader: 'A bid-automation rule removed its own spend cap overnight, tripling spend across 24 campaigns with no matching sales lift.',
    why: 'An automation rule update on 30 Oct dropped the daily budget cap field, letting bids scale unchecked overnight.',
    root: 'The automation rules editor allows saving a rule with an empty cap field instead of rejecting it.',
    oppWindow: '3 days',
    revLabel: 'Revenue at risk',
    revValue: '$128,400',
    confidence: 88,
    source: 'Advertising Agent, spend monitor',
    proof: 'estimated',
    aiSummary: 'Overnight spend tripled with no matching sales — pausing the affected campaigns now stops further loss, though the overnight spend itself is not recoverable.',
    itemsCount: 24,
    itemsBreakdown: '24 campaigns',
    itemsBadge: '24 campaigns',
    items: [
      { name: 'Auto · Whey Protein Range', sku: 'CMP-2201', impact: '−$61,200', color: '#b3453f' },
      { name: 'Auto · Recovery Range', sku: 'CMP-2214', impact: '−$40,900', color: '#b3453f' },
      { name: 'Manual · Branded Defense', sku: 'CMP-2233', impact: '−$26,300', color: '#b3453f' },
    ],
    options: [
      { id: 'o1', kind: 'INSTRUCTIVE', label: 'Pause all 24 campaigns and restore the previous spend cap', desc: 'Stops further overspend immediately, reversible once the rule is fixed.', expected: '+$128,400', confidence: 88, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  {
    id: 'a9',
    day: 'today',
    time: '09:03 AM',
    valueNum: 71,
    valueLabel: '+$71',
    priority: 'Low',
    priorityDot: '#3f7d6a',
    title: 'A negative keyword harvested last week from search-term reports has quietly cut wasted spend on one always-on evergreen campaign',
    impactStr: 'Small verified gain',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Nutrabay',
    category: 'Advertising',
    repeated: false,
    hasMeeting: false,
    originType: 'jiva',
    originDetail: 'Flagged during a routine keyword review',
    windowLabel: 'No action needed',
    subheader: 'One added negative keyword trimmed wasted spend on a single evergreen campaign — small but verified.',
    why: 'A low-intent search term was added as a negative keyword after last week’s harvest.',
    root: 'Routine keyword hygiene — no underlying issue.',
    oppWindow: 'Closed',
    revLabel: 'Recovered',
    revValue: '$71',
    confidence: 96,
    source: 'Advertising Agent, search terms',
    proof: 'verified',
    aiSummary: 'A small, verified win from routine negative-keyword hygiene — nothing further to do.',
    itemsCount: 1,
    itemsBreakdown: '1 campaign',
    itemsBadge: '1 campaign',
    items: [
      { name: 'Evergreen · Core Range', sku: 'CMP-1187', impact: '+$71', color: '#3f7d6a' },
    ],
    options: [
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Log a follow-up action on this alert.', isOther: true },
    ],
  },
  // --- Alert-reasoning spec: Advertising Eligibility / Product Policy ---
  {
    id: 'a10',
    day: 'today',
    time: '07:40 AM',
    valueNum: -3200,
    valueLabel: '−$3,200',
    priority: 'High',
    priorityDot: '#b3453f',
    title: 'Ad ineligible: flagged as an appetite suppressant / fat burner',
    impactStr: 'Advertising blocked',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Nutrabay',
    category: 'Compliance',
    repeated: false,
    hasMeeting: false,
    windowLabel: 'Act within 2 days',
    subheader: "Amazon flagged this ASIN under the appetite-suppressant/fat-burner ad policy, pausing all advertising on it.",
    why: "The listing's category and content matched Amazon's appetite-suppressant/fat-burner detection, which blocks advertising by default.",
    root: 'No pre-check exists before catalog changes that could trip this policy classifier.',
    oppWindow: '30 days',
    revLabel: 'Ad revenue at risk',
    revValue: '$3,200',
    confidence: 74,
    source: 'Compliance Agent, ad eligibility feed',
    proof: 'estimated',
    aiSummary: "This looks like a mis-classification — the product isn't actually an appetite suppressant. Confirming that and filing a Seller Support case with the brand's certification is the fastest path back to eligibility; if it does qualify, the case needs the certification attached instead.",
    itemsCount: 1,
    itemsBreakdown: '1 ASIN',
    itemsBadge: '1 ASIN',
    items: [
      { name: 'Thermo Burn Capsules 60ct', sku: 'B0NUT8821', impact: '−$3,200', color: '#b3453f' },
    ],
    mappedActionTypeId: 'resolve-policy-violation',
    options: [
      { id: 'o1', kind: 'PROCESS', label: 'Draft an Amazon Seller Support case with certification attached', desc: 'Matches recommended action: Resolve product policy/compliance violation. Confirms the classification and requests reinstatement.', expected: '+$3,200', confidence: 74, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action — tracked and measured the same way.', isOther: true },
    ],
  },
  {
    id: 'a11',
    day: 'today',
    time: '07:52 AM',
    valueNum: -2100,
    valueLabel: '−$2,100',
    priority: 'Medium',
    priorityDot: '#5c7f9e',
    title: "Ad ineligible: non-compliant with weight loss and weight management policy",
    impactStr: 'Advertising blocked',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Wellbeing Nutrition',
    category: 'Compliance',
    repeated: false,
    hasMeeting: false,
    windowLabel: 'Act within 3 days',
    subheader: 'Listing copy references weight-management outcomes that trip the weight-loss ad policy.',
    why: "The bullet points make results-oriented weight claims that Amazon's weight-management policy disallows in advertising.",
    root: 'Listing copy was written before the current weight-management ad policy was enforced.',
    oppWindow: '30 days',
    revLabel: 'Ad revenue at risk',
    revValue: '$2,100',
    confidence: 81,
    source: 'Compliance Agent, ad eligibility feed',
    proof: 'estimated',
    aiSummary: 'The unsupported weight-loss claims in the copy are the trigger. Rewriting them removes the policy conflict without touching anything else on the listing.',
    itemsCount: 1,
    itemsBreakdown: '1 ASIN',
    itemsBadge: '1 ASIN',
    items: [
      { name: 'Green Coffee Extract 90ct', sku: 'B0WEL4471', impact: '−$2,100', color: '#b3453f' },
    ],
    mappedActionTypeId: 'resolve-policy-violation',
    options: [
      { id: 'o1', kind: 'INSTRUCTIVE', label: 'Remove the unsupported weight-loss claims from the copy', desc: 'Matches recommended action: Resolve product policy/compliance violation.', expected: '+$2,100', confidence: 81, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  {
    id: 'a12',
    day: 'yesterday',
    time: '31 Oct · 11:05',
    valueNum: -4800,
    valueLabel: '−$4,800',
    priority: 'Medium',
    priorityDot: '#5c7f9e',
    title: "Ad ineligible: cost doesn't meet customer pricing expectations",
    impactStr: 'Advertising blocked',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Boldfit',
    category: 'Compliance',
    repeated: false,
    hasMeeting: false,
    windowLabel: 'Act within 7 days',
    subheader: 'A lower price on another monitored marketplace triggered an Amazon price match, cutting margin below the ad-eligibility threshold.',
    why: 'Amazon detected a lower price on an external marketplace it monitors and price-matched it, reducing profitability on this ASIN below the advertising threshold.',
    root: 'No alerting exists when an external-marketplace price drop is about to trigger an Amazon price match.',
    oppWindow: '14 days',
    revLabel: 'Ad revenue at risk',
    revValue: '$4,800',
    confidence: 68,
    source: 'Compliance Agent, pricing feed',
    proof: 'estimated',
    aiSummary: "Correcting the external price should let Amazon restore the original price and eligibility on its own. If it hasn't restored after that, this needs Vendor Manager escalation (1P) or an Ads Support case (3P).",
    itemsCount: 1,
    itemsBreakdown: '1 ASIN',
    itemsBadge: '1 ASIN',
    items: [
      { name: 'Resistance Bands Pro Set', sku: 'B0BLD9012', impact: '−$4,800', color: '#b3453f' },
    ],
    mappedActionTypeId: 'adjust-pricing-discount',
    options: [
      { id: 'o1', kind: 'INSTRUCTIVE', label: 'Correct the external marketplace price first, then re-check eligibility', desc: 'Matches recommended action: Adjust pricing/discount strategy.', expected: '+$4,800', confidence: 68, recommended: true },
      { id: 'o2', kind: 'PROCESS', label: 'Escalate to Amazon Vendor Manager', desc: 'If the external price is already fixed and eligibility hasn’t restored.', isMeetingAsk: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  {
    id: 'a13',
    day: 'today',
    time: '06:15 AM',
    valueNum: -1400,
    valueLabel: '−$1,400',
    priority: 'Low',
    priorityDot: '#3f7d6a',
    title: 'Ad ineligible: product missing title and image',
    impactStr: 'Advertising blocked',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Boldfit',
    category: 'Compliance',
    repeated: false,
    hasMeeting: false,
    windowLabel: 'Act within 1 day',
    subheader: 'A newly created variation is missing both a title and a main image, so it cannot be advertised.',
    why: 'A new child ASIN was created during a catalog sync without title or image data carried over.',
    root: 'The bulk variation-creation template does not require title/image before publish.',
    oppWindow: '30 days',
    revLabel: 'Ad revenue at risk',
    revValue: '$1,400',
    confidence: 90,
    source: 'Compliance Agent, ad eligibility feed',
    proof: 'estimated',
    aiSummary: 'Straightforward fix — add the missing title and image and the ASIN becomes ad-eligible again.',
    itemsCount: 1,
    itemsBreakdown: '1 ASIN',
    itemsBadge: '1 ASIN',
    items: [
      { name: 'Adjustable Dumbbell Set — Grey', sku: 'B0BLD3390', impact: '−$1,400', color: '#b3453f' },
    ],
    mappedActionTypeId: 'fix-listing-data',
    options: [
      { id: 'o1', kind: 'INSTRUCTIVE', label: 'Add the missing title and main image', desc: 'Matches recommended action: Fix listing data/attributes (backend fields).', expected: '+$1,400', confidence: 90, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  // --- Search Suppressed ---
  {
    id: 'a14',
    day: 'today',
    time: '05:48 AM',
    valueNum: -2600,
    valueLabel: '−$2,600',
    priority: 'Medium',
    priorityDot: '#5c7f9e',
    title: 'Search suppressed: missing product description',
    impactStr: 'Delisted from search',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Nutrabay',
    category: 'Catalog',
    repeated: false,
    hasMeeting: false,
    windowLabel: 'Act within 1 day',
    subheader: 'This ASIN has no description, so Amazon has suppressed it from search results entirely.',
    why: 'The description field was left blank during the last bulk catalog upload.',
    root: 'The upload template does not flag blank required fields before submission.',
    oppWindow: '30 days',
    revLabel: 'Revenue at risk',
    revValue: '$2,600',
    confidence: 92,
    source: 'Catalog Agent, search suppression feed',
    proof: 'estimated',
    aiSummary: 'Drafting a description from the brand story, product type, primary purpose and USPs and publishing it should reactivate search visibility within the hour.',
    itemsCount: 1,
    itemsBreakdown: '1 ASIN',
    itemsBadge: '1 ASIN',
    items: [
      { name: 'Omega-3 Fish Oil 90 Softgels', sku: 'B0NUT2210', impact: '−$2,600', color: '#b3453f' },
    ],
    mappedActionTypeId: 'update-listing-copy',
    options: [
      { id: 'o1', kind: 'GENERATIVE', label: 'Generate a description from brand story + product type + USPs and publish', desc: 'Matches recommended action: Update listing copy (title/bullets/description).', expected: '+$2,600', confidence: 92, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  {
    id: 'a15',
    day: 'today',
    time: '06:22 AM',
    valueNum: -3400,
    valueLabel: '−$3,400',
    priority: 'High',
    priorityDot: '#b3453f',
    title: 'Search suppressed: missing main image',
    impactStr: 'Delisted from search',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Wellbeing Nutrition',
    category: 'Catalog',
    repeated: true,
    repeatedLabel: '2nd time this month',
    hasMeeting: false,
    windowLabel: 'Act within 1 day',
    subheader: 'The main image did not carry over on re-list, suppressing the ASIN from search for the second time this month.',
    why: 'A listing refresh dropped the main image reference without replacing it.',
    root: 'No validation step confirms a main image is attached before a re-list goes live.',
    oppWindow: '30 days',
    revLabel: 'Revenue at risk',
    revValue: '$3,400',
    confidence: 94,
    source: 'Catalog Agent, search suppression feed',
    proof: 'estimated',
    aiSummary: 'A pure-white-background main image needs to go up before this reactivates. It has happened before — worth adding a pre-publish check.',
    itemsCount: 1,
    itemsBreakdown: '1 ASIN',
    itemsBadge: '1 ASIN',
    items: [
      { name: 'Plant Protein Vanilla 1kg', sku: 'B0WEL3391', impact: '−$3,400', color: '#b3453f' },
    ],
    mappedActionTypeId: 'update-product-images',
    options: [
      { id: 'o1', kind: 'GENERATIVE', label: 'Generate a pure-white-background main image and upload', desc: 'Matches recommended action: Update product images.', expected: '+$3,400', confidence: 94, recommended: true, generates: 'image' },
      { id: 'o2', kind: 'PROCESS', label: 'Ask the client to upload approved product images', desc: 'If no usable image asset exists yet.', isMeetingAsk: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  {
    id: 'a16',
    day: 'today',
    time: '08:30 AM',
    valueNum: -900,
    valueLabel: '−$900',
    priority: 'Low',
    priorityDot: '#3f7d6a',
    title: 'Search suppressed: item name exceeds character limit',
    impactStr: 'Delisted from search',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Boldfit',
    category: 'Catalog',
    repeated: false,
    hasMeeting: false,
    windowLabel: 'Act within 2 days',
    subheader: 'The listing title exceeds the 125-character limit, so the item is currently suppressed from search.',
    why: 'A keyword-stuffed title update pushed the character count past the limit.',
    root: 'Title edits are not checked against the character limit before publishing.',
    oppWindow: '30 days',
    revLabel: 'Revenue at risk',
    revValue: '$900',
    confidence: 96,
    source: 'Catalog Agent, search suppression feed',
    proof: 'estimated',
    aiSummary: 'Trimming the title to 125 characters while keeping brand, product type and key attributes should reactivate it.',
    itemsCount: 1,
    itemsBreakdown: '1 ASIN',
    itemsBadge: '1 ASIN',
    items: [
      { name: 'Yoga Mat Extra Thick Non-Slip', sku: 'B0BLD1145', impact: '−$900', color: '#b3453f' },
    ],
    mappedActionTypeId: 'update-listing-copy',
    options: [
      { id: 'o1', kind: 'GENERATIVE', label: 'Generate a compliant title within 125 characters', desc: 'Matches recommended action: Update listing copy (title/bullets/description).', expected: '+$900', confidence: 96, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  {
    id: 'a17',
    day: 'yesterday',
    time: '31 Oct · 14:20',
    valueNum: -1100,
    valueLabel: '−$1,100',
    priority: 'Low',
    priorityDot: '#3f7d6a',
    title: 'Search suppressed: potential duplicate ASIN',
    impactStr: 'Delisted from search',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Nutrabay',
    category: 'Catalog',
    repeated: false,
    hasMeeting: false,
    windowLabel: 'Act within 5 days',
    subheader: 'Amazon flagged this ASIN as a possible duplicate of another listing in the catalog.',
    why: 'Two ASINs share overlapping title and image content from a prior catalog migration.',
    root: 'The migration script did not de-duplicate by UPC/GTIN before creating new listings.',
    oppWindow: '30 days',
    revLabel: 'Revenue at risk',
    revValue: '$1,100',
    confidence: 71,
    source: 'Catalog Agent, search suppression feed',
    proof: 'estimated',
    aiSummary: "Confirming whether these are the same product (matching UPC/GTIN) decides the fix — merge/delete the duplicate, or file a case confirming they're distinct.",
    itemsCount: 2,
    itemsBreakdown: '2 ASINs',
    itemsBadge: '2 ASINs',
    items: [
      { name: 'Whey Protein Isolate 2kg · Chocolate', sku: 'B0NUT7781', impact: '−$1,100', color: '#b3453f' },
      { name: 'Whey Protein Isolate 2kg · Choc (dup?)', sku: 'B0NUT7782', impact: '$0', color: '#8a919b' },
    ],
    mappedActionTypeId: 'fix-listing-data',
    options: [
      { id: 'o1', kind: 'INSTRUCTIVE', label: 'Confirm UPC/GTIN match, then merge or delete the duplicate', desc: 'Matches recommended action: Fix listing data/attributes (backend fields).', expected: '+$1,100', confidence: 71, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  // --- Listing Suppressed ---
  {
    id: 'a18',
    day: 'today',
    time: '09:10 AM',
    valueNum: -2000,
    valueLabel: '−$2,000',
    priority: 'Medium',
    priorityDot: '#5c7f9e',
    title: 'Listing suppressed: main image low resolution / not zoom-eligible',
    impactStr: 'Listing suppressed',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Wellbeing Nutrition',
    category: 'Catalog',
    repeated: false,
    hasMeeting: false,
    windowLabel: 'Act within 2 days',
    subheader: "The main image falls below Amazon's zoom-eligibility resolution requirement.",
    why: 'The original product photo was compressed below the minimum pixel dimensions during upload.',
    root: 'No image-quality check runs before publish.',
    oppWindow: '30 days',
    revLabel: 'Revenue at risk',
    revValue: '$2,000',
    confidence: 89,
    source: 'Catalog Agent, listing suppression feed',
    proof: 'estimated',
    aiSummary: 'Re-uploading the source image at full resolution should clear zoom eligibility and lift the suppression.',
    itemsCount: 1,
    itemsBreakdown: '1 ASIN',
    itemsBadge: '1 ASIN',
    items: [
      { name: 'Collagen Peptides 500g', sku: 'B0WEL5512', impact: '−$2,000', color: '#b3453f' },
    ],
    mappedActionTypeId: 'update-product-images',
    options: [
      { id: 'o1', kind: 'INSTRUCTIVE', label: 'Re-upload the main image at full resolution', desc: 'Matches recommended action: Update product images.', expected: '+$2,000', confidence: 89, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  {
    id: 'a19',
    day: 'yesterday',
    time: '31 Oct · 10:05',
    valueNum: -2900,
    valueLabel: '−$2,900',
    priority: 'Medium',
    priorityDot: '#5c7f9e',
    title: "Listing suppressed: product image doesn't match the actual product",
    impactStr: 'Listing suppressed',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Boldfit',
    category: 'Catalog',
    repeated: false,
    hasMeeting: false,
    windowLabel: 'Act within 3 days',
    subheader: 'A packaging redesign shipped to customers before the listing image was updated to match.',
    why: 'The product packaging changed last month but the main image still shows the old design.',
    root: 'No process links a packaging change to a mandatory listing-image update.',
    oppWindow: '30 days',
    revLabel: 'Revenue at risk',
    revValue: '$2,900',
    confidence: 85,
    source: 'Catalog Agent, listing suppression feed',
    proof: 'estimated',
    aiSummary: 'Replacing the image with the current packaging resolves this — worth adding a checklist item for future packaging changes.',
    itemsCount: 1,
    itemsBreakdown: '1 ASIN',
    itemsBadge: '1 ASIN',
    items: [
      { name: 'Foam Roller — High Density', sku: 'B0BLD6620', impact: '−$2,900', color: '#b3453f' },
    ],
    mappedActionTypeId: 'update-product-images',
    options: [
      { id: 'o1', kind: 'INSTRUCTIVE', label: 'Replace the image with the current packaging design', desc: 'Matches recommended action: Update product images.', expected: '+$2,900', confidence: 85, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  // --- Product Policy Violation (Account Health) ---
  {
    id: 'a20',
    day: 'today',
    time: '07:05 AM',
    valueNum: -8600,
    valueLabel: '−$8,600',
    priority: 'High',
    priorityDot: '#b3453f',
    title: 'Account Health: product flagged as restricted or prohibited for sale',
    impactStr: 'Listing at risk of removal',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Nutrabay',
    category: 'Compliance',
    repeated: false,
    hasMeeting: true,
    linkedMeetingId: 'm1',
    meetingLabel: 'In your 10:30',
    windowLabel: 'Act within 24 hrs',
    subheader: 'Account Health flagged this ASIN under a restricted-products policy — the listing risks removal if unresolved.',
    why: 'The product category overlaps with a recently tightened restricted-products policy.',
    root: 'No policy-change monitoring exists to catch newly restricted categories proactively.',
    oppWindow: '7 days',
    revLabel: 'Revenue at risk',
    revValue: '$8,600',
    confidence: 79,
    source: 'Compliance Agent, Account Health',
    proof: 'estimated',
    aiSummary: 'This needs a policy read first — if genuinely restricted, the listing should come down; if conditionally permitted, the required approval/compliance information needs to be submitted this week.',
    itemsCount: 1,
    itemsBreakdown: '1 ASIN',
    itemsBadge: '1 ASIN',
    items: [
      { name: 'Sports Nutrition Sample Pack', sku: 'B0NUT9902', impact: '−$8,600', color: '#b3453f' },
    ],
    mappedActionTypeId: 'resolve-policy-violation',
    options: [
      { id: 'o1', kind: 'PROCESS', label: 'Review the restricted-products policy and submit required approvals', desc: 'Matches recommended action: Resolve product policy/compliance violation.', expected: '+$8,600', confidence: 79, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  {
    id: 'a21',
    day: 'today',
    time: '08:02 AM',
    valueNum: -1900,
    valueLabel: '−$1,900',
    priority: 'Medium',
    priorityDot: '#5c7f9e',
    title: 'Account Health: misleading or unsubstantiated product claims',
    impactStr: 'Listing at risk of removal',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Wellbeing Nutrition',
    category: 'Compliance',
    repeated: false,
    hasMeeting: false,
    windowLabel: 'Act within 3 days',
    subheader: 'Bullet points include "guaranteed results" and "clinically proven" language without supporting evidence.',
    why: "Copy from an older campaign used absolute claims that weren't re-reviewed against current policy.",
    root: 'No claims-review gate exists before marketing copy is published to the live listing.',
    oppWindow: '14 days',
    revLabel: 'Revenue at risk',
    revValue: '$1,900',
    confidence: 87,
    source: 'Compliance Agent, Account Health',
    proof: 'estimated',
    aiSummary: 'Removing the absolute claims and keeping only supportable statements clears this without touching the rest of the listing.',
    itemsCount: 1,
    itemsBreakdown: '1 ASIN',
    itemsBadge: '1 ASIN',
    items: [
      { name: 'Multivitamin Gummies 90ct', sku: 'B0WEL2245', impact: '−$1,900', color: '#b3453f' },
    ],
    mappedActionTypeId: 'resolve-policy-violation',
    options: [
      { id: 'o1', kind: 'INSTRUCTIVE', label: 'Remove the unsupported claims from the bullet points', desc: 'Matches recommended action: Resolve product policy/compliance violation.', expected: '+$1,900', confidence: 87, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  {
    id: 'a22',
    day: 'yesterday',
    time: '31 Oct · 16:40',
    valueNum: -3700,
    valueLabel: '−$3,700',
    priority: 'High',
    priorityDot: '#b3453f',
    title: 'Account Health: missing or expired compliance documents',
    impactStr: 'Listing at risk of removal',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Boldfit',
    category: 'Compliance',
    repeated: false,
    hasMeeting: true,
    linkedMeetingId: 'm3',
    meetingLabel: 'In your 10:30',
    windowLabel: 'Act within 5 days',
    subheader: 'The certificate on file for this ASIN expired last month and has not been renewed.',
    why: 'The compliance document has a fixed validity period that lapsed without a renewal reminder.',
    root: 'No expiry tracking exists for compliance documents once uploaded.',
    oppWindow: '10 days',
    revLabel: 'Revenue at risk',
    revValue: '$3,700',
    confidence: 90,
    source: 'Compliance Agent, Account Health',
    proof: 'estimated',
    aiSummary: 'Submitting a current, authentic, product-specific test report through the Account Health compliance request should clear this quickly.',
    itemsCount: 1,
    itemsBreakdown: '1 ASIN',
    itemsBadge: '1 ASIN',
    items: [
      { name: 'Compression Knee Sleeve — Pair', sku: 'B0BLD7734', impact: '−$3,700', color: '#b3453f' },
    ],
    mappedActionTypeId: 'resolve-policy-violation',
    options: [
      { id: 'o1', kind: 'PROCESS', label: 'Submit an updated compliance document via Account Health', desc: 'Matches recommended action: Resolve product policy/compliance violation.', expected: '+$3,700', confidence: 90, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  // --- Operational / performance alerts ---
  {
    id: 'a23',
    day: 'today',
    time: '06:55 AM',
    valueNum: -5100,
    valueLabel: '−$5,100',
    priority: 'High',
    priorityDot: '#b3453f',
    title: 'Inventory available but offer not active',
    impactStr: 'Not sellable despite stock',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Nutrabay',
    category: 'Operations',
    repeated: false,
    hasMeeting: false,
    windowLabel: 'Act within 1 day',
    subheader: 'This ASIN has healthy stock on hand but the offer itself is inactive, so nothing can sell.',
    why: 'A pricing update briefly zeroed the price, which Amazon deactivated the offer for automatically.',
    root: 'No validation blocks a price update from saving as $0.',
    oppWindow: '7 days',
    revLabel: 'Revenue at risk',
    revValue: '$5,100',
    confidence: 93,
    source: 'Operations Agent, listing status feed',
    proof: 'estimated',
    aiSummary: 'Correcting the price and re-activating the offer should restore sellability immediately.',
    itemsCount: 1,
    itemsBreakdown: '1 ASIN',
    itemsBadge: '1 ASIN',
    items: [
      { name: 'Electrolyte Powder Mix 30ct', sku: 'B0NUT4432', impact: '−$5,100', color: '#b3453f' },
    ],
    mappedActionTypeId: 'reactivate-inactive-listing',
    options: [
      { id: 'o1', kind: 'INSTRUCTIVE', label: 'Correct the price and reactivate the offer', desc: 'Matches recommended action: Reactivate inactive listing.', expected: '+$5,100', confidence: 93, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  {
    id: 'a24',
    day: 'yesterday',
    time: '31 Oct · 08:15',
    valueNum: -2400,
    valueLabel: '−$2,400',
    priority: 'Medium',
    priorityDot: '#5c7f9e',
    title: 'Performance dropped after a bullet-point change',
    impactStr: 'CVR down since edit',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Wellbeing Nutrition',
    category: 'Catalog',
    repeated: false,
    hasMeeting: false,
    windowLabel: 'Act within 5 days',
    subheader: 'Conversion rate fell noticeably in the week following a bullet-point edit on this ASIN.',
    why: 'CTR held steady but CVR dropped after the bullet points were rewritten 8 days ago.',
    root: 'No before/after performance check ran when the copy change shipped.',
    oppWindow: '14 days',
    revLabel: 'Revenue at risk',
    revValue: '$2,400',
    confidence: 66,
    source: 'Catalog Agent, content change log',
    proof: 'estimated',
    aiSummary: 'Comparing 7-day CTR/CVR/sessions before and after the edit will confirm whether the new copy is the cause; reverting is the fastest recovery if so.',
    itemsCount: 1,
    itemsBreakdown: '1 ASIN',
    itemsBadge: '1 ASIN',
    items: [
      { name: 'Plant Protein Chocolate 1kg', sku: 'B0WEL3392', impact: '−$2,400', color: '#b3453f' },
    ],
    mappedActionTypeId: 'investigate-sales-decline',
    options: [
      { id: 'o1', kind: 'INSTRUCTIVE', label: 'Compare 7-day CTR/CVR before and after the edit, then revert if confirmed', desc: 'Matches recommended action: Investigate sales/performance decline root cause.', expected: '+$2,400', confidence: 66, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  {
    id: 'a25',
    day: 'today',
    time: '05:35 AM',
    valueNum: -1600,
    valueLabel: '−$1,600',
    priority: 'Low',
    priorityDot: '#3f7d6a',
    title: 'Price moved 5%+ versus the 30-day average',
    impactStr: 'Pricing drift flagged',
    mpBrand: 'walmart',
    mpColor: '#0071ce',
    mpCountry: 'US',
    account: 'Boldfit',
    category: 'Profitability',
    repeated: false,
    hasMeeting: false,
    windowLabel: 'Act within 3 days',
    subheader: "This ASIN's price moved more than 5% away from its 30-day average base price.",
    why: 'An automated repricer rule nudged the price up in response to a competitor stock-out.',
    root: 'The repricer has no ceiling relative to the 30-day average price.',
    oppWindow: '14 days',
    revLabel: 'Revenue at risk',
    revValue: '$1,600',
    confidence: 60,
    source: 'Profitability Agent, pricing feed',
    proof: 'estimated',
    aiSummary: 'Since the price increased, checking whether last-30-day sales dropped as a result will confirm whether to roll it back.',
    itemsCount: 1,
    itemsBreakdown: '1 ASIN',
    itemsBadge: '1 ASIN',
    items: [
      { name: 'Ankle Weights 2lb Pair', sku: 'B0BLD8843', impact: '−$1,600', color: '#b3453f' },
    ],
    mappedActionTypeId: 'fix-pricing-error',
    options: [
      { id: 'o1', kind: 'INSTRUCTIVE', label: 'Check 30-day sales impact and correct the repricer cap if it dropped', desc: 'Matches recommended action: Fix pricing error/margin correction.', expected: '+$1,600', confidence: 60, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  {
    id: 'a26',
    day: 'today',
    time: '06:48 AM',
    valueNum: -3900,
    valueLabel: '−$3,900',
    priority: 'Medium',
    priorityDot: '#5c7f9e',
    title: 'Buy Box lost on a top-selling ASIN',
    impactStr: 'Sales opportunity lost',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Nutrabay',
    category: 'Profitability',
    repeated: false,
    hasMeeting: true,
    linkedMeetingId: 'm1',
    meetingLabel: 'In your 10:30',
    windowLabel: 'Act within 2 days',
    subheader: 'A competing offer took the Buy Box overnight, putting the next 7 days of sales on this ASIN at risk.',
    why: 'A competitor undercut price by 3% and matched fulfillment speed, winning the Buy Box.',
    root: 'No automated Buy Box monitoring exists on this ASIN to trigger a fast reprice.',
    oppWindow: '7 days',
    revLabel: 'Revenue at risk',
    revValue: '$3,900',
    confidence: 82,
    source: 'Profitability Agent, Buy Box monitor',
    proof: 'estimated',
    aiSummary: 'Investigating price, availability and seller-rating gaps against the winning offer will show the fastest way back to the Buy Box.',
    itemsCount: 1,
    itemsBreakdown: '1 ASIN',
    itemsBadge: '1 ASIN',
    items: [
      { name: 'Whey Protein Isolate 1kg · Strawberry', sku: 'B0NUT5563', impact: '−$3,900', color: '#b3453f' },
    ],
    mappedActionTypeId: 'investigate-buy-box-suppression',
    options: [
      { id: 'o1', kind: 'INSTRUCTIVE', label: 'Investigate the Buy Box loss reason and correct it', desc: 'Matches recommended action: Investigate/resolve Buy Box/suppression issue.', expected: '+$3,900', confidence: 82, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  {
    id: 'a27',
    day: 'yesterday',
    time: '31 Oct · 13:10',
    valueNum: -700,
    valueLabel: '−$700',
    priority: 'Low',
    priorityDot: '#3f7d6a',
    title: 'Negative rating spike on a hero ASIN',
    impactStr: 'Rating trending down',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Wellbeing Nutrition',
    category: 'Reviews',
    repeated: false,
    hasMeeting: false,
    originType: 'meeting',
    originDetail: 'Wellbeing Nutrition · QBR prep',
    windowLabel: 'Act within 5 days',
    subheader: 'Three new 1-2 star reviews landed this week, pulling the average rating down.',
    why: 'Reviews cite a packaging change that made the scoop harder to find inside the tub.',
    root: 'The packaging redesign was not tested with customers before rollout.',
    oppWindow: '30 days',
    revLabel: 'Revenue at risk',
    revValue: '$700',
    confidence: 64,
    source: 'Reviews Agent, review monitor',
    proof: 'estimated',
    aiSummary: 'The reviews point to one specific, fixable packaging complaint — responding to the reviews and flagging the packaging issue should stop it from compounding.',
    itemsCount: 3,
    itemsBreakdown: '3 reviews',
    itemsBadge: '3 reviews',
    items: [
      { name: 'Plant Protein Vanilla 1kg', sku: 'B0WEL3391', impact: '−$700', color: '#b3453f' },
    ],
    mappedActionTypeId: 'respond-negative-review',
    options: [
      { id: 'o1', kind: 'INSTRUCTIVE', label: 'Respond to the new reviews and flag the packaging issue internally', desc: 'Matches recommended action: Respond to negative review/rating.', expected: '+$700', confidence: 64, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  {
    id: 'a28',
    day: 'today',
    time: '04:10 AM',
    valueNum: -12000,
    valueLabel: '−$12,000',
    priority: 'High',
    priorityDot: '#b3453f',
    title: 'Credit card on file declined',
    impactStr: 'Advertising and orders at risk',
    mpBrand: 'walmart',
    mpColor: '#0071ce',
    mpCountry: 'US',
    account: 'Boldfit',
    category: 'Billing',
    repeated: false,
    hasMeeting: true,
    linkedMeetingId: 'm3',
    meetingLabel: 'In your 10:30',
    windowLabel: 'Act within 4 hrs',
    subheader: 'The payment method on file failed overnight — advertising will pause and order processing is at risk until it is fixed.',
    why: 'The card on file expired without an updated card being added beforehand.',
    root: 'No expiry-date monitoring exists on the stored payment method.',
    oppWindow: '2 days',
    revLabel: 'Revenue at risk',
    revValue: '$12,000',
    confidence: 97,
    source: 'Billing Agent, payment status feed',
    proof: 'estimated',
    aiSummary: 'This blocks advertising and can block orders the longer it sits — updating the payment method today is the priority action, ahead of anything else on the account.',
    itemsCount: 0,
    itemsBreakdown: '',
    itemsBadge: 'Account-wide',
    items: [],
    mappedActionTypeId: 'resolve-billing-issue',
    options: [
      { id: 'o1', kind: 'PROCESS', label: 'Ask the client to update the payment method today', desc: 'Matches recommended action: Resolve billing/payment method issue.', isMeetingAsk: true, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  // --- Inventory Issue ---
  {
    id: 'a29',
    day: 'today',
    time: '05:00 AM',
    valueNum: -4400,
    valueLabel: '−$4,400',
    priority: 'High',
    priorityDot: '#b3453f',
    title: 'Low inventory: under 2 weeks of supply',
    impactStr: 'Stock-out risk',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Nutrabay',
    category: 'Inventory',
    repeated: false,
    hasMeeting: true,
    linkedMeetingId: 'm1',
    meetingLabel: 'In your 10:30',
    windowLabel: 'Act within 3 days',
    subheader: 'Days of supply has fallen below the critical 1–2 week threshold against a 21-day supplier lead time.',
    why: 'Sales velocity increased 18% this month while the reorder point was set against last quarter’s slower pace.',
    root: 'The reorder point is static and does not adjust to recent velocity changes.',
    oppWindow: '10 days',
    revLabel: 'Revenue at risk',
    revValue: '$4,400',
    confidence: 88,
    source: 'Inventory Agent, fba_planning_report',
    proof: 'estimated',
    aiSummary: 'Creating a replenishment shipment now — and raising the reorder point to match current velocity — avoids a stock-out before the next delivery window.',
    itemsCount: 1,
    itemsBreakdown: '1 SKU',
    itemsBadge: '1 SKU',
    items: [
      { name: 'BCAA 250g · Watermelon', sku: 'B09LMN4RT8', impact: '−$4,400', color: '#b3453f' },
    ],
    mappedActionTypeId: 'inventory-replenishment-planning',
    options: [
      { id: 'o1', kind: 'INSTRUCTIVE', label: 'Create a replenishment shipment and raise the reorder point', desc: 'Matches recommended action: Inventory replenishment planning/restock recommendation.', expected: '+$4,400', confidence: 88, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  {
    id: 'a30',
    day: 'yesterday',
    time: '31 Oct · 07:30',
    valueNum: -1800,
    valueLabel: '−$1,800',
    priority: 'Low',
    priorityDot: '#3f7d6a',
    title: 'Excess inventory: 12 weeks of supply on hand',
    impactStr: 'Storage cost rising',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Wellbeing Nutrition',
    category: 'Inventory',
    repeated: false,
    hasMeeting: false,
    windowLabel: 'Act within 14 days',
    subheader: 'This SKU is carrying 12 weeks of inventory against typical demand, adding avoidable storage cost.',
    why: 'A promotional forecast overestimated demand, and the resulting order arrived in full.',
    root: 'Promotional forecasts are not reconciled against actual lift after past campaigns.',
    oppWindow: '30 days',
    revLabel: 'Storage cost at risk',
    revValue: '$1,800',
    confidence: 75,
    source: 'Inventory Agent, fba_planning_report',
    proof: 'estimated',
    aiSummary: 'A removal order or a targeted coupon to accelerate sell-through both reduce the storage bill — the right call depends on current margin.',
    itemsCount: 1,
    itemsBreakdown: '1 SKU',
    itemsBadge: '1 SKU',
    items: [
      { name: 'Collagen Peptides 500g', sku: 'B0WEL5512', impact: '−$1,800', color: '#b3453f' },
    ],
    mappedActionTypeId: 'liquidation-excess-inventory',
    options: [
      { id: 'o1', kind: 'INSTRUCTIVE', label: 'Create a removal order or discount to accelerate sell-through', desc: 'Matches recommended action: Liquidation/excess inventory management.', expected: '+$1,800', confidence: 75, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  {
    id: 'a31',
    day: 'today',
    time: '08:55 AM',
    valueNum: -2300,
    valueLabel: '−$2,300',
    priority: 'Medium',
    priorityDot: '#5c7f9e',
    title: 'Stranded inventory: units unsellable',
    impactStr: 'Stock stuck, unsellable',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Boldfit',
    category: 'Inventory',
    repeated: false,
    hasMeeting: false,
    windowLabel: 'Act within 5 days',
    subheader: "Units are physically in an Amazon warehouse but not mapped to any active, sellable listing.",
    why: 'The listing the inventory was received against was deactivated during a catalog cleanup.',
    root: 'No check confirms an active listing exists before inventory is shipped in against it.',
    oppWindow: '30 days',
    revLabel: 'Revenue at risk',
    revValue: '$2,300',
    confidence: 80,
    source: 'Inventory Agent, stranded inventory report',
    proof: 'estimated',
    aiSummary: 'Re-mapping the stranded units to the correct active SKU (or creating a removal order if none fits) returns them to sellable inventory.',
    itemsCount: 1,
    itemsBreakdown: '1 SKU',
    itemsBadge: '1 SKU',
    items: [
      { name: 'Resistance Bands Pro Set', sku: 'B0BLD9012', impact: '−$2,300', color: '#b3453f' },
    ],
    mappedActionTypeId: 'investigate-inventory-misallocation',
    options: [
      { id: 'o1', kind: 'INSTRUCTIVE', label: 'Re-map stranded units to the correct active SKU', desc: 'Matches recommended action: Investigate inventory misallocation/bin check.', expected: '+$2,300', confidence: 80, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  {
    id: 'a32',
    day: 'yesterday',
    time: '31 Oct · 12:00',
    valueNum: -960,
    valueLabel: '−$960',
    priority: 'Low',
    priorityDot: '#3f7d6a',
    title: 'Unfulfillable inventory: units marked damaged',
    impactStr: 'Units cannot ship',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Nutrabay',
    category: 'Inventory',
    repeated: false,
    hasMeeting: false,
    windowLabel: 'Act within 7 days',
    subheader: 'A batch of units was marked warehouse-damaged and moved to unfulfillable inventory.',
    why: 'Handling damage occurred during a warehouse transfer between fulfillment centers.',
    root: 'No root-cause tracking exists on repeated warehouse-damage batches.',
    oppWindow: '30 days',
    revLabel: 'Revenue at risk',
    revValue: '$960',
    confidence: 83,
    source: 'Inventory Agent, unfulfillable inventory report',
    proof: 'estimated',
    aiSummary: 'Since this was warehouse-caused, a reimbursement claim is the right next step rather than write-off.',
    itemsCount: 1,
    itemsBreakdown: '1 SKU',
    itemsBadge: '1 SKU',
    items: [
      { name: 'Creatine Monohydrate 300g', sku: 'B06TY7HJ3K', impact: '−$960', color: '#b3453f' },
    ],
    mappedActionTypeId: 'investigate-inventory-misallocation',
    options: [
      { id: 'o1', kind: 'INSTRUCTIVE', label: 'File a reimbursement claim for the warehouse-damaged units', desc: 'Matches recommended action: Investigate inventory misallocation/bin check.', expected: '+$960', confidence: 83, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  {
    id: 'a33',
    day: 'today',
    time: '06:05 AM',
    valueNum: -1350,
    valueLabel: '−$1,350',
    priority: 'Medium',
    priorityDot: '#5c7f9e',
    title: 'Warehouse lost inventory: reimbursement not yet issued',
    impactStr: 'Loss unreimbursed',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Wellbeing Nutrition',
    category: 'Inventory',
    repeated: false,
    hasMeeting: false,
    windowLabel: 'Act within 10 days',
    subheader: 'The inventory ledger shows a loss adjustment on this SKU with no automatic reimbursement issued yet.',
    why: 'Units went missing during a fulfillment-center transfer three weeks ago.',
    root: 'Automatic reimbursement did not trigger within the standard investigation window.',
    oppWindow: '20 days',
    revLabel: 'Revenue at risk',
    revValue: '$1,350',
    confidence: 86,
    source: 'Inventory Agent, inventory ledger',
    proof: 'estimated',
    aiSummary: 'Since the investigation period has passed with no reimbursement, filing a case with shipment, product and carrier documentation is the next step.',
    itemsCount: 1,
    itemsBreakdown: '1 SKU',
    itemsBadge: '1 SKU',
    items: [
      { name: 'Multivitamin Gummies 90ct', sku: 'B0WEL2245', impact: '−$1,350', color: '#b3453f' },
    ],
    mappedActionTypeId: 'resolve-inventory-reimbursement-claim',
    options: [
      { id: 'o1', kind: 'PROCESS', label: 'File a reimbursement case with shipment and carrier documentation', desc: 'Matches recommended action: File warehouse loss/damage reimbursement claim.', expected: '+$1,350', confidence: 86, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  {
    id: 'a34',
    day: 'yesterday',
    time: '31 Oct · 15:20',
    valueNum: -600,
    valueLabel: '−$600',
    priority: 'Low',
    priorityDot: '#3f7d6a',
    title: 'FBA storage capacity limit reached',
    impactStr: 'Inbound shipments blocked',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Boldfit',
    category: 'Inventory',
    repeated: false,
    hasMeeting: false,
    windowLabel: 'Act within 5 days',
    subheader: 'The account has hit its FBA storage capacity limit, blocking new inbound shipment plans.',
    why: 'Utilization crept up faster than forecast after the last three replenishment shipments landed early.',
    root: 'Capacity utilization is not forecast against upcoming inbound plans before they are created.',
    oppWindow: '20 days',
    revLabel: 'Revenue at risk',
    revValue: '$600',
    confidence: 70,
    source: 'Inventory Agent, FBA capacity report',
    proof: 'estimated',
    aiSummary: 'Cancelling unnecessary draft inbound plans and requesting capacity for the next period should unblock new shipments.',
    itemsCount: 0,
    itemsBreakdown: '',
    itemsBadge: 'Account-wide',
    items: [],
    mappedActionTypeId: 'request-fba-capacity',
    options: [
      { id: 'o1', kind: 'INSTRUCTIVE', label: 'Cancel unnecessary draft plans and request additional capacity', desc: 'Matches recommended action: Request additional FBA storage capacity.', expected: '+$600', confidence: 70, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  // --- Shipment Issue ---
  {
    id: 'a35',
    day: 'today',
    time: '09:40 AM',
    valueNum: -420,
    valueLabel: '−$420',
    priority: 'Low',
    priorityDot: '#3f7d6a',
    title: 'Shipment blocked: maximum dimensions exceeded',
    impactStr: 'Inbound shipment blocked',
    mpBrand: 'amazon',
    mpColor: '#e78a2e',
    mpCountry: 'US',
    account: 'Nutrabay',
    category: 'Inventory',
    repeated: false,
    hasMeeting: false,
    windowLabel: 'Act within 3 days',
    subheader: 'A carton in this shipment plan exceeds the 25x25x25 inch maximum dimension policy.',
    why: 'A packaging update increased carton size beyond the 25-inch-per-side limit without checking policy first.',
    root: 'No dimension check runs against shipment plans before they are submitted.',
    oppWindow: '10 days',
    revLabel: 'Revenue at risk',
    revValue: '$420',
    confidence: 91,
    source: 'Inventory Agent, shipment plan validator',
    proof: 'estimated',
    aiSummary: 'Repacking to bring every carton side under 25 inches clears this shipment for inbound.',
    itemsCount: 1,
    itemsBreakdown: '1 carton',
    itemsBadge: '1 carton',
    items: [
      { name: 'Bulk Case · Omega-3 Fish Oil', sku: 'B0NUT2210-CASE', impact: '−$420', color: '#b3453f' },
    ],
    mappedActionTypeId: 'resolve-shipment-dimension-issue',
    options: [
      { id: 'o1', kind: 'INSTRUCTIVE', label: 'Repack the carton within the 25-inch dimension limit', desc: 'Matches recommended action: Resolve shipment/package dimension issue.', expected: '+$420', confidence: 91, recommended: true },
      { id: 'other', kind: 'OTHER', label: 'Do something else', desc: 'Write your own action.', isOther: true },
    ],
  },
  {
    id: 'a36',
    day: 'today',
    time: '06:00 AM',
    valueNum: -1450000,
    valueLabel: '−$1.45M',
    priority: 'High',
    priorityDot: '#b3453f',
    title: 'Q4 profitability forecast down across the entire Boldfit portfolio',
    impactStr: 'Net profit at risk',
    mpBrand: 'walmart',
    mpColor: '#0071ce',
    mpCountry: 'US',
    account: 'Boldfit',
    category: 'Profitability',
    repeated: false,
    hasMeeting: true,
    linkedMeetingId: 'm3',
    meetingLabel: 'In your 10:30',
    windowLabel: 'Act within 10 days',
    subheader: 'A freight-cost increase across the supplier base is projected to erode Q4 margin storefront-wide unless pricing or sourcing is adjusted.',
    why: 'Ocean freight rates rose 22% this quarter and were never passed through to retail pricing across the 340-ASIN portfolio.',
    root: 'No process links supplier freight-cost changes to a pricing or margin review.',
    oppWindow: '60 days',
    revLabel: 'Revenue at risk',
    revValue: '$1.45M',
    confidence: 72,
    source: 'Profitability Agent, quarterly forecast',
    proof: 'estimated',
    aiSummary: 'This is a forecast, not a single-day loss — a phased price adjustment across the highest-freight-cost SKUs recovers most of the margin without a blanket price hike that could hurt conversion.',
    itemsCount: 340,
    itemsBreakdown: '340 ASINs',
    itemsBadge: '340 ASINs',
    items: [
      { name: 'Adjustable Dumbbell Set — Grey', sku: 'B0BLD3390', impact: '−$18,200', color: '#b3453f' },
      { name: 'Resistance Bands Pro Set', sku: 'B0BLD9012', impact: '−$14,600', color: '#b3453f' },
      { name: 'Foam Roller — High Density', sku: 'B0BLD6620', impact: '−$9,400', color: '#b3453f' },
    ],
    mappedActionTypeId: 'adjust-pricing-discount',
    options: [
      { id: 'o1', kind: 'INSTRUCTIVE', label: 'Phase in a price adjustment on the highest-freight-cost SKUs', desc: 'Matches recommended action: Adjust pricing/discount strategy. Recovers most of the margin without a storefront-wide hike.', expected: '+$1.1M', confidence: 72, recommended: true },
      { id: 'o2', kind: 'PROCESS', label: 'Ask the client to renegotiate freight rates with the supplier base', desc: 'Addresses the root cause rather than passing the cost to customers.', isMeetingAsk: true },
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

export type TaskStatus = 'open' | 'in_progress' | 'done';

/** What kind of thing produced this task — decides which contextual action the card offers. */
export type TaskOrigin = 'alert' | 'meeting' | 'generative' | 'direct';

export interface WorkstationLogEntry {
  time: string;
  text: string;
}

export interface WorkstationTask {
  id: string;
  text: string;
  /** Longer explanation shown only in the expanded card. */
  description: string;
  /** Display name of who the task is for. 'You' is the current user, 'Unassigned' if nobody yet. */
  assignee: string;
  /** id into DEFAULT_ASSIGNEES, for avatar lookup — omitted for external/unassigned people. */
  assigneeId?: string;
  /** Who created/assigned the task — 'You' for self-created or delegated-out tasks. */
  createdBy: string;
  due: string;
  dueColor?: string;
  overdue: boolean;
  status: TaskStatus;
  origin: TaskOrigin;
  /** id into PROTOTYPE_ALERTS — present when origin is 'alert'. */
  alertId?: string;
  /** id into MEETING_LIST / COMPLETED_MEETINGS — present when origin is 'meeting'. */
  meetingId?: string;
  meetingLabel?: string;
  logs: WorkstationLogEntry[];
}

export const WORKSTATION_TASKS: WorkstationTask[] = [
  {
    id: 't1', text: 'Publish approved bullet copy on the six hero ASINs and confirm re-index completed',
    description: 'Priya signed off on the proposed bullet copy for the six hero ASINs during the QBR prep call. Publish it and confirm Amazon has re-indexed the listings before the next check-in.',
    assignee: 'You', assigneeId: 'self', createdBy: 'Priya Nair', due: 'Due 3 Nov', dueColor: '#b3453f', overdue: false, status: 'open', origin: 'meeting', meetingId: 'm2', meetingLabel: 'QBR preparation call',
    logs: [{ time: '2 days ago', text: 'Created from QBR preparation call' }, { time: '1 day ago', text: 'Priya confirmed sign-off over email' }],
  },
  {
    id: 't2', text: 'Model Q4 stock cover at two scenarios for the hero range',
    description: "Wellbeing's stock cover sits below their usual comfort line. Build a base case and a conservative case for Q4 so the account team can commit inventory with confidence.",
    assignee: 'You', assigneeId: 'self', createdBy: 'You', due: 'Due 7 Nov', overdue: false, status: 'in_progress', origin: 'meeting', meetingId: 'm2', meetingLabel: 'QBR preparation call',
    logs: [{ time: '2 days ago', text: 'Created from QBR preparation call' }, { time: 'Yesterday', text: 'Started the base-case model' }],
  },
  {
    id: 't3', text: 'Chase the Q4 promo calendar from Rahul before the 8 November lock',
    description: "Nutrabay's Q4 promo calendar is overdue. Without it the promo slots can't be locked in time for the 8 November deadline.",
    assignee: 'You', assigneeId: 'self', createdBy: 'You', due: 'Overdue by 7 days', dueColor: '#b3453f', overdue: true, status: 'in_progress', origin: 'meeting', meetingId: 'm1', meetingLabel: 'Weekly performance review',
    logs: [{ time: '9 days ago', text: 'Created from Weekly performance review' }, { time: '2 hours ago', text: 'You sent a reminder to Rahul' }],
  },
  {
    id: 't4', text: 'Place inventory reorder for the three at-risk SKUs',
    description: 'Three SKUs were flagged as at-risk of stocking out. Reorder placed and verified against the units-sold trend over the following week.',
    assignee: 'You', assigneeId: 'self', createdBy: 'You', due: 'Done 30 Oct', dueColor: '#3f7d6a', overdue: false, status: 'done', origin: 'alert', alertId: 'a3',
    logs: [{ time: '3 days ago', text: 'Created from alert: Inventory reorder on three SKUs came back verified' }, { time: '2 days ago', text: 'Reorder placed' }, { time: 'Yesterday', text: 'Verified over 7 days on units sold' }],
  },
  {
    id: 't5', text: 'Send the October performance summary to Sneha',
    description: "Draft and send Sneha a short October wrap-up covering GMV, margin, and the content incident — she asked for this ahead of the board pack.",
    assignee: 'You', assigneeId: 'self', createdBy: 'You', due: 'Done 29 Oct', dueColor: '#3f7d6a', overdue: false, status: 'done', origin: 'generative',
    logs: [{ time: '4 days ago', text: 'Created directly' }, { time: '3 days ago', text: 'Drafted with Jiva' }, { time: '3 days ago', text: 'Sent to Sneha' }],
  },
  {
    id: 't6', text: 'Draft replacement creative for the two suppressed Wellbeing ASINs',
    description: 'Both suppressed listings need a compliant white-background main image before they can be reinstated. Generate a draft for review.',
    assignee: 'Mike Torres', assigneeId: 'mike', createdBy: 'You', due: 'Due 5 Nov', overdue: false, status: 'open', origin: 'generative',
    logs: [{ time: '2 days ago', text: 'Created from alert: Two listings suppressed on image compliance' }],
  },
  {
    id: 't7', text: 'Pull the competitor price benchmark for the Q4 planning deck',
    description: "Boldfit's Q4 planning call flagged the need for a competitor price benchmark on the hero range before the profitability discussion.",
    assignee: 'Sarah Kim', assigneeId: 'sarah', createdBy: 'You', due: 'Due 4 Nov', dueColor: '#b3453f', overdue: false, status: 'open', origin: 'meeting', meetingId: 'm3', meetingLabel: 'Q4 planning and inventory commitments',
    logs: [{ time: '1 day ago', text: 'Created from Q4 planning and inventory commitments' }],
  },
  {
    id: 't8', text: 'Confirm a pre-flight compliance check before the next creative push',
    description: 'Agreed at the QBR to add a compliance check before any future creative goes live, to stop the recurring suppression pattern. Needs an owner.',
    assignee: 'Unassigned', createdBy: 'You', due: 'Due 8 Nov', overdue: false, status: 'open', origin: 'meeting', meetingId: 'm2', meetingLabel: 'QBR preparation call',
    logs: [{ time: '2 days ago', text: 'Created from QBR preparation call' }],
  },
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
  tasksCompleted: number;
  tasksTotal: number;
  isToday: boolean;
  dateLabel: string;
}

export const MEETING_LIST: MeetingListItem[] = [
  { id: 'm1', timeRange: '10:30 – 11:15 AM', account: 'Nutrabay', title: 'Weekly performance review', tasksCompleted: 2, tasksTotal: 5, isToday: true, dateLabel: 'Today' },
  { id: 'm2', timeRange: '2:00 – 2:30 PM', account: 'Wellbeing', title: 'QBR preparation call', tasksCompleted: 3, tasksTotal: 3, isToday: true, dateLabel: 'Today' },
  { id: 'm3', timeRange: '11:00 AM – 12:00 PM', account: 'Boldfit', title: 'Q4 planning and inventory commitments', tasksCompleted: 0, tasksTotal: 4, isToday: false, dateLabel: 'Monday · 3 November' },
];

export interface MeetingStat {
  label: string;
  value: string;
  trend: string;
  trendColor: string;
}

export interface MeetingAttendee {
  name: string;
  role: string;
}

export interface MeetingDetail {
  dateTimeLabel: string;
  attendees: MeetingAttendee[];
  lastMet: string;
  resolvedPct: number;
  resolvedColor: string;
  agenda: string;
  accountStudy: string;
  metrics: MeetingStat[];
}

/** Keyed by MeetingListItem.id — the content the detail panel actually renders per meeting. */
export const MEETING_DETAILS: Record<string, MeetingDetail> = {
  m1: {
    dateTimeLabel: 'Today, 1 November · 10:30 – 11:15 AM',
    attendees: [
      { name: 'Rahul Gupta', role: 'Head of Ecommerce' },
      { name: 'Sneha Iyer', role: 'Brand Manager' },
    ],
    lastMet: 'last met 25 October',
    resolvedPct: 55,
    resolvedColor: '#a8763f',
    agenda: 'Weekly trading review covering October close, the content incident on the hero range, and Q4 promo readiness. Rahul has asked for a view on margin against the 18% target before the board pack goes out on 8 November.',
    accountStudy: 'GMV is up 6.2% month on month and ROAS is holding at 4.8 against a 4.5 target. Margin is the weak line at 16.4%, held back mostly by the content incident. The relationship is healthy; the recurring PIM overwrite is the one friction point worth naming today.',
    metrics: [
      { label: 'GMV', value: '$412k', trend: 'up 6.2%', trendColor: '#3f7d6a' },
      { label: 'Net margin', value: '16.4%', trend: 'up 0.9 pt', trendColor: '#3f7d6a' },
      { label: 'ROAS', value: '4.8', trend: 'flat', trendColor: '#6b7178' },
      { label: 'Conversion', value: '6.4%', trend: 'down 2.7 pt', trendColor: '#b3453f' },
    ],
  },
  m2: {
    dateTimeLabel: 'Today, 1 November · 2:00 – 2:30 PM',
    attendees: [
      { name: 'Priya Nair', role: 'Ecommerce Lead' },
      { name: 'Aditi Rao', role: 'Compliance' },
    ],
    lastMet: 'last met 18 October',
    resolvedPct: 100,
    resolvedColor: '#3f7d6a',
    agenda: 'QBR prep for Wellbeing Nutrition — the compliance suppression on two listings, the replacement creative timeline, and confirming Q4 stock cover before the deck goes to the client.',
    accountStudy: 'GMV is flat quarter over quarter with the two suppressed listings weighing on it directly. The client has been responsive — replacement creative is already in review. No other account-health flags this quarter.',
    metrics: [
      { label: 'GMV', value: '$186k', trend: 'flat', trendColor: '#6b7178' },
      { label: 'Listings suppressed', value: '2', trend: 'since 30 Oct', trendColor: '#b3453f' },
      { label: 'ROAS', value: '4.2', trend: 'up 0.3', trendColor: '#3f7d6a' },
      { label: 'Stock cover', value: '5 wks', trend: 'below target', trendColor: '#a8763f' },
    ],
  },
  m3: {
    dateTimeLabel: 'Monday, 3 November · 11:00 AM – 12:00 PM',
    attendees: [
      { name: 'Karan Mehta', role: 'Founder' },
      { name: 'Isha Verma', role: 'Finance' },
    ],
    lastMet: 'last met 6 October',
    resolvedPct: 8,
    resolvedColor: '#b3453f',
    agenda: 'Q4 planning and inventory commitments for Boldfit — the profitability forecast miss, two open compliance documents, the declined card blocking ad spend, and locking Q4 stock levels.',
    accountStudy: 'Profitability is trending down across the portfolio ahead of Q4, compounded by a declined payment method that has already paused advertising once this month. Two compliance documents are still outstanding with Amazon. This meeting is under-prepared — start here first.',
    metrics: [
      { label: 'GMV', value: '$268k', trend: 'down 3.1%', trendColor: '#b3453f' },
      { label: 'Net margin', value: '11.2%', trend: 'down 2.4 pt', trendColor: '#b3453f' },
      { label: 'ROAS', value: '3.9', trend: 'down 0.4', trendColor: '#b3453f' },
      { label: 'Ad spend', value: '$0', trend: 'card declined', trendColor: '#b3453f' },
    ],
  },
};

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
  { id: 'm4', timeRange: '3:00 – 3:44 PM', account: 'Wellbeing', title: 'Quarterly business review', alertsMapped: 3, tasksExtracted: 4, status: 'Completed', statusColor: '#3f7d6a', momStatus: 'MOM unsent', momColor: '#a8763f', dateLabel: 'Yesterday · 31 October' },
  { id: 'm5', timeRange: '10:30 – 11:20 AM', account: 'Nutrabay', title: 'Weekly performance review', alertsMapped: 5, tasksExtracted: 3, status: 'Completed', statusColor: '#3f7d6a', momStatus: 'MOM sent', momColor: '#3f7d6a', dateLabel: '25 October' },
];

export interface MomTaskItem {
  task: string;
  assignee: string;
  due: string;
  status: string;
}

export interface MomRecord {
  completedLabel: string;
  transcriptMeta: string;
  title: string;
  dateLabel: string;
  sent: boolean;
  summary: string;
  decisions: string[];
  tasks: MomTaskItem[];
}

/** Keyed by CompletedMeeting.id. */
export const MOM_RECORDS: Record<string, MomRecord> = {
  m4: {
    completedLabel: 'Completed 3:44 PM',
    transcriptMeta: 'From transcript · 44 minutes · 4 attendees',
    title: 'Wellbeing Nutrition · Quarterly business review',
    dateLabel: '31 October 2025',
    sent: false,
    summary: 'The quarter closed ahead on GMV but short on margin, and most of the conversation was about why. We walked through the two suppressed listings, agreed the compliance issue was avoidable, and committed to a pre-flight image check before any future asset push. Priya raised concern about Q4 stock cover on the hero range; we agreed to model two scenarios before the next call. The team accepted our recommendation on bullet copy without changes.',
    decisions: [
      'Anarix runs a pre-flight compliance check on all creative before it goes live.',
      'Bullet copy recommendation approved as proposed, no edits requested.',
      'Q4 stock cover to be modelled at two scenarios before the next review.',
    ],
    tasks: [
      { task: 'Model Q4 stock cover at two scenarios', assignee: 'Ritvik Sharma', due: '7 Nov', status: 'Work-station' },
      { task: 'Send replacement creative for two suppressed ASINs', assignee: 'Priya Nair · client', due: '4 Nov', status: 'Email' },
      { task: 'Publish approved bullet copy on 6 hero ASINs', assignee: 'Ritvik Sharma', due: '3 Nov', status: 'Work-station' },
      { task: 'Share updated compliance checklist', assignee: 'Aditi Rao · client', due: '5 Nov', status: 'Email' },
    ],
  },
  m5: {
    completedLabel: 'Completed 11:20 AM',
    transcriptMeta: 'From transcript · 50 minutes · 3 attendees',
    title: 'Nutrabay · Weekly performance review',
    dateLabel: '25 October 2025 · sent to client',
    sent: true,
    summary: 'Reviewed the week-over-week dip in conversion on the hero range, traced to a client catalogue push that overwrote optimised bullet copy. Agreed to revert immediately and raised the recurring-overwrite pattern as a process risk. Inventory reorder on three SKUs was confirmed verified. No new asks from the client this week.',
    decisions: [
      'Revert the 27 Oct bullet copy on the affected ASINs immediately.',
      'Raise a formal request for a PIM approval gate to stop the recurrence.',
      'Continue weekly cadence at the same time next week.',
    ],
    tasks: [
      { task: 'Revert bullet copy to the 27 Oct version', assignee: 'Ritvik Sharma', due: '26 Oct', status: 'Work-station' },
      { task: 'Draft the PIM approval-gate proposal for the client', assignee: 'Ritvik Sharma', due: '29 Oct', status: 'Work-station' },
      { task: 'Confirm re-index completed on reverted ASINs', assignee: 'Priya Nair · client', due: '28 Oct', status: 'Email' },
    ],
  },
};

export interface PrepAction {
  alert: string;
  action: string;
  impact: string;
  impactColor: string;
  impactStyle?: string;
  state: string;
  stateColor: string;
}

export interface PrepRecord {
  positives: string[];
  negatives: string[];
  actions: PrepAction[];
  discussion: string[];
}

/** Keyed by MeetingListItem.id — everything the Prep/Presentation flow shows for that meeting. */
export const PREP_RECORDS: Record<string, PrepRecord> = {
  m1: {
    positives: [
      'Inventory reorder recovered $6,200, verified over seven days on units sold.',
      'GMV up 6.2% with ad spend flat — growth is organic, not bought.',
      'ROAS holding above the 4.5 target for a fourth consecutive week.',
    ],
    negatives: [
      'Conversion down 2.7 points on the hero range after their catalogue push.',
      'Third recurrence of the same overwrite — the fix keeps getting undone.',
      'Q4 promo calendar is a week overdue and the 8 November lock is close.',
    ],
    actions: [
      { alert: 'Net profit down 12% on 14 ASINs', action: 'Reverted to 27 Oct copy', impact: '+$7,100', impactColor: '#464646', impactStyle: 'italic', state: 'Running', stateColor: '#a8763f' },
      { alert: 'Inventory reorder · 3 SKUs', action: 'Reorder placed Thursday', impact: '+$6,200', impactColor: '#3f7d6a', state: 'Verified', stateColor: '#3f7d6a' },
      { alert: 'Bullet copy under-performing', action: 'Awaiting client sign-off', impact: '+$5,300', impactColor: '#464646', impactStyle: 'italic', state: 'Proposed', stateColor: '#6b7178' },
    ],
    discussion: [
      'Route catalogue pushes through an approval gate — third recurrence this week.',
      'Sign off new bullet copy on the six hero ASINs, worth about $5,300 a month.',
      'Confirm Q4 promo dates before the 8 November lock.',
    ],
  },
  m2: {
    positives: [
      'Replacement creative for both suppressed listings is already in client review.',
      'No new account-health flags this quarter — the compliance issue was isolated.',
      'Client has been responsive on every ask this cycle, under 24h turnaround.',
    ],
    negatives: [
      'Two listings still suppressed on image compliance since 30 October.',
      'Stock cover sits at 5 weeks against Wellbeing\'s usual 8-week comfort line.',
      'GMV is flat quarter over quarter while the suppression is unresolved.',
    ],
    actions: [
      { alert: 'Two listings suppressed on image compliance', action: 'Replacement creative drafted, awaiting sign-off', impact: '+$6,380', impactColor: '#464646', impactStyle: 'italic', state: 'Proposed', stateColor: '#6b7178' },
    ],
    discussion: [
      'Confirm timeline for the replacement creative sign-off.',
      'Model Q4 stock cover at two scenarios before committing inventory.',
      'Agree a pre-flight compliance check so this doesn\'t recur.',
    ],
  },
  m3: {
    positives: [
      'Ad account access is otherwise clean — the decline is a card issue, not a policy flag.',
    ],
    negatives: [
      'Profitability forecast down across the entire portfolio ahead of Q4.',
      'Declined card has already paused advertising once this month.',
      'Two compliance documents remain outstanding with Amazon.',
    ],
    actions: [
      { alert: 'Q4 profitability forecast down across the entire Boldfit portfolio', action: 'Awaiting Q4 planning decisions', impact: '−$1.4M', impactColor: '#b3453f', state: 'Open', stateColor: '#b3453f' },
      { alert: 'Credit card on file declined', action: 'Client notified, new card pending', impact: '—', impactColor: '#6b7178', state: 'Open', stateColor: '#b3453f' },
    ],
    discussion: [
      'Get an updated payment method on file before ad spend resumes.',
      'Close out both outstanding compliance documents this week.',
      'Lock Q4 stock commitments given the profitability miss.',
    ],
  },
};

/** Important inbound messages surfaced on the Brief page — email, Slack, or Workspace. Reuses AlertSource for the icon. */
export interface BriefMessage {
  id: string;
  channel: Extract<AlertSource, 'email' | 'slack' | 'workspace'>;
  from: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
}

export const BRIEF_MESSAGES: BriefMessage[] = [
  { id: 'msg1', channel: 'email', from: 'Priya Nair · Nutrabay', subject: 'Re: PIM approval gate', preview: "Yes, let's add the gate — can your team scope the effort by Friday?", time: '08:12 AM', unread: true },
  { id: 'msg2', channel: 'slack', from: '#nutrabay-pod', subject: 'Ritvik Sharma', preview: 'Heads up — I moved the 10:30 to 11:00, same agenda.', time: '07:50 AM', unread: true },
  { id: 'msg3', channel: 'workspace', from: 'Wellbeing Nutrition pod', subject: 'Creative review thread', preview: 'Aditi shared the replacement creative for the two suppressed ASINs.', time: '07:20 AM', unread: false },
  { id: 'msg4', channel: 'email', from: 'Sneha Kapoor · Boldfit', subject: 'Q4 promo calendar', preview: 'Attaching the draft calendar — need your sign-off before the lock.', time: 'Yesterday, 6:40 PM', unread: false },
];

/** What Jiva did autonomously while the user was away — the "peak" payoff moment on the Brief page. */
export interface JivaActivityItem {
  id: string;
  label: string;
  detail: string;
  impact?: string;
  impactColor?: string;
  time: string;
  alertId?: string;
}

export const JIVA_ACTIVITY: JivaActivityItem[] = [
  { id: 'ja1', label: 'Reordered inventory on 3 at-risk SKUs', detail: 'Verified over 7 days on units sold', impact: '+$6,200', impactColor: '#3f7d6a', time: '06:02 AM', alertId: 'a3' },
  { id: 'ja2', label: 'Escalated the missing-main-image suppression', detail: 'Sent to Catalog with a drafted white-background image, awaiting your review', impact: '−$3,400 at risk', impactColor: '#b3453f', time: '06:22 AM', alertId: 'a15' },
  { id: 'ja3', label: 'Drafted a follow-up email to Wellbeing Nutrition', detail: 'On the two listings suppressed for image compliance — ready to send', time: '07:05 AM', alertId: 'a4' },
];

/** Catalog of metrics the Dashboard's KPI cards can be reassigned to. */
export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  prevLabel: string;
  color: string;
}

export const DASHBOARD_METRICS: DashboardMetric[] = [
  { id: 'ad-spend', label: 'Ad spend', value: '$8,456', trend: '16.9%', trendUp: true, prevLabel: 'Prev 7 days: $7,235', color: '#77469b' },
  { id: 'ad-sales', label: 'Ad sales', value: '$38,235', trend: '17.8%', trendUp: true, prevLabel: 'Prev 7 days: $32,457', color: '#3f7d6a' },
  { id: 'ad-units', label: 'Ad units', value: '1,203', trend: '10.7%', trendUp: true, prevLabel: 'Prev 7 days: 1,087', color: '#5c7f9e' },
  { id: 'roas', label: 'ROAS', value: '4.52', trend: '0.7%', trendUp: true, prevLabel: 'Prev 7 days: 4.49', color: '#a8763f' },
  { id: 'impressions', label: 'Impressions', value: '1.2M', trend: '13.4%', trendUp: true, prevLabel: 'Prev 7 days: 1,098,234', color: '#b3453f' },
  { id: 'clicks', label: 'Clicks', value: '42,180', trend: '9.2%', trendUp: true, prevLabel: 'Prev 7 days: 38,630', color: '#8a7fa8' },
  { id: 'ctr', label: 'CTR', value: '3.51%', trend: '2.1%', trendUp: false, prevLabel: 'Prev 7 days: 3.59%', color: '#5f9e8a' },
  { id: 'cvr', label: 'CVR', value: '6.9%', trend: '4.4%', trendUp: true, prevLabel: 'Prev 7 days: 6.6%', color: '#3f7d6a' },
  { id: 'acos', label: 'ACOS', value: '22.1%', trend: '1.8%', trendUp: false, prevLabel: 'Prev 7 days: 21.7%', color: '#b3453f' },
  { id: 'tacos', label: 'TACOS', value: '9.4%', trend: '0.9%', trendUp: true, prevLabel: 'Prev 7 days: 9.5%', color: '#77469b' },
];
