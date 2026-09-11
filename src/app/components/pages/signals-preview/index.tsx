import { PREVIEW_PAGES } from './shared';

export default function SignalsPreviewIndex() {
  return (
    <div style={{ background: '#eee9f4', minHeight: '100vh', fontFamily: 'Inter,sans-serif', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: 760, width: '100%', padding: '64px 24px' }}>
        <span style={{ font: '600 11px/1 Inter,sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#77469b' }}>Signals · design handoff</span>
        <h1 style={{ font: '800 26px/1.3 Inter,sans-serif', color: '#23272d', margin: '10px 0 8px' }}>Component preview</h1>
        <p style={{ font: '400 13.5px/1.7 Inter,sans-serif', color: '#6b7178', maxWidth: '62ch' }}>
          Every Alerts and Meetings screen, panel and menu on one page as static frames — nothing to click through.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 28 }}>
          {PREVIEW_PAGES.map((p) => (
            <a
              key={p.path}
              href={p.path}
              style={{ display: 'block', padding: '16px 18px', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, textDecoration: 'none' }}
            >
              <div style={{ font: '700 14px/1.3 Inter,sans-serif', color: '#23272d' }}>{p.label}</div>
              <div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 4 }}>{p.note}</div>
              <div style={{ font: '500 11px/1 Inter,sans-serif', color: '#77469b', marginTop: 8 }}>{p.path}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
