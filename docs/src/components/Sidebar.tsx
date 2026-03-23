import { styled } from "../seams.config";
import { Box, Text } from "../ds";

const LogoText = styled("span", {
  fontSize: "$2xl",
  fontWeight: "$extrabold",
  background: "linear-gradient(135deg, $brand 0%, $accent 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
});

const NavLink = styled("a", {
  display: "block",
  padding: "$2 $6",
  fontSize: "$sm",
  color: "$textSecondary",
  transition: "color 0.15s ease, background-color 0.15s ease",
  textDecoration: "none",
  borderLeft: "2px solid transparent",

  "&:hover": {
    color: "$text",
    backgroundColor: "$bgMuted",
  },
});

interface NavItem {
  label: string;
  href: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Getting Started", href: "#getting-started" },
      { label: "Installation", href: "#installation" },
      { label: "Quick Start", href: "#quick-start" },
    ],
  },
  {
    title: "API Reference",
    items: [
      { label: "createStitches", href: "#api-create-stitches" },
      { label: "styled", href: "#api-styled" },
      { label: "css", href: "#api-css" },
      { label: "globalCss", href: "#api-global-css" },
      { label: "keyframes", href: "#api-keyframes" },
      { label: "createTheme", href: "#api-create-theme" },
      { label: "getCssText", href: "#api-get-css-text" },
      { label: "Composition", href: "#composition" },
      { label: "Atomic CSS", href: "#atomic-css" },
    ],
  },
  {
    title: "Guides",
    items: [
      { label: "Theming", href: "#theming" },
      { label: "Build Plugins", href: "#plugins" },
      { label: "Lit Integration", href: "#lit-integration" },
      { label: "React Server Components", href: "#rsc" },
    ],
  },
  {
    title: "More",
    items: [{ label: "Examples", href: "#examples" }],
  },
];

export function Sidebar() {
  return (
    <Box as="nav" py={6}>
      <Box
        css={{
          padding: "0 $6 $6",
          borderBottom: "1px solid $border",
          marginBottom: "$4",
        }}
      >
        <LogoText>Seams</LogoText>
        <Text as="p" size="xs" color="muted" css={{ marginTop: "$1" }}>
          CSS-in-JS for RSC
        </Text>
      </Box>
      {navSections.map((section) => (
        <div key={section.title}>
          <Text
            size="xs"
            weight="semibold"
            color="muted"
            css={{
              display: "block",
              padding: "$2 $6",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {section.title}
          </Text>
          {section.items.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </div>
      ))}
    </Box>
  );
}
