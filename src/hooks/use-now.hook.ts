import { useEffect, useState } from 'react';

/** The current time, refreshed on an interval so relative labels such as "5 min ago" stay true. */
export default function useNow(intervalMs: number): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}
