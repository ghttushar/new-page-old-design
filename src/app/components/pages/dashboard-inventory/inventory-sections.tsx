import {
  ArrowClockwiseIcon, ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, CheckIcon, ConfettiIcon, CopySimpleIcon, DotsThreeIcon, FloppyDiskIcon,
  HashIcon, InfoIcon, LayoutIcon, ListNumbersIcon, MegaphoneIcon, PlayIcon, PlusIcon, SquaresFourIcon, TableIcon, ChartBarHorizontalIcon, TrashIcon, XIcon,
} from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChipPicker, MiniSelect, Segmented, Toggle } from '@/app/components/dashboard/controls';
import DashboardGrid, { GAP, ROW_HEIGHT } from '@/app/components/dashboard/dashboard-grid';
import DashboardHello from '@/app/components/dashboard/dashboard-hello';
import type { WidgetConfig, WidgetInstance, WidgetKind } from '@/app/components/dashboard/dashboard.types';
import ds from '@/app/components/dashboard/dashboard.module.scss';
import EmptyDashboard from '@/app/components/dashboard/empty-dashboard';
import { PRESET_TEMPLATES } from '@/app/components/dashboard/preset-templates';
import WidgetFrame from '@/app/components/dashboard/widget-frame';
import { CardTip, PresetCard, WidgetCard, type LibraryView } from '@/app/components/dashboard/widget-library';
import { CATEGORIES, WIDGETS, WIDGET_ORDER, widgetsIn } from '@/app/components/dashboard/widget-registry';
import { INSIGHT_BUILDS } from '@/app/components/dashboard/widgets/insights/insight-view';
import { Check, MetricSelect, RangeSelect, SideButton, StripSelect, VizSelect, type PickItem } from '@/app/components/dashboard/widgets/rules/compare-controls';
import type { VizId } from '@/app/components/dashboard/widgets/rules/rule-compare-views';
import { RULES, RULE_TYPES, type MetricId, type RangeId } from '@/app/components/dashboard/widgets/rules/data';
import { FUN_FACTS } from '@/constants/dashboard/fun-facts';
import { DASHBOARD_USER_NAME, GREETINGS, pickGreeting } from '@/constants/dashboard/greetings';
import { ANIMATIONS, DYNAMIC_TEXT, FINDINGS, GROUPS, groupOf, type Animation, type Group, type GroupId } from './inventory-data';
import s from './dashboard-inventory.module.scss';

// The sections of the dashboard screen inventory. Every specimen is the real component; where a state can only be
// reached by interaction (hover, an open menu, a flash), the specimen is live and says what to do.

const heightOf = (rows: number) => rows * ROW_HEIGHT + (rows - 1) * GAP;

export function Section({ id, kicker, title, lead, children }: { id: string; kicker: string; title: string; lead?: string; children: ReactNode }) {
  return (
    <section id={id} className={s.section} aria-labelledby={`${id}-title`}>
      <header className={s.sectionHead}>
        <span>{kicker}</span>
        <h2 id={`${id}-title`}>{title}</h2>
        {lead && <p>{lead}</p>}
      </header>
      {children}
    </section>
  );
}

function Replay({ onClick, label = 'Replay' }: { onClick: () => void; label?: string }) {
  return <button type="button" className={s.replay} onClick={onClick}><ArrowClockwiseIcon size={12} weight="bold" />{label}</button>;
}

function Specimen({ title, note, action, wide, column, children }: { title: string; note?: ReactNode; action?: ReactNode; wide?: boolean; column?: boolean; children: ReactNode }) {
  return (
    <figure className={`${s.specimen} ${wide ? s.specimenWide : ''}`} style={{ margin: 0 }}>
      <figcaption className={s.specimenHead}><strong>{title}</strong>{action}</figcaption>
      <div className={`${s.specimenStage} ${column ? s.stageColumn : ''}`}>{children}</div>
      {note && <p className={s.specimenNote}>{note}</p>}
    </figure>
  );
}

function State({ label, children }: { label: string; children: ReactNode }) {
  return <div className={s.state}>{children}<small>{label}</small></div>;
}

/** A real nugget in its frame, at its height on the grid, with its own settings. */
export function LiveNugget({ kind, rows, fixed }: { kind: WidgetKind; rows?: number; fixed?: boolean }) {
  const def = WIDGETS[kind];
  const [config, setConfig] = useState<WidgetConfig>(() => ({ ...def.defaults }));
  const [note, setNote] = useState<string | null>(null);
  return (
    <div className={s.live}>
      <div style={{ height: heightOf(rows ?? def.size.h) }}>
        <WidgetFrame
          widget={{ id: `inv-${kind}`, kind, config }} fixed={fixed}
          onConfig={(patch) => setConfig((c) => ({ ...c, ...patch }))}
          onRemove={() => setNote(`Remove: on the dashboard the nugget goes and the toast reads “${def.title} removed” with Undo.`)}
          onDuplicate={() => setNote('Duplicate: on the dashboard a copy with the same settings goes into the first free slot.')}
        />
      </div>
      {note && <p className={s.liveNote}>{note}</p>}
    </div>
  );
}

// ── 1. Page anatomy ─────────────────────────────────────────────────────────────────────────

export function AnatomySection() {
  const parts: [string, string][] = [
    ['Calendar tile', 'Month, day, weekday; flips down on load'],
    ['Greeting', 'A different one each visit, the name in purple'],
    ['Clock and date', 'Part-of-day icon, live clock with a ticking colon, date'],
    ['Add nugget', 'Opens the library; sits mid-page when the dashboard is empty'],
  ];
  const blocks: { title: string; note: string; col: string; row: string }[] = [
    { title: 'Nugget', note: 'w 4 × h 7', col: '1 / 5', row: '1 / 5' },
    { title: 'Nugget', note: 'w 4 × h 7', col: '5 / 9', row: '1 / 5' },
    { title: 'Nugget', note: 'w 4 × h 10', col: '9 / 13', row: '1 / 7' },
    { title: 'Wide nugget', note: 'w 8 × h 10', col: '1 / 9', row: '5 / 9' },
  ];
  return (
    <Section id="anatomy" kicker="01" title="Page anatomy" lead="The dashboard is a header and a grid of nuggets. An empty dashboard swaps the grid for an invitation; Add nugget opens the library.">
      <div className={s.diagram} role="img" aria-label="Diagram of the dashboard: header with four parts above a 12-column grid of nuggets">
        <div className={s.dRow}>
          {parts.map(([t, n], i) => (
            <div key={t} className={s.dBox} style={{ flex: i === 1 ? '2 1 220px' : '1 1 150px' }}>
              <span className={s.dNum}>{i + 1}</span>{t}<small>{n}</small>
            </div>
          ))}
        </div>
        <div className={s.dGrid}>
          <div className={s.dGridCols} aria-hidden>{Array.from({ length: 12 }, (_, i) => <span key={i} />)}</div>
          {blocks.map((b, i) => (
            <div key={i} className={s.dNugget} style={{ gridColumn: b.col, gridRow: b.row }}>
              <span className={s.dNum}>{i + 5}</span>{b.title}<small>{b.note}</small>
            </div>
          ))}
        </div>
      </div>
      <div className={s.specimens}>
        <Specimen title="Grid" column>
          <div className={s.notes}>
            <dl>
              <dt>Columns</dt><dd>12 at 1100px and up, 6 from 640px, 1 below.</dd>
              <dt>Rows</dt><dd>40px tall with a 16px gap, so h 7 = 376px and h 10 = 544px.</dd>
              <dt>Moving</dt><dd>The drag handle (top left, on hover) moves a nugget; the bottom right corner resizes it. Others compact upwards.</dd>
              <dt>New nuggets</dt><dd>Go into the first free slot that fits, top to bottom, left to right.</dd>
            </dl>
          </div>
        </Specimen>
        <Specimen title="Nugget frame" column>
          <div className={s.notes}>
            <dl>
              <dt>Header</dt><dd>Drag handle, icon tile, title, scope line (what it shows right now), the header setting, ⋯ menu.</dd>
              <dt>⋯ menu</dt><dd>Duplicate and Remove (in red). Remove shows an undo toast.</dd>
              <dt>Body</dt><dd>The nugget itself; scrolls inside when it has more than fits, with a slim scrollbar.</dd>
              <dt>Fixed mode</dt><dd>On the Signals Brief: no drag handle, no resize, no menu.</dd>
            </dl>
          </div>
        </Specimen>
      </div>
    </Section>
  );
}

// ── 2. Page shell ───────────────────────────────────────────────────────────────────────────

const hoursOf = (h?: [number, number]) => (h ? `${h[0]}:00–${h[1]}:59` : 'Any time');

export function ShellSection({ onToast }: { onToast: (label: string) => void }) {
  const [helloKey, setHelloKey] = useState(0);
  const [emptyKey, setEmptyKey] = useState(0);
  const [glide, setGlide] = useState(false);
  const grid = useGridPlayground();
  return (
    <Section id="shell" kicker="02" title="Page shell" lead="Everything around the nuggets: the greeting, the empty state, the button that moves between them, the grid, the frame and the undo toast.">
      <div className={s.specimens}>
        <Specimen title="Greeting" wide action={<Replay onClick={() => setHelloKey((k) => k + 1)} />} note="Live. Replay to see the calendar flip, the words rise one by one and the clock fade in. The colon blinks every second.">
          <DashboardHello key={helloKey} />
        </Specimen>
        <Specimen title={`All ${GREETINGS.length} greetings`} column note="One is picked at random for the hour, never the same as last visit.">
          <div className={s.notes}>
            <ul>{GREETINGS.map((g, i) => <li key={i}>{g.text(DASHBOARD_USER_NAME)} <span className={s.muted}>· {hoursOf(g.hours)}</span></li>)}</ul>
          </div>
        </Specimen>
        <Specimen title="Add nugget button" column note="Header version once there is a nugget; the larger invitation (with a light sweeping across it) on an empty dashboard.">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end' }}>
            <State label="Header"><button type="button" className={ds.btnPrimary}><PlusIcon size={14} weight="bold" />Add nugget</button></State>
            <State label="Empty dashboard"><button type="button" className={`${ds.btnPrimary} ${ds.btnInvite}`} style={{ height: 42, padding: '0 20px', fontSize: 14 }}><PlusIcon size={15} weight="bold" />Add nugget</button></State>
            <State label="Text link"><button type="button" className={ds.emptyLink}>or start from a template</button></State>
          </div>
        </Specimen>
        <Specimen title="Add nugget glide" action={<Replay label={glide ? 'Remove the nugget' : 'Add a nugget'} onClick={() => setGlide((g) => !g)} />} note="The same button in two places: adding the first nugget glides it from the middle up to the header; removing the last glides it back.">
          <div className={s.glideBox}>
            {glide && <motion.div className={s.glideNugget} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />}
            {glide ? (
              <div className={s.glideHead}><motion.button layoutId="inv-add-nugget" type="button" className={ds.btnPrimary} onClick={() => setGlide(false)}><PlusIcon size={14} weight="bold" />Add nugget</motion.button></div>
            ) : (
              <div className={s.glideMiddle}><motion.button layoutId="inv-add-nugget" type="button" className={ds.btnPrimary} onClick={() => setGlide(true)} style={{ height: 42, padding: '0 20px', fontSize: 14 }}><PlusIcon size={15} weight="bold" />Add nugget</motion.button></div>
            )}
          </div>
        </Specimen>
        <Specimen title="Empty dashboard" wide action={<Replay onClick={() => setEmptyKey((k) => k + 1)} />} note="Live. The drawing, a fun fact or pun (a different one each time), Add nugget, and “or start from a template”. The mini cards bob gently.">
          <div className={s.emptyFrame} style={{ width: '100%' }}>
            <EmptyDashboard key={emptyKey} onAdd={() => onToast('Opens the library on All nuggets')} onTemplates={() => onToast('Opens the library on Templates')} hasTemplates />
          </div>
        </Specimen>
        <Specimen title={`All ${FUN_FACTS.length} fun facts and puns`} wide column>
          <ol className={s.factList}>{FUN_FACTS.map((f, i) => <li key={i}><span className={s.chip}>{f.kind === 'fact' ? 'Fun fact' : 'Pun of the day'}</span> {f.text}</li>)}</ol>
        </Specimen>
        <Specimen title="Nugget frame: normal" note="Hover for the drag handle. Open the Period chip and the ⋯ menu; Duplicate and Remove say what they do on the dashboard.">
          <div style={{ width: '100%' }}><LiveNugget kind="value-at-risk" /></div>
        </Specimen>
        <Specimen title="Nugget frame: fixed (Signals Brief)" note="No drag handle, no resize, no ⋯ menu. The header setting stays.">
          <div style={{ width: '100%' }}><LiveNugget kind="opportunity-value" fixed /></div>
        </Specimen>
        <Specimen title="Grid while moving" wide action={<Replay label="Reset" onClick={grid.reset} />} note="Live grid. Drag a nugget by its handle or pull its bottom right corner: column guides fade in, the others slide out of the way, and a dashed placeholder shows where it will land.">
          <div className={s.gridFrame} style={{ width: '100%' }}>
            <DashboardGrid widgets={grid.widgets} layouts={grid.layouts} onLayouts={grid.setLayouts} onConfig={grid.config} onRemove={grid.remove} onDuplicate={() => undefined} />
          </div>
        </Specimen>
        <Specimen title="Undo toast" wide note="Shown at the bottom of the page for 6 seconds after a nugget is removed, a template is applied or the dashboard is cleared. Undo puts everything back.">
          {['Value at risk removed', 'Switched to Leadership overview', 'Dashboard cleared'].map((label) => (
            <div key={label} className={s.inline}>
              <div className={ds.undo} role="presentation"><span>{label}</span><button type="button">Undo</button></div>
            </div>
          ))}
          <Replay label="Show it live" onClick={() => onToast('Value at risk removed')} />
        </Specimen>
      </div>
    </Section>
  );
}

function useGridPlayground() {
  const start = (): { widgets: WidgetInstance[]; layouts: ReactGridLayouts } => {
    const kinds: WidgetKind[] = ['value-at-risk', 'opportunity-value', 'new-keywords'];
    const widgets = kinds.map((kind) => ({ id: `grid-${kind}`, kind, config: { ...WIDGETS[kind].defaults } }));
    const lg = widgets.map((w, i) => ({ i: w.id, x: i * 4, y: 0, w: 4, h: 7, minW: 3, minH: 3 }));
    const md = widgets.map((w, i) => ({ i: w.id, x: (i % 2) * 3, y: Math.floor(i / 2) * 7, w: 3, h: 7, minW: 2, minH: 3 }));
    const sm = widgets.map((w, i) => ({ i: w.id, x: 0, y: i * 7, w: 1, h: 7, minW: 1, minH: 3 }));
    return { widgets, layouts: { lg, md, sm } };
  };
  const [state, setState] = useState(start);
  return {
    widgets: state.widgets,
    layouts: state.layouts,
    setLayouts: (layouts: ReactGridLayouts) => setState((st) => ({ ...st, layouts })),
    config: (id: string, patch: WidgetConfig) => setState((st) => ({ ...st, widgets: st.widgets.map((w) => (w.id === id ? { ...w, config: { ...w.config, ...patch } } : w)) })),
    remove: (id: string) => setState((st) => ({ ...st, widgets: st.widgets.filter((w) => w.id !== id) })),
    reset: () => setState(start()),
  };
}
type ReactGridLayouts = Parameters<typeof DashboardGrid>[0]['layouts'];

// ── 3. Library ──────────────────────────────────────────────────────────────────────────────

export function LibrarySection({ onOpen }: { onOpen: (view: LibraryView) => void }) {
  const newCount = WIDGET_ORDER.filter((k) => WIDGETS[k].isNew).length;
  const anchor = useMemo(() => new DOMRect(0, 0, 0, 0), []);
  const opens: [LibraryView, string][] = [['all', 'All nuggets'], ['new', 'New nuggets'], ['Signals', 'One area (Signals)'], ['templates', 'Templates']];
  return (
    <Section id="library" kicker="03" title="Add nugget library" lead="A dialog with a rail of areas on the left and cards on the right. Adding keeps the dialog open; a footer counts what was added. The Templates view lists ready-made and saved layouts.">
      <div className={s.specimens}>
        <Specimen title="Open the real library" wide note="Opens with a few sample nuggets already on the dashboard, so “On dashboard” and “Add again” show. Type something like “zzz” in the search to see no results; save, rename and delete templates in Templates.">
          {opens.map(([view, label]) => <button key={view} type="button" className={ds.btnSmall} onClick={() => onOpen(view)}>{label}</button>)}
        </Specimen>
        <Specimen title="Rail" column note="Every area with its count. The current one is white with a hairline; search clears the selection.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            <button type="button" className={ds.railItem} aria-current="page"><SquaresFourIcon size={17} /><span>All nuggets</span><em>{WIDGET_ORDER.length}</em></button>
            <button type="button" className={ds.railItem}><ConfettiIcon size={17} /><span>New nuggets</span><em>{newCount}</em></button>
            {CATEGORIES.slice(0, 3).map((c) => { const I = c.icon; return <button key={c.id} type="button" className={ds.railItem}><I size={17} /><span>{c.label}</span><em>{widgetsIn(c.id).length}</em></button>; })}
            <button type="button" className={ds.railItem}><LayoutIcon size={17} /><span>Templates</span><em>{PRESET_TEMPLATES.length + 1}</em></button>
          </div>
        </Specimen>
        <Specimen title="Library header actions" column>
          <State label="Save as template, enabled"><button type="button" className={ds.btnSmall}><FloppyDiskIcon size={14} />Save as template</button></State>
          <State label="Save as template, disabled (“Add a nugget to the dashboard first”)"><button type="button" className={ds.btnSmall} disabled><FloppyDiskIcon size={14} />Save as template</button></State>
          <State label="Close"><button type="button" className={ds.iconBtn} aria-label="Close"><XIcon size={17} /></button></State>
        </Specimen>
      </div>

      <h3 className={s.sub}>Card states</h3>
      <p className={s.lead}>Click Add on any card to see the 1.2-second “Added” flash. Hover a New card (or use its info button) for its tooltip.</p>
      <ul className={ds.cardGrid}>
        <WidgetCard def={WIDGETS['inv-cover']} count={0} onAdd={() => undefined} />
        <WidgetCard def={WIDGETS['inv-cover']} count={1} onAdd={() => undefined} />
        <WidgetCard def={WIDGETS['inv-cover']} count={2} onAdd={() => undefined} />
        <WidgetCard def={WIDGETS['value-at-risk']} count={0} onAdd={() => undefined} />
      </ul>
      <p className={s.lead}><span className={s.muted}>Left to right:</span> New, not added · on the dashboard (“Add again”) · on it twice (“On dashboard ×2”) · an original nugget (no New tag or tooltip; hovering shows “Built from …”).</p>

      <div className={s.specimens}>
        <Specimen title="Card tooltip" column note="Beside the card (left when there’s no room on the right, below on a narrow screen). One open at a time; closes on scroll, resize or a tap elsewhere.">
          <div className={s.staticTip}><CardTip id="inv-tip" def={WIDGETS['inv-cover']} anchor={anchor} /></div>
        </Specimen>
        <Specimen title="Footer" column note="Appears after the first add; counts adds since the library opened.">
          <div className={s.footStage}>
            <div className={ds.libFoot}><span>3 nuggets added to your dashboard</span><button type="button" className={`${ds.btnPrimary} ${ds.btnDone}`}>Done</button></div>
          </div>
        </Specimen>
        <Specimen title="Search with no results" column>
          <p style={{ margin: 0, color: '#858b96' }}>No nugget matches “zzz”. Try a data point such as alerts, value or messages.</p>
        </Specimen>
      </div>

      <h3 className={s.sub}>Templates</h3>
      <ul className={ds.tplPresetGrid}>
        <PresetCard template={PRESET_TEMPLATES[0]} current={false} onApply={() => undefined} />
        <PresetCard template={PRESET_TEMPLATES[1]} current onApply={() => undefined} />
      </ul>
      <p className={s.lead}>
        <span className={s.muted}>Preset card, then the current one (“Applied”, disabled).</span> Saved templates add: rename by clicking the name (Enter saves,
        Escape cancels, “Another template already has this name.” on a clash), delete with a Delete / Keep confirm, a purple border that fades on a just-saved
        card, and a Blank dashboard card with “Use”. Open Templates above to try them.
      </p>
    </Section>
  );
}

// ── 4. Controls ─────────────────────────────────────────────────────────────────────────────

const RULE_ITEMS: PickItem[] = RULES.map((r) => ({ id: r.id, name: r.name, detail: r.detail, group: r.type, tag: r.kind }));
const RULE_GROUPS = RULE_TYPES.map((t) => ({ value: t.id, label: t.label.split(' ')[0] }));
const PERIODS = [{ value: 'today', label: 'Today' }, { value: 'yesterday', label: 'Yesterday' }, { value: '2d', label: 'Last 2 days' }];

export function ControlsSection() {
  const [chip, setChip] = useState('today');
  const [seg, setSeg] = useState('all');
  const [toggle, setToggle] = useState(true);
  const [chips, setChips] = useState<string[]>([]);
  const [side, setSide] = useState('bid-conservative');
  const [metrics, setMetrics] = useState<MetricId[]>(['spend', 'roas']);
  const [viz, setViz] = useState<VizId>('table');
  const [range, setRange] = useState<RangeId>('30');
  const [entity, setEntity] = useState<'campaign' | 'keyword'>('campaign');
  const [top, setTop] = useState('5');
  const tone = (cls: string, share: number) => (
    <span className={`${ds.inBar} ${cls}`} style={{ width: 160 }} aria-hidden><i style={{ transform: `scaleX(${share})` }} /></span>
  );
  return (
    <Section id="controls" kicker="04" title="Controls, buttons and states" lead="Every control the dashboard uses, live. Hover and keyboard focus can’t be frozen on a page, so try them: each one has a hover colour, a 2px purple focus ring and, for buttons, a slight press.">
      <div className={s.specimens}>
        <Specimen title="Header chip (MiniSelect)" note="In a nugget’s header. Opens a list with a tick on the current option; the caret turns. Escape or a click outside closes it.">
          <State label="Chip"><MiniSelect variant="chip" value={chip} options={PERIODS} label="Period" onChange={setChip} /></State>
          <State label="Plain"><MiniSelect value={chip} options={PERIODS} label="Period" onChange={setChip} /></State>
          <State label="Disabled"><MiniSelect variant="chip" value={chip} options={PERIODS} label="Period" onChange={setChip} disabled /></State>
        </Specimen>
        <Specimen title="Comparison strip controls" note="Side picker (search, tabs, Rule / Template tags), Metrics (one always stays ticked: “Keep at least one metric”), View and Range.">
          <SideButton letter="A" label="Template" caption="Bidding strategy template" color="#77469b" items={RULE_ITEMS} groups={RULE_GROUPS} value={side} onPick={setSide} />
          <MetricSelect options={['spend', 'roas', 'acos', 'cvr', 'ctr']} value={metrics} onChange={setMetrics} />
          <VizSelect value={viz} onChange={setViz} />
          <RangeSelect value={range} onChange={setRange} />
        </Specimen>
        <Specimen title="Ranked list controls (StripSelect)" note="With a heading it reads like a side button; without one, like a dropdown with an icon.">
          <StripSelect heading="Show" label="Show" value={entity} width={200} onChange={setEntity} options={[{ value: 'campaign', label: 'Campaigns', icon: MegaphoneIcon }, { value: 'keyword', label: 'Keywords', icon: HashIcon }]} />
          <StripSelect label="How many" icon={ListNumbersIcon} value={top} width={150} onChange={setTop} options={[{ value: '5', label: 'Top 5' }, { value: '10', label: 'Top 10' }, { value: '15', label: 'Top 15' }, { value: 'all', label: 'All' }]} />
          <StripSelect label="View" value={viz === 'bars' ? 'bars' : 'table'} width={160} onChange={(v) => setViz(v as VizId)} options={[{ value: 'table', label: 'Table', icon: TableIcon }, { value: 'bars', label: 'Bars', icon: ChartBarHorizontalIcon }]} />
        </Specimen>
        <Specimen title="Built but not shown on the dashboard" note="Made for the Customize panel, which isn’t drawn yet (see Findings).">
          <State label="Segmented"><Segmented value={seg} options={[{ value: 'all', label: 'All' }, { value: 'amazon', label: 'Amazon' }, { value: 'walmart', label: 'Walmart' }]} onChange={setSeg} label="Marketplace" /></State>
          <State label={toggle ? 'Toggle, on' : 'Toggle, off'}><Toggle on={toggle} onChange={setToggle} label="Show the split" /></State>
          <State label="Chip picker"><ChipPicker value={chips} options={[{ value: 'catalog', label: 'Catalog' }, { value: 'inventory', label: 'Inventory' }]} onChange={setChips} emptyLabel="All categories" label="Categories" /></State>
        </Specimen>
        <Specimen title="Checkbox" column>
          <State label="Ticked"><Check on /></State>
          <State label="Not ticked"><Check on={false} /></State>
        </Specimen>
        <Specimen title="Nugget ⋯ menu" column note="Opens from the ⋯ button in every nugget header.">
          <div className={s.inlinePanel}>
            <ul role="menu" className={ds.menuList}>
              <li><button type="button" role="menuitem" className={ds.menuItem}><CopySimpleIcon size={15} /><span>Duplicate</span></button></li>
              <li><button type="button" role="menuitem" className={`${ds.menuItem} ${ds.menuDanger}`}><TrashIcon size={15} /><span>Remove</span></button></li>
            </ul>
          </div>
          <State label="⋯ button"><button type="button" className={ds.iconBtn} aria-label="Options"><DotsThreeIcon size={18} weight="bold" /></button></State>
        </Specimen>
        <Specimen title="Buttons" wide>
          <State label="Primary"><button type="button" className={ds.btnPrimary}>Done</button></State>
          <State label="Primary, disabled"><button type="button" className={ds.btnPrimary} disabled>Done</button></State>
          <State label="Small"><button type="button" className={ds.btnSmall}><PlusIcon size={13} weight="bold" />Add</button></State>
          <State label="Small, “Added”"><button type="button" className={ds.btnSmall}><CheckIcon size={13} weight="bold" />Added</button></State>
          <State label="Small, disabled"><button type="button" className={ds.btnSmall} disabled><CheckIcon size={13} weight="bold" />Applied</button></State>
          <State label="Small ghost"><button type="button" className={ds.btnSmallGhost}>Keep</button></State>
          <State label="Small danger"><button type="button" className={ds.btnSmallDanger}>Delete</button></State>
          <State label="Icon"><button type="button" className={ds.iconBtn} aria-label="Delete"><TrashIcon size={15} /></button></State>
          <State label="Info (library card)"><button type="button" className={ds.cardInfo} aria-label="About"><InfoIcon size={15} /></button></State>
          <State label="Text"><button type="button" className={ds.textBtn}>Open in Signals</button></State>
          <State label="Text, muted"><button type="button" className={ds.textBtnMuted}>Mark as unread</button></State>
          <State label="Show more"><button type="button" className={ds.listMore}>Show 2 more</button></State>
          <State label="Link"><Link to="/dashboard/inventory" className={ds.opLink} onClick={(e) => e.preventDefault()}>Open Inventory<ArrowRightIcon size={13} weight="bold" /></Link></State>
        </Specimen>
        <Specimen title="Tags and badges" wide>
          <State label="New"><span className={ds.newTag}>New</span></State>
          <State label="On dashboard"><span className={ds.cardOn} style={{ position: 'static', padding: '4px 8px', border: '1px solid #e3e6ec', borderRadius: 999, background: '#fff', fontSize: 11, fontWeight: 600 }}><CheckIcon size={11} weight="bold" />On dashboard ×2</span></State>
          <State label="Row tag"><em className={ds.inTag} style={{ maxWidth: 'none' }}>Suppressed</em></State>
          <State label="Picker tag"><em className={ds.rcPickTag}>Template</em></State>
          <State label="High priority"><span className={ds.awayHigh}>High</span></State>
          <State label="Comparison letters"><span style={{ display: 'flex', gap: 6 }}><span className={ds.rcLetter} style={{ ['--c' as string]: '#77469b' }}>A</span><span className={ds.rcLetter} style={{ ['--c' as string]: '#3d7ea6' }}>B</span></span></State>
        </Specimen>
        <Specimen title="Change pills" wide>
          <State label="Up, good"><span className={`${ds.kpiDelta} ${ds.deltaGood}`}><ArrowUpIcon size={11} weight="bold" />12%<span>vs yesterday</span></span></State>
          <State label="Up, bad"><span className={`${ds.kpiDelta} ${ds.deltaBad}`}><ArrowUpIcon size={11} weight="bold" />714%<span>vs yesterday</span></span></State>
          <State label="Comparison, A wins"><span className={`${ds.rcDelta} ${ds.deltaGood}`}><ArrowUpIcon size={10} weight="bold" />8.4%</span></State>
          <State label="Comparison, B wins"><span className={`${ds.rcDelta} ${ds.deltaBad}`}><ArrowDownIcon size={10} weight="bold" />3.1%</span></State>
          <State label="Even or neutral"><span className={`${ds.rcDelta} ${ds.rcDeltaFlat}`}>0.2%</span></State>
          <State label="Quiet"><span className={`${ds.rcDelta} ${ds.deltaGood} ${ds.rcDeltaQuiet}`}><ArrowUpIcon size={10} weight="bold" />5.0%</span></State>
        </Specimen>
        <Specimen title="Bars and tones" wide note="Every bar sits on a grey track. Tone carries meaning only: good, bad, a warning, or neutral grey.">
          <State label="Good">{tone(ds.inGood, 0.82)}</State>
          <State label="Warning">{tone(ds.inWarn, 0.56)}</State>
          <State label="Bad">{tone(ds.inBad, 0.34)}</State>
          <State label="Neutral">{tone('', 0.66)}</State>
          <State label="Values"><span><strong className={ds.inGood}>+12.4%</strong> · <strong className={ds.inWarn}>14 days</strong> · <strong className={ds.inBad}>−$3.04</strong> · <strong>4.2x</strong></span></State>
        </Specimen>
      </div>
    </Section>
  );
}

// ── 5. Groups ───────────────────────────────────────────────────────────────────────────────

export function useGroups(): Record<GroupId, WidgetKind[]> {
  return useMemo(() => {
    const out = Object.fromEntries(GROUPS.map((g) => [g.id, [] as WidgetKind[]])) as Record<GroupId, WidgetKind[]>;
    WIDGET_ORDER.forEach((k) => out[groupOf(k)].push(k));
    return out;
  }, []);
}

function GroupBlock({ group, members }: { group: Group; members: WidgetKind[] }) {
  const [key, setKey] = useState(0);
  const rep = WIDGETS[group.representative];
  const wide = rep.size.w >= 8;
  return (
    <article id={`group-${group.id}`} className={s.group} aria-labelledby={`group-${group.id}-title`}>
      <header className={s.groupHead}>
        <h3 id={`group-${group.id}-title`}>{group.name}<span>{members.length} {members.length === 1 ? 'nugget' : 'nuggets'}</span></h3>
        <p className={s.purpose}>{group.purpose}</p>
        <p>{group.use}</p>
      </header>
      <ul className={s.members} aria-label="Nuggets in this group">
        {members.map((k) => (
          <li key={k} className={k === group.representative ? s.representative : undefined}>
            {WIDGETS[k].title}{WIDGETS[k].category === 'Signals' && <b>SIGNALS</b>}{WIDGETS[k].isNew && <b>NEW</b>}
          </li>
        ))}
      </ul>
      <div className={`${s.groupBody} ${wide ? s.groupBodyWide : ''}`}>
        <div className={s.groupLive}>
          <div className={s.groupLiveHead}><span>Live: {rep.title}</span><Replay onClick={() => setKey((k) => k + 1)} /></div>
          <LiveNugget key={key} kind={group.representative} rows={group.rows} />
        </div>
        <div className={s.groupNotes}>
          <div className={s.notes}>
            <h4>Sub-components</h4>
            <dl>{group.anatomy.map((a) => <div key={a.part}><dt>{a.part}</dt><dd>{a.detail}</dd></div>)}</dl>
          </div>
          <div className={s.notes}>
            <h4>States</h4>
            <ul>{group.states.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className={s.notes}>
            <h4>Try</h4>
            <ul>{group.interactions.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
      </div>
    </article>
  );
}

export function GroupsSection() {
  const groups = useGroups();
  return (
    <Section id="groups" kicker="05" title="Nuggets by UI" lead={`All ${WIDGET_ORDER.length} nuggets sorted into ${GROUPS.length} groups by how they look and behave, whatever area their data comes from. Each group says what it’s for and shows one nugget live (highlighted in the list). New insight nuggets are sorted automatically by the blocks they render.`}>
      {GROUPS.map((g) => <GroupBlock key={g.id} group={g} members={groups[g.id]} />)}
    </Section>
  );
}

// ── 6. Every nugget ─────────────────────────────────────────────────────────────────────────

const ORIGINAL_EMPTY: Partial<Record<WidgetKind, string>> = {
  'value-at-risk': '“$0” and “No alerts today”',
  'opportunity-value': '“$0” and “No alerts today”',
  'important-messages': '“No messages on this channel.” / “Everything here is read.”',
  'while-away': '“All caught up. Nothing new matches these settings.”',
  'new-opportunities': '“Every high quality item is already advertised.”',
  'item-health': 'Search: “Nothing matches “q””',
  'rule-impact': 'Picker search: “Nothing matches “q””',
  'rule-compare': 'Picker search: “Nothing matches “q””',
};
const ORIGINAL_LINKS: Partial<Record<WidgetKind, string>> = {
  'important-messages': 'Open in Signals → /signals',
  'while-away': 'Each row → /signals',
  'new-keywords': 'View more in Targeting Actions → /advertising/targeting-actions',
  'new-opportunities': 'Advertise them → /advertising/campaign-creator',
  'item-health': 'Each alert → /signals',
};

export function AllNuggetsSection() {
  return (
    <Section id="all" kicker="06" title={`Every nugget (${WIDGET_ORDER.length})`} lead="Read from the registry, so it always matches the code. The scope line is what shows under the title with the default settings.">
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr><th>Nugget</th><th>Area</th><th>UI group</th><th>Marketplaces</th><th>Size (min)</th><th>Header setting</th><th>Scope line now</th><th>Empty state</th><th>Link</th></tr>
          </thead>
          <tbody>
            {WIDGET_ORDER.map((k) => {
              const d = WIDGETS[k];
              const build = INSIGHT_BUILDS.get(k as never);
              const empty = build ? build('all').empty : ORIGINAL_EMPTY[k];
              const link = build ? (d.link ? `${d.link.label} → ${d.link.to}` : undefined) : ORIGINAL_LINKS[k];
              return (
                <tr key={k}>
                  <td><strong>{d.title}</strong>{d.isNew && <> <span className={`${s.chip} ${s.chipNew}`}>New</span></>}<br /><code>{k}</code></td>
                  <td>{d.category}</td>
                  <td>{GROUPS.find((g) => g.id === groupOf(k))?.name}</td>
                  <td>{d.availability ?? <span className={s.muted}>Sample data</span>}</td>
                  <td className={s.num}>{d.size.w}×{d.size.h} <span className={s.muted}>({d.size.minW}×{d.size.minH})</span></td>
                  <td>{d.header ? <>{d.header.label}: <span className={s.muted}>{d.header.options.map((o) => o.label).join(' / ')}</span></> : <span className={s.muted}>—</span>}</td>
                  <td>{d.describe(d.defaults)}</td>
                  <td>{empty ?? <span className={s.muted}>—</span>}</td>
                  <td>{link ?? <span className={s.muted}>—</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

// ── 7. Dynamic text ─────────────────────────────────────────────────────────────────────────

export function DynamicTextSection() {
  const examples = useMemo(() => {
    const now = new Date();
    const h = now.getHours();
    const part = h >= 5 && h <= 11 ? 'morning' : h >= 12 && h <= 16 ? 'afternoon' : h >= 17 && h <= 20 ? 'evening' : 'night';
    const newCount = WIDGET_ORDER.filter((k) => WIDGETS[k].isNew).length;
    return {
      Greeting: pickGreeting().text,
      'User name': DASHBOARD_USER_NAME,
      'Calendar tile': `${now.toLocaleDateString(undefined, { month: 'short' }).toUpperCase()} · ${now.getDate()} · ${now.toLocaleDateString(undefined, { weekday: 'short' })}`,
      Clock: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      'Part-of-day icon': part,
      'Date line': now.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }),
      'Fun fact or pun': `${FUN_FACTS.length} lines (all listed under Page shell)`,
      'Scope line under each nugget title': `${WIDGET_ORDER.length} lines (listed under Every nugget)`,
      'Rail counts': `All ${WIDGET_ORDER.length} · New ${newCount} · ${CATEGORIES.map((c) => `${c.label} ${widgetsIn(c.id).length}`).join(' · ')} · Templates ${PRESET_TEMPLATES.length + 1}+`,
      '“Template N”': 'Template 1',
      '“N nuggets, saved 28 Oct”': `2 nuggets, saved ${now.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}`,
    } as Record<string, string>;
  }, []);
  return (
    <Section id="dynamic" kicker="07" title="Text that changes on its own" lead="Everything that isn’t fixed copy: by time, by visit, by settings, or by data. Live examples are worked out on this page now.">
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead><tr><th>Text</th><th>Where</th><th>How it’s worked out</th><th>Right now</th></tr></thead>
          <tbody>
            {DYNAMIC_TEXT.map((t) => (
              <tr key={t.text}><td><strong>{t.text}</strong></td><td>{t.where}</td><td>{t.how}</td><td>{examples[t.text] ?? <span className={s.muted}>—</span>}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

// ── 8. Animation ────────────────────────────────────────────────────────────────────────────

export function AnimationsSection({ onPlay }: { onPlay: (target: NonNullable<Animation['play']>) => void }) {
  return (
    <Section id="motion" kicker="08" title={`Animations (${ANIMATIONS.length})`} lead="Every movement on the page, what starts it and how long it takes. Play jumps to (or triggers) a live example. With reduced motion turned on in the system, most of these switch off; the last column says which.">
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead><tr><th>Animation</th><th>Starts when</th><th>What moves</th><th>Timing</th><th>Reduced motion</th><th aria-label="Play" /></tr></thead>
          <tbody>
            {ANIMATIONS.map((a) => (
              <tr key={a.name}>
                <td><strong>{a.name}</strong></td><td>{a.trigger}</td><td>{a.moves}</td><td className={s.num}>{a.timing}</td><td>{a.reduced}</td>
                <td>{a.play && <button type="button" className={s.replay} onClick={() => onPlay(a.play!)}><PlayIcon size={11} weight="fill" />Play</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

// ── 9. Signals Brief ────────────────────────────────────────────────────────────────────────

export function BriefSection() {
  const cells: { kind: WidgetKind; col: string }[] = [
    { kind: 'value-at-risk', col: 'span 1' }, { kind: 'opportunity-value', col: 'span 1' }, { kind: 'important-messages', col: 'span 1' },
    { kind: 'while-away', col: 'span 2' }, { kind: 'work-meetings', col: 'span 1' },
  ];
  return (
    <Section id="brief" kicker="09" title="The same nuggets on the Signals Brief" lead="The Brief tab in Signals shows five of these nuggets in a fixed layout that fills the tab: no drag, resize, menu or Add nugget, but each keeps its header setting. Below 900px they stack, 360px each.">
      <div className={s.diagram} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gridAutoRows: 72 }}>
        {cells.map((c, i) => (
          <div key={c.kind} className={s.dBox} style={{ gridColumn: c.col }}>
            <span className={s.dNum}>{i + 1}</span>{WIDGETS[c.kind].title}
            <small>{WIDGETS[c.kind].header ? `${WIDGETS[c.kind].header!.label} chip` : 'No setting'}{c.kind === 'work-meetings' ? ' · Open Meetings → Meetings tab' : ''}</small>
          </div>
        ))}
      </div>
      <p className={s.lead}><Link to="/signals?tab=brief" className={ds.opLink}>Open the Brief<ArrowRightIcon size={13} weight="bold" /></Link></p>
    </Section>
  );
}

// ── 10. Findings ────────────────────────────────────────────────────────────────────────────

export function FindingsSection() {
  return (
    <Section id="findings" kicker="10" title="Findings" lead="Things built but not visible today, or behaving differently from what the code says. Listed, not fixed, except where marked.">
      <ul className={s.findings}>{FINDINGS.map((f) => <li key={f.title}><strong>{f.title}</strong><span>{f.detail}</span></li>)}</ul>
    </Section>
  );
}
