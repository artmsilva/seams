import { globalCss } from "./stitches.config";

export const applyGlobalStyles = globalCss({
  "*, *::before, *::after": {
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
  },
  body: {
    fontFamily: "$body",
    backgroundColor: "$background",
    color: "$text",
    lineHeight: 1.6,
    transition: "background-color 0.3s, color 0.3s",
  },
});
