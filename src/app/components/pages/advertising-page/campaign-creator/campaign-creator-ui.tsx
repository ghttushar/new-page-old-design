// Shared building blocks for the Smart Campaign Creator. Same palette and Inter typeface as the rest of
// the app — the layout language (flat surfaces, hairlines, left-aligned content) is what changed.

export const BRAND = '#77469b';
export const BRAND_HOVER = '#6a3d8b';
export const BRAND_TINT = '#f6f2fb';
export const BRAND_LINE = '#e3d8f0';
export const BORDER = '#e6e8ec';
export const HAIR = '#eef0f3';
export const SURFACE_MUTED = '#fafbfd';
export const TEXT_PRIMARY = '#23272d';
export const TEXT_MUTED = '#6b7178';
export const TEXT_FAINT = '#9aa0a8';
export const GOOD = '#1e8449';
export const WARN = '#a8763f';
export const BAD = '#b3453f';

export const FONT = 'Inter, sans-serif';

/** Interaction states (hover / focus / press / entrance) that inline styles cannot express. */
export function CcGlobalStyles() {
  return (
    <style>{`
      .cc-root, .cc-root * { box-sizing: border-box; }
      .cc-root button, .cc-root input, .cc-root textarea, .cc-root select { font-family: inherit; }
      .cc-root button:focus-visible, .cc-root [role="button"]:focus-visible, .cc-root [role="radio"]:focus-visible, .cc-root [role="checkbox"]:focus-visible, .cc-root a:focus-visible {
        outline: 2px solid ${BRAND}; outline-offset: 2px; border-radius: 8px;
      }
      .cc-btn { transition: background-color 140ms ease-out, color 140ms ease-out, transform 80ms ease-out, border-color 140ms ease-out; }
      .cc-btn:active:not(:disabled) { transform: scale(0.98); }
      .cc-primary:hover:not(:disabled) { background: ${BRAND_HOVER} !important; }
      .cc-ghost:hover:not(:disabled) { background: #f1f2f4 !important; }
      .cc-link:hover { text-decoration: underline; }
      .cc-row { transition: background-color 120ms ease-out; }
      .cc-row:hover { background: ${SURFACE_MUTED}; }
      .cc-pick { transition: border-color 140ms ease-out, background-color 140ms ease-out; }
      .cc-pick:hover:not([aria-disabled="true"]) { border-color: #cdbfe0 !important; }
      .cc-input { transition: border-color 120ms ease-out, box-shadow 120ms ease-out; }
      .cc-input:hover { border-color: #cfd4dc !important; }
      .cc-input:focus { border-color: ${BRAND} !important; box-shadow: 0 0 0 3px #efe6f7; outline: none; }
      .cc-num { font-variant-numeric: tabular-nums; }
      .cc-scroll::-webkit-scrollbar { width: 10px; height: 10px; }
      .cc-scroll::-webkit-scrollbar-thumb { background: #d9dce2; border-radius: 999px; border: 2px solid #fff; }
      @keyframes cc-enter { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
      .cc-enter { animation: cc-enter 220ms ease-out both; }
      @keyframes cc-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      @media (prefers-reduced-motion: reduce) { .cc-enter { animation: none; } .cc-btn, .cc-row, .cc-pick, .cc-input { transition: none; } }
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
        border: `1.5px solid ${checked ? BRAND : '#cfd4dc'}`, background: checked ? BRAND : disabled ? '#f1f2f4' : '#fff',
        transition: 'background-color 120ms ease-out, border-color 120ms ease-out',
      }}
    >
      {checked && <CheckIcon size={size - 7} />}
    </span>
  );
}

export function Radio({ checked, disabled }: { checked: boolean; disabled?: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        width: 18, height: 18, borderRadius: '50%', flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        border: `1.5px solid ${checked ? BRAND : '#cfd4dc'}`, background: disabled ? '#f1f2f4' : '#fff', transition: 'border-color 120ms ease-out',
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: BRAND, transform: checked ? 'scale(1)' : 'scale(0)', transition: 'transform 140ms ease-out' }} />
    </span>
  );
}

export function PrimaryButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button" className="cc-btn cc-primary" onClick={onClick} disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8, border: 'none',
        background: disabled ? '#eee7f5' : BRAND, color: disabled ? '#c3b3d6' : '#fff', font: `600 13px/1 ${FONT}`,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button" className="cc-btn cc-ghost" onClick={onClick}
      style={{ padding: '10px 14px', borderRadius: 8, border: 'none', background: 'transparent', color: '#3d434b', font: `600 13px/1 ${FONT}`, cursor: 'pointer' }}
    >
      {children}
    </button>
  );
}

export function TextButton({ children, onClick, tone = BRAND }: { children: React.ReactNode; onClick: () => void; tone?: string }) {
  return (
    <button type="button" className="cc-link" onClick={onClick} style={{ padding: 0, border: 'none', background: 'none', color: tone, font: `600 12.5px/1.4 ${FONT}`, cursor: 'pointer' }}>
      {children}
    </button>
  );
}

// ── Layout pieces ─────────────────────────────────────────────────────────────────────────────

export function StepHeading({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <header style={{ marginBottom: 28 }}>
      {eyebrow && <div style={{ font: `500 12.5px/1 ${FONT}`, color: TEXT_FAINT, marginBottom: 10 }}>{eyebrow}</div>}
      <h1 style={{ margin: 0, font: `600 24px/1.25 ${FONT}`, letterSpacing: '-0.015em', color: TEXT_PRIMARY }}>{title}</h1>
      {subtitle && <p style={{ margin: '8px 0 0', maxWidth: 580, font: `400 14px/1.6 ${FONT}`, color: TEXT_MUTED }}>{subtitle}</p>}
    </header>
  );
}

export function SectionTitle({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
      <h2 style={{ margin: 0, font: `600 14px/1.3 ${FONT}`, color: TEXT_PRIMARY }}>{children}</h2>
      {aside}
    </div>
  );
}

/** "Recommended" shown as quiet brand-coloured text instead of a filled badge. */
export function RecommendedTag({ children = 'Recommended' }: { children?: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, font: `600 11.5px/1 ${FONT}`, color: BRAND }}>
      <SparkleGlyph size={10} /> {children}
    </span>
  );
}

export function Note({ tone = 'info', children }: { tone?: 'info' | 'warn'; children: React.ReactNode }) {
  const warn = tone === 'warn';
  return (
    <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', padding: '10px 12px', borderRadius: 8, background: warn ? '#fdf8f1' : BRAND_TINT, font: `400 12.5px/1.55 ${FONT}`, color: '#3d434b' }}>
      <span style={{ flex: 'none', marginTop: 2 }}>{warn ? <WarningIcon size={12} color={WARN} /> : <SparkleGlyph size={12} />}</span>
      <span>{children}</span>
    </div>
  );
}
