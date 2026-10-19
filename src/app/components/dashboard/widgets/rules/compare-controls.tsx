import { CaretDownIcon, CheckIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import { useMemo, useRef, useState } from 'react';
import { Floating, Segmented } from '../../controls';
import type { Option } from '../../dashboard.types';
import { METRIC, type MetricId } from './data';
import { VIZ, type VizId } from './rule-compare-views';
import styles from '../../dashboard.module.scss';

// The comparison toolbar: two quiet side pickers on the left, a metrics dropdown and a view dropdown on the right.
// Everything opens on demand; the face of the nugget only says what is being compared.

export interface PickItem { id: string; name: string; detail: string; group: string; tag?: string }

/** A plain toolbar button that opens a panel under it. */
function useAnchor() {
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  return { ref, open, toggle: () => setOpen((o) => !o), close: () => setOpen(false) };
}

/** The list behind a side picker: a tab per group (when there is more than one), a search, and the items. */
function PickerPanel({ items, groups, value, onPick }: {
  items: PickItem[]; groups: Option[]; value: string; onPick: (id: string) => void;
}) {
  const current = items.find((i) => i.id === value);
  const [group, setGroup] = useState(current?.group ?? groups[0]?.value ?? '');
  const [q, setQ] = useState('');
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((i) => (needle ? `${i.name} ${i.detail}`.toLowerCase().includes(needle) : groups.length < 2 || i.group === group));
  }, [items, groups.length, group, q]);

  return (
    <div className={styles.rcPicker}>
      <label className={styles.rcSearch}>
        <MagnifyingGlassIcon size={14} />
        {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label="Search" />
      </label>
      {groups.length > 1 && !q && (
        <div className={styles.rcPickerTabs}><Segmented value={group} options={groups} onChange={setGroup} label="Type" /></div>
      )}
      <ul role="listbox" aria-label="Choose" className={styles.rcPickList}>
        {shown.length === 0 && <li className={styles.rcPickEmpty}>Nothing matches “{q}”</li>}
        {shown.map((i) => (
          <li key={i.id}>
            <button type="button" role="option" aria-selected={i.id === value} className={styles.rcPickItem} onClick={() => onPick(i.id)}>
              <span className={styles.rcPickCopy}>
                <strong>{i.name}</strong>
                <small>{q && groups.length > 1 ? `${groups.find((g) => g.value === i.group)?.label} · ` : ''}{i.detail}</small>
              </span>
              {i.tag && <em className={styles.rcPickTag}>{i.tag}</em>}
              {i.id === value && <CheckIcon size={13} weight="bold" className={styles.rcPickTick} />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** One side of the comparison, as a letter and the picked name. What the side means is in its tooltip and the legend. */
export function SideButton({ letter, caption, color, items, groups, value, onPick, preview }: {
  letter: 'A' | 'B'; caption: string; color: string; items: PickItem[]; groups: Option[]; value: string; onPick: (id: string) => void; preview?: boolean;
}) {
  const a = useAnchor();
  const item = items.find((i) => i.id === value) ?? items[0];
  return (
    <>
      <button
        ref={a.ref} type="button" className={styles.rcSide} aria-haspopup="listbox" aria-expanded={a.open}
        aria-label={`Side ${letter}, ${caption}: ${item?.name}. Change`} title={`${caption}: ${item?.name}`}
        disabled={preview} tabIndex={preview ? -1 : undefined} onClick={a.toggle}
      >
        <span className={styles.rcLetter} style={{ ['--c' as string]: color }}>{letter}</span>
        <span className={styles.rcSideName}>{item?.name}</span>
        <CaretDownIcon size={10} weight="bold" className={`${styles.rcCaret} ${a.open ? styles.caretOpen : ''}`} />
      </button>
      {a.open && a.ref.current && (
        <Floating anchor={a.ref.current} onClose={a.close} label={`Choose side ${letter}`} width={320}>
          <div className={styles.rcPanelHead}>{caption}</div>
          <PickerPanel items={items} groups={groups} value={value} onPick={(id) => { onPick(id); a.close(); a.ref.current?.focus(); }} />
        </Floating>
      )}
    </>
  );
}

function Check({ on }: { on: boolean }) {
  return <span className={styles.rcCheck} data-on={on} aria-hidden>{on && <CheckIcon size={10} weight="bold" />}</span>;
}

/** Metrics as a dropdown of checkboxes. One always stays ticked. */
export function MetricSelect({ options, value, onChange, preview }: {
  options: MetricId[]; value: MetricId[]; onChange: (v: MetricId[]) => void; preview?: boolean;
}) {
  const a = useAnchor();
  const all = options.every((m) => value.includes(m));
  const label = all ? 'All metrics' : value.length === 1 ? METRIC[value[0]].label : `${METRIC[value[0]].label} +${value.length - 1}`;
  const toggle = (m: MetricId) => {
    if (value.includes(m)) { if (value.length > 1) onChange(value.filter((x) => x !== m)); return; }
    onChange(options.filter((x) => x === m || value.includes(x)));
  };
  return (
    <>
      <button
        ref={a.ref} type="button" className={styles.rcDrop} aria-haspopup="listbox" aria-expanded={a.open}
        aria-label={`Metrics: ${label}`} disabled={preview} tabIndex={preview ? -1 : undefined} onClick={a.toggle}
      >
        <span>{label}</span>
        <CaretDownIcon size={10} weight="bold" className={`${styles.rcCaret} ${a.open ? styles.caretOpen : ''}`} />
      </button>
      {a.open && a.ref.current && (
        <Floating anchor={a.ref.current} onClose={a.close} label="Metrics" align="end" width={210}>
          <ul role="listbox" aria-multiselectable="true" aria-label="Metrics" className={styles.menuList}>
            <li>
              <button type="button" role="option" aria-selected={all} className={styles.rcOption} onClick={() => onChange(all ? [options[0]] : options)}>
                <Check on={all} /><span>All metrics</span>
              </button>
            </li>
            <li className={styles.rcOptionRule} aria-hidden />
            {options.map((m) => {
              const on = value.includes(m);
              return (
                <li key={m}>
                  <button
                    type="button" role="option" aria-selected={on} className={styles.rcOption} onClick={() => toggle(m)}
                    aria-disabled={on && value.length === 1} title={on && value.length === 1 ? 'Keep at least one metric' : undefined}
                  >
                    <Check on={on} /><span>{METRIC[m].label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Floating>
      )}
    </>
  );
}

/** The view, as a dropdown with an icon per option. */
export function VizSelect({ value, onChange, preview }: { value: VizId; onChange: (v: VizId) => void; preview?: boolean }) {
  const a = useAnchor();
  const current = VIZ.find((v) => v.id === value) ?? VIZ[0];
  const CurrentIcon = current.icon;
  return (
    <>
      <button
        ref={a.ref} type="button" className={styles.rcDrop} aria-haspopup="listbox" aria-expanded={a.open}
        aria-label={`View: ${current.label}`} disabled={preview} tabIndex={preview ? -1 : undefined} onClick={a.toggle}
      >
        <CurrentIcon size={14} />
        <span>{current.short}</span>
        <CaretDownIcon size={10} weight="bold" className={`${styles.rcCaret} ${a.open ? styles.caretOpen : ''}`} />
      </button>
      {a.open && a.ref.current && (
        <Floating anchor={a.ref.current} onClose={a.close} label="View" align="end" width={200}>
          <ul role="listbox" aria-label="View" className={styles.menuList}>
            {VIZ.map(({ id, label, icon: IconOf }) => (
              <li key={id}>
                <button type="button" role="option" aria-selected={id === value} className={styles.rcOption} onClick={() => { onChange(id); a.close(); a.ref.current?.focus(); }}>
                  <IconOf size={15} className={styles.rcOptionIcon} /><span>{label}</span>
                  {id === value && <CheckIcon size={13} weight="bold" className={styles.rcPickTick} />}
                </button>
              </li>
            ))}
          </ul>
        </Floating>
      )}
    </>
  );
}
