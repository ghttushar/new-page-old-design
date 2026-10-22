import { useMemo, type ReactNode } from 'react';
import type { WidgetBodyProps, WidgetConfig } from '../../dashboard.types';
import { MetricSelect, RangeSelect, SideButton, VizSelect, type PickItem } from './compare-controls';
import {
  ENTITIES, ENTITY, ENTITY_TYPES, METRICS, RANGE_DAYS, RULE, RULES, RULE_COMPARE_METRICS, RULE_TYPES, entitySeries, rulesOfType, ruleSeries,
  type MetricId, type RangeId, type RuleDef, type RuleType,
} from './data';
import { CompareView, type VizId } from './rule-compare-views';
import styles from '../../dashboard.module.scss';

export const COLOR_A = '#77469b';
const COLOR_BASELINE = '#9aa1ad';
const COLOR_B = '#3d7ea6';

const ALL_METRICS = METRICS.map((m) => m.id);
const ENTITY_GROUPS = ENTITY_TYPES.map((t) => ({ value: t.id, label: t.label }));
const ENTITY_ITEMS: PickItem[] = ENTITIES.map((x) => ({ id: x.id, name: x.name, detail: x.detail, group: x.type }));
const RULE_GROUPS = [{ value: 'bidding', label: 'Bidding' }, { value: 'budget', label: 'Budget' }, { value: 'daypart', label: 'Dayparting' }, { value: 'harvest', label: 'Harvesting' }];
const RULE_ITEMS: PickItem[] = RULES.map((r) => ({ id: r.id, name: r.name, detail: r.detail, group: r.type, tag: r.kind }));

export interface ImpactConfig { range: RangeId; a: string; b: string; metrics: MetricId[]; viz: VizId }
export interface RuleCompareConfig { range: RangeId; ruleType: RuleType; a: string; b: string; metrics: MetricId[]; viz: VizId }

export function readImpact(c: WidgetConfig): ImpactConfig {
  const metrics = ((c.metrics as MetricId[]) ?? ['roas']).filter((m) => ALL_METRICS.includes(m));
  return {
    range: (c.range as RangeId) ?? '7',
    a: ENTITY[c.a as string] ? (c.a as string) : 'c-summer',
    b: ENTITY[c.b as string] ? (c.b as string) : 'c-summer',
    metrics: metrics.length ? metrics : ['roas'],
    viz: (c.viz as VizId) ?? 'line',
  };
}

export function readRuleCompare(c: WidgetConfig): RuleCompareConfig {
  const ruleType = (c.ruleType as RuleType) ?? 'bidding';
  const list = rulesOfType(ruleType);
  const fits = (id: unknown) => typeof id === 'string' && RULE[id]?.type === ruleType;
  const metrics = ((c.metrics as MetricId[]) ?? RULE_COMPARE_METRICS).filter((m) => RULE_COMPARE_METRICS.includes(m));
  return {
    range: (c.range as RangeId) ?? '30',
    ruleType,
    a: fits(c.a) ? (c.a as string) : list[0].id,
    b: fits(c.b) ? (c.b as string) : (list[1] ?? list[0]).id,
    metrics: metrics.length ? metrics : RULE_COMPARE_METRICS,
    viz: (c.viz as VizId) ?? 'table',
  };
}

/**
 * Every control on one strip: what is compared (the two sides) on the left, how to look at it (metrics, view, dates) on
 * the right. On a narrow nugget the right half wraps under the sides.
 */
function ControlStrip({ sides, options, metrics, viz, range, onConfig, preview }: {
  sides: ReactNode; options: MetricId[]; metrics: MetricId[]; viz: VizId; range: RangeId; onConfig: WidgetBodyProps['onConfig']; preview?: boolean;
}) {
  return (
    <div className={styles.rcStrip}>
      <div className={styles.rcSides}>{sides}</div>
      <div className={styles.rcDrops}>
        <MetricSelect options={options} value={metrics} onChange={(m) => onConfig({ metrics: m })} preview={preview} />
        <VizSelect value={viz} onChange={(v) => onConfig({ viz: v })} preview={preview} />
        <RangeSelect value={range} onChange={(r) => onConfig({ range: r })} preview={preview} />
      </div>
    </div>
  );
}

/** One entity with its rule against an entity's baseline without it (the same one before the rule, or any other). */
export function RuleImpact({ config, onConfig, preview }: WidgetBodyProps) {
  const c = readImpact(config);
  const ea = ENTITY[c.a];
  const eb = ENTITY[c.b];
  const rule = RULE[ea.ruleId];
  const days = RANGE_DAYS[c.range];
  const aDays = useMemo(() => entitySeries(c.a, 'with', c.range), [c.a, c.range]);
  const bDays = useMemo(() => entitySeries(c.b, 'without', c.range), [c.b, c.range]);
  const bCaption = c.a === c.b ? `Without rule, prior ${days} days` : `Without rule, ${ENTITY_TYPES.find((t) => t.id === eb.type)?.label.toLowerCase()} before its rule`;

  return (
    <div className={styles.rc}>
      <ControlStrip
        options={ALL_METRICS} metrics={c.metrics} viz={c.viz} range={c.range} onConfig={onConfig} preview={preview}
        sides={(
          <>
            <SideButton letter="A" label="With rule" caption={`With ${rule?.name ?? 'rule'}`} color={COLOR_A} items={ENTITY_ITEMS} groups={ENTITY_GROUPS} value={c.a} onPick={(id) => onConfig({ a: id })} preview={preview} />
            <span className={styles.rcVs} aria-hidden>vs</span>
            <SideButton letter="B" label="Baseline" caption={bCaption} color={COLOR_BASELINE} items={ENTITY_ITEMS} groups={ENTITY_GROUPS} value={c.b} onPick={(id) => onConfig({ b: id })} preview={preview} />
          </>
        )}
      />
      <div className={styles.rcView}>
        <CompareView
          viz={c.viz} metrics={c.metrics} tone="impact" preview={preview}
          a={{ label: 'With rule', color: COLOR_A, days: aDays }}
          b={{ label: 'Baseline', color: COLOR_BASELINE, dashed: true, days: bDays }}
        />
      </div>
    </div>
  );
}

const ruleCaption = (r: RuleDef) => `${RULE_TYPES.find((t) => t.id === r.type)?.label} ${r.kind.toLowerCase()}`;

/** Two rules or templates of the same type, on the account over the same window. */
export function RuleCompare({ config, onConfig, preview }: WidgetBodyProps) {
  const c = readRuleCompare(config);
  const ra = RULE[c.a];
  const rb = RULE[c.b];
  const aDays = useMemo(() => ruleSeries(c.a, c.range), [c.a, c.range]);
  const bDays = useMemo(() => ruleSeries(c.b, c.range), [c.b, c.range]);

  // Both sides stay the same type: picking a rule of another type moves the other side to that type too.
  const pick = (side: 'a' | 'b', id: string) => {
    const otherSide = side === 'a' ? 'b' : 'a';
    const type = RULE[id].type;
    if (RULE[c[otherSide]].type === type) { onConfig({ [side]: id }); return; }
    const next = rulesOfType(type).find((r) => r.id !== id) ?? RULE[id];
    onConfig({ ruleType: type, [side]: id, [otherSide]: next.id });
  };

  return (
    <div className={styles.rc}>
      <ControlStrip
        options={RULE_COMPARE_METRICS} metrics={c.metrics} viz={c.viz} range={c.range} onConfig={onConfig} preview={preview}
        sides={(
          <>
            <SideButton letter="A" label={ra.kind} caption={ruleCaption(ra)} color={COLOR_A} items={RULE_ITEMS} groups={RULE_GROUPS} value={c.a} onPick={(id) => pick('a', id)} preview={preview} />
            <span className={styles.rcVs} aria-hidden>vs</span>
            <SideButton letter="B" label={rb.kind} caption={ruleCaption(rb)} color={COLOR_B} items={RULE_ITEMS} groups={RULE_GROUPS} value={c.b} onPick={(id) => pick('b', id)} preview={preview} />
          </>
        )}
      />
      <div className={styles.rcView}>
        <CompareView
          viz={c.viz} metrics={c.metrics} tone="neutral" preview={preview}
          a={{ label: ra.name, color: COLOR_A, days: aDays }}
          b={{ label: rb.name, color: COLOR_B, days: bDays }}
        />
      </div>
    </div>
  );
}
