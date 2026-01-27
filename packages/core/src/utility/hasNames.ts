/**
 * Checks if an object has any enumerable properties.
 */
export const hasNames = (target: object): boolean => {
  for (const _ in target) return true;
  return false;
};
