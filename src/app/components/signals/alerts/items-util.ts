import type { AlertItem, PrototypeAlert } from '@/constants/signals/prototype-data';

function jitterImpact(raw: string, seed: number): string {
  const negative = raw.includes('−') || raw.trim().startsWith('-');
  const numeric = parseFloat(raw.replace(/[^0-9.]/g, '')) || 0;
  const factor = 0.55 + ((seed * 37) % 90) / 100;
  const varied = Math.max(10, Math.round((numeric * factor) / 10) * 10);
  return (negative ? '−$' : '+$') + varied.toLocaleString();
}

/**
 * Alerts author a handful of real sample rows in `items` alongside a much larger `itemsCount`.
 * Fills the gap with deterministic synthetic rows (cycled from the real ones, jittered impact,
 * numbered SKU) so the card meta line, the "Affected items" list, and the popup table all show
 * the same count instead of a handful of real rows against a much bigger headline number.
 */
export function getDisplayItems(alert: Pick<PrototypeAlert, 'items' | 'itemsCount'>): AlertItem[] {
  const target = alert.itemsCount;
  const base = alert.items;
  if (base.length === 0 || target <= base.length) return base.slice(0, target);

  const out: AlertItem[] = base.slice();
  for (let i = base.length; i < target; i++) {
    const src = base[i % base.length];
    out.push({
      name: `${src.name} #${i + 1}`,
      sku: `${src.sku}-${String(i + 1).padStart(3, '0')}`,
      impact: jitterImpact(src.impact, i + 1),
      color: src.color,
    });
  }
  return out;
}
