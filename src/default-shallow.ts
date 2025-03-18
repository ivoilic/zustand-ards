import { shallow } from 'zustand/shallow';
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import type { ExtractState, ReadonlyStoreApi } from '~/types';

/**
 * This enhances the traditional store hook so access to the provided store is shallow by default.
 * It is effectively the same as passing `shallow` from `zustand/shallow` to the original hook every time
 */
export const withDefaultShallow = <T>(
  storeHook: UseBoundStoreWithEqualityFn<ReadonlyStoreApi<T>>
): UseBoundStoreWithEqualityFn<ReadonlyStoreApi<T>> => {
  // Function overloads
  function shallowStoreHook(): ExtractState<ReadonlyStoreApi<T>>;
  function shallowStoreHook<U>(
    selector: (state: ExtractState<ReadonlyStoreApi<T>>) => U,
    equals?: (a: U, b: U) => boolean
  ): U;

  // Function Implementation
  function shallowStoreHook<U>(
    selector?: (state: ExtractState<ReadonlyStoreApi<T>>) => U,
    equals?: (a: U, b: U) => boolean
  ) {
    return selector ? storeHook(selector, equals ?? shallow) : storeHook();
  }
  shallowStoreHook.getInitialState = storeHook.getInitialState;
  shallowStoreHook.getState = storeHook.getState;
  shallowStoreHook.subscribe = storeHook.subscribe;

  return shallowStoreHook;
};
