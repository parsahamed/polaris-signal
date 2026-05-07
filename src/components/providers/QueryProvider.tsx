"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { useState, useSyncExternalStore } from "react";

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
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60_000,
          gcTime: 1000 * 60 * 60 * 24,
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    });
  });

  if (!isMounted) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  const persister = createSyncStoragePersister({
    storage: window.localStorage,
    key: "polaris-signal-query-cache",
  });

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24,
      }}
    >
      {children}

      {process.env.NODE_ENV === "development" ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </PersistQueryClientProvider>
  );
}
