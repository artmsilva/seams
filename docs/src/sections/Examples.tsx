import { useState } from "react";
import { styled, keyframes } from "../seams.config";
import { Section, SubHeading, Paragraph } from "../components/Section";

const DemoArea = styled("div", {
  padding: "$6",
  borderRadius: "$lg",
  border: "1px solid $border",
  backgroundColor: "$bgSubtle",
  marginBottom: "$4",
  transition: "background-color 0.2s ease, border-color 0.2s ease",
});

const DemoRow = styled("div", {
  display: "flex",
  gap: "$3",
  flexWrap: "wrap",
  alignItems: "center",
  marginBottom: "$4",

  "&:last-child": {
    marginBottom: 0,
  },
});

const DemoLabel = styled("span", {
  fontSize: "$sm",
  fontWeight: "$medium",
  color: "$textMuted",
  minWidth: "100px",
  transition: "color 0.2s ease",
});

// Interactive Button component using Seams
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

// Animated component
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

// Variant toggle controls
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

const RepoLink = styled("a", {
  display: "inline-flex",
  alignItems: "center",
  gap: "$2",
  padding: "$3 $5",
  borderRadius: "$md",
  border: "1px solid $border",
  fontSize: "$sm",
  fontWeight: "$medium",
  color: "$textSecondary",
  textDecoration: "none",
  transition: "color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease",

  "&:hover": {
    color: "$text",
    borderColor: "$textMuted",
    backgroundColor: "$bgMuted",
  },
});

const LinkRow = styled("div", {
  display: "flex",
  gap: "$3",
  marginTop: "$6",
  flexWrap: "wrap",
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
    <Section id="examples" title="Examples">
      <Paragraph>
        These interactive demos are built with Seams -- the same library powering all the styles on
        this documentation site.
      </Paragraph>

      <SubHeading>Button with variant toggles</SubHeading>
      <Paragraph>
        Toggle size and color variants to see how Seams handles variant composition. The compound
        variant (large + brand) applies bold uppercase styling.
      </Paragraph>
      <DemoArea>
        <DemoRow>
          <DemoLabel>Size</DemoLabel>
          <ToggleGroup>
            {sizes.map((s) => (
              <ToggleButton key={s} active={size === s} onClick={() => setSize(s)}>
                {s}
              </ToggleButton>
            ))}
          </ToggleGroup>
        </DemoRow>
        <DemoRow>
          <DemoLabel>Color</DemoLabel>
          <ToggleGroup>
            {colors.map((c) => (
              <ToggleButton key={c} active={color === c} onClick={() => setColor(c)}>
                {c}
              </ToggleButton>
            ))}
          </ToggleGroup>
        </DemoRow>
        <DemoRow>
          <DemoLabel>Result</DemoLabel>
          <DemoButton size={size} color={color}>
            Styled Button
          </DemoButton>
        </DemoRow>
      </DemoArea>

      <SubHeading>Keyframe animation</SubHeading>
      <Paragraph>
        Click replay to trigger the fade-slide animation. This uses <code>keyframes()</code> from
        Seams.
      </Paragraph>
      <DemoArea>
        <DemoRow>
          <DemoButton size="sm" color="accent" onClick={() => setAnimKey((k) => k + 1)}>
            Replay animation
          </DemoButton>
        </DemoRow>
        <AnimatedCard key={animKey}>
          This card animates in with a fade + slide transition defined entirely in Seams.
        </AnimatedCard>
      </DemoArea>

      <SubHeading>Starter templates</SubHeading>
      <Paragraph>
        Explore the example projects in the repository for complete starter setups.
      </Paragraph>
      <LinkRow>
        <RepoLink
          href="https://github.com/artmsilva/seams/tree/main/examples/with-vite"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vite + React example
        </RepoLink>
        <RepoLink
          href="https://github.com/artmsilva/seams/tree/main/examples/with-nextjs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Next.js example
        </RepoLink>
      </LinkRow>
    </Section>
  );
}
