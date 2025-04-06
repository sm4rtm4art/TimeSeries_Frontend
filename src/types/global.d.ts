import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >;
      a: React.DetailedHTMLProps<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
      >;
      p: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLParagraphElement>,
        HTMLParagraphElement
      >;
      span: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLSpanElement>,
        HTMLSpanElement
      >;
      button: React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >;
      // Add other HTML elements as needed
    }
  }
}

// Fix BadgeProps type
declare module "@/components/ui/badge.tsx" {
  interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    key?: string | number;
    variant?: "default" | "secondary" | "destructive" | "outline";
    className?: string;
  }
}

// Make sure Deno types are available for tests
declare namespace Deno {
  function test(name: string, fn: () => void | Promise<void>): void;
}

export {};
