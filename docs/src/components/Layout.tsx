import type { ReactNode } from "react";
import { Row, Box } from "../ds";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

export function Layout({ children }: { children: ReactNode }) {
  const sidebar = <Sidebar />;

  return (
    <Row css={{ minHeight: "100vh" }} align="stretch">
      <MobileNav sidebar={sidebar} />
      <Box
        as="main"
        css={{
          flex: 1,
          marginLeft: "260px",
          minWidth: 0,
          "@media (max-width: 767px)": {
            marginLeft: 0,
          },
        }}
      >
        {children}
      </Box>
    </Row>
  );
}
