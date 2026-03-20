import React from "react";

import { createCssFunction, createMemo, internal } from "@artmsilva/seams-core";
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

// CSS is now collected per-component via RenderResult.cssText from the core css() function.

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

        const {
          props: forwardProps,
          deferredInjector,
          cssText,
          className: renderedClassName,
        } = cssComponent(props);

        if (!shouldForwardAs) {
          delete forwardProps["as"];
        }

        forwardProps["ref"] = ref;

        const element = React.createElement(Type as React.ElementType, forwardProps);

        // Use rendered className (includes css prop hash) for unique href.
        // This ensures each unique css prop gets its own <style> tag.
        const styleHref = `seams-${renderedClassName.replace(/\s+/g, "-")}`;

        // React 19 <style href precedence>: hoists to <head>, deduplicates
        // by href, blocks rendering until processed. Works in RSC without JS.
        const children: React.ReactNode[] = [];

        // 1. Layer order declaration (deduplicated — same href from every component)
        children.push(
          React.createElement("style", {
            key: "seams-order",
            href: "seams-layer-order",
            precedence: "seams-00-order",
            children: sheet.getLayerOrder(),
          }),
        );

        // 2. Theme CSS variables (deduplicated — stable href across all components)
        const themedRules = sheet.rules.themed.rules;
        if (themedRules.length > 0) {
          children.push(
            React.createElement("style", {
              key: "seams-themed",
              href: "seams-themed",
              precedence: "seams-01-themed",
              children: `@layer seams.themed{${themedRules.join("")}}`,
            }),
          );
        }

        // 3. Global styles (deduplicated — stable href across all components)
        const globalRules = sheet.rules.global.rules;
        if (globalRules.length > 0) {
          children.push(
            React.createElement("style", {
              key: "seams-global",
              href: "seams-global",
              precedence: "seams-02-global",
              children: `@layer seams.global{${globalRules.join("")}}`,
            }),
          );
        }

        // 4. This component's own CSS (unique href per render — includes css prop hash)
        if (cssText) {
          children.push(
            React.createElement("style", {
              key: styleHref,
              href: styleHref,
              precedence: "seams-03-styled",
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
