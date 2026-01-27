import { toTailDashed } from './convert/toTailDashed.js';

/**
 * Represents a theme token with its value, scale, and variable name.
 * Used to reference design tokens in CSS values.
 */
export class ThemeToken {
  readonly token: string;
  readonly value: string;
  readonly scale: string;
  readonly prefix: string;

  constructor(
    token: string | null | undefined,
    value: string | null | undefined,
    scale: string | null | undefined,
    prefix: string | null | undefined,
  ) {
    this.token = token == null ? '' : String(token);
    this.value = value == null ? '' : String(value);
    this.scale = scale == null ? '' : String(scale);
    this.prefix = prefix == null ? '' : String(prefix);
  }

  /**
   * Returns the computed CSS value using var() function.
   */
  get computedValue(): string {
    return 'var(' + this.variable + ')';
  }

  /**
   * Returns the CSS custom property name.
   */
  get variable(): string {
    return '--' + toTailDashed(this.prefix) + toTailDashed(this.scale) + this.token;
  }

  toString(): string {
    return this.computedValue;
  }
}
