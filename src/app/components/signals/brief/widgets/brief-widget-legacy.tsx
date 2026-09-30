import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BRIEF_MESSAGES, DASHBOARD_METRICS, JIVA_ACTIVITY, MEETING_LIST, PROTOTYPE_ALERTS } from '@/constants/signals/prototype-data';
import { CloseIcon, PlusIcon } from '../../alerts/icons';
import { SourceIcon } from '../../alerts/source-icon';
import motion from '../../alerts/motion.module.scss';
import scrollStyles from '../../alerts/alerts-scroll.module.scss';
import { DonutChart, type DonutDatum } from './brief-widget-charts';

/**
 * The original Brief page's key-stats row and "while you were away" feed, ported to live as two
 * default widgets instead of one fixed page. All 5 stat cards are clickable: the clicked card gets
 * a raised border/shadow so it's clear what you opened, and its detail renders inline directly below
 * the row (within this widget's own scroll area, not a page-level modal) — so nothing outside this
 * one widget ever shifts. Cards can also be dragged into one another to merge onto a shared
 * background, and each has its own "edit with Jiva" recolor/rename popover.
 */

function BellIcon({ color }: { color: string }) {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5c-.5 0-1 .4-1 1v.6C4.9 3.6 3.5 5.5 3.5 7.7v2.6L2 12.5h12l-1.5-2.2V7.7c0-2.2-1.4-4.1-3.5-4.6v-.6c0-.6-.5-1-1-1z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" /><path d="M6.3 12.5a1.7 1.7 0 0 0 3.4 0" stroke={color} strokeWidth="1.3" strokeLinecap="round" /></svg>;
}
function TrendUpIcon({ color }: { color: string }) {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 11l4-4.5 3 2.5 5-6" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M10.5 3h3.5v3.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function ShieldCheckIcon({ color }: { color: string }) {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5l5 1.8v4.2c0 3.3-2.1 5.9-5 6.9-2.9-1-5-3.6-5-6.9V3.3L8 1.5z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" /><path d="M5.7 8l1.6 1.6L10.4 6" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function CalendarIconFilled({ color }: { color: string }) {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10.5" rx="1.5" stroke={color} strokeWidth="1.3" /><path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" stroke={color} strokeWidth="1.3" strokeLinecap="round" /></svg>;
}
function EnvelopeIconFilled({ color }: { color: string }) {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3" width="13" height="10" rx="1.3" stroke={color} strokeWidth="1.3" /><path d="M2 4l6 5 6-5" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function ChevronRightIcon({ color = 'currentColor' }: { color?: string }) {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 3.5l5 4.5-5 4.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function CheckGlyph({ color }: { color: string }) {
  return <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8.2l3.3 3.3L13 4.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function ClockGlyph({ color }: { color: string }) {
  return <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.2" stroke={color} strokeWidth="1.3" /><path d="M8 4.6V8l2.6 1.6" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function PieChartIcon({ color }: { color: string }) {
  return <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.3" stroke={color} strokeWidth="1.3" /><path d="M8 8V1.7A6.3 6.3 0 0 1 14.3 8z" fill={color} /></svg>;
}
const TODAY_ALERTS = PROTOTYPE_ALERTS.filter((a) => a.day === 'today');
const CRITICAL_TODAY = TODAY_ALERTS.filter((a) => a.priority === 'High');
const AT_RISK_TOTAL = TODAY_ALERTS.filter((a) => a.valueNum < 0).reduce((sum, a) => sum + Math.abs(a.valueNum), 0);
const OPPORTUNITY_TOTAL = JIVA_ACTIVITY.filter((j) => j.status === 'done' && j.impact?.startsWith('+')).reduce((sum, j) => sum + (parseInt(j.impact!.replace(/[^0-9]/g, ''), 10) || 0), 0);
const MEETINGS_TODAY = MEETING_LIST.filter((m) => m.isToday);
const UNREAD_MESSAGES = BRIEF_MESSAGES.filter((m) => m.unread);
const IMPORTANT_MESSAGES = UNREAD_MESSAGES.length;

function formatCompactDollars(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M`;
  if (n >= 1_000) return `$${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return `$${n.toLocaleString()}`;
}

function formatPct(pct: number): string {
  if (pct >= 10) return `${Math.round(pct)}%`;
  return `${pct.toFixed(1)}%`;
}

function pctOf(value: number, total: number): number {
  return total > 0 ? (value / total) * 100 : 0;
}

const ALERT_CATEGORY_COLORS: Record<string, string> = {
  Profitability: '#FEBC2A', Compliance: '#F3465D', Catalog: '#7450ED', Advertising: '#2685FC',
  Inventory: '#1DCBCB', Billing: '#0AA542', Reviews: '#EDC948', Operations: '#B07858',
};

type BreakdownItem = DonutDatum;

function bifurcateByCategory(entries: { category: string; value: number }[]): BreakdownItem[] {
  const byCategory = new Map<string, number>();
  entries.forEach((e) => byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.value));
  return Array.from(byCategory.entries())
    .map(([label, value]) => ({ label, value, color: ALERT_CATEGORY_COLORS[label] ?? '#77469b' }))
    .sort((a, b) => b.value - a.value);
}

const AT_RISK_BY_CATEGORY: BreakdownItem[] = bifurcateByCategory(
  TODAY_ALERTS.filter((a) => a.valueNum < 0).map((a) => ({ category: a.category, value: Math.abs(a.valueNum) }))
);
const OPPORTUNITY_BY_CATEGORY: BreakdownItem[] = bifurcateByCategory(
  JIVA_ACTIVITY.filter((j) => j.status === 'done' && j.impact?.startsWith('+')).map((j) => ({ category: j.category, value: parseInt(j.impact!.replace(/[^0-9]/g, ''), 10) || 0 }))
);

/** A donut with its total centered in the hole — the same DonutChart Action Mix uses, just wrapped so a total can sit inside it like the old hand-drawn pie used to. */
function DonutWithCenter({ items, centerValue, centerLabel, size = 160, activeIndex, onSliceHover }: { items: BreakdownItem[]; centerValue: string; centerLabel: string; size?: number; activeIndex?: number | null; onSliceHover?: (i: number | null) => void }) {
  return (
    <div style={{ width: size, height: size, position: 'relative' as const, flex: 'none' }}>
      <DonutChart data={items} activeIndex={activeIndex} onSliceHover={onSliceHover} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' as const }}>
        <div style={{ font: '700 17px/1 Inter,sans-serif', color: '#111827' }}>{centerValue}</div>
        <div style={{ font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8', marginTop: 4 }}>{centerLabel}</div>
      </div>
    </div>
  );
}

type StatKey = string;

interface StatMeta {
  iconBg: string; iconColor: string; icon: (color: string) => React.ReactNode; label: string; value: string;
  valueColor?: string; trendLabel?: string; trendBg?: string; trendColor?: string;
  /** Only the five original alert-derived stats have a category breakdown to expand into — the
   * platform-metric add-ons (below) are a plain value+trend tile, nothing to click into. */
  expandable?: boolean;
}

const FIXED_STAT_META: Record<string, StatMeta> = {
  critical: { iconBg: '#eef2fb', iconColor: '#4a6cf7', icon: (c) => <BellIcon color={c} />, label: 'Critical alerts', value: String(CRITICAL_TODAY.length), expandable: true },
  atRisk: { iconBg: '#fdecec', iconColor: '#e74c3c', icon: (c) => <TrendUpIcon color={c} />, label: 'At risk', value: `$${AT_RISK_TOTAL.toLocaleString()}`, valueColor: '#e74c3c', expandable: true },
  opportunity: { iconBg: '#e9f7ef', iconColor: '#27ae60', icon: (c) => <ShieldCheckIcon color={c} />, label: 'Opportunity', value: `$${OPPORTUNITY_TOTAL.toLocaleString()}`, valueColor: '#27ae60', trendLabel: '+8%', trendBg: '#d1f2df', trendColor: '#1e8449', expandable: true },
  meetings: { iconBg: '#f1eefc', iconColor: '#7c4dff', icon: (c) => <CalendarIconFilled color={c} />, label: 'Meetings today', value: String(MEETINGS_TODAY.length), expandable: true },
  messages: { iconBg: '#eaf2fd', iconColor: '#2f6fed', icon: (c) => <EnvelopeIconFilled color={c} />, label: 'Important messages', value: String(IMPORTANT_MESSAGES), expandable: true },
};

function MetricGlyphIcon({ color }: { color: string }) {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 13V7M8 13V3M13 13V9" stroke={color} strokeWidth="1.6" strokeLinecap="round" /></svg>;
}

/** The rest of the predefined stat library — real platform metrics (spend, sales, efficiency,
 * traffic) a user can add onto the row alongside the original five. Sourced straight from
 * DASHBOARD_METRICS, the same numbers every other Brief metric widget already shows, so this needed
 * no bespoke mock data of its own. */
const METRIC_STAT_META: Record<string, StatMeta> = Object.fromEntries(
  DASHBOARD_METRICS.map((m) => [
    `metric:${m.id}`,
    {
      iconBg: `${m.color}17`, iconColor: m.color, icon: (c: string) => <MetricGlyphIcon color={c} />,
      label: m.label, value: m.value, trendLabel: m.trend, trendBg: m.trendUp ? '#d1f2df' : '#fdecec', trendColor: m.trendUp ? '#1e8449' : '#b3453f',
    } satisfies StatMeta,
  ]),
);

const STAT_META: Record<string, StatMeta> = { ...FIXED_STAT_META, ...METRIC_STAT_META };
/** Library order for the "add a stat" picker — the five defaults first, then the metric add-ons. */
const STAT_LIBRARY_IDS: string[] = [...Object.keys(FIXED_STAT_META), ...Object.keys(METRIC_STAT_META)];
const DEFAULT_VISIBLE_STAT_IDS: string[] = ['critical', 'atRisk', 'opportunity', 'meetings', 'messages'];

/** Portaled picker for adding a not-yet-visible stat onto the row — same floating-panel-from-
 * document.body pattern as the expansion popover below, so it never gets clipped by the grid cell. */
function AddStatPopover({ available, anchorRect, onAdd, onClose }: { available: string[]; anchorRect: DOMRect; onAdd: (id: string) => void; onClose: () => void }) {
  const width = 230;
  const top = anchorRect.bottom + 6;
  const left = Math.max(8, Math.min(anchorRect.left, window.innerWidth - width - 8));
  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 239 }} onClick={onClose} />
      <div
        className={motion.popInTop}
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'fixed', top, left, width, maxHeight: 280, overflowY: 'auto', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, boxShadow: '0 14px 32px rgba(20,24,33,.2)', padding: 6, zIndex: 240 }}
      >
        <div style={{ padding: '6px 8px 8px', font: '600 10px/1 Inter,sans-serif', letterSpacing: '.06em', textTransform: 'uppercase' as const, color: '#9aa0a8' }}>Add a stat</div>
        {available.length === 0 && <div style={{ padding: '10px 8px', font: '400 12px/1.5 Inter,sans-serif', color: '#9aa0a8' }}>All stats are already on the row.</div>}
        {available.map((id) => {
          const meta = STAT_META[id];
          return (
            <div key={id} onClick={() => { onAdd(id); onClose(); }} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 9px', borderRadius: 7, cursor: 'pointer' }}>
              <span style={{ width: 22, height: 22, borderRadius: 6, background: meta.iconBg, color: meta.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{meta.icon(meta.iconColor)}</span>
              <span style={{ font: '500 12px/1.3 Inter,sans-serif', color: '#3d434b' }}>{meta.label}</span>
              <span style={{ marginLeft: 'auto', font: '600 12px/1 Inter,sans-serif', color: '#464646', flex: 'none' }}>{meta.value}</span>
            </div>
          );
        })}
      </div>
    </>,
    document.body,
  );
}

// ---- Expansion mechanism --------------------------------------------------------------------
// Every key stat expands the same way now: a small floating panel anchored right under the card
// that was clicked (the mechanism Meetings originally used, now generalized to all five) — never
// full-screen, never docked to an edge, so opening one never shifts or dims anything else on the
// page. Portaled to document.body: the widget grid clips each cell to its own grid-row height (so
// charts etc. don't spill into the widget below), which would otherwise clip a floating panel
// escaping via CSS position alone (the same class of bug the per-card edit popover hit earlier —
// see [[project_brief_widget_dashboard]]).

function PopoverReveal({ anchorRect, onClose, children }: { anchorRect: DOMRect | null; onClose: () => void; children: React.ReactNode }) {
  if (!anchorRect) return null;
  const width = 380;
  const top = anchorRect.bottom + 10;
  const left = Math.max(8, Math.min(anchorRect.left, window.innerWidth - width - 8));
  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 259 }} onMouseDown={onClose} />
      <div
        className={motion.popInTop}
        onMouseDown={(e) => e.stopPropagation()}
        style={{ position: 'fixed', top, left, width, maxHeight: '70vh', overflowY: 'auto', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 12, boxShadow: '0 18px 40px rgba(20,24,33,.22)', zIndex: 260 }}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}

function ExpansionHost({ statKey, anchorRect, onClose }: { statKey: StatKey; anchorRect: DOMRect | null; onClose: () => void }) {
  return (
    <PopoverReveal anchorRect={anchorRect} onClose={onClose}>
      <StatDetail statKey={statKey} onClose={onClose} />
    </PopoverReveal>
  );
}

// ---- Card + row ---------------------------------------------------------------------------------

function StatCardMember({ meta, expanded, onClick, onRemove }: { meta: StatMeta; expanded: boolean; onClick: (e: React.MouseEvent) => void; onRemove: (e: React.MouseEvent) => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ flex: 1, minWidth: 0, padding: '14px 16px', cursor: meta.expandable ? 'pointer' : 'default', position: 'relative' as const }}
    >
      <span
        onClick={(e) => { e.stopPropagation(); onRemove(e); }}
        className={motion.pressable}
        title="Remove from row"
        style={{ position: 'absolute', top: 8, right: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: 5, cursor: 'pointer', opacity: hovered ? 1 : 0, transition: 'opacity 120ms ease-out' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f2f4')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <CloseIcon size={9} color="#9aa0a8" />
      </span>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ width: 32, height: 32, borderRadius: 9, background: meta.iconBg, color: meta.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{meta.icon(meta.iconColor)}</span>
        {meta.expandable && (
          <span style={{ display: 'flex', color: expanded ? meta.iconColor : '#9aa0a8', transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 160ms ease-out, color 160ms ease-out' }}>
            <ChevronRightIcon color={expanded ? meta.iconColor : undefined} />
          </span>
        )}
      </div>
      <div style={{ font: '500 12px/1.3 Inter,sans-serif', color: '#4b5563', marginTop: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{meta.label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' as const }}>
        <span style={{ font: '700 21px/1 Inter,sans-serif', color: meta.valueColor || '#111827' }}>{meta.value}</span>
        {meta.trendLabel && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 7px', borderRadius: 999, background: meta.trendBg, font: '700 10.5px/1.5 Inter,sans-serif', color: meta.trendColor }}>
            {meta.trendLabel}
          </span>
        )}
      </div>
    </div>
  );
}

/** The original Brief page's key-stats row — a fixed, product-defined widget (no Jiva editing): the
 * only customization is choosing which predefined stats show, via the "+" tile's add picker and each
 * card's own hover-reveal remove button. The five original alert-derived stats still expand into
 * their own floating category-breakdown popover; the metric add-ons are plain value+trend tiles. */
export function LegacyKpiRow({ onExpandedChange }: { onExpandedChange?: (expanded: boolean) => void }) {
  const [expanded, setExpanded] = useState<StatKey | null>(null);
  const [expandRect, setExpandRect] = useState<DOMRect | null>(null);
  const [visibleIds, setVisibleIds] = useState<string[]>(DEFAULT_VISIBLE_STAT_IDS);
  const [addAnchor, setAddAnchor] = useState<DOMRect | null>(null);

  const toggle = (id: string, rect: DOMRect) => {
    setExpanded((v) => (v === id ? null : id));
    setExpandRect(rect);
  };
  const closeExpanded = () => setExpanded(null);
  const removeStat = (id: string) => {
    setVisibleIds((v) => v.filter((x) => x !== id));
    setExpanded((v) => (v === id ? null : v));
  };
  const addStat = (id: string) => setVisibleIds((v) => [...v, id]);
  const availableToAdd = STAT_LIBRARY_IDS.filter((id) => !visibleIds.includes(id));

  // `onExpandedChange` is `BriefWidgetGrid`'s `(expanded) => setLegacyKpiExpanded(widget.id, expanded)` —
  // a fresh closure every render (it's inline, capturing `widget.id` from a `.map()`), and
  // `setLegacyKpiExpanded` always replaces `layouts` with a new object even when the height it
  // computes is unchanged. Depending on the callback itself (not just `expanded`) would re-fire this
  // effect every single render, which replaces `layouts` again, which re-renders the grid, which hands
  // down yet another new closure — an infinite loop that previously crashed the whole app ("Maximum
  // update depth exceeded"). Reading the latest callback from a ref instead means this effect only
  // ever re-runs when `expanded` itself actually changes.
  const onExpandedChangeRef = useRef(onExpandedChange);
  useEffect(() => { onExpandedChangeRef.current = onExpandedChange; });
  useEffect(() => {
    // Expansion is always a floating popover now (an overlay, never inline), so this widget's own
    // grid cell never needs extra height to make room for it.
    onExpandedChangeRef.current?.(false);
  }, [expanded]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 12, flex: 'none' }}>
        {visibleIds.map((id) => {
          const meta = STAT_META[id];
          if (!meta) return null;
          return (
            <div
              key={id}
              style={{
                flex: 1, minWidth: 0, display: 'flex', position: 'relative' as const,
                background: '#fff', borderRadius: 12,
                border: `1.5px solid ${expanded === id ? meta.iconColor : '#eceef1'}`,
                boxShadow: expanded === id ? '0 10px 22px -8px rgba(20,24,33,.22)' : 'none',
                transform: expanded === id ? 'translateY(-2px)' : 'none',
                transition: 'border-color 160ms ease-out, box-shadow 160ms ease-out, transform 160ms ease-out',
              }}
            >
              <StatCardMember
                meta={meta}
                expanded={expanded === id}
                onClick={(e) => meta.expandable && toggle(id, e.currentTarget.getBoundingClientRect())}
                onRemove={() => removeStat(id)}
              />
            </div>
          );
        })}
        {availableToAdd.length > 0 && (
          <span
            onClick={(e) => setAddAnchor(e.currentTarget.getBoundingClientRect())}
            className={motion.pressable}
            title="Add a stat"
            style={{ flex: '0 0 56px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px dashed #dfe3ea', borderRadius: 12, cursor: 'pointer', color: '#9aa0a8' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#c7cad1'; e.currentTarget.style.color = '#6b7178'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#dfe3ea'; e.currentTarget.style.color = '#9aa0a8'; }}
          >
            <PlusIcon size={14} color="currentColor" />
          </span>
        )}
      </div>

      {expanded && <ExpansionHost statKey={expanded} anchorRect={expandRect} onClose={closeExpanded} />}
      {addAnchor && <AddStatPopover available={availableToAdd} anchorRect={addAnchor} onAdd={addStat} onClose={() => setAddAnchor(null)} />}
    </div>
  );
}

function DetailHeader({ iconBg, iconColor, icon, title, subtitle, onClose }: { iconBg: string; iconColor: string; icon: React.ReactNode; title: string; subtitle: string; onClose: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '16px 18px 0' }}>
      <span style={{ width: 32, height: 32, borderRadius: 9, background: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: '700 14px/1.3 Inter,sans-serif', color: '#111827' }}>{title}</div>
        <div style={{ font: '400 11.5px/1.4 Inter,sans-serif', color: '#6b7178', marginTop: 2 }}>{subtitle}</div>
      </div>
      <span onClick={onClose} className={motion.pressable} style={{ display: 'flex', cursor: 'pointer', padding: 4 }}><CloseIcon size={13} /></span>
    </div>
  );
}

function StatDetail({ statKey, onClose }: { statKey: StatKey; onClose: () => void }) {
  if (statKey === 'critical') return <CriticalAlertsDetail onClose={onClose} />;
  if (statKey === 'atRisk') return <AtRiskDetail onClose={onClose} />;
  if (statKey === 'opportunity') return <OpportunityDetail onClose={onClose} />;
  if (statKey === 'meetings') return <MeetingsTodayDetail onClose={onClose} />;
  return <MessagesDetail onClose={onClose} />;
}

function EmptyDetailNote({ text }: { text: string }) {
  return <div style={{ padding: '30px 18px', textAlign: 'center' as const, font: '400 12.5px/1.6 Inter,sans-serif', color: '#9aa0a8' }}>{text}</div>;
}

/** Not everything needs a chart — a plain stacked list of alert cards, priority and category as badges instead of a donut legend. */
function CriticalAlertsDetail({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ padding: '0 0 18px' }}>
      <DetailHeader iconBg="#eef2fb" iconColor="#4a6cf7" icon={<BellIcon color="#4a6cf7" />} title="Critical alerts" subtitle="High-priority alerts raised today" onClose={onClose} />
      {CRITICAL_TODAY.length === 0 ? (
        <EmptyDetailNote text="No critical alerts today." />
      ) : (
        <div style={{ padding: '14px 18px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {CRITICAL_TODAY.map((a) => (
            <div key={a.id} className={motion.rowHover} style={{ padding: '12px 14px', borderRadius: 9, border: '1px solid #eceef1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ padding: '2px 7px', borderRadius: 999, background: '#fdecec', font: '700 9.5px/1.5 Inter,sans-serif', color: '#b3453f', flex: 'none' }}>HIGH</span>
                <span style={{ padding: '2px 7px', borderRadius: 5, border: '1px solid #e6e8ec', font: '600 9.5px/1.5 Inter,sans-serif', color: '#6b7178', flex: 'none' }}>{a.category}</span>
                {!a.hideValue && <span style={{ marginLeft: 'auto', font: '700 12px/1 Inter,sans-serif', color: a.valueNum < 0 ? '#b3453f' : '#3f7d6a', flex: 'none' }}>{a.valueLabel}</span>}
              </div>
              <div style={{ font: '600 13px/1.4 Inter,sans-serif', color: '#23272d', marginTop: 8 }}>{a.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Shared compact layout for At risk / Opportunity: a centered donut (the same one Action Mix uses)
 * above a plain list of category rows — no side sidebar, no legend chips, no per-row progress bar,
 * just dot + label + value + share, so it fits comfortably in the same floating popover every other
 * key stat now expands into (see [[project_brief_widget_dashboard]] Round 8's "compress to fit" ask). */
function CategoryBifurcationDetail({
  iconBg, iconColor, icon, title, subtitle, items, total, centerLabel, onClose,
}: {
  iconBg: string; iconColor: string; icon: React.ReactNode; title: string; subtitle: string;
  items: BreakdownItem[]; total: number; centerLabel: string; onClose: () => void;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  return (
    <div style={{ padding: '0 0 16px' }}>
      <DetailHeader iconBg={iconBg} iconColor={iconColor} icon={icon} title={title} subtitle={subtitle} onClose={onClose} />
      <div style={{ padding: '16px 18px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <DonutWithCenter items={items} centerValue={formatCompactDollars(total)} centerLabel={centerLabel} size={136} activeIndex={hoveredIdx} onSliceHover={setHoveredIdx} />
        <div style={{ width: '100%', marginTop: 16, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {items.map((it, i) => {
            const pct = pctOf(it.value, total);
            return (
              <div
                key={it.label}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx((v) => (v === i ? null : v))}
                className={motion.rowHover}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 8px', borderRadius: 8, background: hoveredIdx === i ? '#fafbfd' : 'transparent' }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: it.color, flex: 'none' }} />
                <span style={{ flex: 1, minWidth: 0, font: '600 12.5px/1.3 Inter,sans-serif', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{it.label}</span>
                <span style={{ font: '700 12.5px/1 Inter,sans-serif', color: '#111827', flex: 'none' }}>{formatCompactDollars(it.value)}</span>
                <span style={{ font: '500 11px/1 Inter,sans-serif', color: '#9aa0a8', flex: 'none', width: 36, textAlign: 'right' as const }}>{formatPct(pct)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AtRiskDetail({ onClose }: { onClose: () => void }) {
  return (
    <CategoryBifurcationDetail
      iconBg="#fdecec" iconColor="#e74c3c" icon={<PieChartIcon color="#e74c3c" />}
      title="At risk, by category" subtitle="Total value across all categories today"
      items={AT_RISK_BY_CATEGORY} total={AT_RISK_TOTAL} centerLabel="total" onClose={onClose}
    />
  );
}

function OpportunityDetail({ onClose }: { onClose: () => void }) {
  return (
    <CategoryBifurcationDetail
      iconBg="#e9f7ef" iconColor="#27ae60" icon={<ShieldCheckIcon color="#27ae60" />}
      title="Opportunity, by category" subtitle="Verified value Jiva has already captured autonomously"
      items={OPPORTUNITY_BY_CATEGORY} total={OPPORTUNITY_TOTAL} centerLabel="captured" onClose={onClose}
    />
  );
}

/** Not everything needs a chart — a plain vertical timeline, no inset donut. */
function MeetingsTodayDetail({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ padding: '0 0 12px' }}>
      <DetailHeader iconBg="#f1eefc" iconColor="#7c4dff" icon={<CalendarIconFilled color="#7c4dff" />} title="Meetings today" subtitle="Everything on your calendar for today" onClose={onClose} />
      {MEETINGS_TODAY.length === 0 ? (
        <EmptyDetailNote text="No meetings today." />
      ) : (
        <div style={{ padding: '16px 18px 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {MEETINGS_TODAY.map((m, i) => (
              <div key={m.id} style={{ display: 'flex', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none' }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#7c4dff', marginTop: 4, flex: 'none' }} />
                  {i < MEETINGS_TODAY.length - 1 && <span style={{ width: 1, flex: 1, background: '#eceef1', marginTop: 2 }} />}
                </div>
                <div className={motion.rowHover} style={{ flex: 1, minWidth: 0, padding: '2px 0 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ font: '600 12.5px/1.4 Inter,sans-serif', color: '#23272d' }}>{m.title}</span>
                    <span style={{ font: '600 11px/1 Inter,sans-serif', color: '#7c4dff', flex: 'none' }}>{m.timeRange}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <span style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#9aa0a8' }}>{m.account}</span>
                    <span style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#c7cad1' }}>·</span>
                    <span style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#9aa0a8' }}>{m.tasksCompleted} of {m.tasksTotal} tasks ready</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Not everything needs a chart — cards styled like Work-station's own context cards (source icon + sender + time up top, content below) instead of a donut and proportion bar. */
function MessagesDetail({ onClose }: { onClose: () => void }) {
  const unread = UNREAD_MESSAGES;
  return (
    <div style={{ padding: '0 0 12px' }}>
      <DetailHeader iconBg="#eaf2fd" iconColor="#2f6fed" icon={<EnvelopeIconFilled color="#2f6fed" />} title="Important messages" subtitle="Unread messages across email, Slack and workspace" onClose={onClose} />
      {unread.length === 0 ? (
        <EmptyDetailNote text="No unread messages." />
      ) : (
        <div style={{ padding: '14px 18px 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {unread.map((m) => (
              <div key={m.id} className={motion.cardHover} style={{ padding: '11px 13px', borderRadius: 9, border: '1px solid #eceef1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <SourceIcon origin={m.channel} size={18} />
                  <span style={{ flex: 1, minWidth: 0, font: '600 12px/1.3 Inter,sans-serif', color: '#23272d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{m.sender}</span>
                  <span style={{ font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8', flex: 'none' }}>{m.time}</span>
                </div>
                <div style={{ font: '400 12px/1.4 Inter,sans-serif', color: '#464646', marginTop: 6 }}>{m.message}</div>
                <span style={{ display: 'inline-block', marginTop: 7, padding: '2px 7px', borderRadius: 5, background: '#f1f2f4', font: '600 9.5px/1.5 Inter,sans-serif', color: '#6b7178' }}>{m.channelName}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** The original "While you were away" Jiva activity feed, redesigned as a card list — each row now surfaces whether Jiva finished the work or is waiting on you, which the original bullet list never showed even though the data always had it. */
export function LegacyActivityBody() {
  return (
    <div className={scrollStyles.sleekScroll} style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 2 }}>
      {JIVA_ACTIVITY.map((j) => {
        const needsReview = j.status === 'needs-review';
        return (
          <div key={j.id} className={motion.rowHover} style={{ display: 'flex', gap: 10, padding: '11px 12px', borderRadius: 9, border: `1px solid ${needsReview ? '#f3e6d0' : '#f1f2f4'}`, background: needsReview ? '#fffaf3' : '#fff' }}>
            <span style={{ width: 24, height: 24, borderRadius: 7, background: needsReview ? '#fdf3e0' : '#e9f7ef', color: needsReview ? '#a8763f' : '#27ae60', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: 1 }}>
              {needsReview ? <ClockGlyph color="#a8763f" /> : <CheckGlyph color="#27ae60" />}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' as const }}>
                <span style={{ font: '600 12.5px/1.4 Inter,sans-serif', color: '#23272d' }}>{j.label}</span>
                {j.impact && <span style={{ font: '700 11.5px/1 Inter,sans-serif', color: j.impactColor || '#464646' }}>{j.impact}</span>}
              </div>
              <div style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#6b7178', marginTop: 3 }}>{j.detail}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <span style={{ font: '500 10px/1 Inter,sans-serif', color: '#9aa0a8' }}>{j.category} · {j.time}</span>
                {needsReview && (
                  <span style={{ padding: '1px 6px', borderRadius: 999, background: '#fdf3e0', font: '700 9px/1.5 Inter,sans-serif', color: '#a8763f' }}>NEEDS REVIEW</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
