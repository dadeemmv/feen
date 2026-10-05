/**
 * Compact Italian integer formatting for chips/badges (hand-rolled so Hermes/web/Node agree):
 * 1500 → '1.500', 125000 → '125k', 2300000 → '2,3M'.
 */
export function formatCount(value: number): string {
  if (!Number.isFinite(value)) return '–';
  const n = Math.round(value);
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}${trim(abs / 1_000_000)}M`;
  if (abs >= 100_000) return `${sign}${Math.floor(abs / 1000)}k`;
  return `${sign}${String(abs).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

function trim(value: number): string {
  return value.toFixed(1).replace(/\.0$/, '').replace('.', ',');
}
