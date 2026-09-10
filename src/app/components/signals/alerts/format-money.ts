import type { PrototypeAlert } from '@/constants/signals/prototype-data';

/**
 * Formats a signed dollar amount for the alert cards, abbreviating at K/M. Only K/M
 * values carry decimals (always 2 digits) — a plain sub-$1,000 amount stays a whole
 * number. Guards the K→M boundary: a value that rounds to 1000.00K (e.g. 999,995) is
 * shown as 1.00M instead of the confusing "1000.00K".
 */
export function formatAlertValue(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? '−$' : '+$';

  if (abs < 1000) return sign + abs.toLocaleString();

  const roundedK = Math.round((abs / 1000) * 100) / 100;
  if (roundedK >= 1000) return sign + (abs / 1_000_000).toFixed(2) + 'M';
  return sign + roundedK.toFixed(2) + 'K';
}

/** Short methodology explanation for the value's "i" tooltip — built from fields already on the alert. */
export function explainAlertValue(alert: PrototypeAlert): string {
  const basis = alert.proof === 'verified' ? 'Verified' : 'Estimated';
  return `${basis} · ${alert.revLabel}: ${alert.revValue} over a ${alert.oppWindow === 'Closed' ? 'closed' : alert.oppWindow} window · ${alert.confidence}% confidence · Source: ${alert.source}`;
}
