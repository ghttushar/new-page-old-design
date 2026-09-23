import { useState } from 'react';
import { JIVA_ACTIVITY, BRIEF_MESSAGES, PROTOTYPE_ALERTS, MEETING_LIST } from '@/constants/signals/prototype-data';
import { SparkleIcon } from '../alerts/icons';
import motion from '../alerts/motion.module.scss';

function formatHeaderDate(): string {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
}

function formatHeaderTime(): string {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'AM' : 'PM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

const TODAY_ALERTS = PROTOTYPE_ALERTS.filter((a) => a.day === 'today');
const CRITICAL_TODAY = TODAY_ALERTS.filter((a) => a.priority === 'High');
const AT_RISK_TOTAL = TODAY_ALERTS.filter((a) => a.valueNum < 0).reduce((sum, a) => sum + Math.abs(a.valueNum), 0);
const VERIFIED_GAIN_TOTAL = JIVA_ACTIVITY.filter((j) => j.status === 'done' && j.impact?.startsWith('+')).reduce((sum, j) => sum + (parseInt(j.impact!.replace(/[^0-9]/g, ''), 10) || 0), 0);
const MEETINGS_TODAY = MEETING_LIST.filter((m) => m.isToday);
const IMPORTANT_MESSAGES = BRIEF_MESSAGES.filter((m) => m.unread).length;

function formatCompactDollars(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M`;
  if (n >= 1_000) return `$${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return `$${n.toLocaleString()}`;
}

function formatPct(pct: number): string {
  if (pct >= 10) return `${Math.round(pct)}%`;
  return `${pct.toFixed(1)}%`;
}

/** A qualitative palette — distinct hues per category, shared by both breakdowns so a category reads as the same colour everywhere on the page. */
const CATEGORY_COLORS: Record<string, string> = {
  Profitability: '#FEBC2A', Compliance: '#F3465D', Catalog: '#7450ED', Advertising: '#2685FC',
  Inventory: '#1DCBCB', Billing: '#0AA542', Reviews: '#EDC948', Operations: '#B07858',
};

interface BreakdownItem { label: string; value: number; color: string }

function bifurcateByCategory(entries: { category: string; value: number }[]): BreakdownItem[] {
  const byCategory = new Map<string, number>();
  entries.forEach((e) => byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.value));
  return Array.from(byCategory.entries())
    .map(([label, value]) => ({ label, value, color: CATEGORY_COLORS[label] ?? '#77469b' }))
    .sort((a, b) => b.value - a.value);
}

/** Today's at-risk value, bifurcated by category — the same total as the "At risk" stat, and the same bifurcation "Verified gain" uses below. */
const AT_RISK_BY_CATEGORY: BreakdownItem[] = bifurcateByCategory(
  TODAY_ALERTS.filter((a) => a.valueNum < 0).map((a) => ({ category: a.category, value: Math.abs(a.valueNum) }))
);

/** Verified gain, bifurcated by category — the same total as the "Verified gain" stat. */
const VERIFIED_GAIN_BY_CATEGORY: BreakdownItem[] = bifurcateByCategory(
  JIVA_ACTIVITY.filter((j) => j.status === 'done' && j.impact?.startsWith('+')).map((j) => ({ category: j.category, value: parseInt(j.impact!.replace(/[^0-9]/g, ''), 10) || 0 }))
);

/** Stable per-category hash, used only to vary the chart's share a bit — not real randomness, so it doesn't reshuffle on every render. */
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Random-but-floored shares for the donut/bars — every category is guaranteed at least 10%,
 * so a heavily skewed real $ split (one category routinely 90%+ of the total here) doesn't
 * shrink the rest to invisible slivers. The $ value column still shows the real number; only
 * the visual proportion (and its "% of total" label) is this randomised share.
 */
function randomShares(items: BreakdownItem[]): number[] {
  const floor = 10;
  const slack = Math.max(0, 100 - floor * items.length);
  const raw = items.map((it) => 40 + (hashString(it.label) % 60));
  const rawTotal = raw.reduce((sum, r) => sum + r, 0);
  return raw.map((r) => floor + slack * (r / rawTotal));
}

function shareAngles(shares: number[]): { a0: number; a1: number }[] {
  let acc = 0;
  return shares.map((share) => {
    const a0 = (acc / 100) * 360;
    acc += share;
    const a1 = (acc / 100) * 360;
    return { a0, a1 };
  });
}

/** Point on an ellipse at `angleDeg` clockwise from 12 o'clock — same convention as CSS conic-gradient. */
function ellipsePoint(cx: number, cy: number, rx: number, ry: number, angleDeg: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + rx * Math.sin(rad), y: cy - ry * Math.cos(rad) };
}

/** SVG path for one donut wedge (an annular sector) between two angles. */
function annularSectorPath(cx: number, cy: number, outerRx: number, outerRy: number, innerRx: number, innerRy: number, a0: number, a1: number): string {
  const large = a1 - a0 > 180 ? 1 : 0;
  const o0 = ellipsePoint(cx, cy, outerRx, outerRy, a0);
  const o1 = ellipsePoint(cx, cy, outerRx, outerRy, a1);
  const i0 = ellipsePoint(cx, cy, innerRx, innerRy, a0);
  const i1 = ellipsePoint(cx, cy, innerRx, innerRy, a1);
  return `M ${o0.x} ${o0.y} A ${outerRx} ${outerRy} 0 ${large} 1 ${o1.x} ${o1.y} L ${i1.x} ${i1.y} A ${innerRx} ${innerRy} 0 ${large} 0 ${i0.x} ${i0.y} Z`;
}

/** Lightens (positive) or darkens (negative) a hex color, e.g. for the pie's shaded underside. */
function shadeColor(hex: string, percent: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 0xff, g = (n >> 8) & 0xff, b = n & 0xff;
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent);
  const nr = Math.round((t - r) * p) + r;
  const ng = Math.round((t - g) * p) + g;
  const nb = Math.round((t - b) * p) + b;
  return `#${((1 << 24) | (nr << 16) | (ng << 8) | nb).toString(16).slice(1)}`;
}

// Geometry for the 3D pie — a gently flattened (elliptical), mostly front-facing donut with a
// darker duplicate offset straight down, so the sliver that peeks out below each wedge reads as
// its extruded "wall" without tipping the whole chart into a steep bird's-eye angle.
const PIE_CX = 94, PIE_CY = 72;
const PIE_OUTER_RX = 78, PIE_OUTER_RY = 64;
const PIE_INNER_RX = 40, PIE_INNER_RY = 33;
const PIE_DEPTH = 9;
const PIE_EXPLODE = 9;
const PIE_LIFT = 6;
const PIE_EASE = 'cubic-bezier(.22,.9,.32,1)';

function buildInsight(items: BreakdownItem[], kind: 'risk' | 'gain'): { title: string; body: string } {
  const total = items.reduce((sum, it) => sum + it.value, 0);
  const top = items[0];
  const pct = total > 0 ? Math.round((top.value / total) * 100) : 0;
  if (kind === 'risk') {
    return {
      title: `${top.label} accounts for ${pct}% of at-risk value`,
      body: `The majority of your at-risk amount is concentrated in ${top.label}. Consider reviewing the open alerts in this category to mitigate potential loss.`,
    };
  }
  return {
    title: `${top.label} accounts for ${pct}% of verified gain`,
    body: `Most of Jiva's autonomous wins so far came from ${top.label}. Consider extending the same automation to other categories.`,
  };
}

const AT_RISK_INSIGHT = buildInsight(AT_RISK_BY_CATEGORY, 'risk');
const VERIFIED_GAIN_INSIGHT = buildInsight(VERIFIED_GAIN_BY_CATEGORY, 'gain');

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
function PieChartIcon({ color }: { color: string }) {
  return <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.3" stroke={color} strokeWidth="1.3" /><path d="M8 8V1.7A6.3 6.3 0 0 1 14.3 8z" fill={color} /></svg>;
}
function LightbulbIcon({ color }: { color: string }) {
  return <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M8 1.8a4.3 4.3 0 0 0-2.4 7.9c.4.3.7.8.7 1.3v.5h3.4v-.5c0-.5.3-1 .7-1.3A4.3 4.3 0 0 0 8 1.8z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" /><path d="M6.6 14h2.8M7 12.5v1M9 12.5v1" stroke={color} strokeWidth="1.3" strokeLinecap="round" /></svg>;
}

export function BriefFull() {
  const [expandedStat, setExpandedStat] = useState<'atRisk' | 'verifiedGain' | null>(null);

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingRight: 4, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ font: '600 18px/1.3 Inter,sans-serif', color: '#23272d' }}>
        {formatHeaderDate()} · {formatHeaderTime()}
      </div>

      {/* KPI cards */}
      <div style={{ display: 'flex', gap: 12 }}>
        <KpiCard tint="#eef2fb" iconBg="#dbe4f7" iconColor="#4a6cf7" icon={<BellIcon color="#4a6cf7" />} label="Critical alerts" value={String(CRITICAL_TODAY.length)} />
        <KpiCard
          tint="#fdecec" iconBg="#fbd5d5" iconColor="#e74c3c" icon={<TrendUpIcon color="#e74c3c" />} label="At risk"
          value={`$${AT_RISK_TOTAL.toLocaleString()}`} valueColor="#e74c3c"
          expandable expanded={expandedStat === 'atRisk'} onToggle={() => setExpandedStat((v) => (v === 'atRisk' ? null : 'atRisk'))}
        />
        <KpiCard
          tint="#e9f7ef" iconBg="#d1f2df" iconColor="#27ae60" icon={<ShieldCheckIcon color="#27ae60" />} label="Verified gain"
          value={`$${VERIFIED_GAIN_TOTAL.toLocaleString()}`} valueColor="#27ae60"
          trendLabel="+8%" trendBg="#d1f2df" trendColor="#1e8449"
          expandable expanded={expandedStat === 'verifiedGain'} onToggle={() => setExpandedStat((v) => (v === 'verifiedGain' ? null : 'verifiedGain'))}
        />
        <KpiCard tint="#f1eefc" iconBg="#e3dbf9" iconColor="#7c4dff" icon={<CalendarIconFilled color="#7c4dff" />} label="Meetings today" value={String(MEETINGS_TODAY.length)} />
        <KpiCard tint="#eaf2fd" iconBg="#d7e8fb" iconColor="#2f6fed" icon={<EnvelopeIconFilled color="#2f6fed" />} label="Important messages" value={String(IMPORTANT_MESSAGES)} />
      </div>

      {expandedStat === 'atRisk' && (
        <BreakdownPanel title="At Risk, by Category" subtitle="Total at-risk value across all categories · click a category to view its alerts" items={AT_RISK_BY_CATEGORY} insight={AT_RISK_INSIGHT} flat />
      )}
      {expandedStat === 'verifiedGain' && (
        <BreakdownPanel title="Verified Gain, by Category" subtitle="Total verified gain across all categories · click a category to view its alerts" items={VERIFIED_GAIN_BY_CATEGORY} insight={VERIFIED_GAIN_INSIGHT} flat />
      )}

      {/* While you were away — what Jiva did, and the impact so far */}
      <CardSection title="While you were away" titleIcon={<SparkleIcon size={13} />}>
        {JIVA_ACTIVITY.map((j, i) => (
          <div key={j.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 18px', borderBottom: i < JIVA_ACTIVITY.length - 1 ? '1px solid #f1f2f4' : 'none' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#77469b', marginTop: 6, flex: 'none' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' as const }}>
                <span style={{ font: '600 13px/1.45 Inter,sans-serif', color: '#23272d' }}>{j.label}</span>
                {j.impact && (
                  <span style={{ font: '700 12px/1 Inter,sans-serif', color: j.impactColor || '#464646' }}>{j.impact}</span>
                )}
              </div>
              <div style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#6b7178', marginTop: 3 }}>{j.detail} · {j.time}</div>
            </div>
          </div>
        ))}
      </CardSection>

    </div>
  );
}

function KpiCard({
  tint, iconBg, iconColor, icon, label, value, valueColor, trendLabel, trendBg, trendColor, expandable, expanded, onToggle,
}: {
  tint: string; iconBg: string; iconColor: string; icon: React.ReactNode; label: string; value: string; valueColor?: string;
  trendLabel?: string; trendBg?: string; trendColor?: string;
  expandable?: boolean; expanded?: boolean; onToggle?: () => void;
}) {
  return (
    <div
      onClick={expandable ? onToggle : undefined}
      className={expandable ? motion.pressable : undefined}
      style={{ flex: 1, minWidth: 0, background: tint, borderRadius: 12, padding: '14px 16px', border: `1.5px solid ${expanded ? iconColor : 'transparent'}`, cursor: expandable ? 'pointer' : 'default', transition: 'border-color 140ms ease-out' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ width: 32, height: 32, borderRadius: 9, background: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{icon}</span>
        {expandable && (
          <span style={{ display: 'flex', color: '#9aa0a8', transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 160ms ease-out' }}>
            <ChevronRightIcon />
          </span>
        )}
      </div>
      <div style={{ font: '500 12px/1.3 Inter,sans-serif', color: '#4b5563', marginTop: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' as const }}>
        <span style={{ font: '700 21px/1 Inter,sans-serif', color: valueColor || '#111827' }}>{value}</span>
        {trendLabel && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 7px', borderRadius: 999, background: trendBg, font: '700 10.5px/1.5 Inter,sans-serif', color: trendColor }}>
            ↑ {trendLabel}
          </span>
        )}
      </div>
    </div>
  );
}

function BreakdownPanel({ title, subtitle, items, insight, flat = false }: { title: string; subtitle: string; items: BreakdownItem[]; insight: { title: string; body: string }; flat?: boolean }) {
  const total = items.reduce((sum, it) => sum + it.value, 0);
  const shares = randomShares(items);
  const angles = shareAngles(shares);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  // Flat charts render as true circles with no extruded "wall" layer — 3D ones keep the elliptical tilt + shadow duplicate.
  const outerRx = flat ? 74 : PIE_OUTER_RX;
  const outerRy = flat ? 74 : PIE_OUTER_RY;
  const innerRx = flat ? 38 : PIE_INNER_RX;
  const innerRy = flat ? 38 : PIE_INNER_RY;
  const depth = flat ? 0 : PIE_DEPTH;
  return (
    <div className={motion.contentFadeIn} style={{ padding: 20, borderRadius: 12, background: '#fff', border: '1px solid #eceef1' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 36, height: 36, borderRadius: 10, background: '#f1eefc', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
          <PieChartIcon color="#7c4dff" />
        </span>
        <div>
          <div style={{ font: '700 15px/1.3 Inter,sans-serif', color: '#111827' }}>{title}</div>
          <div style={{ font: '400 12px/1.4 Inter,sans-serif', color: '#6b7178', marginTop: 2 }}>{subtitle}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, marginTop: 22, alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
        <div style={{ flex: '0 1 calc(65% - 30px)', minWidth: 320, display: 'flex', gap: 28, alignItems: 'center' }}>
          <div style={{ width: 188, height: 156, flex: 'none', position: 'relative' as const }}>
            <svg width={188} height={156} viewBox="0 0 188 156" style={{ overflow: 'visible' as const }}>
              {/* Static shadow "wall" — always resting, gives every wedge its extruded rim. Skipped entirely for flat 2D charts. */}
              {!flat && (
                <g>
                  {items.map((it, i) => {
                    const { a0, a1 } = angles[i];
                    const d = annularSectorPath(PIE_CX, PIE_CY, outerRx, outerRy, innerRx, innerRy, a0, a1);
                    return <path key={`shadow-${it.label}`} d={d} fill={shadeColor(it.color, -0.35)} style={{ transform: `translate(0px, ${depth}px)` }} />;
                  })}
                </g>
              )}
              {/* Static top faces — never move, so hovering never loses the pointer and never leaves a gap. */}
              <g>
                {items.map((it, i) => {
                  const { a0, a1 } = angles[i];
                  const d = annularSectorPath(PIE_CX, PIE_CY, outerRx, outerRy, innerRx, innerRy, a0, a1);
                  return (
                    <path
                      key={`top-${it.label}`}
                      d={d}
                      fill={it.color}
                      stroke="rgba(255,255,255,.55)"
                      strokeWidth={1}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredIdx(i)}
                      onMouseLeave={() => setHoveredIdx((v) => (v === i ? null : v))}
                    />
                  );
                })}
              </g>
              {/* Raised duplicates — pointer-events off, transform/filter animated via CSS transition for the hover-lift. */}
              <g style={{ pointerEvents: 'none' as const }}>
                {!flat && items.map((it, i) => {
                  const { a0, a1 } = angles[i];
                  const mid = (((a0 + a1) / 2) * Math.PI) / 180;
                  const raised = hoveredIdx === i;
                  const dx = raised ? Math.sin(mid) * PIE_EXPLODE : 0;
                  const dy = raised ? -Math.cos(mid) * PIE_EXPLODE - PIE_LIFT : 0;
                  const d = annularSectorPath(PIE_CX, PIE_CY, outerRx, outerRy, innerRx, innerRy, a0, a1);
                  return <path key={`rshadow-${it.label}`} d={d} fill={shadeColor(it.color, -0.35)} style={{ transform: `translate(${dx}px, ${depth + dy}px)`, transition: `transform 280ms ${PIE_EASE}` }} />;
                })}
                {items.map((it, i) => {
                  const { a0, a1 } = angles[i];
                  const mid = (((a0 + a1) / 2) * Math.PI) / 180;
                  const raised = hoveredIdx === i;
                  const dx = raised ? Math.sin(mid) * PIE_EXPLODE : 0;
                  const dy = raised ? -Math.cos(mid) * PIE_EXPLODE - PIE_LIFT : 0;
                  const d = annularSectorPath(PIE_CX, PIE_CY, outerRx, outerRy, innerRx, innerRy, a0, a1);
                  return (
                    <path
                      key={`rtop-${it.label}`}
                      d={d}
                      fill={it.color}
                      stroke="rgba(255,255,255,.7)"
                      strokeWidth={raised ? 1.5 : 1}
                      style={{
                        transform: `translate(${dx}px, ${dy}px)`,
                        filter: raised ? 'brightness(1.04) drop-shadow(0 7px 9px rgba(20,24,33,.28))' : 'none',
                        transition: `transform 280ms ${PIE_EASE}, filter 280ms ease-out`,
                      }}
                    />
                  );
                })}
              </g>
            </svg>
            <div style={{ position: 'absolute', left: PIE_CX - innerRx, top: PIE_CY - innerRy, width: innerRx * 2, height: innerRy * 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' as const }}>
              <div style={{ font: '700 17px/1 Inter,sans-serif', color: '#111827' }}>{formatCompactDollars(total)}</div>
              <div style={{ font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8', marginTop: 4 }}>total</div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '104px 60px 56px 1fr 16px', gap: '8px 14px', font: '600 10.5px/1 Inter,sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase' as const, color: '#9aa0a8', paddingBottom: 8, borderBottom: '1px solid #f1f2f4' }}>
              <div>Category</div><div>Value</div><div>% of total</div><div /><div />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
              {items.map((it, i) => {
                const pct = shares[i];
                return (
                  <div
                    key={it.label}
                    onClick={() => {}}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx((v) => (v === i ? null : v))}
                    className={motion.rowHover}
                    style={{ display: 'grid', gridTemplateColumns: '104px 60px 56px 1fr 16px', gap: 14, alignItems: 'center', padding: '4px 6px', margin: '0 -6px', borderRadius: 6, cursor: 'pointer', background: hoveredIdx === i ? '#fafbfd' : undefined }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 7, font: '600 12.5px/1 Inter,sans-serif', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, textDecoration: 'underline', textDecorationColor: '#e3e5e9', textUnderlineOffset: 3 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: it.color, flex: 'none' }} />
                      {it.label}
                    </span>
                    <span style={{ font: '700 12.5px/1 Inter,sans-serif', color: '#111827' }}>{formatCompactDollars(it.value)}</span>
                    <span style={{ font: '500 12px/1 Inter,sans-serif', color: '#6b7178' }}>{formatPct(pct)}</span>
                    <span style={{ height: 6, borderRadius: 3, background: '#f1f2f4', overflow: 'hidden' }}>
                      <span style={{ display: 'block', height: '100%', width: `${pct}%`, background: it.color, borderRadius: 3 }} />
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                      <ChevronRightIcon color="#c7cad1" />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ width: 1, background: '#eceef1', flex: 'none', alignSelf: 'stretch' as const }} />

        <div style={{ flex: '0 1 calc(35% - 30px)', minWidth: 220, background: '#f5f3ff', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LightbulbIcon color="#7c4dff" />
            <span style={{ font: '700 12.5px/1 Inter,sans-serif', color: '#4c1d95' }}>Key Insight</span>
          </div>
          <div style={{ font: '700 12.5px/1.4 Inter,sans-serif', color: '#111827', marginTop: 12 }}>{insight.title}</div>
          <div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#4b5563', marginTop: 6 }}>{insight.body}</div>
        </div>
      </div>
    </div>
  );
}

function CardSection({ title, titleIcon, actionLabel, actionColor, onAction, children }: { title: string; titleIcon?: React.ReactNode; actionLabel?: string; actionColor?: string; onAction?: () => void; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden', flex: 'none' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f2f4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 7, font: '600 13px/1 Inter,sans-serif', color: '#23272d' }}>{titleIcon}{title}</span>
        {actionLabel && (
          <span
            onClick={onAction}
            className={onAction ? motion.pressable : undefined}
            style={{ font: '600 12px/1 Inter,sans-serif', color: actionColor || '#77469b', cursor: onAction ? 'pointer' : 'default', textDecoration: 'none' }}
            onMouseEnter={onAction ? (e) => (e.currentTarget.style.textDecoration = 'underline') : undefined}
            onMouseLeave={onAction ? (e) => (e.currentTarget.style.textDecoration = 'none') : undefined}
          >
            {actionLabel}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
