import type { Metadata } from "next";
import { applyGlobalStyles } from "@/globalStyles";

export const metadata: Metadata = {
  title: "Stitches RSC - Next.js Example",
  description: "Stitches RSC API showcase with Next.js App Router",
};

applyGlobalStyles();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
