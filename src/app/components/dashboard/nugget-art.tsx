import type { ReactNode } from 'react';
import type { WidgetKind } from './dashboard.types';
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

const ART: Record<WidgetKind, { draw: () => JSX.Element; tint: string }> = {
  'value-at-risk': { draw: RiskArt, tint: s.artTintRisk },
  'opportunity-value': { draw: GainArt, tint: s.artTintGain },
  'important-messages': { draw: MessagesArt, tint: s.artTintMail },
  'while-away': { draw: AwayArt, tint: s.artTintAway },
  'rule-impact': { draw: ImpactArt, tint: s.artTintRule },
  'rule-compare': { draw: CompareArt, tint: s.artTintCompare },
  'top-performers': { draw: RankArt, tint: s.artTintRank },
  'item-health': { draw: HealthArt, tint: s.artTintHealth },
};

/** The tint class for one nugget's drawing panel. */
export const nuggetTint = (kind: WidgetKind) => ART[kind].tint;

/** The drawing for one nugget, sized to the width of its library card. */
export default function NuggetArt({ kind }: { kind: WidgetKind }) {
  const Draw = ART[kind].draw;
  return (
    <svg viewBox="0 0 240 132" className={s.artSvg} aria-hidden focusable="false">
      <Draw />
    </svg>
  );
}
