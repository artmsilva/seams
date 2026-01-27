/**
 * Custom replacer for JSON.stringify that handles functions.
 */
const stringifyReplacer = (_name: string, data: unknown): unknown =>
  typeof data === 'function' ? { '()': Function.prototype.toString.call(data) } : data;

/**
 * Stringifies a value for use as a cache key.
 */
const stringify = (value: unknown): string => JSON.stringify(value, stringifyReplacer);

/**
 * Creates a memoization function that caches results by stringified input.
 * Used for configuration-based instance caching.
 */
export const createMemo = <T, Args extends unknown[], V = unknown>(): (<Input extends V>(
  value: Input,
  apply: (value: Input, ...args: Args) => T,
  ...args: Args
) => T) => {
  const cache = Object.create(null) as Record<string, T>;

  return <Input extends V>(value: Input, apply: (value: Input, ...args: Args) => T, ...args: Args) => {
    const vjson = stringify(value);

    return vjson in cache ? cache[vjson]! : (cache[vjson] = apply(value, ...args));
  };
};
