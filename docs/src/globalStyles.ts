import { globalCss } from "./seams.config";

export const applyGlobalStyles = globalCss({
  "*, *::before, *::after": {
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
  },
  html: {
    scrollBehavior: "smooth",
    scrollPaddingTop: "80px",
  },
  body: {
    fontFamily: "$body",
    backgroundColor: "$bg",
    color: "$text",
    lineHeight: "$normal",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    transition: "background-color 0.2s ease, color 0.2s ease",
  },
  "code, pre": {
    fontFamily: "$mono",
  },
  a: {
    color: "$link",
    textDecoration: "none",
    transition: "color 0.15s ease",

    "&:hover": {
      color: "$linkHover",
    },
  },
  "::selection": {
    backgroundColor: "$brand",
    color: "white",
  },
  "::-webkit-scrollbar": {
    width: "8px",
    height: "8px",
  },
  "::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },
  "::-webkit-scrollbar-thumb": {
    backgroundColor: "$border",
    borderRadius: "$pill",
  },
});
