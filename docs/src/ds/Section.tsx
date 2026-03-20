import type { ComponentProps, ReactNode } from "react";
import { Box } from "./Box";
import { Heading } from "./Heading";

type SectionProps = {
  id?: string;
  title?: string;
  level?: ComponentProps<typeof Heading>["level"];
  children: ReactNode;
};

export function Section({ id, title, level = 2, children }: SectionProps) {
  return (
    <Box as="section" id={id} py={8}>
      {title && (
        <Heading level={level} id={id}>
          {title}
        </Heading>
      )}
      {children}
    </Box>
  );
}
