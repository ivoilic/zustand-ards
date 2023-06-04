# zustand-ards

A library of simple opinionated utilities for [zustand](https://github.com/pmndrs/zustand). zustand-ards are typesafe and designed to be easily added to an existing codebase to improve the experience of developing with zustand.

[![Build Status](https://img.shields.io/github/actions/workflow/status/ivoilic/zustand-ards/main.yml?branch=main&style=flat&colorA=000000&colorB=000000)](https://github.com/ivoilic/zustand-ards/actions?query=workflow%3ACI)
[![Build Size](https://img.shields.io/bundlephobia/minzip/zustand-ards?label=bundle%20size&style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/result?p=zustand-ards)
[![Version](https://img.shields.io/npm/v/zustand-ards?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/zustand-ards)
[![Downloads](https://img.shields.io/npm/dt/zustand-ards.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/zustand-ards)

## 🪝 Hook Enhancements

<details>
<summary><i>Expand this for the example store refrenced in the documentation.</i></summary>

```ts
import { create } from 'zustand';

interface ExampleStoreState {
  bears: number;
  wizards: number;
  increaseBears: (by: number) => void;
  increaseWizards: (by: number) => void;
}

const useExampleStore = create<ExampleStoreState>()((set) => ({
  bears: 0,
  wizards: 0,
  increaseBears: (by) => set((state) => ({ bears: state.bears + by })),
  increaseWizards: (by) => set((state) => ({ wizards: state.wizards + by })),
}));
```

</details>

### 📝 `withArraySelector`

This enhances the hook by adding a new style of selector: an array of keys from the provided store. It elimnates the need to use multiple hooks or a complex selector function.

```ts
import { withArraySelector } from 'zustand-ards';

const useStoreWithArray = withArraySelector(useExampleStore);

const { bears, increaseBears } = useStoreWithArray(['bears', 'increaseBears']);
```

The array selector is automatically typed so your IDE should provide hints with all the possible keys.

The original selector functionality still works so you can use the hook with either style of selector.

### 🏊 `withDefaultShallow`

This enhances the hook so access to the provided store is shallow by default. It is effectively the same as passing `shallow` from `zustand/shallow` to the original hook every time.

```ts
import { withDefaultShallow } from 'zustand-ards';

const useShallowStore = withDefaultShallow(useExampleStore);

const { wizards } = useShallowStore((state) => ({ wizards: state.wizards }));
```

In the example the changes to the state of `bears` will have no impact since the hook is only being used to access the state of `wizards`.

You can always override the shallow option by passing in a custom equality function like so:

```ts
const { wizards } = useShallowStore(
  (state) => ({ wizards: state.wizards }),
  (a, b) => a === b
);
```

## 🔗 Combining the Hook Enhancements

If you want to use multiple zustand-ards hook enhancements together you totally can!

```ts
import { withDefaultShallow, withArraySelector } from 'zustand-ards';

// Make the the hook shallow by default
const useShallowStore = withDefaultShallow(useExampleStore);

// Add the optional array selector to the hook
const useYourCustomStore = withArraySelector(useShallowStore);

// Use your custom hook!
const { bears, increaseBears } = useYourCustomStore(['bears', 'increaseBears']);
```

⚠️ Warning: _Currently `enchanceHookWithArraySelector` has to be used last as it adds a new selector._

## Contributing

Feel free to submit PRs or Issues if you find any bugs or have ideas for new zustand-ards. Please keep in mind the goal of this project is to create simple standalone enhancements for zustand that improve the developer experience.

## Legal

Copyright © [Ivo Ilić](https://github.com/ivoilic) 2023

zustand-ards is [MIT licensed](https://github.com/ivoilic/zustand-ards/blob/main/LICENSE).

zustand-ards is in no way officially associated with or endorsed by Poimandres or zustand.
