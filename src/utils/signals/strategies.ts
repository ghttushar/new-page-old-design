import type { Decision } from '@/constants/signals/decisions.constants';
import { CRITICAL_ONLY_ID } from '@/constants/signals/criticalOnlyDecision';

export type Reversibility = 'reversible' | 'partial' | 'one_way';
export type RiskLevel = 'low' | 'medium' | 'high';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface Strategy {
  id: string;
  title: string;
  detail: string;
  valueCents: number;
  valueKind: Decision['valueKind'];
  cadence?: Decision['cadence'];
  confidence: ConfidenceLevel;
  risk: RiskLevel;
  reversibility: Reversibility;
  execution: string;
  recommended?: boolean;
  steps: { label: string; note?: string }[];
}

function confidenceForSeverity(sev: Decision['severity']): ConfidenceLevel {
  if (sev === 'critical') return 'high';
  if (sev === 'opportunity') return 'medium';
  return 'low';
}

export function strategiesFor(d: Decision): Strategy[] {
  if (d.id === CRITICAL_ONLY_ID) {
    return [
      {
        id: `${d.id}:recommended`,
        title: 'Escalate to Vendor Manager',
        detail:
          'Jiva drafts an email to the Vendor Manager notifying them about the cost-to-Amazon advertising eligibility warning — for your approval before it sends.',
        valueCents: d.valueCents,
        valueKind: d.valueKind,
        cadence: d.cadence,
        confidence: 'high',
        risk: 'low',
        reversibility: 'reversible',
        execution: 'opens Jiva draft',
        recommended: true,
        steps: [
          { label: 'Jiva drafts the VM escalation email in the side panel' },
          { label: 'You review & approve before it sends' },
        ],
      },
      {
        id: `${d.id}:draft-ticket`,
        title: 'Draft Support Ticket',
        detail:
          'Jiva drafts a support ticket to Amazon Seller Support disputing the cost-to-Amazon flag — for your approval before it goes to Seller Support.',
        valueCents: d.valueCents,
        valueKind: d.valueKind,
        cadence: d.cadence,
        confidence: 'medium',
        risk: 'low',
        reversibility: 'reversible',
        execution: 'opens Jiva draft',
        steps: [
          { label: 'Jiva drafts the support ticket in the side panel' },
          { label: 'You review & approve before it is filed' },
        ],
      },
      {
        id: `${d.id}:wait`,
        title: 'Monitor & Recheck',
        detail:
          'Jiva will re-check the warning status with fresh data in 24 hours and surface any changes.',
        valueCents: Math.round(d.valueCents * 0.25),
        valueKind: d.valueKind,
        cadence: d.cadence,
        confidence: 'medium',
        risk: 'low',
        reversibility: 'reversible',
        execution: 'queued for 24h',
        steps: [
          { label: 'Requeue for re-check', note: 'Jiva will surface a refreshed recommendation.' },
        ],
      },
      {
        id: `${d.id}:custom`,
        title: 'Write your custom instruction',
        detail:
          'Tell Jiva exactly what you want — revise the draft, check a different angle, escalate differently, or anything else.',
        valueCents: d.valueCents,
        valueKind: d.valueKind,
        cadence: d.cadence,
        confidence: 'medium',
        risk: 'low',
        reversibility: 'reversible',
        execution: 'opens custom input',
        steps: [
          { label: 'You write the instruction' },
          { label: 'Jiva executes and reports back' },
        ],
      },
    ];
  }

  const stepList = d.steps.map((s) => ({ label: s.label, note: s.why }));
  const conf = confidenceForSeverity(d.severity);
  const totalEta = d.steps.reduce((n, s) => n + s.etaSec, 0);
  const execStr = totalEta < 60 ? `~${totalEta}s` : totalEta < 3600 ? `~${Math.ceil(totalEta / 60)} min` : `~${(totalEta / 3600).toFixed(1)} h`;

  const primary: Strategy = {
    id: `${d.id}:recommended`,
    title: d.actionVerb,
    detail: d.valueBasis || d.insightDetail || d.insight,
    valueCents: d.valueCents,
    valueKind: d.valueKind,
    cadence: d.cadence,
    confidence: conf,
    risk: d.severity === 'critical' ? 'medium' : d.severity === 'opportunity' ? 'low' : 'low',
    reversibility: d.domain === 'cs' || d.domain === 'buyer' ? 'partial' : 'reversible',
    execution: execStr,
    recommended: true,
    steps: stepList,
  };

  const alternatives: Strategy[] = [];

  alternatives.push({
    id: `${d.id}:conservative`,
    title: `${d.actionVerb} — hero SKUs only`,
    detail: 'Apply the change only to the top-value SKUs first, monitor 24h, then expand.',
    valueCents: Math.round(d.valueCents * 0.65),
    valueKind: d.valueKind,
    cadence: d.cadence,
    confidence: conf === 'low' ? 'low' : 'medium',
    risk: 'low',
    reversibility: 'reversible',
    execution: `~${Math.max(2, Math.ceil(totalEta / 60 / 2))} min`,
    steps: stepList.slice(0, Math.max(1, stepList.length - 1)),
  });

  alternatives.push({
    id: `${d.id}:wait`,
    title: 'Wait until tomorrow',
    detail: 'Delay execution; Jiva will re-check with fresh data at 8am.',
    valueCents: Math.round(d.valueCents * 0.25),
    valueKind: d.valueKind,
    cadence: d.cadence,
    confidence: 'medium',
    risk: 'low',
    reversibility: 'reversible',
    execution: 'queued for 8am',
    steps: [{ label: 'Requeue for morning', note: 'Jiva will surface a refreshed recommendation.' }],
  });

  alternatives.push({
    id: `${d.id}:aan`,
    title: 'Let Jiva handle automatically',
    detail: 'Jiva will execute inside its policy budget and only ping you if it needs a decision.',
    valueCents: d.valueCents,
    valueKind: d.valueKind,
    cadence: d.cadence,
    confidence: conf,
    risk: 'low',
    reversibility: 'reversible',
    execution: 'immediate',
    steps: [{ label: 'Jiva executes within policy' }, { label: 'Notifies you only on exceptions' }],
  });

  return [primary, ...alternatives];
}
