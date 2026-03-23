import { styled, keyframes } from "../seams.config";
import { Text, Row, Card } from "../ds";
import { CopyButton } from "../components/CopyButton";

const fadeUp = keyframes({
  from: { opacity: 0, transform: "translateY(20px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

// Page-specific: unique gradient background
const HeroSection = styled("section", {
  position: "relative",
  padding: "$8 $7",
  overflow: "hidden",

  "@media (max-width: 767px)": {
    padding: "$7 $4",
  },
});

// Page-specific: unique radial gradient
const GradientBg = styled("div", {
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(0, 102, 255, 0.15) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 50%, rgba(124, 58, 237, 0.1) 0%, transparent 60%)",
  pointerEvents: "none",
  transition: "opacity 0.3s ease",
});

// Page-specific: gradient text title
const Title = styled("h1", {
  fontSize: "$5xl",
  fontWeight: "$extrabold",
  lineHeight: "1.1",
  marginBottom: "$4",
  background: "linear-gradient(135deg, $brand 0%, $accent 50%, $brand 100%)",
  backgroundSize: "200% auto",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",

  "@media (max-width: 767px)": {
    fontSize: "$4xl",
  },
});

// Page-specific: colored dot indicator
const FeatureDot = styled("span", {
  width: "6px",
  height: "6px",
  borderRadius: "$pill",
  flexShrink: 0,

  variants: {
    color: {
      brand: { backgroundColor: "$brand" },
      accent: { backgroundColor: "$accent" },
      success: { backgroundColor: "$success" },
    },
  },
});

const installCommand = "npm install @artmsilva/seams-react";

export function Hero() {
  return (
    <HeroSection id="hero">
      <GradientBg />
      <div
        style={{
          position: "relative",
          maxWidth: "680px",
          animation: `${fadeUp} 0.6s ease-out both`,
        }}
      >
        <Title>Seams</Title>
        <Text
          as="p"
          size="xl"
          color="secondary"
          leading="relaxed"
          css={{
            marginBottom: "$7",
            maxWidth: "560px",
            "@media (max-width: 767px)": { fontSize: "$lg" },
          }}
        >
          Zero-runtime CSS-in-JS for React Server Components. Build-time extraction, CSS layers for
          cascade control, and scoped styles — with the Stitches API you already know.
        </Text>
        <Card
          bg="code"
          padding="sm"
          css={{
            display: "inline-flex",
            position: "relative",
            alignItems: "center",
            gap: "$3",
            fontFamily: "$mono",
            fontSize: "$sm",
            color: "$codeText",
            padding: "$3 $5",
          }}
        >
          <Text color="muted" css={{ userSelect: "none" }}>
            $
          </Text>
          <span>{installCommand}</span>
          <CopyButton text={installCommand} />
        </Card>
        <Row gap={5} wrap css={{ marginTop: "$7" }}>
          <Row gap={2}>
            <FeatureDot color="brand" />
            <Text size="sm" color="secondary">
              Zero runtime overhead
            </Text>
          </Row>
          <Row gap={2}>
            <FeatureDot color="accent" />
            <Text size="sm" color="secondary">
              RSC compatible
            </Text>
          </Row>
          <Row gap={2}>
            <FeatureDot color="success" />
            <Text size="sm" color="secondary">
              Stitches API compatible
            </Text>
          </Row>
          <Row gap={2}>
            <FeatureDot color="brand" />
            <Text size="sm" color="secondary">
              Atomic CSS mode
            </Text>
          </Row>
        </Row>
      </div>
    </HeroSection>
  );
}
