import motion from '../alerts/motion.module.scss';

export interface EmptyStateCategory {
  key: string;
  label: string;
  count: number;
  unit: string;
  color: string;
  onClick?: () => void;
}

/** Orbiting dashed rings + floating dots around a center icon — a lighter, non-interactive cousin of EmptyAlertGraphic, tinted per-page via `dotColors`. */
function OrbitIcon({ icon, dotColors }: { icon: React.ReactNode; dotColors: string[] }) {
  const positions = [
    { x: -80, y: -32 }, { x: 76, y: -48 }, { x: -64, y: 46 }, { x: 80, y: 38 }, { x: 4, y: -78 },
  ];
  return (
    <div style={{ position: 'relative', width: 176, height: 176, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
      <style>{`
        @keyframes seh-spin { to { transform: rotate(360deg); } }
        @keyframes seh-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .seh-ring { animation: seh-spin 32s linear infinite; }
        .seh-ring-inner { animation: seh-spin 22s linear infinite reverse; }
        .seh-dot { animation: seh-float 3.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .seh-ring, .seh-ring-inner, .seh-dot { animation: none !important; } }
      `}</style>
      <span className="seh-ring" style={{ position: 'absolute', width: 148, height: 148, borderRadius: '50%', border: '1px dashed rgba(119,70,155,.2)' }} />
      <span className="seh-ring-inner" style={{ position: 'absolute', width: 106, height: 106, borderRadius: '50%', border: '1px dashed rgba(119,70,155,.15)' }} />
      <div style={{ position: 'relative', width: 64, height: 64, borderRadius: '50%', background: '#f1eefc', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 22px rgba(119,70,155,.16)' }}>
        {icon}
      </div>
      {positions.map((p, i) => {
        const color = dotColors[i % dotColors.length] ?? '#77469b';
        return (
          <span
            key={i}
            className="seh-dot"
            style={{
              position: 'absolute', left: `calc(50% + ${p.x}px)`, top: `calc(50% + ${p.y}px)`,
              width: 9, height: 9, marginLeft: -4.5, marginTop: -4.5, borderRadius: '50%',
              background: color, boxShadow: `0 0 0 4px ${color}22`, animationDelay: `${i * 0.4}s`,
            }}
          />
        );
      })}
    </div>
  );
}

export function CategoryCard({ label, count, unit, color, onClick }: EmptyStateCategory) {
  return (
    <div
      onClick={onClick}
      className={onClick ? `${motion.pressable} ${motion.cardHover}` : undefined}
      style={{ padding: '13px 14px', borderRadius: 12, background: `${color}0f`, border: `1px solid ${color}20`, cursor: onClick ? 'pointer' : 'default', textAlign: 'left' as const }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ font: '600 12px/1.3 Inter,sans-serif', color: '#3d434b', flex: 1, minWidth: 0 }}>{label}</span>
        {onClick && (
          <span style={{ flex: 'none', display: 'flex', color: '#9aa0a8' }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M6 3.5l5 4.5-5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        )}
      </div>
      <div style={{ marginTop: 9, display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span style={{ font: '700 21px/1 Inter,sans-serif', color: '#23272d' }}>{count}</span>
        <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{unit}</span>
      </div>
    </div>
  );
}

export function SignalsEmptyState({ icon, title, subtitle, categories }: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  categories: EmptyStateCategory[];
}) {
  return (
    <div style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 28px' }}>
      <OrbitIcon icon={icon} dotColors={categories.map((c) => c.color)} />
      <div style={{ font: '700 18px/1.4 Inter,sans-serif', color: '#23272d', marginTop: 20, textAlign: 'center' as const }}>{title}</div>
      <div style={{ font: '400 12.5px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 8, maxWidth: 380, textAlign: 'center' as const }}>{subtitle}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(120px, 1fr))', gap: 12, marginTop: 26, width: '100%', maxWidth: 480 }}>
        {categories.map(({ key, ...c }) => <CategoryCard key={key} {...c} />)}
      </div>
    </div>
  );
}
