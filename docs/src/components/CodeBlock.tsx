import { useState } from "react";
import { styled } from "../seams.config";

const Wrapper = styled("div", {
  position: "relative",
  borderRadius: "$lg",
  overflow: "hidden",
  border: "1px solid $border",
  marginTop: "$3",
  marginBottom: "$4",
});

const Pre = styled("pre", {
  backgroundColor: "$codeBg",
  padding: "$5",
  overflowX: "auto",
  fontSize: "$sm",
  lineHeight: "$relaxed",
  margin: 0,
  transition: "background-color 0.2s ease",
});

const Code = styled("code", {
  fontFamily: "$mono",
  color: "$codeText",
  whiteSpace: "pre",
  transition: "color 0.2s ease",
});

const CopyButton = styled("button", {
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

  [`${Wrapper}:hover &`]: {
    opacity: 1,
  },
});

const Label = styled("div", {
  fontSize: "$xs",
  fontFamily: "$mono",
  color: "$textMuted",
  backgroundColor: "$bgMuted",
  padding: "$1 $5",
  borderBottom: "1px solid $border",
  transition: "background-color 0.2s ease, color 0.2s ease",
});

export function CodeBlock({ children, label }: { children: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(children.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Wrapper>
      {label && <Label>{label}</Label>}
      <CopyButton onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</CopyButton>
      <Pre>
        <Code>{children.trim()}</Code>
      </Pre>
    </Wrapper>
  );
}
