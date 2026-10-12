import { ILogsData } from '@/interfaces/logs/logs.interface';
import { LOGS_CSV_ROWS } from './logs-mock-csv';

// Sample rows, one for each kind of log. The Logs page shows these while the change-log
// endpoint returns nothing, so the four layouts can be reviewed. Set SHOW_SAMPLE_LOGS to false to turn them off.

const CAMPAIGN_NAMES = [
  'Anarix_B07XK2_SP_Auto',
  'Anarix_B07XK2_SP_Exact',
  'Anarix_B08LM9_SP_Broad',
  'Anarix_B08LM9_SP_Auto',
  'Anarix_B09QR4_SP_Phrase',
  'Anarix_B09QR4_SP_Competitor',
  'Anarix_B0A1ZT_SP_Brand',
  'Anarix_B0A1ZT_SP_Research',
  'Anarix_B0B7DN_SP_Auto',
  'Anarix_B0B7DN_SP_Exact',
];

const BULK_CHANGES = Array.from({ length: 100 }, (_, i) => {
  const before = 20 + ((i * 7) % 11) * 5;
  const name = CAMPAIGN_NAMES[i % CAMPAIGN_NAMES.length];
  return {
    id: `camp-${4800 + i}`,
    name: `${name}_${String(Math.floor(i / CAMPAIGN_NAMES.length) + 1).padStart(2, '0')}`,
    fieldName: 'Daily budget',
    from: `$${before.toFixed(2)}`,
    to: `$${(before * 1.2).toFixed(2)}`,
  };
});

const WHERE = {
  accountId: '6527f0a6be26660071c5dfac',
  marketplace: 'amazon',
  metaId: '3952157817071136',
  metaType: 'AMAZON_PROFILE_ID',
};

const FIRST_ROWS: ILogsData[] = [
  {
    logId: 'mock-single',
    logType: 'SINGLE_EDIT',
    ...WHERE,
    entityType: 'KEYWORD',
    entityName: 'whey protein isolate',
    entityId: 'kw-8812',
    action: 'UPDATE',
    fieldName: 'Bid',
    previousValue: '$0.85',
    value: '$1.05',
    editSource: 'campaign_manager',
    service: 'advertising',
    userName: 'Tushar G',
    timestamp: '2026-10-12T09:42:00Z',
  },
  {
    logId: 'mock-bulk',
    logType: 'BULK_EDIT',
    ...WHERE,
    entityType: 'CAMPAIGN',
    entityName: '100 campaigns',
    action: 'UPDATE',
    fieldName: 'Daily budget',
    editSource: 'campaign_manager',
    service: 'advertising',
    userName: 'Tushar G',
    timestamp: '2026-10-12T08:15:00Z',
    bulkChanges: BULK_CHANGES,
  },
  {
    logId: 'mock-create',
    logType: 'CREATE',
    ...WHERE,
    entityType: 'CAMPAIGN',
    entityName: 'Anarix_B07XK2_SP_Exact',
    entityId: 'camp-5120',
    action: 'CREATE',
    editSource: 'campaign_creator',
    service: 'advertising',
    userName: 'Tushar G',
    timestamp: '2026-10-11T17:30:00Z',
    createdTable: {
      columns: ['Campaign', 'Ad type', 'Daily budget', 'Bidding strategy', 'Targeting', 'Status'],
      rows: [['Anarix_B07XK2_SP_Exact', 'Sponsored Products', '$55.00', 'Fixed bids', 'Keyword · Exact', 'Enabled']],
    },
  },
  {
    logId: 'mock-create-slack',
    logType: 'CREATE',
    ...WHERE,
    entityType: 'CAMPAIGN',
    entityName: 'Anarix_B08LM9_SP_Broad',
    entityId: 'camp-5133',
    action: 'CREATE',
    editSource: 'slack_bot_campaign_creator',
    service: 'advertising',
    userName: 'Tushar G',
    timestamp: '2026-10-11T12:10:00Z',
    createdTable: {
      columns: ['Campaign', 'Ad type', 'Daily budget', 'Bidding strategy', 'Targeting', 'Status'],
      rows: [['Anarix_B08LM9_SP_Broad', 'Sponsored Products', '$40.00', 'Fixed bids', 'Keyword · Broad', 'Enabled']],
    },
  },
  {
    logId: 'mock-create-rule',
    logType: 'CREATE',
    ...WHERE,
    entityType: 'RULE',
    entityName: 'Pause campaigns above 45% ACOS',
    entityId: 'rule-31',
    action: 'CREATE',
    editSource: 'claude_rules',
    service: 'rules',
    userName: 'Tushar G',
    timestamp: '2026-10-10T14:05:00Z',
    createdTable: {
      columns: ['Rule', 'Applies to', 'Condition', 'Action', 'Frequency', 'Status'],
      rows: [
        ['Pause campaigns above 45% ACOS', 'All campaigns', 'ACOS > 45% (last 7 days)', 'Pause campaign', 'Daily', 'Enabled'],
      ],
    },
  },
  {
    logId: 'mock-execute',
    logType: 'EXECUTE',
    ...WHERE,
    entityType: 'RULE',
    entityName: 'Pause campaigns above 45% ACOS',
    entityId: 'rule-31',
    action: 'EXECUTE',
    editSource: 'slack_bot_rules',
    service: 'rules',
    userName: 'System',
    timestamp: '2026-10-11T06:00:00Z',
    executeTarget: { kind: 'RULE', id: 'rule-31', name: 'Pause campaigns above 45% ACOS' },
  },
];

/** The hand-made rows first, then every row of the change-log CSV. */
export const LOGS_MOCK_ROWS: ILogsData[] = [...FIRST_ROWS, ...LOGS_CSV_ROWS];

