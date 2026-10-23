// Shared building blocks for the Smart Campaign Creator. Same palette and Inter typeface as the rest of
// the app (Signals / Alerts), refined with depth, accent tints and motion.
// Colours mirror the --ccd-* tokens in src/styles.css; they stay as hex here because SVG presentation
// attributes (fill/stroke) cannot read CSS variables.

export const BRAND = '#77469b';
export const BRAND_HOVER = '#653a86';
export const BRAND_TINT = '#f7f2fc';
export const BRAND_LINE = '#e3d8f0';
export const BORDER = '#e4e7ee';
export const HAIR = '#eef0f5';
export const SURFACE_MUTED = '#f9fafd';
export const TEXT_PRIMARY = '#1d2129';
export const TEXT_MUTED = '#646b76';
export const TEXT_FAINT = '#9aa0ab';
export const GOOD = '#1b8a4f';
export const WARN = '#b07a36';
export const BAD = '#c0443d';

export const FONT = 'Inter, sans-serif';

/** Interaction states (hover / focus / press / entrance) that inline styles cannot express. */
export function CcGlobalStyles() {
  return (
    <style>{`
      .ccd-root, .ccd-root * { box-sizing: border-box; }
      .ccd-root { -webkit-font-smoothing: antialiased; }
      .ccd-root button, .ccd-root input, .ccd-root textarea, .ccd-root select { font-family: inherit; }
      .ccd-root h1 { font-family: 'Inter Tight', Inter, sans-serif !important; letter-spacing: -0.025em !important; }
      .ccd-root h1 { background: var(--ccd-heading-gradient); -webkit-background-clip: text; background-clip: text; color: transparent !important; }
      .ccd-root button:focus-visible, .ccd-root [role="button"]:focus-visible, .ccd-root [role="radio"]:focus-visible, .ccd-root [role="checkbox"]:focus-visible, .ccd-root a:focus-visible {
        outline: 2px solid var(--ccd-brand); outline-offset: 2px; border-radius: 8px;
      }

      /* Cards: layered soft shadow on the Signals tint */
      .ccd-panel { box-shadow: var(--ccd-shadow-card); transition: box-shadow 220ms ease-out, border-color 220ms ease-out; }
      .ccd-panel:hover { box-shadow: var(--ccd-shadow-card-hover); }
      .ccd-root section { box-shadow: var(--ccd-shadow-card); }
      .ccd-hero { position: relative; border-radius: 22px !important; box-shadow: var(--ccd-shadow-hero) !important; }
      .ccd-hero::before { content: ""; position: absolute; inset: 0 0 auto 0; height: 4px; background: var(--ccd-gradient-primary); }
      .ccd-seg:hover:not(:disabled) { background: var(--ccd-ghost-hover) !important; }
      .ccd-seg[aria-current="step"]:hover { background: transparent !important; }
      .ccd-grow { animation: ccd-grow 600ms cubic-bezier(.22,.8,.3,1) 200ms both; }
      .ccd-root [role="radio"].ccd-pick { border-radius: 14px !important; padding: 20px 22px !important; }

      /* Buttons */
      .ccd-btn { transition: background 160ms ease-out, color 160ms ease-out, transform 120ms ease-out, box-shadow 200ms ease-out, border-color 160ms ease-out; }
      .ccd-btn:active:not(:disabled) { transform: scale(0.97); }
      .ccd-primary:not(:disabled) { background: var(--ccd-gradient-primary) !important; box-shadow: var(--ccd-shadow-brand); }
      .ccd-primary:hover:not(:disabled) { box-shadow: var(--ccd-shadow-brand-hover); transform: translateY(-1px); filter: saturate(1.08); }
      .ccd-primary svg { transition: transform 200ms ease-out; }
      .ccd-primary:hover:not(:disabled) svg { transform: translateX(3px); }
      .ccd-ghost:hover:not(:disabled) { background: var(--ccd-ghost-hover) !important; }
      .ccd-link { transition: opacity 140ms ease-out; }
      .ccd-link:hover { text-decoration: underline; text-underline-offset: 3px; }

      /* Rows & tables */
      .ccd-row { transition: background-color 140ms ease-out; }
      .ccd-row:hover { background: var(--ccd-row-hover) !important; }
      .ccd-root table { border-collapse: separate; border-spacing: 0; }
      .ccd-root thead th { letter-spacing: .02em; }
      .ccd-root tbody tr { transition: background-color 140ms ease-out; }
      .ccd-root tbody tr:hover > td { background-color: var(--ccd-row-hover); }

      /* Selectable tiles */
      .ccd-pick { transition: border-color 180ms ease-out, background-color 180ms ease-out, box-shadow 220ms ease-out, transform 180ms cubic-bezier(.2,.8,.3,1); }
      .ccd-pick:hover:not([aria-disabled="true"]) { border-color: #c9b6e0 !important; transform: translateY(-2px); box-shadow: var(--ccd-shadow-pick-hover); }
      .ccd-pick[aria-checked="true"], .ccd-pick[aria-pressed="true"], .ccd-pick[aria-selected="true"],
      .ccd-pick[aria-checked="true"]:hover:not([aria-disabled="true"]), .ccd-pick[aria-pressed="true"]:hover:not([aria-disabled="true"]), .ccd-pick[aria-selected="true"]:hover:not([aria-disabled="true"]) { box-shadow: none; }

      /* Inputs */
      .ccd-input { transition: border-color 140ms ease-out, box-shadow 160ms ease-out, background-color 140ms ease-out; }
      .ccd-input:hover { border-color: #cdd2dc !important; }
      .ccd-input:focus { border-color: var(--ccd-brand) !important; outline: none; background-color: #fff; }
      .ccd-num { font-variant-numeric: tabular-nums; }

      .ccd-scroll::-webkit-scrollbar { width: 10px; height: 10px; }
      .ccd-scroll::-webkit-scrollbar-thumb { background: #d6d9e1; border-radius: 999px; border: 2px solid transparent; background-clip: padding-box; }
      .ccd-scroll::-webkit-scrollbar-thumb:hover { background-color: #c3b3d6; }

      /* Entrances */
      @keyframes ccd-enter { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      .ccd-enter { animation: ccd-enter 280ms cubic-bezier(.22,.8,.3,1) both; }
      .ccd-stage > * { animation: ccd-enter 420ms cubic-bezier(.22,.8,.3,1) both; }
      .ccd-stage > *:nth-child(2) { animation-delay: 60ms; }
      .ccd-stage > *:nth-child(3) { animation-delay: 120ms; }
      .ccd-stage > *:nth-child(4) { animation-delay: 180ms; }
      .ccd-stage > *:nth-child(n+5) { animation-delay: 220ms; }
      .ccd-stage section { animation: ccd-enter 460ms cubic-bezier(.22,.8,.3,1) both; animation-delay: 140ms; }
      @keyframes ccd-pop { 0% { transform: scale(.4); opacity: 0; } 70% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(1); } }
      .ccd-pop { animation: ccd-pop 360ms cubic-bezier(.2,.9,.3,1.3) both; }
      @keyframes ccd-pulse { 0%,100% { opacity: 1; } 50% { opacity: .4; } }
      .ccd-pulse { animation: ccd-pulse 1.6s ease-in-out infinite; }
      @keyframes ccd-shimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }
      .ccd-shimmer { background-image: linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent); background-size: 200% 100%; animation: ccd-shimmer 1.4s linear infinite; }
      @keyframes ccd-slide-fwd { from { opacity: 0; transform: translateX(34px); } to { opacity: 1; transform: none; } }
      @keyframes ccd-slide-back { from { opacity: 0; transform: translateX(-34px); } to { opacity: 1; transform: none; } }
      .ccd-tr-fwd { animation: ccd-slide-fwd 380ms cubic-bezier(.22,.8,.3,1) both; }
      .ccd-tr-back { animation: ccd-slide-back 380ms cubic-bezier(.22,.8,.3,1) both; }
      @keyframes ccd-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      @media (prefers-reduced-motion: reduce) {
        .ccd-enter, .ccd-tr-fwd, .ccd-tr-back, .ccd-stage > *, .ccd-stage section, .ccd-pop, .ccd-pulse, .ccd-shimmer { animation: none !important; }
        .ccd-btn, .ccd-row, .ccd-pick, .ccd-input { transition: none; }
        .ccd-pick:hover { transform: none !important; }
      }
    `}</style>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────────────────────

export function CheckIcon({ size = 12, color = '#fff' }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden><path d="M3 8.2l3.3 3.3L13 4.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function ChevronRightIcon({ size = 12, color = 'currentColor' }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden><path d="M6 3.5l5 4.5-5 4.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function ArrowRightIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden><path d="M3 8h10M9 4l4 4-4 4" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function SparkleGlyph({ size = 13, color = BRAND }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden><path d="M8 1.5l1.6 4.9 4.9 1.6-4.9 1.6L8 14.5l-1.6-4.9-4.9-1.6 4.9-1.6z" fill={color} /></svg>;
}
export function WarningIcon({ size = 13, color = BAD }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden><path d="M8 1.8l6.6 11.4H1.4z" fill={color} /><rect x="7.3" y="6" width="1.4" height="4" rx="0.7" fill="#fff" /><rect x="7.3" y="11" width="1.4" height="1.4" rx="0.7" fill="#fff" /></svg>;
}
export function InfoIcon({ size = 13, color = TEXT_MUTED }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden><circle cx="8" cy="8" r="6.3" stroke={color} strokeWidth="1.3" /><rect x="7.3" y="7" width="1.4" height="4.5" rx="0.7" fill={color} /><rect x="7.3" y="4.2" width="1.4" height="1.4" rx="0.7" fill={color} /></svg>;
}
export function SearchIcon({ size = 14, color = TEXT_FAINT }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden><circle cx="7" cy="7" r="4.6" stroke={color} strokeWidth="1.5" /><path d="M10.6 10.6L14 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" /></svg>;
}

// ── Controls ──────────────────────────────────────────────────────────────────────────────────

export function Checkbox({ checked, disabled, size = 17 }: { checked: boolean; disabled?: boolean; size?: number }) {
  return (
    <span
      aria-hidden
      style={{
        width: size, height: size, borderRadius: 5, flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        border: `1.5px solid ${checked ? BRAND : '#cfd4dc'}`,
        background: checked ? 'var(--ccd-gradient-primary)' : disabled ? '#f1f2f4' : '#fff',
        boxShadow: 'inset 0 1px 1px rgba(16,24,40,.04)',
        transition: 'background-color 140ms ease-out, border-color 140ms ease-out, box-shadow 160ms ease-out',
      }}
    >
      {checked && <span className="ccd-pop" style={{ display: 'inline-flex' }}><CheckIcon size={size - 7} /></span>}
    </span>
  );
}

export function Radio({ checked, disabled }: { checked: boolean; disabled?: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        width: 18, height: 18, borderRadius: '50%', flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        border: `1.5px solid ${checked ? BRAND : '#cfd4dc'}`, background: disabled ? '#f1f2f4' : '#fff',
        boxShadow: 'none',
        transition: 'border-color 140ms ease-out, box-shadow 200ms ease-out',
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ccd-gradient-primary)', transform: checked ? 'scale(1)' : 'scale(0)', transition: 'transform 220ms cubic-bezier(.2,.9,.3,1.4)' }} />
    </span>
  );
}

export function PrimaryButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button" className="ccd-btn ccd-primary" onClick={onClick} disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 20px', borderRadius: 10, border: 'none',
        background: disabled ? '#efe9f6' : BRAND, color: disabled ? '#bfaed4' : '#fff', font: `600 13.5px/1 ${FONT}`,
        letterSpacing: '-0.005em', cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button" className="ccd-btn ccd-ghost" onClick={onClick}
      style={{ padding: '11px 16px', borderRadius: 10, border: `1px solid ${BORDER}`, background: '#fff', color: '#3d434b', font: `600 13.5px/1 ${FONT}`, cursor: 'pointer', boxShadow: '0 1px 2px rgba(16,24,40,.04)' }}
    >
      {children}
    </button>
  );
}

export function TextButton({ children, onClick, tone = BRAND }: { children: React.ReactNode; onClick: () => void; tone?: string }) {
  return (
    <button type="button" className="ccd-link" onClick={onClick} style={{ padding: 0, border: 'none', background: 'none', color: tone, font: `600 12.5px/1.4 ${FONT}`, cursor: 'pointer' }}>
      {children}
    </button>
  );
}

// ── Layout pieces ─────────────────────────────────────────────────────────────────────────────

import { GroupSwitch } from './campaign-inline-summary';

/** The page heading. On the pages set up group by group the title ends in the group dropdown: "Set your goals for Group 1". */
export function StepHeading({ eyebrow, title, aside, group }: {
  eyebrow?: string; title: string; aside?: React.ReactNode;
  /** A group dropdown of the page's own (wrapped in HeadingGroup), in place of the one from the flow. */
  group?: React.ReactNode;
}) {
  return (
    <header className="ccd-step-heading">
      {eyebrow && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 999, background: BRAND_TINT, border: `1px solid ${BRAND_LINE}`, font: `600 11.5px/1 ${FONT}`, color: BRAND, marginBottom: 14, letterSpacing: '.02em' }}>
          <SparkleGlyph size={10} />{eyebrow}
        </div>
      )}
      <div className="ccd-step-heading__row">
        <h1 style={{ margin: 0, font: `600 20px/1.3 'Inter Tight', Inter, sans-serif`, color: TEXT_PRIMARY }}>{title}{group ?? <GroupSwitch />}</h1>
        {aside && <div className="ccd-step-heading__tools">{aside}</div>}
      </div>
    </header>
  );
}

export function SectionTitle({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
      <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, font: `600 14.5px/1.3 ${FONT}`, color: TEXT_PRIMARY, letterSpacing: '-0.01em' }}>
        <span aria-hidden style={{ width: 3, height: 14, borderRadius: 3, background: 'var(--ccd-gradient-primary)' }} />
        {children}
      </h2>
      {aside}
    </div>
  );
}

export function Note({ tone = 'info', children }: { tone?: 'info' | 'warn'; children: React.ReactNode }) {
  const warn = tone === 'warn';
  return (
    <div className="ccd-enter" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '11px 14px', borderRadius: 10, background: warn ? 'linear-gradient(135deg,#fff8ee,#fdf3e6)' : 'linear-gradient(135deg,#f9f4fd,#f3ecfa)', border: `1px solid ${warn ? '#f1dfc4' : BRAND_LINE}`, font: `400 12.5px/1.55 ${FONT}`, color: '#3d434b' }}>
      <span style={{ flex: 'none', marginTop: 2 }}>{warn ? <WarningIcon size={12} color={WARN} /> : <SparkleGlyph size={12} />}</span>
      <span>{children}</span>
    </div>
  );
}
