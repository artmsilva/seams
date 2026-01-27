import React from 'react';

import {
  createCssFunction,
  createMemo,
  internal,
} from '@stitches-rsc/core';
import type {
  ComponentConfig,
  CssComponent,
  CssFn,
  Sheet,
  StitchesConfig,
  StyleConfig,
} from '@stitches-rsc/core';

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
  config: StitchesConfig;
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
 * Creates the styled function for React components.
 * Returns a function that creates styled React components with ref forwarding.
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

      // Filter args to match what cssFunction expects
      const cssComponent = css(
        ...(args as Array<string | CssComponent | StyleConfig | null | undefined>),
      );

      const internalData = cssComponent[internal];
      const DefaultType = internalData.type as T;
      const shouldForwardAs = shouldForwardStitchesProp?.('as');

      const styledComponent = React.forwardRef<unknown, StyledComponentProps>(
        (props, ref) => {
          const Type =
            props?.['as'] && !shouldForwardAs ? (props['as'] as React.ElementType) : DefaultType;

          const { props: forwardProps, deferredInjector } = cssComponent(props);

          if (!shouldForwardAs) {
            delete forwardProps['as'];
          }

          forwardProps['ref'] = ref;

          if (deferredInjector) {
            return React.createElement(
              React.Fragment,
              null,
              React.createElement(Type as React.ElementType, forwardProps),
              React.createElement(deferredInjector, null),
            );
          }

          return React.createElement(Type as React.ElementType, forwardProps);
        },
      );

      const toString = () => cssComponent.selector;

      // Type-safe property assignment
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
