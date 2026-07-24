import { containerCollapseAnimationStyles } from '@/assets/styles/variables/common-new-ui/common-new-ui.styles';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const COLLAPSE_ANIMATION_DURATION_MS = 220;

export default function useContainerCollapseAnimation(
  containerOpen: boolean,
  dependency?: any
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heightModeRef = useRef<'fixed' | 'auto'>('fixed');
  const animationFrameRef = useRef<number | null>(null);
  const autoHeightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const [height, setHeight] = useState<number | 'auto'>(0);
  const [dependencyState, setDependencyState] = useState<any>(dependency);

  useEffect(() => {
    setDependencyState(dependency);
  }, [dependency]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (autoHeightTimeoutRef.current !== null) {
      clearTimeout(autoHeightTimeoutRef.current);
      autoHeightTimeoutRef.current = null;
    }

    if (containerOpen) {
      if (heightModeRef.current === 'auto') return;

      const originalHeight = containerRef.current.style.height;
      containerRef.current.style.height = 'auto';
      const contentHeight = containerRef.current.scrollHeight + 2;
      containerRef.current.style.height = originalHeight;

      setHeight(contentHeight);
      autoHeightTimeoutRef.current = setTimeout(() => {
        heightModeRef.current = 'auto';
        setHeight('auto');
      }, COLLAPSE_ANIMATION_DURATION_MS);
    } else {
      const originalHeight = containerRef.current.style.height;
      containerRef.current.style.height = 'auto';
      const contentHeight = containerRef.current.scrollHeight + 2;
      containerRef.current.style.height = originalHeight;

      heightModeRef.current = 'fixed';
      setHeight(contentHeight);

      animationFrameRef.current = requestAnimationFrame(() => {
        setHeight(0);
        animationFrameRef.current = null;
      });
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (autoHeightTimeoutRef.current !== null) {
        clearTimeout(autoHeightTimeoutRef.current);
        autoHeightTimeoutRef.current = null;
      }
    };
  }, [containerOpen, dependencyState]);

  return {
    containerRef,
    containerCollapseAnimationStyles: containerCollapseAnimationStyles(
      height,
      containerOpen
    ) as React.CSSProperties,
  };
}
