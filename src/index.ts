import { shallow } from 'zustand/shallow';

import { StoreApi, UseBoundStore } from 'zustand';

/**
 * Creates a hook that allows for shallow access to the provided store.
 * This is effectively the same as passing `shallow` to the original store hook every time.
 */
export const createShallowHook = <T>(useDeepStore: UseBoundStore<StoreApi<T>>) => {
  return <U>(selector: (state: T) => U, equals?: (a: U, b: U) => boolean) =>
    useDeepStore(selector, equals ?? shallow);
};
