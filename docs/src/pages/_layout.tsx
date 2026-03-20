import type { ReactNode } from "react";
import { Layout } from "../components/Layout";
import { Header } from "../components/Header";

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <title>Seams - Zero-runtime CSS-in-JS for React Server Components</title>
      <meta
        name="description"
        content="Zero-runtime CSS-in-JS for React Server Components, inspired by Stitches.js"
      />
      <Layout>
        <Header />
        {children}
      </Layout>
    </>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};
