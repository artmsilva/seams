import { styled } from "../seams.config";

export const Text = styled("span", {
  variants: {
    size: {
      xs: { fontSize: "$xs" },
      sm: { fontSize: "$sm" },
      base: { fontSize: "$base" },
      lg: { fontSize: "$lg" },
      xl: { fontSize: "$xl" },
      "2xl": { fontSize: "$2xl" },
      "3xl": { fontSize: "$3xl" },
      "4xl": { fontSize: "$4xl" },
      "5xl": { fontSize: "$5xl" },
    },
    weight: {
      normal: { fontWeight: "$normal" },
      medium: { fontWeight: "$medium" },
      semibold: { fontWeight: "$semibold" },
      bold: { fontWeight: "$bold" },
      extrabold: { fontWeight: "$extrabold" },
    },
    color: {
      default: { color: "$text" },
      secondary: { color: "$textSecondary" },
      muted: { color: "$textMuted" },
      brand: { color: "$brand" },
      accent: { color: "$accent" },
      success: { color: "$success" },
      warning: { color: "$warning" },
      error: { color: "$error" },
    },
    mono: {
      true: { fontFamily: "$mono" },
    },
    align: {
      left: { textAlign: "left" },
      center: { textAlign: "center" },
      right: { textAlign: "right" },
    },
    leading: {
      tight: { lineHeight: "$tight" },
      normal: { lineHeight: "$normal" },
      relaxed: { lineHeight: "$relaxed" },
    },
  },
  defaultVariants: {
    size: "base",
    color: "default",
  },
});
