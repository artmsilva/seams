import { styled } from "../seams.config";
import { Row, Badge, Link } from "../ds";
import { ThemeToggle } from "./ThemeToggle";

const HeaderBar = styled("header", {
  position: "sticky",
  top: 0,
  zIndex: 5,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "$4",
  padding: "$3 $7",
  backgroundColor: "$bgSubtle",
  borderBottom: "1px solid $border",
  backdropFilter: "blur(8px)",
  transition: "background-color 0.2s ease",

  "@media (max-width: 767px)": {
    padding: "$3 $4",
  },
});

export function Header() {
  return (
    <HeaderBar>
      <Row gap={3}>
        <Badge color="muted" size="sm" css={{ border: "1px solid $border", color: "$brand" }}>
          v0.1.0
        </Badge>
        <Link
          style="nav"
          href="https://github.com/artmsilva/seams"
          target="_blank"
          rel="noopener noreferrer"
          css={{
            fontSize: "$sm",
            fontWeight: "$medium",
          }}
        >
          GitHub
        </Link>
        <ThemeToggle />
      </Row>
    </HeaderBar>
  );
}
