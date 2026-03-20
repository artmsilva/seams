import { createStitches as createStitchesCore } from "@stitches-rsc/core";
import type { CreateStitchesConfig, Stitches as StitchesCore } from "@stitches-rsc/core";

import { createStyledFunction } from "./features/styled.js";
import type { StyledFn } from "./features/styled.js";

/**
 * Extended Stitches instance with React-specific features.
 */
export interface Stitches extends StitchesCore {
  /** Create styled React components */
  styled: StyledFn;
}

/**
 * Creates a new Stitches instance with React support.
 *
 * @example
 * ```tsx
 * const { styled, css, globalCss, keyframes, createTheme, theme } = createStitches({
 *   prefix: 'my-app',
 *   theme: {
 *     colors: {
 *       primary: '#0070f3',
 *     },
 *   },
 * });
 *
 * const Button = styled('button', {
 *   backgroundColor: '$primary',
 *   padding: '$2 $4',
 *   variants: {
 *     size: {
 *       sm: { fontSize: '14px' },
 *       lg: { fontSize: '18px' },
 *     },
 *   },
 * });
 *
 * // Usage
 * <Button size="lg">Click me</Button>
 * ```
 */
export const createStitches = (init?: CreateStitchesConfig): Stitches => {
  const instance = createStitchesCore(init) as Stitches;

  instance.styled = createStyledFunction(instance);

  return instance;
};
