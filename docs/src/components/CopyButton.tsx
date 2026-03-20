"use client";

import { useState } from "react";
import { styled } from "../seams.config";

const CopyBtn = styled("button", {
  position: "absolute",
  top: "$2",
  right: "$2",
  padding: "$1 $3",
  fontSize: "$xs",
  fontFamily: "$mono",
  fontWeight: "$medium",
  color: "$textMuted",
  backgroundColor: "$bgMuted",
  border: "1px solid $border",
  borderRadius: "$md",
  cursor: "pointer",
  transition: "color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease",
  opacity: 0,

  "&:hover": {
    color: "$text",
    backgroundColor: "$bgElevated",
    borderColor: "$textMuted",
  },

  "div:hover > &": {
    opacity: 1,
  },
});

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(text.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return <CopyBtn onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</CopyBtn>;
}
