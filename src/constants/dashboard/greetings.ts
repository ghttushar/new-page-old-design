/** The name the dashboard greets. Fixed for now; it will come from the signed-in user later. */
export const DASHBOARD_USER_NAME = 'Tushar';

/** Hours (0-23) a greeting fits. Left out means any time of day. */
interface Greeting {
  text: (name: string) => string;
  hours?: [from: number, to: number];
}

/** Greetings for the top of the dashboard. A different one shows on every visit. */
export const GREETINGS: Greeting[] = [
  { text: (n) => `Rise and shine, ${n}`, hours: [5, 11] },
  { text: (n) => `Howdy, ${n}` },
  { text: (n) => `Hello there, ${n}` },
  { text: (n) => `Ahoy, Captain ${n}` },
  { text: (n) => `Look who’s back, ${n}` },
  { text: (n) => `Top of the day to you, ${n}` },
  { text: (n) => `Hey ${n}, the numbers sat up straight for you` },
  { text: (n) => `Welcome back, ${n}. Coffee and KPIs?` },
  { text: (n) => `Greetings, ${n}. Let’s make some money moves` },
  { text: (n) => `Burning the midnight oil, ${n}?`, hours: [22, 4] },
];

const fits = (g: Greeting, hour: number) => {
  if (!g.hours) return true;
  const [from, to] = g.hours;
  return from <= to ? hour >= from && hour <= to : hour >= from || hour <= to;
};

const LAST_KEY = 'anarix-dashboard-greeting';

/** Picks a greeting for the current hour, never the same one as last time. Pure: call rememberGreeting once it shows. */
export function pickGreeting(name = DASHBOARD_USER_NAME, now = new Date()): { text: string; index: number } {
  let last = -1;
  try { last = Number(window.localStorage.getItem(LAST_KEY) ?? -1); } catch { /* storage unavailable */ }
  const pool = GREETINGS.map((g, i) => ({ g, i })).filter(({ g, i }) => fits(g, now.getHours()) && i !== last);
  const { g, i } = pool[Math.floor(Math.random() * pool.length)];
  return { text: g.text(name), index: i };
}

export function rememberGreeting(index: number): void {
  try { window.localStorage.setItem(LAST_KEY, String(index)); } catch { /* storage unavailable */ }
}
