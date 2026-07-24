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
        title: 'Analyze Listing',
        detail:
          'Aan reviews the listing, diffs the historical changes, reads sentiment on the currently eligible version, identifies the failing field, drafts the fix, and asks for your approval before publishing.',
        valueCents: d.valueCents,
        valueKind: d.valueKind,
        cadence: d.cadence,
        confidence: 'high',
        risk: 'low',
        reversibility: 'reversible',
        execution: '~2 min',
        recommended: true,
        steps: [
          { label: 'Review listing history & sentiment', note: 'Compare against the last eligible version.' },
          { label: 'Identify the failing field', note: 'Locate the exact attribute Amazon flagged.' },
          { label: 'Draft compliant edit for your approval', note: 'Nothing publishes without your OK.' },
        ],
      },
      {
        id: `${d.id}:notify-vm`,
        title: 'Notify Vendor Manager',
        detail:
          'If the listing looks fine, Aan drafts an email to the Vendor Manager for your approval before it sends.',
        valueCents: d.valueCents,
        valueKind: d.valueKind,
        cadence: d.cadence,
        confidence: 'medium',
        risk: 'low',
        reversibility: 'reversible',
        execution: 'opens Aan draft',
        steps: [
          { label: 'Aan drafts the VM email in the side panel' },
          { label: 'You review & approve before it sends' },
        ],
      },
      {
        id: `${d.id}:draft-ticket`,
        title: 'Draft Amazon Support Ticket',
        detail:
          "If Amazon's eligibility claim looks false, Aan drafts a support ticket disputing it — for your approval before it goes to Seller Support.",
        valueCents: d.valueCents,
        valueKind: d.valueKind,
        cadence: d.cadence,
        confidence: 'medium',
        risk: 'low',
        reversibility: 'reversible',
        execution: 'opens Aan draft',
        steps: [
          { label: 'Aan drafts the support ticket in the side panel' },
          { label: 'You review & approve before it is filed' },
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
    detail: 'Delay execution; Aan will re-check with fresh data at 8am.',
    valueCents: Math.round(d.valueCents * 0.25),
    valueKind: d.valueKind,
    cadence: d.cadence,
    confidence: 'medium',
    risk: 'low',
    reversibility: 'reversible',
    execution: 'queued for 8am',
    steps: [{ label: 'Requeue for morning', note: 'Aan will surface a refreshed recommendation.' }],
  });

  alternatives.push({
    id: `${d.id}:aan`,
    title: 'Let Aan handle automatically',
    detail: "Aan will execute inside its policy budget and only ping you if it needs a decision.",
    valueCents: d.valueCents,
    valueKind: d.valueKind,
    cadence: d.cadence,
    confidence: conf,
    risk: 'low',
    reversibility: 'reversible',
    execution: 'immediate',
    steps: [{ label: 'Aan executes within policy' }, { label: 'Notifies you only on exceptions' }],
  });

  return [primary, ...alternatives];
}