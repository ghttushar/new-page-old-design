import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRightIcon } from '../campaign-creator-ui';

// One date range for the Products step: both tables show their metrics for it.

export interface DateRange { preset: '7' | '14' | '30' | '60' | '90' | 'custom'; from: string; to: string }

const PRESETS: { id: DateRange['preset']; label: string; days: number }[] = [
  { id: '7', label: 'Last 7 days', days: 7 },
  { id: '14', label: 'Last 14 days', days: 14 },
  { id: '30', label: 'Last 30 days', days: 30 },
  { id: '60', label: 'Last 60 days', days: 60 },
  { id: '90', label: 'Last 90 days', days: 90 },
];

const DAY = 86_400_000;
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const parse = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const today = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); };
const MAX_DAYS = 365;

export function rangeFor(preset: Exclude<DateRange['preset'], 'custom'>): DateRange {
  const days = PRESETS.find((p) => p.id === preset)?.days ?? 30;
  const to = today();
  return { preset, from: iso(new Date(to.getTime() - (days - 1) * DAY)), to: iso(to) };
}

export const DEFAULT_RANGE: DateRange = rangeFor('30');

/** How many days the range covers, both ends included. */
export const daysIn = (r: DateRange): number => Math.max(1, Math.round((parse(r.to).getTime() - parse(r.from).getTime()) / DAY) + 1);

const fmt = (s: string) => parse(s).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
const label = (r: DateRange) => (r.preset === 'custom' ? 'Custom range' : PRESETS.find((p) => p.id === r.preset)?.label ?? 'Date range');

const CalendarIcon = () => <svg width={15} height={15} viewBox="0 0 16 16" fill="none" aria-hidden><rect x="2" y="3" width="12" height="10.5" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M2 6.5h12M5.5 1.8v2.6M10.5 1.8v2.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;

export default function DateRangeSelect({ value, onChange }: { value: DateRange; onChange: (next: DateRange) => void }) {
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const [from, setFrom] = useState(value.from);
  const [to, setTo] = useState(value.to);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef(() => setAnchor(null));

  useEffect(() => {
    if (!anchor) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { closeRef.current(); triggerRef.current?.focus(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [anchor]);

  const max = iso(today());
  const customDays = from && to ? Math.round((parse(to).getTime() - parse(from).getTime()) / DAY) + 1 : 0;
  const customError = !from || !to ? 'Choose a start and an end date.'
    : from > to ? 'The start date is after the end date.'
    : to > max ? 'The end date can\'t be in the future.'
    : customDays > MAX_DAYS ? `Pick a range of up to ${MAX_DAYS} days.`
    : null;

  const width = 300;
  const left = anchor ? Math.max(8, Math.min(anchor.right - width, window.innerWidth - width - 8)) : 0;
  const top = anchor ? Math.min(anchor.bottom + 8, Math.max(8, window.innerHeight - 440)) : 0;

  return (
    <>
      <button
        ref={triggerRef} type="button" className="ccd-dr-trigger" aria-haspopup="dialog" aria-expanded={anchor !== null}
        onClick={(e) => { setFrom(value.from); setTo(value.to); setAnchor(anchor ? null : e.currentTarget.getBoundingClientRect()); }}
      >
        <CalendarIcon />
        <span className="ccd-dr-label">{label(value)}</span>
        <span className="ccd-dr-dates ccd-num">{fmt(value.from)} to {fmt(value.to)}</span>
        <span className="ccd-dr-chev" aria-hidden><ChevronRightIcon size={11} /></span>
      </button>

      {anchor && createPortal(
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 239 }} onMouseDown={() => setAnchor(null)} />
          <div role="dialog" aria-label="Choose a date range" className="ccd-dr-pop" onMouseDown={(e) => e.stopPropagation()} style={{ top, left, width }}>
            <div className="ccd-dr-list" role="radiogroup" aria-label="Date range">
              {PRESETS.map((p) => (
                <button
                  key={p.id} type="button" role="radio" aria-checked={value.preset === p.id} className={`ccd-dr-opt${value.preset === p.id ? ' is-on' : ''}`}
                  onClick={() => { onChange(rangeFor(p.id as Exclude<DateRange['preset'], 'custom'>)); setAnchor(null); }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="ccd-dr-custom">
              <div className="ccd-dr-custom__title">Custom range</div>
              <div className="ccd-dr-fields">
                <label><span>From</span><input type="date" className="ccd-input" value={from} max={max} onChange={(e) => setFrom(e.target.value)} /></label>
                <label><span>To</span><input type="date" className="ccd-input" value={to} max={max} onChange={(e) => setTo(e.target.value)} /></label>
              </div>
              <div className={`ccd-dr-note${customError ? ' is-error' : ''}`} role={customError ? 'alert' : undefined}>
                {customError ?? `${customDays} day${customDays === 1 ? '' : 's'} selected.`}
              </div>
              <button type="button" className="ccd-dr-apply" disabled={customError !== null} onClick={() => { onChange({ preset: 'custom', from, to }); setAnchor(null); }}>Apply range</button>
            </div>
            <p className="ccd-dr-foot">Inventory is always today's stock. The other columns follow this range.</p>
          </div>
        </>,
        document.body,
      )}
    </>
  );
}
