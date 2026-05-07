"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import {
  createIndexedDbPersister,
  QUERY_CACHE_STORAGE_KEY,
} from "@/lib/query/indexeddb-persister";

const subscribe = () => {
  return () => {};
};

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const isMounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60_000,
          gcTime: 1000 * 60 * 60 * 24,
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    });

    client.setQueryDefaults(["markets"], {
      staleTime: 60_000,
    });
    client.setQueryDefaults(["candles"], {
      // Candle history can grow large, so persisted cached candle data belongs
      // in IndexedDB rather than localStorage.
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24,
      refetchOnWindowFocus: false,
    });

    return client;
  });
  const persister = useMemo(() => {
    return isMounted ? createIndexedDbPersister() : null;
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    // localStorage was insufficient for scalable historical market data.
    // Remove the old key once after moving persisted React Query cache to IndexedDB.
    window.localStorage.removeItem(QUERY_CACHE_STORAGE_KEY);
  }, [isMounted]);

  if (!isMounted || !persister) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24,
        buster: "v1",
      }}
    >
      {children}

      {process.env.NODE_ENV === "development" ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </PersistQueryClientProvider>
  );
}
