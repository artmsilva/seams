import React from "react";

import { createCssFunction, createMemo, internal, ruleGroupNames } from "@artmsilva/seams-core";
import type {
  ComponentConfig,
  CssComponent,
  CssFn,
  SeamsConfig,
  Sheet,
  StyleConfig,
} from "@artmsilva/seams-core";

const createStyledFunctionMap = createMemo<StyledFn, []>();

/**
 * Props accepted by styled components.
 */
export interface StyledComponentProps {
  /** Override the rendered element type */
  as?: React.ElementType;
  /** Additional CSS styles */
  css?: StyleConfig;
  /** Additional class names */
  className?: string;
  /** React children */
  children?: React.ReactNode;
  /** Any additional props */
  [key: string]: unknown;
}

/**
 * A styled React component.
 */
export interface StyledComponent<
  T extends React.ElementType = React.ElementType,
  P = object,
> extends React.ForwardRefExoticComponent<
  React.PropsWithoutRef<StyledComponentProps & P> & React.RefAttributes<unknown>
> {
  /** The base CSS class name */
  className: string;
  /** The display name for React DevTools */
  displayName: string;
  /** The CSS selector for this component */
  selector: string;
  /** Convert to selector string */
  toString(): string;
  /** Internal data for composition */
  [internal]: {
    type: T;
    composers: Set<unknown>;
  };
}

/**
 * Configuration for the styled function.
 */
export interface StyledConfig {
  config: SeamsConfig;
  sheet: Sheet;
}

/**
 * The styled function type.
 */
export interface StyledFn {
  <T extends React.ElementType>(
    type: T,
    ...styles: Array<StyleConfig | CssComponent | null | undefined>
  ): StyledComponent<T>;
  (...styles: Array<string | StyleConfig | CssComponent | null | undefined>): StyledComponent;
  withConfig(
    config: ComponentConfig,
  ): <T extends React.ElementType>(
    type: T,
    ...styles: Array<StyleConfig | CssComponent | null | undefined>
  ) => StyledComponent<T>;
}

/**
 * Collects all current CSS from the sheet, wrapped in @layer blocks.
 * Used to co-render <style> tags alongside components for RSC support.
 *
 * SECURITY: This CSS is generated deterministically from the library's
 * own theme config and style objects — not from user-supplied content.
 * It is safe to embed in <style> tags.
 */
const collectSheetCss = (sheet: Sheet): string => {
  const parts: string[] = [];
  for (const name of ruleGroupNames) {
    const group = sheet.rules[name];
    if (group && group.rules.length > 0) {
      parts.push(`@layer seams.${name}{${group.rules.join("")}}`);
    }
  }
  return parts.join("");
};

/**
 * Creates the styled function for React components.
 * Returns a function that creates styled React components with ref forwarding.
 *
 * In RSC/SSR contexts, each styled component co-renders a <style> tag with
 * href and precedence props. React 19 automatically hoists these to <head>,
 * deduplicates by href, and blocks rendering until styles are processed.
 * This ensures styles work without client-side JavaScript.
 */
export const createStyledFunction = ({ config, sheet }: StyledConfig): StyledFn =>
  createStyledFunctionMap(config, () => {
    const cssFunction = createCssFunction(config, sheet);

    const _styled = <T extends React.ElementType>(
      args: Array<T | string | StyleConfig | CssComponent | null | undefined>,
      css: CssFn = cssFunction,
      componentConfig: ComponentConfig = {},
    ): StyledComponent<T> => {
      const { displayName, shouldForwardStitchesProp } = componentConfig;

      const cssComponent = css(
        ...(args as Array<string | CssComponent | StyleConfig | null | undefined>),
      );

      const internalData = cssComponent[internal];
      const DefaultType = internalData.type as T;
      const shouldForwardAs = shouldForwardStitchesProp?.("as");

      const styledComponent = React.forwardRef<unknown, StyledComponentProps>((props, ref) => {
        const Type =
          props?.["as"] && !shouldForwardAs ? (props["as"] as React.ElementType) : DefaultType;

        const { props: forwardProps, deferredInjector } = cssComponent(props);

        if (!shouldForwardAs) {
          delete forwardProps["as"];
        }

        forwardProps["ref"] = ref;

        // Collect CSS for co-rendering via React 19 <style href precedence>.
        // CSS is deterministic output from the library's own style objects
        // and theme config — not user-supplied content.
        const cssText = collectSheetCss(sheet);
        const layerOrderCss = sheet.getLayerOrder();

        const element = React.createElement(Type as React.ElementType, forwardProps);

        // React 19 <style href precedence>: hoists to <head>, deduplicates
        // by href, blocks rendering until processed. Works in RSC without JS.
        const children: React.ReactNode[] = [];

        // Layer order declaration — ensures cascade ordering
        children.push(
          React.createElement("style", {
            key: "seams-order",
            href: "seams-layer-order",
            precedence: "seams-order",
            children: layerOrderCss,
          }),
        );

        // Component styles wrapped in @layer
        if (cssText) {
          children.push(
            React.createElement("style", {
              key: `seams-${cssComponent.className}`,
              href: `seams-${cssComponent.className}`,
              precedence: "seams",
              children: cssText,
            }),
          );
        }

        children.push(element);

        if (deferredInjector) {
          children.push(React.createElement(deferredInjector, { key: "seams-deferred" }));
        }

        return React.createElement(React.Fragment, null, ...children);
      });

      const toString = () => cssComponent.selector;

      const component = styledComponent as unknown as StyledComponent<T>;
      component.className = cssComponent.className;
      component.displayName =
        displayName ||
        `Styled.${
          (DefaultType as React.ComponentType)?.displayName ||
          (DefaultType as React.ComponentType)?.name ||
          String(DefaultType)
        }`;
      component.selector = cssComponent.selector;
      component.toString = toString;
      component[internal] = internalData as { type: T; composers: Set<unknown> };

      return component;
    };

    const styled = <T extends React.ElementType>(
      ...args: Array<T | string | StyleConfig | CssComponent | null | undefined>
    ) => _styled<T>(args);

    styled.withConfig =
      (componentConfig: ComponentConfig) =>
      <T extends React.ElementType>(
        ...args: Array<T | string | StyleConfig | CssComponent | null | undefined>
      ) => {
        const cssWithConfig = cssFunction.withConfig(componentConfig) as unknown as CssFn;
        return _styled<T>(args, cssWithConfig, componentConfig);
      };

    return styled as StyledFn;
  });
