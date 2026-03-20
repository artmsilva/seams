# @artmsilva/seams-react

React bindings for Seams. Adds `styled()` on top of `@artmsilva/seams-core` for creating styled React components with variants, `css` prop, and `as` prop support. Compatible with React Server Components and SSR.

## Install

```bash
npm install @artmsilva/seams-react
```

> Requires `.npmrc` configured for the GitHub npm registry:
>
> ```
> @artmsilva:registry=https://npm.pkg.github.com
> ```

Peer dependency: `react ^18.3.0 || ^19.0.0`

## Usage

### Create an instance

```tsx
// seams.config.ts
import { createStitches } from "@artmsilva/seams-react";

export const { styled, css, globalCss, keyframes, createTheme, theme } = createStitches({
  prefix: "my-app",
  theme: {
    colors: {
      primary: "#0070f3",
      background: "#ffffff",
    },
    space: {
      1: "4px",
      2: "8px",
      3: "16px",
    },
  },
});
```

### `styled()`

Create typed React components with variants:

```tsx
const Button = styled('button', {
  backgroundColor: '$primary',
  color: 'white',
  padding: '$2 $3',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',

  variants: {
    size: {
      sm: { fontSize: '14px', padding: '$1 $2' },
      lg: { fontSize: '18px', padding: '$3' },
    },
    outlined: {
      true: {
        background: 'transparent',
        border: '2px solid $primary',
        color: '$primary',
      },
    },
  },

  compoundVariants: [
    {
      size: 'lg',
      outlined: true,
      css: { borderWidth: '3px' },
    },
  ],
});

// Variants are type-safe props
<Button size="lg">Click me</Button>
<Button size="sm" outlined>Secondary</Button>
```

### `css` prop

Override or extend styles on any styled component:

```tsx
<Button css={{ marginTop: "$3", backgroundColor: "$secondary" }}>Custom</Button>
```

### `as` prop

Render as a different element:

```tsx
<Button as="a" href="/link">
  I'm a link
</Button>
```

### RSC and SSR

`@artmsilva/seams-react` works with React Server Components out of the box when paired with `@artmsilva/seams-next-plugin` or `@artmsilva/seams-vite-plugin` for build-time CSS extraction.

All core APIs (`css`, `globalCss`, `keyframes`, `createTheme`, `getCssText`) are re-exported from this package.

## Docs

Full documentation: https://artmsilva.github.io/seams/
