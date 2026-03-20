import { styled } from "../seams.config";

export const Badge = styled("span", {
  display: "inline-flex",
  alignItems: "center",
  fontFamily: "$mono",
  fontWeight: "$medium",
  borderRadius: "$pill",
  variants: {
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
      warning: {
        backgroundColor: "$warning",
        color: "black",
      },
      muted: {
        backgroundColor: "$bgMuted",
        color: "$textSecondary",
      },
    },
    size: {
      sm: { fontSize: "$xs", padding: "$1 $2" },
      md: { fontSize: "$sm", padding: "$1 $3" },
    },
  },
  defaultVariants: {
    color: "brand",
    size: "sm",
  },
});
