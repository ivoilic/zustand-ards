import type { StoreApi, UseBoundStore } from 'zustand';
import type { ExtractState, PartObjFromArrOfKeys } from '~/types';

/**
 * Extends the UseBoundStore type to include the function overload for an array selector.
 */
type UseBoundStoreWithArraySelector<S extends StoreApi<unknown>> = {
  <U, A extends (keyof ExtractState<S>)[]>(
    selector: A,
    equals?: (
      a: PartObjFromArrOfKeys<ExtractState<S>, A>,
      b: PartObjFromArrOfKeys<ExtractState<S>, A>
    ) => boolean
  ): PartObjFromArrOfKeys<ExtractState<S>, A>;
} & UseBoundStore<S>;

/**
 * This enhances the hook by adding a new style of selector: an array of keys from the provided store.
 * It elimnates the need to use multiple hooks or a complex selector function.
 */
export const withArraySelector = <T>(
  storeHook: UseBoundStore<StoreApi<T>>
): UseBoundStoreWithArraySelector<StoreApi<T>> => {
  // Function Overloads
  function storeHookWithArraySelector<U, A extends (keyof ExtractState<StoreApi<T>>)[]>(
    selector: A,
    equals?: (
      a: PartObjFromArrOfKeys<ExtractState<StoreApi<T>>, A>,
      b: PartObjFromArrOfKeys<ExtractState<StoreApi<T>>, A>
    ) => boolean
  ): PartObjFromArrOfKeys<T, A>;
  function storeHookWithArraySelector(): ExtractState<StoreApi<T>>;

  function storeHookWithArraySelector<U>(
    selector: (state: ExtractState<StoreApi<T>>) => U,
    equals?: (a: U, b: U) => boolean
  ): U;

  // Function Implementation
  function storeHookWithArraySelector<U, A extends (keyof ExtractState<StoreApi<T>>)[]>(
    selector?: ((state: ExtractState<StoreApi<T>>) => U) | (keyof ExtractState<StoreApi<T>>)[],
    equals?: (a: U, b: U) => boolean
  ) {
    if (!selector) {
      return storeHook();
    }
    if (typeof selector === 'function') {
      return storeHook(selector, equals);
    }
    const selectorFunction = (state: T) => {
      const selection: Partial<ExtractState<StoreApi<T>>> = {};
      selector.forEach((key) => {
        selection[key] = state[key];
      });
      return selection as PartObjFromArrOfKeys<T, A>;
    };
    return storeHook<PartObjFromArrOfKeys<T, A>>(
      selectorFunction,
      equals as (
        a: PartObjFromArrOfKeys<ExtractState<StoreApi<T>>, A>,
        b: PartObjFromArrOfKeys<ExtractState<StoreApi<T>>, A>
      ) => boolean
    );
  }
  storeHookWithArraySelector.getState = storeHook.getState;
  storeHookWithArraySelector.setState = storeHook.setState;
  storeHookWithArraySelector.subscribe = storeHook.subscribe;
  storeHookWithArraySelector.destroy = storeHook.destroy;

  return storeHookWithArraySelector;
};
