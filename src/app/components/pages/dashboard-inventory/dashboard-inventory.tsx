import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { DashboardTemplate, WidgetInstance, WidgetKind } from '@/app/components/dashboard/dashboard.types';
import ds from '@/app/components/dashboard/dashboard.module.scss';
import WidgetLibrary, { type LibraryView } from '@/app/components/dashboard/widget-library';
import { WIDGETS } from '@/app/components/dashboard/widget-registry';
import useSubHeader from '@/hooks/use-sub-header.hook';
import type { Animation } from './inventory-data';
import { GROUPS } from './inventory-data';
import {
  AllNuggetsSection, AnatomySection, AnimationsSection, BriefSection, ControlsSection, DynamicTextSection, FindingsSection, GroupsSection,
  LibrarySection, ShellSection,
} from './inventory-sections';
import s from './dashboard-inventory.module.scss';

/**
 * The dashboard screen inventory, at /dashboard/inventory: every element, component, state, piece of changing text and
 * animation of the /dashboard page, and every nugget grouped by its UI with one live example per group. Not linked from
 * the nav; a design-handoff page like /signals-preview.
 */

const CONTENTS: [string, string][] = [
  ['anatomy', 'Page anatomy'],
  ['shell', 'Page shell'],
  ['library', 'Add nugget library'],
  ['controls', 'Controls and states'],
  ['groups', 'Nuggets by UI'],
  ['all', 'Every nugget'],
  ['dynamic', 'Changing text'],
  ['motion', 'Animations'],
  ['brief', 'Signals Brief'],
  ['findings', 'Findings'],
];

// The library opens with a few nuggets "on the dashboard", so its On dashboard / Add again states show.
const SAMPLE: WidgetInstance[] = (['value-at-risk', 'value-at-risk', 'inv-cover', 'work-meetings'] as WidgetKind[])
  .map((kind, i) => ({ id: `inv-lib-${i}`, kind, config: { ...WIDGETS[kind].defaults } }));

const savedTemplate = (n: number, name: string, widgets: WidgetInstance[]): DashboardTemplate => ({
  id: `inv-saved-${n}-${Date.now()}`, name, createdAt: Date.now(), widgets,
  layouts: { lg: widgets.map((w, i) => ({ i: w.id, x: (i % 3) * 4, y: Math.floor(i / 3) * 7, w: 4, h: 7 })) },
});

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

export default function DashboardInventory() {
  useSubHeader('Dashboard screen inventory', 'Every element, state, piece of changing text and animation on the dashboard, with each nugget grouped by its UI.');
  const [toast, setToast] = useState<string | null>(null);
  const [library, setLibrary] = useState<LibraryView | null>(null);
  const [widgets, setWidgets] = useState<WidgetInstance[]>(SAMPLE);
  const [templates, setTemplates] = useState<DashboardTemplate[]>(() => [savedTemplate(0, 'Weekly review', SAMPLE)]);
  const [currentName, setCurrentName] = useState('My dashboard');
  // ?full lays the whole page out at its real height instead of scrolling the content column, so tools that import a
  // page as it is laid out (html.to.design, full-page screenshots) get every section.
  const [params, setParams] = useSearchParams();
  const full = params.has('full');
  const toggleFull = () => setParams((q) => { if (q.has('full')) q.delete('full'); else q.set('full', ''); return q; }, { replace: true });

  useEffect(() => {
    if (!toast) return undefined;
    const id = window.setTimeout(() => setToast(null), 6000);
    return () => window.clearTimeout(id);
  }, [toast]);

  const play = (target: NonNullable<Animation['play']>) => {
    if (target === 'toast') setToast('Value at risk removed');
    else if (target === 'library') setLibrary('all');
    else if (target === 'tip') scrollTo('library');
    else if (target === 'nuggets') scrollTo('groups');
    else scrollTo('shell');
  };

  const save = () => {
    let n = templates.length + 1;
    while (templates.some((t) => t.name.toLowerCase() === `template ${n}`)) n += 1;
    const t = savedTemplate(n, `Template ${n}`, widgets);
    setTemplates((list) => [t, ...list]);
    setCurrentName(t.name);
    return t.id;
  };

  return (
    <div className={`${s.page} ${full ? s.pageFull : ''}`}>
      <nav className={s.toc} aria-label="Contents">
        <span className={s.tocKicker}>Dashboard · screen inventory</span>
        <h1 className={s.tocTitle}>Dashboard</h1>
        {CONTENTS.map(([id, label], i) => (
          <button key={id} type="button" className={s.tocItem} onClick={() => scrollTo(id)}><em>{String(i + 1).padStart(2, '0')}</em>{label}</button>
        ))}
        <button type="button" className={s.fullToggle} onClick={toggleFull} aria-pressed={full}>
          {full ? 'Back to scrolling view' : 'Full-length view (for Figma)'}
        </button>
        <span className={s.tocKicker} style={{ marginTop: 16 }}>UI groups</span>
        {GROUPS.map((g) => (
          <button key={g.id} type="button" className={s.tocItem} onClick={() => scrollTo(`group-${g.id}`)}><em>·</em>{g.name}</button>
        ))}
      </nav>

      <main className={s.main}>
        <AnatomySection />
        <ShellSection onToast={setToast} />
        <LibrarySection onOpen={setLibrary} />
        <ControlsSection />
        <GroupsSection />
        <AllNuggetsSection />
        <DynamicTextSection />
        <AnimationsSection onPlay={play} />
        <BriefSection />
        <FindingsSection />
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div className={ds.undo} role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.18 }}>
            <span>{toast}</span>
            <button type="button" onClick={() => setToast(null)}>Undo</button>
          </motion.div>
        )}
      </AnimatePresence>

      <WidgetLibrary
        open={library} widgets={widgets} templates={templates} currentName={currentName}
        onClose={() => setLibrary(null)}
        onAdd={(kind) => setWidgets((list) => [...list, { id: `inv-lib-${list.length}-${Date.now()}`, kind, config: { ...WIDGETS[kind].defaults } }])}
        onSave={save}
        onRename={(id, name) => setTemplates((list) => list.map((t) => (t.id === id ? { ...t, name } : t)))}
        onDelete={(id) => setTemplates((list) => list.filter((t) => t.id !== id))}
        onApply={(t) => { setCurrentName(t.name); setToast(`Switched to ${t.name}`); }}
        onBlank={() => { setCurrentName('My dashboard'); setToast('Dashboard cleared'); }}
      />
    </div>
  );
}
