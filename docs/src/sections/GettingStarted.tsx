import { CodeBlock } from "../ds";
import { Section, Paragraph, SubHeading, InlineCode } from "../components/Section";

const installReact = `npm install @artmsilva/seams-react`;

const installVite = `npm install -D @artmsilva/seams-vite-plugin`;

const installNext = `npm install @artmsilva/seams-next-plugin`;

const installLit = `npm install @artmsilva/seams-lit`;

const quickStart = `// seams.config.ts
import { createStitches } from "@artmsilva/seams-react";

export const { styled, css, globalCss, keyframes, createTheme, theme, getCssText } =
  createStitches({
    theme: {
      colors: {
        primary: "#0070f3",
        secondary: "#7928ca",
        text: "#111111",
        bg: "#ffffff",
      },
      space: {
        1: "4px",
        2: "8px",
        3: "16px",
        4: "32px",
      },
      radii: {
        sm: "4px",
        md: "8px",
        lg: "16px",
      },
    },
    media: {
      sm: "(min-width: 640px)",
      md: "(min-width: 768px)",
      lg: "(min-width: 1024px)",
    },
  });`;

const usageExample = `// Button.tsx
import { styled } from "./seams.config";

const Button = styled("button", {
  backgroundColor: "$primary",
  color: "white",
  padding: "$2 $3",
  borderRadius: "$md",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",

  "&:hover": {
    opacity: 0.9,
  },

  variants: {
    size: {
      sm: { padding: "$1 $2", fontSize: "14px" },
      lg: { padding: "$3 $4", fontSize: "18px" },
    },
  },

  defaultVariants: {
    size: "sm",
  },
});

// Usage
<Button size="lg">Click me</Button>`;

export function GettingStarted() {
  return (
    <>
      <Section id="getting-started" title="Getting Started">
        <Paragraph>
          Seams is a zero-runtime CSS-in-JS library designed for React Server Components. It
          provides the same beloved API as Stitches.js but extracts all CSS at build time, producing
          static stylesheets with zero JavaScript overhead in production.
        </Paragraph>
        <Paragraph>
          CSS output uses <InlineCode>@layer</InlineCode> for deterministic cascade ordering and{" "}
          <InlineCode>@scope</InlineCode> for component isolation, ensuring your styles compose
          predictably without specificity wars.
        </Paragraph>
      </Section>

      <Section id="installation" title="Installation">
        <SubHeading>React package</SubHeading>
        <Paragraph>
          The main package for React applications. Includes <InlineCode>styled()</InlineCode>,{" "}
          <InlineCode>css()</InlineCode>, <InlineCode>globalCss()</InlineCode>, and all core APIs.
        </Paragraph>
        <CodeBlock label="terminal">{installReact}</CodeBlock>

        <SubHeading>Vite plugin</SubHeading>
        <Paragraph>Required for build-time CSS extraction when using Vite.</Paragraph>
        <CodeBlock label="terminal">{installVite}</CodeBlock>

        <SubHeading>Next.js plugin</SubHeading>
        <Paragraph>For Next.js projects using the App Router or Pages Router.</Paragraph>
        <CodeBlock label="terminal">{installNext}</CodeBlock>

        <SubHeading>Lit / Web Components</SubHeading>
        <Paragraph>
          For Lit and Web Components. Provides Shadow DOM integration via{" "}
          <InlineCode>adoptedStyleSheets</InlineCode>.
        </Paragraph>
        <CodeBlock label="terminal">{installLit}</CodeBlock>
      </Section>

      <Section id="quick-start" title="Quick Start">
        <Paragraph>
          Create a configuration file that defines your design tokens and exports the styling
          utilities. This is the single source of truth for your design system.
        </Paragraph>
        <CodeBlock label="seams.config.ts">{quickStart}</CodeBlock>

        <Paragraph>
          Import the exported utilities to create styled components with type-safe variants.
        </Paragraph>
        <CodeBlock label="Button.tsx">{usageExample}</CodeBlock>
      </Section>
    </>
  );
}
