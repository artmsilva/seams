"use client";

import { useState, useEffect } from "react";
import { styled } from "../seams.config";
import { lightTheme } from "../seams.config";

const ToggleBtn = styled("button", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "36px",
  height: "36px",
  borderRadius: "$md",
  border: "1px solid $border",
  backgroundColor: "transparent",
  color: "$textSecondary",
  fontSize: "$lg",
  cursor: "pointer",
  transition: "color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease",

  "&:hover": {
    color: "$text",
    borderColor: "$textMuted",
    backgroundColor: "$bgMuted",
  },
});

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove(lightTheme.className);
    } else {
      root.classList.add(lightTheme.className);
    }
  }, [isDark]);

  return (
    <ToggleBtn onClick={() => setIsDark((prev) => !prev)} aria-label="Toggle theme">
      {isDark ? "\u2600" : "\u263E"}
    </ToggleBtn>
  );
}
