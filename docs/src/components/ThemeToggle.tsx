"use client";

import { useState, useEffect } from "react";
import { lightTheme } from "../seams.config";
import { Button } from "../ds";

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
    <Button
      color="ghost"
      size="sm"
      onClick={() => setIsDark((prev) => !prev)}
      aria-label="Toggle theme"
      css={{
        width: "36px",
        height: "36px",
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "$lg",
        border: "1px solid $border",
      }}
    >
      {isDark ? "\u2600" : "\u263E"}
    </Button>
  );
}
