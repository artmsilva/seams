import { styled } from "../seams.config";

export const Divider = styled("hr", {
  border: "none",
  height: "1px",
  backgroundColor: "$border",
  variants: {
    spacing: {
      sm: { my: "$3" },
      md: { my: "$6" },
      lg: { my: "$8" },
    },
  },
  defaultVariants: {
    spacing: "md",
  },
});
