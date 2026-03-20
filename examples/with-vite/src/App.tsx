import { useState } from "react";
import { styled } from "./stitches.config";
import { applyGlobalStyles } from "./globalStyles";
import { darkTheme } from "./themes";

import { Button } from "./components/Button";
import { Badge } from "./components/Badge";
import { FadeIn } from "./components/FadeIn";

// Apply global reset styles
applyGlobalStyles();

const Container = styled("div", {
  maxWidth: "720px",
  margin: "0 auto",
  padding: "$4",
});

const Section = styled("section", {
  marginBottom: "$4",
});

const Heading = styled("h2", {
  fontFamily: "$heading",
  fontSize: "24px",
  marginBottom: "$3",
  color: "$text",
});

const Row = styled("div", {
  display: "flex",
  gap: "$2",
  flexWrap: "wrap",
  alignItems: "center",
});

const Label = styled("span", {
  fontFamily: "$body",
  fontSize: "13px",
  color: "$muted",
  minWidth: "80px",
});

/**
 * Demonstrates: dynamic css prop with runtime-controlled values.
 */
const DynamicBox = styled("div", {
  backgroundColor: "$primary",
  color: "white",
  borderRadius: "$md",
  fontFamily: "$body",
  fontSize: "14px",
  transition: "padding 0.3s ease",
});

function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <Button color="secondary" size="small" onClick={onToggle}>
      {isDark ? "Light mode" : "Dark mode"}
    </Button>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [padding, setPadding] = useState(16);

  return (
    <div className={isDark ? darkTheme.className : undefined}>
      <Container>
        <Section>
          <Row css={{ justifyContent: "space-between", marginBottom: "$3" }}>
            <Heading css={{ marginBottom: 0 }}>Stitches RSC + Vite</Heading>
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark((prev) => !prev)} />
          </Row>
        </Section>

        {/* styled() with variants */}
        <Section>
          <Heading>Button variants</Heading>
          <Row css={{ marginBottom: "$2" }}>
            <Label>Size:</Label>
            <Button size="small">Small</Button>
            <Button size="medium">Medium</Button>
            <Button size="large">Large</Button>
          </Row>
          <Row css={{ marginBottom: "$2" }}>
            <Label>Color:</Label>
            <Button color="primary">Primary</Button>
            <Button color="secondary">Secondary</Button>
          </Row>
          <Row>
            <Label>Compound:</Label>
            <Button size="large" color="primary">
              Large + Primary (bold)
            </Button>
          </Row>
        </Section>

        {/* css() standalone */}
        <Section>
          <Heading>Badge (css function)</Heading>
          <Row>
            <Badge>New</Badge>
            <Badge>Featured</Badge>
            <Badge>Beta</Badge>
          </Row>
        </Section>

        {/* keyframes */}
        <Section>
          <Heading>FadeIn animation</Heading>
          <FadeIn key={isDark ? "dark" : "light"}>
            This content fades in using a keyframes animation. Toggle the theme to replay it.
          </FadeIn>
        </Section>

        {/* Dynamic css prop */}
        <Section>
          <Heading>Dynamic css prop</Heading>
          <Row css={{ marginBottom: "$2" }}>
            <label htmlFor="padding-slider">Padding: {padding}px</label>
            <input
              id="padding-slider"
              type="range"
              min={4}
              max={48}
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
            />
          </Row>
          <DynamicBox css={{ padding: `${padding}px` }}>
            This box has runtime-controlled padding via the css prop.
          </DynamicBox>
        </Section>
      </Container>
    </div>
  );
}
