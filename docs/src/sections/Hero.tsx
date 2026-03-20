import { useState } from "react";
import { styled, keyframes } from "../seams.config";

const fadeUp = keyframes({
  from: { opacity: 0, transform: "translateY(20px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

const HeroSection = styled("section", {
  position: "relative",
  padding: "$8 $7",
  overflow: "hidden",

  "@media (max-width: 767px)": {
    padding: "$7 $4",
  },
});

const GradientBg = styled("div", {
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(0, 102, 255, 0.15) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 50%, rgba(124, 58, 237, 0.1) 0%, transparent 60%)",
  pointerEvents: "none",
  transition: "opacity 0.3s ease",
});

const HeroContent = styled("div", {
  position: "relative",
  maxWidth: "680px",
  animation: `${fadeUp} 0.6s ease-out both`,
});

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

const Tagline = styled("p", {
  fontSize: "$xl",
  color: "$textSecondary",
  lineHeight: "$relaxed",
  marginBottom: "$7",
  maxWidth: "560px",
  transition: "color 0.2s ease",

  "@media (max-width: 767px)": {
    fontSize: "$lg",
  },
});

const InstallBox = styled("div", {
  display: "inline-flex",
  alignItems: "center",
  gap: "$3",
  backgroundColor: "$codeBg",
  border: "1px solid $border",
  borderRadius: "$lg",
  padding: "$3 $5",
  fontFamily: "$mono",
  fontSize: "$sm",
  color: "$codeText",
  transition: "background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease",
});

const InstallPrefix = styled("span", {
  color: "$textMuted",
  userSelect: "none",
});

const CopyBtn = styled("button", {
  padding: "$1 $2",
  fontSize: "$xs",
  fontFamily: "$mono",
  fontWeight: "$medium",
  color: "$textMuted",
  backgroundColor: "transparent",
  border: "1px solid $border",
  borderRadius: "$sm",
  cursor: "pointer",
  transition: "color 0.15s ease, border-color 0.15s ease",

  "&:hover": {
    color: "$text",
    borderColor: "$textMuted",
  },
});

const FeatureRow = styled("div", {
  display: "flex",
  gap: "$5",
  marginTop: "$7",
  flexWrap: "wrap",
});

const Feature = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$2",
  fontSize: "$sm",
  color: "$textSecondary",
  transition: "color 0.2s ease",
});

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
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <HeroSection id="hero">
      <GradientBg />
      <HeroContent>
        <Title>Seams</Title>
        <Tagline>
          Zero-runtime CSS-in-JS for React Server Components. Build-time extraction, CSS layers for
          cascade control, and scoped styles — with the Stitches API you already know.
        </Tagline>
        <InstallBox>
          <InstallPrefix>$</InstallPrefix>
          <span>{installCommand}</span>
          <CopyBtn onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</CopyBtn>
        </InstallBox>
        <FeatureRow>
          <Feature>
            <FeatureDot color="brand" />
            Zero runtime overhead
          </Feature>
          <Feature>
            <FeatureDot color="accent" />
            RSC compatible
          </Feature>
          <Feature>
            <FeatureDot color="success" />
            Stitches API compatible
          </Feature>
        </FeatureRow>
      </HeroContent>
    </HeroSection>
  );
}
