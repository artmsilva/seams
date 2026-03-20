import { describe, it, expect, beforeEach } from "vite-plus/test";

import { createStitches } from "@artmsilva/seams-core";
import type { Seams } from "@artmsilva/seams-core";

describe("SeamsController", () => {
  let stitches: Seams;

  beforeEach(() => {
    stitches = createStitches({
      prefix: "test",
      theme: {
        colors: {
          primary: "#0070f3",
          secondary: "#ff0080",
        },
        space: {
          1: "4px",
          2: "8px",
          3: "16px",
        },
      },
    });
  });

  describe("CSS generation for Lit integration", () => {
    it("generates CSS text from Seams instance", () => {
      const button = stitches.css({
        backgroundColor: "$primary",
        padding: "$2",
      });

      // Trigger CSS generation
      button();

      const cssText = stitches.getCssText();
      expect(cssText).toContain("background-color");
      expect(cssText).toContain("padding");
    });

    it("generates variant CSS that can be adopted into shadow DOM", () => {
      const button = stitches.css({
        backgroundColor: "gray",
        variants: {
          size: {
            sm: { padding: "4px" },
            lg: { padding: "16px" },
          },
          color: {
            primary: { backgroundColor: "blue" },
            secondary: { backgroundColor: "green" },
          },
        },
      });

      // Render with specific variants to trigger CSS generation
      const smPrimary = button({ size: "sm", color: "primary" });
      const lgSecondary = button({ size: "lg", color: "secondary" });

      expect(smPrimary.className).toBeTruthy();
      expect(lgSecondary.className).toBeTruthy();

      const cssText = stitches.getCssText();
      expect(cssText).toContain("padding:4px");
      expect(cssText).toContain("padding:16px");
      expect(cssText).toContain("background-color:blue");
      expect(cssText).toContain("background-color:green");
    });

    it("generates compound variant CSS", () => {
      const button = stitches.css({
        variants: {
          color: {
            primary: { backgroundColor: "blue" },
            secondary: { backgroundColor: "green" },
          },
          outlined: {
            true: { background: "transparent" },
            false: {},
          },
        },
        compoundVariants: [
          {
            color: "primary",
            outlined: "true",
            css: { border: "2px solid blue" },
          },
        ],
      });

      button({ color: "primary", outlined: "true" });

      const cssText = stitches.getCssText();
      expect(cssText).toContain("border:2px solid blue");
    });

    it("tracks rule count changes across rule groups", () => {
      const getRuleCount = () => {
        let count = 0;
        for (const name of [
          "themed",
          "global",
          "styled",
          "onevar",
          "resonevar",
          "allvar",
          "inline",
        ] as const) {
          count += stitches.sheet.rules[name].rules.length;
        }
        return count;
      };

      const initialCount = getRuleCount();

      // Create and render a component to inject styled rules
      const box = stitches.css({ display: "flex" });
      box();

      const afterStyledCount = getRuleCount();
      expect(afterStyledCount).toBeGreaterThan(initialCount);

      // Add global styles
      const globalStyles = stitches.globalCss({
        body: { margin: 0 },
      });
      globalStyles();

      const afterGlobalCount = getRuleCount();
      expect(afterGlobalCount).toBeGreaterThan(afterStyledCount);
    });

    it("resets and regenerates CSS correctly", () => {
      const button = stitches.css({
        backgroundColor: "red",
      });

      button();
      const firstCss = stitches.getCssText();
      expect(firstCss).toContain("background-color:red");

      stitches.reset();
      const afterReset = stitches.getCssText();

      // After reset, the styled rules should be cleared
      expect(afterReset).not.toContain("background-color:red");
    });

    it("generates CSS with token references resolved", () => {
      const card = stitches.css({
        backgroundColor: "$primary",
        padding: "$2",
      });

      card();

      const cssText = stitches.getCssText();
      // Token references should be resolved to CSS custom properties
      expect(cssText).toContain("var(--test-colors-primary)");
      expect(cssText).toContain("var(--test-space-2)");
    });

    it("includes theme CSS custom property definitions", () => {
      const cssText = stitches.getCssText();

      // Theme should define CSS custom properties
      expect(cssText).toContain("--test-colors-primary:#0070f3");
      expect(cssText).toContain("--test-colors-secondary:#ff0080");
      expect(cssText).toContain("--test-space-1:4px");
      expect(cssText).toContain("--test-space-2:8px");
      expect(cssText).toContain("--test-space-3:16px");
    });

    it("renders unique class names per component", () => {
      const box = stitches.css({ display: "flex" });
      const card = stitches.css({ display: "grid" });

      const boxResult = box();
      const cardResult = card();

      expect(boxResult.className).not.toBe(cardResult.className);
    });

    it("supports css prop for inline overrides in shadow DOM", () => {
      const box = stitches.css({ display: "flex" });

      const result = box({ css: { color: "red" } });

      expect(result.className).toBeTruthy();

      const cssText = stitches.getCssText();
      expect(cssText).toContain("color:red");
    });
  });

  describe("keyframes for shadow DOM", () => {
    it("generates keyframe CSS that can be adopted", () => {
      const fadeIn = stitches.keyframes({
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      });

      // Accessing .name triggers the lazy render of keyframes CSS
      const name = fadeIn.name;
      expect(name).toBeTruthy();

      const cssText = stitches.getCssText();
      expect(cssText).toContain("@keyframes");
      expect(cssText).toContain("opacity:0");
      expect(cssText).toContain("opacity:1");

      // The keyframes name should be usable in component styles
      const box = stitches.css({
        animation: `${name} 1s ease-in`,
      });

      box();

      const fullCssText = stitches.getCssText();
      expect(fullCssText).toContain("animation");
    });
  });

  describe("globalCss for shadow DOM", () => {
    it("generates global CSS that can be adopted into shadow roots", () => {
      const globalStyles = stitches.globalCss({
        ":host": {
          display: "block",
        },
      });

      globalStyles();

      const cssText = stitches.getCssText();
      expect(cssText).toContain(":host");
      expect(cssText).toContain("display:block");
    });
  });
});
