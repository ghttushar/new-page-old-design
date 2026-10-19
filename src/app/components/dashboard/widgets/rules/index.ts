import type { Option, WidgetDefinition } from '../../dashboard.types';
import { ENTITY, RULE, RULE_COMPARE_METRICS, RULE_TYPES } from './data';
import { RuleCompare, RuleImpact, readImpact, readRuleCompare } from './rule-nuggets';

// Nuggets built from Rules: what a rule changes against a baseline, and how two rules of a kind compare.
// Each picks its own sides, metrics and view inside the nugget; the header holds the date range.

const RANGES: Option[] = [
  { value: '7', label: 'Last 7 days' },
  { value: '14', label: 'Last 14 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '60', label: 'Last 60 days' },
];

const RULES_LINK = { label: 'Open applied rules', to: '/rules/applied-rules' };

export const RULES_WIDGETS: WidgetDefinition[] = [
  {
    kind: 'rule-impact',
    title: 'Rule impact',
    category: 'Rules',
    summary: 'Any campaign, keyword, target or ASIN with its rule, against a baseline without it.',
    dataPoints: ['Campaigns', 'Keywords', 'Targets', 'ASINs', '10 ad metrics'],
    size: { w: 8, h: 10, minW: 4, minH: 7 },
    defaults: { range: '7', a: 'c-summer', b: 'c-summer', metrics: ['roas'], viz: 'line' },
    header: { key: 'range', label: 'Date range', options: RANGES },
    fields: [],
    describe: (config) => {
      const c = readImpact(config);
      const rule = RULE[ENTITY[c.a].ruleId]?.name;
      return c.a === c.b ? `${ENTITY[c.a].name} · ${rule}` : `${ENTITY[c.a].name} vs ${ENTITY[c.b].name}`;
    },
    link: RULES_LINK,
    Body: RuleImpact,
  },
  {
    kind: 'rule-compare',
    title: 'Rule vs rule',
    category: 'Rules',
    summary: 'Two rules or templates of the same type, side by side on shared metrics.',
    dataPoints: ['Rules', 'Templates', 'Ad spend', 'ROAS', 'ACOS', 'CVR', 'CTR'],
    size: { w: 8, h: 10, minW: 4, minH: 7 },
    defaults: { range: '30', ruleType: 'bidding', a: 'bid-conservative', b: 'bid-aggressive', metrics: RULE_COMPARE_METRICS, viz: 'table' },
    header: { key: 'range', label: 'Date range', options: RANGES },
    fields: [],
    describe: (config) => {
      const c = readRuleCompare(config);
      return `${RULE_TYPES.find((t) => t.id === c.ruleType)?.label} · ${RULE[c.a].name} vs ${RULE[c.b].name}`;
    },
    link: RULES_LINK,
    Body: RuleCompare,
  },
];
