import { shallow } from 'zustand/shallow';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { ExtractState } from '~/types';

/**
 * This enhances the store hook so access to the provided store is shallow by default.
 * It is effectively the same as passing `shallow` from `zustand/shallow` to the original hook every time
 */
export const withDefaultShallow = <T>(
  storeHook: UseBoundStore<StoreApi<T>>
): UseBoundStore<StoreApi<T>> => {
  // Function overloads
  function shallowStoreHook(): ExtractState<StoreApi<T>>;
  function shallowStoreHook<U>(
    selector: (state: ExtractState<StoreApi<T>>) => U,
    equals?: (a: U, b: U) => boolean
  ): U;

  // Function Implementation
  function shallowStoreHook<U>(
    selector?: (state: ExtractState<StoreApi<T>>) => U,
    equals?: (a: U, b: U) => boolean
  ) {
    return selector ? storeHook(selector, equals ?? shallow) : storeHook();
  }
  shallowStoreHook.getState = storeHook.getState;
  shallowStoreHook.setState = storeHook.setState;
  shallowStoreHook.subscribe = storeHook.subscribe;
  shallowStoreHook.destroy = storeHook.destroy;

  return shallowStoreHook;
};
