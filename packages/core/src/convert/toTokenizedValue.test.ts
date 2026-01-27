import { describe, it, expect } from 'vitest';

import { toTokenizedValue } from './toTokenizedValue.js';

describe('toTokenizedValue', () => {
  it('transforms $token to var()', () => {
    const result = toTokenizedValue('$primary', 'app', 'colors');

    expect(result).toBe('var(--app-colors-primary)');
  });

  it('handles tokens without prefix', () => {
    const result = toTokenizedValue('$primary', '', 'colors');

    expect(result).toBe('var(--colors-primary)');
  });

  it('handles tokens without scale', () => {
    const result = toTokenizedValue('$primary', 'app', '');

    expect(result).toBe('var(--app-primary)');
  });

  it('handles nested tokens with $', () => {
    const result = toTokenizedValue('$colors$primary', 'app', '');

    expect(result).toBe('var(--app-colors-primary)');
  });

  it('passes through CSS custom properties unchanged', () => {
    // CSS custom properties (--xxx) without $ token syntax are passed through as-is
    // since they're raw CSS values, not Stitches tokens
    const result = toTokenizedValue('--my-color', '', '');

    expect(result).toBe('--my-color');
  });

  it('handles multiplied tokens', () => {
    const result = toTokenizedValue('2$space', 'app', 'space');

    // When there's a multiplier with $, it should pass through
    expect(result).toBe('2$space');
  });

  it('handles negative tokens', () => {
    const result = toTokenizedValue('-$space', 'app', 'space');

    expect(result).toBe('calc(var(--app-space-space)*-1)');
  });

  it('handles values without tokens', () => {
    const result = toTokenizedValue('10px', 'app', 'space');

    expect(result).toBe('10px');
  });

  it('handles multiple tokens in a value', () => {
    const result = toTokenizedValue('$sm $md', 'app', 'space');

    expect(result).toBe('var(--app-space-sm) var(--app-space-md)');
  });
});
