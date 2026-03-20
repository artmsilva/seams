import { describe, it, expect } from "vite-plus/test";

import { toHash } from "./toHash.js";

describe("toHash", () => {
  it("generates consistent hashes for the same input", () => {
    const input = { color: "red", padding: "10px" };
    const hash1 = toHash(input);
    const hash2 = toHash(input);

    expect(hash1).toBe(hash2);
  });

  it("generates different hashes for different inputs", () => {
    const hash1 = toHash({ color: "red" });
    const hash2 = toHash({ color: "blue" });

    expect(hash1).not.toBe(hash2);
  });

  it("generates alphabetic-only hashes", () => {
    const hash = toHash({ test: "value" });

    expect(hash).toMatch(/^[a-zA-Z]+$/);
  });

  it("handles empty objects", () => {
    const hash = toHash({});

    expect(hash).toBeTruthy();
    expect(typeof hash).toBe("string");
  });

  it("handles complex nested objects", () => {
    const hash = toHash({
      variants: {
        size: {
          sm: { padding: "4px" },
          lg: { padding: "16px" },
        },
      },
      compoundVariants: [{ size: "sm", css: { fontSize: "12px" } }],
    });

    expect(hash).toBeTruthy();
    expect(hash).toMatch(/^[a-zA-Z]+$/);
  });

  it("generates compact hashes", () => {
    const hash = toHash({ color: "red" });

    // Hashes should be reasonably short
    expect(hash.length).toBeLessThan(10);
  });
});
