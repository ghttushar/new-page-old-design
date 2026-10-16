import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import type { Option } from './dashboard.types';
import styles from './dashboard.module.scss';

/** Width and height of an element, kept up to date as it resizes. */
export function useElementSize<T extends HTMLElement>(): [RefObject<T>, { width: number; height: number }] {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((s) => (Math.abs(s.width - width) < 1 && Math.abs(s.height - height) < 1 ? s : { width, height }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size];
}

/**
 * A floating panel under (or above) an anchor, rendered into <body> so a widget's clipped edges never cut it off.
 * Closes on a click outside, Escape, or when the page scrolls.
 */
export function Floating({ anchor, onClose, children, width, align = 'start', label }: {
  anchor: HTMLElement; onClose: () => void; children: ReactNode; width?: number; align?: 'start' | 'end'; label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    const r = anchor.getBoundingClientRect();
    const el = ref.current;
    const w = el?.offsetWidth ?? width ?? 220;
    const h = el?.offsetHeight ?? 200;
    let left = align === 'end' ? r.right - w : r.left;
    left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    const below = r.bottom + 6;
    const top = below + h > window.innerHeight - 8 && r.top - 6 - h > 8 ? r.top - 6 - h : below;
    setPos({ top, left });
  }, [anchor, align, width]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!ref.current?.contains(t) && !anchor.contains(t)) onClose();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); anchor.focus(); } };
    const onScroll = (e: Event) => { if (!ref.current?.contains(e.target as Node)) onClose(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey, true);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onClose);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey, true);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onClose);
    };
  }, [anchor, onClose]);

  return createPortal(
    <div
      ref={ref} role="dialog" aria-label={label} className={styles.floating}
      style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999, width, visibility: pos ? 'visible' : 'hidden' }}
    >
      {children}
    </div>,
    document.body,
  );
}

/** A compact dropdown: the current choice as text, a menu of options with a tick on the chosen one. */
export function MiniSelect<V extends string>({ value, options, onChange, label, variant = 'plain', disabled }: {
  value: V; options: Option<V>[]; onChange: (v: V) => void; label: string; variant?: 'plain' | 'field' | 'chip'; disabled?: boolean;
}) {
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const current = options.find((o) => o.value === value) ?? options[0];
  return (
    <>
      <button
        type="button" className={variant === 'field' ? styles.selectField : variant === 'chip' ? styles.selectChip : styles.selectPlain} aria-haspopup="listbox" aria-expanded={Boolean(anchor)}
        aria-label={`${label}: ${current?.label}`} disabled={disabled}
        onClick={(e) => setAnchor(anchor ? null : e.currentTarget)}
      >
        <span>{current?.label}</span>
        <CaretDownIcon size={11} weight="bold" className={anchor ? styles.caretOpen : undefined} />
      </button>
      {anchor && (
        <Floating anchor={anchor} onClose={() => setAnchor(null)} label={label} width={Math.max(180, anchor.offsetWidth)}>
          <ul role="listbox" aria-label={label} className={styles.menuList}>
            {options.map((o) => (
              <li key={o.value}>
                <button
                  type="button" role="option" aria-selected={o.value === value} className={styles.menuItem}
                  onClick={() => { onChange(o.value); setAnchor(null); anchor.focus(); }}
                >
                  <span>{o.label}</span>
                  {o.value === value && <CheckIcon size={13} weight="bold" />}
                </button>
              </li>
            ))}
          </ul>
        </Floating>
      )}
    </>
  );
}

export function Segmented<V extends string>({ value, options, onChange, label }: { value: V; options: Option<V>[]; onChange: (v: V) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className={styles.segmented}>
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={o.value === value} className={styles.segment} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className={styles.toggle} onClick={() => onChange(!on)}>
      <i />
    </button>
  );
}

/** Pick any number of options; none picked means "all". */
export function ChipPicker({ value, options, onChange, emptyLabel, label }: {
  value: string[]; options: Option[]; onChange: (v: string[]) => void; emptyLabel: string; label: string;
}) {
  const toggle = (v: string) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  return (
    <div role="group" aria-label={label} className={styles.chips}>
      <button type="button" aria-pressed={value.length === 0} className={styles.chip} onClick={() => onChange([])}>{emptyLabel}</button>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={value.includes(o.value)} className={styles.chip} onClick={() => toggle(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}
