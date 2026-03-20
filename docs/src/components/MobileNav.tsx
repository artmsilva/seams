"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { styled } from "../seams.config";

const SidebarContainer = styled("aside", {
  position: "fixed",
  top: 0,
  left: 0,
  width: "260px",
  height: "100vh",
  overflowY: "auto",
  backgroundColor: "$bgSubtle",
  borderRight: "1px solid $border",
  zIndex: 10,
  transition: "transform 0.3s ease, background-color 0.2s ease",

  "@media (max-width: 767px)": {
    transform: "translateX(-100%)",
  },

  variants: {
    open: {
      true: {
        "@media (max-width: 767px)": {
          transform: "translateX(0)",
        },
      },
    },
  },
});

const Overlay = styled("div", {
  display: "none",

  "@media (max-width: 767px)": {
    display: "block",
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 9,
    opacity: 0,
    pointerEvents: "none",
    transition: "opacity 0.3s ease",
  },

  variants: {
    visible: {
      true: {
        "@media (max-width: 767px)": {
          opacity: 1,
          pointerEvents: "auto",
        },
      },
    },
  },
});

const MenuButton = styled("button", {
  display: "none",
  position: "fixed",
  bottom: "$5",
  right: "$5",
  zIndex: 20,
  width: "48px",
  height: "48px",
  borderRadius: "$pill",
  border: "none",
  backgroundColor: "$brand",
  color: "white",
  fontSize: "$xl",
  cursor: "pointer",
  boxShadow: "$lg",
  alignItems: "center",
  justifyContent: "center",
  transition: "background-color 0.15s ease",

  "&:hover": {
    backgroundColor: "$brandLight",
  },

  "@media (max-width: 767px)": {
    display: "flex",
  },
});

export function MobileNav({ sidebar }: { sidebar: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <SidebarContainer open={sidebarOpen}>{sidebar}</SidebarContainer>
      <Overlay visible={sidebarOpen} onClick={() => setSidebarOpen(false)} />
      <MenuButton onClick={() => setSidebarOpen((prev) => !prev)} aria-label="Toggle navigation">
        {sidebarOpen ? "\u2715" : "\u2630"}
      </MenuButton>
    </>
  );
}
