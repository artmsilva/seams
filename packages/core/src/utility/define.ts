/**
 * Copies all property descriptors from source objects to the target object.
 * Preserves non-enumerable properties.
 */
export const define = <T extends object>(target: T, ...sources: object[]): T => {
  for (const source of sources) {
    for (const key of Object.getOwnPropertyNames(source)) {
      Object.defineProperty(
        target,
        key,
        Object.getOwnPropertyDescriptor(source, key) || Object.create(null),
      );
    }
  }
  return target;
};
