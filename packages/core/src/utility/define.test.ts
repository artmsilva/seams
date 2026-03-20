import { describe, it, expect } from "vite-plus/test";

import { define } from "./define.js";

describe("define", () => {
  it("copies string properties", () => {
    const target = {};
    define(target, { a: 1, b: 2 });
    expect(target).toEqual({ a: 1, b: 2 });
  });

  it("copies Symbol properties", () => {
    const sym = Symbol.for("test.symbol");
    const target = {} as Record<symbol, unknown>;
    define(target, { [sym]: { type: "div", data: 42 } });
    expect(target[sym]).toEqual({ type: "div", data: 42 });
  });

  it("copies both string and Symbol properties together", () => {
    const sym = Symbol.for("test.internal");
    const target = {} as Record<string | symbol, unknown>;
    define(target, {
      className: "c-abc123",
      [sym]: { type: "button" },
    });
    expect(target["className"]).toBe("c-abc123");
    expect(target[sym]).toEqual({ type: "button" });
  });

  it("preserves Symbol properties from the sxs.internal symbol", () => {
    const internal = Symbol.for("sxs.internal");
    const render = (() => {}) as Record<string | symbol, unknown>;
    define(render, {
      className: "c-test",
      selector: ".c-test",
      [internal]: { type: "div", variants: {} },
    });
    expect(render[internal]).toBeDefined();
    expect((render[internal] as { type: string }).type).toBe("div");
  });
});
