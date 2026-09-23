import DiamondMascot from '@/app/components/common/diamond-mascot/diamond-mascot';
import { EnvelopeSmallIcon, WorkspaceSmallIcon, BoltIcon, SparkleIcon } from '../alerts/icons';
import { CategoryCard, type EmptyStateCategory } from './signals-empty-state';

function MeetingGlyph({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="10.5" rx="1.5" stroke={color} strokeWidth="1.4" />
      <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

const GLASS = {
  background: 'rgba(255,255,255,0.65)',
  backdropFilter: 'blur(16px) saturate(180%)',
  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
  border: '1px solid rgba(20,24,33,.06)',
} as React.CSSProperties;

interface Tile {
  key: string;
  icon: React.ReactNode;
  /** Tile center, in the 460×300 hero canvas. */
  x: number;
  y: number;
  rotate: number;
  delay: number;
  pillX: number;
  pillY: number;
  color: string;
  label: string;
}

const TILES: Tile[] = [
  { key: 'alerts', icon: <BoltIcon size={19} color="#b3453f" />, x: 72, y: 62, rotate: -9, delay: 0, pillX: 4, pillY: 104, color: '#b3453f', label: 'Alerts' },
  { key: 'meetings', icon: <MeetingGlyph size={19} color="#3874ff" />, x: 392, y: 54, rotate: 8, delay: .5, pillX: 300, pillY: 12, color: '#3874ff', label: 'Meetings' },
  { key: 'email', icon: <EnvelopeSmallIcon size={19} color="#5b6b8c" />, x: 56, y: 232, rotate: 6, delay: 1, pillX: 4, pillY: 256, color: '#5b6b8c', label: 'Email' },
  { key: 'workspace', icon: <WorkspaceSmallIcon size={19} color="#a8763f" />, x: 404, y: 224, rotate: -7, delay: 1.5, pillX: 302, pillY: 248, color: '#a8763f', label: 'Workspace' },
];

const CENTER = { x: 230, y: 148 };

const PARTICLES = [
  { x: 250, y: 24, size: 11, kind: 'sparkle', color: '#c9b6dd', delay: 0 },
  { x: 146, y: 234, size: 6, kind: 'dot', color: '#77469b', delay: 1.1 },
  { x: 312, y: 160, size: 5, kind: 'dot', color: '#f46d76', delay: .6 },
  { x: 30, y: 150, size: 8, kind: 'ring', color: '#3874ff', delay: 1.8 },
  { x: 398, y: 130, size: 6, kind: 'plus', color: '#a8763f', delay: .3 },
];

function Pill({ x, y, color, label }: { x: number; y: number; color: string; label: string }) {
  return (
    <div
      className="weh-pill"
      style={{
        ...GLASS,
        position: 'absolute', left: x, top: y,
        display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px 4px 7px', borderRadius: 999,
        boxShadow: '0 10px 22px -8px rgba(20,24,33,.22)',
        font: '600 10px/1 Inter,sans-serif', color: '#3d434b', whiteSpace: 'nowrap' as const,
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flex: 'none' }} />
      {label}
    </div>
  );
}

function Particle({ x, y, size, kind, color, delay }: (typeof PARTICLES)[number]) {
  return (
    <span className="weh-sparkle" style={{ position: 'absolute', left: x, top: y, animationDelay: `${delay}s` }}>
      {kind === 'sparkle' && <SparkleIcon size={size} color={color} />}
      {kind === 'dot' && <span style={{ display: 'block', width: size, height: size, borderRadius: '50%', background: color }} />}
      {kind === 'ring' && <span style={{ display: 'block', width: size, height: size, borderRadius: '50%', border: `1.4px solid ${color}` }} />}
      {kind === 'plus' && (
        <svg width={size + 3} height={size + 3} viewBox="0 0 10 10"><path d="M5 0v10M0 5h10" stroke={color} strokeWidth="1.3" strokeLinecap="round" /></svg>
      )}
    </span>
  );
}

/** The shared glassmorphic, orbiting-icons hero used by Alerts, Meetings and Work-station's empty states — frosted tiles for Alerts, Meetings, Email and Workspace, orbiting a live, cursor-aware Jiva. */
function ConnectedHero() {
  return (
    <div style={{ position: 'relative', width: 460, height: 300, flex: 'none' }}>
      <style>{`
        @keyframes weh-spin { to { transform: rotate(360deg); } }
        @keyframes weh-spin-rev { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes weh-float { 0%, 100% { transform: translateY(0) rotate(var(--r)); } 50% { transform: translateY(-8px) rotate(var(--r)); } }
        @keyframes weh-pulse { 0%, 100% { transform: scale(1); opacity: .6; } 50% { transform: scale(1.14); opacity: .95; } }
        @keyframes weh-twinkle { 0%, 100% { opacity: .3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
        .weh-orbit-outer { animation: weh-spin 52s linear infinite; transform-origin: 230px 148px; }
        .weh-orbit-inner { animation: weh-spin-rev 34s linear infinite; transform-origin: 230px 148px; }
        .weh-tile { animation: weh-float 3.8s ease-in-out infinite; }
        .weh-glow { animation: weh-pulse 3.4s ease-in-out infinite; }
        .weh-sparkle { animation: weh-twinkle 2.6s ease-in-out infinite; }
        .weh-pill { animation: weh-float 3.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .weh-orbit-outer, .weh-orbit-inner, .weh-tile, .weh-glow, .weh-sparkle, .weh-pill { animation: none !important; }
        }
      `}</style>

      {/* Ambient glow behind the mascot */}
      <div className="weh-glow" style={{ position: 'absolute', left: CENTER.x - 95, top: CENTER.y - 95, width: 190, height: 190, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,109,118,.32), transparent 70%)' }} />

      <svg width="460" height="300" viewBox="0 0 460 300" style={{ position: 'absolute', inset: 0 }}>
        <ellipse className="weh-orbit-outer" cx={CENTER.x} cy={CENTER.y} rx={182} ry={108} fill="none" stroke="rgba(119,70,155,.14)" strokeWidth="1.2" strokeDasharray="1 7" />
        <ellipse className="weh-orbit-inner" cx={CENTER.x} cy={CENTER.y} rx={124} ry={70} fill="none" stroke="rgba(119,70,155,.2)" strokeWidth="1" strokeDasharray="2 5" />
        <path d={`M72,62 C136,32 168,100 ${CENTER.x - 46},${CENTER.y - 10}`} fill="none" stroke="rgba(119,70,155,.26)" strokeWidth="1.2" />
        <path d={`M392,54 C312,22 280,108 ${CENTER.x + 46},${CENTER.y - 8}`} fill="none" stroke="rgba(119,70,155,.26)" strokeWidth="1.2" />
        <path d={`M56,232 C128,268 172,192 ${CENTER.x - 44},${CENTER.y + 16}`} fill="none" stroke="rgba(119,70,155,.26)" strokeWidth="1.2" />
        <path d={`M404,224 C322,264 282,182 ${CENTER.x + 44},${CENTER.y + 14}`} fill="none" stroke="rgba(119,70,155,.26)" strokeWidth="1.2" />
      </svg>

      {/* Thin glass shard accents */}
      <div style={{ position: 'absolute', left: 300, top: 66, width: 58, height: 15, borderRadius: 7, background: 'linear-gradient(120deg, rgba(119,70,155,.14), rgba(119,70,155,.03))', border: '1px solid rgba(119,70,155,.14)', transform: 'rotate(-20deg)' }} />
      <div style={{ position: 'absolute', left: 118, top: 200, width: 46, height: 13, borderRadius: 6, background: 'linear-gradient(120deg, rgba(244,109,118,.16), rgba(244,109,118,.03))', border: '1px solid rgba(244,109,118,.16)', transform: 'rotate(16deg)' }} />

      {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

      {TILES.map((t) => (
        <div
          key={t.key}
          className="weh-tile"
          style={{
            ...GLASS,
            '--r': `${t.rotate}deg`, animationDelay: `${t.delay}s`,
            position: 'absolute', left: t.x - 25, top: t.y - 25, width: 50, height: 50, borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 18px 34px -12px rgba(20,24,33,.3), inset 0 1px 0 rgba(255,255,255,.9)',
            transform: `rotate(${t.rotate}deg)`,
          } as React.CSSProperties}
        >
          {t.icon}
        </div>
      ))}
      {TILES.map((t) => <Pill key={`${t.key}-pill`} x={t.pillX} y={t.pillY} color={t.color} label={t.label} />)}

      <div style={{ position: 'absolute', left: CENTER.x, top: CENTER.y, transform: 'translate(-50%, -50%)' }}>
        <DiamondMascot size={94} interactive />
      </div>
    </div>
  );
}

export function ConnectedEmptyHero({ title = 'Your work.', subtitle, categories }: { title?: string; subtitle: string; categories: EmptyStateCategory[] }) {
  return (
    <div style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 28px' }}>
      <ConnectedHero />
      <div style={{ font: '800 25px/1.3 Inter,sans-serif', color: '#23272d', marginTop: 4, textAlign: 'center' as const }}>
        {title}{' '}
        <span style={{ background: 'linear-gradient(90deg, #77469b, #f46d76)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Connected.</span>
      </div>
      <div style={{ font: '400 12.5px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 8, maxWidth: 380, textAlign: 'center' as const }}>{subtitle}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(120px, 1fr))', gap: 12, marginTop: 26, width: '100%', maxWidth: 480 }}>
        {categories.map(({ key, ...c }) => <CategoryCard key={key} {...c} />)}
      </div>
    </div>
  );
}
