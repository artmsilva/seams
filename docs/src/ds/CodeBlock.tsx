import { styled } from "../seams.config";
import { CopyButton } from "../components/CopyButton";

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
  return (
    <Wrapper>
      {label && <Label>{label}</Label>}
      <CopyButton text={children} />
      <Pre>
        <Code>{children.trim()}</Code>
      </Pre>
    </Wrapper>
  );
}
