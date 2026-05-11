/**
 * JSX Runtime type declarations for Deno React
 */

import React from "react";

declare namespace JSX {
  interface Element extends
    React.ReactElement<
      unknown,
      string | React.JSXElementConstructor<unknown>
    > {}

  function jsx(
    type: string | React.JSXElementConstructor<unknown>,
    props: Record<string, unknown>,
    key?: string | number,
  ): JSX.Element;

  function jsxs(
    type: string | React.JSXElementConstructor<unknown>,
    props: Record<string, unknown>,
    key?: string | number,
  ): JSX.Element;
}

declare module "react/jsx-runtime" {
  export namespace JSX {
    interface Element extends React.JSX.Element {}
    interface ElementClass extends React.JSX.ElementClass {}
    interface ElementAttributesProperty
      extends React.JSX.ElementAttributesProperty {}
    interface ElementChildrenAttribute
      extends React.JSX.ElementChildrenAttribute {}
    interface IntrinsicAttributes extends React.JSX.IntrinsicAttributes {}
    interface IntrinsicClassAttributes<T>
      extends React.JSX.IntrinsicClassAttributes<T> {}
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
  }

  export const Fragment: React.ExoticComponent<{ children?: React.ReactNode }>;

  export function jsx(
    type: React.ElementType,
    props: unknown,
    key?: React.Key,
  ): React.ReactElement;
  export function jsxs(
    type: React.ElementType,
    props: unknown,
    key?: React.Key,
  ): React.ReactElement;
}

declare module "npm:react/jsx-runtime" {
  export * from "react/jsx-runtime";
}

export {};
