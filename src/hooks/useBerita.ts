"use client";

import { useState, useEffect, useCallback } from "react";
import { BeritaItem } from "@/types/berita";
import { fetchBeritaList } from "@/services/beritaService";

export function useBerita() {
  const [data, setData] = useState<BeritaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const items = await fetchBeritaList();
      setData(items);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat berita";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchBeritaList()
      .then((items) => {
        if (isMounted) {
          setData(items);
          setLoading(false);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : "Gagal memuat berita";
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
