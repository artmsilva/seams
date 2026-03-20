import { createStitches } from "@stitches-rsc/react";

export const { styled, css, globalCss, keyframes, createTheme, theme, getCssText } = createStitches(
  {
    prefix: "demo",
    theme: {
      colors: {
        primary: "#0070f3",
        secondary: "#7928ca",
        background: "#ffffff",
        text: "#111111",
        muted: "#666666",
      },
      space: {
        1: "4px",
        2: "8px",
        3: "16px",
        4: "32px",
      },
      fonts: {
        body: "system-ui, -apple-system, sans-serif",
        heading: "Georgia, serif",
      },
      radii: {
        sm: "4px",
        md: "8px",
        lg: "16px",
      },
    },
  },
);
