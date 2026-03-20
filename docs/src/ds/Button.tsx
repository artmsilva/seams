import { styled } from "../seams.config";

export const Button = styled("button", {
  border: "none",
  fontFamily: "$body",
  fontWeight: "$medium",
  cursor: "pointer",
  borderRadius: "$md",
  transition: "opacity 0.2s, transform 0.1s, background-color 0.2s",
  "&:hover": { opacity: 0.9 },
  "&:active": { transform: "scale(0.97)" },
  variants: {
    size: {
      sm: { fontSize: "$sm", padding: "$1 $3" },
      md: { fontSize: "$base", padding: "$2 $5" },
      lg: { fontSize: "$lg", padding: "$3 $6" },
    },
    color: {
      brand: {
        backgroundColor: "$brand",
        color: "white",
        "&:hover": { backgroundColor: "$brandLight" },
      },
      accent: {
        backgroundColor: "$accent",
        color: "white",
        "&:hover": { backgroundColor: "$accentLight" },
      },
      success: {
        backgroundColor: "$success",
        color: "white",
      },
      outline: {
        backgroundColor: "transparent",
        color: "$text",
        border: "1px solid $border",
        "&:hover": { borderColor: "$textMuted", backgroundColor: "$bgMuted" },
      },
      ghost: {
        backgroundColor: "transparent",
        color: "$textSecondary",
        "&:hover": { backgroundColor: "$bgMuted", color: "$text" },
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
