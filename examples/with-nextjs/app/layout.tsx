import type { Metadata } from "next";
import { applyGlobalStyles } from "@/globalStyles";

export const metadata: Metadata = {
  title: "Seams - Next.js Example",
  description: "Seams API showcase with Next.js App Router",
};

applyGlobalStyles();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
