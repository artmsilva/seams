/**
 * Converts a kebab-case string to camelCase.
 * If the string already contains uppercase letters, returns as-is.
 */
export const toCamelCase = (value: string): string =>
  !/[A-Z]/.test(value) ? value.replace(/-[^]/g, (capital) => capital[1]!.toUpperCase()) : value;
