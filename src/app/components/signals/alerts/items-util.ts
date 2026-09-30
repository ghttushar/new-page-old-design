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
/**
 * `AlertItem.sku` is actually populated with an ASIN-shaped value everywhere (e.g. `B08XK2QW9L`) —
 * there's no separate human-readable SKU in the data model. Rather than author one for 70+ mock
 * items, this derives a plausible short SKU from the item's own name + ASIN tail, deterministically,
 * so the "SKU" and "ASIN" columns always show two different-looking values for the same row.
 */
export function deriveSku(name: string, asin: string): string {
  const initials = name
    .split(/[\s·—-]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 4);
  return `${initials || 'SKU'}-${asin.slice(-5)}`;
}

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
