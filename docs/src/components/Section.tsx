import type { ReactNode } from "react";
import { styled } from "../seams.config";

const SectionWrapper = styled("section", {
  padding: "$8 $7",
  borderBottom: "1px solid $borderSubtle",
  maxWidth: "840px",
  transition: "border-color 0.2s ease",

  "&:last-child": {
    borderBottom: "none",
  },

  "@media (max-width: 767px)": {
    padding: "$7 $4",
  },
});

const SectionHeading = styled("h2", {
  fontSize: "$3xl",
  fontWeight: "$bold",
  color: "$text",
  marginBottom: "$6",
  lineHeight: "$tight",
  transition: "color 0.2s ease",

  "@media (max-width: 767px)": {
    fontSize: "$2xl",
  },
});

const SubHeading = styled("h3", {
  fontSize: "$xl",
  fontWeight: "$semibold",
  color: "$text",
  marginTop: "$7",
  marginBottom: "$3",
  transition: "color 0.2s ease",
});

const Paragraph = styled("p", {
  fontSize: "$base",
  lineHeight: "$relaxed",
  color: "$textSecondary",
  marginBottom: "$4",
  maxWidth: "680px",
  transition: "color 0.2s ease",
});

const InlineCode = styled("code", {
  fontFamily: "$mono",
  fontSize: "$sm",
  backgroundColor: "$bgMuted",
  color: "$brand",
  padding: "2px 6px",
  borderRadius: "$sm",
  transition: "background-color 0.2s ease, color 0.2s ease",
});

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <SectionWrapper id={id}>
      <SectionHeading>{title}</SectionHeading>
      {children}
    </SectionWrapper>
  );
}

export { SubHeading, Paragraph, InlineCode };
