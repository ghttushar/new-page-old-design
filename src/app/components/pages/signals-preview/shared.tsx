import Sidebar from '../../layout/side-bar/side-bar';

/** The Work-station design-handoff pages — small topical pages so each one imports quickly and nothing is cut off. */
export const WORKSTATION_PAGES: { path: string; label: string; note: string }[] = [
  { path: '/signals-preview/workstation-all', label: 'All screens', note: 'Every Work-station screen on one page — one link to import everything.' },
  { path: '/signals-preview/workstation', label: 'WS · Layout', note: 'Default screen, Ask Jiva open, collapsed list, Signals header menus.' },
  { path: '/signals-preview/workstation-list', label: 'WS · List & read state', note: 'The three groups, and unread (bold) vs read (medium) task titles.' },
  { path: '/signals-preview/workstation-filters', label: 'WS · Search & filters', note: 'Search, the Filter popover, and the category-card filters.' },
  { path: '/signals-preview/workstation-menus', label: 'WS · Row menus', note: 'The ⋮ row menu, its Share submenu, and the reminder toast.' },
  { path: '/signals-preview/workstation-detail', label: 'WS · Meeting tasks', note: 'Right column for tasks that came from a meeting — collapsed, Context expanded, Context + Activity expanded.' },
  { path: '/signals-preview/workstation-alerts', label: 'WS · Alert tasks', note: 'Right column for tasks that came from an alert — suggested actions, affected items, executed / dismissed, collapsed and expanded.' },
  { path: '/signals-preview/workstation-origins', label: 'WS · Jiva & created tasks', note: 'Right column for Jiva-generated tasks and tasks created directly.' },
  { path: '/signals-preview/workstation-fields', label: 'WS · Fields & popovers', note: 'Assignee / Status / Priority / Due editors, title and description editing, Share popover.' },
  { path: '/signals-preview/workstation-activity', label: 'WS · Activity', note: 'Activity expanded, comment composer, comment typed, Context + Activity together.' },
  { path: '/signals-preview/workstation-new-task', label: 'WS · New task', note: 'The New task screen in the right column — empty, filled, and each field menu.' },
  { path: '/signals-preview/workstation-jiva', label: 'WS · Ask Jiva', note: 'The Ask Jiva chat column in every state.' },
];

export const PREVIEW_PAGES = WORKSTATION_PAGES;

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

/** Each frame carries its own collapsed nav rail so a screenshot of just this box reads as a full app screen, not a bare floating panel. */
export function Frame({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' as const }}>
        <span style={{ font: '700 13px/1 Inter,sans-serif', color: '#23272d' }}>{label}</span>
        {note && <span style={{ font: '400 11.5px/1.4 Inter,sans-serif', color: '#9aa0a8' }}>{note}</span>}
      </div>
      <div style={{ border: '1px solid #cfc7dc', borderRadius: 6, background: '#fbfafd', padding: 16, overflow: 'auto', display: 'flex', gap: 16, alignItems: 'stretch' }}>
        <Sidebar forceCollapsed />
        {children}
      </div>
    </div>
  );
}

/** Divides the merged page into its Alerts/Meetings halves. */
export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 44, paddingTop: 20, borderTop: '2px solid #cfc7dc' }}>
      <h2 style={{ font: '800 20px/1.3 Inter,sans-serif', color: '#23272d', margin: 0 }}>{children}</h2>
    </div>
  );
}

/** Confines position:fixed descendants to this box instead of the viewport — CSS containing-block trick (any transform value works). */
export const containFixed: React.CSSProperties = { position: 'relative', transform: 'translateZ(0)', overflow: 'hidden' };
