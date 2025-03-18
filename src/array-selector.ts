import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import type { ExtractState, PartObjFromArrOfKeys, ReadonlyStoreApi } from '~/types';

/**
 * Extends the UseBoundStoreWithEqualityFn type to include the function overload for an array selector.
 */
type UseBoundStoreWithArraySelector<S extends ReadonlyStoreApi<unknown>> = {
  <U, A extends (keyof ExtractState<S>)[]>(
    selector: A,
    equals?: (
      a: PartObjFromArrOfKeys<ExtractState<S>, A>,
      b: PartObjFromArrOfKeys<ExtractState<S>, A>
    ) => boolean
  ): PartObjFromArrOfKeys<ExtractState<S>, A>;
} & UseBoundStoreWithEqualityFn<S>;

/**
 * This enhances the traditionalstore hook by adding another style of selector: an array of keys from the provided store.
 * It elimnates the need to use multiple hooks or a complex selector function.
 */
export const withArraySelector = <T>(
  storeHook: UseBoundStoreWithEqualityFn<ReadonlyStoreApi<T>>
): UseBoundStoreWithArraySelector<ReadonlyStoreApi<T>> => {
  // Function Overloads
  function storeHookWithArraySelector<U, A extends (keyof ExtractState<ReadonlyStoreApi<T>>)[]>(
    selector: A,
    equals?: (
      a: PartObjFromArrOfKeys<ExtractState<ReadonlyStoreApi<T>>, A>,
      b: PartObjFromArrOfKeys<ExtractState<ReadonlyStoreApi<T>>, A>
    ) => boolean
  ): PartObjFromArrOfKeys<T, A>;
  function storeHookWithArraySelector(): ExtractState<ReadonlyStoreApi<T>>;

  function storeHookWithArraySelector<U>(
    selector: (state: ExtractState<ReadonlyStoreApi<T>>) => U,
    equals?: (a: U, b: U) => boolean
  ): U;

  // Function Implementation
  function storeHookWithArraySelector<U, A extends (keyof ExtractState<ReadonlyStoreApi<T>>)[]>(
    selector?:
      | ((state: ExtractState<ReadonlyStoreApi<T>>) => U)
      | (keyof ExtractState<ReadonlyStoreApi<T>>)[],
    equals?: (a: U, b: U) => boolean
  ) {
    if (!selector) {
      return storeHook();
    }
    if (typeof selector === 'function') {
      return storeHook(selector, equals);
    }
    const selectorFunction = (state: T) => {
      const selection: Partial<ExtractState<ReadonlyStoreApi<T>>> = {};
      selector.forEach((key) => {
        selection[key] = state[key];
      });
      return selection as PartObjFromArrOfKeys<T, A>;
    };
    return storeHook<PartObjFromArrOfKeys<T, A>>(
      selectorFunction,
      equals as (
        a: PartObjFromArrOfKeys<ExtractState<ReadonlyStoreApi<T>>, A>,
        b: PartObjFromArrOfKeys<ExtractState<ReadonlyStoreApi<T>>, A>
      ) => boolean
    );
  }

  storeHookWithArraySelector.getInitialState = storeHook.getInitialState;
  storeHookWithArraySelector.getState = storeHook.getState;
  storeHookWithArraySelector.subscribe = storeHook.subscribe;

  return storeHookWithArraySelector;
};
