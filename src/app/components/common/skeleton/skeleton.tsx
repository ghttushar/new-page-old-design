import Skeleton from '@mui/material/Skeleton';

interface ISkeletonProps {
  animation?: 'pulse' | 'wave' | false;
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded' | undefined;
  width?: number | string;
  height?: number | string;
  className?: string;
  color?: string;
}

export default function SkeletonComponent(props: ISkeletonProps) {
  const {
    animation = 'wave',
    variant,
    width,
    height,
    className,
    color,
  } = props;
  return (
    <div data-test="skeleton-component">
      <Skeleton
        animation={animation}
        variant={variant}
        width={width}
        height={height}
        className={className}
        style={{
          background: color,
        }}
      />
    </div>
  );
}
