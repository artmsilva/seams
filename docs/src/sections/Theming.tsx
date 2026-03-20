import { CodeBlock } from "../ds";
import { Section, SubHeading, Paragraph, InlineCode } from "../components/Section";

const tokenSystem = `// Define tokens in your config
const { styled, createTheme, theme } = createStitches({
  theme: {
    colors: {
      primary: "#0070f3",
      text: "#111111",
      bg: "#ffffff",
    },
    space: {
      1: "4px",
      2: "8px",
      3: "16px",
    },
  },
});

// Reference tokens with $ prefix
const Box = styled("div", {
  color: "$text",            // -> var(--colors-text)
  backgroundColor: "$bg",   // -> var(--colors-bg)
  padding: "$3",             // -> var(--space-3)
});

// Cross-scale references
const Card = styled("div", {
  color: "$colors$primary",  // Explicit scale reference
});`;

const themeCreation = `// The default theme is created from your config
// Create additional themes by overriding tokens

const darkTheme = createTheme("dark", {
  colors: {
    primary: "#3291ff",
    text: "#ededed",
    bg: "#111111",
  },
});

// Only override the tokens you need to change.
// Unspecified tokens inherit from the default theme.

const highContrastTheme = createTheme("high-contrast", {
  colors: {
    primary: "#0000FF",
    text: "#000000",
    bg: "#FFFFFF",
  },
});`;

const themeApplication = `function App() {
  const [currentTheme, setCurrentTheme] = useState<string | undefined>();

  return (
    // Apply theme class to a parent element
    <div className={currentTheme}>
      <Header />
      <Main />

      <button onClick={() => setCurrentTheme(undefined)}>
        Default
      </button>
      <button onClick={() => setCurrentTheme(darkTheme.className)}>
        Dark
      </button>
      <button onClick={() => setCurrentTheme(highContrastTheme.className)}>
        High Contrast
      </button>
    </div>
  );
}`;

const howItWorks = `/* Default theme generates CSS custom properties on :root */
:root {
  --colors-primary: #0070f3;
  --colors-text: #111111;
  --colors-bg: #ffffff;
}

/* createTheme generates a class that overrides variables */
.dark {
  --colors-primary: #3291ff;
  --colors-text: #ededed;
  --colors-bg: #111111;
}

/* Component styles reference the variables */
.c-Box {
  color: var(--colors-text);
  background-color: var(--colors-bg);
}`;

export function Theming() {
  return (
    <Section id="theming" title="Theming">
      <Paragraph>
        Seams uses CSS custom properties for theming. Your design tokens are converted to CSS
        variables, and theme variants override those variables through class scoping -- no
        JavaScript runtime overhead for theme switching.
      </Paragraph>

      <SubHeading>Token system</SubHeading>
      <Paragraph>
        Tokens are defined by scale (colors, space, fonts, etc.) and referenced in styles with a{" "}
        <InlineCode>$</InlineCode> prefix. Seams automatically maps CSS properties to the correct
        scale based on the built-in theme map.
      </Paragraph>
      <CodeBlock label="tokens.ts">{tokenSystem}</CodeBlock>

      <SubHeading>Creating themes</SubHeading>
      <Paragraph>
        Use <InlineCode>createTheme()</InlineCode> to define theme variants. You only need to
        specify the tokens that change -- everything else inherits from the default theme.
      </Paragraph>
      <CodeBlock label="themes.ts">{themeCreation}</CodeBlock>

      <SubHeading>Applying themes</SubHeading>
      <Paragraph>
        Apply a theme by setting its <InlineCode>className</InlineCode> on a parent element. All
        descendant components will pick up the overridden tokens through CSS variable inheritance.
      </Paragraph>
      <CodeBlock label="App.tsx">{themeApplication}</CodeBlock>

      <SubHeading>How it works</SubHeading>
      <Paragraph>
        Under the hood, the default theme generates CSS custom properties on{" "}
        <InlineCode>:root</InlineCode>. Each additional theme generates a scoped class that
        overrides those variables. Since components reference the variables (not hard-coded values),
        theme switching is instantaneous and requires no re-renders.
      </Paragraph>
      <CodeBlock label="generated CSS">{howItWorks}</CodeBlock>
    </Section>
  );
}
