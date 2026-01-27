import { describe, it, expect, beforeEach } from 'vitest';

import { createStitches } from './createStitches.js';

describe('createStitches', () => {
  it('creates a Stitches instance', () => {
    const stitches = createStitches();

    expect(stitches).toBeDefined();
    expect(stitches.css).toBeTypeOf('function');
    expect(stitches.globalCss).toBeTypeOf('function');
    expect(stitches.keyframes).toBeTypeOf('function');
    expect(stitches.createTheme).toBeTypeOf('function');
    expect(stitches.getCssText).toBeTypeOf('function');
    expect(stitches.reset).toBeTypeOf('function');
  });

  it('accepts configuration', () => {
    const stitches = createStitches({
      prefix: 'my-app',
      theme: {
        colors: {
          primary: '#0070f3',
        },
      },
      media: {
        sm: '(min-width: 640px)',
      },
    });

    expect(stitches.prefix).toBe('my-app');
    expect(stitches.config.prefix).toBe('my-app');
    expect(stitches.config.media.sm).toBe('(min-width: 640px)');
  });

  describe('css()', () => {
    let stitches: ReturnType<typeof createStitches>;

    beforeEach(() => {
      stitches = createStitches({
        theme: {
          colors: {
            primary: '#0070f3',
          },
          space: {
            1: '4px',
            2: '8px',
          },
        },
      });
    });

    it('creates a CSS component', () => {
      const button = stitches.css({
        backgroundColor: 'red',
        padding: '10px',
      });

      expect(button).toBeTypeOf('function');
      expect(button.className).toBeTruthy();
      expect(button.selector).toBeTruthy();
    });

    it('renders class names', () => {
      const button = stitches.css({
        backgroundColor: 'red',
      });

      const result = button();

      expect(result.className).toBeTruthy();
      expect(result.className).toContain(button.className);
    });

    it('supports variants', () => {
      const button = stitches.css({
        backgroundColor: 'gray',
        variants: {
          color: {
            primary: { backgroundColor: 'blue' },
            secondary: { backgroundColor: 'green' },
          },
          size: {
            sm: { padding: '4px' },
            lg: { padding: '16px' },
          },
        },
      });

      const result = button({ color: 'primary', size: 'lg' });

      expect(result.className).toBeTruthy();
    });

    it('supports default variants', () => {
      const button = stitches.css({
        variants: {
          size: {
            sm: { padding: '4px' },
            lg: { padding: '16px' },
          },
        },
        defaultVariants: {
          size: 'sm',
        },
      });

      const result = button();

      expect(result.className).toBeTruthy();
    });

    it('supports compound variants', () => {
      const button = stitches.css({
        variants: {
          color: {
            primary: {},
            secondary: {},
          },
          outlined: {
            true: {},
            false: {},
          },
        },
        compoundVariants: [
          {
            color: 'primary',
            outlined: 'true',
            css: { border: '1px solid blue' },
          },
        ],
      });

      const result = button({ color: 'primary', outlined: 'true' });

      expect(result.className).toBeTruthy();
    });

    it('supports css prop', () => {
      const button = stitches.css({
        backgroundColor: 'gray',
      });

      const result = button({ css: { color: 'white' } });

      expect(result.className).toBeTruthy();
    });

    it('merges external classNames', () => {
      const button = stitches.css({
        backgroundColor: 'gray',
      });

      const result = button({ className: 'custom-class' });

      expect(result.className).toContain('custom-class');
    });

    it('supports withConfig', () => {
      const button = stitches.css.withConfig({
        displayName: 'Button',
      })({
        backgroundColor: 'blue',
      });

      expect(button.className).toContain('Button');
    });
  });

  describe('globalCss()', () => {
    it('creates global styles', () => {
      const stitches = createStitches();

      const globalStyles = stitches.globalCss({
        '*': {
          margin: 0,
          padding: 0,
        },
        body: {
          fontFamily: 'sans-serif',
        },
      });

      expect(globalStyles).toBeTypeOf('function');
      globalStyles();

      const cssText = stitches.getCssText();
      expect(cssText).toContain('margin:0');
    });
  });

  describe('keyframes()', () => {
    it('creates keyframe animations', () => {
      const stitches = createStitches();

      const fadeIn = stitches.keyframes({
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
      });

      expect(fadeIn).toBeTypeOf('function');
      expect(fadeIn.name).toBeTruthy();

      const cssText = stitches.getCssText();
      expect(cssText).toContain('@keyframes');
      expect(cssText).toContain('opacity:0');
      expect(cssText).toContain('opacity:1');
    });
  });

  describe('createTheme()', () => {
    it('creates a theme', () => {
      const stitches = createStitches({
        theme: {
          colors: {
            primary: '#0070f3',
          },
        },
      });

      const darkTheme = stitches.createTheme({
        colors: {
          primary: '#79b8ff',
        },
      });

      expect(darkTheme.className).toBeTruthy();
      expect(darkTheme.selector).toBeTruthy();
      expect(darkTheme.colors.primary).toBeDefined();
    });

    it('creates a named theme', () => {
      const stitches = createStitches({
        theme: {
          colors: {
            primary: '#0070f3',
          },
        },
      });

      const darkTheme = stitches.createTheme('dark', {
        colors: {
          primary: '#79b8ff',
        },
      });

      expect(darkTheme.className).toBe('dark');
    });
  });

  describe('getCssText()', () => {
    it('returns generated CSS', () => {
      const stitches = createStitches({
        theme: {
          colors: {
            primary: '#0070f3',
          },
        },
      });

      stitches.css({ backgroundColor: '$primary' })();

      const cssText = stitches.getCssText();

      expect(cssText).toBeTruthy();
      expect(cssText).toContain('background-color');
    });
  });

  describe('reset()', () => {
    it('resets the stylesheet', () => {
      const stitches = createStitches();

      stitches.css({ backgroundColor: 'red' })();
      const beforeReset = stitches.getCssText();

      stitches.reset();
      const afterReset = stitches.getCssText();

      expect(beforeReset).not.toBe(afterReset);
    });
  });
});
