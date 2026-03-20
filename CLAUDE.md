# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Seams is a zero-runtime CSS-in-JS library for React Server Components, inspired by Stitches.js. It provides 1:1 API compatibility with the original Stitches while using build-time CSS extraction, CSS `@layer` for cascade control, and `@scope` for component isolation.

## Commands

This project uses [Vite+](https://viteplus.dev/) as the unified toolchain. All commands go through `vp`.

```bash
# Build all packages (must be done before testing)
vp run build

# Run tests
vp test                # Watch mode
vp test run            # Single run

# Run a single test file
vp test run packages/core/src/convert/toHash.test.ts

# Format, lint, and type check in one pass
vp check

# Lint only
vp lint

# Format only
vp fmt

# Type check all packages
vp run typecheck

# Install dependencies
vp install

# Clean build artifacts
vp run clean
```

## Architecture

### Package Structure

```
packages/
├── core/              # Isomorphic API (no React dependency)
├── react/             # React bindings (styled function)
├── plugin-common/     # Shared build plugin logic (Babel AST analysis)
├── next-plugin/       # Next.js webpack loader
└── vite-plugin/       # Vite transform plugin
```

### Package Dependencies

```
core <- react
core <- plugin-common <- next-plugin
                      <- vite-plugin
```

### Core Package (`@artmsilva/seams-core`)

The isomorphic core with no React dependency:

- **`createStitches.ts`** - Factory function returning `css`, `globalCss`, `keyframes`, `createTheme`
- **`features/css.ts`** - Main `css()` function with variants/compound variants
- **`convert/`** - CSS conversion utilities:
  - `toHash.ts` - DJB2 hash for deterministic class names
  - `toCssRules.ts` - Style objects to CSS strings
  - `toTokenizedValue.ts` - `$token` -> `var(--prefix-scale-token)` transform
- **`sheet.ts`** - CSS rule collection organized by layer groups
- **`default/defaultThemeMap.ts`** - Maps CSS properties to theme scales

### React Package (`@artmsilva/seams-react`)

Extends core with React-specific `styled()` function:

- Re-exports everything from `@artmsilva/seams-core`
- Adds `styled()` that wraps `css()` with React component creation and `forwardRef`

### Plugin Common (`@artmsilva/seams-plugin-common`)

Build-time CSS extraction pipeline:

1. **`analyzer.ts`** - Babel AST analysis to find Seams imports and usages
2. **`extractor.ts`** - Extracts static CSS from analyzed usages
3. **`transformer.ts`** - Converts dynamic values to CSS variables
4. **`cssGenerator.ts`** - Generates final CSS with `@layer` and `@scope`

Main entry point: `processSource(code, filename, options)` runs the full pipeline.

### Build Plugins

Both plugins use `processSource` from plugin-common:

- **next-plugin**: Webpack loader (`withSeams()` config wrapper)
- **vite-plugin**: Vite transform plugin with virtual CSS module

## Key Patterns

### CSS Layer Order

```css
@layer seams.themed,    /* Theme CSS variables */
       seams.global,    /* globalCss() styles */
       seams.styled,    /* Base component styles */
       seams.onevar,    /* Single variant styles */
       seams.resonevar, /* Responsive variant styles */
       seams.allvar,    /* Compound variant styles */
       seams.inline; /* css prop styles */
```

### Token Transformation

`$colors$primary` -> `var(--prefix-colors-primary)`

### Dynamic CSS Prop

Dynamic values are converted to CSS variables at build time:

```tsx
// Input
<Box css={{ margin: dynamicVal }} />

// Output CSS
.c-Box-inline-xyz { margin: var(--seams-dyn-0); }

// Output JS
<Box className="c-Box-inline-xyz" style={{ '--seams-dyn-0': dynamicVal }} />
```

## TypeScript Notes

- Uses `verbatimModuleSyntax` - type imports must use `import type`
- Uses `noPropertyAccessFromIndexSignature` - use bracket notation for index signatures
- Build generates both ESM (`.js`) and CJS (`.cjs`) via tsup
- Type declarations generated separately via `tsc --emitDeclarationOnly`

## Testing

Tests are in `*.test.ts` files alongside source files. Key test files:

- `packages/core/src/convert/toHash.test.ts`
- `packages/core/src/convert/toTokenizedValue.test.ts`
- `packages/core/src/createStitches.test.ts`
- `packages/plugin-common/src/analyzer.test.ts`
