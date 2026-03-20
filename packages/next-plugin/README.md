# @artmsilva/seams-next-plugin

Next.js integration for Seams. Adds a webpack loader that extracts CSS at build time, enabling full support for the App Router and React Server Components.

## Install

```bash
npm install @artmsilva/seams-next-plugin
```

> Requires `.npmrc` configured for the GitHub npm registry:
>
> ```
> @artmsilva:registry=https://npm.pkg.github.com
> ```

Peer dependency: `next ^14.0.0 || ^15.0.0 || ^16.0.0`

## Usage

Wrap your Next.js config with `withSeams()`:

```ts
// next.config.ts
import { withSeams } from "@artmsilva/seams-next-plugin";

const nextConfig = withSeams({
  useScope: true,
  useLayers: true,
})({
  // your existing Next.js config
});

export default nextConfig;
```

That's it. The plugin hooks into webpack to process `.ts`, `.tsx`, `.js`, and `.jsx` files under `app/`, `components/`, `src/`, and `pages/` by default.

### Options

All options from `@artmsilva/seams-plugin-common` are supported, plus:

| Option       | Default                                 | Description                          |
| ------------ | --------------------------------------- | ------------------------------------ |
| `extensions` | `['.tsx', '.ts', '.jsx', '.js']`        | File extensions to process           |
| `include`    | `['app', 'components', 'src', 'pages']` | Directories to scan                  |
| `exclude`    | `['node_modules']`                      | Directories to skip                  |
| `useScope`   | `true`                                  | Use `@scope` for component isolation |
| `useLayers`  | `true`                                  | Use `@layer` for cascade control     |

### Next.js 16 + Turbopack

Next.js 16 defaults to Turbopack, which does not support custom webpack loaders. Run with the `--webpack` flag:

```bash
next dev --webpack
next build --webpack
```

## Docs

Full documentation: https://artmsilva.github.io/seams/
