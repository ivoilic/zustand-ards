import type { StoreApi, UseBoundStore } from 'zustand';
import { shallow } from 'zustand/shallow';

/**
 * Copied from the zustand file 'react.d.ts' on line 2
 */
type ExtractState<S> = S extends {
  getState: () => infer T;
}
  ? T
  : never;

/**
 * Creates a hook that allows for shallow access to the provided store by default.
 * This is effectively the same as passing `shallow` to the original store hook every time.
 */
export const createShallowHook = <T>(
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

/**
 * Types a partial object based on the type of the original and the type of an array of keys.
 */
export type PartObjFromArrOfKeys<Obj, KeyArray extends readonly (keyof Obj)[]> = {
  [Key in KeyArray[number]]: Obj[Key];
};

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
 * Creates a hook that accepts an array of valid keys from the provided store as a selector.
 * This elimnates the need to use duplicate hooks or a complex selector function.
 */
export const createHookWithArraySelector = <T>(
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
