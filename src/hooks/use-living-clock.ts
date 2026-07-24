import { useEffect, useState } from 'react';

let tickListeners: Array<(t: number) => void> = [];
let currentTick = 0;

if (typeof window !== 'undefined') {
  setInterval(() => {
    currentTick += 1;
    tickListeners.forEach((fn) => fn(currentTick));
  }, 6000);
}

export function useLivingTick(): number {
  const [t, setT] = useState(currentTick);
  useEffect(() => {
    const fn = (n: number) => setT(n);
    tickListeners.push(fn);
    return () => { tickListeners = tickListeners.filter((f) => f !== fn); };
  }, []);
  return t;
}