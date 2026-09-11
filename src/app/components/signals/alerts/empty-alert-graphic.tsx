import { useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';

const DOT_POSITIONS = [
  { x: -84, y: -34, color: '#b3453f', delay: '0s' },
  { x: 80, y: -50, color: '#5c7f9e', delay: '.6s' },
  { x: -66, y: 56, color: '#3f7d6a', delay: '1.1s' },
  { x: 90, y: 38, color: '#a8763f', delay: '1.6s' },
  { x: 2, y: -88, color: '#77469b', delay: '.3s' },
];

function AnarixMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 607 343" fill="#77469b">
      <polygon points="300.4,149.8 366.5,74.4 299.7,0 233.6,75.4" />
      <path d="M399.9,111.7l-99.1,113.1L200.6,113.1L0,342h155.4c27.2,0,53-11.7,70.9-32.1l74.7-85.2l77.2,86.1
        c17.9,19.9,43.4,31.3,70.2,31.3h158.1L399.9,111.7L399.9,111.7z" />
    </svg>
  );
}

export function EmptyAlertGraphic() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);

  const onMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: px * 18, y: py * -18 });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <style>{`
        @keyframes eag-ping { 0% { transform: scale(0.55); opacity: .5; } 100% { transform: scale(1.85); opacity: 0; } }
        @keyframes eag-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes eag-spin { to { transform: rotate(360deg); } }
        @keyframes eag-spin-reverse { to { transform: rotate(-360deg); } }
        @keyframes eag-line-pulse { 0%, 100% { opacity: .1; } 50% { opacity: .38; } }
        .eag-halo { animation: eag-spin 26s linear infinite; }
        .eag-halo-inner { animation: eag-spin-reverse 18s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .eag-halo, .eag-halo-inner { animation: none; }
        }
      `}</style>

      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHoveredDot(null); }}
        style={{ position: 'relative', width: 240, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}
      >
        {/* Ambient rotating halos — pure decoration, gives the whole thing a "live radar" feel at rest */}
        <span className="eag-halo" style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', border: '1px dashed rgba(119,70,155,.16)' }} />
        <span className="eag-halo-inner" style={{ position: 'absolute', width: 152, height: 152, borderRadius: '50%', border: '1px dashed rgba(119,70,155,.13)' }} />

        <div
          style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: `translate(${tilt.x * 0.4}px, ${tilt.y * 0.4}px)`, transition: 'transform .15s ease-out',
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                position: 'absolute', width: 92, height: 92, borderRadius: '50%',
                border: '1.5px solid rgba(119,70,155,.32)', animation: `eag-ping 2.8s ${i * 0.9}s ease-out infinite`,
              }}
            />
          ))}
        </div>

        {/* Signal lines from the core to each watched point — turns the dots from decoration into a small network */}
        <svg width={240} height={240} style={{ position: 'absolute', inset: 0, transform: `translate(${tilt.x * 0.5}px, ${tilt.y * 0.5}px)`, transition: 'transform .15s ease-out' }}>
          {DOT_POSITIONS.map((d, i) => (
            <line
              key={i}
              x1={120} y1={120}
              x2={120 + d.x} y2={120 + d.y}
              stroke={d.color}
              strokeWidth={1}
              strokeDasharray="3 4"
              style={{ opacity: hoveredDot === i ? 0.6 : undefined, animation: hoveredDot === i ? undefined : `eag-line-pulse 3.6s ${d.delay} ease-in-out infinite`, transition: 'opacity 160ms ease-out' }}
            />
          ))}
        </svg>

        <div
          style={{
            position: 'relative', width: 74, height: 74, borderRadius: '50%', background: '#f3eefa',
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(119,70,155,.18)',
            transform: `translate(${tilt.x * 0.6}px, ${tilt.y * 0.6}px)`, transition: 'transform .15s ease-out',
          }}
        >
          <AnarixMark size={30} />
        </div>

        {DOT_POSITIONS.map((d, i) => {
          const hovered = hoveredDot === i;
          return (
            <span
              key={i}
              onMouseEnter={() => setHoveredDot(i)}
              onMouseLeave={() => setHoveredDot(null)}
              style={{
                position: 'absolute', left: `calc(50% + ${d.x}px)`, top: `calc(50% + ${d.y}px)`,
                width: hovered ? 14 : 10, height: hovered ? 14 : 10, borderRadius: '50%', background: d.color,
                marginLeft: hovered ? -7 : -5, marginTop: hovered ? -7 : -5,
                boxShadow: hovered ? `0 0 0 6px ${d.color}33` : `0 0 0 4px ${d.color}22`,
                animation: hovered ? undefined : `eag-float 3.6s ${d.delay} ease-in-out infinite`,
                transform: `translate(${tilt.x}px, ${tilt.y}px)`,
                transition: 'transform .15s ease-out, width 160ms ease-out, height 160ms ease-out, margin 160ms ease-out, box-shadow 160ms ease-out',
                cursor: 'default',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
