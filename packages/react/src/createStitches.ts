import { createStitches as createStitchesCore } from "@artmsilva/seams-core";
import type { CreateStitchesConfig, Seams as SeamsCore } from "@artmsilva/seams-core";

import { createStyledFunction } from "./features/styled.js";
import type { StyledFn } from "./features/styled.js";

/**
 * Extended Seams instance with React-specific features.
 */
export interface Seams extends SeamsCore {
  /** Create styled React components */
  styled: StyledFn;
}

/** @deprecated Use `Seams` instead */
export type Stitches = Seams;

/**
 * Creates a new Seams instance with React support.
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
export const createStitches = (init?: CreateStitchesConfig): Seams => {
  const instance = createStitchesCore(init) as Seams;

  instance.styled = createStyledFunction(instance);

  return instance;
};
