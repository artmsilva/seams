import { styled } from "../seams.config";

export const Heading = styled("h2", {
  fontWeight: "$bold",
  lineHeight: "$tight",
  color: "$text",
  transition: "color 0.2s ease",
  variants: {
    level: {
      1: { fontSize: "$4xl", marginBottom: "$6" },
      2: { fontSize: "$2xl", marginBottom: "$4" },
      3: { fontSize: "$lg", marginBottom: "$3" },
    },
  },
  defaultVariants: {
    level: 2,
  },
});
