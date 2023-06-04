/**
 * Copied from the zustand file 'react.d.ts' on line 2
 */
export type ExtractState<S> = S extends {
  getState: () => infer T;
}
  ? T
  : never;

/**
 * Types a partial object based on the type of the original and the type of an array of keys.
 */
export type PartObjFromArrOfKeys<Obj, KeyArray extends readonly (keyof Obj)[]> = {
  [Key in KeyArray[number]]: Obj[Key];
};
