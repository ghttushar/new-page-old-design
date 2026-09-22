import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const CORAL = {
  base: '#f46d76',
  light: '#f88a93',
  deep: '#f05e6a',
};

export type JivaMascotState = 'idle' | 'listening' | 'thinking' | 'working' | 'speaking' | 'anchor';
type Shape = 'diamond' | 'circle' | 'cube' | 'bar';

/** State is shape: idle/anchor/speaking → diamond, listening → circle, thinking → cube, working → bar. */
function shapeFor(state: JivaMascotState): Shape {
  if (state === 'listening') return 'circle';
  if (state === 'thinking') return 'cube';
  if (state === 'working') return 'bar';
  return 'diamond';
}

interface DiamondMascotProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  /** Drives shape + motion. Defaults to 'idle' — a plain static diamond, same as before this got dynamic. */
  state?: JivaMascotState;
  /** Turns on cursor-tracking eyes/body-lean and hover curvature. Off by default so existing icon-only usages are unaffected. */
  interactive?: boolean;
  /** 0–100 fill shown inside the 'working' bar shape. */
  progress?: number;
  /** Softens the diamond's corners without changing shape — e.g. while the user is typing to it. No effect on non-diamond shapes. */
  rounded?: boolean;
}

/** The Jiva (Aan) chat mascot — a coral diamond that morphs shape with state and, when interactive, leans/looks toward the cursor. */
export function DiamondMascot({
  size = 24,
  className,
  style,
  onClick,
  state = 'idle',
  interactive = false,
  progress = 0,
  rounded = false,
}: DiamondMascotProps) {
  const shape = shapeFor(state);
  const big = size > 40;
  const rootRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);
  const [lean, setLean] = useState({ x: 0, y: 0 });
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  const canTrackCursor = interactive && size >= 24 && shape !== 'bar';
  const showEyes = shape !== 'bar' && size >= 16;

  useEffect(() => {
    if (!canTrackCursor) {
      setLean({ x: 0, y: 0 });
      setGaze({ x: 0, y: 0 });
      return;
    }
    const handler = (e: MouseEvent) => {
      const node = rootRef.current;
      if (!node) return;
      const bounds = node.getBoundingClientRect();
      const cx = bounds.left + bounds.width / 2;
      const cy = bounds.top + bounds.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.min(1, Math.hypot(dx, dy) / 380);
      const angle = Math.atan2(dy, dx);
      const travel = Math.max(2, size * 0.05);
      setLean({ x: Math.cos(angle) * dist * travel, y: Math.sin(angle) * dist * travel });
      const eyeRange = size * 0.06;
      const eyeDist = Math.min(1, Math.hypot(dx, dy) / 240);
      setGaze({ x: Math.cos(angle) * eyeDist * eyeRange, y: Math.sin(angle) * eyeDist * eyeRange });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [canTrackCursor, size]);

  useEffect(() => {
    if (!showEyes || !interactive) return;
    let cancelled = false;
    const schedule = () => {
      const delay = state === 'listening' ? 2200 + Math.random() * 2200 : 3400 + Math.random() * 3400;
      return window.setTimeout(() => {
        if (cancelled) return;
        setBlink(true);
        window.setTimeout(() => !cancelled && setBlink(false), 140);
        schedule();
      }, delay);
    };
    const t = schedule();
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [showEyes, interactive, state]);

  const baseRotate = shape === 'diamond' ? 45 : 0;
  const hoverBoost = (interactive && hovered && shape === 'diamond') || (rounded && shape === 'diamond');
  const radius = shape === 'circle' ? '50%' : shape === 'bar' ? '999px' : shape === 'cube' ? '16%' : hoverBoost ? '30%' : '18%';
  const bodyW = shape === 'bar' ? size * 1.8 : shape === 'cube' ? size * 0.92 : size;
  const bodyH = shape === 'bar' ? size * 0.34 : shape === 'cube' ? size * 0.92 : size;
  const scaleX = hoverBoost ? 1.06 : 1;
  const scaleY = hoverBoost ? 0.95 : 1;

  const eyeSize = shape === 'bar' ? size * 0.11 : size * 0.16;
  const eyeOffsetX = shape === 'bar' ? size * 0.1 : shape === 'circle' ? size * 0.2 : size * 0.18;
  const eyeY = shape === 'diamond' ? size * 0.04 : 0;
  const eyeTravel = Math.max(1, size * 0.05);
  const gx = Math.max(-eyeTravel, Math.min(eyeTravel, gaze.x));
  const gy = Math.max(-eyeTravel, Math.min(eyeTravel, gaze.y));

  const slotW = Math.max(size, bodyW);
  const slotH = Math.max(size, bodyH);
  const barProgress = Math.max(0, Math.min(100, progress));

  return (
    <span
      ref={rootRef}
      aria-hidden
      className={cn('inline-block shrink-0 select-none', className)}
      style={{ position: 'relative', width: slotW, height: slotH, ...style }}
      onClick={onClick}
      onMouseEnter={() => canTrackCursor && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Lean layer — body-follows-cursor translate, isolated from the shape's own rotate/scale transition */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${lean.x}px, ${lean.y}px)`,
          transition: 'transform 200ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {state === 'speaking' && (
          <span
            aria-hidden
            style={{
              position: 'absolute', top: '50%', left: '50%', width: bodyW, height: bodyH,
              borderRadius: radius, border: `1px solid ${CORAL.base}`,
              transform: `translate(-50%, -50%) rotate(${baseRotate}deg)`,
              animation: 'jivaMascotRipple 1.6s ease-out infinite',
            }}
          />
        )}
        <span
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: bodyW,
            height: bodyH,
            marginLeft: -bodyW / 2,
            marginTop: -bodyH / 2,
            borderRadius: radius,
            transform: `rotate(${baseRotate}deg) scale(${scaleX}, ${scaleY})`,
            transformOrigin: 'center',
            background:
              shape === 'bar'
                ? 'linear-gradient(180deg, rgba(244,109,118,0.18) 0%, rgba(244,109,118,0.28) 100%)'
                : `radial-gradient(circle at 50% 38%, ${CORAL.light} 0%, #f57780 42%, ${CORAL.base} 78%, ${CORAL.deep} 100%)`,
            boxShadow: big
              ? '0 26px 64px -28px rgba(244,109,118,0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
              : 'inset 0 1px 0 rgba(255,255,255,0.22)',
            overflow: 'hidden',
            transition: 'width 240ms cubic-bezier(0.34,1.3,0.64,1), height 240ms cubic-bezier(0.34,1.3,0.64,1), border-radius 240ms cubic-bezier(0.34,1.3,0.64,1), transform 240ms cubic-bezier(0.34,1.3,0.64,1)',
            animation: state === 'thinking' ? 'jivaMascotSpin 4.5s linear infinite' : undefined,
          }}
        >
          {/* Sheen */}
          <span
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 28% 22%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 45%)',
            }}
          />
          {/* Inner periwinkle ring */}
          <span
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: radius,
              boxShadow: 'inset 0 0 0 1px rgba(167, 174, 242, 0.18)',
            }}
          />
          {/* Working-state progress fill */}
          {shape === 'bar' && (
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${barProgress}%`,
                borderRadius: 999,
                background: `linear-gradient(90deg, ${CORAL.deep} 0%, ${CORAL.base} 60%, ${CORAL.light} 100%)`,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45), 0 0 12px -2px rgba(244,109,118,0.55)',
                transition: 'width 300ms ease-out',
              }}
            />
          )}
        </span>
      </span>

      {/* Eyes — overlay, always upright regardless of body rotation */}
      {showEyes && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          {[-1, 1].map((dir) => (
            <span
              key={`eye-${dir}`}
              style={{
                position: 'absolute',
                left: `calc(50% + ${dir * eyeOffsetX}px)`,
                top: `calc(50% + ${eyeY}px)`,
                width: eyeSize,
                height: eyeSize,
                marginLeft: -eyeSize / 2,
                marginTop: -eyeSize / 2,
                borderRadius: '50%',
                background: '#1a0608',
                transform: `translate(${gx}px, ${gy}px) scaleY(${blink ? 0.08 : 1})`,
                transition: 'transform 160ms ease-out',
              }}
            />
          ))}
        </div>
      )}
      <style>{`
        @keyframes jivaMascotSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes jivaMascotRipple { 0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; } 100% { transform: translate(-50%, -50%) scale(1.45); opacity: 0; } }
      `}</style>
    </span>
  );
}

export default DiamondMascot;
