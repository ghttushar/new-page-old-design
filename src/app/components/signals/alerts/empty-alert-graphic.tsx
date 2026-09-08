import { useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { PROTOTYPE_ALERTS } from '@/constants/signals/prototype-data';

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

  const onMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: px * 14, y: py * -14 });
  };

  const highCount = PROTOTYPE_ALERTS.filter((a) => a.priority === 'High').length;
  const accounts = new Set(PROTOTYPE_ALERTS.map((a) => a.account)).size;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <style>{`
        @keyframes eag-ping { 0% { transform: scale(0.55); opacity: .5; } 100% { transform: scale(1.85); opacity: 0; } }
        @keyframes eag-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      `}</style>

      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        style={{ position: 'relative', width: 240, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}
      >
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

        <div
          style={{
            position: 'relative', width: 74, height: 74, borderRadius: '50%', background: '#f3eefa',
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(119,70,155,.18)',
            transform: `translate(${tilt.x * 0.6}px, ${tilt.y * 0.6}px)`, transition: 'transform .15s ease-out',
          }}
        >
          <AnarixMark size={30} />
        </div>

        {DOT_POSITIONS.map((d, i) => (
          <span
            key={i}
            style={{
              position: 'absolute', left: `calc(50% + ${d.x}px)`, top: `calc(50% + ${d.y}px)`,
              width: 10, height: 10, borderRadius: '50%', background: d.color, marginLeft: -5, marginTop: -5,
              boxShadow: `0 0 0 4px ${d.color}22`, animation: `eag-float 3.6s ${d.delay} ease-in-out infinite`,
              transform: `translate(${tilt.x}px, ${tilt.y}px)`, transition: 'transform .15s ease-out',
              cursor: 'default',
            }}
          />
        ))}
      </div>

      <div style={{ marginTop: 18, textAlign: 'center', font: '500 11px/1.4 Inter,sans-serif', color: '#9aa0a8', whiteSpace: 'nowrap' as const }}>
        Watching {PROTOTYPE_ALERTS.length} alerts · {highCount} high priority · {accounts} accounts
      </div>
    </div>
  );
}
