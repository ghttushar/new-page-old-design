import { LayoutIcon, PlusIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import DashboardGrid from '@/app/components/dashboard/dashboard-grid';
import styles from '@/app/components/dashboard/dashboard.module.scss';
import useDashboard, { type Snapshot } from '@/app/components/dashboard/use-dashboard';
import WidgetLibrary, { WidgetCard, type LibraryView } from '@/app/components/dashboard/widget-library';
import { CATEGORIES, WIDGETS, widgetsIn } from '@/app/components/dashboard/widget-registry';
import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import { pickGreeting, rememberGreeting } from '@/constants/dashboard/greetings';
import useNow from '@/hooks/use-now.hook';
import useSubHeader from '@/hooks/use-sub-header.hook';

const UNDO_MS = 6000;

/** A greeting that changes on every visit, with today's day, date and time under it. */
function Today() {
  const now = new Date(useNow(15000));
  const [greeting] = useState(() => pickGreeting());
  useEffect(() => { rememberGreeting(greeting.index); }, [greeting.index]);
  return (
    <div className={styles.today}>
      <h2 className={styles.greeting}>{greeting.text}</h2>
      <p className={styles.todayLine}>
        <strong>{now.toLocaleDateString(undefined, { weekday: 'long' })}</strong>
        <span>{now.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        <time dateTime={now.toISOString()}>{now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</time>
      </p>
    </div>
  );
}

export function DashboardPage() {
  useSubHeader(PageTitleEnum.DASHBOARD, PAGE_TITLE_TOOLTIPS.DASHBOARD);
  const dash = useDashboard();
  const { name, widgets, layouts, templates, snapshot, restore, addWidget, removeWidget, updateConfig, setLayouts, applyTemplate, clear } = dash;
  const [library, setLibrary] = useState<LibraryView | null>(null);
  const [undo, setUndo] = useState<{ label: string; before: Snapshot } | null>(null);

  useEffect(() => {
    if (!undo) return undefined;
    const id = window.setTimeout(() => setUndo(null), UNDO_MS);
    return () => window.clearTimeout(id);
  }, [undo]);

  const remove = useCallback((id: string) => {
    const w = widgets.find((x) => x.id === id);
    setUndo({ label: `${w ? WIDGETS[w.kind].title : 'Widget'} removed`, before: snapshot() });
    removeWidget(id);
  }, [widgets, snapshot, removeWidget]);

  const duplicate = useCallback((id: string) => {
    const w = widgets.find((x) => x.id === id);
    if (w) addWidget(w.kind, w.config);
  }, [widgets, addWidget]);

  const apply = (t: (typeof templates)[number]) => { setUndo({ label: `Switched to ${t.name}`, before: snapshot() }); applyTemplate(t); };
  const blank = () => { if (widgets.length) setUndo({ label: 'Dashboard cleared', before: snapshot() }); clear(); };

  const empty = widgets.length === 0;

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <Today />
        <div className={styles.headActions}>
          <button type="button" className={styles.btnPrimary} onClick={() => setLibrary('all')}><PlusIcon size={14} weight="bold" />Add widget</button>
        </div>
      </div>

      {empty ? (
        <section className={styles.emptyState} aria-label="Empty dashboard">
          <div className={styles.emptyIntro}>
            <h2>Build your dashboard</h2>
            <p>Pick the numbers and feeds you check every day, then arrange them the way you work.</p>
            {templates.length > 0 && (
              <button type="button" className={styles.btnGhost} onClick={() => setLibrary('templates')}><LayoutIcon size={15} />Use a template</button>
            )}
          </div>
          {CATEGORIES.filter((c) => widgetsIn(c.id).length > 0).map((c) => (
            <div key={c.id} className={styles.quickAdd}>
              <h3 className={styles.quickTitle}>From {c.label}</h3>
              <ul className={styles.quickGrid}>
                {widgetsIn(c.id).map((d) => <WidgetCard key={d.kind} def={d} count={0} onAdd={() => addWidget(d.kind)} />)}
              </ul>
            </div>
          ))}
        </section>
      ) : (
        <DashboardGrid
          widgets={widgets} layouts={layouts}
          onLayouts={setLayouts} onConfig={updateConfig} onRemove={remove} onDuplicate={duplicate}
        />
      )}

      <AnimatePresence>
        {undo && (
          <motion.div
            className={styles.undo} role="status"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.18 }}
          >
            <span>{undo.label}</span>
            <button type="button" onClick={() => { restore(undo.before); setUndo(null); }}>Undo</button>
          </motion.div>
        )}
      </AnimatePresence>

      <WidgetLibrary
        open={library} widgets={widgets} templates={templates} currentName={name}
        onClose={() => setLibrary(null)}
        onAdd={(k) => addWidget(k)}
        onSave={dash.saveTemplate}
        onDelete={dash.deleteTemplate}
        onApply={apply}
        onBlank={blank}
      />
    </div>
  );
}

export default DashboardPage;
