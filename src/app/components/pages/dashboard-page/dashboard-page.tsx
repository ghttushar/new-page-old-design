import { LayoutIcon, PlusIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import DashboardGrid from '@/app/components/dashboard/dashboard-grid';
import DashboardHello from '@/app/components/dashboard/dashboard-hello';
import styles from '@/app/components/dashboard/dashboard.module.scss';
import useDashboard, { type Snapshot } from '@/app/components/dashboard/use-dashboard';
import SkeletonLayout from '@/app/components/dashboard/skeleton-layout';
import WidgetLibrary, { type LibraryView } from '@/app/components/dashboard/widget-library';
import { WIDGETS } from '@/app/components/dashboard/widget-registry';
import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useSubHeader from '@/hooks/use-sub-header.hook';

const UNDO_MS = 6000;

export function DashboardPage() {
  useSubHeader(PageTitleEnum.DASHBOARD, PAGE_TITLE_TOOLTIPS.DASHBOARD);
  const dash = useDashboard();
  const { name, widgets, layouts, templates, snapshot, restore, addWidget, removeWidget, updateConfig, setLayouts, applyTemplate, clear } = dash;
  const [library, setLibrary] = useState<LibraryView | null>(null);
  const empty = widgets.length === 0;
  const [undo, setUndo] = useState<{ label: string; before: Snapshot } | null>(null);

  useEffect(() => {
    if (!undo) return undefined;
    const id = window.setTimeout(() => setUndo(null), UNDO_MS);
    return () => window.clearTimeout(id);
  }, [undo]);

  const remove = useCallback((id: string) => {
    const w = widgets.find((x) => x.id === id);
    setUndo({ label: `${w ? WIDGETS[w.kind].title : 'Nugget'} removed`, before: snapshot() });
    removeWidget(id);
  }, [widgets, snapshot, removeWidget]);

  const duplicate = useCallback((id: string) => {
    const w = widgets.find((x) => x.id === id);
    if (w) addWidget(w.kind, w.config);
  }, [widgets, addWidget]);

  const apply = (t: (typeof templates)[number]) => { setUndo({ label: `Switched to ${t.name}`, before: snapshot() }); applyTemplate(t); };
  const blank = () => { if (widgets.length) setUndo({ label: 'Dashboard cleared', before: snapshot() }); clear(); };

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <DashboardHello />
        <div className={styles.headActions}>
          {empty && templates.length > 0 && (
            <button type="button" className={styles.btnGhost} onClick={() => setLibrary('templates')}><LayoutIcon size={15} />Use a template</button>
          )}
          <button
            type="button" className={`${styles.btnPrimary}${empty ? ` ${styles.btnInvite}` : ''}`} onClick={() => setLibrary('all')}
          ><PlusIcon size={14} weight="bold" />Add nugget</button>
        </div>
      </div>

      {empty ? (
        <SkeletonLayout />
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
        onRename={dash.renameTemplate}
        onDelete={dash.deleteTemplate}
        onApply={apply}
        onBlank={blank}
      />
    </div>
  );
}

export default DashboardPage;
