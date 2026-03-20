# @artmsilva/seams-plugin-common

Shared build plugin logic for Seams. Provides the Babel AST analysis and CSS extraction pipeline used by `@artmsilva/seams-next-plugin` and `@artmsilva/seams-vite-plugin`.

**This is an internal package.** You should not need to install it directly -- use one of the framework-specific plugins instead.

## Install

```bash
npm install @artmsilva/seams-plugin-common
```

> Requires `.npmrc` configured for the GitHub npm registry:
>
> ```
> @artmsilva:registry=https://npm.pkg.github.com
> ```

## Pipeline

The `processSource()` function runs four stages:

1. **Analyze** (`analyzeSource`) -- Babel AST pass to find Seams imports and usages
2. **Extract** (`extractCss`) -- Extracts static CSS from analyzed call sites
3. **Transform** (`transformSource`) -- Converts dynamic values to CSS custom properties
4. **Generate** (`generateFullCss`) -- Produces final CSS with `@layer` and `@scope`

```ts
import { processSource } from "@artmsilva/seams-plugin-common";

const result = processSource(sourceCode, "component.tsx", {
  useScope: true,
  useLayers: true,
});

result.css; // Generated CSS
result.code; // Transformed source code
result.dynamicVariables; // CSS variables for runtime injection
result.hasStitches; // Whether the file contained Seams usage
```

## Docs

Full documentation: https://artmsilva.github.io/seams/
