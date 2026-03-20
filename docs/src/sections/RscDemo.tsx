import { styled, getCssText } from "../seams.config";
import { Section, SubHeading, Paragraph, InlineCode } from "../components/Section";

const Badge = styled("span", {
  display: "inline-flex",
  alignItems: "center",
  gap: "$1",
  padding: "$1 $3",
  borderRadius: "$pill",
  fontSize: "$xs",
  fontWeight: "$semibold",
  letterSpacing: "0.3px",

  variants: {
    kind: {
      server: {
        backgroundColor: "$success",
        color: "white",
      },
      client: {
        backgroundColor: "$accent",
        color: "white",
      },
    },
  },
});

const ComponentList = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$3",
  marginTop: "$4",
  marginBottom: "$6",
});

const ComponentRow = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$3",
  padding: "$3 $5",
  borderRadius: "$md",
  backgroundColor: "$bgSubtle",
  border: "1px solid $borderSubtle",
  transition: "background-color 0.2s ease, border-color 0.2s ease",
});

const ComponentName = styled("span", {
  fontFamily: "$mono",
  fontSize: "$sm",
  color: "$text",
  transition: "color 0.2s ease",
});

const StatBox = styled("div", {
  display: "flex",
  gap: "$5",
  marginTop: "$4",
  flexWrap: "wrap",
});

const Stat = styled("div", {
  padding: "$4 $5",
  borderRadius: "$lg",
  backgroundColor: "$bgSubtle",
  border: "1px solid $border",
  minWidth: "160px",
  transition: "background-color 0.2s ease, border-color 0.2s ease",
});

const StatValue = styled("div", {
  fontSize: "$2xl",
  fontWeight: "$bold",
  color: "$brand",
  marginBottom: "$1",
});

const StatLabel = styled("div", {
  fontSize: "$sm",
  color: "$textMuted",
  transition: "color 0.2s ease",
});

const serverComponents = [
  "Layout",
  "Sidebar",
  "Header (shell)",
  "Hero",
  "GettingStarted",
  "ApiReference",
  "Theming",
  "Plugins",
  "LitIntegration",
  "RscDemo (this section)",
  "Section",
  "CodeBlock",
];

const clientComponents = ["ThemeToggle", "CopyButton", "MobileNav", "Examples"];

export function RscDemo() {
  const cssText = getCssText();
  const cssSize = new TextEncoder().encode(cssText).length;
  const cssSizeKb = (cssSize / 1024).toFixed(1);

  return (
    <Section id="rsc" title="React Server Components">
      <Paragraph>
        This very documentation site is the proof. It is built with Waku and uses Seams for every
        single style you see. The layout, sidebar, all content sections, and code blocks are React
        Server Components -- they ship zero JavaScript to the browser for styling.
      </Paragraph>

      <Paragraph>
        Only the interactive parts -- the theme toggle, copy buttons, mobile navigation, and the
        example demos below -- are client components. Everything else is rendered on the server with
        Seams' <InlineCode>styled()</InlineCode>, <InlineCode>css()</InlineCode>, and{" "}
        <InlineCode>globalCss()</InlineCode> functions, and the CSS is collected via{" "}
        <InlineCode>getCssText()</InlineCode> into a single <InlineCode>{"<style>"}</InlineCode> tag
        in the document head.
      </Paragraph>

      <SubHeading>Server components on this page</SubHeading>
      <Paragraph>
        These components use Seams for styling but ship no JavaScript to the browser. The CSS is
        extracted at render time and included in the initial HTML.
      </Paragraph>
      <ComponentList>
        {serverComponents.map((name) => (
          <ComponentRow key={name}>
            <Badge kind="server">Server</Badge>
            <ComponentName>{name}</ComponentName>
          </ComponentRow>
        ))}
      </ComponentList>

      <SubHeading>Client components on this page</SubHeading>
      <Paragraph>
        These components need browser interactivity (state, event handlers, DOM APIs) and are marked
        with <InlineCode>{"'use client'"}</InlineCode>. Seams handles their styles via runtime DOM
        injection -- the same API, just a different delivery mechanism.
      </Paragraph>
      <ComponentList>
        {clientComponents.map((name) => (
          <ComponentRow key={name}>
            <Badge kind="client">Client</Badge>
            <ComponentName>{name}</ComponentName>
          </ComponentRow>
        ))}
      </ComponentList>

      <SubHeading>CSS output</SubHeading>
      <Paragraph>
        All server-side CSS is collected into a single string via{" "}
        <InlineCode>getCssText()</InlineCode> and injected as a <InlineCode>{"<style>"}</InlineCode>{" "}
        tag in the document head. This is the total CSS footprint for the server-rendered portion of
        this page:
      </Paragraph>
      <StatBox>
        <Stat>
          <StatValue>{cssSizeKb} KB</StatValue>
          <StatLabel>Server CSS output</StatLabel>
        </Stat>
        <Stat>
          <StatValue>{serverComponents.length}</StatValue>
          <StatLabel>Server components</StatLabel>
        </Stat>
        <Stat>
          <StatValue>{clientComponents.length}</StatValue>
          <StatLabel>Client components</StatLabel>
        </Stat>
      </StatBox>
    </Section>
  );
}
