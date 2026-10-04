import { useState } from 'react';
import type { CcStepId } from './campaign-creator.types';

// Shared, self-contained inline-style building blocks for the Smart Campaign Creation wizard.
// Deliberately has no dependency on any other feature area (Signals/MUI) — a fresh, isolated look.

export const BRAND = '#77469b';
export const BRAND_TINT = '#f6f2fb';
export const BORDER = '#e6e8ec';
export const TEXT_PRIMARY = '#23272d';
export const TEXT_MUTED = '#6b7178';
export const TEXT_FAINT = '#9aa0a8';
export const GOOD = '#1e8449';
export const WARN = '#a8763f';
export const BAD = '#b3453f';

export function CheckIcon({ size = 12, color = '#fff' }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M3 8.2l3.3 3.3L13 4.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function ChevronRightIcon({ size = 12, color = 'currentColor' }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M6 3.5l5 4.5-5 4.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function ChevronDownIcon({ size = 10, color = 'currentColor' }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M3.5 6l4.5 5 4.5-5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function SparkleGlyph({ size = 13, color = BRAND }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M8 1.5l1.6 4.9 4.9 1.6-4.9 1.6L8 14.5l-1.6-4.9-4.9-1.6 4.9-1.6z" fill={color} /></svg>;
}
export function WarningIcon({ size = 13, color = BAD }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M8 1.8l6.6 11.4H1.4z" fill={color} /><rect x="7.3" y="6" width="1.4" height="4" rx="0.7" fill="#fff" /><rect x="7.3" y="11" width="1.4" height="1.4" rx="0.7" fill="#fff" /></svg>;
}
export function InfoIcon({ size = 13, color = TEXT_MUTED }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.3" stroke={color} strokeWidth="1.3" /><rect x="7.3" y="7" width="1.4" height="4.5" rx="0.7" fill={color} /><rect x="7.3" y="4.2" width="1.4" height="1.4" rx="0.7" fill={color} /></svg>;
}

export function pressable(): React.CSSProperties {
  return { transition: 'opacity 120ms ease-out, transform 80ms ease-out', cursor: 'pointer' };
}

/** Horizontal numbered stepper — click-to-jump gated by how far the user has actually progressed. */
export function WizardStepper({ steps, current, furthestIndex, onJump }: {
  steps: { id: CcStepId; label: string }[];
  current: CcStepId;
  furthestIndex: number;
  onJump: (id: CcStepId) => void;
}) {
  const currentIndex = steps.findIndex((s) => s.id === current);
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '18px 28px', borderBottom: `1px solid ${BORDER}`, background: '#fff', flex: 'none', overflowX: 'auto' }}>
      {steps.map((s, i) => {
        const active = i === currentIndex;
        const done = i < currentIndex;
        const reachable = i <= furthestIndex;
        return (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: i === steps.length - 1 ? 'none' : 1 }}>
            <div
              onClick={() => reachable && onJump(s.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: reachable ? 'pointer' : 'default', flex: 'none', opacity: reachable ? 1 : 0.45 }}
            >
              <span style={{
                width: 26, height: 26, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? GOOD : active ? BRAND : '#fff', border: `1.5px solid ${done ? GOOD : active ? BRAND : '#dfe3ea'}`,
                font: '700 11.5px/1 Inter,sans-serif', color: done || active ? '#fff' : TEXT_FAINT,
                transition: 'background 140ms ease-out, border-color 140ms ease-out',
              }}>
                {done ? <CheckIcon size={11} /> : i + 1}
              </span>
              <span style={{ font: `${active ? 700 : 500} 12.5px/1 Inter,sans-serif`, color: active ? TEXT_PRIMARY : TEXT_MUTED, whiteSpace: 'nowrap' as const }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && <span style={{ flex: 1, height: 1, background: i < currentIndex ? GOOD : BORDER, margin: '0 14px', minWidth: 24, transition: 'background 140ms ease-out' }} />}
          </div>
        );
      })}
    </div>
  );
}

export function StepHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ font: '700 19px/1.3 Inter,sans-serif', color: TEXT_PRIMARY }}>{title}</div>
      {subtitle && <div style={{ font: '400 13px/1.6 Inter,sans-serif', color: TEXT_MUTED, marginTop: 6, maxWidth: 640 }}>{subtitle}</div>}
    </div>
  );
}

export function SectionCard({ title, action, children, style }: { title?: string; action?: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, ...style }}>
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ font: '700 13px/1 Inter,sans-serif', color: TEXT_PRIMARY }}>{title}</div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function Pill({ label, color = TEXT_MUTED, bg = '#f1f2f4' }: { label: string; color?: string; bg?: string }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 999, background: bg, font: '700 10px/1.5 Inter,sans-serif', letterSpacing: '0.03em', textTransform: 'uppercase' as const, color }}>{label}</span>;
}

export function RecommendedBadge() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 999, background: BRAND_TINT, font: '700 10px/1.5 Inter,sans-serif', letterSpacing: '0.03em', textTransform: 'uppercase' as const, color: BRAND }}>
      <SparkleGlyph size={9} /> Recommended
    </span>
  );
}

/** Purple "why we're recommending this" callout with an optional expandable explanation. */
export function WhyRecommended({ reason }: { reason: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 9, background: BRAND_TINT, border: `1px solid #e3d8f0` }}>
      <span style={{ flex: 'none', marginTop: 1 }}><SparkleGlyph size={14} /></span>
      <div>
        <div style={{ font: '700 11.5px/1.4 Inter,sans-serif', color: '#5f3880', marginBottom: 3 }}>Why we're recommending this</div>
        <div style={{ font: '400 12.5px/1.55 Inter,sans-serif', color: '#3d434b' }}>{reason}</div>
      </div>
    </div>
  );
}

export function WarningBanner({ title, detail, children }: { title: string; detail?: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '12px 14px', borderRadius: 9, background: '#fdf3f2', border: '1px solid #f3d6d3' }}>
      <span style={{ flex: 'none', marginTop: 1 }}><WarningIcon size={14} /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: '700 12px/1.4 Inter,sans-serif', color: BAD }}>{title}</div>
        {detail && <div style={{ font: '400 12px/1.5 Inter,sans-serif', color: '#6b3330', marginTop: 3 }}>{detail}</div>}
        {children}
      </div>
    </div>
  );
}

export function PrimaryBtn({ label, onClick, disabled, icon }: { label: string; onClick: () => void; disabled?: boolean; icon?: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 8, border: 'none',
        background: disabled ? '#eee7f5' : BRAND, color: disabled ? '#c3b3d6' : '#fff',
        font: '600 13px/1 Inter,sans-serif', cursor: disabled ? 'default' : 'pointer', ...pressable(),
      }}
    >
      {label}{icon}
    </button>
  );
}

export function SecondaryBtn({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '10px 18px', borderRadius: 8, border: `1px solid ${BORDER}`, background: '#fff',
        color: disabled ? '#c7cad1' : '#3d434b', font: '600 13px/1 Inter,sans-serif', cursor: disabled ? 'default' : 'pointer', ...pressable(),
      }}
    >
      {label}
    </button>
  );
}

export function WizardFooter({ onBack, onNext, backLabel = 'Back', nextLabel = 'Continue', nextDisabled, rightSlot }: {
  onBack?: () => void; onNext?: () => void; backLabel?: string; nextLabel?: string; nextDisabled?: boolean; rightSlot?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', borderTop: `1px solid ${BORDER}`, background: '#fff', flex: 'none' }}>
      <div>{onBack && <SecondaryBtn label={backLabel} onClick={onBack} />}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {rightSlot}
        {onNext && <PrimaryBtn label={nextLabel} onClick={onNext} disabled={nextDisabled} icon={<ChevronRightIcon size={13} color={nextDisabled ? '#c3b3d6' : '#fff'} />} />}
      </div>
    </div>
  );
}

/** A selectable card — used for marketplace/ad-type/objective/structure pickers. */
export function ChoiceCard({ selected, onClick, disabled, children, minWidth = 200 }: { selected: boolean; onClick: () => void; disabled?: boolean; children: React.ReactNode; minWidth?: number }) {
  return (
    <div
      onClick={() => !disabled && onClick()}
      style={{
        flex: `1 1 ${minWidth}px`, minWidth, padding: 16, borderRadius: 11, cursor: disabled ? 'default' : 'pointer',
        border: `1.5px solid ${selected ? BRAND : BORDER}`, background: selected ? BRAND_TINT : disabled ? '#fafbfd' : '#fff',
        opacity: disabled ? 0.55 : 1, position: 'relative' as const, transition: 'border-color 120ms ease-out, background 120ms ease-out',
      }}
    >
      {children}
    </div>
  );
}

export function CheckboxRow({ checked, onChange, label, description, disabled, right }: {
  checked: boolean; onChange: () => void; label: React.ReactNode; description?: string; disabled?: boolean; right?: React.ReactNode;
}) {
  return (
    <div
      onClick={() => !disabled && onChange()}
      style={{ display: 'flex', alignItems: 'flex-start', gap: 11, padding: '11px 13px', borderRadius: 9, border: `1px solid ${checked ? BRAND : BORDER}`, background: checked ? BRAND_TINT : '#fff', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1 }}
    >
      <span style={{ width: 17, height: 17, borderRadius: 5, border: `1.5px solid ${checked ? BRAND : '#cfd4dc'}`, background: checked ? BRAND : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: 1 }}>
        {checked && <CheckIcon size={10} />}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: '600 12.5px/1.4 Inter,sans-serif', color: TEXT_PRIMARY }}>{label}</div>
        {description && <div style={{ font: '400 11.5px/1.5 Inter,sans-serif', color: TEXT_MUTED, marginTop: 2 }}>{description}</div>}
      </div>
      {right}
    </div>
  );
}

export function Collapsible({ label, defaultOpen = false, children }: { label: React.ReactNode; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <div onClick={() => setOpen((v) => !v)} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', padding: '4px 0' }}>
        <span style={{ display: 'flex', transform: open ? 'none' : 'rotate(-90deg)', transition: 'transform 140ms ease-out' }}><ChevronDownIcon size={10} color={TEXT_MUTED} /></span>
        {label}
      </div>
      {open && <div style={{ marginTop: 10 }}>{children}</div>}
    </div>
  );
}

export function StatRow({ stats }: { stats: { label: string; value: React.ReactNode }[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 24 }}>
      {stats.map((s) => (
        <div key={s.label}>
          <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: TEXT_FAINT, marginBottom: 6 }}>{s.label}</div>
          <div style={{ font: '700 18px/1 Inter,sans-serif', color: TEXT_PRIMARY }}>{s.value}</div>
        </div>
      ))}
    </div>
  );
}
