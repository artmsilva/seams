import { useState, useEffect, useCallback } from "react";
import { applyGlobalStyles } from "./globalStyles";
import { lightTheme } from "./seams.config";
import { Layout } from "./components/Layout";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Hero } from "./sections/Hero";
import { GettingStarted } from "./sections/GettingStarted";
import { ApiReference } from "./sections/ApiReference";
import { Theming } from "./sections/Theming";
import { Plugins } from "./sections/Plugins";
import { LitIntegration } from "./sections/LitIntegration";
import { Examples } from "./sections/Examples";

applyGlobalStyles();

const sectionIds = [
  "hero",
  "getting-started",
  "installation",
  "quick-start",
  "api-create-stitches",
  "api-styled",
  "api-css",
  "api-global-css",
  "api-keyframes",
  "api-create-theme",
  "api-get-css-text",
  "theming",
  "plugins",
  "lit-integration",
  "examples",
];

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Track active section via Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const handleNavClick = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const themeClass = isDark ? undefined : lightTheme.className;

  return (
    <div className={themeClass}>
      <Layout
        sidebar={<Sidebar activeSection={activeSection} onNavClick={handleNavClick} />}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      >
        <Header isDark={isDark} onToggleTheme={() => setIsDark((prev) => !prev)} />
        <Hero />
        <GettingStarted />
        <ApiReference />
        <Theming />
        <Plugins />
        <LitIntegration />
        <Examples />
      </Layout>
    </div>
  );
}
