# @artmsilva/seams-core

Isomorphic core for Seams -- zero-runtime CSS-in-JS inspired by Stitches. No React or Lit dependency. Works in Node.js (SSR/RSC) and the browser.

## Install

```bash
npm install @artmsilva/seams-core
```

> Requires `.npmrc` configured for the GitHub npm registry:
>
> ```
> @artmsilva:registry=https://npm.pkg.github.com
> ```

## Usage

### Create an instance

```ts
import { createStitches } from "@artmsilva/seams-core";

const { css, globalCss, keyframes, createTheme, getCssText, theme } = createStitches({
  prefix: "my-app",
  theme: {
    colors: {
      primary: "#0070f3",
      secondary: "#ff0080",
    },
    space: {
      1: "4px",
      2: "8px",
      3: "16px",
    },
  },
  media: {
    sm: "(min-width: 640px)",
    md: "(min-width: 768px)",
    lg: "(min-width: 1024px)",
  },
  utils: {
    mx: (value: string) => ({ marginLeft: value, marginRight: value }),
  },
});
```

### `css()`

Create component styles with variants:

```ts
const button = css({
  backgroundColor: "$primary",
  padding: "$2",
  variants: {
    size: {
      sm: { fontSize: "14px" },
      lg: { fontSize: "18px" },
    },
  },
});

const { className } = button({ size: "lg" });
```

### `globalCss()`

Define global styles:

```ts
const globalStyles = globalCss({
  "*": { margin: 0, boxSizing: "border-box" },
  body: { fontFamily: "system-ui" },
});

globalStyles();
```

### `keyframes()`

Define keyframe animations:

```ts
const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});
```

### `createTheme()`

Create additional themes:

```ts
const darkTheme = createTheme({
  colors: {
    primary: "#58a6ff",
    secondary: "#f778ba",
  },
});
```

### `getCssText()`

Get all generated CSS as a string (useful for SSR):

```ts
const cssText = getCssText();
// Inject into <style> tag during server-side rendering
```

## Docs

Full documentation: https://artmsilva.github.io/seams/
