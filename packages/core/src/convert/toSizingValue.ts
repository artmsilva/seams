import { toHyphenCase } from "./toHyphenCase.js";

/**
 * CSS properties whose values may include sizing keywords.
 */
const sizeProps: Record<string, 1> = {
  blockSize: 1,
  height: 1,
  inlineSize: 1,
  maxBlockSize: 1,
  maxHeight: 1,
  maxInlineSize: 1,
  maxWidth: 1,
  minBlockSize: 1,
  minHeight: 1,
  minInlineSize: 1,
  minWidth: 1,
  width: 1,
};

/**
 * Returns a declaration sizing value with polyfilled sizing keywords.
 * Handles `fit-content` and `stretch` with vendor prefixes for compatibility.
 */
export const toSizingValue = (declarationName: string, declarationValue: string): string =>
  declarationName in sizeProps && typeof declarationValue === "string"
    ? declarationValue.replace(
        /^((?:[^]*[^\w-])?)(fit-content|stretch)((?:[^\w-][^]*)?)$/,
        (_, lead: string, main: string, tail: string) =>
          lead +
          (main === "stretch"
            ? `-moz-available${tail};${toHyphenCase(declarationName)}:${lead}-webkit-fill-available`
            : `-moz-fit-content${tail};${toHyphenCase(declarationName)}:${lead}fit-content`) +
          tail,
      )
    : String(declarationValue);
