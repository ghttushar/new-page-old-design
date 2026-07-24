import type { Decision } from '@/constants/signals/decisions.constants';
import { valueMagnitude } from '@/utils/signals/valueFormat';

export interface Situation {
  key: string;
  title: string;
  subtitle: string;
  domain: Decision['domain'];
  decisions: Decision[];
  totalCents: number;
  primaryKind: Decision['valueKind'];
  needsCount: number;
  merged: boolean;
  mergeReason: 'duplicate' | 'same_entity' | 'same_meeting' | 'same_domain';
}

function normalize(label: string): string {
  return (label || '')
    .toLowerCase()
    .replace(/^\W+|\W+$/g, '')
    .replace(/[^a-z0-9]+/g, '-');
}

function entityToken(label: string): string {
  const l = (label || '').toLowerCase();
  const after = l.split(/[·|]/).pop() || l;
  return normalize(after).split('-').slice(0, 3).join('-');
}

function bucket4h(ts: number): number {
  return Math.floor(ts / (4 * 3_600_000));
}

function situationKey(d: Decision): { key: string; reason: Situation['mergeReason'] } {
  if (d.dupeKey) return { key: `dupe:${d.dupeKey}`, reason: 'duplicate' };
  if (d.meetingRef?.bundleId) return { key: `mtg:${d.meetingRef.bundleId}`, reason: 'same_meeting' };
  const ent = entityToken(d.sourceRef.label);
  if (ent) return { key: `ent:${d.domain}:${ent}:${bucket4h(d.createdAt)}`, reason: 'same_entity' };
  return { key: `dom:${d.domain}:${bucket4h(d.createdAt)}:${d.id}`, reason: 'same_domain' };
}

function humanizeTitle(d: Decision): string {
  if (d.meetingRef?.title) return d.meetingRef.title;
  const parts = (d.sourceRef.label || '').split(/[·|]/).map((s) => s.trim());
  return parts[parts.length - 1] || d.sourceRef.label || d.insight;
}

function isNeeds(d: Decision): boolean {
  if (d.status !== 'open') return false;
  return d.severity === 'critical' || d.severity === 'opportunity';
}

export function groupBySituation(list: Decision[]): Situation[] {
  const map = new Map<string, Situation>();

  for (const d of list) {
    const { key, reason } = situationKey(d);
    if (!map.has(key)) {
      map.set(key, {
        key,
        title: humanizeTitle(d),
        subtitle: d.sourceRef.label,
        domain: d.domain,
        decisions: [],
        totalCents: 0,
        primaryKind: d.valueKind,
        needsCount: 0,
        merged: false,
        mergeReason: reason,
      });
    }
    const s = map.get(key)!;
    s.decisions.push(d);
    s.totalCents += valueMagnitude(d.valueKind, d.valueCents);
    if (isNeeds(d)) s.needsCount += 1;
    const cur = valueMagnitude(s.primaryKind, s.totalCents);
    const mag = valueMagnitude(d.valueKind, d.valueCents);
    if (mag > cur / (s.decisions.length || 1)) s.primaryKind = d.valueKind;
  }

  for (const s of map.values()) {
    s.merged = s.decisions.length >= 2 && s.mergeReason !== 'same_domain';
  }

  return Array.from(map.values());
}