// You may edit this file, add new files to support this file,
// and/or add new dependencies to the project as you see fit.
// However, you must not change the surface API presented from this file,
// and you should not need to change any other files in the project to complete the challenge
import { useEffect, useState } from 'react';

type UseCachingFetch = (url: string) => {
  isLoading: boolean;
  data: unknown;
  error: Error | null;
};

type CacheEntry = {
  data: unknown;
  error: Error | null;
};

const cache = new Map<string, CacheEntry>();
const inFlightRequests = new Map<string, Promise<void>>();

const fetchAndCache = (url: string): Promise<void> => {
  const existingRequest = inFlightRequests.get(url);

  if (existingRequest) {
    return existingRequest;
  }

  const request = fetch(url)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      cache.set(url, {
        data,
        error: null,
      });
    })
    .catch((error: unknown) => {
      cache.set(url, {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
      });
    })
    .finally(() => {
      inFlightRequests.delete(url);
    });

  inFlightRequests.set(url, request);

  return request;
};

/**
 * 1. Implement a caching fetch hook. The hook should return an object with the following properties:
 * - isLoading: a boolean that is true when the fetch is in progress and false otherwise
 * - data: the data returned from the fetch, or null if the fetch has not completed
 * - error: an error object if the fetch fails, or null if the fetch is successful
 *
 * This hook is called three times on the client:
 *  - 1 in App.tsx
 *  - 2 in Person.tsx
 *  - 3 in Name.tsx
 *
 * Acceptance Criteria:
 * 1. The application at /appWithoutSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should only see 1 network request in the browser's network tab when visiting the /appWithoutSSRData route.
 * 3. You have not changed any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */
export const useCachingFetch: UseCachingFetch = (url) => {
  const cachedEntry = cache.get(url);

  const [entry, setEntry] = useState<CacheEntry | null>(cachedEntry ?? null);

  const [isLoading, setIsLoading] = useState(!cachedEntry);

  useEffect(() => {
    let isCancelled = false;

    const loadData = async (): Promise<void> => {
      const currentCachedEntry = cache.get(url);

      if (currentCachedEntry) {
        setEntry(currentCachedEntry);
        setIsLoading(false);
        return;
      }

      setEntry(null);
      setIsLoading(true);

      await fetchAndCache(url);

      if (!isCancelled) {
        setEntry(cache.get(url) ?? null);
        setIsLoading(false);
      }
    };

    void loadData();

    return () => {
      isCancelled = true;
    };
  }, [url]);

  if (isLoading) {
    return {
      data: null,
      isLoading: true,
      error: null,
    };
  }

  return {
    data: entry?.data ?? null,
    isLoading: false,
    error: entry?.error ?? null,
  };
};

/**
 * 2. Implement a preloading caching fetch function. The function should fetch the data.
 *
 * This function will be called once on the server before any rendering occurs.
 *
 * Any subsequent call to useCachingFetch should result in the returned data being available immediately.
 * Meaning that the page should be completely serverside rendered on /appWithSSRData
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript disabled, you should see a list of people.
 * 2. You have not changed any code outside of this file to achieve this.
 * 3. This file passes a type-check.
 *
 */
export const preloadCachingFetch = async (url: string): Promise<void> => {
  if (cache.has(url)) {
    return;
  }

  await fetchAndCache(url);
};

/**
 * 3.1 Implement a serializeCache function that serializes the cache to a string.
 * 3.2 Implement an initializeCache function that initializes the cache from a serialized cache string.
 *
 * Together, these two functions will help the framework transfer your cache to the browser.
 *
 * The framework will call `serializeCache` on the server to serialize the cache to a string and inject it into the dom.
 * The framework will then call `initializeCache` on the browser with the serialized cache string to initialize the cache.
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should not see any network calls to the people API when visiting the /appWithSSRData route.
 * 3. You have not changed any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */
export const serializeCache = (): string => {
  const plainObject = Object.fromEntries(cache);
  const json = JSON.stringify(plainObject);

  return btoa(unescape(encodeURIComponent(json)));
};

export const initializeCache = (serializedCache: string): void => {
  const json = decodeURIComponent(escape(atob(serializedCache)));

  const plainObject = JSON.parse(json) as Record<string, CacheEntry>;

  Object.entries(plainObject).forEach(([url, entry]) => {
    cache.set(url, entry);
  });
};

export const wipeCache = (): void => {
  cache.clear();
  inFlightRequests.clear();
};
