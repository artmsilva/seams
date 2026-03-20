import { styled } from "../seams.config";

export const Card = styled("div", {
  borderRadius: "$lg",
  border: "1px solid $border",
  transition: "background-color 0.2s ease, border-color 0.2s ease",
  variants: {
    padding: {
      sm: { padding: "$3" },
      md: { padding: "$5" },
      lg: { padding: "$7" },
    },
    bg: {
      default: { backgroundColor: "$bgSubtle" },
      elevated: { backgroundColor: "$bgElevated" },
      code: { backgroundColor: "$codeBg" },
    },
  },
  defaultVariants: {
    padding: "md",
    bg: "default",
  },
});
