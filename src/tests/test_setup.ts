import { DOMParser, Element, Node, Text } from "deno_dom";

let setupDone = false;

export function setupDOM() {
  if (setupDone) {
    return; // Avoid setting up multiple times
  }

  // deno_dom setup: Create a basic HTML structure
  const parser = new DOMParser();
  const doc = parser.parseFromString(
    "<!DOCTYPE html><html><head></head><body></body></html>",
    "text/html",
  );

  // Assign necessary globals
  // @ts-ignore: Polyfilling global document for tests
  globalThis.document = doc;
  // @ts-ignore: Polyfilling global window for tests
  globalThis.window = globalThis; // deno_dom often relies on globalThis as window context
  // @ts-ignore: Polyfilling global Element for tests
  globalThis.Element = Element;
  // @ts-ignore: Polyfilling global Node for tests
  globalThis.Node = Node;
  // @ts-ignore: Polyfilling global Text for tests
  globalThis.Text = Text;
  // Add other potentially necessary globals based on library needs
  // @ts-ignore: Polyfilling global HTMLElement for tests
  globalThis.HTMLElement = Element;
  // @ts-ignore: Polyfilling global SVGElement for tests
  globalThis.SVGElement = Element;
  // @ts-ignore: Polyfilling global HTMLInputElement for tests
  globalThis.HTMLInputElement = Element;
  // @ts-ignore: Polyfilling global HTMLButtonElement for tests
  globalThis.HTMLButtonElement = Element;
  // @ts-ignore: Polyfilling global HTMLAnchorElement for tests
  globalThis.HTMLAnchorElement = Element;
  // @ts-ignore: Polyfilling global Event for tests
  globalThis.Event = class Event {
    constructor() {}
  };
  // @ts-ignore: Polyfilling global CustomEvent for tests
  globalThis.CustomEvent = class CustomEvent extends Event {
    constructor() {
      super();
    }
  };

  // Mock requestAnimationFrame and getComputedStyle if needed by RTL/React
  // @ts-ignore: Polyfilling global requestAnimationFrame for tests
  globalThis.requestAnimationFrame = (
    callback: FrameRequestCallback,
  ): number => {
    return setTimeout(callback, 0);
  };
  // @ts-ignore: Polyfilling global cancelAnimationFrame for tests
  globalThis.cancelAnimationFrame = (handle: number): void => {
    clearTimeout(handle);
  };
  // @ts-ignore: Polyfilling global getComputedStyle for tests
  globalThis.getComputedStyle = (_elt: Element): CSSStyleDeclaration => {
    // Basic mock, might need more sophisticated implementation
    return {
      /* return minimal style properties if needed */
    } as CSSStyleDeclaration;
  };

  console.log("deno_dom setup complete via setupDOM().");
  setupDone = true;
}

// Optional cleanup (less common with deno_dom)
// export function cleanupDOM() { ... }
