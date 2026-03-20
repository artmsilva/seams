# Stitches RSC

Zero-runtime [Stitches.js](https://stitches.dev) replacement for React Server Components.

## Features

- **1:1 API compatibility** with the original Stitches
- **Zero runtime** — CSS is extracted at build time
- **React Server Components support** — works in RSC environments
- **CSS `@layer`** for cascade control
- **CSS `@scope`** for component isolation

## Installation

```bash
pnpm add @stitches-rsc/react
```

For framework-specific setup, install the appropriate plugin:

```bash
# Next.js
pnpm add @stitches-rsc/next-plugin

# Vite
pnpm add @stitches-rsc/vite-plugin
```

## Usage

```tsx
import { styled, css } from "@stitches-rsc/react";

const Button = styled("button", {
  backgroundColor: "$primary",
  borderRadius: "8px",
  padding: "10px 20px",

  variants: {
    size: {
      small: { fontSize: "14px" },
      large: { fontSize: "18px" },
    },
  },
});

export default function App() {
  return <Button size="large">Click me</Button>;
}
```

## Packages

| Package                     | Description                             |
| --------------------------- | --------------------------------------- |
| `@stitches-rsc/core`        | Isomorphic API (no React dependency)    |
| `@stitches-rsc/react`       | React bindings with `styled()` function |
| `@stitches-rsc/next-plugin` | Next.js webpack loader                  |
| `@stitches-rsc/vite-plugin` | Vite transform plugin                   |

## How It Works

Stitches RSC extracts CSS at build time instead of generating it at runtime. This enables full React Server Components support.

### Token Transformation

```tsx
// Input
{ color: '$colors$primary' }

// Output CSS
{ color: var(--prefix-colors-primary) }
```

### Dynamic Values

Dynamic values are converted to CSS variables:

```tsx
// Input
<Box css={{ margin: dynamicVal }} />

// Output CSS
.c-Box-inline-xyz { margin: var(--stitches-dyn-0); }

// Output JS
<Box className="c-Box-inline-xyz" style={{ '--stitches-dyn-0': dynamicVal }} />
```

### CSS Layer Order

Styles are organized into layers for predictable cascade ordering:

```css
@layer stitches.themed,    /* Theme CSS variables */
       stitches.global,    /* globalCss() styles */
       stitches.styled,    /* Base component styles */
       stitches.onevar,    /* Single variant styles */
       stitches.resonevar, /* Responsive variant styles */
       stitches.allvar,    /* Compound variant styles */
       stitches.inline; /* css prop styles */
```

## Development

This project uses [Vite+](https://viteplus.dev/) as the unified toolchain.

```bash
# Install dependencies
vp install

# Build all packages
vp run build

# Run tests
vp test

# Format, lint, and type check
vp check

# Type check only
vp run typecheck
```

## Requirements

- Node.js >= 24.0.0
- React 18.3+ or 19+

## License

MIT
