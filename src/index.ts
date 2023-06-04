import type { StoreApi, UseBoundStore } from 'zustand';
import { shallow } from 'zustand/shallow';

/**
 * Creates a hook that allows for shallow access to the provided store by default.
 * This is effectively the same as passing `shallow` to the original store hook every time.
 */
export const createShallowHook = <T>(useDeepStore: UseBoundStore<StoreApi<T>>) => {
  // Function Overloads
  function useStore(): T;
  function useStore<U>(selector: (state: T) => U, equals?: (a: U, b: U) => boolean): U;

  // Actual function
  function useStore<U>(selector?: (state: T) => U, equals?: (a: U, b: U) => boolean) {
    return selector ? useDeepStore(selector, equals ?? shallow) : useDeepStore();
  }
  useStore.getState = useDeepStore.getState;
  useStore.setState = useDeepStore.setState;
  useStore.subscribe = useDeepStore.subscribe;
  useStore.destroy = useDeepStore.destroy;

  return useStore satisfies UseBoundStore<StoreApi<T>>;
};
