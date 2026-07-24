import { CalendarBlank, ChatCircle, Users, Envelope, Sparkle, Robot, Lightning, TrendUp } from '@phosphor-icons/react';
import type { DecisionSource } from '@/utils/signals/sourceRegistry';
import type { Decision } from '@/constants/signals/decisions.constants';
import type { Icon } from '@phosphor-icons/react';

export interface SourcePill {
  label: string;
  tone: 'amazon' | 'agent' | 'meeting' | 'slack' | 'teams' | 'email' | 'forecast' | 'aan';
  Icon: Icon;
}

function guessAgent(label: string): string | null {
  const l = label.toLowerCase();
  if (l.includes('campaign') || l.includes('budget') || l.includes('bid')) return 'Campaign Agent';
  if (l.includes('buy box') || l.includes('buybox')) return 'Buy Box Agent';
  if (l.includes('inventory') || l.includes('stock') || l.includes('days-of-cover') || l.includes('supplier')) return 'Inventory Agent';
  if (l.includes('cs') || l.includes('refund') || l.includes('support')) return 'Support Agent';
  if (l.includes('pricing') || l.includes('price') || l.includes('margin')) return 'Pricing Agent';
  if (l.includes('forecast')) return 'Forecast';
  if (l.includes('listing') || l.includes('catalog') || l.includes('portal')) return 'Listings Agent';
  return null;
}

export function sourcePillFor(d: Decision): SourcePill {
  const s: DecisionSource = d.source;

  if (s === 'meeting') return { label: 'Meeting', tone: 'meeting', Icon: CalendarBlank };
  if (s === 'slack') return { label: 'Slack', tone: 'slack', Icon: ChatCircle };
  if (s === 'teams') return { label: 'Teams', tone: 'teams', Icon: Users };
  if (s === 'email') return { label: 'Email', tone: 'email', Icon: Envelope };
  if (s === 'aan') return { label: 'Aan', tone: 'aan', Icon: Sparkle };

  const agent = guessAgent(d.sourceRef.label || d.insight);
  if (agent === 'Forecast') return { label: 'Forecast', tone: 'forecast', Icon: TrendUp };
  if (agent) return { label: agent, tone: 'agent', Icon: Robot };

  const l = (d.sourceRef.label + ' ' + d.insight).toLowerCase();
  if (l.includes('walmart')) return { label: 'Walmart', tone: 'amazon', Icon: Lightning };

  return { label: 'Anarix', tone: 'agent', Icon: Lightning };
}

export const PILL_TONE_CLASS: Record<SourcePill['tone'], string> = {
  amazon: 'toneAmazon',
  agent: 'toneAgent',
  meeting: 'toneMeeting',
  slack: 'toneSlack',
  teams: 'toneTeams',
  email: 'toneEmail',
  forecast: 'toneForecast',
  aan: 'toneAan',
};