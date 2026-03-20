import type { ReactNode } from "react";
import { applyGlobalStyles } from "../globalStyles";
import { getCssText } from "../seams.config";

// Apply global styles at module scope so they're always collected
applyGlobalStyles();

/**
 * Renders a <style> tag containing all Seams CSS collected during
 * server rendering. This component must be placed AFTER children
 * in the tree so that all styled() components have been invoked
 * and their CSS registered in the sheet before getCssText() runs.
 */
function SeamsStyles() {
  const css = getCssText();
  return <style id="seams-ssr" dangerouslySetInnerHTML={{ __html: css }} />;
}

export default async function RootElement({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        {children}
        <SeamsStyles />
      </body>
    </html>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};
