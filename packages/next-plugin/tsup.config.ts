import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/loader.ts'],
  format: ['esm', 'cjs'],
  dts: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: false,
  minify: false,
  external: ['next', 'webpack'],
});
