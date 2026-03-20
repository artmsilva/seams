import { styled } from "../seams.config";

const Nav = styled("nav", {
  padding: "$6 0",
});

const LogoArea = styled("div", {
  padding: "0 $6 $6",
  borderBottom: "1px solid $border",
  marginBottom: "$4",
});

const LogoText = styled("span", {
  fontSize: "$2xl",
  fontWeight: "$extrabold",
  background: "linear-gradient(135deg, $brand 0%, $accent 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
});

const LogoTagline = styled("p", {
  fontSize: "$xs",
  color: "$textMuted",
  marginTop: "$1",
});

const SectionLabel = styled("div", {
  padding: "$2 $6",
  fontSize: "$xs",
  fontWeight: "$semibold",
  color: "$textMuted",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
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

  variants: {
    active: {
      true: {
        color: "$brand",
        borderLeftColor: "$brand",
        backgroundColor: "$bgMuted",
      },
    },
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
    ],
  },
  {
    title: "Guides",
    items: [
      { label: "Theming", href: "#theming" },
      { label: "Build Plugins", href: "#plugins" },
    ],
  },
  {
    title: "More",
    items: [{ label: "Examples", href: "#examples" }],
  },
];

export function Sidebar({
  activeSection,
  onNavClick,
}: {
  activeSection: string;
  onNavClick: () => void;
}) {
  return (
    <Nav>
      <LogoArea>
        <LogoText>Seams</LogoText>
        <LogoTagline>CSS-in-JS for RSC</LogoTagline>
      </LogoArea>
      {navSections.map((section) => (
        <div key={section.title}>
          <SectionLabel>{section.title}</SectionLabel>
          {section.items.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              active={activeSection === item.href.slice(1)}
              onClick={onNavClick}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      ))}
    </Nav>
  );
}
