/**
 * Returns a value with a trailing dash if non-empty.
 * Used for prefix formatting.
 */
export const toTailDashed = (value: string): string => (value ? value + "-" : "");
