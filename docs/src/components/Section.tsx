import type { ReactNode } from "react";
import { styled } from "../seams.config";
import { Box, Heading, Text } from "../ds";

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
    <Box
      as="section"
      id={id}
      py={8}
      px={7}
      css={{
        borderBottom: "1px solid $borderSubtle",
        maxWidth: "840px",
        transition: "border-color 0.2s ease",
        "&:last-child": { borderBottom: "none" },
        "@media (max-width: 767px)": { padding: "$7 $4" },
      }}
    >
      <Heading
        level={2}
        css={{
          fontSize: "$3xl",
          marginBottom: "$6",
          "@media (max-width: 767px)": { fontSize: "$2xl" },
        }}
      >
        {title}
      </Heading>
      {children}
    </Box>
  );
}

export const SubHeading = styled("h3", {
  fontSize: "$xl",
  fontWeight: "$semibold",
  color: "$text",
  marginTop: "$7",
  marginBottom: "$3",
  transition: "color 0.2s ease",
});

export const Paragraph = styled("p", {
  fontSize: "$base",
  lineHeight: "$relaxed",
  color: "$textSecondary",
  marginBottom: "$4",
  maxWidth: "680px",
  transition: "color 0.2s ease",
});

export const InlineCode = styled("code", {
  fontFamily: "$mono",
  fontSize: "$sm",
  backgroundColor: "$bgMuted",
  color: "$brand",
  padding: "2px 6px",
  borderRadius: "$sm",
  transition: "background-color 0.2s ease, color 0.2s ease",
});
