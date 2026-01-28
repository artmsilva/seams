---
name: create-theme
description: This skill should be used when the user asks to "create a theme", "set up theme tokens", "configure design tokens", "add colors/spacing/typography", "build a theme config", or wants help structuring a Stitches RSC theme configuration.
---

# Create Stitches RSC Theme

Guide creation of properly structured and typed theme configurations for Stitches RSC.

## Theme Structure Overview

A Stitches theme consists of design tokens organized by scale:

```typescript
import { createStitches } from '@stitches-rsc/react';

const { styled, css, theme, createTheme } = createStitches({
  theme: {
    colors: { /* color tokens */ },
    space: { /* spacing tokens */ },
    fontSizes: { /* typography scale */ },
    fonts: { /* font families */ },
    fontWeights: { /* font weights */ },
    lineHeights: { /* line heights */ },
    letterSpacings: { /* letter spacing */ },
    sizes: { /* width/height tokens */ },
    borderWidths: { /* border widths */ },
    borderStyles: { /* border styles */ },
    radii: { /* border radius */ },
    shadows: { /* box shadows */ },
    zIndices: { /* z-index scale */ },
    transitions: { /* transition values */ },
  },
});
```

## Creating a Theme Step-by-Step

### Step 1: Define Color Palette

Start with semantic color tokens:

```typescript
const theme = {
  colors: {
    // Brand colors
    primary: '#0070f3',
    primaryLight: '#3291ff',
    primaryDark: '#0051a8',

    // Semantic colors
    success: '#0070f3',
    warning: '#f5a623',
    error: '#e00',
    info: '#0070f3',

    // Neutrals
    background: '#ffffff',
    foreground: '#000000',
    border: '#eaeaea',

    // Text
    text: '#171717',
    textMuted: '#666666',
    textInverse: '#ffffff',

    // Interactive states
    hover: 'rgba(0, 0, 0, 0.05)',
    active: 'rgba(0, 0, 0, 0.1)',
    focus: 'rgba(0, 112, 243, 0.4)',
  },
};
```

### Step 2: Define Spacing Scale

Use a consistent spacing scale (4px base recommended):

```typescript
const theme = {
  space: {
    0: '0',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    9: '36px',
    10: '40px',
    12: '48px',
    14: '56px',
    16: '64px',
    20: '80px',
    24: '96px',
    // Semantic aliases
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
};
```

### Step 3: Define Typography

```typescript
const theme = {
  fonts: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    serif: 'Georgia, "Times New Roman", serif',
    mono: 'Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },

  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },

  fontWeights: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  lineHeights: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  letterSpacings: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};
```

### Step 4: Define Visual Properties

```typescript
const theme = {
  radii: {
    none: '0',
    sm: '2px',
    base: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    full: '9999px',
  },

  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },

  borderWidths: {
    0: '0',
    1: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
  },

  zIndices: {
    hide: '-1',
    auto: 'auto',
    base: '0',
    docked: '10',
    dropdown: '1000',
    sticky: '1100',
    banner: '1200',
    overlay: '1300',
    modal: '1400',
    popover: '1500',
    toast: '1700',
    tooltip: '1800',
  },

  transitions: {
    none: 'none',
    fast: '150ms ease',
    base: '200ms ease',
    slow: '300ms ease',
    slower: '400ms ease',
  },
};
```

## Using Theme Tokens

Reference tokens with `$scale$token` syntax:

```typescript
const Button = styled('button', {
  backgroundColor: '$colors$primary',
  padding: '$space$2 $space$4',
  fontSize: '$fontSizes$base',
  fontFamily: '$fonts$sans',
  borderRadius: '$radii$md',
  boxShadow: '$shadows$sm',
  transition: 'all $transitions$fast',

  '&:hover': {
    backgroundColor: '$colors$primaryDark',
  },
});
```

Shorthand for same-name scale (using themeMap):

```typescript
const Button = styled('button', {
  // These are equivalent due to defaultThemeMap
  color: '$primary',           // maps to colors.primary
  padding: '$2',               // maps to space.2
  fontSize: '$base',           // maps to fontSizes.base
});
```

## Creating Theme Variants

Create alternate themes with `createTheme`:

```typescript
const darkTheme = createTheme('dark', {
  colors: {
    background: '#0a0a0a',
    foreground: '#ffffff',
    text: '#ededed',
    textMuted: '#a1a1a1',
    border: '#333333',
    primary: '#3291ff',
    hover: 'rgba(255, 255, 255, 0.05)',
  },
});

// Apply theme with className
<div className={darkTheme}>
  <App />
</div>
```

## Complete Example

```typescript
// stitches.config.ts
import { createStitches } from '@stitches-rsc/react';

export const {
  styled,
  css,
  globalCss,
  keyframes,
  theme,
  createTheme,
  getCssText,
} = createStitches({
  prefix: 'app',

  theme: {
    colors: {
      primary: '#0070f3',
      primaryLight: '#3291ff',
      primaryDark: '#0051a8',
      secondary: '#7928ca',
      success: '#17c964',
      warning: '#f5a623',
      error: '#f21361',
      background: '#ffffff',
      foreground: '#000000',
      text: '#171717',
      textMuted: '#666666',
      border: '#eaeaea',
    },
    space: {
      1: '4px', 2: '8px', 3: '12px', 4: '16px',
      5: '20px', 6: '24px', 8: '32px', 10: '40px',
    },
    fontSizes: {
      xs: '0.75rem', sm: '0.875rem', base: '1rem',
      lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem',
    },
    fonts: {
      sans: 'Inter, -apple-system, sans-serif',
      mono: 'Menlo, monospace',
    },
    fontWeights: { normal: '400', medium: '500', bold: '700' },
    lineHeights: { tight: '1.25', normal: '1.5', relaxed: '1.75' },
    radii: { sm: '4px', md: '8px', lg: '12px', full: '9999px' },
    shadows: {
      sm: '0 1px 2px rgba(0,0,0,0.05)',
      md: '0 4px 6px rgba(0,0,0,0.1)',
    },
    zIndices: { modal: '1000', tooltip: '1500' },
    transitions: { fast: '150ms ease', base: '200ms ease' },
  },

  media: {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
  },

  utils: {
    mx: (value: string) => ({ marginLeft: value, marginRight: value }),
    my: (value: string) => ({ marginTop: value, marginBottom: value }),
    px: (value: string) => ({ paddingLeft: value, paddingRight: value }),
    py: (value: string) => ({ paddingTop: value, paddingBottom: value }),
    size: (value: string) => ({ width: value, height: value }),
  },
});

export const darkTheme = createTheme('dark', {
  colors: {
    background: '#0a0a0a',
    foreground: '#ffffff',
    text: '#ededed',
    textMuted: '#a1a1a1',
    border: '#333333',
  },
});
```

## Additional Resources

See `references/theme-scales.md` for the complete list of theme scales and their CSS property mappings.
