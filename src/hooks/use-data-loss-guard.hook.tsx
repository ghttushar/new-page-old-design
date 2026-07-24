import { useEffect, useRef } from 'react';
import { unstable_useBlocker } from 'react-router-dom';

const useDataLossGuard = (isDirty: boolean) => {
  const blocker = unstable_useBlocker(isDirty);
  const navigationRef = useRef<(() => void) | null>(null);

  // restrict navigation for refresh / tab close
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // restrict navigation for browser navigation buttons / SPA navigation
  useEffect(() => {
    if (blocker.state === 'blocked') {
      navigationRef.current = () => {
        blocker.proceed();
      };
    }
  }, [blocker]);

  const proceedNavigation = () => {
    navigationRef.current?.();
    navigationRef.current = null;
  };

  return { proceedNavigation };
};

export default useDataLossGuard;
