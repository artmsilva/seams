import type { CSSObject } from "./css.js";
import type { Prefixed, Widen } from "./util.js";

/**
 * Unique symbol used to reference the type of a Styled Component.
 */
export declare const $$StyledComponentType: unique symbol;
export type $$StyledComponentType = typeof $$StyledComponentType;

/**
 * Unique symbol used to reference the props of a Styled Component.
 */
export declare const $$StyledComponentProps: unique symbol;
export type $$StyledComponentProps = typeof $$StyledComponentProps;

/**
 * Unique symbol used to reference the media passed into a Styled Component.
 */
export declare const $$StyledComponentMedia: unique symbol;
export type $$StyledComponentMedia = typeof $$StyledComponentMedia;

/**
 * Transform props to allow responsive values.
 */
export type TransformProps<Props, Media> = {
  [K in keyof Props]?:
    | Props[K]
    | ({
        [KMedia in Prefixed<"@", "initial" | keyof Media>]?: Props[K];
      } & {
        [KMedia in string]?: Props[K];
      });
};

/**
 * A CSS Component created by the css() function.
 */
export interface CssComponent<Type = "span", Props = object, Media = object, CSS = CSSObject> {
  (
    props?: TransformProps<Props, Media> & {
      css?: CSS;
      className?: string;
    } & {
      [name in number | string]: unknown;
    },
  ): string & {
    className: string;
    selector: string;
    props: object;
  };

  className: string;
  selector: string;

  [$$StyledComponentType]: Type;
  [$$StyledComponentProps]: Props;
  [$$StyledComponentMedia]: Media;
}

/**
 * Returns the first Styled Component type from the given array of compositions.
 */
export type StyledComponentType<T extends unknown[]> = T[0] extends never
  ? "span"
  : T[0] extends string
    ? T[0]
    : T[0] extends (props: unknown) => unknown
      ? T[0]
      : T[0] extends { [$$StyledComponentType]: unknown }
        ? T[0][$$StyledComponentType]
        : T extends [lead: unknown, ...tail: infer V]
          ? StyledComponentType<V>
          : never;

/**
 * Returns the cumulative variants from the given array of compositions.
 */
export type StyledComponentProps<T extends unknown[]> = ($$StyledComponentProps extends keyof T[0]
  ? T[0][$$StyledComponentProps]
  : T[0] extends { variants: { [name: string]: unknown } }
    ? {
        [K in keyof T[0]["variants"]]?: Widen<keyof T[0]["variants"][K]>;
      }
    : object) &
  (T extends [lead: unknown, ...tail: infer V] ? StyledComponentProps<V> : object);

/**
 * Extract variant props from a styled component.
 */
export type VariantProps<Component extends { [$$StyledComponentProps]: unknown }> =
  Component[$$StyledComponentProps];
