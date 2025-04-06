/**
 * TypeScript declaration file for JSX
 * This provides compatibility between Deno and React
 */

import React from "react";

// Make React available globally to help with JSX
declare global {
  const React: typeof import("react");

  namespace JSX {
    // Define the Element interface
    interface Element extends
      React.ReactElement<
        unknown,
        string | React.JSXElementConstructor<unknown>
      > {}

    // Define Intrinsic Elements for common HTML elements
    interface IntrinsicElements {
      // Basic HTML elements
      div: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >;
      span: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLSpanElement>,
        HTMLSpanElement
      >;
      p: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLParagraphElement>,
        HTMLParagraphElement
      >;
      a: React.DetailedHTMLProps<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
      >;
      button: React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >;
      input: React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >;
      h1: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;
      h2: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;
      h3: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;
      h4: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;
      h5: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;
      h6: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >;

      // Handle all other elements
      [elemName: string]: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }

    // Define fragment support
    interface ElementChildrenAttribute {
      children: React.ReactNode;
    }
  }
}

// Specific badge component props to handle key
declare module "@/components/ui/badge.tsx" {
  export interface BadgeProps {
    key?: string | number;
    variant?: string;
    className?: string;
    children?: React.ReactNode;
  }
}

export {};
