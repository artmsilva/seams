const { hasOwnProperty } = Object.prototype;

/**
 * Checks if an object has a specific own property.
 */
export const hasOwn = (target: object, key: string): boolean =>
  hasOwnProperty.call(target, key);
