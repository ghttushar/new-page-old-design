import { cn } from '@/lib/utils';

const CORAL = {
  base: '#f46d76',
  light: '#f88a93',
  deep: '#f05e6a',
};

interface DiamondMascotProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/** Static coral diamond — the Jiva (Aan) mascot shape. No state, no animation. */
export function DiamondMascot({
  size = 24,
  className,
  style,
  onClick,
}: DiamondMascotProps) {
  const big = size > 40;
  return (
    <span
      aria-hidden
      className={cn('inline-block shrink-0 select-none', className)}
      style={{ position: 'relative', width: size, height: size, ...style }}
      onClick={onClick}
    >
      <span
        style={{
          position: 'absolute',
          inset: 0,
          transform: 'rotate(45deg)',
          borderRadius: '18%',
          background: `radial-gradient(circle at 50% 38%, ${CORAL.light} 0%, #f57780 42%, ${CORAL.base} 78%, ${CORAL.deep} 100%)`,
          boxShadow: big
            ? '0 26px 64px -28px rgba(244,109,118,0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
            : 'inset 0 1px 0 rgba(255,255,255,0.22)',
          overflow: 'hidden',
        }}
      >
        {/* Sheen */}
        <span
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 28% 22%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 45%)',
          }}
        />
        {/* Inner periwinkle ring */}
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '18%',
            boxShadow: 'inset 0 0 0 1px rgba(167, 174, 242, 0.18)',
          }}
        />
      </span>
    </span>
  );
}

export default DiamondMascot;
