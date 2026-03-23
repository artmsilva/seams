import { describe, it, expect, beforeEach } from "vite-plus/test";

import { createStitches } from "./createStitches.js";
import { internal } from "./utility/internal.js";

describe("createStitches", () => {
  it("creates a Seams instance", () => {
    const stitches = createStitches();

    expect(stitches).toBeDefined();
    expect(stitches.css).toBeTypeOf("function");
    expect(stitches.globalCss).toBeTypeOf("function");
    expect(stitches.keyframes).toBeTypeOf("function");
    expect(stitches.createTheme).toBeTypeOf("function");
    expect(stitches.getCssText).toBeTypeOf("function");
    expect(stitches.reset).toBeTypeOf("function");
  });

  it("accepts configuration", () => {
    const stitches = createStitches({
      prefix: "my-app",
      theme: {
        colors: {
          primary: "#0070f3",
        },
      },
      media: {
        sm: "(min-width: 640px)",
      },
    });

    expect(stitches.prefix).toBe("my-app");
    expect(stitches.config.prefix).toBe("my-app");
    expect(stitches.config.media.sm).toBe("(min-width: 640px)");
  });

  describe("css()", () => {
    let stitches: ReturnType<typeof createStitches>;

    beforeEach(() => {
      stitches = createStitches({
        theme: {
          colors: {
            primary: "#0070f3",
          },
          space: {
            1: "4px",
            2: "8px",
          },
        },
      });
    });

    it("creates a CSS component", () => {
      const button = stitches.css({
        backgroundColor: "red",
        padding: "10px",
      });

      expect(button).toBeTypeOf("function");
      expect(button.className).toBeTruthy();
      expect(button.selector).toBeTruthy();
    });

    it("renders class names", () => {
      const button = stitches.css({
        backgroundColor: "red",
      });

      const result = button();

      expect(result.className).toBeTruthy();
      expect(result.className).toContain(button.className);
    });

    it("supports variants", () => {
      const button = stitches.css({
        backgroundColor: "gray",
        variants: {
          color: {
            primary: { backgroundColor: "blue" },
            secondary: { backgroundColor: "green" },
          },
          size: {
            sm: { padding: "4px" },
            lg: { padding: "16px" },
          },
        },
      });

      const result = button({ color: "primary", size: "lg" });

      expect(result.className).toBeTruthy();
    });

    it("supports default variants", () => {
      const button = stitches.css({
        variants: {
          size: {
            sm: { padding: "4px" },
            lg: { padding: "16px" },
          },
        },
        defaultVariants: {
          size: "sm",
        },
      });

      const result = button();

      expect(result.className).toBeTruthy();
    });

    it("supports compound variants", () => {
      const button = stitches.css({
        variants: {
          color: {
            primary: {},
            secondary: {},
          },
          outlined: {
            true: {},
            false: {},
          },
        },
        compoundVariants: [
          {
            color: "primary",
            outlined: "true",
            css: { border: "1px solid blue" },
          },
        ],
      });

      const result = button({ color: "primary", outlined: "true" });

      expect(result.className).toBeTruthy();
    });

    it("supports css prop", () => {
      const button = stitches.css({
        backgroundColor: "gray",
      });

      const result = button({ css: { color: "white" } });

      expect(result.className).toBeTruthy();
    });

    it("merges external classNames", () => {
      const button = stitches.css({
        backgroundColor: "gray",
      });

      const result = button({ className: "custom-class" });

      expect(result.className).toContain("custom-class");
    });

    it("supports withConfig", () => {
      const button = stitches.css.withConfig({
        displayName: "Button",
      })({
        backgroundColor: "blue",
      });

      expect(button.className).toContain("Button");
    });
  });

  describe("globalCss()", () => {
    it("creates global styles", () => {
      const stitches = createStitches();

      const globalStyles = stitches.globalCss({
        "*": {
          margin: 0,
          padding: 0,
        },
        body: {
          fontFamily: "sans-serif",
        },
      });

      expect(globalStyles).toBeTypeOf("function");
      globalStyles();

      const cssText = stitches.getCssText();
      expect(cssText).toContain("margin:0");
    });
  });

  describe("keyframes()", () => {
    it("creates keyframe animations", () => {
      const stitches = createStitches();

      const fadeIn = stitches.keyframes({
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      });

      expect(fadeIn).toBeTypeOf("function");
      expect(fadeIn.name).toBeTruthy();

      const cssText = stitches.getCssText();
      expect(cssText).toContain("@keyframes");
      expect(cssText).toContain("opacity:0");
      expect(cssText).toContain("opacity:1");
    });
  });

  describe("createTheme()", () => {
    it("creates a theme", () => {
      const stitches = createStitches({
        theme: {
          colors: {
            primary: "#0070f3",
          },
        },
      });

      const darkTheme = stitches.createTheme({
        colors: {
          primary: "#79b8ff",
        },
      });

      expect(darkTheme.className).toBeTruthy();
      expect(darkTheme.selector).toBeTruthy();
      expect(darkTheme.colors.primary).toBeDefined();
    });

    it("creates a named theme", () => {
      const stitches = createStitches({
        theme: {
          colors: {
            primary: "#0070f3",
          },
        },
      });

      const darkTheme = stitches.createTheme("dark", {
        colors: {
          primary: "#79b8ff",
        },
      });

      expect(darkTheme.className).toBe("dark");
    });
  });

  describe("getCssText()", () => {
    it("returns generated CSS", () => {
      const stitches = createStitches({
        theme: {
          colors: {
            primary: "#0070f3",
          },
        },
      });

      stitches.css({ backgroundColor: "$primary" })();

      const cssText = stitches.getCssText();

      expect(cssText).toBeTruthy();
      expect(cssText).toContain("background-color");
    });
  });

  describe("reset()", () => {
    it("resets the stylesheet", () => {
      const stitches = createStitches();

      stitches.css({ backgroundColor: "red" })();
      const beforeReset = stitches.getCssText();

      stitches.reset();
      const afterReset = stitches.getCssText();

      expect(beforeReset).not.toBe(afterReset);
    });
  });

  describe("composition", () => {
    it("inherits element type and base styles from a composed component", () => {
      const { css, getCssText } = createStitches();

      const base = css("article", { padding: "10px", color: "red" });
      const composed = css(base, { fontWeight: "bold" });

      // Inherits the element type from the base
      expect(composed[internal].type).toBe("article");

      // Gets both base and composed composers
      expect(composed[internal].composers.size).toBe(2);

      // Renders with both class names
      const result = composed();
      expect(result.className).toContain(base.className);

      // CSS contains rules from both components
      const cssText = getCssText();
      expect(cssText).toContain("padding:10px");
      expect(cssText).toContain("font-weight:bold");
    });

    it("activates variants from both base and composed components", () => {
      const { css, getCssText } = createStitches();

      const base = css({
        variants: {
          color: {
            red: { color: "red" },
            blue: { color: "blue" },
          },
        },
      });

      const composed = css(base, {
        variants: {
          size: {
            sm: { fontSize: "12px" },
            lg: { fontSize: "24px" },
          },
        },
      });

      // Activating both variant axes works
      const result = composed({ color: "red", size: "lg" });
      expect(result.className).toBeTruthy();

      const cssText = getCssText();
      expect(cssText).toContain("color:red");
      expect(cssText).toContain("font-size:24px");
    });

    it("supports multi-level composition (A → B → C)", () => {
      const { css, getCssText } = createStitches();

      const a = css("section", { margin: "4px" });
      const b = css(a, { padding: "8px" });
      const c = css(b, { border: "1px solid black" });

      // C inherits the element type from A through B
      expect(c[internal].type).toBe("section");

      // C has composers from all three levels
      expect(c[internal].composers.size).toBe(3);

      // Rendering C produces class names from all three
      const result = c();
      expect(result.className).toContain(a.className);
      expect(result.className).toContain(b.className);

      const cssText = getCssText();
      expect(cssText).toContain("margin:4px");
      expect(cssText).toContain("padding:8px");
      expect(cssText).toContain("border:1px solid black");
    });

    it("wraps a plain component without inheriting composers", () => {
      const { css } = createStitches();

      // Simulate a plain React component (function, no [internal])
      const PlainComponent = () => null;

      const wrapped = css(PlainComponent as never, { color: "green" });

      // Uses the plain component as the element type
      expect(wrapped[internal].type).toBe(PlainComponent);

      // Only has its own composer — no style inheritance from PlainComponent
      expect(wrapped[internal].composers.size).toBe(1);
    });
  });
});
