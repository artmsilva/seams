import { getCssText } from "../seams.config";
import { Badge, Card, Row, Text, Stack } from "../ds";
import { Section, SubHeading, Paragraph, InlineCode } from "../components/Section";

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
      <Stack gap={3} css={{ marginTop: "$4", marginBottom: "$6" }}>
        {serverComponents.map((name) => (
          <Card
            key={name}
            padding="sm"
            css={{
              display: "flex",
              alignItems: "center",
              gap: "$3",
              padding: "$3 $5",
              borderColor: "$borderSubtle",
            }}
          >
            <Badge color="success" size="sm">
              Server
            </Badge>
            <Text mono size="sm">
              {name}
            </Text>
          </Card>
        ))}
      </Stack>

      <SubHeading>Client components on this page</SubHeading>
      <Paragraph>
        These components need browser interactivity (state, event handlers, DOM APIs) and are marked
        with <InlineCode>{"'use client'"}</InlineCode>. Seams handles their styles via runtime DOM
        injection -- the same API, just a different delivery mechanism.
      </Paragraph>
      <Stack gap={3} css={{ marginTop: "$4", marginBottom: "$6" }}>
        {clientComponents.map((name) => (
          <Card
            key={name}
            padding="sm"
            css={{
              display: "flex",
              alignItems: "center",
              gap: "$3",
              padding: "$3 $5",
              borderColor: "$borderSubtle",
            }}
          >
            <Badge color="accent" size="sm">
              Client
            </Badge>
            <Text mono size="sm">
              {name}
            </Text>
          </Card>
        ))}
      </Stack>

      <SubHeading>CSS output</SubHeading>
      <Paragraph>
        All server-side CSS is collected into a single string via{" "}
        <InlineCode>getCssText()</InlineCode> and injected as a <InlineCode>{"<style>"}</InlineCode>{" "}
        tag in the document head. This is the total CSS footprint for the server-rendered portion of
        this page:
      </Paragraph>
      <Row gap={5} wrap css={{ marginTop: "$4" }}>
        <Card padding="md" css={{ minWidth: "160px" }}>
          <Text
            size="2xl"
            weight="bold"
            color="brand"
            css={{ display: "block", marginBottom: "$1" }}
          >
            {cssSizeKb} KB
          </Text>
          <Text size="sm" color="muted">
            Server CSS output
          </Text>
        </Card>
        <Card padding="md" css={{ minWidth: "160px" }}>
          <Text
            size="2xl"
            weight="bold"
            color="brand"
            css={{ display: "block", marginBottom: "$1" }}
          >
            {serverComponents.length}
          </Text>
          <Text size="sm" color="muted">
            Server components
          </Text>
        </Card>
        <Card padding="md" css={{ minWidth: "160px" }}>
          <Text
            size="2xl"
            weight="bold"
            color="brand"
            css={{ display: "block", marginBottom: "$1" }}
          >
            {clientComponents.length}
          </Text>
          <Text size="sm" color="muted">
            Client components
          </Text>
        </Card>
      </Row>
    </Section>
  );
}
