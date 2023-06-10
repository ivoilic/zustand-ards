import type { StoreApi, UseBoundStore } from 'zustand';
import { withArraySelector } from './array-selector';
import { withDefaultShallow } from './default-shallow';

export * from './types';
export * from './array-selector';
export * from './default-shallow';

/**
 * This enchances the store hook so access to the provided store is shallow by default.
 * It also adds another style of selector: an array of keys from the provided store.
 */
export const withZustandards = <T>(storeHook: UseBoundStore<StoreApi<T>>) =>
  withArraySelector(withDefaultShallow(storeHook));
