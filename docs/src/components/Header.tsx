import { styled } from "../seams.config";
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

const HeaderActions = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$3",
});

const GitHubLink = styled("a", {
  display: "flex",
  alignItems: "center",
  gap: "$2",
  fontSize: "$sm",
  fontWeight: "$medium",
  color: "$textSecondary",
  textDecoration: "none",
  padding: "$1 $3",
  borderRadius: "$md",
  transition: "color 0.15s ease, background-color 0.15s ease",

  "&:hover": {
    color: "$text",
    backgroundColor: "$bgMuted",
  },
});

const VersionBadge = styled("span", {
  fontSize: "$xs",
  fontWeight: "$medium",
  color: "$brand",
  backgroundColor: "$bgMuted",
  padding: "$1 $2",
  borderRadius: "$pill",
  border: "1px solid $border",
});

export function Header() {
  return (
    <HeaderBar>
      <HeaderActions>
        <VersionBadge>v0.1.0</VersionBadge>
        <GitHubLink
          href="https://github.com/artmsilva/seams"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </GitHubLink>
        <ThemeToggle />
      </HeaderActions>
    </HeaderBar>
  );
}
