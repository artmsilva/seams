import { CodeBlock } from "../ds";
import { Section, SubHeading, Paragraph, InlineCode } from "../components/Section";

const createStitchesCode = `import { createStitches } from "@artmsilva/seams-react";

const {
  styled,       // Create styled React components
  css,          // Generate class names from style objects
  globalCss,    // Inject global styles
  keyframes,    // Define CSS animations
  createTheme,  // Create theme variants
  theme,        // The default theme object
  getCssText,   // Extract all CSS as a string (SSR)
} = createStitches({
  prefix: "my-app",             // CSS class prefix
  theme: { /* tokens */ },      // Design tokens
  media: { /* breakpoints */ }, // Responsive breakpoints
  utils: { /* utilities */ },   // Custom CSS shorthand utilities
  themeMap: { /* overrides */ }, // Map CSS properties to theme scales
  atomic: false,                // Enable atomic CSS output mode
});`;

const styledCode = `const Button = styled("button", {
  // Base styles
  backgroundColor: "$primary",
  color: "white",
  borderRadius: "$md",
  padding: "$2 $3",
  border: "none",
  cursor: "pointer",

  // Pseudo-selectors
  "&:hover": { opacity: 0.9 },
  "&:focus-visible": { outline: "2px solid $primary" },

  // Variants
  variants: {
    size: {
      sm: { fontSize: "14px", padding: "$1 $2" },
      md: { fontSize: "16px", padding: "$2 $3" },
      lg: { fontSize: "18px", padding: "$3 $4" },
    },
    variant: {
      solid: { backgroundColor: "$primary", color: "white" },
      outline: {
        backgroundColor: "transparent",
        border: "2px solid $primary",
        color: "$primary",
      },
    },
  },

  // Compound variants: apply when multiple variants match
  compoundVariants: [
    {
      size: "lg",
      variant: "solid",
      css: { fontWeight: 700, letterSpacing: "0.5px" },
    },
  ],

  // Default variant values
  defaultVariants: {
    size: "md",
    variant: "solid",
  },
});

// Usage with type-safe variant props
<Button size="lg" variant="outline">Click me</Button>`;

const cssCode = `const cardStyles = css({
  padding: "$4",
  borderRadius: "$lg",
  backgroundColor: "$bg",
  border: "1px solid $border",

  variants: {
    elevated: {
      true: { boxShadow: "$md" },
    },
  },
});

// Returns { className, props } on render
const rendered = cardStyles({ elevated: true });

<div className={rendered.className}>Card content</div>`;

const globalCssCode = `const applyGlobalStyles = globalCss({
  "*, *::before, *::after": {
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
  },
  html: {
    scrollBehavior: "smooth",
  },
  body: {
    fontFamily: "$body",
    backgroundColor: "$bg",
    color: "$text",
    lineHeight: 1.6,
  },
  a: {
    color: "$primary",
    textDecoration: "none",
  },
});

// Call it once at your app root
applyGlobalStyles();`;

const keyframesCode = `const fadeIn = keyframes({
  from: { opacity: 0, transform: "translateY(8px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

const spin = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

// Use in a styled component
const FadeIn = styled("div", {
  animation: \`\${fadeIn} 0.6s ease-out both\`,
});

const Spinner = styled("div", {
  animation: \`\${spin} 1s linear infinite\`,
  width: "24px",
  height: "24px",
  border: "2px solid $border",
  borderTopColor: "$primary",
  borderRadius: "$pill",
});`;

const createThemeCode = `const darkTheme = createTheme("dark", {
  colors: {
    primary: "#3291ff",
    bg: "#111111",
    text: "#ededed",
    border: "#333333",
  },
  shadows: {
    md: "0 4px 6px rgba(0, 0, 0, 0.4)",
  },
});

// Apply the theme by adding the className to a parent element
function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={isDark ? darkTheme.className : undefined}>
      <MyComponent />
    </div>
  );
}`;

const getCssTextCode = `// In your SSR handler or layout component
import { getCssText } from "./seams.config";

// Use getCssText() to get all generated CSS as a string,
// then inject it into a <style> tag in your document <head>.
// This avoids a flash of unstyled content on first load.

const cssString = getCssText();
// => "@layer seams.themed { :root { --colors-primary: ... } } ..."`;

const compositionCode = `// Base component
const Box = styled("div", {
  padding: "$2",
  color: "$text",
});

// Extended component inherits Box's element type, base styles, and variants
const Card = styled(Box, {
  borderRadius: "$md",
  boxShadow: "$md",
  backgroundColor: "$bg",
});

// Multi-level: Card inherits from Box, FeaturedCard from Card
const FeaturedCard = styled(Card, {
  border: "2px solid $primary",
});

// Works with plain React components too (wraps without style inheritance)
const StyledLink = styled(MyReactRouterLink, {
  color: "$primary",
  textDecoration: "none",
});`;

const atomicCssCode = `// Enable atomic mode in your config
const { styled, css, getCssText } = createStitches({
  atomic: true,
  theme: { /* tokens */ },
});

// API is identical -- only the CSS output changes
const Button = styled("button", {
  backgroundColor: "$primary",
  color: "white",
  padding: "$2 $3",
});

const Badge = styled("span", {
  color: "white",       // Shares atomic class with Button!
  padding: "$1 $2",
  borderRadius: "$pill",
});`;

const atomicOutputCode = `/* Standard mode: one class per component */
.c-Button { background-color: var(--colors-primary); color: white; padding: 8px 16px; }
.c-Badge  { color: white; padding: 4px 8px; border-radius: 9999px; }

/* Atomic mode: one class per declaration, shared globally */
.s-abc { background-color: var(--colors-primary) }
.s-def { color: white }                /* shared by Button AND Badge */
.s-ghi { padding: 8px 16px }
.s-jkl { padding: 4px 8px }
.s-mno { border-radius: 9999px }`;

export function ApiReference() {
  return (
    <>
      <Section id="api-create-stitches" title="createStitches">
        <Paragraph>
          The factory function that creates your styling utilities. Call it once with your design
          tokens, breakpoints, and custom utilities to get a fully configured set of functions.
        </Paragraph>
        <CodeBlock label="seams.config.ts">{createStitchesCode}</CodeBlock>

        <SubHeading>Config options</SubHeading>
        <Paragraph>
          <InlineCode>prefix</InlineCode> -- String prepended to generated class names and CSS
          variable names. Prevents collisions when multiple Seams instances exist.
        </Paragraph>
        <Paragraph>
          <InlineCode>theme</InlineCode> -- Design tokens organized by scale: colors, space, fonts,
          fontSizes, radii, shadows, and more. Tokens become CSS custom properties and can be
          referenced with the <InlineCode>$</InlineCode> prefix in styles.
        </Paragraph>
        <Paragraph>
          <InlineCode>media</InlineCode> -- Named breakpoints. Use as responsive variant keys or in
          media query conditions.
        </Paragraph>
        <Paragraph>
          <InlineCode>utils</InlineCode> -- Custom CSS shorthand properties. Each utility is a
          function that receives a value and returns a CSS object.
        </Paragraph>
        <Paragraph>
          <InlineCode>themeMap</InlineCode> -- Controls which CSS properties map to which theme
          scales. Override defaults when needed (e.g., map <InlineCode>gap</InlineCode> to your{" "}
          <InlineCode>space</InlineCode> scale).
        </Paragraph>
        <Paragraph>
          <InlineCode>atomic</InlineCode> -- When <InlineCode>true</InlineCode>, each CSS
          property-value pair gets its own globally-deduplicated class. CSS scales logarithmically
          with component count. See the{" "}
          <a href="#atomic-css" style={{ color: "inherit" }}>
            Atomic CSS
          </a>{" "}
          section below.
        </Paragraph>
      </Section>

      <Section id="api-styled" title="styled">
        <Paragraph>
          Creates a React component with scoped styles and type-safe variant props. Wraps any HTML
          element or existing component.
        </Paragraph>
        <CodeBlock label="styled.tsx">{styledCode}</CodeBlock>

        <SubHeading>Variants</SubHeading>
        <Paragraph>
          Variants let you define discrete visual states. Each variant is a named set of additional
          styles that apply when the corresponding prop is set. Variants are type-safe -- TypeScript
          knows which values are valid.
        </Paragraph>

        <SubHeading>Compound variants</SubHeading>
        <Paragraph>
          Apply styles only when specific variant combinations are active. Useful for handling
          interactions between multiple variant dimensions.
        </Paragraph>

        <SubHeading>CSS prop</SubHeading>
        <Paragraph>
          Every styled component accepts a <InlineCode>css</InlineCode> prop for one-off style
          overrides. Dynamic values in the css prop are converted to CSS variables at build time.
        </Paragraph>
      </Section>

      <Section id="api-css" title="css">
        <Paragraph>
          A standalone function for generating class names from style objects. Same configuration as{" "}
          <InlineCode>styled()</InlineCode> (variants, compound variants) but without creating a
          React component -- useful for non-component styling or integrating with other libraries.
        </Paragraph>
        <CodeBlock label="css.ts">{cssCode}</CodeBlock>
      </Section>

      <Section id="api-global-css" title="globalCss">
        <Paragraph>
          Defines global CSS rules using your theme tokens. Call the returned function at your
          application root to inject the styles.
        </Paragraph>
        <CodeBlock label="globalStyles.ts">{globalCssCode}</CodeBlock>
      </Section>

      <Section id="api-keyframes" title="keyframes">
        <Paragraph>
          Creates CSS <InlineCode>@keyframes</InlineCode> animations. Returns a value you can
          interpolate into animation properties.
        </Paragraph>
        <CodeBlock label="animations.ts">{keyframesCode}</CodeBlock>
      </Section>

      <Section id="api-create-theme" title="createTheme">
        <Paragraph>
          Creates a theme variant by overriding token values. The returned object has a{" "}
          <InlineCode>className</InlineCode> property you apply to a parent element to activate that
          theme within its subtree.
        </Paragraph>
        <CodeBlock label="themes.ts">{createThemeCode}</CodeBlock>
      </Section>

      <Section id="api-get-css-text" title="getCssText">
        <Paragraph>
          Returns all generated CSS as a string. Use this for server-side rendering to inline the
          critical CSS into your HTML document head, avoiding a flash of unstyled content.
        </Paragraph>
        <CodeBlock label="ssr.ts">{getCssTextCode}</CodeBlock>
      </Section>

      <Section id="composition" title="Composition">
        <Paragraph>
          Pass an existing styled component as the first argument to{" "}
          <InlineCode>styled()</InlineCode> or <InlineCode>css()</InlineCode> to create an extended
          version. The new component inherits the base{"'"}s element type, styles, and variant
          definitions.
        </Paragraph>
        <CodeBlock label="composition.tsx">{compositionCode}</CodeBlock>

        <SubHeading>How it works</SubHeading>
        <Paragraph>
          Internally, each <InlineCode>css()</InlineCode> call produces a set of <em>composers</em>{" "}
          (style + variant definitions). When you compose, the base component
          {"'"}s composers are merged into the new component{"'"}s set. This means styles stack
          additively -- the new component gets all base styles plus its own. Multi-level chaining (A{" "}
          {"→"} B {"→"} C) works naturally.
        </Paragraph>
        <Paragraph>
          Plain React components (functions without Seams internals) can also be passed. They become
          the element type but don{"'"}t contribute any style inheritance, since they have no
          composers.
        </Paragraph>
      </Section>

      <Section id="atomic-css" title="Atomic CSS">
        <Paragraph>
          Atomic mode changes how CSS is generated. Instead of one class per component with multiple
          properties, each property-value pair gets its own hash-based class. Identical declarations
          across different components share the same class, so CSS deduplicates globally.
        </Paragraph>
        <CodeBlock label="seams.config.ts">{atomicCssCode}</CodeBlock>

        <SubHeading>Output comparison</SubHeading>
        <Paragraph>
          Here{"'"}s what changes under the hood. The <InlineCode>color: white</InlineCode>{" "}
          declaration appears once in atomic mode even though two components use it.
        </Paragraph>
        <CodeBlock label="output.css">{atomicOutputCode}</CodeBlock>

        <SubHeading>Why atomic?</SubHeading>
        <Paragraph>
          In standard mode, CSS grows linearly with the number of components. In atomic mode, it
          grows logarithmically -- new components reuse existing atomic classes instead of
          generating new rule blocks. For large design systems this can significantly reduce bundle
          size.
        </Paragraph>

        <SubHeading>How specificity works</SubHeading>
        <Paragraph>
          When a variant overrides a base property, both atomic classes are in the{" "}
          <InlineCode>className</InlineCode>. The variant wins because Seams{"'"} existing{" "}
          <InlineCode>@layer</InlineCode> ordering ensures variant layers (
          <InlineCode>seams.onevar</InlineCode>) always beat the base layer (
          <InlineCode>seams.styled</InlineCode>), regardless of class order in the DOM.
        </Paragraph>

        <SubHeading>Selector targeting</SubHeading>
        <Paragraph>
          Each component keeps an identifier class (<InlineCode>c-Button</InlineCode>) with no CSS
          rules. This preserves the ability to target components in other selectors via{" "}
          <InlineCode>{"${Button}"}</InlineCode>. The rendered <InlineCode>className</InlineCode>{" "}
          includes both the identifier and all atomic classes.
        </Paragraph>
      </Section>
    </>
  );
}
