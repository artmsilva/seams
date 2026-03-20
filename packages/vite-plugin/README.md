# @artmsilva/seams-vite-plugin

Vite integration for Seams. Extracts CSS at build time via a Vite transform plugin and serves it through a virtual module.

## Install

```bash
npm install @artmsilva/seams-vite-plugin
```

> Requires `.npmrc` configured for the GitHub npm registry:
>
> ```
> @artmsilva:registry=https://npm.pkg.github.com
> ```

Peer dependency: `vite ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0`

## Usage

Add the plugin to your Vite config:

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import seams from "@artmsilva/seams-vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    seams({
      useScope: true,
      useLayers: true,
    }),
  ],
});
```

Import the virtual CSS module in your app entry:

```ts
// main.ts
import "virtual:seams.css";
```

The plugin processes source files, extracts Seams CSS at build time, and collects it into `virtual:seams.css`. In production builds, a separate `seams.css` asset is emitted. HMR is supported -- editing a file with Seams usage triggers a CSS update without a full reload.

### Options

All options from `@artmsilva/seams-plugin-common` are supported, plus:

| Option       | Default                          | Description                          |
| ------------ | -------------------------------- | ------------------------------------ |
| `extensions` | `['.tsx', '.ts', '.jsx', '.js']` | File extensions to process           |
| `include`    | `['src', 'app', 'components']`   | Directories to scan                  |
| `exclude`    | `['node_modules']`               | Directories to skip                  |
| `useScope`   | `true`                           | Use `@scope` for component isolation |
| `useLayers`  | `true`                           | Use `@layer` for cascade control     |

## Docs

Full documentation: https://artmsilva.github.io/seams/
