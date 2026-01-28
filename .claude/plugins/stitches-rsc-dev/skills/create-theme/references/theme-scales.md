# Theme Scales and CSS Property Mappings

## Default Theme Map

The `defaultThemeMap` automatically maps CSS properties to theme scales. When you use a token like `$primary`, it resolves based on which CSS property it's used with.

| CSS Property | Theme Scale |
|--------------|-------------|
| `background`, `backgroundColor` | `colors` |
| `border`, `borderColor`, `borderTopColor`, `borderRightColor`, `borderBottomColor`, `borderLeftColor` | `colors` |
| `color`, `fill`, `stroke`, `caretColor` | `colors` |
| `outlineColor`, `accentColor` | `colors` |
| `boxShadow`, `textShadow` | `shadows` |
| `fontFamily` | `fonts` |
| `fontSize` | `fontSizes` |
| `fontWeight` | `fontWeights` |
| `lineHeight` | `lineHeights` |
| `letterSpacing` | `letterSpacings` |
| `margin`, `marginTop`, `marginRight`, `marginBottom`, `marginLeft` | `space` |
| `padding`, `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft` | `space` |
| `gap`, `rowGap`, `columnGap` | `space` |
| `top`, `right`, `bottom`, `left`, `inset` | `space` |
| `width`, `minWidth`, `maxWidth` | `sizes` |
| `height`, `minHeight`, `maxHeight` | `sizes` |
| `flexBasis` | `sizes` |
| `borderRadius`, `borderTopLeftRadius`, `borderTopRightRadius`, `borderBottomRightRadius`, `borderBottomLeftRadius` | `radii` |
| `borderWidth`, `borderTopWidth`, `borderRightWidth`, `borderBottomWidth`, `borderLeftWidth` | `borderWidths` |
| `borderStyle`, `borderTopStyle`, `borderRightStyle`, `borderBottomStyle`, `borderLeftStyle` | `borderStyles` |
| `zIndex` | `zIndices` |
| `transition`, `transitionDuration` | `transitions` |

## Explicit Scale References

Use explicit scale references with `$scale$token`:

```typescript
{
  // Explicit scale reference
  color: '$colors$primary',
  padding: '$space$4',

  // Shorthand (uses themeMap)
  color: '$primary',      // Resolves via themeMap
  padding: '$4',          // Resolves via themeMap
}
```

## Complete Scale Definitions

### colors
```typescript
colors: {
  // Brand
  primary: string,
  secondary: string,
  accent: string,

  // Semantic
  success: string,
  warning: string,
  error: string,
  info: string,

  // Neutrals
  background: string,
  foreground: string,
  muted: string,
  subtle: string,

  // Text
  text: string,
  textMuted: string,
  textSubtle: string,

  // Borders
  border: string,
  borderHover: string,
  borderFocus: string,

  // States
  hover: string,
  active: string,
  focus: string,
  disabled: string,
}
```

### space
```typescript
space: {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
}
```

### sizes

Same as `space`, plus:
```typescript
sizes: {
  // Container widths
  xs: '20rem',      // 320px
  sm: '24rem',      // 384px
  md: '28rem',      // 448px
  lg: '32rem',      // 512px
  xl: '36rem',      // 576px
  '2xl': '42rem',   // 672px
  '3xl': '48rem',   // 768px
  '4xl': '56rem',   // 896px
  '5xl': '64rem',   // 1024px
  '6xl': '72rem',   // 1152px
  '7xl': '80rem',   // 1280px

  // Fractional
  '1/2': '50%',
  '1/3': '33.333333%',
  '2/3': '66.666667%',
  '1/4': '25%',
  '2/4': '50%',
  '3/4': '75%',

  // Keywords
  full: '100%',
  min: 'min-content',
  max: 'max-content',
  fit: 'fit-content',
}
```

### fontSizes
```typescript
fontSizes: {
  xs: '0.75rem',     // 12px
  sm: '0.875rem',    // 14px
  base: '1rem',      // 16px
  lg: '1.125rem',    // 18px
  xl: '1.25rem',     // 20px
  '2xl': '1.5rem',   // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
  '5xl': '3rem',     // 48px
  '6xl': '3.75rem',  // 60px
  '7xl': '4.5rem',   // 72px
  '8xl': '6rem',     // 96px
  '9xl': '8rem',     // 128px
}
```

### fontWeights
```typescript
fontWeights: {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
}
```

### lineHeights
```typescript
lineHeights: {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
  3: '.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
}
```

### letterSpacings
```typescript
letterSpacings: {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
}
```

### radii
```typescript
radii: {
  none: '0px',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
}
```

### shadows
```typescript
shadows: {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
}
```

### zIndices
```typescript
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
  skipLink: '1600',
  toast: '1700',
  tooltip: '1800',
}
```

### transitions
```typescript
transitions: {
  none: 'none',
  all: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  colors: 'color, background-color, border-color, text-decoration-color, fill, stroke 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  opacity: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  shadow: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  transform: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
}
```

### borderWidths
```typescript
borderWidths: {
  0: '0px',
  1: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
}
```

### borderStyles
```typescript
borderStyles: {
  solid: 'solid',
  dashed: 'dashed',
  dotted: 'dotted',
  double: 'double',
  hidden: 'hidden',
  none: 'none',
}
```
