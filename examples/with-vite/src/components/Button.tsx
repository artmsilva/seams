import { styled } from "../stitches.config";

/**
 * Demonstrates: styled() with variants, compound variants, and default variants.
 */
export const Button = styled("button", {
  border: "none",
  borderRadius: "$md",
  fontFamily: "$body",
  fontWeight: 500,
  cursor: "pointer",
  transition: "opacity 0.2s, transform 0.1s",

  "&:hover": {
    opacity: 0.9,
  },

  "&:active": {
    transform: "scale(0.97)",
  },

  variants: {
    size: {
      small: {
        padding: "$1 $2",
        fontSize: "13px",
      },
      medium: {
        padding: "$2 $3",
        fontSize: "15px",
      },
      large: {
        padding: "$3 $4",
        fontSize: "17px",
      },
    },
    color: {
      primary: {
        backgroundColor: "$primary",
        color: "white",
      },
      secondary: {
        backgroundColor: "$secondary",
        color: "white",
      },
    },
  },

  compoundVariants: [
    {
      size: "large",
      color: "primary",
      css: {
        fontWeight: 800,
        letterSpacing: "0.5px",
        textTransform: "uppercase",
      },
    },
  ],

  defaultVariants: {
    size: "medium",
    color: "primary",
  },
});
