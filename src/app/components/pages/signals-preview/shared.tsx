export const PREVIEW_PAGES: { path: string; label: string; note: string }[] = [
  { path: '/signals-preview/alerts', label: 'Alerts', note: 'The real, interactive Alerts tab — click through anything reachable by clicking.' },
  { path: '/signals-preview/meetings', label: 'Meetings', note: 'The real, interactive Meetings tab — click through anything reachable by clicking.' },
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
