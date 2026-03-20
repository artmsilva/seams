const mqunit = /([\d.]+)([^]*)/;

/**
 * Polyfills Media Query Level 4 range syntax to Level 3 syntax.
 *
 * Converts:
 * - `(width >= 768px)` → `(min-width: 768px)`
 * - `(width < 1024px)` → `(max-width: 1023.9375px)`
 * - `(768px <= width < 1024px)` → `(min-width: 768px) and (max-width: 1023.9375px)`
 */
export const toResolvedMediaQueryRanges = (media: string): string =>
  media.replace(
    /\(\s*([\w-]+)\s*(=|<|<=|>|>=)\s*([\w-]+)\s*(?:(<|<=|>|>=)\s*([\w-]+)\s*)?\)/g,
    (
      __,
      /** 1st param, either the name or value in the query. */
      p1: string,
      /** 1st operator. */
      o1: string,
      /** 2nd param, either the name or value in the query. */
      p2: string,
      /** Optional 2nd operator. */
      o2: string | undefined,
      /** Optional 3rd param, always a value in the query. */
      p3: string | undefined,
    ) => {
      /** Whether the first param is a value. */
      const isP1Value = mqunit.test(p1);

      /** Numeric shift applied to a value when an operator is `<` or `>`. */
      const shift = 0.0625 * (isP1Value ? -1 : 1);

      const [name, value] = isP1Value ? [p2, p1] : [p1, p2];

      return (
        "(" +
        (o1[0] === "=" ? "" : (o1[0] === ">") === isP1Value ? "max-" : "min-") +
        name +
        ":" +
        (o1[0] !== "=" && o1.length === 1
          ? value.replace(
              mqunit,
              (_, v: string, u: string) => String(Number(v) + shift * (o1 === ">" ? 1 : -1)) + u,
            )
          : value) +
        (o2 && p3
          ? ") and (" +
            (o2[0] === ">" ? "min-" : "max-") +
            name +
            ":" +
            (o2.length === 1
              ? p3.replace(
                  mqunit,
                  (_, v: string, u: string) =>
                    String(Number(v) + shift * (o2 === ">" ? -1 : 1)) + u,
                )
              : p3)
          : "") +
        ")"
      );
    },
  );
