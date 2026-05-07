import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { createStore, del, get, set } from "idb-keyval";

export const QUERY_CACHE_STORAGE_KEY = "polaris-signal-query-cache";

const queryCacheStore = createStore("polaris-signal", "query-cache");

export function createIndexedDbPersister() {
  return createAsyncStoragePersister({
    key: QUERY_CACHE_STORAGE_KEY,
    // IndexedDB is used because candle history can grow beyond localStorage's
    // practical limits for scalable historical market data.
    storage: {
      getItem: (key) => {
        return get<string>(key, queryCacheStore);
      },
      setItem: (key, value) => {
        return set(key, value, queryCacheStore);
      },
      removeItem: (key) => {
        return del(key, queryCacheStore);
      },
    },
  });
}
