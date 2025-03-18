import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import { withArraySelector } from './array-selector';
import { withDefaultShallow } from './default-shallow';
import { ReadonlyStoreApi } from './types';

export * from './types';
export * from './array-selector';
export * from './default-shallow';

/**
 * This enchances the traditional store hook so access to the provided store is shallow by default.
 * It also adds another style of selector: an array of keys from the provided store.
 */
export const withZustandards = <T>(storeHook: UseBoundStoreWithEqualityFn<ReadonlyStoreApi<T>>) =>
  withArraySelector(withDefaultShallow(storeHook));
