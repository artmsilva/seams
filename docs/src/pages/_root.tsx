import type { ReactNode } from "react";
import { applyGlobalStyles } from "../globalStyles";

// Apply global styles at module scope so they're collected in the sheet.
// Styled components co-render all CSS via React 19 <style href precedence>.
applyGlobalStyles();

export default async function RootElement({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};
