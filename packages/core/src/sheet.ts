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
  'themed',
  'global',
  'styled',
  'onevar',
  'resonevar',
  'allvar',
  'inline',
] as const;

export type RuleGroupName = (typeof ruleGroupNames)[number];

/**
 * A rule group that collects CSS rules.
 */
export interface RuleGroup {
  cache: Set<string>;
  rules: string[];
  apply: (cssText: string) => void;
}

/**
 * Sheet interface for collecting CSS rules.
 */
export interface Sheet {
  rules: Record<RuleGroupName, RuleGroup>;
  reset: () => void;
  toString: () => string;
}

/**
 * Creates a rule group for collecting CSS.
 */
const createRuleGroup = (): RuleGroup => {
  const rules: string[] = [];
  const cache = new Set<string>();

  return {
    cache,
    rules,
    apply(cssText: string) {
      rules.push(cssText);
    },
  };
};

/**
 * Creates a sheet for collecting CSS rules.
 * This is a zero-runtime implementation that collects CSS rather than injecting into DOM.
 */
export const createSheet = (): Sheet => {
  const rules = {} as Record<RuleGroupName, RuleGroup>;

  const reset = () => {
    for (const name of ruleGroupNames) {
      rules[name] = createRuleGroup();
    }
  };

  const toString = (): string => {
    const parts: string[] = [];

    for (const name of ruleGroupNames) {
      const group = rules[name];
      if (group && group.rules.length > 0) {
        // Add marker for hydration
        parts.push(`--sxs{--sxs:${ruleGroupNames.indexOf(name)} ${[...group.cache].join(' ')}}`);
        parts.push(`@media{${group.rules.join('')}}`);
      }
    }

    return parts.join('');
  };

  reset();

  return {
    rules,
    reset,
    toString,
  };
};

/**
 * Creates a deferred rules injector for React component composition.
 * When a stitches component extends another React component,
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
