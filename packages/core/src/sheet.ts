/**
 * Rule group names in the order they appear in the sheet:
 * 1. themed - Theme CSS custom properties
 * 2. global - Global styles
 * 3. styled - Component base styles
 * 4. onevar - Non-responsive variant styles
 * 5. resonevar - Responsive variant styles
 * 6. allvar - Compound variant styles
 * 7. inline - Inline css prop styles
 */
export const ruleGroupNames = [
  "themed",
  "global",
  "styled",
  "onevar",
  "resonevar",
  "allvar",
  "inline",
] as const;

export type RuleGroupName = (typeof ruleGroupNames)[number];

/** The prefix used for CSS @layer names. */
const LAYER_PREFIX = "seams";

/**
 * A rule group that collects CSS rules.
 */
export interface RuleGroup {
  cache: Set<string>;
  rules: string[];
  apply: (cssText: string) => void;
}

/** A snapshot of rule counts per group, used for incremental CSS collection. */
export type SheetSnapshot = Record<RuleGroupName, number>;

/**
 * Sheet interface for collecting CSS rules.
 */
export interface Sheet {
  rules: Record<RuleGroupName, RuleGroup>;
  reset: () => void;
  toString: () => string;
  /** Get the @layer order declaration CSS. */
  getLayerOrder: () => string;
  /** Get all CSS wrapped in @layer blocks, suitable for embedding in HTML. */
  getLayeredCss: () => string;
  /** Take a snapshot of current rule counts (for incremental CSS collection). */
  snapshot: () => SheetSnapshot;
  /** Get only CSS added since a snapshot, wrapped in @layer blocks. */
  getCssSince: (snap: SheetSnapshot) => string;
}

/** Whether we're in a browser environment with DOM access. */
const isBrowser = typeof document !== "undefined" && typeof document.createElement === "function";

/** Whether the @layer order declaration has been injected. */
let layerOrderInjected = false;

/**
 * Injects the @layer order declaration into the document head.
 * This must come before any layer content to establish cascade order.
 */
const injectLayerOrder = (): void => {
  if (!isBrowser || layerOrderInjected) return;
  // Skip if React 19 already hoisted the layer order
  if (document.querySelector('style[data-href="seams-layer-order"]')) {
    layerOrderInjected = true;
    return;
  }
  layerOrderInjected = true;

  const el = document.createElement("style");
  el.id = "seams-layers";
  el.setAttribute("data-seams", "layers");
  el.setAttribute("data-seams-source", "runtime");
  const layerNames = ruleGroupNames.map((n) => `${LAYER_PREFIX}.${n}`).join(", ");
  el.textContent = `@layer ${layerNames};`;
  const firstStyle = document.head.querySelector("style");
  if (firstStyle) {
    document.head.insertBefore(el, firstStyle);
  } else {
    document.head.appendChild(el);
  }
};

/**
 * Mapping from rule group names to their React 19 hoisted style href values.
 * Used to detect if a group's CSS is already handled by React 19 style hoisting.
 */
const REACT_HOISTED_HREFS: Partial<Record<RuleGroupName, string>> = {
  themed: "seams-themed",
  global: "seams-global",
};

/**
 * Gets or creates the <style> element for a given rule group.
 * Returns null if the group's CSS is already handled by React 19 style hoisting
 * (i.e., a <style data-href="seams-themed"> already exists in <head>).
 * For groups without React hoisting (styled, onevar, etc.), creates runtime tags.
 */
const getStyleElement = (name: RuleGroupName): HTMLStyleElement | null => {
  if (!isBrowser) return null;

  // Skip runtime injection for groups already handled by React 19 hoisting
  const hoistedHref = REACT_HOISTED_HREFS[name];
  if (hoistedHref && document.querySelector(`style[data-href="${hoistedHref}"]`)) {
    return null;
  }

  // Ensure layer order is declared first
  injectLayerOrder();

  const id = `seams-${name}`;
  let el = document.querySelector<HTMLStyleElement>(`style[data-seams="${name}"]`);
  if (!el) {
    el = document.createElement("style");
    el.setAttribute("data-seams", name);
    el.setAttribute("data-seams-source", "runtime");
    el.id = id;
    document.head.appendChild(el);
  }
  return el;
};

/**
 * Creates a rule group for collecting CSS.
 * In browser environments, rules are wrapped in @layer and injected into the DOM.
 */
const createRuleGroup = (name: RuleGroupName): RuleGroup => {
  const rules: string[] = [];
  const cache = new Set<string>();
  const styleEl = getStyleElement(name);
  const layerName = `${LAYER_PREFIX}.${name}`;

  return {
    cache,
    rules,
    apply(cssText: string) {
      rules.push(cssText);
      // Inject into DOM wrapped in @layer
      if (styleEl) {
        styleEl.textContent = `@layer ${layerName}{${rules.join("")}}`;
      }
    },
  };
};

/**
 * Creates a sheet for collecting CSS rules.
 * In browser environments, CSS is injected into the DOM via <style> tags
 * wrapped in @layer for cascade control.
 * In server environments, CSS is collected in memory for getCssText()/toString().
 */
export const createSheet = (): Sheet => {
  const rules = {} as Record<RuleGroupName, RuleGroup>;

  const reset = () => {
    for (const name of ruleGroupNames) {
      rules[name] = createRuleGroup(name);
    }
  };

  const toString = (): string => {
    const parts: string[] = [];

    for (const name of ruleGroupNames) {
      const group = rules[name];
      if (group && group.rules.length > 0) {
        // Add marker for hydration
        parts.push(
          `--seams{--seams:${ruleGroupNames.indexOf(name)} ${[...group.cache].join(" ")}}`,
        );
        parts.push(`@media{${group.rules.join("")}}`);
      }
    }

    return parts.join("");
  };

  const getLayerOrder = (): string => {
    return `@layer ${ruleGroupNames.map((n) => `${LAYER_PREFIX}.${n}`).join(", ")};`;
  };

  const getLayeredCss = (): string => {
    const parts: string[] = [getLayerOrder()];
    for (const name of ruleGroupNames) {
      const group = rules[name];
      if (group && group.rules.length > 0) {
        parts.push(`@layer ${LAYER_PREFIX}.${name}{${group.rules.join("")}}`);
      }
    }
    return parts.join("");
  };

  const snapshot = (): SheetSnapshot => {
    const snap = {} as SheetSnapshot;
    for (const name of ruleGroupNames) {
      snap[name] = rules[name].rules.length;
    }
    return snap;
  };

  const getCssSince = (snap: SheetSnapshot): string => {
    const parts: string[] = [];
    for (const name of ruleGroupNames) {
      const group = rules[name];
      const startIndex = snap[name] || 0;
      if (group && group.rules.length > startIndex) {
        const newRules = group.rules.slice(startIndex);
        parts.push(`@layer ${LAYER_PREFIX}.${name}{${newRules.join("")}}`);
      }
    }
    return parts.join("");
  };

  reset();

  return {
    rules,
    reset,
    toString,
    getLayerOrder,
    getLayeredCss,
    snapshot,
    getCssSince,
  };
};

/**
 * Creates a deferred rules injector for React component composition.
 * When a Seams component extends another React component,
 * this ensures wrapper styles are injected after the wrapped component.
 */
export const createRulesInjectionDeferrer = (
  globalSheet: Sheet,
): {
  (): null;
  rules: Record<RuleGroupName, { apply: (rule: string) => void }>;
} => {
  const pendingRules: Array<[RuleGroupName, string]> = [];

  const injector = (): null => {
    for (const [sheetName, cssString] of pendingRules) {
      globalSheet.rules[sheetName].apply(cssString);
    }
    pendingRules.length = 0;
    return null;
  };

  injector.rules = {} as Record<RuleGroupName, { apply: (rule: string) => void }>;

  for (const sheetName of ruleGroupNames) {
    injector.rules[sheetName] = {
      apply: (rule: string) => {
        pendingRules.push([sheetName, rule]);
      },
    };
  }

  return injector;
};
