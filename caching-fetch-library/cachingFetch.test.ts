import { describe, expect, it } from 'vitest';
import { serializeCache, initializeCache, wipeCache } from './cachingFetch';

describe('serializeCache and initializeCache', () => {
  it('gives back the same data that was put in', () => {
    wipeCache();

    const fakeCache = {
      'https://example.com': { data: 'hello', error: null },
    };

    initializeCache(btoa(JSON.stringify(fakeCache)));

    const restored = JSON.parse(atob(serializeCache()));

    expect(restored).toEqual(fakeCache);
  });
});
