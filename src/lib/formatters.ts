/**
 * Format a number as a percentage with specified decimal places
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value >= 0 ? '' : ''}${value.toFixed(decimals)}%`;
}

/**
 * Format a percentage point change with sign
 */
export function formatPp(value: number, decimals = 2): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}pp`;
}

/**
 * Format a number with sign prefix
 */
export function formatSigned(value: number, decimals = 2): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}`;
}

/**
 * Format a weight as percentage
 */
export function formatWeight(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Get color class for inflation impact (green = deflationary, red = inflationary)
 */
export function getImpactColor(value: number): string {
  if (value < -0.1) return 'text-emerald-400';
  if (value < -0.01) return 'text-emerald-300';
  if (value > 0.1) return 'text-red-400';
  if (value > 0.01) return 'text-red-300';
  return 'text-zinc-400';
}

/**
 * Get background color class for heatmap cells
 */
export function getHeatmapBg(value: number): string {
  if (value <= -0.5) return 'bg-emerald-700/80';
  if (value <= -0.2) return 'bg-emerald-600/60';
  if (value <= -0.1) return 'bg-emerald-500/40';
  if (value <= -0.03) return 'bg-emerald-400/25';
  if (value < 0.03) return 'bg-zinc-700/40';
  if (value < 0.1) return 'bg-red-400/25';
  return 'bg-red-500/40';
}

/**
 * Get text color for heatmap cells
 */
export function getHeatmapText(value: number): string {
  if (value <= -0.2) return 'text-emerald-200';
  if (value <= -0.05) return 'text-emerald-300';
  if (value < 0.05) return 'text-zinc-300';
  return 'text-red-300';
}

/**
 * Format confidence level with color
 */
export function getConfidenceColor(confidence: string): string {
  switch (confidence) {
    case 'high': return 'text-emerald-400';
    case 'medium': return 'text-amber-400';
    case 'low': return 'text-red-400';
    default: return 'text-zinc-400';
  }
}

/**
 * Format a number for display in monospace (fixed width)
 */
export function formatMono(value: number, decimals = 2, width = 8): string {
  const str = value.toFixed(decimals);
  return str.padStart(width);
}

/**
 * Get horizon display label
 */
export function getHorizonLabel(horizon: string): string {
  switch (horizon) {
    case '1yr': return '1 Year';
    case '3yr': return '3 Years';
    case '10yr': return '10 Years';
    default: return horizon;
  }
}

/**
 * Get horizon years as number
 */
export function getHorizonYears(horizon: string): number {
  switch (horizon) {
    case '1yr': return 1;
    case '3yr': return 3;
    case '10yr': return 10;
    default: return 1;
  }
}
