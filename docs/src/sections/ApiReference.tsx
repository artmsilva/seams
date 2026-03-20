import { CodeBlock } from "../components/CodeBlock";
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
    </>
  );
}
