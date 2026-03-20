/**
 * Converts a numeric code to an alphabetic character.
 * Codes 0-25 map to 'a'-'z', codes > 25 map to 'A'-'Z' etc.
 */
const toAlphabeticChar = (code: number): string =>
  String.fromCharCode(code + (code > 25 ? 39 : 97));

/**
 * Converts a number to an alphabetic name using base-52 encoding.
 * Results in compact strings like "PJLV", "abc", etc.
 */
const toAlphabeticName = (code: number): string => {
  let name = "";
  let x: number;

  for (x = Math.abs(code); x > 52; x = (x / 52) | 0) {
    name = toAlphabeticChar(x % 52) + name;
  }

  return toAlphabeticChar(x % 52) + name;
};

/**
 * DJB2-like hash function (FNV variant).
 * Processes string in reverse order.
 */
const toPhash = (h: number, x: string): number => {
  let i = x.length;
  while (i) h = (h * 33) ^ x.charCodeAt(--i);
  return h;
};

/**
 * Generates a deterministic, short alphanumeric hash from a value.
 * Used for generating unique class names.
 */
export const toHash = (value: unknown): string =>
  toAlphabeticName(toPhash(5381, JSON.stringify(value)) >>> 0);
