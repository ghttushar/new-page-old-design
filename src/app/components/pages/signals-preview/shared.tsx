import { PROTOTYPE_ALERTS } from '@/constants/signals/prototype-data';
import { DEFAULT_ASSIGNEES } from '../../signals/alerts/assign-menu';

export const noop = () => {};
export const noopId = (_id: string) => {};

export const firstAlert = PROTOTYPE_ALERTS.find((a) => a.id === 'a1')!;
export const normalAlert = PROTOTYPE_ALERTS.find((a) => a.id === 'a2')!;
export const imageAlert = PROTOTYPE_ALERTS.find((a) => a.id === 'a15')!;

export const MANY_ASSIGNEES = [
  ...DEFAULT_ASSIGNEES,
  { id: 'p5', name: 'Aditi Rao', role: 'Client · Nutrabay' },
  { id: 'p6', name: 'Karan Mehta', role: 'Ops' },
  { id: 'p7', name: 'Wellbeing Nutrition pod', role: 'Team' },
  { id: 'p8', name: 'Rahul Gupta', role: 'Client · Nutrabay' },
  { id: 'p9', name: 'Sneha Iyer', role: 'Client · Nutrabay' },
  { id: 'p10', name: 'Priya Nair', role: 'Client · Wellbeing' },
  { id: 'p11', name: 'Ritvik Sharma', role: 'Ops' },
  { id: 'p12', name: 'Boldfit pod', role: 'Team' },
  { id: 'p13', name: 'Growth pod', role: 'Team' },
  { id: 'p14', name: 'Ananya Das', role: 'Marketing' },
  { id: 'p15', name: 'Vikram Nair', role: 'Ops' },
  { id: 'p16', name: 'Leadership', role: 'Team' },
];

export const PREVIEW_PAGES: { path: string; label: string; note: string }[] = [
  { path: '/signals-preview/live', label: 'Live app', note: 'The real, interactive Signals app — click through anything reachable by clicking.' },
  { path: '/signals-preview/brief', label: 'Brief', note: 'Default, Nudge panel, no-integration state, onboarding wizard, Dashboard — 5 frames.' },
  { path: '/signals-preview/alerts-states', label: 'Alerts — states', note: 'Empty, Ask Jiva variation + panel, a repeated-badge alert — 4 frames.' },
  { path: '/signals-preview/alerts-lifecycle', label: 'Alerts — lifecycle', note: 'Executing (in progress + completed), impact report, generative review — 4 frames.' },
  { path: '/signals-preview/alerts-flows', label: 'Alerts — flows', note: 'Image Studio, Action Picker, Compose Mail, Items modal, both Assign variants — 6 frames.' },
  { path: '/signals-preview/alerts-speed', label: 'Alerts — Speed Mode', note: 'A card, and the empty "all caught up" state — 2 frames.' },
  { path: '/signals-preview/meetings', label: 'Meetings', note: 'Empty, populated, Prep, Presentation, MOM — 5 frames.' },
  { path: '/signals-preview/workstation', label: 'Work-station', note: '1 frame.' },
];

export function PreviewNav({ current }: { current: string }) {
  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', gap: 4, padding: '10px 24px', background: '#fff', borderBottom: '1px solid #e6e8ec', flexWrap: 'wrap' as const, alignItems: 'center' }}>
      <a href="/signals-preview" style={{ font: '700 13px/1 Inter,sans-serif', color: '#23272d', marginRight: 12, textDecoration: 'none' }}>Signals preview</a>
      {PREVIEW_PAGES.map((p) => (
        <a
          key={p.path}
          href={p.path}
          style={{
            padding: '6px 11px', borderRadius: 6, font: '600 12px/1 Inter,sans-serif', textDecoration: 'none',
            color: p.path === current ? '#fff' : '#5f3880',
            background: p.path === current ? '#77469b' : '#f9f7fc',
          }}
        >
          {p.label}
        </a>
      ))}
      <span style={{ marginLeft: 'auto', font: '400 11px/1.4 Inter,sans-serif', color: '#9aa0a8' }}>Point html.to.design at this page</span>
    </nav>
  );
}

export function PreviewShell({ current, intro, children }: { current: string; intro?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#eee9f4', minHeight: '100vh', fontFamily: 'Inter,sans-serif' }}>
      <PreviewNav current={current} />
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '24px 24px 120px' }}>
        {intro && <p style={{ font: '400 13px/1.6 Inter,sans-serif', color: '#6b7178', maxWidth: '70ch', marginBottom: 8 }}>{intro}</p>}
        {children}
      </div>
    </div>
  );
}

export function Frame({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' as const }}>
        <span style={{ font: '700 13px/1 Inter,sans-serif', color: '#23272d' }}>{label}</span>
        {note && <span style={{ font: '400 11.5px/1.4 Inter,sans-serif', color: '#9aa0a8' }}>{note}</span>}
      </div>
      <div style={{ border: '1px solid #cfc7dc', borderRadius: 6, background: '#fbfafd', padding: 16, overflow: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

/** Confines position:fixed descendants to this box instead of the viewport — CSS containing-block trick (any transform value works). */
export const containFixed: React.CSSProperties = { position: 'relative', transform: 'translateZ(0)', overflow: 'hidden' };
