"use client";

import { useState } from "react";
import { styled, keyframes } from "../seams.config";
import { Box, Heading, Text, Row, Card, Link } from "../ds";

// Page-specific: animated card with keyframe
const fadeSlideIn = keyframes({
  from: { opacity: 0, transform: "translateY(12px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

const AnimatedCard = styled("div", {
  padding: "$5",
  borderRadius: "$lg",
  backgroundColor: "$bgElevated",
  border: "1px solid $border",
  animation: `${fadeSlideIn} 0.5s ease-out both`,
  transition: "background-color 0.2s ease, border-color 0.2s ease",
});

// Page-specific: interactive button demo with custom variants
const DemoButton = styled("button", {
  border: "none",
  fontFamily: "$body",
  fontWeight: "$medium",
  cursor: "pointer",
  transition: "opacity 0.2s, transform 0.1s, background-color 0.2s",

  "&:hover": {
    opacity: 0.9,
  },

  "&:active": {
    transform: "scale(0.97)",
  },

  variants: {
    size: {
      sm: {
        padding: "$1 $3",
        fontSize: "$xs",
        borderRadius: "$sm",
      },
      md: {
        padding: "$2 $5",
        fontSize: "$sm",
        borderRadius: "$md",
      },
      lg: {
        padding: "$3 $7",
        fontSize: "$base",
        borderRadius: "$md",
      },
    },
    color: {
      brand: {
        backgroundColor: "$brand",
        color: "white",
      },
      accent: {
        backgroundColor: "$accent",
        color: "white",
      },
      success: {
        backgroundColor: "$success",
        color: "white",
      },
      outline: {
        backgroundColor: "transparent",
        color: "$brand",
        border: "2px solid $brand",
      },
    },
  },

  compoundVariants: [
    {
      size: "lg",
      color: "brand",
      css: {
        fontWeight: "$bold",
        letterSpacing: "0.5px",
        textTransform: "uppercase",
      },
    },
  ],

  defaultVariants: {
    size: "md",
    color: "brand",
  },
});

// Page-specific: toggle group for variant selector
const ToggleGroup = styled("div", {
  display: "flex",
  gap: "$1",
  backgroundColor: "$bgMuted",
  borderRadius: "$md",
  padding: "$1",
  transition: "background-color 0.2s ease",
});

const ToggleButton = styled("button", {
  padding: "$1 $3",
  fontSize: "$xs",
  fontFamily: "$body",
  fontWeight: "$medium",
  border: "none",
  borderRadius: "$sm",
  cursor: "pointer",
  transition: "background-color 0.15s ease, color 0.15s ease",
  color: "$textMuted",
  backgroundColor: "transparent",

  "&:hover": {
    color: "$text",
  },

  variants: {
    active: {
      true: {
        backgroundColor: "$brand",
        color: "white",

        "&:hover": {
          color: "white",
        },
      },
    },
  },
});

type ButtonSize = "sm" | "md" | "lg";
type ButtonColor = "brand" | "accent" | "success" | "outline";

export function Examples() {
  const [size, setSize] = useState<ButtonSize>("md");
  const [color, setColor] = useState<ButtonColor>("brand");
  const [animKey, setAnimKey] = useState(0);

  const sizes: ButtonSize[] = ["sm", "md", "lg"];
  const colors: ButtonColor[] = ["brand", "accent", "success", "outline"];

  return (
    <Box
      as="section"
      id="examples"
      py={8}
      px={7}
      css={{
        borderBottom: "1px solid $borderSubtle",
        maxWidth: "840px",
        transition: "border-color 0.2s ease",
        "@media (max-width: 767px)": { padding: "$7 $4" },
      }}
    >
      <Heading
        level={2}
        css={{
          fontSize: "$3xl",
          marginBottom: "$6",
          "@media (max-width: 767px)": { fontSize: "$2xl" },
        }}
      >
        Examples
      </Heading>
      <Text
        as="p"
        color="secondary"
        leading="relaxed"
        css={{ marginBottom: "$4", maxWidth: "680px" }}
      >
        These interactive demos are built with Seams -- the same library powering all the styles on
        this documentation site.
      </Text>

      <Heading
        level={3}
        css={{
          fontSize: "$xl",
          fontWeight: "$semibold",
          marginTop: "$7",
          marginBottom: "$3",
        }}
      >
        Button with variant toggles
      </Heading>
      <Text
        as="p"
        color="secondary"
        leading="relaxed"
        css={{ marginBottom: "$4", maxWidth: "680px" }}
      >
        Toggle size and color variants to see how Seams handles variant composition. The compound
        variant (large + brand) applies bold uppercase styling.
      </Text>
      <Card padding="md" css={{ padding: "$6", marginBottom: "$4" }}>
        <Row gap={3} wrap css={{ marginBottom: "$4" }}>
          <Text size="sm" weight="medium" color="muted" css={{ minWidth: "100px" }}>
            Size
          </Text>
          <ToggleGroup>
            {sizes.map((s) => (
              <ToggleButton key={s} active={size === s} onClick={() => setSize(s)}>
                {s}
              </ToggleButton>
            ))}
          </ToggleGroup>
        </Row>
        <Row gap={3} wrap css={{ marginBottom: "$4" }}>
          <Text size="sm" weight="medium" color="muted" css={{ minWidth: "100px" }}>
            Color
          </Text>
          <ToggleGroup>
            {colors.map((c) => (
              <ToggleButton key={c} active={color === c} onClick={() => setColor(c)}>
                {c}
              </ToggleButton>
            ))}
          </ToggleGroup>
        </Row>
        <Row gap={3} wrap>
          <Text size="sm" weight="medium" color="muted" css={{ minWidth: "100px" }}>
            Result
          </Text>
          <DemoButton size={size} color={color}>
            Styled Button
          </DemoButton>
        </Row>
      </Card>

      <Heading
        level={3}
        css={{
          fontSize: "$xl",
          fontWeight: "$semibold",
          marginTop: "$7",
          marginBottom: "$3",
        }}
      >
        Keyframe animation
      </Heading>
      <Text
        as="p"
        color="secondary"
        leading="relaxed"
        css={{ marginBottom: "$4", maxWidth: "680px" }}
      >
        Click replay to trigger the fade-slide animation. This uses <code>keyframes()</code> from
        Seams.
      </Text>
      <Card padding="md" css={{ padding: "$6", marginBottom: "$4" }}>
        <Row gap={3} wrap css={{ marginBottom: "$4" }}>
          <DemoButton size="sm" color="accent" onClick={() => setAnimKey((k) => k + 1)}>
            Replay animation
          </DemoButton>
        </Row>
        <AnimatedCard key={animKey}>
          This card animates in with a fade + slide transition defined entirely in Seams.
        </AnimatedCard>
      </Card>

      <Heading
        level={3}
        css={{
          fontSize: "$xl",
          fontWeight: "$semibold",
          marginTop: "$7",
          marginBottom: "$3",
        }}
      >
        Starter templates
      </Heading>
      <Text
        as="p"
        color="secondary"
        leading="relaxed"
        css={{ marginBottom: "$4", maxWidth: "680px" }}
      >
        Explore the example projects in the repository for complete starter setups.
      </Text>
      <Row gap={3} wrap css={{ marginTop: "$6" }}>
        <Link
          style="standalone"
          href="https://github.com/artmsilva/seams/tree/main/examples/with-vite"
          target="_blank"
          rel="noopener noreferrer"
          css={{ fontSize: "$sm" }}
        >
          Vite + React example
        </Link>
        <Link
          style="standalone"
          href="https://github.com/artmsilva/seams/tree/main/examples/with-nextjs"
          target="_blank"
          rel="noopener noreferrer"
          css={{ fontSize: "$sm" }}
        >
          Next.js example
        </Link>
      </Row>
    </Box>
  );
}
