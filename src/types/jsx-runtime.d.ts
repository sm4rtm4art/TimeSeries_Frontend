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
    interface Element extends
      React.ReactElement<
        unknown,
        string | React.JSXElementConstructor<unknown>
      > {}

    export function jsx(
      type: string | React.JSXElementConstructor<unknown>,
      props: Record<string, unknown>,
      key?: string | number,
    ): JSX.Element;

    export function jsxs(
      type: string | React.JSXElementConstructor<unknown>,
      props: Record<string, unknown>,
      key?: string | number,
    ): JSX.Element;
  }
}

export {};
