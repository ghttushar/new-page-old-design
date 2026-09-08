import type { PrototypeAlert } from '@/constants/signals/prototype-data';

/**
 * Formats a signed dollar amount for the alert cards, abbreviating at K/M.
 * Guards the K→M boundary: a value that rounds to 1000.0K (e.g. 999,950) is
 * shown as 1.0M instead of the confusing "1000K".
 */
export function formatAlertValue(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? '−$' : '+$';

  if (abs >= 999_950) {
    return sign + (abs / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (abs >= 1000) {
    const k = abs / 1000;
    const rounded = Math.round(k * 10) / 10;
    if (rounded >= 1000) return sign + (abs / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    return sign + rounded.toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return sign + abs.toLocaleString();
}

/** Short methodology explanation for the value's "i" tooltip — built from fields already on the alert. */
export function explainAlertValue(alert: PrototypeAlert): string {
  const basis = alert.proof === 'verified' ? 'Verified' : 'Estimated';
  return `${basis} · ${alert.revLabel}: ${alert.revValue} over a ${alert.oppWindow === 'Closed' ? 'closed' : alert.oppWindow} window · ${alert.confidence}% confidence · Source: ${alert.source}`;
}
