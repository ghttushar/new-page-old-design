import type { AlertItem, PrototypeAlert } from '@/constants/signals/prototype-data';
import { getDisplayItems } from './items-util';

/**
 * An alert's affected items can be worked through in batches: one action on some ASINs, another on the rest. Each batch
 * records the action and the items it covered (by ASIN); an item in no batch is still pending.
 */
export interface ItemBatch {
  id: string;
  /** The action applied, as shown in the Suggested actions list. */
  label: string;
  keys: string[];
  /** Items left over when the alert was dismissed. */
  dismissed?: boolean;
}

export const itemKey = (item: AlertItem) => item.sku;

export function actionedKeys(batches: ItemBatch[] = []): Set<string> {
  return new Set(batches.flatMap((b) => b.keys));
}

/** The alert's items no batch has covered yet, in the alert's own order. */
export function pendingItems(alert: PrototypeAlert, batches: ItemBatch[] = []): AlertItem[] {
  const done = actionedKeys(batches);
  return getDisplayItems(alert).filter((it) => !done.has(itemKey(it)));
}

/** The status an item shows in the "All affected items" list: the action applied to it, or Pending. */
export function statusLabel(batches: ItemBatch[] = []): (item: AlertItem) => string {
  const byKey = new Map<string, ItemBatch>();
  batches.forEach((b) => b.keys.forEach((k) => byKey.set(k, b)));
  return (item) => {
    const b = byKey.get(itemKey(item));
    if (!b) return 'Pending';
    return b.dismissed ? 'Dismissed' : b.label;
  };
}
