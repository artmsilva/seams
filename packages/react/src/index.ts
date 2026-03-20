// Re-export everything from core
export * from "@artmsilva/seams-core";

// Override createStitches with React version
export { createStitches } from "./createStitches.js";
export type { Seams, Stitches } from "./createStitches.js";

// Export styled function
export { createStyledFunction } from "./features/styled.js";
export type {
  StyledComponent,
  StyledComponentProps,
  StyledConfig,
  StyledFn,
} from "./features/styled.js";
