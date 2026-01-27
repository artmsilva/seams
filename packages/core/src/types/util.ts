/**
 * Utility types for Stitches RSC.
 */

/** Returns a string with the given prefix followed by the given values. */
export type Prefixed<K extends string, T> = `${K}${Extract<T, boolean | number | string>}`;

/** Returns an object from the given object assigned with the values of another given object. */
export type Assign<T1 = object, T2 = object> = Omit<T1, keyof T2> & T2;

/** Returns a widened value from the given value. */
export type Widen<T> = T extends number
  ? `${T}` | T
  : T extends 'true'
    ? boolean | T
    : T extends 'false'
      ? boolean | T
      : T extends `${number}`
        ? number | T
        : T;

/** Narrowed string. */
export type String = string & Record<never, never>;

/** Narrowed number or string. */
export type Index = (number | string) & Record<never, never>;

/** Narrowed function. */
export type Function = (...args: unknown[]) => unknown;

/** Widened object. */
export type WideObject = {
  [name in number | string]: boolean | number | string | undefined | WideObject;
};

/** Remove an index signature from a type. */
export type RemoveIndex<T> = {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K];
};

/** Make all properties optional recursively. */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Extract keys that are strings. */
export type StringKeys<T> = Extract<keyof T, string>;

/** Extract keys that are numbers. */
export type NumberKeys<T> = Extract<keyof T, number>;
