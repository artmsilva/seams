import { styled } from "../seams.config";

export const Container = styled("div", {
  width: "100%",
  mx: "auto",
  variants: {
    size: {
      sm: { maxWidth: "640px" },
      md: { maxWidth: "768px" },
      lg: { maxWidth: "1024px" },
    },
  },
});
