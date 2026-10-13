// Shared building blocks for the Smart Campaign Creator. Same palette and Inter typeface as the rest of
// the app (Signals / Alerts), refined with depth, accent tints and motion.
// Colours mirror the --ccn-* tokens in src/styles.css; they stay as hex here because SVG presentation
// attributes (fill/stroke) cannot read CSS variables.
import { InlineSummary } from './campaign-inline-summary';

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
      .ccn-root, .ccn-root * { box-sizing: border-box; }
      .ccn-root { -webkit-font-smoothing: antialiased; }
      .ccn-root button, .ccn-root input, .ccn-root textarea, .ccn-root select { font-family: inherit; }
      .ccn-root h1 { font-family: 'Inter Tight', Inter, sans-serif !important; letter-spacing: -0.025em !important; }
      .ccn-root h1 { background: var(--ccn-heading-gradient); -webkit-background-clip: text; background-clip: text; color: transparent !important; }
      .ccn-root button:focus-visible, .ccn-root [role="button"]:focus-visible, .ccn-root [role="radio"]:focus-visible, .ccn-root [role="checkbox"]:focus-visible, .ccn-root a:focus-visible {
        outline: 2px solid var(--ccn-brand); outline-offset: 2px; border-radius: 8px;
      }

      /* Cards: layered soft shadow on the Signals tint */
      .ccn-panel { box-shadow: var(--ccn-shadow-card); transition: box-shadow 220ms ease-out, border-color 220ms ease-out; }
      .ccn-panel:hover { box-shadow: var(--ccn-shadow-card-hover); }
      .ccn-root section { box-shadow: var(--ccn-shadow-card); }
      .ccn-hero { position: relative; border-radius: 22px !important; box-shadow: var(--ccn-shadow-hero) !important; }
      .ccn-hero::before { content: ""; position: absolute; inset: 0 0 auto 0; height: 4px; background: var(--ccn-gradient-primary); }
      .ccn-seg:hover:not(:disabled) { background: var(--ccn-ghost-hover) !important; }
      .ccn-seg[aria-current="step"]:hover { background: transparent !important; }
      .ccn-grow { animation: ccn-grow 600ms cubic-bezier(.22,.8,.3,1) 200ms both; }
      .ccn-root [role="radio"].ccn-pick { border-radius: 14px !important; padding: 20px 22px !important; }

      /* Buttons */
      .ccn-btn { transition: background 160ms ease-out, color 160ms ease-out, transform 120ms ease-out, box-shadow 200ms ease-out, border-color 160ms ease-out; }
      .ccn-btn:active:not(:disabled) { transform: scale(0.97); }
      .ccn-primary:not(:disabled) { background: var(--ccn-gradient-primary) !important; box-shadow: var(--ccn-shadow-brand); }
      .ccn-primary:hover:not(:disabled) { box-shadow: var(--ccn-shadow-brand-hover); transform: translateY(-1px); filter: saturate(1.08); }
      .ccn-primary svg { transition: transform 200ms ease-out; }
      .ccn-primary:hover:not(:disabled) svg { transform: translateX(3px); }
      .ccn-ghost:hover:not(:disabled) { background: var(--ccn-ghost-hover) !important; }
      .ccn-link { transition: opacity 140ms ease-out; }
      .ccn-link:hover { text-decoration: underline; text-underline-offset: 3px; }

      /* Rows & tables */
      .ccn-row { transition: background-color 140ms ease-out; }
      .ccn-row:hover { background: var(--ccn-row-hover) !important; }
      .ccn-root table { border-collapse: separate; border-spacing: 0; }
      .ccn-root thead th { letter-spacing: .02em; }
      .ccn-root tbody tr { transition: background-color 140ms ease-out; }
      .ccn-root tbody tr:hover > td { background-color: var(--ccn-row-hover); }

      /* Selectable tiles */
      .ccn-pick { transition: border-color 180ms ease-out, background-color 180ms ease-out, box-shadow 220ms ease-out, transform 180ms cubic-bezier(.2,.8,.3,1); }
      .ccn-pick:hover:not([aria-disabled="true"]) { border-color: #c9b6e0 !important; transform: translateY(-2px); box-shadow: var(--ccn-shadow-pick-hover); }
      .ccn-pick[aria-checked="true"], .ccn-pick[aria-pressed="true"], .ccn-pick[aria-selected="true"],
      .ccn-pick[aria-checked="true"]:hover:not([aria-disabled="true"]), .ccn-pick[aria-pressed="true"]:hover:not([aria-disabled="true"]), .ccn-pick[aria-selected="true"]:hover:not([aria-disabled="true"]) { box-shadow: none; }

      /* Inputs */
      .ccn-input { transition: border-color 140ms ease-out, box-shadow 160ms ease-out, background-color 140ms ease-out; }
      .ccn-input:hover { border-color: #cdd2dc !important; }
      .ccn-input:focus { border-color: var(--ccn-brand) !important; box-shadow: 0 0 0 4px var(--ccn-brand-ring); outline: none; background-color: #fff; }
      .ccn-num { font-variant-numeric: tabular-nums; }

      .ccn-scroll::-webkit-scrollbar { width: 10px; height: 10px; }
      .ccn-scroll::-webkit-scrollbar-thumb { background: #d6d9e1; border-radius: 999px; border: 2px solid transparent; background-clip: padding-box; }
      .ccn-scroll::-webkit-scrollbar-thumb:hover { background-color: #c3b3d6; }

      /* Entrances */
      @keyframes ccn-enter { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      .ccn-enter { animation: ccn-enter 280ms cubic-bezier(.22,.8,.3,1) both; }
      .ccn-stage > * { animation: ccn-enter 420ms cubic-bezier(.22,.8,.3,1) both; }
      .ccn-stage > *:nth-child(2) { animation-delay: 60ms; }
      .ccn-stage > *:nth-child(3) { animation-delay: 120ms; }
      .ccn-stage > *:nth-child(4) { animation-delay: 180ms; }
      .ccn-stage > *:nth-child(n+5) { animation-delay: 220ms; }
      .ccn-stage section { animation: ccn-enter 460ms cubic-bezier(.22,.8,.3,1) both; animation-delay: 140ms; }
      @keyframes ccn-pop { 0% { transform: scale(.4); opacity: 0; } 70% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(1); } }
      .ccn-pop { animation: ccn-pop 360ms cubic-bezier(.2,.9,.3,1.3) both; }
      @keyframes ccn-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(119,70,155,.35); } 50% { box-shadow: 0 0 0 6px rgba(119,70,155,0); } }
      .ccn-pulse { animation: ccn-pulse 1.6s ease-in-out infinite; }
      @keyframes ccn-shimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }
      .ccn-shimmer { background-image: linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent); background-size: 200% 100%; animation: ccn-shimmer 1.4s linear infinite; }
      @keyframes ccn-slide-fwd { from { opacity: 0; transform: translateX(34px); } to { opacity: 1; transform: none; } }
      @keyframes ccn-slide-back { from { opacity: 0; transform: translateX(-34px); } to { opacity: 1; transform: none; } }
      .ccn-tr-fwd { animation: ccn-slide-fwd 380ms cubic-bezier(.22,.8,.3,1) both; }
      .ccn-tr-back { animation: ccn-slide-back 380ms cubic-bezier(.22,.8,.3,1) both; }
      @keyframes ccn-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      @media (prefers-reduced-motion: reduce) {
        .ccn-enter, .ccn-tr-fwd, .ccn-tr-back, .ccn-stage > *, .ccn-stage section, .ccn-pop, .ccn-pulse, .ccn-shimmer { animation: none !important; }
        .ccn-btn, .ccn-row, .ccn-pick, .ccn-input { transition: none; }
        .ccn-pick:hover { transform: none !important; }
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
        background: checked ? 'var(--ccn-gradient-primary)' : disabled ? '#f1f2f4' : '#fff',
        boxShadow: 'inset 0 1px 1px rgba(16,24,40,.04)',
        transition: 'background-color 140ms ease-out, border-color 140ms ease-out, box-shadow 160ms ease-out',
      }}
    >
      {checked && <span className="ccn-pop" style={{ display: 'inline-flex' }}><CheckIcon size={size - 7} /></span>}
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
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ccn-gradient-primary)', transform: checked ? 'scale(1)' : 'scale(0)', transition: 'transform 220ms cubic-bezier(.2,.9,.3,1.4)' }} />
    </span>
  );
}

export function PrimaryButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button" className="ccn-btn ccn-primary" onClick={onClick} disabled={disabled}
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
      type="button" className="ccn-btn ccn-ghost" onClick={onClick}
      style={{ padding: '11px 16px', borderRadius: 10, border: `1px solid ${BORDER}`, background: '#fff', color: '#3d434b', font: `600 13.5px/1 ${FONT}`, cursor: 'pointer', boxShadow: '0 1px 2px rgba(16,24,40,.04)' }}
    >
      {children}
    </button>
  );
}

export function TextButton({ children, onClick, tone = BRAND }: { children: React.ReactNode; onClick: () => void; tone?: string }) {
  return (
    <button type="button" className="ccn-link" onClick={onClick} style={{ padding: 0, border: 'none', background: 'none', color: tone, font: `600 12.5px/1.4 ${FONT}`, cursor: 'pointer' }}>
      {children}
    </button>
  );
}

// ── Layout pieces ─────────────────────────────────────────────────────────────────────────────

export function StepHeading({ eyebrow, title, summary = true }: { eyebrow?: string; title: string; summary?: boolean }) {
  return (
    <header className="ccn-step-heading">
      {eyebrow && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 999, background: BRAND_TINT, border: `1px solid ${BRAND_LINE}`, font: `600 11.5px/1 ${FONT}`, color: BRAND, marginBottom: 14, letterSpacing: '.02em' }}>
          <SparkleGlyph size={10} />{eyebrow}
        </div>
      )}
      <h1 style={{ margin: 0, font: `700 22px/1.25 'Inter Tight', Inter, sans-serif`, color: TEXT_PRIMARY }}>{title}</h1>
      {summary && <InlineSummary />}
    </header>
  );
}

export function SectionTitle({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
      <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, font: `600 14.5px/1.3 ${FONT}`, color: TEXT_PRIMARY, letterSpacing: '-0.01em' }}>
        <span aria-hidden style={{ width: 3, height: 14, borderRadius: 3, background: 'var(--ccn-gradient-primary)' }} />
        {children}
      </h2>
      {aside}
    </div>
  );
}

export function Note({ tone = 'info', children }: { tone?: 'info' | 'warn'; children: React.ReactNode }) {
  const warn = tone === 'warn';
  return (
    <div className="ccn-enter" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '11px 14px', borderRadius: 10, background: warn ? 'linear-gradient(135deg,#fff8ee,#fdf3e6)' : 'linear-gradient(135deg,#f9f4fd,#f3ecfa)', border: `1px solid ${warn ? '#f1dfc4' : BRAND_LINE}`, font: `400 12.5px/1.55 ${FONT}`, color: '#3d434b' }}>
      <span style={{ flex: 'none', marginTop: 2 }}>{warn ? <WarningIcon size={12} color={WARN} /> : <SparkleGlyph size={12} />}</span>
      <span>{children}</span>
    </div>
  );
}
