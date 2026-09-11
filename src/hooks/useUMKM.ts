"use client";

import { useState, useEffect, useCallback } from "react";
import { UMKMItem } from "@/types/umkm";
import { fetchUMKMList } from "@/services/umkmService";

export function useUMKM() {
  const [data, setData] = useState<UMKMItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const items = await fetchUMKMList();
      setData(items);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat data UMKM";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchUMKMList()
      .then((items) => {
        if (isMounted) {
          setData(items);
          setLoading(false);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : "Gagal memuat data UMKM";
          setError(msg);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error, reload: loadData };
}
