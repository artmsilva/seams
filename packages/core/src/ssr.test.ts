/**
 * SSR / React Server Component compatibility tests.
 *
 * These tests run in Node.js (no DOM) to verify that Seams works
 * correctly in server environments where document is undefined.
 * This validates the RSC and SSR code paths.
 */
import { describe, it, expect, beforeEach } from "vite-plus/test";

import { createStitches } from "./createStitches.js";

describe("SSR / RSC compatibility", () => {
  let stitches: ReturnType<typeof createStitches>;

  beforeEach(() => {
    stitches = createStitches({
      prefix: "ssr",
      theme: {
        colors: {
          primary: "#0070f3",
          secondary: "#ff0080",
          background: "#ffffff",
          text: "#000000",
        },
        space: {
          1: "4px",
          2: "8px",
          3: "16px",
        },
        fonts: {
          body: "system-ui, sans-serif",
        },
        radii: {
          sm: "4px",
          md: "8px",
        },
      },
      media: {
        sm: "(min-width: 640px)",
        md: "(min-width: 768px)",
        lg: "(min-width: 1024px)",
      },
    });
  });

  describe("getCssText() produces valid CSS on the server", () => {
    it("returns theme CSS variables", () => {
      const cssText = stitches.getCssText();
      expect(cssText).toContain("--ssr-colors-primary");
      expect(cssText).toContain("#0070f3");
    });

    it("returns styled component CSS", () => {
      const button = stitches.css({
        backgroundColor: "$primary",
        padding: "$2",
        borderRadius: "$sm",
        fontFamily: "$body",
      });
      button();

      const cssText = stitches.getCssText();
      expect(cssText).toContain("background-color:var(--ssr-colors-primary)");
      expect(cssText).toContain("padding:var(--ssr-space-2)");
      expect(cssText).toContain("border-radius:var(--ssr-radii-sm)");
    });

    it("returns variant CSS", () => {
      const button = stitches.css({
        padding: "$1",
        variants: {
          size: {
            sm: { padding: "$1" },
            lg: { padding: "$3" },
          },
          color: {
            primary: { backgroundColor: "$primary" },
            secondary: { backgroundColor: "$secondary" },
          },
        },
      });
      button({ size: "lg", color: "primary" });

      const cssText = stitches.getCssText();
      expect(cssText).toContain("padding:var(--ssr-space-3)");
      expect(cssText).toContain("background-color:var(--ssr-colors-primary)");
    });

    it("returns compound variant CSS", () => {
      const button = stitches.css({
        variants: {
          size: {
            sm: {},
            lg: {},
          },
          color: {
            primary: {},
          },
        },
        compoundVariants: [
          {
            size: "lg",
            color: "primary",
            css: { fontWeight: "bold" },
          },
        ],
      });
      button({ size: "lg", color: "primary" });

      const cssText = stitches.getCssText();
      expect(cssText).toContain("font-weight:bold");
    });

    it("returns globalCss styles", () => {
      const applyGlobalStyles = stitches.globalCss({
        "*, *::before, *::after": {
          boxSizing: "border-box",
        },
        body: {
          margin: 0,
          fontFamily: "$body",
          backgroundColor: "$background",
          color: "$text",
        },
      });
      applyGlobalStyles();

      const cssText = stitches.getCssText();
      expect(cssText).toContain("box-sizing:border-box");
      expect(cssText).toContain("margin:0");
      expect(cssText).toContain("font-family:var(--ssr-fonts-body)");
      expect(cssText).toContain("background-color:var(--ssr-colors-background)");
    });

    it("returns keyframes CSS", () => {
      const fadeIn = stitches.keyframes({
        "0%": { opacity: 0, transform: "translateY(10px)" },
        "100%": { opacity: 1, transform: "translateY(0)" },
      });

      // Keyframes are lazily emitted — access .name to trigger
      const name = fadeIn.name;

      const cssText = stitches.getCssText();
      expect(cssText).toContain("@keyframes");
      expect(cssText).toContain(name);
      expect(cssText).toContain("opacity:0");
      expect(cssText).toContain("translateY(10px)");
    });

    it("returns createTheme CSS variables", () => {
      const darkTheme = stitches.createTheme("dark", {
        colors: {
          primary: "#79b8ff",
          background: "#0a0f1e",
          text: "#e0e0e0",
        },
      });

      // Access className to trigger lazy theme CSS emission
      const className = darkTheme.className;

      const cssText = stitches.getCssText();
      expect(cssText).toContain(className);
      expect(cssText).toContain("#79b8ff");
      expect(cssText).toContain("#0a0f1e");
    });
  });

  describe("class names are deterministic on the server", () => {
    it("generates the same class name for the same styles", () => {
      const a = stitches.css({ backgroundColor: "red" });
      const b = stitches.css({ backgroundColor: "red" });
      expect(a.className).toBe(b.className);
    });

    it("generates different class names for different styles", () => {
      const a = stitches.css({ backgroundColor: "red" });
      const b = stitches.css({ backgroundColor: "blue" });
      expect(a.className).not.toBe(b.className);
    });

    it("includes prefix in class names", () => {
      const button = stitches.css({ backgroundColor: "red" });
      expect(button.className).toContain("ssr");
    });
  });

  describe("toString() can be embedded in HTML", () => {
    it("produces embeddable CSS string", () => {
      stitches.css({ color: "$primary", padding: "$2" })();
      stitches.globalCss({ body: { margin: 0 } })();

      const cssText = stitches.toString();
      expect(cssText).toBeTruthy();
      // Should not contain any HTML-breaking characters
      expect(cssText).not.toContain("<script");
      expect(cssText).not.toContain("</style");
    });

    it("getCssText() and toString() return the same value", () => {
      stitches.css({ color: "red" })();
      expect(stitches.getCssText()).toBe(stitches.toString());
    });
  });

  describe("css prop works on the server", () => {
    it("generates inline override CSS", () => {
      const box = stitches.css({ padding: "$1" });
      const result = box({ css: { padding: "$3", color: "$primary" } });

      expect(result.className).toBeTruthy();
      const cssText = stitches.getCssText();
      expect(cssText).toContain("padding:var(--ssr-space-3)");
      expect(cssText).toContain("color:var(--ssr-colors-primary)");
    });
  });

  describe("responsive variants work on the server", () => {
    it("generates media query CSS for responsive variants", () => {
      const box = stitches.css({
        variants: {
          size: {
            sm: { width: "100px" },
            lg: { width: "200px" },
          },
        },
      });
      box({ size: { "@initial": "sm", "@sm": "lg" } });

      const cssText = stitches.getCssText();
      expect(cssText).toContain("width:100px");
      expect(cssText).toContain("width:200px");
      expect(cssText).toContain("min-width: 640px");
    });
  });

  describe("reset() clears server-collected CSS", () => {
    it("clears all collected CSS", () => {
      stitches.css({ color: "red" })();
      stitches.globalCss({ body: { margin: 0 } })();

      const before = stitches.getCssText();
      expect(before).toContain("color:red");

      stitches.reset();

      const after = stitches.getCssText();
      expect(after).not.toContain("color:red");
      expect(after).not.toContain("margin:0");
    });
  });

  describe("multiple instances are isolated on the server", () => {
    it("does not leak styles between instances", () => {
      const instance1 = createStitches({ prefix: "a" });
      const instance2 = createStitches({ prefix: "b" });

      instance1.css({ color: "red" })();
      instance2.css({ color: "blue" })();

      const css1 = instance1.getCssText();
      const css2 = instance2.getCssText();

      expect(css1).toContain("color:red");
      expect(css1).not.toContain("color:blue");
      expect(css2).toContain("color:blue");
      expect(css2).not.toContain("color:red");
    });
  });
});
