import { ICreatedTable, ILogsData } from '@/interfaces/logs/logs.interface';
import csv from './logs-mock-data/core_change_logs.csv?raw';

// The sample rows of the change-log export (core_change_logs), read straight from the CSV so every row is kept.

/** Reads CSV text, including quoted fields with commas and doubled quotes. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i += 1;
      row.push(field);
      field = '';
      if (row.some((cell) => cell !== '')) rows.push(row);
      row = [];
    } else field += ch;
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/** meta_data is stored as {key=value, key=value}; the values can hold commas, so split on the keys. */
function parseMeta(raw: string): Record<string, string> {
  const body = raw.trim().replace(/^\{/, '').replace(/\}$/, '');
  const keys = [...body.matchAll(/(?:^|, )([A-Za-z][\w.]*)=/g)];
  const meta: Record<string, string> = {};
  keys.forEach((match, i) => {
    const start = (match.index ?? 0) + match[0].length;
    const end = i + 1 < keys.length ? keys[i + 1].index ?? body.length : body.length;
    meta[match[1]] = body.slice(start, end);
  });
  return meta;
}

const countOf = (list?: string) => {
  try {
    const n = (JSON.parse(list ?? '[]') as unknown[]).length;
    return `${n} campaign${n === 1 ? '' : 's'}`;
  } catch {
    return '-';
  }
};

const day = (iso?: string) => (iso ? iso.slice(0, 10) : '-');

/** What a created dayparting job was made with, as table data. */
function createdJob(meta: Record<string, string>): ICreatedTable | undefined {
  if (!meta.title) return undefined;
  return {
    columns: ['Job', 'Campaigns', 'Bid change', 'Repeats', 'Schedule', 'Runs', 'Time zone', 'Status'],
    rows: [
      [
        meta.title,
        countOf(meta.campaigns),
        meta['bidChange.type']
          ? `${meta['bidChange.type'].toLowerCase()} ${meta['bidChange.percentage']}%`
          : '-',
        meta['recurrence.type'] ?? '-',
        meta['schedules.type'] ?? '-',
        `${day(meta.startDate)} to ${day(meta.endDate)}`,
        meta.timeZone ?? '-',
        meta.jobStatus ?? '-',
      ],
    ],
  };
}

const [header, ...records] = parseCsv(csv);
const col = (name: string) => header.indexOf(name);

export const LOGS_CSV_ROWS: ILogsData[] = records.map((r) => {
  const get = (name: string) => r[col(name)] ?? '';
  const meta = parseMeta(get('meta_data'));
  const action = get('action');
  const entityId = get('entity_id');
  const changedAt = get('changed_at');

  return {
    logId: get('id'),
    logType: action === 'CREATE' ? 'CREATE' : 'SINGLE_EDIT',
    accountId: get('account_id'),
    marketplace: get('marketplace'),
    metaId: get('meta_id'),
    metaType: get('meta_type'),
    service: get('service'),
    entityType: get('entity_type'),
    entityId,
    entityName: meta.title || entityId,
    action,
    fieldName: get('field_name'),
    value: get('value'),
    previousValue: get('previous_value'),
    editSource: get('edit_source'),
    userId: get('user_id'),
    changedAt,
    timestamp: `${changedAt.replace(' ', 'T')}Z`,
    metaData: Object.keys(meta).length ? meta : undefined,
    createdTable: action === 'CREATE' ? createdJob(meta) : undefined,
  };
});
