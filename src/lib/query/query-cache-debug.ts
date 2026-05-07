import { createStore, get } from "idb-keyval";

import { QUERY_CACHE_STORAGE_KEY } from "@/lib/query/indexeddb-persister";

const queryCacheStore = createStore("polaris-signal", "query-cache");

interface PersistedQueryCache {
  clientState?: {
    queries?: Array<{
      queryKey?: unknown;
    }>;
  };
}

export async function debugPersistedQueryCache() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const cachedValue = await get<string>(
    QUERY_CACHE_STORAGE_KEY,
    queryCacheStore,
  );
  const size = cachedValue ? new Blob([cachedValue]).size : 0;
  const parsedCache = cachedValue
    ? (JSON.parse(cachedValue) as PersistedQueryCache)
    : undefined;
  const queryKeys =
    parsedCache?.clientState?.queries?.map((query) => query.queryKey) ?? [];

  console.log("[React Query Cache]", {
    size,
    queryKeys,
  });
}
