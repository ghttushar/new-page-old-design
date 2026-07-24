export type ValueKind = 'gain' | 'cost' | 'at_risk' | 'info';
export type Cadence = 'one_time' | 'daily' | 'weekly' | 'monthly';

const CADENCE_SUFFIX: Record<Cadence, string> = {
  one_time: '1×',
  daily: '/d',
  weekly: '/wk',
  monthly: '/mo',
};

function formatMoney(absCents: number): string {
  const dollars = Math.round(absCents / 100);
  if (dollars < 1000) return `$${dollars.toLocaleString()}`;
  if (dollars < 100_000) {
    const k = dollars / 1000;
    return `$${k >= 10 ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  if (dollars < 1_000_000) return `$${Math.round(dollars / 1000)}k`;
  const m = dollars / 1_000_000;
  return `$${m >= 10 ? m.toFixed(0) : m.toFixed(1)}M`;
}

export interface FormattedValue {
  text: string;
  kind: ValueKind;
  ariaLabel: string;
}

export function formatValue(input: {
  cents: number;
  kind: ValueKind;
  cadence?: Cadence;
}): FormattedValue {
  const { kind, cadence } = input;
  const abs = Math.abs(input.cents);

  if (kind === 'info') {
    return { text: 'Info', kind, ariaLabel: 'Informational, no dollar impact' };
  }

  const money = formatMoney(abs);

  if (kind === 'at_risk') {
    return {
      text: `Protect ${money}`,
      kind,
      ariaLabel: `Protects ${money} at risk`,
    };
  }

  const sign = kind === 'gain' ? '+' : '−';
  const suffix = cadence ? ` ${CADENCE_SUFFIX[cadence]}` : '';
  return {
    text: `${sign} ${money}${suffix}`,
    kind,
    ariaLabel: `${kind === 'gain' ? 'Gain' : 'Cost'} ${money}${suffix}`,
  };
}

export function valueMagnitude(kind: ValueKind, cents: number): number {
  if (kind === 'info') return 0;
  return Math.abs(cents);
}
