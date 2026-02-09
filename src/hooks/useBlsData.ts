'use client';

import { useState, useCallback } from 'react';
import { BlsDataPoint } from '@/lib/types';
import { fetchBlsData } from '@/lib/bls';

interface UseBlsDataReturn {
  data: Record<string, BlsDataPoint[]>;
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
  refresh: (seriesIds: string[]) => Promise<void>;
}

export function useBlsData(): UseBlsDataReturn {
  const [data, setData] = useState<Record<string, BlsDataPoint[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const refresh = useCallback(async (seriesIds: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchBlsData(seriesIds);
      setData(result);
      setLastFetched(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch BLS data');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, lastFetched, refresh };
}
