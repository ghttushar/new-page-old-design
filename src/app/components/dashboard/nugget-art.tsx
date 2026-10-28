import type { ReactNode } from 'react';
import type { ArtShape, WidgetCategory, WidgetKind } from './dashboard.types';
import { WIDGETS } from './widget-registry';
import styles from './dashboard.module.scss';

// A drawing of each nugget for the library. Each one shows the thing that nugget is about, large: the split of money at
// risk as a ring, opportunity as a rising area, messages as a stack, the time away as a timeline, a rule's lift as a
// chart, and two rules as paired bars. Each sits on its own faint tint so the cards tell apart at a glance.

const s = styles;

/** A white card floating on the tint, with a title line and a small icon square. */
function Panel({ x, y, w, h, children, title = 44 }: { x: number; y: number; w: number; h: number; children?: ReactNode; title?: number }) {
  return (
    <g>
      <rect className={s.artCard} x={x} y={y} width={w} height={h} rx="9" />
      <rect className={s.artIcon} x={x + 9} y={y + 9} width="10" height="10" rx="2.5" />
      <rect className={s.artLineDark} x={x + 24} y={y + 11.5} width={title} height="4.5" rx="2.25" />
      {children}
    </g>
  );
}

/** Points on a ring, for one segment of a donut. */
function arc(cx: number, cy: number, r: number, from: number, to: number) {
  const p = (t: number) => [cx + r * Math.cos(2 * Math.PI * t - Math.PI / 2), cy + r * Math.sin(2 * Math.PI * t - Math.PI / 2)];
  const [x1, y1] = p(from);
  const [x2, y2] = p(to);
  return `M${x1} ${y1} A${r} ${r} 0 ${to - from > 0.5 ? 1 : 0} 1 ${x2} ${y2}`;
}

/** Money at risk: a ring split by category beside the total. */
function RiskArt() {
  const parts: [number, number, string][] = [[0, 0.62, s.artRiskRing], [0.64, 0.82, s.artRiskRing2], [0.84, 0.96, s.artRiskRing3]];
  return (
    <g className={s.artLift}>
      <Panel x={30} y={16} w={180} h={104}>
        {parts.map(([a, b, cls]) => <path key={a} className={cls} d={arc(78, 74, 26, a, b)} />)}
        <rect className={s.artFigure} x="118" y="50" width="62" height="13" rx="3" />
        <rect className={s.artRiskSoft} x="118" y="68" width="34" height="9" rx="4.5" />
        <rect className={s.artLine} x="118" y="86" width="56" height="3.5" rx="1.75" />
        <rect className={s.artLine} x="118" y="95" width="44" height="3.5" rx="1.75" />
      </Panel>
    </g>
  );
}

/** Opportunity: a figure with an up chip, over a rising area. */
function GainArt() {
  return (
    <g className={s.artLift}>
      <Panel x={30} y={16} w={180} h={104}>
        <rect className={s.artFigure} x="39" y="30" width="54" height="12" rx="3" />
        <rect className={s.artGainSoft} x="98" y="31.5" width="28" height="9" rx="4.5" />
        <path className={s.artGainArea} d="M39 112 L39 96 L62 92 L84 95 L106 82 L128 85 L150 70 L172 66 L201 52 L201 112 Z" />
        <polyline className={s.artGainLine} points="39,96 62,92 84,95 106,82 128,85 150,70 172,66 201,52" />
        <circle className={s.artGainDot} cx="201" cy="52" r="3" />
      </Panel>
    </g>
  );
}

/** Messages: three message cards fanned in a stack, the top one unread. */
function MessagesArt() {
  const card = (x: number, y: number, rot: number, top: boolean) => (
    <g transform={`rotate(${rot} ${x + 74} ${y + 22})`}>
      <rect className={s.artCard} x={x} y={y} width="148" height="44" rx="9" />
      <circle className={top ? s.artAvatarDark : s.artAvatar} cx={x + 18} cy={y + 22} r="9" />
      <rect className={top ? s.artLineDark : s.artLine} x={x + 34} y={y + 14} width="52" height="4" rx="2" />
      <rect className={s.artLine} x={x + 34} y={y + 24} width="92" height="3.5" rx="1.75" />
      <rect className={s.artLine} x={x + 116} y={y + 14} width="20" height="3" rx="1.5" />
    </g>
  );
  return (
    <g className={s.artLift}>
      {card(52, 70, 4, false)}
      {card(46, 48, -3, false)}
      {card(46, 24, 0, true)}
      <rect className={s.artBadge} x="182" y="18" width="18" height="12" rx="6" />
    </g>
  );
}

/** Time away: a clock beside a timeline of what came in. */
function AwayArt() {
  return (
    <g className={s.artLift}>
      <circle className={s.artCard} cx="66" cy="66" r="30" />
      <circle className={s.artClockFace} cx="66" cy="66" r="23" />
      <path className={s.artClockHand} d="M66 66 L66 50 M66 66 L77 72" />
      <circle className={s.artGainDot} cx="66" cy="66" r="2.4" />
      <rect className={s.artCard} x="108" y="18" width="104" height="96" rx="9" />
      <line className={s.artHairStroke} x1="122" y1="30" x2="122" y2="104" />
      {[0, 1, 2, 3].map((i) => {
        const y = 32 + i * 20;
        return (
          <g key={y}>
            <circle className={s.artNode} cx="122" cy={y + 2} r="3" />
            <rect className={i === 0 ? s.artLineDark : s.artLine} x="132" y={y} width={[52, 44, 56, 40][i]} height="3.5" rx="1.75" />
            <rect className={s.artLine} x="132" y={y + 7} width={[34, 40, 28, 36][i]} height="2.5" rx="1.25" />
            <rect className={s.artRiskSoftLine} x="190" y={y} width="14" height="3.5" rx="1.75" />
          </g>
        );
      })}
    </g>
  );
}

/** A rule's impact: with-rule line lifted over a dashed baseline, with the lift on a chip. */
function ImpactArt() {
  return (
    <g className={s.artLift}>
      <Panel x={30} y={16} w={180} h={104} title={38}>
        <rect className={s.artLetterA} x="39" y="32" width="9" height="9" rx="2" />
        <rect className={s.artLineDark} x="51" y="34.5" width="24" height="4" rx="2" />
        <rect className={s.artLetterB} x="84" y="32" width="9" height="9" rx="2" />
        <rect className={s.artLine} x="96" y="34.5" width="24" height="4" rx="2" />
        <rect className={s.artGainSoft} x="168" y="31" width="32" height="11" rx="5.5" />
        <path className={s.artBrandArea} d="M39 110 L39 92 L60 88 L80 94 L100 74 L120 82 L140 77 L160 66 L180 70 L201 56 L201 110 Z" />
        <polyline className={s.artDash} points="39,100 64,98 88,94 112,97 136,100 160,95 184,98 201,97" />
        <polyline className={s.artBrand} points="39,92 60,88 80,94 100,74 120,82 140,77 160,66 180,70 201,56" />
      </Panel>
    </g>
  );
}

/** Two rules: paired bars per metric, side A in brand purple and side B in blue. */
function CompareArt() {
  const groups = [[0.82, 0.58], [0.5, 0.7], [0.66, 0.42]];
  return (
    <g className={s.artLift}>
      <Panel x={30} y={16} w={180} h={104} title={40}>
        <rect className={s.artLetterA} x="152" y="27" width="9" height="9" rx="2" />
        <rect className={s.artLetterBlue} x="166" y="27" width="9" height="9" rx="2" />
        <line className={s.artHairStroke} x1="40" y1="108" x2="200" y2="108" />
        {groups.map(([a, b], i) => {
          const x = 52 + i * 52;
          return (
            <g key={x}>
              <rect className={s.artBarA} x={x} y={108 - 58 * a} width="14" height={58 * a} rx="3" />
              <rect className={s.artBarB} x={x + 17} y={108 - 58 * b} width="14" height={58 * b} rx="3" />
              <rect className={s.artLine} x={x + 4} y="112" width="22" height="3" rx="1.5" />
            </g>
          );
        })}
      </Panel>
    </g>
  );
}

/** Top performers: a ranked list, each row a rank, a name and a bar that shortens down the list. */
function RankArt() {
  const rows = [1, 0.74, 0.52, 0.34];
  return (
    <g className={s.artLift}>
      <Panel x={30} y={16} w={180} h={104} title={46}>
        <rect className={s.artLine} x="150" y="11.5" width="50" height="4.5" rx="2.25" />
        {rows.map((share, i) => {
          const y = 34 + i * 20;
          return (
            <g key={y}>
              <rect className={i === 0 ? s.artRankFirst : s.artRankChip} x="39" y={y} width="12" height="12" rx="3" />
              <rect className={i === 0 ? s.artLineDark : s.artLine} x="57" y={y + 1} width={[46, 38, 50, 34][i]} height="3.5" rx="1.75" />
              <rect className={s.artRankTrack} x="57" y={y + 8} width="140" height="4" rx="2" />
              <rect className={i === 0 ? s.artRankBar : s.artRankBarSoft} x="57" y={y + 8} width={140 * share} height="4" rx="2" />
            </g>
          );
        })}
      </Panel>
    </g>
  );
}

/** Item health: the overall score over one long health bar, then three items, each with a short bar of its own. */
function HealthArt() {
  const items = [0.86, 0.58, 0.32];
  return (
    <g className={s.artLift}>
      <Panel x={30} y={16} w={180} h={104} title={36}>
        <rect className={s.artFigure} x="39" y="30" width="34" height="12" rx="3" />
        <rect className={s.artGainSoft} x="78" y="31.5" width="30" height="9" rx="4.5" />
        <rect className={s.artRankTrack} x="39" y="48" width="162" height="5" rx="2.5" />
        <rect className={s.artHealthBar} x="39" y="48" width={162 * 0.74} height="5" rx="2.5" />
        {items.map((share, i) => {
          const y = 64 + i * 17;
          return (
            <g key={y}>
              <rect className={i === 0 ? s.artLineDark : s.artLine} x="39" y={y} width={[58, 46, 52][i]} height="3.5" rx="1.75" />
              <rect className={s.artLine} x="39" y={y + 7} width="30" height="2.5" rx="1.25" />
              <rect className={s.artRankTrack} x="150" y={y + 1} width="51" height="4" rx="2" />
              <rect className={[s.artHealthBar, s.artHealthMid, s.artHealthLow][i]} x="150" y={y + 1} width={51 * share} height="4" rx="2" />
            </g>
          );
        })}
      </Panel>
    </g>
  );
}

/** Poor keywords: a ranked list whose bars are in the risk colour, two figures to each row. */
function PoorArt() {
  const rows = [0.92, 0.7, 0.5, 0.32];
  return (
    <g className={s.artLift}>
      <Panel x={30} y={16} w={180} h={104} title={52}>
        {rows.map((share, i) => {
          const y = 34 + i * 20;
          return (
            <g key={y}>
              <rect className={i === 0 ? s.artPoorFirst : s.artRankChip} x="39" y={y} width="12" height="12" rx="3" />
              <rect className={i === 0 ? s.artLineDark : s.artLine} x="57" y={y + 1} width={[44, 36, 48, 32][i]} height="3.5" rx="1.75" />
              <rect className={s.artRankTrack} x="57" y={y + 8} width="104" height="4" rx="2" />
              <rect className={i === 0 ? s.artPoorBar : s.artPoorBarSoft} x="57" y={y + 8} width={104 * share} height="4" rx="2" />
              <rect className={s.artLineDark} x="172" y={y + 1} width="28" height="3.5" rx="1.75" />
              <rect className={s.artLine} x="178" y={y + 8} width="22" height="3" rx="1.5" />
            </g>
          );
        })}
      </Panel>
    </g>
  );
}

/** New opportunities: three small figures on top, then items, each with its value and units on the right. */
function OpportunityArt() {
  return (
    <g className={s.artLift}>
      <Panel x={30} y={16} w={180} h={104} title={46}>
        {[0, 1, 2].map((i) => {
          const x = 39 + i * 55;
          return (
            <g key={x}>
              <rect className={s.artTile} x={x} y="28" width="50" height="28" rx="6" />
              <rect className={s.artLine} x={x + 7} y="34" width="22" height="3" rx="1.5" />
              <rect className={i === 0 ? s.artOppFigure : s.artFigure} x={x + 7} y="41" width={[18, 26, 32][i]} height="8" rx="2" />
            </g>
          );
        })}
        {[0, 1, 2].map((i) => {
          const y = 66 + i * 17;
          return (
            <g key={y}>
              <rect className={i === 0 ? s.artLineDark : s.artLine} x="39" y={y} width={[62, 50, 56][i]} height="3.5" rx="1.75" />
              <rect className={s.artLine} x="39" y={y + 7} width="34" height="2.5" rx="1.25" />
              <rect className={s.artLineDark} x="170" y={y} width="30" height="3.5" rx="1.75" />
              <rect className={s.artLine} x="180" y={y + 7} width="20" height="2.5" rx="1.25" />
            </g>
          );
        })}
      </Panel>
    </g>
  );
}

/** Add new keywords: two side-by-side routes, each an arrow over a 2 by 2 of figures. */
function NewKeywordsArt() {
  return (
    <g className={s.artLift}>
      <Panel x={30} y={16} w={180} h={104} title={42}>
        {[0, 1].map((side) => {
          const x = 39 + side * 83;
          return (
            <g key={x}>
              <rect className={s.artTile} x={x} y="28" width="79" height="82" rx="7" />
              <rect className={s.artLineDark} x={x + 8} y="36" width="16" height="4" rx="2" />
              <path className={s.artArrow} d={`M${x + 28} 38 h10 m-3 -3 l3 3 l-3 3`} />
              <rect className={s.artLineDark} x={x + 42} y="36" width="18" height="4" rx="2" />
              {[0, 1, 2, 3].map((i) => {
                const cx = x + 8 + (i % 2) * 36;
                const cy = 52 + Math.floor(i / 2) * 26;
                return (
                  <g key={i}>
                    <rect className={s.artLine} x={cx} y={cy} width="22" height="3" rx="1.5" />
                    <rect className={i === 3 ? s.artOppFigure : s.artFigure} x={cx} y={cy + 7} width={[18, 24, 20, 16][i]} height="8" rx="2" />
                  </g>
                );
              })}
            </g>
          );
        })}
      </Panel>
    </g>
  );
}

// ── Drawings for the newer nuggets ───────────────────────────────────────────────────────────
// One drawing per shape of body (a ranked list, a strip of figures, a gauge, a share split, an hour-by-day grid, a feed),
// varied by the nugget so no two cards in an area look the same. The marks take the area's colour.

/** A stable 0–1 number for a nugget and a slot, so a drawing never changes between renders. */
function vary(kind: string, slot: number): number {
  let h = 2166136261;
  const str = `${slot}|${kind}`;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967296;
}
const span = (kind: string, slot: number, lo: number, hi: number) => lo + vary(kind, slot) * (hi - lo);

/** A ranked list: a name and a sub-line on each row, a bar under some, a figure on the right. */
function ListArt({ kind }: { kind: string }) {
  const bars = vary(kind, 0) > 0.35;
  return (
    <Panel x={30} y={16} w={180} h={104} title={span(kind, 1, 34, 58)}>
      {[0, 1, 2, 3].map((i) => {
        const y = 33 + i * 20;
        const share = span(kind, 10 + i, 0.25, 1) * (1 - i * 0.14);
        const figure = span(kind, 40 + i, 20, 30);
        return (
          <g key={y}>
            <rect className={i === 0 ? s.artLineDark : s.artLine} x="39" y={y} width={span(kind, 20 + i, 36, 70)} height="3.5" rx="1.75" />
            {bars ? (
              <>
                <rect className={s.artRankTrack} x="39" y={y + 8} width="118" height="4" rx="2" />
                <rect className={i === 0 ? s.artGenAccent : s.artGenSoft} x="39" y={y + 8} width={Math.max(10, 118 * share)} height="4" rx="2" />
              </>
            ) : <rect className={s.artLine} x="39" y={y + 8} width={span(kind, 30 + i, 30, 60)} height="2.5" rx="1.25" />}
            <rect className={i === 0 ? s.artGenAccent : s.artLineDark} x={200 - figure} y={y} width={figure} height="4" rx="2" />
            <rect className={s.artLine} x="182" y={y + 8} width="18" height="2.5" rx="1.25" />
          </g>
        );
      })}
    </Panel>
  );
}

/** A strip of figures over a short list. */
function StatsArt({ kind }: { kind: string }) {
  const hero = Math.floor(vary(kind, 0) * 3);
  return (
    <Panel x={30} y={16} w={180} h={104} title={span(kind, 1, 34, 56)}>
      {[0, 1, 2].map((i) => {
        const x = 39 + i * 55;
        return (
          <g key={x}>
            <rect className={s.artTile} x={x} y="28" width="50" height="30" rx="6" />
            <rect className={s.artLine} x={x + 7} y="34" width={span(kind, 10 + i, 16, 30)} height="3" rx="1.5" />
            <rect className={i === hero ? s.artGenAccent : s.artFigure} x={x + 7} y="42" width={span(kind, 20 + i, 16, 34)} height="9" rx="2" />
          </g>
        );
      })}
      {[0, 1, 2].map((i) => {
        const y = 68 + i * 15;
        return (
          <g key={y}>
            <rect className={i === 0 ? s.artLineDark : s.artLine} x="39" y={y} width={span(kind, 30 + i, 44, 76)} height="3.5" rx="1.75" />
            <rect className={s.artLine} x="39" y={y + 6.5} width={span(kind, 40 + i, 24, 44)} height="2.5" rx="1.25" />
            <rect className={s.artLineDark} x="172" y={y} width="28" height="3.5" rx="1.75" />
          </g>
        );
      })}
    </Panel>
  );
}

/** A gauge: an arc filled to the reading, the figure inside it, and rows of metrics beside. */
function GaugeArt({ kind }: { kind: string }) {
  const level = span(kind, 0, 0.45, 0.85);
  const at = (t: number) => {
    const a = Math.PI * (1 - t);
    return `${74 + 30 * Math.cos(a)} ${96 - 30 * Math.sin(a)}`;
  };
  return (
    <Panel x={30} y={16} w={180} h={104} title={span(kind, 1, 34, 52)}>
      <path className={s.artGaugeTrack} d={`M${at(0)} A30 30 0 0 1 ${at(1)}`} />
      <path className={s.artGaugeFill} d={`M${at(0)} A30 30 0 0 1 ${at(level)}`} />
      <rect className={s.artFigure} x="62" y="84" width="24" height="9" rx="2" />
      {[0, 1, 2, 3].map((i) => {
        const y = 36 + i * 18;
        return (
          <g key={y}>
            <rect className={i === 0 ? s.artLineDark : s.artLine} x="118" y={y} width={span(kind, 10 + i, 34, 52)} height="3.5" rx="1.75" />
            <rect className={s.artRankTrack} x="118" y={y + 7} width="82" height="4" rx="2" />
            <rect className={i === 1 ? s.artHealthMid : s.artGenSoft} x="118" y={y + 7} width={82 * span(kind, 20 + i, 0.3, 0.9)} height="4" rx="2" />
          </g>
        );
      })}
    </Panel>
  );
}

/** A share split: labelled bars, longest first. */
function SplitArt({ kind }: { kind: string }) {
  const shares = [0, 1, 2, 3, 4].map((i) => span(kind, 10 + i, 0.2, 1)).sort((a, b) => b - a);
  return (
    <Panel x={30} y={16} w={180} h={104} title={span(kind, 1, 36, 56)}>
      {shares.map((share, i) => {
        const y = 31 + i * 16.5;
        return (
          <g key={y}>
            <rect className={i === 0 ? s.artLineDark : s.artLine} x="39" y={y} width={span(kind, 20 + i, 26, 48)} height="3" rx="1.5" />
            <rect className={s.artLine} x="190" y={y} width="10" height="3" rx="1.5" />
            <rect className={s.artRankTrack} x="39" y={y + 6} width="161" height="5" rx="2.5" />
            <rect className={i === 0 ? s.artGenAccent : i === shares.length - 1 ? s.artFigure : s.artGenSoft} x="39" y={y + 6} width={161 * share} height="5" rx="2.5" />
          </g>
        );
      })}
    </Panel>
  );
}

/** An hour-by-day grid, its early hours paused. */
function HeatArt({ kind }: { kind: string }) {
  const curve = [0.25, 0.15, 0.2, 0.5, 0.8, 0.9, 0.95, 0.85, 0.9, 1, 1, 0.7];
  return (
    <Panel x={30} y={16} w={180} h={104} title={span(kind, 1, 40, 56)}>
      {[0, 1, 2, 3, 4, 5, 6].map((r) => (
        <g key={r}>
          <rect className={s.artLine} x="39" y={33 + r * 11} width="10" height="3" rx="1.5" />
          {curve.map((c, col) => (
            <rect
              key={col} className={col < 3 ? s.artHeatOff : s.artGenAccent} x={54 + col * 12} y={30 + r * 11} width="10" height="9" rx="2"
              style={col < 3 ? undefined : { opacity: 0.12 + 0.8 * c * span(kind, r * 12 + col, 0.7, 1) }}
            />
          ))}
        </g>
      ))}
    </Panel>
  );
}

/** A feed: a timeline of entries, each with a tag. */
function FeedArt({ kind }: { kind: string }) {
  return (
    <Panel x={30} y={16} w={180} h={104} title={span(kind, 1, 36, 54)}>
      <line className={s.artHairStroke} x1="43" y1="34" x2="43" y2="108" />
      {[0, 1, 2, 3].map((i) => {
        const y = 33 + i * 19;
        const name = span(kind, 10 + i, 40, 70);
        return (
          <g key={y}>
            <circle className={i === 0 ? s.artGenNode : s.artNode} cx="43" cy={y + 3} r="3.2" />
            <rect className={i === 0 ? s.artLineDark : s.artLine} x="54" y={y} width={name} height="3.5" rx="1.75" />
            <rect className={s.artGenSoft} x={60 + name} y={y - 1} width={span(kind, 20 + i, 16, 26)} height="6" rx="3" />
            <rect className={s.artLine} x="54" y={y + 7} width={span(kind, 30 + i, 50, 96)} height="2.5" rx="1.25" />
            <rect className={s.artLineDark} x="180" y={y} width="20" height="3.5" rx="1.75" />
          </g>
        );
      })}
    </Panel>
  );
}

const SHAPES: Record<ArtShape, (p: { kind: string }) => JSX.Element> = { list: ListArt, stats: StatsArt, gauge: GaugeArt, split: SplitArt, heat: HeatArt, feed: FeedArt };

/** Each area's tint and mark colour, for the newer nuggets' drawings. */
const AREA: Record<WidgetCategory, string> = {
  Signals: s.artAreaSignals,
  Rules: s.artAreaRules,
  'Campaign Manager': s.artAreaAds,
  Catalog: s.artAreaCatalog,
  Inventory: s.artAreaInventory,
  Pricing: s.artAreaPricing,
  Profitability: s.artAreaProfit,
  'Market intelligence': s.artAreaMarket,
  Reviews: s.artAreaReviews,
  'Account health': s.artAreaHealth,
};

const ART: Partial<Record<WidgetKind, { draw: () => JSX.Element; tint: string }>> = {
  'value-at-risk': { draw: RiskArt, tint: s.artTintRisk },
  'opportunity-value': { draw: GainArt, tint: s.artTintGain },
  'important-messages': { draw: MessagesArt, tint: s.artTintMail },
  'while-away': { draw: AwayArt, tint: s.artTintAway },
  'rule-impact': { draw: ImpactArt, tint: s.artTintRule },
  'rule-compare': { draw: CompareArt, tint: s.artTintCompare },
  'top-performers': { draw: RankArt, tint: s.artTintRank },
  'item-health': { draw: HealthArt, tint: s.artTintHealth },
  'poor-keywords': { draw: PoorArt, tint: s.artTintPoor },
  'new-opportunities': { draw: OpportunityArt, tint: s.artTintOpportunity },
  'new-keywords': { draw: NewKeywordsArt, tint: s.artTintKeywords },
};

/** The tint class for one nugget's drawing panel. */
export const nuggetTint = (kind: WidgetKind) => ART[kind]?.tint ?? AREA[WIDGETS[kind].category];

/**
 * The drawing for one nugget, sized to the width of its library card. With `fill`, just the drawing (without the margin
 * around it) sizes to its box, whatever its shape, as in a template's miniature dashboard.
 */
export default function NuggetArt({ kind, fill }: { kind: WidgetKind; fill?: boolean }) {
  const own = ART[kind];
  const def = WIDGETS[kind];
  const Shape = SHAPES[def.art ?? 'list'];
  return (
    <svg viewBox={fill ? '30 16 180 104' : '0 0 240 132'} className={`${fill ? s.artSvgFill : s.artSvg} ${own ? '' : AREA[def.category]}`} preserveAspectRatio={fill ? 'xMidYMid meet' : undefined} aria-hidden focusable="false">
      {own ? <own.draw /> : <g className={s.artLift}><Shape kind={kind} /></g>}
    </svg>
  );
}
