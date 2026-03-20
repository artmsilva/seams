import type { ReactNode } from "react";
import { styled } from "../seams.config";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

const LayoutRoot = styled("div", {
  display: "flex",
  minHeight: "100vh",
});

const MainContent = styled("main", {
  flex: 1,
  marginLeft: "260px",
  minWidth: 0,

  "@media (max-width: 767px)": {
    marginLeft: 0,
  },
});

export function Layout({ children }: { children: ReactNode }) {
  const sidebar = <Sidebar />;

  return (
    <LayoutRoot>
      <MobileNav sidebar={sidebar} />
      <MainContent>{children}</MainContent>
    </LayoutRoot>
  );
}
