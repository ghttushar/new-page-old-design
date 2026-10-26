/** A line for the empty dashboard: a light fact from the world of ads and marketplaces, or a pun. */
interface FunFact {
  kind: 'fact' | 'pun';
  text: string;
}

/** Shown on an empty dashboard. A different one shows on every visit. */
export const FUN_FACTS: FunFact[] = [
  { kind: 'fact', text: 'The first banner ad, in 1994, was clicked by 44% of the people who saw it. This dashboard is hoping to beat that.' },
  { kind: 'pun', text: 'A dashboard with no nuggets is just a board. Let’s fix that.' },
  { kind: 'pun', text: 'Nugget (n.): a small lump of something precious. Like your ROAS, once it lives here.' },
  { kind: 'pun', text: 'Empty dashboards have a 100% calm rate and a 0% insight rate.' },
  { kind: 'pun', text: 'You can’t spell “campaign” without “pain”. Nuggets help with that part.' },
  { kind: 'fact', text: 'The first book Amazon ever sold was about computer models of human thought. Your first nugget can be just as nerdy.' },
  { kind: 'pun', text: 'Your ACOS called. It would like somewhere nice to sit.' },
  { kind: 'pun', text: 'This space is so empty, even the keywords have gone negative.' },
  { kind: 'fact', text: 'Walmart opened its first store in 1962. It took a while to fill the shelves, too.' },
  { kind: 'pun', text: 'Rumour has it this dashboard bids on attention. Currently winning 0% of the Buy Box.' },
  { kind: 'pun', text: 'Nothing to see here. Yet. Nuggets are the cure for blank-board syndrome.' },
  { kind: 'pun', text: 'Breaking news: local dashboard still waiting for its first nugget. Witnesses say it looks hopeful.' },
  { kind: 'fact', text: 'Most clicks on a search page go to the first few results. Same goes for dashboards: put the good stuff up top.' },
  { kind: 'pun', text: 'Keep calm and add a nugget. Your future self will thank you at the weekly review.' },
];

const LAST_KEY = 'anarix-dashboard-fun-fact';

/** Any line but the one shown last time. */
export function pickFunFact(): FunFact & { index: number } {
  let last = -1;
  try { last = Number(window.localStorage.getItem(LAST_KEY) ?? -1); } catch { /* storage unavailable */ }
  const pool = FUN_FACTS.map((f, i) => ({ f, i })).filter(({ i }) => i !== last);
  const { f, i } = pool[Math.floor(Math.random() * pool.length)];
  return { ...f, index: i };
}

export function rememberFunFact(index: number): void {
  try { window.localStorage.setItem(LAST_KEY, String(index)); } catch { /* storage unavailable */ }
}
