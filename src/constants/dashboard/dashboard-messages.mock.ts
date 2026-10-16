/** Important inbound messages shown on the Dashboard's "Important messages" widget (sample data). */
export interface DashboardMessage {
  id: string;
  channel: 'email' | 'slack' | 'workspace';
  /** Where it came in: "Email", "#nutrabay-pod", a Workspace space name. */
  thread: string;
  sender: string;
  /** The sender's company or role, shown next to the name. */
  org?: string;
  subject: string;
  body: string[];
  time: string;
  unread: boolean;
  attachments?: { name: string; size: string }[];
}

export const DASHBOARD_MESSAGES: DashboardMessage[] = [
  {
    id: 'dm1',
    channel: 'email',
    thread: 'Email',
    sender: 'Priya Nair',
    org: 'Nutrabay',
    subject: 'Approval gate for price changes',
    body: [
      "Yes, let's add the gate. Every price change above 8% should wait for a sign-off from our category lead before it goes live.",
      'Can your team scope the effort by Friday? We would like it in place before the Diwali calendar locks.',
    ],
    time: '08:12 AM',
    unread: true,
  },
  {
    id: 'dm2',
    channel: 'slack',
    thread: '#nutrabay-pod',
    sender: 'Ritvik Sharma',
    org: 'Account lead',
    subject: 'Weekly review moved to 11:00',
    body: ['Heads up: I moved the 10:30 to 11:00, same agenda. Priya joins for the first 20 minutes only, so pricing goes first.'],
    time: '07:50 AM',
    unread: true,
  },
  {
    id: 'dm3',
    channel: 'email',
    thread: 'Email',
    sender: 'Sneha Kapoor',
    org: 'Boldfit',
    subject: 'Draft promotion calendar needs your sign-off',
    body: [
      'Attaching the draft calendar for the next six weeks. The two lightning deals on resistance bands overlap with the coupon you proposed, so one of them has to move.',
      'We need your sign-off before the lock on Thursday evening.',
    ],
    time: '07:31 AM',
    unread: true,
    attachments: [
      { name: 'Boldfit_promo_calendar_v3.xlsx', size: '84 KB' },
      { name: 'Deal_overlap_notes.pdf', size: '212 KB' },
    ],
  },
  {
    id: 'dm4',
    channel: 'workspace',
    thread: 'Wellbeing Nutrition pod',
    sender: 'Aditi Rao',
    org: 'Creative',
    subject: 'Replacement images for the two suppressed ASINs',
    body: [
      'Shared the replacement creative for the two suppressed ASINs. Both main images are now on a pure white background at 2000 px.',
      'Once you approve, catalog can upload them today and the listings should be back within 24 hours.',
    ],
    time: '07:20 AM',
    unread: false,
    attachments: [{ name: 'WN_main_images_white_bg.zip', size: '6.2 MB' }],
  },
  {
    id: 'dm5',
    channel: 'slack',
    thread: '#boldfit-ads',
    sender: 'Karan Mehta',
    org: 'PPC specialist',
    subject: 'Budget cap hit on Brand Defense by noon',
    body: ['Brand Defense ran out of budget at 12:04 yesterday for the third day running. Suggest raising the daily cap from $450 to $600 for the sale week.'],
    time: '06:58 AM',
    unread: false,
  },
  {
    id: 'dm6',
    channel: 'email',
    thread: 'Email',
    sender: 'Amazon Seller Support',
    subject: 'Case 14882301: listing reinstatement in review',
    body: [
      'Thank you for your appeal. Your request to reinstate ASIN B09XH4RT22 is being reviewed by the policy team.',
      'You will receive an update within 2 business days. No further action is needed right now.',
    ],
    time: 'Yesterday, 6:40 PM',
    unread: false,
  },
  {
    id: 'dm7',
    channel: 'workspace',
    thread: 'Leadership updates',
    sender: 'Nikhil Varma',
    org: 'Head of accounts',
    subject: 'Q4 targets shared with every pod',
    body: ['Q4 revenue and ACOS targets are now in the shared sheet. Please check your accounts against them before Monday’s planning call.'],
    time: 'Yesterday, 4:15 PM',
    unread: false,
  },
];
