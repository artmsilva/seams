import { styled, keyframes } from "../stitches.config";

/**
 * Demonstrates: keyframes() for CSS animations applied via styled().
 */
const fadeIn = keyframes({
  from: { opacity: 0, transform: "translateY(8px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

export const FadeIn = styled("div", {
  animation: `${fadeIn} 0.6s ease-out both`,
});
