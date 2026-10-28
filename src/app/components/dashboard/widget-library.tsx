import { CheckIcon, ConfettiIcon, FloppyDiskIcon, InfoIcon, LayoutIcon, MagnifyingGlassIcon, PencilSimpleIcon, PlusIcon, SquaresFourIcon, TrashIcon, XIcon, type Icon } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useModalLock from '../notifications/use-modal-lock';
import type { DashboardTemplate, WidgetCategory, WidgetDefinition, WidgetInstance, WidgetKind } from './dashboard.types';
import NuggetArt, { nuggetTint } from './nugget-art';
import { PRESET_TEMPLATES, type PresetTemplate } from './preset-templates';
import { CATEGORIES, WIDGETS, WIDGET_ORDER, widgetsIn } from './widget-registry';
import styles from './dashboard.module.scss';

/** Which part of the library is open: every widget, the new ones, one area's widgets, or the templates. */
export type LibraryView = 'all' | 'new' | WidgetCategory | 'templates';

const NEW_COUNT = WIDGET_ORDER.filter((k) => WIDGETS[k].isNew).length;

/** Closes the library card tooltip that is open, if any. */
let closeOpenTip: (() => void) | null = null;

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Beside a library card: what the nugget shows, how it is worked out and the data it reads. It sits to the right of the
 * card, or to the left when there is no room, and below it on a narrow screen. It never takes the pointer, so moving
 * across the grid isn't blocked.
 */
export function CardTip({ id, def, anchor }: { id: string; def: WidgetDefinition; anchor: DOMRect }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const gap = 10;
    const edge = 12;
    let left = anchor.right + gap;
    let top = anchor.top;
    if (left + w > window.innerWidth - edge) left = anchor.left - gap - w;
    if (left < edge) {
      left = Math.min(Math.max(edge, anchor.left), window.innerWidth - w - edge);
      top = anchor.bottom + gap + h > window.innerHeight - edge ? anchor.top - gap - h : anchor.bottom + gap;
    }
    setPos({ left, top: Math.min(Math.max(edge, top), window.innerHeight - h - edge) });
  }, [anchor]);
  return (
    <div ref={ref} id={id} role="tooltip" className={styles.tip} style={pos ?? { left: -9999, top: 0, visibility: 'hidden' }}>
      <div className={styles.tipHead}>
        <strong>{def.title}</strong>
        {def.isNew && <span className={styles.newTag}>New</span>}
      </div>
      {def.availability && <p className={styles.tipMeta}>{def.category} · {def.availability}</p>}
      {def.description && <section><h5>What it shows</h5><p>{def.description}</p></section>}
      {def.logic && <section><h5>How it’s worked out</h5><p>{def.logic}</p></section>}
      <section><h5>Data</h5><p>{def.dataPoints.join(' · ')}</p></section>
    </div>
  );
}

/**
 * One nugget in the library: a simple drawing of its shape, its name and what it shows, and an Add button along the
 * bottom so the buttons line up across a row. Newer nuggets carry a New tag and explain themselves in a tooltip (on
 * hover, or on the info button for keyboard and touch); the others keep what they're built from in the card's title.
 */
export function WidgetCard({ def, count, onAdd }: { def: WidgetDefinition; count: number; onAdd: () => void }) {
  const [flash, setFlash] = useState(false);
  const [tip, setTip] = useState<DOMRect | null>(null);
  const cardRef = useRef<HTMLLIElement>(null);
  const timer = useRef<number>();
  const tipId = useId();
  const explained = Boolean(def.description || def.logic);
  useEffect(() => {
    if (!flash) return undefined;
    const id = window.setTimeout(() => setFlash(false), 1200);
    return () => window.clearTimeout(id);
  }, [flash]);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  // A fixed tooltip would drift from its card, so scrolling or resizing closes it, and so does a tap anywhere else.
  useEffect(() => {
    if (!tip) return undefined;
    const close = () => setTip(null);
    closeOpenTip = close;
    const outside = (e: PointerEvent) => { if (!cardRef.current?.contains(e.target as Node)) close(); };
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    document.addEventListener('pointerdown', outside, true);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
      document.removeEventListener('pointerdown', outside, true);
      if (closeOpenTip === close) closeOpenTip = null;
    };
  }, [tip]);
  const open = () => {
    if (!cardRef.current) return;
    // One tooltip at a time: opening this one closes whichever card's is open.
    if (!tip) closeOpenTip?.();
    setTip(cardRef.current.getBoundingClientRect());
  };
  // Hovering waits a moment, so sweeping the pointer across the grid doesn't flash tooltips; focus and taps open at once.
  const show = (delay: number) => {
    window.clearTimeout(timer.current);
    if (delay === 0) open();
    else timer.current = window.setTimeout(open, delay);
  };
  const hide = () => { window.clearTimeout(timer.current); setTip(null); };
  return (
    <li
      ref={cardRef} className={styles.card} title={explained ? undefined : `Built from ${def.dataPoints.join(', ')}`}
      onMouseEnter={explained ? () => show(350) : undefined} onMouseLeave={explained ? hide : undefined}
    >
      <div className={`${styles.cardArt} ${nuggetTint(def.kind)}`}>
        <NuggetArt kind={def.kind} />
        {count > 0 && <span className={styles.cardOn}><CheckIcon size={11} weight="bold" />{count > 1 ? `On dashboard ×${count}` : 'On dashboard'}</span>}
        {def.isNew && <span className={`${styles.newTag} ${styles.cardNew}`}>New</span>}
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardTitleRow}>
          <strong className={styles.cardTitle}>{def.title}</strong>
          {explained && (
            <button
              type="button" className={styles.cardInfo} aria-label={`About ${def.title}`} aria-describedby={tip ? tipId : undefined}
              onFocus={() => show(0)} onBlur={hide} onClick={() => show(0)}
            ><InfoIcon size={15} /></button>
          )}
        </div>
        <p>{def.summary}</p>
        <button type="button" className={`${styles.btnSmall} ${styles.cardAdd}`} onClick={() => { onAdd(); setFlash(true); }} aria-label={`${count > 0 ? 'Add again' : 'Add'} ${def.title}`}>
          {flash ? <><CheckIcon size={13} weight="bold" />Added</> : <><PlusIcon size={13} weight="bold" />{count > 0 ? 'Add again' : 'Add'}</>}
        </button>
      </div>
      {tip && createPortal(<CardTip id={tipId} def={def} anchor={tip} />, document.body)}
    </li>
  );
}

/** Each ready-made template's art panel takes one of the nugget tints, so the cards tell apart at a glance. */
const PRESET_TINT: Record<string, string> = {
  'preset-leadership': styles.artTintRule,
  'preset-ppc': styles.artTintRank,
  'preset-automation': styles.artTintKeywords,
  'preset-catalog': styles.artTintHealth,
  'preset-client-success': styles.artTintMail,
  'preset-growth': styles.artTintGain,
};

/** A ready-made template as a miniature dashboard: every nugget at its place and size, showing its own drawing. */
function TemplateArt({ template }: { template: DashboardTemplate }) {
  const items = template.layouts.lg ?? [];
  const rows = Math.max(...items.map((l) => l.y + l.h));
  const kindOf = new Map(template.widgets.map((w) => [w.id, w.kind]));
  return (
    <div className={styles.tplBoard} aria-hidden>
      {items.map((l) => {
        const kind = kindOf.get(l.i);
        if (!kind) return null;
        return (
          <span
            key={l.i} className={styles.tplBlock} title={WIDGETS[kind].title}
            style={{ left: `${(l.x / 12) * 100}%`, top: `${(l.y / rows) * 100}%`, width: `${(l.w / 12) * 100}%`, height: `${(l.h / rows) * 100}%` }}
          >
            <i><NuggetArt kind={kind} fill /></i>
          </span>
        );
      })}
    </div>
  );
}

/** A ready-made template, in the same anatomy as a nugget card: the drawing, who it is for, its name, then Apply. */
export function PresetCard({ template, current, onApply }: { template: PresetTemplate; current: boolean; onApply: () => void }) {
  const TeamIcon = template.icon;
  return (
    <li className={`${styles.card} ${styles.tplPreset}`} title={template.widgets.map((w) => WIDGETS[w.kind].title).join(', ')}>
      <div className={`${styles.cardArt} ${styles.tplArt} ${PRESET_TINT[template.id] ?? ''}`}>
        <TemplateArt template={template} />
        {current && <span className={styles.cardOn}><CheckIcon size={11} weight="bold" />Current</span>}
      </div>
      <div className={styles.cardBody}>
        <span className={styles.tplTeam}><span className={styles.tplTeamIcon} aria-hidden><TeamIcon size={13} /></span>{template.team}</span>
        <strong className={styles.cardTitle}>{template.name}</strong>
        <p>{template.description}</p>
        <span className={styles.tplCount}>{template.widgets.length} nuggets</span>
        <button
          type="button" className={`${styles.btnSmall} ${styles.cardAdd}`} onClick={onApply} disabled={current}
          aria-label={current ? `${template.name} is the current dashboard` : `Apply ${template.name}`}
        >
          {current ? <><CheckIcon size={13} weight="bold" />Applied</> : <><LayoutIcon size={13} />Apply template</>}
        </button>
      </div>
    </li>
  );
}

/** A template drawn as its layout: one labelled block per widget, at its real place and size. */
function LayoutThumb({ template }: { template?: DashboardTemplate }) {
  const items = template?.layouts.lg ?? [];
  const rows = Math.max(12, ...items.map((l) => l.y + l.h));
  const kindOf = new Map(template?.widgets.map((w) => [w.id, w.kind]) ?? []);
  return (
    <div className={`${styles.thumb}${template ? '' : ` ${styles.thumbBlank}`}`} aria-hidden>
      {items.map((l) => {
        const kind = kindOf.get(l.i);
        return (
          <span
            key={l.i}
            style={{ left: `${(l.x / 12) * 100}%`, top: `${(l.y / rows) * 100}%`, width: `${(l.w / 12) * 100}%`, height: `${(l.h / rows) * 100}%` }}
          >
            <i>{kind ? WIDGETS[kind].title : ''}</i>
          </span>
        );
      })}
    </div>
  );
}

/** A template's name, edited in place: click it, type, then Enter or click away. Escape keeps the old name. */
function TemplateName({ template, taken, editing, onEdit, onRename }: {
  template: DashboardTemplate; taken: (name: string, id: string) => boolean; editing: boolean;
  onEdit: (on: boolean) => void; onRename: (name: string) => void;
}) {
  const [value, setValue] = useState(template.name);
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLButtonElement>(null);
  const wasEditing = useRef(editing);
  useEffect(() => { if (editing) { setValue(template.name); setError(null); } }, [editing, template.name]);
  // When editing ends, focus goes back to the name, so the keyboard stays inside the library.
  useEffect(() => {
    if (wasEditing.current && !editing) nameRef.current?.focus();
    wasEditing.current = editing;
  }, [editing]);

  const commit = () => {
    const next = value.trim();
    if (!next || next === template.name) { onEdit(false); return; }
    if (taken(next, template.id)) { setError('Another template already has this name.'); return; }
    onRename(next);
    onEdit(false);
  };

  if (!editing) {
    return (
      <button ref={nameRef} type="button" className={styles.tplName} onClick={() => onEdit(true)} title="Rename">
        <span>{template.name}</span>
        <PencilSimpleIcon size={13} />
      </button>
    );
  }
  return (
    <>
      <input
        className={`${styles.tplNameInput}${error ? ` ${styles.tplNameInvalid}` : ''}`} value={value} maxLength={48}
        aria-label="Template name" aria-invalid={Boolean(error)} autoFocus
        onFocus={(e) => e.currentTarget.select()}
        onChange={(e) => { setValue(e.target.value); setError(null); }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); commit(); }
          if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onEdit(false); }
        }}
        onBlur={commit}
      />
      {error && <span className={styles.formNote} role="alert">{error}</span>}
    </>
  );
}

function TemplatesView({ templates, currentName, editingId, justSavedId, onEditing, onRename, onApply, onDelete, onBlank }: {
  templates: DashboardTemplate[]; currentName: string; editingId: string | null; justSavedId: string | null;
  onEditing: (id: string | null) => void; onRename: (id: string, name: string) => void;
  onApply: (t: DashboardTemplate) => void; onDelete: (id: string) => void; onBlank: () => void;
}) {
  const reduce = useReducedMotion();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const taken = (name: string, id: string) => templates.some((t) => t.id !== id && t.name.toLowerCase() === name.toLowerCase());

  return (
    <div className={styles.tplView}>
      <section className={styles.tplSection} aria-labelledby="tpl-presets">
        <h4 id="tpl-presets" className={styles.libSectionTitle}>Ready-made for your teams<span>{PRESET_TEMPLATES.length}</span></h4>
        <ul className={styles.tplPresetGrid}>
          {PRESET_TEMPLATES.map((t) => <PresetCard key={t.id} template={t} current={currentName === t.name} onApply={() => onApply(t)} />)}
        </ul>
      </section>

      <section className={styles.tplSection} aria-labelledby="tpl-yours">
        <h4 id="tpl-yours" className={styles.libSectionTitle}>Your templates<span>{templates.length}</span></h4>
        <ul className={styles.tplGrid}>
          <li className={styles.tplCard}>
            <LayoutThumb />
            <div className={styles.tplInfo}>
              <strong>Blank dashboard</strong>
              <span>Start again from an empty canvas.</span>
            </div>
            <div className={styles.tplActions}>
              <button type="button" className={styles.btnSmallGhost} onClick={onBlank}>Use</button>
            </div>
          </li>
          <AnimatePresence initial={false}>
            {templates.map((t) => (
              <motion.li
                key={t.id} layout={!reduce}
                className={`${styles.tplCard}${justSavedId === t.id ? ` ${styles.tplCardNew}` : ''}`}
                initial={reduce ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <LayoutThumb template={t} />
                <div className={styles.tplInfo}>
                  <TemplateName
                    template={t} taken={taken} editing={editingId === t.id}
                    onEdit={(on) => onEditing(on ? t.id : null)} onRename={(name) => onRename(t.id, name)}
                  />
                  <span>
                    {t.widgets.length} {t.widgets.length === 1 ? 'nugget' : 'nuggets'}, saved {new Date(t.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <div className={styles.tplActions}>
                  {confirmDelete === t.id ? (
                    <>
                      <button type="button" className={styles.btnSmallDanger} onClick={() => { onDelete(t.id); setConfirmDelete(null); }}>Delete</button>
                      <button type="button" className={styles.btnSmallGhost} onClick={() => setConfirmDelete(null)}>Keep</button>
                    </>
                  ) : (
                    <>
                      {currentName === t.name ? <span className={styles.cardOn}>Current</span> : (
                        <button type="button" className={styles.btnSmall} onClick={() => onApply(t)}>Apply</button>
                      )}
                      <button type="button" className={styles.iconBtn} aria-label={`Delete ${t.name}`} title="Delete" onClick={() => setConfirmDelete(t.id)}><TrashIcon size={15} /></button>
                    </>
                  )}
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        {templates.length === 0 && <p className={styles.tplHint}>Save the current dashboard to reuse its layout. Saved templates appear here.</p>}
      </section>
    </div>
  );
}

interface LibraryProps {
  widgets: WidgetInstance[];
  templates: DashboardTemplate[];
  currentName: string;
  onAdd: (k: WidgetKind) => void;
  onClose: () => void;
  /** Saves the current dashboard and returns the new template's id. */
  onSave: () => string;
  onRename: (id: string, name: string) => void;
  onApply: (t: DashboardTemplate) => void;
  onDelete: (id: string) => void;
  onBlank: () => void;
}

function LibraryBody({ initialView, widgets, templates, currentName, onAdd, onClose, onSave, onRename, onApply, onDelete, onBlank }: LibraryProps & { initialView: LibraryView }) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<LibraryView>(initialView);
  const [query, setQuery] = useState('');
  const [addedNow, setAddedNow] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [justSavedId, setJustSavedId] = useState<string | null>(null);
  useEffect(() => {
    if (!justSavedId) return undefined;
    const id = window.setTimeout(() => setJustSavedId(null), 2400);
    return () => window.clearTimeout(id);
  }, [justSavedId]);
  // Saving drops a new card into the grid with its name ready to type.
  const saveCurrent = () => { const id = onSave(); setEditingId(id); setJustSavedId(id); };
  useModalLock(true);
  useEffect(() => { panelRef.current?.focus(); }, []);

  const counts = useMemo(() => {
    const m = new Map<WidgetKind, number>();
    widgets.forEach((w) => m.set(w.kind, (m.get(w.kind) ?? 0) + 1));
    return m;
  }, [widgets]);

  const q = query.trim().toLowerCase();
  const matches = (d: WidgetDefinition) => (q ? `${d.title} ${d.summary} ${d.dataPoints.join(' ')} ${d.category}`.toLowerCase().includes(q) : view !== 'new' || Boolean(d.isNew));
  const categories = CATEGORIES.filter((c) => widgetsIn(c.id).length > 0);
  // Searching always looks across every area.
  const grouped = view === 'all' || view === 'new' || Boolean(q);
  const shownCategories = grouped ? categories : categories.filter((c) => c.id === view);
  const meta = CATEGORIES.find((c) => c.id === view) ?? null;
  const resultCount = WIDGET_ORDER.filter((k) => matches(WIDGETS[k])).length;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.stopPropagation(); onClose(); return; }
    if (e.key !== 'Tab' || !panelRef.current) return;
    const f = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (f.length === 0) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  };

  const add = (k: WidgetKind) => { onAdd(k); setAddedNow((n) => n + 1); };
  const railItem = (id: LibraryView, label: string, n: number, Icon: Icon) => (
    <button key={id} type="button" className={styles.railItem} aria-current={view === id && !q ? 'page' : undefined} onClick={() => { setView(id); setQuery(''); }}>
      <Icon size={17} /><span>{label}</span><em>{n}</em>
    </button>
  );

  return (
    <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.16 }} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div
        ref={panelRef} className={styles.library} role="dialog" aria-modal="true" aria-label="Add to dashboard" tabIndex={-1} onKeyDown={onKeyDown}
        initial={reduce ? false : { opacity: 0, y: 12, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
      >
        <aside className={styles.rail}>
          <h2 className={styles.railTitle}>Add to dashboard</h2>
          <label className={styles.search}>
            <MagnifyingGlassIcon size={15} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search nuggets" aria-label="Search nuggets" />
          </label>
          <nav className={styles.railNav} aria-label="Library">
            <span className={styles.railLabel}>Nuggets</span>
            {railItem('all', 'All nuggets', WIDGET_ORDER.length, SquaresFourIcon)}
            {NEW_COUNT > 0 && railItem('new', 'New nuggets', NEW_COUNT, ConfettiIcon)}
            {categories.map((c) => railItem(c.id, c.label, widgetsIn(c.id).length, c.icon))}
            <span className={styles.railLabel}>Layouts</span>
            {railItem('templates', 'Templates', PRESET_TEMPLATES.length + templates.length + 1, LayoutIcon)}
          </nav>
        </aside>

        <section className={styles.libMain}>
          <header className={styles.libHead}>
            <div>
              <h3>{q ? `Results for “${query.trim()}”` : view === 'templates' ? 'Templates' : view === 'new' ? 'New nuggets' : meta ? meta.label : 'All nuggets'}</h3>
              <p>
                {q ? `${resultCount} ${resultCount === 1 ? 'nugget' : 'nuggets'} found` : view === 'templates'
                  ? 'Start from a layout made for your team, or reuse one you saved. Click a saved template’s name to rename it.'
                  : view === 'new' ? 'Just added, across every area. Hover a card, or use its info button, to see what it shows and how it’s worked out.'
                  : meta ? meta.description : 'Every nugget you can add, grouped by where its data comes from.'}
              </p>
            </div>
            <div className={styles.libHeadActions}>
              {view === 'templates' && !q && (
                <button
                  type="button" className={styles.btnSmall} onClick={saveCurrent} disabled={widgets.length === 0}
                  title={widgets.length === 0 ? 'Add a nugget to the dashboard first' : 'Save the current dashboard as a template'}
                ><FloppyDiskIcon size={14} />Save as template</button>
              )}
              <button type="button" className={styles.iconBtn} onClick={onClose} aria-label="Close"><XIcon size={17} /></button>
            </div>
          </header>

          <div className={`${styles.libScroll} ${styles.scrollArea}`}>
            {view === 'templates' && !q ? (
              <TemplatesView
                templates={templates} currentName={currentName} editingId={editingId} justSavedId={justSavedId}
                onEditing={setEditingId} onRename={onRename}
                onApply={(t) => { onApply(t); onClose(); }} onDelete={onDelete} onBlank={() => { onBlank(); onClose(); }}
              />
            ) : resultCount === 0 && q ? (
              <div className={styles.libEmpty}>No nugget matches “{query.trim()}”. Try a data point such as alerts, value or messages.</div>
            ) : (
              shownCategories.map((c) => {
                const defs = widgetsIn(c.id).filter(matches);
                if (defs.length === 0) return null;
                return (
                  <section key={c.id} className={styles.libSection}>
                    {grouped && <h4 className={styles.libSectionTitle}>{c.label}<span>{defs.length}</span></h4>}
                    <ul className={styles.cardGrid}>
                      {defs.map((d) => <WidgetCard key={d.kind} def={d} count={counts.get(d.kind) ?? 0} onAdd={() => add(d.kind)} />)}
                    </ul>
                  </section>
                );
              })
            )}
          </div>

          <AnimatePresence>
            {addedNow > 0 && view !== 'templates' && (
              <motion.footer className={styles.libFoot} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
                <span>{addedNow} {addedNow === 1 ? 'nugget' : 'nuggets'} added to your dashboard</span>
                <button type="button" className={`${styles.btnPrimary} ${styles.btnDone}`} onClick={onClose}>Done</button>
              </motion.footer>
            )}
          </AnimatePresence>
        </section>
      </motion.div>
    </motion.div>
  );
}

export default function WidgetLibrary({ open, ...rest }: LibraryProps & { open: LibraryView | null }) {
  return createPortal(
    <AnimatePresence>{open && <LibraryBody key="dash-library" initialView={open} {...rest} />}</AnimatePresence>,
    document.body,
  );
}
