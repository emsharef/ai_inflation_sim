import { BlsDataPoint } from './types';

const BLS_API_URL = '/api/bls';

/**
 * Fetch BLS data for given series IDs through our proxy
 */
export async function fetchBlsData(
  seriesIds: string[],
  startYear = 2020,
  endYear = 2024
): Promise<Record<string, BlsDataPoint[]>> {
  const results: Record<string, BlsDataPoint[]> = {};

  // BLS API allows 25 series per request
  const batchSize = 25;
  for (let i = 0; i < seriesIds.length; i += batchSize) {
    const batch = seriesIds.slice(i, i + batchSize);

    try {
      const response = await fetch(BLS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seriesid: batch,
          startyear: String(startYear),
          endyear: String(endYear),
        }),
      });

      if (!response.ok) {
        console.warn(`BLS API batch ${i / batchSize + 1} failed:`, response.status);
        continue;
      }

      const data = await response.json();

      if (data.Results?.series) {
        for (const series of data.Results.series) {
          results[series.seriesID] = (series.data || []).map(
            (d: { year: string; period: string; value: string }) => ({
              year: parseInt(d.year),
              period: d.period,
              value: parseFloat(d.value),
              seriesId: series.seriesID,
            })
          );
        }
      }
    } catch (error) {
      console.warn(`BLS API batch ${i / batchSize + 1} error:`, error);
    }
  }

  return results;
}

/**
 * Calculate 12-month percent change from BLS index data
 */
export function calculateInflationRate(data: BlsDataPoint[]): number | null {
  if (data.length < 13) return null;

  // Sort by year and period descending
  const sorted = [...data].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.period.localeCompare(a.period);
  });

  const current = sorted[0];
  const yearAgo = sorted.find(
    d => d.year === current.year - 1 && d.period === current.period
  );

  if (!yearAgo) return null;

  return ((current.value - yearAgo.value) / yearAgo.value) * 100;
}
