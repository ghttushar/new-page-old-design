import { isNearBottom } from '@/utils';
import { useEffect, useRef } from 'react';

export default function useContainerAutoScrollDown() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const onScroll = () => {
      shouldAutoScrollRef.current = isNearBottom(container);
    };

    container.addEventListener('scroll', onScroll);

    const observer = new ResizeObserver(() => {
      if (!shouldAutoScrollRef.current) return;

      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    });

    observer.observe(content);

    return () => {
      observer.disconnect();
      container.removeEventListener('scroll', onScroll);
    };
  }, []);

  return {
    containerRef,
    contentRef,
  };
}
