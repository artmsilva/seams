/**
 * Resolves selectors from parent selectors and nested selectors.
 *
 * Handles the `&` nesting character, replacing it with the parent selector.
 * If the parent selector contains combinators and the nested selector has multiple `&`,
 * wraps the parent in `:is()` to maintain specificity.
 */
export const toResolvedSelectors = (
  /** Parent selectors (e.g. `["a", "button"]`). */
  parentSelectors: string[],
  /** Nested selectors (e.g. `["&:hover", "&:focus"]`). */
  nestedSelectors: string[],
): string[] =>
  parentSelectors.length
    ? parentSelectors.reduce<string[]>((resolvedSelectors, parentSelector) => {
        resolvedSelectors.push(
          ...nestedSelectors.map((selector) =>
            selector.includes("&")
              ? selector.replace(
                  /&/g,
                  // If parent has combinators and selector has multiple &, wrap in :is()
                  /[ +>|~]/.test(parentSelector) && /&.*&/.test(selector)
                    ? `:is(${parentSelector})`
                    : parentSelector,
                )
              : parentSelector + " " + selector,
          ),
        );

        return resolvedSelectors;
      }, [])
    : nestedSelectors;
