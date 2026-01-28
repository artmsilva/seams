# API Differences: Stitches.js vs Stitches RSC

## Fully Compatible APIs

These APIs work identically:

| API | Status |
|-----|--------|
| `createStitches()` | ✅ Identical |
| `styled()` | ✅ Identical |
| `css()` | ✅ Identical |
| `globalCss()` | ✅ Identical |
| `keyframes()` | ✅ Identical |
| `createTheme()` | ✅ Identical |
| `theme` object | ✅ Identical |
| Variants | ✅ Identical |
| Compound variants | ✅ Identical |
| Default variants | ✅ Identical |
| Responsive variants | ✅ Identical |
| Token references (`$color$primary`) | ✅ Identical |
| Utils | ✅ Identical |
| Media queries | ✅ Identical |
| `as` prop | ✅ Identical |
| Component composition | ✅ Identical |

## Behavioral Differences

### CSS Generation Timing

| Aspect | Stitches.js | Stitches RSC |
|--------|-------------|--------------|
| When CSS generated | Runtime (browser) | Build time |
| CSS injection | Dynamic `<style>` tags | Static CSS file |
| Bundle impact | CSS in JS bundle | CSS extracted |
| RSC compatible | ❌ No | ✅ Yes |

### getCssText()

| Aspect | Stitches.js | Stitches RSC |
|--------|-------------|--------------|
| Purpose | SSR CSS extraction | Debugging/fallback |
| Required for SSR | Yes | No (plugin handles it) |
| Returns | All generated CSS | All generated CSS |

### css prop with Dynamic Values

**Stitches.js:** Generates CSS at runtime for any value
```tsx
<Box css={{ margin: computedValue }} /> // Works, CSS generated in browser
```

**Stitches RSC:** Converts to CSS variable at build time
```tsx
<Box css={{ margin: computedValue }} />
// Generates: .class { margin: var(--stitches-dyn-0); }
// Runtime: style={{ '--stitches-dyn-0': computedValue }}
```

### Functions in Styles

**Stitches.js:** Functions evaluated at runtime
```tsx
// Works in Stitches.js
const Box = styled('div', {
  color: () => getThemeColor(),
});
```

**Stitches RSC:** Functions not supported (can't serialize at build time)
```tsx
// Won't work - use CSS variables instead
const Box = styled('div', {
  color: 'var(--dynamic-color)',
});
```

## New Features in Stitches RSC

### CSS Layers

All styles are organized into CSS `@layer` for predictable cascade:

```css
@layer stitches.themed,    /* Theme variables */
       stitches.global,    /* globalCss() */
       stitches.styled,    /* Base styles */
       stitches.onevar,    /* Variants */
       stitches.resonevar, /* Responsive variants */
       stitches.allvar,    /* Compound variants */
       stitches.inline;    /* css prop */
```

### CSS Scope

Component styles use `@scope` for isolation:

```css
@scope (.c-Button-abc123) {
  :scope { background: var(--colors-primary); }
}
```

With Firefox fallback:
```css
@supports not (selector(:scope)) {
  .c-Button-abc123:where(.c-Button-abc123) {
    background: var(--colors-primary);
  }
}
```

## Type Differences

### VariantProps

Identical usage:
```typescript
import type { VariantProps } from '@stitches-rsc/react';

type ButtonVariants = VariantProps<typeof Button>;
```

### CSS Type

Identical usage:
```typescript
import type { CSS } from '@stitches-rsc/react';

interface Props {
  css?: CSS;
}
```

## Migration Checklist

- [ ] Replace `@stitches/react` with `@stitches-rsc/react`
- [ ] Replace `@stitches/core` with `@stitches-rsc/core`
- [ ] Add appropriate build plugin (Next.js or Vite)
- [ ] Remove `getCssText()` from SSR if using build plugin
- [ ] Replace function values with CSS variables
- [ ] Test all components render correctly
- [ ] Verify CSS layers in output
