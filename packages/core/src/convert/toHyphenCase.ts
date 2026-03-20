/**
 * Converts a camelCase string to kebab-case.
 * If the string already contains dashes, returns as-is.
 */
export const toHyphenCase = (value: string): string =>
  value.includes("-") ? value : value.replace(/[A-Z]/g, (capital) => "-" + capital.toLowerCase());
