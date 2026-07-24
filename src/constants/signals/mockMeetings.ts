import type { ValueKind, Cadence } from '@/utils/signals/valueFormat';
import type { DecisionDomain } from './decisions.constants';

export type MeetingTaskStatus = 'open' | 'completed' | 'not_completed' | 'with_aan';

export interface MeetingAttendee {
  name: string;
  role?: string;
}

export interface MeetingTask {
  id: string;
  bundleId: string;
  valueCents: number;
  valueKind: ValueKind;
  cadence?: Cadence;
  valueCaption: string;
  valueBasis: string;
  insight: string;
  insightDetail?: string;
  actionVerb: string;
  owner?: string;
  domain: DecisionDomain;
  status: MeetingTaskStatus;
  transcriptExcerpt?: string;
  createdAt: number;
  updatedAt: number;
}

export interface MeetingBundle {
  id: string;
  title: string;
  ts: number;
  durationMin: number;
  attendees: MeetingAttendee[];
  summary: string;
  transcriptExcerpt: string;
  taskIds: string[];
}

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const now = Date.now();

export const MOCK_MEETING_BUNDLES: MeetingBundle[] = [
  {
    id: 'mtg-staples-qbr',
    title: 'Staples QBR - Q4 Planning',
    ts: now - 2 * HOUR,
    durationMin: 47,
    attendees: [
      { name: 'Dorothy Chen', role: 'Staples buyer' },
      { name: 'Mike Reyes', role: 'Portal ops' },
      { name: 'Priya Shah', role: 'Anarix account lead' },
      { name: 'You Own', role: 'You' },
    ],
    summary:
      'Buyer confirmed Q4 hero-SKU commitment and asked us to relist SKU-X before Friday. Pricing memo and forecast refresh due same week.',
    transcriptExcerpt:
      'Dorothy: We are holding the Q4 tier if you can get SKU-X back on shelf before Friday.\nMike: Portal ticket #48291 is open - needs compliance docs from your side.\nPriya: We will send a competitor pricing memo across the 20 hero SKUs before EOW.\nDorothy: Also want the refreshed forecast so we can lock the buyer commit.',
    taskIds: ['mt-staples-1', 'mt-staples-2', 'mt-staples-3', 'mt-staples-4', 'mt-staples-5'],
  },
  {
    id: 'mtg-weekly-perf',
    title: 'Weekly Performance Review',
    ts: now - 26 * HOUR,
    durationMin: 32,
    attendees: [
      { name: 'Priya Shah', role: 'Anarix account lead' },
      { name: 'Rahul Menon', role: 'Growth' },
      { name: 'You Own', role: 'You' },
    ],
    summary:
      'Winter Push efficiency has slipped 3 weeks running; team aligned on reallocating to Launch S4 and tightening evergreen day-parting.',
    transcriptExcerpt:
      'Priya: Winter Push TACoS is 41% over target - three weeks in a row.\nRahul: Launch S4 has headroom, ROAS ceiling is 4.1x.\nYou: Let us shift budget and tighten day-parting on Evergreen.',
    taskIds: ['mt-perf-1', 'mt-perf-2', 'mt-perf-3', 'mt-perf-4', 'mt-perf-5'],
  },
  {
    id: 'mtg-amazon-sync',
    title: 'Amazon Q4 Strategy Sync',
    ts: now - 4 * HOUR,
    durationMin: 55,
    attendees: [
      { name: 'Ari Patel', role: 'Amazon AM' },
      { name: 'Priya Shah', role: 'Anarix account lead' },
      { name: 'Kai Larsen', role: 'Ops' },
      { name: 'Nora Kim', role: 'Creative' },
      { name: 'You Own', role: 'You' },
    ],
    summary:
      'Amazon AM walked us through Q4 deal windows, DSP audiences, and Vine gaps on hero SKUs. Three decisions land in the queue this week.',
    transcriptExcerpt:
      'Ari: You have Vine gaps on 4 hero SKUs - enroll before the Nov cutoff.\nPriya: DSP audience refresh from AMC is ready to push.\nAri: Prime-day-lite window opens Nov 12 - hero SKU coupons should be locked by Nov 8.\nKai: Ops can support up to +30% velocity if we know 10 days out.',
    taskIds: ['mt-amz-1', 'mt-amz-2', 'mt-amz-3', 'mt-amz-4'],
  },
  {
    id: 'mtg-ops-standup',
    title: 'Ops Standup - Weekly',
    ts: now - 50 * HOUR,
    durationMin: 22,
    attendees: [
      { name: 'Kai Larsen', role: 'Ops' },
      { name: 'Sam Wu', role: 'Warehouse' },
      { name: 'You Own', role: 'You' },
    ],
    summary:
      '3PL Reno throwing damage claims on batch #B-2214. Warehouse Sam has evidence and wants CS to fast-track refunds while ops files a carrier claim.',
    transcriptExcerpt:
      'Sam: Batch #B-2214 came through Reno lane - photos show packaging failure.\nKai: I will file the carrier claim; you push CS to refund customers today.\nYou: Let us also flag the Reno lane for a 30-day watch.',
    taskIds: ['mt-ops-1', 'mt-ops-2', 'mt-ops-3'],
  },
];

export const MOCK_MEETING_TASKS: MeetingTask[] = [
  {
    id: 'mt-staples-1',
    bundleId: 'mtg-staples-qbr',
    valueCents: 1_200_000,
    valueKind: 'at_risk',
    valueCaption: 'buyer commit at risk',
    valueBasis:
      'SKU-X ran $12k/mo before suppression on Oct 12; buyer wants it back on shelf before Friday. Missing that unlocks-back the Q4 tier commitment.',
    insight: 'Relist SKU-X on Staples before Friday - Q4 tier hinges on it.',
    insightDetail:
      'Portal ticket #48291 has been open 26 days waiting on compliance docs. Dorothy is holding the tier commit until the SKU is live again. Mike has the ticket queued on his side.',
    actionVerb: 'Relist SKU-X',
    owner: 'Mike Reyes',
    domain: 'retail',
    status: 'open',
    transcriptExcerpt: 'Dorothy: We are holding the Q4 tier if you can get SKU-X back on shelf before Friday.',
    createdAt: now - 2 * HOUR,
    updatedAt: now - 2 * HOUR,
  },
  {
    id: 'mt-staples-2',
    bundleId: 'mtg-staples-qbr',
    valueCents: 0,
    valueKind: 'info',
    valueCaption: 'informational - blocks buyer sync',
    valueBasis: 'Buyer asked for a competitor pricing memo across 20 hero SKUs by EOW.',
    insight: 'Draft competitor pricing memo across 20 hero SKUs before Friday sync.',
    actionVerb: 'Draft memo',
    owner: 'You Own',
    domain: 'buyer',
    status: 'open',
    transcriptExcerpt: 'Priya: We will send a competitor pricing memo across the 20 hero SKUs before EOW.',
    createdAt: now - 2 * HOUR,
    updatedAt: now - 2 * HOUR,
  },
  {
    id: 'mt-staples-3',
    bundleId: 'mtg-staples-qbr',
    valueCents: 220_000,
    valueKind: 'gain',
    cadence: 'monthly',
    valueCaption: 'unlocks $220k/mo buyer tier',
    valueBasis: 'Unlocks Q4 buyer commit at the $220k/mo tier once forecast is refreshed and shared with Dorothy.',
    insight: 'Send Q4 unit forecast refresh to Dorothy - unlocks the $220k/mo tier.',
    actionVerb: 'Send forecast',
    owner: 'Priya Shah',
    domain: 'profitability',
    status: 'open',
    createdAt: now - 2 * HOUR,
    updatedAt: now - 2 * HOUR,
  },
  {
    id: 'mt-staples-4',
    bundleId: 'mtg-staples-qbr',
    valueCents: 48_000,
    valueKind: 'cost',
    cadence: 'one_time',
    valueCaption: 'one-time compliance work',
    valueBasis: 'Compliance docs pack for portal ticket #48291 - required for the relist.',
    insight: 'Attach compliance docs to portal ticket #48291.',
    actionVerb: 'Attach docs',
    owner: 'Mike Reyes',
    domain: 'retail',
    status: 'completed',
    createdAt: now - 2 * HOUR,
    updatedAt: now - 30 * MIN,
  },
  {
    id: 'mt-staples-5',
    bundleId: 'mtg-staples-qbr',
    valueCents: 15_000,
    valueKind: 'info',
    valueCaption: 'informational - internal follow-up',
    valueBasis: 'Recap and next steps for internal circulation before Friday.',
    insight: 'Circulate meeting recap to internal Slack.',
    actionVerb: 'Circulate recap',
    owner: 'You Own',
    domain: 'cs',
    status: 'open',
    createdAt: now - 2 * HOUR,
    updatedAt: now - 2 * HOUR,
  },
  {
    id: 'mt-perf-1',
    bundleId: 'mtg-weekly-perf',
    valueCents: 482_000,
    valueKind: 'gain',
    cadence: 'monthly',
    valueCaption: 'monthly reclaimable spend',
    valueBasis:
      'Reclaims 22% wasted spend on Winter Push; Launch S4 has 4.1x ROAS ceiling with $2.4k/day headroom.',
    insight: 'Reallocate Winter Push budget to Launch S4 - 22% wasted spend recovery.',
    actionVerb: 'Reallocate',
    owner: 'You Own',
    domain: 'campaign',
    status: 'with_aan',
    createdAt: now - 26 * HOUR,
    updatedAt: now - 5 * HOUR,
  },
  {
    id: 'mt-perf-2',
    bundleId: 'mtg-weekly-perf',
    valueCents: 180_000,
    valueKind: 'gain',
    cadence: 'monthly',
    valueCaption: 'monthly efficiency lift',
    valueBasis: 'Cuts post-10pm spend on 8 evergreen campaigns; preserves 96% of conversions.',
    insight: 'Tighten Evergreen day-parting after 10pm on 8 campaigns.',
    actionVerb: 'Tighten day-parting',
    owner: 'Rahul Menon',
    domain: 'campaign',
    status: 'open',
    createdAt: now - 26 * HOUR,
    updatedAt: now - 26 * HOUR,
  },
  {
    id: 'mt-perf-3',
    bundleId: 'mtg-weekly-perf',
    valueCents: 62_000,
    valueKind: 'gain',
    cadence: 'monthly',
    valueCaption: 'monthly negatives lift',
    valueBasis: 'Adds 142 candidate negatives on Evergreen from the last 21 days of search terms; cuts wasted spend ~$62k/mo.',
    insight: 'Refresh negative keywords on Evergreen - 142 candidates from last 21 days.',
    actionVerb: 'Add negatives',
    owner: 'Rahul Menon',
    domain: 'campaign',
    status: 'open',
    createdAt: now - 26 * HOUR,
    updatedAt: now - 26 * HOUR,
  },
  {
    id: 'mt-perf-4',
    bundleId: 'mtg-weekly-perf',
    valueCents: 24_000,
    valueKind: 'info',
    valueCaption: 'informational - review cadence',
    valueBasis: 'Team wants a shared weekly readout Friday morning.',
    insight: 'Set up shared weekly perf readout every Friday 9am.',
    actionVerb: 'Set cadence',
    owner: 'You Own',
    domain: 'campaign',
    status: 'completed',
    createdAt: now - 26 * HOUR,
    updatedAt: now - 24 * HOUR,
  },
  {
    id: 'mt-perf-5',
    bundleId: 'mtg-weekly-perf',
    valueCents: 96_000,
    valueKind: 'at_risk',
    cadence: 'monthly',
    valueCaption: 'monthly brand-defense exposure',
    valueBasis: 'Brand-defense on secondary term slipping - impression share down 12pt vs baseline.',
    insight: 'Raise bids on secondary brand-defense term - impression share slipped 12pt.',
    actionVerb: 'Raise bids',
    owner: 'Priya Shah',
    domain: 'campaign',
    status: 'open',
    createdAt: now - 26 * HOUR,
    updatedAt: now - 26 * HOUR,
  },
  {
    id: 'mt-amz-1',
    bundleId: 'mtg-amazon-sync',
    valueCents: 145_000,
    valueKind: 'gain',
    cadence: 'monthly',
    valueCaption: 'monthly review-halo lift',
    valueBasis: 'Vine enrollment on 4 hero SKUs before Nov cutoff - 10 units each; drives ~12% CVR lift once reviews land.',
    insight: 'Enroll 4 hero SKUs in Vine before the Nov cutoff.',
    actionVerb: 'Enroll Vine',
    owner: 'Nora Kim',
    domain: 'retail',
    status: 'open',
    transcriptExcerpt: 'Ari: You have Vine gaps on 4 hero SKUs - enroll before the Nov cutoff.',
    createdAt: now - 4 * HOUR,
    updatedAt: now - 4 * HOUR,
  },
  {
    id: 'mt-amz-2',
    bundleId: 'mtg-amazon-sync',
    valueCents: 240_000,
    valueKind: 'gain',
    cadence: 'monthly',
    valueCaption: 'monthly DSP retargeting lift',
    valueBasis: 'Push AMC-derived custom audience to DSP for 3 hero campaigns; historical lift ~14% on comparable audiences.',
    insight: 'Push refreshed AMC audience into DSP for 3 hero campaigns.',
    actionVerb: 'Push audience',
    owner: 'Priya Shah',
    domain: 'campaign',
    status: 'open',
    createdAt: now - 4 * HOUR,
    updatedAt: now - 4 * HOUR,
  },
  {
    id: 'mt-amz-3',
    bundleId: 'mtg-amazon-sync',
    valueCents: 380_000,
    valueKind: 'at_risk',
    valueCaption: 'Prime-day-lite window',
    valueBasis: 'Coupons on hero SKUs must be locked by Nov 8; the Nov 12 window drives ~$380k/mo of promo lift historically.',
    insight: 'Lock hero SKU coupons for the Prime-day-lite window by Nov 8.',
    actionVerb: 'Lock coupons',
    owner: 'You Own',
    domain: 'campaign',
    status: 'open',
    createdAt: now - 4 * HOUR,
    updatedAt: now - 4 * HOUR,
  },
  {
    id: 'mt-amz-4',
    bundleId: 'mtg-amazon-sync',
    valueCents: 62_000,
    valueKind: 'cost',
    cadence: 'one_time',
    valueCaption: 'one-time ops cost',
    valueBasis: 'Give ops 10-day heads-up so warehouse can support +30% velocity on hero SKUs.',
    insight: 'Give Kai 10-day heads-up on hero SKU velocity spike.',
    actionVerb: 'Notify ops',
    owner: 'Kai Larsen',
    domain: 'inventory',
    status: 'open',
    createdAt: now - 4 * HOUR,
    updatedAt: now - 4 * HOUR,
  },
  {
    id: 'mt-ops-1',
    bundleId: 'mtg-ops-standup',
    valueCents: 124_000,
    valueKind: 'cost',
    cadence: 'one_time',
    valueCaption: 'one-time refund cost',
    valueBasis: 'Same batch #B-2214 as the CS escalation - refund 3 orders to close the loop.',
    insight: 'Approve refunds on 3 orders from damaged batch #B-2214.',
    actionVerb: 'Approve refunds',
    owner: 'You Own',
    domain: 'cs',
    status: 'open',
    createdAt: now - 50 * HOUR,
    updatedAt: now - 50 * HOUR,
  },
  {
    id: 'mt-ops-2',
    bundleId: 'mtg-ops-standup',
    valueCents: 32_000,
    valueKind: 'gain',
    cadence: 'one_time',
    valueCaption: 'one-time carrier recovery',
    valueBasis: 'Kai files carrier claim on Reno lane with Sam damage photos as evidence.',
    insight: 'File carrier claim on Reno lane batch #B-2214.',
    actionVerb: 'File claim',
    owner: 'Kai Larsen',
    domain: 'profitability',
    status: 'open',
    createdAt: now - 50 * HOUR,
    updatedAt: now - 50 * HOUR,
  },
  {
    id: 'mt-ops-3',
    bundleId: 'mtg-ops-standup',
    valueCents: 0,
    valueKind: 'info',
    valueCaption: 'informational - hygiene',
    valueBasis: '30-day watch on Reno lane to catch further failures early.',
    insight: 'Flag Reno 3PL lane for 30-day damage watch.',
    actionVerb: 'Flag lane',
    owner: 'You Own',
    domain: 'inventory',
    status: 'open',
    createdAt: now - 50 * HOUR,
    updatedAt: now - 50 * HOUR,
  },
];