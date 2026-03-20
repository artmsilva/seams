import { CodeBlock } from "../components/CodeBlock";
import { Section, SubHeading, Paragraph, InlineCode } from "../components/Section";

const viteSetup = `// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import seams from "@artmsilva/seams-vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    seams({
      // Enable @scope for component isolation
      useScope: true,
      // Enable @layer for cascade ordering
      useLayers: true,
    }),
  ],
});`;

const nextSetup = `// next.config.js
const { withSeams } = require("@artmsilva/seams-next-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
};

module.exports = withSeams(nextConfig);`;

const nextSSR = `// app/layout.tsx (App Router)
import { getCssText } from "../seams.config";

// Inject critical CSS into the document head for SSR.
// Use getCssText() to retrieve the generated CSS string
// and render it inside a <style> tag in your layout.

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <style id="seams">{getCssText()}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}`;

const pluginOptions = `seams({
  // CSS @scope for component-level isolation (default: false)
  useScope: true,

  // CSS @layer for deterministic cascade ordering (default: false)
  useLayers: true,

  // File extensions to process (default: [".tsx", ".ts", ".jsx", ".js"])
  extensions: [".tsx", ".ts"],

  // Directories to include, relative to project root
  include: ["src", "app", "components"],

  // Directories to exclude
  exclude: ["node_modules"],

  // Minify output CSS in production (auto-detected from mode)
  minify: true,

  // Custom layer prefix
  layerPrefix: "stitches",
})`;

export function Plugins() {
  return (
    <Section id="plugins" title="Build Plugins">
      <Paragraph>
        Seams extracts CSS at build time using framework-specific plugins. The plugins analyze your
        source code, extract all Seams usage, and emit static CSS files -- leaving zero CSS-in-JS
        runtime in your production bundle.
      </Paragraph>

      <SubHeading>Vite</SubHeading>
      <Paragraph>
        The Vite plugin processes your source files during development and build, collecting CSS
        into a virtual module that Vite handles natively.
      </Paragraph>
      <CodeBlock label="vite.config.ts">{viteSetup}</CodeBlock>

      <SubHeading>Next.js</SubHeading>
      <Paragraph>
        The Next.js plugin wraps your configuration and adds a webpack loader for Seams processing.
        Works with both App Router and Pages Router.
      </Paragraph>
      <CodeBlock label="next.config.js">{nextSetup}</CodeBlock>

      <Paragraph>
        For server-side rendering, use <InlineCode>getCssText()</InlineCode> to inline the critical
        CSS into your document head.
      </Paragraph>
      <CodeBlock label="app/layout.tsx">{nextSSR}</CodeBlock>

      <SubHeading>Plugin options</SubHeading>
      <Paragraph>Both plugins accept the same core options for controlling CSS output.</Paragraph>
      <CodeBlock label="options">{pluginOptions}</CodeBlock>

      <SubHeading>CSS layer order</SubHeading>
      <Paragraph>
        When <InlineCode>useLayers</InlineCode> is enabled, Seams organizes CSS into layers with a
        deterministic cascade order. This eliminates specificity issues and ensures styles are
        applied predictably regardless of import order.
      </Paragraph>
      <CodeBlock label="layer order">{`@layer stitches.themed,    /* Theme CSS variables */
       stitches.global,    /* globalCss() styles */
       stitches.styled,    /* Base component styles */
       stitches.onevar,    /* Single variant styles */
       stitches.resonevar, /* Responsive variant styles */
       stitches.allvar,    /* Compound variant styles */
       stitches.inline;    /* css prop styles */`}</CodeBlock>
    </Section>
  );
}
